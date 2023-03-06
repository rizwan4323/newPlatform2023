/*
    pag bad email sa shopify sure un na ndi exist tlga ung email na un dahil dko sure ha
    pero tingin ko since malaki n kumpanya ang shopify accurate ung pag check nila nun.
    kaya lang nkakapasok satin un dahil wla tayo pang check kung exist ba ung email ng user na nilagay sa email form
    ang bina validate lang ng browser ay ung format ng text sa input kng acceptable ba as email un or hindi pero di tlga na ccehck kung exist

    
*/

import React from 'react';
import toastr from 'toastr';
import withAuth from './../hoc/withAuth';
import { GET_FUNNEL_LIST, GET_FUNNEL_ORDERS, GET_ONLY_FUNNEL_FROM_ORDERS, UPDATE_FUNNEL_ORDERS, CANCEL_FUNNEL_ORDERS, ARCHIVE_FUNNEL_ORDERS, BULK_UPDATE_FUNNEL_ORDERS } from './../queries';
import { Query, Mutation } from 'react-apollo';
import { Helmet } from 'react-helmet';
import Loading from '../components/loading';
import ButtonWithPopup from '../components/buttonWithPopup';
import moment from 'moment';
import SelectTag from '../components/selectTag';
import InfiniteCalendar, { Calendar, withRange, } from 'react-infinite-calendar';
import Pagination from '../components/pagination';
import ShowFilter from '../components/showFilter';
import SearchField from '../components/searchField';
import LoadingPage from '../components/loadingPage';
import Tooltip from '../components/tooltip';
var ShortId = require('id-shorter');
var mongoDBId = ShortId({ isFullId: true });
const CalendarWithRange = withRange(Calendar);
const points = require('../../Global_Values');
const theme = {
    accentColor: '#01a3a4',
    floatingNav: {
        background: '#01a3a4',
        chevron: '#FFA726',
        color: '#FFF',
    },
    headerColor: '#10ac84',
    selectionColor: '#1dd1a1',
    textColor: {
        active: '#FFF',
        default: '#333',
    },
    todayColor: '#1dd1a1',
    weekdayColor: '#1dd1a1',
}

class FunnelOrders extends React.Component {
    constructor() {
        super();
        this.state = {
            is_page_loading: true,
            disable_export: false,
            sendPLGTrackingEmail: true,
            trackingnumber: [],
            filterByMerchant: '',
            filterByFunnel: '',
            totalOrders: 0,
            currentPage: 1,
            filter_order_status: '',
            search_order: '',
            refid: '',
            bulk_data: "[]",
            plgbuttonID: "",
            shopify_order_number: ""
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

        // * aset for params detecting button id show to search field 
        var urlParams = points.getURLParameters(this.props.location.search);
        if (urlParams.plgbuttonID != null) {
            console.log('parmassss =>> ', urlParams);
            this.setState({
                plgbuttonID: urlParams.plgbuttonID
            });
        }

        // start to remove old PLG_ORDER_ from localStorage
        const local_storage_list = Object.keys(localStorage).filter(e => e.includes("PLG_ORDER_"));
        local_storage_list.forEach(e => {
            const value = localStorage.getItem(e), date_now = new Date().toDateString();
            if (value != date_now) localStorage.removeItem(e);
        })
        // end to remove old PLG_ORDER_ from localStorage

        this.setState({ is_page_loading: false });
    }

    syncToShopify(caller, theItem) {

        points.customFetch(`/api/resyncToShopify`, "POST", theItem, data => {
            if (data.order.name) {
                caller.setState({ shopify_order_number: data.order.name })
                toastr.success(`Order ${data.order.name} has been synced to shopify`);
                return data.order.name
            } else {
                caller.setState({ shopify_order_number: "" })
                toastr.error(`Order ${data.order.name} has failed to sync to shopify`);
            }

        })

    }



    exportToCSV() {
        let state = this.state, orderList = state.orderList;
        if (orderList.length != 0) {
            let currentUser = this.props.session.getCurrentUser;
            var isAdminExport = localStorage.getItem(points.plg_domain_secret) || currentUser.privilege == 10 || currentUser.privilege == 4; // Nilagyan ko para kay Mario // User Privilege
            if (isAdminExport) { // admin or login as anonymous
                points.toastrPrompt(toastr, "info", "Exporting please wait...");
                this.setState({ disable_export: true }, () => {
                    var payload = {
                        id: currentUser.id, //
                        orderid: state.refid,
                        paid_cc: state.filterByMerchant === "plg_merchant" ? true : state.filterByMerchant === "cod" ? false : false,
                        plgbuttonID: state.plgbuttonID ? state.plgbuttonID : "",
                        merchant_type: state.filterByMerchant === "plg_merchant" ? "cod" : state.filterByMerchant,
                        funnel_name: state.filterByFunnel ? state.filterByFunnel.split(",")[0] : "",
                        domainIndex: state.filterByFunnel ? parseInt(state.filterByFunnel.split(",")[1]) : 0,
                        funnel_id: state.filterByFunnel && state.filterByFunnel.split(",")[2] ? state.filterByFunnel.split(",")[2] : "",
                        order_status: state.filter_order_status == "unfulfilled" ? "unpaid" : state.filter_order_status,
                        filterByStartDate: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                        filterByEndDate: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                        skip: 0,
                        limit: state.totalOrders * 10,
                        export_mode: "csv"
                    }
                    // TODO :: Params is you want to get admin export set `?client=true`
                    points.customFetch(`/api/exportAllFunnelOrders?merchant_root="${state.filterByMerchant}"&timezone=${window.localStorage.getItem("localBrowserDate") ? parseInt(window.localStorage.getItem("localBrowserDate")) : new Date().getTimezoneOffset()}`, "POST", payload, data => {
                        // points.customFetch(`/api/exportAllFunnelOrders?merchant_root="${state.filterByMerchant}"&timezone=${new Date().getTimezoneOffset()}`, "POST", payload, data => { // June10 Edit
                        if (data && data.status == "success") {
                            var fileName = "Funnel Order Export (" + new Date().toLocaleDateString() + ").csv";
                            points.exportDataToCSV(data.uri, fileName);
                            this.setState({ disable_export: false }, () => points.toastrPrompt(toastr, "success", "Export Success"));
                        } else {
                            points.toastrPrompt(toastr, "warning", "An error has occurred", "Error on server");
                        }
                    });
                });
            } else {
                // ? client export
                function fixExportData(data) {
                    var regex = new RegExp("#|,|(\r\n|\r|\n)", "g"), replaceBy = " ";
                    return data ? data.toString().replace(regex, replaceBy) : data;
                }

                toastr.clear();
                toastr.options.timeOut = 0;
                toastr.options.extendedTimeOut = 0;
                toastr.info("Exporting please wait...", "");
                const rows = [
                    ["Ref ID", "Shopify Order #", "Sync From", "Campaign Source", "PLG Tracking", "Tracking Number", "Tracking URL", "Merchant Type", "Product", "Variant", "Quantity", "Price", "Cost of goods", "Email", "Phone", "Shipping Name", "Shipping Address1", "Shipping Bldg/Villa/Barangay", "Shipping City", "Shipping Zip", "Shipping State/Province", "Shipping Country", "Notes"]
                ];
                orderList.forEach(el => {
                    let tracking_link = el.source_link || "https://plg.productlistgenie.io"; // for default if has sync_from
                    if (tracking_link) {
                        let url_object = new URL(tracking_link);
                        tracking_link = url_object.origin + "/track/";
                    }
                    el.line_items.forEach((li, lii) => {
                        let isPLGTrackingURL = el.sync_from && tracking_link ? true : false;
                        rows.push([
                            mongoDBId.encode(el.ids[lii]),
                            el.sync_from,
                            el.shopify_order_id,
                            el.campaign_src,
                            li.ref_track,
                            li.tracking_number, // Lineitem Tracking Number
                            isPLGTrackingURL ? tracking_link + (li.ref_track ? li.ref_track : mongoDBId.encode(el.ids[lii])) : li.tracking_link,
                            el.merchant_type,
                            fixExportData(li.title), // Lineitem name
                            fixExportData(li.variant), // Lineitem name
                            li.quantity, // Lineitem quantity
                            li.price, // Lineitem price
                            li.cost_of_goods ? li.cost_of_goods : 0, // Lineitem price
                            fixExportData(el.shipping_information.email), // Shipping Email
                            fixExportData(el.shipping_information.phone), // Shipping Phone
                            fixExportData(el.shipping_information.name), // Shipping Name
                            fixExportData(el.shipping_information.street1), // Shipping Address1
                            fixExportData(el.shipping_information.bldgVilla ? el.shipping_information.bldgVilla : "N/A"), // Shipping Bldg/Villa/Barangay
                            fixExportData(el.shipping_information.city), // Shipping City
                            fixExportData(el.shipping_information.zip), // Shipping Zip
                            fixExportData(el.shipping_information.state), // Shipping Province
                            fixExportData(el.shipping_information.country), // Shipping Country
                            fixExportData(el.notes) // order note
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
        } else {

            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.clear();
            toastr.warning("Nothing to export to csv.", "No Action");

        }
    }

    handleOnChange(event) {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [name]: value
        })
    }

    setLoadingTime(tiemout, etimeout) {
        toastr.options.timeOut = tiemout;
        toastr.options.extendedTimeOut = etimeout;
    }

    archiveMyFunnelOrders(archiveMyFunnelOrders, refetch) {
        this.setLoadingTime(0, 0)
        toastr.clear();
        toastr.info("Please wait...", "Archiving Order");
        archiveMyFunnelOrders().then(({ data }) => {
            this.setLoadingTime(3000, 2000);
            toastr.clear();
            toastr.success("Order removed successfully.", "Success");
            refetch();
        }).catch(error => {
            this.setLoadingTime(0, 0);
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    cancelMyFunnelOrders(cancelMyFunnelOrders, refetch) {
        this.setLoadingTime(0, 0)
        toastr.clear();
        toastr.info("Please wait...", "Cancelling Order");
        cancelMyFunnelOrders().then(({ data }) => {
            this.setLoadingTime(3000, 2000);
            toastr.clear();
            toastr.success("Order Canceled.", "Success");
            refetch();
        }).catch(error => {
            this.setLoadingTime(0, 0);
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    updateMyFunnelOrders(updateMyFunnelOrders, refetch, isOS) {
        if (this.state.trackingnumber.length != 0 || isOS) {
            this.setLoadingTime(0, 0)
            toastr.clear();
            toastr.info("Please wait...", "Adding tracking number");
            updateMyFunnelOrders().then(({ data }) => {
                this.setLoadingTime(3000, 2000);
                toastr.clear();
                toastr.success("Tracking number saved.", "Success");
                this.setState({ trackingnumber: [] });
                refetch();
            }).catch(error => {
                this.setLoadingTime(0, 0);
                toastr.clear();
                toastr.warning(error.graphQLErrors[0].message, "");
            });
        }
    }

    addShopifyOrderNumber(updateMyFunnelOrders, refetch, isOS) {

        this.setLoadingTime(0, 0)
        toastr.clear();
        toastr.info("Please wait...", "Adding order number");
        updateMyFunnelOrders().then(({ data }) => {
            this.setLoadingTime(3000, 2000);
            toastr.clear();
            toastr.success("Order number saved.", "Success");
            this.setState({ shopify_order_number: "" });
            refetch();
        }).catch(error => {
            this.setLoadingTime(0, 0);
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    getMerchantImgURL(type) {
        if (type == "paypal") {
            return { color: "#253b80", text: "Paypal" };
        } else if (type == "stripe") {
            return { color: "#6772e5", text: "Stripe" };
        } else if (type == "authorize.net") {
            return { color: "#045d77", text: "Authorize.Net" };
        } else if (type == "conekta") {
            return { color: "#201545", text: "Conekta" };
        } else if (type == "Braintree") {
            return { color: "#000000", text: "Braintree" };
        } else {
            return { color: "#ff7f00", text: "COD" };
        }
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

    funnelSalesTooltip({ active, payload, label }) {
        if (active && payload) {
            return (
                <div style={{ backgroundColor: '#232d2b', border: 'none', color: '#fff', opacity: 0.8, padding: '15px 10px' }}>
                    <label>Date: {payload[0].payload.date}</label> <br />
                    <label>Sales: ${points.commafy(payload[0].payload.count)}</label>
                </div>
            )
        }
    }

    filterShopifyOrderExists(line_items) {
        if (typeof line_items === "undefined") return null;

        if (line_items.filter(item => typeof item.shopify_order_number !== "undefined" && item.shopify_order_number !== null).length) {
            return line_items.filter(item => typeof item.shopify_order_number !== "undefined" && item.shopify_order_number !== null)[0];
        }

        return null;
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Funnel Orders - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        function getDate(date) {
            if (typeof date == "string") date = parseInt(date);
            const momentoffset = moment(date).utcOffset(parseInt(window.localStorage.getItem("localBrowserDate")) * -1).format("MMMM DD, YYYY. ddd, h:mm:ss A")
            // console.log("✅ Original", moment(date).utcOffset(0).format("MMMM DD, YYYY  ddd, h:mm:ss A").toString());
            // console.log(momentoffset);
            return momentoffset;
        }

        function isAfterDate(date1, date2) {
            return date1 > date2;
        }

        var state = this.state;
        var currentUser = this.props.session.getCurrentUser;
        if (state.is_page_loading) return <LoadingPage />;
        return (
            <div className="funnel">
                {this.head()}
                <div className="newPageHeader">
                    <div className="column column_3_12" style={{ marginTop: 5 }}>
                        <span className="hide-in-desktop float-left" style={{ padding: 15 }} />
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>Funnel Orders</h4>
                        <label style={{ color: '#878787' }}>You have <span id="funnel_count" className="font-bold" style={{ color: '#23c78a' }}>{state.totalOrders}</span> Orders</label>
                    </div>
                    <div className="column column_1_12" style={{ marginTop: 5 }}>
                        <ButtonWithPopup data={{
                            triggerDOM: <div className="custom-select">
                                <div className="select-selected stretch-width text-left" style={{ padding: 9 }}>Date</div>
                            </div>,
                            popupPosition: "bottom center",
                            text: <div className="infinite-calendar">
                                <InfiniteCalendar
                                    Component={CalendarWithRange}
                                    width={300}
                                    height={400}
                                    selected={{
                                        start: state.filterByStartDate ? state.filterByStartDate : new Date(),
                                        end: state.filterByEndDate ? state.filterByEndDate : new Date(),
                                    }}
                                    locale={{
                                        headerFormat: 'MMM Do',
                                    }}
                                    onSelect={data => this.filterDate(data)}
                                    theme={theme}
                                />
                            </div>,
                            loading: false,
                            padding: 0,
                            style: {
                                maxWidth: 300
                            },
                            checkORtimesButton: false
                        }} />
                    </div>
                    {/* TODO: Query is expensive, make it light :: Changed it to getFunnelList*/}
                    <div className="column column_2_12" style={{ marginTop: 5 }}>
                        <Query query={GET_FUNNEL_LIST(`{ id funnel_name old_page_ids }`)} variables={{ creator: currentUser.id, limit: 0 }}>
                            {({ data, loading, refetch, error }) => {
                                if (loading || error) return null;
                                var options = [<option key={0} value="">All Funnels</option>];
                                if (data.getFunnelList.length != 0) {
                                    data.getFunnelList.forEach((funnel, i) => {
                                        // search order by old ids plus funnel id
                                        const str_value = funnel.funnel_name + "," + 0 + (funnel.id ? "," + funnel.id : "");

                                        options.push(<option key={i + 1} value={str_value}>{points.presentableFunnelName(funnel.funnel_name)}</option>);
                                    })
                                }
                                return <SelectTag className="stretch-width" name="filterByFunnel" value={state.filterByFunnel} options={options} onChange={event => this.setState({ currentPage: 1, filterByFunnel: event.target.value })} />
                            }}
                        </Query>
                    </div>
                    {/* <div className="column column_2_12" style={{ marginTop: 5 }}>
                        <Query query={GET_ONLY_FUNNEL_FROM_ORDERS} variables={{ creator: currentUser.id }} >
                            {({ data, loading, refetch, error }) => {
                                if (loading) return <label>&nbsp;</label>
                                if (error) return <label>&nbsp;</label>
                                var options = [<option key={0} value="">All Funnels</option>]
                                if (data.getOnlyFunnelFromOrders) {
                                    data.getOnlyFunnelFromOrders.map((funnel, fi) => {
                                        const str_value = funnel.funnel_object.funnel_name + "," + funnel.funnel_object.domainIndex + (funnel.funnel_object.funnel_id ? "," + funnel.funnel_object.funnel_id : "");
                                        options.push(<option key={fi + 1} value={str_value}>{points.presentableFunnelName(funnel.funnel_object.funnel_name)}</option>)
                                    })
                                }
                                return <SelectTag className="stretch-width" name="filterByFunnel" value={state.filterByFunnel} options={options} onChange={event => this.setState({ currentPage: 1, filterByFunnel: event.target.value })} />
                            }}
                        </Query> 
                    </div> */}
                    <div className="column column_2_12" style={{ marginTop: 5 }}>
                        {(() => {
                            var orderStatusOptions = points.list_of_order_status.map((status, i) => {
                                return <option value={status.value} key={i}>{status.label}</option>;
                            });
                            return <SelectTag className="stretch-width" name="filter_order_status" value={state.filter_order_status} options={orderStatusOptions} onChange={event => this.setState({ currentPage: 1, filter_order_status: event.target.value })} />;
                        })()}
                    </div>
                    <div className="column column_2_12" style={{ marginTop: 5 }}>
                        {(() => {
                            var merchant_types = points.list_of_merchant.map((merchant, i) => {
                                return <option value={merchant.value} key={i}>{merchant.label}</option>;
                            });
                            return <SelectTag className="stretch-width" name="filterByMerchant" value={state.filterByMerchant} options={merchant_types} onChange={event => this.setState({ currentPage: 1, filterByMerchant: event.target.value })} />
                        })()}
                    </div>
                    <div className="column column_2_12" style={{ marginTop: 5 }}>
                        <button className="btn-success stretch-width one-line-ellipsis" onClick={() => this.exportToCSV()} style={{ padding: '8px 15px' }} disabled={state.disable_export}>Export to CSV</button>
                    </div>
                    <span className="clear" />
                </div>
                <div className="page-container">
                    {/* Start Show Filter */}
                    <div className="flex-container" style={{ justifyContent: 'flex-start' }}>
                        {(currentUser.privilege === 10 || currentUser.access_tags.includes("import_tracking")) && points.isImportBrowserAvailable() ? // User Privilege
                            <Mutation mutation={BULK_UPDATE_FUNNEL_ORDERS} variables={{ array: state.bulk_data }} >
                                {(bulkUpdateMyFunnelOrders, { data, loading, error }) => {
                                    return (
                                        <div className="stretch-to-mobile">
                                            <Tooltip position="bottom left" trigger={<button className="btn-success stretch-to-mobile" onClick={() => document.getElementById("upload_tracking").click()} style={{ padding: '8px 15px' }} disabled={loading}>Import CSV</button>} style={{ width: 250 }}>
                                                <div className="text-left">
                                                    <label>CSV will be filtered by the following:</label> <br />
                                                    <label>No Ref ID</label> <br />
                                                    <label>No Sync From</label> <br />
                                                    <label>No Tracking Number</label>
                                                </div>
                                            </Tooltip>
                                            <input id="upload_tracking" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" style={{ display: 'none' }} onChange={event => {
                                                var file = event.target.files;
                                                if (file.length !== 0) { // selected something
                                                    points.getExcelOrCSVasArray(file[0], data => {
                                                        let array = data.map(e => {
                                                            return { ref: e.ref_id, tracking: e.tracking_number, tracking_link: e.tracking_url };
                                                        })
                                                        this.setState({ bulk_data: JSON.stringify(array) }, () => {
                                                            points.executeMutation(bulkUpdateMyFunnelOrders, toastr, () => {
                                                                points.toastrPrompt(toastr, "success", "Tracking Number of " + array.length + " Orders has been updated.", "Success");
                                                                this.refetchOrder();
                                                            })
                                                        })
                                                    });
                                                }
                                            }} />
                                        </div>
                                    );
                                }}
                            </Mutation>
                            : void 0}
                        <SearchField
                            name="search_order_input"
                            value={state.search_order_input}
                            placeHolder="Search Order Information"
                            tooltip="Search by ref, name, email, tracking number"
                            containerClassName="stretch-to-mobile"
                            onSubmit={value => this.setState({ refid: value, search_order_input: value, currentPage: 1 })}
                            width={320} containerStyle={{ margin: '0 5px' }}
                        />
                        {state.currentPage > 1 &&
                            <ShowFilter label={"Page: " + state.currentPage} onClick={() => this.setState({ currentPage: 1 })} />
                        }
                        {state.filter_order_status &&
                            <ShowFilter label={state.filter_order_status} onClick={() => this.setState({ filter_order_status: "" })} />
                        }
                        {state.filterByFunnel &&
                            <ShowFilter label={points.presentableFunnelName(state.filterByFunnel.split(",")[0])} onClick={() => this.setState({ filterByFunnel: "" })} />
                        }
                        {state.filterByMerchant &&
                            <ShowFilter label={"Merchant: " + state.filterByMerchant} onClick={() => this.setState({ filterByMerchant: "" })} />
                        }
                        {state.filterByStartDate && state.filterByEndDate ?
                            <ShowFilter label={state.filterByStartDate + " - " + state.filterByEndDate} onClick={() => this.setState({ filterByStartDate: "", filterByEndDate: "" })} />
                            : void 0}
                        {state.plgbuttonID != '' &&
                            <ShowFilter label={"Search PLG Button : " + state.plgbuttonID} onClick={() => this.setState({ plgbuttonID: "" })} />
                        }
                        {state.refid &&
                            <ShowFilter label={"Search: " + state.refid} onClick={() => this.setState({ search_order_input: "", refid: "" })} />
                        }
                    </div>
                    {/* End Show Filter */}
                    <div className="product-card">
                        <div style={{ borderBottom: '1px solid #dfe5eb', padding: 20 }}>
                            <div className="column column_6_12">
                                <ButtonWithPopup data={{
                                    triggerDOM: <span className="fas fa-info-circle" style={{ margin: '0 3px' }} />,
                                    popupPosition: "bottom left",
                                    text: (
                                        <div className="text-left">
                                            <div className="row-separator">
                                                {(() => {
                                                    var bgAndFont = points.getBGandFontColor("unfulfilled");
                                                    return <label className="status-container" style={{ backgroundColor: bgAndFont.bg, color: bgAndFont.color }}>Unfulfilled</label>
                                                })()}
                                                <strong> - </strong>
                                                <label>The order has not been processed yet.</label>
                                            </div>
                                            <div className="row-separator">
                                                {(() => {
                                                    var bgAndFont = points.getBGandFontColor("hold");
                                                    return <label className="status-container" style={{ backgroundColor: bgAndFont.bg, color: bgAndFont.color }}>Hold</label>
                                                })()}
                                                <strong> - </strong>
                                                <label>The order is for further verification before it will be processed. (e.g. Phone Number, Price, etc)</label>
                                            </div>
                                            <div className="row-separator">
                                                {(() => {
                                                    var bgAndFont = points.getBGandFontColor("pickedup");
                                                    return <label className="status-container" style={{ backgroundColor: bgAndFont.bg, color: bgAndFont.color }}>Picked-up</label>
                                                })()}
                                                <strong> - </strong>
                                                <label>The order was processed and is waiting for courier pick up.</label>
                                            </div>
                                            <div className="row-separator">
                                                {(() => {
                                                    var bgAndFont = points.getBGandFontColor("cancelled");
                                                    return <label className="status-container" style={{ backgroundColor: bgAndFont.bg, color: bgAndFont.color }}>Cancelled</label>
                                                })()}
                                                <strong> - </strong>
                                                <label>The order was canceled for a reason. Please check notes for the details of cancelation.</label>
                                            </div>
                                            <div className="row-separator">
                                                {(() => {
                                                    var bgAndFont = points.getBGandFontColor("delivered");
                                                    return <label className="status-container" style={{ backgroundColor: bgAndFont.bg, color: bgAndFont.color }}>Delivered</label>
                                                })()}
                                                <strong> - </strong>
                                                <label>The order was delivered successfully and the customer already paid for it.</label>
                                            </div>
                                            <div className="row-separator">
                                                {(() => {
                                                    var bgAndFont = points.getBGandFontColor("paid");
                                                    return <label className="status-container" style={{ backgroundColor: bgAndFont.bg, color: bgAndFont.color }}>Paid</label>
                                                })()}
                                                <strong> - </strong>
                                                <label>PLG already paid for the product that is set to be fulfilled and delivered to the customer.</label>
                                            </div>
                                        </div>
                                    ),
                                    loading: false,
                                    padding: 0,
                                    checkORtimesButton: false,
                                    style: { padding: 10, width: 300, borderRadius: 5 },
                                    onAction: 'hover'
                                }} />
                                <label style={{ fontSize: '1.2em' }}>FUNNEL ORDER LIST</label>
                            </div>
                            {state.totalOrders != 0 &&
                                <div className="column column_6_12">
                                    <Pagination totalPage={state.totalOrders} currentPage={state.currentPage} action={result => this.setState({ currentPage: result })} />
                                </div>
                            }
                            <span className="clear" />
                        </div>
                        <Query query={
                            GET_FUNNEL_ORDERS(`{ ids campaign_src  creator sync_from source_link has_pod plgbuttonID design_url orderCreator fulfill_with_plg count currencyWord currencySymbol order_status cancel_note fulfillment_status risk_level merchant_type paid_cc order_date order_status_update dateStatusDelivered shipping_information { name email phone street1 street2 city state country zip address_type aptOffice bldgVilla nearestLandmark } line_items { payment_status title variant price convertedPrice quantity tracking_number receipt_cc tracking_link ref_track shopify_order_number shopify_variant_id cost_of_goods } }`)
                        } notifyOnNetworkStatusChange={true} variables={{
                            id: currentUser.id,
                            orderid: state.refid,
                            paid_cc: state.filterByMerchant === "plg_merchant" ? true : state.filterByMerchant === "cod" ? false : false,
                            plgbuttonID: state.plgbuttonID ? state.plgbuttonID : "",
                            merchant_type: state.filterByMerchant === "plg_merchant" ? "cod" : state.filterByMerchant,
                            funnel_name: state.filterByFunnel ? state.filterByFunnel.split(",")[0] : "",
                            domainIndex: state.filterByFunnel ? parseInt(state.filterByFunnel.split(",")[1]) : 0,
                            funnel_id: state.filterByFunnel && state.filterByFunnel.split(",")[2] ? state.filterByFunnel.split(",")[2] : "",
                            order_status: state.filter_order_status == "unfulfilled" ? "unpaid" : state.filter_order_status,
                            filterByStartDate: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                            filterByEndDate: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                            skip: state.currentPage - 1
                        }} onCompleted={data => {
                            if (data.getMyFunnelOrders.length != 0) {
                                this.setState({ orderList: data.getMyFunnelOrders, totalOrders: data.getMyFunnelOrders[0].count });
                            } else {
                                this.setState({ orderList: [], totalOrders: 0 });
                            }
                        }} >
                            {({ data, loading, refetch, error }) => {
                                if (loading) return <div className="text-center"><Loading width={200} height={200} /></div>;
                                if (error) return <div className="text-center" style={{ padding: 20 }}>An error has occurred.</div>;
                                if (data.getMyFunnelOrders.length == 0) return <div className="text-center" style={{ padding: 20 }}>No order yet.</div>;
                                this.refetchOrder = refetch;
                                return data.getMyFunnelOrders.filter(filt => state.filterByMerchant === "cod" ? !filt.paid_cc : true).map((el, i) => {
                                    const is_fulfill_by_plg = el.fulfill_with_plg == true || el.fulfill_with_plg == null;
                                    const has_tracking_number = el.line_items.filter(e => e.tracking_number).length !== 0 ? true : false;
                                    const unSyncedOrders = {
                                        note: `Merchant Type: ${el.merchant_type}`,
                                        shipping_address: {
                                            name: el.shipping_information.name,
                                            email: el.shipping_information.email,
                                            city: el.shipping_information.city,
                                            company: null,
                                            country: el.shipping_information.country,
                                            first_name: el.shipping_information.name.split(" ")[0],
                                            last_name: el.shipping_information.name.split(" ")[1],
                                            phone: el.shipping_information.phone,
                                            address1: el.shipping_information.street1,
                                            address2: el.shipping_information.street2,
                                            province: el.shipping_information.state,
                                            zip: el.shipping_information.zip,

                                        },
                                        send_receipt: true,
                                        line_items: el.line_items.map(li => {
                                            return {
                                                variant_id: li.shopify_variant_id, quantity: li.quantity
                                            }
                                        }),
                                        source_link: el.source_link ? el.source_link : "",
                                        customer: { email: el.shipping_information.email ? el.shipping_information.email : "", accpts_marketing: true }
                                    }

                                    return (
                                        <div style={{ borderBottom: '1px solid #dfe5eb', padding: 20 }} key={i}>
                                            <div className="column column_3_12 row-separator">
                                                <div className="row-separator">
                                                    <label className="header-small-light-bold">Shipping Information - {el.campaign_src}</label>
                                                </div>
                                                <div className="row-separator">
                                                    <label className="header-medium-bold">{el.shipping_information.name}</label>
                                                    <label style={{ color: '#ef8805', fontFamily: "'Roboto', sans-serif" }}>{el.shipping_information.email}</label>
                                                </div>
                                                {(() => {
                                                    if (el.merchant_type == "cod") {
                                                        if (el.shipping_information.country == "PH" || el.shipping_information.country == "PHL") {
                                                            return (
                                                                <div className="row-separator">
                                                                    <label>Phone: {el.shipping_information.phone ? el.shipping_information.phone : "N/A"}</label> <br />
                                                                    <label>Address: {el.shipping_information.street1 ? el.shipping_information.street1 : "N/A"}</label> <br />
                                                                    <label>Address 2: {el.shipping_information.street2 ? el.shipping_information.street2 : "N/A"}</label> <br />
                                                                    <label>Barangay: {el.shipping_information.bldgVilla ? el.shipping_information.bldgVilla : "N/A"}</label> <br />
                                                                    <label>Town/City: {el.shipping_information.city ? el.shipping_information.city : "N/A"}</label> <br />
                                                                    <label>Province: {el.shipping_information.state ? el.shipping_information.state : "N/A"}</label> <br />
                                                                    <label>Country: {el.shipping_information.country ? el.shipping_information.country : "N/A"}</label> <br />
                                                                    <label>Zip: {el.shipping_information.zip ? el.shipping_information.zip : "N/A"}</label>
                                                                </div>
                                                            );
                                                        } else if (el.shipping_information.country == "AE" || el.shipping_information.country == "ARE" || el.shipping_information.country == "SA" || el.shipping_information.country == "SAU") {
                                                            return (
                                                                <div className="row-separator">
                                                                    <label>Phone: {el.shipping_information.phone ? el.shipping_information.phone : "N/A"}</label> <br />
                                                                    <label>Address: {el.shipping_information.street1 ? el.shipping_information.street1 : "N/A"}</label> <br />
                                                                    <label>Address 2: {el.shipping_information.street2 ? el.shipping_information.street2 : "N/A"}</label> <br />
                                                                    <label>City: {el.shipping_information.city ? el.shipping_information.city : "N/A"}</label> <br />
                                                                    <label>State: {el.shipping_information.state ? el.shipping_information.state : "N/A"}</label> <br />
                                                                    <label>Country: {el.shipping_information.country ? el.shipping_information.country : "N/A"}</label> <br />
                                                                    <label>Zip: {el.shipping_information.zip ? el.shipping_information.zip : "N/A"}</label> <br />
                                                                    {el.shipping_information.country == "AE" || el.shipping_information.country == "ARE" ?
                                                                        <label>Address Type: {el.shipping_information.address_type ? el.shipping_information.address_type : "N/A"} <br /></label>
                                                                        : void 0}
                                                                    {el.shipping_information.country == "AE" || el.shipping_information.country == "ARE" ?
                                                                        <label>Apartment / Office: {el.shipping_information.aptOffice ? el.shipping_information.aptOffice : "N/A"} <br /></label>
                                                                        : void 0}
                                                                    <label>Building / Villa: {el.shipping_information.bldgVilla ? el.shipping_information.bldgVilla : "N/A"}</label> <br />
                                                                    <label>Nearest Landmark: {el.shipping_information.nearestLandmark ? el.shipping_information.nearestLandmark : "N/A"}</label>
                                                                </div>
                                                            );
                                                        } else {
                                                            return (
                                                                <div className="row-separator">
                                                                    <label>Phone: {el.shipping_information.phone ? el.shipping_information.phone : "N/A"}</label> <br />
                                                                    <label>Address: {el.shipping_information.street1 ? el.shipping_information.street1 : "N/A"}</label> <br />
                                                                    <label>Address 2: {el.shipping_information.street2 ? el.shipping_information.street2 : (el.shipping_information.bldgVilla ? el.shipping_information.bldgVilla : "") + " " + (el.shipping_information.nearestLandmark ? el.shipping_information.nearestLandmark : "")}</label> <br />
                                                                    <label>City: {el.shipping_information.city ? el.shipping_information.city : "N/A"}</label> <br />
                                                                    <label>State: {el.shipping_information.state ? el.shipping_information.state : "N/A"}</label> <br />
                                                                    <label>Country: {el.shipping_information.country ? el.shipping_information.country : "N/A"}</label> <br />
                                                                    <label>Zip: {el.shipping_information.zip ? el.shipping_information.zip : "N/A"}</label>
                                                                </div>
                                                            );
                                                        };
                                                    } else {
                                                        return (
                                                            <div className="row-separator">
                                                                <label>Phone: {el.shipping_information.phone ? el.shipping_information.phone : "N/A"}</label> <br />
                                                                <label>Address: {el.shipping_information.street1 ? el.shipping_information.street1 : "N/A"}</label> <br />
                                                                <label>Address 2: {el.shipping_information.street2 ? el.shipping_information.street2 : "N/A"}</label> <br />
                                                                <label>City: {el.shipping_information.city ? el.shipping_information.city : "N/A"}</label> <br />
                                                                <label>State: {el.shipping_information.state ? el.shipping_information.state : "N/A"}</label> <br />
                                                                <label>Country: {el.shipping_information.country ? el.shipping_information.country : "N/A"}</label> <br />
                                                                <label>Zip: {el.shipping_information.zip ? el.shipping_information.zip : "N/A"}</label>
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                            </div>
                                            <div className="column column_6_12 row-separator">
                                                <div style={{ border: '1px solid #dfe5eb', backgroundColor: '#f4f9fd', borderRadius: 5 }}>
                                                    <div style={{ borderBottom: '1px solid #dfe5eb', padding: 10, position: 'relative', overflow: this.filterShopifyOrderExists(el.line_items) ? 'hidden' : 'unset' }}>
                                                        <label>List of Orders</label>
                                                        {/* var getBGandFontColor = points.getBGandFontColor("paid"); */}
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
                                                        {this.filterShopifyOrderExists(el.line_items) !== null ?
                                                            <div className="text-center header-small-light-bold" style={{ position: 'absolute', top: 0, right: -50, backgroundColor: '#2d3740', padding: 5, width: 150, transform: 'rotate(25deg)' }}>
                                                                {console.log("🎈🎈🎈🎈🎈🎈🎈  ", { el })}
                                                                <label>{this.filterShopifyOrderExists(el.line_items).shopify_order_number}</label>
                                                            </div>
                                                            :
                                                            <div>
                                                                {console.log("🎈🎈🎈🎈🎈🎈🎈  ", { el })}

                                                                <ButtonWithPopup data={{
                                                                    triggerDOM: <span id={"tracking_" + i} style={{ position: 'absolute', top: 6, right: 0, padding: 5, width: 110, fontSize: 12, cursor: 'pointer', color: '#ff5722' }}> Create in Shopify</span>,
                                                                    popupPosition: "top right",
                                                                    text: <div className="text-left">
                                                                        <label className="header-medium-bold one-line-ellipsis">Create order in Shopify</label>
                                                                        <div className="column column_12_12 display-inline" style={{ margin: '5px 0' }}>
                                                                            <div className="column column_4_12 one-line-ellipsis" style={{ padding: 0 }}>
                                                                                <label title="Add order #">{el.line_items.map(mp => mp.title)}</label>
                                                                            </div>
                                                                            <div className="column column_8_12">
                                                                                <input type="text" defaultValue={this.state.shopify_order_number} onBlur={event => {
                                                                                    this.setState({ shopify_order_number: event.target.value })
                                                                                }} />
                                                                                <button className="btn-warning stretch-width" disabled={this.state.shopify_order_number ? true : false} onClick={() => {
                                                                                    this.setState({ shopify_order_number: "Creating order in Shopify..." })
                                                                                    this.syncToShopify(this, {
                                                                                        token: currentUser.store_token, url: currentUser.store_url, payload: unSyncedOrders
                                                                                    })
                                                                                }}>Sync to Shopify</button>

                                                                            </div>
                                                                        </div>
                                                                        {/* <div className="clear">
                                                                        <input type="checkbox" checked={state.sendPLGTrackingEmail} id="send_email" onChange={event => this.setState({ sendPLGTrackingEmail: event.target.checked })} style={{ width: 'fit-content' }} />
                                                                        <label className="cursor-pointer" htmlFor="send_email">Send Tracking Email (PLG)</label>
                                                                    </div> */}
                                                                        <Mutation
                                                                            mutation={UPDATE_FUNNEL_ORDERS}
                                                                            variables={{
                                                                                shopify_order_number: this.state.shopify_order_number,
                                                                                id: currentUser.id,
                                                                                productID: el.ids[0],
                                                                                merchant_type: el.merchant_type,
                                                                                country: el.shipping_information.country,
                                                                                orderCreator: el.orderCreator,
                                                                                orderEmail: el.shipping_information.email,
                                                                                domains: JSON.stringify(currentUser.funnel_genie_domains),
                                                                                client_tracking: false,
                                                                                sendPLGTrackingEmail: state.sendPLGTrackingEmail
                                                                            }} >
                                                                            {(updateMyFunnelOrders, { datass, loading, error }) => {
                                                                                return <button className="btn-success stretch-width" disabled={this.state.shopify_order_number == ("" || "Creating order in Shopify...") ? true : false} onClick={() => {
                                                                                    console.log(updateMyFunnelOrders)
                                                                                    this.addShopifyOrderNumber(updateMyFunnelOrders, refetch)
                                                                                }}>SAVE</button>;
                                                                            }}
                                                                        </Mutation>
                                                                    </div>,
                                                                    action: () => this.saveFunnelGenieCredential(saveFunnelGenieCredential, true),
                                                                    triggerID: "tracking_" + i,
                                                                    loading: false,
                                                                    padding: 5,
                                                                    checkORtimesButton: false,
                                                                    style: {
                                                                        padding: 10,
                                                                        width: 320
                                                                    },
                                                                    onClose: () => this.setState({ shopify_order_number: this.state.shopify_order_number })
                                                                }} />
                                                            </div>
                                                        }
                                                    </div>

                                                    {el.line_items.map((li, ii) => {
                                                        var bgcolor = "#f0f4f7";


                                                        if (ii % 2 != 0) bgcolor = "#f6fafd";
                                                        return (
                                                            <div className="display-inline flex-container" style={{ borderBottom: '1px solid #dfe5eb', backgroundColor: bgcolor, padding: 10, overflow: 'hidden' }} key={ii}>
                                                                <div className="column column_5_12" style={{ padding: 0 }}>
                                                                    <ButtonWithPopup data={{
                                                                        triggerDOM: <label className="header-medium-bold one-line-ellipsis cursor-pointer">{points.capitalizeWord(li.title ? li.title.toLowerCase() : "n/a")}</label>,
                                                                        popupPosition: "top left",
                                                                        text: <div className="text-left">
                                                                            <div className="row-separator" style={{ display: 'flex', alignItems: 'center' }}>
                                                                                <label className="header-medium-bold">Name:</label>
                                                                                <label style={{ marginLeft: 5 }}>{points.capitalizeWord(li.title ? li.title.toLowerCase() : "n/a")}</label>
                                                                            </div>
                                                                            <div className="row-separator" style={{ display: 'flex', alignItems: 'center' }}>
                                                                                <label className="header-medium-bold">Variant:</label>
                                                                                <label style={{ marginLeft: 5 }}>{points.capitalizeWord(li.variant ? li.variant.toLowerCase() : "n/a")}</label>
                                                                            </div>
                                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                <label className="header-medium-bold">Tracking Number:</label>
                                                                                <label style={{ marginLeft: 5 }}>{li.tracking_number ? li.tracking_number : "n/a"}</label>
                                                                            </div>
                                                                        </div>,
                                                                        loading: false,
                                                                        padding: 0,
                                                                        checkORtimesButton: false,
                                                                        style: {
                                                                            padding: 15,
                                                                            width: 300,
                                                                            borderRadius: 5
                                                                        },
                                                                        onAction: 'hover'
                                                                    }} />
                                                                    {li.variant && <label className="header-medium-bold font-small">{points.capitalizeWord(li.variant ? li.variant.toLowerCase() : "n/a")}</label>}
                                                                    <label className="header-medium-bold font-small">Ref: {li.ref_track ? li.ref_track : mongoDBId.encode(el.ids[ii])}</label>
                                                                    {/* {el.merchant_type == "authorize.net" && <label className="header-medium-bold font-small">Authorize ID: {el.ref_id}</label>} */}
                                                                    {/* el.orderCreator.replace(/customer_|cod_/g, "PLG-") */}
                                                                </div>
                                                                <div className="column column_7_12 display-inline" style={{ padding: 5, backgroundColor: '#2d3740', borderRadius: 3 }}>
                                                                    <div className="float-left" style={{ width: '40%' }}>

                                                                        {points.capitalizeWord(li.variant ? li.variant.toLowerCase() : "n/a").includes('Subscription') ? <label className="header-small-light-bold" style={{ position: 'relative' }}>Rebill: {li.quantity}
                                                                            <span style={{ paddingLeft: 10, position: 'absolute', top: '-4px' }}>
                                                                                <svg height="26px" width="26px" fill="#ffffff" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" ><g><path fill="#ffffff" d="M49.351,70.349c-2.808-6.307-1.504-13.504,3.322-18.333c4.828-4.826,12.029-6.131,18.34-3.323   c0.06,0.026,0.122,0.037,0.182,0.06l-3.092,2.426c-1.29,1.012-1.516,2.878-0.503,4.169c0.586,0.746,1.457,1.137,2.338,1.137   c0.642,0,1.287-0.207,1.831-0.634l7.837-6.148c0.888-0.696,1.304-1.836,1.074-2.942l-2.039-9.784   c-0.334-1.604-1.904-2.635-3.513-2.301c-1.605,0.334-2.636,1.907-2.302,3.513l0.942,4.52c-0.026-0.013-0.048-0.031-0.074-0.042   c-8.826-3.927-18.906-2.089-25.686,4.685c-6.773,6.778-8.611,16.858-4.683,25.681c0.546,1.228,1.751,1.957,3.015,1.957   c0.448,0,0.904-0.092,1.339-0.286C49.344,73.963,50.092,72.013,49.351,70.349z" /><path fill="#ffffff" d="M85.354,54.327c-0.739-1.665-2.689-2.414-4.353-1.675c-1.665,0.739-2.415,2.688-1.675,4.353   c2.805,6.313,1.5,13.511-3.325,18.335c-4.729,4.729-11.729,6.069-17.945,3.482l3.086-2.42c1.29-1.012,1.516-2.878,0.503-4.169   c-1.012-1.29-2.879-1.516-4.169-0.503l-7.839,6.149c-0.888,0.696-1.305,1.836-1.074,2.941l2.038,9.784   c0.292,1.401,1.527,2.364,2.904,2.364c0.2,0,0.404-0.021,0.608-0.062c1.605-0.335,2.636-1.907,2.302-3.513l-0.938-4.499   c2.934,1.229,5.994,1.837,9.021,1.837c5.951,0,11.759-2.319,16.168-6.729C87.437,73.234,89.277,63.155,85.354,54.327z" /><path fill="#ffffff" d="M21.082,30.459h48.068v0.007h5.15V19.112c0-1.891-1.546-3.434-3.437-3.434h-7.723v-2.544   c0-1.722-1.413-3.134-3.135-3.134h-2.312c-1.726,0-3.135,1.413-3.135,3.134v2.544H35.673v-2.544c0-1.722-1.409-3.134-3.135-3.134   h-2.312c-1.722,0-3.135,1.413-3.135,3.134v2.544h-7.724c-1.887,0-3.434,1.543-3.434,3.434v51.496c0,1.891,1.546,3.437,3.434,3.437   h16.127v-5.819H21.082V30.459z" /></g></svg>
                                                                            </span>
                                                                        </label> : <label className="header-small-light-bold" style={{ position: 'relative' }}>Quantity: {li.quantity} </label>}
                                                                    </div>
                                                                    <div className="float-left" style={{ width: '30%', padding: '3px 0', border: '1px solid #464f57', borderRadius: 3, textAlign: 'center', opacity: !el.currencyWord || el.currencyWord == "USD" ? 0 : 1 }}>
                                                                        <label className="one-line-ellipsis" style={{ color: '#ef8805', fontFamily: "'Roboto', sans-serif" }}>{el.currencySymbol ? el.currencySymbol : "$"}{li.price ? points.commafy(li.price.toFixed(2)) : 0}</label>
                                                                    </div>
                                                                    {/*
                                                                     // ! Price 
                                                                    */}
                                                                    {(() => {
                                                                        var priceColor = '#ef8805';
                                                                        if (isAfterDate(new Date(parseInt(el.order_date)), new Date('2022-01-01'))) {
                                                                            priceColor = li.payment_status === "paid" ? '#ef8805' : "#ff6b6b";
                                                                        }
                                                                        return (
                                                                            <ButtonWithPopup data={{
                                                                                triggerDOM: <div className="float-left cursor-pointer" style={{ width: '30%', padding: '3px 0', border: '1px solid #464f57', borderRadius: 3, textAlign: 'center' }}>
                                                                                    <label className="one-line-ellipsis" style={{ color: priceColor, fontFamily: "'Roboto', sans-serif" }}>
                                                                                        ${points.commafy(li.convertedPrice ? li.convertedPrice.toFixed(2) : 0)}
                                                                                    </label>
                                                                                </div>,
                                                                                popupPosition: "top center",
                                                                                text: <label className="font-roboto-light"> Estimated converted price to USD </label>,
                                                                                checkORtimesButton: false,
                                                                                onAction: 'hover',
                                                                                style: { minWidth: 'fit-content', borderRadius: 3 },
                                                                                padding: 10
                                                                            }} />
                                                                        )
                                                                    })()}
                                                                    <span className="clear" />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    {(() => {
                                                        let na_status = ["cancelled", "paid", "delivered"];
                                                        if (!na_status.includes(el.order_status) && has_tracking_number) {
                                                            let tns = el.line_items.map((e, i) => {
                                                                return { id: el.ids[i], tracking: e.tracking_number };
                                                            })
                                                            return (
                                                                <div className="text-right" style={{ padding: 10 }}>
                                                                    <Mutation
                                                                        mutation={UPDATE_FUNNEL_ORDERS}
                                                                        variables={{
                                                                            id: currentUser.id,
                                                                            merchant_type: el.merchant_type,
                                                                            country: el.shipping_information.country,
                                                                            orderCreator: el.orderCreator,
                                                                            orderEmail: el.shipping_information.email,
                                                                            tracking_number: JSON.stringify(tns),
                                                                            domains: JSON.stringify(currentUser.funnel_genie_domains),
                                                                            client_tracking: true,
                                                                            sendPLGTrackingEmail: true
                                                                        }} >
                                                                        {(updateMyFunnelOrders, { data, loading, error }) => {
                                                                            return (
                                                                                <Tooltip trigger={
                                                                                    <label className="color-green cursor-pointer" onClick={() => {
                                                                                        if (!loading) {
                                                                                            points.executeMutation(updateMyFunnelOrders, toastr, () => {
                                                                                                points.toastrPrompt(toastr, "success", "Order Status has been sent to " + el.shipping_information.email, "Success");
                                                                                            })
                                                                                        }
                                                                                    }} style={{ textDecoration: "underline" }}>Send Status</label>
                                                                                }>
                                                                                    <div className="text-left">
                                                                                        <label>Resend the tracking ID page to the costumer via Email</label>
                                                                                    </div>
                                                                                </Tooltip>
                                                                            );
                                                                        }}
                                                                    </Mutation>
                                                                </div>
                                                            );
                                                        } else {
                                                            return null;
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                            <div className="column column_3_12 row-separator" style={{ marginTop: 10 }}>
                                                {el.line_items[0].tracking_number &&
                                                    <div className="row-separator display-inline">
                                                        <div className="float-left" style={{ width: '50%' }}>
                                                            <label className="header-small-light-bold one-line-ellipsis">Track your package</label>
                                                        </div>
                                                        <div className="float-left" style={{ width: '50%' }}>
                                                            <div onClick={() => {
                                                                if (el.sync_from == "aramex") {

                                                                    window.open("https://www.aramex.com/us/en/track/results?mode=0&ShipmentNumber=" + el.line_items[0].tracking_number, "_blank")
                                                                } else {
                                                                    window.open("https://tracking.productlistgenie.io/tracking_order/" + el.line_items[0].tracking_number, "_blank");
                                                                }
                                                            }} style={{ padding: '5px 15px', backgroundColor: '#1dd1a1', borderRadius: 20 }}>
                                                                <div className="display-inline cursor-pointer color-white " style={{ margin: '0 auto', width: 'fit-content' }}>
                                                                    <span className="fas fa-shipping-fast" style={{ marginRight: 10 }} />
                                                                    <label className="font-roboto-bold">CLICK HERE</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                <div className="row-separator" style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div className="float-left" style={{ width: '50%' }}>
                                                        <label className="header-small-light-bold one-line-ellipsis">Order Status</label>
                                                    </div>
                                                    {(() => {
                                                        // ! Order status badge

                                                        var isPartiallyPaid = isAfterDate(new Date(parseInt(el.order_date)), new Date('2022-01-01')) && el.line_items.filter(e => e.payment_status === 'paid').length && el.line_items.some(v => ["cancelled", "unpaid"].includes(v.payment_status));
                                                        if (el.paid_cc) {
                                                            var getBGandFontColor = points.getBGandFontColor("paid");
                                                            return (
                                                                <div className="one-line-ellipsis float-left text-center" style={{ width: '50%', padding: '5px 10px', borderRadius: 20, backgroundColor: getBGandFontColor.bg, color: getBGandFontColor.color }}>
                                                                    <label className="font-roboto-bold">{isPartiallyPaid ? 'PARTIALLY PAID' : 'PAID'}</label>
                                                                </div>
                                                            );
                                                        } else {
                                                            var getBGandFontColor = points.getBGandFontColor(isPartiallyPaid ? 'declined' : el.order_status);
                                                            var status = el.order_status ? el.order_status.toUpperCase() : "N/A";
                                                            return (
                                                                <div className="one-line-ellipsis float-left text-center cursor-pointer" style={{ width: '50%', padding: '5px 10px', borderRadius: 20, backgroundColor: getBGandFontColor.bg, color: getBGandFontColor.color }}>
                                                                    {el.cancel_note &&
                                                                        <ButtonWithPopup data={{
                                                                            triggerDOM: <span className="fas fa-info-circle color-white" style={{ fontSize: 14, marginRight: 5 }} />,
                                                                            popupPosition: "top right",
                                                                            text: (
                                                                                <div className="text-left color-black">
                                                                                    <label className="font-roboto-light" style={{ fontSize: '1.2em', display: 'block' }}>Fulfiller Note</label>
                                                                                    <label>{el.cancel_note}</label>
                                                                                </div>
                                                                            ),
                                                                            onAction: 'hover',
                                                                            arrow: true,
                                                                            checkORtimesButton: false,
                                                                            style: { minWidth: 200, borderRadius: 5 },
                                                                            padding: 10
                                                                        }} />
                                                                    }
                                                                    <label className="font-roboto-bold">{isPartiallyPaid ? 'PARTIALLY PAID' : status}</label>
                                                                </div>
                                                            );
                                                        }
                                                    })()}
                                                </div>
                                                <div className="row-separator" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                                                    <div className="float-left" style={{ width: '50%' }}>
                                                        <label className="header-small-light-bold one-line-ellipsis">Fulfillment Status</label>
                                                    </div>
                                                    {(() => {
                                                        var getBGandFontColor = points.getBGandFontColor(el.fulfillment_status);
                                                        var status = el.fulfillment_status ? el.fulfillment_status.toUpperCase() : "N/A";
                                                        return (
                                                            <div className="one-line-ellipsis float-left text-center" style={{ width: '50%', padding: '5px 10px', borderRadius: 20, backgroundColor: getBGandFontColor.bg, color: getBGandFontColor.color }}>
                                                                <label className="font-roboto-bold">{status}</label>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                                <div className="row-separator" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                                                    <div className="float-left" style={{ width: '50%' }}>
                                                        <label className="header-small-light-bold one-line-ellipsis">Risk Level</label>
                                                    </div>
                                                    <div className={"one-line-ellipsis float-left text-center " + (el.risk_level == "normal" ? "btn-success" : el.risk_level == "unavailable" ? "btn-warning" : "btn-danger")} style={{ width: '50%', padding: '5px 10px', borderRadius: 20 }}>
                                                        <label className="font-roboto-bold">{el.risk_level ? el.risk_level.toUpperCase() : "N/A"}</label>
                                                    </div>
                                                </div>
                                                <div className="row-separator" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                                                    <div className="float-left" style={{ width: '50%' }}>
                                                        <label className="header-small-light-bold one-line-ellipsis">Merchant</label>
                                                    </div>
                                                    <div className="one-line-ellipsis float-left text-center" style={{ width: '50%' }}>
                                                        {(() => {
                                                            if (el.paid_cc && el.merchant_type === "plgbutton") {
                                                                return <label className="font-roboto-bold" style={{ color: '#1dd1a1' }}>PLG Button Merchant</label>
                                                            }
                                                            else if (el.paid_cc) {
                                                                return <label className="font-roboto-bold" style={{ color: '#1dd1a1' }}>PLG Merchant</label>
                                                            }
                                                            else {
                                                                var result = this.getMerchantImgURL(el.merchant_type);
                                                                return <label className="font-roboto-bold" style={{ color: result.color }}>{result.text}</label>
                                                            }
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_12_12 display-inline flex-container" style={{ padding: 15, backgroundColor: '#2d3740', borderRadius: 3 }}>
                                                <div className={"column " + (el.order_status_update ? "column_3_12" : "column_6_12") + " display-inline"} style={{ margin: '2px 0' }}>
                                                    <div style={{ backgroundColor: '#21272d', borderRadius: '50%', width: 35, padding: '6px 9px', marginRight: 15 }}>
                                                        <img src="assets/graphics/purchase-shopping-bag.png" width="100%" />
                                                    </div>
                                                    <div>
                                                        <label className="header-small-light-bold">Purchased Date</label>
                                                        {/* <label className="color-white">{el.order_date}</label><br /> */}
                                                        {/* <label className="color-white">{moment(parseInt(el.order_date)).local().format("MMMM DD, YYYY. ddd, h:mm:ss A")}</label><br />
                                                        <label className="color-white">{moment(parseInt(el.order_date)).format("MMMM DD, YYYY. ddd, h:mm:ss A")}</label><br /> */}
                                                        <label className="color-white">{getDate(el.order_date)}</label>
                                                        <label className="color-white" style={{ display: 'none' }}> Converted to local{moment(parseInt(el.order_date)).local().format("MMMM DD, YYYY. ddd, h:mm:ss A")}</label>
                                                        <label className="color-white" style={{ display: 'none' }}>{el.order_date}</label>
                                                        <label className="color-white" style={{ display: 'none' }}>{((parseInt(window.localStorage.getItem("localBrowserDate")) * -1) * 60000)}</label>
                                                        <label className="color-white" style={{ display: 'none' }}>{((parseInt(window.localStorage.getItem("localBrowserDate")) * 1) * 60000)}</label>
                                                        {/* <label className="color-white" style={{display:'none'}}>{parseInt(window.localStorage.getItem("localBrowserDate"))}</label> */}
                                                        {/* <label className="header-small-light-bold">{moment(new Date(parseInt(el.order_date)).toUTCString()).utcOffset(parseInt("-480")).format("MMMM DD, YYYY  ddd, h:mm:ss A")}</label>     //June10 edit */}

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
                                                                <label className="color-white">{getDate(date)}</label>
                                                            </div>
                                                        );
                                                    } else return null;
                                                })()}
                                                <div className="column column_6_12 flex-container display-inline" style={{ justifyContent: 'flex-end' }}>
                                                    {is_fulfill_by_plg && el.merchant_type == "cod" && (el.order_status != "delivered" || el.order_status != "delivered") ?
                                                        <div className="column column_4_12" style={{ margin: '2px 0' }}>
                                                            <button className="color-white stretch-width font-small" onClick={() => {
                                                                const encoded_id = mongoDBId.encode(el.ids[0]), date_now = new Date().toDateString(), saved_date = localStorage.getItem("PLG_ORDER_" + encoded_id);
                                                                const message = "Hi! I would like to know the order update for this order reference id: " + encoded_id;
                                                                if (saved_date && saved_date == date_now) {
                                                                    points.toastrPrompt(toastr, "warning", "You already asked about the update for this order. We will update you ASAP.");
                                                                } else {
                                                                    $zopim.livechat.window.toggle();
                                                                    $zopim.livechat.departments.setVisitorDepartment("COD Orders");
                                                                    $zopim.livechat.say(message);
                                                                    localStorage.setItem("PLG_ORDER_" + encoded_id, new Date().toDateString());
                                                                }
                                                            }} style={{ border: '1px solid #ffffff1f' }}>Questions about this order?</button>
                                                        </div>
                                                        : void 0}
                                                    {el.order_status == "unpaid" || el.order_status == "unfulfilled" || el.order_status == "cancelled" ?
                                                        <div className="column column_4_12" style={{ margin: '2px 0' }}>
                                                            <Mutation mutation={ARCHIVE_FUNNEL_ORDERS} variables={{ id: currentUser.id, orderCreator: el.orderCreator }} >
                                                                {(archiveMyFunnelOrders, { datass, loading, error }) => {
                                                                    return (
                                                                        <ButtonWithPopup data={{
                                                                            triggerDOM: <button id={"archive_" + i} className="color-white stretch-width font-small" style={{ border: '1px solid #ffffff1f' }}>Remove Order</button>,
                                                                            popupPosition: "top center",
                                                                            text: (
                                                                                <label className="font-roboto-light" style={{ fontSize: '1.2em' }}>
                                                                                    Are you sure you want<br />
                                                                                    to remove this order?
                                                                                </label>
                                                                            ),
                                                                            action: () => this.archiveMyFunnelOrders(archiveMyFunnelOrders, refetch),
                                                                            triggerID: "archive_" + i,
                                                                            loading: loading,
                                                                            style: { minWidth: 200 },
                                                                            padding: 10
                                                                        }} />
                                                                    );
                                                                }}
                                                            </Mutation>
                                                        </div>
                                                        : void 0}
                                                    {el.order_status != "cancelled" && el.merchant_type != "cod" ?
                                                        <div className="column column_4_12" style={{ margin: '2px 0' }}>
                                                            <Mutation mutation={CANCEL_FUNNEL_ORDERS} variables={{ id: currentUser.id, orderCreator: el.orderCreator }} >
                                                                {(cancelMyFunnelOrders, { datass, loading, error }) => {
                                                                    return (
                                                                        <ButtonWithPopup data={{
                                                                            triggerDOM: <button id={"cancel_" + i} className="color-white stretch-width font-small" style={{ border: '1px solid #ffffff1f' }}>Cancel Order</button>,
                                                                            popupPosition: "top center",
                                                                            text: (
                                                                                <label className="font-roboto-light" style={{ fontSize: '1.2em' }}>
                                                                                    Are you sure ?
                                                                                </label>
                                                                            ),
                                                                            action: () => this.cancelMyFunnelOrders(cancelMyFunnelOrders, refetch),
                                                                            triggerID: "cancel_" + i,
                                                                            loading: false,
                                                                            style: { minWidth: 200 },
                                                                            padding: 10
                                                                        }} />
                                                                    );
                                                                }}
                                                            </Mutation>
                                                        </div>
                                                        : void 0}
                                                    {el.merchant_type != "cod" || el.fulfill_with_plg == false ? // not cod merchant and cod with not fulfill with plg
                                                        <div className="column column_4_12" style={{ margin: '2px 0' }}>
                                                            <ButtonWithPopup data={{
                                                                triggerDOM: <button id={"tracking_" + i} className="color-white stretch-width font-small" style={{ border: '1px solid #ffffff1f' }}>{el.line_items[0].tracking_number ? "EDIT" : "ADD"} TRACKING NO.</button>,
                                                                popupPosition: "top right",
                                                                text: <div className="text-left">
                                                                    <label className="header-medium-bold one-line-ellipsis">Enter Tracking Number Each Line Item.</label>
                                                                    {el.line_items.map((li, li_i) => {
                                                                        return (
                                                                            <div className="column column_12_12 display-inline" key={li_i} style={{ margin: '5px 0' }}>
                                                                                <div className="column column_4_12 one-line-ellipsis" style={{ padding: 0 }}>
                                                                                    <label title={li.title}>{li.title}</label>
                                                                                </div>
                                                                                <div className="column column_8_12">
                                                                                    <input type="text" defaultValue={li.tracking_number} onBlur={event => {
                                                                                        var trackings = this.state.trackingnumber;
                                                                                        var isFound = false;
                                                                                        for (var i in trackings) {
                                                                                            if (trackings[i].id == el.ids[li_i]) {
                                                                                                if (event.target.value) {
                                                                                                    trackings[i].tracking = event.target.value;
                                                                                                } else {
                                                                                                    trackings.splice(i, 1);
                                                                                                }
                                                                                                isFound = true;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                        if (!isFound) {
                                                                                            trackings.push({
                                                                                                id: el.ids[li_i],
                                                                                                tracking: event.target.value
                                                                                            })
                                                                                        }
                                                                                        this.setState({ trackingnumber: trackings })
                                                                                    }} />
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    <div className="clear">
                                                                        <input type="checkbox" checked={state.sendPLGTrackingEmail} id="send_email" onChange={event => this.setState({ sendPLGTrackingEmail: event.target.checked })} style={{ width: 'fit-content' }} />
                                                                        <label className="cursor-pointer" htmlFor="send_email">Send Tracking Email (PLG)</label>
                                                                    </div>
                                                                    <Mutation
                                                                        mutation={UPDATE_FUNNEL_ORDERS}
                                                                        variables={{
                                                                            id: currentUser.id,
                                                                            merchant_type: el.merchant_type,
                                                                            country: el.shipping_information.country,
                                                                            orderCreator: el.orderCreator,
                                                                            orderEmail: el.shipping_information.email,
                                                                            tracking_number: JSON.stringify(state.trackingnumber),
                                                                            domains: JSON.stringify(currentUser.funnel_genie_domains),
                                                                            client_tracking: true,
                                                                            sendPLGTrackingEmail: state.sendPLGTrackingEmail
                                                                        }} >
                                                                        {(updateMyFunnelOrders, { datass, loading, error }) => {
                                                                            return <button className="btn-success stretch-width" onClick={() => this.updateMyFunnelOrders(updateMyFunnelOrders, refetch)}>SAVE</button>;
                                                                        }}
                                                                    </Mutation>
                                                                </div>,
                                                                action: () => this.saveFunnelGenieCredential(saveFunnelGenieCredential, true),
                                                                triggerID: "tracking_" + i,
                                                                loading: false,
                                                                padding: 5,
                                                                checkORtimesButton: false,
                                                                style: {
                                                                    padding: 10,
                                                                    width: 320
                                                                },
                                                                onClose: () => this.setState({ trackingnumber: [] })
                                                            }} />
                                                        </div>
                                                        : void 0}
                                                </div>
                                            </div>
                                            <span className="clear" />
                                        </div>
                                    );
                                });
                            }}
                        </Query>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(FunnelOrders);