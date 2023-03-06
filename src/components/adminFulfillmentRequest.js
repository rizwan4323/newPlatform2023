import React from 'react';
import webConfig from '../../webConfig';
import toastr from 'toastr';
import Loading from './loading';
import Popup from 'reactjs-popup';
import { Query } from 'react-apollo';
import { NEW_GET_ORDERS_CHINA, NEW_GET_ADMIN_ORDERS_CHINA_USERS, GET_ORDER_COUNT } from '../queries';
import AdminFulfillmentData from './adminFulfillmentData';
import Pagination from './pagination';
import UserCreditLog from '../components/adminCreditLog';
import MessageUser from '../components/MessageUser';
const points = require('../../Global_Values');
let distinctProduct = [];

class AdminFulfillmentRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            currentPageLimit: 50,
            distinctProduct: []
        }

        this.smoothscroll = this.smoothscroll.bind(this);
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

        if(distinctProduct.length != 0){
            this.setState({
                distinctProduct: distinctProduct
            })
        }
    }

    componentWillUnmount(){
        distinctProduct = this.state.distinctProduct
    }

    smoothscroll(){
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(this.smoothscroll);
            window.scrollTo (0,currentScroll - (currentScroll/5));
        }
    }

    displayOrder(id, name, storeData, refetch){
        var saveState = {
            currentPage: 1,
            selectedStoreID: id,
            selectedStoreOwner: name,
            totalShippingFee: 0,
            orderList: [],
            orderObject: null,
            store_url: storeData.store_url,
            store_location_id: storeData.store_location_id,
            store_token: storeData.store_token,
            store_phone: storeData.store_phone,
            storeID: storeData.storeID
        }
        
        var self = this;
        this.setState(saveState, () => {
            self.smoothscroll();
        })
        
        if(!storeData.storeID){
            // create store to FBB
            var payload = {
                store_id: points.getStoreNameID(storeData.store_url),
                store_name: name
            }
            points.customFetch('/createShopToBoxC', 'POST', payload, result => {
                if(result){
                    // has result
                    if(result.data.status !== "error"){
                        // save to user data
                        const userPayload = {"query":"mutation($id: String!, $fbbid: String!){\n  saveFBBstoreID(id: $id, fbbid: $fbbid){\n    id\n   }\n}","variables":{id: id, fbbid: payload.store_id}}
                        points.customFetch('/graphql', 'POST', userPayload, result => {
                            this.setState({
                                storeID: payload.store_id
                            })
                            refetch();
                            console.log("success")
                        });
                    } else {
                        // Unexpected Behaviour
                        console.log("an error has occured", result);
                        toastr.options.timeOut = 0;
                        toastr.options.extendedTimeOut = 0;
                        toastr.clear();
                        toastr.warning("Please contact administrator.","Unexpected error has occurred!")
                        document.getElementById("remove-when-error").remove();
                    }
                }
            })
        }
    }

    displaySelectedCount(){
        var el = document.getElementById("checkall");
        var totalCheck = 0;
        var arrSelector = document.querySelectorAll("[type='checkbox']");
        arrSelector.forEach(el => {
            if(el.checked){
                totalCheck += 1;
            }
        })
        if(totalCheck != 0){
            el.style.display = "block";
            el.innerText = totalCheck+" Orders Selected"
        } else {
            el.style.display = "none";
        }
    }

    checkAllCheckbox(){
        if(!this.state.isChecked){
            document.querySelectorAll("[type='checkbox']").forEach(el => {
                if(!el.checked){
                    el.click();
                }
            })
            this.displaySelectedCount();
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
    
    changePageNumber(pageNum){
        this.setState({
            currentPage: parseInt(pageNum)
        })
    }

    approveSelected(){
        if(document.querySelectorAll("[type='checkbox']").length != 0){
            document.querySelectorAll("[type='checkbox']").forEach(el => {
                if(el.checked){
                    el.parentNode.parentNode.querySelector("button").click()
                }
            })
            this.removeAllCheckBox();
            this.displaySelectedCount();
        } else {
            toastr.clear();
            toastr.warning("Check atleast 1 or more to approve order!","");
        }
    }

    createFBBProduct(variant_id){
        var isVerified = true;
        var failProductName = "";
        this.state.distinctProduct.forEach(li => {
            if(variant_id){
                if(li.variant_id == variant_id){
                    if(!li.approve_price){
                        isVerified = false;
                        failProductName = li.product_name;
                    }
                }
            } else {
                if(!li.approve_price){
                    isVerified = false;
                    failProductName = li.product_name;
                }
            }
        });
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        if(isVerified){
            document.getElementById("c-p").click();
            toastr.clear();
            toastr.info("Loading please wait...","");
            var distinctProduct = this.state.distinctProduct;
            if(variant_id){
                distinctProduct = distinctProduct.filter(data => data.variant_id == variant_id)
            }
            distinctProduct.forEach(li => {
                var payload = {
                    product_name: li.product_name+" - "+li.variant_name,
                    variant_name: li.product_name+" - "+li.variant_name,
                    chinese_description: li.chinese_description,
                    approve_price: parseFloat(li.approve_price),
                    original_price: parseFloat(li.original_price),
                    dg_code: li.dg_code ? li.dg_code : null,
                    sku: this.state.storeID + "-" + li.variant_id,
                    storeID: this.state.storeID
                }
                points.customFetch('/create-product', 'POST', payload, result => {
                    if(result){
                        toastr.options.timeOut = 3000;
                        toastr.options.extendedTimeOut = 2000;
                        toastr.clear();
                        toastr.success("FBB product successfully created.",li.product_name);
                    } else {
                        toastr.options.timeOut = 0;
                        toastr.options.extendedTimeOut = 0;
                        toastr.clear();
                        toastr.warning("Please try again.","An error has occured.");
                    }
                })
            })
        } else {
            toastr.clear();
            toastr.warning("Set approve price for "+failProductName+".","Please set retail price first.");
        }
    }

    render() {
        const activeTab = this.props.activeTab;
        const state = this.state;

        return (
            <div className="admin china-fulfillment">
                <div className="text-center">
                    <h3> Request List </h3>
                </div>
                {/* Selection of user */}
                <div className="column column_3_12">
                    <div className="product-card">
                        <div className="product-details" style={{display: 'flow-root'}}>
                            <div className="text-center">
                                <h3>Stores</h3>
                            </div>
                            <Query query={NEW_GET_ADMIN_ORDERS_CHINA_USERS} variables={{ filter: activeTab }}>
                                {({ data, loading, refetch, error }) => {
                                    if (loading) {
                                        return (
                                            <div className="text-center">
                                                <Loading height={150} width={150} />
                                            </div>
                                        );
                                    }
                                    
                                    state.refetchUser = refetch;

                                    if (data.getAdminNewChinaOrdersUSERS.length != 0) {
                                        return data.getAdminNewChinaOrdersUSERS.map((user, user_index) => {
                                            var cn = "product-card";
                                            if (state.selectedStoreID == user.id) {
                                                cn += " card-active"
                                            }
                                            var storeData = {
                                                store_url: user.store_url,
                                                store_location_id: user.store_location_id,
                                                store_token: user.store_token,
                                                store_phone: user.store_phone,
                                                storeID: user.fbb_store_id
                                            }
                                            return (
                                                <div className={cn} key={user_index}>
                                                    <div className="product-details" style={{display: 'flow-root'}}>
                                                        <div className="column column_3_12" style={{ padding: 0 }}>
                                                            <div style={{ backgroundImage: user.profileImage ? 'url(' + webConfig.siteURL + '/user-uploads/' + user.profileImage + ')' : 'url(' + webConfig.siteURL + '/assets/graphics/abstract_patterns/texture.jpg' + ')', height: '5rem', borderRadius: '50%', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', position: 'relative' }}>
                                                                <span style={{ fontSize: '12px', backgroundColor: 'red', borderRadius: '50%', color: 'rgb(255, 255, 255)', fontWeight: 900, padding: '3px 5px', position: 'absolute', top: '-10px', right: 0 }}>{user.totalRequest}</span>
                                                            </div>
                                                        </div>
                                                        <div className="column column_9_12 ellipsis" style={{ whiteSpace: 'nowrap' }}>
                                                            <strong>{user.store_url}</strong> <br />
                                                            {user.firstName} {user.lastName} <br />
                                                            <div className="float-right" style={{ marginTop: 5 }}>
                                                                <span className="clickable" onClick={() => this.displayOrder(user.id, user.firstName + " " + user.lastName, storeData, refetch)}>
                                                                    Details &nbsp;<span className="fas fa-arrow-right"></span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/* View User Credit Log */}
                                                        <Popup
                                                            trigger={<span className="clickable" style={{position: 'absolute', bottom: 10, left: 10, fontSize: 12, fontWeight: 900, color: '#383d38'}}>Credit: ${points.commafy(user.plg_balance.toFixed(2))}</span>}
                                                            position="top center"
                                                            on="click" className="points-tooltip">
                                                            <div className="text-center" style={{ lineHeight: 1.5 }}>
                                                                <UserCreditLog userID={user.id} />
                                                            </div>
                                                        </Popup>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    } else {
                                        return (
                                            <div className="text-center">
                                                <span style={{ fontStyle: 'italic', fontSize: '1.5rem' }}>No Store Available</span>
                                            </div>
                                        );
                                    }
                                }}
                            </Query>
                        </div>
                    </div>
                </div>
                <div className="column column_9_12">
                    {state.selectedStoreID ?
                        <div>
                            <div style={{float: 'left'}}>
                                <h2 style={{padding: '5px 0'}}>{state.selectedStoreOwner} Request List</h2>
                                <div className="form_buttons" style={{display: 'inline-flex'}}>
                                    <div style={{marginRight: 10, padding: 5, fontSize: 20}}>
                                        <MessageUser userid={state.selectedStoreID} />
                                    </div>
                                    <Popup
                                        trigger={<button className="btn" id="c-p" style={{padding: '5px 10px', marginRight: 15}}>Create Products</button>}
                                        position="bottom center"
                                        on="click" className="points-tooltip">
                                        <div className="helperText" style={{ padding: 10, lineHeight: 1.5 }}>
                                            <h3 className="text-center">Create this product in FBB ?</h3>
                                            <div>
                                                <strong>Product Name</strong>
                                                <strong className="float-right" style={{marginLeft: 20}}>Variant Name</strong>
                                            </div>
                                            <div style={{maxHeight: 125, overflow: 'scroll'}}>
                                                <ul>
                                                    {(() => {
                                                        return state.distinctProduct.map(li => {
                                                            return (
                                                                <li key={li.variant_id} onClick={() => this.createFBBProduct(li.variant_id)} title="click to create this product">
                                                                    <span>{li.product_name}</span>
                                                                    <span className="float-right" style={{marginLeft: 20}}>{li.variant_name ? li.variant_name : 'N/A'}</span>
                                                                </li>
                                                            );
                                                        })
                                                    })()}
                                                </ul>
                                            </div>
                                            <div className="text-center">
                                                <span className="no-result">Total of {state.distinctProduct.length} Products.</span> <br/>
                                                <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20 }} onClick={() => this.createFBBProduct()}>
                                                    <i className="fas fa-check"></i>
                                                </button>
                                                &nbsp; | &nbsp;
                                                <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20 }} onClick={() => document.getElementById("c-p").click()}>
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </Popup>
                                    <span id="checkall" style={{padding: '5px 10px', border: '1px solid rgb(61, 172, 81)', display: 'none', width: 'fit-content'}} id="checkall"></span>
                                </div>
                            </div>
                            <div className="text-right form_buttons">
                                <button className="dwobtn" id="request" style={{margin: 0, fontSize: 15}} onClick={() => this.approveSelected()}>Approve Selected</button>
                            </div>

                            <Query query={GET_ORDER_COUNT} variables={{
                                id: state.selectedStoreID,
                                filter: activeTab
                            }}>
                                {({ data, loading, refetch, error }) => {
                                    if(loading || error){
                                        return null;
                                    }
                                    if(data.getOrderCount.count < state.currentPageLimit){
                                        return null;
                                    }
                                    return <Pagination displayPageCount={state.currentPageLimit} totalPage={data.getOrderCount.count} action={this.changePageNumber.bind(this)} />;
                                }}
                            </Query>

                            <div className="table-container clear">
                                <br />
                                <table className="table-list">
                                    <thead>
                                        <tr>
                                            <th className="text-center">#</th>
                                            <th className="text-center clickable" onClick={() => this.checkAllCheckbox()}>Check All</th>
                                            <th>Request Date</th>
                                            <th className="text-center">Order Notes</th>
                                            <th className="text-center">Order ID</th>
                                            <th>Shipping Information</th>
                                            <th width="200px">Products</th>
                                            <th className="text-center">Variant</th>
                                            <th className="text-center">Quantity</th>
                                            <th className="text-center">Price</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <Query query={NEW_GET_ORDERS_CHINA} variables={{
                                            id: state.selectedStoreID,
                                            filter: activeTab,
                                            limit: state.currentPageLimit,
                                            offset: points.getPaginationOffset(state.currentPage, state.currentPageLimit)
                                        }} onCompleted={data => {
                                            var lineItems = [];
                                            data.getNewChinaOrders.forEach(orig => {
                                                orig.line_items.forEach(li => {
                                                    lineItems.push(li)
                                                })
                                            })

                                            var distinctLineItems = points.distinctObject(lineItems, "variant_id"); 
                                            
                                            this.setState({
                                                distinctProduct: distinctLineItems,
                                                requestData: data
                                            }, () => {
                                                console.log(state.distinctProduct)
                                            })
                                        }}>
                                            {({ data, loading, refetch, error }) => {
                                                if(loading){
                                                    return (
                                                        <tr>
                                                            <td colSpan="13" className="text-center">
                                                                <Loading height={200} width={200} />
                                                            </td>
                                                        </tr>
                                                    );
                                                }

                                                if(data.getNewChinaOrders.length == 0){
                                                    return (
                                                        <tr>
                                                            <td colSpan="13" className="text-center">
                                                                <span className="no-result">Empty... check back soon!</span>
                                                            </td>
                                                        </tr>
                                                    );
                                                }

                                                var startFrom = points.getPaginationOffset(state.currentPage, state.currentPageLimit) + 1;
                                                
                                                return data.getNewChinaOrders.map((odata, index) => {
                                                    return <AdminFulfillmentData action={() => this.displaySelectedCount()} selectedStoreID={state.selectedStoreID} data={odata} index={startFrom+index} refetch={refetch} refetchUser={state.refetchUser} key={index} />
                                                });
                                            }}
                                        </Query>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    :
                        <div className="product-card text-center">
                            <div className="product-details">
                                <span style={{ fontStyle: 'italic', fontSize: '1.5rem' }}>Select Store to display request list.</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default AdminFulfillmentRequest;