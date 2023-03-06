import React from 'react';
import Modal from '../components/ModalComponent/';
import Popup from 'reactjs-popup';
import toastr from 'toastr';
const points = require('../../Global_Values');

class ConnectToStore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openConnect: false,
            store_name: "",
            apiKey: "",
            apiSecretKey: "",
            errorPrompt: "",
            alreadyUsed: ""
        }
    }

    componentDidMount() {
        toastr.options = {
            "progressBar": true,
            "closeButton": false,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut": 5000,
            "extendedTimeOut": 2000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        if (this.props.session.getCurrentUser.store_url) {
            this.setState({
                store_name: this.props.session.getCurrentUser.store_url
            })
        }

        this.checkIfAlreadyConnectToStore();
    }

    checkIfAlreadyConnectToStore() {
        if (this.props.session.getCurrentUser && this.props.session.getCurrentUser.privilege === 0) { // User Privilege
            this.setState({
                errorPrompt: "Free User (lvl0). Can't Connect to Shopify."
            })
        } else if (this.props.session.getCurrentUser && this.props.session.getCurrentUser.store_url) {
            if (this.props.session.getCurrentUser.privilege < 10 && !this.props.session.getCurrentUser.allowMultiConnectStore) { // User Privilege
                this.setState({
                    errorPrompt: "Store URL already bind and cannot be change."
                })
            }
        }
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    handleKeyUp(event) {
        if (event.keyCode === 13) {
            this.ConnectToStore();
        }
    }

    ConnectToStore(event, isRecon) {
        if (isRecon) {
            this.proceedToConnect(isRecon);
        } else {
            if (this.state.store_name.match(/[^\s.@/]([0-9a-zA-Z-.]*[0-9a-zA-Z-]+.)(com|store|org|net|edu|io)/g)) {
                // if valid store url
                this.proceedToConnect(isRecon);
            } else {
                // if invalid store url
                toastr.clear();
                toastr.warning("Store URL is Invalid.", "Invalid!");
            }
        }
    }

    saveToDatabase(isRecon) {
        if(!this.state.store_name.match(/[^\s.@/]([0-9a-zA-Z-.]*[0-9a-zA-Z-]+.)(com|store|org|net|edu|io)/g)) {
            toastr.clear();
            toastr.warning("Store URL is Invalid.", "Invalid!");
            return;
        }

        var reqs = {
            store_name: this.state.store_name.match(/[^\s.@/]([0-9a-zA-Z-.]*[0-9a-zA-Z-]+.)(com|store|org|net|edu|io)/g)[0],
            user_id: 739656990766, //points.getStaffCurrentUser(this.props),
            apiKey: this.state.apiKey,
            apiSecretKey: this.state.apiSecretKey,
            rdr: window.location.href,
            fromNewPlatform: true
        };

        var payload = {
            "query": `mutation addNewShopifyDetails($id: String!, $store_token: String!, $store_url: String!){ addNewShopifyDetails(id: $id, store_token: $store_token, store_url: $store_url){ store_url store_token } }`, "variables": {
                id: this.props.session.getCurrentUser.id,
                store_token: reqs.apiSecretKey,
                store_url: reqs.store_name,
            }, "operationName": null
        }
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(result => {
                if (result.data.addNewShopifyDetails) { // User Privilege
                    this.props.refetch && this.props.refetch();
                    // if invalid store url
                    toastr.clear();
                    toastr.success("Shopify Connect Store", "Store connected successfully.");
                    this.props.closeModal();

                } else {
                    // if (points.getStaffCurrentUser(this.props).privilege <= 5) { // User Privilege
                    //     this.setState({ alreadyUsed: "This shopify store is already use." })
                    // }
                    toastr.clear();
                    toastr.warning("Store URL is Invalid.", "Invalid!");
                }
            }).catch(err => {
                console.log(err)
                toastr.clear();
                toastr.warning("Store URL is Invalid.", "Invalid!");
            });
    }

    proceedToConnect(isRecon) {
        var x = {
            store_name: this.state.store_name.match(/[^\s.@/]([0-9a-zA-Z-.]*[0-9a-zA-Z-]+.)(com|store|org|net|edu|io)/g)[0],
            user_id: 739656990766, //this.props.session.getCurrentUser,
            rdr: window.location.href,
            fromNewPlatform: true
        };

        var payload = { "query": "{\n  searchStoreURL(store_url: \"" + x.store_name + "\"){\n\t\tstore_url\n  }\n}", "variables": null, "operationName": null }

        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(result => {
                if (result.data.searchStoreURL.length == 0 || isRecon || this.props.session.getCurrentUser.privilege >= 6) { // User Privilege
                    window.location.href = points.apiServer + `/auth?shop=${x.store_name}&id=${x.user_id}&rdir=${x.rdr}&from_new=${x.fromNewPlatform}`;
                } else {
                    if (this.props.session.getCurrentUser.privilege <= 5) { // User Privilege
                        this.setState({ alreadyUsed: "This shopify store is already use." })
                    }
                }
            });
    }

    render() {
        return (
            <div>
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
                        <h2>Connect to Shopify&nbsp;
                            <Popup
                                trigger={<span className="infocircle">i</span>}
                                position="bottom center"
                                on="click" className="points-tooltip">
                                <div style={{ padding: '5px 20px', overflow: 'hidden' }}>
                                    <h3>How to connect store?</h3>
                                    <div style={{ textAlign: 'left' }}>
                                        <iframe id="how-to-review" src={"https://player.vimeo.com/video/310447276"} width="800" height="500" autoPlay="true" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                                    </div>
                                </div>
                            </Popup>
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
                                Connect Your Shopify Store
                            </h1>
                            <div className="form_wrap updateAccountEmailForm">
                                <div className="form_row">
                                    <div className="form_item">
                                        <div className="form_input">
                                            <input value={this.state.store_name} name="store_name" onKeyUp={this.handleKeyUp.bind(this)} onChange={this.handleChange.bind(this)} placeholder="https://mystore.myshopify.com" type="text" disabled={this.state.errorPrompt} />
                                            <span className="bottom_border"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form_row">
                                    <div className="form_item">
                                        <div className="form_input">
                                            <input value={this.state.apiSecretKey} name="apiSecretKey" onKeyUp={this.handleKeyUp.bind(this)} onChange={this.handleChange.bind(this)} placeholder="Admin API access token" type="text" disabled={this.state.errorPrompt} />
                                            <span className="bottom_border"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center form_buttons">
                                    {this.state.errorPrompt && this.state.store_name ?
                                        <div className="float-right">
                                            <span className="fas fa-sync clickable" title="Reconnect Store" onClick={event => this.ConnectToStore(event, true)}></span>
                                        </div>
                                        : ''}
                                    <button className="btn" type="submit" style={{
                                        marginRight: "1rem"
                                    }} onClick={this.saveToDatabase.bind(this)} disabled={this.state.errorPrompt ? true : false}>Save Store</button>
                                    <button className="btn" type="submit" onClick={this.ConnectToStore.bind(this)} disabled={this.state.errorPrompt ? true : false}>Connect Store</button>
                                </div>
                            </div>
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
        );
    }
}

export default ConnectToStore;