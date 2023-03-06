import React from 'react';
import withAuth from './../hoc/withAuth';
import Pagination from '../components/pagination';
import ShowFilter from '../components/showFilter';
import toastr from 'toastr';
import moment from 'moment';
import ButtonWithPopup from '../components/buttonWithPopup';
import { GET_FUNNEL_ORDERS, GET_PURCHASE_ORDER, GET_MY_COMMISION_PAY_CHECK, GET_FUNNEL_PRODUCTS, ADD_FUNDS_TO_USER, GET_SERIAL_NUMBER_STATUS_COUNT } from './../queries';
import { Query, Mutation } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { Table, Tbody } from '../components/table';
const points = require('../../Global_Values');
const ShortId = require('id-shorter');
const mongoDBId = ShortId({ isFullId: true });

class MyCODAffiliate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCodAffiliate: 1,
            filter_order_status: "delivered,paid",
            currentPage: 1,
            isLoginAsAnonymous: ""
        }
    }

    componentDidMount(){
        toastr.options = points.toastrInitialize();
        const isLoginAsAnonymous = localStorage.getItem(points.plg_domain_secret)
        this.setState({ isLoginAsAnonymous })
    }

    head() {
        return (
            <Helmet>
                <title>COD Partners - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const currentUser = this.props.session.getCurrentUser;
        const state = this.state;
        const colSpan = 7;
        return (
            <div className="funnel">
                {this.head()}
                <div className="newPageHeader">
                    <div className="column column_12_12">
                        <span className="hide-in-desktop float-left" style={{ padding: 15 }} />
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>COD Partners</h4>
                    </div>
                    <span className="clear" />
                </div>
                <div className="page-container">
                    <div className="filter-container row-separator">
                        {state.totalCodAffiliate != 0 ?
                            <Pagination className="stretch-to-mobile" totalPage={state.totalCodAffiliate} currentPage={state.currentPage} action={result => this.setState({currentPage: result})} style={{marginLeft: 10}} />
                        : void 0}
                        <span className="clear" />
                    </div>
                    {state.currentPage > 1 ?
                        <div className="flex-container row-separator" style={{justifyContent: 'flex-start'}}>
                            {state.currentPage > 1 &&
                                <ShowFilter label={"Page: "+state.currentPage} onClick={() => this.setState({ currentPage: 1 })} />
                            }
                        </div>
                    : void 0}

                    <Query query={
                            GET_PURCHASE_ORDER(`{ sold_item_serial_numbers returning_item_serial_numbers product_variant_id product_price remainingQty totalQty affiliate_budget }`)
                        } variables={{ affiliate_email: currentUser.email, isApproved: true }}>
                        {({ data, loading, refetch, error }) => {
                            if (loading || error || data.getPurchaseOrders.length == 0) return null;
                            var serial_numbers = [];
                            data.getPurchaseOrders.forEach(po => serial_numbers.push(...po.sold_item_serial_numbers))
                            return (
                                <div>
                                    <div className="column column_3_12">
                                        <div className="product-card" style={{backgroundColor: '#4267b2', color: '#fff', border: '1px solid #dfe5eb', marginTop: 0}}>
                                            <div className="product-details text-center">
                                                <label style={{fontSize: '1em', marginBottom: 10, display: 'block'}}>Funds Available</label>
                                                <label style={{fontSize: '2.5em'}}>${points.commafy(currentUser.investment_total.toFixed(2))}</label>
                                            </div>
                                        </div>
                                        <div className="product-card" style={{backgroundColor: '#27c686', color: '#fff', border: '1px solid #dfe5eb', marginTop: 0}}>
                                            <div className="product-details text-center">
                                                <label style={{fontSize: '1em', marginBottom: 10, display: 'block'}}>Total Commission</label>
                                                <Query query={GET_MY_COMMISION_PAY_CHECK} variables={{ serial_numbers: JSON.stringify(serial_numbers), order_status: state.filter_order_status, isPaidCommision: false }}>
                                                    {({ data, loading, refetch, error }) => {
                                                        if (loading || error) return null;
                                                        return <label style={{fontSize: '2.5em'}}>${points.commafy(data.getMyCommissionPayCheck.count.toFixed(2))}</label>
                                                    }}
                                                </Query>
                                            </div>
                                        </div>
                                        <div className="product-card" style={{ marginTop: 0 }}>
                                            <h4 className="font-roboto-bold text-center" style={{ padding: 10, minHeight: 'fit-content' }}>Inventory Level</h4>
                                            <Table headers={[{ text: "Product Name" }, { text: "Product Cost" }, { text: "Quantity" }, { text: "Budget" }]} containerStyle={{ fontSize: '0.9em', padding: 10 }} >
                                                {data.getPurchaseOrders.map((po_data, index) => {
                                                    return (
                                                        <Tbody index={index} key={index}>
                                                            <Query query={
                                                                    GET_FUNNEL_PRODUCTS(`{ productName }`)
                                                                } variables={{ id: po_data.product_variant_id }}>
                                                                {({ data, loading, refetch, error }) => {
                                                                    if(loading) return <div><label>Loading...</label></div>
                                                                    if(error) return <div><label>Error!</label></div>
                                                                    if(!data.getFunnelProducts || (data.getFunnelProducts && data.getFunnelProducts.length == 0)) return <div><label>Not Found!</label></div>
                                                                    var productName = data.getFunnelProducts[0].productName;
                                                                    return <div><label>{productName}</label></div>;
                                                                }}
                                                            </Query>
                                                            <div><label>${po_data.product_price}</label></div>
                                                            {state.isLoginAsAnonymous ?
                                                                <div>
                                                                    <ButtonWithPopup data={{
                                                                        triggerDOM: <label>{po_data.remainingQty}x</label>,
                                                                        popupPosition: "top center",
                                                                        text: (
                                                                            <div className="text-left" style={{ minWidth: 100 }}>
                                                                                <div>
                                                                                    <label className="font-roboto-bold">Remaining Qty:</label>
                                                                                    <span className="float-right">{po_data.remainingQty}x</span>
                                                                                </div>
                                                                                <div>
                                                                                    <label className="font-roboto-bold">Sold Qty:</label>
                                                                                    <span className="float-right">{po_data.sold_item_serial_numbers.length}x</span>
                                                                                </div>
                                                                                <div className="flex-container" style={{ flexDirection: 'column', marginLeft: 5, paddingLeft: 10, borderLeft: '1px solid #dddddd' }}>
                                                                                    <Query query={GET_SERIAL_NUMBER_STATUS_COUNT} variables={{ serial_numbers: JSON.stringify(po_data.sold_item_serial_numbers), order_status: "pickedup" }}>
                                                                                        {({ data, loading, refetch, error }) => {
                                                                                            var text = "---";
                                                                                            if(loading) text = "...";
                                                                                            else if(error) text = "err";
                                                                                            else if(!data.getSerialNumberStatusCount) text = "0x";
                                                                                            else text = data.getSerialNumberStatusCount.count+"x";
                                                                                            return <label style={{ borderBottom: '1px solid #dddddd' }}>Picked-up &nbsp; {text}</label>;
                                                                                        }}
                                                                                    </Query>
                                                                                    <Query query={GET_SERIAL_NUMBER_STATUS_COUNT} variables={{ serial_numbers: JSON.stringify(po_data.returning_item_serial_numbers), order_status: "cancelled" }}>
                                                                                        {({ data, loading, refetch, error }) => {
                                                                                            var text = "---";
                                                                                            if(loading) text = "...";
                                                                                            else if(error) text = "err";
                                                                                            else if(!data.getSerialNumberStatusCount) text = "0x";
                                                                                            else text = data.getSerialNumberStatusCount.count+"x";
                                                                                            return <label>Cancelled &nbsp; {text}</label>
                                                                                        }}
                                                                                    </Query>
                                                                                </div>
                                                                                <div>
                                                                                    <label className="font-roboto-bold">Returning Qty:</label>
                                                                                    <span className="float-right">{po_data.returning_item_serial_numbers.length}x</span>
                                                                                </div>
                                                                                <div>
                                                                                    <label className="font-roboto-bold">Total Qty:</label>
                                                                                    <span className="float-right">{po_data.totalQty}x</span>
                                                                                </div>
                                                                            </div>
                                                                        ),
                                                                        loading: false,
                                                                        padding: 5,
                                                                        checkORtimesButton: false,
                                                                        onAction: 'hover',
                                                                        style: { borderRadius: 5, padding: 5 }
                                                                    }} />
                                                                </div>
                                                            :
                                                                <label>{po_data.remainingQty}x</label>
                                                            }
                                                            <div><label>${points.commafy(po_data.affiliate_budget)}</label></div>
                                                        </Tbody>
                                                    );
                                                })}
                                            </Table>
                                        </div>
                                    </div>
                                    <div className="column column_9_12">
                                        <div className="product-card">
                                            <Table headers={[{ text: "Product Name" }, { text: "Quantity" }, { text: "Product Cost" }, { text: "Commission" }, { text: "Date Delivered" }, { text: "Status" }]} >
                                                <Query query={
                                                    GET_FUNNEL_ORDERS(`{ ids isPaidProductCost isManualModified isPaidCommision count dateStatusDelivered order_status line_items { title quantity productCost affiliateCost } }`)
                                                } variables={{
                                                    serial_numbers: JSON.stringify(serial_numbers),
                                                    merchant_type: "cod",
                                                    sortBy: "dateStatusDelivered",
                                                    order_status: state.filter_order_status,
                                                    skip: state.currentPage - 1,
                                                    isPaidCommision: state.isLoginAsAnonymous ? undefined : false,
                                                    cod_analytics: true,
                                                }} notifyOnNetworkStatusChange={true} onCompleted={data => {
                                                    if (data.getMyFunnelOrders && data.getMyFunnelOrders.length != 0) {
                                                        this.setState({ totalCodAffiliate: data.getMyFunnelOrders[0].count });
                                                    }
                                                }}>
                                                    {({ data, loading, refetch, error }) => {
                                                        if (loading) return <Tbody loading={true} />;
                                                        if (error) return <Tbody singleRowText={"An error has occurred please try again."} />;
                                                        if (data.getMyFunnelOrders.length == 0) return <Tbody singleRowText={"No result found. check back soon!"} />
                                                        return data.getMyFunnelOrders.map((order, index) => {
                                                            return (
                                                                <Tbody index={index} key={index}>
                                                                    <div className="display-inline">
                                                                        {order.isPaidCommision &&
                                                                            <span className="color-green fas fa-check" style={{ marginRight: 5, padding: 5, border: '1px solid #19c594', borderRadius: '50%' }} title="Paid commission" />
                                                                        }
                                                                        {order.isPaidCommision && order.isManualModified ?
                                                                            <span className="color-green fas fa-user-edit" style={{ marginRight: 5, padding: '5px 1px 5px 5px', border: '1px solid #19c594', borderRadius: '50%' }} title="Manual Modified" />
                                                                        : void 0}
                                                                        <ul className="item-list" style={{ width: '100%' }}>
                                                                            {order.line_items.map((li, index) => {
                                                                                return <li style={{ backgroundColor: 'unset', color: 'inherit' }} key={index}>{li.title}</li>;
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                    <div className="display-inline">
                                                                        <ul className="item-list" style={{ width: '100%' }}>
                                                                            {order.line_items.map((li, index) => {
                                                                                return <li style={{ backgroundColor: 'unset', color: 'inherit' }} key={index}>{li.quantity}x</li>;
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                    <div className="display-inline">
                                                                        <ul className="item-list" style={{ width: '100%' }}>
                                                                            {order.line_items.map((li, index) => {
                                                                                return <li style={{ backgroundColor: 'unset', color: 'inherit' }} key={index}>${li.productCost}</li>;
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                    <div className="display-inline">
                                                                        <ul className="item-list" style={{ width: '100%' }}>
                                                                            {order.line_items.map((li, index) => {
                                                                                return <li style={{ backgroundColor: 'unset', color: 'inherit' }} key={index}>${li.affiliateCost}</li>;
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                    <div className="display-inline">
                                                                        {order.dateStatusDelivered ? moment.utc(new Date(parseInt(order.dateStatusDelivered))).format("MMMM DD, YYYY") : order.order_status}
                                                                    </div>
                                                                    <div className="display-inline">
                                                                        <label>{points.capitalizeWord(order.order_status)}</label>
                                                                        {state.isLoginAsAnonymous && !order.isPaidProductCost ?
                                                                            <Mutation mutation={ADD_FUNDS_TO_USER} variables={{ orderids: JSON.stringify(order.ids) }}>
                                                                                {(addFundsToUser, { data, loading, error }) => {
                                                                                    return (
                                                                                        <ButtonWithPopup data={{
                                                                                            triggerDOM: (
                                                                                                <button id={"add_funds"+index} className="btn-success" disabled={loading} style={{ marginLeft: 10 }}>Add to Funds</button>
                                                                                            ),
                                                                                            popupPosition: "top center",
                                                                                            text: <label className="font-roboto-light" style={{ fontSize: '1.2em' }}>Are you sure?</label>,
                                                                                            action: () => points.executeMutation(addFundsToUser, toastr, () => {
                                                                                                refetch();
                                                                                                this.props.refetch();
                                                                                                points.toastrPrompt(toastr, "success", "Product Cost has been added to user funds.", "Success");
                                                                                            }),
                                                                                            triggerID: "add_funds"+index,
                                                                                            loading,
                                                                                            padding: 10,
                                                                                            style: { minWidth: 170, width: 170 }
                                                                                        }} />
                                                                                    );
                                                                                }}
                                                                            </Mutation>
                                                                        : void 0}
                                                                    </div>
                                                                </Tbody>
                                                            );
                                                        });
                                                    }}
                                                </Query>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    </Query>
                </div>
            </div>
        );
    }
}


export default withAuth(session => session && session.getCurrentUser)(MyCODAffiliate);