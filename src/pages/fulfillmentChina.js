import React from 'react';
import toastr from 'toastr';
import withAuth from './../hoc/withAuth';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import Loading from '../components/loading';
import { REQUEST_ORDERS, GET_ORDERS_CHINA, CANCEL_REQUEST, GET_FULFILLMENT_CENTER_MESSAGE_COUNT,SUBMIT_FULFILLMENT_CENTER_MESSAGE } from './../queries';
import { Query, Mutation } from 'react-apollo';
import moment from 'moment';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import Popup from 'reactjs-popup';
import Modal from '../components/ModalComponent';
import FulfillmentBulkOrder from '../components/fulfillmentVirtualWarehouse';
import { _ } from 'core-js';
const points = require('../../Global_Values');
let totalPayment = 0;

class FulfillmentChina extends React.Component {
    constructor() {
        super();
        this.state = {
            activeTab: 'orders',
            orders: [],
            selectedOrder: [],
            vendorLinks: [],
            requested: [],
            totalOrders: null,
            pageNumber: 1,
            selectedPaidID: null,
            total_payment: null,
            client: points.paypalClient,
            totalPayment: 0.0,
            isChecked: false,
            currentPageLimit: 50,
            totalOrderStatus: 1,
            limit: 0,

            //quote
            productName: '',
            productImage: '',
            productVendorLink: '',
            timeOut: null,

            // tracking info
            tnData: null
        }

        this.searchProduct = this.searchProduct.bind(this);
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

        // get request data
        var gqlPayload = {"query":"{\n  getAllOrdersID(id:\""+this.props.session.getCurrentUser.id+"\"){\n    orders_id\n  }\n}","variables":null,"operationName":null}
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gqlPayload)
        })
        .then(res => res.json())
        .then(gqlResult => {
            if(!gqlResult.data.getAllOrdersID){
                this.setState({
                    requested: []
                })
            } else {
                this.setState({
                    requested: gqlResult.data.getAllOrdersID.orders_id
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
                this.requestAllOrders();
            }
        })
        .catch(err => {
            toastr.clear();
            toastr.warning("Please refresh the page","An Error has occured")
        });
        
        const param = points.getURLParameters(window.location.href);
        if(param.tab){
            if(param.tab == "orders" || param.tab == "approved" || param.tab == "denied" || param.tab == "order_status"){
                this.setState({
                    activeTab: param.tab
                })
            }
        }

        if(totalPayment){
            this.setState({
                totalPayment: totalPayment
            })
        }
    }

    componentWillUnmount(){
        totalPayment = parseFloat(this.state.totalPayment)
    }

    // to get total page pagination count depending on the selected store and active tab
    getTotalOrdersCount(){
        var payload = {"query":"{\n  getChinaOrdersCount(id: \""+this.props.session.getCurrentUser.id+"\", filter:\""+this.state.activeTab+"\"){\n    count\n  }\n}","variables":null,"operationName":null};
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(ress => {
            var calculate = Math.ceil(ress.data.getChinaOrdersCount.count / this.state.currentPageLimit);
            this.setState({
                totalOrderStatus: calculate
            })
        })
        .catch(err => {
            console.log("fulfillmentChina.js", err)
        });
    }

    submitMessage(submitMessage){
        if(this.state.productName && this.state.productVendorLink){
            submitMessage().then(async ({ data }) => {
                document.querySelector('[name="productName"]').value = "";
                document.querySelector('[name="productVendorLink"]').value = "";
                this.setState({
                    productName: '',
                    productVendorLink: '',
                    productImage: ''
                }, () => {
                    toastr.clear();
                    toastr.success("Please wait for the reply of the admin.","Success");
                })
            }).catch(error => {
                console.error("ERR =>", error);
            });
        } else {
            toastr.clear();
            toastr.warning("Product Name and vendor link is required.","Required!")
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
        fetch(points.apiServer+'/search', {
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

    requestAllOrders(){
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
                    page: this.state.pageNumber
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

    changePageNumber(event, isNext){
        if(event){
            this.setState({
                pageNumber: parseInt(event.target.innerHTML)
            }, () => {
                this.requestAllOrders();
            })
        } else {
            if(isNext || this.state.pageNumber != 1){
                this.setState({
                    pageNumber: isNext ? this.state.pageNumber+1 : this.state.pageNumber-1
                }, () => {
                    this.requestAllOrders();
                })
            }
        }
    }

    onTabsToggle(tabs){
        this.setState({
            pageNumber: 1,
            activeTab: tabs
        }, () => {
            if(tabs == "order_status"){
                this.getTotalOrdersCount()
            }
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

    limitTheNumberOfOrders(value){
        this.setState({
            limit: parseInt(value)
        })
    }

    onPaymentSuccess(success){
        var currentUser = this.props.session.getCurrentUser;
        var payload = {"query":"mutation{\n  sendPayment(id:\""+currentUser.id+"\", store_url:\""+currentUser.store_url+"\", store_token:\""+currentUser.store_token+"\", store_location_id:\""+currentUser.store_location_id+"\", total_payment:\""+this.state.totalPayment+"\", payerID:\""+success.payerID+"\", paymentID:\""+success.paymentID+"\", paymentToken:\""+success.paymentToken+"\"){\n    id\n\t}\n}","variables":null};
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(result => {
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.clear();
            toastr.success("Your payment of <strong>$"+this.state.totalPayment+"</strong> has been successfully transfered","Payment Success");
            setTimeout(function() {
                document.getElementById("approvedBtn").click();
            }, 1000);
        });
    }

    onPaymentError(error){
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.clear();
        toastr.warning("Test error","An error as occured");
    }

    requestOrders(requestOrders, event){
        var self = this;
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.info("Loading Please wait...","");
        if(self.state.selectedOrder.length != 0){
            requestOrders().then(({ data }) => {
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
            if(add.address2){
                add.address1 += add.address2;
            }
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
            this.setState({
                selectedOrder: currentSelectedOrder
            })
        }
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

    pagination(c, m) {
        var current = c,
            last = m,
            delta = 2,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            l;
    
        for (let i = 1; i <= last; i++) {
            if (i == 1 || i == last || i >= left && i < right) {
                range.push(i);
            }
        }
        
        for (let i of range) {
            if (l) {
                if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(<button onClick={event => this.changePageNumber(event)} className={c == i ? "dwobtn pagination-number pagination-number-active" : "dwobtn pagination-number"} key={i}>{i}</button>);
            l = i;
        }
    
        return rangeWithDots;
    }

    getTrackingInfo(tn){
        fetch('/getTrackingInfo/'+tn)
        .then(res => res.json())
        .then(res => {
            this.setState({
                tnData: res
            })
            // return (
            //     <li>
            //         <span style={{fontSize: 20}}>Label Created</span><br/>
            //         <span style={{fontSize: 12}}>03/22/2019 14:15</span>
            //     </li>
            // );
        })
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Fulfillment Center - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        var state = this.state;
        var store_url = this.props.session.getCurrentUser.store_url;
        const paginationDOM = (
            <div className="china-fulfillment-pagination text-right">
                {state.activeTab != "order_status" &&
                    <input type="number" defaultValue={this.state.pageNumber} onBlur={event => {
                        this.setState({pageNumber: parseInt(event.target.value)}, () => {
                            this.requestAllOrders();
                        })
                    }} style={{width: 70, textAlign: 'center'}} />
                }
                <button className="dwobtn pagination-number" onClick={() => this.changePageNumber(null, false)}><span className="fas fa-arrow-left"></span></button>
                {(() => {
                    var totalPagination = Math.ceil(this.state.totalOrders / points.item_per_page);
                    return this.pagination(this.state.pageNumber, state.activeTab != "order_status" ? totalPagination : state.totalOrderStatus);
                })()}
                <button className="dwobtn pagination-number" onClick={() => this.changePageNumber(null, true)}><span className="fas fa-arrow-right"></span></button>
            </div>
        );

        return (
            <div className="china-fulfillment page-container">
                {this.head()}
                <div className="fulfillment-title">
                    <h1 style={{margin: 0}}>Fulfillment Center</h1>
                </div>
                <div>
                    <div className="column column_12_12">
                        <div className="column column_1_12">
                            <button className={state.activeTab == "orders" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("orders")}>Orders</button>
                        </div>
                        <div className="column column_1_12">
                            <button id="approvedBtn" className={state.activeTab == "approved" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("approved")}>Approved</button>
                        </div>
                        <div className="column column_1_12">
                            <button className={state.activeTab == "denied" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("denied")}>Denied</button>
                        </div>
                        <div className="column column_2_12">
                            <button className={state.activeTab == "order_status" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("order_status")}>Order Status</button>
                        </div>
                        <div className="column column_2_12">
                            <button className={state.activeTab == "quote" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("quote")}>Get Estimated Quote</button>
                        </div>
                        {this.props.session.getCurrentUser.privilege == 10 && // User Privilege
                            <div className="column column_2_12">
                                <button className={state.activeTab == "vw" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("vw")}>Virtual Warehouse</button>
                            </div>
                        }
                        <div className="column column_2_12" style={{position: 'relative'}}>
                            <a href="/messaging-center">
                                <Query query={GET_FULFILLMENT_CENTER_MESSAGE_COUNT} variables={{id: this.props.session.getCurrentUser.id}} >
                                    {({ data, loading, refetch, error }) => {
                                        if(loading) return null;
                                        
                                        if(data && data.getCountOfAllMessage.count != 0){
                                            return <span style={{fontSize: 12, backgroundColor: 'red', borderRadius: '50%', color: '#fff', fontWeight: 900, padding: '0 10px', position: 'absolute', top: '-10px', right: 0}}>{data.getCountOfAllMessage.count}</span>
                                        } else {
                                            return null;
                                        }
                                    }}
                                </Query>
                                <button className="stretch-width dwobtn">Messaging Center</button>
                            </a>
                        </div>
                        <div className="column column_1_12">
                            <a href="https://app.productlistgenie.io/Start_Here/5c77467c03b3a16b229ca852" target="_blank">
                                <button className="stretch-width dwobtn">FAQ</button>
                            </a>
                        </div>
                    </div>

                    <div className="text-center clear">
                        <br/>
                        {state.activeTab == "orders" &&
                            <div className="float-right">
                                <Mutation
                                    mutation={REQUEST_ORDERS}
                                    variables={{
                                        id: this.props.session.getCurrentUser.id,
                                        orders: JSON.stringify(this.state.selectedOrder) }}
                                    >
                                    {(requestOrders, { data, loading, error }) => {
                                        return <button className="dwobtn" id="request" style={{margin: 0, fontSize: 15}} onClick={this.requestOrders.bind(this, requestOrders)}>Request Selected</button>
                                    }}
                                </Mutation>
                            </div>
                        }
                        {state.activeTab != "quote" && state.activeTab != "vw" ? <h2 className="capitalize">{state.activeTab.replace("_"," ")} List</h2> : void 0}
                    </div>
                    {(() => {
                        if(state.activeTab == "orders"){
                            // for orders tab
                            return (
                                <div className="table-container clear">
                                    {paginationDOM}
                                    <br/>
                                    <table className="table-list">
                                        <thead>
                                            <tr>
                                                <th className="text-center">#</th>
                                                <th className="text-center clickable" style={{width: '100px'}} onClick={() => this.checkAllCheckbox()}>Check All{state.selectedOrder.length != 0 ? " ("+state.selectedOrder.length+")" : void 0}</th>
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
                                                if(this.state.totalOrders == 0){
                                                    // if no order
                                                    return (
                                                        <tr>
                                                            <td colSpan="9" className="text-center">
                                                                <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>Empty... check back soon!</span>
                                                            </td>
                                                        </tr>
                                                    );
                                                } else if(state.orders.length == 0){
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
                                                    if(!orders.order_note){
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
                                                                {
                                                                    !isSelected && orders.shipping_address && orders.line_items.length != 0 ?
                                                                        orders.shipping_address && orders.shipping_address.address1.length > 80 ?
                                                                            <Popup
                                                                                trigger={<span className="clickable fas fa-question-circle" style={{color: 'red'}} />}
                                                                                position="top center"
                                                                                on="hover" className="points-tooltip">
                                                                                <div className="helperText" style={{padding: 10, lineHeight: 1.5}}>
                                                                                    Please check the address.
                                                                                </div>
                                                                            </Popup>
                                                                        :
                                                                        isHaveVendorLink.length == orders.line_items.length ? <input type="checkbox" id={orders.id} onChange={event => this.includeThisItem(orders, event)} /> : "Vendor Link Required."
                                                                    :
                                                                        <div className="form_buttons">
                                                                            <Mutation
                                                                                mutation={CANCEL_REQUEST}
                                                                                variables={{
                                                                                    id: this.props.session.getCurrentUser.id,
                                                                                    orderid: orders.id.toString(),
                                                                                    isRefactored: true }}
                                                                                >
                                                                                {(cancelRequest, { data, loading, error }) => {
                                                                                    return (
                                                                                        <button className="btn" style={{padding: 5, backgroundColor: 'red', borderRadius: 5, fontSize: 10, border: '1px solid red'}} onClick={() => this.cancelRequest(cancelRequest, orders.id.toString())}>
                                                                                            Cancel Request
                                                                                        </button>
                                                                                    );
                                                                                }}
                                                                            </Mutation>
                                                                        </div>
                                                                }
                                                            </td>
                                                            <td>{moment(new Date(orders.created_at)).startOf('second').fromNow()}</td>
                                                            <td className="text-center">
                                                                <Popup
                                                                    trigger={<span className="fas fa-envelope clickable" style={{color: 'green'}} title="Add Note to this order"></span>}
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
                                                                </Popup> <br/><br/>
                                                                <a href={"https://"+store_url+"/admin/orders/"+orders.id} target="_blank">{"#"+orders.order_number}</a>
                                                            </td>
                                                            <td>
                                                                {orders.shipping_address ?
                                                                    <Popup
                                                                        trigger={
                                                                            <div className="clickable" style={{color: 'inherit'}}>
                                                                                <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.email}</span><br/>
                                                                                <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.shipping_address ? orders.shipping_address.name : void 0}</span><br/>
                                                                                <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.shipping_address ? orders.shipping_address.address1 : void 0}</span><br/>
                                                                                <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.shipping_address ? orders.shipping_address.city : void 0}</span><br/>
                                                                                <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.shipping_address ? orders.shipping_address.province ? orders.shipping_address.province + " " + orders.shipping_address.zip : orders.shipping_address.zip : void 0}</span><br/>
                                                                                <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.shipping_address ? orders.shipping_address.country : void 0}</span>
                                                                            </div>
                                                                        }
                                                                        position="top center"
                                                                        on="click" className="points-tooltip">
                                                                        <div>
                                                                            <style dangerouslySetInnerHTML={{__html: `
                                                                                .points-tooltip {
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
                                                                                <div className="column column_6_12">
                                                                                    <div className="form_row">
                                                                                        <div className="form_item">
                                                                                            <div className="form_input">
                                                                                                <label>Province</label>
                                                                                                <input type="text" defaultValue={orders.shipping_address.province} onBlur={event => this.changeShippingInformation(orders, "province", event.target.value)} />
                                                                                                <span className="bottom_border"></span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="column column_6_12">
                                                                                    <div className="form_row">
                                                                                        <div className="form_item">
                                                                                            <div className="form_input">
                                                                                                <label>Country</label>
                                                                                                <input type="text" defaultValue={orders.shipping_address.country} onBlur={event => this.changeShippingInformation(orders, "country", event.target.value)} />
                                                                                                <span className="bottom_border"></span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="column column_12_12 text-center">
                                                                                    <span style={{fontStyle: 'italic', fontSize: '1.2rem'}}>Shipping information will be automatically updated when you change the input box</span>
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
                                                                        if((li_index + 1) != orders.line_items.length){
                                                                            return <span key={li_index}>{li.title} &nbsp; <span onClick={() => this.removeThisItem(li)} className="fas fa-times clickable" style={{color: 'red'}} title="Exclude this item" /> <hr/></span>
                                                                        } else {
                                                                            return <span key={li_index}>{li.title} &nbsp; <span onClick={() => this.removeThisItem(li)} className="fas fa-times clickable" style={{color: 'red'}} title="Exclude this item" /></span>
                                                                        }
                                                                    })
                                                                })()}
                                                            </td>
                                                            <td className="text-center">
                                                                {(() => {
                                                                    return orders.line_items.map((li, li_index) => {
                                                                        return <span key={li_index}>{li.variant_title ? li.variant_title : "N/A"} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                    })
                                                                })()}
                                                            </td>
                                                            <td className="text-center">
                                                                {(() => {
                                                                    return orders.line_items.map((li, li_index) => {
                                                                        return (
                                                                            <Popup
                                                                                trigger={<span className="clickable" key={li_index}>{li.quantity+"x"} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>}
                                                                                position="top center"
                                                                                on="click" className="points-tooltip" key={li_index}>
                                                                                <div className="text-center">
                                                                                    <h3>Change Product Quantity</h3>
                                                                                    <div className="form_wrap">
                                                                                        <div className="form_row">
                                                                                            <div className="form_item">
                                                                                                <div className="form_input">
                                                                                                    <input type="number" defaultValue={li.quantity} onBlur={event => this.changeOrderQuantity(li, event)} />
                                                                                                    <span className="bottom_border"></span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Popup>
                                                                        );
                                                                    })
                                                                })()}
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="form_wrap">
                                                                    {(() => {
                                                                        return orders.line_items.map((li, li_index) => {
                                                                            li.vendorLink = "";
                                                                            state.vendorLinks.forEach(vendorLink => {
                                                                                if(vendorLink.product_id == li.product_id){
                                                                                    li.vendorLink = vendorLink.link;
                                                                                }
                                                                            })
                                                                            
                                                                            if(li.product_id){
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
                                    {paginationDOM}
                                </div>
                            );
                        } else if(state.activeTab == "approved" || state.activeTab == "denied"){
                            // for approved and denied tab
                            return (
                                <div className="table-container clear">
                                    {state.activeTab == "approved" &&
                                        <div className="form_buttons">
                                            {parseFloat(state.totalPayment) != 0 &&
                                                <div style={{ paddingTop: 5, display: 'flex' }}>
                                                    {/* <Popup
                                                        trigger={<button className="dwobtn">Pay option</button>}
                                                        position="bottom center"
                                                        on="click" className="points-tooltip">
                                                        <div style={{textAlign: 'left', padding: 10, lineHeight: 1.5}}>
                                                            <div className="form_wrap">
                                                                <div className="form_row">
                                                                    <div className="form_item">
                                                                        <div className="form_input">
                                                                            <label>Select count of orders to pay first.</label>
                                                                            <input type="number" placeholder="e.g. first 100 (set to 0 to display all)" defaultValue={state.limit} onBlur={event => this.limitTheNumberOfOrders(event.target.value)} />
                                                                            <span className="bottom_border"></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Popup>
                                                    &nbsp; &nbsp; */}
                                                    <span style={{marginRight: 20, padding: 5}}>Total Payment: <strong id="payment">${points.commafy(state.totalPayment)}</strong></span>
                                                    <PaypalExpressBtn env={"sandbox"} client={state.client} currency={'USD'} total={parseFloat(state.totalPayment)} onError={this.onPaymentError.bind(this)} onSuccess={this.onPaymentSuccess.bind(this)} />
                                                </div>
                                            }
                                        </div>
                                    }
                                    <br/>
                                    <table className="table-list">
                                        <thead>
                                            <tr>
                                                <th className="text-center">#</th>
                                                <th className="text-center">Action</th>
                                                <th>{state.activeTab == "approved" ? "Approved Date" : "Denied Date"}</th>
                                                <th>Order Number</th>
                                                <th>Shipping Information</th>
                                                <th>Product</th>
                                                <th className="text-center">Variant</th>
                                                <th className="text-center">Quantity</th>
                                                {state.activeTab == "approved" ? <th className="text-center">Shipping Fee</th> : void 0}
                                                {(() => {
                                                    if(state.activeTab == "approved"){
                                                        return <th className="text-center">Approved Price</th>;
                                                    } else if(state.activeTab == "denied"){
                                                        return <th className="text-center" width="300px">Note</th>;
                                                    }
                                                })()}
                                                {state.activeTab == "approved" ? <th className="text-center">Total Price</th> : void 0}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(() => {
                                                return (
                                                    <Query query={GET_ORDERS_CHINA} variables={{
                                                        id: this.props.session.getCurrentUser.id,
                                                        filter: state.activeTab,
                                                        offset: 0,
                                                        limit: state.limit
                                                    }} onCompleted={datas => {
                                                        if(state.activeTab == "approved"){
                                                            var totalPayment = 0;
                                                            datas.getChinaOrders.forEach(data => {
                                                                if(data.isRefactored){
                                                                    data.line_items.forEach(li => {
                                                                        totalPayment += li.quantity * li.approve_price;
                                                                    })
                                                                    totalPayment += parseFloat(data.shipping_cost);
                                                                } else {
                                                                    var orders = JSON.parse(data.orders);
                                                                    orders.line_items.forEach(li => {
                                                                        totalPayment += li.quantity * li.price;
                                                                    })
                                                                    totalPayment += parseFloat(orders.shipping_fee.shipping_methods[0].cost);
                                                                }
                                                            });
                                                            this.setState({
                                                                totalPayment: totalPayment.toFixed(2)
                                                            })
                                                        }
                                                    }} >
                                                        {({ data, loading, refetch, error }) => {
                                                            if(loading) {
                                                                return (
                                                                    <tr>
                                                                        <td colSpan="11" className="text-center">
                                                                            <Loading height={200} width={200} />
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }

                                                            if(data.getChinaOrders.length == 0){
                                                                return (
                                                                    <tr>
                                                                        <td colSpan="11" className="text-center">
                                                                            <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>Empty... check back soon!</span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                            
                                                            return data.getChinaOrders.map((datas, d_index) => {
                                                                if(datas.isRefactored){
                                                                    var hasShippingFee = datas.shipping_cost && datas.shipping_method && datas.shipping_days_min && datas.shipping_days_max ? true : false;
                                                                    return (
                                                                        <tr key={d_index}>
                                                                            <td className="text-center">{d_index+1}</td>
                                                                            <td>
                                                                                <div className="form_buttons">
                                                                                    <Mutation
                                                                                        mutation={CANCEL_REQUEST}
                                                                                        variables={{
                                                                                            id: this.props.session.getCurrentUser.id,
                                                                                            orderid: datas.order_id,
                                                                                            isRefactored: true }}
                                                                                        >
                                                                                        {(cancelRequest, { cancelData, loading, error }) => {
                                                                                            return (
                                                                                                <button className="btn" style={{padding: 5, backgroundColor: 'red', borderRadius: 5, fontSize: 10, border: '1px solid red'}} onClick={() => this.cancelRequest(cancelRequest, datas.order_id, refetch)}>
                                                                                                    Cancel Order
                                                                                                </button>
                                                                                            );
                                                                                        }}
                                                                                    </Mutation>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                {/* Date Approved or Date Denied */}
                                                                                {moment(new Date(parseInt(datas.date_approved ? datas.date_approved : datas.date_denied))).startOf('second').fromNow()}
                                                                            </td>
                                                                            <td>
                                                                                {/* Order number */}
                                                                                <a href={"https://"+store_url+"/admin/orders/"+datas.order_id} target="_blank">{"#"+datas.shipping_information.order_number}</a>
                                                                            </td>
                                                                            <td>
                                                                                {/* Shipping Information */}
                                                                                <div className="ellipsis" style={{ width: 200 }}>
                                                                                    {datas.shipping_information.email ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Email">{datas.shipping_information.email}<br /></span> : void 0}
                                                                                    {datas.shipping_information.name ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Name">{datas.shipping_information.name}<br /></span> : void 0}
                                                                                    {datas.shipping_information.address1 ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Address1">{datas.shipping_information.address1}<br /></span> : void 0}
                                                                                    {datas.shipping_information.address2 ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Address2">{datas.shipping_information.address2} <br /></span> : void 0}
                                                                                    {datas.shipping_information.city ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="City">{datas.shipping_information.city}<br /></span> : void 0}
                                                                                    {datas.shipping_information.province ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Province">{datas.shipping_information.province ? datas.shipping_information.province + " (" + datas.shipping_information.province_code + ")" : ''}<br /></span> : void 0}
                                                                                    {datas.shipping_information.zip ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Zip">{datas.shipping_information.zip}<br /></span> : void 0}
                                                                                    {datas.shipping_information.country ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Country">{datas.shipping_information.country + " (" + datas.shipping_information.country_code + ")"}</span> : void 0}
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                {/* Product Name */}
                                                                                {(() => {
                                                                                    return datas.line_items.map((li, li_index) => {
                                                                                        return <span key={li_index}>{li.product_name} {(li_index + 1) != datas.line_items.length ? <hr/> : void 0}</span>
                                                                                    })
                                                                                })()}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {/* Variant Name */}
                                                                                {(() => {
                                                                                    return datas.line_items.map((li, li_index) => {
                                                                                        return <span key={li_index}>{li.variant_name ? li.variant_name : "N/A"} {(li_index + 1) != datas.line_items.length ? <hr/> : void 0}</span>
                                                                                    })
                                                                                })()}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {/* Order Quantity */}
                                                                                {(() => {
                                                                                    return datas.line_items.map((li, li_index) => {
                                                                                        return <span key={li_index}>{li.quantity+"x"} {(li_index + 1) != datas.line_items.length ? <hr/> : void 0}</span>
                                                                                    })
                                                                                })()}
                                                                            </td>
                                                                            {state.activeTab == "approved" &&
                                                                                <td className="text-center">
                                                                                    {/* Shipping Fee */}
                                                                                    {hasShippingFee &&
                                                                                        <span className="capitalize">
                                                                                            {datas.shipping_method}<br/>
                                                                                            {datas.shipping_days_min +"-"+ datas.shipping_days_max + " Days"} <br/>
                                                                                            {"$"+datas.shipping_cost}
                                                                                        </span>
                                                                                    }
                                                                                </td>
                                                                            }
                                                                            {state.activeTab == "approved" ?
                                                                                <td className="text-center" width="130px">
                                                                                    {/* Order Approved Price */}
                                                                                    {(() => {
                                                                                        return datas.line_items.map((li, li_index) => {
                                                                                            return <span key={li_index}>{"$"+li.approve_price} {(li_index + 1) != datas.line_items.length ? <hr/> : void 0}</span>
                                                                                        })
                                                                                    })()}
                                                                                </td>
                                                                            :
                                                                                <td className="text-center">
                                                                                    {/* Denied Note */}
                                                                                    {datas.denied_note}
                                                                                </td>
                                                                            }
                                                                            {state.activeTab == "approved" &&
                                                                                <td className="text-center">
                                                                                    {(() => {
                                                                                        var totalPrice = 0;
                                                                                        datas.line_items.map((li, li_index) => {
                                                                                            totalPrice += li.quantity * li.approve_price;
                                                                                        })
                                                                                        totalPrice += parseFloat(datas.shipping_cost);
            
                                                                                        return (
                                                                                            <span className="totalPrice">{"$"+totalPrice.toFixed(2)}</span>
                                                                                        );
                                                                                    })()}
                                                                                </td>
                                                                            }
                                                                        </tr>
                                                                    );
                                                                }

                                                                var orders = JSON.parse(datas.orders);
                                                                return (
                                                                    <tr key={d_index}>
                                                                        <td className="text-center">{d_index+1}</td>
                                                                        <td>
                                                                            <div className="form_buttons">
                                                                                <Mutation
                                                                                    mutation={CANCEL_REQUEST}
                                                                                    variables={{
                                                                                        id: this.props.session.getCurrentUser.id,
                                                                                        orderid: orders.id.toString(),
                                                                                        isRefactored: false }}
                                                                                    >
                                                                                    {(cancelRequest, { cancelData, loading, error }) => {
                                                                                        return (
                                                                                            <button className="btn" style={{padding: 5, backgroundColor: 'red', borderRadius: 5, fontSize: 10, border: '1px solid red'}} onClick={() => this.cancelRequest(cancelRequest, orders.id.toString(), refetch)}>
                                                                                                Cancel Order
                                                                                            </button>
                                                                                        );
                                                                                    }}
                                                                                </Mutation>
                                                                            </div>
                                                                        </td>
                                                                        <td>{moment(new Date(parseInt(datas.date_approved ? datas.date_approved : datas.date_denied))).startOf('second').fromNow()}</td>
                                                                        <td><a href={"https://"+store_url+"/admin/orders/"+orders.id} target="_blank">{"#"+orders.order_number}</a></td>
                                                                        <td>
                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.email}</span><br/>
                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.shipping_address.name}</span><br/>
                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.shipping_address.address1}</span><br/>
                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.shipping_address.city}</span><br/>
                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.shipping_address.province} {orders.shipping_address.zip}</span><br/>
                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.shipping_address.country}</span>
                                                                        </td>
                                                                        <td>
                                                                            {(() => {
                                                                                return orders.line_items.map((li, li_index) => {
                                                                                    return <span key={li_index}>{li.title} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                })
                                                                            })()}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {(() => {
                                                                                return orders.line_items.map((li, li_index) => {
                                                                                    return <span key={li_index}>{li.variant_title ? li.variant_title : "N/A"} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                })
                                                                            })()}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {(() => {
                                                                                return orders.line_items.map((li, li_index) => {
                                                                                    return <span key={li_index}>{li.quantity+"x"} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                })
                                                                            })()}
                                                                        </td>
                                                                        {state.activeTab == "approved" &&
                                                                            <td className="text-center">
                                                                                {orders.shipping_fee.shipping_methods[0].total_cost &&
                                                                                    <span className="capitalize">
                                                                                        {orders.shipping_fee.shipping_methods[0].method}<br/>
                                                                                        {orders.shipping_fee.transit_min +"-"+ orders.shipping_fee.transit_max + " Days"} <br/>
                                                                                        {"$"+orders.shipping_fee.shipping_methods[0].total_cost}
                                                                                    </span>
                                                                                }
                                                                            </td>
                                                                        }
                                                                        {state.activeTab == "approved" ?
                                                                            <td className="text-center" width="130px">
                                                                                {(() => {
                                                                                    return orders.line_items.map((li, li_index) => {
                                                                                        return <span key={li_index}>{"$"+li.price} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                    })
                                                                                })()}
                                                                            </td>
                                                                        :
                                                                            <td className="text-center">
                                                                                {datas.denied_note}
                                                                            </td>
                                                                        }
                                                                        {state.activeTab == "approved" &&
                                                                            <td className="text-center">
                                                                                {(() => {
                                                                                    var totalPrice = 0;
                                                                                    orders.line_items.map((li, li_index) => {
                                                                                        totalPrice += li.quantity * li.price;
                                                                                    })
                                                                                    totalPrice += parseFloat(orders.shipping_fee.shipping_methods[0].total_cost);
        
                                                                                    return (
                                                                                        <span className="totalPrice">{"$"+totalPrice.toFixed(2)}</span>
                                                                                    );
                                                                                })()}
                                                                            </td>
                                                                        }
                                                                    </tr>
                                                                );
                                                            })
                                                        }}
                                                    </Query>
                                                );
                                            })()}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        } else if(state.activeTab == "order_status"){
                            return (
                                <div className="table-container clear">
                                    {paginationDOM}
                                    <br/>
                                    <table className="table-list">
                                        <thead>
                                            <tr>
                                                <th className="text-center">#</th>
                                                <th>Date</th>
                                                <th>Shipping Information</th>
                                                <th>Order Number</th>
                                                <th>Product</th>
                                                <th className="text-center">Variant</th>
                                                <th className="text-center">Quantity</th>
                                                <th className="text-center">Price</th>
                                                <th className="text-center">Shipping Fee</th>
                                                <th className="text-center">Total Price</th>
                                                <th className="text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <Query query={GET_ORDERS_CHINA} variables={{id: this.props.session.getCurrentUser.id, filter: state.activeTab, offset: ((state.pageNumber-1) * state.currentPageLimit) }}>
                                                {({ data, loading, refetch, error }) => {
                                                    if(loading) {
                                                        return (
                                                            <tr>
                                                                <td className="text-center" colSpan="11">
                                                                    <Loading height={150} width={150} />
                                                                </td>
                                                            </tr>
                                                        );
                                                    }

                                                    if(data.getChinaOrders.length == 0){
                                                        return (
                                                            <tr>
                                                                <td className="text-center" colSpan="11">
                                                                    <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>Empty... check back soon!</span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                    
                                                    return data.getChinaOrders.map((datas, d_index) => {
                                                        if(datas.isRefactored){
                                                            var hasShippingFee = datas.shipping_cost && datas.shipping_method && datas.shipping_days_min && datas.shipping_days_max ? true : false;
                                                            return (
                                                                <tr key={d_index}>
                                                                    <td className="text-center">{d_index+1}</td>
                                                                    <td>{moment(new Date(parseInt(datas.date_paid ? datas.date_paid : datas.date_approved))).startOf('second').fromNow()}</td>
                                                                    <td><a href={"https://"+store_url+"/admin/orders/"+datas.order_id} target="_blank">{datas.shipping_information.order_number}</a></td>
                                                                    <td>
                                                                        {/* Shipping Information */}
                                                                        <div className="ellipsis" style={{ width: 200 }}>
                                                                            {datas.shipping_information.email ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Email">{datas.shipping_information.email}<br /></span> : void 0}
                                                                            {datas.shipping_information.name ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Name">{datas.shipping_information.name}<br /></span> : void 0}
                                                                            {datas.shipping_information.address1 ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Address1">{datas.shipping_information.address1}<br /></span> : void 0}
                                                                            {datas.shipping_information.address2 ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Address2">{datas.shipping_information.address2} <br /></span> : void 0}
                                                                            {datas.shipping_information.city ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="City">{datas.shipping_information.city}<br /></span> : void 0}
                                                                            {datas.shipping_information.province ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Province">{datas.shipping_information.province ? datas.shipping_information.province + " (" + datas.shipping_information.province_code + ")" : ''}<br /></span> : void 0}
                                                                            {datas.shipping_information.zip ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Zip">{datas.shipping_information.zip}<br /></span> : void 0}
                                                                            {datas.shipping_information.country ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Country">{datas.shipping_information.country + " (" + datas.shipping_information.country_code + ")"}</span> : void 0}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        {/* Product Name */}
                                                                        {(() => {
                                                                            return datas.line_items.map((li, li_index) => {
                                                                                if(li.vendor_link){
                                                                                    return <span key={li_index}><a href={li.vendor_link} target="_blank" title="Vendor link availalble click here.">{li.product_name}</a> {(li_index + 1) != datas.line_items.length ? <hr/> : void 0}</span>
                                                                                } else {
                                                                                    return <span key={li_index}>{li.product_name} {(li_index + 1) != datas.line_items.length ? <hr/> : void 0}</span>
                                                                                }
                                                                            })
                                                                        })()}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {/* Variant Name */}
                                                                        {(() => {
                                                                            return datas.line_items.map((li, li_index) => {
                                                                                return <span key={li_index}>{li.variant_name ? li.variant_name : 'N/A'} {(li_index + 1) != datas.line_items.length ? <hr/> : void 0}</span>
                                                                            })
                                                                        })()}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {/* Quantity */}
                                                                        {(() => {
                                                                            return datas.line_items.map((li, li_index) => {
                                                                                return <span key={li_index}>{li.quantity+"x"} {(li_index + 1) != datas.line_items.length ? <hr/> : void 0}</span>
                                                                            })
                                                                        })()}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {/* Order Approved Price */}
                                                                        {(() => {
                                                                            return datas.line_items.map((li, li_index) => {
                                                                                return <span key={li_index}>{"$"+li.approve_price} {(li_index + 1) != datas.line_items.length ? <hr/> : void 0}</span>
                                                                            })
                                                                        })()}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {/* Shipping Fee */}
                                                                        {hasShippingFee &&
                                                                            <span className="capitalize">
                                                                                {datas.shipping_method}<br/>
                                                                                {datas.shipping_days_min +"-"+ datas.shipping_days_max + " Days"} <br/>
                                                                                {"$"+datas.shipping_cost}
                                                                            </span>
                                                                        }
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {/* Total Price */}
                                                                        {(() => {
                                                                            var totalPrice = 0;
                                                                            datas.line_items.map((li, li_index) => {
                                                                                totalPrice += li.quantity * li.approve_price;
                                                                            })
    
                                                                            return (
                                                                                <span className="totalPrice">{"$"+parseFloat(totalPrice).toFixed(2)}</span>
                                                                            );
                                                                        })()}
                                                                    </td>
                                                                    <td className="text-center" style={{backgroundColor: datas.isFinish ? 'transparent' : '#d0d0d0'}}>
                                                                        {(() => {
                                                                            if(datas.isFinish){
                                                                                return (
                                                                                    <Popup
                                                                                        trigger={<div className="form_buttons clickable">
                                                                                            <span>Tracking Number:</span> <br/>
                                                                                            <span style={{fontSize: 12}} onClick={() => this.getTrackingInfo(datas.tracking_number)}>{datas.tracking_number}</span>
                                                                                        </div>}
                                                                                        position="left center"
                                                                                        on="click" className="points-tooltip">
                                                                                        <div className="helperText" style={{padding: 10, lineHeight: 1.5}}>
                                                                                            <h3>Logistic Tracking</h3>
                                                                                            <ul style={{listStyleType: 'disc', paddingLeft: 40, textAlign: 'left'}}>
                                                                                                {(() => {
                                                                                                    if(state.tnData){
                                                                                                        if(state.tnData.data){
                                                                                                            return state.tnData.data.events.map((el,i) => {
                                                                                                                return (
                                                                                                                    <li style={{paddingBottom: 10, borderBottom: '1px solid #bdb9b9'}} key={i}>
                                                                                                                        <span className="capitalize" style={{fontSize: 15}}>{el.description}</span><br/>
                                                                                                                        <span style={{fontSize: 12}}>{new Date(el.time).toLocaleString('en-US', { day: "2-digit", month: "short", year: "numeric" })}</span>
                                                                                                                    </li>
                                                                                                                );
                                                                                                            })
                                                                                                        } else {
                                                                                                            return (
                                                                                                                <div className="text-center">
                                                                                                                    No Result
                                                                                                                </div>
                                                                                                            );
                                                                                                        }
                                                                                                    } else {
                                                                                                        return (
                                                                                                            <div className="text-center">
                                                                                                                <Loading height={100} width={100} />
                                                                                                            </div>
                                                                                                        );
                                                                                                    }
                                                                                                })()}
                                                                                            </ul>
                                                                                        </div>
                                                                                    </Popup>
                                                                                );
                                                                            } else {
                                                                                return (
                                                                                    <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>Pending</span>
                                                                                );
                                                                            }
                                                                        })()}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                        var orderObj = JSON.parse(datas.orders)
                                                        return (
                                                            <tr key={d_index}>
                                                                <td className="text-center">{d_index+1}</td>
                                                                <td>{moment(new Date(parseInt(datas.date_paid ? datas.date_paid : datas.date_approved))).startOf('second').fromNow()}</td>
                                                                <td><a href={"https://"+store_url+"/admin/orders/"+orderObj.id} target="_blank">{"#"+orderObj.order_number}</a></td>
                                                                <td>
                                                                    <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.email}</span><br/>
                                                                    <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.name}</span><br/>
                                                                    <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.address1}</span><br/>
                                                                    <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.city}</span><br/>
                                                                    <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.province} {orderObj.shipping_address.zip}</span><br/>
                                                                    <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.country}</span>
                                                                </td>
                                                                <td>
                                                                    {/* Product Name */}
                                                                    {(() => {
                                                                        return orderObj.line_items.map((li, li_index) => {
                                                                            if(li.vendorLink){
                                                                                return <span key={li_index}><a href={li.vendorLink} target="_blank" title="Vendor link availalble click here.">{li.title}</a> {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                            } else {
                                                                                return <span key={li_index}>{li.title} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                            }
                                                                        })
                                                                    })()}
                                                                </td>
                                                                <td className="text-center">
                                                                    {/* Variant */}
                                                                    {(() => {
                                                                        return orderObj.line_items.map((li, li_index) => {
                                                                            return <span key={li_index}>{li.variant_title ? li.variant_title : "N/A"} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                        })
                                                                    })()}
                                                                </td>
                                                                <td className="text-center">
                                                                    {/* Quantity */}
                                                                    {(() => {
                                                                        return orderObj.line_items.map((li, li_index) => {
                                                                            return <span key={li_index}>{li.quantity+"x"} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                        })
                                                                    })()}
                                                                </td>
                                                                <td className="text-center">
                                                                    {/* Price */}
                                                                    {(() => {
                                                                        return orderObj.line_items.map((li, li_index) => {
                                                                            return <span key={li_index}>{"$"+li.price} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>;
                                                                        })
                                                                    })()}
                                                                </td>
                                                                <td className="text-center">
                                                                    {/* Shipping Fee */}
                                                                    {orderObj.shipping_fee.shipping_methods[0].total_cost &&
                                                                        <span className="capitalize">
                                                                            {orderObj.shipping_fee.shipping_methods[0].method}<br/>
                                                                            {orderObj.shipping_fee.transit_min +"-"+ orderObj.shipping_fee.transit_max + " Days"} <br/>
                                                                            {"$"+orderObj.shipping_fee.shipping_methods[0].total_cost}
                                                                        </span>
                                                                    }
                                                                </td>
                                                                <td className="text-center">
                                                                    {/* Total Price */}
                                                                    {(() => {
                                                                        var totalPrice = 0;
                                                                        orderObj.line_items.map((li, li_index) => {
                                                                            totalPrice += li.quantity * li.price;
                                                                        })

                                                                        return (
                                                                            <span className="totalPrice">{"$"+parseFloat(totalPrice).toFixed(2)}</span>
                                                                        );
                                                                    })()}
                                                                </td>
                                                                <td className="text-center" style={{backgroundColor: datas.isFinish ? 'transparent' : '#d0d0d0'}}>
                                                                    {(() => {
                                                                        if(datas.isFinish){
                                                                            return (
                                                                                <Popup
                                                                                    trigger={<div className="form_buttons clickable">
                                                                                        <span>Tracking Number:</span> <br/>
                                                                                        <span style={{fontSize: 12}} onClick={() => this.getTrackingInfo(datas.tracking_number)}>{datas.tracking_number}</span>
                                                                                    </div>}
                                                                                    position="left center"
                                                                                    on="click" className="points-tooltip">
                                                                                    <div className="helperText" style={{padding: 10, lineHeight: 1.5}}>
                                                                                        <h3>Logistic Tracking</h3>
                                                                                        <ul style={{listStyleType: 'disc', paddingLeft: 40, textAlign: 'left'}}>
                                                                                            {(() => {
                                                                                                if(state.tnData){
                                                                                                    if(state.tnData.data){
                                                                                                        return state.tnData.data.events.map((el,i) => {
                                                                                                            return (
                                                                                                                <li style={{paddingBottom: 10, borderBottom: '1px solid #bdb9b9'}} key={i}>
                                                                                                                    <span className="capitalize" style={{fontSize: 15}}>{el.description}</span><br/>
                                                                                                                    <span style={{fontSize: 12}}>{new Date(el.time).toLocaleString('en-US', { day: "2-digit", month: "short", year: "numeric" })}</span>
                                                                                                                </li>
                                                                                                            );
                                                                                                        })
                                                                                                    } else {
                                                                                                        return (
                                                                                                            <div className="text-center">
                                                                                                                No Result
                                                                                                            </div>
                                                                                                        );
                                                                                                    }
                                                                                                } else {
                                                                                                    return (
                                                                                                        <div className="text-center">
                                                                                                            <Loading height={100} width={100} />
                                                                                                        </div>
                                                                                                    );
                                                                                                }
                                                                                            })()}
                                                                                        </ul>
                                                                                    </div>
                                                                                </Popup>
                                                                            );
                                                                        } else {
                                                                            return (
                                                                                <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>Pending</span>
                                                                            );
                                                                        }
                                                                    })()}
                                                                </td>
                                                            </tr>
                                                        );
                                                    });
                                                }}
                                            </Query>
                                        </tbody>
                                    </table>
                                    {paginationDOM}
                                </div>
                            );
                        } else if(state.activeTab == "quote"){
                            return (
                                <div style={{margin: '0 auto', maxWidth: 1000}}>
                                    <div className="text-center">
                                        <h3>Ask a Quotation for your product</h3>
                                    </div>
                                    <div className="form_wrap">
                                        <div className="form_row">
                                            <div className="form_item">
                                                <div className="column column_6_12">
                                                    <div className="form_input">
                                                        <label>Search Product Name</label>
                                                        <input type="text" name="productName" id="productSearch" value={state.productName} onChange={event => this.handleOnChange(event, true)} />
                                                        <div className="error" id="error-product-id"></div>
                                                        <ul className="list-group" id="productResult">
                                                        </ul>
                                                        <span className="bottom_border"></span>
                                                    </div>
                                                </div>
                                                <div className="column column_6_12">
                                                    <div className="form_input">
                                                        <label>Vendor Link</label>
                                                        <input type="text" name="productVendorLink" value={state.productVendorLink} onChange={event => this.handleOnChange(event)} />
                                                        <span className="bottom_border"></span>
                                                    </div>
                                                </div>
                                                <div className="column column_12_12 form_buttons text-center">
                                                    <br/>
                                                    <Mutation
                                                        mutation={SUBMIT_FULFILLMENT_CENTER_MESSAGE}
                                                        variables={{
                                                            id: this.props.session.getCurrentUser.id,
                                                            text: `<div style="display: flex;">
                                                                <img src="${state.productImage}" width="50px" height="50px">
                                                                <div style="padding: 5px;">
                                                                    Hi, Can I get a quotation from this product: <br>
                                                                    <a href="${state.productVendorLink}" target="_blank">${state.productName}</a>
                                                                </div>
                                                            </div>`,
                                                            from: 'User',
                                                            isFromQuote: true }}
                                                        >
                                                        {(submitMessage, { data, loading, error }) => {
                                                            return <button className="btn" onClick={() => this.submitMessage(submitMessage)}>Request a Quote</button>;
                                                        }}
                                                    </Mutation>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        } else if(state.activeTab == "vw"){
                            return <FulfillmentBulkOrder session={this.props.session} refetch={this.props.refetch} />;
                        }
                    })()}
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(FulfillmentChina);