import React from 'react';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
import { Mutation } from 'react-apollo';
import { PUSH_NOTIFICATION } from './../queries';
import CKEditor from 'react-ckeditor-wrapper';
import toastr from 'toastr';

class CreateNotification extends React.Component {
    constructor() {
        super();
        this.state = {
            toPrivilege: '',
            type: 'warning',
            message: ''
        }
    }

    componentDidMount(){
        toastr.options = {
            "progressBar": true,
            "closeButton": false,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut":5000,
            "extendedTimeOut":2000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    }

    handleTypeChange(type){
        type = type.target.value
        this.setState({
            type: type
        })
    }

    handleToPrivilegeChange(toPrivilege){
        toPrivilege = toPrivilege.target.value
        this.setState({
            toPrivilege: toPrivilege
        })
    }

    handleEditorChange(message){
        this.setState({
            message: message
        })
    }

    pushNotification(event, pushNotification){
        if(this.state.message){
            pushNotification().then(async ({data}) => {
                toastr.clear()
                toastr.success("Notification has been send successfully!","Success!");
                this.setState({
                    message: ''
                })
            }).catch(error => {
                console.error("ERR =>", error);
            });
        } else {
            toastr.clear()
            toastr.warning("Message field cannot be empty!","Message Required!");
        }
    }

    appendThis(str){
        this.setState({
            message: this.state.message.substring(0, this.state.message.lastIndexOf('</p>')) + " " + str
        });
    }

    head() {
        return (
            <Helmet>
                <title>Create Notification - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        return (
            <div className="page-container">
                {this.head()}
                <div className="text-center">
                    <h2>Create Notification</h2>
                </div>

                <div className="form_wrap">
                    <div className="form_row">
                        <div className="column column_3_12">
                            <div className="product-card">
                                <div className="product-details">
                                    <div className="form_item">
                                        <div className="form_input">
                                            <label>Send to: </label>
                                            <select value={this.state.toPrivilege} onChange={this.handleToPrivilegeChange.bind(this)} className="dropbtn drp stretch-width" style={{backgroundColor: 'transparent'}}>
                                                <option value="">All</option>
                                                <option value="0">Free User (LVL: 0)</option>
                                                <option value="1">Trial User (LVL: 1)</option>
                                                <option value="2">Basic User (LVL: 2)</option>
                                                <option value="3">Full User (LVL: 3)</option>
                                                <option value="4">VIP User (LVL: 4)</option>
                                                <option value="5">Sales Person (LVL: 5)</option>
                                                <option value="10">Admins</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column column_3_12">
                            <div className="product-card">
                                <div className="product-details">
                                    <div className="form_item">
                                        <div className="form_input">
                                            <label>Type: </label>
                                            <select value={this.state.type} onChange={this.handleTypeChange.bind(this)} className="dropbtn drp stretch-width" style={{backgroundColor: 'transparent'}}>
                                                <option value="warning">Warning</option>
                                                <option value="info">Information</option>
                                                {/* <option value="sticky">Sticky Notification</option> */}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column column_12_12">
                            <div className="product-card">
                                <div className="product-details">
                                    <div className="form_item">
                                        <div className="form_input">
                                            <label>Message:</label> <br/>
                                            <label>Template: <span className="clickable" onClick={() => this.appendThis('[FirstName]')}>[FirstName]</span>, <span className="clickable" onClick={() => this.appendThis('[LastName]')}>[LastName]</span></label> <br/>
                                            <br/>
                                            <CKEditor
                                                value={this.state.message}
                                                onChange={this.handleEditorChange.bind(this)}
                                                config={{ extraAllowedContent: 'div(*); p(*); strong(*);' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form_buttons clear text-right">
                            <br/>
                            <Mutation
                                mutation={PUSH_NOTIFICATION}
                                variables={{
                                    sendTo: this.state.toPrivilege,
                                    type: this.state.type,
                                    message: this.state.message
                                }}>

                                {(pushNotification, { data, loading, error }) => {
                                    return <button className="btn" onClick={event => this.pushNotification(event, pushNotification)}>Send</button>;
                                }}
                            </Mutation>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(CreateNotification);