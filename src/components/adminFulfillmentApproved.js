import React from 'react';
import webConfig from '../../webConfig';
import toastr from 'toastr';
import Loading from './loading';
import { Query, Mutation } from 'react-apollo';
import Popup from 'reactjs-popup';
import { NEW_GET_ORDERS_CHINA, NEW_GET_ADMIN_ORDERS_CHINA_USERS, REDUCE_FULFILLMENT_CREDIT, NEW_DECIDE_ORDER, GET_ORDER_COUNT, MARK_AS_EXPORTED } from '../queries';
import Pagination from './pagination';
import AdminFulfillmentApprovedData from './adminFulfillmentApprovedData';
import UserCreditLog from '../components/adminCreditLog';
import ButtonWithPopup from '../components/buttonWithPopup';
import MessageUser from '../components/MessageUser';
const points = require('../../Global_Values');

const initializeState = {
    approved_id: [],
    approved_order_number: [],
    credit_description: '',
    credit_cost: 0,
    checkAll: false
}

class AdminFulfillmentApproved extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initializeState,
            currentPage: 1,
            currentPageLimit: 50,
        }

        this.smoothscroll = this.smoothscroll.bind(this)
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

    smoothscroll(){
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(this.smoothscroll);
            window.scrollTo (0,currentScroll - (currentScroll/5));
        }
    }

    displayOrder(id, name, storeData){
        var saveState = {
            selectedStoreID: id,
            selectedStoreOwner: name,
            approved_id: [],
            approved_order_number: [],
            store_url: storeData ? storeData.store_url : null,
            store_location_id: storeData ? storeData.store_location_id : null,
            store_token: storeData ? storeData.store_token : null,
            store_phone: storeData ? storeData.store_phone : null,
            storeID: storeData ? storeData.storeID : null
        }
        
        var self = this;
        this.setState(saveState, () => {
            self.smoothscroll();
            self.props.inboundSticky();
        })
    }

    handleOnChange(event){
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [name]: value
        })
    }

    reduceCredits(reduceCredits, decideNewOrder){
        reduceCredits().then(({ data }) => {
            decideNewOrder().then(({ data }) => {
                toastr.clear();
                toastr.success("User credit has cost $"+this.state.credit_cost+".","Success");
                this.setState({
                    ...initializeState
                }, () => {
                    this.state.refetch();
                    this.state.userRefetch();
                })
            }).catch(error => {
                toastr.options.timeOut = 0;
                toastr.options.extendedTimeOut = 0;
                toastr.clear();
                toastr.warning(error.graphQLErrors[0].message, "An Error has occurred!");
            })
        }).catch(error => {
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "An Error has occurred!");
        });
    }

    markAsExported(markAsExported){
        if(this.state.approved_id.length != 0){
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.clear();
            toastr.info("Loading Please wait...", "");
            markAsExported().then(({ data }) => {
                document.querySelectorAll("[type='checkbox']").forEach(el => {
                    if(el.checked){
                        setTimeout(function() {
                            el.click();
                        }, 100);
                    }
                });
                this.state.refetch();
                toastr.clear();
            }).catch(error => {
                toastr.options.timeOut = 0;
                toastr.options.extendedTimeOut = 0;
                toastr.clear();
                toastr.warning(error.graphQLErrors[0].message, "An Error has occurred!");
            });
        } else {
            toastr.clear();
            toastr.warning("Check some product to mark as exported.", "No Order Selected.");
        }
    }

    exportCSV(orders){
        var selected_id = this.state.approved_id;
        var self = this;
        var orders = this.state.requestData;
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.clear();
        toastr.info("Loading please wait...","");
        const rows = [
            ["id", "shop.id", "shop.order_id", "partial", "override", "status", "service", "company_name", "name", "phone", "email", "street1", "street2", "city", "province", "postal_code", "country", "sku", "quantity", "packing_slip", "Variant Name"]
        ];

        // data processing
        orders = orders.getNewChinaOrders;
        var index = 1;
        orders.forEach(order => {
            var obj = JSON.parse(JSON.stringify(order));
            var line_items = obj.line_items;
            var shipping_information = obj.shipping_information;
            if(selected_id.includes(order.id)){
                line_items.forEach(li => {
                    var province = shipping_information.province;
                    var country = shipping_information.country_code;
                    // add more for special cases like australia must use province code instead of province name
                    if(country.toLowerCase() == "au"){
                        province = shipping_information.province_code;
                    }
                    rows.push([
                        index,
                        self.state.storeID,
                        shipping_information.order_number.replace("#",""),
                        0,
                        1,
                        "Holding",
                        null,
                        shipping_information.company,
                        shipping_information.name,
                        shipping_information.phone,
                        shipping_information.email,
                        shipping_information.address1 ? "\""+shipping_information.address1.replace("#","")+"\"" : "\""+shipping_information.address1+"\"",
                        shipping_information.address2 ? "\""+shipping_information.address2.replace("#","")+"\"" : "\""+shipping_information.address2+"\"",
                        "\""+shipping_information.city+"\"",
                        province,
                        shipping_information.zip,
                        country,
                        self.state.storeID+"-"+li.variant_id,
                        li.quantity,
                        0,
                        li.variant_name
                    ])
                })
                index += 1;
            }
        })

        if(rows.length == 1){
            // No selected order
            toastr.options.timeOut = 3000;
            toastr.options.extendedTimeOut = 2000;
            toastr.clear();
            toastr.warning("Please check some order to export.","No selected order");
        } else {
            // export to csv
            let csvContent = "data:text/csv;charset=utf-8,";
            rows.forEach(function(rowArray){
                let row = rowArray.join(",");
                csvContent += row + "\r\n";
            });
            
            var encodedUri = encodeURI(csvContent);
            var fileName = self.state.store_url+"("+new Date().toLocaleDateString()+").csv";
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", fileName);
            document.body.appendChild(link); // Required for FF
            link.click();
            document.body.removeChild(link);
    
            toastr.clear();
            toastr.options.timeOut = 3000;
            toastr.options.extendedTimeOut = 2000;
        }
    }

    checkUncheckAllCheckBox(){
        if(!this.state.checkAll){
            // check all checkbox
            document.querySelectorAll("[type='checkbox']").forEach(el => {
                if(!el.checked){
                    setTimeout(function() {
                        el.click();
                    }, 100);
                }
            });
        } else {
            // uncheck all checkbox
            document.querySelectorAll("[type='checkbox']").forEach(el => {
                if(el.checked){
                    setTimeout(function() {
                        el.click();
                    }, 100);
                }
            });
        }
        this.state.checkAll = !this.state.checkAll
    }

    markThisItem(id, order_number){
        var ids = this.state.approved_id;
        if(ids.includes(id)){
            ids = ids.filter(el => {
                return el != id
            });
        } else {
            ids.push(id)
        }
        this.setState({
            approved_id: ids
        })
        this.addOrderNumber(order_number);
    }

    addOrderNumber(order_number) {
        var order_numbers = this.state.approved_order_number;
        if(order_numbers.includes(order_number)){
            order_numbers = order_numbers.filter(el => {
                return el != order_number
            });
        } else {
            order_numbers.push(order_number)
        }
        this.setState({
            approved_order_number: order_numbers
        })
    }

    changePageNumber(pageNum){
        this.setState({
            currentPage: parseInt(pageNum)
        })
    }

    render() {
        const activeTab = this.props.activeTab;
        const state = this.state;

        return (
            <div className="admin china-fulfillment">
                <div className="text-center">
                    <h3> Approved List </h3>
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

                                    state.userRefetch = refetch;
                                    
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
                                            
                                            state.refetchUser = refetch;

                                            return (
                                                <div className={cn} key={user_index}>
                                                    <div className="product-details" style={{display: 'flow-root'}}>
                                                        <div className="column column_3_12" style={{ padding: 0 }}>
                                                            <div style={{ backgroundImage: user.profileImage ? 'url(' + webConfig.siteURL + '/user-uploads/' + user.profileImage + ')' : 'url(' + webConfig.siteURL + '/assets/graphics/abstract_patterns/texture.jpg' + ')', height: '5rem', borderRadius: '50%', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', position: 'relative' }} />
                                                        </div>
                                                        <div className="column column_9_12 ellipsis" style={{ whiteSpace: 'nowrap' }}>
                                                            <strong>{user.store_url}</strong> <br />
                                                            {user.firstName} {user.lastName} <br />
                                                            <div className="float-right" style={{ marginTop: 5 }}>
                                                                <span className="clickable" onClick={() => this.displayOrder(user.id, user.firstName + " " + user.lastName, storeData)}>
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
                                <h2 style={{padding: '5px 0'}}>{state.selectedStoreOwner} Approved List</h2>
                                <span style={{marginLeft: 20, padding: '5px 10px', border: '1px solid rgb(61, 172, 81)', position: 'absolute', left: 0, display: 'none'}} id="checkall"></span>
                            </div>

                            <div className="text-right form_buttons">
                                {this.state.approved_id.length != 0 &&
                                <Mutation
                                    mutation={MARK_AS_EXPORTED}
                                    variables={{
                                        ids: JSON.stringify(this.state.approved_id)
                                    }}>
                                    {(markAsExported, { data, loading, error }) => {
                                        return (
                                            <ButtonWithPopup data={{
                                                triggerDOM: <span id={"done_order"} className="dwobtn" style={{ fontSize: 15 }}>Mark as Exported</span>,
                                                popupPosition: "top center",
                                                title: "Mark as done",
                                                text: <span>This action cannot be reversed.</span>,
                                                action: () => this.markAsExported(markAsExported),
                                                triggerID: "done_order",
                                                loading: false,
                                                padding: 10
                                            }} />
                                        );
                                    }}
                                </Mutation>
                                }
                                {this.state.approved_id.length != 0 && "|" } 
                                <button className="dwobtn" id="request" style={{margin: 0, fontSize: 15}} onClick={() => this.exportCSV()}>Export CSV</button>
                            </div>

                            <div className="column column_12_12" id="inbounds">
                                <h3>Charge user for the inbounds.</h3>
                                <div className="form_wrap">
                                    <div className="form_row">
                                        <div className="column column_6_12">
                                            <div className="form_item">
                                                <div className="form_input text-left">
                                                    <label>Description:</label>
                                                    <input type="text" name="credit_description" value={state.credit_description} onChange={event => this.handleOnChange(event)} />
                                                    <span className="bottom_border"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form_row">
                                        <div className="column column_2_12">
                                            <div className="form_item">
                                                <div className="form_input text-left">
                                                    <label>Ammount:</label>
                                                    <input type="number" name="credit_cost" value={state.credit_cost} onChange={event => this.handleOnChange(event)} />
                                                    <span className="bottom_border"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form_row">
                                        <div className="column column_4_12">
                                            <div className="form_buttons" style={{ padding: '11px 0' }}>
                                                {/* Ok lang wla userid kc ung object ng newfchinas ung iuupdate */}
                                                <Mutation
                                                    mutation={NEW_DECIDE_ORDER}
                                                    variables={{
                                                        id: state.selectedStoreID,
                                                        decision: 'toship',
                                                        ids: JSON.stringify(state.approved_id)
                                                    }}
                                                >
                                                    {(decideNewOrder, { datas, loading, error }) => {
                                                        return (
                                                            <Mutation
                                                                mutation={REDUCE_FULFILLMENT_CREDIT}
                                                                variables={{
                                                                    id: state.selectedStoreID,
                                                                    cost: parseFloat(state.credit_cost),
                                                                    description: state.credit_description+" Order Number: "+state.approved_order_number.toString()
                                                                }}>
                                                                {(reduceCredits, { data, loading, error }) => {
                                                                    return (
                                                                        <Popup
                                                                            trigger={<button className="btn stretch-width" id="donesubmit" disabled={state.approved_id.length == 0}>Submit</button>}
                                                                            position="bottom center"
                                                                            on="click" className="points-tooltip">
                                                                            <div className="text-center" style={{ padding: 10, lineHeight: 1.5 }}>
                                                                                <h3 style={{margin: 0}}>Are you sure?</h3>
                                                                                <span>${state.credit_cost} will be deducted to user credit.</span> <br/>
                                                                                <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20 }} onClick={() => {
                                                                                    this.reduceCredits(reduceCredits, decideNewOrder)
                                                                                    document.getElementById("donesubmit").click();
                                                                                }} disabled={loading}>
                                                                                    <i className="fas fa-check"></i>
                                                                                </button>
                                                                                &nbsp; | &nbsp;
                                                                                <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20 }} onClick={() => document.getElementById("donesubmit").click()}>
                                                                                    <i className="fas fa-times"></i>
                                                                                </button>
                                                                            </div>
                                                                        </Popup>
                                                                    );
                                                                }}
                                                            </Mutation>
                                                        );
                                                    }}
                                                </Mutation>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

                            <div className="form_buttons">
                                <div style={{ marginRight: 10, padding: 5, fontSize: 20 }}>
                                    <MessageUser userid={state.selectedStoreID} />
                                </div>
                            </div>

                            <div className="table-container clear">
                                <br />
                                <table className="table-list">
                                    <thead>
                                        <tr>
                                            <th className="text-center">#</th>
                                            <th className="text-center clickable" onClick={() => this.checkUncheckAllCheckBox()}>Check All {state.approved_id.length != 0 ? "("+state.approved_id.length+")" : void 0}</th>
                                            <th>Approved Date</th>
                                            <th className="text-center">Order Notes</th>
                                            <th className="text-center">Order ID</th>
                                            <th>Shipping Information</th>
                                            <th width="200px">Products</th>
                                            <th className="text-center">Variant</th>
                                            <th className="text-center">Quantity</th>
                                            <th className="text-center">Price</th>
                                            <th className="text-center">Total Price</th>
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
                                            this.setState({
                                                requestData: data
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

                                                state.refetch = refetch;

                                                var store_data = {
                                                    store_url: state.store_url,
                                                    store_location_id: state.store_location_id,
                                                    store_token: state.store_token,
                                                    store_phone: state.store_phone
                                                }

                                                var startFrom = points.getPaginationOffset(state.currentPage, state.currentPageLimit) + 1;
                                                
                                                return data.getNewChinaOrders.map((odata, index) => {
                                                    return <AdminFulfillmentApprovedData markThisItem={this.markThisItem.bind(this)} selectedStoreID={state.selectedStoreID} ids={state.approved_id} store_data={store_data} data={odata} index={startFrom+index} refetch={refetch} refetchUser={state.refetchUser}  key={index} />
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
                                <span style={{ fontStyle: 'italic', fontSize: '1.5rem' }}>Select Store to display approved list.</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default AdminFulfillmentApproved;