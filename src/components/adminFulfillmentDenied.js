import React from 'react';
import webConfig from '../../webConfig';
import toastr from 'toastr';
import Loading from './loading';
import { Query } from 'react-apollo';
import { NEW_GET_ORDERS_CHINA, NEW_GET_ADMIN_ORDERS_CHINA_USERS } from '../queries';
import AdminFulfillmentDeniedData from './adminFulfillmentDeniedData';
import Pagination from './pagination';

class AdminFulfillmentDenied extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            currentPageLimit: 50,
            totalPaginatedData: 0
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
    }

    // to get total page pagination count depending on the selected store and active tab
    getTotalOrdersCount() {
        var id = this.state.selectedStoreID ? this.state.selectedStoreID : "";
        var payload = { "query": "{\n  getNewChinaOrdersCount(id: \"" + id + "\", filter:\"" + this.state.activeTab + "\"){\n    count\n  }\n}", "variables": null, "operationName": null };
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(ress => {
            var calculate = Math.ceil(ress.data.getNewChinaOrdersCount.count / this.state.currentPageLimit);
            this.setState({
                totalPaginatedData: calculate
            })
        })
        .catch(err => {
            console.log("adminFulfillmentChina.js", err)
        });
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
            currentPage: 1,
            selectedStoreID: id,
            selectedStoreOwner: name,
            totalShippingFee: 0,
            orderList: [],
            orderObject: null,
            store_url: storeData ? storeData.store_url : null,
            store_location_id: storeData ? storeData.store_location_id : null,
            store_token: storeData ? storeData.store_token : null,
            store_phone: storeData ? storeData.store_phone : null
        }
        
        var self = this;
        this.setState(saveState, () => {
            self.getTotalOrdersCount();
            self.smoothscroll();
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
                    <h3> Denied List </h3>
                </div>
                {/* Selection of user */}
                <div className="column column_3_12">
                    <div className="product-card">
                        <div className="product-details" style={{ overflow: 'hidden' }}>
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
                                                store_phone: user.store_phone
                                            }
                                            return (
                                                <div className={cn} key={user_index}>
                                                    <div className="product-details" style={{ overflow: 'hidden' }}>
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
                                                        <span style={{position: 'absolute', bottom: 10, left: 10, fontSize: 12, fontWeight: 900, color: '#383d38'}}>Credit: ${user.plg_balance.toFixed(2)}</span>
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
                                <h2 style={{padding: '5px 0', margin: 0}}>{state.selectedStoreOwner} Denied List</h2>
                                <span id="checkall" style={{padding: '5px 10px', border: '1px solid rgb(61, 172, 81)', display: 'none', width: 'fit-content'}} id="checkall"></span>
                            </div>
                            <Pagination displayPageCount={state.currentPageLimit} totalPage={state.totalPaginatedData} action={this.changePageNumber.bind(this)} />

                            <div className="table-container clear">
                                <br />
                                <table className="table-list">
                                    <thead>
                                        <tr>
                                            <th className="text-center">#</th>
                                            <th>Request Date</th>
                                            <th className="text-center">Denied Notes</th>
                                            <th className="text-center">Order ID</th>
                                            <th>Shipping Information</th>
                                            <th width="200px">Products</th>
                                            <th className="text-center">Variant</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <Query query={NEW_GET_ORDERS_CHINA} variables={{
                                            id: state.selectedStoreID,
                                            filter: activeTab,
                                            offset: ((state.currentPage - 1) * state.currentPageLimit)
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

                                                return data.getNewChinaOrders.map((odata, index) => {
                                                    return <AdminFulfillmentDeniedData store_data={store_data} data={odata} index={index+1} refetch={refetch} key={index} />
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
                                <span style={{ fontStyle: 'italic', fontSize: '1.5rem' }}>Select Store to display Denied List.</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default AdminFulfillmentDenied;