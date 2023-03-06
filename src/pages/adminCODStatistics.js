import React from 'react';
import toastr from 'toastr';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
import {
    ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
    BarChart, Bar,
    PieChart, Pie,
} from 'recharts';
import { GET_COD_TOTAL_ORDER_PER_COUNTRY, GET_COD_ORDER_STATUS_RATES_PER_COUNTRY, GET_ORDER_METRICS, GET_COD_ORDER_PRODUCT_COST, GET_ALL_AFFILIATE, GET_PURCHASE_ORDER, GET_FUNNEL_PRODUCTS, PUSH_NOTIFICATION, GET_MY_PAY_CHECK, GET_SEARCHED_USERS } from '../queries';
import { Query, Mutation } from 'react-apollo';
import Loading from '../components/loading';
import { Table, Tbody } from '../components/table';
import { Link } from 'react-router-dom';
import Pagination from '../components/pagination';
import Modal from '../components/ModalComponent'; 
import ButtonWithPopup from '../components/buttonWithPopup';
import Checkbox from '../components/checkbox';
import LoadingPage from '../components/loadingPage';
import InfiniteCalendar, { Calendar, withRange, } from 'react-infinite-calendar';
import SearchField from '../components/searchField';
const CalendarWithRange = withRange(Calendar);
const points = require('../../Global_Values');

const total_payout = {
    t_pay_pending: 0,
    t_pay_paid: 0
}

const investors_inventory = {
    current_page: 1,
    affiliate_limit: 5,
    show_inventory: false,
    affiliate_email: ''
}

const low_inventory = {
    current_page_low_inventory: 1,
    low_inventory_limit: 5,
    low_inventory_note: "",
}

const filter = {
    date_range_start: "",
    date_range_end: "",
    which_country: ["PH", "AE", "SA", "IN"],
    which_courier: "",
}

class AdminCODStatistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...total_payout,
            ...filter,
            ...investors_inventory,
            ...low_inventory,
            is_page_loading: true,
            new_message_search: "",
            new_message_receiver_id: "",
            new_message_show_result: false,
        }
    }

    componentDidMount() {
        toastr.options = points.toastrInitialize();
        const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toDateString();
        const end = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toDateString();
        this.setState({ is_page_loading: false, date_range_start: start, date_range_end: end });
    }

    componentDidUpdate() {
        if (this.state.new_message_search === undefined) {
            console.log('updated bleh', this.state.new_message_search);
            this.setState({
                new_message_search: "",
                new_message_receiver_id: "",
                new_message_show_result: false,
            })
        }

    }

    change_chart_date_range(data) {
        if (data.eventType == 3) {
            this.setState({ date_range_start: data.start.toDateString(), date_range_end: data.end.toDateString() })
        }
    }

    toggleInventoryView(affiliate_email) {
        this.setState({ show_inventory: !this.state.show_inventory, affiliate_email: affiliate_email ? affiliate_email : '' });
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

    pieChartCustomToolTip({ active, payload }) {
        if (active) {
            if (!payload) return null;
            payload = payload.reduce(e => e);
            const label = points.capitalizeWord(payload.payload.name);
            return (
                <div style={{ backgroundColor: '#232d2b', border: 'none', color: '#fff', opacity: 0.8, padding: '15px 10px' }}>
                    <div className="row-separator">
                        <label className="header-medium-bold text-center">{label}</label>
                    </div>
                    <div className="row-separator">
                        <div className="column column_6_12">
                            <label>Orders: </label>
                        </div>
                        <div className="column column_6_12 text-right">
                            <label>{points.commafy(payload.payload.value)}</label>
                        </div>
                        <span className="clear" />
                    </div>
                    <div className="row-separator">
                        <div className="column column_6_12">
                            <label>Percentage: </label>
                        </div>
                        <div className="column column_6_12 text-right">
                            <label>{payload.payload.percentage}%</label>
                        </div>
                        <span className="clear" />
                    </div>
                    <div className="row-separator">
                        <div className="column column_6_12">
                            <label>Average: </label>
                        </div>
                        <div className="column column_6_12 text-right">
                            <label>{payload.payload.avg}</label>
                        </div>
                        <span className="clear" />
                    </div>
                </div>
            )
        }
    }

    changeShowCountry(value, iso2) {
        var prevVal = this.state.which_country;
        if (value) prevVal.push(iso2);
        else prevVal = prevVal.filter(el => el != iso2);
        this.setState({ which_country: prevVal });
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>COD Statistics - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const state = this.state;
        if (state.is_page_loading) return <LoadingPage />;
        const fulfiller_link = "/dashboard?key=" + this.props.session.getCurrentUser.pass_key + "&dateStart=" + new Date(state.date_range_start).getTime() + "&dateEnd=" + new Date(state.date_range_end).getTime();
        const countryList = points.cod_available_country("no_country").sort((a, b) => a.name < b.name ? -1 : 1);
        const showByCountry = countryList.filter(el => state.which_country.length != 0 ? state.which_country.includes(el.iso2) : el);
        return (
            <div className="admin funnel">
                {this.head()}
                <div className="newPageHeader">
                    <div className="column column_4_12">
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>COD Statistics</h4>
                    </div>
                    <span className="clear" />
                </div>
                <div className="page-container">
                    <div className="column column_12_12 row-separator">
                        <div className="filter-container">
                            <div style={{ position: 'absolute', left: 20 }}>
                                <h3>Country: {state.which_country.length != 0 ? showByCountry.map(e => e.iso2).join(", ") : "ALL"}</h3>
                            </div>
                            <Link to="/admin-exports-csv" style={{ lineHeight: 0 }}>
                                Exports CSV
                            </Link>
                            <ButtonWithPopup data={{
                                triggerDOM: <button className="btn-success stretch-to-mobile" style={{ marginLeft: 10 }}>Show by Courier</button>,
                                popupPosition: "bottom center",
                                text: (
                                    <div className="text-left">
                                        <Checkbox
                                            id="active_courier_all"
                                            label="Show all"
                                            labelClassName="header-medium-bold font-small"
                                            checked={!state.which_courier ? true : false}
                                            onChange={value => this.setState({ which_courier: "" })}
                                            containerClassName="row-separator"
                                        />
                                        <Checkbox
                                            id="active_safearrival_all"
                                            label="Safe Arrival"
                                            labelClassName="header-medium-bold font-small"
                                            checked={state.which_courier == "safearrival" ? true : false}
                                            onChange={value => this.setState({ which_courier: "safearrival" })}
                                            containerClassName="row-separator"
                                        />
                                        <Checkbox
                                            id="active_wimo_all"
                                            label="Wimo"
                                            labelClassName="header-medium-bold font-small"
                                            checked={state.which_courier == "wimo" ? true : false}
                                            onChange={value => this.setState({ which_courier: "wimo" })}
                                        />
                                    </div>
                                ),
                                arrow: true,
                                style: { borderRadius: 3, padding: 20, minWidth: 160, maxWidth: 160 },
                                checkORtimesButton: false
                            }} />
                            <ButtonWithPopup data={{
                                triggerDOM: <button className="btn-success stretch-to-mobile" style={{ marginLeft: 10 }}>Show by country</button>,
                                popupPosition: "bottom center",
                                text: (
                                    <div className="text-left">
                                        <Checkbox
                                            id="active_checkbox_all"
                                            label="Show all"
                                            labelClassName="header-medium-bold font-small"
                                            checked={state.which_country.length == 0 ? true : false}
                                            onChange={value => this.setState({ which_country: [] })}
                                            containerClassName="row-separator"
                                        />
                                        {countryList.map((country, index) => {
                                            const stateName = "active_checkbox_" + country.iso2.toLowerCase();
                                            return (
                                                <Checkbox
                                                    id={stateName}
                                                    label={"By " + points.capitalizeWord(country.iso2)}
                                                    labelClassName="header-medium-bold font-small"
                                                    checked={state.which_country.includes(country.iso2) ? true : false}
                                                    onChange={value => this.changeShowCountry(value, country.iso2)}
                                                    containerClassName={(countryList.length - 1) != index ? "row-separator" : ""}
                                                    key={index}
                                                />
                                            );
                                        })}
                                    </div>
                                ),
                                arrow: true,
                                style: { borderRadius: 3, padding: 20, minWidth: 150, maxWidth: 150 },
                                checkORtimesButton: false
                            }} />
                            <ButtonWithPopup data={{
                                popupPosition: "bottom right",
                                triggerDOM: (
                                    <div className="stretch-to-mobile custom-select" style={{ marginLeft: 10, width: 250 }}>
                                        <div className="select-selected stretch-width text-center">{state.date_range_start && state.date_range_end ? state.date_range_start.substring(4) + " - " + state.date_range_end.substring(4) : "Date Filter"}</div>
                                    </div>
                                ),
                                text: (
                                    <div className="infinite-calendar">
                                        <InfiniteCalendar
                                            Component={CalendarWithRange}
                                            width={300}
                                            height={400}
                                            selected={{ start: state.date_range_start ? state.date_range_start : new Date(), end: state.date_range_end ? state.date_range_end : new Date(), }}
                                            locale={{ headerFormat: 'MMM Do' }}
                                            onSelect={data => this.change_chart_date_range(data)}
                                            theme={points.infiniteCalendarTheme()}
                                        />
                                    </div>
                                ),
                                loading: false,
                                padding: 0,
                                style: { width: "fit-content" },
                                checkORtimesButton: false
                            }} />
                            <SearchField
                                name="new_message_search"
                                value={state.new_message_search}
                                placeHolder="Search by Email, First Name or Last Name"
                                tooltip="Search by Email, First Name or Last Name"
                                tooltipLocation="top center"
                                // containerClassName="stretch-width"
                                containerClassName="stretch-to-mobile"
                                width={320} containerStyle={{ margin: '0 5px' }}
                                onSubmit={value => this.setState({ new_message_search: value, new_message_show_result: true })}
                            />
                            {state.new_message_show_result && state.new_message_search !== "" &&
                                <ul className="item-list-float">
                                    <Query query={GET_SEARCHED_USERS(`{ id firstName email lastName }`)} variables={{ search: state.new_message_search, limit: 5 }} notifyOnNetworkStatusChange>
                                        {({ data, loading, refetch, error }) => {
                                            if (loading) return <li><Loading width={30} height={30} /></li>;
                                            else if (error) return <li>An error has occurred please try again</li>;
                                            else if (data.getAllUsers.length === 0) return <li>No User Found</li>;
                                            return data.getAllUsers.map((user, i) => {
                                                let name = points.capitalizeWord(user.firstName + " " + user.lastName);
                                                return <li onClick={() => this.setState({ new_message_search: name, new_message_receiver_id: user.id, new_message_show_result: false })} key={i}>{user.email}</li>;
                                            });
                                        }}
                                    </Query>
                                </ul>
                            }
                        </div>
                    </div>
                    <div className="column column_9_12 row-separator">
                        <div className="column column_12_12 row-separator">
                            <div className="product-card" style={{ padding: 20 }}>
                                <h3 className="text-center">COD ORDER STATUS PER COUNTRY</h3>
                                <Query query={GET_COD_ORDER_STATUS_RATES_PER_COUNTRY}
                                    variables={{
                                        dateStart: points.sendDateToServer(state.date_range_start, true),
                                        dateEnd: points.sendDateToServer(state.date_range_end),
                                        location: state.which_country.toString(),
                                        creator: state.new_message_receiver_id
                                    }}>
                                    {({ data, loading, refetch, error }) => {
                                        if (loading) {
                                            return (
                                                <div className="flex-container display-inline" style={{ width: '100%', height: 200 }}>
                                                    <Loading width={150} height={150} />
                                                </div>
                                            );
                                        }
                                        if (error) {
                                            return (
                                                <div className="center-vertical-parent" style={{ height: 200 }}>
                                                    <div className="center-vertical">
                                                        <img src="/assets/graphics/no-result.svg" style={{ height: '50%' }} />
                                                        <h4 className="title" style={{ fontSize: '1.5em' }}>OOPS! THAT'S AN ERROR!</h4>
                                                        <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>An error occurred while trying to get the order per country</label>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        const result = JSON.parse(data.getCODOrderStatusRatesPerCountry.jsonStr);
                                        return showByCountry.map((country, c_index) => {
                                            const partial_percentage = 100 / result[country.iso2].reduce((a, b) => a + b.count, 0);
                                            const chart_data = result[country.iso2].map(el => {
                                                el.name = el.status;
                                                el.value = el.count;
                                                el.percentage = (partial_percentage * el.value).toFixed(0);
                                                el.avg = el.avg.toFixed(2);
                                                delete el.status;
                                                delete el.count;
                                                return el;
                                            });
                                            return (
                                                <div className={"column " + (state.which_country.length == 1 ? "column_12_12" : "column_3_12") + " row-separator" + (c_index % 4 == 0 ? " clear" : "")} key={c_index}>
                                                    <h3 className="text-center one-line-ellipsis cursor-pointer" onClick={() => window.open(fulfiller_link + "&loc=" + country.iso2)}>{country.name}</h3>
                                                    {chart_data.filter(el => el.value == 0).length == 6 ? // no result
                                                        <div className="flex-container display-inline" style={{ borderRadius: '50%', backgroundColor: '#dbe1df', width: 160, height: 160, margin: '0 auto', marginTop: 30 }}>
                                                            <label className="font-roboto-bold">No Result</label>
                                                        </div>
                                                        :
                                                        <ResponsiveContainer width="100%" height={200}>
                                                            <PieChart>
                                                                <Pie dataKey="value" data={chart_data} labelLine={false} label={this.pieChartPercentageLabel} onClick={x => window.open(fulfiller_link + "&loc=" + country.iso2 + "&order_status=" + x.payload.payload.name)}>
                                                                    {
                                                                        chart_data.map((el, index) => {
                                                                            return <Cell fill={points.getBGandFontColor(el.name.toLowerCase().replace("-", "")).bg} key={index} />
                                                                        })
                                                                    }
                                                                </Pie>
                                                                <Tooltip content={this.pieChartCustomToolTip} />
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    }
                                                </div>
                                            );
                                        })
                                    }}
                                </Query>
                                <div className="column column_12_12 text-center flex-container">
                                    <label style={{ margin: '0 10px' }}>
                                        <span style={{ backgroundColor: points.getBGandFontColor('unfulfilled').bg, padding: '0px 7px', marginRight: 5 }} />
                                        Unfulfilled
                                    </label>
                                    <label style={{ margin: '0 10px' }}>
                                        <span style={{ backgroundColor: points.getBGandFontColor('hold').bg, padding: '0px 7px', marginRight: 5 }} />
                                        Hold
                                    </label>
                                    <label style={{ margin: '0 10px' }}>
                                        <span style={{ backgroundColor: points.getBGandFontColor('pickedup').bg, padding: '0px 7px', marginRight: 5 }} />
                                        Picked-up
                                    </label>
                                    <label style={{ margin: '0 10px' }}>
                                        <span style={{ backgroundColor: points.getBGandFontColor('cancelled').bg, padding: '0px 7px', marginRight: 5 }} />
                                        Cancelled
                                    </label>
                                    <label style={{ margin: '0 10px' }}>
                                        <span style={{ backgroundColor: points.getBGandFontColor('delivered').bg, padding: '0px 7px', marginRight: 5 }} />
                                        Delivered
                                    </label>
                                    <label style={{ margin: '0 10px' }}>
                                        <span style={{ backgroundColor: points.getBGandFontColor('paid').bg, padding: '0px 7px', marginRight: 5 }} />
                                        Paid
                                    </label>
                                </div>
                                {/* <h3 className="text-center">COD Metrics</h3>
                                <Query query={GET_ORDER_METRICS}
                                    variables={{
                                        dateStart: points.sendDateToServer(state.date_range_start, true),
                                        dateEnd: points.sendDateToServer(state.date_range_end),
                                        location: state.which_country.toString()
                                    }}>
                                    {({ data, loading, refetch, error }) => {
                                        if(loading) {
                                            return (
                                                <div className="flex-container display-inline" style={{ width: '100%', height: 200 }}>
                                                    <Loading width={150} height={150} />
                                                </div>
                                            );
                                        }
                                        if(error) {
                                            return (
                                                <div className="center-vertical-parent" style={{ height: 200 }}>
                                                    <div className="center-vertical">
                                                        <img src="/assets/graphics/no-result.svg" style={{ height: '50%' }} />
                                                        <h4 className="title" style={{ fontSize: '1.5em' }}>OOPS! THAT'S AN ERROR!</h4>
                                                        <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>An error occurred while trying to get the order per country</label>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        const result = JSON.parse(data.getOrderMetrics.jsonStr);
                                        console.log("FE ==>", result)
                                        return null;
                                    }}
                                </Query>
                                <div className="column column_12_12 text-center flex-container">
                                    <label style={{ margin: '0 10px' }}>
                                        <span style={{ backgroundColor: points.getBGandFontColor('unfulfilled').bg, padding: '0px 7px', marginRight: 5 }} />
                                        Total Sales Revenue
                                    </label>
                                    <label style={{ margin: '0 10px' }}>
                                        <span style={{ backgroundColor: points.getBGandFontColor('hold').bg, padding: '0px 7px', marginRight: 5 }} />
                                        Total Profit Made
                                    </label>
                                    <label style={{ margin: '0 10px' }}>
                                        <span style={{ backgroundColor: points.getBGandFontColor('pickedup').bg, padding: '0px 7px', marginRight: 5 }} />
                                        Total Pending Sales
                                    </label>
                                    <label style={{ margin: '0 10px' }}>
                                        <span style={{ backgroundColor: points.getBGandFontColor('cancelled').bg, padding: '0px 7px', marginRight: 5 }} />
                                        Total Cancelled Sales
                                    </label>
                                </div> */}
                                <span className="clear" />
                            </div>
                        </div>
                        <div className="column column_12_12 row-separator">
                            <div className="product-card" style={{ padding: 20 }}>
                                <h3 className="text-center">COD ORDER PER COUNTRY</h3>
                                <Query query={GET_COD_TOTAL_ORDER_PER_COUNTRY}
                                    variables={{
                                        dateStart: points.sendDateToServer(state.date_range_start, true),
                                        dateEnd: points.sendDateToServer(state.date_range_end),
                                        location: state.which_country.toString(),
                                        creator: state.new_message_receiver_id
                                    }}>
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
                                                <div className="center-vertical-parent" style={{ height: 300 }}>
                                                    <div className="center-vertical">
                                                        <img src="/assets/graphics/no-result.svg" style={{ height: '50%' }} />
                                                        <h4 className="title" style={{ fontSize: '1.5em' }}>OOPS! THAT'S AN ERROR!</h4>
                                                        <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>An error occurred while trying to get the order per country</label>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        const chart1_data = [];
                                        const result = JSON.parse(data.getCODtotalOrderPerCountry.jsonStr);
                                        if (result.data.length != 0) {
                                            result.data.forEach(el => {
                                                const country = showByCountry.filter(e => e.iso2 == el.country).reduce(e => e);
                                                chart1_data.push({ name: country.name, [el.country]: el.total });
                                            });
                                        } else {
                                            showByCountry.forEach(el => {
                                                chart1_data.push({ name: el.name, [el.iso2]: 0 });
                                            })
                                        }
                                        chart1_data.sort((a, b) => a.name < b.name ? -1 : 1);                                        
                                        return (
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={chart1_data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    {showByCountry.map((el, i) => {
                                                        return <Bar dataKey={el.iso2} fill={el.fill} key={i} />
                                                    })}
                                                </BarChart>
                                            </ResponsiveContainer>
                                        );
                                    }}
                                </Query>
                            </div>
                        </div>
                        <span className="clear" />
                    </div>
                    <div className="column column_3_12 row-separator">
                        <div className="product-card row-separator" style={{ padding: 17 }}>
                            <h2 className="text-center one-line-ellipsis" style={{ margin: 0 }}>Payout</h2>
                            <div className="column column_12_12 row-separator">
                                <label className="header-medium-bold">Pending</label>
                                <div className="text-center">
                                    <Query query={GET_MY_PAY_CHECK}
                                        variables={{
                                            dateStart: points.sendDateToServer(state.date_range_start, true),
                                            dateEnd: points.sendDateToServer(state.date_range_end),
                                            fulfillerLocation: state.which_country.toString(),
                                            creator: state.new_message_receiver_id
                                        }}
                                        onCompleted={data => this.setState({ t_pay_pending: data.getMyPayCheck.count })} notifyOnNetworkStatusChange>
                                        {({ data, loading, refetch, error }) => {
                                            if (loading) return <Loading width={30} height={30} />;
                                            else if (error) return <div className="color-dark-red" style={{ fontSize: '1.5em', padding: 3 }}><label>Error</label></div>;
                                            return <label className="color-orange" style={{ fontSize: '2em' }}>${points.commafy(data.getMyPayCheck.count.toFixed(2))}</label>;
                                        }}
                                    </Query>
                                </div>
                            </div>
                            <div className="column column_12_12 row-separator" style={{ padding: 0 }}>
                                <div className="column column_6_12">
                                    <label className="header-medium-bold">Paid</label>
                                    <div className="text-center">
                                        <Query query={GET_MY_PAY_CHECK}
                                            variables={{
                                                dateStart: points.sendDateToServer(state.date_range_start, true),
                                                dateEnd: points.sendDateToServer(state.date_range_end),
                                                fulfillerLocation: state.which_country.toString(),
                                                order_status: "paid",
                                                creator: state.new_message_receiver_id
                                            }}
                                            onCompleted={data => this.setState({ t_pay_paid: data.getMyPayCheck.count })} notifyOnNetworkStatusChange>
                                            {({ data, loading, refetch, error }) => {
                                                if (loading) return <Loading width={30} height={30} />;
                                                else if (error) return <div className="color-dark-red" style={{ fontSize: '1.5em', padding: 3 }}><label>Error</label></div>;
                                                return <label className="color-green" style={{ fontSize: '1.7em' }}>${points.commafy(data.getMyPayCheck.count.toFixed(2))}</label>;
                                            }}
                                        </Query>
                                    </div>
                                </div>
                                <div className="column column_6_12">
                                    <label className="header-medium-bold">Collected</label>
                                    <div className="text-center">
                                        <Query query={GET_MY_PAY_CHECK}
                                            variables={{
                                                dateStart: points.sendDateToServer(state.date_range_start, true),
                                                dateEnd: points.sendDateToServer(state.date_range_end),
                                                fulfillerLocation: state.which_country.toString(),
                                                order_status: "delivered,paid",
                                                isAdminPayout: true,
                                                creator: state.new_message_receiver_id
                                            }}
                                            onCompleted={data => this.setState({ t_pay_pending: data.getMyPayCheck.count })} notifyOnNetworkStatusChange>
                                            {({ data, loading, refetch, error }) => {
                                                if (loading) return <Loading width={30} height={30} />;
                                                else if (error) return <div className="color-dark-red" style={{ fontSize: '1.5em', padding: 3 }}><label>Error</label></div>;
                                                return <label className="color-green" style={{ fontSize: '1.7em' }}>${points.commafy(data.getMyPayCheck.count.toFixed(2))}</label>;
                                            }}
                                        </Query>
                                    </div>
                                </div>
                                <span className="clear" />
                            </div>
                            <span className="clear" />
                            {(() => {
                                const total = state.t_pay_pending + state.t_pay_paid, paid = (state.t_pay_paid / total * 100).toFixed(2), pending = (100 - paid).toFixed(2);
                                return (
                                    <div style={{ width: '80%', margin: '0 auto', marginTop: 5 }}>
                                        {paid > 0 && <div className="column color-white display-inline flex-container" style={{ width: paid + "%", backgroundColor: '#19c594', height: 4, fontSize: '0.65em' }} />}
                                        {pending > 0 && <div className="column color-white display-inline flex-container" style={{ width: pending + "%", backgroundColor: '#dbe1df', height: 4, fontSize: '0.65em' }} />}
                                    </div>
                                );
                            })()}
                        </div>
                        <div className="product-card row-separator" style={{ padding: 20 }}>
                            <div style={{ position: 'absolute', top: 5, right: 5 }}>
                                <span className="badge" style={{ position: 'relative', top: 0, borderRadius: '20px', fontSize: '10px' }}>Beta</span>
                            </div>
                            <h2 className="text-center one-line-ellipsis" style={{ margin: 0 }}>Delivery Cost</h2>
                            <div className="flex-container display-inline">
                                {showByCountry.map((country, index) => {
                                    return (
                                        <div className="column text-center" style={{ width: state.which_country.length == 1 ? '100%' : '50%' }} key={index}>
                                            {state.which_country.length != 1 &&
                                                <label className="color-black font-roboto-bold one-line-ellipsis" style={{ display: 'block', margin: '10px 0 5px 0' }}>{country.name}</label>
                                            }
                                            <Query query={GET_COD_ORDER_PRODUCT_COST}
                                                variables={{
                                                    costBy: "delivery",
                                                    dateStart: points.sendDateToServer(state.date_range_start, true),
                                                    dateEnd: points.sendDateToServer(state.date_range_end),
                                                    location: state.which_country.toString(),
                                                    creator: state.new_message_receiver_id
                                                }}>
                                                {({ data, loading, refetch, error }) => {
                                                    if (loading) return <Loading width={20} height={20} />;
                                                    else if (error) return <label className="color-dark-red" style={{ fontSize: state.which_country.length == 1 ? '3em' : '1.5em' }}>ERR</label>;
                                                    const result = JSON.parse(data.getCODOrderProductCost.jsonStr);
                                                    return <label className="color-orange" style={{ fontSize: state.which_country.length == 1 ? '3em' : '1.5em' }}>${points.commafy(result[country.iso2].toFixed(2))}</label>;
                                                }}
                                            </Query>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="product-card row-separator" style={{ padding: 20 }}>
                            <div style={{ position: 'absolute', top: 5, right: 5 }}>
                                <span className="badge" style={{ position: 'relative', top: 0, borderRadius: '20px', fontSize: '10px' }}>Beta</span>
                            </div>
                            <h2 className="text-center one-line-ellipsis" style={{ margin: 0 }}>Fulfillment Cost</h2>
                            <div className="flex-container display-inline">
                                {showByCountry.map((country, index) => {
                                    return (
                                        <div className="column text-center" style={{ width: state.which_country.length == 1 ? '100%' : '50%' }} key={index}>
                                            {state.which_country.length != 1 &&
                                                <label className="color-black font-roboto-bold one-line-ellipsis" style={{ display: 'block', margin: '10px 0 5px 0' }}>{country.name}</label>
                                            }
                                            <Query query={GET_COD_ORDER_PRODUCT_COST}
                                                variables={{
                                                    costBy: "fulfillment",
                                                    dateStart: points.sendDateToServer(state.date_range_start, true),
                                                    dateEnd: points.sendDateToServer(state.date_range_end),
                                                    location: state.which_country.toString(),
                                                    creator: state.new_message_receiver_id
                                                }}>
                                                {({ data, loading, refetch, error }) => {
                                                    if (loading) return <Loading width={20} height={20} />;
                                                    else if (error) return <label className="color-dark-red" style={{ fontSize: state.which_country.length == 1 ? '3em' : '1.5em' }}>ERR</label>;
                                                    const result = JSON.parse(data.getCODOrderProductCost.jsonStr);
                                                    return <label className="color-orange" style={{ fontSize: state.which_country.length == 1 ? '3em' : '1.5em' }}>${points.commafy(result[country.iso2].toFixed(2))}</label>
                                                }}
                                            </Query>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="product-card" style={{ padding: 20 }}>
                            <h2 className="text-center one-line-ellipsis" style={{ margin: 0 }}>Inventory Cost</h2>
                            <div className="flex-container display-inline">
                                {showByCountry.map((country, index) => {
                                    return (
                                        <div className="column text-center" style={{ width: state.which_country.length == 1 ? '100%' : '50%' }} key={index}>
                                            {state.which_country.length != 1 &&
                                                <label className="color-black font-roboto-bold one-line-ellipsis" style={{ display: 'block', margin: '10px 0 5px 0' }}>{country.name}</label>
                                            }
                                            <Query query={GET_COD_ORDER_PRODUCT_COST}
                                                variables={{
                                                    costBy: "inventory",
                                                    dateStart: points.sendDateToServer(state.date_range_start, true),
                                                    dateEnd: points.sendDateToServer(state.date_range_end),
                                                    location: state.which_country.toString(),
                                                    creator: state.new_message_receiver_id
                                                }}>
                                                {({ data, loading, refetch, error }) => {
                                                    if (loading) return <Loading width={20} height={20} />;
                                                    else if (error) return <label className="color-dark-red" style={{ fontSize: state.which_country.length == 1 ? '3em' : '1.5em' }}>ERR</label>;
                                                    const result = JSON.parse(data.getCODOrderProductCost.jsonStr);
                                                    return <label className="color-orange" style={{ fontSize: state.which_country.length == 1 ? '3em' : '1.5em' }}>${points.commafy(result[country.iso2].toFixed(2))}</label>
                                                }}
                                            </Query>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="column column_6_12">
                        <div className="product-card" style={{ padding: "20px 20px 70px" }}>
                            <h3 className="text-center">Running Low Inventory</h3>
                            <div style={{ height: 250, overflow: 'auto' }}>
                                <Query query={
                                    GET_PURCHASE_ORDER(`{ count affiliate_email sold_item_serial_numbers returning_item_serial_numbers product_variant_id product_price remainingQty totalQty affiliate_budget warnWhenLow warnQty }`)
                                } variables={{
                                    low_inventory: true,
                                    page: state.current_page_low_inventory,
                                    limit: state.low_inventory_limit
                                }}>
                                    {({ data, loading, refetch, error }) => {
                                        if (loading) {
                                            return (
                                                <div className="flex-container display-inline" style={{ width: '100%', height: 270 }}>
                                                    <Loading width={150} height={150} />
                                                </div>
                                            );
                                        } else if (error) {
                                            return (
                                                <div className="center-vertical-parent" style={{ height: "100%" }}>
                                                    <div className="center-vertical" style={{ height: "100%" }}>
                                                        <img src="/assets/graphics/no-result.svg" style={{ height: '85%' }} />
                                                        <h4 className="title" style={{ fontSize: '1.5em' }}>OOPS! THAT'S AN ERROR!</h4>
                                                        <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>An error occurred while trying to get the low inventory</label>
                                                    </div>
                                                </div>
                                            );
                                        } else if (data.getPurchaseOrders.length == 0) {
                                            return (
                                                <div className="center-vertical-parent" style={{ height: "100%" }}>
                                                    <div className="center-vertical" style={{ height: "100%" }}>
                                                        <img src="/assets/graphics/no-result.svg" style={{ height: '85%' }} />
                                                        <h4 className="title" style={{ fontSize: '1.5em' }}>OOPS! NO RESULT!</h4>
                                                        <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>No low inventory Found!</label>
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            const totalLowInventory = data.getPurchaseOrders[0].count;
                                            return (
                                                <div>
                                                    <Table headers={[{ text: "Product Name" }, { text: "Product Cost" }, { text: "Remaining Qty" }, { text: "Sold Qty" }, { text: "Returning Qty" }, { text: "Total Qty" }, { text: "Budget" }, { text: "Action" }]} containerStyle={{ fontSize: '0.9em', padding: 10 }} >
                                                        {data.getPurchaseOrders.map((po, index) => {
                                                            return (
                                                                <Tbody index={index} key={index}>
                                                                    <div className="one-line-ellipsis">
                                                                        <Query query={GET_FUNNEL_PRODUCTS(`{ productName }`)} variables={{ id: po.product_variant_id }}>
                                                                            {({ data, loading, refetch, error }) => {
                                                                                if (loading) return <label>Loading...</label>;
                                                                                if (error) return <label>Error!</label>;
                                                                                if (!data.getFunnelProducts || (data.getFunnelProducts && data.getFunnelProducts.length == 0)) return <label>Not Found!</label>;
                                                                                var productName = data.getFunnelProducts[0].productName;
                                                                                return <label>{productName}</label>;
                                                                            }}
                                                                        </Query>
                                                                    </div>
                                                                    <div>
                                                                        <label>${po.product_price}</label>
                                                                    </div>
                                                                    <div>
                                                                        <label>{po.remainingQty}x</label>
                                                                    </div>
                                                                    <div>
                                                                        <label>{po.sold_item_serial_numbers.length}x</label>
                                                                    </div>
                                                                    <div>
                                                                        <label>{po.returning_item_serial_numbers.length}x</label>
                                                                    </div>
                                                                    <div>
                                                                        <label>{po.totalQty}x</label>
                                                                    </div>
                                                                    <div>
                                                                        <label>${points.commafy(po.affiliate_budget)}</label>
                                                                    </div>
                                                                    <div>
                                                                        <ButtonWithPopup data={{
                                                                            triggerDOM: <span id={"notify_" + index} className="clickable">Notify</span>,
                                                                            popupPosition: "left top",
                                                                            text: (
                                                                                <div className="text-left">
                                                                                    <h3 className="text-center">Send a message</h3>
                                                                                    <h4 className="row-separator">Email: {po.affiliate_email}</h4>
                                                                                    <textarea rows="6" className="message-area font-roboto-light stretch-width" name="funnel_ga" value={state.low_inventory_note} onChange={event => this.setState({ low_inventory_note: event.target.value })} />
                                                                                    <Mutation
                                                                                        mutation={PUSH_NOTIFICATION}
                                                                                        variables={{ email: po.affiliate_email, sendTo: null, type: "info", message: this.state.low_inventory_note }}>
                                                                                        {(pushNotification, { data, loading, error }) => {
                                                                                            return (
                                                                                                <ButtonWithPopup data={{
                                                                                                    triggerDOM: <button id="notify_yes_no" className="btn-success stretch-width" disabled={false}>Send Message</button>,
                                                                                                    popupPosition: "top center",
                                                                                                    text: <label style={{ fontSize: '1.3em' }}>Are you sure?</label>,
                                                                                                    action: () => points.executeMutation(pushNotification, toastr, () => {
                                                                                                        document.getElementById("notify_" + index).click();
                                                                                                        points.toastrPrompt(toastr, "success", "Affiliate Successfully Notified", "Success");
                                                                                                    }),
                                                                                                    triggerID: "notify_yes_no",
                                                                                                    loading: false,
                                                                                                    padding: 10,
                                                                                                    style: { minWidth: 200, width: 200 }
                                                                                                }} />
                                                                                            );
                                                                                        }}
                                                                                    </Mutation>
                                                                                </div>
                                                                            ),
                                                                            onClose: () => this.setState({ low_inventory_note: "" }),
                                                                            triggerID: "notify_" + index,
                                                                            loading: false,
                                                                            padding: 5,
                                                                            checkORtimesButton: false,
                                                                            style: { borderRadius: 5, padding: 5, minWidth: 300, maxWidth: 300 }
                                                                        }} />
                                                                    </div>
                                                                </Tbody>
                                                            );
                                                        })}
                                                    </Table>
                                                    <Pagination displayPageCount={state.low_inventory_limit} totalPage={totalLowInventory} pageNumber={state.current_page_low_inventory} action={result => this.setState({ current_page_low_inventory: result })} style={{ position: 'absolute', bottom: 20, right: 20 }} />
                                                </div>
                                            );
                                        }
                                    }}
                                </Query>
                            </div>
                        </div>
                    </div>
                    <div className="column column_6_12">
                        <div className="product-card" style={{ padding: "20px 20px 70px" }}>
                            <h3 className="text-center">Investor's Inventory</h3>
                            <div style={{ height: 250, overflow: 'auto' }}>
                                <Query query={GET_ALL_AFFILIATE} variables={{ page: state.current_page, limit: state.affiliate_limit }}>
                                    {({ data, loading, refetch, error }) => {
                                        if (loading) {
                                            return (
                                                <div className="flex-container display-inline" style={{ width: '100%', height: 270 }}>
                                                    <Loading width={150} height={150} />
                                                </div>
                                            );
                                        } else if (error) {
                                            return (
                                                <div className="center-vertical-parent" style={{ height: "100%" }}>
                                                    <div className="center-vertical" style={{ height: "100%" }}>
                                                        <img src="/assets/graphics/no-result.svg" style={{ height: '85%' }} />
                                                        <h4 className="title" style={{ fontSize: '1.5em' }}>OOPS! THAT'S AN ERROR!</h4>
                                                        <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>An error occurred while trying to get the investor's inventory</label>
                                                    </div>
                                                </div>
                                            );
                                        } else if (data.getAllAffiliate.length == 0) {
                                            return (
                                                <div className="center-vertical-parent" style={{ height: "100%" }}>
                                                    <div className="center-vertical" style={{ height: "100%" }}>
                                                        <img src="/assets/graphics/no-result.svg" style={{ height: '85%' }} />
                                                        <h4 className="title" style={{ fontSize: '1.5em' }}>OOPS! NO RESULT!</h4>
                                                        <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>No Affiliate Found!</label>
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            const totalAffiliate = data.getAllAffiliate[0].count;
                                            return (
                                                <div>
                                                    <Table headers={[{ text: "Name" }, { text: "Email" }, { text: "Total Funds" }, { text: "Action" }]} containerStyle={{ fontSize: '0.9em', padding: 10 }} >
                                                        {data.getAllAffiliate.map((user, index) => {
                                                            const name = points.capitalizeWord(user.firstName + " " + user.lastName);
                                                            return (
                                                                <Tbody index={index} key={index}>
                                                                    <div>
                                                                        <label>{name}</label>
                                                                    </div>
                                                                    <div>
                                                                        <label>{user.email}</label>
                                                                    </div>
                                                                    <div>
                                                                        <label>${points.commafy(user.investment_total.toFixed(2))}</label>
                                                                    </div>
                                                                    <div>
                                                                        <u className="clickable" onClick={() => this.toggleInventoryView(user.email)}>View</u>
                                                                    </div>
                                                                </Tbody>
                                                            );
                                                        })}
                                                    </Table>
                                                    <Pagination displayPageCount={state.affiliate_limit} totalPage={totalAffiliate} pageNumber={state.current_page} action={result => this.setState({ current_page: result })} style={{ position: 'absolute', bottom: 20, right: 20 }} />
                                                </div>
                                            )
                                        }
                                    }}
                                </Query>
                            </div>
                        </div>
                    </div>
                    <span className="clear" />
                </div>

                {/* Modals */}
                {state.show_inventory &&
                    <Modal open={state.show_inventory} closeModal={() => this.toggleInventoryView()} session={this.props.session} style={{ width: '50%', padding: 10, borderTop: '5px solid #23c78a', borderRadius: 10 }}>
                        <div className="center-vertical-parent">
                            <h3>Inventory Level</h3>
                            <Table headers={[{ text: "Product Name" }, { text: "Product Cost" }, { text: "Remaining Qty" }, { text: "Sold Qty" }, { text: "Returning Qty" }, { text: "Total Qty" }, { text: "Budget" }]} containerStyle={{ fontSize: '0.9em', padding: 10 }} >
                                <Query query={
                                    GET_PURCHASE_ORDER(`{ sold_item_serial_numbers returning_item_serial_numbers product_variant_id product_price remainingQty totalQty affiliate_budget warnWhenLow warnQty }`)
                                } variables={{ affiliate_email: state.affiliate_email, isApproved: true }}>
                                    {({ data, loading, refetch, error }) => {
                                        if (loading) return <Tbody loading={true} />;
                                        else if (error) return <Tbody singleRowText={"An error has occurred please try again."} style={{ fontSize: '1.2em' }} />;
                                        else if (data.getPurchaseOrders.length == 0) return <Tbody singleRowText={"This affiliate doesnt have P.O yet!"} style={{ fontSize: '1.2em' }} />;
                                        return data.getPurchaseOrders.map((el, index) => {
                                            const bgColor = el.warnWhenLow ? el.remainingQty <= el.warnQty ? "#f4e3dc" : "unset" : "unset";
                                            return (
                                                <Tbody style={{ backgroundColor: bgColor }} index={index} key={index}>
                                                    <div>
                                                        <Query query={GET_FUNNEL_PRODUCTS(`{ productName }`)} variables={{ id: el.product_variant_id }}>
                                                            {({ data, loading, refetch, error }) => {
                                                                if (loading) return <label>Loading...</label>;
                                                                if (error) return <label>Error!</label>;
                                                                if (!data.getFunnelProducts || (data.getFunnelProducts && data.getFunnelProducts.length == 0)) return <label>Not Found!</label>;
                                                                var productName = data.getFunnelProducts[0].productName;
                                                                return <label>{productName}</label>;
                                                            }}
                                                        </Query>
                                                    </div>
                                                    <div>
                                                        <label>${el.product_price}</label>
                                                    </div>
                                                    <div>
                                                        <label>{el.remainingQty}x</label>
                                                    </div>
                                                    <div>
                                                        <label>{el.sold_item_serial_numbers.length}x</label>
                                                    </div>
                                                    <div>
                                                        <label>{el.returning_item_serial_numbers.length}x</label>
                                                    </div>
                                                    <div>
                                                        <label>{el.totalQty}x</label>
                                                    </div>
                                                    <div>
                                                        <label>${points.commafy(el.affiliate_budget)}</label>
                                                    </div>
                                                </Tbody>
                                            );
                                        })
                                    }}
                                </Query>
                            </Table>
                        </div>
                    </Modal>
                }
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AdminCODStatistics);