import React from 'react';
import ReactDOM from 'react-dom';
import ProductCard from '../components/productCard';
import withAuth from '../hoc/withAuth';
import toastr from 'toastr';
import UpsellAlert from '../components/ModalComponent/upsellAlert';
import SearchFilter from '../components/SearchFilter';
const condition = require('../../Global_Conditions');
const points = require('../../Global_Values');
var ShortId = require('id-shorter');
var mongoDBId = ShortId({ isFullId: true });

class SearchProducts extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchData: [],
            search: '',
            openUpsell: false,
            filterDate: '',
            filterDateNow: '',
            filterTags: '',
            excludeTags: ''
        }
        this.toggleModalUpsell = this.toggleModalUpsell.bind(this);
        this.dateOnChange = this.dateOnChange.bind(this);
        this.tagsOnChange = this.tagsOnChange.bind(this);
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
        this.getPrivateTag();
    }

    getPrivateTag(){
        let currentUser = this.props.session.getCurrentUser;
        let has_arabic_funnel_access = condition.has_arabic_funnel(currentUser);
        let cod_available_country = points.cod_available_country("no_country");
        let excluded = has_arabic_funnel_access ? "" : "-cod_arabicfunnel, ";
        cod_available_country.forEach(e => {
            if(!currentUser.access_tags.includes(e.name.toLowerCase()) && e.iso2 != "AE" && e.iso2 != "SA") {
                excluded += "-lang_"+e.iso2.toLowerCase()+", ";
            }
        });
        cod_available_country.forEach(e => {
            if(!currentUser.access_tags.includes(e.name.toLowerCase()) && e.iso3 != "ARE" && e.iso3 != "SAU") {
                excluded += "-lang_"+e.iso3.toLowerCase()+", ";
            }
        });
        this.setState({ excludeTags: excluded.substring(0, excluded.length-2) });
    }

    searchProducts(){
        toastr.clear();
        toastr.info('Please wait...','Granting Your Wish');
        this.setState({ searchData: []}, () => {
            var searchObj = {
                title: this.state.search,
                searchDate: this.state.filterDate,
                dateNow: this.state.filterDateNow,
                tags: this.state.filterTags,
                excludeTags: this.state.excludeTags
            }
            fetch(points.clientUrl+'/api/search-products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchObj)
            })
            .then(response => response.json())
            .then(response => {
                var convertPayload = response.data.products.edges.map(el => {return { id: el.node.id, tags: el.node.tags }});
                this.setState({ searchData: response }, () => points.displayPLGInventoryOnShopifyProduct(convertPayload, mongoDBId));
                toastr.clear();
            });
        })
    }

    handleChange(event){
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [name]:value
        })
    }

    handleKeyUp(event){
        if(event.keyCode === 13){
            this.searchProducts();
        }
    }

    // onChange of date range
    dateOnChange(val){
        var pastDate = "";
        var dateNow = ""
        if(val){
            pastDate = points.getPastDate((parseInt(val)+2));
            pastDate = pastDate.getUTCFullYear()+"-"+(pastDate.getMonth()+1)+"-"+pastDate.getDate();
            dateNow = new Date();
            dateNow = dateNow.getUTCFullYear()+"-"+(dateNow.getMonth()+1)+"-"+dateNow.getDate();
        }
        this.setState({
            filterDate: pastDate,
            filterDateNow: dateNow
        })
    }

    // onChange of tags
    tagsOnChange(val){
        this.setState({
            filterTags: val
        })
    }

    // toggle modal upsell
    toggleModalUpsell(){
        this.setState({openUpsell: !this.state.openUpsell})
    }

    render() {
        return (
            <div className="page-container">
                <div className="form_wrap">
                    <div className="text-center">
                        <h1>Search Product</h1>
                    </div>
                    <div className="form_row">
                        <SearchFilter tagsOnChange={this.tagsOnChange} dateOnChange={this.dateOnChange} session={this.props.session} refetch={this.props.refetch}/>
                        <div className="column column_10_12">
                            <div className="form_item">
                                <div className="form_input">
                                    <input type="text" placeholder="Search Product List Genie product here" name="search" value={this.state.search} onKeyUp={this.handleKeyUp.bind(this)} onChange={this.handleChange.bind(this)} />
                                    <span className="bottom_border"></span>
                                </div> <br/>
                            </div>
                        </div>
                        <div className="column column_2_12">
                            <div className="form_buttons">
                                <button className="btn stretch-width" onClick={this.searchProducts.bind(this)}>Search</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid clear">
                    {this.state.openUpsell && 
                        <UpsellAlert open={this.state.openUpsell} closeModal={this.toggleModalUpsell} session={this.props.session} />
                    }
                    {(() => {
                        if(this.state.searchData.length != 0){
                            if(this.state.searchData.data.products.edges.length == 0){
                                return (
                                    <div className="text-center">
                                        <br/><br/><br/><br/><br/><br/>
                                        <h3>No Result Found.<br/>Try different search combination.</h3>
                                    </div>
                                );
                            } else {
                                return this.state.searchData.data.products.edges.map(data => {
                                    if(!data.node.tags.includes("mystery")){
                                        return <ProductCard tags={data.node.tags} toggleModalUpsell={this.toggleModalUpsell} refetch={this.props.refetch} session={this.props.session} product_data={{prodid: data.node.id,handle:data.node.handle,title:data.node.title,src:data.node.images.edges[0].node.originalSrc,price:data.node.variants.edges[0].node.price,days_ago:data.node.publishedAt}} key={data.node.id} />
                                    }
                                });
                            }
                        } else {
                            return (
                                <div className="text-center">
                                    <br/><br/><br/><br/><br/><br/>
                                    <h3>Search Result will appear here</h3>
                                </div>
                            );
                        }
                    })()}
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(SearchProducts);