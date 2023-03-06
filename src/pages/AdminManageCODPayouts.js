import React from 'react';
import toastr from 'toastr';
import moment from 'moment';
import { Link } from 'react-router-dom';
import withAuth from '../hoc/withAuth';
import ShowFilter from '../components/showFilter';
import Pagination from '../components/pagination';
import Loading from '../components/loading';
import ButtonWithPopup from '../components/buttonWithPopup';
import SelectTag from '../components/selectTag';
import Checkbox from '../components/checkbox';
import LoadingPage from '../components/loadingPage';
import Modal from '../components/ModalComponent';
import { GET_FUNNEL_ORDER_CREATOR_LIST, GET_MY_PAY_CHECK, GET_COMMISSION_CREATOR_LIST, GET_PURCHASE_ORDER, GET_FUNNEL_ORDERS, MARK_ALL_COMMISSION_AS_PAID, GET_PLG_PAYCHECK } from '../queries';
import { Query, Mutation } from 'react-apollo';
import { Table, Tbody } from '../components/table';
import InfiniteCalendar, { Calendar, withRange, } from 'react-infinite-calendar';
import { Helmet } from 'react-helmet';
const CalendarWithRange = withRange(Calendar);
const points = require('../../Global_Values')
const initializeCommissionBreakdown = {
    showCommissionBreakdown: false,
    selected_email: "",
    selected_name: "",
    modalCurrentPage: 1,
    totalCommissionBreakdown: 0,
    serialNumberToPaid: [],
    totalCommissionPaid: 0
}

class AdminManageCODPayouts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            floc: 'ALL',
            payBy: 'payout',
            totalPayoutCount: 0,
            totalPayouts: 0,
            currentPage: 1,
            filterByStartDate: "",
            filterByEndDate: "",
            show_vip: false,
            holdAll: false,
            search_user_input: "",
            search_user: "",
            ...initializeCommissionBreakdown,
            is_page_loading: true,
            export_loading: false
        }
    }

    componentDidMount() {
        toastr.options = points.toastrInitialize();

        const payoutDate = 1; // or monday
        const weekStartFrom = -2; // or last friday
        const currentDate = moment().local();
        const thisWeekMonday = moment(new Date(currentDate.toString())).local().weekday(payoutDate);
        const lastFriday = moment(thisWeekMonday).local().startOf('week').weekday(weekStartFrom);
        const endWeek = moment(new Date(points.deducDateFrom(new Date(lastFriday.toString()), 8))).local(); // may allowance na isa
        const startWeek = moment(endWeek).local().startOf('week').weekday(weekStartFrom);
        this.setState({ is_page_loading: false, filterByStartDate: startWeek.format("ddd MMM DD YYYY").toString(), filterByEndDate: endWeek.format("ddd MMM DD YYYY").toString() })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(this.state) === JSON.stringify(nextState)) return false;
        else return true;
    }

    filterDate(data) {
        if (data.eventType == 3) {
            this.setState({
                currentPage: 1,
                filterByStartDate: data.start.toDateString(),
                filterByEndDate: data.end.toDateString()
            })
        }
    }

    export_data() {
        let state = this.state, payload = {
            export: "admin_cod_payouts",
            userEmail: state.search_user,
            fulfillerLocation: state.floc,
            dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
            dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
            limit: parseInt(state.totalPayoutCount),
            show_vip: state.show_vip
        }, export_name = "Admin COD Payouts (" + state.filterByStartDate.substring(4) + " - " + state.filterByEndDate.substring(4) + ")";

        // start conditions only when commission because the default value is of payouts
        if (state.payBy == "commission") {
            payload.export = "admin_cod_commissions";
            export_name = "Admin Commissions (" + state.filterByStartDate.substring(4) + " - " + state.filterByEndDate.substring(4) + ")";
        }
        // end conditions only when commission because the default value is of payouts

        points.toastrPrompt(toastr, "info", "Exporting please wait...");
        this.setState({ export_loading: true }, () => {
            points.customFetch("/api/exportDataToCSV", "POST", payload, data => {
                if (data && data.status == "success") {
                    points.exportDataToCSV(data.uri, export_name);
                    points.toastrPrompt(toastr, "success", "Export Success.");
                } else {
                    let error_message = data && data.message ? data.message : "Export Error";
                    points.toastrPrompt(toastr, "warning", error_message);
                }
                this.setState({ export_loading: false });
            })
        });
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Manage COD Payouts - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const state = this.state;
        const currentUser = this.props.session.getCurrentUser;
        const tableDataFontSize = '1.2em';
        if (state.is_page_loading) return <LoadingPage />;

        return (
            <div className="admin funnel">
                {this.head()}
                <div className="newPageHeader">
                    <div className="column column_12_12 display-inline flex-container" style={{ justifyContent: 'flex-start' }}>
                        <div className="row-separator" style={{ margin: '0 5px' }}>
                            <span className="hide-in-desktop float-left" style={{ padding: 15 }} />
                            <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>Manage COD Payouts</h4>
                            <label style={{ color: '#878787' }}>You have <span className="font-bold" style={{ color: '#23c78a' }}>{state.totalPayoutCount}</span> {state.payBy}s</label>
                        </div>
                        <div className="row-separator" style={{ margin: '0 5px' }}>
                            <label className="header-medium-bold display-inline" style={{ display: 'flex' }}>
                                <span className="color-white display-inline flex-container" style={{ width: 25, height: 25, backgroundColor: '#d63031', borderRadius: '50%', marginRight: 20 }}>x</span>
                                Level 0 / Unsubscribed
                            </label>
                            <label className="header-medium-bold display-inline" style={{ display: 'flex' }}>
                                <div style={{ marginRight: 5, width: 40, height: 20, backgroundColor: '#d63031' }} />
                                Selling price too low (Do Not Pay Yet)
                            </label>
                        </div>
                    </div>
                    <span className="clear" />
                </div>
                <div className="page-container">
                    <div className="column column_12_12" style={{ padding: 0 }}>
                        <div className="filter-container">
                            {/* {currentUser.access_tags.includes("god") &&
                                <Link to="/admin-restore-paid" style={{ lineHeight: 0, marginRight: 10 }}>Restore</Link>
                            } */}
                            <Link to="/admin-all-cod-payouts" style={{ lineHeight: 0, marginRight: 10 }}>View All Payout</Link>
                            <Checkbox
                                id="show_vip"
                                label="Show VIP"
                                labelClassName="header-medium-bold font-small"
                                checked={state.show_vip}
                                onChange={value => this.setState({ show_vip: value })}
                                containerStyle={{ marginRight: 10 }}
                            />
                            {/* <Query query={GET_FUNNEL_ORDER_CREATOR_LIST}
                                variables={{
                                    userEmail: state.search_user,
                                    fulfillerLocation: state.floc,
                                    dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                    dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                    page: state.currentPage,
                                    show_vip: state.show_vip
                                }}
                                onCompleted={data => this.setState({ totalPayoutCount: data.getMyFunnelOrderCreatorList && data.getMyFunnelOrderCreatorList.length != 0 ? data.getMyFunnelOrderCreatorList[0].count : 0, totalPayouts: data.getMyFunnelOrderCreatorList && data.getMyFunnelOrderCreatorList.length != 0 ? data.getMyFunnelOrderCreatorList[0].totalPayout : 0 })} notifyOnNetworkStatusChange>
                                {({ data, loading, refetch, error }) => {
                                    if (loading) return <Loading height={50} width={50} />;
                                    else if (error) return <Checkbox
                                        id="unhold_all"
                                        label="Unhold All"
                                        labelClassName="header-medium-bold font-small"
                                        checked={false}
                                        containerStyle={{ marginRight: 10 }}
                                    />;
                                    else if (data.getMyFunnelOrderCreatorList.length === 0) return <span></span>;
                                    else {
                                        const isAllHold = data.getMyFunnelOrderCreatorList.every(val => val.on_hold === true);
                                        return <Checkbox
                                            id="unhold_all"
                                            label="Unhold All"
                                            labelClassName="header-medium-bold font-small"
                                            checked={isAllHold}
                                            onChange={value => {
                                                // fetch to update all unhold to hold
                                                points.customFetch(points.clientUrl + '/graphql', "POST", {
                                                    query: `mutation ($ids: [String], $on_hold: Boolean){
                                                        updateOrderHold(ids: $ids, on_hold: $on_hold){
                                                            id
                                                        }
                                                    }`,
                                                    variables: {
                                                        ids: data.getMyFunnelOrderCreatorList.map(list => list.ids).join(",").split(','),
                                                        on_hold: !isAllHold
                                                    }
                                                }, updateResult => {
                                                    refetch();
                                                    toastr.clear();
                                                    toastr.options.timeOut = 2000;
                                                    toastr['success']("All Orders are Unhold.", "Update Payouts")
                                                });

                                            }}
                                            containerStyle={{ marginRight: 10 }}
                                        />
                                    }
                                }}
                            </Query> */}
                            <div className="btn-search-container stretch-to-mobile display-inline" style={{ width: 300 }}>
                                <input type="text" name="search_user_input" value={state.search_user_input} placeholder="Search User Email" onKeyUp={event => points.enterToProceed(event, () => this.setState({ search_user: state.search_user_input }))} onChange={event => this.setState({ search_user_input: event.target.value })} />
                                <button className="fas fa-search" style={{ padding: '8px 15px' }} onClick={() => this.setState({ search_user: state.search_user_input })} />
                            </div>
                            {(() => {
                                var floc = [<option value="ALL" key={0}>All</option>];
                                const available_country = points.cod_available_country("no_country");
                                available_country.forEach((country, key) => {
                                    floc.push(<option value={country.iso2} key={key + 1}>{country.name}</option>)
                                })
                                return <SelectTag className="stretch-to-mobile" name="floc" value={state.floc} options={floc} onChange={event => this.setState({ floc: event.target.value, currentPage: 1 })} style={{ width: 170, margin: '0 5px' }} />;
                            })()}
                            {(() => {
                                var payBy = [
                                    <option value="payout" key={0}>Payouts</option>,
                                    <option value="commission" key={1}>Commissions</option>
                                ];
                                return <SelectTag className="stretch-to-mobile" name="payBy" value={state.payBy} options={payBy} onChange={event => this.setState({ payBy: event.target.value, currentPage: 1 })} style={{ width: 170, margin: '0 5px' }} />;
                            })()}
                            <ButtonWithPopup data={{
                                triggerDOM: <div className="stretch-to-mobile custom-select" style={{ margin: '0 5px', width: 150 }}>
                                    <div className="select-selected stretch-width text-left">Date</div>
                                </div>,
                                popupPosition: "bottom right",
                                text: <div className="infinite-calendar">
                                    <InfiniteCalendar
                                        Component={CalendarWithRange}
                                        width={"100%"}
                                        height={400}
                                        selected={{
                                            start: state.filterByStartDate ? state.filterByStartDate : new Date(),
                                            end: state.filterByEndDate ? state.filterByEndDate : new Date(),
                                        }}
                                        locale={{
                                            headerFormat: 'MMM Do',
                                        }}
                                        onSelect={data => this.filterDate(data)}
                                        theme={points.infiniteCalendarTheme()}
                                    />
                                </div>,
                                loading: false,
                                padding: 0,
                                style: { width: 320 },
                                checkORtimesButton: false
                            }} />
                            <button className="btn-success" style={{ padding: '8px 15px', margin: '0 5px' }} onClick={() => this.export_data()} disabled={state.export_loading || (state.totalPayoutCount === 0 ? true : false)}>Export to CSV</button>
                            <Pagination totalPage={state.totalPayoutCount || 1} currentPage={state.currentPage} action={result => this.setState({ currentPage: result })} style={{ margin: '0 5px' }} />
                        </div>
                        {state.currentPage > 1 || (state.filterByStartDate && state.filterByEndDate) || state.search_user ?
                            <div className="flex-container" style={{ justifyContent: 'flex-start' }}>
                                {state.currentPage > 1 &&
                                    <ShowFilter label={"Page: " + state.currentPage} onClick={() => this.setState({ currentPage: 1 })} />
                                }
                                {state.search_user &&
                                    <ShowFilter label={"User Email: " + state.search_user} onClick={() => this.setState({ search_user: "", search_user_input: "" })} />
                                }
                                {state.filterByStartDate && state.filterByEndDate ?
                                    <ShowFilter label={"Date Range: " + state.filterByStartDate + " - " + state.filterByEndDate} close={false} />
                                    : void 0}
                            </div>
                            : void 0}
                    </div>
                    <div className="column column_3_12">
                        {state.payBy == "commission" &&
                            <div className="row-separator product-card" style={{ backgroundColor: '#ff7837', color: '#fff' }}>
                                <div className="product-details text-center">
                                    <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>Total Commission</label>
                                    <Query query={GET_COMMISSION_CREATOR_LIST}
                                        variables={{
                                            userEmail: state.search_user,
                                            dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                            dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                            fulfillerLocation: state.floc
                                        }}
                                        onCompleted={data => this.setState({ totalPayoutCount: data.getMyCommissionCreatorList && data.getMyCommissionCreatorList.length != 0 ? data.getMyCommissionCreatorList[0].count : 0 })} notifyOnNetworkStatusChange>
                                        {({ data, loading, refetch, error }) => {
                                            this.refetchCommission = refetch;
                                            var totalCommission = 0;
                                            if (loading) return <Loading width={50} height={50} />;
                                            else if (data.getMyCommissionCreatorList.length != 0) totalCommission = data.getMyCommissionCreatorList[0].totalPayout.toFixed(2);
                                            return <label style={{ fontSize: '2.5em' }}>${points.commafy(totalCommission)}</label>;
                                        }}
                                    </Query>
                                </div>
                            </div>
                        }
                        {/* {state.payBy == "payout" &&
                            <div className="row-separator product-card" style={{ backgroundColor: '#ff7837', color: '#fff' }}>
                                <div className="product-details text-center">
                                    <div className="row-separator">
                                        <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>Remaining Payout</label>
                                        <Query query={GET_MY_PAY_CHECK}
                                            variables={{
                                                dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                                dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                                fulfillerLocation: state.floc
                                            }}>



                                            
                                            {({ data, loading, refetch, error }) => {
                                                var allPayouts = 0;
                                                if (loading) return <Loading width={50} height={50} />;
                                                else if (data.getMyPayCheck.count) allPayouts = data.getMyPayCheck.count.toFixed(2);
                                                return <label style={{ fontSize: '1.5em' }}>${points.commafy(allPayouts)}</label>;
                                            }}
                                        </Query>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>Total Payout</label>
                                        <Query query={GET_MY_PAY_CHECK}
                                            variables={{
                                                dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                                dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                                fulfillerLocation: state.floc,
                                                order_status: "delivered,paid"
                                            }}>
                                            {({ data, loading, refetch, error }) => {
                                                var allPayouts = 0;
                                                if (loading) return <Loading width={50} height={50} />;
                                                else if (data.getMyPayCheck.count) allPayouts = data.getMyPayCheck.count.toFixed(2);
                                                return <label style={{ fontSize: '2.5em' }}>${points.commafy(allPayouts)}</label>;
                                            }}
                                        </Query>
                                    </div>
                                </div>
                            </div>
                        } */}
                        {state.payBy == "payout" &&
                            <div className="row-separator product-card" style={{ backgroundColor: '#ff7837', color: '#fff' }}>
                                <div className="product-details text-center">
                                    <div className="row display-inline flex-container">
                                        <div className="column_6_12">
                                            <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>House Profit</label>
                                            <Query query={GET_MY_PAY_CHECK}
                                                variables={{
                                                    dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                                    dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                                    fulfillerLocation: state.floc,
                                                    order_status: "delivered,paid"
                                                }}>
                                                {({ data, loading, refetch, error }) => {
                                                    var allPayouts = 0;
                                                    if (loading) return <Loading width={50} height={50} />;
                                                    else if (data.getMyPayCheck.count) allPayouts = data.getMyPayCheck.count.toFixed(2);
                                                    return <label style={{ fontSize: '1.5em' }}>${points.commafy((allPayouts * 5 / 100).toFixed(2))}</label>;
                                                }}
                                            </Query>
                                        </div>
                                        <div className="column_6_12">
                                            <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>Remaining Payout</label>
                                            <Query query={GET_MY_PAY_CHECK}
                                                variables={{
                                                    dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                                    dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                                    fulfillerLocation: state.floc
                                                }}>
                                                {({ data, loading, refetch, error }) => {
                                                    var allPayouts = 0;
                                                    if (loading) return <Loading width={50} height={50} />;
                                                    else if (data.getMyPayCheck.count) allPayouts = data.getMyPayCheck.count.toFixed(2);
                                                    return <label style={{ fontSize: '1.5em' }}>${points.commafy(allPayouts)}</label>;
                                                }}
                                            </Query>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>Total Payout</label>
                                        <Query query={GET_MY_PAY_CHECK}
                                            variables={{
                                                dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                                dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                                fulfillerLocation: state.floc,
                                                order_status: "delivered,paid"
                                            }}>
                                            {({ data, loading, refetch, error }) => {
                                                var allPayouts = 0;
                                                if (loading) return <Loading width={50} height={50} />;
                                                else if (data.getMyPayCheck.count) allPayouts = data.getMyPayCheck.count.toFixed(2);
                                                return <label style={{ fontSize: '2.5em' }}>${points.commafy(allPayouts)}</label>;
                                            }}
                                        </Query>
                                    </div>
                                </div>
                            </div>
                        }
                        {state.payBy == "payout" &&
                            <div className="row-separator product-card" style={{ backgroundColor: '#1ac594', color: '#fff' }}>
                                <div className="product-details text-center">
                                    <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>Money on Hold</label>
                                    <Query query={GET_MY_PAY_CHECK}
                                        variables={{
                                            dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                            dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                            fulfillerLocation: state.floc,
                                            on_hold: true
                                        }}>
                                        {({ data, loading, refetch, error }) => {
                                            this.refetchMoneyOnHold = refetch;
                                            var allPayouts = 0;
                                            if (loading) return <Loading width={50} height={50} />;
                                            else if (data.getMyPayCheck.count) allPayouts = points.commafy(points.getTaxPercent(0.05, parseFloat(data.getMyPayCheck.count)).toFixed(2));
                                            return <label style={{ fontSize: '2.5em' }}>${allPayouts}</label>
                                        }}
                                    </Query>
                                </div>
                            </div>
                        }
                        {state.payBy == "payout" &&
                            <div className="row-separator product-card" style={{ backgroundColor: '#d63031', color: '#fff' }}>
                                <div className="product-details text-center">
                                    <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>Unpaid Subscriber Payout</label>
                                    <Query query={GET_MY_PAY_CHECK}
                                        variables={{
                                            userPrivilege: 0,
                                            dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                            dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                            fulfillerLocation: state.floc
                                        }}>
                                        {({ data, loading, refetch, error }) => {
                                            var allPayouts = 0;
                                            if (loading) return <Loading width={50} height={50} />;
                                            else if (data.getMyPayCheck.count) allPayouts = data.getMyPayCheck.count.toFixed(2);
                                            return <label style={{ fontSize: '2.5em' }}>${points.commafy(allPayouts)}</label>
                                        }}
                                    </Query>
                                </div>
                            </div>
                        }
                        {state.payBy == "payout" &&
                            <div className="row-separator product-card" style={{ backgroundColor: '#4267b2', color: '#fff' }}>
                                <div className="product-details text-center">
                                    <div className="row-separator">
                                        <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>Collected from courier</label>
                                        <Query query={GET_MY_PAY_CHECK}
                                            variables={{
                                                dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                                dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                                fulfillerLocation: state.floc,
                                                isAdminPayout: true
                                            }}>
                                            {({ data, loading, refetch, error }) => {
                                                var allPayouts = 0;
                                                if (loading) return <Loading width={50} height={50} />;
                                                else if (data.getMyPayCheck.count) allPayouts = data.getMyPayCheck.count.toFixed(2);
                                                return <label style={{ fontSize: '1.5em' }}>${points.commafy(allPayouts)}</label>
                                            }}
                                        </Query>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>Total Collected from courier</label>
                                        <Query query={GET_MY_PAY_CHECK}
                                            variables={{
                                                dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                                dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                                fulfillerLocation: state.floc,
                                                isAdminPayout: true,
                                                order_status: "delivered,paid"
                                            }}>
                                            {({ data, loading, refetch, error }) => {
                                                var allPayouts = 0;
                                                if (loading) return <Loading width={50} height={50} />;
                                                else if (data.getMyPayCheck.count) allPayouts = data.getMyPayCheck.count.toFixed(2);
                                                return <label style={{ fontSize: '2.5em' }}>${points.commafy(allPayouts)}</label>
                                            }}
                                        </Query>
                                    </div>
                                </div>
                            </div>
                        }
                        {state.payBy == "payout" &&
                            <div className="row-separator product-card" style={{ backgroundColor: '#1ac594', color: '#fff' }}>
                                <div className="product-details text-center">
                                    <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>Paid</label>
                                    <Query query={GET_MY_PAY_CHECK}
                                        variables={{
                                            dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                            dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                            fulfillerLocation: state.floc,
                                            order_status: "paid"
                                        }}>
                                        {({ data, loading, refetch, error }) => {
                                            var allPayouts = 0;
                                            if (loading) return <Loading width={50} height={50} />;
                                            else if (data.getMyPayCheck.count) allPayouts = data.getMyPayCheck.count.toFixed(2);
                                            return <label style={{ fontSize: '2.5em' }}>${points.commafy(allPayouts)}</label>
                                        }}
                                    </Query>
                                </div>
                            </div>
                        }
                        {state.payBy == "payout" &&
                            <div className="row-separator product-card" style={{ backgroundColor: '#09792d', color: '#fff', backgroundImage: 'radial-gradient(#19c594, #09792d)' }}>
                                <div className="product-details text-center">
                                    <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>Commission</label>
                                    <Query query={GET_PLG_PAYCHECK}
                                        variables={{
                                            dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                            dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                            location: state.floc
                                        }}>
                                        {({ data, loading, refetch, error }) => {
                                            var allPayouts = 0;
                                            if (loading) return <Loading width={50} height={50} />;
                                            else if (data.getPLGPaycheck.jsonStr) allPayouts = JSON.parse(data.getPLGPaycheck.jsonStr).count.toFixed(2);
                                            return <label style={{ fontSize: '2.5em' }}>${points.commafy(allPayouts)}</label>
                                        }}
                                    </Query>
                                </div>
                            </div>
                        }
                        {/* {state.payBy == "payout" &&
                            <div className="row-separator product-card" style={{ backgroundColor: '#09792d', color: '#fff', backgroundImage: 'linear-gradient(90deg, #19c594, #4266b2, #ff7837)' }}>
                                <div className="product-details text-center">
                                    <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>Collected by date range</label>
                                    <Query query={GET_MY_PAY_CHECK}
                                        variables={{
                                            dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                            dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                            fulfillerLocation: state.floc,
                                            isAdminPayout: true,
                                            isAdminPayoutCollectedRange: true
                                        }}>
                                        {({ data, loading, refetch, error }) => {
                                            var allPayouts = 0;
                                            if(loading) return <Loading width={50} height={50} />;
                                            else if(data.getMyPayCheck.count) allPayouts = data.getMyPayCheck.count.toFixed(2);
                                            return <label style={{ fontSize: '2.5em' }}>${points.commafy(allPayouts)}</label>
                                        }}
                                    </Query>
                                </div>
                            </div>
                        } */}
                    </div>
                    <div className="column column_9_12" style={{ padding: 0 }}>
                        <div className="product-card">
                            {state.payBy == "payout" &&
                                <Table headers={[{ text: "Email" }, { text: "Name" }, { text: "Payout Status" }, { text: "Delivered Payout" }, { text: "Collected Payout" }]} containerStyle={{ fontSize: '0.9em', padding: 10 }} >
                                    <Query query={GET_FUNNEL_ORDER_CREATOR_LIST}
                                        variables={{
                                            userEmail: state.search_user,
                                            fulfillerLocation: state.floc,
                                            dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                            dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                            page: state.currentPage,
                                            show_vip: state.show_vip
                                        }}
                                        onCompleted={data => this.setState({ totalPayoutCount: data.getMyFunnelOrderCreatorList && data.getMyFunnelOrderCreatorList.length != 0 ? data.getMyFunnelOrderCreatorList[0].count : 0, totalPayouts: data.getMyFunnelOrderCreatorList && data.getMyFunnelOrderCreatorList.length != 0 ? data.getMyFunnelOrderCreatorList[0].totalPayout : 0 })} notifyOnNetworkStatusChange>
                                        {({ data, loading, refetch, error }) => {
                                            if (loading) return <Tbody loading={true} />;
                                            else if (error) return <Tbody singleRowText={"An error has occurred please try again."} style={{ fontSize: tableDataFontSize }} />;
                                            else if (data.getMyFunnelOrderCreatorList.length == 0) return <Tbody singleRowText={"No payouts found. check back soon!"} style={{ fontSize: tableDataFontSize }} />;
                                            return data.getMyFunnelOrderCreatorList.map((user, index) => {
                                                const userData = JSON.parse(user.userData);
                                                var openNewUrl = '/dashboard?key=' + currentUser.pass_key + '&loc=' + state.floc + '&userID=' + user.creator + '&userEmail=' + userData.email;
                                                if (state.filterByStartDate && state.filterByEndDate) {
                                                    openNewUrl += '&dateStart=' + new Date(state.filterByStartDate).getTime() + '&dateEnd=' + new Date(state.filterByEndDate).getTime();
                                                }
                                                return (
                                                    <Tbody id={"row_" + index} index={index} key={index} style={{ fontSize: tableDataFontSize }}>
                                                        <div className="clickable display-inline" onClick={() => {
                                                            if (!user.on_hold) {
                                                                window.open(openNewUrl, '_blank');
                                                            } else {
                                                                toastr.clear();
                                                                toastr.options.timeOut = 2000;
                                                                toastr['warning']("User order was on hold.", "Order was Hold")
                                                            }
                                                        }}>
                                                            <span className="color-white display-inline flex-container" style={{ width: 25, height: 25, backgroundColor: userData.privilege != 0 ? '#27c586' : '#d63031', borderRadius: '50%', marginRight: 10 }}>{userData.privilege ? userData.privilege : "X"}</span>
                                                            <label>{userData.email}</label>
                                                        </div>
                                                        <div>
                                                            <label>{userData.name}</label>
                                                        </div>
                                                        <div>
                                                            {user.on_hold ? <button onClick={() => {
                                                                points.customFetch(points.clientUrl + '/graphql', "POST", {
                                                                    query: `mutation ($ids: [String], $on_hold: Boolean){
                                                                                updateOrderHold(ids: $ids, on_hold: $on_hold){
                                                                                    id
                                                                                }
                                                                            }`,
                                                                    variables: {
                                                                        ids: user.ids,
                                                                        on_hold: !user.on_hold
                                                                    }
                                                                }, updateResult => {
                                                                    refetch();
                                                                    if (this.refetchMoneyOnHold) this.refetchMoneyOnHold();
                                                                    toastr.clear();
                                                                    toastr.options.timeOut = 2000;
                                                                    toastr['success'](`Payout was Hold.`, "Update Payout")
                                                                });
                                                            }} className="btn-danger font-small">Unhold</button> : <button className="btn-success font-small" onClick={() => {
                                                                points.customFetch(points.clientUrl + '/graphql', "POST", {
                                                                    query: `mutation ($ids: [String], $on_hold: Boolean){
                                                                                updateOrderHold(ids: $ids, on_hold: $on_hold){
                                                                                    id
                                                                                }
                                                                            }`,
                                                                    variables: {
                                                                        ids: user.ids,
                                                                        on_hold: !user.on_hold
                                                                    }
                                                                }, updateResult => {
                                                                    refetch();
                                                                    if (this.refetchMoneyOnHold) this.refetchMoneyOnHold();
                                                                    toastr.clear();
                                                                    toastr.options.timeOut = 2000;
                                                                    toastr['success'](`Payout was Unhold.`, "Update Payout")
                                                                });
                                                            }}>Hold</button>}
                                                        </div>
                                                        <div>
                                                            <Query query={GET_MY_PAY_CHECK}
                                                                variables={{
                                                                    creator: user.creator,
                                                                    fulfillerLocation: state.floc,
                                                                    dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                                                    dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                                                }} onCompleted={data => {
                                                                    if (data.getMyPayCheck.count < 0) {
                                                                        document.getElementById("row_" + index).style.backgroundColor = "#d63031";
                                                                        document.getElementById("row_" + index).classList.add("color-white");
                                                                    }
                                                                }} notifyOnNetworkStatusChange>
                                                                {({ data, loading, refetch, error }) => {
                                                                    if (loading) return <Loading width={30} height={30} style={{ width: 'fit-content' }} />;
                                                                    else if (error) return <label>An error has occurred.</label>;
                                                                    return <label><strong>${points.commafy(points.getTaxPercent(0.05, parseFloat(data.getMyPayCheck.count)).toFixed(2))}</strong>({points.commafy(data.getMyPayCheck.count.toFixed(2))})</label>;
                                                                }}
                                                            </Query>
                                                        </div>
                                                        <div>
                                                            <Query query={GET_MY_PAY_CHECK}
                                                                variables={{
                                                                    creator: user.creator,
                                                                    fulfillerLocation: state.floc,
                                                                    dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                                                    dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                                                    isAdminPayout: true
                                                                }} onCompleted={data => {
                                                                    if (data.getMyPayCheck.count < 0) {
                                                                        document.getElementById("row_" + index).style.backgroundColor = "#d63031";
                                                                        document.getElementById("row_" + index).classList.add("color-white");
                                                                    }
                                                                }} notifyOnNetworkStatusChange>
                                                                {({ data, loading, refetch, error }) => {
                                                                    if (loading) return <Loading width={30} height={30} style={{ width: 'fit-content' }} />;
                                                                    else if (error) return <label>An error has occurred.</label>;
                                                                    return <label className="color-green"><strong>${points.commafy(points.getTaxPercent(0.05, parseFloat(data.getMyPayCheck.count)).toFixed(2))}</strong>({points.commafy(data.getMyPayCheck.count.toFixed(2))})</label>;
                                                                }}
                                                            </Query>
                                                        </div>
                                                    </Tbody>
                                                );
                                            });
                                        }}
                                    </Query>
                                </Table>
                            }
                            {state.payBy == "commission" &&
                                <Table headers={[{ text: "Email" }, { text: "Name" }, { text: "Total Commission" }]} containerStyle={{ fontSize: '0.9em', padding: 10 }} >
                                    <Query query={GET_COMMISSION_CREATOR_LIST}
                                        variables={{
                                            userEmail: state.search_user,
                                            fulfillerLocation: state.floc,
                                            dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                            dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                            page: state.currentPage,
                                            show_vip: state.show_vip
                                        }}>
                                        {({ data, loading, refetch, error }) => {
                                            this.refetchForAdminCommission = refetch;
                                            if (loading) return <Tbody loading={true} />;
                                            else if (error) return <Tbody singleRowText={"An error has occurred please try again."} style={{ fontSize: tableDataFontSize }} />;
                                            else if (data.getMyCommissionCreatorList.length == 0) return <Tbody singleRowText={"No commissions found. check back soon!"} style={{ fontSize: tableDataFontSize }} />;
                                            return data.getMyCommissionCreatorList.map((user, index) => {
                                                const userData = JSON.parse(user.userData), total_commission = points.commafy(userData.commission.toFixed(2));
                                                return (
                                                    <Tbody index={index} key={index} style={{ fontSize: tableDataFontSize }}>
                                                        <div className="clickable" onClick={() => this.setState({ showCommissionBreakdown: true, selected_email: userData.email, selected_name: userData.name, totalCommissionPaid: total_commission })}>
                                                            <label>{userData.email}</label>
                                                        </div>
                                                        <div>
                                                            <label>{userData.name}</label>
                                                        </div>
                                                        <div>
                                                            <label>${total_commission}</label>
                                                        </div>
                                                    </Tbody>
                                                );
                                            });
                                        }}
                                    </Query>
                                </Table>
                            }
                        </div>
                    </div>
                </div>

                {/* Modals */}
                {state.showCommissionBreakdown &&
                    <Modal open={state.showCommissionBreakdown} closeModal={() => this.setState({ ...initializeCommissionBreakdown })} session={this.props.session} style={{ borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0, width: '50%' }}>
                        <div>
                            <style dangerouslySetInnerHTML={{ __html: `.popup-content .content {padding: 0px;}` }} />
                            <div className="modal-header row-separator">
                                <h4 className="header">Commission Breakdown</h4>
                            </div>
                            <div className="display-inline flex-container">
                                <div className="column column_8_12 row-separator">
                                    <label>Name: {state.selected_name}</label><br />
                                    <label>Email: {state.selected_email}</label>
                                </div>
                                <div className="column column_4_12 row-separator text-right">
                                    {currentUser.access_tags.includes("god") ?
                                        <Mutation
                                            mutation={MARK_ALL_COMMISSION_AS_PAID}
                                            variables={{
                                                serialNumbers: JSON.stringify(state.serialNumberToPaid),
                                                total_commission: state.totalCommissionPaid,
                                                start_date: points.sendDateToServer(state.filterByStartDate, true),
                                                end_date: points.sendDateToServer(state.filterByEndDate),
                                                commissioner_name: state.selected_name
                                            }}>
                                            {(markAllCommissionAsPaid, { data, loading, error }) => {
                                                return (
                                                    <ButtonWithPopup data={{
                                                        triggerDOM: <button id="mark-all-commission-as-paid" className="btn-success stretch-to-mobile font-small" disabled={loading}>Mark all commission as paid</button>,
                                                        popupPosition: "left center",
                                                        text: <h3 style={{ margin: 10 }}>Are you sure?</h3>,
                                                        padding: 0,
                                                        arrow: true,
                                                        triggerID: "mark-all-commission-as-paid",
                                                        action: () => points.executeMutation(markAllCommissionAsPaid, toastr, () => {
                                                            this.setState({ ...initializeCommissionBreakdown });
                                                            if (this.refetchForAdminCommission) this.refetchForAdminCommission();
                                                            if (this.refetchCommission) this.refetchCommission();
                                                            toastr.clear();
                                                            points.toastrPrompt(toastr, "success", "Successfully paid the commission of user", "Success");
                                                        }),
                                                        style: { maxWidth: 220, minWidth: 220, borderRadius: 5 }
                                                    }} />
                                                );
                                            }}
                                        </Mutation>
                                        : <label>&nbsp;</label>}
                                </div>
                                <span className="clear" />
                            </div>
                            <div className="filter-container row-separator" style={{ margin: 10 }}>
                                <Pagination className="stretch-to-mobile" totalPage={state.totalCommissionBreakdown} currentPage={state.modalCurrentPage} action={result => this.setState({ modalCurrentPage: result })} style={{ marginLeft: 10 }} />
                            </div>
                            {state.modalCurrentPage > 1 &&
                                <div className="flex-container row-separator" style={{ justifyContent: 'flex-start', margin: 10 }}>
                                    <ShowFilter label={"Page: " + state.modalCurrentPage} onClick={() => this.setState({ modalCurrentPage: 1 })} />
                                </div>
                            }
                            <div className="product-card" style={{ margin: 10 }}>
                                <Query query={
                                    GET_PURCHASE_ORDER(`{ sold_item_serial_numbers product_variant_id product_price remainingQty affiliate_budget }`)
                                } variables={{ affiliate_email: state.selected_email, isApproved: true }}>
                                    {({ data, loading, refetch, error }) => {
                                        if (loading || error) return null;
                                        var serial_numbers = [];
                                        data.getPurchaseOrders.forEach(po => serial_numbers.push(...po.sold_item_serial_numbers))
                                        return (
                                            <Table headers={[{ text: "Product Name" }, { text: "Quantity" }, { text: "Product Cost" }, { text: "Commission" }, { text: "Date Delivered" }]} containerStyle={{ fontSize: '0.9em' }} >
                                                <Query query={
                                                    GET_FUNNEL_ORDERS(`{ ids count dateStatusDelivered order_status line_items { title quantity productCost affiliateCost } }`)
                                                } variables={{
                                                    serial_numbers: JSON.stringify(serial_numbers),
                                                    merchant_type: "cod",
                                                    order_status: "delivered,paid",
                                                    sortBy: "dateStatusDelivered",
                                                    filterByStartDate: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                                    filterByEndDate: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                                    skip: state.modalCurrentPage - 1,
                                                    isPaidCommision: false,
                                                    cod_analytics: true
                                                }}
                                                    onCompleted={data => {
                                                        if (data.getMyFunnelOrders && data.getMyFunnelOrders.length != 0) {
                                                            var idsToUpdate = data.getMyFunnelOrders.map(el => el.ids);
                                                            idsToUpdate = [].concat.apply([], idsToUpdate);
                                                            this.setState({ totalCommissionBreakdown: data.getMyFunnelOrders[0].count, serialNumberToPaid: serial_numbers });
                                                        }
                                                    }} notifyOnNetworkStatusChange>
                                                    {({ data, loading, refetch, error }) => {
                                                        this.refetchTablesQuery = refetch;
                                                        if (loading) return <Tbody loading={true} style={{ fontSize: tableDataFontSize }} />;
                                                        if (error) return <Tbody singleRowText={"An error has occurred please try again."} style={{ fontSize: tableDataFontSize }} />;
                                                        if (data.getMyFunnelOrders.length == 0) return <Tbody singleRowText={"No result found. check back soon!"} style={{ fontSize: tableDataFontSize }} />
                                                        return data.getMyFunnelOrders.map((order, index) => {
                                                            return (
                                                                <Tbody index={index} key={index} style={{ fontSize: tableDataFontSize }}>
                                                                    <div>
                                                                        <ul className="item-list" style={{ width: '100%' }}>
                                                                            {order.line_items.map((li, index) => {
                                                                                return <li style={{ backgroundColor: 'unset', color: 'inherit' }} key={index}>{li.title}</li>;
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                    <div className="display-inline">
                                                                        <ul className="item-list" style={{ width: '100%' }}>
                                                                            {order.line_items.map((li, index) => {
                                                                                return <li style={{ backgroundColor: 'unset', color: 'inherit' }} key={index}>{li.quantity}x</li>;
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                    <div className="display-inline">
                                                                        <ul className="item-list" style={{ width: '100%' }}>
                                                                            {order.line_items.map((li, index) => {
                                                                                return <li style={{ backgroundColor: 'unset', color: 'inherit' }} key={index}>${li.productCost}</li>;
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                    <div className="display-inline">
                                                                        <ul className="item-list" style={{ width: '100%' }}>
                                                                            {order.line_items.map((li, index) => {
                                                                                return <li style={{ backgroundColor: 'unset', color: 'inherit' }} key={index}>${li.affiliateCost}</li>;
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                    <div className="display-inline">
                                                                        {order.dateStatusDelivered ? moment(new Date(parseInt(order.dateStatusDelivered))).local().format("MMMM DD, YYYY") : order.order_status}
                                                                    </div>
                                                                </Tbody>
                                                            );
                                                        });
                                                    }}
                                                </Query>
                                            </Table>
                                        );
                                    }}
                                </Query>
                            </div>
                        </div>
                    </Modal>
                }
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AdminManageCODPayouts);