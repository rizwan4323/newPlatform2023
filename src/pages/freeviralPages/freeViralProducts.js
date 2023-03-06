import React from 'react';
import { Helmet } from 'react-helmet';
import toastr from 'toastr';
import Modal from './../../components/ModalComponent/';

// const points = require("../../../Global_Values");


const points = require('./../../../Global_Values');


export default class FreeViralProducts extends React.Component {
    constructor(props) {
        super();
        this.state = {
            limit: 0,
            offset: 0,
            data: [],
            createModal: false,
            calculator: false,
            prod_cost: 20,
            sell_price: 0,
            marginss: 10,
            computationRes: []
        }

        this.handleChange = this.handleChange.bind(this);
    }


    // ? Modal Video
    toggleCreateModal() {
        this.setState({ createModal: !this.state.createModal });
    }

    togggleCalculator() {
        this.setState({ calculator: !this.state.calculator });
    }

    // componentDidUpdate() {
    //     this.computeResult();
    // }

    componentDidMount() {
        var payload = {
            'query': `
             { shareProductToPlg(limit : ${this.state.limit} ) { 
                id
                socialCount     
                category     
                creativeLink
                templateLink
                sourceSellingAtImg
             } } `
        }
        points.customFetch('https://freeviralproducts.com/graphql', "POST", payload, result => {
            let data = result.data.shareProductToPlg;
            this.setState({ data: data });
        });

        this.computeResult();
    }

    head() {
        return (
            <Helmet>
                <title>Free Viral Products - Product List Genie</title>
            </Helmet>
        );
    }

    handleChange(event) {
        var value = event.target.value;
        var name = event.target.name;
        // console.log(name, value);
        this.setState({ [name]: parseFloat(value.toString()) }, () => {
            this.computeResult();
        })
        // console.log(this.state);
    }

    /**
    *```
    *let sample = {
    *    country,
    *    codprice,
    *    codsellprice,
    *    ccprice,
    *    ccsellprice
    *}```
    */
    computeResult() {
        console.log('update computation');
        let { prod_cost, sell_price, marginss } = this.state;
        const sauditax = 0.075, commtax = 0.05, fulfillment = 2.72 , taxfree = 0;
        const shsaudi = 18, shoman = 27.46, shkuwait = 28.63, shbahrain = 26.21, shegypt = 26.21, shuae = 6.5, shgen = 15;
        sell_price = prod_cost + marginss + fulfillment;
        const shtaxamnt = sauditax * sell_price, alltaxamnt = commtax * sell_price;

        points.customFetch("/api/getGlobalCurrency", "GET", null, (respo) => {
            // console.log(respo);
            let result = [{
                country: "Saudi",
                iso2: "sa",
                currencySymbol: "﷼",
                codprice: prod_cost + shsaudi + shtaxamnt + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shsaudi + shtaxamnt + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.SAR,
                ccprice: (prod_cost + shsaudi + shtaxamnt + (sell_price * 0.01) + fulfillment) - 9,
                ccsellprice: (((prod_cost + shsaudi + shtaxamnt + (sell_price * 0.01) + fulfillment + marginss)) - 9) * respo.rates.SAR
            }, {
                country: "Oman",
                iso2: "om",
                currencySymbol: "ر.ع",
                codprice: prod_cost + shoman + alltaxamnt + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shoman + alltaxamnt + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.OMR,
                ccprice: (prod_cost + shoman + alltaxamnt + (sell_price * 0.01) + fulfillment) - 9,
                ccsellprice: (((prod_cost + shoman + alltaxamnt + (sell_price * 0.01) + fulfillment + marginss)) - 9) * respo.rates.OMR
            }, {
                country: "Kuwait",
                iso2: "kw",
                currencySymbol: "د.ك",
                codprice: prod_cost + shkuwait + alltaxamnt + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shkuwait + alltaxamnt + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.KWD,
                ccprice: (prod_cost + shkuwait + alltaxamnt + (sell_price * 0.01) + fulfillment) - 9,
                ccsellprice: (((prod_cost + shkuwait + alltaxamnt + (sell_price * 0.01) + fulfillment + marginss)) - 9) * respo.rates.KWD
            }, {
                country: "Bahrain",
                iso2: "bh",
                currencySymbol: "د.ب",
                codprice: prod_cost + shbahrain + alltaxamnt + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shbahrain + alltaxamnt + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.BHD,
                ccprice: (prod_cost + shbahrain + alltaxamnt + (sell_price * 0.01) + fulfillment) - 9,
                ccsellprice: (((prod_cost + shbahrain + alltaxamnt + (sell_price * 0.01) + fulfillment + marginss)) - 9) * respo.rates.BHD
            }, {
                country: "Egypt",
                iso2: "eg",
                currencySymbol: "ج.م",
                codprice: prod_cost + shegypt + alltaxamnt + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shegypt + alltaxamnt + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.EGP,
                ccprice: (prod_cost + shegypt + alltaxamnt + (sell_price * 0.01) + fulfillment) - 9,
                ccsellprice: (((prod_cost + shegypt + alltaxamnt + (sell_price * 0.01) + fulfillment + marginss)) - 9) * respo.rates.EGP
            }, {
                country: "UAE",
                iso2: "ae",
                currencySymbol: "د",
                codprice: prod_cost + shuae + alltaxamnt + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shuae + alltaxamnt + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.AED,
                ccprice: (prod_cost + shuae + alltaxamnt + (sell_price * 0.01) + fulfillment) - 9,
                ccsellprice: ((prod_cost + shuae + alltaxamnt + (sell_price * 0.01) + fulfillment + marginss)) * respo.rates.AED
            }, {
                country: "Mexico",
                iso2: "mx",
                currencySymbol: "$",
                codprice: prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.MXN,
                ccprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment) ,
                ccsellprice: ((prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) ) * respo.rates.MXN
            }, {
                country: "Israel",
                iso2: "il",
                currencySymbol: "₪",
                codprice: prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.ILS,
                ccprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment) ,
                ccsellprice: ((prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) ) * respo.rates.ILS
            }, {
                country: "Canada",
                iso2: "ca",
                currencySymbol: "$",
                codprice: prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.CAD,
                ccprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment) ,
                ccsellprice: ((prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) ) * respo.rates.CAD
            }, {
                country: "Australia",
                iso2: "au",
                currencySymbol: "$",
                codprice: prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.AUD,
                ccprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment) ,
                ccsellprice: ((prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) ) * respo.rates.AUD
            }, {
                country: "United States",
                iso2: "us",
                currencySymbol: "$",
                codprice: prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss),
                ccprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment) ,
                ccsellprice: ((prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) )
            }, {
                country: "Taiwan",
                iso2: "tw",
                currencySymbol: "$",
                codprice: prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.TWD,
                ccprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment) ,
                ccsellprice: ((prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) ) * respo.rates.TWD
            }, {
                country: "Hongkong",
                iso2: "hk",
                currencySymbol: "$",
                codprice: prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.HKD,
                ccprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment) ,
                ccsellprice: ((prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) ) * respo.rates.HKD
            }, {
                country: "South Africa",
                iso2: "za",
                currencySymbol: "R",
                codprice: prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.ZAR,
                ccprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment) ,
                ccsellprice: ((prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) ) * respo.rates.ZAR
            }, {
                country: "France",
                iso2: "fr",
                currencySymbol: "€",
                codprice: prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.EUR,
                ccprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment) ,
                ccsellprice: ((prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) ) * respo.rates.EUR
            }, {
                country: "India",
                iso2: "in",
                currencySymbol: "₹",
                codprice: prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.INR,
                ccprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment) ,
                ccsellprice: ((prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) ) * respo.rates.INR
            }, {
                country: "Germany",
                iso2: "de",
                currencySymbol: "€",
                codprice: prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.EUR,
                ccprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment) ,
                ccsellprice: ((prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) ) * respo.rates.EUR
            },{
                country: "Malaysia",
                iso2: "my",
                currencySymbol: "RM",
                codprice: prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.MYR,
                ccprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment) ,
                ccsellprice: ((prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) ) * respo.rates.MYR
            },{
                country: "Singapore",
                iso2: "sg",
                currencySymbol: "$",
                codprice: prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment,
                codsellprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.SGD,
                ccprice: (prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment) ,
                ccsellprice: ((prod_cost + shgen + taxfree + (sell_price * 0.01) + fulfillment + marginss) ) * respo.rates.SGD
            },
            ].sort((a,b) => a.country.localeCompare(b.country));



            this.setState({ computationRes: result })
        });

        // console.log({ prod_cost, sell_price, marginss });


    }

    render() {
        const state = this.state;
        const currentUser = this.props.session.getCurrentUser;

        // console.log(currentUser);

        return (
            <div className="funnel">
                {this.head()}
                <div className="newPageHeader display-inline row-separator">
                    <div className="column column_6_12">
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}> Viral DFY Funnels </h4>
                        {/* Cash on Delivery */}
                    </div>
                    <div className="column column_6_12">
                        <button className="btn-success font-roboto-light" onClick={() => this.togggleCalculator()} style={{ margin: '0 5px' }}>
                            <span className="hide-in-mobile">Quote Calculator</span>
                        </button>
                        <button className="btn-success font-roboto-light" onClick={() => this.toggleCreateModal()} style={{ margin: '0 5px' }}>
                            <span className="hide-in-mobile">Must Watch Before Selling</span>
                        </button>
                    </div>
                </div>
                <span className="clear" />
                <div className="flex-container clear" style={{
                    justifyContent: "center"
                }}>
                    {state.data.map((product, index) => {
                        return (
                            <div className="column column_3_12" key={index} style={{ minWidth: 230, margin: 0, filter: 'blur(0px)' }}>
                                <div className="product-card">
                                    <div className="funnel product-tumb product-card-thumb" style={{ backgroundImage: "url(" + product.sourceSellingAtImg + ")", borderRadius: '5px 5px 0 0', position: 'relative', overflow: 'hidden' }}>
                                    </div>
                                    <div className="product-details product-card-details">
                                        <div className="display-inline" >
                                            <div style={{
                                                width: "100%"
                                            }}>
                                                {/* <h5> */}
                                                <span className={"lang-bh cursor-pointer lang-active"}
                                                    style={{
                                                        padding: 1,
                                                        width: "15px",
                                                        height: "15px"
                                                    }} />
                                                <span className={"lang-kw cursor-pointer lang-active"}
                                                    style={{
                                                        padding: 1,
                                                        width: "15px",
                                                        height: "15px"
                                                    }} />
                                                <span className={"lang-qa cursor-pointer lang-active"}
                                                    style={{
                                                        padding: 1,
                                                        width: "15px",
                                                        height: "15px"
                                                    }} />
                                                <span className={"lang-om cursor-pointer lang-active"}
                                                    style={{
                                                        padding: 1,
                                                        width: "15px",
                                                        height: "15px"
                                                    }} />
                                                <span className={"lang-ksa cursor-pointer lang-active"}
                                                    style={{
                                                        padding: 3,
                                                        width: "15px",
                                                        height: "15px"
                                                    }} />
                                                <span className={"lang-uae cursor-pointer lang-active"}
                                                    style={{
                                                        padding: 3,
                                                        width: "15px",
                                                        height: "15px"
                                                    }} />
                                                <span className="far fa-heart float-right" style={{
                                                    cursor: "pointer",
                                                    width: "auto",
                                                    fontSize: "20px",
                                                    WebkitTextFillColor: 'red'
                                                }}></span>

                                                {/* </h5> */}
                                            </div>
                                        </div>
                                        <br />
                                        <div className="display-inline">
                                            <div style={{
                                                width: "100%",
                                                fontWeight: "bold"
                                            }}>
                                                <h5>{product.socialCount}</h5>
                                            </div>
                                        </div>
                                        <br></br>
                                        {(currentUser && currentUser.privilege == 10) && <div className="display-inline">
                                            <button className="btn-success font-roboto-light" onClick={() => {
                                                window.open(`https://freeviralproducts.com/admin-edit-product/${product.id}`, '_blank');
                                            }} style={{ margin: '0 5px', fontSize: "12px", width: "140px" }}>
                                                <span >Edit</span>
                                            </button>
                                        </div>}
                                        <br></br>
                                        <div className="display-inline" style={{
                                            width: "100%",
                                            fontWeight: "bold"
                                        }}>
                                            <button className="btn-success font-roboto-light" onClick={() => {

                                                if (product.templateLink != "") {
                                                    window.open(product.templateLink, '_blank');
                                                } else {
                                                    toastr.error("No Funnel Link available.");
                                                }
                                            }} style={{ margin: '0 5px', fontSize: "10px", width: "140px" }}>
                                                <span >Create Funnel</span>
                                            </button>
                                            <button className="btn-success font-roboto-light" onClick={() => {

                                                if (product.creativeLink != "") {
                                                    window.open(product.creativeLink, '_blank');
                                                } else {
                                                    toastr.error("No Creative Link available.");
                                                }
                                            }} style={{ margin: '0 5px', fontSize: "10px", paddingLeft: "9px", paddingRight: "9px" }}>
                                                <span >Download Creative</span>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )
                    })}
                </div>
                {state.calculator &&
                    <Modal open={state.calculator} closeModal={() => this.togggleCalculator()} session={this.props.session} style={{ width: '60%', borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0 }}>
                        <div>
                            <div className="column_12_12">
                                <style dangerouslySetInnerHTML={{ __html: `.popup-content .content { padding: 0px; }` }} />
                                <div className="clear" style={{ padding: 20, backgroundColor: '#f2f9f6', overflow: 'hidden' }}>
                                    <h4 className="header">Quote Calculator <small style={{
                                        color: "#4a4a4a",
                                        fontSize: "0.6em"
                                    }}>(all figures are approximate)</small></h4>
                                </div>
                                <br />
                            </div>
                            <div className="column_12_12" style={{
                                width: "96%",
                                marginLeft: "auto",
                                marginRight: "auto"
                            }}>
                                <div className="column column_6_12">
                                    <label className="font-questrial-light" style={{
                                        //                                     // prod_cost
                                        // sell_price
                                        // marginss
                                        fontSize: "1em"
                                    }}>
                                        Product Cost
                                            </label>
                                    <input type="number" className="font-roboto-light" name="prod_cost" value={state.prod_cost} onChange={this.handleChange.bind(this)} style={{
                                        margin: 10,
                                        fontSize: "0.875em"
                                    }} />
                                </div>
                                {/* <div className="column column_4_12">
                                    <label className="font-questrial-light" style={{
                                        fontSize: "1em"
                                    }}>
                                        Selling Price
                                            </label>
                                    <input type="number" className="font-roboto-light" name="sell_price" value={state.sell_price} onChange={this.handleChange.bind(this)} style={{
                                        margin: 10,
                                        fontSize: "0.875em"
                                    }} />                                    
                                </div> */}
                                <div className="column column_6_12">
                                    <label className="font-questrial-light" style={{
                                        fontSize: "1em"
                                    }}>
                                        Margin
                                            </label>
                                    <input type="number" className="font-roboto-light" name="marginss" value={state.marginss} onChange={this.handleChange.bind(this)} style={{
                                        margin: 10,
                                        fontSize: "0.875em"
                                    }} />
                                </div>
                            </div>
                            <br />
                            <div className="column column_12_12" style={{
                                // width: "96%",
                                marginRight: "auto",
                                marginLeft: "auto"
                            }}>
                                <hr />
                                <div className="table-container clear">
                                    <h5>Quote Calculator Result</h5>
                                    <br />
                                    <table className="table-list">
                                        <thead>
                                            <tr>
                                                <th className="text-center">Country</th>
                                                <th className="text-center">COD Price USD</th>
                                                <th className="text-center">COD Selling Price Local</th>
                                                <th className="text-center">Credit Card Price USD</th>
                                                <th className="text-center">Credit Card Selling Price Local</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(() => {
                                                if (state.computationRes.length == 0) {
                                                    return (
                                                        <tr>
                                                            <td className="text-center" colSpan={5}>
                                                                <span className="no-result">
                                                                    No Result Found. Fillup to start quote calculation.
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                return state.computationRes.map((cal, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td ><span className={'lang-' + cal.iso2} style={{"padding":"1px","width":"15px","height":"15px"}}></span>{cal.country}</td>
                                                            <td className="text-center">$ {cal.codprice.toFixed(2) == "NaN" ? 0 : cal.codprice.toFixed(2)}</td>
                                                            <td className="text-center"> {cal.codsellprice.toFixed(2) == "NaN" ? 0 : `${cal.currencySymbol}${cal.codsellprice.toFixed(2)}` }</td>
                                                            <td className="text-center">$ {cal.ccprice.toFixed(2) == "NaN" ? 0 : cal.ccprice.toFixed(2)}</td>
                                                            <td className="text-center"> {cal.ccsellprice.toFixed(2) == "NaN" ? 0 : `${cal.currencySymbol}${cal.ccsellprice.toFixed(2)}` }</td>
                                                        </tr>
                                                    )
                                                })
                                            })()}
                                            {/*  */}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </Modal> 
                }

                {state.createModal &&
                    <Modal open={state.createModal} closeModal={() => this.toggleCreateModal()} session={this.props.session} style={{ width: '60%', borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0 }}>
                        <div>
                            <div className="column_12_12">
                                <style dangerouslySetInnerHTML={{ __html: `.popup-content .content { padding: 0px; }` }} />
                                <div className="clear" style={{ padding: 20, backgroundColor: '#f2f9f6', overflow: 'hidden' }}>
                                    <h4 className="header">Sell Anything You Want</h4>
                                </div>
                                <div className="text-center">
                                    <br></br>
                                    <iframe src='https://player.vimeo.com/video/451878420?color=27c686&title=0&byline=0' width='640' height='427' frameBorder='0' allowFullScreen></iframe>
                                    <div style={{ display: 'flex' }}>
                                        <span className="mcwidget-embed" data-widget-id="5009366" style={{ margin: '0 auto' }} />
                                    </div>
                                    <br></br>
                                    <button className="btn-success font-roboto-light" onClick={() => window.open('https://app.productlistgenie.io/share-funnel?shared=true&token=NWMyN2VjMjU0MjUwNzU3ZTU1YTJkMTAx&name=bmV3ZXN0LXRlbXBsYXRl&fid=NWYzOWI3YzYyZmNiMzAwYTkyZDUyMDM1')} style={{ margin: '0 5px' }}>
                                        <span className="hide-in-mobile">Start Selling What You Want Now!</span>
                                    </button>
                                    <br></br>
                                </div>
                                {/*  */}

                            </div>
                        </div>
                    </Modal>
                }
            </div>
        )
    }
}