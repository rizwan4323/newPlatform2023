import React from 'react';
import ReactDOM from 'react-dom';
import toastr from 'toastr';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import Loading from '../components/loading';
import Popup from 'reactjs-popup';
import { SUBMIT_FULFILLMENT_CENTER_MESSAGE, GET_BULK_QUOTE, REDUCE_FULFILLMENT_CREDIT } from '../queries';
import { Query, Mutation } from 'react-apollo';
const globalValues = require('../../Global_Values');

class FulfillmentBulkOrder extends React.Component {
    constructor() {
        super();
        this.state = {
            // quote
            productName: '',
            productImage: '',
            productVendorLink: '',
            productQty: 20,
            timeOut: null,
            minimumBulkOrder: 20,
            totalPayment: 0,
            orders: []
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
            "timeOut": 0,
            "extendedTimeOut": 0,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    }

    handleOnChange(event, isSearchProduct){
        var name = event.target.name;
        var value = event.target.value;
        if(!isSearchProduct){
            this.setState({
                [name]: value
            });
        } else {
            this.setState({
                [name]: value
            }, () => {
                clearTimeout(this.state.timeOut)
                this.setState({
                    timeOut: setTimeout(() => {
                        this.searchProduct();
                    }, 500)
                })
            })
        }
    }

    searchProduct(){
        var data = {
            queryKey: this.state.productName,
            domainlink: this.props.session.getCurrentUser.store_url,
            store_token:  this.props.session.getCurrentUser.store_token
        }
        fetch(globalValues.apiServer+'/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            this.showResults(result);
        });
    }
    
    showResults(data){
        var s_result = data;
        ReactDOM.unmountComponentAtNode(document.getElementById('productResult'));
        //document.getElementById('productResult').innerHTML = "";
        var x = [];
        s_result.data.products.edges.forEach((pr,i) => {
            try{
                x.push((
                    <li className="list-group-item search-result" id={pr.node.id.replace("gid://shopify/Product/", "")} onClick={event => this.selectSearch(pr.node.title, pr.node.metafield ? pr.node.metafield.value : '', pr.node.images.edges.length > 0 ? pr.node.images.edges[0].node.originalSrc : '', event)} key={'li'+i} >
                        <img src={pr.node.images.edges.length > 0 ? pr.node.images.edges[0].node.originalSrc : ''} width="40" key={'img'+i} />{pr.node.title}
                    </li>
                ));
            } catch (error) {console.log(error);}
        });
        ReactDOM.render(x, document.getElementById('productResult'));
    }

    selectSearch(productName, vendorLink, image, event) {
        document.getElementById('productSearch').value = document.getElementById(event.target.id).innerText;
        document.querySelector('[name="productVendorLink"]').value = vendorLink;
        this.setState({
            productName: productName,
            productVendorLink: vendorLink,
            productImage: image
        })
        ReactDOM.unmountComponentAtNode(document.getElementById('productResult'));
    }

    submitMessage(submitMessage, isRestock){
        if(isRestock || this.state.productName && this.state.productVendorLink && this.state.productQty){
            if(this.state.productQty >= this.state.minimumBulkOrder){
                submitMessage().then(async ({ data }) => {
                    document.querySelector('[name="productName"]').value = "";
                    document.querySelector('[name="productVendorLink"]').value = "";
                    this.setState({
                        productName: '',
                        productVendorLink: '',
                        productImage: '',
                        productQty: this.state.minimumBulkOrder
                    }, () => {
                        toastr.clear();
                        toastr.success("Please wait the admin to accept your orders.","Success");
                    })
                }).catch(error => {
                    console.error("ERR =>", error);
                });
            } else {
                toastr.clear();
                toastr.warning("Cannot bulk order with less than "+this.state.minimumBulkOrder+".","Minimum of "+this.state.minimumBulkOrder+" is required")
            }
        } else {
            toastr.clear();
            toastr.warning("Product Name, vendor link, quantity is required.","Required!")
        }
    }

    onPaymentSuccess(success){
        var pendingData = 0;
        var successData = 0;
        this.state.orders.forEach(data => {
            pendingData += 1;
            
            var payload = {
                "query":"mutation ($id: String!, $qty: Int, $stockid: String, $orderid: String, $isPaid: Boolean) { saveInventory(id: $id, qty: $qty, stockid: $stockid, orderid: $orderid, isPaid: $isPaid) { name __typename } } ",
                "variables": {
                    id: this.props.session.getCurrentUser.id,
                    qty: data.qty,
                    stockid: data.stockid,
                    orderid: data.id,
                    isPaid: true
                }
            };
    
            this.fetchPOST('/graphql', payload, response => {
                successData += 1;
                if(pendingData == successData){
                    this.inventoryRefetch();
                    this.pendingRefetch();
                    toastr.clear();
                    toastr.success("Restock Success!","");
                }
            })
        })
    }

    onPaymentError(error){
        console.log(error);
    }

    // function for reducing the fulfillment credits
    reduceCredits(reduceCredits){
        reduceCredits().then(({ data }) => {
            this.onPaymentSuccess();
            document.getElementById("paynow").click();
            toastr.clear();
            toastr.success("Restock Success!","");
            this.props.refetch();
        }).catch(error => {
            console.error("ERR =>", error);
        });
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

    render() {
        var state = this.state;

        return (
            <div>
                <div className="text-center">
                    <h3>Virtual Warehouse</h3>
                </div>
                <div className="form_wrap">
                    <div className="form_row">
                        <div className="form_item">
                            <div className="column column_8_12">
                                {/* Bulk Quote */}
                                <div className="product-card">
                                    <div className="product-details" style={{display: 'flow-root'}}>
                                        <h4 style={{margin: 0}}>Bulk Quote</h4>
                                        <div className="column column_5_12">
                                            <div className="form_input">
                                                <label>Search Product Name</label>
                                                <input type="text" name="productName" id="productSearch" value={state.productName} onChange={event => this.handleOnChange(event, true)} />
                                                <div className="error" id="error-product-id"></div>
                                                <ul className="list-group" id="productResult">
                                                </ul>
                                                <span className="bottom_border"></span>
                                            </div>
                                        </div>
                                        <div className="column column_5_12">
                                            <div className="form_input">
                                                <label>Vendor Link</label>
                                                <input type="text" name="productVendorLink" value={state.productVendorLink} onChange={event => this.handleOnChange(event)} />
                                                <span className="bottom_border"></span>
                                            </div>
                                        </div>
                                        <div className="column column_2_12">
                                            <div className="form_input">
                                                <label>Qty (min. {state.minimumBulkOrder})</label>
                                                <input type="number" name="productQty" value={state.productQty} onChange={event => this.handleOnChange(event)} />
                                                <span className="bottom_border"></span>
                                            </div>
                                        </div>
                                        <div className="column column_12_12 form_buttons text-center">
                                            <br />
                                            <Mutation
                                                mutation={SUBMIT_FULFILLMENT_CENTER_MESSAGE}
                                                variables={{
                                                    id: this.props.session.getCurrentUser.id,
                                                    text: `<div style="display: flex; align-items: center;">
                                                        <img src="${state.productImage}" width="50px" height="50px">
                                                        <div style="padding: 5px;">
                                                            Hi, Can I get a quotation from this product: <br>
                                                            <a href="${state.productVendorLink}" target="_blank">${state.productName}</a> <br/>
                                                            Quantity: <span style="float: none; font-size: inherit;">${state.productQty}</span>
                                                        </div>
                                                    </div>`,
                                                    from: 'User',
                                                    isFromQuote: false,
                                                    isFromBulkQuote: true
                                                }}
                                            >
                                                {(submitMessage, { data, loading, error }) => {
                                                    return <button className="btn" onClick={() => this.submitMessage(submitMessage)}>Request Bulk Quote</button>;
                                                }}
                                            </Mutation>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Inventory List */}
                                <div className="product-card">
                                    <div className="product-details" style={{ display: 'flow-root' }}>
                                        <h4 style={{ margin: 0 }}>Inventory List</h4>
                                        <div className="table-container">
                                            <table className="table-list">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Product Name</th>
                                                        <th>Variant</th>
                                                        <th>Price</th>
                                                        <th>Quantity</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <Query query={GET_BULK_QUOTE} variables={{id: this.props.session.getCurrentUser.id, isPaid: true}}>
                                                        {({ data, loading, refetch, error }) => {
                                                            if(loading){
                                                                return (
                                                                    <tr>
                                                                        <td colSpan="6" className="text-center">
                                                                            <Loading height={150} width={150} />
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }

                                                            this.inventoryRefetch = refetch;
                                                            
                                                            if(data.getVirtualInventory.length == 0){
                                                                return (
                                                                    <tr>
                                                                        <td colSpan="6" className="text-center">
                                                                            <span className="no-result">No inventory found!</span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }

                                                            return data.getVirtualInventory.map((order, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{index+1}</td>
                                                                        <td>{order.name}</td>
                                                                        <td>N/A</td>
                                                                        <td>${order.price}</td>
                                                                        <td className="text-center">{order.qty}x</td>
                                                                        <td className="text-center">
                                                                            <Popup
                                                                                trigger={<button className="dwobtn" id={"restock"+index} style={{ margin: 0 }}>Restock</button>}
                                                                                position="top center"
                                                                                on="click" className="points-tooltip">
                                                                                <div className="helperText" style={{lineHeight: 1.5}}>
                                                                                    <div className="form_wrap">
                                                                                        <div className="form_row">
                                                                                            <div className="form_item">
                                                                                                <div className="form_input">
                                                                                                    <label>Enter Quantity</label>
                                                                                                    <input type="text" name="productQty" value={state.productQty} onChange={event => this.handleOnChange(event)} />
                                                                                                    <span className="bottom_border"></span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <Mutation
                                                                                        mutation={SUBMIT_FULFILLMENT_CENTER_MESSAGE}
                                                                                        variables={{
                                                                                            id: this.props.session.getCurrentUser.id,
                                                                                            text: `<div style="display: flex; align-items: center;">
                                                                                                <div style="padding: 5px;">
                                                                                                    Hi, Can I get more stock from this product: <br>
                                                                                                    <a href="${order.vendor_link}" target="_blank">${order.name}</a> <br/>
                                                                                                    Quantity: <span style="float: none; font-size: inherit;">${state.productQty}</span>
                                                                                                    <label style="display: none">${order.id}</label>
                                                                                                </div>
                                                                                            </div>`,
                                                                                            from: 'User',
                                                                                            isFromQuote: false,
                                                                                            isFromBulkQuote: true,
                                                                                            defaults: JSON.stringify({
                                                                                                chinese_description: order.chinese_description,
                                                                                                weight: order.weight,
                                                                                                dg_code: order.dg_code,
                                                                                                dimension_height: order.dimension_height,
                                                                                                dimension_width: order.dimension_width,
                                                                                                dimension_length: order.dimension_length,
                                                                                                price: order.price
                                                                                            })
                                                                                        }} >
                                                                                        {(submitMessage, { data, loading, error }) => {
                                                                                            return (
                                                                                                <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => {
                                                                                                    this.submitMessage(submitMessage, true);
                                                                                                    document.getElementById("restock"+index).click();
                                                                                                }}>
                                                                                                    <i className="fas fa-check"></i>
                                                                                                </button>
                                                                                            );
                                                                                        }}
                                                                                    </Mutation>
                                                                                    &nbsp; | &nbsp;
                                                                                    <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20}} onClick={() => document.getElementById("restock"+index).click()}>
                                                                                        <i className="fas fa-times"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </Popup>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })
                                                        }}
                                                    </Query>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="column column_4_12">
                                <div className="product-card">
                                    <div className="product-details" style={{display: 'flow-root'}}>
                                        <h4 style={{margin: 0}}>Pending Payment</h4>
                                        {state.totalPayment != 0 &&
                                            <div className="column column_6_12">
                                                <span>Total Payment: ${state.totalPayment}</span>
                                            </div>
                                        }
                                        {state.totalPayment != 0 &&
                                            <div className="column column_6_12">
                                                {!this.props.dev ?
                                                    <PaypalExpressBtn env={"sandbox"} client={globalValues.paypalClient} currency={'USD'} total={state.totalPayment} onError={this.onPaymentError.bind(this)} onSuccess={this.onPaymentSuccess.bind(this)} />
                                                :
                                                    <div className="form_buttons text-right">
                                                        {this.props.session.getCurrentUser.plg_balance >= state.totalPayment ?
                                                            <Popup
                                                                trigger={<button className="btn" id="paynow" style={{padding: '5px 10px'}}>Pay Now</button>}
                                                                position="left center"
                                                                on="click" className="points-tooltip">
                                                                <div className="text-center">
                                                                    <h6 style={{ lineHeight: 1.2, color: "#000", fontSize: '2rem' }}>Your credit will be reduced <br/> by ${state.totalPayment.toFixed(2)} are you sure?</h6>
                                                                    <Mutation
                                                                        mutation={REDUCE_FULFILLMENT_CREDIT}
                                                                        variables={{
                                                                            id: this.props.session.getCurrentUser.id,
                                                                            cost: parseFloat(state.totalPayment)
                                                                        }}>
                                                                        {(reduceCredits, { data, loading, error }) => {
                                                                            return (
                                                                                <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20 }} onClick={() => this.reduceCredits(reduceCredits)} disabled={loading}>
                                                                                    <i className="fas fa-check"></i>
                                                                                </button>
                                                                            );
                                                                        }}
                                                                    </Mutation>
                                                                    &nbsp; | &nbsp;
                                                                    <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20 }} onClick={() => document.getElementById("paynow").click()}>
                                                                        <i className="fas fa-times"></i>
                                                                    </button>
                                                                </div>
                                                            </Popup>
                                                        :
                                                            <span style={{padding: '5px 10px', border: '1px solid #3dac51', fontSize: 12}}>Please add Credit</span>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        }
                                        <div className="table-container column column_12_12" style={{marginTop: 10}}>
                                            <table className="table-list">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Product Info</th>
                                                        <th>Qty</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <Query query={GET_BULK_QUOTE} variables={{id: this.props.session.getCurrentUser.id, isPaid: false}} onCompleted={data => {
                                                        var totalPayment = 0;

                                                        data.getVirtualInventory.forEach(order => {
                                                            totalPayment += parseFloat(order.price) * order.qty
                                                        })

                                                        this.setState({
                                                            totalPayment: parseFloat(totalPayment.toFixed(2)),
                                                            orders: data.getVirtualInventory
                                                        })
                                                    }}>
                                                        {({ data, loading, refetch, error }) => {
                                                            if(loading){
                                                                return (
                                                                    <tr>
                                                                        <td colSpan="4" className="text-center">
                                                                            <Loading height={150} width={150} />
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }

                                                            this.pendingRefetch = refetch;
                                                            
                                                            if(data.getVirtualInventory.length == 0){
                                                                return (
                                                                    <tr>
                                                                        <td colSpan="4" className="text-center">
                                                                            <span className="no-result">Nothing to pay yet!</span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }

                                                            return data.getVirtualInventory.map((order, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{index+1}</td>
                                                                        <td>
                                                                            <span className="one-line-ellipsis" style={{width: 100}}>{order.name}</span><br/>
                                                                            <span>Variant: ...</span>
                                                                        </td>
                                                                        <td>{order.qty}x</td>
                                                                        <td>${(parseFloat(order.price) * order.qty).toFixed(2)}</td>
                                                                    </tr>
                                                                );
                                                            })
                                                        }}
                                                    </Query>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default FulfillmentBulkOrder;