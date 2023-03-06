import React from "react";
import withAuth from "../hoc/withAuth";
import { Link } from "react-router-dom";
import ProductCard from "../components/productCard";
import { Helmet } from "react-helmet";
import Loading from "../components/loading";
import LoadingPage from "../components/loadingPage";
import ButtonWithPopup from "../components/buttonWithPopup";
import FunnelCharts from "../components/funnelCharts";
import {
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import DateRange from "../components/dateRange";
import Checkbox from "../components/checkbox";
import UpsellAlert from "../components/ModalComponent/upsellAlert";
import LeaderBoardsRemodel from "../components/leaderBoardsRemodel";
import {
  GET_MY_FUNNEL_ORDER_TOTAL_SALES,
  GET_MY_PAY_CHECK,
  GET_FUNNEL_LIST,
} from "./../queries";
import { Query } from "react-apollo";
import toastr from "toastr";
import SelectTag from "../components/selectTag";
import ContentSlider from "../components/contentSlider";
const condition = require("../../Global_Conditions");
const points = require("../../Global_Values");
var ShortId = require("id-shorter");
var mongoDBId = ShortId({ isFullId: true });
const SlideSettings = {
  count: 1,
  autoPlay: true,
  timeToSlide: 5000,
  showDots: false,
  pauseOnMouseOver: false,
  dotsLocation: "left",
};

const initialize_filter = {
  filter_by_start_date: "",
  filter_by_end_date: "",
  filter_merchant_type: "cod",
  filter_funnel_id: "",
  filter_funnel_name: "",
  filter_funnel_selected: "",
  filter_showShopifyOnly: false,
};

class HomepageFullRemodel extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      openUpsell: false,
      chart: [],
      activeIndex: 7,
      leaderboardData: [],
      oneTimeChallenge: [],
      startWeek: "",
      endWeek: "",
      payouts: "",

      // video
      h_full_video: "https://player.vimeo.com/video/328343330",
      is_iframe_loaded: false,
      // iframe_height: 500,
      v1: null,
      v2: null,
      v3: null,

      // image slider
      slider_loading: true,
      slider_images: [],

      // for funnel analytics
      date_filter: "6",
      funnelTotalSales: [],

      page_is_loading: true,
      ...initialize_filter,
    };
    this.toggleModalUpsell = this.toggleModalUpsell.bind(this);
  }

  getHomepageVideo() {
    var payload = {
      query:
        "{\n  getAdminHomepageVideo {\n    id\n    homepage_video_full\n    homepage_video_trial\n  }\n}\n",
      variables: null,
      operationName: null,
    };
    fetch(points.clientUrl + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data.getAdminHomepageVideo.homepage_video_full) {
          // this.setState({ h_full_video: result.data.getAdminHomepageVideo.homepage_video_full })
          this.setState({
            h_full_video: "https://player.vimeo.com/video/328343330",
          });
          // https://player.vimeo.com/video/328343330
        }
      });
  }

  async componentDidMount() {
    this.getHomepageVideo();
    toastr.options = {
      progressBar: true,
      closeButton: false,
      debug: false,
      newestOnTop: true,
      positionClass: "toast-bottom-right",
      preventDuplicates: false,
      timeOut: 5000,
      extendedTimeOut: 2000,
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };

    // last added products request
    this.setState({ page_is_loading: false }, () => {
      this.getLatestProductAdded().then((data) => {
        points.displayPLGInventoryOnShopifyProduct(data, mongoDBId);
        this.setState({ data });
      });
    });

    this.getVideoData(380796306, "v1");
    this.getVideoData(380795973, "v2");
    this.getVideoData(380796852, "v3");

    points.getHomepageSliderImageContent((data) =>
      this.setState({ slider_images: data, slider_loading: false })
    );
  }

  getLatestProductAdded() {
    return new Promise((resolve) => {
      fetch(
        "https://productlistgenie.io/collections/cod-available/products.json?limit=6"
      )
        .then((res) => res.json())
        .then((res) => {
          resolve(res.products);
        })
        .catch((err) => {
          resolve([]);
        });
    }).catch((err) => {
      return [];
    });
  }

  getLeaderBoards() {
    return new Promise((resolve) => {
      var leaderboardPayload = {
        query:
          "{\n  getLeaderBoards{\n    firstName\n    lastName\n    total_points\n  }\n}",
        variables: null,
        operationName: null,
      };
      fetch(points.clientUrl + "/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaderboardPayload),
      })
        .then((res) => res.json())
        .then((res) => {
          resolve(res.data.getLeaderBoards);
        })
        .catch((err) => {
          console.log("Error Getting Leader Boards ==>", err);
          resolve([]);
        });
    }).catch((err) => {
      console.log("Error Getting Leader Boards on Promise ==>", err);
      return [];
    });
  }

  addValueToChart() {
    return new Promise((resolve) => {
      var payload = {
        query:
          '{   everyPagebyCreator(creatorID:"' +
          this.props.session.getCurrentUser.id +
          '"){   purchased   pageType   pageID   date   conversion   device   fromPage   }}',
        variables: null,
        operationName: null,
      };
      console.log(JSON.stringify(payload, null, 2));
      points.customFetch(
        "https://stats.productlistgenie.io/graphql",
        "POST",
        payload,
        (result) => {
          resolve(result.data.everyPagebyCreator);
        }
      );
    }).catch((err) => {
      return [];
    });
  }

  // toggle modal upsell
  toggleModalUpsell() {
    this.setState({ openUpsell: !this.state.openUpsell });
  }

  funnelSalesTooltip({ active, payload, label }) {
    if (active) {
      if (!payload) return null;
      return (
        <div
          style={{
            backgroundColor: "#232d2b",
            border: "none",
            color: "#fff",
            opacity: 0.8,
            padding: "15px 10px",
          }}
        >
          <label>Date: {payload[0].payload.name}</label> <br />
          <label>Sales: ${points.commafy(payload[0].payload.Sales)}</label>{" "}
          <br />
          <label>AOV: ${points.commafy(payload[0].payload.aov)}</label> <br />
          <label>COD: ${points.commafy(payload[0].payload.cod)}</label> <br />
          <label>
            Not Delivered: ${points.commafy(payload[0].payload.not_delivered)}
          </label>{" "}
          <br />
          <label>
            Delivered: ${points.commafy(payload[0].payload.delivered)}
          </label>
        </div>
      );
    }
  }

  filterDateOnChange(event) {
    var name = event.target.name;
    var value = event.target.value;
    this.setState({ [name]: value });
  }

  getVideoData(vimeoid, state_name) {
    fetch("https://vimeo.com/api/v2/video/" + vimeoid + ".json")
      .then((res) => res.json())
      .then((result) => {
        this.setState({ [state_name]: result[0] });
      });
  }

  changeSelectedVideo(url) {
    if (this.state.h_full_video != url) {
      this.setState({ h_full_video: url, is_iframe_loaded: false });
    }
  }

  head() {
    return (
      <Helmet>
        <title>Dashboard - Product List Genie</title>
      </Helmet>
    );
  }

  pieChartCustomToolTip({ active, payload }) {
    if (active) {
      if (!payload) return null;
      payload = payload.reduce((e) => e);
      const label = points.capitalizeWord(payload.payload.description);
      return (
        <div
          style={{
            backgroundColor: "#232d2b",
            border: "none",
            color: "#fff",
            opacity: 0.8,
            padding: "15px 10px",
          }}
        >
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
      );
    }
  }

  pieChartPercentageLabel({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent == 0) return null; // hide if 0 result
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  }

  charWithComparetTooltip({ active, payload, label }) {
    if (active) {
      if (!payload) return null;
      payload = payload.reduce((e) => e);
      let text = "",
        compare = 0,
        orig = 0;
      if (typeof payload.payload.sales != "undefined") {
        text = "Sales";
        compare =
          "$" + points.commafy(payload.payload.compare_sales.toFixed(2));
        orig = "$" + points.commafy(payload.payload.sales.toFixed(2));
      } else if (typeof payload.payload.orders != "undefined") {
        text = "Orders";
        compare = payload.payload.compare_orders;
        orig = payload.payload.orders;
      }
      return (
        <div
          style={{
            backgroundColor: "#232d2b",
            border: "none",
            color: "#fff",
            opacity: 0.8,
          }}
        >
          <div style={{ padding: 10 }}>
            <label>Compare Date: {payload.payload.compare_date}</label> <br />
            <label>
              Compare {text}: {compare}
            </label>
          </div>
          <hr style={{ margin: 0 }} />
          <div style={{ padding: 10 }}>
            <label>Date: {payload.payload.date}</label> <br />
            <label>
              {text}: {orig}
            </label>
          </div>
        </div>
      );
    }
  }

  setOverTimeLoading() {
    this.setState({ ...initialize_compare_data }, () => this.statsRequest());
  }

  statsRequest() {
    let state = this.state,
      compare_date = points.getCompareDateRange(
        state.filter_by_start_date,
        state.filter_by_end_date
      );
    let from = Date.parse(new Date(state.filter_by_start_date).toISOString()),
      to = Date.parse(
        new Date(
          points.sendDateToServer(state.filter_by_end_date)
        ).toISOString()
      );
    let from_compare = Date.parse(new Date(compare_date.start).toISOString()),
      to_compare = Date.parse(
        new Date(points.sendDateToServer(compare_date.end)).toISOString()
      );
    let user_id = this.props.session.getCurrentUser.id; // "5c34100f12101523a70989cb";
    let payload1 = {
      query:
        '{   everyPagebyCreatorDateRange(creatorID: "' +
        user_id +
        '", from: "' +
        from +
        '", to: "' +
        to +
        '"){   purchased   pageType   pageID   funnelID   date   conversion   device   fromPage   }}',
      variables: null,
      operationName: null,
    };
    let payload2 = {
      query:
        '{   everyPagebyCreatorDateRange(creatorID: "' +
        user_id +
        '", from: "' +
        from_compare +
        '", to: "' +
        to_compare +
        '"){   purchased   pageType   pageID   funnelID   date   conversion   device   fromPage   }}',
      variables: null,
      operationName: null,
    };
    points.customFetch(
      "https://stats.productlistgenie.io/graphql",
      "POST",
      payload1,
      async (result1) => {
        let data1 = result1.data.everyPagebyCreatorDateRange;
        points.customFetch(
          "https://stats.productlistgenie.io/graphql",
          "POST",
          payload2,
          async (result2) => {
            let data2 = result2.data.everyPagebyCreatorDateRange;
            this.setState({
              stats_loading: false,
              stats_data: data1,
              stats_data_compare: data2,
            });
          }
        );
      }
    );
  }

  render() {
    let currentUser = this.props.session.getCurrentUser,
      has_arabic_funnel_access = condition.has_arabic_funnel(currentUser);
    var state = this.state;

    let compare_date = points.getCompareDateRange(
      state.filter_by_start_date,
      state.filter_by_end_date
    );
    if (state.page_is_loading) return <LoadingPage />;

    return (
      <div className="funnel remodel">
        {this.head()}
        <div
          className="newPageHeader display-inline flex-container"
          style={{ padding: 10 }}
        >
          <div className="column column_6_12">
            <div className="display-inline" style={{ margin: 10 }}>
              <span
                className="hide-in-desktop float-left"
                style={{ padding: 15 }}
              />
              <h4 className="font-roboto-bold" style={{ fontSize: "1.5em" }}>
                DASHBOARD
              </h4>
              {/* <Link to="/dashboard/es" className="display-inline color-black" style={{ lineHeight: 0.1 }}>
                                <label style={{fontSize: '1.2em', marginLeft: 5}}>ES</label> <span className="cursor-pointer lang-sm-es" />
                            </Link> */}
            </div>
          </div>
          <div className="column column_6_12 text-right">
            <div className="display-inline float-right">
              <label>Available on:</label>
              <button
                className="button-play-store"
                style={{ marginLeft: 5 }}
                onClick={() =>
                  window.open(
                    "https://play.google.com/store/apps/details?id=com.plg.plg_ios",
                    "_blank"
                  )
                }
              />
              <button
                className="button-app-store"
                style={{ marginLeft: 5 }}
                onClick={() =>
                  window.open(
                    "https://apps.apple.com/us/app/product-list-genie/id1484276344?ls=1",
                    "_blank"
                  )
                }
              />
            </div>
          </div>
          <span className="clear" />
        </div>
        <div className="page-container">
          <div className="column column_4_12 row-separator">
            <div className="product-card" style={{ padding: 20 }}>
              <Query
                query={GET_MY_FUNNEL_ORDER_TOTAL_SALES} // Compare Date Query
                variables={{
                  creator: currentUser.id,
                  page_ids: state.filter_funnel_id.toString(),
                  merchant_type: state.filter_merchant_type,
                  dateFrom: points.sendDateToServer(compare_date.start, true),
                  dateTo: points.sendDateToServer(compare_date.end),
                  timezoneOffset: new Date().getTimezoneOffset(),
                  showShopifyOnly: state.filter_showShopifyOnly,
                }}
                onCompleted={(data) => {
                  let compare = [];
                  if (
                    data.getMyFunnelOrderTotalSales &&
                    data.getMyFunnelOrderTotalSales.dates.length != 0
                  ) {
                    data.getMyFunnelOrderTotalSales.dates.forEach((data) => {
                      compare.push({
                        compare_date: data.date,
                        compare_orders: data.count_order,
                      });
                    });
                  }
                  this.setState({ total_order_chart_compare: compare });
                }}
                notifyOnNetworkStatusChange
              >
                {() => null}
              </Query>
              <Query
                query={GET_MY_FUNNEL_ORDER_TOTAL_SALES} // Sales Date Query
                variables={{
                  creator: currentUser.id,
                  page_ids: state.filter_funnel_id.toString(),
                  merchant_type: state.filter_merchant_type,
                  dateFrom: points.sendDateToServer(
                    state.filter_by_start_date,
                    true
                  ),
                  dateTo: points.sendDateToServer(state.filter_by_end_date),
                  timezoneOffset: new Date().getTimezoneOffset(),
                  showShopifyOnly: state.filter_showShopifyOnly,
                }}
                onCompleted={(data) => {
                  let orders = [];
                  if (
                    data.getMyFunnelOrderTotalSales &&
                    data.getMyFunnelOrderTotalSales.dates.length != 0
                  ) {
                    data.getMyFunnelOrderTotalSales.dates.forEach((data) => {
                      orders.push({
                        date: data.date,
                        orders: data.count_order,
                      });
                    });
                  }
                  this.setState({ total_order_chart: orders });
                }}
                notifyOnNetworkStatusChange
              >
                {() => null}
              </Query>
              {(() => {
                let ordersChart = [],
                  totalOrder = state.total_order_chart,
                  totalOrderCompare = state.total_order_chart_compare;
                if (totalOrder.length != totalOrderCompare.length) {
                  // loading both orders and compare
                  return <Loading width={chartHeight} height={chartHeight} />;
                } else {
                  // done loading
                  totalOrder.forEach((order, i) => {
                    let compare = totalOrderCompare[i];
                    ordersChart.push({
                      date: order.date,
                      orders: order.orders,
                      compare_date: compare.compare_date,
                      compare_orders: compare.compare_orders,
                    });
                  });
                  if (ordersChart.length == 0) {
                    // no compiled result
                    return (
                      <div
                        className="center-vertical-parent"
                        style={{ height: chartHeight }}
                      >
                        <div className="center-vertical">
                          <img
                            src="/assets/graphics/no-result.svg"
                            style={{ height: chartHeight - 100 }}
                          />
                          <h4 className="title" style={{ fontSize: "1.5em" }}>
                            NO RESULT FOUND!
                          </h4>
                          <label
                            className="font-roboto-bold"
                            style={{ fontSize: "0.875em" }}
                          >
                            Please try different query
                          </label>
                        </div>
                      </div>
                    );
                  } else {
                    // may resulta pass data to chart
                    return (
                      <div>
                        <div className="float-right">
                          {(() => {
                            let order_now = 0,
                              order_before = 0;
                            ordersChart.forEach((e) => {
                              order_now += e.orders;
                              order_before += e.compare_orders;
                            });
                            let obj = points.getPercentageChange(
                              order_before,
                              order_now
                            );
                            return (
                              <PopupTooltip
                                position="top right"
                                trigger={
                                  <h4
                                    className="title"
                                    style={{ color: obj.color }}
                                  >
                                    <span className={obj.className} />{" "}
                                    {obj.percent}
                                  </h4>
                                }
                                style={{ width: 270 }}
                                on="hover"
                              >
                                <div style={{ padding: 2 }}>
                                  <label
                                    style={{
                                      fontSize: "1.1em",
                                      lineHeight: 1.5,
                                    }}
                                  >
                                    Compare Orders: {order_before}
                                  </label>{" "}
                                  <br />
                                  <label
                                    style={{
                                      fontSize: "1.1em",
                                      lineHeight: 1.5,
                                    }}
                                  >
                                    Orders: {order_now}
                                  </label>
                                </div>
                              </PopupTooltip>
                            );
                          })()}
                        </div>
                        <h4 className="title" style={{ marginBottom: 10 }}>
                          Orders Over Time
                        </h4>
                        <ResponsiveContainer
                          width="100%"
                          height={chartHeight - 40}
                        >
                          <AreaChart
                            data={ordersChart}
                            style={{ backgroundColor: "#40534f" }}
                          >
                            <CartesianGrid
                              horizontal={false}
                              stroke="#fff"
                              strokeOpacity="0.8"
                            />
                            <Tooltip
                              content={this.charWithComparetTooltip.bind(this)}
                            />
                            <Area
                              type="monotone"
                              dataKey="compare_orders"
                              stroke="#fff"
                              fillOpacity="0.5"
                              fill="#dfe3e8"
                              stackId="1"
                            />
                            <Area
                              type="monotone"
                              dataKey="orders"
                              stroke="#fff"
                              fillOpacity="0.8"
                              fill="#1dd1a1"
                              stackId="2"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    );
                  }
                }
              })()}
            </div>
          </div>

          <div>
            <div
              className="column_12_12 filter-container filler-wrapper"
              style={{
                // display: "flex",
                // alignItems: "center",
                // justifyContent: "space-between",
                margin: "7px",
              }}
            >
              {/* <div className="newPageHeader">
                <div className="">
                  <span
                    className="hide-in-desktop float-left"
                    style={{ padding: 15 }}
                  />
                  
                </div>
                <span className="clear" />
              </div> */}

              <h4
                className="font-roboto-bold"
                style={{ fontSize: "1.5em", color: "#273037" }}
              >
                Order Metrics
              </h4>
              <div
                className="filter-container"
                style={{
                  margin: 0,
                  padding: 0,
                  flex: 1,
                  boxShadow: "none",
                }}
              >
                <Checkbox
                  id="filter_showShopifyOnly"
                  label="Show products synced to shopify only"
                  labelClassName="header-medium-bold font-small"
                  checked={state.filter_showShopifyOnly}
                  onChange={(value) => {
                    // this.setState({ filter_showShopifyOnly: value }, () =>
                    //   this.statsRequest()
                    // );
                    // localStorage.setItem("is_showShopifyOnly", value);
                  }}
                  containerClassName="row-separator"
                />
                <DateRange
                  start={state.filter_by_start_date}
                  end={state.filter_by_end_date}
                  onRangeChange={(date) =>
                    this.setState(
                      {
                        filter_by_start_date: date.start,
                        filter_by_end_date: date.end,
                      },
                      this.setOverTimeLoading()
                    )
                  }
                >
                  <div
                    className="stretch-to-mobile custom-select"
                    style={{ margin: "0 5px", width: 100 }}
                  >
                    <div className="select-selected stretch-width text-left">
                      Date
                    </div>
                  </div>
                </DateRange>
                {(() => {
                  var merchant_types = points.list_of_merchant.map(
                    (merchant, i) => {
                      return (
                        <option value={merchant.value} key={i}>
                          {merchant.label}
                        </option>
                      );
                    }
                  );
                  return (
                    <SelectTag
                      className="stretch-to-mobile"
                      name="filter_merchant_type"
                      value={state.filter_merchant_type}
                      options={merchant_types}
                      onChange={(event) => {
                        this.setState({
                          ...initialize_sales,
                          filter_merchant_type: event.target.value,
                        });
                      }}
                      style={{ margin: "0 5px", width: 200 }}
                    />
                  );
                })()}
                <Query
                  query={GET_FUNNEL_LIST(`{ id funnel_name old_page_ids }`)}
                  variables={{ creator: currentUser.id, limit: 0 }}
                >
                  {({ data, loading, refetch, error }) => {
                    if (loading || error) return null;
                    else if (data.getFunnelList.length == 0) return null;
                    var funnel_options = [
                      <option key={0} value="">
                        All Funnels
                      </option>,
                    ];
                    if (data.getFunnelList.length != 0) {
                      data.getFunnelList.forEach((funnel, i) => {
                        let ids = funnel.old_page_ids.map((e) => e);
                        ids.push(funnel.id);
                        let value = JSON.stringify({
                          ids: ids,
                          name: funnel.funnel_name,
                        });
                        funnel_options.push(
                          <option value={value} key={i + 1}>
                            {points.presentableFunnelName(funnel.funnel_name)}
                          </option>
                        );
                      });
                    }
                    return (
                      <SelectTag
                        className="stretch-to-mobile"
                        name="filter_funnel_selected"
                        options={funnel_options}
                        value={JSON.stringify(state.filter_funnel_selected)}
                        onChange={(event) => {
                          let value = { ids: [], name: "" };
                          if (event.target.value)
                            value = JSON.parse(event.target.value);
                          this.setState({
                            filter_funnel_id: value.ids,
                            filter_funnel_name: value.name,
                            filter_funnel_selected: value,
                          });
                        }}
                        style={{ margin: "0 5px", width: 200 }}
                      />
                    );
                  }}
                </Query>
              </div>
            </div>
            <div className="column column_12_12" style={{ padding: 0 }}>
              <div className="column column_2_12 row-separator">
                <div
                  className="product-card"
                  style={{
                    backgroundColor: "#4267b2",
                    color: "#fff",
                    border: "1px solid #dfe5eb",
                  }}
                >
                  <div className="product-details text-center">
                    <label
                      style={{
                        fontSize: "1.5em",
                        marginBottom: 10,
                        display: "block",
                      }}
                    >
                      Profit Collected
                    </label>

                    <label style={{ fontSize: "calc(20px + 1vw)" }}>
                      ${points.commafy(0)}
                    </label>
                  </div>
                </div>
              </div>
              <div className="column column_2_12 row-separator">
                <div
                  className="product-card"
                  style={{
                    backgroundColor: "#f28706",
                    color: "#fff",
                    border: "1px solid #dfe5eb",
                  }}
                >
                  <div className="product-details text-center">
                    <label
                      style={{
                        fontSize: "1.5em",
                        marginBottom: 10,
                        display: "block",
                      }}
                    >
                      Potential Profit
                    </label>
                    <label style={{ fontSize: "calc(20px + 1vw)" }}>
                      ${points.commafy(0)}
                    </label>
                  </div>
                </div>
              </div>
              {/* <span className="clear" />
            </div> */}
              {/* <div className="column column_7_12" style={{ padding: 0 }}> */}
              <div className="column column_2_12 row-separator">
                <div
                  className="product-card"
                  style={{
                    backgroundColor: points.getBGandFontColor("paid").bg,
                    color: "#fff",
                    border: "1px solid #dfe5eb",
                  }}
                >
                  <div className="product-details text-center">
                    <label
                      style={{
                        fontSize: "1em",
                        marginBottom: 10,
                        display: "block",
                      }}
                    >
                      Sales Revenue
                    </label>
                    <label style={{ fontSize: "calc(15px + 1vw)" }}>
                      ${points.commafy(0)}
                    </label>
                  </div>
                </div>
              </div>
              <div className="column column_2_12 row-separator">
                <div
                  className="product-card"
                  style={{
                    backgroundColor: points.getBGandFontColor("hold").bg,
                    color: "#fff",
                    border: "1px solid #dfe5eb",
                  }}
                >
                  <div className="product-details text-center">
                    <label
                      style={{
                        fontSize: "1em",
                        marginBottom: 10,
                        display: "block",
                      }}
                    >
                      Declined / Pending Sales
                    </label>
                    <label style={{ fontSize: "calc(15px + 1vw)" }}>
                      ${points.commafy(0)}
                    </label>
                  </div>
                </div>
              </div>
              <div className="column column_2_12 row-separator">
                <div
                  className="product-card"
                  style={{
                    backgroundColor: points.getBGandFontColor("cancelled").bg,
                    color: "#fff",
                    border: "1px solid #dfe5eb",
                  }}
                >
                  <div className="product-details text-center">
                    <label
                      style={{
                        fontSize: "1em",
                        marginBottom: 10,
                        display: "block",
                      }}
                    >
                      Cancelled Sales
                    </label>
                    <label style={{ fontSize: "calc(15px + 1vw)" }}>
                      ${points.commafy(0)}
                    </label>
                  </div>
                </div>
              </div>
              <div className="column column_2_12 row-separator">
                <div
                  className="product-card"
                  style={{
                    backgroundColor: "#9c27b0",
                    color: "#fff",
                    border: "1px solid #dfe5eb",
                  }}
                >
                  <div className="product-details text-center">
                    <label
                      style={{
                        fontSize: "1em",
                        marginBottom: 10,
                        display: "block",
                      }}
                    >
                      Cost of Goods
                    </label>
                    <label style={{ fontSize: "calc(15px + 1vw)" }}>
                      ${points.commafy(0)}
                    </label>
                  </div>
                </div>
              </div>
              <span className="clear" />
            </div>
          </div>

          <div className="column column_6_12">
            <div className="product-card" style={{ marginTop: 0 }}>
              <div className="product-details row-separator">
                <div>
                  <label
                    className="font-roboto-bold"
                    style={{
                      padding: "3px 5px",
                      borderBottom: "2px solid #27c686",
                    }}
                  >
                    Total Projected Sales
                  </label>
                </div>

                {(() => {
                  var options = points
                    .list_of_date_filter(false, "All Time")
                    .map((dates, i) => {
                      return (
                        <option value={dates.value} key={i}>
                          {dates.label}
                        </option>
                      );
                    });
                  return (
                    <div style={{ marginTop: 20 }}>
                      <div
                        style={{
                          justifyContent: "space-between",
                        }}
                        className="display-inline"
                      >
                        <div
                          className="column column_5_12"
                          style={{ padding: 0, margin: 0 }}
                        >
                          <SelectTag
                            icon={"fas fa-calendar-alt"}
                            name="date_filter"
                            value={state.date_filter}
                            options={options}
                            onChange={(event) => this.filterDateOnChange(event)}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "medium",
                            }}
                          >
                            Total:
                            <span
                              style={{
                                color: "#56A492",
                                fontWeight: "bold",
                              }}
                            >
                              $0
                            </span>
                          </div>

                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "medium",
                              marginTop: "4px",
                            }}
                          >
                            COD:
                            <span
                              style={{
                                color: "#56A492",
                                fontWeight: "bold",
                              }}
                            >
                              $0
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="clear row-separator" />
                      {(() => {
                        var chartData = [];
                        state.funnelTotalSales.forEach((el) => {
                          let aov = parseFloat(
                            (el.count / el.count_order).toFixed(2)
                          );
                          chartData.push({
                            name: el.date,
                            Sales: parseFloat(el.count.toFixed(2)),
                            aov: isFinite(aov) ? aov : 0,
                            cod: parseFloat(el.total_cod.toFixed(2)),
                            delivered: parseFloat(
                              el.total_delivered.toFixed(2)
                            ),
                            not_delivered: parseFloat(
                              el.total_not_delivered.toFixed(2)
                            ),
                          });
                        });
                        return (
                          <ResponsiveContainer width="100%" height={200}>
                            <AreaChart
                              data={chartData}
                              style={{ backgroundColor: "#40534f" }}
                            >
                              <CartesianGrid
                                horizontal={false}
                                stroke="#fff"
                                strokeOpacity="0.8"
                              />
                              <Tooltip
                                content={this.funnelSalesTooltip.bind(this)}
                              />
                              <defs>
                                <linearGradient
                                  id="colorUv"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop offset="40%" stopColor="#debb19" />
                                  <stop offset="60%" stopColor="#df8419" />
                                </linearGradient>
                              </defs>
                              <Area
                                type="monotone"
                                dataKey="Sales"
                                stroke="#fff"
                                fillOpacity="0.8"
                                fill="url(#colorUv)"
                                stackId="1"
                              />
                              <Area
                                type="monotone"
                                dataKey="cod"
                                stroke="#27c686"
                                fill="#27c686"
                                stackId="2"
                              />
                              <Area
                                type="monotone"
                                dataKey="not_delivered"
                                stroke="#d65657"
                                fill="#d65657"
                                stackId="4"
                              />
                              <Area
                                type="monotone"
                                dataKey="delivered"
                                stroke="#4267b2"
                                fill="#4267b2"
                                stackId="3"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        );
                      })()}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          <div
            className="column column_6_12 row-separator"
            style={{ padding: 0 }}
          >
            <h4
              className="font-roboto-bold"
              style={{
                padding: "10px 5px",
                borderBottom: "2px solid #27c686",
              }}
            >
              Payout
            </h4>
            {/* Total Payout Received */}
            <div
              className="product-card"
              style={{
                backgroundColor: "#27c686",
                color: "#fff",
                border: "1px solid #dfe5eb",
                marginTop: 0,
              }}
            >
              <ButtonWithPopup
                data={{
                  triggerDOM: (
                    <span
                      className="fas fa-info-circle color-white cursor-pointer float-right"
                      style={{ marginTop: 5, marginRight: 5 }}
                    />
                  ),
                  popupPosition: "left top",
                  text: (
                    <label className="color-black">
                      Overall payout received from fulfiller.
                    </label>
                  ),
                  loading: false,
                  padding: 0,
                  arrow: true,
                  style: { padding: 15, maxWidth: 100, borderRadius: 5 },
                  onAction: "hover",
                  checkORtimesButton: false,
                }}
              />
              <div className="product-details text-center">
                <label
                  style={{
                    fontSize: "1em",
                    marginBottom: 10,
                    display: "block",
                  }}
                >
                  Total Payout Received
                </label>
                <Query
                  query={GET_MY_PAY_CHECK}
                  variables={{ creator: currentUser.id, order_status: "paid" }}
                >
                  {({ data, loading, refetch, error }) => {
                    if (loading || error) return null;
                    return (
                      <label style={{ fontSize: "2.5em" }}>
                        ${points.commafy(data.getMyPayCheck.count.toFixed(2))}
                      </label>
                    );
                  }}
                </Query>
              </div>
            </div>
            {/* Total Delivered */}
            <div
              className="product-card"
              style={{
                backgroundColor: "#4267b2",
                color: "#fff",
                border: "1px solid #dfe5eb",
              }}
            >
              <ButtonWithPopup
                data={{
                  triggerDOM: (
                    <span
                      className="fas fa-info-circle color-white cursor-pointer float-right"
                      style={{ marginTop: 5, marginRight: 5 }}
                    />
                  ),
                  popupPosition: "left top",
                  text: (
                    <label className="color-black">
                      Total delivered will reduce when
                      <br />
                      fulfiller send you the payout.
                    </label>
                  ),
                  loading: false,
                  padding: 0,
                  arrow: true,
                  style: { padding: 15, maxWidth: 100, borderRadius: 5 },
                  onAction: "hover",
                  checkORtimesButton: false,
                }}
              />
              <div className="product-details text-center">
                <label
                  style={{
                    fontSize: "1em",
                    marginBottom: 10,
                    display: "block",
                  }}
                >
                  Total Delivered
                </label>
                <Query
                  query={GET_MY_PAY_CHECK}
                  variables={{
                    creator: currentUser.id,
                    order_status: "delivered",
                  }}
                >
                  {({ data, loading, refetch, error }) => {
                    if (loading || error) return null;
                    return (
                      <label style={{ fontSize: "2.5em" }}>
                        ${points.commafy(data.getMyPayCheck.count.toFixed(2))}
                      </label>
                    );
                  }}
                </Query>
              </div>
            </div>
            {/* TODO :: Total Week Payout gaious comment  */}
            {state.startWeek && state.endWeek ? (
              <div
                className="product-card"
                style={{
                  backgroundColor: "#ff8000",
                  color: "#fff",
                  border: "1px solid #dfe5eb",
                }}
              >
                <ButtonWithPopup
                  data={{
                    triggerDOM: (
                      <span
                        className="fas fa-info-circle color-white cursor-pointer float-right"
                        style={{ marginTop: 5, marginRight: 5 }}
                      />
                    ),
                    popupPosition: "left top",
                    text: (
                      <label className="color-black">
                        {" "}
                        We have deducted 5% from your total Payout for money
                        transfer fee. <br /> Total net receivables for
                        <br />
                        <strong>{state.payouts.substring(0, 15)}</strong>.
                      </label>
                    ),
                    loading: false,
                    padding: 0,
                    arrow: true,
                    style: { padding: 15, maxWidth: 150, borderRadius: 5 },
                    onAction: "hover",
                    checkORtimesButton: false,
                  }}
                />
                <div className="product-details text-center">
                  <label
                    style={{
                      fontSize: "1em",
                      marginBottom: 10,
                      display: "block",
                    }}
                  >
                    <strong style={{ fontSize: "1.6rem" }}>
                      {state.startWeek.substring(0, 15)}
                    </strong>{" "}
                    to{" "}
                    <strong style={{ fontSize: "1.6rem" }}>
                      {state.endWeek.substring(0, 15)}
                    </strong>{" "}
                    <br />
                    Payout <br />
                    <i>
                      Note: You must be a paid subscriber to receive your payout
                    </i>
                  </label>
                  <i></i>
                  <Query
                    query={GET_MY_PAY_CHECK}
                    variables={{
                      creator: currentUser.id,
                      dateStart: points.sendDateToServer(state.startWeek, true),
                      dateEnd: points.sendDateToServer(state.endWeek),
                    }}
                  >
                    {({ data, loading, refetch, error }) => {
                      if (loading || error) return null;
                      return (
                        <label style={{ fontSize: "2.5em" }}>
                          <strong>
                            $
                            {points.commafy(
                              points
                                .getTaxPercent(
                                  0.05,
                                  parseFloat(data.getMyPayCheck.count)
                                )
                                .toFixed(2)
                            )}
                          </strong>
                        </label>
                      );
                    }}
                  </Query>
                </div>
              </div>
            ) : (
              void 0
            )}
          </div>

          <span className="clear" />
        </div>

        {/* Modals */}
        {/* for upsel modal */}
        {state.openUpsell && (
          <UpsellAlert
            open={state.openUpsell}
            closeModal={this.toggleModalUpsell}
            session={this.props.session}
          />
        )}
      </div>
    );
  }
}

export default withAuth((session) => session && session.getCurrentUser)(
  HomepageFullRemodel
);
