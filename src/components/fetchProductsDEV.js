import React from 'react';
import toastr from 'toastr';
import ProductCard from '../components/productCard';
import { Mutation } from 'react-apollo';
import Modal from './ModalComponent/';
import { ACCEPT_TOS } from './../queries';
import UpsellAlert from '../components/ModalComponent/upsellAlert';
import Pagination from '../components/pagination';
import ProductFilter from '../components/productFilter';
import Loading from '../components/loading';
import * as Cookies from 'es-cookie';
import SelectTag from './selectTag';
const ShortId = require('id-shorter');
const mongoDBId = ShortId({ isFullId: true });
const condition = require('../../Global_Conditions');
const points = require('../../Global_Values');
const initializeState = {
    data: [],
    temp: [],
    isLoading: true,
    isMoreLoading: true,
    createModal: false,
    noResult: false,
    isMoreNoResult: false,
    filterText: 'No Filter applied.',
    favorites: { prodid: null, handle: null, title: null, src: null, price: null },
    removeId: null,
    displayPerPage: 60,
    pageNumber: 1,
    lastCursor: "",
    totalCount: 0,
    activeTab: '',
    activeLanguage: '',
    // new form 
    select_country: "",
    isProdTestedopt: "no",
    sourcing_standard: "no",
}

class FetchProducts extends React.Component {
    constructor() {
        super();
        this.state = {
            genie_choice: [],
            ...initializeState
        }
    }

    componentDidMount() {
        toastr.options = points.toastrInitialize();
        if (this.props.userData.match.params.niches == "cod") {
            this.setState({ ...initializeState, activeTab: "cod-available" }, () => {
                this.getFilteredCOD();
                this.getFilteredCOD("genie_choice", 5);
            });
        } else {
            this.getProducts(this.props.userData.match.params.niches);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.userData.match.params.niches !== this.props.userData.match.params.niches) { // only when switch from e.g brandable to cod
            if (this.props.userData.match.params.niches == "cod") {
                this.setState({ ...initializeState, activeTab: "cod-available" }, () => this.getFilteredCOD());
            } else {
                this.getProducts(this.props.userData.match.params.niches);
            }
        }
    }

    handleOnChange(name, event) {
        var value = event.target.value;
        this.setState({ [name]: value })
    }


    getProducts(collectionUrl) {
        toastr.clear();
        toastr.info("Loading please wait...");
        points.fetchGET("https://productlistgenie.io/collections/" + collectionUrl + "/products.json?limit=" + this.state.displayPerPage + "&page=" + this.state.pageNumber, res => {
            toastr.clear();
            this.getProductsCount(collectionUrl, res.products);
        });
    }

    getProductsCount(collectionUrl, data) {
        points.fetchGET("https://productlistgenie.io/collections/" + collectionUrl + ".json", result => {
            points.fetchGET("/api/get-collection-products-count/" + result.collection.id, res => {
                this.setState({ data, isLoading: false, totalCount: res.count }, () => points.displayPLGInventoryOnShopifyProduct(data, mongoDBId));
            });
        });
    }

    getFilteredCOD(selected_tag, selected_limit) {
        let is_genies_choice = (selected_tag && selected_limit) ? true : false;
        let state = this.state, limit = state.displayPerPage, { activeTab, activeLanguage } = state, tags = points.getShopifyProduct(activeTab, activeLanguage);
        let private_tags = points.getShopifyPrivateTag(this.props.userData.session.getCurrentUser);
        if (is_genies_choice) {
            points.toastrPrompt(toastr, "info", "Loading please wait...");
            tags = selected_tag;
            limit = selected_limit;
        }
        let link = "/api/get-collection-products?limit=" + limit + "&after=" + state.lastCursor + "&tags=" + tags;
        if (private_tags.length != 0) {
            link += "&excludeTags=";
            private_tags.forEach(tag => {
                link += " AND -tag: -" + tag;
            });
            link += " ";
        }
        points.fetchGET(link, result => {
            if (result.status == 200) {
                toastr.clear();
                if (result.data.length == 0) {
                    this.setState({ isLoading: false, noResult: true });
                } else {
                    if (!is_genies_choice) {
                        let isMoreNoResult = result.data.length < state.displayPerPage;
                        this.setState({ data: result.data, isLoading: false, isMoreLoading: false, totalCount: null, lastCursor: result.data[result.data.length - 1].cursor, isMoreNoResult }, () => points.displayPLGInventoryOnShopifyProduct(result.data, mongoDBId));
                    } else {
                        this.setState({ genie_choice: result.data });
                    }
                }
            } else {
                toastr.clear();
                points.toastrPrompt(toastr, "warning", "Please try again.");
            }
        });
    }

    getMOreFilteredCOD() {
        toastr.clear();
        toastr.info("Loading please wait...");
        this.setState({ isMoreLoading: true, isMoreNoResult: false }, () => {
            const state = this.state, { activeTab, activeLanguage } = state, tags = points.getShopifyProduct(activeTab, activeLanguage);
            const private_tags = points.getShopifyPrivateTag(this.props.userData.session.getCurrentUser);
            var link = "/api/get-collection-products?limit=" + state.displayPerPage + "&after=" + state.lastCursor + "&tags=" + tags;
            console.log(link)
            if (private_tags.length != 0) {
                link += "&excludeTags=";
                private_tags.forEach(tag => {
                    link += " AND -tag: -" + tag;
                });
                link += " ";
            }
            points.fetchGET(link, result => {
                if (result.status == 200) {
                    toastr.clear();
                    let data = this.state.data;
                    data.push(...result.data);
                    if (result.data.length == 0 || (result.data.length - 1) < state.displayPerPage) {
                        //Fix July15
                        // this.setState({ isMoreLoading: false, isMoreNoResult: true });
                        this.setState({ data, isMoreLoading: false, lastCursor: result.data[result.data.length - 1].cursor });
                    } else {
                        this.setState({ data, isMoreLoading: false, lastCursor: result.data[result.data.length - 1].cursor });
                    }
                } else {
                    toastr.clear();
                    points.toastrPrompt(toastr, "warning", "Please try again.");
                }
            });
        })
    }

    changeAvailability(activeTab) {
        const activeLanguage = this.state.activeLanguage;
        const stateTab = this.state.activeTab;
        if (activeTab == stateTab) activeTab = "";
        this.setState({ ...initializeState, activeTab, activeLanguage }, () => this.getFilteredCOD());
    }

    changeCODLocation(activeLanguage) {
        const stateLanguage = this.state.activeLanguage;
        const activeTab = this.state.activeTab;
        if (activeLanguage == stateLanguage) activeLanguage = "";
        this.setState({ ...initializeState, activeTab, activeLanguage }, () => this.getFilteredCOD());
    }

    nextOrPrev() {
        points.smoothScrollInto(document.body);
        this.setState({ isLoading: true }, () => this.getProducts(this.props.userData.match.params.niches));
    }

    // ? Modal Video
    toggleCreateModal() {
        this.setState({ createModal: !this.state.createModal });
    }

    getLabelName(niches) {
        var loc = this.state.activeLanguage;
        function getShippingDays() {
            if (loc == "ph") {
                return " (Shipping 7 to 10 days)";
            } else if (loc == "uae") {
                return " (Shipping 3 to 4 days)";
            } else if (loc == "ksa") {
                return " (Shipping 3 to 5 days)";
            }
            return "";
        }
        if (niches == "winners") {
            return "Hot Products";
        } else if (niches == "cod") {
            return "Cash On Delivery" + getShippingDays();
        } else {
            return points.capitalizeWord(niches.replace(/-|_/g, " "));
        }
    }

    applyFilter() {
        toastr.clear();
        toastr.info("Loading please wait...");
        var ratingMin = document.getElementById("rating-min").innerHTML, ratingMax = document.getElementById("rating-max").innerHTML, strMin = document.getElementById("str-min").innerHTML, strMax = document.getElementById("str-max").innerHTML;
        // check if empty all input
        if ((!ratingMin || !ratingMax) && (!strMin || !strMax)) {
            toastr.clear();
            toastr.warning("Please enter ratings or strength range.", "Required.");
            return;
        }
        // check rating if valid
        if (parseFloat(ratingMin) > parseFloat(ratingMax)) {
            toastr.clear();
            toastr.warning("Make sure minimum rating is less than maximum rating.", "Rating Invalid Range.");
            return;
        }
        // check strength if valid
        if (parseInt(strMin) > parseInt(strMax)) {
            toastr.clear();
            toastr.warning("Make sure minimum strength is less than maximum strength.", "Strength Invalid Range.");
            return;
        }

        var rating = generateRatingFilter();
        var strength = generateStrengthFilter();
        var fullFilterString = "", filterText = "";
        if (rating) {
            fullFilterString += rating;
            filterText += "Rating: " + ratingMin + "-" + ratingMax;
        }
        if (rating && strength) {
            fullFilterString += " AND ";
            filterText += " and ";
        }
        if (strength) {
            fullFilterString += strength;
            filterText += "Strength: " + strMin + "-" + strMax;
        }
        var payload = { filterQuery: fullFilterString };
        points.customFetch('/api/filter-products', 'POST', payload, result => {
            var refactor = [];
            result.data.products.edges.forEach(data => {
                refactor.push({
                    created_at: data.node.createdAt,
                    handle: data.node.handle,
                    id: parseInt(data.node.id.replace("gid://shopify/Product/", "")),
                    images: [{ src: data.node.images.edges[0].node.originalSrc }],
                    published_at: data.node.updatedAt,
                    tags: data.node.tags,
                    title: data.node.title,
                    updated_at: data.node.updatedAt,
                    variants: [{ price: data.node.variants.edges[0].node.price }]
                })
            })
            this.setState({ data: refactor, isLoading: false, temp: this.state.data, filterText: filterText, noResult: refactor.length == 0 ? true : false })
        })



        // generate filter string functions
        function generateRatingFilter() {
            var ratingmin = parseFloat(ratingMin), ratingmax = parseFloat(ratingMax);
            var ratingstr = "";
            var i = ratingmin;
            while (i <= ratingmax) {
                ratingstr += "gr_" + i.toFixed(1).replace(".0", "") + " OR ";
                i += 0.1;
            }
            return ratingstr.substring(0, ratingstr.length - 4);
        }
        function generateStrengthFilter() {
            var strmin = parseInt(strMin), strmax = parseInt(strMax);
            var strstr = "";
            var x = strmin;
            while (x <= strmax) {
                strstr += "ms_" + x + " OR ";
                x += 1;
            }
            return strstr.substring(0, strstr.length - 4);
        }
    }

    removeFilter() {
        this.setState({ filterText: 'No Filter applied.', data: this.state.temp, isLoading: false });
    }

    toggleModalUpsell() {
        this.setState({ openUpsell: !this.state.openUpsell });
    }

    acceptTOS(acceptTOS) {
        acceptTOS().then(async ({ data }) => {
            window.location.reload();
        }).catch(error => {
            console.error("acceptTOS ERR =>", error);
        });
    }

    comingSoon(country_name) {
        points.toastrPrompt(toastr, "success", country_name + " coming soon!");
    }

    render() {
        const state = this.state, currentUser = this.props.userData.session.getCurrentUser, niches = this.props.userData.match.params.niches, showLanguageFilter = niches == "brandable";
        return (
            <div className="funnel">
                <div className="newPageHeader display-inline row-separator" style={{ padding: niches == "cod" ? '15px 10px' : '20px 10px' }}>
                    <span className="hide-in-desktop float-left" style={{ padding: 15 }} />
                    <div className="column column_5_12 row-separator">
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>{this.getLabelName(niches)}</h4>
                        {niches != "cod" && <label style={{ color: '#878787' }}>{state.filterText} {state.filterText != "No Filter applied." ? <span className="fas fa-times" style={{ marginLeft: 5, color: '#ff0100', cursor: 'pointer' }} onClick={() => this.removeFilter()} /> : void 0}</label>}
                        {/* TODO :: niches COD Type Availability Filter */}
                        {niches == "cod" &&
                            <div className="flex-container display-inline" style={{ justifyContent: 'flex-start', marginTop: 10 }}>
                                <label>Availability: </label>
                                <div className="flex-container lang-available" style={{ justifyContent: 'flex-start' }}>
                                    <label className={"cursor-pointer" + (state.activeTab == "cod-available" ? " lang-active" : "")} style={{ marginLeft: 5, padding: 5, border: '1px solid transparent', borderBottom: '1px solid #27c686' }} onClick={() => this.changeAvailability("cod-available")}>In Stock</label>
                                    {/* <label className={"cursor-pointer" + (state.activeTab == "cod-test" ? " lang-active" : "")} style={{ marginLeft: 5, padding: 5, border: '1px solid transparent', borderBottom: '1px solid #27c686' }} onClick={() => this.changeAvailability("cod-test")}>For Testing</label> */}
                                    <label className={"cursor-pointer" + (state.activeTab == "cod-arabic" ? " lang-active" : "")} style={{ marginLeft: 5, padding: 5, border: '1px solid transparent', borderBottom: '1px solid #27c686' }} onClick={() => {
                                        let has_arabic_funnel_access = condition.has_arabic_funnel(currentUser);
                                        if (!has_arabic_funnel_access) window.open('https://themm.kartra.com/page/YIw155');
                                        else this.changeAvailability("cod-arabic");
                                    }}>Arabic Funnels</label>
                                    {condition.is_exclusive_vip_user(currentUser) &&
                                        <label className={"cursor-pointer" + (state.activeTab == "xvip" ? " lang-active" : "")} style={{ marginLeft: 5, padding: 5, border: '1px solid transparent', borderBottom: '1px solid #27c686' }} onClick={() => this.changeAvailability("xvip")}>Exclusive VIP</label>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                    <div className="column column_3_12 row-separator">
                        {niches == "cod" &&
                            <button className="btn-success font-roboto-light" onClick={() => {
                                if (currentUser.privilege === 10) {
                                    this.toggleCreateModal();
                                } else {
                                    toastr.options.timeOut = 2000;
                                    toastr['success']('This is not available yet.', 'Coming Soon');
                                }
                            }} style={{ margin: '0 5px' }}>
                                <span className="hide-in-mobile">Sell Anything You Want</span>
                            </button>}
                    </div>
                    <div className="column column_4_12 row-separator">
                        {/* TODO :: niches COD Type Locations Tag */}
                        {niches == "cod" ?
                            <div className="flex-container display-inline" style={{ justifyContent: 'flex-end' }}>
                                <label>Location: </label>
                                <div className="flex-container lang-available" style={{ justifyContent: 'flex-start' }}>
                                    {/* <span className={"lang-bh cursor-pointer" + (state.activeLanguage == "lang_bh" ? " lang-active" : "")} onClick={() => {
                                        // User Privilege
                                        if (currentUser.privilege == 10 || currentUser.access_tags.includes("bahrain")) points.toastrPrompt(toastr, "success", "Please wait Bahrain is still under development");
                                        else this.comingSoon("Bahrain");
                                    }} style={{ padding: 3 }} /> */}
                                    {/* <span className={"lang-eg cursor-pointer" + (state.activeLanguage == "lang_eg" ? " lang-active" : "")} onClick={() => {
                                        // User Privilege
                                        if (currentUser.privilege == 10 || currentUser.access_tags.includes("egypt")) points.toastrPrompt(toastr, "success", "Please wait Egypt is still under development");
                                        else this.comingSoon("Egypt");
                                    }} style={{ padding: 3 }} /> */}
                                    {/* <span className={"lang-kw cursor-pointer" + (state.activeLanguage == "lang_kw" ? " lang-active" : "")} onClick={() => {
                                        // User Privilege
                                        if (currentUser.privilege == 10 || currentUser.access_tags.includes("kuwait")) points.toastrPrompt(toastr, "success", "Please wait Kuwait is still under development");
                                        else this.comingSoon("Kuwait");
                                    }} style={{ padding: 3 }} /> */}
                                    {/* <span className={"lang-qa cursor-pointer" + (state.activeLanguage == "lang_qa" ? " lang-active" : "")} onClick={() => {
                                        // User Privilege
                                        if (currentUser.privilege == 10 || currentUser.access_tags.includes("qatar")) points.toastrPrompt(toastr, "success", "Please wait Qatar is still under development");
                                        else this.comingSoon("Qatar");
                                    }} style={{ padding: 3 }} /> */}
                                    {/* <span className={"lang-om cursor-pointer" + (state.activeLanguage == "lang_om" ? " lang-active" : "")} onClick={() => {
                                        // User Privilege
                                        if (currentUser.privilege == 10 || currentUser.access_tags.includes("oman")) points.toastrPrompt(toastr, "success", "Please wait Oman is still under development");
                                        else this.comingSoon("Oman");
                                    }} style={{ padding: 3 }} /> */}
                                    {/* <span className={"lang-ph cursor-pointer" + (state.activeLanguage == "lang_ph" ? " lang-active" : "")} onClick={() => {
                                        // User Privilege
                                        if (currentUser.privilege == 10 || currentUser.access_tags.includes("philippines")) this.changeCODLocation("lang_ph");
                                        else this.comingSoon("Philippines");
                                    }} style={{ padding: 3 }} /> */}
                                    <span className={"lang-ph cursor-pointer" + (state.activeLanguage == "lang_ph" ? " lang-active" : "")} onClick={() => this.changeCODLocation("lang_ph")} style={{ padding: 3 }} />
                                    <span className={"lang-bh cursor-pointer" + (state.activeLanguage == "lang_bh" ? " lang-active" : "")} onClick={() => this.changeCODLocation("lang_bh")} style={{ padding: 3 }} />
                                    <span className={"lang-kw cursor-pointer" + (state.activeLanguage == "lang_kw" ? " lang-active" : "")} onClick={() => this.changeCODLocation("lang_kw")} style={{ padding: 3 }} />
                                    <span className={"lang-qa cursor-pointer" + (state.activeLanguage == "lang_qa" ? " lang-active" : "")} onClick={() => this.changeCODLocation("lang_qa")} style={{ padding: 3 }} />
                                    <span className={"lang-om cursor-pointer" + (state.activeLanguage == "lang_om" ? " lang-active" : "")} onClick={() => this.changeCODLocation("lang_om")} style={{ padding: 3 }} />
                                    <span className={"lang-ksa cursor-pointer" + (state.activeLanguage == "lang_ksa" ? " lang-active" : "")} onClick={() => this.changeCODLocation("lang_ksa")} style={{ padding: 3 }} />
                                    <span className={"lang-uae cursor-pointer" + (state.activeLanguage == "lang_uae" ? " lang-active" : "")} onClick={() => this.changeCODLocation("lang_uae")} style={{ padding: 3 }} />
                                </div>
                            </div>
                            :
                            <ProductFilter float="right" showLanguageFilter={showLanguageFilter} activeLanguage={state.activeLanguage.replace("lang_", "")} activeLanguageCallback={data => this.changeCODLocation("lang_" + data)} applyFilter={() => this.applyFilter()} />
                        }
                    </div>
                    <span className="clear" />
                </div>
                <div className="column column_12_12">
                    {state.totalCount != null && state.totalCount != 0 ?
                        <Pagination displayPageCount={state.displayPerPage} currentPage={state.pageNumber} totalPage={state.totalCount} action={pageNumber => {
                            this.setState({ pageNumber: pageNumber }, () => this.nextOrPrev())
                        }} />
                        : void 0}
                    <div className="flex-container clear" style={{ justifyContent: 'center' }}>
                        {(() => {
                            if (state.activeTab === "cod-available" && !state.activeLanguage && state.genie_choice.length !== 0) {
                                return state.genie_choice.map((dynamicData, i) => (
                                    <ProductCard tags={dynamicData.tags} toggleModalUpsell={this.toggleModalUpsell} collection={niches} refetch={this.props.userData.refetch} session={this.props.userData.session} product_data={{ prodid: dynamicData.id, handle: dynamicData.handle, title: dynamicData.title, src: dynamicData.images[0].src, price: dynamicData.variants[0].price, cpp: dynamicData.variants[0].sku, days_ago: dynamicData.published_at }} key={dynamicData.id} />
                                ));
                            } else return null;
                        })()}
                    </div>
                    <div className="flex-container clear" style={{ justifyContent: 'center' }}>
                        {(() => {
                            if (state.noResult) {
                                return (
                                    <div className="center-vertical-parent" style={{ height: '85vh' }}>
                                        <div className="center-vertical">
                                            <img src="/assets/graphics/no-result.svg" style={{ height: '50vh' }} />
                                            <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! NO RESULT FOUND!</h4> <br />
                                            <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>
                                                It seems we can't find <u style={{ color: '#28c686', fontSize: '1em' }}>{state.filterText}</u> based on your filter
                                            </label>
                                        </div>
                                    </div>
                                );
                            } else if (state.isLoading) {
                                return (
                                    <div className="grid clear flex-container" style={{ justifyContent: 'center' }}>
                                        {/* for loading purpose */}
                                        {(() => {
                                            var x = [];
                                            for (var i = 0; i < state.displayPerPage; i++) {
                                                x.push(i + 1);
                                            }
                                            return x.map(i => {
                                                return <ProductCard loading={true} refetch={this.props.userData.refetch} session={this.props.userData.session} product_data={{ prodid: '00', handle: 'loading', title: 'Loading...', src: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif', price: '0.00', days_ago: new Date() }} key={i} />
                                            })
                                        })()}
                                    </div>
                                );
                            } else if (state.data.length == 0) {
                                return (
                                    <div className="center-vertical-parent" style={{ height: '80vh' }}>
                                        <div className="center-vertical">
                                            <img src="/assets/graphics/no-result.svg" style={{ height: '50vh' }} />
                                            <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! NO RESULT FOUND!</h4>
                                        </div>
                                    </div>
                                );
                            } else {
                                return state.data.map((dynamicData, i) => (
                                    <ProductCard tags={dynamicData.tags} toggleModalUpsell={this.toggleModalUpsell} collection={niches} refetch={this.props.userData.refetch} session={this.props.userData.session} product_data={{ prodid: dynamicData.id, handle: dynamicData.handle, title: dynamicData.title, src: dynamicData.images[0].src, price: dynamicData.variants[0].price, cpp: dynamicData.variants[0].sku, days_ago: dynamicData.published_at }} key={dynamicData.id} />
                                ));
                            }
                        })()}
                    </div>
                    {/* TODO :: niches COD Type Product Lists */}
                    {!state.noResult && !state.isLoading && state.data.length != 0 && niches == "cod" ?
                        <div className="text-center product-card">
                            {state.isMoreNoResult ?
                                <label className="cursor-pointer display-inline" style={{ fontSize: '1.1em', justifyContent: 'center', padding: 15 }}>
                                    No more product to show
                                </label>
                                :
                                <label className="cursor-pointer display-inline" onClick={() => this.getMOreFilteredCOD()} style={{ fontSize: '1.1em', justifyContent: 'center' }}>
                                    Load More
                                    {state.isMoreLoading ?
                                        <Loading width={50} height={50} />
                                        :
                                        <span className="fas fa-angle-down color-green" style={{ margin: 17 }} />
                                    }
                                </label>
                            }
                        </div>
                        : void 0}
                    {state.totalCount != null && state.totalCount != 0 ?
                        <Pagination displayPageCount={state.displayPerPage} currentPage={state.pageNumber} totalPage={state.totalCount} action={pageNumber => {
                            this.setState({ pageNumber: pageNumber }, () => this.nextOrPrev());
                        }} />
                        : void 0}
                </div>
                {
                    currentUser && !currentUser.tos ?
                        <Modal open={!currentUser.tos} closeModal={() => { Cookies.remove('token'); window.location.href = '/signin'; }} session={this.props.userData.session}>
                            <div className="form_buttons" style={{ ineHeight: 1.5, maxWidth: 1100 }}>
                                <style dangerouslySetInnerHTML={{
                                    __html: `
                            .popup-content {
                                position: relative;
                                background: rgb(255, 255, 255);
                                max-width: 50%;
                                margin: auto;
                                border: 1px solid rgb(187, 187, 187);
                                padding: 5px;
                            }
                            .content {
                                display: flex;
                                justify-content: center;
                            }
                            `}} />
                                <h1 className="text-center" style={{ textTransform: 'uppercase', color: '#24bb7f', marginTop: 10 }}> Thank You </h1>
                                <hr style={{ maxWidth: 700, height: 2, backgroundImage: 'linear-gradient(to right, #ffffff, #cae8dc, #3ebd8a, #27c686, #3ebd8a, #cae8dc, #ffffff)', border: 0 }} />
                                <h3 className="text-center" style={{ color: '#FF9800' }}>Your account has been successfully activated!</h3>
                                <p>Thanks for choosing Product List Genie. Please read the following carefully.</p>
                                <ol className="newgreetings" style={{ listStyle: 'decimal', lineHeight: 1.2 }}>
                                    <li>You are in complete control of your membership. This means that you can manage your membership anytime by clicking “Manage Subscription” in the menu.</li>
                                    <li>We do NOT save or store, or have access to your payment information. Rest assured that we promise to NEVER charge you for our services without your authorization.</li>
                                    <li>This is a monthly subscription based service, this means that you will be charged each month depending on what type of subscription you chose. It is your responsibility to be aware of your billing cycles and to have enough funds in your payment instrument to avoid any service interruptions.</li>
                                    <li>We strongly recommend you use Product List Genie as a base for your campaigns, this means that you are encouraged to expand on top of what Product List Genie provides you.</li>
                                    <li>We require you to join our Facebook group and community for daily trainings, you will see what separates Product List Genie from the competition. You will not find this type of support elsewhere.</li>
                                    <li>We make every effort to avoid patent or copyright infringements with all products featured in Product List Genie. However, it is almost impossible to know with 100% certainty what products are protected. We encourage you to do your due diligence and always check on the Internet if a specific product has a patent pending or copyright.</li>
                                    <li>We are not liable and responsable for any marketing infringement or account banning that can happen to you by using Product List Genie and its services e.g Ad account being shut disabled. It is your responsibility to make sure your practices are complaint.</li>
                                    <li>I am aware that if I have any billing problems I can peacefully settle it with Product List Genie’s 24/7 billing support. I understand that I’m protected by Product List Genie 30 day money back guarantee, and I promise to never place a chargeback on the company by all means.</li>
                                </ol>
                                <p className="text-center" style={{ marginBottom: 60 }}>
                                    <strong>Let’s get your wishes granted now, click below to get started!</strong>
                                </p>
                                <br />
                                <div className="text-center" style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', backgroundColor: '#f4f9fd', padding: 20 }}>
                                    <button className="btn" style={{ padding: 10, backgroundColor: 'red', borderRadius: 5, border: '1px solid red' }} onClick={() => {
                                        Cookies.remove('token');
                                        window.location.href = '/signin';
                                    }}>Decline</button>
                                &nbsp; &nbsp;
                                <Mutation mutation={ACCEPT_TOS} variables={{ id: currentUser.id }}>
                                        {(acceptTOS, { data, loading, error }) => {
                                            return <button className="btn" style={{ padding: 10, borderRadius: 5 }} onClick={() => this.acceptTOS(acceptTOS)}>I Agree</button>;
                                        }}
                                    </Mutation>
                                </div>
                            </div>
                        </Modal>
                        : void 0
                }
                {
                    this.state.openUpsell &&
                    <UpsellAlert open={this.state.openUpsell} closeModal={this.toggleModalUpsell} session={this.props.userData.session} />
                }
                {/* TODO :: CHANGE TO COMING SOON */}
                {state.createModal &&
                    <Modal open={state.createModal} closeModal={() => this.toggleCreateModal()} session={this.props.session} style={{ width: '60%', borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0 }}>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            let formBody = {
                                fullname_form: state.fullname_form ? state.fullname_form : currentUser.firstName + ' ' + currentUser.lastName,
                                email_form: state.email_form ? state.email_form : currentUser.email,
                                phone_form: state.phone_form ? state.phone_form : currentUser.phone ? currentUser.phone : "0",
                                prodURL_form: state.prodURL_form,
                                minimumQty_form: state.minimumQty_form,
                                sprequest_form: state.sprequest_form,
                                select_country: state.select_country,
                                sourcing_standard: state.sourcing_standard,
                                isProdTestedopt: state.isProdTestedopt,
                            };

                            const formReset = e.target;

                            points.customFetch(points.clientUrl + '/v1/api/sendRequestQoute', "POST", formBody, result => {
                                toastr.options.timeOut = 3000;
                                toastr.success("Requested qoute was sent please wait for the email.", "Send Qoute Request");
                                formReset.reset();
                                this.toggleCreateModal();
                            })
                        }}>
                            <div className="column_12_12">
                                <style dangerouslySetInnerHTML={{ __html: `.popup-content .content { padding: 0px; }` }} />
                                <div className="clear" style={{ padding: 20, backgroundColor: '#f2f9f6', overflow: 'hidden' }}>
                                    <h4 className="header">Sell Anything You Want</h4>
                                </div>
                                <br></br>
                                <div className="center-vertical-parent" style={{ marginBottom: "5rem" }}>
                                    <div className="column column_12_12">
                                        <div className="page-container">
                                            <h1 style={{
                                                fontWeight: "bold",
                                                textAlign: "center"
                                            }}>Sourcing Request</h1>
                                            <h4 style={{
                                                textAlign: "center"
                                            }}>Please fill the form bellow with product informations.</h4>
                                        </div>
                                    </div>
                                    <div className="column column_12_12" style={{
                                        padding: "0px 9%"
                                    }}>
                                        <div className="form_input">
                                            <label>Full Name </label>
                                            <input type="text" name="fullname_form" onChange={event => this.handleOnChange("fullname_form", event)} defaultValue={currentUser.firstName + ' ' + currentUser.lastName} required />
                                            <span className="bottom_border"></span>
                                        </div>
                                        <br />
                                        <div className="form_input">
                                            <label>Email </label>
                                            <input type="text" name="email_form" onChange={event => this.handleOnChange("email_form", event)} defaultValue={currentUser.email} required />
                                            <span className="bottom_border"></span>
                                        </div>
                                        <br />
                                        <div className="form_input">
                                            <label>Phone Number </label>
                                            <input type="text" name="phone_form" onChange={event => this.handleOnChange("phone_form", event)} defaultValue={currentUser.phone ? currentUser.phone : "0"} required />
                                            <span className="bottom_border"></span>
                                        </div>
                                        <br />
                                        <div className="form_input">
                                            <label>Product URL or Image </label>
                                            <input type="text" name="prodURL_form" onChange={event => this.handleOnChange("prodURL_form", event)} required />
                                            <span className="bottom_border"></span>
                                        </div>
                                        <br />
                                        <div className="form_input">
                                            <label>The minimum Quantity is 100 pcs. </label>
                                            <input type="number" min={100} name="minimumQty_form" onChange={event => this.handleOnChange("minimumQty_form", event)} required />
                                            <span className="bottom_border"></span>
                                        </div>
                                        <br />
                                        <div className="form_input">
                                            <textarea rows="8" placeholder="Special Request *" onChange={event => this.handleOnChange("sprequest_form", event)} className="stretch-width" name="sprequest_form" required ></textarea>
                                            <span className="bottom_border"></span>
                                        </div>
                                        <br />
                                        <div className="form_input">
                                            <label>Select Country </label>
                                            {(() => {
                                                var floc = [<option value="ALL" key={0}>All</option>];
                                                const available_country = points.cod_available_country("no_country");
                                                available_country.forEach((country, key) => {
                                                    floc.push(<option value={country.iso2} key={key + 1}>{country.name}</option>)
                                                })
                                                return <SelectTag className="stretch-width" name="select_country" value={state.select_country} options={floc} onChange={event => this.setState({ select_country: event.target.value, currentPage: 1 })} style={{ width: '100%', margin: '0 5px' }} />;
                                            })()}
                                            <span className="bottom_border"></span>
                                        </div>
                                        <br />
                                        <div className="form_input">
                                            <label>Would you like to check if this product is available for Saudi Arabia? <br />
                                                {/* <small>( Sourcing standard quotes are always for UAE and Oman )</small> */}
                                            </label>
                                            {(() => {
                                                const floc = [];
                                                [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }].forEach((opt, key) => {
                                                    floc.push(<option value={opt.value} key={key + 1}>{opt.label}</option>)
                                                })
                                                return <SelectTag className="stretch-width" name="sourcing_standard" value={state.sourcing_standard} options={floc} onChange={event => this.setState({ sourcing_standard: event.target.value })} style={{ width: '100%', margin: '0 5px' }} />;
                                            })()}
                                            <span className="bottom_border"></span>
                                        </div>
                                        <br />
                                        <div className="form_input">
                                            <label>Did You have tested the product?</label>
                                            {(() => {
                                                const floc = [];
                                                [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }].forEach((opt, key) => {
                                                    floc.push(<option value={opt.value} key={key + 1}>{opt.label}</option>)
                                                })
                                                return <SelectTag className="stretch-width" name="isProdTested" value={state.isProdTestedopt} options={floc} onChange={event => this.setState({ isProdTestedopt: event.target.value })} style={{ width: '100%', margin: '0 5px' }} />;
                                            })()}
                                            <span className="bottom_border"></span>
                                        </div>
                                        <br />
                                        <button type="submit" className="font-roboto-light btn-success stretch-width">Request a Qoute</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Modal>
                }
            </div >
        );
    }
}

export default FetchProducts;