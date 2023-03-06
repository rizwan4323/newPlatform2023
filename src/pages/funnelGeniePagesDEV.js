import React from 'react';
import moment from 'moment';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { GET_FUNNEL_BY_ID, GET_FUNNEL_PAGE_LIST, SET_FUNNEL_PAGE_AS_ROOT, REMOVE_FUNNEL_PAGE_AS_ROOT, SAVE_FUNNEL_PAGE_LIST, REMOVE_FUNNELGENIE_PAGE, GET_FUNNEL_LIST, UPDATE_FUNNELGENIE_PAGE_SETTING, GET_FUNNEL_PAGE_BY_ID, SAVE_FUNNEL_LIST_SPLIT_PAGE, UPDATE_FUNNEL_LIST_SPLIT_PAGE, GET_PAGE_TEMPLATES } from '../queries';
import { Query, Mutation } from 'react-apollo';
import toastr from 'toastr';
import Modal from '../components/ModalComponent';
import ButtonWithPopup from '../components/buttonWithPopup';
import Loading from '../components/loading';
import SelectTag from '../components/selectTag';
import Tooltip from '../components/tooltip';
const condition = require('../../Global_Conditions');
const points = require('../../Global_Values');
const designTemplate = require('../../FunnelGenieTemplate');

const funnel_details = {
	funnel_name: '',
    domain_name: '',
    funnel_facebook_id: '',
    funnel_facebook_access_token: '',
    page_list: []
}

const page_settings = {
    open_page_settings: false,
    page_id: '',
    page_type: '',
    page_name: '',
    facebook_id: '',
    funnel_ga: '',
    funnel_fga: '',
    page_title: '',
    page_description: '',
    page_og_image: '',
    page_keyword: ''
}

const add_new_page = {
    createModal: false,
    openPreview: false,
    image_preview: '',
    design_list: designTemplate.homepages,
    create_path: '',
    create_page_type: '',
    create_selected_design: '',
    create_design_type: 'ecom'
}

const split_data = {
    open_split_data: false,
    stat_loading: true,
    stat_data: [],
    split_data: {},
    split_page_a: "50",
    split_page_b: "50",
    split_notes: "",
    page_a_note: "",
    page_b_note: ""
}

class FunnelGeniePagesDEV extends React.Component {
    constructor(props) {
        super();
        this.state = {
            getFunnelPageListTempAuto: [],
            getFunnelPageListTempNA: [],
            ...add_new_page,
            ...funnel_details,
            ...page_settings
        }
    }

    componentDidMount() {
        toastr.options = points.toastrInitialize();
        if(this.refetchPageList) this.refetchPageList();
    }

    handleOnChange(event, bool){

        console.log("YYYYYYYYYY", event);
        var name = typeof event.target != 'undefined' ? event.target.name : event.name;
        var value = typeof event.target != 'undefined' ? event.target.value : event.value;
        
        this.setState({ [name]: value }, () => {
            console.log("XXXXXXXXX", { [name]: value });
            if(name == "create_page_type") {
                var designList = designTemplate.homepages;
                if(value == "checkout"){
                    designList = designTemplate.checkouts;
                } else if(value == "thank-you-page"){
                    designList = designTemplate.thankyous;
                } else if(value == "upsell"){
                    designList = designTemplate.upsells;
                } else if(value == "downsell"){
                    designList = designTemplate.downsells;
                }
                this.selectThisDesign();
                typeof bool == 'undefined' ? this.setState({ design_list: designList, create_selected_design: '', image_preview: '' }) : void 0;
            }
        })
    }

    togglePageSettings(page_data){
        if(page_data){
            var headerScript = "";
            if(page_data.funnel_header_analytics) headerScript = page_data.funnel_header_analytics;
            this.setState({
                page_id: page_data.id,
                page_type: page_data.page_type,
                page_name: page_data.path,
                funnel_ga: headerScript,
                funnel_fga: page_data.funnel_footer_analytics || "",
                page_title: page_data.page_title || "",
                page_description: page_data.page_description || "",
                page_og_image: page_data.page_og_image_link || "",
                page_keyword: page_data.page_keyword || "",
                open_page_settings: !this.state.open_page_settings
            })
        } else {
            this.setState({ ...page_settings, open_page_settings: !this.state.open_page_settings })
        }
    }

    toggleCreateModal(){
        this.setState({ ...add_new_page, createModal: !this.state.createModal }, () => this.selectThisDesign());
    }

    toggleOpenSplitData(page_data){
        var saveState = { ...split_data };
        saveState.open_split_data = !this.state.open_split_data;
        if(page_data) {
            saveState.split_data = page_data;
            if(page_data.split_bias) {
                saveState.split_page_a = page_data.split_bias.toString();
                saveState.split_page_b = Math.abs(saveState.split_page_a - 100).toString();
            };
        };
        this.setState({ ...saveState }, () => this.getStatData());
    }

    selectThisDesign(state_name, design, image_preview){
        var saveState = {};
        if(state_name) saveState = { [state_name]: true, create_selected_design: design, image_preview }
        for(var keys in this.state) {
            const stateName = this.state[keys];
            if(keys.includes("selectedDesign") && keys != state_name) {
                saveState[keys] = false;
            }
        }
        this.setState(saveState)
    }

    getPageDescription(page, use){
        var state = this.state;
        if(use == "display"){
            return state.split_data.split_notes && state.split_data.split_notes.split(",")[page == "a" ? 0 : 1] ? state.split_data.split_notes.split(",")[page == "a" ? 0 : 1] : "Add note";
        } else if(use == "mutate") {
            return state["page_"+page+"_note"] ? state["page_"+page+"_note"] : state.split_data.split_notes && state.split_data.split_notes.split(",")[page == "a" ? 0 : 1];
        }
    }

    getStatData(){
        var page_id = this.state.split_data.id;
        var statPayload = {"query":"{   everyPagebyCreatorAndFunnel(creatorID:\""+this.props.session.getCurrentUser.id+"\" funnelName:\""+ this.state.funnel_name +"\"){   splitPage   purchased   pageType   pageID   date   conversion   device   fromPage   }}","variables":null,"operationName":null};
        points.customFetch('https://stats.productlistgenie.io/graphql', 'POST', statPayload, result => {
            this.setState({ stat_loading: false, stat_data: result.data.everyPagebyCreatorAndFunnel.filter(el => el.pageID == page_id && el.splitPage) });
        });
    }

    uploadBias(callback){
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.clear();
        toastr.info("Please wait...", "Uploading Split Test Percentage");
        var payload = {
            payload: {
                "query": "mutation($id: String, $bias: Int){\n  updatePage(id: $id, bias: $bias){\n    id\n   }\n}",
                "variables": { id: this.state.split_data.published_page_id, bias: this.state.split_page_a ? parseInt(this.state.split_page_a) : null }
            }
        }
        points.customFetch('/send-html-to-domain', 'POST', payload, () => callback ? callback() : {});
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Funnel Genie Pages (DEV) - Product List Genie</title>
            </Helmet>
        );
    }
    toColor(str) {
        var arr1 = [];
        for (var n = 0, l = str.length; n < l; n ++) 
         {
            var hex = Number(str.charCodeAt(n)).toString(16);
            arr1.push(hex);
         }
        return arr1.join('').slice(0,6);
       }

    render() {
        const state = this.state;
        const currentUser = this.props.session.getCurrentUser;
        const funnel_id = this.props.match.params.funnel_id;
        if(state.creator && state.creator != currentUser.id) {
            return (
                <div className="funnel">
                    {this.head()}
                    <div className="center-vertical-parent" style={{ height: '90vh', width: '100%' }}>
                        <div className="center-vertical">
                            <img src="/assets/graphics/no-result.svg" style={{ height: '50vh' }} />
                            <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! THAT'S AN ERROR!</h4> <br />
                            <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>You don't have permission to view this page.</label>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="funnel">
                {this.head()}
				<Query query={GET_FUNNEL_BY_ID(`{ creator funnel_name domain_name funnel_facebook_id funnel_facebook_access_token }`)} variables={{ funnel_id: funnel_id }} notifyOnNetworkStatusChange={true} onCompleted={data => this.setState({ creator: data.getFunnelById.creator, funnel_name: data.getFunnelById.funnel_name, domain_name: data.getFunnelById.domain_name, funnel_facebook_id: data.getFunnelById.funnel_facebook_id, funnel_facebook_access_token: data.getFunnelById.funnel_facebook_access_token })}>
                    {({ data, loading, refetch, error }) => null}
                </Query>
                <div style={{display: 'flex', alignItems: 'center', padding: 20, backgroundColor: '#f4f9fd', overflow: 'hidden'}}>
                    <div style={{width: '20%'}}>
                        <Link to="/funnel-genie-main" className="btn" style={{fontSize: 15, padding: '5px 25px'}}>
                            <span className="fas fa-arrow-left" />
                        </Link>
                    </div>
                    <div className="text-center ellipsis" style={{width: '60%'}}>
                        <h4 className="title">{points.presentableFunnelName(state.funnel_name ? state.funnel_name : "LOADING . . .").toUpperCase()}</h4>
                    </div>
                    <div className="text-right" style={{width: '20%'}}>
                        <button className="btn-success font-roboto-light" onClick={() => this.toggleCreateModal()}><span className="fas fa-plus" /> CREATE PAGE</button>
                    </div>
                </div> 
                <div className="page-container">
                    {/* Normal Pages */}
                    <div className="column column_9_12" style={{ height: 'calc(100vh - 133px)', overflow: 'auto' }}>
                        <div className="flex-container" style={{justifyContent: 'flex-start'}}>
							<Query query={
								GET_FUNNEL_PAGE_LIST(`{ id published_page_id path page_type page_is_root split_design split_screenshot split_bias split_notes design { date screenshot_url } page_title page_description page_og_image_link page_keyword funnel_header_analytics funnel_footer_analytics }`)
							} variables={{ funnel_id, loadLastDesign: true }} notifyOnNetworkStatusChange={true} onCompleted={data => {
                                var pages = [];
								var allPages =JSON.parse(JSON.stringify(data.getFunnelPageList));
                                var autoGeneratedPages = allPages.filter(el => el.page_type == "generated_page");
                                var notAutoGeneratedPages = allPages.filter(el => el.page_type != "generated_page");
                                allPages.forEach(page => {
                                    pages.push({ id: page.id, path: page.path, complete_path: "/" + state.funnel_name + (page.path ? "/" + page.path : page.path) })
                                });
								this.setState({ page_list: pages, getFunnelPageListTempAuto: autoGeneratedPages, getFunnelPageListTempNA: notAutoGeneratedPages });
							}}>
								{({ data, loading, refetch, error }) => {
                                    this.refetchPageList = refetch;
									if (loading && state.getFunnelPageListTempNA.length == 0) {
										return (
											<div style={{ margin: '0 auto' }}>
												<Loading width={200} height={200} />
											</div>
										)
									}
									if (error) {
										points.toastrPrompt(toastr, "error", "Please refresh the page", "An error has occurred");
										return null;
									}
									var dataToUse = [];
                                    if(data.getFunnelPageList.length == 0){
                                        dataToUse = state.getFunnelPageListTempNA;
                                    } else {
                                        var notAutoGeneratedPages =JSON.parse(JSON.stringify(data.getFunnelPageList));
                                        dataToUse = notAutoGeneratedPages.filter(el => el.page_type != "generated_page");
									}
									return dataToUse.map((page, index) => {
                                        var duplicateCounterRegex = new RegExp(/\-\d+/, "g");
										var path = page.path ? page.path : "homepage";
										var designLastObject = page.design.length != 0 ? page.design[page.design.length - 1] : null;
										var lastSaved = designLastObject ? parseInt(designLastObject.date) : null;
                                        var pageLink = page.page_is_root ? "https://" + state.domain_name : "https://" + state.domain_name + "/" + state.funnel_name + (page.path ? "/" + page.path : "");
										return (
											<div className="responsive-box product-card" style={{ boxShadow: page.page_is_root ? '0 0px 5px #f28706' : '0 2px 7px #dfdfdf', margin: 10 }} key={index}>
												{loading &&
                                                    <div className="loading-text-container center-vertical">
                                                        <Loading width={150} height={150} />
                                                    </div>
                                                }
												<div className="product-details one-line-ellipsis">
													<div style={{ display: 'flex', alignItems: 'center' }}>
														<div className="ellipsis" style={{ width: '85%' }}>
                                                            <span className={points.getPageIcon(path, page.page_type)} style={{color: '#26c686'}} /> &nbsp;
                                                            <Link to={{ pathname: "/funnel-genie", state: { id: page.id, pages: state.page_list } }} className="font-roboto-light" style={{ borderRadius: 3 }}>
                                                                <label className="clickable capitalize font-roboto-bold" style={{ fontSize: '0.875em' }}>
                                                                    {points.presentableFunnelName(path)}
                                                                </label>
                                                            </Link>
														</div>
                                                        <div style={{ width: '5%', fontSize: '0.7em' }}>
                                                            <ButtonWithPopup data={{
                                                                triggerDOM: <span id="hover" className="clickable fas fa-link" onClick={() => {
																	points.copyStringToClipboard(pageLink);
																	points.toastrPrompt
																	points.toastrPrompt(toastr, "success", "Successfully copied to clipboard", "Success");
                                                                }} />,
                                                                popupPosition: "left center",
																title: "",
																style: { borderRadius: 5, padding: 5 },
                                                                text: <label className="font-roboto-light">Copy to clipboard</label>,
                                                                action: () => {},
                                                                triggerID: "hover",
                                                                loading: false,
                                                                padding: 5,
                                                                checkORtimesButton: false,
                                                                onAction: 'hover'
                                                            }} />
														</div>
                                                        <div className="text-right" style={{ width: '10%' }}>
															<ButtonWithPopup data={{
																triggerDOM: <span id={"more_" + index} className="fas fa-ellipsis-h clickable" style={{ color: '#ff8000', opacity: 0.7 }} />,
																popupPosition: "bottom right",
																title: "",
																text: (
																	<ul className="item-list font-questrial-medium" style={{ textAlign: 'left' }}>
                                                                        {!page.split_design && !page.page_is_root ?
                                                                            <Mutation mutation={SET_FUNNEL_PAGE_AS_ROOT} variables={{ funnel_id, page_id: page.id }} >
                                                                                {(setFunnelPageAsRoot, { data, loading, error }) => {
                                                                                    return (
                                                                                        <ButtonWithPopup data={{
                                                                                            triggerDOM: <li id={"default_" + index}><span className="fas fa-star" /> Set as default</li>,
                                                                                            popupPosition: "bottom right",
                                                                                            title: "Set this page as root?",
                                                                                            text: <span>Are you sure ?</span>,
                                                                                            action: () => points.executeMutation(setFunnelPageAsRoot, toastr, () => {
                                                                                                refetch();
                                                                                                points.toastrPrompt(toastr, "success", "Page has been set to root.", "Success");
                                                                                            }),
                                                                                            style: { minWidth: 250, maxWidth: 250 },
                                                                                            triggerID: "default_"+index,
                                                                                            loading: loading,
                                                                                            padding: 5
                                                                                        }} />
                                                                                    );
                                                                                }}
                                                                            </Mutation> : <Mutation mutation={REMOVE_FUNNEL_PAGE_AS_ROOT} variables={{ funnel_id, page_id: page.id }} >
                                                                                {(removeFunnelPageAsRoot, { data, loading, error }) => {
                                                                                    return (
                                                                                        <ButtonWithPopup data={{
                                                                                            triggerDOM: <li id={"default_" + index}><span className="fas fa-star" /> Remove as root</li>,
                                                                                            popupPosition: "bottom right",
                                                                                            title: "Remove root settings?",
                                                                                            text: <span>Are you sure ?</span>,
                                                                                            action: () => points.executeMutation(removeFunnelPageAsRoot, toastr, () => {
                                                                                                refetch();
                                                                                                points.toastrPrompt(toastr, "success", "Page has been set to page.", "Success");
                                                                                            }),
                                                                                            style: { minWidth: 250, maxWidth: 250 },
                                                                                            triggerID: "default_"+index,
                                                                                            loading: loading,
                                                                                            padding: 5
                                                                                        }} />
                                                                                    );
                                                                                }}
                                                                            </Mutation>
                                                                        }
                                                                        {!page.split_design &&
                                                                            <Mutation
                                                                                mutation={SAVE_FUNNEL_PAGE_LIST}
                                                                                variables={{
                                                                                    funnel_id,
                                                                                    creator: currentUser.id,
                                                                                    page_type: page.page_type,
                                                                                    path: path.match(duplicateCounterRegex) ? path.replace(duplicateCounterRegex, "") + "-" + (parseInt(path.match(duplicateCounterRegex).toString().replace("-", "")) + 1) : path + "-1",
                                                                                    design: "copy",
                                                                                    design_page_id: page.id
                                                                                }} >
                                                                                {(saveFunnelPageList, { data, loading, error }) => {
                                                                                    return (
                                                                                        <ButtonWithPopup data={{
                                                                                            triggerDOM: <li id={"copy_"+index}><span className="fas fa-copy" /> Duplicate</li>,
                                                                                            popupPosition: "bottom right",
                                                                                            title: "Duplicate " + points.presentableFunnelName(path),
                                                                                            text: <span>Are you sure ?</span>,
                                                                                            action: () => points.executeMutation(saveFunnelPageList, toastr, () => {
                                                                                                refetch();
                                                                                                points.toastrPrompt(toastr, "success", "Duplicate Successfully", "Success");
                                                                                            }),
                                                                                            style: { minWidth: 250, maxWidth: 250 },
                                                                                            triggerID: "copy_" + index,
                                                                                            loading: loading,
                                                                                            padding: 5
                                                                                        }} />
                                                                                    );
                                                                                }}
                                                                            </Mutation>
                                                                        }
                                                                        {!page.split_design &&
                                                                            <ButtonWithPopup data={{
                                                                                triggerDOM: <li id={"copy_to_"+index}><span className="fas fa-copy" /> Copy to</li>,
                                                                                popupPosition: "left top",
                                                                                title: "",
                                                                                text: (
                                                                                    <ul style={{textAlign: 'left'}}>
                                                                                        <Query query={GET_FUNNEL_LIST(`{ id funnel_name }`)} variables={{ creator: currentUser.id }} notifyOnNetworkStatusChange={true}>
                                                                                            {({ data, loading, refetch, error }) => {
                                                                                                if (loading) return <li><Loading width={30} height={30} /></li>
                                                                                                if (error) return <li className="ellipsis">An error has occurred please try again.</li>
                                                                                                return data.getFunnelList.map((funnel, f_index) => {
                                                                                                    return (
                                                                                                        <Mutation
                                                                                                            mutation={SAVE_FUNNEL_PAGE_LIST}
                                                                                                            variables={{
                                                                                                                funnel_id: funnel.id,
                                                                                                                creator: currentUser.id,
                                                                                                                page_type: page.page_type,
                                                                                                                path: path.match(duplicateCounterRegex) ? path.replace(duplicateCounterRegex, "") + "-" + (parseInt(path.match(duplicateCounterRegex).toString().replace("-", "")) + 1) : path + "-1",
                                                                                                                design: "copy",
                                                                                                                design_page_id: page.id
                                                                                                            }} key={f_index}>
                                                                                                            {(saveFunnelPageList, { data, loading, error }) => {
                                                                                                                return <li className="ellipsis" onClick={() => points.executeMutation(saveFunnelPageList, toastr, () => {
                                                                                                                    this.refetchPageList();
                                                                                                                    points.toastrPrompt(toastr, "success", points.presentableFunnelName(path)+" has beed copied to "+points.presentableFunnelName(funnel.funnel_name), "Success");
                                                                                                                })}><span className="fas fa-filter clickable" /> {points.presentableFunnelName(funnel.funnel_name)}</li>
                                                                                                            }}
                                                                                                        </Mutation>
                                                                                                    );
                                                                                                })
                                                                                            }}
                                                                                        </Query>
                                                                                    </ul>
                                                                                ),
                                                                                style: { minWidth: 150, maxWidth: 150 },
                                                                                action: () => {},
                                                                                triggerID: "copy_to_"+index,
                                                                                loading: false,
                                                                                padding: 5,
                                                                                checkORtimesButton: false
                                                                            }} />
                                                                        }
                                                                        {!page.split_design &&
                                                                            <Mutation mutation={REMOVE_FUNNELGENIE_PAGE} variables={{ page_id: page.id }} >
                                                                                {(removeFunnelGeniePage, { data, loading, error }) => {
                                                                                    return (
                                                                                        <ButtonWithPopup data={{
                                                                                            triggerDOM: <li id={"delete_" + index}><span className="fas fa-trash-alt" /> Remove</li>,
                                                                                            popupPosition: "bottom right",
                                                                                            text: (
                                                                                                <label className="font-roboto-light" style={{fontSize: '1.2em'}}>
                                                                                                    Are you sure you want <br/>
                                                                                                    to delete <u style={{color: '#2ac689'}}>{points.presentableFunnelName(path)}</u>?
                                                                                                </label>
                                                                                            ),
                                                                                            action: () => points.executeMutation(removeFunnelGeniePage, toastr, () => {
                                                                                                document.getElementById("more_" + index).click();
                                                                                                refetch();
                                                                                                points.toastrPrompt(toastr, "success", "Successfully remove the page.", "Success");
                                                                                            }),
                                                                                            style: { minWidth: 250, maxWidth: 250 },
                                                                                            triggerID: "delete_" + index,
                                                                                            loading,
                                                                                            padding: 5
                                                                                        }} />
                                                                                    );
                                                                                }}
                                                                            </Mutation>
                                                                        }
                                                                        {!page.split_design && page.published_page_id ?
                                                                            <Mutation mutation={SAVE_FUNNEL_LIST_SPLIT_PAGE} variables={{ page_id: page.id }}>
                                                                                {(saveSplitFunnelPageData, { data, loading, error }) => {
                                                                                    return <li onClick={() => {
                                                                                        points.executeMutation(saveSplitFunnelPageData, toastr, () => {
                                                                                            document.getElementById("more_" + index).click();
                                                                                            refetch();
                                                                                            points.toastrPrompt(toastr, "success", "The Page has been split.", "Success");
                                                                                        })
                                                                                    }} disabled={loading}><span className="fas fa-flask" /> Create Split Page</li>;
                                                                                }}
                                                                            </Mutation>
                                                                        : void 0}
                                                                        {/* {currentUser.access_tags.includes("dev") &&
                                                                            <Tooltip trigger={<li><span className="fas fa-globe" /> Country List</li>} on="click" position="left top" style={{ maxWidth: 150 }}>
                                                                                <div>
                                                                                    <div className="text-center" style={{ marginBottom: 5 }}>
                                                                                        <label className="font-roboto-bold">Design per country</label>
                                                                                    </div>
                                                                                    <ul className="item-list" style={{ maxHeight: 240, overflow: 'auto' }}>
                                                                                        <li className="one-line-ellipsis"><span className="fas fa-plus color-green" /> Add More</li>
                                                                                        {points.cod_available_country("no_country").map((c, i) => {
                                                                                            return <li className="one-line-ellipsis" key={i}><span className="fas fa-flag" /> {c.name}</li>;
                                                                                        })}
                                                                                    </ul>
                                                                                </div>
                                                                            </Tooltip>
                                                                        } */}
                                                                        <li onClick={() => {
                                                                            document.getElementById("more_"+index).click();
                                                                            this.togglePageSettings(page);
                                                                        }}><span className="fas fa-cog" /> Settings</li>
																	</ul>
																),
																action: () => { },
																style: { minWidth: 'fit-content', maxWidth: 'fit-content', borderRadius: 5, padding: 5 },
																triggerID: "more_" + index,
																loading: false,
																padding: 5,
																checkORtimesButton: false
															}} />
														</div>
													</div>
                                                    <hr style={{position: 'absolute', left: 0, right: 0, border: '1px solid #ecf0ee'}} /> <br/>
                                                    <div style={{position: 'relative'}}>
                                                        {page.split_design ?
                                                            <div>
                                                                <img className="cursor-pointer" src={designLastObject && designLastObject.screenshot_url ? designLastObject.screenshot_url + "?" + lastSaved : "/assets/graphics/unpublished-icon.png"} width="100%" style={{ border: '1px solid #00000014' }} onClick={() => this.toggleOpenSplitData(page)} style={{ WebkitMaskImage: "-webkit-gradient(linear, left top, right bottom, color-stop(0.00, rgba(0,0,0,1)), color-stop(0.35, rgba(0,0,0,1)), color-stop(0.50, rgba(0,0,0,0)), color-stop(0.65, rgba(0,0,0,0)), color-stop(1.00, rgba(0,0,0,0)))", marginTop: 5 }} />
                                                                <img className="cursor-pointer" src={page.split_screenshot ? page.split_screenshot + "?" + lastSaved : "/assets/graphics/unpublished-icon.png"} width="100%" style={{ border: '1px solid #00000014' }} onClick={() => this.toggleOpenSplitData(page)} style={{ WebkitMaskImage: "-webkit-gradient(linear, right bottom, left top, color-stop(0.00, rgba(0,0,0,1)), color-stop(0.35, rgba(0,0,0,1)), color-stop(0.50, rgba(0,0,0,0)), color-stop(0.65, rgba(0,0,0,0)), color-stop(1.00, rgba(0,0,0,0)))", position: 'absolute', left: 0 }} />
                                                            </div>
                                                        :
                                                            <Link to={{ pathname: "/funnel-genie", state: { id: page.id, pages: state.page_list } }} className={page.split_design ? "page_picture" : ""} style={{ lineHeight: 0, display: 'block', position: 'relative' }}>
                                                                <img src={designLastObject && designLastObject.screenshot_url ? designLastObject.screenshot_url + "?" + lastSaved : "/assets/graphics/unpublished-icon.png"} width="100%" style={{ border: '1px solid #00000014', minHeight: 195.5 }} />
                                                            </Link>
                                                        }
                                                    </div>
                                                    <div style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
                                                        {page.split_design &&
                                                            <div className="div-link-container-warning" style={{width: '50%', padding: 9}} onClick={() => this.toggleOpenSplitData(page)}>
                                                                <label className="cursor-pointer"><span className="fas fa-folder-open" /> Open</label>
                                                            </div>
                                                        }
                                                        {!page.split_design &&
                                                            <Link to={{ pathname: "/funnel-genie", state: { id: page.id, pages: state.page_list } }} className="font-roboto-light div-link-container-success ellipsis" style={{ fontSize: '0.7em', width: '25%' }}>EDIT</Link>
                                                        }
                                                        {(() => {
                                                            if(page.split_design) return null;
                                                            var link = "", target = "";
                                                            if(page.published_page_id){
                                                                link = pageLink; target = "_blank";
                                                            } else {
                                                                link = "javascript:"; target = "_self";
                                                            }
                                                            return <a className="font-roboto-light div-link-container-warning ellipsis" href={link} target={target} style={{ fontSize: '0.7em', width: '25%', marginLeft: 4 }}>OPEN</a>;
                                                        })()}
                                                        <div className="text-right ellipsis" style={{width: '50%'}}>
                                                            <label className="font-roboto-medium" style={{ fontSize: '0.813em', color: '#cccccc' }}>{lastSaved && page.published_page_id ? moment(parseInt(lastSaved)).format("MMM D") + " at " + moment(parseInt(lastSaved)).format("h A") : "Not customized yet"}</label>
                                                        </div>
                                                    </div>
												</div>
											</div>
										);
									});
								}}
							</Query>
                        </div>
                    </div>

                    {/* Auto Generated Pages */}
                    <div className="column column_3_12" style={{ height: 'calc(100vh - 133px)', overflow: 'auto' }}>
						{(() => {
							return state.getFunnelPageListTempAuto.map((page, index) => {
								var designLastObject = page.design.length != 0 ? page.design[page.design.length-1] : null;
								var lastSaved = designLastObject ? parseInt(designLastObject.date) : null;
								var pageLink = "https://" + state.domain_name + "/" + state.funnel_name + (page.path ? "/" + page.path : "");
								return (
                                    <div className="column column_12_12" key={index}>
                                        <div className="product-card">
                                            <div className="product-details one-line-ellipsis">
                                                <div style={{display: 'flex'}}>
                                                    <div className="ellipsis" style={{ width: '85%' }}>
														<Link to={{ pathname: "/funnel-genie", state: { id: page.id, pages: state.page_list } }} className="font-roboto-light" style={{ borderRadius: 3 }}>
                                                            <label className="clickable capitalize font-roboto-bold" style={{ fontSize: '0.875em' }}>
                                                                {points.presentableFunnelName(page.path)}
                                                            </label>
                                                        </Link>
                                                    </div>
                                                    <div className="text-right" style={{width: '15%'}}>
                                                        <ButtonWithPopup data={{
                                                            triggerDOM: <span id={"auto_more_" + index} className="fas fa-ellipsis-h clickable" style={{ color: '#ff8000', opacity: 0.7 }} />,
                                                            popupPosition: "bottom right",
															title: "",
															style: { minWidth: 'fit-content', maxWidth: 'fit-content', borderRadius: 5, padding: 5 },
															text: (
																<ul className="item-list font-questrial-medium" style={{ fontSize: '0.875em', textAlign: 'left' }}>
                                                                    <Mutation mutation={REMOVE_FUNNELGENIE_PAGE} variables={{ page_id: page.id }} >
                                                                        {(removeFunnelGeniePage, { data, loading, error }) => {
                                                                            return (
                                                                                <ButtonWithPopup data={{
                                                                                    triggerDOM: <li id={"auto_delete_" + index}><span className="fas fa-trash-alt" /> Remove</li>,
                                                                                    popupPosition: "bottom right",
                                                                                    text: (
                                                                                        <label className="font-roboto-light" style={{ fontSize: '1.2em' }}>
                                                                                            Are you sure you want <br />
                                                                                            to delete <u style={{ color: '#2ac689' }}>{points.presentableFunnelName(page.path)}</u>?
                                                                                        </label>
                                                                                    ),
                                                                                    action: () => points.executeMutation(removeFunnelGeniePage, toastr, () => {
                                                                                        document.getElementById("auto_more_" + index).click();
                                                                                        this.refetchPageList();
                                                                                        points.toastrPrompt(toastr, "success", "Successfully remove the page.", "Success");
                                                                                    }),
                                                                                    style: { minWidth: 250, maxWidth: 250 },
                                                                                    triggerID: "auto_delete_" + index,
                                                                                    loading,
                                                                                    padding: 5
                                                                                }} />
                                                                            );
                                                                        }}
                                                                    </Mutation>
																	<li onClick={() => {
																		document.getElementById("auto_more_"+index).click();
																		this.togglePageSettings(page);
																	}}><span className="fas fa-cog" /> Settings</li>
																</ul>
															),
                                                            action: () => {},
                                                            triggerID: "auto_more_" + index,
                                                            loading: false,
                                                            padding: 5,
                                                            checkORtimesButton: false
                                                        }} />
                                                    </div>
                                                </div>
                                                <hr style={{position: 'absolute', left: 0, right: 0, border: '1px solid #ecf0ee'}} /> <br/>
                                                <div style={{display: 'flex', alignItems: 'center'}}>
                                                    <Link to={{ pathname: "/funnel-genie", state: { id: page.id, pages: state.page_list } }} className="font-roboto-light div-link-container-success ellipsis" style={{fontSize: '0.7em', width: '23%'}}>EDIT</Link>
                                                    {(() => {
                                                        var link = "", target = "";
                                                        if(page.published_page_id){
                                                            link = pageLink; target = "_blank";
                                                        } else {
                                                            link = "javascript:"; target = "_self";
                                                        }
                                                        return <a className="font-roboto-light div-link-container-warning ellipsis" href={link} target={target} style={{fontSize: '0.7em', width: '23%', marginLeft: 4}}>OPEN</a>;
                                                    })()}
                                                    <div className="text-right ellipsis" style={{width: '50%'}}>
                                                        <label className="font-roboto-medium" style={{fontSize: '0.813em', color: '#cccccc'}}>{lastSaved && page.published_page_id ? moment(parseInt(lastSaved)).format("MMM D")+" at "+moment(parseInt(lastSaved)).format("h A"): "Not customized yet"}</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
								);
							});
						})()}
                    </div>

                    {/* Modal for creating new page */}
                    {state.createModal &&
                        <Modal open={state.createModal} closeModal={() => this.toggleCreateModal()} session={this.props.session} style={{ width: '60%', borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0 }}>
                            <div>
                                <div className="column_12_12">
                                    <style dangerouslySetInnerHTML={{__html: `.popup-content .content { padding: 0px; }`}} />
                                    <div className="clear" style={{padding: 20, backgroundColor: '#f2f9f6', overflow: 'hidden'}}>
                                        <h4 className="header">Create New Page</h4>
                                    </div>
                                    {/* Column 1: Input Form */}
                                    <div className="column column_5_12" style={{padding: 20, height: '76vh', position: 'relative', border: '1px solid #e6e6e6'}}>
                                        <div className="form_wrap">
                                            <div className="form_row">
                                                <label className="font-questrial-light" style={{fontSize: '0.875em'}}>
                                                    Page Name
                                                    <span className="require-sign-color"> *</span> <br/>
                                                    <span style={{fontSize: '0.7em'}}>(Empty page name is equivalent to homepage)</span>
                                                </label>
                                                <input type="text" className="font-roboto-light" name="create_path" value={state.create_path} onChange={event => this.handleOnChange(event)} maxLength={20} style={{marginTop: 10, fontSize: '0.875em'}} />
                                                <span className="bottom_border"></span>
                                            </div>
                                            <div className="form_row">
                                                <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Select Design Type</label>
                                                {(() => {
                                                    var designType = [
                                                        <option key="4" value="custom">Custom Template</option>,
                                                        <option key="0" value="blank">Blank</option>,
                                                        <option key="1" value="ecom">E-Commerce</option>,
                                                        <option key="2" value="lgf">Leads generation funnel</option>,
                                                    ]
                                                    return <SelectTag name="create_design_type" value={state.create_design_type} options={designType} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />
                                                })()}
                                            </div>

                                          
                                            
                                                <div className="form_row">
                                                <label className="font-questrial-light" style={{fontSize: '0.875em'}}>
                                                    Select Page Type
                                                    <span className="require-sign-color"> *</span>
                                                </label>
                                                {(() => {
                                                    var pageType = [
                                                        <option key="0" value="page">Normal Page</option>,
                                                        <option key="1" value="checkout">Checkout</option>,
                                                        <option key="2" value="upsell">Up sell</option>,
                                                        <option key="3" value="downsell">Down sell</option>,
                                                        <option key="4" value="thank-you-page">Thank You Page</option>,
                                                    ]
                                                    return <SelectTag name="create_page_type" value={state.create_page_type} options={pageType} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />
                                                })()}
                                            </div> 
                                            
                                            <div style={{position: 'absolute', bottom: 20}}>
                                                <Mutation
                                                    mutation={SAVE_FUNNEL_PAGE_LIST}
                                                    variables={{
                                                        funnel_id,
                                                        creator: currentUser.id,
                                                        page_type: state.create_page_type,
                                                        path: points.encodeDomain(state.create_path),
                                                        design: state.create_selected_design
                                                    }} >
                                                    {(saveFunnelPageList, { datass, loading, error }) => {
                                                        return <button className="font-roboto-light btn-success" onClick={() => {
                                                            points.executeMutation(saveFunnelPageList, toastr, () => {
                                                                this.refetchPageList();
                                                                this.toggleCreateModal();
                                                                points.toastrPrompt(toastr, "success", "Page has been set to root.", "Success");
                                                            })
                                                        }}>CREATE</button>
                                                    }}
                                                </Mutation>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Column 2: Designs */}
                                    <div className="column column_3_12" style={{ height: '76vh', border: '1px solid #e6e6e6', backgroundColor: '#f3f9f6', overflow: 'auto' }}>
                                                    {/* TODO: Insert the query here */}
                                    {(state.create_design_type === "custom" ? 
                                            // July2
                                            <div>
                                               
                                                


                                            <Query query={GET_PAGE_TEMPLATES('{ id design description type screenshot_link screenshot_link_preview }')} variables={{ creator: currentUser.id }}>
                                                {({ data, loading, refetch, error }) => {
                                                    // this.refetch_group_name = refetch;
                                                    if (loading) return <li><Loading width={50} height={50} /></li>;
                                                    else if (error) return <li>An error has occurred please try again.</li>;
                                                    else if (data.getPageTemplates.length == 0) return  <div className="product-details text-center">No Templates Found.</div>;
                                                    return data.getPageTemplates.map((design, x) => {
                                                        
                                                        return (
                                                            <div key={x} className={"design product-card"} >
                                                                <div className="product-details text-center" style={{ padding: 5, overflow: 'hidden' }} >
                                                                    <img className="clickable" src={"https://via.placeholder.com/500x300/" + this.toColor(design.description) +"/FFFFFF?text=" + encodeURI(design.description)} height="150px" style={{ marginTop: 5, maxWidth: '100%' }} onClick={event => {
                                                                     
                                                                    this.handleOnChange({name: 'create_path', value: design.description}, true)
                                                                    this.handleOnChange({name: 'create_page_type', value: design.type}, true)
                                                                    this.selectThisDesign(design.description, design.design, "/assets/graphics/wireframe.png")
                                                             
                                                                    
                                                                    
                                                                        }
                                                                    } />
                                                                    
                                                                    
                                                                    
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    );
                                                }}
                                            </Query>

                                            </div>
                                                     : ""
                                        )}

                                        {(() => {
                                            console.log(currentUser);
                                            return state.design_list.filter(el => el.type.includes(state.create_design_type)).map((design, key) => {

                                                const stateName = "selectedDesign"+key;
                                                return (
                                                    <div className={"design product-card"+(state[stateName] ? " selected": "")} key={key}>
                                                        {console.log(state, state[stateName])}
                                                        <div className="product-details text-center" style={{padding: 5, overflow: 'hidden'}}>
                                                            <img className="clickable" src={design.screenshot_link} height="150px" style={{ marginTop: 5, maxWidth: '100%' }} onClick={event => this.selectThisDesign(stateName, design.design, design.screenshot_link_preview)} />
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()}
                                    </div>
                                    {/* Column 3: Preview */}
                                    <div className="column column_4_12" style={{height: '76vh', padding: 0, border: '1px solid #e6e6e6'}}>
                                        <div style={{padding: 10, backgroundColor: '#f2f9f6', borderBottom: '1px solid #e6e6e6', overflow: 'hidden', position: 'relative'}}>
                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Template Preview</label>
                                            <button onClick={() => this.setState({openPreview: !state.openPreview, openPreviewURL: state.image_preview})} style={{ padding: '8px 10px', position: 'absolute', right: 10, top: 3, cursor: 'pointer', display: 'flex', fontSize: '0.8em' }} disabled={state.image_preview ? false : true}>
                                                <span className="fas fa-compress" /> <label className="font-questrial-light" style={{ marginLeft: 5 }}>Maximize</label>
                                            </button>
                                        </div>
                                        <div className="center-vertical-parent" style={{ height: '93%', overflow: 'auto' }}>
                                            {(() => {
                                                if(state.image_preview){
                                                    return <img src={state.image_preview} style={{ maxWidth: '100%' }} />
                                                } else {
                                                    return (
                                                        <div className="center-vertical">
                                                            <label className="font-questrial-light" style={{fontSize: '1em', color: '#cecece'}}>Please Select A Page Template</label>
                                                        </div>
                                                    );
                                                }
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    }

                    {/* Template Preview */}
                    {state.openPreview &&
                        <Modal open={state.openPreview} closeModal={() => this.setState({openPreview: false})} session={this.props.session}>
                            <img src={state.openPreviewURL} width="100%" />
                        </Modal>
                    }

                    {/* Modal for page settings */}
                    {state.open_page_settings &&
                        <Modal open={state.open_page_settings} closeModal={() => this.togglePageSettings()} session={this.props.session} style={{ width: '30%', borderTop: '5px solid #23c78a', borderRadius: 10, padding: 10 }}>
                            <div className="form_wrap center-vertical-parent">
                                <div className="column_12_12 center-vertical">
                                    <div className="form_row text-center">
                                        <img src="/assets/graphics/funnel-icon.png" style={{maxWidth: '100px'}} />
                                        <h4 className="header" style={{marginTop: 10}}>Page Settings</h4>
                                    </div>
                                    <div className="form_row">
                                        <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Page Type</label>
                                        {(() => {
                                            var pageType = [
                                                <option key="0" value="page">Normal Page</option>,
                                                <option key="1" value="checkout">Checkout</option>,
                                                <option key="2" value="upsell">Upsell</option>,
                                                <option key="3" value="downsell">Downsell</option>,
                                                <option key="4" value="thank-you-page">Thank You Page</option>,
                                            ]
                                            return <SelectTag name="page_type" value={state.page_type} options={pageType} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />
                                        })()}
                                    </div>
                                    <div className="form_row">
                                        <label className="font-questrial-light" style={{fontSize: '0.875em'}}>
                                            Page Name <span style={{fontSize: '0.7em'}}>(Empty page name is equivalent to homepage)</span>
                                        </label>
                                        <input type="text" className="font-roboto-light" value={state.page_name} name="page_name" onChange={event => this.handleOnChange(event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                    </div>
                                    <div className="form_row">
                                        <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Page Title</label>
                                        <input type="text" className="font-roboto-light" value={state.page_title} name="page_title" onChange={event => this.handleOnChange(event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                    </div>
                                    <div className="form_row">
                                        <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Page Description</label>
                                        <input type="text" className="font-roboto-light" value={state.page_description} name="page_description" onChange={event => this.handleOnChange(event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                    </div>
                                    <div className="form_row">
                                        <label className="font-questrial-light" style={{fontSize: '0.875em'}}>
                                            Page OG: Image URL
                                            <span className="whats_this data-title" data-title="Image that represent your content.">i</span>
                                        </label>
                                        <input type="text" className="font-roboto-light" value={state.page_og_image} name="page_og_image" onChange={event => this.handleOnChange(event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                    </div>
                                    <div className="form_row">
                                        <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Page Keyword</label>
                                        <input type="text" className="font-roboto-light" value={state.page_keyword} name="page_keyword" onChange={event => this.handleOnChange(event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                    </div>
                                    {state.funnel_facebook_id &&
                                        <div className="form_row">
                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>This will change/overwrite your tracking code (header)</label>
                                            <div className="messaging-center">
                                                {(() => {
                                                    var trackEvent = [
                                                        <option key="0" value="">Select Facebook Track Event</option>,
                                                        <option key="1" value={'<script>!function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0"; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,"script", "https://connect.facebook.net/en_US/fbevents.js"); fbq("init", "'+state.funnel_facebook_id+'"); fbq("track", "PageView"); fbq("track", "ViewContent"); </script> <noscript> <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id='+state.funnel_facebook_id+'&ev=PageView&noscript=1"/> </noscript>'}>View Content</option>,
                                                        <option key="2" value={'<script>!function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0"; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,"script", "https://connect.facebook.net/en_US/fbevents.js"); fbq("init", "'+state.funnel_facebook_id+'"); fbq("track", "PageView"); fbq("track", "AddToCart"); </script> <noscript> <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id='+state.funnel_facebook_id+'&ev=PageView&noscript=1"/> </noscript>'}>Add to Cart</option>,
                                                    ];
                                                    return <SelectTag name="track_event" value={state.funnel_ga} options={trackEvent} onChange={event => {
                                                        this.setState({ funnel_ga: event.target.value });
                                                        this.handleOnChange(event);
                                                    }} style={{ marginTop: 10 }} />;
                                                })()}
                                            </div>
                                        </div>
                                    }
                                    <div className="form_row">
                                        <div className="messaging-center">
                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>
                                                Embed Tracking Code into the Header <span style={{fontSize: '0.7em'}}>(HTML or Javascript)</span>
                                            </label>
                                            <textarea rows="6" className="message-area font-roboto-light stretch-width" name="funnel_ga" value={state.funnel_ga} onChange={event => this.handleOnChange(event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                        </div>
                                    </div>
                                    <div className="form_row">
                                        <div className="messaging-center">
                                            <label className="font-questrial-light" style={{fontSize: '0.875em'}}>
                                                Embed Tracking Code into the Footer  <span style={{fontSize: '0.7em'}}>(HTML or Javascript)</span>
                                            </label>
                                            <textarea rows="6" className="message-area font-roboto-light stretch-width" name="funnel_fga" value={state.funnel_fga} onChange={event => this.handleOnChange(event)} style={{marginTop: 10, fontSize: '0.875em'}} />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <Mutation
                                            mutation={UPDATE_FUNNELGENIE_PAGE_SETTING}
                                            variables={{
                                                funnel_id,
                                                page_id: state.page_id,
                                                page_type: state.page_type,
                                                path: points.encodeDomain(state.page_name),
                                                page_title: state.page_title,
                                                page_description: state.page_description,
                                                page_og_image_link: state.page_og_image,
                                                page_keyword: state.page_keyword,
                                                funnel_header_analytics: state.funnel_ga.replace(/<!--[\s\S]*?-->/gm, ""),
                                                funnel_footer_analytics: state.funnel_fga.replace(/<!--[\s\S]*?-->/gm, ""),
                                                source: "settings"
                                            }} >
                                            {(updateFunnelPageList, { data, loading, error }) => {
                                                return <button className="btn-success font-roboto-light" onClick={() => {
                                                    points.executeMutation(updateFunnelPageList, toastr, () => {
                                                        this.refetchPageList();
                                                        this.togglePageSettings();
                                                        points.toastrPrompt(toastr, "success", "Page setting has been saved", "Success");
                                                    })
                                                }} disabled={loading}>SAVE</button>
                                            }}
                                        </Mutation>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    }

                    {/* Start modal for split data */}
                    {state.open_split_data &&
                        <Modal open={state.open_split_data} closeModal={() => this.toggleOpenSplitData()} session={this.props.session} style={{ width: '50%', borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0 }}>
                            {(() => {
                                var designLastObject = state.split_data.design.length != 0 ? state.split_data.design[state.split_data.design.length-1] : null;
                                var lastSaved = designLastObject ? parseInt(designLastObject.date) : null;
                                var path = state.split_data.path ? state.split_data.path : "homepage";
                                var pageLink = state.split_data.page_is_root ? "https://" + state.domain_name : "https://" + state.domain_name + "/" + state.funnel_name + (state.split_data.path ? "/" + state.split_data.path : "");
                                return (
                                    <div>
                                        <style dangerouslySetInnerHTML={{__html: `.popup-content .content { padding: 0px; }`}} />
                                        <div className="clear" style={{ padding: 15, backgroundColor: '#f2f9f6', borderBottom: '1px solid #e6e6e6' }}>
                                            <h4 className="font-roboto-light" style={{color: '#7d8184'}}>Split Page</h4>
                                        </div>
                                        {/* root data */}
                                        <div className="flex-container" style={{marginBottom: 100}}>
                                            <div className="responsive-box">
                                                <h3 className="text-center font-roboto-bold header-small-light-bold" style={{ marginTop: 20 }}>A</h3>
                                                <div className="product-card" style={{ boxShadow: '0 2px 7px #dfdfdf' }}>
                                                    <div className="product-details">
                                                        <div className="display-inline">
                                                            <div className="ellipsis" style={{width: '85%'}}>
                                                                <span className={points.getPageIcon(path, state.split_data.page_type)} style={{color: '#26c686'}} /> &nbsp;
                                                                <label className="clickable capitalize font-roboto-bold" style={{ fontSize: '0.875em' }}>{points.presentableFunnelName(path)}</label>
                                                            </div>
                                                            <div style={{ width: '5%', fontSize: '0.7em' }}>
                                                                <ButtonWithPopup data={{
                                                                    triggerDOM: <span id="hover" className="clickable fas fa-link" onClick={() => {
                                                                        points.copyStringToClipboard(pageLink + "?p=a");
                                                                        toastr.clear();
                                                                        toastr.success("Successfully copied to clipboard","Success!");
                                                                    }} />,
                                                                    popupPosition: "bottom right",
                                                                    title: "",
                                                                    text: <label className="font-roboto-light">Copy to clipboard</label>,
                                                                    triggerID: "hover",
                                                                    loading: false,
                                                                    padding: 5,
                                                                    checkORtimesButton: false,
                                                                    onAction: 'hover',
                                                                    style: {
                                                                        minWidth: 'fit-content',
                                                                        padding: 5,
                                                                        borderRadius: 5
                                                                    }
                                                                }} />
                                                            </div>
                                                            <div className="text-right" style={{ width: '10%', fontSize: '0.7em' }}>
                                                                <Mutation mutation={REMOVE_FUNNELGENIE_PAGE} variables={{ page_id: state.split_data.id }}>
                                                                    {(removeFunnelGeniePage, { data, loading, error }) => {
                                                                        return (
                                                                            <ButtonWithPopup data={{
                                                                                triggerDOM: <span id="popup_remove_1" className="fas fa-trash-alt clickable color-dark-red" />,
                                                                                popupPosition: "bottom right",
                                                                                text: (
                                                                                    <label className="font-roboto-light">
                                                                                        Are you sure you want <br />
                                                                                        to delete <u style={{ color: '#2ac689' }}>{points.presentableFunnelName(path)}</u>?
                                                                                    </label>
                                                                                ),
                                                                                action: () => points.executeMutation(removeFunnelGeniePage, toastr, () => {
                                                                                    this.setState({ split_page_a: null }, () => {
                                                                                        this.toggleOpenSplitData();
                                                                                        this.refetchPageList();
                                                                                        this.uploadBias();
                                                                                        points.toastrPrompt(toastr, "success", "Success", "");
                                                                                    });
                                                                                }),
                                                                                triggerID: "popup_remove_1",
                                                                                loading,
                                                                                padding: 10,
                                                                                style: {
                                                                                    minWidth: 'fit-content'
                                                                                }
                                                                            }} />
                                                                        );
                                                                    }}
                                                                </Mutation>
                                                            </div>
                                                        </div>
                                                        <hr style={{position: 'absolute', left: 0, right: 0, border: '1px solid #ecf0ee'}} /> <br/>
                                                        <div style={{position: 'relative'}}>
                                                            <Link to={{ pathname: "/funnel-genie", state: { id: state.split_data.id, pages: state.page_list } }} style={{ lineHeight: 0, display: 'block' }}>
                                                                <img src={designLastObject && designLastObject.screenshot_url ? designLastObject.screenshot_url + "?" + lastSaved : "/assets/graphics/unpublished-icon.png"} width="100%" style={{ border: '1px solid #00000014' }} />
                                                            </Link>
                                                        </div>
                                                        <div style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
                                                            <Link to={{ pathname: "/funnel-genie", state: { id: state.split_data.id, pages: state.page_list } }} className="font-roboto-light div-link-container-success ellipsis" style={{fontSize: '0.7em', width: '25%'}}>EDIT</Link>
                                                            {(() => {
                                                                var link = "", target = "";
                                                                if(state.split_data.published_page_id){
                                                                    link = pageLink+"?p=a"; target = "_blank";
                                                                } else {
                                                                    link = "javascript:"; target = "_self";
                                                                }
                                                                return <a className="font-roboto-light div-link-container-warning ellipsis" href={link} target={target} style={{fontSize: '0.7em', width: '25%', marginLeft: 4}}>OPEN</a>;
                                                            })()}
                                                            <div className="text-right ellipsis" style={{width: '50%'}}>
                                                                <label className="font-roboto-medium" style={{fontSize: '0.813em', color: '#cccccc'}}>{lastSaved && state.split_data.published_page_id ? moment(parseInt(lastSaved)).format("MMM D")+" at "+moment(parseInt(lastSaved)).format("h A"): "Not customized yet"}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {(() => {
                                                    if(!state.stat_loading){
                                                        var pageAdata = state.stat_data.filter(el => el.splitPage.toLowerCase() == "a");
                                                        var percentageLength = state.stat_data.filter(el => el.conversion).length;
                                                        pageAdata = pageAdata.filter(el => el.conversion);
                                                        percentageLength = ((pageAdata.length * 100) / percentageLength).toFixed(2);
                                                        if(pageAdata.length != 0){
                                                            return (
                                                                <div style={{ marginTop: 10, padding: 20, border: '1px solid #e6e6e6' }}>
                                                                    <label>Conversion {pageAdata.length}</label>
                                                                    <div className="text-center" style={{marginTop: 20}}>
                                                                        <label className={"font-header-popup "+(percentageLength < 50 ? "color-dark-red" : "color-green")}>{percentageLength}%</label>
                                                                    </div>
                                                                </div>
                                                            );
                                                        } else {
                                                            return null;
                                                        }
                                                    } else {
                                                        return <Loading width={100} height={100} />;
                                                    }
                                                })()}
                                                <div style={{ marginTop: 10, padding: 20, border: '1px solid #e6e6e6' }}>
                                                    {!state.page_a_note ?
                                                        <label className="text-center cursor-pointer" style={{ border: '3px dashed #e6e6e6', display: 'block', padding: 10, color: '#929292' }} onClick={() => this.setState({ page_a_note: this.getPageDescription("a", "display") })}>{this.getPageDescription("a", "display")}</label>
                                                    :
                                                        <Mutation mutation={UPDATE_FUNNEL_LIST_SPLIT_PAGE} variables={{ page_id: state.split_data.id, split_notes: this.getPageDescription("a", "mutate") + "," + this.getPageDescription("b", "mutate") }}>
                                                            {(updateSplitFunnelPageData, { data, loading, error }) => {
                                                                return (
                                                                    <div className="display-inline">
                                                                        <input type="text" name="page_a_note" value={state.page_a_note} onChange={event => this.handleOnChange(event)} />
                                                                        <button className="btn-success" style={{ padding: '5px 7px', marginLeft: 5, borderRadius: '50%' }} onClick={() => {
                                                                            var x = state.split_data;
                                                                            x.split_notes = this.getPageDescription("a", "mutate") + "," + this.getPageDescription("b", "mutate");
                                                                            points.executeMutation(updateSplitFunnelPageData, toastr, () => {
                                                                                this.setState({ split_data: x, page_a_note: "", page_b_note: "" }, () => this.refetchPageList());
                                                                                points.toastrPrompt(toastr, "success", "Success", "");
                                                                            });
                                                                        }} disabled={loading}>
                                                                            <span className="fas fa-check" />
                                                                        </button>
                                                                    </div>
                                                                )
                                                            }}
                                                        </Mutation>
                                                    }
                                                </div>
                                            </div>
                                            {/* splited data */}
                                            <div className="responsive-box">
                                                <h3 className="text-center font-roboto-bold header-small-light-bold" style={{marginTop: 20}}>B</h3>
                                                <div className="product-card" style={{ boxShadow: '0 2px 7px #dfdfdf' }}>
                                                    <div className="product-details">
                                                        <div className="display-inline">
                                                            <div className="ellipsis" style={{width: '85%'}}>
                                                                <span className={points.getPageIcon(path, state.split_data.page_type)} style={{color: '#26c686'}} /> &nbsp;
                                                                <label className="clickable capitalize font-roboto-bold" style={{ fontSize: '0.875em' }}>{points.capitalizeWord(path.replace(/-/g, " "))}</label>
                                                            </div>
                                                            <div style={{ width: '5%', fontSize: '0.7em' }}>
                                                                <ButtonWithPopup data={{
                                                                    triggerDOM: <span id="hover" className="clickable fas fa-link" onClick={() => {
                                                                        points.copyStringToClipboard(pageLink + "?p=b");
                                                                        toastr.clear();
                                                                        toastr.success("Successfully copied to clipboard","Success!");
                                                                    }} />,
                                                                    popupPosition: "bottom right",
                                                                    title: "",
                                                                    text: <label className="font-roboto-light">Copy to clipboard</label>,
                                                                    triggerID: "hover",
                                                                    loading: false,
                                                                    padding: 5,
                                                                    checkORtimesButton: false,
                                                                    onAction: 'hover',
                                                                    style: {
                                                                        minWidth: 'fit-content',
                                                                        padding: 5,
                                                                        borderRadius: 5
                                                                    }
                                                                }} />
                                                            </div>
                                                            <div className="text-right" style={{ width: '10%', fontSize: '0.7em' }}>
                                                                <Mutation mutation={SAVE_FUNNEL_LIST_SPLIT_PAGE} variables={{ page_id: state.split_data.id, is_remove: true }}>
                                                                    {(saveSplitFunnelPageData, { data, loading, error }) => {
                                                                        return (
                                                                            <ButtonWithPopup data={{
                                                                                triggerDOM: <span id="popup_remove_2" className="fas fa-trash-alt clickable color-dark-red" />,
                                                                                popupPosition: "bottom right",
                                                                                text: (
                                                                                    <label className="font-roboto-light">
                                                                                        Are you sure you want <br />
                                                                                        to delete <u style={{ color: '#2ac689' }}>{points.presentableFunnelName(path)}</u>?
                                                                                    </label>
                                                                                ),
                                                                                action: () => points.executeMutation(saveSplitFunnelPageData, toastr, () => {
                                                                                    this.setState({ split_page_a: null }, () => {
                                                                                        this.toggleOpenSplitData();
                                                                                        this.refetchPageList();
                                                                                        this.uploadBias();
                                                                                        points.toastrPrompt(toastr, "success", "Success", "");
                                                                                    });
                                                                                }),
                                                                                triggerID: "popup_remove_2",
                                                                                loading,
                                                                                padding: 10,
                                                                                style: { minWidth: 'fit-content' }
                                                                            }} />
                                                                        );
                                                                    }}
                                                                </Mutation>
                                                            </div>
                                                        </div>
                                                        <hr style={{position: 'absolute', left: 0, right: 0, border: '1px solid #ecf0ee'}} /> <br/>
                                                        <div style={{position: 'relative'}}>
                                                            <Link to={{ pathname: "/funnel-genie", state: { id: state.split_data.id, pages: state.page_list, splitEdit: true } }} style={{lineHeight: 0, display: 'block'}}>
                                                                <img src={state.split_data.split_screenshot ? state.split_data.split_screenshot+"?"+lastSaved : "/assets/graphics/unpublished-icon.png"} width="100%" style={{border: '1px solid #00000014'}} />
                                                            </Link>
                                                        </div>
                                                        <div style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
                                                            <Link to={{ pathname: "/funnel-genie", state: { id: state.split_data.id, pages: state.page_list, splitEdit: true } }} className="font-roboto-light div-link-container-success ellipsis" style={{fontSize: '0.7em', width: '25%'}}>EDIT</Link>
                                                            {(() => {
                                                                var link = "", target = "";
                                                                if(state.split_data.published_page_id){
                                                                    link = pageLink+"?p=b"; target = "_blank";
                                                                } else {
                                                                    link = "javascript:"; target = "_self";
                                                                }
                                                                return <a className="font-roboto-light div-link-container-warning ellipsis" href={link} target={target} style={{fontSize: '0.7em', width: '25%', marginLeft: 4}}>OPEN</a>;
                                                            })()}
                                                            <div className="text-right ellipsis" style={{width: '50%'}}>
                                                                <label className="font-roboto-medium" style={{fontSize: '0.813em', color: '#cccccc'}}>{lastSaved && state.split_data.published_page_id ? moment(parseInt(lastSaved)).format("MMM D")+" at "+moment(parseInt(lastSaved)).format("h A"): "Not customized yet"}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {(() => {
                                                    if(!state.stat_loading){
                                                        var pageBdata = state.stat_data.filter(el => el.splitPage.toLowerCase() == "b");
                                                        var percentageLength = state.stat_data.filter(el => el.conversion).length;
                                                        pageBdata = pageBdata.filter(el => el.conversion);
                                                        percentageLength = ((pageBdata.length * 100) / percentageLength).toFixed(2);
                                                        if(pageBdata.length != 0){
                                                            return (
                                                                <div style={{ marginTop: 10, padding: 20, border: '1px solid #e6e6e6' }}>
                                                                    <label>Conversion {pageBdata.length}</label>
                                                                    <div className="text-center" style={{marginTop: 20}}>
                                                                        <label className={"font-header-popup "+(percentageLength < 50 ? "color-dark-red" : "color-green")}>{percentageLength}%</label>
                                                                    </div>
                                                                </div>
                                                            );
                                                        } else {
                                                            return null;
                                                        }
                                                    } else {
                                                        return <Loading width={100} height={100} />;
                                                    }
                                                })()}
                                                <div style={{ marginTop: 10, padding: 20, border: '1px solid #e6e6e6' }}>
                                                    {!state.page_b_note ?
                                                        <label className="text-center cursor-pointer" style={{ border: '3px dashed #e6e6e6', display: 'block', padding: 10, color: '#929292' }} onClick={() => this.setState({ page_b_note: this.getPageDescription("b", "display") })}>{this.getPageDescription("b", "display")}</label>
                                                    :
                                                        <Mutation mutation={UPDATE_FUNNEL_LIST_SPLIT_PAGE} variables={{ page_id: state.split_data.id, split_notes: this.getPageDescription("a", "mutate") + "," + this.getPageDescription("b", "mutate") }}>
                                                            {(updateSplitFunnelPageData, { data, loading, error }) => {
                                                                return (
                                                                    <div className="display-inline">
                                                                        <input type="text" name="page_b_note" value={state.page_b_note} onChange={event => this.handleOnChange(event)} />
                                                                        <button className="btn-success" style={{ padding: '5px 7px', marginLeft: 5, borderRadius: '50%' }} onClick={() => {
                                                                            var x = state.split_data;
                                                                            x.split_notes = this.getPageDescription("a", "mutate") + "," + this.getPageDescription("b", "mutate");
                                                                            points.executeMutation(updateSplitFunnelPageData, toastr, () => {
                                                                                this.setState({ split_data: x, page_a_note: "", page_b_note: "" }, () => this.refetchPageList());
                                                                                points.toastrPrompt(toastr, "success", "Success", "");
                                                                            });
                                                                        }} disabled={loading}>
                                                                            <span className="fas fa-check" />
                                                                        </button>
                                                                    </div>
                                                                );
                                                            }}
                                                        </Mutation>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center stretch-width display-inline" style={{padding: 20, position: 'absolute', bottom: 0, backgroundColor: '#fff', borderTop: '1px solid #e6e6e6'}}>
                                            <h3 className={(state.split_page_b < 50 ? "color-dark-red" : "color-green")+" text-center font-roboto-bold column"} style={{width: '20%'}}>A</h3>
                                            <div className="column" style={{width: '60%'}}>
                                                <div className="range-slider">
                                                    <div className="display-inline">
                                                        <label className={state.split_page_b < 50 ? "color-dark-red" : "color-green"} style={{width: '50%'}}>{state.split_page_b}%</label>
                                                        <label className={state.split_page_a < 50 ? "color-dark-red" : "color-green"} style={{width: '50%'}}>{state.split_page_a}%</label>
                                                    </div>
                                                    <Mutation mutation={UPDATE_FUNNEL_LIST_SPLIT_PAGE} variables={{ page_id: state.split_data.id, bias: parseInt(state.split_page_a) }}>
                                                        {(updateSplitFunnelPageData, { data, loading, error }) => {
                                                            return (
                                                                <input type="range" min="1" max="99" value={state.split_page_a} onChange={value => {
                                                                    var valueA = value.target.value;
                                                                    var valueB = Math.abs(parseInt(valueA) - 100).toString();
                                                                    this.setState({ split_page_a: valueA, split_page_b: valueB }, () => this.uploadBias());
                                                                }} onTouchEnd={() => {
                                                                    points.executeMutation(updateSplitFunnelPageData, toastr, () => {
                                                                        this.refetchPageList();
                                                                        points.toastrPrompt(toastr, "success", "Bias Saved Success", "");
                                                                    }, "Uploading Split Test Percentage", "Please wait...");
                                                                }} onMouseUp={() => {
                                                                    points.executeMutation(updateSplitFunnelPageData, toastr, () => {
                                                                        this.refetchPageList();
                                                                        points.toastrPrompt(toastr, "success", "Bias Saved Success", "");
                                                                    }, "Uploading Split Test Percentage", "Please wait...");
                                                                }} disabled={loading} />
                                                            );
                                                        }}
                                                    </Mutation>
                                                </div>
                                            </div>
                                            <h3 className={(state.split_page_a < 50 ? "color-dark-red" : "color-green")+" text-center font-roboto-bold column"} style={{width: '20%'}}>B</h3>
                                        </div>
                                    </div>
                                );
                            })()}
                        </Modal>
                    }
                    {/* End modal for split data */}
                    <span className="clear" />
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(FunnelGeniePagesDEV);