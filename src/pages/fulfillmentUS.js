import React from 'react';
import toastr from 'toastr';
import withAuth from './../hoc/withAuth';
import { Helmet } from 'react-helmet';
import Loading from '../components/loading';
const points = require('../../Global_Values');

class FulfillmentUS extends React.Component {
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
                <title>US Warehouse Fulfillment - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        return (
            <div className="grid page-container">
                {this.head()}
                <div className="fulfillment-title">
                    <h1>US Warehouse Fulfillment</h1>
                </div>
                <div id="myOrders">
                    <CreateOrderContent props={this.props} />
                </div>
            </div>
        );
    }
}

export class CreateOrderContent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
        this.createRequest = this.createRequest.bind(this);
    }

    createRequest(){
        var token = {
            shop: this.props.props.session.getCurrentUser.store_url,
            token: this.props.props.session.getCurrentUser.store_token
        };
        fetch(points.apiServer+'/ajax/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(token)
        })
        .then(response => response.json())
        .then(result => {
            this.setState({
                data: result
            });
        });
    }

    componentDidMount(){
        if (this.props.props.session.getCurrentUser.store_url) {
            this.createRequest();
        } else {
            this.setState({noResult: true});
            toastr.clear();
            toastr.warning('Seems like your not connected to your store yet', 'Connect Your Store');
            window.toggleConnectModal()
        }
    }

    render(){
        if(this.state.data){
            return(
                <div>
                    {this.state.data.map((order,x) => {
                        if(order.shipping_address == null){
                            return null;
                        }
                        return(
                            <div className="grid" key={"grid"+x}>
                                <div className="orderscard" key={"orderscard"+x}>
                                    <div className="column column_3_12" key={"column2"+x}>
                                        <p className="ellipsis">{order.email} <br /> {order.shipping_address.first_name+" "+order.shipping_address.last_name}<br /> {order.shipping_address.address1} <br /> {order.shipping_address.city} <br /> {order.shipping_address.province} {order.shipping_address.zip} <br/> {order.shipping_address.country}</p>
                                    </div>
                                    <div className="column column_3_12" key={"column3"+x}>
                                        <em>Status: </em> <b>{order.fulfillments.length != 0 ? order.fulfillments[0].status : ''}</b>
                                    </div>
                                    <div className="column column_3_12" key={"column4"+x}>
                                        {(() => {
                                            var link = `https://productlistgenie.io/cart/${order.line_items[0].sku.replace(/PLG-/g, "")}:${order.line_items[0].quantity}?checkout[email]=${order.email}&checkout[shipping_address][first_name]=${order.shipping_address.first_name}&checkout[shipping_address][last_name]=${order.shipping_address.last_name}&checkout[shipping_address][address1]=${order.shipping_address.address1}&checkout[shipping_address][address2]=${order.shipping_address.address2}&checkout[shipping_address][city]=${order.shipping_address.city}&checkout[shipping_address][province]=${order.shipping_address.province}&checkout[shipping_address][zip]=${order.shipping_address.zip}&checkout[shipping_address][country]=${order.shipping_address.country}&attributes[orderId]=${order.id ? order.id : null}&attributes[fulfillmentId]=${order.fulfillments.length != 0 ? order.fulfillments[0].id : null}&attributes[storeName]=${this.props.props.session.getCurrentUser.store_url}&attributes[storeToken]=${this.props.props.session.getCurrentUser.store_token}`;
                                            return (
                                                <div className="form_buttons">
                                                    <a className="btn" target="_blank" href={link} target="_blank">Order Product</a>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
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
export default withAuth(session => session && session.getCurrentUser)(FulfillmentUS);