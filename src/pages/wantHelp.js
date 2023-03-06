import React from 'react';
import withAuth from './../hoc/withAuth';
import { Helmet } from 'react-helmet';
import toastr from 'toastr';
import { Mutation } from 'react-apollo';
import { REQUEST_HELP } from '../queries';
const points = require('../../Global_Values');

class WantHelp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fbLink: '',
            requestMessage: ''
        }
    }

    componentDidMount(){
        toastr.options = {
            "progressBar": true,
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut": 3000,
            "extendedTimeOut": 2000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        if(this.props.session.getCurrentUser.fb_link){
            this.setState({fbLink: this.props.session.getCurrentUser.fb_link})
        }
        const script = document.createElement("script")
        script.src = "https://widget.manychat.com/219509955367793.js"
        script.async = true;
        script.id = "manychat";
        document.head.appendChild(script);
    }
    
    handleChange(event){
        this.setState({
            fbLink: event.target.value
        })
    }

    handleRequestMessage(event){
        this.setState({
            requestMessage: event.target.value
        })
    }

    saveUrl(requestHelp){
        if(this.state.requestMessage && this.state.fbLink){
            if(points.fb_regex.test(this.state.fbLink)){
                toastr.clear();
                this.updateFBLink(requestHelp);
            } else {
                toastr.clear();
                toastr.warning("Make sure to enter a valid facebook profile link","Invalid FB Link");
            }
        }
    }

    updateFBLink(requestHelp){
        var id = this.props.session.getCurrentUser.id;
        var payload = {"query":`mutation{\n linkFB(id:\"${id}\" fblink: \"${this.state.fbLink}\"){\n    id\n  }}`,"variables":null}
        var self = this;
        fetch(points.clientUrl+'/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(ress => ress.json())
        .then(response => {
            self.requestMessage(requestHelp);
        });
    }

    requestMessage(requestHelp){
        if(this.state.requestMessage && this.state.fbLink){
            requestHelp().then(async ({ data }) => {
                toastr.clear();
                toastr.success('You have successfully send your message.', 'Wish Granted!');
                this.props.refetch();
            }).catch(error => {
                this.setState({
                    error: error.graphQLErrors.map(x => x.message)
                })
                console.error("ERR =>", error.graphQLErrors.map(x => x.message));
            });
        } else {
            toastr.clear();
            toastr.warning("Request Message or FB Link Cannot be empty","Message & FB Link Required");
        }
    }

    head() {
        return (
            <Helmet>
                <title>Want Help - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const currentUser = this.props.session.getCurrentUser;
        return (
            <div className="page-container">
                {this.head()}
                <div className="text-center">
                    <div className="column column_6_12" style={{width: '100%'}}>
                        <iframe src="https://player.vimeo.com/video/309024673" width="650" height="315" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                    </div>
                </div>
                <div className="text-center clear" style={{paddingTop: 20}}>
                    <h1 style={{margin: 0}}>Get a Coach to help you</h1>
                    <h3>(Got technical issue? Click Chat with us below)</h3> <br/>
                </div>
                <div style={{display: 'flex'}}>
                    <div className="mcwidget-embed" data-widget-id="5185756" style={{margin: '0 auto'}} />
                </div>
                {/* <div className="form_wrap">
                    <div className="form_row">
                        <div className="form_item" style={{width: '50%', margin: '0 auto'}}>
                            <label>Facebook Profile URL</label>
                            <div className="form_input">
                                <br />
                                <input type="text" value={this.state.fbLink} onChange={this.handleChange.bind(this)} placeholder="https://www.facebook.com/someone.username" />
                                <span className="bottom_border"></span>
                            </div>
                        </div>
                    </div>

                    <Mutation
                        mutation={REQUEST_HELP}
                        variables={{
                            id: currentUser.id,
                            message: this.state.requestMessage,
                            read: false
                        }}>
                        {(requestHelp, { data, loading, error }) => {
                            return (
                                <div className="form_row">
                                    <div className="form_item" style={{width: '50%', margin: '0 auto'}}>
                                        <label>What do you need help with?</label>
                                        <div className="form_input">
                                            <br />
                                            <textarea rows="10" className="stretch-width" value={this.state.requestMessage} onChange={this.handleRequestMessage.bind(this)} style={{fontSize: 18, padding:20}} />
                                        </div> <br />
                                        <div className="text-center form_buttons">
                                            <button className="btn" onClick={() => this.saveUrl(requestHelp)} disabled={loading}>Request a Genie</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    </Mutation>
                </div> */}
            </div>
        );
    }
}


export default withAuth(session => session && session.getCurrentUser)(WantHelp);