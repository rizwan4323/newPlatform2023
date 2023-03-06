import React from 'react';
import moment from 'moment';
import Popup from 'reactjs-popup';
import toastr from 'toastr';
import { Mutation } from 'react-apollo';
import { UPDATE_VIRTUAL_WAREHOUSE, NEW_DECIDE_ORDER } from '../queries';

class AdminFulfillmentBulkRequestData extends React.Component {
    constructor() {
        super();
        this.state = {
            approve_price: null,
            denied_note: '',
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

    updateVirtualWarehouse(updateVirtualWarehouse, selector){
        var { approve_price, chinese_description } = this.state;
        if(!selector || (approve_price && chinese_description)){
            if(selector){
                document.getElementById(selector).click();
            }
            updateVirtualWarehouse().then(({ data }) => {
                toastr.options.timeOut = 3000;
                toastr.options.extendedTimeOut = 2000;
                toastr.clear();
                toastr.success("Product Price has been updated!", "Success!");
                this.props.refetch();
            }).catch(error => {
                toastr.options.timeOut = 0;
                toastr.options.extendedTimeOut = 0;
                toastr.clear();
                toastr.warning(error.graphQLErrors[0].message, "An Error has occurred!");
            });
        } else {
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.clear();
            toastr.warning("Price, Description Required!", "Field Required!");
        }
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
                    <input type="checkbox" name={orderData.id} onClick={() => action()} />
                </td>
                <td className="text-center">
                    {/* Product Name */}
                    <span>{orderData.product_name}</span>
                </td>
                <td>
                    {/* Variant Name */}
                    {(() => {
                        return orderData.variants.map((variant, li_index) => {
                            return (
                                <div key={li_index}>
                                    <span>{variant.variant_name}</span>
                                    {li_index != orderData.variants.length-1 ? <hr/> : void 0}
                                </div>
                            );
                        })
                    })()}
                </td>
                <td className="text-center">
                    {/* Variant Quantity */}
                    {(() => {
                        return orderData.variants.map((variant, li_index) => {
                            return (
                                <div key={li_index}>
                                    <span>{variant.quantity}</span>
                                    {li_index != orderData.variants.length-1 ? <hr/> : void 0}
                                </div>
                            );
                        })
                    })()}
                </td>
                <td className="text-center">
                    {/* Variant Price */}
                    {(() => {
                        return orderData.variants.map((li, li_index) => {
                            return (
                                <Popup
                                    trigger={<span id={li_index+"displayPrice"+index} className="clickable">{li.approve_price ? "$" + li.approve_price : "Set Price"} {(li_index + 1) != orderData.variants.length ? <hr /> : void 0}</span>}
                                    position="top center"
                                    on="click" className="points-tooltip" key={li_index}>
                                    <div style={{ lineHeight: 1.5, width: 280 }}>
                                        <h3>Change Product Info</h3>
                                        <div className="form_wrap">
                                            <div className="form_row" style={{marginBottom: '1rem', width: 'auto'}}>
                                                <div className="form_item">
                                                    <div className="form_input text-left">
                                                        <label>Product Price:</label>
                                                        <input name="approve_price" type="number" defaultValue={li.approve_price} onChange={event => this.handleOnChange(event)} />
                                                        <span className="bottom_border"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form_row" style={{marginBottom: '1rem', width: 'auto'}}>
                                                <div className="form_item">
                                                    <div className="form_input text-left">
                                                        <label>Chinese Description:</label>
                                                        <input name="chinese_description" type="text" defaultValue={orderData.chinese_description} onChange={event => this.handleOnChange(event)} />
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
                                                    mutation={UPDATE_VIRTUAL_WAREHOUSE}
                                                    variables={{
                                                        id: this.props.selectedStoreID,
                                                        approve_price: state.approve_price != null ? state.approve_price : li.approve_price,
                                                        dg_code: state.dg_code != null ? state.dg_code : li.dg_code,
                                                        chinese_description: state.chinese_description != null ? state.chinese_description : orderData.chinese_description,
                                                        variant_id: li.variant_id
                                                    }}
                                                >
                                                    {(updateVirtualWarehouse, { datass, loading, error }) => {
                                                        return (
                                                            <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20 }} onClick={() => {
                                                                this.updateVirtualWarehouse(updateVirtualWarehouse, li_index+"displayPrice"+index);
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
                    {/* Inbound ID */}
                    <span>{orderData.boxc_inbound_id}</span>
                </td>
                <td className="text-center">
                    {/* Action */}
                    <div className="form_buttons">
                        {orderData.isFinish ?
                            <strong style={{color: '#26c686'}}>
                                Inbound <br/>
                                Requested
                            </strong>
                        :
                            <Mutation
                                mutation={UPDATE_VIRTUAL_WAREHOUSE}
                                variables={{
                                    id: this.props.selectedStoreID,
                                    object_id: orderData.id,
                                    isFinish: true
                                }}
                            >
                                {(updateVirtualWarehouse, { datass, loading, error }) => {
                                    return (
                                        <button className="btn" style={{padding: '5px 10px', fontSize: 10}} onClick={() => this.updateVirtualWarehouse(updateVirtualWarehouse)}>
                                            Request <br/>
                                            Inbound
                                        </button>
                                    );
                                }}
                            </Mutation>
                        }
                    </div>
                </td>
            </tr>
        )
    };
}

export default AdminFulfillmentBulkRequestData;