import React from "react";
import withAuth from "../hoc/withAuth";
import { Link } from "react-router-dom";
import ProductCard from "../components/productCard";
import { Helmet } from "react-helmet";
import Loading from "../components/loading";
import LoadingPage from "../components/loadingPage";
import {
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import UpsellAlert from "../components/ModalComponent/upsellAlert";
import LeaderBoardsRemodel from "../components/leaderBoardsRemodel";
import { GET_MY_FUNNEL_ORDER_TOTAL_SALES } from "./../queries";
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

class HomepageFullRemodelES extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      openUpsell: false,
      chart: [],
      activeIndex: 7,
      leaderboardData: [],
      oneTimeChallenge: [],

      // video
      h_full_video: "https://player.vimeo.com/video/328343330",
      is_iframe_loaded: false,
      iframe_height: 500,
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
          // this.setState({ h_full_video: result.data.getAdminHomepageVideo.homepage_video_full })
          this.setState({
            h_full_video: "https://player.vimeo.com/video/328343330",
          });
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

    this.getVideoData(365626611, "v1");
    this.getVideoData(395491729, "v2");
    this.getVideoData(395491673, "v3");

    points.getHomepageSliderImageContent((data) =>
      this.setState({ slider_images: data.list, slider_loading: false })
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
        <title>TABLERO - Product List Genie</title>
      </Helmet>
    );
  }

  render() {
    let currentUser = this.props.session.getCurrentUser,
      has_arabic_funnel_access = condition.has_arabic_funnel(currentUser);
    var state = this.state;
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
                TABLERO
              </h4>
              <Link
                to="/dashboard"
                className="display-inline color-black"
                style={{ lineHeight: 0.1 }}
              >
                <label style={{ fontSize: "1.2em", marginLeft: 5 }}>EN</label>{" "}
                <span className="cursor-pointer lang-sm-uk" />
              </Link>
            </div>
          </div>
          <div className="column column_6_12 text-right">
            <div className="display-inline float-right">
              <label>Disponible en:</label>
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
          <div className="column column_5_12">
            <div className="column column_12_12" style={{ padding: 0 }}>
              <div className="product-card" style={{ marginTop: 0 }}>
                <div
                  className="product-details flex-container display-inline"
                  style={{ padding: 10, justifyContent: "space-between" }}
                >
                  <h4
                    className="font-roboto-bold fix-style"
                    style={{ fontSize: "1.5em" }}
                  >
                    Empieza aqui
                  </h4>
                  <a
                    href="https://drive.google.com/file/d/1yDtKvbuygZ9fwqhIL2DudT1xAaMDu-Jq/view?usp=sharing"
                    className="fix-style font-roboto-bold color-black"
                    target="_blank"
                  >
                    descargar <u className="color-blue">Blueprint</u>
                  </a>
                  <iframe
                    src={state.h_full_video}
                    onLoad={(event) => {
                      event.target.height = (event.target.offsetWidth / 16) * 9;
                      var hallOfGenieHeight = event.target.offsetHeight - 15;
                      if (document.querySelector(".video1")) {
                        hallOfGenieHeight =
                          event.target.offsetHeight +
                          document.querySelector(".video1").offsetHeight -
                          15;
                      }
                      this.setState({
                        is_iframe_loaded: true,
                        iframe_height: hallOfGenieHeight,
                      });
                    }}
                    width="100%"
                    frameBorder="0"
                    webkitallowfullscreen="true"
                    mozallowfullscreen="true"
                    allowFullScreen
                    style={{ minHeight: "39vh" }}
                  />
                </div>
              </div>
            </div>
            {(() => {
              if (!state.v1) return null;
              const video1_url =
                "https://player.vimeo.com/video/" + state.v1.id;
              const text1 = () => {
                if (!state.is_iframe_loaded && state.h_full_video == video1_url)
                  return <Loading height={75} width={75} />;
                else if (
                  state.is_iframe_loaded &&
                  state.h_full_video == video1_url
                )
                  return <span className="fas fa-play" />;
                else return "1";
              };
              return (
                <div
                  className="column video1"
                  style={{ padding: "0 5px", width: "33.33%" }}
                >
                  <div className="product-card text-center">
                    <div
                      className="cursor-pointer display-inline"
                      onClick={() => this.changeSelectedVideo(video1_url)}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#3637388a",
                      }}
                    >
                      <label
                        className="color-white"
                        style={{ margin: "0 auto", fontSize: "3em" }}
                      >
                        {text1()}
                      </label>
                    </div>
                    <img src={state.v1.thumbnail_large} width="100%" />
                  </div>
                </div>
              );
            })()}
            {(() => {
              if (!state.v2) return null;
              const video2_url =
                "https://player.vimeo.com/video/" + state.v2.id;
              const text2 = () => {
                if (!state.is_iframe_loaded && state.h_full_video == video2_url)
                  return <Loading height={75} width={75} />;
                else if (
                  state.is_iframe_loaded &&
                  state.h_full_video == video2_url
                )
                  return <span className="fas fa-play" />;
                else return "2";
              };
              return (
                <div
                  className="column video2"
                  style={{ padding: "0 5px", width: "33.33%" }}
                >
                  <div className="product-card text-center">
                    <div
                      className="cursor-pointer display-inline"
                      onClick={() => this.changeSelectedVideo(video2_url)}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#3637388a",
                      }}
                    >
                      <label
                        className="color-white"
                        style={{ margin: "0 auto", fontSize: "3em" }}
                      >
                        {text2()}
                      </label>
                    </div>
                    <img src={state.v2.thumbnail_large} width="100%" />
                  </div>
                </div>
              );
            })()}
            {(() => {
              if (!state.v3) return null;
              const video3_url =
                "https://player.vimeo.com/video/" + state.v3.id;
              const text3 = () => {
                if (!state.is_iframe_loaded && state.h_full_video == video3_url)
                  return <Loading height={75} width={75} />;
                else if (
                  state.is_iframe_loaded &&
                  state.h_full_video == video3_url
                )
                  return <span className="fas fa-play" />;
                else return "3";
              };
              return (
                <div
                  className="column video3"
                  style={{ padding: "0 5px", width: "33.33%" }}
                >
                  <div className="product-card text-center">
                    <div
                      className="cursor-pointer display-inline"
                      onClick={() => this.changeSelectedVideo(video3_url)}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#3637388a",
                      }}
                    >
                      <label
                        className="color-white"
                        style={{ margin: "0 auto", fontSize: "3em" }}
                      >
                        {text3()}
                      </label>
                    </div>
                    <img src={state.v3.thumbnail_large} width="100%" />
                  </div>
                </div>
              );
            })()}
          </div>
          <div className="column column_3_12">
            <div
              className="custom-content-slider product-card"
              style={{ marginTop: 0 }}
            >
              <h4
                className="font-roboto-bold fix-style"
                style={{ fontSize: "1.5em", padding: 10 }}
              >
                Salón de los genios
              </h4>
              {(() => {
                if (!state.slider_loading) {
                  if (state.slider_images.length != 0) {
                    const extraStyle = {
                      height: state.iframe_height,
                      width: "100%",
                      margin: "10px 0",
                    };
                    return (
                      <ContentSlider {...SlideSettings}>
                        {state.slider_images.map((src, i) => {
                          if (src)
                            src = src.replace(
                              "/home/productlistgenie/public_html",
                              "https://productlistgenie.com"
                            );
                          return (
                            <div
                              style={{
                                background: "url(" + src + ")",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                backgroundPosition: "center top",
                                ...extraStyle,
                              }}
                              key={i}
                            />
                          );
                        })}
                      </ContentSlider>
                    );
                  } else {
                    return (
                      <div className="text-center" style={{ padding: 20 }}>
                        <label>No image to display</label>
                      </div>
                    );
                  }
                } else {
                  return <Loading height={"100%"} width={"100%"} />;
                }
              })()}
            </div>
          </div>
          <div className="column column_4_12">
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
                    Ventas proyectadas totales
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
                      <div className="display-inline">
                        <div
                          className="column column_5_12"
                          style={{ padding: 0 }}
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
                          className="column column_7_12 display-inline flex-container"
                          style={{
                            paddingRight: 0,
                            justifyContent: "flex-end",
                          }}
                        >
                          <Query
                            query={GET_MY_FUNNEL_ORDER_TOTAL_SALES}
                            variables={{
                              creator: currentUser.id,
                              dateFrom: state.date_filter
                                ? points.sendDateToServer(
                                    points.getPastDate(state.date_filter),
                                    true
                                  )
                                : "",
                              dateTo: state.date_filter
                                ? state.date_filter <= 1
                                  ? points.sendDateToServer(
                                      points.getPastDate(state.date_filter)
                                    )
                                  : points.sendDateToServer(new Date())
                                : "",
                              timezoneOffset: new Date().getTimezoneOffset(),
                            }}
                            onCompleted={(data) =>
                              this.setState({
                                funnelTotalSales:
                                  data.getMyFunnelOrderTotalSales.dates,
                              })
                            }
                            notifyOnNetworkStatusChange
                          >
                            {({ data, loading, refetch, error }) => {
                              if (loading)
                                return <Loading height={44} width={44} />;
                              if (error)
                                return (
                                  <label>
                                    Error getting total sales. <br />
                                    Please try again.
                                  </label>
                                );
                              if (!data.getMyFunnelOrderTotalSales)
                                return (
                                  <label className="no-result">
                                    No Funnel Order Found.
                                  </label>
                                );
                              return (
                                <div>
                                  <label
                                    style={{ color: "#b8bec4", marginRight: 5 }}
                                  >
                                    Total:{" "}
                                  </label>{" "}
                                  <label
                                    className="color-green"
                                    style={{ fontSize: "1.5em" }}
                                  >
                                    $
                                    {points.commafy(
                                      parseFloat(
                                        data.getMyFunnelOrderTotalSales.count
                                      ).toFixed(2)
                                    )}
                                  </label>{" "}
                                  <br />
                                  <label
                                    style={{ color: "#b8bec4", marginRight: 5 }}
                                  >
                                    COD:{" "}
                                  </label>{" "}
                                  <label
                                    className="color-green"
                                    style={{ fontSize: "1.5em" }}
                                  >
                                    $
                                    {points.commafy(
                                      parseFloat(
                                        data.getMyFunnelOrderTotalSales
                                          .total_cod
                                      ).toFixed(2)
                                    )}
                                  </label>
                                </div>
                              );
                            }}
                          </Query>
                        </div>
                      </div>
                      <span className="clear row-separator" />
                      {(() => {
                        // var chartData = [], howManyDays = parseInt(state.date_filter), initial = 0;
                        // if(howManyDays <= 1) initial = howManyDays; // para sa today at yesterday isang araw lang lalabas sa chart
                        // for (let i = howManyDays; i >= initial; i--) {
                        //     let days_ago = points.getPastDate(i).toDateString().substring(4);
                        //     chartData.push({ name: days_ago, Sales: 0, aov: 0, cod: 0, delivered: 0 });
                        // }
                        // if(howManyDays <= 1) { // ginawa ko to dahil sa yesterday bug so ginamit ko na to sa yesterday at today.
                        //     let oneDayAccumulate = { count: 0, count_order: 0, total_cod: 0, total_delivered: 0, total_not_delivered: 0 };
                        //     state.funnelTotalSales.forEach((e, i) => {
                        //         oneDayAccumulate.count += e.count;
                        //         oneDayAccumulate.count_order += e.count_order;
                        //         oneDayAccumulate.total_cod += e.total_cod;
                        //         oneDayAccumulate.total_delivered += e.total_delivered;
                        //         oneDayAccumulate.total_not_delivered += e.total_not_delivered;
                        //     });
                        //     chartData[0].Sales = parseFloat(oneDayAccumulate.count.toFixed(2));;
                        //     chartData[0].aov = parseFloat((oneDayAccumulate.count / oneDayAccumulate.count_order).toFixed(2)) || 0;
                        //     chartData[0].cod = parseFloat(oneDayAccumulate.total_cod.toFixed(2));
                        //     chartData[0].delivered = parseFloat(oneDayAccumulate.total_delivered.toFixed(2));
                        //     chartData[0].not_delivered = parseFloat(oneDayAccumulate.total_not_delivered.toFixed(2));
                        // } else { // eto gagamitin sa this week and above except if the value of this week is less than equal 1 wednesday mgagamit na to
                        //     state.funnelTotalSales.forEach(el => {
                        //         // let sale_date = new Date(el.date).toDateString().substring(4);
                        //         chartData.forEach((chart, chartIndex) => {
                        //             // if(sale_date == chart.name) {
                        //             if(el.date == chart.name) {
                        //                 chartData[chartIndex].Sales = parseFloat(el.count.toFixed(2));
                        //                 chartData[chartIndex].aov = parseFloat((el.count / el.count_order).toFixed(2));
                        //                 chartData[chartIndex].cod = parseFloat(el.total_cod.toFixed(2));
                        //                 chartData[chartIndex].delivered = parseFloat(el.total_delivered.toFixed(2));
                        //                 chartData[chartIndex].not_delivered = parseFloat(el.total_not_delivered.toFixed(2));
                        //             }
                        //         });
                        //     });
                        // }
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
            <div className="row-separator">
              <button
                className="stretch-width column"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                  backgroundColor: "#4267b2",
                  border: "1px solid transparent",
                }}
                onClick={() =>
                  window.open(
                    "https://app.productlistgenie.io/training/5dc75d1657aa580aa8d7b585"
                  )
                }
              >
                <div
                  style={{ padding: 10, backgroundColor: "#395ba0", width: 50 }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Facebook_icon_2013.svg/1024px-Facebook_icon_2013.svg.png"
                    width="100%"
                  />
                </div>
                <div className="one-line-ellipsis" style={{ marginLeft: 10 }}>
                  <label className="cursor-pointer font-roboto-bold color-white">
                    Comenzar anuncios de Facebook
                  </label>
                </div>
              </button>
              <span className="clear" />
            </div>
            <div className="row-separator">
              <button
                className="stretch-width column"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                  backgroundColor: "#dedd6c",
                  border: "1px solid transparent",
                }}
                onClick={() =>
                  window.open(
                    "https://app.productlistgenie.io/training/5dc7528357aa580aa8d79f4d"
                  )
                }
              >
                <div
                  style={{ padding: 10, backgroundColor: "#ffff00", width: 50 }}
                >
                  <img
                    src="https://i.pinimg.com/originals/1a/e6/b5/1ae6b5276a1b08a3915a0d358f3ab7c1.png"
                    width="100%"
                  />
                </div>
                <div className="one-line-ellipsis" style={{ marginLeft: 10 }}>
                  <label className="cursor-pointer font-roboto-bold color-black">
                    Comenzar anuncios de Snapchat
                  </label>
                </div>
              </button>
              <span className="clear" />
            </div>
            {/* {!has_arabic_funnel_access &&
                            <div className="row-separator">
                                <button className="stretch-width column" style={{ display: 'flex', alignItems: 'center', padding: 0, backgroundColor: '#0a9e46', border: '1px solid transparent' }} onClick={() => window.open("https://themm.kartra.com/page/YIw155")}>
                                    <div style={{ padding: 15, backgroundColor: '#00732f', width: 50 }}>
                                        <span className="fas fa-filter color-white" />
                                    </div>
                                    <div className="one-line-ellipsis" style={{ marginLeft: 10, padding: '15px 0' }}>
                                        <label className="cursor-pointer font-roboto-bold color-white">Arabic Mastermind - العقل المدبر العربي</label>
                                    </div>
                                </button>
                                <span className="clear" />
                            </div>
                        } */}
            <div className="row-separator">
              <button
                className="stretch-width column cursor-pointer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                  backgroundColor: "#ff7837",
                  border: "1px solid transparent",
                }}
                onClick={() => window.open("tel:+14072583564", "_self")}
              >
                <div
                  style={{ padding: 15, backgroundColor: "#ff5300", width: 50 }}
                >
                  <span
                    className="fas fa-phone color-white"
                    style={{ textShadow: "0px 0px 2px #000" }}
                  />
                </div>
                <div
                  className="one-line-ellipsis text-left"
                  style={{ marginLeft: 10 }}
                >
                  <label
                    className="color-white font-roboto-bold"
                    style={{ display: "block" }}
                  >
                    Aún perdido?
                  </label>
                  <label className="color-white">
                    Call{" "}
                    <a
                      href="tel:+14072583564"
                      className="color-white"
                      style={{ lineHeight: 1 }}
                    >
                      +1 800 324-9832
                    </a>{" "}
                    (M-F 9-5 EST)
                  </label>
                </div>
                <span
                  className="fas fa-arrow-right animate-slide-left-to-right color-white"
                  style={{ fontSize: "1.5em", marginLeft: 10 }}
                />
              </button>
              <span className="clear" />
            </div>
          </div>

          {/* <div className="grid clear">
                        <h3 style={{ paddingTop: '20px' }}>Últimos productos agregados</h3>
                        <div className="flex-container">
                            {(()=>{
                                if(state.data.length != 0){
                                    return state.data.map((latest, i) => {
                                        return <ProductCard tags={latest.tags} toggleModalUpsell={this.toggleModalUpsell} refetch={this.props.refetch} session={this.props.session} product_data={{ prodid: latest.id, handle: latest.handle, title: latest.title, src: latest.images.length != 0 ? latest.images[0].src : "/assets/graphics/no-result.svg", price: latest.variants[0].price, cpp: latest.variants[0].sku, days_ago: latest.published_at }} key={latest.id} />
                                    });
                                } else {
                                    // for loading purpose 
                                    var x = ['1','2','3','4','5','6']
                                    return x.map(i => {
                                        return <ProductCard loading={true} refetch={this.props.refetch} session={this.props.session} product_data={{prodid: '00',handle:'loading',title:'Loading...',src:'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',price:'0.00',days_ago:new Date()}} key={i} />
                                    })
                                }
                            })()}
                        </div>
                    </div> */}
          <div className="grid clear" style={{ overflow: "hidden" }}>
            <h3 style={{ marginTop: 20 }}>PLG Pro Services</h3>
            {/* // 1st Image  */}
            <div className="column column_3_12">
              <div className="product-card">
                <div className="product-details">
                  <a
                    href="https://themm.kartra.com/page/ScW176"
                    target="_blank"
                  >
                    <img
                      src="../../../assets/graphics/newthumbnails/FunnelServiceDoneForYouFunnel.jpg"
                      width="100%"
                    />
                  </a>
                </div>
              </div>
            </div>
            {/* // 2nd Image  */}
            <div className="column column_3_12">
              <div className="product-card">
                <div className="product-details">
                  <a
                    href="https://themm.kartra.com/page/ycK175"
                    target="_blank"
                  >
                    <img
                      src="../../../assets/graphics/newthumbnails/FunnelServiceCustomLogo.jpg"
                      width="100%"
                    />
                  </a>
                </div>
              </div>
            </div>
            {/* // 3rd Image  */}
            <div className="column column_3_12">
              <div className="product-card">
                <div className="product-details">
                  <a
                    href="https://themm.kartra.com/page/snap-ads-coaching"
                    target="_blank"
                  >
                    <img
                      src="../../../assets/graphics/newthumbnails/CoachingServices30Min.jpg"
                      width="100%"
                    />
                  </a>
                </div>
              </div>
            </div>

            <div className="column column_3_12">
              <div className="product-card">
                <div className="product-details">
                  <a
                    href="https://themm.kartra.com/checkout/9c2601d141414bff362a7c7f71b7ab48"
                    target="_blank"
                  >
                    <img
                      src="../../../assets/graphics/newthumbnails/FunnelServiceSimpleArabic.jpg"
                      width="100%"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="column column_3_12">
              <div className="product-card">
                <div className="product-details">
                  <a
                    href="https://themm.kartra.com/page/DjA177"
                    target="_blank"
                  >
                    <img
                      src="../../../assets/graphics/newthumbnails/FunnelServiceVideoCreationn.jpg"
                      width="100%"
                    />
                  </a>
                </div>
              </div>
            </div>
            {/* // 2nd Image  */}
            <div className="column column_3_12">
              <div className="product-card">
                <div className="product-details">
                  <a
                    href="https://themm.kartra.com/page/snap-ads-coaching"
                    target="_blank"
                  >
                    <img
                      src="../../../assets/graphics/newthumbnails/CoachingServices1hr.jpg"
                      width="100%"
                    />
                  </a>
                </div>
              </div>
            </div>
            {/* // 3rd Image  */}
            <div className="column column_3_12">
              <div className="product-card">
                <div className="product-details">
                  <a
                    href="https://themm.kartra.com/page/professional-funnel-bundle-pack"
                    target="_blank"
                  >
                    <img
                      src="../../../assets/graphics/newthumbnails/FunnelServiceEnglishFunnel.jpg"
                      width="100%"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="column column_3_12">
              <div className="product-card">
                <div className="product-details">
                  <a
                    href="https://themm.kartra.com/page/6dk178"
                    target="_blank"
                  >
                    <img
                      src="../../../assets/graphics/newthumbnails/DFYAdAgenncy.jpg"
                      width="100%"
                    />
                  </a>
                </div>
              </div>
            </div>
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
  HomepageFullRemodelES
);
