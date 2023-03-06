import React from 'react';
import withAuth from '../hoc/withAuth';
import toastr from 'toastr';
import { Helmet } from 'react-helmet';
import { Query } from 'react-apollo';
import { GET_FULFILLMENT_CENTER_MESSAGE_COUNT, GET_TOTAL_TOPUP } from './../queries';
import AdminFulfillmentBulkRequest from '../components/adminFulfillmentBulkRequest';
import AdminFulfillmentRequest from '../components/adminFulfillmentRequest';
import AdminFulfillmentApproved from '../components/adminFulfillmentApproved';
import AdminFulfillmentToShip from '../components/adminFulfillmentToShip';
import AdminFulfillmentDenied from '../components/adminFulfillmentDenied';
const points = require('../../Global_Values');

class AdminFulfillmentChinaDev extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "request"
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

    onTabsToggle(tabs){
        this.setState({
            activeTab: tabs
        })
    }
    
    inboundSticky() {
        window.onscroll = function() {
            var header = document.getElementById("inbounds");
            var sticky = header.offsetTop;
            if (window.pageYOffset > sticky) {
                header.classList.add("sticky-approved");
            } else {
                header.classList.remove("sticky-approved");
            }
        };
    }

    head() {
        return (
            <Helmet>
                <title>Admin Fulfillment Center - Product List Genie</title>
            </Helmet>
        );
    }
    
    render() {
        const state = this.state;

        return (
            <div className="admin china-fulfillment page-container">
                {this.head()}
                <div className="fulfillment-title">
                    <h1 className="one-line-ellipsis">Admin Fulfillment Center</h1>
                </div>
                <Query query={GET_TOTAL_TOPUP} >
                    {({ data, loading, refetch, error }) => {
                        if (loading || error) return null;
                        return <span><strong>Total Topup:</strong> {"$"+points.commafy(data.getTotalTopup.count)}</span>
                    }}
                </Query>
                <div>
                    <div className="column column_12_12">
                        <div className="column column_2_12">
                            <button className={state.activeTab == "bulk" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("bulk")}>Bulk Request</button>
                        </div>
                        <div className="column column_2_12">
                            <button className={state.activeTab == "request" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("request")}>Request</button>
                        </div>
                        <div className="column column_2_12">
                            <button className={state.activeTab == "approved" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("approved")}>Approved</button>
                        </div>
                        <div className="column column_2_12">
                            <button className={state.activeTab == "toship" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("toship")}>To Ship</button>
                        </div>
                        <div className="column column_2_12">
                            <button className={state.activeTab == "denied" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("denied")}>Denied</button>
                        </div>
                        <div className="column column_2_12" style={{position: 'relative'}}>
                            <Query query={GET_FULFILLMENT_CENTER_MESSAGE_COUNT} >
                                {({ data, loading, refetch, error }) => {
                                    if (loading) return null;

                                    if (data && data.getCountOfAllMessage.count != 0) {
                                        return <span style={{ fontSize: 12, backgroundColor: 'red', borderRadius: '50%', color: '#fff', fontWeight: 900, padding: '3px 5px', position: 'absolute', top: '-5px', right: 20 }}>{data.getCountOfAllMessage.count}</span>
                                    } else {
                                        return null;
                                    }
                                }}
                            </Query>
                            <a href="/admin-messaging-center">
                                <button className="stretch-width dwobtn">Messaging Center</button>
                            </a>
                        </div>
                    </div>

                    <div className="column column_12_12">
                        <br/>
                        {(() => {
                            if(state.activeTab == "bulk") {
                                return <AdminFulfillmentBulkRequest activeTab={state.activeTab} />;
                            } else if (state.activeTab == "request") {
                                return <AdminFulfillmentRequest activeTab={state.activeTab} />;
                            } else if (state.activeTab == "approved") {
                                return <AdminFulfillmentApproved activeTab={state.activeTab} inboundSticky={() => this.inboundSticky()} />;
                            } else if (state.activeTab == "toship") {
                                return <AdminFulfillmentToShip activeTab={state.activeTab} />;
                            } else if (state.activeTab == "denied") {
                                return <AdminFulfillmentDenied activeTab={state.activeTab} />;
                            }
                        })()}
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AdminFulfillmentChinaDev);