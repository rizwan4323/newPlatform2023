import React from 'react';
import moment from 'moment';
import toastr from 'toastr';
import Popup from 'reactjs-popup';
import { Mutation } from 'react-apollo';
import { ADD_TRACKING_NUMBER } from '../queries';
const points = require('../../Global_Values');

class AdminFulfillmentApprovedData extends React.Component {
    constructor() {
        super();
        this.state = {
            tracking_number: ''
        }
    }

    componentDidMount() {
        toastr.options = {
            "preventDuplicates": true,
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

    handleOnChange(event) {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [name]: value
        })
    }

    getOrderTime(date) {
        return moment(new Date(parseInt(date))).startOf('second').fromNow();
    }

    getToDisplayTime(obj) {
        if (obj.isRequest) {
            return obj.date_requested;
        } else if (obj.isDenied) {
            return obj.date_denied;
        } else if (obj.isApproved) {
            return obj.date_approved;
        } else if (obj.isFinish || obj.isPaid) {
            return obj.date_paid;
        }
    }

    addTrackingNumber(addTrackingNumber) {
        addTrackingNumber().then(({ data }) => {
            this.sendTrackingNumberToUser(data.addTrackingNumber);
        }).catch(error => {
            console.log("addTrackingNumber ERROR => ", error);
        });
    }

    sendTrackingNumberToUser(data){
        var store_data = this.props.store_data

        // create payload for fulfillment
        var aliComment = [];
        data.line_items.forEach(li => {
            aliComment.push({
                line_item_id: li.line_item_id,
                location_Id: store_data.store_location_id,
                order_Id: data.order_id
            })
        })
        var fulfillPayload = [{
            store_token: store_data.store_token,
            store_name: store_data.store_url,
            aliTrackingNum: this.state.tracking_number,
            aliComment: aliComment
        }];
        
        // send fulfillment to the store
        fetch(points.apiServer+'/fulfillment/ali', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fulfillPayload)
        })
        .then(ress => {
            console.log(ress);
            toastr.options.timeOut = 3000;
            toastr.options.extendedTimeOut = 2000;
            toastr.clear();
            toastr.success("Tracking Number has been saved and tracking number has sent to buyer!", "Success!");
            this.props.refetch();
        });
    }

    render() {
        var orderData = this.props.data;
        var state = this.state;
        var index = this.props.index;
        var trackingBtnStyle = {padding: 5, fontSize: 10};
        if(!orderData.tracking_number){
            trackingBtnStyle.backgroundColor = "red";
            trackingBtnStyle.border = "1px solid red";
        }

        return (
            <tr>
                <td className="text-center">
                    {/* Index */}
                    <span>{index}</span>
                </td>
                <td className="text-center">
                    {/* Date */}
                    <span>{this.getOrderTime(this.getToDisplayTime(orderData))}</span>
                </td>
                <td className="text-center">
                    {/* Date */}
                    <span>{orderData.order_note}</span>
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
                            return <span key={li_index}>{"$" + li.approve_price} {(li_index + 1) != orderData.line_items.length ? <hr /> : void 0}</span>
                        })
                    })()}
                </td>
                <td className="text-center">
                    {/* Total Price */}
                    {(() => {
                        var totalPrice = 0;
                        orderData.line_items.forEach((li, li_index) => {
                            totalPrice += li.approve_price * li.quantity;
                        })
                        return <span>{"$" + totalPrice.toFixed(2)}</span>;
                    })()}
                </td>
                <td>
                    {/* Action Button */}
                    <div className="form_buttons">
                        <Popup
                            trigger={<button className="btn" id={"tracking_number"+index} style={trackingBtnStyle}>Tracking Number</button>}
                            position="left center"
                            on="click" className="points-tooltip" key={index}>
                            <div className="helperText" style={{ lineHeight: 1.5 }}>
                                <h3 className="text-center">Add Tracking Number</h3>
                                <div className="form_wrap">
                                    <div className="form_row" style={{ margin: 0 }}>
                                        <div className="form_item">
                                            <div className="form_input">
                                                <label>Add Tracking Number:</label>
                                                <input name="tracking_number" type="text" defaultValue={orderData.tracking_number} onChange={event => this.handleOnChange(event)} />
                                                <span className="bottom_border"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <Mutation
                                            mutation={ADD_TRACKING_NUMBER}
                                            variables={{
                                                id: orderData.id,
                                                tracking_number: state.tracking_number
                                            }}
                                        >
                                            {(addTrackingNumber, { datass, loading, error }) => {
                                                return (
                                                    <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20 }} onClick={() => {
                                                        this.addTrackingNumber(addTrackingNumber);
                                                        document.getElementById("tracking_number"+index).click();
                                                    }} disabled={loading}>
                                                        <i className="fas fa-check"></i>
                                                    </button>
                                                );
                                            }}
                                        </Mutation>
                                        &nbsp; | &nbsp;
                                        <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20 }} onClick={() => document.getElementById("tracking_number"+index).click()}>
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </div>
                </td>
            </tr>
        )
    };
}

export default AdminFulfillmentApprovedData;