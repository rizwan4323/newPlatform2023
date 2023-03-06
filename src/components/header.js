import React from "react";
import moment from "moment";
import webConfig from "./../../webConfig";
import toastr from "toastr";
import { NavLink } from "react-router-dom";
import {
  GET_ADMIN_SETTINGS,
  READ_ALL_NOTIFICATION,
  GET_MESSAGES_COUNT,
  GET_MESSAGES,
} from "./../queries";
import { Query, Mutation } from "react-apollo";
import withSession from "./../hoc/withSession";
import Popup from "reactjs-popup";
import UpsellAlert from "../components/ModalComponent/upsellAlert";
import Notif from "../components/notification";
import Modal from "../components/ModalComponent";
import Messages from "../components/messages";
import * as Cookies from "es-cookie";
const points = require("../../Global_Values");

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.refetch_unread_count = null;
    this.refetch_messages = null;
    this.state = {
      shouldUpsell: false,
      is_messages_open: false,
      createModal: false,
      startModal: false,
      select_country: "",
      isProdTestedopt: "no",
      sourcing_standard: "no",
      selected_user: null,
      h_full_video: "https://player.vimeo.com/video/328343330",
    };
    this.toggleUpsell = this.toggleUpsell.bind(this);
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
  componentDidMount() {
    this.getHomepageVideo();
    this.redirect();
    if (this.props.session.getCurrentUser) {
      // start notifying the admin that they are log in as Anonymous
      let isLoginAsAnonymous =
        localStorage.getItem(points.plg_domain_secret) || false;
      if (isLoginAsAnonymous) {
        var div = document.createElement("div");
        div.id = "notify-anonymous";
        div.classList.add("funnel");
        div.classList.add("text-center");
        div.style.cssText =
          "position: fixed; left: 0; bottom: 0; width: 100%; z-index: 1; padding: 10px; background-color: #28c686;";
        div.innerHTML = `<label class="color-white" style="font-size: 1.3em">You log in to the customer account as anonymous.</label>`;
        document.body.appendChild(div);

        var btn = document.createElement("button");
        btn.innerText = "Login back";
        btn.classList.add("btn-warning");
        btn.style.cssText = "margin-left: 10px; padding: 5px;";
        btn.onclick = () => {
          Cookies.remove(points.cookie_name);
          Cookies.set(
            points.cookie_name,
            localStorage.getItem("temp_" + points.cookie_name)
          );
          Cookies.set("token", localStorage.getItem("temp_token"));
          localStorage.removeItem("temp_token");
          localStorage.removeItem("temp_" + points.cookie_name);
          localStorage.removeItem(points.plg_domain_secret);
          window.location.href = localStorage.getItem("temp_redirect");
        };
        div.appendChild(btn);
      }
      // end notifying the admin that they are log in as Anonymous

      // start opening the message
      let params = points.getURLParameters(window.location.href);
      if (params && params.notifid) this.setState({ is_messages_open: true });
      // end opening the message
    }
  }

  componentWillUnmount() {
    if (document.getElementById("notify-anonymous"))
      document.getElementById("notify-anonymous").remove();
  }

  componentWillUpdate(props) {
    this.redirect();
  }

  redirect() {
    // if (this.props.session.getCurrentUser && window.location.href != "/signin" && !localStorage.getItem(points.plg_domain_secret)) { // only if need to
    if (
      this.props.session.getCurrentUser &&
      window.location.href != "/signin"
    ) {
      if (
        this.props.session.getCurrentUser.privilege == 0 &&
        window.location.pathname !== "/free-user-landing-page" &&
        window.location.pathname !== "/signout"
      ) {
        // User Privilege
        // TODO :: Give the user privilege zero to access route
        // window.location.href = '/free-user-landing-page';
        // ! Commented recursing itself
        // window.location.href = '/';
      } else if (
        this.props.session.getCurrentUser.privilege != 0 &&
        window.location.pathname === "/free-user-landing-page"
      ) {
        // User Privilege
        window.location.href = "/";
      } else if (
        window.location.pathname !== "/admin-manage-cod-products" &&
        window.location.pathname !== "/dashboard" &&
        this.props.session.getCurrentUser.access_tags.includes("fulfiller") &&
        this.props.session.getCurrentUser.privilege != 10
      ) {
        // User Privilege
        window.location.href = "/dashboard";
      }
    }
  }

  handleOnChange(name, event) {
    var value = event.target.value;
    this.setState({ [name]: value });
  }

  toggleCreateModal() {
    this.setState({ createModal: !this.state.createModal });
  }

  toggleStartModal() {
    this.setState({ startModal: !this.state.startModal });
  }
  toggleUpsell(event) {
    event.preventDefault();
    this.setState({
      shouldUpsell: !this.state.shouldUpsell,
    });
  }

  closeProfile() {
    document.querySelector(".wrap").click();
  }

  closeNotification() {
    document.querySelector(".notif").click();
  }

  toggleSideBar() {
    document.querySelector(".main").classList.toggle("close-sidebar");
    document.querySelector(".sideBar").classList.toggle("open-sidebar");
    document.querySelector(".plg-logo").classList.toggle("hide");
  }

  readAllNotification(readAllNotification) {
    readAllNotification()
      .then((data) => {
        this.props.refetch();
      })
      .catch((error) => {
        console.error("ERR =>", error);
      });
  }

  notificationSubscription() {
    let isLoginAsAnonymous =
      localStorage.getItem(points.plg_domain_secret) || false;
    if (!isLoginAsAnonymous) {
      let clientNotification = points.clientNotification();
      let isSubscribed = false;
      let swRegistration = null;
      let applicationKey = clientNotification.publicKey;
      let userID = this.props.session.getCurrentUser.id;
      // Url Encription
      function urlB64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
          .replace(/\-/g, "+")
          .replace(/_/g, "/");
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }
      // Installing service worker
      if ("serviceWorker" in navigator && "PushManager" in window) {
        console.log("Service Worker and Push is supported");
        navigator.serviceWorker
          .register("/assets/graphics/js/sw.js")
          .then(function (swReg) {
            console.log("service worker registered");
            swRegistration = swReg;
            swRegistration.pushManager
              .getSubscription()
              .then(function (subscription) {
                isSubscribed = !(subscription === null);
                if (isSubscribed) {
                  console.log("User is subscribed");
                } else {
                  swRegistration.pushManager
                    .subscribe({
                      userVisibleOnly: true,
                      applicationServerKey: urlB64ToUint8Array(applicationKey),
                    })
                    .then(function (subscription) {
                      console.log("User is subscribed");
                      saveSubscription(subscription);
                      isSubscribed = true;
                    })
                    .catch(function (err) {
                      console.log("Failed to subscribe user: ", err);
                    });
                }
              });
          })
          .catch(function (error) {
            console.error("Service Worker Error", error);
          });
      } else {
        console.warn("Push messaging is not supported");
      }
      // Send request to database for add new subscriber
      function saveSubscription(sub) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", "/api/subscribeNotification");
        xmlHttp.setRequestHeader(
          "Content-Type",
          "application/json;charset=UTF-8"
        );
        xmlHttp.onreadystatechange = function () {
          if (xmlHttp.readyState != 4) return;
          if (xmlHttp.status != 200 && xmlHttp.status != 304) {
            console.log("HTTP error " + xmlHttp.status, null);
          } else {
            console.log("User subscribed to server");
          }
        };
        var ss = JSON.stringify(sub);
        var parsedSubs = JSON.parse(ss);
        parsedSubs._id = userID;
        console.log(JSON.stringify(parsedSubs));
        xmlHttp.send(JSON.stringify(parsedSubs));
      }
    }
  }

  refetchNotification() {
    if (this.refetch_unread_count) this.refetch_unread_count();
    if (this.refetch_messages) this.refetch_messages();
  }

  render() {
    var currentUser = this.props.session.getCurrentUser;
    let state = this.state;
    if (currentUser) {
      let reversed_notification = JSON.parse(
        JSON.stringify(this.props.session.getCurrentUser.notification)
      ).reverse();
      let is_admin = currentUser.privilege === 10; // User Privilege

      return (
        <div className="funnel">
          {state.startModal && (
            <Modal
              open={state.startModal}
              closeModal={() => this.toggleStartModal()}
              session={this.props.session}
              style={{
                width: "60%",
                borderTop: "5px solid #23c78a",
                borderRadius: 10,
                padding: 0,
              }}
            >
              <div className="column_12_12">
                <style
                  dangerouslySetInnerHTML={{
                    __html: `.popup-content .content { padding: 0px; }`,
                  }}
                />
                <div
                  className="clear"
                  style={{
                    padding: 20,
                    backgroundColor: "#f2f9f6",
                    overflow: "hidden",
                  }}
                >
                  <h4 className="header">Start Here Modals Heading</h4>
                </div>
              </div>
              <br></br>
              <div className="startModalWrapper">
                <div className="startModalItem">
                  <iframe
                    src={state.h_full_video}
                    onLoad={(event) => {
                      event.target.height = (event.target.offsetWidth / 16) * 9;
                      var hallOfGenieHeight = event.target.offsetHeight - 0;
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
                  />
                  <h2 className="modalHeading">Modal Heading</h2>
                  <p className="modalText">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged.
                  </p>
                  <hr />
                  <p className="modalText">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged.
                  </p>
                </div>
                <div className="startModalItem">
                  <iframe
                    src={state.h_full_video}
                    onLoad={(event) => {
                      event.target.height = (event.target.offsetWidth / 16) * 9;
                      var hallOfGenieHeight = event.target.offsetHeight - 0;
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
                  />
                  <h2 className="modalHeading">Modal Heading</h2>
                  <p className="modalText">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged.
                  </p>
                  <hr />
                  <p className="modalText">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged.
                  </p>
                </div>
              </div>
            </Modal>
          )}
          <div className="new-header">
            <style
              dangerouslySetInnerHTML={{
                __html: ` .container { padding-top: 60px; } `,
              }}
            />
            <div className="header-left">
              <NavLink
                className="plg-logo display-inline"
                to="/dashboard?icon=true"
              >
                <img src={`${webConfig.siteURL}/assets/graphics/logo.png`} />
              </NavLink>
              <span
                className="header-mobile header-navigation-links color-green fas fa-bars"
                style={{
                  padding: 20,
                  cursor: "pointer",
                  color: "#27c686",
                  fontSize: 20,
                }}
                onClick={() => this.toggleSideBar()}
              />
              <div className="display-inline">
                {/* TODO :: /niche/cod to /freeviral-products */}
                <NavLink
                  className="header-navigation-links display-inline"
                  activeClassName="header-active"
                  onClick={() => {
                    this.toggleStartModal();
                  }}
                  to="#"
                  style={{ position: "relative" }}
                >
                  {/* <span
                    className="fas fa-filter"
                    style={{ lineHeight: "2.4rem", marginRight: "4px" }}
                  /> */}
                  <span
                    className="hide-label"
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "0.875em",
                      fontFamily: "'Questrial', sans-serif",
                    }}
                  >
                    {/* Cash On Delivery */}
                    Start Here
                  </span>
                </NavLink>
                <NavLink
                  className="header-navigation-links display-inline"
                  activeClassName="header-active"
                  to="/collection/dropshipping"
                  style={{ position: "relative" }}
                >
                  <span
                    className="fas fa-filter"
                    style={{ lineHeight: "2.4rem", marginRight: "4px" }}
                  />
                  <span
                    className="hide-label"
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "0.875em",
                      fontFamily: "'Questrial', sans-serif",
                    }}
                  >
                    {/* Cash On Delivery */}
                    Dropshipping
                    <span
                      style={{
                        position: "absolute",
                        left: "20%",
                        bottom: 3,
                        fontSize: "0.9em",
                        color: "#f28706",
                      }}
                    >
                      Recommended
                    </span>
                  </span>
                </NavLink>
                <NavLink
                  className="header-navigation-links display-inline"
                  activeClassName="header-active"
                  to="/collection/cod"
                  style={{ position: "relative" }}
                >
                  <span
                    className="fas fa-shipping-fast"
                    style={{ lineHeight: "2.4rem", marginRight: "4px" }}
                  />
                  <span
                    className="hide-label"
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "0.875em",
                      fontFamily: "'Questrial', sans-serif",
                    }}
                  >
                    {/* Cash On Delivery */}
                    COD Products
                    <span
                      style={{
                        position: "absolute",
                        left: "20%",
                        bottom: 3,
                        fontSize: "0.9em",
                        color: "#f28706",
                      }}
                    >
                      Cash On Delivery
                    </span>
                    {/* <span style={{ position: 'absolute', left: '20%', bottom: 3, fontSize: '0.9em', color: '#f28706' }}>Recommended</span> */}
                  </span>
                </NavLink>
                {/* Removed the restrictions from level 2 to anyone can access */}
                {/* <NavLink
                  className="header-navigation-links display-inline"
                  activeClassName="header-active"
                  onClick={() => {
                    this.toggleCreateModal();
                  }}
                  to="#"
                  style={{ position: "relative" }}
                >
                  <span
                    className="fas fa-store"
                    style={{ lineHeight: "2.4rem", marginRight: "4px" }}
                  />
                  <span
                    className="hide-label"
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "0.875em",
                      fontFamily: "'Questrial', sans-serif",
                    }}
                  >
                    Sourcing Request
                    <span
                      style={{
                        position: "absolute",
                        left: "20%",
                        bottom: 3,
                        fontSize: "0.9em",
                        color: "#f28706",
                      }}
                    >
                      Sell Anything you Like
                    </span>
                  </span>
                </NavLink> */}
                {/* TODO :: /niche/cod to /freeviral-products */}
                <NavLink
                  className="header-navigation-links display-inline"
                  activeClassName="header-active"
                  to="/plg-pro-services"
                  style={{ position: "relative" }}
                >
                  <span
                    className="fas fa-filter"
                    style={{ lineHeight: "2.4rem", marginRight: "4px" }}
                  />
                  <span
                    className="hide-label"
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "0.875em",
                      fontFamily: "'Questrial', sans-serif",
                    }}
                  >
                    {/* Cash On Delivery */}
                    PLG Pro Services
                  </span>
                </NavLink>
                <a
                  className="header-navigation-links display-inline"
                  href="https://t.me/+TxJbl8V72TyhnWym"
                  target="_blank"
                >
                  <span
                    className="fab fa-telegram-plane"
                    style={{
                      lineHeight: "2.4rem",
                      fontSize: "2rem",
                      marginRight: "4px",
                    }}
                  />{" "}
                  <span
                    className="hide-label"
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "0.875em",
                      fontFamily: "'Questrial', sans-serif",
                    }}
                  >
                    Join Support Group
                  </span>
                </a>

                {/* https://themm.kartra.com/page/a8C144 */}
                {/* {(currentUser.privilege == 1 || currentUser.privilege == 2) && !currentUser.kartra_tags.includes("Publish_All") ? // User Privilege
                                    <a className="upgrade display-inline heartbeat" style={{ width: 'fit-content', backgroundColor: 'yellow', borderRadius: 30, fontWeight: 'bold', padding: 10, color: '#484f57' }} href={points.plgUpsellLink(currentUser.privilege)} target="_blank"> 
                                        <span className="fas fa-angle-double-up" style={{ lineHeight: '2.4rem', marginRight: 4 }} /> <label className="hide-label cursor-pointer" style={{ margin: '0 auto' }}>Update to Pro Features</label>
                                    </a>
                                    : void 0} */}
                {/* https://themm.kartra.com/page/brandables-pack */}
                {/* {currentUser.privilege == 3 && !currentUser.kartra_tags.includes("Publish_All") ? // User Privilege
                                    <a className="upgrade display-inline" style={{ minWidth: 'fit-content', backgroundColor: 'yellow', borderRadius: 30, fontWeight: 'bold', padding: 10, color: '#484f57', whiteSpace: 'nowrap' }} href={points.plgUpsellLink(currentUser.privilege)} target="_blank">  
                                        <span className="fas fa-angle-double-up" style={{ lineHeight: '2.4rem', marginRight: 4 }} /> <label className="hide-label cursor-pointer" style={{ margin: '0 auto' }}>Get Traffic and Conversion Training</label>
                                    </a>
                                    : void 0} */}
              </div>
            </div>
            <div className="header-right">
              {/* Notification */}
              <Mutation
                mutation={READ_ALL_NOTIFICATION}
                variables={{ id: this.props.session.getCurrentUser.id }}
              >
                {(readAllNotification, { data, loading, error }) => {
                  return (
                    <Popup
                      trigger={
                        <div className="hide-in-mobile header-navigation">
                          <div className="notif">
                            <span className="fas fa-bell" />
                            <Query
                              query={GET_MESSAGES_COUNT}
                              variables={{ user_id: currentUser.id, is_admin }}
                              notifyOnNetworkStatusChange
                            >
                              {({ data, loading, refetch, error }) => {
                                this.refetch_unread_count = refetch;
                                let notifCount = reversed_notification.filter(
                                  (el) => !el.isRead
                                ).length;
                                if (!loading && !error && data.getMessageCount)
                                  notifCount +=
                                    data.getMessageCount.unread_count;
                                if (notifCount)
                                  return (
                                    <span className="notification-count">
                                      {notifCount}
                                    </span>
                                  );
                                else return null;
                              }}
                            </Query>
                          </div>
                        </div>
                      }
                      className="points-tooltip profile-nav-popup"
                      position="bottom right"
                      onOpen={() => this.notificationSubscription()}
                      onClose={() =>
                        this.readAllNotification(readAllNotification)
                      }
                      contentStyle={{
                        background: "#f4f9fd",
                        padding: "10px 0",
                        border: "none",
                        minWidth: 350,
                      }}
                      arrow={false}
                      on="click"
                    >
                      <div>
                        <div className="column column_12_12 row-separator">
                          <div
                            className="column column_6_12 display-inline text-left row-separator"
                            style={{ padding: 0 }}
                          >
                            <label className="font-roboto-bold">Messages</label>
                            {/* <span className="badge" style={{ position: 'relative', top: 0, borderRadius: '20px', fontSize: 10, marginLeft: 10 }}>Beta</span> */}
                          </div>
                          <div
                            className="column column_6_12 text-right row-separator"
                            style={{ padding: 0 }}
                          >
                            <label
                              className="font-roboto-bold color-green cursor-pointer"
                              onClick={() =>
                                this.setState({
                                  is_messages_open: true,
                                  selected_user: null,
                                })
                              }
                            >
                              View All Message
                            </label>
                          </div>
                          <span className="clear" />
                          <div
                            className="conversation text-left"
                            style={{ padding: 0 }}
                          >
                            <Query
                              query={GET_MESSAGES(
                                `{ id user_id name picture unread_count privilege last_message last_message_date }`
                              )}
                              variables={{
                                user_id: currentUser.id,
                                unread: true,
                                view_list: true,
                                is_admin,
                                limit: 5,
                              }}
                              notifyOnNetworkStatusChange
                            >
                              {({ data, loading, refetch, error }) => {
                                this.refetch_messages = refetch;
                                if (loading)
                                  return (
                                    <Notif loading={{ width: 50, heiht: 50 }} />
                                  );
                                else if (error)
                                  return (
                                    <Notif
                                      message={`<div class="text-center"><label>An error has occurred please try again</label></div>`}
                                      noResult={true}
                                    />
                                  );
                                else if (data.getMessages.length === 0)
                                  return (
                                    <Notif
                                      message={`<div class="text-center"><label>No new message found</label></div>`}
                                      noResult={true}
                                    />
                                  );
                                return data.getMessages.map((message, i) => {
                                  let img_url = message.picture
                                    ? "/user-uploads/" + message.picture
                                    : "/assets/graphics/abstract_patterns/texture.jpg";
                                  return (
                                    <div
                                      className="product-card display-inline"
                                      onClick={() => {
                                        this.closeNotification();
                                        this.setState({
                                          is_messages_open: true,
                                          selected_user: {
                                            id: message.id,
                                            user_id: message.user_id,
                                            user_name: message.name,
                                          },
                                        });
                                      }}
                                      style={{ margin: "5px 0px" }}
                                      key={i}
                                    >
                                      <div style={{ position: "relative" }}>
                                        <img
                                          className="img-profile"
                                          src={img_url}
                                        />
                                        {is_admin && (
                                          <span
                                            className="notification-count color-white"
                                            style={{
                                              position: "absolute",
                                              top: "unset",
                                              left: "unset",
                                              bottom: 2,
                                              right: -5,
                                              backgroundColor: "#1ac594",
                                            }}
                                          >
                                            {message.privilege}
                                          </span>
                                        )}
                                      </div>
                                      <div className="user-info one-line-ellipsis">
                                        <label className="header-medium-bold cursor-pointer one-line-ellipsis">
                                          {points.capitalizeWord(message.name)}
                                        </label>
                                        <label className="cursor-pointer">
                                          {message.last_message}
                                        </label>
                                      </div>
                                      <div className="font-small text-right">
                                        <label className="time-ago">
                                          {moment(
                                            parseInt(message.last_message_date)
                                          )
                                            .startOf("second")
                                            .fromNow()}
                                        </label>
                                        {message.unread_count ? (
                                          <label className="color-white badge-error">
                                            {message.unread_count}
                                          </label>
                                        ) : (
                                          <label>&nbsp;</label>
                                        )}
                                      </div>
                                    </div>
                                  );
                                });
                              }}
                            </Query>
                          </div>
                        </div>
                        <div className="column column_12_12">
                          <div
                            className="column column_6_12 text-left row-separator"
                            style={{ padding: 0 }}
                          >
                            <label className="font-roboto-bold">
                              Notification
                            </label>
                          </div>
                          <span className="clear" />
                          <div
                            className="text-center"
                            style={{ overflow: "auto", maxHeight: "60vh" }}
                          >
                            {(() => {
                              if (reversed_notification.length != 0) {
                                return reversed_notification.map(
                                  (notif, index) => {
                                    notif.message = notif.message
                                      ? notif.message
                                      : "";
                                    return (
                                      <Notif
                                        userId={
                                          this.props.session.getCurrentUser.id
                                        }
                                        isRead={notif.isRead}
                                        notifId={notif.id}
                                        type={notif.type}
                                        message={notif.message
                                          .replace(
                                            "[FirstName]",
                                            this.props.session.getCurrentUser
                                              .firstName
                                          )
                                          .replace(
                                            "[LastName]",
                                            this.props.session.getCurrentUser
                                              .lastName
                                          )}
                                        refetch={this.props.refetch}
                                        key={index}
                                      />
                                    );
                                  }
                                );
                              } else {
                                return (
                                  <Notif
                                    message={`<div class="text-center"><label>No new notification.</label></div>`}
                                    noResult={true}
                                  />
                                );
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                    </Popup>
                  );
                }}
              </Mutation>
              {/* End Notification */}
              <Popup
                trigger={
                  <div
                    className="wrap header-navigation display-inline"
                    style={{ marginLeft: 5, height: "100%" }}
                  >
                    {!this.props.session.getCurrentUser.profileImage && (
                      <div
                        className="profile_img"
                        style={{
                          backgroundImage:
                            "url(" +
                            webConfig.siteURL +
                            "/assets/graphics/abstract_patterns/texture.jpg" +
                            ")",
                          position: "relative",
                        }}
                      />
                    )}
                    {this.props.session.getCurrentUser.profileImage && (
                      <div
                        className="profile_img"
                        style={{
                          backgroundImage:
                            "url(" +
                            webConfig.siteURL +
                            "/user-uploads/" +
                            this.props.session.getCurrentUser.profileImage +
                            ")",
                          position: "relative",
                        }}
                      />
                    )}
                    <div className="header-mobile">
                      <span
                        className="capitalize"
                        style={{ fontSize: "0.877em" }}
                      >
                        {this.props.session.getCurrentUser.firstName.toLowerCase()}{" "}
                        {this.props.session.getCurrentUser.lastName.toLowerCase()}
                      </span>{" "}
                      <br />
                      <span
                        className="capitalize"
                        style={{ fontSize: "0.800em" }}
                      >
                        {/* <strong className="color-orange float-left"><span className="fas fa-coins" style={{ marginRight: 5 }} />{points.kFormatter(this.props.session.getCurrentUser.total_points)} Points</strong> */}
                      </span>
                    </div>
                    <div className="caption">
                      <span
                        className="fas fa-angle-down"
                        style={{ marginLeft: 10 }}
                      />
                    </div>
                  </div>
                }
                position="bottom right"
                on="click"
                className="points-tooltip profile-nav-popup"
                arrow={false}
                contentStyle={{
                  background: "#f4f9fd",
                  padding: 0,
                  border: "none",
                  maxWidth: 300,
                }}
              >
                <div className="funnel" style={{ textAlign: "left" }}>
                  <ul
                    className="profile-nav"
                    style={{
                      overflow: "auto",
                      maxHeight: "calc(100vh - 100px)",
                    }}
                  >
                    <div
                      className="notif stretch-width"
                      style={{ borderRadius: 0, padding: 15 }}
                    >
                      <div className="row-separator display-inline">
                        {!this.props.session.getCurrentUser.profileImage && (
                          <div
                            className="profile_img"
                            style={{
                              backgroundImage:
                                "url(" +
                                webConfig.siteURL +
                                "/assets/graphics/abstract_patterns/texture.jpg" +
                                ")",
                              width: 50,
                              height: 50,
                            }}
                          ></div>
                        )}
                        {this.props.session.getCurrentUser.profileImage && (
                          <div
                            className="profile_img"
                            style={{
                              backgroundImage:
                                "url(" +
                                webConfig.siteURL +
                                "/user-uploads/" +
                                this.props.session.getCurrentUser.profileImage +
                                ")",
                              width: 50,
                              height: 50,
                            }}
                          ></div>
                        )}
                        <div>
                          <span className="capitalize">
                            {this.props.session.getCurrentUser.firstName.toLowerCase()}{" "}
                            {this.props.session.getCurrentUser.lastName.toLowerCase()}
                            <br />
                            {/* <strong className="color-orange float-left"><span className="fas fa-coins" style={{ marginRight: 5 }} />{points.kFormatter(this.props.session.getCurrentUser.total_points)} Points</strong> */}
                          </span>
                        </div>
                      </div>
                      <div className="flex-container">
                        {currentUser.privilege == 3 &&
                        !currentUser.kartra_tags.includes("Publish_All") ? ( // User Privilege
                          <button
                            className="btn-success"
                            style={{ width: "48%" }}
                            onClick={() =>
                              window.open(
                                points.plgUpsellLink(currentUser.privilege)
                              )
                            }
                          >
                            {" "}
                            {/* https://themm.kartra.com/page/brandables-pack */}
                            <label className="cursor-pointer">
                              Upgrade Pro
                            </label>
                          </button>
                        ) : (
                          void 0
                        )}
                        <NavLink
                          to="/signout"
                          onClick={() => this.closeProfile()}
                          style={{ width: "48%", borderRadius: 3 }}
                          className="btn-warning display-inline"
                        >
                          <label
                            className="cursor-pointer"
                            style={{ margin: "0 auto" }}
                          >
                            Logout
                          </label>
                        </NavLink>
                      </div>
                    </div>
                    <div className="header-dropdown-menu-divider">
                      <label className="header-medium-bold">
                        Manage Profile
                      </label>
                    </div>
                    <div className="header-clickable-container">
                      <NavLink
                        to="/manage-subscription"
                        onClick={() => this.closeProfile()}
                      >
                        <li>Manage Subscription</li>
                      </NavLink>
                      <NavLink
                        to={`/profile/${this.props.session.getCurrentUser.id}`}
                        onClick={() => this.closeProfile()}
                      >
                        <li>View Profile</li>
                      </NavLink>
                      <NavLink
                        to="/edit-profile"
                        onClick={() => this.closeProfile()}
                      >
                        <li>Edit Profile</li>
                      </NavLink>
                      <NavLink
                        to="/account"
                        onClick={() => this.closeProfile()}
                      >
                        <li>Change Password</li>
                      </NavLink>
                      {/* Remove Inteegration for level 0 */}
                      {this.props.session.getCurrentUser.privilege == 0 ? (
                        <span />
                      ) : (
                        <NavLink
                          to="/integrations"
                          onClick={() => this.closeProfile()}
                        >
                          <li>Integrations</li>
                        </NavLink>
                      )}
                    </div>
                    <div className="header-dropdown-menu-divider">
                      <label className="header-medium-bold">
                        Free Viral Page
                      </label>
                    </div>
                    <div className="header-clickable-container">
                      <NavLink
                        to="/freeviral-products"
                        onClick={() => this.closeProfile()}
                      >
                        <li>Free Viral Products</li>
                      </NavLink>
                    </div>
                    <div className="header-dropdown-menu-divider">
                      <label className="header-medium-bold">Activity</label>
                    </div>
                    <div className="header-clickable-container">
                      <NavLink
                        to="/myfavorites"
                        onClick={() => this.closeProfile()}
                      >
                        <li>My Favorites</li>
                      </NavLink>
                    </div>
                    {/*  for sales user */}
                    {this.props.session.getCurrentUser.privilege == 5 && ( // User Privilege
                      <div>
                        <div className="header-dropdown-menu-divider">
                          <label className="header-medium-bold">
                            Affiliate Manager
                          </label>
                        </div>
                        <div className="header-clickable-container">
                          <NavLink
                            to="/sales-representative"
                            onClick={() => this.closeProfile()}
                          >
                            <li>Affiliate Users</li>
                          </NavLink>
                        </div>
                      </div>
                    )}
                    {/* for admin */}
                    {this.props.session.getCurrentUser.privilege >= 6 && ( // User Privilege
                      <div>
                        <div className="header-dropdown-menu-divider">
                          <label className="header-medium-bold">
                            Manage Admin
                          </label>
                        </div>
                        {this.props.session.getCurrentUser.privilege == 6 && ( // User Privilege
                          <div className="header-clickable-container">
                            <NavLink
                              to="/admin"
                              onClick={() => this.closeProfile()}
                            >
                              <li>User List</li>
                            </NavLink>
                          </div>
                        )}
                        {this.props.session.getCurrentUser.privilege == 10 && ( // User Privilege
                          <div className="header-clickable-container">
                            <NavLink
                              to="/admin"
                              onClick={() => this.closeProfile()}
                            >
                              <li>User List</li>
                            </NavLink>
                            <NavLink
                              to="/admin-settings"
                              onClick={() => this.closeProfile()}
                            >
                              <li>Manage Pages</li>
                            </NavLink>
                            <NavLink
                              to="/admin-create-notification"
                              onClick={() => this.closeProfile()}
                            >
                              <li>Create Notification</li>
                            </NavLink>
                            <NavLink
                              to="/admin-all-referrer"
                              onClick={() => this.closeProfile()}
                            >
                              <li>View All Referrer</li>
                            </NavLink>
                            <NavLink
                              to="/admin-mystery-product"
                              onClick={() => this.closeProfile()}
                            >
                              <li>Mystery Product</li>
                            </NavLink>
                            {/* <NavLink to="/admin-fulfillment-center-genie" onClick={() => this.closeProfile()}>
                                                            <li>Fulfillment Genie Team</li>
                                                        </NavLink> */}
                            {/* <NavLink to="/admin-fulfillment-center-genieV2" onClick={() => this.closeProfile()}>
                                                            <li>Fulfillment Genie Team V2</li>
                                                        </NavLink> */}
                            {/* <NavLink to="/admin-fulfillment-refund" onClick={() => this.closeProfile()}>
                                                            <li>Fulfillment Credit Refund</li>
                                                        </NavLink> */}
                            <NavLink
                              to="/admin-page-ranking"
                              onClick={() => this.closeProfile()}
                            >
                              <li>Ranking Pages</li>
                            </NavLink>
                            <NavLink
                              to="/admin-product-metafields"
                              onClick={() => this.closeProfile()}
                            >
                              <li>Product Metafields</li>
                            </NavLink>
                            <NavLink
                              to="/admin-cod-statistics"
                              onClick={() => this.closeProfile()}
                            >
                              <li>COD Statistics</li>
                            </NavLink>
                            <NavLink
                              to="/admin-manage-fg-cod-orders"
                              onClick={() => this.closeProfile()}
                            >
                              <li>Manage FG COD Orders</li>
                            </NavLink>
                            <NavLink
                              to="/admin-manage-cod-payouts"
                              onClick={() => this.closeProfile()}
                            >
                              <li>Manage COD Payouts</li>
                            </NavLink>
                          </div>
                        )}
                      </div>
                    )}
                    {this.props.session.getCurrentUser.access_tags.includes(
                      "fulfiller"
                    ) || this.props.session.getCurrentUser.privilege == 10 ? ( // User Privilege
                      <div className="header-clickable-container">
                        <NavLink
                          to="/admin-manage-cod-products"
                          onClick={() => this.closeProfile()}
                        >
                          <li>Manage COD Products</li>
                        </NavLink>
                      </div>
                    ) : (
                      void 0
                    )}
                  </ul>
                </div>
              </Popup>
            </div>
          </div>
          {this.state.is_messages_open && (
            <Modal
              open={this.state.is_messages_open}
              closeModal={() => this.setState({ is_messages_open: false })}
              style={{
                borderTop: "5px solid #23c78a",
                borderRadius: 10,
                padding: 0,
                width: "80%",
              }}
            >
              <div>
                <style
                  dangerouslySetInnerHTML={{
                    __html: `.popup-content .content {padding: 0px;}`,
                  }}
                />
                <div className="modal-header">
                  <h4 className="header">Messages</h4>
                </div>
                <Messages
                  selected={this.state.selected_user}
                  refetchNotificationCount={() => this.refetchNotification()}
                  session={this.props.session}
                />
              </div>
            </Modal>
          )}
        </div>
      );
    }
    return (
      <header>
        {(() => {
          if (this.state.shouldUpsell) {
            return (
              <UpsellAlert
                open={this.state.shouldUpsell}
                closeModal={this.toggleUpsell}
                session={this.props.session}
              />
            );
          } else {
            return null;
          }
        })()}

        {this.props.session.getCurrentUser != null && (
          <div className="header-navigation">
            {/* <NavLink className="header-navigation-links" activeClassName="header-active" to="/myfavorites">
                            My Favorites
                        </NavLink> */}
            <NavLink
              className="header-navigation-links"
              activeClassName="header-active"
              to="/collection/winners"
            >
              <span
                className="fas fa-fire"
                style={{ lineHeight: "2.4rem", marginRight: "4px" }}
              ></span>{" "}
              <span style={{ whiteSpace: "nowrap" }}>Hot Products</span>
            </NavLink>
            {/* <NavLink className="header-navigation-links" activeClassName="header-active" to="/collection/cpa-offers">
                            CPA Offers
                        </NavLink> */}
            <NavLink
              className="header-navigation-links"
              activeClassName="header-active"
              to="/collection/brandable"
            >
              Brandable
            </NavLink>
            <a
              className="header-navigation-links"
              href="https://productlistgenie.com/programs/?fbclid=IwAR2EQAJTWqs_TozKkcJGqypYGjeQcNkyiMdNnCl1uE9ljAiPsrXmWDJi_Zw"
              target="_blank"
            >
              Upgrade
            </a>
            {/* <NavLink className="header-navigation-links" activeClassName="header-active" to="/collection/us-warehouse">
                            US Warehouse
                        </NavLink> */}
            {/* onClick={() => {window.open('https://themm.kartra.com/page/waP72','_blank')}}> */}
            {this.props.session.getCurrentUser.privilege != 0 && ( // User Privilege
              // <NavLink className="wth" to="/want-help">
              <a
                href="https://www.facebook.com/groups/917176848452140/"
                target="_blank"
                className="wth"
              >
                I Need Help
                <i className="far fa-arrow-alt-circle-right wthi"></i>
              </a>
            )}
          </div>
        )}

        {this.props.session.getCurrentUser != null && (
          <div className="your_account">
            <Popup
              trigger={
                <div className="wrap">
                  {!this.props.session.getCurrentUser.profileImage && (
                    <div
                      className="profile_img"
                      style={{
                        backgroundImage:
                          "url(" +
                          webConfig.siteURL +
                          "/assets/graphics/abstract_patterns/texture.jpg" +
                          ")",
                      }}
                    ></div>
                  )}
                  {this.props.session.getCurrentUser.profileImage && (
                    <div
                      className="profile_img"
                      style={{
                        backgroundImage:
                          "url(" +
                          webConfig.siteURL +
                          "/user-uploads/" +
                          this.props.session.getCurrentUser.profileImage +
                          ")",
                      }}
                    ></div>
                  )}
                  <div className="caption">
                    <span className="capitalize">
                      {this.props.session.getCurrentUser.firstName.toLowerCase()}{" "}
                      {this.props.session.getCurrentUser.lastName.toLowerCase()}
                      <br />
                      <strong>
                        <div className="fas fa-coins"></div>{" "}
                        {points.kFormatter(
                          this.props.session.getCurrentUser.total_points
                        )}{" "}
                        pts
                      </strong>
                    </span>
                  </div>
                </div>
              }
              position="bottom right"
              on="click"
              className="points-tooltip profile-nav-popup"
            >
              <div style={{ textAlign: "left" }}>
                <ul className="profile-nav">
                  <NavLink
                    to={`/profile/${this.props.session.getCurrentUser.id}`}
                    onClick={() => this.closeProfile()}
                  >
                    <li>
                      <div className="profile-nav-container">
                        <i className="fas fa-coins"></i>
                        <div className="profile-nav-text">
                          Points:{" "}
                          {points.kFormatter(
                            this.props.session.getCurrentUser.total_points
                          )}
                          <br />
                          <span style={{ fontWeight: 100, fontSize: 13 }}>
                            What's This?
                          </span>
                        </div>
                      </div>
                    </li>
                  </NavLink>
                  <NavLink
                    to="/myfavorites"
                    onClick={() => this.closeProfile()}
                  >
                    <li>
                      <div className="profile-nav-container">
                        <i className="fas fa-heart"></i>
                        <div className="profile-nav-text">My Favorites</div>
                      </div>
                    </li>
                  </NavLink>
                  <NavLink
                    to={`/profile/${this.props.session.getCurrentUser.id}`}
                    onClick={() => this.closeProfile()}
                  >
                    <li>
                      <div className="profile-nav-container">
                        <i className="fas fa-user-circle"></i>
                        <div className="profile-nav-text">View Profile</div>
                      </div>
                    </li>
                  </NavLink>
                  <NavLink
                    to="/share-invitation-link"
                    onClick={() => this.closeProfile()}
                  >
                    <li>
                      <div className="profile-nav-container">
                        <i className="fas fa-share-alt"></i>
                        <div className="profile-nav-text">Referrals</div>
                      </div>
                    </li>
                  </NavLink>
                  <NavLink
                    to="/edit-profile"
                    onClick={() => this.closeProfile()}
                  >
                    <li>
                      <div className="profile-nav-container">
                        <i className="fas fa-user-cog"></i>
                        <div className="profile-nav-text">Edit Profile</div>
                      </div>
                    </li>
                  </NavLink>
                  <NavLink to="/account" onClick={() => this.closeProfile()}>
                    <li>
                      <div className="profile-nav-container">
                        <i className="fas fa-user-circle"></i>
                        <div className="profile-nav-text">Update Password</div>
                      </div>
                    </li>
                  </NavLink>
                  <NavLink
                    to="/manage-subscription"
                    onClick={() => this.closeProfile()}
                  >
                    <li>
                      <div className="profile-nav-container">
                        <i className="fas fa-calendar"></i>
                        <div className="profile-nav-text">
                          Manage Subscription
                        </div>
                      </div>
                    </li>
                  </NavLink>
                  {/*  for sales user */}
                  {this.props.session.getCurrentUser.privilege == 5 && ( // User Privilege
                    <NavLink
                      to="/sales-representative"
                      onClick={() => this.closeProfile()}
                    >
                      <li>
                        <div className="profile-nav-container">
                          <i className="fas fa-cog"></i>
                          <div className="profile-nav-text">Sales Rep</div>
                        </div>
                      </li>
                    </NavLink>
                  )}
                  {this.props.session.getCurrentUser.privilege == 10 && ( // User Privilege
                    <NavLink to="/admin" onClick={() => this.closeProfile()}>
                      <li>
                        <div className="profile-nav-container">
                          <i className="fas fa-cog"></i>
                          <div className="profile-nav-text">Admin Page</div>
                        </div>
                      </li>
                    </NavLink>
                  )}
                  {this.props.session.getCurrentUser.privilege == 10 && ( // User Privilege
                    <NavLink
                      to="/admin-settings"
                      onClick={() => this.closeProfile()}
                    >
                      <li>
                        <div className="profile-nav-container">
                          <i className="fas fa-cog"></i>
                          <div className="profile-nav-text">
                            Admin Page Settings
                          </div>
                        </div>
                      </li>
                    </NavLink>
                  )}
                  {this.props.session.getCurrentUser.privilege == 10 && ( // User Privilege
                    <NavLink
                      to="/admin-all-referrer"
                      onClick={() => this.closeProfile()}
                    >
                      <li>
                        <div className="profile-nav-container">
                          <i className="fas fa-user"></i>
                          <div className="profile-nav-text">
                            View All Referrer
                          </div>
                        </div>
                      </li>
                    </NavLink>
                  )}
                  {this.props.session.getCurrentUser.privilege == 10 && ( // User Privilege
                    <NavLink
                      to="/admin-create-notification"
                      onClick={() => this.closeProfile()}
                    >
                      <li>
                        <div className="profile-nav-container">
                          <i className="fas fa-comments"></i>
                          <div className="profile-nav-text">
                            Create Notification
                          </div>
                        </div>
                      </li>
                    </NavLink>
                  )}
                  {this.props.session.getCurrentUser.privilege == 10 && ( // User Privilege
                    <NavLink
                      to="/admin-mystery-product"
                      onClick={() => this.closeProfile()}
                    >
                      <li>
                        <div className="profile-nav-container">
                          <i className="fas fa-gift"></i>
                          <div className="profile-nav-text">
                            Mystery Product
                          </div>
                        </div>
                      </li>
                    </NavLink>
                  )}
                  {this.props.session.getCurrentUser.privilege == 10 && ( // User Privilege
                    <NavLink
                      to="/admin-fulfillment-center-genie"
                      onClick={() => this.closeProfile()}
                    >
                      <li>
                        <div className="profile-nav-container">
                          <i className="fas fa-shipping-fast"></i>
                          <div className="profile-nav-text">
                            Fulfillment Genie Team
                          </div>
                        </div>
                      </li>
                    </NavLink>
                  )}
                  {this.props.session.getCurrentUser.privilege == 10 && ( // User Privilege
                    <NavLink
                      to="/admin-fulfillment-center-genieV2"
                      onClick={() => this.closeProfile()}
                    >
                      <li>
                        <div className="profile-nav-container">
                          <i className="fas fa-shipping-fast"></i>
                          <div className="profile-nav-text">
                            Fulfillment Genie Team V2
                          </div>
                        </div>
                      </li>
                    </NavLink>
                  )}
                  {this.props.session.getCurrentUser.privilege == 10 && ( // User Privilege
                    <NavLink
                      to="/admin-fulfillment-refund"
                      onClick={() => this.closeProfile()}
                    >
                      <li>
                        <div className="profile-nav-container">
                          <i className="fas fa-hand-holding-usd"></i>
                          <div className="profile-nav-text">
                            Fulfillment Credit Refund
                          </div>
                        </div>
                      </li>
                    </NavLink>
                  )}
                  <NavLink
                    to="/integrations"
                    onClick={() => this.closeProfile()}
                  >
                    <li>
                      <div className="profile-nav-container">
                        <i>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="15px"
                            width="15px"
                            fill="#008005"
                            viewBox="0 0 48 48"
                            x="0px"
                            y="0px"
                          >
                            <path d="M21.8,37.51,10.49,26.2l-.71-.71a1,1,0,1,0-1.41,1.41h0L4.83,30.44a5,5,0,0,0,0,7.07l.71.71L3.41,40.34a1,1,0,0,0,0,1.41l.71.71L2,44.59A1,1,0,1,0,3.41,46l2.12-2.12.71.71a1,1,0,0,0,1.41,0l2.12-2.12.71.71a5,5,0,0,0,7.07,0l3.54-3.54h0a1,1,0,1,0,1.41-1.41Z"></path>
                            <path d="M20.74,21.6a1.5,1.5,0,0,0-2.12-2.12l-6,6,2.12,2.12Z"></path>
                            <path d="M26.4,27.26l-6,6,2.12,2.12,6-6a1.5,1.5,0,0,0-2.12-2.12Z"></path>
                            <path d="M46.71,1.29a1,1,0,0,0-1.41,0L40,6.59l-.71-.71a1,1,0,0,0-1.41,0L35.59,8.17l-.71-.71a5,5,0,0,0-7.07,0l-5.31,5.31a1,1,0,0,0-1.41,1.41l.71.71v-.11L33.1,26h0l.71.81a1.06,1.06,0,0,0,.71.35,1,1,0,0,0,.71-.27,1,1,0,0,0,0-1.4h0l5.31-5.31a5,5,0,0,0,0-7.07l-.71-.71,2.29-2.29a1,1,0,0,0,0-1.41L41.41,8l5.29-5.29A1,1,0,0,0,46.71,1.29Z"></path>
                          </svg>
                        </i>
                        <div className="profile-nav-text">Integrations</div>
                      </div>
                    </li>
                  </NavLink>
                  <NavLink to="/signout" onClick={() => this.closeProfile()}>
                    <li>
                      <div className="profile-nav-container">
                        <i className="fas fa-sign-out-alt"></i>
                        <div className="profile-nav-text">Logout</div>
                      </div>
                    </li>
                  </NavLink>
                </ul>
              </div>
            </Popup>
          </div>
        )}

        {this.props.session.getCurrentUser != null && (
          <Query query={GET_ADMIN_SETTINGS}>
            {({ data, loading, refetch }) => {
              if (loading) return null;
              if (data.getAdminSettings && data.getAdminSettings.isLive) {
                // if live
                return (
                  <a
                    href={data.getAdminSettings.liveLink}
                    target="_blank"
                    title="click to watch live"
                  >
                    <div className="live-container">
                      <div className="live-icon"></div>
                      <span className="text">LIVE NOW</span>
                    </div>
                  </a>
                );
              } else {
                // if not live
                return (
                  <a
                    href={data.getAdminSettings.liveLink}
                    target="_blank"
                    title="click to watch replay"
                  >
                    <div className="live-container">
                      <div
                        className="fas fa-play"
                        style={{
                          fontSize: 15,
                          color: "#fff",
                          position: "absolute",
                          left: "-15px",
                        }}
                      ></div>
                      <span className="text" style={{ color: "#fff" }}>
                        Watch Replay
                      </span>
                    </div>
                  </a>
                );
              }
            }}
          </Query>
        )}
      </header>
    );
  }
}

export default withSession(Header);
