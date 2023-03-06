/*

*/

import React from 'react';
import withSession from './../hoc/withSession';
import SelectTag from '../components/selectTag';
import Loading from '../components/loading';
import moment from 'moment';
import { GET_MY_FUNNEL_ORDER_TOTAL_SALES, GET_FUNNEL_LIST } from '../queries';
import { Query, Mutation } from 'react-apollo';
// import InfiniteCalendar, { Calendar, withRange, } from 'react-infinite-calendar';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip } from 'recharts';
const points = require('../../Global_Values');
// const CalendarWithRange = withRange(Calendar);
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
var graph = null;

class FunnelCharts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFunnel: "",
            statistic_data: [],
            statistic_data_temp: [],
            noResult: false,

            filterByStartDate: '',
            filterByEndDate: '',
            date_filter: '6'
        }
    }

    componentDidMount(){
        var that = this;
        var styleSheet1 = document.createElement("link");
        styleSheet1.id = "styleSheet1";
        styleSheet1.rel = "stylesheet"; styleSheet1.type = "text/css"; styleSheet1.href = "https://unpkg.com/funnel-graph-js@1.3.9/dist/css/main.min.css";
        var styleSheet2 = document.createElement("link");
        styleSheet2.id = "styleSheet2";
        styleSheet2.rel = "stylesheet"; styleSheet2.type = "text/css"; styleSheet2.href = "https://unpkg.com/funnel-graph-js@1.3.9/dist/css/theme.min.css";
        var script1 = document.createElement("script");
        script1.id = "script1";
        script1.src = "https://unpkg.com/funnel-graph-js@1.3.9/dist/js/funnel-graph.min.js";
        script1.onload = () => {
            that.addValueToChart();
        }
        document.body.appendChild(styleSheet1);
        document.body.appendChild(styleSheet2);
        document.body.appendChild(script1);
    }

    componentWillUnmount(){
        document.getElementById("styleSheet1").remove();
        document.getElementById("styleSheet2").remove();
        document.getElementById("script1").remove();
    }

    addValueToChart(){
        let payload = {};
        let userid = this.props.session.getCurrentUser.id;
        // let userid = "5c34100f12101523a70989cb"; // kay samuel na ID
        if(this.state.date_filter) {
            let howManyDays = parseInt(this.state.date_filter);
            let from = Date.parse(points.getPastDate(howManyDays, true).toISOString());
            let to = Date.parse(new Date().toISOString());
            if(howManyDays <= 1) to = Date.parse(moment(from).endOf('day').toISOString());
            payload = { "query": "{   everyPagebyCreatorDateRange(creatorID: \"" + userid + "\", from: \"" + from + "\", to: \"" + to + "\"){   purchased   pageType   pageID   funnelID   date   conversion   device   fromPage   }}", "variables": null, "operationName": null };
        } else {
            payload = { "query": "{   everyPagebyCreator(creatorID: \"" + userid + "\"){   purchased   pageType   pageID   funnelID   date   conversion   device   fromPage   }}", "variables": null, "operationName": null };
        }
        points.customFetch('https://stats.productlistgenie.io/graphql', 'POST', payload, async result => {
            let data = [];
            if(this.state.date_filter) data = result.data.everyPagebyCreatorDateRange;
            else data = result.data.everyPagebyCreator;
            this.setState({ statistic_data: data, noResult: data.length == 0 ? true : false }, () => {
                var value = this.state.statistic_data;
                if(value.length != 0){
                    this.funnelGraphChart(value)
                }
            });
        })
    }

    funnelGraphChart(val) {
        document.getElementById("funnel_graph_container").innerHTML = "";
        var graph = new FunnelGraph({
            container: '#funnel_graph_container',
            gradientDirection: 'vertical',
            data: this.getDataOfChart(val),
            height: 280,
            displayPercent: true,
            width: window.innerWidth >= 1024 && window.innerWidth <= 1180 ? window.innerWidth * .05 : (document.getElementById("funnel_graph_container").offsetWidth / 2) - 20,
            direction: 'vertical'
        });
        graph.draw();
        this.graph = graph;
        this.refreshChartData(); // refresh chart data
    }
    
    getDataOfChart(array){
        // impression
        var impressionDesktop = points.getStatsDataFromArray("impression_desktop", array);
        var impressionMobile = points.getStatsDataFromArray("impression_mobile", array);
        // add to cart
        var addToCartDesktop = points.getStatsDataFromArray("addToCart_desktop", array);
        var addToCartMobile = points.getStatsDataFromArray("addToCart_mobile", array);
        // initiate checkout
        var initiateCheckoutDesktop = points.getStatsDataFromArray("initiateCheckout_desktop", array);
        var initiateCheckoutMobile = points.getStatsDataFromArray("initiateCheckout_mobile", array);
        // purchase
        var purchaseDesktop = points.getStatsDataFromArray("purchased_desktop", array);
        var purchaseMobile = points.getStatsDataFromArray("purchased_mobile", array);
        
        return { labels: ['Impressions', 'Add to cart', 'Initiate Checkout', 'Purchase'], subLabels: ['Desktop', 'Mobile'], colors: [ ['#debb19', '#df8419'], ['#1ed8a7', '#1dd893'] ], values: [ [impressionDesktop, impressionMobile], [addToCartDesktop, addToCartMobile], [initiateCheckoutDesktop, initiateCheckoutMobile], [purchaseDesktop, purchaseMobile] ] }
    }

    funnelNameOnChange(event){
        var name = event.target.name;
        var value = event.target.value;
        this.setState({ [name]: value }, () => {
            this.refreshChartData();
        });
    }

    filterDateOnChange(event){
        var name = event.target.name;
        var value = event.target.value;
        this.setState({ [name]: value, statistic_data: [], statistic_data_temp: [], noResult: false }, () => {
            this.refreshChartData(); // clear the chart
            this.addValueToChart(); // add value the chart
        });
    }

    refreshChartData(){
        var { date_filter, statistic_data, selectedFunnel, filterByStartDate, filterByEndDate } = this.state;
        // statistic_data.sort((a,b) => a.date < b.date ? -1 : 1);
        if(selectedFunnel){
            var pageids = JSON.parse(selectedFunnel);
            statistic_data = statistic_data.filter(el => {
                return pageids.includes(el.pageID) || pageids.includes(el.funnelID)
            });
        }

        if(date_filter != "custom") {
            // local changing date via arra.filter
            var howManyDays = 0;
            if(date_filter) howManyDays = parseInt(date_filter);
            if(statistic_data.length != 0){
                const getDate = (array, when) => new Date(new Date(parseInt(array[array.length-1].date)).getTime() - (86400000 * when)).toDateString().substring(4);
                var temp = [];
                if(howManyDays == 1) howManyDays = 0; // para sa yesterday isa lang lumabas sa chart
                for (var x = howManyDays; x >= 0; x--) {
                    temp[x] = { name: getDate(statistic_data, x), data: [] };
                    statistic_data.forEach(el => {
                        var dateName = new Date(parseInt(el.date)).toDateString().substring(4);
                        if(temp[x].name == dateName){
                            temp[x].data.push(el)
                        }
                    })
                }
                // update visitor in past howManyDays chart
                this.setState({ statistic_data_temp: temp });

                // update funnel chart
                if(this.graph){
                    var data = this.getDataOfChart(statistic_data);
                    var percentages = [100]
                    var totalImpresison = data.values[0].reduce((sum, num) => sum + Math.round(num), 0)
                    data.values.forEach((el, index) => {
                        if(index != 0){
                            var fixed2 = parseFloat((el.reduce((sum, num) => sum + Math.round(num), 0) / totalImpresison * 100).toFixed(2));
                            percentages.push(fixed2)
                        }
                    })
                    this.graph.percentages = percentages;
                    this.graph.updateData(data);
                    this.graph.updateData(data);
                }
            } else {
                // update visitor in past howManyDays chart
                this.setState({ statistic_data_temp: [] })
                // update funnel chart
                statistic_data = [ { conversion: false, date: "No Data", device: "none", fromPage: null, pageID: "", pageType: null, purchased: false } ]
                if(this.graph){
                    this.graph.percentages = [100, 0, 0, 0];
                    this.graph.updateData(this.getDataOfChart(statistic_data));
                    this.graph.updateData(this.getDataOfChart(statistic_data));
                }
            }
        } else {
            // for date dropdown (soon)  
            var startDate = filterByStartDate;
            var endDate = filterByEndDate;
        }
    }
    
    filterDate(data){
        if(data.eventType == 3){
            this.setState({ filterByStartDate: data.start.toDateString(), filterByEndDate: data.end.toDateString() })
        }
    }

    getReferrer() {
        let result = {};
        this.state.statistic_data.forEach(data => {
            let link = "";
            if(data.fromPage) {
                // page ung fromPage ay start sa android-app replace it by https
                let list = new URL(data.fromPage.replace("android-app", "https")).hostname.split(".");
                if(list.length > 2) list.shift();
                link = list.join(".");
            } else {
                link = "others";
            }
            if(!result[link]) result[link] = 0;
            result[link] += 1;
        });
        result = points.sortObjectByValue(result, "desc");
        return result;
    }

    render() {
        var state = this.state;
        var funnel_list = this.props.funnel_list;
        var currentUser = this.props.session.getCurrentUser;
        return(
            <div>
                <div>
                    <div className="column column_6_12" style={{paddingLeft: 0, paddingRight: 2.5}}>
                        <div className="row-separator">
                            {(() => {
                                if(funnel_list && funnel_list.length != 0){
                                    var options = [<option key={0} value="">All Funnels</option>];
                                    funnel_list.forEach((funnel, index) => {
                                        options.push(<option key={index+1} value={JSON.stringify(funnel.ids)}>{points.capitalizeWord(funnel.funnel_name.replace(/-|_/g, " "))}</option>);
                                    })
                                    return <SelectTag name="selectedFunnel" value={state.selectedFunnel} options={options} onChange={event => this.funnelNameOnChange(event)} style={{ marginTop: 10 }} />
                                } else {
                                    return (
                                        <Query query={
                                            GET_FUNNEL_LIST(`{ id funnel_name old_page_ids }`)
                                        } variables={{ creator: currentUser.id, limit: 0 }}>
                                            {({ data, loading, refetch, error }) => {
                                                if(loading || error) return null;
                                                var options = [<option key={0} value="">All Funnels</option>];
                                                if(data.getFunnelList.length != 0) {
                                                    data.getFunnelList.forEach((funnel, i) => {
                                                        // search order by old ids plus funnel id
                                                        options.push(<option key={i+1} value={JSON.stringify(funnel.old_page_ids.concat(funnel.id))}>{points.presentableFunnelName(funnel.funnel_name)}</option>);
                                                    })
                                                }
                                                return <SelectTag name="selectedFunnel" value={state.selectedFunnel} options={options} onChange={event => this.funnelNameOnChange(event)} style={{ marginTop: 10 }} />
                                            }}
                                        </Query>
                                    );
                                }
                            })()}
                        </div>
                    </div>
                    <div className="column column_6_12" style={{paddingRight: 0, paddingLeft: 2.5}}>
                        <div className="row-separator">
                            {(() => {
                                var options = points.list_of_date_filter(false, "All Time").map((dates, i) => {
                                    return <option value={dates.value} key={i}>{dates.label}</option>;
                                });
                                return <SelectTag name="date_filter" value={state.date_filter} options={options} onChange={event => this.filterDateOnChange(event)} style={{ marginTop: 10 }} />
                            })()}
                        </div>
                    </div>
                    <span className="clear" />
                </div>
                <Query query={GET_MY_FUNNEL_ORDER_TOTAL_SALES}
                    variables={{
                        creator: currentUser.id,
                        page_ids: state.selectedFunnel ? JSON.parse(state.selectedFunnel).toString() : "",
                        dateFrom: state.date_filter? points.sendDateToServer(points.getPastDate(state.date_filter), true) : "",
                        dateTo: state.date_filter ? state.date_filter <= 1 ? points.sendDateToServer(points.getPastDate(state.date_filter)) : points.sendDateToServer(new Date()) : ""
                    }}>
                    {({ data, loading, refetch, error }) => {
                        if (loading) return <div className="row-separator text-center" style={{padding: 15, border: '1px solid #dcdfde', backgroundColor: '#f4f9fd'}}><Loading height={50} width={50} /></div>;
                        if (error) return <div className="row-separator text-center" style={{padding: 15, border: '1px solid #dcdfde', backgroundColor: '#f4f9fd'}}><label>Error getting total sales. <br/>Please try again.</label></div>
                        if (!data.getMyFunnelOrderTotalSales) return <label className="no-result">No Funnel Order Found.</label>;
                        var aov = data.getMyFunnelOrderTotalSales.count / data.getMyFunnelOrderTotalSales.count_order;
                        if(isNaN(aov)) aov = 0; // dahil 0 divided by 0 is equal to NaN
                        else aov.toFixed(2);
                        return (
                            <div className="row-separator flex-container" style={{ border: '1px solid #dcdfde', backgroundColor: '#f4f9fd' }}>
                                <div className="column column_6_12" style={{padding: 15}}>
                                    <label className="font-roboto-medium" style={{ color: '#ff8000', fontSize: '1.2em' }}>${points.commafy(parseFloat(data.getMyFunnelOrderTotalSales.count).toFixed(2))}</label><br />
                                    <label className="font-roboto-light" style={{ marginTop: 5, fontSize: '0.875em' }}>Total Sales{/* ({state.date_filter == "1" ? "Today" : state.date_filter+" Days"}) */}</label>
                                </div>
                                <div className="column column_6_12 text-right" style={{padding: 15, backgroundColor: '#28c686'}}>
                                    <label className="font-roboto-medium" style={{ color: '#fff', fontSize: '1.2em' }}>${points.commafy(aov.toFixed(2))}</label><br />
                                    <label className="font-roboto-light" style={{ marginTop: 5, fontSize: '0.875em' }}>AOV{/* ({state.date_filter == "1" ? "Today" : state.date_filter+" Days"}) */}</label>
                                </div>
                                <span className="clear" />
                            </div>
                        );
                    }}
                </Query>
                {(() => {
                    let isLoginAsAnonymous = localStorage.getItem(points.plg_domain_secret) || false;
                    if (isLoginAsAnonymous) {
                        let referrers = this.getReferrer();
                        if(!points.isObjectEmpty(referrers)) {
                            return (
                                <div className="row-separator" style={{ border: '1px solid #dcdfde', backgroundColor: '#f4f9fd', padding: 10, maxHeight: 220, overflow: 'auto', paddingTop: 0, paddingBottom: 0 }}>
                                    <ul className="item-list-normal">
                                        {(() => {
                                            let dom = [];
                                            for(var key in referrers) {
                                                let count = referrers[key];
                                                dom.push(<li key={key}><strong style={{ display: 'unset', fontSize: '1.3em' }}>{key}</strong>: {count}</li>)
                                            }
                                            return dom;
                                        })()}
                                    </ul>
                                </div>
                            );
                        } else return null;
                    } else return null;
                })()}
                <div id="funnel_graph_container" className="stretch-width" style={{backgroundColor: '#40534f', height: 280}}>
                    <div className="text-center color-white" style={{padding: 20}}>
                        {state.noResult &&
                            <label>No data to display.</label>
                        }
                        {!state.noResult &&
                            <Loading width={150} height={150} />
                        }
                    </div>
                </div>
                {state.statistic_data.length != 0 &&
                    (() => {
                        var data = [], total = 0;
                        if(state.statistic_data_temp.length == 0) data = [{ name: "No Data", Impressions: 0 }];
                        state.statistic_data_temp.forEach(el => {
                            total += el.data.length;
                            data.push({ name: el.name, Impressions: el.data.length });
                        })
                        data.reverse(); // instead of sort use reverse.
                        let text = "Visitors in past " + (parseInt(state.date_filter) + 1) + " days";
                        if(state.date_filter == "0") text = "Today visitors";
                        else if(state.date_filter == "1") text = "Yesterday visitors";
                        else if(parseInt(state.date_filter) <= 5) text = "This week visitors";
                        return (
                            <div style={{marginTop: 50}}>
                                <div className="row-separator">
                                    <label>{text}</label>
                                    <label className="float-right" style={{color: '#ef8805'}}>
                                        <span style={{color: '#b8bec4'}}>Total: </span>
                                        {points.commafy(total)}
                                    </label>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart data={data} style={{ backgroundColor: '#40534f' }} >
                                        <CartesianGrid horizontal={false} stroke="#fff" strokeOpacity="0.8" />
                                        <Tooltip contentStyle={{backgroundColor: '#232d2b', border: 'none', color: '#fff', opacity: 0.8}} labelFormatter={index => {
                                            return data[index] ? "Date: "+data[index].name : "";
                                        }} />
                                        <defs>
                                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="40%" stopColor="#debb19" />
                                                <stop offset="60%" stopColor="#df8419" />
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="Impressions" stroke="#fff" fillOpacity="0.8" fill="url(#colorUv)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        );
                    })()
                }
            </div>
        );
    }
}


export default withSession(FunnelCharts);