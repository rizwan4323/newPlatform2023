import React, { Fragment } from 'react';
import withAuth from '../hoc/withAuth';

class ListEcomStore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listEcomData: [
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/t/5/assets/list-3dcart.png',
                    downloadLink: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ecom-3D-Cart-AllData.zip',
                    downloadLinkLabel: '3D CART'
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/t/5/assets/list-woocommerce-logo.png',
                    downloadLink: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ecom-All-Woocommerce-Stores-Data.zip',
                    downloadLinkLabel: 'WOOCOMMERCE'
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/t/5/assets/list-shopify.png',
                    downloadLink: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ecom-All-Shopify-Stores-Data.zip',
                    downloadLinkLabel: 'SHOPIFY'
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/t/5/assets/list-big-cartel.png',
                    downloadLink: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ecom-Big-Cartel-AllData.zip',
                    downloadLinkLabel: 'BIG CARTEL'
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/t/5/assets/list-big-commerce.png',
                    downloadLink: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ecom-Bigcommerce-AllData.zip',
                    downloadLinkLabel: 'BIG COMMERCE'
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/t/5/assets/list-ecwid.png',
                    downloadLink: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ecom-Ecwid-AllData.zip',
                    downloadLinkLabel: 'ECWID'
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/t/5/assets/list-epages.png',
                    downloadLink: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ecom-ePages-AllData.zip',
                    downloadLinkLabel: 'EPAGES'
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/t/5/assets/list-magento.png',
                    downloadLink: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ecom-Magento-AllData.zip',
                    downloadLinkLabel: 'MAGNETO'
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/t/5/assets/list-prestashop.png',
                    downloadLink: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ecom-Prestashop-AllData.zip',
                    downloadLinkLabel: 'PRESTASHOP'
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/t/5/assets/list-square-space.png',
                    downloadLink: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ecom-Square-Space-AllData.zip',
                    downloadLinkLabel: 'SQUARE SPACE'
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/t/5/assets/list-ubercart.png',
                    downloadLink: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ecom-Ubercart-AllData.zip',
                    downloadLinkLabel: 'UBERCART'
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/t/5/assets/list-virtue-mart.png',
                    downloadLink: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ecom-VirtueMart-AllData.zip',
                    downloadLinkLabel: 'VIRTUEMART'
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/t/5/assets/list-volusion.png',
                    downloadLink: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ecom-Volusion-AllData.zip',
                    downloadLinkLabel: 'VOLUSION'
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/t/5/assets/list-weebly.png',
                    downloadLink: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ecom-Weebly-Ecommerce-AllData.zip',
                    downloadLinkLabel: 'WEEBLY ECOMMERCE'
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/t/5/assets/list-wix.png',
                    downloadLink: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ecom-Wix-Stores-AllData.zip',
                    downloadLinkLabel: 'WIX STORES'
                }
            ]
        }
    }

    componentDidMount(){
        
    }

    render() {
        return (
            <Fragment>
                <div className="grid">
                    <h1></h1>
                    <div className="text-center">
                        <h1>LIST OF ECOMMERCE STORES</h1>
                    </div>
                    {this.state.listEcomData.map((data,i) => {
                        return (
                            <div className="column column_3_12" key={i}>
                                <div className="product-card">
                                    <div className="product-details form_buttons text-center">
                                        <img src={data.imgSrc} />
                                        <a href={data.downloadLink} className="btn stretch-width" placeholder={"Download All Data of "+data.downloadLinkLabel}>{data.downloadLinkLabel}</a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Fragment>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(ListEcomStore);