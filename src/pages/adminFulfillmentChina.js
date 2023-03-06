import React from 'react';
import webConfig from '../../webConfig';
import withAuth from '../hoc/withAuth';
import toastr from 'toastr';
import Loading from '../components/loading';
import { Helmet } from 'react-helmet';
import { Query, Mutation } from 'react-apollo';
import moment from 'moment';
import Modal from '../components/ModalComponent';
import Popup from 'reactjs-popup';
import { GET_ORDERS_CHINA, GET_ADMIN_ORDERS_CHINA_USERS, DECIDE_ORDER, UPDATE_ORDERS, GET_PAID_ORDER, GET_FULFILLMENT_CENTER_MESSAGE_COUNT, GET_PAYPAL_PAYMENT_LOGS, MARK_ORDER_AS_PAID, SUBMIT_FULFILLMENT_CENTER_MESSAGE,MARK_ORDER_AS_PACKED, REFACTOR_UPDATE_ORDERS, GET_INDIVIDUAL_PAID_ORDER, GET_BULK_QUOTE, GET_ALL_PAID_ORDER } from './../queries';
const points = require('../../Global_Values');
const initializeUserStoreData = {
    store_url: null,
    store_token: null,
    store_location_id: null,
    store_phone: null
}
const selectedInInventory = {
    c_desc: null,
    name: null,
    dg_code: null,
    weight: null,
    height: null,
    width: null,
    length: null,
    price: null,
    quantity: null,
    stockid: null
}

class AdminFulfillmentChina extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "request",
            decision: "",
            isChecked: false,
            allRequestOrder: null,
            refetch: null,
            selectedStoreID: null,
            selectedStoreOwner: "",
            denied_note: "",
            isWeight: '',
            selectedUnit: 'Metric',
            currentPage: 1,
            currentPageLimit: 50,
            totalPaginatedData: 1,

            // logs
            logsID: null,
            logsOwner: null,
            openLogsModal: false,

            // mark as paid
            ...initializeUserStoreData,

            // retrack
            retrackid: null,

            // sort
            sortBy: 'OrderNumber',
            isAsc: true,

            // refactored
            approve_price: null,
            variant_id: null,
            dimension: null,
            totalShippingFee: 0,
            orderList: [],
            orderObject: null,

            openInventoryModal: false,
            ...selectedInInventory,
            virtualWarehouse: []
        }

        this.smoothscroll = this.smoothscroll.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.openInventoryModal = this.openInventoryModal.bind(this)
    }

    componentDidMount(){
        toastr.options = {
            "preventDuplicates": true,
            "progressBar": true,
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut": 3000,
            "extendedTimeOut": 2000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        this.getTotalOrdersCount();
    }

    // to get total page pagination count depending on the selected store and active tab
    getTotalOrdersCount(){
        var id = this.state.selectedStoreID ? this.state.selectedStoreID : "";
        var payload = {"query":"{\n  getChinaOrdersCount(id: \""+id+"\", filter:\""+this.state.activeTab+"\"){\n    count\n  }\n}","variables":null,"operationName":null};
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(ress => {
            var calculate = Math.ceil(ress.data.getChinaOrdersCount.count / this.state.currentPageLimit);
            this.setState({
                totalPaginatedData: calculate
            })
        })
        .catch(err => {
            console.log("adminFulfillmentChina.js", err)
        });
    }

    onTabsToggle(tabs){
        this.setState({
            selectedStoreID: null,
            selectedStoreOwner: "",
            activeTab: tabs
        }, () => {
            this.getTotalOrdersCount();
        })
    }

    handleInputChange(event){
        var value = event.target.value;
        var name = event.target.name;
        this.setState({
            [name]: value
        })
    }

    displaySelectedCount(){
        var el = document.getElementById("checkall");
        var totalCheck = 0;
        var arrSelector = document.querySelectorAll("[type='checkbox']");
        arrSelector.forEach(el => {
            if(el.checked){
                totalCheck += 1;
            }
        })
        if(totalCheck != 0){
            el.style.display = "block";
            el.innerText = totalCheck+" Orders Selected"
        } else {
            el.style.display = "none";
        }
    }

    checkAllCheckbox(){
        if(!this.state.isChecked){
            document.querySelectorAll("[type='checkbox']").forEach(el => {
                if(!el.checked){
                    el.click();
                }
            })
            this.displaySelectedCount();
        } else {
            this.removeAllCheckBox();
        }
        this.state.isChecked = !this.state.isChecked
    }

    removeAllCheckBox(){
        document.querySelectorAll("[type='checkbox']").forEach(el => {
            if(el.checked){
                el.click();
            }
        })
    }

    approveSelected(){
        if(document.querySelectorAll("[type='checkbox']").length != 0){
            document.querySelectorAll("[type='checkbox']").forEach(el => {
                if(el.checked){
                    el.parentNode.parentNode.querySelector("button").click()
                }
            })
            this.removeAllCheckBox();
        } else {
            toastr.clear();
            toastr.warning("Check atleast 1 or more to approve order!","");
        }
    }

    printPDF(tracking_number){
        fetch('/getPDF/'+tracking_number)
        .then(ress => ress.blob())
        .then(ress => {
            toastr.options.timeOut = 3000;
            toastr.options.extendedTimeOut = 2000;
            toastr.clear();
            var fileUrl = URL.createObjectURL(ress);
            window.open(fileUrl)
        });
    }

    getOrderObject(order_id, callback){
        if(!callback){
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.clear();
            toastr.info("Loading Please wait...","");
        }
        var payloadForGettingOrderObject = {"query":"{\n getOrderObject(id: \""+order_id+"\"){\n shipment_id\n tracking_number\n }\n}","variables":null,"operationName":null}
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payloadForGettingOrderObject)
        })
        .then(res => res.json())
        .then(result => {
            if(!result.data.getOrderObject){
                toastr.clear();
                toastr.warning("Please click ReTrack button.","Tracking Number is Not Available");
                this.setState({
                    retrackid: order_id
                })
            } else {
                if(!callback){
                    if(result.data.getOrderObject.tracking_number && result.data.getOrderObject.tracking_number != "N/A"){
                        this.printPDF(result.data.getOrderObject.tracking_number)
                    } else {
                        toastr.clear();
                        toastr.warning("Please click ReTrack button.","Tracking Number is Not Available");
                        this.setState({
                            retrackid: order_id
                        })
                    }
                } else {
                    callback(result.data.getOrderObject.tracking_number)
                }
            }
        });
    }

    addTrackingNumber(paidId, orderId, orderObject, trackingNumber, store_url, store_token, store_location_id, refetch, line_items, order_id){
        toastr.clear();
        toastr.info("Loading Please wait...","");
        var aliComment = [];
        if(orderObject){
            var orderData = JSON.parse(orderObject.orders)
            orderData.line_items.forEach(li => {
                aliComment.push({
                    line_item_id: li.id,
                    location_Id: store_location_id,
                    order_Id: orderData.id
                })
            })
        } else {
            line_items.forEach(li => {
                aliComment.push({
                    line_item_id: li.line_item_id,
                    location_Id: store_location_id,
                    order_Id: order_id
                })
            })
        }

        var fulfillPayload = [{
            store_token: store_token,
            store_name: store_url,
            aliTrackingNum: trackingNumber,
            aliComment: aliComment
        }];
        
        fetch(points.apiServer+'/fulfillment/ali', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fulfillPayload)
        })
        .then(ress => {
            console.log(ress);
        });

        var shipment = {
            labels: [{
                shipment_id: 0,
                tracking_number: trackingNumber
            }]
        }
        
        this.updateOrderObject(paidId, orderId, shipment, refetch);
    }

    checkAddress(orderObj){
        var order = JSON.parse(orderObj.orders);
        var fullAddress = order.shipping_address.address1 + " " + order.shipping_address.address2;
        if(fullAddress.length <= 40){
            order.shipping_address.address1 = fullAddress.trim();
            order.shipping_address.address2 = "";
        }
        orderObj.orders = JSON.stringify(order);
        return orderObj;
    }

    checkForSensitiveWord(country, str){
        // get only words from string discard symbol etc.
        str = str.replace(/\W/g, ' ');
        points.sensitiveWords.forEach(el => {
            var regex = new RegExp("\\b"+el.sensitiveWord.toLowerCase()+"\\b","g");
            if(el.country.toLowerCase() == country.toLowerCase()){
                if(str.toLowerCase().includes(el.sensitiveWord.toLowerCase())){
                    // the process is make the str variable to lowercase and the el.sensitivewords too
                    // so it match the replace function and remove the sensitive word
                    // and the last replace is for making the str to capitalize.
                    str = str.toLowerCase().replace(regex, "").replace(/(^|\s)\S/g, l => l.toUpperCase())
                }
            } else {
                if(str.toLowerCase().includes(el.sensitiveWord.toLowerCase())){
                    str = str.toLowerCase().replace(regex, "").replace(/(^|\s)\S/g, l => l.toUpperCase())
                }
            }
        })
        // remove multiple spaces and trim the string
        return str.replace(/ {1,}/g," ").trim();
    }

    checkShippingAddress(add){
        add.address1 = (add.address1+" "+add.address2).replace(/\bnull\b/g,"").trim();
        if(add.address1.length > 30){
            var str = add.address1;
            var n = str.lastIndexOf(" ", str.length/2);
            var add1 = str.slice(0, n);
            var add2 = str.slice(n, str.length);
            add.address1 = add1.trim();
            add.address2 = add2.trim();
        }
        return add;
    }

    getTrackingNumber(paidObject, refetch, ids){
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.clear();
        toastr.info("Getting Tracking Number","Please wait!");
        var self = this;

        if(!paidObject){
            self.state.orderList.filter(data =>  ids.includes(data.id)).forEach((orderObject, index) => {
                var shippingAddress = this.checkShippingAddress(JSON.parse(JSON.stringify(orderObject.shipping_information)));
                var totalGrams = 0;
                var line_items = [];
                var totalHeight = 0, totalLength = 0, totalWidth = 0;
                var content = "";
                var variants = "";
                orderObject.line_items.forEach(li => {
                    totalGrams += li.weight;
                    var title = this.checkForSensitiveWord(shippingAddress.country_code, li.product_name);
                    if (li.height && totalHeight < li.height) {
                        totalHeight = parseFloat(li.height);
                    }
                    if (li.width && totalWidth < li.width) {
                        totalWidth = parseFloat(li.width);
                    }
                    if (li.length) {
                        totalLength += parseFloat(li.length);
                    }
                    content += li.quantity + " " + title + ", ";
                    variants += li.variant_name ? li.variant_name.replace(/\W/g, ' ').replace(/ {1,}/g, " ").trim() + ", " : "";
                    line_items.push(
                        {
                            "coo": "CN",
                            "currency": "USD",
                            "description": title.substring(0, 64),
                            "dg_code": li.dg_code ? li.dg_code : null,
                            "hts_code": null,
                            "origin_description": li.chinese_description ? li.chinese_description : "不适用",
                            "quantity": parseInt(li.quantity),
                            "weight": parseInt(li.weight == 0 ? 1 : li.weight) / 1000,
                            "value": li.original_price ? li.original_price == 0 ? 1 : li.original_price : li.approve_price == 0 ? 1 : li.approve_price
                        }
                    )
                });
                var zipCode = shippingAddress.zip;
                if(zipCode){
                    if(shippingAddress.country_code.toUpperCase() == "US"){
                        zipCode = shippingAddress.zip.substring(0,5);
                    } else {
                        zipCode = shippingAddress.zip.substring(0, 9);
                    }
                }
                var payload = {
                    company: shippingAddress.company && shippingAddress.company.length >= 40 ? shippingAddress.company.substring(0, 37) + "..." : shippingAddress.company,
                    name: shippingAddress.name.substring(0, 39),
                    // phone: shippingAddress.phone ? shippingAddress.phone : self.state.store_phone,
                    phone: shippingAddress.phone ? shippingAddress.phone : "12345678",
                    email: shippingAddress.email ? shippingAddress.email.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) ? shippingAddress.email.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi).toString() : shippingAddress.email : null,
                    address1: shippingAddress.address1,
                    address2: shippingAddress.address2 ? shippingAddress.address2.substring(0, 39) : shippingAddress.address2,
                    city: shippingAddress.city,
                    province_code: shippingAddress.province_code,
                    zip: zipCode,
                    country_code: shippingAddress.country_code,
                    line_items,
                    height: totalHeight ? parseFloat(totalHeight) : null,
                    length: totalLength ? parseFloat(totalLength) : null,
                    width: totalWidth ? parseFloat(totalWidth) : null,
                    weight: totalGrams / 1000,
                    order_number: shippingAddress.order_number,
                    comments: content.substring(0, content.length - 2),
                    variants: variants.substring(0, variants.length - 2),
                    shipping_service: shippingAddress.country_code.toUpperCase() == "US" ? orderObject.shipping_service : "BoxC Post"
                }

                fetch('/create-shipping-label', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(res => res.json())
                .then(res => {
                    // no error
                    if (res && res.labels.length != 0) {
                        // if (index == (self.state.orderList.length - 1)) {
                        //     self.updateOrderObject(self.state.orderObject.id, orderObject.id, res, refetch);
                        // } else {
                        //     self.updateOrderObject(self.state.orderObject.id, orderObject.id, res);
                        // }
                        self.updateOrderObject(self.state.orderObject.id, orderObject.id, res, refetch);

                        // send fulfillment to the store
                        var aliComment = [];
                        orderObject.line_items.forEach(li => {
                            aliComment.push({
                                line_item_id: li.line_item_id,
                                location_Id: self.state.orderObject.store_location_id,
                                order_Id: orderObject.order_id
                            })
                        })
                        var fulfillPayload = [{
                            store_token: self.state.orderObject.store_token,
                            store_name: self.state.orderObject.store_url,
                            aliTrackingNum: res.labels[0].tracking_number,
                            aliComment: aliComment
                        }];

                        fetch(points.apiServer+'/fulfillment/ali', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(fulfillPayload)
                        })
                        .then(ress => {
                            console.log(ress);
                        });
                    } else {
                        toastr.clear();
                        toastr.error("Check console for payload and response","An Error has occured");
                        console.log("Payload:", payload);
                        console.log("Response:", res);
                    }
                });
            });
        } else {
            var orders = JSON.parse(paidObject.orders);
            orders.forEach((orderObject, index) => {
                var product_data = JSON.parse(orderObject.orders);
                var shippingAddress = this.checkShippingAddress(product_data.shipping_address);
                var totalGrams = 0;
                var line_items = [];
                var totalHeight = 0, totalLength = 0, totalWidth = 0;
                var content = "";
                var variants = "";
                product_data.line_items.forEach(li => {
                    totalGrams += li.grams;
                    var title = this.checkForSensitiveWord(shippingAddress.country_code, li.title);
                    if (li.dimension) {
                        if (li.dimension.height && totalHeight < li.dimension.height) {
                            totalHeight = parseFloat(li.dimension.height);
                        }
                        if (li.dimension.width && totalWidth < li.dimension.width) {
                            totalWidth = parseFloat(li.dimension.width);
                        }
                        if (li.dimension.length) {
                            totalLength += parseFloat(li.dimension.length);
                        }
                    }
                    content += li.quantity + " " + title + ", ";
                    variants += li.variant_title ? li.variant_title.replace(/\W/g, ' ').replace(/ {1,}/g, " ").trim() + ", " : "";
                    line_items.push(
                        {
                            "coo": "CN",
                            "currency": "USD",
                            "description": title.substring(0, 64),
                            "dg_code": li.dimension ? li.dimension.dg_code ? li.dimension.dg_code : null : null,
                            "hts_code": null,
                            "origin_description": li.description ? li.description : "不适用",
                            "quantity": parseInt(li.quantity),
                            "weight": parseInt(li.grams == 0 ? 1 : li.grams) / 1000,
                            "value": li.orig_price ? li.orig_price == 0 ? 1 : li.orig_price : li.price == 0 ? 1 : li.price
                        }
                    )
                })
                var zipCode = shippingAddress.zip;
                if(zipCode){
                    if(shippingAddress.country_code.toUpperCase() == "US"){
                        zipCode = shippingAddress.zip.substring(0,5);
                    } else {
                        zipCode = shippingAddress.zip.substring(0, 9);
                    }
                }
                var payload = {
                    company: shippingAddress.company && shippingAddress.company.length >= 40 ? shippingAddress.company.substring(0, 37) + "..." : shippingAddress.company,
                    name: shippingAddress.name.substring(0, 39),
                    // phone: shippingAddress.phone ? shippingAddress.phone : self.state.store_phone,
                    phone: shippingAddress.phone ? shippingAddress.phone : "12345678",
                    email: product_data.email ? product_data.email.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) ? product_data.email.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi).toString() : product_data.email : null,
                    address1: shippingAddress.address1,
                    address2: shippingAddress.address2 ? shippingAddress.address2.substring(0, 39) : shippingAddress.address2,
                    city: shippingAddress.city,
                    province_code: shippingAddress.province_code,
                    zip: zipCode,
                    country_code: shippingAddress.country_code,
                    line_items,
                    height: totalHeight ? parseFloat(totalHeight) : null,
                    length: totalLength ? parseFloat(totalLength) : null,
                    width: totalWidth ? parseFloat(totalWidth) : null,
                    weight: totalGrams / 1000,
                    order_number: product_data.order_number,
                    comments: content.substring(0, content.length - 2),
                    variants: variants.substring(0, variants.length - 2),
                    shipping_service: shippingAddress.country_code.toUpperCase() == "US" ? product_data.shipping_fee.service : "BoxC Post"
                }

                fetch('/create-shipping-label', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(res => res.json())
                .then(res => {
                    // no error
                    if (res && res.labels.length != 0) {
                        // if (index == (orders.length - 1)) {
                        //     self.updateOrderObject(paidObject.id, orderObject._id, res, refetch);
                        // } else {
                        //     self.updateOrderObject(paidObject.id, orderObject._id, res);
                        // }
                        self.updateOrderObject(paidObject.id, orderObject._id, res, refetch);

                        // send fulfillment to the store
                        var orderData = JSON.parse(orderObject.orders)
                        var aliComment = [];
                        orderData.line_items.forEach(li => {
                            aliComment.push({
                                line_item_id: li.id,
                                location_Id: paidObject.store_location_id,
                                order_Id: orderData.id
                            })
                        })
                        var fulfillPayload = [{
                            store_token: paidObject.store_token,
                            store_name: paidObject.store_url,
                            aliTrackingNum: res.labels[0].tracking_number,
                            aliComment: aliComment
                        }];

                        fetch(points.apiServer+'/fulfillment/ali', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(fulfillPayload)
                        })
                        .then(ress => {
                            console.log(ress);
                        });
                    } else {
                        toastr.clear();
                        toastr.error("Check console for payload and response","An Error has occured");
                        console.log("Payload:", payload);
                        console.log("Response:", res);
                    }
                });
            })
        }
    }

    updateOrderObject(paid_id, order_id, shipment, refetch){
        var shipmentID = shipment.labels.length != 0 ? shipment.labels[0].shipment_id : 0;
        var trackingNumber = shipment.labels.length != 0 ? shipment.labels[0].tracking_number : 'N\/A';
        var payload = {"query":"mutation{\n  printLabelSuccess(id:\""+order_id+"\",shipment_id:"+shipmentID+",tracking_number:\""+trackingNumber+"\", paid_id: \""+paid_id+"\"){\n    id\n  }\n}","variables":null};
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(result => {
            if(refetch){
                toastr.options.timeOut = 3000;
                toastr.options.extendedTimeOut = 2000;
                toastr.clear();
                toastr.success("Successfully Got the tracking number","Success");
                refetch();
            }
            document.getElementById(order_id).style.backgroundColor = "inherit";
        });
    }

    printAllPDFRefactored(min, max){
        var trackingNumber = [];
        this.state.orderList.sort((a,b) => a.shipping_information.order_number > b.shipping_information.order_number ? 1 : -1).forEach(tn => {
            if(tn.tracking_number){
                trackingNumber.push(tn.tracking_number);
            }
        })
        if(trackingNumber.length !=0){
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.clear();
            toastr.info("Preparing the PDF Please wait...","");
            fetch('https://cors-anywhere.herokuapp.com/https://api.boxc.com/v1/labels/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'blob',
                    'Authorization': 'Bearer 664b31fc11dbbbaad076958eb33adcba39ababbb453a2ec8a25eb142d26c6157'
                },
                body: JSON.stringify({labels: trackingNumber.slice(min, max)})
            })
            .then(ress => ress.blob())
            .then(ress => {
                toastr.options.timeOut = 3000;
                toastr.options.extendedTimeOut = 2000;
                toastr.clear();
                var fileUrl = URL.createObjectURL(ress);
                window.open(fileUrl)
            });
        } else {
            toastr.clear();
            toastr.warning("No tracking Number to print.","");
        }
    }

    // printAllPDF(trackingNumbers, min, max){
    printAllPDF(orderData, min, max){
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.clear();
        toastr.info("Getting Data Please wait...","");
        var orders = JSON.parse(orderData.orders)
        var allData = 0;
        var processedData = 0;
        var ORNumAndTracking = [];
        var trackingNumberInOrder = [];
        orders.forEach((data, i) => {
            allData += 1;
            this.getOrderObject(data._id, trackingNumber => {
                var order = JSON.parse(data.orders);
                if(trackingNumber){
                    ORNumAndTracking.push({
                        ORNumber: order.name,
                        trackingNumber
                    })
                }
                processedData += 1;
                if(allData == processedData){
                    ORNumAndTracking = ORNumAndTracking.sort((prev, curr) => curr.ORNumber > prev.ORNumber ? - 1 : 1)
                    ORNumAndTracking.forEach(el => {
                        trackingNumberInOrder.push(el.trackingNumber)
                    })
                    printNOW()
                }
            })
        })

        function printNOW(){
            toastr.clear();
            toastr.info("Preparing the PDF Please wait...","");
            fetch('https://cors-anywhere.herokuapp.com/https://api.boxc.com/v1/labels/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'blob',
                    'Authorization': 'Bearer 664b31fc11dbbbaad076958eb33adcba39ababbb453a2ec8a25eb142d26c6157'
                },
                body: JSON.stringify({labels: trackingNumberInOrder.slice(min, max)})
            })
            .then(ress => ress.blob())
            .then(ress => {
                toastr.options.timeOut = 3000;
                toastr.options.extendedTimeOut = 2000;
                toastr.clear();
                var fileUrl = URL.createObjectURL(ress);
                window.open(fileUrl)
            });
        }
    }

    approveOrder(approveOrder, decision, refetch, event){
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.clear();
        toastr.info("Loading Please wait...","");
        this.setState({
            decision
        }, () => {
            if(decision == "denied" && !this.state.denied_note){
                toastr.clear();
                toastr.warning("Denied Note Cannot be empty!","Required!");
            } else {
                approveOrder().then(({ data }) => {
                    setTimeout(function() {
                        toastr.options.timeOut = 3000;
                        toastr.options.extendedTimeOut = 2000;
                        toastr.clear();
                        toastr.success("Request has been moved to "+decision.toUpperCase()+" tab","Success");
                        refetch();
                        // body
                    }, 1000);
                }).catch(error => {
                    console.error("ERR =>", error);
                });
            }
        })
    }

    execUpdate(updateRequestedOrder, refetch, isWeight){
        updateRequestedOrder().then(({ data }) => {
            setTimeout(function() {
                if(refetch){
                    toastr.options.timeOut = 3000;
                    toastr.options.extendedTimeOut = 2000;
                    toastr.clear();
                    toastr.success(isWeight ? "Product Weight has been updated!" : "Product Price has been updated!","Success!");
                    refetch()
                }
            }, 2000);
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    refactorUpdateRequestedOrder(refactorUpdateRequestedOrder, refetch, approve_price, isWeight, variant_id, dimension, qty){
        var state = {
            approve_price: approve_price,
            variant_id: variant_id,
            isWeight: isWeight,
            dimension: dimension,
            shipping_service_index: "BoxC Post",
        };
        if(!isWeight){
            state.approveQuantity = parseInt(qty);
        } else {
            state.shipping_service_index = dimension.shipping_service;
        }
        this.setState(state, () => {
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.clear();
            toastr.info("Loading Please wait...","");
            refactorUpdateRequestedOrder().then(({ data }) => {
                setTimeout(function() {
                    toastr.options.timeOut = 3000;
                    toastr.options.extendedTimeOut = 2000;
                    toastr.clear();
                    toastr.success(isWeight ? "Product Weight has been updated!" : "Product Price has been updated!","Success!");
                    refetch()
                }, 2000);
                this.setState({
                    ...selectedInInventory
                })
            }).catch(error => {
                console.error("ERR =>", error);
            });
        })
    }
    
    updatePrice(updateRequestedOrder, data, refetch, value, isWeight, variant_id, dimension, qty){
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.clear();
        toastr.info("Loading Please wait...","");
        var updatedObject = [];
        data.forEach(order => {
            if(!order.isRefactored){
                var parseData = JSON.parse(order.orders);
                var updateOrder = Object.assign({}, order);
                var temp1 = [];
                parseData.line_items.forEach(li => {
                    if(parseInt(variant_id) == li.variant_id){
                        if(isWeight){
                            li.grams = value
                            li.dimension = {
                                units: 'Metric',
                                height: dimension.height,
                                width: dimension.width,
                                length: dimension.length,
                                dg_code: dimension.dg_code
                            }
                            dimension.chineseDescription ? li.description = dimension.chineseDescription : void 0;
                        } else {
                            li.price = value
                            if(qty){
                                li.quantity = parseInt(qty)
                            }
                        }
                        parseData.edited = true;
                    }
                    temp1.push(li);
                })
                parseData.line_items = temp1;
                updateOrder.orders = JSON.stringify(parseData);
                updatedObject.push(updateOrder);
            }
        })
        var result = updatedObject;
        this.setState({
            allRequestOrder: JSON.stringify(result),
            isWeight,
            shipping_service_index: isWeight ? dimension.shipping_service : null
        }, () => {
            this.execUpdate(updateRequestedOrder, refetch, isWeight)
        })
    }

    toggleModal(){
        this.setState({
            openLogsModal: !this.state.openLogsModal,
        })
    }
    
    openLogsModal(id, name){
        this.setState({
            logsID: id,
            logsOwner: name
        }, () => {
            this.toggleModal();
        })
    }

    displayOrder(id, name, storeData){
        // this.setState({
        //     selectedStoreID: null
        // }, () => {
        //     this.setState({
        //         selectedStoreID: id,
        //         selectedStoreOwner: name
        //     })
        // })
        var saveState = {
            currentPage: 1,
            selectedStoreID: id,
            selectedStoreOwner: name,
            totalShippingFee: 0,
            orderList: [],
            orderObject: null
        }
        if(storeData){
            saveState.store_url = storeData.store_url;
            saveState.store_location_id = storeData.store_location_id;
            saveState.store_token = storeData.store_token;
            saveState.store_phone = storeData.store_phone
        }
        this.setState(saveState, () => {
            this.getTotalOrdersCount();
            this.smoothscroll();
        })
    }

    smoothscroll(){
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(this.smoothscroll);
            window.scrollTo (0,currentScroll - (currentScroll/5));
        }
    }

    changePageNumber(event, isNext){
        if(event){
            this.setState({
                currentPage: parseInt(event.target.innerHTML)
            })
        } else {
            if(isNext || this.state.currentPage != 0){
                this.setState({
                    currentPage: isNext ? this.state.currentPage+1 : this.state.currentPage-1
                })
            }
        }
    }

    pagination(c, m) {
        var current = c,
            last = m,
            delta = 2,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            l;
    
        for (let i = 1; i <= last; i++) {
            if (i == 1 || i == last || i >= left && i < right) {
                range.push(i);
            }
        }
        
        for (let i of range) {
            if (l) {
                if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(<button onClick={event => this.changePageNumber(event)} className={c == i ? "dwobtn pagination-number pagination-number-active" : "dwobtn pagination-number"} key={i}>{i}</button>);
            l = i;
        }
    
        return rangeWithDots;
    }
    
    syncAll(){
        var timeout = 0;
        document.querySelectorAll(".fas.fa-sync").forEach((el,i) => {
            timeout += 500;
            setTimeout(() => {
                toastr.clear();
                toastr.info("Updating: #"+(i+1),"Please wait");
                el.click();
            }, timeout)
        })
    }

    updateOrderLabel(productdata, refetch){
        var reassign = JSON.parse(JSON.stringify(productdata))
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.clear();
        toastr.info("Loading Please wait...","");
        var payloadForGettingOrderObject = {"query":"{\n getOrderObject(id: \""+productdata.order._id+"\"){\n shipment_id\n tracking_number\n }\n}","variables":null,"operationName":null}
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payloadForGettingOrderObject)
        })
        .then(res => res.json())
        .then(result => {
            var object = result.data.getOrderObject;
            if(object.tracking_number){
                console.log("has tracking number just update the shipment label")
                this.fetchGET('/cancelLabel/'+object.tracking_number, res => {
                    var newOrder = JSON.parse(reassign.order.orders);
                    newOrder.line_items.map((order, i) => {
                        if(i == 0){
                            order.grams = productdata.weight;
                            order.dimension = productdata.dimension;
                        } else {
                            order.grams = 0;
                            order.dimension = {
                                height: null,
                                width: null,
                                length: null
                            };
                        }
                        return order;
                    })
                    
                    reassign.order.orders = JSON.stringify(newOrder);
                    reassign.paidOrders.orders = JSON.stringify([reassign.order]);
                    this.getTrackingNumber(reassign.paidOrders, refetch);
                });
            } else {
                console.log("no tracking number so create new label and save the tracking id");
                var newOrder = JSON.parse(reassign.order.orders);
                newOrder.line_items.map((order, i) => {
                    if(i == 0){
                        order.grams = productdata.weight;
                        order.dimension = productdata.dimension;
                    } else {
                        order.grams = 0;
                        order.dimension = {
                            height: null,
                            width: null,
                            length: null
                        };
                    }
                    return order;
                })
                
                reassign.order.orders = JSON.stringify(newOrder);
                reassign.paidOrders.orders = JSON.stringify([reassign.order]);
                this.getTrackingNumber(reassign.paidOrders, refetch);
            }
        });
    }

    fetchGET(url, callback){
        fetch(url)
        .then(res => {
            callback(true)
        })
        .catch(err => {
            callback(false)
        })
    }

    markAsPaid(markAsPaid){
        markAsPaid().then(({ data }) => {
            toastr.clear();
            toastr.success("Orders have been moved to print label tab.","Success!");
            document.getElementById("mark-as-paid").click();
            window.location.reload();
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    sendEmail(event, submitMessage){
        event.target.disabled = true;
        fetch('/approved-quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                approvedCount: this.state.totalApproved,
                email: this.state.email
            })
        })
        .then(res => {
            console.log("Email Sent!.")
            toastr.clear();
            toastr.success("Email Sent!.","Success");
        });


        submitMessage().then(async ({ data }) => {
            console.log("PM Sent!.")
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    exportAllOrder(paidData){
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.clear();
        toastr.info("Loading please wait...","");
        const rows = [
            ["ID", "Order Number", "Quantity", "Price", "Shipping Fee", "Total Price", "Variant", "Product Name", "Dimension", "Tracking Number"]
        ];
        if(paidData.isRefactored){
            this.state.orderList.forEach(order => {
                paidData.order_ids.forEach(oid => {
                    if(oid == order.id){
                        order.line_items.forEach(el => {
                            rows.push([
                                paidData.id,
                                order.shipping_information.order_number.replace("#",""),
                                el.quantity,
                                el.approve_price,
                                order.shipping_cost,
                                ((el.approve_price * el.quantity) + parseFloat(order.shipping_cost)),
                                el.variant_name,
                                el.product_name,
                                `${(el.weight/1000)+" kg"}\u2028${el.width+"cm x "+el.height+"cm x "+el.length+"cm"}\u2028DG code: ${el.dg_code ? el.dg_code : "none"}`,
                                "* "+order.tracking_number+" *"
                            ])
                        });
                    }
                })
            })
            done();
        } else {
            var orders = JSON.parse(paidData.orders);
    
            // get all line items
            var allLineItem = 0;
            var processedData = 0;
            orders.forEach((data, i) => {
                var order = JSON.parse(data.orders);
                order.line_items.forEach(el => {
                    allLineItem += 1;
                    this.getOrderObject(data._id, trackingNumber => {
                        rows.push([
                            paidData.id,
                            order.name.replace("#",""),
                            el.quantity,
                            el.price,
                            order.shipping_fee.shipping_methods[0].total_cost,
                            ((el.price * el.quantity) + order.shipping_fee.shipping_methods[0].total_cost).toFixed(2),
                            el.variant_title,
                            el.title,
                            `${(el.grams/1000)+" kg"}\u2028${el.dimension ? el.dimension.width+"cm x "+el.dimension.height+"cm x "+el.dimension.length+"cm" : "N\/A"}\u2028DG code: ${el.dimension && el.dimension.dg_code ? el.dimension.dg_code : "none"}`,
                            "* "+trackingNumber+" *"
                        ])
                        processedData += 1;
                        if(allLineItem == processedData){
                            done();
                        }
                    })
                })
            })
        }

        function done(){
            // export to csv
            let csvContent = "data:text/csv;charset=utf-8,";
            rows.forEach(function(rowArray){
                let row = rowArray.join(",");
                csvContent += row + "\r\n";
            });
            
            var encodedUri = encodeURI(csvContent);
            var fileName = paidData.store_url+" ("+new Date(parseInt(paidData.date_paid)).toLocaleDateString().replace(/\//g,"-")+").csv";
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", fileName);
            document.body.appendChild(link); // Required for FF
            link.click();
            document.body.removeChild(link);

            toastr.clear();
            toastr.options.timeOut = 3000;
            toastr.options.extendedTimeOut = 2000;
        }
    }

    exportToCSV(paidData){
        var allItem = [];
        const rows = [
            ["ID", "Order Number", "Quantity", "Price", "Shipping Fee", "Total Price", "Variant", "Product Name", "Dimension"]
        ];
        if(paidData.isRefactored){
            this.state.orderList.forEach(order => {
                paidData.order_ids.forEach(oid => {
                    if(oid == order.id){
                        order.line_items.forEach(el => {
                            var dimension = {
                                dg_code: el.dg_code,
                                height: el.height,
                                width: el.width,
                                length: el.length,
                            }
                            allItem.push({
                                id: order.id,
                                order_number: order.shipping_information.order_number.replace("#",""),
                                price: el.approve_price,
                                shipping_cost: order.shipping_cost,
                                total_price: ((el.approve_price * el.quantity) + parseFloat(order.shipping_cost)),
                                variant_id: el.variant_id,
                                variant: el.variant_name,
                                productName: el.product_name,
                                dimension: dimension,
                                grams: el.weight,
                                quantity: el.quantity
                            });
                        })
                    }
                });
            })
        } else {
            var orders = JSON.parse(paidData.orders);
    
            // get all line items
            orders.forEach(data => {
                var order = JSON.parse(data.orders);
                order.line_items.forEach(el => {
                    allItem.push({
                        id: paidData.id,
                        order_number: order.name.replace("#",""),
                        price: el.price,
                        shipping_cost: order.shipping_fee.shipping_methods[0].total_cost,
                        total_price: ((el.price * el.quantity) + order.shipping_fee.shipping_methods[0].total_cost),
                        order_number: order.name.replace("#",""),
                        variant_id: el.variant_id,
                        variant: el.variant_title,
                        productName: el.title,
                        dimension: el.dimension,
                        grams: el.grams,
                        quantity: el.quantity
                    });
                })
            })
        }

        // group by all line items
        const groupByVariantID = points.groupBy('variant_id');
        const result = groupByVariantID(allItem);

        // parse the result
        Object.keys(result).forEach(res => {
            var quantity = 0;
            if(result[res].length == 1){
                // update quantity by the first quantity count
                quantity = result[res][0].quantity
            } else {
                // update quantity by summing all quantity not just the first
                quantity = result[res].reduce((acc, val) => acc.quantity ? acc.quantity + val.quantity : acc + val.quantity)
            }
            rows.push([
                result[res][0].id,
                result[res][0].order_number,
                quantity,
                result[res][0].price,
                result[res][0].shipping_cost,
                result[res][0].total_price.toFixed(2),
                result[res][0].variant,
                result[res][0].productName,
                `${(result[res][0].grams/1000)+" kg"}\u2028${result[res][0].dimension ? result[res][0].dimension.width+"cm x "+result[res][0].dimension.height+"cm x "+result[res][0].dimension.length+"cm" : "N\/A"}\u2028DG code: ${result[res][0].dimension && result[res][0].dimension.dg_code ? result[res][0].dimension.dg_code : "none"}`
            ])
        })
        
        // export to csv
        let csvContent = "data:text/csv;charset=utf-8,";
        rows.forEach(function(rowArray){
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });
        
        var encodedUri = encodeURI(csvContent);
        var fileName = paidData.store_url+" ("+new Date(parseInt(paidData.date_paid)).toLocaleDateString().replace(/\//g,"-")+").csv";
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
    }

    markAsPacked(markAsPacked, refetch){
        markAsPacked().then(({ data }) => {
            console.log("Done Packing this order")
            refetch();
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    checkTrackingIfAvailable(paidObject){
        toastr.clear();
        toastr.info("Loading please wait...","")
        var orders = JSON.parse(paidObject.orders);
        var total = 0;
        var processed = 0;
        var numberOfNoTracking = 0;
        orders.forEach((orderObject, index) => {
            total += 1;
            this.getOrderObject(orderObject._id, trackingNumber => {
                processed += 1;
                if(!trackingNumber || trackingNumber == "N/A"){
                    numberOfNoTracking += 1;
                    document.getElementById(orderObject._id).style.backgroundColor = "#da3a3a";
                } else {
                    document.getElementById(orderObject._id).style.backgroundColor = "inherit";
                }
                if(total == processed){
                    if(numberOfNoTracking != 0){
                        toastr.clear();
                        toastr.success(numberOfNoTracking+" of the order still doesnt have a tracking number.","Found!");
                    } else {
                        toastr.clear();
                        toastr.success("Seems like all order has a tracking number.","All Good!");
                    }
                }
            })
        })
    }

    sortOrderBy(str){
        this.setState({
            sortBy: str
        }, () => {
            this.toggleSort();
        })
    }

    toggleSort(){
        this.setState({
            isAsc: !this.state.isAsc
        })
    }

    refreshOrder(){
        this.refetchOrder.forEach(ref => {
            ref();
        });
    }

    openInventoryModal(selector){
        this.setState({
            openInventoryModal: !this.state.openInventoryModal,
            refreshDOM: selector ? selector : this.state.refreshDOM
        })
    }

    exportAllPaidOrder(orders){
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.clear();
        toastr.info("Loading please wait...","");
        const rows = [
            ["ID", "Order Number", "Quantity", "Price", "Shipping Fee", "Total Price", "Variant", "Product Name", "Dimension", "Tracking Number"]
        ];

        // data processing
        orders = orders.getAllPaidOrder;
        orders.forEach((order, index) => {
            var obj = JSON.parse(JSON.stringify(order));
            var line_items = obj.line_items;
            var shipping_information = obj.shipping_information;
            if(!obj.isRefactored){
                var fixed = this.fixStringifyValue(obj.orders);
                line_items = fixed.line_items;
                shipping_information = fixed.shipping_information;
                obj.shipping_cost = fixed.shipping_cost;
                obj.shipping_days_max = fixed.shipping_days_max;
                obj.shipping_days_min = fixed.shipping_days_min;
                obj.shipping_method = fixed.shipping_method;
            }

            line_items.forEach(li => {
                rows.push([
                    obj.id,
                    shipping_information.order_number.replace("#",""),
                    li.quantity,
                    li.approve_price,
                    obj.shipping_cost,
                    ((li.approve_price * li.quantity) + parseFloat(obj.shipping_cost)).toFixed(2),
                    li.variant_name,
                    li.product_name,
                    `${(li.weight/1000)+" kg"}\u2028${li.width && li.height && li.length ? li.width+"cm x "+li.height+"cm x "+li.length+"cm" : "N\/A"}\u2028DG code: ${li.dg_code ? li.dg_code : "none"}`,
                    "* "+obj.tracking_number+" *"
                ])
            })
        })

        // export to csv
        let csvContent = "data:text/csv;charset=utf-8,";
        rows.forEach(function(rowArray){
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });
        
        var encodedUri = encodeURI(csvContent);
        var fileName = "All Orders.csv";
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);

        toastr.clear();
        toastr.options.timeOut = 3000;
        toastr.options.extendedTimeOut = 2000;
    }

    fixStringifyValue(stringifyData){
        var line_items = [];
        var shipping_information = {};
        
        var parsed = JSON.parse(stringifyData);
        parsed.line_items.forEach(li => {
            line_items.push({
                approve_price: li.price,
                chinese_description: li.description,
                dg_code: li.dimension ? li.dimension.dg_code : null,
                height: li.dimension ? li.dimension.height : null,
                length: li.dimension ? li.dimension.length : null,
                original_price: li.price,
                product_id: li.product_id,
                product_name: li.title,
                quantity: li.quantity,
                variant_id: li.variant_id,
                variant_name: li.variant_title,
                vendor_link: li.vendorLink,
                weight: li.grams,
                width: li.dimension ? li.dimension.width : null
            });
        })

        shipping_information.address1 = parsed.shipping_address.address1
        shipping_information.address2 = parsed.shipping_address.address2
        shipping_information.city = parsed.shipping_address.city
        shipping_information.company = parsed.shipping_address.company
        shipping_information.country = parsed.shipping_address.country
        shipping_information.country_code = parsed.shipping_address.country_code
        shipping_information.email = parsed.email
        shipping_information.name = parsed.shipping_address.name
        shipping_information.order_number = parsed.name
        shipping_information.phone = parsed.shipping_address.phone
        shipping_information.province = parsed.shipping_address.province
        shipping_information.province_code = parsed.shipping_address.province_code
        shipping_information.zip = parsed.shipping_address.zip

        var shipping_cost = parsed.shipping_fee.shipping_methods[0].cost;
        var shipping_days_max = parsed.shipping_fee.transit_max;
        var shipping_days_min = parsed.shipping_fee.transit_min;
        var shipping_method = parsed.shipping_fee.service;

        return {
            line_items,
            shipping_information,
            shipping_cost,
            shipping_days_max,
            shipping_days_min,
            shipping_method
        }
    }

    head() {
        return (
            <Helmet>
                <title>Admin Fulfillment Center - Product List Genie</title>
            </Helmet>
        );
    }
    
    render() {
        const state = this.state;
        const paginationDOM = (
            <div className="china-fulfillment-pagination text-right" style={{position: 'relative'}}>
                <span style={{marginLeft: 20, padding: '5px 10px', border: '1px solid rgb(61, 172, 81)', position: 'absolute', left: 0, display: 'none'}} id="checkall"></span>
                <button className="dwobtn pagination-number" onClick={() => this.changePageNumber(null, false)}><span className="fas fa-arrow-left"></span></button>
                {(() => {
                    // var totalPagination = Math.ceil(this.state.totalOrders / points.item_per_page);
                    return this.pagination(state.currentPage, state.totalPaginatedData);
                })()}
                <button className="dwobtn pagination-number" onClick={() => this.changePageNumber(null, true)}><span className="fas fa-arrow-right"></span></button>
            </div>
        );

        return (
            <div className="admin china-fulfillment page-container">
                {this.head()}
                <div className="float-right" style={{position: 'relative'}}>
                    <Query query={GET_FULFILLMENT_CENTER_MESSAGE_COUNT} >
                        {({ data, loading, refetch, error }) => {
                            if(loading) return null;

                            if(data && data.getCountOfAllMessage.count != 0){
                                return <span style={{fontSize: 12, backgroundColor: 'red', borderRadius: '50%', color: '#fff', fontWeight: 900, padding: '3px 5px', position: 'absolute', top: '-10px', right: 0}}>{data.getCountOfAllMessage.count}</span>
                            } else {
                                return null;
                            }
                        }}
                    </Query>
                    <a href="/admin-messaging-center" className="dwobtn">Messaging Center</a>
                </div>
                <div className="fulfillment-title">
                    <h1>Fulfillment Center</h1>
                </div>
                <div>
                    <div className="column column_12_12">
                        <div className="column column_3_12">
                            <button className={state.activeTab == "request" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("request")}>Request</button>
                        </div>
                        <div className="column column_3_12">
                            <button className={state.activeTab == "approved" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("approved")}>Approved</button>
                        </div>
                        <div className="column column_3_12">
                            <button className={state.activeTab == "denied" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("denied")}>Denied</button>
                        </div>
                        <div className="column column_3_12">
                            <button className={state.activeTab == "print label" ? "stretch-width dwobtn dwobtn-focus" : "stretch-width dwobtn"} onClick={() => this.onTabsToggle("print label")}>Print Label</button>
                        </div>
                    </div>

                    <div className="text-center clear">
                        <br/>
                        <h2 className="capitalize">{state.activeTab} List {state.selectedStoreID ? "of "+state.selectedStoreOwner : void 0}</h2>
                    </div>
                    {(() => {
                        if(state.activeTab == "request"){
                            return (
                                <div>
                                    <div className="column column_3_12">
                                        <div className="product-card">
                                            <div className="product-details" style={{overflow: 'hidden'}}>
                                                <div className="text-center">
                                                    <h3>Stores</h3>
                                                </div>
                                                <Query query={GET_ADMIN_ORDERS_CHINA_USERS} variables={{filter: state.activeTab}}>
                                                    {({ data, loading, refetch, error }) => {
                                                        if(loading) {
                                                            return (
                                                                <div className="text-center">
                                                                    <Loading height={150} width={150} />
                                                                </div>
                                                            );
                                                        }

                                                        if(data.getAdminChinaOrdersUSERS.length != 0){
                                                            return data.getAdminChinaOrdersUSERS.map((user, user_index) => {
                                                                var cn = "product-card";
                                                                if(state.selectedStoreID == user.id){
                                                                    cn += " card-active"
                                                                }
                                                                return (
                                                                    <div className={cn} key={user_index}>
                                                                        <div className="product-details" style={{overflow: 'hidden'}}>
                                                                            <div className="column column_3_12" style={{padding: 0}}>
                                                                                <div style={{backgroundImage: user.profileImage ? 'url('+webConfig.siteURL+'/user-uploads/'+user.profileImage+')' : 'url('+webConfig.siteURL+'/assets/graphics/abstract_patterns/texture.jpg'+')', height: '5rem', borderRadius: '50%',   backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', position: 'relative' }}>
                                                                                    <span style={{fontSize: '12px', backgroundColor: 'red', borderRadius: '50%', color: 'rgb(255, 255, 255)', fontWeight: 900, padding: '3px 5px', position: 'absolute', top: '-10px', right: 0}}>{user.totalRequest}</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="column column_9_12 ellipsis" style={{whiteSpace: 'nowrap'}}>
                                                                                <strong>{user.store_url}</strong> <br/>
                                                                                {user.firstName} {user.lastName} <br/>
                                                                                <div className="float-right" style={{marginTop: 5}}>
                                                                                    <span className="clickable" onClick={() => this.displayOrder(user.id, user.firstName+" "+user.lastName)}>
                                                                                        Details &nbsp;<span className="fas fa-arrow-right"></span>
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            });
                                                        } else {
                                                            return (
                                                                <div className="text-center">
                                                                    <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>No Store Available</span>
                                                                </div>
                                                            );
                                                        }
                                                    }}
                                                </Query>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="column column_9_12">
                                        <div className="text-right form_buttons">
                                            <button className="dwobtn" id="request" style={{margin: 0, fontSize: 15}} onClick={() => this.approveSelected()}>Approve Selected</button>
                                            {paginationDOM}
                                        </div>

                                        <div className="table-container clear">
                                            <br/>
                                            <table className="table-list">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center">#</th>
                                                        <th className="text-center clickable" onClick={() => this.checkAllCheckbox()}>Check All</th>
                                                        <th>Request Date</th>
                                                        <th className="text-center">Order Notes</th>
                                                        <th className="text-center">Order ID</th>
                                                        <th>Shipping Information</th>
                                                        <th width="200px">Products</th>
                                                        <th className="text-center">Variant</th>
                                                        <th className="text-center">Quantity</th>
                                                        <th className="text-center" width="10%">Weight(kg) / Dimension</th>
                                                        <th className="text-center">Shipping Fee</th>
                                                        <th className="text-center" width="10%">Price</th>
                                                        <th className="text-center">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <Query query={GET_ORDERS_CHINA} variables={{
                                                        id: state.selectedStoreID,
                                                        filter: state.activeTab,
                                                        offset: ((state.currentPage-1) * state.currentPageLimit) }} >
                                                        {({ data, loading, refetch, error }) => {
                                                            if(loading) {
                                                                return (
                                                                    <tr>
                                                                        <td colSpan="13" className="text-center">
                                                                            <Loading height={200} width={200} />
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }

                                                            if(data.getChinaOrders.length == 0){
                                                                return (
                                                                    <tr>
                                                                        <td colSpan="13" className="text-center"> Empty... check back soon! </td>
                                                                    </tr>
                                                                );
                                                            }

                                                            return data.getChinaOrders.map((datas, d_index) => {
                                                                if(datas.isRefactored){
                                                                    return (
                                                                        <tr key={d_index}>
                                                                            <td className="text-center">{d_index+1}</td>
                                                                            <td className="text-center">
                                                                                {!datas.isRejected ?
                                                                                    datas.isEdited && totalGrams != 0 ? <input type="checkbox" name={datas.id} onClick={() => this.displaySelectedCount()} /> : "Must set the price/dimension first"
                                                                                :
                                                                                    <Popup
                                                                                        trigger={<span className="clickable fas fa-question-circle" style={{color: 'red'}} />}
                                                                                        position="top center"
                                                                                        on="hover" className="points-tooltip">
                                                                                        <div className="helperText" style={{padding: 10, lineHeight: 1.5}}>
                                                                                            There are no routes available based on the request. <br/>
                                                                                            This may be due to a non-existant shipping method, <br/>
                                                                                            the shipment exceeding the maximum weight or dimensions, <br/>
                                                                                            unqualified dangerous goods, or no service is available <br/>
                                                                                            to the shipping address.
                                                                                        </div>
                                                                                    </Popup>
                                                                                }
                                                                            </td>
                                                                            <td>{moment(new Date(parseInt(datas.date_requested))).startOf('second').fromNow()}</td>
                                                                            <td className="text-center">{datas.order_note}</td>
                                                                            <td className="text-center">{datas.shipping_information.order_number}</td>
                                                                            <td>
                                                                                {/* Shipping Information */}
                                                                                <div className="ellipsis" style={{ width: 200 }}>
                                                                                    {datas.shipping_information.email ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Email">{datas.shipping_information.email}<br /></span> : void 0}
                                                                                    {datas.shipping_information.name ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Name">{datas.shipping_information.name}<br /></span> : void 0}
                                                                                    {datas.shipping_information.address1 ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Address1">{datas.shipping_information.address1}<br /></span> : void 0}
                                                                                    {datas.shipping_information.address2 ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Address2">{datas.shipping_information.address2} <br /></span> : void 0}
                                                                                    {datas.shipping_information.city ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="City">{datas.shipping_information.city}<br /></span> : void 0}
                                                                                    {datas.shipping_information.province ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Province">{datas.shipping_information.province ? datas.shipping_information.province + " (" + datas.shipping_information.province_code + ")" : ''}<br /></span> : void 0}
                                                                                    {datas.shipping_information.zip ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Zip">{datas.shipping_information.zip}<br /></span> : void 0}
                                                                                    {datas.shipping_information.country ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Country">{datas.shipping_information.country + " (" + datas.shipping_information.country_code + ")"}</span> : void 0}
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                {(() => {
                                                                                    // Product Name
                                                                                    return datas.line_items.map((li, li_index) => {
                                                                                        if(li.vendor_link){
                                                                                            return <span key={li_index}><a href={li.vendor_link} target="_blank" title="Vendor link availalble click here.">{li.product_name}</a> {(li_index + 1) != datas.line_items.length ? <hr/> : void 0}</span>
                                                                                        } else {
                                                                                            return <span key={li_index}>{li.product_name} {(li_index + 1) != datas.line_items.length ? <hr/> : void 0}</span>
                                                                                        }
                                                                                    })
                                                                                })()}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {(() => {
                                                                                    // Variant Name
                                                                                    return datas.line_items.map((li, li_index) => {
                                                                                        return <span key={li_index}>{li.variant_name ? li.variant_name : 'N/A'} {(li_index + 1) != datas.line_items.length ? <hr/> : void 0}</span>
                                                                                    })
                                                                                })()}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {/* Product Quantity (Refactor) */}
                                                                                {(() => {
                                                                                    return datas.line_items.map((li, li_index) => {
                                                                                        return (
                                                                                            <Popup
                                                                                                trigger={<span className="clickable">{li.quantity+"x"} {(li_index + 1) != datas.line_items.length ? <hr/> : void 0}</span>}
                                                                                                position="top center"
                                                                                                on="click" className="points-tooltip" key={li_index}>
                                                                                                <div className="text-center">
                                                                                                    <h3>Change Product Quantity</h3>
                                                                                                    <div className="form_wrap">
                                                                                                        <div className="form_row">
                                                                                                            <div className="form_item">
                                                                                                                <Mutation
                                                                                                                    mutation={REFACTOR_UPDATE_ORDERS}
                                                                                                                    variables={{
                                                                                                                        id: state.selectedStoreID,
                                                                                                                        approve_price: li.approve_price ? li.approve_price : li.original_price,
                                                                                                                        variant_id: state.variant_id,
                                                                                                                        isWeight: false,
                                                                                                                        quantity: state.approveQuantity
                                                                                                                    }} >
                                                                                                                    {(refactorUpdateRequestedOrder, { datass, loading, error }) => {
                                                                                                                        return (
                                                                                                                            <div className="form_input">
                                                                                                                                <input type="number" defaultValue={li.quantity} onBlur={event => {
                                                                                                                                    this.refactorUpdateRequestedOrder(refactorUpdateRequestedOrder, refetch, li.approve_price ? li.approve_price : li.original_price, false, li.variant_id, null, event.target.value);
                                                                                                                                }} />
                                                                                                                                <span className="bottom_border"></span>
                                                                                                                            </div>
                                                                                                                        );
                                                                                                                    }}
                                                                                                                </Mutation>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </Popup>
                                                                                        );
                                                                                    })
                                                                                })()}
                                                                            </td>
                                                                            <td>
                                                                                <div className="form_wrap">
                                                                                    {(() => {
                                                                                        // Dimension / Weight
                                                                                        return datas.line_items.map((li, li_index) => {
                                                                                            return (
                                                                                                <div className="form_row" key={li_index}>
                                                                                                    <div className="form_item">
                                                                                                        <Mutation
                                                                                                            mutation={REFACTOR_UPDATE_ORDERS}
                                                                                                            variables={{
                                                                                                                id: state.selectedStoreID,
                                                                                                                dimension: JSON.stringify(state.dimension),
                                                                                                                variant_id: state.variant_id,
                                                                                                                approve_price: state.approve_price ? state.approve_price : li.approve_price,
                                                                                                                isWeight: state.isWeight,
                                                                                                                service: state.shipping_service_index,
                                                                                                                stockid: state.stockid ? state.stockid : li.stockid_used }}
                                                                                                            >
                                                                                                            {(refactorUpdateRequestedOrder, { datass, loading, error }) => {
                                                                                                                var idGrams = "GRAMS_"+d_index+"_"+li_index+"_"+li.product_id;
                                                                                                                var idGramsValue = "VALUE_"+d_index+"_"+li_index+"_"+li.product_id;
                                                                                                                
                                                                                                                return (
                                                                                                                    <Popup
                                                                                                                        trigger={<div className="text-center"><span id={idGrams} className="clickable" title="Click to change product weight">{(li.weight / 1000)}</span></div>}
                                                                                                                        position="left center"
                                                                                                                        on="click" className="points-tooltip">
                                                                                                                        <div>
                                                                                                                            <style dangerouslySetInnerHTML={{__html: `
                                                                                                                                .points-tooltip {
                                                                                                                                    width: 310px !important;
                                                                                                                                }
                                                                                                                            `}} />
                                                                                                                            <div className="text-center">
                                                                                                                                <h3>Change Product Dimension</h3>
                                                                                                                            </div>
                                                                                                                            <div className="form_input">
                                                                                                                                <div className="column column_6_12">
                                                                                                                                    <label htmlFor="metric" className="clickable">
                                                                                                                                        <input onChange={() => this.setState({ selectedUnit: 'Metric' })} id="metric" type="radio" name="unit" checked={this.state.selectedUnit == "Metric" ? true : false} style={{width: 'auto'}} /> Metric (kg, cm)
                                                                                                                                    </label>
                                                                                                                                </div>
                                                                                                                                <div className="column column_6_12">
                                                                                                                                    <label htmlFor="imperial" className="clickable">
                                                                                                                                        <input onChange={() => this.setState({ selectedUnit: 'Imperial' })} id="imperial" type="radio" name="unit" checked={this.state.selectedUnit == "Imperial" ? true : false} style={{width: 'auto'}} /> Imperial (oz, in)
                                                                                                                                    </label>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className="form_input clear">
                                                                                                                                <div className="column column_12_12" style={{position: 'relative'}}>
                                                                                                                                    <button className="dwobtn" style={{padding: 0, float: 'right'}} onClick={() => this.openInventoryModal(idGrams)}>Inventory</button>
                                                                                                                                    <br/>
                                                                                                                                    <label>Description (Chinese character)</label>
                                                                                                                                    <input className="chinese-description" type="text" defaultValue={state.c_desc ? state.c_desc : li.chinese_description} />
                                                                                                                                    <span className="bottom_border"></span>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className="form_input clear">
                                                                                                                                <div className="column column_6_12 text-center" style={{padding: 16}}>
                                                                                                                                    <label>Weight {this.state.selectedUnit == "Metric" ? '(kg)' : '(oz)'} *</label>
                                                                                                                                </div>
                                                                                                                                <div className="column column_6_12" style={{position: 'relative'}}>
                                                                                                                                    <input id={idGramsValue} type="number" defaultValue={state.weight ? (state.weight / 1000) : (li.weight / 1000)} />
                                                                                                                                    <span className="bottom_border"></span>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className="form_input text-center">
                                                                                                                                <div className="column column_12_12">
                                                                                                                                    <br/>
                                                                                                                                    <label>Dimensions</label>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className="form_input">
                                                                                                                                <div className="column column_4_12">
                                                                                                                                    <div className="text-center" style={{padding: '20px 0 0'}}>
                                                                                                                                        <label>Height {this.state.selectedUnit == "Metric" ? '(cm)' : '(in)'}</label>
                                                                                                                                    </div>
                                                                                                                                    <div style={{position: 'relative', padding: '0 5px'}}>
                                                                                                                                        <input type="number" className="height" defaultValue={state.height ? state.height : li.height ? li.height: ''} />
                                                                                                                                        <span className="bottom_border"></span>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                <div className="column column_4_12">
                                                                                                                                    <div className="text-center" style={{padding: '20px 0 0'}}>
                                                                                                                                        <label>Width {this.state.selectedUnit == "Metric" ? '(cm)' : '(in)'}</label>
                                                                                                                                    </div>
                                                                                                                                    <div style={{position: 'relative', padding: '0 5px'}}>
                                                                                                                                        <input type="number" className="width" defaultValue={state.width ? state.width : li.width ? li.width: ''} />
                                                                                                                                        <span className="bottom_border"></span>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                <div className="column column_4_12">
                                                                                                                                    <div className="text-center" style={{padding: '20px 0 0'}}>
                                                                                                                                        <label>Length {this.state.selectedUnit == "Metric" ? '(cm)' : '(in)'}</label>
                                                                                                                                    </div>
                                                                                                                                    <div style={{position: 'relative', padding: '0 5px'}}>
                                                                                                                                        <input type="number" className="length" defaultValue={state.length ? state.length : li.length ? li.length: ''} />
                                                                                                                                        <span className="bottom_border"></span>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className="column column_12_12">
                                                                                                                                <br/>
                                                                                                                                <div className="column column_4_12" style={{padding: 12}}>
                                                                                                                                    <label>DG Code</label>
                                                                                                                                </div>
                                                                                                                                <div className="column column_8_12">
                                                                                                                                    <select className="dropbtn drp stretch-width dg_code" defaultValue={state.dg_code ? state.dg_code : li.dg_code ? li.dg_code : ''} style={{backgroundColor: 'transparent', margin: 0}}>
                                                                                                                                        <option value="">None</option>
                                                                                                                                        <option value="0965">0965 - Lithium-ion Batteries Loose</option>
                                                                                                                                        <option value="0966">0966 - Lithium-ion Batteries Packed with Equipment</option>
                                                                                                                                        <option value="0967">0967 - Lithium-ion Batteries Contained in Equipment</option>
                                                                                                                                        <option value="0968">0968 - Lithium metal Batteries Loose</option>
                                                                                                                                        <option value="0969">0969 - Lithium metal Batteries Packed with Equipment</option>
                                                                                                                                        <option value="0970">0970 - Lithium metal Batteries Contained in Equipment</option>
                                                                                                                                        <option value="ORMD1">ORMD1 - Dry Cell Batteries</option>
                                                                                                                                    </select>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className="column column_12_12">
                                                                                                                                <br/>
                                                                                                                                <div className="column column_3_12" style={{padding: 12}}>
                                                                                                                                    <label>Shipping Service</label>
                                                                                                                                </div>
                                                                                                                                <div className="column column_9_12">
                                                                                                                                    <select className="dropbtn drp stretch-width shipping_service" defaultValue="BoxC Parcel" style={{backgroundColor: 'transparent', margin: 0}}>
                                                                                                                                        <option value="BoxC Post">BoxC Post (10-15 Business Days)</option>
                                                                                                                                        <option value="BoxC Parcel">BoxC Parcel (5-10 Business Days)</option>
                                                                                                                                        <option value="Boxc Plus">Boxc Plus (4-9 Business Days)</option>
                                                                                                                                        <option value="BoxC Priority">BoxC Priority (3-6 Business Days)</option>
                                                                                                                                    </select>
                                                                                                                                </div> <br/><br/><br/>
                                                                                                                                <div className="helperText clear">Select the DG Code if the shipment contains dangerous goods.</div>
                                                                                                                            </div>
                                                                                                                            <div className="column column_12_12 text-center">
                                                                                                                                <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => {
                                                                                                                                    // computation for width, length, height, weight of the product
                                                                                                                                    var weight = document.getElementById(idGramsValue).value;
                                                                                                                                    var height = document.querySelector(".height").value;
                                                                                                                                    var width = document.querySelector(".width").value;
                                                                                                                                    var length = document.querySelector(".length").value;
                                                                                                                                    var dg_code = document.querySelector(".dg_code").value;
                                                                                                                                    var chineseDescription = document.querySelector(".chinese-description").value;
                                                                                                                                    var shipping_service = document.querySelector(".shipping_service").value;
                                                                                                                                    var dimension = {};
                                                                                                                                    if(this.state.selectedUnit == "Imperial"){
                                                                                                                                        dimension = {
                                                                                                                                            weight: parseFloat(weight) / 35.274,
                                                                                                                                            height: height ? parseFloat(height) * 2.54 : '', // convert height inc to cm
                                                                                                                                            width: width ? parseFloat(width) * 2.54 : '', // convert height inc to cm
                                                                                                                                            length: length ? parseFloat(length) * 2.54 : '', // convert height inc to cm
                                                                                                                                            dg_code,
                                                                                                                                            chineseDescription,
                                                                                                                                            shipping_service
                                                                                                                                        }
                                                                                                                                        ;
                                                                                                                                    } else {
                                                                                                                                        dimension = {
                                                                                                                                            weight: parseFloat(weight) * 1000,
                                                                                                                                            height,
                                                                                                                                            width,
                                                                                                                                            length,
                                                                                                                                            dg_code,
                                                                                                                                            chineseDescription,
                                                                                                                                            shipping_service
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                    // end computation for width, length, height, weight of the product
                                                                                                                                    if(chineseDescription){
                                                                                                                                        this.refactorUpdateRequestedOrder(refactorUpdateRequestedOrder, refetch, state.price, true, li.variant_id, dimension);
                                                                                                                                        document.getElementById(idGrams).click();
                                                                                                                                    } else {
                                                                                                                                        toastr.clear();
                                                                                                                                        toastr.warning("Description in chinese character is required.","Description Required");
                                                                                                                                    }
                                                                                                                                }}>
                                                                                                                                    <i className="fas fa-check"></i>
                                                                                                                                </button>
                                                                                                                                &nbsp; | &nbsp;
                                                                                                                                <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20}} onClick={() => document.getElementById(idGrams).click()}>
                                                                                                                                    <i className="fas fa-times"></i>
                                                                                                                                </button>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </Popup>
                                                                                                                );
                                                                                                            }}
                                                                                                        </Mutation>
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        })
                                                                                    })()}
                                                                                </div>
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {/* Shipping Fee */}
                                                                                {datas.shipping_cost && datas.shipping_days_min && datas.shipping_days_max && datas.shipping_method ?
                                                                                    <span className="capitalize">
                                                                                        {datas.shipping_method}<br/>
                                                                                        {datas.shipping_days_min +"-"+ datas.shipping_days_max + " Days"} <br/>
                                                                                        {"$"+datas.shipping_cost}
                                                                                    </span>
                                                                                : void 0}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                <div className="form_wrap">
                                                                                    {(() => {
                                                                                        // Price
                                                                                        return datas.line_items.map((li, li_index) => {
                                                                                            return (
                                                                                                <div className="form_row" key={li_index}>
                                                                                                    <div className="form_item">
                                                                                                        <Mutation
                                                                                                            mutation={REFACTOR_UPDATE_ORDERS}
                                                                                                            variables={{
                                                                                                                id: state.selectedStoreID,
                                                                                                                approve_price: state.approve_price,
                                                                                                                variant_id: state.variant_id,
                                                                                                                isWeight: state.isWeight }}
                                                                                                            >
                                                                                                            {(refactorUpdateRequestedOrder, { datass, loading, error }) => {
                                                                                                                var idPrice = "PRICE_"+d_index+"_"+li_index+"_"+li.product_id;
                                                                                                                var idGramsValue = "VALUE_"+d_index+"_"+li_index+"_"+li.product_id;
                                                                                                                
                                                                                                                return (
                                                                                                                    <Popup
                                                                                                                        trigger={<span id={idPrice} className="clickable" title="Click to change product price">{datas.isEdited && li.approve_price ? "$"+li.approve_price : "Set Price"}</span>}
                                                                                                                        position="top center"
                                                                                                                        on="click" className="points-tooltip">
                                                                                                                        <div className="text-center">
                                                                                                                            <h3>Change Product Price</h3>
                                                                                                                            <div className="form_input">
                                                                                                                                <input id={idGramsValue} type="number" defaultValue={li.approve_price ? li.approve_price : li.original_price} />
                                                                                                                                <span className="bottom_border"></span>
                                                                                                                            </div>
                                                                                                                            <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => {
                                                                                                                                this.refactorUpdateRequestedOrder(refactorUpdateRequestedOrder, refetch, document.getElementById(idGramsValue).value, false, li.variant_id);
                                                                                                                                document.getElementById(idPrice).click();
                                                                                                                            }}>
                                                                                                                                <i className="fas fa-check"></i>
                                                                                                                            </button>
                                                                                                                            &nbsp; | &nbsp;
                                                                                                                            <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20}} onClick={() => document.getElementById(idPrice).click()}>
                                                                                                                                <i className="fas fa-times"></i>
                                                                                                                            </button>
                                                                                                                        </div>
                                                                                                                    </Popup>
                                                                                                                );
                                                                                                            }}
                                                                                                        </Mutation>
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        })
                                                                                    })()}
                                                                                </div>
                                                                            </td>
                                                                            <td className="text-center">
                                                                                <Mutation
                                                                                    mutation={DECIDE_ORDER}
                                                                                    variables={{
                                                                                        id: datas.id,
                                                                                        decision: state.decision,
                                                                                        denied_note: state.denied_note }}
                                                                                    >
                                                                                    {(approveOrder, { data, loading, error }) => {
                                                                                        var isDisabled = datas.isRejected || !datas.isEdited;
                                                                                        return (
                                                                                            <div className="form_buttons">
                                                                                                <button onClick={this.approveOrder.bind(this, approveOrder, "approved", refetch)} className="btn" style={{padding: 5, backgroundColor: '#27c686', borderColor: '#27c686'}} disabled={isDisabled}>Approve</button>
                                                                                                <span>&nbsp; | &nbsp;</span>
                                                                                                <Popup
                                                                                                    trigger={<button className="btn" id={"deny"+d_index} style={{padding: 5, backgroundColor: 'red', borderColor: 'red'}}>Deny</button>}
                                                                                                    position="left center"
                                                                                                    on="click" className="points-tooltip">
                                                                                                    <div className="text-center">
                                                                                                        <h4 style={{lineHeight: 1.2, color: "#000", fontSize: '2rem'}}>Reason why this order is denied</h4>
                                                                                                        <div className="form_wrap">
                                                                                                            <div className="form_row" style={{margin: 0}}>
                                                                                                                <div className="form_item">
                                                                                                                    <div className="form_input">
                                                                                                                        <input type="text" name="denied_note" defaultValue={state.denied_note} onBlur={this.handleInputChange.bind(this)} />
                                                                                                                        <span className="bottom_border"></span>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => {
                                                                                                            document.getElementById("deny"+d_index).click();
                                                                                                            this.approveOrder(approveOrder, "denied", refetch)
                                                                                                        }}>
                                                                                                            <i className="fas fa-check"></i>
                                                                                                        </button>
                                                                                                        &nbsp; | &nbsp;
                                                                                                        <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20}} onClick={() => document.getElementById("deny"+d_index).click()}>
                                                                                                            <i className="fas fa-times"></i>
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </Popup>
                                                                                            </div>
                                                                                        );
                                                                                    }}
                                                                                </Mutation>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }

                                                                var orders = JSON.parse(datas.orders);
                                                                var totalGrams = 0;
                                                                orders.line_items.forEach(li => {
                                                                    totalGrams += parseFloat(li.grams);
                                                                })
                                                                
                                                                return (
                                                                    <tr key={d_index}>
                                                                        <td className="text-center">{d_index+1}</td>
                                                                        <td className="text-center">
                                                                            {!orders.isRejected ?
                                                                                orders.edited && totalGrams != 0 ? <input type="checkbox" name={data.id} onClick={() => this.displaySelectedCount()} /> : "Must set the price/dimension first"
                                                                            :
                                                                                <Popup
                                                                                    trigger={<span className="clickable fas fa-question-circle" style={{color: 'red'}} />}
                                                                                    position="top center"
                                                                                    on="hover" className="points-tooltip">
                                                                                    <div className="helperText" style={{padding: 10, lineHeight: 1.5}}>
                                                                                        There are no routes available based on the request. <br/>
                                                                                        This may be due to a non-existant shipping method, <br/>
                                                                                        the shipment exceeding the maximum weight or dimensions, <br/>
                                                                                        unqualified dangerous goods, or no service is available <br/>
                                                                                        to the shipping address.
                                                                                    </div>
                                                                                </Popup>
                                                                            }
                                                                        </td>
                                                                        <td>{moment(new Date(parseInt(datas.date_requested))).startOf('second').fromNow()}</td>
                                                                        <td className="text-center">{orders.order_note}</td>
                                                                        <td className="text-center">{orders.name}</td>
                                                                        <td>
                                                                            <div className="ellipsis" style={{width: 200}}>
                                                                                <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.email}</span><br/>
                                                                                <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.shipping_address.name}</span><br/>
                                                                                <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.shipping_address.address1} {orders.shipping_address.address2}</span><br/>
                                                                                <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.shipping_address.city}</span><br/>
                                                                                <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.shipping_address.province ? orders.shipping_address.province : ''} {orders.shipping_address.zip}</span><br/>
                                                                                <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orders.shipping_address.country}</span>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            {(() => {
                                                                                return orders.line_items.map((li, li_index) => {
                                                                                    if(li.vendorLink){
                                                                                        return <span key={li_index}><a href={li.vendorLink} target="_blank" title="Vendor link availalble click here.">{li.title}</a> {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                    } else {
                                                                                        return <span key={li_index}>{li.title} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                    }
                                                                                })
                                                                            })()}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {(() => {
                                                                                return orders.line_items.map((li, li_index) => {
                                                                                    return <span key={li_index}>{li.variant_title ? li.variant_title : 'N/A'} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                })
                                                                            })()}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {/* Product Quantity */}
                                                                            {(() => {
                                                                                return orders.line_items.map((li, li_index) => {
                                                                                    if(li.variant_title){
                                                                                        return (
                                                                                            <Popup
                                                                                                trigger={<span className="clickable">{li.quantity+"x"} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>}
                                                                                                position="top center"
                                                                                                on="click" className="points-tooltip" key={li_index}>
                                                                                                <div className="text-center">
                                                                                                    <h3>Change Product Quantity</h3>
                                                                                                    <div className="form_wrap">
                                                                                                        <div className="form_row">
                                                                                                            <div className="form_item">
                                                                                                                <Mutation
                                                                                                                    mutation={UPDATE_ORDERS}
                                                                                                                    variables={{
                                                                                                                        orders: state.allRequestOrder,
                                                                                                                        isWeight: state.isWeight,
                                                                                                                        service: state.shipping_service_index }}
                                                                                                                    >
                                                                                                                    {(updateRequestedOrder, { datass, loading, error }) => {
                                                                                                                        return (
                                                                                                                            <div className="form_input">
                                                                                                                                <input type="number" defaultValue={li.quantity} onBlur={event => {
                                                                                                                                    this.updatePrice(updateRequestedOrder, data.getChinaOrders, refetch, weight, true, li.variant_id, dimension, event.target.value);
                                                                                                                                }} />
                                                                                                                                <span className="bottom_border"></span>
                                                                                                                            </div>
                                                                                                                        );
                                                                                                                    }}
                                                                                                                </Mutation>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </Popup>
                                                                                        );
                                                                                    } else {
                                                                                        return <span key={li_index}>{li.quantity+"x"} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                    }
                                                                                })
                                                                            })()}
                                                                        </td>
                                                                        <td>
                                                                            <div className="form_wrap">
                                                                                {(() => {
                                                                                    return orders.line_items.map((li, li_index) => {
                                                                                        return (
                                                                                            <div className="form_row" key={li_index}>
                                                                                                <div className="form_item">
                                                                                                    <Mutation
                                                                                                        mutation={UPDATE_ORDERS}
                                                                                                        variables={{
                                                                                                            orders: state.allRequestOrder,
                                                                                                            isWeight: state.isWeight,
                                                                                                            service: state.shipping_service_index }}
                                                                                                        >
                                                                                                        {(updateRequestedOrder, { datass, loading, error }) => {
                                                                                                            var idGrams = "GRAMS_"+d_index+"_"+li_index+"_"+li.product_id;
                                                                                                            var idGramsValue = "VALUE_"+d_index+"_"+li_index+"_"+li.product_id;
                                                                                                            
                                                                                                            return (
                                                                                                                <Popup
                                                                                                                    trigger={<div className="text-center"><span id={idGrams} className="clickable" title="Click to change product weight">{(li.grams / 1000)}</span></div>}
                                                                                                                    position="left center"
                                                                                                                    on="click" className="points-tooltip">
                                                                                                                    <div>
                                                                                                                        <style dangerouslySetInnerHTML={{__html: `
                                                                                                                            .points-tooltip {
                                                                                                                                width: 310px !important;
                                                                                                                            }
                                                                                                                        `}} />
                                                                                                                        <div className="text-center">
                                                                                                                            <h3>Change Product Dimension</h3>
                                                                                                                        </div>
                                                                                                                        <div className="form_input">
                                                                                                                            <div className="column column_6_12">
                                                                                                                                <label htmlFor="metric" className="clickable">
                                                                                                                                    <input onChange={() => this.setState({ selectedUnit: 'Metric' })} id="metric" type="radio" name="unit" checked={this.state.selectedUnit == "Metric" ? true : false} style={{width: 'auto'}} /> Metric (kg, cm)
                                                                                                                                </label>
                                                                                                                            </div>
                                                                                                                            <div className="column column_6_12">
                                                                                                                                <label htmlFor="imperial" className="clickable">
                                                                                                                                    <input onChange={() => this.setState({ selectedUnit: 'Imperial' })} id="imperial" type="radio" name="unit" checked={this.state.selectedUnit == "Imperial" ? true : false} style={{width: 'auto'}} /> Imperial (oz, in)
                                                                                                                                </label>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="form_input clear">
                                                                                                                            <div className="column column_12_12" style={{position: 'relative'}}>
                                                                                                                                <br/>
                                                                                                                                <label>Description (Chinese character)</label>
                                                                                                                                <input className="chinese-description" type="text" defaultValue={li.description} />
                                                                                                                                <span className="bottom_border"></span>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="form_input clear">
                                                                                                                            <div className="column column_6_12 text-center" style={{padding: 16}}>
                                                                                                                                <label>Weight {this.state.selectedUnit == "Metric" ? '(kg)' : '(oz)'} *</label>
                                                                                                                            </div>
                                                                                                                            <div className="column column_6_12" style={{position: 'relative'}}>
                                                                                                                                <input id={idGramsValue} type="number" defaultValue={(li.grams / 1000)} />
                                                                                                                                <span className="bottom_border"></span>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="form_input text-center">
                                                                                                                            <div className="column column_12_12">
                                                                                                                                <br/>
                                                                                                                                <label>Dimensions</label>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="form_input">
                                                                                                                            <div className="column column_4_12">
                                                                                                                                <div className="text-center" style={{padding: '20px 0 0'}}>
                                                                                                                                    <label>Height {this.state.selectedUnit == "Metric" ? '(cm)' : '(in)'}</label>
                                                                                                                                </div>
                                                                                                                                <div style={{position: 'relative', padding: '0 5px'}}>
                                                                                                                                    <input type="number" className="height" defaultValue={li.dimension ? li.dimension.height: ''} />
                                                                                                                                    <span className="bottom_border"></span>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className="column column_4_12">
                                                                                                                                <div className="text-center" style={{padding: '20px 0 0'}}>
                                                                                                                                    <label>Width {this.state.selectedUnit == "Metric" ? '(cm)' : '(in)'}</label>
                                                                                                                                </div>
                                                                                                                                <div style={{position: 'relative', padding: '0 5px'}}>
                                                                                                                                    <input type="number" className="width" defaultValue={li.dimension ? li.dimension.width: ''} />
                                                                                                                                    <span className="bottom_border"></span>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className="column column_4_12">
                                                                                                                                <div className="text-center" style={{padding: '20px 0 0'}}>
                                                                                                                                    <label>Length {this.state.selectedUnit == "Metric" ? '(cm)' : '(in)'}</label>
                                                                                                                                </div>
                                                                                                                                <div style={{position: 'relative', padding: '0 5px'}}>
                                                                                                                                    <input type="number" className="length" defaultValue={li.dimension ? li.dimension.length: ''} />
                                                                                                                                    <span className="bottom_border"></span>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="column column_12_12">
                                                                                                                            <br/>
                                                                                                                            <div className="column column_4_12" style={{padding: 12}}>
                                                                                                                                <label>DG Code</label>
                                                                                                                            </div>
                                                                                                                            <div className="column column_8_12">
                                                                                                                                <select className="dropbtn drp stretch-width dg_code" defaultValue={li.dimension ? li.dimension.dg_code : ''} style={{backgroundColor: 'transparent', margin: 0}}>
                                                                                                                                    <option value="">None</option>
                                                                                                                                    <option value="0965">0965 - Lithium-ion Batteries Loose</option>
                                                                                                                                    <option value="0966">0966 - Lithium-ion Batteries Packed with Equipment</option>
                                                                                                                                    <option value="0967">0967 - Lithium-ion Batteries Contained in Equipment</option>
                                                                                                                                    <option value="0968">0968 - Lithium metal Batteries Loose</option>
                                                                                                                                    <option value="0969">0969 - Lithium metal Batteries Packed with Equipment</option>
                                                                                                                                    <option value="0970">0970 - Lithium metal Batteries Contained in Equipment</option>
                                                                                                                                    <option value="ORMD1">ORMD1 - Dry Cell Batteries</option>
                                                                                                                                </select>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="column column_12_12">
                                                                                                                            <br/>
                                                                                                                            <div className="column column_3_12" style={{padding: 12}}>
                                                                                                                                <label>Shipping Service</label>
                                                                                                                            </div>
                                                                                                                            <div className="column column_9_12">
                                                                                                                                <select className="dropbtn drp stretch-width shipping_service" defaultValue="BoxC Parcel" style={{backgroundColor: 'transparent', margin: 0}}>
                                                                                                                                    <option value="BoxC Post">BoxC Post (10-15 Business Days)</option>
                                                                                                                                    <option value="BoxC Parcel">BoxC Parcel (5-10 Business Days)</option>
                                                                                                                                    <option value="BoxC Plus">Boxc Plus (4-9 Business Days)</option>
                                                                                                                                    <option value="BoxC Priority">BoxC Priority (3-6 Business Days)</option>
                                                                                                                                </select>
                                                                                                                            </div> <br/><br/><br/>
                                                                                                                            <div className="helperText clear">Select the DG Code if the shipment contains dangerous goods.</div>
                                                                                                                        </div>
                                                                                                                        <div className="column column_12_12 text-center">
                                                                                                                            <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => {
                                                                                                                                // computation for width, length, height, weight of the product
                                                                                                                                var weight = document.getElementById(idGramsValue).value;
                                                                                                                                var height = document.querySelector(".height").value;
                                                                                                                                var width = document.querySelector(".width").value;
                                                                                                                                var length = document.querySelector(".length").value;
                                                                                                                                var dg_code = document.querySelector(".dg_code").value;
                                                                                                                                var chineseDescription = document.querySelector(".chinese-description").value;
                                                                                                                                var shipping_service = document.querySelector(".shipping_service").value;
                                                                                                                                var dimension = {
                                                                                                                                    height,
                                                                                                                                    width,
                                                                                                                                    length,
                                                                                                                                    dg_code,
                                                                                                                                    chineseDescription,
                                                                                                                                    shipping_service
                                                                                                                                }
                                                                                                                                if(this.state.selectedUnit == "Imperial"){
                                                                                                                                    dimension = {
                                                                                                                                        height: height ? parseFloat(height) * 2.54 : '', // convert height inc to cm
                                                                                                                                        width: width ? parseFloat(width) * 2.54 : '', // convert height inc to cm
                                                                                                                                        length: length ? parseFloat(length) * 2.54 : '', // convert height inc to cm
                                                                                                                                        chineseDescription
                                                                                                                                    }
                                                                                                                                    weight = parseFloat(weight) / 35.274;
                                                                                                                                } else {
                                                                                                                                    weight = parseFloat(weight) * 1000;
                                                                                                                                }
                                                                                                                                // end computation for width, length, height, weight of the product
                                                                                                                                if(chineseDescription){
                                                                                                                                    this.updatePrice(updateRequestedOrder, data.getChinaOrders, refetch, weight, true, li.variant_id, dimension);
                                                                                                                                    document.getElementById(idGrams).click();
                                                                                                                                } else {
                                                                                                                                    toastr.clear();
                                                                                                                                    toastr.warning("Description in chinese character is required.","Description Required");
                                                                                                                                }
                                                                                                                            }}>
                                                                                                                                <i className="fas fa-check"></i>
                                                                                                                            </button>
                                                                                                                            &nbsp; | &nbsp;
                                                                                                                            <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20}} onClick={() => document.getElementById(idGrams).click()}>
                                                                                                                                <i className="fas fa-times"></i>
                                                                                                                            </button>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </Popup>
                                                                                                            );
                                                                                                        }}
                                                                                                    </Mutation>
                                                                                                    {/* <div className="form_input">
                                                                                                        <input className="chinaPrice" id={li.product_id} type="number" value={li.grams} onChange={event => this.updatePrice(updateRequestedOrder, data.getChinaOrders, refetch, event, true)} />
                                                                                                        <span className="bottom_border"></span>
                                                                                                    </div> */}
                                                                                                </div>
                                                                                            </div>
                                                                                        );
                                                                                    })
                                                                                })()}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {/* Shipping Fee */}
                                                                            {orders.shipping_fee && orders.shipping_fee.shipping_methods[0].total_cost ?
                                                                                <span className="capitalize">
                                                                                    {orders.shipping_fee.shipping_methods[0].method}<br/>
                                                                                    {orders.shipping_fee.transit_min +"-"+ orders.shipping_fee.transit_max + " Days"} <br/>
                                                                                    {"$"+orders.shipping_fee.shipping_methods[0].total_cost}
                                                                                </span>
                                                                            : void 0}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            <div className="form_wrap">
                                                                                {(() => {
                                                                                    return orders.line_items.map((li, li_index) => {
                                                                                        return (
                                                                                            <div className="form_row" key={li_index}>
                                                                                                <div className="form_item">
                                                                                                    <Mutation
                                                                                                        mutation={UPDATE_ORDERS}
                                                                                                        variables={{
                                                                                                            orders: state.allRequestOrder,
                                                                                                            isWeight: state.isWeight }}
                                                                                                        >
                                                                                                        {(updateRequestedOrder, { datass, loading, error }) => {
                                                                                                            var idPrice = "PRICE_"+d_index+"_"+li_index+"_"+li.product_id;
                                                                                                            var idGramsValue = "VALUE_"+d_index+"_"+li_index+"_"+li.product_id;

                                                                                                            return (
                                                                                                                <Popup
                                                                                                                    trigger={<span id={idPrice} className="clickable" title="Click to change product price">{orders.edited ? "$"+li.price : "Set Price"}</span>}
                                                                                                                    position="top center"
                                                                                                                    on="click" className="points-tooltip">
                                                                                                                    <div className="text-center">
                                                                                                                        <h3>Change Product Price</h3>
                                                                                                                        <div className="form_input">
                                                                                                                            <input id={idGramsValue} type="number" defaultValue={li.price} />
                                                                                                                            <span className="bottom_border"></span>
                                                                                                                        </div>
                                                                                                                        <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => {
                                                                                                                            this.updatePrice(updateRequestedOrder, data.getChinaOrders, refetch, document.getElementById(idGramsValue).value, false, li.variant_id);
                                                                                                                            document.getElementById(idPrice).click();
                                                                                                                        }}>
                                                                                                                            <i className="fas fa-check"></i>
                                                                                                                        </button>
                                                                                                                        &nbsp; | &nbsp;
                                                                                                                        <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20}} onClick={() => document.getElementById(idPrice).click()}>
                                                                                                                            <i className="fas fa-times"></i>
                                                                                                                        </button>
                                                                                                                    </div>
                                                                                                                </Popup>
                                                                                                            );
                                                                                                        }}
                                                                                                    </Mutation>
                                                                                                    {/* <div className="form_input">
                                                                                                        <input className="chinaPrice" id={li.product_id} type="number" value={li.price} onChange={event => this.updatePrice(updateRequestedOrder, data.getChinaOrders, refetch, event)} />
                                                                                                        <span className="bottom_border"></span>
                                                                                                    </div> */}
                                                                                                </div>
                                                                                            </div>
                                                                                        );
                                                                                    })
                                                                                })()}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-center">
                                                                            <Mutation
                                                                                mutation={DECIDE_ORDER}
                                                                                variables={{
                                                                                    id: datas.id,
                                                                                    decision: state.decision,
                                                                                    denied_note: state.denied_note }}
                                                                                >
                                                                                {(approveOrder, { data, loading, error }) => {
                                                                                    var isDisabled = orders.isRejected || !orders.edited;
                                                                                    return (
                                                                                        <div className="form_buttons">
                                                                                            <button onClick={this.approveOrder.bind(this, approveOrder, "approved", refetch)} className="btn" style={{padding: 5, backgroundColor: '#27c686', borderColor: '#27c686'}} disabled={isDisabled}>Approve</button>
                                                                                            <span>&nbsp; | &nbsp;</span>
                                                                                            <Popup
                                                                                                trigger={<button className="btn" id={"deny"+d_index} style={{padding: 5, backgroundColor: 'red', borderColor: 'red'}}>Deny</button>}
                                                                                                position="left center"
                                                                                                on="click" className="points-tooltip">
                                                                                                <div className="text-center">
                                                                                                    <h4 style={{lineHeight: 1.2, color: "#000", fontSize: '2rem'}}>Reason why this order is denied</h4>
                                                                                                    <div className="form_wrap">
                                                                                                        <div className="form_row" style={{margin: 0}}>
                                                                                                            <div className="form_item">
                                                                                                                <div className="form_input">
                                                                                                                    <input type="text" name="denied_note" defaultValue={state.denied_note} onBlur={this.handleInputChange.bind(this)} />
                                                                                                                    <span className="bottom_border"></span>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => {
                                                                                                        document.getElementById("deny"+d_index).click();
                                                                                                        this.approveOrder(approveOrder, "denied", refetch)
                                                                                                    }}>
                                                                                                        <i className="fas fa-check"></i>
                                                                                                    </button>
                                                                                                    &nbsp; | &nbsp;
                                                                                                    <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20}} onClick={() => document.getElementById("deny"+d_index).click()}>
                                                                                                        <i className="fas fa-times"></i>
                                                                                                    </button>
                                                                                                </div>
                                                                                            </Popup>
                                                                                        </div>
                                                                                    );
                                                                                }}
                                                                            </Mutation>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })
                                                        }}
                                                    </Query>
                                                </tbody>
                                            </table>
                                        </div>
                                        {paginationDOM}
                                        <br/>
                                        <div className="form_buttons text-right">
                                            <button className="btn" onClick={() => this.smoothscroll()} style={{position: 'fixed', bottom: 50, right: 10, zIndex: 1, borderRadius: '50%', padding: '12px 15px', fontSize: 20}}><span className="fas fa-arrow-up"></span></button>
                                        </div>
                                    </div>
                                    {state.openInventoryModal &&
                                        <Modal open={state.openInventoryModal} closeModal={this.openInventoryModal} session={this.props.session}>
                                            <div className="table-container">
                                                <div className="text-center">
                                                    <h3>User Virtual Inventory List</h3>
                                                </div>
                                                <table className="table-list">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Product Name</th>
                                                            <th>Variant</th>
                                                            <th>Price</th>
                                                            <th>Quantity</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <Query query={GET_BULK_QUOTE} variables={{id: state.selectedStoreID, isPaid: true}} onCompleted={data => {
                                                            // virtualWarehouse
                                                            this.setState({
                                                                virtualWarehouse: data.getVirtualInventory
                                                            })
                                                        }}>
                                                            {({ data, loading, refetch, error }) => {
                                                                if(loading){
                                                                    return (
                                                                        <tr>
                                                                            <td colSpan="5" className="text-center">
                                                                                <Loading height={150} width={150} />
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                                
                                                                if(data.getVirtualInventory.length == 0){
                                                                    return (
                                                                        <tr>
                                                                            <td colSpan="5" className="text-center">
                                                                            <span className="no-result">Empty... check back soon!</span>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }

                                                                return data.getVirtualInventory.map((order, index) => {
                                                                    return (
                                                                        <tr key={index} className="clickable" style={{color: 'inherit'}} onClick={() => {
                                                                            var price = null;
                                                                            if(state.virtualWarehouse){
                                                                                var vw = JSON.parse(JSON.stringify(state.virtualWarehouse));
                                                                                if(vw[index].qty >= 1){
                                                                                    vw[index].qty -= 1;
                                                                                    price = "0"; // its already paid from his virtual inventory
                                                                                } else {
                                                                                    toastr.clear();
                                                                                    toastr.warning("You can still use the data of it but you need to manually type the product price for this.","Out of stock!");
                                                                                }
                                                                            }
                                                                            this.setState({
                                                                                c_desc: order.chinese_description,
                                                                                name: order.name,
                                                                                dg_code: order.dg_code,
                                                                                weight: order.weight,
                                                                                height: order.dimension_height,
                                                                                width: order.dimension_width,
                                                                                length: order.dimension_length,
                                                                                price,
                                                                                quantity: order.qty,
                                                                                stockid: order.id,
                                                                                virtualWarehouse: vw
                                                                            }, () => {
                                                                                this.openInventoryModal();
                                                                                setTimeout(function() {
                                                                                    document.getElementById(state.refreshDOM).click();
                                                                                    document.getElementById(state.refreshDOM).click();
                                                                                }, 500);
                                                                            })
                                                                        }}>
                                                                            <td>{index+1}</td>
                                                                            <td>{order.name}</td>
                                                                            <td>N/A</td>
                                                                            <td>${order.price}</td>
                                                                            <td className="text-center">{state.virtualWarehouse[index] ? state.virtualWarehouse[index].qty : order.qty}x</td>
                                                                        </tr>
                                                                    );
                                                                });
                                                            }}
                                                        </Query>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Modal>
                                    }
                                </div> 
                            );
                        } else if(state.activeTab == "approved"){
                            return (
                                <div>
                                    <div className="column column_3_12">
                                        <div className="product-card">
                                            <div className="product-details" style={{overflow: 'hidden'}}>
                                                <div className="text-center">
                                                    <h3>Stores</h3>
                                                </div>
                                                <Query query={GET_ADMIN_ORDERS_CHINA_USERS} variables={{filter: state.activeTab}}>
                                                    {({ data, loading, refetch, error }) => {
                                                        if(loading) {
                                                            return (
                                                                <div className="text-center">
                                                                    <Loading height={150} width={150} />
                                                                </div>
                                                            );
                                                        }

                                                        if(data.getAdminChinaOrdersUSERS.length != 0){
                                                            return data.getAdminChinaOrdersUSERS.map((user, user_index) => {
                                                                var cn = "product-card";
                                                                if(state.selectedStoreID == user.id){
                                                                    cn += " card-active"
                                                                }
                                                                var storeData = {
                                                                    store_url: user.store_url,
                                                                    store_location_id: user.store_location_id,
                                                                    store_token: user.store_token,
                                                                    store_phone: user.store_phone
                                                                }
                                                                return (
                                                                    <div className={cn} key={user_index}>
                                                                        <div className="product-details" style={{overflow: 'hidden'}}>
                                                                            <div className="column column_3_12" style={{padding: 0}}>
                                                                                <div style={{backgroundImage: user.profileImage ? 'url('+webConfig.siteURL+'/user-uploads/'+user.profileImage+')' : 'url('+webConfig.siteURL+'/assets/graphics/abstract_patterns/texture.jpg'+')', height: '5rem', borderRadius: '50%',   backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
                                                                            </div>
                                                                            <div className="column column_9_12 ellipsis" style={{whiteSpace: 'nowrap'}}>
                                                                                <strong>{user.store_url}</strong> <br/>
                                                                                {user.firstName} {user.lastName} <br/>
                                                                                <div className="float-right" style={{marginTop: 5}}>
                                                                                    <span className="clickable" onClick={() => {this.displayOrder(user.id, user.firstName+" "+user.lastName, storeData); state.email = user.email}}>
                                                                                        Details &nbsp;<span className="fas fa-arrow-right"></span>
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            });
                                                        } else {
                                                            return (
                                                                <div className="text-center">
                                                                    <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>No Store Available</span>
                                                                </div>
                                                            );
                                                        }
                                                    }}
                                                </Query>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column column_9_12">
                                        {state.selectedStoreID &&
                                            <div className="column column_12_12">
                                                <div className="text-right form_buttons">
                                                    <Popup
                                                        trigger={<button id="mark-as-paid" className="btn float-left" style={{padding: '5px 10px'}}>Mark as Paid</button>}
                                                        position="top center"
                                                        on="click" className="points-tooltip">
                                                        <div className="text-center">
                                                            <h3>Are you sure ?</h3>
                                                            <h4 style={{color: '#000'}}>This cannot be undone.</h4>
                                                            <Mutation
                                                                mutation={MARK_ORDER_AS_PAID}
                                                                variables={{
                                                                    id: state.selectedStoreID,
                                                                    store_url: state.store_url,
                                                                    store_token: state.store_token,
                                                                    store_location_id: state.store_location_id }}
                                                                >
                                                                {(markAsPaid, { data, loading, error }) => {
                                                                    return (
                                                                        <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => this.markAsPaid(markAsPaid)}>
                                                                            <i className="fas fa-check"></i>
                                                                        </button>
                                                                    );
                                                                }}
                                                            </Mutation>
                                                            &nbsp; | &nbsp;
                                                            <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20}} onClick={() => document.getElementById("mark-as-paid").click()}>
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                    </Popup>
                                                    <Mutation
                                                        mutation={SUBMIT_FULFILLMENT_CENTER_MESSAGE}
                                                        variables={{
                                                            id: state.selectedStoreID,
                                                            text: state.totalApproved+" of your request has been approved.",
                                                            from: 'Admin',
                                                            isFromQuote: false }}
                                                        >
                                                        {(submitMessage, { data, loading, error }) => {
                                                            return <button id="mark-as-paid" className="btn float-left" style={{padding: '5px 10px', marginLeft: 20}} onClick={event => this.sendEmail(event, submitMessage)}>Notify user</button>;
                                                        }}
                                                    </Mutation>
                                                    <span id="is_payed">
                                                        <span style={{marginLeft: 20, padding: '5px 10px', border: '1px solid #3dac51'}}>Waiting for payment...</span>
                                                    </span> <br/> <br/>
                                                    {/* <button className="btn" onClick={() => this.syncAll()}>Sync All</button> */}
                                                </div>
                                            </div>
                                        }
                                        <div className="table-container clear">
                                            <br/>
                                            <table className="table-list">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center">#</th>
                                                        <th>Approve Date</th>
                                                        <th>Order ID</th>
                                                        <th width="200px">Shipping Information</th>
                                                        <th>Product</th>
                                                        <th className="text-center">Variant</th>
                                                        <th className="text-center">Quantity</th>
                                                        <th className="text-center" width="10%">Price</th>
                                                        <th className="text-center">Shipping Fee</th>
                                                        <th className="text-center">Total Price</th>
                                                        <th className="text-center">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {state.selectedStoreID ?
                                                    <Query query={GET_ORDERS_CHINA} variables={{ id: state.selectedStoreID, filter: state.activeTab, offset: ((state.currentPage-1) * state.currentPageLimit) }} >
                                                        {({ data, loading, refetch, error }) => {
                                                            if(loading) {
                                                                return (
                                                                    <tr>
                                                                        <td colSpan="11" className="text-center">
                                                                            <Loading height={150} width={150} />
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }

                                                            state.totalApproved = 0;
                                                            if(data.getChinaOrders.length == 0){
                                                                return (
                                                                    <tr>
                                                                        <td colSpan="11" className="text-center">
                                                                            <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>Empty... check back soon!</span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }

                                                            return data.getChinaOrders.map((orders, o_index) => {
                                                                state.totalApproved += 1;
                                                                
                                                                if(orders.isRefactored){
                                                                    var hasShippingFee = orders.shipping_cost && orders.shipping_method && orders.shipping_days_min && orders.shipping_days_max ? true : false;
                                                                    return (
                                                                        <tr key={o_index} style={{backgroundColor: hasShippingFee ? 'inherit' : 'red'}}>
                                                                            <td className="text-center">{o_index+1}</td>
                                                                            <td className="text-center">
                                                                                {/* Date Approved */}
                                                                                {moment(new Date(parseInt(orders.date_approved))).startOf('second').fromNow()}
                                                                            </td>
                                                                            <td className="text-center">{orders.shipping_information.order_number}</td>
                                                                            <td>
                                                                                {/* Shipping Information */}
                                                                                <div className="ellipsis" style={{ width: 200 }}>
                                                                                    {orders.shipping_information.email ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Email">{orders.shipping_information.email}<br /></span> : void 0}
                                                                                    {orders.shipping_information.name ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Name">{orders.shipping_information.name}<br /></span> : void 0}
                                                                                    {orders.shipping_information.address1 ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Address1">{orders.shipping_information.address1}<br /></span> : void 0}
                                                                                    {orders.shipping_information.address2 ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Address2">{orders.shipping_information.address2} <br /></span> : void 0}
                                                                                    {orders.shipping_information.city ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="City">{orders.shipping_information.city}<br /></span> : void 0}
                                                                                    {orders.shipping_information.province ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Province">{orders.shipping_information.province ? orders.shipping_information.province + " (" + orders.shipping_information.province_code + ")" : ''}<br /></span> : void 0}
                                                                                    {orders.shipping_information.zip ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Zip">{orders.shipping_information.zip}<br /></span> : void 0}
                                                                                    {orders.shipping_information.country ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Country">{orders.shipping_information.country + " (" + orders.shipping_information.country_code + ")"}</span> : void 0}
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                {/* Product Name */}
                                                                                {(() => {
                                                                                    return orders.line_items.map((li, li_index) => {
                                                                                        if(li.vendor_link){
                                                                                            return <span key={li_index}><a href={li.vendor_link} target="_blank" title="Vendor link availalble click here.">{li.product_name}</a> {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                        } else {
                                                                                            return <span key={li_index}>{li.product_name} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                        }
                                                                                    })
                                                                                })()}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {/* Variant Name */}
                                                                                {(() => {
                                                                                    return orders.line_items.map((li, li_index) => {
                                                                                        return <span key={li_index}>{li.variant_name ? li.variant_name : "N/A"} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                    })
                                                                                })()}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {/* Order Quantity */}
                                                                                {(() => {
                                                                                    return orders.line_items.map((li, li_index) => {
                                                                                        return <span key={li_index}>{li.quantity+"x"} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                    })
                                                                                })()}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {/* Order Approved Price */}
                                                                                {(() => {
                                                                                    return orders.line_items.map((li, li_index) => {
                                                                                        return <span key={li_index}>{"$"+li.approve_price} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                    })
                                                                                })()}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {/* Shipping Fee */}
                                                                                {hasShippingFee &&
                                                                                    <span className="capitalize">
                                                                                        {orders.shipping_method}<br/>
                                                                                        {orders.shipping_days_min +"-"+ orders.shipping_days_max + " Days"} <br/>
                                                                                        {"$"+orders.shipping_cost}
                                                                                    </span>
                                                                                }
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {/* Total Price */}
                                                                                {(() => {
                                                                                    var totalPrice = 0;
                                                                                    orders.line_items.map((li, li_index) => {
                                                                                        totalPrice += li.quantity * li.approve_price;
                                                                                    })
                                                                                    hasShippingFee ? totalPrice += parseFloat(orders.shipping_cost) : void 0; 
    
                                                                                    return (
                                                                                        <span className="totalPrice">{"$"+parseFloat(totalPrice).toFixed(2)}</span>
                                                                                    );
                                                                                })()}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                <Mutation
                                                                                    mutation={DECIDE_ORDER}
                                                                                    variables={{
                                                                                        id: orders.id,
                                                                                        decision: "request" }}
                                                                                    >
                                                                                    {(approveOrder, { data, loading, error }) => {
                                                                                        return <button onClick={this.approveOrder.bind(this, approveOrder, "request", refetch)} className="dwobtn" style={{margin: 0}}> Undo </button>;
                                                                                    }}
                                                                                </Mutation>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }

                                                                var orderObj = JSON.parse(orders.orders);
                                                                return (
                                                                    <tr key={o_index}>
                                                                        <td className="text-center">
                                                                            {o_index+1} <br/>
                                                                            <Mutation
                                                                                mutation={UPDATE_ORDERS}
                                                                                variables={{
                                                                                    orders: JSON.stringify([orders]),
                                                                                    isWeight: true }}
                                                                                >
                                                                                {(updateRequestedOrder, { datass, loading, error }) => {
                                                                                    return <span className="fas fa-sync clickable" onClick={() => this.execUpdate(updateRequestedOrder, null, true)} />;
                                                                                }}
                                                                            </Mutation>
                                                                        </td>
                                                                        <td className="text-center">{moment(new Date(parseInt(orders.date_approved))).startOf('second').fromNow()}</td>
                                                                        <td className="text-center">{orderObj.name}</td>
                                                                        <td>
                                                                            {/* Shipping Information */}
                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.email}</span><br/>
                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.name}</span><br/>
                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.address1}</span><br/>
                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.city}</span><br/>
                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.province} {orderObj.shipping_address.zip}</span><br/>
                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.country}</span>
                                                                        </td>
                                                                        <td>
                                                                            {/* Product Name */}
                                                                            {(() => {
                                                                                return orderObj.line_items.map((li, li_index) => {
                                                                                    if(li.vendorLink){
                                                                                        return <span key={li_index}><a href={li.vendorLink} target="_blank" title="Vendor link availalble click here.">{li.title}</a> {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                                    } else {
                                                                                        return <span key={li_index}>{li.title} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                                    }
                                                                                })
                                                                            })()}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {/* Variant */}
                                                                            {(() => {
                                                                                return orderObj.line_items.map((li, li_index) => {
                                                                                    return <span key={li_index}>{li.variant_title ? li.variant_title : "N/A"} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                                })
                                                                            })()}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {/* Quantity */}
                                                                            {(() => {
                                                                                return orderObj.line_items.map((li, li_index) => {
                                                                                    return <span key={li_index}>{li.quantity+"x"} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                                })
                                                                            })()}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {/* Price */}
                                                                            {(() => {
                                                                                return orderObj.line_items.map((li, li_index) => {
                                                                                    return <span key={li_index}>{"$"+li.price} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>;
                                                                                })
                                                                            })()}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {/* Shipping Fee */}
                                                                            {orderObj.shipping_fee && orderObj.shipping_fee.shipping_methods[0].total_cost ?
                                                                                <span className="capitalize">
                                                                                    {orderObj.shipping_fee.shipping_methods[0].method}<br/>
                                                                                    {orderObj.shipping_fee.transit_min +"-"+ orderObj.shipping_fee.transit_max + " Days"} <br/>
                                                                                    {"$"+orderObj.shipping_fee.shipping_methods[0].total_cost}
                                                                                </span>
                                                                            : void 0}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {/* Total Price */}
                                                                            {(() => {
                                                                                var totalPrice = 0;
                                                                                orderObj.line_items.map((li, li_index) => {
                                                                                    totalPrice += li.quantity * li.price;
                                                                                })
                                                                                orderObj.shipping_fee ? totalPrice += orderObj.shipping_fee.shipping_methods[0].total_cost : void 0; 

                                                                                return (
                                                                                    <span className="totalPrice">{"$"+parseFloat(totalPrice).toFixed(2)}</span>
                                                                                );
                                                                            })()}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            <Mutation
                                                                                mutation={DECIDE_ORDER}
                                                                                variables={{
                                                                                    id: orders.id,
                                                                                    decision: "request" }}
                                                                                >
                                                                                {(approveOrder, { data, loading, error }) => {
                                                                                    return <button onClick={this.approveOrder.bind(this, approveOrder, "request", refetch)} className="dwobtn" style={{margin: 0}}> Undo </button>;
                                                                                }}
                                                                            </Mutation>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            });
                                                        }}
                                                    </Query>
                                                    :
                                                        <tr>
                                                            <td colSpan="11" className="text-center"><span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>Select Store to display approved order</span></td>
                                                        </tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            );
                        } else if(state.activeTab == "print label"){
                            return (
                                <div>
                                    <div className="column column_3_12">
                                        <div className="product-card">
                                            <div className="product-details" style={{overflow: 'hidden'}}>
                                                <div className="text-center">
                                                    <h3>Stores</h3>
                                                </div>
                                                <Query query={GET_ADMIN_ORDERS_CHINA_USERS} variables={{filter: "print label"}} onCompleted={data => {
                                                    data.getAdminChinaOrdersUSERS.forEach(user => {
                                                        var payload = { "query": "{\n  getPaidOrders(id: \""+user.id+"\") {\n    id\n    isVerified\n    trackingNumberAvailable\n    date_paid\n    total_payment\n    store_url\n    store_token\n    store_location_id\n    orders\n    trackingNumbers\n    is_packed\n    isRefactored\n    order_ids\n  }\n}\n", "variables": null, "operationName": null };
                                                        fetch('/graphql', {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                            },
                                                            body: JSON.stringify(payload)
                                                        })
                                                        .then(res => res.json())
                                                        .then(result => {
                                                            var isFinish = false;
                                                            var hasTracking = false;
                                                            var doneSearch = false;
                                                            var noTrackingSearchDone = false;
                                                            var daysAgo = null;
                                                            result.data.getPaidOrders.forEach(res => {
                                                                if(res.trackingNumberAvailable){
                                                                    var countOfPackOrder = res.is_packed.length;
                                                                    var countOfOrder = res.isRefactored ? res.order_ids.length : JSON.parse(res.orders).length;
                                                                    if(!noTrackingSearchDone){
                                                                        hasTracking = true;
                                                                    }
                                                                    if(!doneSearch && countOfPackOrder >= countOfOrder){
                                                                        isFinish = true;
                                                                    } else {
                                                                        isFinish = false;
                                                                        doneSearch = true;
                                                                        if(!daysAgo){
                                                                            daysAgo = parseInt(res.date_paid)
                                                                        }
                                                                    }
                                                                } else {
                                                                    isFinish = false;
                                                                    hasTracking = false;
                                                                    noTrackingSearchDone = true;
                                                                    if(!daysAgo){
                                                                        daysAgo = parseInt(res.date_paid)
                                                                    }
                                                                }
                                                            })
                                                            var info = this.state.userOrderInfo ? this.state.userOrderInfo : [];
                                                            info.push({
                                                                userID: user.id,
                                                                isFinish,
                                                                hasTracking,
                                                                date_paid: daysAgo
                                                            })
                                                            this.setState({
                                                                userOrderInfo: info
                                                            })
                                                        });
                                                    })
                                                }}>
                                                    {({ data, loading, refetch, error }) => {
                                                        if(loading) {
                                                            return (
                                                                <div className="text-center">
                                                                    <Loading height={150} width={150} />
                                                                </div>
                                                            );
                                                        }

                                                        if(data.getAdminChinaOrdersUSERS.length != 0){
                                                            return data.getAdminChinaOrdersUSERS.map((user, user_index) => {
                                                                var cn = "product-card";
                                                                if(state.selectedStoreID == user.id){
                                                                    cn += " card-active"
                                                                }
                                                                var storeData = {
                                                                    store_url: user.store_url,
                                                                    store_location_id: user.store_location_id,
                                                                    store_token: user.store_token,
                                                                    store_phone: user.store_phone
                                                                }
                                                                var userObject = null;
                                                                var crossColor = '#f28706';
                                                                if(state.userOrderInfo){
                                                                    userObject = state.userOrderInfo.filter(userdata => userdata.userID == user.id)[0];
                                                                    if(userObject){
                                                                        if(!userObject.isFinish){
                                                                            var daysAgo = moment(new Date(userObject.date_paid)).startOf('second').fromNow();
                                                                            if(daysAgo.toLowerCase().includes("days ago")){
                                                                                var days = parseInt(daysAgo.match(/\d*/).toString());
                                                                                if(days >= 7){
                                                                                    crossColor = 'red';
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                return (
                                                                    <div className={cn} key={user_index}>
                                                                        <div className="product-details" style={{overflow: 'hidden'}}>
                                                                            {user.recentPaid &&
                                                                                <span className="fas fa-circle" style={{position: 'absolute', top: 5, right: 5, color: 'red'}} />
                                                                            }
                                                                            <span className="fas fa-check" style={{position: 'absolute', top: 5, left: 5, color: '#4dae50', display: userObject ? userObject.hasTracking && userObject.isFinish ? 'block' : 'none' : 'none'}} />
                                                                            <span className="fas fa-times" style={{position: 'absolute', top: 5, left: 5, color: crossColor, display: userObject ? userObject.hasTracking && !userObject.isFinish ? 'block' : 'none' : 'none'}} />
                                                                            <span className="fas fa-shipping-fast" style={{position: 'absolute', top: 5, left: 20, color: 'red', display: userObject ? !userObject.hasTracking ? 'block' : 'none' : 'none'}} />
                                                                            <div className="column column_3_12" style={{padding: 0}}>
                                                                                <div style={{backgroundImage: user.profileImage ? 'url('+webConfig.siteURL+'/user-uploads/'+user.profileImage+')' : 'url('+webConfig.siteURL+'/assets/graphics/abstract_patterns/texture.jpg'+')', height: '5rem', borderRadius: '50%',   backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
                                                                            </div>
                                                                            <div className="column column_9_12 ellipsis" style={{whiteSpace: 'nowrap'}}>
                                                                                <strong>{user.store_url}</strong> <br/>
                                                                                {user.firstName} {user.lastName} <br/>
                                                                                <div className="float-right" style={{marginTop: 5}}>
                                                                                    <span className="clickable" onClick={() => this.openLogsModal(user.id, user.firstName+" "+user.lastName)}>
                                                                                        Logs &nbsp;<span className="fas fa-history"></span>
                                                                                    </span>
                                                                                    &nbsp;|&nbsp;
                                                                                    <span className="clickable" onClick={() => this.displayOrder(user.id, user.firstName+" "+user.lastName, storeData)}>
                                                                                        Details &nbsp;<span className="fas fa-arrow-right"></span>
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            });
                                                        } else {
                                                            return (
                                                                <div className="text-center">
                                                                    <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>No Store Available</span>
                                                                </div>
                                                            );
                                                        }
                                                    }}
                                                </Query>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column column_9_12">
                                        <div className="table-container clear">
                                            {state.selectedStoreID ?
                                                <Query query={GET_PAID_ORDER} variables={{ id: state.selectedStoreID }} >
                                                    {({ data, loading, refetch, error }) => {
                                                        if(loading) {
                                                            return (
                                                                <div className="product-card">
                                                                    <div className="product-details text-center">
                                                                        <Loading height={150} width={150} />
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        
                                                        if(data.getPaidOrders.length == 0){
                                                            return (
                                                                <div className="product-card">
                                                                    <div className="product-details text-center">
                                                                        <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>Empty... check back soon!</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }

                                                        return data.getPaidOrders.map((orders, o_index) => {
                                                            var exportDOM = (
                                                                <div style={{color: '#000'}}>
                                                                    <div className="column column_6_12" style={{whiteSpace: 'nowrap'}}>
                                                                        <button className="dwobtn stretch-width" onClick={() => this.exportToCSV(orders)}>Order Summary</button>
                                                                    </div>
                                                                    <div className="column column_6_12" style={{whiteSpace: 'nowrap'}}>
                                                                        <button className="dwobtn stretch-width" onClick={() => this.exportAllOrder(orders)}>All Order</button>
                                                                    </div>
                                                                </div>
                                                            );

                                                            if(orders.isRefactored){
                                                                return (
                                                                    <table className="table-list" key={"table"+o_index} style={{marginBottom: 20}}>
                                                                        <thead>
                                                                            <tr>
                                                                                <th colSpan="12" className="text-center">
                                                                                    <div style={{position: 'relative', float: 'left'}}>
                                                                                        <span style={{color: '#fff', position: 'absolute', left: 0, fontSize: 12, whiteSpace: 'nowrap'}}>ID: {orders.id}</span><br/>
                                                                                        <span className="clickable" style={{color: '#fff', position: 'absolute', left: 0, fontSize: 12, whiteSpace: 'nowrap'}} onClick={() => this.refreshOrder()}>Refresh Order</span>
                                                                                    </div>
                                                                                    {!orders.trackingNumberAvailable ?
                                                                                        <div style={{position: 'relative'}}>
                                                                                            <div style={{position: 'absolute', right: 0}}>
                                                                                                <div className="form_buttons" style={{marginTop: !orders.isVerified ? 10 : 0}}>
                                                                                                    <Popup
                                                                                                        trigger={<button className="btn" style={{padding: '5px 10px', marginRight: 10}}>Export to CSV</button>}
                                                                                                        position="bottom center"
                                                                                                        on="click" className="points-tooltip">
                                                                                                        <div className="helperText" style={{lineHeight: 1.5}}>
                                                                                                            {exportDOM}
                                                                                                        </div>
                                                                                                    </Popup>
                                                                                                    {/* <button className="btn" onClick={() => this.getTrackingNumber(orders, refetch)} style={{fontSize: 10, padding: 8}}>Get Tracking Number</button> */}
                                                                                                    {orders.isVerified ?
                                                                                                        <Popup
                                                                                                            trigger={<button className="btn" id={"order"+o_index} style={{fontSize: 10, padding: 8, backgroundColor: '#ff7e00'}}>Get Tracking Number</button>}
                                                                                                            position="bottom right"
                                                                                                            on="click" className="points-tooltip">
                                                                                                            <div className="text-center">
                                                                                                                <h3>Continue ?</h3>
                                                                                                                <h4 style={{color: '#000'}}>You will be charge ${parseFloat(state.totalShippingFee).toFixed(2)} to your boxC balance</h4>
                                                                                                                <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => {
                                                                                                                    this.setState({
                                                                                                                        orderObject: orders
                                                                                                                    }, () => {
                                                                                                                        this.getTrackingNumber(null, refetch, orders.order_ids);
                                                                                                                    })
                                                                                                                }}>
                                                                                                                    <i className="fas fa-check"></i>
                                                                                                                </button>
                                                                                                                &nbsp; | &nbsp;
                                                                                                                <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20}} onClick={() => document.getElementById("order"+o_index).click()}>
                                                                                                                    <i className="fas fa-times"></i>
                                                                                                                </button>
                                                                                                            </div>
                                                                                                        </Popup>
                                                                                                    :
                                                                                                        <span style={{padding: '5px 10px', border: '1px solid #fff'}}>Verifying payment please wait...</span>
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    :
                                                                                        <div style={{position: 'relative'}}>
                                                                                            <div style={{position: 'absolute', right: 10}}>
                                                                                                <div className="form_buttons">
                                                                                                    <Popup
                                                                                                        trigger={<button className="btn" style={{padding: '5px 10px', marginRight: 10}}>Export to CSV</button>}
                                                                                                        position="bottom center"
                                                                                                        on="click" className="points-tooltip">
                                                                                                        <div className="helperText" style={{lineHeight: 1.5}}>
                                                                                                            {exportDOM}
                                                                                                        </div>
                                                                                                    </Popup>
                                                                                                    <Popup
                                                                                                        trigger={<button id={"printall"+o_index} className="btn" style={{padding: '5px 10px'}}>Print All PDF</button>}
                                                                                                        position="left top"
                                                                                                        on="click" className="points-tooltip">
                                                                                                        <div className="text-center">
                                                                                                            <h3>BoxC can print multiple<br/>PDF up to 100</h3>
                                                                                                            <div className="form_wrap">
                                                                                                                <div className="column column_6_12">
                                                                                                                    <div className="form_row">
                                                                                                                        <div className="form_item">
                                                                                                                            <div className="form_input" style={{width: 60, margin: '0 auto'}}>
                                                                                                                                <label style={{color: '#555'}}>Minimum</label>
                                                                                                                                <input type="number" defaultValue="1" id={"min"+o_index} />
                                                                                                                                <span className="bottom_border"></span>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="column column_6_12">
                                                                                                                    <div className="form_row">
                                                                                                                        <div className="form_item">
                                                                                                                            <div className="form_input" style={{width: 60, margin: '0 auto'}}>
                                                                                                                                <label style={{color: '#555'}}>Maximum</label>
                                                                                                                                <input type="number" defaultValue="100" id={"max"+o_index} />
                                                                                                                                <span className="bottom_border"></span>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            {/* <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => this.printAllPDF(orders.trackingNumbers, (document.getElementById("min"+o_index).value-1), (document.getElementById("max"+o_index).value-1))}> */}
                                                                                                            <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => this.printAllPDFRefactored((document.getElementById("min"+o_index).value-1), (document.getElementById("max"+o_index).value-1))}>
                                                                                                                <i className="fas fa-check"></i>
                                                                                                            </button>
                                                                                                            &nbsp; | &nbsp;
                                                                                                            <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20}} onClick={() => document.getElementById("printall"+o_index).click()}>
                                                                                                                <i className="fas fa-times"></i>
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    </Popup>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    }
                                                                                    <span style={{fontSize: 20}}>{moment(new Date(parseInt(orders.date_paid))).startOf('second').fromNow()}</span> <br/>
                                                                                    <span style={{fontSize: 15}}>{"$"+orders.total_payment}</span>
                                                                                </th>
                                                                            </tr>
                                                                            <tr>
                                                                                <th className="text-center">#</th>
                                                                                <th width="200px">Shipping Information</th>
                                                                                <th className="clickable" onClick={() => this.sortOrderBy("OrderNumber")}>Order Number {state.sortBy == "OrderNumber" && <span className={state.isAsc ? "fas fa-arrow-up" : "fas fa-arrow-down"} />}</th>
                                                                                <th className="clickable" onClick={() => this.sortOrderBy("ProductName")}>Product {state.sortBy == "ProductName" && <span className={state.isAsc ? "fas fa-arrow-up" : "fas fa-arrow-down"} />}</th>
                                                                                <th className="text-center">Variant</th>
                                                                                <th className="text-center">Quantity</th>
                                                                                <th className="text-center">Dimension/Weight</th>
                                                                                <th className="text-center" width="10%">Price</th>
                                                                                <th className="text-center">Shipping Fee</th>
                                                                                <th className="text-center">Total Price</th>
                                                                                {orders.trackingNumberAvailable &&
                                                                                    <th className="text-center">Action</th>
                                                                                }
                                                                                {orders.trackingNumberAvailable &&
                                                                                    <th className="text-center">Packed</th>
                                                                                }
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {(() => {
                                                                                this.refetchOrder = [];
                                                                                return orders.order_ids.map((orderid, orderid_index) => {
                                                                                    return (
                                                                                        <Query query={GET_INDIVIDUAL_PAID_ORDER} variables={{ id: state.selectedStoreID, orderid: orderid }} key={orderid} onCompleted={data => {
                                                                                            if(data.getPaidOrder != null){
                                                                                                if(data.getPaidOrder.orders){
                                                                                                    var newOrderRefactor = JSON.parse(data.getPaidOrder.orders);
                                                                                                    var newPaidOrders = JSON.parse(JSON.stringify(data.getPaidOrder))
                                                                                                    newPaidOrders.order_id = newOrderRefactor.id.toString();
                                                                                                    newPaidOrders.shipping_cost = newOrderRefactor.shipping_fee.shipping_methods[0].total_cost;
                                                                                                    newPaidOrders.shipping_method = newOrderRefactor.shipping_fee.shipping_methods[0].method;
                                                                                                    newPaidOrders.shipping_days_min = newOrderRefactor.shipping_fee.transit_min;
                                                                                                    newPaidOrders.shipping_days_max = newOrderRefactor.shipping_fee.transit_max;
                                                                                                    newPaidOrders.shipping_information = {
                                                                                                        address1: newOrderRefactor.shipping_address.address1,
                                                                                                        address2: newOrderRefactor.shipping_address.address2,
                                                                                                        city: newOrderRefactor.shipping_address.city,
                                                                                                        company: newOrderRefactor.shipping_address.company,
                                                                                                        country: newOrderRefactor.shipping_address.country,
                                                                                                        country_code: newOrderRefactor.shipping_address.country_code,
                                                                                                        email: newOrderRefactor.email,
                                                                                                        name: newOrderRefactor.shipping_address.name,
                                                                                                        order_number: newOrderRefactor.name,
                                                                                                        phone: newOrderRefactor.shipping_address.phone,
                                                                                                        province: newOrderRefactor.shipping_address.province,
                                                                                                        province_code: newOrderRefactor.shipping_address.province_code,
                                                                                                        zip: newOrderRefactor.shipping_address.zip
                                                                                                    }
                                                                                                    newOrderRefactor.line_items.forEach(el => {
                                                                                                        newPaidOrders.line_items.push({
                                                                                                            approve_price: el.price,
                                                                                                            chinese_description: el.description,
                                                                                                            dg_code: el.dimension.dg_code,
                                                                                                            height: el.dimension.height,
                                                                                                            length: el.dimension.length,
                                                                                                            line_item_id: el.id.toString(),
                                                                                                            original_price: el.orig_price,
                                                                                                            product_id: el.product_id,
                                                                                                            product_name: el.title,
                                                                                                            quantity: el.quantity,
                                                                                                            variant_id: el.variant_id.toString(),
                                                                                                            variant_name: el.variant_title,
                                                                                                            vendor_link: el.vendorLink,
                                                                                                            weight: el.grams,
                                                                                                            width: el.dimension.width
                                                                                                        })
                                                                                                    })
                                                                                                    newPaidOrders.store_location_id = orders.store_location_id;
                                                                                                    newPaidOrders.store_token = orders.store_token;
                                                                                                    newPaidOrders.store_url = orders.store_url;
                                                                                                    newPaidOrders.shipping_service = newOrderRefactor.shipping_fee.service;
                                                                                                    
                                                                                                    var pushThisOrder = state.orderList;
                                                                                                    pushThisOrder.push(newPaidOrders)
                                                                                                    this.setState({
                                                                                                        totalShippingFee: state.totalShippingFee + parseFloat(newOrderRefactor.shipping_fee.shipping_methods[0].total_cost),
                                                                                                        orderList: pushThisOrder,
                                                                                                        orderObject: orders
                                                                                                    })
                                                                                                } else {
                                                                                                    var pushThisOrder = state.orderList;
                                                                                                    pushThisOrder.push(data.getPaidOrder);
                                                                                                    this.setState({
                                                                                                        totalShippingFee: state.totalShippingFee + parseFloat(data.getPaidOrder.shipping_cost),
                                                                                                        orderList: pushThisOrder,
                                                                                                        orderObject: orders
                                                                                                    })
                                                                                                }
                                                                                            }
                                                                                        }}>
                                                                                            {({ data, loading, refetch, error }) => {
                                                                                                if(loading) {
                                                                                                    return (
                                                                                                        <tr>
                                                                                                            <td colSpan="12" className="text-center">
                                                                                                                <Loading height={150} width={150} />
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    );
                                                                                                }

                                                                                                if(data.getPaidOrder == null){
                                                                                                    return null;
                                                                                                }

                                                                                                this.refetchOrder.push(refetch);

                                                                                                if(data.getPaidOrder.orders){
                                                                                                    // Dito papasok ung mga lumang order n nka stringify pa
                                                                                                    var newOrderRefactor = JSON.parse(data.getPaidOrder.orders);
                                                                                                    var is_packed = orders.is_packed.includes(data.getPaidOrder.id);
                                                                                                    var hasShippingFee = newOrderRefactor.shipping_fee.shipping_methods[0].cost && newOrderRefactor.shipping_fee.shipping_methods[0].method && newOrderRefactor.shipping_fee.transit_min && newOrderRefactor.shipping_fee.transit_max ? true : false;
                                                                                                    var hasTrackingNumber = true;
                                                                                                    if (orders.isVerified && orders.trackingNumberAvailable) {
                                                                                                        if (data.getPaidOrder.tracking_number) {
                                                                                                            hasTrackingNumber = true;
                                                                                                        } else {
                                                                                                            hasTrackingNumber = false;
                                                                                                        }
                                                                                                    }

                                                                                                    return (
                                                                                                        <tr style={{ backgroundColor: is_packed ? 'skyblue' : !hasTrackingNumber ? '#ff6b6b' : 'inherit' }} id={data.getPaidOrder.id}>
                                                                                                            <td className="text-center">{orderid_index + 1}</td>
                                                                                                            <td>
                                                                                                                {/* Shipping Information */}
                                                                                                                <div className="ellipsis" style={{ width: 200 }}>
                                                                                                                    {newOrderRefactor.email ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Email">{newOrderRefactor.email}<br /></span> : void 0}
                                                                                                                    {newOrderRefactor.shipping_address.name ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Name">{newOrderRefactor.shipping_address.name}<br /></span> : void 0}
                                                                                                                    {newOrderRefactor.shipping_address.address1 ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Address1">{newOrderRefactor.shipping_address.address1}<br /></span> : void 0}
                                                                                                                    {newOrderRefactor.shipping_address.address2 ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Address2">{newOrderRefactor.shipping_address.address2} <br /></span> : void 0}
                                                                                                                    {newOrderRefactor.shipping_address.city ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="City">{newOrderRefactor.shipping_address.city}<br /></span> : void 0}
                                                                                                                    {newOrderRefactor.shipping_address.province ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Province">{newOrderRefactor.shipping_address.province ? newOrderRefactor.shipping_address.province + " (" + newOrderRefactor.shipping_address.province_code + ")" : ''}<br /></span> : void 0}
                                                                                                                    {newOrderRefactor.shipping_address.zip ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Zip">{newOrderRefactor.shipping_address.zip}<br /></span> : void 0}
                                                                                                                    {newOrderRefactor.shipping_address.country ? <span className="ellipsis" style={{ whiteSpace: 'nowrap' }} title="Country">{newOrderRefactor.shipping_address.country + " (" + newOrderRefactor.shipping_address.country_code + ")"}</span> : void 0}
                                                                                                                    {/* Edit Shipping Address */}
                                                                                                                    {!hasTrackingNumber &&
                                                                                                                        <div className="text-right">
                                                                                                                            <button className="dwobtn" style={{padding: 0, margin: 0, color: '#fff'}}>Edit</button>
                                                                                                                        </div>
                                                                                                                    }
                                                                                                                </div>
                                                                                                            </td>
                                                                                                            <td className="text-center">
                                                                                                                {newOrderRefactor.name}
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                {/* Product Name */}
                                                                                                                {(() => {
                                                                                                                    return newOrderRefactor.line_items.map((li, li_index) => {
                                                                                                                        if (li.vendorLink) {
                                                                                                                            return <span key={li_index}><a href={li.vendorLink} target="_blank" title="Vendor link availalble click here.">{li.title}</a> {(li_index + 1) != newOrderRefactor.line_items.length ? <hr /> : void 0}</span>
                                                                                                                        } else {
                                                                                                                            return <span key={li_index}>{li.title} {(li_index + 1) != newOrderRefactor.line_items.length ? <hr /> : void 0}</span>
                                                                                                                        }
                                                                                                                    })
                                                                                                                })()}
                                                                                                            </td>
                                                                                                            <td className="text-center">
                                                                                                                {/* Variant Name */}
                                                                                                                {(() => {
                                                                                                                    return newOrderRefactor.line_items.map((li, li_index) => {
                                                                                                                        return <span key={li_index}>{li.variant_title ? li.variant_title : "N/A"} {(li_index + 1) != newOrderRefactor.line_items.length ? <hr /> : void 0}</span>
                                                                                                                    })
                                                                                                                })()}
                                                                                                            </td>
                                                                                                            <td className="text-center">
                                                                                                                {/* Order Quantity */}
                                                                                                                {(() => {
                                                                                                                    return newOrderRefactor.line_items.map((li, li_index) => {
                                                                                                                        return <span key={li_index}>{li.quantity + "x"} {(li_index + 1) != newOrderRefactor.line_items.length ? <hr /> : void 0}</span>
                                                                                                                    })
                                                                                                                })()}
                                                                                                            </td>
                                                                                                            <td className="text-center">
                                                                                                                {/* Dimension */}
                                                                                                                {(() => {
                                                                                                                    return newOrderRefactor.line_items.map((li, li_index) => {
                                                                                                                        return <span key={li_index}>{(li.grams / 1000) + "kg"}<br />{li.dimension ? li.dimension.width && li.dimension.height && li.dimension.length ? li.dimension.width + "cm x " + li.dimension.height + "cm x " + li.dimension.length + "cm" : void 0 : void 0} {(li_index + 1) != newOrderRefactor.line_items.length ? <hr /> : void 0}</span>;
                                                                                                                    })
                                                                                                                })()}
                                                                                                            </td>
                                                                                                            <td className="text-center">
                                                                                                                {/* Order Approved Price */}
                                                                                                                {(() => {
                                                                                                                    return newOrderRefactor.line_items.map((li, li_index) => {
                                                                                                                        return <span key={li_index}>{"$" + li.price} {(li_index + 1) != newOrderRefactor.line_items.length ? <hr /> : void 0}</span>
                                                                                                                    })
                                                                                                                })()}
                                                                                                            </td>
                                                                                                            <td className="text-center">
                                                                                                                {/* Shipping Fee */}
                                                                                                                {hasShippingFee &&
                                                                                                                    <span className="capitalize">
                                                                                                                        {newOrderRefactor.shipping_fee.shipping_methods[0].method}<br />
                                                                                                                        {newOrderRefactor.shipping_fee.transit_min + "-" + newOrderRefactor.shipping_fee.transit_max + " Days"} <br />
                                                                                                                        {"$" + newOrderRefactor.shipping_fee.shipping_methods[0].cost}
                                                                                                                    </span>
                                                                                                                }
                                                                                                            </td>
                                                                                                            <td className="text-center">
                                                                                                                {/* Total Price */}
                                                                                                                {(() => {
                                                                                                                    var totalPrice = 0;
                                                                                                                    newOrderRefactor.line_items.map((li, li_index) => {
                                                                                                                        totalPrice += li.quantity * li.price;
                                                                                                                    })
                                                                                                                    if(hasShippingFee){
                                                                                                                        totalPrice += newOrderRefactor.shipping_fee.shipping_methods[0].cost
                                                                                                                    }

                                                                                                                    return (
                                                                                                                        <span className="totalPrice">{"$" + parseFloat(totalPrice).toFixed(2)}</span>
                                                                                                                    );
                                                                                                                })()}
                                                                                                            </td>
                                                                                                            {orders.trackingNumberAvailable &&
                                                                                                                <td>
                                                                                                                    <div className="form_buttons">
                                                                                                                        {!hasTrackingNumber ?
                                                                                                                            <div className="text-center">
                                                                                                                                <button className="one-line-ellipsis dwobtn" style={{ padding: 5, fontSize: 12, margin: 0 }} onClick={() => {
                                                                                                                                    var newOrderRefactor = JSON.parse(data.getPaidOrder.orders);
                                                                                                                                    var newPaidOrders = JSON.parse(JSON.stringify(data.getPaidOrder))
                                                                                                                                    newPaidOrders.order_id = newOrderRefactor.id.toString();
                                                                                                                                    newPaidOrders.shipping_cost = newOrderRefactor.shipping_fee.shipping_methods[0].total_cost;
                                                                                                                                    newPaidOrders.shipping_method = newOrderRefactor.shipping_fee.shipping_methods[0].method;
                                                                                                                                    newPaidOrders.shipping_days_min = newOrderRefactor.shipping_fee.transit_min;
                                                                                                                                    newPaidOrders.shipping_days_max = newOrderRefactor.shipping_fee.transit_max;
                                                                                                                                    newPaidOrders.shipping_information = {
                                                                                                                                        address1: newOrderRefactor.shipping_address.address1,
                                                                                                                                        address2: newOrderRefactor.shipping_address.address2,
                                                                                                                                        city: newOrderRefactor.shipping_address.city,
                                                                                                                                        company: newOrderRefactor.shipping_address.company,
                                                                                                                                        country: newOrderRefactor.shipping_address.country,
                                                                                                                                        country_code: newOrderRefactor.shipping_address.country_code,
                                                                                                                                        email: newOrderRefactor.email,
                                                                                                                                        name: newOrderRefactor.shipping_address.name,
                                                                                                                                        order_number: newOrderRefactor.name,
                                                                                                                                        phone: newOrderRefactor.shipping_address.phone,
                                                                                                                                        province: newOrderRefactor.shipping_address.province,
                                                                                                                                        province_code: newOrderRefactor.shipping_address.province_code,
                                                                                                                                        zip: newOrderRefactor.shipping_address.zip
                                                                                                                                    }
                                                                                                                                    newOrderRefactor.line_items.forEach(el => {
                                                                                                                                        newPaidOrders.line_items.push({
                                                                                                                                            approve_price: el.price,
                                                                                                                                            chinese_description: el.description,
                                                                                                                                            dg_code: el.dimension.dg_code,
                                                                                                                                            height: el.dimension.height,
                                                                                                                                            length: el.dimension.length,
                                                                                                                                            line_item_id: el.id.toString(),
                                                                                                                                            original_price: el.orig_price,
                                                                                                                                            product_id: el.product_id,
                                                                                                                                            product_name: el.title,
                                                                                                                                            quantity: el.quantity,
                                                                                                                                            variant_id: el.variant_id.toString(),
                                                                                                                                            variant_name: el.variant_title,
                                                                                                                                            vendor_link: el.vendorLink,
                                                                                                                                            weight: el.grams,
                                                                                                                                            width: el.dimension.width
                                                                                                                                        })
                                                                                                                                    })
                                                                                                                                    newPaidOrders.store_location_id = orders.store_location_id;
                                                                                                                                    newPaidOrders.store_token = orders.store_token;
                                                                                                                                    newPaidOrders.store_url = orders.store_url;
                                                                                                                                    newPaidOrders.shipping_service = newOrderRefactor.shipping_fee.service;
                                                                                                                                    
                                                                                                                                    this.setState({
                                                                                                                                        orderList: [newPaidOrders],
                                                                                                                                        orderObject: orders
                                                                                                                                    }, () => {
                                                                                                                                        this.getTrackingNumber(null, refetch, orders.order_ids)
                                                                                                                                    })
                                                                                                                                }}>ReTrack</button>
                                                                                                                                <br />
                                                                                                                                OR
                                                                                                                                <br />
                                                                                                                                <Popup
                                                                                                                                    trigger={<button className="one-line-ellipsis dwobtn" title="Add Tracking Number" style={{ padding: 5, fontSize: 12, margin: 0 }}>Add TN</button>}
                                                                                                                                    position="left center"
                                                                                                                                    on="click" className="points-tooltip">
                                                                                                                                    <div className="helperText" style={{ padding: 10, lineHeight: 1.5 }}>
                                                                                                                                        <div className="form_wrap">
                                                                                                                                            <div className="form_row" style={{ margin: 0 }}>
                                                                                                                                                <div className="form_item">
                                                                                                                                                    <label>Manually Add Tracking Number</label>
                                                                                                                                                    <div className="form_input">
                                                                                                                                                        {/* Refactor add manual tracking number */}
                                                                                                                                                        <input type="text" defaultValue="" onBlur={event => this.addTrackingNumber(orders.id, data.getPaidOrder.id, null, event.target.value, orders.store_url, orders.store_token, orders.store_location_id, refetch, newOrderRefactor.line_items, newOrderRefactor.order_id)} />
                                                                                                                                                        <span className="bottom_border"></span>
                                                                                                                                                    </div>
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                </Popup>
                                                                                                                            </div>
                                                                                                                            :
                                                                                                                            <button className="btn" onClick={() => this.getOrderObject(data.getPaidOrder.id)} style={{ padding: 5, fontSize: 12 }}> Print PDF </button>
                                                                                                                        }
                                                                                                                    </div>
                                                                                                                </td>
                                                                                                            }
                                                                                                            {orders.trackingNumberAvailable &&
                                                                                                                <td>
                                                                                                                    <label className="switch">
                                                                                                                        <Mutation
                                                                                                                            mutation={MARK_ORDER_AS_PACKED}
                                                                                                                            variables={{
                                                                                                                                paidID: orders.id,
                                                                                                                                orderID: data.getPaidOrder.id,
                                                                                                                                shouldSave: !is_packed
                                                                                                                            }}
                                                                                                                        >
                                                                                                                            {(markAsPacked, { data, loading, error }) => {
                                                                                                                                return <input type="checkbox" checked={is_packed} onChange={() => this.markAsPacked(markAsPacked, refetch)} />
                                                                                                                            }}
                                                                                                                        </Mutation>
                                                                                                                        <span className="slider round"></span>
                                                                                                                    </label>
                                                                                                                </td>
                                                                                                            }
                                                                                                        </tr>
                                                                                                    );
                                                                                                }
                                                                                                
                                                                                                var is_packed = orders.is_packed.includes(data.getPaidOrder.id);
                                                                                                var hasShippingFee = data.getPaidOrder.shipping_cost && data.getPaidOrder.shipping_method && data.getPaidOrder.shipping_days_min && data.getPaidOrder.shipping_days_max ? true : false;
                                                                                                var hasTrackingNumber =  true;
                                                                                                if(orders.isVerified && orders.trackingNumberAvailable){
                                                                                                    if(data.getPaidOrder.tracking_number){
                                                                                                        hasTrackingNumber = true;
                                                                                                    } else {
                                                                                                        hasTrackingNumber = false;
                                                                                                    }
                                                                                                }
                                                                                                
                                                                                                return (
                                                                                                    <tr style={{ backgroundColor: is_packed ? 'skyblue' : !hasTrackingNumber ? '#ff6b6b' : 'inherit' }} id={data.getPaidOrder.id}>
                                                                                                        <td className="text-center">{orderid_index + 1}</td>
                                                                                                        <td>
                                                                                                            {/* Shipping Information */}
                                                                                                            <div className="ellipsis" style={{width: 200}}>
                                                                                                                {data.getPaidOrder.shipping_information.email ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Email">{data.getPaidOrder.shipping_information.email}<br/></span> : void 0}
                                                                                                                {data.getPaidOrder.shipping_information.name ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Name">{data.getPaidOrder.shipping_information.name}<br/></span> : void 0}
                                                                                                                {data.getPaidOrder.shipping_information.address1 ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Address1">{data.getPaidOrder.shipping_information.address1}<br/></span> : void 0}
                                                                                                                {data.getPaidOrder.shipping_information.address2 ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Address2">{data.getPaidOrder.shipping_information.address2} <br/></span>: void 0}
                                                                                                                {data.getPaidOrder.shipping_information.city ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="City">{data.getPaidOrder.shipping_information.city}<br/></span> : void 0}
                                                                                                                {data.getPaidOrder.shipping_information.province ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Province">{data.getPaidOrder.shipping_information.province ? data.getPaidOrder.shipping_information.province +" ("+data.getPaidOrder.shipping_information.province_code+")" : ''}<br/></span> : void 0}
                                                                                                                {data.getPaidOrder.shipping_information.zip ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Zip">{data.getPaidOrder.shipping_information.zip}<br/></span> : void 0}
                                                                                                                {data.getPaidOrder.shipping_information.country ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Country">{data.getPaidOrder.shipping_information.country+" ("+data.getPaidOrder.shipping_information.country_code+")"}</span> : void 0}
                                                                                                                {/* Edit Shipping Address */}
                                                                                                                {!hasTrackingNumber &&
                                                                                                                    <div className="text-right">
                                                                                                                        <button className="dwobtn" style={{padding: 0, margin: 0, color: '#fff'}}>Edit</button>
                                                                                                                    </div>
                                                                                                                }
                                                                                                            </div>
                                                                                                        </td>
                                                                                                        <td className="text-center">
                                                                                                            {data.getPaidOrder.shipping_information.order_number}
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            {/* Product Name */}
                                                                                                            {(() => {
                                                                                                                return data.getPaidOrder.line_items.map((li, li_index) => {
                                                                                                                    if(li.vendor_link){
                                                                                                                        return <span key={li_index}><a href={li.vendor_link} target="_blank" title="Vendor link availalble click here.">{li.product_name}</a> {(li_index + 1) != data.getPaidOrder.line_items.length ? <hr/> : void 0}</span>
                                                                                                                    } else {
                                                                                                                        return <span key={li_index}>{li.product_name} {(li_index + 1) != data.getPaidOrder.line_items.length ? <hr/> : void 0}</span>
                                                                                                                    }
                                                                                                                })
                                                                                                            })()}
                                                                                                        </td>
                                                                                                        <td className="text-center">
                                                                                                            {/* Variant Name */}
                                                                                                            {(() => {
                                                                                                                return data.getPaidOrder.line_items.map((li, li_index) => {
                                                                                                                    return <span key={li_index}>{li.variant_name ? li.variant_name : "N/A"} {(li_index + 1) != data.getPaidOrder.line_items.length ? <hr/> : void 0}</span>
                                                                                                                })
                                                                                                            })()}
                                                                                                        </td>
                                                                                                        <td className="text-center">
                                                                                                            {/* Order Quantity */}
                                                                                                            {(() => {
                                                                                                                return data.getPaidOrder.line_items.map((li, li_index) => {
                                                                                                                    return <span key={li_index}>{li.quantity+"x"} {(li_index + 1) != data.getPaidOrder.line_items.length ? <hr/> : void 0}</span>
                                                                                                                })
                                                                                                            })()}
                                                                                                        </td>
                                                                                                        <td className="text-center">
                                                                                                            {/* Dimension */}
                                                                                                            {(() => {
                                                                                                                return data.getPaidOrder.line_items.map((li, li_index) => {
                                                                                                                    return <span key={li_index}>{(li.weight / 1000)+"kg"}<br/>{li.width && li.height && li.length ? li.width+"cm x "+li.height+"cm x "+li.length+"cm" : void 0} {(li_index + 1) != data.getPaidOrder.line_items.length ? <hr/> : void 0}</span>;
                                                                                                                })
                                                                                                            })()}
                                                                                                        </td>
                                                                                                        <td className="text-center">
                                                                                                            {/* Order Approved Price */}
                                                                                                            {(() => {
                                                                                                                return data.getPaidOrder.line_items.map((li, li_index) => {
                                                                                                                    return <span key={li_index}>{"$"+li.approve_price} {(li_index + 1) != data.getPaidOrder.line_items.length ? <hr/> : void 0}</span>
                                                                                                                })
                                                                                                            })()}
                                                                                                        </td>
                                                                                                        <td className="text-center">
                                                                                                            {/* Shipping Fee */}
                                                                                                            {hasShippingFee &&
                                                                                                                <span className="capitalize">
                                                                                                                    {data.getPaidOrder.shipping_method}<br/>
                                                                                                                    {data.getPaidOrder.shipping_days_min +"-"+ data.getPaidOrder.shipping_days_max + " Days"} <br/>
                                                                                                                    {"$"+data.getPaidOrder.shipping_cost}
                                                                                                                </span>
                                                                                                            }
                                                                                                        </td>
                                                                                                        <td className="text-center">
                                                                                                            {/* Total Price */}
                                                                                                            {(() => {
                                                                                                                var totalPrice = 0;
                                                                                                                data.getPaidOrder.line_items.map((li, li_index) => {
                                                                                                                    totalPrice += li.quantity * li.approve_price;
                                                                                                                })
                                                                                                                totalPrice += parseFloat(data.getPaidOrder.shipping_cost);

                                                                                                                return (
                                                                                                                    <span className="totalPrice">{"$"+parseFloat(totalPrice).toFixed(2)}</span>
                                                                                                                );
                                                                                                            })()}
                                                                                                        </td>
                                                                                                        {orders.trackingNumberAvailable &&
                                                                                                            <td>
                                                                                                                <div className="form_buttons">
                                                                                                                {!hasTrackingNumber ?
                                                                                                                    <div className="text-center">
                                                                                                                        <button className="one-line-ellipsis dwobtn" style={{padding: 5, fontSize: 12, margin: 0}} onClick={() => {
                                                                                                                            this.setState({
                                                                                                                                orderList: [data.getPaidOrder],
                                                                                                                                orderObject: orders
                                                                                                                            }, () => {
                                                                                                                                this.getTrackingNumber(null, refetch, orders.order_ids)
                                                                                                                            })
                                                                                                                        }}>ReTrack</button>
                                                                                                                        <br/>
                                                                                                                        OR
                                                                                                                        <br/>
                                                                                                                        <Popup
                                                                                                                            trigger={<button className="one-line-ellipsis dwobtn" title="Add Tracking Number" style={{padding: 5, fontSize: 12, margin: 0}}>Add TN</button>}
                                                                                                                            position="left center"
                                                                                                                            on="click" className="points-tooltip">
                                                                                                                            <div className="helperText" style={{padding: 10, lineHeight: 1.5}}>
                                                                                                                                <div className="form_wrap">
                                                                                                                                    <div className="form_row" style={{margin: 0}}>
                                                                                                                                        <div className="form_item">
                                                                                                                                            <label>Manually Add Tracking Number</label>
                                                                                                                                            <div className="form_input">
                                                                                                                                                {/* Refactor add manual tracking number */}
                                                                                                                                                <input type="text" defaultValue="" onBlur={event => this.addTrackingNumber(orders.id, data.getPaidOrder.id, null, event.target.value, orders.store_url, orders.store_token, orders.store_location_id, refetch, data.getPaidOrder.line_items, data.getPaidOrder.order_id)} />
                                                                                                                                                <span className="bottom_border"></span>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </Popup>
                                                                                                                        <br/><br/>
                                                                                                                    </div>
                                                                                                                :
                                                                                                                    <button className="btn" onClick={() => this.getOrderObject(data.getPaidOrder.id)} style={{padding: 5, fontSize: 12}}> Print PDF </button>
                                                                                                                }
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    }
                                                                                                    {orders.trackingNumberAvailable &&
                                                                                                        <td>
                                                                                                            <label className="switch">
                                                                                                                <Mutation
                                                                                                                    mutation={MARK_ORDER_AS_PACKED}
                                                                                                                    variables={{
                                                                                                                        paidID: orders.id,
                                                                                                                        orderID: data.getPaidOrder.id,
                                                                                                                        shouldSave: !is_packed }}
                                                                                                                    >
                                                                                                                    {(markAsPacked, { data, loading, error }) => {
                                                                                                                        return <input type="checkbox" checked={is_packed} onChange={() => this.markAsPacked(markAsPacked, refetch)} />
                                                                                                                    }}
                                                                                                                </Mutation>
                                                                                                                <span className="slider round"></span>
                                                                                                            </label>
                                                                                                        </td>
                                                                                                    }
                                                                                                    </tr>
                                                                                                );
                                                                                            }}
                                                                                        </Query>
                                                                                    );
                                                                                })
                                                                            })()}
                                                                        </tbody>
                                                                    </table>
                                                                );
                                                            }

                                                            var totalShippingFee = 0;
                                                            var orderss = JSON.parse(orders.orders);
                                                            orderss.forEach((order, o_index) => {
                                                                var orderObj = JSON.parse(order.orders);
                                                                if(orderObj.shipping_fee && orderObj.shipping_fee.shipping_methods[0].total_cost){
                                                                    totalShippingFee += orderObj.shipping_fee.shipping_methods[0].total_cost
                                                                }
                                                            })
                                                            return (
                                                                <table className="table-list" key={"table"+o_index} style={{marginBottom: 20}}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th colSpan="12" className="text-center">
                                                                                <div style={{position: 'relative', float: 'left'}}>
                                                                                    <span style={{color: '#fff', position: 'absolute', left: 0, fontSize: 12, whiteSpace: 'nowrap'}}>ID: {orders.id}</span><br/>
                                                                                    <span className="clickable" style={{color: '#fff', position: 'absolute', left: 0, fontSize: 12, whiteSpace: 'nowrap'}} onClick={() => this.checkTrackingIfAvailable(orders)}>Check Tracking</span>
                                                                                </div>
                                                                                {!orders.trackingNumberAvailable ?
                                                                                    <div style={{position: 'relative'}}>
                                                                                        <div style={{position: 'absolute', right: 0}}>
                                                                                            <div className="form_buttons" style={{marginTop: !orders.isVerified ? 10 : 0}}>
                                                                                                <Popup
                                                                                                    trigger={<button className="btn" style={{padding: '5px 10px', marginRight: 10}}>Export to CSV</button>}
                                                                                                    position="bottom center"
                                                                                                    on="click" className="points-tooltip">
                                                                                                    <div className="helperText" style={{lineHeight: 1.5}}>
                                                                                                        {exportDOM}
                                                                                                    </div>
                                                                                                </Popup>
                                                                                                {/* <button className="btn" onClick={() => this.getTrackingNumber(orders, refetch)} style={{fontSize: 10, padding: 8}}>Get Tracking Number</button> */}
                                                                                                {orders.isVerified ?
                                                                                                    <Popup
                                                                                                        trigger={<button className="btn" id={"order"+o_index} style={{fontSize: 10, padding: 8, backgroundColor: '#ff7e00'}}>Get Tracking Number</button>}
                                                                                                        position="bottom right"
                                                                                                        on="click" className="points-tooltip">
                                                                                                        <div className="text-center">
                                                                                                            <h3>Continue ?</h3>
                                                                                                            <h4 style={{color: '#000'}}>You will be charge ${totalShippingFee.toFixed(2)} to your boxC balance</h4>
                                                                                                            <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => this.getTrackingNumber(orders, refetch)}>
                                                                                                                <i className="fas fa-check"></i>
                                                                                                            </button>
                                                                                                            &nbsp; | &nbsp;
                                                                                                            <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20}} onClick={() => document.getElementById("order"+o_index).click()}>
                                                                                                                <i className="fas fa-times"></i>
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    </Popup>
                                                                                                :
                                                                                                    <span style={{padding: '5px 10px', border: '1px solid #fff'}}>Verifying payment please wait...</span>
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                :
                                                                                    <div style={{position: 'relative'}}>
                                                                                        <div style={{position: 'absolute', right: 10}}>
                                                                                            <div className="form_buttons">
                                                                                                <Popup
                                                                                                    trigger={<button className="btn" style={{padding: '5px 10px', marginRight: 10}}>Export to CSV</button>}
                                                                                                    position="bottom center"
                                                                                                    on="click" className="points-tooltip">
                                                                                                    <div className="helperText" style={{lineHeight: 1.5}}>
                                                                                                        {exportDOM}
                                                                                                    </div>
                                                                                                </Popup>
                                                                                                <Popup
                                                                                                    trigger={<button id={"printall"+o_index} className="btn" style={{padding: '5px 10px'}}>Print All PDF</button>}
                                                                                                    position="left top"
                                                                                                    on="click" className="points-tooltip">
                                                                                                    <div className="text-center">
                                                                                                        <h3>BoxC can print multiple<br/>PDF up to 100</h3>
                                                                                                        <div className="form_wrap">
                                                                                                            <div className="column column_6_12">
                                                                                                                <div className="form_row">
                                                                                                                    <div className="form_item">
                                                                                                                        <div className="form_input" style={{width: 60, margin: '0 auto'}}>
                                                                                                                            <label style={{color: '#555'}}>Minimum</label>
                                                                                                                            <input type="number" defaultValue="1" id={"min"+o_index} />
                                                                                                                            <span className="bottom_border"></span>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="column column_6_12">
                                                                                                                <div className="form_row">
                                                                                                                    <div className="form_item">
                                                                                                                        <div className="form_input" style={{width: 60, margin: '0 auto'}}>
                                                                                                                            <label style={{color: '#555'}}>Maximum</label>
                                                                                                                            <input type="number" defaultValue="100" id={"max"+o_index} />
                                                                                                                            <span className="bottom_border"></span>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        {/* <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => this.printAllPDF(orders.trackingNumbers, (document.getElementById("min"+o_index).value-1), (document.getElementById("max"+o_index).value-1))}> */}
                                                                                                        <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => this.printAllPDF(orders, (document.getElementById("min"+o_index).value-1), (document.getElementById("max"+o_index).value-1))}>
                                                                                                            <i className="fas fa-check"></i>
                                                                                                        </button>
                                                                                                        &nbsp; | &nbsp;
                                                                                                        <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20}} onClick={() => document.getElementById("printall"+o_index).click()}>
                                                                                                            <i className="fas fa-times"></i>
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </Popup>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                <span style={{fontSize: 20}}>{moment(new Date(parseInt(orders.date_paid))).startOf('second').fromNow()}</span> <br/>
                                                                                <span style={{fontSize: 15}}>{"$"+orders.total_payment}</span>
                                                                            </th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="text-center">#</th>
                                                                            <th width="200px">Shipping Information</th>
                                                                            <th className="clickable" onClick={() => this.sortOrderBy("OrderNumber")}>Order Number {state.sortBy == "OrderNumber" && <span className={state.isAsc ? "fas fa-arrow-up" : "fas fa-arrow-down"} />}</th>
                                                                            <th className="clickable" onClick={() => this.sortOrderBy("ProductName")}>Product {state.sortBy == "ProductName" && <span className={state.isAsc ? "fas fa-arrow-up" : "fas fa-arrow-down"} />}</th>
                                                                            <th className="text-center">Variant</th>
                                                                            <th className="text-center">Quantity</th>
                                                                            <th className="text-center">Dimension/Weight</th>
                                                                            <th className="text-center" width="10%">Price</th>
                                                                            <th className="text-center">Shipping Fee</th>
                                                                            <th className="text-center">Total Price</th>
                                                                            {orders.trackingNumberAvailable &&
                                                                                <th className="text-center">Action</th>
                                                                            }
                                                                            {orders.trackingNumberAvailable &&
                                                                                <th className="text-center">Packed</th>
                                                                            }
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {(() => {
                                                                            orderss = orderss.sort((prev,current) => {
                                                                                var a = JSON.parse(prev.orders)
                                                                                var b = JSON.parse(current.orders)
                                                                                if(state.isAsc){
                                                                                    if(state.sortBy == "OrderNumber"){
                                                                                        return b.name > a.name ? -1 : 1;
                                                                                    } else {
                                                                                        return b.line_items[0].name > a.line_items[0].name ? -1 : 1;
                                                                                    }
                                                                                } else {
                                                                                    if(state.sortBy == "OrderNumber"){
                                                                                        return b.name > a.name ? 1 : -1;
                                                                                    } else {
                                                                                        return b.line_items[0].name > a.line_items[0].name ? 1 : -1;
                                                                                    }
                                                                                }
                                                                            })
                                                                            return orderss.map((order, o_index) => {
                                                                                var orderObj = JSON.parse(order.orders);
                                                                                var is_packed = orders.is_packed.includes(order._id);
                                                                                return (
                                                                                    <tr key={o_index} style={{backgroundColor: is_packed ? 'skyblue' : 'inherit'}} id={order._id}>
                                                                                        <td className="text-center">{o_index+1}</td>
                                                                                        <td>
                                                                                            {/* Shipping Information */}
                                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.email}</span><br/>
                                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.name}</span><br/>
                                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.address1}</span><br/>
                                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.city}</span><br/>
                                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.province} {orderObj.shipping_address.zip}</span><br/>
                                                                                            <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.country}</span>
                                                                                        </td>
                                                                                        <td className="text-center">
                                                                                            {orderObj.name}
                                                                                        </td>
                                                                                        <td>
                                                                                            {/* Product Name */}
                                                                                            {(() => {
                                                                                                return orderObj.line_items.map((li, li_index) => {
                                                                                                    if(li.vendorLink){
                                                                                                        return <span key={li_index}><a href={li.vendorLink} target="_blank" title="Vendor link availalble click here.">{li.title}</a> {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                                                    } else {
                                                                                                        return <span key={li_index}>{li.title} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                                                    }
                                                                                                })
                                                                                            })()}
                                                                                        </td>
                                                                                        <td className="text-center">
                                                                                            {/* Variant */}
                                                                                            {(() => {
                                                                                                return orderObj.line_items.map((li, li_index) => {
                                                                                                    return <span key={li_index}>{li.variant_title ? li.variant_title : "N/A"} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                                                })
                                                                                            })()}
                                                                                        </td>
                                                                                        <td className="text-center">
                                                                                            {/* Quantity */}
                                                                                            {(() => {
                                                                                                return orderObj.line_items.map((li, li_index) => {
                                                                                                    return <span key={li_index}>{li.quantity+"x"} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                                                })
                                                                                            })()}
                                                                                        </td>
                                                                                        <td className="text-center">
                                                                                            {/* Dimension */}
                                                                                            {(() => {
                                                                                                return orderObj.line_items.map((li, li_index) => {
                                                                                                    return <span key={li_index}>{(li.grams / 1000)+"kg"}<br/>{li.dimension ? li.dimension.width+"cm x "+li.dimension.height+"cm x "+li.dimension.length+"cm" : void 0} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>;
                                                                                                })
                                                                                            })()}
                                                                                        </td>
                                                                                        <td className="text-center">
                                                                                            {/* Price */}
                                                                                            {(() => {
                                                                                                return orderObj.line_items.map((li, li_index) => {
                                                                                                    return <span key={li_index}>{"$"+li.price} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>;
                                                                                                })
                                                                                            })()}
                                                                                        </td>
                                                                                        <td className="text-center">
                                                                                            {/* Shipping Fee */}
                                                                                            {orderObj.shipping_fee.shipping_methods[0].total_cost &&
                                                                                                <span className="capitalize">
                                                                                                    {orderObj.shipping_fee.shipping_methods[0].method}<br/>
                                                                                                    {orderObj.shipping_fee.transit_min +"-"+ orderObj.shipping_fee.transit_max + " Days"} <br/>
                                                                                                    {"$"+orderObj.shipping_fee.shipping_methods[0].total_cost}
                                                                                                </span>
                                                                                            }
                                                                                        </td>
                                                                                        <td className="text-center">
                                                                                            {/* Total Price */}
                                                                                            {(() => {
                                                                                                var totalPrice = 0;
                                                                                                orderObj.line_items.map((li, li_index) => {
                                                                                                    totalPrice += li.quantity * li.price;
                                                                                                })
                                                                                                totalPrice += orderObj.shipping_fee.shipping_methods[0].total_cost;

                                                                                                return (
                                                                                                    <span className="totalPrice">{"$"+parseFloat(totalPrice).toFixed(2)}</span>
                                                                                                );
                                                                                            })()}
                                                                                        </td>
                                                                                        {orders.trackingNumberAvailable &&
                                                                                            <td>
                                                                                                <div className="form_buttons">
                                                                                                    {/* <div className="form_wrap">
                                                                                                        <div className="form_row">
                                                                                                            <div className="form_item">
                                                                                                                <Popup
                                                                                                                    trigger={<button className="btn" id={"btn"+order._id} style={{padding: 5, fontSize: 12}}>Update</button>}
                                                                                                                    position="left center"
                                                                                                                    on="click" className="points-tooltip">
                                                                                                                    <div>
                                                                                                                        <style dangerouslySetInnerHTML={{__html: `
                                                                                                                            .points-tooltip {
                                                                                                                                width: 310px !important;
                                                                                                                            }
                                                                                                                        `}} />
                                                                                                                        <div className="text-center">
                                                                                                                            <h3>Change Product Dimension</h3>
                                                                                                                        </div>
                                                                                                                        <div className="form_input">
                                                                                                                            <div className="column column_6_12">
                                                                                                                                <label htmlFor="metric" className="clickable">
                                                                                                                                    <input onChange={() => this.setState({ selectedUnit: 'Metric' })} id="metric" type="radio" name="unit" checked={this.state.selectedUnit == "Metric" ? true : false} style={{width: 'auto'}} /> Metric (kg, cm)
                                                                                                                                </label>
                                                                                                                            </div>
                                                                                                                            <div className="column column_6_12">
                                                                                                                                <label htmlFor="imperial" className="clickable">
                                                                                                                                    <input onChange={() => this.setState({ selectedUnit: 'Imperial' })} id="imperial" type="radio" name="unit" checked={this.state.selectedUnit == "Imperial" ? true : false} style={{width: 'auto'}} /> Imperial (oz, in)
                                                                                                                                </label>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="form_input clear">
                                                                                                                            <div className="column column_6_12" style={{padding: '14px 3px'}}>
                                                                                                                                <label>Weight {this.state.selectedUnit == "Metric" ? '(kg)' : '(oz)'} *</label>
                                                                                                                            </div>
                                                                                                                            <div className="column column_6_12" style={{position: 'relative'}}>
                                                                                                                                <input type="number" id={"weight"+order._id} defaultValue="0.52" />
                                                                                                                                <span className="bottom_border"></span>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="form_input text-center">
                                                                                                                            <div className="column column_12_12">
                                                                                                                                <br/>
                                                                                                                                <label>Dimensions</label>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="form_input">
                                                                                                                            <div className="column column_4_12">
                                                                                                                                <div className="text-center" style={{padding: '20px 0 0'}}>
                                                                                                                                    <label>Height {this.state.selectedUnit == "Metric" ? '(cm)' : '(in)'}</label>
                                                                                                                                </div>
                                                                                                                                <div style={{position: 'relative', padding: '0 5px'}}>
                                                                                                                                    <input type="number" id={"height"+order._id} defaultValue="15" />
                                                                                                                                    <span className="bottom_border"></span>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className="column column_4_12">
                                                                                                                                <div className="text-center" style={{padding: '20px 0 0'}}>
                                                                                                                                    <label>Width {this.state.selectedUnit == "Metric" ? '(cm)' : '(in)'}</label>
                                                                                                                                </div>
                                                                                                                                <div style={{position: 'relative', padding: '0 5px'}}>
                                                                                                                                    <input type="number" id={"width"+order._id} defaultValue="9" />
                                                                                                                                    <span className="bottom_border"></span>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className="column column_4_12">
                                                                                                                                <div className="text-center" style={{padding: '20px 0 0'}}>
                                                                                                                                    <label>Length {this.state.selectedUnit == "Metric" ? '(cm)' : '(in)'}</label>
                                                                                                                                </div>
                                                                                                                                <div style={{position: 'relative', padding: '0 5px'}}>
                                                                                                                                    <input type="number" id={"length"+order._id} defaultValue="19" />
                                                                                                                                    <span className="bottom_border"></span>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="column column_12_12">
                                                                                                                            <br/>
                                                                                                                            <div className="column column_4_12" style={{padding: 12}}>
                                                                                                                                <label>DG Code</label>
                                                                                                                            </div>
                                                                                                                            <div className="column column_8_12">
                                                                                                                                <select className="dropbtn drp stretch-width dg_code" id={"dg_code"+order._id} defaultValue="0967" style={{backgroundColor: 'transparent', margin: 0}}>
                                                                                                                                    <option value="">None</option>
                                                                                                                                    <option value="0965">0965 - Lithium-ion Batteries Loose</option>
                                                                                                                                    <option value="0966">0966 - Lithium-ion Batteries Packed with Equipment</option>
                                                                                                                                    <option value="0967">0967 - Lithium-ion Batteries Contained in Equipment</option>
                                                                                                                                    <option value="0968">0968 - Lithium metal Batteries Loose</option>
                                                                                                                                    <option value="0969">0969 - Lithium metal Batteries Packed with Equipment</option>
                                                                                                                                    <option value="0970">0970 - Lithium metal Batteries Contained in Equipment</option>
                                                                                                                                    <option value="ORMD1">ORMD1 - Dry Cell Batteries</option>
                                                                                                                                </select>
                                                                                                                            </div> <br/><br/><br/>
                                                                                                                            <div className="helperText">Select the DG Code if the shipment contains dangerous goods.</div>
                                                                                                                        </div>
                                                                                                                        <div className="column column_12_12 text-center">
                                                                                                                            <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => {
                                                                                                                                // computation for width, length, height, weight of the product
                                                                                                                                var productData = {
                                                                                                                                    paidOrders: orders,
                                                                                                                                    order: order,
                                                                                                                                    weight: document.getElementById("weight"+order._id).value,
                                                                                                                                    dimension: {
                                                                                                                                        height: document.getElementById("height"+order._id).value,
                                                                                                                                        width: document.getElementById("width"+order._id).value,
                                                                                                                                        length: document.getElementById("length"+order._id).value,
                                                                                                                                        dg_code: document.getElementById("dg_code"+order._id).value
                                                                                                                                    }
                                                                                                                                } 
                                                                                                                                if(this.state.selectedUnit == "Imperial"){
                                                                                                                                    var height = document.getElementById("height"+order._id).value;
                                                                                                                                    var width = document.getElementById("width"+order._id).value;
                                                                                                                                    var length = document.getElementById("length"+order._id).value;
                                                                                                                                    productData.dimension = {
                                                                                                                                        height: height ? parseFloat(height) * 2.54 : '', // convert height inc to cm
                                                                                                                                        width: width ? parseFloat(width) * 2.54 : '', // convert height inc to cm
                                                                                                                                        length: length ? parseFloat(length) * 2.54 : '', // convert height inc to cm
                                                                                                                                    }
                                                                                                                                    productData.weight = parseFloat(productData.weight) / 35.274;
                                                                                                                                } else {
                                                                                                                                    productData.weight = parseFloat(productData.weight) * 1000;
                                                                                                                                }
                                                                                                                                // end computation for width, length, height, weight of the product
                                                                                                                                this.updateOrderLabel(productData, refetch);
                                                                                                                                document.getElementById("btn"+order._id).click();
                                                                                                                            }}>
                                                                                                                                <i className="fas fa-check"></i>
                                                                                                                            </button>
                                                                                                                            &nbsp; | &nbsp;
                                                                                                                            <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20}} onClick={() => document.getElementById(idGrams).click()}>
                                                                                                                                <i className="fas fa-times"></i>
                                                                                                                            </button>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </Popup>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div> */}
                                                                                                    {state.retrackid == order._id ?
                                                                                                    <div className="text-center">
                                                                                                        <button className="one-line-ellipsis dwobtn" style={{padding: 5, fontSize: 12, margin: 0}} onClick={() => {
                                                                                                            var newObj = JSON.parse(JSON.stringify(orders));
                                                                                                            order = this.checkAddress(order);
                                                                                                            newObj.orders = JSON.stringify([order])
                                                                                                            this.getTrackingNumber(newObj, refetch)
                                                                                                        }}>ReTrack</button>
                                                                                                        <br/>
                                                                                                        OR
                                                                                                        <br/>
                                                                                                        <Popup
                                                                                                            trigger={<button className="one-line-ellipsis dwobtn" title="Add Tracking Number" style={{padding: 5, fontSize: 12, margin: 0}}>Add TN</button>}
                                                                                                            position="left center"
                                                                                                            on="click" className="points-tooltip">
                                                                                                            <div className="helperText" style={{padding: 10, lineHeight: 1.5}}>
                                                                                                                <div className="form_wrap">
                                                                                                                    <div className="form_row" style={{margin: 0}}>
                                                                                                                        <div className="form_item">
                                                                                                                            <label>Manually Add Tracking Number</label>
                                                                                                                            <div className="form_input">
                                                                                                                                <input type="text" defaultValue="" onBlur={event => this.addTrackingNumber(orders.id, order._id, order, event.target.value, orders.store_url, orders.store_token, orders.store_location_id, refetch)} />
                                                                                                                                <span className="bottom_border"></span>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </Popup>
                                                                                                        <br/><br/>
                                                                                                    </div>
                                                                                                    : void 0}
                                                                                                    <button className="btn" onClick={() => this.getOrderObject(order._id)} style={{padding: 5, fontSize: 12}}> Print PDF </button>
                                                                                                </div>
                                                                                            </td>
                                                                                        }
                                                                                        {orders.trackingNumberAvailable &&
                                                                                            <td>
                                                                                                <label className="switch">
                                                                                                    <Mutation
                                                                                                        mutation={MARK_ORDER_AS_PACKED}
                                                                                                        variables={{
                                                                                                            paidID: orders.id,
                                                                                                            orderID: order._id,
                                                                                                            shouldSave: !is_packed }}
                                                                                                        >
                                                                                                        {(markAsPacked, { data, loading, error }) => {
                                                                                                            return <input type="checkbox" checked={is_packed} onChange={() => this.markAsPacked(markAsPacked, refetch)} />
                                                                                                        }}
                                                                                                    </Mutation>
                                                                                                    <span className="slider round"></span>
                                                                                                </label>
                                                                                            </td>
                                                                                        }
                                                                                    </tr>
                                                                                );
                                                                            });
                                                                        })()}
                                                                    </tbody>
                                                                </table>
                                                            );
                                                        });
                                                    }}
                                                </Query>
                                            :
                                                <div className="product-card">
                                                    <div className="product-details text-center">
                                                        <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>Select Store to display paid orders</span>
                                                        <br/><br/>
                                                        <div className="form_buttons">
                                                            <Query query={GET_ALL_PAID_ORDER} >
                                                                {({ data, loading, refetch, error }) => {
                                                                    return <button className="btn" onClick={() => this.exportAllPaidOrder(data)} disabled={loading || error}>Export All Paid Order</button>;
                                                                }}
                                                            </Query>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <div className="form_buttons text-right">
                                            <button className="btn" onClick={() => this.smoothscroll()} style={{position: 'fixed', bottom: 50, right: 10, zIndex: 1, borderRadius: '50%', padding: '12px 15px', fontSize: 20}}><span className="fas fa-arrow-up"></span></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        } else {
                            // for denied
                            return (
                                <div>
                                    <div className="column column_3_12">
                                        <div className="product-card">
                                            <div className="product-details" style={{overflow: 'hidden'}}>
                                                <div className="text-center">
                                                    <h3>Stores</h3>
                                                </div>
                                                <Query query={GET_ADMIN_ORDERS_CHINA_USERS} variables={{filter: state.activeTab}}>
                                                    {({ data, loading, refetch, error }) => {
                                                        if(loading) {
                                                            return (
                                                                <div className="text-center">
                                                                    <Loading height={150} width={150} />
                                                                </div>
                                                            );
                                                        }

                                                        if(data.getAdminChinaOrdersUSERS.length != 0){
                                                            return data.getAdminChinaOrdersUSERS.map((user, user_index) => {
                                                                var cn = "product-card";
                                                                if(state.selectedStoreID == user.id){
                                                                    cn += " card-active"
                                                                }
                                                                return (
                                                                    <div className={cn} key={user_index}>
                                                                        <div className="product-details" style={{overflow: 'hidden'}}>
                                                                            <div className="column column_3_12" style={{padding: 0}}>
                                                                                <div style={{backgroundImage: user.profileImage ? 'url('+webConfig.siteURL+'/user-uploads/'+user.profileImage+')' : 'url('+webConfig.siteURL+'/assets/graphics/abstract_patterns/texture.jpg'+')', height: '5rem', borderRadius: '50%',   backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}} />
                                                                            </div>
                                                                            <div className="column column_9_12 ellipsis" style={{whiteSpace: 'nowrap'}}>
                                                                                <strong>{user.store_url}</strong> <br/>
                                                                                {user.firstName} {user.lastName} <br/>
                                                                                <div className="float-right" style={{marginTop: 5}}>
                                                                                    <span className="clickable" onClick={() => this.displayOrder(user.id, user.firstName+" "+user.lastName)}>
                                                                                        Details &nbsp;<span className="fas fa-arrow-right"></span>
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            });
                                                        } else {
                                                            return (
                                                                <div className="text-center">
                                                                    <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>No Store Available</span>
                                                                </div>
                                                            );
                                                        }
                                                    }}
                                                </Query>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column column_9_12">
                                        <div className="table-container clear">
                                            <br/>
                                            <table className="table-list">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center">#</th>
                                                        <th>Denied Date</th>
                                                        <th width="200px">Shipping Information</th>
                                                        <th>Product</th>
                                                        <th className="text-center">Variant</th>
                                                        <th className="text-center">Quantity</th>
                                                        <th className="text-center" width="10%">Price</th>
                                                        <th className="text-center">Total Price</th>
                                                        <th className="text-center">Note</th>
                                                        <th className="text-center">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {state.selectedStoreID ?
                                                    <Query query={GET_ORDERS_CHINA} variables={{ id: state.selectedStoreID, filter: state.activeTab, offset: ((state.currentPage-1) * state.currentPageLimit) }} >
                                                        {({ data, loading, refetch, error }) => {
                                                            if(loading) {
                                                                return (
                                                                    <tr>
                                                                        <td colSpan="11" className="text-center">
                                                                            <Loading height={150} width={150} />
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }

                                                            if(data.getChinaOrders.length == 0){
                                                                return (
                                                                    <tr>
                                                                        <td colSpan="10" className="text-center">
                                                                            <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>Empty... check back soon!</span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }

                                                            return data.getChinaOrders.map((orders, o_index) => {
                                                                if(orders.isRefactored){
                                                                    return (
                                                                        <tr key={o_index}>
                                                                            <td className="text-center">{o_index+1}</td>
                                                                            <td className="text-center">
                                                                                {/* Date Denied */}
                                                                                {moment(new Date(parseInt(orders.date_denied))).startOf('second').fromNow()}
                                                                            </td>
                                                                            <td>
                                                                                {/* Shipping Information */}
                                                                                <div className="ellipsis" style={{width: 200}}>
                                                                                    {orders.shipping_information.email ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Email">{orders.shipping_information.email}<br/></span> : void 0}
                                                                                    {orders.shipping_information.name ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Name">{orders.shipping_information.name}<br/></span> : void 0}
                                                                                    {orders.shipping_information.address1 ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Address1">{orders.shipping_information.address1}<br/></span> : void 0}
                                                                                    {orders.shipping_information.address2 ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Address2">{orders.shipping_information.address2} <br/></span>: void 0}
                                                                                    {orders.shipping_information.city ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="City">{orders.shipping_information.city}<br/></span> : void 0}
                                                                                    {orders.shipping_information.province ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Province">{orders.shipping_information.province ? orders.shipping_information.province +" ("+orders.shipping_information.province_code+")" : ''}<br/></span> : void 0}
                                                                                    {orders.shipping_information.zip ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Zip">{orders.shipping_information.zip}<br/></span> : void 0}
                                                                                    {orders.shipping_information.country ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Country">{orders.shipping_information.country+" ("+orders.shipping_information.country_code+")"}</span> : void 0}
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                {/* Product Name */}
                                                                                {(() => {
                                                                                    return orders.line_items.map((li, li_index) => {
                                                                                        if(li.vendor_link){
                                                                                            return <span key={li_index}><a href={li.vendor_link} target="_blank" title="Vendor link availalble click here.">{li.product_name}</a> {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                        } else {
                                                                                            return <span key={li_index}>{li.product_name} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                        }
                                                                                    })
                                                                                })()}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {/* Variant Name */}
                                                                                {(() => {
                                                                                    return orders.line_items.map((li, li_index) => {
                                                                                        return <span key={li_index}>{li.variant_name ? li.variant_name : "N/A"} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                    })
                                                                                })()}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {/* Order Quantity */}
                                                                                {(() => {
                                                                                    return orders.line_items.map((li, li_index) => {
                                                                                        return <span key={li_index}>{li.quantity+"x"} {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                    })
                                                                                })()}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {/* Order Approved/Original Price */}
                                                                                {(() => {
                                                                                    return orders.line_items.map((li, li_index) => {
                                                                                        return <span key={li_index}>${li.approve_price ? li.approve_price : li.original_price } {(li_index + 1) != orders.line_items.length ? <hr/> : void 0}</span>
                                                                                    })
                                                                                })()}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                {/* Total Price */}
                                                                                {(() => {
                                                                                    var totalPrice = 0;
                                                                                    orders.line_items.map((li, li_index) => {
                                                                                        li.approve_price ? totalPrice += li.quantity * li.approve_price : totalPrice += li.quantity * li.original_price;
                                                                                    })

                                                                                    return (
                                                                                        <span className="totalPrice">{"$"+parseFloat(totalPrice).toFixed(2)}</span>
                                                                                    );
                                                                                })()}
                                                                            </td>
                                                                            <td>
                                                                                {/* Denied Note */}
                                                                                {orders.denied_note}
                                                                            </td>
                                                                            <td className="text-center">
                                                                                <Mutation
                                                                                    mutation={DECIDE_ORDER}
                                                                                    variables={{
                                                                                        id: orders.id,
                                                                                        decision: state.decision }}
                                                                                    >
                                                                                    {(approveOrder, { data, loading, error }) => {
                                                                                        return <button onClick={this.approveOrder.bind(this, approveOrder, "request", refetch)} className="dwobtn" style={{margin: 0}}> Undo </button>;
                                                                                    }}
                                                                                </Mutation>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                                var orderObj = JSON.parse(orders.orders);
                                                                return (
                                                                    <tr key={o_index}>
                                                                        <td className="text-center">{o_index+1}</td>
                                                                        <td className="text-center">{moment(new Date(parseInt(orders.date_denied))).startOf('second').fromNow()}</td>
                                                                        <td>
                                                                            {/* Shipping Information */}
                                                                            {orderObj.email ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.email}<br/></span> : void 0}
                                                                            {orderObj.email ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.name}<br/></span> : void 0}
                                                                            {orderObj.email ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.address1}<br/></span> : void 0}
                                                                            {orderObj.email ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.city}<br/></span> : void 0}
                                                                            {orderObj.email ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.province} {orderObj.shipping_address.zip}<br/></span> : void 0}
                                                                            {orderObj.email ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}}>{orderObj.shipping_address.country}</span> : void 0}
                                                                        </td>
                                                                        <td>
                                                                            {/* Product Name */}
                                                                            {(() => {
                                                                                return orderObj.line_items.map((li, li_index) => {
                                                                                    if(li.vendorLink){
                                                                                        return <span key={li_index}><a href={li.vendorLink} target="_blank" title="Vendor link availalble click here.">{li.title}</a> {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                                    } else {
                                                                                        return <span key={li_index}>{li.title} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                                    }
                                                                                })
                                                                            })()}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {/* Variant */}
                                                                            {(() => {
                                                                                return orderObj.line_items.map((li, li_index) => {
                                                                                    return <span key={li_index}>{li.variant_title ? li.variant_title : "N/A"} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                                })
                                                                            })()}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {/* Quantity */}
                                                                            {(() => {
                                                                                return orderObj.line_items.map((li, li_index) => {
                                                                                    return <span key={li_index}>{li.quantity+"x"} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                                })
                                                                            })()}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {/* Price */}
                                                                            {(() => {
                                                                                return orderObj.line_items.map((li, li_index) => {
                                                                                    return <span key={li_index}>{"$"+li.price} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>;
                                                                                })
                                                                            })()}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {/* Total Price */}
                                                                            {(() => {
                                                                                var totalPrice = 0;
                                                                                orderObj.line_items.map((li, li_index) => {
                                                                                    totalPrice += li.quantity * li.price;
                                                                                })

                                                                                return (
                                                                                    <span className="totalPrice">{"$"+parseFloat(totalPrice).toFixed(2)}</span>
                                                                                );
                                                                            })()}
                                                                        </td>
                                                                        <td>{orders.denied_note}</td>
                                                                        <td className="text-center">
                                                                            <Mutation
                                                                                mutation={DECIDE_ORDER}
                                                                                variables={{
                                                                                    id: orders.id,
                                                                                    decision: state.decision }}
                                                                                >
                                                                                {(approveOrder, { data, loading, error }) => {
                                                                                    return <button onClick={this.approveOrder.bind(this, approveOrder, "request", refetch)} className="dwobtn" style={{margin: 0}}> Undo </button>;
                                                                                }}
                                                                            </Mutation>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            });
                                                        }}
                                                    </Query>
                                                    :
                                                        <tr>
                                                            <td colSpan="11" className="text-center"><span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>Select Store to display denied order</span></td>
                                                        </tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })()}
                    
                </div>
                {state.openLogsModal &&
                    <Modal open={state.openLogsModal} closeModal={this.toggleModal} session={this.props.session}>
                        <div className="table-container">
                            <div className="text-center">
                                <h3>Payment Transaction Logs</h3>
                            </div>
                            <table className="table-list">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Parent Payment</th>
                                        <th>State</th>
                                        <th>Summary</th>
                                        <th>Total Amount</th>
                                        <th>Currency</th>
                                        <th>Created Time</th>
                                        <th>Updated Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        return (
                                            <Query query={GET_PAYPAL_PAYMENT_LOGS} variables={{id: state.logsID}}>
                                                {({ data, loading, refetch, error }) => {
                                                    if(loading){
                                                        return (
                                                            <tr className="text-center">
                                                                <td colSpan="8">
                                                                    <Loading width={150} height={150} />
                                                                </td>
                                                            </tr>
                                                        );
                                                    }

                                                    if(data.getpaypalPaymentLogs.length == 0){
                                                        return (
                                                            <tr className="text-center" style={{fontStyle: 'italic', fontSize: '1.5rem'}}>
                                                                <td colSpan="8">
                                                                    Transaction Logs Not Available
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                    
                                                    return data.getpaypalPaymentLogs.map((transaction, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td>{transaction.id}</td>
                                                                <td>{transaction.parent_payment}</td>
                                                                <td>{transaction.state}</td>
                                                                <td>{transaction.summary}</td>
                                                                <td>{transaction.total_amount}</td>
                                                                <td>{transaction.amount_currency}</td>
                                                                <td>{new Date(parseInt(transaction.create_time)).toLocaleDateString()}</td>
                                                                <td>{new Date(parseInt(transaction.update_time)).toLocaleDateString()}</td>
                                                            </tr>
                                                        );
                                                    });
                                                }}
                                            </Query>
                                        );
                                    })()}
                                </tbody>
                            </table>
                        </div>
                    </Modal>
                }
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AdminFulfillmentChina);