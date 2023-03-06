import React from 'react';
import withAuth from '../hoc/withAuth';
import toastr from 'toastr';
import Modal from '../components/ModalComponent';
import Loading from '../components/loading';
import CKEditor from 'react-ckeditor-wrapper';
import Popup from 'reactjs-popup';
import { Query, Mutation } from 'react-apollo';
import SelectTag from '../components/selectTag';
import { UPDATE_MD_TRAINING,
    DELETE_MD_TRAINING,
    GET_ADMIN_SETTINGS,
    GET_ADMIN_CUSTOM_PAGES,
    GET_ADMIN_CUSTOM_PAGE_DATA,
    ADMIN_ADD_PANEL,
    ADMIN_DELETE_PANEL,
    ADMIN_EDIT_PANEL,
    ADMIN_ENABLE_PANEL,
    ADMIN_SAVE_SECTION,
    ADMIN_EDIT_SECTION,
    ADMIN_DELETE_SECTION,
    ADMIN_CHANGE_HOMEPAGE_VIDEO } from './../queries';

const points = require('../../Global_Values');

const resetStateCustomPage = {
    panel_name: '',
    panel_description: '',
    panel_img_url: '',
    panel_type: 'trainings',
    addPanelType: false,
    panel_id: '',
    content_id: '',
    page_icon: 'fas fa-lock-open',
    page_name: '',
    page_content: '',
    lockPrivilege: false,
    lockKartra: false,
    kartraTag: '',
    fromPrivilege: '',
    toPrivilege: '',
    showSectionModal: false,
    refetchCustomPage: () => {}
}

class AdminSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            id: '0',
            vimeo_id: 0,
            title: '',
            description: '',
            tag: '',
            upsell_link: '',
            lockVideo: true,

            // new features
            ...resetStateCustomPage,

            // Video
            id: null,
            h_full_video: '',
            message_full: '',
            h_trial_video: '',
            message_trial: ''
        }

        this.toggleUpdateModal = this.toggleUpdateModal.bind(this)
        this.toggleAddSection = this.toggleAddSection.bind(this)
        this.getHomepageVideo();
    }

    componentDidMount(){
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut":0,
            "extendedTimeOut":0,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        // window.onkeyup = function (event) {
        //     if (event.keyCode == 27) {
        //         // detech pressed scape button
        //     }
        // }
    }

    handleTitleChange(title) {
        this.setState({
            title: title.target.value
        })
    }

    handleLinkChange(vimeo_id) {
        vimeo_id = vimeo_id.target.value;
        this.setState({
            vimeo_id: vimeo_id.substring(0, 9)
        })
    }

    handleUpsellLinkChange(upsell_link){
        this.setState({
            upsell_link: upsell_link.target.value
        })
    }

    handleCheckboxChange(checkbox){
        this.setState({
            lockVideo: !this.state.lockVideo
        })
    }

    handleTagChange(tag){
        this.setState({
            tag: tag.target.value
        })
    }

    handleEditorChange(description) {
        this.setState({
            description: description
        })
    }
    
    changeSelectedTraining(training_data){
        this.toggleUpdateModal();
        if(training_data){
            if(!training_data.tag){
                this.setState({
                    lockVideo: false
                })
            }
            this.setState({
                id: training_data.id,
                vimeo_id: training_data.vimeo_id,
                tag: training_data.tag,
                upsell_link: training_data.upsell_link,
                title: training_data.introduction_title,
                description: training_data.introduction_description
            })
        } else {
            this.setState({
                id: '0',
                vimeo_id: 0,
                tag: '',
                upsell_link: '',
                title: '',
                description: ''
            })
        }
    }

    updateTraining(event, updateTraining, refetch){
        updateTraining().then(async ({data}) => {
            toastr.clear()
            if(this.state.id == "0"){
                toastr.success("Training Video Successfully Created!","Saved!");
            } else {
                toastr.success("Training Video Successfully Updated!","Saved!");
            }
            this.toggleUpdateModal();
            refetch();
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    deleteTraining(event, deleteTraining, refetch){
        deleteTraining().then(async ({data}) => {
            toastr.clear()
            toastr.success("Training Video Successfully Deleted!","Deleted!");
            refetch();
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }
    
    toggleUpdateModal(){
        this.setState({
            openModal: !this.state.openModal
        })
    }

    // new features
    handleEditorChange(from, value){
        if(from == "full"){
            this.setState({
                message_full: value
            })
        } else {
            this.setState({
                message_trial: value
            })
        }
    }
    handleChange(event){
        var name = event.target.name;
        var value = event.target.value;
        if(event.target.type == "checkbox"){
            value = event.target.checked;
        }
        this.setState({ [name]: value })
    }
    addPanel(event, addPanel){
        addPanel().then(async ({data}) => {
            window.location.reload();
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }
    editPanel(event, editPanel, refetch){
        var removePopup = event.target.parentNode.parentNode.previousSibling.previousSibling.previousSibling;
        editPanel().then(async ({data}) => {
            toastr.clear();
            toastr.success("Panel Updated Successfully","Success!");
            refetch();
            removePopup.click()
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }
    deletePanel(event, deletePanel, refetch){
        deletePanel().then(async ({data}) => {
            toastr.clear();
            toastr.success("Panel has been deleted!","Deleted!");
            refetch();
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }
    enablePanel(event, enablePanel, refetch){
        enablePanel().then(async ({data}) => {
            toastr.clear();
            toastr.success("Panel has been activated","Activated!");
            refetch();
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }
    saveSection(event, saveSection){
        saveSection().then(async ({data}) => {
            window.location.reload();
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }
    editSection(event, editSection){
        editSection().then(async ({data}) => {
            toastr.clear();
            toastr.success("Section has been saved!","Saved!");
            this.state.refetchCustomPage();
            this.resetStateCustomPage();
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }
    deleteSection(event, deleteSection){
        deleteSection().then(async ({data}) => {
            toastr.clear();
            toastr.success("Section has been deleted!","Deleted!");
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }
    editSource(event, panel_id, data, refetch){
        this.setState({
            showSectionModal: !this.state.showSectionModal,
            panel_id: panel_id,
            lockPrivilege: data.page_lock_by_privilege,
            lockKartra: data.page_lock_by_tag,
            content_id: data.id,
            page_icon: data.page_icon,
            page_name: data.page_name,
            page_content: data.page_content,
            kartraTag: data.page_tag,
            fromPrivilege: data.page_privilege_from,
            toPrivilege: data.page_privilege_to,
            refetchCustomPage: refetch
        })
    }
    toggleAddSection(panelId, refetch){
        this.setState({
            ...resetStateCustomPage,
            panel_id: panelId,
            showSectionModal: !this.state.showSectionModal
        })
    }
    handlePageContentChange(page_content){
        this.setState({
            page_content: page_content
        })
    }
    resetStateCustomPage(){
        this.setState({
            ...resetStateCustomPage
        })
    }
    // end new features

    // for moving up and down of the custom page
    // Array.prototype.move = function(from,to){
    //     this.splice(to,0,this.splice(from,1)[0]);
    //     return this;
    // };
    // findIndexInData(data, property, value) {
    //     var result = -1;
    //     data.some(function (item, i) {
    //         if (item[property] === value) {
    //             result = i;
    //             return true;
    //         }
    //     });
    //     return result;
    // }
    // moveUp(ar, el) {
    //     var i = findIndexInData(ar, Object.keys(el)[0], Object.values(el)[0])
    //     ar.move(i, i-1)
    // }
    // moveDown(ar, el) {
    //     var i = findIndexInData(ar, Object.keys(el)[0], Object.values(el)[0])
    //     ar.move(i, i+1)
    // }
    // end moving up and down

    getHomepageVideo(){
        var payload = {"query":"{\n  getAdminHomepageVideo {\n    id\n    homepage_video_full\n    homepage_message_full\n    homepage_video_trial\n    homepage_message_trial\n  }\n}\n","variables":null,"operationName":null};
        fetch(points.clientUrl+'/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(result => {
            this.setState({
                id: result.data.getAdminHomepageVideo.id,
                h_full_video: result.data.getAdminHomepageVideo.homepage_video_full,
                message_full: result.data.getAdminHomepageVideo.homepage_message_full,
                h_trial_video: result.data.getAdminHomepageVideo.homepage_video_trial,
                message_trial: result.data.getAdminHomepageVideo.homepage_message_trial
            })
        });
    }

    changeHomepageVideo(changeHomepageVideo, from){
        changeHomepageVideo().then(async ({data}) => {
            toastr.clear();
            toastr.success(from+" Video Link & Message has been saved.","Success!");
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    appendThis(str, from){
        if(from == "full"){
            this.setState({
                message_full: this.state.message_full.substring(0, this.state.message_full.lastIndexOf('</p>')) + " " + str
            });
        } else {
            this.setState({
                message_trial: this.state.message_trial.substring(0, this.state.message_trial.lastIndexOf('</p>')) + " " + str
            });
        }
    }

    head() {
        return (
            <Helmet>
                <title>Admin Page Settings - Product List Genie</title>
            </Helmet>
        );
    }
    
    render() {
        return (
            <div className="admin page-container funnel">
                {/* Dashboard */}
                <div>
                    <div className="text-center">
                        <h2>Customize Homepage</h2>
                    </div>
                    <div className="column column_6_12">
                        <div className="text-center">
                            <h3>Dashboard Full User</h3> <br/>
                        </div>
                        <div className="column column_12_12">
                            <div className="form_wrap">
                                <div className="form_row">
                                    <div className="form_item">
                                        <div className="form_input">
                                            <label>HomePage Video (Vimeo Link)</label>
                                            <input type="text" name="h_full_video" value={this.state.h_full_video} onChange={this.handleChange.bind(this)} />
                                            <span className="bottom_border"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form_row">
                                    <div className="form_item">
                                        <div className="form_input">
                                            <label>Header Message</label><br /><br />
                                            <label>Template: <span className="clickable" onClick={() => this.appendThis('[FirstName]', 'full')}>[FirstName]</span>, <span className="clickable" onClick={() => this.appendThis('[LastName]', 'full')}>[LastName]</span></label> <br /><br />
                                            <CKEditor
                                                value={this.state.message_full}
                                                onChange={this.handleEditorChange.bind(this, 'full')}
                                                config={{ extraAllowedContent: 'div(*); p(*); strong(*);', toolbarGroups: [{ name: 'document', groups: ['mode', 'document'] }, { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] }] }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form_row">
                                    <div className="form_item">
                                        <div className="form_input form_buttons">
                                            <Mutation
                                                mutation={ADMIN_CHANGE_HOMEPAGE_VIDEO}
                                                variables={{
                                                    id: this.state.id,
                                                    url: this.state.h_full_video,
                                                    message: this.state.message_full,
                                                    from: 'full'
                                                }}>

                                                {(changeHomepageVideo, { data, loading, error }) => {
                                                    return <button className="btn" onClick={() => this.changeHomepageVideo(changeHomepageVideo, 'Full User')}>Save</button>;
                                                }}
                                            </Mutation>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column column_6_12">
                        <div className="text-center">
                            <h3>Dashboard Trial User</h3> <br/>
                        </div>
                        <div className="column column_12_12">
                            <div className="form_wrap">
                                <div className="form_row">
                                    <div className="form_item">
                                        <div className="form_input">
                                            <label>HomePage Video (Vimeo Link)</label>
                                            <input type="text" name="h_trial_video" value={this.state.h_trial_video} onChange={this.handleChange.bind(this)} />
                                            <span className="bottom_border"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form_row">
                                    <div className="form_item">
                                        <div className="form_input">
                                            <label>Header Message</label><br /><br />
                                            <label>Template: <span className="clickable" onClick={() => this.appendThis('[FirstName]', 'trial')}>[FirstName]</span>, <span className="clickable" onClick={() => this.appendThis('[LastName]', 'trial')}>[LastName]</span></label> <br /><br />
                                            <CKEditor
                                                value={this.state.message_trial}
                                                onChange={this.handleEditorChange.bind(this, 'trial')}
                                                config={{ extraAllowedContent: 'div(*); p(*); strong(*);', toolbarGroups: [{ name: 'document', groups: ['mode', 'document'] }, { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] }] }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form_row">
                                    <div className="form_item">
                                        <div className="form_input form_buttons text-right">
                                            <Mutation
                                                mutation={ADMIN_CHANGE_HOMEPAGE_VIDEO}
                                                variables={{
                                                    id: this.state.id,
                                                    url: this.state.h_trial_video,
                                                    message: this.state.message_trial,
                                                    from: 'trial'
                                                }}>

                                                {(changeHomepageVideo, { data, loading, error }) => {
                                                    return <button className="btn" onClick={() => this.changeHomepageVideo(changeHomepageVideo, 'Trial User')}>Save</button>;
                                                }}
                                            </Mutation>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Custom pages */}
                <br/><br/><br/>
                <div className="text-center clear">
                    <div className="float-right">
                        <div className="column column_4_12">
                            <Popup trigger={<button className="add-button-circle" title="Add Custom Page">+</button>} position="left bottom" on="click">
                                <div style={{ width: 300, lineHeight: '2.5rem', textAlign: 'left', padding: 10 }} className="form_buttons">
                                    <style dangerouslySetInnerHTML={{__html: ` .popup-content { width: auto !important; } `}} />
                                    <h5>Enter Panel Name: </h5>
                                    <div className="form_wrap">
                                        <div className="form_row">
                                            <div className="form_item">
                                                <div className="form_input">
                                                    <input type="text" name="panel_name" value={this.state.panel_name} onChange={this.handleChange.bind(this)} />
                                                    <span className="bottom_border"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <h5>Enter Panel Description: </h5>
                                    <div className="form_wrap">
                                        <div className="form_row">
                                            <div className="form_item">
                                                <div className="form_input">
                                                    <input type="text" name="panel_description" value={this.state.panel_description} onChange={this.handleChange.bind(this)} />
                                                    <span className="bottom_border"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h5>Enter Panel Image URL: </h5>
                                    <div className="form_wrap">
                                        <div className="form_row">
                                            <div className="form_item">
                                                <div className="form_input">
                                                    <input type="text" name="panel_img_url" value={this.state.panel_img_url} onChange={this.handleChange.bind(this)} />
                                                    <span className="bottom_border"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="column column_7_12" style={{ padding: 0 }}>
                                        <h5>Select Panel Type: </h5>
                                    </div>
                                    <div className="column column_5_12 text-right" style={{ padding: 0 }}>
                                        <label className={"cursor-pointer "+(this.state.addPanelType ? "color-dark-red" : "color-green")} onClick={() => this.setState({ addPanelType: !this.state.addPanelType })}>
                                            {this.state.addPanelType ? <i><span className="fas fa-times" /> Select Type</i> : <i><span className="fas fa-plus" /> Add new</i>}
                                        </label>
                                    </div>
                                    <span className="clear" />
                                    {this.state.addPanelType && <input className="row-separator" type="text" name="panel_type" value={this.state.panel_type} onChange={this.handleChange.bind(this)} />}
                                    {!this.state.addPanelType &&
                                        <Query query={GET_ADMIN_CUSTOM_PAGES(`{ custom_page { navigation_type } }`)}>
                                            {({ data, loading, refetch, error }) => {
                                                if (loading) return <label className="font-small">Loading please wait...</label>;
                                                if (error) return <label className="font-small">Unable to get panel type please refresh the page</label>;
                                                let options = [<option key={0} value="trainings">Training</option>];
                                                if (data.getAdminSettings.custom_page.length !== 0) {
                                                    options = [];
                                                    const result = points.groupByArrayOfObject(data.getAdminSettings.custom_page, "navigation_type");
                                                    result.forEach((el, index) => {
                                                        options.push(<option key={index} value={el.navigation_type}>{points.capitalizeWord(el.navigation_type)}</option>)
                                                    })
                                                }
                                                return <SelectTag className="row-separator" name="panel_type" value={this.state.panel_type} options={options} onChange={event => this.handleChange(event)} />;
                                            }}
                                        </Query>
                                    }
                                    <Mutation
                                        mutation={ADMIN_ADD_PANEL}
                                        variables={{
                                            panel_name: this.state.panel_name,
                                            panel_type: this.state.panel_type,
                                            panel_description: this.state.panel_description,
                                            panel_img_url: this.state.panel_img_url
                                        }}>
                                        {(addPanel, { data, loading, error }) => {
                                            return <button className="btn stretch-width" style={{ margin: 0 }} onClick={event => this.addPanel(event, addPanel)}>Save</button>;
                                        }}
                                    </Mutation>
                                </div>
                            </Popup>
                        </div>
                    </div>
                    <h2>Custom Pages</h2>
                </div> <br/> <br/>
                <Query query={GET_ADMIN_CUSTOM_PAGES(`{ custom_page { id active navigation_name navigation_type description img_url } }`)} >
                    {({data, loading, refetch}) => {
                        if(loading) return (<div className="text-center" style={{marginTop: '20rem'}}> <Loading height={200} width={200} /> </div>);
                        if(data.getAdminSettings.custom_page.length == 0){
                            return (
                                <div className="text-center">
                                    <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>No Custom Panel Found.</span>
                                </div>
                            );
                        }
                        if(data.getAdminSettings.custom_page != 0){
                            return data.getAdminSettings.custom_page.map((pageContent,i) => {
                                return (
                                    <div className="product-card" key={i}>
                                        <div className="product-details" style={{overflow: 'hidden'}}>
                                            <div className="float-right">
                                                <Mutation mutation={ADMIN_ENABLE_PANEL} variables={{ id: pageContent.id, active: pageContent.active ? false : true, }}>
                                                    {(enablePanel, { data, loading, error }) => {
                                                        return(
                                                            <button className="pbbtn" onClick={event => this.enablePanel(event, enablePanel, refetch)} style={{padding: '5px 0', margin: '0 20px 0 0', background: 'transparent', fontSize: 12, color: pageContent.active ? '#00bf60' : '#ccc'}}>
                                                                Activate
                                                            </button>
                                                        );
                                                    }}
                                                </Mutation>
                                                <Popup
                                                    trigger={
                                                        <button id={"delete"+i} className="pbbtn" style={{padding: '5px 0', margin: '0 20px 0 0', background: 'transparent', color: 'red', fontSize: 12}}>
                                                            <i className="fas fa-trash"></i> Delete
                                                        </button>
                                                    }
                                                    position="top right"
                                                    on="click" className="text-center">
                                                    <div style={{width: '100%', lineHeight: '2.5rem', padding: 5}}>
                                                        <style dangerouslySetInnerHTML={{__html: ` .popup-content { width: auto !important; } `}} />

                                                        <h5>Are you sure you want to delete</h5>
                                                        <h5>{pageContent.navigation_name} ?</h5>

                                                        <Mutation
                                                            mutation={ADMIN_DELETE_PANEL}
                                                            variables={{
                                                                id: pageContent.id,
                                                            }}>

                                                            {(deletePanel, { data, loading, error }) => {
                                                                return(
                                                                    <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={event => this.deletePanel(event, deletePanel, refetch)}>
                                                                        <i className="fas fa-check"></i>
                                                                    </button>
                                                                );
                                                            }}
                                                        </Mutation>
                                                        
                                                        &nbsp; | &nbsp;
                                                        <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20}} onClick={() => document.getElementById("delete"+i).click()}>
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                </Popup>
                                                <button className="add-button-circle" title="Add Section" onClick={event => this.toggleAddSection(pageContent.id)}>+</button>
                                            </div>
                                            <h2>
                                                <span className="capitalize">{pageContent.navigation_name.toLowerCase()}</span>
                                                <Popup
                                                    trigger={
                                                        <span className="fas fa-edit" style={{fontSize: '2rem', margin: '0 0 0 10px', cursor: 'pointer'}} title="Edit Title"></span>
                                                    }
                                                    position="bottom center"
                                                    on="click" onOpen={() => this.setState({ panel_type: "", addPanelType: false })} onClose={() => this.setState({ panel_type: 'training' })}>
                                                    <div style={{width: 300, lineHeight: '2.5rem', textAlign: 'left', padding: 20}} className="form_buttons">
                                                        <style dangerouslySetInnerHTML={{__html: ` .popup-content { width: auto !important; } `}} />

                                                        <h4 style={{margin: 0}}>Enter Panel Name: </h4>
                                                        <div className="form_wrap">
                                                            <div className="form_row">
                                                                <div className="form_item">
                                                                    <div className="form_input">
                                                                        <input type="text" name="panel_name" defaultValue={pageContent.navigation_name} onChange={this.handleChange.bind(this)} />
                                                                        <span className="bottom_border"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <h4 style={{margin: 0}}>Enter Panel Description: </h4>
                                                        <div className="form_wrap">
                                                            <div className="form_row">
                                                                <div className="form_item">
                                                                    <div className="form_input">
                                                                        <input type="text" name="panel_description" defaultValue={pageContent.description} onChange={this.handleChange.bind(this)} />
                                                                        <span className="bottom_border"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <h4 style={{margin: 0}}>Enter Panel Image URL: </h4>
                                                        <div className="form_wrap">
                                                            <div className="form_row">
                                                                <div className="form_item">
                                                                    <div className="form_input">
                                                                        <input type="text" name="panel_img_url" defaultValue={pageContent.img_url} onChange={this.handleChange.bind(this)} />
                                                                        <span className="bottom_border"></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="column column_7_12" style={{ padding: 0 }}>
                                                            <h4 style={{ margin: 0, lineHeight: 2 }}>Select Panel Type: </h4>
                                                        </div>
                                                        <div className="column column_5_12 text-right" style={{ padding: 0, fontSize: '0.5em' }}>
                                                            <label className={"cursor-pointer "+(this.state.addPanelType ? "color-dark-red" : "color-green")} onClick={() => this.setState({ addPanelType: !this.state.addPanelType })}>
                                                                {this.state.addPanelType ?
                                                                    <i><span className="fas fa-times" /> Select Type</i>
                                                                :
                                                                    <i><span className="fas fa-plus" /> Add new</i>
                                                                }
                                                            </label>
                                                        </div>
                                                        <span className="clear" />
                                                        {this.state.addPanelType &&
                                                            <input className="row-separator" type="text" name="panel_type" value={this.state.panel_type || pageContent.navigation_type} onChange={this.handleChange.bind(this)} />
                                                        }
                                                        {!this.state.addPanelType &&
                                                            <Query query={GET_ADMIN_CUSTOM_PAGES(`{ custom_page { navigation_type } }`)}>
                                                                {({ data, loading, refetch, error }) => {
                                                                    if(loading) return <label className="font-small">Loading please wait...</label>;
                                                                    if(error) return <label className="font-small">Unable to get panel type please refresh the page</label>;
                                                                    var options = [
                                                                        <option key={0} value="training">Training</option>
                                                                    ];
                                                                    if (!loading && data.getAdminSettings.custom_page.leangth != 0) {
                                                                        options = [];
                                                                        const result = points.groupByArrayOfObject(data.getAdminSettings.custom_page, "navigation_type");
                                                                        result.forEach((el, index) => {
                                                                            options.push(<option key={index} value={el.navigation_type}>{points.capitalizeWord(el.navigation_type)}</option>)
                                                                        })
                                                                    }
                                                                    return <SelectTag className="row-separator" name="panel_type" value={this.state.panel_type ? this.state.panel_type : pageContent.navigation_type } options={options} onChange={event => this.handleChange(event)} />;
                                                                }}
                                                            </Query>
                                                        }

                                                        <Mutation
                                                            mutation={ADMIN_EDIT_PANEL}
                                                            variables={{
                                                                id: pageContent.id,
                                                                panel_name: this.state.panel_name ? this.state.panel_name : pageContent.navigation_name,
                                                                panel_type: this.state.panel_type ? this.state.panel_type : pageContent.navigation_type,
                                                                panel_description: this.state.panel_description ? this.state.panel_description : pageContent.description,
                                                                panel_img_url: this.state.panel_img_url ? this.state.panel_img_url : pageContent.img_url
                                                            }}>

                                                            {(editPanel, { data, loading, error }) => {
                                                                return(
                                                                    <button className="btn stretch-width" style={{margin: 0}} onClick={event => this.editPanel(event, editPanel, refetch)}>
                                                                        Save
                                                                    </button>
                                                                );
                                                            }}
                                                        </Mutation>
                                                    </div>
                                                </Popup>
                                            </h2>
                                            
                                            <Query query={GET_ADMIN_CUSTOM_PAGE_DATA} variables={{ panel_id: pageContent.id }}>
                                                {({data, loading, data_refetch}) => {
                                                    if(loading) return (<div className="text-center" style={{marginTop: '20rem'}}> <Loading height={200} width={200} /> </div>);
                                                    if(data.getCustomPageOfPanel.length == 0){
                                                        return (
                                                            <div className="text-center">
                                                                <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>No Section found</span>
                                                            </div>
                                                        );
                                                    }
                                                    if(data.getCustomPageOfPanel.length != 0){
                                                        return data.getCustomPageOfPanel.map((content,x) => {
                                                            return (
                                                                <div className="column column_3_12" key={x}>
                                                                    <div className="product-card">
                                                                        <div className="product-details">
                                                                            <h4 style={{margin: '20px 0 0'}}>{content.page_name}</h4>
                                                                            <div className="product-bottom-details" style={{paddingTop: 10}}>
                                                                                <div className="text-right" style={{width: '100%'}}>
                                                                                    <button id={"child-edit"+x} className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'green', fontSize: 12}} onClick={event => this.editSource(event, pageContent.id, content, refetch)}>
                                                                                        <i className="fas fa-edit"></i> Edit
                                                                                    </button>
                                                                                    &nbsp; | &nbsp;
                                                                                    <Popup
                                                                                        trigger={
                                                                                            <button id={"child-delete"+x} className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 12}}>
                                                                                                <i className="fas fa-trash"></i> Delete
                                                                                            </button>
                                                                                        }
                                                                                        position="top center"
                                                                                        on="click" className="text-center">
                                                                                        <div style={{width: '100%', lineHeight: '2.5rem'}}>
                                                                                            <h5>Are you sure you want to delete</h5>
                                                                                            <h5>{content.page_name} ?</h5>
                                                                                            <Mutation
                                                                                                mutation={ADMIN_DELETE_SECTION}
                                                                                                variables={{
                                                                                                    id: content.id,
                                                                                                }} refetchQueries={() => [
                                                                                                    { query: GET_ADMIN_CUSTOM_PAGE_DATA, variables: {panel_id:pageContent.id} }
                                                                                                ]}>
                                        
                                                                                                {(deleteSection, { data, loading, error }) => {
                                                                                                    return(
                                                                                                        <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={event => this.deleteSection(event, deleteSection, data_refetch)}>
                                                                                                            <i className="fas fa-check"></i>
                                                                                                        </button>
                                                                                                    );
                                                                                                }}
                                                                                            </Mutation>
                                                                                            
                                                                                            &nbsp; | &nbsp;
                                                                                            <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20}} onClick={() => document.getElementById("child-delete"+x).click()}>
                                                                                                <i className="fas fa-times"></i>
                                                                                            </button>
                                                                                        </div>
                                                                                    </Popup>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                    return null;
                                                }}
                                            </Query>
                                        </div>
                                    </div>
                                );
                            })
                        }
                        return null;
                    }}
                </Query>

                {/* For modals */}
                {(() => {
                    if(this.state.showSectionModal){
                        return(
                            <Modal open={this.state.showSectionModal} closeModal={this.toggleAddSection} session={this.props.session} style={{width: '70%'}}>
                                <div className="page-container">
                                    <div className="form_wrap">
                                        <div className="form_row">
                                            <div className="column column_3_12">
                                                <div className="product-card">
                                                    <div className="product-details">
                                                        <div className="form_item">
                                                            <div className="form_input">
                                                                <div className="float-right">
                                                                    <span className={this.state.page_icon} title="icon preview"></span>
                                                                </div>
                                                                <label>Page icon: </label>
                                                                <select name="page_icon" value={this.state.page_icon} onChange={this.handleChange.bind(this)} style={{backgroundColor: 'transparent'}} className="input-as-text stretch-width" >
                                                                    <option value="fas fa-lock-open">Lock Open</option>
                                                                    <option value="fas fa-adjust">adjust</option>
                                                                    <option value="fas fa-asterisk">asterisk</option>
                                                                    <option value="fas fa-barcode">barcode</option>
                                                                    <option value="fas fa-beer">beer</option>
                                                                    <option value="fas fa-bell">bell</option>
                                                                    <option value="fas fa-bolt">bolt</option>
                                                                    <option value="fas fa-book">book</option>
                                                                    <option value="fas fa-bookmark">bookmark</option>
                                                                    <option value="fas fa-briefcase">briefcase</option>
                                                                    <option value="fas fa-calendar">calendar</option>
                                                                    <option value="fas fa-camera">camera</option>
                                                                    <option value="fas fa-camera-retro">camera-retro</option>
                                                                    <option value="fas fa-certificate">certificate</option>
                                                                    <option value="fas fa-check">check</option>
                                                                    <option value="fas fa-circle">circle</option>
                                                                    <option value="fas fa-cloud">cloud</option>
                                                                    <option value="fas fa-coffee">coffee</option>
                                                                    <option value="fas fa-cog">cog</option>
                                                                    <option value="fas fa-cogs">cogs</option>
                                                                    <option value="fas fa-comment">comment</option>
                                                                    <option value="fas fa-comment-alt">comment-alt</option>
                                                                    <option value="fas fa-comments">comments</option>
                                                                    <option value="fas fa-credit-card">credit-card</option>
                                                                    <option value="fas fa-desktop">desktop</option>
                                                                    <option value="fas fa-download">download</option>
                                                                    <option value="fas fa-edit">edit</option>
                                                                    <option value="fas fa-envelope">envelope</option>
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
                                                                <label>Page Name: </label>
                                                                <input type="text" name="page_name" value={this.state.page_name} onChange={this.handleChange.bind(this)} />
                                                                <span className="bottom_border"></span>
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
                                                                <div className="float-right">
                                                                    <Popup
                                                                        trigger={<label style={{cursor: 'pointer'}} htmlFor="lockKartra"><input id="lockKartra" name="lockKartra" type="checkbox" checked={this.state.lockKartra} onChange={this.handleChange.bind(this)} style={{width: 'auto'}}/>Lock</label>}
                                                                        position="bottom right"
                                                                        on="hover" className="text-center">
                                                                        <div>
                                                                            <p style={{margin: 0}}>Use Kartra Tag to unlock</p>
                                                                        </div>
                                                                    </Popup>
                                                                </div>
                                                                <label>Kartra Tag: </label>
                                                                <input type="text" name="kartraTag" value={this.state.kartraTag} onChange={this.handleChange.bind(this)} disabled={!this.state.lockKartra} />
                                                                <span className="bottom_border"></span>
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
                                                                <div className="float-right">
                                                                    <Popup
                                                                        trigger={<label style={{cursor: 'pointer'}} htmlFor="lockPrivilege"><input id="lockPrivilege" name="lockPrivilege" type="checkbox" checked={this.state.lockPrivilege} onChange={this.handleChange.bind(this)} style={{width: 'auto'}}/>Lock</label>}
                                                                        position="bottom right"
                                                                        on="hover" className="text-center">
                                                                        <div>
                                                                            <p style={{margin: 0}}>Use Privilege to unlock</p>
                                                                        </div>
                                                                    </Popup>
                                                                </div>
                                                                <label>By Privilege: </label>
                                                                <div style={{overflow: 'hidden', width: '100%'}}>
                                                                    <div className="column column_12_12">
                                                                        <div className="column column_5_12">
                                                                            <input type="number" name="fromPrivilege" value={this.state.fromPrivilege} onChange={this.handleChange.bind(this)} disabled={!this.state.lockPrivilege} style={{borderBottom: 'solid 1px #ccc'}} />
                                                                        </div>
                                                                        <div className="column column_2_12 text-center">
                                                                            <span style={{lineHeight: 2.6}}>to</span>
                                                                        </div>
                                                                        <div className="column column_5_12">
                                                                            <input type="number" name="toPrivilege" value={this.state.toPrivilege} onChange={this.handleChange.bind(this)} disabled={!this.state.lockPrivilege} style={{borderBottom: 'solid 1px #ccc'}} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_12_12">
                                                <div className="product-card">
                                                    <div className="product-details">
                                                        <div className="form_item">
                                                            <div className="float-right">
                                                                <Popup
                                                                    trigger={<span className="fas fa-desktop" style={{cursor: 'pointer'}} title="Preview"></span>}
                                                                    position="left top"
                                                                    on="click" className="points-tooltip">
                                                                    <div style={{position: 'relative'}} className="preview-website">
                                                                        <div className="column column_2_12" style={{backgroundColor: '#252f37', height: '100rem'}}>
                                                                            &nbsp;
                                                                        </div>
                                                                        <div className="column column_10_12 text-center" style={{backgroundColor: '#00c587'}}>
                                                                            &nbsp;<br />&nbsp;
                                                                        </div>
                                                                        <div className="column column_10_12">
                                                                            <div style={{zoom: '45%'}} dangerouslySetInnerHTML={{__html: this.state.page_content}} />
                                                                        </div>
                                                                    </div>
                                                                </Popup>
                                                            </div>
                                                            <label>Page Content: <span style={{fontSize: 12}}>(iframe: 1000x500)</span></label> <br/> <br/>
                                                            <CKEditor
                                                                value={this.state.page_content}
                                                                onChange={this.handlePageContentChange.bind(this)}
                                                                config={{ extraAllowedContent: 'div(*); p(*); strong(*); iframe[*]; img(*)' }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form_buttons clear text-right">
                                                <br/>
                                                {this.state.panel_id && !this.state.content_id ?
                                                    <Mutation
                                                        mutation={ADMIN_SAVE_SECTION}
                                                        variables={{
                                                            id: this.state.panel_id,
                                                            page_lock_by_tag: this.state.lockKartra,
                                                            page_lock_by_privilege: this.state.lockPrivilege,
                                                            page_icon: this.state.page_icon,
                                                            page_name: this.state.page_name,
                                                            page_content: this.state.page_content,
                                                            page_tag: this.state.lockKartra ? this.state.kartraTag : '',
                                                            page_privilege_from: this.state.lockPrivilege ? parseInt(this.state.fromPrivilege) : -1,
                                                            page_privilege_to: this.state.lockPrivilege ? parseInt(this.state.toPrivilege) : -1
                                                        }}>
        
                                                        {(saveSection, { data, loading, error }) => {
                                                            return(
                                                                <button className="btn" onClick={event => this.saveSection(event, saveSection)}>Save</button>
                                                            );
                                                        }}
                                                    </Mutation>
                                                : ''}
                                                
                                                {this.state.content_id &&
                                                    <Mutation
                                                        mutation={ADMIN_EDIT_SECTION}
                                                        variables={{
                                                            id: this.state.content_id,
                                                            page_lock_by_tag: this.state.lockKartra,
                                                            page_lock_by_privilege: this.state.lockPrivilege,
                                                            page_icon: this.state.page_icon,
                                                            page_name: this.state.page_name,
                                                            page_content: this.state.page_content,
                                                            page_tag: this.state.lockKartra ? this.state.kartraTag : '',
                                                            page_privilege_from: this.state.lockPrivilege ? parseInt(this.state.fromPrivilege) : -1,
                                                            page_privilege_to: this.state.lockPrivilege ? parseInt(this.state.toPrivilege) : -1
                                                        }} refetchQueries={() => [
                                                            { query: GET_ADMIN_CUSTOM_PAGE_DATA, variables: { panel_id: this.state.panel_id } }
                                                        ]}>
        
                                                        {(editSection, { data, loading, error }) => {
                                                            return(
                                                                <button className="btn" onClick={event => this.editSection(event, editSection)}>Update</button>
                                                            );
                                                        }}
                                                    </Mutation>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                        );
                    }
                    return null;
                })()}
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AdminSettings);