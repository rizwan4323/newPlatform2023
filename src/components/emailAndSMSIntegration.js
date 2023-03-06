import React from 'react';
import { GET_EMAIL_SMS_INTEGRATION, SAVE_EMAIL_SMS_INTEGRATION, GET_FUNNEL_EMAIL_SEQUENCEV1, SAVE_FUNNEL_EMAIL_SEQUENCEV1 } from './../queries';
import { Query, Mutation } from 'react-apollo';
import Loading from '../components/loading';
import withSession from './../hoc/withSession';
import CKEditor from 'react-ckeditor-wrapper';
import SelectTag from '../components/selectTag';
import Modal from '../components/ModalComponent';
import toastr from 'toastr';
const points = require('../../Global_Values');

var initializePayload = {
    id: "",
    email_subject: "",
    messageID: "",
    editorValue: "",
    method: "abandonment",
    delay_number: "0",
    delay_word: "seconds",
}

class EmailAndSMSIntegration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'Email',
            addNew: false,
            showTemplate: false,

            // payload require
            ...initializePayload
        }
    }

    editContent(data, isOptimizeFunnel){
        if (isOptimizeFunnel) {
            this.setState({ ...initializePayload }, () => {
                if (data) {
                    var delay = this.separateNumberAndWord(data.delay);
                    this.setState({
                        id: data.id,
                        editorValue: data.editor_value,
                        email_subject: data.email_subject ? data.email_subject : "",
                        messageID: data.message_id,
                        method: data.method,
                        delay_number: delay.number,
                        delay_word: delay.word[delay.word.length - 1] != "s" ? delay.word + "s" : delay.word,
                    })
                }
            });
        } else {
            this.setState({ ...initializePayload }, () => {
                if (data) {
                    var delay = this.separateNumberAndWord(data.delay);
                    this.setState({
                        id: data.id,
                        editorValue: data.editorValue,
                        email_subject: data.emailSubject ? data.emailSubject : "",
                        messageID: data.messageID,
                        method: data.method,
                        delay_number: delay.number,
                        delay_word: delay.word[delay.word.length - 1] != "s" ? delay.word + "s" : delay.word,
                    })
                }
            });
        }
    }
    
    toggleCreateIntegration(data){
        this.setState({ addNew: !this.state.addNew, ...initializePayload })
    }

    addTemplate(template){
        var activeEditor = null;
        for(var x in CKEDITOR.instances){
            activeEditor = CKEDITOR.instances[x]
        }
        activeEditor.insertText(template)
    }

    handleEditorChange(value){
        this.setState({ editorValue: value })
    }

    handleOnChange(event){
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [name]: value
        })
    }

    singularize(number, string){
        if(string[string.length-1] != "s") string = string+"s";
        if(number <= 1) string = string.substring(0, string.length-1);
        return number+" "+string;
    }

    separateNumberAndWord(string){
        return {
            number: string.match(/\d+/) ? string.match(/\d+/).toString() : 0,
            word: string.match(/\s\w+/) ? string.match(/\s\w+/).toString().trim() : 'seconds',
        }
    }

    saveFunnelEmailAndSMSintegration(saveFunnelEmailAndSMSintegration, contentEdit){
        toastr.clear();
        toastr.info("Loading please wait...");
        saveFunnelEmailAndSMSintegration().then(({ data }) => {
            this.refetch();
            this.editContent();
            if(!contentEdit) this.toggleCreateIntegration();
            toastr.clear();
            toastr.success("Saved successfully","Success");
        }).catch(error => {
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "Please try again.");
        });
    }

    render() {
        const funnel_id = this.props.funnel_id;
        const isOptimizeFunnel = funnel_id ? true : false;
        const currentUser = this.props.session.getCurrentUser;
        const state = this.state;
        const funnelSource = this.props.funnelSource;
        if(isOptimizeFunnel){
            return(
                <div style={{height: '100%'}}>
                    <style dangerouslySetInnerHTML={{__html: `
                        .modal .content {
                            padding: 0;
                        }
                        .integration-active {
                            background-color: #28c686;
                            color; #fff;
                        }
                    `}} />
                    <div style={{padding: 20, backgroundColor: '#f2f9f6', overflow: 'hidden'}}>
                        <h4 className="header">Email & SMS Integration</h4>
                    </div>
                    {/* Content 1: Menu */}
                    <div className="column column_4_12" style={{height: '90%', padding: 0, borderLeft: '1px solid #e6e6e6', borderTop: '1px solid #e6e6e6'}}>
                        {/* Switch to email or SMS */}
                        <div>
                            <div className="column" style={{width: '50%', padding: 0, borderRight: '1px solid #e6e6e6', borderBottom: '1px solid #e6e6e6'}}>
                                <button className={"stretch-width text-center"+(state.activeTab == "Email" ? " btn-success" : "")} onClick={() => {
                                    this.setState({activeTab: 'Email'});
                                    this.editContent();
                                }} style={{borderRadius: 0}}>
                                    Email
                                </button>
                            </div>
                            <div className="column" style={{width: '50%', padding: 0, borderLeft: '1px solid #e6e6e6', borderBottom: '1px solid #e6e6e6'}}>
                                <button className={"stretch-width text-center"+(state.activeTab == "SMS" ? " btn-success" : "")} onClick={() => {
                                    this.setState({activeTab: 'SMS'});
                                    this.editContent();
                                }} style={{borderRadius: 0}}>
                                    SMS
                                </button>
                            </div>
                            {/* Button Use Template */}
                            {!state.showTemplate &&
                                <Mutation
                                    mutation={SAVE_FUNNEL_EMAIL_SEQUENCEV1}
                                    variables={{
                                        funnel_id: funnel_id,
                                        creator: currentUser.id,
                                        message_type: "both",
                                        method: "abandonment",
                                        delay: JSON.stringify([{email: "1 hour", sms: "1 hour"}, {email: "7 hours", sms: "7 hours"}, {email: "24 hours", sms: "24 hours"}]),
                                        email_subject: JSON.stringify(["about your order","DID YOU FORGET SOMETHING?","last chance!"]),
                                        editor_value: JSON.stringify([
                                            {email: "<p>Hi [Name], it looks like you forgot a few things behind in your cart - Currently, you can get your [Product_Name].</p><p><br />Get them now while supplies last and don&#39;t miss out on this amazing deal! [Name]-Complete your order now.</p>", sms: '<p>Hey [Name]. Does it look like you left some great items in your checkout at [Checkout_Link] still interested?</p>'},
                                            {email: "<p>Hi [Name], it looks like you still have something left in your cart.</p><p>To make it even easier for you just click [Checkout_Link] and complete your order now while supplies last!</p>", sms: "<p>Hey [Name]. Still wonder\ing if you should buy?</p>"},
                                            {email: "<p>Hi [Name], I wanted to follow up one last time to make sure you don&#39;t miss out on this amazing deal!</p><p>To make it even easier for you, just click [Checkout_Link] and complete your order now.</p><p>This item will not last forever so take advantage of it now while we still have some left in stock.</p>", sms: "<p>[Name] Don't let your item fade away! Last chance to get it before it's gone. Checkout at [Checkout_Link].</p>"}
                                        ])
                                    }} >
                                    {(saveFunnelEmailSequenceV1, { data, loading, error }) => {
                                        return (
                                            <button className="btn-success data-title" style={{borderRadius: '50%', position: 'absolute', bottom: 60, left: 10}} onClick={() => {
                                                points.executeMutation(saveFunnelEmailSequenceV1, toastr, () => {
                                                    this.refetch();
                                                    points.toastrPrompt(toastr, "success", "Template has been saved", "Success");
                                                });
                                            }} data-title={"Use Template."} disabled={loading}>
                                                <span className="fas fa-envelope" />
                                            </button>
                                        )
                                    }}
                                </Mutation>
                            }
                            {/* Button Add New */}
                            <button className="btn-success data-title" style={{borderRadius: '50%', position: 'absolute', bottom: 10, left: 10}} onClick={() => this.toggleCreateIntegration()} data-title={"Add New "+state.activeTab+" Integration"}>
                                <span className="fas fa-plus" />
                            </button>
                            <span className="clear" />
                        </div>
                        {/* Content */}
                        <div className="column column_12_12">
                            <Query query={
                                GET_FUNNEL_EMAIL_SEQUENCEV1(`{ id method delay editor_value email_subject message_id }`)
                            } variables={{ funnel_id, message_type: state.activeTab }} notifyOnNetworkStatusChange={true} onCompleted={data => {
                                if(data.getFunnelEmailSequenceV1.length != 0) this.setState({ showTemplate: true })
                            }}>
                                {({ data, loading, refetch, error }) => {
                                    if(loading) return <Loading width={50} height={50} />
                                    if(error) {
                                        return (
                                            <div className="text-center" style={{border: '1px solid #e6e6e6', marginTop: 10, padding: 20, borderRadius: 5}}>
                                                <label>Error fetching data please try again.</label>
                                            </div>
                                        );
                                    }
                                    this.refetch = refetch;
                                    if(data.getFunnelEmailSequenceV1.length == 0) {
                                        return (
                                            <div className="text-center" style={{border: '1px solid #e6e6e6', marginTop: 10, padding: 20, borderRadius: 5}}>
                                                <label>No {state.activeTab} Integration Found!</label>
                                            </div>
                                        );
                                    }
                                    return data.getFunnelEmailSequenceV1.map((el, eli) => {
                                        return (
                                            <div className={"cursor-pointer"+(state.id == el.id ? " integration-active" : "")} style={{border: '1px solid #e6e6e6', marginTop: 10, padding: 10, borderRadius: 5}} key={eli}  onClick={() => this.editContent(el, isOptimizeFunnel)}>
                                                <div className="column column_12_12" style={{marginBottom: 5}}>
                                                    <label>{el.method.toUpperCase()}</label><br/>
                                                    <label>Fire after: {el.delay}</label>
                                                </div>
                                                <span className="clear" />
                                            </div>
                                        );
                                    });
                                }}
                            </Query>
                        </div>
                    </div>
                    {/* Content 2: Editor */}
                    {!state.id &&
                        <div className="column column_8_12" style={{height: '90%', padding: 10, borderLeft: '1px solid #e6e6e6', borderTop: '1px solid #e6e6e6'}}>
                            <div className="text-center" style={{marginTop: '30%'}}>
                                <label>Click on the left side to edit.</label>
                            </div>
                        </div>
                    }
                    {state.id &&
                        <div className="column column_8_12" style={{height: '90%', padding: 10, borderLeft: '1px solid #e6e6e6', borderTop: '1px solid #e6e6e6'}}>
                            <div className="row-separator">
                                {state.activeTab == "Email" &&
                                    <div className="column column_12_12">
                                        <label>Email Subject</label>
                                        <input type="text" value={state.email_subject} name="email_subject" onChange={event => this.handleOnChange(event)} />
                                    </div>
                                }
                                <div className="column column_4_12" style={{ marginTop: 10 }}>
                                    <label>Email Method</label>
                                    {(() => {
                                        var options = [
                                            <option key={0} value="abandonment">Abandonment</option>,
                                        ];
                                        return <SelectTag name="method" value={state.method} options={options} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />
                                    })()}
                                </div>
                                <div className="column column_8_12">
                                    <div className="column column_12_12" style={{ marginTop: 10 }}>
                                        <label>Delay before sending the {state.activeTab}</label>
                                    </div>
                                    <div className="column column_6_12" style={{ marginTop: 10 }}>
                                        <input type="text" name="delay_number" value={state.delay_number} onChange={event => this.handleOnChange(event)} />
                                    </div>
                                    <div className="column column_6_12" style={{ marginTop: 10 }}>
                                        {(() => {
                                            var options = [
                                                <option key={0} value="seconds">Second(s)</option>,
                                                <option key={1} value="minutes">Minute(s)</option>,
                                                <option key={2} value="hours">Hour(s)</option>,
                                                <option key={3} value="days">Day(s)</option>
                                            ];
                                            return <SelectTag name="delay_word" value={state.delay_word} options={options} onChange={event => this.handleOnChange(event)} />
                                        })()}
                                    </div>
                                </div>
                                <span className="clear"/>
                            </div>
                            <div className="row-separator">
                                <label>Template: </label>&nbsp;
                                <label className="clickable" onClick={() => this.addTemplate("[Name]")}>[Name]</label>,&nbsp;
                                <label className="clickable" onClick={() => this.addTemplate("[Product_Name]")}>[Product_Name]</label>,&nbsp;
                                <label className="clickable" onClick={() => this.addTemplate("[Product_Price]")}>[Product_Price]</label>,&nbsp;
                                <label className="clickable" onClick={() => this.addTemplate("[Checkout_Link]")}>[Checkout_Link]</label>
                            </div>
                            <div className="row-separator">
                                <CKEditor value={state.editorValue} onChange={value => this.handleEditorChange(value)} config={{ height: 300, extraAllowedContent: 'div(*); p(*); strong(*);', toolbarGroups: [{ name: 'document', groups: ['mode', 'document'] }, { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] }] }} />
                            </div>
                            <div className="text-right">
                                <Mutation
                                    mutation={SAVE_FUNNEL_EMAIL_SEQUENCEV1}
                                    variables={{
                                        id: state.id,
                                        funnel_id: funnel_id,
                                        creator: currentUser.id,
                                        method: state.method,
                                        message_id: state.messageID,
                                        message_type: state.activeTab,
                                        delay: this.singularize(state.delay_number, state.delay_word),
                                        email_subject: state.email_subject,
                                        editor_value: state.editorValue,
                                    }} >
                                    {(saveFunnelEmailSequenceV1, { data, loading, error }) => {
                                        if(!state.id){
                                            return <button className="btn-success stretch-width" disabled={true}>SAVE</button>;
                                        } else {
                                            return <button className="btn-success stretch-width" onClick={() => {
                                                points.executeMutation(saveFunnelEmailSequenceV1, toastr, () => {
                                                    this.refetch();
                                                    this.editContent();
                                                    points.toastrPrompt(toastr, "success", state.activeTab+" Integration has been saved", "Success");
                                                })
                                            }} disabled={loading}>SAVE</button>;
                                        }
                                    }}
                                </Mutation>
                            </div>
                        </div>
                    }
    
                    {/* Add new */}
                    {state.addNew &&
                        <Modal open={state.addNew} closeModal={() => this.toggleCreateIntegration()} session={this.props.session} style={{borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0, width: '30%', height: 300}}>
                            <div>
                                <div style={{padding: 20, backgroundColor: '#f2f9f6', overflow: 'hidden'}}>
                                    <h4 className="header">Add New</h4>
                                </div>
                                <div className="column column_12_12" style={{marginTop: 10}}>
                                    <div className="row-separator">
                                        <label>Select Method</label>
                                        {(() => {
                                            var options = [
                                                <option key={0} value="abandonment">Abandonment</option>,
                                            ];
                                            return <SelectTag name="method" value={state.method} options={options} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />
                                        })()}
                                    </div>
                                    <div className="row-separator">
                                        <label>Set delay before sending the email/sms</label>
                                        <div className="column column_6_12" style={{ marginTop: 10 }}>
                                            <input type="text" name="delay_number" value={state.delay_number} onChange={event => this.handleOnChange(event)} />
                                        </div>
                                        <div className="column column_6_12" style={{ marginTop: 10 }}>
                                            {(() => {
                                                var options = [
                                                    <option key={0} value="seconds">Second(s)</option>,
                                                    <option key={1} value="minutes">Minute(s)</option>,
                                                    <option key={2} value="hours">Hour(s)</option>,
                                                    <option key={3} value="days">Day(s)</option>
                                                ];
                                                return <SelectTag name="delay_word" value={state.delay_word} options={options} onChange={event => this.handleOnChange(event)} />
                                            })()}
                                        </div>
                                        <span className="clear" />
                                    </div>
                                    <Mutation
                                        mutation={SAVE_FUNNEL_EMAIL_SEQUENCEV1}
                                        variables={{ funnel_id: funnel_id, creator: currentUser.id, message_type: state.activeTab, method: state.method, delay: this.singularize(state.delay_number, state.delay_word) }} >
                                        {(saveFunnelEmailSequenceV1, { data, loading, error }) => {
                                            return <button className="btn-success stretch-width" onClick={() => {
                                                points.executeMutation(saveFunnelEmailSequenceV1, toastr, () => {
                                                    this.refetch();
                                                    this.toggleCreateIntegration();
                                                    points.toastrPrompt(toastr, "success", state.activeTab+" Integration has been saved", "Success");
                                                })
                                            }} disabled={loading}>SAVE</button>;
                                        }}
                                    </Mutation>
                                </div>
                            </div>
                        </Modal>
                    }
                </div>
            );
        } else {
            return(
                <div style={{height: '100%'}}>
                    <style dangerouslySetInnerHTML={{__html: `
                        .modal .content {
                            padding: 0;
                        }
                        .integration-active {
                            background-color: #28c686;
                            color; #fff;
                        }
                    `}} />
                    <div style={{padding: 20, backgroundColor: '#f2f9f6', overflow: 'hidden'}}>
                        <h4 className="header">Email & SMS Integration</h4>
                    </div>
                    {/* Content 1: Menu */}
                    <div className="column column_4_12" style={{height: '90%', padding: 0, borderLeft: '1px solid #e6e6e6', borderTop: '1px solid #e6e6e6'}}>
                        {/* Switch to email or SMS */}
                        <div>
                            <div className="column" style={{width: '50%', padding: 0, borderRight: '1px solid #e6e6e6', borderBottom: '1px solid #e6e6e6'}}>
                                <button className={"stretch-width text-center"+(state.activeTab == "Email" ? " btn-success" : "")} onClick={() => {
                                    this.setState({activeTab: 'Email'});
                                    this.editContent();
                                }} style={{borderRadius: 0}}>
                                    Email
                                </button>
                            </div>
                            <div className="column" style={{width: '50%', padding: 0, borderLeft: '1px solid #e6e6e6', borderBottom: '1px solid #e6e6e6'}}>
                                <button className={"stretch-width text-center"+(state.activeTab == "SMS" ? " btn-success" : "")} onClick={() => {
                                    this.setState({activeTab: 'SMS'});
                                    this.editContent();
                                }} style={{borderRadius: 0}}>
                                    SMS
                                </button>
                            </div>
                            {/* Button Use Template */}
                            {!state.showTemplate &&
                                <Mutation
                                    mutation={SAVE_EMAIL_SMS_INTEGRATION}
                                    variables={{
                                        creator: currentUser.id,
                                        method: "abandonment",
                                        messageType: "both",
                                        funnelSource: funnelSource,
                                        delay: JSON.stringify([{email: "1 hour", sms: "1 hour"}, {email: "7 hours", sms: "7 hours"}, {email: "24 hours", sms: "24 hours"}]),
                                        emailSubject: JSON.stringify(["about your order","DID YOU FORGET SOMETHING?","last chance!"]),
                                        editorValue: JSON.stringify([
                                            {email: "<p>Hi [Name], it looks like you forgot a few things behind in your cart - Currently, you can get your [Product_Name].</p><p><br />Get them now while supplies last and don&#39;t miss out on this amazing deal! [Name]-Complete your order now.</p>", sms: '<p>Hey [Name]. Does it look like you left some great items in your checkout at [Checkout_Link] still interested?</p>'},
                                            {email: "<p>Hi [Name], it looks like you still have something left in your cart.</p><p>To make it even easier for you just click [Checkout_Link] and complete your order now while supplies last!</p>", sms: "<p>Hey [Name]. Still wonder\ing if you should buy?</p>"},
                                            {email: "<p>Hi [Name], I wanted to follow up one last time to make sure you don&#39;t miss out on this amazing deal!</p><p>To make it even easier for you, just click [Checkout_Link] and complete your order now.</p><p>This item will not last forever so take advantage of it now while we still have some left in stock.</p>", sms: "<p>[Name] Don't let your item fade away! Last chance to get it before it's gone. Checkout at [Checkout_Link].</p>"}
                                        ])
                                    }} >
                                    {(saveFunnelEmailAndSMSintegration, { data, loading, error }) => {
                                        return (
                                            <button className="btn-success data-title" style={{borderRadius: '50%', position: 'absolute', bottom: 60, left: 10}} onClick={() => this.saveFunnelEmailAndSMSintegration(saveFunnelEmailAndSMSintegration, true)} data-title={"Use Template."} disabled={loading}>
                                                <span className="fas fa-envelope" />
                                            </button>
                                        )
                                    }}
                                </Mutation>
                            }
                            {/* Button Add New */}
                            <button className="btn-success data-title" style={{borderRadius: '50%', position: 'absolute', bottom: 10, left: 10}} onClick={() => this.toggleCreateIntegration()} data-title={"Add New "+state.activeTab+" Integration"}>
                                <span className="fas fa-plus" />
                            </button>
                            <span className="clear" />
                        </div>
                        {/* Content */}
                        <div className="column column_12_12">
                            <Query query={GET_EMAIL_SMS_INTEGRATION} variables={{ funnelSource, messageType: state.activeTab }} notifyOnNetworkStatusChange={true} onCompleted={data => {
                                if(data.getFunnelEmailAndSMSIntegration.length != 0){
                                    this.setState({ showTemplate: true })
                                }
                            }}>
                                {({ data, loading, refetch, error }) => {
                                    if(loading) return <Loading width={50} height={50} />
                                    if(error) {
                                        return (
                                            <div className="text-center" style={{border: '1px solid #e6e6e6', marginTop: 10, padding: 20, borderRadius: 5}}>
                                                <label>Error fetching data please try again.</label>
                                            </div>
                                        );
                                    }
                                    this.refetch = refetch;
                                    if(data.getFunnelEmailAndSMSIntegration.length == 0) {
                                        return (
                                            <div className="text-center" style={{border: '1px solid #e6e6e6', marginTop: 10, padding: 20, borderRadius: 5}}>
                                                <label>No {state.activeTab} Integration Found!</label>
                                            </div>
                                        );
                                    }
                                    return data.getFunnelEmailAndSMSIntegration.map((el, eli) => {
                                        return (
                                            <div className={"cursor-pointer"+(state.id == el.id ? " integration-active" : "")} style={{border: '1px solid #e6e6e6', marginTop: 10, padding: 10, borderRadius: 5}} key={eli}  onClick={() => this.editContent(el)}>
                                                <div className="column column_12_12" style={{marginBottom: 5}}>
                                                    <label>{el.method.toUpperCase()}</label><br/>
                                                    <label>Fire after: {el.delay}</label>
                                                </div>
                                                <span className="clear" />
                                            </div>
                                        );
                                    });
                                }}
                            </Query>
                        </div>
                    </div>
                    {/* Content 2: Editor */}
                    {!state.id &&
                        <div className="column column_8_12" style={{height: '90%', padding: 10, borderLeft: '1px solid #e6e6e6', borderTop: '1px solid #e6e6e6'}}>
                            <div className="text-center" style={{marginTop: '30%'}}>
                                <label>Click on the left side to edit.</label>
                            </div>
                        </div>
                    }
                    {state.id &&
                        <div className="column column_8_12" style={{height: '90%', padding: 10, borderLeft: '1px solid #e6e6e6', borderTop: '1px solid #e6e6e6'}}>
                            <div className="row-separator">
                                {state.activeTab == "Email" &&
                                    <div className="column column_12_12">
                                        <label>Email Subject</label>
                                        <input type="text" value={state.email_subject} name="email_subject" onChange={event => this.handleOnChange(event)} />
                                    </div>
                                }
                                <div className="column column_4_12" style={{ marginTop: 10 }}>
                                    <label>Email Method</label>
                                    {(() => {
                                        var options = [
                                            <option key={0} value="abandonment">Abandonment</option>,
                                        ];
                                        return <SelectTag name="method" value={state.method} options={options} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />
                                    })()}
                                </div>
                                <div className="column column_8_12">
                                    <div className="column column_12_12" style={{ marginTop: 10 }}>
                                        <label>Delay before sending the {state.activeTab}</label>
                                    </div>
                                    <div className="column column_6_12" style={{ marginTop: 10 }}>
                                        <input type="text" name="delay_number" value={state.delay_number} onChange={event => this.handleOnChange(event)} />
                                    </div>
                                    <div className="column column_6_12" style={{ marginTop: 10 }}>
                                        {(() => {
                                            var options = [
                                                <option key={0} value="seconds">Second(s)</option>,
                                                <option key={1} value="minutes">Minute(s)</option>,
                                                <option key={2} value="hours">Hour(s)</option>,
                                                <option key={3} value="days">Day(s)</option>
                                            ];
                                            return <SelectTag name="delay_word" value={state.delay_word} options={options} onChange={event => this.handleOnChange(event)} />
                                        })()}
                                    </div>
                                </div>
                                <span className="clear"/>
                            </div>
                            <div className="row-separator">
                                <label>Template: </label>&nbsp;
                                <label className="clickable" onClick={() => this.addTemplate("[Name]")}>[Name]</label>,&nbsp;
                                <label className="clickable" onClick={() => this.addTemplate("[Product_Name]")}>[Product_Name]</label>,&nbsp;
                                <label className="clickable" onClick={() => this.addTemplate("[Product_Price]")}>[Product_Price]</label>,&nbsp;
                                <label className="clickable" onClick={() => this.addTemplate("[Checkout_Link]")}>[Checkout_Link]</label>
                            </div>
                            <div className="row-separator">
                                <CKEditor value={state.editorValue} onChange={value => this.handleEditorChange(value)} config={{ height: 300, extraAllowedContent: 'div(*); p(*); strong(*);', toolbarGroups: [{ name: 'document', groups: ['mode', 'document'] }, { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] }] }} />
                            </div>
                            <div className="text-right">
                                <Mutation
                                    mutation={SAVE_EMAIL_SMS_INTEGRATION}
                                    variables={{
                                        id: state.id,
                                        creator: currentUser.id,
                                        method: state.method,
                                        messageID: state.messageID,
                                        messageType: state.activeTab,
                                        funnelSource: funnelSource,
                                        delay: this.singularize(state.delay_number, state.delay_word),
                                        emailSubject: state.email_subject,
                                        editorValue: state.editorValue,
                                    }} >
                                    {(saveFunnelEmailAndSMSintegration, { data, loading, error }) => {
                                        if(!state.id){
                                            return <button className="btn-success stretch-width" disabled={true}>SAVE</button>;
                                        } else {
                                            return <button className="btn-success stretch-width" onClick={() => this.saveFunnelEmailAndSMSintegration(saveFunnelEmailAndSMSintegration, true)} disabled={loading}>SAVE</button>;
                                        }
                                    }}
                                </Mutation>
                            </div>
                        </div>
                    }
    
                    {/* Add new */}
                    {state.addNew &&
                        <Modal open={state.addNew} closeModal={() => this.toggleCreateIntegration()} session={this.props.session} style={{borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0, width: '30%', height: 300}}>
                            <div>
                                <div style={{padding: 20, backgroundColor: '#f2f9f6', overflow: 'hidden'}}>
                                    <h4 className="header">Add New</h4>
                                </div>
                                <div className="column column_12_12" style={{marginTop: 10}}>
                                    <div className="row-separator">
                                        <label>Select Method</label>
                                        {(() => {
                                            var options = [
                                                <option key={0} value="abandonment">Abandonment</option>,
                                            ];
                                            return <SelectTag name="method" value={state.method} options={options} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />
                                        })()}
                                    </div>
                                    <div className="row-separator">
                                        <label>Set delay before sending the email/sms</label>
                                        <div className="column column_6_12" style={{ marginTop: 10 }}>
                                            <input type="text" name="delay_number" value={state.delay_number} onChange={event => this.handleOnChange(event)} />
                                        </div>
                                        <div className="column column_6_12" style={{ marginTop: 10 }}>
                                            {(() => {
                                                var options = [
                                                    <option key={0} value="seconds">Second(s)</option>,
                                                    <option key={1} value="minutes">Minute(s)</option>,
                                                    <option key={2} value="hours">Hour(s)</option>,
                                                    <option key={3} value="days">Day(s)</option>
                                                ];
                                                return <SelectTag name="delay_word" value={state.delay_word} options={options} onChange={event => this.handleOnChange(event)} />
                                            })()}
                                        </div>
                                        <span className="clear" />
                                    </div>
                                    <Mutation
                                        mutation={SAVE_EMAIL_SMS_INTEGRATION}
                                        variables={{
                                            id: state.id,
                                            creator: currentUser.id,
                                            funnelSource: funnelSource,
                                            messageType: state.activeTab,
                                            method: state.method,
                                            delay: this.singularize(state.delay_number, state.delay_word)
                                        }} >
                                        {(saveFunnelEmailAndSMSintegration, { data, loading, error }) => {
                                            return <button className="btn-success stretch-width" onClick={() => this.saveFunnelEmailAndSMSintegration(saveFunnelEmailAndSMSintegration)} disabled={loading}>SAVE</button>;
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
}


export default withSession(EmailAndSMSIntegration);