import React from 'react';
import moment from 'moment';
import Popup from 'reactjs-popup';
import toastr from 'toastr';
import { Mutation } from 'react-apollo';
import { NEW_UPDATE_ORDERS, NEW_DECIDE_ORDER } from '../queries';

class AdminFulfillmentData extends React.Component {
    constructor() {
        super();
        this.state = {
            approve_price: null,
            denied_note: '',
            quantity: null,
            dg_code: null,
            chinese_description: null,
        }
    }
    
    componentDidMount(){
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

    handleOnChange(event){
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [name]: value
        })
    }

    getOrderTime(date){
        return moment(new Date(parseInt(date))).startOf('second').fromNow();
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

    updateNewRequestedOrder(updateNewRequestedOrder){
        updateNewRequestedOrder().then(({ data }) => {
            toastr.options.timeOut = 3000;
            toastr.options.extendedTimeOut = 2000;
            toastr.clear();
            toastr.success("Product Price has been updated!", "Success!");
            this.props.refetch();
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    decideNewOrder(decideNewOrder){
        decideNewOrder().then(({ data }) => {
            toastr.options.timeOut = 3000;
            toastr.options.extendedTimeOut = 2000;
            toastr.clear();
            toastr.success("Order Has been approved!", "Success!");
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
        var action = this.props.action;
        var state = this.state;
        var index = this.props.index;
        
        return (
            <tr>
                <td className="text-center">
                    {/* Index */}
                    <span>{index}</span>
                </td>
                <td className="text-center">
                    {/* Checkbox */}
                    {orderData.isEdited ? <input type="checkbox" name={orderData.id} onClick={() => action()} /> : "Set Approve Price"}
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
                            return (
                                <Popup
                                    trigger={<span id={li_index+"displayPrice"+index} className="clickable">{li.approve_price ? "$" + li.approve_price : "Set Price"} {(li_index + 1) != orderData.line_items.length ? <hr /> : void 0}</span>}
                                    position="top center"
                                    on="click" className="points-tooltip" key={li_index}>
                                    <div style={{ lineHeight: 1.5, width: 280 }}>
                                        <h3>Change Product Info</h3>
                                        <div className="form_wrap">
                                            <div className="form_row" style={{marginBottom: '1rem', width: 'auto'}}>
                                                <div className="form_item">
                                                    <div className="form_input text-left">
                                                        <label>Product Price: *</label>
                                                        <input name="approve_price" type="number" defaultValue={li.approve_price} onChange={event => this.handleOnChange(event)} />
                                                        <span className="bottom_border"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form_row" style={{marginBottom: '1rem', width: 'auto'}}>
                                                <div className="form_item">
                                                    <div className="form_input text-left">
                                                        <label>Quantity: *</label>
                                                        <input name="quantity" type="number" defaultValue={li.quantity} onChange={event => this.handleOnChange(event)} />
                                                        <span className="bottom_border"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form_row" style={{marginBottom: '1rem', width: 'auto'}}>
                                                <div className="form_item">
                                                    <div className="form_input text-left">
                                                        <label>Chinese Description: *</label>
                                                        <input name="chinese_description" type="text" defaultValue={li.chinese_description} onChange={event => this.handleOnChange(event)} />
                                                        <span className="bottom_border"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form_row" style={{marginBottom: '1rem', width: 'auto'}}>
                                                <div className="form_item">
                                                    <div className="form_input text-left">
                                                        <label>DG Code:</label>
                                                        <select className="dropbtn drp stretch-width" name="dg_code" defaultValue={li.dg_code} style={{ backgroundColor: 'transparent', margin: 0 }} onChange={event => this.handleOnChange(event)}>
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
                                            </div>
                                            <div>
                                                <Mutation
                                                    mutation={NEW_UPDATE_ORDERS}
                                                    variables={{
                                                        id: this.props.selectedStoreID,
                                                        approve_price: state.approve_price != null ? state.approve_price : li.approve_price,
                                                        quantity: state.quantity != null ? parseInt(state.quantity) : li.quantity,
                                                        dg_code: state.dg_code != null ? state.dg_code : li.dg_code,
                                                        chinese_description: state.chinese_description != null ? state.chinese_description : li.chinese_description,
                                                        variant_id: li.variant_id
                                                    }}
                                                >
                                                    {(updateNewRequestedOrder, { datass, loading, error }) => {
                                                        return (
                                                            <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20 }} onClick={() => {
                                                                this.updateNewRequestedOrder(updateNewRequestedOrder);
                                                                document.getElementById(li_index+"displayPrice"+index).click();
                                                            }} disabled={loading}>
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                        );
                                                    }}
                                                </Mutation>
                                                &nbsp; | &nbsp;
                                                <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20 }} onClick={() => document.getElementById(li_index+"displayPrice"+index).click()}>
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            );
                        })
                    })()}
                </td>
                <td className="text-center">
                    {/* Action */}
                    <div className="form_buttons">
                        {/* Approved */}
                        <Mutation
                            mutation={NEW_DECIDE_ORDER}
                            variables={{
                                userid: this.props.selectedStoreID,
                                id: orderData.id,
                                decision: 'approved'
                            }}
                        >
                            {(decideNewOrder, { datass, loading, error }) => {
                                return <button className="btn" style={{padding: 5, backgroundColor: '#27c686', borderColor: '#27c686'}} onClick={() => this.decideNewOrder(decideNewOrder)} disabled={!orderData.isEdited}>Approve</button>
                            }}
                        </Mutation>
                        <br/><br/>
                        {/* Denied */}
                        <Popup
                            trigger={<button className="btn" id={"denied"+index} style={{padding: '5px 20px', backgroundColor: 'red', borderColor: 'red'}}>Deny</button>}
                            position="left center"
                            on="click" className="points-tooltip" key={index}>
                            <div className="helperText" style={{ lineHeight: 1.5 }}>
                                <h3>Add a Note</h3>
                                <div className="form_wrap">
                                    <div className="form_row" style={{ margin: 0 }}>
                                        <div className="form_item">
                                            <div className="form_input">
                                                <input name="denied_note" type="text" value={state.denied_note} onChange={event => this.handleOnChange(event)} />
                                                <span className="bottom_border"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Mutation
                                            mutation={NEW_DECIDE_ORDER}
                                            variables={{
                                                userid: this.props.selectedStoreID,
                                                id: orderData.id,
                                                decision: 'denied',
                                                denied_note: state.denied_note
                                            }}
                                        >
                                            {(decideNewOrder, { datass, loading, error }) => {
                                                return (
                                                    <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20 }} onClick={() => {
                                                        this.decideNewOrder(decideNewOrder);
                                                        document.getElementById("denied"+index).click();
                                                    }} disabled={loading}>
                                                        <i className="fas fa-check"></i>
                                                    </button>
                                                );
                                            }}
                                        </Mutation>
                                        &nbsp; | &nbsp;
                                        <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20 }} onClick={() => document.getElementById("denied"+index).click()}>
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

export default AdminFulfillmentData;