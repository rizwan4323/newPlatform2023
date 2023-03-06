import React from 'react';
import withAuth from './../hoc/withAuth';
import ProductCard from '../components/productCard';
import { Helmet } from 'react-helmet';

class ProductDetails extends React.Component {
    constructor(props) {
        super(props);
    }
    
    head() {
        return (
            <Helmet>
                <title>My Favorite - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        return (
            <div className="grid page-container">
                {this.head()}
                <div className="text-center">
                    <h1>My Favorites</h1>
                </div>
                {(() => {
                    if (this.props.session.getCurrentUser.favorites.length == 0) {
                        return (
                            <div className="text-center">
                                <br />
                                <h3>No Favorites yet</h3>
                            </div>
                        );
                    }
                })()}
                {this.props.session.getCurrentUser.favorites.slice(0).reverse().map((fav, i) => {
                    return <ProductCard tags={""} refetch={this.props.refetch} session={this.props.session} product_data={{prodid: fav.prodid,handle:fav.handle,title:fav.title,src:fav.src,price:fav.price,isFromFavorite:true}} key={i} />
                })}
            </div>
        );
    }
}


export default withAuth(session => session && session.getCurrentUser)(ProductDetails);