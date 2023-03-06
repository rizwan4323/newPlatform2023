import React from 'react';
import toastr from 'toastr';
import withAuth from './../hoc/withAuth';
import { GET_TOPUP_LOGS, GET_TOPUP_LOGS_COUNT, GET_CREDIT_LOGS, GET_CREDIT_LOGS_COUNT } from './../queries';
import { Query } from 'react-apollo';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import Pagination from '../components/pagination';
import Loading from '../components/loading';
const points = require('../../Global_Values');

class FulfillmentChinaCreditLogs extends React.Component {
    constructor() {
        super();
        this.state = {
            totalPerPage: 50,
            totalLogs: 0,
            pageNumber: 1,
            activeTab: 'topup'
        }
    }

    componentDidMount() {
        toastr.options = {
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
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Fulfillment Credit Logs - Product List Genie</title>
            </Helmet>
        );
    }

    pageChange(pageNumber) {
        this.setState({
            pageNumber
        })
    }

    togleTabChange(tab){
        this.setState({
            pageNumber: 1,
            activeTab: tab
        })
    }

    render() {
        var state = this.state;

        return (
            <div className="grid page-container">
                {this.head()}
                <div className="fulfillment-title">
                    <h1 style={{margin: 0}}>Fulfillment Logs</h1>
                </div>
                <div className="column column_12_12">
                    <div className="column column_1_12">
                        <button className={state.activeTab == "topup" ? "dwobtn-focus dwobtn" : "dwobtn"} onClick={() => this.togleTabChange("topup")}>Topup</button>
                    </div>
                    <div className="column column_1_12">
                        <button className={state.activeTab == "credit" ? "dwobtn-focus dwobtn" : "dwobtn"} onClick={() => this.togleTabChange("credit")}>Credit</button>
                    </div>
                </div>
                {state.activeTab == "topup" &&
                    <div className="column column_12_12 table-container">
                        <br/>
                        <Query query={GET_TOPUP_LOGS_COUNT} variables={{ id: this.props.session.getCurrentUser.id }}>
                            {({ data, loading, refetch, error }) => {
                                if (loading) return null;

                                if (data.getTopupLogsCount.count == 0) return null;

                                return <Pagination displayPageCount={state.totalPerPage} totalPage={data.getTopupLogsCount.count} action={this.pageChange.bind(this)} />
                            }}
                        </Query>
                        <h3>Topup Logs</h3>
                        <table className="table-list">
                            <thead>
                                <tr>
                                    <th className="text-center">#</th>
                                    <th className="text-center">Date</th>
                                    <th className="text-center">Topup</th>
                                    <th className="text-center">Payment ID</th>
                                    <th className="text-center">Payment Token</th>
                                </tr>
                            </thead>
                            <tbody>
                                <Query query={GET_TOPUP_LOGS} variables={{
                                    id: this.props.session.getCurrentUser.id,
                                    limit: state.totalPerPage,
                                    offset: ((state.pageNumber - 1) * state.totalPerPage)
                                }} >
                                    {({ data, loading, refetch, error }) => {
                                        if (loading) {
                                            return (
                                                <tr className="text-center">
                                                    <td colSpan="5">
                                                        <Loading height={50} width={50} />
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        if (data.getTopupLogs.length == 0) {
                                            return (
                                                <tr>
                                                    <td className="text-center" colSpan="5">
                                                        <span className="no-result">Empty... check back soon!</span>
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        return data.getTopupLogs.map((logs, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="text-center">{((state.pageNumber - 1) * state.totalPerPage) + (index + 1)}</td>
                                                    <td className="text-center">{moment(parseInt(logs.date_paid)).startOf('second').fromNow()}</td>
                                                    <td className="text-center">${points.commafy(logs.total_topup.toFixed(2))}</td>
                                                    <td className="text-center">{logs.paymentID}</td>
                                                    <td className="text-center">{logs.paymentToken}</td>
                                                </tr>
                                            );
                                        })
                                    }}
                                </Query>
                            </tbody>
                        </table>
                    </div>
                }
                {state.activeTab == "credit" &&
                    <div className="column column_12_12 table-container">
                        <br/>
                        <Query query={GET_CREDIT_LOGS_COUNT} variables={{ id: this.props.session.getCurrentUser.id }}>
                            {({ data, loading, refetch, error }) => {
                                if (loading) return null;

                                if (data.getCreditLogsCount.count == 0) return null;

                                return <Pagination displayPageCount={state.totalPerPage} totalPage={data.getCreditLogsCount.count} action={this.pageChange.bind(this)} />
                            }}
                        </Query>
                        <h3>Credit Logs</h3>
                        <table className="table-list">
                            <thead>
                                <tr>
                                    <th className="text-center">#</th>
                                    <th className="text-center">Date</th>
                                    <th className="text-center">Cost</th>
                                    <th className="text-center">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <Query query={GET_CREDIT_LOGS} variables={{
                                    id: this.props.session.getCurrentUser.id,
                                    limit: state.totalPerPage,
                                    offset: ((state.pageNumber - 1) * state.totalPerPage)
                                }} >
                                    {({ data, loading, refetch, error }) => {
                                        if (loading) {
                                            return (
                                                <tr className="text-center">
                                                    <td colSpan="4">
                                                        <Loading height={50} width={50} />
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        if (data.getCreditLogs.length == 0) {
                                            return (
                                                <tr>
                                                    <td className="text-center" colSpan="4">
                                                        <span className="no-result">Empty... check back soon!</span>
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        return data.getCreditLogs.map((logs, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="text-center">{((state.pageNumber - 1) * state.totalPerPage) + (index + 1)}</td>
                                                    <td className="text-center">{moment(parseInt(logs.date_paid)).startOf('second').fromNow()}</td>
                                                    <td className="text-right" style={{color: logs.increase ? '#4dae50' : 'red'}}>{logs.increase ? '+' : '-'}${points.commafy(logs.total_cost.toFixed(2))}</td>
                                                    <td>{logs.description}</td>
                                                </tr>
                                            );
                                        })
                                    }}
                                </Query>
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(FulfillmentChinaCreditLogs);