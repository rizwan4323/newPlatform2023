/*
    Pag di makita sa order search ng fulfiller
    maaring hindi fulfill with plg ung ni ssearch
    try sa "mongodb compass comunity" app or "robo 3t"
    
    Pag naka loc=ALL sa url parameter do not perform any mutation like
    manually changing the order status or changing order settings
    for safety measure nka depende kc sa loc ung query para di maapektuhan ung ibang location
*/

import React from 'react';
import toastr from 'toastr';
import moment from 'moment';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
import { Query, Mutation, ApolloConsumer } from 'react-apollo';
import InfiniteCalendar, { Calendar, withRange, } from 'react-infinite-calendar';
import { GET_FUNNEL_ORDERS, UPDATE_FUNNEL_ORDERS, GET_USERS_OF_FUNNEL_ORDERS, DELETE_FUNNEL_ORDER, GET_MY_PAY_CHECK, GET_ORDER_LINK, UPDATE_FUNNEL_ORDER_SHIPPING_INFORMATION, PUSH_NOTIFICATION, GET_FUNNEL_PRODUCTS, GET_PURCHASE_ORDER, CHANGE_ITEM_STATUS, ASSIGN_SERIAL_NUMBER_TO_ORDER, MARK_ALL_AS_PAID, SPLIT_OR_MERGE_COD_ORDERS, GET_ORDER_STATUS_RATES_PER_COUNTRY } from './../queries';
import Modal from '../components/ModalComponent';
import Loading from '../components/loading';
import ButtonWithPopup from '../components/buttonWithPopup';
import Pagination from '../components/pagination';
import ShowFilter from '../components/showFilter';
import SelectTag from '../components/selectTag';
import Checkbox from '../components/checkbox';
import ToggleSwitch from '../components/toggleSwitch';
import SearchField from '../components/searchField';
import Tooltip from '../components/tooltip';
import LoadingPage from '../components/loadingPage';
import { Table, Tbody } from '../components/table';
import * as Cookies from 'es-cookie';

// import ReactExport from "react-export-excel"; 
// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const jwt = require('jsonwebtoken');
var ShortId = require('id-shorter');
var mongoDBId = ShortId({ isFullId: true });
const CalendarWithRange = withRange(Calendar);
const points = require('../../Global_Values');


const initialize_returning_item = {
    returning_current_page: 1,
    returning_show_per_page: 10,
    returning_total: 0,
    returning_search: "",
    returning_search_value: "",
    returning: false,
    toggle_v2: false
}

const initialize_duplicate_sensitivity = {
    duplicate_email: true,
    duplicate_phone: true,
    duplicate_product_name: true
}

const initialize_sales_stats = {
    show_sales_stats: false,
    sales_stats_location_iso2: "",
    sales_stats_location_name: "",
    sales_stats_sort: "asc",
    sales_stats_sort_by: "",
    sales_stats_data: []
}

class Fulfiller extends React.Component {
    constructor() {
        super();
        this.state = {
            currentPage: 1,
            totalOrders: 0,
            showResult: false,
            selectedUserID: "",
            fromAdminPayouts: false,
            search: "",
            search_user: "",
            search_user_input: "",
            trackingnumber: [],
            sync_response_safeArrivalID: "",
            sync_response_tracking_number: "",
            sync_from: "safearrival",
            order_status: "",
            deliveredDate: "",
            filter_order_status: "",
            filter_tracking_courier: "",
            filter_courier_collected: "",
            paid_cc: "",
            cancel_note: "",
            orderList: [],
            sendPLGTrackingEmail: false,
            tracking_courier: "",
            refid: "",
            to: "",
            // for user transferwise
            clientTransferWise: "",
            userTwOpen: true,
            totalPayment: 0,
            // for update variant id and quantity
            variant_qty: 1,
            variant_price: 0,
            variant_sku: "",
            updateOnlyThisLineItem: false,
            showTab:"transferwise", // transferwise || payoneer
            // disable button
            exportAllBtn: false,
            excel_data: [],
            ...initialize_returning_item,
            ...initialize_duplicate_sensitivity,
            ...initialize_sales_stats,
            is_page_loading: true
        }
    }

    componentDidMount() {
        localStorage.removeItem("safeArrivalLoginToken"); // remove tommorrow para lang ito ma reset this day (june 25 2020) ung token dahil nag bago ng email sa credential
        toastr.options = {
            "progressBar": true,
            "closeButton": false,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut": 5000,
            "extendedTimeOut": 2000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        var urlParams = points.getURLParameters(this.props.location.search);
        var saveState = {};
        if (urlParams.userID && urlParams.userEmail) {
            saveState.selectedUserID = urlParams.userID;
            saveState.search_user = urlParams.userEmail;
            saveState.fromAdminPayouts = true;
            saveState.filter_courier_collected = "collected";
        }
        if (urlParams.dateStart && urlParams.dateEnd) {
            saveState.filterByStartDate = new Date(parseInt(urlParams.dateStart)).toDateString();
            saveState.filterByEndDate = new Date(parseInt(urlParams.dateEnd)).toDateString();
            saveState.filter_order_status = "delivered";
            saveState.fromAdminPayouts = true;
            saveState.filter_courier_collected = "collected";
        }
        if (urlParams.order_status) saveState.filter_order_status = urlParams.order_status;
        if (urlParams.serial_number) saveState.refid = urlParams.serial_number;
        if (JSON.stringify(saveState) != "{}") {
            this.setState({ ...saveState });
        }
        window.convertRefID = (str) => {
            return mongoDBId.decode(str);
        }
        var script = document.createElement("script");
        script.src = "https://unpkg.com/libphonenumber-js@1.7.30/bundle/libphonenumber-max.js";
        script.defer = true;
        document.body.appendChild(script);

        this.setState({ is_page_loading: false });
    }

    handleSignout(client) {
        Cookies.remove('token');
        client.resetStore();
        this.props.history.push('/signin');
    }

    handleOnChange(event) {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({ [name]: value });
    }

    handleOnKeyUp(event, fn) {
        if (event.keyCode === 13) {
            fn();
        }
    }

    updateMyFunnelOrders(updateMyFunnelOrders, refetch, isFunnelStatus, selector) {
        if (!this.state.tracking_courier && !isFunnelStatus) {
            points.toastrPrompt(toastr, "warning", "Courier is required.", "Select Courier");
        } else if (this.state.trackingnumber.length != 0 || isFunnelStatus) {
            this.setLoadingTime(0, 0)
            toastr.clear();
            toastr.info("Loading please wait...", "");
            updateMyFunnelOrders().then(({ data }) => {
                this.setLoadingTime(3000, 2000);
                toastr.clear();
                toastr.success("Success", "");
                var updateState = { trackingnumber: [], sendPLGTrackingEmail: false, cancel_note: "", order_status: "" };
                this.setState(updateState)
                refetch();
                if (selector) document.getElementById(selector).click();
            }).catch(error => {
                this.setLoadingTime(0, 0);
                toastr.clear();
                toastr.warning(error.graphQLErrors[0].message, "");
            });
        }
    }

    assignSerialNumberToOrder(assignSerialNumberToOrder, refetch, selector) {
        this.setLoadingTime(0, 0)
        toastr.clear();
        toastr.info("Loading please wait...", "");
        assignSerialNumberToOrder().then(({ data }) => {
            this.setLoadingTime(3000, 2000);
            toastr.clear();
            toastr.success("Success", "");
            refetch();
            if (selector) document.getElementById(selector).click();
        }).catch(error => {
            this.setLoadingTime(0, 0);
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    pushNotification(pushNotification) {
        this.setLoadingTime(0, 0)
        toastr.clear();
        toastr.info("Loading please wait...", "");
        pushNotification().then(async ({ data }) => {
            this.setLoadingTime(3000, 2000);
            toastr.clear()
            toastr.success("Message successfully sent!", "Success!");
            this.setState({ send_message: '' })
        }).catch(error => {
            this.setLoadingTime(0, 0);
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    changeItemStatus(changeItemStatus, refetch) {
        this.setLoadingTime(0, 0)
        toastr.clear();
        toastr.info("Loading please wait...", "");
        changeItemStatus().then(async ({ data }) => {
            toastr.clear();
            refetch();
        }).catch(error => {
            this.setLoadingTime(0, 0);
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    setLoadingTime(tiemout, etimeout) {
        toastr.options.timeOut = tiemout;
        toastr.options.extendedTimeOut = etimeout;
    }

    fixExportData(data) {
        var regex = new RegExp("#|,|(\r\n|\r|\n)", "g"), replaceBy = "\,";
        return data ? data.toString().replace(regex, replaceBy) : data;
    }

    exportToCSV() {
        var that = this;
        var orderList = this.state.orderList;

        toastr.clear();
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.info("Exporting please wait...", "");
        const rows = [
            ["Ref #", "Owner Name", "Owner Email", "Tracking Number", "Product", "Variant", "Quantity", "Price", "Email", "Phone", "Shipping Name", "Shipping Address1", "Shipping City", "Shipping Zip", "Shipping State/Province", "Shipping Country", "Notes"]
        ];
        orderList.forEach(el => {
            var { email, name } = el.userData ? JSON.parse(el.userData) : { email: "", name: "" }
            el.line_items.forEach((li, lii) => {
                rows.push([
                    mongoDBId.encode(el.ids[lii]),
                    that.fixExportData(name),
                    that.fixExportData(email),
                    that.fixExportData(li.tracking_number), // Lineitem Tracking Number
                    that.fixExportData(li.title), // Lineitem name
                    that.fixExportData(li.variant), // Lineitem name
                    that.fixExportData(li.quantity), // Lineitem quantity
                    that.fixExportData(li.price), // Lineitem price
                    that.fixExportData(el.shipping_information.email), // Shipping Email
                    that.fixExportData(el.shipping_information.phone), // Shipping Phone
                    that.fixExportData(el.shipping_information.name), // Shipping Name
                    that.fixExportData(el.shipping_information.street1), // Shipping Address1
                    that.fixExportData(el.shipping_information.city), // Shipping City
                    that.fixExportData(el.shipping_information.zip), // Shipping Zip
                    that.fixExportData(el.shipping_information.state), // Shipping Province
                    that.fixExportData(el.shipping_information.country), // Shipping Country
                    that.fixExportData(el.notes) // order note
                ])
            });
        })

        let csvContent = "data:text/csv;charset=utf-8,";
        rows.forEach(function (rowArray) {
            rowArray = rowArray.map(el => {
                if (el) {
                    return el.toString().replace(/\,/g, " ");
                } else {
                    return el;
                }
            })
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });

        var encodedUri = encodeURI(csvContent);
        var fileName = "Funnel Export (" + new Date().toLocaleDateString() + ").csv";
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
        toastr.options.timeOut = 3000;
        toastr.options.extendedTimeOut = 2000;
        toastr.clear();
        toastr.success("Export Success.", "");
    }

    exportAllToCSV(fulfillerLocation) {
        var state = this.state;
        var payload = {
            id: state.selectedUserID,
            orderid: state.refid,
            fulfillerLocation: fulfillerLocation,
            plgbuttonID:"",
            merchant_type: "cod",
            paid_cc: state.paid_cc == '' ? null : state.paid_cc == "cod" ? false : true,
            order_status: state.filter_order_status,
            filterByStartDate: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
            filterByEndDate: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
            skip: 0,
            limit: state.totalOrders * 10,
            cod_analytics: true,
            show_courier_collected: state.filter_courier_collected,
            export_mode: "csv"
        }
        points.toastrPrompt(toastr, "info", "Exporting please wait...");
        this.setState({ exportAllBtn: true }, () => {
            points.customFetch("/api/exportAllFunnelOrders", "POST", payload, data => {
                if (data && data.status == "success") {
                    var fileName = "Funnel Export (" + new Date().toLocaleDateString() + ").csv";
                    var link = document.createElement("a");
                    link.setAttribute("href", data.uri);
                    link.setAttribute("download", fileName);
                    document.body.appendChild(link); // Required for FF
                    link.click();
                    document.body.removeChild(link);
                    toastr.options.timeOut = 3000;
                    toastr.options.extendedTimeOut = 2000;
                    toastr.clear();
                    toastr.success("Export Success.", "");
                    this.setState({ exportAllBtn: false });
                } else {
                    toastr.options.timeOut = 0;
                    toastr.options.extendedTimeOut = 0;
                    toastr.clear();
                    toastr.warning("Error on server", "An error has occurred");
                }
            })
        })
    }

    exportAllToExcel(fulfillerLocation) {
        var state = this.state;
        var payload = {
            id: state.selectedUserID,
            orderid: state.refid,
            fulfillerLocation: fulfillerLocation,
            plgbuttonID:"",
            merchant_type: "cod",
            paid_cc: state.paid_cc == '' ? null : state.paid_cc == "cod" ? false : true,
            order_status: state.filter_order_status,
            filterByStartDate: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
            filterByEndDate: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
            skip: 0,
            limit: state.totalOrders * 10,
            cod_analytics: true,
            show_courier_collected: state.filter_courier_collected,
            export_mode: "excel"
        }
        this.setState({ exportAllBtn: true, excel_data: [] }, () => {
            points.customFetch("/api/exportAllFunnelOrders", "POST", payload, data => {
                if (data && data.status == "success") {
                    try {
                        const reconstruct_excel_data = [], obj_name = {};
                        data.uri.forEach((val, i) => {
                            if (i == 0) {
                                val.forEach(o => {
                                    obj_name[o.toLowerCase().replace(/\s/g, "_")] = "";
                                });
                            } else {
                                var obj = {}, index = 0;
                                for (var key in obj_name) {
                                    obj[key] = val[index];
                                    index += 1;
                                }
                                reconstruct_excel_data.push(obj);
                            }
                        });
                        // console.log("this is recons data",reconstruct_excel_data);
                        this.setState({ exportAllBtn: false, excel_data: reconstruct_excel_data });
                    } catch (er) {
                        console.log(err)
                    }
                } else {
                    this.setState({ exportAllBtn: true });
                    points.toastrPrompt(toastr, "warning", "An error has occurred", "Error on server");
                }
            })
        });
    }

    filterDate(data) {
        if (data.eventType == 3) {
            this.setState({
                currentPage: 1,
                filterByStartDate: data.start.toDateString(),
                filterByEndDate: data.end.toDateString()
            })
        }
    }

    searchOrderLink(client, orderid, link) {
        this.setLoadingTime(0, 0);
        toastr.clear();
        toastr.info("Loading please wait...");
        if (!link) {
            client.query({ query: GET_ORDER_LINK, variables: { id: orderid } }).then(res => {
                var jsonData = {};
                var errorText = "";
                if (res.data.getOrderLink) jsonData = JSON.parse(res.data.getOrderLink.link);
                if (jsonData.status && jsonData.status == 1) {
                    toastr.clear();
                    window.open(jsonData.link, "_blank");
                } else {
                    if (typeof jsonData.status == "undefined") errorText = "Failed to get order data please try again.";
                    else if (jsonData.status == 0) errorText = jsonData.message;
                    toastr.clear();
                    toastr.warning(errorText);
                }
            })
        } else {
            toastr.clear();
            window.open(link, "_blank");
        }
    }

    async syncOrderToWimo(orderData, origin_country, location, refetch, updateMyFunnelOrders) {
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.info("Syncing order to wimo...", "Please wait");

        var notes = "", totalPrice = 0, totalCPI = 0, totalQty = 0, itemList = [], iso2 = points.iso3toIso2(location), iso3 = points.iso2toIso3(orderData.shipping_information.country);
        for (var index in orderData.line_items) {
            const liData = orderData.line_items[index];
            const sku = liData.plg_sku ? liData.plg_sku : "N/A";
            notes += liData.inventoryDescription ? liData.inventoryDescription + "(" + liData.quantity + ") & " : liData.title + "(" + liData.quantity + ") & ";
            totalPrice += parseFloat(liData.price);
            if (liData.productCost) totalCPI += parseFloat(liData.productCost);
            totalQty += liData.quantity;
            itemList.push({
                "description": liData.inventoryDescription ? liData.inventoryDescription + "(" + liData.quantity + ")" : liData.title + "(" + liData.quantity + ")",
                "origin_country": iso3,
                "sku": sku,
                "weight": { "value": 0.5, "unit": "kg" }
            })
        }
        notes = notes.substring(0, notes.length - 3);
        const global_currency = await new Promise(resolve => {
            points.customFetch('/api/getGlobalCurrency', 'GET', null, result => {
                resolve(result)
            })
        })
        if (!global_currency) {
            points.toastrPrompt(toastr, "warning", "Cannot convert 30% of total price to dollar.", "Please refresh the page");
            return;
        }
        const localToDollar = global_currency.rates[orderData.currencyWord ? orderData.currencyWord : "USD"];
        /* declaredValue = 10% of totalPrice then convert to dollar then + cod product prices */
        const declaredValue = ((totalPrice * .1) / localToDollar) + totalCPI;
        const payload = {
            "reference": orderData.ids.map(el => mongoDBId.encode(el)).toString(),
            "sender": {
                "country": origin_country,
                "contact_name": orderData.line_items[0].title + " - yalagenie.com",
                "phone": "430005",
                "company_name": orderData.line_items[0].title + " - yalagenie.com",
                "street1": origin_country == "ARE" ? "United Arab Emirates" : "Kingdom of Saudi Arabia",
                "city": origin_country == "ARE" ? "Dubai" : "Riyadh",
                "state": origin_country == "ARE" ? "Dubai" : "Riyadh"
            },
            "receiver": {
                "contact_name": orderData.shipping_information.name,
                "phone": libphonenumber.parsePhoneNumber(orderData.shipping_information.phone, iso2).number,
                "street1": (orderData.shipping_information.street1 ? orderData.shipping_information.street1 : "") + (orderData.shipping_information.state ? " District: " + orderData.shipping_information.state : "") + (orderData.shipping_information.nearestLandmark ? " Nearest Landmark: " + orderData.shipping_information.nearestLandmark : ""),
                "city": orderData.shipping_information.city,
                "state": orderData.shipping_information.state,
                "country": iso3
            },
            "shipment": {
                "description": notes,
                "payment_type": "COD",
                "is_document": "NO",
                "totalAmount": totalPrice,
                "quantity": totalQty,
                "currency": orderData.currencyWord,
                "weight": {
                    "value": 0.5,
                    "unit": "kg"
                },
                "items": itemList
            },
            "clearance": { "declaredValue": parseFloat(declaredValue.toFixed(2)) }
        }
        const authorization = points.wimoAuthorization();
        fetch('https://orders.wimo.ae/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    this.setState({
                        sendPLGTrackingEmail: false,
                        sync_from: "wimo",
                        sync_response_safeArrivalID: result.data._id,
                        sync_response_tracking_number: JSON.stringify(orderData.ids.map(el => {
                            return { id: el, tracking: result.data.packingLabel };
                        })),
                    }, () => {
                        updateMyFunnelOrders().then(({ data }) => {
                            refetch();
                            points.toastrPrompt(toastr, "success", "Synching Success!", "Success");
                        }).catch(error => {
                            console.log("Saving gql error =>", error)
                            points.toastrPrompt(toastr, "warning", error.graphQLErrors[0].message);
                        });
                    })
                } else {
                    points.toastrPrompt(toastr, "warning", "Error while synching to wimo.", "Please try again");
                    console.log("Error wimo response ==>", result)
                }
            })
            .catch(err => {
                points.toastrPrompt(toastr, "warning", "Error while synching to wimo.", "Please try again");
                console.log("Error wimo synching ==>", err)
            })
    }

    async syncOrderToSafeArrival(orderData, location, refetch, updateMyFunnelOrders, v2, isTaqadum) {
        let api_link = isTaqadum ? "https://prodapi.shipox.com" : "https://prodapi.safe-arrival.com";
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.info("Syncing order to " + (isTaqadum ? "taqadum" : "safe arrival") + "...", "Please wait");

        var notes = "", totalPrice = 0, ref_list = []; // parcel notes
        for (let index = 0; index < orderData.line_items.length; index++) {
            const liData = orderData.line_items[index];
            const sku = liData.plg_sku ? liData.plg_sku : "N/A";
            notes += liData.inventoryDescription ? liData.inventoryDescription + "(" + liData.quantity + ") & " : liData.title + "(" + liData.quantity + ") & ";
            // notes += liData.quantity + "x " + liData.title + " - " + (liData.inventoryName || "N/A") + " & ";
            totalPrice += parseFloat(liData.price);
            if (liData.plg_serialNumber && liData.plg_serialNumber.length != 0) ref_list.push(liData.plg_serialNumber);
            else ref_list.push(mongoDBId.encode(orderData.ids[index]))
        }
        notes = notes.substring(0, notes.length - 3);
        totalPrice = parseFloat(totalPrice.toFixed(2));
        ref_list = ref_list.toString();

        const iso2 = points.iso3toIso2(orderData.shipping_information.country) ? points.iso3toIso2(orderData.shipping_information.country) : orderData.shipping_information.country;
        const convertedCountry = points.iso2toCountryName(iso2);
        var accountData = {}, menu_id = 3, complete_address = convertedCountry + ", ";
        if (orderData.shipping_information.street1) complete_address += "Street: " + orderData.shipping_information.street1 + (orderData.shipping_information.state ? ", " : "");
        if (orderData.shipping_information.state) complete_address += "Area: " + orderData.shipping_information.state + (orderData.shipping_information.bldgVilla ? ", " : "");
        if (orderData.shipping_information.bldgVilla) complete_address += "Building: " + orderData.shipping_information.bldgVilla + (orderData.shipping_information.aptOffice ? ", " : "");
        if (orderData.shipping_information.aptOffice) complete_address += "Apartment: " + orderData.shipping_information.aptOffice;
        let token = localStorage.getItem("safeArrivalLoginToken");
        if (token === "undefined") token = "";
        function getPickupInfo() {
            if (location == "AE" || location == "ARE") {
                accountData = { ...points.getSafeArrivalCredentail(location), "token": token, v: "v1" };
                menu_id = 3;
                return {
                    "city": "dubai",
                    "pickup": true,
                    "lat": 25.2766609,
                    "lon": 55.3058167,
                    "contact_name": "yalagenie.com",
                    "email": accountData.username,
                    "phone": "043551315",
                    "address": "Dubai",
                    "address_type": "business",
                    "details": notes
                }
            } else if (location == "SA" || location == "SAU") {
                accountData = { ...points.getSafeArrivalCredentail(location), "token": token, v: "v1" };
                menu_id = 2;
                return {
                    "city": "riyadh",
                    "pickup": true,
                    "lat": 24.716899871826172,
                    "lon": 46.688899993896484,
                    "contact_name": "yalagenie.com",
                    "email": accountData.username,
                    "phone": "97143551315", // "966526788209, 971506073748"
                    "address": "SMSA Express Warehouse, الطريق الدائري الثاني، Riyadh Saudi Arabia",
                    "address_type": "business",
                    "details": notes
                }
            }
        }

        function getPickupInfov2() {
            if (isTaqadum) {
                accountData = { ...points.getSafeArrivalCredentail(location, isTaqadum), "token": token, v: "v2" };
                menu_id = 3;
                return {
                    "address_type": "business",
                    "name": "YALLA GENIE.com",
                    "email": accountData.username,
                    "apartment": "", // not required
                    "building": "", // not required
                    "street": "", // not required
                    "lat": 25.2766609,
                    "lon": 55.3058167,
                    "city": {
                        "code": "dubai"
                    },
                    "country": {
                        "id": 229
                    },
                    "phone": "97143970029"
                }
            } else if (location == "AE" || location == "ARE") {
                accountData = { ...points.getSafeArrivalCredentail(location), "token": token, v: "v2" };
                menu_id = 3;
                return {
                    "address_type": "business",
                    "name": "yalagenie.com",
                    "email": accountData.username,
                    "apartment": "", // not required
                    "building": "", // not required
                    "street": "", // not required
                    "lat": 25.2766609,
                    "lon": 55.3058167,
                    "city": {
                        "code": "dubai"
                    },
                    "country": {
                        "id": 229
                    },
                    "phone": "043551315"
                }
            } else if (location == "SA" || location == "SAU") {
                accountData = { ...points.getSafeArrivalCredentail(location), "token": token, v: "v2" };
                menu_id = 2;
                return {
                    "address_type": "business",
                    "name": "yalagenie.com",
                    "email": accountData.username,
                    "apartment": "", // not required
                    "building": "", // not required
                    "street": "", // not required
                    "lat": 24.716899871826172,
                    "lon": 46.688899993896484,
                    "city": {
                        "code": "riyadh"
                    },
                    "country": {
                        "id": 191
                    }, // dko sure kng required remove nlng kng napasok nmn
                    "phone": "97143551315" // "966526788209, 971506073748"
                }
            }
        }

        const locationISO2 = points.iso3toIso2(location);

        let payload = {
            "locations": [
                getPickupInfo(),
                {
                    "city": orderData.shipping_information.city.toLowerCase(),
                    "pickup": false,
                    "address": complete_address,
                    "contact_name": orderData.shipping_information.name,
                    "email": orderData.shipping_information.email,
                    "phone": libphonenumber.parsePhoneNumber(orderData.shipping_information.phone, locationISO2).number,
                    "address_type": orderData.shipping_information.address_type ? orderData.shipping_information.address_type : "residential"
                }
            ],
            "package": {
                "courier_type": "next_day",
                "menu": {
                    "id": menu_id
                }
            },
            "payment_type": "credit_balance", // credit_balance or cash (credit_balance for production, cash for development)
            "payer": "recipient",
            "recipient_not_available": "do_not_deliver",
            "charge_items": [
                {
                    "charge_type": "cod",
                    "charge": totalPrice, // total price of all line item
                    "payer": "recipient"
                },
                // Static na laging kasama
                {
                    "charge_type": "service_custom",
                    "charge": 0, // lagi set to zero
                    "payer": "recipient"
                }
            ],
            "note": notes,
            "force_create": true,
            "pickup_time_now": true,
            "fragile": true,
            "reference_id": ref_list,
            "account_data": accountData
        };

        if (v2) {
            function loginToSafeArrival(callback) {
                if (accountData.token) callback(accountData.token)
                else {
                    points.customFetch(api_link + '/api/v1/customer/authenticate', 'POST', accountData, result => {
                        if (result && result.status == "success") {
                            callback(result.data.id_token);
                        } else {
                            callback(null);
                        }
                    });
                }
            }
            let sender_data = getPickupInfov2();
            let city_id = await new Promise(async (resolve, reject) => {
                loginToSafeArrival(bearer => {
                    accountData.token = bearer;
                    localStorage.setItem("safeArrivalLoginToken", accountData.token);
                    let url = api_link + '/api/v2/cities?size=1&country_id=' + sender_data.country.id + '&search=' + orderData.shipping_information.city;
                    points.customFetchWithHeaders(url, 'GET', { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + accountData.token }, null, result => {
                        if (result.status === "success" && result.data.data && result.data.data.length !== 0) {
                            resolve(result.data.data[0].id);
                        } else {
                            localStorage.removeItem("safeArrivalLoginToken"); // invalid or expired token reset it so next click will generate new token (login)
                            points.toastrPrompt(toastr, "warning", "Check City or Try again", "An error has occurred");
                            reject("an errror has occurred while getting city id please try again", result.message);
                        }
                    });
                });
            });
            let neighborhood_id = await new Promise(async (resolve, reject) => {
                let url = api_link + "/api/v2/neighborhoods?size=1&country_id=" + sender_data.country.id + "&city_id=" + city_id + "&search=" + orderData.shipping_information.state;
                points.customFetchWithHeaders(url, 'GET', { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + accountData.token }, null, result => {
                    if (result.status === "success" && result.data.data && result.data.data.length !== 0) {
                        resolve(result.data.data[0].id);
                    } else {
                        points.toastrPrompt(toastr, "warning", "Check State/Region/District or Try again", "An error has occurred");
                        reject("an errror has occurred while getting neighborhood id please try again", result.message);
                    }
                });
            });
            payload = {
                "sender_data": sender_data,
                "recipient_data": {
                    "address_type": orderData.shipping_information.address_type ? orderData.shipping_information.address_type : "residential",
                    "name": orderData.shipping_information.name,
                    "apartment": orderData.shipping_information.aptOffice,
                    "building": orderData.shipping_information.bldgVilla,
                    "street": orderData.shipping_information.street1,
                    "city": { "id": city_id },
                    "neighborhood": { "id": neighborhood_id },
                    "phone": libphonenumber.parsePhoneNumber(orderData.shipping_information.phone, locationISO2).number,
                    "landmark": orderData.shipping_information.nearestLandmark
                },
                "dimensions": {
                    // "value": 0.5, // default ung dati, non existing sa v2
                    // "unit": "kg" // default ung dati, non existing sa v2
                    "weight": 0.5, // required (Double)
                    // "width": 32, // not required (Double)
                    // "length": 45, // not required (Double)
                    // "height": 1, // not required (Double)
                    "unit": "METRIC", // not required (String) metric or imperial
                    // "domestic": true // not required (Boolean)
                },
                "package_type": {
                    "courier_type": isTaqadum ? "next_day" : "in_5_days", // required
                    // "menu": {
                    //     "id": menu_id
                    // }
                },
                "charge_items": [
                    {
                        "charge_type": "cod",
                        "charge": totalPrice, // total price of all line item
                        "payer": "recipient"
                    },
                    // Static na laging kasama
                    {
                        "charge_type": "service_custom",
                        "charge": 0, // lagi set to zero
                        "payer": "recipient"
                    }
                ],
                "recipient_not_available": "do_not_deliver",
                "payment_type": "credit_balance", // credit_balance or cash (credit_balance for production, cash for development)
                "payer": "recipient",
                // "parcel_value": 100, // not required (Double)
                "fragile": true, // not required (Boolean)
                "note": notes,
                // "piece_count": 1, // not required (Integer)
                "force_create": true,
                "reference_id": ref_list,
                "account_data": accountData
            }
        }

        points.customFetch("/api/safe-arrival/create-order", "POST", payload, data => {
            if (data && data.status == 200) {
                this.setState({
                    sync_response_safeArrivalID: data.safeArrivalID,
                    sync_response_tracking_number: JSON.stringify(orderData.ids.map(el => {
                        return { id: el, tracking: data.trackingNumber };
                    }))
                }, () => {
                    localStorage.setItem("safeArrivalLoginToken", data.token);
                    updateMyFunnelOrders().then(({ data }) => {
                        refetch();
                        toastr.options.timeOut = 3000;
                        toastr.options.extendedTimeOut = 2000;
                        toastr.clear();
                        toastr.success("Sync success!", "");
                    }).catch(error => {
                        toastr.options.timeOut = 0;
                        toastr.options.extendedTimeOut = 0;
                        toastr.clear();
                        toastr.warning(error.graphQLErrors[0].message);
                    });
                })
            } else {
                const message = data && data.message ? data.message : "Sync Error!";
                toastr.options.timeOut = 0;
                toastr.options.extendedTimeOut = 0;
                toastr.clear();
                toastr.warning(message, "Please try again.");
            }
        });
    }

    syncOrderToFetchr(orderData, location, refetch, updateMyFunnelOrders) {
        points.toastrPrompt(toastr, "info", "Syncing order to fetchr...", "Please wait");
        var complete_address = "", has_sku = [];
        if (orderData.shipping_information.street1) complete_address += "Street: " + orderData.shipping_information.street1 + (orderData.shipping_information.state ? ", " : "");
        if (orderData.shipping_information.state) complete_address += "Area: " + orderData.shipping_information.state + (orderData.shipping_information.bldgVilla ? ", " : "");
        if (orderData.shipping_information.bldgVilla) complete_address += "Building: " + orderData.shipping_information.bldgVilla + (orderData.shipping_information.aptOffice ? ", " : "");
        if (orderData.shipping_information.aptOffice) complete_address += "Apartment: " + orderData.shipping_information.aptOffice;
        orderData.line_items.forEach(li => {
            if (li.plg_sku) has_sku.push(li);
        });
        if (has_sku.length != 0) {
            const iso2 = points.iso3toIso2(orderData.shipping_information.country);
            const payload = {
                'client_address_id': "ADDRAC00042013264_32307", // static
                'data': [
                    {
                        'order_reference': orderData.ids.map(el => mongoDBId.encode(el)).toString().substring(0, 40), // max 40 length
                        'name': (orderData.shipping_information.name).substring(0, 100), // max 100 length
                        'email': orderData.shipping_information.email,
                        'phone_number': (orderData.shipping_information.phone || "").substring(0, 64), // max 64 length
                        'alternate_phone': "",
                        'address': complete_address.substring(0, 500), // max 500 length
                        'receiver_country': points.iso2toCountryName(iso2),
                        'receiver_city': orderData.shipping_information.city,
                        'area': orderData.shipping_information.state,
                        'payment_type': "COD",
                        'bag_count': 1,
                        'weight': 0.001, // only required if international order (min: 0.001, max: 300)
                        'description': has_sku.map(e => e.inventoryDescription + ": " + e.quantity).join(", ").substring(0, 2000), // max 2000 length
                        'order_package_type': '',
                        'total_amount': has_sku.reduce((a, b) => a + b.price, 0),
                        'sms_company_name': (orderData.line_items[0].title + " - PLG Brands").substring(0, 64),
                        'items': orderData.line_items.map(e => {
                            return {
                                'description': e.inventoryDescription + " " + e.quantity,
                                'sku': e.plg_sku,
                                'quantity': 10,
                                'order_value_per_unit': e.convertedPrice
                            }
                        })
                    }
                ]
            };
            points.customFetch("/api/fetchr/create-order", "POST", payload, result => {
                toastr.clear();
                if (result && result.status == 200) {
                    // possible bukod tracking number per item result.data i loloop result.data[0].tracking_no
                    this.setState({
                        sync_from: "fetchr",
                        sync_response_safeArrivalID: result.data.trace_id,
                        sync_response_tracking_number: JSON.stringify(orderData.ids.map(el => {
                            return { id: el, tracking: result.data.data[0].tracking_no };
                        }))
                    }, () => {
                        setTimeout(function () {
                            updateMyFunnelOrders().then(({ data }) => {
                                refetch();
                                points.toastrPrompt(toastr, "success", "Sync success!");
                            }).catch(error => {
                                points.toastrPrompt(toastr, "warning", error.graphQLErrors[0].message);
                            });
                        }, 2000);
                    })
                } else {
                    const message = result && result.message ? result.message : "Sync Error!";
                    points.toastrPrompt(toastr, "warning", message, "Please try again.");
                }
            });
        } else {
            points.toastrPrompt(toastr, "warning", "PLG sku on line items is not found.");
        }
    }

    updateMyFunnelOrderShippingInformation(updateMyFunnelOrderShippingInformation, refetch) {
        this.setLoadingTime(0, 0)
        toastr.clear();
        toastr.info("Loading please wait...", "");
        updateMyFunnelOrderShippingInformation().then(({ data }) => {
            var objectToUpdate = {};
            for (var key in this.state) {
                if (key.includes("phone_") || key.includes("street1_") || key.includes("street2_") || key.includes("city_") || key.includes("state_") || key.includes("zip_") || key.includes("country_") || key.includes("address_type_") || key.includes("aptOffice_") || key.includes("bldgVilla_") || key.includes("nearestLandmark_")) {
                    objectToUpdate[key] = "";
                }
                if (key.includes("con_phone_") || key.includes("con_street1_") || key.includes("con_street2_") || key.includes("con_city_") || key.includes("con_state_") || key.includes("con_zip_") || key.includes("con_country_") || key.includes("con_address_type_") || key.includes("con_aptOffice_") || key.includes("con_bldgVilla_") || key.includes("con_nearestLandmark_")) {
                    objectToUpdate[key] = false;
                }
            }
            refetch();
            this.setState({ ...objectToUpdate, updatedPhone: "", updatedStreet1: "", updatedStreet2: "", updatedCity: "", updatedState: "", updatedZip: "", updatedCountry: "", updatedAddress_type: "", updatedAptOffice: "", updatedBldgVilla: "", updatedNearestLandmark: "" }, () => {
                this.setLoadingTime(3000, 2000);
                toastr.clear();
                toastr.success("Success", "");
            })
        }).catch(error => {
            this.setLoadingTime(0, 0);
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    getLoginBackToken() {
        const { id, privilege, firstName, email, user_session_cookie } = this.props.session.getCurrentUser;
        var token = jwt.sign({ id, privilege, firstName, email }, "23842340239480238420348394", { expiresIn: "24hr" });
        localStorage.setItem("temp_token", token);
        localStorage.setItem("temp_" + points.cookie_name, user_session_cookie);
        localStorage.setItem("temp_redirect", window.location.href);
    }

    loginAsAnonymous() {
        this.getLoginBackToken();
        const { id, privilege, firstName, email, user_session_cookie } = JSON.parse(this.state.clientTransferWise);
        var token = jwt.sign({ id, privilege, firstName, email }, "23842340239480238420348394", { expiresIn: "24hr" });
        // Start once login cookie
        Cookies.remove(points.cookie_name);
        Cookies.set(points.cookie_name, user_session_cookie);
        // End once login cookie
        Cookies.set('token', token);
        localStorage.setItem(points.plg_domain_secret, true); // the login as anonymous flag
        window.location.href = "/";
    }

    PSExportCSV() {
        points.toastrPrompt(toastr, "info", "Loading please wait...");
        let statuses = points.list_of_order_status.filter(e => e.value);
        let user_info = JSON.parse(this.state.clientTransferWise);
        let data = this.state.sales_stats_data;
        let rows = [
            ["Product Summary", ...statuses.map(e => "")],
            ["Email: " + user_info.email, ...statuses.map(e => "")],
            ["Name: " + user_info.firstName + " " + user_info.lastName, ...statuses.map(e => "")],
            ["Country: " + this.state.sales_stats_location_name, ...statuses.map(e => "")],
            ["Product Name", ...statuses.map(e => e.label)]
        ];
        data.forEach((el, i) => {
            rows.push([
                el.product_name,
                ...el.statuses.map(e => e.count.toString())
            ])
        });
        var fileName = "Product Summary " + user_info.email + " " + this.state.sales_stats_location_name;
        let data_uri = points.exportDataToUri(rows);
        points.exportDataToCSV(data_uri, fileName);
        points.toastrPrompt(toastr, "success", "Export Success!");
    }

    sortProductSummary(sortBy) {
        let state = this.state;
        let s = state.sales_stats_sort;
        let sb = state.sales_stats_sort_by;
        let data = state.sales_stats_data;

        if (sb === sortBy) s = s === "asc" ? "desc" : "asc";
        else s = "asc";

        if (sortBy === "product name") {
            data.sort((a, b) => a.product_name > b.product_name ? s === "asc" ? 1 : -1 : s === "asc" ? -1 : 1);
        } else {
            let val_info = [], sorted_val = [];
            data.forEach((e, i) => val_info.push({ value: e.statuses.filter(e => e.status === sortBy)[0].count, key: i }));
            val_info.sort((a, b) => a.value > b.value ? s === "asc" ? -1 : 1 : s === "asc" ? 1 : -1);
            val_info.forEach(e => sorted_val.push(data[e.key]))
            data = sorted_val;
        }

        this.setState({ sales_stats_sort: s, sales_stats_sort_by: sortBy, sales_stats_data: data });
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "logInPage" }}>
                <title>COD Fulfiller - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        var state = this.state;
        if (state.is_page_loading) return <LoadingPage />;
        var urlParams = points.getURLParameters(this.props.location.search);
        var currentUser = this.props.session.getCurrentUser;
        var fulfillerLocation = currentUser.access_tags.filter(tag => tag == "ph" || tag == "ae" || tag == "sa" || tag == "in");
        if (fulfillerLocation.length != 0) fulfillerLocation = fulfillerLocation[0].toUpperCase();
        else fulfillerLocation = "";
        if (urlParams.loc) fulfillerLocation = urlParams.loc;
        fulfillerLocation = fulfillerLocation.toUpperCase();
        const isHaveUserData = state.selectedUserID && state.search_user ? true : false;
        const clientTW = state.clientTransferWise ? JSON.parse(state.clientTransferWise) : null;
        const isWingFunctionAvailable = true;
        return (
            <div className="funnel">
                {this.head()}
                <style dangerouslySetInnerHTML={{ __html: ` body { background-color: #f4f9fd !important; } ` }} />
                {(() => {
                    if (isHaveUserData && clientTW) {                        
                        const image = clientTW.profileImage ? "/user-uploads/" + clientTW.profileImage : "/assets/graphics/abstract_patterns/texture.jpg";
                        return (
                            <div className={"fulfiller-tw-container " + (state.userTwOpen ? "tw-open" : "tw-close cursor-pointer")} onClick={() => {
                                if (!state.userTwOpen) this.setState({ userTwOpen: true })
                            }}>
                                <style dangerouslySetInnerHTML={{ __html: `.newPageHeader { margin-left: 110px; } .page-container { margin-left: 110px; } ` }} />
                                <div className="row-separator flex-container display-inline">
                                    <div className={"column " + (state.userTwOpen ? "column_3_12" : "column_12_12")} style={{ padding: 0, position: 'relative' }}>
                                        <img src={image} style={{ maxWidth: '100%', borderRadius: '50%' }} />
                                        <span className="color-white display-inline flex-container" style={{ position: 'absolute', right: 5, top: -5, width: 25, height: 25, backgroundColor: clientTW.privilege != 0 ? '#27c586' : '#d63031', borderRadius: '50%', marginLeft: 10 }}>{clientTW.privilege != 0 ? clientTW.privilege : "X"}</span>
                                    </div>
                                    {state.userTwOpen &&
                                        <div className="column column_9_12">
                                            <span className="fas fa-minus cursor-pointer color-green" style={{ position: 'absolute', right: 35, top: 5, padding: '1px 5px', fontSize: '1.3em', boxShadow: '0px 0px 1px 1px #dfe5eb', borderRadius: 3 }} onClick={() => this.setState({ userTwOpen: !state.userTwOpen })} />
                                            <span className="fas fa-times cursor-pointer color-dark-red" style={{ position: 'absolute', right: 5, top: 5, padding: '1px 5px', fontSize: '1.2em', boxShadow: '0px 0px 1px 1px #dfe5eb', borderRadius: 3 }} onClick={() => this.setState({ selectedUserID: '', search_user: '', search_user_input: '', userTwOpen: false })} />
                                            {clientTW.name}
                                            <label className={"header-small-light-normal"} style={{
                                                color: state.showTab === "transferwise" ? "#27c586" : "",
                                                cursor: state.showTab === "transferwise" ? "unset" : "pointer",
                                                marginTop: "0.875rem"
                                            }} onClick={() => {
                                                this.setState({
                                                    showTab : "transferwise"
                                                })
                                            }} >Transferwise Account</label>
                                            <label className={"header-small-light-normal"} style={{
                                                color: state.showTab === "payoneer" ? "#27c586" : "",
                                                cursor: state.showTab === "payoneer" ? "unset" : "pointer",
                                                marginTop: "0.875rem"
                                            }} onClick={() => {
                                                this.setState({
                                                    showTab : "payoneer"
                                                })
                                            }} >Payoneer Account</label>                                            
                                        </div>
                                    }
                                    <span className="clear" />
                                </div>
                                <div className="column column_12_12">
                                    {(() => {
                                        if (state.userTwOpen) {
                                            if (state.showTab === "transferwise") {                                                
                                                return (
                                                    <div className="row-separator">
                                                        <label className="header-small-light-bold">Account Holder:</label> <label className="row-separator" style={{ display: 'block' }}>{clientTW.business_name}</label>
                                                        <label className="header-small-light-bold">Business Email:</label> <label className="row-separator color-green" style={{ display: 'block' }}>{clientTW.business_email}</label>
                                                        <label className="header-small-light-bold">Account Number:</label> <label className="row-separator" style={{ display: 'block' }}>{clientTW.account_number}</label>
                                                        <label className="header-small-light-bold">Wire Transfer Number:</label> <label className="row-separator" style={{ display: 'block' }}>{clientTW.wire_transfer_number}</label>
                                                        <label className="header-small-light-bold">Bank code:</label> <label className="row-separator" style={{ display: 'block' }}>{clientTW.bank_code}</label>
                                                        <label className="header-small-light-bold">Routing number:</label> <label className="row-separator" style={{ display: 'block' }}>{clientTW.routing_number}</label>
                                                        <label className="header-small-light-bold">Account Type:</label> <label className="row-separator" style={{ display: 'block' }}>{clientTW.account_type}</label>
                                                        <label className="header-small-light-bold">
                                                            Address:
                                                        </label>
                                                        <label className="row-separator" style={{ display: 'block' }}>{points.showPresentableAddress(clientTW.address)}</label>
                                                    </div>
                                                );
                                            } else {
                                                if (clientTW.payoneer_details === null || clientTW.payoneer_details === undefined) {
                                                    return (
                                                        <div className="row-separator">
                                                            <div className="column column_12_12 text-center" style={{
                                                                color: "#222222",
                                                                margin: "2rem"
                                                            }}>
                                                                No Payoneer Account
                                                            </div>
                                                        </div>
                                                    );
                                                }else{
                                                    let payoneer = clientTW.payoneer_details;
                                                    return (
                                                        <div className="row-separator">
                                                            <label className="header-small-light-bold">Bank Name:</label> <label className="row-separator color-green" style={{ display: 'block' }}>{payoneer.name}</label>
                                                            <label className="header-small-light-bold">Beneficiary Name:</label> <label className="row-separator" style={{ display: 'block' }}>{payoneer.beneficiary_name}</label>
                                                            <label className="header-small-light-bold">Account Number:</label> <label className="row-separator" style={{ display: 'block' }}>{payoneer.account_number}</label>                                                            
                                                            <label className="header-small-light-bold">Routing number:</label> <label className="row-separator" style={{ display: 'block' }}>{payoneer.routing_number}</label>
                                                            <label className="header-small-light-bold">Account Type:</label> <label className="row-separator" style={{ display: 'block' }}>{payoneer.account_type}</label>
                                                            <label className="header-small-light-bold">
                                                                Address:
                                                            </label>
                                                            <label className="row-separator" style={{ display: 'block' }}>{points.showPresentableAddress(payoneer.address)}</label>
                                                        </div>
                                                    );  
                                                }
                                            }
                                        } else {
                                            return null;
                                        }
                                    })()}
                                    {/* send notification / sms */}
                                    {state.userTwOpen &&
                                        <div>
                                            <label className="font-roboto-bold row-separator" style={{ display: 'block' }}>Send a Message/Notification</label>
                                            <textarea className="stretch-width" name="send_message" rows="5" value={state.send_message} onChange={event => this.handleOnChange(event)} placeholder={"Use this field to send message / notification to " + clientTW.name} />
                                            <Mutation mutation={PUSH_NOTIFICATION} variables={{ id: state.selectedUserID, sendTo: null, type: "info", message: state.send_message }}>
                                                {(pushNotification, { data, loading, error }) => {
                                                    return (
                                                        <ButtonWithPopup data={{
                                                            triggerDOM: <button id="btn_send_email" className="btn-success stretch-width row-separator" disabled={loading}>Send</button>,
                                                            popupPosition: "top center",
                                                            text: <h3 style={{ margin: 10 }}>Are you sure?</h3>,
                                                            padding: 0,
                                                            arrow: true,
                                                            triggerID: "btn_send_email",
                                                            action: () => this.pushNotification(pushNotification),
                                                            style: { maxWidth: 220, minWidth: 220, borderRadius: 5 }
                                                        }} />
                                                    );
                                                }}
                                            </Mutation>
                                            <Tooltip trigger={<button id="login_as_anonymous" className="btn-success stretch-width row-separator">Login as anonymous</button>} on="click">
                                                <div style={{ padding: 2 }}>
                                                    <h3 className="text-center">Are you sure?</h3>
                                                    <div className="display-inline">
                                                        <button className="btn-success" onClick={() => this.loginAsAnonymous()} style={{ width: '49%', marginRight: '1%' }}>Yes</button>
                                                        <button className="btn-danger" onClick={() => document.getElementById("login_as_anonymous").click()} style={{ width: '50%', marginLeft: '1%' }}>No</button>
                                                    </div>
                                                </div>
                                            </Tooltip>
                                            {(() => {
                                                if (state.userTwOpen) {
                                                    const payoutDate = 1; // or monday
                                                    const weekStartFrom = -2; // or last friday

                                                    const currentDate = moment().local();
                                                    const thisWeekMonday = moment(new Date(currentDate.toString())).local().weekday(payoutDate);
                                                    const lastFriday = moment(thisWeekMonday).startOf('week').local().weekday(weekStartFrom);
                                                    const endWeek = state.fromAdminPayouts ? state.filterByEndDate : moment(new Date(points.deducDateFrom(new Date(lastFriday.toString()), 8))).local(); // may allowance na isa
                                                    const startWeek = state.fromAdminPayouts ? state.filterByStartDate : moment(endWeek).startOf('week').weekday(weekStartFrom).local();

                                                    console.group();
                                                    console.log("Current Date: ==>", currentDate.toString());
                                                    console.log("This week MONDAY: ==>", thisWeekMonday.toString());
                                                    console.log("Last FRIDAY of MONDAY: ==>", lastFriday.toString());
                                                    console.log("Start Week Range ==>", startWeek.toString());
                                                    console.log("End Week Range ==>", endWeek.toString());
                                                    console.groupEnd();
                                                    return (
                                                        <Query query={GET_MY_PAY_CHECK}
                                                            variables={{
                                                                creator: state.selectedUserID,
                                                                order_status: "delivered",
                                                                fulfillerLocation: fulfillerLocation,
                                                                dateStart: points.sendDateToServer(startWeek.toString(), true),
                                                                dateEnd: points.sendDateToServer(endWeek.toString()),
                                                                isAdminPayout: true
                                                            }} onCompleted={data => this.setState({ totalPayment: data.getMyPayCheck.count })} notifyOnNetworkStatusChange>
                                                            {({ data, loading, refetch, error }) => {
                                                                if (loading || error) return null;
                                                                if (data.getMyPayCheck.count == 0) {
                                                                    return (
                                                                        <div className="row-separator" style={{ border: '1px solid #dfe5eb', padding: 10, borderRadius: 3 }}>
                                                                            <label>                                                                               
                                                                                No order has been delivered from <br />
                                                                                <strong>{startWeek.toString().substring(0, 15)}</strong> to <strong>{endWeek.toString().substring(0, 15)}</strong>. <br />
                                                                                check back soon.
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                }
                                                                return (
                                                                    <div className="row-separator" style={{ border: '1px solid #dfe5eb', padding: 10, borderRadius: 3 }}>
                                                                        <label>
                                                                        Note: We have deducted 5% from your total Payout for money transfer fee <br/>
                                                                            Estimated Payout from <br />
                                                                            <strong>{startWeek.toString().substring(0, 15)}</strong> to <strong>{endWeek.toString().substring(0, 15)}</strong>
                                                                        </label> <br />
                                                                        <label className="color-orange" style={{ fontSize: '1.5em' }}>
                                                                            <label>
                                                                                <strong>
                                                                                    ${points.commafy(points.getTaxPercent(0.05, parseFloat(data.getMyPayCheck.count)).toFixed(2))}
                                                                                </strong>
                                                                                ({points.commafy(data.getMyPayCheck.count.toFixed(2))})
                                                                            </label>
                                                                        </label>
                                                                    </div>
                                                                );
                                                            }}
                                                        </Query>
                                                    );
                                                } else {
                                                    return null;
                                                }
                                            })()}
                                            {state.fromAdminPayouts && currentUser.access_tags.includes("god") ?
                                                <Mutation
                                                    mutation={MARK_ALL_AS_PAID}
                                                    variables={{
                                                        creator: state.selectedUserID,
                                                        updaterID: currentUser.id,
                                                        updaterName: currentUser.firstName + " " + currentUser.lastName,
                                                        dateStart: points.sendDateToServer(state.filterByStartDate, true),
                                                        dateEnd: points.sendDateToServer(state.filterByEndDate),
                                                        totalPayment: state.totalPayment.toString(),
                                                        fulfillerLocation: fulfillerLocation
                                                    }} >
                                                    {(markAllAsPaid, { data, loading, error }) => {
                                                        return (
                                                            <ButtonWithPopup data={{
                                                                triggerDOM: <button id={state.selectedUserID} className="btn-success stretch-width row-separator">Mark as paid</button>,
                                                                popupPosition: "top center",
                                                                text: <h3 style={{ margin: 10 }}>Are you sure?</h3>,
                                                                padding: 0,
                                                                arrow: true,
                                                                triggerID: state.selectedUserID,
                                                                action: () => points.executeMutation(markAllAsPaid, toastr, () => {
                                                                    if (this.refetchForAdminPayouts) this.refetchForAdminPayouts();
                                                                    toastr.options.timeOut = 3000;
                                                                    toastr.options.extendedTimeOut = 2000;
                                                                    toastr.success("Successfully paid the user.", "Success");
                                                                }),
                                                                style: { maxWidth: 220, minWidth: 220, borderRadius: 5 }
                                                            }} />
                                                        );
                                                    }}
                                                </Mutation>
                                                : void 0}
                                            <div className="row-separator text-center">
                                                <label className="font-roboto-bold">Product Summary</label>
                                            </div>
                                            <Query query={GET_ORDER_STATUS_RATES_PER_COUNTRY} variables={{
                                                creator: state.selectedUserID,
                                                dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                                dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                                location: fulfillerLocation,
                                                summary: true
                                            }}>
                                                {({ data, loading, refetch, error }) => {
                                                    if (loading || error) return null;
                                                    let result = JSON.parse(data.getOrderStatusRatesPerCountry.jsonStr);
                                                    return Object.keys(result).filter(e => e !== "total").map((country, i) => {
                                                        let cdata = result[country], cname = points.iso2toCountryName(country);
                                                        let orders_length = cdata.reduce((a, b) => a + b.count, 0);
                                                        if (orders_length === 0) return null;
                                                        return (
                                                            <div className="row-separator" key={i}>
                                                                <label className="font-roboto-bold">
                                                                    {cname} <span className="color-green">{orders_length}</span>
                                                                    <span className="clickable float-right" onClick={() => this.setState({ show_sales_stats: true, sales_stats_location_iso2: country, sales_stats_location_name: cname })}>View</span>
                                                                </label>
                                                                {points.list_of_order_status.filter(e => e.value).map((status, x) => {
                                                                    let sdata = cdata.filter(e => e.status == status.value)[0];
                                                                    return (
                                                                        <div className="display-inline" key={i + "_" + x} style={{ lineHeight: 1.5 }}>
                                                                            <label className="header-small-light-bold" style={{ marginRight: 5 }}>{points.capitalizeWord(status.value)}:</label>
                                                                            <label className="color-dark-red">{sdata.count}</label>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        );
                                                    });
                                                }}
                                            </Query>
                                        </div>
                                    }
                                    {!state.userTwOpen && <label style={{ transform: 'rotate(-90deg)', display: 'block', whiteSpace: 'nowrap', position: 'absolute', left: '-100%', bottom: '50%', fontSize: '2em' }}>CLICK HERE TO OPEN</label>}
                                </div>
                            </div>
                        );
                    } else {
                        return null;
                    }
                })()}
                <div className="flex-container display-inline newPageHeader" style={{ position: 'relative' }}>
                    <div className="column column_9_12 display-inline flex-container" style={{ justifyContent: 'flex-start' }}>
                        <div style={{ margin: '0px 10px 5px' }}>
                            <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>COD Fulfiller ({fulfillerLocation})</h4>
                            <label style={{ color: '#878787' }}>You have <span className="font-bold" style={{ color: '#23c78a' }}>{state.totalOrders}</span> orders to fulfill</label>
                        </div>
                        <div style={{ margin: '0px 10px 5px' }}>
                            <label className="header-medium-bold">
                                <span className="fas fa-exclamation-triangle color-orange" style={{ marginRight: 6 }} />
                                Product is Inactive
                            </label>
                            <label className="header-medium-bold">
                                <span className="fas fa-check color-blue" style={{ marginRight: 8 }} />
                                Has serial number
                            </label>
                            <label className="header-medium-bold">
                                <span className="fas fa-shipping-fast color-green" style={{ marginRight: 4 }} />
                                Has tracking number
                            </label>
                        </div>
                        <div style={{ margin: '0px 10px 5px' }}>
                            <label className="header-medium-bold">
                                <span className="fas fa-times color-dark-red" style={{ marginRight: 10 }} />
                                Remove Line Item from order
                            </label>
                            <label className="header-medium-bold">
                                <span className="fas fa-cog color-green" style={{ marginRight: 5 }} />
                                Order Setting
                            </label>
                            <label className="header-medium-bold">
                                <span className="fas fa-share-square color-green" style={{ marginRight: 4 }} />
                                Visit Order Link
                            </label>
                        </div>
                        <div style={{ margin: '0px 10px 5px' }}>
                            <label className="header-medium-bold display-inline" style={{ display: 'flex' }}>
                                <div style={{ marginRight: 5, width: 40, height: 20, backgroundColor: '#d63031' }} />
                                Selling price too low (Do Not Fulfill)
                            </label>
                        </div>
                    </div>
                    <div className="column column_3_12 flex-container display-inline" style={{ justifyContent: 'flex-end' }}>
                        <div className="column column_12_12" style={{ position: 'relative', padding: 0 }}>
                            <SearchField
                                name="search_user_input"
                                value={state.search_user_input}
                                placeHolder="Search Client Information"
                                tooltip="Search by funnel domain, email, first name, last name"
                                containerClassName="stretch-to-mobile"
                                onSubmit={value => this.setState({ search_user: value, search_user_input: value, showResult: true })}
                            />
                            {state.showResult &&
                                <ul className="item-list stretch-width" style={{ position: 'absolute', border: '1px solid #d8d8d8', borderTop: 'none', display: 'block', zIndex: 1, backgroundColor: '#fff' }}>
                                    <li onClick={() => this.setState({ selectedUserID: "", search_user: "", search_user_input: "", showResult: false })}>Display All</li>
                                    <Query query={GET_USERS_OF_FUNNEL_ORDERS} variables={{ search_user: state.search_user }}>
                                        {({ data, loading, refetch, error }) => {
                                            if (loading || error) return <li><Loading width={40} height={40} /></li>;
                                            return data.getUsersOfFunnelOrders.map((el, index) => {
                                                return <li key={index} onClick={() => this.setState({ selectedUserID: el.id, search_user: el.email, showResult: false })}>{el.firstName} {el.lastName}</li>
                                            })
                                        }}
                                    </Query>
                                </ul>
                            }
                        </div>
                        <button className="btn-success fas fa-exchange-alt" onClick={() => this.setState({ returning: true })} style={{ padding: '15px 13px', position: 'fixed', bottom: 145, right: 10, borderRadius: '50%', zIndex: 3 }} />
                        <button className="btn-success fas fa-warehouse" onClick={() => this.props.history.push('/admin-manage-cod-products')} style={{ padding: '15px 13px', position: 'fixed', bottom: 90, right: 10, borderRadius: '50%', zIndex: 3 }} />
                        <ApolloConsumer>
                            {client => {
                                return (
                                    <ButtonWithPopup data={{
                                        triggerDOM: <button className="btn-warning fas fa-sign-out-alt" onClick={() => this.handleSignout(client)} style={{ padding: 15, position: 'fixed', bottom: 35, right: 10, borderRadius: '50%', zIndex: 3 }} />,
                                        popupPosition: "left center",
                                        text: <label>Signout / Logout</label>,
                                        loading: false,
                                        padding: 0,
                                        arrow: true,
                                        style: { padding: 15, width: "fit-content", borderRadius: 5 },
                                        onAction: 'hover',
                                        checkORtimesButton: false
                                    }} />
                                );
                            }}
                        </ApolloConsumer>
                    </div>
                    <span className="clear" />
                </div>
                <div className="page-container">
                    <div className="filter-container">
                        <ButtonWithPopup data={{
                            triggerDOM: <button id="duplicate_sensitivity" className="btn-success stretch-to-mobile" style={{ margin: "0 5px" }}>Duplicate Sensitivity</button>,
                            popupPosition: "bottom center",
                            text: (
                                <div className="text-left">
                                    <Checkbox
                                        id="duplicate_email"
                                        label="By Email"
                                        labelClassName="header-medium-bold font-small"
                                        checked={state.duplicate_email}
                                        onChange={value => this.setState({ duplicate_email: value })}
                                        containerClassName="row-separator"
                                    />
                                    <Checkbox
                                        id="duplicate_phone"
                                        label="By Phone"
                                        labelClassName="header-medium-bold font-small"
                                        checked={state.duplicate_phone}
                                        onChange={value => this.setState({ duplicate_phone: value })}
                                        containerClassName="row-separator"
                                    />
                                    <Checkbox
                                        id="duplicate_product_name"
                                        label="By Products"
                                        labelClassName="header-medium-bold font-small"
                                        checked={state.duplicate_product_name}
                                        onChange={value => this.setState({ duplicate_product_name: value })}
                                    />
                                </div>
                            ),
                            arrow: true,
                            style: { borderRadius: 3, padding: 20, minWidth: 200, maxWidth: 200 },
                            checkORtimesButton: false
                        }} />
                        {isWingFunctionAvailable &&
                            <button className="btn-success stretch-to-mobile" onClick={() => {
                                document.querySelectorAll(".resync-order").forEach(el => {
                                    el.click();
                                    setTimeout(function () {
                                        if (el.parentNode.querySelector(".popup-content button")) {
                                            el.parentNode.querySelector(".popup-content button").click();
                                        }
                                    }, 500);
                                });
                            }} style={{ margin: "0 5px" }}>
                                Resync this page
                            </button>
                        }
                        {state.orderList.length != 0 &&
                            <Tooltip trigger={<button id="export_to" className="btn-success stretch-to-mobile margin-both-side" disabled={state.exportAllBtn}>Export to</button>} position="bottom center" on="click" arrow>
                                <ul className="item-list">
                                    <li onClick={() => {
                                        this.exportAllToCSV(fulfillerLocation);
                                        document.getElementById("export_to").click();
                                    }} style={{ margin: 0 }}>CSV</li>
                                    <li onClick={() => this.exportAllToExcel(fulfillerLocation)} style={{ margin: 0 }}>
                                        {(() => {
                                            if (!state.exportAllBtn && state.excel_data.length == 0) {
                                                return "Excel";
                                            } else if (state.excel_data.length == 0) {
                                                return (
                                                    <span className="display-inline">
                                                        Generating... <Loading width={15} height={15} />
                                                    </span>
                                                );
                                            } else {
                                                // return (
                                                //     <ExcelFile element={<span onClick={() => document.getElementById("export_to").click()} >Download Excel</span>}>
                                                //         <ExcelSheet data={state.excel_data} name="Test">
                                                //             <ExcelColumn label="Ref ID" value="ref_id" />
                                                //             <ExcelColumn label="Sync From" value="sync_from" />
                                                //             <ExcelColumn label="Inventory Name" value="inventory_name" />
                                                //             <ExcelColumn label="Product Description" value="inventory_description" />
                                                //             <ExcelColumn label="Date" value="date" />
                                                //             <ExcelColumn label="Owner Name" value="owner_name" />
                                                //             <ExcelColumn label="Owner Email" value="owner_email" />
                                                //             <ExcelColumn label="Tracking Number" value="tracking_number" />
                                                //             <ExcelColumn label="Merchant Type" value="merchant_type" />
                                                //             <ExcelColumn label="POD" value="pod" />
                                                //             <ExcelColumn label="Design URL" value="design_url" />
                                                //             <ExcelColumn label="Product" value="product" />
                                                //             <ExcelColumn label="Variant" value="variant" />
                                                //             <ExcelColumn label="Local Price" value="local_price" />
                                                //             <ExcelColumn label="To Be Collected" value="to_be_collected" />
                                                //             <ExcelColumn label="Price" value="price" />
                                                //             <ExcelColumn label="Item Cost" value="item_cost" />
                                                //             <ExcelColumn label="Fulfillment Cost" value="fulfillment_cost" />
                                                //             <ExcelColumn label="PLG" value="plg" />
                                                //             <ExcelColumn label="Affiliate Cost" value="affiliate_cost" />
                                                //             <ExcelColumn label="Delivery Cost" value="delivery_cost" />
                                                //             <ExcelColumn label="Tax" value="tax" />
                                                //             <ExcelColumn label="Quantity" value="quantity" />
                                                //             <ExcelColumn label="Total Product Cost" value="total_product_cost" />
                                                //             <ExcelColumn label="Payout" value="payout" />
                                                //             <ExcelColumn label="Email" value="email" />
                                                //             <ExcelColumn label="Phone" value="phone" />
                                                //             <ExcelColumn label="Shipping Name" value="shipping_name" />
                                                //             <ExcelColumn label="Shipping Address1" value="shipping_address1" />
                                                //             <ExcelColumn label="Shipping City" value="shipping_city" />
                                                //             <ExcelColumn label="Shipping Zip" value="shipping_zip" />
                                                //             <ExcelColumn label="Shipping State/Province" value="shipping_state/province" />
                                                //             <ExcelColumn label="Apartment / Office" value="apartment_/_office" />
                                                //             <ExcelColumn label="Building / Villa" value="building_/_villa" />
                                                //             <ExcelColumn label="Shipping Nearest Landmark" value="shipping_nearest_landmark" />
                                                //             <ExcelColumn label="Shipping Country" value="shipping_country" />
                                                //             <ExcelColumn label="Notes" value="notes" />
                                                //             <ExcelColumn label="Order Status" value="order_status" />
                                                //             <ExcelColumn label="Delivered Date" value="delivered_date" />
                                                //             <ExcelColumn label="Affiliate Email" value="affiliate_email" />
                                                //         </ExcelSheet>
                                                //     </ExcelFile>
                                                // );
                                            }
                                        })()}
                                    </li>
                                </ul>
                            </Tooltip>
                        }
                        <SearchField
                            name="search"
                            value={state.search}
                            placeHolder="Search Order Information"
                            tooltip="Search by ref, name, email, tracking number, product name, serial number"
                            width={230}
                            containerClassName="stretch-to-mobile"
                            containerStyle={{ margin: '0 5px' }}
                            onSubmit={value => {
                                this.setState({ refid: value, search: value, currentPage: 1 })
                            }}
                        />
                        <ButtonWithPopup data={{
                            triggerDOM: <div className="stretch-to-mobile custom-select" style={{ margin: "0 5px" }}>
                                <div className="select-selected stretch-width text-left">Date</div>
                            </div>,
                            popupPosition: "bottom center",
                            text: <div className="infinite-calendar">
                                <InfiniteCalendar
                                    Component={CalendarWithRange}
                                    width={300}
                                    height={400}
                                    // TODO :: min={new Date(2020,5,1)}
                                    selected={{
                                        start: state.filterByStartDate ? state.filterByStartDate : new Date(),
                                        end: state.filterByEndDate ? state.filterByEndDate : new Date(),
                                    }}
                                    locale={{
                                        headerFormat: 'MMM Do',
                                    }}
                                    onSelect={data => this.filterDate(data)}
                                    theme={points.infiniteCalendarTheme()}
                                />
                            </div>,
                            loading: false,
                            padding: 0,
                            style: { maxWidth: 300 },
                            checkORtimesButton: false
                        }} />
                        {(() => {
                            let courier_list = [<option value="" key={0}>Select Courier</option>];
                            points.cod_available_courier.forEach((courier, i) => {
                                courier_list.push(<option value={courier.value} key={i + 1}>{courier.label}</option>);
                            });
                            return <SelectTag name="filter_tracking_courier" value={state.filter_tracking_courier} options={courier_list} onChange={event => this.setState({ filter_tracking_courier: event.target.value })} style={{ width: 150, margin: "0 5px" }} />;
                        })()}
                        {(() => {
                            var courier_option = [
                                <option value="" key={0}>All Order</option>,
                                <option value="collected" key={1}>Collected</option>,
                                <option value="uncollected" key={2}>Uncollected</option>
                            ];
                            return <SelectTag name="filter_courier_collected" value={state.filter_courier_collected} options={courier_option} onChange={event => this.setState({ filter_courier_collected: event.target.value })} style={{ width: 150, margin: "0 5px" }} />;
                        })()}
                        {(() => {
                            var orderStatusOptions = points.list_of_order_status.map((status, i) => {
                                return <option value={status.value} key={i}>{status.label}</option>;
                            });
                            return <SelectTag className="stretch-to-mobile" name="filter_order_status" value={state.filter_order_status} options={orderStatusOptions} onChange={event => this.setState({ filter_order_status: event.target.value })} style={{ width: 170, margin: "0 5px" }} />;
                        })()}
                        {(() => {
                            var cod_cc_option = [
                                <option value="" key={0}>All Payment Method</option>,
                                <option value="cod" key={1}>COD</option>,
                                <option value="credit_card" key={2}>PLG Merchant</option>
                            ];
                            return <SelectTag name="filter_payment_method" value={state.paid_cc} options={cod_cc_option} onChange={event => this.setState({ paid_cc: event.target.value })} style={{ width: 150, margin: "0 5px" }} />;
                        })()}
                        {state.totalOrders != 0 ?
                            <Pagination totalPage={state.totalOrders} currentPage={state.currentPage} action={result => this.setState({ currentPage: result })} style={{ margin: "0 5px" }} />
                            : void 0}
                        <span className="clear" />
                    </div>
                    {state.refid || state.currentPage > 1 || state.paid_cc || state.filter_order_status || (state.filterByStartDate && state.filterByEndDate) || state.filter_tracking_courier || state.filter_courier_collected ?
                        <div className="flex-container" style={{ justifyContent: 'flex-start' }}>
                            {state.refid &&
                                <ShowFilter label={points.isArray(state.refid) ? state.refid : "Search: " + state.refid} onClick={val => this.setState({ refid: val || "", search: val || "" })} />
                            }
                            {state.currentPage > 1 &&
                                <ShowFilter label={"Page: " + state.currentPage} onClick={() => this.setState({ currentPage: 1 })} />
                            }
                            {state.filter_order_status &&
                                <ShowFilter label={state.filter_order_status} onClick={() => this.setState({ filter_order_status: "" })} />
                            }
                            {state.filter_tracking_courier &&
                                <ShowFilter label={state.filter_tracking_courier.toUpperCase()} onClick={() => this.setState({ filter_tracking_courier: "" })} />
                            }
                            {state.filter_courier_collected &&
                                <ShowFilter label={state.filter_courier_collected} onClick={() => this.setState({ filter_courier_collected: "" })} />
                            }

                            {state.paid_cc.length != 0 &&
                                <ShowFilter label={state.paid_cc == "cod" ? "Cash On Delivery" : "PLG Merchant"} onClick={() => this.setState({ paid_cc: "" })} />
                            }

                            {state.filterByStartDate && state.filterByEndDate ?
                                <ShowFilter label={state.filterByStartDate + " - " + state.filterByEndDate} onClick={() => this.setState({ filterByStartDate: "", filterByEndDate: "" })} />
                                : void 0}
                        </div>
                        : void 0}
                    <Query query={
                        GET_FUNNEL_ORDERS(`{ ids plgbuttonID paid_cc has_pod design_url received_payment_from_courier sms_verified sync_from creator order_date order_status_update dateStatusDelivered merchant_type orderCreator count userData order_status currencySymbol cancel_note currencyWord shipping_information { name email phone street1 street2 city state zip address_type aptOffice bldgVilla nearestLandmark country } line_items { active inventoryName inventoryDescription title receipt_cc variant price convertedPrice quantity productCost payoutPrice plg_sku plg_serialNumber tracking_number shopify_order_number } updateByName }`)
                    } variables={{
                        id: state.selectedUserID,
                        plgbuttonID: "",
                        orderid: points.isArray(state.refid) ? JSON.stringify(state.refid) : state.refid,
                        fulfillerLocation: fulfillerLocation,
                        merchant_type: "cod",
                        paid_cc: state.paid_cc == '' ? null : state.paid_cc == "cod" ? false : true,
                        order_status: state.filter_order_status == "unfulfilled" ? "unpaid" : state.filter_order_status,
                        filterByStartDate: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                        filterByEndDate: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                        skip: state.currentPage - 1,
                        cod_analytics: true,
                        tracking_courier: state.filter_tracking_courier,
                        show_courier_collected: state.filter_courier_collected
                    }} onCompleted={data => {
                        var saveState = {
                            orderList: data.getMyFunnelOrders,
                            totalOrders: data.getMyFunnelOrders.length != 0 ? data.getMyFunnelOrders[0].count : 0
                        }
                        if (isHaveUserData) {
                            saveState.clientTransferWise = data.getMyFunnelOrders.length != 0 ? data.getMyFunnelOrders[0].userData : "";
                        }
                        this.setState(saveState, () => {
                            if (document.querySelector(".page-container") && document.querySelector(".product-card")) {
                                let height = document.querySelector(".page-container").style.height = ((data.getMyFunnelOrders.length * (document.querySelector(".product-card").offsetHeight + 20)) + 301 + 60 + 40);
                                document.querySelector(".page-container").style.height = `${height}px`;
                            }
                        });
                    }} notifyOnNetworkStatusChange>
                        {({ data, loading, refetch, error }) => {
                            if (loading && state.orderList.length == 0) return <div className="text-center"><Loading width={200} height={200} /></div>;
                            if (error) return <div className="text-center" style={{ padding: 20 }}>An error has occurred.</div>;
                            if (data.getMyFunnelOrders.length == 0 && state.orderList.length == 0) {
                                return (
                                    <div className="center-vertical-parent" style={{ height: '75vh', width: '100%' }}>
                                        <div className="center-vertical text-center">
                                            <img src="/assets/graphics/no-result.svg" style={{ height: '50vh' }} />
                                            <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! NO ORDERS FOUND!</h4> <br />
                                            <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>There's no order for COD ({fulfillerLocation}) Please comeback again...</label>
                                        </div>
                                    </div>
                                )
                            }
                            if (state.fromAdminPayouts) this.refetchForAdminPayouts = refetch;
                            /*
                                start experiment no loading animation
                                also if remove experiment fix upper condition
                            */
                            var dataToUse = [];
                            if (data.getMyFunnelOrders.length == 0) {
                                dataToUse = state.orderList;
                            } else {
                                dataToUse = data.getMyFunnelOrders;
                            }
                            // end experiment no loading animation
                            var duplicateList = [];

                            return dataToUse.map((el, i) => {
                                var creator_data = el.userData ? JSON.parse(el.userData) : null;
                                var allLineItemName = el.line_items.map(map => map.title).toString();
                                var style = { padding: 20 };
                                var isDuplicate = false, otherOrderId = "";
                                var searchForDuplicateOrder = el.shipping_information.email ? el.shipping_information.email : el.shipping_information.phone;
                                var duplicateObject = { duplicateBy: el.orderCreator + "_" + i };
                                if (state.duplicate_email) duplicateObject.email = el.shipping_information.email;
                                if (state.duplicate_phone) duplicateObject.phone = el.shipping_information.phone;
                                if (state.duplicate_product_name) duplicateObject.prodName = allLineItemName;
                                duplicateList.filter(filter => {
                                    var con1 = "", con2 = "", condition = "";
                                    if (duplicateObject.email && duplicateObject.phone) con1 = " || ";
                                    if (duplicateObject.phone && duplicateObject.prodName) con2 = " && ";
                                    if (duplicateObject.email && duplicateObject.prodName) con1 = " && ";

                                    if (duplicateObject.email) condition += "(filter.email && filter.email == duplicateObject.email)" + con1;
                                    if (duplicateObject.phone) condition += "(filter.phone && filter.phone == duplicateObject.phone)" + con2;
                                    if (duplicateObject.prodName) condition += "filter.prodName == duplicateObject.prodName";
                                    const isOk = eval(condition);
                                    if (isOk) {
                                        isDuplicate = true;
                                        otherOrderId = filter.duplicateBy;
                                    }
                                    // if(((filter.email && filter.email == duplicateObject.email) || (filter.phone && filter.phone == duplicateObject.phone)) && filter.prodName == duplicateObject.prodName && el.order_status != "cancelled") {
                                    //     isDuplicate = true;
                                    // }
                                });
                                duplicateList.push(duplicateObject);
                                if (isDuplicate) style.border = "5px solid red";
                                var hasTrackingNumber = el.line_items[0].tracking_number ? true : false;
                                const sync_from = el.sync_from;
                                const received_payment_from_courier = el.received_payment_from_courier ? true : false;
                                var disable_order = false;
                                if (el.order_status == "unpaid" || el.order_status == "unfulfilled") {
                                    el.line_items.forEach(li => {
                                        if (li.inventoryName) {
                                            if (!li.active) disable_order = true;
                                        }
                                    })
                                }
                                return (
                                    <div id={el.orderCreator + "_" + i} className="product-card" style={style} key={i}>
                                        {/* {isDuplicate && <label className="duplicate-note" onClick={() => this.setState({ search: searchForDuplicateOrder, refid: searchForDuplicateOrder })}>Posible of duplicate order. Click here to find other orders.</label> } */}
                                        {/* {isDuplicate && <label className="duplicate-note" onClick={() => points.smoothScrollInto(document.getElementById(otherOrderId))}>Posible of duplicate order. Click here to scroll to other order.</label> } */}
                                        {loading &&
                                            <div className="loading-text-container center-vertical">
                                                <Loading width={200} height={200} />
                                            </div>
                                        }
                                        {disable_order &&
                                            <div className="loading-text-container center-vertical">
                                                <label style={{ fontSize: '2.5em' }}>No inventory left for this order.</label>
                                            </div>
                                        }
                                        {creator_data &&
                                            <div className="column column_12_12 row-separator ellipsis">
                                                {isDuplicate &&
                                                    <div className="column column_4_12" style={{ padding: 0 }}>
                                                        <label className="duplicate-note">Posible of duplicate order. Click here to scroll to other order.</label>
                                                    </div>
                                                }
                                                <div className={"column " + (isDuplicate ? "column_4_12" : "column_6_12")} style={{ padding: 0 }}>
                                                    {(currentUser.access_tags.includes("god") || currentUser.access_tags.includes("fulfiller")) && el.line_items.length > 1 && ["unpaid", "unfulfilled"].includes(el.order_status) ?
                                                        <Mutation
                                                            mutation={SPLIT_OR_MERGE_COD_ORDERS}
                                                            variables={{ ids: JSON.stringify(el.ids), action: "split" }} >
                                                            {(splitOrMergeCODOrders, { data, loading, error }) => {
                                                                return (
                                                                    <ButtonWithPopup data={{
                                                                        loading: loading,
                                                                        triggerID: "split_" + i,
                                                                        triggerDOM: <label id={"split_" + i} className="header-medium-bold clickable"><span className="fas fa-cut" /> Split Line Items</label>,
                                                                        popupPosition: "top left",
                                                                        text: <h3 style={{ margin: 0 }}>Are you sure?</h3>,
                                                                        action: () => points.executeMutation(splitOrMergeCODOrders, toastr, () => {
                                                                            refetch();
                                                                            points.toastrPrompt(toastr, "success", "Line items has been splitted");
                                                                        }),
                                                                        padding: 10,
                                                                        style: { maxWidth: 220, minWidth: 220, borderRadius: 5 }
                                                                    }} />
                                                                );
                                                            }}
                                                        </Mutation>
                                                        : <label>&nbsp;</label>}
                                                </div>
                                                <div className={"column " + (isDuplicate ? "column_4_12" : "column_6_12") + " text-right"} style={{ padding: 0 }}>
                                                    <label className="header-medium-bold clickable float-right" onClick={() => this.setState({ selectedUserID: el.creator, search_user: creator_data.email, currentPage: 1 })} style={{ display: 'unset' }}>{creator_data.name + " - " + creator_data.email}</label>
                                                </div>
                                            </div>
                                        }
                                        <div className="column column_3_12 row-separator" style={{ border: '1px solid #dfe5eb', backgroundColor: '#f4f9fd', borderRadius: 5, paddingTop: 10 }}>
                                            {el.sms_verified &&
                                                <div className="float-right text-center" style={{ backgroundColor: '#27c586', padding: 7, 'position': 'relative', borderRadius: '50%' }}>
                                                    <label className="color-white font-small" style={{ lineHeight: 1.6, fontWeight: 700 }}>
                                                        SMS <br />
                                                        Verified
                                                    </label>
                                                </div>
                                            }
                                            <div className="row-separator">
                                                {/* {el.paid_cc && } */}
                                                {(() => {
                                                    if (el.paid_cc != null) {
                                                        if (el.merchant_type === "plgbutton") {
                                                            return <React.Fragment>
                                                                <label className="header-small-light-bold" style={{
                                                                    color: "#008000",
                                                                    fontSize: "1.3rem"
                                                                }}>PLG Button Merchant</label>
                                                                <br />
                                                            </React.Fragment>;
                                                        }
                                                        else if (el.paid_cc) {
                                                            return <React.Fragment>
                                                                <label className="header-small-light-bold" style={{
                                                                    color: "#008000",
                                                                    fontSize: "1.3rem"
                                                                }}>PLG Merchant</label>
                                                                <br />
                                                            </React.Fragment>;
                                                        }
                                                    }
                                                })()}
                                                <label className="header-small-light-bold">
                                                    Shipping Information
                                                    <span className="fas fa-copy clickable" style={{ marginLeft: 10 }} onClick={() => {
                                                        let info = el.shipping_information, copy_str = "";
                                                        if (info.city) copy_str += info.city + "\n";
                                                        if (info.state) copy_str += info.state + "\n";
                                                        if (info.address1) copy_str += info.address1 + "\n";
                                                        if (info.aptOffice) copy_str += info.aptOffice + "\n";
                                                        if (info.bldgVilla) copy_str += info.bldgVilla + "\n";
                                                        if (info.nearestLandmark) copy_str += info.nearestLandmark + "\n";
                                                        if (info.country) {
                                                            let iso2 = points.iso3toIso2(info.country);
                                                            copy_str += points.iso2toCountryName(iso2) + "\n";
                                                        }
                                                        points.copyStringToClipboard(copy_str);
                                                        points.toastrPrompt(toastr, "success", "Successfully copied to clipboard");
                                                    }} />
                                                </label>
                                            </div>
                                            <div>
                                                <label className="header-medium-bold clickable" onClick={() => this.setState({ search: searchForDuplicateOrder, refid: searchForDuplicateOrder })}>{el.shipping_information.name}</label>
                                                <label style={{ color: '#ef8805', fontFamily: "'Roboto', sans-serif" }}>{el.shipping_information.email}</label>
                                            </div>
                                            <div className="row-separator">
                                                <label className="display-inline">
                                                    Phone:
                                                    {(() => {
                                                        var infoStateName = "con_phone_" + i, textStateName = "phone_" + i;
                                                        var phoneValue = el.shipping_information.phone ? el.shipping_information.phone : "N/A";
                                                        if (!state[infoStateName]) {
                                                            return (
                                                                <span onDoubleClick={() => this.setState({ [infoStateName]: true, [textStateName]: phoneValue })} className="cursor-pointer" style={{ marginLeft: 5 }}>
                                                                    {phoneValue}
                                                                    {phoneValue != "N/A" && <span className="fab fa-whatsapp color-green" onClick={() => window.open("https://web.whatsapp.com/send?phone=" + phoneValue, "_blank")} style={{ marginLeft: 10 }} />}
                                                                </span>
                                                            )
                                                        } else {
                                                            return (
                                                                <Mutation
                                                                    mutation={UPDATE_FUNNEL_ORDER_SHIPPING_INFORMATION}
                                                                    variables={{
                                                                        orderIds: JSON.stringify(el.ids),
                                                                        phone: state.updatedPhone,
                                                                        updaterID: currentUser.id,
                                                                        updaterName: currentUser.firstName + " " + currentUser.lastName
                                                                    }} >
                                                                    {(updateMyFunnelOrderShippingInformation, { data, loading, error }) => {
                                                                        return (
                                                                            <input type="text" name={textStateName} value={state[textStateName] ? state[textStateName] : ""} onChange={event => this.handleOnChange(event)} style={{ padding: 2, marginLeft: 5, width: 150 }} onBlur={() => {
                                                                                this.setState({ updatedPhone: state[textStateName] }, () => {
                                                                                    this.updateMyFunnelOrderShippingInformation(updateMyFunnelOrderShippingInformation, refetch);
                                                                                })
                                                                            }} />
                                                                        );
                                                                    }}
                                                                </Mutation>
                                                            )
                                                        }
                                                    })()}
                                                </label>
                                                <label className="display-inline">
                                                    Address:
                                                    {(() => {
                                                        var infoStateName = "con_street1_" + i, textStateName = "street1_" + i;
                                                        var street1Value = el.shipping_information.street1 ? el.shipping_information.street1 : "N/A";
                                                        if (!state[infoStateName]) {
                                                            return <span onDoubleClick={() => this.setState({ [infoStateName]: true, [textStateName]: street1Value })} className="cursor-pointer" style={{ marginLeft: 5 }}>{street1Value}</span>
                                                        } else {
                                                            return (
                                                                <Mutation
                                                                    mutation={UPDATE_FUNNEL_ORDER_SHIPPING_INFORMATION}
                                                                    variables={{
                                                                        orderIds: JSON.stringify(el.ids),
                                                                        street1: state.updatedStreet1,
                                                                        updaterID: currentUser.id,
                                                                        updaterName: currentUser.firstName + " " + currentUser.lastName
                                                                    }} >
                                                                    {(updateMyFunnelOrderShippingInformation, { data, loading, error }) => {
                                                                        return (
                                                                            <input type="text" name={textStateName} value={state[textStateName] ? state[textStateName] : ""} onChange={event => this.handleOnChange(event)} style={{ padding: 2, marginLeft: 5, width: 150 }} onBlur={() => {
                                                                                this.setState({ updatedStreet1: state[textStateName] }, () => {
                                                                                    this.updateMyFunnelOrderShippingInformation(updateMyFunnelOrderShippingInformation, refetch);
                                                                                })
                                                                            }} />
                                                                        );
                                                                    }}
                                                                </Mutation>
                                                            )
                                                        }
                                                    })()}
                                                </label>
                                                {/* <label className="display-inline">
                                                    Address 2:
                                                    {(() => {
                                                        var infoStateName = "con_street2_"+i, textStateName = "street2_"+i;
                                                        var street1Value = el.shipping_information.street2 ? el.shipping_information.street2 : "N/A";
                                                        if(!state[infoStateName]){
                                                            return <span onDoubleClick={() => this.setState({[infoStateName]: true, [textStateName]: street1Value })} className="cursor-pointer" style={{marginLeft: 5}}>{street1Value}</span>
                                                        } else {
                                                            return (
                                                                <Mutation
                                                                mutation={UPDATE_FUNNEL_ORDER_SHIPPING_INFORMATION}
                                                                variables={{
                                                                    orderIds: JSON.stringify(el.ids),
                                                                    street2: state.updatedStreet2,
                                                                    updaterID: currentUser.id,
                                                                    updaterName: currentUser.firstName+" "+currentUser.lastName
                                                                }} >
                                                                {(updateMyFunnelOrderShippingInformation, { data, loading, error }) => {
                                                                    return (
                                                                        <input type="text" name={textStateName} value={state[textStateName] ? state[textStateName] : ""} onChange={event => this.handleOnChange(event)} style={{padding: 2, marginLeft: 5, width: 150}} onBlur={() => {
                                                                            this.setState({ updatedStreet2: state[textStateName] }, () => {
                                                                                this.updateMyFunnelOrderShippingInformation(updateMyFunnelOrderShippingInformation, refetch);
                                                                            })
                                                                        }}/>
                                                                    );
                                                                }}
                                                                </Mutation>
                                                            )
                                                        }
                                                    })()}
                                                </label> */}
                                                <label className="display-inline">
                                                    City:
                                                    {(() => {
                                                        var infoStateName = "con_city_" + i, textStateName = "city_" + i;
                                                        var street1Value = el.shipping_information.city ? el.shipping_information.city : "N/A";
                                                        if (!state[infoStateName]) {
                                                            return <span onDoubleClick={() => this.setState({ [infoStateName]: true, [textStateName]: street1Value })} className="cursor-pointer" style={{ marginLeft: 5 }}>{street1Value}</span>
                                                        } else {
                                                            return (
                                                                <Mutation
                                                                    mutation={UPDATE_FUNNEL_ORDER_SHIPPING_INFORMATION}
                                                                    variables={{
                                                                        orderIds: JSON.stringify(el.ids),
                                                                        city: state.updatedCity,
                                                                        updaterID: currentUser.id,
                                                                        updaterName: currentUser.firstName + " " + currentUser.lastName
                                                                    }} >
                                                                    {(updateMyFunnelOrderShippingInformation, { data, loading, error }) => {
                                                                        return (
                                                                            <input type="text" name={textStateName} value={state[textStateName] ? state[textStateName] : ""} onChange={event => this.handleOnChange(event)} style={{ padding: 2, marginLeft: 5, width: 150 }} onBlur={() => {
                                                                                this.setState({ updatedCity: state[textStateName] }, () => {
                                                                                    this.updateMyFunnelOrderShippingInformation(updateMyFunnelOrderShippingInformation, refetch);
                                                                                })
                                                                            }} />
                                                                        );
                                                                    }}
                                                                </Mutation>
                                                            )
                                                        }
                                                    })()}
                                                </label>
                                                <label className="display-inline">
                                                    State/Region/District:
                                                    {(() => {
                                                        var infoStateName = "con_state_" + i, textStateName = "state_" + i;
                                                        var street1Value = el.shipping_information.state ? el.shipping_information.state : "N/A";
                                                        if (!state[infoStateName]) {
                                                            return <span onDoubleClick={() => this.setState({ [infoStateName]: true, [textStateName]: street1Value })} className="cursor-pointer" style={{ marginLeft: 5 }}>{street1Value}</span>
                                                        } else {
                                                            return (
                                                                <Mutation
                                                                    mutation={UPDATE_FUNNEL_ORDER_SHIPPING_INFORMATION}
                                                                    variables={{
                                                                        orderIds: JSON.stringify(el.ids),
                                                                        state: state.updatedState,
                                                                        updaterID: currentUser.id,
                                                                        updaterName: currentUser.firstName + " " + currentUser.lastName
                                                                    }} >
                                                                    {(updateMyFunnelOrderShippingInformation, { data, loading, error }) => {
                                                                        return (
                                                                            <input type="text" name={textStateName} value={state[textStateName] ? state[textStateName] : ""} onChange={event => this.handleOnChange(event)} style={{ padding: 2, marginLeft: 5, width: 150 }} onBlur={() => {
                                                                                this.setState({ updatedState: state[textStateName] }, () => {
                                                                                    this.updateMyFunnelOrderShippingInformation(updateMyFunnelOrderShippingInformation, refetch);
                                                                                })
                                                                            }} />
                                                                        );
                                                                    }}
                                                                </Mutation>
                                                            )
                                                        }
                                                    })()}
                                                </label>
                                                <label className="display-inline">Country: {el.shipping_information.country}</label>
                                                {!["ARE", "AE", "SAU", "SA", "BH", "BHR"].includes(el.shipping_information.country) &&
                                                    <label className="display-inline">
                                                        Zip:
                                                        {(() => {
                                                            var infoStateName = "con_zip_" + i, textStateName = "zip_" + i;
                                                            var zipValue = el.shipping_information.zip ? el.shipping_information.zip : "N/A";
                                                            if (!state[infoStateName]) {
                                                                return <span onDoubleClick={() => this.setState({ [infoStateName]: true, [textStateName]: zipValue })} className="cursor-pointer" style={{ marginLeft: 5 }}>{zipValue}</span>
                                                            } else {
                                                                return (
                                                                    <Mutation
                                                                        mutation={UPDATE_FUNNEL_ORDER_SHIPPING_INFORMATION}
                                                                        variables={{
                                                                            orderIds: JSON.stringify(el.ids),
                                                                            zip: state.updatedZip,
                                                                            updaterID: currentUser.id,
                                                                            updaterName: currentUser.firstName + " " + currentUser.lastName
                                                                        }} >
                                                                        {(updateMyFunnelOrderShippingInformation, { data, loading, error }) => {
                                                                            return (
                                                                                <input type="text" name={textStateName} value={state[textStateName] ? state[textStateName] : ""} onChange={event => this.handleOnChange(event)} style={{ padding: 2, marginLeft: 5, width: 150 }} onBlur={() => {
                                                                                    this.setState({ updatedZip: state[textStateName] }, () => {
                                                                                        this.updateMyFunnelOrderShippingInformation(updateMyFunnelOrderShippingInformation, refetch);
                                                                                    })
                                                                                }} />
                                                                            );
                                                                        }}
                                                                    </Mutation>
                                                                )
                                                            }
                                                        })()}
                                                    </label>
                                                }
                                                {/* {el.shipping_information.country == "ARE" &&
                                                    <label className="display-inline">
                                                        Address Type:
                                                        {(() => {
                                                            var infoStateName = "con_address_type_"+i, textStateName = "address_type_"+i;
                                                            var addressTypeValue = el.shipping_information.address_type ? el.shipping_information.address_type : "N/A";
                                                            if(!state[infoStateName]){
                                                                return <span onDoubleClick={() => this.setState({[infoStateName]: true, [textStateName]: addressTypeValue })} className="cursor-pointer" style={{marginLeft: 5}}>{addressTypeValue}</span>
                                                            } else {
                                                                return (
                                                                    <Mutation
                                                                    mutation={UPDATE_FUNNEL_ORDER_SHIPPING_INFORMATION}
                                                                    variables={{
                                                                        orderIds: JSON.stringify(el.ids),
                                                                        address_type: state.updatedAddress_type,
                                                                        updaterID: currentUser.id,
                                                                        updaterName: currentUser.firstName+" "+currentUser.lastName
                                                                    }} >
                                                                    {(updateMyFunnelOrderShippingInformation, { data, loading, error }) => {
                                                                        return (
                                                                            <select name={textStateName} value={state[textStateName] ? state[textStateName] : ""} onChange={event => this.handleOnChange(event)} style={{padding: 2, marginLeft: 5, width: 150, borderColor: '#dbe1df', borderRadius: 2}} onBlur={() => {
                                                                                this.setState({ updatedAddress_type: state[textStateName] }, () => {
                                                                                    this.updateMyFunnelOrderShippingInformation(updateMyFunnelOrderShippingInformation, refetch);
                                                                                });
                                                                            }}>
                                                                                <option value="">Select Address Type</option>
                                                                                <option value="residential">Residential</option>
                                                                                <option value="business">Business</option>
                                                                            </select>
                                                                        );
                                                                    }}
                                                                    </Mutation>
                                                                )
                                                            }
                                                        })()}
                                                    </label>
                                                } */}
                                                {["ARE", "AE", "SAU", "SA", "BH", "BHR"].includes(el.shipping_information.country) &&
                                                    <label className="display-inline">
                                                        Apartment / Office:
                                                        {(() => {
                                                            var infoStateName = "con_aptOffice_" + i, textStateName = "aptOffice_" + i;
                                                            var aptOfficeValue = el.shipping_information.aptOffice ? el.shipping_information.aptOffice : "N/A";
                                                            if (!state[infoStateName]) {
                                                                return <span onDoubleClick={() => this.setState({ [infoStateName]: true, [textStateName]: aptOfficeValue })} className="cursor-pointer" style={{ marginLeft: 5 }}>{aptOfficeValue}</span>
                                                            } else {
                                                                return (
                                                                    <Mutation
                                                                        mutation={UPDATE_FUNNEL_ORDER_SHIPPING_INFORMATION}
                                                                        variables={{
                                                                            orderIds: JSON.stringify(el.ids),
                                                                            aptOffice: state.updatedAptOffice,
                                                                            updaterID: currentUser.id,
                                                                            updaterName: currentUser.firstName + " " + currentUser.lastName
                                                                        }} >
                                                                        {(updateMyFunnelOrderShippingInformation, { data, loading, error }) => {
                                                                            return (
                                                                                <input type="text" name={textStateName} value={state[textStateName] ? state[textStateName] : ""} onChange={event => this.handleOnChange(event)} style={{ padding: 2, marginLeft: 5, width: 150 }} onBlur={() => {
                                                                                    this.setState({ updatedAptOffice: state[textStateName] }, () => {
                                                                                        this.updateMyFunnelOrderShippingInformation(updateMyFunnelOrderShippingInformation, refetch);
                                                                                    })
                                                                                }} />
                                                                            );
                                                                        }}
                                                                    </Mutation>
                                                                )
                                                            }
                                                        })()}
                                                    </label>
                                                }
                                                {["ARE", "AE", "SAU", "SA", "BH", "BHR"].includes(el.shipping_information.country) &&
                                                    <label className="display-inline">
                                                        Building / Villa:
                                                        {(() => {
                                                            var infoStateName = "con_bldgVilla_" + i, textStateName = "bldgVilla_" + i;
                                                            var bldgVillaValue = el.shipping_information.bldgVilla ? el.shipping_information.bldgVilla : "N/A";
                                                            if (!state[infoStateName]) {
                                                                return <span onDoubleClick={() => this.setState({ [infoStateName]: true, [textStateName]: bldgVillaValue })} className="cursor-pointer" style={{ marginLeft: 5 }}>{bldgVillaValue}</span>
                                                            } else {
                                                                return (
                                                                    <Mutation
                                                                        mutation={UPDATE_FUNNEL_ORDER_SHIPPING_INFORMATION}
                                                                        variables={{
                                                                            orderIds: JSON.stringify(el.ids),
                                                                            bldgVilla: state.updatedBldgVilla,
                                                                            updaterID: currentUser.id,
                                                                            updaterName: currentUser.firstName + " " + currentUser.lastName
                                                                        }} >
                                                                        {(updateMyFunnelOrderShippingInformation, { data, loading, error }) => {
                                                                            return (
                                                                                <input type="text" name={textStateName} value={state[textStateName] ? state[textStateName] : ""} onChange={event => this.handleOnChange(event)} style={{ padding: 2, marginLeft: 5, width: 150 }} onBlur={() => {
                                                                                    this.setState({ updatedBldgVilla: state[textStateName] }, () => {
                                                                                        this.updateMyFunnelOrderShippingInformation(updateMyFunnelOrderShippingInformation, refetch);
                                                                                    })
                                                                                }} />
                                                                            );
                                                                        }}
                                                                    </Mutation>
                                                                )
                                                            }
                                                        })()}
                                                    </label>
                                                }
                                                {["ARE", "AE", "SAU", "SA"].includes(el.shipping_information.country) &&
                                                    <label className="display-inline">
                                                        Nearest Landmark:
                                                        {(() => {
                                                            var infoStateName = "con_nearestLandmark_" + i, textStateName = "nearestLandmark_" + i;
                                                            var nearestLandmarkValue = el.shipping_information.nearestLandmark ? el.shipping_information.nearestLandmark : "N/A";
                                                            if (!state[infoStateName]) {
                                                                return <span onDoubleClick={() => this.setState({ [infoStateName]: true, [textStateName]: nearestLandmarkValue })} className="cursor-pointer" style={{ marginLeft: 5 }}>{nearestLandmarkValue}</span>
                                                            } else {
                                                                return (
                                                                    <Mutation
                                                                        mutation={UPDATE_FUNNEL_ORDER_SHIPPING_INFORMATION}
                                                                        variables={{
                                                                            orderIds: JSON.stringify(el.ids),
                                                                            nearestLandmark: state.updatedNearestLandmark,
                                                                            updaterID: currentUser.id,
                                                                            updaterName: currentUser.firstName + " " + currentUser.lastName
                                                                        }} >
                                                                        {(updateMyFunnelOrderShippingInformation, { data, loading, error }) => {
                                                                            return (
                                                                                <input type="text" name={textStateName} value={state[textStateName] ? state[textStateName] : ""} onChange={event => this.handleOnChange(event)} style={{ padding: 2, marginLeft: 5, width: 150 }} onBlur={() => {
                                                                                    this.setState({ updatedNearestLandmark: state[textStateName] }, () => {
                                                                                        this.updateMyFunnelOrderShippingInformation(updateMyFunnelOrderShippingInformation, refetch);
                                                                                    })
                                                                                }} />
                                                                            );
                                                                        }}
                                                                    </Mutation>
                                                                )
                                                            }
                                                        })()}
                                                    </label>
                                                }
                                            </div>
                                        </div>
                                        <div className="column column_6_12 row-separator">
                                            <div style={{ border: '1px solid #dfe5eb', backgroundColor: '#f4f9fd', borderRadius: 5 }}>
                                                <div style={{ borderBottom: '1px solid #dfe5eb', padding: 10, position: 'relative', overflow: 'hidden' }}>
                                                    <label>List of Orders</label>
                                                    {el.has_pod && el.design_url != null && <label style={{
                                                        float: "right",
                                                        color: "#1dd1a1",
                                                        cursor: "pointer",
                                                        marginRight: "10rem"
                                                    }} onClick={() => {
                                                        if (el.design_url != "") {
                                                            window.open(el.design_url, '_blank');
                                                        }
                                                    }}>POD {el.design_url != "" ? '' : '( No Design URL Link )'} </label>}
                                                    {el.line_items[0].shopify_order_number &&
                                                        <div className="text-center header-small-light-bold" style={{ position: 'absolute', top: 0, right: -50, backgroundColor: '#2d3740', padding: 5, width: 150, transform: 'rotate(25deg)' }}>
                                                            <label>{el.line_items[0].shopify_order_number}</label>
                                                        </div>
                                                    }
                                                </div>
                                                {el.line_items.map((li, ii) => {
                                                    let doNotFulfill = li.payoutPrice && li.payoutPrice < 0 ? true : false;
                                                    let bgcolor = "#f0f4f7"; // default color
                                                    if (ii % 2 != 0) bgcolor = "#f6fafd"; // every 2 of row
                                                    if (!li.plg_sku) bgcolor = "#f4e3dc"; // if has no plg sku
                                                    if (doNotFulfill) bgcolor = "#d63031"; // if wrong selling price (payout for this line item is less than 0)
                                                    const hasSerialNumber = li.plg_serialNumber && li.plg_serialNumber.length != 0 ? true : false;
                                                    return (
                                                        <div className={"flex-container display-inline" + (doNotFulfill ? " color-white" : "")} style={{ borderBottom: '1px solid #dfe5eb', padding: 10, overflow: 'hidden', backgroundColor: bgcolor }} key={ii}>
                                                            <div className="column column_6_12 display-inline" style={{ padding: 0 }}>
                                                                <div style={{ width: '80%' }}>
                                                                    {(() => {
                                                                        if (li.inventoryName) {
                                                                            return <label className="one-line-ellipsis" style={{ marginBottom: 5, display: 'block' }} title={li.inventoryDescription}>{li.inventoryName} {li.inventoryDescription ? "(" + li.inventoryDescription + ")" : ""} {!li.active && <span className="fas fa-exclamation-triangle color-orange" style={{ marginLeft: 5 }} />}</label>;
                                                                        } else return null;
                                                                    })()}
                                                                    <ButtonWithPopup data={{
                                                                        triggerDOM: <label className="header-medium-bold one-line-ellipsis cursor-pointer">{li.tracking_number ? <span className="fas fa-shipping-fast color-green" onClick={() => {
                                                                            if (el.sync_from == "aramex") {
                                                                                window.open("https://www.aramex.com/us/en/track/results?mode=0&ShipmentNumber=" + li.tracking_number);
                                                                            } else {
                                                                                window.open("https://tracking.productlistgenie.io/tracking_order/" + li.tracking_number);
                                                                            }
                                                                        }} style={{ marginRight: 5 }} /> : ""}{points.capitalizeWord(li.title ? li.title.toLowerCase() : "n/a")}</label>,
                                                                        popupPosition: "top left",
                                                                        text: <div className="color-black text-left">
                                                                            <div className="row-separator display-inline">
                                                                                <label className="header-medium-bold">Name:</label>
                                                                                <label style={{ marginLeft: 5 }}>{points.capitalizeWord(li.title ? li.title.toLowerCase() : "n/a")}</label>
                                                                            </div>
                                                                            <div className="row-separator display-inline">
                                                                                <label className="header-medium-bold">Variant:</label>
                                                                                <label style={{ marginLeft: 5 }}>{points.capitalizeWord(li.variant ? li.variant.toLowerCase() : "n/a")}</label>
                                                                            </div>
                                                                            <div className="display-inline">
                                                                                <label className="header-medium-bold">Tracking Number:</label>
                                                                                <label style={{ marginLeft: 5 }}>{li.tracking_number ? li.tracking_number : "n/a"}</label>
                                                                            </div>
                                                                        </div>,
                                                                        loading: false, padding: 0, checkORtimesButton: false, style: { padding: 15, width: 300, borderRadius: 5 }, onAction: 'hover'
                                                                    }} />
                                                                    <label className={(doNotFulfill ? "color-white" : "color-dark-red") + " header-medium-bold font-small"}>
                                                                        {hasSerialNumber && <span className="fas fa-check color-blue" style={{ marginRight: 5 }} />}
                                                                        Ref: {mongoDBId.encode(el.ids[ii])}
                                                                        <br />
                                                                        {(() => {
                                                                            if (el.paid_cc != null) {
                                                                                if (el.paid_cc) {
                                                                                    return <React.Fragment>
                                                                                        {li.receipt_cc}
                                                                                    </React.Fragment>;
                                                                                }
                                                                            }
                                                                        })()}
                                                                    </label>
                                                                </div>
                                                                <div className="text-right" style={{ width: '19%', marginRight: '1%' }}>
                                                                    {!hasSerialNumber && li.plg_sku && el.order_status == "pickedup" && hasTrackingNumber ?
                                                                        <ButtonWithPopup data={{
                                                                            triggerDOM: <span id={("assign_serial_" + i + "_" + ii)} className="fas fa-qrcode cursor-pointer color-blue" style={{ marginRight: 5 }} />,
                                                                            popupPosition: "top center",
                                                                            text: (
                                                                                <div>
                                                                                    <h4 style={{ fontSize: '1.5em' }}>Assign P.O Serial?</h4>
                                                                                    <div className="column column_6_12">
                                                                                        <Mutation
                                                                                            mutation={ASSIGN_SERIAL_NUMBER_TO_ORDER}
                                                                                            variables={{ id: el.ids[ii], qty: li.quantity, plg_sku: li.plg_sku }} >
                                                                                            {(assignSerialNumberToOrder, { datass, loading, error }) => {
                                                                                                return <button className="btn-success stretch-width" onClick={() => this.assignSerialNumberToOrder(assignSerialNumberToOrder, refetch, "assign_serial_" + i + "_" + ii)} disabled={loading}>Yes</button>
                                                                                            }}
                                                                                        </Mutation>
                                                                                    </div>
                                                                                    <div className="column column_6_12">
                                                                                        <button className="btn-danger stretch-width" onClick={() => document.getElementById("assign_serial_" + i + "_" + ii).click()}>No</button>
                                                                                    </div>
                                                                                </div>
                                                                            ),
                                                                            arrow: true,
                                                                            style: { borderRadius: 3, padding: 10, minWidth: 250, maxWidth: 250 },
                                                                            checkORtimesButton: false
                                                                        }} />
                                                                        : void 0}
                                                                    {isWingFunctionAvailable && !li.tracking_number ?
                                                                        <ButtonWithPopup data={{
                                                                            triggerDOM: <span id={("remove_" + i + "_" + ii)} className="fas fa-times cursor-pointer color-dark-red" style={{ marginRight: 5 }} />,
                                                                            popupPosition: "top center",
                                                                            text: (
                                                                                <div>
                                                                                    <h4 style={{ fontSize: '1.5em' }}>Remove Line Item?</h4>
                                                                                    <div className="column column_6_12">
                                                                                        <Mutation
                                                                                            mutation={DELETE_FUNNEL_ORDER}
                                                                                            variables={{ id: el.ids[ii] }} >
                                                                                            {(deleteFunnelOrder, { datass, loading, error }) => {
                                                                                                return <button className="btn-success stretch-width" onClick={() => this.updateMyFunnelOrders(deleteFunnelOrder, refetch, true)}>Yes</button>
                                                                                            }}
                                                                                        </Mutation>
                                                                                    </div>
                                                                                    <div className="column column_6_12">
                                                                                        <button className="btn-danger stretch-width" onClick={() => document.getElementById("remove_" + i + "_" + ii).click()}>No</button>
                                                                                    </div>
                                                                                </div>
                                                                            ),
                                                                            arrow: true,
                                                                            style: { borderRadius: 3, padding: 10, minWidth: 250, maxWidth: 250 },
                                                                            checkORtimesButton: false
                                                                        }} />
                                                                        : void 0}
                                                                    {/* {(isWingFunctionAvailable && !li.tracking_number) || !li.inventoryName ? */}
                                                                    {doNotFulfill || ((isWingFunctionAvailable || (fulfillerLocation == "PH" || fulfillerLocation == "PHL")) && (!li.tracking_number || !li.inventoryName)) ?
                                                                        <ButtonWithPopup data={{
                                                                            triggerDOM: <span id={("setting_" + i + "_" + ii)} className="fas fa-cog clickable" style={{ marginRight: 5, position: 'relative', zIndex: 5 }} />,
                                                                            popupPosition: "top center",
                                                                            text: (
                                                                                <div className="color-black">
                                                                                    <div className="column column_12_12 row-separator text-left">
                                                                                        <h5>PLG Variant ID & Quantity Settings</h5>
                                                                                    </div>
                                                                                    <div className="column column_12_12 row-separator text-left  display-inline" style={{ position: 'relative' }}>
                                                                                        <div className="column column_4_12" style={{ padding: 0 }}>
                                                                                            <label>Variant ID</label>
                                                                                        </div>
                                                                                        <div className="column column_8_12" style={{ padding: 0 }}>
                                                                                            <input type="text" name="variant_sku" value={state.variant_sku} onChange={event => this.handleOnChange(event)} onFocus={() => this.setState({ showVariant: true })} onBlur={() => {
                                                                                                if (mongoDBId.encode(el.ids[ii]) == state.variant_sku.trim()) {
                                                                                                    this.setState({ variant_sku: "" });
                                                                                                    alert("You enter a ref # instead of variant ID.");
                                                                                                }
                                                                                            }} />
                                                                                            {state.showVariant &&
                                                                                                <Query query={
                                                                                                    GET_FUNNEL_PRODUCTS(`{ id productName productSku }`)
                                                                                                } variables={{ id: state.variant_sku, search: state.variant_sku, limit: 5, page: 1 }}>
                                                                                                    {({ data, loading, refetch, error }) => {
                                                                                                        const style = { position: 'absolute', left: 10, width: 'calc(100% - 20px)', backgroundColor: '#fff', border: '1px solid #dbe1df' };
                                                                                                        if (loading) {
                                                                                                            return (
                                                                                                                <ul className="item-list" style={style}>
                                                                                                                    <li className="text-center">Loading...</li>
                                                                                                                </ul>
                                                                                                            )
                                                                                                        } else if (error) {
                                                                                                            return (
                                                                                                                <ul className="item-list" style={style}>
                                                                                                                    <li className="text-center">An error has occurred.</li>
                                                                                                                </ul>
                                                                                                            )
                                                                                                        } else if (data.getFunnelProducts.length == 0) {
                                                                                                            return (
                                                                                                                <ul className="item-list" style={style}>
                                                                                                                    <li className="text-center">No Result Found.</li>
                                                                                                                </ul>
                                                                                                            )
                                                                                                        } else {
                                                                                                            return (
                                                                                                                <ul className="item-list" style={style}>
                                                                                                                    {data.getFunnelProducts.map((el, i) => {
                                                                                                                        return <li className="one-line-ellipsis" onClick={() => this.setState({ variant_sku: mongoDBId.encode(el.id), showVariant: false })} key={i}>{points.capitalizeWord(el.productName + " - " + el.productSku)}</li>;
                                                                                                                    })}
                                                                                                                </ul>
                                                                                                            );
                                                                                                        }
                                                                                                    }}
                                                                                                </Query>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="column column_12_12 row-separator display-inline">
                                                                                        <div className="column column_4_12 text-left" style={{ padding: 0 }}>
                                                                                            <label>Quantity</label>
                                                                                        </div>
                                                                                        <div className="column column_8_12" style={{ padding: 0 }}>
                                                                                            <div className="number-counter float-right">
                                                                                                <span className="decrement fas fa-minus" onClick={() => this.setState({ variant_qty: (state.variant_qty != 1 ? state.variant_qty - 1 : state.variant_qty) })} />
                                                                                                <input type="text" value={state.variant_qty} disabled />
                                                                                                <span className="increment fas fa-plus" onClick={() => this.setState({ variant_qty: state.variant_qty + 1 })} />
                                                                                            </div>
                                                                                        </div>
                                                                                        <span className="clear" />
                                                                                    </div>
                                                                                    <div className="column column_12_12 row-separator text-left display-inline">
                                                                                        <div className="column column_4_12" style={{ padding: 0 }}>
                                                                                            <label>Local Price</label>
                                                                                        </div>
                                                                                        <div className="column column_8_12" style={{ padding: 0 }}>
                                                                                            <input type="number" name="variant_price" value={state.variant_price} onChange={event => this.handleOnChange(event)} />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="column column_12_12 row-separator text-left">
                                                                                        <input id={("onlythis_" + i + "_" + ii)} type="checkbox" checked={state.updateOnlyThisLineItem} onClick={event => this.setState({ updateOnlyThisLineItem: event.target.checked })} style={{ width: 'fit-content' }} />
                                                                                        <label className="cursor-pointer" htmlFor={("onlythis_" + i + "_" + ii)}>Update only this line item</label>
                                                                                    </div>
                                                                                    <div className="column column_6_12">
                                                                                        <Mutation
                                                                                            mutation={UPDATE_FUNNEL_ORDERS}
                                                                                            variables={{
                                                                                                id: el.creator,
                                                                                                orderCreator: el.orderCreator,
                                                                                                orderEmail: el.shipping_information.email,
                                                                                                productID: el.ids[ii], // for variant sku, quantity and price
                                                                                                variantSku: state.variant_sku, // for variant sku, quantity and price
                                                                                                variantQty: state.variant_qty, // for variant sku, quantity and price
                                                                                                variantPrice: parseFloat(state.variant_price), // for variant sku, quantity and price
                                                                                                variantTitle: li.title, // for variant sku, quantity and price
                                                                                                variantName: li.variant, // for variant sku, quantity and price
                                                                                                fulfillerLocation: fulfillerLocation, // to update all order in this country
                                                                                                sendPLGTrackingEmail: false,
                                                                                                updaterID: currentUser.id,
                                                                                                updaterName: currentUser.firstName + " " + currentUser.lastName,
                                                                                                onlyUpdateThisLineItem: state.updateOnlyThisLineItem,
                                                                                                newVariantName: state.updateOnlyThisLineItem ? li.variant.replace(/\s\(modified\)/g, "") + " (modified)" : "" // if update only this line item is check
                                                                                            }} >
                                                                                            {(updateMyFunnelOrders, { datass, loading, error }) => {
                                                                                                return <button className="btn-success stretch-width" onClick={() => {
                                                                                                    document.getElementById("setting_" + i + "_" + ii).click();
                                                                                                    this.updateMyFunnelOrders(updateMyFunnelOrders, refetch, true);
                                                                                                }}>Save</button>;
                                                                                            }}
                                                                                        </Mutation>
                                                                                    </div>
                                                                                    <div className="column column_6_12">
                                                                                        <button className="btn-warning stretch-width" onClick={() => document.getElementById("setting_" + i + "_" + ii).click()}>Cancel</button>
                                                                                    </div>
                                                                                    <span className="clear" />
                                                                                </div>
                                                                            ),
                                                                            onOpen: () => this.setState({ variant_sku: li.plg_sku ? li.plg_sku : "", variant_qty: li.quantity, variant_price: li.price, updateOnlyThisLineItem: doNotFulfill }),
                                                                            onClose: () => this.setState({ variant_sku: "", variant_qty: 1, variant_price: 0, updateOnlyThisLineItem: false, showVariant: false }),
                                                                            loading: false,
                                                                            padding: 0,
                                                                            arrow: true,
                                                                            style: { padding: 15, width: 320, borderRadius: 5 },
                                                                            checkORtimesButton: false
                                                                        }} />
                                                                        : void 0}
                                                                    <ApolloConsumer>
                                                                        {client => {
                                                                            return <span className="fas fa-share-square cursor-pointer clickable" style={{ marginRight: 5 }} onClick={() => this.searchOrderLink(client, el.ids[ii], el.source_link)} />;
                                                                        }}
                                                                    </ApolloConsumer>
                                                                </div>
                                                            </div>
                                                            <div className="column column_6_12 display-inline" style={{ padding: 5, backgroundColor: '#2d3740', borderRadius: 3 }}>
                                                                <div className="float-left" style={{ width: '40%', paddingRight: 5 }}>
                                                                    <label className="header-small-light-bold">Quantity: {li.quantity}</label>
                                                                </div>
                                                                <div className="float-left" style={{ width: '30%', padding: '3px 0', border: '1px solid #464f57', borderRadius: 3, textAlign: 'center', opacity: !el.currencyWord || el.currencyWord == "USD" ? 0 : 1 }}>
                                                                    <label className="one-line-ellipsis" style={{ color: '#ef8805', fontFamily: "'Roboto', sans-serif" }}>{el.currencySymbol ? el.currencySymbol : "$"}{li.price ? points.commafy(li.price.toFixed(2)) : "N/A"}</label>
                                                                </div>
                                                                <ButtonWithPopup data={{
                                                                    triggerDOM: <div className="float-left cursor-pointer" style={{ width: '30%', padding: '3px 0', border: '1px solid #464f57', borderRadius: 3, textAlign: 'center' }}>
                                                                        <label className="one-line-ellipsis" style={{ color: '#ef8805', fontFamily: "'Roboto', sans-serif" }}>${points.commafy(li.convertedPrice.toFixed(2))}</label>
                                                                    </div>,
                                                                    popupPosition: "top center",
                                                                    text: <label className="font-roboto-light"> Estimated converted price to USD </label>,
                                                                    checkORtimesButton: false,
                                                                    onAction: 'hover',
                                                                    style: { minWidth: 'fit-content', borderRadius: 3 },
                                                                    padding: 10
                                                                }} />
                                                                <span className="clear" />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="column column_3_12 row-separator">
                                            <div className="row-separator display-inline">
                                                <div className="float-left" style={{ width: '50%' }}>
                                                    {el.order_status == "fulfilled" || el.order_status == "pending" ?
                                                        <span className="color-dark-red">Please update</span>
                                                        : void 0}
                                                    <label className="header-small-light-bold one-line-ellipsis">Order Status</label>
                                                </div>
                                                <Mutation
                                                    mutation={UPDATE_FUNNEL_ORDERS}
                                                    variables={{
                                                        id: el.creator,
                                                        orderCreator: el.orderCreator,
                                                        orderEmail: el.shipping_information.email,
                                                        cancel_note: state.cancel_note ? state.cancel_note : el.cancel_note,
                                                        order_status: state.order_status,
                                                        sendPLGTrackingEmail: false,
                                                        updaterID: currentUser.id,
                                                        updaterName: currentUser.firstName + " " + currentUser.lastName
                                                    }} >
                                                    {(updateMyFunnelOrders, { datass, loading, error }) => {
                                                        var orStatus = el.order_status == "pending" ? "hold" : el.order_status;
                                                        if (orStatus == "unpaid") orStatus = "unfulfilled";
                                                        var options = [];
                                                        points.list_of_order_status.forEach((status, i) => {
                                                            if (i != 0) options.push(<option value={status.value} key={i}>{status.label}</option>);
                                                        });
                                                        if (loading) return null;
                                                        if (el.order_status == "cancelled" || el.order_status == "delivered" || el.order_status == "paid") {
                                                            return (
                                                                <div className="custom-select" style={{ width: '50%' }} onClick={() => points.toastrPrompt(toastr, "warning", "You cannot change the status of " + el.order_status + ".")}>
                                                                    <div className="select-selected stretch-width">{points.capitalizeWord(el.order_status)}</div>
                                                                </div>
                                                            );
                                                        } else {
                                                            return <SelectTag name={"f_status" + i} value={orStatus} options={options} onChange={event => this.setState({ order_status: event.target.value }, () => this.updateMyFunnelOrders(updateMyFunnelOrders, refetch, true))} style={{ width: '50%' }} />;
                                                        }
                                                    }}
                                                </Mutation>
                                                <span className="clear" />
                                            </div>
                                            {el.order_status == "delivered" &&
                                                <div className="row-separator display-inline">
                                                    <div className="float-left" style={{ width: '50%' }}>
                                                        <label className="header-small-light-bold one-line-ellipsis">Delivery Date</label>
                                                    </div>
                                                    <div className="float-left" style={{ width: '50%' }}>
                                                        <Mutation
                                                            mutation={UPDATE_FUNNEL_ORDERS}
                                                            variables={{
                                                                id: el.creator,
                                                                orderCreator: el.orderCreator,
                                                                orderEmail: el.shipping_information.email,
                                                                sendPLGTrackingEmail: false,
                                                                updaterID: currentUser.id,
                                                                updaterName: currentUser.firstName + " " + currentUser.lastName,
                                                                dateStatusDelivered: state.deliveredDate
                                                            }} >
                                                            {(updateMyFunnelOrders, { data, loading, error }) => {
                                                                if (el.dateStatusDelivered) {
                                                                    return <input type="date" value={new Date(new Date(parseInt(el.dateStatusDelivered)).setUTCHours(0)).toISOString().split('T')[0]} onChange={event => {
                                                                        this.setState({ deliveredDate: event.target.value }, () => {
                                                                            this.updateMyFunnelOrders(updateMyFunnelOrders, refetch, true)
                                                                        })
                                                                    }} disabled={loading} />
                                                                } else {
                                                                    return <input type="date" onChange={event => {
                                                                        this.setState({ deliveredDate: event.target.value }, () => {
                                                                            this.updateMyFunnelOrders(updateMyFunnelOrders, refetch, true)
                                                                        })
                                                                    }} disabled={loading} />
                                                                }
                                                            }}
                                                        </Mutation>
                                                    </div>
                                                    <span className="clear" />
                                                </div>
                                            }
                                            <div className="row-separator display-inline">
                                                <div className="float-left" style={{ width: '50%' }}>
                                                    <label className="header-small-light-bold one-line-ellipsis">Order Note</label>
                                                </div>
                                                {(() => {
                                                    var stateName = "cancel_note_" + i;
                                                    var btnStateName = "show_button_" + i;
                                                    return (
                                                        <div className="float-left" style={{ width: '50%', position: 'relative' }}>
                                                            <textarea className="stretch-width" name={stateName} rows="4" value={state[stateName]} onChange={event => this.setState({ [stateName]: event.target.value, cancel_note: event.target.value })} onFocus={() => this.setState({ [btnStateName]: true, [stateName]: el.cancel_note ? el.cancel_note : "" })} onBlur={() => {
                                                                var that = this;
                                                                setTimeout(function () {
                                                                    that.setState({ [btnStateName]: false, [stateName]: "" })
                                                                }, 1000);
                                                            }} placeholder={el.cancel_note ? el.cancel_note : "Please add a note before setting order status (if needed)"} />
                                                            {state[btnStateName] &&
                                                                <Mutation
                                                                    mutation={UPDATE_FUNNEL_ORDERS}
                                                                    variables={{
                                                                        id: el.creator,
                                                                        orderCreator: el.orderCreator,
                                                                        orderEmail: el.shipping_information.email,
                                                                        cancel_note: state.cancel_note,
                                                                        order_status: el.order_status,
                                                                        sendPLGTrackingEmail: false,
                                                                        updaterID: currentUser.id,
                                                                        updaterName: currentUser.firstName + " " + currentUser.lastName
                                                                    }} >
                                                                    {(updateMyFunnelOrders, { data, loading, error }) => {
                                                                        return <button className="btn-success fas fa-save" onClick={() => this.updateMyFunnelOrders(updateMyFunnelOrders, refetch, true)} style={{ borderRadius: '50%', position: 'absolute', bottom: 7, right: 7, padding: '5px 7px' }} disabled={loading} />;
                                                                    }}
                                                                </Mutation>
                                                            }
                                                        </div>
                                                    );
                                                })()}
                                                <span className="clear" />
                                            </div>
                                        </div>
                                        <div className="column column_12_12 display-inline flex-container" style={{ padding: 15, backgroundColor: '#2d3740', borderRadius: 3 }}>
                                            <div className={"column " + (el.order_status_update ? "column_3_12" : "column_6_12") + " display-inline"} style={{ margin: '2px 0' }}>
                                                <div style={{ backgroundColor: '#21272d', borderRadius: '50%', width: 35, padding: '6px 9px', marginRight: 15, position: 'relative' }}>
                                                    {currentUser.access_tags.includes('god') &&
                                                        <Tooltip trigger={<div className="cursor-pointer stretch-width-and-height" />} position="top left">
                                                            <label>
                                                                <span className="header-medium-bold">Last Updated By:</span> {el.updateByName}
                                                            </label>
                                                        </Tooltip>
                                                    }
                                                    <img src="assets/graphics/purchase-shopping-bag.png" width="100%" />
                                                </div>
                                                <div>
                                                    <label className="header-small-light-bold">Purchased Date</label>
                                                    <label className="color-white">{moment(new Date(parseInt(el.order_date))).local().format("MMMM DD, YYYY. ddd, h:mm:ss A")}</label>
                                                </div>
                                            </div>
                                            {(() => {
                                                if (el.order_status_update) {
                                                    const isDelivered = el.order_status == "delivered" || el.order_status == "paid",
                                                        label = isDelivered ? "Delivered Date" : "Last Update",
                                                        date = isDelivered ? el.dateStatusDelivered : el.order_status_update;
                                                    return (
                                                        <div className="column column_3_12" style={{ margin: '2px 0' }}>
                                                            <label className="header-small-light-bold">{label}</label>
                                                            <label className="color-white">{moment(new Date(parseInt(date))).local().format("MMMM DD, YYYY. ddd, h:mm:ss A")}</label>
                                                        </div>
                                                    );
                                                } else return null;
                                            })()}
                                            <div className="column column_6_12">
                                                {el.order_status == "delivered" || el.order_status == "paid" ?
                                                    <div className="column column_4_12" style={{ marginTop: 10 }}>
                                                        <Mutation
                                                            mutation={UPDATE_FUNNEL_ORDER_SHIPPING_INFORMATION}
                                                            variables={{
                                                                orderIds: JSON.stringify(el.ids),
                                                                received_payment_from_courier: !received_payment_from_courier,
                                                                updaterID: currentUser.id,
                                                                updaterName: currentUser.firstName + " " + currentUser.lastName
                                                            }} >
                                                            {(updateMyFunnelOrderShippingInformation, { data, loading, error }) => {
                                                                const checkboxStateName = i + "_checkbox_" + new Date(parseInt(el.order_date)).getTime();
                                                                return (
                                                                    <Checkbox
                                                                        id={checkboxStateName}
                                                                        label="Mark as collected"
                                                                        labelClassName="header-small-light-bold"
                                                                        labelStyle={{ display: 'unset' }}
                                                                        tooltip="Collected from the courier"
                                                                        checked={received_payment_from_courier}
                                                                        disabled={loading}
                                                                        onChange={value => {
                                                                            points.executeMutation(updateMyFunnelOrderShippingInformation, toastr, () => {
                                                                                refetch();
                                                                                toastr.options.timeOut = 3000;
                                                                                toastr.options.extendedTimeOut = 2000;
                                                                                toastr.success("The order has been marked as " + (value ? "paid" : "unpaid") + " by courier.", "Success");
                                                                            })
                                                                        }}
                                                                    />
                                                                );
                                                            }}
                                                        </Mutation>
                                                    </div>
                                                    :
                                                    <div className="column column_4_12" style={{ marginTop: 10 }}>&nbsp;</div>
                                                }
                                                <div className="column column_4_12" style={{ marginTop: 10 }}>
                                                    {isWingFunctionAvailable &&
                                                        <Mutation
                                                            mutation={UPDATE_FUNNEL_ORDERS}
                                                            variables={{
                                                                id: el.creator,
                                                                merchant_type: el.merchant_type,
                                                                orderCreator: el.orderCreator,
                                                                orderEmail: el.shipping_information.email,
                                                                sync_from: hasTrackingNumber ? sync_from : state.sync_from,
                                                                safeArrivalID: "" + state.sync_response_safeArrivalID + "",
                                                                tracking_number: hasTrackingNumber ? JSON.stringify(el.line_items.map((li, ii) => { return { id: el.ids[ii], tracking: li.tracking_number } })) : state.sync_response_tracking_number,
                                                                domains: JSON.stringify(creator_data.funnel_genie_domains),
                                                                sendPLGTrackingEmail: true,
                                                                country: fulfillerLocation
                                                            }} >
                                                            {(updateMyFunnelOrders, { data, loading, error }) => {
                                                                if (sync_from && hasTrackingNumber) { // resync order
                                                                    return (
                                                                        <ButtonWithPopup data={{
                                                                            triggerDOM: (
                                                                                <button id={("sync_" + i)} className="color-white stretch-width font-small resync-order" style={{ border: '1px solid #ffffff1f' }} disabled={loading}>
                                                                                    <span>Resync to {sync_from.toUpperCase()}</span>
                                                                                </button>
                                                                            ),
                                                                            popupPosition: "top center",
                                                                            text: <h3 style={{ margin: 10 }}>Are you sure?</h3>,
                                                                            loading: loading,
                                                                            padding: 0,
                                                                            arrow: true,
                                                                            triggerID: "sync_" + i,
                                                                            action: () => this.updateMyFunnelOrders(updateMyFunnelOrders, refetch, true), // true to bypass no tracking number length from state
                                                                            style: { maxWidth: 220, minWidth: 220, borderRadius: 5 }
                                                                        }} />
                                                                    );
                                                                } else if (!hasTrackingNumber) { // sync order
                                                                    return (
                                                                        <ButtonWithPopup data={{
                                                                            triggerDOM: (
                                                                                <button id={("sync_" + i)} className="color-white stretch-width font-small" style={{ border: '1px solid #ffffff1f' }} disabled={loading}>
                                                                                    <span>Sync to</span>
                                                                                </button>
                                                                            ),
                                                                            popupPosition: "top center",
                                                                            text: (
                                                                                <ul className="item-list">
                                                                                    {points.courier_available_location("safearrival", el.shipping_information.country, el.shipping_information.city) &&
                                                                                        <li onClick={() => {
                                                                                            document.getElementById("sync_" + i).click();
                                                                                            this.syncOrderToSafeArrival(el, fulfillerLocation, refetch, updateMyFunnelOrders);
                                                                                        }}>Safe Arrival</li>
                                                                                    }
                                                                                    {points.courier_available_location("safearrival", el.shipping_information.country, el.shipping_information.city) &&
                                                                                        <li onClick={() => {
                                                                                            document.getElementById("sync_" + i).click();
                                                                                            this.syncOrderToSafeArrival(el, fulfillerLocation, refetch, updateMyFunnelOrders, true);
                                                                                        }}>Safe Arrival V2</li>
                                                                                    }
                                                                                    {points.courier_available_location("taqadum", el.shipping_information.country, el.shipping_information.city) &&
                                                                                        <li onClick={() => {
                                                                                            document.getElementById("sync_" + i).click();
                                                                                            this.setState({ sync_from: "taqadum" }, () => {
                                                                                                this.syncOrderToSafeArrival(el, fulfillerLocation, refetch, updateMyFunnelOrders, true, true);
                                                                                            });
                                                                                        }}>Taqadum</li>
                                                                                    }
                                                                                    {points.courier_available_location("wimo", el.shipping_information.country, el.shipping_information.city) &&
                                                                                        <ButtonWithPopup data={{
                                                                                            triggerDOM: <li>Wimo</li>,
                                                                                            popupPosition: "left center",
                                                                                            text: (
                                                                                                <ul className="item-list">
                                                                                                    <li onClick={() => {
                                                                                                        if (fulfillerLocation == "SA" || fulfillerLocation == "SAU") {
                                                                                                            if (el.line_items.filter(el => el.productCost).length != 0) {
                                                                                                                document.getElementById("sync_" + i).click();
                                                                                                                this.syncOrderToWimo(el, 'ARE', fulfillerLocation, refetch, updateMyFunnelOrders);
                                                                                                            } else { // no plg sku
                                                                                                                points.toastrPrompt(toastr, "warning", "Please set the variant id of this order.");
                                                                                                            }
                                                                                                        } else {
                                                                                                            points.toastrPrompt(toastr, "warning", "Only Available in Saudi.");
                                                                                                        }
                                                                                                    }}>United Arab Emirates</li>
                                                                                                    <li onClick={() => {
                                                                                                        if (fulfillerLocation == "SA" || fulfillerLocation == "SAU") {
                                                                                                            if (el.line_items.filter(el => el.productCost).length != 0) {
                                                                                                                document.getElementById("sync_" + i).click();
                                                                                                                this.syncOrderToWimo(el, 'SAU', fulfillerLocation, refetch, updateMyFunnelOrders);
                                                                                                            } else { // no plg sku
                                                                                                                points.toastrPrompt(toastr, "warning", "Please set the variant id of this order.");
                                                                                                            }
                                                                                                        } else {
                                                                                                            points.toastrPrompt(toastr, "warning", "Only Available in Saudi.");
                                                                                                        }
                                                                                                    }}>Saudi Arabia</li>
                                                                                                </ul>
                                                                                            ),
                                                                                            padding: 0,
                                                                                            arrow: true,
                                                                                            checkORtimesButton: false,
                                                                                            style: { maxWidth: 170, minWidth: 170, borderRadius: 5 }
                                                                                        }} />
                                                                                    }
                                                                                    {points.courier_available_location("fetchr", el.shipping_information.country, el.shipping_information.city) &&
                                                                                        <li onClick={() => {
                                                                                            document.getElementById("sync_" + i).click();
                                                                                            this.syncOrderToFetchr(el, fulfillerLocation, refetch, updateMyFunnelOrders);
                                                                                        }}>Fetchr</li>
                                                                                    }
                                                                                </ul>
                                                                            ),
                                                                            loading: loading,
                                                                            padding: 0,
                                                                            arrow: true,
                                                                            triggerID: "sync_" + i,
                                                                            checkORtimesButton: false,
                                                                            action: null,
                                                                            style: { maxWidth: 220, minWidth: 220, borderRadius: 5 }
                                                                        }} />
                                                                    );
                                                                } else return null;
                                                            }}
                                                        </Mutation>
                                                    }
                                                </div>
                                                <div className="column column_4_12" style={{ marginTop: 10 }}>
                                                    <ButtonWithPopup data={{
                                                        triggerID: "tracking_" + i,
                                                        triggerDOM: <button id={"tracking_" + i} className="color-white stretch-width font-small" style={{ border: '1px solid #ffffff1f' }}>{hasTrackingNumber ? "EDIT" : "ADD"} TRACKING NO.</button>,
                                                        popupPosition: "top right",
                                                        text: <div className="text-left">
                                                            <label className="header-medium-bold one-line-ellipsis">Enter Tracking Number Each Line Item.</label>
                                                            {el.line_items.map((li, li_i) => {
                                                                return (
                                                                    <div className="column column_12_12 display-inline row-separator" key={li_i} style={{ margin: '5px 0' }}>
                                                                        <div className="column column_4_12 one-line-ellipsis" style={{ padding: 0 }}>
                                                                            <label title={li.title}>{li.title}</label>
                                                                        </div>
                                                                        <div className="column column_8_12" style={{ padding: 0 }}>
                                                                            <input type="text" value={state.trackingnumber[li_i] ? state.trackingnumber[li_i].tracking : li.tracking_number || ""} onChange={event => {
                                                                                var trackings = [];
                                                                                for (var x = 0; x < el.line_items.length; x++) {
                                                                                    trackings.push({ id: el.ids[x], tracking: event.target.value.replace(/\s/g, "") });
                                                                                }
                                                                                this.setState({ trackingnumber: trackings.filter(el => el.tracking) });
                                                                            }} />
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                            <div className="column column_12_12 row-separator">
                                                                {(() => {
                                                                    var courier_list = [<option value="" key={0}>Select Courier</option>];
                                                                    points.cod_available_courier.forEach((courier, i) => {
                                                                        courier_list.push(<option value={courier.value} key={i + 1}>{courier.label}</option>);
                                                                    });
                                                                    return <SelectTag name="tracking_courier" value={state.tracking_courier} options={courier_list} onChange={event => this.setState({ tracking_courier: event.target.value })} />;
                                                                })()}
                                                            </div>
                                                            <div className="column column_12_12">
                                                                <Checkbox
                                                                    id={"send_email_" + i}
                                                                    label="Send Tracking Email (PLG)"
                                                                    labelClassName="header-medium-bold font-small"
                                                                    containerClassName="display-inline"
                                                                    checked={state.sendPLGTrackingEmail}
                                                                    onChange={value => this.setState({ sendPLGTrackingEmail: value })}
                                                                />
                                                            </div>
                                                            <div className="clear" />
                                                            <Mutation
                                                                mutation={UPDATE_FUNNEL_ORDERS}
                                                                variables={{
                                                                    id: el.creator,
                                                                    merchant_type: el.merchant_type,
                                                                    orderCreator: el.orderCreator,
                                                                    orderEmail: el.shipping_information.email,
                                                                    tracking_number: JSON.stringify(state.trackingnumber),
                                                                    domains: JSON.stringify(creator_data.funnel_genie_domains),
                                                                    sendPLGTrackingEmail: state.sendPLGTrackingEmail,
                                                                    country: fulfillerLocation,
                                                                    sync_from: state.tracking_courier
                                                                }} >
                                                                {(updateMyFunnelOrders, { datass, loading, error }) => {
                                                                    return <button className="btn-success stretch-width" style={{ marginTop: 10 }} onClick={() => this.updateMyFunnelOrders(updateMyFunnelOrders, refetch, false, "tracking_" + i)} disabled={loading}>SAVE</button>;
                                                                }}
                                                            </Mutation>
                                                        </div>,
                                                        loading: false,
                                                        padding: 5,
                                                        checkORtimesButton: false,
                                                        style: { padding: 10, width: 320 },
                                                        onOpen: () => this.setState({ tracking_courier: el.sync_from || "" }),
                                                        onClose: () => this.setState({ trackingnumber: [], tracking_courier: "" })
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="clear" />
                                    </div>
                                );
                            });
                        }}
                    </Query>
                </div>

                {state.returning &&
                    <Modal open={state.returning} closeModal={() => this.setState({ ...initialize_returning_item })} session={this.props.session} style={{ borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0, width: '30%' }}>
                        <div className="column_12_12">
                            <style dangerouslySetInnerHTML={{ __html: `.popup-content .content {padding: 0px;}` }} />
                            <div className="modal-header row-separator">
                                <h4 className="header">Manage Returning Item</h4>
                            </div>
                            <div className="page-container" style={{ margin: 10 }}>
                                <div className="filter-container">
                                    <div style={{ position: 'absolute', left: 10 }}>
                                        <ToggleSwitch value={state.toggle_v2} width={40} height={20} onChange={value => this.setState({ toggle_v2: value, returning_current_page: 1 }, () => {
                                            if (state.toggle_v2) this.refetchReturningV2();
                                            else this.refetchReturning();
                                        })} />
                                    </div>
                                    {state.toggle_v2 ?
                                        <SearchField
                                            name="returning_search_value"
                                            value={state.returning_search_value}
                                            placeHolder="Search Cancelled Order"
                                            tooltip="Search by name, email, tracking number, product name, serial number"
                                            width={170}
                                            containerClassName="stretch-to-mobile font-small"
                                            containerStyle={{ margin: '0 5px' }}
                                            inputStyle={{ padding: '3px 7px' }}
                                            onSubmit={value => this.setState({ returning_search: value, returning_search_value: value })}
                                        />
                                        :
                                        <ButtonWithPopup data={{
                                            triggerDOM: <button id="mark-this-page" className="btn-success font-small stretch-to-mobile" style={{ padding: '2px 10px', marginRight: 10 }}>Mark this page as returned</button>,
                                            popupPosition: "bottom center",
                                            text: <h3 style={{ margin: 10 }}>Are you sure?</h3>,
                                            padding: 0,
                                            arrow: true,
                                            triggerID: 'mark-this-page',
                                            action: () => {
                                                document.querySelectorAll(".package-returned").forEach(el => {
                                                    el.click();
                                                    setTimeout(function () {
                                                        if (el.nextElementSibling.nextElementSibling.nextElementSibling.querySelector("button")) {
                                                            el.nextElementSibling.nextElementSibling.nextElementSibling.querySelector("button").click();
                                                        }
                                                    }, 500);
                                                });
                                            },
                                            style: { maxWidth: 220, minWidth: 220, borderRadius: 5 }
                                        }} />
                                    }
                                    <Pagination totalPage={state.returning_total || 1} displayPageCount={state.returning_show_per_page} currentPage={state.returning_current_page} action={result => this.setState({ returning_current_page: result })} />
                                </div>
                                {state.toggle_v2 ?
                                    <Query query={
                                        GET_FUNNEL_ORDERS(`{ order_date order_status_update count order_status currencySymbol cancel_note currencyWord shipping_information { name email phone street1 street2 city state zip address_type aptOffice bldgVilla nearestLandmark country } line_items { active inventoryName title variant price convertedPrice quantity plg_sku plg_serialNumber tracking_number } }`)
                                    }
                                        variables={{
                                            id: state.selectedUserID,
                                            fulfillerLocation: "ALL",
                                            merchant_type: "cod",
                                            order_status: "cancelled",
                                            orderid: state.returning_search,
                                            skip: state.returning_current_page - 1,
                                            returning_items: true,
                                            cod_analytics: true
                                        }}
                                        notifyOnNetworkStatusChange={true}
                                        onCompleted={data => {
                                            var total = 0;
                                            if (data && data.getMyFunnelOrders.length != 0 && data.getMyFunnelOrders[0].count != 0) total = data.getMyFunnelOrders[0].count;
                                            this.setState({ returning_total: total })
                                        }}>
                                        {({ data, loading, refetch, error }) => {
                                            this.refetchReturningV2 = refetch;
                                            if (loading) return <Loading width={100} height={100} />;
                                            if (error || (data.getMyFunnelOrders && data.getMyFunnelOrders.length == 0)) return <div className="product-card product-details text-center"><label>No Data to display</label></div>;
                                            return data.getMyFunnelOrders.map((order, index) => {
                                                const tkn = order.line_items[0].tracking_number;
                                                return (
                                                    <div className="product-card font-small" key={index}>
                                                        <div className="product-details">
                                                            <div className="column column_7_12 ellipsis">
                                                                <div className="row-separator">
                                                                    <label className="header-small-light-bold">Shipping Information</label>
                                                                </div>
                                                                <div>
                                                                    <label className="clickable" onClick={() => tkn ? window.open("https://tracking.productlistgenie.io/tracking_order/" + tkn, "_blank") : void 0}>TN: {tkn ? tkn : "N/A"}</label>
                                                                    <label className="header-medium-bold">{order.shipping_information.name}</label>
                                                                    <label style={{ color: '#ef8805', fontFamily: "'Roboto', sans-serif" }}>{order.shipping_information.email}</label>
                                                                </div>
                                                                <div>
                                                                    <label style={{ display: 'block' }}>Phone: {order.shipping_information.phone ? order.shipping_information.phone : "N/A"}</label>
                                                                    <label style={{ display: 'block' }}>Address: {order.shipping_information.street1 ? order.shipping_information.street1 : "N/A"}</label>
                                                                    <label style={{ display: 'block' }}>City: {order.shipping_information.city ? order.shipping_information.city : "N/A"}</label>
                                                                    <label style={{ display: 'block' }}>State/Region/District: {order.shipping_information.state ? order.shipping_information.state : "N/A"}</label>
                                                                    {order.shipping_information.country != "ARE" && order.shipping_information.country != "SAU" ?
                                                                        <label style={{ display: 'block' }}>Zip: {order.shipping_information.zip ? order.shipping_information.zip : "N/A"}</label>
                                                                        : void 0}
                                                                    {order.shipping_information.country == "ARE" &&
                                                                        <label style={{ display: 'block' }}>Address Type: {order.shipping_information.address_type ? order.shipping_information.address_type : "N/A"}</label>
                                                                    }
                                                                    {order.shipping_information.country == "ARE" &&
                                                                        <label style={{ display: 'block' }}>Apartment/Office: {order.shipping_information.aptOffice ? order.shipping_information.aptOffice : "N/A"}</label>
                                                                    }
                                                                    {order.shipping_information.country == "ARE" || order.shipping_information.country == "SAU" ?
                                                                        <label style={{ display: 'block' }}>Building/Villa: {order.shipping_information.bldgVilla ? order.shipping_information.bldgVilla : "N/A"}</label>
                                                                        : void 0}
                                                                    {order.shipping_information.country == "ARE" || order.shipping_information.country == "SAU" ?
                                                                        <label style={{ display: 'block' }}>Nearest Landmark: {order.shipping_information.nearestLandmark ? order.shipping_information.nearestLandmark : "N/A"}</label>
                                                                        : void 0}
                                                                </div>
                                                            </div>
                                                            <div className="column column_5_12">
                                                                <div className="row-separator">
                                                                    <label className="header-small-light-bold">Line Items</label>
                                                                    <ul className="item-list-normal row-separator">
                                                                        {order.line_items.map((li, li_index) => {
                                                                            return (
                                                                                <li className="display-inline" key={li_index}>
                                                                                    <label className="header-medium-bold" style={{ marginRight: 5 }}>{li.quantity}x</label>
                                                                                    {li.inventoryName}
                                                                                </li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                    <Mutation mutation={CHANGE_ITEM_STATUS} variables={{ id: order.line_items.map(el => el.plg_serialNumber).toString(), status: 'warehouse' }}>
                                                                        {(changeItemStatus, { data, loading, error }) => {
                                                                            return (
                                                                                <ButtonWithPopup data={{
                                                                                    triggerID: "item_" + index,
                                                                                    triggerDOM: <button id={"item_" + index} className="btn-success stretch-width row-separator" style={{ padding: 5 }} disabled={loading}>Package Returned</button>,
                                                                                    popupPosition: "top center",
                                                                                    text: <h3 style={{ margin: 10 }}>Are you sure?</h3>,
                                                                                    padding: 0,
                                                                                    arrow: true,
                                                                                    action: () => this.changeItemStatus(changeItemStatus, refetch),
                                                                                    style: { maxWidth: 220, minWidth: 220, borderRadius: 5 }
                                                                                }} />
                                                                            );
                                                                        }}
                                                                    </Mutation>
                                                                    <div>
                                                                        <label className="header-medium-bold">Note: </label>
                                                                        <label>{order.cancel_note}</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <span className="clear" />
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }}
                                    </Query>
                                    :
                                    <Query query={GET_PURCHASE_ORDER(`{ count product_quantity_list { id } }`)}
                                        variables={{ status: 'returning', page: state.returning_current_page, limit: state.returning_show_per_page }}
                                        notifyOnNetworkStatusChange={true}
                                        onCompleted={data => {
                                            var total = 0;
                                            if (data && data.getPurchaseOrders.length != 0 && data.getPurchaseOrders[0].count != 0) total = data.getPurchaseOrders[0].count;
                                            this.setState({ returning_total: total })
                                        }}>
                                        {({ data, loading, refetch, error }) => {
                                            this.refetchReturning = refetch;
                                            if (loading) return <Loading width={100} height={100} />;
                                            if (error || (data.getPurchaseOrders && data.getPurchaseOrders.length == 0)) return <div className="product-card product-details text-center"><label>No Data to display</label></div>;
                                            return data.getPurchaseOrders.map((el, xx) => {
                                                return el.product_quantity_list.map((ell, index) => {
                                                    return (
                                                        <div className="row-separator product-card product-details" key={index}>
                                                            <div className="row-separator ellipsis" onClick={() => window.open(points.clientUrl + "/dashboard?key=" + currentUser.pass_key + "&loc=ALL&serial_number=" + ell.id)}>
                                                                <label className="clickable">{ell.id}</label>
                                                            </div>
                                                            <Mutation mutation={CHANGE_ITEM_STATUS} variables={{ id: ell.id, status: 'warehouse' }}>
                                                                {(changeItemStatus, { data, loading, error }) => {
                                                                    return (
                                                                        <ButtonWithPopup data={{
                                                                            triggerDOM: <button id={xx + "_item_" + index} className="btn-success stretch-width package-returned" disabled={loading}>Package Returned</button>,
                                                                            popupPosition: "top center",
                                                                            text: <h3 style={{ margin: 10 }}>Are you sure?</h3>,
                                                                            padding: 0,
                                                                            arrow: true,
                                                                            triggerID: xx + "_item_" + index,
                                                                            action: () => this.changeItemStatus(changeItemStatus, refetch),
                                                                            style: { maxWidth: 220, minWidth: 220, borderRadius: 5 }
                                                                        }} />
                                                                    );
                                                                }}
                                                            </Mutation>
                                                        </div>
                                                    );
                                                })
                                            });
                                        }}
                                    </Query>
                                }
                                {state.returning_total != 0 &&
                                    <div className="filter-container">
                                        <Pagination totalPage={state.returning_total} displayPageCount={state.returning_show_per_page} currentPage={state.returning_current_page} action={result => this.setState({ returning_current_page: result })} />
                                    </div>
                                }
                            </div>
                        </div>
                    </Modal>
                }

                {state.show_sales_stats &&
                    <Modal open={state.show_sales_stats} closeModal={() => this.setState({ ...initialize_sales_stats })} session={this.props.session} style={{ borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0, width: '50%' }}>
                        <div>
                            <style dangerouslySetInnerHTML={{ __html: `.popup-content .content {padding: 0px;}` }} />
                            <div className="modal-header row-separator">
                                <h4 className="header">{state.sales_stats_location_name}</h4>
                            </div>
                            <div style={{ margin: "0 10px" }}>
                                <div className="row-separator text-right">
                                    <button className="btn-success font-small" style={{ padding: "5px 20px" }} onClick={() => this.PSExportCSV()}>Export to CSV</button>
                                </div>
                                <Query query={GET_ORDER_STATUS_RATES_PER_COUNTRY} variables={{
                                    creator: state.selectedUserID,
                                    dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                    dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                    location: fulfillerLocation
                                }} onCompleted={data => this.setState({ sales_stats_data: JSON.parse(data.getOrderStatusRatesPerCountry.jsonStr)[state.sales_stats_location_iso2] })}>
                                    {({ data, loading, refetch, error }) => {
                                        if (loading || error) return null;
                                        let statuses = points.list_of_order_status.filter(e => e.value);
                                        let result = state.sales_stats_data;
                                        return (
                                            <Table headers={[{ text: "Product Name", onClick: () => this.sortProductSummary("product name") }, ...statuses.map(e => { return { text: e.label, onClick: () => this.sortProductSummary(e.value) } })]} containerStyle={{ fontSize: '0.9em', padding: 10 }}>
                                                {result.map((product, i) => {
                                                    let doms = [
                                                        <div key={0}>
                                                            {product.product_name}
                                                        </div>
                                                    ];
                                                    statuses.forEach((status, x) => {
                                                        let status_info = product.statuses.filter(e => e.status === status.value)[0];
                                                        doms.push(
                                                            <div key={x + 1}>
                                                                {status_info.count}
                                                            </div>
                                                        );
                                                    })
                                                    return (
                                                        <Tbody index={i} key={i}>
                                                            {doms}
                                                        </Tbody>
                                                    )
                                                })}
                                            </Table>
                                        );
                                    }}
                                </Query>
                            </div>
                        </div>
                    </Modal>
                }
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(Fulfiller);