import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { Query } from "react-apollo";
import {
  GET_ADMIN_SETTINGS,
  GET_ADMIN_CUSTOM_PAGE_DATA,
  GET_PURCHASE_ORDER,
} from "./../queries";
import Modal from "../components/ModalComponent";
import webConfig from "./../../webConfig";
import withSession from "./../hoc/withSession";
import classNames from "classnames";
import toastr from "toastr";
import ToggleSwitch from "./toggleSwitch";
import CopyPush from "../pages/copyPush";
import ConnectToStore from "../pages/connectToStore";
import PLGThemeLite from "../pages/plgThemeLite";
import AdsSpy from "../pages/adsSpy";
import * as Cookies from "es-cookie";
import UpsellAlert from "../components/ModalComponent/upsellAlert";
import ConnectToCommerceHQ from "../pages/connectToCommerceHQ";
import CopyPushCommerce from "../pages/copyPushCommerceHQ";
const condition = require("../../Global_Conditions");
const points = require("../../Global_Values");
import SelectTag from "./selectTag";

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNavState: true,
      shopifyTools: true,
      commerceHQTools: false,

      createModal: false,

      niches: false,
      seven_day_challenge: false,
      one_time_missions: true,
      trainings: false,
      icheck: false,
      // for commerceHQ
      openCommHQ: false,

      copyPushHQ: false,
      // for update theme
      openUpdate: false,
      doneChecking: false,
      finish: false,
      themeUpdateNotice: [],
      // for copy push modal
      openCopyPush: false,
      // for connect to store modal
      openConnect: false,
      // display new badge
      displayNewBadge: false,
      // for plg theme lite modal
      buy_plg_theme_lite: false,
      // for ads spy modal
      adsSpy: false,
      // for upsell modal
      upsellModal: false,
      // million dollar training upsell
      md_training_upsell: false,
      // upsell link for md
      md_training_upsell_link: "",

      custom_page: [],
      isPopupFCopen: false,
      isMobile: false,
      maintenance: false,
      darkMode: false,
      loginAsAnonymous: false,
    };

    this.toggleCommerceHQ = this.toggleCommerceHQ.bind(this);
    this.toggleCopyPushHQ = this.toggleCopyPushHQ.bind(this);

    // for update theme modal function
    this.toggleUpdateTheme = this.toggleUpdateTheme.bind(this);
    this.closeUpdateTheme = this.closeUpdateTheme.bind(this);
    // for copy push modal function
    this.toggleCopyPush = this.toggleCopyPush.bind(this);
    // for connect to store modal function
    this.toggleConnectModal = this.toggleConnectModal.bind(this);
    // for plg theme lite modal function
    this.buy_plg_theme_lite_button = this.buy_plg_theme_lite_button.bind(this);
    // for ads spy modal function
    this.toggleAdsSpy = this.toggleAdsSpy.bind(this);

    // to modal for days challenge
    this.proceedToLink = this.proceedToLink.bind(this);

    this.md_training_upsell_button_close =
      this.md_training_upsell_button_close.bind(this);
    this.toggleOpenFulfillmentCenter =
      this.toggleOpenFulfillmentCenter.bind(this);
    this.toggleMaintenance = this.toggleMaintenance.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem(points.plg_domain_secret))
      this.setState({ loginAsAnonymous: true });
    // let isDarkMode = JSON.parse(localStorage.getItem("plg_dark_mode"));
    // this.setState({ darkMode: isDarkMode });
    // if (isDarkMode) setTimeout(() => document.body.classList.add("dark-mode"), 1000);
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

    if (window.outerWidth <= 1024) {
      this.setState({
        mobileNavState: false,
        isMobile: true,
      });
    }
    window.addEventListener("resize", () => {
      if (window.outerWidth > 1024) {
        this.setState({
          mobileNavState: true,
          isMobile: false,
        });
      } else {
        this.setState({
          mobileNavState: false,
          isMobile: true,
        });
      }
    });
    if (this.props.session) {
      try {
        !this.props.session.getCurrentUser.access_tags.includes(
          "bypasschecksession"
        ) && this.checkSession();
      } catch (err) {
        console.error(err);
      }
    }
    this.checkNewBadge();

    window.toggleConnectModal = this.toggleConnectModal.bind(this);

    window.toggleCommerceHQ = this.toggleCommerceHQ.bind(this);

    // fetch custom page
    // var payload = {"query":"{\n  getAdminSettings {\n    custom_page {\n      id\n      active\n      navigation_name\n      content {\n        id\n        page_lock_by_tag\n        page_lock_by_privilege\n        page_privilege_from\n        page_privilege_to\n        page_tag\n        page_icon\n        page_name\n        page_content\n      }\n    }\n  }\n}","variables":null,"operationName":null};
    // fetch('/graphql', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(payload)
    // })
    // .then(res => res.json())
    // .then(result => {
    //     var custom_page = result.data.getAdminSettings.custom_page ? result.data.getAdminSettings.custom_page : [];
    //     var custom_page_state_obj = {}
    //     // set dynamic state for navigation use of custom page
    //     custom_page.forEach((data,i) => {
    //         var state_name = data.navigation_name+"_"+i;
    //         state_name = state_name.replace(/\s/g, "_")
    //         custom_page_state_obj[state_name] = false;
    //     })
    //     this.setState({
    //         custom_page: custom_page,
    //         ...custom_page_state_obj
    //     })
    // });
  }

  componentDidUpdate() {
    if (window.innerWidth <= 1023) {
      document
        .querySelectorAll(".open-sidebar, .close-sidebar")
        .forEach((el) => {
          el.classList.remove("open-sidebar", "close-sidebar");
        });
    }
    // apply style to .nav-active parent
    document
      .querySelectorAll(".desktop_nav_toggle.active ul li")
      .forEach((el) => {
        if (el.querySelector(".nav-active")) {
          el.style.cssText = "border-left: 3px solid #56a492;";
        } else {
          el.style.cssText = "";
        }
      });
  }

  // for modals
  toggleCommerceHQ() {
    this.setState({
      openCommHQ: !this.state.openCommHQ,
    });
  }

  toggleCopyPushHQ() {
    this.setState({
      copyPushHQ: !this.state.copyPushHQ,
    });
  }

  toggleCopyPush() {
    this.setState({ openCopyPush: !this.state.openCopyPush });
  }

  toggleConnectModal() {
    this.setState({ openConnect: !this.state.openConnect });
  }

  toggleUpdateTheme() {
    this.setState({ openUpdate: true }, () => {
      if (!this.props.session.getCurrentUser.store_url) {
        this.closeUpdateTheme();
      }
    });
  }

  closeUpdateTheme() {
    this.setState({ openUpdate: false });
  }

  buy_plg_theme_lite_button() {
    this.setState({ buy_plg_theme_lite: !this.state.buy_plg_theme_lite });
  }

  toggleAdsSpy() {
    this.setState({ adsSpy: !this.state.adsSpy });
  }

  seven_day_challenge_button(event) {
    this.animateScroll(this.state.seven_day_challenge, event);

    this.setNewBadgeCookie();
    this.setState({ seven_day_challenge: !this.state.seven_day_challenge });
  }

  one_time_missions_button() {
    this.setState({ one_time_missions: !this.state.one_time_missions });
  }

  trainings_button(event) {
    this.animateScroll(this.state.trainings, event);

    this.setState({ trainings: !this.state.trainings });
  }

  icheck_button(event) {
    this.animateScroll(this.state.icheck, event);

    this.setState({
      icheck: !this.state.icheck,
    });
  }

  custom_page_button(state_name, event) {
    state_name = state_name.replace(/\s/g, "_");
    var stateVal = !this.state[state_name];

    this.animateScroll(this.state[state_name], event);

    this.setState({
      [state_name]: stateVal,
    });
  }

  mobile_nav_button(params) {
    var stateObj = {};
    if (window.outerWidth >= 1024) {
      if (!params) {
        stateObj = {
          openUpdate: false,
          doneChecking: false,
          finish: false,
          themeUpdateNotice: [],
          pathName: window.location.pathname,
        };
      } else {
        stateObj = {
          openUpdate: false,
          doneChecking: false,
          finish: false,
          themeUpdateNotice: [],
          pathName: window.location.pathname,
          mobileNavState: !this.state.mobileNavState,
        };
      }
    } else {
      stateObj = {
        openUpdate: false,
        doneChecking: false,
        finish: false,
        themeUpdateNotice: [],
        pathName: window.location.pathname,
        mobileNavState: !this.state.mobileNavState,
      };
      if (!params) {
        document
          .querySelector(".signbar_nav")
          .classList.toggle("hide-in-mobile");
      }
    }
    this.setState({
      ...stateObj,
    });
  }

  toggleShopifyTools() {
    this.setState({
      shopifyTools: !this.state.shopifyTools,
      commerceHQTools: !this.state.commerceHQTools,
    });
  }
  toggleCommerceHQTools() {
    this.setState({
      commerceHQTools: !this.state.commerceHQTools,
      shopifyTools: !this.state.shopifyTools,
    });
  }

  toggleCreateModal() {
    this.setState({ createModal: !this.state.createModal });
  }
  // for post request
  fetchPOST(url, data, cb) {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((result) => {
        cb(result, this);
      });
  }

  // for theme updater
  updateTheme(update, event) {
    var cb = null;
    if (update) {
      cb = this.updateMessage;
    } else {
      cb = this.doneUpdate;
    }

    var json = {
      check: update,
      domainlink: this.props.session.getCurrentUser.store_url,
      store_token: this.props.session.getCurrentUser.store_token,
    };
    this.fetchPOST(points.apiServer + "/update", JSON.stringify(json), cb);
  }
  updateMessage(msg, self) {
    self.setState({ doneChecking: true });
    self.setState({ themeUpdateNotice: msg }, () => {
      self.toggleUpdateTheme();
    });
  }
  doneUpdate(msg, self) {
    self.setState({ finish: true });
    self.setState({ themeUpdateNotice: msg }, () => {
      self.toggleUpdateTheme();
    });
  }

  // start checking session cookie
  checkSession() {
    if (this.props.session.getCurrentUser != null) {
      if (
        this.props.session.getCurrentUser.user_session_cookie &&
        Cookies.get(points.cookie_name) !==
          this.props.session.getCurrentUser.user_session_cookie
      ) {
        Cookies.remove("token");
        window.location.href = "/signin";
      }
    }
  }
  // end checking session cookie

  // start get time different
  getDateDifferent(day) {
    if (this.props.session.getCurrentUser.privilege > 1) {
      // User Privilege
      return true;
    } else {
      let joinDate = new Date(
        parseInt(this.props.session.getCurrentUser.joinDate)
      );
      let dateNow = new Date();
      let timeDiff = Math.abs(dateNow.getTime() - joinDate.getTime());
      let difference = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (day <= difference) {
        if (day >= 8) {
          if (this.props.session.getCurrentUser.privilege >= 2) {
            // User Privilege
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  }
  // end time different

  // check if it needs to appear the badge
  setNewBadgeCookie() {
    let dateNow = new Date();
    dateNow =
      "PLG:" +
      dateNow.getMonth() +
      "-" +
      dateNow.getDate() +
      "-" +
      dateNow.getUTCFullYear();
    if (!Cookies.get(dateNow)) {
      Cookies.set(dateNow, true, { expires: 1 });
    }
  }
  checkNewBadge() {
    let dateNow = new Date();
    dateNow =
      "PLG:" +
      dateNow.getMonth() +
      "-" +
      dateNow.getDate() +
      "-" +
      dateNow.getUTCFullYear();
    if (Cookies.get(dateNow)) {
      this.setState({ displayNewBadge: false });
    } else {
      this.setState({ displayNewBadge: true });
    }
  }
  // end new badge check

  proceedToLink(days) {
    if (days >= 8) {
      if (this.props.session.getCurrentUser.privilege <= 1) {
        // User Privilege
        if (!this.getDateDifferent(days)) {
          this.setState({ upsellModal: !this.state.upsellModal });
        }
      }
    } else {
      if (!this.getDateDifferent(days)) {
        this.setState({ upsellModal: !this.state.upsellModal });
      }
    }
  }

  md_training_upsell_button(shouldPrompt, upsellLink) {
    if (!shouldPrompt) {
      this.setState({
        md_training_upsell_link: upsellLink,
        md_training_upsell: !this.state.md_training_upsell,
      });
    }
  }

  md_training_upsell_button_close() {
    this.setState({
      md_training_upsell: !this.state.md_training_upsell,
    });
  }

  animateScroll(state, event) {
    var el = null;
    if (state) {
      el = document.querySelector(".sideBar");
    } else {
      el = event.target.nextSibling;
    }
    setTimeout(function () {
      points.smoothScrollInto(el);
    }, 300);
  }

  checkAvailability(data, appearPopup) {
    var userPrivilege = this.props.session.getCurrentUser.privilege;
    var userTags = this.props.session.getCurrentUser.kartra_tags;
    if (userPrivilege == 0) {
      // User Privilege
      if (appearPopup) this.setState({ upsellModal: !this.state.upsellModal });
      return false;
    }
    if (data.page_lock_by_tag && data.page_lock_by_privilege) {
      // if bot present
      if (userPrivilege <= 5) {
        // User Privilege
        if (
          (userTags.includes(data.page_tag) &&
            !data.page_privilege_from >= userPrivilege) ||
          !userPrivilege <= data.page_privilege_to
        ) {
          // console.log("has access");
          return true;
        } else {
          // console.log("no access");
          if (appearPopup)
            this.setState({ upsellModal: !this.state.upsellModal });
          return false;
        }
      } else {
        // console.log("admin to")
        return true;
      }
    } else if (data.page_lock_by_tag) {
      if (userPrivilege <= 5) {
        // User Privilege
        if (userTags.includes(data.page_tag)) {
          // console.log("kartra tag found", data.page_tag, "user has",userTags.toString());
          return true;
        } else {
          // console.log("no required kartra tag", data.page_tag, "user has",userTags.toString());
          if (appearPopup)
            this.setState({ upsellModal: !this.state.upsellModal });
          return false;
        }
      } else {
        // console.log("admin to")
        return true;
      }
    } else if (data.page_lock_by_privilege) {
      if (userPrivilege <= 5) {
        // User Privilege
        // console.log(data.page_privilege_from, userPrivilege, data.page_privilege_to)
        if (
          userPrivilege >= data.page_privilege_from &&
          userPrivilege <= data.page_privilege_to
        ) {
          // console.log("dont have access user privilege is: ", userPrivilege)
          if (appearPopup)
            this.setState({ upsellModal: !this.state.upsellModal });
          return false;
        } else {
          // console.log("have access user privilege is: ", userPrivilege)
          return true;
        }
      } else {
        // console.log("has access", userPrivilege)
        return true;
      }
    } else {
      return true;
    }
  }

  isFulfillmentCenterUnlock() {
    if (false && this.props.session.getCurrentUser) {
      var userPrivilege = this.props.session.getCurrentUser.privilege;
      if (userPrivilege <= 4) {
        var isUnlocked =
          this.props.session.getCurrentUser.isFulfillmentCenterUnlock;
        if (isUnlocked) {
          // has access approved by admin
          return true;
        } else {
          // dont have access open modal
          this.toggleOpenFulfillmentCenter();
          return false;
        }
      } else {
        // give access to lvl 5 above
        return true;
      }
    } else {
      // dont have access open modal
      this.toggleMaintenance();
      return false;
    }
  }

  toggleMaintenance() {
    this.setState({
      maintenance: !this.state.maintenance,
    });
  }

  toggleOpenFulfillmentCenter() {
    this.setState(
      {
        isPopupFCopen: !this.state.isPopupFCopen,
      },
      () => {
        if (this.state.isPopupFCopen && !document.getElementById("manychat")) {
          const script = document.createElement("script");
          script.src = "https://widget.manychat.com/422269714476738.js";
          script.async = true;
          script.id = "manychat";
          document.head.appendChild(script);
        } else {
          location.reload();
        }
      }
    );
  }

  isDevMode() {
    if (
      this.props.session.getCurrentUser &&
      (this.props.session.getCurrentUser.access_tags.includes("dev") ||
        this.props.session.getCurrentUser.privilege == 10)
    ) {
      // User Privilege
      return true;
    } else {
      return false;
    }
  }

  render() {
    const adminStyle = { color: "#d63031" };
    var svgFillColor = "#484f57";
    return (
      <Fragment>
        <div className="funnel">
          {this.state.createModal && (
            <Modal
              open={this.state.createModal}
              closeModal={() => this.toggleCreateModal()}
              session={this.props.session}
              style={{
                width: "60%",
                borderTop: "5px solid #23c78a",
                borderRadius: 10,
                padding: 0,
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
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
                    <h4 className="header">Sell Anything You Want</h4>
                  </div>
                  <br></br>
                  <div
                    className="center-vertical-parent"
                    style={{ marginBottom: "5rem" }}
                  >
                    <div className="column column_12_12">
                      <div className="page-container">
                        <h1
                          style={{
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Sourcing Request
                        </h1>
                        <h4
                          style={{
                            textAlign: "center",
                          }}
                        >
                          Please fill the form bellow with product informations.
                        </h4>
                      </div>
                    </div>
                    <div
                      className="column column_12_12"
                      style={{
                        padding: "0px 9%",
                      }}
                    >
                      <div className="form_input">
                        <label>Full Name </label>
                        <input
                          type="text"
                          name="fullname_form"
                          onChange={(event) => {}}
                          defaultValue={"Full Name"}
                          required
                        />
                        <span className="bottom_border"></span>
                      </div>
                      <br />
                      <div className="form_input">
                        <label>Email </label>
                        <input
                          type="text"
                          name="email_form"
                          onChange={(event) => {}}
                          defaultValue={"someone@email.com"}
                          required
                        />
                        <span className="bottom_border"></span>
                      </div>
                      <br />
                      <div className="form_input">
                        <label>Phone Number </label>
                        <input
                          type="text"
                          name="phone_form"
                          onChange={(event) => {}}
                          defaultValue={"00000000"}
                          required
                        />
                        <span className="bottom_border"></span>
                      </div>
                      <br />
                      <div className="form_input">
                        <label>Product URL or Image </label>
                        <input
                          type="text"
                          name="prodURL_form"
                          onChange={(event) => {}}
                          required
                        />
                        <span className="bottom_border"></span>
                      </div>
                      <br />
                      <div className="form_input">
                        <label>The minimum Quantity is 100 pcs. </label>
                        <input
                          type="number"
                          min={100}
                          name="minimumQty_form"
                          onChange={(event) => {}}
                          required
                        />
                        <span className="bottom_border"></span>
                      </div>
                      <br />
                      <div className="form_input">
                        <textarea
                          rows="8"
                          placeholder="Special Request *"
                          onChange={(event) => {}}
                          className="stretch-width"
                          name="sprequest_form"
                          required
                        ></textarea>
                        <span className="bottom_border"></span>
                      </div>
                      <br />
                      <div className="form_input">
                        <label>Select Country </label>
                        {(() => {
                          var floc = [
                            <option value="ALL" key={0}>
                              All
                            </option>,
                          ];
                          const available_country =
                            points.cod_available_country("no_country");
                          available_country.forEach((country, key) => {
                            floc.push(
                              <option value={country.iso2} key={key + 1}>
                                {country.name}
                              </option>
                            );
                          });
                          return (
                            <SelectTag
                              className="stretch-width"
                              name="select_country"
                              value={this.state.select_country}
                              options={floc}
                              onChange={(event) => {}}
                              style={{ width: "100%", margin: "0 5px" }}
                            />
                          );
                        })()}
                        <span className="bottom_border"></span>
                      </div>
                      <br />
                      <div className="form_input">
                        <label>
                          Would you like to check if this product is available
                          for Saudi Arabia? <br />
                          {/* <small>( Sourcing standard quotes are always for UAE and Oman )</small> */}
                        </label>
                        {(() => {
                          const floc = [];
                          [
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" },
                          ].forEach((opt, key) => {
                            floc.push(
                              <option value={opt.value} key={key + 1}>
                                {opt.label}
                              </option>
                            );
                          });
                          return (
                            <SelectTag
                              className="stretch-width"
                              name="sourcing_standard"
                              value={this.state.sourcing_standard}
                              options={floc}
                              onChange={(event) => {}}
                              style={{ width: "100%", margin: "0 5px" }}
                            />
                          );
                        })()}
                        <span className="bottom_border"></span>
                      </div>
                      <br />
                      <div className="form_input">
                        <label>Did You have tested the product?</label>
                        {(() => {
                          const floc = [];
                          [
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" },
                          ].forEach((opt, key) => {
                            floc.push(
                              <option value={opt.value} key={key + 1}>
                                {opt.label}
                              </option>
                            );
                          });
                          return (
                            <SelectTag
                              className="stretch-width"
                              name="isProdTested"
                              value={this.state.isProdTestedopt}
                              options={floc}
                              onChange={(event) => {}}
                              style={{ width: "100%", margin: "0 5px" }}
                            />
                          );
                        })()}
                        <span className="bottom_border"></span>
                      </div>
                      <br />
                      <button
                        type="submit"
                        className="font-roboto-light btn-success stretch-width"
                      >
                        Request a Qoute
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </Modal>
          )}
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
                    .sideBar {
                        top: unset !important;
                        background: #f4f9fd !important;
                        border-right: 1px solid #e8e8e8;
                    }
                    .sideBar .signbar_nav .headline {
                        background: #f4f9fd !important;
                        font-weight: 700 !important;
                        color: #56a492 !important;
                    }
                    .sideBar .signbar_nav ul li {
                        margin-left: 10px;
                        border-left: 3px solid #a9afb5;
                        width: calc(100% - 10px) !important;
                    }
                    .sideBar .signbar_nav ul li a {
                        margin: 0 !important;
                        color: #484f57 !important;
                    }
                    .sideBar .signbar_nav ul li a:hover {
                        color: #56a492 !important;
                    }
                    .sideBar .signbar_nav ul li .nav-active {
                        color: #56a492 !important;
                    }
                `,
          }}
        />

        <div className="sideBar-dev hide-in-desktop">
          <span
            className="fas fa-bars hamburger-menu"
            onClick={() => {
              this.setState({
                mobileNavState: true,
              });
              document
                .querySelector(".signbar_nav")
                .classList.toggle("hide-in-mobile");
            }}
          />
        </div>

        <nav className="signbar_nav signbar_nav_mobile sideBar-dev hide-in-mobile">
          <div
            className={classNames({
              headline: true,
              desktop_nav_button: true,
              active: this.state.mobileNavState,
            })}
            onClick={() => this.mobile_nav_button(true)}
          >
            Menu
            <div className="float-right">
              <span
                className={
                  this.state.mobileNavState
                    ? "fas fa-angle-down"
                    : "fas fa-angle-right"
                }
                style={{ fontSize: "1.3em" }}
              />
            </div>
          </div>

          <div
            className={classNames({
              desktop_nav_toggle: true,
              active: this.state.mobileNavState,
            })}
          >
            {this.props.session.getCurrentUser === null && (
              <ul>
                <li>
                  <NavLink
                    activeClassName="nav-active"
                    to="/signin"
                    onClick={() => this.mobile_nav_button()}
                  >
                    <i className="fas fa-user"></i>
                    LogIn
                  </NavLink>
                </li>
                {/* <li>
                                    <NavLink activeClassName="nav-active" to="/signup" onClick={() => this.mobile_nav_button()}>
                                        <i className="fas fa-pen-fancy"></i>
                                        Join now</NavLink>
                                </li> */}
                <li>
                  <NavLink
                    activeClassName="nav-active"
                    to="/account-recovery"
                    onClick={() => this.mobile_nav_button()}
                  >
                    <i className="fas fa-key"></i>
                    Account recovery
                  </NavLink>
                </li>
              </ul>
            )}

            {this.props.session.getCurrentUser != null && (
              <div>
                {(this.props.session.getCurrentUser.privilege <= 2 ||
                  this.props.session.getCurrentUser.privilege == 2) &&
                !this.props.session.getCurrentUser.kartra_tags.includes(
                  "Publish_All"
                ) ? ( // User Privilege
                  <a
                    className="upgrade display-inline heartbeat"
                    style={{
                      minWidth: "fit-content",
                      fontSize: "14px",
                      backgroundColor: "#f29115",
                      borderRadius: 30,
                      fontWeight: "bold",
                      marginLeft: "10px",
                      marginBottom: "10px",
                      marginRight: "10px",
                      padding: 10,
                      color: "#fff",
                      whiteSpace: "nowrap",
                    }}
                    href={points.plgUpsellLink(
                      this.props.session.getCurrentUser.privilege
                    )}
                    target="_blank"
                  >
                    {" "}
                    {/* https://themm.kartra.com/page/a8C144 */}
                    <span
                      className="fas fa-angle-double-up"
                      style={{ lineHeight: "2.4rem", marginRight: 4 }}
                    />{" "}
                    <label
                      className="hide-label cursor-pointer"
                      style={{ margin: "0 auto" }}
                    >
                      Update to Pro Features
                    </label>
                  </a>
                ) : (
                  void 0
                )}

                {this.props.session.getCurrentUser.privilege == 3 &&
                !this.props.session.getCurrentUser.kartra_tags.includes(
                  "Publish_All"
                ) ? ( // User Privilege
                  <a
                    className="upgrade display-inline heartbeat"
                    style={{
                      minWidth: "fit-content",
                      fontSize: "12px",
                      backgroundColor: "#f29115",
                      borderRadius: 30,
                      fontWeight: "bold",
                      margin: "10px",
                      padding: 10,
                      color: "#fff",
                      whiteSpace: "nowrap",
                    }}
                    href={points.plgUpsellLink(
                      this.props.session.getCurrentUser.privilege
                    )}
                    target="_blank"
                  >
                    {" "}
                    {/* https://themm.kartra.com/page/brandables-pack */}
                    <span
                      className="fas fa-angle-double-up"
                      style={{ lineHeight: "2.4rem", marginRight: 4 }}
                    />{" "}
                    <label
                      className="hide-label cursor-pointer"
                      style={{ margin: "0 auto" }}
                    >
                      Get Traffic and Conversion Training
                    </label>
                  </a>
                ) : (
                  void 0
                )}
              </div>
            )}

            {this.props.session.getCurrentUser != null && (
              <ul>
                <li>
                  <NavLink
                    activeClassName="nav-active"
                    to="/dashboard"
                    onClick={() => this.mobile_nav_button()}
                  >
                    <i className="fas fa-store"></i>
                    <label>Dashboard</label>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="nav-active"
                    to="/funnel-genie-main"
                    onClick={() => this.mobile_nav_button()}
                  >
                    <i className="fas fa-filter"></i>
                    <label>Funnel Genie</label>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="nav-active"
                    to="/search-products"
                    onClick={() => this.mobile_nav_button()}
                  >
                    <i className="fas fa-search"></i>
                    <label>Search Product</label>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="nav-active"
                    to="/myfavorites"
                    onClick={() => this.mobile_nav_button()}
                  >
                    <i className="fas fa-heart" />
                    <label>My Favorites</label>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="header-navigation-links"
                    activeClassName="nav-active"
                    to="/collection/brandable"
                    onClick={() => this.mobile_nav_button()}
                  >
                    <i className="fas fa-dolly-flatbed"></i>
                    <label>Brandable</label>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="header-navigation-links"
                    activeClassName="nav-active"
                    to="#"
                    onClick={() => this.toggleCreateModal()}
                  >
                    <i className="fas fa-store"></i>

                    <label>Sourcing Request</label>
                  </NavLink>
                </li>
                {this.props.session.getCurrentUser.privilege === 10 && (
                  <li>
                    <NavLink
                      activeClassName="nav-active"
                      to="/viral-products"
                      onClick={() => this.mobile_nav_button()}
                    >
                      <i className="fas fa-search"></i>
                      <label style={{ ...adminStyle }}>Viral Products</label>
                    </NavLink>
                  </li>
                )}{" "}
                {/*                                                                                                 
                                <li>
                                    <NavLink activeClassName="nav-active" to="/collection/winners" onClick={() => this.mobile_nav_button()}>
                                        <i className="fas fa-fire"></i>
                                        <label>Hot Templates</label>
                                    </NavLink>
                                </li> */}
                {this.props.session.getCurrentUser.privilege === 10 && (
                  <li>
                    <NavLink
                      activeClassName="nav-active"
                      to="/collections"
                      onClick={() => this.mobile_nav_button()}
                    >
                      <i className="fas fa-tags"></i>
                      <label style={{ ...adminStyle }}>Collection</label>
                    </NavLink>
                  </li>
                )}
                <li>
                  <NavLink
                    activeClassName="nav-active"
                    to="/funnel-genie-orders"
                    onClick={() => this.mobile_nav_button()}
                  >
                    <i className="fas fa-th-list"></i>
                    <label>Orders</label>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="nav-active"
                    to="/genie-leads"
                    onClick={() => this.mobile_nav_button()}
                  >
                    <i className="fas fa-users"></i>
                    <label>Genie Leads</label>
                  </NavLink>
                </li>
                {/* <li>
                                    <NavLink activeClassName="nav-active" to="/car-leads" onClick={() => this.mobile_nav_button()}>
                                        <i className="fas fa-car"></i>
                                        <label>Genie Cars</label>
                                    </NavLink>
                                </li> */}
                {/* {(this.props.session.getCurrentUser.access_tags.includes('car_leads') || this.props.session.getCurrentUser.access_tags.includes('agent')) && <li>
                                    <NavLink activeClassName="nav-active" to="/agents-car-leads" onClick={() => this.mobile_nav_button()}>
                                        <i className="fas fa-car"></i>
                                        <label>Agents</label>
                                    </NavLink>
                                </li>} */}
                {/* <li>
                                    <NavLink activeClassName="nav-active" to="/cash-for-car" onClick={() => this.mobile_nav_button()}>
                                        <i className="fas fa-car-side"></i>
                                        <label>Cash for Car</label>
                                    </NavLink>
                                </li> */}
                {/* <li>
                                    <NavLink activeClassName="nav-active" to="/genie-merchant" onClick={() => this.mobile_nav_button()}>
                                        <i className="fas fa-car-side"></i>
                                        <label>Genie Merchant</label>
                                    </NavLink>
                                </li> */}
                {condition.has_funnel_subscriber(
                  this.props.session.getCurrentUser
                ) && (
                  <li>
                    <NavLink
                      activeClassName="nav-active"
                      to="/funnel-genie-subscribers"
                      onClick={() => this.mobile_nav_button()}
                    >
                      <i className="fas fa-users"></i>
                      <label>Funnel Subscribers</label>
                    </NavLink>
                  </li>
                )}
                <li>
                  <NavLink
                    activeClassName="nav-active"
                    to="/cod-payouts"
                    onClick={() => this.mobile_nav_button()}
                  >
                    <i className="fas fa-receipt"></i>
                    <label>Payouts</label>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    activeClassName="nav-active"
                    to="/order-metrics"
                    onClick={() => this.mobile_nav_button()}
                  >
                    <i className="fas fa-chart-bar"></i>
                    <label>Order Metrics</label>
                  </NavLink>
                </li>
                {this.props.session.getCurrentUser.privilege === 10 && (
                  <li>
                    <NavLink
                      activeClassName="nav-active"
                      to="/genie-button-generator"
                      onClick={() => this.mobile_nav_button()}
                    >
                      <i className="fas fa-link"></i>
                      <label style={{ ...adminStyle }}>Invoice Generator</label>
                    </NavLink>
                  </li>
                )}
                {/* <Query query={
                                    GET_PURCHASE_ORDER(`{ po_no }`)
                                } variables={{ affiliate_email: this.props.session.getCurrentUser.email, isApproved: true }}>
                                    {({ data, loading, refetch, error }) => {
                                        if (loading || error) return null;
                                        if (!data.getPurchaseOrders || data.getPurchaseOrders.length == 0) return null;
                                        return (
                                            <li>
                                                <NavLink activeClassName="nav-active" to={"/" + this.props.session.getCurrentUser.pass_key + "/cod-partners"} onClick={() => this.mobile_nav_button()}>
                                                    <i className="fas fa-share-alt"></i>
                                                    <label>COD Partners</label>
                                                </NavLink>
                                            </li>
                                        );
                                    }}
                                </Query> */}
                {/* <li>
                                    <NavLink activeClassName="nav-active" to="/funnel-genie-leads" onClick={() => this.mobile_nav_button()}>
                                        <i className="fas fa-users"></i>
                                        <label>Your Leads</label>
                                    </NavLink>
                                </li> */}
                {/* {this.props.session.getCurrentUser.privilege === 10 && <li>
                                    <NavLink activeClassName="nav-active" to="/trainings" onClick={() => this.mobile_nav_button()}>
                                        <i className="fas fa-globe-asia"></i>
                                        <label style={{ ...adminStyle }}>Training</label>
                                    </NavLink>
                                    </li>} July3*/}
                <li>
                  <NavLink
                    activeClassName="nav-active"
                    to="/trainings"
                    onClick={() => this.mobile_nav_button()}
                  >
                    <i className="fas fa-globe-asia"></i>
                    <label style={{ ...adminStyle }}>Training</label>
                  </NavLink>
                </li>
              </ul>
            )}
          </div>

          {this.props.session.getCurrentUser != null && (
            <div>
              <div
                className={classNames({
                  headline: true,
                  desktop_nav_button: true,
                  active: this.state.shopifyTools,
                })}
                onClick={() => this.toggleShopifyTools()}
              >
                Shopify Tools
                <div className="float-right">
                  <span
                    className={
                      this.state.shopifyTools
                        ? "fas fa-angle-down"
                        : "fas fa-angle-right"
                    }
                    style={{ fontSize: "1.3em" }}
                  />
                </div>
              </div>
              <div
                className={classNames({
                  desktop_nav_toggle: true,
                  active: this.state.shopifyTools,
                })}
              >
                <ul>
                  <li>
                    <NavLink
                      activeClassName="nav-active"
                      to="#"
                      onClick={() => {
                        this.mobile_nav_button();
                        this.toggleConnectModal();
                      }}
                    >
                      <i className="fas fa-user-circle"></i>
                      <label>Connect to Shopify</label>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      activeClassName="nav-active"
                      to="#"
                      onClick={() => {
                        this.mobile_nav_button();
                        this.toggleCopyPush();
                      }}
                    >
                      <i className="fas fa-clone"></i>
                      <label>Copy Push</label>
                    </NavLink>
                  </li>
                  {/* {this.props.session.getCurrentUser.privilege != 0 && // User Privilege
                                        <li>
                                            <NavLink activeClassName="nav-active" to="#" onClick={() => {this.mobile_nav_button(); this.toggleUpdateTheme();}}>
                                                <i className="fas fa-upload"></i>
                                                <label>Update Theme</label>
                                            </NavLink>
                                        </li>
                                    } */}
                  {/* <li>
                                        <NavLink activeClassName="nav-active" to="/ranking" onClick={() => this.mobile_nav_button()}>
                                            <i className="fas fa-store"></i>
                                            <label>Store Ranking</label>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName="nav-active" to="/bundle" onClick={() => this.mobile_nav_button()}>
                                            <i className="fas fa-boxes"></i>
                                            <label>Bundle Genie</label>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName="nav-active" to="#" onClick={() => {this.mobile_nav_button(); this.toggleCopyPush();}}>
                                            <i className="fas fa-clone"></i>
                                            <label>Copy Push</label>
                                        </NavLink>
                                    </li> */}
                  {this.props.session.getCurrentUser.privilege === 10 && (
                    <li>
                      <NavLink
                        activeClassName="nav-active"
                        to="/add-review/0"
                        onClick={() => this.mobile_nav_button()}
                      >
                        <i className="fas fa-comments"></i>
                        <label>
                          Reviews Genie
                          <div className="float-right">
                            <span
                              className="badge"
                              style={{
                                position: "relative",
                                top: 0,
                                borderRadius: "20px",
                                fontSize: "10px",
                              }}
                            >
                              Beta
                            </span>
                          </div>
                        </label>
                      </NavLink>
                    </li>
                  )}
                  {/* <li>
                                        <NavLink activeClassName="nav-active" to="/fulfillment" onClick={() => this.mobile_nav_button()}>
                                            <i className="fas fa-shipping-fast"></i>
                                            <label>Aliexpress Plugin</label>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName="nav-active" to="/myfavorites" onClick={() => this.mobile_nav_button()}>
                                            <i className="fas fa-heart" />
                                            <label>My Favorites</label>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName="nav-active" to="/collections" onClick={() => this.mobile_nav_button()}>
                                            <i><svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 433.678 433.678" space="preserve" width="15px" fill={svgFillColor}> <path d="M433.42,60.597c-0.736-2.672-2.915-4.648-5.979-5.423l-34.255-8.663c-0.878-0.222-2.229-1.574-2.451-2.452l-8.663-34.253 c-0.957-3.787-3.821-6.233-7.298-6.233c-2.087,0-4.163,0.928-5.846,2.611l-30.695,30.694c-2.633,2.633-5.151,7.375-5.858,11.029 l-7.283,37.624c-0.32,1.655-0.277,3.465,0.07,5.246l-20.214,20.15c-32.395-29.041-75.163-46.732-121.991-46.732 C82.073,64.193,0,146.267,0,247.15s82.073,182.956,182.956,182.956s182.956-82.074,182.956-182.956 c0-43.275-15.112-83.081-40.324-114.44l20.73-20.664c1.016,0.208,2.046,0.324,3.059,0.324c0.81,0,1.596-0.073,2.337-0.216 l37.623-7.282c3.655-0.708,8.397-3.227,11.029-5.859l30.694-30.694C433.297,66.083,434.156,63.269,433.42,60.597z M241.891,247.15 c0,32.496-26.438,58.934-58.935,58.934c-32.496,0-58.934-26.438-58.934-58.934s26.438-58.934,58.934-58.934 c5.542,0,10.901,0.786,15.99,2.222l-8.226,24.954c-2.49-0.609-5.088-0.939-7.763-0.939c-18.028,0-32.695,14.667-32.695,32.696 s14.667,32.696,32.695,32.696c17.495,0,31.823-13.812,32.656-31.104l25.789-9.059C241.712,242.13,241.891,244.619,241.891,247.15z M252.14,163.566c-18.797-15.585-42.915-24.967-69.184-24.967c-59.854,0-108.55,48.695-108.55,108.55s48.695,108.55,108.55,108.55 c59.855,0,108.551-48.695,108.551-108.55c0-22.783-7.061-43.946-19.102-61.425l20.348-20.283 c17.028,22.823,27.12,51.108,27.12,81.708c0,75.496-61.42,136.916-136.916,136.916S46.04,322.645,46.04,247.15 s61.42-136.916,136.916-136.916c34.107,0,65.339,12.538,89.335,33.244L252.14,163.566z"></path> </svg></i>
                                            <label>Collections</label>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName="nav-active" to="/audience-builder" onClick={() => this.mobile_nav_button()}>
                                            <i className="fas fa-users"></i>
                                            <label>Audience Genie</label>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName="nav-active" to="#" onClick={() => {this.mobile_nav_button(); this.toggleAdsSpy();}}>
                                            <i className="fas fa-user-secret"></i>
                                            <label>Ads Spy</label>
                                        </NavLink>
                                    </li> */}
                </ul>
              </div>
              {/* * {this.props.session.getCurrentUser.access_tags.includes("dev") &&
                                <div className="headline desktop_nav_button funnel">
                                    <div className="display-inline">
                                        <div className="column_7_12">
                                            <span>Dark Mode</span>
                                        </div>
                                        <div className="column_5_12 text-right">
                                            <ToggleSwitch value={this.state.darkMode} width={40} height={20} onChange={value => this.setState({ darkMode: value }, () => {
                                                localStorage.setItem("plg_dark_mode", value);
                                                document.body.classList.toggle("dark-mode");
                                            })} />
                                        </div>
                                    </div>
                                </div>
                            } * */}
            </div>
          )}

          {this.props.session.getCurrentUser != null && (
            <div>
              <div
                className={classNames({
                  headline: true,
                  desktop_nav_button: true,
                  active: this.state.commerceHQTools,
                })}
                onClick={() => this.toggleCommerceHQTools()}
              >
                CommerceHQ Tools
                <div className="float-right">
                  <span
                    className={
                      this.state.commerceHQTools
                        ? "fas fa-angle-down"
                        : "fas fa-angle-right"
                    }
                    style={{ fontSize: "1.3em" }}
                  />
                </div>
              </div>
              <div
                className={classNames({
                  desktop_nav_toggle: true,
                  active: this.state.commerceHQTools,
                })}
              >
                {this.props.session.getCurrentUser.privilege >= 2 && (
                  <ul>
                    <li>
                      <NavLink
                        activeClassName="nav-active"
                        to="#"
                        onClick={() => {
                          this.mobile_nav_button();
                          this.toggleCommerceHQ();
                        }}
                      >
                        <i className="fas fa-store-alt"></i>
                        <label>Connect to CommerceHQ</label>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        activeClassName="nav-active"
                        to="#"
                        onClick={() => {
                          this.mobile_nav_button();
                          this.toggleCopyPushHQ();
                        }}
                      >
                        <i className="fas fa-clone"></i>
                        <label>Copy Push to CommerceHQ</label>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* {this.props.session.getCurrentUser != null &&
                        <div>
                            <div className={classNames({ 'headline': true, 'desktop_nav_button': true, 'active': this.state.icheck })} onClick={event => this.icheck_button(event)}>
                                The Checklist
                                <div className="float-right">
                                    <span className="badge" style={{position:'relative', top: 0, borderRadius:20, fontSize:10, marginRight: 10}}>New</span>
                                    <span className={this.state.icheck ? "fas fa-caret-down" : "fas fa-caret-right"}></span>
                                </div>
                            </div>
                            <div className={classNames({ 'desktop_nav_toggle': true, 'active': this.state.icheck })}>
                                {(() => {
                                    return(
                                        <ul>
                                            <li>
                                                <NavLink activeClassName="nav-active" to='/the-checklist/313183855/Campaign Launch Blueprint' onClick={() => this.mobile_nav_button()}>
                                                    <i className="fas fa-wrench"></i>
                                                    Campaign Launch Blueprint
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink activeClassName="nav-active" to='/the-checklist/313171950/Your First Campaign' onClick={() => this.mobile_nav_button()}>
                                                    <i className="fas fa-star"></i>
                                                    Your First Campaign
                                                </NavLink>
                                            </li>
                                        </ul>
                                    );
                                })()}
                            </div>
                        </div>
                    } */}
          {/* {this.props.session.getCurrentUser != null &&
                        <div>
                            <div className={classNames({ 'headline': true, 'desktop_nav_button': true, 'active': this.state.seven_day_challenge })} onClick={event => this.seven_day_challenge_button(event)}>
                                7-Day Challenge
                                <div className="float-right">
                                    {this.state.displayNewBadge && points.getDatePastSinceJoin(this.props.session.getCurrentUser.joinDate) <= points.sevenDayChallenge.length ?
                                        <span className="badge" style={{position: 'relative', top: 0, marginRight: '10px', borderRadius: '20px', fontSize: '10px'}}>new</span>
                                    : ''}
                                    <span className={this.state.seven_day_challenge ? "fas fa-caret-down" : "fas fa-caret-right"}></span>
                                </div>
                            </div>
                            <div className={classNames({ 'desktop_nav_toggle': true, 'active': this.state.seven_day_challenge })}>
                                <ul>
                                    {points.sevenDayChallenge.map((videoData, i) => {
                                        var isWatchThisDay = this.props.session.getCurrentUser.one_time_missions.includes("day"+(i+1))
                                        return (
                                            <li key={(i+1)}>
                                                <NavLink activeClassName="nav-active" to={this.getDateDifferent((i+1)) ? "/7DayChallenge/"+(i+1) : "#"} onClick={() => {this.proceedToLink((i+1)); this.mobile_nav_button()}}>
                                                    {this.getDateDifferent((i+1)) ? <i className="fas fa-calendar"></i> : <i className="fas fa-lock"></i> }
                                                    {videoData.title.replace(" Challenge","")}
                                                    {isWatchThisDay &&
                                                        <div className="float-right">
                                                            <span className="fas fa-check-circle" style={{color: '#fff'}} title="Watched"></span>
                                                        </div>
                                                    }
                                                </NavLink>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    } */}
          {/* {this.props.session.getCurrentUser != null &&
                        <div>
                            <Query query={GET_ADMIN_SETTINGS} >
                                {({data, loading, refetch}) => {
                                    if(loading) return null;
                                    if(data.getAdminSettings != null){
                                        if(data.getAdminSettings.million_dollar_training && data.getAdminSettings.million_dollar_training.length != 0){
                                            return(
                                                <div>
                                                    <div className={classNames({ 'headline': true, 'desktop_nav_button': true, 'active': this.state.trainings })} onClick={event => this.trainings_button(event)}>
                                                        Million Dollar Trainings
                                                        <div className="float-right">
                                                            <span className={this.state.trainings ? "fas fa-caret-down" : "fas fa-caret-right"}></span>
                                                        </div>
                                                    </div>
                                                    <div className={classNames({ 'desktop_nav_toggle': true, 'active': this.state.trainings })}>
                                                        <ul>
                                                            {data.getAdminSettings.million_dollar_training.map((videoData,vi) => {
                                                                var isUnlocked = false;
                                                                if(videoData.tag){
                                                                    if(this.props.session.getCurrentUser.kartra_tags){
                                                                        isUnlocked = this.props.session.getCurrentUser.kartra_tags.includes(videoData.tag);
                                                                    } else {
                                                                        isUnlocked = false;
                                                                    }
                                                                } else {
                                                                    isUnlocked = true;
                                                                }
                                                                return(
                                                                    <li key={vi}>
                                                                        <NavLink activeClassName="nav-active" to={isUnlocked ? "/million-dollar-training/"+videoData.id : "#"} onClick={() => {this.md_training_upsell_button(isUnlocked, videoData.upsell_link); this.mobile_nav_button()}}>
                                                                            {isUnlocked ? <i className="fas fa-lock-open"></i> : <i className="fas fa-lock"></i> }
                                                                            {videoData.introduction_title}
                                                                        </NavLink>
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    }
                                    return null
                                }}
                            </Query>
                        </div>
                    } */}
          {/* <div>
                    {this.props.session.getCurrentUser != null &&
                        this.state.custom_page.length != 0 ?
                            this.state.custom_page.map((pageContent,i) => {
                                var statename = pageContent.navigation_name+"_"+i;
                                statename = statename.replace(/\s/g,"_");
                                if(pageContent.active){
                                    return (
                                        <div key={"parent"+i}>
                                            <div className={classNames({ 'headline': true, 'desktop_nav_button': true, 'active': this.state[statename] })} onClick={event => this.custom_page_button(pageContent.navigation_name+"_"+i,event)}>
                                            {pageContent.navigation_name}
                                                <div className="float-right">
                                                    <span className={this.state[statename] ? "fas fa-caret-down" : "fas fa-caret-right"}></span>
                                                </div>
                                            </div>
                                            <div className={classNames({ 'desktop_nav_toggle': true, 'active': this.state[statename] })}>
                                                <ul>
                                                    <Query query={GET_ADMIN_CUSTOM_PAGE_DATA} variables={{panel_id:pageContent.id}}>
                                                        {({data, loading, refetch}) => {
                                                            if(loading) return null;
                                                            if(data.getCustomPageOfPanel.length != 0){
                                                                return data.getCustomPageOfPanel.map((content,x) => {
                                                                    var isAvailable = this.checkAvailability(content);
                                                                    return (
                                                                        <li key={"child"+x}>
                                                                            <!-- {/* <NavLink activeClassName="nav-active" to={isAvailable ? "/"+pageContent.navigation_name.replace(/\s/g,"_")+"/"+content.id : '#'} onClick={() => {this.checkAvailability(content, true); this.mobile_nav_button()}}> -->
                                                                            <NavLink activeClassName="nav-active" to={isAvailable ? "/training-videos/"+content.id : '#'} onClick={() => {this.checkAvailability(content, true); this.mobile_nav_button()}}>
                                                                                <i className={!isAvailable ? 'fas fa-lock' : content.page_icon}></i>
                                                                                <span className="capitalize">{content.page_name.toLowerCase()}</span>
                                                                            </NavLink>
                                                                        </li>
                                                                    );
                                                                })
                                                            }
                                                            return null;
                                                        }}
                                                    </Query>
                                                </ul>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return null;
                                }
                            })
                        : null
                    }
                    </div> */}
        </nav>
        {/* Modals */}
        {(() => {
          if (this.state.openCopyPush) {
            return (
              <CopyPush
                refetch={this.props.refetch}
                session={this.props.session}
                open={this.state.openCopyPush}
                closeModal={this.toggleCopyPush}
              />
            );
          } else if (this.state.openCommHQ) {
            return (
              <ConnectToCommerceHQ
                refetch={this.props.refetch}
                session={this.props.session}
                open={this.state.openCommHQ}
                closeModal={this.toggleCommerceHQ}
              />
            );
          } else if (this.state.copyPushHQ) {
            return (
              <CopyPushCommerce
                refetch={this.props.refetch}
                session={this.props.session}
                open={this.state.copyPushHQ}
                closeModal={this.toggleCopyPushHQ}
              />
            );
          } else if (this.state.openConnect) {
            return (
              <ConnectToStore
                open={this.state.openConnect}
                closeModal={this.toggleConnectModal}
                session={this.props.session}
              />
            );
          } else if (this.state.buy_plg_theme_lite) {
            return (
              <PLGThemeLite
                open={this.state.buy_plg_theme_lite}
                closeModal={this.buy_plg_theme_lite_button}
                session={this.props.session}
              />
            );
          } else if (this.state.adsSpy) {
            return (
              <AdsSpy
                open={this.state.adsSpy}
                closeModal={this.toggleAdsSpy}
                session={this.props.session}
              />
            );
          } else if (this.state.upsellModal) {
            return (
              <UpsellAlert
                open={this.state.upsellModal}
                closeModal={this.proceedToLink}
                session={this.props.session}
              />
            );
          } else if (this.state.md_training_upsell) {
            return (
              <UpsellAlert
                open={this.state.md_training_upsell}
                closeModal={this.md_training_upsell_button_close}
                session={this.props.session}
                upsellLink={this.state.md_training_upsell_link}
              />
            );
          } else if (this.state.openUpdate) {
            toastr.clear();
            if (!this.props.session.getCurrentUser.store_url) {
              toastr.warning(
                "Seems like your not connected to your store yet",
                "Connect Your Store"
              );
              window.toggleConnectModal();
              return null;
            }
            return (
              <div>
                {(() => {
                  if (this.state.doneChecking) {
                    return (
                      <Modal
                        open={this.state.openUpdate}
                        closeModal={this.closeUpdateTheme}
                        session={this.props.session}
                      >
                        <Fragment>
                          {(() => {
                            if (
                              this.state.themeUpdateNotice.message != undefined
                            ) {
                              if (
                                this.state.themeUpdateNotice.message ===
                                "notheme"
                              ) {
                                return (
                                  <div className="center-vertical">
                                    <h3>
                                      We don't see the PLG theme installed on
                                      your store
                                    </h3>
                                    <br />
                                    <a
                                      href="https://themm.kartra.com/page/SLo22/?utm_terms=Tony"
                                      style={{ textAlign: "center" }}
                                      target="_blank"
                                    >
                                      <h3 style={{ color: "#37bd46" }}>
                                        Get your PLG Theme here
                                      </h3>
                                    </a>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="center-vertical-parent">
                                    <h3 className="center-vertical">
                                      {this.state.themeUpdateNotice.message}
                                    </h3>
                                  </div>
                                );
                              }
                            } else {
                              return (
                                <div className="center-vertical">
                                  <h3 className="text-center">
                                    The following files will be overwritten when
                                    you update the theme to v
                                    {this.state.themeUpdateNotice.version}
                                  </h3>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: this.state.themeUpdateNotice.info,
                                    }}
                                  ></div>
                                  <br />
                                  <h4>
                                    Please create a copy of the original theme
                                    if you have modified something within the
                                    codes
                                  </h4>
                                  <br />
                                  <div className="text-center form_buttons">
                                    <button
                                      className="btn cancel-update"
                                      onClick={this.closeUpdateTheme}
                                    >
                                      Cancel
                                    </button>{" "}
                                    | &nbsp;
                                    <button
                                      className="btn"
                                      onClick={this.updateTheme.bind(
                                        this,
                                        false
                                      )}
                                    >
                                      Update Theme
                                    </button>
                                  </div>
                                </div>
                              );
                            }
                          })()}
                        </Fragment>
                      </Modal>
                    );
                  } else {
                    if (!this.state.finish) {
                      toastr.info("Please Wait...", "Checking for update");
                      this.updateTheme(true);
                    }
                  }
                })()}
              </div>
            );
          } else if (this.state.isPopupFCopen) {
            return (
              <Modal
                open={this.state.isPopupFCopen}
                closeModal={this.toggleOpenFulfillmentCenter}
                session={this.props.session}
              >
                <div className="text-center">
                  <iframe
                    src="https://player.vimeo.com/video/320392051"
                    width="600"
                    height="360"
                    frameBorder="0"
                    webkitallowfullscreen="true"
                    mozallowfullscreen="true"
                    allowFullScreen
                  ></iframe>
                  <div style={{ display: "flex" }}>
                    <span
                      className="mcwidget-embed"
                      data-widget-id="5009366"
                      style={{ margin: "0 auto" }}
                    />
                  </div>
                </div>
              </Modal>
            );
          } else if (this.state.maintenance) {
            return (
              <Modal
                open={this.state.maintenance}
                closeModal={this.toggleMaintenance}
                session={this.props.session}
              >
                <div className="text-center center-vertical">
                  <h2 className="capitalize">
                    Business as usual...
                    <br /> We are updating the Fulfillment Genie.
                  </h2>
                </div>
              </Modal>
            );
          } else {
            return null;
          }
        })()}
      </Fragment>
    );
  }
}

export default withSession(SideBar);
