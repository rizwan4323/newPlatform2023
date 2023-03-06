import React from 'react';
import toastr from 'toastr';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Loading from '../components/loading';
import webConfig from '../../webConfig';
import Popup from 'reactjs-popup';
import { GET_FULFILLMENT_CENTER_MESSAGE, SUBMIT_FULFILLMENT_CENTER_MESSAGE, GET_APPROVED_FOR_FULFILLMENT_USER } from '../queries';
import { Query, Mutation } from 'react-apollo';
import moment from 'moment';
const points = require('../../Global_Values');

const initialState = {
    text: '',
}

class MessagingCenter extends React.Component {
    constructor(props) {
        super();
        this.state = {
            ...initialState,
            selectedStoreID: null,
            selectedStoreOwner: "",
            selectedUnit: 'Metric'
        }
    }

    componentDidMount() {
        toastr.options = {
            "progressBar": true,
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut": 3000,
            "extendedTimeOut": 2000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    }

    handleChange(event){
        var value = event.target.value;
        var name = event.target.name;
        this.setState({
            [name]: value
        })
    }

    submitMessage(submitMessage){
        submitMessage().then(async ({ data }) => {
            this.setState({
                ...initialState
            }, () => {
                this.state.refetch();
                this.scrollToNewestMessage();
                document.querySelector('[name="text"]').value = "";
            })
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    displayMessage(id, name){
        this.setState({
            selectedStoreID: id,
            selectedStoreOwner: name
        }, () => {
            // update seen message to true
            this.seenMessage();
        })
    }

    seenMessage(){
        var payload = {"query":"mutation{\n  seenMessage(id:\""+this.state.selectedStoreID+"\", from: \"Admin\"){\n    id\n  }\n}","variables":null};
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(response => {
            this.state.refetch();
        });
    }

    scrollToNewestMessage(){
        setTimeout(function() {
            var x = document.querySelectorAll(".message-container > div")
            points.smoothScrollInto(x[x.length-1]);
        }, 500);
    }

    getQuote(productData, selector, refetch){
        var estimatePayload = {
            country_code: "US",
            province_code: "",
            zip: "90210",
            weight: productData.weight / 1000,
            dg_code: productData.dimension.dg_code,
            height: productData.dimension.height,
            length: productData.dimension.length,
            width: productData.dimension.width
        }
        this.fetchPOST('/getShippingFee', estimatePayload, response => {
            if(response.data.services.length != 0){
                var selectedService = null;
                response.data.services.forEach(sv => {
                    if(sv.service.toLowerCase() == productData.shipping_service.toLowerCase()){
                        selectedService = sv;
                    }
                })
                var text = `<div>
                    <strong>${document.getElementById(selector).querySelector("a").innerText}</strong> is <strong>$${productData.price}</strong><br/>
                    Shipping will cost approximately <strong>$${selectedService.shipping_methods[0].total_cost}</strong><br>
                    Will be delivered within <strong>${selectedService.transit_min}-${selectedService.transit_max} Days</strong>
                </div>`;
                var payload = {"query":"mutation ($id: String!, $text: String!, $from: String!, $isFromQuote: Boolean) { submitFulfillmentCenterMessage(id: $id, text: $text, from: $from, isFromQuote: $isFromQuote) { id __typename } } ","variables": {id: this.state.selectedStoreID, from: 'Admin', isFromQuote: true,text: text}};
                this.fetchPOST('/graphql', payload, response => {
                    refetch();
                })
            } else {
                toastr.clear();
                toastr.warning("Cannot get the estimate shipping cost check the dimension","An error has occured")
            }
        })
    }

    acceptBulkOrder(productData, selector, refetch){
        var productTitle = document.getElementById(selector).querySelector("a").innerText;
        var capitalizeTitle = "";
        productTitle.split(" ").forEach(n => {
            capitalizeTitle += n.substring(0,1).toUpperCase()+n.substring(1).toLowerCase()+" "
        })
        var quantity = document.getElementById(selector).querySelector("span").innerText;
        var vendor_link = document.getElementById(selector).querySelector("a").href;
        var stockid = document.getElementById(selector).querySelector("label") ? document.getElementById(selector).querySelector("label").innerText.trim() : null;
        var that = this;
        
        var approveOrderPayload = {
            "query":"mutation ($id: String!, $stockid: String, $chinese_description: String, $name: String!, $qty: Int!, $dimension_height: String!, $dimension_width: String!, $dimension_length: String!, $dg_code: String!, $weight: String!, $price: String!, $vendor_link: String!, $isPaid: Boolean!) { saveInventory(id: $id, stockid: $stockid, chinese_description: $chinese_description, name: $name, qty: $qty, dimension_height: $dimension_height, dimension_width: $dimension_width, dimension_length: $dimension_length, dg_code: $dg_code, weight: $weight, price: $price, vendor_link: $vendor_link, isPaid: $isPaid) { name __typename } } ",
            "variables": {
                id: this.state.selectedStoreID,
                stockid,
                chinese_description: productData.chinese_description,
                name: capitalizeTitle,
                qty: parseInt(quantity),
                dimension_height: productData.dimension.height,
                dimension_width: productData.dimension.width,
                dimension_length: productData.dimension.length,
                dg_code: productData.dimension.dg_code,
                weight: productData.weight.toString(),
                price: productData.price,
                vendor_link,
                isPaid: false
            }
        };

        this.fetchPOST('/graphql', approveOrderPayload, response => {
            if(!response.errors){
                sendResponseText();
            } else {
                toastr.clear();
                toastr.warning(response.errors[0].message,"An error has occured!");
            }
        })

        function sendResponseText(storeid){
            var text = `${quantity}x of your order ${productTitle} is accepted.`;
            var payload = {"query":"mutation ($id: String!, $text: String!, $from: String!, $isFromQuote: Boolean) { submitFulfillmentCenterMessage(id: $id, text: $text, from: $from, isFromQuote: $isFromQuote) { id __typename } } ","variables": {id: that.state.selectedStoreID, from: 'Admin', text: text}};
            that.fetchPOST('/graphql', payload, response => {
                refetch();
                toastr.clear();
                toastr.success("Order Accepted!","Success!");
            })
        }
    }

    fetchPOST(url, payload, callback){
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(result => {
            callback(result);
        });
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Messaging Center - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        var state = this.state;

        return (
            <div className="admin-messaging-center page-container">
                {this.head()}
                <Link to="/fulfillment-center-genie" style={{float: 'left', fontSize: 15}} className="dwobtn"><span className="fas fa-arrow-left" title="Back to Audience Builder"></span></Link>
                <h1 className="capitalize">&nbsp; {state.selectedStoreID ? state.selectedStoreOwner.toLowerCase()+" messages" : "Messaging Center"}</h1>
                <div className="column column_3_12" style={{overflow: 'scroll', height: '75vh'}}>
                    <div className="product-card">
                        <div className="product-details">
                            <h3>Search User</h3>
                            <div className="form_wrap">
                                <div className="form_row">
                                    <div className="form_item">
                                        <div className="form_input">
                                            <input type="text" placeholder="search by email, kartra, first name, last name" id="searchUser" />
                                            <span className="bottom_border"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form_input form_buttons">
                                    <button className="btn stretch-width" style={{padding: '5px 0'}} onClick={() => this.setState({searchUser: document.getElementById("searchUser").value})}>Search</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Query query={GET_APPROVED_FOR_FULFILLMENT_USER} variables={{search: state.searchUser}}>
                        {({ data, loading, refetch, error }) => {
                            if(loading) {
                                return (
                                    <div className="text-center">
                                        <Loading height={150} width={150} />
                                    </div>
                                );
                            }

                            state.refetch = refetch;
                            if(data.getApprovedUser.length != 0){
                                return data.getApprovedUser.map((user, user_index) => {
                                    var cn = "product-card";
                                    if(state.selectedStoreID == user.id){
                                        cn += " card-active"
                                    }
                                    return (
                                        <div className={cn} key={user_index}>
                                            <div className="product-details" style={{overflow: 'hidden'}}>
                                                <div className="column column_2_12" style={{padding: 0}}>
                                                    <div style={{backgroundImage: user.profileImage ? 'url('+webConfig.siteURL+'/user-uploads/'+user.profileImage+')' : 'url('+webConfig.siteURL+'/assets/graphics/abstract_patterns/texture.jpg'+')', height: '4.5rem', borderRadius: '50%',   backgroundSize: 'contain' }} />
                                                </div>
                                                <div className="column column_10_12 ellipsis" style={{whiteSpace: 'nowrap'}}>
                                                    <strong>{user.store_url}</strong> <br/>
                                                    {user.firstName} {user.lastName} <br/>
                                                    <div className="float-right" style={{marginTop: 5}}>
                                                        {user.hasFulfillmentMessage && <span className="fas fa-envelope" style={{color: 'red'}}></span>}
                                                        <span className="clickable" onClick={() => this.displayMessage(user.id, user.firstName+" "+user.lastName)}>
                                                            Details &nbsp;<span className="fas fa-arrow-right"></span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                });
                            } else {
                                return (
                                    <div className="text-center">
                                        <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>No Store Available</span>
                                    </div>
                                );
                            }
                        }}
                    </Query>
                </div>
                <div className="column column_9_12" style={{height: '75vh', position: 'relative'}}>
                    <div className="message-container" style={{height: '55vh', padding: 20, overflow: 'scroll', position: 'relative'}}>
                        <Query query={GET_FULFILLMENT_CENTER_MESSAGE} variables={{id: state.selectedStoreID}} >
                            {({data, loading, refetch}) => {
                                if(loading) return <div className="text-center"><Loading height={150} width={150} /></div>;

                                refetch();
                                if(data.getFulfillmentCenterMessage){
                                    const messages = data.getFulfillmentCenterMessage.messages;
                                    return messages.map((message, i) => {
                                        if(i == (messages.length-1)){
                                            this.scrollToNewestMessage();
                                        }
                                        return (
                                            <div className={message.from == "User" ? "user" : "admin"} key={i} style={{overflow: 'hidden'}}>
                                                {message.isFromQuote || message.isFromBulkQuote ?
                                                    <div>
                                                        <div className={message.from == "User" ? "column column_8_12" : "column column_12_12"}>
                                                            <div dangerouslySetInnerHTML={{__html: message.text}} id={"div_"+i} />
                                                        </div>
                                                        {message.from == "User" &&
                                                            <div className="column column_4_12">
                                                                <div className="form_wrap">
                                                                    <div className="form_row">
                                                                        <div className="form_item">
                                                                            <Popup
                                                                                trigger={
                                                                                    <div className="form_buttons text-right">
                                                                                        <button className="btn" style={{padding: 10, fontSize: 12, backgroundColor: message.isFromBulkQuote ? '#f28706' : 'auto'}} id={"btn"+i}>Set Price & Dimension</button>
                                                                                    </div>
                                                                                }
                                                                                position="left center"
                                                                                on="click" className="points-tooltip">
                                                                                <div>
                                                                                    <style dangerouslySetInnerHTML={{__html: `
                                                                                        .points-tooltip {
                                                                                            width: 310px !important;
                                                                                        }
                                                                                    `}} />
                                                                                    <div className="text-center">
                                                                                        <h3>Change Product Dimension</h3>
                                                                                    </div>
                                                                                    <div className="form_input">
                                                                                        <div className="column column_6_12">
                                                                                            <label htmlFor="metric" className="clickable">
                                                                                                <input onChange={() => this.setState({ selectedUnit: 'Metric' })} id="metric" type="radio" name="unit" checked={this.state.selectedUnit == "Metric" ? true : false} style={{width: 'auto'}} /> Metric (kg, cm)
                                                                                            </label>
                                                                                        </div>
                                                                                        <div className="column column_6_12">
                                                                                            <label htmlFor="imperial" className="clickable">
                                                                                                <input onChange={() => this.setState({ selectedUnit: 'Imperial' })} id="imperial" type="radio" name="unit" checked={this.state.selectedUnit == "Imperial" ? true : false} style={{width: 'auto'}} /> Imperial (oz, in)
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="form_input clear">
                                                                                        <div className="column column_6_12" style={{padding: '14px 3px'}}>
                                                                                            <label>Chinese Description</label>
                                                                                        </div>
                                                                                        <div className="column column_6_12" style={{position: 'relative'}}>
                                                                                            <input id={"description"+i} type="text" defaultValue={message.default_chinese_description ? message.default_chinese_description : ""} />
                                                                                            <span className="bottom_border"></span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="form_input clear">
                                                                                        <div className="column column_6_12" style={{padding: '14px 3px'}}>
                                                                                            <label>Price</label>
                                                                                        </div>
                                                                                        <div className="column column_6_12" style={{position: 'relative'}}>
                                                                                            <input id={"price"+i} type="number" defaultValue={message.default_price ? message.default_price : "0"} />
                                                                                            <span className="bottom_border"></span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="form_input clear">
                                                                                        <div className="column column_6_12" style={{padding: '14px 3px'}}>
                                                                                            <label>Weight {this.state.selectedUnit == "Metric" ? '(kg)' : '(oz)'} *</label>
                                                                                        </div>
                                                                                        <div className="column column_6_12" style={{position: 'relative'}}>
                                                                                            <input id={"grams"+i} type="number" defaultValue={message.default_weight ? message.default_weight / 1000 : "0"} />
                                                                                            <span className="bottom_border"></span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="form_input text-center">
                                                                                        <div className="column column_12_12">
                                                                                            <br/>
                                                                                            <label>Dimensions</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="form_input">
                                                                                        <div className="column column_4_12">
                                                                                            <div className="text-center" style={{padding: '20px 0 0'}}>
                                                                                                <label>Height {this.state.selectedUnit == "Metric" ? '(cm)' : '(in)'}</label>
                                                                                            </div>
                                                                                            <div style={{position: 'relative', padding: '0 5px'}}>
                                                                                                <input type="number" id={"height"+i} defaultValue={message.default_dimension_height} />
                                                                                                <span className="bottom_border"></span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="column column_4_12">
                                                                                            <div className="text-center" style={{padding: '20px 0 0'}}>
                                                                                                <label>Width {this.state.selectedUnit == "Metric" ? '(cm)' : '(in)'}</label>
                                                                                            </div>
                                                                                            <div style={{position: 'relative', padding: '0 5px'}}>
                                                                                                <input type="number" id={"width"+i} defaultValue={message.default_dimension_width} />
                                                                                                <span className="bottom_border"></span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="column column_4_12">
                                                                                            <div className="text-center" style={{padding: '20px 0 0'}}>
                                                                                                <label>Length {this.state.selectedUnit == "Metric" ? '(cm)' : '(in)'}</label>
                                                                                            </div>
                                                                                            <div style={{position: 'relative', padding: '0 5px'}}>
                                                                                                <input type="number" id={"length"+i} defaultValue={message.default_dimension_length} />
                                                                                                <span className="bottom_border"></span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="column column_12_12">
                                                                                        <br/>
                                                                                        <div className="column column_4_12" style={{padding: 12}}>
                                                                                            <label>DG Code</label>
                                                                                        </div>
                                                                                        <div className="column column_8_12">
                                                                                            <select className="dropbtn drp stretch-width dg_code" defaultValue={message.default_dg_code} id={"dg_code"+i} style={{backgroundColor: 'transparent', margin: 0}}>
                                                                                                <option value="">None</option>
                                                                                                <option value="0965">0965 - Lithium-ion Batteries Loose</option>
                                                                                                <option value="0966">0966 - Lithium-ion Batteries Packed with Equipment</option>
                                                                                                <option value="0967">0967 - Lithium-ion Batteries Contained in Equipment</option>
                                                                                                <option value="0968">0968 - Lithium metal Batteries Loose</option>
                                                                                                <option value="0969">0969 - Lithium metal Batteries Packed with Equipment</option>
                                                                                                <option value="0970">0970 - Lithium metal Batteries Contained in Equipment</option>
                                                                                                <option value="ORMD1">ORMD1 - Dry Cell Batteries</option>
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                    {message.isFromBulkQuote ?
                                                                                        <div className="column column_12_12">
                                                                                            <br/>
                                                                                            <div className="helperText clear">
                                                                                                Select the DG Code if the shipment contains dangerous goods. <br/><br/>
                                                                                                Accepting this will be etc...
                                                                                            </div>
                                                                                        </div>
                                                                                    :
                                                                                        <div className="column column_12_12">
                                                                                            <br/>
                                                                                            <div className="column column_3_12" style={{padding: 12}}>
                                                                                                <label>Shipping Service</label>
                                                                                            </div>
                                                                                            <div className="column column_9_12">
                                                                                                <select className="dropbtn drp stretch-width shipping_service" defaultValue="BoxC Post" style={{backgroundColor: 'transparent', margin: 0}}>
                                                                                                    <option value="BoxC Post">BoxC Post (10-15 Business Days)</option>
                                                                                                    <option value="BoxC Parcel">BoxC Parcel (5-10 Business Days)</option>
                                                                                                    <option value="Boxc Plus">Boxc Plus (4-9 Business Days)</option>
                                                                                                    <option value="BoxC Priority">BoxC Priority (3-6 Business Days)</option>
                                                                                                </select>
                                                                                            </div> <br/><br/><br/>
                                                                                            <div className="helperText clear">Select the DG Code if the shipment contains dangerous goods.</div>
                                                                                        </div>
                                                                                    }
                                                                                    <div className="column column_12_12 text-center">
                                                                                        <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => {
                                                                                            // computation for width, length, height, weight of the product
                                                                                            var productData = {
                                                                                                price: document.getElementById("price"+i).value,
                                                                                                weight: document.getElementById("grams"+i).value,
                                                                                                shipping_service: document.querySelector(".shipping_service") ? document.querySelector(".shipping_service").value : null,
                                                                                                dimension: {
                                                                                                    height: document.getElementById("height"+i).value,
                                                                                                    width: document.getElementById("width"+i).value,
                                                                                                    length: document.getElementById("length"+i).value,
                                                                                                    dg_code: document.getElementById("dg_code"+i).value
                                                                                                },
                                                                                                chinese_description: document.getElementById("description"+i).value
                                                                                            }
                                                                                            if(this.state.selectedUnit == "Imperial"){
                                                                                                var height = document.querySelector(".height").value;
                                                                                                var width = document.querySelector(".width").value;
                                                                                                var length = document.querySelector(".length").value;
                                                                                                productData.dimension = {
                                                                                                    height: height ? parseFloat(height) * 2.54 : '', // convert height inc to cm
                                                                                                    width: width ? parseFloat(width) * 2.54 : '', // convert height inc to cm
                                                                                                    length: length ? parseFloat(length) * 2.54 : '', // convert height inc to cm
                                                                                                }
                                                                                                productData.weight = parseFloat(productData.weight) / 35.274;
                                                                                            } else {
                                                                                                productData.weight = parseFloat(productData.weight) * 1000;
                                                                                            }
                                                                                            // end computation for width, length, height, weight of the product
                                                                                            if(message.isFromBulkQuote){
                                                                                                this.acceptBulkOrder(productData, "div_"+i, refetch);
                                                                                            } else {
                                                                                                this.getQuote(productData, "div_"+i, refetch);
                                                                                            }
                                                                                            document.getElementById("btn"+i).click();
                                                                                        }}>
                                                                                            <i className="fas fa-check"></i>
                                                                                        </button>
                                                                                        &nbsp; | &nbsp;
                                                                                        <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20}} onClick={() => document.getElementById(idGrams).click()}>
                                                                                            <i className="fas fa-times"></i>
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </Popup>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                :
                                                    <div>
                                                        {message.text} <br/> <br/>
                                                    </div>
                                                }
                                                <span className="clear">{moment(new Date(parseInt(message.date)).toISOString()).startOf('second').fromNow()}</span>
                                            </div>
                                        );
                                    })
                                }
                                
                                return (
                                    <div style={{position: 'absolute', bottom: 0}} className="text-center stretch-width">
                                        <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>{state.selectedStoreID ? "No message yet start conversation by hitting submit button below." : "Select Conversation to display." }</span>
                                    </div>
                                );
                            }}
                        </Query>
                    </div>
                    <div className="input-container stretch-width" style={{position: 'absolute', bottom: 0, minHeight: '19vh'}}>
                        <div className="column column_10_12" style={{height: '100%', padding: 10}}>
                            <textarea rows="6" className="message-area stretch-width" name="text" onBlur={event => this.handleChange(event)} defaultValue={state.text}>
                            </textarea>
                        </div>
                        <div className="column column_2_12" style={{padding: '45px 0'}}>
                            <div className="form_buttons text-center">
                                <Mutation
                                    mutation={SUBMIT_FULFILLMENT_CENTER_MESSAGE}
                                    variables={{
                                        id: state.selectedStoreID,
                                        text: state.text,
                                        from: 'Admin',
                                        isFromQuote: false }}
                                    >
                                    {(submitMessage, { data, loading, error }) => {
                                        return <button className="btn" disabled={!state.selectedStoreID} onClick={() => this.submitMessage(submitMessage)}>Submit</button>;
                                    }}
                                </Mutation>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(MessagingCenter);