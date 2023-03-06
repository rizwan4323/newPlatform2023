import React from 'react';
import moment from 'moment';
import toastr from 'toastr';
import { Mutation } from 'react-apollo';
import { NEW_DECIDE_ORDER } from '../queries';
const points = require('../../Global_Values');

class AdminFulfillmentApprovedData extends React.Component {
    constructor() {
        super();
        this.state = {
            
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

    decideNewOrder(decideNewOrder){
        decideNewOrder().then(({ data }) => {
            toastr.options.timeOut = 3000;
            toastr.options.extendedTimeOut = 2000;
            toastr.clear();
            toastr.success("Order Has been move to request tab!", "Success!");
            this.props.refetch();
            this.props.refetchUser();
        }).catch(error => {
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "An Error has occurred!");
        });
    }

    render() {
        var orderData = this.props.data;
        var index = this.props.index;
        var trackingBtnStyle = {padding: 5, fontSize: 10};
        if(!orderData.tracking_number){
            trackingBtnStyle.backgroundColor = "red";
            trackingBtnStyle.border = "1px solid red";
        }

        return (
            <tr style={{backgroundColor: orderData.exported ? '#27c686' : 'inherit'}}>
                <td className="text-center">
                    {/* Index */}
                    <span>{index}</span>
                </td>
                <td className="text-center">
                    {/* Checkbox */}
                    <input type="checkbox" onClick={() => this.props.markThisItem(orderData.id, orderData.shipping_information.order_number)} checked={this.props.ids.includes(orderData.id)} />
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
                <td className="text-center">
                    <div className="form_buttons">
                        <Mutation
                            mutation={NEW_DECIDE_ORDER}
                            variables={{
                                userid: this.props.selectedStoreID,
                                id: orderData.id,
                                decision: 'request'
                            }}
                        >
                            {(decideNewOrder, { datass, loading, error }) => {
                                return <button className="btn" onClick={() => this.decideNewOrder(decideNewOrder)} style={{padding: '5px 20px', backgroundColor: 'red', borderColor: 'red'}}>Undo</button>;
                            }}
                        </Mutation>
                    </div>
                </td>
            </tr>
        )
    };
}

export default AdminFulfillmentApprovedData;