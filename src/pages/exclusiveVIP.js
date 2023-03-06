import React from 'react';
import withAuth from './../hoc/withAuth';
import toastr from 'toastr';
import { Helmet } from 'react-helmet';
import ProductCard from '../components/productCard';
const points = require('../../Global_Values');

class ExclusiveVIP extends React.Component {
    constructor() {
        super();
        this.state = {
            displayPerPage: 60,
            data: [],
            lastCursor: "",
            isMoreLoading: false,
            isMoreNoResult: false
        }
    }

    componentDidMount() {
        toastr.options = points.toastrInitialize(toastr);
        
        this.loadProducts();
    }

    loadProducts(){
        toastr.info('Please wait...', 'Getting Exclusive VIP Products');
        const state = this.state, tags = "xvip", private_tags = points.getShopifyPrivateTag(this.props.session.getCurrentUser), link = points.getAPILinkForShipifyProduct(tags, state.lastCursor, private_tags, state.displayPerPage);
        this.setState({ isMoreLoading: true }, () => {
            points.fetchGET(link, result => {
                if(result.status == 200) {
                    toastr.clear();
                    const data = this.state.data;
                    data.push(...result.data);
                    if (result.data.length == 0 || (result.data.length - 1) < state.displayPerPage) {
                        this.setState({ isMoreLoading: false, isMoreNoResult: true });
                    } else {
                        this.setState({ data, isMoreLoading: false, lastCursor: result.data[result.data.length - 1].cursor });
                    }
                } else {
                    toastr.clear();
                    points.toastrPrompt(toastr, "warning", "Please try again.");
                }
            });
        });
    }

    head() {
        return (
            <Helmet>
                <title>Exclusive VIP - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        let state = this.state;
        return (
            <div className="funnel">
                {this.head()}
                <div className="newPageHeader">
                    <span className="hide-in-desktop float-left" style={{ padding: 15 }} />
                    <div className="column column_12_12">
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>Exclusive VIP</h4>
                    </div>
                    <span className="clear" />
                </div>
                <div className="page-container">
                    <div className="flex-container display-inline" style={{ justifyContent: 'center' }}>
                        {(() => {
                            if (state.isMoreLoading) {
                                let x = [];
                                for (let i = 0; i < state.displayPerPage; i++) x.push(i + 1);
                                return x.map(i => {
                                    return <ProductCard loading={true} refetch={this.props.refetch} session={this.props.session} product_data={{ prodid: '00', handle: 'loading', title: 'Loading...', src: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif', price: '0.00', days_ago: new Date() }} key={i} />;
                                })
                            } else if(state.data.length == 0) {
                                return (
                                    <div className="center-vertical-parent" style={{ height: '80vh' }}>
                                        <div className="center-vertical">
                                            <img src="/assets/graphics/no-result.svg" style={{ height: '50vh' }} />
                                            <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! NO PRODUCT FOUND!</h4>
                                        </div>
                                    </div>
                                );
                            } else {
                                return state.data.map(dynamicData => {
                                    return <ProductCard tags={dynamicData.tags} toggleModalUpsell={this.toggleModalUpsell} refetch={this.props.refetch} session={this.props.session} product_data={{ prodid: dynamicData.id, handle: dynamicData.handle, title: dynamicData.title, src: dynamicData.images[0].src, price: dynamicData.variants[0].price, cpp: dynamicData.variants[0].sku, days_ago: dynamicData.published_at }} key={dynamicData.id} />;
                                });
                            }
                        })()}
                    </div>
                    {!state.isMoreLoading && state.data.length != 0 ?
                        <div className="text-center product-card clear">
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
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(ExclusiveVIP);