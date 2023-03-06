import React from 'react';
import { Link } from 'react-router-dom';
import { ADD_FAVORITE, REMOVE_FAVORITE } from '../queries';
import { Mutation } from 'react-apollo';
import toastr from 'toastr';
import moment from 'moment';
import GenieRating from '../components/genieRating';
import GenieStrength from '../components/genieStrength';
// import LikeButton from '../components/likeBtn';
const condition = require('../../Global_Conditions');
const points = require('../../Global_Values')

class ProductCard extends React.Component {
    componentDidMount(){
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut":1000,
            "extendedTimeOut":3000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    }

    addFavorite(addFavorite) {
        if(!this.props.loading){
            addFavorite().then(async ({ data }) => {
                toastr.clear();
                toastr.success('Added as favorite!', 'Saved!');
                this.props.refetch();
            }).catch(error => {
                console.log(error)
                this.setState({
                    error: error.graphQLErrors.map(x => x.message)
                })
                console.error("ERR =>", error.graphQLErrors.map(x => x.message));
            });
        }
    }
    removeFavorite(removeFavorite) {
        if(!this.props.loading){
            removeFavorite().then(async ({ data }) => {
                toastr.clear();
                toastr.warning('Favorite Removed!', 'Remove!');
                this.props.refetch();
            }).catch(error => {
                console.log(error)
                this.setState({
                    error: error.graphQLErrors.map(x => x.message)
                })
                console.error("ERR =>", error.graphQLErrors.map(x => x.message));
            });
        }
    }

    isAlreadyFavorite(id) {
        var isFavorite = false;
        this.props.session.getCurrentUser.favorites.map(fav => {
            if (fav.prodid === id.toString()) {
                isFavorite = true;
            }
        })
        return isFavorite;
    }

    // check if user is level 1 and product tag is hot_product and of course if its not loading
    checkHotProductsView(event){
        if(!this.props.loading){
            if(this.props.tags.toString().includes('hot_product')){
                if (this.props.session.getCurrentUser.privilege == 0) { // User Privilege
                    if(event){
                        event.preventDefault();
                        console.log("User No Access");
                        this.props.toggleModalUpsell();
                    }
                    return true;
                } else if(this.props.session.getCurrentUser.privilege == 1){ // User Privilege
                    if(this.props.session.getCurrentUser.count_hotProducts >= points.limit_hotProducts){
                        if(event){
                            event.preventDefault();
                            console.log("User Limit Reach");
                            this.props.toggleModalUpsell();
                        }
                        return true;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    hasArabicFunnel() {
        if (this.props.tags && this.props.tags.includes("cod_arabicfunnel")) return condition.has_arabic_funnel(this.props.session.getCurrentUser);
        else if (this.props.tags && this.props.tags.includes("xvip")) return condition.is_exclusive_vip_user(this.props.session.getCurrentUser);
        else return true;
    }

    render() {
        var str = "";
        var rating = "";
        var className = "";
        var hasArabicFunnel = this.hasArabicFunnel();
        if(this.props.tags){
            this.props.tags.forEach(el => {
                if(el.includes("ms_")){
                    str = el.replace("ms_","");
                }
                if(el.includes("gr_")){
                    rating = el.replace("gr_","");
                }
            });
        }
        if(this.props.tags){
            if(this.props.tags.includes("lang_es")) className = "lang-sm-es";
            else if(this.props.tags.includes("lang_ph")) className = "lang-sm-ph";
            else if(this.props.tags.includes("lang_uae")) className = "lang-sm-uae";
            else if(this.props.tags.includes("lang_in")) className = "lang-sm-ind";
            else if(this.props.tags.includes("lang_KSA")) className = "lang-sm-ksa";

            else if(this.props.tags.includes("lang_bh")) className = "lang-sm-bh";
            else if(this.props.tags.includes("lang_eg")) className = "lang-sm-eg";
            else if(this.props.tags.includes("lang_kw")) className = "lang-sm-kw";
            else if(this.props.tags.includes("lang_qa")) className = "lang-sm-qa";
            else if(this.props.tags.includes("lang_om")) className = "lang-sm-om";
        }
        return (
            <div className="column column_2_12" style={{ minWidth: 230, margin: 0, filter: !hasArabicFunnel ? 'blur(0px)' : 'blur(0px)' }}>
                {!hasArabicFunnel && <div className="cursor-pointer" onClick={() => window.open('https://themm.kartra.com/page/YIw155')} style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 100 }} />}
                <div className="product-card">
                    {/* {this.props.collection == "winners" ? <div className="badge">Hot</div> : ''} */}
                    <Link to={!this.checkHotProductsView() ? '/product-details/' + this.props.product_data.handle : '#'} onClick={this.checkHotProductsView.bind(this)}>
                        <div className="funnel product-tumb product-card-thumb" style={{backgroundImage: "url(" +  this.props.product_data.src  + ")", borderRadius: '5px 5px 0 0', position: 'relative', overflow: 'hidden'}}>
                            {(() => {
                                if (this.props.tags) {
                                    if (this.props.tags.includes("genie_choice")) {
                                        return <span className="font-roboto-light color-white" style={{ position: 'absolute', top: 30, right: 0, padding: '5px 10px 5px 16px', backgroundColor: '#093035', clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 10% 100%)' }}>Genie's <i className="color-orange">Choice</i></span>;
                                    } else if (this.props.tags.includes("new_brand")) {
                                        return <span className="new_brand" style={{ width: 45, height: 45, position: 'absolute', top: 5, right: 5 }} />
                                    } else return null;
                                } else return null;
                            })()}
                            {(() => {
                                if (this.props.tags) {
                                    if (this.props.tags.includes("push_to_funnel")) {
                                        if (this.props.tags.includes("cod_test")) {
                                            return <label className="font-roboto-light" style={{ backgroundColor: '#ff8000', color: '#fff', position: 'absolute', top: 22, left: -65, transform: 'rotate(-43deg)', width: 200, textAlign: 'center', fontSize: '0.875em' }}>FOR TESTING</label>;
                                        } else if (this.props.tags.includes("new_stocks")) {
                                            return <label className="font-roboto-light" style={{ backgroundColor: '#1ac594', color: '#fff', position: 'absolute', top: 8, left: -70, transform: 'rotate(-43deg)', width: 200, textAlign: 'center', fontSize: '0.875em', fontWeight: 700, padding: 5, lineHeight: 1.4 }}>STOCK<br />AVAILABLE</label>;
                                        } else {
                                            return null;
                                            return <label className="font-roboto-light" style={{ backgroundColor: '#ff8000', color: '#fff', position: 'absolute', top: 23, left: -40, transform: 'rotate(-43deg)', width: 150, textAlign: 'center', fontSize: '0.875em' }}>BRANDABLE</label>;
                                        }
                                    } else if (this.props.tags.includes("out_of_stock")) {
                                        var newStockArriveAt = this.props.tags.filter(el => el.includes("new_stock_"));
                                        var text = "OUT OF STOCK";
                                        if (newStockArriveAt.length != 0) {
                                            const newStockDate = newStockArriveAt[0].replace("new_stock_", "").replace(/_/g, " ").toUpperCase();
                                            text += "<br>UNTIL " + newStockDate
                                        }
                                        return <label className="font-roboto-light" style={{ backgroundColor: '#ff0000', color: '#fff', position: 'absolute', top: 25, left: -61, transform: 'rotate(-43deg)', width: 210, textAlign: 'center', fontSize: '0.875em', fontWeight: 700, padding: 5, lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: text }} />;
                                    } else return null;
                                } else return null;
                            })()}
                        </div>
                    </Link>
                    <div className="product-details product-card-details">
                        <Link to={!this.checkHotProductsView() ? '/product-details/' + this.props.product_data.handle : '#'} onClick={this.checkHotProductsView.bind(this)}>
                            <h4 className={className}>{this.props.product_data.title}</h4>
                        </Link>
                        {(() => {
                            return <div className="funnel" style={{display: 'flex', alignItems: 'center', borderTop: '1px solid #eeeeee', padding: '6px 0px'}} id={this.props.product_data.prodid}>&nbsp;</div>;
                            if(this.props.product_data.days_ago){
                                var daysAgo = moment(this.props.product_data.days_ago).startOf('second').fromNow();
                                var text = "Added "+daysAgo;
                                if(daysAgo.split(" ")[1].includes("day") || daysAgo.split(" ")[1].includes("month") || daysAgo.split(" ")[1].includes("years")) {
                                    var days = parseInt(daysAgo.split(" ")[0]);
                                    if(daysAgo == "a day ago") text = text;
                                    else if(daysAgo.split(" ")[1] == "days") text = days > 8 ? "&nbsp;" : text;
                                    else text = "&nbsp;";
                                }
                                return <div className="product_days_ago" style={{marginBottom: 10, lineHeight: 1.2}} dangerouslySetInnerHTML={{__html: text}} />
                            } else return null;
                        })()}
                        {/* Added new */}
                        <div className="funnel" style={{display: 'flex', alignItems: 'center', borderTop: '1px solid #eeeeee', padding: '6px 0px'}}>
                            <div className="column column_5_12 one-line-ellipsis" style={{padding: 0}}>
                                <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Rating</label>
                            </div>
                            <div className="column column_5_12 text-right" style={{padding: 0, height: 18}}>
                                {rating ? <GenieRating rating={rating} /> : <label className="font-questrial-light" style={{fontSize: '0.875em'}}>N/A</label>}
                            </div>
                            <div className="column column_2_12 text-right" style={{padding: 0}}>
                                <label className="font-questrial-light" style={{fontSize: '0.7em'}}>{rating ? rating : ''}</label>
                            </div>
                        </div>
                        <div className="funnel" style={{display: 'flex', alignItems: 'center', borderTop: '1px solid #eeeeee', padding: '6px 0px'}}>
                            <div className="column column_6_12 one-line-ellipsis" style={{padding: 0}}>
                                <label className="font-questrial-light" style={{fontSize: '0.875em'}}>Ad Strength</label>
                            </div>
                            <div className="column column_5_12 text-right" style={{padding: 0}}>
                                {str ? <GenieStrength strength={str} /> : <label className="font-questrial-light" style={{fontSize: '0.875em', height: 10}}>N/A</label>}
                            </div>
                            <div className="column column_1_12 text-right" style={{padding: 0}}>
                                <label className="font-questrial-light" style={{fontSize: '0.7em'}}>{str ? str+"%" : ''}</label>
                            </div>
                        </div>
                        {/* end new */}
                        <div className="clear product-bottom-details" style={{display: 'flex', alignItems: 'center'}}>
                            <div className="float-left one-line-ellipsis product-price" style={{width: '80%'}}>
                                <span title="Recommended Selling Price">Avg. Profit: ${this.props.product_data.cpp ? (parseFloat(this.props.product_data.price) - parseFloat(this.props.product_data.cpp)).toFixed(2) : this.props.product_data.price}</span>
                            </div>
                            <div className="text-right float-left" style={{width: '20%', }}>
                            {(() => {
                                if (!this.isAlreadyFavorite(this.props.product_data.prodid.toString())){
                                    return (
                                        <Mutation
                                            mutation={ADD_FAVORITE}
                                            variables={{ id: this.props.session.getCurrentUser.id, prodid: this.props.product_data.prodid.toString(), favorites: this.props.product_data.handle, title: this.props.product_data.title, src: this.props.product_data.src, price: this.props.product_data.price }}>
                                            {(addFavorite, { data, loading, error }) => {
                                                return <span className="far fa-heart" style={{cursor: 'pointer', WebkitTextFillColor: 'red'}} onClick={() => this.addFavorite(addFavorite)} />;
                                            }}
                                        </Mutation>
                                    );
                                } else {
                                    return (
                                        <Mutation
                                            mutation={REMOVE_FAVORITE}
                                            variables={{ id: this.props.session.getCurrentUser.id, prodid: this.props.product_data.prodid.toString() }}>
                                            {(removeFavorite, { data, loading, error }) => {
                                                if (this.props.product_data.isFromFavorite) {
                                                    return  <span className="fas fa-trash-alt" style={{cursor: 'pointer'}} onClick={() => this.removeFavorite(removeFavorite)} />
                                                } else {
                                                    return  <span className="fas fa-heart" style={{color: 'red', cursor: 'pointer'}} onClick={() => this.removeFavorite(removeFavorite)} />
                                                }
                                            }}
                                        </Mutation>
                                    );
                                }
                            })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductCard;