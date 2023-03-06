process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import "babel-polyfill";
import "isomorphic-unfetch";
require("dotenv").config({ path: "variables.env" });
import path from "path";
import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import webConfig from "./webConfig";
import { StaticRouter } from "react-router";
import { InMemoryCache } from "apollo-cache-inmemory";
import React from "react";
import ReactDOM from "react-dom/server";
import { ApolloProvider, getDataFromTree } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import mongoose, { Schema, mongo } from "mongoose";
import cors from "cors";
import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { Helmet } from "react-helmet";
import fileUpload from "express-fileupload";
import randomstring from "randomstring";

import AppComponent from "./src/app";
import HTML from "./src/helpers/renderer";

import { typeDefs } from "./src/schema";
import {
  resolvers,
  getFunnelProducts,
  startRestructure,
  resyncFulfillerOrder,
  changeSerialNumberToReturning,
  addProductCostToFunds,
  getTotalFunnelOrder,
  getBuyerList,
} from "./src/resolvers";
import User from "./src/models/User";
import FunnelBlocks from "./src/models/FunnelBlocks";
import Admin from "./src/models/Admin";
import AdminCustomPage from "./src/models/CustomPage";
import Points from "./src/models/Points";
import Gems from "./src/models/Gems";
import Leads from "./src/models/Leads";
import FulfillmentChina from "./src/models/FulfillmentChina";
import NewFulfillmentChina from "./src/models/NewFulfillmentChina";
import PaidOrders from "./src/models/PaidOrders";
import OrdersID from "./src/models/OrdersID";
import NewOrdersID from "./src/models/NewOrdersID";
import Conversation from "./src/models/Conversation";
import PaymentLogs from "./src/models/PaymentLogs";
import VirtualWarehouse from "./src/models/VirtualWarehouse";
import NewVirtualWarehouse from "./src/models/NewVirtualWarehouse";
import TopupLogs from "./src/models/TopupLogs";
import CreditsLog from "./src/models/PLGCreditLogs";
import FunnelGenie from "./src/models/FunnelGenie";
import FunnelGenieID from "./src/models/FunnelGenieID";
import FunnelGenieOrder from "./src/models/FunnelGenieOrder";
import FunnelGenieOrderArchive from "./src/models/FunnelGenieOrderArchive";
import FunnelIntegration from "./src/models/FunnelIntegration";
import Integration from "./src/models/Integration";
import FunnelLeadsMetaData from "./src/models/FunnelLeadsMetaData";
import FunnelProducts from "./src/models/FunnelProducts";
import FunnelProductDesign from "./src/models/FunnelProductDesign";
import PurchaseOrders from "./src/models/PurchaseOrder";
import EmailSequence from "./src/models/EmailSequence";
import FunnelList from "./src/models/FunnelList";
import FunnelPageList from "./src/models/FunnelPageList";
import FunnelEmailSequenceV1 from "./src/models/FunnelEmailSequenceV1";
import FunnelEmailSequenceV2 from "./src/models/FunnelEmailSequenceV2";
import Messages from "./src/models/Messages";
import queryString from "query-string";
import axios from "axios";
import moment from "moment";
var multer = require("multer")();
const FormData = require("form-data");
const request = require("request-promise");
const _points = require("./Global_Values");
const dppAPIkey = "b0d38d60cd073060319f45d7abbb4321";
const dppToken = "6281c494541e769a57186a4ce10f9707"; // or password or secret
const BoxC = require("boxc");
const apiBoxC = BoxC.create(
  "664b31fc11dbbbaad076958eb33adcba39ababbb453a2ec8a25eb142d26c6157"
);
const https = require("https");
const dns = require("dns");
const { lookup } = require("lookup-dns-cache"); // dns-lookup
const npm_url = require("url");
const CryptoJS = require("crypto-js");
const bcrypt = require("bcryptjs");
const Conekta = require("conekta");
let ShortId = require("id-shorter");
let mongoDBId = ShortId({ isFullId: true });
let webPush = require("web-push");
let q = require("q");

mongoose.Promise = global.Promise;

const funnelserver =
  webConfig.environment === "development"
    ? process.env.LOCAL_FUNNEL_SERVER
    : process.env.FUNNEL_SERVER;
// Connect MongoDB
mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useMongoClient: true,
  })
  .then(() => {
    console.log("Connection to DB successful");
    console.log("Funnel Server => ", funnelserver);
  })
  .catch((err) => {
    console.log(`Connection to DB Error: ${err}`);
  });

const app = express();
app.disable("etag").disable("x-powered-by");
const PORT = process.env.PORT || 3000;
function parseXmlToJson(xml) {
  const json = {};
  for (const res of xml.matchAll(
    /(?:<(\w*|\w*-\w*|\w*-\w*-\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm
  )) {
    const key = res[1] || res[3];
    const value = res[2] && parseXmlToJson(res[2]);
    json[
      key.replace(/-([a-z]|[0-9])/g, (g) => {
        return g[1].toUpperCase();
      })
    ] = (value && Object.keys(value).length ? value : res[2]) || null;
  }
  return json;
}
function encode(str) {
  return new Buffer(str).toString("base64");
}
function decodeBtoa(str) {
  return new Buffer.from(str, "base64").toString();
}
function decode(str) {
  var bytes = CryptoJS.AES.decrypt(str, _points.plg_domain_secret);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * niches = collections
 * niche = collection
 */

// * https://plgttesting.tunnelto.dev
// * 'https://localhost:8000',
// * https://shopifyplgapp.tunnelto.dev
app.use(
  cors({
    // origin: `${webConfig.siteURL}`,
    origin: function (origin, callback) {
      if (
        [
          "https://cars.freeviralproducts.com",
          "https://plgttesting.tunnelto.dev",
          "https://localhost:8000",
          "https://freeviralcars.com",
          webConfig.siteURL,
          "https://staging.freeviralproducts.com",
        ].indexOf(origin) !== -1 ||
        !origin
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// app.use(cors())

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.post("/checkDomain", (req, res) => {
  // pang samantagal
  lookup(req.body.url, (err, address, family) => {
    console.log("Domain Address ==>", address, req.body.url);
    if (address == "45.55.121.131") {
      var payload = {
        domainname: req.body.url,
        plg_domain_secret: _points.plg_domain_secret,
      };
      _points.customFetch(
        "https://admin.productlistgenie.io/renewdomain",
        "POST",
        payload,
        (result) => {
          if (result && result.status === "success") {
            res.json({ status: "success", message: "Success please wait." });
          } else {
            res.json({ status: "error", message: "Please try again." });
          }
        }
      );
    } else {
      res.json({
        status: "error",
        message: "Change Your A record to: 45.55.121.131",
      });
    }
  });
});

app.get("/checkDomain/:domain", (req, res) => {
  // pang samantagal
  dns.lookup(req.params.domain, (err, address, family) => {
    res.json({ address });
  });
});

app.post("/api/v3/commerceHQ", async (req, res) => {
  // wainting to clone commerce HQ
  const { storeName, apiKey, src, apiPassword } = req.body;

  fetch(`${src}.json`)
    .then((data) => data.json())
    .then((data) => {
      // console.log({
      //     storeName: req.body.storeName,
      //     apiKey: req.body.apiKey,
      //     src: ,
      //     apiPassword: req.body.apiPassword,
      // });
      console.log("Cloning Product =>> ", req.body.src);
      // commercehq creds
      const creds = {
        storeName: storeName,
        apiKey: apiKey,
        apiPassword: apiPassword,
      };

      function encode(str) {
        return new Buffer(str).toString("base64");
      }

      var imgs = data.product.images.map((img) => {
        return { id: img.id, src: img.src };
      });

      function forEachPromise(items, fn, context, credentials) {
        return items.reduce(function (promise, item) {
          return promise.then(function () {
            return fn(item, context, credentials);
          });
        }, Promise.resolve());
      }
      function logItem(item, context, credentials) {
        return new Promise((resolve, reject) => {
          process.nextTick(() => {
            axios
              .request({
                responseType: "arraybuffer",
                url: item.src,
                method: "get",
              })
              .then((result) => {
                var data = new FormData();
                data.append("files", result.data, {
                  filename: `${Date.now()}.jpg`,
                });
                data.append("Accept", "application/json, text/plain, */*");
                data.append("type", "product_images");

                var config = {
                  method: "post",
                  url: `https://${credentials.storeName}.commercehq.com/api/v1/files`,
                  headers: {
                    Authorization:
                      "Basic " +
                      encode(
                        credentials.apiKey + ":" + credentials.apiPassword
                      ),
                    ...data.getHeaders(),
                  },
                  data: data,
                };
                axios(config).then((response) => {
                  context.push({ cID: response.data[0].id, sID: item.id });
                  resolve(context);
                });
              });
          });
        });
      }

      var imgBuff = [];
      console.log(imgs);

      forEachPromise(imgs, logItem, imgBuff, creds).then((r) => {
        var textCleanUp = (text) => {
          return text.replace(
            /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c\ude32-\ude3a]|[\ud83c\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,
            ""
          );
        };

        var variants = data.product.variants.map((variant) => {
          return {
            variant: variant.title.split("/").map((vn) => {
              return vn.replace(/[^a-zA-Z0-9\s]|\s\s/g, "").trim();
            }),
            price: parseFloat(variant.price),
            compare_price: parseFloat(variant.compare_at_price),
            sku: variant.sku ? null : variant.sku,
            default: variant.position == 1 ? true : false,
            ignore: false,
          };
        });
        var options = data.product.options.map((opt) => {
          return {
            title: opt.name.replace(/[^a-zA-Z0-9\s]|\s\s/g, "").trim(),
            changes_look: false,
            values: opt.values.map((val) =>
              val.replace(/[^a-zA-Z0-9\s]|\s\s/g, "").trim()
            ),
          };
        });

        var comhq = {
          title: data.product.title,
          price: variants.length != 0 ? data.product.variants[0].price : "", //decimals?
          compare_price:
            variants.length != 0
              ? data.product.variants[0].compare_at_price != ""
                ? data.product.variants[0].compare_at_price
                : void 0
              : void 0, //decimals?
          textareas: [
            { name: "Description", text: textCleanUp(data.product.body_html) },
          ],
          collections: [1],
          images: r.map((im) => im.cID), //[data.product.image.length],
          tags: ["replace_tags"],
          type:
            data.product.product_type != "" ? data.product.product_type : "any",
          vendor: data.product.vendor,
          // "options": options,
          // "variants": variants,
          is_multi:
            data.product.variants[0].title !== "Default Title" ? true : false,
          track_inventory: false,
          auto_fulfilment: false,
          seo_url: data.product.title
            .replace(/[^a-zA-Z0-9\s]|\s/g, "-")
            .toLowerCase(),
        };

        if (comhq.is_multi) {
          comhq.options = options;
          comhq.variants = variants;
        }

        console.log(JSON.stringify(comhq, null, 2));
        console.log(imgBuff);
        fetch(`https://${creds.storeName}.commercehq.com/api/v1/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic " + encode(creds.apiKey + ":" + creds.apiPassword),
          },
          body: JSON.stringify(comhq),
        })
          .then((response) => response.json())
          .then((response) => {
            // console.log("response ng kinsmarket =>> ",JSON.stringify(response));
            console.log(
              `${storeName}.commercehq.com/product/${response.seo_url} Successfully cloned to =>> `,
              req.body.src
            );
            res.json({
              status: "success",
              message: `${storeName}.commercehq.com/product/${response.seo_url}`,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      res.sendStatus(403);
    });
});

/* ==================== START Funnel Editor Endpoint ==================== */
Conekta.api_version = "2.0.0";
app.post("/get-conekta-plans", (req, res) => {
  Conekta.api_key = decode(req.body.private_key);
  Conekta.Plan.find(null, (err, plan) => {
    res.json(plan.toObject());
  });
});

app.post("/get-braintreet-token", (req, res) => {
  console.log(req.body);
  const options = {
    method: "POST",
    url: req.body.live
      ? "https://payments.braintree-api.com/graphql"
      : "https://payments.sandbox.braintree-api.com/graphql",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${req.body.authkey}`,
      "Braintree-Version": "2019-01-01",
    },
    data: JSON.stringify({
      query:
        "mutation ExampleClientToken($input: CreateClientTokenInput) {\n  createClientToken(input: $input) {\n    clientToken\n  }\n}\n",
      variables: {
        input: {
          clientToken: { merchantAccountId: req.body.merchantAccountId },
        },
      },
      operationName: "ExampleClientToken",
    }),
  };

  axios
    .request(options)
    .then((response) => {
      console.log(response);
      console.log(response.data);
      res.send(response.data);
    })
    .catch((err) => {
      res.send(err);
    });
});

/* ==================== END Funnel Editor Endpoint ==================== */

app.post("/api/subscribeNotification", (req, res) => {
  const data = req.body;
  mongoose.model("User").findByIdAndUpdate(
    { _id: req.body._id },
    {
      endpoint: req.body.endpoint,
      keys: { p256dh: data.keys.p256dh, auth: data.keys.auth },
    },
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/send-js-to-buttonserver", (req, res) => {
  _points.customFetch(
    "https://button.plgenie.io/plgql",
    "POST",
    { ...req.body.payload },
    (result) => {
      res.json(result);
    }
  );
});

app.post("/delete-generated-server", (req, res) => {
  _points.customFetch(
    "https://button.plgenie.io/plgql",
    "POST",
    {
      ...req.body.payload,
    },
    (result) => {
      res.json(result);
    }
  );
});

app.post("/update-send-js-to-buttonserver", (req, res) => {
  _points.customFetch(
    "https://button.plgenie.io/plgql",
    "POST",
    { ...req.body.payload },
    (result) => {
      res.json(result);
    }
  );
});

app.post("/test-test-test", (req, res) => {
  const country = _points.generatedButtonCountryList.list;

  let countryOptions = () => {
    return country
      .map((c) => {
        return `<option value="${c.value}">${c.label}</option>`;
      })
      .join("");
  };

  res.send(`
        <select >
            ${countryOptions()}
        </select>
    `);
});

app.post("/api/buttonGenerator", (req, res) => {
  console.log("req.body.rawButton");
  // Create a country

  const country = _points.generatedButtonCountryList.list;

  let countryOptions = () => {
    return country
      .map((c) => {
        return `<option value="${c.iso3}">${c.name}</option>`;
      })
      .join("");
  };

  res.status(200).json({
    html: `    
        var css = \`
        .plgbutton {
            padding: 8px;
            margin: 8px;
        }

        .plg ul {
            list-style: none;
            text-decoration: none;
            padding: 0;
        }

        .plg h6 {
            font-size: 18px;
            font-weight: 500;
            padding: 10px;
            margin-block: unset;
        }

        .popup-container {
            display: inline-block;
        }

        .popup-container .popup-button {
            background: #333;
            line-height: 34px;
            color: #fff;
            padding: 0 20px;
            border-radius: 3px;
            display: block;
            cursor: pointer;
        }

        .popup-container .popup-button:hover {
            background: #444;
        }

        .popup-container .popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10;
            opacity: 0;
            visibility: hidden;
            transition: 250ms all;
        }

        .popup-container .popup h6 {
            font-size: 18px;
            font-weight: 500;
            padding: 10px;
        }

        .popup-container .popup .popup-inner {
            min-width: 400px;
            box-sizing: border-box;
            padding: 20px;
            background: #fff;
            position: absolute;
            max-height:100%;
            overflow:overlay;
            left: 50%;
            transform: translate(-50%, -50%);
            top: 150%;
            transition: 250ms all;
        }

        .popup-container .popup .popup-inner .popup-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .popup-container .popup .popup-inner .popup-title h6 {
            font-size: 18px;
            font-weight: 500;
        }

        .popup-container .popup .popup-inner .popup-title .popup-close-btn {
            cursor: pointer;
            background: #eee;
            display: block;
            line-height: 30px;
            padding: 0 15px;
            font-size: 14px;
            color: #222;
            border-radius: 3px;
        }

        .popup-container .popup .popup-inner .popup-content ul li {
            margin-bottom: 10px;
        }

        .popup-container .popup .popup-inner .popup-content ul li:last-child {
            margin-bottom: 0;
        }

        .popup-container .popup .popup-inner .popup-content ul li input {
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 3px;
            line-height: 34px;
            padding: 0 15px;
            font-size: 14px;
            box-sizing: border-box;
        }

        .popup-container .popup .popup-inner .popup-content ul li select {
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 3px;
            line-height: 34px;
            padding: 0 15px;
            font-size: 14px;
            box-sizing: border-box;
        }

        .popup-container .popup .popup-inner .popup-content ul li button {
            width: 100%;
            line-height: 34px;
            background: #26c686;
            color: #fff;
            cursor: pointer;
            border-radius: 3px;
            border: none;
            font-size: 14px;
        }

        .popup-container .popup .popup-inner .popup-content ul li button:hover {
            background: #189865;
        }

        .popup-container .popup .transparent-label {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            cursor: pointer;
        }

        .popup-container>input {
            display: none;
        }

        .popup-container>input:checked+.popup {
            opacity: 1;
            visibility: visible;
        }

        .popup-container>input:checked+.popup .popup-inner {
            top: 50%;
        }
        #display_on_pay{
            width: 500px;
            height: 500px;
        }
        \`;

        var popupForm = \`<div class="plg popup-container">
                                <label class="popup-button" for="login-popup" style="display:none">Login</label>
                                <input type="checkbox" id="login-popup" style="display:none">
                                <div class="popup">
                                    <label for="login-popup" class="transparent-label"></label>
                                    <div class="popup-inner">
                                        <div class="popup-title">
                                            <h6>$ ${req.body.amount}</h6>
                                            <label for="login-popup" class="popup-close-btn">Close</label>
                                        </div>
                                        <div class="popup-content" id="display_on_pay" style="display: none;">
                                            <iframe src="" frameborder="0" id="display_on_pay_iframe" style="width: 100%;height : 100%; "></iframe>
                                        </div>
                                        <div class="popup-content" id="display_init_checkout">
                                            <form onsubmit="return getCard(event)">
                                                <ul>
                                                    <li>
                                                        <input type="hidden" name="meta" value="${
                                                          req.body.meta
                                                        }">
                                                        <input type="text" name="firstName" placeholder="Name">
                                                    </li>
                                                    <li>
                                                        <input type="email" name="email" placeholder="Email">
                                                    </li>
                                                    <li>
                                                        <input type="text" name="address" placeholder="Street Address">
                                                    </li>
                                                    <li>
                                                        <input type="text" name="city" placeholder="City">
                                                    </li>
                                                    
                                                    <li>
                                                        <input type="text" name="state" placeholder="State">
                                                    </li>
                                                    <li>                                                        
                                                        <select name="country" placeholder="Country">
                                                            ${countryOptions()}
                                                        </select>
                                                    </li>
                                                    <h6>Card Info</h6>
                                                    <div id="plg_credit_card">
                                                        <div id="element-container"></div>
                                                        <div id="error-handler" role="alert"></div>
                                                    </div>
                                                    <li>
                                                        <button type="submit">${
                                                          req.body
                                                            .buttonLabelText
                                                        }</button>
                                                    </li>
                                                </ul>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div> \`;
        var b = document.body; // Create a <h1> element
        // Create a text node
        // b.appendChild(popupForm);

        var head = document.head;
        var btnstyle = document.createElement("style");
        btnstyle.id = "styled";
        btnstyle.appendChild(document.createTextNode(css));

        var scriptString = '<scrip' + 't + type="text/javascript"></scr' + 'ipt><strong>test</strong>';
        function insertElements() {
            b.innerHTML += popupForm;
            head.appendChild(btnstyle);
            stripAndExecuteScript(scriptString, "https://secure.gosell.io/js/sdk/tap.min.js");
            setTimeout(() => {
                initTap();
            }, 3000);
        }

        !document.getElementById("styled") ? insertElements() : void 0; // Check if created once

        function gotoThankyouPage() {
            document.getElementById("login-popup").checked = true;
            window.open('${req.body.redirectURI}', "_blank");
        }

        var scrTag = document.querySelectorAll('script[src*="https://button.plgenie.io"]');

        function insertAfter(referenceNode, newNode, type) {
            referenceNode.forEach((el) => {
                el.parentNode.insertBefore(newNode, el.nextSibling);
            });

            if (type === "tappayment") {
                setTimeout(() => {
                    initTap();
                }, 3000);
            }
        }
        var btn = document.createElement("BUTTON"); // Create a <button> element
        btn.innerHTML = "${req.body.title}";
        btn.className = "plgbutton";
        btn.setAttribute('style', '${req.body.rawStyles}');
        btn.addEventListener("click", (e) => {
            document.getElementById("login-popup").checked = true;
        });

        // document.body.appendChild(btn);
        insertAfter(scrTag, btn);

        function stripAndExecuteScript(text, src) {
            var scripts = '';
            var cleaned = text.replace(/<script[^>]*>([\\s\\S]*?)<\\/script>/gi, function () {
                scripts += arguments[1] + '';
                return '';
            });

            if (window.execScript) {
                window.execScript(scripts);
            } else {
                var head = document.getElementsByTagName('head')[0];
                var scriptElement = document.createElement('script');
                scriptElement.setAttribute('type', 'text/javascript');
                scriptElement.setAttribute('src', src);
                scriptElement.innerText = scripts;
                head.appendChild(scriptElement);
            }
            return cleaned;
        };
        var countryList = ${JSON.stringify(country)};

        function searchArray(nameKey){
            for (var i=0; i < countryList.length; i++) {
                if (countryList[i].iso3 === nameKey) {
                    return countryList[i];
                }
            }
        }


        var tap;
        var card;
        function initTap() {
            // initiate Tagging Tap Payment
            // tap = Tapjsli('pk_test_0WJVYyBOCw4Z5sxGFi9kcvpf');
            tap = Tapjsli('pk_live_LEBPYCraDqHuUmQO75dgtpnx');
            var elements = tap.elements({});
            var style = {
                base: {
                    color: '#535353',
                    lineHeight: '18px',
                    fontFamily: 'sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                        color: 'rgba(0, 0, 0, 0.26)',
                        fontSize: '15px'
                    }
                },
                invalid: {
                    color: 'red'
                }
            };
            // input labels/placeholders
            var labels = {
                cardNumber: "Card Number",
                expirationDate: "MM/YY",
                cvv: "CVV",
                cardHolder: "Card Holder Name"
            };
            //payment options
            var paymentOptions = {
                currencyCode: ["KWD", "USD", "SAR", "AED", "BHD", "OMR", "QAR"],
                labels: labels,
                TextDirection: 'ltr'
            }
            //create element, pass style and payment options
            card = elements.create('card', { style: style }, paymentOptions);
            //mount element
            card.mount('#element-container');
            //card change event listener
            card.addEventListener('change', function (event) {
                if (event.BIN) {
                    // console.log(event.BIN)
                }
                if (event.loaded) {
                    // console.log("UI loaded :"+event.loaded);
                    // console.log("current currency is :"+card.getCurrency())
                }
                var displayError = document.getElementById('error-handler');
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = '';
                }
            });
        }

        function formToObject(form) {
            return Array.from(new FormData(form)).reduce((acc, [key, value]) => ({
                ...acc,
                [key]: value
            }), {});
        }

        function getCard(event) {
            event.preventDefault();
            console.log("GET CARD FORM VALUESSS ====>> ",formToObject(event.target));
            let formvalue = formToObject(event.target);
            formvalue.lastName = "";
            formvalue.bldgVilla = "";
            formvalue.aptOffice = "";
            formvalue.productPrice = ${req.body.amount};
            formvalue.paid_cc = true;
            formvalue.receipt_cc = "";
            formvalue.productName = "Generated Button Order";
            formvalue.variantName = "PLG Generated Button Merchant";
            formvalue.plgbuttonID = "${req.body.plgbuttonID}";
            formvalue.merchantType= "plgbutton"; // plgbutton
            formvalue.customerID = "plgbtn_" + Math.floor((Math.random() * 1000000000000) + 1);
            formvalue.currencyWord = searchArray(formvalue.country).cw;
            formvalue.currencySymbol = searchArray(formvalue.country).cs;
            formvalue.variantQty = 1;

            
            if (card !== null) {
                tap.createToken(card).then(function (result) {
                    if (result.error) {
                        console.log('Error !!', result.error);
                    } else {
                        var cod_data = {
                            productPrice: ${req.body.amount},
                            currencyWord: 'USD', // Currency Word
                            firstName: "Test Test",
                            lastName: "Last Test",
                            email: "test@enail.com",
                            phone: "",
                            smsVerified: false
                        };
                        
                            fetch('https://button.plgenie.io/v1/api/genbutton_auth_user', {
                                method: "POST",
                                headers: {
                                    "Content-type": "application/json"
                                },
                                body: JSON.stringify({
                                    cod_data: formvalue,
                                    creditcard: result                                   
                                })
                            }).then(res => res.json()).then(res => {
                                console.log(res);
                                if (res.response && res.isInit) {
                                    let data = res.data;
                                    console.log('was authenticated', res);
                                    // window.open(data.transaction.url, "_blank");
                                    document.getElementById("display_on_pay").style.display = "block";
                                    document.getElementById("display_on_pay_iframe").setAttribute("src", data.transaction.url);
                                    document.getElementById('display_init_checkout').style.display = "none";
                                } else {

                                    alert("Sorry we cannot process your payment. ");
                                }
                            }).catch(err => {
                                console.log('Something went wrong!!!');
                            })
                            console.log(result.card);                                           
                    }
                }).catch(errors => {
                    console.log('Catching Errors', errors);
                });
            }
        }

        var eventMethod = window.addEventListener
    ? "addEventListener"
    : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod === "attachEvent"
    ? "onmessage"
    : "message";

eventer(messageEvent, function (e) {    

    if (e.data === "plg" || e.message === "plg")
        window.location.href = '${req.body.redirectURI}';
});

    `,
  });
});

app.post("/api/pushNotification", (req, res) => {
  let clientNotification = _points.clientNotification();
  const payload = {
    to: req.body.to,
    title: req.body.title,
    message: req.body.message,
    url: req.body.url || clientNotification.clientUrl,
    ttl: 36000,
    icon: clientNotification.picture,
    image: clientNotification.picture,
    badge: clientNotification.picture,
    data: "PLG",
    tag: req.body.tag || "New Message",
  };

  mongoose
    .model("User")
    .find(
      { _id: { $in: payload.to }, keys: { $exists: true } },
      (err, subscriptions) => {
        if (err) {
          console.error(`Error occurred while getting subscriptions`);
          res.status(500).json({ error: "Technical error occurred" });
        } else {
          let parallelSubscriptionCalls = subscriptions.map((user) => {
            return new Promise((resolve, reject) => {
              const pushSubscription = {
                endpoint: user.endpoint,
                keys: { p256dh: user.keys.p256dh, auth: user.keys.auth },
              };
              const pushPayload = JSON.stringify(payload);
              const pushOptions = {
                vapidDetails: {
                  subject: clientNotification.url,
                  publicKey: clientNotification.publicKey,
                  privateKey: clientNotification.privateKey,
                },
                TTL: payload.ttl,
                headers: {},
              };
              webPush
                .sendNotification(pushSubscription, pushPayload, pushOptions)
                .then((value) => {
                  resolve({
                    status: true,
                    endpoint: user.endpoint,
                    data: value,
                  });
                })
                .catch((err) => {
                  reject({ status: false, endpoint: user.endpoint, data: err });
                });
            });
          });
          q.allSettled(parallelSubscriptionCalls).then((res) =>
            console.log("Notification Sent!")
          );
          res.json({ data: "Push triggered" });
        }
      }
    );
});

app.get("/api/getGlobalCurrency", (req, res) => {
  res.json(JSON.parse(fs.readFileSync("Global_Currency.json")));
});

// TODO :: Editor Tools Tax Computation
app.get(
  "/api/editor_converter/:usd_amount/:margin/:currency_code",
  (req, res) => {
    // console.log(req.params);
    let currency_code = req.params.currency_code.toUpperCase(),
      usd_amount = parseFloat(req.params.usd_amount),
      margin = parseFloat(req.params.margin),
      currency_list = JSON.parse(fs.readFileSync("Global_Currency.json"));

    // res.json({ original_price: usd_amount, converted_price: parseFloat((usd_amount * currency_list.rates[currency_code]).toFixed(2)), converted_to: "USD to " + currency_code });
    // TAX COMPUTATIONS
    let localCodPrice = 0;
    let localCCtPrice = 0;
    let prod_cost = usd_amount,
      sell_price = 0,
      marginss = margin;
    const sauditax = 0.075,
      commtax = 0.05,
      fulfillment = 2.72,
      taxfree = 0;
    const shsaudi = 18,
      shoman = 27.46,
      shkuwait = 28.63,
      shbahrain = 26.21,
      shegypt = 26.21,
      shuae = 6.5,
      shgen = 15;
    sell_price = prod_cost + marginss + fulfillment;
    const shtaxamnt = sauditax * sell_price,
      alltaxamnt = commtax * sell_price;

    if (currency_code === "SAR") {
      localCodPrice =
        (prod_cost +
          shsaudi +
          shtaxamnt +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shsaudi +
          shtaxamnt +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          9) *
        currency_list.rates[currency_code];
    } else if (currency_code === "OMR") {
      localCodPrice =
        (prod_cost +
          shoman +
          alltaxamnt +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shoman +
          alltaxamnt +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          9) *
        currency_list.rates[currency_code];
    } else if (currency_code === "KWD") {
      localCodPrice =
        (prod_cost +
          shkuwait +
          alltaxamnt +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shkuwait +
          alltaxamnt +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          9) *
        currency_list.rates[currency_code];
    } else if (currency_code === "BHD") {
      localCodPrice =
        (prod_cost +
          shbahrain +
          alltaxamnt +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shbahrain +
          alltaxamnt +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          9) *
        currency_list.rates[currency_code];
    } else if (currency_code === "EGP") {
      localCodPrice =
        (prod_cost +
          shegypt +
          alltaxamnt +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shegypt +
          alltaxamnt +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          9) *
        currency_list.rates[currency_code];
    } else if (currency_code === "AED") {
      localCodPrice =
        (prod_cost +
          shuae +
          alltaxamnt +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shuae +
          alltaxamnt +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          2) *
        currency_list.rates[currency_code];
    } else if (currency_code === "MXN") {
      localCodPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          9) *
        currency_list.rates[currency_code];
    } else if (currency_code === "ILS") {
      localCodPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          9) *
        currency_list.rates[currency_code];
    } else if (currency_code === "CAD") {
      localCodPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          9) *
        currency_list.rates[currency_code];
    } else if (currency_code === "AUD") {
      localCodPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          9) *
        currency_list.rates[currency_code];
    } else if (currency_code === "TWD") {
      localCodPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          9) *
        currency_list.rates[currency_code];
    } else if (currency_code === "HKD") {
      localCodPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          9) *
        currency_list.rates[currency_code];
    } else if (currency_code === "ZAR") {
      localCodPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          9) *
        currency_list.rates[currency_code];
    } else if (currency_code === "EUR") {
      localCodPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          9) *
        currency_list.rates[currency_code];
    } else if (currency_code === "INR") {
      localCodPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          9) *
        currency_list.rates[currency_code];
    } else if (currency_code === "EUR") {
      localCodPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          9) *
        currency_list.rates[currency_code];
    } else if (currency_code === "USD") {
      localCodPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss -
          9) *
        currency_list.rates[currency_code];
    } else {
      localCodPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
      localCCtPrice =
        (prod_cost +
          shgen +
          taxfree +
          sell_price * 0.01 +
          fulfillment +
          marginss) *
        currency_list.rates[currency_code];
    }

    // codsellprice: (prod_cost + shsaudi + shtaxamnt + (sell_price * 0.01) + fulfillment + marginss) * respo.rates.SAR,
    // SAR,OMR,KWD,BHD,EGP,AED,MXN,ILS,CAD,AUD,TWD,HKD,ZAR,EUR,INR,EUR,

    res.json({
      localCodPrice: localCodPrice,
      localCCtPrice: localCCtPrice,
    });
  }
);

// TODO :: Convert to Global Currency
app.get("/api/convert_price/:usd_amount/:currency_code", (req, res) => {
  let currency_code = req.params.currency_code.toUpperCase(),
    usd_amount = parseFloat(req.params.usd_amount),
    currency_list = JSON.parse(fs.readFileSync("Global_Currency.json"));
  res.json({
    original_price: usd_amount,
    converted_price: parseFloat(
      (usd_amount * currency_list.rates[currency_code]).toFixed(2)
    ),
    converted_to: "USD to " + currency_code,
  });
});

app.get("/api/getHomepageSliderContent", (req, res) => {
  res.json([
    "/home/productlistgenie/public_html/74218637_2500349456669516_2476717475631202304_n.jpg",
    "/home/productlistgenie/public_html/81146141_10156555361926786_2216207226429767680_n.jpg",
    "/home/productlistgenie/public_html/82425906_2205825213058878_8377280947174768640_o.jpg",
    "/home/productlistgenie/public_html/DiosnedyPelegrin.jpg",
    "/home/productlistgenie/public_html/EdiKadenic.jpg",
    "/home/productlistgenie/public_html/FernandoARamirez.jpg",
    "/home/productlistgenie/public_html/GregoryArianoff.jpg",
    "/home/productlistgenie/public_html/TraciMarion.jpg",
  ]);
  // _points.customFetch('https://productlistgenie.com/PLG_slider_images/', 'GET', null, result => {
  //     res.json(result);
  // });
});

// app.get('/api/plg_start_restructure', async (req, res) => {
//     const { creator, password } = req.query;
//     if(password && password == "!QAZxsw23e4") {
//         if(creator) {
//             startRestructure(creator);
//             res.json({ message: "Restructuring is now processing for this id:"+creator+", check mongodb compass for progress." })
//         } else {
//             res.json({ message: "User ID is required." });
//         }
//     } else {
//         res.json({ message: "Password required." });
//     }
// });

app.get("/api/plg_update_orders", (req, res) => {
  resyncFulfillerOrder();
  res.sendStatus(200);
});

// TODO :: the isClient params for server.js exportAllFunnelOrders
app.post("/api/exportAllFunnelOrders", (req, res) => {
  function fixExportData(data) {
    var regex = new RegExp("#|,|(\r\n|\r|\n)", "g"),
      replaceBy = " ";
    return data ? data.toString().replace(regex, replaceBy) : data;
  }
  function toTimeZone(time, zone) {
    var format = "YYYY/MM/DD HH:mm:ss ZZ";
    return moment(time, format).tz(zone).format(format);
  }
  function getDate(date) {
    if (typeof date == "string") date = parseInt(date);
    const offset = parseInt(req.query.timezone);
    const convertedDate = date + offset * -1 * 60000;
    const toLocaleDate = moment(convertedDate)
      .format("MMMM DD, YYYY  ddd, h:mm:ss A")
      .toString();

    console.log(
      "✅ Original",
      moment(date).format("MMMM DD, YYYY  ddd, h:mm:ss A").toString()
    );
    console.log(toLocaleDate);
    return toLocaleDate;
  }

  var payload = {
    query:
      "query($plgbuttonID: String, $id: String, $orderid: String, $merchant_type: String, $design_url: String, $has_pod: Boolean, $paid_cc: Boolean, $order_status: String, $funnel_id: String, $funnel_name: String, $domainIndex: Int, $filterByStartDate: String, $filterByEndDate: String, $skip: Int, $limit: Int, $fulfillerLocation: String, $sortBy: String, $variantIDS: String, $serial_numbers: String, $isPaidCommision: Boolean, $cod_analytics: Boolean, $returning_items: Boolean, $show_courier_collected: String) {\n  getMyFunnelOrders(plgbuttonID: $plgbuttonID, id: $id, orderid: $orderid, merchant_type: $merchant_type, paid_cc: $paid_cc, has_pod: $has_pod, design_url: $design_url, order_status: $order_status, funnel_id: $funnel_id, funnel_name: $funnel_name, domainIndex: $domainIndex, filterByStartDate: $filterByStartDate, filterByEndDate: $filterByEndDate, skip: $skip, limit: $limit, fulfillerLocation: $fulfillerLocation, sortBy: $sortBy, variantIDS: $variantIDS, serial_numbers: $serial_numbers, isPaidCommision: $isPaidCommision, cod_analytics: $cod_analytics, returning_items: $returning_items, show_courier_collected: $show_courier_collected) {\n    ids\n    ref_id\n source_link\n  campaign_src\n   creator\n    sync_from\n    orderCreator\n order_date\n  paid_cc\n  has_pod\n design_url\n merchant_type\n    order_status\n    cancel_note\n    currencyWord\n    currencySymbol\n    shipping_information {\n      email\n      name\n      phone\n      street1\n      street2\n      city\n      state\n      zip\n      country\n      aptOffice\n      bldgVilla\n      nearestLandmark\n      __typename\n    }\n    line_items {\n      shopify_order_number\n   shopify_variant_id\n     inventoryName\n      title\n      plg_sku\n      variant\n inventoryDescription\n  quantity\n      description\n ref_track      price\n      convertedPrice\n      plg_itemCost\n      plg_fulfillmentCost\n      plg_affiliateCost\n      plg_yabazoo\n      plg_deliveryCost\n      plg_tax\n      payoutPrice\n      pcost\n     cost_of_goods\n      tracking_number tracking_link\n      __typename\n    }\n    fulfillment_status\n    risk_level\n    test_data\n    raw_data\n    count\n    userData\n    dateStatusDelivered\n    affiliateEmail\n    __typename\n  }\n}\n",
    variables: req.body,
  };
  // console.log(JSON.stringify(payload));
  fetch(_points.clientUrl + "/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((result) => result.json())
    .then((result) => {
      var orderList = result.data.getMyFunnelOrders;
      var rows = (rows = [
        [
          "Ref ID",
          "Shopify Order Number",
          "Shopify Variant ID",
          "Sync From",
          "Campaign Source",
          "PLG Tracking",
          "Tracking Number",
          "Tracking URL",
          "Merchant Type",
          "POD",
          "Design URL",
          "Inventory Name",
          "Product Description",
          "Date",
          "Owner Name",
          "Owner Email",
          "Product",
          "SKU",
          "Variant",
          "Local Price",
          "To be collected",
          "Cost of Goods",
          "Price",
          "Item Cost",
          "Fulfillment Cost",
          "PLG",
          "Affiliate Cost",
          "Delivery Cost",
          "Tax",
          "Quantity",
          "Total Product Cost",
          "Payout",
          "Email",
          "Phone",
          "Shipping Name",
          "Shipping Address1",
          "Shipping City",
          "Shipping Zip",
          "Shipping State/Province",
          "Apartment / Office",
          "Building / Villa",
          "Shipping Nearest Landmark",
          "Shipping Country",
          "Notes",
          "Order Status",
          "Delivered Date",
          "Affiliate Email",
          "Complete Address",
        ],
      ]);

      // ! if (req.query.client && req.query.client === "true") {
      // !    console.log('isClient');
      // !    rows = [["Ref ID", "Sync From", "PLG Tracking", "Tracking Number", "Tracking URL", "Merchant Type", "Inventory Name", "Date", "Owner Name", "Owner Email", "Product", "SKU", "Variant", "Local Price", "Price", "Item Cost", "Tax", "Quantity", "Total Product Cost", "Payout", "Email", "Phone", "Shipping Name", "Shipping Address1", "Shipping City", "Shipping Zip", "Shipping State/Province", "Apartment / Office", "Building / Villa", "Shipping Nearest Landmark", "Shipping Country", "Notes", "Order Status", "Delivered Date", "Affiliate Email", "Complete Address"]];
      // ! } else {
      // !    console.log('else not isClient');
      // !    rows = [["Ref ID", "Sync From", "PLG Tracking", "Tracking Number", "Tracking URL", "Merchant Type", "Inventory Name", "Date", "Owner Name", "Owner Email", "Product", "SKU", "Variant", "Local Price", "Price", "Item Cost", "Fulfillment Cost", "PLG", "Affiliate Cost", "Delivery Cost", "Tax", "Quantity", "Total Product Cost", "Payout", "Email", "Phone", "Shipping Name", "Shipping Address1", "Shipping City", "Shipping Zip", "Shipping State/Province", "Apartment / Office", "Building / Villa", "Shipping Nearest Landmark", "Shipping Country", "Notes", "Order Status", "Delivered Date", "Affiliate Email", "Complete Address"]];
      // ! }

      orderList
        .filter((filt) =>
          req.query.merchant_root === "plg_merchant" ? filt.paid_cc : true
        )
        .forEach((el) => {
          // 36
          let { email, name } = JSON.parse(el.userData);
          let tracking_link =
            el.source_link || "https://plg.productlistgenie.io"; // for default if has sync_from
          if (tracking_link) {
            let url_object = npm_url.parse(tracking_link, true);
            tracking_link = "https://" + url_object.host + "/track/";
          }
          el.line_items.forEach((li, lii) => {
            let isPLGTrackingURL = el.sync_from && tracking_link ? true : false;
            let complete_address; //= _points.iso2toCountryName(_points.iso3toIso2(el.shipping_information.country)) + " | ";
            console.log(li);
            try {
              complete_address =
                _points.iso2toCountryName(
                  _points.iso3toIso2(el.shipping_information.country)
                ) + " | ";
            } catch (error) {
              complete_address = " | ";
            }

            if (el.shipping_information.country == "PHL") {
              if (el.shipping_information.street1)
                complete_address +=
                  "Street: " + el.shipping_information.street1 + " | ";
              if (el.shipping_information.bldgVilla)
                complete_address +=
                  "Barangay: " + el.shipping_information.bldgVilla + " | ";
              if (el.shipping_information.city)
                complete_address +=
                  "Town/City: " + el.shipping_information.city + " | ";
              if (el.shipping_information.state)
                complete_address +=
                  "Province: " + el.shipping_information.state + " | ";
              if (el.shipping_information.zip)
                complete_address += "Zip: " + el.shipping_information.zip;
            } else {
              if (el.shipping_information.street1)
                complete_address +=
                  "Street: " +
                  el.shipping_information.street1 +
                  (el.shipping_information.state ? " | " : "");
              if (el.shipping_information.state)
                complete_address +=
                  "Area: " +
                  el.shipping_information.state +
                  (el.shipping_information.bldgVilla ? " | " : "");
              if (el.shipping_information.bldgVilla)
                complete_address +=
                  "Building: " +
                  el.shipping_information.bldgVilla +
                  (el.shipping_information.aptOffice ? " | " : "");
              if (el.shipping_information.aptOffice)
                complete_address +=
                  "Apartment: " + el.shipping_information.aptOffice;
            }

            // ! if (req.query.client && req.query.client === "true") {
            // !   //  ? If the params in the body is equal to client
            // !   rows.push([
            // !       mongoDBId.encode(el.ids[lii]), // 1
            // !       el.sync_from, // 2
            // !       li.ref_track, // 3
            // !       fixExportData(li.tracking_number), //  4
            // !       isPLGTrackingURL ? tracking_link + (li.ref_track ? li.ref_track : mongoDBId.encode(el.ids[lii])) : li.tracking_link, //5
            // !       el.merchant_type, // 6
            // !       li.inventoryName ? li.inventoryName : "N/A", // 7
            // !       getDate(el.order_date), // 8
            // !       fixExportData(name), // 9
            // !       fixExportData(email), // 10
            // !       fixExportData(li.title), //  11
            // !       fixExportData(li.plg_sku), //  12
            // !       fixExportData(li.variant), //  13
            // !       fixExportData(_points.commafy(li.price ? li.price.toFixed(2) : 0)), // 14
            // !       fixExportData(_points.commafy(li.convertedPrice ? li.convertedPrice.toFixed(2) : 0)), // 15
            // !       fixExportData(_points.commafy(li.plg_itemCost ? li.plg_itemCost.toFixed(2) : 0)), // 16
            // *       fixExportData(_points.commafy(li.plg_tax ? li.plg_tax.toFixed(2) : 0)), // 21
            // !       fixExportData(li.quantity), // 22
            // !       fixExportData(_points.commafy(li.pcost ? li.pcost.toFixed(2) : 0)), // 23
            // !       fixExportData(_points.commafy(li.payoutPrice ? li.payoutPrice.toFixed(2) : 0)), // 24
            // !       fixExportData(el.shipping_information.email), // 25
            // !       fixExportData(el.shipping_information.phone), // 26
            // !       fixExportData(el.shipping_information.name), // 27
            // !       fixExportData(el.shipping_information.street1), // 28
            // !       fixExportData(el.shipping_information.city), // 29
            // !       fixExportData(el.shipping_information.zip), // 30
            // !       fixExportData(el.shipping_information.state), // 31
            // !       fixExportData(el.shipping_information.aptOffice), // 32
            // !       fixExportData(el.shipping_information.bldgVilla), // 33
            // !       fixExportData(el.shipping_information.nearestLandmark), // 34
            // !       fixExportData(el.shipping_information.country), // 35
            // !       fixExportData(el.cancel_note), // 36
            // !       fixExportData(el.order_status), // 37
            // !       el.dateStatusDelivered ? getDate(el.dateStatusDelivered) : "N/A", // 38
            // !       fixExportData(el.affiliateEmail), // 39
            // !       fixExportData(complete_address) // 40
            // !   ])
            // ! } else {
            // ? When req.params is missing
            var creditcardamount = !el.paid_cc
              ? fixExportData(
                  _points.commafy(li.price ? li.price.toFixed(2) : 0)
                )
              : 0;
            rows.push([
              mongoDBId.encode(el.ids[lii]), // 1
              li.shopify_order_number
                ? fixExportData(li.shopify_order_number)
                : "", // 2
              li.shopify_variant_id ? fixExportData(li.shopify_variant_id) : "", // 2
              el.sync_from, // 2
              el.campaign_src,
              li.ref_track, // 3
              fixExportData(li.tracking_number), //  4
              isPLGTrackingURL
                ? tracking_link +
                  (li.ref_track ? li.ref_track : mongoDBId.encode(el.ids[lii]))
                : li.tracking_link, //5
              el.paid_cc != null
                ? el.paid_cc
                  ? "prepaid cc"
                  : el.merchant_type
                : el.merchant_type, // TODO :: Updated merchant data cell in csv 6
              // el.merchant_type,
              el.has_pod != null ? (el.has_pod ? "true" : "false") : "false", //7
              el.design_url != null ? el.design_url : "", // 8
              li.inventoryName ? li.inventoryName : "N/A", // 9
              li.inventoryDescription ? li.inventoryDescription : "N/A",
              getDate(el.order_date), // 11
              fixExportData(name), // 12
              fixExportData(email), // 13
              fixExportData(li.title), // 14
              fixExportData(li.plg_sku), // 15
              fixExportData(li.variant), // 16
              fixExportData(
                _points.commafy(li.price ? li.price.toFixed(2) : 0)
              ), // 14  "Local Price"
              creditcardamount, // 14  "Credit Card Amount"
              fixExportData(
                _points.commafy(
                  li.cost_of_goods ? li.cost_of_goods.toFixed(2) : 0
                )
              ), //  new 15 cost of goods
              fixExportData(
                _points.commafy(
                  li.convertedPrice ? li.convertedPrice.toFixed(2) : 0
                )
              ), // 15
              fixExportData(
                _points.commafy(
                  li.plg_itemCost ? li.plg_itemCost.toFixed(2) : 0
                )
              ), // 16
              fixExportData(
                _points.commafy(
                  li.plg_fulfillmentCost ? li.plg_fulfillmentCost.toFixed(2) : 0
                )
              ), // ? 17
              fixExportData(
                _points.commafy(li.plg_yabazoo ? li.plg_yabazoo.toFixed(2) : 0)
              ), // ? 18
              fixExportData(
                _points.commafy(
                  li.plg_affiliateCost ? li.plg_affiliateCost.toFixed(2) : 0
                )
              ), // ? 19
              fixExportData(
                _points.commafy(
                  li.plg_deliveryCost ? li.plg_deliveryCost.toFixed(2) : 0
                )
              ), // ? 20
              fixExportData(
                _points.commafy(li.plg_tax ? li.plg_tax.toFixed(2) : 0)
              ), // 21
              fixExportData(li.quantity), // 22
              fixExportData(
                _points.commafy(li.pcost ? li.pcost.toFixed(2) : 0)
              ), // 23
              fixExportData(
                _points.commafy(li.payoutPrice ? li.payoutPrice.toFixed(2) : 0)
              ), // 24
              fixExportData(el.shipping_information.email), // 25
              fixExportData(el.shipping_information.phone), // 26
              fixExportData(el.shipping_information.name), // 27
              fixExportData(el.shipping_information.street1), // 28
              fixExportData(el.shipping_information.city), // 29
              fixExportData(el.shipping_information.zip), // 30
              fixExportData(el.shipping_information.state), // 31
              fixExportData(el.shipping_information.aptOffice), // 32
              fixExportData(el.shipping_information.bldgVilla), // 33
              fixExportData(el.shipping_information.nearestLandmark), // 34
              fixExportData(el.shipping_information.country), // 35
              fixExportData(el.cancel_note), // 36
              fixExportData(el.order_status), // 37
              el.dateStatusDelivered ? getDate(el.dateStatusDelivered) : "N/A", // 38
              fixExportData(el.affiliateEmail), // 39
              fixExportData(complete_address), // 40
            ]);
            // ! }
          });
        });

      if (req.body.export_mode == "csv") {
        let csvContent = "data:text/csv;charset=utf-8,";
        rows.forEach(function (rowArray) {
          rowArray = rowArray.map((el) => {
            if (el) return el.toString().replace(/\,/g, " ");
            else return el;
          });
          let row = rowArray.join(",");
          csvContent += row + "\r\n";
        });

        res.json({ status: "success", uri: encodeURI(csvContent) });
      } else if (req.body.export_mode == "excel") {
        res.json({ status: "success", uri: rows });
      } else {
        res.json({ status: "error", uri: "Invalid export mode" });
      }
    })
    .catch((err) => {
      console.log("Server Export Error ==>", err);
      res.json({ status: "error", uri: err });
    });
});

app.post("/api/sendMessage", (req, res) => {
  let payload = {
    query:
      "mutation($sender_id: String!, $receiver_id: String, $message: String, $from_mobile: Boolean){ sendMessage(sender_id: $sender_id, receiver_id: $receiver_id, message: $message, from_mobile: $from_mobile){ id } }",
    variables: {
      sender_id: req.body.sender_id,
      receiver_id: req.body.reciever_id,
      message: req.body.message_content,
      from_mobile: true,
    },
  };
  _points.customFetch(
    _points.clientUrl + "/graphql",
    "POST",
    payload,
    () => {}
  );
  res.sendStatus(200);
});

app.post("/api/exportDataToCSV", (req, res) => {
  const whatToExport = req.body.export;
  delete req.body.export;
  const responseData = { status: "error", uri: null, message: "" };
  if (whatToExport == "funnel_products") {
    getFunnelProducts(req.body).then((result) => {
      const rows = [
        [
          "Variant ID",
          "Product Name",
          "Description",
          "Active Affiliate",
          "_BLANK_",
          "Quantity",
          "Cost Per Item",
          "Total Product Cost",
          "Product SRP",
          "VAT",
          "Delivery Cost",
          "Fulfillment Cost",
          "Affiliate Cost",
          "Yabazoo",
        ],
      ];
      result.forEach((el) => {
        rows.push([
          mongoDBId.encode(el.id),
          el.productName,
          el.productSku,
          el.affiliateEmail,
          "",
          el.quantity,
          el.productCost,
          el.productCost * el.quantity,
          el.productSrp,
          el.productFivePercentDuty + "%",
          el.productDeliveryCost,
          el.fulfillmentCost,
          el.affiliateCost,
          el.yabazoo,
        ]);
      });
      toCSV(rows);
    });
  } else if (whatToExport == "funnel_orders") {
    getBuyerList(req.body)
      .then((result) => {
        let rows = [];
        if (req.body.display && req.body.display == "top_10_products") {
          // kapag show top 5 products
          rows.push([
            "",
            "Product Name",
            "Description",
            "Total Orders",
            "Total Sales",
            "Rate (sales / orders * 100)",
            "Links",
          ]);
          result.forEach((el, i) => {
            rows.push([
              i + 1,
              el.productName,
              el.description,
              el.count,
              el.sales,
              ((el.sales / el.count) * 100).toFixed(2),
              [...new Set(el.source_link)].toString().replace(/,/g, " | "),
            ]);
          });
        } else if (
          req.body.display &&
          req.body.display.includes("top_clients_")
        ) {
          // what are the top 3 clients are selling (in terms of amount of orders & count)
          rows.push([
            "",
            "Product Name: " + result.productName,
            "Total Orders: " + result.count,
          ]);
          rows.push(["", "Client Email", "Client Name"]);
          result.creators.forEach((el, i) => {
            rows.push([i + 1, el.email, el.name]);
          });
        } else {
          // kapag buyer
          if (
            req.body.display &&
            req.body.display.includes("buyers_product_top_")
          ) {
            // kapag top buyer sa products add only header
            let top_count = req.body.display.split("_"),
              time = req.body.date;
            if (typeof time == "number") time += " Days";
            else time = time.replace(/_/g, " ");
            top_count = top_count[top_count.length - 1];
            rows.push([
              "",
              _points.capitalizeWord(time) +
                " Top " +
                top_count +
                " Product Buyers",
              "",
              "",
              "Product Name: " + result.top_product.name,
              "",
              "",
              "",
              "Total Orders: " + result.top_product.count,
              "",
            ]);
            result = result.result;
          }

          rows.push([
            "",
            "Email",
            "Name",
            "Phone",
            "Street",
            "City",
            "State",
            "Zip",
            "Country",
            "Links",
          ]);
          result.forEach((el, i) => {
            rows.push([
              i + 1,
              el.shipping_information.email,
              el.shipping_information.name,
              el.shipping_information.phone || "N/A",
              el.shipping_information.street1,
              el.shipping_information.city,
              el.shipping_information.state,
              el.shipping_information.zip,
              el.shipping_information.country,
              [...new Set(el.source_link)].toString().replace(/,/g, " | "),
            ]);
          });
        }
        toCSV(rows);
      })
      .catch((err) => {
        responseData.message = err.message;
        res.json(responseData);
      });
  } else if (whatToExport == "admin_cod_payouts") {
    let rows = [["", "Name", "Email", "Delivered Payout", "Collected Payout"]];
    let payload = {
      query: `
                query($userEmail: String, $fulfillerLocation: String, $dateStart: String, $dateEnd: String, $page: Int, $limit: Int, $show_vip: Boolean) {
                    getMyFunnelOrderCreatorList(userEmail: $userEmail, fulfillerLocation: $fulfillerLocation, dateStart: $dateStart, dateEnd: $dateEnd, page: $page, limit: $limit, show_vip: $show_vip) {
                        count
                        creator
                        userData
                    }
                }
            `,
      variables: req.body,
    };
    _points.customFetch(
      _points.clientUrl + "/graphql",
      "POST",
      payload,
      async (result) => {
        if (result && result.data.getMyFunnelOrderCreatorList) {
          const datas = result.data.getMyFunnelOrderCreatorList;
          for (let i = 0; i < datas.length; i++) {
            let data = datas[i],
              user_data = JSON.parse(data.userData),
              payload2 = {
                query: `
                                query($creator: String, $userPrivilege: Int, $fulfillerLocation: String, $order_status: String, $dateStart: String, $dateEnd: String, $isAdminPayout: Boolean, $isAdminPayoutCollectedRange: Boolean){
                                    getMyPayCheck(creator: $creator, userPrivilege: $userPrivilege, fulfillerLocation: $fulfillerLocation, order_status: $order_status, dateStart: $dateStart, dateEnd: $dateEnd, isAdminPayout: $isAdminPayout, isAdminPayoutCollectedRange: $isAdminPayoutCollectedRange){ count }
                                }
                            `,
                variables: {
                  creator: data.creator,
                  fulfillerLocation: req.body.fulfillerLocation,
                  dateStart: req.body.dateStart,
                  dateEnd: req.body.dateEnd,
                },
              },
              payload3 = {
                query: `
                                query($creator: String, $userPrivilege: Int, $fulfillerLocation: String, $order_status: String, $dateStart: String, $dateEnd: String, $isAdminPayout: Boolean, $isAdminPayoutCollectedRange: Boolean){
                                    getMyPayCheck(creator: $creator, userPrivilege: $userPrivilege, fulfillerLocation: $fulfillerLocation, order_status: $order_status, dateStart: $dateStart, dateEnd: $dateEnd, isAdminPayout: $isAdminPayout, isAdminPayoutCollectedRange: $isAdminPayoutCollectedRange){ count }
                                }
                            `,
                variables: {
                  creator: data.creator,
                  fulfillerLocation: req.body.fulfillerLocation,
                  dateStart: req.body.dateStart,
                  dateEnd: req.body.dateEnd,
                  isAdminPayout: true,
                },
              };
            let data2 = await new Promise((resolve) => {
              _points.customFetch(
                _points.clientUrl + "/graphql",
                "POST",
                payload2,
                (result2) => {
                  resolve(result2.data.getMyPayCheck);
                }
              );
            });
            let data3 = await new Promise((resolve) => {
              _points.customFetch(
                _points.clientUrl + "/graphql",
                "POST",
                payload3,
                (result3) => {
                  resolve(result3.data.getMyPayCheck);
                }
              );
            });
            rows.push([
              i + 1,
              user_data.name,
              user_data.email,
              data2.count.toFixed(2),
              data3.count.toFixed(2),
            ]);
          }
          toCSV(rows);
        } else {
          res.json(responseData);
        }
      }
    );
  } else if (whatToExport == "admin_cod_commissions") {
    let rows = [["", "Name", "Email", "Total Commission"]];
    let payload = {
      query: `
                query($userEmail: String, $fulfillerLocation: String, $dateStart: String, $dateEnd: String, $page: Int) {
                    getMyCommissionCreatorList(userEmail: $userEmail, fulfillerLocation: $fulfillerLocation, dateStart: $dateStart, dateEnd: $dateEnd, page: $page) {
                        count
                        totalPayout
                        creator
                        userData
                    }
                }
            `,
      variables: req.body,
    };
    _points.customFetch(
      _points.clientUrl + "/graphql",
      "POST",
      payload,
      async (result) => {
        if (result && result.data.getMyCommissionCreatorList) {
          const datas = result.data.getMyCommissionCreatorList;
          for (let i = 0; i < datas.length; i++) {
            let data = datas[i],
              user_data = JSON.parse(data.userData);
            rows.push([
              i + 1,
              user_data.name,
              user_data.email,
              user_data.commission,
            ]);
          }
          toCSV(rows);
        } else {
          res.json(responseData);
        }
      }
    );
  } else {
    res.json(responseData);
  }

  function toCSV(rows) {
    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(function (rowArray) {
      rowArray = rowArray.map((el) => {
        return _points.serializeExportData(el).replace(/\,/g, " ");
      });
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
    });

    responseData.status = "success";
    responseData.uri = encodeURI(csvContent);
    res.json(responseData);
  }
});

app.post("/api/zapier", (req, res) => {
  mongoose
    .model("User")
    .findOne({ email: req.body.email })
    .then(async (result) => {
      if (result) {
        let isValidPassword = await bcrypt.compare(
          req.body.password,
          result.password
        );
        if (isValidPassword) {
          // TODO :: zapier affliates

          var payload = {
            query: `{ everyLeadsbyCreator(creatorID: "${result.id}" ){ id\n firstName\n domain\n affiliateEmail\n affiliateID\n data\n notes\n affiliateTitle\n lastName\n date\n country\n email\n phone\n tags\n id\n } }`,
          };
          fetch("https://stats.productlistgenie.io/graphql/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
            .then((resp) => resp.json())
            .then((resp) => {
              // resp.data.everyLeadsbyCreator.date = new Date(resp.data.everyLeadsbyCreator.date).toISOString();
              // res.json(resp)
              res.json(
                resp.data.everyLeadsbyCreator
                  .map((e) => {
                    return {
                      ...e,
                      date: e.date
                        ? new Date(parseInt(e.date))
                            .toISOString()
                            .replace(/.\d+Z$/g, "Z")
                        : "",
                    };
                  })
                  .filter(
                    (e) =>
                      e.email != "" &&
                      e.email != null &&
                      e.firstName != null &&
                      e.firstName != ""
                  )
              );
            })
            .catch((e) => {
              console.log("Error has occured in zapier api ", e);
              res.json({
                response: false,
                message: "Error has occur.",
              });
            });
        } else {
          res.json({
            response: false,
            message: "Error has occur.",
          });
        }
      } else {
        res.json({
          response: false,
          message: "Error has occur.",
        });
      }
    });
});

app.post("/api/signin_zapier", (req, res) => {
  mongoose
    .model("User")
    .findOne({ email: req.body.email })
    .then(async (result) => {
      if (result) {
        let isValidPassword = await bcrypt.compare(
          req.body.password,
          result.password
        );
        if (isValidPassword) {
          let img_url = result.profileImage
            ? _points.clientUrl + "/user-uploads/" + result.profileImage
            : _points.clientUrl +
              "/assets/graphics/abstract_patterns/texture.jpg";
          var payload = {
            query:
              '{ getFunnelList(creator: "' +
              result.id +
              '", limit: ' +
              (req.body.limit ? req.body.limit : 0) +
              ", page: " +
              (req.body.page ? req.body.page : 0) +
              ") { id domain_name funnel_name funnel_type funnel_phone funnel_is_phone_whatsapp funnel_email funnel_address page_count } }",
            variables: null,
            operationName: null,
          };
          fetch(_points.clientUrl + "/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
            .then((resopo) => resopo.json())
            .then((resopo) => {
              res.send({
                creator: result.id,
                privilege: result.privilege,
                img_url: img_url,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                funnelGenieLists: resopo.data.getFunnelList
                  ? resopo.data.getFunnelList
                  : [],
                kartra_email: result.kartra,
                funnel_genie_domains: result.funnel_genie_domains,
                notification: result.notification,
                funnels: result.getUserFunnelGenie
                  ? result.getUserFunnelGenie
                  : [],
              });
            })
            .catch((err) => {
              res.send({
                creator: null,
                error_message: "An Error Occured Please try again. ",
              });
            });
        } else {
          res.send({ creator: null, error_message: "Invalid Password" });
        }
      } else {
        res.send({ creator: null, error_message: "User Not Found" });
      }
    });
});
// TODO :: APP SIGNIN API
app.post("/api/signin", (req, res) => {
  mongoose
    .model("User")
    .findOne({ email: req.body.email })
    .then(async (result) => {
      if (result) {
        let isValidPassword = await bcrypt.compare(
          req.body.password,
          result.password
        );
        if (isValidPassword) {
          let img_url = result.profileImage
            ? _points.clientUrl + "/user-uploads/" + result.profileImage
            : _points.clientUrl +
              "/assets/graphics/abstract_patterns/texture.jpg";
          res.send({
            creator: result.id,
            privilege: result.privilege,
            img_url: img_url,
            firstName: result.firstName,
            lastName: result.lastName,
            dealerId: result.dealerId,
            referralId: result.referralId,
            dealerName: result.dealerName,
            access_tags: result.access_tags,
            email: result.email,
            masterIds: result.masterIds,
            staffIds: result.staffIds,
            city: result.city,
            zip: result.zip,
            state: result.state,
            kartra_email: result.kartra,
            funnel_genie_domains: result.funnel_genie_domains,
            notification: result.notification,
            funnels: result.getUserFunnelGenie ? result.getUserFunnelGenie : [],
          });
        } else {
          res.send({ creator: null, error_message: "Invalid Password" });
        }
      } else {
        res.send({ creator: null, error_message: "User Not Found" });
      }
    });
});

app.post("/api/getUserById", (req, res) => {
  if (!req.body.id) {
    res.send({ status: "error", message: "Id is required", creator: null });
  }
  mongoose
    .model("User")
    .findById({ _id: req.body.id })
    .then(async (result) => {
      if (result) {
        // mongoose.model('FunnelGenie')

        var img_url = result.profileImage
          ? _points.clientUrl + "/user-uploads/" + result.profileImage
          : _points.clientUrl +
            "/assets/graphics/abstract_patterns/texture.jpg";
        res.send({
          status: "success",
          creator: result.id,
          privilege: result.privilege,
          img_url: img_url,
          firstName: result.firstName,
          access_tags: result.access_tags,
          lastName: result.lastName,
          email: result.email,
          kartra_email: result.kartra,
          funnel_genie_domains: result.funnel_genie_domains,
          notification: result.notification.map((e) => e.message),
        });
      } else {
        res.send({ status: "error", message: "User Not Found", creator: null });
      }
    });
});

// Start Funnel Data
app.post("/api/getFunnels", (req, res) => {
  var payload = {
    query:
      '{\n  getUserFunnelGenie(id: "' +
      req.body.creator +
      '") {\n    ids funnel_object { funnel_name domainIndex } funnel_type funnel_phone funnel_isWhatsApp funnel_email funnel_address count\n  }\n}\n',
    variables: null,
    operationName: null,
  };
  fetch(_points.clientUrl + "/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((result) => result.json())
    .then((result) => {
      res.json({
        status: "success",
        message: "",
        data: result.data.getUserFunnelGenie
          ? result.data.getUserFunnelGenie
          : [],
      });
    })
    .catch((err) => {
      res.json({ status: "error", message: err, data: [] });
    });
});

app.post("/api/validatePhone", (req, res) => {
  const client = require("twilio")(
    "AC5d86a786895c60096bd28ed03b322808",
    "798e727894ec4b7f992a9c94c254b72c"
  );
  client.lookups
    .phoneNumbers(req.body.phone)
    .fetch()
    .then((result) => {
      res.send({ status: "success", result });
    })
    .catch((err) => {
      res.send({ status: "error", result: err });
    });
});

app.post("/api/getFunnels/v2", (req, res) => {
  var payload = {
    query:
      '{ getFunnelList(creator: "' +
      req.body.creator +
      '", limit: ' +
      (req.body.limit ? req.body.limit : 0) +
      ", page: " +
      (req.body.page ? req.body.page : 0) +
      ") { id domain_name funnel_name funnel_type funnel_phone funnel_is_phone_whatsapp funnel_email funnel_address page_count } }",
    variables: null,
    operationName: null,
  };
  fetch(_points.clientUrl + "/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((result) => result.json())
    .then((result) => {
      res.json({
        status: "success",
        message: "",
        data: result.data.getFunnelList ? result.data.getFunnelList : [],
      });
    })
    .catch((err) => {
      res.json({ status: "error", message: err, data: [] });
    });
});

app.post("/api/getMyFunnelOrderTotalSales", (req, res) => {
  console.log("GALING SA APP ==>", req.body.dateFrom, "-", req.body.dateTo);
  var payload = {
    query:
      '{\n  getMyFunnelOrderTotalSales(creator: "' +
      req.body.creator +
      '", page_ids: "' +
      req.body.page_ids +
      '", dateFrom: "' +
      req.body.dateFrom +
      '", dateTo: "' +
      req.body.dateTo +
      '", merchant_type: "' +
      req.body.merchant_type +
      '") {\n    count count_order total_cod  }\n}\n',
    variables: null,
    operationName: null,
  };
  fetch(_points.clientUrl + "/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((result) => result.json())
    .then((result) => {
      res.json({
        status: "success",
        message: "",
        data: result.data.getMyFunnelOrderTotalSales
          ? result.data.getMyFunnelOrderTotalSales
          : {},
      });
    })
    .catch((err) => {
      res.json({ status: "error", message: err, data: {} });
    });
});

app.post("/api/getMyFunnelOrders", (req, res) => {
  if (req.body.order_status && _points.isArray(req.body.order_status))
    req.body.order_status = req.body.order_status.toString();
  let payload = {
    query:
      "query($id: String, $orderid: String, $merchant_type: String, $order_status: String, $funnel_id: String, $funnel_name: String, $domainIndex: Int, $filterByStartDate: String, $filterByEndDate: String, $skip: Int, $limit: Int, $fulfillerLocation: String, $sortBy: String, $variantIDS: String, $serial_numbers: String, $isPaidCommision: Boolean, $cod_analytics: Boolean, $returning_items: Boolean, $show_courier_collected: String) {\n  getMyFunnelOrders(id: $id, orderid: $orderid, merchant_type: $merchant_type, order_status: $order_status, funnel_id: $funnel_id, funnel_name: $funnel_name, domainIndex: $domainIndex, filterByStartDate: $filterByStartDate, filterByEndDate: $filterByEndDate, skip: $skip, limit: $limit, fulfillerLocation: $fulfillerLocation, sortBy: $sortBy, variantIDS: $variantIDS, serial_numbers: $serial_numbers, isPaidCommision: $isPaidCommision, cod_analytics: $cod_analytics, returning_items: $returning_items, show_courier_collected: $show_courier_collected) {\n    ids\n    ref_id\n source_link    creator\n    \nsync_from    orderCreator\n    order_date\n    merchant_type\n    order_status\n    cancel_note\n    currencyWord\n    currencySymbol\n    shipping_information {\n      email\n      name\n      phone\n      street1\n      street2\n      city\n      state\n      zip\n      country\n      __typename\n    }\n    line_items {\n      shopify_order_number\n      inventoryName\n      title\n      variant\n      quantity\n      description\n ref_track      price\n      convertedPrice\n      plg_itemCost\n      plg_fulfillmentCost\n      plg_affiliateCost\n      plg_yabazoo\n      plg_deliveryCost\n      plg_tax\n      payoutPrice\n      pcost\n      tracking_number tracking_link\n      __typename\n    }\n    fulfillment_status\n    risk_level\n    test_data\n    raw_data\n    count\n    userData\n    dateStatusDelivered\n    affiliateEmail\n    __typename\n  }\n}\n",
    variables: req.body,
  };
  fetch(_points.clientUrl + "/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((result) => result.json())
    .then((result) => {
      let data = result.data ? result.data.getMyFunnelOrders : [];
      data = data.map((e) => {
        e.id = e.ids;
        return e;
      });
      res.json({ status: "success", message: "", data });
    })
    .catch((err) => {
      res.json({ status: "error", message: err.message, data: [] });
    });
});
// End Funnel Data

app.get("/api/getTrainingList", (req, res) => {
  mongoose
    .model("Admin")
    .findOne()
    .lean()
    .then(async (result) => res.json({ status: "success", data: result }))
    .catch((err) => res.json({ status: "error" }));
});

app.get("/api/getTrainingPageList/:training_id", (req, res) => {
  mongoose
    .model("CustomPage")
    .find({ creator: req.params.training_id })
    .lean()
    .then(async (result) => res.json({ status: "success", data: result }))
    .catch((err) =>
      res.json({ status: "error", message: "Please try again." })
    );
});

app.get("/api/getTrainingPageById/:page_id", (req, res) => {
  mongoose
    .model("CustomPage")
    .findById({ _id: req.params.page_id })
    .lean()
    .then(async (result) => res.json({ status: "success", data: result }))
    .catch((err) =>
      res.json({ status: "error", message: "Please try again." })
    );
});

app.get("/api/getTotalFunnelOrder", (req, res) => {
  let query = req.query;
  if (query.creator) query.creator = mongoose.Types.ObjectId(query.creator);
  getTotalFunnelOrder(query).then((result) => {
    res.json({ total: result });
  });
});

// start plg new tracking by ref
app.get("/api/getPLGTracking/:ref", (req, res) => {
  // let varQ = { skip: 0 };
  // if(req.params.ref.includes("PLG-")) varQ.ref_track = req.params.ref;
  // else varQ.orderid = req.params.ref;
  var payload = {
    query: `
            query($orderid: String, $skip: Int, $ref_track: String) {
                getMyFunnelOrders(orderid: $orderid, skip: $skip, ref_track: $ref_track) {
                    ids
                    order_date
                    order_status_update
                    order_status
                    source_link
                    fulfill_with_plg
                    cancel_note
                    currencyWord
                    currencySymbol
                    sync_from
                    shipping_information {
                        email
                        name
                        phone
                        street1
                        street2
                        city
                        state
                        zip
                        country
                        address_type
                        aptOffice
                        bldgVilla
                        nearestLandmark
                    }
                    line_items {
                        title
                        variant
                        quantity
                        plg_sku
                        plg_serialNumber
                        description
                        price
                        convertedPrice
                        tracking_number
                    }
                }
            }
        `,
    variables: { orderid: req.params.ref, ref_track: req.params.ref, skip: 0 },
  };
  _points.customFetch(
    _points.clientUrl + "/graphql",
    "POST",
    payload,
    (result) => {
      if (result && result.data.getMyFunnelOrders) {
        let message =
          result.data.getMyFunnelOrders.length === 0 ? "Not Found" : "Success";
        let arrayToObject =
          result.data.getMyFunnelOrders.length != 0
            ? result.data.getMyFunnelOrders.reduce((e) => e)
            : [];
        let has_tracking_number =
          arrayToObject.length != 0
            ? arrayToObject.line_items.filter((e) => e.tracking_number)
                .length != 0
              ? true
              : false
            : false;
        res.json({
          status: "success",
          message,
          data: {
            searchedRef: req.params.ref,
            ...arrayToObject,
            sync_from: has_tracking_number ? arrayToObject.sync_from : "",
          },
        });
      } else {
        res.json({ status: "error", message: "Not Found" });
      }
    }
  );
});
// end plg new tracking by ref

// start order metrics
app.post("/api/getMyPayout", (req, res) => {
  var payload = {
    query: `
            query($creator: String, $userPrivilege: Int, $fulfillerLocation: String, $order_status: String, $dateStart: String, $dateEnd: String, $isAdminPayout: Boolean, $isAdminPayoutCollectedRange: Boolean){
                getMyPayCheck(creator: $creator, userPrivilege: $userPrivilege, fulfillerLocation: $fulfillerLocation, order_status: $order_status, dateStart: $dateStart, dateEnd: $dateEnd, isAdminPayout: $isAdminPayout, isAdminPayoutCollectedRange: $isAdminPayoutCollectedRange){
                    count
                }
            }
        `,
    variables: req.body,
  };
  _points.customFetch(
    _points.clientUrl + "/graphql",
    "POST",
    payload,
    (result) => {
      if (result) {
        res.json({
          status: "success",
          message: "Success",
          payout: result.data.getMyPayCheck.count,
        });
      } else {
        res.json({
          status: "error",
          message:
            "An error has occurred. Please try again or check your parameters.",
        });
      }
    }
  );
});
app.post("/api/getOrderMetrics", (req, res) => {
  var payload = {
    query: `
            query($creator: String, $funnel_id: String, $merchant_type: String, $dateStart: String, $dateEnd: String, $location: String) {
                getOrderMetrics(creator: $creator, funnel_id: $funnel_id, merchant_type: $merchant_type, dateStart: $dateStart, dateEnd: $dateEnd, location: $location) {
                    jsonStr
                }
            }
        `,
    variables: req.body,
  };
  _points.customFetch(
    _points.clientUrl + "/graphql",
    "POST",
    payload,
    (result) => {
      if (result && result.data.getOrderMetrics) {
        res.json({
          status: "success",
          message: "Success",
          data: JSON.parse(result.data.getOrderMetrics.jsonStr),
        });
      } else {
        res.json({
          status: "error",
          message:
            "An error has occurred. Please try again or check your parameters.",
        });
      }
    }
  );
});
app.post("/api/getOrderSalesOverTime", (req, res) => {
  var payload = {
    query: `
            query($creator: String!, $page_ids: String, $dateFrom: String, $dateTo: String, $merchant_type: String){
                getMyFunnelOrderTotalSales(creator: $creator, page_ids: $page_ids, dateFrom: $dateFrom, dateTo: $dateTo, merchant_type: $merchant_type){
                    dates {
                        count
                        date
                    }
                }
            }
        `,
    variables: req.body,
  };
  _points.customFetch(
    _points.clientUrl + "/graphql",
    "POST",
    payload,
    (result) => {
      if (result && result.data.getMyFunnelOrderTotalSales) {
        res.json({
          status: "success",
          message: "Success",
          data: result.data.getMyFunnelOrderTotalSales,
        });
      } else {
        res.json({
          status: "error",
          message:
            "An error has occurred. Please try again or check your parameters.",
        });
      }
    }
  );
});
app.post("/api/getOrdersOverTime", (req, res) => {
  var payload = {
    query: `
            query($creator: String!, $page_ids: String, $dateFrom: String, $dateTo: String, $merchant_type: String){
                getMyFunnelOrderTotalSales(creator: $creator, page_ids: $page_ids, dateFrom: $dateFrom, dateTo: $dateTo, merchant_type: $merchant_type){
                    dates {
                        count_order
                        date
                    }
                }
            }
        `,
    variables: req.body,
  };
  _points.customFetch(
    _points.clientUrl + "/graphql",
    "POST",
    payload,
    (result) => {
      if (result && result.data.getMyFunnelOrderTotalSales) {
        res.json({
          status: "success",
          message: "Success",
          data: result.data.getMyFunnelOrderTotalSales,
        });
      } else {
        res.json({
          status: "error",
          message:
            "An error has occurred. Please try again or check your parameters.",
        });
      }
    }
  );
});
app.post("/api/getTopProducts", (req, res) => {
  var payload = {
    query: `
            query($creator: String!, $page_ids: String, $dateFrom: String, $dateTo: String, $merchant_type: String){
                getTopProducts(creator: $creator, page_ids: $page_ids, dateFrom: $dateFrom, dateTo: $dateTo, merchant_type: $merchant_type){
                    jsonStr
                }
            }
        `,
    variables: req.body,
  };
  _points.customFetch(
    _points.clientUrl + "/graphql",
    "POST",
    payload,
    (result) => {
      if (result && result.data.getTopProducts) {
        res.json({
          status: "success",
          message: "Success",
          data: JSON.parse(result.data.getTopProducts.jsonStr),
        });
      } else {
        res.json({
          status: "error",
          message:
            "An error has occurred. Please try again or check your parameters.",
        });
      }
    }
  );
});
// end order metrics

// start shopify admin search
app.post("/api/save-product-metafields", (req, res) => {
  var queryStr = {
    query: `mutation($input: ProductInput!) {
            productUpdate(input: $input) {
                product {
                    metafields(first: 100) {
                        edges {
                            node {
                                id
                                namespace
                                key
                                value
                            }
                        }
                    }
                }
            }
        }`,
    variables: req.body,
  };
  fetch("https://dailyproductplacement.myshopify.com/admin/api/graphql.json?", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": dppToken,
    },
    body: JSON.stringify(queryStr),
  })
    .then((response) => response.json())
    .then((response) => {
      res.send(response);
    });
});

app.get("/api/get-collection-products", async (req, res) => {
  var { tags, excludeTags, after, limit } = req.query;
  if (after) after = ' after: "' + after + '",';
  else after = "";
  if (!excludeTags) excludeTags = "";
  if (!tags) tags = "cod,cod_test";
  if (!limit) limit = 24;
  else {
    if (req.query.tags) tags = tags.replace(/\,/, " AND ");
    else tags = tags.replace(/\,/, " OR ");
    var queryStr = `{
            products(query: "tag:${tags}${excludeTags} AND published_status:published", first: ${limit},${after} reverse: true) {
                edges {
                    node {
                        id
                        title
                        handle
                        tags
                        createdAt
                        publishedAt
                        updatedAt
                        variants(first:1) {
                            edges {
                                node {
                                    price
                                }
                            }
                        }
                        images(first: 1) {
                            edges {
                                node {
                                    originalSrc
                                }
                            }
                        }
                    }
                    cursor
                }
            }
        }`;
    console.log(queryStr);
    fetch(
      "https://dailyproductplacement.myshopify.com/admin/api/2019-10/graphql.json?",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/graphql",
          "X-Shopify-Access-Token": dppToken,
        },
        body: queryStr,
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.errors) throw new Error(response.errors[0].message);
        var refactor = [];
        response.data.products.edges.forEach((data) => {
          refactor.push({
            id: parseInt(data.node.id.replace("gid://shopify/Product/", "")),
            title: data.node.title,
            handle: data.node.handle,
            published_at: data.node.updatedAt,
            created_at: data.node.createdAt,
            updated_at: data.node.updatedAt,
            tags: data.node.tags,
            variants: [{ price: data.node.variants.edges[0].node.price }],
            images: [{ src: data.node.images.edges[0].node.originalSrc }],
            cursor: data.cursor,
          });
        });
        res.json({ status: 200, data: refactor });
      })
      .catch((err) => {
        res.json({ status: 400, message: err });
      });
  }
});

app.get("/api/get-collection-products-count/:collection_id", (req, res) => {
  fetch(
    "https://dailyproductplacement.myshopify.com/admin/api/2019-10/products/count.json?collection_id=" +
      req.params.collection_id +
      "&published_status=published",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": dppToken,
      },
    }
  )
    .then((response) => response.json())
    .then((response) => {
      console.log("count => ", response);
      res.json(response);
    });
});

app.post("/api/get-product-metafields", (req, res) => {
  var queryStr = `{
        product(id: "gid://shopify/Product/${req.body.productID}") {
            priceRange{minVariantPrice{amount}, maxVariantPrice{amount}}
                totalVariants
                metafields(first:25){
                    edges {
                        node {
                            id
                            key
                            value
                        }
                    }
                }
            }
        }`;
  fetch("https://dailyproductplacement.myshopify.com/admin/api/graphql.json?", {
    method: "POST",
    headers: {
      "Content-Type": "application/graphql",
      "X-Shopify-Access-Token": dppToken,
    },
    body: queryStr,
  })
    .then((response) => response.json())
    .then((response) => {
      res.send(response);
    });
});

// TODO: Add read_inventory in the shopify app
// inventoryItem {
//     unitCost {
//         amount
//         currencyCode
//     }
// }

function everFlowPost(qq, pp, ss) {
  const orderID = ss.replace("#", "");
  axios
    .get(
      "https://www.tb42trk.com/sdk/conversion?" +
        qq +
        ss.replace("#", "") +
        "&order_id=" +
        ss.replace("#", ""),
      {
        headers: {
          accept: "application/json",
          "accept-language": "en,en-US;q=0.9",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "sec-ch-ua":
            '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
        },
        referrer: `https://${pp}/`,
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    )
    .then((res) =>
      console.log(
        res.data,
        "https://www.tb42trk.com/sdk/conversion?" +
          qq +
          ss.replace("#", "") +
          "&order_id=" +
          ss.replace("#", "")
      )
    );
}

app.post("/api/admin-get-product", (req, res) => {
  var queryStr = `{
            product(id: "${req.body.productid}") {
            variants(first: 50){
                edges {
                    node {
                        id
                        title
                        price
                        compareAtPrice
                        
                        selectedOptions {
                            value
                            name
                        }
                    }
                }
            }
        }
    }`;
  fetch("https://" + req.body.storeUrl + "/admin/api/graphql.json?", {
    method: "POST",
    headers: {
      "Content-Type": "application/graphql",
      "X-Shopify-Access-Token": decodeBtoa(req.body.storeToken),
    },
    body: queryStr,
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      res.send(response);
    });
});

app.post("/api/resyncToShopify", (req, res) => {
  console.log(req.body);
  fetch("https://" + req.body.url + "/admin/orders.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": decodeBtoa(req.body.token),
    },
    body: JSON.stringify({ order: req.body.payload }),
  })
    .then((ress) => ress.json())
    .then(async (ress) => {
      try {
        console.log(
          everFlowPost(
            npm_url.parse(req.body.payload.source_link).query,
            npm_url.parse(req.body.payload.source_link).host,
            ress.order.name
          )
        );
        everFlowPost(
          npm_url.parse(req.body.payload.source_link).query,
          npm_url.parse(req.body.payload.source_link).host,
          ress.order.name
        );
      } catch (error) {
        console.log(error);
      }
      res.send(ress);
    });
});

app.post("/api/admin-search-products", (req, res) => {
  var queryStr = `{
        products(query: "${req.body.searchProduct} published_status:published", first: 20, reverse: true) {
            edges {
                node {
                    id
                    title
                    images(first: 1) {
                        edges {
                            node {
                                originalSrc
                            }
                        }
                    }
                }
            }
        }
    }`;
  fetch("https://" + req.body.storeUrl + "/admin/api/graphql.json?", {
    method: "POST",
    headers: {
      "Content-Type": "application/graphql",
      "X-Shopify-Access-Token": decodeBtoa(req.body.storeToken),
    },
    body: queryStr,
  })
    .then((response) => response.json())
    .then((response) => {
      res.send(response);
    });
});

app.post("/api/filter-products", (req, res) => {
  var queryStr = `{
        products(query: "${req.body.filterQuery} published_status:published", first: 24, reverse: true) {
            edges {
                node {
                    id
                    title
                    handle
                    tags
                    createdAt
                    publishedAt
                    updatedAt
                    variants(first:1) {
                        edges {
                            node {
                                price
                            }
                        }
                    }
                    images(first: 1) {
                        edges {
                            node {
                                originalSrc
                            }
                        }
                    }
                }
            }
        }
    }`;
  fetch("https://dailyproductplacement.myshopify.com/admin/api/graphql.json?", {
    method: "POST",
    headers: {
      "Content-Type": "application/graphql",
      "X-Shopify-Access-Token": dppToken,
    },
    body: queryStr,
  })
    .then((response) => response.json())
    .then((response) => {
      res.send(response);
    });
});

app.post("/api/search-products", (req, res) => {
  var dateRange = req.body.searchDate
    ? "created_at:>" + req.body.searchDate + " created_at:<" + req.body.dateNow
    : "";
  var searchQuery = `${req.body.title ? "title:" + req.body.title + "* " : ""}${
    req.body.tags
      ? "tag:" + req.body.tags + "*"
      : "-tag: " + req.body.excludeTags
  } ${dateRange}`;
  var queryStr = `{
        products(query: "${searchQuery} published_status:published", first: 24, sortKey: CREATED_AT reverse: true) {
            edges {
                node {
                    id
                    title
                    handle
                    tags
                    createdAt
                    publishedAt
                    variants(first:1) {
                        edges {
                            node {
                                price
                            }
                        }
                    }
                    images(first: 1) {
                        edges {
                            node {
                                originalSrc
                            }
                        }
                    }
                }
            }
        }
    }`;
  fetch("https://dailyproductplacement.myshopify.com/admin/api/graphql.json?", {
    method: "POST",
    headers: {
      "Content-Type": "application/graphql",
      "X-Shopify-Access-Token": dppToken,
    },
    body: queryStr,
  })
    .then((response) => response.json())
    .then((response) => {
      res.send(response);
    });
});
// end shopify admin search

app.get("/add-leads", (req, res) => {
  if (req.headers.origin == "https://productlistgenie.com" && req.query.i) {
    var payload = {
      query: `mutation{\n  addLeads(name:\"${
        req.query.n
      }\", email:\"${req.query.e.toLowerCase()}\", invitedBy:\"${
        req.query.i
      }\"){\n    name\n    email\n    invitedBy\n    date\n  }\n}`,
      variables: null,
    };
    fetch(_points.clientUrl + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        res.send({ status: "success" });
      });
  } else {
    res.send({ status: "failed" });
  }
});

app.get("/editor", async (req, res) => {
  const token = req.cookies.token ? req.cookies.token : null;
  if (token !== null) {
    try {
      const currentUser = await jwt.verify(token, process.env.JWT_SECRET);
      if (currentUser) {
        var plg_path = currentUser.id;
        _points.customFetch(
          "https://cdn.productlistgenie.com/img/list/" + encode(plg_path),
          "GET",
          null,
          (result) => {
            result = !result ? [] : result;
            res.send(
              `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title>Funnel Genie</title> </head> <body> <div id="editor"></div><script>var plg_path = "${plg_path}", plg_thumb = "${result}".split(",");</script><script src="https://productlistgenie.com/js/editor.js?v=0332211"></script> <script> unlayer.render('editor') </script> </body> </html>`
            );
          }
        );
      } else {
        res.sendStatus(400);
      }
    } catch (e) {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
});

app.get("/plg_zopim", (req, res) => {
  res.send(`
        <div style="display: flex; align-items: center; display: -moz-box; display: -ms-flexbox; height: 100%; justify-content: space-around;">
            <img src="https://gifimage.net/wp-content/uploads/2017/09/ajax-loading-gif-transparent-background-2.gif" style="width: 30%;">
        </div>
        <script type="text/javascript">
            window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
            d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
            _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute("charset","utf-8");
            $.src="https://v2.zopim.com/?5g4eM7JRiKwyYZcf3pox8UZ0AmR8z5EZ";z.t=+new Date;$.
            type="text/javascript";e.parentNode.insertBefore($,e)})(document,"script");

            setTimeout(() => {
                $zopim(function() {
                    $zopim.livechat.removeTags("Level: ");
                    ${
                      req.query.name
                        ? `$zopim.livechat.setName('${req.query.name}');`
                        : void 0
                    }
                    ${
                      req.query.email
                        ? `$zopim.livechat.setEmail('${req.query.email}');`
                        : void 0
                    }
                    ${
                      req.query.lvl
                        ? `$zopim.livechat.addTags('Level: ${req.query.lvl}');`
                        : void 0
                    }
                    ${
                      req.query.message
                        ? `$zopim.livechat.say('${req.query.message}');`
                        : void 0
                    }
                    $zopim.livechat.window.toggle();
                });
            },5000)
        </script>
    `);
});

app.get("/getServerTime", (req, res) => {
  var currentDate = new Date().getTime();
  res.status(200).json({ time: currentDate });
});

app.get("/cancelLabel/:tracking", (req, res) => {
  apiBoxC
    .cancelLabel(req.params.tracking)
    .then((g) => res.status(200).json({ success: true }))
    .catch((err) => res.status(200).json({ success: false }));
});

app.get("/getPDF/:tracking", (req, res) => {
  const options = {
    hostname: "api.boxc.com",
    path: `/v1/labels/${req.params.tracking}?type=PDF`,
    method: "GET",
    headers: {
      "Content-Type": "blob",
      Authorization:
        "Bearer 664b31fc11dbbbaad076958eb33adcba39ababbb453a2ec8a25eb142d26c6157",
    },
  };

  var request = https.request(options, function (response) {
    var data = [];

    response.on("data", function (chunk) {
      data.push(chunk);
    });

    response.on("end", function () {
      data = Buffer.concat(data);
      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${req.params.tracking}.pdf`,
        "Content-Length": data.length,
      });
      res.end(data);
    });
  });

  request.end();
});

app.get("/getTrackingInfo/:tracking", (req, res) => {
  apiBoxC
    .getLabel(req.params.tracking)
    .then((result) => {
      res.send({ data: result });
    })
    .catch((err) => {
      res.send({ data: null });
    });
});

// Start Funnel Genie
app.get("/v1/editor/1234", (req, res) => {
  res.send({
    success: true,
    data: {
      id: 1234,
      name: "Test",
      storage: true,
      subscription: {
        status: "ACTIVE",
        expired: null,
        daysRemaining: null,
        entitlements: {
          branding: false,
          allowedDomains: 200,
          customCSS: true,
          customJS: true,
          customTools: 200,
          customBlocks: 200,
          uploadMaxSize: 4000000,
        },
        addons: {},
      },
      tools: [],
    },
  });
});

//April20
app.get("/v1/editor/1234/icons/:svg", (req, res) => {
  if (req.params.svg == "fa-youtube") {
    res.send({
      success: true,
      data: {
        name: "fa-youtube",
        image: [
          '<svg aria-hidden="true" data-prefix="fab" data-icon="youtube" class="svg-inline--fa fa-youtube fa-w-18 fa-3x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg>',
        ],
      },
    });
  } else {
    res.send({ success: true, data: [] });
  }
});
// app.get('/v1/editor/1234/icons/fa-youtube', (req, res) => {
//     res.send({ "success": true, "data": { "name": "fa-youtube", "image": ["<svg aria-hidden=\"true\" data-prefix=\"fab\" data-icon=\"youtube\" class=\"svg-inline--fa fa-youtube fa-w-18 fa-3x \" role=\"img\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" viewBox=\"0 0 576 512\"><path fill=\"currentColor\" d=\"M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z\"><\/path></svg>"] } })
// });
//April20
app.get("/v1/editor/1234/blocks", (req, res) => {
  res.send({ success: true, data: [] });
});
app.post("/v1/editor/1234/events", (req, res) => {
  res.send({
    success: true,
    data: { id: 19799364, type: "editorReady", userId: null },
  });
});
app.post("/v1/editor/1234/images", multer.single("image"), async (req, res) => {
  const fileRecievedFromClient = req.file; //File Object sent in 'fileFieldName' field in multipart/form-data

  const token = req.cookies.token ? req.cookies.token : null;
  if (token !== null) {
    try {
      const currentUser = await jwt.verify(token, process.env.JWT_SECRET);
      if (currentUser) {
        let form = new FormData();
        form.append(
          "image",
          fileRecievedFromClient.buffer,
          fileRecievedFromClient.originalname
        );
        axios
          .post(
            "https://cdn.productlistgenie.com/images/upload/" +
              encode(currentUser.id),
            form,
            {
              headers: {
                "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
              },
            }
          )
          .then((responseFromServer2) => {
            res.send(JSON.stringify(responseFromServer2.data));
          })
          .catch((err) => {
            console.log(err);
            res.sendStatus(400);
          });
      } else {
        res.sendStatus(400);
      }
    } catch (err) {
      res.clearCookie("token");
      res.sendStatus(400);
    }
  }
});
app.post("/getScreenshot", (req, res) => {
  var url = req.body.url.replace("https://", "");
  fetch("https://cdn.productlistgenie.com/screenshot?page=" + url).then(
    (result) => {
      res.json({
        url: `https://cdn.productlistgenie.com/images/${url.replace(
          /(\/)|(\.)|(\?)|(=)/g,
          "_"
        )}.png`,
      });
    }
  );
});
// End Funnel Genie

app.post("/getShippingFee", (req, res) => {
  // estimate
  apiBoxC
    .estimate({
      currency: "USD",
      // entry_point: req.body.country_code.toUpperCase() == "US" ? 'HGHI01' : 'SZXI01',
      entry_point: "SZXI01",
      country: req.body.country_code, // Change to dynamic
      province: req.body.province_code,
      postal_code: req.body.zip ? req.body.zip : null,
      dg_codes: req.body.dg_code,
      weight: req.body.weight, // kg
      width: req.body.width,
      height: req.body.height,
      length: req.body.length,
    })
    .then((estimate) => res.status(200).json({ data: estimate }))
    .catch((err) => res.status(400));
});

app.post("/create-shipping-label", (req, res) => {
  apiBoxC
    .createShipment({
      comments: [
        "Order Number: " + req.body.order_number,
        req.body.comments.substring(0, 39), // limit comment to 80 character
        req.body.variants.substring(0, 39), // limit comment to 80 character
      ],
      // from: {
      //     name: "Product List Genie",
      //     street1: "11127 bridge House rd",
      //     street2: "",
      //     city: "Windermere",
      //     province: "FL",
      //     postal_code: "34786",
      //     country: "US"
      // },
      create_label: true,
      override: true,
      service: req.body.shipping_service
        ? req.body.shipping_service
        : "BoxC Parcel",
      signature_confirmation: false,
      to: {
        company_name: req.body.company,
        name: req.body.name,
        phone: req.body.phone ? req.body.phone.replace(/\D/g, "") : void 0,
        email: req.body.email,
        street1: req.body.address1,
        street2: req.body.address2,
        city: req.body.city,
        province: req.body.province_code,
        postal_code: req.body.zip,
        country: req.body.country_code,
      },
      // entry_point: req.body.country_code.toUpperCase() == "US" ? 'HGHI01' : 'SZXI01',
      entry_point: "SZXI01",
      line_items: req.body.line_items,
      height: req.body.height, // total of the shipment
      length: req.body.length, // total
      width: req.body.width, // total
      // test: true,
      weight: req.body.weight, // total
    })
    .then((shipment) => res.status(200).json(shipment))
    .catch((err) => {
      console.log(err);
      res.status(400).json({ labels: [], err: err });
    });
});

const boxCRequest = (method, path, body, callback) => {
  fetch("https://api.boxc.com/v1/" + path, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer 664b31fc11dbbbaad076958eb33adcba39ababbb453a2ec8a25eb142d26c6157",
    },
    body: body ? JSON.stringify(body) : null,
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        console.log(res);
        throw new Error("Something went wrong");
      }
    })
    .then((result) => {
      callback(result);
    })
    .catch((err) => {
      callback(null);
    });
};

app.post("/create-product", (req, res) => {
  boxCRequest("GET", "products?sku=" + req.body.sku, null, (data) => {
    if (data.products.length == 0) {
      var payload = {
        product: {
          barcode: null,
          coo: "CN",
          cost: req.body.approve_price,
          description: req.body.variant_name.substring(0, 63),
          dg_code: req.body.dg_code,
          hs_code: null,
          local_descriptions: [
            {
              description: req.body.product_name.substring(0, 63),
              language_code: "en",
            },
            {
              description: req.body.chinese_description,
              language_code: "zh",
            },
          ],
          name: req.body.product_name.substring(0, 63),
          value: req.body.original_price,
        },
      };
      boxCRequest("POST", "products", payload, (result) => {
        var skuPayload = {
          sku: {
            active: true,
            shop_id: req.body.storeID,
            sku: req.body.sku,
          },
        };
        boxCRequest(
          "POST",
          "products/" + result.product.id + "/skus",
          skuPayload,
          (result) => {
            res.json({ id: result.product.id });
          }
        );
      });
    } else {
      res.json({ id: data.products[0].id });
    }
  });
});

app.post("/createShopToBoxC", (req, res) => {
  var payload = {
    shop: {
      active: true,
      id: req.body.store_id,
      name: req.body.store_name,
      settings: {
        delay_processing: 0,
        partial_fulfillment: false,
      },
      type: "BoxC",
    },
  };
  boxCRequest("POST", "shops", payload, (data) => {
    res.json({ data: data });
  });
});

app.post("/request-inbound", (req, res) => {
  var products = [
    {
      id: req.body.product_id,
      quantity: req.body.quantity,
    },
  ];
  if (req.body.products) {
    products = req.body.products;
  }
  var payload = {
    inbound: {
      carrier: null,
      notes: "",
      products: products,
      tracking_number: null,
      warehouse: {
        id: "WH0SZ001", // BoxC Shenzhen warehouse
      },
    },
  };
  boxCRequest("POST", "inbound", payload, (result) => {
    res.json({ data: result });
  });
});

app.get("/getMyProducts/:shopid", (req, res) => {
  boxCRequest("GET", "products?shop.id=" + req.params.shopid, null, (data) => {
    res.json({ data: data });
  });
});

app.get("/getInbound/:inboundid", (req, res) => {
  boxCRequest("GET", "inbound/" + req.params.inboundid, null, (data) => {
    res.json({ data: data });
  });
});

app.post("/paypal-webhook", (req, res) => {
  setTimeout(function () {
    var payload = {
      query:
        'mutation{\n  verifyTopupFromWebhook(paymentid:"' +
        req.body.resource.parent_payment +
        '"){\n    id\n   }\n}',
      variables: null,
    };
    fetch(_points.clientUrl + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.data.verifyTopupFromWebhook) {
          console.log("User successfully paid.");
        } else {
          console.log("Failed to find user payment log.");
        }
        res.sendStatus(200);
      });
  }, 2000);
});

app.post("/extendRebillDate", (req, serverResponse) => {
  var kartraAPIOption = {
    method: "POST",
    url: "https://app.kartra.com/api",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      api_key: "fZYiBucT",
      api_password: "PJkdYcAzBoOj",
      app_id: "pEnUYwZLmACN",
      lead: { email: req.body.email },
      actions: [{ cmd: "get_transactions_from_lead" }],
    },
  };

  const kartraShit = () => {
    return request(kartraAPIOption)
      .then((response) => {
        var c = JSON.parse(response);
        if (
          c.actions[0].get_transactions_from_lead.transaction_list.length == 0
        ) {
          return null;
        } else if (
          c.actions[0].get_transactions_from_lead.transaction_list[
            c.actions[0].get_transactions_from_lead.transaction_list.length - 1
          ].product_name !== "Product List Genie Full" ||
          c.actions[0].get_transactions_from_lead.transaction_list[
            c.actions[0].get_transactions_from_lead.transaction_list.length - 1
          ].product_name !== "PLG Full Settlement"
        ) {
          return c.actions[0].get_transactions_from_lead.transaction_list[
            c.actions[0].get_transactions_from_lead.transaction_list.length - 1
          ].original_id;
        } else {
          return c.actions[0].get_transactions_from_lead.transaction_list[
            c.actions[0].get_transactions_from_lead.transaction_list.length - 2
          ].original_id;
        }
      })
      .catch((err) => console.error(err));
  };

  async function getKartraShit() {
    var original_id = await kartraShit();
    if (original_id) {
      Array.prototype.multiIndexOf = function (el) {
        var idxs = [];
        for (var i = this.length - 1; i >= 0; i--) {
          if (this[i] === el) {
            idxs.unshift(i);
          }
        }
        return idxs;
      };

      // form data
      var postData = queryString.stringify({
        username: "info@themillionairemastermind.com",
        password: "GiancarloPeru22",
      });

      var options = {
        host: "app.kartra.com",
        port: 443,
        method: "POST",
        path: "/do_login/?r=https://app.kartra.com/dashboard",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": postData.length,
        },
      };

      // request object
      var req = https.request(options, function (res) {
        var result = "";
        res.on("data", function (chunk) {
          result += chunk;
        });
        res.on("end", function () {
          var indexes = res.rawHeaders.multiIndexOf("Set-Cookie");

          var cookies = "";
          indexes.forEach((index) => {
            var setCookieVal = res.rawHeaders[index + 1];
            var a = setCookieVal.match("__cfduid=([^s]*);");
            var b = setCookieVal.match("ci_session=([^s]*);");
            if (a) {
              cookies += a[0].toString() + " ";
            } else if (b) {
              cookies += b[0].toString() + " ";
            }
          });
          var setoptions = {
            method: "POST",
            rejectUnauthorized: false,
            credentials: "include",
            referrer: `https://app.kartra.com/sales/transactions/2019-03-19/2019-03-28/0/ID/${original_id}`,
            referrerPolicy: "no-referrer-when-downgrade",
            body: `params=${encodeURIComponent(
              _points.getFutureDate(7).toLocaleString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })
            )}`, // insert Date
            mode: "cors",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              accept: "*/*",
              "accept-language": "en-US,en;q=0.9",
              "cache-control": "no-cache",
              pragma: "no-cache",
              "x-requested-with": "XMLHttpRequest",
              cookie: cookies,
            },
          };

          request(
            `https://app.kartra.com/members/sales/transactions/schedule/${original_id}`,
            setoptions
          )
            .then((response) => {
              // Function or Callback here
              serverResponse.sendStatus(200);
            })
            .catch((err) => {
              console.error(err);
            });
        });
        res.on("error", function (err) {
          serverResponse.sendStatus(400);
        });
      });

      // req error
      req.on("error", function (err) {
        serverResponse.sendStatus(400);
      });

      //send request witht the postData form
      req.write(postData);
      req.end();
    } else {
      console.log("No transaction found");
      serverResponse.sendStatus(400);
    }
  }

  getKartraShit();
});
//April20
// app.post('/send-html-to-domain', (req, res) => {
//     _points.customFetch('https://plg.productlistgenie.io/graphql', 'POST', req.body.payload, result => {
//          res.json(result)
//     })
// })

app.post("/send-html-to-domain", async (req, res) => {
  await new Promise((resolve) => {
    _points.customFetch(funnelserver, "POST", req.body.payload, (result) => {
      res.json(result);
    });
  });
});

//April20

app.get("/getKlaviyoSegments/:apikey", (req, res) => {
  // form: "api_key=pk_4ea1a7b73ab59ae8200c748f822c920336"
  request(`https://a.klaviyo.com/api/v2/lists`, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: "api_key=" + req.params.apikey,
  }).then((response) => {
    res.json(response);
  });
});

function stripeDollar(val) {
  var str = val.toString();
  return (
    str.substring(0, str.length - 2) +
    "." +
    str.substring(str.length - 2, str.length)
  );
}
// webhooks
// stripe webhook
app.post("/stripe-orders", (req, res) => {
  console.log("New Stripe Order");

  if (req.body.data.object.metadata.meta) {
    console.log("Stripe:", req.body.data.object.metadata.meta);
    var funnel_creator = decode(req.body.data.object.metadata.meta);
    var payload = {
      query: `mutation($object: String!){\n  saveFunnelOrder(object: $object){\n    id\n  }\n}`,
      variables: {
        object: JSON.stringify({
          creator: funnel_creator,
          orderCreator: req.body.data.object.customer,
          merchant_type: "stripe",
          order_status: "paid",
          shipping_information: {
            email: req.body.data.object.metadata.email,
            name: req.body.data.object.billing_details.name,
            phone: req.body.data.object.billing_details.phone,
            street1: req.body.data.object.billing_details.address.line1,
            street2: req.body.data.object.billing_details.address.line2,
            city: req.body.data.object.billing_details.address.city,
            state: req.body.data.object.billing_details.address.state,
            zip: req.body.data.object.billing_details.address.postal_code,
            country: req.body.data.object.billing_details.address.country,
          },
          line_items: {
            shopify_variant_id: req.body.data.object.metadata.variant_id,
            title: req.body.data.object.description
              ? req.body.data.object.description
              : req.body.data.object.metadata.variant_name,
            variant: req.body.data.object.description
              ? req.body.data.object.description
              : req.body.data.object.metadata.variant_name,
            quantity: 1,
            description: req.body.data.object.description
              ? req.body.data.object.description
              : req.body.data.object.metadata.variant_name,
            price: stripeDollar(req.body.data.object.amount),
          },
          risk_level: req.body.data.object.outcome.risk_level,
          test_data: !req.body.data.object.livemode,
          raw_data: JSON.stringify(req.body),
          funnel_source_id: req.body.data.object.metadata.pageid,
        }),
      },
    };
    _points.customFetch(
      _points.clientUrl + "/graphql",
      "POST",
      payload,
      (result) => {
        console.log("Success Saving Stripe Order");
        res.sendStatus(200);
      }
    );
  } else {
    res.sendStatus(200);
  }
});
// end stripe webhook
// paypal webhook
app.post("/paypal-orders-initial", (req, res) => {
  console.log("New Paypal Order");
  var funnel_creator = decode(req.body.metadata.meta);
  var uniqueOrderPerDay =
    req.body.create_time.substring(0, 10) + " " + req.body.payer.payer_id;

  var payload = {
    query: `mutation($object: String!){\n  saveFunnelOrder(object: $object){\n    id\n  }\n}`,
    variables: {
      object: JSON.stringify({
        creator: funnel_creator,
        ref_id: req.body.id,
        orderCreator: uniqueOrderPerDay,
        merchant_type: "paypal",
        order_status: "unpaid",
        shipping_information: {
          email: req.body.payer.email_address,
          name: req.body.purchase_units[0].shipping.name.full_name,
          street1: req.body.purchase_units[0].shipping.address.address_line_1,
          street2: req.body.purchase_units[0].shipping.address.address_line_2
            ? req.body.purchase_units[0].shipping.address.address_line_2
            : "",
          city: req.body.purchase_units[0].shipping.address.admin_area_2,
          state: req.body.purchase_units[0].shipping.address.admin_area_1,
          zip: req.body.purchase_units[0].shipping.address.postal_code,
          country: req.body.purchase_units[0].shipping.address.country_code,
        },
        line_items: {
          shopify_variant_id: req.body.variant_id,
          title: req.body.product_name,
          variant: req.body.variant_name,
          quantity: 1,
          description: req.body.variant_name,
          price: req.body.purchase_units[0].amount.value,
          cost_of_goods: req.body.cog ? req.body.cog : 0,
        },
        risk_level: "unavailable",
        // test_data: req.body.payer.name.given_name == "test" ? true : false,
        raw_data: JSON.stringify(req.body),
        funnel_source_id: req.body.metadata.pageid,
        source_link: req.body.source_link ? req.body.source_link : "",
      }),
    },
  };
  _points.customFetch(
    _points.clientUrl + "/graphql",
    "POST",
    payload,
    (result) => {
      console.log("Success Saving Paypal Order");
      res.sendStatus(200);
    }
  );
});
app.post("/paypalv2-orders-initial", (req, res) => {
  console.log("🧧🧧🧧🧧🧧🧧🧧🧧🧧", req.body);
  console.log("🧧🧧🧧🧧🧧🧧🧧🧧🧧");
  var funnel_creator = decode(req.body.metadata.meta);
  var uniqueOrderPerDay =
    req.body.TIMESTAMP.substring(0, 10) + " " + req.body.PAYERID;

  var payload = {
    query: `mutation($object: String!){\n  saveFunnelOrder(object: $object){\n    id\n  }\n}`,
    variables: {
      object: JSON.stringify({
        creator: funnel_creator,
        ref_id: req.body.TRANSACTIONID,
        orderCreator: uniqueOrderPerDay,
        merchant_type: "paypal",
        order_status: "paid",
        shipping_information: {
          email: req.body.EMAIL,
          name: req.body.FIRSTNAME + " " + req.body.LASTNAME,
          street1: req.body.SHIPTOSTREET,
          street2: "",
          city: req.body.SHIPTOCITY,
          state: req.body.SHIPTOSTATE,
          zip: req.body.SHIPTOZIP,
          country: req.body.SHIPTOCOUNTRYCODE,
        },
        line_items: {
          shopify_variant_id: req.body.variant_id,
          title: req.body.CUSTOM || req.body.L_NAME0,
          variant: req.body.SUBJECT,
          quantity: 1,
          description: req.body.SUBJECT,
          price: req.body.AMT,
          cost_of_goods: req.body.cog ? req.body.cog : 0,
        },
        risk_level: "unavailable",
        // test_data: req.body.payer.name.given_name == "test" ? true : false,
        raw_data: JSON.stringify(req.body),
        funnel_source_id: req.body.metadata.pageid,
        source_link: req.body.source_link ? req.body.source_link : "",
      }),
    },
  };
  _points.customFetch(
    _points.clientUrl + "/graphql",
    "POST",
    payload,
    (result) => {
      console.log("Success Saving Paypal Order");
      res.sendStatus(200);
    }
  );
});
// RECENT:
app.post("/paypal-orders", (req, res) => {
  // update order status from decline to paid by webhook
  var payload = {
    query: `mutation($ref_id: String!){\n  updatePaypalOrderStatus(ref_id: $ref_id){\n    id\n  }\n}`,
    variables: {
      ref_id: req.body.resource.id,
    },
  };
  _points.customFetch(
    _points.clientUrl + "/graphql",
    "POST",
    payload,
    (result) => {
      res.sendStatus(200);
    }
  );
});
// end paypal webhook

const syncCODOrdersToGooglesheet = (item) => {
  try {
    _points.customFetch(
      `https://script.google.com/macros/s/AKfycbzsK6B3EmgzgwAy4LI2cBShtaoweiYooCDBXZzheiPEo6aE1lM/exec?store_name=${
        item.source_link
      }&date=${Date.now()}&order_number=${item.line_items.ref_track}&country=${
        item.shipping_information.country
      }&full_name=${item.shipping_information.name}&phone=${
        item.shipping_information.phone
      }&address=${item.shipping_information.address}%20|%20Rgn-Dist:%20${
        item.shipping_information.state
      }%20|%20Apt-Ofc:%20${
        item.shipping_information.aptOffice
      }%20|%20Bldg-Vil:%20${item.shipping_information.bldgVilla}&city=${
        item.shipping_information.city
      }&product=${item.line_items.productName}%20%7C%20${
        item.line_items.variant
      }&sku=${item.line_items.plg_sku}&qty=${item.line_items.quantity}&price=${
        item.line_items.price
      }&currency=${item.currencyWord}&product_link=${item.source_link.replace(
        /(\/\?|\?).*/g,
        ""
      )}`,
      "GET",
      null,
      (result) => {
        console.log("📉📊📉💸💵🏮");
      }
    );
  } catch (error) {
    console.log("📉📊📉💸💵🏮 error on syncCODOrdersToGooglesheet");
  }
};

// TODO ::  cod webhook
let email_timeout = [],
  email_timeout_data = [];
app.post("/cod-orders", (req, res) => {
  console.log("COD:", req.body.meta, "currency:", req.body.currencySymbol);
  var funnel_creator = decode(req.body.meta);
  var orderObject = {
    creator: funnel_creator,
    orderCreator: req.body.customerID,
    merchant_type: req.body.merchantType,
    paid_cc: req.body.paid_cc,
    has_pod: req.body.has_pod,
    design_url: req.body.design_url,
    order_status: "unpaid",
    plgbuttonID: req.body.plgbuttonID ? req.body.plgbuttonID : "",
    currencyWord: req.body.currencyWord ? req.body.currencyWord : "USD",
    currencySymbol: req.body.currencySymbol ? req.body.currencySymbol : "$",
    shipping_information: {
      email: req.body.email,
      name: req.body.firstName + " " + req.body.lastName.replace(/\s\s+/g, " "), // replace double spaces to signel spaces
      phone: req.body.phone,
      street1: req.body.address,
      street2: "",
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zipcode ? req.body.zipcode : "",
      country: req.body.country,
      address_type: req.body.address_type
        ? req.body.address_type
        : "residential",
      aptOffice: req.body.aptOffice ? req.body.aptOffice : "",
      bldgVilla: req.body.bldgVilla ? req.body.bldgVilla : "",
      nearestLandmark: req.body.nearestLandmark ? req.body.nearestLandmark : "",
    },
    line_items: {
      shopify_variant_id: req.body.variant_id,
      title: req.body.productName,
      variant: req.body.variantName,
      receipt_cc: req.body.receipt_cc,
      quantity: req.body.variantQty ? parseInt(req.body.variantQty) : 1,
      description: req.body.variantName,
      price: req.body.productPrice ? req.body.productPrice : 0,
      plg_sku: req.body.variantSku
        ? req.body.variantSku.replace(/\s/g, "")
        : "",
      ref_track:
        "PLG-" +
        _points.iso2toIso3(req.body.country) +
        (
          new Date().getUTCMilliseconds().toString() +
          new Date().getTime().toString()
        ).toString(),
    },
    risk_level: "unavailable",
    test_data: false,
    raw_data: JSON.stringify(req.body),
    funnel_source_id: req.body.pageid,
    sms_verified: req.body.smsVerified ? true : false,
    source_link: req.body.source_link,
    fulfill_with_plg:
      typeof req.body.fplg == "undefined" ? true : req.body.fplg,
  };
  var payload = {
    query: `mutation($object: String!){\n  saveFunnelOrder(object: $object){\n id\n }\n}`,
    variables: {
      object: JSON.stringify(orderObject),
    },
  };

  if (orderObject.fulfill_with_plg) {
    try {
      syncCODOrdersToGooglesheet(orderObject);
    } catch (error) {
      console.log("trycatch pa lang, error na");
    }
  }

  const callPhoneNumber = ({ data }) =>
    new Promise((resolve, reject) => {
      _points.customFetch(
        _points.clientUrl + "/graphql",
        "POST",
        {
          query: `query{
                getMyFunnelOrders(ids: "${data.saveFunnelOrder.id}") {
                  ids 
                  creator
                  paid_cc
                  shipping_information{
                    phone
                  }
                }
            }`,
        },
        (caller) => {
          if (caller.data.getMyFunnelOrders) {
            console.log("caller ===> ", caller.data.getMyFunnelOrders[0]);
            const calls = caller.data.getMyFunnelOrders[0];
            if (calls.ids.length === 1) {
              console.log("START CALLING =====> ");
              if (
                (req.body.country === "SAU" ||
                  req.body.country === "KWT" ||
                  req.body.country === "ARE") &&
                calls.creator === "5d94c1a39f0c4553e0e66ecd" &&
                !calls.paid_cc
              ) {
                _points.customFetchWithHeaders(
                  `https://yala-genie-poc-api.aswat.co/integrations/cti/ivr/34a2a5ab6f8fd8cedf61611147509658/call/${encodeURIComponent(
                    calls.shipping_information.phone
                  )}?callerIDNumber=0115201198&timeout=30`,
                  "POST",
                  {
                    api_key: "0edd51b0-2157-4aaa-8260-980bcb90a184",
                    "Content-Type": "application/json",
                  },
                  { purpose: "survey", comment: "prod12345" },
                  (respoCaller) => {
                    console.log("END CALLING =====> ");
                    if (respoCaller.data.result) {
                      console.log(
                        "Call the phone",
                        respoCaller,
                        calls.shipping_information.phone
                      );
                      _points.customFetch(
                        _points.clientUrl + "/graphql",
                        "POST",
                        {
                          query: `mutation callIDUdate($ids : [String], $callId: String){
                                                updateFunnelOrdersCallID(ids: $ids, callId: $callId){
                                                callId
                                                }
                                            }`,
                          variables: {
                            ids: calls.ids,
                            callId: respoCaller.data.content.callID,
                          },
                        },
                        (updateCallID) => {
                          console.log("UPDATE STATUS CALLID", updateCallID);
                          if (
                            updateCallID.data.updateFunnelOrdersCallID !== null
                          ) {
                            console.log("CALL DONE ADDED CALL ID UPDATED");
                            resolve(true);
                          } else {
                            console.log("UPDATE STATUS CALLID");
                            resolve(false);
                          }
                        }
                      );
                    } else {
                      console.log("UPDATE STATUS CALLID ERROR", respoCaller);
                      resolve(false);
                    }
                  }
                );
              } else {
                console.log(
                  "Dont Call Not in the specified country and creator ID and Not a COD"
                );
                resolve(true);
              }
            } else {
              console.log("Call number only omce");
              resolve(false);
            }
          } else {
            console.log("Call number only that is not null.");
            resolve(false);
          }
        }
      );
    });

  // start sending email
  async function waitAndSendEmail(result) {
    let minutes = 2,
      milliseconds_per_minute = 60000,
      time = minutes * milliseconds_per_minute;
    let timeout_name =
      req.body.customerID.replace("cod_", "") + "_" + req.body.email;
    let params = JSON.parse(payload.variables.object);
    let funnel_data = await mongoose
      .model("FunnelList")
      .findById(
        { _id: params.funnel_source_id },
        {
          _id: 0,
          funnel_use_email_confirmation: 1,
          integration_tracking_email: 1,
        }
      )
      .catch((err) => null);
    let integration = await mongoose
      .model("Integration")
      .findOne(
        { creator: params.creator, merchant_type: "klaviyo" },
        { _id: 0, private_key: 1 }
      )
      .catch((err) => null);
    let has_integration =
      funnel_data &&
      funnel_data.integration_tracking_email &&
      integration &&
      integration.private_key
        ? true
        : false;
    // clear timeout if meron na timeout
    if (email_timeout[timeout_name]) clearTimeout(email_timeout[timeout_name]);
    // initial value
    if (!email_timeout_data[timeout_name]) {
      email_timeout_data[timeout_name] = {
        url: params.source_link,
        name: params.shipping_information.name,
        email: params.shipping_information.email,
        lineItems: [],
        country: _points.iso3toIso2(params.shipping_information.country),
        merchant: "cod",
      };
    }
    // push line items to initial value
    email_timeout_data[timeout_name].lineItems.push({
      name: params.line_items.title,
      qty: params.line_items.quantity,
      price: params.line_items.price,
      tracking: params.line_items.ref_track,
    });
    // add timeout
    email_timeout[timeout_name] = setTimeout(() => {
      let data = email_timeout_data[timeout_name];
      // send email after successfull timeout
      // has_integration = false;
      callPhoneNumber(result)
        .then((xssH) => {
          console.log("Calling result =>> ", xssH);
        })
        .catch((errp) => {
          console.log("Cannot call the number", errp);
        });

      if (has_integration) {
        // call user = call ID :

        // custom user email from klaviyo template
        let ocid = funnel_data.integration_tracking_email,
          apiKey = decode(integration.private_key);
        var url =
          "https://admin.productlistgenie.io/send_order_confirmation?pk=" +
          apiKey +
          "&ocid=" +
          ocid +
          "&name=" +
          data.name +
          "&email=" +
          data.email +
          "&a=no&t=" +
          data.lineItems[0].tracking;
        data.lineItems.forEach((li) => {
          url +=
            "&product=" +
            li.name +
            "&price=" +
            li.price +
            "&quantity=" +
            li.qty;
        });
        url = encodeURI(url);
        fetch(url)
          .then((ss) => {
            console.log("Sending Tracking Number in server.js success");
            clearSession();
          })
          .catch((err) => {
            console.error(
              "Sending Tracking Number in server.js error ==>",
              err
            );
            clearSession();
          });
      } else if (funnel_data && funnel_data.funnel_use_email_confirmation) {
        // default email if funnel is set to send plg email
        fetch("https://stats.productlistgenie.io/send_tracking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((res) => {
          console.log("Sending Tracking Number in server.js result: " + res.ok);
          clearSession();
        });
      }
      function clearSession() {
        // remove data for this session
        clearTimeout(email_timeout[timeout_name]);
        delete email_timeout_data[timeout_name];
      }
    }, time); // should be 5 minutes
  }
  // end sending email

  _points.customFetch(
    _points.clientUrl + "/graphql",
    "POST",
    payload,
    (result) => {
      // send message to application
      fetch(
        "https://us-central1-productlistgenie-14e76.cloudfunctions.net/webApi/api_plg/v1/addLead",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: req.body.firstName,
            lastname: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            creatorID: funnel_creator,
            message_notif: "Purchased " + req.body.productName,
            sale: req.body.currencySymbol + " " + req.body.productPrice,
            type_req: "Sale",
          }),
        }
      ).catch((err) => console.log("error sending ==>", err));

      // console.log(result, "LINE TIEMS SAVE funnel Order")
      waitAndSendEmail(result); // sequence for sending email
      console.log("Success Saving COD Order");

      res.sendStatus(200);
    }
  );
});
// end cod webhook
// authorize webhook
app.post("/authorize-orders-initial", (req, res) => {
  console.log("New Authorize.net Order");
  var funnel_creator = decode(req.body.metadata.meta);
  var payload = {
    query: `mutation($object: String!){\n  saveFunnelOrder(object: $object){\n    id\n campaign_src\n    }\n}`,
    variables: {
      object: JSON.stringify({
        creator: funnel_creator,
        ref_id:
          (req.body && req.body.transID) ||
          (req.body.result && req.body.result.transactionResponse.transId) ||
          "",
        campaign_src: req.body.campaign_src, //Oct3 TODO:
        orderCreator: req.body.customerID,
        merchant_type: "authorize.net",
        order_status: "unpaid",
        responseCode: req.body.result.transactionResponse.responseCode, // result.transactionResponse.responseCode from denied card for authorize
        shipping_information: {
          email: req.body.email,
          name: req.body.firstName + " " + req.body.lastName,
          phone: req.body.phone ? req.body.phone : "",
          street1: req.body.address,
          street2: "",
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zipcode,
          country: req.body.country,
        },
        line_items: {
          shopify_variant_id: req.body.variant_id,
          title: req.body.productName,
          variant: req.body.variantName,
          quantity: 1,
          description: req.body.variantName,
          price: req.body.productPrice,
          cost_of_goods: req.body.cog,
        },
        risk_level: "unavailable",
        test_data: false,
        raw_data: JSON.stringify(req.body),
        funnel_source_id: req.body.metadata.pageid,
        order_type: req.body.orderType ? req.body.orderType : "",
        source_link: req.body.source_link ? req.body.source_link : "",
      }),
    },
  };
  _points.customFetch(
    _points.clientUrl + "/graphql",
    "POST",
    payload,
    (result) => {
      res.json(result);
    }
  );
});
app.post("/authorize-orders", (req, res) => {
  console.log("🌞🛵😀📛");
  console.log(req.body);
  console.log("authorize payment entry");
  let success_list = [
    "net.authorize.payment.authcapture.created",
    "net.authorize.payment.authorization.created",
    "net.authorize.payment.capture.created",
  ];
  let isFailedTransaction = success_list.includes(req.body.eventType)
    ? false
    : true;
  var payload = {
    query: `mutation($ref_id: String!, $is_failed: Boolean){\n  updatePaypalOrderStatus(ref_id: $ref_id, is_failed: $is_failed){\n    id\n  }\n}`,
    variables: {
      ref_id: req.body.payload.id,
      is_failed: isFailedTransaction,
    },
  };
  _points.customFetch(
    _points.clientUrl + "/graphql",
    "POST",
    payload,
    (result) => {
      res.sendStatus(200);
    }
  );
});
app.post("/authorize-subscription", (req, res) => {
  // sendEmail(JSON.stringify(req.body, null, 2), "Webhook", "Authorize subscription webhook", "Success Sending Email from /api/authorize-subscription endpoint");
  // use this id to search from previous subscription req.body.payload.id then recreate order of that value
  // if (req.body.eventType !== "net.authorize.customer.subscription.created" || req.body.eventType !== "net.authorize.customer.subscription.cancelled" || req.body.eventType !== "net.authorize.customer.subscription.failed") { // recreate the order base on subscription id
  if (req.body.eventType === "net.authorize.customer.subscription.created") {
    console.log("🌞🛵😀📛");
    console.log(req.body);
    console.log("authorize subscription entry");
    // page created req.body.eventType = "net.authorize.customer.subscription.created"
    let payload = {
      query: `mutation($ref_id: String!, $is_failed: Boolean){\n  updatePaypalOrderStatus(ref_id: $ref_id, is_failed: $is_failed){\n    id\n  }\n}`,
      variables: { ref_id: req.body.payload.id, is_failed: false },
    };
    _points.customFetch(
      _points.clientUrl + "/graphql",
      "POST",
      payload,
      (result) => {
        res.sendStatus(200);
      }
    );
  } else {
    res.sendStatus(200);
  }
});
// end authorize webhook

// TODO :: Payment Intergration web hook;

// start conekta webhook
app.post("/conekta-orders-initial", (req, res) => {
  console.log("New Conekta Order");
  let payload = {
    query: `mutation($object: String!){\n  saveFunnelOrder(object: $object){\n    id\n  }\n}`,
    variables: {
      object: JSON.stringify({
        creator: decode(req.body.metadata.meta),
        ref_id: req.body.order_id || "",
        orderCreator: req.body.customerID,
        merchant_type: "conekta",
        order_status: "unpaid",
        shipping_information: {
          email: req.body.email,
          name: req.body.firstName + " " + req.body.lastName,
          street1: req.body.address,
          street2: "",
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zipcode,
          country: req.body.country,
        },
        line_items: {
          shopify_variant_id: req.body.variantId, // TODO:: Change to variant_ID
          title: req.body.productName,
          variant: req.body.variantName,
          quantity: 1,
          description: req.body.variantName,
          price: req.body.productPrice,
        },
        risk_level: "unavailable",
        test_data: false,
        raw_data: JSON.stringify(req.body),
        funnel_source_id: req.body.metadata.pageid,
        source_link: req.body.source_link ? req.body.source_link : "",
        order_type: req.body.orderType ? req.body.orderType : "",
      }),
    },
  };
  _points.customFetch(
    _points.clientUrl + "/graphql",
    "POST",
    payload,
    (result) => {
      res.json(result);
    }
  );
});
app.post("/api/conekta-orders-webhook", (req, res) => {
  let update_list = ["subscription.created", "order.paid"];
  let failed_list = [];
  // console.log("==================== START " + req.body.type.toUpperCase() + " ====================");
  // console.log(req.body.data.object);
  // console.log("==================== END " + req.body.type.toUpperCase() + " ====================");
  if (update_list.includes(req.body.type)) {
    console.log("Order/Subscription ID:", req.body.data.object.id);
    let payload = {
      query: `mutation($ref_id: String!, $is_failed: Boolean){\n  updatePaypalOrderStatus(ref_id: $ref_id, is_failed: $is_failed){\n    id\n  }\n}`,
      variables: { ref_id: req.body.data.object.id, is_failed: false },
    };
    _points.customFetch(
      _points.clientUrl + "/graphql",
      "POST",
      payload,
      (result) => {
        res.sendStatus(200);
      }
    );
  } else if (req.body.type === "subscription.paid") {
    res.sendStatus(200);
  } else {
    res.sendStatus(200);
  }
});
// end conekta webhook

// ===================== Braintree Save order initialize ======================

app.post("/braintree-orders-initial", (req, res) => {
  // console.log("============================ New Braintree Order ================================", JSON.stringify(req.body));
  var funnel_creator = decode(req.body.metadata.meta);
  // res.send(200)
  var payload = {
    query: `mutation($object: String!){\n  saveFunnelOrder(object: $object){\n    id\n campaign_src\n    }\n}`,
    variables: {
      object: JSON.stringify({
        creator: funnel_creator,
        ref_id:
          (req.body.result && req.body.result.id) ||
          (req.body && req.body.tk) ||
          "",
        campaign_src: req.body.campaign_src, //Oct3 TODO:
        orderCreator: req.body.customerID,
        merchant_type: "Braintree",
        order_status: "unpaid",
        shipping_information: {
          email: req.body.email,
          name: req.body.firstName + " " + req.body.lastName,
          phone: req.body.phone ? req.body.phone : "",
          street1: req.body.address,
          street2: "",
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zipcode,
          country: req.body.country,
        },
        line_items: {
          shopify_variant_id: req.body.variant_id,
          title: req.body.productName,
          variant: req.body.variantName,
          quantity: 1,
          description: req.body.variantName,
          price: req.body.productPrice,
          cost_of_goods: req.body.cog,
        },
        risk_level: "unavailable",
        test_data: false,
        raw_data: JSON.stringify(req.body),
        funnel_source_id: req.body.metadata.pageid,
        order_type: req.body.orderType ? req.body.orderType : "",
        source_link: req.body.source_link ? req.body.source_link : "",
      }),
    },
  };
  _points.customFetch(
    _points.clientUrl + "/graphql",
    "POST",
    payload,
    (result) => {
      res.json(result);
    }
  );
});

app.post("/braintree-webhook-v1", (req, res) => {
  console.log("Braintree Webhook");
  try {
    console.log("Braintree webhook = 🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣");
    // console.log(decodeBtoa(req.body.bt_payload));
    const response = parseXmlToJson(decodeBtoa(req.body.bt_payload));
    console.log(response);

    if (response.kind === "subscription_charged_successfully") {
      let payload = {
        query: `mutation($ref_id: String!, $is_failed: Boolean){\n  updatePaypalOrderStatus(ref_id: $ref_id, is_failed: $is_failed){\n    id\n  }\n}`,
        variables: { ref_id: response.subscriptionId, is_failed: false },
      };
      _points.customFetch(
        _points.clientUrl + "/graphql",
        "POST",
        payload,
        (result) => {
          res.sendStatus(200);
        }
      );
    }
  } catch (error) {
    console.log(error);
    console.log("🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣");
    setTimeout(() => {
      res.sendStatus(200);
    }, 200);
  }

  // sendEmail(JSON.stringify(req.body, null, 2), "Webhook", "Authorize subscription webhook", "Success Sending Email from /api/authorize-subscription endpoint");

  // if (req.body.eventType === "net.authorize.customer.subscription.updated") { // recreate the order base on subscription id
  //     // use this id to search from previous subscription req.body.payload.id then recreate order of that value
  //     res.sendStatus(200);
  // } else {
  //     // page created req.body.eventType = "net.authorize.customer.subscription.created"
  //     let payload = {
  //         "query": `mutation($ref_id: String!, $is_failed: Boolean){\n  updatePaypalOrderStatus(ref_id: $ref_id, is_failed: $is_failed){\n    id\n  }\n}`,
  //         "variables": { ref_id: req.body.payload.id, is_failed: false }
  //     };
  //     _points.customFetch(_points.clientUrl + '/graphql', 'POST', payload, result => {
  //         res.sendStatus(200);
  //     })
  // }
});

// ===================== Braintree Save order initialize ======================

// start real time variant price
app.post("/cod-validate-prices", (req, res) => {
  const data = req.body;
  const variantIDs = [
    ...new Set(Object.keys(data).map((el) => el.substring(0, el.length - 2))),
  ].toString();
  getFunnelProducts({ ids: variantIDs }).then((result) => {
    const priceList = [];
    result.map((el) => {
      priceList[mongoDBId.encode(el.id)] = el.productSrp;
    });
    for (var key in Object.keys(data)) {
      const feID = Object.keys(data)[key];
      const beID = feID.substring(0, feID.length - 2);
      const payloadData = data[feID];
      const productSrp =
        JSON.parse(fs.readFileSync("Global_Currency.json")).rates[
          payloadData.currency
        ] * priceList[beID];
      data[feID] = _points.commafy(
        (
          (parseFloat(productSrp) + parseFloat(payloadData.price)) *
          payloadData.qty
        ).toFixed(2)
      );
    }
    res.json(data);
  });
});
// end real time variant price

// start wimo webhook
app.post("/webhook/wimo", (req, res) => {
  try {
    var status = req.body.trackingStatus.subtag,
      delivered_date = req.body.trackingStatus.checkpoint_time,
      message = req.body.trackingStatus.message
        ? req.body.trackingStatus.message
        : req.body.trackingStatus.subtag_message,
      tracking_number = req.body.trackingNumber.toString();
    const translated = _points.translateWimoStatus(
      status,
      delivered_date,
      message
    );
    translated["line_items.tracking_number"] = tracking_number;
    const whereORStatusNotIn = ["cancelled", "delivered", "paid"];
    mongoose
      .model("FunnelGenieOrder")
      .updateMany(
        {
          "line_items.tracking_number": {
            $in: [req.body.packingLabel, tracking_number],
          },
          order_status: { $nin: whereORStatusNotIn },
        },
        { $set: translated }
      )
      .then((result) => {
        if (result.nModified >= 1) {
          // if updated some document
          // for updating the funnel product quantity
          // if(translated.order_status == "pickedup"){
          //     try {
          //         mongoose.model('FunnelGenieOrder').find({ "line_items.tracking_number": { $in: [req.body.packingLabel, tracking_number] }, order_status: { $nin: ["pickedup"] } }).then(result2 => {
          //             for (var index = 0; index < result2.length; index++) {
          //                 var orderData = result2[index];
          //                 if(orderData && orderData.line_items) {
          //                     var prodid = orderData.line_items.plg_sku;
          //                     if(typeof prodid !== "function" && prodid && mongoose.Types.ObjectId.isValid(mongoDBId.decode(prodid))){
          //                         mongoose.model('FunnelProduct').findByIdAndUpdate({ _id: mongoDBId.decode(prodid) }, { $inc: { quantity: -orderData.line_items.quantity } }).then(deductQty => {
          //                             if(deductQty){
          //                                 var remaining = deductQty.quantity - orderData.line_items.quantity;
          //                                 if(remaining == 0) {
          //                                     console.log("Ubos Na!!!", prodid);
          //                                 } else if(remaining <= 10){
          //                                     console.log("Kokonti na product refill na!!!!!!!!!")
          //                                 }
          //                             }
          //                         })
          //                     }
          //                 }
          //             }
          //         });
          //     } catch (error) {
          //         console.error("(pickedup) Error in Server wimo webhook ==>", error);
          //     }
          // } else
          // ni comment ko na ung picked up dahil meron n serial number no need to add serial number again
          if (translated.order_status == "cancelled") {
            // cancel order
            if (status == "ReturnToShipper_001") {
              try {
                changeSerialNumberToReturning(
                  req.body.packingLabel + "," + tracking_number,
                  "wimo"
                );
              } catch (err) {
                console.error(
                  "(cancelled) Error in Server wimo webhook ==>",
                  err
                );
              }
            }
          } else if (translated.order_status == "delivered") {
            try {
              addProductCostToFunds(
                req.body.packingLabel + "," + tracking_number,
                "Wimo Webhook",
                "wimo"
              );
            } catch (err) {
              console.error(
                "(delivered) Error in Server safe arrival webhook ==>",
                err
              );
            }
          }
        }
      });
  } catch (err) {
    sendEmail(
      "Tracking Number: " +
        req.body.trackingNumber.toString() +
        ", Error:" +
        err,
      "Error Note",
      "Error on Wimo Webhook",
      "Success Sending Email from /webhook/wimo endpoint"
    );
  }
  res.sendStatus(200);
});
// end wimo webhook

// start safe arrival webhook
app.post("/safe-arrival", (req, res) => {
  try {
    const translated = _points.translateSafeArrivalStatus(req.body.status);
    const whereORStatusNotIn = ["cancelled", "delivered", "paid"];
    mongoose
      .model("FunnelGenieOrder")
      .updateMany(
        {
          "line_items.tracking_number": req.body.order_number,
          order_status: { $nin: whereORStatusNotIn },
        },
        { $set: translated }
      )
      .then((result) => {
        if (result.nModified >= 1) {
          // if updated some document
          // for updating the funnel product quantity
          // if(translated.order_status == "pickedup"){
          //     try {
          //         mongoose.model('FunnelGenieOrder').find({ "line_items.tracking_number": req.body.order_number }).then(result2 => {
          //             for (var index = 0; index < result2.length; index++) {
          //                 var orderData = result2[index];
          //                 if(orderData && orderData.line_items) {
          //                     var prodid = orderData.line_items.plg_sku;
          //                     if(typeof prodid !== "function" && prodid && mongoose.Types.ObjectId.isValid(mongoDBId.decode(prodid))){
          //                         mongoose.model('FunnelProduct').findByIdAndUpdate({_id: mongoDBId.decode(prodid)}, {$inc: {quantity: -orderData.line_items.quantity}}).then(deductQty => {
          //                             if(deductQty){
          //                                 var remaining = deductQty.quantity - orderData.line_items.quantity;
          //                                 if(remaining == 0) {
          //                                     console.log("Ubos Na!!!", prodid);
          //                                 } else if(remaining <= 10){
          //                                     console.log("Kokonti na product refill na!!!!!!!!!")
          //                                 }
          //                             } else {
          //                                 console.log("FunnelProduct ==>", deductQty)
          //                             }
          //                         })
          //                     }
          //                 }
          //             }
          //         });
          //     } catch (error) {
          //         console.error("(pickedup) Error in Server safe arrival webhook ==>", error);
          //     }
          // } else
          // ni comment ko na ung picked up dahil meron n serial number no need to add serial number again
          if (translated.order_status == "cancelled") {
            // cancel order
            try {
              changeSerialNumberToReturning(
                req.body.order_number,
                "safearrival"
              );
            } catch (err) {
              console.error(
                "(cancelled) Error in Server safe arrival webhook ==>",
                err
              );
            }
          } else if (translated.order_status == "delivered") {
            try {
              addProductCostToFunds(
                req.body.order_number,
                "Safe Arrival Webhook",
                "safearrival"
              );
            } catch (err) {
              console.error(
                "(delivered) Error in Server safe arrival webhook ==>",
                err
              );
            }
          }
        }
      });
  } catch (err) {
    sendEmail(
      "Tracking Number: " + req.body.order_number + ", Error:" + err,
      "Error Note",
      "Error on Safe Arrival Webhook",
      "Success Sending Email from /safe-arrival endpoint"
    );
  }
  res.sendStatus(200);
});

app.post("/taqadum", (req, res) => {
  try {
    const translated = _points.translateSafeArrivalStatus(req.body.status);
    const whereORStatusNotIn = ["cancelled", "delivered", "paid"];
    mongoose
      .model("FunnelGenieOrder")
      .updateMany(
        {
          "line_items.tracking_number": req.body.order_number,
          order_status: { $nin: whereORStatusNotIn },
        },
        { $set: translated }
      )
      .then((result) => {
        if (result.nModified >= 1) {
          if (translated.order_status == "cancelled") {
            changeSerialNumberToReturning(req.body.order_number, "taqadum");
          } else if (translated.order_status == "delivered") {
            addProductCostToFunds(
              req.body.order_number,
              "Taqadum Webhook",
              "taqadum"
            );
          }
        }
      });
  } catch (err) {
    sendEmail(
      "Tracking Number: " + req.body.order_number + ", Error:" + err,
      "Error Note",
      "Error on Taqadum Webhook",
      "Success Sending Email from /taqadum endpoint"
    );
  }
  res.sendStatus(200);
});

app.post("/api/safe-arrival/create-order", (req, res) => {
  var loginCredential = req.body.account_data;
  delete req.body.account_data;
  let apiDomain = "prodapi.safe-arrival.com";
  if (loginCredential.isTaqadum) apiDomain = "prodapi.shipox.com";
  if (loginCredential.isDev) apiDomain = "stagingapi.shipox.com";
  if (loginCredential.token) {
    createOrderFunction();
  } else {
    safeArrivalLogin();
  }
  function safeArrivalLogin() {
    _points.customFetch(
      "https://" + apiDomain + "/api/v1/customer/authenticate",
      "POST",
      loginCredential,
      (result) => {
        if (result && result.status == "success") {
          loginCredential.token = result.data.id_token;
          createOrderFunction();
        } else {
          console.log(
            "Signin SafeArrival Error ==>",
            result,
            "Account Info: " + loginCredential
          );
          res.json({
            status: 400,
            message: "Safe Arrival login error please try again",
          });
        }
      }
    );
  }
  function createOrderFunction() {
    var token = loginCredential.token;
    fetch(
      "https://" + apiDomain + "/api/" + loginCredential.v + "/customer/order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(req.body),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.status == 401) {
          safeArrivalLogin();
        } else if (result.status == "error") {
          res.json({ status: 400, message: result.message });
        } else {
          res.json({
            status: 200,
            token,
            safeArrivalID: result.data.id,
            trackingNumber: result.data.order_number,
          });
        }
      })
      .catch((err) => {
        res.json({ status: 400, message: err });
      });
  }
});
// end safe arrival webhook

// start fetchr webhook
app.post("/webhook/fetchr", (req, res) => {
  try {
    var message = req.body.status_name;
    if (req.body.reason) message += "\nReason: " + req.body.reason;
    const translated = _points.translateFetchrStatus(
      req.body.status_code,
      req.body.date,
      message
    );
    const whereORStatusNotIn = ["cancelled", "delivered", "paid"];
    mongoose
      .model("FunnelGenieOrder")
      .updateMany(
        {
          "line_items.tracking_number": req.body.tracking_id,
          order_status: { $nin: whereORStatusNotIn },
        },
        { $set: translated }
      )
      .then((result) => {
        if (result.nModified >= 1) {
          if (translated.order_status == "cancelled") {
            try {
              changeSerialNumberToReturning(req.body.tracking_id, "fetchr");
            } catch (err) {
              console.error(
                "(cancelled) Error in Server fetchr webhook ==>",
                err
              );
            }
          } else if (translated.order_status == "delivered") {
            try {
              addProductCostToFunds(
                req.body.tracking_id,
                "Fetchr Webhook",
                "fetchr"
              );
            } catch (err) {
              console.error(
                "(delivered) Error in Server fetchr webhook ==>",
                err
              );
            }
          }
        }
      });
  } catch (err) {
    sendEmail(
      "Tracking Number: " + req.body.tracking_id + ", Error:" + err,
      "Error Note",
      "Error on Fetchr Webhook",
      "Success Sending Email from /webhook/fetchr endpoint"
    );
  }
  res.sendStatus(200);
});

app.post("/api/fetchr/create-order", (req, res) => {
  const fetchr_object = _points.getFetchrData();
  fetch(fetchr_object.link + "/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + fetchr_object.authorization,
    },
    body: JSON.stringify(req.body),
  })
    .then((res) => res.json())
    .then((result) => {
      if (
        result.status == "success" &&
        result.data.filter((e) => e.status == "error").length == 0
      ) {
        res.json({ status: 200, message: result.message, data: result });
      } else {
        var message = result.data
          .filter((e) => e.status == "error")
          .map((e) => e.message)
          .toString();
        res.json({ status: 400, message, data: result });
      }
    })
    .catch((err) => {
      res.json({ status: 400, message: err, data: null });
    });
});
// end fetchr webhook

// start smsa webhook
app.post("/webhook/smsa", (req, res) => {
  const payload = {
    toEmail: "tech@themillionairemastermind.com",
    fromEmail: "webhook@plg.com",
    subjectEmail: "SMSA Webhook Response",
    textEmail: JSON.stringify(req.body),
    htmlEmail: JSON.stringify(req.body),
  };
  _points.customFetch(
    "https://stats.productlistgenie.io/console",
    "POST",
    payload,
    (result) => {
      console.log("Success Sending Email from /webhook/smsa endpoint");
    }
  );
  res.sendStatus(200);
});
// end smsa webhook

// start fsi webhook
app.post("/fsi", (req, res) => {
  const payload = {
    toEmail: "tech@themillionairemastermind.com",
    fromEmail: "webhook@plg.com",
    subjectEmail: "Fetchr Webhook Response",
    textEmail: JSON.stringify(req.body),
    htmlEmail: JSON.stringify(req.body),
  };
  _points.customFetch(
    "https://stats.productlistgenie.io/console",
    "POST",
    payload,
    (result) => {
      console.log("Success Sending Email from /fsi endpoint");
    }
  );
  res.sendStatus(200);
});
// end fsi webhook

app.post("/send-error-email", (req, res) => {
  const payload = {
    toEmail: req.body.to ? req.body.to : "tech@themillionairemastermind.com",
    fromEmail: req.body.from,
    subjectEmail: req.body.subject,
    textEmail: req.body.text,
    htmlEmail: req.body.html,
    attachments: req.body.atc,
  };
  _points.customFetch(
    "https://stats.productlistgenie.io/console",
    "POST",
    payload,
    (_) => {
      res.status(200).json({ status: 200 });
    }
  );
});
// end webhooks

app.post("/approved-quote", (req, response) => {
  var mailer = nodemailer.createTransport({
    host: "server.best-trials.com",
    auth: {
      user: "no-reply@productlistgenie.com",
      pass: "VEy1LWczrWdO",
    },
  });

  mailer.sendMail(
    {
      from: "no-reply@productlistgenie.com",
      to: req.body.email,
      subject: "Product List Genie - Quote Approved",
      html: `<div>
            <strong>${req.body.approvedCount}</strong> of your request has been approved.<br/>
            <a href="https://app.productlistgenie.io/fulfillment-center-genie?tab=approved" target="_blank">Click here</a>.
        </div>`,
    },
    function (err, res) {
      if (err) {
        // console.log(err)
        return response.status(500).send("500 - Internal Server Error");
      }
      response.status(200).send("200 - The request has succeeded.");
    }
  );
});

app.use("/", express.static("build/public"));

app.get("/user-uploads/:file", function (req, res) {
  const file_name = req.params.file;
  const get_file = path.resolve(
    "./user-uploads/profile-images/" + req.params.file
  );
  const current_files = fs.readdirSync("./user-uploads/profile-images/");
  const fileExists = current_files.includes(file_name);

  if (fileExists) {
    res.status(200).sendFile(get_file);
  } else {
    res.status(404).send("No File Found!");
  }
});

// JWT Middelware
app.use(async (req, res, next) => {
  const token = req.cookies.token ? req.cookies.token : null;
  if (token !== null) {
    try {
      const currentUser = await jwt.verify(token, process.env.JWT_SECRET);
      req.currentUser = currentUser;
    } catch (err) {
      //   console.error(err);
      res.clearCookie("token");
    }
  }
  next();
});

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// create Graphiql app

// Disable and check for errors Start!!!
app.use(
  "/tjyk1jggy2mbjabfbsajh",
  graphiqlExpress({
    endpointURL: "/graphql",
  })
);
// Disable and check for errors  End!!!

// connect schema with graphql
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress(({ currentUser }) => ({
    schema,
    context: {
      Admin,
      AdminCustomPage,
      User,
      Points,
      Gems,
      Leads,
      FulfillmentChina,
      NewFulfillmentChina,
      PaidOrders,
      OrdersID,
      NewOrdersID,
      Conversation,
      PaymentLogs,
      VirtualWarehouse,
      NewVirtualWarehouse,
      TopupLogs,
      CreditsLog,
      FunnelBlocks,
      FunnelGenie,
      FunnelGenieID,
      FunnelGenieOrder,
      FunnelGenieOrderArchive,
      FunnelIntegration,
      Integration,
      FunnelLeadsMetaData,
      FunnelProducts,
      FunnelProductDesign,
      PurchaseOrders,
      EmailSequence,
      FunnelList,
      FunnelPageList,
      FunnelEmailSequenceV1,
      FunnelEmailSequenceV2,
      Messages,
      currentUser,
    },
  }))
);

app.get(["*/:param", "*"], (req, res) => {
  const URL_Param = req.params.param ? req.params.param : null;

  const client = new ApolloClient({
    ssrMode: true,
    // Remember that this is the interface the SSR server will use to connect to the
    // API server, so we need to ensure it isn't firewalled, etc
    link: createHttpLink({
      uri: `${webConfig.siteURL}/graphql`,
      credentials: "same-origin",
      headers: {
        cookie: req.header("Cookie"),
      },
    }),
    cache: new InMemoryCache(),
  });

  const context = {
    URL_Param,
  };

  // The client-side App will instead use <BrowserRouter>
  const App = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <AppComponent />
      </StaticRouter>
    </ApolloProvider>
  );

  // Handle queries etc.. before sending raw html
  getDataFromTree(App).then(() => {
    const content = ReactDOM.renderToString(App);
    const helmet = Helmet.renderStatic();

    const initialState = client.extract();
    const html = (
      <HTML content={content} state={initialState} helmet={helmet} />
    );

    res.status(200);
    res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`);
    res.end();
  });
});

app.post("/v1/api/sendRequestQoute", (req, res) => {
  const emailPayload2 = {
    to: ["orders@yalagenie.com", "eng.eyad.ghazzawi@gmail.com"],
    // to: ["gaious@themillionairemastermind.com","markangelo@themillionairemastermind.com"],
    from: req.body.email_form,
    subject: "This is a request qoute.",
    text: _points.sourcingEmail(req.body),
    html: _points.sourcingEmail(req.body),
  };
  _points.customFetch(
    _points.clientUrl + "/send-error-email",
    "POST",
    emailPayload2,
    (resPlgEmail) => {
      console.log("Done Sending Email sa Request Qoute");
    }
  );
  res.json({ response: true });
});

app.post("/v1/ziwo/confirm", (req, res) => {
  // console.log(req.body);
  // req.body.selection // order_status, confirmed | cancelled
  // req.body.callid // call_id,
  // GET BY CALL ID
  res.send(200);

  _points.customFetch(
    _points.clientUrl + "/graphql",
    "POST",
    {
      query: `query{
            getMyFunnelOrders(callId: "${req.body.callid}"){
                ids                          
                order_status
            }
        }`,
    },
    (getCallIds) => {
      if (getCallIds.data.getMyFunnelOrders) {
        const orderState = getCallIds.data.getMyFunnelOrders[0];
        _points.customFetch(
          _points.clientUrl + "/graphql",
          "POST",
          {
            query: `mutation updateOrderByCall($ids: [String], $cancel_note: String!, $order_status: String!){
                    updateOrderStatusByCallId(ids: $ids, cancel_note: $cancel_note, order_status: $order_status){
                        id
                    }
                }`,
            variables: {
              ids: orderState.ids,
              cancel_note:
                req.body.selection === "confirmed"
                  ? ""
                  : `Order was ${_points.capitalizeWord(
                      req.body.selection
                    )} By User through phone call.`,
              order_status: req.body.selection,
            },
          },
          (result) => {
            console.log(result, "UPDATE ORDER RESPONSE");
            /**
                 * [
                    "6012ce53a305752859a665cf",
                    "6012ce6aa305752859a665d1"
                   ]
                    9d30f2ff-ae2d-4b9c-8937-dc0881e741af
                 */
            const emailPayload2 = {
              to: "markangelo@themillionairemastermind.com",
              from: "commission@plg.com",
              subject: "This is ziwo - confirm",
              text: `<h4> ${JSON.stringify(req.body)} </h4>`,
              html: `<h4> ${JSON.stringify(req.body)} </h4>`,
            };
            _points.customFetch(
              _points.clientUrl + "/send-error-email",
              "POST",
              emailPayload2,
              (resPlgEmail) => {
                console.log("Done Sending Email sa ziwo Confirm");
              }
            );
          }
        );
      } else {
        console.log("Update Order Status was not valid...");
      }
    }
  );
});

app.post("/send-invite", (req, response) => {
  var mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true, // true for 465, false for other ports
    port: 465,
    auth: {
      type: "OAuth2",
      user: _points.emailConfiguration.client_email, // generated ethereal user
      serviceClient: _points.emailConfiguration.client_id, //key.client_id,
      privateKey: _points.emailConfiguration.private_key,
    },
  });

  mailer.use(
    "compile",
    hbs({
      viewEngine: {
        extName: ".hbs",
        partialsDir: path.resolve("./src/assets/email_templates/"),
        layoutsDir: path.resolve("./src/assets/email_templates/"),
        defaultLayout: "acceptInvite.hbs",
      },
      viewPath: path.resolve("./src/assets/email_templates/"),
      extName: ".hbs",
    })
  );

  mailer.sendMail(
    {
      from: "no-reply@productlistgenie.com",
      to: req.body.email_staff,
      subject: "Product List Genie - Accept Master's Invite",
      template: "acceptInvite",
      context: {
        email_staff: req.body.email_staff,
        master_name: req.body.master_name,
        master_id: req.body.master_id,
      },
    },
    function (err, res) {
      if (err) {
        response.status(200).send({
          response: false,
          msg: err,
        });
      }
      response.status(200).send({
        response: true,
        msg: "Success send email to invite...",
      });
    }
  );
});

app.post("/password-reset", (req, response) => {
  var mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true, // true for 465, false for other ports
    port: 465,
    auth: {
      type: "OAuth2",
      user: _points.emailConfiguration.client_email, // generated ethereal user
      serviceClient: _points.emailConfiguration.client_id, //key.client_id,
      privateKey: _points.emailConfiguration.private_key,
    },
  });

  mailer.use(
    "compile",
    hbs({
      viewEngine: {
        extName: ".hbs",
        partialsDir: path.resolve("./build/public/assets/email_templates/"),
        layoutsDir: path.resolve("./build/public/assets/email_templates/"),
        defaultLayout: "passwordReset.hbs",
      },
      viewPath: path.resolve("./build/public/assets/email_templates/"),
      extName: ".hbs",
    })
  );

  mailer.sendMail(
    {
      from: "no-reply@productlistgenie.com",
      to: req.body.email,
      subject: "Product List Genie - Password Reset",
      template: "passwordReset",
      context: {
        email: req.body.email,
        password: req.body.generatedPassword,
      },
    },
    function (err, res) {
      if (err) {
        console.log(err);
        return response.status(500).send("500 - Internal Server Error");
      }
      response.status(200).send("200 - The request has succeeded.");
    }
  );
});

app.use(fileUpload());
const getFileType = (fileType) => {
  let ext;
  if (fileType == "image/jpeg") {
    ext = ".jpg";
  } else if (fileType == "image/png") {
    ext = ".png";
  }
  return ext;
};

app.post("/upload", function (req, res) {
  if (!req.files) return res.status(400).send("No files were uploaded.");

  var current_files = fs.readdirSync("./user-uploads/profile-images/");
  let profilePic = req.files.selectedFile;
  let file_ext = getFileType(profilePic.mimetype);
  let tempFileName = randomstring.generate(21) + file_ext;

  const fileExists = current_files.includes(tempFileName);

  while (fileExists) {
    let string = randomstring.generate(21);
    tempFileName = string + file_ext;

    if (!current_files.includes(tempFileName)) {
      break;
    }
  }

  let send_filePath = "./user-uploads/profile-images/" + tempFileName;

  profilePic.mv(send_filePath, function (err) {
    if (err) return res.status(500).send(err);

    const res_dataObj = {
      newFileName: tempFileName,
    };

    res.send(res_dataObj);
  });
});

// start functions
function sendEmail(content, subject, fromEmail, logText) {
  const payload = {
    toEmail: "tech@themillionairemastermind.com",
    fromEmail: fromEmail,
    subjectEmail: subject,
    textEmail: content,
    htmlEmail: content,
  };
  _points.customFetch(
    "https://stats.productlistgenie.io/console",
    "POST",
    payload,
    (result) => {
      console.log(logText);
    }
  );
}
// end functions

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
