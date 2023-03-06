/*
    Pag di nag rreflect yung design sa uploaded funnel baka nag dupplicate ung upload check https://jeromenewstore.productlistgenie.io/graphql
    search the credential
    {
        everyPage(domain: "example.productlistgenie.io", path:"hearing-patrol-ksa-false"){ // example
            id
            path
            domain
        }
    }
    dapat isa lang lalabas jan pag 2 or more conflict nga un
    para ma resolve copy id then search sa "robo 3t" or "mongodb compass comunity" sa collection na funnelpagelists
    { published_page_id: "5ea333ba6f4a56672bf6fc8d" } example id yan na nkuha sa query sa graphql
    pag may lumabas jan ung id o result na un ung gamit ng user originally yun ung innuupdate ng user kapag nag uupload ng design
    pag wala lumabas ibg svhn safe to delete sa graphql ung id na un dahil wla nmn nagamit na user.

    paypal button not appearing ?
    check paypal Live Client ID nag eeror sa parsing ung paypal cdn script kaya di nalabas ung button
    ang nag ccause ay mali ung Live Client ID (some cases email ng user ung nilagay)
*/

import React from 'react';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { SAVE_FUNNEL_GENIE_CREDENTIAL, UPDATE_FUNNEL_SETTING, SEARCH_USERS, GET_MY_INTEGRATIONS, GET_FUNNEL_COUNT, GET_FUNNEL_LIST, DUPLICATE_FUNNELGENIE, REMOVE_FUNNELGENIE, GET_FUNNEL_BY_ID, UPDATE_FUNNELGENIE_SETTING, SAVE_FUNNEL_LIST, SAVE_FUNNEL_DOMAIN, GET_FUNNEL_PAGE_LIST } from '../queries';
import { Query, Mutation, ApolloConsumer } from 'react-apollo';
import Pagination from '../components/pagination';
import toastr from 'toastr';
import Loading from '../components/loading';
import LoadingPage from '../components/loadingPage';
import Modal from '../components/ModalComponent';
import ButtonWithPopup from '../components/buttonWithPopup';
import SelectTag from '../components/selectTag';
import FunnelDiagram from '../components/funnelDiagram';
import UploadFavicon from '../components/uploadFavicon';
import EmailAndSMSIntegration from '../components/emailAndSMSIntegration';
import EmailSequence from '../components/emailSequence';
import CryptoJS from 'crypto-js';
import FunnelCharts from '../components/funnelCharts';
import ShowFilter from '../components/showFilter';
import SearchField from '../components/searchField';
import Checkbox from '../components/checkbox';
import Input from '../components/input';
import { cod_available_country } from '../../Global_Values';
const points = require('../../Global_Values');
const designTemplate = require('../../FunnelGenieTemplate');

let initialize = {
    addNewFreeDomain: false,
    domain: '.yalagenie.com',
    domain_subdomain: '',
    funnel_name: 'funnel',
    favicon_link: '',
    funnelType: 'ecom',
    domainIndex: "",
    selectedDesign: designTemplate.homepages[0].design,
    choice: 'subdomain',
    errorText: '',
    legalPages: true,
    customLegalPagesCSS: "",
    customLegalPageSelected: ""
}

let viewOtherFunnel = {
    search: '',
    viewOtherFunnel: false,
    searchVal: '',
    searchMode: true,
    userID: '',
    userName: '',
    selectedUserFunnelID: ''
}

let funnelSettingInitialize = {
    funnel_id: "",
    isWhatsApp: false,
    enableFloatingBar: false,
    enableFloatingBarLink: "",
    sendPLGEmailConfirmation: true,
    sendPLGEmailTracking: false,
    sendPLGEmailAbandonment: false,
    isCODFunnel: true,
    fulfillByPLG: true,
    fulfill_by_plg: false,
    selectedFunnelName: "",
    selectedDomainIndex: 0,
    newDomainIndex: "",
    newFunnelName: "",
    funnel_phone: "",
    funnel_email: "",
    funnel_currency: cod_available_country("no_country").filter(curr => curr.iso2 === "US")[0].iso2,
    funnel_address: "",
    funnel_selected_merchant: "",
    funnel_stripe_public: "",
    funnel_stripe_private: "",
    funnel_other: "",
    paypalCLientID: "",
    favicon_link: "",
    // analytics
    facebook_id: "",
    facebook_access_token: "",
    google_id: "",
    tiktok_id: "",
    funnel_everflow: false,
    snapchat_id: "",
    // klaviyo
    confirmationEmail: "",
    abandonmentEmail: "",
    trackingEmail: "",
    onHoldEmail: ""
}

let initializePageSettings = {
    selectedPageID: '',
    selectedFunnelName: '',
    selectedDomainIndex: '',
    newPageName: '',
    page_title: '',
    page_description: '',
    page_og_image: '',
    page_keyword: '',
    facebook_id: '',
    facebook_access_token: '',
    funnel_ga: '',
    funnel_fga: ''
}

let refetchDomain = null;

class FunnelGenieMainDEV extends React.Component {
    constructor(props) {
        super();
        this.state = {
            is_page_loading: true,
            ...initialize,
            currentPage: 1,
            newUserCreateModal: false,
            createModal: false,
            createDomain: false,
            openFunnelSetting: false,
            design_page: 0,
            design_list: designTemplate.homepages,
            ...viewOtherFunnel,
            // search funnel
            searchTimeout: null,
            funnelSearch: '',
            showSearchBox: false,
            isSearchLoading: false,
            // for new user
            loadingNewUser: false,
            isFinish: false,
            totalFunnel: 0,

            klaviyoSegmentation: null,

            funnel: [],
            refetchPage: [],
            funnel_pages: [],
            // for pages
            pageSettings: false,
            ...initializePageSettings,
            funnel_list: [],
            v1: null,
            v2: null,
            v3: null,
            v4: null,

            // funnel diagram
            openFunnelDiagram: false,
            diagramFunnelName: "",
            diagramDomainIndex: null,

            // upload favicon
            fileValue: "",
            openUploadFavicon: false,

            // email & sms
            emailAndSMSv1: "",
            emailAndSMSv2: "",
            openEmailAndSMS: false,
            openEmailAndSMSv2: false,

            // for analytics tab
            openAnalytics: true,
            funnelList: [],

            // for explainer 
            openExplainer: false,
            explainerLink: "",
            explainerWithBackground: false,
            explainerDoNotShowAgain: false,

            // for getting custom generated legal pages from other funnels
            legalPagesId: "",
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

        let saveState = {};
        let domain_list = this.props.session.getCurrentUser.funnel_genie_domains;
        if (domain_list.length == 0) {
            saveState = { ...initialize };
            saveState.newUserCreateModal = true;
            saveState.createDomain = true;
        }

        // if(localStorage.getItem("pages")){
        //     this.setState({ pages: JSON.parse(localStorage.getItem("pages")) })
        // }

        if (refetchDomain) refetchDomain(); // to refresh the page when go back

        // let do_not_show_again = JSON.parse(localStorage.getItem("plg_funnel_main_video"));
        // if(!do_not_show_again) {
        //     this.setState({ openExplainer: true, explainerLink: "https://player.vimeo.com/video/398587287", explainerWithBackground: true });
        // }

        this.setState({ is_page_loading: false, ...saveState });
    }

    encode(str) {
        return btoa(str);
    }

    decode(str) {
        var bytes = CryptoJS.AES.decrypt(str, points.plg_domain_secret);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    getVideoData(vimeoid, state_name) {
        fetch('https://vimeo.com/api/v2/video/' + vimeoid + '.json?fields=id,thumbnail_large')
            .then(res => res.json())
            .then(result => {
                this.setState({ [state_name]: result[0] })
            });
    }

    toggleCreateModal(selected_domain) {
        let currentUser = this.props.session.getCurrentUser;
        let fr = points.funnelRestriction(currentUser, this.state.totalFunnel);
        if (fr.error) {
            toastr.options.onclick = () => {
                window.open(fr.upsell_link, "_blank");
                toastr.options.onclick = null;
            }
            points.toastrPrompt(toastr, "warning", "Maximum of " + fr.limit + " funnels per user. Click here to upgrade", "Maximum Funnel Reach");
            return;
        }
        this.setState({ ...initialize, createDomain: false, newUserCreateModal: false, createModal: !this.state.createModal, domainIndex: selected_domain ? selected_domain : currentUser.funnel_genie_domains[0] }, () => {
            if (this.state.createModal) {
                this.getVideoData(380796306, "v1");
                this.getVideoData(380795973, "v2");
                this.getVideoData(380796852, "v3");
            }
        });
    }

    toggleViewOtherFunnel() {
        this.setState({ viewOtherFunnel: !this.state.viewOtherFunnel, createModal: false })
    }

    toggleAnalytics() {
        this.setState({ openAnalytics: !this.state.openAnalytics });
    }

    searchUser() {
        this.setState({
            searchVal: this.state.search
        })
    }

    selectUser(id, name, domains) {
        this.setState({ userID: id, userName: name, userDomains: domains, searchMode: false })
    }

    handleOnChange(event) {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({ [name]: value })

        if (name === "customLegalPageId") {
            this.setState({
                legalPagesId: value
            })
        }

        if (name == "page_type") {
            var designList = designTemplate.homepages;
            if (value == "checkout") {
                designList = designTemplate.checkouts;
            } else if (value == "thank-you-page") {
                designList = designTemplate.thankyous;
            } else if (value == "upsell") {
                designList = designTemplate.upsells;
            } else if (value == "downsell") {
                designList = designTemplate.downsells;
            }
            this.setState({ selectedDesign: null, design_list: designList });
        } else if (name == "funnelType") {
            var defaultDesign = designTemplate.homepages[0].design;
            if (value == "ecom") {
                defaultDesign = designTemplate.homepages[9].design;
            } else if (value == "cpa") {
                defaultDesign = designTemplate.homepages[1].design;
            } else if (value == "lgf") {
                defaultDesign = designTemplate.homepages[7].design;
            } else {
                defaultDesign = designTemplate.homepages[0].design;
            }
            this.setState({ selectedDesign: defaultDesign });
        }
    }

    searchFunnel(event) {
        clearTimeout(this.state.searchTimeout)
        var name = event.target.name;
        var value = event.target.value;
        var self = this;
        this.setState({
            isSearchLoading: true,
            searchTimeout: setTimeout(() => {
                var savedState = {
                    [name]: value
                }
                if (!value) {
                    savedState.isSearchLoading = false;
                }
                self.setState(savedState)
            }, 2000)
        })
    }

    saveFunnelGenieCredentialNewUser(saveFunnelGenieCredential) {
        this.setState({
            errorText: '',
            loadingNewUser: true
        }, () => {
            saveFunnelGenieCredential().then(({ data }) => {
                this.setState({
                    loadingNewUser: false
                }, () => {
                    refetchDomain();
                    this.props.refetch();
                    this.setState({
                        design_page: 0,
                        design_list: designTemplate.homepages,
                        isFinish: true,
                        errorText: ''
                    })
                })
            }).catch(error => {
                toastr.clear();
                this.setState({
                    errorText: error.graphQLErrors[0].message,
                    loadingNewUser: false
                })
            });
        });
    }

    togglePageSettings(pages, refetch) {
        if (pages && refetch) {
            this.setState({
                selectedPageID: pages.id,
                selectedFunnelName: pages.funnel_name,
                newPageName: pages.path,
                selectedDomainIndex: pages.domainIndex,
                funnel_ga: pages.funnel_ga,
                funnel_fga: pages.funnel_fga,
                page_title: pages.page_title,
                page_description: pages.page_description,
                page_og_image: pages.page_og_image_link,
                page_keyword: pages.page_keyword,
                facebook_id: pages.facebook_id,
                facebook_access_token: pages.facebook_access_token,
                pageSettings: !this.state.pageSettings,
                pageRefetch: refetch
            })
        } else {
            this.setState({
                ...initializePageSettings,
                pageSettings: !this.state.pageSettings
            }, () => {
                this.state.pageRefetch();
            })
        }
    }

    setLoadingTime(timeout, extendedTimeOut) {
        toastr.options.timeOut = timeout;
        toastr.options.extendedTimeOut = extendedTimeOut;
    }

    setAsDefaultDomain(setAsDefaultDomain, refetch, path) {
        this.setLoadingTime(0, 0);
        toastr.clear();
        toastr.info("Please wait...", "Setting as root!");
        setAsDefaultDomain().then(({ data }) => {
            this.setLoadingTime(3000, 2000);
            toastr.clear();
            toastr.success(points.capitalizeWord(path.replace(/-/g, " ")) + " successfully set as root.", "Success");
            refetch();
        }).catch(error => {
            this.setLoadingTime(0, 0);
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    deleteFunnelPage(deleteFunnelPage, refetch) {
        this.setLoadingTime(0, 0);
        toastr.clear();
        toastr.info("Loading please wait...");
        deleteFunnelPage().then(({ data }) => {
            toastr.clear();
            refetch();
            refetchDomain();
        }).catch(error => {
            this.setLoadingTime(0, 0);
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    saveFunnelGenieCredential(saveFunnelGenieCredential, copy, refetch) {
        points.toastrPrompt(toastr, "info", "Loading please wait...");
        saveFunnelGenieCredential().then(({ data }) => {
            this.setState({ loadingNewUser: false });
            if (!copy) {
                refetchDomain();
                this.props.refetch();
                this.setState({
                    ...initialize,
                    design_page: 0,
                    design_list: designTemplate.homepages,
                    errorText: ''
                }, () => {
                    this.toggleCreateModal();
                    toastr.clear();
                })
            } else {
                refetchDomain();
                toastr.clear();
                toastr.success("", "Copied!");
            }
            refetch ? refetch() : void 0;
        }).catch(error => {
            toastr.clear();
            if (copy) {
                toastr.warning("You already copied this. Please delete first before copying again.", "Copy Failed!");
            } else {
                this.setState({
                    errorText: error.graphQLErrors[0].message,
                    loadingNewUser: false
                })
            }
        });
    }

    copyPageTo(saveFunnelGenieCredential, selector, parentStateName) {
        this.setLoadingTime(0, 0)
        toastr.clear();
        toastr.info("Loading please wait...", "");
        saveFunnelGenieCredential().then(({ data }) => {
            this.setLoadingTime(3000, 2000)
            toastr.clear();
            toastr.success("Page successfully copied.", "Copied!");
            document.getElementById(selector).click();
            refetchDomain();
            this.state.refetchPage[parentStateName] ? this.state.refetchPage[parentStateName]() : void 0;
        }).catch(error => {
            this.setLoadingTime(0, 0)
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    updateFunnelSetting(updateFunnelSetting) {
        toastr.clear();
        toastr.info("Loading please wait...");
        updateFunnelSetting().then(({ data }) => {
            refetchDomain();
            this.setState({
                ...funnelSettingInitialize
            }, () => {
                this.toggleFunnelSettingModal();
                toastr.clear();
                toastr.success("Funnel settings successfully saved.", "Success");
            })
        }).catch(error => {
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    updatePageSetting(updateFunnelSetting, isFavicon) {
        toastr.clear();
        toastr.info("Loading please wait...");
        updateFunnelSetting().then(({ data }) => {
            var text = "";
            if (isFavicon) {
                this.toggleUploadFavicon();
                text = "Favicon link has been saved.";
            } else {
                this.togglePageSettings();
                text = "Page setting successfully saved";
            }
            toastr.clear();
            toastr.success(text, "Success");
        }).catch(error => {
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    deleteFunnel(deleteFunnel) {
        toastr.clear();
        toastr.info("Loading please wait...");
        deleteFunnel().then(({ data }) => {
            refetchDomain();
            toastr.clear();
            toastr.success("Funnel has been removed.", "Success");
        }).catch(error => {
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    toggleFunnelDiagram(funnel_id) {
        this.setState({ openFunnelDiagram: !this.state.openFunnelDiagram, diagramFunnelID: funnel_id })
    }

    toggleEmailAndSMS(funnel_id) {
        this.setState({ emailAndSMSv1: funnel_id, openEmailAndSMS: !this.state.openEmailAndSMS })
    }

    toggleEmailAndSMSv2(funnel_id) {
        this.setState({ emailAndSMSv2: funnel_id, openEmailAndSMSv2: !this.state.openEmailAndSMSv2 })
    }

    toggleFunnelSettingModal() {
        this.setState({ ...funnelSettingInitialize, openFunnelSetting: !this.state.openFunnelSetting }, () => refetchDomain());
    }

    toggleUploadFavicon(fileValue) {
        this.setState({
            fileValue: fileValue ? fileValue : "",
            openUploadFavicon: !this.state.openUploadFavicon
        })
    }

    removeSelectedDesign() {
        document.querySelectorAll(".design").forEach(el => {
            el.classList.remove("selected");
        });
    }

    selectThisPageDesign(event, design, image_preview) {
        this.removeSelectedDesign();
        event.target.parentNode.parentNode.classList.add("selected");
        this.setState({ selectedDesign: design, image_preview: image_preview });
    }

    getPageIcon(path, type) {
        if (path.includes("homepage")) {
            return "fas fa-home";
        } else if (type == "page") {
            return "fas fa-sticky-note";
        } else if (type == "product-page") {
            return "fas fa-box-open";
        } else if (type == "checkout") {
            return "fas fa-shopping-cart";
        } else if (type == "upsell") {
            return "fas fa-arrow-up";
        } else if (type == "downsell") {
            return "fas fa-arrow-down red";
        } else if (type == "thank-you-page") {
            return "fas fa-star";
        } else {
            return "fas fa-file-alt";
        }
    }

    maxFunnelPageReach(max) {
        toastr.options.onclick = () => {
            window.open("https://productlistgenie.com/programs/?fbclid=IwAR2EQAJTWqs_TozKkcJGqypYGjeQcNkyiMdNnCl1uE9ljAiPsrXmWDJi_Zw", "_blank");
            toastr.options.onclick = null;
        }
        toastr.clear();
        toastr.warning("Maximum of " + max + " funnel pages per user. Click here to upgrade.", "Maximum Funnel Page Reach.");
    }

    maxFunnelReach(max) {
        toastr.options.onclick = () => {
            window.open("https://productlistgenie.com/programs/?fbclid=IwAR2EQAJTWqs_TozKkcJGqypYGjeQcNkyiMdNnCl1uE9ljAiPsrXmWDJi_Zw", "_blank");
            toastr.options.onclick = null;
        }
        toastr.clear();
        toastr.warning("Maximum of " + max + " funnels per user. Click here to upgrade.", "Maximum Funnel Reach.");
    }

    trialMaxDomainReach() {
        toastr.clear();
        toastr.warning("You can only add domain once for a trial user or upgrade your account", "Cannot add more domain.");
    }

    toggleExplainerVideo(explainerLink) {
        this.setState({ openExplainer: !this.state.openExplainer, explainerLink: explainerLink ? explainerLink : "" })
    }

    presentableFunnelName(fn) {
        return points.capitalizeWord(fn.replace(/-|_/g, " "));
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Funnel Genie Main (DEV) - Product List Genie</title>
            </Helmet>
        );
    }

    exportToJson(data) {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(data)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = data.funnel_name + ".json";

        link.click();
    };

    render() {
        let state = this.state;
        let props = this.props;
        let currentUser = props.session.getCurrentUser;
        let domain_list = currentUser.funnel_genie_domains;
        if (state.is_page_loading) return <LoadingPage />;
        return (
            <div className="funnel">
                {this.head()}
                <Query query={GET_FUNNEL_COUNT} variables={{ creator: currentUser.id, search: state.searchValue }} notifyOnNetworkStatusChange={true} onCompleted={data => {
                    if (data.getTotalFunnel) this.setState({ totalFunnel: data.getTotalFunnel.count ? data.getTotalFunnel.count : 0 });
                }}>
                    {({ data, loading, refetch, error }) => {
                        this.refetchAllFunnelCount = refetch;
                        return null;
                    }}
                </Query>
                <div className={"column " + (state.openAnalytics ? "column_9_12" : "column_12_12")} style={{ padding: 0 }}>
                    <div id="funnel_main_header" className="newPageHeader">
                        <div className="column column_4_12">
                            <span className="hide-in-desktop float-left" style={{ padding: 15 }} />
                            <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>Funnel Genie</h4>
                            <label style={{ color: '#878787' }}>You have <span id="funnel_count" className="font-bold" style={{ color: '#23c78a' }}>{state.totalFunnel}</span> Funnels</label>
                        </div>
                        <div className="column column_8_12 display-inline flex-container" style={{ justifyContent: 'flex-end' }}>
                            <SearchField
                                name="funnelSearch"
                                value={state.funnelSearch}
                                placeHolder="Ex. Funnel Genie"
                                containerStyle={{ margin: '0 5px' }}
                                onSubmit={value => this.setState({ funnelSearch: value, currentPage: 1 })}
                                expandable
                            />
                            {(currentUser.privilege == 10 && currentUser.funnel_genie_domains.length != 0) || currentUser.access_tags.includes("copy_funnel") ? // User Privilege
                                <button className="btn-warning font-roboto-light" onClick={() => this.toggleViewOtherFunnel()} style={{ margin: '0 5px' }}>
                                    <span className="fas fa-copy" />
                                    <span className="hide-in-mobile">&nbsp;Copy Funnel Page</span>
                                </button>
                                : void 0}
                            <button className="btn-success font-roboto-light" onClick={() => this.toggleCreateModal()} style={{ margin: '0 5px' }}>
                                <span className="fas fa-plus" />
                                <span className="hide-in-mobile">&nbsp;Add New Funnel</span>
                            </button>
                            {!state.openAnalytics ?
                                <button className="btn-success font-roboto-light" onClick={() => this.toggleAnalytics()} style={{ margin: '0 5px' }}>
                                    <span className="fas fa-chart-bar" />
                                </button>
                                : void 0}
                        </div>
                        <span className="clear" />
                    </div>
                    <div className="filter-container" style={{ margin: 10, backgroundColor: '#f3f8fe' }}>
                        <Pagination displayPageCount={10} totalPage={state.totalFunnel} currentPage={state.currentPage} action={result => this.setState({ currentPage: result })} style={{ marginLeft: 10 }} />
                    </div>
                    {state.currentPage > 1 || state.funnelSearch ?
                        <div className="flex-container" style={{ justifyContent: 'flex-start', margin: 10 }}>
                            {state.currentPage > 1 &&
                                <ShowFilter label={"Page: " + state.currentPage} onClick={() => this.setState({ currentPage: 1 })} />
                            }
                            {state.funnelSearch &&
                                <ShowFilter label={"Search: " + state.funnelSearch} onClick={() => document.querySelector("[name='funnelSearch']").nextElementSibling.click()} />
                            }
                        </div>
                        : void 0}
                    <div>
                        <div className="clear" style={{ marginTop: 10 }}>
                            <Query query={
                                GET_FUNNEL_LIST(`{ id date_modified domain_name funnel_name page_count is_not_shareable }`)
                            } variables={{
                                creator: currentUser.id,
                                search: state.funnelSearch,
                                page: state.currentPage,
                                show_page_count: true
                            }} onCompleted={data => this.setState({ isSearchLoading: false, funnel_list: data.getFunnelList })} notifyOnNetworkStatusChange>
                                {({ data, loading, refetch, error }) => {
                                    refetchDomain = refetch;
                                    if (loading && state.funnel_list.length == 0) return <div className="text-center stretch-width"><Loading width={200} height={200} /></div>;
                                    else if (error) return <div className="text-center"><label>An error has occurred please try again.</label></div>
                                    else if (data.getFunnelList.length == 0 && state.funnel_list.length == 0) {
                                        if (!state.funnelSearch) {
                                            return (
                                                <div className="column column_12_12 text-center">
                                                    <div className="product-card">
                                                        <div className="product-details">
                                                            {currentUser.funnel_genie_domains.length == 0 ?
                                                                <span className="no-result">Please put your <strong>Business name</strong> by clicking <strong>+ sign</strong> button.</span>
                                                                :
                                                                <span className="no-result">You still need to create <strong>Funnel</strong> click the <strong>+ sign</strong> to continue.</span>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div className="center-vertical-parent" style={{ height: 'calc(85vh - ' + (document.getElementById("funnel_main_header").offsetHeight + 20) + 'px)', width: '100%' }}>
                                                    <div className="center-vertical">
                                                        <img src="/assets/graphics/no-result.svg" style={{ height: '50vh' }} />
                                                        <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! NO RESULT FOUND!</h4> <br />
                                                        <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>
                                                            It seems we can't find <u style={{ color: '#28c686', fontSize: '1em' }}>"{state.funnelSearch}"</u> based on your search
                                                        </label>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    }
                                    /*
                                        start experiment no loading animation
                                        also if remove experiment fix upper condition
                                    */
                                    var dataToUse = [];
                                    if (data.getFunnelList.length == 0) {
                                        dataToUse = state.funnel_list;
                                    } else {
                                        dataToUse = data.getFunnelList;
                                    }
                                    // end experiment no loading animation
                                    return dataToUse.map((funnel, index) => {
                                        var dateModified = parseInt(funnel.date_modified);
                                        return (
                                            <div className="product-card display-inline" key={index} style={{ padding: 15, margin: 10, backgroundColor: '#f3f8fe' }}>
                                                {loading &&
                                                    <div className="loading-text-container center-vertical">
                                                        <div style={{ marginLeft: '50%' }}>
                                                            <Loading width={50} height={50} />
                                                        </div>
                                                    </div>
                                                }
                                                <Link to={'/funnel-genie-pages-list/' + funnel.id}>
                                                    <span className="fas fa-filter dark-container" style={{ fontSize: '1.2em', padding: 10, borderRadius: 3, marginRight: 15 }} />
                                                </Link>
                                                <Link to={'/funnel-genie-pages-list/' + funnel.id} style={{ lineHeight: 1 }}>
                                                    <label className="cursor-pointer header-medium-bold ellipsis-in-mobile" style={{ color: '#353c37' }}>{this.presentableFunnelName(funnel.funnel_name)}</label>
                                                    <span className="fas fa-link hide-in-mobile" style={{ fontSize: '0.7em', marginRight: 5 }} /> <label className="color-green hide-in-mobile cursor-pointer">{funnel.domain_name}</label>
                                                </Link>
                                                <div className={"text-center date-modified" + (loading ? " hide-in-mobile" : "")} style={{ position: 'absolute', right: 140 }}>
                                                    <label className="color-dark-white">Date Modified</label> <br />
                                                    <label className="color-dark-white" style={{ fontWeight: 700 }}>{dateModified ? new Date(dateModified).toLocaleDateString() : "N/A"}</label>
                                                </div>
                                                <span className="hide-in-mobile" style={{ height: 30, width: 1, backgroundColor: '#808586', position: 'absolute', right: 110 }} />
                                                <div className="hide-in-mobile text-center" style={{ position: 'absolute', right: 50 }}>
                                                    <label className="color-dark-white" style={{ fontWeight: 700 }}>{funnel.page_count}</label> <br />
                                                    <label className="color-dark-white">Pages</label>
                                                </div>
                                                <ButtonWithPopup data={{
                                                    triggerDOM: <span id={"more_" + index} className="fas fa-ellipsis-v cursor-pointer" style={{ color: '#b8bec4', fontSize: '1.2em', padding: 10, position: 'absolute', right: 10 }} />,
                                                    popupPosition: "left top",
                                                    text: <ul className="font-questrial-medium text-left item-list" style={{ fontSize: '0.875em' }}>
                                                        <Mutation mutation={DUPLICATE_FUNNELGENIE} variables={{ creator: currentUser.id, funnel_id: funnel.id }} >
                                                            {(duplicateFunnelGenie, { data, loading, error }) => {
                                                                return (
                                                                    <ButtonWithPopup data={{
                                                                        triggerDOM: <li id={"copy_" + index}><span className="fas fa-copy" /> Duplicate</li>,
                                                                        popupPosition: "top center",
                                                                        text: <label style={{ fontSize: '1.2em' }}>Duplicate <br />{points.presentableFunnelName(funnel.funnel_name)}?</label>,
                                                                        action: () => points.executeMutation(duplicateFunnelGenie, toastr, () => {
                                                                            document.getElementById("more_" + index).click();
                                                                            refetch();
                                                                            this.refetchAllFunnelCount();
                                                                            points.toastrPrompt(toastr, "success", "Successfully duplicate the funnel", "Success");
                                                                        }),
                                                                        triggerID: "copy_" + index,
                                                                        loading: loading,
                                                                        padding: 10,
                                                                        style: { minWidth: 200, width: 200 }
                                                                    }} />
                                                                );
                                                            }}
                                                        </Mutation>
                                                        <Mutation mutation={REMOVE_FUNNELGENIE} variables={{ funnel_id: funnel.id }} >
                                                            {(removeFunnelGenie, { data, loading, error }) => {
                                                                return (
                                                                    <ButtonWithPopup data={{
                                                                        triggerDOM: <li id={"remove_" + index}><span className="fas fa-trash-alt" /> Remove</li>,
                                                                        popupPosition: "top center",
                                                                        text: (
                                                                            <label className="font-roboto-light" style={{ fontSize: '1.2em' }}>
                                                                                Are you sure you want <br />
                                                                                to delete <u style={{ color: '#2ac689' }}>{points.presentableFunnelName(funnel.funnel_name)}</u>?
                                                                            </label>
                                                                        ),
                                                                        action: () => points.executeMutation(removeFunnelGenie, toastr, () => {
                                                                            document.getElementById("more_" + index).click();
                                                                            refetch();
                                                                            this.refetchAllFunnelCount();
                                                                            points.toastrPrompt(toastr, "success", "Successfully remove the funnel.", "Success");
                                                                        }),
                                                                        triggerID: "remove_" + index,
                                                                        loading,
                                                                        padding: 10,
                                                                        style: { minWidth: 200, width: 200 }
                                                                    }} />
                                                                );
                                                            }}
                                                        </Mutation>
                                                        <Query query={
                                                            GET_FUNNEL_BY_ID(`{ funnel_use_email_confirmation funnel_use_email_tracking funnel_use_email_abandonment is_fulfill_by_plg is_cod_funnel funnel_is_phone_whatsapp funnel_enable_floating_bar funnel_enable_floating_bar_link funnel_phone funnel_email funnel_currency funnel_address funnel_favicon_link funnel_facebook_id  funnel_google_id funnel_tiktok_id funnel_everflow funnel_facebook_access_token funnel_snapchat_id gateway_selected_merchant gateway_stripe_public gateway_stripe_private gateway_other gateway_paypal_client_id integration_confirmation_email integration_abandonment_email integration_tracking_email integration_onhold_email }`)
                                                        } variables={{ funnel_id: funnel.id }} notifyOnNetworkStatusChange>
                                                            {({ data, loading, refetch, error }) => {
                                                                if (loading) return <li><span className="fas fa-spinner fa-spin" /> Settings</li>;
                                                                else if (error) return <li><span className="fas fa-cog" /> Settings unavailable</li>;
                                                                let { getFunnelById } = data;
                                                                this.refetchFunnelById = refetch;
                                                                return (
                                                                    <li onClick={() => {
                                                                        document.getElementById("more_" + index).click();
                                                                        this.setState({
                                                                            funnel_id: funnel.id,
                                                                            sendPLGEmailConfirmation: getFunnelById.funnel_use_email_confirmation != null ? getFunnelById.funnel_use_email_confirmation : true,
                                                                            sendPLGEmailTracking: getFunnelById.funnel_use_email_tracking != null ? getFunnelById.funnel_use_email_tracking : false,
                                                                            sendPLGEmailAbandonment: getFunnelById.funnel_use_email_abandonment != null ? getFunnelById.funnel_use_email_abandonment : false,
                                                                            isCODFunnel: getFunnelById.is_cod_funnel,
                                                                            fulfillByPLG: getFunnelById.is_fulfill_by_plg,
                                                                            fulfill_by_plg: getFunnelById.is_fulfill_by_plg,
                                                                            funnel_phone: getFunnelById.funnel_phone ? getFunnelById.funnel_phone : "",
                                                                            funnel_email: getFunnelById.funnel_email ? getFunnelById.funnel_email : "",
                                                                            funnel_currency: getFunnelById.funnel_currency ? getFunnelById.funnel_currency : "",
                                                                            funnel_address: getFunnelById.funnel_address ? getFunnelById.funnel_address : "",
                                                                            funnel_selected_merchant: getFunnelById.gateway_selected_merchant ? getFunnelById.gateway_selected_merchant : "",
                                                                            funnel_stripe_public: getFunnelById.gateway_stripe_public ? getFunnelById.gateway_stripe_public : "",
                                                                            funnel_stripe_private: getFunnelById.gateway_stripe_private ? getFunnelById.gateway_stripe_private : "",
                                                                            funnel_other: getFunnelById.gateway_other ? getFunnelById.gateway_other : "",
                                                                            paypalClientID: getFunnelById.gateway_paypal_client_id ? getFunnelById.gateway_paypal_client_id : "",
                                                                            confirmationEmail: getFunnelById.integration_confirmation_email ? getFunnelById.integration_confirmation_email : "",
                                                                            abandonmentEmail: getFunnelById.integration_abandonment_email ? getFunnelById.integration_abandonment_email : "",
                                                                            trackingEmail: getFunnelById.integration_tracking_email ? getFunnelById.integration_tracking_email : "",
                                                                            onHoldEmail: getFunnelById.integration_onhold_email ? getFunnelById.integration_onhold_email : "",
                                                                            favicon_link: getFunnelById.funnel_favicon_link ? getFunnelById.funnel_favicon_link : "",
                                                                            facebook_id: getFunnelById.funnel_facebook_id ? getFunnelById.funnel_facebook_id : "",
                                                                            facebook_access_token: getFunnelById.funnel_facebook_access_token ? getFunnelById.funnel_facebook_access_token : "",
                                                                            google_id: getFunnelById.funnel_google_id ? getFunnelById.funnel_google_id : "",
                                                                            tiktok_id: getFunnelById.funnel_tiktok_id ? getFunnelById.funnel_tiktok_id : "",
                                                                            funnel_everflow: getFunnelById.funnel_everflow != null ? getFunnelById.funnel_everflow : false,
                                                                            snapchat_id: getFunnelById.funnel_snapchat_id ? getFunnelById.funnel_snapchat_id : "",
                                                                            isWhatsApp: getFunnelById.funnel_is_phone_whatsapp != null ? getFunnelById.funnel_is_phone_whatsapp : false,
                                                                            enableFloatingBar: getFunnelById.funnel_enable_floating_bar != null ? getFunnelById.funnel_enable_floating_bar : false,
                                                                            enableFloatingBarLink: getFunnelById.funnel_enable_floating_bar_link ? getFunnelById.funnel_enable_floating_bar_link : "",
                                                                            new_funnel_name: funnel.funnel_name,
                                                                            new_domain_name: funnel.domain_name,
                                                                            openFunnelSetting: true
                                                                        });
                                                                    }}><span className="fas fa-cog" /> Settings</li>
                                                                );
                                                            }}
                                                        </Query>
                                                        <ApolloConsumer>
                                                            {client => {
                                                                return <li onClick={() => {
                                                                    client.query({
                                                                        query: GET_FUNNEL_PAGE_LIST(`{ path funnel_name funnel_type domain_name page_type design { date screenshot_url json } }`),
                                                                        variables: { funnel_id: funnel.id }
                                                                    }).then(res => {
                                                                        var exportToJson = { ...res.data };
                                                                        if (exportToJson && exportToJson.getFunnelPageList.length) {

                                                                            exportToJson.funnel_name = exportToJson.getFunnelPageList[0].funnel_name;
                                                                            exportToJson.funnel_type = exportToJson.getFunnelPageList[0].funnel_type;
                                                                            exportToJson.domain_name = exportToJson.getFunnelPageList[0].domain_name;
                                                                            this.exportToJson(exportToJson);
                                                                        } else {

                                                                            alert('No Funnel Page To Export');
                                                                        }

                                                                    })
                                                                }}><span className="fas fa-file-export" /> Export</li>;
                                                            }}
                                                        </ApolloConsumer>
                                                        <li onClick={() => {
                                                            if (currentUser.privilege <= 4 && funnel.is_not_shareable) { // User Privilege
                                                                toastr.clear();
                                                                toastr.warning("Funnel cannot share.", "")
                                                            } else {
                                                                var sharableURL = points.clientUrl + "/share-funnel?shared=true&token=" + this.encode(currentUser.id) + "&name=" + this.encode(funnel.funnel_name) + "&fid=" + this.encode(funnel.id);
                                                                points.copyStringToClipboard(sharableURL);
                                                                toastr.clear();
                                                                toastr.success("Sharable Link is now copied.", "Copied!")
                                                            }
                                                        }}><span className="fas fa-share" /> Share</li>
                                                        <li onClick={() => {
                                                            document.getElementById("more_" + index).click();
                                                            this.toggleFunnelDiagram(funnel.id);
                                                        }}><span className="fas fa-project-diagram" /> Diagram</li>
                                                        <li onClick={() => {
                                                            this.props.history.push('/funnel-leads/' + funnel.id + "/" + funnel.funnel_name);
                                                        }}><span className="fas fa-users" /> Leads</li>
                                                        <li onClick={() => {
                                                            document.getElementById("more_" + index).click();
                                                            this.toggleEmailAndSMS(funnel.id);
                                                        }}><span className="fas fa-comment" /> Email & SMS</li>
                                                        <li onClick={() => {
                                                            document.getElementById("more_" + index).click();
                                                            this.toggleEmailAndSMSv2(funnel.id);
                                                        }}><span className="fas fa-angle-double-right" /> Email & SMS v2</li>
                                                    </ul>,
                                                    action: () => { },
                                                    triggerID: "more_" + index,
                                                    loading: false,
                                                    padding: 5,
                                                    checkORtimesButton: false,
                                                    style: {
                                                        minWidth: 'fit-content',
                                                        borderRadius: 5,
                                                        padding: 5
                                                    }
                                                }} />
                                            </div>
                                        );
                                    });
                                }}
                            </Query>
                        </div>
                    </div>
                </div>

                {/* analytics tab */}
                {state.openAnalytics &&
                    <div className="column column_3_12 analytics-tab" style={{ boxShadow: '-4px 0px 3px #dfe5eb', height: '100vh', padding: 0, overflow: 'auto' }}>
                        {/* title and close button */}
                        <div className="display-inline cursor-pointer" style={{ padding: "20px 10px", backgroundColor: '#f4f9fd', overflow: 'hidden', borderBottom: '1px solid #dfe5eb' }} onClick={() => this.toggleAnalytics()}>
                            <span className="fas fa-angle-right clickable" style={{ fontSize: '1.3em', marginRight: 10 }} />
                            <h4 className="font-roboto-bold" style={{ fontSize: '1.3em', color: '#273037' }}>Funnel Analytics</h4>
                        </div>
                        {/* content body */}
                        <div style={{ padding: 10 }}>
                            <FunnelCharts />
                        </div>
                    </div>
                }

                {/* Modal for first open of funnel genie */}
                {state.newUserCreateModal ?
                    <Modal open={state.newUserCreateModal} closeModal={() => domain_list.length != 0 ? this.toggleCreateModal() : void 0} session={props.session} style={{ borderTop: '5px solid #23c78a', borderRadius: 10, padding: 10, width: '30%' }} closeOnDocumentClick={domain_list.length != 0}>
                        <div className="center-vertical-parent">
                            <div className="form_wrap center-vertical">
                                <div className="text-center">
                                    <img src="/assets/graphics/funnel-icon.png" style={{ maxWidth: '100px' }} />
                                    {(() => {
                                        if (state.addNewFreeDomain) return null;
                                        if (!state.isFinish) return <h4 className="header" style={{ marginTop: 10 }}>WELCOME TO FUNNEL GENIE</h4>;
                                        else return <h4 className="header" style={{ marginTop: 10 }}>Your wish is granted!</h4>;
                                    })()}
                                </div>
                                {!state.isFinish ?
                                    <div className="column column_12_12" style={{ marginTop: 10 }}>
                                        <div className="form_row text-center" style={{ position: 'relative' }}>
                                            <label className="font-questrial-light" style={{ fontSize: '1em' }}>
                                                What is your business name? <span className="require-sign-color"> *</span> <br />
                                            </label>
                                            <input type="text" className="font-roboto-light" name="domain_subdomain" value={state.domain_subdomain} onChange={event => this.handleOnChange(event)} placeholder="Ex. Genie Business" style={{ textAlign: 'center', marginTop: 10, fontSize: '0.875em' }} />
                                            {state.loadingNewUser &&
                                                <div style={{ position: 'absolute', right: 0, top: 30, right: 10 }}>
                                                    <Loading width={40} height={40} />
                                                </div>
                                            }
                                        </div>
                                        <div className="form_row">
                                            <label className="font-questrial-light" style={{ fontSize: '1em' }}>
                                                {!state.addNewFreeDomain && "Select"} Domain <span className="require-sign-color"> *</span> <br />
                                            </label>
                                            {(() => {
                                                if (state.addNewFreeDomain) {
                                                    return <input type="text" className="font-roboto-light" name="domain" value={state.domain.substring(1)} style={{ marginTop: 10, fontSize: '0.875em' }} readOnly disabled />;
                                                } else {
                                                    var options = [
                                                        <option key={0} value=".yalagenie.com">yalagenie.com</option>,
                                                        <option key={1} value=".productlistgenie.io">productlistgenie.io</option>
                                                    ];
                                                    return <SelectTag name="domain" value={state.domain} options={options} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />
                                                }
                                            })()}
                                        </div>
                                        {state.errorText &&
                                            <div className="product-card text-center" style={{ background: '#fff' }}>
                                                <div className="error-container product-details">
                                                    <i className="fas fa-times" onClick={() => this.setState({ errorText: '' })} />
                                                    <label className="font-questrial-light" style={{ fontSize: '0.875em' }} dangerouslySetInnerHTML={{ __html: state.errorText }} />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    :
                                    <div className="column column_12_12 text-center" style={{ margin: '10px 0', padding: 20, border: '1px solid #40ca92' }}>
                                        <h4 className="header">{state.domain_subdomain.replace(/-/g, " ").toUpperCase()}</h4>
                                        <div className="font-questrial-light" style={{ fontSize: '0.875em' }}>is already on board</div>
                                    </div>
                                }
                                <Mutation
                                    mutation={SAVE_FUNNEL_DOMAIN}
                                    variables={{
                                        id: currentUser.id,
                                        domain_or_subdomain: points.encodeDomain(state.domain_subdomain) + state.domain
                                    }} >
                                    {(saveFunnelDomain, { data, loading, error }) => {
                                        var isDisabled = !state.domain_subdomain ? true : false;
                                        if (!state.isFinish) {
                                            return <button className="font-roboto-light btn-success" onClick={() => this.saveFunnelGenieCredentialNewUser(saveFunnelDomain)} disabled={isDisabled}>NEXT <span className="fas fa-caret-right" style={{ marginLeft: 10 }} /></button>
                                        } else {
                                            return <button className="font-roboto-light btn-success" onClick={() => {
                                                this.props.refetch();
                                                let self = this, selected_domain = points.encodeDomain(state.domain_subdomain) + state.domain;
                                                self.setState({ ...initialize, isFinish: false, createDomain: false, createModal: false, newUserCreateModal: false });
                                                // old after set state set timeout to toggleCreateModal
                                                // setTimeout(function() {
                                                //     self.toggleCreateModal(selected_domain);
                                                // }, 100);
                                                if (this.props.history.location.state && this.props.history.location.state.redirect_link) { // to redirect to product and open the save to funnel
                                                    this.props.history.push(this.props.history.location.state.redirect_link, { redirected: true });
                                                }
                                            }}>FINISH</button>
                                        }
                                    }}
                                </Mutation>
                            </div>
                        </div>
                    </Modal>
                    : void 0}

                {/* Modal for adding new domain */}
                {state.createModal && state.createDomain && !state.newUserCreateModal ?
                    <Modal open={state.createModal} onOpen={() => this.getVideoData(380795973, "v4")} closeModal={this.toggleCreateModal.bind(this)} session={props.session} style={{ width: '30%', padding: 10, borderTop: '5px solid #23c78a', borderRadius: 10 }}>
                        <div className="center-vertical-parent">
                            <div className="form_wrap center-vertical">
                                <div style={{ width: '100%' }}>
                                    <span className="fas fa-arrow-left clickable" style={{ position: 'absolute', top: 20, left: 30, fontSize: 25 }} onClick={() => {
                                        if (state.selectedFunnelName) {
                                            // if funnel settings is open, back to funnel settings modal
                                            this.toggleCreateModal();
                                            this.setState({ openFunnelSetting: true });
                                        } else {
                                            // if create new funnel modal is open, back to create new funnel modal
                                            this.setState({ ...initialize, createDomain: false });
                                        }
                                    }} />
                                    <div className="form_row text-center">
                                        <img src="/assets/graphics/funnel-icon.png" style={{ maxWidth: '100px' }} />
                                    </div>
                                    <div className="form_row">
                                        <label className="font-questrial-light" style={{ fontSize: '1em' }}>
                                            Domain Name <span className="require-sign-color"> *</span> <br />
                                        </label>
                                        <input type="text" className="font-roboto-light" placeholder="Ex. funnelgenie.com" name="domain_subdomain" value={state.domain_subdomain} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em', textAlign: 'center' }} />
                                    </div>
                                    {state.errorText &&
                                        <div className="form_row error-container">
                                            <i className="fas fa-times" onClick={() => this.setState({ errorText: '' })} />
                                            <label className="font-questrial-light" style={{ fontSize: '0.875em' }} dangerouslySetInnerHTML={{ __html: state.errorText }} />
                                        </div>
                                    }
                                    {(() => {
                                        let check_domain = points.checkFreeDomain(domain_list), free_domain = "";
                                        if (check_domain.plgio) free_domain = check_domain.plgio_link;
                                        else if (check_domain.yg) free_domain = check_domain.yg_link;
                                        if (free_domain) {
                                            return (
                                                <button
                                                    className="row-separator stretch-width color-green"
                                                    onClick={() => this.setState({ domain: "." + free_domain, newUserCreateModal: true, createDomain: true, addNewFreeDomain: true })}
                                                    style={{ fontSize: '.8em' }}
                                                >Claim your {free_domain} domain here</button>
                                            );
                                        } else if (currentUser.access_tags.includes("free_domain")) {
                                            return (
                                                <div>
                                                    <button
                                                        className="row-separator stretch-width color-green"
                                                        onClick={() => this.setState({ domain: ".productlistgenie.io", newUserCreateModal: true, createDomain: true, addNewFreeDomain: true })}
                                                        style={{ fontSize: '.8em' }}
                                                    >Claim your productlistgenie.io domain here</button>
                                                    <button
                                                        className="row-separator stretch-width color-green"
                                                        onClick={() => this.setState({ domain: ".yalagenie.com", newUserCreateModal: true, createDomain: true, addNewFreeDomain: true })}
                                                        style={{ fontSize: '.8em' }}
                                                    >Claim your yalagenie.com domain here</button>
                                                </div>
                                            );
                                        } else return null;
                                    })()}
                                    <div className="text-center" style={{ marginBottom: 20 }}>
                                        <Mutation
                                            mutation={SAVE_FUNNEL_DOMAIN}
                                            variables={{
                                                id: currentUser.id,
                                                domain_or_subdomain: state.domain_subdomain.replace(/(^\w+:|^)\/\/|(www.)/g, '').toLowerCase(),
                                                selected_funnel_id: state.funnel_id
                                            }} >
                                            {(saveFunnelDomain, { data, loading, error }) => {
                                                return <button className="font-roboto-light btn-success" onClick={() => this.saveFunnelGenieCredential(saveFunnelDomain)} disabled={loading}>SAVE</button>
                                            }}
                                        </Mutation>
                                    </div>

                                    {(() => {
                                        if (!state.v4) return null;
                                        const video4_url = "https://player.vimeo.com/video/" + state.v4.id;
                                        return (
                                            <div className="video4" style={{ padding: '0 5px', width: '50%', minHeight: 125, margin: '0 auto' }}>
                                                <div className="product-card text-center">
                                                    <div className="cursor-pointer display-inline" onClick={() => this.toggleExplainerVideo(video4_url)} style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#3637388a' }}>
                                                        <label className="color-white" style={{ margin: '0 auto', fontSize: '3em' }}><span className="fas fa-play" /></label>
                                                    </div>
                                                    <img src={state.v4.thumbnail_large} width="100%" />
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </Modal>
                    : void 0}

                {/* Modal for adding new funnel */}
                {state.createModal && !state.createDomain && !state.newUserCreateModal ?
                    <Modal open={state.createModal} closeModal={this.toggleCreateModal.bind(this)} session={props.session} style={{ width: '40%', padding: 0, borderTop: '5px solid #23c78a', borderRadius: 10 }}>
                        <div className="form_wrap center-vertical-parent">
                            <div className="column_12_12 center-vertical">
                                <div className="form_row text-center">
                                    <img src="/assets/graphics/funnel-icon.png" style={{ maxWidth: '100px' }} />
                                    <h4 className="header" style={{ marginTop: 10 }}>Add new Funnel</h4>
                                </div>

                                <div className="column column_12_12">
                                    <div className="column column_12_12">
                                        <div className="form_row" style={{ position: 'relative' }}>
                                            <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>
                                                Website Name <span className="require-sign-color"> *</span>
                                            </label>
                                            {(() => {
                                                var options = currentUser.funnel_genie_domains.map((domain, index) => {
                                                    return <option key={index} value={domain}>{domain}</option>
                                                })
                                                return <SelectTag name="domainIndex" value={state.domainIndex} options={options} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />
                                            })()}
                                            <span className="clickable fas fa-plus" style={{ position: 'absolute', top: 33, right: 5, background: '#ff7838', color: '#fff', padding: '6px 7px', borderRadius: 3 }} title="Add more Domain" onClick={() => {
                                                if (currentUser.privilege == 1 && currentUser.funnel_genie_domains.length >= 2) { // User Privilege
                                                    this.trialMaxDomainReach();
                                                } else {
                                                    this.setState({ ...funnelSettingInitialize, errorText: '', openFunnelSetting: false, createModal: true, createDomain: true })
                                                }
                                            }} />
                                        </div>
                                    </div>
                                    <div className="column column_12_12">
                                        <div className="form_row">
                                            <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>
                                                Select funnel type <span className="require-sign-color"> *</span>
                                            </label>
                                            {(() => {
                                                var funnelTypes = [
                                                    <option key="0" value="blank">Blank</option>,
                                                    <option key="1" value="ecom">E-commerce</option>,
                                                    <option key="2" value="cpa">CPA/Affiliate Marketing</option>,
                                                    <option key="3" value="lgf">Lead Generation</option>,
                                                ]
                                                return <SelectTag name="funnelType" value={state.funnelType} options={funnelTypes} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />
                                            })()}
                                        </div>
                                    </div>
                                    <div className="column column_12_12">
                                        <div className="form_row">
                                            <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>
                                                Funnel Name <span className="require-sign-color"> *</span>
                                            </label>
                                            <input type="text" className="font-roboto-light" name="funnel_name" value={state.funnel_name} placeholder="Ex. Funnel Genie" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                        </div>
                                    </div>
                                    <div className="column column_12_12">
                                        <div className="form_row">
                                            {/* <label className="font-questrial-light" style={{fontSize: '0.875em'}}>
                                                Funnel Name 
                                            </label>
                                            <textarea type="text" className="font-roboto-light" name="funnel_name" value={state.funnel_name} placeholder="Ex. Funnel Genie" onChange={event => this.handleOnChange(event)} style={{marginTop: 10, fontSize: '0.875em'}} /> */}
                                            <Checkbox
                                                id="isWhatsApp"
                                                label='Generate default legal pages <span class="require-sign-color">(privacy policy, faqs, etc...)</span>'
                                                labelClassName="font-small"
                                                checked={state.legalPages}
                                                onChange={value => this.setState({ legalPages: value })}
                                            />
                                        </div>
                                    </div>
                                    {!state.legalPages && <div>
                                        <div className="column column_12_12">
                                            <div className="form_row">
                                                <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>
                                                    Select custom legal pages from your stores
                                                    <br />
                                                    <small>This will import your legal pages from the selected funnel domain</small>
                                                </label>
                                                {/* Query to Get all  funnel page list */}
                                                {currentUser && <Query
                                                    query={GET_FUNNEL_LIST(`{
                                                        id                                                        
                                                        funnel_name
                                                    }`)}

                                                    variables={{
                                                        creator: currentUser.id
                                                    }}>
                                                    {({ data, loading, error, refetch }) => {
                                                        if (loading) return <div className="text-center stretch-width"><Loading width={200} height={200} /></div>;
                                                        else if (error) return <div className="text-center"><label>An error has occurred please try again.</label></div>

                                                        return data.getFunnelList && ((funnelList) => {
                                                            var options = funnelList.map((item, index) => {
                                                                return <option key={index} value={item.id}>{this.presentableFunnelName(item.funnel_name)}</option>
                                                            })

                                                            return <SelectTag name="customLegalPageId" value={state.legalPagesId} options={[<option value={null}>-- Select Funnel --</option>, ...options]} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />
                                                        })(data.getFunnelList)
                                                    }}
                                                </Query>}
                                                {/* {(() => {
                                                    var customLegalPageSelection = [
                                                        <option key="0" value="blank">No saved pages...</option>,
                                                        <option key="1" value="cpa"></option>,
                                                        <option key="2" value="lgf"></option>,
                                                    ]
                                                    return <SelectTag name="customLegalPageSelected" value={state.customLegalPageSelected} options={customLegalPageSelection} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />
                                                })()} */}
                                            </div>
                                        </div>
                                        <div className="column column_12_12">
                                            <div className="form_row">
                                                <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>
                                                    Custom CSS <span className="require-sign-color"> *</span>
                                                </label>
                                                <textarea rows="6" className="message-area font-roboto-light stretch-width" name="customLegalPagesCSS" value={state.customLegalPagesCSS} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />

                                            </div>
                                        </div>
                                    </div>}
                                    {state.errorText &&
                                        <div className="column column_12_12">
                                            <div className="form_row">
                                                <div className="error-container">
                                                    <i className="fas fa-times" onClick={() => this.setState({ errorText: '' })} />
                                                    <label className="font-questrial-light" style={{ fontSize: '0.875em' }} dangerouslySetInnerHTML={{ __html: state.errorText }} />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div className="column column_12_12">
                                        <div className="text-center">
                                            <Mutation
                                                /*
                                                 para makuha ung modified list default funnel pwede mo mauha ung design
                                                 funnelPageList at funnelist na path yun yung gagamitin mo for sample lang
                                                 * mdofiy save funnel list with a non nunllable value so that it will not be required and 
                                                 * will not affect other query that using it now.
                                                */
                                                mutation={SAVE_FUNNEL_LIST}
                                                variables={{
                                                    creator: currentUser.id,
                                                    funnel_name: points.encodeDomain(state.funnel_name),
                                                    domain_name: state.domainIndex,
                                                    funnel_type: state.funnelType,
                                                    customLegalPageId: state.legalPagesId,
                                                    customCss: state.customLegalPagesCSS
                                                }} >
                                                {(saveFunnelList, { data, loading, error }) => {
                                                    var isDisabled = loading;
                                                    if (currentUser.funnel_genie_domains.length == 0) {
                                                        isDisabled = !state.domain_subdomain ? true : false;
                                                    }
                                                    if (!state.isFinish) {
                                                        return <button className="font-roboto-light btn-success" onClick={() => this.saveFunnelGenieCredential(saveFunnelList)} disabled={isDisabled}>CREATE</button>
                                                    } else {
                                                        return <button className="font-roboto-light btn-success" onClick={() => {
                                                            this.props.refetch();
                                                            var self = this;
                                                            self.setState({ ...initialize, isFinish: false, createDomain: false, createModal: false }, () => {
                                                                setTimeout(function () {
                                                                    self.toggleCreateModal();
                                                                }, 100);
                                                            })
                                                        }}>FINISH</button>
                                                    }
                                                }}
                                            </Mutation>
                                        </div>
                                    </div>
                                    {(() => {
                                        if (!state.v1) return null;
                                        const video1_url = "https://player.vimeo.com/video/" + state.v1.id;
                                        return (
                                            <div className="column video1" style={{ padding: '0 5px', width: '33.33%', minHeight: 125 }}>
                                                <div className="product-card text-center">
                                                    <div className="cursor-pointer display-inline" onClick={() => this.toggleExplainerVideo(video1_url)} style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#3637388a' }}>
                                                        <label className="color-white" style={{ margin: '0 auto', fontSize: '3em' }}>1</label>
                                                    </div>
                                                    <img src={state.v1.thumbnail_large} width="100%" />
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    {(() => {
                                        if (!state.v2) return null;
                                        const video2_url = "https://player.vimeo.com/video/" + state.v2.id;
                                        return (
                                            <div className="column video2" style={{ padding: '0 5px', width: '33.33%', minHeight: 125 }}>
                                                <div className="product-card text-center">
                                                    <div className="cursor-pointer display-inline" onClick={() => this.toggleExplainerVideo(video2_url)} style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#3637388a' }}>
                                                        <label className="color-white" style={{ margin: '0 auto', fontSize: '3em' }}>2</label>
                                                    </div>
                                                    <img src={state.v2.thumbnail_large} width="100%" />
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    {(() => {
                                        if (!state.v3) return null;
                                        const video3_url = "https://player.vimeo.com/video/" + state.v3.id;
                                        return (
                                            <div className="column video3" style={{ padding: '0 5px', width: '33.33%', minHeight: 125 }}>
                                                <div className="product-card text-center">
                                                    <div className="cursor-pointer display-inline" onClick={() => this.toggleExplainerVideo(video3_url)} style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#3637388a' }}>
                                                        <label className="color-white" style={{ margin: '0 auto', fontSize: '3em' }}>3</label>
                                                    </div>
                                                    <img src={state.v3.thumbnail_large} width="100%" />
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </Modal>
                    : void 0}

                {/* Modal for funnel setting */}
                {state.openFunnelSetting &&
                    <Modal open={state.openFunnelSetting} closeModal={() => this.toggleFunnelSettingModal()} session={props.session} style={{ width: '30%', borderTop: '5px solid #23c78a', borderRadius: 10, padding: 10 }}>
                        <div className="form_wrap center-vertical-parent">
                            <div className="column_12_12 center-vertical">
                                <div className="text-center">
                                    <img src="/assets/graphics/funnel-icon.png" style={{ maxWidth: '100px' }} />
                                    <h4 className="header" style={{ marginTop: 10 }}>Funnel Setting</h4>
                                </div>
                                <div className="form_row stretch-width" style={{ marginTop: 10, position: 'relative' }}>
                                    <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Website Name</label>
                                    {(() => {
                                        var options = currentUser.funnel_genie_domains.map((domain, index) => {
                                            return <option key={index} value={domain}>{domain}</option>
                                        })
                                        return <SelectTag name="new_domain_name" value={state.new_domain_name} options={options} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />
                                    })()}
                                    <span className="clickable fas fa-plus" style={{ position: 'absolute', top: 33, right: 5, background: '#ff7838', color: '#fff', padding: '6px 7px', borderRadius: 3 }} title="Add more Domain" onClick={() => {
                                        if (currentUser.privilege == 1 && currentUser.funnel_genie_domains.length >= 2) { // User Privilege
                                            this.trialMaxDomainReach();
                                        } else {
                                            this.setState({ openFunnelSetting: false, createModal: true, createDomain: true })
                                        }
                                    }} />
                                </div>
                                <div className="form_row">
                                    <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Favicon Image Link</label>
                                    <label htmlFor="upload-favicon" className="color-green cursor-pointer" style={{ padding: '0 10px' }}>Click here to upload file.</label>
                                    <input id="upload-favicon" className="hide" type="file" onChange={event => this.toggleUploadFavicon(event.target)} />
                                    <input type="text" className="font-roboto-light" name="favicon_link" value={state.favicon_link} placeholder="https://yourfaviconlink.com/favicon.png" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                </div>
                                <div className="form_row" style={{ padding: 0 }}>
                                    <div className="column column_6_12" style={{ padding: '0 5px 0 0' }}>
                                        <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>
                                            Funnel Name <span className="require-sign-color"> *</span>
                                        </label>
                                        <input type="text" className="font-roboto-light" value={state.new_funnel_name} name="new_funnel_name" placeholder="Ex. Funnel Genie" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                    <div className="column column_6_12" style={{ padding: '0 0 0 5px' }}>
                                        <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Funnel Phone Number</label>
                                        <input type="text" className="font-roboto-light" value={state.funnel_phone} name="funnel_phone" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />
                                    </div>
                                </div>
                                <div className="form_row" style={{ padding: 0 }}>
                                    <div className="column column_6_12" style={{ padding: '0 5px 0 0' }}>
                                        <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Funnel Email</label>
                                        <input type="text" className="font-roboto-light" value={state.funnel_email} name="funnel_email" placeholder="Ex. testfunnel@mail.com" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                    <div className="column column_6_12" style={{ padding: '0 0 0 5px' }}>
                                        <label className="font-questrial-light one-line-ellipsis" style={{ fontSize: '0.875em' }}>Funnel Address</label>
                                        <input type="text" className="font-roboto-light" value={state.funnel_address} name="funnel_address" placeholder="Ex. 5202 W Market St" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                </div>
                                <div className="form_row" style={{ padding: 0 }}>
                                    <div className="column column_12_12" style={{ padding: '0 5px 0 0' }}>
                                        <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Funnel Currency</label>
                                        {(() => {
                                            let currentOptions = cod_available_country("no_country").map((currency, index) => {
                                                return (
                                                    <option key={index} value={currency.iso2}>
                                                        {currency.cs} | {currency.cw} | {currency.name}
                                                    </option>
                                                )
                                            })
                                            return (
                                                <SelectTag name="funnel_currency" value={state.funnel_currency} options={currentOptions} onChange={event => this.handleOnChange(event)} style={{ marginBottom: 10 }} />
                                            )
                                        })()}
                                    </div>
                                </div>
                                <div className="row-separator stretch-width">
                                    <div className="row-separator">
                                        <label className="font-roboto-medium" style={{ fontSize: '1em' }}>Funnel Editor</label>
                                    </div>
                                    <div className="form_row">
                                        <Checkbox
                                            id="isWhatsApp"
                                            label="Funnel Phone Number is connected to WhatsApp"
                                            labelClassName="font-small"
                                            checked={state.isWhatsApp}
                                            onChange={value => this.setState({ isWhatsApp: value })}
                                        />
                                    </div>
                                    <div className="form_row">
                                        <Checkbox
                                            id="enableFloatingBar"
                                            label="Enable top floating bar"
                                            labelClassName="font-small"
                                            checked={state.enableFloatingBar}
                                            onChange={value => this.setState({ enableFloatingBar: value })}
                                        />
                                    </div>
                                    {state.enableFloatingBar &&
                                        <Input className="stretch-width" name="enableFloatingBarLink" value={state.enableFloatingBarLink} placeholder="Enter Floating Bar Link" onChange={input => this.setState({ [input.name]: input.value })} />
                                    }
                                    <div className="form_row">
                                        <Checkbox
                                            id="funnel_everflow"
                                            label="Enable Everflow tracking"
                                            labelClassName="font-small"
                                            checked={state.funnel_everflow}
                                            onChange={value => this.setState({ funnel_everflow: value })}
                                        />
                                    </div>
                                </div>
                                <div className="row-separator stretch-width">
                                    <label className="font-roboto-medium" style={{ fontSize: '1em' }}>Facebook Analytics</label>
                                </div>
                                <div className="form_row" style={{ padding: 0 }}>
                                    <div className="column column_6_12 row-separator" style={{ padding: '0 5px 0 0' }}>
                                        <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Pixel ID</label>
                                        <input type="text" className="font-roboto-light" value={state.facebook_id} name="facebook_id" placeholder="Ex. XXXXXXXXXXXXX" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                    <div className="column column_6_12 row-separator" style={{ padding: '0 5px 0 0' }}>
                                        <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Conversions API</label>
                                        <input type="text" className="font-roboto-light" value={state.facebook_access_token} name="facebook_access_token" placeholder="Paste Access Token Here" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                </div>
                                <div className="row-separator stretch-width">
                                    <label className="font-roboto-medium" style={{ fontSize: '1em' }}>Google Analytics and Snapchat Pixel ID:</label>
                                </div>
                                <div className="form_row" style={{ padding: 0 }}>
                                    <div className="column column_4_12 row-separator" style={{ padding: '0 0 0 5px' }}>
                                        <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Google Analytics ID</label>
                                        <input type="text" className="font-roboto-light" value={state.google_id} name="google_id" placeholder="Ex. UI-XXXXXXXXXXXXX" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                    <div className="column column_4_12 row-separator" style={{ padding: '0 0 0 5px' }}>
                                        <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Tiktok Analytics ID</label>
                                        <input type="text" className="font-roboto-light" value={state.tiktok_id} name="tiktok_id" placeholder="Ex. UI-XXXXXXXXXXXXX" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>

                                    <div className="column column_4_12 row-separator" style={{ padding: '0 5px 0 0' }}>
                                        <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Snapchat Pixel ID</label>
                                        <input type="text" className="font-roboto-light" value={state.snapchat_id} name="snapchat_id" placeholder="Ex. XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                </div>
                                <div className="text-left stretch-width">
                                    <label className="font-roboto-medium" style={{ fontSize: '1em' }}>Choose your payment gateway:</label>
                                </div>
                                <div className="form_row">
                                    <div className="column column_12_12">
                                        <Query query={GET_MY_INTEGRATIONS} notifyOnNetworkStatusChange={true} variables={{
                                            id: currentUser.id
                                        }} onCompleted={data => {
                                            var klaviyoArray = data.getMyIntegrations.filter(el => el.merchant_type == "klaviyo");
                                            if (klaviyoArray.length == 0) {
                                                this.setState({ klaviyoSegmentation: [] })
                                            } else {
                                                klaviyoArray.forEach(el => {
                                                    points.customFetch("/getKlaviyoSegments/" + this.decode(el.private_key), "GET", null, result => {
                                                        var list = JSON.parse(result);
                                                        this.setState({ klaviyoSegmentation: list })
                                                    })
                                                })
                                            }
                                        }}>
                                            {({ data, loading, refetch, error }) => {
                                                if (loading) return <Loading width={100} height={100} />;
                                                if (error) return <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>An error has occured please try again.</label>
                                                if (data.getMyIntegrations.length == 0) return <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>No integration found. <a href="/integrations">Click here</a> to add new integration.</label>
                                                var options = [<option key={0} value=",,,">Select Your Merchant</option>];
                                                var paypalOptions = [<option key={0} value="n/a">Disable Paypal as checkout option</option>];
                                                var isHaveMerchant = false;
                                                var isHavePaypalMerchant = false;
                                                // if(!state.funnel_selected_merchant){
                                                //     options.push(<option key={0} value=",,,">Select Your Merchant</option>);
                                                // }
                                                data.getMyIntegrations.filter(el => el.merchant_type != "klaviyo" && el.merchant_type != "twilio").forEach((integration, index) => {
                                                    index += 1;
                                                    var selectValue = integration.merchant_type + "," + (integration.public_key ? integration.public_key : "N/A") + "," + integration.private_key + "," + (integration.other ? integration.other : "N/A");
                                                    if ((integration.merchant_type != "paypal") && (integration.merchant_type != "paypalv2")) {
                                                        isHaveMerchant = true;
                                                        options.push(<option key={index} value={selectValue}>{integration.merchant_name}</option>)
                                                    } else {
                                                        isHavePaypalMerchant = true;
                                                        if (integration.merchant_type == "paypal") {
                                                            paypalOptions.push(<option key={index} value={integration.private_key}>{integration.merchant_name}</option>)
                                                        }
                                                        if (integration.merchant_type == "paypalv2") {
                                                            paypalOptions.push(<option key={index} value={`${integration.public_key}:${integration.other}:${integration.private_key}_PAYPALV2`}>{integration.merchant_name}</option>)
                                                        }
                                                    }
                                                })
                                                return (
                                                    <div>
                                                        {isHavePaypalMerchant &&
                                                            <SelectTag name="paypal_integration" value={state.paypalClientID} options={paypalOptions} onChange={event => {
                                                                this.setState({ paypalClientID: event.target.value })
                                                            }} style={{ marginTop: 10 }} />
                                                        }
                                                        {isHaveMerchant ?
                                                            <SelectTag name="integration" value={state.funnel_selected_merchant + "," + state.funnel_stripe_public + "," + state.funnel_stripe_private + "," + state.funnel_other} options={options} onChange={event => {
                                                                var type = event.target.value.split(",")[0];
                                                                var publicKey = event.target.value.split(",")[1];
                                                                var privateKey = event.target.value.split(",")[2];
                                                                var other = event.target.value.split(",")[3];
                                                                this.setState({ funnel_selected_merchant: type, funnel_stripe_public: publicKey, funnel_stripe_private: privateKey, funnel_other: other })
                                                            }} style={{ marginTop: 10 }} />
                                                            : void 0}
                                                    </div>
                                                );
                                            }}
                                        </Query>
                                        {(state.paypalClientID && state.paypalClientID != "n/a") || state.funnel_selected_merchant ?
                                            <div className="text-center" style={{ marginTop: 10 }}>
                                                {(() => {
                                                    var merchant = "";
                                                    if (state.paypalClientID) {
                                                        merchant += "<span class='color-green'>Paypal</span>, ";
                                                    }
                                                    if (state.funnel_selected_merchant) {
                                                        merchant += "<span class='color-orange'>" + points.capitalizeWord(state.funnel_selected_merchant) + "</span>";
                                                    } else {
                                                        merchant = merchant.replace(", ", "");
                                                    }
                                                    var label = "You selected " + merchant + " as your payment gateway.";
                                                    return <label dangerouslySetInnerHTML={{ __html: label }} />;
                                                })()}
                                            </div>
                                            : void 0}
                                    </div>
                                </div>
                                {state.klaviyoSegmentation && state.klaviyoSegmentation.length != 0 ?
                                    <div className="form_row">
                                        <div className="text-left stretch-width">
                                            <label className="font-roboto-medium" style={{ fontSize: '1em' }}>Email Integration:</label>
                                        </div>
                                        <div className="column column_12_12">
                                            {(() => {
                                                if (state.klaviyoSegmentation) {
                                                    if (state.klaviyoSegmentation.length == 0) {
                                                        return <label className="font-questrial-light">No List Found!</label>
                                                    } else {
                                                        var confirmationOptions = [<option key={0} value="">Select Order Confirmation Email</option>];
                                                        var abandonmentOptions = [<option key={0} value="">Select Abandonment Email</option>];
                                                        var trackingOptions = [<option key={0} value="">Select Tracking Email</option>];
                                                        var onHolOptions = [<option key={0} value="">Select On Hold Email</option>];
                                                        state.klaviyoSegmentation.forEach((el, e_index) => {
                                                            e_index += 1;
                                                            confirmationOptions.push(<option key={e_index} value={el.list_id}>{el.list_name}</option>);
                                                            abandonmentOptions.push(<option key={e_index} value={el.list_id}>{el.list_name}</option>);
                                                            trackingOptions.push(<option key={e_index} value={el.list_id}>{el.list_name}</option>);
                                                            onHolOptions.push(<option key={e_index} value={el.list_id}>{el.list_name}</option>);
                                                        })

                                                        return (
                                                            <div style={{ marginTop: 10 }}>
                                                                <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Select Order Confirmation</label>
                                                                <SelectTag name="confirmationEmail" value={state.confirmationEmail} options={confirmationOptions} onChange={event => this.handleOnChange(event)} style={{ marginBottom: 10 }} />
                                                                <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Select Cart abandonment</label>
                                                                <SelectTag name="abandonmentEmail" value={state.abandonmentEmail} options={abandonmentOptions} onChange={event => this.handleOnChange(event)} style={{ marginBottom: 10 }} />
                                                                <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Select Tracking Email</label>
                                                                <SelectTag name="trackingEmail" value={state.trackingEmail} options={trackingOptions} onChange={event => this.handleOnChange(event)} style={{ marginBottom: 10 }} />
                                                                <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Select On Hold Email</label>
                                                                <SelectTag name="onHoldEmail" value={state.onHoldEmail} options={onHolOptions} onChange={event => this.handleOnChange(event)} style={{ marginBottom: 10 }} />
                                                            </div>
                                                        );
                                                    }
                                                } else {
                                                    return <Loading width={100} height={100} />
                                                }
                                            })()}
                                        </div>
                                    </div>
                                    : void 0}
                                <div className="form_row">
                                    <Checkbox
                                        id="send_email"
                                        label="Send Email Confirmation (PLG)"
                                        labelClassName="header-medium-bold font-small"
                                        checked={state.sendPLGEmailConfirmation}
                                        onChange={value => this.setState({ sendPLGEmailConfirmation: value })}
                                    />
                                </div>
                                <div className="form_row">
                                    <Checkbox
                                        id="send_email_tracking"
                                        label="Send Email Tracking (PLG)"
                                        labelClassName="header-medium-bold font-small"
                                        checked={state.sendPLGEmailTracking}
                                        onChange={value => this.setState({ sendPLGEmailTracking: value })}
                                    />
                                </div>
                                <div className="form_row">
                                    <Checkbox
                                        id="send_email_abandonment"
                                        label="Send Email Abandonment (PLG)"
                                        labelClassName="header-medium-bold font-small"
                                        checked={state.sendPLGEmailAbandonment}
                                        onChange={value => this.setState({ sendPLGEmailAbandonment: value })}
                                    />
                                </div>
                                {state.fulfillByPLG || state.fulfillByPLG == null ?
                                    <div className="form_row">
                                        <Checkbox
                                            id="fulfill_by_plg"
                                            label="Fulfilled by PLG (MiddleEast)"
                                            labelClassName="header-medium-bold font-small"
                                            checked={state.fulfill_by_plg}
                                            onChange={value => this.setState({ fulfill_by_plg: value })}
                                        />
                                    </div>
                                    : <div className="form_row">
                                        <Checkbox
                                            id="fulfill_by_plg"
                                            label="Fulfilled by PLG (MiddleEast)"
                                            labelClassName="header-medium-bold font-small"
                                            checked={state.fulfill_by_plg}
                                            onChange={value => this.setState({ fulfill_by_plg: value })}
                                        />
                                    </div>}
                                <div className="row-separator column column_12_12 notify-label font-small">
                                    <label className="font-questrial-light">Remember, after you click SAVE be sure to save and publish all pages for the changes to reflect</label>
                                </div>
                                <div className="column column_12_12 form_buttons text-center form_row">
                                    <Mutation
                                        mutation={UPDATE_FUNNELGENIE_SETTING}
                                        variables={{
                                            funnel_id: state.funnel_id,
                                            funnel_name: state.new_funnel_name,
                                            domain_name: state.new_domain_name,
                                            funnel_use_email_confirmation: state.sendPLGEmailConfirmation,
                                            funnel_use_email_tracking: state.sendPLGEmailTracking,
                                            funnel_use_email_abandonment: state.sendPLGEmailAbandonment,
                                            funnel_is_phone_whatsapp: state.isWhatsApp,
                                            funnel_phone: state.funnel_phone,
                                            funnel_enable_floating_bar: state.enableFloatingBar,
                                            funnel_enable_floating_bar_link: state.enableFloatingBarLink,
                                            funnel_address: state.funnel_address,
                                            funnel_email: state.funnel_email,
                                            funnel_currency: state.funnel_currency,
                                            funnel_favicon_link: state.favicon_link,
                                            funnel_facebook_id: state.facebook_id,
                                            funnel_facebook_access_token: state.facebook_access_token,
                                            funnel_google_id: state.google_id,
                                            funnel_tiktok_id: state.tiktok_id,
                                            funnel_everflow: state.funnel_everflow,
                                            funnel_snapchat_id: state.snapchat_id,
                                            gateway_selected_merchant: state.funnel_selected_merchant,
                                            gateway_stripe_public: state.funnel_stripe_public,
                                            gateway_stripe_private: state.funnel_stripe_private,
                                            gateway_other: state.funnel_other,
                                            gateway_paypal_client_id: state.paypalClientID,
                                            integration_confirmation_email: state.confirmationEmail,
                                            integration_abandonment_email: state.abandonmentEmail,
                                            integration_tracking_email: state.trackingEmail,
                                            integration_onhold_email: state.onHoldEmail,
                                            is_fulfill_by_plg: state.fulfill_by_plg
                                        }} onCompleted={data => this.refetchFunnelById()}>
                                        {(updateFunnelGenieSetting, { data, loading, error }) => {
                                            return <button className="font-roboto-light btn-success" onClick={() => {
                                                points.executeMutation(updateFunnelGenieSetting, toastr, () => {
                                                    this.toggleFunnelSettingModal();
                                                    points.toastrPrompt(toastr, "success", "Setting has been saved.", "Success");
                                                })
                                            }} disabled={loading}>Save</button>
                                        }}
                                    </Mutation>
                                </div>
                                <div className="column column_12_12 text-center">
                                    <a href="javascript:document.querySelector('.close').click()" className="font-roboto-light" style={{ fontSize: '0.875em' }}>Cancel</a>
                                </div>
                            </div>
                        </div>
                    </Modal>
                }

                {/* Modal for page setting */}
                {state.pageSettings &&
                    <Modal open={state.pageSettings} closeModal={() => this.togglePageSettings()} session={props.session} style={{ width: '30%', borderTop: '5px solid #23c78a', borderRadius: 10, padding: 10 }}>
                        <div className="form_wrap center-vertical-parent">
                            <div className="column_12_12 center-vertical">
                                <div className="form_row text-center">
                                    <img src="/assets/graphics/funnel-icon.png" style={{ maxWidth: '100px' }} />
                                    <h4 className="header" style={{ marginTop: 10 }}>Page Settings</h4>
                                </div>
                                <div className="form_row">
                                    <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>
                                        Page Name <span style={{ fontSize: '0.7em' }}>(Empty page name is equivalent to homepage)</span>
                                    </label>
                                    <input type="text" className="font-roboto-light" value={state.newPageName} name="newPageName" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                </div>
                                <div className="form_row">
                                    <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Page Title</label>
                                    <input type="text" className="font-roboto-light" value={state.page_title} name="page_title" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                </div>
                                <div className="form_row">
                                    <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Page Description</label>
                                    <input type="text" className="font-roboto-light" value={state.page_description} name="page_description" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                </div>
                                <div className="form_row">
                                    <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>
                                        Page OG: Image URL
                                        <ButtonWithPopup data={{
                                            triggerDOM: <span id="whats_this" className="whats_this">i</span>,
                                            popupPosition: "bottom center",
                                            text: <label className="font-roboto-light">The URL for an image you want to<br />represent your content.</label>,
                                            triggerID: "whats_this",
                                            loading: false,
                                            padding: 5,
                                            checkORtimesButton: false,
                                            onAction: 'hover',
                                            style: {
                                                borderRadius: 5,
                                                padding: 5
                                            }
                                        }} />
                                    </label>
                                    <input type="text" className="font-roboto-light" value={state.page_og_image} name="page_og_image" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                </div>
                                <div className="form_row">
                                    <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>Page Keyword</label>
                                    <input type="text" className="font-roboto-light" value={state.page_keyword} name="page_keyword" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                </div>
                                {state.facebook_id &&
                                    <div className="form_row">
                                        <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>This will change/overwrite your tracking code (header)</label>
                                        <div className="messaging-center">
                                            {(() => {
                                                var trackEvent = [
                                                    <option key="0" value="">Select Facebook Track Event</option>,
                                                    <option key="1" value={'<script>!function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0"; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,"script", "https://connect.facebook.net/en_US/fbevents.js"); fbq("init", "' + state.facebook_id + '"); fbq("track", "PageView"); fbq("track", "ViewContent"); </script> <noscript> <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=' + state.facebook_id + '&ev=PageView&noscript=1"/> </noscript>'}>View Content</option>,
                                                    <option key="2" value={'<script>!function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0"; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,"script", "https://connect.facebook.net/en_US/fbevents.js"); fbq("init", "' + state.facebook_id + '"); fbq("track", "PageView"); fbq("track", "AddToCart"); </script> <noscript> <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=' + state.facebook_id + '&ev=PageView&noscript=1"/> </noscript>'}>Add to Cart</option>,
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
                                        <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>
                                            Embed Tracking Code into the Header <span style={{ fontSize: '0.7em' }}>(HTML or Javascript)</span>
                                        </label>
                                        <textarea rows="6" className="message-area font-roboto-light stretch-width" name="funnel_ga" value={state.funnel_ga} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                </div>
                                <div className="form_row">
                                    <div className="messaging-center">
                                        <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>
                                            Embed Tracking Code into the Footer  <span style={{ fontSize: '0.7em' }}>(HTML or Javascript)</span>
                                        </label>
                                        <textarea rows="6" className="message-area font-roboto-light stretch-width" name="funnel_fga" value={state.funnel_fga} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <Mutation
                                        mutation={UPDATE_FUNNEL_SETTING}
                                        variables={{
                                            id: state.selectedPageID,
                                            creator: currentUser.id,
                                            funnel_name: state.selectedFunnelName,
                                            changePageNameTo: points.encodeDomain(state.newPageName),
                                            domainIndex: state.selectedDomainIndex,
                                            funnel_ga: state.funnel_ga.replace(/<!--[\s\S]*?-->/gm, ""),
                                            funnel_fga: state.funnel_fga.replace(/<!--[\s\S]*?-->/gm, ""),
                                            page_title: state.page_title,
                                            page_description: state.page_description,
                                            page_og_image_link: state.page_og_image,
                                            page_keyword: state.page_keyword
                                        }} >
                                        {(updateFunnelSetting, { datass, loading, error }) => {
                                            return <button className="btn-success font-roboto-light" onClick={() => this.updatePageSetting(updateFunnelSetting)} disabled={loading}>SAVE</button>
                                        }}
                                    </Mutation>
                                </div>
                            </div>
                        </div>
                    </Modal>
                }

                {/* Modal for copying other funnel pages (admin) */}
                {state.viewOtherFunnel &&
                    <Modal open={state.viewOtherFunnel} closeModal={() => this.toggleViewOtherFunnel()} session={props.session} style={{ borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0, width: '30%' }}>
                        <div className="form_wrap center-vertical-parent">
                            {state.searchMode &&
                                <div className="column_12_12 center-vertical">
                                    <div className="form_row text-center">
                                        <img src="/assets/graphics/funnel-icon.png" style={{ maxWidth: '100px' }} />
                                        <h4 className="header" style={{ marginTop: 10 }}>Copy User Funnel Pages</h4>
                                    </div>
                                    <h3>Search User</h3>
                                    <div className="form_row">
                                        <input type="text" className="font-roboto-light" placeholder="Ex. testemail@main.com, First Name, Last Name" name="search" value={state.search} onChange={event => this.handleOnChange(event)} style={{ fontSize: '0.875em' }} />
                                    </div>
                                    <div className="form_row form_buttons">
                                        <button className="font-roboto-light btn-success stretch-width" onClick={() => this.searchUser()}>Search</button>
                                    </div>
                                    {/* User Result */}
                                    <div className="form_row">
                                        <div className="form_input form_buttons">
                                            <Query query={SEARCH_USERS} variables={{
                                                search: state.searchVal,
                                                filter: "funnel_genie_domains"
                                            }}>
                                                {({ data, loading, refetch, error }) => {
                                                    if (loading) {
                                                        return (
                                                            <div className="text-center">
                                                                <Loading height={150} width={150} />
                                                            </div>
                                                        );
                                                    }

                                                    this.refetch = refetch;

                                                    if (data.getSearchedUsers.length == 0) {
                                                        return (
                                                            <div className="text-center">
                                                                <span className="no-result">{state.searchVal ? "No Result Found." : void 0}</span>
                                                            </div>
                                                        );
                                                    }

                                                    return data.getSearchedUsers.map((user, user_index) => {
                                                        var cn = "product-card";

                                                        if (state.selectedStoreID == user.id) {
                                                            cn += " card-active"
                                                        }

                                                        return (
                                                            <div className={cn} key={user_index}>
                                                                <div className="product-details one-line-ellipsis">
                                                                    <div style={{ fontSize: 12 }}>
                                                                        <strong>ID: </strong>{user.id}
                                                                    </div>
                                                                    <strong>{user.store_url}</strong> <br />
                                                                    {user.firstName} {user.lastName} <br />
                                                                    <span style={{ fontSize: 12 }}><strong>Credits: </strong>{"$" + points.commafy(user.plg_balance.toFixed(2))}</span>
                                                                    <div className="float-right" style={{ marginTop: 5 }}>
                                                                        <span className="clickable" onClick={() => this.selectUser(user.id, user.firstName + " " + user.lastName, user.funnel_genie_domains)}>
                                                                            View Funnel &nbsp;<span className="fas fa-arrow-right"></span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    });
                                                }}
                                            </Query>
                                        </div>
                                    </div>
                                </div>
                            }

                            {!state.searchMode &&
                                <div>
                                    <style dangerouslySetInnerHTML={{
                                        __html: `
                                        .funnel .popup-content {
                                            width: 80% !important;
                                        }
                                    `}} />
                                    <div className="column column_4_12">
                                        <span className="fas fa-arrow-left clickable" onClick={() => this.setState({ searchMode: true, selectedUserFunnelID: "" })} /> <br />
                                        <div className="product-card">
                                            <div className="product-details" style={{ overflow: 'auto', height: '77vh' }}>
                                                <label className="font-questrial-light" style={{ fontSize: '1.5em' }}>Funnels</label>
                                                <Query query={
                                                    GET_FUNNEL_LIST(`{ id domain_name funnel_name page_count }`)
                                                } variables={{ creator: state.userID, show_page_count: true }} >
                                                    {({ data, loading, refetch, error }) => {
                                                        if (loading) return <Loading width={100} height={100} />

                                                        if (data.getFunnelList.length == 0) {
                                                            return (
                                                                <div className="text-center">
                                                                    <span>This user doesn't have any funnels yet.</span>
                                                                </div>
                                                            );
                                                        }

                                                        return data.getFunnelList.map((funnel, index) => {
                                                            return (
                                                                <div className="product-card" key={index}>
                                                                    <div className="product-details one-line-ellipsis">
                                                                        <strong style={{ color: '#27c686' }}>Domain: </strong>
                                                                        <span>{funnel.domain_name}</span> <br />
                                                                        <strong style={{ color: '#27c686' }}>Funnel Name: </strong><span style={{ color: '#7d7878' }}>{funnel.funnel_name}</span> <br />
                                                                        <strong style={{ color: '#27c686' }}>Pages: </strong><span style={{ color: '#7d7878' }}>{funnel.page_count}</span>
                                                                        <span className="clear" />
                                                                        <div className="column column_6_12">
                                                                            <div className="clickable" onClick={() => this.setState({ selectedUserFunnelID: funnel.id })}>
                                                                                View Pages &nbsp;
                                                                                <span className="fas fa-arrow-right" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="column column_6_12">
                                                                            <div className="clickable text-right" onClick={() => {
                                                                                var sharableURL = points.clientUrl + "/share-funnel?shared=true&token=" + this.encode(state.userID) + "&name=" + this.encode(funnel.funnel_name) + "&fid=" + this.encode(funnel.id);
                                                                                points.copyStringToClipboard(sharableURL);
                                                                                toastr.clear();
                                                                                toastr.success("Sharable Link is now copied.", "Copied!")
                                                                            }}>
                                                                                Share &nbsp;
                                                                                <span className="fas fa-share" />
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
                                    </div>
                                    <div className="column column_8_12">
                                        <br />
                                        {!state.selectedUserFunnelID &&
                                            <div className="product-card">
                                                <div className="product-details text-center center-vertical" style={{ overflow: 'auto', height: '77vh' }}>
                                                    <label className="font-questrial-light" style={{ fontSize: '1em' }}>Funnel Pages will display here.</label>
                                                </div>
                                            </div>
                                        }
                                        {state.selectedUserFunnelID &&
                                            <div style={{ overflow: 'auto', height: '77vh' }}>
                                                <Query query={
                                                    GET_FUNNEL_PAGE_LIST(`{ path funnel_name domain_name page_type design { date screenshot_url json } }`)
                                                } variables={{ funnel_id: state.selectedUserFunnelID, loadLastDesign: true }}>
                                                    {({ data, loading, refetch, error }) => {
                                                        if (loading) return <Loading width={100} height={100} />

                                                        if (error) {
                                                            toastr.clear();
                                                            toastr.error("An error has occurred.", "Please try again.");
                                                            return null;
                                                        }

                                                        var isAutoGenerated = false, autoGeneratedCount = -1;
                                                        return data.getFunnelPageList.map((funnel, index) => {
                                                            var designLastObject = funnel.design.length != 0 ? funnel.design[funnel.design.length - 1] : null;
                                                            var lastSaved = designLastObject ? parseInt(designLastObject.date) : null;
                                                            var path = funnel.path ? funnel.path : "homepage";
                                                            var pageLink = "https://" + funnel.domain_name + "/" + funnel.funnel_name + (funnel.path ? "/" + funnel.path : "");
                                                            if (funnel.page_type == "generated_page") {
                                                                isAutoGenerated = true;
                                                                autoGeneratedCount += 1;
                                                            }

                                                            return (
                                                                <div className={"column column_3_12" + (isAutoGenerated && autoGeneratedCount == 0 ? " clear" : "")} key={index}>
                                                                    <div className="product-card">
                                                                        <div className="product-details one-line-ellipsis" style={{ fontSize: 15 }}>
                                                                            <div className="ellipsis" style={{ width: '100%', marginBottom: '1rem' }}>
                                                                                <label className="clickable capitalize font-roboto-bold" style={{ fontSize: '0.875em' }}>
                                                                                    {path.replace(/-/g, " ")}
                                                                                </label>
                                                                            </div>
                                                                            {designLastObject && designLastObject.screenshot_url ?
                                                                                <ButtonWithPopup data={{
                                                                                    triggerDOM: <a href={pageLink} target="_blank" id="hover"> <img src={designLastObject && designLastObject.screenshotURL ? designLastObject.screenshotURL + "?" + lastSaved : "https://via.placeholder.com/500x400?text=NOT AVAILABLE"} height="100px" width="100%" style={{ border: '1px solid #00000014' }} /> </a>,
                                                                                    popupPosition: "bottom center",
                                                                                    title: "",
                                                                                    text: <span className="capitalize">Visit {path.replace(/-/g, " ")}</span>,
                                                                                    triggerID: "hover",
                                                                                    loading: false,
                                                                                    onAction: "hover",
                                                                                    checkORtimesButton: false,
                                                                                    padding: 0
                                                                                }} />
                                                                                :
                                                                                <img src={designLastObject && designLastObject.screenshot_url ? designLastObject.screenshot_url + "?" + lastSaved : "https://via.placeholder.com/500x400?text=NOT AVAILABLE"} height="104px" width="100%" style={{ border: '1px solid #00000014' }} />
                                                                            }
                                                                            <div>
                                                                                <button className="font-roboto-light btn-warning stretch-width" onClick={() => {
                                                                                    var regex1 = new RegExp('"url":"\/' + funnel.funnel_name, "g");
                                                                                    var regex2 = new RegExp('href=\\\\"' + funnel.funnel_name, "g")
                                                                                    var design = designLastObject.json.replace(regex1, '"url":"\/[funnel_name]').replace(regex2, 'href=\\"[funnel_name]');
                                                                                    // start remove soon
                                                                                    design = design.replace(/jerome@themillionairemastermind.com/g, "[shop_email]").replace(/>shop_email</g, ">[shop_email]<")
                                                                                    // end remove soon
                                                                                    var x = {
                                                                                        "creator": "[creator]",
                                                                                        "domainIndex": "[domainIndex]",
                                                                                        "funnel_name": "[funnel_name]",
                                                                                        "path": funnel.path,
                                                                                        "funnel_type": "ecom",
                                                                                        "page_type": funnel.page_type,
                                                                                        "design": [{
                                                                                            "date": "[date]",
                                                                                            "json": JSON.parse(design),
                                                                                        }]
                                                                                    }
                                                                                    points.copyStringToClipboard(JSON.stringify(x));
                                                                                    toastr.clear();
                                                                                    toastr.success("JSON successfully copied", "Success");
                                                                                }} style={{ fontSize: '0.875em' }}>
                                                                                    Copy JSON &nbsp;
                                                                                    <span className="fas fa-copy" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        });
                                                    }}
                                                </Query>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </Modal>
                }

                {/* Funnel Diagram */}
                {state.openFunnelDiagram &&
                    <Modal open={state.openFunnelDiagram} closeModal={() => this.toggleFunnelDiagram()} session={props.session} style={{ borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0, width: '80%' }}>
                        <FunnelDiagram funnel_id={state.diagramFunnelID} />
                    </Modal>
                }

                {/* Upload Favicon */}
                {state.openUploadFavicon &&
                    <Modal open={state.openUploadFavicon} closeModal={() => this.toggleUploadFavicon()} session={props.session} style={{ borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0, minWidth: '50%' }}>
                        <Mutation
                            mutation={UPDATE_FUNNEL_SETTING}
                            variables={{
                                creator: currentUser.id,
                                funnel_name: state.selectedFunnelName,
                                domainIndex: state.selectedDomainIndex,
                                changeDomainIndexTo: parseInt(state.newDomainIndex),
                                changeDomainNameTo: currentUser.funnel_genie_domains[parseInt(state.newDomainIndex)],
                                changeFunnelNameTo: points.encodeDomain(state.newFunnelName),
                                funnel_phone: state.funnel_phone,
                                funnel_email: state.funnel_email,
                                funnel_address: state.funnel_address,
                                funnel_selected_merchant: state.funnel_selected_merchant,
                                funnel_stripe_public: state.funnel_stripe_public,
                                funnel_stripe_private: state.funnel_stripe_private,
                                funnel_other: state.funnel_other,
                                paypalClientID: state.paypalClientID,
                                confirmationEmail: state.confirmationEmail,
                                abandonmentEmail: state.abandonmentEmail,
                                trackingEmail: state.trackingEmail,
                                favicon_link: state.favicon_link,
                                facebook_id: state.facebook_id,
                                facebook_access_token: state.facebook_access_token,
                                google_id: state.google_id,
                                tiktok_id: state.tiktok_id,
                                funnel_everflow: state.funnel_everflow
                            }} >
                            {(updateFunnelSetting, { datass, loading, error }) => {
                                return <UploadFavicon file={state.fileValue} callback={link => {
                                    this.setState({
                                        favicon_link: link
                                    }, () => {
                                        this.updatePageSetting(updateFunnelSetting, true)
                                    })
                                }} />;
                            }}
                        </Mutation>
                    </Modal>
                }

                {/* Modal for email and sms integration */}
                {state.openEmailAndSMS &&
                    <Modal open={state.openEmailAndSMS} closeModal={() => this.toggleEmailAndSMS()} session={props.session} style={{ borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0, width: '60%' }}>
                        <EmailAndSMSIntegration funnel_id={state.emailAndSMSv1} />
                    </Modal>
                }

                {/* Modal for email and sms integration */}
                {state.openEmailAndSMSv2 &&
                    <Modal open={state.openEmailAndSMSv2} closeModal={() => this.toggleEmailAndSMSv2()} session={props.session} style={{ borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0, width: '60%' }}>
                        <EmailSequence funnel_id={state.emailAndSMSv2} />
                    </Modal>
                }

                {/* Modal for explainer video */}
                {state.openExplainer &&
                    <Modal open={state.openExplainer} closeModal={() => this.toggleExplainerVideo()} session={props.session} style={{ background: state.explainerWithBackground ? '#fff' : 'unset', border: 'none', padding: 0, width: '70%', textAlign: 'center' }}>
                        <iframe id="vmplayer" src={state.explainerLink} width="100%" onLoad={event => event.target.height = (event.target.offsetWidth / 16 * 9)} frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen style={{ marginTop: 50 }} />
                        {state.explainerWithBackground &&
                            <div className="page-container">
                                <Checkbox
                                    id="do_not_show_again"
                                    label="Do not show this again"
                                    labelClassName="header-medium-bold font-small"
                                    checked={state.explainerDoNotShowAgain}
                                    onChange={value => this.setState({ explainerDoNotShowAgain: value }, () => localStorage.setItem("plg_funnel_main_video", value))}
                                    containerClassName="row-separator"
                                />
                            </div>
                        }
                    </Modal>
                }
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(FunnelGenieMainDEV);