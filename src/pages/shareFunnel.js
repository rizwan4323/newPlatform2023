import React from 'react';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
import { GET_SHARED_FUNNEL, SAVE_SHARED_FUNNEL, SAVE_FUNNEL_DOMAIN, SAVE_SHARED_FUNNEL_LIST, GET_FUNNEL_COUNT } from '../queries';
import { Query, Mutation } from 'react-apollo';
import Loading from '../components/loading';
import toastr from 'toastr';
import Modal from '../components/ModalComponent';
import SelectTag from '../components/selectTag';
const points = require('../../Global_Values');
const designTemplate = require('../../FunnelGenieTemplate');

// * Save from Free Viral
import FvSaveFunnelDomain from './freeviralProcess/fvSaveFunnelDomain';


var initializeForm = {
    domainIndex: -1,
    funnel_name: "",
    errorText: ""
}


// let refetchDomain = null;

class ShareFunnel extends React.Component {
    constructor(props) {
        super();
        this.state = {
            sharer_id: '',
            shared_funnel_name: '',
            newUserCreateModal: false,
            createModal: false,
            isFromViral: false,
            domain_subdomain: "",
            funnel_name: "",
            design_page: 0,
            design_list: designTemplate.homepages,
            totalFunnel: 0,
            shared_funnel_id: '',
            exportModal: false,
            selectedPages: [],
            ...initializeForm
        }
    }

    componentDidMount() {
        toastr.options = points.toastrInitialize();

        // if (refetchDomain) refetchDomain(); // to refresh the page when go back
        // console.log( newUserCreateModal: (this.props.session.currentUser.funnel_genie_domains.lenth == 0 )? true : false );

        var urlSearch = new URLSearchParams(window.location.href)
        let domain_list = this.props.session.getCurrentUser.funnel_genie_domains;
        var userid = this.decryptString(urlSearch.get("token"));
        var funnel_name = this.decryptString(urlSearch.get("name"));
        var funnel_id = this.decryptString(urlSearch.get("fid")); // &businessname=GaiousAntonio
        var fromViral = (urlSearch.get("fromViral") == null) ? false : true;
        var businessname = urlSearch.get("businessname"); // domain_subdomain
        // var funnelName = urlSearch.get('funnel_name');
        console.log('asdfasdf', businessname);
        console.log(domain_list.length);


        this.setState({
            sharer_id: userid,
            shared_funnel_name: funnel_name,
            fromViral: fromViral,
            shared_funnel_id: funnel_id,
            newUserCreateModal: (domain_list.length == 0 && !fromViral) ? true : false,
            domain_subdomain: (businessname == null) ? "" : businessname
        });
    }

    // startFreeViral(){
    //     document.getElementsByName("name");
    // }

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

    saveFunnelGenieCredentialNewUser(saveFunnelGenieCredential) {
        this.setState({
            errorText: '',
            loadingNewUser: true
        }, () => {
            saveFunnelGenieCredential().then(({ data }) => {
                this.setState({
                    loadingNewUser: false
                }, () => {
                    // refetchDomain();
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

    decryptString(str) {
        return atob(str);
    }

    saveSelected() {
        var selected_id = [];
        document.querySelectorAll(".flex-container [type='checkbox']").forEach(el => {
            if (el.checked) {
                selected_id.push(el.id)
            }
        })
        console.log(selected_id);
        this.setState({
            selectedPages: selected_id
        })
    }

    handleOnChange(event) {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [name]: value
        })
    }

    toggleExportModal() {
        this.setState({ exportModal: !this.state.exportModal }, () => this.saveSelected())
    }

    setErrorMessage(err, callback) {
        this.setState({
            errorText: err
        }, () => {
            if (callback) {
                callback()
            }
        })
    }

    validation(saveSharedFunnel, callback) {
        var state = this.state;
        var currentUser = this.props.session.getCurrentUser;
        this.setErrorMessage("", () => {
            if (currentUser.funnel_genie_domains.length == 0) {
                this.setErrorMessage("Please set up your funnel first.");
            } else if (parseInt(state.domainIndex) == -1) {
                this.setErrorMessage("Please select domain.");
            } else if (!state.funnel_name) {
                this.setErrorMessage("Funnel Name is required.");
            } else if (state.selectedPages.length == 0) {
                this.setErrorMessage("Please Select Pages to import.");
            } else {
                if (saveSharedFunnel) this.saveSharedFunnel(saveSharedFunnel);
                else callback();
            }
        })
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
        this.setState({ ...initializeForm, createDomain: false, newUserCreateModal: false, createModal: !this.state.createModal, domainIndex: selected_domain ? selected_domain : currentUser.funnel_genie_domains[0] }, () => {
            if (this.state.createModal) {
                // this.getVideoData(380796306, "v1");
                // this.getVideoData(380795973, "v2");
                // this.getVideoData(380796852, "v3");
            }
        });
    }

    saveSharedFunnel(saveSharedFunnel) {
        saveSharedFunnel().then(({ data }) => {
            this.setState({ ...initializeForm })
            this.toggleExportModal();
            this.props.history.push("/funnel-genie-main")
        }).catch(error => {
            this.setState({ errorText: error.graphQLErrors[0].message })
        });
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Share Funnel Genie - Product List Genie</title>
            </Helmet>
        );
    }

    renderPages() {
        this.saveSelected();
        return (<span></span>);
    }

    render() {
        const state = this.state;
        let props = this.props;
        const currentUser = this.props.session.getCurrentUser;
        let domain_list = currentUser.funnel_genie_domains;

        // ? FOR the freeviral instant mutate on load ...
        // https://app.productlistgenie.io/createaccount/?email=gaiousantonio4@gmail.com&firstname=Gaious&lastname=Antonio&rdir=https%3A%2F%2Fapp.productlistgenie.io%2Fshare-funnel%3Fshared%3Dtrue%26token%3DNWMyN2VjMjU0MjUwNzU3ZTU1YTJkMTAx%26name%3DbmV3ZXN0LXRlbXBsYXRl%26fid%3DNWYzOWI3YzYyZmNiMzAwYTkyZDUyMDM1
        // * Test Shared Funnel === http://localhost:3000/share-funnel?shared=true&token=NWJmZWIyMWI0OWFjZGEwZmI3ZTQwMGVk&name=ZnVubmVs&fid=NWY0Y2ZlOTQ2ZDg5Y2EwMmUyMzNiYmYy&isFromViral=true
        if (state.fromViral) {

            return (
                <div className="funnel">
                    {this.head()}
                    <div className="column column_12_12">
                        <div className="center-vertical-parent" style={{ height: '80vh' }}>
                            <Query query={GET_SHARED_FUNNEL} variables={{
                                id: state.sharer_id,
                                funnel_name: state.shared_funnel_name,
                                funnel_id: state.shared_funnel_id,
                                loadLastDesign: true
                            }}>
                                {({ data, loading, refetch, error }) => {
                                    if (loading) return <Loading width={500} height={500} />;
                                    if (error) {
                                        return (
                                            <div className="text-center" style={{ padding: '10% 0' }}>
                                                <img src="/assets/graphics/no-result.svg" width="200px" /> <br />
                                                <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! THAT'S AN ERROR!</h4> <br />
                                                <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>
                                                    Error loading the funnel shared data. please try again.
                                                    </label>
                                            </div>
                                        );
                                    }
                                    if (data.getSharedFunnel.length == 0) {
                                        return (
                                            <div className="text-center" style={{ padding: '10% 0' }}>
                                                <img src="/assets/graphics/no-result.svg" width="200px" /> <br />
                                                <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! THAT'S AN ERROR!</h4> <br />
                                                <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>
                                                    No result found for <u className="color-green">"{state.shared_funnel_name}"</u> shared by the user.
                                                    </label>
                                            </div>
                                        );
                                    }

                                    return (
                                        <Mutation
                                            mutation={SAVE_FUNNEL_DOMAIN}
                                            variables={{
                                                id: currentUser.id,
                                                domain_or_subdomain: points.encodeDomain(state.domain_subdomain).substring(0,14).replaceAll(" ","") + ".productlistgenie.io"
                                            }} >
                                            {(saveFunnelDomain, { datum, loading, error }) => {
                                                this.props.refetch()
                                                return <FvSaveFunnelDomain selectedPages={data.getSharedFunnel.map((pages, index) => pages.id)} currentID={currentUser.id} shared_funnel_id={state.shared_funnel_id} funnelName={state.shared_funnel_name} domain={state.domain_subdomain + ".productlistgenie.io"} saveFunnelDomain={saveFunnelDomain} {...props} />
                                            }}
                                        </Mutation>
                                    );
                                }}
                            </Query>
                        </div>
                    </div>
                </div>
            );
        } else
            if (state.sharer_id && state.shared_funnel_name) {
                return (
                    <div className="funnel">
                        <Query query={GET_FUNNEL_COUNT} variables={{ creator: currentUser.id, search: state.searchValue }} notifyOnNetworkStatusChange={true} onCompleted={data => {
                            if (data.getTotalFunnel) this.setState({ totalFunnel: data.getTotalFunnel.count ? data.getTotalFunnel.count : 0 });
                        }}>
                            {({ data, loading, refetch, error }) => {
                                this.refetchAllFunnelCount = refetch;
                                return null;
                            }}
                        </Query>
                        {this.head()}
                        <div className="column column_12_12">
                            <div className="center-vertical-parent" style={{ minHeight: '80vh' }}>
                                <div className="center-vertical">
                                    <Query query={GET_SHARED_FUNNEL} variables={{
                                        id: state.sharer_id,
                                        funnel_name: state.shared_funnel_name,
                                        funnel_id: state.shared_funnel_id,
                                        loadLastDesign: true
                                    }}>
                                        {({ data, loading, refetch, error }) => {
                                            if (loading) return <Loading width={500} height={500} />;
                                            if (error) {
                                                return (
                                                    <div className="text-center" style={{ padding: '10% 0' }}>
                                                        <img src="/assets/graphics/no-result.svg" width="200px" /> <br />
                                                        <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! THAT'S AN ERROR!</h4> <br />
                                                        <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>
                                                            Error loading the funnel shared data. please try again.
                                                    </label>
                                                    </div>
                                                );
                                            }
                                            if (data.getSharedFunnel.length == 0) {
                                                return (
                                                    <div className="text-center" style={{ padding: '10% 0' }}>
                                                        <img src="/assets/graphics/no-result.svg" width="200px" /> <br />
                                                        <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! THAT'S AN ERROR!</h4> <br />
                                                        <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>
                                                            No result found for <u className="color-green">"{state.shared_funnel_name}"</u> shared by the user.
                                                    </label>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div className="column column_8_12">
                                                    <div className="column column_12_12" style={{ float: 'unset' }}>
                                                        <div className="product-card">
                                                            <div className="product-details" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                                                                <div className="column column_6_12">
                                                                    <label className="font-header">Funnel Pages for <u className="color-green">"{points.capitalizeWord(state.shared_funnel_name.replace(/-|_/g, " "))}"</u></label>
                                                                </div>
                                                                <div className="column column_6_12 text-right">
                                                                    <button className="btn-success" onClick={() => this.toggleExportModal()}>Import</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="column column_12_12" style={{ float: 'unset' }}>
                                                        <div className="product-card">
                                                            <div className="product-details" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                                                                <input id="click_all" type="checkbox" style={{ width: 'fit-content' }} onChange={event => {
                                                                    // check all checkbox
                                                                    document.querySelectorAll(".flex-container [type='checkbox']").forEach(el => {
                                                                        if (event.target.checked != el.checked) {
                                                                            el.click();
                                                                        }
                                                                    });
                                                                }} defaultChecked={true} /> <label htmlFor="click_all" className="clickable">Check/Uncheck All</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-container">
                                                        {(() => {
                                                            return data.getSharedFunnel.map((pages, p_index) => {
                                                                var path = pages.path ? pages.path : "homepage";
                                                                var designLastObject = pages.design[pages.design.length - 1];
                                                                var lastSaved = designLastObject ? parseInt(designLastObject.date) : null;
                                                                return (
                                                                    <div className="column column_3_12" key={p_index}>
                                                                        <div className="product-card">
                                                                            <div className="product-details">
                                                                                <span className={this.getPageIcon(path, pages.page_type) + " color-green"} /> <label>{points.capitalizeWord(path.replace(/-|_/g, " "))}</label>
                                                                                <img src={designLastObject && designLastObject.screenshot_url ? designLastObject.screenshot_url + "?" + lastSaved : "/assets/graphics/unpublished-icon.png"} width="100%" style={{ marginTop: 10, border: '1px solid #00000014' }} />
                                                                                <input id={pages.id} type="checkbox" style={{ width: 'fit-content' }} defaultChecked={true} /> <label htmlFor={pages.id} className="clickable">Include this page</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })
                                                        })()}
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    </Query>
                                </div>
                            </div>
                        </div>



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
                                                    return <button className="font-roboto-light btn-success" onClick={() => this.saveFunnelGenieCredentialNewUser(saveFunnelDomain)} disabled={isDisabled}> NEXT <span className="fas fa-caret-right" style={{ marginLeft: 10 }} /></button>
                                                } else {
                                                    return <button className="font-roboto-light btn-success" onClick={() => {
                                                        this.props.refetch();
                                                        let self = this, selected_domain = points.encodeDomain(state.domain_subdomain) + state.domain;
                                                        self.setState({ ...initializeForm, isFinish: false, createDomain: false, createModal: false, newUserCreateModal: false });
                                                        // old after set state set timeout to toggleCreateModal
                                                        // setTimeout(function() {
                                                        //     self.toggleCreateModal(selected_domain);
                                                        // }, 100);
                                                        // if (this.props.history.location.state && this.props.history.location.state.redirect_link) { // to redirect to product and open the save to funnel
                                                        //     this.props.history.push(this.props.history.location.state.redirect_link, { redirected: true });
                                                        // }
                                                    }}>FINISH</button>
                                                }
                                            }}
                                        </Mutation>
                                    </div>
                                </div>
                            </Modal>
                            : void 0}

                        {state.exportModal &&
                            <Modal open={state.exportModal} closeModal={() => this.toggleExportModal()} session={this.props.session} style={{ borderTop: '5px solid #23c78a', borderRadius: 10, padding: 10, width: '30%' }}>
                                <div className="center-vertical-parent">
                                    <div className="form_wrap center-vertical">
                                        <div className="form_row" style={{ position: 'relative' }}>
                                            <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>
                                                Select Domain <span className="require-sign-color"> *</span>
                                            </label>
                                            {(() => {
                                                var options = [<option key={0} value="-1">Select Your Preferred Domain</option>]
                                                currentUser.funnel_genie_domains.map((domain, index) => {
                                                    options.push(<option key={index + 1} value={domain}>{domain}</option>)
                                                })
                                                return <SelectTag name="domainIndex" value={state.domainIndex} options={options} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />
                                            })()}
                                        </div>
                                        <div className="form_row">
                                            <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>
                                                Funnel Name <span className="require-sign-color"> *</span>
                                            </label>
                                            <input type="text" className="font-roboto-light" name="funnel_name" value={state.funnel_name} placeholder="Ex. Funnel Genie" onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                        </div>
                                        {state.errorText &&
                                            <div className="form_row">
                                                <div className="error-container">
                                                    <i className="fas fa-times" onClick={() => this.setState({ errorText: '' })} />
                                                    <label className="font-questrial-light" style={{ fontSize: '0.875em' }} dangerouslySetInnerHTML={{ __html: state.errorText }} />
                                                </div>
                                            </div>
                                        }
                                        <Mutation
                                            mutation={SAVE_SHARED_FUNNEL_LIST}
                                            variables={{
                                                funnel_id: state.shared_funnel_id,
                                                creator: currentUser.id,
                                                domain_name: state.domainIndex,
                                                funnel_name: points.encodeDomain(state.funnel_name),
                                                selected_page_ids: state.selectedPages.length != 0 ? JSON.stringify(state.selectedPages) : ""
                                            }} >
                                            {(saveSharedFunnelList, { data, loading, error }) => {
                                                return <button className="btn-success" onClick={() => {
                                                    this.validation(null, () => {
                                                        points.executeMutation(saveSharedFunnelList, toastr, () => {
                                                            this.props.history.push("/funnel-genie-main");
                                                        })
                                                    })
                                                }} disabled={loading}>SAVE</button>
                                            }}
                                        </Mutation>
                                        {/* <Mutation
                                        mutation={SAVE_SHARED_FUNNEL}
                                        variables={{
                                            sharer_id: state.sharer_id,
                                            creator: currentUser.id,
                                            domainIndex: parseInt(state.domainIndex),
                                            funnel_name: points.encodeDomain(state.funnel_name),
                                            selectedPages: state.selectedPages.length != 0 ? JSON.stringify(state.selectedPages) : ""
                                        }} >
                                        {(saveSharedFunnel, { data, loading, error }) => {
                                            return <button className="btn-success" onClick={() => this.validation(saveSharedFunnel)} disabled={loading}>SAVE</button>
                                        }}
                                    </Mutation> */}
                                    </div>
                                </div>
                            </Modal>
                        }
                    </div>
                );
            } else {
                return (
                    <div className="funnel">
                        {this.head()}
                        <div className="column column_12_12">
                            <div className="center-vertical-parent" style={{ height: '80vh' }}>
                                <h1 className="center-vertical">Preparing...</h1>
                            </div>
                        </div>
                    </div>
                );
            }
    }
}

export default withAuth(session => session && session.getCurrentUser)(ShareFunnel);