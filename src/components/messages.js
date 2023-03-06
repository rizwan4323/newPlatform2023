import React from 'react';
import toastr from 'toastr';
import moment from 'moment';
import { Query, Mutation } from 'react-apollo';
import { SEND_MESSAGE, GET_MESSAGES, MESSAGE_QUICK_ACTION, GET_USER_BY_ID, GET_SEARCHED_USERS } from './../queries';
import SearchField from './searchField';
import Loading from './loading';
import Tooltip from './tooltip';
import Modal from './ModalComponent';
import Form from './form';
import Input from './input';
const jwt = require('jsonwebtoken');
import * as Cookies from 'es-cookie';
const points = require('../../Global_Values');

let initialize_selected_user = {
    message: "",
    selected_id: "",
    selected_user_id: "",
    selected_user_name: ""
}

let initialize_new_message = {
    create_new_message: false,
    new_message_show_result: false,
    new_message_search: "",
    new_message_receiver_id: "",
    new_message: ""
}

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.inactiveTimer = null;
        this.user_refetch = null;
        this.message_refetch = null;
        this.state = {
            is_inactive: false,
            search_user: "",
            temp_users: [],
            temp_messages: [],
            input_computation: "",
            ...initialize_selected_user,
            ...initialize_new_message
        };
    }

    componentWillMount() {
        if (this.props.selected) this.selectThisUser(this.props.selected.id, this.props.selected.user_id, this.props.selected.user_name);
    }

    componentDidMount() {
        this.checkIfUserIsActive();
    }

    componentWillUnmount() {
        this.refetchConversation();
        document.onmousemove = null; // remove inactive timer
        document.onkeypress = null; // remove inactive timer
        clearTimeout(this.inactiveTimer); // remove inactive timer
    }

    selectThisUser(id, user_id, user_name) {
        this.setState({ selected_id: id || "", selected_user_id: user_id || "", selected_user_name: user_name || "" }, () => this.refetchConversation());
    }

    getLoginBackToken() {
        const { id, privilege, firstName, email, user_session_cookie } = this.props.session.getCurrentUser;
        var token = jwt.sign({ id, privilege, firstName, email }, "23842340239480238420348394", { expiresIn: "24hr" });
        localStorage.setItem("temp_token", token);
        localStorage.setItem("temp_" + points.cookie_name, user_session_cookie);
        localStorage.setItem("temp_redirect", window.location.href);
    }

    loginAsAnonymous(userObject, rdrPath) {
        this.getLoginBackToken();
        const { id, privilege, firstName, email, user_session_cookie } = userObject;
        var token = jwt.sign({ id, privilege, firstName, email }, "23842340239480238420348394", { expiresIn: "24hr" });
        // Start once login cookie
        Cookies.remove(points.cookie_name);
        Cookies.set(points.cookie_name, user_session_cookie);
        // End once login cookie
        Cookies.set('token', token);
        localStorage.setItem(points.plg_domain_secret, true); // the login as anonymous flag
        if (rdrPath) window.location.href = rdrPath;
        else window.location.href = "/";
    }

    checkIfUserIsActive() {
        let self = this;
        document.onmousemove = resetTimer;
        document.onkeypress = resetTimer;
        function logout() {
            if (!self.state.is_inactive) self.setState({ is_inactive: true });
        }
        function resetTimer() {
            clearTimeout(this.inactiveTimer);
            this.inactiveTimer = setTimeout(logout, 60000 * 3);
            if (self.state.is_inactive) self.setState({ is_inactive: false });
        }
    }

    handleInputChange(event) {
        /**
            The COD cost for this product in UAE is approximately $27.69 we recommend that you sell it for $47 or greater.
            In KSA, the COD cost is approximately $55 and we recommend you sell it for $75 or greater. 
         */        
        this.setState({input_computation : event.target.value});
    }

    refetchConversation() {
        if (this.user_refetch) this.user_refetch();
        if (this.message_refetch) this.message_refetch();
    }

    render() {
        let state = this.state;
        let props = this.props;
        let refetchNotificationCount = props.refetchNotificationCount;
        let currentUser = props.session.getCurrentUser;
        let is_admin = currentUser.privilege === 10; // User Privilege
        return (
            <div className="conversation" style={{ height: '76vh' }}>
                <div className="column column_5_12">
                    <div className="search-user">
                        <SearchField
                            name="search_user"
                            value={state.searchField}
                            placeHolder="Search user message"
                            tooltip="Search by Email, First Name or Last Name"
                            containerClassName="stretch-to-mobile"
                            onSubmit={value => this.setState({ ...initialize_selected_user, search_user: value })}
                        />
                    </div>
                    <div className="user-list">
                        <Query query={GET_MESSAGES(`{ id sender_id user_id name picture unread_count privilege last_message last_message_date }`)} variables={{ user_id: currentUser.id, view_list: true, search_user: state.search_user, is_admin }} notifyOnNetworkStatusChange onCompleted={data => {
                            this.setState({ temp_users: data.getMessages });
                            // start clicking the message
                            let params = points.getURLParameters(window.location.href);
                            if (params && params.notifid) {
                                let conv = document.getElementById(params.notifid);
                                if (conv) conv.click();
                                window.history.pushState({}, document.title, "/dashboard");
                            }
                            // end clicking the message
                        }}>
                            {({ data, loading, refetch, error }) => {
                                this.user_refetch = refetch;
                                if (loading && state.temp_users.length === 0) return <div className="center-vertical"><Loading width={150} height={150} /></div>;
                                else if (error) {
                                    return (
                                        <div className="center-vertical text-center">
                                            <img src="/assets/graphics/no-result.svg" style={{ height: '30vh' }} />
                                            <label className="font-roboto-bold">An error has occurred please try again later...</label>
                                        </div>
                                    );
                                } else if (data.getMessages.length === 0 && state.temp_users.length == 0) {
                                    return (
                                        <div className="center-vertical text-center">
                                            <img src="/assets/graphics/no-result.svg" style={{ height: '30vh' }} />
                                            <label className="font-roboto-bold">No message found</label>
                                        </div>
                                    );
                                } else {
                                    let temp_users = [];
                                    if (data.getMessages.length === 0) temp_users = state.temp_users;
                                    else temp_users = data.getMessages;
                                    return temp_users.map((message, i) => {
                                        let img_url = message.picture ? "/user-uploads/" + message.picture : "/assets/graphics/abstract_patterns/texture.jpg";
                                        return (
                                            <div id={message.id} className={"product-card display-inline " + (state.selected_id === message.id ? "merchant-active" : "")} onClick={() => this.selectThisUser(message.id, message.user_id, message.name)} key={i}>
                                                <div style={{ position: "relative" }}>
                                                    <img className="img-profile" src={img_url} />
                                                    {is_admin && <span className="notification-count color-white" style={{ position: "absolute", top: "unset", left: "unset", bottom: 2, right: -5, backgroundColor: "#1ac594" }}>{message.privilege}</span>}
                                                </div>
                                                <div className="user-info one-line-ellipsis">
                                                    <label className="header-medium-bold cursor-pointer one-line-ellipsis">{points.capitalizeWord(message.name)}</label>
                                                    <label className="cursor-pointer">{message.last_message}</label>
                                                </div>
                                                <div className="font-small text-right">
                                                    <label className="time-ago">{moment(parseInt(message.last_message_date)).startOf('second').fromNow()}</label>
                                                    {message.unread_count ? <label className="color-white badge-error">{message.unread_count}</label> : <label>&nbsp;</label>}
                                                </div>
                                            </div>
                                        );
                                    });
                                }
                            }}
                        </Query>
                        {is_admin &&
                            <button className="btn-success data-title" data-title="Create new message" style={{ borderRadius: "50%", position: "absolute", bottom: 10, margin: 0, width: 50, height: 50 }} onClick={() => this.setState({ create_new_message: true })}>
                                <span className="fas fa-plus" />
                            </button>
                        }
                        {/* <button className="btn-success data-title" data-title="Create new message" style={{ borderRadius: "50%", position: "absolute", bottom: 10, margin: 0, width: 50, height: 50 }} onClick={() => this.setState({ create_new_message: true })}>
                            <span className="fas fa-plus" />
                        </button> */}
                    </div>
                </div>
                {state.selected_id ?
                    <div className="column column_7_12">
                        <div className="message-content">
                            <div className="content-header display-inline">
                                <label className="header-medium-bold one-line-ellipsis sender-name">{points.capitalizeWord(state.selected_user_name)}</label>
                                <div className="text-right sender-option">
                                    <Tooltip trigger={<span className="fas fa-ellipsis-h color-orange cursor-pointer" />} position="bottom right" on="click" arrow>
                                        <ul className="item-list">
                                            <Mutation mutation={MESSAGE_QUICK_ACTION} variables={{ id: state.selected_id, user_id: currentUser.id, action: "unread" }}>
                                                {(messageQuickAction, { data, loading, error }) => {
                                                    return <li onClick={() => points.executeMutation(messageQuickAction, toastr, () => {
                                                        this.setState(initialize_selected_user);
                                                        this.refetchConversation();
                                                        if (refetchNotificationCount) refetchNotificationCount();
                                                    })}>Mark as unread</li>;
                                                }}
                                            </Mutation>
                                            {currentUser.access_tags.includes("god") &&
                                                <Tooltip trigger={<li id={"remove_" + state.selected_id}>Delete conversation</li>} position="left top" on="click" arrow>
                                                    <div style={{ padding: 2 }}>
                                                        <h3 className="text-center">Are you sure?</h3>
                                                        <label>This will also remove the message for the other user</label>
                                                        <div className="display-inline">
                                                            <Mutation mutation={MESSAGE_QUICK_ACTION} variables={{ id: state.selected_id, action: "removed" }}>
                                                                {(messageQuickAction, { data, loading, error }) => {
                                                                    return <button className="btn-success" onClick={() => points.executeMutation(messageQuickAction, toastr, () => {
                                                                        this.setState(initialize_selected_user);
                                                                        this.user_refetch();
                                                                    })} style={{ width: '49%', margin: '0 1% 0 0' }}>Yes</button>
                                                                }}
                                                            </Mutation>
                                                            <button className="btn-danger" onClick={() => document.getElementById("remove_" + state.selected_id).click()} style={{ width: '50%', margin: '0 0 0 1%' }}>No</button>
                                                        </div>
                                                    </div>
                                                </Tooltip>
                                            }
                                            {(() => {
                                                if (!is_admin) {
                                                    return null;
                                                } else if (!state.selected_user_id) {
                                                    return <li style={{ fontSize: 12 }}>Login as anonymous (unavailable)</li>;
                                                } else {
                                                    return (
                                                        <Query query={GET_USER_BY_ID(`{ id privilege firstName email user_session_cookie }`)} variables={{ id: state.selected_user_id }} notifyOnNetworkStatusChange>
                                                            {({ data, loading, refetch, error }) => {
                                                                if (loading) return <Loading width={30} height={30} />;
                                                                else if (error) return <li style={{ fontSize: 12 }}>Login as anonymous (unavailable)</li>
                                                                else {
                                                                    return (
                                                                        <Tooltip trigger={<li id={"login_as_" + state.selected_id}>Login as anonymous</li>} position="left top" on="click" arrow>
                                                                            <div style={{ padding: 2 }}>
                                                                                <h3 className="text-center">Are you sure?</h3>
                                                                                <div className="display-inline">
                                                                                    <button className="btn-success" onClick={() => this.loginAsAnonymous(data.getUserById)} style={{ width: '49%', margin: '0 1% 0 0' }}>Yes</button>
                                                                                    <button className="btn-danger" onClick={() => document.getElementById("login_as_" + state.selected_id).click()} style={{ width: '50%', margin: '0 0 0 1%' }}>No</button>
                                                                                </div>
                                                                            </div>
                                                                        </Tooltip>
                                                                    );
                                                                }
                                                            }}
                                                        </Query>
                                                    );
                                                }
                                            })()}
                                        </ul>
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="content-body">
                                <Mutation mutation={MESSAGE_QUICK_ACTION} variables={{ id: state.selected_id, user_id: currentUser.id, action: "read" }}>
                                    {(messageQuickAction, { data, loading, error }) => {
                                        return (
                                            <Query query={GET_MESSAGES(`{ picture unread_count sender_id messages { id position date message replier_id replier_name additional_data { funnel_id funnel_name page_id page_name product_link approved } } }`)} variables={{ id: state.selected_id, user_id: currentUser.id, is_admin }} notifyOnNetworkStatusChange pollInterval={state.is_inactive ? 0 : 3000} onCompleted={data => {
                                                if (data.getMessages.length !== 0) {
                                                    this.setState({ temp_messages: data.getMessages[0].messages });
                                                    this.user_refetch();
                                                    if (data.getMessages[0].unread_count) {
                                                        points.executeMutation(messageQuickAction, toastr, () => {
                                                            if (refetchNotificationCount) refetchNotificationCount();
                                                            if (this.user_refetch) this.user_refetch();
                                                        });
                                                    }
                                                }
                                            }}>
                                                {({ data, loading, refetch, error }) => {
                                                    this.message_refetch = refetch;
                                                    if (loading && state.temp_messages.length === 0) return <div className="center-vertical"><Loading width={150} height={150} /></div>;
                                                    else if (error) {
                                                        return (
                                                            <div className="center-vertical text-center">
                                                                <img src="/assets/graphics/no-result.svg" style={{ height: '30vh' }} />
                                                                <label className="font-roboto-bold">An error has occurred please try again later...</label>
                                                            </div>
                                                        )
                                                    } else {
                                                        if (!data.getMessages) return null;
                                                        let temp_messages = [], result = data.getMessages[0];
                                                        if (result.messages.length === 0) temp_messages = state.temp_messages;
                                                        else temp_messages = result.messages;
                                                        let reverse = JSON.parse(JSON.stringify(temp_messages)).reverse();
                                                        return reverse.map((message, i) => {
                                                            let img_url = result.picture ? "/user-uploads/" + result.picture : "/assets/graphics/abstract_patterns/texture.jpg";
                                                            let is_my_chat = message.position === "right";
                                                            let is_not_existed = message.additional_data && message.additional_data.funnel_id && !message.additional_data.funnel_name;
                                                            if (is_my_chat) {
                                                                if (message.additional_data && message.additional_data.funnel_id) { // my cod request
                                                                    if (is_not_existed) {
                                                                        return (
                                                                            <div className="text-right" key={i}>
                                                                                <div className="my-message float-right">
                                                                                    <label className="header-medium-bold">Funnel is not existing anymore</label>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                    return (
                                                                        <div className="text-right" key={i}>
                                                                            <div className="my-message float-right">
                                                                                {message.additional_data.approved && <span className="float-right color-white fas fa-check" style={{ padding: 5, borderRadius: "50%", border: "2px solid #fff" }} />}
                                                                                <label className="header-medium-bold row-separator">{message.additional_data.funnel_name}</label>
                                                                                <label className="header-medium-bold row-separator">{message.additional_data.page_name}</label>
                                                                                <button className="btn-warning" onClick={() => window.open(message.additional_data.product_link, "_blank")}>View Product</button>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                } else { // my normal chat
                                                                    let msg = points.formatMessage(message.message);
                                                                    return (
                                                                        <div className="text-right" key={i}>
                                                                            <div className="my-message float-right">
                                                                                <label dangerouslySetInnerHTML={{ __html: msg }} />
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                            } else {
                                                                if (message.additional_data && message.additional_data.funnel_id) { // someone cod request
                                                                    if (is_not_existed) {
                                                                        return (
                                                                            <div className="sender-message" key={i}>
                                                                                <img className="img-profile" src={img_url} />
                                                                                <div className="sender-message-content">
                                                                                    <label className="header-medium-bold">Funnel is not existing anymore</label>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                    return (
                                                                        <div className="sender-message" key={i}>
                                                                            <img className="img-profile" src={img_url} />
                                                                            <div className="sender-message-content">
                                                                                <label className="header-medium-bold row-separator">{message.additional_data.funnel_name}</label>
                                                                                <label className="header-medium-bold row-separator">{message.additional_data.page_name}</label>
                                                                                <button className="btn-success" onClick={() => window.open(message.additional_data.product_link, "_blank")}>View Product</button>
                                                                                <Tooltip trigger={<button id={"view_funnel_" + i} className="btn-warning">View Funnel</button>} position="left bottom" on="click" style={{ width: 260 }} arrow>
                                                                                    <div className="color-black" style={{ padding: 2 }}>
                                                                                        <h3 className="text-center">Are you sure?</h3>
                                                                                        <label>You will be Login as anonymous in order to view this funnel</label>
                                                                                        <div className="display-inline">
                                                                                            <Query query={GET_USER_BY_ID(`{ id privilege firstName email user_session_cookie }`)} variables={{ id: state.selected_user_id }} notifyOnNetworkStatusChange>
                                                                                                {({ data, loading, refetch, error }) => {
                                                                                                    if (loading) return <button className="btn-success" style={{ width: '49%', marginRight: '1%' }} disabled>Yes</button>;
                                                                                                    else if (error) return <button className="btn-success" style={{ width: '49%', marginRight: '1%' }} disabled>Yes</button>;
                                                                                                    return <button className="btn-success" onClick={() => this.loginAsAnonymous(data.getUserById, "/funnel-genie-pages-list/" + message.additional_data.funnel_id)} style={{ width: '49%', margin: '0 1% 0 0' }}>Yes</button>;
                                                                                                }}
                                                                                            </Query>
                                                                                            <button className="btn-danger" onClick={() => document.getElementById("view_funnel_" + i).click()} style={{ width: '50%', margin: '0 0 0 1%' }}>No</button>
                                                                                        </div>
                                                                                    </div>
                                                                                </Tooltip>
                                                                                {/* TODO :: Tooltip for input to pass in the message */}
                                                                                <Tooltip trigger={<button id={"message_" + i} className="btn-success" disabled={message.additional_data.approved}>{message.additional_data.approved ? "Approved" : "Click to Approve"}</button>} position="left bottom" on="click" style={{ width: 260 }} arrow>
                                                                                    <div style={{ padding: 2 }}>
                                                                                        <h3 className="text-center">Are you sure?</h3>
                                                                                        <label>You must add the VARIANT ID of the PLG Product in the customer funnel before proceeding</label>
                                                                                        <div className="display-inline" style={{ marginTop: "1rem", marginBottom: "1rem", }}>
                                                                                            <div className="column column_12_12">
                                                                                                <div className="form_row">
                                                                                                    {/* <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>
                                                                                                        Selling Price
                                                                                                </label> */}
                                                                                                    {/* value={state.funnel_name}   onChange={event => this.handleOnChange(event)} */}
                                                                                                    <input type="number" className="font-roboto-light"
                                                                                                        onChange={event => this.handleInputChange(event)}
                                                                                                        name="funnel_name" placeholder="Selling Price"
                                                                                                        style={{ marginTop: 10, fontSize: '0.875em' }} />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="display-inline">
                                                                                            <Mutation mutation={MESSAGE_QUICK_ACTION} variables={{ id: state.selected_id, input_computation: state.input_computation ,action: "approved", funnel_id: message.additional_data.funnel_id, page_id: message.additional_data.page_id }} key={i}>
                                                                                                {(messageQuickAction, { data, loading, error }) => {
                                                                                                    return <button className="btn-success" onClick={() => points.executeMutation(messageQuickAction, toastr, () => refetch())} style={{ width: '49%', marginRight: '1%',display: (state.input_computation.trim().length != 0 && state.input_computation != 0) ? 'unset' : "none" }} disabled={loading}>Yes</button>
                                                                                                }}
                                                                                            </Mutation>
                                                                                            <button className="btn-danger" onClick={() => document.getElementById("message_" + i).click()} style={{ width: '50%', marginLeft: '1%' }}>No</button>
                                                                                        </div>
                                                                                    </div>
                                                                                </Tooltip>
                                                                            </div>
                                                                            <div className="font-small">
                                                                                <label className="time-ago">{moment(parseInt(message.date)).startOf('second').fromNow()}</label>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                } else { // someone normal chat
                                                                    let msg = points.formatMessage(message.message);
                                                                    return (
                                                                        <div className="sender-message" key={i}>
                                                                            {message.replier_name && <div className="img-profile color-white display-inline" style={{ margin: 0, backgroundColor: "#ff8c58" }}><span style={{ margin: "0 auto" }}>{message.replier_name[0].toUpperCase()}</span></div>}
                                                                            {!message.replier_name && <img className="img-profile" src={img_url} />}
                                                                            <div className="sender-message-content">
                                                                                <label dangerouslySetInnerHTML={{ __html: msg }} />
                                                                            </div>
                                                                            <div className="font-small">
                                                                                <label className="time-ago">{moment(parseInt(message.date)).startOf('second').fromNow()}</label>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                            }
                                                        });
                                                    }
                                                }}
                                            </Query>
                                        );
                                    }}
                                </Mutation>
                            </div>
                        </div>
                        <div className="message-container"> {/* Pag Send nito deretso sa notification ng user */}
                            <Mutation mutation={SEND_MESSAGE} variables={{ id: state.selected_id, sender_id: state.selected_user_id, replier_id: currentUser.id, message: state.message }}>
                                {(sendMessage, { data, loading, error }) => {
                                    return (
                                        <Form submitText="Send" submitClassName="column column_3_12" disabled={loading} onSubmit={() => {
                                            points.toastrPrompt(toastr, "info", "Sending...", "Please wait");
                                            points.executeMutation(sendMessage, toastr, () => {
                                                this.refetchConversation();
                                                this.setState({ message: "" });
                                            });
                                        }}>
                                            <div className="column column_9_12">
                                                <textarea rows="6" value={state.message} placeholder="Type a message" onChange={event => this.setState({ message: event.target.value })} onKeyDown={event => {
                                                    points.enterToProceed(event, () => {
                                                        event.preventDefault();
                                                        let value = event.target.value.trim();
                                                        if (value) event.target.parentNode.parentNode.querySelector("[type=submit]").click();
                                                        return false;
                                                    })
                                                }} required />
                                            </div>
                                            {/* <Input className="column column_9_12" name="message" value={state.message} placeholder="Type a message" onChange={input => this.setState({ [input.name]: input.value })} hasPoll required /> */}
                                        </Form>
                                    );
                                }}
                            </Mutation>
                        </div>
                    </div>
                    : <div className="column column_7_12 center-vertical idle" />}
                <div className="clear"></div>
                {state.create_new_message &&
                    <Modal open={state.create_new_message} closeModal={() => this.setState({ create_new_message: false })} style={{ borderTop: "5px solid #23c78a", borderRadius: 10, padding: 0, width: "30%", height: 400 }}>
                        <div className="funnel">
                            <style dangerouslySetInnerHTML={{ __html: `.popup-content .content {padding: 0px;}` }} />
                            <div className="modal-header">
                                <h4 className="header">New Message</h4>
                            </div>
                            <div className="page-container">
                                <div className="row-separator" style={{ position: "relative" }}>
                                    <SearchField
                                        name="new_message_search"
                                        value={state.new_message_search}
                                        placeHolder="Recipient"
                                        tooltip="Search by Email, First Name or Last Name"
                                        tooltipLocation="top center"
                                        containerClassName="stretch-width"
                                        onSubmit={value => this.setState({ new_message_search: value, new_message_show_result: true })}
                                    />
                                    {state.new_message_show_result &&
                                        <ul className="item-list-float stretch-width">
                                            <Query query={GET_SEARCHED_USERS(`{ id firstName lastName }`)} variables={{ search: state.new_message_search, limit: 5 }} notifyOnNetworkStatusChange>
                                                {({ data, loading, refetch, error }) => {
                                                    if (loading) return <li><Loading width={30} height={30} /></li>;
                                                    else if (error) return <li>An error has occurred please try again</li>;
                                                    else if (data.getAllUsers.length === 0) return <li>No User Found</li>;
                                                    return data.getAllUsers.map((user, i) => {
                                                        let name = points.capitalizeWord(user.firstName + " " + user.lastName);
                                                        return <li onClick={() => this.setState({ new_message_search: name, new_message_receiver_id: user.id, new_message_show_result: false })} key={i}>{name}</li>;
                                                    });
                                                }}
                                            </Query>
                                        </ul>
                                    }
                                </div>
                                <Mutation mutation={SEND_MESSAGE} variables={{ sender_id: currentUser.id, receiver_id: state.new_message_receiver_id, message: state.new_message }}>
                                    {(sendMessage, { data, loading, error }) => {
                                        return (
                                            <Form submitText="Send Message" disabled={!state.new_message_receiver_id || loading} onSubmit={() => {
                                                points.toastrPrompt(toastr, "info", "Sending...", "Please wait");
                                                points.executeMutation(sendMessage, toastr, () => {
                                                    points.toastrPrompt(toastr, "success", "Success");
                                                    this.setState(initialize_new_message, () => this.refetchConversation());
                                                })
                                            }}>
                                                <textarea className="row-separator" rows="8" value={state.new_message} placeholder="Type a message" onChange={event => this.setState({ new_message: event.target.value })} required />
                                            </Form>
                                        );
                                    }}
                                </Mutation>
                            </div>
                        </div>
                    </Modal>
                }
            </div>
        );
    }
}

export default Messages;