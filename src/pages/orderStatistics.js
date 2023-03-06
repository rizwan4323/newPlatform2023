import React from 'react';
import toastr from 'toastr';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
import { GET_ORDER_METRICS, GET_FUNNEL_LIST, GET_MY_PAY_CHECK, GET_MY_FUNNEL_ORDER_TOTAL_SALES, GET_MY_TOP_PRODUCT_SALES } from '../queries';
import { Query } from 'react-apollo';
import Loading from '../components/loading';
import LoadingPage from '../components/loadingPage';
import SelectTag from '../components/selectTag';
import ShowFilter from '../components/showFilter';
import DateRange from '../components/dateRange';
import PopupTooltip from '../components/tooltip';
import { ResponsiveContainer, Legend, Tooltip, Cell, PieChart, Pie, CartesianGrid, AreaChart, Area } from 'recharts';
import Checkbox from '../components/checkbox';
const points = require('../../Global_Values');

const initialize_filter = {
    filter_by_start_date: "",
    filter_by_end_date: "",
    filter_merchant_type: "cod",
    filter_funnel_id: "",
    filter_funnel_name: "",
    filter_funnel_selected: "",
    filter_showShopifyOnly: false
}

const initialize_sales = {
    total_profit_collected: 0,
    total_profit: 0,
    total_sales_revenue: 0,
    total_pending_sales: 0,
    total_cancelled_sales: 0,
    total_cost_of_goods: 0,
    disable_date_button: false
}

const initialize_compare_data = {
    total_sales_chart_compare: [],
    total_sales_chart: [],
    total_order_chart_compare: [],
    total_order_chart: [],
    stats_loading: true,
    stats_data_compare: [],
    stats_data: []
}

let chart_animation_timeout = null;

class AdminRestorePaid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_page_loading: true,
            ...initialize_filter,
            ...initialize_sales,
            ...initialize_compare_data
        }
    }

    componentDidMount() {
        toastr.options = points.toastrInitialize();
        var is_showShopifyOnly = localStorage.getItem("is_showShopifyOnly");
        let past7days = points.getPastDate(6, true);
        this.setState({ is_page_loading: false, filter_showShopifyOnly: is_showShopifyOnly === null ? false : is_showShopifyOnly === 'false' ? false : true, filter_by_start_date: past7days.toDateString(), filter_by_end_date: new Date().toDateString() }, () => this.statsRequest());
    }

    pieChartCustomToolTip({ active, payload }) {
        if (active) {
            if (!payload) return null;
            payload = payload.reduce(e => e);
            const label = points.capitalizeWord(payload.payload.description);
            return (
                <div style={{ backgroundColor: '#232d2b', border: 'none', color: '#fff', opacity: 0.8, padding: '15px 10px' }}>
                    <div className="row-separator">
                        <label className="header-medium-bold text-center">{label}</label>
                    </div>
                    <div className="row-separator">
                        <div className="column column_4_12">
                            <label>Total: </label>
                        </div>
                        <div className="column column_8_12 text-right">
                            <label>{payload.payload.count}</label>
                        </div>
                    </div>
                    <div className="row-separator">
                        <div className="column column_4_12">
                            <label>Amount: </label>
                        </div>
                        <div className="column column_8_12 text-right">
                            <label>${points.commafy(payload.payload.value.toFixed(2))}</label>
                        </div>
                    </div>
                    <span className="clear" />
                </div>
            )
        }
    }

    pieChartPercentageLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        if (percent == 0) return null; // hide if 0 result
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" >
                {(percent * 100).toFixed(0)}%
            </text>
        );
    }

    charWithComparetTooltip({ active, payload, label }) {
        if (active) {
            if (!payload) return null;
            payload = payload.reduce(e => e);
            let text = "", compare = 0, orig = 0;
            if (typeof payload.payload.sales != "undefined") {
                text = "Sales";
                compare = "$" + points.commafy(payload.payload.compare_sales.toFixed(2));
                orig = "$" + points.commafy(payload.payload.sales.toFixed(2));;
            } else if (typeof payload.payload.orders != "undefined") {
                text = "Orders";
                compare = payload.payload.compare_orders;
                orig = payload.payload.orders;
            }
            return (
                <div style={{ backgroundColor: '#232d2b', border: 'none', color: '#fff', opacity: 0.8 }}>
                    <div style={{ padding: 10 }}>
                        <label>Compare Date: {payload.payload.compare_date}</label> <br />
                        <label>Compare {text}: {compare}</label>
                    </div>
                    <hr style={{ margin: 0 }} />
                    <div style={{ padding: 10 }}>
                        <label>Date: {payload.payload.date}</label> <br />
                        <label>{text}: {orig}</label>
                    </div>
                </div>
            )
        }
    }

    setOverTimeLoading() {
        this.setState({ ...initialize_compare_data }, () => this.statsRequest());
    }

    statsRequest() {
        let state = this.state, compare_date = points.getCompareDateRange(state.filter_by_start_date, state.filter_by_end_date);
        let from = Date.parse(new Date(state.filter_by_start_date).toISOString()), to = Date.parse(new Date(points.sendDateToServer(state.filter_by_end_date)).toISOString());
        let from_compare = Date.parse(new Date(compare_date.start).toISOString()), to_compare = Date.parse(new Date(points.sendDateToServer(compare_date.end)).toISOString());
        let user_id = this.props.session.getCurrentUser.id; // "5c34100f12101523a70989cb";
        let payload1 = { "query": "{   everyPagebyCreatorDateRange(creatorID: \"" + user_id + "\", from: \"" + from + "\", to: \"" + to + "\"){   purchased   pageType   pageID   funnelID   date   conversion   device   fromPage   }}", "variables": null, "operationName": null };
        let payload2 = { "query": "{   everyPagebyCreatorDateRange(creatorID: \"" + user_id + "\", from: \"" + from_compare + "\", to: \"" + to_compare + "\"){   purchased   pageType   pageID   funnelID   date   conversion   device   fromPage   }}", "variables": null, "operationName": null };
        points.customFetch('https://stats.productlistgenie.io/graphql', 'POST', payload1, async result1 => {
            let data1 = result1.data.everyPagebyCreatorDateRange;
            points.customFetch('https://stats.productlistgenie.io/graphql', 'POST', payload2, async result2 => {
                let data2 = result2.data.everyPagebyCreatorDateRange;
                this.setState({ stats_loading: false, stats_data: data1, stats_data_compare: data2 });
            })
        })
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Order Metrics - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const state = this.state, chartHeight = 340;
        if (state.is_page_loading) return <LoadingPage />;
        const currentUser = this.props.session.getCurrentUser, compare_date = points.getCompareDateRange(state.filter_by_start_date, state.filter_by_end_date);
        return (
            <div className="admin funnel">
                {this.head()}
                <div className="newPageHeader">
                    <div className="column column_4_12">
                        <span className="hide-in-desktop float-left" style={{ padding: 15 }} />
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>Order Metrics</h4>
                    </div>
                    <span className="clear" />
                </div>
                <div className="filter-container" style={{ margin: 10 }}>
                    <Checkbox
                        id="filter_showShopifyOnly"
                        label="Show products synced to shopify only"
                        labelClassName="header-medium-bold font-small"
                        checked={state.filter_showShopifyOnly}
                        onChange={value => {
                            this.setState({ filter_showShopifyOnly: value }, () => this.statsRequest())
                            localStorage.setItem("is_showShopifyOnly", value)
                        }}
                        containerClassName="row-separator"
                    />
                    <DateRange start={state.filter_by_start_date} end={state.filter_by_end_date} onRangeChange={date => this.setState({ filter_by_start_date: date.start, filter_by_end_date: date.end }, this.setOverTimeLoading())}>
                        <div className="stretch-to-mobile custom-select" style={{ margin: "0 5px", width: 100 }}>
                            <div className="select-selected stretch-width text-left">Date</div>
                        </div>
                    </DateRange>
                    {(() => {
                        var merchant_types = points.list_of_merchant.map((merchant, i) => {
                            return <option value={merchant.value} key={i}>{merchant.label}</option>;
                        });
                        return (
                            <SelectTag
                                className="stretch-to-mobile"
                                name="filter_merchant_type"
                                value={state.filter_merchant_type}
                                options={merchant_types}
                                onChange={event => {
                                    this.setState({
                                        ...initialize_sales,
                                        filter_merchant_type: event.target.value
                                    });
                                }}
                                style={{ margin: "0 5px", width: 200 }} />
                        );
                    })()}
                    <Query query={GET_FUNNEL_LIST(`{ id funnel_name old_page_ids }`)} variables={{ creator: currentUser.id, limit: 0 }}>
                        {({ data, loading, refetch, error }) => {
                            if (loading || error) return null;
                            else if (data.getFunnelList.length == 0) return null;
                            var funnel_options = [<option key={0} value="">All Funnels</option>];
                            if (data.getFunnelList.length != 0) {
                                data.getFunnelList.forEach((funnel, i) => {
                                    let ids = funnel.old_page_ids.map(e => e);
                                    ids.push(funnel.id)
                                    let value = JSON.stringify({ ids: ids, name: funnel.funnel_name });
                                    funnel_options.push(<option value={value} key={i + 1}>{points.presentableFunnelName(funnel.funnel_name)}</option>);
                                });
                            }
                            return (
                                <SelectTag
                                    className="stretch-to-mobile"
                                    name="filter_funnel_selected"
                                    options={funnel_options}
                                    value={JSON.stringify(state.filter_funnel_selected)}
                                    onChange={event => {
                                        let value = { ids: [], name: "" };
                                        if (event.target.value) value = JSON.parse(event.target.value);
                                        this.setState({ filter_funnel_id: value.ids, filter_funnel_name: value.name, filter_funnel_selected: value })
                                    }}
                                    style={{ margin: "0 5px", width: 200 }} />
                            );
                        }}
                    </Query>
                </div>
                {(() => {
                    return (
                        <div className="flex-container" style={{ justifyContent: 'flex-start', margin: 10 }}>
                            <ShowFilter label={state.filter_by_start_date + " - " + state.filter_by_end_date} close={false} />
                            {state.filter_merchant_type &&
                                <ShowFilter label={state.filter_merchant_type} onClick={() => this.setState({ filter_merchant_type: "" })} />
                            }
                            {state.filter_funnel_name &&
                                <ShowFilter label={state.filter_funnel_name.replace(/-/g, " ")} onClick={() => this.setState({ filter_funnel_id: "", filter_funnel_name: "", filter_funnel_selected: "" })} />
                            }
                        </div>
                    );
                })()}
                <div className="page-container">
                    <div className="column column_5_12" style={{ padding: 0 }}>
                        <div className="column column_6_12 row-separator">
                            <div className="product-card" style={{ backgroundColor: '#4267b2', color: '#fff', border: '1px solid #dfe5eb' }}>
                                <div className="product-details text-center">
                                    <label style={{ fontSize: '1.5em', marginBottom: 10, display: 'block' }}>Profit Collected</label>
                                    <Query query={GET_MY_PAY_CHECK} variables={{
                                        creator: currentUser.id,
                                        order_status: 'paid,delivered',
                                        dateStart: points.sendDateToServer(state.filter_by_start_date, true),
                                        dateEnd: points.sendDateToServer(state.filter_by_end_date),
                                        showShopifyOnly: state.filter_showShopifyOnly
                                    }}>
                                        {({ data, loading, refetch, error }) => {
                                            let collected = 0;
                                            if (loading || error) return null;
                                            else collected = data.getMyPayCheck.count;
                                            return <label style={{ fontSize: 'calc(20px + 1vw)' }}>${points.commafy(collected.toFixed(2))}</label>
                                        }}
                                    </Query>
                                </div>
                            </div>
                        </div>
                        <div className="column column_6_12 row-separator">
                            <div className="product-card" style={{ backgroundColor: '#f28706', color: '#fff', border: '1px solid #dfe5eb' }}>
                                <div className="product-details text-center">
                                    <label style={{ fontSize: '1.5em', marginBottom: 10, display: 'block' }}>Potential Profit</label>
                                    <label style={{ fontSize: 'calc(20px + 1vw)' }}>${points.commafy(state.total_profit.toFixed(2))}</label>
                                </div>
                            </div>
                        </div>
                        <span className="clear" />
                    </div>
                    <div className="column column_7_12" style={{ padding: 0 }}>
                        <div className="column column_3_12 row-separator">
                            <div className="product-card" style={{ backgroundColor: points.getBGandFontColor('paid').bg, color: '#fff', border: '1px solid #dfe5eb' }}>
                                <div className="product-details text-center">
                                    <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>Sales Revenue</label>
                                    <label style={{ fontSize: 'calc(15px + 1vw)' }}>${points.commafy((state.total_sales_revenue - state.total_pending_sales).toFixed(2))}</label>
                                </div>
                            </div>
                        </div>
                        <div className="column column_3_12 row-separator">
                            <div className="product-card" style={{ backgroundColor: points.getBGandFontColor('hold').bg, color: '#fff', border: '1px solid #dfe5eb' }}>
                                <div className="product-details text-center">
                                    <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>Declined / Pending Sales</label>
                                    <label style={{ fontSize: 'calc(15px + 1vw)' }}>${points.commafy(state.total_pending_sales.toFixed(2))}</label>
                                </div>
                            </div>
                        </div>
                        <div className="column column_3_12 row-separator">
                            <div className="product-card" style={{ backgroundColor: points.getBGandFontColor('cancelled').bg, color: '#fff', border: '1px solid #dfe5eb' }}>
                                <div className="product-details text-center">
                                    <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>Cancelled Sales</label>
                                    <label style={{ fontSize: 'calc(15px + 1vw)' }}>${points.commafy(state.total_cancelled_sales.toFixed(2))}</label>
                                </div>
                            </div>
                        </div>
                        <div className="column column_3_12 row-separator">
                            <div className="product-card" style={{ backgroundColor: '#9c27b0', color: '#fff', border: '1px solid #dfe5eb' }}>
                                <div className="product-details text-center">
                                    <label style={{ fontSize: '1em', marginBottom: 10, display: 'block' }}>Cost of Goods</label>
                                    <label style={{ fontSize: 'calc(15px + 1vw)' }}>${points.commafy(state.total_cost_of_goods.toFixed(2))}</label>
                                </div>
                            </div>
                        </div>
                        <span className="clear" />
                    </div>
                    <div className="column column_12_12 row-separator">
                        <div className="product-card" style={{ padding: 20 }}>
                            <h3 className="text-center">{points.capitalizeWord(state.filter_merchant_type) || "Order"} Metrics</h3>
                            <Query query={GET_ORDER_METRICS}
                                variables={{
                                    creator: currentUser.id,
                                    funnel_id: state.filter_funnel_id.toString(),
                                    merchant_type: state.filter_merchant_type,
                                    dateStart: points.sendDateToServer(state.filter_by_start_date, true),
                                    dateEnd: points.sendDateToServer(state.filter_by_end_date),
                                    showShopifyOnly: state.filter_showShopifyOnly
                                }} onCompleted={data => {
                                    let self = this, tout = 0, result = JSON.parse(data.getOrderMetrics.jsonStr), iso2 = Object.keys(result);
                                    let profit_collected = 0, profit = 0, revenue = 0, pending = 0, cancelled = 0, cog = 0;
                                    for (let i = 0; i < iso2.length; i++) {
                                        let sale = result[iso2[i]];
                                        profit_collected += parseFloat(sale.profit_collected.toFixed(2));
                                        profit += parseFloat(sale.profit_made.toFixed(2));
                                        revenue += parseFloat(sale.sales_revenue.toFixed(2));
                                        pending += parseFloat(sale.pending_sales.toFixed(2));
                                        cancelled += parseFloat(sale.cancelled_sales.toFixed(2));
                                        cog += parseFloat(sale.cog.toFixed(2));
                                    }
                                    if (iso2.length == 0) tout = 0;
                                    else tout = 2500;
                                    clearTimeout(chart_animation_timeout);
                                    chart_animation_timeout = setTimeout(() => { // kailangan lagyan ng delay dahil nawawala ung percentage ng pie chart
                                        self.setState({ total_profit_collected: profit_collected, total_profit: profit, total_sales_revenue: revenue, total_pending_sales: pending, total_cancelled_sales: cancelled, total_cost_of_goods: cog });
                                    }, tout)
                                }} notifyOnNetworkStatusChange>
                                {({ data, loading, refetch, error }) => {
                                    if (loading) {
                                        return (
                                            <div className="flex-container display-inline" style={{ width: '100%', height: 300 }}>
                                                <Loading width={150} height={150} />
                                            </div>
                                        );
                                    }
                                    if (error) {
                                        return (
                                            <div className="center-vertical-parent" style={{ height: chartHeight }}>
                                                <div className="center-vertical">
                                                    <img src="/assets/graphics/no-result.svg" style={{ height: chartHeight - 100 }} />
                                                    <h4 className="title" style={{ fontSize: '1.5em' }}>OOPS! THAT'S AN ERROR!</h4>
                                                    <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>An error occurred while trying to get the order metrics</label>
                                                </div>
                                            </div>
                                        );
                                    }
                                    const result = JSON.parse(data.getOrderMetrics.jsonStr);
                                    let countries = Object.keys(result);
                                    if (countries.length == 0) {
                                        return (
                                            <div className="center-vertical-parent" style={{ height: chartHeight }}>
                                                <div className="center-vertical">
                                                    <img src="/assets/graphics/no-result.svg" style={{ height: chartHeight - 100 }} />
                                                    <h4 className="title" style={{ fontSize: '1.5em' }}>NO RESULT FOUND!</h4>
                                                    <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>Please try different query</label>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return countries.map((iso2, i) => {
                                        let country = iso2 ? points.iso2toCountryName(iso2) : "No Country";
                                        let country_data = result[iso2];
                                        let chart_data = [
                                            { name: "paid", description: "Sales Revenue", value: country_data.sales_revenue, count: country_data.sales_orders },
                                            { name: "cancelled", description: "Cancelled Sales", value: country_data.cancelled_sales, count: country_data.cancelled_orders },
                                        ];
                                        return (
                                            <div className={"column " + (countries.length == 1 ? "column_12_12" : "column_3_12") + " row-separator" + (i % 4 == 0 ? " clear" : "")} key={i}>
                                                <h3 className="text-center one-line-ellipsis cursor-pointer">{country}</h3>
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <PieChart>
                                                        <Pie dataKey="value" data={chart_data} labelLine={false} label={this.pieChartPercentageLabel}>
                                                            {
                                                                chart_data.map((el, index) => {
                                                                    return <Cell fill={points.getBGandFontColor(el.name.toLowerCase().replace("-", "")).bg} key={index} />;
                                                                })
                                                            }
                                                        </Pie>
                                                        <Tooltip content={this.pieChartCustomToolTip} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        );
                                    });
                                }}
                            </Query>
                            <div className="column column_12_12 text-center flex-container">
                                <label style={{ margin: '0 10px' }}>
                                    <span style={{ backgroundColor: points.getBGandFontColor('paid').bg, padding: '0px 7px', marginRight: 5 }} />
                                    Total Sales Revenue
                                </label>
                                <label style={{ margin: '0 10px' }}>
                                    <span style={{ backgroundColor: points.getBGandFontColor('cancelled').bg, padding: '0px 7px', marginRight: 5 }} />
                                    Total Cancelled Sales
                                </label>
                            </div>
                            <span className="clear" />
                        </div>
                    </div>
                    <div className="column column_12_12 row-separator">
                        <div className="product-card" style={{ padding: 20 }}>
                            <h3 className="text-center">Top products sold</h3>
                            <Query query={GET_MY_TOP_PRODUCT_SALES} // Compare Date Query
                                variables={{
                                    creator: currentUser.id,
                                    page_ids: state.filter_funnel_id.toString(),
                                    merchant_type: state.filter_merchant_type,
                                    dateFrom: points.sendDateToServer(state.filter_by_start_date, true),
                                    dateTo: points.sendDateToServer(state.filter_by_end_date),
                                    showShopifyOnly: state.filter_showShopifyOnly
                                }} notifyOnNetworkStatusChange>
                                {({ data, loading, refetch, error }) => {
                                    if (loading) {
                                        return <Loading width={150} height={150} />;
                                    } else if (error) {
                                        return (
                                            <div className="center-vertical-parent" style={{ height: chartHeight }}>
                                                <div className="center-vertical">
                                                    <img src="/assets/graphics/no-result.svg" style={{ height: chartHeight - 100 }} />
                                                    <h4 className="title" style={{ fontSize: '1.5em' }}>AN ERROR HAS OCCURRED!</h4>
                                                    <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>Please try again.</label>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        let { top_products } = JSON.parse(data.getTopProducts.jsonStr);
                                        let countries = Object.keys(top_products);
                                        if (countries.length == 0) {
                                            return (
                                                <div className="center-vertical-parent" style={{ height: chartHeight }}>
                                                    <div className="center-vertical">
                                                        <img src="/assets/graphics/no-result.svg" style={{ height: chartHeight - 100 }} />
                                                        <h4 className="title" style={{ fontSize: '1.5em' }}>NO RESULT FOUND!</h4>
                                                        <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>Please try different query</label>
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return countries.map((iso3, i) => {
                                                let iso2 = iso3 ? points.iso3toIso2(iso3) : "";
                                                let country = iso2 ? points.iso2toCountryName(iso2) : "No Country";
                                                let product_data = top_products[iso3];
                                                return (
                                                    <div className={"column " + (countries.length == 1 ? "column_12_12" : "column_3_12") + " row-separator" + (i % 11 == 0 ? " clear" : "")} key={i}>
                                                        <h4 className="title" style={{ marginBottom: 10 }}>{country}</h4>
                                                        <ul className="item-list-normal">
                                                            {product_data.map((product, i) => {
                                                                return (
                                                                    <li key={i}>
                                                                        <span className="float-right" style={{ fontSize: '1.3em' }}>{product.count}</span>
                                                                        <label style={{ fontSize: '1.3em', display: 'block', width: 'calc(100% - (9px * ' + product.count.toString().length + '))' }}>{points.capitalizeWord(product.title)}</label>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                );
                                            });
                                        }
                                    }
                                }}
                            </Query>
                            <span className="clear" />
                        </div>
                    </div>
                    <div className="column column_4_12 row-separator">
                        <div className="product-card" style={{ padding: 20 }}>
                            <Query query={GET_MY_FUNNEL_ORDER_TOTAL_SALES} // Compare Date Query
                                variables={{
                                    creator: currentUser.id,
                                    page_ids: state.filter_funnel_id.toString(),
                                    merchant_type: state.filter_merchant_type,
                                    dateFrom: points.sendDateToServer(compare_date.start, true),
                                    dateTo: points.sendDateToServer(compare_date.end),
                                    timezoneOffset: new Date().getTimezoneOffset(),
                                    showShopifyOnly: state.filter_showShopifyOnlyF
                                }} onCompleted={data => {
                                    let compare = [];
                                    if (data.getMyFunnelOrderTotalSales && data.getMyFunnelOrderTotalSales.dates.length != 0) {
                                        data.getMyFunnelOrderTotalSales.dates.forEach(data => {
                                            compare.push({ compare_date: data.date, compare_sales: data.count });
                                        });
                                    }
                                    this.setState({ total_sales_chart_compare: compare });
                                }} notifyOnNetworkStatusChange>
                                {() => null}
                            </Query>
                            <Query query={GET_MY_FUNNEL_ORDER_TOTAL_SALES} // Sales Date Query
                                variables={{
                                    creator: currentUser.id,
                                    page_ids: state.filter_funnel_id.toString(),
                                    merchant_type: state.filter_merchant_type,
                                    dateFrom: points.sendDateToServer(state.filter_by_start_date, true),
                                    dateTo: points.sendDateToServer(state.filter_by_end_date),
                                    timezoneOffset: new Date().getTimezoneOffset(),
                                    showShopifyOnly: state.filter_showShopifyOnly
                                }} onCompleted={data => {
                                    let sales = [];
                                    if (data.getMyFunnelOrderTotalSales && data.getMyFunnelOrderTotalSales.dates.length != 0) {
                                        data.getMyFunnelOrderTotalSales.dates.forEach(data => {
                                            sales.push({ date: data.date, sales: data.count });
                                        });
                                    }
                                    this.setState({ total_sales_chart: sales });
                                }} notifyOnNetworkStatusChange>
                                {() => null}
                            </Query>
                            {(() => {
                                let salesChart = [], totalSales = state.total_sales_chart, totalSalesCompare = state.total_sales_chart_compare;
                                if (totalSales.length != totalSalesCompare.length) { // loading both sales and compare
                                    return <Loading width={chartHeight} height={chartHeight} />;
                                } else { // done loading
                                    totalSales.forEach((sale, i) => {
                                        let compare = totalSalesCompare[i];
                                        salesChart.push({ date: sale.date, sales: sale.sales, compare_date: compare.compare_date, compare_sales: compare.compare_sales });
                                    });
                                    if (salesChart.length == 0) { // no compiled result
                                        return (
                                            <div className="center-vertical-parent" style={{ height: chartHeight }}>
                                                <div className="center-vertical">
                                                    <img src="/assets/graphics/no-result.svg" style={{ height: chartHeight - 100 }} />
                                                    <h4 className="title" style={{ fontSize: '1.5em' }}>NO RESULT FOUND!</h4>
                                                    <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>Please try different query</label>
                                                </div>
                                            </div>
                                        );
                                    } else { // may resulta pass data to chart
                                        return (
                                            <div>
                                                <div className="float-right">
                                                    {(() => {
                                                        let sale_now = 0, sale_before = 0;
                                                        salesChart.forEach(e => {
                                                            sale_now += e.sales;
                                                            sale_before += e.compare_sales;
                                                        });
                                                        let obj = points.getPercentageChange(sale_before, sale_now);
                                                        return (
                                                            <PopupTooltip position="top right" trigger={<h4 className="title" style={{ color: obj.color }}><span className={obj.className} /> {obj.percent}</h4>} style={{ width: 270 }} on="hover">
                                                                <div style={{ padding: 2 }}>
                                                                    <label style={{ fontSize: '1.1em', lineHeight: 1.5 }}>Compare Sales: ${points.commafy(sale_before.toFixed(2))}</label> <br />
                                                                    <label style={{ fontSize: '1.1em', lineHeight: 1.5 }}>Sales: ${points.commafy(sale_now.toFixed(2))}</label>
                                                                </div>
                                                            </PopupTooltip>
                                                        );
                                                    })()}
                                                </div>
                                                <h4 className="title" style={{ marginBottom: 10 }}>Sales Over Time</h4>
                                                <ResponsiveContainer width="100%" height={chartHeight - 40}>
                                                    <AreaChart data={salesChart} style={{ backgroundColor: '#40534f' }}>
                                                        <CartesianGrid horizontal={false} stroke="#fff" strokeOpacity="0.8" />
                                                        <Tooltip content={this.charWithComparetTooltip.bind(this)} />
                                                        <Area type="monotone" dataKey="compare_sales" stroke="#fff" fillOpacity="0.5" fill="#dfe3e8" stackId="1" />
                                                        <Area type="monotone" dataKey="sales" stroke="#fff" fillOpacity="0.8" fill="#1dd1a1" stackId="2" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        );
                                    }
                                }
                            })()}
                        </div>
                    </div>
                    <div className="column column_4_12 row-separator">
                        <div className="product-card" style={{ padding: 20 }}>
                            <Query query={GET_MY_FUNNEL_ORDER_TOTAL_SALES} // Compare Date Query
                                variables={{
                                    creator: currentUser.id,
                                    page_ids: state.filter_funnel_id.toString(),
                                    merchant_type: state.filter_merchant_type,
                                    dateFrom: points.sendDateToServer(compare_date.start, true),
                                    dateTo: points.sendDateToServer(compare_date.end),
                                    timezoneOffset: new Date().getTimezoneOffset(),
                                    showShopifyOnly: state.filter_showShopifyOnly
                                }} onCompleted={data => {
                                    let compare = [];
                                    if (data.getMyFunnelOrderTotalSales && data.getMyFunnelOrderTotalSales.dates.length != 0) {
                                        data.getMyFunnelOrderTotalSales.dates.forEach(data => {
                                            compare.push({ compare_date: data.date, compare_orders: data.count_order });
                                        });
                                    }
                                    this.setState({ total_order_chart_compare: compare });
                                }} notifyOnNetworkStatusChange>
                                {() => null}
                            </Query>
                            <Query query={GET_MY_FUNNEL_ORDER_TOTAL_SALES} // Sales Date Query
                                variables={{
                                    creator: currentUser.id,
                                    page_ids: state.filter_funnel_id.toString(),
                                    merchant_type: state.filter_merchant_type,
                                    dateFrom: points.sendDateToServer(state.filter_by_start_date, true),
                                    dateTo: points.sendDateToServer(state.filter_by_end_date),
                                    timezoneOffset: new Date().getTimezoneOffset(),
                                    showShopifyOnly: state.filter_showShopifyOnly
                                }} onCompleted={data => {
                                    let orders = [];
                                    if (data.getMyFunnelOrderTotalSales && data.getMyFunnelOrderTotalSales.dates.length != 0) {
                                        data.getMyFunnelOrderTotalSales.dates.forEach(data => {
                                            orders.push({ date: data.date, orders: data.count_order });
                                        });
                                    }
                                    this.setState({ total_order_chart: orders });
                                }} notifyOnNetworkStatusChange>
                                {() => null}
                            </Query>
                            {(() => {
                                let ordersChart = [], totalOrder = state.total_order_chart, totalOrderCompare = state.total_order_chart_compare;
                                if (totalOrder.length != totalOrderCompare.length) { // loading both orders and compare
                                    return <Loading width={chartHeight} height={chartHeight} />;
                                } else { // done loading
                                    totalOrder.forEach((order, i) => {
                                        let compare = totalOrderCompare[i];
                                        ordersChart.push({ date: order.date, orders: order.orders, compare_date: compare.compare_date, compare_orders: compare.compare_orders });
                                    });
                                    if (ordersChart.length == 0) { // no compiled result
                                        return (
                                            <div className="center-vertical-parent" style={{ height: chartHeight }}>
                                                <div className="center-vertical">
                                                    <img src="/assets/graphics/no-result.svg" style={{ height: chartHeight - 100 }} />
                                                    <h4 className="title" style={{ fontSize: '1.5em' }}>NO RESULT FOUND!</h4>
                                                    <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>Please try different query</label>
                                                </div>
                                            </div>
                                        );
                                    } else { // may resulta pass data to chart
                                        return (
                                            <div>
                                                <div className="float-right">
                                                    {(() => {
                                                        let order_now = 0, order_before = 0;
                                                        ordersChart.forEach(e => {
                                                            order_now += e.orders;
                                                            order_before += e.compare_orders;
                                                        });
                                                        let obj = points.getPercentageChange(order_before, order_now);
                                                        return (
                                                            <PopupTooltip position="top right" trigger={<h4 className="title" style={{ color: obj.color }}><span className={obj.className} /> {obj.percent}</h4>} style={{ width: 270 }} on="hover">
                                                                <div style={{ padding: 2 }}>
                                                                    <label style={{ fontSize: '1.1em', lineHeight: 1.5 }}>Compare Orders: {order_before}</label> <br />
                                                                    <label style={{ fontSize: '1.1em', lineHeight: 1.5 }}>Orders: {order_now}</label>
                                                                </div>
                                                            </PopupTooltip>
                                                        );
                                                    })()}
                                                </div>
                                                <h4 className="title" style={{ marginBottom: 10 }}>Orders Over Time</h4>
                                                <ResponsiveContainer width="100%" height={chartHeight - 40}>
                                                    <AreaChart data={ordersChart} style={{ backgroundColor: '#40534f' }}>
                                                        <CartesianGrid horizontal={false} stroke="#fff" strokeOpacity="0.8" />
                                                        <Tooltip content={this.charWithComparetTooltip.bind(this)} />
                                                        <Area type="monotone" dataKey="compare_orders" stroke="#fff" fillOpacity="0.5" fill="#dfe3e8" stackId="1" />
                                                        <Area type="monotone" dataKey="orders" stroke="#fff" fillOpacity="0.8" fill="#1dd1a1" stackId="2" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        );
                                    }
                                }
                            })()}
                        </div>
                    </div>
                    <div className="column column_4_12 row-separator">
                        <div className="product-card" style={{ padding: 20 }}>
                            {(() => {
                                if (state.stats_loading) {
                                    return <Loading width={"100%"} height={chartHeight - 100} />;
                                } else {
                                    let stat_now = state.stats_data, stat_before = state.stats_data_compare,
                                        compiled_data = {
                                            impression: points.getStatsDataFromArray("impression", stat_now, state.filter_funnel_id),
                                            addToCartSession: points.getStatsDataFromArray("addToCart", stat_now, state.filter_funnel_id),
                                            addToCartSessionCompare: points.getStatsDataFromArray("addToCart", stat_before, state.filter_funnel_id),
                                            initiateCheckout: points.getStatsDataFromArray("initiateCheckout", stat_now, state.filter_funnel_id),
                                            initiateCheckoutCompare: points.getStatsDataFromArray("initiateCheckout", stat_before, state.filter_funnel_id),
                                            purchased: points.getStatsDataFromArray("purchased", stat_now, state.filter_funnel_id),
                                            purchasedCompare: points.getStatsDataFromArray("purchased", stat_before, state.filter_funnel_id)
                                        };

                                    let cart_growth = points.getPercentageChange(compiled_data.addToCartSessionCompare, compiled_data.addToCartSession);
                                    let checkout_growth = points.getPercentageChange(compiled_data.initiateCheckoutCompare, compiled_data.initiateCheckout);
                                    let converted_growth = points.getPercentageChange(compiled_data.purchasedCompare, compiled_data.purchased);

                                    let cart = (compiled_data.addToCartSession / compiled_data.impression) * 100;
                                    if (isFinite(cart) && cart !== 0) cart = cart.toFixed(2);
                                    else cart = cart = "--";

                                    let checkout = (compiled_data.initiateCheckout / compiled_data.addToCartSession) * 100;
                                    if (isFinite(checkout) && checkout !== 0) checkout = checkout.toFixed(2);
                                    else checkout = checkout = "--";

                                    let converted = (compiled_data.purchased / compiled_data.initiateCheckout) * 100;
                                    if (isFinite(converted) && converted !== 0) converted = converted.toFixed(2);
                                    else converted = converted = "--";

                                    return (
                                        <div>
                                            <h4 className="title" style={{ marginBottom: 10 }}>Conversion Funnel</h4>
                                            <div className="flex-container display-inline row-separator">
                                                <div style={{ width: '60%' }}>
                                                    <label className="title">Added to cart</label> <br />
                                                    <label style={{ fontSize: '1em' }}>{points.commafy(compiled_data.addToCartSession)} sessions</label>
                                                </div>
                                                <label className="title text-right" style={{ width: '15%', fontSize: '1em' }}>{cart}</label>
                                                <label className="title text-right" style={{ width: '25%', color: cart_growth.color, fontSize: '1em' }}>
                                                    <span className={cart_growth.className} /> {cart_growth.percent}
                                                </label>
                                            </div>
                                            <div className="flex-container display-inline row-separator">
                                                <div style={{ width: '60%' }}>
                                                    <label className="title">Reached checkout</label> <br />
                                                    <label style={{ fontSize: '1em' }}>{points.commafy(compiled_data.initiateCheckout)} sessions</label>
                                                </div>
                                                <label className="title text-right" style={{ width: '15%', fontSize: '1em' }}>{checkout}</label>
                                                <label className="title text-right" style={{ width: '25%', color: checkout_growth.color, fontSize: '1em' }}>
                                                    <span className={checkout_growth.className} /> {checkout_growth.percent}
                                                </label>
                                            </div>
                                            <div className="flex-container display-inline">
                                                <div style={{ width: '60%' }}>
                                                    <label className="title">Sessions converted</label> <br />
                                                    <label style={{ fontSize: '1em' }}>{points.commafy(compiled_data.purchased)} sessions</label>
                                                </div>
                                                <label className="title text-right" style={{ width: '15%', fontSize: '1em' }}>{converted}</label>
                                                <label className="title text-right" style={{ width: '25%', color: converted_growth.color, fontSize: '1em' }}>
                                                    <span className={converted_growth.className} /> {converted_growth.percent}
                                                </label>
                                            </div>
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                    </div>
                    <span className="clear" />
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AdminRestorePaid);