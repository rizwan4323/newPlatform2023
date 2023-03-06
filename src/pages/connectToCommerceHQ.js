import React from 'react';
import Modal from '../components/ModalComponent/';
import Popup from 'reactjs-popup';
import toastr from 'toastr';
const points = require('../../Global_Values');



class ConnectToCommerceHQ extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openConnect: false,
            storeName: this.props.session.getCurrentUser && this.props.session.getCurrentUser.commerceHQ ? this.props.session.getCurrentUser.commerceHQ.storeName : "",
            apiKey: this.props.session.getCurrentUser && this.props.session.getCurrentUser.commerceHQ ? this.props.session.getCurrentUser.commerceHQ.apiKey : "",
            apiPassword: this.props.session.getCurrentUser && this.props.session.getCurrentUser.commerceHQ ? this.props.session.getCurrentUser.commerceHQ.apiPassword : "",
            errorPrompt: "",
            alreadyUsed: ""
        }

        this.handlestoreName = this.handlestoreName.bind(this);
        this.handleapiKey = this.handleapiKey.bind(this);
        this.handleapiPassword = this.handleapiPassword.bind(this);

        this.submitCommerceHQ = this.submitCommerceHQ.bind(this);
    }

    componentDidMount() {
        // detect if already has a store...
        console.log(this.props.session.getCurrentUser);
    }


    handlestoreName(event) {
        this.setState({
            storeName: event.target.value
        })
    }

    handleapiKey(event) {
        this.setState({
            apiKey: event.target.value
        })
    }

    handleapiPassword(event) {
        this.setState({
            apiPassword: event.target.value
        })
    }

    submitCommerceHQ(event) {
        event.preventDefault();
        const currentUser = this.props.session.getCurrentUser;
        const getComHQName = url => { 
            if(url.includes(".commercehq.com")) {
                console.log("detected commercehq.com");
            return url.toLocaleLowerCase().trim(" ").replace(/\s/g, '').match(/(?!http(s?):\/)([\w]+\.){1}([\w]+\.?)+/g, "")[0].replace(".commercehq.com", "")
            } else {
            return url.replace(".commercehq.com", "")
            }
            }
        const query = {
            query: ` mutation{
            addCommerceHQ(id:"${currentUser.id}", storeName:"${getComHQName(this.state.storeName)}", apiKey:"${this.state.apiKey}", apiPassword:"${this.state.apiPassword}"){
              commerceHQ{
                apiKey
                apiPassword
                storeName
                id
              }
            }
          }
        `};

        points.customFetch('/graphql', "POST", query, result => {
            if (result.data.addCommerceHQ) {
                points.toastrPrompt(toastr, 'success', 'API saved sucessfully', 'CommerceHQ API');
                this.props.refetch();
                this.props.closeModal();
            } else {
                points.toastrPrompt(toastr, 'error', 'Something went wrong please contact administrator', 'CommerceHQ API');
            }
        });
    }


    render() {
        return <div>
            <style dangerouslySetInnerHTML={{
                __html: `
                    .store-container {
                        padding: 20px;
                        border: 1px solid #ccc;
                        margin: 0 auto;
                        max-width: 45.0rem;
                        margin-top: 20px;
                        overflow: hidden;
                    }
                    .locid {
                        font-size: 12px;
                    }
                `}} />
            <Modal open={this.props.open} closeModal={this.props.closeModal} session={this.props.session}>
                <div className="text-center">
                    <h2>Connect to CommerceHQ &nbsp;
                            {/* <Popup
                            trigger={<span className="infocircle">i</span>}
                            position="bottom center"
                            on="click" className="points-tooltip">
                            <div style={{ padding: '5px 20px', overflow: 'hidden' }}>
                                <h3>How to connect store?</h3>
                                <div style={{ textAlign: 'left' }}>
                                    <iframe id="how-to-review" src={"https://player.vimeo.com/video/310447276"} width="800" height="500" autoPlay="true" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                                </div>
                            </div>
                        </Popup> */}
                    </h2>
                    {this.state.errorPrompt || this.state.alreadyUsed ?
                        <div className="product-card infoheader" style={{ marginTop: 0, width: '100%' }}>
                            <span className="infoheadercircle infocircle custom-style-warning"><i className="fas fa-exclamation-triangle"></i></span>
                            <div className="notification-message" dangerouslySetInnerHTML={{ __html: this.state.errorPrompt ? this.state.errorPrompt : this.state.alreadyUsed }} />
                        </div>
                        : ''}
                </div>
                <div className="column column_12_12">
                    <div className="signUp authForm">
                        <h1 className="dark_headline">
                            Connect Your CommerceHQ Store
                            </h1>
                        <form onSubmit={this.submitCommerceHQ}>
                            <div className="form_wrap updateAccountEmailForm">
                                <br />
                                <div className="form_row">
                                    <div className="form_item">
                                        {/* onKeyUp={this.handleKeyUp.bind(this)} onChange={this.handleChange.bind(this)}  */}
                                        <div className="form_input">
                                            <input value={this.state.storeName} name="storeName" onChange={this.handlestoreName} placeholder="e.g. https://mystore.commercehq.com" type="text" disabled={this.state.errorPrompt} />
                                            <span className="bottom_border"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form_row">
                                    <div className="form_item">
                                        {/* onKeyUp={this.handleKeyUp.bind(this)} onChange={this.handleChange.bind(this)}  */}
                                        <div className="form_input">
                                            <input value={this.state.apiKey} name="apiKey" onChange={this.handleapiKey} placeholder="YOUR_API_KEY" type="text" disabled={this.state.errorPrompt} />
                                            <span className="bottom_border"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form_row">
                                    <div className="form_item">
                                        {/* onKeyUp={this.handleKeyUp.bind(this)} onChange={this.handleChange.bind(this)}  */}
                                        <div className="form_input">
                                            <input value={this.state.apiPassword} name="apiPassword" onChange={this.handleapiPassword} placeholder="YOUR_API_PASSWORD" type="text" disabled={this.state.errorPrompt} />
                                            <span className="bottom_border"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center form_buttons">
                                    {/* {this.state.errorPrompt && this.state.store_name ?
                                    <div className="float-right">
                                        <span className="fas fa-sync clickable" title="Reconnect Store" onClick={event => this.ConnectToStore(event, true)}></span>
                                    </div>
                                    : ''} */}
                                    {/* onClick={this.ConnectToStore.bind(this)}  */}
                                    <button className="btn" type="submit" disabled={this.state.errorPrompt ? true : false}>{this.props.session.getCurrentUser && this.props.session.getCurrentUser.commerceHQ ? 'Update Store\'s API'  : 'Save API'}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="column column_12_12">
                    {this.props.session.getCurrentUser.allowMultiConnectStore &&
                        <div className="text-center">
                            <br />
                            <h3>Store List</h3>
                        </div>
                    }
                    {(() => {
                        if (!this.props.session.getCurrentUser.allowMultiConnectStore) {
                            return null;
                        }
                        return this.props.session.getCurrentUser.listOfStore.map(store => {
                            return (
                                <div className="store-container form_buttons" key={store.store_url}>
                                    <div className="column column_9_12 one-line-ellipsis">
                                        <a href={"https://" + store.store_url} target="_blank">{store.store_url}</a> <br />
                                        <span className="locid">Location ID: {store.store_location_id}</span>
                                    </div>
                                    <div className="column column_3_12 text-right">
                                        <button className="btn" style={{ padding: 6, fontSize: 15 }} disabled={store.active}>Active</button>
                                    </div>
                                </div>
                            );
                        })
                    })()}
                </div>
            </Modal>
        </div>
    }
}
export default ConnectToCommerceHQ;