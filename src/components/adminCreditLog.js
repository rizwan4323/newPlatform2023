import React from 'react';
import { GET_CREDIT_LOGS, GET_CREDIT_LOGS_COUNT, GET_TOPUP_LOGS, GET_TOPUP_LOGS_COUNT } from './../queries';
import { Query } from 'react-apollo';
import moment from 'moment';
import Pagination from '../components/pagination';
import Loading from '../components/loading';
const points = require('../../Global_Values');
 
class AdminCreditLog extends React.Component {
    constructor() {
        super();
        this.state = {
            totalPerPage: 5,
            totalLogs: 0,
            pageNumber: 1,
            activeTab: 'credit'
        }
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
        var userID = this.props.userID;

        return (
            <div className="column column_12_12 table-container">
                <h3 style={{margin: 0}}>User Credit Log</h3>
                <div className="column column_12_12">
                    <div className="column column_6_12">
                        <button className={state.activeTab == "topup" ? "dwobtn-focus dwobtn" : "dwobtn"} onClick={() => this.togleTabChange("topup")}>Topup</button>
                    </div>
                    <div className="column column_6_12">
                        <button className={state.activeTab == "credit" ? "dwobtn-focus dwobtn" : "dwobtn"} onClick={() => this.togleTabChange("credit")}>Credit</button>
                    </div>
                </div>
                {state.activeTab == "topup" &&
                    <div>
                        <Query query={GET_TOPUP_LOGS_COUNT} variables={{ id: userID }}>
                            {({ data, loading, refetch, error }) => {
                                if (loading) return null;

                                if (data.getTopupLogsCount.count == 0) return null;

                                return <Pagination displayPageCount={state.totalPerPage} totalPage={data.getTopupLogsCount.count} action={this.pageChange.bind(this)} />
                            }}
                        </Query>
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
                                    id: userID,
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
                    <div>
                        <Query query={GET_CREDIT_LOGS_COUNT} variables={{ id: userID }}>
                            {({ data, loading, refetch, error }) => {
                                if (loading) return null;
        
                                if (data.getCreditLogsCount.count == 0) return null;
        
                                return <Pagination displayPageCount={state.totalPerPage} totalPage={data.getCreditLogsCount.count} action={this.pageChange.bind(this)} />
                            }}
                        </Query>
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
                                    id: userID,
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
                                                    <td className="ellipsis" style={{maxWidth: 200}} title={logs.description}>{logs.description}</td>
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

export default AdminCreditLog;