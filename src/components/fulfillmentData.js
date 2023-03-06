import React from 'react';
import moment from 'moment';
import toastr from 'toastr';
import { Mutation } from 'react-apollo';
import { NEW_CANCEL_REQUEST } from '../queries';
import ButtonWithPopup from '../components/buttonWithPopup';
import Loading from '../components/loading';
const points = require('../../Global_Values');

class FulfillmentData extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }
    
    componentDidMount(){
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

    getOrderTime(date){
        return moment(new Date(parseInt(date))).startOf('second').fromNow();
    }

    cancelRequest(cancelRequest){
        toastr.clear();
        toastr.info("Loading Please wait...", "");
        cancelRequest().then(({ data }) => {
            toastr.clear();
            toastr.success("You successfully cancel this order", "");
            this.props.refetch();
        }).catch(error => {
            console.log("Cancel error","");
        });
    }

    getOrderStatus(obj){
        if(obj.isRequest){
            return {
                style: {fontSize: 15, fontWeight: 900, color: '#f57272'},
                text: 'Processing'
            };
        } else if(obj.isDenied){
            return {
                style: {fontSize: 15, fontWeight: 900, color: '#ff0000'},
                text: 'Denied'
            };
        } else if(obj.isApproved){
            return {
                style: {fontSize: 15, fontWeight: 900, color: '#419f41'},
                text: 'Outsourcing'
            };
        } else if(obj.isPaid){
            return {
                style: {fontSize: 15, fontWeight: 900, color: '#ff8000'},
                text: 'Waiting for tracking number'
            };
        } else if(obj.isFinish){
            return {
                style: {fontSize: 15, fontWeight: 900, color: '#27c686'},
                text: 'Fulfilled'
            };
        }
    }

    getToDisplayTime(obj){
        if(obj.isRequest){
            return obj.date_requested;
        } else if(obj.isDenied){
            return obj.date_denied;
        } else if(obj.isApproved){
            return obj.date_approved;
        } else if(obj.isFinish || obj.isPaid){
            return obj.date_paid;
        }
    }

    getTrackingInfo(tn){
        fetch('/getTrackingInfo/'+tn)
        .then(res => res.json())
        .then(res => {
            this.setState({
                tnData: res
            })
        })
    }

    render() {
        var orderData = this.props.data;
        var filterBy = this.props.activeDropDown;
        var statusObj = this.getOrderStatus(orderData);
        
        return (
            <tr>
                <td className="text-center">
                    {/* Index */}
                    <span>{this.props.index}</span>
                </td>
                <td className="text-center">
                    {/* Date */}
                    <span>{this.getOrderTime(this.getToDisplayTime(orderData))}</span>
                </td>
                <td className="text-center">
                    {/* Order ID */}
                    <span>{orderData.shipping_information.order_number}</span>
                </td>
                <td>
                    {/* Shipping Information */}
                    <div className="ellipsis" style={{ width: 200 }}>
                        {orderData.shipping_information.email ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Email">{orderData.shipping_information.email}<br /></span> : void 0}
                        {orderData.shipping_information.name ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Name">{orderData.shipping_information.name}<br /></span> : void 0}
                        {orderData.shipping_information.address1 ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Address1">{orderData.shipping_information.address1}<br /></span> : void 0}
                        {orderData.shipping_information.address2 ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Address2">{orderData.shipping_information.address2} <br /></span> : void 0}
                        {orderData.shipping_information.city ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="City">{orderData.shipping_information.city}<br /></span> : void 0}
                        {orderData.shipping_information.province ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Province">{orderData.shipping_information.province ? orderData.shipping_information.province + " (" + orderData.shipping_information.province_code + ")" : ''}<br /></span> : void 0}
                        {orderData.shipping_information.zip ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Zip">{orderData.shipping_information.zip}<br /></span> : void 0}
                        {orderData.shipping_information.country ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Country">{orderData.shipping_information.country + " (" + orderData.shipping_information.country_code + ")"}</span> : void 0}
                    </div>
                </td>
                <td>
                    {/* Product */}
                    {(() => {
                        return orderData.line_items.map((li, li_index) => {
                            if (li.vendor_link) {
                                return <span key={li_index}><a href={li.vendor_link} target="_blank" title="Vendor link availalble click here.">{li.product_name}</a> {(li_index + 1) != orderData.line_items.length ? <hr /> : void 0}</span>
                            } else {
                                return <span key={li_index}>{li.product_name} {(li_index + 1) != orderData.line_items.length ? <hr /> : void 0}</span>
                            }
                        })
                    })()}
                </td>
                <td className="text-center">
                    {/* Variant Name */}
                    {(() => {
                        return orderData.line_items.map((li, li_index) => {
                            return <span key={li_index}>{li.variant_name ? li.variant_name : "N/A"} {(li_index + 1) != orderData.line_items.length ? <hr /> : void 0}</span>
                        })
                    })()}
                </td>
                <td className="text-center">
                    {/* Order Quantity */}
                    {(() => {
                        return orderData.line_items.map((li, li_index) => {
                            return <span key={li_index}>{li.quantity + "x"} {(li_index + 1) != orderData.line_items.length ? <hr /> : void 0}</span>
                        })
                    })()}
                </td>
                <td className="text-center">
                    {/* Order Approved Price */}
                    {(() => {
                        return orderData.line_items.map((li, li_index) => {
                            return <span key={li_index}>{"$" + li.original_price} {li.approve_price ? "-> $" + li.approve_price : void 0} {(li_index + 1) != orderData.line_items.length ? <hr /> : void 0}</span>
                        })
                    })()}
                </td>
                {filterBy == "denied" &&
                    <td className="text-center">
                        <span>{orderData.denied_note}</span>
                    </td>
                }
                <td className="text-center" style={{width: 150, position: 'relative'}}>
                    {/* Status */}
                    <span style={statusObj.style}>{statusObj.text}</span>
                    {filterBy != "denied" && orderData.isDenied ?
                        <div>
                            <br/>
                            <span>Note: {orderData.denied_note}</span>
                            <Mutation
                                mutation={NEW_CANCEL_REQUEST}
                                variables={{
                                    id: this.props.currentUserID,
                                    orderid: orderData.order_id.toString()
                                }}
                            >
                                {(cancelRequest, { data, loading, error }) => {
                                    return <button className="dwobtn" style={{padding: 0, marginTop: 5}} onClick={() => this.cancelRequest(cancelRequest)} disabled={loading}>Cancel Order</button>
                                }}
                            </Mutation>
                        </div>
                    : void 0}
                    {orderData.tracking_number &&
                        <ButtonWithPopup data={{
                            triggerDOM: <div style={{position: 'absolute', top: 10, right: 10, fontSize: 20}}>
                                <span id={"tracking_"+orderData.id} title="Track this order" className="clickable fas fa-truck-moving" onClick={() => this.getTrackingInfo(orderData.tracking_number)} />
                            </div>,
                            popupPosition: "left center",
                            title: "Logistic Tracking",
                            text: (
                                <div>
                                    <h6><strong>Tracking Number:</strong> {orderData.tracking_number}</h6>
                                    <ul style={{listStyleType: 'disc', paddingLeft: 40, textAlign: 'left'}}>
                                        {(() => {
                                            if(this.state.tnData){
                                                if(this.state.tnData.data){
                                                    return this.state.tnData.data.events.map((el,i) => {
                                                        return (
                                                            <li style={{paddingBottom: 10, borderBottom: '1px solid #bdb9b9'}} key={i}>
                                                                <span className="capitalize" style={{fontSize: 15}}>{el.description}</span><br/>
                                                                <span style={{fontSize: 12}}>{new Date(el.time).toLocaleString('en-US', { day: "2-digit", month: "short", year: "numeric" })}</span>
                                                            </li>
                                                        );
                                                    })
                                                } else {
                                                    return (
                                                        <li className="text-center">
                                                            No Result
                                                        </li>
                                                    );
                                                }
                                            } else {
                                                return (
                                                    <li className="text-center">
                                                        <Loading height={100} width={100} />
                                                    </li>
                                                );
                                            }
                                        })()}
                                    </ul>
                                </div>
                            ),
                            action: () => {},
                            triggerID: "tracking_"+orderData.id,
                            loading: false,
                            padding: 0,
                            checkORtimesButton: false
                        }} />
                    }
                </td>
            </tr>
        )
    };
}

export default FulfillmentData;