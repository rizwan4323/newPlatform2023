import React from 'react';
import toastr from 'toastr';
import withAuth from './../hoc/withAuth';
import ReactDOM from 'react-dom';
import Loading from '../components/loading';
import { PLG_TOPUP, GET_TOPUP_LOGS } from './../queries';
import { Query, Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import Popup from 'reactjs-popup';
import Modal from '../components/ModalComponent';
const points = require('../../Global_Values');

let initializeTopup = {
    topup_ammount: 50,
    topup_payerID: null,
    topup_paymentID: null,
    topup_paymentToken: null
}

class Credits extends React.Component {
    constructor() {
        super();
        this.state = {
            client: points.paypalClient,
            activeTab: 'topup',
            topup_ammount: 50,
            topup_min: 50,
            topup_max: 1500
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
            "timeOut": 0,
            "extendedTimeOut": 0,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        if(window.outerWidth <= 780){
            // for movile change absolute to unset
            document.querySelector("#credits").style.position = "unset";
        }
    }

    onTabsToggle(tabs){
        this.setState({
            activeTab: tabs
        })
    }

    handleOnChange(event){
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [name]: value
        });
        if(parseInt(value) < this.state.topup_min){
            toastr.clear();
            toastr.warning("Minimum of $50 required.","");
        } else if(value > this.state.topup_max){
            toastr.clear();
            toastr.warning("You can only topup maximum of $1500 per transaction.","");
        }
    }

    onTopupSuccess(onTopupSuccess, data){
        this.setState({
            topup_payerID: data.payerID,
            topup_paymentID: data.paymentID,
            topup_paymentToken: data.paymentToken
        }, () => {
            onTopupSuccess().then(({ data }) => {
                document.getElementById("credit-clickable").click();
                toastr.clear();
                toastr.success("Successfully Added $"+this.state.topup_ammount+" to your PLG account.","Success!");
                this.setState({
                    ...initializeTopup
                }, () => {
                    this.props.refetch();
                })
            }).catch(error => {
                console.error("ERR =>", error);
            });
        })
    }

    onTopupError(error){
        document.getElementById("credit-clickable").click();
        toastr.clear();
        toastr.warning("An error has occured!","");

        this.setState({
            topup_ammount: 0
        })
        
        console.log("Error:",error);
    }

    render() {
        var state = this.state;

        return (
            <Popup
                trigger={<span id="credit-clickable">Fulfillment Credits: <strong>${points.commafy(this.props.session.getCurrentUser.plg_balance.toFixed(2))}</strong></span>}
                position="bottom center"
                on="click" className="points-tooltip" style={{ width: 'fit-content !important', minWidth: 'fit-content' }}>
                <div className="funnel" style={{ color: '#4a4a4a' }}>
                    <div style={{width: '50%', float: 'left'}}>
                        <button className={state.activeTab == "topup" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("topup")}>Topup</button>
                    </div>
                    <div style={{width: '50%', float: 'left'}}>
                        <button className={state.activeTab == "logs" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("logs")}>Logs</button>
                    </div>
                    <br/><br/><br/>
                    {(() => {
                        if(state.activeTab == "topup"){
                            return (
                                <div className="form_wrap">
                                    <div className="form_row">
                                        <div className="form_item">
                                            <div className="form_input">
                                                <label>Add Credit (USD)</label>
                                                <input type="number" name="topup_ammount" value={state.topup_ammount} onChange={event => this.handleOnChange(event)} />
                                                <span className="bottom_border"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form_row">
                                        <div className="form_item">
                                            <span className="helperText">Min. ${points.commafy(state.topup_min)} and Max: ${points.commafy(state.topup_max)}</span>
                                        </div>
                                    </div>
                                    <div className="form_row">
                                        {state.topup_ammount >= this.state.topup_min && state.topup_ammount <= this.state.topup_max ?
                                            <Mutation
                                                mutation={PLG_TOPUP}
                                                variables={{
                                                    id: this.props.session.getCurrentUser.id,
                                                    total_topup: parseFloat(state.topup_ammount),
                                                    payerID: state.topup_payerID,
                                                    paymentID: state.topup_paymentID,
                                                    paymentToken: state.topup_paymentToken,
                                                    pass_key: this.props.session.getCurrentUser.pass_key
                                                }}
                                                >
                                                {(onTopupSuccess, { data, loading, error }) => {
                                                    return (
                                                        <label className="font-roboto-light" style={{fontSize: '0.875em'}}>Temporarily Unavailable</label>
                                                    );
                                                    return <PaypalExpressBtn env={"sandbox"} client={state.client} currency={'USD'} total={parseFloat(state.topup_ammount)} onError={this.onTopupError.bind(this)} onSuccess={this.onTopupSuccess.bind(this, onTopupSuccess)} />;
                                                }}
                                            </Mutation>
                                        : void 0}
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div className="table-container">
                                    <h3>Topup Logs</h3>
                                    <table className="table-list">
                                        <thead>
                                            <tr>
                                                <th className="text-center">#</th>
                                                <th className="text-center">Date</th>
                                                <th className="text-center">Topup</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <Query query={GET_TOPUP_LOGS} variables={{id: this.props.session.getCurrentUser.id, limit: 10}}>
                                                {({ data, loading, refetch, error }) => {
                                                    if(loading){
                                                        return (
                                                            <tr className="text-center">
                                                                <td colSpan="3">
                                                                    <Loading height={50} width={50} />
                                                                </td>
                                                            </tr>
                                                        );   
                                                    }
                                                    
                                                    if(data.getTopupLogs.length == 0){
                                                        return (
                                                            <tr>
                                                                <td className="text-center" colSpan="3">
                                                                    <span className="no-result">Empty... check back soon!</span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }

                                                    return data.getTopupLogs.map((logs,index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td className="text-center">{index+1}</td>
                                                                <td className="text-center">{moment(parseInt(logs.date_paid)).startOf('second').fromNow()}</td>
                                                                <td className="text-center">${points.commafy(logs.total_topup)}</td>
                                                            </tr>
                                                        );
                                                    })
                                                }}
                                            </Query>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td className="text-center" colSpan="3">
                                                    <Link to="/fulfillment-center-genie-logs">See More</Link>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            );
                        }
                    })()}
                </div>
            </Popup>
        );
    }
}

export default Credits;