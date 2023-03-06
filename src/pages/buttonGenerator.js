import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { Link, NavLink } from 'react-router-dom';
import toastr from 'toastr';
import ButtonWithPopup from '../components/buttonWithPopup';
import Loading from '../components/loading';
import Modal from '../components/ModalComponent';
import Pagination from '../components/pagination';
import SelectTag from '../components/selectTag';
import { ADD_GENERATED_BUTTON, GET_BUTTONS_USER, GET_BUTTON_COUNT } from '../queries';

let CryptoJS = require('crypto-js');


// const points = require("../../../Global_Values");

const escape = require('escape-html');

const points = require('../../Global_Values');

const defaultInjectedStyle = {
    backgroundColor: '#00bf60',
    color: '#1a1a1a',
    width: "100%",
    textAlign: "center",
    fontSize: 12,
    fontStyle: "normal",

};

let refetchButtons = null;
let refetchCount = null;

export default class ButtonGenerator extends React.Component {
    constructor(props) {
        super();
        this.state = {
            currentPage: 0,
            openAddButton: false,
            setSelectedButton: null,
            openTestModal: true,
            activeHeadertext: "Button Generator", // Button Generator || Form Button Design
            stepperState: "button_generator", // button_generator || form_button || done
            editstepperState: "button_generator",
            openEditor: false,
            productName: "",
            productDescription: "",
            totalPages: 0,
            isItalic: false,
            buttonLabelText: "Buy Now!",
            redirectURI: "",
            amount: 1,
            currency: "SAR",
            isBold: false,
            buttonTextDisplay: "Button",
            injectedStyle: {
                ...defaultInjectedStyle
            },
            rawButton: "",
            rawJS: ""
        }
    }

    encryptString(str) {
        return CryptoJS.AES.encrypt(str, points.plg_domain_secret).toString();
    }

    formGenerator() {
        const state = this.state;
        const currentUser = this.props.session.getCurrentUser;
        return (
            <React.Fragment>
                <div className="rpp-stepper">
                    <div className="rpp-stepper-item rpp-stepper-item-completed" onClick={() => {
                        this.setState({
                            stepperState: "button_generator"
                        });
                    }}>
                        <span className="rpp-stepper-item-content">1</span>
                    </div>
                    <div className="rpp-stepper-divider"></div>
                    <div className={this.state.stepperState === "done" ? "rpp-stepper-item rpp-stepper-item-completed" : "rpp-stepper-item rpp-stepper-item-pending"}>
                        <span className="rpp-stepper-item-content">2</span>
                    </div>
                </div>
                <br /><br />
                <div className="display-inline row-separator">
                    <div className="column column_12_12">
                        <div className="form_input">
                            <label>Button Form Text Label </label>
                            <input type="text" value={state.buttonLabelText} onChange={(event) => this.setState({ buttonLabelText: event.target.value })} name="btnlabelname" required />
                            <span className="bottom_border"></span>
                        </div>
                        <br />
                        <div className="form_input">
                            <label>Page Redirect URL </label>
                            <input type="text" value={state.redirectURI} onChange={(event) => this.setState({ redirectURI: event.target.value })} name="name" placeholder="https://your_redirect_link.com/thankyou-page" required />
                            <span className="bottom_border"></span>
                        </div>
                        <br />
                        <div className="column column_12_12" style={{ marginTop: "3rem" }}>
                            <Mutation mutation={ADD_GENERATED_BUTTON} variables={{
                                creator: currentUser.id,
                                buttonTitle: state.buttonTextDisplay,
                                injectedStyle: JSON.stringify(state.injectedStyle),
                                rawButton: state.rawButton,
                                buttonLabelText: state.buttonLabelText,
                                redirectURI: state.redirectURI,
                                productDescription: state.productDescription,
                                productName: state.productName,
                                amount: parseFloat(state.amount)
                            }}>
                                {(saveGeneratedbutton, { data, loading, error, refetch }) => {
                                    return <button className="font-roboto-light btn-success" style={{ margin: '0 5px', float: "right" }} onClick={() => {
                                        this.saveGeneratedButtonFun(saveGeneratedbutton);
                                    }}>Save Button</button>
                                }}
                            </Mutation>
                            <button className="btn-success font-roboto-light" style={{ margin: '0 5px', float: "right" }} onClick={() => {
                                this.setState({
                                    stepperState: "button_generator"
                                });
                            }}>
                                <span className="hide-in-mobile">Back</span>
                            </button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    editFormGenerator() {
        const state = this.state;
        const currentUser = this.props.session.getCurrentUser;
        return (
            <React.Fragment>
                <div className="rpp-stepper">
                    <div className="rpp-stepper-item rpp-stepper-item-completed" onClick={() => {
                        this.setState({
                            editstepperState: "button_generator"
                        });
                    }}>
                        <span className="rpp-stepper-item-content">1</span>
                    </div>
                    <div className="rpp-stepper-divider"></div>
                    <div className={this.state.stepperState === "done" ? "rpp-stepper-item rpp-stepper-item-completed" : "rpp-stepper-item rpp-stepper-item-pending"}>
                        <span className="rpp-stepper-item-content">2</span>
                    </div>
                </div>
                <br /><br />
                <div className="display-inline row-separator">
                    <div className="column column_12_12">
                        <div className="form_input">
                            <label>Button Form Text Label </label>
                            <input type="text" value={state.buttonLabelText} onChange={(event) => this.setState({ buttonLabelText: event.target.value })} name="btnlabelname" required />
                            <span className="bottom_border"></span>
                        </div>
                        <br />
                        <div className="form_input">
                            <label>Page Redirect URL </label>
                            <input type="text" value={state.redirectURI} onChange={(event) => this.setState({ redirectURI: event.target.value })} name="name" placeholder="https://your_redirect_link.com/thankyou-page" required />
                            <span className="bottom_border"></span>
                        </div>
                        <br />
                        <div className="column column_12_12" style={{ marginTop: "3rem" }}>
                            <button className="font-roboto-light btn-success" style={{ float: "right" }} onClick={() => {
                                this.updateLocalButton();
                            }}>Save Button</button>
                            <button className="btn-success font-roboto-light" style={{ margin: '0 5px', float: "right" }} onClick={() => {
                                this.setState({
                                    editstepperState: "button_generator"
                                });
                            }}>
                                <span className="hide-in-mobile">Back</span>
                            </button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    editButtonGenerator(btnState) {
        const state = this.state;
        const currentUser = this.props.session.getCurrentUser;

        return (
            <React.Fragment>
                <div className="rpp-stepper">
                    <div className="rpp-stepper-item rpp-active">
                        <span className="rpp-stepper-item-content">1</span>
                    </div>
                    <div className="rpp-stepper-divider"></div>
                    <div className="rpp-stepper-item rpp-stepper-item-pending" onClick={() => {
                        this.setState({
                            editstepperState: "form_button"
                        });
                    }}>
                        <span className="rpp-stepper-item-content">2</span>
                    </div>
                </div>
                <div className="display-inline row-separator">
                    <div className="column column_12_12">
                        <div className="page-container">
                            <div className="flex-container clear" style={{
                                justifyContent: "center",
                            }}>
                                <div className="display-inline row-separator" style={{
                                    width: '100%',
                                    height: "100%"
                                }}>
                                    <div className="column column_6_12" style={{
                                        padding: "3px 3px"
                                    }}>
                                        {/* EDITOR ONE SIDE  */}

                                        <div className="form_input">
                                            <label>Product / Service Name</label>
                                            <input type="text" value={state.productName} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), productName: event.target.value })} name="productName" />
                                            <span className="bottom_border"></span>
                                        </div>
                                        <div className="form_input">
                                            <label>Button Call to Action </label>
                                            <input type="text" name="name" value={state.buttonTextDisplay} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), buttonTextDisplay: event.target.value })} required />
                                            <span className="bottom_border"></span>
                                        </div>
                                        <br />
                                        <div className="form_input">
                                            <label>Amount ( USD )</label>
                                            <input type="text" name="number" value={state.amount} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), amount: event.target.value })} required />
                                            <span className="bottom_border"></span>
                                        </div>
                                        {/* <div className="form_input">
                                                    <label>Currency </label>
                                                    <input type="text" name="name" onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), buttonTextDisplay: event.target.value })} required />
                                                    <span className="bottom_border"></span>
                                                </div> */}
                                        <br />
                                        <div>
                                            <label>Text Color </label>
                                            <input style={{
                                                padding: 0,
                                                width: "2rem",
                                                marginLeft: "0.875rem"
                                            }} type="color" value={state.injectedStyle.color} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), injectedStyle: { ...state.injectedStyle, color: event.target.value } })} required />
                                            {/* <span className="bottom_border"></span> */}
                                        </div>
                                        <br />
                                        <div>
                                            <label>Background Color </label>
                                            <input style={{
                                                padding: 0,
                                                width: "2rem",
                                                marginLeft: "0.875rem"
                                            }} type="color" value={state.injectedStyle.backgroundColor} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), injectedStyle: { ...state.injectedStyle, backgroundColor: event.target.value } })} required />
                                            {/* <span className="bottom_border"></span> */}
                                        </div>
                                        <br />
                                        <div className="form_input">
                                            <label>Alignment Text </label>
                                            {(() => {
                                                var options = [
                                                    <option key={0} value="center">Center</option>,
                                                    <option key={1} value="end">Right</option>,
                                                    <option key={2} value="start">Left</option>
                                                ];
                                                return <SelectTag name="templateName" value={state.injectedStyle.textAlign} options={options} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), injectedStyle: { ...state.injectedStyle, textAlign: event.target.value } })} />
                                            })()}
                                            <span className="bottom_border"></span>
                                        </div>
                                        <br />
                                        <div className="form_input">
                                            <label>Font Size </label>
                                            <input type="number" value={`${state.injectedStyle.fontSize}`} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), injectedStyle: { ...state.injectedStyle, fontSize: parseFloat(event.target.value) } })} required />
                                            <span className="bottom_border"></span>
                                        </div>
                                        <br />
                                        <div className="display-inline row-separator" style={{
                                            width: '100%',
                                            height: "100%"
                                        }}>
                                            <div className="column column_6_12">
                                                <div className="form_input">
                                                    <label>Italic </label>
                                                    <input type="checkbox" checked={state.isItalic} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), isItalic: !state.isItalic, injectedStyle: { ...state.injectedStyle, fontStyle: `${event.target.checked ? 'italic' : 'normal'}` } })} />
                                                    <span className="bottom_border"></span>
                                                </div>
                                            </div>
                                            <div className="column column_6_12">
                                                <div className="form_input">
                                                    <label>Bold </label>
                                                    <input type="checkbox" checked={state.isBold} onChange={event => {

                                                        this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), isBold: !state.isBold, injectedStyle: { ...state.injectedStyle, fontWeight: `${event.target.checked ? 'bold' : 'normal'}` } });
                                                    }} />
                                                    <span className="bottom_border"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form_input">
                                            <label>Product Decription</label>
                                            <br />
                                            <textarea type="text" value={state.productDescription} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), productDescription: event.target.value })} name="productName" />
                                            <span className="bottom_border"></span>
                                        </div>


                                    </div>
                                    <div className="column column_6_12" style={{
                                        padding: "3px 3px"
                                    }}>
                                        {/* OUTPUT FOR BUTTON */}
                                        <button id="createdElement_btn_generator" style={state.injectedStyle} >
                                            {state.buttonTextDisplay}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="display-inline row-separator">
                                {/* <div className="column column_12_12 text-center" style={{ padding: 5, paddingBottom: 10, backgroundColor: 'transparen' }}>
                                            
                                        </div> */}
                                <button className="btn-success font-roboto-light" style={{ margin: '0 5px', float: "right" }} onClick={() => {
                                    this.setState({
                                        editstepperState: "form_button"
                                    });
                                }}>
                                    <span className="hide-in-mobile">Next</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </React.Fragment>

        );

    }

    buttonGenerator() {
        const state = this.state;
        const currentUser = this.props.session.getCurrentUser;
        return (
            <React.Fragment>
                <div className="rpp-stepper">
                    <div className="rpp-stepper-item rpp-active">
                        <span className="rpp-stepper-item-content">1</span>
                    </div>
                    <div className="rpp-stepper-divider"></div>
                    <div className="rpp-stepper-item rpp-stepper-item-pending" onClick={() => {
                        this.setState({
                            stepperState: "form_button"
                        });
                    }}>
                        <span className="rpp-stepper-item-content">2</span>
                    </div>
                </div>
                <div className="display-inline row-separator">
                    <div className="column column_12_12">
                        <div className="page-container">
                            <div className="flex-container clear" style={{
                                justifyContent: "center",
                            }}>
                                <div className="display-inline row-separator" style={{
                                    width: '100%',
                                    height: "100%"
                                }}>
                                    <div className="column column_6_12" style={{
                                        padding: "3px 3px"
                                    }}>
                                        {/* EDITOR ONE SIDE 
                                        productName
                                        productDescription
                                        */}
                                        <div className="form_input">
                                            <label>Product / Service Name</label>
                                            <input type="text" value={state.productName} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), productName: event.target.value })} name="productName" />
                                            <span className="bottom_border"></span>
                                        </div>
                                        <div className="form_input">
                                            <label>Button Call to Action </label>
                                            <input type="text" name="name" value={state.buttonTextDisplay} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), buttonTextDisplay: event.target.value })} required />
                                            <span className="bottom_border"></span>
                                        </div>
                                        <br />
                                        <div className="form_input">
                                            <label>Amount ( USD )</label>
                                            <input type="text" name="number" value={state.amount} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), amount: event.target.value })} required />
                                            <span className="bottom_border"></span>
                                        </div>
                                        {/* <div className="form_input">
                                                    <label>Currency </label>
                                                    <input type="text" name="name" onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), buttonTextDisplay: event.target.value })} required />
                                                    <span className="bottom_border"></span>
                                                </div> */}
                                        <br />
                                        <div>
                                            <label>Text Color </label>
                                            <input style={{
                                                padding: 0,
                                                width: "2rem",
                                                marginLeft: "0.875rem"
                                            }} type="color" value={state.injectedStyle.color} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), injectedStyle: { ...state.injectedStyle, color: event.target.value } })} required />
                                            {/* <span className="bottom_border"></span> */}
                                        </div>
                                        <br />
                                        <div>
                                            <label>Background Color </label>
                                            <input style={{
                                                padding: 0,
                                                width: "2rem",
                                                marginLeft: "0.875rem"
                                            }} type="color" value={state.injectedStyle.backgroundColor} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), injectedStyle: { ...state.injectedStyle, backgroundColor: event.target.value } })} required />
                                            {/* <span className="bottom_border"></span> */}
                                        </div>
                                        <br />
                                        <div className="form_input">
                                            <label>Alignment Text </label>
                                            {(() => {
                                                var options = [
                                                    <option key={0} value="center">Center</option>,
                                                    <option key={1} value="end">Right</option>,
                                                    <option key={2} value="start">Left</option>
                                                ];
                                                return <SelectTag name="templateName" value={state.injectedStyle.textAlign} options={options} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), injectedStyle: { ...state.injectedStyle, textAlign: event.target.value } })} />
                                            })()}
                                            <span className="bottom_border"></span>
                                        </div>
                                        <br />
                                        <div className="form_input">
                                            <label>Font Size </label>
                                            <input type="number" value={`${state.injectedStyle.fontSize}`} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), injectedStyle: { ...state.injectedStyle, fontSize: parseFloat(event.target.value) } })} required />
                                            <span className="bottom_border"></span>
                                        </div>
                                        <br />
                                        <div className="display-inline row-separator" style={{
                                            width: '100%',
                                            height: "100%"
                                        }}>
                                            <div className="column column_6_12">
                                                <div className="form_input">
                                                    <label>Italic </label>
                                                    <input type="checkbox" checked={state.isItalic} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), isItalic: !state.isItalic, injectedStyle: { ...state.injectedStyle, fontStyle: `${event.target.checked ? 'italic' : 'normal'}` } })} />
                                                    <span className="bottom_border"></span>
                                                </div>
                                            </div>
                                            <div className="column column_6_12">
                                                <div className="form_input">
                                                    <label>Bold </label>
                                                    <input type="checkbox" checked={state.isBold} onChange={event => {

                                                        this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), isBold: !state.isBold, injectedStyle: { ...state.injectedStyle, fontWeight: `${event.target.checked ? 'bold' : 'normal'}` } });
                                                    }} />
                                                    <span className="bottom_border"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form_input">
                                            <label>Product Decription</label>
                                            <br />
                                            <textarea type="text" value={state.productDescription} onChange={event => this.setState({ rawButton: this.submitTheHtml(document.getElementById('createdElement_btn_generator')), productDescription: event.target.value })} name="productName" />
                                            <span className="bottom_border"></span>
                                        </div>

                                    </div>
                                    <div className="column column_6_12" style={{
                                        padding: "3px 3px"
                                    }}>
                                        {/* OUTPUT FOR BUTTON */}
                                        <button id="createdElement_btn_generator" style={state.injectedStyle} >
                                            {state.buttonTextDisplay}
                                        </button>
                                    </div>
                                    {/* <div className="column column_4_12" style={{
                                                padding: "3px 3px"
                                            }}>
                                                EDITOR TWO SIDE  

                                            </div> */}
                                </div>
                            </div>
                            <div className="display-inline row-separator">
                                {/* <div className="column column_12_12 text-center" style={{ padding: 5, paddingBottom: 10, backgroundColor: 'transparen' }}>
                                            
                                        </div> */}
                                <button className="btn-success font-roboto-light" style={{ margin: '0 5px', float: "right" }} onClick={() => {
                                    this.setState({
                                        stepperState: "form_button"
                                    });
                                }}>
                                    <span className="hide-in-mobile">Next</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </React.Fragment>
        );
    }

    resetAllState() {
        this.setState({
            activeHeadertext: "Button Generator", // Button Generator || Form Button Design
            stepperState: "button_generator", // button_generator || form_button || done            
            isItalic: false,
            amount: 1,
            currency: "US",
            productName: "",
            productDescription: "",
            isBold: false,
            buttonLabelText: "Buy Now!",
            redirectURI: "",
            buttonTextDisplay: "Button",
            injectedStyle: {
                ...defaultInjectedStyle
            },
            rawButton: "",
            rawJS: ""
        })
    }

    componentDidMount() {
        console.log('Did Mounted ');

    }

    submitTheHtml(html) {
        return html.getAttribute("style") ? html.getAttribute("style") : '';
    }

    toggleAddButton() {
        this.setState({
            openAddButton: !this.state.openAddButton
        });
    }

    toggleEditorButton() {
        this.setState({
            openEditor: !this.state.openEditor
        })
    }

    head() {
        return (
            <Helmet>
                <title>Button Generator - Product List Genie</title>
            </Helmet>
        );
    }

    presentableFunnelName(fn) {
        return points.capitalizeWord(fn.replace(/-|_/g, " "));
    }

    saveGeneratedButtonFun(saveGeneratedbutton) {

        saveGeneratedbutton().then(({ data }) => {
            // refetchButtons();
            // refetchCount();
            // this.toggleAddButton();
            console.log(data);
            points.customFetch('/api/buttonGenerator', "POST", {
                rawStyles: data.addGeneratedButton.rawButton,
                title: data.addGeneratedButton.buttonTitle,
                amount: parseFloat(this.state.amount),
                buttonLabelText: this.state.buttonLabelText,
                redirectURI: this.state.redirectURI,
                meta: this.encryptString(this.props.session.getCurrentUser.id),
                plgbuttonID: data.addGeneratedButton.id
            }, addButton => {
                this.saveToPlgGPL(data.addGeneratedButton.id, addButton ? addButton.html : "No HTML");
            });
        });
    }

    saveToPlgGPL(plgID, rawJS) {
        points.customFetch('/send-js-to-buttonserver', "POST", {
            payload: {
                query: ` mutation ($plgID: String!, $rawJS: String, $currency: String, $amount: Float, $creatorID: String ){
                    addButton(plgID: $plgID, rawJS: $rawJS, currency: $currency, amount: $amount, creatorID: $creatorID) {
                        id      
                        plgID              
                    }
                 }
                `,
                variables: {
                    "plgID": plgID,
                    "rawJS": escape(rawJS),
                    "currency": "US",
                    "amount": parseFloat(this.state.amount),
                    "creatorID": localStorage.getItem('apc_user_id'),
                }
            }

        }, plgButton => {
            console.log('plgButton GQPL', plgButton);
            // mutate update to local with this id
            points.customFetch(`/graphql`, "POST", {
                query: `
                  mutation{
                    updateGeneratedButtonID(id:"${plgButton.data.addButton.plgID}", buttonID:"${plgButton.data.addButton.id}"){
                      creator
                      buttonID
                    }
                  }
                `
            }, res => {
                console.log(res);
                toastr.options.timeOut = 2000;
                toastr.options.extendedTimeOut = 2500;
                toastr.clear();
                toastr.success("Please wait loading...", "Success!");
                toastr.options.timeOut = 0;
                toastr.options.extendedTimeOut = 0;
                refetchButtons();
                refetchCount();
                this.resetAllState();
                this.toggleAddButton();
            });
        });
    }

    deleteButton(btnID, plgButtonID) {
        console.log('Deletion Event !!', btnID, plgButtonID);
        points.customFetch('/graphql', "POST", {
            query: `
              mutation{
                deleteGeneratedButton(id:"${btnID}"){
                  amount
                  id
                  buttonID
                }
              }
            `
        }, result => {
            points.customFetch('/delete-generated-server', "POST", {
                payload: {
                    query: `
                        mutation($id: String){
                            deleteButton(id: $id){
                            creatorID
                            }
                        }
                    `,
                    variables: {
                        "id": plgButtonID,
                    }
                }
            }, results => {
                toastr.options.timeOut = 2000;
                toastr.options.extendedTimeOut = 2500;
                toastr.clear();
                toastr.success("Please wait loading...", "Success!");
                toastr.options.timeOut = 0;
                toastr.options.extendedTimeOut = 0;

                refetchButtons();
                refetchCount();
            });
        });

    }

    updateLocalButton() {
        console.log(JSON.stringify(JSON.stringify(this.state.injectedStyle)));
        points.customFetch('/graphql', "POST", {
            query: `
                mutation{
                    updateGeneratedButton(productName: "${this.state.productName}", productDescription: "${this.state.productDescription}", buttonLabelText: "${this.state.buttonLabelText}", redirectURI: "${this.state.redirectURI}",amount: ${parseFloat(this.state.amount)},buttonTitle: "${this.state.buttonTextDisplay}", injectedStyle: ${JSON.stringify(JSON.stringify(this.state.injectedStyle))}, rawButton: "${this.state.rawButton}", id: "${this.state.setSelectedButton.id}" ) {
                        buttonID
                        id
                        buttonTitle                        
                        rawButton
                    }
                }
            `
        }, result => {
            console.log(result.data);
            points.customFetch('/api/buttonGenerator', "POST", {
                rawStyles: this.state.rawButton,
                title: this.state.buttonTextDisplay,
                buttonLabelText: this.state.buttonLabelText,
                redirectURI: this.state.redirectURI,
                amount: parseFloat(this.state.amount),
                meta: this.encryptString(this.props.session.getCurrentUser.id),
                plgbuttonID: result.data.updateGeneratedButton.id
            }, addButton => {
                console.log("Update button generator result ==>>", addButton);
                points.customFetch('/update-send-js-to-buttonserver', "POST", {
                    payload: {
                        query: `mutation ($plgID: String!, $rawJS: String, $currency: String, $amount: Float, $id: String ){
                            updateButton(plgID: $plgID, rawJS: $rawJS, currency: $currency, amount: $amount, id: $id) {
                                id      
                                amount
                                plgID
                            }
                         }
                        `,
                        variables: {
                            "id": result.data.updateGeneratedButton.buttonID,
                            "rawJS": escape(addButton.html),
                            "currency": "US",
                            "amount": parseFloat(this.state.amount),
                            "plgID": result.data.updateGeneratedButton.id,
                        }
                    }

                }, plgButton => {
                    console.log('plgButton GQPL', plgButton);

                    toastr.options.timeOut = 2000;
                    toastr.options.extendedTimeOut = 2500;
                    toastr.clear();
                    toastr.success("Please wait loading...", "Success!");
                    toastr.options.timeOut = 0;
                    toastr.options.extendedTimeOut = 0;
                    refetchButtons();
                    this.resetAllState();
                    refetchCount();
                    this.toggleEditorButton();
                });
            });
        });
    }

    render() {
        const state = this.state;
        const currentUser = this.props.session.getCurrentUser;
        // TODO :: Button Style Publish
        /**
         * Listing Button Style Variations
         *  - Color √         
         *  - Active Color √
         *  - Text Value √
         *  - Tap Pay CallBacks
         *  - Load its own node modal html css.
         * 
         *   GET_TOTAL_BUTTON_COUNT Q
         *   GET_BUTTON_PER_USER Q
         *   ADD_BUTTON M
         *   UPDATE_BUTTON M
         *   DELETE_BUTTON M
         * 
         *  / Save to button GQL then save to local for referencing buttons design to rawJS
         *  
         *  - Text Font Size √
         *  - Font Weight √
         *  - 
         * 
         */

        // console.log(this.props.location.search.get("value"));
        return (
            <React.Fragment>
                <div className="funnel">
                    {this.head()}
                    <Query query={GET_BUTTON_COUNT} variables={{ creator: currentUser.id, search: "" }} notifyOnNetworkStatusChange={true} onCompleted={data => {
                        if (data.getTotalButton) this.setState({ totalPages: data.getTotalButton.count ? data.getTotalButton.count : 0 });
                    }}>
                        {({ data, loading, refetch, error }) => {
                            refetchCount = refetch;
                            return null;
                        }}
                    </Query>
                    <div className="newPageHeader display-inline row-separator">
                        <div className="column column_7_12" >
                            <h4 className="font-roboto-bold"
                                style={{ fontSize: '1.5em', color: '#273037' }}>
                                PLG Merchant Button
                        </h4>

                            {/* Cash on Delivery */}
                        </div>
                        <div className="column column_5_12">
                            <button className="btn-success font-roboto-light" style={{ margin: '0 5px', float: "right" }} onClick={() => {
                                this.resetAllState();
                                this.toggleAddButton();
                            }}>
                                <span className="fas fa-plus" />
                                <span className="hide-in-mobile">&nbsp;Add New Button</span>
                            </button>
                        </div>
                    </div>
                    <span className="clear" />
                    <div className="filter-container" style={{ margin: 10, backgroundColor: '#f3f8fe' }}>
                        <Pagination displayPageCount={10} totalPage={state.totalPages} currentPage={state.currentPage} action={result => this.setState({ currentPage: result })} style={{ marginLeft: 10 }} />
                    </div>
                    <div className="clear" style={{ marginTop: 10 }}>
                        <Query query={GET_BUTTONS_USER} variables={{
                            creator: currentUser.id,
                            search: "",
                            page: state.currentPage,
                        }} notifyOnNetworkStatusChange>
                            {({ data, loading, refetch, error }) => {
                                refetchButtons = refetch;
                                if (loading) return <div className="text-center stretch-width"><Loading width={200} height={200} /></div>;
                                if (error) return <div className="text-center"><label>An error has occurred please try again.</label></div>;
                                else {
                                    if (data.getGeneratedButton.length === 0) {
                                        return <div className="text-center"><label>No generated buttons yet...</label></div>;
                                    } else {
                                        return data.getGeneratedButton.map(((btn, index) => {
                                            return <div key={btn.id} className="product-card display-inline" style={{ padding: 15, margin: 10, backgroundColor: '#f3f8fe' }}>
                                                {/* <Link to={'#'}> */}
                                                <span className="fas fa-flask dark-container" style={{ fontSize: '1.2em', padding: 10, borderRadius: 3, marginRight: 15 }} />
                                                {/* </Link> */}
                                                <label className="cursor-pointer header-medium-bold ellipsis-in-mobile" style={{ color: '#353c37' }}>{this.presentableFunnelName(btn.buttonTitle)}</label>

                                                <input id={"btn" + btn.id} style={{
                                                    // width: "50%",
                                                    zIndex: "-11",
                                                    marginLeft: "2rem", borderRadius: 3, float: "right"
                                                }} value={`<script src="https://button.plgenie.io/${btn.buttonID}.js"></script>`} readOnly />
                                                <div className={"text-center date-modified"} style={{ position: 'absolute', right: 10 }}>
                                                    <span className="fas fa-edit dark-container" onClick={() => {
                                                        // console.log(btn, "This is the btn btn btn value");
                                                        this.setState({
                                                            injectedStyle: { ...JSON.parse(btn.injectedStyle) },
                                                            buttonTextDisplay: btn.buttonTitle,
                                                            setSelectedButton: btn,
                                                            amount: btn.amount,
                                                            productName: btn.productName,
                                                            productDescription: btn.productDescription,
                                                            buttonLabelText: btn.buttonLabelText,
                                                            redirectURI: btn.redirectURI,
                                                            isBold: btn.injectedStyle.includes("bold"),
                                                            isItalic: btn.injectedStyle.includes("italic"),

                                                        });
                                                        this.toggleEditorButton();
                                                    }} style={{ cursor: "pointer", fontSize: '1.2em', padding: 10, marginLeft: "2rem", borderRadius: 3, float: "right" }} />
                                                    <span className="fas fa-copy dark-container" onClick={() => {
                                                        var copText = document.querySelector(`#btn${btn.id}`);
                                                        copText.focus();
                                                        copText.select();
                                                        console.log(copText.value);
                                                        document.execCommand("copy");

                                                        toastr.options.timeOut = 2000;
                                                        toastr.options.extendedTimeOut = 2500;
                                                        toastr.clear();
                                                        toastr.success("Copied to Clipboard", "Success!");
                                                        toastr.options.timeOut = 0;
                                                        toastr.options.extendedTimeOut = 0;

                                                    }} style={{ cursor: "pointer", fontSize: '1.2em', padding: 10, marginLeft: "2rem", borderRadius: 3, float: "right" }} />

                                                    <ButtonWithPopup data={{
                                                        triggerDOM: <span id={"remove_" + index} className="fas fa-trash dark-container" style={{ cursor: "pointer", fontSize: '1.2em', padding: 10, marginLeft: "2rem", borderRadius: 3, float: "right" }} />,
                                                        popupPosition: "top center",
                                                        text: (
                                                            <label className="font-roboto-light" style={{ fontSize: '1.2em' }}>
                                                                Are you sure you want <br />
                                                                                to delete <u style={{ color: '#2ac689' }}>{points.presentableFunnelName(btn.buttonTitle)}</u>?
                                                            </label>
                                                        ),
                                                        action: () => {
                                                            console.log("DELETION EVENT COMES");
                                                            this.deleteButton(btn.id, btn.buttonID);
                                                        },
                                                        triggerID: "remove_" + index,
                                                        loading,
                                                        padding: 10,
                                                        style: { minWidth: 200, width: 200 }
                                                    }} />
                                                    <Link to={'/funnel-genie-orders?plgbuttonID=' + btn.id}>
                                                        <span className="fas fa-th-list dark-container" style={{ cursor: "pointer", fontSize: '1.2em', padding: 10, marginLeft: "2rem", borderRadius: 3, float: "right" }} />
                                                    </Link>

                                                    {/* <span className="container text-center" style={{
                                                        padding: 20
                                                    }}>
                                                </span> */}
                                                <label className="color-dark-white">Total Sales</label>{"  "}                                           
                                                <label className="color-success" style={{ fontWeight: 700, color: "#2ac689", fontSize: "1.7rem" }}>$ {points.commafy(btn.orderItems.toFixed(2))}</label>
                                                </div>
                                            </div>;
                                        }));
                                    }
                                }
                            }}
                        </Query>
                    </div>
                </div>

                {state.openAddButton &&
                    <Modal open={state.openAddButton} closeModal={() => {
                        this.toggleAddButton()
                        this.setState({ stepperState: "button_generator" });
                    }} session={this.props.session} style={{ width: '60%', borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0 }}>
                        <div className="funnel">
                            <div className="column_12_12">
                                <style dangerouslySetInnerHTML={{ __html: `.popup-content .content { padding: 0px; }` }} />
                                <div className="clear" style={{ padding: 20, backgroundColor: '#f2f9f6', overflow: 'hidden' }}>
                                    <h4 className="header"> Test Steps Button <small style={{
                                        color: "#4a4a4a",
                                        fontSize: "0.6em"
                                    }}> </small></h4>
                                </div>
                                <br />
                            </div>
                            <div className="column column_12_12" style={{
                                marginRight: "auto",
                                marginLeft: "auto"
                            }}>
                                {state.stepperState == "button_generator" ? this.buttonGenerator() : this.formGenerator()}
                            </div>
                        </div>
                    </Modal>
                }

                {state.openEditor && <Modal open={state.openEditor} closeModal={() => {
                    this.toggleEditorButton();
                    this.setState({ editstepperState: "button_generator" });
                }} session={this.props.session} style={{ width: '60%', borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0 }}>
                    <div className="funnel">
                        <div className="column_12_12">
                            <style dangerouslySetInnerHTML={{ __html: `.popup-content .content { padding: 0px; }` }} />
                            <div className="clear" style={{ padding: 20, backgroundColor: '#f2f9f6', overflow: 'hidden' }}>
                                <h4 className="header"> Edit Button <small style={{
                                    color: "#4a4a4a",
                                    fontSize: "0.6em"
                                }}> </small></h4>
                            </div>
                            <br />
                        </div>

                        <div className="column column_12_12" style={{
                            marginRight: "auto",
                            marginLeft: "auto"
                        }}>
                            {state.editstepperState == "button_generator" ? this.editButtonGenerator() : this.editFormGenerator()}
                        </div>
                    </div>
                </Modal>}





            </React.Fragment>
        );
    }
}