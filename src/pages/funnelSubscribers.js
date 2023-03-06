import React from 'react';
import moment from 'moment';
import { Query } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { GET_FUNNEL_SUBSCRIBERS } from './../queries';
import withAuth from './../hoc/withAuth';
import Loading from '../components/loading';
import LoadingPage from '../components/loadingPage';
import Pagination from '../components/pagination';
const ShortId = require('id-shorter');
const mongoDBId = ShortId({ isFullId: true });
const points = require('../../Global_Values');

let initialize_pagination = {
    current_page: 1,
    total_subscribers: 0,
    show_per_page: 20
}

class FunnelSubscribers extends React.Component {
    constructor() {
        super();
        this.state = {
            is_page_loading: true,
            ...initialize_pagination
        }
    }

    componentDidMount() {
        this.setState({ is_page_loading: false });
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Funnel Subscribers - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        let state = this.state, currentUser = this.props.session.getCurrentUser;
        if(state.is_page_loading) return <LoadingPage />;
        return (
            <div className="funnel">
                {this.head()}
                <div className="newPageHeader" style={{ paddingBottom: 10 }}>
                    <div className="column column_12_12 row-separator">
                        <span className="hide-in-desktop float-left" style={{ padding: 15 }} />
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>Funnel Subscribers List</h4>
                        <label style={{ color: '#878787' }}>You have <span id="funnel_count" className="font-bold" style={{ color: '#23c78a' }}>{state.total_subscribers}</span> Subscribers</label>
                    </div>
                    <span className="clear" />
                </div>
                <div className="page-container">
                    <Query
                        query={GET_FUNNEL_SUBSCRIBERS(`{ id count order_date order_status shipping_information { name email phone street1 street2 city state country zip address_type aptOffice bldgVilla nearestLandmark } line_items { title variant price convertedPrice quantity tracking_number tracking_link ref_track shopify_order_number } }`)}
                        variables={{ id: currentUser.id, page: state.current_page, limit: state.show_per_page }}
                        onCompleted={data => {
                            let total_subscribers = data.getMyFunnelSubscribers.length !== 0 ? data.getMyFunnelSubscribers[0].count : 0;
                            this.setState({ total_subscribers });
                        }} notifyOnNetworkStatusChange>
                        {({ data, loading, refetch, error }) => {
                            if(loading) {
                                return (
                                    <div className="center-vertical-parent" style={{ height: '65vh', width: '100%' }}>
                                        <div className="center-vertical stretch-height text-center">
                                            <Loading width={300} height={300} />
                                        </div>
                                    </div>
                                );
                            } else if(error) {
                                return (
                                    <div className="center-vertical-parent" style={{ height: '65vh', width: '100%' }}>
                                        <div className="center-vertical stretch-height text-center">
                                            <img src="/assets/graphics/no-result.svg" style={{ height: '60%' }} />
                                            <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! AN ERROR HAS OCCURRED!</h4> <br />
                                            <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>Please try again later</label>
                                        </div>
                                    </div>
                                );
                            } else if (data.getMyFunnelSubscribers.length === 0) {
                                return (
                                    <div className="center-vertical-parent" style={{ height: '65vh', width: '100%' }}>
                                        <div className="center-vertical stretch-height text-center">
                                            <img src="/assets/graphics/no-result.svg" style={{ height: '60%' }} />
                                            <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! NO SUBSCRIBERS FOUND!</h4> <br />
                                            <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>There's no subscribers at the moment please comeback again...</label>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="product-card">
                                        <div className="product-details border-bottom">
                                            <Pagination
                                                currentPage={state.current_page}
                                                totalPage={state.total_subscribers}
                                                displayPageCount={state.show_per_page}
                                                action={page => this.setState({ current_page: page })}
                                            />
                                            <div className="clear" />
                                        </div>
                                        {data.getMyFunnelSubscribers.map((order, i) => {
                                            let line_item = order.line_items[0];
                                            return (
                                                <div className="product-details border-bottom" key={i}>
                                                    <div className="column column_4_12 row-separator">
                                                        <div className="row-separator">
                                                            <label className="header-small-light-bold">Subscriber Information</label>
                                                        </div>
                                                        <div className="row-separator">
                                                            <label className="header-medium-bold">{order.shipping_information.name}</label>
                                                            <label style={{ color: '#ef8805', fontFamily: "'Roboto', sans-serif" }}>{order.shipping_information.email}</label>
                                                        </div>
                                                        <div className="row-separator" style={{ lineHeight: 1.2 }}>
                                                            {order.shipping_information.phone &&
                                                                <label style={{ display: 'block' }}>Phone: {order.shipping_information.phone}</label>
                                                            }
                                                            {order.shipping_information.street1 &&
                                                                <label style={{ display: 'block' }}>Address: {order.shipping_information.street1}</label>
                                                            }
                                                            {order.shipping_information.street2 &&
                                                                <label style={{ display: 'block' }}>Address 2: {order.shipping_information.street2}</label>
                                                            }
                                                            {order.shipping_information.city &&
                                                                <label style={{ display: 'block' }}>City: {order.shipping_information.city}</label>
                                                            }
                                                            {order.shipping_information.state &&
                                                                <label style={{ display: 'block' }}>State: {order.shipping_information.state}</label>
                                                            }
                                                            {order.shipping_information.country &&
                                                                <label style={{ display: 'block' }}>Country: {order.shipping_information.country}</label>
                                                            }
                                                            {order.shipping_information.zip &&
                                                                <label style={{ display: 'block' }}>Zip: {order.shipping_information.zip}</label>
                                                            }
                                                            {order.shipping_information.address_type &&
                                                                <label style={{ display: 'block' }}>Address Type: {order.shipping_information.address_type}</label>
                                                            }
                                                            {order.shipping_information.aptOffice &&
                                                                <label style={{ display: 'block' }}>Apartment / Office: {order.shipping_information.aptOffice}</label>
                                                            }
                                                            {order.shipping_information.bldgVilla &&
                                                                <label style={{ display: 'block' }}>Building / Villa: {order.shipping_information.bldgVilla}</label>
                                                            }
                                                            {order.shipping_information.nearestLandmark &&
                                                                <label style={{ display: 'block' }}>Nearest Landmark: {order.shipping_information.nearestLandmark}</label>
                                                            }
                                                            <div className="display-inline" style={{ marginTop: 10 }}>
                                                                <label className="header-small-light-bold" style={{ marginRight: 5 }}>Verified By Webhook: </label>
                                                                <span className={"color-white " + (order.order_status === "paid" ? "badge-success" : "badge-warning")}>{order.order_status === "paid" ? "Verified" : "Not Verified"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="column column_8_12 row-separator">
                                                        {(() => {
                                                            let splitted_sinfo = line_item.variant.replace(/\s/g, "").split("-");
                                                            return (
                                                                <div className="row-separator" style={{ border: '1px solid #dfe5eb', backgroundColor: '#f4f9fd', borderRadius: 5, lineHeight: 1.2 }}>
                                                                    <div className="border-bottom" style={{ padding: 10 }}>
                                                                        <label className="header-small-light-bold">Subscription Information</label>
                                                                    </div>
                                                                    <div style={{ padding: 10 }}>
                                                                        <div className="display-inline">
                                                                            <label className="header-medium-bold" style={{ marginRight: 5 }}>Name: </label>
                                                                            <span>{points.capitalizeWord(line_item.title)}</span>
                                                                        </div>
                                                                        <label className="header-medium-bold">{splitted_sinfo[0]} {points.capitalizeWord(splitted_sinfo[1])} Subscription</label>
                                                                        <div className="display-inline">
                                                                            <label className="header-medium-bold" style={{ marginRight: 5 }}>Occurrence: </label>
                                                                            <span>{line_item.quantity - 1}</span>
                                                                        </div>
                                                                        <div className="display-inline">
                                                                            <label className="header-medium-bold" style={{ marginRight: 5 }}>Ref: </label>
                                                                            <span>{line_item.ref_track ? line_item.ref_track : mongoDBId.encode(order.id)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}

                                                        <div className="display-inline" style={{ padding: 15, backgroundColor: '#2d3740', borderRadius: 3 }}>
                                                            <div style={{ backgroundColor: '#21272d', borderRadius: '50%', width: 35, padding: '6px 9px', marginRight: 15 }}>
                                                                <img src="assets/graphics/purchase-shopping-bag.png" width="100%" />
                                                            </div>
                                                            <div>
                                                                <label className="header-small-light-bold">Purchased Date</label>
                                                                <label className="color-white">{moment(parseInt(order.order_date)).local().format("MMMM DD, YYYY. ddd, h:mm:ss A")}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="clear" />
                                                </div>
                                            );
                                        })}
                                        <div className="product-details border-bottom">
                                            <Pagination
                                                currentPage={state.current_page}
                                                totalPage={state.total_subscribers}
                                                displayPageCount={state.show_per_page}
                                                action={page => this.setState({ current_page: page })}
                                            />
                                            <div className="clear" />
                                        </div>
                                    </div>
                                );
                            }
                        }}
                    </Query>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(FunnelSubscribers);