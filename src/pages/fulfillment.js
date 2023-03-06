import React from 'react';
import toastr from 'toastr';
import withAuth from './../hoc/withAuth';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import Loading from '../components/loading';
const points = require('../../Global_Values');

class Fulfillment extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }

    componentDidMount() {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut":0,
            "extendedTimeOut":0,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    }

    encode(str){
        return btoa(unescape(encodeURIComponent(str)));
    }

    initializeOrder(event){
        event.preventDefault();
        var dummyData = {
            displayFulfillmentStatus: "",
            line_items: [
            {
                fulfillmentStatus: "",
                id: "",
                    image: "",
                    qty: 1,
                    sku: "",
                    title: "Initializer",
                    url: "https://trade.aliexpress.com/orderList.htm?spm=2114.11010108.1000002.14.115b649baU8P3B&tracelog=ws_topbarwww.",
                    variantTitle: "Initialize"
            }
            ],
            shipping_info: {
                address1: "",
            address2: "",
            city: "",
            contact_name: "",
            country: "United States",
            country_code: "US",
            name: "",
            phone: "",
            province: "",
            zip: ""
            },
            location_id: "",
            order_id: "",
            store_name: this.props.session.getCurrentUser.store_url,
            store_token: this.props.session.getCurrentUser.store_token
        }
        
        var aliLink = `https://best.aliexpress.com/?params=${this.encode(JSON.stringify(dummyData))}&plgauto=true`;
        window.open(aliLink,"_blank");
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Aliexpress Plugin - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        return (
            <div className="grid page-container">
                {this.head()}
                <div className="fulfillment-title">
                    <span className="hide-in-desktop float-left" style={{padding: 15}} />
                    <h1>Aliexpress Plugin</h1>
                    <h4>Download PLG Chrome Extension <a href="https://chrome.google.com/webstore/detail/plg-extension/onjfinahifjhpomchajmpgcfjmjeiocc" target="_blank" style={{color: 'green'}}>Download Here</a></h4>
                </div>
                <div className="text-right">
                    <a href="#" onClick={this.initializeOrder.bind(this)}><h4>Go to <span style={{color: 'green'}}>AliExpress Order Page</span></h4></a>
                </div> <br/>
                <div id="myOrders">
                    <CreateOrderContent props={this.props} />
                </div>
                
                <div id="pagination" className="float-right">
                </div>
            </div>
        );
    }
}

export class CreateOrderContent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            variantRegex: new RegExp(/(?!\d*\s\/)\d+(?!\d*\%)/g),
            checkVariantRegex: new RegExp(/(?=Buy\s).*/g),
            aliLink: '',
            orders: '',
            pageNumber: 0,
            noResult: false
        }
        this.createRequest = this.createRequest.bind(this);
    }

    createRequest(data){
        this.setState((state) => {
            return {pageNumber : state.pageNumber + 1 }
        });
        var token = {
            store_name: this.props.props.session.getCurrentUser.store_url,
            store_token: this.props.props.session.getCurrentUser.store_token,
            cursor: data
        };
        fetch(points.apiServer+'/fulfillment/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(token)
        })
        .then(response => response.json())
        .then(result => {
            var aliLink = [];
            var orders = [];
            result.data.orders.edges.map((data, x) => {
                var temp = 0;
                data.node.lineItems.edges.map((lineitem,i) => {
                    var name = x+"aliLink"+i;
                    aliLink[name] = lineitem.node.product ? lineitem.node.product.metafield ? lineitem.node.product.metafield.value : '' :'';
                    if(lineitem.node.variantTitle && lineitem.node.variantTitle.match(this.state.checkVariantRegex)){
                        temp += lineitem.node.variantTitle ? this.getTotalOrderItem(lineitem.node.variantTitle) : lineitem.node.quantity;
                    } else {
                        temp += lineitem.node.quantity;
                    }
                })
                orders.push(temp);
            });
            this.setState({
                data: result,
                aliLink: aliLink,
                orders: orders
            });
        });
    }

    componentDidMount(){
        if (this.props.props.session.getCurrentUser.store_url) {
            this.createRequest("first:20, after: null");
        } else {
            this.setState({noResult: true});
            toastr.clear();
            toastr.warning('Seems like your not connected to your store yet', 'Connect Your Store');
            window.toggleConnectModal()
        }
    }

    addClickListenersAccordion() {
        document.querySelectorAll('.accordion').forEach(el => {
            el.addEventListener("click", function() {
                this.classList.toggle("active");
                var panel = this.parentElement.parentNode.nextElementSibling;
                if (panel.style.maxHeight){
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                } 
            });
        });
    }

    getTotalOrderItem(variant){
        variant = variant.match(this.state.checkVariantRegex).toString();
        let v = 0;
        variant.match(this.state.variantRegex).forEach(el => {
            if(el){
                v = parseInt(el) + v;
            }
        });
        return v;
    }
    
    getURLParameters(url){
        return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce((a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a),{});
    }

    updateLink(event){
        event.preventDefault();
        var el = event.target;
        // start Deals With the url params
        var url = el.href;
        var urlParams = this.getURLParameters(url).params;
        var defaultJSON = JSON.parse(this.decode(urlParams));
        if(!defaultJSON.shipping_info.phone){
            defaultJSON.shipping_info.phone = this.props.props.session.getCurrentUser.store_phone.replace(/\(|\)|\s|-/g,"");
        }
        // end Deals With the url params
        
        // start Getting Updated links in accordion
        var accordionParent = el.parentNode.parentNode.parentNode.nextElementSibling;
        var titleList = accordionParent.querySelectorAll(".li-title");
        var linkList = accordionParent.querySelectorAll(".li-link input");
        var hasError = false;
        titleList.forEach((title, i) => {
            defaultJSON.line_items[i].url = linkList[i].value.replace(/\?.*/g, '');
            if(!linkList[i].value){
                linkList[i].classList.add("nourl");
                hasError = true;
            }
            /* Should Validate if the url is correct ? */
            /* Pangsamantagal !!!!!!*/
            defaultJSON.line_items[i].sku = "";
            /* Pangsamantagal !!!!!!*/
            // Check if the user change the vendor link then remove the sku so the automatic variant selection is disable
            if(defaultJSON.line_items[i].url != linkList[i].value){
                defaultJSON.line_items[i].sku = "";
            }
        });
        
        if(hasError){
            el.parentNode.parentNode.parentNode.querySelector(".accordion").click()
        } else {
            var aliLink = `https://best.aliexpress.com/?params=${this.encode(JSON.stringify(defaultJSON))}&plgauto=true`;
            window.open(aliLink,"_blank");
        }
        // End Getting Updated links in accordion
    }

    aliLink(event){
        var name = event.target.name;
        var value = event.target.value;
        this.setState({aliLink: {...this.state.value, [name]: value}})
    }

    encode(str){
        return btoa(unescape(encodeURIComponent(str)));
    }

    decode(str){
        return atob(str);
    }

    render(){
        if(this.state.data){
            return(
                <div>
                    {this.state.data.data.orders.edges.map((order,x) => {
                        if(order.node.shippingAddress == null){
                            return null;
                        }
                        return(
                            <div className="grid" key={"grid"+x} style={{maxWidth: '120rem'}}>
                                <div className="orderscard" key={"orderscard"+x} style={{ border: '#27c686 solid'}}>
                                    <div className="column column_3_12" key={"column1"+x} style={{color: '#27c686', fontSize: 20, textAlign: 'center'}}>{this.state.orders[x]} {this.state.orders[x] > 1 ? "orders" : "order"}<br/>
                                        <div className="accordion" style={{position: 'relative', margin: '10px', width: '75px', height: '75px'}} key={"accordion"+x}>
                                            {(() => {
                                                return order.node.lineItems.edges.map((img, i) => {
                                                    return <img src={img.node.image ? img.node.image.originalSrc : ""} style={{height: `${(75-(order.node.lineItems.edges.length - 1)*10)}px`, width: `${(75 - (order.node.lineItems.edges.length - 1)*10)}px`, position: 'absolute', top: `${(i*10)}px`, left: `${(i*10)}px`, boxShadow: '0 3px 1px -2px rgba(0,0,0,0.14), 0 2px 2px 0 rgba(0,0,0,0.098), 0 1px 5px 0 rgba(0,0,0,0.084)', borderRadius: '2px'}} key={x+"img"+i} />;
                                                })
                                            })()}
                                        </div>
                                    </div>
                                    <div className="column column_3_12" key={"column2"+x}>
                                        <span className="ellipsis">
                                            <em style={{color: '#27c686', fontSize: 12}}>Email:</em><br/>
                                            <em style={{fontFamily: 'sans-serif', color: '#adadad'}}>{order.node.email}</em> <br /> <hr />
                                            <em style={{color: '#27c686', fontSize: 12}}>Name: </em> {order.node.shippingAddress.name}<br />
                                            <em style={{color: '#27c686', fontSize: 12}}>Street: </em> {order.node.shippingAddress.address1} <br />
                                            <em style={{color: '#27c686', fontSize: 12}}>City: </em> {order.node.shippingAddress.city} <br />
                                            <em style={{color: '#27c686', fontSize: 12}}>Zip code: </em> {order.node.shippingAddress.province} {order.node.shippingAddress.zip} <br/>
                                            <em style={{color: '#27c686', fontSize: 12}}>Country: </em> {order.node.shippingAddress.country}
                                        </span>
                                    </div>
                                    <div className="column column_3_12" key={"column3"+x}>
                                        <b style={{color: '#27c686', fontWeight: 900}}>Status: </b><br/>
                                        <b style={{ backgroundColor: '#fffc00' }}>{order.node.displayFulfillmentStatus}</b>
                                        <br/><br/>
                                        {(() => {
                                            var found = false;
                                            order.node.lineItems.edges.map(li => {
                                                if(li.node.sku && li.node.sku.includes("PLG-")){
                                                    found = true;
                                                }
                                            })
                                            return found ? <h1 style={{color: '#27c686'}}>US</h1> : null;
                                        })()}
                                    </div>
                                    <div className="column column_3_12" key={"column4"+x}>
                                        {(() => {
                                            var newLineItem = [];
                                            order.node.lineItems.edges.map(data => {
                                                newLineItem.push({
                                                    fulfillmentStatus: data.node.fulfillmentStatus,
                                                    id: data.node.id.replace("gid://shopify/LineItem/",""),
                                                    qty: data.node.variantTitle ? data.node.variantTitle.match(this.state.checkVariantRegex) ? this.getTotalOrderItem(data.node.variantTitle) : data.node.quantity : data.node.quantity,
                                                    sku: data.node.sku ? data.node.sku : '',
                                                    tags: data.node.product ? data.node.product.tags : '',
                                                    title: data.node.product ? data.node.product.title : '',
                                                    url: data.node.product ? data.node.product.metafield ? data.node.product.metafield.value : '' : '',
                                                    variantTitle: data.node.variantTitle ? data.node.variantTitle : ''
                                                });
                                            });
                                            var newData = {
                                                displayFulfillmentStatus: order.node.fulfillmentStatus,
                                                line_items: newLineItem,
                                                location_id: this.state.data.data.location.id.replace("gid://shopify/Location/", ""),
                                                order_id: order.node.id.replace("gid://shopify/Order/", ""),
                                                shipping_info: order.node.shippingAddress,
                                                store_name: this.props.props.session.getCurrentUser.store_url,
                                                store_token: this.props.props.session.getCurrentUser.store_token
                                            };
                                            var link = `https://best.aliexpress.com/?params=${this.encode(JSON.stringify(newData))}&plgauto=true`;
                                            return (
                                                <div className="form_buttons">
                                                    <a className="btn" target="_blank" href={link} onClick={this.updateLink.bind(this)}>Order Product</a>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                                <div className="panel" key={"panel"+x}>
                                    {(() => {
                                        return order.node.lineItems.edges.map((line_item, i) => {
                                            return (
                                                <div className="grid form_item" style={{margin: 10, display: 'flex', alignItems: 'center'}}  key={i}>
                                                    <div className="column column_3_12 li-title" key={"2column1"+x} style={{backgroundColor: '#26c686', color: '#fff', padding: 5, textAlign: 'center'}}>
                                                        {line_item.node.product ? line_item.node.product.title : ''}
                                                    </div>
                                                    <div className="column column_9_12 form_input li-link" key={"2column2"+x}>
                                                        <input type="text" className="ali-data" placeholder="Aliexpress Vendor URL" name={x+'alilink'+i} defaultValue={this.state.aliLink[x+'aliLink'+i]} onChange={this.aliLink.bind(this)} style={{padding: 10, borderRadius: 10}} />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    })()}
                                </div>
                                {(() => {
                                    if(x === (this.state.data.data.orders.edges.length-1)){
                                        setTimeout(function() {
                                            this.addClickListenersAccordion();
                                            var nextCursor = "";
                                            var prevCursor = "";
                                            var hasNext = true;
                                            var hasPrev = this.state.data.data.orders.pageInfo.hasPreviousPage;
                                        
                                            if(this.state.data.data.orders.edges[19]){
                                                nextCursor = this.state.data.data.orders.edges[19].cursor;
                                            } else {
                                                hasNext = false;
                                            }
                                        
                                            if(this.state.data.data.orders.edges[0]){
                                                prevCursor = this.state.data.data.orders.edges[0].cursor;
                                            }
                                            var self = this;
                                            function createPaginationButton(){
                                                return (
                                                    <div className="form_buttons">
                                                        <button className="btn" onClick={self.createRequest.bind(this, 'last:20, before: '+JSON.stringify(prevCursor).replace(/\"/g,"\'")+'')} disabled={!hasPrev}>Prev</button> |&nbsp;
                                                        <button className="btn" onClick={self.createRequest.bind(this, 'first:20, after: '+JSON.stringify(nextCursor).replace(/\"/g,"\'")+'')} disabled={!hasNext}>Next</button>
                                                    </div>
                                                );
                                            }
                                            ReactDOM.render(createPaginationButton(), document.getElementById("pagination"))
                                        }.bind(this), 1000);
                                    }
                                })()}
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            if(this.state.noResult){
                return (
                    <div className="center-vertical">
                        No Result Found
                    </div>
                );
            } else {
                return (
                    <div>
                        <Loading height={200} width={200} />
                    </div>
                );
            }
        }
    }
}
export default withAuth(session => session && session.getCurrentUser)(Fulfillment);