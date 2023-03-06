import React from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import toastr from 'toastr';
import Modal from '../components/ModalComponent';


// const points = require("../../../Global_Values");


const points = require('../../Global_Values');


export default class CarLeads extends React.Component {
    constructor(props) {
        super();
        this.state = {
            name: "",
            email: "",
            notes: "",
            limit: 50,
            phone: "+1",
            parame: "",
            affiliateCarImage: "",
            data: [],
            selectedDealer: "",
            openLeads: false,
            fromCards: false,
        }
    }

    // componentDidUpdate() {
    //     this.computeResult();
    // }

    componentDidMount() {
        const paramss = points.getURLParameters(this.props.location.search)

        if (paramss.v) {
            this.toggleOpenLeads();
            this.setState({
                parame: paramss.v,
                fromCards: false
            })
        }


        var payload = {
            'query': `
             { shareCarsToPlg(limit : ${this.state.limit} ) { 
                id                 
                category    
                active 
                title
                dealerId
                creativeLink                
                sourceSellingAtImg
             } } `
        }
        points.customFetch('https://freeviralproducts.com/graphql', "POST", payload, result => {
            let data = result.data.shareCarsToPlg;
            console.log(data);
            this.setState({ data: data });
        });
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
                    phone: value.includes("+1") ? value : `+1${value}`
                });
                break;
            default:
                break;
        }
        // this.setState({
        //     name: value
        // });
    }

    toggleOpenLeads() {
        this.setState({
            openLeads: !this.state.openLeads
        })
    }

    async sendtoStats(encos) {
        try {
            await fetch("https://stats.productlistgenie.io/data/" + btoa(unescape(encodeURIComponent(JSON.stringify(encos)))), {
                method: "GET"
            });
            return
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    encryptString(str) {
        return CryptoJS.AES.encrypt(str, points.plg_domain_secret).toString();
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

        // console.log(this.state.email);
        toastr.options.timeOut = 2000;
        toastr.options.extendedTimeOut = 2000;
        toastr.clear();
        toastr.success("Please wait ... ", "Success!");

        this.validateForm().then(res => {
            console.log(res);
            if (res) {
                const currentUser = this.props.session.getCurrentUser;

                const paramss = points.getURLParameters(this.props.location.search)

                const newParmas = paramss.v && !this.state.fromCards ? decodeURI(paramss.v) : decodeURI(this.state.parame);

                console.log(this.props.session.currentUser);

                const dealers = this.state.selectedDealer;

                const payload = {
                    'query': `
                        mutation {
                            addUserbehavior(affiliateCarImage: "${this.state.affiliateCarImage}",sessionID: "${Date.now() + "PLG" + Date.now() + "CRL"}",data: ${JSON.stringify(JSON.stringify({ "note": this.state.notes.replace(/"/gi, '\\\"') }))}, creatorID: "5c27ec254250757e55a2d101", firstName: "${this.state.name}", email: "${this.state.email}", phone: "${this.state.phone.replaceAll("+1", "").replaceAll("-", "")}", notes: "${this.state.notes.replace(/"/gi, '\\\"')}", tags: "${"cars, " + newParmas}", affiliateEmail: "${this.props.session.getCurrentUser.email}", affiliateID: "${this.props.session.getCurrentUser.id}", affiliateTitle: "${newParmas}", date: "${Date.now()}"){
                                sessionID
                                creatorID
                                firstName
                                email
                                phone
                                data
                                notes
                                tags
                                affiliateEmail
                                affiliateID
                                affiliateTitle
                            }
                        }
                    `
                }
                // var notifyPlayload = {
                //     "title": `${this.props.session.getCurrentUser.firstName} added a new Car Lead`,
                //     "msg": `${newParmas} - ${this.state.notes.replace(/"/gi, '\\\"')}`,
                //     "creator": "5c3613ad7c511950acf14c97"
                // }
                // console.log(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
                // console.log(payload);
                // fetch("https://us-central1-productlistgenie-14e76.cloudfunctions.net/webApi/api_plg/v1/notifyElgenie", {
                //     method: "POST",   
                //     headers: {
                //         "Access-Control-Allow-Origin": "*"
                //     }   ,              
                //     body: JSON.stringify({
                //         "title": `${this.props.session.getCurrentUser.firstName} added a new Car Lead`,
                //         "msg": `${newParmas} - ${this.state.notes.replace(/"/gi, '\\\"')}`,
                //         "creator": "5c3613ad7c511950acf14c97"
                //     })
                // }).then(res => console.log(notifyPlayload));
                points.customFetch('https://stats.productlistgenie.io/graphql', "POST", payload, value => {
                    try {
                        console.log(value);
                        toastr.options.timeOut = 2000;
                        toastr.options.extendedTimeOut = 2000;
                        toastr.clear();
                        toastr.success("Added Car Leads ", "Success!");


                        // points.sendPOST("https://us-central1-productlistgenie-14e76.cloudfunctions.net/webApi/api_plg/v1/notifyElgenie", notifyPlayload);
                        this.toggleOpenLeads();
                        this.setState({
                            fromCards: false
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
                <title>Genie Cars - Product List Genie</title>
            </Helmet>
        );
    }


    render() {
        const state = this.state;
        const currentUser = this.props.session.getCurrentUser;

        // console.log(this.props.location.search.get("value"));

        return (
            <div className="funnel">
                {this.head()}

                <div className="newPageHeader display-inline row-separator">
                    <div className="column column_7_12">
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>
                            Genie Cars
                        </h4>
                        {/* Cash on Delivery */}
                    </div>
                    <div className="column column_5_12">
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
                    </div>
                </div>
                <span className="clear" />
                <div className="flex-container clear" style={{
                    justifyContent: "center"
                }}>
                    {state.data.map((product, index) => {


                        return (
                            <div className="column column_3_12" key={index} style={{ minWidth: 230, margin: 0, filter: 'blur(0px)' }}>
                                <div className="product-card">
                                    <div className="funnel product-tumb product-card-thumb" style={{ backgroundImage: "url(" + product.sourceSellingAtImg + ")", borderRadius: '5px 5px 0 0', position: 'relative', overflow: 'hidden' }}>
                                        {!product.active && <img src="https://cdn.productlistgenie.com/images/NWMzNjEzYWQ3YzUxMTk1MGFjZjE0Yzk3/1605734098886sold.png"></img>}
                                    </div>
                                    <div className="product-details product-card-details">
                                        <br />
                                        <div className="display-inline">
                                            <div style={{
                                                width: "100%",
                                                fontWeight: "bold"
                                            }}>
                                                <h5>{product.title}</h5>
                                            </div>
                                        </div>
                                        <br></br>
                                        {(currentUser && currentUser.privilege == 10) && <div className="display-inline">
                                            <button className="btn-success font-roboto-light" onClick={() => {
                                                window.open(`https://freeviralproducts.com/admin-edit-product/${product.id}`, '_blank');
                                            }} style={{ margin: '0 5px', fontSize: "12px", width: "140px" }}>
                                                <span >Edit</span>
                                            </button>
                                        </div>}
                                        <br></br>
                                        <div className="display-inline" style={{
                                            width: "100%",
                                            fontWeight: "bold"
                                        }}>
                                            {product.active && <button className="btn-success font-roboto-light" onClick={() => {
                                                this.toggleOpenLeads();
                                                console.log(JSON.parse(product.dealerId));
                                                this.setState({
                                                    parame: product.title,
                                                    selectedDealer: product.dealerId,
                                                    affiliateCarImage: product.sourceSellingAtImg,
                                                    fromCards: true
                                                })
                                            }} style={{ margin: '0 5px', fontSize: "14px", paddingLeft: "9px", paddingRight: "9px", width: "50%" }}>
                                                <span >Add Leads</span>
                                            </button>}
                                            <button className="btn-success font-roboto-light" onClick={() => {
                                                if (product.creativeLink != "") {
                                                    window.open(product.creativeLink, '_blank');
                                                } else {
                                                    toastr.error("No Creative Link available.");
                                                }

                                            }} style={{ margin: '0 5px', fontSize: "14px", width: !product.active ? '100%' : "50%" }}>
                                                <span >Creative Link</span>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )
                    })}

                </div>
                {state.openLeads &&
                    <Modal open={state.openLeads} closeModal={() => this.toggleOpenLeads()} session={this.props.session} style={{ width: '60%', borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0 }}>
                        <div>
                            <div className="column_12_12">
                                <style dangerouslySetInnerHTML={{ __html: `.popup-content .content { padding: 0px; }` }} />
                                <div className="clear" style={{ padding: 20, backgroundColor: '#f2f9f6', overflow: 'hidden' }}>
                                    <h4 className="header">{state.parame} <small style={{
                                        color: "#4a4a4a",
                                        fontSize: "0.6em"
                                    }}> </small></h4>
                                </div>
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
                                                            <span>Save Lead</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Modal>
                }
            </div>
        )
    }
}