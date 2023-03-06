import React from 'react';
import toastr from 'toastr';
import withAuth from './../hoc/withAuth';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import { GET_FULFILLMENT_CENTER_MESSAGE_COUNT } from './../queries';
import { Query } from 'react-apollo';
import Credits from '../components/Credits';
import FulfillmentOrders from '../components/fulfillmentOrders';
import FulfillmentProcessing from '../components/fulfillmentProcessing';
import FulfillmentVirtualWarehouse from '../components/fulfillmentVirtualWarehouseBoxC';
const points = require('../../Global_Values');

class FulfillmentChinaDev extends React.Component {
    constructor() {
        super();
        this.state = {
            activeTab: 'orders'
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
            "timeOut": 3000,
            "extendedTimeOut": 2000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        
        const param = points.getURLParameters(window.location.href);
        if(param.tab){
            if(param.tab == "orders" || param.tab == "processing" || param.tab == "vw"){
                this.setState({
                    activeTab: param.tab
                })
            }
        }

        if(!this.props.session.getCurrentUser.store_url){
            window.toggleConnectModal();
        }
    }

    onTabsToggle(tabs){
        this.setState({
            activeTab: tabs
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

        return (
            <div className="china-fulfillment page-container" style={{position: 'relative'}}>
                {this.head()}
                {/* This is how to include the credits */}
                <div className="text-center clickable" style={{ position: 'absolute', right: 54, top: -21, backgroundColor: '#26c686', color: '#fff', padding: '7px 25px', borderBottomRightRadius: 10, borderBottomLeftRadius: 10, width: 'fit-content', margin: '0 auto' }} id="credits">
                    <Credits session={this.props.session} refetch={this.props.refetch} />
                </div>
                {/* End include */}
                <div className="fulfillment-title">
                    <h1 style={{margin: 0}} className="one-line-ellipsis">Fulfillment Center</h1>
                </div>
                <div>
                    <div className="column column_12_12">
                        <div className="column column_2_12">
                            <button className={state.activeTab == "orders" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("orders")}>Orders</button>
                        </div>
                        <div className="column column_2_12">
                            <button className={state.activeTab == "processing" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("processing")}>Processing</button>
                        </div>
                        <div className="column column_3_12">
                            <button className={state.activeTab == "vw" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("vw")}>Virtual Warehouse</button>
                        </div>
                        <div className="column column_3_12" style={{position: 'relative'}}>
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
                        <div className="column column_2_12">
                            <a href="https://app.productlistgenie.io/Start_Here/5c77467c03b3a16b229ca852" target="_blank">
                                <button className="stretch-width dwobtn">FAQ</button>
                            </a>
                        </div>
                    </div>
                    <div className="column column_12_12" id="remove-when-error">
                        <br/>
                        {(() => {
                            if(state.activeTab == "orders"){
                                return <FulfillmentOrders session={this.props.session} refetch={this.props.refetch} />
                            } else if(state.activeTab == "processing"){
                                return <FulfillmentProcessing session={this.props.session} refetch={this.props.refetch} />
                            } else if(state.activeTab == "vw"){
                                return <FulfillmentVirtualWarehouse session={this.props.session} refetch={this.props.refetch} />
                            }
                        })()}
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(FulfillmentChinaDev);