import React from 'react';
import toastr from 'toastr';
import withAuth from '../hoc/withAuth';
import Loading from '../components/loading';
import Pagination from '../components/pagination';
import Modal from '../components/ModalComponent';
import ShowFilter from '../components/showFilter';
import ButtonWithPopup from '../components/buttonWithPopup';
import SelectTag from '../components/selectTag';
import SearchField from '../components/searchField';
import Checkbox from '../components/checkbox';
import Tooltip from '../components/tooltip';
import LoadingPage from '../components/loadingPage';
import moment from 'moment';
import jsPDF from "jspdf";
import { Query, Mutation } from 'react-apollo';
import { GET_TOTAL_FUNNEL_PRODUCTS, GET_FUNNEL_PRODUCTS, SAVE_FUNNEL_PRODUCTS, DELETE_FUNNEL_PRODUCTS, GET_FUNNEL_ORDERS, GET_FUNNEL_ORDER_COST, SAVE_PURCHASE_ORDER, GET_PURCHASE_ORDER, GET_ALL_AFFILIATE, GET_ALL_USERS, SAVE_INVESTMENT, GET_FUNNEL_PRODUCT_DESIGN, DELELETE_DESIGN_OR_GROUP, GET_USER_PROFILE } from '../queries';
import InfiniteCalendar, { Calendar, withRange, } from 'react-infinite-calendar';
import { Helmet } from 'react-helmet';
const points = require('../../Global_Values');
const ShortId = require('id-shorter');
const mongoDBId = ShortId({ isFullId: true });
const CalendarWithRange = withRange(Calendar);
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

const initializeCreateNewProduct = {
    id: "",
    product_name: '',
    product_cost: 0,
    product_srp: 0,
    product_sku: '',
    product_five_percent_duty: 0,
    product_delivery_cost: 0,
    product_fulfillment_cost: 0,
    product_affiliate_email: '',
    product_affiliate_cost: 0,
    product_yabazoo: 0
}

const initializePurchaseOrder = {
    showCreatePo: false,
    isApproved: false,
    payment_terms: "cash",
    affiliate_commision: 0,
    affiliate_email_v2: "",
    affiliate_budget: 0,
    po_price: 0,
    po_quantity: 0,
    po_vendor: '',
    po_ship_to: '',
    po_note: '',
    affiliate_srp: 0,
    affiliate_fulfillment_cost: 0,
    affiliate_delivery_cost: 0,
    affiliate_vat: 0,
    affiliate_yabazoo: 0,
    affiliate_additional_cost: 0,
    warnWhenLow: false,
    po_email_remaining: '',
    confirmationEmail: '',
    po_quantity_remaining: 20,
    product_affiliate_email_auto: '',
    // for transfer
    fromTransferPOID: "",
    transferSearchField: "",
    transferSearchButton: "",
    transferQuantity: 0,
}

const initializeManageAffiliate = {
    showManageAffiliate: false,
    ma_active_tab: "affiliate_list",
    ma_search: "",
    ma_searchBtn: "",
    investment_amount: 0
}

class AdminManageCODorders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCODProduct: 0,
            createProduct: false,
            showDesignList: false,
            currentPageLimit: 50,
            currentPage: 1,
            ...initializeCreateNewProduct,
            ...initializePurchaseOrder,
            ...initializeManageAffiliate,
            searchField: "",
            sortActive: "",
            sortDate: "desc",
            searchButton: "",
            // for query funnel order
            selectedVariantID: "",
            filterByStartDate: "",
            filterByEndDate: "",
            date_filter: "",
            filter_order_status: "",
            totalCodOrder: 0,
            fCurrentPage: 1,
            pdfScriptSrcLoaded: false,
            affiliate_list: [],
            is_page_loading: true
        }
    }

    componentDidMount() {
        toastr.options = {
            "preventDuplicates": true,
            "progressBar": true,
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

        if (this.allProductRefetch) this.allProductRefetch(); // to refresh the page when go back

        // var script = document.createElement('script'), self = this;
        // script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.0/jspdf.umd.min.js";
        // script.onload = () => {
        //     self.setState({ pdfScriptSrcLoaded: true });
        // }
        // document.body.appendChild(script)

        this.setState({ is_page_loading: false });
    }

    downloadAsPDF(shouldResetState, { sendEmail, po_id, affiliate_name }) {
        console.log(shouldResetState, { sendEmail, po_id, affiliate_name })
        var state = this.state, doc = new jsPDF('p', 'mm'), leftIndent = 22, maxWidth = doc.internal.pageSize.width;
        var currentUser = this.props.session.getCurrentUser;
        var c_name = currentUser.firstName + " " + currentUser.lastName;
        var c_email = currentUser.email;
        var poId = po_id ? po_id : state.po_no ? state.po_no : "";
        var dateNow = moment().local().format('MMM DD, YYYY').toString();
        var productName = points.capitalizeWord(state.product_name.substring(0, 23));
        var skuVariantID = state.skuVariantID;
        var productPrice = state.po_price;
        var productQty = state.po_quantity;
        var affiliateName = sendEmail ? affiliate_name : state.affiliate_name_v2 ? state.affiliate_name_v2 : "Not Available";
        var affiliateEmail = state.affiliate_email_v2;
        var paymentTerms = state.payment_terms;
        var totalCost = points.commafy(productPrice * productQty);
        var vendor = "";
        var shipTo = "";
        state.po_vendor ? state.po_vendor.split(",").forEach(v => {
            vendor += v.trim() + "\n"
        }) : void 0;
        vendor = vendor.trim();
        state.po_ship_to ? state.po_ship_to.split(",").forEach(v => {
            shipTo += v.trim() + "\n"
        }) : void 0;
        shipTo = shipTo.trim();

        // doc.addFont('ArialMS', 'Arial', 'bold');
        doc.setFontSize(22);
        // doc.setFontStyle("bold");
        doc.text('Purchase Order', leftIndent, 27);

        doc.setFontSize(10);
        // doc.setFontStyle("normal");
        // doc.setFont('Arial');
        doc.text('P.O. ' + poId + '\n' + dateNow, leftIndent, 33);

        var text = c_name + '\nProduct List Genie\n' + c_email + '\n+1 (289) 700-5359';
        doc.text(text, 190, 27, null, null, 'right');

        doc.text('Vendor:\n' + vendor, leftIndent, 63);

        var text = 'Ship to:\n' + shipTo;
        doc.text(text, 190, 63, null, null, 'right');

        doc.text('Affiliate Name: ' + affiliateName + '\n' + affiliateEmail + '\nPayment Terms: ' + paymentTerms, leftIndent, 100);

        doc.text('          Product                   SKU (Variant ID)                    Cost per item                  Quantity                 Price', leftIndent, 120);

        doc.setLineWidth(1);
        doc.setDrawColor(0);
        doc.line(leftIndent, 125, maxWidth - leftIndent, 125);

        doc.setTextColor('green'); doc.text(productName, leftIndent, 134);
        doc.setTextColor(''); doc.text(skuVariantID + '                           $' + productPrice + '                              ' + productQty + '                    $' + totalCost, (leftIndent + 40), 134);
        doc.setLineWidth(0.3); doc.setDrawColor(150, 150, 150);
        doc.line(leftIndent, 140, maxWidth - leftIndent, 140);

        doc.setFontSize(14);
        // doc.setFontStyle("bold");

        doc.text('Total: $' + totalCost, 190, 150, null, null, 'right');

        if (sendEmail) {
            // pag wala laman state.confirmationEmail sakin mag sesend (nsa server.js)
            const payload = {
                to: state.confirmationEmail, from: "console@plg.com", subject: "PLG Purchase Order",
                text: "Download purchase order pdf",
                html: "Download purchase order pdf",
                atc: [{ path: doc.output('datauristring') }]
            }
            points.customFetch(points.clientUrl + '/send-error-email', 'POST', payload, () => { });
        } else {
            doc.save('PurchaseOrder.pdf');
            if (shouldResetState) {
                var self = this;
                setTimeout(function () {
                    self.setState({ po_no: "", payment_terms: "cash", affiliate_commision: 0, affiliate_name_v2: "", affiliate_email_v2: "", affiliate_budget: 0, po_price: 0, po_quantity: 0 })
                }, 1000);
            }
        }
    }

    presentableFunnelName(fn) {
        return points.capitalizeWord(fn.replace(/-|_/g, " "));
    }

    handleOnChange(event) {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({ [name]: value })
    }

    handleOnKeyUp(event, fn) {
        if (event.keyCode === 13) {
            fn();
        }
    }

    setLoadingTime(tiemout, etimeout) {
        toastr.options.timeOut = tiemout;
        toastr.options.extendedTimeOut = etimeout;
    }

    toggleCreateProduct(data, skuVariantID) {
        if (data) {
            this.setState({
                skuVariantID,
                showCreatePo: false,
                createProduct: !this.state.createProduct,
                id: data.id,
                product_name: data.productName,
                product_cost: data.productCost,
                product_srp: data.productSrp,
                product_sku: data.productSku,
                product_five_percent_duty: data.productFivePercentDuty,
                product_delivery_cost: data.productDeliveryCost,
                product_fulfillment_cost: data.fulfillmentCost,
                product_affiliate_email: data.affiliateEmail,
                product_affiliate_cost: data.affiliateCost,
                product_yabazoo: data.yabazoo,
                // state add PO
                po_price: data.productCost,
                affiliate_srp: data.productSrp,
                affiliate_fulfillment_cost: data.fulfillmentCost,
                affiliate_delivery_cost: data.productDeliveryCost,
                affiliate_vat: data.productFivePercentDuty,
                affiliate_yabazoo: data.yabazoo,
                // affiliate_email_v2: data.affiliateEmail
            })
        } else {
            this.setState({ ...initializeCreateNewProduct, showCreatePo: false, createProduct: !this.state.createProduct })
        }
    }

    toggleDesignList(data) {
        if (data) {
            this.setState({
                showDesignList: !this.state.showDesignList,
                id: data.id
            })
        } else {
            this.setState({ ...initializeCreateNewProduct, showDesignList: !this.state.showDesignList })
        }
    }

    toggleCreatePo() {
        // pre copying el from create product PO
        // this.setState({ ...initializePurchaseOrder, showCreatePo: !this.state.showCreatePo });
        this.setState({ showCreatePo: !this.state.showCreatePo });
    }

    toggleManageAffiliate() {
        this.setState({ ...initializeManageAffiliate, showManageAffiliate: !this.state.showManageAffiliate })
        if (this.state.showManageAffiliate) {
            if (this.refetchAffiliate) this.refetchAffiliate()
        }
    }

    saveFunnelProduct(saveFunnelProduct) {
        this.setLoadingTime(0, 0);
        toastr.info("Loading please wait...", "");
        saveFunnelProduct().then(({ data }) => {
            this.setState({ ...initializeCreateNewProduct });
            this.setLoadingTime(3000, 2000);
            toastr.clear();
            toastr.success("Save Success!");
            this.allProductRefetch();
            this.toggleCreateProduct();
        }).catch(error => {
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "Please Try again!");
        });
    }

    deleteFunnelProduct(deleteFunnelProduct, cb) {
        this.setLoadingTime(0, 0);
        toastr.info("Loading please wait...", "");
        deleteFunnelProduct().then(({ data }) => {
            this.setLoadingTime(3000, 2000);
            toastr.clear();
            toastr.success("Remove Success!");
            this.allProductRefetch();
            if (cb) cb();
        }).catch(error => {
            console.log(error);
            toastr.clear();
            toastr.warning("An error has occurred while performing the action.", "Please Try again!");
        });
    }

    savePurchaseOrder(savePurchaseOrder, action, selector) {
        this.setLoadingTime(0, 0);
        toastr.info("Loading please wait...", "");
        savePurchaseOrder().then(({ data }) => {
            if (action == "create") {
                const obj = { sendEmail: true, po_id: data.savePurchaseOrder.id, affiliate_name: data.savePurchaseOrder.affiliate_name };
                this.downloadAsPDF(null, obj);
                this.setState({ ...initializePurchaseOrder }, () => this.getPurchaseOrderRefetch())
            } else this.getPurchaseOrderRefetch();
            if (selector) document.getElementById(selector).click();
            this.setLoadingTime(3000, 2000);
            toastr.clear();
            toastr.success("Save Success!");
            this.allProductRefetch();
        }).catch(error => {
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "Please Try again!");
        });
    }

    saveInvestment(saveInvestment, selector) {
        this.setLoadingTime(0, 0);
        toastr.info("Loading please wait...", "");
        saveInvestment().then(({ data }) => {
            if (selector) document.getElementById(selector).click();
            this.setState({ investment_amount: 0 })
            this.setLoadingTime(3000, 2000);
            toastr.clear();
            toastr.success("Save Success!");
        }).catch(error => {
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "Please Try again!");
        });
    }

    filterDate(data) {
        if (data.eventType == 3) {
            this.setState({ currentPage: 1, filterByStartDate: data.start.toDateString(), filterByEndDate: data.end.toDateString() })
        }
    }

    exportToCSV() {
        var state = this.state;
        var payload = {
            variantIDS: state.selectedVariantID,
            merchant_type: "cod",
            plgbuttonID: "",
            filterByStartDate: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
            filterByEndDate: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
            skip: state.fCurrentPage - 1,
            limit: state.totalCodOrder * 10,
            export_mode: "csv"
        }
        toastr.clear();
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.info("Exporting please wait...", "");
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
            } else {
                toastr.options.timeOut = 0;
                toastr.options.extendedTimeOut = 0;
                toastr.clear();
                toastr.warning("Error on server", "An error has occurred");
            }
        })
    }

    exportAllProductToCSV() {
        var payload = { search: this.state.searchButton, limit: 0, export: "funnel_products", is_active: this.state.sortActive === "" ? null : this.state.sortActive === "true" ? true : false, sortDate: this.state.sortDate === "" ? null : this.state.sortDate }
        points.toastrPrompt(toastr, "info", "Exporting please wait...");
        points.customFetch("/api/exportDataToCSV", "POST", payload, data => {
            if (data && data.status == "success") {
                points.exportDataToCSV(data.uri);
                points.toastrPrompt(toastr, "success", "Export Success.");
            } else {
                points.toastrPrompt(toastr, "warning", "Export Error.");
            }
        })
    }

    exportAllAffiliateToCSV() {
        const state = this.state;
        const rows = [["Affiliate ID", "First Name", "Last Name", "Email", "Total Funds", "Investment Amount", "Investment Date"]];
        state.affiliate_list.forEach((af, i) => {
            af.investment_list.forEach((il, x) => {
                rows.push([
                    x == 0 ? af.id : "",
                    x == 0 ? af.firstName : "",
                    x == 0 ? af.lastName : "",
                    x == 0 ? af.email : "",
                    x == 0 ? af.investment_total : "",
                    il.amount,
                    moment(new Date(parseInt(il.date))).local().format("MMMM DD, YYYY. ddd, h:mm:ss A")
                ])
            })
        });
        let csvContent = "data:text/csv;charset=utf-8,";
        rows.forEach(function (rowArray) {
            rowArray = rowArray.map(el => {
                return points.serializeExportData(el.toString()).replace(/\,/g, " ");
            })
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });
        points.exportDataToCSV(csvContent);
        points.toastrPrompt(toastr, "success", "Export Success.");
    }

    isFulfiller() {
        var currentUser = this.props.session.getCurrentUser;
        if (currentUser.privilege != 10 && currentUser.access_tags.includes("fulfiller")) { // User Privilege
            return true;
        } else {
            return false;
        }
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Manage COD Products - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const state = this.state;
        if (state.is_page_loading) return <LoadingPage />;
        const isFulfiller = this.isFulfiller();
        const currentUser = this.props.session.getCurrentUser;
        return (
            <div className="admin funnel">
                {this.head()}
                {isFulfiller &&
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .fulfiller td:nth-child(4), .fulfiller td:nth-child(5), .fulfiller td:nth-child(6), .fulfiller td:nth-child(7), .fulfiller td:nth-child(8), .fulfiller td:nth-child(9), .fulfiller td:nth-child(10), .fulfiller td:nth-child(11), .fulfiller td:nth-child(12), .fulfiller td:nth-child(13), .fulfiller td:nth-child(14) {
                            opacity: 0;
                        }
                    `}} />
                }
                <div id="funnel_main_header" className="newPageHeader">
                    <div className="column column_7_12 row-separator">
                        <span className="hide-in-desktop float-left" style={{ padding: 15 }} />
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>Manage COD Products</h4>
                        <label>Total Products: {state.totalCODProduct}</label>
                    </div>
                    <div className="column column_2_12 row-separator">&nbsp;</div>
                    <div className="column column_3_12 row-separator">
                        <button className="btn-success font-roboto-light stretch-width" onClick={() => this.toggleCreateProduct()} style={{ marginLeft: 10 }}>
                            <span className="fas fa-plus" />
                            <span style={{ marginLeft: 5 }}>Add New Product</span>
                        </button>
                    </div>
                    <span className="clear" />
                </div>
                <div className="filter-container" style={{ margin: 10 }}>
                    {(() => {
                        var activeDates = [{ value: "desc", label: "Latest Product" }, { value: "asc", label: "Oldest Product" }].map((actv, i) => {
                            return <option value={actv.value} key={i}>{actv.label}</option>;
                        });
                        return <SelectTag style={{ width: "14rem", marginRight: 10 }} name="filterBydate" value={state.sortDate} options={activeDates} onChange={event => this.setState({ sortDate: event.target.value })} />
                    })()}
                    {(() => {
                        var activeTypes = [{ value: "", label: "Show All" }, { value: "true", label: "Active" }, { value: "false", label: "Inactive" }].map((actv, i) => {
                            return <option value={actv.value} key={i}>{actv.label}</option>;
                        });
                        return <SelectTag style={{ width: "12rem", marginRight: 5 }} name="filterByMerchant" value={state.sortActive} options={activeTypes} onChange={event => this.setState({ sortActive: event.target.value })} />
                    })()}
                    <button className="btn-success stretch-to-mobile" onClick={() => this.exportAllProductToCSV()} style={{ margin: 5 }}>Export All Product to csv</button>
                    <button className="btn-success stretch-to-mobile" onClick={() => this.toggleManageAffiliate()} style={{ margin: 5 }}>Manage Affiliate</button>
                    <SearchField
                        name="searchField"
                        value={state.searchField}
                        placeHolder="Search Product Name"
                        width={210}
                        containerStyle={{ margin: 5 }}
                        containerClassName="stretch-to-mobile"
                        onSubmit={value => this.setState({ searchButton: value, searchField: value })}
                    />
                    <Query query={GET_TOTAL_FUNNEL_PRODUCTS} notifyOnNetworkStatusChange={true} onCompleted={data => this.setState({ totalCODProduct: data.getTotalFunnelProducts.count })}>
                        {({ data, loading, refetch, error }) => {
                            if (loading) return <Pagination displayPageCount={1} totalPage={1} action={page => {
                                toastr.clear();
                                toastr.warning("Please wait page is still loading.");
                            }} style={{ margin: '0 5px' }} />
                            if (error) return <Pagination displayPageCount={1} totalPage={1} action={page => {
                                toastr.clear();
                                toastr.warning("An error has occurred please try again.");
                            }} style={{ margin: '0 5px' }} />
                            if (data.getTotalFunnelProducts.count == 0) return <Pagination displayPageCount={1} totalPage={1} action={page => {
                                toastr.clear();
                                toastr.warning("No data to paginate.");
                            }} style={{ margin: '0 5px' }} />;
                            return <Pagination displayPageCount={state.currentPageLimit} totalPage={data.getTotalFunnelProducts.count} currentPage={state.currentPage} action={page => this.setState({ currentPage: page })} style={{ margin: '0 5px' }} />;
                        }}
                    </Query>
                    <span className="clear" />
                </div>
                {state.currentPage > 1 ?
                    <div style={{ paddingLeft: 10 }}>
                        <div className="flex-container" style={{ justifyContent: 'flex-start' }}>
                            {state.currentPage > 1 &&
                                <ShowFilter label={"Page: " + state.currentPage} onClick={() => this.setState({ currentPage: 1 })} />
                            }
                        </div>
                    </div>
                    : void 0}
                <div className="product-card" style={{ margin: 10 }}>
                    <Query query={
                        GET_FUNNEL_PRODUCTS(`{ id productName productSku productCost productSrp productDeliveryCost productFivePercentDuty fulfillmentCost affiliateEmail affiliateCost yabazoo quantity is_active }`)
                    } variables={{ search: state.searchButton, all_inventory: true, limit: state.currentPageLimit, page: state.currentPage, is_active: state.sortActive === "" ? null : state.sortActive === "true" ? true : false, sortDate: state.sortDate === "" ? null : state.sortDate }}>
                        {({ data, loading, refetch, error }) => {
                            this.allProductRefetch = refetch;
                            if (loading) return <Loading width={200} height={200} />
                            if (error) {
                                return (
                                    <div className="center-vertical-parent" style={{ height: '60vh', width: '100%' }}>
                                        <div className="center-vertical text-center">
                                            <img src="/assets/graphics/no-result.svg" style={{ height: '50vh' }} />
                                            <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! An error has occurred!</h4> <br />
                                            <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>Please try again...</label>
                                        </div>
                                    </div>
                                )
                            }
                            if (data.getFunnelProducts.length == 0) {
                                return (
                                    <div className="center-vertical-parent" style={{ height: '60vh', width: '100%' }}>
                                        <div className="center-vertical text-center">
                                            <img src="/assets/graphics/no-result.svg" style={{ height: '50vh' }} />
                                            <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! No COD Product to display!</h4> <br />
                                            <label className="font-roboto-bold clickable" style={{ fontSize: '0.875em' }} onClick={() => this.toggleCreateProduct()}><span className="fas fa-plus" /> let's create one</label>
                                        </div>
                                    </div>
                                )
                            }
                            return (
                                <div className="table-container">
                                    <table className={"table-list " + (isFulfiller ? "fulfiller" : "")}>
                                        <thead>
                                            <tr>
                                                <th>Active</th>
                                                <th>Variant ID</th>
                                                <th>Product Name</th>
                                                <th>Description</th>
                                                <th>Active Affiliate</th>
                                                <th>Quantity</th>
                                                <th>Cost Per Item</th>
                                                <th>Total Product Cost</th>
                                                <th>Product SRP</th>
                                                <th>Vat</th>
                                                <th>Delivery Cost</th>
                                                <th>Fulfillment Cost</th>
                                                <th>Affiliate Cost</th>
                                                <th>Office</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.getFunnelProducts.map((el, index) => {
                                                var encodeID = mongoDBId.encode(el.id);
                                                var style = {};
                                                if (el.quantity <= 10) style.backgroundColor = "#f4e3dc";
                                                return (
                                                    <tr key={index} style={style}>
                                                        <td>
                                                            <Mutation
                                                                mutation={SAVE_FUNNEL_PRODUCTS}
                                                                variables={{
                                                                    id: el.id,
                                                                    lastEditedByID: currentUser.id,
                                                                    lastEditedByName: currentUser.firstName + " " + currentUser.lastName,
                                                                    is_active: !el.is_active
                                                                }} >
                                                                {(saveFunnelProduct, { data, loading, error }) => {
                                                                    return (
                                                                        <Checkbox
                                                                            id={"checkbox_" + index}
                                                                            checked={el.is_active}
                                                                            disabled={loading}
                                                                            onChange={value => {
                                                                                points.executeMutation(saveFunnelProduct, toastr, () => {
                                                                                    refetch();
                                                                                    points.toastrPrompt(toastr, "success", "Success");
                                                                                });
                                                                            }}
                                                                        />
                                                                    )
                                                                }}
                                                            </Mutation>
                                                        </td>
                                                        <td className="clickable" onClick={() => {
                                                            points.copyStringToClipboard(encodeID);
                                                            toastr.clear();
                                                            toastr.success("ID copied success!");
                                                        }}>{encodeID}</td>
                                                        <td className="clickable" onClick={() => this.setState({ selectedVariantID: encodeID })}>{el.productName}</td>
                                                        <td>{el.productSku}</td>
                                                        <td>{el.affiliateEmail}</td>
                                                        <td>
                                                            {el.affiliateEmail ?
                                                                <ButtonWithPopup data={{
                                                                    triggerDOM: <label className="cursor-pointer">{el.quantity}x</label>,
                                                                    popupPosition: "top center",
                                                                    text: (
                                                                        <div>
                                                                            <h2>Quantity List</h2>
                                                                            <ul className="item-list">
                                                                                <Query query={
                                                                                    GET_PURCHASE_ORDER(`{ affiliate_email remainingQty }`)
                                                                                } variables={{ product_variant_id: encodeID, isApproved: true }}>
                                                                                    {({ data, loading, refetch, error }) => {
                                                                                        if (loading) return <li><Loading width={50} height={50} /></li>
                                                                                        else if (error) return <li className="text-center color-dark-red">An error has occurred</li>
                                                                                        var hasHightLight = false;
                                                                                        return data.getPurchaseOrders.map((po, index) => {
                                                                                            var className = "";
                                                                                            if (!hasHightLight && po.remainingQty != 0) { // highlight only 1
                                                                                                className = " color-green";
                                                                                                hasHightLight = true;
                                                                                            }
                                                                                            // if ((index == 0 && po.remainingQty != 0) || (data.getPurchaseOrders[index-1] && data.getPurchaseOrders[index-1].remainingQty == 0)) className = " color-green";
                                                                                            return (
                                                                                                <li className={"display-inline" + className} key={index}>
                                                                                                    <label className="header-medium-bold" style={{ marginRight: 5 }}>{po.remainingQty}x</label>
                                                                                                    {po.affiliate_email}
                                                                                                </li>
                                                                                            );
                                                                                        })
                                                                                    }}
                                                                                </Query>
                                                                            </ul>
                                                                        </div>
                                                                    ),
                                                                    onAction: 'hover',
                                                                    checkORtimesButton: false,
                                                                    style: { borderRadius: 3, padding: 10 }
                                                                }} />
                                                                : el.quantity + "x"}
                                                        </td>
                                                        <td>${el.productCost}</td>
                                                        <td>${points.commafy((el.productCost * el.quantity).toFixed(2))}</td>
                                                        <td>${el.productSrp}</td>
                                                        <td>{el.productFivePercentDuty}%</td>
                                                        <td>${el.productDeliveryCost}</td>
                                                        <td>${el.fulfillmentCost}</td>
                                                        <td>${el.affiliateCost}</td>
                                                        <td>${el.yabazoo}</td>
                                                        <td style={{ whiteSpace: 'nowrap' }}>
                                                            <ButtonWithPopup data={{
                                                                triggerDOM: <button className="btn-success fas fa-edit" onClick={() => this.toggleCreateProduct(el, encodeID)} />,
                                                                popupPosition: "top right",
                                                                text: <label>Update Product Information</label>,
                                                                onAction: 'hover',
                                                                checkORtimesButton: false,
                                                                arrow: true,
                                                                style: { borderRadius: 3, padding: 10 }
                                                            }} />
                                                            {!isFulfiller &&
                                                                <ButtonWithPopup data={{
                                                                    triggerDOM: <button className="btn-warning fas fa-file-alt" onClick={() => this.toggleDesignList(el)} />,
                                                                    popupPosition: "top right",
                                                                    text: <label>Show Product Design</label>,
                                                                    onAction: 'hover',
                                                                    checkORtimesButton: false,
                                                                    arrow: true,
                                                                    style: { borderRadius: 3, padding: 10 }
                                                                }} />
                                                            }
                                                            {!isFulfiller && currentUser.access_tags.includes('dev') ?
                                                                <Mutation
                                                                    mutation={DELETE_FUNNEL_PRODUCTS}
                                                                    variables={{ id: el.id }} >
                                                                    {(deleteFunnelProduct, { data, loading, error }) => {
                                                                        return (
                                                                            <ButtonWithPopup data={{
                                                                                triggerDOM: (<button id={"remove_" + index} className="btn-danger fas fa-trash" disabled={loading} />),
                                                                                popupPosition: "top right",
                                                                                text: (
                                                                                    <div>
                                                                                        <h4 style={{ fontSize: '1.5em' }}>Are you sure?</h4>
                                                                                        <div className="column column_6_12">
                                                                                            <button className="btn-success stretch-width" onClick={() => this.deleteFunnelProduct(deleteFunnelProduct)}>Yes</button>
                                                                                        </div>
                                                                                        <div className="column column_6_12">
                                                                                            <button className="btn-warning stretch-width" onClick={() => document.getElementById("remove_" + index).click()}>No</button>
                                                                                        </div>
                                                                                    </div>
                                                                                ),
                                                                                arrow: true,
                                                                                style: { borderRadius: 3, padding: 10, minWidth: 250, maxWidth: 250 },
                                                                                checkORtimesButton: false
                                                                            }} />
                                                                        );
                                                                    }}
                                                                </Mutation>
                                                                : void 0}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        }}
                    </Query>
                </div>

                {/* Modals */}
                {state.createProduct &&
                    <Modal open={state.createProduct} closeModal={() => this.toggleCreateProduct()} session={this.props.session} style={{ borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0, width: state.id ? '60%' : '30%' }}>
                        <div className="column_12_12">
                            <style dangerouslySetInnerHTML={{ __html: `.popup-content .content {padding: 0px;}` }} />
                            <div className="modal-header row-separator">
                                <h4 className="header">{state.id ? "Update Product Information" : "Create New Product"}</h4>
                            </div>
                            <div className={"column " + (state.id ? "column_6_12" : "column_12_12")}>
                                <div className="column column_12_12 row-separator">
                                    <label>Product Name</label>
                                    <input type="text" name="product_name" value={state.product_name} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                </div>
                                <div className="column column_12_12 row-separator">
                                    <label>Description</label>
                                    <input type="text" name="product_sku" value={state.product_sku} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                </div>
                                <div className="column column_6_12 row-separator">
                                    <label>Cost Per Item</label>
                                    <div className="input-dollar">
                                        <label>$</label>
                                        <input type="number" name="product_cost" value={state.product_cost} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                </div>
                                <div className="column column_6_12 row-separator">
                                    <label>Product SRP</label>
                                    <div className="input-dollar">
                                        <label>$</label>
                                        <input type="number" name="product_srp" value={state.product_srp} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                </div>
                                <div className="column column_6_12 row-separator">
                                    <label>Vat</label>
                                    <div className="input-dollar">
                                        <label>%</label>
                                        <input type="number" name="product_five_percent_duty" value={state.product_five_percent_duty} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                </div>
                                <div className="column column_6_12 row-separator">
                                    <label>Delivery Cost</label>
                                    <div className="input-dollar">
                                        <label>$</label>
                                        <input type="number" name="product_delivery_cost" value={state.product_delivery_cost} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                </div>
                                <div className="column column_6_12 row-separator">
                                    <label>Fulfillment Cost</label>
                                    <div className="input-dollar">
                                        <label>$</label>
                                        <input type="number" name="product_fulfillment_cost" value={state.product_fulfillment_cost} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                </div>
                                <div className="column column_6_12 row-separator">
                                    <label>Affiliate Email</label>
                                    <input type="text" name="product_affiliate_email" value={state.product_affiliate_email} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                </div>
                                <div className="column column_6_12 row-separator">
                                    <label>Affiliate Cost</label>
                                    <div className="input-dollar">
                                        <label>$</label>
                                        <input type="number" name="product_affiliate_cost" value={state.product_affiliate_cost} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                </div>
                                <div className="column column_6_12 row-separator">
                                    <label>Office</label>
                                    <div className="input-dollar">
                                        <label>$</label>
                                        <input type="number" name="product_yabazoo" value={state.product_yabazoo} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} />
                                    </div>
                                </div>
                                <div className="column column_12_12 row-separator">
                                    {!isFulfiller &&
                                        <Mutation
                                            mutation={SAVE_FUNNEL_PRODUCTS}
                                            variables={{
                                                id: state.id,
                                                lastEditedByID: currentUser.id,
                                                lastEditedByName: currentUser.firstName + " " + currentUser.lastName,
                                                productName: state.product_name,
                                                productCost: parseFloat(state.product_cost),
                                                productSku: state.product_sku,
                                                productSrp: parseFloat(state.product_srp),
                                                productDeliveryCost: parseFloat(state.product_delivery_cost),
                                                productFivePercentDuty: parseFloat(state.product_five_percent_duty),
                                                fulfillmentCost: parseFloat(state.product_fulfillment_cost),
                                                affiliateEmail: state.product_affiliate_email,
                                                affiliateCost: parseFloat(state.product_affiliate_cost),
                                                yabazoo: parseFloat(state.product_yabazoo)
                                            }} >
                                            {(saveFunnelProduct, { data, loading, error }) => {
                                                if (state.showCreatePo) return null;
                                                return <button className="btn-success stretch-width" onClick={() => this.saveFunnelProduct(saveFunnelProduct)} disabled={loading}>SAVE</button>;
                                            }}
                                        </Mutation>
                                    }
                                </div>
                            </div>
                            {state.id &&
                                <div className="column column_6_12">
                                    <div className="product-card" style={{ border: '1px solid #eaeaea', padding: 10, borderRadius: 5, height: '73vh', overflow: 'auto', margin: 0 }}>
                                        <div className="column column_12_12 row-separator display-inline flex-container" style={{ borderBottom: '1px solid #dbe1df', paddingBottom: 10 }}>
                                            {!state.showCreatePo &&
                                                <div className="column column_8_12" style={{ padding: 0 }}>
                                                    <div className="column column_6_12" style={{ padding: 0 }}>
                                                        <button className={"stretch-width cursor-pointer " + (state.isApproved ? "dwobtn-focus" : "")} style={{ padding: 5 }} onClick={() => this.setState({ isApproved: true })}>
                                                            <label style={{ display: 'block' }}>Approved</label>
                                                        </button>
                                                    </div>
                                                    <div className="column column_6_12" style={{ padding: 0 }}>
                                                        <button className={"stretch-width cursor-pointer " + (!state.isApproved ? "dwobtn-focus" : "")} style={{ padding: 5 }} onClick={() => this.setState({ isApproved: false })}>
                                                            <label style={{ display: 'block' }}>Request</label>
                                                        </button>
                                                    </div>
                                                    <span className="clear" />
                                                </div>
                                            }
                                            {state.showCreatePo &&
                                                <div className="column column_8_12">&nbsp;</div>
                                            }
                                            {!isFulfiller &&
                                                <div className="column column_4_12">
                                                    {!state.showCreatePo &&
                                                        <button className="btn-success stretch-width" onClick={() => this.toggleCreatePo()} style={{ padding: 5 }}>
                                                            <div className="display-inline cursor-pointer" style={{ margin: '0 auto', width: 'fit-content' }}>
                                                                <span className="fas fa-plus" style={{ marginRight: 5 }} />
                                                                <label>Add P.O</label>
                                                            </div>
                                                        </button>
                                                    }
                                                    {state.showCreatePo &&
                                                        <button className="btn-danger stretch-width" onClick={() => this.toggleCreatePo()} style={{ padding: 5 }}>
                                                            <div className="display-inline cursor-pointer" style={{ margin: '0 auto', width: 'fit-content' }}>
                                                                <span className="fas fa-times" style={{ marginRight: 5 }} />
                                                                <label>Close</label>
                                                            </div>
                                                        </button>
                                                    }
                                                </div>
                                            }
                                            <span className="clear" />
                                        </div>
                                        {state.showCreatePo &&
                                            <Mutation
                                                mutation={SAVE_PURCHASE_ORDER}
                                                variables={{
                                                    action: 'create',
                                                    product_variant_id: mongoDBId.encode(state.id),
                                                    payment_terms: state.payment_terms,
                                                    affiliate_email: state.affiliate_email_v2,
                                                    affiliate_budget: parseFloat(state.po_price * state.po_quantity),
                                                    affiliate_commision: parseFloat(state.affiliate_commision),
                                                    product_price: parseFloat(state.po_price),
                                                    product_quantity: parseInt(state.po_quantity),
                                                    po_vendor: state.po_vendor,
                                                    po_ship_to: state.po_ship_to,
                                                    po_note: state.po_note,
                                                    product_srp: parseFloat(state.affiliate_srp),
                                                    fulfillment_cost: parseFloat(state.affiliate_fulfillment_cost),
                                                    delivery_cost: parseFloat(state.affiliate_delivery_cost),
                                                    vat: parseFloat(state.affiliate_vat),
                                                    yabazoo: parseFloat(state.affiliate_yabazoo),
                                                    additional_cost: parseFloat(state.affiliate_additional_cost),
                                                    warnWhenLow: state.warnWhenLow,
                                                    warnEmail: state.po_email_remaining,
                                                    warnQty: parseInt(state.po_quantity_remaining),
                                                    confirmationEmail: state.confirmationEmail,
                                                    fromTransferPOID: state.fromTransferPOID,
                                                    receiver_email: state.fromTransferPOID ? this.props.session.getCurrentUser.email : "",
                                                    product_name: state.fromTransferPOID ? state.product_name.replace(/\s/g, "") : ""
                                                }} >
                                                {(savePurchaseOrder, { data, loading, error }) => {
                                                    const shouldDisabled = state.fromTransferPOID ? true : false;
                                                    return (
                                                        <form onSubmit={event => { event.preventDefault(); this.savePurchaseOrder(savePurchaseOrder, 'create'); }}>
                                                            <div className="column column_12_12">
                                                                {state.fromTransferPOID &&
                                                                    <div className="column column_12_12 row-separator notify-label">
                                                                        <label>Check this form if all fields is correct then click continue transfer.</label>
                                                                    </div>
                                                                }
                                                                <div className="column column_6_12 row-separator">
                                                                    <label>Payment Terms</label>
                                                                    {(() => {
                                                                        var options = [<option key={0} value="cash">Cash</option>, <option key={1} value="installment">Installment</option>];
                                                                        return <SelectTag name="payment_terms" value={state.payment_terms} options={options} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />;
                                                                    })()}
                                                                </div>
                                                                <div className="column column_6_12 row-separator">
                                                                    <label>Affiliate Commission</label>
                                                                    <div className="input-dollar">
                                                                        <label>$</label>
                                                                        <input type="number" name="affiliate_commision" value={state.affiliate_commision} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} required min="0" />
                                                                    </div>
                                                                </div>
                                                                <div className="column column_12_12 row-separator">
                                                                    <label>Affiliate Email</label>
                                                                    <input type="email" name="affiliate_email_v2" value={state.affiliate_email_v2} onChange={event => this.handleOnChange(event)} onBlur={() => this.setState({ product_affiliate_email_auto: state.affiliate_email_v2 })} style={{ marginTop: 10, fontSize: '0.875em' }} required disabled={shouldDisabled} />
                                                                    {state.product_affiliate_email_auto &&
                                                                        <Query query={GET_ALL_AFFILIATE} notifyOnNetworkStatusChange={true} variables={{ page: 1, email: state.product_affiliate_email_auto }} onCompleted={data => {
                                                                            const emailSelector = document.querySelector('[name="affiliate_email_v2"]');
                                                                            const budgetSelector = document.querySelector('[name="affiliate_budget"]');
                                                                            if (data.getAllAffiliate.length == 0) {
                                                                                emailSelector.style.border = "1px solid red";
                                                                                this.setState({ affiliate_email_v2: "" }, () => {
                                                                                    this.setLoadingTime(0, 0);
                                                                                    toastr.clear();
                                                                                    toastr.warning("Email is not found in investor list.");
                                                                                })
                                                                            }
                                                                            else {
                                                                                const result = data.getAllAffiliate[0];
                                                                                emailSelector.style.border = "1px solid #dbe1df";
                                                                                budgetSelector.min = 1;
                                                                                budgetSelector.max = result.investment_total;
                                                                                this.setLoadingTime(0, 0);
                                                                                toastr.clear();
                                                                                toastr.options.timeOut = "2000";
                                                                                toastr.success("Affiliate Budget must be minimum of $1 to $" + result.investment_total.toFixed(2));
                                                                            }
                                                                        }}>
                                                                            {({ data, loading, refetch, error }) => {
                                                                                return null;
                                                                            }}
                                                                        </Query>
                                                                    }
                                                                </div>
                                                                <div className="column column_4_12 row-separator">
                                                                    <label>Affiliate Budget</label>
                                                                    <div className="input-dollar">
                                                                        <label>$</label>
                                                                        <input type="number" name="affiliate_budget" value={state.affiliate_budget} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} onBlur={() => {
                                                                            var qty = parseInt(state.affiliate_budget / state.po_price);
                                                                            if (isNaN(qty)) qty = "0";
                                                                            this.setState({ po_quantity: qty.toString() })
                                                                        }} required disabled={shouldDisabled} />
                                                                    </div>
                                                                </div>
                                                                <div className="column column_4_12 row-separator">
                                                                    <label>Cost Per Item</label>
                                                                    <div className="input-dollar">
                                                                        <label>$</label>
                                                                        <input type="number" name="po_price" value={state.po_price} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} onBlur={() => {
                                                                            var qty = parseInt(state.affiliate_budget / state.po_price);
                                                                            if (isNaN(qty)) qty = "0";
                                                                            this.setState({ po_quantity: qty.toString() })
                                                                        }} required disabled={shouldDisabled} />
                                                                    </div>
                                                                </div>
                                                                <div className="column column_4_12 row-separator">
                                                                    <label>Quantity</label>
                                                                    <input type="number" name="po_quantity" value={state.po_quantity} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} required min="1" disabled={shouldDisabled} />
                                                                </div>
                                                                <div className="column column_4_12 row-separator">
                                                                    <label>SRP</label>
                                                                    <div className="input-dollar">
                                                                        <label>$</label>
                                                                        <input type="number" name="affiliate_srp" value={state.affiliate_srp} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} required />
                                                                    </div>
                                                                </div>
                                                                <div className="column column_4_12 row-separator">
                                                                    <label>Fulfillment Cost</label>
                                                                    <div className="input-dollar">
                                                                        <label>$</label>
                                                                        <input type="number" name="affiliate_fulfillment_cost" value={state.affiliate_fulfillment_cost} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} required />
                                                                    </div>
                                                                </div>
                                                                <div className="column column_4_12 row-separator">
                                                                    <label>Delivery Cost</label>
                                                                    <div className="input-dollar">
                                                                        <label>$</label>
                                                                        <input type="number" name="affiliate_delivery_cost" value={state.affiliate_delivery_cost} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} required />
                                                                    </div>
                                                                </div>
                                                                <div className="column column_4_12 row-separator">
                                                                    <label>Vat</label>
                                                                    <div className="input-dollar">
                                                                        <label>%</label>
                                                                        <input type="number" name="affiliate_vat" value={state.affiliate_vat} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} required />
                                                                    </div>
                                                                </div>
                                                                <div className="column column_4_12 row-separator">
                                                                    <label>Office</label>
                                                                    <div className="input-dollar">
                                                                        <label>$</label>
                                                                        <input type="number" name="affiliate_yabazoo" value={state.affiliate_yabazoo} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} required />
                                                                    </div>
                                                                </div>
                                                                <div className="column column_4_12 row-separator">
                                                                    <label>Additional Cost</label>
                                                                    <div className="input-dollar">
                                                                        <label>$</label>
                                                                        <input type="number" name="affiliate_additional_cost" value={state.affiliate_additional_cost} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} required />
                                                                    </div>
                                                                </div>

                                                                <div className="column column_12_12 row-separator">
                                                                    <label>Warn when inventory runs low</label>
                                                                    <div className="display-inline flex-container">
                                                                        <div className="column column_1_12">
                                                                            <Checkbox id="warnWhenLow" checked={state.warnWhenLow} onChange={value => this.setState({ warnWhenLow: value })} />
                                                                            {/* <input className="cursor-pointer" type="checkbox" onChange={event => this.setState({ warnWhenLow: event.target.checked })} checked={state.warnWhenLow} style={{marginTop: 10}} /> */}
                                                                        </div>
                                                                        <div className="column column_7_12">
                                                                            <input type="email" name="po_email_remaining" value={state.po_email_remaining} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} placeholder="Email Address" />
                                                                        </div>
                                                                        <div className="column column_4_12">
                                                                            <input type="number" name="po_quantity_remaining" value={state.po_quantity_remaining} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} placeholder="Quantity" />
                                                                        </div>
                                                                        <span className="clear" />
                                                                    </div>
                                                                </div>

                                                                <div className="column column_6_12 row-separator">
                                                                    <label>Vendor Address</label>
                                                                    <textarea rows="4" className="message-area stretch-width font-small" value={state.po_vendor} name="po_vendor" onChange={event => this.handleOnChange(event)} placeholder={"Format: First Name Last Name, Email or Phone Number"} required />
                                                                </div>
                                                                <div className="column column_6_12 row-separator">
                                                                    <label>Ship to Address</label>
                                                                    <textarea rows="4" className="message-area stretch-width font-small" value={state.po_ship_to} name="po_ship_to" onChange={event => this.handleOnChange(event)} placeholder={"Format: Warehouse Name, Street Addres, State, City, Country, Phone Number"} required />
                                                                </div>
                                                                <div className="column column_12_12 row-separator">
                                                                    <label>Warehouse Confirmation Email</label>
                                                                    <input type="test" name="confirmationEmail" value={state.confirmationEmail} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10, fontSize: '0.875em' }} placeholder="Email Address" />
                                                                </div>
                                                                <div className="column column_12_12 row-separator">
                                                                    <label>Notes</label>
                                                                    <textarea rows="3" className="message-area stretch-width font-small" value={state.po_note} name="po_note" onChange={event => this.handleOnChange(event)} />
                                                                </div>
                                                                <div className="column column_12_12 row-separator">
                                                                    <button type="submit" className="btn-success stretch-width row-separator" disabled={loading}>{state.fromTransferPOID ? "Continue Transfer" : "Request Purchase Order"}</button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    );
                                                }}
                                            </Mutation>
                                        }
                                        {!state.showCreatePo &&
                                            <div className="column column_12_12">
                                                <Query query={
                                                    GET_PURCHASE_ORDER(`{ po_no po_date received_date affiliate_email affiliate_budget product_price totalQty affiliate_commision isApproved payment_terms affiliate_name vendor_info ship_to_info note warnWhenLow warnEmail warnQty remainingQty additional_cost }`)
                                                } variables={{ product_variant_id: mongoDBId.encode(state.id), isApproved: state.isApproved }}>
                                                    {({ data, loading, refetch, error }) => {
                                                        this.getPurchaseOrderRefetch = refetch;
                                                        if (loading || error) return null;
                                                        if (data.getPurchaseOrders.length == 0) {
                                                            return (
                                                                <div className="row-separator" style={{ border: '1px solid #eaeaea', padding: 10, borderRadius: 5 }}>
                                                                    <label>No {state.isApproved ? "Approved" : "Request"} Purchase Order Found.</label>
                                                                </div>
                                                            );
                                                        };
                                                        var hasHightLight = false;
                                                        return data.getPurchaseOrders.map((el, index) => {
                                                            var borderColor = '#eaeaea';
                                                            if (!hasHightLight && state.isApproved && el.remainingQty != 0) { // highlight only 1
                                                                borderColor = '#27c686';
                                                                hasHightLight = true;
                                                            }
                                                            // if (state.isApproved && (index == 0 && el.remainingQty != 0) || (data.getPurchaseOrders[index-1] && data.getPurchaseOrders[index-1].remainingQty == 0)) borderColor = '#27c686';
                                                            // kapag ang una ay hindi zero ang remaining quantity or ung previous remaining quantity ay equal zero then change the border color of this loop
                                                            return (
                                                                <div className="row-separator display-inline flex-container" style={{ border: '1px solid ' + borderColor, padding: 10, borderRadius: 5 }} key={index}>
                                                                    <div className={"column column_12_12 one-line-ellipsis"}>
                                                                        {state.isApproved ?
                                                                            <label><span className="font-roboto-bold">Accepted Date:</span> {moment(new Date(parseInt(el.received_date))).local().format('MMM DD, YYYY. ddd, h:mm:ss A')}</label>
                                                                            :
                                                                            <label><span className="font-roboto-bold">Request Date:</span> {moment(new Date(parseInt(el.po_date))).local().format('MMM DD, YYYY. ddd, h:mm:ss A')}</label>
                                                                        }
                                                                    </div>
                                                                    <div className={"column column_9_12 one-line-ellipsis"}>
                                                                        <label>
                                                                            {el.affiliate_email} <br />
                                                                            Budget: {"$" + el.affiliate_budget} <br />
                                                                            Cost per item: ${el.product_price} <br />
                                                                            Quantity: {el.totalQty} <br />
                                                                            Remaining Quantity: {el.remainingQty} <br />
                                                                            Affiliate Cost: ${el.affiliate_commision} <br />
                                                                            Low inventory warning: <br />
                                                                            {el.warnEmail ?
                                                                                <span className="clickable" onClick={() => {
                                                                                    points.copyStringToClipboard(el.warnEmail);
                                                                                    toastr.clear();
                                                                                    toastr.success("Email has beed copied!");
                                                                                }}>{el.warnEmail}</span>
                                                                                : "N/A"}
                                                                        </label>
                                                                    </div>
                                                                    {el.isApproved &&
                                                                        <div className="column column_3_12">
                                                                            <button className="btn-success stretch-width cursor-pointer" style={{ padding: 3, margin: '2px 0' }} onClick={() => {
                                                                                this.setState({
                                                                                    po_no: el.po_no,
                                                                                    payment_terms: el.payment_terms,
                                                                                    affiliate_commision: el.affiliate_commision,
                                                                                    affiliate_name_v2: el.affiliate_name,
                                                                                    affiliate_email_v2: el.affiliate_email,
                                                                                    affiliate_budget: el.affiliate_budget,
                                                                                    po_price: el.product_price,
                                                                                    po_quantity: el.totalQty,
                                                                                    po_vendor: el.vendor_info,
                                                                                    po_ship_to: el.ship_to_info
                                                                                }, () => {
                                                                                    this.downloadAsPDF(true, { sendEmail: false })
                                                                                })
                                                                            }}>
                                                                                <label style={{ display: 'block', fontSize: '0.7em' }}>Redownload PDF</label>
                                                                            </button>
                                                                            {!isFulfiller &&
                                                                                <ButtonWithPopup data={{
                                                                                    triggerDOM: (
                                                                                        <button className="btn-warning stretch-width cursor-pointer" style={{ padding: 3, margin: '2px 0' }}>
                                                                                            <label style={{ display: 'block', fontSize: '0.7em' }}>Transfer to</label>
                                                                                        </button>
                                                                                    ),
                                                                                    popupPosition: "left top",
                                                                                    text: (
                                                                                        <div>
                                                                                            <div className="group-input-button row-separator">
                                                                                                <input type="text" name="transferSearchField" placeholder="Search Product Name" value={state.transferSearchField} onChange={event => this.handleOnChange(event)} onKeyUp={event => points.enterToProceed(event, () => this.setState({ transferSearchButton: state.transferSearchField }))} />
                                                                                                <button className="fas fa-search" onClick={() => this.setState({ transferSearchButton: state.transferSearchField })} />
                                                                                            </div>
                                                                                            <div className="row-separator display-inline">
                                                                                                <div className="column column_8_12 text-left" style={{ padding: 0 }}>
                                                                                                    <label>Transfer Quantity:</label>
                                                                                                </div>
                                                                                                <div className="column column_4_12" style={{ padding: 0 }}>
                                                                                                    <input type="number" name="transferQuantity" value={state.transferQuantity} onChange={event => this.handleOnChange(event)} onKeyUp={() => {
                                                                                                        if (state.transferQuantity == "0") this.setState({ transferQuantity: "" })
                                                                                                        else if (state.transferQuantity > el.remainingQty) {
                                                                                                            points.toastrPrompt(toastr, "warning", "Cannot exceed the remaining quantity.");
                                                                                                            this.setState({ transferQuantity: "" })
                                                                                                        }
                                                                                                    }} />
                                                                                                </div>
                                                                                                <span className="clear" />
                                                                                            </div>
                                                                                            <ul className="item-list">
                                                                                                {state.transferQuantity ?
                                                                                                    <Query query={
                                                                                                        GET_FUNNEL_PRODUCTS(`{ id productName productSku fulfillmentCost productCost productSrp productDeliveryCost productFivePercentDuty yabazoo affiliateEmail affiliateCost }`)
                                                                                                    } variables={{ search: state.transferSearchButton, limit: 7 }}>
                                                                                                        {({ data, loading, refetch, error }) => {
                                                                                                            if (loading) return <li><Loading width={50} height={50} /></li>;
                                                                                                            if (error) return <li>An error has occurred please try again.</li>;
                                                                                                            if (data.getFunnelProducts.length == 0) return <li>No Result Found.</li>;
                                                                                                            return data.getFunnelProducts.map((po_data, index) => {
                                                                                                                return <li className="one-line-ellipsis" onClick={() => {
                                                                                                                    const remainingBudget = el.remainingQty * el.product_price;
                                                                                                                    const totalBudget = state.transferQuantity * po_data.productCost;
                                                                                                                    if (totalBudget > remainingBudget) {
                                                                                                                        points.toastrPrompt(toastr, "warning", "The computed budget for the transfer is exceeding the remaining budget for this purchase order. please create manualy if you still want to proceed");
                                                                                                                    } else {
                                                                                                                        this.setState({
                                                                                                                            fromTransferPOID: el.po_no,
                                                                                                                            affiliate_commision: el.affiliate_commision,
                                                                                                                            affiliate_email_v2: el.affiliate_email,
                                                                                                                            affiliate_budget: totalBudget.toFixed(2),
                                                                                                                            po_price: po_data.productCost,
                                                                                                                            po_quantity: state.transferQuantity,
                                                                                                                            affiliate_srp: po_data.productSrp,
                                                                                                                            affiliate_fulfillment_cost: po_data.fulfillmentCost,
                                                                                                                            affiliate_delivery_cost: po_data.productDeliveryCost,
                                                                                                                            affiliate_vat: po_data.productFivePercentDuty,
                                                                                                                            affiliate_yabazoo: po_data.yabazoo,
                                                                                                                            affiliate_additional_cost: el.additional_cost,
                                                                                                                            warnWhenLow: el.warnWhenLow,
                                                                                                                            po_email_remaining: el.warnEmail,
                                                                                                                            po_quantity_remaining: el.warnQty,
                                                                                                                            po_vendor: el.vendor_info || '',
                                                                                                                            po_ship_to: el.ship_to_info || '',
                                                                                                                            po_note: el.note || '',
                                                                                                                            // for changing the view of selected
                                                                                                                            id: po_data.id,
                                                                                                                            product_name: po_data.productName,
                                                                                                                            product_cost: po_data.productCost,
                                                                                                                            product_srp: po_data.productSrp,
                                                                                                                            product_sku: po_data.productSku,
                                                                                                                            product_five_percent_duty: po_data.productFivePercentDuty,
                                                                                                                            product_delivery_cost: po_data.productDeliveryCost,
                                                                                                                            product_fulfillment_cost: po_data.fulfillmentCost,
                                                                                                                            product_affiliate_email: po_data.affiliateEmail,
                                                                                                                            product_affiliate_cost: po_data.affiliateCost,
                                                                                                                            product_yabazoo: po_data.yabazoo,
                                                                                                                            // for view manipulation


                                                                                                                            showCreatePo: true
                                                                                                                        })
                                                                                                                    }
                                                                                                                }} key={index}>{po_data.productName} - {po_data.productSku}</li>
                                                                                                            })
                                                                                                        }}
                                                                                                    </Query>
                                                                                                    :
                                                                                                    <li>Please Enter Transfer Quantity First</li>
                                                                                                }
                                                                                            </ul>
                                                                                        </div>
                                                                                    ),
                                                                                    checkORtimesButton: false,
                                                                                    arrow: true,
                                                                                    style: { borderRadius: 3, padding: 10, maxWidth: 150 }
                                                                                }} />
                                                                            }
                                                                        </div>
                                                                    }
                                                                    {!el.isApproved &&
                                                                        <div className="column column_3_12">
                                                                            <Mutation mutation={SAVE_PURCHASE_ORDER} variables={{ id: el.po_no, action: 'denied' }} >
                                                                                {(savePurchaseOrder, { data, loading, error }) => {
                                                                                    return (
                                                                                        <ButtonWithPopup data={{
                                                                                            triggerDOM: (
                                                                                                <button id={"denied_" + index} className="btn-danger stretch-width cursor-pointer" style={{ padding: 2, margin: '2px 0' }}>
                                                                                                    <label style={{ display: 'block' }}>Deny</label>
                                                                                                </button>
                                                                                            ),
                                                                                            popupPosition: "left top",
                                                                                            text: (
                                                                                                <div>
                                                                                                    <h4 style={{ fontSize: '1.1em' }}>Are you sure?</h4>
                                                                                                    <div className="column column_6_12">
                                                                                                        <button className="btn-success stretch-width" style={{ padding: 0 }} onClick={() => this.savePurchaseOrder(savePurchaseOrder, null, "denied_" + index)} disabled={loading}>Yes</button>
                                                                                                    </div>
                                                                                                    <div className="column column_6_12">
                                                                                                        <button className="btn-warning stretch-width" style={{ padding: 0 }} onClick={() => document.getElementById("denied_" + index).click()}>No</button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ),
                                                                                            arrow: true,
                                                                                            style: { borderRadius: 3, padding: 10, minWidth: 250, maxWidth: 250 },
                                                                                            checkORtimesButton: false
                                                                                        }} />
                                                                                    );
                                                                                }}
                                                                            </Mutation>
                                                                            <Mutation
                                                                                mutation={SAVE_PURCHASE_ORDER}
                                                                                variables={{
                                                                                    id: el.po_no,
                                                                                    action: 'accept',
                                                                                    receiver_email: this.props.session.getCurrentUser.email,
                                                                                    product_name: state.product_name.replace(/\s|_/g, "") + "_" + el.po_no + "_"
                                                                                }} >
                                                                                {(savePurchaseOrder, { data, loading, error }) => {
                                                                                    return (
                                                                                        <ButtonWithPopup data={{
                                                                                            triggerDOM: (
                                                                                                <button id={"accept_" + index} className="btn-success stretch-width cursor-pointer" style={{ padding: 2, margin: '2px 0' }}>
                                                                                                    <label style={{ display: 'block' }}>Accept</label>
                                                                                                </button>
                                                                                            ),
                                                                                            popupPosition: "left top",
                                                                                            text: (
                                                                                                <div>
                                                                                                    <h4 style={{ fontSize: '1.1em' }}>Are you sure?</h4>
                                                                                                    <div className="column column_6_12">
                                                                                                        <button className="btn-success stretch-width" style={{ padding: 0 }} onClick={() => this.savePurchaseOrder(savePurchaseOrder, null, "accept_" + index)} disabled={loading}>Yes</button>
                                                                                                    </div>
                                                                                                    <div className="column column_6_12">
                                                                                                        <button className="btn-warning stretch-width" style={{ padding: 0 }} onClick={() => document.getElementById("accept_" + index).click()}>No</button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ),
                                                                                            arrow: true,
                                                                                            style: { borderRadius: 3, padding: 10, minWidth: 250, maxWidth: 250 },
                                                                                            checkORtimesButton: false
                                                                                        }} />
                                                                                    );
                                                                                }}
                                                                            </Mutation>
                                                                            <button className="btn-success stretch-width cursor-pointer" style={{ padding: 3, margin: '2px 0' }} onClick={() => {
                                                                                this.setState({
                                                                                    po_no: el.po_no,
                                                                                    payment_terms: el.payment_terms,
                                                                                    affiliate_commision: el.affiliate_commision,
                                                                                    affiliate_name_v2: el.affiliate_name,
                                                                                    affiliate_email_v2: el.affiliate_email,
                                                                                    affiliate_budget: el.affiliate_budget,
                                                                                    po_price: el.product_price,
                                                                                    po_quantity: el.totalQty,
                                                                                    po_vendor: el.vendor_info,
                                                                                    po_ship_to: el.ship_to_info
                                                                                }, () => {
                                                                                    this.downloadAsPDF(true, { sendEmail: false })
                                                                                })
                                                                            }}>
                                                                                <label style={{ display: 'block', fontSize: '0.7em' }}>Download PDF</label>
                                                                            </button>
                                                                        </div>
                                                                    }
                                                                    <span className="clear" />
                                                                </div>
                                                            );
                                                        })
                                                    }}
                                                </Query>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </Modal>
                }

                {/* Modal for showing design list */}
                {state.showDesignList &&
                    <Modal open={state.showDesignList} closeModal={() => this.toggleDesignList()} session={this.props.session} style={{ borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0, width: '50%' }}>
                        <div className="column_12_12">
                            <style dangerouslySetInnerHTML={{ __html: `.popup-content .content {padding: 0px;}` }} />
                            <div className="modal-header row-separator">
                                <h4 className="header">Product Design List</h4>
                            </div>
                            <div className="page-container">
                                {/* <Query query={GET_FUNNEL_PRODUCTS(`{ funnelDesign }`)} variables={{ id: mongoDBId.encode(state.id), limit: 1, page: 1 }}>
                                    {({ data, loading, refetch, error }) => {
                                        if(loading) return <Loading width={100} height={100} />;
                                        if(error) return <h4 className="text-center">An error has occurred please try again.</h4>;
                                        if(data.getFunnelProducts[0].funnelDesign.length == 0) return <div className="text-center"> <label>Product design not found</label> </div>;
                                        return data.getFunnelProducts[0].funnelDesign.map((design, index) => {
                                            var parseDesign = JSON.parse(design);
                                            return (
                                                <div className="product-card" key={index}>
                                                    <div className="product-details display-inline">
                                                        <div className="column one-line-ellipsis" style={{width: '70%'}}>
                                                            <label>Path: {parseDesign.path ? parseDesign.path : "Homepage"}</label> <br />
                                                            <label>Type: {this.presentableFunnelName(parseDesign.page_type)}</label>
                                                        </div>
                                                        <div className="column text-right" style={{width: '30%'}}>
                                                            <Mutation
                                                                mutation={DELETE_FUNNEL_PRODUCTS}
                                                                variables={{ id: state.id, funnelDesign: design }} >
                                                                {(deleteFunnelProduct, { data, loading, error }) => {
                                                                    return (
                                                                        <ButtonWithPopup data={{
                                                                            triggerDOM: <button id={"remove" + index} className="btn-danger fas fa-trash" style={{ padding: '5px 10px', fontSize: '0.7em', margin: '0 2px' }} disabled={loading} />,
                                                                            triggerID: "remove"+index,
                                                                            popupPosition: "top right",
                                                                            text: <label>Are you sure?</label>,
                                                                            action: () => this.deleteFunnelProduct(deleteFunnelProduct, () => refetch()),
                                                                            arrow: true,
                                                                            padding: 10,
                                                                            style: { borderRadius: 3, padding: 10, minWidth: 200, maxWidth: 200 }
                                                                        }} />
                                                                    );
                                                                }}
                                                            </Mutation>
                                                        </div>
                                                        <span className="clear" />
                                                    </div>
                                                </div>
                                            );
                                        });
                                    }}
                                </Query>
                                <hr /> */}
                                <Query query={GET_FUNNEL_PRODUCT_DESIGN(` { id product_id design_name design_list { id path page_type design_string_object upload_by } created_by } `)} variables={{ product_id: state.id }}>
                                    {({ data, loading, refetch, error }) => {
                                        if (loading) return <Loading width={200} height={200} />;
                                        else if (error) return <div className="product-card product-details text-center">An error has occured!</div>;
                                        else if (data.getFunnelProductDesign.length == 0) return <div className="product-card product-details text-center">No Group Design Found!</div>;
                                        return data.getFunnelProductDesign.map((design, i) => {
                                            var encoded_id = mongoDBId.encode(design.id);
                                            return (
                                                <div className={"column " + (data.getFunnelProductDesign.length <= 1 ? "column_12_12" : "column_6_12")} key={i}>
                                                    <div className="product-card product-details" key={i}>
                                                        <h3 className="one-line-ellipsis" title={"Created By: " + design.created_by} title={"ID: " + encoded_id}>
                                                            <span className="fas fa-copy color-green cursor-pointer" onClick={() => {
                                                                points.copyStringToClipboard(encoded_id);
                                                                toastr.clear();
                                                                toastr.success("Group ID has been copied.");
                                                            }} title="Copy Group ID" style={{ fontSize: '0.9em', marginRight: 10 }} />
                                                            {design.design_name}
                                                            <Mutation mutation={DELELETE_DESIGN_OR_GROUP} variables={{ id: design.id }} >
                                                                {(deleteDesignOrGroup, { data, loading, error }) => {
                                                                    return (
                                                                        <ButtonWithPopup data={{
                                                                            triggerID: "remove_group" + i,
                                                                            triggerDOM: <span id={"remove_group" + i} className="fas fa-times color-dark-red cursor-pointer float-right" style={{ fontSize: '0.9em' }} />,
                                                                            popupPosition: "left center",
                                                                            text: (
                                                                                <div style={{ padding: 10 }}>
                                                                                    <div className="row-separator text-center">
                                                                                        <label style={{ display: 'block' }}>Remove this design group?</label>
                                                                                        <label style={{ fontSize: '0.6em' }}>(this will remove all design in this group)</label>
                                                                                    </div>
                                                                                </div>
                                                                            ),
                                                                            action: () => points.executeMutation(deleteDesignOrGroup, toastr, () => {
                                                                                refetch();
                                                                                this.setLoadingTime(3000, 2000);
                                                                                toastr.clear();
                                                                                toastr.success("Group Design has been removed.");
                                                                            }),
                                                                            loading: loading, arrow: true
                                                                        }} />
                                                                    );
                                                                }}
                                                            </Mutation>
                                                        </h3>
                                                        <ul className="item-list" style={{ marginLeft: 15 }}>
                                                            {(() => {
                                                                if (design.design_list.length != 0) {
                                                                    return design.design_list.map((des, x) => {
                                                                        console.log(des);
                                                                        return (
                                                                            <li className="display-inline" style={{ cursor: 'unset', backgroundColor: 'inherit', color: '#4a4a4a' }} title={"Uploaded By: " + des.upload_by} key={x}>
                                                                                <div className="column" style={{ width: '80%' }}>
                                                                                    <label style={{ display: 'block' }}>Path: {des.path ? des.path : "homepage"}</label>
                                                                                    <label style={{ display: 'block' }}>Type: {des.page_type}</label>
                                                                                </div>
                                                                                <div className="column text-right" style={{ width: '20%' }}>
                                                                                    <Mutation mutation={DELELETE_DESIGN_OR_GROUP} variables={{ id: design.id, design_id: des.id }} >
                                                                                        {(deleteDesignOrGroup, { data, loading, error }) => {
                                                                                            return (
                                                                                                <ButtonWithPopup data={{
                                                                                                    triggerID: i + "remove_design" + x,
                                                                                                    triggerDOM: <button id={i + "remove_design" + x} className="btn-danger fas fa-trash" style={{ padding: '5px 10px', fontSize: '0.7em', margin: '0 2px' }} />,
                                                                                                    popupPosition: "left center",
                                                                                                    text: <label>Remove this design?</label>,
                                                                                                    action: () => points.executeMutation(deleteDesignOrGroup, toastr, () => {
                                                                                                        refetch();
                                                                                                        this.setLoadingTime(3000, 2000);
                                                                                                        toastr.clear();
                                                                                                        toastr.success("Design has been removed.");
                                                                                                    }),
                                                                                                    loading: loading, padding: 10, style: { minWidth: 150, maxWidth: 150 }, arrow: true
                                                                                                }} />
                                                                                            );
                                                                                        }}
                                                                                    </Mutation>
                                                                                </div>
                                                                                <span className="clear" />
                                                                            </li>
                                                                        );
                                                                    });
                                                                } else {
                                                                    return <li className="display-inline" style={{ cursor: 'unset', backgroundColor: 'inherit', color: '#4a4a4a' }}>No Design Found!</li>;
                                                                }
                                                            })()}
                                                        </ul>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    }}
                                </Query>
                            </div>
                        </div>
                    </Modal>
                }

                {/* Cod Product Statistic */}
                {state.selectedVariantID &&
                    <Modal open={state.selectedVariantID ? true : false} closeModal={() => this.setState({ selectedVariantID: "", date_filter: "", filter_order_statu: "", fCurrentPage: 1 })} session={this.props.session} style={{ borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0, width: '70%' }}>
                        <div className="column_12_12">
                            <style dangerouslySetInnerHTML={{ __html: `.popup-content .content {padding: 0px;}` }} />
                            <div className="modal-header row-separator">
                                <h4 className="header">COD Product Statistic</h4>
                                <label style={{ color: '#878787' }}>Total COD Product Order: <span className="font-bold" style={{ color: '#23c78a' }}>{state.totalCodOrder}</span></label>
                            </div>
                            <div className="page-container">
                                <div className="filter-container">
                                    {!isFulfiller && state.totalCodOrder != 0 ?
                                        <button className="btn-success stretch-to-mobile" style={{ padding: '8px 15px', margin: '0px 5px' }} onClick={() => this.exportToCSV()}>Export to csv</button>
                                        : void 0}
                                    {(() => {
                                        var orderStatusOptions = points.list_of_order_status.map((status, i) => {
                                            return <option value={status.value} key={i}>{status.label}</option>;
                                        });
                                        return <SelectTag className="stretch-to-mobile" name="filter_order_status" value={state.filter_order_status} options={orderStatusOptions} onChange={event => this.setState({ filter_order_status: event.target.value })} style={{ width: 200, marginLeft: 10 }} />;
                                    })()}
                                    {state.date_filter == "custom" &&
                                        <ButtonWithPopup data={{
                                            triggerDOM: <div className="stretch-to-mobile custom-select" style={{ margin: '0 5px' }}>
                                                <div className="select-selected stretch-width text-left">Date</div>
                                            </div>,
                                            popupPosition: "left top",
                                            text: <div className="infinite-calendar">
                                                <InfiniteCalendar
                                                    Component={CalendarWithRange}
                                                    width={300}
                                                    height={350}
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
                                            style: { maxWidth: 300 },
                                            checkORtimesButton: false
                                        }} />
                                    }
                                    {(() => {
                                        var options = points.list_of_date_filter(true, "All Time").map((dates, i) => {
                                            return <option value={dates.value} key={i}>{dates.label}</option>;
                                        });
                                        return <SelectTag icon={"fas fa-calendar-alt"} name="date_filter" value={state.date_filter} options={options} onChange={event => this.setState({
                                            date_filter: event.target.value,
                                            filterByStartDate: event.target.value != "custom" ? moment(points.getPastDate(event.target.value, true)).local().format('MMM DD YYYY').toString() : "",
                                            filterByEndDate: event.target.value != "custom" ? moment().local().format('MMM DD YYYY').toString() : "",
                                        })} style={{ width: 190, margin: '0 5px' }} />;
                                    })()}
                                    <Pagination className="stretch-to-mobile" totalPage={state.totalCodOrder ? state.totalCodOrder : 1} currentPage={state.fCurrentPage} action={result => this.setState({ fCurrentPage: result })} style={{ margin: '0 5px' }} />
                                </div>
                                {state.fCurrentPage > 1 || state.filter_order_status || (state.filterByStartDate && state.filterByEndDate) ?
                                    <div className="flex-container" style={{ justifyContent: 'flex-start' }}>
                                        {state.fCurrentPage > 1 &&
                                            <ShowFilter label={"Page: " + state.fCurrentPage} onClick={() => this.setState({ fCurrentPage: 1 })} />
                                        }
                                        {state.filter_order_status &&
                                            <ShowFilter label={state.filter_order_status} onClick={() => this.setState({ filter_order_status: "" })} />
                                        }
                                        {state.filterByStartDate && state.filterByEndDate ?
                                            <ShowFilter label={"Order Date: " + state.filterByStartDate + " - " + state.filterByEndDate} onClick={() => this.setState({ filterByStartDate: "", filterByEndDate: "", date_filter: "" })} />
                                            : void 0}
                                    </div>
                                    : void 0}
                                <Query query={GET_FUNNEL_ORDER_COST} variables={{
                                    variantID: state.selectedVariantID,
                                    filterByStartDate: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                    filterByEndDate: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : ""
                                }}>
                                    {({ data, loading, refetch, error }) => {
                                        if (loading || error) return null;
                                        if (!data.getFunnelOrderCost.jsonStr) return null;
                                        var jsonData = JSON.parse(data.getFunnelOrderCost.jsonStr)
                                        return (
                                            <div className="column column_12_12" style={{ padding: 0 }}>
                                                <div className="column column_3_12">
                                                    <div className="product-card text-center" style={{ backgroundColor: '#ff8000', color: '#fff', border: '1px solid #dfe5eb', padding: 10 }}>
                                                        <label className="one-line-ellipsis" style={{ marginBottom: 10, display: 'block' }}>Total Fulfillment Cost</label>
                                                        <label style={{ fontSize: '2.5em' }}>${points.commafy(jsonData.fcost.toFixed(2))}</label>
                                                    </div>
                                                </div>
                                                <div className="column column_3_12">
                                                    <div className="product-card text-center" style={{ backgroundColor: '#4267b2', color: '#fff', border: '1px solid #dfe5eb', padding: 10 }}>
                                                        <label className="one-line-ellipsis" style={{ marginBottom: 10, display: 'block' }}>Total Duty Cost</label>
                                                        <label style={{ fontSize: '2.5em' }}>${points.commafy(jsonData.yabazooCost.toFixed(2))}</label>
                                                    </div>
                                                </div>
                                                <div className="column column_3_12">
                                                    <div className="product-card text-center" style={{ backgroundColor: '#27c686', color: '#fff', border: '1px solid #dfe5eb', padding: 10 }}>
                                                        <label className="one-line-ellipsis" style={{ marginBottom: 10, display: 'block' }}>Total PLG Profit</label>
                                                        <label style={{ fontSize: '2.5em' }}>${points.commafy(jsonData.plgProfit.toFixed(2))}</label>
                                                    </div>
                                                </div>
                                                <div className="column column_3_12">
                                                    <div className="product-card text-center" style={{ backgroundColor: '#ff8000', color: '#fff', border: '1px solid #dfe5eb', padding: 10 }}>
                                                        <label className="one-line-ellipsis" style={{ marginBottom: 10, display: 'block' }}>Total Delivery Cost</label>
                                                        <label style={{ fontSize: '2.5em' }}>${points.commafy(jsonData.deliveryCost.toFixed(2))}</label>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }}
                                </Query>
                                <span className="clear" />
                                <div className="product-card table-container">
                                    <table className="table-list">
                                        <thead>
                                            <tr>
                                                <td>#</td>
                                                <td>Email & Phone</td>
                                                <td>Product Name</td>
                                                <td>Quantity</td>
                                                <td>Local Price</td>
                                                <td>USD Price</td>
                                                <td>Order Status</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <Query query={
                                                GET_FUNNEL_ORDERS(`{ count order_status currencySymbol shipping_information { email phone } line_items { title price convertedPrice quantity } }`)
                                            } variables={{
                                                variantIDS: state.selectedVariantID,
                                                merchant_type: "cod",
                                                order_status: state.filter_order_status,
                                                filterByStartDate: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                                filterByEndDate: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                                skip: state.fCurrentPage - 1,
                                                cod_analytics: true
                                            }}
                                                onCompleted={data => this.setState({ totalCodOrder: data.getMyFunnelOrders && data.getMyFunnelOrders.length != 0 ? data.getMyFunnelOrders[0].count : 0 })} notifyOnNetworkStatusChange>
                                                {({ data, loading, refetch, error }) => {
                                                    const colSpan = 7;
                                                    if (loading) return <tr><td colSpan={colSpan} className="text-center"><Loading width={100} height={100} /></td></tr>;
                                                    if (error) return <tr><td colSpan={colSpan} className="text-center">An error has occured please try again.</td></tr>;
                                                    if (!data.getMyFunnelOrders || data.getMyFunnelOrders.length == 0) return <tr><td colSpan={colSpan} className="text-center">No order for this product yet.</td></tr>
                                                    return data.getMyFunnelOrders.map((order, index) => {
                                                        var key = index + 1;
                                                        var fontColor = points.getBGandFontColor(order.order_status);
                                                        return (
                                                            <tr key={key}>
                                                                <td className="text-center">{key}</td>
                                                                <td>
                                                                    {order.shipping_information.email ? order.shipping_information.email : ""} {order.shipping_information.email ? <br /> : ""}
                                                                    {order.shipping_information.phone ? order.shipping_information.phone : ""}
                                                                </td>
                                                                <td>
                                                                    <ul className="item-list" style={{ width: '100%' }}>
                                                                        {order.line_items.map((li, index) => {
                                                                            return <li style={{ backgroundColor: 'unset', color: 'inherit' }} key={index}>{li.title}</li>;
                                                                        })}
                                                                    </ul>
                                                                </td>
                                                                <td>
                                                                    <ul className="item-list" style={{ width: '100%' }}>
                                                                        {order.line_items.map((li, index) => {
                                                                            return <li style={{ backgroundColor: 'unset', color: 'inherit' }} key={index}>{li.quantity}x</li>;
                                                                        })}
                                                                    </ul>
                                                                </td>
                                                                <td>
                                                                    <ul className="item-list" style={{ width: '100%' }}>
                                                                        {order.line_items.map((li, index) => {
                                                                            return <li style={{ backgroundColor: 'unset', color: 'inherit' }} key={index}>{order.currencySymbol ? order.currencySymbol : "$"}{points.commafy(li.price.toFixed(2))}</li>;
                                                                        })}
                                                                    </ul>
                                                                </td>
                                                                <td>
                                                                    <ul className="item-list" style={{ width: '100%' }}>
                                                                        {order.line_items.map((li, index) => {
                                                                            return <li style={{ backgroundColor: 'unset', color: 'inherit' }} key={index}>${points.commafy(li.convertedPrice.toFixed(2))}</li>;
                                                                        })}
                                                                    </ul>
                                                                </td>
                                                                <td style={{ color: fontColor.bg }}>{points.capitalizeWord(order.order_status)}</td>
                                                            </tr>
                                                        );
                                                    });
                                                }}
                                            </Query>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </Modal>
                }

                {/* manage affiliate */}
                {state.showManageAffiliate &&
                    <Modal open={state.showManageAffiliate} closeModal={() => this.toggleManageAffiliate()} session={this.props.session} style={{ borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0, width: '50%' }}>
                        <div className="column_12_12">
                            <style dangerouslySetInnerHTML={{ __html: `.popup-content .content {padding: 0px;}` }} />
                            <div className="modal-header row-separator">
                                <h4 className="header">Manage Affiliate</h4>
                            </div>
                            <div className="page-container">
                                <div className="row-separator">
                                    <div className="column column_9_12">
                                        <button className={"stretch-to-mobile" + (state.ma_active_tab == "affiliate_list" ? " btn-success" : "")} onClick={() => this.setState({ ma_active_tab: "affiliate_list" }, () => this.refetchAffiliate ? this.refetchAffiliate() : void 0)}>Affiliate List</button>
                                        <button className={"stretch-to-mobile" + (state.ma_active_tab == "add_investment" ? " btn-success" : "")} onClick={() => this.setState({ ma_active_tab: "add_investment" })}>Add Investment</button>
                                    </div>
                                    <div className="column column_3_12">
                                        <button className="btn-success stretch-width" onClick={() => this.exportAllAffiliateToCSV()}>Export to csv</button>
                                    </div>
                                    <span className="clear" />
                                </div>
                                {state.ma_active_tab == "affiliate_list" &&
                                    <div className="product-card product-details">
                                        <Query query={GET_ALL_AFFILIATE} notifyOnNetworkStatusChange={true} onCompleted={data => this.setState({ affiliate_list: data.getAllAffiliate })}>
                                            {({ data, loading, refetch, error }) => {
                                                this.refetchAffiliate = refetch;
                                                if (loading) return <Loading width={100} height={100} />;
                                                else if (error) return <label>An error has occurred please try again.</label>;
                                                else if (data.getAllAffiliate.length == 0) return <label>No Affiliate Found.</label>;
                                                return data.getAllAffiliate.map((user, index) => {
                                                    const name = points.capitalizeWord(user.firstName + " " + user.lastName);
                                                    return (
                                                        <div className="display-inline" style={{ border: '1px solid #e6e6e6', margin: '5px 0', padding: 10, borderRadius: 5 }} key={index}>
                                                            <div className="column column_12_12 ellipsis">
                                                                <span className="float-left color-white font-small display-inline flex-container" style={{ backgroundColor: '#27c586', width: 25, height: 25, borderRadius: '50%', marginRight: 10 }}>{index + 1}</span>
                                                                <label className="font-questrial-bold">Name: {name}</label> <br />
                                                                <label>Email: {user.email}</label> <br />
                                                                <label>Total Investment: ${points.commafy(user.investment_total.toFixed(2))}</label>
                                                            </div>
                                                            <Tooltip trigger={<span className="fas fa-history cursor-pointer color-green float-right" />} position="left center" on="click" style={{ maxWidth: '70vw' }}>
                                                                <div>
                                                                    <label className="font-roboto-bold" style={{ display: 'block', textAlign: 'center', margin: '5px 0px' }}>Investment History</label>
                                                                    <ul className="item-list-normal">
                                                                        {user.investment_list.map((list, i) => {
                                                                            return (
                                                                                <li className="display-inline" key={i}>
                                                                                    Date: {moment(new Date(parseInt(list.date))).local().format('MMM DD, YYYY')} <br />
                                                                                    Amount: ${points.commafy(list.amount.toFixed(2))}
                                                                                </li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                </div>
                                                            </Tooltip>
                                                        </div>
                                                    );
                                                });
                                            }}
                                        </Query>
                                    </div>
                                }
                                {state.ma_active_tab == "add_investment" &&
                                    <div>
                                        <div className="filter-container" style={{ marginTop: 10 }}>
                                            <div className="stretch-to-mobile group-input-button" style={{ margin: '0px 5px' }}>
                                                <input type="text" name="ma_search" placeholder="Search Email" value={state.ma_search} onKeyUp={event => this.handleOnKeyUp(event, () => this.setState({ ma_searchBtn: state.ma_search }))} onChange={event => this.handleOnChange(event)} />
                                                <button className="fas fa-search" style={{ padding: '8px 15px' }} onClick={() => this.setState({ ma_searchBtn: state.ma_search })} />
                                            </div>
                                        </div>
                                        <div className="product-card product-details">
                                            <Query query={GET_ALL_USERS} variables={{ search: state.ma_searchBtn, limit: 10, offset: 0 }}>
                                                {({ data, loading, refetch, error }) => {
                                                    if (loading) return <Loading width={100} height={100} />;
                                                    else if (error) return <label>An error has occurred please try again.</label>;
                                                    else if (data.getAllUsers.length == 0) return <label>User Not Found.</label>;
                                                    return data.getAllUsers.map((user, index) => {
                                                        const name = points.capitalizeWord(user.firstName + " " + user.lastName);
                                                        return (
                                                            <div className="flex-container display-inline" style={{ border: '1px solid #e6e6e6', margin: '5px 0', padding: 10, borderRadius: 5 }} key={index}>
                                                                <div className="column column_9_12">
                                                                    <label className="font-questrial-bold">Name: {name}</label> <br />
                                                                    <label>Email: {user.email}</label>
                                                                </div>
                                                                <div className="column column_3_12">
                                                                    <ButtonWithPopup data={{
                                                                        triggerDOM: <button id={"ma_parent" + index} className="btn-success stretch-width font-small" style={{ padding: 5 }}>Add Investment</button>,
                                                                        popupPosition: "top right",
                                                                        text: (
                                                                            <div>
                                                                                <label>Amount</label>
                                                                                <div className="input-dollar">
                                                                                    <label>$</label>
                                                                                    <input type="number" name="investment_amount" value={state.investment_amount} onChange={event => this.handleOnChange(event)} style={{ marginTop: 10 }} />
                                                                                </div>
                                                                                <Mutation
                                                                                    mutation={SAVE_INVESTMENT}
                                                                                    variables={{
                                                                                        id: user.id,
                                                                                        amount: parseFloat(state.investment_amount)
                                                                                    }} >
                                                                                    {(saveInvestment, { data, loading, error }) => {
                                                                                        return (
                                                                                            <ButtonWithPopup data={{
                                                                                                triggerDOM: <button id={"ma_child" + index} className="btn-success stretch-width font-small" style={{ padding: 5, marginTop: 10 }} disabled={loading}>Save</button>,
                                                                                                popupPosition: "top center",
                                                                                                text: (
                                                                                                    <div>
                                                                                                        <label className="clear" style={{ fontSize: '1.3em' }}>
                                                                                                            Add ${points.commafy(state.investment_amount)} to <br />
                                                                                                            {name}?
                                                                                                        </label>
                                                                                                        <div className="column column_6_12">
                                                                                                            <button type="submit" className="btn-success stretch-width" onClick={() => {
                                                                                                                if (!state.investment_amount) {
                                                                                                                    this.setLoadingTime(0, 0);
                                                                                                                    toastr.clear();
                                                                                                                    toastr.warning("Amount is required.");
                                                                                                                } else {
                                                                                                                    this.saveInvestment(saveInvestment, "ma_parent" + index)
                                                                                                                }
                                                                                                            }} disabled={loading}>Yes</button>
                                                                                                        </div>
                                                                                                        <div className="column column_6_12">
                                                                                                            <button className="btn-warning stretch-width" onClick={() => document.getElementById("ma_child" + index).click()}>No</button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ),
                                                                                                arrow: true,
                                                                                                style: { borderRadius: 3, padding: 10, minWidth: 250, maxWidth: 250 },
                                                                                                checkORtimesButton: false
                                                                                            }} />
                                                                                        );
                                                                                    }}
                                                                                </Mutation>
                                                                            </div>
                                                                        ),
                                                                        arrow: true,
                                                                        style: { borderRadius: 3, padding: 10, minWidth: 250, maxWidth: 250 },
                                                                        checkORtimesButton: false
                                                                    }} />
                                                                </div>
                                                                <span className="clear" />
                                                            </div>
                                                        );
                                                    });
                                                }}
                                            </Query>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </Modal>
                }
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AdminManageCODorders);