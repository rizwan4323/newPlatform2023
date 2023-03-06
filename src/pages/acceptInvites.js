import React from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import queryString from 'query-string';
import toastr from 'toastr';
const _points = require('../../Global_Values');

class AcceptInvites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            staffEmail: "",
            masterid: "",
            masterEmail: "",
            hasAccepted: false,
            verifiedInvite: true,
            staffCredentials: null
        }
    }

    componentDidMount() {
        console.log('compnen didmount');
        const values = queryString.parse(this.props.location.search);
        if (values.invites) {
            this.setState({
                staffEmail: values.sid,
                masterEmail: values.memail,
                masterid: values.mid
            })
            // were going to ask the user
            console.log(values);
            _points.customFetch(_points.clientUrl + '/graphql', "POST", {
                "query": `
                   {
                    checkInvites(email: "${values.sid}"){                       
                       masterIds
                       id
                       email
                     }
                   }
                `
            }, result => {
                const userInvite = result;
                console.log("the fetch ", result);
                if (userInvite.data.checkInvites === null) {
                    // not a user must register first !
                    console.log("not a user must register first !");
                    this.props.history.push(`/signup?invites=true&email=${values.sid}&accept_link=${encodeURIComponent(`${_points.clientUrl}/accept-invite?invites=true&mid=${values.mid}&sid=${values.sid}&memail=${values.memail}`)}`);
                }
                else {
                    const user = userInvite.data.checkInvites;
                    const currentUser = this.props.session.getCurrentUser;
                    console.log(user, this.props.session);
                    if (currentUser === null) {
                        // console.log("// go to sign in with redirect to accept invite accept_link                        ")
                        this.props.history.push(`/signin?invites=true&email=${user.email}&accept_link=${encodeURIComponent(`${_points.clientUrl}/accept-invite?invites=true&mid=${values.mid}&sid=${values.sid}&memail=${values.memail}`)}`);
                    }
                    else {
                        if (user.email !== currentUser.email) {
                            // invalid invite                            
                            this.setState({
                                staffEmail: values.sid,
                                masterEmail: values.memail,
                                masterid: values.mid,
                                verifiedInvite: false
                            })
                        } else {
                            console.log('nasa else ', values.mid);
                            this.setState({
                                verifiedInvite: true,
                                hasAccepted: user.masterIds.includes(values.mid),
                                staffCredentials: user
                            })
                        }
                    }
                }
            });

        }
        /**
         * user exist match email if not match cannot accept invite
         * if user does not exist go to signup must be signed in before accept invite
         * if accepted and master already in list disable accept invitation
         */
    }

    acceptTheInvite() {
        if (this.state.staffCredentials === null) {
            toastr.options.timeOut = 2000;
            toastr.options.extendedTimeOut = 2500;
            toastr.clear();
            toastr.error("Something went wrong", "Error!");
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
        } else {
            _points.customFetch('/graphql', "POST", {
                query: `
                    mutation{
                        acceptInvitation(staffId: "${this.state.staffCredentials.id}", masterId: "${this.state.masterid}"){
                            id
                        }
                    }
                `
            }, result => {
                console.log('result accepted => ', result);
                toastr.options.timeOut = 2000;
                toastr.options.extendedTimeOut = 2500;
                toastr.clear();
                toastr.success("Invite Accepted Success", "Success!");
                toastr.options.timeOut = 0;
                toastr.options.extendedTimeOut = 0;
                this.props.history.push('/dashboard');
            });
        }
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "signUpPage" }}>
                <title>Accept Invite - Product List Genie</title>
            </Helmet>
        );
    }

    render() {

        return (
            <div className="center-vertical-parent funnel" style={{ height: 'auto' }}>
                {this.head()}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .sideBar, header, Footer {
                        display: none;
                    }
                    .container {
                        padding: 0;
                    }
                    body {
                        background-color: #262f36;
                        background-image: none;
                    }
                `}} />
                <div className="center-vertical" style={{ height: '100%', marginTop: "6rem" }}>
                    <div className="column column_4_12" style={{ backgroundColor: '#212a31', padding: 40, height: '100%' }} id="signup-form">
                        <div className="row-separator text-center">
                            <img src="https://productlistgenie.com/images/logo.png" width="200px" />
                        </div>
                        {this.state.verifiedInvite ? <div>
                            <div className="row-separator text-center">
                                <label className="font-questrial-light color-green" style={{ fontSize: '2em' }}>Accept This Invitation</label>
                            </div>
                            <br />
                            <br />
                            <div className="row-separator text-center">
                                <label className="font-questrial-light color-white" style={{ fontSize: '1em' }}><span style={{
                                    fontWeight: "bolder",
                                    textDecoration: "underline"
                                }}>{this.state.masterEmail}</span> has invited you to be his staff.</label>
                            </div>
                            <br />
                            <br />
                            <br />
                            {this.state.hasAccepted ? <button className="btn-success stretch-width" onClick={() => {
                                this.props.history.push('/dashboard');
                            }}> Already accepted the invitation </button> : <button className="btn-success stretch-width" onClick={() => {
                                this.acceptTheInvite();
                            }} >Accept Invitation</button>}
                        </div> : <div>
                                <br />
                                <br />
                                <div className="row-separator text-center">

                                    <label className="font-questrial-light color-green" style={{ fontSize: '2em' }}>This is invite might be expired or missing.</label>
                                </div>
                            </div>}
                    </div>
                </div>
            </div>

        );
    }
}

export default withRouter(AcceptInvites);