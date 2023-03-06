import React from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import toastr from 'toastr';
import Modal from '../components/ModalComponent';


// const points = require("../../../Global_Values");


const points = require('../../Global_Values');

export default class GenieMerchantCars extends React.Component {
    constructor(props) {
        super();
        this.state = {
            name: "",
            email: "",
            notes: "",
            limit: 50,
            phone: "",
            parame: "",
            data: [],
            openLeads: false,
            fromCards: false,
        }
    }

    handleChange(name, value) {
        switch (name) {
            case "name":
                this.setState({
                    name: value
                });
                break;
            case "email":
                this.setState({
                    email: value
                });
                break;
            case "notes":
                this.setState({
                    notes: value
                });
                break;
            case "phone":
                this.setState({
                    phone: value
                });
                break;
            default:
                break;
        }
        // this.setState({
        //     name: value
        // });
    }

    componentDidMount(){
        console.log('component did mount');
    }

    async validateForm() {
        const { email, name, phone } = this.state;
        if (email == "" && name == "" && phone == "") {
            return false;
        } else {
            // validate phonenumber using twilio
            const validPhone = new Promise((resolve) => {
                points.customFetch('/api/validatePhone', "POST", {
                    phone: phone.replaceAll("-", "").replaceAll(" ", "")
                }, (result) => {
                    console.log(result);
                    resolve(result);
                });
            });

            const result = await validPhone;

            console.log(result);
            return result.status === "success" ? true : false;
        };
    }


    submitForm(e) {
        e.preventDefault();

        
        console.log(this.state.email);
        toastr.options.timeOut = 2000;
        toastr.options.extendedTimeOut = 2000;
        toastr.clear();
        toastr.success("Please wait ... ", "Success!");

        this.validateForm().then(res => {
            console.log(res);
            if (res) {
                const currentUser = this.props.session.getCurrentUser;            

                console.log(this.props.session.currentUser);

                const payload = {
                    'query': `
                        mutation {
                            addUserbehavior(sessionID: "${Date.now() + "PLG" + Date.now() + "CRL"}", creatorID: "5c27ec254250757e55a2d101", firstName: "${this.state.name}", email: "${this.state.email}", phone: "${this.state.phone.replaceAll("+1", "").replaceAll("-", "")}", notes: "${this.state.notes.replace(/"/gi, '\\\"')}", tags: "${"geniemerchant"}", affiliateEmail: "${this.props.session.getCurrentUser.email}", affiliateID: "${this.props.session.getCurrentUser.id}", date: "${Date.now()}"){
                                sessionID
                                creatorID
                                firstName
                                email
                                phone
                                notes
                                tags
                                affiliateEmail
                                affiliateID
                                affiliateTitle
                            }
                        }
                    `
                }

                // console.log(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
                // console.log(payload);
                points.customFetch('https://stats.productlistgenie.io/graphql', "POST", payload, value => {
                    try {
                        console.log(value);
                        console.log(payload);
                        toastr.options.timeOut = 2000;
                        toastr.options.extendedTimeOut = 2000;
                        toastr.clear();
                        toastr.success("Added Genie Merchant Leads ", "Success!");                                               
                        this.setState({
                            fromCards: false,
                            email: "",
                            name: "",
                            phone: "",
                            text: ""
                        })
                    } catch (error) {
                        console.log(error);
                        toastr.options.timeOut = 2000;
                        toastr.options.extendedTimeOut = 2000;
                        toastr.clear();
                        toastr.warning("An error occured, please try again. ", "Error Occured");
                    }
                });

            } else {
                toastr.options.timeOut = 2000;
                toastr.options.extendedTimeOut = 2000;
                toastr.clear();
                toastr.warning("Please complete inputs.", "Error Occured");
            }
        });

    }

    head() {
        return (
            <Helmet>
                <title>Genie Merchant - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const state = this.state;
        const currentUser = this.props.session.getCurrentUser;

        return <div className="funnel">
            {this.head()}

            <div className="newPageHeader display-inline row-separator">
                <div className="column column_12_12">
                    <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>
                        Genie Merchant
                </h4>
                    {/* Cash on Delivery */}
                </div>
                {/* <div className="column column_5_12">
                    <div className="display-inline row-separator">
                        <div className="column column_8_12">
                            <button className="btn-success font-roboto-light" onClick={() => window.open("https://drive.google.com/file/d/1AzPv8ExQRdoXPpAlpSGdBqt2NgeHfSiS/view?usp=sharing", "_blank")} style={{ margin: '0 auto', float: "right" }}>
                                Trainings
                        </button>
                        </div>
                        <div className="column column_4_12">
                            <NavLink to="/my-car-leads">
                                <button className="btn-success font-roboto-light" style={{ margin: '0 auto' }}>
                                    My Car Leads
                            </button>
                            </NavLink>
                        </div>
                    </div>
                </div> */}
            </div>
            <span className="clear" />
            <div className="flex-container clear" style={{
                justifyContent: "center"
            }}>
                <div className="column_12_12">
                    <style dangerouslySetInnerHTML={{ __html: `.popup-content .content { padding: 0px; }` }} />                    
                    <br />
                </div>

                <div className="column column_12_12" style={{
                    // width: "96%",
                    marginRight: "auto",
                    marginLeft: "auto"
                }}>
                    <div className="page-container">
                        <div className="text-center">
                            {/* <h1>Create Ad</h1> */}
                        </div>
                        <form onSubmit={event => this.submitForm(event)} >
                            <div className="form_wrap">
                                <div className="form_row">
                                    <div className="grid">
                                        <div className="column column_12_12 margBottom clear">
                                            <div className="form_item">
                                                <div className="form_input">
                                                    <label>Name : </label>
                                                    <input type="text" name="name" value={state.name} onChange={event => this.handleChange("name", event.target.value)} required />
                                                    <span className="bottom_border"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column column_12_12 margBottom clear">
                                            <div className="form_item">
                                                <div className="form_input">
                                                    <label>Email Address : </label>
                                                    <input type="email" name="email" value={state.email} onChange={event => this.handleChange("email", event.target.value)} required />
                                                    <span className="bottom_border"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column column_12_12 margBottom clear">
                                            <div className="form_item">
                                                <div className="form_input">
                                                    <label>Phone : </label>
                                                    <input type="text" name="phone" value={state.phone} onChange={event => this.handleChange("phone", event.target.value)} maxLength={20} required />
                                                    <span className="bottom_border"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column column_12_12 margBottom clear">
                                            <div className="form_item">
                                                <div className="form_input">
                                                    <label>Notes : </label>
                                                    <textarea rows="6" className="message-area stretch-width" style={{ marginTop: "1rem" }} value={state.text} name="notes" onChange={event => this.handleChange("notes", event.target.value)}>
                                                    </textarea>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="column column_12_12" style={{ padding: 5, paddingBottom: 10, backgroundColor: 'transparen' }}>
                                            <button type="submit" className="btn-success font-roboto-light" style={{ margin: '0 5px' }}>
                                                <span>Save Genie Merchant</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    }

}