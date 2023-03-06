import React from 'react';
import { Helmet } from 'react-helmet';
import toastr from 'toastr';
import Modal from '../components/ModalComponent';
import Container from '../components/table';
import SelectTag from '../components/selectTag';
const { Table, Tbody } = Container
const points = require('../../Global_Values');


export default class CarLeadsAgent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            data: [],
            loading: true,
            hasError: false,
            openComment: false,
            sortby: "date",
            asc: true,
            lead_type: "cars",
            comment: "",
            selected_value: {}
        }
    }

    componentDidMount() {
        console.log('compnent did mounted.');
        const currentUser = this.props.session.getCurrentUser;

        this.loadLeads("date", this.state.lead_type);
    }

    loadLeads(sortby, category) { // * sortby , DSC false | true
        // console.log(sortby, this.state.asc);
        var payload = {
            'query': `
            { everyLeadsForAgent(creatorID: "5c27ec254250757e55a2d101" , sortby: "${sortby}", ASC: ${this.state.asc}, category: "${category}"){
                    id    
                    firstName
                    lastName
                    email
                    status
                    sessionID
                    dateUpdated
                    date
                    data
                    notes
                    comment
                    phone
                    affiliateTitle
              }
            } `
        }
        points.customFetch('https://stats.productlistgenie.io/graphql', "POST", payload, result => {
            try {
                let data = result.data.everyLeadsForAgent;
                // console.log(data);

                this.setState({ data: data.reverse(), loading: false, hasError: false });
            } catch (error) {
                this.setState({ loading: false, hasError: true });
            }
        });
    }

    toggleComment(lead) {
        if (lead) {
            console.log(lead);
            this.setState({
                selected_value: { ...lead }
            })
        }
        this.setState({
            openComment: !this.state.openComment
        })

        console.log(this.state.selected_value);
    }

    updateStatus(e, lead) {
        e.preventDefault();
        toastr.options.timeOut = 2000;
        toastr.options.extendedTimeOut = 2000;
        toastr.clear();
        toastr.success("Please wait ... ", "Success!");
        // console.log(this.state.selected_value);
        var payload = {
            'query': `
                mutation {
                 updateUserbehavior(sessionID: "${lead.sessionID}" , comment: "${lead.comment}",status: "${e.target.value}" ,dateUpdated: "${Date.now()}") {
                  sessionID
                  firstName
                  email                  
                  phone
                  dateUpdated
                  notes
                  affiliateTitle
                  affiliateEmail
                  tags
                }
              } `
        }
        points.customFetch('https://stats.productlistgenie.io/graphql', "POST", payload, result => {
            try {
                toastr.options.timeOut = 2000;
                toastr.options.extendedTimeOut = 2000;
                toastr.clear();
                toastr.success("Update Lead Complete Status ", "Success!");

                // this.setState({
                //     loading: true,
                //     hasError: false,
                //     data: []
                // });

                // this.loadLeads();

            } catch (error) {
                //  toastr.
                toastr.options.timeOut = 2000;
                toastr.options.extendedTimeOut = 2000;
                toastr.clear();
                toastr.error("Update Lead Error ", "Error!");
            }
        });
        console.log(lead, e.target.value);
    }

    submitForm(e) {
        e.preventDefault();

        // console.log(this.state.email);
        toastr.options.timeOut = 2000;
        toastr.options.extendedTimeOut = 2000;
        toastr.clear();
        toastr.success("Please wait ... ", "Success!");
        console.log(this.state.selected_value);
        var payload = {
            'query': `
                mutation {
                 updateUserbehavior(sessionID: "${this.state.selected_value.sessionID}" , comment: "${this.state.selected_value.comment}", dateUpdated: "${Date.now()}") {
                  sessionID
                  firstName
                  email                  
                  phone
                  dateUpdated
                  notes
                  affiliateTitle
                  affiliateEmail
                  tags
                }
              } `
        }
        points.customFetch('https://stats.productlistgenie.io/graphql', "POST", payload, result => {
            try {
                toastr.options.timeOut = 2000;
                toastr.options.extendedTimeOut = 2000;
                toastr.clear();
                toastr.success("Update Lead Complete ", "Success!");
                this.toggleComment();

            } catch (error) {
                //  toastr.
                toastr.options.timeOut = 2000;
                toastr.options.extendedTimeOut = 2000;
                toastr.clear();
                toastr.error("Update Lead Error ", "Error!");
            }
        });

    }

    handleChange(name, value) {
        switch (name) {
            case 'comment':
                this.setState({
                    selected_value: { ...this.state.selected_value, comment: value, }
                })
                break;

            default:
                break;
        }
    }

    sortToWhat(fieldname) {
        this.setState({
            sortby: fieldname,
            loading: true,
            hasError: false,
            asc: !this.state.asc,
            data: []
        });

        // console.log(fieldname, this.state.sortby);
        this.loadLeads(fieldname, this.state.lead_type);
    }



    head() {
        return (
            <Helmet>
                <title>Car Leads Agent - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const state = this.state;
        const currentUser = this.props.session.getCurrentUser;
        return (
            <div className="funnel">
                {this.head()}
                <div className="newPageHeader display-inline row-separator">
                    <div className="column column_9_12">
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>
                            Car Leads Agent
                        </h4>
                    </div>
                    <div className="column column_3_12" style={{ marginTop: 5 }}>
                        {(() => {
                            var lead_types = [{
                                value: "cars", label: "Cars"
                            }, {
                                value: "cashforcar", label: "Cash For Car"
                            }, {
                                value: "highticket", label: "High Ticket"
                            }, {
                                value: "geniemerchant", label: "Genie Merchant"
                            }].map((leadType, i) => {
                                return <option value={leadType.value} key={i}>{leadType.label}</option>;
                            });
                            return <SelectTag className="stretch-width" name="leadType" value={state.lead_type} options={lead_types} onChange={event => {
                                this.setState({
                                    lead_type: event.target.value, loading: true,
                                    hasError: false,
                                    data: []
                                });
                                this.loadLeads(state.sortby, event.target.value);
                            }} />
                        })()}
                    </div>
                    {/* <div className="column column_5_12">
                        <div className="display-inline row-separator">
                            <div className="column column_12_12">
                                
                            </div>                           
                        </div>
                    </div> */}
                </div>
                <span className="clear" />
                <div className="flex-container clear" style={{
                    justifyContent: "center"
                }}>
                    <div className="column column_12_12" style={{ minWidth: 230, margin: 0, filter: 'blur(0px)' }}>
                        <div className="product-card">
                            <div className="product-details">
                                <div className="row-separator">
                                    {/* <h5 className="font-roboto-bold" style={{ margin: 0 }}>Car </h5> */}
                                </div>
                                <Table headers={(() => {

                                    if (state.lead_type === "cars") {
                                        return [{ text: "Full Name" }, { text: "Email" }, { text: "Phone" }, { text: "Car Model", onClick: () => this.sortToWhat('affiliateTitle') }, { text: "Dealer" }, { text: "Notes" }, { text: "Date", onClick: () => this.sortToWhat('date') }, { text: 'Status', style: { width: "200px" }, onClick: () => this.sortToWhat('status') }, { text: "Comments" }];
                                    } else if (state.lead_type === "highticket") {
                                        // update data to load for high ticket                                        
                                        return [{ text: "Full Name" }, { text: "Email" }, { text: "Phone" }, { text: "Data" }, { text: "Date", onClick: () => this.sortToWhat('date') }, { text: 'Status', style: { width: "200px" }, onClick: () => this.sortToWhat('status') }, { text: "Comments" }];

                                    } else {
                                        return [{ text: "Full Name" }, { text: "Email" }, { text: "Phone" }, { text: "Notes" }, { text: "Date", onClick: () => this.sortToWhat('date') }, { text: 'Status', style: { width: "200px" }, onClick: () => this.sortToWhat('status') }, { text: "Comments" }];
                                    }
                                })()} >
                                    {/* if(loading) return <Tbody loading={true} />;
                                            if(error) return <Tbody singleRowText={"An error has occurred please try again."} />;
                                            if(data.getMyFunnelOrders.length == 0) return <Tbody singleRowText={"No order has beed delivered yet. check back soon!"} />; */}
                                    {state.loading && <Tbody loading={true} />}
                                    {state.hasError && !state.loading && <Tbody singleRowText={"An error has occurred please try again."} />}
                                    {state.data.length == 0 && !state.loading && <Tbody singleRowText={"No leads has been added yet. check back soon!"} />}
                                    {state.data.map((lead, index) => {
                                        if (state.lead_type === "cars") {
                                            return (
                                                <Tbody index={index} key={index}>
                                                    <div>{lead.firstName}{" "}{lead.lastName}</div>
                                                    <div onClick={() => { window.location = `mailto:${lead.email}` }} style={{
                                                        cursor: "pointer"
                                                    }}>{lead.email}</div>
                                                    <div><a href={"tel:" + lead.phone} >{lead.phone}</a></div>
                                                    <div>{lead.affiliateTitle}</div>
                                                    <div>{(() => {
                                                        if (lead.data === "" || lead.data === "null") {
                                                            return "No Dealer Specified"
                                                        }
                                                        else {
                                                            let dealer = JSON.parse(lead.data);
                                                            // console.log(dealer);
                                                            return `${dealer.name} - ${dealer.phone} - ${dealer.email}`;
                                                        }
                                                    })()}</div>
                                                    <div>{unescape(lead.notes)}</div>
                                                    <div>{new Date(parseInt(lead.date ? lead.date != null && lead.dateUpdated != null ? lead.date >= lead.dateUpdated ? lead.date : lead.dateUpdated : lead.date : lead.dateUpdated)).toLocaleDateString()}</div>
                                                    <div>
                                                        <select className="custom-select" defaultValue={lead.status} onChange={(event) => this.updateStatus(event, lead)} style={{
                                                            padding: "0.563rem",
                                                            backgroundColor: "#23c78a",
                                                            color: "white"
                                                        }}>
                                                            <option value="">Select Status</option>
                                                            <option value="Spoke to Prospect">Spoke to Prospect</option>
                                                            <option value="No Answer">No Answer</option>
                                                            <option value="Left Message">Left Message</option>
                                                            <option value="Appointment Schedule">Appointment Schedule</option>
                                                            <option value="Bad Phone Number">Bad Phone Number</option>
                                                            <option value="Prospect Requested DNC">Prospect Requested DNC</option>
                                                            <option value="Mark As Lost">Mark As Lost</option>
                                                        </select>
                                                    </div>
                                                    <div style={{ width: "9rem" }}> {(() => {
                                                        if (lead.comment === "") {
                                                            return (
                                                                <button className="btn-success font-roboto-light" onClick={() => this.toggleComment(lead)} style={{ margin: '0 auto', float: "right" }}>
                                                                    Comment
                                                                </button>
                                                            );
                                                        } else {
                                                            return <span onClick={() => this.toggleComment(lead)} style={{ cursor: "pointer" }}> {lead.comment}</span>;
                                                        }
                                                    })()} </div>
                                                </Tbody>
                                            );
                                        } else if (state.lead_type === "highticket") {
                                            return (
                                                <Tbody index={index} key={index}>
                                                    <div>{lead.firstName}{" "}{lead.lastName}</div>
                                                    <div onClick={() => { window.location = `mailto:${lead.email}` }} style={{
                                                        cursor: "pointer"
                                                    }}>{lead.email}</div>
                                                    <div><a href={"tel:" + lead.phone} >{lead.phone}</a></div>
                                                    <div>{lead.data}</div>
                                                    <div>{new Date(parseInt(lead.date ? lead.date != null && lead.dateUpdated != null ? lead.date >= lead.dateUpdated ? lead.date : lead.dateUpdated : lead.date : lead.dateUpdated)).toLocaleDateString()}</div>
                                                    <div>
                                                        <select className="custom-select" defaultValue={lead.status} onChange={(event) => this.updateStatus(event, lead)} style={{
                                                            padding: "0.563rem",
                                                            backgroundColor: "#23c78a",
                                                            color: "white"
                                                        }}>
                                                            <option value="">Select Status</option>
                                                            <option value="First follow up">First follow up</option>
                                                            <option value="Second follow up">Second follow up</option>
                                                            <option value="Third follow up">Third follow up</option>
                                                            <option value="Bad lead">Bad lead</option>
                                                            <option value="Appointment created">Appointment created</option>
                                                        </select>
                                                    </div>
                                                    <div style={{ width: "9rem" }}> {(() => {
                                                        if (lead.comment === "") {
                                                            return (
                                                                <button className="btn-success font-roboto-light" onClick={() => this.toggleComment(lead)} style={{ margin: '0 auto', float: "right" }}>
                                                                    Comment
                                                                </button>
                                                            );
                                                        } else {
                                                            return <span onClick={() => this.toggleComment(lead)} style={{ cursor: "pointer" }}> {lead.comment}</span>;
                                                        }
                                                    })()} </div>
                                                </Tbody>
                                            );
                                        } else {
                                            return (
                                                <Tbody index={index} key={index}>
                                                    <div>{lead.firstName}{" "}{lead.lastName}</div>
                                                    <div onClick={() => { window.location = `mailto:${lead.email}` }} style={{
                                                        cursor: "pointer"
                                                    }}>{lead.email}</div>
                                                    <div><a href={"tel:" + lead.phone} >{lead.phone}</a></div>
                                                    {/* <div>{lead.affiliateTitle}</div> */}
                                                    <div>{unescape(lead.notes)}</div>
                                                    <div>{new Date(parseInt(lead.date ? lead.date != null && lead.dateUpdated != null ? lead.date >= lead.dateUpdated ? lead.date : lead.dateUpdated : lead.date : lead.dateUpdated)).toLocaleDateString()}</div>
                                                    <div>
                                                        <select className="custom-select" defaultValue={lead.status} onChange={(event) => this.updateStatus(event, lead)} style={{
                                                            padding: "0.563rem",
                                                            backgroundColor: "#23c78a",
                                                            color: "white"
                                                        }}>
                                                            <option value="">Select Status</option>
                                                            <option value="First follow up">First follow up</option>
                                                            <option value="Second follow up">Second follow up</option>
                                                            <option value="Third follow up">Third follow up</option>
                                                            <option value="Bad lead">Bad lead</option>
                                                            <option value="Appointment created">Appointment created</option>
                                                        </select>
                                                    </div>
                                                    <div style={{ width: "9rem" }}> {(() => {
                                                        if (lead.comment === "") {
                                                            return (
                                                                <button className="btn-success font-roboto-light" onClick={() => this.toggleComment(lead)} style={{ margin: '0 auto', float: "right" }}>
                                                                    Comment
                                                                </button>
                                                            );
                                                        } else {
                                                            return <span onClick={() => this.toggleComment(lead)} style={{ cursor: "pointer" }}> {lead.comment}</span>;
                                                        }
                                                    })()} </div>
                                                </Tbody>
                                            );
                                        }

                                    })}
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
                {state.openComment &&
                    <Modal open={state.openComment} closeModal={() => this.toggleComment()} session={this.props.session} style={{ width: '60%', borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0 }}>
                        <div>
                            <div className="column_12_12">
                                <style dangerouslySetInnerHTML={{ __html: `.popup-content .content { padding: 0px; }` }} />
                                <div className="clear" style={{ padding: 20, backgroundColor: '#f2f9f6', overflow: 'hidden' }}>
                                    <h4 className="header"> {state.selected_value.firstName}{" "}{state.selected_value.lastName} {" : "} {state.selected_value.affiliateTitle} <small style={{
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
                                                                <label>Write a comment : </label>
                                                                <textarea rows="6" className="message-area stretch-width" style={{ marginTop: "1rem" }} value={state.selected_value.comment} name="comment" onChange={event => this.handleChange("comment", event.target.value)} required>
                                                                </textarea>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="column column_12_12" style={{ padding: 5, paddingBottom: 10, backgroundColor: 'transparen' }}>
                                                        <button type="submit" className="btn-success font-roboto-light" style={{ margin: '0 5px' }}>
                                                            <span>Update Comment</span>
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