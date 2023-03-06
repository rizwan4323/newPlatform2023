import React from 'react';
import Modal from '../components/ModalComponent/';
import { Link } from 'react-router-dom';
import ProductCard from '../components/productCard';
import { Helmet } from 'react-helmet';
import Loading from '../components/loading';
import { SAVE_PAYMENT_SETTINGS, SAVE_PAYONEER_SETTINGS } from './../queries';
import { Mutation } from 'react-apollo';
import toastr from 'toastr';
const points = require('../../Global_Values');

class WantToGetPaid extends React.Component {
    constructor() {
        super();
        this.state = {
            wantTogetPaid: false,
            activeTab: "transferwise" // transferwise || payoneer
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
    }

    handleOnChange(name, event) {
        var value = event.target.value;
        this.setState({ [name]: value })
    }

    setLoadingTime(tiemout, etimeout) {
        toastr.options.timeOut = tiemout;
        toastr.options.extendedTimeOut = etimeout;
    }

    toggleWantToGetPaid() {
        const { business_name, business_email, account_number, wire_transfer_number, bank_code, routing_number, account_type, address } = this.props.session.getCurrentUser;
        const splitAddress = address ? address.split("__") : [""];
        this.setState({ wantTogetPaid: !this.state.wantTogetPaid, business_name, business_email, account_number, wire_transfer_number, bank_code, routing_number, account_type, address: "", streetAddress: splitAddress[0], city: splitAddress[1] || "", stateProvince: splitAddress[2] || "", country: splitAddress[3] || "", zipcode: splitAddress[4] || "" }, () => this.combineAddress())
    }

    combineAddress() {
        const state = this.state;
        const completeAddress = (state.streetAddress ? state.streetAddress + "__" : "null__") + (state.city ? state.city + "__" : "null__") + (state.stateProvince ? state.stateProvince + "__" : "null__") + (state.country ? state.country + "__" : "null__") + (state.zipcode ? state.zipcode : "null");
        this.setState({ address: completeAddress })
    }

    savePaymentSettings(savePaymentSettings) {
        this.setLoadingTime(0, 0)
        toastr.clear();
        toastr.info("Saving payment setting please wait...", "");
        savePaymentSettings().then(({ data }) => {
            this.setLoadingTime(3000, 2000);
            toastr.clear();
            toastr.success("Save Success", "");
            this.props.refetch();
            this.toggleWantToGetPaid();
        }).catch(error => {
            this.setLoadingTime(0, 0);
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    render() {
        var state = this.state;
        var currentUser = this.props.session.getCurrentUser;
        return (
            <div>
                <button className="btn-success stretch-width stretch-to-mobile" onClick={() => this.toggleWantToGetPaid()} style={{ padding: '8px 15px' }}>Add your payment info</button>

                {state.wantTogetPaid &&
                    <Modal open={state.wantTogetPaid} closeModal={() => this.toggleWantToGetPaid()} session={this.props.session} style={{ borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0, width: '30%' }}>
                        <div className="funnel p-setting">
                            <style dangerouslySetInnerHTML={{
                                __html: `
                                .modal > .content { padding: 0 !important; }
                                .p-setting label { display: block; }
                            `}} />
                            <div className="modal-header text-center">
                                <div className="row-separator display-inline" style={{
                                    marginBottom: "0px"
                                }}>
                                    <div className="column column_6_12" style={{
                                        cursor: "pointer",
                                        borderBottom: state.activeTab === "transferwise" ? "2px solid #23c78a" : "unset"
                                    }} onClick={() => {
                                        const { business_name, business_email, account_number, wire_transfer_number, bank_code, routing_number, account_type, address } = this.props.session.getCurrentUser;
                                        const splitAddress = address ? address.split("__") : [""];
                                        this.setState({
                                            activeTab: "transferwise", business_name, business_email, account_number, wire_transfer_number, bank_code, routing_number, account_type, address: "",
                                            streetAddress: splitAddress[0], city: splitAddress[1] || "", stateProvince: splitAddress[2] || "", country: splitAddress[3] || "", zipcode: splitAddress[4] || ""
                                        }, () => this.combineAddress());
                                    }}>
                                        <img src="assets/graphics/integration_transferwise.png" style={{ width: 200, maxWidth: '100%' }} />
                                    </div>
                                    <div className="column column_6_12" style={{
                                        cursor: "pointer",
                                        borderBottom: state.activeTab === "payoneer" ? "2px solid #23c78a" : "unset"
                                    }} onClick={() => {

                                        const splitAddress = currentUser.payoneer_details && currentUser.payoneer_details.address ? currentUser.payoneer_details.address.split("__") : [""];

                                        this.setState({
                                            activeTab: "payoneer",
                                            name: currentUser.payoneer_details && currentUser.payoneer_details.name ? currentUser.payoneer_details.name : "",
                                            beneficiary_name: currentUser.payoneer_details && currentUser.payoneer_details.beneficiary_name ? currentUser.payoneer_details.beneficiary_name : "",
                                            address: currentUser.payoneer_details && currentUser.payoneer_details.address ? currentUser.payoneer_details.address : "",
                                            streetAddress: splitAddress[0], city: splitAddress[1] || "", stateProvince: splitAddress[2] || "", country: splitAddress[3] || "", zipcode: splitAddress[4] || "",
                                            account_type: currentUser.payoneer_details && currentUser.payoneer_details.account_type ? currentUser.payoneer_details.account_type : "",
                                            routing_number: currentUser.payoneer_details && currentUser.payoneer_details.routing_number ? currentUser.payoneer_details.routing_number : "",
                                            account_number: currentUser.payoneer_details && currentUser.payoneer_details.account_number ? currentUser.payoneer_details.account_number : "",
                                        },() => this.combineAddress());
                                    }}>
                                        <img src="assets/graphics/integration_payoneerlogo.png" style={{ width: 200, maxWidth: '70%' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="page-container">
                                {state.activeTab === "transferwise" ?
                                    <Mutation
                                        mutation={SAVE_PAYMENT_SETTINGS}
                                        variables={{
                                            id: this.props.session.getCurrentUser.id,
                                            business_name: state.business_name,
                                            business_email: state.business_email,
                                            account_number: state.account_number,
                                            wire_transfer_number: state.wire_transfer_number,
                                            bank_code: state.bank_code,
                                            routing_number: state.routing_number,
                                            account_type: state.account_type,
                                            address: state.address
                                        }} >
                                        {(savePaymentSettings, { data, loading, error }) => {
                                            return (
                                                <form onSubmit={event => {
                                                    event.preventDefault();
                                                    this.savePaymentSettings(savePaymentSettings);
                                                }}>
                                                    <div className="row-separator notify-label">
                                                        <label className="font-questrial-light"><a href="https://transferwise.com/u/giancarlob59" target="_blank"><u style={{ color: '#28c686', fontSize: '1em' }}>Click here</u></a> to setup your transferwise account.</label>
                                                    </div>
                                                    <div className="row-separator">
                                                        <label className="row-separator">Account Holder</label>
                                                        <input type="text" name="business_name" value={state.business_name} onChange={event => this.handleOnChange("business_name", event)} required />
                                                    </div>
                                                    <div className="row-separator">
                                                        <label className="row-separator">Business Email</label>
                                                        <input type="text" name="business_email" value={state.business_email} onChange={event => this.handleOnChange("business_email", event)} required />
                                                    </div>
                                                    <div className="row-separator">
                                                        <label className="row-separator">Account Number</label>
                                                        <input type="text" name="account_number" value={state.account_number} onChange={event => this.handleOnChange("account_number", event)} required />
                                                    </div>
                                                    <div className="row-separator">
                                                        <label className="row-separator">Wire Transfer Number</label>
                                                        <input type="text" name="wire_transfer_number" value={state.wire_transfer_number} onChange={event => this.handleOnChange("wire_transfer_number", event)} required />
                                                    </div>
                                                    <div className="row-separator">
                                                        <label className="row-separator">Bank code</label>
                                                        <input type="text" name="bank_code" value={state.bank_code} onChange={event => this.handleOnChange("bank_code", event)} placeholder="e.g. SWIFT or BIC" required />
                                                    </div>
                                                    <div className="row-separator">
                                                        <label className="row-separator">Routing number</label>
                                                        <input type="text" name="routing_number" value={state.routing_number} onChange={event => this.handleOnChange("routing_number", event)} placeholder="e.g. ACH or ABA" required />
                                                    </div>
                                                    <div className="row-separator">
                                                        <label className="row-separator">Account Type</label>
                                                        <input type="text" name="account_type" value={state.account_type} onChange={event => this.handleOnChange("account_type", event)} required />
                                                    </div>
                                                    <div className="row-separator">
                                                        <label className="row-separator">Bank Address</label>
                                                        <div className="clear">
                                                            <div className="column column_12_12 row-separator" style={{ padding: '0 5px' }}>
                                                                <input type="text" name="streetAddress" value={state.streetAddress} placeholder="Street Address" onChange={event => this.handleOnChange(event.target.name, event)} onBlur={() => this.combineAddress()} required />
                                                            </div>
                                                            <div className="column column_6_12 row-separator" style={{ padding: '0 5px' }}>
                                                                <input type="text" name="stateProvince" value={state.stateProvince} placeholder="State / Province" onChange={event => this.handleOnChange(event.target.name, event)} onBlur={() => this.combineAddress()} required />
                                                            </div>
                                                            <div className="column column_6_12 row-separator" style={{ padding: '0 5px' }}>
                                                                <input type="text" name="city" value={state.city} placeholder="City" onChange={event => this.handleOnChange(event.target.name, event)} onBlur={() => this.combineAddress()} required />
                                                            </div>
                                                            <div className="column column_6_12 row-separator" style={{ padding: '0 5px' }}>
                                                                <input type="text" name="country" value={state.country} placeholder="Country" onChange={event => this.handleOnChange(event.target.name, event)} onBlur={() => this.combineAddress()} required />
                                                            </div>
                                                            <div className="column column_6_12 row-separator" style={{ padding: '0 5px' }}>
                                                                <input type="text" name="zipcode" value={state.zipcode} placeholder="Zip Code" onChange={event => this.handleOnChange(event.target.name, event)} onBlur={() => this.combineAddress()} required />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row-separator">
                                                        <button type="submit" className="btn-success stretch-width" disabled={loading}>SAVE</button>
                                                    </div>
                                                </form>
                                            );
                                        }}
                                    </Mutation>
                                    :
                                    <Mutation
                                        mutation={SAVE_PAYONEER_SETTINGS}
                                        variables={{
                                            id: this.props.session.getCurrentUser.id,
                                            beneficiary_name: state.beneficiary_name,
                                            address: state.address,
                                            account_type: state.account_type,
                                            routing_number: state.routing_number,
                                            account_number: state.account_number,
                                            name: state.name,
                                        }} >
                                        {(savePaymentSettings, { data, loading, error }) => {
                                            /**
                                             * id
                                            beneficiary_name
                                            address
                                            account_type
                                            routing_number
                                            account_number
                                            name
                                             */
                                            return (
                                                <form onSubmit={event => {
                                                    event.preventDefault();
                                                    this.savePaymentSettings(savePaymentSettings);
                                                }}>
                                                    <div className="row-separator notify-label">
                                                        <label className="font-questrial-light"><a href="http://share.payoneer.com/nav/Zv83VVWC48zHFOLyzWlqCTXudd-NIFzKFMYc5Rtm2uLAW-mZrZbjs61zyPMvLlbv7nllySLF54u1btrkDrqaTA2" target="_blank"><u style={{ color: '#28c686', fontSize: '1em' }}>Click here</u></a> to setup your payoneer account.</label>
                                                    </div>
                                                    <div className="row-separator">
                                                        <label className="row-separator">Bank Name</label>
                                                        <input type="text" name="name" value={state.name} onChange={event => this.handleOnChange("name", event)} required />
                                                    </div>
                                                    <div className="row-separator">
                                                        <label className="row-separator">Routing number (ABA)</label>
                                                        <input type="text" name="routing_number" value={state.routing_number} onChange={event => this.handleOnChange("routing_number", event)} placeholder="e.g. ACH or ABA" required />
                                                    </div>
                                                    <div className="row-separator">
                                                        <label className="row-separator">Account Number</label>
                                                        <input type="text" name="account_number" value={state.account_number} onChange={event => this.handleOnChange("account_number", event)} required />
                                                    </div>
                                                    <div className="row-separator">
                                                        <label className="row-separator">Account Type</label>
                                                        <input type="text" name="account_type" value={state.account_type} onChange={event => this.handleOnChange("account_type", event)} required />
                                                    </div>
                                                    <div className="row-separator">
                                                        <label className="row-separator">Beneficiary Name</label>
                                                        <input type="text" name="beneficiary_name" value={state.beneficiary_name} onChange={event => this.handleOnChange("beneficiary_name", event)} required />
                                                    </div>
                                                    <div className="row-separator">
                                                        <label className="row-separator">Bank Address</label>
                                                        <div className="clear">
                                                            <div className="column column_12_12 row-separator" style={{ padding: '0 5px' }}>
                                                                <input type="text" name="streetAddress" value={state.streetAddress} placeholder="Street Address" onChange={event => this.handleOnChange(event.target.name, event)} onBlur={() => this.combineAddress()} required />
                                                            </div>
                                                            <div className="column column_6_12 row-separator" style={{ padding: '0 5px' }}>
                                                                <input type="text" name="stateProvince" value={state.stateProvince} placeholder="State / Province" onChange={event => this.handleOnChange(event.target.name, event)} onBlur={() => this.combineAddress()} required />
                                                            </div>
                                                            <div className="column column_6_12 row-separator" style={{ padding: '0 5px' }}>
                                                                <input type="text" name="city" value={state.city} placeholder="City" onChange={event => this.handleOnChange(event.target.name, event)} onBlur={() => this.combineAddress()} required />
                                                            </div>
                                                            <div className="column column_6_12 row-separator" style={{ padding: '0 5px' }}>
                                                                <input type="text" name="country" value={state.country} placeholder="Country" onChange={event => this.handleOnChange(event.target.name, event)} onBlur={() => this.combineAddress()} required />
                                                            </div>
                                                            <div className="column column_6_12 row-separator" style={{ padding: '0 5px' }}>
                                                                <input type="text" name="zipcode" value={state.zipcode} placeholder="Zip Code" onChange={event => this.handleOnChange(event.target.name, event)} onBlur={() => this.combineAddress()} required />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row-separator">
                                                        <button type="submit" className="btn-success stretch-width" disabled={loading}>SAVE</button>
                                                    </div>
                                                </form>
                                            );
                                        }}
                                    </Mutation>
                                }

                            </div>
                        </div>
                    </Modal>
                }
            </div>
        );
    }
}

export default WantToGetPaid;