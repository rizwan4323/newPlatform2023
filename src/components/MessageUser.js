import React from 'react';
import toastr from 'toastr';
import withAuth from './../hoc/withAuth';
import ReactDOM from 'react-dom';
import Loading from '../components/loading';
import { SUBMIT_FULFILLMENT_CENTER_MESSAGE } from './../queries';
import { Query, Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import Popup from 'reactjs-popup';
import Modal from '../components/ModalComponent';
const points = require('../../Global_Values');

class MessageUser extends React.Component {
    constructor() {
        super();
        this.state = {
            text: ''
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
    
    handleOnChange(event){
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    submitMessage(submitMessage){
        var self = this;
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.clear();
        toastr.info("Loading please wait...","")
        submitMessage().then(async ({ data }) => {
            toastr.options.timeOut = 3000;
            toastr.options.extendedTimeOut = 2000;
            toastr.clear();
            toastr.info("Message Sent success.","Success")
            self.setState({
                text: ''
            }, () => {
                document.getElementById("open_close_message").click();
            })
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    render() {
        var state = this.state;
        var {userid} = this.props;

        return (
            <Popup
                trigger={<span id="open_close_message" className="fas fa-envelope clickable" />}
                position="bottom center"
                on="click" className="points-tooltip" style={{ width: 'fit-content !important', minWidth: 'fit-content' }}>
                <div className="messaging-center" style={{ margin: 10 }}>
                    <h3 className="text-center">Compose Message</h3>
                    <textarea rows="6" className="message-area stretch-width" value={state.text} name="text" onChange={event => this.handleOnChange(event)}>
                    </textarea>
                    <Mutation
                        mutation={SUBMIT_FULFILLMENT_CENTER_MESSAGE}
                        variables={{
                            id: userid,
                            text: state.text,
                            from: 'Admin',
                            isFromQuote: false
                        }}
                    >
                        {(submitMessage, { data, loading, error }) => {
                            return (
                                <div className="text-center" style={{marginTop: 10}}>
                                    <button className="btn" onClick={() => this.submitMessage(submitMessage)} disabled={loading}>Submit</button>
                                </div>
                            );
                        }}
                    </Mutation>
                </div>
            </Popup>
        );
    }
}

export default MessageUser;