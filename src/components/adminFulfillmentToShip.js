import React from 'react';
import webConfig from '../../webConfig';
import toastr from 'toastr';
import Popup from 'reactjs-popup';
import Loading from './loading';
import { Query } from 'react-apollo';
import { NEW_GET_ORDERS_CHINA, NEW_GET_ADMIN_ORDERS_CHINA_USERS, GET_ORDER_COUNT } from '../queries';
import AdminFulfillmentToShipData from './adminFulfillmentToShipData';
import Pagination from './pagination';
import UserCreditLog from '../components/adminCreditLog';
const points = require('../../Global_Values');

class AdminFulfillmentToShip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            currentPageLimit: 50
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
                    <h3> To Ship List </h3>
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
                                    
                                    refetch();

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
                                <h2 style={{padding: '5px 0', margin: 0}}>{state.selectedStoreOwner} To Ship List</h2>
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
                                            <th>Request Date</th>
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

                                                var store_data = {
                                                    store_url: state.store_url,
                                                    store_location_id: state.store_location_id,
                                                    store_token: state.store_token,
                                                    store_phone: state.store_phone
                                                }

                                                var startFrom = points.getPaginationOffset(state.currentPage, state.currentPageLimit) + 1;

                                                return data.getNewChinaOrders.map((odata, index) => {
                                                    return <AdminFulfillmentToShipData store_data={store_data} data={odata} index={startFrom+index} refetch={refetch} key={index} />
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
                                <span style={{ fontStyle: 'italic', fontSize: '1.5rem' }}>Select Store to display To Ship list.</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default AdminFulfillmentToShip;