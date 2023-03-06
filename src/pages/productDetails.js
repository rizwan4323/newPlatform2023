import React from 'react';
import toastr from 'toastr';
import ModalWithBundle from '../components/ModalComponent/bundle';
import Modal from '../components/ModalComponent';
import withAuth from './../hoc/withAuth';
import { Helmet } from 'react-helmet';
import { PUSH_TO_FUNNEL, SAVE_PUSH_TO_FUNNEL_LIST } from '../queries';
import { Mutation } from 'react-apollo';
import ButtonWithPopup from '../components/buttonWithPopup';
import SelectTag from '../components/selectTag';
import Popup from 'reactjs-popup';
import Loading from '../components/loading';
import { Link, Redirect } from 'react-router-dom';
const condition = require('../../Global_Conditions');
const points = require('../../Global_Values');
const alilogo = `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 48" style="enable-background:new 0 0 48 48;" xml:space="preserve" width="20px" height="20px"><path style="fill:#FF8F00;" d="M39,39.1H9c-1.7,0-3-1.3-3-3V9c0-1.7,1.3-3,3-3h30c1.7,0,3,1.3,3,3v27.1C42,37.7,40.7,39.1,39,39.1z"/><path style="fill:#DD2C00;" d="M39,42H9c-1.7,0-3-1.3-3-3V14c0-1.7,1.3-3,3-3h30c1.7,0,3,1.3,3,3v25C42,40.7,40.7,42,39,42z"/><circle style="fill:#B71C1C;" cx="15" cy="17" r="2"/><circle style="fill:#B71C1C;" cx="33" cy="17" r="2"/><path style="fill:#FFFFFF;" d="M24,27c-5.5,0-10-4.5-10-10c0-0.6,0.4-1,1-1s1,0.4,1,1c0,4.4,3.6,8,8,8s8-3.6,8-8c0-0.6,0.4-1,1-1 s1,0.4,1,1C34,22.5,29.5,27,24,27z"/></svg>`;

class ProductDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            handle: null,
            open: false,
            metafields: [],
            disabledPushBtn: true,
            disabledPushHQBtn: true,
            disabledBundleBtn: true,
            aliExpressProductDetails: [],
            aliExpressProductDetailsError: false,
            display_description: false,
            imageClicked: 0,
            profitMarginSlider: 20,
            us_wh_rsprice: 0,
            alreadyExecute: false,
            pushedURL: '',
            referral_link: '',
            readmore: false,

            openProductModal: false,
            productIdHolder: "",

            // metafields
            toggleCO: false,

            // push to funnel
            ptfDomainIndex: "",
            ptfFunnelName: '',
            fulfillByPLG: true,
            ptfOfferLink: '',
            pushToFunnel: false
        }
        this.openModal = this.openModal.bind(this)
        this.openProductToggle = this.openProductToggle.bind(this);
        this.closeModal = this.closeModal.bind(this)
        this.toggleBundleDisable = this.toggleBundleDisable.bind(this)
        this.togglePointsAnimation = this.togglePointsAnimation.bind(this)
    }

    display_description_button() {
        this.setState({ display_description: !this.state.display_description });
    }

    openProductToggle() {
        this.setState({
            openProductModal: !this.state.openProductModal
        })
    }

    openModal() {
        if (this.props.session.getCurrentUser.store_url) {
            if (this.props.session.getCurrentUser.count_pushWithBundle < points.limit_pushWithBundle) {
                this.setState({ open: true })
            } else if (this.props.session.getCurrentUser.privilege > 1) { // User Privilege
                this.setState({ open: true })
            } else {
                toastr.clear();
                toastr.warning('Seems like you exceed your daily limit to push more bundle.', 'Push with bundle Limit');
            }
        } else {
            toastr.clear();
            toastr.warning('Seems like your not connected to your store yet', 'Connect Your Store');
            window.toggleConnectModal()
        }
    }
    closeModal() {
        this.setState({ open: false })
    }

    toggleBundleDisable(isDone, event) {
        this.setState({ disabledBundleBtn: !this.state.disabledBundleBtn });
        if (isDone) {
            this.togglePointsAnimation(points.points_pushWithBundle);
        }
    }

    componentDidMount() {
        toastr.options = {
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

        const regex = new RegExp(/\/\w+-.*/g);
        const url = window.location.href;
        var handle = url.match(regex).toString().replace(/\/product-details\/|#.*|\?.*/g, "");
        // Use this try and catch to display hidden product
        // try {
        //     var x = JSON.parse(this.decode(handle))
        //     var newLink = "";
        //     for(var i=0;i<x.mp_handle.length;i++) {
        //         if(x.mp_handle[(i+1)] == "?"){
        //             newLink += x.mp_handle[i]+".json"
        //         } else {
        //             newLink += x.mp_handle[i]
        //         }
        //     }
        //     this.state.handle = newLink;
        // } catch(err){
        //     this.state.handle = "https://productlistgenie.io/products/"+handle+".json";
        // }
        var isMysteryProduct = false;
        try {
            var x = JSON.parse(this.decode(handle))
            this.state.handle = x.mp_handle;
            isMysteryProduct = true;
        } catch (err) {
            this.state.handle = handle;
        }
        fetch('https://productlistgenie.io/products/' + this.state.handle + '.json')
            .then((response) => response.json())
            .then((findresponse) => {
                let sellingPrice = "", saveState = { data: findresponse, us_wh_rsprice: sellingPrice };
                if (findresponse.product.tags.includes('us_warehouse')) {
                    var getZoneValueV2 = this.chkw(findresponse.product.variants[0].weight, findresponse.product.variants[0].weight_unit);
                    var roundedZoneValueV2 = ((getZoneValueV2.zone1234 + getZoneValueV2.zone56 + getZoneValueV2.zone7 + getZoneValueV2.zone8) / 4).toFixed(2);
                    sellingPrice = (this.state.profitMarginSlider + parseFloat(findresponse.product.variants[0].price) + parseFloat(roundedZoneValueV2)).toFixed(2);
                }

                // to automatically open push to funnel when redirected after creating funnel domain
                if (this.props.history.location.state && this.props.history.location.state.redirected) {
                    toastr.clear();
                    saveState.pushToFunnel = true;
                    saveState.ptfDomainIndex = this.props.session.getCurrentUser.funnel_genie_domains[0];
                }

                this.setState(saveState);
                this.getMetafields(findresponse.product.id);
                this.addCounterForHotProductsTrialAccount(findresponse.product.tags);

                // for saving mystery product as favorite
                if (isMysteryProduct) {
                    var isMPAlreadyFavorite = false;
                    this.props.session.getCurrentUser.favorites.map(favorite => {
                        var favid = parseInt(favorite.prodid);
                        var mysteryProductId = findresponse.product.id;
                        if (favid == mysteryProductId) {
                            isMPAlreadyFavorite = true;
                        }
                    })
                    if (!isMPAlreadyFavorite) {
                        this.saveMysteryProductAsFavorite(findresponse.product);
                    }
                }
            });
    }

    saveMysteryProductAsFavorite(data) {
        var payload = { "query": `mutation{\n  addFavorite(id:\"${this.props.session.getCurrentUser.id}\", prodid:\"${data.id}\", favorites:\"${data.handle}\", title:\"${data.title}\", src:\"${data.images[0].src}\", price:\"${data.variants[0].price}\"){\n    id\n  }\n}`, "variables": null }
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(res => {
                console.log("Mystery Product Added as favorite")
            });
    }

    decode(str) {
        return atob(str);
    }

    getMetafields(prodId) {
        var id = {
            productID: prodId.toString()
        }
        fetch('/api/get-product-metafields', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(id)
        })
            .then(res => res.json())
            .then(response => {
                var mfdata = [];
                response.data.product.metafields.edges.forEach(mf => {
                    mfdata[mf.node.key] = mf.node.value;
                })
                this.setState({ metafields: mfdata });
                mfdata["8_Vendor_Link"] ? this.getAliExpressProductDetails(mfdata["8_Vendor_Link"]) : this.setState({ aliExpressProductDetailsError: true, disabledPushHQBtn: false, disabledPushBtn: false, disabledBundleBtn: false });
            }).catch(err => {
                console.log(err);
                this.setState({ aliExpressProductDetailsError: true });
            });
    }

    pushToCommerceHQ() {
        if (this.props.session.getCurrentUser.commerceHQ) {
            this.setState({ disabledPushHQBtn: true }, () => {
                if (this.state.disabledPushHQBtn) {
                    if (this.props.session.getCurrentUser.count_pushToStore < points.limit_pushToStore) {
                        push(this);
                    } else if (this.props.session.getCurrentUser.privilege && this.props.session.getCurrentUser.privilege > 1) { // User Privilege
                        push(this);
                    } else {
                        toastr.clear()
                        toastr.warning('Seems like you exceed your daily limit to push more product.', 'push to shopify Limit');
                    }
                }
            });
        } else {
            toastr.clear()
            toastr.warning('Seems like your not connected to your store yet', 'Connect Your Store');
            window.toggleCommerceHQ()
        }

        function push(self) {
            toastr.clear()
            toastr.info('please wait...', 'Granting Your wish');
            var productLink = 'https://productlistgenie.io/products/' + self.state.handle;
            var data = {
                storeName: self.props.session.getCurrentUser.commerceHQ.storeName,
                apiKey: self.props.session.getCurrentUser.commerceHQ.apiKey,
                apiPassword: self.props.session.getCurrentUser.commerceHQ.apiPassword,
                src: productLink,
            };
            fetch('/api/v3/commerceHQ', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).then(response => response.json())
                .then(resultData => {
                    if (resultData.status === "success") {
                        var pushedURL = 'https://' + resultData.message;
                        toastr.options.onclick = function () {
                            window.open(pushedURL, '_blank');
                            toastr.clear();
                        }
                        self.updatePoints(pushedURL);
                    }
                }).catch(err => {
                    toastr.clear();
                    toastr.warning('Please try again.', 'Failed to grant a wish');
                    self.setState({ disabledPushHQBtn: false })
                });
        }
    }

    pushToStore(event) {
        if (this.props.session.getCurrentUser.store_url) {
            this.setState({ disabledPushBtn: true }, () => {
                if (this.state.disabledPushBtn) {
                    if (this.props.session.getCurrentUser.count_pushToStore < points.limit_pushToStore) {
                        push(this);
                    } else if (this.props.session.getCurrentUser.privilege && this.props.session.getCurrentUser.privilege > 1) { // User Privilege
                        push(this);
                    } else {
                        toastr.clear()
                        toastr.warning('Seems like you exceed your daily limit to push more product.', 'push to shopify Limit');
                    }
                }
            });
        } else {
            toastr.clear()
            toastr.warning('Seems like your not connected to your store yet', 'Connect Your Store');
            window.toggleConnectModal()
        }

        function push(self) {
            toastr.clear()
            toastr.info('please wait...', 'Granting Your wish');
            var productLink = 'https://productlistgenie.io/products/' + self.state.handle;
            if (self.state.aliExpressProductDetails.length != 0) {
                var rsp = self.nearest(self.aliExpressVariantPrice(self.state.aliExpressProductDetails.variants));
                var xtworsp = rsp * 2;
                var pr = self.state.data;
                var title = pr.product.title.replace(/"/g, '');
                var bodyHtml = pr.product.body_html.replace(/"/g, '\'');
                var tags = pr.product.tags.split(', ');

                var options = []
                pr.product.options.forEach(option => {
                    options.push(option.name)
                })

                var images = []
                pr.product.images.forEach(image => {
                    images.push({ src: image.src })
                })

                var variants = []
                pr.product.variants.forEach(variant => {
                    var vId;
                    var vv = {};
                    pr.product.images.forEach(image => {
                        if (variant.image_id === image.id) {
                            vId = image.src
                        }
                    })
                    vv.price = rsp,
                        vv.options = []
                    variant.option1 != null ? vv.options.push(variant.option1) : void 0;
                    variant.option2 != null ? vv.options.push(variant.option2) : void 0;
                    variant.option3 != null ? vv.options.push(variant.option3) : void 0;
                    variant.compare_at_price != null ? vv.compareAtPrice = xtworsp : void 0,
                        vv.inventoryQuantity = 200,
                        vv.inventoryManagement = "SHOPIFY",
                        vv.imageSrc = vId;

                    vv.sku = variant.sku

                    variants.push(vv)
                })

                var final = {
                    product_detail: {
                        title: title,
                        descriptionHtml: bodyHtml,
                        tags: tags,
                        images: images,
                        published: true,
                        options: options,
                        variants: variants
                    },
                    store_name: self.props.session.getCurrentUser.store_url,
                    store_token: self.props.session.getCurrentUser.store_token
                }
                fetch(points.apiServer + '/pushtostore', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(final)
                })
                    .then(response => response.json())
                    .then(resultData => {
                        if (resultData.data.productCreate.userErrors.length !== 0) {
                            toastr.clear();
                            toastr.error(resultData.data.productCreate.userErrors[0].message, 'Push Failed');
                        } else {
                            var pushedURL = resultData.data.productCreate.product.onlineStorePreviewUrl;
                            toastr.options.onclick = function () {
                                window.open(pushedURL, '_blank');
                                toastr.clear();
                            }
                            self.updatePoints(pushedURL);
                        }
                    })
                    .catch(err => {
                        toastr.clear();
                        toastr.warning('Please try again.', 'Failed to grant a wish');
                        self.setState({ disabledPushBtn: false })
                    });
            } else {
                var data = {
                    shop: self.props.session.getCurrentUser.store_url,
                    token: self.props.session.getCurrentUser.store_token,
                    src: productLink,
                    domain: self.props.session.getCurrentUser.store_url,
                    vendor_link: '',
                    wh: self.state.data.product.tags.includes('us_warehouse') ? {
                        warehouse: "plg",
                        plus_price: self.state.us_wh_rsprice,
                        compare_at_price: (self.state.us_wh_rsprice * 2)
                    } : null
                };
                fetch(points.apiServer + '/endpoint', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => response.json())
                    .then(resultData => {
                        if (resultData.status === "success") {
                            var pushedURL = 'https://' + resultData.message;
                            toastr.options.onclick = function () {
                                window.open(pushedURL, '_blank');
                                toastr.clear();
                            }
                            self.updatePoints(pushedURL);
                        }
                    })
                    .catch(err => {
                        toastr.clear();
                        toastr.warning('Please try again.', 'Failed to grant a wish');
                        self.setState({ disabledPushBtn: false })
                    });
            }

        }
    }
    updatePoints(pushedURL) {
        var id = this.props.session.getCurrentUser.id;
        var value = !this.props.session.getCurrentUser.one_time_missions.includes("first_push_to_store") ? points.points_firstPushToStore : points.points_pushToStore;
        var payload = { "query": `mutation{\n  mutate1: updateCount(id:\"${id}\", increaseWhat: "push_store"){\n    email },\n  \n  mutate2: updateRewardPoints(id:\"${id}\", source: "push to shopify", reward_points:${value}){\n    points\n    date\n  }\n}`, "variables": null }
        fetch(points.clientUrl + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                toastr.clear();
                toastr.success('Click here to view it on your store', 'Success');
                this.setState({ disabledPushBtn: false, disabledPushHQBtn: false });
                this.togglePointsAnimation(value);
                points.playSoundEffect();
                this.props.refetch();

                this.setState({
                    pushedURL
                })
            });
    }

    togglePointsAnimation(pts) {
        var rewardPoints = document.getElementById('rewardPoints');
        rewardPoints.innerHTML = `+${pts} points`;
        rewardPoints.classList.add("points-anim")
        setTimeout(function () {
            rewardPoints.classList.toggle("points-anim")
        }.bind(), 4000);
    }

    // Get AliExpress Product Details
    getAliExpressProductDetails(prodid) {
        if (prodid.match(/\d+.htm/g)) {
            prodid = prodid.match(/\d+.htm/g).toString().replace(".htm", "")
            fetch('https://api.productlistgenie.io/ali2plg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ali_product_id: prodid })
            })
                .then((response) => response.json())
                .then((res) => {
                    this.setState({ aliExpressProductDetails: res, disabledPushHQBtn: false, disabledPushBtn: false, disabledBundleBtn: false })
                })
                .catch(err => {
                    this.setState({ aliExpressProductDetailsError: true, disabledPushHQBtn: false, disabledPushBtn: false, disabledBundleBtn: false })
                })
        } else {
            this.setState({ aliExpressProductDetailsError: true, disabledPushHQBtn: false, disabledPushBtn: false, disabledBundleBtn: false })
        }
    }
    // round to max of 20 + .95 fixed decimal of price in aliexpress
    nearest(n) {
        n = this.state.profitMarginSlider + parseInt(n);
        n = n / 5;
        n = Math.ceil(n) * 5;
        return n.toFixed(2) - 0.05;
    }

    aliExpressVariantPrice(variant) {
        let useDiscount = false;
        if (variant[0].discount) {
            useDiscount = true;
        }

        let temp = variant.map(data => {
            return parseFloat(useDiscount ? data.discount : data.pricing);
        });

        return (temp.reduce((acc, val) => {
            return acc + val;
        }) / variant.length).toFixed(2);
    }

    imageClick(i) {
        this.setState({ imageClicked: i });
    }

    head() {
        return (
            <Helmet>
                <title>{this.state.data.product.title} - Product List Genie</title>
            </Helmet>
        );
    }

    /* START: Get the days remaining to become VIP or Upgrade Now */
    // start for date computation
    datediff(first, second) {
        return Math.round((second - first) / (1000 * 60 * 60 * 24));
    }

    parseDate(str) {
        var mdy = str.split('/');
        return new Date(mdy[2], mdy[0] - 1, mdy[1]);
    }

    formatDate(date) {
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getUTCFullYear();
        return (monthIndex + 1) + '/' + day + '/' + year;
    }
    // end for date computation

    getRemainingDays() {
        if (this.props.session.getCurrentUser.privilege <= 1) { // User Privilege
            let joinDate = parseInt(this.props.session.getCurrentUser.joinDate);
            let vipDate = new Date(joinDate + (86400000 * points.dateToBecomeVIP));
            let dateNow = new Date();
            let result = this.datediff(this.parseDate(this.formatDate(dateNow)), this.parseDate(this.formatDate(vipDate)))
            if (result > 0) {
                return (
                    <label>{result} Day{result > 1 ? 's' : ''} Remaining To Become <strong>VIP</strong> or <strong>UPGRADE NOW</strong></label>
                );
            }
        }
    }
    /* END: Get the days remaining to become VIP or Upgrade Now */

    isNotFreeUser(tags) {
        if (this.props.session.getCurrentUser.privilege == 0) { // User Privilege
            if (tags.includes("hot_product")) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    addCounterForHotProductsTrialAccount(tags) {
        if (this.props.session.getCurrentUser.privilege === 1) { // User Privilege
            if (tags.includes("hot_product")) {
                var id = this.props.session.getCurrentUser.id;
                var payload = { "query": `mutation{\n  updateCount(id:\"${id}\", increaseWhat: "hot_products"){\n    email }}`, "variables": null }
                fetch(points.clientUrl + '/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                })
                    .then(response => {
                        this.props.refetch();
                    });
            }
        }
    }

    getProductById(id) {
        var productid = id;
        if (productid) {
            var payload = { productID: productid };
            points.customFetch('/api/get-product-metafields', 'POST', payload, result => {

                result.data.product.metafields.edges.forEach(el => {

                    var name = el.node.key;
                    document.querySelector('#metafields [name="' + name + '"]').setAttribute("data-id", el.node.id);
                    document.querySelector('#metafields [name="' + name + '"]').value = el.node.value;
                });
            })
        }
    }

    saveMetafields() {
        toastr.clear();
        toastr.info("Loading Please wait...", "");
        var productid = document.querySelector('[name="productid"]').value;
        var payload = {
            "input": {
                "id": "gid://shopify/Product/" + productid,
                "metafields": []
            }
        }
        document.getElementById("metafields").querySelectorAll("input,textarea").forEach(el => {
            if (el.getAttribute("data-id")) {
                payload.input.metafields.push({
                    "id": el.getAttribute("data-id"),
                    "namespace": "c_f",
                    "key": el.name,
                    "value": el.value,
                    "valueType": "STRING"
                });
            } else {
                if (el.value) {
                    payload.input.metafields.push({
                        "namespace": "c_f",
                        "key": el.name,
                        "value": el.value,
                        "valueType": "STRING"
                    });
                }
            }
        });
        points.customFetch('/api/save-product-metafields', 'POST', payload, result => {
            toastr.clear();
            toastr.success("Metafield has been saved.", "Save Success");
            console.log(result)
        })
    }

    convertWeightToItsUnit(weight, unit) {
        if (unit == "oz") {
            return weight / 16
        }
        if (unit == "kg") {
            return weight * 2.20462
        }
        if (unit == "g") {
            return weight * 0.00220462
        }
        if (unit == "lb") {
            return weight;
        }
    }

    chkw(weight, unit) {
        weight = this.convertWeightToItsUnit(weight, unit);
        if (weight >= 0 && weight <= 0.259999) {
            return { zone1234: 4.40, zone56: 4.45, zone7: 4.50, zone8: 4.55 }
        }
        if (weight >= 0.26 && weight < 0.509999) {
            return { zone1234: 5.00, zone56: 5.20, zone7: 5.17, zone8: 5.16 }
        }
        if (weight >= 0.51 && weight <= 0.759999) {
            return { zone1234: 5.50, zone56: 5.59, zone7: 5.80, zone8: 5.84 }
        }
        if (weight >= 0.76 && weight <= 0.999999) {
            return { zone1234: 6.10, zone56: 6.37, zone7: 7.00, zone8: 7.15 }
        }
        if (weight >= 1.00 && weight <= 1.999999) {
            return { zone1234: 7.75, zone56: 8.42, zone7: 9.38, zone8: 10.32 }
        }
        if (weight >= 2 && weight <= 2.999999) {
            return { zone1234: 8.44, zone56: 9.20, zone7: 9.90, zone8: 11.16 }
        }
        if (weight >= 3.00 && weight <= 3.999999) {
            return { zone1234: 8.90, zone56: 10.30, zone7: 11.45, zone8: 11.85 }
        }
        if (weight >= 4.00 && weight <= 6) {
            return { zone1234: 8.90, zone56: 10.30, zone7: 11.45, zone8: 11.85 }
        }
    }

    handleProfitMarginSliderChange(event) {
        // for us warehouse
        var getZoneValueV2 = this.chkw(this.state.data.product.variants[0].weight, this.state.data.product.variants[0].weight_unit);
        var roundedZoneValueV2 = ((getZoneValueV2.zone1234 + getZoneValueV2.zone56 + getZoneValueV2.zone7 + getZoneValueV2.zone8) / 4).toFixed(2);
        var sellingPrice = (this.state.profitMarginSlider + parseFloat(this.state.data.product.variants[0].price) + parseFloat(roundedZoneValueV2)).toFixed(2);

        this.setState({
            profitMarginSlider: parseInt(event.target.value),
            us_wh_rsprice: sellingPrice
        })
    }

    togglePushToFunnel() {
        let currentUser = this.props.session.getCurrentUser, has_arabic_funnel_access = condition.has_arabic_funnel(currentUser);
        if (currentUser.funnel_genie_domains.length != 0) {
            if (this.state.data.product.tags.includes("cod_arabicfunnel") && !has_arabic_funnel_access) window.open("https://themm.kartra.com/page/YIw155", "_blank");
            else if ((currentUser.privilege == 1 || currentUser.privilege == 2) && this.state.data.product.tags.includes("premium_unlock")) { // User Privilege
                // user ay level 1 or 2 or trial at product ay may tags na premium_unlock
                toastr.options.onclick = () => {
                    window.open("https://themm.kartra.com/page/brandables-pack", "_blank");
                }
                toastr.clear();
                toastr.warning("Upgrade Required To Use This Feature. Click Here To Upgrade Your Account.", "");
            } else if (currentUser.privilege == 3 && this.state.data.product.tags.includes("premium_unlock")) { // User Privilege
                // user ay level 3 at walang kartra tags na Publish_All at product ay may tags na premium_unlock
                toastr.options.onclick = () => {
                    window.open(points.plgUpsellLink(currentUser.privilege), "_blank")
                }
                toastr.clear();
                toastr.warning("Upgrade Required To Use This Feature. Click Here To Upgrade Your Account.", "");
            } else {
                if (this.state.data.product.tags.includes("cod_test")) {
                    toastr.clear();
                    toastr.warning("For Testing only! If you receive sales and would like to own this product, contact chat support.", "ATTENTION!");
                }
                this.setState({ ptfDomainIndex: currentUser.funnel_genie_domains[0], pushToFunnel: !this.state.pushToFunnel })
            }
        } else {
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.clear();
            toastr.warning("Please add your business name to create funnel", "Business Name Required");
            this.props.history.push('/funnel-genie-main', { redirect_link: this.props.history.location.pathname });
        }
    }

    render() {
        if (this.state.data.length !== 0) {
            // once data loaded replace the content
            let state = this.state, isPrivate = false, { data, metafields } = state, currentUser = this.props.session.getCurrentUser, private_tag = points.getShopifyPrivateTag(currentUser);

            data.product.tags.split(",").forEach(product => {
                product = product.replace(/\s/g, "");
                if (!isPrivate) isPrivate = (private_tag.filter(e => e == product).length != 0);
            });

            if (isPrivate) {
                return (
                    <div className="center-vertical-parent" style={{ height: '85vh' }}>
                        <div className="center-vertical">
                            <img src="/assets/graphics/no-result.svg" style={{ height: '50vh' }} />
                            <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! YOU CAN'T OPEN THIS PAGE!</h4>
                        </div>
                    </div>
                );
            }

            return (
                <div className="grid content_block funnel">
                    {this.head()}
                    <style dangerouslySetInnerHTML={{ __html: ` body { background-image: none; background-color: #f4f9fd; } ` }} />
                    <div className="column column_5_12">
                        <img className="img-border" src={data.product.images[this.state.imageClicked].src} width="100%" style={{ width: '100%', height: "auto", display: "inline" }} />
                        <div className="column_12_12 pcol display-inline" style={{ overflow: 'auto', borderBottom: '2px solid #d3d6d5', paddingBottom: 10 }}>
                            {data.product.images.map((image, i) => (
                                <img className="column column_3_12 pcol" src={image.src} id={image.position} width="100%" style={{ cursor: "pointer" }} onMouseEnter={() => this.imageClick(i)} key={i} />
                            ))}
                        </div>
                    </div>
                    <div className="column column_7_12">
                        <div className="column column_7_12">
                            <div className="form_wrap" style={{ padding: 0, marginTop: '1rem' }}>
                                <h4 className="title form_row text-center" style={{ fontSize: '3em' }}>{data.product.title}</h4>
                                <label className="font-roboto-bold" style={{ fontSize: '1em' }}>PRODUCT DESCRIPTION</label>
                                {(() => {
                                    var product_description = data.product.body_html;
                                    if (product_description.match(/<img[^>]+>/)) {
                                        var firstImage = product_description.match(/<img[^>]+>/).toString();
                                        var modifiedImage = product_description.match(/<img[^>]+>/).toString().replace(">", "") + " style='display: none'>";
                                        product_description = product_description.replace(firstImage, modifiedImage)
                                    }
                                    return <div className="font-roboto-light" style={{ height: 190, overflow: 'hidden', fontSize: '0.875em', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: product_description.replace(/(<script(\s|\S)*?<\/script>)|(<style(\s|\S)*?<\/style>)|(<!--(\s|\S)*?-->)|(<\/?(\s|\S)*?>)/g, "") }} />
                                })()}
                                <button className="font-roboto-light" style={{ textDecoration: 'underline', fontSize: '0.875em', marginTop: 5, backgroundColor: '#e6eae9' }} onClick={() => this.setState({ readmore: true })}>
                                    READ MORE
                                    <span className="fas fa-caret-down clickable" style={{ marginLeft: 10 }} />
                                </button>
                                {currentUser.access_tags.includes("dev") &&
                                    <button className="font-roboto-light" style={{ fontSize: '0.875em', marginTop: 5, backgroundColor: '#e6eae9', marginLeft: 10 }} onClick={() => {
                                        // points.copyStringToClipboard(data.product.id);
                                        // TODO :: Create Modal Admin Proudct Meta Fields 
                                        // Add on Modal "Edit on Shopify"... https://{{user_shop_name}}/admin/products/{{data.product.id}}
                                        // points.toastrPrompt(toastr, "success", "Product ID successfully copied", "Success");                                        
                                        this.getProductById(data.product.id);
                                        this.setState({
                                            productIdHolder: data.product.id
                                        })
                                        this.openProductToggle();
                                    }}>
                                        Edit Product Details
                                    </button>
                                }

                                <div style={{ marginTop: 30 }}>
                                    <div style={{ padding: 10, backgroundColor: '#000', borderRadius: '10px 10px 0 0', color: '#fff' }}>
                                        <label className="font-roboto-light" style={{ fontSize: '1em' }}>Advertisement</label>
                                        <span className="clickable font-roboto-light float-right" style={{ fontSize: '0.875em', lineHeight: 1.2, textDecoration: 'underline' }} onClick={() => {
                                            points.copyStringToClipboard(this.isNotFreeUser(data.product.tags) && metafields["7_Ad_Copy_Text"] ? metafields["7_Ad_Copy_Text"].replace(/(<script(\s|\S)*?<\/script>)|(<style(\s|\S)*?<\/style>)|(<!--(\s|\S)*?-->)|(<\/?(\s|\S)*?>)/g, "") : "Not Available")
                                            toastr.clear();
                                            toastr.success("Ad copy text copied.", "Copied");
                                        }}>Copy Text</span>
                                    </div>
                                    <div style={{ backgroundColor: '#0d0d0d', borderRadius: '0 0 10px 10px', padding: 10 }}>
                                        <div style={{ border: '3px dotted #3a3a3a', padding: 15 }}>
                                            <label className="font-roboto-light" style={{ fontSize: '1em', color: '#fff' }}>
                                                {(() => {
                                                    if (!this.isNotFreeUser(data.product.tags)) {
                                                        return this.getRemainingDays();
                                                    } else if (metafields["7_Ad_Copy_Text"]) {
                                                        return <span id="7_Ad_Copy_Text" dangerouslySetInnerHTML={{ __html: metafields["7_Ad_Copy_Text"] }}></span>
                                                    } else {
                                                        return "Not Available";
                                                    }
                                                })()}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column column_5_12" style={{ borderLeft: '2px solid #d3d6d5', marginTop: '1rem' }}>
                            <div className="form_wrap" style={{ padding: 0, marginTop: '1rem' }}>
                                <label className="font-roboto-light form_row" style={{ fontSize: '1.5em' }}>Your Profit & Costs</label>
                                {(() => {
                                    // If has error on aliexpress details
                                    if (this.state.aliExpressProductDetailsError) {
                                        if (data.product.tags.includes("us_warehouse")) {
                                            // if us warehouse
                                            return (
                                                <div>
                                                    {/* Price Adjuster for us warehouse Card */}
                                                    <div className="product-card">
                                                        <div className="product-details bundleslider">
                                                            <label className="font-roboto-light" style={{ fontSize: '1em' }}>Adjust Profit Margin</label>
                                                            <hr style={{ position: 'absolute', left: 0, right: 0, border: '1px solid #ecf0ee' }} /> <br /> <br />
                                                            <input className="stretch-width" type="range" min="0" max="100" value={this.state.profitMarginSlider} onChange={this.handleProfitMarginSliderChange.bind(this)} style={{ backgroundImage: 'linear-gradient(to right, #ff8000 0%, #ff8000 ' + this.state.profitMarginSlider + '%, rgb(215, 220, 223) ' + this.state.profitMarginSlider + '%)', margin: '10px 0' }} />
                                                        </div>
                                                    </div>

                                                    {/* Profit Margin Card */}
                                                    <div className="product-card">
                                                        <div className="product-details">
                                                            <label className="font-roboto-light" style={{ fontSize: '1em' }}>Profit Margin</label>
                                                            <hr style={{ position: 'absolute', left: 0, right: 0, border: '1px solid #ecf0ee' }} /> <br /> <br />
                                                            <label className="font-roboto-bold" style={{ fontSize: '2em' }}>{'$' + this.state.profitMarginSlider}</label>
                                                        </div>
                                                    </div>

                                                    {/* Recommended Selling Price Card */}
                                                    <div className="product-card">
                                                        <div className="product-details">
                                                            <label className="font-roboto-light" style={{ fontSize: '1em' }}>Recommended Selling Price</label>
                                                            <hr style={{ position: 'absolute', left: 0, right: 0, border: '1px solid #ecf0ee' }} /> <br /> <br />
                                                            <label className="font-roboto-bold" style={{ fontSize: '2em', color: '#26c784' }}>{"$" + this.state.us_wh_rsprice}</label>
                                                        </div>
                                                    </div>

                                                    {/* US Warehouse Logic Card */}
                                                    <div className="product-card">
                                                        <div className="product-details" style={{ display: 'flex', alignItems: 'end' }}>
                                                            <label className="font-roboto-bold" style={{ fontSize: '2em' }}>{'$' + data.product.variants[0].price}</label>
                                                            <span className="fas fa-plus" style={{ margin: 8 }}></span>
                                                            {(() => {
                                                                var getZoneValue = this.chkw(data.product.variants[0].weight, data.product.variants[0].weight_unit);
                                                                var roundedZoneValue = ((getZoneValue.zone1234 + getZoneValue.zone56 + getZoneValue.zone7 + getZoneValue.zone8) / 4).toFixed(2);
                                                                return (
                                                                    <Popup
                                                                        trigger={<label className="font-roboto-bold" style={{ cursor: 'pointer', color: '#f28706', fontSize: '2em' }}>{'$' + roundedZoneValue}</label>}
                                                                        position="bottom right"
                                                                        on="hover" className="points-tooltip">
                                                                        <div style={{ margin: 5, textAlign: 'left', lineHeight: 1.6 }}>
                                                                            <h4 style={{ textTransform: 'capitalize' }}>Average US Delivery Rate<br />based on product weight</h4>
                                                                            <h5>Zone 1 to 4: <span className="float-right">{"$" + getZoneValue.zone1234}</span></h5>
                                                                            <h5>Zone 5 and 6: <span className="float-right">{"$" + getZoneValue.zone56}</span></h5>
                                                                            <h5>Zone 7: <span className="float-right">{"$" + getZoneValue.zone7}</span></h5>
                                                                            <h5>Zone 8: <span className="float-right">{"$" + getZoneValue.zone8}</span></h5>
                                                                        </div>
                                                                    </Popup>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            // if not us warehouse
                                            return (
                                                <div>
                                                    {/* Recommended Selling Price Card */}
                                                    <div className="product-card">
                                                        <div className="product-details">
                                                            <label className="font-roboto-light" style={{ fontSize: '1em' }}>{data.product.tags.includes("cpa_offers") ? "Affiliate Commission" : "Recommended Selling Price"}</label>
                                                            <hr style={{ position: 'absolute', left: 0, right: 0, border: '1px solid #ecf0ee' }} /> <br /> <br />
                                                            <label className="font-roboto-bold" style={{ fontSize: '2em', color: '#26c784' }}>{'$' + data.product.variants[0].price}</label>
                                                        </div>
                                                    </div>

                                                    {/* Compare Price Card */}
                                                    {!data.product.tags.includes("cpa_offers") &&
                                                        <div className="product-card">
                                                            <div className="product-details">
                                                                <label className="font-roboto-light" style={{ fontSize: '1em' }}>Compare Price</label>
                                                                <hr style={{ position: 'absolute', left: 0, right: 0, border: '1px solid #ecf0ee' }} /> <br /> <br />
                                                                <label className="font-roboto-bold" style={{ fontSize: '2em', color: 'red' }}><strike>{data.product.variants[0].compare_at_price ? '$' + data.product.variants[0].compare_at_price : 'N/A'}</strike></label>
                                                            </div>
                                                        </div>
                                                    }

                                                    {/* COD Expense for cod product */}
                                                    {data.product.tags.includes("cod") &&
                                                        <div className="product-card">
                                                            <div className="product-details">
                                                                <label className="font-roboto-light" style={{ fontSize: '1em' }}>COD Expense</label>
                                                                <hr style={{ position: 'absolute', left: 0, right: 0, border: '1px solid #ecf0ee' }} /> <br /> <br />
                                                                <label className="font-roboto-bold" style={{ fontSize: '2em', color: '#26c784' }}>{metafields["A_Google_Headline"] ? "$" + metafields["A_Google_Headline"].replace("$", "") : "N/A"}</label>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            );
                                        }
                                    } else {
                                        // if success getting details on ali express
                                        return (
                                            <div>
                                                {/* Recommended Selling Price Card */}
                                                <div className="product-card">
                                                    <div className="product-details">
                                                        <label className="font-roboto-light" style={{ fontSize: '1em' }}>Recommended Selling Price</label>
                                                        <hr style={{ position: 'absolute', left: 0, right: 0, border: '1px solid #ecf0ee' }} /> <br /> <br />
                                                        {this.state.aliExpressProductDetails.length != 0 ?
                                                            <label className="font-roboto-bold" style={{ fontSize: '2em' }}>{'$' + (this.nearest(this.aliExpressVariantPrice(this.state.aliExpressProductDetails.variants)))}</label>
                                                            :
                                                            <Loading width={50} height={50} />
                                                        }
                                                    </div>
                                                </div>

                                                {/* Aliexpress Price Card */}
                                                <div className="product-card">
                                                    <div className="product-details">
                                                        <label className="font-roboto-light" style={{ fontSize: '1em' }}>AliExpress Price</label>
                                                        <hr style={{ position: 'absolute', left: 0, right: 0, border: '1px solid #ecf0ee' }} /> <br /> <br />
                                                        {this.state.aliExpressProductDetails.length != 0 ?
                                                            <label className="font-roboto-bold" style={{ fontSize: '2em', color: '#c53733' }}>{'$' + (this.aliExpressVariantPrice(this.state.aliExpressProductDetails.variants))}</label>
                                                            :
                                                            <Loading width={50} height={50} />
                                                        }
                                                    </div>
                                                </div>

                                                {/* Profit Margin Card */}
                                                <div className="product-card">
                                                    <div className="product-details">
                                                        <label className="font-roboto-light" style={{ fontSize: '1em' }}>Profit Margin</label>
                                                        <hr style={{ position: 'absolute', left: 0, right: 0, border: '1px solid #ecf0ee' }} /> <br /> <br />
                                                        {this.state.aliExpressProductDetails.length != 0 ?
                                                            <label className="font-roboto-bold" style={{ fontSize: '2em', color: '#26c784' }}>{'$' + (this.nearest(this.aliExpressVariantPrice(this.state.aliExpressProductDetails.variants)) - this.aliExpressVariantPrice(this.state.aliExpressProductDetails.variants)).toFixed(2)}</label>
                                                            :
                                                            <Loading width={50} height={50} />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })()}

                                {/* Metafields */}
                                <div className="product-card">
                                    <div style={{ padding: 15, borderBottom: '1px solid #ecf0ee', cursor: 'pointer' }} onClick={() => this.setState({ toggleCO: !state.toggleCO })}>
                                        <label className="font-roboto-bold capitalize" style={{ fontSize: '1em' }}>CAMPAIGN OBJECTIVE</label>
                                        <span className={"clickable float-right fas " + (state.toggleCO ? "fa-caret-up" : "fa-caret-down")} />
                                    </div>
                                    {state.toggleCO &&
                                        <div style={{ padding: 15, backgroundColor: '#e6eae9' }}>
                                            <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>
                                                {(() => {
                                                    if (metafields["1_Campaign_Objective"]) {
                                                        if (this.isNotFreeUser(data.product.tags)) {
                                                            return <span id="1_Campaign_Objective">Please refer to <Link to="/training-videos/5c5055b79cf8d65de06e3a2d">this video</Link></span>
                                                        } else {
                                                            return this.getRemainingDays();
                                                        }
                                                    } else {
                                                        return "Not Available";
                                                    }
                                                })()}
                                            </label>
                                        </div>
                                    }
                                    <div style={{ padding: 15, borderBottom: '1px solid #ecf0ee', cursor: 'pointer' }} onClick={() => this.setState({ toggleGEO: !state.toggleGEO })}>
                                        <label className="font-roboto-bold" style={{ fontSize: '1em' }}>GEOGRAPHY</label>
                                        <span className={"clickable float-right fas " + (state.toggleGEO ? "fa-caret-up" : "fa-caret-down")} />
                                    </div>
                                    {state.toggleGEO &&
                                        <div style={{ padding: 15, backgroundColor: '#e6eae9' }}>
                                            <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>
                                                {(() => {
                                                    if (!this.isNotFreeUser(data.product.tags)) {
                                                        return this.getRemainingDays();
                                                    } else if (metafields["2_Geography"]) {
                                                        if (metafields["2_Geography"].includes("https://docs.google.com/document/d/1JM4wtxkhMiDewHBCcrn6bYjGiLv-uBj-t9gBRkdVSQ0/edit?fbclid=IwAR3LicsK4erdqtcelGROfrLQC-muGwLTwHQPp6Wwd-IRf0eHvVndn5fHfIg%22")) {
                                                            let geography = metafields["2_Geography"].trim();
                                                            geography = geography.replace(`<a href="https://docs.google.com/document/d/1JM4wtxkhMiDewHBCcrn6bYjGiLv-uBj-t9gBRkdVSQ0/edit?fbclid=IwAR3LicsK4erdqtcelGROfrLQC-muGwLTwHQPp6Wwd-IRf0eHvVndn5fHfIg%22"> click here\n</a>`, "<i class='click-here'>Click Here</i>");
                                                            let countryList = "";
                                                            points.ePacket_List.map((country, i) => {
                                                                countryList += "<div class='column column_6_12' style='padding: 5px 5px'>" + country + "</div>";
                                                            })
                                                            return (
                                                                <Popup
                                                                    trigger={<span id="2_Geography" dangerouslySetInnerHTML={{ __html: geography }} style={{ cursor: 'pointer' }}></span>}
                                                                    position="bottom right"
                                                                    on="click" className="points-tooltip">
                                                                    <div className="column column_12_12" dangerouslySetInnerHTML={{ __html: countryList }}></div>
                                                                </Popup>
                                                            );
                                                        } else {
                                                            return <span id="2_Geography" dangerouslySetInnerHTML={{ __html: metafields["2_Geography"] }}></span>
                                                        }
                                                    } else {
                                                        return "Not Available";
                                                    }
                                                })()}
                                            </label>
                                        </div>
                                    }
                                    <div style={{ padding: 15, borderBottom: '1px solid #ecf0ee', cursor: 'pointer' }} onClick={() => this.setState({ toggleDEMO: !state.toggleDEMO })}>
                                        <label className="font-roboto-bold" style={{ fontSize: '1em' }}>DEMOGRAPHICS</label>
                                        <span className={"clickable float-right fas " + (state.toggleDEMO ? "fa-caret-up" : "fa-caret-down")} />
                                    </div>
                                    {state.toggleDEMO &&
                                        <div style={{ padding: 15, backgroundColor: '#e6eae9' }}>
                                            <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>
                                                {(() => {
                                                    if (!this.isNotFreeUser(data.product.tags)) {
                                                        return this.getRemainingDays();
                                                    } else if (metafields["3_Demographics_Age"] || metafields["4_Demographics_Gender"]) {
                                                        return (
                                                            <div>
                                                                {metafields["3_Demographics_Age"] && <span id="3_Demographics_Age" dangerouslySetInnerHTML={{ __html: metafields["3_Demographics_Age"] + "<br/>" }}></span>}
                                                                {metafields["4_Demographics_Gender"] && <span id="4_Demographics_Gender" dangerouslySetInnerHTML={{ __html: "Gender: " + metafields["4_Demographics_Gender"] }}></span>}
                                                            </div>
                                                        );
                                                    } else {
                                                        return "Not Available";
                                                    }
                                                })()}
                                            </label>
                                        </div>
                                    }
                                    <div style={{ padding: 15, borderBottom: '1px solid #ecf0ee', cursor: 'pointer' }} onClick={() => this.setState({ toggleINBE: !state.toggleINBE })}>
                                        <label className="font-roboto-bold" style={{ fontSize: '1em' }}>INTERESTS + BEHAVIOR</label>
                                        <span className={"clickable float-right fas " + (state.toggleINBE ? "fa-caret-up" : "fa-caret-down")} />
                                    </div>
                                    {state.toggleINBE &&
                                        <div style={{ padding: 15, backgroundColor: '#e6eae9' }}>
                                            <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>
                                                {(() => {
                                                    if (!this.isNotFreeUser(data.product.tags)) {
                                                        return this.getRemainingDays();
                                                    } else if (metafields["5_Interests"] || metafields["6_Behavior"]) {
                                                        return (
                                                            <div>
                                                                {metafields["5_Interests"] && <span id="3_Demographics_Age" dangerouslySetInnerHTML={{ __html: metafields["5_Interests"] + "<br/>" }}></span>}
                                                                {metafields["6_Behavior"] && <span id="4_Demographics_Gender" dangerouslySetInnerHTML={{ __html: "Gender: " + metafields["6_Behavior"] }}></span>}
                                                            </div>
                                                        );
                                                    } else {
                                                        return "Not Available";
                                                    }
                                                })()}
                                            </label>
                                        </div>
                                    }
                                </div>

                                {/* Buttons */}
                                {!data.product.tags.includes("cpa_offers") &&
                                    <button className="stretch-width btn-success" disabled={this.state.disabledPushBtn} onClick={this.pushToStore.bind(this)}>PUSH TO SHOPIFY</button>
                                }
                                {!data.product.tags.includes("cpa_offers") &&
                                    <button className="stretch-width btn-success" style={{ marginTop: 10 }} disabled={this.state.disabledPushHQBtn} onClick={this.pushToCommerceHQ.bind(this)}>PUSH TO COMMERCE HQ</button>
                                }
                                {data.product.tags.includes("cpa_offers") ?
                                    <button className="btn-success stretch-width" style={{ marginTop: 10 }} onClick={() => this.togglePushToFunnel()} disabled={this.state.disabledPushBtn}>PUSH TO FUNNEL</button>
                                    : void 0}
                                {data.product.tags.includes("push_to_funnel") ?
                                    <button className="btn-success stretch-width" style={{ marginTop: 10 }} onClick={() => this.togglePushToFunnel()} disabled={this.state.disabledPushBtn || (data.product.tags.includes("out_of_stock") ? true : false)}>CREATE FUNNEL</button>
                                    : void 0}
                                {!data.product.tags.includes("cpa_offers") &&
                                    <button className="stretch-width btn-warning" style={{ marginTop: 10 }} disabled={data.product.tags.includes("us_warehouse") ? true : this.state.disabledBundleBtn} onClick={this.openModal}>PUSH WITH BUNDLES</button>
                                }

                                {/* Divider */}
                                <hr style={{ border: '1px solid #ecf0ee' }} /> <br />

                                {/* Available Info */}
                                {(() => {
                                    if (this.isNotFreeUser(data.product.tags)) {
                                        var available_info = `
                                            <li style="margin-bottom: 10px">
                                                <h4 class="title">Available Info</h4>
                                            </li>
                                        `;
                                        if (metafields["8_Vendor_Link"] && metafields["8_Vendor_Link"] != "#" && !data.product.tags.includes("cod")) {
                                            available_info += `
                                                <li style="display: flex; align-items: center; margin-bottom: 5px;">
                                                    <i>${alilogo}</i>
                                                    <a style="margin-left: 5px;" href="${metafields["8_Vendor_Link"]}" id="vendor_link" target="_blank">
                                                        Vendor Link
                                                    </a>
                                                </li>
                                            `;
                                        }
                                        if (metafields["9_Video_Link"] && metafields["9_Video_Link"] != "#") {
                                            available_info += `
                                                <li style="display: flex; align-items: center; margin-bottom: 5px;">
                                                    <i class="fab fa-youtube" style="color: #3b5998; margin-left: 2px;"></i>
                                                    <a style="margin-left: 6px;" href="${metafields["9_Video_Link"]}" target="_blank">
                                                        FB Video
                                                    </a>
                                                </li>
                                            `;
                                        }
                                        if (metafields["H_New_Video"] && metafields["H_New_Video"] != "#") {
                                            available_info += `
                                                <li style="display: flex; align-items: center; margin-bottom: 5px;">
                                                    <i class="fab fa-youtube" style="color: #ff0000; margin-left: 2px;"></i>
                                                    <a style="margin-left: 6px;" href="${metafields["H_New_Video"]}" target="_blank">
                                                        PLG Video
                                                    </a>
                                                </li>
                                            `;
                                        }
                                        if (metafields["0_Generic_Title"] && metafields["0_Generic_Title"] != "#") {
                                            available_info += `
                                                <li style="display: flex; align-items: center;">
                                                    <i class="fab fa-facebook" style="color: #3b5998; margin-left: 4px;"></i>
                                                    <a style="margin-left: 7px;" href="https://www.facebook.com/search/videos/?q=${metafields["0_Generic_Title"]}&filters_rp_creation_time=%7B%22name%22%3A%22creation_time%22%2C%22args%22%3A%22%7B%5C%22start_year%5C%22%3A%5C%222018%5C%22%2C%5C%22start_month%5C%22%3A%5C%222018-01%5C%22%2C%5C%22end_year%5C%22%3A%5C%222018%5C%22%2C%5C%22end_month%5C%22%3A%5C%222018-12%5C%22%7D%22%7D" target="_blank">
                                                        FB Similar Ads
                                                    </a>
                                                </li>
                                            `;
                                        }
                                        var product_description = data.product.body_html;
                                        var firstImage = product_description.match(/<img[^>]+>/);
                                        if (firstImage) {
                                            firstImage = firstImage.toString();
                                            if (!firstImage.match(/src=\".*?\?/)) {
                                                firstImage = firstImage.replace("\">", "\?\">")
                                            }
                                            available_info += `
                                                <li style="display: flex; align-items: center;">
                                                    <i class="fas fa-image" style="color: #3b5998; margin-left: 4px;"></i>
                                                    <a style="margin-left: 7px;" href="${"https:" + firstImage.match(/src=\".*?\?/).toString().replace("src=\"", "").replace("https:", "")}" target="_blank">
                                                        Video Thumbnail
                                                    </a>
                                                </li>
                                            `;
                                        }
                                        if (metafields["J_Instagram_Video"] && metafields["J_Instagram_Video"] != "#") {
                                            // if no metafields found on those available info
                                            available_info += `
                                                <li style="display: flex; align-items: center; margin-bottom: 5px;">
                                                    <i class="fab fa-instagram" style="color: red; margin-left: 4px; background: -webkit-linear-gradient(purple, pink, blue, orange, red, yellow); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"></i>
                                                    <a style="margin-left: 6px;" href="${metafields["J_Instagram_Video"]}" target="_blank">
                                                        Instagram Video
                                                    </a>
                                                </li>
                                            `;
                                        }
                                        if (metafields["K_Snapchat_Video"] && metafields["K_Snapchat_Video"] != "#") {
                                            // if no metafields found on those available info
                                            available_info += `
                                                <li style="display: flex; align-items: center; margin-bottom: 5px;">
                                                    <i class="fab fa-snapchat-square" style="color: #fffc01; margin-left: 4px; text-shadow: 0px 0px 2px #272634;"></i>
                                                    <a style="margin-left: 6px;" href="${metafields["K_Snapchat_Video"]}" target="_blank">
                                                        Snapchat Video
                                                    </a>
                                                </li>
                                            `;
                                        }
                                        if (!metafields["8_Vendor_Link"] && !metafields["9_Video_Link"] && !metafields["H_New_Video"] && !metafields["0_Generic_Title"] && !firstImage && !metafields["J_Instagram_Video"] && !metafields["K_Snapchat_Video"]) {
                                            // if no metafields found on those available info
                                            available_info += `
                                                <li style="display: flex; align-items: center;">
                                                    <label class="font-roboto-light" style="font-size: 1em">No Available info to show</label>
                                                </li>
                                            `;
                                        }
                                        return <ul dangerouslySetInnerHTML={{ __html: available_info }} />;
                                    }
                                    return this.getRemainingDays();
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Modal for push with bundle */}
                    {state.open &&
                        <ModalWithBundle open={state.open} toggleDisabled={this.toggleBundleDisable} closeModal={this.closeModal} variant_map={Object.keys(metafields).length != 0 ? metafields["G_Product_Mapping"] ? JSON.parse(JSON.parse(metafields["G_Product_Mapping"])) : '' : ''} price={this.state.aliExpressProductDetailsError == false ? this.nearest(this.aliExpressVariantPrice(this.state.aliExpressProductDetails.variants)) : data.product.variants[0].price} productHandle={this.state.handle} session={this.props.session} refetch={this.props.refetch} />
                    }

                    {/* Modal for read more product details */}
                    {state.readmore &&
                        <Modal open={state.readmore} closeModal={() => this.setState({ readmore: false })} session={this.props.session}>
                            <div className="center-vertical-parent">
                                <div className="form_wrap center-vertical">
                                    {(() => {
                                        var product_description = data.product.body_html;
                                        if (product_description.match(/<img[^>]+>/)) {
                                            var firstImage = product_description.match(/<img[^>]+>/).toString();
                                            var modifiedImage = product_description.match(/<img[^>]+>/).toString().replace(">", "") + " style='display: none'>";
                                            product_description = product_description.replace(firstImage, modifiedImage)
                                        }
                                        return <div dangerouslySetInnerHTML={{ __html: product_description }} />
                                    })()}
                                </div>
                            </div>
                        </Modal>
                    }

                    {/* Modal for ADMIN PRODUCT META FIELDS */}
                    {state.openProductModal && <Modal open={state.openProductModal} closeModal={() => this.openProductToggle()} session={this.props.session} style={{ width: '90%', borderRadius: 10, borderTop: '5px solid #23c78a' }}>
                        <div className="column_12_12">
                            <style dangerouslySetInnerHTML={{ __html: `.popup-content .content { padding: 0px; }` }} />
                            <div className="clear" style={{ padding: 20, backgroundColor: '#f2f9f6', overflow: 'hidden' }}>
                                <h4 className="header">Product Details</h4>
                            </div>
                        </div>
                        <div className="center-vertical-parent">
                            <div className="column column_12_12">
                                <div className="page-container">
                                    <div className="column column_6_12">
                                        <input type="text" name="productid" defaultValue={state.productIdHolder} placeholder="Paste Shopify Product ID Here." />
                                    </div>
                                    <div className="column column_3_12">
                                        <button className="btn-success stretch-width" onClick={() => {
                                            window.open(`https://dailyproductplacement.myshopify.com/admin/products/${state.productIdHolder}`, "_blank");
                                        }}>EDIT ON SHOPIFY</button>
                                    </div>
                                    <span className="row-separator clear" />
                                    {/* Metafields */}
                                    <div id="metafields">
                                        <div className="row-separator column column_3_12">
                                            <label>Generic Title</label>
                                            <input type="text" name="0_Generic_Title" placeholder="0_Generic_Title" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Campaign Objective</label>
                                            <input type="text" name="1_Campaign_Objective" placeholder="1_Campaign_Objective" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Geography</label>
                                            <input type="text" name="2_Geography" placeholder="2_Geography" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Demographics Age</label>
                                            <input type="text" name="3_Demographics_Age" placeholder="3_Demographics_Age" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Demographics Gender</label>
                                            <input type="text" name="4_Demographics_Gender" placeholder="4_Demographics_Gender" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Interests</label>
                                            <textarea className="message-area stretch-width" name="5_Interests" placeholder="5_Interests" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Behavior</label>
                                            <input type="text" name="6_Behavior" placeholder="6_Behavior" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Ad Copy Text</label>
                                            <textarea className="message-area stretch-width" name="7_Ad_Copy_Text" placeholder="7_Ad_Copy_Text" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Vendor Link</label>
                                            <input type="text" name="8_Vendor_Link" placeholder="8_Vendor_Link" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Video Link</label>
                                            <input type="text" name="9_Video_Link" placeholder="9_Video_Link" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>New Video</label>
                                            <input type="text" name="H_New_Video" placeholder="H_New_Video" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Google Headline</label>
                                            <input type="text" name="A_Google_Headline" placeholder="A_Google_Headline" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Google Headline 2</label>
                                            <input type="text" name="B_Google_Headline2" placeholder="B_Google_Headline2" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Google Description</label>
                                            <input type="text" name="C_Google_Description" placeholder="C_Google_Description" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Google Keywords</label>
                                            <input type="text" name="D_Google_Keywords" placeholder="D_Google_Keywords" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>JSON Info</label>
                                            <input type="text" name="E_JSON_info" placeholder="E_JSON_info" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Product Reviews</label>
                                            <input type="text" name="F_Product_Reviews" placeholder="F_Product_Reviews" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Product Mapping</label>
                                            <input type="text" name="G_Product_Mapping" placeholder="G_Product_Mapping" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Template Funnel</label>
                                            <input type="text" name="I_Template_Funnel" placeholder="I_Template_Funnel" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Instagram Video</label>
                                            <input type="text" name="J_Instagram_Video" placeholder="J_Instagram_Video" style={{ marginTop: 10 }} />
                                        </div>
                                        <div className="row-separator column column_3_12">
                                            <label>Snapchat video</label>
                                            <input type="text" name="K_Snapchat_Video" placeholder="K_Snapchat_Video" style={{ marginTop: 10 }} />
                                        </div>
                                        {/* Button */}
                                        <span className="clear" />
                                        <div className="row-separator column column_4_12">&nbsp;</div>
                                        <div className="row-separator column column_4_12">
                                            <button className="btn-success stretch-width" onClick={() => this.saveMetafields()}>SAVE</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Modal>}

                    {state.pushToFunnel &&
                        <Modal open={state.pushToFunnel} closeModal={() => this.togglePushToFunnel()} session={this.props.session} style={{ width: '30%', padding: 10, borderRadius: 10, borderTop: '5px solid #23c78a' }}>
                            <div className="center-vertical-parent">
                                <div className="column column_12_12 form_wrap center-vertical">
                                    <div className="form_row text-center">
                                        <img src="/assets/graphics/funnel-icon.png" style={{ maxWidth: '100px' }} />
                                        <h4 className="header" style={{ marginTop: 10 }}>PUSH TO FUNNEL</h4>
                                    </div>
                                    <div className="form_row stretch-width" style={{ marginTop: 10, position: 'relative' }}>
                                        <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>
                                            Domain <span className="require-sign-color">*</span>
                                        </label>
                                        {(() => {
                                            var options = currentUser.funnel_genie_domains.map((domain, index) => {
                                                return <option key={index} value={domain}>{domain}</option>
                                            })
                                            return <SelectTag name="ptfDomainIndex" value={state.ptfDomainIndex} options={options} onChange={event => this.setState({ ptfDomainIndex: event.target.value })} style={{ marginTop: 10 }} />
                                        })()}
                                    </div>
                                    <div className="form_row clear">
                                        <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>
                                            Funnel Name <span className="require-sign-color">*</span>
                                        </label>
                                        <input type="text" className="font-roboto-light" value={state.ptfFunnelName} placeholder="Ex. Funnel Genie" onChange={event => this.setState({ ptfFunnelName: event.target.value })} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                    {/* {data.product.tags.includes("cod") &&
                                        <div className="product-card" style={{ padding: 10, width: '100%' }}>
                                            <div className="display-inline">
                                                <input type="checkbox" checked={state.fulfillByPLG} id="fulfill_by_plg" onChange={event => this.setState({ fulfillByPLG: event.target.checked })} style={{ width: 'fit-content' }} />
                                                <label className="cursor-pointer" htmlFor="fulfill_by_plg" style={{ marginLeft: 10 }}>
                                                    Fulfill with PLG
                                                    <span className="color-orange" style={{ display: 'block' }}>Can be only fulfilled with specified country</span>
                                                </label>
                                            </div>
                                        </div>
                                    } */}
                                    {data.product.tags.includes("cpa_offers") &&
                                        <div className="form_row clear">
                                            <label className="font-questrial-light" style={{ fontSize: '0.875em' }}>
                                                Offer Link <span className="require-sign-color">*</span>
                                            </label>
                                            <input type="text" className="font-roboto-light" value={state.ptfOfferLink} placeholder="Put your offer link here" onChange={event => this.setState({ ptfOfferLink: event.target.value })} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                        </div>
                                    }
                                    <Mutation
                                        mutation={SAVE_PUSH_TO_FUNNEL_LIST}
                                        variables={{
                                            creator: currentUser.id,
                                            domain_name: state.ptfDomainIndex,
                                            funnel_name: points.encodeDomain(state.ptfFunnelName),
                                            funnel_templates: this.state.metafields["I_Template_Funnel"],
                                            is_cod: data.product.tags.includes("cod"),
                                            is_not_shareable: data.product.tags.includes("cod_arabicfunnel"),
                                            is_fulfill_by_plg: state.fulfillByPLG
                                        }}>
                                        {(pushToFunnelList, { data, loading, error }) => {
                                            return (
                                                <ButtonWithPopup data={{
                                                    triggerDOM: <button id="push_button" className="btn-success stretch-width" style={{ marginTop: 10 }} disabled={loading}>PUSH TO FUNNEL</button>,
                                                    popupPosition: "top center",
                                                    text: <label style={{ fontSize: '1.2em' }}>Are you sure?</label>,
                                                    action: () => points.executeMutation(pushToFunnelList, toastr, result => {
                                                        this.togglePushToFunnel();
                                                        toastr.options.onclick = () => {
                                                            this.props.history.push('/funnel-genie-pages-list/' + result.pushToFunnelList.id);
                                                        }
                                                        points.toastrPrompt(toastr, "success", "Product successfully pushed to funnel. Click here to edit", "Success");
                                                    }, "Creating your funnel please wait...", "Granting your wish"),
                                                    triggerID: "push_button",
                                                    loading: loading,
                                                    padding: 10,
                                                    style: { minWidth: 200, width: 200 }
                                                }} />
                                            );
                                            return <button className="btn-success stretch-width" style={{ marginTop: 10 }} onClick={() => {
                                                points.executeMutation(pushToFunnelList, toastr, result => {
                                                    this.togglePushToFunnel();
                                                    toastr.options.onclick = () => {
                                                        this.props.history.push('/funnel-genie-pages-list/' + result.pushToFunnelList.id);
                                                    }
                                                    points.toastrPrompt(toastr, "success", "Product successfully pushed to funnel. Click here to edit", "Success");
                                                }, "Creating your funnel please wait...", "Granting your wish");
                                            }} disabled={loading}>PUSH TO FUNNEL</button>;
                                        }}
                                    </Mutation>
                                </div>
                            </div>
                        </Modal>
                    }
                </div>
            );
        } else {
            // First Load no data yet
            return (
                <div className="text-center" style={{ marginTop: "20rem" }}>
                    <Loading height={200} width={200} />
                </div>
            );
        }
    }
}

export default withAuth(session => session && session.getCurrentUser)(ProductDetails);