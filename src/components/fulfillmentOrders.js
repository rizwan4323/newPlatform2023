import React from 'react';
import toastr from 'toastr';
import Loading from '../components/loading';
import Popup from 'reactjs-popup';
import { NEW_REQUEST_ORDERS, NEW_CANCEL_REQUEST } from '../queries';
import { Mutation } from 'react-apollo';
import moment from 'moment';
import Pagination from './pagination';
const points = require('../../Global_Values');

class FulfillmentOrders extends React.Component {
    constructor() {
        super();
        this.state = {
            orders: [],
            selectedOrder: [],
            vendorLinks: [],
            totalOrders: 0,
            currentPageLimit: 50
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

        // get request data
        var gqlPayload = {"query":"{\n  getAllNewOrdersID(id:\""+this.props.session.getCurrentUser.id+"\"){\n    orders_id\n  }\n}","variables":null,"operationName":null}
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gqlPayload)
        })
        .then(res => res.json())
        .then(gqlResult => {
            if(!gqlResult.data.getAllNewOrdersID){
                this.setState({
                    requested: []
                })
            } else {
                this.setState({
                    requested: gqlResult.data.getAllNewOrdersID.orders_id
                })
            }
        })
        .catch(err => {
            toastr.clear();
            toastr.warning("Please refresh the page","An Error has occured")
        });

        // get total orders
        fetch(points.apiServer+'/unfulfilledorderscount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                store_name: this.props.session.getCurrentUser.store_url,
                store_token: this.props.session.getCurrentUser.store_token
            })
        })
        .then((Response) => Response.json())
        .then((res) => {
            this.setState({ totalOrders: res.count })
            if(res.count != 0){
                this.requestAllOrders(1);
            }
        })
        .catch(err => {
            toastr.clear();
            toastr.warning("Please refresh the page","An Error has occured")
        });
    }

    requestAllOrders(pageNum){
        this.setState({
            orders: []
        }, () => {
            fetch(points.apiServer+'/unfulfilled-china', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    store_name: this.props.session.getCurrentUser.store_url,
                    store_token: this.props.session.getCurrentUser.store_token,
                    page: pageNum
                })
            })
            .then(res => res.json())
            .then(result => {
                this.setState({
                    orders: result
                })
            })
            .catch(err => {
                toastr.clear();
                toastr.warning("Please refresh the page","An Error has occured")
            });
        })
    }

    

    requestNewOrders(requestNewOrders, event){
        var self = this;
        if(self.state.selectedOrder.length != 0){
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.info("Loading Please wait...","");
            requestNewOrders().then(({ data }) => {
                // Appending process to requested state
                var appendSelected = this.state.requested;
                this.state.selectedOrder.forEach(dd => {
                    appendSelected.push(JSON.stringify(dd.id));
                })
                // end appending
                
                self.setState({
                    requested: appendSelected, // update requested array object looks like refetch
                    selectedOrder: []
                }, () => {
                    self.removeCheckBox();
                    toastr.options.timeOut = 3000;
                    toastr.options.extendedTimeOut = 2000;
                    toastr.clear();
                    toastr.success("Orders have been requested!","Success!");
                })
            }).catch(error => {
                console.error("ERR =>", error);
            });
        } else {
            toastr.clear();
            toastr.warning("Check atleast 1 or more to proceed requesting order!","");
        }
    }

    changeOrderQuantity(liObj, event){
        var currentOrders = this.state.orders;
        currentOrders.map(currentOrder => {
            return currentOrder.line_items.map(li => {
                if(li.variant_id == liObj.variant_id){
                    li.quantity = event.target.value
                }
                return li
            })
        })
        
        this.setState({
            orders: currentOrders
        })
    }

    addVendorLink(event){
        var currentOrders = this.state.orders;
        currentOrders.forEach(currentOrder => {
            currentOrder.line_items.forEach(li => {
                if(li.product_id == event.target.id){
                    li.vendorLink = event.target.value
                }
            })
        })

        // handle vendor links
        var vendorLinks = this.state.vendorLinks;
        var linkVlaue = event.target.value;
        var productIDValue = event.target.id;
        if(vendorLinks.length != 0){
            // the loop
            var indexToEdit = null;
            vendorLinks.forEach((vendorLink, v_index) => {
                if(vendorLink.product_id == productIDValue){
                    indexToEdit = v_index;
                }
            })
            if(indexToEdit != null){
                // if found what should we edit
                vendorLinks[indexToEdit].link = linkVlaue;
            } else {
                // if nothing found from product_id then push
                vendorLinks.push({
                    product_id: productIDValue,
                    link: linkVlaue
                });
            }
        } else {
            // the initial save
            vendorLinks.push({
                product_id: productIDValue,
                link: linkVlaue
            });
        }

        this.setState({
            orders: currentOrders,
            vendorLinks
        })
    }

    addNotes(order, event){
        var value = event.target.value;
        var oldOrderArray = this.state.orders;
        oldOrderArray.forEach(odr => {
            if(odr.id == order.id){
                odr.order_note = value;
            }
        })
        this.setState({
            orders: oldOrderArray
        })
    }

    changeShippingInformation(orderObj, info, value){
        var currentOrders = this.state.orders;
        currentOrders.map(currentOrder => {
            if(orderObj.id == currentOrder.id){
                if(info == "email"){
                    currentOrder.email = value
                } else if(info == "name"){
                    currentOrder.shipping_address.name = value
                } else if(info == "address1"){
                    currentOrder.shipping_address.address1 = value
                } else if(info == "address2"){
                    currentOrder.shipping_address.address2 = value
                } else if(info == "city"){
                    currentOrder.shipping_address.city = value
                } else if(info == "zip"){
                    currentOrder.shipping_address.zip = value
                } else if(info == "province"){
                    currentOrder.shipping_address.province = value
                } else if(info == "country"){
                    currentOrder.shipping_address.country = value
                }
            }
            return currentOrder;
        })
        
        this.setState({
            orders: currentOrders
        })
    }

    checkAllCheckbox(){
        if(!this.state.isChecked){
            document.querySelectorAll("[type='checkbox']").forEach(el => {
                if(!el.checked){
                    el.click();
                }
            })
        } else {
            this.removeAllCheckBox();
        }
        this.setState({
            isChecked: !this.state.isChecked
        })
    }

    removeAllCheckBox(){
        document.querySelectorAll("[type='checkbox']").forEach(el => {
            if(el.checked){
                el.click();
            }
        })
    }

    removeCheckBox(){
        document.querySelectorAll("[type='checkbox']").forEach(el => {
            if(el.checked){
				el.remove()
            }
        })
    }

    removeThisItem(obj){
        var orders = this.state.orders
        var g = orders.map(order => {
            var newLi = [];
            order.line_items.forEach(data => {
                if(data.product_id != obj.product_id){
                    newLi.push(data);
                }
            });
            order.line_items = newLi;
            return order;
        })
        
        this.setState({
            orders: g
        })
    }

    includeThisItem(obj, event){
        var currentSelectedOrder = this.state.selectedOrder;
        // remove kapag may kapareha na id
        for( var i = 0; i < currentSelectedOrder.length; i++){
            if (currentSelectedOrder[i].id == obj.id) {
                currentSelectedOrder.splice(i, 1); 
            }
        }
        // kung checked mag update ng state
        if(event.target.checked){
            var add = obj.shipping_address;
            if(add.address1.length > 30){
                var str = obj.shipping_address.address1;
                // var col = address.split(" ")
                // var half = Math.ceil(col.length/2);
                // var add1 = str.substring(0, str.indexOf(col[half-1]))
                // var add2 = str.substring(str.indexOf(col[half-1]))
                var n = str.lastIndexOf(" ", str.length/2);
                var add1 = str.slice(0, n);
                var add2 = str.slice(n, str.length);
        		obj.shipping_address.address1 = add1
                obj.shipping_address.address2 = add2
            }

            obj.line_items.map(el => {
                // copy price to orig_price
                el.orig_price = el.price
                return el;
            })
            
            currentSelectedOrder.push(obj);
        }
        this.setState({
            selectedOrder: currentSelectedOrder
        })
    }

    cancelRequest(cancelRequest, orderid, refetch){
        toastr.clear();
        toastr.info("Loading Please wait...", "");
        cancelRequest().then(({ data }) => {
            var requested = this.state.requested;
            requested.splice(requested.indexOf(orderid), 1)
            this.setState({
                requested
            }, () => {
                toastr.clear();
                toastr.success("You successfully cancel this order", "");
                if(refetch){
                    refetch();
                }
            })
        }).catch(error => {
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "Warning!");
            toastr.options.timeOut = 3000;
            toastr.options.extendedTimeOut = 2000;
        });
    }

    render() {
        var state = this.state;
        var store_url = this.props.session.getCurrentUser.store_url;
        var currentUser = this.props.session.getCurrentUser;
        var plg_balance = currentUser.plg_balance.toFixed(2);
        
        return (
            <div>
                <div className="text-center">
                    <h2>Order List</h2>
                </div>
                <div className="column column_12_12">
                    <div className="clear float-right">
                        <Mutation
                            mutation={NEW_REQUEST_ORDERS}
                            variables={{
                                id: currentUser.id,
                                orders: JSON.stringify(this.state.selectedOrder)
                            }}
                        >
                            {(requestNewOrders, { data, loading, error }) => {
                                return (
                                    <label>Temporarily Unavailable</label>
                                )
                                return <button className="dwobtn" id="request" style={{ margin: 0, fontSize: 15 }} onClick={this.requestNewOrders.bind(this, requestNewOrders)}>Request Selected</button>
                            }}
                        </Mutation>
                    </div>
                </div>
                <div className="table-container clear">
                    <Pagination displayPageCount={state.currentPageLimit} totalPage={state.totalOrders} action={this.requestAllOrders.bind(this)} showInputPage={true} />
                    <br />
                    <table className="table-list">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th className="text-center clickable" style={{ width: '100px' }} onClick={() => this.checkAllCheckbox()}>Check All{state.selectedOrder.length != 0 ? " (" + state.selectedOrder.length + ")" : void 0}</th>
                                <th>Order Date</th>
                                <th>Order Number</th>
                                <th>Shipping Information</th>
                                <th>Product</th>
                                <th className="text-center">Variant</th>
                                <th className="text-center">Quantity</th>
                                <th className="text-center">Vendor Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                if (this.state.totalOrders == 0) {
                                    // if no order
                                    return (
                                        <tr>
                                            <td colSpan="9" className="text-center">
                                                <span style={{ fontStyle: 'italic', fontSize: '1.5rem' }}>Empty... check back soon!</span>
                                            </td>
                                        </tr>
                                    );
                                } else if (state.orders.length == 0) {
                                    // if still loading
                                    return (
                                        <tr>
                                            <td colSpan="9" className="text-center">
                                                <Loading height={200} width={200} />
                                            </td>
                                        </tr>
                                    );
                                }

                                // parse the data
                                return state.orders.map((orders, o_index) => {
                                    if (!orders.order_note) {
                                        orders.order_note = "";
                                    }
                                    var order_id = orders.id;
                                    var isSelected = this.state.requested.includes(order_id.toString());

                                    var isHaveVendorLink = [];
                                    orders.line_items.forEach(el => el.vendorLink ? isHaveVendorLink.push(true) : void 0);

                                    return (
                                        <tr key={o_index}>
                                            <td className="text-center">{o_index + 1}</td>
                                            <td className="text-center">
                                                {(() => {
                                                    if(plg_balance == 0){
                                                        // if no balance
                                                        return <span>Please Add Credit to your account.</span>;
                                                    } else {
                                                        // if not yet selected and has shipping address and order length is not zero
                                                        if(!isSelected && orders.shipping_address && orders.line_items.length != 0){
                                                            // if has shipping address and shipping address1 length is greater than 80
                                                            if(orders.shipping_address && orders.shipping_address.address1.length > 30){
                                                                return (
                                                                    <Popup
                                                                        trigger={<span className="clickable fas fa-question-circle" style={{ color: 'red' }} />}
                                                                        position="top center"
                                                                        on="hover" className="points-tooltip">
                                                                        <div className="helperText" style={{ padding: 10, lineHeight: 1.5 }}>
                                                                            Please validate address1.
                                                                        </div>
                                                                    </Popup>
                                                                );
                                                            } else {
                                                                // if all line item has vendor link
                                                                if(isHaveVendorLink.length == orders.line_items.length){
                                                                    return <input type="checkbox" id={orders.id} onChange={event => this.includeThisItem(orders, event)} />;
                                                                } else {
                                                                    return <span>Vendor Link Required.</span>;
                                                                }
                                                            }
                                                        } else {
                                                            return (
                                                                <div className="form_buttons">
                                                                    <Mutation
                                                                        mutation={NEW_CANCEL_REQUEST}
                                                                        variables={{
                                                                            id: currentUser.id,
                                                                            orderid: orders.id.toString()
                                                                        }}
                                                                    >
                                                                        {(cancelRequest, { data, loading, error }) => {
                                                                            return (
                                                                                <button className="btn" style={{ padding: 5, backgroundColor: 'red', borderRadius: 5, fontSize: 10, border: '1px solid red' }} onClick={() => this.cancelRequest(cancelRequest, orders.id.toString())}>
                                                                                    Cancel Request
                                                                                </button>
                                                                            );
                                                                        }}
                                                                    </Mutation>
                                                                </div>
                                                            );
                                                        }
                                                    }
                                                })()}
                                            </td>
                                            <td>{moment(new Date(orders.created_at)).startOf('second').fromNow()}</td>
                                            <td className="text-center">
                                                <Popup
                                                    trigger={<span className="fas fa-envelope clickable" style={{ color: 'green' }} title="Add Note to this order"></span>}
                                                    position="top center"
                                                    on="click" className="points-tooltip">
                                                    <div className="text-center">
                                                        <h3>Order Note</h3>
                                                        <div className="form_wrap">
                                                            <div className="form_row">
                                                                <div className="form_item">
                                                                    <div className="form_input">
                                                                        <input type="text" defaultValue={orders.order_note} onBlur={event => this.addNotes(orders, event)} />
                                                                        <span className="bottom_border"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Popup> <br /><br />
                                                <a href={"https://" + store_url + "/admin/orders/" + orders.id} target="_blank">{"#" + orders.order_number}</a>
                                            </td>
                                            <td>
                                                {orders.shipping_address ?
                                                    <Popup
                                                        trigger={
                                                            <div className="ellipsis" style={{ width: 200 }}>
                                                                {orders.email ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Email">{orders.shipping_address.email}<br /></span> : void 0}
                                                                {orders.shipping_address.name ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Name">{orders.shipping_address.name}<br /></span> : void 0}
                                                                {orders.shipping_address.address1 ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Address1">{orders.shipping_address.address1}<br /></span> : void 0}
                                                                {orders.shipping_address.address2 ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Address2">{orders.shipping_address.address2} <br /></span> : void 0}
                                                                {orders.shipping_address.city ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="City">{orders.shipping_address.city}<br /></span> : void 0}
                                                                {orders.shipping_address.province ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Province">{orders.shipping_address.province ? orders.shipping_address.province + " (" + orders.shipping_address.province_code + ")" : ''}<br /></span> : void 0}
                                                                {orders.shipping_address.zip ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Zip">{orders.shipping_address.zip}<br /></span> : void 0}
                                                                {orders.shipping_address.country ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Country">{orders.shipping_address.country + " (" + orders.shipping_address.country_code + ")"}</span> : void 0}
                                                            </div>
                                                        }
                                                        position="top center"
                                                        on="click" className="points-tooltip">
                                                        <div>
                                                            <style dangerouslySetInnerHTML={{
                                                                __html: `
                                                                .points-tooltip {
                                                                    height: auto !important;
                                                                    max-width: 500px !important;
                                                                }
                                                            `}} />
                                                            <div className="text-center">
                                                                <h3>Change Shipping Information</h3>
                                                            </div>
                                                            <div className="form_wrap">
                                                                <div className="column column_4_12">
                                                                    <div className="form_row">
                                                                        <div className="form_item">
                                                                            <div className="form_input">
                                                                                <label>Email</label>
                                                                                <input type="email" defaultValue={orders.email} onBlur={event => this.changeShippingInformation(orders, "email", event.target.value)} />
                                                                                <span className="bottom_border"></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="column column_4_12">
                                                                    <div className="form_row">
                                                                        <div className="form_item">
                                                                            <div className="form_input">
                                                                                <label>Name</label>
                                                                                <input type="text" defaultValue={orders.shipping_address.name} onBlur={event => this.changeShippingInformation(orders, "name", event.target.value)} />
                                                                                <span className="bottom_border"></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="column column_4_12">
                                                                    <div className="form_row">
                                                                        <div className="form_item">
                                                                            <div className="form_input">
                                                                                <label>Address 1</label>
                                                                                <input type="text" defaultValue={orders.shipping_address.address1} onBlur={event => this.changeShippingInformation(orders, "address1", event.target.value)} />
                                                                                <span className="bottom_border"></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="column column_4_12">
                                                                    <div className="form_row">
                                                                        <div className="form_item">
                                                                            <div className="form_input">
                                                                                <label>Address 2</label>
                                                                                <input type="text" defaultValue={orders.shipping_address.address2} onBlur={event => this.changeShippingInformation(orders, "address2", event.target.value)} />
                                                                                <span className="bottom_border"></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="column column_4_12">
                                                                    <div className="form_row">
                                                                        <div className="form_item">
                                                                            <div className="form_input">
                                                                                <label>City</label>
                                                                                <input type="text" defaultValue={orders.shipping_address.city} onBlur={event => this.changeShippingInformation(orders, "city", event.target.value)} />
                                                                                <span className="bottom_border"></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="column column_4_12">
                                                                    <div className="form_row">
                                                                        <div className="form_item">
                                                                            <div className="form_input">
                                                                                <label>Zip</label>
                                                                                <input type="text" defaultValue={orders.shipping_address.zip} onBlur={event => this.changeShippingInformation(orders, "zip", event.target.value)} />
                                                                                <span className="bottom_border"></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="column column_12_12 text-center">
                                                                    <span style={{ fontStyle: 'italic', fontSize: '1.2rem' }}>Shipping information will be automatically updated when you change the input box</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Popup>
                                                    :
                                                    <span></span>
                                                }
                                            </td>
                                            <td>
                                                {(() => {
                                                    // orders tab product name
                                                    return orders.line_items.map((li, li_index) => {
                                                        if ((li_index + 1) != orders.line_items.length) {
                                                            return <span key={li_index}>{li.title} &nbsp; <span onClick={() => this.removeThisItem(li)} className="fas fa-times clickable" style={{ color: 'red' }} title="Exclude this item" /> <hr /></span>
                                                        } else {
                                                            return <span key={li_index}>{li.title} &nbsp; <span onClick={() => this.removeThisItem(li)} className="fas fa-times clickable" style={{ color: 'red' }} title="Exclude this item" /></span>
                                                        }
                                                    })
                                                })()}
                                            </td>
                                            <td className="text-center">
                                                {(() => {
                                                    return orders.line_items.map((li, li_index) => {
                                                        return <span key={li_index}>{li.variant_title ? li.variant_title : "N/A"} {(li_index + 1) != orders.line_items.length ? <hr /> : void 0}</span>
                                                    })
                                                })()}
                                            </td>
                                            <td className="text-center">
                                                {(() => {
                                                    return orders.line_items.map((li, li_index) => {
                                                        return <span key={li_index}>{li.quantity + "x"} {(li_index + 1) != orders.line_items.length ? <hr /> : void 0}</span>;
                                                        // return (
                                                        //     <Popup
                                                        //         trigger={<span className="clickable" key={li_index}>{li.quantity + "x"} {(li_index + 1) != orders.line_items.length ? <hr /> : void 0}</span>}
                                                        //         position="top center"
                                                        //         on="click" className="points-tooltip" key={li_index}>
                                                        //         <div className="text-center">
                                                        //             <h3>Change Product Quantity</h3>
                                                        //             <div className="form_wrap">
                                                        //                 <div className="form_row">
                                                        //                     <div className="form_item">
                                                        //                         <div className="form_input">
                                                        //                             <input type="number" defaultValue={li.quantity} onBlur={event => this.changeOrderQuantity(li, event)} />
                                                        //                             <span className="bottom_border"></span>
                                                        //                         </div>
                                                        //                     </div>
                                                        //                 </div>
                                                        //             </div>
                                                        //         </div>
                                                        //     </Popup>
                                                        // );
                                                    })
                                                })()}
                                            </td>
                                            <td className="text-center">
                                                <div className="form_wrap">
                                                    {(() => {
                                                        return orders.line_items.map((li, li_index) => {
                                                            li.vendorLink = "";
                                                            state.vendorLinks.forEach(vendorLink => {
                                                                if (vendorLink.product_id == li.product_id) {
                                                                    li.vendorLink = vendorLink.link;
                                                                }
                                                            })

                                                            if (li.product_id) {
                                                                return (
                                                                    <div className="form_row" key={li_index}>
                                                                        <div className="form_item">
                                                                            <div className="form_input">
                                                                                <input className="vendorLink" id={li.product_id} value={li.vendorLink} type="text" onChange={event => this.addVendorLink(event)} />
                                                                                <span className="bottom_border"></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            } else {
                                                                return null;
                                                            }
                                                        })
                                                    })()}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                });
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
export default FulfillmentOrders;