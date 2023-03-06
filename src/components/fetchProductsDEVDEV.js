import React from 'react';
import toastr from 'toastr';
import ProductCard from '../components/productCard';
import { Mutation } from 'react-apollo';
import Modal from './ModalComponent/';
import { ACCEPT_TOS } from './../queries';
import UpsellAlert from '../components/ModalComponent/upsellAlert';
import Pagination from '../components/pagination';
import ProductFilter from '../components/productFilter';
import * as Cookies from 'es-cookie';
var ShortId = require('id-shorter');
var mongoDBId = ShortId({ isFullId: true });
const condition = require('../../Global_Conditions');
const points = require('../../Global_Values');
const mustResetValue = {
    data: [],
    temp: [],
    isLoading: true,
    noResult: false,
    filterText: 'No Filter applied.',
    favorites: { prodid: null, handle: null, title: null, src: null, price: null },
    removeId: null,
    displayPerPage: 24,
    pageNumber: 1,
    openUpsell: false,
    totalCount: 0,
    activeLanguage: ""
}

// unused
class FetchProductsDEVDEV extends React.Component {
    constructor() {
        super();
        this.state = {
            ...mustResetValue,
            activePageProducts: "",
            activeAvailability: "stock",
        }
        this.toggleModalUpsell = this.toggleModalUpsell.bind(this)
        this.smoothscroll = this.smoothscroll.bind(this);
    }

    componentDidMount() {
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
        const loadDefault = this.props.userData.match.params.niches == "cod" ? "cod-available" : this.props.userData.match.params.niches;
        this.setState({ activePageProducts: this.props.userData.match.params.niches }, () => this.getProducts(loadDefault));
    }

    getProducts(collectionUrl){
        toastr.clear();
        toastr.info("Loading please wait...");
        fetch('https://productlistgenie.io/collections/' + collectionUrl + '/products.json?limit=' + this.state.displayPerPage + '&page=' + this.state.pageNumber)
        .then((Response) => Response.json())
        .then((findresponse) => {
            toastr.clear();
            this.getProductsCount(collectionUrl, findresponse.products);
        })
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.userData.match.params.niches !== this.props.userData.match.params.niches){
            this.setState({ ...mustResetValue }, () => {
                var collectionUrl = this.props.userData.match.params.niches;
                if(collectionUrl.includes('undefined')){
                    collectionUrl = "winners";
                } else if(collectionUrl == "cod") {
                    collectionUrl = "cod-available";
                }
                fetch('https://productlistgenie.io/collections/' + collectionUrl + '/products.json?limit=' + this.state.displayPerPage + '&page=' + this.state.pageNumber)
                .then((Response) => Response.json())
                .then((findresponse) => {
                    this.getProductsCount(collectionUrl, findresponse.products);
                })
            });
        }
    }

    getProductsCount(collectionUrl, data){
        fetch('https://productlistgenie.io/collections/'+collectionUrl+'.json')
        .then((result) => result.json())
        .then((result) => {
            points.customFetch('/api/get-collection-products-count/'+result.collection.id, 'GET', null, res => {
                this.setState({ data, isLoading: false, totalCount: res.count }, () => points.displayPLGInventoryOnShopifyProduct(data, mongoDBId));
            });
        })
    }

    paginate(next, event) {
        if (next) {
            this.setState({
                pageNumber: this.state.pageNumber + 1
            }, () => {
                this.nextOrPrev();
            });
        } else {
            if(this.state.pageNumber != 1){
                this.setState({
                    pageNumber: this.state.pageNumber - 1
                }, () => {
                    this.nextOrPrev();
                });
            }
        }
    }

    smoothscroll(){
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(this.smoothscroll);
            window.scrollTo (0,currentScroll - (currentScroll/5));
        }
    }

    nextOrPrev() {
        this.smoothscroll();
        this.setState({data: [], isLoading: true}, () => {
            var collectionUrl = this.props.userData.match.params.niches;
            if(this.state.activeLanguage == "es") collectionUrl = "brandable-spanish";
            else if(this.state.activeLanguage == "ph") collectionUrl = "cod-philippines";
            else if(this.state.activeLanguage == "uae") collectionUrl = "cod-united-arab-emirates";
            else if(this.state.activeLanguage == "ksa") collectionUrl = "ksa";
            else if(this.state.activeLanguage == "ind") collectionUrl = "ind";
            
            fetch('https://productlistgenie.io/collections/' + collectionUrl + '/products.json?limit=' + this.state.displayPerPage + '&page=' + this.state.pageNumber)
            .then((Response) => Response.json())
            .then((findresponse) => {
                this.setState({ data: findresponse.products, isLoading: false })
                this.props.userData.refetch();
            })
        })
    }

    // toggle modal upsell
    toggleModalUpsell(){
        this.setState({openUpsell: !this.state.openUpsell})
    }

    acceptTOS(acceptTOS){
        acceptTOS().then(async ({ data }) => {
            window.location.reload();
        }).catch(error => {
            console.error("acceptTOS ERR =>", error);
        });
    }

    removeFilter(){
        this.setState({ filterText: 'No Filter applied.', data: this.state.temp, isLoading: false });
    }

    applyFilter(){
        toastr.clear();
        toastr.info("Loading please wait...");
        var ratingMin = document.getElementById("rating-min").innerHTML, ratingMax = document.getElementById("rating-max").innerHTML, strMin = document.getElementById("str-min").innerHTML, strMax = document.getElementById("str-max").innerHTML;
        // check if empty all input
        if((!ratingMin || !ratingMax) && (!strMin || !strMax)){
            toastr.clear();
            toastr.warning("Please enter ratings or strength range.","Required.");
            return;
        }
        // check rating if valid
        if(parseFloat(ratingMin) > parseFloat(ratingMax)){
            toastr.clear();
            toastr.warning("Make sure minimum rating is less than maximum rating.","Rating Invalid Range.");
            return;
        }
        // check strength if valid
        if(parseInt(strMin) > parseInt(strMax)){
            toastr.clear();
            toastr.warning("Make sure minimum strength is less than maximum strength.","Strength Invalid Range.");
            return;
        }

        var rating = generateRatingFilter();
        var strength = generateStrengthFilter();
        var fullFilterString = "", filterText = "";
        if(rating){
            fullFilterString += rating;
            filterText += "Rating: "+ratingMin+"-"+ratingMax;
        }
        if(rating && strength){
            fullFilterString += " AND ";
            filterText += " and ";
        }
        if(strength){
            fullFilterString += strength;
            filterText += "Strength: "+strMin+"-"+strMax;
        }
        var payload = {filterQuery: fullFilterString};
        points.customFetch('/api/filter-products', 'POST', payload, result => {
            var refactor = [];
            result.data.products.edges.forEach(data => {
                refactor.push({
                    created_at: data.node.createdAt,
                    handle: data.node.handle,
                    id: parseInt(data.node.id.replace("gid://shopify/Product/","")),
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
        function generateRatingFilter(){
            var ratingmin = parseFloat(ratingMin), ratingmax = parseFloat(ratingMax);
            var ratingstr = "";
            var i = ratingmin;
            while(i <= ratingmax) {
                ratingstr += "gr_"+i.toFixed(1).replace(".0","")+" OR ";
                i += 0.1;
            }
            return ratingstr.substring(0, ratingstr.length-4);
        }
        function generateStrengthFilter(){
            var strmin = parseInt(strMin), strmax = parseInt(strMax);
            var strstr = "";
            var x = strmin;
            while(x <= strmax) {
                strstr += "ms_"+x+" OR ";
                x += 1;
            }
            return strstr.substring(0, strstr.length-4);
        }
    }

    activeLanguageCallback(lang, bn, a){
        const extra = {};
        if(!a) {
            extra.activePageProducts = bn;
        } else if(this.state.activeAvailability == a) {
            a = "";
            bn = this.state.activePageProducts;
        }
        this.setState({ activeLanguage: lang, activeAvailability: a, ...extra }, () => this.getProducts(bn));
    }

    getLabelName(niches){
        var loc = this.state.activeLanguage;
        function getShippingDays(){
            if(loc == "ph"){
                return " (Shipping 7 to 10 days)";
            } else if(loc == "uae"){
                return " (Shipping 3 to 4 days)";
            } else if(loc == "ksa"){
                return " (Shipping 3 to 5 days)";
            }
            return "";
        }
        if(niches == "winners"){
            return "Hot Products";
        } else if(niches == "cod"){
            return "Cash On Delivery"+getShippingDays();
        } else {
            return points.capitalizeWord(niches.replace(/-|_/g," "));
        }
    }

    comingSoon(country_name) {
        points.toastrPrompt(toastr, "success", country_name+" coming soon!");
    }

    render() {
        const currentUser = this.props.userData.session.getCurrentUser;
        if(this.state.noResult){
            return (
                <div className="center-vertical-parent" style={{height: '85vh'}}>
                    <div className="center-vertical">
                        <img src="/assets/graphics/no-result.svg" style={{height: '50vh'}} />
                        <h4 className="title" style={{fontSize: '2.5em'}}>OOPS! NO RESULT FOUND!</h4> <br/>
                        <label className="font-roboto-bold" style={{fontSize: '0.875em'}}>
                            It seems we can't find <u style={{color: '#28c686', fontSize: '1em'}}>{this.state.filterText}</u> based on your filter
                        </label>
                    </div>
                </div>
            );
        } else if(this.state.isLoading){
            return (
                <div>
                    <div className="grid clear flex-container" style={{justifyContent: 'center'}}>
                        {/* for loading purpose */}
                        {(() => {
                            var x = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24']
                            return x.map(i => {
                                return <ProductCard loading={true} refetch={this.props.userData.refetch} session={this.props.userData.session} product_data={{prodid: '00',handle:'loading',title:'Loading...',src:'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',price:'0.00',days_ago: new Date()}} key={i} />
                            })
                        })()}
                    </div>
                </div>
            );
        } else if(this.state.data.length == 0) {
            return (
                <div className="center-vertical-parent" style={{height: '80vh'}}>
                    <div className="center-vertical">
                        <img src="/assets/graphics/no-result.svg" style={{height: '50vh'}} />
                        <h4 className="title" style={{fontSize: '2.5em'}}>OOPS! NO RESULT FOUND!</h4>
                    </div>
                </div>
            );
        }
        const niches = this.props.userData.match.params.niches;
        const showLanguageFilter = niches == "brandable";
        return (
            <div className="funnel">
                <style dangerouslySetInnerHTML={{__html: ` body { background-image: none; background-color: #f4f9fd; } `}} />
                <div className="newPageHeader display-inline" style={{ padding: niches == "cod" ? '15px 10px' : '20px 10px' }}>
                    <span className="hide-in-desktop float-left" style={{padding: 15}} />
                    <div className="column column_6_12 row-separator">
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>{this.getLabelName(niches)}</h4>
                        {!niches == "cod" && <label style={{ color: '#878787' }}>{this.state.filterText} {this.state.filterText != "No Filter applied." ? <span className="fas fa-times" style={{marginLeft: 5, color: '#ff0100', cursor: 'pointer'}} onClick={() => this.removeFilter()} /> : void 0}</label>}
                        {(() => {
                            if(niches == "cod") {
                                const bnTesting = this.state.activeLanguage ? "for-testing-"+this.state.activeLanguage : "cod-for-testing";
                                const bnStock = this.state.activeLanguage ? "cod-available-"+this.state.activeLanguage : "cod-available";
                                const arabicFunnel = "arabic-funnels";
                                return (
                                    <div className="flex-container display-inline" style={{ justifyContent: 'flex-start', marginTop: 10 }}>
                                        <label>Availability: </label>
                                        <div className="flex-container lang-available" style={{ justifyContent: 'flex-start' }}>
                                            <label className={"cursor-pointer"+(this.state.activeAvailability == "stock" ? " lang-active" : "")} style={{ marginLeft: 5, padding: 5, border: '1px solid transparent', borderBottom: '1px solid #27c686' }} onClick={() => this.activeLanguageCallback(this.state.activeLanguage, bnStock, "stock")}>In Stock</label>
                                            <label className={"cursor-pointer"+(this.state.activeAvailability == "testing" ? " lang-active" : "")} style={{ marginLeft: 5, padding: 5, border: '1px solid transparent', borderBottom: '1px solid #27c686' }} onClick={() => this.activeLanguageCallback(this.state.activeLanguage, bnTesting, "testing")}>For Testing</label>
                                            <label className={"cursor-pointer"+(this.state.activeAvailability == "arabic" ? " lang-active" : "")} style={{ marginLeft: 5, padding: 5, border: '1px solid transparent', borderBottom: '1px solid #27c686' }} onClick={() => {
                                                let has_arabic_funnel_access = condition.has_arabic_funnel(currentUser);
                                                if (!has_arabic_funnel_access) window.open('https://themm.kartra.com/page/YIw155');
                                                else this.activeLanguageCallback(this.state.activeLanguage, arabicFunnel, "arabic");
                                            }}>Arabic Funnels</label>
                                        </div>
                                    </div>
                                );
                            } else return null;
                        })()}
                    </div>
                    <div className="column column_6_12 row-separator">
                        {niches == "cod" ?
                            <div className="flex-container display-inline" style={{ justifyContent: 'flex-end' }}>
                                <label>Location: </label>
                                <div className="flex-container lang-available" style={{ justifyContent: 'flex-start' }}>
                                    <span className={"lang-bh cursor-pointer" + (this.state.activeLanguage == "bh" ? " lang-active" : "")} onClick={() => {
                                        // User Privilege
                                        if(currentUser.privilege == 10 || currentUser.access_tags.includes("bahrain")) {
                                            points.toastrPrompt(toastr, "success", "Please wait Bahrain is still under development");
                                        } else this.comingSoon("Bahrain");
                                    }} style={{ padding: 3 }} />
                                    <span className={"lang-eg cursor-pointer" + (this.state.activeLanguage == "eg" ? " lang-active" : "")} onClick={() => {
                                        if(currentUser.access_tags.includes("egypt")) {
                                            points.toastrPrompt(toastr, "success", "Please wait Egypt is still under development");
                                        } else this.comingSoon("Egypt");
                                    }} style={{ padding: 3 }} />
                                    <span className={"lang-kw cursor-pointer" + (this.state.activeLanguage == "kw" ? " lang-active" : "")} onClick={() => {
                                        if(currentUser.access_tags.includes("kuwait")) {
                                            points.toastrPrompt(toastr, "success", "Please wait Kuwait is still under development");
                                        } else this.comingSoon("Kuwait");
                                    }} style={{ padding: 3 }} />
                                    <span className={"lang-qa cursor-pointer" + (this.state.activeLanguage == "qa" ? " lang-active" : "")} onClick={() => {
                                        if(currentUser.access_tags.includes("qatar")) {
                                            points.toastrPrompt(toastr, "success", "Please wait Qatar is still under development");
                                        } else this.comingSoon("Qatar");
                                    }} style={{ padding: 3 }} />
                                    <span className={"lang-ph cursor-pointer" + (this.state.activeLanguage == "ph" ? " lang-active" : "")} onClick={() => {
                                        if(currentUser.access_tags.includes("philippines")) {
                                            this.activeLanguageCallback("ph", "cod-philippines");
                                        } else this.comingSoon("Philippines");
                                    }} style={{ padding: 3 }} />
                                    <span className={"lang-ksa cursor-pointer" + (this.state.activeLanguage == "ksa" ? " lang-active" : "")} onClick={() => this.activeLanguageCallback("ksa", "ksa")} style={{ padding: 3 }} />
                                    <span className={"lang-uae cursor-pointer" + (this.state.activeLanguage == "uae" ? " lang-active" : "")} onClick={() => this.activeLanguageCallback("uae", "cod-united-arab-emirates")} style={{ padding: 3 }} />
                                </div>
                            </div>
                        :
                            <ProductFilter float="right" showLanguageFilter={showLanguageFilter} activeLanguage={this.state.activeLanguage} activeLanguageCallback={(data, bn) => this.activeLanguageCallback(data, bn)} applyFilter={() => this.applyFilter()} />
                        }
                    </div>
                    <span className="clear" />
                </div>
                {this.state.openUpsell && 
                    <UpsellAlert open={this.state.openUpsell} closeModal={this.toggleModalUpsell} session={this.props.userData.session} />
                }
                <div className="float-right clear" style={{margin: '10px 0 5px'}}>
                    <div className="form_buttons column column_12_12">
                        <Pagination displayPageCount={this.state.displayPerPage} pageNumber={this.state.pageNumber} totalPage={this.state.totalCount} action={pageNumber => {
                            this.setState({pageNumber: pageNumber}, () => this.nextOrPrev())
                        }} />
                    </div>
                </div>
                <div className="grid clear flex-container" style={{justifyContent: 'center'}}>
                    {this.state.data.map((dynamicData, i) => (
                        <ProductCard tags={dynamicData.tags} toggleModalUpsell={this.toggleModalUpsell} collection={niches} refetch={this.props.userData.refetch} session={this.props.userData.session} product_data={{prodid: dynamicData.id,handle:dynamicData.handle,title:dynamicData.title,src:dynamicData.images[0].src,price:dynamicData.variants[0].price,cpp:dynamicData.variants[0].sku,days_ago:dynamicData.published_at}} key={dynamicData.id} />
                    ))}
                </div>
                <div className="float-right clear" style={{margin: '10px 0 5px'}}>
                    <div className="form_buttons column column_12_12">
                        <Pagination displayPageCount={this.state.displayPerPage} pageNumber={this.state.pageNumber} totalPage={this.state.totalCount} action={pageNumber => {
                            this.setState({pageNumber: pageNumber}, () => this.nextOrPrev())
                        }} />
                    </div>
                </div>
                {currentUser && !currentUser.tos ?
                    <Modal open={!currentUser.tos} closeModal={() => {Cookies.remove('token'); window.location.href = '/signin'; }} session={this.props.userData.session}>
                        <div className="form_buttons" style={{ineHeight: 1.5, maxWidth: 1100}}>
                            <style dangerouslySetInnerHTML={{__html: `
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
                            <h1 className="text-center" style={{textTransform: 'uppercase', color: '#24bb7f', marginTop: 10}}> Thank You </h1>
                            <hr style={{maxWidth: 700, height: 2, backgroundImage: 'linear-gradient(to right, #ffffff, #cae8dc, #3ebd8a, #27c686, #3ebd8a, #cae8dc, #ffffff)', border: 0}} />
                            <h3 className="text-center" style={{color: '#FF9800'}}>Your account has been successfully activated!</h3>
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
                            <p className="text-center" style={{marginBottom: 60}}>
                                <strong>Let’s get your wishes granted now, click below to get started!</strong>
                            </p>
                            <br />
                            <div className="text-center" style={{position: 'absolute', left: 0, bottom: 0, width: '100%', backgroundColor: '#f4f9fd', padding: 20}}>
                                <button className="btn" style={{padding: 10, backgroundColor: 'red', borderRadius: 5, border: '1px solid red'}} onClick={() => {
                                    Cookies.remove('token');
                                    window.location.href = '/signin';
                                }}>Decline</button>
                                &nbsp; &nbsp;
                                <Mutation mutation={ACCEPT_TOS} variables={{ id: currentUser.id }}>
                                    {(acceptTOS, { data, loading, error }) => {
                                        return <button className="btn" style={{padding: 10, borderRadius: 5}} onClick={() => this.acceptTOS(acceptTOS)}>I Agree</button>;
                                    }}
                                </Mutation>
                            </div>
                        </div>
                    </Modal>
                : void 0}
            </div>
        );
    }
}
export default FetchProductsDEVDEV;