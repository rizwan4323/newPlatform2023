import React from "react";
import toastr from "toastr";
import withAuth from "./../hoc/withAuth";
import { GET_FUNNEL_ORDERS, GET_MY_PAY_CHECK } from "./../queries";
import { Query } from "react-apollo";
import { Helmet } from "react-helmet";
import Container from "../components/table";
const { Table, Tbody } = Container;
import Loading from "../components/loading";
import ButtonWithPopup from "../components/buttonWithPopup";
import moment from "moment";
import SelectTag from "../components/selectTag";
import Pagination from "../components/pagination";
import ShowFilter from "../components/showFilter";
import LoadingPage from "../components/loadingPage";
import WantTogetPaid from "../components/wantToGetPaid";
const points = require("../../Global_Values");

class CODPayouts extends React.Component {
  constructor() {
    super();
    this.state = {
      currentPage: 1,
      payoutList: [],
      totalPayouts: 0,
      totalPayoutCount: 0,
      startWeek: "",
      endWeek: "",
      payouts: "",
      dropDownDateRange: "",
      is_page_loading: true,
    };
  }

  componentDidMount() {
    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: true,
      positionClass: "toast-bottom-right",
      preventDuplicates: false,
      timeOut: 0,
      extendedTimeOut: 0,
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };

    const payoutDate = 1; // or monday
    const weekStartFrom = -2; // or last friday

    const currentDate = moment().local();
    const thisWeekMonday = moment(new Date(currentDate.toString()))
      .local()
      .weekday(payoutDate);
    const lastFriday = moment(thisWeekMonday)
      .local()
      .startOf("week")
      .weekday(weekStartFrom);
    const endWeek = moment(
      new Date(points.deducDateFrom(new Date(lastFriday.toString()), 8))
    ).local(); // may allowance na isa
    const startWeek = moment(endWeek)
      .local()
      .startOf("week")
      .weekday(weekStartFrom);
    const payouts = moment(thisWeekMonday).local().add(7, "d");

    this.setState({
      is_page_loading: false,
      startWeek: startWeek.toString(),
      endWeek: endWeek.toString(),
      payouts: payouts.toString(),
    });
  }

  setLoadingTime(tiemout, etimeout) {
    toastr.options.timeOut = tiemout;
    toastr.options.extendedTimeOut = etimeout;
  }

  handleOnChange(event) {
    var name = event.target.name;
    var value = event.target.value;
    this.setState({ [name]: value });
  }

  funnelSalesTooltip({ active, payload, label }) {
    if (active && payload) {
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
          <label>Date: {payload[0].payload.date}</label> <br />
          <label>
            Sales: ${points.commafy(payload[0].payload.count.toFixed(2))}
          </label>
        </div>
      );
    }
  }

  getDate(date) {
    if (typeof date == "string") date = parseInt(date);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var date = new Date(new Date(date).setUTCHours(0));
    return (
      monthNames[date.getMonth()] +
      " " +
      date.getDate() +
      " " +
      date.getFullYear()
    );
  }

  fixExportData(data) {
    var regex = new RegExp("#|,|(\r\n|\r|\n)", "g"),
      replaceBy = ",";
    return data ? data.toString().replace(regex, replaceBy) : data;
  }

  exportToCSV() {
    var that = this;
    var orderList = this.state.payoutList;

    toastr.clear();
    toastr.options.timeOut = 0;
    toastr.options.extendedTimeOut = 0;
    toastr.info("Exporting please wait...", "");
    const rows = [
      [
        "Product",
        "Variant",
        "Quantity",
        "Local Price",
        "USD Price",
        "Payout",
        "Customer Email",
        "Phone",
        "Shipping Name",
        "Shipping Address1",
        "Shipping City",
        "Shipping Zip",
        "Shipping State/Province",
        "Shipping Country",
      ],
    ];
    orderList.forEach((el) => {
      el.line_items.forEach((li, lii) => {
        rows.push([
          that.fixExportData(li.title), // Lineitem name
          that.fixExportData(li.variant), // Lineitem variant name
          that.fixExportData(li.quantity), // Lineitem quantity
          li.price, // Lineitem price
          li.convertedPrice, // Lineitem converted price
          li.payoutPrice, // Lineitem payout
          that.fixExportData(el.shipping_information.email), // Shipping Email
          that.fixExportData(el.shipping_information.phone), // Shipping Phone
          that.fixExportData(el.shipping_information.name), // Shipping Name
          that.fixExportData(el.shipping_information.street1), // Shipping Address1
          that.fixExportData(el.shipping_information.city), // Shipping City
          that.fixExportData(el.shipping_information.zip), // Shipping Zip
          that.fixExportData(el.shipping_information.state), // Shipping Province
          that.fixExportData(el.shipping_information.country), // Shipping Country
        ]);
      });
    });

    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(function (rowArray) {
      rowArray = rowArray.map((el) => {
        if (el) {
          return el.toString().replace(/\,/g, " ");
        } else {
          return el;
        }
      });
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    var fileName =
      "Funnel Export (" + new Date().toLocaleDateString() + ").csv";
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

  head() {
    return (
      <Helmet bodyAttributes={{ class: "dashboardPage" }}>
        <title>COD Payouts - Product List Genie</title>
      </Helmet>
    );
  }

  render() {
    var state = this.state;
    var currentUser = this.props.session.getCurrentUser;

    if (state.is_page_loading) return <LoadingPage />;

    return (
      <div className="funnel">
        {this.head()}
        <div className="newPageHeader display-inline">
          <div className="column column_10_12">
            <span
              className="hide-in-desktop float-left"
              style={{ padding: 15 }}
            />
            <h4
              className="font-roboto-bold"
              style={{ fontSize: "1.5em", color: "#273037" }}
            >
              Cash On Delivery Payouts
            </h4>
          </div>
          <div className="column column_2_12">
            <WantTogetPaid {...this.props} />
          </div>
          <span className="clear" />
        </div>
        <div className="page-container">
          {/* <div className="column column_12_12 row-separator" style={{padding: 0}}>
                        <div className="notify-label">
                            <label>Hover your mouse to the <span className="fas fa-info-circle" /> button to see the details of each area.</label>
                        </div>
                    </div> */}
          <div
            className="column column_3_12 row-separator"
            style={{ padding: 0 }}
          >
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

          {/* table */}
          <div className="column column_9_12">
            <div>
              {/* filter */}
              <div className="filter-container">
                {state.totalPayoutCount != 0 && (
                  <button
                    className="btn-success stretch-to-mobile"
                    style={{ padding: "8px 15px", marginLeft: 10 }}
                    onClick={() => this.exportToCSV()}
                  >
                    Export to csv
                  </button>
                )}
                {(() => {
                  if (!state.startWeek) return null;
                  var dateRange = [];
                  var defaultSelected = "";
                  var startCount = -7;
                  for (var x = 0; x <= 3; x++) {
                    var startDay = startCount,
                      endDay = startCount + 6;
                    var start = moment(state.startWeek.substring(4, 15))
                      .local()
                      .add(startDay, "d")
                      .format("MMM DD YYYY")
                      .toString();
                    var end = moment(state.startWeek.substring(4, 15))
                      .local()
                      .add(endDay, "d")
                      .format("MMM DD YYYY")
                      .toString();
                    dateRange.push(
                      <option value={start + " - " + end} key={x}>
                        {start + " - " + end}
                      </option>
                    );
                    if (x == 1) defaultSelected = start + " - " + end;
                    startCount = endDay + 1;
                  }
                  return (
                    <SelectTag
                      className="stretch-to-mobile"
                      name="dropDownDateRange"
                      value={state.dropDownDateRange || defaultSelected}
                      options={dateRange}
                      onChange={(event) =>
                        this.setState({ dropDownDateRange: event.target.value })
                      }
                      style={{ width: 220, marginLeft: 10 }}
                    />
                  );
                })()}
                {state.totalPayoutCount != 0 && (
                  <Pagination
                    className="stretch-to-mobile"
                    totalPage={state.totalPayoutCount}
                    currentPage={state.currentPage}
                    action={(result) => this.setState({ currentPage: result })}
                    style={{ marginLeft: 10 }}
                  />
                )}
              </div>
              {/* show filter */}
              {state.currentPage > 1 || state.dropDownDateRange ? (
                <div
                  className="flex-container"
                  style={{ justifyContent: "flex-start" }}
                >
                  {state.currentPage > 1 && (
                    <ShowFilter
                      label={"Page: " + state.currentPage}
                      onClick={() => this.setState({ currentPage: 1 })}
                    />
                  )}
                  {state.dropDownDateRange && (
                    <ShowFilter
                      label={state.dropDownDateRange}
                      onClick={() => this.setState({ dropDownDateRange: "" })}
                    />
                  )}
                </div>
              ) : (
                void 0
              )}
            </div>
            <div className="product-card">
              <div className="product-details">
                <div className="row-separator">
                  <h5 className="font-roboto-bold" style={{ margin: 0 }}>
                    Payout History
                  </h5>
                </div>
                <Table
                  headers={[
                    { text: "Date Delivered" },
                    { text: "Customer Email" },
                    { text: "Product Name" },
                    { text: "Qty" },
                    { text: "Local Price" },
                    { text: "USD Price" },
                    { text: "Product Cost" },
                    { text: "Payout" },
                  ]}
                >
                  <Query
                    query={GET_FUNNEL_ORDERS(
                      `{  dateStatusDelivered currencySymbol count shipping_information { email } line_items { title price convertedPrice pcost payoutPrice quantity plg_tax productCost } }`
                    )}
                    variables={{
                      id: currentUser.id,
                      merchant_type: "cod",
                      order_status: "delivered",
                      filterByStartDate: state.dropDownDateRange
                        ? points.sendDateToServer(
                            state.dropDownDateRange.split(" - ")[0],
                            true
                          )
                        : points.sendDateToServer(state.startWeek, true),
                      filterByEndDate: state.dropDownDateRange
                        ? points.sendDateToServer(
                            state.dropDownDateRange.split(" - ")[1]
                          )
                        : points.sendDateToServer(state.endWeek),
                      skip: state.currentPage - 1,
                      sortBy: "dateStatusDelivered",
                      cod_analytics: true,
                    }}
                    notifyOnNetworkStatusChange={true}
                    onCompleted={(data) => {
                      if (data.getMyFunnelOrders.length != 0) {
                        this.setState({
                          payoutList: data.getMyFunnelOrders,
                          totalPayoutCount: data.getMyFunnelOrders[0].count,
                        });
                      } else {
                        this.setState({ payoutList: [], totalPayoutCount: 0 });
                      }
                    }}
                  >
                    {({ data, loading, refetch, error }) => {
                      if (loading) return <Tbody loading={true} />;
                      if (error)
                        return (
                          <Tbody
                            singleRowText={
                              "An error has occurred please try again."
                            }
                          />
                        );
                      if (data.getMyFunnelOrders.length == 0)
                        return (
                          <Tbody
                            singleRowText={
                              "No order has been delivered yet. check back soon!"
                            }
                          />
                        );
                      return data.getMyFunnelOrders.map((order, index) => {
                        return (
                          <Tbody index={index} key={index}>
                            <div>{this.getDate(order.dateStatusDelivered)}</div>
                            <div>{order.shipping_information.email}</div>
                            <div>
                              <ul className="item-list">
                                {order.line_items.map((li, li_index) => {
                                  return (
                                    <li
                                      key={li_index}
                                      style={{
                                        backgroundColor: "transparent",
                                        color: "inherit",
                                        cursor: "inherit",
                                      }}
                                    >
                                      {li.title}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            <div className="display-inline">
                              <ul className="item-list">
                                {order.line_items.map((li, li_index) => {
                                  return (
                                    <li
                                      key={li_index}
                                      style={{
                                        backgroundColor: "transparent",
                                        color: "inherit",
                                        cursor: "inherit",
                                      }}
                                    >
                                      {li.quantity}x
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            <div className="display-inline">
                              <ul className="item-list">
                                {order.line_items.map((li, li_index) => {
                                  return (
                                    <li
                                      key={li_index}
                                      style={{
                                        backgroundColor: "transparent",
                                        color: "inherit",
                                        cursor: "inherit",
                                      }}
                                    >
                                      {order.currencySymbol
                                        ? order.currencySymbol
                                        : "$"}
                                      {points.commafy(li.price.toFixed(2))}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            <div className="display-inline">
                              <ul className="item-list">
                                {order.line_items.map((li, li_index) => {
                                  return (
                                    <li
                                      key={li_index}
                                      style={{
                                        backgroundColor: "transparent",
                                        color: "inherit",
                                        cursor: "inherit",
                                      }}
                                    >
                                      $
                                      {points.commafy(
                                        li.convertedPrice
                                          ? li.convertedPrice.toFixed(2)
                                          : 0
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            <div className="display-inline">
                              <ul className="item-list">
                                {order.line_items.map((li, li_index) => {
                                  return (
                                    <div>
                                      <ButtonWithPopup
                                        data={{
                                          triggerDOM: (
                                            <li
                                              key={li_index}
                                              style={{
                                                backgroundColor: "transparent",
                                                color: "inherit",
                                                cursor: "inherit",
                                              }}
                                            >
                                              $
                                              {points.commafy(
                                                li.pcost ? li.pcost : 0
                                              )}
                                            </li>
                                          ),
                                          popupPosition: "top center",
                                          text: (
                                            <label className="color-black">
                                              Product cost + Country Tax <br />{" "}
                                              {li.productCost
                                                ? li.productCost
                                                : 0}{" "}
                                              + {li.plg_tax ? li.plg_tax : 0}
                                            </label>
                                          ),
                                          loading: false,
                                          padding: 0,
                                          arrow: true,
                                          style: {
                                            padding: 15,
                                            maxWidth: 100,
                                            borderRadius: 5,
                                          },
                                          onAction: "hover",
                                          checkORtimesButton: false,
                                        }}
                                      />
                                    </div>
                                  );
                                })}
                              </ul>
                            </div>
                            <div className="display-inline">
                              <ul className="item-list">
                                {order.line_items.map((li, li_index) => {
                                  return (
                                    <li
                                      key={li_index}
                                      style={{
                                        backgroundColor: "transparent",
                                        color: "inherit",
                                        cursor: "inherit",
                                      }}
                                    >
                                      $
                                      {points.commafy(
                                        li.payoutPrice ? li.payoutPrice : 0
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
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
          <span className="clear" />
        </div>
      </div>
    );
  }
}

export default withAuth((session) => session && session.getCurrentUser)(
  CODPayouts
);
