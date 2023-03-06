import React from 'react';
import withAuth from '../hoc/withAuth';
import Modal from '../components/ModalComponent/';
import Loading from '../components/loading';
import ToggleSwitch from '../components/toggleSwitch';
import { Helmet } from 'react-helmet';
import { Query, Mutation } from 'react-apollo';
import { GET_MY_INTEGRATIONS, SAVE_OR_UPDATE_INTEGRATION, DELETE_INTEGRATION, SAVE_PAYMENT_SETTINGS } from './../queries';
import ButtonWithPopup from '../components/buttonWithPopup';
import toastr from 'toastr';
import SelectTag from '../components/selectTag';
import WantTogetPaid from '../components/wantToGetPaid';
import CryptoJS from 'crypto-js';
const points = require('../../Global_Values');

var initializeForm = {
    selectedIntegrationID: '',
    merchant_type: 'stripe',
    merchant_name: '',
    public_key: '',
    private_key: '',
    other: '',
    temp: '',
    token: '',
    sandboxLive: false,
    concatKeys: '',
    how_to_merchant: 346243615,
    how_to_webhook: 346243590,
    docsTut: "https://docs.google.com/document/d/1U5f4WPb1Fv1ZNgwrcckaOm0JLSWs0R9Gx1U_HfxmX1Q/edit?usp=sharing",
    merchantSignupLink: "https://dashboard.stripe.com/register"
}

const initializePaymentSetting = {
    business_name: '',
    business_email: '',
    account_number: '',
    wire_transfer_number: '',
    bank_code: '',
    routing_number: '',
    account_type: '',
    address: ''
}

var isHaveKlavio = false;
var isHaveTwilio = false;

class Integration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addNewMerchant: false,
            vimeoid: null,
            iframePlayer: false,
            ...initializeForm,
            refetch: null,
            ...initializePaymentSetting
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

    setLoadingTime(tiemout, etimeout){
        toastr.options.timeOut = tiemout;
        toastr.options.extendedTimeOut = etimeout;
    }

    changeMerchant(merchant){
        this.setState({
            public_key: '',
            private_key: '',
            merchant_type: merchant
        })
    }

    handleOnChange(name, event){
        var value = event.target.value;
        this.setState({ [name]: value })
    }

    showIntegrationCount(length){
        document.querySelector("#list_count").innerHTML = "Integration List ("+length+")"
    }

    decode(str) {
        var bytes = CryptoJS.AES.decrypt(str, points.plg_domain_secret);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    toggleIframePlay(vimeoid){
        this.setState({
            iframePlayer: !this.state.iframePlayer,
            vimeoid: vimeoid ? vimeoid : null
        })
    }

    toggleAddNewMerchant() {
        this.setState({
            ...initializeForm,
            addNewMerchant: !this.state.addNewMerchant
        })
    }

     async getToken(public_key, private_key, other, live)  {
         console.log(Buffer.from(public_key +":"+ private_key ).toString('base64'))
       const response = await fetch("/get-braintreet-token", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify({ live, merchantAccountId: other, authkey: Buffer.from(public_key +":"+ private_key ).toString('base64') }) })
       const tokedData = await response.json();
       return tokedData;    
    }


    toggleEditMerchant(merchant){
        var docsTut = "";
        if(merchant.merchant_type == "braintree") {
            // const [merchantId, publicKey, privateKey, token, sandboxLive] = [...this.decode(merchant.private_key).split(':')];
            console.log(merchant, "merchantmerchantmerchant", this.decode(merchant.private_key))
            this.setState({
                docsTut,
                selectedIntegrationID: merchant.id,
                merchant_type: merchant.merchant_type,
                merchant_name: merchant.merchant_name,
                private_key: merchant.private_key,
                public_key: merchant.public_key,
                other: merchant.other,
                // token: token,
                // temp: privateKey,
                sandboxLive: merchant.sandboxLive,
                // sandboxLive: sandboxLive === "true" ? true : false,

                concatKeys: merchant.private_key,
                addNewMerchant: true
            })
        } else {
            this.setState({
                docsTut,
                selectedIntegrationID: merchant.id,
                merchant_type: merchant.merchant_type,
                merchant_name: merchant.merchant_name,
                public_key: merchant.public_key,
                other: merchant.other,
                temp: merchant.temp,
                sandboxLive: merchant.sandboxLive,
                concatKeys: merchant.concatKeys,
                addNewMerchant: true
            })
        }
        if(merchant.merchant_type == "stripe") docsTut = "https://docs.google.com/document/d/1U5f4WPb1Fv1ZNgwrcckaOm0JLSWs0R9Gx1U_HfxmX1Q/edit?usp=sharing";
        else if(merchant.merchant_type == "authorize.net") docsTut = "https://docs.google.com/document/d/17ZB4OubkTLjNR5JY0ZhKw88yOTMUZ8f1wjCfPSyXPUM/edit?usp=sharing";
        else if(merchant.merchant_type == "twilio") docsTut = "https://docs.google.com/document/d/1B0HSC50Kvj2LhNXBmpm4th7rBy5zXkqp6aZzl_0ZMwc/edit?usp=sharing";

    }

    saveORupdateIntegration(saveORupdateIntegration){
        toastr.clear();
        toastr.info("Please wait...", "Saving");
        saveORupdateIntegration().then(({ data }) => {
            toastr.clear();
            toastr.success("Integration Successfully Saved.", "Success!");
            this.state.refetch();
            this.toggleAddNewMerchant();
        }).catch(error => {
            toastr.clear();
            toastr.warning("All fields is required!", "Required!");
        });
    }

    deleteIntegration(deleteIntegration){
        toastr.clear();
        toastr.info("Please wait...", "Deleting");
        deleteIntegration().then(({ data }) => {
            toastr.clear();
            toastr.success("Integration has been removed.", "Success!");
            this.state.refetch();
        }).catch(error => {
            toastr.clear();
            toastr.warning("It seems like there's an error while deleting your integration please refresh the page and try again.", "An error has occured!");
        });
    }
    generateBraintreeTokenPrompt(getToken){
        toastr.clear();
        toastr.info("Please wait...", "Deleting");
        getToken().then(({ data }) => {}).catch(error => {})
        deleteIntegration().then(({ data }) => {
            toastr.clear();
            toastr.success("Integration has been removed.", "Success!");
            this.state.refetch();
        }).catch(error => {
            toastr.clear(); 
            toastr.warning("It seems like there's an error while deleting your integration please refresh the page and try again.", "An error has occured!");
        });
    } 

    // getTutorialButton(domTrigger, position, merchant, tutMerchantVimeoID, tutWebhookVimeoID){
    //     var merchantName = points.capitalizeWord(merchant.replace(/_/g," "));
    //     return (
    //         <ButtonWithPopup data={{
    //             triggerDOM: domTrigger,
    //             popupPosition: position+" right",
    //             title: "",
    //             text: <div style={{ textAlign: 'left' }}>
    //                 <div style={{ padding: '10px 20px', overflow: 'hidden', display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
    //                     <div className="float-left" style={{width: '70%'}}>
    //                         <label className="font-roboto-bold">{merchantName.toUpperCase()}</label>
    //                     </div>
    //                     <div className="float-left text-right" style={{width: '30%'}}>
    //                         <u className="clickable font-small" onClick={() => {
    //                             if(tutMerchantVimeoID || tutWebhookVimeoID){
    //                                 this.setState({
    //                                     ...initializeForm,
    //                                     merchant_type: merchant
    //                                 })
    //                             } else {
    //                                 toastr.clear();
    //                                 toastr.warning(merchantName+" is not available right now.","Not Available");
    //                             }
    //                         }}>Apply Now</u>
    //                     </div>
    //                 </div>
    //                 <div style={{ padding: '10px 20px', backgroundColor: '#f7f7f7' }}>
    //                     <label className="one-line-ellipsis font-roboto-light font-small" style={{ maxWidth: 210 }}>How to add {merchantName} as Merchant & Gateway.<br/>Click the button below.</label>
    //                     <button className="btn-success stretch-width" style={{ display: 'flex', alignItems: 'center', padding: 0, marginBottom: 5 }} onClick={() => {
    //                         if(tutMerchantVimeoID){
    //                             this.toggleIframePlay(tutMerchantVimeoID)
    //                         } else {
    //                             toastr.clear();
    //                             toastr.warning("Adding merchant tutorial for "+merchantName+" is not available right now.","Not Available");
    //                         }
    //                     }}>
    //                         <span className="fas fa-play" style={{fontSize: 12, padding: 10, backgroundColor: '#24b47b'}} />
    //                         <label className="one-line-ellipsis font-roboto-bold color-white font-small" style={{ margin: '0 5px', padding: 5, maxWidth: 210 }}>How to connect to merchant</label>
    //                     </button>
    //                     <label className="one-line-ellipsis font-roboto-light font-small" style={{ maxWidth: 210 }}>How to add Webhooks using {merchantName}.<br/>Click the button below. </label>
    //                     <button className="btn-warning stretch-width" style={{ display: 'flex', alignItems: 'center', padding: 0 }} onClick={() => {
    //                         if(tutWebhookVimeoID){
    //                             this.toggleIframePlay(tutWebhookVimeoID)
    //                         } else {
    //                             toastr.clear();
    //                             toastr.warning("Webhook tutorial for "+merchantName+" is not available right now.","Not Available");
    //                         }
    //                     }}>
    //                         <span className="fas fa-play" style={{fontSize: 12, padding: 10, backgroundColor: '#e67300'}} />
    //                         <label className="one-line-ellipsis font-roboto-bold color-white font-small" style={{ margin: '0 5px', padding: 5, maxWidth: 210 }}>How to add a Webhooks</label>
    //                     </button>
    //                 </div>
    //             </div>,
    //             action: () => { },
    //             triggerID: "hover",
    //             loading: false,
    //             padding: 0,
    //             checkORtimesButton: false,
    //             onAction: 'hover',
    //             style: {
    //                 borderRadius: 3,
    //                 padding: 5,
    //                 minWidth: 190
    //             }
    //         }} />
    //     );
    // }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Integrations - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        var state = this.state;
        var userObject = this.props.session.getCurrentUser;
        return (
            <div className="funnel">
                {this.head()}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    body {
                        background-image: none;
                        background-color: #f4f9fd;
                    }
                `}} />
                <div className="flex-container display-inline"  style={{ padding: 20, backgroundColor: '#f4f9fd', overflow: 'visible' }}>
                    <div className="column column_8_12">
                        <span className="hide-in-desktop float-left" style={{padding: 15}} />
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>Integrations</h4>
                    </div>
                    <div className="column column_2_12">
                        <WantTogetPaid {...this.props} />
                    </div>
                    <div className="column column_2_12">
                        <button className="btn-success stretch-width stretch-to-mobile" onClick={() => this.toggleAddNewMerchant()}>
                            <span className="fas fa-plus" /> Add New Integration
                        </button>
                    </div>
                </div>
                <div className="page-container">
                    <div className="product-card">
                        <div className="product-details">
                            <h4 className="title font-roboto-light" id="list_count">Integration List (0)</h4>
                            <div className="table-container clear">
                                <table className="table-list font-questrial-light">
                                    <thead>
                                        <tr>
                                            <th>Merchant Name</th>
                                            <th>Merchant Type</th>
                                            <th>Publishable key</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <Query query={GET_MY_INTEGRATIONS} notifyOnNetworkStatusChange={true} variables={{
                                            id: userObject.id
                                        }} onCompleted={data => {
                                            this.showIntegrationCount(data.getMyIntegrations.length);
                                        }}>
                                            {({ data, loading, refetch, error }) => {
                                                state.refetch = refetch;
                                                if(loading){
                                                    return (
                                                        <tr>
                                                            <td colSpan="5"><Loading width={150} height={150} /></td>
                                                        </tr>
                                                    );
                                                }

                                                if(error){
                                                    return (
                                                        <tr>
                                                            <td className="text-center" colSpan="5">
                                                                <img src="/assets/graphics/no-result.svg" width="200px" /> <br/>
                                                                <h4 className="title" style={{fontSize: '2.5em'}}>OOPS! THAT'S AN ERROR!</h4> <br/>
                                                                <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>
                                                                    Error loading the integration data. please try again.
                                                                </label>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                                
                                                if(data.getMyIntegrations.length == 0){
                                                    return (
                                                        <tr>
                                                            <td className="text-center" colSpan="5">
                                                                <img src="/assets/graphics/no-result.svg" width="200px" /> <br/>
                                                                <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>
                                                                    No data to display <span className="clickable" onClick={() => this.toggleAddNewMerchant()}>click here</span> to add new integration.
                                                                </label>
                                                            </td>
                                                        </tr>
                                                    );
                                                }

                                                return data.getMyIntegrations.map((integration, index) => {
                                                    if(integration.merchant_type == "klaviyo") this.isHaveKlavio = true;
                                                    if(integration.merchant_type == "twilio") this.isHaveTwilio = true;
                                                    return (
                                                        <tr key={index}>
                                                            <td className="clickable">{integration.merchant_name}</td>
                                                            <td>{integration.merchant_type}</td>
                                                            <td>{integration.public_key}</td>
                                                            <td className="text-center">
                                                                <div className="column column_6_12" style={{padding: 0}}>
                                                                    <button className="btn-success stretch-width font-roboto-light one-line-ellipsis" onClick={() => this.toggleEditMerchant(integration)}><span className="fas fa-pen" /> Edit</button>
                                                                </div>
                                                                <div className="column column_6_12" style={{padding: 0}}>
                                                                    <Mutation
                                                                        mutation={DELETE_INTEGRATION}
                                                                        variables={{
                                                                            id: integration.id
                                                                        }} >
                                                                        {(deleteIntegration, { data, loading, error }) => {
                                                                            return (
                                                                                <ButtonWithPopup data={{
                                                                                    triggerDOM: <button id={"remove_"+index} className="btn-danger stretch-width font-roboto-light one-line-ellipsis"><span className="fas fa-trash-alt" /> Delete</button>,
                                                                                    popupPosition: "bottom right",
                                                                                    text: <label className="font-roboto-light" style={{fontSize: '0.875em'}}>Are you sure you want to delete <u style={{color: '#28c686'}}>{integration.merchant_name}</u>?<br/> This cannot be undone.</label>,
                                                                                    action: () => this.deleteIntegration(deleteIntegration),
                                                                                    triggerID: "remove_"+index,
                                                                                    loading: loading,
                                                                                    padding: 20
                                                                                }} />
                                                                            );
                                                                        }}
                                                                    </Mutation>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                });
                                            }}
                                        </Query>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {state.addNewMerchant &&
                    <Modal open={state.addNewMerchant} closeModal={() => this.toggleAddNewMerchant()} session={this.props.session} style={{borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0}}>
                        <div className="funnel">
                            <style dangerouslySetInnerHTML={{__html: `
                                .modal > .content {
                                    padding: 0 !important;
                                }
                            `}} />
                            <div className="modal-header">
                                <h4 className="header">{state.selectedIntegrationID ? "EDIT" : "ADD NEW"} INTEGRATION</h4>
                            </div>
                            <div className="page-container">
                                <div className="form_wrap">
                                    {!state.selectedIntegrationID &&
                                        <div className="row-separator column column_12_12 notify-label">
                                            <label className="font-questrial-light">Don't have an account yet? <a href={state.merchant_type != "klaviyo" ? state.merchantSignupLink : "https://www.klaviyo.com/"} target="_blank"><u style={{color: '#28c686', fontSize: '1em'}}>Click here</u></a> to create your own merchant</label>
                                        </div>
                                    }
                                    <div className="column column_6_12">
                                        <div className="form_row">
                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>{state.merchant_type != "klaviyo" ? "Merchant" : "Integration"} Type <span className="require-sign-color">*</span></label>
                                            <input type="text" className="font-roboto-light" value={state.merchant_type} onChange={event => this.handleOnChange("merchant_type", event)} style={{marginTop: 10, fontSize: '0.875em'}} disabled={true} />
                                        </div>
                                        <div className="form_row">
                                            {(() => {
                                                if(state.merchant_type != "klaviyo"){
                                                    return (
                                                        <label className="font-questrial-light" style={{fontSize: '0.875em'}}>
                                                            Merchant Name <span className="require-sign-color">*</span> &nbsp;
                                                            <ButtonWithPopup data={{
                                                                triggerDOM: <span id="whats_this" className="whats_this">i</span>,
                                                                popupPosition: "right center",
                                                                text: <div style={{maxWidth: 300}}>
                                                                    <img src="/assets/graphics/merchant_name_for.png" width="100%" />
                                                                </div>,
                                                                triggerID: "whats_this",
                                                                loading: false,
                                                                padding: 5,
                                                                checkORtimesButton: false,
                                                                // onAction: 'hover',
                                                                style: {
                                                                    borderRadius: 5,
                                                                    padding: 5
                                                                }
                                                            }} />
                                                        </label>
                                                    );
                                                } else {
                                                    return <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Integration Name <span className="require-sign-color">*</span></label>;
                                                }
                                            })()}
                                            <input type="text" className="font-roboto-light" placeholder={`my ${state.merchant_type} integration`} value={state.merchant_name} onChange={event => this.handleOnChange("merchant_name", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                        </div>
                                        {(() => {
                                            if(state.merchant_type == "stripe"){
                                                return (
                                                    <div style={{width: '100%'}}>
                                                        <div className="form_row">
                                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Publishable key  <span className="require-sign-color">*</span> <span className="whats_this" onClick={() => this.toggleIframePlay(state.how_to_merchant)}>i</span></label>
                                                            <input type="text" className="font-roboto-light"  placeholder="xxxxxxxxxxxxx" value={state.public_key} onChange={event => this.handleOnChange("public_key", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                        </div>
                                                        <div className="form_row">
                                                            {state.selectedIntegrationID &&
                                                                <style dangerouslySetInnerHTML={{__html: `
                                                                    #stripe-secret::placeholder {
                                                                        color: #4c4b4b;
                                                                    }
                                                                `}} />
                                                            }
                                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Secret key <span className="require-sign-color">*</span></label>
                                                            <input type="text" id="stripe-secret" className="font-roboto-light" placeholder={state.selectedIntegrationID ? "******************************" : "xxxxxxxxxxxxx"} value={state.private_key} onChange={event => this.handleOnChange("private_key", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                        </div>
                                                    </div>
                                                );
                                            } else if(state.merchant_type == "paypal"){
                                                return (
                                                    <div className="form_row">
                                                        {state.selectedIntegrationID &&
                                                            <style dangerouslySetInnerHTML={{__html: `
                                                                #paypal-secret::placeholder {
                                                                    color: #4c4b4b;
                                                                }
                                                            `}} />
                                                        }
                                                        <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Live Client ID <span className="require-sign-color">*</span> <span className="whats_this" onClick={() => this.toggleIframePlay(state.how_to_merchant)}>i</span></label>
                                                        <input type="text" id="paypal-secret" className="font-roboto-light" placeholder={state.selectedIntegrationID ? "******************************" : "xxxxxxxxxxxxx"} value={state.private_key} onChange={event => this.handleOnChange("private_key", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                    </div>
                                                );
                                            } else if(state.merchant_type == "authorize.net"){
                                                return (
                                                    <div style={{width: '100%'}}>
                                                        <div className="form_row">
                                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Client Key <span className="require-sign-color">*</span> {state.how_to_merchant ? <span className="whats_this" onClick={() => this.toggleIframePlay(state.how_to_merchant)}>i</span> : void 0}</label>
                                                            <input type="text" className="font-roboto-light"  placeholder="xxxxxxxxxxxxx" value={state.public_key} onChange={event => this.handleOnChange("public_key", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                        </div>
                                                        <div className="form_row">
                                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>API Login ID <span className="require-sign-color">*</span></label>
                                                            <input type="text" className="font-roboto-light"  placeholder="xxxxxxxxxxxxx" value={state.other} onChange={event => this.handleOnChange("other", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                        </div>
                                                        <div className="form_row">
                                                            {state.selectedIntegrationID &&
                                                                <style dangerouslySetInnerHTML={{__html: `
                                                                    #authorize.net-secret::placeholder {
                                                                        color: #4c4b4b;
                                                                    }
                                                                `}} />
                                                            }
                                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Transaction Key <span className="require-sign-color">*</span></label>
                                                            <input type="text" id="authorize.net-secret" className="font-roboto-light" placeholder={state.selectedIntegrationID ? "******************************" : "xxxxxxxxxxxxx"} value={state.private_key} onChange={event => this.handleOnChange("private_key", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                        </div>
                                                    </div>
                                                );
                                            } else if (state.merchant_type == "conekta") {
                                                return (
                                                    <div style={{ width: '100%' }}>
                                                        <div className="form_row">
                                                            <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Public key  <span className="require-sign-color">*</span> <span className="whats_this" onClick={() => this.toggleIframePlay(state.how_to_merchant)}>i</span> </label>
                                                            <input type="text" className="font-roboto-light" placeholder="key_xxxxxxxxxxxxxxxxxxxxxx" value={state.public_key} onChange={event => this.handleOnChange("public_key", event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                                        </div>
                                                        <div className="form_row">
                                                            {state.selectedIntegrationID &&
                                                                <style dangerouslySetInnerHTML={{
                                                                    __html: `
                                                                    #conekta::placeholder {
                                                                        color: #4c4b4b;
                                                                    }
                                                                `}} />
                                                            }
                                                            <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Private Key <span className="require-sign-color">*</span></label>
                                                            <input type="text" id="conekta" className="font-roboto-light" placeholder={state.selectedIntegrationID ? "**************************" : "key_xxxxxxxxxxxxxxxxxxxxxx"} value={state.private_key} onChange={event => this.handleOnChange("private_key", event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                                        </div>
                                                    </div>
                                                );
                                            } else if (state.merchant_type == "braintree") {
                                                return (
                                                    <div style={{width: '100%'}}>
                                                        <div className="form_row">
                                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Merchant ID <span className="require-sign-color">*</span></label>
                                                            <input type="text" className="font-roboto-light"  placeholder="xxxxxxxxxxxxx" value={state.other} onChange={event => this.handleOnChange("other", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                        </div>
                                                        <div className="form_row">
                                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Public key <span className="require-sign-color">*</span> {state.how_to_merchant ? <span className="whats_this" onClick={() => this.toggleIframePlay(state.how_to_merchant)}>i</span> : void 0}</label>
                                                            <input type="text" className="font-roboto-light"  placeholder="xxxxxxxxxxxxx" value={state.public_key} onChange={event => this.handleOnChange("public_key", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                        </div>
                                                        <div className="form_row">
                                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Private key <span className="require-sign-color">*</span> {state.how_to_merchant ? <span className="whats_this" onClick={() => this.toggleIframePlay(state.how_to_merchant)}>i</span> : void 0}</label>
                                                            <input type="text" className="font-roboto-light"  placeholder="xxxxxxxxxxxxx" value={state.private_key} onChange={event => this.handleOnChange("private_key", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                        </div>
                                                        <div className="form_row">
                                                            {state.selectedIntegrationID &&
                                                                <style dangerouslySetInnerHTML={{__html: `
                                                                    #braintree-secret::placeholder {
                                                                        color: #4c4b4b;
                                                                    }
                                                                `}} />
                                                            }
                                                            {/* <label className="font-questrial-light" style={{fontSize: '0.875em'}}>CSE Key <span className="require-sign-color">*</span></label> */}
                                                            {/* <input type="text" className="font-roboto-light"  placeholder="xxxxxxxxxxxxx" value={state.token} onChange={event => this.handleOnChange("token", event)} style={{marginTop: 10, fontSize: '0.875em'}} /> */}
                                                            {/* <div className="font-roboto-light" style={{marginTop: 10, fontSize: '0.875em'}}>{state.concatKeys}</div> */}
                                                            {/* <input type="text" id="braintree-secret" className="font-roboto-light" placeholder={state.selectedIntegrationID ? "******************************" : "xxxxxxxxxxxxx"} value={state.concatKeys}  style={{marginTop: 10, fontSize: '0.875em'}} /> */}
                                                            {/* <label className="font-questrial-light" style={{fontSize: '0.875em', marginRight: '1rem'}}>Sandbox / Live<span className="require-sign-color">*</span></label> */}
                                                            {/* {console.log(state.sandboxLive)} */}
                                                            {/* <ToggleSwitch width={50} height={22} value={state.sandboxLive}  onChange={event => {
                                                                console.log(event);
                                                                console.log(this);
                                                                this.setState( {sandboxLive: !state.sandboxLive})
                                                                this.setState( {private_key: `${state.other}:${state.public_key}:${state.temp}:${state.token}:${event}`})
                                                                }}/>
                                                            <button style={{marginLeft: '2em', border: '1px solid #000', fontSize: '1rem'}}  onClick={() => {
                                                                console.log(state.other, state.public_key, state.temp);
                                                                toastr.clear();
                                                                toastr.info("Generating...", "Token");
                                                                
                                                                this.getToken(state.public_key, state.temp, state.other, state.sandboxLive).then(response => {
                                                                    if(response.data.createClientToken.clientToken) {
                                                                        toastr.clear();
                                                                        toastr.success("New token generated.", "Success!");
                                                                        console.log(`${state.other}:${state.public_key}:${state.temp}:${response.data.createClientToken.clientToken}:${state.sandboxLive}`);
                                                                        this.setState({token: response.data.createClientToken.clientToken});
                                                                        this.setState({concatKeys: `${state.other}:${state.public_key}:${state.temp}:${response.data.createClientToken.clientToken}:${state.sandboxLive}`})
                                                                        this.setState({private_key: `${state.other}:${state.public_key}:${state.temp}:${response.data.createClientToken.clientToken}:${state.sandboxLive}`})
                                                                        setTimeout(() => {
                                                                            toastr.clear();
                                                                        }, 2000)
                                                                    }
                                                                    
                                                                })
                                                                .catch(err => {
                                                                    toastr.clear(); 
                                                                    toastr.warning("It seems like there's an error while genrating a token.", "An error has occured!")
                                                                });
                                                                }}>Generate token</button> */}
                                                        </div>
                                                    </div>
                                                );
                                            } else if (state.merchant_type == "paypalv2") {
                                                return (
                                                    <div style={{ width: '100%' }}>
                                                        <div className="form_row">
                                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Username <span className="require-sign-color">*</span></label>
                                                            <input type="text" className="font-roboto-light"  placeholder="mypaypal@myemail.com" value={state.other} onChange={event => this.handleOnChange("other", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                        </div>
                                                        <div className="form_row">
                                                            {state.selectedIntegrationID &&
                                                                <style dangerouslySetInnerHTML={{
                                                                    __html: `
                                                                    #paypalv2::placeholder {
                                                                        color: #4c4b4b;
                                                                    }
                                                                `}} />
                                                            }
                                                            <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>API - Password <span className="require-sign-color">*</span></label>
                                                            <input type="text" id="paypalv2" className="font-roboto-light" placeholder={state.selectedIntegrationID ? "**************************" : "XXXXXXXXX"} value={state.private_key} onChange={event => this.handleOnChange("private_key", event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                                        </div>
                                                        <div className="form_row">
                                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>API - Signature <span className="require-sign-color">*</span> {state.how_to_merchant ? <span className="whats_this" onClick={() => this.toggleIframePlay(state.how_to_merchant)}>i</span> : void 0}</label>
                                                            <input type="text" className="font-roboto-light"  placeholder="XxxxXXxxxxxxxx-XxxXxXXXXxxx" value={state.public_key} onChange={event => this.handleOnChange("public_key", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                        </div>
                                                    </div>
                                                );
                                            } else if(state.merchant_type == "klaviyo"){
                                                return (
                                                    <div style={{width: '100%'}}>
                                                        <div className="form_row">
                                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Public Key</label>
                                                            <input type="text" className="font-roboto-light"  placeholder="xxxxxxxxxxxxx" value={state.public_key} onChange={event => this.handleOnChange("public_key", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                        </div>
                                                        <div className="form_row">
                                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Private Key <span className="require-sign-color">*</span> <span className="whats_this" onClick={() => this.toggleIframePlay(349860113)}>i</span></label>
                                                            <input type="text" className="font-roboto-light"  placeholder="xxxxxxxxxxxxx" value={state.private_key} onChange={event => this.handleOnChange("private_key", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                        </div>
                                                    </div>
                                                );
                                            } else if(state.merchant_type == "twilio") {
                                                return (
                                                    <div style={{width: '100%'}}>
                                                        <div className="form_row">
                                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Account SID <span className="require-sign-color">*</span></label>
                                                            <input type="text" className="font-roboto-light"  placeholder="xxxxxxxxxxxxx" value={state.public_key} onChange={event => this.handleOnChange("public_key", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                        </div>
                                                        <div className="form_row">
                                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Auth Token <span className="require-sign-color">*</span></label>
                                                            <input type="text" className="font-roboto-light"  placeholder="xxxxxxxxxxxxx" value={state.private_key} onChange={event => this.handleOnChange("private_key", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                        </div>
                                                        <div className="form_row">
                                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Twilio Phone Number <span className="require-sign-color">*</span></label>
                                                            <input type="text" className="font-roboto-light"  placeholder="xxxxxxxxxxxxx" value={state.other} onChange={event => this.handleOnChange("other", event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        })()}
                                        {state.merchant_type != "klaviyo" && state.merchant_type != "twilio" ?
                                            <div className="form_row">
                                                <button className="btn-warning stretch-width" onClick={() => this.toggleIframePlay(state.how_to_webhook)} disabled={!state.how_to_webhook ? true : false} style={{padding: 0, display: 'flex', alignItems: 'center'}}>
                                                    <div style={{ padding: '5px 15px', backgroundColor: '#e67300' }}>
                                                        <span className="fas fa-play" />
                                                    </div>
                                                    <label className="cursor-pointer" style={{padding: '0 15px'}}>How to add Webhook</label>
                                                </button>
                                            </div>
                                        : void 0}
                                        {state.merchant_type != "klaviyo" && state.docsTut ?
                                            <div className="form_row">
                                                <button className="btn-warning stretch-width text-left" onClick={() => window.open(state.docsTut)} style={{padding: 0, display: 'flex', alignItems: 'center'}}>
                                                    <div style={{ padding: '5px 15px', backgroundColor: '#e67300' }}>
                                                        <span className="fas fa-file-word" />
                                                    </div>
                                                    <label className="cursor-pointer" style={{padding: '0 15px'}}>Google Document Tutorial</label>
                                                </button>
                                            </div>
                                        : void 0}
                                        <div className="form_row">
                                            <label className="font-questrial-light no-result">*After adding integration this option will be available on your funnel setting.*</label>
                                            <br/><br/>
                                            <Mutation
                                                mutation={SAVE_OR_UPDATE_INTEGRATION}
                                                variables={{
                                                    id: userObject.id,
                                                    integrationID: state.selectedIntegrationID,
                                                    merchant_type: state.merchant_type,
                                                    merchant_name: state.merchant_name,
                                                    public_key: state.public_key.match(/\S+/) ? state.public_key.match(/\S+/).toString() : "",
                                                    private_key: state.private_key.match(/\S+/) ? state.private_key.match(/\S+/).toString() : "",
                                                    other: state.other
                                                }} >
                                                {(saveORupdateIntegration, { data, loading, error }) => {
                                                    return (
                                                        <button className="font-roboto-light btn-success" onClick={() => this.saveORupdateIntegration(saveORupdateIntegration)}>
                                                            ADD
                                                        </button>
                                                    );
                                                }}
                                            </Mutation>
                                        </div>
                                    </div>
                                    <div className="column column_6_12">
                                        <label className="font-roboto-bold color-green">Recommended Merchant Providers</label> <br/>
                                        <label className="font-questrial-light" style={{fontSize: '0.7em'}}>Need a merchant? Click the logo below to Apply</label>
                                        <div style={{ borderRadius: 5, border: '1px solid #eaeaea', overflow: 'hidden', padding: 20, marginTop: 20, maxHeight: '60vh', overflow: 'auto' }}>
                                            <div className="column column_12_12">
                                                <label className="font-roboto-light">Merchants & Gateway</label>
                                            </div>
                                            <div className="column column_6_12">
                                                <div className={"product-card integration-merchant-list "+(state.merchant_type == "paypal" ? "merchant-active" : "")} style={{boxShadow: '0 1px 3px #bdbdbd', background: 'unset', borderRadius: 2}} onClick={() => this.setState({
                                                    ...initializeForm,
                                                    docsTut: null,
                                                    merchantSignupLink: "https://www.paypal.com/us/webapps/mpp/account-selection",
                                                    merchant_type: "paypal",
                                                    how_to_merchant: 346255716,
                                                    how_to_webhook: 350771959
                                                })}>
                                                    <div style={{height: '12vh', padding: 10, display: 'flex', alignItems: 'center'}}>
                                                        <img src="assets/graphics/integration_pp.png" className="stretch-width" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_6_12">
                                                <div className={"product-card integration-merchant-list "+(state.merchant_type == "stripe" ? "merchant-active" : "")} style={{boxShadow: '0 1px 3px #bdbdbd', background: 'unset', borderRadius: 2}} onClick={() => this.setState({
                                                    ...initializeForm,
                                                    docsTut: "https://docs.google.com/document/d/1U5f4WPb1Fv1ZNgwrcckaOm0JLSWs0R9Gx1U_HfxmX1Q/edit?usp=sharing",
                                                    merchantSignupLink: "https://dashboard.stripe.com/register",
                                                    merchant_type: "stripe",
                                                    how_to_merchant: 346243615,
                                                    how_to_webhook: 346243590
                                                })}>
                                                    <div style={{height: '12vh', padding: 10, display: 'flex', alignItems: 'center'}}>
                                                        <img src="assets/graphics/integration_stripe.png" className="stretch-width" />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="column column_12_12 one-line-ellipsis">
                                                <label className="font-roboto-light">Apply High Risk Merchant Application</label>
                                            </div>
                                            <div className="column column_6_12">
                                                <div className={"product-card integration-merchant-list "+(state.merchant_type == "easy_pay_direct" ? "merchant-active" : "")} style={{boxShadow: '0 1px 3px #bdbdbd', background: 'unset', borderRadius: 2}} onClick={() => {
                                                    window.open("https://easypaydirect.offerit.com/tiny/XsQhf")
                                                }}>
                                                    <div style={{height: '12vh', padding: 10, display: 'flex', alignItems: 'center'}}>
                                                        <img src="assets/graphics/integration_epd.png" className="stretch-width" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_6_12">
                                                <div className={"product-card integration-merchant-list "+(state.merchant_type == "payment_cloud" ? "merchant-active" : "")} style={{boxShadow: '0 1px 3px #bdbdbd', background: 'unset', borderRadius: 2}} onClick={() => {
                                                    window.open("https://stratus.paymentcloudinc.com/productlistgenie@gmail.com")
                                                }}>
                                                    <div style={{height: '12vh', padding: 10, display: 'flex', alignItems: 'center'}}>
                                                        <img src="assets/graphics/integration_pc.png" className="stretch-width" />
                                                    </div>
                                                </div>
                                            </div> */}

                                            <div className="column column_6_12">
                                                <div className={"product-card integration-merchant-list " + (state.merchant_type == "authorize.net" ? "merchant-active" : "")} style={{ boxShadow: '0 1px 3px #bdbdbd', background: 'unset', borderRadius: 2 }} onClick={() => this.setState({
                                                    ...initializeForm,
                                                    docsTut: "https://docs.google.com/document/d/17ZB4OubkTLjNR5JY0ZhKw88yOTMUZ8f1wjCfPSyXPUM/edit?usp=sharing",
                                                    merchantSignupLink: "https://www.authorize.net/sign-up/",
                                                    merchant_type: "authorize.net",
                                                    how_to_merchant: 347436907,
                                                    how_to_webhook: 351276008
                                                })}>
                                                    <div style={{height: '12vh', padding: 10, display: 'flex', alignItems: 'center'}}>
                                                        <img src="assets/graphics/integration_net.png" className="stretch-width" />
                                                    </div>  
                                                </div>
                                            </div>
                                            
                                            {/* PAYPALV2 INTEGRATION */}
                                            <div className="column column_6_12">
                                                    <div className={"product-card integration-merchant-list " + (state.merchant_type == "paypalv2" ? "merchant-active" : "")} style={{ boxShadow: '0 1px 3px #bdbdbd', background: 'unset', borderRadius: 2 }} onClick={() => this.setState({
                                                        ...initializeForm,
                                                        docsTut: "",
                                                        merchantSignupLink: "https://www.paypal.com/",
                                                        merchant_type: "paypalv2",
                                                        how_to_merchant: 641697693,
                                                        how_to_webhook: 0
                                                    })}>
                                                        <div style={{height: '12vh', padding: 10, display: 'flex', alignItems: 'center'}}>
                                                        {/* https://drive.google.com/file/d/1GJna5Aq-uurz6XTLuWT3Q4yWRSILkXjC/view?usp=sharing */}
                                                            <img src="assets/graphics/integration_ppv2.png" className="stretch-width" />
                                                        </div>  
                                                    </div>
                                            </div>

                                            {/* BRAINTREE Integration */}
                                            <div className="column column_6_12">
                                                    <div className={"product-card integration-merchant-list " + (state.merchant_type == "braintree" ? "merchant-active" : "")} style={{ boxShadow: '0 1px 3px #bdbdbd', background: 'unset', borderRadius: 2 }} onClick={() => this.setState({
                                                        ...initializeForm,
                                                        docsTut: "",
                                                        merchantSignupLink: "https://www.braintreepayments.com/",
                                                        merchant_type: "braintree",
                                                        how_to_merchant: 0,
                                                        how_to_webhook: 643669773
                                                    })}>
                                                        <div style={{height: '12vh', padding: 10, display: 'flex', alignItems: 'center'}}>
                                                        {/* https://drive.google.com/file/d/1GJna5Aq-uurz6XTLuWT3Q4yWRSILkXjC/view?usp=sharing */}
                                                            <img src="assets/graphics/integration_braintree.png" className="stretch-width" />
                                                        </div>  
                                                    </div>
                                                </div>

                                            {userObject.access_tags.includes("i_conekta") &&
                                                <div className="column column_6_12">
                                                    <div className={"product-card integration-merchant-list " + (state.merchant_type == "conekta" ? "merchant-active" : "")} style={{ boxShadow: '0 1px 3px #bdbdbd', background: 'unset', borderRadius: 2 }} onClick={() => this.setState({
                                                        ...initializeForm,
                                                        docsTut: "https://docs.google.com/document/d/16GOLBy3Wn2i-wCa9eTVwtVwOCEc-NjSxiKtwGEvTSJ0/edit?usp=sharing",
                                                        merchantSignupLink: "https://admin.conekta.com/",
                                                        merchant_type: "conekta",
                                                        how_to_merchant: 441004706,
                                                        how_to_webhook: 0
                                                    })}>
                                                        <div style={{height: '12vh', padding: 10, display: 'flex', alignItems: 'center'}}>
                                                        {/* https://drive.google.com/file/d/1GJna5Aq-uurz6XTLuWT3Q4yWRSILkXjC/view?usp=sharing */}
                                                            <img src="assets/graphics/integration_conekta.png" className="stretch-width" />
                                                        </div>  
                                                    </div>
                                                </div>
                                            }
                                             
                                           
                                            
                                            {!this.isHaveKlavio &&
                                                <div className="column column_12_12">
                                                    <label className="font-roboto-light">Email Integration</label>
                                                </div>
                                            }
                                            {!this.isHaveKlavio &&
                                                <div className="column column_6_12">
                                                    <div className={"product-card integration-merchant-list "+(state.merchant_type == "klaviyo" ? "merchant-active" : "")} style={{boxShadow: '0 1px 3px #bdbdbd', background: 'unset', borderRadius: 2}} onClick={() => this.setState({
                                                        ...initializeForm,
                                                        docsTut: null,
                                                        merchantSignupLink: "https://www.klaviyo.com/",
                                                        merchant_type: "klaviyo",
                                                        how_to_merchant: 349860113,
                                                        how_to_webhook: 0
                                                    })}>
                                                        <div style={{height: '12vh', padding: 10, display: 'flex', alignItems: 'center'}}>
                                                            <img src="assets/graphics/integration_klaviyo.png" className="stretch-width" />
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            {!this.isHaveTwilio &&
                                                <div className="column column_12_12">
                                                    <label className="font-roboto-light">SMS Integration</label>
                                                </div>
                                            }
                                            {!this.isHaveTwilio &&
                                                <div className="column column_6_12 clear">
                                                    <div className={"product-card integration-merchant-list "+(state.merchant_type == "twilio" ? "merchant-active" : "")} style={{boxShadow: '0 1px 3px #bdbdbd', background: 'unset', borderRadius: 2}} onClick={() => this.setState({
                                                        ...initializeForm,
                                                        docsTut: "https://docs.google.com/document/d/1B0HSC50Kvj2LhNXBmpm4th7rBy5zXkqp6aZzl_0ZMwc/edit?usp=sharing",
                                                        merchantSignupLink: "https://www.twilio.com/try-twilio",
                                                        merchant_type: "twilio",
                                                        how_to_merchant: 0,
                                                        how_to_webhook: 0
                                                    })}>
                                                        <div style={{height: '12vh', padding: 10, display: 'flex', alignItems: 'center'}}>
                                                            <img src="assets/graphics/twilio-logo-red.png" className="stretch-width" />
                                                        </div>  
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                }

                {state.iframePlayer &&
                    <Modal open={state.iframePlayer} closeModal={() => this.toggleIframePlay()} session={this.props.session} style={{background: 'unset', border: 'none', padding: 0, width: '70%', textAlign: 'center'}}>
                        <iframe id="vmplayer" src={"https://player.vimeo.com/video/"+state.vimeoid} width="100%" onLoad={event => event.target.height = (event.target.offsetWidth / 16 * 9)} frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                    </Modal>
                }
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(Integration);