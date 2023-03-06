import React from 'react';
import { GET_FUNNEL_EMAIL_SEQUENCEV2, SAVE_FUNNEL_EMAIL_SEQUENCEV2, SAVE_FUNNEL_EMAIL_SEQUENCEV2_ORDER } from './../queries';
import { Query, Mutation, ApolloConsumer } from 'react-apollo';
import Loading from '../components/loading';
import withSession from './../hoc/withSession';
import CKEditor from 'react-ckeditor-wrapper';
import SelectTag from '../components/selectTag';
import Modal from '../components/ModalComponent';
import toastr from 'toastr';
import ButtonWithPopup from '../components/buttonWithPopup';
const points = require('../../Global_Values');

const initializeCreateNewSequence = {
    id: '',
    content: [],
    sequence_name: '',
    sequence_tags: '',
    addNewSequence: false,
    sequenceName: '',
    sequenceTag: '',
    return_sequence_id: null
}

const initializeEditContent = {
    addNewContent: false,
    content_id: '',
    delay_number: '',
    delay_word: 'seconds',
    emailSubject: '',
    editorValue: ''
}

const initializeTempalteContent = {
    templateName: "",
    templateTags: "",
    templateContent: ""
}

const initializeDragAndDrop = {
    isDragging: false,
    dragStartId: "",
    dragOverId: ""
}

class EmailSequence extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initializeCreateNewSequence,
            ...initializeEditContent,
            ...initializeDragAndDrop,
            twilioData: {},
            abandonmentTemplate: "",
            trackingTemplate: "",
            confirmationTemplate: ""
        }
    }

    componentWillMount() {
        if(this.refetch) this.refetch();
        var integrationPayload = { "query": "{\n  getMyIntegrations(id: \"" + this.props.session.getCurrentUser.id + "\", merchant_type: \"twilio\"){\n    id\n    merchant_type\n    merchant_name\n    public_key\n    private_key\n    other\n  }\n}\n", "variables": null, "operationName": null };
        points.customFetch('/graphql', 'post', integrationPayload, integrationResult => {
            var data = [], confirmationData = [], trackingData = [];
            if(integrationResult.data.getMyIntegrations.length != 0){
                var twilioData = integrationResult.data.getMyIntegrations[0];
                data = [ { message_type: "delay", delay: "1 hour" }, { message_type: "email", email_subject: "about your order", editor_value: "<p>Hi [Name], it looks like you forgot a few things behind in your cart - Currently, you can get your [Product_Name].</p><p><br />Get them now while supplies last and don&#39;t miss out on this amazing deal! [Name]-Complete your order now.</p>" }, { message_type: "sms", email_subject: "", editor_value: "<p>Hey [Name]. Does it look like you left some great items in your checkout at [Checkout_Link] still interested?</p>", sender: twilioData.other, atkn: twilioData.private_key, asid: twilioData.public_key }, { message_type: "delay", delay: "7 hours" }, { message_type: "email", email_subject: "DID YOU FORGET SOMETHING?", editor_value: "<p>Hi [Name], it looks like you still have something left in your cart.</p><p>To make it even easier for you just click [Checkout_Link] and complete your order now while supplies last!</p>" }, { message_type: "sms", email_subject: "Abandonment Email", editor_value: "<p>Hey [Name]. Still wonder\ing if you should buy?</p>", sender: twilioData.other, atkn: twilioData.private_key, asid: twilioData.public_key, }, { message_type: "delay", delay: "24 hours" }, { message_type: "email", email_subject: "last chance!", editor_value: "<p>Hi [Name], I wanted to follow up one last time to make sure you don&#39;t miss out on this amazing deal!</p><p>To make it even easier for you, just click [Checkout_Link] and complete your order now.</p><p>This item will not last forever so take advantage of it now while we still have some left in stock.</p>" }, { message_type: "sms", email_subject: "Abandonment Email", editor_value: "<p>[Name] Don't let your item fade away! Last chance to get it before it's gone. Checkout at [Checkout_Link].</p>", sender: twilioData.other, atkn: twilioData.private_key, asid: twilioData.public_key } ];
                confirmationData = [ { message_type: "delay", delay: "0 second" }, { message_type: "email", email_subject: "Thank you for your purchase!", editor_value: "<p>Hi [Name], we're getting your order ready to be shipped. We will notify you when it has been sent.</p><p><strong>Order summary</strong></p><p>[Product_LineItems]</p>" }, { message_type: "sms", email_subject: "", editor_value: "<p>Hi [Name], we're getting your order ready to be shipped. We will notify you when it has been sent.</p><p><strong>Order summary</strong></p><p>[Product_LineItems]</p>", sender: twilioData.other, atkn: twilioData.private_key, asid: twilioData.public_key } ];
                trackingData = [ { message_type: "delay", delay: "0 second" }, { message_type: "email", email_subject: "YOUR ORDER HAS BEEN SHIPPED", editor_value: "<p>Tracking Number: [Tracking_Number]</p><p>[Product_LineItems]</p>" }, { message_type: "sms", email_subject: "", editor_value: "<p>Tracking Number: [Tracking_Number]</p><p>[Product_LineItems]</p>", sender: twilioData.other, atkn: twilioData.private_key, asid: twilioData.public_key } ];
            } else {
                data = [ { message_type: "delay", delay: "1 hour" }, { message_type: "email", email_subject: "about your order", editor_value: "<p>Hi [Name], it looks like you forgot a few things behind in your cart - Currently, you can get your [Product_Name].</p><p><br />Get them now while supplies last and don&#39;t miss out on this amazing deal! [Name]-Complete your order now.</p>" }, { message_type: "delay", delay: "7 hours" }, { message_type: "email", email_subject: "DID YOU FORGET SOMETHING?", editor_value: "<p>Hi [Name], it looks like you still have something left in your cart.</p><p>To make it even easier for you just click [Checkout_Link] and complete your order now while supplies last!</p>" }, { message_type: "delay", delay: "24 hours" }, { message_type: "email", email_subject: "last chance!", editor_value: "<p>Hi [Name], I wanted to follow up one last time to make sure you don&#39;t miss out on this amazing deal!</p><p>To make it even easier for you, just click [Checkout_Link] and complete your order now.</p><p>This item will not last forever so take advantage of it now while we still have some left in stock.</p>" } ];
                confirmationData = [ { message_type: "delay", delay: "0 second" }, { message_type: "email", email_subject: "Thank you for your purchase!", editor_value: "<p>Hi [Name], we're getting your order ready to be shipped. We will notify you when it has been sent.</p><p><strong>Order summary</strong></p><p>[Product_LineItems]</p>" } ];
                trackingData = [ { message_type: "delay", delay: "0 second" }, { message_type: "email", email_subject: "YOUR ORDER HAS BEEN SHIPPED", editor_value: "<p>Tracking Number: [Tracking_Number]</p><p>[Product_LineItems]</p>" } ];
            }
            this.setState({
                twilioData: integrationResult.data.getMyIntegrations.length != 0 ? integrationResult.data.getMyIntegrations[0] : {},
                abandonmentTemplate: JSON.stringify(data),
                confirmationTemplate: JSON.stringify(confirmationData),
                trackingTemplate: JSON.stringify(trackingData)
            })
        });
    }

    toggleCreateNewSequence(id, name, tag){
        this.setState({
            ...initializeCreateNewSequence,
            ...initializeEditContent,
            addNewSequence: !this.state.addNewSequence,
            sequenceName: name ? name : '',
            sequenceTag: tag ? tag : '',
            id: id ? id : ''
        });
    }

    toggleCreateNewContent(addTo, data){
        var saveState = { ...initializeEditContent };
        if(addTo && data) {
            saveState.content_id = data.id;
            if(addTo == "delay") {
                var delay = this.separateNumberAndWord(data.delay);
                saveState.delay_number = delay.number;
                saveState.delay_word = delay.word[delay.word.length-1] != "s" ? delay.word+"s" : delay.word;
            } else if(addTo == "email"){
                saveState.emailSubject = data.email_subject;
                saveState.editorValue = data.editor_value;
            } else if(addTo == "sms") {
                saveState.editorValue = data.editor_value;
            }
        }
        saveState.addNewTab = addTo ? addTo : '';
        saveState.addNewContent = !this.state.addNewContent;
        this.setState({ ...saveState });
    }

    handleOnChange(event){
        var name = event.target.name;
        var value = event.target.value;
        this.setState({ [name]: value });
    }

    handleEditorChange(value){
        this.setState({ editorValue: value });
    }

    addTemplate(template){
        var activeEditor = null;
        for(var x in CKEDITOR.instances){
            activeEditor = CKEDITOR.instances[x]
        }
        activeEditor.insertText(template)
    }

    singularize(number, string){
        if(string[string.length-1] != "s") string = string+"s";
        if(number <= 1) string = string.substring(0, string.length-1);
        return number+" "+string;
    }

    separateNumberAndWord(string){
        return {
            number: string.match(/\d+/).toString(),
            word: string.match(/\s\w+/).toString().trim(),
        }
    }

    editContent(data){
        if(data){
            this.setState({
                id: data.id,
                content: JSON.parse(JSON.stringify(data.content)),
                return_sequence_id: data.return_sequence_id,
                sequence_name: data.sequence_name,
                sequence_tags: data.sequence_tags
            })
        } else {
            this.setState({ ...initializeCreateNewSequence, ...initializeEditContent })
        }
    }

    saveEmailSequence(saveEmailSequence){
        toastr.clear();
        toastr.info("Loading please wait...");
        saveEmailSequence().then(({ data }) => {
            toastr.clear();
            this.setState({ ...initializeCreateNewSequence, ...initializeEditContent })
            this.refetch();
        }).catch(error => {
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message);
        });
    }

    templateOnChange(event){
        var templateName = event.target.value, templateTags = "", templateContent = "";
        if(templateName == "Confirmation"){
            templateTags = "plg_confirmation";
            templateContent = this.state.confirmationTemplate;
        } else if(templateName == "Tracking"){
            templateTags = "plg_tracking";
            templateContent = this.state.trackingTemplate;
        } else if(templateName == "Abandonment"){
            templateTags = "plg_abandon";
            templateContent = this.state.abandonmentTemplate;
        }
        this.setState({ templateName, templateTags, templateContent })
    }

    onDragStart(event, id) {
        let element = event.target;
        this.setState({ dragStartId: id });
    }
    
    onDragEnd(event) {
        let element = event.target;
        this.setState({ ...initializeDragAndDrop });
    }

    onDragOver(event, id) {
        event.preventDefault();
        let element = event.target, state = this.state;
        if(!state.isDragging && state.dragStartId != id) { // to prevent multiple set state
            this.setState({ isDragging: true, dragOverId: id });
        }
    }

    onDragLeave(event, id) {
        let element = event.target, state = this.state;
        if(state.dragStartId != id) {
            this.setState({ isDragging: false });
        }
    }

    onDrop(event, id, client) {
        event.preventDefault();
        let element = event.target, state = this.state, sort_content = state.content;
        if(state.dragStartId != id) {
            let old_pos = sort_content.findIndex(a => a.id == state.dragStartId), new_pos = sort_content.findIndex(a => a.id == id);
            sort_content.forEach((e, i) => {
                if(e.id == state.dragStartId) e.order = new_pos;
                else if(e.id == id) e.order = old_pos;
                else e.order = i;
            });
            this.setState({ ...initializeDragAndDrop, content: sort_content });

            // saving the order of email sequence
            let content_orders = sort_content.map(e => {
                return { id: e.id, order: e.order };
            });
            client.mutate({ mutation: SAVE_FUNNEL_EMAIL_SEQUENCEV2_ORDER, variables: { content_orders: JSON.stringify(content_orders) } }).then(res => {
                console.log(res);
            })
        }
    }

    render() {
        const currentUser = this.props.session.getCurrentUser, funnel_id = this.props.funnel_id, state = this.state;
        return(
            <div style={{height: '100%'}}>
                <style dangerouslySetInnerHTML={{__html: `
                    .popup-content .content {
                        padding: 0;
                    }
                    .integration-active {
                        background-color: #28c686 !important;
                        color: #fff !important;
                    }
                `}} />
                <div className="clear" style={{ padding: 15, backgroundColor: '#f2f9f6', borderBottom: '1px solid #e6e6e6' }}>
                    <h4 className="font-roboto-light" style={{color: '#7d8184'}}>Email Sequence</h4>
                </div>
                {/* Content 1 */}
                <div className="column column_4_12" style={{position: 'relative', height: 'calc(100% - 70px)', padding: 0}}>
                    {state.addNewSequence &&
                        <div style={{margin: 20}}>
                            <div className="product-card">
                                <div className="product-details">
                                    <div className="row-separator" style={{ borderBottom: '1px solid #e6e6e6', paddingBottom: 10}}>
                                        <label className="font-questrial-bold">{state.id ? "Update" : "Create"} Sequence</label>
                                        <span className="float-right fas fa-times cursor-pointer" style={{fontSize: '0.875em', color: '#b8bec4'}} onClick={() => this.toggleCreateNewSequence()} />
                                    </div>
                                    <div className="row-separator">
                                        <input type="text" name="sequenceName" placeholder="Name your Sequence" value={state.sequenceName} onChange={event => this.handleOnChange(event)} />
                                    </div>
                                    <div className="row-separator">
                                        <input type="text" name="sequenceTag" placeholder="Sequence Tag" value={state.sequenceTag} onChange={event => this.handleOnChange(event)} />
                                    </div>
                                    <div className="row-separator">
                                        <Mutation
                                            mutation={SAVE_FUNNEL_EMAIL_SEQUENCEV2}
                                            variables={{
                                                id: state.id,
                                                funnel_id,
                                                creator: currentUser.id,
                                                sequence_name: state.sequenceName,
                                                sequence_tags: state.sequenceTag,
                                                add_content: false
                                            }} >
                                            {(saveFunnelEmailSequenceV2, { data, loading, error }) => {
                                                return (
                                                    <button className="btn-success display-inline" onClick={() => {
                                                        points.executeMutation(saveFunnelEmailSequenceV2, toastr, () => {
                                                            this.setState({ ...initializeCreateNewSequence, ...initializeEditContent })
                                                            this.refetch();
                                                            toastr.clear();
                                                        });
                                                    }} disabled={loading} style={{width: '80%'}}>
                                                        <span className="fas fa-plus" style={{ marginRight: 10 }} />
                                                        <label className="cursor-pointer">{state.id ? "Update" : "Create"} Sequence</label>
                                                    </button>
                                                );
                                            }}
                                        </Mutation>
                                    </div>
                                    <div className="row-separator"> &nbsp; </div>
                                    <div className="row-separator">
                                        <label className="font-questrial-bold clear">Use Template</label>
                                        <div className="float-left column_7_12">
                                            {(() => {
                                                var options = [
                                                    <option key={0} value="Confirmation">Confimation</option>,
                                                    <option key={1} value="Tracking">Tracking</option>,
                                                    <option key={2} value="Abandonment">Abandonment</option>
                                                ];
                                                return <SelectTag name="templateName" value={state.templateName} options={options} onChange={event => this.templateOnChange(event)} />
                                            })()}
                                        </div>
                                        <div className="float-left column_5_12">
                                            <Mutation
                                                mutation={SAVE_FUNNEL_EMAIL_SEQUENCEV2}
                                                variables={{
                                                    funnel_id,
                                                    creator: currentUser.id,
                                                    sequence_name: state.templateName ? state.templateName :"Confirmation",
                                                    sequence_tags: state.templateTags ? state.templateTags : "plg_confirmation",
                                                    content: state.templateContent ? state.templateContent : state.confirmationTemplate
                                                }} >
                                                {(saveFunnelEmailSequenceV2, { data, loading, error }) => {
                                                    return (
                                                        <button className="btn-success display-inline float-right" style={{ padding: 10 }} onClick={() => {
                                                            points.executeMutation(saveFunnelEmailSequenceV2, toastr, () => {
                                                                this.setState({ ...initializeCreateNewSequence, ...initializeEditContent, ...initializeTempalteContent });
                                                                this.refetch();
                                                                toastr.clear();
                                                            });
                                                        }}>
                                                            <span className="fas fa-plus" style={{ marginRight: 10 }} />
                                                            <label className="cursor-pointer">Create</label>
                                                        </button>
                                                    );
                                                }}
                                            </Mutation>
                                        </div>
                                        <span className="clear" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {!state.addNewSequence &&
                        <div style={{padding: 20, height: '100%', overflowY: 'scroll'}}>
                            <div className="row-separator cursor-pointer" onClick={() => this.toggleCreateNewSequence()}>
                                <button className="btn-success" style={{marginRight: 10, padding: '5px 10px', boxShadow: 'none'}}> <span className="fas fa-plus" /> </button>
                                <label>Add New Sequence</label>
                            </div>
                            <label className="font-questrial-bold" style={{borderBottom: '1px solid #e6e6e6', display: 'block', padding: '20px 0 10px'}}>Email Sequence List</label>
                            <Query query={ GET_FUNNEL_EMAIL_SEQUENCEV2(`{ id sequence_name sequence_tags return_sequence_id content { id order delay message_type email_subject editor_value } }`) } variables={{ funnel_id }} >
                                {({ data, loading, refetch, error }) => {
                                    this.refetch = refetch;
                                    if(loading) {
                                        return (
                                            <div className="product-card">
                                                <div className="product-details">
                                                    <Loading width={100} height={100} />
                                                </div>
                                            </div>
                                        );
                                    }
                                    if(error) {
                                        return (
                                            <div className="product-card">
                                                <div className="product-details">
                                                    <label>Error fetching data please try again.</label>
                                                </div>
                                            </div>
                                        );
                                    }
                                    if(data.getFunnelEmailSequenceV2.length == 0) {
                                        return (
                                            <div style={{marginTop: 10}}>
                                                <label className="font-questrial-bold">There's no sequence yet</label> <br/>
                                                <label className="font-small" style={{fontStyle: 'italic'}}>Please click the '+' button above to create a sequence</label>
                                            </div>
                                        );
                                    }
                                    return data.getFunnelEmailSequenceV2.map((el, eli) => {
                                        return (
                                            <div className={"product-card"+(state.id == el.id ? " integration-active" : "")} onClick={() => this.editContent(el)} key={eli} >
                                                <div className="product-details cursor-pointer display-inline" style={{padding: 15}}>
                                                    <div className="one-line-ellipsis" style={{ width: '80%' }}>
                                                        <label className="cursor-pointer font-questrial-bold">{el.sequence_name}</label>
                                                    </div>
                                                    <div className="text-right" style={{ width: '80%' }}>
                                                        <Mutation
                                                            mutation={SAVE_FUNNEL_EMAIL_SEQUENCEV2}
                                                            variables={{
                                                                id: state.id,
                                                                remove_data: true,
                                                                return_sequence_id: el.return_sequence_id
                                                            }} >
                                                            {(saveFunnelEmailSequenceV2, { data, loading, error }) => {
                                                                return (
                                                                    <ButtonWithPopup data={{
                                                                        triggerDOM: <span id={"seq_more"+eli} className="fas fa-ellipsis-v float-right color-orange cursor-pointer" />,
                                                                        popupPosition: "left top",
                                                                        title: "",
                                                                        text: <ul className="item-list color-black">
                                                                            <li onClick={() => this.toggleCreateNewSequence(el.id, el.sequence_name, el.sequence_tags)}>Update Sequence</li>
                                                                            <li onClick={() => {
                                                                                var are_you_sure = confirm("Are you sure you want to remove this? This cannot be undone.");
                                                                                if(are_you_sure) {
                                                                                    document.getElementById("seq_more" + eli).click();
                                                                                    points.executeMutation(saveFunnelEmailSequenceV2, toastr, () => {
                                                                                        this.setState({ ...initializeCreateNewSequence, ...initializeEditContent });
                                                                                        this.refetch();
                                                                                        toastr.clear();
                                                                                    });
                                                                                }
                                                                            }}>Remove Sequence</li>
                                                                        </ul>,
                                                                        triggerID: "seq_more"+eli,
                                                                        loading: false,
                                                                        padding: 0,
                                                                        checkORtimesButton: false,
                                                                        style: { maxWidth: 'fit-content', minWidth: 'fit-content' }
                                                                    }} />
                                                                )
                                                            }}
                                                        </Mutation>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }}
                            </Query>
                        </div>
                    }
                </div>
                {/* Content 2 */}
                <div className="column column_8_12" style={{position: 'relative', height: 'calc(100% - 70px)', padding: 0}}>
                    <div className="product-card" style={{ height: '100%', margin: '10px 10px 10px 0', overflowY: 'scroll' }}>
                        {!state.id &&
                            <div className="center-vertical">
                                <label>Please select sequence in left side.</label>
                            </div>
                        }
                        {state.id &&
                            <div className="product-details email-sequence">
                                <div className="row-separator">
                                    <div className="float-right">
                                        <ButtonWithPopup data={{
                                            triggerDOM: <button id="addnewcontent" className="btn-success" style={{marginRight: 10, padding: '5px 10px', boxShadow: 'none'}}> <span className="fas fa-plus" /> </button>,
                                            popupPosition: "left top",
                                            text: <div>
                                                <label className="font-questrial-bold">Select Content</label>
                                                <ul className="item-list">
                                                    <li onClick={() => this.toggleCreateNewContent("delay")}>Add Delay</li>
                                                    <li onClick={() => this.toggleCreateNewContent("email")}>Add Email</li>
                                                    <li onClick={() => {
                                                        if(state.twilioData.other){
                                                            this.toggleCreateNewContent("sms")
                                                        } else {
                                                            toastr.clear();
                                                            toastr.warning("It seems like you dont have twilio integration yet.","Twilio Integration Required.");
                                                        }
                                                    }}>Add SMS</li>
                                                </ul>
                                            </div>,
                                            triggerID: "addnewcontent",
                                            loading: false,
                                            padding: 5,
                                            checkORtimesButton: false,
                                            style: { maxWidth: 'fit-content', minWidth: 'fit-content' }
                                        }} />
                                    </div>
                                    <label className="font-roboto-light">
                                        {state.sequence_name} <br/>
                                        <em className="font-small">Tag(s): {state.sequence_tags}</em>
                                    </label>
                                </div>
                                {state.content.length != 0 ?
                                    <div className="timeline">
                                        {(() => {
                                            let timeline = state.content;
                                            // sort the timeline depending on the drag order
                                            if(timeline.filter(e => e.order).length != 0) timeline = timeline.sort((a,b) => a.order < b.order ? -1 : 1 );
                                            return timeline.map((el, eli) => {
                                                return (
                                                    <div className={"container " + (eli % 2 == 0 ? "left" : "right")} key={eli}>
                                                        {(() => {
                                                            var closeButton = (
                                                                <Mutation
                                                                    mutation={SAVE_FUNNEL_EMAIL_SEQUENCEV2}
                                                                    variables={{
                                                                        id: state.id,
                                                                        content_id: el.id,
                                                                        remove_content: true
                                                                    }} >
                                                                    {(saveEmailSequence, { data, loading, error }) => {
                                                                        return (
                                                                            <ButtonWithPopup data={{
                                                                                triggerDOM: <span id={"seq_more"+eli} className="fas fa-ellipsis-v float-right color-orange cursor-pointer" />,
                                                                                popupPosition: "left top",
                                                                                title: "",
                                                                                text: <ul className="item-list">
                                                                                    <li onClick={() => this.toggleCreateNewContent(el.message_type, el)}>Edit</li>
                                                                                    <li onClick={() => {
                                                                                        var are_you_sure = confirm("Are you sure you want to remove this? This cannot be undone.");
                                                                                        if(are_you_sure) this.saveEmailSequence(saveEmailSequence);
                                                                                    }}>Remove</li>
                                                                                </ul>,
                                                                                triggerID: "seq_more"+eli,
                                                                                loading: false,
                                                                                padding: 0,
                                                                                checkORtimesButton: false,
                                                                                style: { maxWidth: 'fit-content', minWidth: 'fit-content' }
                                                                            }} />
                                                                        )
                                                                    }}
                                                                </Mutation>
                                                            );
                                                            return (
                                                                <ApolloConsumer>
                                                                    {client => {
                                                                        return (
                                                                            <div className={"content" + (state.dragOverId == el.id ? " cursor-drag-over" : "")}
                                                                                onDragOver={event => this.onDragOver(event, el.id)}
                                                                                onDragLeave={event => this.onDragLeave(event, el.id)}
                                                                                onDrop={event => this.onDrop(event, el.id, client)}>
                                                                                <div
                                                                                    onDragStart={event => this.onDragStart(event, el.id)}
                                                                                    onDragEnd={event => this.onDragEnd(event)}
                                                                                    draggable={true}>
                                                                                    <div className={"content-header "+(state.dragStartId == el.id ? "cursor-grab" : "cursor-pointer")}>
                                                                                        <label className="font-roboto-light">{el.message_type.toUpperCase()}</label> {closeButton}
                                                                                    </div>
                                                                                    <div className="content-body">
                                                                                        {el.message_type == "delay" &&
                                                                                            <label className="font-questrial-bold">Wait {el.delay}</label>
                                                                                        }
                                                                                        {el.message_type == "email" &&
                                                                                            <label>
                                                                                                Email Subject: <em className="font-questrial-bold">{el.email_subject}</em> <br/>
                                                                                                Send <em className="font-questrial-bold">{el.message_type.toUpperCase()}</em> to user.
                                                                                            </label>
                                                                                        }
                                                                                        {el.message_type == "sms" &&
                                                                                            <label>
                                                                                                Send <em className="font-questrial-bold">{el.message_type.toUpperCase()}</em> to user.
                                                                                            </label>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }}
                                                                </ApolloConsumer>
                                                            );
                                                        })()}
                                                    </div>
                                                );
                                            })
                                        })()}
                                    </div>
                                :
                                    <div className="product-card text-center" style={{ padding: 10 }}>
                                        <label>No content to display click the + icon to create</label>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>

                {/* Add new content */}
                {state.addNewContent &&
                    <Modal open={state.addNewContent} closeModal={() => this.toggleCreateNewContent()} session={this.props.session} style={{borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0, width: '30%'}}>
                        <div className="center-vertical-parent">
                            <div className="column column_12_12 center-vertical">
                                {state.addNewTab == "delay" &&
                                    <div className="row-separator">
                                        <div className="column column_12_12" style={{ padding: 0 }}>
                                            <label>Add delay</label>
                                        </div>
                                        <div className="column column_6_12" style={{ padding: 0 }}>
                                            <input type="text" name="delay_number" value={state.delay_number} onChange={event => this.handleOnChange(event)} style={{marginTop: 10}} />
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
                                }
                                {state.addNewTab == "email" &&
                                    <div>
                                        <div className="row-separator">
                                            <label>Email Subject</label>
                                            <input type="text" name="emailSubject" value={state.emailSubject} onChange={event => this.handleOnChange(event)} style={{marginTop: 10}} />
                                        </div>
                                        <div className="row-separator">
                                            <label>Template: </label> <label className="clickable" onClick={() => this.addTemplate("[Name]")}>[Name]</label>, <label className="clickable" onClick={() => this.addTemplate("[Product_Name]")}>[Product_Name]</label>, <label className="clickable" onClick={() => this.addTemplate("[Product_Price]")}>[Product_Price]</label>, <label className="clickable" onClick={() => this.addTemplate("[Checkout_Link]")}>[Checkout_Link]</label>, <label className="clickable" onClick={() => this.addTemplate("[Product_LineItems]")}>[Product_LineItems]</label>, <label className="clickable" onClick={() => this.addTemplate("[Tracking_Number]")}>[Tracking_Number]</label>
                                        </div>
                                        <div className="row-separator">
                                            <CKEditor value={state.editorValue} onChange={value => this.handleEditorChange(value)} config={{ height: 200, extraAllowedContent: 'div(*); p(*); strong(*);', toolbarGroups: [{ name: 'document', groups: ['mode', 'document'] }, { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] }, { name: 'insert', groups: ['Image', 'Table'] }] }} />
                                        </div>
                                    </div>
                                }
                                {state.addNewTab == "sms" &&
                                    <div>
                                        <div className="row-separator">
                                            <label>Template: </label> <label className="clickable" onClick={() => this.addTemplate("[Name]")}>[Name]</label>, <label className="clickable" onClick={() => this.addTemplate("[Product_Name]")}>[Product_Name]</label>, <label className="clickable" onClick={() => this.addTemplate("[Product_Price]")}>[Product_Price]</label>, <label className="clickable" onClick={() => this.addTemplate("[Checkout_Link]")}>[Checkout_Link]</label>, <label className="clickable" onClick={() => this.addTemplate("[Product_LineItems]")}>[Product_LineItems]</label>, <label className="clickable" onClick={() => this.addTemplate("[Tracking_Number]")}>[Tracking_Number]</label>
                                        </div>
                                        <div className="row-separator">
                                            <CKEditor value={state.editorValue} onChange={value => this.handleEditorChange(value)} config={{ height: 200, extraAllowedContent: 'div(*); p(*); strong(*);', toolbarGroups: [{ name: 'document', groups: ['mode', 'document'] }, { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] }] }} />
                                        </div>
                                    </div>
                                }
                                {state.addNewTab == "tag" &&
                                    <div className="row-separator">
                                        wala pa...
                                    </div>
                                }
                                {state.addNewTab != "tag" &&
                                    <div className="row-separator">
                                        <Mutation
                                            mutation={SAVE_FUNNEL_EMAIL_SEQUENCEV2}
                                            variables={{
                                                id: state.id,
                                                content_id: state.content_id,
                                                funnel_id,
                                                creator: currentUser.id,
                                                delay: state.addNewTab == "delay" ? this.singularize(state.delay_number, state.delay_word) : '',
                                                message_type: state.addNewTab,
                                                email_subject: state.emailSubject,
                                                sender: state.addNewTab == "sms" ? state.twilioData.other : "",
                                                atkn: state.addNewTab == "sms" ? state.twilioData.private_key : "",
                                                asid: state.addNewTab == "sms" ? state.twilioData.public_key : "",
                                                editor_value: state.editorValue,
                                                add_content: true
                                            }} >
                                            {(saveEmailSequence, { data, loading, error }) => {
                                                return <button className="btn-success" onClick={() => this.saveEmailSequence(saveEmailSequence)} disabled={loading}>SAVE</button>;
                                            }}
                                        </Mutation>
                                    </div>
                                }
                            </div>
                        </div>
                    </Modal>
                }
            </div>
        );
    }
}


export default withSession(EmailSequence);