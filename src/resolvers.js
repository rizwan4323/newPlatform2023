/*
    for cod order default filter is search "funnel_order_query"
    meron din po dito sa global value (_points) na conversion
    iso3toIso2, iso2toIso3 and iso2toCountryName
*/

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var generator = require('generate-password');
const axios = require('axios');
const webConfig = require('./../webConfig');
const mongoose = require('mongoose');
const _points = require('../Global_Values');
const _pageTemplate = require('../FunnelGenieTemplate');
const Points = require('./models/Points');
const User = require('./models/User');
const FunnelBlocks = require('./models/FunnelBlocks');
const CustomPage = require('./models/CustomPage');
const FulfillmentChina = require('./models/FulfillmentChina');
const NewFulfillmentChina = require('./models/NewFulfillmentChina');
const PendingJob = require('./models/PendingJob');
const FunnelGenieOrder = require('./models/FunnelGenieOrder');
const Generatedbuttons = require('./models/Generatedbuttons');
//July1
const PageTemplates = require('./models/PageTemplates');
//July1

// Oct9 add environment variable for local and production
require('dotenv').config({ path: 'variables.env' });


const FunnelGenie = require('./models/FunnelGenie');
const FunnelGenieID = require('./models/FunnelGenieID');
const FunnelProducts = require('./models/FunnelProducts');
const PurchaseOrder = require('./models/PurchaseOrder');
const shortid = require('shortid');
const moment = require('moment');
const CryptoJS = require('crypto-js');
const iso3to2 = { "BD": "BGD", "BE": "BEL", "BF": "BFA", "BG": "BGR", "BA": "BIH", "BB": "BRB", "WF": "WLF", "BL": "BLM", "BM": "BMU", "BN": "BRN", "BO": "BOL", "BH": "BHR", "BI": "BDI", "BJ": "BEN", "BT": "BTN", "JM": "JAM", "BV": "BVT", "BW": "BWA", "WS": "WSM", "BQ": "BES", "BR": "BRA", "BS": "BHS", "JE": "JEY", "BY": "BLR", "BZ": "BLZ", "RU": "RUS", "RW": "RWA", "RS": "SRB", "TL": "TLS", "RE": "REU", "TM": "TKM", "TJ": "TJK", "RO": "ROU", "TK": "TKL", "GW": "GNB", "GU": "GUM", "GT": "GTM", "GS": "SGS", "GR": "GRC", "GQ": "GNQ", "GP": "GLP", "JP": "JPN", "GY": "GUY", "GG": "GGY", "GF": "GUF", "GE": "GEO", "GD": "GRD", "GB": "GBR", "GA": "GAB", "SV": "SLV", "GN": "GIN", "GM": "GMB", "GL": "GRL", "GI": "GIB", "GH": "GHA", "OM": "OMN", "TN": "TUN", "JO": "JOR", "HR": "HRV", "HT": "HTI", "HU": "HUN", "HK": "HKG", "HN": "HND", "HM": "HMD", "VE": "VEN", "PR": "PRI", "PS": "PSE", "PW": "PLW", "PT": "PRT", "SJ": "SJM", "PY": "PRY", "IQ": "IRQ", "PA": "PAN", "PF": "PYF", "PG": "PNG", "PE": "PER", "PK": "PAK", "PH": "PHL", "PN": "PCN", "PL": "POL", "PM": "SPM", "ZM": "ZMB", "EH": "ESH", "EE": "EST", "EG": "EGY", "ZA": "ZAF", "EC": "ECU", "IT": "ITA", "VN": "VNM", "SB": "SLB", "ET": "ETH", "SO": "SOM", "ZW": "ZWE", "SA": "SAU", "ES": "ESP", "ER": "ERI", "ME": "MNE", "MD": "MDA", "MG": "MDG", "MF": "MAF", "MA": "MAR", "MC": "MCO", "UZ": "UZB", "MM": "MMR", "ML": "MLI", "MO": "MAC", "MN": "MNG", "MH": "MHL", "MK": "MKD", "MU": "MUS", "MT": "MLT", "MW": "MWI", "MV": "MDV", "MQ": "MTQ", "MP": "MNP", "MS": "MSR", "MR": "MRT", "IM": "IMN", "UG": "UGA", "TZ": "TZA", "MY": "MYS", "MX": "MEX", "IL": "ISR", "FR": "FRA", "IO": "IOT", "SH": "SHN", "FI": "FIN", "FJ": "FJI", "FK": "FLK", "FM": "FSM", "FO": "FRO", "NI": "NIC", "NL": "NLD", "NO": "NOR", "NA": "NAM", "VU": "VUT", "NC": "NCL", "NE": "NER", "NF": "NFK", "NG": "NGA", "NZ": "NZL", "NP": "NPL", "NR": "NRU", "NU": "NIU", "CK": "COK", "XK": "XKX", "CI": "CIV", "CH": "CHE", "CO": "COL", "CN": "CHN", "CM": "CMR", "CL": "CHL", "CC": "CCK", "CA": "CAN", "CG": "COG", "CF": "CAF", "CD": "COD", "CZ": "CZE", "CY": "CYP", "CX": "CXR", "CR": "CRI", "CW": "CUW", "CV": "CPV", "CU": "CUB", "SZ": "SWZ", "SY": "SYR", "SX": "SXM", "KG": "KGZ", "KE": "KEN", "SS": "SSD", "SR": "SUR", "KI": "KIR", "KH": "KHM", "KN": "KNA", "KM": "COM", "ST": "STP", "SK": "SVK", "KR": "KOR", "SI": "SVN", "KP": "PRK", "KW": "KWT", "SN": "SEN", "SM": "SMR", "SL": "SLE", "SC": "SYC", "KZ": "KAZ", "KY": "CYM", "SG": "SGP", "SE": "SWE", "SD": "SDN", "DO": "DOM", "DM": "DMA", "DJ": "DJI", "DK": "DNK", "VG": "VGB", "DE": "DEU", "YE": "YEM", "DZ": "DZA", "US": "USA", "UY": "URY", "YT": "MYT", "UM": "UMI", "LB": "LBN", "LC": "LCA", "LA": "LAO", "TV": "TUV", "TW": "TWN", "TT": "TTO", "TR": "TUR", "LK": "LKA", "LI": "LIE", "LV": "LVA", "TO": "TON", "LT": "LTU", "LU": "LUX", "LR": "LBR", "LS": "LSO", "TH": "THA", "TF": "ATF", "TG": "TGO", "TD": "TCD", "TC": "TCA", "LY": "LBY", "VA": "VAT", "VC": "VCT", "AE": "ARE", "AD": "AND", "AG": "ATG", "AF": "AFG", "AI": "AIA", "VI": "VIR", "IS": "ISL", "IR": "IRN", "AM": "ARM", "AL": "ALB", "AO": "AGO", "AQ": "ATA", "AS": "ASM", "AR": "ARG", "AU": "AUS", "AT": "AUT", "AW": "ABW", "IN": "IND", "AX": "ALA", "AZ": "AZE", "IE": "IRL", "ID": "IDN", "UA": "UKR", "QA": "QAT", "MZ": "MOZ" };
const idShorter = require('id-shorter');
const mongoDBId = idShorter({ isFullId: true });
const fs = require('fs');
const npm_url = require('url');
const { Console } = require('console');
const cod_available_country = _points.cod_available_country("order_filter");
const funnelserver = webConfig.environment === 'development' ? process.env.LOCAL_FUNNEL_SERVER : process.env.FUNNEL_SERVER;
const funnel_order_query = {
    "merchant_type": 'cod',
    "shipping_information.country": { $in: cod_available_country },
    "fulfill_with_plg": { $in: [true, null] },
    "line_items.plg_sku": { $nin: ["000", "0000"] }
}

const encryptString = str => {
    return CryptoJS.AES.encrypt(str, _points.plg_domain_secret).toString();
}

const decryptString = str => {
    var bytes = CryptoJS.AES.decrypt(str, _points.plg_domain_secret);
    return bytes.toString(CryptoJS.enc.Utf8);
}

const decodeBtoa = str => {
    return new Buffer.from(str, 'base64').toString();
}

const createToken = (user, secret, expiresIn) => {
    const { id, privilege, firstName, email } = user;
    return jwt.sign({
        id, privilege, firstName, email
    }, secret, { expiresIn })
}

const findPointsOfUser = async (userData, total, queryTotal) => {
    return await Points.find({ creator: userData.id })
        .then(res => {
            userData.reward_points = res;
            total ? userData.count = total : '';
            queryTotal ? userData.queryCount = queryTotal : '';
            return userData;
        })
        .catch(err => {
            throw new Error('An Error has occured');
        })
}

const sendEmail = (fromEmail, subject, content, logText) => {
    const payload = {
        toEmail: "tech@themillionairemastermind.com,markangelo@themillionairemastermind.com",
        fromEmail: fromEmail,
        subjectEmail: subject,
        textEmail: content,
        htmlEmail: content
    };
    _points.customFetch('https://stats.productlistgenie.io/console', 'POST', payload, result => {
        if (logText) console.log(logText);
    })
}

const getReferralCount = (referrerData, since) => {
    return Promise.all(
        referrerData.map((referrer, i) => {
            return new Promise(resolve => {
                resolve(User.countDocuments({
                    $and: [
                        {
                            invitedBy: referrer.referralId
                        },
                        {
                            joinDate: {
                                $gte: since
                            }
                        }
                    ]
                }));
            }).then(res => {
                referrer.count = res;
                return referrer;
            }).catch(err => {
                return 0;
            })
        })
    ).then(ress => {
        ress.sort((a, b) => b.count - a.count)
        return ress.slice(0, 5);
    });
}

const addDailyORWeeklyPoints = async (userObj, points) => {
    console.log("addDailyORWeeklyPoints", userObj.id)
    var isDayEqual = userObj.daily_points ? userObj.daily_points.day == _points.getCurrentDateOfTheYear() : true;
    var isWeekEqual = userObj.weekly_points ? userObj.weekly_points.week == _points.getWeekOfTheYear() : true;

    if (userObj.daily_points) {
        // updating daily
        if (isDayEqual) {
            // updating daily points
            await User.findByIdAndUpdate({ _id: userObj.id }, {
                $inc: {
                    "daily_points.points": points
                }
            });
        } else {
            // resetting daily points
            await User.findByIdAndUpdate({ _id: userObj.id }, {
                $set: {
                    "daily_points.points": points,
                    "daily_points.day": _points.getCurrentDateOfTheYear()
                }
            });
        }
    } else {
        // initialization
        await User.findByIdAndUpdate({ _id: userObj.id }, {
            $set: {
                "daily_points.points": points,
                "daily_points.day": _points.getCurrentDateOfTheYear(),
            }
        });
    }

    if (userObj.weekly_points) {
        // updating weekly
        if (isWeekEqual) {
            // updating weekly points
            await User.findByIdAndUpdate({ _id: userObj.id }, {
                $inc: {
                    "weekly_points.points": points
                }
            });
        } else {
            // resetting weekly points
            await User.findByIdAndUpdate({ _id: userObj.id }, {
                $set: {
                    "weekly_points.points": points,
                    "weekly_points.week": _points.getCurrentDateOfTheYear()
                }
            });
        }
    } else {
        // initialization
        await User.findByIdAndUpdate({ _id: userObj.id }, {
            $set: {
                "weekly_points.points": points,
                "weekly_points.week": _points.getWeekOfTheYear(),
            }
        });
    }
}

const generateRandomString = () => {
    var posibleText = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var strLength = 17;
    var randomString = "";
    for (var i = 1; i <= strLength; i++) {
        randomString += posibleText.charAt(Math.floor(Math.random() * posibleText.length));
    }
    return randomString;
}

const updateUserPassKeyToMutate = async (userId) => {
    return await User.findByIdAndUpdate({ _id: userId }, { $set: { pass_key: generateRandomString() } })
}

const changeKeyName = (originalKey, newKey, arr) => {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        obj[newKey] = obj[originalKey];
        delete (obj[originalKey]);
        newArr.push(obj);
    }
    return newArr;
}

const getShippingFee = (product_data, service) => {
    var totalGrams = 0;
    var dg_code = [];
    var totalHeight = 0, totalLength = 0, totalWidth = 0;
    product_data.line_items.forEach(li => {
        totalGrams += li.grams * li.quantity;
        if (li.dimension) {
            if (li.dimension.dg_code) {
                dg_code.push(li.dimension.dg_code);
            }
            if (li.dimension.height && totalHeight < li.dimension.height) {
                totalHeight = parseFloat(li.dimension.height);
            }
            if (li.dimension.width && totalWidth < li.dimension.width) {
                totalWidth = parseFloat(li.dimension.width);
            }
            if (li.dimension.length) {
                totalLength += parseFloat(li.dimension.length);
            }
        }
    })

    if (totalGrams != 0) {
        var payload = {
            country_code: product_data.shipping_address.country_code,
            province_code: product_data.shipping_address.province_code,
            zip: product_data.shipping_address.zip,
            weight: totalGrams / 1000,
            dg_code,
            height: totalHeight ? totalHeight : null,
            length: totalLength ? totalLength : null,
            width: totalWidth ? totalWidth : null
        }

        return new Promise((resolve, reject) => {
            fetch(_points.clientUrl + '/getShippingFee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(res => {
                    var selectedService = null;
                    res.data.services.forEach(sv => {
                        if (sv.service.toLowerCase() == service.toLowerCase()) {
                            selectedService = sv;
                        }
                    })
                    resolve(selectedService);
                })
                .catch(err => {
                    resolve(null);
                })
        })
    } else {
        return null;
    }
}

const getShippingFeeRefactor = (product_data, service) => {
    var totalGrams = 0;
    var dg_code = [];
    var totalHeight = 0, totalLength = 0, totalWidth = 0;
    product_data.line_items.forEach(li => {
        totalGrams += li.weight * li.quantity;
        if (li.dg_code) {
            dg_code.push(li.dg_code);
        }
        if (li.height && totalHeight < li.height) {
            totalHeight = parseFloat(li.height);
        }
        if (li.width && totalWidth < li.width) {
            totalWidth = parseFloat(li.width);
        }
        if (li.length) {
            totalLength += parseFloat(li.length);
        }
    })

    if (totalGrams != 0) {
        var payload = {
            country_code: product_data.shipping_information.country_code,
            province_code: product_data.shipping_information.province_code,
            zip: product_data.shipping_information.zip,
            weight: totalGrams / 1000,
            dg_code,
            height: totalHeight ? totalHeight : null,
            length: totalLength ? totalLength : null,
            width: totalWidth ? totalWidth : null
        }

        return new Promise((resolve, reject) => {
            fetch(_points.clientUrl + '/getShippingFee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(res => {
                    var selectedService = null;
                    res.data.services.forEach(sv => {
                        if (sv.service.toLowerCase() == service.toLowerCase()) {
                            selectedService = sv;
                        }
                    })
                    resolve(selectedService);
                })
                .catch(err => {
                    resolve(null);
                })
        })
    } else {
        return null;
    }
}

const getTotalRequestList = async (userData) => {
    return await FulfillmentChina.countDocuments({ creator: userData.id, isRequest: true })
        .then(res => {
            userData.totalRequest = res;
            return userData;
        })
        .catch(err => {
            console.log("An error has occured in getTotalRequestList ERROR:", err)
            return userData;
        })
}

const getTotalNewRequestList = async (userData) => {
    return await NewFulfillmentChina.countDocuments({ creator: userData.id, isRequest: true })
        .then(res => {
            userData.totalRequest = res;
            return userData;
        })
        .catch(err => {
            console.log("An error has occured in getTotalRequestList ERROR:", err)
            return userData;
        })
}

const createBoxCProduct = (storeID, product_name, variant_name, chinese_description, approve_price, original_price, dg_code, variant_id, callback) => {
    var payload = {
        product_name,
        variant_name: variant_name.length <= 3 ? "(" + variant_name + ")" : variant_name,
        chinese_description,
        approve_price,
        original_price,
        dg_code: dg_code ? dg_code : null,
        sku: storeID + "-" + variant_id,
        storeID
    }
    if (storeID) {
        fetch(_points.clientUrl + '/create-product', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then(result => {
                callback(result);
            })
            .catch(err => {
                callback(null);
            })
    } else {
        throw new Error('User BoxC shop is not been initialize.');
    }
}

// start timer for sending order in shopify
var shopifyOrderTimer = [];
const accumulateShopifyOrder = pendingjob => {
    if (shopifyOrderTimer[pendingjob.order_creator]) {
        clearTimeout(shopifyOrderTimer[pendingjob.order_creator]);
    }
    shopifyOrderTimer[pendingjob.order_creator] = setTimeout(() => {
        createShopifyOrder(pendingjob, () => {
            // callback when update funnel order success
            PendingJob.findOne({ order_creator: pendingjob.order_creator }).deleteOne().exec();
            clearTimeout(shopifyOrderTimer[pendingjob.order_creator]); // clear timeout after deletion of job
        })
        // }, 180000); // 1 minute 60000
    }, 420000); // 1 minute 60000
}

const runPendingJob = async (orderid, data, store_url, store_token) => {

    if (orderid) { // if has orderid
        const findJob = await PendingJob.findOne({ order_creator: data.orderCreator });
        var shipping_address = data.shipping_information;
        var line_item = data.line_items;
        if (!findJob) { // if no job found save a new one
            var variants = [];


            line_item.shopify_variant_id.split(",").forEach(el => {
                el = el.trim();
                if (!el || el == "undefined" || el == "false") return; // skip empty variant id or undefined
                variants.push({ "variant_id": el, "quantity": line_item.quantity })
            });
            var country = shipping_address.country;
            for (var iso2 in iso3to2) {
                if (iso3to2[iso2] == country) { // convert iso3 to iso2
                    country = iso2;
                    break;
                }
            }

            // Shopify Orders Creation


            // with tags:

            // {
            //     "order": {

            //       "email": "devtestertest@gmail.com",
            //       "note": "notes added",
            //       "shipping_address": {
            //         "address1": "717 Marlborough commons",
            //         "address2": "",
            //         "city": "Ahad Rafidah",
            //         "company": null,
            //         "country": "Saudi Arabia",
            //         "first_name": "Test",
            //         "last_name": "",
            //         "phone": "+966119238738",
            //         "province": "Al Maraghah",
            //         "zip": "",
            //         "name": "Test Buyer"

            //       },
            //       "customer": {
            //           "tags": "Customer, ProductName"
            //       },
            //       "tags": "FunnelName12, ProductName",
            //       "send_receipt": true,
            //       "line_items": [
            //         {
            //           "variant_id": 33168632119399,
            //           "quantity": 1
            //         },
            //         {
            //           "variant_id": 31324370698343,
            //           "quantity": 2
            //         }
            //       ]
            //     }
            //   } 
            var dataToSave = {
                store_url,
                store_token,
                payload: {
                    order: {
                        email: shipping_address.email,
                        note: 'Merchant Type: ' + data.merchant_type,
                        shipping_address: {
                            address1: shipping_address.street1,
                            address2: shipping_address.street2,
                            city: shipping_address.city,
                            company: null,
                            country,
                            first_name: shipping_address.name,
                            last_name: '',
                            phone: shipping_address.phone ? shipping_address.phone : '',
                            province: shipping_address.state,
                            zip: shipping_address.zip,
                            name: shipping_address.name,
                        },
                        tags: data.funnel_source_id,
                        send_receipt: true,
                        line_items: variants,
                        source_link: data.source_link ? data.source_link : "",
                    },
                },
                tags: JSON.parse(data.raw_data).tags,
                idsToUpdate: [orderid],
                soldItems: [data.line_items.title],
                source_links: data.source_link ? checkForEverflow(data.source_link) ? [data.source_link] : [] : [],
                funnel_source_id: data.funnel_source_id

            };
            const createdJob = await PendingJob({
                order_creator: data.orderCreator,
                data: dataToSave
            }).save();
            accumulateShopifyOrder(createdJob);
        } else { // if has job update its line item only (must be in upsell or downsell)
            var updateData = findJob.data;
            line_item.shopify_variant_id.split(",").forEach(el => {
                el = el.trim();
                if (!el || el == "undefined" || el == "false") return; // skip empty variant id or undefined
                updateData.payload.order.line_items.push({ "variant_id": el, "quantity": line_item.quantity });
            });
            updateData.idsToUpdate.push(orderid)
            updateData.soldItems.push(data.line_items.title)
            checkForEverflow(data.source_link) && updateData.source_links.push(data.source_link)
            await PendingJob.findOneAndUpdate({ order_creator: data.orderCreator }, { $set: { data: updateData } });
            const updatedJob = await PendingJob.findOne({ order_creator: data.orderCreator });
            accumulateShopifyOrder(updatedJob);
        }
    } else { // search for pending jobs
        console.log("========== RUN PENDING JOB ==========");
        const jobs = await PendingJob.find({});
        jobs.forEach(data => {
            accumulateShopifyOrder(data);
        })
    }
}
runPendingJob(); // restart jobs if restart
// end timer for sending order in shopify

// start create new structure for funnels
const startRestructure = async creator => {
    try {
        const FunnelIntegration = require('./models/FunnelIntegration'); // v1
        const EmailSequence = require('./models/EmailSequence'); // v2
        const FunnelEmailSequenceV1 = require('./models/FunnelEmailSequenceV1');
        const FunnelEmailSequenceV2 = require('./models/FunnelEmailSequenceV2');
        const FunnelList = require('./models/FunnelList');
        const FunnelPageList = require('./models/FunnelPageList');
        const allUserThatHasFunnel = creator ? [creator] : await FunnelGenie.find({}).distinct("creator");
        for (var i = 0; i < allUserThatHasFunnel.length; i++) {
            const userID = allUserThatHasFunnel[i];
            const userData = await User.findById({ _id: userID }).lean();
            const funnelData = await FunnelGenie.find({ creator: userID }).lean();
            var index = 0, funnels = [...new Set(funnelData.map(el => JSON.stringify({ domainIndex: el.domainIndex, funnel_name: el.funnel_name })))];
            for (var funnel = 0; funnel < funnels.length; funnel++) {
                var autogeneratedIndex = userID + "_AutomatedIndex_" + i + "_" + index;
                const parsedEl = JSON.parse(funnels[funnel]);
                var thisFunnel = funnelData.filter(el => el.domainIndex == parsedEl.domainIndex && el.funnel_name == parsedEl.funnel_name)[0];
                var funnel_type = thisFunnel.funnel_type, lastModified = thisFunnel.design.length != 0 ? thisFunnel.design[thisFunnel.design.length - 1].date : null;
                if (funnel_type == "blank") funnel_type = "ecom";
                const funnelPayload = { date_modified: lastModified, creator: userID, domain_name: userData.funnel_genie_domains[parsedEl.domainIndex], funnel_name: parsedEl.funnel_name, funnel_type, funnel_use_email_confirmation: true, funnel_use_email_abandonment: false, funnel_is_phone_whatsapp: false, funnel_phone: "", funnel_address: "", funnel_email: "", funnel_pixel_id: "", funnel_favicon_link: "", funnel_facebook_id: "", funnel_facebook_access_token: "", funnel_google_id: "", funnel_tiktok_id: "", funnel_everflow: false, funnel_snapchat_id: "", gateway_selected_merchant: "", gateway_stripe_public: "", gateway_stripe_private: "", gateway_other: "", gateway_paypal_client_id: "", integration_confirmation_email: "", integration_abandonment_email: "", integration_tracking_email: "", is_cod_funnel: false, auto_generated_index: autogeneratedIndex, old_page_ids: funnelData.filter(el => el.domainIndex == parsedEl.domainIndex && el.funnel_name == parsedEl.funnel_name).map(el => el._id.toString()) };
                const newFunnelData = await new FunnelList(funnelPayload).save().catch(err => null);
                if (userData && newFunnelData) {
                    const pagePayloads = [];
                    const currentFunnel = funnelData.filter(el => el.domainIndex == parsedEl.domainIndex && el.funnel_name == parsedEl.funnel_name);
                    for (var x = 0; x < currentFunnel.length; x++) {
                        const data = currentFunnel[x];
                        const pagePayload = {
                            funnel_id: newFunnelData.id, published_page_id: data.pageID, page_type: data.page_type, path: data.path,
                            design: data.design.map(el => {
                                el.screenshot_url = el.screenshotURL;
                                return el;
                            }), split_design: data.split_design, split_bias: data.split_bias, split_screenshot: data.split_screenshot, split_notes: data.split_notes, page_is_root: data.isRoot, page_enable_loader: data.enableLoader, page_selected_modal_action: data.selectedModalAction, page_title: data.page_title, page_description: data.page_description, page_og_image_link: data.page_og_image_link, page_keyword: data.page_keyword, funnel_header_analytics: data.funnel_ga, funnel_footer_analytics: data.funnel_fga
                        };
                        pagePayloads.push(pagePayload);
                        // insert needed for funnel data
                        funnelPayload.funnel_use_email_confirmation = data.sendPLGEmailConfirmation ? true : false;
                        funnelPayload.funnel_use_email_abandonment = data.sendPLGEmailAbandonment ? true : false;
                        funnelPayload.funnel_is_phone_whatsapp = data.funnel_isWhatsApp ? true : false;
                        funnelPayload.funnel_enable_floating_bar = data.funnel_enable_floating_bar ? true : false;
                        funnelPayload.funnel_enable_floating_bar_link = data.funnel_enable_floating_bar_link ? data.funnel_enable_floating_bar_link : "";
                        funnelPayload.funnel_phone = data.funnel_phone ? data.funnel_phone : "";
                        funnelPayload.funnel_address = data.funnel_address ? data.funnel_address : "";
                        funnelPayload.funnel_email = data.funnel_email ? data.funnel_email : "";
                        funnelPayload.funnel_pixel_id = data.funnel_pixelID ? data.funnel_pixelID : "";
                        funnelPayload.funnel_favicon_link = data.favicon_link ? data.favicon_link : "";
                        funnelPayload.funnel_facebook_id = data.facebook_id ? data.facebook_id : "";
                        funnelPayload.funnel_facebook_access_token = data.facebook_access_token ? data.facebook_access_token : "";
                        funnelPayload.funnel_google_id = data.google_id ? data.google_id : "";
                        funnelPayload.funnel_tiktok_id = data.tiktok_id ? data.tiktok_id : "";
                        funnelPayload.funnel_everflow = data.funnel_everflow ? true : false;
                        funnelPayload.funnel_snapchat_id = data.snapchat_id ? data.snapchat_id : "";
                        funnelPayload.gateway_selected_merchant = data.funnel_selected_merchant ? data.funnel_selected_merchant : "";
                        funnelPayload.gateway_stripe_public = data.funnel_stripe_public ? data.funnel_stripe_public : "";
                        funnelPayload.gateway_stripe_private = data.funnel_stripe_private ? data.funnel_stripe_private : "";
                        funnelPayload.gateway_other = data.funnel_other ? data.funnel_other : "";
                        funnelPayload.gateway_paypal_client_id = data.paypalClientID ? data.paypalClientID : "";
                        funnelPayload.integration_confirmation_email = data.confirmationEmail ? data.confirmationEmail : "";
                        funnelPayload.integration_abandonment_email = data.abandonmentEmail ? data.abandonmentEmail : "";
                        funnelPayload.integration_tracking_email = data.trackingEmail ? data.trackingEmail : "";
                        funnelPayload.is_cod_funnel = data.isCOD;
                    }

                    const funnelSource = userID + "_" + parsedEl.domainIndex + "_" + parsedEl.funnel_name;
                    const integrationV1List = await FunnelIntegration.find({ funnelSource }).lean();
                    const integrationV2List = await EmailSequence.find({ funnelSource }).lean();
                    if (integrationV1List.length != 0) {
                        const fiV1payload = [];
                        integrationV1List.forEach(dataV1 => {
                            fiV1payload.push({
                                creator: dataV1.creator,
                                funnel_id: newFunnelData.id,
                                delay: dataV1.delay,
                                message_type: dataV1.messageType,
                                method: dataV1.method,
                                email_subject: dataV1.emailSubject,
                                editor_value: dataV1.editorValue,
                                message_id: dataV1.messageID
                            });
                        });
                        await FunnelEmailSequenceV1.insertMany(fiV1payload); // save new FunnelIntegration
                    }
                    if (integrationV2List.length != 0) {
                        const fiV2payload = [];
                        integrationV2List.forEach(dataV2 => {
                            fiV2payload.push({
                                creator: dataV2.creator,
                                funnel_id: newFunnelData.id,
                                sequence_name: dataV2.sequence_name,
                                sequence_tags: dataV2.sequence_tags,
                                content: dataV2.content.map(el => {
                                    return { delay: el.delay, message_type: el.messageType, email_subject: el.emailSubject, editor_value: el.editorValue, asid: el.asid, atkn: el.atkn, sender: el.sender }
                                }),
                                return_sequence_id: dataV2.return_sequence_id
                            })
                        })
                        await FunnelEmailSequenceV2.insertMany(fiV2payload); // save new EmailSequence
                    }
                    await FunnelList.findByIdAndUpdate({ _id: newFunnelData.id }, { $set: funnelPayload }); // create funnel
                    await FunnelPageList.create(pagePayloads); // create all pages of funnel  // if anything happens change .create to .insertMany
                }
                index = index + 1;
            }
        }
        console.log("============================== DONE RESTRUCTURING ==============================")
        return { message: "Success" };
    } catch (err) {
        return { message: "Error: " + err }
    }
}
exports.startRestructure = startRestructure;
// end create new structure for funnels

// start get converter object once per day
var convertObject = getWordWideCurrency();
function getWordWideCurrency() {
    return JSON.parse(fs.readFileSync('Global_Currency.json'));
}
function saveWordWideCurrency(data) {
    fs.writeFileSync('Global_Currency.json', JSON.stringify(data));
}
function getExchangerate() {
    var old_currency_api = "https://api.exchangerate-api.com/v4/latest/USD";
    var new_currency_api = "https://openexchangerates.org/api/latest.json?app_id=5e0e6e9322bf4efcbbdff862eee9c03e&base=USD";
    _points.customFetch(new_currency_api, 'GET', null, result => {
        if (result) {
            saveWordWideCurrency(result);
            convertObject = result;
            console.log("Freshly GET convertObject from server");
        } else console.log("No data to overwrite convertObject ==>", result);
    })
}
function start_exchange() {

    setInterval(() => {

    }, 86400000) // or 1 day
}
// TODO :: i comment kapag nasa localhost
// start_exchange();
// end get converter object once per day

function checkForEverflow(url) {
    try {
        if (npm_url.parse(url).query.includes('effp=')) {
            if (npm_url.parse(url, true).query.oid !== "null" && npm_url.parse(url, true).query.transaction_id != "") {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    } catch (error) {
        return false
    }

}


const createShopifyOrder = (data, callback) => {
    // send data to create order in shopify
    if (!data.data.store_token || data.data.payload.order.line_items.length == 0) {
        callback();
    } else {
        const sold = data.data.soldItems;
        console.log("💋💋💋", sold);


        var toshopify = data.data.payload;
        var original = data.data.payload;
        if (data.data.tags) {
            toshopify.order.customer = { email: toshopify.order.email, tags: data.data.tags, accepts_marketing: true };
            original.order.customer = { email: original.order.email, tags: data.data.tags, accepts_marketing: true };
            delete (toshopify.order.email)
            delete (original.order.email)
        }


        if (data.data.funnel_source_id) {
            const payload = {
                query: `query ($funnel_id: String!) {
                        getFunnelPageList(funnel_id: $funnel_id) {
                            funnel_name
                            page_type
                            page_keyword
                        }
                    }`,
                variables: { "funnel_id": data.data.funnel_source_id },
            };
            _points.customFetch(_points.clientUrl + "/graphql", "POST", payload, (page) => {
                if (page.data.getFunnelPageList[0] !== undefined) {
                    try {
                        var nn = page.data.getFunnelPageList.filter((el) => {
                            return el.page_type !== "generated_page" ? el.page_keyword == null ? "" : el.page_keyword : undefined;
                        });
                        var kk = nn.filter(function (element) {
                            return element.page_keyword;
                        });
                        // console.log("", nn[0]);
                        console.log(typeof nn[0]);
                        const checkFunnelProducts = () => {
                            if ((typeof nn[0]) == "undefined") {
                                return { funnelname: "No Funnel Name", list: kk.map((ee) => ee.page_keyword) };
                            } else {
                                return { funnelname: nn[0].funnel_name, list: kk.map((ee) => ee.page_keyword) };
                            }
                        }
                        const funnelproducts = checkFunnelProducts()
                        const ff = funnelproducts.list.filter((val) => !sold.includes(val));
                        const stringarray = ff.map((el) => " 🚫 " + el);
                        const listSold = sold.map((el) => " ✅ " + el)
                        const stringFinal = funnelproducts.funnelname + ", " + [...listSold, ...stringarray];
                        if (data.data.tags) {
                            toshopify.order.tags = [stringFinal, ...data.data.tags];
                        } else {
                            toshopify.order.tags = stringFinal;
                        }

                        syncToShopify(toshopify);
                        // console.log("Success Saving Order");
                        // const content = `Items sold: ${sold} \n\n
                        //                 Items from GraphQL Query: ${JSON.stringify(page.data.getFunnelPageList, 2, null)} \n\n
                        //                 fianal Data: ${JSON.stringify(stringFinal, 2, null)}`
                        // const payload = {
                        //     to: 'markangelo@themillionairemastermind.com',
                        //     from: 'admin@productlistgenie.io',
                        //     subject: 'Banngaan ng Data',
                        //     text: content,
                        //     html: content,
                        // };
                        // _points.customFetch(_points.clientUrl + '/send-error-email', 'POST', payload, () => {
                        //     console.log("💋💋💋", sold);
                        // });


                    } catch (error) {
                        console.log("Napunta sa Catch");
                        console.log("EEEEERRRRROOOOORRRRRR", error)
                        syncToShopify(original);
                    }
                } else {
                    console.log("walang natagpuang data =====");
                    syncToShopify(original);
                }
            });
        }
        async function everFlowPost(qq, pp, ss) {
            const orderID = ss.replace("#", "")
            axios.get("https://www.tb42trk.com/sdk/conversion?" + qq + ss.replace("#", "") + "&order_id=" + ss.replace("#", ""), {
                "headers": {
                    "accept": "application/json",
                    "accept-language": "en,en-US;q=0.9",
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site"
                },
                "referrer": `https://${pp}/`,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            }).then(res => console.log(res.data, "https://www.tb42trk.com/sdk/conversion?" + qq + ss.replace("#", "") + "&order_id=" + ss.replace("#", "")))
        }

        function syncToShopify(thePayload) { // TODO: Insert the everflow analytics
            var prunedpayload = thePayload;
            try {
                prunedpayload.order.customer.tags = prunedpayload.order.customer.tags.filter(String);
            } catch (error) {
                console.log("Error cannot find tags in customer payload");
            }


            console.log("🔥🔥🔥🔥 syncToShopify => ", JSON.stringify(prunedpayload, 2, null));
            fetch("https://" + data.data.store_url + "/admin/orders.json", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": decodeBtoa(data.data.store_token),
                },
                body: JSON.stringify(prunedpayload),
            })
                .then((ress) => ress.json())
                .then(async (ress) => {
                    if (!ress.errors) {
                        const orderIDS = data.data.idsToUpdate.map((el) => mongoose.Types.ObjectId(el));
                        await FunnelGenieOrder.updateMany(
                            { _id: { $in: orderIDS } },
                            {
                                $set: {
                                    "line_items.shopify_order_id": ress.order.id.toString(),
                                    "line_items.shopify_order_number": ress.order.name,
                                },
                            },
                        ).then((res) => {
                            callback();
                        });
                        console.log("ShopifyOrderId 🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵  🟢==> ", ress.order.name, ress.order.id.toString())

                        try {
                            data.data.source_links.forEach(el => {
                                everFlowPost(npm_url.parse(el).query, npm_url.parse(el).host, ress.order.name)
                            })
                        } catch (error) {
                            console.log(error)
                        }

                        // try {
                        //     if(thePayload.order.source_link && npm_url.parse(thePayload.order.source_link).query.includes('effp=')) {

                        //         if(npm_url.parse(thePayload.order.source_link, true).query.oid !== "null" && npm_url.parse(thePayload.order.source_link, true).query.transaction_id != ""){

                        //             everFlowPost(npm_url.parse(thePayload.order.source_link).query, npm_url.parse(thePayload.order.source_link).host, ress.order.name )

                        //             const emailPayload = {
                        //                 to: "markangelo@themillionairemastermind.com, alexb@sendwell.com" , from: "console@plg.com",
                        //                 subject: "Everflow tracking backend with shopify order id",
                        //                 text: `https://www.tb42trk.com/sdk/conversion?${npm_url.parse(thePayload.order.source_link).query}${ress.order.name.replace("#", "")}&order_id=${ress.order.name.replace("#", "")} - ${ress.order.id.toString()}`,
                        //                 html: `https://www.tb42trk.com/sdk/conversion?${npm_url.parse(thePayload.order.source_link).query}${ress.order.name.replace("#", "")}&order_id=${ress.order.name.replace("#", "")} - ${ress.order.id.toString()}`,
                        //             }
                        //             // _points.customFetch(_points.clientUrl + '/send-error-email', 'POST', emailPayload, resPlgEmail => {
                        //             //     console.log("Done Sending Email sa DEV tech@themillionairemastermind.com");
                        //             // });
                        //         }

                        //     } 
                        // } catch (error) {
                        //     console.log(error)
                        // }
                    } else {
                        console.group();
                        console.log("========== Shopify create order ERROR ==========");
                        console.log("The payload ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ==> \n", thePayload);
                        console.log("The prunedpayload ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ==> \n", prunedpayload);
                        console.log("Error ==>", ress.errors);
                        console.log("Email ==>", data.data.payload.order.email);
                        console.log("Payload Line Items =>", data.data.payload.order.line_items);
                        console.log("==================================================");
                        console.groupEnd();
                        callback();
                    }
                })
                .catch((err) => {
                    console.log("error creating shopify order", err);
                });
        }
        // console.log("walang natagpuang data  =====");
        // syncToShopify(original);
    }
};







const addFunnelProductCostToUser = async (serial_number_list, from) => {
    serial_number_list = serial_number_list.map(el => el);
    var serialNumbers = [], qty = 0;
    for (var index = 0; index < serial_number_list.length; index++) {
        var splited = serial_number_list[index].split("_");
        if (splited.length == 3) {
            qty++;
            if (!serialNumbers.includes(splited[1])) serialNumbers.push(splited[1]);
        } else {
            console.error("May product name na may Underscore.");
        }
    }
    if (serialNumbers.length != 0) {
        for (var index = 0; index < serialNumbers.length; index++) {
            var sn = serialNumbers[index]
            const po_data = await PurchaseOrder.findById({ _id: sn });
            console.log("Dapat May mag ssend ng email dahil mag dadagdag ng funds sa affiliate");
            mongoose.model('User').findOneAndUpdate({ email: po_data.affiliate_email }, { $inc: { investment_total: (po_data.product_price * qty) } }).then(res => {
                // start sending email to dev
                const emailPayload = {
                    to: "tech@themillionairemastermind.com", from: "console@plg.com",
                    subject: "Add Funds to affiliate: " + po_data.affiliate_email,
                    text: "Trigger From: " + from + ", Affiliate Email: " + po_data.affiliate_email + ", Product Price: " + po_data.product_price + ", Quantity: " + qty + ", Total:" + (po_data.product_price * qty) + ", Old Balance: $" + res.investment_total.toFixed(2) + ", New Balance: $" + (res.investment_total + (po_data.product_price * qty)).toFixed(2),
                    html: "Trigger From: " + from + ", Affiliate Email: " + po_data.affiliate_email + ", Product Price: " + po_data.product_price + ", Quantity: " + qty + ", Total:" + (po_data.product_price * qty) + ", Old Balance: $" + res.investment_total.toFixed(2) + ", New Balance: $" + (res.investment_total + (po_data.product_price * qty)).toFixed(2)
                }
                _points.customFetch(_points.clientUrl + '/send-error-email', 'POST', emailPayload, resPlgEmail => {
                    console.log("Done Sending Email sa DEV tech@themillionairemastermind.com");
                });
                // end sending email to dev

                // start send email to affiliate
                FunnelGenieOrder.find({ "line_items.plg_serialNumber": { $in: serial_number_list } }).then(ress => {
                    for (var i = 0; i < ress.length; i++) {
                        const result = ress[i];
                        const emailDesign = `
                            <div style="line-height: 1;">
                                <h3>Hey ${res.firstName}!</h3>
                                <h3 style="margin-bottom: 30px;">Congratulations!</h3>
                                <h4>You got a commission for ${result.line_items.title}${result.source_link ? " from <a href=\"" + result.source_link + "\">" + result.source_link + "</a>" : ""}. With ${qty} purchases for this product, your commission is $${po_data.affiliate_commision * qty}.</h4>
                                <h4>This will not be the last commission you'll receive. Stay tuned for more!</h4>
                                <h4 style="margin-top: 30px;">All the best,</h3>
                                <h4>Coach Giani</h4>
                                <h4>Funnel Genie by Product List Genie</h4>
                            </div>
                        `;
                        const emailPayload2 = {
                            to: po_data.affiliate_email, from: "commission@plg.com",
                            subject: "Funnel Genie Commission",
                            text: emailDesign,
                            html: emailDesign
                        }
                        _points.customFetch(_points.clientUrl + '/send-error-email', 'POST', emailPayload2, resPlgEmail => {
                            console.log("Done Sending Email sa " + po_data.affiliate_email);
                        });
                    }
                });
                // end send email to affiliate

                // setting funnel order isPaidProductCost to true
                FunnelGenieOrder.updateMany({ "line_items.plg_serialNumber": { $in: serial_number_list } }, { $set: { isPaidProductCost: true } }).then(res => {
                    console.log("Done setting isPaidProductCost to true Serial Numbers ==>", serial_number_list);
                });
            }).catch(err => {
                const emailPayload = {
                    to: "tech@themillionairemastermind.com", from: "error@plg.com",
                    subject: "Error Adding Funds to affiliate: " + po_data.affiliate_email,
                    text: "Trigger From: " + from + ", Affiliate Email: " + po_data.affiliate_email + ", PO ID:" + sn + ", Serial Number List:" + serial_number_list.toString() + ", Error: " + err,
                    html: "Trigger From: " + from + ", Affiliate Email: " + po_data.affiliate_email + ", PO ID:" + sn + ", Serial Number List:" + serial_number_list.toString() + ", Error: " + err
                }
                _points.customFetch(_points.clientUrl + '/send-error-email', 'POST', emailPayload, resPlgEmail => {
                    console.log("May mag e email na error sa tech@themillionairemastermind.com");
                });
            });
        }
    } else {
        console.log("Hindi mag sesend ng email dahil wla nmn serial number ==>", serial_number_list, serialNumbers);
    }
    return "ok";
}

exports.addFunnelProductCostToUser = addFunnelProductCostToUser;

const safeArrivalGetTrackingData = (tracking_number, isTaqadum) => {
    let ext_result = null, api_link = isTaqadum ? "https://prodapi.shipox.com" : "https://prodapi.safe-arrival.com";
    return new Promise(resolve => {
        fetch(api_link + '/api/v1/public/order/' + tracking_number + '/history_items')
            .then(res => res.json())
            .then(result => {
                ext_result = result;
                if (result.status == "error") {
                    resolve({ status: 400, message: result.code, data: {} });
                } else {
                    if (result.data.list.length != 0) {
                        var delivered = result.data.list.filter(el => el.status == "completed");
                        var status = result.data.list[0].status, date_delivered = "";
                        if (delivered.length != 0) {
                            status = delivered[0].status;
                            date_delivered = delivered[0].date.split("T")[0]; // comment this if we want to save as delivered as date now.
                        }
                        resolve({ status: 200, message: "", data: _points.translateSafeArrivalStatus(status, date_delivered), original_status: status });
                    } else {
                        resolve({ status: 400, message: "Please try again or check your tracking number if correct.", data: {} });
                    }
                }
            })
            .catch(err => {
                console.error("Catch Error (safeArrivalGetTrackingData) ==>", ext_result)
                resolve({ status: 400, message: err, data: {} });
            })
    });
}

const wimoGetTrackingData = (tracking_number, use_tracking) => {
    const body = use_tracking ? { trackingNumber: tracking_number } : { packingLabel: tracking_number };
    return new Promise(resolve => {
        fetch('https://orders.wimo.ae/orders/history', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': _points.wimoAuthorization()
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(result => {
                if (!result.success) {
                    resolve({ status: 400, message: result.message, data: {} });
                } else {
                    var status = "NewShipment_001", delivered_date = "", message = "";
                    if (result.data.length != 0) {
                        status = result.trackingStatus.subtag;
                        delivered_date = result.trackingStatus.checkpoint_time;
                        message = result.trackingStatus.message ? result.trackingStatus.message : result.trackingStatus.subtag_message;
                    }
                    resolve({ status: 200, message, data: _points.translateWimoStatus(status, delivered_date, message), original_status: status });
                }
            })
            .catch(err => {
                console.error("Catch Error (wimoGetTrackingData) ==>", err)
                resolve({ status: 400, message: err, data: {} });
            })
    });
}

const fetchrGetTrackingData = tracking_number => {
    var ext_result = null, fetchr = _points.getFetchrData();
    return new Promise(resolve => {
        fetch(fetchr.link + '/order/status/' + tracking_number, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + fetchr.authorization
            },
        })
            .then(res => res.json())
            .then(result => {
                ext_result = result;
                if (result.status == "OK") {
                    const { status_date, status_code, status_description } = result.tracking_information;
                    resolve({ status: 200, message: status_description, data: _points.translateFetchrStatus(status_code, status_date, status_description), original_status: status_code });
                } else {
                    resolve({ status: 400, message: result.message, data: {} });
                }
            })
            .catch(err => {
                console.error("Catch Error (fetchrGetTrackingData) ==>", ext_result)
                resolve({ status: 400, message: err, data: {} });
            })
    });
}

const smsaGetTrackingData = tracking_number => {
    return new Promise(resolve => {
        resolve({ status: 200, message: "wala pa message", data: {} });
    });
}

const getFunnelProducts = async (args, byId) => {
    try {
        var limit = args.limit || args.limit == 0 ? args.limit : 50;
        var page = args.page ? args.page : 1;
        var skip = (page - 1) * limit;
        var query = {};
        var sort = {};
        if (args.id) {
            if (!args.id.match(/[!@#$%^&*(),.?":{}|<>\s\\+_-]/) && mongoose.Types.ObjectId.isValid(mongoDBId.decode(args.id))) {
                query._id = mongoDBId.decode(args.id);
            }
        } else if (args.ids) {
            query._id = {
                $in: args.ids.split(",").map(el => mongoDBId.decode(el))
            }
        }
        if (args.search) {
            if (mongoose.Types.ObjectId.isValid(mongoDBId.decode(args.search))) query._id = mongoDBId.decode(args.search);
            else if (!query._id) query.productName = new RegExp(args.search.trim(), "gi");
        }
        if (args.affiliateEmail) {
            query = { affiliateEmail: args.affiliateEmail };
        }

        if (args.is_active !== null && args.is_active !== undefined) {
            if (args.is_active) {
                query.is_active = { $in: [args.is_active, null] };
            } else {
                query.is_active = args.is_active;
            }
        }

        if (args.sortDate !== null && args.is_active !== undefined) {
            if (args.sortDate === "asc") {
                sort.dateCreated = 1;
            } else {
                sort.dateCreated = -1;
            }
        }

        // console.log(query,"QUERY <<==",args.is_active, args.sortDate)

        var result = null;
        if (byId) {
            result = await FunnelProducts.findById(query).sort(sort).limit(limit).skip(skip);
        } else {
            result = await FunnelProducts.find(query).sort(sort).limit(limit).skip(skip);
        }

        // start new logic to get active affiliate
        const getAllQuantityOfPO = async (ids, id) => {
            var total_qty = 0;
            ids = ids.map(el => el);
            for (var i = 0; i < ids.length; i++) {
                var po = await PurchaseOrder.findById({ _id: ids[i] }, { product_variant_id: 1, product_quantity_list: 1 }).lean();
                if (po) {
                    if (mongoDBId.encode(id) == po.product_variant_id) {
                        total_qty += po.product_quantity_list.filter(el => el.status == "warehouse").length;
                        // } else {
                        //     console.log("==================================================================================");
                        //     console.log("=== Remove this id ("+po._id+") from this po ids ("+id+") or baliktad dko sure ===");
                        //     console.log("==================================================================================");
                    }
                }
            }
            return total_qty;
        }

        const getActivePoData = async (ids, index) => {
            if (typeof index == "undefined") index = 0;
            var po = null;
            if (ids[index]) {
                po = await PurchaseOrder.findById({ _id: ids[index] }).catch(err => null);
                index += 1;
                // start check if need to scan next id
                if (!po) { // if walang result
                    return getActivePoData(ids, index);
                } else if (po && po.product_quantity_list.filter(el => el.status == "warehouse").length == 0) { // if may result and ubos na stock
                    return getActivePoData(ids, index);
                }
                // end check if need to scan next id
            }
            return po;
        }

        if (!byId) {
            for (var i = 0; i < result.length; i++) {
                const data = result[i];
                if (data && data.po_ids.length != 0) {
                    const po = await getActivePoData(data.po_ids.map(el => el));
                    if (po && result[i]) { // if has po data
                        result[i].po_data = po;
                        result[i].productCost = po.product_price;
                        result[i].productSrp = po.product_srp;
                        result[i].productFivePercentDuty = po.vat;
                        result[i].productDeliveryCost = po.delivery_cost;
                        result[i].fulfillmentCost = po.fulfillment_cost;
                        result[i].yabazoo = po.yabazoo;
                        result[i].affiliateEmail = po.affiliate_email;
                        result[i].affiliateCost = po.affiliate_commision;
                        result[i].quantity = args.all_inventory ? await getAllQuantityOfPO(data.po_ids, data.id) : po.product_quantity_list.filter(el => el.status == "warehouse").length;
                        result[i].totalQuantity = po.product_quantity_list.length;
                    }
                }
            }

        } else {
            if (result && result.po_ids.length != 0) {
                const po = await getActivePoData(result.po_ids.map(el => el));
                if (po) { // if has po data
                    result.po_data = po;
                    result.productCost = po.product_price;
                    result.productSrp = po.product_srp;
                    result.productFivePercentDuty = po.vat;
                    result.productDeliveryCost = po.delivery_cost;
                    result.fulfillmentCost = po.fulfillment_cost;
                    result.yabazoo = po.yabazoo;
                    result.affiliateEmail = po.affiliate_email;
                    result.affiliateCost = po.affiliate_commision;
                    result.quantity = args.all_inventory ? await getAllQuantityOfPO(result.po_ids, result.id) : po.product_quantity_list.filter(el => el.status == "warehouse").length;
                    result.totalQuantity = po.product_quantity_list.length;
                }
            }
        }
        // end new logic to get active affiliate
        return result;
    } catch (err) {
        console.error("Error Getting Funnel Product ==>", err)
    }
}

exports.getFunnelProducts = getFunnelProducts;

const changeSerialNumberToReturning = (tracking_number, sync_from) => {
    let query = { "line_items.tracking_number": { $in: tracking_number.split(",") } };
    if (sync_from) query.sync_from = sync_from;
    FunnelGenieOrder.find(query).then(async result2 => {
        for (let index = 0; index < result2.length; index++) {
            let orderData = result2[index];
            if (orderData && orderData.line_items) {
                let serialNumber = orderData.line_items.plg_serialNumber.map(el => el);
                if (serialNumber.length != 0) {
                    for (let x = 0; x < serialNumber.length; x++) {
                        let sn = serialNumber[x];
                        await changeSerialNumberStatus(sn, "returning");
                    }
                }
            }
        }
    });
}
exports.changeSerialNumberToReturning = changeSerialNumberToReturning;

const addProductCostToFunds = (tracking_number, from, sync_from) => {
    let query = { "line_items.tracking_number": { $in: tracking_number.split(",") } };
    if (sync_from) query.sync_from = sync_from;
    FunnelGenieOrder.find(query).then(async result2 => {
        let serialNumbers = [];
        for (let index = 0; index < result2.length; index++) {
            if (result2[index] && result2[index].line_items) {
                serialNumbers.push(...result2[index].line_items.plg_serialNumber);
            }
        }
        await addFunnelProductCostToUser(serialNumbers, from);
    });
}
exports.addProductCostToFunds = addProductCostToFunds;

// unused
const updateOrders2DaysAgo = async (start, end, courier) => { // ok lang dina baguhin tong start, end param para sa formatStartAndEndDate
    if (typeof start == "undefined") start = moment().subtract(2, 'days').format('MMM DD YYYY').toString();
    if (typeof end == "undefined") end = moment().format('MMM DD YYYY').toString();
    const convertedDate = formatStartAndEndDate(start, end), query = { ...funnel_order_query, order_status: { $in: ["pickedup"] }, "line_items.tracking_number": { $exists: true }, order_status_update: { $gte: convertedDate.start, $lte: convertedDate.end } };
    if (courier) query.sync_from = courier;
    const needs_to_update = await FunnelGenieOrder.aggregate([
        {
            "$match": query
        },
        {
            "$group": {
                "_id": {
                    "tracking_number": "$line_items.tracking_number",
                    "sync_from": "$sync_from"
                }
            }
        }
    ]).allowDiskUse(true).exec();
    var result = { jsonStr: { hasError: false, message: [] } };
    console.log("Total orders to update ==>", needs_to_update.length, (courier ? ", Courier: " + courier : ""));
    try {
        for (var i = 0; i < needs_to_update.length; i++) {
            var { tracking_number, sync_from } = needs_to_update[i]._id, tracking_result = {};
            if (!sync_from) sync_from = "safearrival";
            if (sync_from == "safearrival") {
                tracking_result = await safeArrivalGetTrackingData(tracking_number);
                if (tracking_result.status == 400) {
                    result.jsonStr.hasError = true;
                    result.jsonStr.message.push({ tracking_number, error_message: tracking_result.message });
                }
            } else if (sync_from == "wimo") {
                tracking_result = await wimoGetTrackingData(tracking_number);
                if (tracking_result.status == 400) {
                    tracking_result = await wimoGetTrackingData(tracking_number, true);
                    if (tracking_result.status == 400) {
                        result.jsonStr.hasError = true;
                        result.jsonStr.message.push({ tracking_number, error_message: tracking_result.message });
                    }
                }
            } else if (sync_from == "fetchr") {
                tracking_result = await fetchrGetTrackingData(tracking_number);
                if (tracking_result.status == 400) {
                    result.jsonStr.hasError = true;
                    result.jsonStr.message.push({ tracking_number, error_message: tracking_result.message });
                }
            } else if (sync_from == "smsa") {
                // wala pa
                // tracking_result = await smsaGetTrackingData(tracking_number);
                // if(tracking_result.status == 400) {
                //     result.jsonStr.hasError = true;
                //     result.jsonStr.message.push({ tracking_number, error_message: "wala pa message" });
                // }
            }
            if (tracking_result.status == 200) {
                await FunnelGenieOrder.updateMany({ "line_items.tracking_number": tracking_number, sync_from }, { $set: tracking_result.data }).lean().then(res => {
                    if (tracking_result.data.order_status == "cancelled") {
                        if (sync_from == "wimo" && tracking_result.original_status == "ReturnToShipper_001") {
                            changeSerialNumberToReturning(tracking_number, sync_from);
                        } else if (sync_from == "safearrival") {
                            changeSerialNumberToReturning(tracking_number, sync_from);
                        } else if (sync_from == "fetchr") {
                            changeSerialNumberToReturning(tracking_number, sync_from);
                        } else if (sync_from == "smsa") {
                            // wala pa
                            // changeSerialNumberToReturning(tracking_number, sync_from);
                        }
                    } else if (tracking_result.data.order_status == "delivered") {
                        addProductCostToFunds(tracking_number, _points.capitalizeWord(sync_from) + " resync automation", sync_from);
                    }
                });
            }
        }
    } catch (error) {
        result.jsonStr.hasError = true;
        result.jsonStr.message.push({ tracking_number: "", error_message: "Error sa catch" });
    }
    if (result.jsonStr.message.length != 0) {
        // start sending email to dev
        const emailPayload = {
            to: "tech@themillionairemastermind.com", from: "error@plg.com",
            subject: "Error Updating Tracking Number",
            text: JSON.stringify(result.jsonStr),
            html: JSON.stringify(result.jsonStr)
        }
        _points.customFetch(_points.clientUrl + '/send-error-email', 'POST', emailPayload, resPlgEmail => {
            console.log("Done Sending Error Email sa DEV tech@themillionairemastermind.com");
        });
        // end sending email to dev
    }
    console.log("Done automatic synching orders, Error Tracking Count:", result.jsonStr.message.length);
    return result;
}
exports.updateOrders2DaysAgo = updateOrders2DaysAgo;

// start about purchase order
const getPurchaseOrderData = async (variantID, serialNumbers, id) => { // kapag serialNumbers lang get total commision
    if (variantID) {
        return await PurchaseOrder.findOne({ product_variant_id: variantID })
    } else if (serialNumbers) {
        var totalCommision = 0;
        for (var i = 0; i < serialNumbers.length; i++) {
            var serialNumber = serialNumbers[i];
            var query = { product_quantity_list: { $elemMatch: { _id: serialNumber } } };
            const po_data = await PurchaseOrder.findOne(query).catch(err => null);
            if (po_data) {
                totalCommision += po_data.affiliate_commision;
            }
        }
        return totalCommision;
    } else if (id) { // sa getMyFunneOrders para sa serial number po id
        const po = await PurchaseOrder.findById({ _id: id }).lean();
        const funnel_product = await FunnelProducts.findById({ _id: mongoDBId.decode(po.product_variant_id) }).lean();
        po.productFivePercentDuty = po.vat;
        po.affiliateCost = po.affiliate_commision;
        po.productCost = po.product_price;
        po.fulfillmentCost = po.fulfillment_cost;
        po.productDeliveryCost = po.delivery_cost;
        po.productName = funnel_product.productName;
        po.productSku = funnel_product.productSku;
        po.is_active = funnel_product.is_active;
        po.affiliateEmail = po.affiliate_email;
        return po;
    }
}

var tempTimer = [];
const checkCODProductPOIfNeedToDisable = async variant_id => {
    clearTimeout(tempTimer[variant_id]);
    tempTimer[variant_id] = setTimeout(async () => {
        const should_disabled = await PurchaseOrder.find({ product_variant_id: variant_id, $where: "this.product_quantity_list.filter(el => el.status == 'warehouse').length != 0" }).lean().then(res => {
            if (res && res.length == 0) return true;
            else return false;
        });
        if (should_disabled) {
            FunnelProducts.findByIdAndUpdate({ _id: mongoDBId.decode(variant_id) }, { $set: { is_active: false } }).then(res => {
                const emailPayload = {
                    to: "tech@themillionairemastermind.com", from: "cod_products@plg.com",
                    subject: "Disabling Funnel Product",
                    text: "SKU: " + variant_id + ", Date: " + new Date(),
                    html: "SKU: " + variant_id + ", Date: " + new Date()
                }
                _points.customFetch(_points.clientUrl + '/send-error-email', 'POST', emailPayload, resPlgEmail => {
                    console.log("Funnel Product has successfully disabled");
                });
            });
        }
    }, 1000);
}

const changeSerialNumberStatus = async (serialNumber, status, removeAttachedSerialToOrder) => {
    if (typeof status == "undefined") status = "purchased";

    var order_data = null;
    if (removeAttachedSerialToOrder) { // for removing the serial number to order
        order_data = await FunnelGenieOrder.findOne({ "line_items.plg_serialNumber": serialNumber });
        if (order_data) {
            await FunnelGenieOrder.findByIdAndUpdate(order_data._id, { $pull: { "line_items.plg_serialNumber": serialNumber } })
        }
    }

    const updateObject = { $set: { "product_quantity_list.$.status": status } };
    if (order_data) updateObject.$push = { returned_from_orderids: order_data.id };

    const result = await PurchaseOrder.findOneAndUpdate(
        {
            product_quantity_list: {
                $elemMatch: {
                    _id: serialNumber
                }
            }
        },
        updateObject
    )

    var remainingLeft = result.product_quantity_list.filter(el => el.status == "warehouse").length - 1;
    if (result.warnWhenLow && remainingLeft <= result.warnQty && status != "returning") {
        const fpInfo = await getFunnelProducts({ id: result.product_variant_id }, true);
        // send email
        const emailPayload = {
            to: result.warnEmail,
            from: "warning@plg.com",
            subject: "Low Inventory: " + fpInfo.productName,
            text: "Low Inventory: " + remainingLeft + " remaining",
            html: "Low Inventory: " + remainingLeft + " remaining"
        }
        _points.customFetch(_points.clientUrl + '/send-error-email', 'POST', emailPayload, resPlgEmail => {
            console.log("success sending email")
        });
    }
    if (remainingLeft == 0) {
        checkCODProductPOIfNeedToDisable(result.product_variant_id);
    }
    return result;
}

exports.changeSerialNumberStatus = changeSerialNumberStatus;

// third step for getting serial number (to check if serial number need to change)
const restockTheSerialNumber = async (productID) => {
    const funnelOrderData = await FunnelGenieOrder.findById({ _id: productID });
    if (funnelOrderData.line_items.plg_serialNumber) {
        const oldSerialNumbers = funnelOrderData.line_items.plg_serialNumber.map(el => {
            return { serial_number: el, isSuccess: true }
        });
        for (var i = 0; i < oldSerialNumbers.length; i++) {
            const isSuccess = await changeSerialNumberStatus(oldSerialNumbers[i].serial_number, 'warehouse');
            oldSerialNumbers[i].isSuccess = isSuccess ? true : false;
        }
        return oldSerialNumbers;
    } else {
        return [];
    }
}

// second step for getting serial number (get the actual serial number) (recursion)
const getProductSerialNumber = async (plg_sku, qty, index, accumulated_serialNumber, productID) => {
    if (typeof index == "undefined") index = 0;
    if (typeof accumulated_serialNumber == "undefined") accumulated_serialNumber = [];
    try {
        if (plg_sku && mongoose.Types.ObjectId.isValid(mongoDBId.decode(plg_sku))) {
            const x = await FunnelProducts.findById({ _id: mongoDBId.decode(plg_sku) });
            if (x && x.po_ids.length != 0 && (x.po_ids.length - 1) >= index) {
                const po_id = x.po_ids[index];
                // if has productID do checking first
                if (productID) {
                    const oldSerialNumbers = await restockTheSerialNumber(productID);
                    // store to accumulated_serialNumber ung mga nag fail during restocking the serial number
                    accumulated_serialNumber = oldSerialNumbers.filter(el => !el.isSuccess);
                }
                // generate serial numbers
                const po = await PurchaseOrder.aggregate([
                    {
                        $match: {
                            _id: mongoose.Types.ObjectId(po_id),
                            "product_quantity_list.status": "warehouse"
                        }
                    },
                    {
                        $project: {
                            product_quantity_list: {
                                $filter: {
                                    input: '$product_quantity_list',
                                    as: 'product_quantity_list',
                                    cond: {
                                        $eq: ['$$product_quantity_list.status', 'warehouse']
                                    }
                                }
                            }
                        }
                    }
                ]).allowDiskUse(true).exec()
                index = index + 1;
                if (po.length != 0) {
                    const po_object = Object.assign({}, ...po);
                    if (po_object.product_quantity_list.length != 0) {
                        for (var i = 0; i < po_object.product_quantity_list.length; i++) {
                            var qty_list_data = po_object.product_quantity_list[i]
                            if (qty_list_data._id) { // if meron serial number
                                var serial_number = qty_list_data._id;
                                var isSuccess = await changeSerialNumberStatus(serial_number, 'purchased');
                                if (isSuccess) accumulated_serialNumber.push(serial_number);
                            }
                            if (accumulated_serialNumber.length == qty) break; // stop loop when we got what we need
                        }
                        if (accumulated_serialNumber.length != qty) {
                            return await getProductSerialNumber(plg_sku, qty, index, accumulated_serialNumber);
                        } else {
                            return accumulated_serialNumber; // meron available get first in array then return the serial number
                        }
                    } else {
                        return await getProductSerialNumber(plg_sku, qty, index, accumulated_serialNumber); // get next po_id because no available quantity and rerun
                    }
                } else {
                    return await getProductSerialNumber(plg_sku, qty, index, accumulated_serialNumber); // get next po_id and rerun
                }
            } else {
                return accumulated_serialNumber; // just return an empty array means no searil numbers
            }
        }
    } catch (error) {
        console.error("Try Catch Error On Getting Product Serial Number", plg_sku, error);
        return accumulated_serialNumber; // just return an empty array means no searil numbers
    }
}

// first step for getting serial number
const getSerialNumbers = async (plg_sku, qty, productID) => {
    if (plg_sku) { // if meron plg_sku
        return await getProductSerialNumber(plg_sku, qty, 0, [], productID);
    } else {
        return [];
    }
}
// end about purchase order

// start for filter
const formatStartAndEndDate = (start, end, source) => { // remove source pag stable na for debugging only
    if (start.length < 24) console.log("Parameters ==>", start, " - ", end, " Source: " + source);
    return { start: new Date(start), end: new Date(end) };
}
// end for filter

// start get and distinct serial number or plg sku
const distinctSerialOrSku = order_data => {
    var distinct = order_data.map(el => {
        if (el.line_items.plg_serialNumber && el.line_items.plg_serialNumber.filter(e => e).length != 0) {
            return el.line_items.plg_serialNumber.filter(e => e).map(sn => {
                return sn.split("_")[1];
            });
        } else {
            return el.line_items.plg_sku ? el.line_items.plg_sku.toString() : "";
        }
    });
    distinct = [...new Set([].concat.apply([], distinct))].filter(el => el);
    distinct = [].concat.apply([], distinct); // additional para sa array of array
    return distinct;
}
// end get and distinct serial number or plg sku

// start get funnel products
const getOrderFunnelProducts = async product_ids => {
    const product_list = {};
    for (var i = 0; i < product_ids.length; i++) {
        const prodid = product_ids[i];
        if (mongoose.Types.ObjectId.isValid(prodid)) { // kapag may serial number
            product_list[prodid] = await getPurchaseOrderData(null, null, prodid);
        } else if (mongoose.Types.ObjectId.isValid(mongoDBId.decode(prodid))) { // kapag wla serial number pero may sku
            product_list[prodid] = await getFunnelProducts({ id: prodid }, true);
        }
    }
    return product_list;
}
// end get funnel products


// start for automatic copying the design to new table
const add_default_product_design_to_different_table = async () => {
    const FunnelProductDesign = require('./models/FunnelProductDesign');
    const fp = await FunnelProducts.find().lean(), save_list = [];
    for (var i = 0; i < fp.length; i++) {
        const funnel_product = fp[i], funnel_product_id = funnel_product._id.toString();
        const save_design_object = {
            product_id: funnel_product_id,
            design_name: _points.capitalizeAndSerializeWord(funnel_product.productName),
            design_list: [],
            created_by: "Default Automation"
        };
        for (var x = 0; x < funnel_product.funnelDesign.length; x++) {
            const funnel_product_design = funnel_product.funnelDesign[x];
            const parse_object = JSON.parse(funnel_product_design);
            save_design_object.design_list.push({ path: parse_object.path, page_type: parse_object.page_type, design_string_object: funnel_product_design, upload_by: "Default Automation" })
        }
        const should_be_zero = await FunnelProductDesign.countDocuments({ product_id: save_design_object.product_id, design_name: save_design_object.design_name }).lean();
        if (should_be_zero == 0) { // ipush kapag 0 value meaning wla kapareho na product id at design name
            save_list.push(save_design_object)
        }
    }
    if (save_list.length != 0) { // save kapag may laman to save_list meaning may kailangan isave
        await FunnelProductDesign.insertMany(save_list);
    }
}
exports.add_default_design = add_default_product_design_to_different_table;
// end for automatic copying the design to new table

const getTotalFunnelOrder = async params => {
    const match = params || {};
    const totalOrders = await FunnelGenieOrder.aggregate([{ "$match": match }, { "$group": { "_id": { "orderCreator": "$orderCreator" } } }]).allowDiskUse(true).exec();
    return totalOrders.length;
}
exports.getTotalFunnelOrder = getTotalFunnelOrder;

const getFunnelProductTotalSales = async sku => {
    let total_sales = 0, query = { ...funnel_order_query, "line_items.plg_sku": sku };
    let orders = await FunnelGenieOrder.find(query, { currencyWord: 1, line_items: 1 }).lean();
    for (var i = 0; i < orders.length; i++) {
        let ord = orders[i];
        let usd_price = parseFloat((ord.line_items.price / convertObject.rates[ord.currencyWord ? ord.currencyWord : "USD"]).toFixed(2));
        total_sales += usd_price;
    }
    return parseFloat(total_sales.toFixed(2));
}

const getBuyerList = async params => {
    let match = { ...funnel_order_query, "line_items.plg_sku": { $nin: [null, "", "000", "0000"] }, order_status: { $in: ["delivered", "paid"] } }, result = {};
    if (params.country) match["shipping_information.country"] = { $in: params.country };
    if (params.date) {
        let convertedDate = formatStartAndEndDate(params.date, new Date().toISOString(), getBuyerList);
        match.dateStatusDelivered = { $gte: convertedDate.start, $lte: convertedDate.end };
    }

    if (params.display && params.display == "top_10_products") { // for top 10 products
        let top_5_products = await FunnelGenieOrder.aggregate([
            { "$match": match },
            {
                "$group": {
                    "_id": {
                        "skus": "$line_items.plg_sku"
                    },
                    "source_link": { "$push": "$source_link" },
                    "count": { "$sum": 1 }
                }
            },
            { "$sort": { "count": -1 } },
            { "$limit": 10 }
        ]).allowDiskUse(true).exec();
        let ids = top_5_products.map(e => mongoDBId.decode(e._id.skus));
        let product_info = await FunnelProducts.find({ _id: { $in: ids } }, { productName: 1, productSku: 1 }).lean();
        for (var x = 0; x < top_5_products.length; x++) {
            let info = product_info.filter(i => i._id.toString() == mongoDBId.decode(top_5_products[x]._id.skus)).reduce(e => e);
            top_5_products[x].id = info._id.toString();
            top_5_products[x].productName = info.productName;
            top_5_products[x].description = info.productSku;
            top_5_products[x].sales = await getFunnelProductTotalSales(top_5_products[x]._id.skus);
        }
        result = top_5_products;
    } else if (params.display && params.display.includes("top_clients_")) { // for top 3 products high selling clients
        let top_count = params.display.split("_");
        top_count = parseInt(top_count[top_count.length - 1]);
        let skip = top_count - 1;
        let top_3_products = await FunnelGenieOrder.aggregate([
            { "$match": match },
            {
                "$group": {
                    "_id": {
                        "skus": "$line_items.plg_sku"
                    },
                    "creators": { "$push": "$creator" },
                    "count": { "$sum": 1 }
                }
            },
            { "$sort": { "count": -1 } },
            { "$skip": skip },
            { "$limit": 1 }
        ]).allowDiskUse(true).exec();
        top_3_products = top_3_products.reduce(e => e);
        let info = await FunnelProducts.findById({ _id: mongoDBId.decode(top_3_products._id.skus) }, { productName: 1, productSku: 1 }).lean();
        top_3_products.id = info._id.toString();
        top_3_products.productName = info.productName;
        top_3_products.description = info.productSku;
        top_3_products.creators = [...new Set(top_3_products.creators.map(e => e.toString()))];
        for (var i = 0; i < top_3_products.creators.length; i++) {
            let id = top_3_products.creators[i];
            let user_data = await User.findById({ _id: id }, { email: 1, firstName: 1, lastName: 1 }).lean();
            top_3_products.creators[i] = { email: user_data.email, name: user_data.firstName + " " + user_data.lastName };
        }
        result = top_3_products;
    } else { // for all time / 90 days buyers
        let top_product = null;
        if (params.display && params.display.includes("buyers_product_top_")) { // for top 1 - 5 buyers (all time / 90 days)
            let top_count = params.display.split("_");
            top_count = parseInt(top_count[top_count.length - 1]);
            let skip = top_count - 1;
            let selected_top_products = await FunnelGenieOrder.aggregate([
                { "$match": match },
                {
                    "$group": {
                        "_id": {
                            "skus": "$line_items.plg_sku"
                        },
                        "count": { "$sum": 1 }
                    }
                },
                { "$sort": { "count": -1 } },
                { "$skip": skip },
                { "$limit": 1 }
            ]).allowDiskUse(true).exec();
            if (selected_top_products.length == 0) {
                throw new Error("No Top " + top_count + " Product to export buyers");
            } else {
                selected_top_products = selected_top_products.reduce(e => e);
                let product_sku = selected_top_products._id.skus, count = selected_top_products.count;
                let product_info = await FunnelProducts.findById({ _id: mongoDBId.decode(product_sku) }, { productName: 1 }).lean();
                top_product = { top_count, count, name: product_info.productName }
                match["line_items.plg_sku"] = product_sku;
            }
        }
        let pipeline = [
            {
                "$match": match
            },
            {
                "$group": {
                    "_id": {
                        "name": "$shipping_information.name",
                        "email": "$shipping_information.email"
                    },
                    "shipping_information": { "$first": "$shipping_information" },
                    "source_link": { "$push": "$source_link" }
                }
            }
        ];
        if (params.page) {
            pipeline.push({ $skip: 1000 * (params.page - 1) });
            pipeline.push({ $limit: 1000 });
        }
        result = await FunnelGenieOrder.aggregate(pipeline).allowDiskUse(true).exec();
        if (top_product) result = { top_product, result }
    }
    return result;
}
exports.getBuyerList = getBuyerList;

// start sending email
const sendTrackingEmail = ids => { // ids must be array of objectid mongoose.Types.ObjectId(id)
    const FunnelList = require('./models/FunnelList');
    const Integration = require('./models/Integration');
    FunnelGenieOrder.aggregate([
        {
            "$match": { _id: { $in: ids } }
        },
        {
            "$group": {
                "_id": {
                    "orderCreator": "$orderCreator",
                    "email": "$shipping_information.email"
                },
                "ids": { "$push": "$_id" },
                "creator": { "$first": "$creator" },
                "merchant_type": { "$first": "$merchant_type" },
                "shipping_information": { "$first": "$shipping_information" },
                "line_items": { "$push": "$line_items" },
                "funnel_source_id": { "$first": "$funnel_source_id" },
                "source_link": { "$first": "$source_link" },
                "sync_from": { "$first": "$sync_from" },
            }
        }
    ]).allowDiskUse(true).exec().then(async datas => {
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            if (data.funnel_source_id) { // handle old order na walang funnel_source_id
                let funnel_data = await FunnelList.findById({ _id: data.funnel_source_id }, { _id: 0, funnel_use_email_tracking: 1, integration_tracking_email: 1 }).catch(err => null);
                let integration = await Integration.findOne({ creator: data.creator, merchant_type: 'klaviyo' }, { _id: 0, private_key: 1 }).catch(err => null);
                let line_items = data.line_items, shipping_information = { merchant_type: data.merchant_type, source_link: data.source_link, ...data.shipping_information };
                let funnel_send_tracking = funnel_data && funnel_data.funnel_use_email_tracking ? true : false;
                let has_integration = (funnel_data && funnel_data.integration_tracking_email ? true : false) && (integration && integration.private_key ? true : false);
                if (has_integration) { // overwrite the send plg tracking if has integration attached to funnel
                    let ocid = funnel_data.integration_tracking_email, apiKey = decryptString(integration.private_key)
                    var url = "https://admin.productlistgenie.io/send_order_confirmation?pk=" + apiKey + "&ocid=" + ocid + "&name=" + shipping_information.name + "&email=" + shipping_information.email + "&a=no&t=" + line_items[0].tracking_number;
                    line_items.forEach(li => {
                        url += "&product=" + li.title + "&price=" + li.price + "&quantity=" + li.quantity;
                    });
                    url = encodeURI(url);
                    fetch(url)
                        .then(res => {
                            console.log("Integration: Sending tracking number result: " + res.ok);
                        })
                } else if (funnel_send_tracking) { // default email if send to plg is checked in funnel settings
                    let source_link = shipping_information.source_link;
                    if (shipping_information.source_link) {
                        let url_object = npm_url.parse(shipping_information.source_link);
                        source_link = url_object.origin;
                    } else {
                        source_link = "https://plg.yalagenie.com";
                    }
                    let payload = {
                        url: source_link,
                        name: shipping_information.name,
                        email: shipping_information.email,
                        lineItems: [],
                        country: shipping_information.country,
                        merchant: shipping_information.merchant_type
                    }
                    line_items.forEach(li => {
                        payload.lineItems.push({ name: li.title, qty: li.quantity, price: li.price, tracking: li.tracking_number, tracking_link: li.tracking_link });
                    });
                    fetch("https://stats.productlistgenie.io/send_tracking", {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    }).then(res => {
                        console.log("PLG: Sending tracking number result: " + res.ok);
                    })
                }
            } else {
                console.log("Walang funnel_source_id and order na to ==>");
                console.group();
                console.log("========== walang funnel_source_id ==========");
                console.log("Creator ID ==>", data.creator);
                console.log("Customer ==>", data._id);
                console.log("==================================================");
                console.groupEnd();
            }
        }
    });
}
// end sending email
// resync all order 
// TODO :: Resyncing in shipping...
const resyncFulfillerOrder = async () => {
    let empty = [null, undefined, ""];
    let match = {
        ...funnel_order_query,
        sync_from: { $nin: empty },
        order_status: { $nin: ["cancelled", "delivered", "paid"] },
        order_type: { $nin: ["subscription"] },
        "line_items.tracking_number": { $nin: empty },
    };
    let result = await FunnelGenieOrder.aggregate([
        {
            "$match": match
        },
        {
            "$group": {
                "_id": {
                    "orderCreator": "$orderCreator",
                    "email": "$shipping_information.email"
                },
                "shipping_information": { "$first": "$shipping_information" },
                "line_items": { "$first": "$line_items" },
                "sync_from": { "$first": "$sync_from" },
            }
        }
    ]).allowDiskUse(true).exec();
    sendEmail("Fulfiller Synching Order", "Synching Order Start", "Synching Order Start Date: " + new Date().toDateString() + ", " + new Date().toLocaleTimeString() + " (Server Time)" + "\nTotal Orders: " + result.length);
    let failed = [];
    for (let i = 0; i < result.length; i++) {
        console.log("Synching:", (i + 1), "/", result.length);
        let order = result[i], isTaqadum = order.sync_from === "taqadum" ? true : false;
        let tracking_result = { data: null, status: 200 };
        if (order.sync_from === "safearrival" || isTaqadum) {
            console.log('shipment safearrival');

            tracking_result = await safeArrivalGetTrackingData(order.line_items.tracking_number, isTaqadum);
        } else if (order.sync_from === "wimo") {
            console.log('shipment wimo');

            tracking_result = await wimoGetTrackingData(order.line_items.tracking_number);
            if (tracking_result.status === 400) tracking_result = await wimoGetTrackingData(order.line_items.tracking_number, true);
        } else if (order.sync_from === "aramex") {
            console.log('shipment aramex');
            tracking_result = {
                status: 200,
                message: "We can't find any order with that reference number",
                data: {
                    order_status: "pickedup"
                }
            };
        } else if (order.sync_from === "fetchr") {
            console.log('shipment fetchr');

            tracking_result = await fetchrGetTrackingData(order.line_items.tracking_number);
        }
        if (tracking_result.status === 200) {
            await FunnelGenieOrder.updateMany({ "line_items.tracking_number": order.line_items.tracking_number }, { $set: tracking_result.data }).lean().then(res => {
                let { data } = tracking_result;
                if (data.order_status === "cancelled") {
                    changeSerialNumberToReturning(order.line_items.tracking_number, order.sync_from);
                } else if (data.order_status === "delivered") {
                    addProductCostToFunds(order.line_items.tracking_number, _points.capitalizeWord(order.sync_from) + " resync automation", order.sync_from);
                }
            });
        } else failed.push({ tracking_number: order.line_items.tracking_number, error_message: tracking_result.message });
    }
    sendEmail("Fulfiller Synching Order", "Synching Order End", "Synching Order End Date: " + new Date().toDateString() + ", " + new Date().toLocaleTimeString() + " (Server Time)");
    // start sending email to dev
    if (failed.length !== 0) {
        const emailPayload = {
            to: "tech@themillionairemastermind.com,markangelo@themillionairemastermind.com",
            from: "error@plg.com",
            subject: "Error Updating Tracking Number",
            text: JSON.stringify(failed),
            html: JSON.stringify(failed)
        }
        _points.customFetch(_points.clientUrl + '/send-error-email', 'POST', emailPayload, resPlgEmail => {
            console.log("Done Sending Error Email sa DEV tech@themillionairemastermind.com,markangelo@themillionairemastermind.com");
        });
    }
    // end sending email to dev
    return result;
}
exports.resyncFulfillerOrder = resyncFulfillerOrder;
// resync all order

const sendMessageToMobile = (sender_id, receiver_id, message_content) => {
    let payload = { "sender_creatorID": sender_id, "reciever_creatorID": receiver_id, "message_content": message_content };
    _points.sendPOST('https://us-central1-productlistgenie-14e76.cloudfunctions.net/webApi/api_plg/v1/sendMessage', payload);
}

const pushNotification = (ids, title, message, url, tag) => {
    let payload = { to: ids, title, message, url: _points.clientUrl + url, tag };
    _points.sendPOST(_points.clientUrl + '/api/pushNotification', payload);
}

exports.resolvers = {
    Query: {
        getFunnelBlocks: async (root, args, { FunnelBlocks }) => {
            if (args.creator) {
                let res = await FunnelBlocks.find({ creator: args.creator });
                // console.log('getFunnelBlocks : FINDD');
                return res;
            } else {
                let res = await FunnelBlocks.find({});
                // console.log('getFunnelBlocks : FINDD no args ');
                return res;
            }
        },
        getCurrentUser: async (root, args, { currentUser, User, Leads }) => {
            if (!currentUser) {
                return null;
            }
            var user = await User.findOne({ email: currentUser.email }).catch(err => null);
            if (!user) {
                throw new Error('User Not Found');
            }
            // save connected store to array if still no value
            if (user.listOfStore.length == 0) {
                if (user.store_token) {
                    await User.findByIdAndUpdate({ _id: user.id }, {
                        $push: {
                            listOfStore: {
                                store_token: user.store_token,
                                store_url: user.store_url,
                                store_phone: user.store_phone,
                                store_location_id: user.store_location_id,
                                active: true
                            }
                        }
                    })
                }
            }

            // kaka register lang
            if (!user.invitedBy) {
                // update tags and referrer
                console.log("getCurrentUser", "/kartratags2")
                const kartra = await fetch(_points.apiServer + '/kartratags2', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: user.kartra ? user.kartra : user.email })
                })
                    .then(res => res.json())
                    .then(result => {
                        return result;
                    })
                    .catch(err => {
                        console.log("Get Current User get kartra", err)
                        throw new Error("An error has occurred while getting kartra tags please try again...")
                    });

                if (kartra) {
                    console.log("getCurrentUser", user.id)
                    user = await User.findByIdAndUpdate({ _id: user.id }, {
                        $set: {
                            kartra_tags: kartra.tags,
                            invitedBy: kartra.invitedBy
                        }
                    });

                    // delete leads (log leads)
                    Leads.find({ $and: [{ email: user.email.toLowerCase(), invitedBy: kartra.invitedBy }] }).remove().exec();
                } else {
                    console.log("getCurrentUser: kartra is empty", kartra)
                }

                // if(kartra.join_date){
                //     var joinDate = new Date(kartra.join_date).toDateString();
                //     var dateNow = new Date().toDateString()
                //     console.log(joinDate, dateNow);
                //     if(dateNow === joinDate){
                //         console.log("Someone just created an account right now with joindate is equal to date now")
                //         fetch(_points.apiServer+'/plgtrialncc', {
                //             method: 'POST',
                //             headers: {
                //                 'Content-Type': 'application/json',
                //             },
                //             body: JSON.stringify({email: user.kartra ? user.kartra : user.email })
                //         })
                //         .then(res => res.json())
                //         .then(result => {
                //             console.log("Success Calling the end point", result);
                //         })
                //     } else {
                //         console.log(user.email + " just created another account right now")
                //     }
                // }
            }

            return findPointsOfUser(user);
        },

        getUserProfile: async (root, args, { currentUser, User }) => {
            if (!currentUser) return null;
            const user = await User.findOne({ email: currentUser.email })
            if (!user) {
                throw new Error('User Not Found');
            }
            return findPointsOfUser(user);
        },

        getAllUsers: async (root, args, { User, currentUser }) => {
            if (!currentUser) return null;
            var query = []
            var sortBy = [
                ['help_request_message', args.sortMessage]
            ];
            // search/filter, sort here
            // handle if representative the one who call this resolver
            if (currentUser.privilege == 5) { // User Privilege
                query.push({
                    $or: [{ sales_rep_id: currentUser.id }]
                })
            }
            // end representative calling
            if (args.search) {
                if (args.isEmail) {
                    query.push({ email: args.search.trim() })
                } else {
                    query.push({
                        $or: [
                            { firstName: new RegExp(args.search.trim(), 'i') },
                            { lastName: new RegExp(args.search.trim(), 'i') },
                            { email: new RegExp(args.search.trim(), 'i') },
                            { kartra: new RegExp(args.search.trim(), 'i') },
                            { store_url: new RegExp(args.search.trim(), 'i') },
                            { access_tags: args.search.trim() },
                            { funnel_genie_domains: new RegExp(args.search.trim(), 'i') }
                        ]
                    })
                }
            } else {
                if (args.fromDate && args.toDate) {
                    var toDate = new Date(args.toDate);
                    query.push({
                        $or: [{
                            joinDate: {
                                "$gte": new Date(args.fromDate).toISOString(),
                                "$lt": new Date(toDate.setDate(toDate.getDate() + 1)).toISOString()
                            }
                        }]
                    })
                }
            }
            if (args.privilege) {
                query.push({
                    $or: [{ privilege: parseInt(args.privilege) }]
                })
            }
            if (args.sort) {
                sortBy.push(
                    ['privilege', args.sort]
                )
            }
            // end search/filter, sort here

            const totalUser = await User.countDocuments({});
            var totalQuery = 0;
            var users = null;
            if (query.length != 0) {
                totalQuery = await User.countDocuments({}).and(query);
                users = await User.find().and(query).sort(sortBy).skip(args.offset).limit(args.limit)
            } else {
                users = await User.find().sort(sortBy).skip(args.offset).limit(args.limit)
            }
            if (!users) {
                throw new Error('User Not Found');
            }
            return users.map(data => {
                return findPointsOfUser(data, totalUser, totalQuery);
            });
        },

        profilePage: async (root, { id }, { User, currentUser }) => {
            if (!currentUser) return null;
            const profile = await User.findById({ _id: id });
            if (!profile) {
                throw new Error('User Not Found');
            }
            return findPointsOfUser(profile);
        },

        // Query Added by jerome
        getAdminSettings: async (root, args, { Admin }) => {
            var result = await Admin.findOne({});
            return result;
        },

        getCustomPageOfPanel: async (root, args, { AdminCustomPage }) => {
            const custom_page = await AdminCustomPage.find({ creator: args.panel_id });
            return custom_page;
        },

        getCustomPageData: async (root, args, { AdminCustomPage }) => {
            const custom_page = await AdminCustomPage.findById({ _id: args.content_id }).catch(err => null);
            return custom_page;
        },

        getLeaderBoards: async (root, args, { User }) => {
            const leaderboards = await User.find().sort({ total_points: "desc" }).limit(10);
            return leaderboards;
        },

        getLeaderBoardsDaily: async (root, args, { User }) => {
            const leaderboards = await User.find({
                "daily_points.points": {
                    $ne: null
                },
                "daily_points.day": _points.getCurrentDateOfTheYear()
            }).sort({ "daily_points.points": "desc" }).limit(10);
            return leaderboards;
        },

        getLeaderBoardsWeekly: async (root, args, { User }) => {
            const leaderboards = await User.find({
                "weekly_points.points": {
                    $ne: null
                },
                "weekly_points.week": _points.getWeekOfTheYear()
            }).sort({ "weekly_points.points": "desc" }).limit(10);
            return leaderboards;
        },

        getAllSalesPerson: async (root, args, { User, currentUser }) => {
            if (!currentUser) return null;
            const salesPerson = await User.find({ privilege: args.privilege }).limit(20); // or level 5 user
            return salesPerson;
        },

        getAllReferrals: async (root, args, { User }) => {
            const invitedBy = await User.find({ invitedBy: args.referralId }).limit(20).sort("-joinDate");
            return invitedBy;
        },

        getAllLeads: async (root, args, { Leads }) => {
            const invitedBy = await Leads.find({ invitedBy: args.referralId }).limit(20).sort("-date");
            return invitedBy;
        },

        getDuplicateConnectedStore: async (root, args, { User }) => {
            var duplicateStore = await User.aggregate([
                {
                    "$group": {
                        "_id": "$store_url",
                        "count": { "$sum": 1 }
                    }
                },
                {
                    "$match": {
                        "count": { "$gt": 1 },
                        "_id": { $nin: [null, ""] }
                    }
                },
                {
                    "$sort": {
                        "count": -1
                    }
                }
            ]).allowDiskUse(true).exec()
            duplicateStore = changeKeyName("_id", "store_url", duplicateStore);
            return duplicateStore;
        },

        searchStoreURL: async (root, args, { User }) => {
            const store_url = await User.find({ store_url: args.store_url });
            return store_url;
        },

        getAllReferrer: async (root, args, { User }) => {
            const all_referral_id = await User.distinct("invitedBy", {
                $and: [
                    {
                        invitedBy: {
                            $ne: null
                        }
                    },
                    {
                        invitedBy: {
                            $ne: "no_referrer"
                        }
                    }
                ]
            })
            const all_referrer = await User.find({ referralId: { $in: all_referral_id } })
            return all_referrer;
        },

        getTopReferrer: async (root, args, { User }) => {
            var dateFilter = new Date().getTime();
            if (args.displayBy == "overall") {
                dateFilter = new Date("2018, 01, 01").getTime();
            } else if (args.displayBy == "weekly") {
                dateFilter = _points.getMondayDateOfTheWeek(new Date());
            } else if (args.displayBy == "daily") {
                dateFilter = dateFilter - 86400000;
            }
            var from = new Date(dateFilter);

            const getReferrals = await User.distinct("invitedBy", {
                $and: [
                    {
                        invitedBy: {
                            $ne: null
                        }
                    },
                    {
                        invitedBy: {
                            $ne: "no_referrer"
                        }
                    }
                ]
            });
            var topReferrer = await User.find({ referralId: { $in: getReferrals } });
            topReferrer = await getReferralCount(topReferrer, from);
            return topReferrer;
        },

        getChinaOrders: async (root, args, { FulfillmentChina }) => {
            var search = {
                $and: []
            };
            if (args.id) {
                console.log("getChinaOrders", args.id)
                search.$and.push({ creator: args.id });
            }
            if (args.filter == "request") {
                search.$and.push({ isRequest: true }, { isFinish: false });
            } else if (args.filter == "approved") {
                search.$and.push({ isApproved: true }, { isFinish: false });
            } else if (args.filter == "denied") {
                search.$and.push({ isDenied: true }, { isFinish: false });
            } else if (args.filter == "order_status") {
                search.isDenied = false;
                search.$and.push({ $or: [{ isFinish: true }, { isPaid: true }] });
            }

            var fulfillmentChina = null;
            if (args.filter == "approved") {
                fulfillmentChina = await FulfillmentChina.find(search).sort("-date_requested").limit(args.limit).catch(err => null);
            } else {
                fulfillmentChina = await FulfillmentChina.find(search).sort("date_requested").limit(50).skip(args.offset).catch(err => null);
            }

            return fulfillmentChina;
        },

        getChinaOrdersCount: async (root, args, { FulfillmentChina }) => {
            var search = {
                $and: []
            };
            if (args.id) {
                console.log("getChinaOrdersCount", args.id);
                search.$and.push({ creator: args.id });
            }
            if (args.filter == "request") {
                search.$and.push({ isRequest: true }, { isFinish: false });
            } else if (args.filter == "approved") {
                search.$and.push({ isApproved: true }, { isFinish: false });
            } else if (args.filter == "denied") {
                search.$and.push({ isDenied: true }, { isFinish: false });
            } else if (args.filter == "order_status") {
                search.isDenied = false;
                search.$and.push({ $or: [{ isFinish: true }, { isPaid: true }] });
            }
            const count = {
                count: search.$and.length != 0 ? await FulfillmentChina.countDocuments(search).catch(err => null) : await FulfillmentChina.countDocuments().catch(err => null)
            }

            return count;
        },

        getNewChinaOrders: async (root, args, { NewFulfillmentChina }) => {
            var search = {
                $and: []
            };
            if (args.id) {
                console.log("getChinaOrders", args.id)
                search.$and.push({ creator: args.id });
            }
            if (args.filter == "request") {
                search.$and.push({ isRequest: true }, { isFinish: false });
            } else if (args.filter == "approved") {
                search.$and.push({ isApproved: true }, { isFinish: false });
            } else if (args.filter == "denied") {
                search.$and.push({ isDenied: true }, { isFinish: false });
            } else if (args.filter == "order_status") {
                search.isDenied = false;
                search.$and.push({ isFinish: true });
            } else if (args.filter == "toship") {
                search.$and.push({ isPaid: true });
            }

            var fulfillmentChina = await NewFulfillmentChina.find(search).sort("date_requested").limit(args.limit).skip(args.offset).catch(err => null);

            return fulfillmentChina;
        },

        getNewChinaOrdersCount: async (root, args, { NewFulfillmentChina }) => {
            var search = {
                $and: []
            };
            if (args.id) {
                console.log("getChinaOrdersCount", args.id);
                search.$and.push({ creator: args.id });
            }
            if (args.filter == "request") {
                search.$and.push({ isRequest: true }, { isFinish: false });
            } else if (args.filter == "approved") {
                search.$and.push({ isApproved: true }, { isFinish: false });
            } else if (args.filter == "toship") {
                search.$and.push({ isPaid: true });
            } else if (args.filter == "denied") {
                search.$and.push({ isDenied: true }, { isFinish: false });
            } else if (args.filter == "order_status") {
                search.isDenied = false;
                search.$and.push({ $or: [{ isFinish: true }, { isPaid: true }] });
            }
            const count = {
                count: search.$and.length != 0 ? await NewFulfillmentChina.countDocuments(search).catch(err => null) : await NewFulfillmentChina.countDocuments().catch(err => null)
            }

            return count;
        },

        getAdminChinaOrdersUSERS: async (root, args, { User, FulfillmentChina }) => {
            var filter = {
                $and: []
            };
            if (args.filter == "request") {
                filter.$and.push({
                    isRequest: true
                });
            } else if (args.filter == "approved") {
                filter.$and.push({
                    isApproved: true
                });
            } else if (args.filter == "print label") {
                filter.$and.push({
                    $or: [
                        {
                            isPaid: true
                        },
                        {
                            isFinish: true
                        }
                    ]
                });
            } else if (args.filter == "denied") {
                filter.$and.push({
                    isDenied: true
                });
            }

            const ids = await FulfillmentChina.distinct("creator", filter.$and.length != 0 ? filter : void 0);
            const users = await User.find({ _id: { $in: ids } }).sort({ recentPaid: -1 })
            return users.map(data => {
                return getTotalRequestList(data);
            });
        },

        getAdminNewChinaOrdersUSERS: async (root, args, { User, NewFulfillmentChina, NewVirtualWarehouse }) => {
            var filter = {
                $and: []
            };
            if (args.filter == "request") {
                filter.$and.push({
                    isRequest: true
                });
            } else if (args.filter == "approved") {
                filter.$and.push({
                    isApproved: true
                });
            } else if (args.filter == "print label") {
                filter.$and.push({
                    $or: [
                        {
                            isPaid: true
                        },
                        {
                            isFinish: true
                        }
                    ]
                });
            } else if (args.filter == "denied") {
                filter.$and.push({
                    isDenied: true
                });
            } else if (args.filter == "toship") {
                filter.$and.push({
                    isPaid: true
                });
            }

            var ids = null;
            if (args.filter == "bulk") {
                ids = await NewVirtualWarehouse.distinct("creator");
            } else {
                ids = await NewFulfillmentChina.distinct("creator", filter.$and.length != 0 ? filter : void 0);
            }
            const users = await User.find({ _id: { $in: ids } }).sort({ recentPaid: -1 })
            return users.map(data => {
                return getTotalNewRequestList(data);
            });
        },

        getPaidOrders: async (root, args, { User, PaidOrders }) => {
            console.log("getPaidOrders", args.id);
            const paidOrders = await PaidOrders.find({ creator: args.id }).sort([['trackingNumberAvailable', 1], ['date_paid', -1]]);
            // tag this user as not recent payer
            await User.findByIdAndUpdate({ _id: args.id }, { $set: { recentPaid: false } })

            return paidOrders;
        },

        getPaidOrder: async (root, args, { User, FulfillmentChina }) => {
            console.log("getPaidOrder", args.orderid);
            const paidOrder = await FulfillmentChina.findById({ _id: args.orderid });
            // tag this user as not recent payer
            await User.findByIdAndUpdate({ _id: args.id }, { $set: { recentPaid: false } })

            return paidOrder;
        },

        getOrderObject: async (root, args, { FulfillmentChina }) => {
            console.log("getOrderObject", args.id);
            const orderObject = await FulfillmentChina.findById({ _id: args.id });

            return orderObject;
        },

        getAllOrdersID: async (root, args, { OrdersID }) => {
            console.log("getAllOrdersID", args.id);
            const orders_id = await OrdersID.findOne({ creator: args.id });

            return orders_id;
        },

        getAllNewOrdersID: async (root, args, { NewOrdersID }) => {
            const orders_id = await NewOrdersID.findOne({ creator: args.id }).catch(err => null);

            return orders_id;
        },

        getFulfillmentCenterMessage: async (root, args, { Conversation }) => {
            const conversation = await Conversation.findOne({ senderID: args.id });

            return conversation;
        },

        getCountOfAllMessage: async (root, args, { Conversation }) => {
            var count = {};
            if (args.id) {
                var newChatCount = await Conversation.findOne({ senderID: args.id }).select("newChatCount -_id");
                if (newChatCount) {
                    count.count = newChatCount.newChatCount
                } else {
                    count.count = 0;
                }
            } else {
                count.count = await Conversation.countDocuments({ seen: false });
            }

            return count;
        },

        getpaypalPaymentLogs: async (root, args, { PaymentLogs }) => {
            const logs = await PaymentLogs.find({ creator: args.id })

            return logs;
        },

        getApprovedUser: async (root, args, { User }) => {
            var users = null;
            if (args.search) {
                var regex = new RegExp(args.search, "gi");
                if (args.search) {
                    users = await User.find({
                        $or: [
                            { firstName: regex },
                            { lastName: regex },
                            { email: regex },
                            { kartra: regex },
                            { store_url: regex },
                        ]
                    }).sort("-hasFulfillmentMessage").catch(err => []);
                }
            } else {
                users = await User.find({}).sort("-hasFulfillmentMessage").limit(20).catch(err => []);
            }

            return users;
        },

        getAllPaidOrder: async (root, args, { FulfillmentChina }) => {
            const paidOrder = await FulfillmentChina.find({
                $or: [
                    { isPaid: true },
                    { isFinish: true }
                ]
            }).sort({ tracking_number: 1 })

            return paidOrder;
        },

        getAdminHomepageVideo: async (root, args, { Admin }) => {
            const HomepageVideo = await Admin.findOne({});

            return HomepageVideo;
        },

        getVirtualInventory: async (root, args, { VirtualWarehouse }) => {
            const vw_result = await VirtualWarehouse.find({ creator: args.id, isPaid: args.isPaid });

            return vw_result;
        },

        getTopupLogs: async (root, args, { TopupLogs }) => {
            const topupLogs = await TopupLogs.find({ creator: args.id }).limit(args.limit).skip(args.offset).sort('-date_paid');

            return topupLogs;
        },

        getTopupLogsCount: async (root, args, { TopupLogs }) => {
            var count = {
                count: await TopupLogs.countDocuments({ creator: args.id }).catch(err => 0)
            };

            return count;
        },

        getCreditLogs: async (root, args, { CreditsLog }) => {
            const topupLogs = await CreditsLog.find({ creator: args.id }).limit(args.limit).skip(args.offset).sort('-date_paid');

            return topupLogs;
        },

        getCreditLogsCount: async (root, args, { CreditsLog }) => {
            var count = {
                count: await CreditsLog.countDocuments({ creator: args.id })
            };

            return count;
        },

        getBulkRequest: async (root, args, { NewVirtualWarehous }) => {
            var newvw = null;
            if (args.id) {
                newvw = await NewVirtualWarehouse.find({ creator: args.id });
            } else {
                newvw = await NewVirtualWarehouse.find({});
            }

            return newvw;
        },

        getOrderCount: async (root, args, { NewFulfillmentChina }) => {
            var filter = {
                creator: args.id
            }
            if (args.filter == "request") {
                filter.isRequest = true;
            } else if (args.filter == "approved") {
                filter.isApproved = true;
            } else if (args.filter == "toship") {
                filter.isPaid = true;
            } else if (args.filter == "denied") {
                filter.isDenied = true;
            }
            var count = {
                count: await NewFulfillmentChina.countDocuments(filter)
            };

            return count;
        },

        getUserFunnelGenie: async (root, args, { FunnelGenie, FunnelGenieID }) => {
            var funnel_list = null, limit = args.limit ? args.limit : 0, skip = args.page ? args.page - 1 : 0;
            if (!args.funnel_name) {
                var match = {
                    "creator": mongoose.Types.ObjectId(args.id)
                }
                if (args.searchFunnel) {
                    try {
                        match.funnel_name = new RegExp(args.searchFunnel.replace(/\s/g, "-"), "gi");
                    } catch (err) {
                        console.error("Error in getUserFunnelGenie ==>", err);
                    }
                }
                funnel_list = await FunnelGenie.aggregate([
                    {
                        "$match": match
                    },
                    {
                        "$group": {
                            "_id": {
                                "funnel_name": "$funnel_name",
                                "domainIndex": "$domainIndex"
                            },
                            "ids": { $push: "$_id" },
                            "design": { $push: { $arrayElemAt: ["$design", -1] } },
                            "sendPLGEmailConfirmation": { $first: "$sendPLGEmailConfirmation" },
                            "sendPLGEmailAbandonment": { $first: "$sendPLGEmailAbandonment" },
                            "funnel_type": { $first: "$funnel_type" },
                            "funnel_phone": { $first: "$funnel_phone" },
                            "funnel_isWhatsApp": { $first: "$funnel_isWhatsApp" },
                            "funnel_address": { $first: "$funnel_address" },
                            "funnel_email": { $first: "$funnel_email" },
                            "funnel_selected_merchant": { $first: "$funnel_selected_merchant" },
                            "funnel_stripe_public": { $first: "$funnel_stripe_public" },
                            "funnel_stripe_private": { $first: "$funnel_stripe_private" },
                            "funnel_other": { $first: "$funnel_other" },
                            "paypalClientID": { $first: "$paypalClientID" },
                            "confirmationEmail": { $first: "$confirmationEmail" },
                            "abandonmentEmail": { $first: "$abandonmentEmail" },
                            "trackingEmail": { $first: "$trackingEmail" },
                            "favicon_link": { $first: "$favicon_link" },
                            "facebook_id": { $first: "$facebook_id" },
                            "google_id": { $first: "$google_id" },
                            "tiktok_id": { $first: "$tiktok_id" },
                            "snapchat_id": { $first: "$snapchat_id" },
                            "count": { "$sum": 1 }
                        }
                    },
                    {
                        "$sort": {
                            "date_created": -1,
                            "design.date": -1
                        }
                    },
                    // { $skip: skip * limit },
                    // { $limit: limit }
                ]).allowDiskUse(true).exec(); // for exceeding the limit of ram
                // convert ids to string
                funnel_list = funnel_list.map(el => {
                    el.ids = el.ids.map(el => el.toString())
                    return el;
                })
                funnel_list = await changeKeyName("_id", "funnel_object", funnel_list);
            } else {
                funnel_list = await FunnelGenie.find({ creator: args.id, domainIndex: args.domainIndex, funnel_name: args.funnel_name }).limit(limit)
            }

            // start creating funnel id
            if (!args.funnel_name && funnel_list.length != 0) {
                funnel_list.forEach(funnel => {
                    var saveData = { creator: args.id, funnel_name: funnel.funnel_object.funnel_name, domainIndex: funnel.funnel_object.domainIndex, page_ids: funnel.ids };
                    FunnelGenieID.findOne({ creator: args.id, funnel_name: funnel.funnel_object.funnel_name, domainIndex: funnel.funnel_object.domainIndex }).then(searchFunnelID => {
                        if (!searchFunnelID) {
                            new FunnelGenieID(saveData).save();
                        }
                    });
                })
            }
            // end creating funnel id
            return funnel_list;
        },
        // TODO :: Adding Generated Button Resolver
        buttons: async (root, args, { Generatedbutton }) => {
            return await Generatedbuttons.find({});
        },
        getTotalButton: async (root, args, { Generatedbutton }) => { // get total funnel genie count
            var query = { creator: args.creator };
            if (args.search) {
                var regex = new RegExp(args.search, "gi");
                query.$or = [{ buttonTitle: regex }]
            }
            return { count: await Generatedbuttons.countDocuments(query) };
        },
        getGeneratedButton: async (root, args, { Generatedbutton }) => { // Funnel Genie Main
            let query = { creator: args.creator }, limit = typeof args.limit !== "undefined" ? args.limit : 10, skip = args.page ? (args.page - 1) * limit : 0;
            if (args.search) {
                let regex = new RegExp(args.search.replace(/\s/g, "-"), "gi");
                query.$or = [{ buttonTitle: regex }];
            }
            return Generatedbuttons.find(query).limit(limit).skip(skip).sort('-date_modified').then(buttons => {
                // console.log("THis was the buttons decipheredss =>> ", buttons);                
                return buttons.map(btn => {
                    btn.orderItems = FunnelGenieOrder.find({ plgbuttonID: btn.id, creator: args.creator }, { line_items: 1, currencyWord: 1, currencySymbol: 1 }).then(res => {
                        if (res.length !== 0) {
                            // console.log(btn.id ,'res buttons with funnel Orders', res.length);
                            let totalConvertedPrice = res.map(orders => {
                                // console.log(orders);
                                // get the estimated dollar
                                // console.log(); 
                                let wonvertedPrice = 0;
                                wonvertedPrice += parseFloat((orders.line_items.price / convertObject.rates[orders.currencyWord ? orders.currencyWord : "USD"]).toFixed(2));
                                // convertObject.rates[orders.currencyWord]                            
                                return wonvertedPrice;
                            });

                            return totalConvertedPrice.reduce((a, b) => a + b, 0);
                        } else {
                            return 0;
                        }
                    });
                    return btn;
                });
            });
            // return result;
        },


        //July1 PageTemplates


        getPageTemplates: async (root, args) => {
            return await PageTemplates.find({ creator: args.creator }); // wag lagyan ng .lean() dahil ndi nalabas ung default value ng model
        },

        //July1




        getButtonById: async (root, args, { Generatedbutton }) => {
            return await Generatedbuttons.findById({ _id: args.id }); // wag lagyan ng .lean() dahil ndi nalabas ung default value ng model
        },

        getTotalFunnel: async (root, args, { FunnelList }) => { // get total funnel genie count
            var query = { creator: args.creator };
            if (args.search) {
                var regex = new RegExp(args.search, "gi");
                query.$or = [{ domain_name: regex }, { funnel_name: regex }]
            }
            return { count: await FunnelList.countDocuments(query) };
        },

        getFunnelList: async (root, args, { FunnelList, FunnelPageList }) => { // Funnel Genie Main
            let query = { creator: args.creator }, limit = typeof args.limit !== "undefined" ? args.limit : 10, skip = args.page ? (args.page - 1) * limit : 0;
            if (args.search) {
                let regex = new RegExp(args.search.replace(/\s/g, "-"), "gi");
                query.$or = [{ domain_name: regex }, { funnel_name: regex }];
            }
            const result = await FunnelList.find(query).limit(limit).skip(skip).sort('-date_modified');
            // this will only run once per pagination for updating the funnel page count next reload of user will not fire this
            if (args.show_page_count && result.length !== 0 && !result[0].page_count) {
                for (var i = 0; i < result.length; i++) {
                    if (!result[i].page_count) { // this is for fail safe only in case may 0 page count sa una para ung 0 page lang ung iuupdate
                        const totalFunnelPage = await FunnelPageList.countDocuments({ funnel_id: result[i].id }).lean();
                        result[i].page_count = totalFunnelPage;
                        await FunnelList.findByIdAndUpdate({ _id: result[i].id }, { $set: { page_count: totalFunnelPage } });
                    }
                }
            }
            return result;
        },

        getFunnelById: async (root, args, { FunnelList }) => {
            return await FunnelList.findById({ _id: args.funnel_id }); // wag lagyan ng .lean() dahil ndi nalabas ung default value ng model
        },

        getFunnelPageList: async (root, args, { FunnelList, FunnelPageList }) => { // Funnel Genie Pages
            const loadLastDesign = args.loadLastDesign ? { design: { $slice: -1 } } : null;
            const query = { funnel_id: args.funnel_id };
            if (args.page_type) query.page_type = args.page_type;
            if (args.not_in_page_type) query.page_type = { $nin: [args.not_in_page_type] };
            const funnel = await FunnelList.findById({ _id: args.funnel_id }, { funnel_name: 1, domain_name: 1, _id: 0 }).lean();
            const pageList = await FunnelPageList.find(query, loadLastDesign).then(res => {
                res = res.map(el => {
                    el.funnel_name = funnel.funnel_name;
                    el.domain_name = funnel.domain_name;
                    return el;
                })
                return res;
            })
            return pageList;
        },

        getFunnelPageById: async (root, args, { FunnelList, FunnelPageList, FunnelEmailSequenceV1 }) => { // Funnel Genie Editor
            const loadLastDesign = args.loadLastDesign ? { design: { $slice: -1 } } : null;
            const page = await FunnelPageList.findById({ _id: args.page_id }, loadLastDesign);
            if (args.include_funnel_setting) { // add additional data to pages from funnel to result 
                const funnel = await FunnelList.findById({ _id: page.funnel_id }); // wag lagyan ng .lean() dahil ndi nalabas ung default value ng model
                const funnel_integration = await FunnelEmailSequenceV1.find({ funnel_id: page.funnel_id })
                page.funnel_name = funnel.funnel_name;
                page.domain_name = funnel.domain_name;
                page.is_cod_funnel = funnel.is_cod_funnel;
                page.funnel_use_email_confirmation = funnel.funnel_use_email_confirmation;
                page.funnel_use_email_abandonment = funnel.funnel_use_email_abandonment;
                page.is_fulfill_by_plg = funnel.is_fulfill_by_plg;
                page.funnel_is_phone_whatsapp = funnel.funnel_is_phone_whatsapp;
                page.funnel_enable_floating_bar = funnel.funnel_enable_floating_bar;
                page.funnel_enable_floating_bar_link = funnel.funnel_enable_floating_bar_link;
                page.funnel_type = funnel.funnel_type;
                page.funnel_phone = funnel.funnel_phone;
                page.funnel_email = funnel.funnel_email;
                page.funnel_currency = funnel.funnel_currency;
                page.funnel_address = funnel.funnel_address;
                page.funnel_favicon_link = funnel.funnel_favicon_link;
                page.funnel_facebook_id = funnel.funnel_facebook_id;
                page.funnel_facebook_access_token = funnel.funnel_facebook_access_token;
                page.funnel_google_id = funnel.funnel_google_id;
                page.funnel_tiktok_id = funnel.funnel_tiktok_id;
                page.funnel_everflow = funnel.funnel_everflow;
                page.funnel_snapchat_id = funnel.funnel_snapchat_id;
                page.funnel_pixel_id = funnel.funnel_pixel_id;
                page.gateway_selected_merchant = funnel.gateway_selected_merchant;
                page.gateway_stripe_public = funnel.gateway_stripe_public;
                page.gateway_stripe_private = funnel.gateway_stripe_private;
                page.gateway_other = funnel.gateway_other;
                page.gateway_paypal_client_id = funnel.gateway_paypal_client_id;
                page.integration_confirmation_email = funnel.integration_confirmation_email;
                page.integration_abandonment_email = funnel.integration_abandonment_email;
                page.integration_tracking_email = funnel.integration_tracking_email;
                page.funnel_integration = JSON.stringify(funnel_integration);
            }
            return page;
        },

        getFunnelEmailSequenceV1: async (root, args, { FunnelEmailSequenceV1 }) => {
            return await FunnelEmailSequenceV1.find(args);
        },

        getFunnelEmailSequenceV2: async (root, args, { FunnelEmailSequenceV2 }) => {
            return await FunnelEmailSequenceV2.find(args);
        },

        getPageOfFunnelGenie: async (root, args, { FunnelGenie, FunnelIntegration }) => {
            var funnel_page = await FunnelGenie.findById({ _id: args.id })
            const funnelSource = funnel_page.creator + "_" + funnel_page.domainIndex + "_" + funnel_page.funnel_name;
            const funnelIntegration = await FunnelIntegration.find({ creator: funnel_page.creator, funnelSource: funnelSource })
            if (funnelIntegration.length != 0) {
                funnel_page.funnelIntegration = JSON.stringify(funnelIntegration);
            } else {
                funnel_page.funnelIntegration = "[]";
            }
            return funnel_page;
        },

        getFunnelPages: async (root, args, { FunnelGenie, FunnelIntegration }) => {
            const limit = args.limit ? args.limit : 0, page = args.page ? args.page - 1 : 0, query = {};
            if (args.id) query.creator = args.id;
            if (args.funnel_name) query.funnel_name = args.funnel_name;
            if (args.domainIndex) query.domainIndex = args.domainIndex;
            const result = await FunnelGenie.find(query).limit(limit).skip(page)
            return result;
        },

        getSearchedUsers: async (root, args, { User }) => { // search user in copy funnel page
            var users = [];
            var regex = new RegExp(args.search, "gi");
            if (args.search) {
                var search = {
                    $or: [
                        { firstName: regex },
                        { lastName: regex },
                        { email: regex },
                        { kartra: regex },
                        { store_url: regex },
                        { funnel_genie_domains: regex }
                    ]
                }
                if (args.filter == "funnel_genie_domains") {
                    search.$and = [
                        {
                            funnel_genie_domains: {
                                $nin: [null, ""]
                            }
                        }
                    ]
                }
                users = await User.find(search).catch(err => []);
            }

            return users;
        },

        getTotalTopup: async (root, args, { TopupLogs }) => {
            var total_topup = await TopupLogs.aggregate([
                {
                    "$group": {
                        "_id": null,
                        "count": { "$sum": "$total_topup" }
                    }
                }
            ]).allowDiskUse(true).exec();
            var count = {
                count: total_topup[0].count
            }

            return count;
        },

        getMyIntegrations: async (root, args, { Integration }) => {
            var searchArgs = { creator: args.id }
            if (args.merchant_type) searchArgs.merchant_type = args.merchant_type;
            var myintegration = await Integration.find(searchArgs);

            return myintegration;
        },

        // TODO:: GETMY FUNNEL ORDERS HACK: NOTE:
        // HACK:

        getMyFunnelOrders: async (root, args, { FunnelGenieOrder, FunnelGenie, FunnelList, FunnelProducts, User }) => { // Funnel Orders
            var match = { order_type: { $nin: ["subscription"] } };
            // console.log('orders argssss ===> ',args); // para di sumama ung subscription sa user funnel order
            var sort = "order_date";
            var limit = 20, skip = args.skip ? args.skip * limit : 0;

            if (args.paid_cc !== null) {

                if (args.paid_cc) {
                    match["paid_cc"] = { $in: [true] };
                } else if (!args.paid_cc) {
                    match["paid_cc"] = { $in: [false, null, true] };
                } else {
                    match["paid_cc"] = { $in: [true, false, null] };
                }
            }

            if (args.plgbuttonID) {
                console.log('plgbutton macthess =======' + args.plgbuttonID);
                match['plgbuttonID'] = { $in: [args.plgbuttonID] };
            }

            if (args.id) match.creator = mongoose.Types.ObjectId(args.id); // filter order creator by user id
            if (args.cod_analytics) {
                match["line_items.plg_sku"] = { $nin: ["000", "0000"] };
                match.fulfill_with_plg = { $in: [true, null] }; // null kc ung mga old order ung mga bago true na value false ung mga ndi i fufulfill ng PLG
            }
            if (args.returning_items) {
                match["line_items.plg_serialNumber.0"] = { $exists: true };
            }

            if (args.merchant_type) match.merchant_type = args.merchant_type;

            if (args.funnel_id) { // filter by funnel id
                const funnel = await FunnelList.findById({ _id: args.funnel_id }).lean();
                const ids = funnel.old_page_ids.concat(args.funnel_id); // search order by old ids plus funnel id
                match.funnel_source_id = { $in: ids }
            } else if (args.funnel_name) { // filter order by funnel id (old query dahil na update na ung funnel)
                const funnels = await FunnelGenie.find({ creator: args.id, funnel_name: args.funnel_name, domainIndex: args.domainIndex });
                const ids = funnels.map(el => el.id)
                match.funnel_source_id = { $in: ids }
            }

            if (args.filterByStartDate && args.filterByEndDate) { // filter by date range
                const convertedDate = formatStartAndEndDate(args.filterByStartDate, args.filterByEndDate, "getMyFunnelOrders");
                if (!args.order_status || args.order_status == "unpaid" || args.order_status == "unfulfilled") {
                    match.order_date = { $gte: convertedDate.start, $lt: convertedDate.end };
                } else if (args.order_status.includes("delivered") || args.order_status.includes("paid")) {
                    match.dateStatusDelivered = { $gte: convertedDate.start, $lt: convertedDate.end };
                } else {
                    // match.order_status_update = { // dating value dko alam bkt ganto to may reason cgro bkt eto nka lagay dito pero for the mean time pinaltan ko muna
                    match.order_date = { $gte: convertedDate.start, $lt: convertedDate.end };
                }
            }
            if (args.fulfillerLocation) { // filter by fulfiller location
                if (args.fulfillerLocation == "-") match["shipping_information.country"] = { $in: [null, "", undefined] }; // for manage cod orders (no country)
                else if (args.fulfillerLocation == "ALL") match["shipping_information.country"] = { $in: _points.cod_available_country("order_filter") }; // if all use all cod_available country
                else if (args.fulfillerLocation !== "ALL") match["shipping_information.country"] = { $in: [args.fulfillerLocation, iso3to2[args.fulfillerLocation] ? iso3to2[args.fulfillerLocation] : args.fulfillerLocation] }; // if not all use the fulfiller location
            }
            if (args.order_status) { // filter by order_status
                if (args.order_status == "unpaid" || args.order_status == "unfulfilled") {
                    match.order_status = { $in: ['unfulfilled', 'unpaid'] };
                } else if (args.order_status == "hold") {
                    match.order_status = { $in: ['hold', 'pending'] };
                } else {
                    match.order_status = { $in: args.order_status.split(",") }
                }
            };
            if (args.ref_track) {
                let ref_track = await FunnelGenieOrder.find({ "line_items.ref_track": args.ref_track }, { _id: 1 }).lean().catch(err => []);
                if (ref_track.length !== 0) {
                    delete args.orderid; // remove orderid dahil merong ref_track
                    match["line_items.ref_track"] = args.ref_track;
                }
            }


            if (args.orderid) { // orderid or email or name
                let decodeID = args.orderid, isArray = false;
                try { // expected error pag di parsable
                    decodeID = JSON.parse(decodeID);
                    isArray = _points.isArray(decodeID);
                } catch (err) { }
                if (!isArray) decodeID = [decodeID];
                let decodeIDs = decodeID.filter(e => _points.isValidString(e));
                if (decodeIDs.length !== 0) { // if search filter order by ref or sku
                    decodeIDs = decodeIDs.map(e => mongoDBId.decode(e));
                    let convertedDecodeIDs = decodeIDs.map(e => { return { isObjectId: mongoose.Types.ObjectId.isValid(e), id: e } }).filter(e => e.isObjectId); // convert id or sku to mongodbid
                    if (convertedDecodeIDs.length !== 0) { // if meron search
                        const orderCreatorData = await FunnelGenieOrder.find({ _id: { $in: convertedDecodeIDs.map(e => e.id) } }, { orderCreator: 1, "shipping_information.email": 1 });
                        if (orderCreatorData.length !== 0) { // if may result
                            match.orderCreator = { $in: orderCreatorData.map(e => e.orderCreator) };
                            match["shipping_information.email"] = { $in: orderCreatorData.map(e => e.shipping_information.email) };
                        } else { // else search for more query
                            searchOther();
                        }
                    } else { // else search for more query
                        searchOther();
                    }
                } else { // if search filter order by normal text
                    if (args.ref_track) throw new Error("Invalid Tracking Number"); // prevent from searching to other column (expectedly from tracking page)
                    // start for searching sa affiliate email or product name
                    let searchParams = decodeID;
                    try {
                        searchParams = searchParams.map(e => {
                            return e.toString().replace('+', '\\+').replace(/\s/g, "(\\s+)");
                        })
                    } catch (err) {
                        console.error("Error in getMyFunnelOrders 1 ==>", err);
                    }
                    let regexp = new RegExp(searchParams.join("|"), "gi");
                    let affQuery = { $or: [{ affiliateEmail: { $in: searchParams } }, { productName: regexp }] };
                    let affiliateEmailProductID = await FunnelProducts.find(affQuery, { _id: 1 }).catch(err => []);
                    let customers_id_list = [];
                    if (affiliateEmailProductID.length !== 0) {
                        let converted_affiliateEmailProductID = affiliateEmailProductID.map(e => mongoDBId.encode(e._id));
                        const customers_ids = await FunnelGenieOrder.find({ "line_items.plg_sku": { $in: converted_affiliateEmailProductID } }, { orderCreator: 1 }).then(res => res.map(el => el.orderCreator)).catch(err => []);
                        if (customers_ids.length != 0) customers_id_list = customers_ids;
                    }
                    // end for searching sa affiliate email or product name
                    searchOther(affiliateEmailProductID, customers_id_list);
                }
                function searchOther(affId, cids) {
                    let emailOrName = decodeID;
                    try {
                        emailOrName = emailOrName.map(e => {
                            return e.toString().replace('+', '\\+').replace(/\s/g, "(\\s+)");
                        })
                    } catch (err) {
                        console.error("Error in getMyFunnelOrders 2 ==>", err);
                    }
                    let regexp = new RegExp(emailOrName.join("|"), "gi");
                    if (affId && affId.length !== 0) { // if meron affiliate id
                        if (cids && cids.length !== 0) { // filter by affiliate
                            match.$or = [
                                { "orderCreator": { $in: cids } },
                                { "line_items.plg_sku": affId }
                            ]
                        } else { // filter by sku
                            match["line_items.plg_sku"] = affId;
                        }
                    } else { // search to this field
                        match.$or = [
                            { "shipping_information.name": regexp },
                            { "shipping_information.email": regexp },
                            { "shipping_information.phone": regexp },
                            { "line_items.plg_sku": regexp },
                            { "line_items.tracking_number": regexp },
                            { "line_items.title": regexp },
                            { "line_items.plg_serialNumber": regexp },
                            { "line_items.ref_track": regexp },
                            { "line_items.shopify_order_number": regexp }
                        ]
                    }
                }
            }


        
            if (args.variantIDS) match["line_items.plg_sku"] = { $in: args.variantIDS.split(",") };
            if (args.sortBy) sort = args.sortBy;
            if (args.limit) limit = args.limit;
            if (args.serial_numbers) match["line_items.plg_serialNumber"] = { $in: JSON.parse(args.serial_numbers) };
            if (typeof args.isPaidCommision !== "undefined") match.isPaidCommision = { $in: args.isPaidCommision ? [args.isPaidCommision] : [false, null] };
            if (args.tracking_courier) match.sync_from = args.tracking_courier;
            if (typeof args.show_courier_collected != "undefined" && args.show_courier_collected != "") {
                match.received_payment_from_courier = args.show_courier_collected == "collected" ? true : { $in: [false, null] };
            }

            // to find ids length ...   
            if (args.ids) {
                const searchIdsLog = await FunnelGenieOrder.find({ _id: { $in: [args.ids] } }, { orderCreator: 1, "shipping_information.email": 1 });
                if (searchIdsLog.length !== 0) { // if may result
                    match.orderCreator = { $in: searchIdsLog.map(e => e.orderCreator) };
                    match["shipping_information.email"] = { $in: searchIdsLog.map(e => e.shipping_information.email) };
                }
            }

            //TODO :: To find by CALLID 
            if (args.callId) {
                match['callId'] = args.callId;
            }


            // HACK :: // ! Pansamantagal resolve thru this query
            var totalOrders = await FunnelGenieOrder.aggregate([{ "$match": match }, { "$group": { "_id": { "orderCreator": "$orderCreator" } } }]).allowDiskUse(true).exec();
            if (args.funnel_id || args.funnel_name) {
                if (totalOrders.length) {
                    match.orderCreator = { $in: totalOrders.map(e => e._id.orderCreator) };  
                    delete match.funnel_source_id;
                    totalOrders = await FunnelGenieOrder.aggregate([{ "$match": match }, { "$group": { "_id": { "orderCreator": "$orderCreator" } } }]).allowDiskUse(true).exec();
                }
            }

            var myorders = await FunnelGenieOrder.aggregate([
                {
                    "$match": match
                },
                {
                    "$addFields": {
                        "line_items.payment_status": "$order_status" ,
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "orderCreator": "$orderCreator",
                            "email": "$shipping_information.email"
                        },
                        "ids": { "$push": "$_id" },
                        "safeArrivalID": { "$first": "$safeArrivalID" },
                        "creator": { "$first": "$creator" },
                        "orderCreator": { "$first": "$orderCreator" },
                        "dateStatusDelivered": { "$first": "$dateStatusDelivered" },
                        "order_date": { "$first": "$order_date" },
                        "callId": { "$first": "$callId" },
                        "order_status_update": { "$first": "$order_status_update" },
                        "merchant_type": { "$first": "$merchant_type" },
                        "paid_cc": { "$first": "$paid_cc" },
                        "plgbuttonID": { "$first": "$plgbuttonID" },
                        "has_pod": { "$first": "$has_pod" },
                        "design_url": { "$first": "$design_url" },
                        "order_status": { "$first": "$order_status" },
                        "cancel_note": { "$first": "$cancel_note" },
                        "currencyWord": { "$first": "$currencyWord" },
                        "currencySymbol": { "$first": "$currencySymbol" },
                        "shipping_information": { "$first": "$shipping_information" },
                        "line_items": { "$push": "$line_items" },
                        "fulfillment_status": { "$first": "$fulfillment_status" },
                        "risk_level": { "$first": "$risk_level" },
                        "test_data": { "$first": "$test_data" },
                        "funnel_source_id": { "$first": "$funnel_source_id" },
                        "sync_from": { "$first": "$sync_from" },
                        "sms_verified": { "$first": "$sms_verified" },
                        "fulfill_with_plg": { "$first": "$fulfill_with_plg" },
                        "isPaidProductCost": { "$first": "$isPaidProductCost" },
                        "isPaidCommision": { "$first": "$isPaidCommision" },
                        "isManualModified": { "$first": "$isManualModified" },
                        "received_payment_from_courier": { "$first": "$received_payment_from_courier" },
                        "raw_data": { "$push": "$raw_data" },
                        "source_link": { "$first": "$source_link" },
                        "updateByName": { "$first": "$updateByName" },
                        "campaign_src": { "$first": "$campaign_src" },
                        "count": { "$first": totalOrders ? totalOrders.length : 0 }
                    }
                },
                { "$sort": { [sort]: -1 } },
                { $skip: skip },
                { $limit: limit }
            ]).allowDiskUse(true).exec().then(async res => {
                var userParseData = {}
                var distinctCreatorData = [...new Set(res.map(el => el.creator.toString()))].filter(el => el); // distinct creator so we can remove redundunt search by creator
                // this loop get the user data of distinct creator id
                for (var index = 0; index < distinctCreatorData.length; index++) {
                    var id = distinctCreatorData[index];
                    if (id && mongoose.Types.ObjectId.isValid(id)) {
                        userParseData[id] = await User.findById({ _id: id }).then(res => {
                            if (!res) return JSON.stringify({});
                            return JSON.stringify({
                                id,
                                email: res.email,
                                name: res.firstName + " " + res.lastName,
                                firstName: res.firstName,
                                lastName: res.lastName,
                                user_session_cookie: res.user_session_cookie,
                                privilege: res.privilege,
                                profileImage: res.profileImage,
                                business_name: res.business_name,
                                business_email: res.business_email,
                                account_number: res.account_number,
                                wire_transfer_number: res.wire_transfer_number,
                                payoneer_details: res.payoneer_details,
                                bank_code: res.bank_code,
                                routing_number: res.routing_number,
                                account_type: res.account_type,
                                address: res.address,
                                funnel_genie_domains: res.funnel_genie_domains
                            })
                        })
                    }
                }
                var distinctSku = res.map(el => {
                    return el.line_items.map(li => {
                        if (li.plg_serialNumber && li.plg_serialNumber.length != 0) {
                            return li.plg_serialNumber.map(sn => {
                                return sn.split("_")[1];
                            });
                        } else {
                            return li.plg_sku ? li.plg_sku.toString() : "";
                        }
                    });
                });
                distinctSku = [...new Set([].concat.apply([], distinctSku))].filter(el => el);
                distinctSku = [...new Set([].concat.apply([], distinctSku))]; // additional para sa array of array
                const productList = {};
                for (var index = 0; index < distinctSku.length; index++) {
                    var prodid = distinctSku[index];
                    try {
                        // if (typeof prodid !== "function" && prodid && mongoose.Types.ObjectId.isValid(mongoDBId.decode(prodid))) {
                        //     productList[prodid] = await getFunnelProducts({ id: prodid }, true);
                        // } else {
                        //     // console.log("Dapat di pumasok dito dahil Mali itong cod product id (1) ==>",  prodid, "Index:"+index, distinctSku)
                        // }
                        if (mongoose.Types.ObjectId.isValid(prodid)) { // kapag may serial number
                            productList[prodid] = await getPurchaseOrderData(null, null, prodid);
                        } else if (mongoose.Types.ObjectId.isValid(mongoDBId.decode(prodid))) { // kapag wla serial number pero may sku
                            productList[prodid] = await getFunnelProducts({ id: prodid }, true);
                        }
                    } catch (error) {
                        console.error(typeof prodid, "<== Charararat error (getMyFunnelOrders) ==>", prodid);
                        console.error("Error (getMyFunnelOrders) ==>", error);
                    }
                }
                for (var index = 0; index < res.length; index++) {
                    if (res[index].creator) {
                        // convert creator to string
                        res[index].creator = res[index].creator.toString();
                        // get funnel creator data
                        res[index].userData = userParseData[res[index].creator]
                        for (var liIndex = 0; liIndex < res[index].line_items.length; liIndex++) {
                            if (!res[index].line_items[liIndex].price) res[index].line_items[liIndex].price = 0; // check if price is null
                            res[index].line_items[liIndex].convertedPrice = parseFloat((res[index].line_items[liIndex].price / convertObject.rates[res[index].currencyWord ? res[index].currencyWord : "USD"]).toFixed(2));
                            if (res[index].line_items[liIndex].plg_sku) {
                                var result = null;
                                if (res[index].line_items[liIndex].plg_serialNumber && res[index].line_items[liIndex].plg_serialNumber.length != 0) { // kapag may serial number
                                    result = productList[res[index].line_items[liIndex].plg_serialNumber[0].split("_")[1]];
                                } else { // kapag wla serial number pero may sku
                                    result = productList[res[index].line_items[liIndex].plg_sku];
                                }
                                // start reducing the tax from converted price
                                const taxablePercentage = result && result.productFivePercentDuty ? result.productFivePercentDuty : "";
                                var taxFee = _points.getCountryTaxable(res[index].shipping_information.country, res[index].line_items[liIndex].convertedPrice, taxablePercentage);
                                // end reducing the tax from converted price
                                if (result) {
                                    if (!res[index].line_items[liIndex]) console.log("DATA ID V2 (1) ==>", res[index].id);
                                    const orderQty = res[index].line_items[liIndex].quantity;
                                    const totalCommision = await getPurchaseOrderData(null, res[index].line_items[liIndex].plg_serialNumber); // for order that has serial number
                                    const affiliateCost = typeof totalCommision != "undefined" ? totalCommision : result.affiliateCost * orderQty;
                                    var totalDeduction = ((result.productCost + result.fulfillmentCost + result.yabazoo) * orderQty) + affiliateCost + result.productDeliveryCost + taxFee;
                                    var computed = parseFloat((res[index].line_items[liIndex].convertedPrice - totalDeduction).toFixed(2));
                                    res[index].line_items[liIndex].affiliateCost = parseFloat(affiliateCost).toFixed(2);
                                    res[index].line_items[liIndex].productCost = parseFloat(result.productCost).toFixed(2);
                                    // start for export fulfiller only
                                    res[index].line_items[liIndex].plg_itemCost = result.productCost * orderQty;
                                    res[index].line_items[liIndex].plg_fulfillmentCost = result.fulfillmentCost * orderQty;
                                    res[index].line_items[liIndex].plg_yabazoo = result.yabazoo * orderQty;
                                    res[index].line_items[liIndex].plg_deliveryCost = result.productDeliveryCost;
                                    res[index].line_items[liIndex].plg_tax = taxFee;
                                    res[index].line_items[liIndex].plg_affiliateCost = affiliateCost;
                                    // end for export fulfiller only
                                    res[index].line_items[liIndex].pcost = parseFloat(totalDeduction).toFixed(2);
                                    res[index].line_items[liIndex].payoutPrice = parseFloat((computed).toFixed(2));
                                    res[index].line_items[liIndex].inventoryName = result.productName;
                                    res[index].line_items[liIndex].inventoryDescription = result.productSku;
                                    res[index].line_items[liIndex].active = result.is_active;
                                    res[index].affiliateEmail = result.affiliateEmail;
                                } else {
                                    console.log(res[index].creator, " hindi dapat mangyayari to maliban kung wla tong id na to (getMyFunnelOrders) ==>", res[index].line_items[liIndex].plg_sku);
                                }
                            } else {
                                res[index].line_items[liIndex].payoutPrice = parseFloat((res[index].line_items[liIndex].convertedPrice).toFixed(2));
                            }
                        }
                    }
                    // convert ids to string
                    if (res[index].ids && res[index].ids.length != 0) res[index].ids = res[index].ids.map(eel => eel ? eel.toString() : eel);
                }
                return res;
            })

            return myorders;
        },

        getMyFunnelOrderCreatorList: async (root, args, { FunnelGenieOrder, User }) => { // Manage COD Payouts (Table)
            var limit = args.limit ? args.limit : 20, page = args.page ? (args.page - 1) : 0;
            var match = {
                order_status: { $in: args.order_status ? args.order_status.split(",") : ['delivered'] },
                merchant_type: 'cod',
                "shipping_information.country": { $in: _points.cod_available_country("order_filter") },
                "line_items.plg_sku": { $nin: ["000", "0000"] }, // pangsamantagal
                fulfill_with_plg: { $in: [true, null] } // pangsamantagal
            };
            if (args.fulfillerLocation && args.fulfillerLocation != "ALL") {
                match["shipping_information.country"] = { $in: [args.fulfillerLocation, iso3to2[args.fulfillerLocation] ? iso3to2[args.fulfillerLocation] : args.fulfillerLocation] }
            }
            if (args.dateStart && args.dateEnd) {
                const convertedDate = formatStartAndEndDate(args.dateStart, args.dateEnd, "getMyFunnelOrderCreatorList");
                match.dateStatusDelivered = { $gte: convertedDate.start, $lte: convertedDate.end }
            }
            if (args.userEmail) {
                const userId = await User.findOne({ email: args.userEmail.toLowerCase() }).then(user => user ? user.id : null).catch(err => null);
                match.creator = userId ? mongoose.Types.ObjectId(userId) : userId;
            }
            if (args.show_vip) {
                const vip_list = await User.find({ access_tags: "xvip" }, { _id: 1 }).lean();
                match.creator = {
                    $in: vip_list.map(e => e._id)
                }
            }
            const totalOrders = await FunnelGenieOrder.aggregate([{ "$match": match }, { "$group": { "_id": "$creator" } }]).allowDiskUse(true).exec();
            const result = await FunnelGenieOrder.aggregate([{ "$match": match }, { "$group": { "_id": "$creator", "ids": { "$push": "$_id" }, "order_status_update": { "$first": "$order_status_update" }, "on_hold": { "$last": "$on_hold" }, "order_date": { "$first": "$order_date" }, "order_status": { "$first": "$order_status" } } }, { "$skip": page * limit }, { "$limit": limit }]).allowDiskUse(true).exec().then(async res => {
                const data = [];
                for (var i = 0; i < res.length; i++) {
                    if (res[i] && res[i]._id) {
                        const creatorID = res[i]._id.toString();
                        const order_date = res[i].order_date;
                        const order_status = res[i].order_status;
                        const on_hold = res[i].on_hold ? res[i].on_hold : false;
                        const order_status_update = res[i].order_status_update;
                        const userData = await User.findById({ _id: creatorID }).lean().then(user => { return JSON.stringify({ name: user.firstName + " " + user.lastName, email: user.email, privilege: user.privilege }) })
                        data.push({ count: totalOrders.length, ids: res[i].ids.map(eel => eel ? eel.toString() : eel), creator: creatorID, userData, on_hold, order_date, order_status, order_status_update });
                    } else {
                        console.log("WTF ndi dapat papasok dito!", JSON.stringify(res[i]));
                    }
                }
                return data;
            })
            return result;
        },

        getMyCommissionCreatorList: async (root, args, { FunnelGenieOrder, PurchaseOrders, User }) => {
            var limit = args.limit ? args.limit : 20, page = args.page ? (args.page - 1) : 0;
            var match = {
                order_status: { $in: ['delivered', 'paid'] },
                isPaidCommision: { $in: [false, null] },
                merchant_type: 'cod',
                'shipping_information.country': { $in: _points.cod_available_country("order_filter") },
                'line_items.plg_serialNumber.0': { $exists: true }
            };
            if (args.fulfillerLocation && args.fulfillerLocation != "ALL") {
                match["shipping_information.country"] = { $in: [args.fulfillerLocation, iso3to2[args.fulfillerLocation] ? iso3to2[args.fulfillerLocation] : args.fulfillerLocation] }
            }
            if (args.dateStart && args.dateEnd) {
                const convertedDate = formatStartAndEndDate(args.dateStart, args.dateEnd, "getMyCommissionCreatorList");
                match.dateStatusDelivered = { $gte: convertedDate.start, $lte: convertedDate.end };
            }
            // start get total documents and total payout
            const result = await FunnelGenieOrder.aggregate([{ "$match": match }, { "$group": { "_id": "$creator", "line_items": { "$push": "$line_items" } } }]).allowDiskUse(true).exec().then(async res => {
                const totalData = { count: 0, totalPayout: 0 };
                const users = [], final = [];
                try {
                    // pang samantagal
                    var commissioner_data = [];
                    if (args.userEmail) {
                        commissioner_data = await PurchaseOrders.find({ affiliate_email: args.userEmail }).lean();
                    } else {
                        var commisioner_serials = [];
                        commisioner_serials = res.map(el => el.line_items.map(el => el.plg_serialNumber.map(ell => ell.split("_")[1])));
                        commisioner_serials = [].concat.apply([], commisioner_serials);
                        commisioner_serials = [].concat.apply([], commisioner_serials);
                        commissioner_data = await PurchaseOrders.find({ _id: { $in: commisioner_serials } }).lean();
                    }
                    for (var i = 0; i < commissioner_data.length; i++) {
                        const po_data = commissioner_data[i];
                        const user = await User.findOne({ email: po_data.affiliate_email }).lean();
                        var serialNumbers = po_data.product_quantity_list.filter(el => el.status == "purchased");
                        serialNumbers = [].concat.apply([], serialNumbers).map(el => el._id);
                        const payload = {
                            query: `query($serial_numbers: String, $order_status: String, $dateStart: String, $dateEnd: String, $isPaidCommision: Boolean){
                                getMyCommissionPayCheck(serial_numbers: $serial_numbers, order_status: $order_status, dateStart: $dateStart, dateEnd: $dateEnd, isPaidCommision: $isPaidCommision){
                                    count
                                }
                            }`,
                            variables: { serial_numbers: JSON.stringify(serialNumbers), order_status: "delivered,paid", dateStart: args.dateStart, dateEnd: args.dateEnd, isPaidCommision: false }
                        }
                        const result = await new Promise((resolve, reject) => {
                            _points.customFetch(_points.clientUrl + "/graphql", "POST", payload, data => {
                                if (data) {
                                    resolve(data.data.getMyCommissionPayCheck.count)
                                } else {
                                    reject("Network Error please try again.");
                                }
                            })
                        });
                        totalData.totalPayout += result;
                        if (result > 0) {
                            const isFound = users.filter(el => el.creator == user._id.toString());
                            if (isFound.length == 0) {
                                users.push({ creator: user._id.toString(), userData: JSON.stringify({ name: po_data.affiliate_name, email: po_data.affiliate_email, commission: result }) })
                                totalData.count += 1;
                            } else {
                                users.map(el => {
                                    if (el.creator == user._id.toString()) {
                                        const newObj = JSON.parse(el.userData);
                                        newObj.commission += result;
                                        el.userData = JSON.stringify(newObj);
                                    }
                                    return el;
                                })
                            }
                        }
                    }
                    for (var i = 0; i < users.length; i++) {
                        final.push({ ...totalData, creator: users[i].creator, userData: users[i].userData })
                    }
                } catch (err) {
                    console.error("Error in getMyCommissionCreatorList ==>", err);
                }
                return final;
            });
            // end get total documents and total payout
            return result;
        },

        getFunnelOrderCost: async (root, args, { FunnelGenieOrder, FunnelProducts }) => {
            var query = {
                merchant_type: "cod",
                $or: [
                    { order_status: 'delivered' },
                    { order_status: 'paid' }
                ],
                "line_items.plg_sku": args.variantID
            };
            if (args.filterByStartDate && args.filterByEndDate) {
                const convertedDate = formatStartAndEndDate(args.filterByStartDate, args.filterByEndDate, "getFunnelOrderCost");
                query.order_date = { $gte: convertedDate.start, $lte: convertedDate.end };
            }
            const result = { jsonStr: { fcost: 0, yabazooCost: 0, plgProfit: 0, deliveryCost: 0 } }
            const orderData = await FunnelGenieOrder.find(query);
            const fproduct = await getFunnelProducts({ id: args.variantID }, true);
            orderData.forEach(el => {
                result.jsonStr.fcost += fproduct.fulfillmentCost;
                result.jsonStr.yabazooCost += fproduct.yabazoo;
                result.jsonStr.plgProfit += fproduct.productFivePercentDuty;
                result.jsonStr.deliveryCost += fproduct.productDeliveryCost;
            })
            result.jsonStr = JSON.stringify(result.jsonStr);
            return result;
        },

        getSharedFunnel: async (root, args, { FunnelGenie, FunnelPageList }) => {
            var result = null;
            if (args.funnel_id) {
                const loadLastDesign = args.loadLastDesign ? { design: { $slice: -1 } } : null;
                result = await FunnelPageList.find({ funnel_id: args.funnel_id }, loadLastDesign);
            }
            else {
                result = await FunnelGenie.find({ creator: args.id, funnel_name: args.funnel_name });
            }
            return result;
        },

        getOnlyFunnelFromOrders: async (root, args, { FunnelGenieOrder, FunnelGenie, FunnelList }) => {
            const orders = await FunnelGenieOrder.find({ creator: args.creator })
            const orderIDS = orders.filter(el => el.funnel_source_id != null).map(el => mongoose.Types.ObjectId(el.funnel_source_id))
            var funnel_list = [];
            if (orderIDS.length != 0) {
                // funnel_list = await FunnelGenie.aggregate([
                //     {
                //         "$match": {
                //             "_id": {
                //                 "$in": orderIDS
                //             }
                //         }
                //     },
                //     {
                //         "$group": {
                //             "_id": {
                //                 "funnel_name": "$funnel_name",
                //                 "domainIndex": "$domainIndex"
                //             }
                //         }
                //     }
                // ])
                // funnel_list = await changeKeyName("_id", "funnel_object", funnel_list);

                // start include new funnel to funnel order filter
                // const old_funnel_name = funnel_list.map(el => el.funnel_object.funnel_name);
                // const new_funnels = await FunnelList.find({ creator: args.creator, funnel_name: { $nin: old_funnel_name } }, { _id: 1, funnel_name: 1 }).lean();
                const new_funnels = await FunnelList.find({ creator: args.creator }, { _id: 1, funnel_name: 1 }).sort('-date_modified').lean();
                if (new_funnels.length != 0) {
                    new_funnels.forEach(el => {
                        funnel_list.push({ funnel_object: { funnel_id: el._id.toString(), funnel_name: el.funnel_name, domainIndex: 0 } })
                    })
                }
                // end include new funnel to funnel order filter
            }
            return funnel_list;
        },

        getFunnelEmailAndSMSIntegration: async (root, args, { FunnelIntegration }) => {
            return await FunnelIntegration.find({ funnelSource: args.funnelSource, messageType: args.messageType });
        },

        getLeadsMetaData: async (root, args, { FunnelLeadsMetaData }) => {
            return await FunnelLeadsMetaData.find(args);
        },

        getEmailSequence: async (root, args, { EmailSequence }) => {
            return await EmailSequence.find(args);
        },

        getMyFunnelOrderTotalSales: async (root, args, { FunnelGenieOrder }) => { // Order Metrics (Sales Over Time & Orders Over Time)
            var query = { creator: mongoose.Types.ObjectId(args.creator), order_status: { $nin: ["cancelled"] } };
            if (args.dateFrom && args.dateTo) {
                const convertedDate = formatStartAndEndDate(args.dateFrom, args.dateTo, "getMyFunnelOrderTotalSales");
                query.order_date = { $gte: convertedDate.start, $lte: convertedDate.end };
            } else if (args.dateFrom) { // eto ginagamit ng app
                const convertedDate = formatStartAndEndDate(_points.getPastDate(parseInt(args.dateFrom) - 1, true), new Date(), "getMyFunnelOrderTotalSales Mobile");
                query.order_date = { $gte: convertedDate.start };
            }

            if (args.page_ids) query.funnel_source_id = { $in: args.page_ids.split(",") };

            if (args.page_ids) {
                var orderCreator = await FunnelGenieOrder.aggregate([{ "$match": query }, { "$group": { "_id": { "orderCreator": "$orderCreator" } } }]).allowDiskUse(true).exec();
                if (orderCreator.length) {
                    query.orderCreator = { $in: orderCreator.map(e => e._id.orderCreator) };  
                    delete query.funnel_source_id;
                }
            }

            if (args.merchant_type) query.merchant_type = args.merchant_type;

            if (args.showShopifyOnly) {
                // query['line_items.shopify_order_number'] = { $exists: true, $ne: null }
            }

            const result = await FunnelGenieOrder.aggregate([
                {
                    "$match": query
                },
                {
                    "$group": {
                        "_id": {
                            "orderCreator": "$orderCreator",
                            "email": "$shipping_information.email"
                        },
                        "order_date": { "$first": "$order_date" },
                        "order_status": { "$first": "$order_status" },
                        "currencyWord": { "$first": "$currencyWord" },
                        "merchant_type": { "$first": "$merchant_type" },
                        "line_items": { "$push": "$line_items" }
                    }
                },
                {
                    "$sort": { "order_date": 1 }
                }
            ]).allowDiskUse(true).exec();
            let total = {
                count: 0, // total order sales
                total_cod: 0, // total cod sales
                count_order: result.length, // total order per customer
                dates: []
            };

            // start initialize date list
            if (args.dateFrom && args.dateTo) {
                let total_date_difference = _points.getNumberOfDateDifference(args.dateFrom, args.dateTo);
                for (let i = (total_date_difference - 1); i >= 0; i--) {
                    let dateTo = new Date(args.dateTo);
                    if (args.timezoneOffset) {
                        dateTo = _points.adjustDateForFETimezone(dateTo, args.timezoneOffset);
                    }
                    let date = new Date(_points.deducDateFrom(dateTo.getTime(), i)).toDateString().substring(4);
                    total.dates.push({ count: 0, date: date, count_order: 0, total_cod: 0, total_delivered: 0, total_not_delivered: 0 });
                }
            }
            // end initialize date list
            result.forEach((el, i) => {
                let total_price = 0;

                el.line_items.forEach(li => {
                    // start old value is array or null convert to number
                    li.price = li.price ? li.price : 0; // if price is null
                    if (typeof li.price === "object") { // if price is array
                        let price = li.price[0];
                        delete li.price;
                        li.price = price;
                    }
                    // end old value is array convert to number

                    // start convert price
                    el.currencyWord = el.currencyWord ? el.currencyWord : "USD";
                    if (convertObject) li.price = parseFloat((li.price / convertObject.rates[el.currencyWord]).toFixed(2));
                    // end convert price

                    total_price += li.price; // accumulate as total price

                });

                // let date = _points.sendDateToServer(el.order_date, true), delivered = 0, not_delivered = 0;
                let date = new Date(el.order_date).toDateString().substring(4), delivered = 0, not_delivered = 0;
                if (el.order_date && args.timezoneOffset) {
                    let new_date = _points.adjustDateForFETimezone(el.order_date, args.timezoneOffset);
                    date = new Date(new_date).toDateString().substring(4);
                }

                if (total.dates.length == 0) {  // initialize everything
                    if (el.merchant_type == "cod") {
                        if (el.order_status == "delivered" || el.order_status == "paid") delivered = total_price;
                        else not_delivered = total_price;
                    }
                    total.dates.push({ count: total_price, date: date, count_order: 1, total_cod: total_price, total_delivered: delivered, total_not_delivered: not_delivered });
                } else {
                    let isFound = total.dates.filter(e => e.date == date).length != 0 ? true : false;
                    if (isFound) { // accumulate data to current date
                        total.dates.forEach((tt, i) => {
                            if (tt.date == date) {
                                total.dates[i].count_order += 1;
                                total.dates[i].count += total_price; // accumulate price to current date over all sales
                                if (el.merchant_type == "cod") { // if cod
                                    total.dates[i].total_cod += total_price; // accumulat price to current date cod orders
                                    if (el.order_status == "delivered" || el.order_status == "paid") total.dates[i].total_delivered += total_price; // accumulate sales to current date delivered orders
                                    else total.dates[i].total_not_delivered += total_price; // accumulate sales to current date not delivered orders
                                }
                            }
                        });
                    } else { // push new data to date and initialize everything 
                        delivered = 0;
                        not_delivered = 0;
                        if (el.merchant_type == "cod") { // if cod
                            if (el.order_status == "delivered" || el.order_status == "paid") delivered = total_price; // accumulate sales to current date delivered orders
                            else not_delivered = total_price; // accumulate sales to current date not delivered orders
                        }
                        total.dates.push({ count: total_price, date: date, count_order: 1, total_cod: total_price, total_delivered: delivered, total_not_delivered: not_delivered });
                    }
                }
            });

            // start initialize remaining date list
            // console.group()
            // if (args.dateFrom && args.dateTo) {
            //     let old = total.dates;
            //     total.dates = [];
            //     console.log(old)
            //     let total_date_difference = _points.getNumberOfDateDifference(args.dateFrom, args.dateTo);
            //     for (let i = (total_date_difference - 1); i >= 0; i--) {
            //         if (total.dates.length < total_date_difference) {
            //             let date = new Date(_points.deducDateFrom(new Date(args.dateTo).getTime(), i)).toDateString().substring(4);
            //             let is_exist = old.filter(e => e.date == date).length !== 0 ? true : false;
            //             if (is_exist) { // insert existed value
            //                 total.dates.push(old.filter(e => e.date == date)[0]);
            //             } else { // insert default value
            //                 total.dates.push({ count: 0, date: date, count_order: 0, total_cod: 0, total_delivered: 0, total_not_delivered: 0 });
            //             }
            //         }
            //     }
            // }
            // console.groupEnd()
            // end initialize remaining date list

            total.dates.forEach(el => {
                total.count += el.count;
                total.total_cod += el.total_cod;
            })
            var newtotal = {
                count: total.count,
                count_order: total.count_order,
            }
            // console.log(newtotal)
            return total;
        },

        getTopProducts: async (root, args, { FunnelGenieOrder }) => { // Order Metrics (Top products sold)
            let query = { creator: mongoose.Types.ObjectId(args.creator) };
            if (args.dateFrom && args.dateTo) {
                const convertedDate = formatStartAndEndDate(args.dateFrom, args.dateTo, "getTopProducts");
                query.order_date = { $gte: convertedDate.start, $lte: convertedDate.end };
            }
            if (args.page_ids) query.funnel_source_id = { $in: args.page_ids.split(",") };
            if (args.merchant_type) query.merchant_type = args.merchant_type;

            if (args.showShopifyOnly) {
                // query['line_items.shopify_order_number'] = { $exists: true, $ne: null }
            }

            if (args.page_ids) {
                var orderCreator = await FunnelGenieOrder.aggregate([{ "$match": query }, { "$group": { "_id": { "orderCreator": "$orderCreator" } } }]).allowDiskUse(true).exec();
                if (orderCreator.length) {
                    query.orderCreator = { $in: orderCreator.map(e => e._id.orderCreator) };  
                    delete query.funnel_source_id;
                }
            }

            let top_5_products = await FunnelGenieOrder.aggregate([
                { "$match": query },
                {
                    "$group": {
                        "_id": { "title": "$line_items.title" },
                        "country": { "$first": "$shipping_information.country" },
                        "title": { "$first": "$line_items.title" },
                        "count": { "$sum": "$line_items.quantity" }
                    }
                },
                { "$project": { "_id": 0 } },
                { "$sort": { "count": -1 } },
                { "$limit": 30 }
            ]).allowDiskUse(true).exec();
            let per_country = {};
            for (let i = 0; i < top_5_products.length; i++) {
                let { country, title, count } = top_5_products[i];
                if (!per_country[country]) per_country[country] = [];
                per_country[country].push({ title, count });
            }
            return { jsonStr: JSON.stringify({ top_products: per_country }) };
        },

        getUsersOfFunnelOrders: async (root, args, { User }) => {
            var search = {};
            if (args.search_user) {
                var regex = new RegExp(args.search_user, "gi");
                search = {
                    $or: [
                        { firstName: regex },
                        { lastName: regex },
                        { email: regex },
                        { kartra: regex },
                        { funnel_genie_domains: regex }
                    ]
                }
            }
            const users = await User.find(search).limit(10);
            return users;
        },

        getTotalFunnelProducts: async (root, args, { FunnelProducts }) => {
            var count = {
                count: await FunnelProducts.countDocuments({})
            };
            return count;
        },

        getFunnelProducts: async (root, args) => {
            return await getFunnelProducts(args);
        },

        getFunnelProductDesign: async (root, args, { FunnelProductDesign }) => {
            return await FunnelProductDesign.find({ product_id: args.product_id });
        },

        getPurchaseOrders: async (root, args, { PurchaseOrders }) => {
            var status = args.status, low_inventory = args.low_inventory;
            var page = args.page ? args.page - 1 : 0, limit = args.limit ? args.limit : 0, skip = page * limit;
            const query = args;
            if (status) {
                delete query.status;
                query["product_quantity_list.status"] = status;
            };
            if (low_inventory) {
                delete query.low_inventory;
                query.warnWhenLow = true;
                query.$where = "this.product_quantity_list.filter(el => el.status == \"warehouse\").length <= this.warnQty && this.product_quantity_list.filter(el => el.status == \"warehouse\").length != 0";
                // ang query sa taas ay warehouse item ay less than warn qty and warehouse item is not zero
            }
            delete query.page;
            delete query.limit;
            const total = await PurchaseOrders.find(query);
            var data = await PurchaseOrders.find(query).skip(skip).limit(limit).then(res => {
                return res.map(el => {
                    el.count = total.length;
                    el.po_no = el._id.toString();
                    if (status) el.product_quantity_list = el.product_quantity_list.filter(ell => ell.status == status);
                    el.sold_item_serial_numbers = el.product_quantity_list.filter(ell => ell.status == "purchased").map(elll => elll._id);
                    el.returning_item_serial_numbers = el.product_quantity_list.filter(ell => ell.status == "returning").map(elll => elll._id);
                    el.remainingQty = el.product_quantity_list.filter(ell => ell.status == "warehouse").length;
                    el.totalQty = el.product_quantity_list.filter(ell => ell.status != "transfered").length;
                    if (!args.isApproved) {
                        el.totalQty = el.product_quantity;
                        el.remainingQty = el.product_quantity;
                    }
                    el.affiliate_budget = parseFloat((el.totalQty * el.product_price).toFixed(2));
                    return el;
                });
            });
            if (status) {
                data = data.map(el => {
                    return el;
                })
            }
            return data;
        },

        getMyPayCheck: async (root, args, { FunnelGenieOrder, FunnelProducts, User }) => { // COD Payouts
            // delivered order in past 2 weeks
            var query = {
                order_status: { $in: args.order_status ? args.order_status.split(",") : ['delivered'] },
                merchant_type: "cod",
                "shipping_information.country": { $in: _points.cod_available_country("order_filter") },
                "line_items.plg_sku": { $nin: ["000", "0000"] }, // pangsamantagal
                fulfill_with_plg: { $in: [true, null] }, // null kc ung mga old order ung mga bago true na value false ung mga ndi i fufulfill ng PLG
            };
            if (args.creator) {
                query.creator = args.creator; // only if get paycheck by user                
            }

            if (args.dateStart && args.dateEnd) {
                const convertedDate = formatStartAndEndDate(args.dateStart, args.dateEnd, "getMyPayCheck");
                if (args.isAdminPayoutCollectedRange) {
                    query.dateCourierCollected = { $gte: convertedDate.start, $lte: convertedDate.end };
                } else if (args.useOrderDateAsDateFilter) { // for order metrics only
                    query.order_date = { $gte: convertedDate.start, $lte: convertedDate.end };
                } else {
                    query.dateStatusDelivered = { $gte: convertedDate.start, $lte: convertedDate.end };
                }
            }

            // TO Get all in on_hold    
            if (args.on_hold !== null && args.on_hold !== undefined) {
                if (args.on_hold) {
                    query.on_hold = true;
                } else {
                    query.on_hold = { $in: [false, null] };
                }
            }

            if (args.showShopifyOnly) {
                // query['line_items.shopify_order_number'] = { $exists: true, $ne: null }
            }

            if (args.funnel_id) {
                query.funnel_source_id = { $in: args.funnel_id.split(",") };
            }
            if (args.isAdminPayout) query.received_payment_from_courier = true;
            if (args.fulfillerLocation && args.fulfillerLocation != "ALL") {
                const locList = [];
                _points.cod_available_country("no_country").forEach(el => {
                    if (args.fulfillerLocation.includes(el.iso2) || args.fulfillerLocation.includes(el.iso3)) {
                        locList.push(el.iso2)
                        locList.push(el.iso3)
                    }
                });
                query["shipping_information.country"] = { $in: locList }
            }
            if (typeof args.userPrivilege != "undefined") { // tricky query for getting all paycheck depending on privilege (purpose for lvl 0)
                const creator_list = await FunnelGenieOrder.find(query).distinct("creator");
                const user = await User.find({ _id: { $in: creator_list }, privilege: args.userPrivilege }, { _id: 1 }).lean();
                query.creator = { $in: user.map(e => e._id.toString()) };
            }
            const delivered = await FunnelGenieOrder.find(query).sort("dateStatusDelivered").catch(err => []);
            // const distinctProductID = [...new Set(delivered.map(el => el.line_items.plg_sku ? el.line_items.plg_sku.toString() : "").filter(el => el))];
            var distinctProductID = delivered.map(el => {
                if (el.line_items.plg_serialNumber && el.line_items.plg_serialNumber.filter(e => e).length != 0) {
                    return el.line_items.plg_serialNumber.filter(e => e).map(sn => {
                        return sn.split("_")[1];
                    });
                } else {
                    return el.line_items.plg_sku ? el.line_items.plg_sku.toString() : "";
                }
            });
            distinctProductID = [...new Set([].concat.apply([], distinctProductID))].filter(el => el);
            distinctProductID = [...new Set([].concat.apply([], distinctProductID))]; // additional para sa array of array
            const productList = {};
            for (var index = 0; index < distinctProductID.length; index++) {
                var prodid = distinctProductID[index];
                try {
                    if (mongoose.Types.ObjectId.isValid(prodid)) { // kapag may serial number
                        productList[prodid] = await getPurchaseOrderData(null, null, prodid);
                    } else if (mongoose.Types.ObjectId.isValid(mongoDBId.decode(prodid))) { // kapag wla serial number pero may sku
                        productList[prodid] = await getFunnelProducts({ id: prodid }, true);
                    }
                } catch (error) {
                    console.error(typeof prodid, "<== Charararat error (getMyPayCheck) ==>", prodid);
                    console.error("Error (getMyPayCheck) ==>", error);
                }
            }
            var global_currency = JSON.parse(fs.readFileSync('Global_Currency.json')).rates;
            const total = { count: 0, dates: [] };
            for (var index = 0; index < delivered.length; index++) {
                var deliveredData = delivered[index];
                if (!deliveredData.line_items) console.log("Data error this id ==>", deliveredData.id, deliveredData._id, "Query ==>" + query, deliveredData)
                deliveredData.line_items.price = deliveredData.line_items && deliveredData.line_items.price ? deliveredData.line_items.price : 0;
                var plg_sku_id = deliveredData.line_items && deliveredData.line_items.plg_sku ? deliveredData.line_items.plg_sku : "";
                var date = new Date(new Date(deliveredData.dateStatusDelivered).setUTCHours(0)).toDateString().substring(4);
                // convert all prices to dollar
                var convertedPrice = parseFloat((deliveredData.line_items.price / global_currency[deliveredData.currencyWord]).toFixed(2));
                // end reducing the tax from converted price
                if (plg_sku_id) {
                    var result = null;
                    if (deliveredData.line_items.plg_serialNumber && deliveredData.line_items.plg_serialNumber.length != 0) { // kapag may serial number
                        result = productList[deliveredData.line_items.plg_serialNumber[0].split("_")[1]];
                    } else {
                        result = productList[plg_sku_id];
                    }
                    // start reducing the tax from converted price
                    const taxablePercentage = result && result.productFivePercentDuty ? result.productFivePercentDuty : "";
                    var taxFee = _points.getCountryTaxable(deliveredData.shipping_information.country, convertedPrice, taxablePercentage);
                    // end reducing the tax from converted price
                    if (result) {
                        if (!deliveredData.line_items) console.log("DATA ID (2) ==>", el.id)
                        const orderQty = deliveredData.line_items.quantity;
                        var affiliateCost = result.affiliateCost * orderQty; // initial affiliateCost value replace when condition below is true
                        if (deliveredData.line_items.plg_serialNumber && deliveredData.line_items.plg_serialNumber.length != 0) {
                            affiliateCost = await getPurchaseOrderData(null, deliveredData.line_items.plg_serialNumber.map(el => el)); // for order that has serial number
                        }
                        var totalDeduction = ((result.productCost + result.fulfillmentCost + result.yabazoo) * orderQty) + affiliateCost + result.productDeliveryCost + taxFee;
                        var computed = parseFloat((convertedPrice - totalDeduction).toFixed(2));
                        total.count += computed;
                        var isFound = false;
                        total.dates.map(el => {
                            if (el.date == date) {
                                el.count += computed;
                                isFound = true;
                            };
                            return el;
                        })
                        if (!isFound) total.dates.push({ date, count: computed });
                    }
                } else {
                    total.count += convertedPrice;
                    var isFound = false;
                    total.dates.map(el => {
                        if (el.date == date) {
                            el.count += convertedPrice;
                            isFound = true;
                        };
                        return el;
                    })
                    if (!isFound) total.dates.push({ date, count: convertedPrice });
                }
            }
            return total;
        },

        getMyCommissionPayCheck: async (root, args, { FunnelGenieOrder, User }) => {
            var query = {
                order_status: {
                    $in: args.order_status ? args.order_status.split(",") : ['delivered']
                },
                merchant_type: "cod",
                "line_items.plg_sku": { $nin: ["000", "0000"] },
                fulfill_with_plg: { $in: [true, null] },
                "line_items.plg_serialNumber": {
                    $in: JSON.parse(args.serial_numbers)
                },
            };
            if (args.dateStart && args.dateEnd) {
                const convertedDate = formatStartAndEndDate(args.dateStart, args.dateEnd, "getMyCommissionPayCheck");
                query.dateStatusDelivered = { $gte: convertedDate.start, $lte: convertedDate.end }
            }
            if (typeof args.isPaidCommision !== "undefined") {
                query.isPaidCommision = {
                    $in: args.isPaidCommision ? [args.isPaidCommision] : [false, null]
                }
            }
            const total = { count: 0 };
            const productList = {};
            const delivered = await FunnelGenieOrder.find(query).sort("dateStatusDelivered");
            const distinctProductID = [...new Set(delivered.map(el => el.line_items.plg_sku ? el.line_items.plg_sku.toString() : "").filter(el => el))];
            for (var index = 0; index < distinctProductID.length; index++) {
                var prodid = distinctProductID[index];
                try {
                    if (typeof prodid !== "function" && prodid && mongoose.Types.ObjectId.isValid(mongoDBId.decode(prodid))) {
                        productList[prodid] = await getFunnelProducts({ id: prodid }, true);
                    }
                } catch (error) {
                    console.error(typeof prodid, "<== Charararat error (getMyCommissionPayCheck) ==>", prodid);
                    console.error("Error (getMyCommissionPayCheck) ==>", error);
                }
            }
            // note no need to copy the logic of variant sku in getMyPayCheck function dahil commission cost lang nmn kailangan dito
            // at nggwa nmn ng ayos un via serial number so ndi nag co conflict sa current active na p.o sa funnel products
            for (var index = 0; index < delivered.length; index++) {
                var dataInLoop = delivered[index];
                var plg_sku_id = dataInLoop.line_items && dataInLoop.line_items.plg_sku ? dataInLoop.line_items.plg_sku : "";
                if (plg_sku_id) {
                    var funnelProductData = productList[plg_sku_id], affiliateCost = funnelProductData.affiliateCost * dataInLoop.line_items.quantity; // initial affiliateCost value replace when condition below is true
                    if (dataInLoop.line_items.plg_serialNumber && dataInLoop.line_items.plg_serialNumber.length != 0) {
                        affiliateCost = await getPurchaseOrderData(null, dataInLoop.line_items.plg_serialNumber.map(el => el)); // for order that has serial number
                        if (!dataInLoop.line_items) console.log("DATA ID (3) ==>", dataInLoop.id)
                        affiliateCost = affiliateCost; // no need to multiply because na pag plus na sa getPurchaseOrderData
                    }
                    total.count += affiliateCost;
                }
            }
            return total;
        },

        getOrderLink: async (root, args, { FunnelGenieOrder, User, FunnelGenie, FunnelList }) => {
            var response = {}; // 0 = error, 1 = success
            const getOrderData = await FunnelGenieOrder.findById({ _id: args.id });
            if (getOrderData.funnel_source_id) {
                const funnelData = await FunnelGenie.findById({ _id: getOrderData.funnel_source_id }).lean();
                if (funnelData) {
                    const userData = await User.findById({ _id: funnelData.creator });
                    const generatedLink = `https://${userData.funnel_genie_domains[funnelData.domainIndex]}/${funnelData.funnel_name}${funnelData.path ? "/" + funnelData.path : ""}`;
                    response = { status: 1, message: "", link: generatedLink };
                } else {
                    const funnelData2 = await FunnelList.findById({ _id: getOrderData.funnel_source_id }).lean();
                    if (funnelData2) {
                        // from new remodel funnel genie
                        const generatedLink = `https://${funnelData2.domain_name}/${funnelData2.funnel_name}`;
                        response = { status: 1, message: "", link: generatedLink };
                    } else {
                        // wala na tong funnel na to
                        response = { status: 0, message: "The funnel is already deleted and cannot get the order page link.", link: "" };
                    }
                }
            } else {
                // wala tong funn
                response = { status: 0, message: "The order doesnt have funnel source id and cannot find the funnel.", link: "" };
            }
            return { link: JSON.stringify(response) }
        },

        getAllAffiliate: async (root, args, { User }) => { // COD Statistics (Investor's Inventory)
            let page = args.page ? args.page - 1 : 0, limit = args.limit ? args.limit : 0, query = { "investment_list.0": { $exists: true } };
            if (args.email) query.email = args.email;
            let total = await User.countDocuments(query);
            let result = await User.find(query).skip(page * limit).limit(limit).then(res => {
                res = res.map(el => {
                    el.count = total;
                    return el;
                })
                return res;
            });
            return result;
        },

        getSerialNumberStatusCount: async (root, args, { FunnelGenieOrder }) => {
            const query = { ...funnel_order_query, "line_items.plg_serialNumber": { $in: JSON.parse(args.serial_numbers) }, order_status: args.order_status }, result = { count: 0 };
            const orders = await FunnelGenieOrder.find(query);
            orders.forEach((order, index) => {
                result.count += order.line_items.quantity;
            });
            return result;
        },

        getCODtotalOrderPerCountry: async (root, args, { FunnelGenieOrder }) => { // COD Statistics (COD ORDER PER COUNTRY)
            const result = { jsonStr: {} };
            var dateRange = {};
            if (args.dateStart && args.dateEnd) {
                dateRange = formatStartAndEndDate(args.dateStart, args.dateEnd, "getCODtotalOrderPerCountry");
            } else {
                const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                const end = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                dateRange = formatStartAndEndDate(start, end, "getCODtotalOrderPerCountry else");
            }
            const query = { ...funnel_order_query, "order_date": { $gte: dateRange.start, $lte: dateRange.end } };
            if (args.location) {
                const cod_available_country = _points.cod_available_country("no_country").filter(el => args.location.includes(el.iso2));
                const locations = [];
                cod_available_country.forEach(e => { locations.push(e.iso2); locations.push(e.iso3); });
                query["shipping_information.country"] = { $in: locations };
            }
            if (args.creator !== "") {
                query['creator'] = args.creator
            }
            const funnel_order_countries = await FunnelGenieOrder.aggregate(
                [
                    {
                        "$match": query
                    },
                    {
                        "$group": {
                            "_id": {
                                "country": "$shipping_information.country",
                                "order_date": {
                                    "$concat": [
                                        { "$substr": [{ "$month": "$order_date" }, 0, 2] }, "/",
                                        { "$substr": [{ "$dayOfMonth": "$order_date" }, 0, 2] }, "/",
                                        { "$substr": [{ "$year": "$order_date" }, 0, 4] }
                                    ]
                                }
                            },
                            "count": { "$sum": 1 }
                        }
                    },
                    {
                        "$sort": {
                            "order_date": -1
                        }
                    }
                ]
            ).allowDiskUse(true).exec().then(res => {
                var result = {
                    data: [],
                    total: 0
                };
                res.forEach(el => {
                    const lc = _points.iso3toIso2(el._id.country);
                    const isExist = result.data.filter(del => del.country == lc);
                    if (isExist.length != 0) {
                        result.data.forEach(del => {
                            if (del.country == lc) {
                                del.data.push({ date: el._id.order_date, count: el.count });
                                del.total += el.count;
                            }
                        })
                    } else {
                        result.data.push({ country: lc, data: [{ date: el._id.order_date, count: el.count }], total: el.count })
                    }
                    result.total += el.count;
                })
                return result;
            })
            result.jsonStr = funnel_order_countries;
            result.jsonStr = JSON.stringify(result.jsonStr);
            return result;
        },

        getCODOrderStatusRatesPerCountry: async (root, args, { FunnelGenieOrder }) => {
            let result = { jsonStr: {} }, rates = { total: 0 }, cod_available_country = _points.cod_available_country("no_country"), dateRange = {};
            if (args.dateStart && args.dateEnd) {
                dateRange = formatStartAndEndDate(args.dateStart, args.dateEnd, "getCODOrderStatusRatesPerCountry");
            } else {
                const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                const end = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                dateRange = formatStartAndEndDate(start, end, "getCODOrderStatusRatesPerCountry else");
            }
            const momentStart = moment(dateRange.start), momentEnd = moment(dateRange.end), momentDiff = momentEnd.diff(momentStart, 'days') + 1;
            const query = { ...funnel_order_query, "order_date": { $gte: dateRange.start, $lte: dateRange.end } }; // order_date or order_status_update
            const query_v2 = { ...query };
            const query_v3 = { ...query };
            query_v2.dateStatusDelivered = query.order_date;
            query_v3.order_status_update = query.order_date;
            delete query_v2.order_date; // to use date range of date delivered in delivered and paid status
            delete query_v3.dateStatusDelivered; // to use date range of order_status_update in cancelled status
            if (args.location) {
                cod_available_country = cod_available_country.filter(el => args.location.includes(el.iso2));
            }
            if (args.creator !== "") {
                query.creator = args.creator;
                query_v2.creator = args.creator;
                query_v3.creator = args.creator;
            }
            for (var index = 0; index < cod_available_country.length; index++) {
                const current = cod_available_country[index];
                query["shipping_information.country"] = { $in: [current.iso2, current.iso3] };
                query_v2["shipping_information.country"] = { $in: [current.iso2, current.iso3] };
                query_v3["shipping_information.country"] = { $in: [current.iso2, current.iso3] };
                const total = await FunnelGenieOrder.countDocuments({ ...query });
                const unfulfilled = await FunnelGenieOrder.countDocuments({ ...query, order_status: { $in: ['unfulfilled', 'unpaid'] } });
                const hold = await FunnelGenieOrder.countDocuments({ ...query, order_status: { $in: ['hold', 'pending'] } });
                const pickedup = await FunnelGenieOrder.countDocuments({ ...query, order_status: 'pickedup' });
                const cancelled = await FunnelGenieOrder.countDocuments({ ...query_v3, order_status: 'cancelled' });
                const delivered = await FunnelGenieOrder.countDocuments({ ...query_v2, order_status: 'delivered' });
                const paid = await FunnelGenieOrder.countDocuments({ ...query_v2, order_status: 'paid' });
                rates[current.iso2] = [
                    { status: "unfulfilled", count: unfulfilled, avg: unfulfilled / momentDiff },
                    { status: "hold", count: hold, avg: hold / momentDiff },
                    { status: "pickedup", count: pickedup, avg: pickedup / momentDiff },
                    { status: "cancelled", count: cancelled, avg: cancelled / momentDiff },
                    { status: "delivered", count: delivered, avg: delivered / momentDiff },
                    { status: "paid", count: paid, avg: paid / momentDiff },
                ]
                rates.total += total;
            }
            result.jsonStr = rates;
            result.jsonStr = JSON.stringify(result.jsonStr);
            return result;
        },

        // replacement for getCODOrderStatusRatesPerCountry chart
        getOrderMetrics: async (root, args, { FunnelGenieOrder }) => { // Order Metrics (Order Metrics)
            var result = { jsonStr: {} }, rates = {}, query = { ...funnel_order_query };
            if (args.dateStart && args.dateEnd) {
                const convertedDate = formatStartAndEndDate(args.dateStart, args.dateEnd, "getOrderMetrics");
                query.order_date = { $gte: convertedDate.start, $lte: convertedDate.end }
                query.shopify_order_number != ""
            }
            if (args.location) { // must pass one or more iso2 with comma separated
                let locations = args.location.split(","), query_locations = [];
                locations.forEach(iso2 => {
                    let iso3 = _points.iso2toIso3(iso2);
                    query_locations.push(iso2);
                    query_locations.push(iso3);
                })
                query["shipping_information.country"] = { $in: query_locations };
            }
            if (args.creator) {
                // must remove dahil sa user side gamitin lahat ng order nya
                delete query.merchant_type;
                delete query.fulfill_with_plg;
                delete query["shipping_information.country"];
                delete query["line_items.plg_sku"];
                query.creator = mongoose.Types.ObjectId(args.creator);
            }

            if (args.showShopifyOnly) {
                query['line_items.shopify_order_number'] = { $exists: true, $ne: null }
            }

            if (args.merchant_type) query.merchant_type = args.merchant_type;
            if (args.funnel_id) query.funnel_source_id = { $in: args.funnel_id.split(",") }; // expected to have 1 or more separated by comma to convert to array

            if (args.funnel_id) {
                var orderCreator = await FunnelGenieOrder.aggregate([{ "$match": query }, { "$group": { "_id": { "orderCreator": "$orderCreator" } } }]).allowDiskUse(true).exec();
                if (orderCreator.length) {
                    query.orderCreator = { $in: orderCreator.map(e => e._id.orderCreator) };  
                    delete query.funnel_source_id;
                }
            }

            let orders = await FunnelGenieOrder.aggregate([
                {
                    "$match": query
                },
                {
                    "$addFields": {
                        "line_items.payment_status": "$order_status" ,
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "orderCreator": "$orderCreator",
                            "email": "$shipping_information.email"
                        },
                        "creator": { "$first": "$creator" },
                        "merchant_type": { "$first": "$merchant_type" },
                        "currencyWord": { "$first": "$currencyWord" },
                        "order_status": { "$first": "$order_status" },
                        "iso3": { "$first": "$shipping_information.country" },
                        "order_date": { "$first": "$order_date" },
                        "line_items": { "$push": "$line_items" }
                    }
                }
            ]).allowDiskUse(true).exec();

            for (let i = 0; i < orders.length; i++) {
                let order = orders[i], total_price = 0, total_cog = 0, iso2 = _points.iso3toIso2(order.iso3);
                if (!rates[iso2]) rates[iso2] = { sales_revenue: 0, sales_orders: 0, profit_collected: 0, profit_made: 0, pending_sales: 0, cancelled_sales: 0, cancelled_orders: 0, cog: 0 };
                for (let x = 0; x < order.line_items.length; x++) {
                    let li = order.line_items[x];
                    // start old value is array or null convert to number
                    li.price = li.price ? li.price : 0; // if price is null
                    if (typeof li.price === "object") { // if price is array
                        let price = li.price[0];
                        delete li.price;
                        li.price = price;
                    }
                    // end old value is array convert to number

                    // start convert price
                    order.currencyWord = order.currencyWord ? order.currencyWord : "USD";
                    if (convertObject) li.price = parseFloat((li.price / convertObject.rates[order.currencyWord]).toFixed(2));
                    // end convert price

                    if (li.cost_of_goods !== undefined) {
                        if (convertObject) li.cost_of_goods = parseFloat((li.cost_of_goods / convertObject.rates[order.currencyWord]).toFixed(2));
                        total_cog = li.cost_of_goods; // accumulate price
                    }

                    total_price += li.price; // accumulate price

                    if (li.payment_status == "cancelled") { // cancelled_sales
                        rates[iso2].cancelled_orders += 1;
                        rates[iso2].cancelled_sales += li.price;
                        rates[iso2].cog += total_cog;
                    } else if (["delivered", "paid"].includes(li.payment_status)) { // sales_revenue
                        rates[iso2].sales_orders += 1;
                        rates[iso2].sales_revenue += li.price;
                        rates[iso2].cog += total_cog;
                    } else { // pending_sales and sales_revenue
                        rates[iso2].sales_orders += 1;
                        rates[iso2].sales_revenue += li.price;
                        rates[iso2].pending_sales += li.price;
                        rates[iso2].cog += total_cog;
                    }
                }

                // if (order.order_status == "cancelled") { // cancelled_sales
                //     rates[iso2].cancelled_orders += 1;
                //     rates[iso2].cancelled_sales += total_price;
                //     rates[iso2].cog += total_cog;
                // } else if (["delivered", "paid"].includes(order.order_status)) { // sales_revenue
                //     rates[iso2].sales_orders += 1;
                //     rates[iso2].sales_revenue += total_price;
                //     rates[iso2].cog += total_cog;
                // } else { // pending_sales and sales_revenue
                //     rates[iso2].sales_orders += 1;
                //     rates[iso2].sales_revenue += total_price;
                //     rates[iso2].pending_sales += total_price;
                //     rates[iso2].cog += total_cog;
                // }

            }

            let creators = [...new Set(orders.map(e => e.creator.toString()))];
            let countries = Object.keys(rates).filter(e => e);

            for (let i = 0; i < countries.length; i++) {
                let country = countries[i];
                for (let x = 0; x < creators.length; x++) {
                    let creator = creators[x], order_status_list = _points.list_of_order_status.filter(e => e.value && e.value !== "cancelled");
                    order_status_list = order_status_list.map(e => e.value);
                    let paycheck_payload = {
                        "query": `query($creator: String, $funnel_id: String, $fulfillerLocation: String, $order_status: String, $dateStart: String, $dateEnd: String, $isAdminPayout: Boolean, $useOrderDateAsDateFilter: Boolean){
                            getMyPayCheck(creator: $creator, funnel_id: $funnel_id, fulfillerLocation: $fulfillerLocation, order_status: $order_status, dateStart: $dateStart, dateEnd: $dateEnd, isAdminPayout: $isAdminPayout, useOrderDateAsDateFilter: $useOrderDateAsDateFilter){
                                count
                            }
                        }`,
                        "variables": {
                            creator,
                            funnel_id: args.funnel_id,
                            fulfillerLocation: country,
                            dateStart: args.dateStart,
                            dateEnd: args.dateEnd,
                            isAdminPayout: true,
                            useOrderDateAsDateFilter: true
                        }
                    }
                    let res_paycheck = await new Promise(resolve => {
                        _points.customFetch(_points.clientUrl + '/graphql', 'POST', paycheck_payload, result => resolve(result));
                    })
                    if (res_paycheck) {
                        let pm = res_paycheck.data.getMyPayCheck.count;
                        rates[country].profit_collected += pm;
                    }

                    paycheck_payload.variables.order_status = order_status_list.toString(); // for potential profit
                    delete paycheck_payload.variables.isAdminPayout; // for potential profit
                    let res_paycheck_2 = await new Promise(resolve => {
                        _points.customFetch(_points.clientUrl + '/graphql', 'POST', paycheck_payload, result => resolve(result));
                    })
                    if (res_paycheck_2) {
                        let pc = res_paycheck_2.data.getMyPayCheck.count;
                        rates[country].profit_made += pc;
                    }
                }
            }

            result.jsonStr = rates;
            result.jsonStr = JSON.stringify(result.jsonStr);
            return result;
        },

        getOrderStatusRatesPerCountry: async (root, args, { FunnelGenieOrder }) => { // COD Statistics (COD ORDER STATUS PER COUNTRY)
            // initialization
            let result = { jsonStr: {} }, rates = { total: 0 }, query = { ...funnel_order_query }, cod_available_country = _points.cod_available_country("no_country");
            // handle queries
            if (args.creator) query.creator = mongoose.Types.ObjectId(args.creator);
            if (args.dateStart && args.dateEnd) {
                let dateRange = formatStartAndEndDate(args.dateStart, args.dateEnd, "getOrderStatusRatesPerCountry");
                query.order_date = { $gte: dateRange.start, $lte: dateRange.end };
            }
            if (args.location && args.location.toUpperCase() !== "ALL") {
                cod_available_country = _points.cod_available_country("no_country").filter(e => e.iso2 === args.location || e.iso3 === args.location);
                if (cod_available_country.length !== 0) query["shipping_information.country"] = { $in: [cod_available_country[0].iso2, cod_available_country[0].iso3] };
                else throw new Error("Invalid COD Location");
            }
            // execution
            if (args.summary) { // only show the statuses count
                for (let i = 0; i < cod_available_country.length; i++) {
                    let current = cod_available_country[i];
                    query["shipping_information.country"] = { $in: [current.iso2, current.iso3] };
                    let total = await FunnelGenieOrder.countDocuments(query);
                    let unfulfilled = await FunnelGenieOrder.countDocuments({ ...query, order_status: { $in: ['unfulfilled', 'unpaid'] } });
                    let hold = await FunnelGenieOrder.countDocuments({ ...query, order_status: { $in: ['hold', 'pending'] } });
                    let pickedup = await FunnelGenieOrder.countDocuments({ ...query, order_status: 'pickedup' });
                    let confirmed = await FunnelGenieOrder.countDocuments({ ...query, order_status: 'confirmed' });
                    let cancelled = await FunnelGenieOrder.countDocuments({ ...query, order_status: 'cancelled' });
                    let delivered = await FunnelGenieOrder.countDocuments({ ...query, order_status: 'delivered' });
                    let paid = await FunnelGenieOrder.countDocuments({ ...query, order_status: 'paid' });
                    rates.total = total;
                    rates[current.iso2] = [
                        { status: "unfulfilled", count: unfulfilled },
                        { status: "hold", count: hold },
                        { status: "pickedup", count: pickedup },
                        { status: "confirmed", count: confirmed },
                        { status: "cancelled", count: cancelled },
                        { status: "delivered", count: delivered },
                        { status: "paid", count: paid }
                    ]
                }
            } else { // show statuses count and product
                let orders = await FunnelGenieOrder.aggregate([
                    { "$match": query },
                    {
                        "$group": {
                            "_id": {
                                "iso3": "$shipping_information.country",
                                "product_name": "$line_items.title"
                            },
                            "ids": { "$push": "$_id" },
                            "count": { "$sum": 1 }
                        }
                    }
                ]).allowDiskUse(true).exec();

                for (let i = 0; i < orders.length; i++) {
                    let current = orders[i];
                    rates.total += current.count;

                    let unfulfilled = await FunnelGenieOrder.countDocuments({ _id: { $in: current.ids }, order_status: { $in: ['unfulfilled', 'unpaid'] } });
                    let hold = await FunnelGenieOrder.countDocuments({ _id: { $in: current.ids }, order_status: { $in: ['hold', 'pending'] } });
                    let pickedup = await FunnelGenieOrder.countDocuments({ _id: { $in: current.ids }, order_status: 'pickedup' });
                    let cancelled = await FunnelGenieOrder.countDocuments({ _id: { $in: current.ids }, order_status: 'cancelled' });
                    let delivered = await FunnelGenieOrder.countDocuments({ _id: { $in: current.ids }, order_status: 'delivered' });
                    let paid = await FunnelGenieOrder.countDocuments({ _id: { $in: current.ids }, order_status: 'paid' });
                    let confirmed = await FunnelGenieOrder.countDocuments({ ...query, order_status: 'confirmed' });

                    let statuses = [
                        { status: "unfulfilled", count: unfulfilled },
                        { status: "hold", count: hold },
                        { status: "pickedup", count: pickedup },
                        { status: "confirmed", count: confirmed },
                        { status: "cancelled", count: cancelled },
                        { status: "delivered", count: delivered },
                        { status: "paid", count: paid }
                    ]

                    if (!rates[_points.iso3toIso2(current._id.iso3)]) { // initialize per country
                        rates[_points.iso3toIso2(current._id.iso3)] = [{ product_name: _points.capitalizeWord(current._id.product_name), statuses }];
                    } else { // push to the initialized country
                        rates[_points.iso3toIso2(current._id.iso3)].push({ product_name: _points.capitalizeWord(current._id.product_name), statuses });
                    }
                }
            }
            result.jsonStr = rates;
            result.jsonStr = JSON.stringify(result.jsonStr);
            return result;
        },

        getCODOrderProductCost: async (root, args, { FunnelGenieOrder }) => { // COD Statistics (4 small boxes in right side)
            var result = { jsonStr: {} }, query = { ...funnel_order_query, order_status: { $in: ["delivered", "paid"] } }, convertedDate = {}, data = {}, cod_available_country = _points.cod_available_country("no_country");
            convertedDate = formatStartAndEndDate(args.dateStart, args.dateEnd, "getCODOrderProductCost");
            query["order_date"] = { $gte: convertedDate.start, $lte: convertedDate.end };
            if (args.location) {
                cod_available_country = cod_available_country.filter(el => args.location.includes(el.iso2));
                const locations = [];
                cod_available_country.forEach(e => { locations.push(e.iso2); locations.push(e.iso3); });
                query["shipping_information.country"] = { $in: locations };
            }
            if (args.creator) {
                query.creator = args.creator;
            }
            const orders = await FunnelGenieOrder.find(query).sort({ "shipping_information.email": "asc", orderCreator: "asc" });
            const plg_sku_list = [...new Set(orders.map(el => el.line_items.plg_sku))], plg_sku_data = {};
            // get the cod funnel product of distinct sku
            for (var i = 0; i < plg_sku_list.length; i++) {
                const sku = plg_sku_list[i];
                if (typeof sku !== "function" && sku && mongoose.Types.ObjectId.isValid(mongoDBId.decode(sku))) {
                    plg_sku_data[sku] = await getFunnelProducts({ id: sku }, true);
                }
            }
            // initialize the variable data
            cod_available_country.forEach(country => {
                data[country.iso2] = 0;
            })
            // parse the funnel orders
            for (var i = 0; i < orders.length; i++) {
                const current_order = orders[i], current_plg_sku = current_order.line_items.plg_sku, current_plg_sku_data = plg_sku_data[current_plg_sku], order_country_iso2 = _points.iso3toIso2(current_order.shipping_information.country);
                if (current_plg_sku_data) { // if meron nakuha na result ang order plg sku meaning tama ung sku
                    if (args.costBy == "delivery") {
                        if (i == 0 || (orders[i - 1] && !(orders[i - 1].shipping_information.email == current_order.shipping_information.email && orders[i - 1].orderCreator == current_order.orderCreator))) {
                            data[order_country_iso2] += current_plg_sku_data.productDeliveryCost;
                        }
                    } else if (args.costBy == "fulfillment") {
                        if (i == 0 || (orders[i - 1] && !(orders[i - 1].shipping_information.email == current_order.shipping_information.email && orders[i - 1].orderCreator == current_order.orderCreator))) {
                            data[order_country_iso2] += current_plg_sku_data.fulfillmentCost;
                        }
                    } else if (args.costBy == "inventory") {
                        data[order_country_iso2] += current_plg_sku_data.productCost;
                    }
                }
            }
            result.jsonStr = data;
            result.jsonStr = JSON.stringify(result.jsonStr);
            return result;
        },

        getPLGPaycheck: async (root, args, { FunnelGenieOrder }) => { // Manage COD Payouts (Commission)
            const result = { jsonStr: { count: 0 } }, query = { ...funnel_order_query, order_status: "delivered", "line_items.plg_sku": { $exists: true }, received_payment_from_courier: true };
            if (args.dateStart && args.dateEnd) {
                const dateRange = formatStartAndEndDate(args.dateStart, args.dateEnd, "getPLGPaycheck");
                query["dateStatusDelivered"] = { $gte: dateRange.start, $lte: dateRange.end };
            }
            if (args.location && args.location != "ALL") {
                var location = _points.cod_available_country("no_country");
                location = location.filter(el => el.iso2 == args.location).reduce(e => e);
                query["shipping_information.country"] = { $in: [location.iso2, location.iso3] }
            }
            const datas = await FunnelGenieOrder.find(query).lean().catch(err => []);
            const product_ids = distinctSerialOrSku(datas), product_list = await getOrderFunnelProducts(product_ids);
            for (var i = 0; i < datas.length; i++) {
                var data = datas[i], result_product = null;
                if (data.line_items.plg_serialNumber && data.line_items.plg_serialNumber.length != 0) {
                    result_product = product_list[data.line_items.plg_serialNumber[0].split("_")[1]];
                } else {
                    result_product = product_list[data.line_items.plg_sku];
                }
                if (result_product) result.jsonStr.count += (result_product.yabazoo * data.line_items.quantity);
            }
            result.jsonStr = JSON.stringify(result.jsonStr);
            return result;
        },

        getAllTimeBuyersCount: async (root, args, { FunnelGenieOrder }) => {
            let iso3 = _points.iso2toIso3(args.location), iso2 = _points.iso3toIso2(iso3);
            let match = { ...funnel_order_query, "shipping_information.country": { $in: [iso2, iso3] }, "line_items.plg_sku": { $nin: [null, "", "000", "0000"] }, order_status: { $in: ["delivered", "paid"] } };
            let count = { count: 0 }, result = await FunnelGenieOrder.aggregate([
                {
                    "$match": match
                },
                {
                    "$group": {
                        "_id": {
                            "name": "$shipping_information.name",
                            "email": "$shipping_information.email"
                        },
                        "count": { "$sum": 1 }
                    }
                }
            ]).allowDiskUse(true).exec();
            result.forEach(e => {
                count.count += e.count;
            })
            return count;
        },

        getMyFunnelSubscribers: async (root, args, { FunnelGenieOrder }) => { // Funnel Subscribers
            let limit = typeof args.limit !== "undefined" ? args.limit : 0, skip = (args.page - 1) * limit;
            let count = await FunnelGenieOrder.countDocuments({ creator: args.id, order_type: "subscription" });
            let result = await FunnelGenieOrder.find({ creator: args.id, order_type: "subscription" }).skip(skip).limit(limit).lean();
            result = result.map(e => {
                e.id = e._id.toString();
                e.count = count;
                e.line_items = [e.line_items];
                return e;
            })
            return result;
        },

        getMessageCount: async (root, args, { Messages }) => {
            let query = { $or: [{ sender_id: args.user_id }, { receiver_id: args.is_admin ? { $in: ["", args.user_id] } : args.user_id }] };
            let count = await Messages.find(query, { sender_id: 1, receiver_id: 1, sender_unread_count: 1, receiver_unread_count: 1 }).lean().then(result => {
                let accumulator = 0;
                for (let i = 0; i < result.length; i++) {
                    let data = result[i];
                    if (data.sender_id === args.user_id) accumulator += data.sender_unread_count;
                    else accumulator += data.receiver_unread_count; // or data.receiver_id === args.user_id
                }
                return accumulator;
            });
            return { unread_count: count };
        },

        getMessages: async (root, args, { Messages, User, FunnelList, FunnelPageList, currentUser }) => {
            let limit = 0, query = {};
            if (args.id) query._id = args.id;
            if (args.user_id) query.$or = [{ sender_id: args.user_id }, { receiver_id: args.is_admin ? { $in: ["", args.user_id] } : args.user_id }];
            if (args.limit) limit = args.limit;
            if (args.search_user) {
                if (args.search_user) {
                    var regex = new RegExp(args.search_user, "gi");
                    let ids = await User.find({ $or: [{ firstName: regex }, { lastName: regex }, { email: regex },] }, { _id: 1, firstName: 1, lastName: 1, email: 1 }).then(res => {
                        return [...new Set(res.map(e => e.id))];
                    });
                    query = { $or: [{ sender_id: { $in: ids } }, { receiver_id: { $in: ids } }] };
                }
            }
            let result = await Messages.find(query).sort({ last_message_date: "desc" }).limit(limit).then(async result => {
                for (let i = 0; i < result.length; i++) {
                    let is_sender = result[i].sender_id === args.user_id ? true : false;
                    let opposite_id = is_sender ? result[i].receiver_id : result[i].sender_id; // opposite id for displaying the chat user info
                    let name = "My Product Request", picture = null, unread_count = is_sender ? result[i].sender_unread_count : result[i].receiver_unread_count, privilege = 10;
                    // Start Add User Information and notification count
                    if (opposite_id) {
                        let user_info = await User.findById({ _id: opposite_id }, { privilege: 1, profileImage: 1, firstName: 1, lastName: 1 }).lean();
                        if (user_info) {
                            name = user_info.firstName + " " + user_info.lastName;
                            picture = user_info.profileImage || null;
                            privilege = user_info.privilege;
                            if (!result[i].receiver_id) name += " ( Product Request )";
                        } else {
                            name = "PLG User";
                        }
                    }
                    result[i].user_id = opposite_id;
                    result[i].name = name;
                    result[i].picture = picture;
                    result[i].unread_count = unread_count;
                    result[i].privilege = privilege;
                    // End Add User Information and notification count
                    if (!args.view_list) {
                        let replier_list = {};
                        for (let x = 0; x < result[i].messages.length; x++) {
                            // start replier info
                            let replier_id = result[i].messages[x].replier_id;
                            if (!result[i].receiver_id && result[i].sender_id !== replier_id && replier_id) { // only available in cod product request for multiple user in conversation
                                if (!replier_list[replier_id]) replier_list[replier_id] = await User.findById({ _id: replier_id }, { firstName: 1, lastName: 1 }).lean();
                                let replier_info = replier_list[replier_id];
                                result[i].messages[x].replier_name = replier_info.firstName + " " + replier_info.lastName;
                            }
                            // end replier info

                            // start chat position
                            result[i].messages[x].position = "left";
                            if (result[i].receiver_id) { // normal chat user to user
                                if (result[i].messages[x].replier_id && result[i].messages[x].replier_id === args.user_id) result[i].messages[x].position = "right"; // reply ng chat owner sa chat
                                else if (!result[i].messages[x].replier_id && result[i].sender_id === args.user_id) result[i].messages[x].position = "right"; // unang chat so owner to ng nka login
                            } else { // chat with cod request -> user vise versa or admin to admin in 1 conversation
                                if (result[i].messages[x].replier_id && result[i].messages[x].replier_id === currentUser.id) result[i].messages[x].position = "right";
                                else if (!result[i].messages[x].replier_id && result[i].sender_id === currentUser.id) result[i].messages[x].position = "right";
                            }
                            // end chat position

                            // Start Funnel Information
                            if (result[i].messages[x].additional_data && result[i].messages[x].additional_data.funnel_id) {
                                let funnel = await FunnelList.findById({ _id: result[i].messages[x].additional_data.funnel_id }, { funnel_name: 1 });
                                if (funnel) result[i].messages[x].additional_data.funnel_name = _points.presentableFunnelName(funnel.funnel_name);
                            }
                            if (result[i].messages[x].additional_data && result[i].messages[x].additional_data.page_id) {
                                let page = await FunnelPageList.findById({ _id: result[i].messages[x].additional_data.page_id }, { path: 1 });
                                if (page) result[i].messages[x].additional_data.page_name = _points.presentableFunnelName(page.path || "Homepage");
                            }
                            // End Funnel Information
                        }
                    }
                }
                if (args.unread) result = result.filter(e => e.unread_count);
                return result;
            });
            return result;
        },

        getUserById: async (root, args, { User }) => {
            return await User.findById({ _id: args.id });
        },
        getMyStaffs: async (root, args, { User }) => {
            return User.findOne({ "_id": args.staffEmail }).then(async user => {
                return user.staffIds.map(staff => {
                    return User.findOne({ "email": staff }).then(result => {
                        if (result === null) {

                            return { "email": staff, firstName: "", lastName: "" };
                        } else {
                            return result;
                        }
                    });
                });
            });
        },
        getMyMasters: async (root, args, { User }) => {
            // test kit 60084cb5442dd031b776eb3e
            return User.findById({ "_id": args.staffId }).then(async user => {
                return User.find({ _id: { $in: user.masterIds } }).then(result => {
                    return result;
                });
            });
        },
        checkInvites: async (root, args, { User }) => {
            return await User.findOne({ "email": args.email });
        },
        getUserByReferral: async (root, args, { User }) => {
            return await User.findOne({ "referralId": args.referralId });
        },
        // jerome end here
    },
    // TODO :: List of Mutations
    Mutation: {
        // * ADD Commerce HQ
        addCommerceHQ: async (root, args, { User, Admin }) => {
            try {
                var newUser = await User.findByIdAndUpdate({ "_id": args.id }, {
                    $set: {
                        commerceHQ: {
                            apiKey: args.apiKey,
                            apiPassword: args.apiPassword,
                            storeName: args.storeName
                        }
                    }
                })

                return newUser;
            } catch (error) {
                console.log(error);
                return null;
            }
        },
        // * :: Add Payoneer Details =====
        addPayoneerDetails: async (root, args, { User, Admin }) => {
            try {
                var newUser = await User.findByIdAndUpdate({ "_id": args.id }, {
                    $set: {
                        payoneer_details: {
                            beneficiary_name: args.beneficiary_name,
                            address: args.address,
                            routing_number: args.routing_number,
                            account_type: args.account_type,
                            account_number: args.account_number,
                            name: args.name,
                        }
                    }
                })

                return newUser;
            } catch (error) {
                console.log(error);
                return null;
            }
        },
        removeStaff: async (root, { staffEmail, masterId }, { User, Admin }) => {
            try {
                console.log('remove this from staff ', masterId, staffEmail);
                // var sendEmail = () => new Promise((resolve, reject) => {
                //     _points.customFetch(_points.clientUrl + '/send-invite', 'POST', {
                //         "email_staff": staffEmail,
                //         "master_name": masterEmail,                        
                //         "master_id": masterId,
                //     }, result => {
                //         console.log("email sent to mutation result =>> ", result);
                //         resolve(result);
                //     })
                // });

                // await sendEmail();
                await User.findOneAndUpdate({ "email": staffEmail }, {
                    $pull: { masterIds: masterId }
                });
                var newUser = await User.findByIdAndUpdate({ "_id": masterId }, {
                    $pull: { staffIds: staffEmail }
                });
                console.log("newUser Master Removed =>>> ", staffEmail);
                return newUser;
            } catch (error) {
                console.log(error);
                return null;
            }
        },
        acceptInvitation: async (root, { staffId, masterId }, { User, Admin }) => {
            try {
                console.log('accept this master ', masterId, staffId);
                // var sendEmail = () => new Promise((resolve, reject) => {
                //     _points.customFetch(_points.clientUrl + '/send-invite', 'POST', {
                //         "email_staff": staffEmail,
                //         "master_name": masterEmail,                        
                //         "master_id": masterId,
                //     }, result => {
                //         console.log("email sent to mutation result =>> ", result);
                //         resolve(result);
                //     })
                // });

                // await sendEmail();
                var newUser = await User.findByIdAndUpdate({ "_id": staffId }, {
                    $push: { masterIds: masterId },
                    $push: { access_tags: 'staff_account' }
                });
                console.log("newUser Master Added =>>> ", masterId);
                return newUser;
            } catch (error) {
                console.log(error);
                return null;
            }
        },
        addStaff: async (root, { staffEmail, masterId, masterEmail }, { User, Admin }) => {
            try {
                staffEmail = staffEmail.replace(/\s/g, "").toLowerCase(); // remove all spaces on staffEmail address and make it small letter
            } catch (err) {
                console.error("Error in addStaff ==>", err);
            }
            try {
                console.log('invite sent to staff ', staffEmail);
                var sendEmail = () => new Promise((resolve, reject) => {
                    _points.customFetch(_points.clientUrl + '/send-invite', 'POST', {
                        "email_staff": staffEmail,
                        "master_name": masterEmail,
                        "master_id": masterId,
                    }, result => {
                        console.log("email sent to mutation result =>> ", result);
                        resolve(result);
                    })
                });

                await sendEmail();
                var newUser = await User.findByIdAndUpdate({ "_id": masterId }, {
                    $push: { staffIds: staffEmail }
                });
                console.log("newUser =>>> ", staffEmail);
                return newUser;
            } catch (error) {
                return null;
            }
        },





        updateGeneratedButton: async (root, { productDescription, productName, buttonLabelText, redirectURI, buttonTitle, injectedStyle, rawButton, id, amount }, { Generatedbutton }) => {
            try {
                const saveGeneratedButton = await Generatedbuttons.findByIdAndUpdate({
                    _id: id
                }, {
                    $set: {
                        "buttonTitle": buttonTitle,
                        "injectedStyle": injectedStyle,
                        "buttonLabelText": buttonLabelText,
                        "redirectURI": redirectURI,
                        "rawButton": rawButton,
                        "productName": productName,
                        "productDescription": productDescription,
                        "amount": amount
                    }
                });
                return saveGeneratedButton;
            } catch (error) {
                console.log('Error saveGeneratedButton', error);
                return null;
            }
        },
        deleteGeneratedButton: async (root, { id }, { Generatedbutton }) => {
            try {
                const deletingButton = await Generatedbuttons.findByIdAndRemove(id);
                return deletingButton;
            } catch (error) {
                console.log('Error deleteGeneratedButton', error);
                return null;
            }
        },
        addGeneratedButton: async (root, { productDescription, productName, buttonLabelText, redirectURI, creator, buttonTitle, injectedStyle, rawButton, amount }, { Generatedbutton }) => {
            try {
                const saveGeneratedButton = await new Generatedbuttons({
                    creator: creator,
                    buttonTitle: buttonTitle,
                    injectedStyle: injectedStyle,
                    buttonID: "",
                    buttonLabelText: buttonLabelText,
                    productName: productName,
                    productDescription: productDescription,
                    redirectURI: redirectURI,
                    rawButton: rawButton,
                    amount: amount
                }).save();
                return saveGeneratedButton;
            } catch (error) {
                console.log('Error saveGeneratedButton', error);
                return null;
            }
        },
        updateGeneratedButtonID: async (root, { id, buttonID }, { Generatedbutton }) => {
            try {
                const saveGeneratedButton = await Generatedbuttons.findByIdAndUpdate({
                    _id: id
                }, {
                    $set: {
                        "buttonID": buttonID
                    }
                });
                return saveGeneratedButton;
            } catch (error) {
                console.log('Error saveGeneratedButton', error);
                return null;
            }
        },


        //July1 PageTemplates
        addPageTemplates: async (root, { description, design, screenshot_link, screenshot_link_preview, type, creator }) => {
            try {
                const savePageTemplates = await new PageTemplates({
                    creator: creator,
                    description: description,
                    design: design,
                    screenshot_link: screenshot_link,
                    screenshot_link_preview: screenshot_link_preview,
                    type: type,
                }).save();
                return savePageTemplates;
            } catch (error) {
                console.log('Error SavingPageTemplate', error);
                return null;
            }
        },



        deletePageTemplate: async (root, { id }) => {
            try {
                const templateDeletion = await PageTemplates.findByIdAndRemove(id);
                return templateDeletion;
            } catch (error) {
                console.log('Error Deleting  a template', error);
                return null;
            }
        },


        updatePageTemplate: async (root, { id, description, design, screenshot_link, screenshot_link_preview, type }) => {

            try {
                const updatePageTemplate = await PageTemplates.findByIdAndUpdate({
                    _id: id
                }, {
                    $set: {
                        "description": description,
                        "design": design,
                        "screenshot_link": screenshot_link,
                        "screenshot_link_preview": screenshot_link_preview,
                        "type": type
                    }
                });
                return updatePageTemplate;
            } catch (error) {
                console.log('Error updatePageTemplate', error);
                return null;
            }
        },
        //July1



        addFunnelBlocks: async (root, { category, data, display_mode, tags, creator, }, { FunnelBlocks }) => {
            try {
                const saveFunnelBlock = await new FunnelBlocks({
                    category: category,
                    data: data, // decode and encode uri component to convert JSON.parse(decodeURIComponent(encodeURIComponent(JSON.stringify(temp1)))) 
                    display_mode: display_mode,
                    tags: tags,
                    creator: creator,
                }).save();
                return saveFunnelBlock;
            } catch (error) {
                console.log('Error FunnelBlock', error);
                return null;
            }
        },
        signupFreeViral: async (root, { firstName, lastName, email, access_tags, password, kartra, address_fv, dealerName, phone, city, zip, state }, { User, Admin }) => {
            try {
                email = email.replace(/\s/g, "").toLowerCase(); // remove all spaces on email address and make it small letter
            } catch (err) {
                console.error("Error in signupUser ==>", err);
            }
            const user = await User.findOne({ email });

            if (user) {
                throw new Error('User already exits');
            }

            const adminMessage = await Admin.findOne({});
            // TODO :: newUser Sign UP Call set to zero for new free user. Coming from freeviralproducts.com
            var newUser = await new User({
                referralId: shortid.generate(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                access_tags: access_tags,
                address_fv: address_fv,
                dealerName,
                phone,
                city,
                zip,
                state,
                email,
                password,
                kartra,
                privilege: 0, // ? kartra ? 1 : 0
                notification: kartra && adminMessage.homepage_message_trial ? [
                    {
                        type: "info",
                        message: adminMessage.homepage_message_trial,
                        date: Date.now()
                    }
                ] : []
            }).save();

            // start get kartra tags
            console.log("signupUser", "/kartratags2")
            const kartraTags = await fetch(_points.apiServer + '/kartratags2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: newUser.kartra ? newUser.kartra : newUser.email })
            })
                .then(res => res.json())
                .then(result => {
                    return result;
                })
                .catch(err => {
                    console.log("Sign up user get kartra tags", err)
                });

            console.log("signupUser from FreeViral Cars", newUser.id);
            newUser = await User.findByIdAndUpdate({ _id: newUser.id }, {
                $set: {
                    kartra_tags: kartraTags.tags
                }
            });
            // end kartra tags

            return newUser;
        },
        signupUser: async (root, { firstName, lastName, email, password, kartra }, { User, Admin }) => {
            try {
                email = email.replace(/\s/g, "").toLowerCase(); // remove all spaces on email address and make it small letter
            } catch (err) {
                console.error("Error in signupUser ==>", err);
            }
            const user = await User.findOne({ email });

            if (user) {
                throw new Error('User already exits');
            }

            const adminMessage = await Admin.findOne({});
            // TODO :: newUser Sign UP Call set to zero for new free user. Coming from freeviralproducts.com
            var newUser = await new User({
                referralId: shortid.generate(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email,
                password,
                kartra,
                privilege: 0, // ? kartra ? 1 : 0
                notification: kartra && adminMessage.homepage_message_trial ? [
                    {
                        type: "info",
                        message: adminMessage.homepage_message_trial,
                        date: Date.now()
                    }
                ] : []
            }).save();

            // start get kartra tags
            console.log("signupUser", "/kartratags2")
            const kartraTags = await fetch(_points.apiServer + '/kartratags2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: newUser.kartra ? newUser.kartra : newUser.email })
            })
                .then(res => res.json())
                .then(result => {
                    return result;
                })
                .catch(err => {
                    console.log("Sign up user get kartra tags", err)
                });

            console.log("signupUser", newUser.id);
            newUser = await User.findByIdAndUpdate({ _id: newUser.id }, {
                $set: {
                    kartra_tags: kartraTags.tags
                }
            });
            // end kartra tags

            return { token: createToken(newUser, process.env.JWT_SECRET, "24hr") };
        },

        signinUser: async (root, { email, password, user_session_cookie }, { User }) => {
            try {
                email = email.replace(/\s/g, "").toLowerCase(); // remove all spaces on email address and make it small letter
            } catch (err) {
                console.error("Error in signinUser ==>", err);
            }
            var user = await User.findOne({ email }).catch(err => null)
            if (!user) {
                throw new Error('User Not Found');
            }
            var userId = user.id;


            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                throw new Error('Invalid password');
            }

            if (!user.referralId) {
                user = await User.findByIdAndUpdate({ _id: userId }, { $set: { referralId: shortid.generate() } })
            }

            // TODO Adding DETECTION IF THE USER EXCEEDED IN IMPRESSIONS 
            if (user.privilege == 0) {
                var payload = { "query": "{   everyPagebyCreator(creatorID: \"" + userId + "\"){   purchased   pageType   pageID   funnelID   date   conversion   device   fromPage   }}", "variables": null, "operationName": null };
                _points.customFetch('https://stats.productlistgenie.io/graphql', 'POST', payload, async result => {
                    let data = [];
                    data = result.data.everyPageByCreator;
                    console.log(result.data.everyPagebyCreator.length);
                    // ? SCAN IF User has impression data to be filter
                    if (result.data.everyPagebyCreator.length !== 0) {
                        let array = result.data.everyPagebyCreator;
                        var total_impression = _points.getStatsDataFromArray("impression", array);
                        // var impressionMobile = points.getStatsDataFromArray("impression_mobile", array);
                        if (total_impression > 100) {
                            console.log(`UPDATE USER ADD TAGS "exceeded_impressions" 100 ${userId}`);
                            if (user.access_tags && !user.access_tags.includes("EXCEEDED_IMPRESSIONS")) {
                                console.log(user.access_tags.concat("EXCEEDED_IMPRESSIONS"));
                                user = await User.findByIdAndUpdate({ _id: userId }, { $set: { access_tags: user.access_tags.concat("EXCEEDED_IMPRESSIONS") } })
                            }
                        }
                        // else if (total_impression > 2000) {
                        //     console.log(`UPDATE USER ADD TAGS "exceeded_impressions" 2000 ${userId}`);
                        //     if (user.access_tags && !user.access_tags.includes("EXCEEDED_IMPRESSIONS")) {
                        //         console.log(user.access_tags.concat("EXCEEDED_IMPRESSIONS"));
                        //         user = await User.findByIdAndUpdate({ _id: userId }, { $set: { access_tags: user.access_tags.concat("EXCEEDED_IMPRESSIONS") } })
                        //     }
                        // } 
                        else if (total_impression > 10000) {
                            console.log(`UPDATE USER ADD TAGS "exceeded_impressions" 10000 ${userId}`);
                            if (user.access_tags && !user.access_tags.includes("EXCEEDED_IMPRESSIONS")) {
                                console.log(user.access_tags.concat("EXCEEDED_IMPRESSIONS"));
                                user = await User.findByIdAndUpdate({ _id: userId }, { $set: { access_tags: user.access_tags.concat("EXCEEDED_IMPRESSIONS") } })
                            }
                        }
                        else {
                            console.log(`User doesn't exceed the limit. `);
                        }

                    }
                });
            }

            // ? END: 

            // reset the counter of everything of user
            if (user.privilege <= 1 && user.lastLoginDate) {
                let userLastLogin = new Date(user.lastLoginDate).toLocaleDateString();
                let dateNow = new Date().toLocaleDateString();
                if (userLastLogin < dateNow) {
                    // it passed the validation so save the cookie to database
                    user = await User.findByIdAndUpdate({ _id: userId }, {
                        $set: {
                            user_session_cookie: user_session_cookie,
                            lastLoginDate: Date.now(),
                            count_addReview: 0,
                            count_copyPush: 0,
                            count_pushToStore: 0,
                            count_pushWithBundle: 0,
                            count_hotProducts: 0
                        }
                    })
                } else {
                    // it passed the validation so save the cookie to database
                    user = await User.findByIdAndUpdate({ _id: userId }, { $set: { user_session_cookie, lastLoginDate: Date.now() } });
                }
            } else {
                // it passed the validation so save the cookie to database
                user = await User.findByIdAndUpdate({ _id: userId }, { $set: { user_session_cookie, lastLoginDate: Date.now() } });
            }
            // end reset

            // START: check user transaction history and update privilege if needed
            if (user.privilege <= 3) { // User Privilege
                const transaction_history = await fetch(_points.apiServer + '/kartrasubscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: user.kartra ? user.kartra : user.email })
                })
                    .then(res => res.json())
                    .then(result => {
                        return result;
                    })
                    .catch(err => {
                        throw new Error('Kartra is offline');
                    });
                // check if status success
                if (transaction_history.status && transaction_history.status == "Success") {
                    var kartraTransaction = transaction_history.actions[0].get_transactions_from_lead.transaction_list;
                    if (kartraTransaction.length != 0) {
                        var newTransact = [];
                        var failedTransact = [];
                        var totalExpenses = 0;
                        var dfy = false;
                        var plgThemeBump = false;
                        var success_rebill = false;
                        kartraTransaction.map((data, i) => {
                            // if rebill twice
                            if (i != 0 && !success_rebill && data.transaction_type == "rebill" && kartraTransaction[i - 1].transaction_type == "rebill") {
                                success_rebill = true;
                            }
                            // for success transaction
                            if (data.transaction_type == "sale" || data.transaction_type == "rebill") {
                                if (data.product_name == "Funnel Genie Trial" || data.product_name == "Funnel Genie Optin" || data.product_name == "PLG GFO" || data.product_name == "Product List Genie Full" || data.product_name == "PLG Full Settlement" || data.product_name == "Product List Genie Basic") {
                                    newTransact.push(data);
                                }
                                if (data.product_name == "PLG Theme DFY") {
                                    dfy = true;
                                }
                                if (data.product_name == "PLG Theme Bump") {
                                    plgThemeBump = true;
                                }
                                if (data.transaction_full_amount) {
                                    totalExpenses += parseFloat(data.transaction_full_amount);
                                }
                            }
                            // for failed transaction
                            if (data.transaction_type == "failed" || data.transaction_type == "refund" || data.transaction_type == "cancellation") {
                                if (data.product_name == "Funnel Genie Trial" || data.product_name == "Funnel Genie Optin" || data.product_name == "PLG GFO" || data.product_name == "Product List Genie Full" || data.product_name == "PLG Full Settlement" || data.product_name == "Product List Genie Basic") {
                                    failedTransact.push(data);
                                }
                            }

                            // handle reducing the total expencess if refund
                            if (data.transaction_type == "refund" || data.transaction_type == "chargeback") {
                                if (data.transaction_full_amount) {
                                    totalExpenses = totalExpenses - parseFloat(data.transaction_full_amount);
                                }
                            }
                        });

                        if (newTransact.length > 0) {
                            var lastPLGPurchase = newTransact[newTransact.length - 1];
                            var lastPLGFailedTransact = failedTransact[failedTransact.length - 1];
                            if (failedTransact.length != 0 && lastPLGFailedTransact.product_id == lastPLGPurchase.product_id && new Date(lastPLGFailedTransact.transaction_date).getTime() > new Date(lastPLGPurchase.transaction_date).getTime()) {
                                // kapag failed or refunded
                                user = await User.findByIdAndUpdate({ _id: userId }, { $set: { privilege: 0, total_exprenses: totalExpenses, purchase_dfy: dfy, success_rebill, allowMultiConnectStore: plgThemeBump } });
                                console.log("privilege set to 0 because of failed transaction of the latest subscription and it was much latest than the subscription")
                            } else {
                                // pag success check the product name price kung hindi 0.00
                                if ((lastPLGPurchase.product_name == "PLG GFO" || lastPLGPurchase.product_name == "Product List Genie Full" || lastPLGPurchase.product_name == "PLG Full Settlement") && lastPLGPurchase.transaction_full_amount != "0.00") {
                                    console.log("migrating to privilege 3 w/c is plg full not zero price and settlement come this way")
                                    user = await User.findByIdAndUpdate({ _id: userId }, { $set: { privilege: 3, total_exprenses: totalExpenses, purchase_dfy: dfy, success_rebill, allowMultiConnectStore: plgThemeBump } });
                                } else if (lastPLGPurchase.product_name == "Product List Genie Basic" && lastPLGPurchase.transaction_full_amount != "0.00") {
                                    console.log("migrating to privilege 2 w/c is plg basic not zero price")
                                    user = await User.findByIdAndUpdate({ _id: userId }, { $set: { privilege: 2, total_exprenses: totalExpenses, purchase_dfy: dfy, success_rebill, allowMultiConnectStore: plgThemeBump } });
                                } else {
                                    // new condition to handle 0.00 price and decide if 7 days trial is consumed
                                    if (lastPLGPurchase.product_name == "PLG GFO" || lastPLGPurchase.product_name == "Product List Genie Full" || lastPLGPurchase.product_name == "Product List Genie Basic") {
                                        var transactionDate = new Date(lastPLGPurchase.transaction_date).getTime();
                                        if (new Date().getTime() <= _points.addDateFrom(transactionDate, 8)) {
                                            console.log("migrating to privilege 1 w/c is plg basic or full zero price")
                                            user = await User.findByIdAndUpdate({ _id: userId }, { $set: { privilege: 1, total_exprenses: totalExpenses, purchase_dfy: dfy, success_rebill, allowMultiConnectStore: plgThemeBump } });
                                        } else {
                                            console.log("set Privilege to 0 dahil ubos na trial nito")
                                            user = await User.findByIdAndUpdate({ _id: userId }, { $set: { privilege: 0, total_exprenses: totalExpenses, purchase_dfy: dfy, success_rebill, allowMultiConnectStore: plgThemeBump } });
                                        }
                                    }
                                }
                            }
                        } else {
                            // sa failed rebill or sale
                            user = await User.findByIdAndUpdate({ _id: userId }, { $set: { privilege: 0, total_exprenses: totalExpenses, purchase_dfy: dfy, allowMultiConnectStore: plgThemeBump } });
                        }
                    } else {
                        // no kartra account
                        user = await User.findByIdAndUpdate({ _id: userId }, { $set: { privilege: 0, purchase_dfy: false, allowMultiConnectStore: false } });
                    }
                } else {
                    // no kartra account
                    user = await User.findByIdAndUpdate({ _id: userId }, { $set: { privilege: 0, purchase_dfy: false, allowMultiConnectStore: false } });
                }
            } else {
                console.log("Greater than 3 user " + user.email + " has Logged in")
            }
            // END: check user transaction history and update privilege if needed



            // start get kartra tags
            console.log("signinUser", "/kartratags2")
            const kartraTags = await fetch(_points.apiServer + '/kartratags2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user.kartra ? user.kartra : user.email })
            })
                .then(res => res.json())
                .then(result => {
                    return result;
                })
                .catch(err => {
                    console.log("sign in user get kartra tags", err)
                    throw new Error('An error has occurred while getting kartra tags please try again...');
                });

            if (user.privilege <= 3) { // User Privilege
                if (kartraTags.tags.includes("PLG_TRIAL_NCC")) {
                    user = await User.findByIdAndUpdate({ _id: userId }, {
                        $set: {
                            privilege: 1
                        }
                    })
                }
            }

            var updateObject = { kartra_tags: kartraTags.tags };
            if (!user.invitedBy) {
                updateObject.invitedBy = kartraTags.invitedBy;
            }
            // TODO :: KARTRA_TAGS new update user level base on kartra tag
            if ((kartraTags.tags.includes("8_Days") || kartraTags.tags.includes("30_Days")) && user.privilege <= 3) { // User Privilege
                if (kartraTags.tags.includes("30_Days")) {
                    if (kartraTags.tags.includes("Level_2")) {
                        updateObject.privilege = 2;
                    } else if (kartraTags.tags.includes("Level_3")) {
                        updateObject.privilege = 3;
                    } else if (kartraTags.tags.includes("Level_1")) {
                        updateObject.privilege = 1;
                    }
                } else if (kartraTags.tags.includes("8_Days")) {
                    // 8_Days Tag
                    if (kartraTags.tags.includes("Level_2")) {
                        updateObject.privilege = 2;
                    } else if (kartraTags.tags.includes("Level_3")) {
                        updateObject.privilege = 3;
                    } else {
                        updateObject.privilege = 1;
                    }
                }
            }
            if (kartraTags) {
                user = await User.findByIdAndUpdate({ _id: userId }, { $set: updateObject });
            } else {
                console.log("signinUser: Kartra is empty", kartraTags)
            }
            // end kartra tags

            // experimental update user pass key to have access in mutation
            updateUserPassKeyToMutate(userId);

            return { token: createToken(user, process.env.JWT_SECRET, "24hr") };
        },

        editProfile: async (root, { id, bio }, { User, Points }) => {
            const user = await User.findByIdAndUpdate({ _id: id }, { $set: { bio } }, { new: true });

            if (!user) {
                throw new Error('User Not Found');
            }
            // start complete profile checker
            console.log("editProfile", user.id);
            if (user.one_time_missions.length > 0) {
                if (!user.one_time_missions.includes("complete_profile")) {
                    if (user.bio && user.profileImage) {
                        await User.findByIdAndUpdate({ _id: user.id }, { $push: { one_time_missions: "complete_profile" } });
                        await new Points({ source: "Complete Profile", points: _points.points_complete_profile, date: Date.now(), creator: user.id }).save();
                        await User.findByIdAndUpdate({ _id: id }, { $inc: { total_points: 100 } });
                    }
                }
            } else {
                if (user.bio && user.profileImage) {
                    await User.findByIdAndUpdate({ _id: user.id }, { $push: { one_time_missions: "complete_profile" } });
                    await new Points({ source: "Complete Profile", points: _points.points_complete_profile, date: Date.now(), creator: user.id }).save();
                    await User.findByIdAndUpdate({ _id: id }, { $inc: { total_points: 100 } });
                }
            }
            // end complete profile checker
            return user;
        },

        // gaious
        addNewShopifyDetails: async (root, { id, store_token, store_url }, { User }) => {
            const user = await User.findByIdAndUpdate({ _id: id }, {
                $set: { store_token: new Buffer(store_token).toString("base64"), store_url }
            });
            if (!user) throw new Error('User Not Found');
            return user;
        },

        addStoreToken: async (root, { id, store_token, store_url, store_phone, store_location_id }, { User }) => {
            const user = await User.findByIdAndUpdate({ _id: id }, { $set: { store_token, store_url, store_phone, store_location_id } }, { new: true });
            if (!user) throw new Error('User Not Found');
            return user;
        },

        // added by jerome
        addFavorite: async (root, { id, prodid, favorites, title, src, price }, { User }) => {
            const user = await User.findByIdAndUpdate({ _id: id }, { $push: { favorites: { prodid: prodid, handle: favorites, title: title, src: src, price: price } } });
            if (!user) {
                throw new Error("user Not Found")
            }
            return user;
        },

        removeFavorite: async (root, { id, prodid }, { User }) => {
            const user = await User.findByIdAndUpdate({ _id: id }, { $pull: { favorites: { prodid: prodid } } });
            if (!user) {
                throw new Error("user Not Found")
            }
            return user;
        },

        addOReditPrivilege: async (root, { id, privilege }, { User }) => {
            console.log("addOReditPrivilege 1:", privilege)
            const user = await User.findByIdAndUpdate({ _id: id }, { $set: { privilege: privilege } });
            if (!user) {
                throw new Error("user Not Found")
            }
            return user;
        },

        updateCount: async (root, { id, increaseWhat }, { User }) => {
            var user = null;

            if (increaseWhat === "copy_push") {
                user = await User.findByIdAndUpdate({ _id: id }, { $inc: { count_copyPush: 1 } });
            } else if (increaseWhat === "push_bundle") {
                user = await User.findByIdAndUpdate({ _id: id }, { $inc: { count_pushWithBundle: 1 } });
            } else if (increaseWhat === "push_store") {
                user = await User.findByIdAndUpdate({ _id: id }, { $inc: { count_pushToStore: 1 } });
            } else if (increaseWhat === "add_review") {
                user = await User.findByIdAndUpdate({ _id: id }, { $inc: { count_addReview: 1 } });
            } else if (increaseWhat === "hot_products") {
                user = await User.findByIdAndUpdate({ _id: id }, { $inc: { count_hotProducts: 1 } });
            } else if (increaseWhat === "spin_the_wheel") {
                user = await User.findByIdAndUpdate({ _id: id }, { $set: { date_spin: Date.now() } });
            }

            if (!user) {
                throw new Error("user Not Found")
            }
            return user;
        },

        updateRewardPoints: async (root, { id, source, reward_points }, { Points, User }) => {
            // save points to points table
            const savePoints = await new Points({
                source: source,
                points: reward_points,
                date: Date.now(),
                creator: id
            }).save();

            // save accumulated points to user table
            await User.findByIdAndUpdate({ _id: id }, { $inc: { total_points: reward_points } });
            const userData = await User.findById(id);
            if (source == "Push To Store" && !userData.one_time_missions.includes("first_push_to_store")) {
                await User.findByIdAndUpdate({ _id: id }, { $push: { one_time_missions: "first_push_to_store" } });
            }
            if (source.toLowerCase().includes('challenge')) {
                try {
                    let day = source.match(/\((?!\s)[^()]+(?<!\s)\)/g).toString().replace(/\(|\)|\s/g, "").toLowerCase();
                    await User.findByIdAndUpdate({ _id: id }, { $push: { one_time_missions: day } });
                } catch (err) {
                    console.log("Error in updateRewardPoints ==>", err);
                }
            } else {
                if (source != "Push To Store" && source != "Push With Bundle" && source != "Add Review" && source != "Copy Push") {
                    if (!userData.one_time_missions.includes(source)) {
                        await User.findByIdAndUpdate({ _id: id }, { $push: { one_time_missions: source } });
                    }
                }
            }

            // update daily points and weekly points
            addDailyORWeeklyPoints(userData, reward_points);

            return savePoints;
        },

        updateLiveMode: async (root, { isLive, liveLink }, { Admin }) => {
            var admin = await Admin.findOneAndUpdate({}, { $set: { isLive, liveLink } });

            if (!admin) {
                admin = await new Admin({ isLive, liveLink }).save();
            }
            return admin;
        },

        linkFB: async (root, { id, fblink }, { User }) => {
            var user = await User.findByIdAndUpdate({ _id: id }, { $set: { fb_link: fblink } });

            if (!user) {
                throw new Error("user Not Found")
            }
            return user;
        },

        requestHelp: async (root, { id, message, read }, { User }) => {
            const user = await User.findByIdAndUpdate({ _id: id }, { $push: { help_request_message: { message: message, date_request: Date.now(), read: read } } });

            if (!user) {
                throw new Error("user Not Found")
            }
            return user;
        },

        setSalesRep: async (root, { id, sales_rep_id }, { User }) => {
            const user = await User.findByIdAndUpdate({ _id: id }, { $set: { sales_rep_id: sales_rep_id, sales_rep_date: Date.now() } });
            if (sales_rep_id) {
                const affManager = await User.findById({ _id: sales_rep_id });
                sendMessageToMobile(sales_rep_id, id, "Hello! I'm " + affManager.firstName + " I will be your Affiliate manager please send me a message from the app if you have any question.");
            }
            return user;
        },

        // TODO :: Add DealerID 
        addDealerId: async (root, { id, dealerId }, { User }) => {
            const user = await User.findByIdAndUpdate({ _id: id }, { $set: { dealerId: dealerId } });
            // if (dealerId) {
            //     const affManager = await User.findById({ _id: sales_rep_id });
            //     sendMessageToMobile(sales_rep_id, id, "Hello! I'm " + affManager.firstName + " I will be your Affiliate manager please send me a message from the app if you have any question.");
            // }
            return user;
        },

        addNotes: async (root, { id, note }, { User }) => {
            const user = await User.findByIdAndUpdate({ _id: id }, { $push: { sales_rep_notes: { note: note, date_time: Date.now() } } });

            if (!user) {
                throw new Error("user Not Found")
            }
            return user;
        },

        removeNotes: async (root, { id, note_id }, { User }) => {
            const user = await User.findByIdAndUpdate({ _id: id }, { $pull: { sales_rep_notes: { _id: note_id } } });

            if (!user) {
                throw new Error("user Not Found")
            }
            return user;
        },

        updateTraining: async (root, { id, tag, upsell_link, title, description, vimeo_id }, { Admin }) => {
            var admin = null;
            if (id != '0') {
                admin = await Admin.findOneAndUpdate({
                    million_dollar_training: {
                        $elemMatch: {
                            _id: id
                        }
                    }
                }, {
                    $set: {
                        "million_dollar_training.$.tag": tag,
                        "million_dollar_training.$.upsell_link": upsell_link,
                        "million_dollar_training.$.vimeo_id": vimeo_id,
                        "million_dollar_training.$.introduction_title": title,
                        "million_dollar_training.$.introduction_description": description
                    }
                })
            } else {
                admin = await Admin.findOneAndUpdate({}, {
                    $push: {
                        million_dollar_training: {
                            tag,
                            upsell_link,
                            vimeo_id,
                            introduction_title: title,
                            introduction_description: description
                        }
                    }
                })
            }

            return admin;
        },

        deleteTraining: async (root, { id }, { Admin }) => {
            const admin = await Admin.findOneAndUpdate({}, { $pull: { million_dollar_training: { _id: id } } });
            if (!admin) {
                throw new Error("Admin Settings Not Found")
            }
            return admin;
        },

        pushNotification: async (root, { id, email, sendTo, type, message }, { User, currentUser }) => {
            var users = null;
            if (id || email) {
                if (id) users = await User.findByIdAndUpdate({ _id: id }, { $push: { notification: { type, message, date: Date.now() } } });
                else if (email) users = await User.findOneAndUpdate({ email }, { $push: { notification: { type, message, date: Date.now() } } });
                sendMessageToMobile(currentUser.id, users.id, message);
            } else {
                users = await User.updateMany(sendTo ? { privilege: parseInt(sendTo) } : { privilege: { $lte: 5 } }, {
                    $push: {
                        notification: {
                            type,
                            message,
                            date: Date.now()
                        }
                    }
                });
                let payload = { "firstName": "", "lastname": "", "email": "", "phone": "", "creatorID": "", "message_notif": message, "sale": "", "type_req": "Announcement" };
                _points.sendPOST("https://us-central1-productlistgenie-14e76.cloudfunctions.net/webApi/api_plg/v1/addLead", payload);
            }
            return users;
        },

        readAllNotification: async (root, { id }, { User }) => {
            return await User.findByIdAndUpdate({ _id: id }, { $set: { "notification.$[i].isRead": true } }, { arrayFilters: [{ "i.isRead": false }] });
        },

        removeNotification: async (root, { id, notifId }, { User }) => {
            const user = await User.findByIdAndUpdate({ _id: id }, { $pull: { notification: { _id: notifId } } });
            return user;
        },

        updateMysteryProduct: async (root, { mp_url }, { Admin }) => {
            const user = await Admin.findOneAndUpdate({}, { $set: { mystery_product_url: mp_url } });
            return user;
        },

        updateGem: async (root, { id, pass_key, source }, { User, Gems }) => {
            const userData = await User.findById({ _id: id });
            if (userData.pass_key == pass_key) {
                const user = await User.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        pass_key: pass_key
                    },
                    $inc: {
                        total_gems: 50
                    }
                });
                await new Gems({
                    source,
                    gems: 50,
                    date: Date.now(),
                    creator: id
                }).save();

                console.log("updateGem", user.id);
                updateUserPassKeyToMutate(user.id);
                return user;
            } else {
                throw new Error('Invalid Pass Key');
            }
        },

        addLeads: async (root, { name, email, invitedBy }, { Leads }) => {
            const newLeads = await new Leads({
                name,
                email,
                invitedBy,
                date: Date.now()
            }).save();

            return newLeads;
        },

        updateGAandFBid: async (root, { id, gaId, fbId }, { User }) => {
            const user = await User.findByIdAndUpdate({ _id: id }, { $set: { gaId, fbId } })
            return user;
        },

        addPanel: async (root, { panel_name, panel_type, panel_description, panel_img_url }, { Admin }) => {
            const structure = {
                active: false,
                navigation_name: panel_name,
                navigation_type: panel_type,
                description: panel_description,
                img_url: panel_img_url,
                content: []
            }
            const admin = await Admin.findOneAndUpdate({}, { $push: { custom_page: structure } })
            return admin;
        },

        deletePanel: async (root, { id }, { Admin, currentUser }) => {
            var currentUserPrivilege = await User.findById({ _id: currentUser.id });
            if (currentUserPrivilege.privilege == 10) { // User Privilege
                const admin = await Admin.findOneAndUpdate({}, {
                    $pull: {
                        "custom_page": {
                            _id: id
                        }
                    }
                });
                return admin;
            } else {
                throw new Error("Only Admin can change user privilege.", "Cannot Change Privilege");
            }
        },

        editPanel: async (root, { id, panel_name, panel_type, panel_description, panel_img_url }, { Admin }) => {
            const admin = await Admin.findOneAndUpdate({
                custom_page: {
                    $elemMatch: {
                        _id: id
                    }
                }
            }, {
                $set: {
                    "custom_page.$.navigation_name": panel_name,
                    "custom_page.$.navigation_type": panel_type,
                    "custom_page.$.description": panel_description,
                    "custom_page.$.img_url": panel_img_url,
                }
            })
            return admin;
        },

        enablePanel: async (root, { id, active }, { Admin }) => {
            const admin = await Admin.findOneAndUpdate({
                custom_page: {
                    $elemMatch: {
                        _id: id
                    }
                }
            }, {
                $set: {
                    "custom_page.$.active": active
                }
            })
            return admin;
        },

        saveSection: async (root, { id, page_lock_by_tag, page_lock_by_privilege, page_icon, page_name, page_content, page_tag, page_privilege_from, page_privilege_to }, { AdminCustomPage }) => {
            const adminCustompage = await new AdminCustomPage({
                page_lock_by_tag,
                page_lock_by_privilege,
                page_tag,
                page_icon,
                page_name,
                page_content,
                page_privilege_from,
                page_privilege_to,
                creator: id
            }).save();
            return adminCustompage;
        },

        // not ready
        editSection: async (root, { id, page_lock_by_tag, page_lock_by_privilege, page_icon, page_name, page_content, page_tag, page_privilege_from, page_privilege_to }, { AdminCustomPage }) => {
            const adminCustomPage = await AdminCustomPage.findByIdAndUpdate({ _id: id }, {
                $set: {
                    page_lock_by_tag,
                    page_lock_by_privilege,
                    page_tag,
                    page_icon,
                    page_name,
                    page_content,
                    page_privilege_from,
                    page_privilege_to,
                }
            })
            return adminCustomPage;
        },

        deleteSection: async (root, { id }, { AdminCustomPage, currentUser }) => {
            var currentUserPrivilege = await User.findById({ _id: currentUser.id });
            if (currentUserPrivilege.privilege == 10) { // User Privilege
                const custom_page = await AdminCustomPage.findById({ _id: id }).remove().exec();
                return custom_page;
            } else {
                throw new Error("Only Admin can change user privilege.", "Cannot Change Privilege");
            }
        },

        updateKartraEmail: async (root, { id, kartra }, { User }) => {
            const user = await User.findByIdAndUpdate({ _id: id }, { $set: { kartra: kartra } })
            return user;
        },

        manualResetPassword: async (root, { id }, { User }) => {
            const saltRounds = 10;

            return bcrypt.hash("temporarypassword", saltRounds).then(async function (hash) {
                const user = await User.findByIdAndUpdate({ _id: id }, { $set: { password: hash } }, { new: true });
                if (!user) {
                    throw new Error('User Not Found');
                }
                return user;
            });
        },

        updatePrivilege: async (root, { id, privilege }, { User, currentUser }) => {
            if (currentUser.privilege == 10) { // User Privilege
                const user = await User.findByIdAndUpdate({ _id: id }, { $set: { privilege, updater_id: currentUser.id, updater_name: currentUser.firstName } });
                return user;
            } else {
                throw new Error("Only Admin can change user privilege.", "Cannot Change Privilege");
            }
        },

        updateEmail: async (root, { id, new_email }, { User, currentUser }) => {
            if (new_email) { // kapag may new email lang
                let searched_user = await User.find({ email: new_email }, { _id: 1 }).lean();
                if (searched_user.length == 0) { // pag wla kagayang email
                    const user = await User.findByIdAndUpdate({ _id: id }, {
                        $set: {
                            email: new_email,
                            updater_id: currentUser.id,
                            updater_name: currentUser.firstName
                        }
                    });
                    return user;
                } else { // kapag merong kagaya prompt error
                    throw new Error(new_email + " is already taken");
                }
            } else return null; // iignore ung request kapag wla new email
        },

        requestOrders: async (root, { id, orders }, { FulfillmentChina, OrdersID }) => {
            const isHaveCollection = await OrdersID.find({ creator: id });
            if (isHaveCollection.length == 0) {
                await new OrdersID({
                    order: [''],
                    creator: id,
                }).save();
            }

            try {
                var orderss = JSON.parse(orders);
                orderss.forEach(async order => {
                    // await new FulfillmentChina({
                    //     orders: JSON.stringify(order),
                    //     creator: id
                    // }).save();

                    var lineItems = [];
                    order.line_items.forEach(li => {
                        lineItems.push({
                            line_item_id: li.id,
                            product_id: li.product_id,
                            variant_id: li.variant_id,
                            product_name: li.title,
                            variant_name: li.variant_title,
                            quantity: li.quantity,
                            weight: li.grams,
                            chinese_description: "",
                            dg_code: "",
                            height: null,
                            width: null,
                            length: null,
                            approve_price: null,
                            original_price: parseFloat(li.price).toFixed(2),
                            vendor_link: li.vendorLink
                        })
                    })

                    await new FulfillmentChina({
                        shipping_information: {
                            order_number: order.name,
                            company: order.shipping_address.company,
                            address1: order.shipping_address.address1,
                            address2: order.shipping_address.address2,
                            city: order.shipping_address.city,
                            country: order.shipping_address.country,
                            country_code: order.shipping_address.country_code,
                            province: order.shipping_address.province,
                            province_code: order.shipping_address.province_code,
                            zip: order.shipping_address.zip,
                            email: order.email,
                            name: order.shipping_address.name,
                            phone: order.shipping_address.phone,
                        },
                        line_items: lineItems,
                        isRefactored: true,
                        order_note: order.order_note,
                        order_id: order.id,
                        creator: id
                    }).save();

                    // save order id
                    console.log("requestOrders", order.id);
                    await OrdersID.findOneAndUpdate({ creator: id }, { $push: { orders_id: order.id } });
                })
            } catch (err) {
                throw new Error("requestOrders Error: ", err.message)
            }

            return null;
        },

        requestNewOrders: async (root, { id, orders }, { NewFulfillmentChina, NewOrdersID }) => {
            const isHaveCollection = await NewOrdersID.find({ creator: id }).catch(err => null);

            if (isHaveCollection.length == 0) {
                await new NewOrdersID({
                    order: [''],
                    creator: id,
                }).save();
            }

            var orderss = JSON.parse(orders);
            orderss.forEach(async order => {
                var lineItems = [];
                order.line_items.forEach(li => {
                    lineItems.push({
                        line_item_id: li.id,
                        product_id: li.product_id,
                        variant_id: li.variant_id,
                        product_name: li.title,
                        variant_name: li.variant_title,
                        quantity: li.quantity,
                        weight: li.grams,
                        chinese_description: "",
                        dg_code: "",
                        height: null,
                        width: null,
                        length: null,
                        approve_price: null,
                        original_price: parseFloat(li.price).toFixed(2),
                        vendor_link: li.vendorLink
                    })
                })

                await new NewFulfillmentChina({
                    shipping_information: {
                        order_number: order.name,
                        company: order.shipping_address.company,
                        address1: order.shipping_address.address1,
                        address2: order.shipping_address.address2,
                        city: order.shipping_address.city,
                        country: order.shipping_address.country,
                        country_code: order.shipping_address.country_code,
                        province: order.shipping_address.province,
                        province_code: order.shipping_address.province_code,
                        zip: order.shipping_address.zip,
                        email: order.email,
                        name: order.shipping_address.name,
                        phone: order.shipping_address.phone,
                    },
                    line_items: lineItems,
                    order_note: order.order_note,
                    order_id: order.id,
                    creator: id
                }).save();

                // save order id
                await NewOrdersID.findOneAndUpdate({ creator: id }, { $push: { orders_id: order.id } });
            })

            return null;
        },

        decideOrder: async (root, { id, decision, denied_note }, { FulfillmentChina, VirtualWarehouse }) => {
            var result = null;
            var saveQuery = {};
            saveQuery.isRequest = false;
            if (decision == "request") {
                saveQuery.isRequest = true;
                saveQuery.isApproved = false;
                saveQuery.date_approved = null;
                saveQuery.isDenied = false;
                saveQuery.date_denied = null;
            } else if (decision == "approved") {
                saveQuery.isApproved = true;
                saveQuery.date_approved = Date.now();
                saveQuery.isDenied = false;
                saveQuery.date_denied = null;
            } else {
                saveQuery.isApproved = false;
                saveQuery.date_approved = null;
                saveQuery.isDenied = true;
                saveQuery.date_denied = Date.now();
                saveQuery.denied_note = denied_note;
            }

            // save the approved data
            result = await FulfillmentChina.findByIdAndUpdate({ _id: id }, { $set: saveQuery });
            // get all stock id frist
            var ids = [];
            result.line_items.forEach(li => {
                if (li.stockid_used) {
                    ids.push(li.stockid_used)
                }
            })
            // reduce number of stock quantity
            await VirtualWarehouse.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                $inc: {
                    qty: decision == "approved" ? -1 : 1
                }
            })

            return result;
        },

        decideNewOrder: async (root, { userid, id, decision, denied_note, ids }, { NewFulfillmentChina, User, CreditsLog }) => {
            var saveQuery = {
                isRequest: false,
                isApproved: false,
                isDenied: false,
                date_approved: null,
                date_denied: null,
                date_paid: null
            };

            if (decision == "request") {
                saveQuery.isRequest = true;
                saveQuery.date_request = Date.now();
            } else if (decision == "approved") {
                saveQuery.isApproved = true;
                saveQuery.date_approved = Date.now();
            } else if (decision == "toship") {
                saveQuery.isPaid = true;
                saveQuery.date_paid = Date.now();
            } else {
                saveQuery.isDenied = true;
                saveQuery.date_denied = Date.now();
                saveQuery.denied_note = denied_note;
            }

            var result = null;
            if (decision == "request") {
                // search for order data
                var newfchina = await NewFulfillmentChina.findById({ _id: id })
                var orderPrice = 0;
                // get total order price by its line item
                newfchina.line_items.forEach(li => {
                    orderPrice += li.approve_price * li.quantity;
                })
                // increase user credit for undoing the order
                const reduceCredit = await User.findByIdAndUpdate({ _id: userid }, {
                    $inc: {
                        plg_balance: orderPrice
                    }
                })
                // save new credit logs
                const userCreditLogs = await new CreditsLog({
                    date_paid: Date.now(),
                    total_cost: orderPrice,
                    description: "Undo By the Admin: " + newfchina.shipping_information.order_number,
                    increase: true,
                    creator: userid
                }).save();

                result = await NewFulfillmentChina.findByIdAndUpdate({ _id: id }, { $set: saveQuery });
            } else if (decision == "approved") {
                // search for user data
                var user = await User.findById({ _id: userid });
                // search for order data
                var newfchina = await NewFulfillmentChina.findById({ _id: id })
                var orderPrice = 0;
                // get total order price by its line item
                newfchina.line_items.forEach(li => {
                    orderPrice += li.approve_price * li.quantity;
                })

                // if user credit is enough to pay
                if (user.plg_balance >= orderPrice) {
                    // save the approved data
                    result = await NewFulfillmentChina.findByIdAndUpdate({ _id: id }, { $set: saveQuery });
                    // reduce user credit
                    const reduceCredit = await User.findByIdAndUpdate({ _id: user.id }, {
                        $inc: {
                            plg_balance: -orderPrice
                        }
                    })
                    // save new credit logs
                    const userCreditLogs = await new CreditsLog({
                        date_paid: Date.now(),
                        total_cost: orderPrice,
                        description: "Approved Payment for Order Number: " + newfchina.shipping_information.order_number,
                        creator: userid
                    }).save();

                    newfchina.line_items.forEach(li => {
                        createBoxCProduct(user.fbb_store_id, li.product_name, li.variant_name, li.chinese_description, li.approve_price, li.original_price, li.dg_code, li.variant_id, async result => {
                            if (result) {
                                await NewFulfillmentChina.findOneAndUpdate({ _id: id, "line_items.variant_id": li.variant_id }, {
                                    $set: {
                                        isEdited: true,
                                        "line_items.$.boxC_product_id": result.id
                                    }
                                })
                            }
                        })
                    })
                } else {
                    throw new Error("Insufficient User Credit");
                }
            } else if (decision == "toship") {
                ids = JSON.parse(ids);
                console.log("decideNewOrder() -> Process this ID:", ids);
                result = await NewFulfillmentChina.updateMany({ _id: { $in: ids } }, { $set: saveQuery });
            } else {
                // just execute the save query no need to reduce user credit for deny
                result = await NewFulfillmentChina.findByIdAndUpdate({ _id: id }, { $set: saveQuery });
            }
            return result;
        },

        updateRequestedOrder: async (root, { orders, isWeight, service }, { FulfillmentChina }) => {
            try {
                var orderss = JSON.parse(orders);
                await orderss.forEach(async order => {
                    var newOrderObj = JSON.parse(order.orders);
                    if (isWeight) {
                        if (newOrderObj.shipping_address.country_code.toUpperCase() != "US") {
                            // force turn service to boxc post if non US
                            service = "BoxC Post";
                        }
                        var shipping_fee = await getShippingFee(newOrderObj, service);
                        if (shipping_fee != null) {
                            newOrderObj.isRejected = false;
                            newOrderObj.shipping_fee = shipping_fee;
                        } else {
                            newOrderObj.shipping_fee = null;
                            newOrderObj.isRejected = true;
                        }
                    }

                    console.log("updateRequestedOrder", order.id);
                    await FulfillmentChina.findByIdAndUpdate({ _id: order.id }, {
                        $set: {
                            isRequest: order.isRequest,
                            isApproved: order.isApproved,
                            isDenied: order.isDenied,
                            isFinish: order.isFinish,
                            orders: JSON.stringify(newOrderObj)
                        }
                    })
                })
            } catch (err) {
                throw new Error("updateRequestedOrder Error: ", err.message)
            }

            return null;
        },

        refactorUpdateRequestedOrder: async (root, { id, approve_price, variant_id, isWeight, dimension, service, quantity, stockid }, { FulfillmentChina }) => {
            if (!isWeight) {
                if (quantity) {
                    await FulfillmentChina.updateMany({ creator: id, isRequest: true, "line_items.variant_id": variant_id }, {
                        $set: {
                            isEdited: true,
                            "line_items.$[i].approve_price": approve_price,
                            "line_items.$[i].quantity": quantity
                        }
                    }, {
                        arrayFilters: [{
                            "i.variant_id": variant_id
                        }]
                    })
                } else {
                    await FulfillmentChina.updateMany({ creator: id, isRequest: true, "line_items.variant_id": variant_id }, {
                        $set: {
                            isEdited: true,
                            "line_items.$[i].approve_price": approve_price
                        }
                    }, {
                        arrayFilters: [{
                            "i.variant_id": variant_id
                        }]
                    })
                }
            } else {
                var dimensions = JSON.parse(dimension);
                await FulfillmentChina.updateMany({ creator: id, isRequest: true, "line_items.variant_id": variant_id }, {
                    $set: {
                        "line_items.$[i].stockid_used": stockid,
                        "line_items.$[i].approve_price": approve_price,
                        "line_items.$[i].weight": dimensions.weight,
                        "line_items.$[i].dg_code": dimensions.dg_code,
                        "line_items.$[i].height": dimensions.height + "",
                        "line_items.$[i].width": dimensions.width + "",
                        "line_items.$[i].length": dimensions.length + "",
                        "line_items.$[i].chinese_description": dimensions.chineseDescription
                    }
                }, {
                    arrayFilters: [{
                        "i.variant_id": variant_id
                    }]
                });
                var orders = await FulfillmentChina.find({ creator: id, isRequest: true, "line_items.variant_id": variant_id });
                orders.forEach(async order => {
                    if (order.shipping_information.country_code.toUpperCase() != "US") {
                        // force turn service to boxc post if non US
                        service = "BoxC Post";
                    }
                    var shipping_fee = await getShippingFeeRefactor(order, service);
                    if (shipping_fee) {
                        await FulfillmentChina.findOneAndUpdate({ _id: order._id, "line_items.variant_id": variant_id }, {
                            $set: {
                                isEdited: true,
                                isRejected: false,
                                shipping_cost: shipping_fee.shipping_methods[0].total_cost + "",
                                shipping_method: shipping_fee.shipping_methods[0].method,
                                shipping_days_min: shipping_fee.transit_min,
                                shipping_days_max: shipping_fee.transit_max,
                                shipping_service: service
                            }
                        })
                    } else {
                        await FulfillmentChina.findOneAndUpdate({ _id: order._id, "line_items.variant_id": variant_id }, {
                            $set: {
                                isEdited: false,
                                isRejected: true,
                                shipping_cost: "",
                                shipping_method: "",
                                shipping_days_min: null,
                                shipping_days_max: null,
                                shipping_service: null
                            }
                        })
                    }
                })
            }

            return null;
        },

        updateNewRequestedOrder: async (root, { id, approve_price, quantity, variant_id, dg_code, chinese_description }, { NewFulfillmentChina }) => {
            const result = await NewFulfillmentChina.updateMany({ creator: id, isRequest: true, "line_items.variant_id": variant_id }, {
                $set: {
                    isEdited: true,
                    "line_items.$[i].approve_price": approve_price,
                    "line_items.$[i].quantity": quantity,
                    "line_items.$[i].dg_code": dg_code,
                    "line_items.$[i].chinese_description": chinese_description
                }
            }, {
                arrayFilters: [{
                    "i.variant_id": variant_id
                }]
            })

            return result;
        },

        sendPayment: async (root, { id, store_url, store_token, store_location_id, total_payment, payerID, paymentID, paymentToken }, { User, FulfillmentChina, PaidOrders }) => {
            // query for getting paid orders
            const result = await FulfillmentChina.find({ creator: id, isApproved: true }).select('_id');

            var ids = [];
            result.forEach(resultid => {
                ids.push(resultid._id);
            })

            // save to paid orders table
            await new PaidOrders({
                creator: id,
                date_paid: Date.now(),
                total_payment,
                payerID,
                paymentID,
                paymentToken,
                store_url,
                store_token,
                store_location_id,
                isRefactored: true,
                order_ids: ids
            }).save();

            // update orders to paid
            await FulfillmentChina.updateMany({ creator: id, isApproved: true }, {
                $set: {
                    isApproved: false,
                    isPaid: true,
                    date_paid: Date.now()
                }
            })

            // tag this user as recent payer
            await User.findByIdAndUpdate({ _id: id }, { $set: { recentPaid: true } })

            return null;
        },

        printLabelSuccess: async (root, { id, shipment_id, tracking_number, paid_id }, { FulfillmentChina, PaidOrders }) => {
            await FulfillmentChina.findByIdAndUpdate({ _id: id }, {
                $set: {
                    isPaid: false,
                    isFinish: true,
                    shipment_id,
                    tracking_number
                }
            })

            var savedData = {
                $set: {
                    trackingNumberAvailable: true
                }
            }
            if (tracking_number) {
                savedData.$push = {
                    trackingNumbers: tracking_number
                }
            }

            await PaidOrders.findByIdAndUpdate({ _id: paid_id }, savedData)

            return null;
        },

        fulfillmentCenterAccess: async (root, { id, access }, { User }) => {
            await User.findByIdAndUpdate({ _id: id }, { $set: { isFulfillmentCenterUnlock: access } })
            return null;
        },

        cancelRequest: async (root, { id, orderid, isRefactored }, { FulfillmentChina, OrdersID }) => {
            if (isRefactored) {
                var checkIfPaid = await FulfillmentChina.findOne({ creator: id, order_id: orderid });
                if (checkIfPaid && !checkIfPaid.isPaid) {
                    await FulfillmentChina.findOne({ creator: id, order_id: orderid }).remove().exec();
                    await OrdersID.findOneAndUpdate({ creator: id }, { $pull: { orders_id: orderid } });
                } else {
                    throw new Error("This is already paid and cannot be cancelled")
                }
            } else {
                var regex = new RegExp("\"id\":" + orderid);
                var checkIfPaid = await FulfillmentChina.findOne({ creator: id, orders: regex });
                if (checkIfPaid && !checkIfPaid.isPaid) {
                    await FulfillmentChina.findOne({ creator: id, orders: regex }).remove().exec();
                    await OrdersID.findOneAndUpdate({ creator: id }, { $pull: { orders_id: orderid } });
                } else {
                    throw new Error("This is already paid and cannot be cancelled")
                }
            }

            return null;
        },

        cancelNewRequest: async (root, { id, orderid }, { NewFulfillmentChina, NewOrdersID }) => {
            var checkIfPaid = await NewFulfillmentChina.findOne({ creator: id, order_id: orderid });
            if (checkIfPaid && (checkIfPaid.isRequest || checkIfPaid.isDenied)) {
                // remove order from database
                await NewFulfillmentChina.findOne({ creator: id, order_id: orderid }).remove().exec();
                // remove order id from order id list
                await NewOrdersID.findOneAndUpdate({ creator: id }, { $pull: { orders_id: orderid } });
            } else {
                throw new Error("This order is in process and cannot be cancelled.")
            }

            return null;
        },

        submitFulfillmentCenterMessage: async (root, { id, text, from, isFromQuote, isFromBulkQuote, defaults }, { User, Conversation }) => {
            const hasConversation = await Conversation.findOne({ senderID: id })
            var conversation = null;
            if (from == "User") {
                await User.findByIdAndUpdate({ _id: id }, { $set: { hasFulfillmentMessage: true } });
            }
            if (hasConversation) {
                // update conversation
                var defaultValue = defaults ? JSON.parse(defaults) : null;
                conversation = await Conversation.findOneAndUpdate({ senderID: id }, {
                    $set: {
                        seen: from == "Admin" ? true : false
                    },
                    $inc: {
                        newChatCount: from == "Admin" ? 1 : 0,
                    },
                    $push: {
                        messages: {
                            date: Date.now(),
                            text: text,
                            from: from,
                            isFromQuote,
                            isFromBulkQuote: isFromBulkQuote ? isFromBulkQuote : false,
                            // default value
                            default_chinese_description: defaultValue ? defaultValue.chinese_description : null,
                            default_weight: defaultValue ? defaultValue.weight : null,
                            default_dg_code: defaultValue ? defaultValue.dg_code : null,
                            default_dimension_height: defaultValue ? defaultValue.dimension_height : null,
                            default_dimension_width: defaultValue ? defaultValue.dimension_width : null,
                            default_dimension_length: defaultValue ? defaultValue.dimension_length : null,
                            default_price: defaultValue ? defaultValue.price : null
                        }
                    }
                })
            } else {
                // save new conversation
                var defaultValue = defaults ? JSON.parse(defaults) : null;
                conversation = new Conversation({
                    senderID: id,
                    seen: false,
                    newChatCount: 1,
                    messages: [{
                        date: Date.now(),
                        text: text,
                        from: from,
                        isFromQuote,
                        isFromBulkQuote: isFromBulkQuote ? isFromBulkQuote : false,
                        // default value
                        default_weight: defaultValue ? defaultValue.weight : null,
                        default_dg_code: defaultValue ? defaultValue.dg_code : null,
                        default_dimension_height: defaultValue ? defaultValue.dimension_height : null,
                        default_dimension_width: defaultValue ? defaultValue.dimension_width : null,
                        default_dimension_length: defaultValue ? defaultValue.dimension_length : null,
                        default_price: defaultValue ? defaultValue.price : null
                    }]
                }).save();
            }

            return conversation;
        },

        seenMessage: async (root, { id, from }, { User, Conversation }) => {
            var conversation = null;
            if (from == "Admin") {
                conversation = await Conversation.findOneAndUpdate({ senderID: id }, { $set: { seen: true } })
                await User.findByIdAndUpdate({ _id: id }, { $set: { hasFulfillmentMessage: false } });
            } else {
                conversation = await Conversation.findOneAndUpdate({ senderID: id }, { $set: { newChatCount: 0 } })
            }

            return conversation;
        },

        verifyPaymentFromWebhook: async (root, { paymentid }, { User, PaidOrders }) => {
            const paid = await PaidOrders.findOneAndUpdate({ paymentID: paymentid }, {
                $set: {
                    isVerified: true
                }
            });

            if (paid) {
                const user = await User.findById({ _id: paid.creator });
                return user;
            } else {
                return null;
            }
        },

        savePaypalPaymentLogs: async (root, { creator, paymentObject }, { PaymentLogs }) => {
            var object = JSON.parse(paymentObject)
            await new PaymentLogs({
                id: object.id,
                summary: object.summary,
                parent_payment: object.resource.parent_payment,
                update_time: object.resource.update_time,
                total_amount: object.resource.amount.total,
                amount_currency: object.resource.amount.currency,
                create_time: object.resource.create_time,
                clearing_time: object.resource.clearing_time,
                state: object.resource.state,
                creator: creator
            }).save();

            return null;
        },

        markAsPaid: async (root, { id, store_url, store_token, store_location_id }, { User, FulfillmentChina, PaidOrders }) => {
            // query for getting paid orders
            const result = await FulfillmentChina.find({ creator: id, isApproved: true }).select('_id');

            var ids = [];
            result.forEach(resultid => {
                ids.push(resultid._id);
            })

            // save to paid orders table
            await new PaidOrders({
                creator: id,
                date_paid: Date.now(),
                isVerified: true,
                total_payment: 0,
                payerID: null,
                paymentID: null,
                paymentToken: null,
                store_url,
                store_token,
                store_location_id,
                isRefactored: true,
                order_ids: ids
            }).save();

            // update orders to paid
            await FulfillmentChina.updateMany({ creator: id, isApproved: true }, {
                $set: {
                    isApproved: false,
                    isPaid: true,
                    date_paid: Date.now()
                }
            })

            // tag this user as recent payer
            await User.findByIdAndUpdate({ _id: id }, { $set: { recentPaid: true } })

            return null;
        },

        markAsPacked: async (root, { paidID, orderID, shouldSave }, { PaidOrders }) => {
            if (shouldSave) {
                const packed = await PaidOrders.findByIdAndUpdate({ _id: paidID }, {
                    $push: {
                        is_packed: orderID
                    }
                })
            } else {
                const packed = await PaidOrders.findByIdAndUpdate({ _id: paidID }, {
                    $pull: {
                        is_packed: orderID
                    }
                })
            }

            return null;
        },

        acceptTOS: async (root, { id }, { currentUser, User }) => {
            if (!currentUser) {
                return null;
            }
            var user = await User.findByIdAndUpdate({ _id: id }, { $set: { tos: true } });

            return null;
        },

        extendMoreDays: async (root, { id }, { currentUser, User }) => {
            if (!currentUser) {
                return null;
            }
            var user = await User.findByIdAndUpdate({ _id: id }, { $set: { isExtended: true } });

            await fetch(_points.clientUrl + '/extendRebillDate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: user.kartra ? user.kartra : user.email })
            })
                .then(res => console.log(res.status))

            return null;
        },



        changeHomepageVideo: async (root, { id, url, message, from }, { User, Admin }) => {
            var sendToPrivilege = {};
            if (from == "full") {
                // save video link and message for full user
                await Admin.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        homepage_video_full: url,
                        homepage_message_full: message ? message : void 0
                    }
                });
                sendToPrivilege = { privilege: { $gte: 2, $lte: 4 } }
            } else {
                // save video link and message for trial user
                await Admin.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        homepage_video_trial: url,
                        homepage_message_trial: message ? message : void 0
                    }
                });
                sendToPrivilege = { privilege: 1 }
            }
            // Save notification to every user
            if (message) {
                await User.updateMany(sendToPrivilege, {
                    $push: {
                        notification: {
                            type: "info",
                            message,
                            date: Date.now()
                        }
                    }
                });
            }

            return null;
        },

        saveInventory: async (root, { id, stockid, orderid, chinese_description, name, qty, dimension_height, dimension_width, dimension_length, dg_code, weight, price, vendor_link, isPaid }, { VirtualWarehouse }) => {
            var result = null;
            if (isPaid) {
                if (!stockid) {
                    // just update the isPaid to true
                    result = await VirtualWarehouse.findByIdAndUpdate({ _id: orderid }, { $set: { isPaid } });
                } else {
                    // find the stock and update it with its quantity and set the isPaid to true
                    result = await VirtualWarehouse.findByIdAndUpdate({ _id: stockid }, { $inc: { qty: qty } });
                    // remove the orderid bcs we already get the quantity from it and add to the stockid
                    await VirtualWarehouse.findById({ _id: orderid }).remove().exec();
                }
            } else {
                result = await new VirtualWarehouse({
                    creator: id,
                    stockid: stockid ? stockid : null,
                    chinese_description,
                    name,
                    qty,
                    dimension_height,
                    dimension_width,
                    dimension_length,
                    dg_code,
                    weight,
                    price,
                    vendor_link,
                    isPaid
                }).save();
            }

            return result;
        },

        verifyTopupFromWebhook: async (root, { paymentid }, { TopupLogs }) => {
            const paid = await TopupLogs.findOneAndUpdate({ paymentID: paymentid }, {
                $set: {
                    isVerified: true
                }
            });

            return paid;
        },

        onTopupSuccess: async (root, { id, total_topup, payerID, paymentID, paymentToken, pass_key }, { User, TopupLogs }) => {
            const userData = await User.findById({ _id: id })
            var user = null;
            if (userData.pass_key == pass_key) {
                user = await User.findByIdAndUpdate({ _id: id }, {
                    $inc: {
                        plg_balance: total_topup
                    }
                });

                // save new logs
                const userTopupLogs = await new TopupLogs({
                    date_paid: Date.now(),
                    total_topup: total_topup,
                    payerID: payerID,
                    paymentID: paymentID,
                    paymentToken: paymentToken,
                    creator: id
                }).save();
            } else {
                throw new Error("Invalid Pass Key.")
            }

            return user;
        },

        reduceCredits: async (root, { id, cost, description }, { User, currentUser, CreditsLog }) => {
            var user = null;
            // check if has session
            if (currentUser) {
                // find user object
                const resultUser = await User.findById({ _id: id });
                if (resultUser.plg_balance >= cost) {
                    user = await User.findByIdAndUpdate({ _id: id }, {
                        $inc: {
                            plg_balance: -cost
                        }
                    });

                    // save new credit logs
                    const userCreditLogs = await new CreditsLog({
                        date_paid: Date.now(),
                        total_cost: cost,
                        description: description,
                        creator: id
                    }).save();
                } else {
                    throw new Error("Insufficient User Credit");
                }
            }

            return user;
        },

        addTrackingNumber: async (root, { id, tracking_number }, { NewFulfillmentChina }) => {
            const trackingNumber = await NewFulfillmentChina.findByIdAndUpdate({ _id: id }, {
                $set: {
                    tracking_number: tracking_number.replace(/\s/g, ""), // remove all spaces of tracking number
                    isFinish: true
                }
            })

            return trackingNumber;
        },

        saveFBBstoreID: async (root, { id, fbbid }, { User }) => {
            const user = await User.findByIdAndUpdate({ _id: id }, {
                $set: {
                    fbb_store_id: fbbid
                }
            })

            return user;
        },

        saveStockID: async (root, { id, stockid }, { User }) => {
            const user = await User.findByIdAndUpdate({ _id: id }, {
                $push: {
                    pending_stock_id: stockid
                }
            })

            return user;
        },

        requestBulkInventory: async (root, { id, requestedProduct }, { NewVirtualWarehouse }) => {
            requestedProduct = JSON.parse(requestedProduct)
            const newVirtualWarehouse = await new NewVirtualWarehouse({
                creator: id,
                product_name: requestedProduct.productName,
                variants: requestedProduct.variants
            }).save();

            return newVirtualWarehouse;
        },

        updateVirtualWarehouse: async (root, { id, approve_price, variant_id, dg_code, chinese_description, boxc_product_id, isFinish, object_id }, { NewVirtualWarehouse, User, CreditsLog }) => {
            if (!object_id) {
                var sets = null;

                if (approve_price && chinese_description) {
                    sets = {
                        "variants.$[i].approve_price": approve_price,
                        "variants.$[i].dg_code": dg_code,
                        "chinese_description": chinese_description
                    }
                }

                if (boxc_product_id) {
                    sets = {
                        "variants.$[i].boxc_product_id": boxc_product_id,
                    }
                }

                const result = await NewVirtualWarehouse.updateMany({ creator: id, "variants.variant_id": variant_id }, {
                    $set: sets
                }, {
                    arrayFilters: [{
                        "i.variant_id": variant_id
                    }]
                });

                return result;
            } else {
                var result = null;
                var findBulkObject = await NewVirtualWarehouse.findById({ _id: object_id });
                // start request inbound
                if (!findBulkObject.isFinish) {
                    // this time ang value ng id ay user id ndi newvirtualwarehouse id
                    var userObject = await User.findById({ _id: id });
                    var tempBalance = parseFloat(userObject.plg_balance);
                    var inboundPayload = {
                        products: []
                    };
                    var transactionLog = [];

                    findBulkObject.variants.forEach(variant => {
                        var totalPrice = variant.approve_price * variant.quantity;
                        if (tempBalance > totalPrice) {
                            // if still not processed
                            inboundPayload.products.push({
                                "id": variant.boxc_product_id,
                                "quantity": variant.quantity
                            })
                            transactionLog.push({
                                total_cost: totalPrice,
                                description: "Bulk Order for " + findBulkObject.product_name + " (" + variant.variant_name + ")"
                            })
                            tempBalance -= totalPrice;
                        }
                    })

                    if (inboundPayload.products.length == 0) {
                        throw new Error("Not enough User Credit.")
                    }

                    await _points.customFetch(_points.clientUrl + '/request-inbound', 'POST', inboundPayload, async inboundResult => {
                        console.log(inboundPayload);
                        if (inboundResult.data.status != "error") {
                            // update user
                            await User.findByIdAndUpdate({ _id: id }, {
                                $set: {
                                    plg_balance: tempBalance
                                },
                                $push: {
                                    pending_stock_id: inboundResult.data.inbound.id
                                }
                            })
                            // update credit logs
                            transactionLog.forEach(transaction => {
                                new CreditsLog({
                                    date_paid: Date.now(),
                                    total_cost: transaction.total_cost,
                                    description: transaction.description,
                                    creator: id
                                }).save();
                            })
                            // update bulk object
                            result = await NewVirtualWarehouse.findByIdAndUpdate({ _id: object_id }, {
                                $set: {
                                    isFinish: true,
                                    boxc_inbound_id: inboundResult.data.inbound.id
                                }
                            });
                        } else {
                            throw new Error(inboundResult.data.message + "\nTry creating product first.")
                        }
                    })
                } else {
                    throw new Error("This order is being processed try refreshing the page.")
                }
                // end request inbound

                return result;
            }
        },

        saveFunnelGenieCredential: async (root, { id, design_id, domain_or_subdomain, funnel_name, funnel_type, page_type, path, design, pageID, isPath, domainIndex, screenshotURL, templateUse, funnelType, enableLoader, isPublish, isSplitEdit, selectedModalAction }, { User, currentUser, FunnelGenie }) => {
            throw new Error("Please refresh the page.");
        },

        pushToFunnel: async (root, { id, domainIndex, funnel_name, funnel_templates, offer_link, isCOD }, { currentUser, FunnelGenie, FunnelProducts }) => {
            throw new Error("Please refresh the page.");
        },

        duplicateFunnel: async (root, { id, funnel_name, domainIndex }, { FunnelGenie }) => {
            var result = await FunnelGenie.find({ creator: id, funnel_name, domainIndex });
            var pageTemplate = [];
            var newFunnelName = "";
            result.forEach(data => {
                newFunnelName = _points.addCounterToPath(data.funnel_name);
                var regexp = new RegExp(funnel_name + "\\/", "g")
                var jsonDesign = data.design[data.design.length - 1].json;
                try {
                    jsonDesign = data.design[data.design.length - 1].json.replace(regexp, newFunnelName + '/');
                } catch (err) {
                    console.error("Error in duplicateFunnel ==>", err);
                }
                pageTemplate.push({
                    creator: id,
                    domainIndex,
                    funnel_name: newFunnelName,
                    page_type: data.page_type,
                    path: data.path,
                    design: [{
                        date: Date.now(),
                        json: jsonDesign,
                    }],

                    funnel_type: data.funnel_type,
                    funnel_phone: data.funnel_phone,
                    funnel_address: data.funnel_address,
                    funnel_email: data.funnel_email,
                    funnel_ga: data.funnel_ga,
                    funnel_fga: data.funnel_fga,
                    funnel_selected_merchant: data.funnel_selected_merchant,
                    funnel_stripe_public: data.funnel_stripe_public,
                    funnel_stripe_private: data.funnel_stripe_private,
                    funnel_other: data.funnel_other,

                    page_description: data.page_description,
                    page_og_image_link: data.page_og_image_link,
                    page_keyword: data.page_keyword,

                    paypalClientID: data.paypalClientID,
                    confirmationEmail: data.confirmationEmail,
                    abandonmentEmail: data.abandonmentEmail,
                    trackingEmail: data.trackingEmail
                })
            });

            var checkIfFunnelExist = await FunnelGenie.find({ creator: id, funnel_name: newFunnelName, domainIndex });
            if (checkIfFunnelExist.length == 0) {
                result = await FunnelGenie.insertMany(pageTemplate);
            } else {
                throw new Error('Cannot copy funnel because ' + _points.capitalizeWord(newFunnelName.replace(/-|_/g, " ")) + ' is already exist.');
            }

            return result;
        },

        deleteFunnelPage: async (root, { id }, { FunnelGenie }) => {
            const result = await FunnelGenie.findById({ _id: id });
            if (!result.split_design) {
                // normal delete
                if (result.pageID) {
                    const payload = {
                        "query": "mutation($id: String!){\n  deletePage(id: $id){\n    id\n   }\n}",
                        "variables": {
                            id: result.pageID
                        }
                    }
                    result.remove();
                    await new Promise(resolve => {
                        _points.customFetch(funnelserver, 'POST', payload, result => {
                            console.log("delete success => ", result)
                            resolve(result)
                        })
                    })
                } else {
                    result.remove();
                }
            } else {
                // update funnel genie server html to html2
                await new Promise((resolve, reject) => {
                    var payload1 = { "query": "{\n  page(id:\"" + result.pageID + "\"){\n    html2\n  }\n}", "variables": null, "operationName": null }
                    _points.customFetch(funnelserver, 'POST', payload1, res1 => {
                        if (res1) {
                            var payload2 = {
                                "query": "mutation($id: String, $html: String, $html2: String, $bias: Int){\n  updatePage(id: $id, html: $html, html2: $html2, bias: $bias){\n    id\n   }\n}",
                                "variables": {
                                    id: result.pageID,
                                    html: res1.data.page.html2,
                                    html2: "",
                                    bias: null
                                }
                            }
                            _points.customFetch(funnelserver, 'POST', payload2, res2 => {
                                if (res2 && res2) {
                                    // trasnfer page B to page A
                                    FunnelGenie.findByIdAndUpdate({ _id: id }, {
                                        $set: {
                                            design: [{
                                                date: Date.now(),
                                                json: result.split_design,
                                                screenshotURL: result.design[result.design.length - 1].screenshotURL
                                            }],
                                            split_design: ""
                                        }
                                    }).then(updateResult => {
                                        resolve(updateResult)
                                    });
                                } else {
                                    reject("Error updating the funnel genie server.");
                                }
                            })
                        } else {
                            reject("Error getting html2 for updating the funnel genie server.");
                        }
                    })
                });
            }

            return result;
        },

        updateFunnelSetting: async (root, { id, creator, funnel_name, domainIndex, changeDomainIndexTo, changeDomainNameTo, changeFunnelNameTo, changePageNameTo, funnel_phone, funnel_isWhatsApp, funnel_email, funnel_address, funnel_ga, funnel_fga, funnel_selected_merchant, funnel_stripe_public, funnel_stripe_private, funnel_other, paypalClientID, page_title, page_description, page_og_image_link, page_keyword, confirmationEmail, abandonmentEmail, trackingEmail, favicon_link, facebook_id, google_id, tiktok_id, snapchat_id, sendPLGEmailConfirmation, sendPLGEmailAbandonment }, { FunnelGenie, FunnelIntegration }) => {
            var updateObj = {};
            if (id) {
                // for updating pages
                updateObj = {
                    path: changePageNameTo,
                    funnel_ga,
                    funnel_fga,
                    page_title,
                    page_description,
                    page_og_image_link,
                    page_keyword
                }
            } else {
                // for updating whole funnel
                if (!changeFunnelNameTo) throw new Error("Funnel Name Required!")
                updateObj = {
                    domainIndex: changeDomainIndexTo,
                    funnel_name: changeFunnelNameTo,
                    funnel_address,
                    funnel_email,
                    funnel_other,
                    funnel_phone,
                    funnel_isWhatsApp,
                    funnel_selected_merchant,
                    funnel_stripe_private,
                    funnel_stripe_public,
                    paypalClientID,
                    confirmationEmail,
                    abandonmentEmail,
                    trackingEmail,
                    favicon_link,
                    facebook_id,
                    google_id,
                    tiktok_id,
                    snapchat_id,
                    sendPLGEmailConfirmation,
                    sendPLGEmailAbandonment
                }
            }

            var result = null;
            if (id) {
                var findPageData = await FunnelGenie.findById({ _id: id });
                var findPageIfExist = await FunnelGenie.find({ creator, funnel_name, path: changePageNameTo });
                // check if user change the funnel name
                if (findPageData.path != changePageNameTo) {
                    // check if already exist
                    if (findPageIfExist.length == 0) {
                        if (findPageData.pageID) {
                            result = new Promise(resolve => {
                                const payload = {
                                    "query": "mutation($id: String! $path: String!){\n  updatePage(id: $id, path: $path){\n    id\n   }\n}",
                                    "variables": {
                                        id: findPageData.pageID,
                                        path: funnel_name + (changePageNameTo ? "/" + changePageNameTo : "")
                                    }
                                }
                                _points.customFetch(funnelserver, 'POST', payload, updateResult => {
                                    console.log("update page name success => ", updateResult)
                                    // Update the page name
                                    FunnelGenie.findByIdAndUpdate({ _id: id }, { $set: updateObj }).then(data => resolve(data))
                                });
                            });
                        } else {
                            // update locally
                            result = await FunnelGenie.findByIdAndUpdate({ _id: id }, { $set: updateObj });
                        }
                    } else {
                        throw new Error('Cannot change page name because ' + changePageNameTo + ' is already exist.');
                    }
                } else {
                    // update locally
                    result = await FunnelGenie.findByIdAndUpdate({ _id: id }, { $set: updateObj });
                }
            } else {
                if (domainIndex != changeDomainIndexTo || funnel_name != changeFunnelNameTo) {
                    var findUpdatedDomain = await FunnelGenie.find({ creator, funnel_name, domainIndex });
                    var findDomainAndFunnelIfExist = await FunnelGenie.find({ creator, funnel_name: changeFunnelNameTo, domainIndex: changeDomainIndexTo });
                    if (findDomainAndFunnelIfExist.length == 0) {
                        result = await Promise.all(
                            findUpdatedDomain.map(funnel => {
                                return new Promise(resolve => {
                                    if (funnel.pageID) {
                                        const payload = {
                                            "query": "mutation($id: String!, $domain: String!, $path: String!){\n  updatePage(id: $id, domain: $domain, path: $path){\n    id\n   }\n}",
                                            "variables": {
                                                id: funnel.pageID,
                                                domain: changeDomainNameTo,
                                                path: changeFunnelNameTo + (funnel.path ? "/" + funnel.path : "")
                                            }
                                        }
                                        _points.customFetch(funnelserver, 'POST', payload, updateResult => {
                                            console.log("update domain or funnel name success => ", updateResult)
                                            // Update the funnel
                                            FunnelGenie.updateMany({ creator, funnel_name, domainIndex }, { $set: updateObj }).then(data => resolve(data))
                                        });
                                    } else {
                                        // Update the funnel
                                        FunnelGenie.updateMany({ creator, funnel_name, domainIndex }, { $set: updateObj }).then(data => resolve(data))
                                    }
                                }).then(promiseReturn => {
                                    return promiseReturn;
                                });
                            })
                        ).then(promiseAllReturn => {
                            return promiseAllReturn;
                        });
                    } else {
                        throw new Error('Cannot change domain because ' + changeDomainNameTo + ' with funnel name of ' + funnel_name + '<br> is already exist.');
                    }
                } else {
                    // Update the funnel locally
                    result = await FunnelGenie.updateMany({ creator, funnel_name, domainIndex }, {
                        $set: updateObj
                    });
                }

                // ======================== When update the whole funnel ======================== //
                // =================== start update email and sms integration =================== //
                if (domainIndex != changeDomainIndexTo || funnel_name != changeFunnelNameTo) {
                    const previousFunnelSource = creator + "_" + domainIndex + "_" + funnel_name;
                    const newFunnelSource = creator + "_" + changeDomainIndexTo + "_" + changeFunnelNameTo;
                    await FunnelIntegration.updateMany({ creator, funnelSource: previousFunnelSource }, { $set: { funnelSource: newFunnelSource } });
                    console.log("Funnel Source: " + previousFunnelSource + " has been updated to " + newFunnelSource);
                }
                // ==================== end update email and sms integration ==================== //
            }

            return result;
        },

        deleteFunnel: async (root, { creator, funnel_name, domainIndex }, { FunnelGenie }) => {
            const result = await FunnelGenie.find({ creator, funnel_name, domainIndex });
            for (var index = 0; index < result.length; index++) {
                var data = result[index];
                if (data.pageID) {
                    const payload = {
                        "query": "mutation($id: String!){\n  deletePage(id: $id){\n    id\n   }\n}",
                        "variables": {
                            id: data.pageID
                        }
                    }
                    if (data.remove) data.remove();
                    _points.customFetch(funnelserver, 'POST', payload, () => { });
                } else {
                    if (data.remove) data.remove();
                }
            }

            return result;
        },

        markAsExported: async (root, { ids }, { NewFulfillmentChina }) => {
            ids = JSON.parse(ids);
            const result = await NewFulfillmentChina.updateMany({ _id: { $in: ids } }, { $set: { exported: true } });

            return null;
        },

        funnelGenieAccess: async (root, { id, access }, { User }) => {
            var user = null;
            if (access) {
                user = await User.findByIdAndUpdate({ _id: id }, { $push: { access_tags: "FG" } })
            } else {
                user = await User.findByIdAndUpdate({ _id: id }, { $pull: { access_tags: "FG" } })
            }

            return user;
        },

        setAsDefaultDomain: async (root, { id, domain, domainIndex, funnel_name, path }, { FunnelGenie }) => {
            var funnelData = await FunnelGenie.findOne({ creator: id, domainIndex, funnel_name, path });
            if (!funnelData.pageID) {
                throw new Error("Please publish this page first.");
            }
            var result = new Promise((resolve, reject) => {
                const payload = {
                    "query": "query{\n  everyPage(domain: \"" + domain + "\", path: null){\n    id\n    domain\n    path\n    param1\n   }\n}",
                    "variables": null
                }
                _points.customFetch(funnelserver, 'POST', payload, gql_result => {
                    if (gql_result && gql_result.data.everyPage) {
                        if (gql_result.data.everyPage.length != 0) {
                            // update the result and the current page
                            gql_result.data.everyPage.forEach(data => {
                                const payload2 = {
                                    "query": "mutation{\n  updatePage(id: \"" + data.id + "\", param1: null, path: \"" + data.param1 + "\"){\n    id\n   }\n}",
                                    "variables": null
                                }
                                _points.customFetch(funnelserver, 'POST', payload2, gql_result2 => {
                                    var gql_path = funnelData.funnel_name + (funnelData.path ? '/' + funnelData.path : '');
                                    const payload3 = {
                                        "query": "mutation{\n  updatePage(id: \"" + funnelData.pageID + "\", param1: \"" + gql_path + "\", path: null){\n    id\n   }\n}",
                                        "variables": null
                                    }
                                    _points.customFetch(funnelserver, 'POST', payload3, gql_result3 => {
                                        console.log("setting " + (path ? path : 'homepage') + " as default success => ", gql_result3)
                                        // update all in this domain as root false
                                        FunnelGenie.updateMany({ creator: id, domainIndex, isRoot: true }, { isRoot: false }).then(callback => {
                                            // make this page as domain root
                                            FunnelGenie.findByIdAndUpdate({ _id: funnelData.id }, { isRoot: true }).then(callback2 => {
                                                resolve(null);
                                            })
                                        })
                                    });
                                });
                            })
                        } else {
                            // normal save as default
                            var gql_path = funnelData.funnel_name + (funnelData.path ? '/' + funnelData.path : '');
                            const payload2 = {
                                "query": "mutation{\n  updatePage(id: \"" + funnelData.pageID + "\", param1: \"" + gql_path + "\", path: null){\n    id\n   }\n}",
                                "variables": null
                            }
                            _points.customFetch(funnelserver, 'POST', payload2, gql_result2 => {
                                console.log("setting " + (path ? path : 'homepage') + " as default success => ", gql_result2)
                                // update all in this domain as root false
                                FunnelGenie.updateMany({ creator: id, domainIndex, isRoot: true }, { isRoot: false }).then(callback => {
                                    // make this page as domain root
                                    FunnelGenie.findByIdAndUpdate({ _id: funnelData.id }, { isRoot: true }).then(callback2 => {
                                        resolve(null);
                                    })
                                })
                            });
                        }
                    } else {
                        reject("Please try again.")
                    }
                })
            });

            return result;
        },

        saveORupdateIntegration: async (root, { id, integrationID, merchant_type, merchant_name, public_key, private_key, other }, { Integration }) => {
            var integration = null;
            var object = {};
            if (merchant_type) object.merchant_type = merchant_type;
            if (merchant_name) object.merchant_name = merchant_name;
            if (other) object.other = other;
            if (public_key) object.public_key = public_key;
            if (private_key) object.private_key = encryptString(private_key);

            if (integrationID) {
                console.log(object)
                integration = await Integration.findByIdAndUpdate({ _id: integrationID }, object);
            } else {
                object.creator = id;
                if (merchant_type == "stripe" && !public_key) {
                    throw new Error("Stripe public key is required!");
                }
                integration = await new Integration(object).save();
            }

            return integration;
        },

        deleteIntegration: async (root, { id }, { Integration }) => {
            var integration = await Integration.findById({ _id: id }).remove();

            return integration;
        },

        saveFunnelOrder: async (root, { object }, { FunnelGenieOrder, User }) => {
            let parsedObject = JSON.parse(object);

            if (parsedObject.merchant_type !== "cod") parsedObject.fulfill_with_plg = false; // if not COD mark as fulfill_with_plg = false
            let orders = await new FunnelGenieOrder(parsedObject).save();
            // console.log(orders)
            if (parsedObject.line_items.shopify_variant_id) { // if it has the shopify_variant_id will wait for the oter orders to be deployed

                // Good entry for the queue function TODO::
                const userdata = await User.findById({ _id: parsedObject.creator });
                if (parsedObject.merchant_type === "authorize.net" && parsedObject.responseCode === "2") {
                    console.log("dont run the sync !!!!");
                    return orders;
                } else {
                    //     console.log("run the sync")
                    runPendingJob(orders.id, parsedObject, userdata.store_url, userdata.store_token); // Good entrypoint for grabbing user integration and process it here
                }
            }

            // if(parsedObject.line_items.plg_sku) {
            //     console.log("may plg sku so check kng active pa to kung hindi console muna daw mapapaltan ng sending email to affiliate");
            //     const funnel_product = await getFunnelProducts({ id: parsedObject.line_items.plg_sku }, true)
            //     console.log(funnel_product);
            // }
            return orders;
        },

        updatePaypalOrderStatus: async (root, { ref_id, is_failed }, { FunnelGenieOrder }) => {
            let order = null;
            if (!is_failed) { // normal checkout no problem
                order = await FunnelGenieOrder.findOneAndUpdate({ ref_id }, { $set: { order_status: "paid" } });
            } else { // failed charge remove the order
                order = await FunnelGenieOrder.findOne({ ref_id }).remove();
            }

            return order;
        },

        updateMyFunnelOrderShippingInformation: async (root, { orderIds, phone, street1, street2, city, state, zip, country, address_type, aptOffice, bldgVilla, nearestLandmark, received_payment_from_courier, updaterID, updaterName }, { FunnelGenieOrder }) => {
            orderIds = JSON.parse(orderIds);
            var updateObject = { updateById: updaterID, updateByName: updaterName, fieldsModified: "" };
            if (typeof phone != "undefined") {
                updateObject = { "shipping_information.phone": phone }
                updateObject.fieldsModified = "shipping_information.phone";
            };
            if (typeof street1 != "undefined") {
                updateObject = { "shipping_information.street1": street1 }
                updateObject.fieldsModified = "shipping_information.street1";
            };
            if (typeof street2 != "undefined") {
                updateObject = { "shipping_information.street2": street2 }
                updateObject.fieldsModified = "shipping_information.street2";
            };
            if (typeof city != "undefined") {
                updateObject = { "shipping_information.city": city }
                updateObject.fieldsModified = "shipping_information.city";
            };
            if (typeof state != "undefined") {
                updateObject = { "shipping_information.state": state }
                updateObject.fieldsModified = "shipping_information.state";
            };
            if (typeof zip != "undefined") {
                updateObject = { "shipping_information.zip": zip }
                updateObject.fieldsModified = "shipping_information.zip";
            };
            if (typeof country != "undefined") {
                updateObject = { "shipping_information.country": country }
                updateObject.fieldsModified = "shipping_information.country";
            };
            if (typeof address_type != "undefined") {
                updateObject = { "shipping_information.address_type": address_type }
                updateObject.fieldsModified = "shipping_information.country";
            };
            if (typeof aptOffice != "undefined") {
                updateObject = { "shipping_information.aptOffice": aptOffice }
                updateObject.fieldsModified = "shipping_information.aptOffice";
            };
            if (typeof bldgVilla != "undefined") {
                updateObject = { "shipping_information.bldgVilla": bldgVilla }
                updateObject.fieldsModified = "shipping_information.bldgVilla";
            };
            if (typeof nearestLandmark != "undefined") {
                updateObject = { "shipping_information.nearestLandmark": nearestLandmark }
                updateObject.fieldsModified = "shipping_information.nearestLandmark";
            };
            if (typeof received_payment_from_courier != "undefined") {
                updateObject = { received_payment_from_courier }
                updateObject.fieldsModified = "received_payment_from_courier to " + received_payment_from_courier;
                updateObject.dateCourierCollected = Date.now();
            };
            const result = await FunnelGenieOrder.updateMany({ _id: { $in: orderIds } }, { $set: updateObject }, { multi: true });
            return result;
        },
        updateOrderStatusByCallId: async (root, args, { FunnelGenieOrder }) => {
            var result = await FunnelGenieOrder.updateMany({ _id: { $in: args.ids } },
                {
                    $set: {
                        order_status: args.order_status,
                        cancel_note: args.cancel_note,
                        order_status_update: Date.now()
                    }
                });
            return result;
        },

        updateOrderHold: async (root, args, { FunnelGenieOrder }) => {
            var result = await FunnelGenieOrder.updateMany({ _id: { $in: args.ids } },
                {
                    $set: {
                        on_hold: args.on_hold,
                    }
                });
            return result;
        },

        updateFunnelOrdersCallID: async (root, args, { FunnelGenieOrder }) => {
            var result = await FunnelGenieOrder.updateMany({ _id: { $in: args.ids } }, { $set: { callId: args.callId } });
            return result;
        },

        updateMyFunnelOrders: async (root, { id, merchant_type, orderCreator, orderEmail, sync_from, safeArrivalID, tracking_number, domains, client_tracking, sendPLGTrackingEmail, cancel_note, order_status, country, updaterID, updaterName, dateStatusDelivered, productID, variantSku, variantQty, variantPrice, variantTitle, variantName, fulfillerLocation, onlyUpdateThisLineItem, newVariantName, shopify_order_number }, { FunnelGenieOrder, FunnelGenie, FunnelList, Integration, FunnelProducts }) => {
            // client_tracking ay para malaman kung mula ba ang tracking number sa client or sa fulfiller client_tracking = true meaning from client
            var result = null;
            if (tracking_number) {
                // const domain_list = JSON.parse(domains)
                const tracking_numbers = JSON.parse(tracking_number);
                // var trackingPayload = {
                //     url: "productlistgenie.com",
                //     name: "",
                //     email: "",
                //     lineItems: [],
                //     country: country ? country : ""
                // }

                for (const tracking of tracking_numbers) {
                    var saTrackingData = { data: {}, status: 200 };
                    if (!client_tracking && merchant_type && country && merchant_type == "cod" && ["ARE", "AE", "SAU", "SA"].includes(country)) {
                        let isTaqadum = sync_from == "taqadum" ? true : false;
                        if (sync_from == "safearrival" || isTaqadum) {
                            saTrackingData = await safeArrivalGetTrackingData(tracking.tracking, isTaqadum);
                            if (saTrackingData.status == 400) throw new Error("Error " + sync_from.toUpperCase() + " Tracking: " + tracking.tracking + " Message: " + saTrackingData.message);
                        } else if (sync_from == "wimo") {
                            saTrackingData = await wimoGetTrackingData(tracking.tracking);
                            if (saTrackingData.status == 400) {
                                saTrackingData = await wimoGetTrackingData(tracking.tracking, true);
                                if (saTrackingData.status == 400) throw new Error("Error WIMO Tracking: " + tracking.tracking + " Message: " + saTrackingData.message);
                            }
                        } else if (sync_from == "fetchr") {
                            saTrackingData = await fetchrGetTrackingData(tracking.tracking);
                            if (saTrackingData.status == 400) throw new Error("Error Fetchr Tracking: " + tracking.tracking + " Message: " + saTrackingData.message);
                        } else {
                            // page undefined ung sync_from then test safe arrival then wimo then fetchr
                            saTrackingData = await safeArrivalGetTrackingData(tracking.tracking);
                            sync_from = "safearrival";
                            if (saTrackingData.status == 400) {
                                sync_from = "wimo";
                                saTrackingData = await wimoGetTrackingData(tracking.tracking);
                                if (saTrackingData.status == 400) {
                                    saTrackingData = await wimoGetTrackingData(tracking.tracking, true);
                                    if (saTrackingData.status == 400) {
                                        sync_from = "fetchr";
                                        saTrackingData = await fetchrGetTrackingData(tracking.tracking);
                                        if (saTrackingData.status == 400) throw new Error("Error Fetchr Tracking Number: " + tracking.tracking + " Message: " + saTrackingData.message);
                                    }
                                }
                            }
                        }
                    } else {
                        saTrackingData.data = { fulfillment_status: "fulfilled" };
                    }
                    const updateObject = { sync_from, "line_items.tracking_number": tracking.tracking, ...saTrackingData.data }
                    if (safeArrivalID) updateObject.safeArrivalID = safeArrivalID;
                    result = await FunnelGenieOrder.findByIdAndUpdate(tracking.id, { $set: updateObject });
                    if (!client_tracking) {
                        if (result.order_status != "pickedup" && updateObject.order_status == "pickedup") {
                            // assinging serial number
                            if (result.line_items.plg_sku && result.line_items.plg_serialNumber && result.line_items.plg_serialNumber.length == 0) {
                                const serial_numbers = await getSerialNumbers(result.line_items.plg_sku, result.line_items.quantity);
                                await FunnelGenieOrder.findByIdAndUpdate(result.id, { $set: { "line_items.plg_serialNumber": serial_numbers } })
                            }
                        }

                        // for adding the product cost to affiliate account
                        if (result.order_status != "delivered" && updateObject.order_status == "delivered" && result && result.line_items && result.line_items.plg_serialNumber) {
                            var serialNumbers = [...result.line_items.plg_serialNumber];
                            await addFunnelProductCostToUser(serialNumbers, "Adding Tracking Number or Resync")
                        }

                        // for reducing quantity of cod product
                        if (result && result.line_items && result.line_items.plg_sku && (result.order_status != "pickedup" && updateObject.order_status == "pickedup")) {
                            reduceFunnelProductQty(result.line_items.plg_sku.toString(), result.line_items.quantity)
                        }
                    }

                    // for loading the payload for sending email
                    // trackingPayload.name = result.shipping_information.name;
                    // trackingPayload.email = result.shipping_information.email;
                    // trackingPayload.lineItems.push({
                    //     name: result.line_items.title,
                    //     qty: result.line_items.title,
                    //     price: result.line_items.quantity,
                    //     tracking: tracking.tracking
                    // });
                }

                if (sendPLGTrackingEmail) {
                    const order_ids = tracking_numbers.map(e => mongoose.Types.ObjectId(e.id));
                    sendTrackingEmail(order_ids);
                }
                // const datas = await FunnelGenieOrder.find({ _id: { $in: order_ids } });
                // if(datas.length != 0 && datas[0].funnel_source_id && sendPLGTrackingEmail){
                //     trackingPayload.merchant = datas[0].merchant_type ? datas[0].merchant_type : "cod";
                //     // change tracking number to encode id or ref_track if available
                //     trackingPayload.lineItems.map((li, i) => {
                //         li.tracking = datas[i].line_items.ref_track ? datas[i].line_items.ref_track : mongoDBId.encode(datas[i]._id.toString());
                //         return li;
                //     });
                //     var funnel_page = await FunnelGenie.findById({ _id: datas[0].funnel_source_id }), is_new_funnel = false;
                //     if(!funnel_page) { // try searching to new funnel
                //         funnel_page = await FunnelList.findById({ _id: datas[0].funnel_source_id });
                //         if(funnel_page) {
                //             is_new_funnel = true;
                //         }
                //     }
                //     // ung id creator value nun sa fulfiller
                //     const integration_result = await Integration.findOne({ creator: id, merchant_type: 'klaviyo' });
                //     var apiKey = integration_result && integration_result.private_key ? decryptString(integration_result.private_key) : "";
                //     var trackingid = "";
                //     if(funnel_page){
                //         if(is_new_funnel) {
                //             trackingid = funnel_page.integration_tracking_email;
                //             trackingPayload.url = "https://" + funnel_page.domain_name;
                //         } else {
                //             trackingid = funnel_page.trackingEmail;
                //             trackingPayload.url = "https://" + domain_list[funnel_page.domainIndex];
                //         };
                //     }
                //     if(apiKey && trackingid){ // klaviyo
                //         // Start function for sending email with klaviyo
                //         var url = "http://productlistgenie.productlistgenie.io/send_order_confirmation?pk=" + apiKey + "&ocid=" + trackingid + "&name=" + datas[0].shipping_information.name + "&email=" + datas[0].shipping_information.email + "&a=no&t=" + tracking_numbers[0].tracking;
                //         datas.forEach(data => {
                //             url += "&product=" + data.line_items.title + "&price=" + (data.line_items ? data.line_items.price : 0) + "&quantity=" + data.line_items.quantity
                //         })
                //         url = encodeURI(url);
                //         fetch(url).then(fetch_result => {
                //             console.log("sending tracking number success.")
                //         })
                //         // End function for sending email with klaviyo
                //     } else { // PLG
                //         // Start function for sending email with PLG
                //         fetch("https://stats.productlistgenie.io/send_tracking", {
                //             method: "POST",
                //             headers: { 'Content-Type': 'application/json' },
                //             body: JSON.stringify(trackingPayload)
                //         }).then(res => {
                //             console.log("PLG Sending tracking number result: " + res.ok);
                //         })
                //         // End function for sending email with PLG
                //     }
                // }
            } else {
                // for fulfillment status and other fulfiller thing
                var updateObj = {};
                var query = { orderCreator: orderCreator, "shipping_information.email": orderEmail };
                if (order_status) {
                    if (order_status != "delivered" || order_status != "paid") updateObj.dateStatusDelivered = null;
                    if (order_status == "delivered") updateObj.dateStatusDelivered = Date.now();
                    if (order_status == "delivered" || order_status == "paid") updateObj.fulfillment_status = "fulfilled";
                    else updateObj.fulfillment_status = "unfulfilled";
                    updateObj.order_status_update = Date.now();
                    updateObj.order_status = order_status;
                    updateObj.cancel_note = cancel_note;
                }
                if (updaterID) updateObj.updateById = updaterID;
                if (updaterName) updateObj.updateByName = updaterName;
                if (country) updateObj["shipping_information.country"] = country;
                if (dateStatusDelivered) updateObj.dateStatusDelivered = new Date(dateStatusDelivered);
                // start always together
                if (!onlyUpdateThisLineItem && fulfillerLocation && variantTitle && variantName) {
                    // mass update ng line items para sa sku
                    query = {
                        "shipping_information.country": iso3to2[fulfillerLocation],
                        "line_items.title": variantTitle,
                        "line_items.variant": variantName
                    };
                }
                if (variantSku || variantQty) {
                    if (onlyUpdateThisLineItem) { // kung gsto isang line item lang i update
                        query = { _id: productID };
                        updateObj["line_items.variant"] = newVariantName;
                    }
                    if (variantSku) {
                        updateObj["line_items.plg_sku"] = variantSku;
                    }
                    if (variantQty) {
                        updateObj["line_items.quantity"] = variantQty;
                    }
                }
                if (shopify_order_number) {
                    updateObj["line_items.shopify_order_number"] = shopify_order_number;
                }

                if (variantPrice) { // update only the price of selected product
                    await FunnelGenieOrder.findByIdAndUpdate({ _id: productID }, { $set: { "line_items.price": variantPrice } });
                }
                // end always together
                result = await FunnelGenieOrder.updateMany(query, { $set: updateObj }).then(res => {
                    if (res.nModified >= 1) {
                        if (order_status && order_status == "pickedup") { // dati delivered
                            FunnelGenieOrder.findOne({ orderCreator, "shipping_information.email": orderEmail }).then(res => {
                                var prodid = res.line_items.plg_sku ? res.line_items.plg_sku.toString() : "";
                                if (!res.line_items) console.log("DATA ID (9) ==>", res.id)
                                if (prodid) reduceFunnelProductQty(prodid, res.line_items.quantity);
                            })
                        }
                        if (order_status && order_status == "pickedup") { // check if may variant sku or quantity at status ay pickedup
                            // for getting the serial number and save it to order
                            FunnelGenieOrder.find(query).then(async fgRes => {
                                for (var i = 0; i < fgRes.length; i++) {
                                    var fgResData = fgRes[i];
                                    if (fgResData && fgResData.line_items) {
                                        var serialNumbers = [];
                                        if (fgResData.line_items.plg_serialNumber && fgResData.line_items.plg_serialNumber.length == 0) {
                                            serialNumbers = await getSerialNumbers(fgResData.line_items.plg_sku, fgResData.line_items.quantity);
                                        } else {
                                            serialNumbers = await getSerialNumbers(fgResData.line_items.plg_sku, fgResData.line_items.quantity, fgResData._id);
                                        }
                                        await FunnelGenieOrder.findByIdAndUpdate({ _id: fgResData._id }, { $set: { "line_items.plg_serialNumber": serialNumbers } })
                                    }
                                }
                            });
                        }
                        if (order_status && order_status == "cancelled") { // for putting product as cancelled
                            FunnelGenieOrder.find(query).then(async fgRes => {
                                for (var i = 0; i < fgRes.length; i++) {
                                    var fgResData = fgRes[i];
                                    if (fgResData.line_items.plg_serialNumber && fgResData.line_items.plg_serialNumber.length != 0) {
                                        const sn = fgResData.line_items.plg_serialNumber.map(el => el);
                                        for (var x = 0; x < sn.length; x++) {
                                            await changeSerialNumberStatus(sn[x], "returning")
                                        }
                                    }
                                }
                            });
                        }
                        if (order_status && (order_status == "delivered")) { // hindi pde ang paid dahil once ma receive sa webhook delivered na ma dodoble once ung pag dagdag sa user
                            FunnelGenieOrder.find(query).then(async result => {
                                var serialNumbers = [];
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i] && result[i].line_items) {
                                        serialNumbers.push(...result[i].line_items.plg_serialNumber);
                                    }
                                }
                                await addFunnelProductCostToUser(serialNumbers, "Manual Changing Order Status to Delivered")
                            });
                        }
                        if (order_status && order_status === "hold") { // send email to selected klaviyo integration in funnel settings of where this order come from
                            FunnelGenieOrder.find(query).then(async result => {
                                // let funnel_id = "5e790d057fa1ea1ad3207b3b", creator = result[0].creator; // for testing funnel na may on hold klaviyo
                                let funnel_id = result[0].funnel_source_id, creator = result[0].creator;
                                if (funnel_id) {
                                    let khold = await FunnelList.findById({ _id: funnel_id }, { integration_onhold_email: 1 }).lean();
                                    let kpk = await Integration.findOne({ creator, merchant_type: "klaviyo" }, { private_key: 1 }).lean();
                                    if ((khold && khold.integration_onhold_email) && (kpk && kpk.private_key)) { // kung may ni set sa funnel nya at kng may private key kht obyus n pag wlang private key ndi mkaka pili sa funnel
                                        khold = khold.integration_onhold_email;
                                        kpk = decryptString(kpk.private_key);
                                        let ohname = result[0].shipping_information.name, ohemail = result[0].shipping_information.email;
                                        let onhold_url = "https://admin.productlistgenie.io/send_order_confirmation?pk=" + kpk + "&ocid=" + khold + "&name=" + ohname + "&email=" + ohemail;
                                        for (let i = 0; i < result.length; i++) {
                                            let li = result[i].line_items;
                                            onhold_url += "&product=" + li.title + "&price=" + li.price + "&quantity=" + li.quantity;
                                        }
                                        onhold_url = encodeURI(onhold_url);
                                        await _points.customFetch(onhold_url, "GET", null, () => console.log("Sending On Hold Email Success URL: " + onhold_url));
                                    }
                                }
                            });
                        }
                    }
                });
            }

            function reduceFunnelProductQty(prodid, qty) {
                try {
                    if (typeof prodid !== "function" && prodid && mongoose.Types.ObjectId.isValid(mongoDBId.decode(prodid))) {
                        FunnelProducts.findByIdAndUpdate({ _id: mongoDBId.decode(prodid) }, { $inc: { quantity: -qty } }).then(res => {
                            var remaining = res.quantity - qty;
                            if (remaining == 0) {
                                console.log("Ubos Na!!!", prodid);
                            } else if (remaining >= 0 && remaining <= 10) {
                                // console.log("Kokonti na product refill na!!!!!!!!!")
                            }
                        })
                    }
                } catch (error) {
                    console.error(typeof prodid, "<== Charararat error (reduceFunnelProductQty) ==>", prodid);
                    console.error("<== Error (reduceFunnelProductQty) ==>", error);
                }
            }

            return result;
        },

        bulkUpdateMyFunnelOrders: async (root, { array }, { FunnelGenieOrder, FunnelList, Integration }) => {
            let result = null, array_of_object = JSON.parse(array),
                ids = array_of_object.map(e => {
                    return mongoose.Types.ObjectId(mongoDBId.decode(e.ref));
                });

            for (let i = 0; i < array_of_object.length; i++) {
                let data = array_of_object[i];
                result = await FunnelGenieOrder.findByIdAndUpdate({ _id: mongoDBId.decode(data.ref) }, {
                    $set: {
                        "line_items.tracking_number": data.tracking,
                        "line_items.tracking_link": data.tracking_link,
                        "fulfillment_status": "fulfilled"
                    }
                }).catch(err => null);
            }

            sendTrackingEmail(ids);

            return result;
        },

        cancelMyFunnelOrders: async (root, { id, orderCreator }, { FunnelGenieOrder }) => {
            const result = await FunnelGenieOrder.updateMany({ creator: id, orderCreator }, {
                $set: {
                    "order_status": "cancelled"
                }
            })

            return result;
        },

        archiveMyFunnelOrders: async (root, { id, orderCreator }, { FunnelGenieOrder, FunnelGenieOrderArchive }) => {
            var result = await FunnelGenieOrder.find({ creator: id, orderCreator });
            var saveData = [];
            result.forEach(el => {
                saveData.push({
                    creator: el.creator,
                    ref_id: el.ref_id,
                    orderCreator: el.orderCreator,
                    safeArrivalID: el.safeArrivalID,
                    order_date: el.order_date,
                    merchant_type: el.merchant_type,
                    order_status: el.order_status,
                    cancel_note: el.cancel_note,
                    currencyWord: el.currencyWord ? el.currencyWord : "USD", // if has currencySymbol
                    currencySymbol: el.currencySymbol ? el.currencySymbol : "$", // if has currencySymbol
                    shipping_information: el.shipping_information,
                    line_items: el.line_items,
                    fulfillment_status: el.fulfillment_status,
                    order_status_update: el.order_status_update,
                    risk_level: el.risk_level,
                    test_data: el.test_data,
                    funnel_source_id: el.funnel_source_id,
                    sync_from: el.sync_from,
                    sms_verified: el.sms_verified,
                    raw_data: el.raw_data,
                    updateById: el.updateById,
                    updateByName: el.updateByName,
                    fieldsModified: el.fieldsModified,
                    dateStatusDelivered: el.dateStatusDelivered,
                    dateCourierCollected: el.dateCourierCollected,
                    source_link: el.source_link,
                    isPaidCommision: el.isPaidCommision,
                    isPaidProductCost: el.isPaidProductCost,
                    fulfill_with_plg: el.fulfill_with_plg,
                    received_payment_from_courier: el.received_payment_from_courier,
                    isManualModified: el.isManualModified,
                    restore_marker: el.restore_marker
                });
                el.remove();
            });
            await FunnelGenieOrderArchive.insertMany(saveData);
            return result;
        },

        saveSharedFunnel: async (root, { creator, domainIndex, funnel_name, selectedPages }, { FunnelGenie }) => {
            var ids = JSON.parse(selectedPages)
            var pages = await FunnelGenie.find({ _id: { $in: ids } });
            var hasFunnelGenie = await FunnelGenie.findOne({ creator: creator, domainIndex, funnel_name });
            var results = null;
            if (!hasFunnelGenie) {
                var saveManyPages = [];
                pages.forEach(page => {
                    saveManyPages.push({
                        creator,
                        domainIndex,
                        funnel_name,
                        path: page.path,
                        funnel_type: pages[0].funnel_type,
                        page_type: page.page_type,
                        design: [{
                            date: Date.now(),
                            json: page.design[page.design.length - 1].json
                        }]
                    })
                })
                results = await FunnelGenie.insertMany(saveManyPages);
            } else {
                try {
                    throw new Error("<span>\"" + funnel_name.replace(/-|_/g, " ") + "\"</span> Already Exist. (saveSharedFunnel)")
                } catch (err) {
                    console.error("Error in saveSharedFunnel else ==>", err);
                }
            }
            return results;
        },

        saveFunnelEmailAndSMSintegration: async (root, { id, creator, messageID, funnelSource, messageType, method, delay, emailSubject, editorValue }, { Integration, FunnelIntegration }) => {
            var result = null;
            if (id) {
                // update document with this id
                var data = {
                    method,
                    delay,
                    editorValue,
                    emailSubject,
                };
                var payload = "";
                if (messageType == "SMS") {
                    const integration = await Integration.findOne({ creator: creator, merchant_type: "twilio" });
                    if (!integration) throw new Error("Please add twilio in your Integration.");
                    payload = { payload: { "query": "mutation($id: String, $content: String, $delay: String, $sender: String, $asid: String, $atkn: String){\n  updateAbandonmentsms(id: $id, content: $content, delay: $delay, sender: $sender, asid: $asid, atkn: $atkn){\n    id\n   }\n}", "variables": { id: messageID, content: editorValue.replace(/<[^<|>]+?>|&nbsp;/gi, ''), delay, sender: integration.other, asid: integration.public_key, atkn: integration.private_key } } };
                } else {
                    payload = { payload: { "query": "mutation($id: String, $subject: String, $content: String, $delay: String){\n  updateAbandonmentemail(id: $id, subject: $subject, content: $content, delay: $delay){\n    id\n   }\n}", "variables": { id: messageID, subject: emailSubject, content: editorValue, delay } } };
                }
                result = new Promise((resolve, reject) => {
                    _points.customFetch(_points.clientUrl + '/send-html-to-domain', 'POST', payload, res => {
                        if (!res) reject("Failed to save please try again.");
                        resolve(FunnelIntegration.findByIdAndUpdate({ _id: id }, { $set: data }));
                    })
                })
            } else {
                // save new document if no id
                if (messageType != "both") {
                    // if not from template
                    var payload = "";
                    if (messageType == "SMS") {
                        const integration = await Integration.findOne({ creator: creator, merchant_type: "twilio" });
                        if (!integration) throw new Error("Please add twilio in your Integration.");
                        payload = { payload: { "query": "mutation($creator: String, $delay: String, $sender: String, $asid: String, $atkn: String){\n  addAbandonmentsms(creator: $creator, delay: $delay, sender: $sender, asid: $asid, atkn: $atkn){\n    id\n   }\n}", "variables": { creator, delay, sender: integration.other, asid: integration.public_key, atkn: integration.private_key } } };
                    } else {
                        payload = { payload: { "query": "mutation($creator: String, $delay: String){\n  addAbandonmentemail(creator: $creator, delay: $delay){\n    id\n   }\n}", "variables": { creator, delay } } };
                    }
                    result = new Promise((resolve, reject) => {
                        _points.customFetch(_points.clientUrl + '/send-html-to-domain', 'POST', payload, res => {
                            if (!res) reject("Failed to save please try again.");
                            resolve(
                                new FunnelIntegration({
                                    creator,
                                    funnelSource,
                                    messageID: messageType == "SMS" ? res.data.addAbandonmentsms.id : res.data.addAbandonmentemail.id,
                                    messageType,
                                    method,
                                    delay
                                }).save()
                            );
                        })
                    })
                } else {
                    const integration = await Integration.findOne({ creator: creator, merchant_type: "twilio" });

                    // for template save
                    var delays = JSON.parse(delay);
                    var emailSubjects = JSON.parse(emailSubject);
                    var messages = JSON.parse(editorValue);
                    for (var index = 0; index < emailSubjects.length; index++) {
                        // process email
                        var current_subject = emailSubjects[index];
                        var current_email_delay = delays[index].email;
                        var current_email_message = messages[index].email;
                        var email_payload = { payload: { "query": "mutation($creator: String, $delay: String, $content: String, $subject: String){\n  addAbandonmentemail(creator: $creator, delay: $delay, content: $content, subject: $subject){\n    id\n   }\n}", "variables": { creator, subject: current_subject, content: current_email_message, delay: current_email_delay } } };
                        result = await new Promise((resolve, reject) => {
                            _points.customFetch(_points.clientUrl + '/send-html-to-domain', 'POST', email_payload, res => {
                                if (!res) reject("Failed to save please try again.");
                                resolve(
                                    new FunnelIntegration({
                                        creator,
                                        funnelSource,
                                        messageID: res.data.addAbandonmentemail.id,
                                        messageType: "Email",
                                        method,
                                        delay: current_email_delay,
                                        editorValue: current_email_message,
                                        emailSubject: current_subject,
                                    }).save()
                                );
                            })
                        });

                        if (integration) { // if has twillio integration
                            // process sms
                            var current_sms_delay = delays[index].sms;
                            var current_sms_message = messages[index].sms;
                            var sms_payload = { payload: { "query": "mutation($creator: String, $delay: String, $content: String){\n  addAbandonmentsms(creator: $creator, delay: $delay, content: $content){\n    id\n   }\n}", "variables": { creator, content: current_email_message, delay: current_email_delay, sender: integration.other, asid: integration.public_key, atkn: integration.private_key } } };
                            result = await new Promise((resolve, reject) => {
                                _points.customFetch(_points.clientUrl + '/send-html-to-domain', 'POST', sms_payload, res => {
                                    if (!res) reject("Failed to save please try again.");
                                    resolve(
                                        new FunnelIntegration({
                                            creator,
                                            funnelSource,
                                            messageID: res.data.addAbandonmentsms.id,
                                            messageType: "SMS",
                                            method,
                                            delay: current_sms_delay,
                                            editorValue: current_sms_message
                                        }).save()
                                    );
                                })
                            });
                        }
                    }
                }
            }
            return result;
        },

        saveLeadsMetaData: async (root, { id, creator, leads_id, meta_tag, meta_note }, { FunnelLeadsMetaData }) => {
            var result = null;
            if (id) {
                result = await FunnelLeadsMetaData.findById({ _id: id }).remove();
            } else {
                // create new document
                result = await new FunnelLeadsMetaData({ creator, leads_id, meta_tag, meta_note }).save();
            }
            return result;
        },

        saveEmailSequence: async (root, { id, creator, funnelSource, sequence_name, sequence_tags, content_id, delay, messageType, emailSubject, asid, atkn, sender, editorValue, addContent, remove_content, removeData, return_sequence_id }, { EmailSequence }) => {
            var result = null;
            var queryProcess = "";
            if (!id) {
                // for creating new sequence
                if (!sequence_name) throw new Error("Sequence Name is required.");
                else if (!sequence_tags) throw new Error("Sequence Tag is required.");
                result = await new EmailSequence({
                    creator,
                    funnelSource,
                    sequence_name,
                    sequence_tags
                }).save();

                queryProcess = "create"; // for upload process
            } else {
                queryProcess = "update"; // for upload process
                if (remove_content) {
                    result = await EmailSequence.findByIdAndUpdate({ _id: id }, { $pull: { content: { _id: content_id } } });
                } else if (addContent) {
                    // create or edit content
                    if (messageType == "delay" && !delay.match(/\d/)) throw new Error("Delay is required and must have number value.");
                    if (messageType == "sms" && !editorValue) throw new Error("SMS content is required.");
                    if (messageType == "email") {
                        if (!emailSubject) throw new Error("Email subject is required.");
                        else if (!editorValue) throw new Error("Email content is required.");
                    }

                    var params = { messageType: messageType };
                    if (delay) params.delay = delay;
                    if (emailSubject) params.emailSubject = emailSubject;
                    if (sender && atkn && asid) {
                        params.sender = sender;
                        params.atkn = atkn;
                        params.asid = asid;
                    }
                    if (editorValue) params.editorValue = editorValue;
                    if (content_id) { // id of content
                        // update content
                        result = await EmailSequence.findOneAndUpdate({ "content._id": content_id }, { $set: { "content.$": params } });
                    } else {
                        // create new content
                        result = await EmailSequence.findByIdAndUpdate({ _id: id }, { $push: { content: params } });
                    }
                } else {
                    if (removeData) {
                        // remove sequence
                        result = await EmailSequence.findById({ _id: id }).remove().exec();

                        queryProcess = "delete"; // for upload process
                    } else {
                        // edit the sequence name and sequence tag
                        if (!sequence_name) throw new Error("Sequence Name is required.");
                        else if (!sequence_tags) throw new Error("Sequence Tag is required.");
                        result = await EmailSequence.findByIdAndUpdate({ _id: id, }, { sequence_name, sequence_tags });
                    }
                }
            }

            var queryPayload = null;
            if (queryProcess == "create") {
                // create date to stats.productlistgenie.io
                queryPayload = { "query": "mutation($creatorID: String, $funnelSource: String, $sequence_name: String, $sequence_tags: String, $sequence_body: String){ addSequence(creatorID: $creatorID, funnelSource: $funnelSource, sequence_name: $sequence_name, sequence_tags: $sequence_tags, sequence_body: $sequence_body){ id sequence_tags } }", "variables": { creatorID: result.creator, funnelSource: result.funnelSource, sequence_name: result.sequence_name, sequence_tags: result.sequence_tags + "-" + result.creator } }
            } else if (queryProcess == "update") {
                // update data to stats.productlistgenie.io
                var queryPayloadData = await EmailSequence.findById({ _id: id }); // get updated data
                var sequence_body = [];
                var dataDelay = "0 second";
                queryPayloadData.content.forEach(el => {
                    if (el.messageType == "delay") dataDelay = el.delay;
                    var pushItem = null;
                    if (el.messageType == "email") {
                        pushItem = { domain: "", time: dataDelay, type: el.messageType, subject: el.emailSubject, content: el.editorValue, asid: "", atkn: "", phone: "" }
                    } else if (el.messageType == "sms") {
                        pushItem = { domain: "", time: dataDelay, type: el.messageType, subject: "", content: el.editorValue, asid: el.asid, atkn: el.atkn, phone: el.sender }
                    }
                    if (pushItem) sequence_body.push(pushItem);
                })
                queryPayload = { "query": "mutation($id: String, $funnelSource: String, $sequence_name: String, $sequence_tags: String, $sequence_body: String){ updateSequence(id: $id, funnelSource: $funnelSource, sequence_name: $sequence_name, sequence_tags: $sequence_tags, sequence_body: $sequence_body){ id sequence_tags } }", "variables": { id: queryPayloadData.return_sequence_id, funnelSource: queryPayloadData.funnelSource, sequence_name: queryPayloadData.sequence_name, sequence_tags: queryPayloadData.sequence_tags + "-" + queryPayloadData.creator, sequence_body: JSON.stringify(sequence_body) } }
            } else {
                // delete data to stats.productlistgenie.io
                queryPayload = { "query": "mutation($id: String){ deleteSequence(id: $id){ id sequence_tags } }", "variables": { id: return_sequence_id } }
            }

            // upload to stats.productlistgenie.io
            console.log(queryProcess + " data of email sequence in stats.productlistgenie.io");
            _points.customFetch('https://stats.productlistgenie.io/graphql', 'POST', queryPayload, uploadResult => {
                if (queryProcess == "create" && uploadResult && uploadResult.data.addSequence) {
                    EmailSequence.findByIdAndUpdate({ _id: result.id, }, { $set: { return_sequence_id: uploadResult.data.addSequence.id } }).then(res => console.log("Update return_sequence_id success."));
                }
            });
            return result;
        },

        saveEmailSequenceTemplate: async (root, { creator, funnelSource, sequence_name, sequence_tags, content }, { EmailSequence }) => {
            var templateContent = JSON.parse(content);
            var result = await new EmailSequence({
                creator,
                funnelSource,
                sequence_name,
                sequence_tags,
                content: templateContent
            }).save();

            // upload to stats.productlistgenie.io
            console.log("upload data of email sequence in stats.productlistgenie.io");
            var sequence_body = [];
            var dataDelay = "0 second";
            result.content.forEach(el => {
                if (el.messageType == "delay") dataDelay = el.delay;
                var pushItem = null;
                if (el.messageType == "email") {
                    pushItem = { domain: "", time: dataDelay, type: el.messageType, subject: el.emailSubject, content: el.editorValue, asid: "", atkn: "", phone: "" }
                } else if (el.messageType == "sms") {
                    pushItem = { domain: "", time: dataDelay, type: el.messageType, subject: "", content: el.editorValue, asid: el.asid, atkn: el.atkn, phone: el.sender }
                }
                if (pushItem) sequence_body.push(pushItem);
            })
            var queryPayload = {
                "query": "mutation($creatorID: String, $funnelSource: String, $sequence_name: String, $sequence_tags: String, $sequence_body: String){ addSequence(creatorID: $creatorID, funnelSource: $funnelSource, sequence_name: $sequence_name, sequence_tags: $sequence_tags, sequence_body: $sequence_body){ id sequence_tags } }", "variables": {
                    creatorID: result.creator,
                    funnelSource: result.funnelSource,
                    sequence_name: result.sequence_name,
                    sequence_tags: result.sequence_tags + "-" + result.creator,
                    sequence_body: JSON.stringify(sequence_body)
                }
            }
            _points.customFetch('https://stats.productlistgenie.io/graphql', 'POST', queryPayload, uploadResult => {
                if (uploadResult.errors) console.log(uploadResult.errors[0].message)
                if (uploadResult && uploadResult.data.addSequence) {
                    EmailSequence.findByIdAndUpdate({ _id: result.id, }, { $set: { return_sequence_id: uploadResult.data.addSequence.id } }).then(res => console.log("Update return_sequence_id success."));
                }
            });
            return result;
        },

        saveSplitPageData: async (root, { id, json, screenshotURL, action }, { FunnelGenie }) => {
            var result = null;
            if (action == "create") {
                result = await FunnelGenie.findByIdAndUpdate({ _id: id }, { $set: { split_design: json, split_screenshot: screenshotURL } });
            } else if (action == "remove") {
                result = await FunnelGenie.findByIdAndUpdate({ _id: id }, { $set: { split_design: "", split_screenshot: "" } });
            }
            return result;
        },

        updateSplitPage: async (root, { id, bias, split_notes }, { FunnelGenie }) => {
            var save = {};
            if (bias) save.split_bias = bias;
            if (split_notes) save.split_notes = split_notes;
            return await FunnelGenie.findByIdAndUpdate({ _id: id }, { $set: save });
        },

        // save mutation in want to get paid component
        savePaymentSettings: async (root, { id, business_email, business_name, account_number, wire_transfer_number, bank_code, routing_number, account_type, address }, { User }) => {
            var save = { id, business_email, business_name, account_number, wire_transfer_number, bank_code, routing_number, account_type, address };
            return await User.findByIdAndUpdate({ _id: id }, { $set: save });
        },

        disconnectFunnelDomain: async (root, { id, domain }, { User }) => {
            return await User.findByIdAndUpdate({ _id: id }, { $pull: { funnel_genie_domains: domain } });
        },

        saveFunnelProduct: async (root, { id, lastEditedByID, lastEditedByName, productName, productCost, productSku, productSrp, productDeliveryCost, productFivePercentDuty, affiliateEmail, fulfillmentCost, affiliateCost, yabazoo, prevFunnelDesign, funnelDesign, is_active }, { FunnelProducts }) => {
            var result = null
            if (id) {
                var query = { _id: id };
                // update funnel product by id
                var saveObject = {}
                if (funnelDesign) {
                    saveObject = { $push: { funnelDesign } }
                } else if (prevFunnelDesign) {
                    query.funnelDesign = prevFunnelDesign;
                    saveObject = { $set: { funnelDesign } };
                } else if (typeof is_active != "undefined") {
                    saveObject = { $set: { is_active } };
                } else {
                    saveObject = { $set: { lastEditedByID, lastEditedByName, productName, productCost, productSku, productSrp, productDeliveryCost, productFivePercentDuty, affiliateEmail, fulfillmentCost, affiliateCost, yabazoo } }
                }
                result = await FunnelProducts.findByIdAndUpdate(query, saveObject);
            } else {
                // create new funnel product
                result = await new FunnelProducts({ lastEditedByID, lastEditedByName, productName, productCost, productSku, productSrp, productDeliveryCost, productFivePercentDuty, affiliateEmail, fulfillmentCost, affiliateCost, yabazoo, quantity: 0 }).save();
            }
            return result;
        },

        deleteFunnelProduct: async (root, { id, funnelDesign }, { FunnelProducts }) => {
            if (funnelDesign) {
                return await FunnelProducts.findByIdAndUpdate({ _id: id }, { $pull: { funnelDesign } });
            } else {
                return await FunnelProducts.findById({ _id: id }).remove().exec();
            }
        },

        saveDesignOrGroupName: async (root, { id, product_id, group_name, design }, { FunnelProductDesign, currentUser }) => {
            var result = null;
            if (id) { // update
                var save_object = {};
                if (group_name) save_object.$set = { design_name: group_name };
                if (design) {
                    var des = JSON.parse(design);
                    save_object.$push = {
                        design_list: {
                            path: des.path,
                            page_type: des.page_type,
                            design_string_object: design,
                            upload_by: currentUser.email
                        }
                    };
                }
                result = await FunnelProductDesign.findByIdAndUpdate({ _id: id }, save_object);
            } else { // create new
                if (!product_id) throw new Error("Product id is required to save new group name and design.");
                var save_object = { product_id, created_by: currentUser.email };
                if (group_name) save_object.design_name = group_name;
                if (design) {
                    var des = JSON.parse(design);
                    save_object.design_list = [{
                        path: des.path,
                        page_type: des.page_type,
                        design_string_object: design,
                        upload_by: currentUser.email
                    }]
                }
                result = await new FunnelProductDesign(save_object).save();
            }
            return result;
        },

        deleteDesignOrGroup: async (root, { id, design_id }, { FunnelProductDesign }) => {
            if (!design_id) {
                return await FunnelProductDesign.findById({ _id: id }).remove().exec();
            } else {
                return await FunnelProductDesign.findByIdAndUpdate({ _id: id }, { $pull: { design_list: { _id: design_id } } });
            }
        },

        savePurchaseOrder: async (root, { id, action, receiver_email, product_name, product_variant_id, payment_terms, affiliate_email, affiliate_budget, affiliate_commision, product_price, product_quantity, po_vendor, po_ship_to, po_note, product_srp, fulfillment_cost, delivery_cost, vat, yabazoo, additional_cost, warnWhenLow, warnEmail, confirmationEmail, warnQty, fromTransferPOID }, { User, PurchaseOrders, FunnelProducts }) => {
            if (action == "create") {
                var affiliate_name = "User Not Found.";
                const user = await User.findOne({ email: affiliate_email });
                if (user && user.firstName) affiliate_name = user.firstName + " " + user.lastName;
                const result = await new PurchaseOrders({ product_variant_id, payment_terms, affiliate_name, affiliate_email, affiliate_budget, affiliate_commision, product_price, product_quantity, vendor_info: po_vendor, ship_to_info: po_ship_to, note: po_note, product_srp, fulfillment_cost, delivery_cost, vat, yabazoo, additional_cost, warnWhenLow, warnEmail, confirmationEmail, warnQty, fromTransferPOID, isApproved: fromTransferPOID ? true : false }).save();
                if (fromTransferPOID) { // for removing some serial number (transfer) and update the saved order
                    const searchPurchaseOrder = await PurchaseOrders.findById({ _id: fromTransferPOID }), qtys = [];
                    const allProductInWarehouse = searchPurchaseOrder.product_quantity_list.filter(el => el.status == "warehouse");
                    for (var i = 1; i <= product_quantity; i++) {
                        const SerialNumber = allProductInWarehouse[allProductInWarehouse.length - i]._id;
                        await changeSerialNumberStatus(SerialNumber, "transfered");
                    }
                    for (var i = 0; i < product_quantity; i++) {
                        qtys.push({ _id: product_name.replace(/_/g, "") + "_" + result.id + "_" + _points.getFiveDigitNumber(i), status: "warehouse" });
                    }
                    await FunnelProducts.findByIdAndUpdate({ _id: mongoDBId.decode(product_variant_id) }, { $push: { po_ids: result.id } });
                    await PurchaseOrders.findByIdAndUpdate({ _id: result.id }, { $set: { receiver_email, product_quantity_list: qtys, received_date: Date.now() } });
                    await User.findOneAndUpdate({ email: affiliate_email }, { $inc: { investment_total: -affiliate_budget } });
                }
                return result;
            } else if (action == "accept") {
                const searchPurchaseOrder = await PurchaseOrders.findById({ _id: id });
                var qtys = [], qty = searchPurchaseOrder.product_quantity;
                for (var i = 0; i < qty; i++) {
                    qtys.push({ _id: product_name + _points.getFiveDigitNumber(i), status: "warehouse" });
                }
                var success = true;
                const result = await PurchaseOrders.findByIdAndUpdate({ _id: id }, { $set: { isApproved: true, receiver_email, received_date: Date.now(), product_quantity_list: qtys } }).catch(err => success = false);
                if (success) {
                    const variantID = mongoDBId.decode(searchPurchaseOrder.product_variant_id);
                    await FunnelProducts.findByIdAndUpdate({ _id: variantID }, { $push: { po_ids: searchPurchaseOrder._id } }).then(async res => {
                        // reduce investment_total
                        const user = await User.findOne({ email: searchPurchaseOrder.affiliate_email });
                        await User.findByIdAndUpdate({ _id: user.id }, { $inc: { investment_total: -searchPurchaseOrder.affiliate_budget } })
                    });
                } else console.error("An error has occurred while saving the purchase order.")
                return result;
            } else if (action == "denied") {
                return await PurchaseOrders.findById({ _id: id }).remove().exec();
            }
            return null;
        },

        deleteFunnelOrder: async (root, { id }, { FunnelGenieOrder }) => {
            return await FunnelGenieOrder.findById({ _id: id }).remove().exec();
        },

        changeItemStatus: async (root, { id, status }, { FunnelGenieOrder }) => {
            var result = null;
            id = id.split(",");
            for (var i = 0; i < id.length; i++) {
                const current_id = id[i];
                result = await changeSerialNumberStatus(current_id, status, true);
            }
            return result;
        },

        saveInvestment: async (root, { id, amount }, { User }) => {
            return await User.findByIdAndUpdate({ _id: id }, {
                $inc: {
                    investment_total: amount
                },
                $push: {
                    investment_list: {
                        amount,
                        date: Date.now()
                    }
                }
            });
        },

        assignSerialNumberToOrder: async (root, { id, qty, plg_sku }, { FunnelGenieOrder }) => {
            const serial_numbers = await getSerialNumbers(plg_sku, qty, id);
            const result = await FunnelGenieOrder.findByIdAndUpdate(id, { $set: { "line_items.plg_serialNumber": serial_numbers } })
            return result;
        },

        markAllAsPaid: async (root, { creator, updaterID, updaterName, fulfillerLocation, totalPayment, dateStart, dateEnd, isCommission }, { FunnelGenieOrder, User }) => {
            var orderQuery = { creator, order_status: 'delivered', merchant_type: 'cod', received_payment_from_courier: true };
            if (fulfillerLocation) {
                if (fulfillerLocation == "ALL") {
                    orderQuery["shipping_information.country"] = { $in: _points.cod_available_country("order_filter") };
                } else {
                    orderQuery["shipping_information.country"] = { $in: [fulfillerLocation, iso3to2[fulfillerLocation] ? iso3to2[fulfillerLocation] : fulfillerLocation] };
                }
            }
            if (dateStart && dateEnd) {
                const convertedDate = formatStartAndEndDate(dateStart, dateEnd, "markAllAsPaid");
                orderQuery.dateStatusDelivered = { $gte: convertedDate.start, $lte: convertedDate.end }
            }
            const creatorData = await User.findById({ _id: creator });
            const payload = {
                query: `query($id: String, $orderid: String, $merchant_type: String, $order_status: String, $funnel_name: String, $domainIndex: Int, $filterByStartDate: String, $filterByEndDate: String, $skip: Int, $limit: Int, $fulfillerLocation: String, $sortBy: String, $variantIDS: String, $serial_numbers: String, $isPaidCommision: Boolean, $cod_analytics: Boolean, $show_courier_collected: String){
                    getMyFunnelOrders(id: $id, orderid: $orderid, merchant_type: $merchant_type, order_status: $order_status, funnel_name: $funnel_name, domainIndex: $domainIndex, filterByStartDate: $filterByStartDate, filterByEndDate: $filterByEndDate, skip: $skip, limit: $limit, fulfillerLocation: $fulfillerLocation, sortBy: $sortBy, variantIDS: $variantIDS, serial_numbers: $serial_numbers, isPaidCommision: $isPaidCommision, cod_analytics: $cod_analytics, show_courier_collected: $show_courier_collected){
                        dateStatusDelivered
                        currencySymbol
                        count
                        shipping_information {
                            email
                        }
                        line_items {
                            title
                            price
                            convertedPrice
                            pcost
                            payoutPrice
                            quantity
                        }
                    }
                }`,
                variables: {
                    id: creator,
                    fulfillerLocation,
                    merchant_type: orderQuery.merchant_type,
                    order_status: orderQuery.order_status,
                    filterByStartDate: dateStart,
                    filterByEndDate: dateEnd,
                    skip: 0,
                    cod_analytics: true,
                    show_courier_collected: "collected"
                }
            }

            // TODO :: Sending from Mark as Paid
            const result = await new Promise(resolve => {

                _points.customFetch(_points.clientUrl + "/graphql", 'POST', payload, order_list => {
                    if (order_list) {
                        const marker = Date.now() + "_" + generateRandomString().substring(0, 13);
                        const dateRange = orderQuery.dateStatusDelivered.$gte.toDateString().substring(4) + " - " + orderQuery.dateStatusDelivered.$lte.toDateString().substring(4);
                        const emailContent = _points.payoutEmail(creatorData.firstName, `<strong>$${_points.commafy(_points.getTaxPercent(0.05, parseFloat(totalPayment)).toFixed(2))}</strong>`, dateRange, order_list.data.getMyFunnelOrders, marker);
                        const emailPayload = { to: (creatorData.business_email || creatorData.email) + ",tech@themillionairemastermind.com", from: "plg.payout@plg.com", subject: "You Just Got Paid!", text: emailContent, html: emailContent }
                        FunnelGenieOrder.updateMany(orderQuery, {
                            $set: {
                                restore_marker: marker,
                                order_status_update: Date.now(),
                                order_status: 'paid',
                                updateById: updaterID,
                                updateByName: "Payout: " + updaterName,
                            }
                        }).then(data => {
                            _points.customFetch(_points.clientUrl + '/send-error-email', 'POST', emailPayload, resPlgEmail => {
                            });
                            resolve(data);
                        });
                    } else {
                        resolve(null);
                    }
                });
            })
            return result;
        },

        markAllCommissionAsPaid: async (root, { serialNumbers, total_commission, start_date, end_date, commissioner_name }, { FunnelGenieOrder, currentUser }) => {
            if (!currentUser) throw new Error("Please reload the page.");
            const query = {
                "line_items.plg_serialNumber": {
                    $in: JSON.parse(serialNumbers)
                },
                order_status: {
                    $in: ["delivered", "paid"]
                },
                isPaidCommision: {
                    $in: [false, null]
                }
            };
            if (start_date && end_date) {
                const convertedDate = formatStartAndEndDate(start_date, end_date, "markAllCommissionAsPaid");
                query.dateStatusDelivered = { $gte: convertedDate.start, $lte: convertedDate.end };
            }
            const result = await FunnelGenieOrder.updateMany(query, { $set: { isPaidCommision: true, updateById: currentUser.id, updateByName: "Paid Commission: " + currentUser.firstName } });
            var content = "Name: " + commissioner_name + ", Total Commission: $" + total_commission + ", Date Range: " + start_date + " - " + end_date;
            const payload = { to: "tech@themillionairemastermind.com", from: "plg.payout@plg.com", subject: "Commission Paid!", text: content, html: content };
            _points.customFetch(_points.clientUrl + '/send-error-email', 'POST', payload, () => { });
            return result;
        },

        // start new mutation for optimize funnel
        duplicateFunnelGenie: async (root, { creator, funnel_id }, { FunnelList, FunnelPageList, User }) => { // duplicate funnel genie
            const totalFunnel = await FunnelList.countDocuments({ creator });
            const currentUser = await User.findById({ _id: creator }, { privilege: 1, access_tags: 1 }).lean();
            let fr = _points.funnelRestriction(currentUser, totalFunnel);
            if (fr.error) throw new Error("Maximum of " + fr.limit + " funnels per user.", "Maximum Funnel Reach.");

            const funnelData = await FunnelList.findById({ _id: funnel_id });
            const funnelPageData = await FunnelPageList.find({ funnel_id });
            const newFunnelName = _points.addCounterToPath(funnelData.funnel_name);
            const newFunnelData = { creator: funnelData.creator, domain_name: funnelData.domain_name, funnel_name: newFunnelName, funnel_use_email_confirmation: funnelData.funnel_use_email_confirmation, funnel_use_email_tracking: funnelData.funnel_use_email_tracking, funnel_use_email_abandonment: funnelData.funnel_use_email_abandonment, funnel_is_phone_whatsapp: funnelData.funnel_is_phone_whatsapp, funnel_enable_floating_bar: funnelData.funnel_enable_floating_bar, funnel_enable_floating_bar_link: funnelData.funnel_enable_floating_bar_link, funnel_phone: funnelData.funnel_phone, funnel_address: funnelData.funnel_address, funnel_email: funnelData.funnel_email, funnel_pixel_id: funnelData.funnel_pixel_id, funnel_favicon_link: funnelData.funnel_favicon_link, funnel_facebook_id: funnelData.funnel_facebook_id, funnel_facebook_access_token: funnelData.funnel_facebook_access_token, funnel_google_id: funnelData.funnel_google_id, funnel_tiktok_id: funnelData.funnel_tiktok_id, funnel_everflow: funnelData.funnel_everflow, funnel_snapchat_id: funnelData.funnel_snapchat_id, gateway_selected_merchant: funnelData.gateway_selected_merchant, gateway_stripe_public: funnelData.gateway_stripe_public, gateway_stripe_private: funnelData.gateway_stripe_private, gateway_other: funnelData.gateway_other, gateway_paypal_client_id: funnelData.gateway_paypal_client_id, integration_confirmation_email: funnelData.integration_confirmation_email, integration_abandonment_email: funnelData.integration_abandonment_email, integration_tracking_email: funnelData.integration_tracking_email, integration_onhold_email: funnelData.integration_onhold_email, is_cod_funnel: funnelData.is_cod_funnel, is_not_shareable: funnelData.is_not_shareable, is_fulfill_by_plg: funnelData.is_fulfill_by_plg, auto_generated_index: Date.now() };
            // start validate if already has funnel name like new funnel
            const isExist = await FunnelList.findOne({ creator, domain_name: newFunnelData.domain_name, funnel_name: newFunnelData.funnel_name }).lean().then(res => res ? true : false);
            if (isExist) throw new Error(_points.presentableFunnelName(newFunnelData.funnel_name + " is already exist."))
            // end validate if already has funnel name like new funnel
            var result = await new FunnelList(newFunnelData).save();
            const newFunnelPagesData = [];
            funnelPageData.forEach((el, index) => {
                newFunnelPagesData.push({ funnel_id: result.id, page_type: el.page_type, path: el.path, design: [{ date: Date.now(), json: el.design[el.design.length - 1].json.replace(new RegExp(funnelData.funnel_name + "\\/", "g"), newFunnelName + '/') }], split_design: el.split_design, split_bias: el.split_bias, split_screenshot: el.split_screenshot, split_notes: el.split_notes, page_is_root: el.page_is_root, page_enable_loader: el.page_enable_loader, page_selected_modal_action: el.page_selected_modal_action, page_title: el.page_title, page_description: el.page_description, page_og_image_link: el.page_og_image_link, page_keyword: el.page_keyword, funnel_header_analytics: el.funnel_header_analytics, funnel_footer_analytics: el.funnel_footer_analytics, auto_generated_index: Date.now().toString() + index })
            });
            result = await FunnelPageList.create(newFunnelPagesData); // if anything happens change .create to .insertMany
            return result;
        },

        removeFunnelGenie: async (root, { funnel_id }, { FunnelList, FunnelPageList }) => { // remove funnel genie
            const page_list = await FunnelPageList.find({ funnel_id });
            for (var index = 0; index < page_list.length; index++) {
                var data = page_list[index];
                if (data.published_page_id) {
                    if (data.remove) data.remove();
                    const payload = { "query": "mutation($id: String!){\n  deletePage(id: $id){\n    id\n   }\n}", "variables": { id: data.published_page_id } }
                    _points.customFetch(funnelserver, 'POST', payload, () => { });
                } else {
                    if (data.remove) data.remove();
                }
            }
            const result = await FunnelList.findById({ _id: funnel_id }).remove().exec();
            return result;
        },

        // update funnel genie settings
        updateFunnelGenieSetting: async (root, { funnel_id, funnel_name, funnel_currency, domain_name, funnel_use_email_confirmation, funnel_use_email_tracking, funnel_use_email_abandonment, funnel_is_phone_whatsapp, funnel_enable_floating_bar, funnel_enable_floating_bar_link, funnel_phone, funnel_address, funnel_email, funnel_favicon_link, funnel_facebook_id, funnel_facebook_access_token, funnel_google_id, funnel_tiktok_id, funnel_everflow, funnel_snapchat_id, gateway_selected_merchant, gateway_stripe_public, gateway_stripe_private, gateway_other, gateway_paypal_client_id, integration_confirmation_email, integration_abandonment_email, integration_tracking_email, integration_onhold_email, is_fulfill_by_plg }, { FunnelList, FunnelPageList }) => {
            if (!funnel_name) throw new Error("Funnel Name Required!")
            funnel_name = _points.encodeDomain(funnel_name);
            const updateObj = { funnel_id, funnel_name, funnel_currency, domain_name, funnel_use_email_confirmation, funnel_use_email_tracking, funnel_use_email_abandonment, funnel_is_phone_whatsapp, funnel_enable_floating_bar, funnel_enable_floating_bar_link, funnel_phone, funnel_address, funnel_email, funnel_favicon_link, funnel_facebook_id, funnel_facebook_access_token, funnel_google_id, funnel_tiktok_id, funnel_everflow, funnel_snapchat_id, gateway_selected_merchant, gateway_stripe_public, gateway_stripe_private, gateway_other, gateway_paypal_client_id, integration_confirmation_email, integration_abandonment_email, integration_tracking_email, integration_onhold_email, date_modified: Date.now(), is_fulfill_by_plg };
            const oldFunnelSetting = await FunnelList.findById({ _id: funnel_id });
            if (!is_fulfill_by_plg) { // for removing the product id/sku in the funnel pages
                const pages = await FunnelPageList.find({ funnel_id: oldFunnelSetting.id }, { design: 1, page_type: 1 }).lean();
                for (var i = 0; i < pages.length; i++) {
                    const current_page = pages[i];
                    const removed_plg_sku = current_page.design.map(el => {
                        // new removing sku manually by removing in inside json
                        let design = JSON.parse(el.json);
                        design = _points.removePLGSKUonDesign(design, current_page.page_type);
                        el.json = JSON.stringify(design);
                        return el;
                    });
                    await FunnelPageList.findByIdAndUpdate({ _id: current_page._id }, { $set: { design: removed_plg_sku } });
                }
            }
            var result = null;
            if (oldFunnelSetting.funnel_name != funnel_name || oldFunnelSetting.domain_name != domain_name) {
                const isAlreadyExist = await FunnelList.find({ creator: oldFunnelSetting.creator, funnel_name, domain_name }).then(res => res.length != 0 ? true : false);
                if (!isAlreadyExist) {
                    const pageList = await FunnelPageList.find({ funnel_id });
                    for (var i = 0; i < pageList.length; i++) {
                        const pd = pageList[i];
                        if (pd.published_page_id) {
                            const payload = { "query": "mutation($id: String!, $domain: String!, $path: String!){\n  updatePage(id: $id, domain: $domain, path: $path){\n    id\n   }\n}", "variables": { id: pd.published_page_id, domain: domain_name, path: funnel_name + (pd.path ? "/" + pd.path : "") } };
                            await new Promise(resolve => _points.customFetch(funnelserver, 'POST', payload, result => resolve(true)));
                        }
                    }
                    result = await FunnelList.findByIdAndUpdate({ _id: funnel_id }, { $set: updateObj });
                } else {
                    throw new Error('Cannot change domain because ' + domain_name + ' with funnel name of ' + funnel_name + '<br> is already exist.');
                }
            } else {
                result = await FunnelList.findByIdAndUpdate({ _id: funnel_id }, { $set: updateObj });
            }
            return result;
        },

        saveFunnelEmailSequenceV1: async (root, { id, funnel_id, creator, message_id, message_type, method, delay, email_subject, editor_value }, { Integration, FunnelEmailSequenceV1 }) => {
            var result = null;
            const integration = await Integration.findOne({ creator: creator, merchant_type: "twilio" });
            if (id) { // update only this document
                var data = { method, delay, editor_value, email_subject, };
                var payload = "";
                if (message_type == "SMS") {
                    if (!integration) throw new Error("Please add twilio in your Integration.");
                    payload = { payload: { "query": "mutation($id: String, $content: String, $delay: String, $sender: String, $asid: String, $atkn: String){\n  updateAbandonmentsms(id: $id, content: $content, delay: $delay, sender: $sender, asid: $asid, atkn: $atkn){\n    id\n   }\n}", "variables": { id: message_id, content: editor_value.replace(/<[^<|>]+?>|&nbsp;/gi, ''), delay, sender: integration.other, asid: integration.public_key, atkn: integration.private_key } } };
                } else {
                    payload = { payload: { "query": "mutation($id: String, $subject: String, $content: String, $delay: String){\n  updateAbandonmentemail(id: $id, subject: $subject, content: $content, delay: $delay){\n    id\n   }\n}", "variables": { id: message_id, subject: email_subject, content: editor_value, delay } } };
                }
                result = new Promise((resolve, reject) => {
                    _points.customFetch(_points.clientUrl + '/send-html-to-domain', 'POST', payload, res => {
                        if (!res) reject("Failed to save please try again.");
                        resolve(FunnelEmailSequenceV1.findByIdAndUpdate({ _id: id }, { $set: data }));
                    })
                })
            } else {
                if (message_type != "both") { // save 1 document
                    var payload = "";
                    if (message_type == "SMS") {
                        if (!integration) throw new Error("Please add twilio in your Integration.");
                        payload = { payload: { "query": "mutation($creator: String, $delay: String, $sender: String, $asid: String, $atkn: String){\n  addAbandonmentsms(creator: $creator, delay: $delay, sender: $sender, asid: $asid, atkn: $atkn){\n    id\n   }\n}", "variables": { creator, delay, sender: integration.other, asid: integration.public_key, atkn: integration.private_key } } }
                    } else {
                        payload = { payload: { "query": "mutation($creator: String, $delay: String){\n  addAbandonmentemail(creator: $creator, delay: $delay){\n    id\n   }\n}", "variables": { creator, delay } } };
                    }
                    result = new Promise((resolve, reject) => {
                        _points.customFetch(_points.clientUrl + '/send-html-to-domain', 'POST', payload, res => {
                            if (!res) reject("Failed to save please try again.");
                            resolve(
                                new FunnelEmailSequenceV1({
                                    creator,
                                    funnel_id,
                                    message_id: message_type == "SMS" ? res.data.addAbandonmentsms.id : res.data.addAbandonmentemail.id,
                                    message_type,
                                    method,
                                    delay
                                }).save()
                            );
                        })
                    })
                } else { // save template
                    var delays = JSON.parse(delay);
                    var emailSubjects = JSON.parse(email_subject);
                    var messages = JSON.parse(editor_value);
                    for (var index = 0; index < emailSubjects.length; index++) {
                        // process email
                        var current_subject = emailSubjects[index];
                        var current_email_delay = delays[index].email;
                        var current_email_message = messages[index].email;
                        var email_payload = { payload: { "query": "mutation($creator: String, $delay: String, $content: String, $subject: String){\n  addAbandonmentemail(creator: $creator, delay: $delay, content: $content, subject: $subject){\n    id\n   }\n}", "variables": { creator, subject: current_subject, content: current_email_message, delay: current_email_delay } } };
                        result = await new Promise((resolve, reject) => {
                            _points.customFetch(_points.clientUrl + '/send-html-to-domain', 'POST', email_payload, res => {
                                if (!res) reject("Failed to save please try again.");
                                resolve(
                                    new FunnelEmailSequenceV1({
                                        creator,
                                        funnel_id,
                                        message_id: res.data.addAbandonmentemail.id,
                                        message_type: "Email",
                                        method,
                                        delay: current_email_delay,
                                        editor_value: current_email_message,
                                        email_subject: current_subject,
                                    }).save()
                                );
                            })
                        });

                        if (integration) { // if has twillio integration
                            // process sms
                            var current_sms_delay = delays[index].sms;
                            var current_sms_message = messages[index].sms;
                            var sms_payload = { payload: { "query": "mutation($creator: String, $delay: String, $content: String){\n  addAbandonmentsms(creator: $creator, delay: $delay, content: $content){\n    id\n   }\n}", "variables": { creator, content: current_email_message, delay: current_email_delay, sender: integration.other, asid: integration.public_key, atkn: integration.private_key } } };
                            result = await new Promise((resolve, reject) => {
                                _points.customFetch(_points.clientUrl + '/send-html-to-domain', 'POST', sms_payload, res => {
                                    if (!res) reject("Failed to save please try again.");
                                    resolve(
                                        new FunnelEmailSequenceV1({
                                            creator,
                                            funnel_id,
                                            message_id: res.data.addAbandonmentsms.id,
                                            message_type: "SMS",
                                            method,
                                            delay: current_sms_delay,
                                            editor_value: current_sms_message
                                        }).save()
                                    );
                                })
                            });
                        }
                    }
                }
            }
            return result;
        },

        // save email sequence v2 template and normal sequence
        saveFunnelEmailSequenceV2: async (root, { id, creator, funnel_id, sequence_name, sequence_tags, content_id, content, delay, message_type, email_subject, asid, atkn, sender, editor_value, add_content, remove_content, remove_data, return_sequence_id }, { FunnelEmailSequenceV2 }) => {
            var result = null, queryProcess = "";
            if (id) { // update this document
                queryProcess = "update";
                if (remove_content) {
                    result = await FunnelEmailSequenceV2.findByIdAndUpdate({ _id: id }, { $pull: { content: { _id: content_id } } });
                } else if (add_content) {
                    // create or edit content
                    if (message_type == "delay" && !delay.match(/\d/)) throw new Error("Delay is required and must have number value.");
                    if (message_type == "sms" && !editor_value) throw new Error("SMS content is required.");
                    if (message_type == "email") {
                        if (!email_subject) throw new Error("Email subject is required.");
                        else if (!editor_value) throw new Error("Email content is required.");
                    }

                    var params = { message_type };
                    if (delay) params.delay = delay;
                    if (email_subject) params.email_subject = email_subject;
                    if (sender && atkn && asid) {
                        params.sender = sender;
                        params.atkn = atkn;
                        params.asid = asid;
                    }
                    if (editor_value) params.editor_value = editor_value;
                    if (content_id) { // id of content
                        // update content
                        result = await FunnelEmailSequenceV2.findOneAndUpdate({ "content._id": content_id }, { $set: { "content.$": params } });
                    } else {
                        // create new content
                        result = await FunnelEmailSequenceV2.findByIdAndUpdate({ _id: id }, { $push: { content: params } });
                    }
                } else {
                    if (remove_data) {
                        // remove sequence
                        result = await FunnelEmailSequenceV2.findById({ _id: id }).remove().exec();
                        queryProcess = "delete"; // for upload process
                    } else {
                        // edit the sequence name and sequence tag
                        if (!sequence_name) throw new Error("Sequence Name is required.");
                        else if (!sequence_tags) throw new Error("Sequence Tag is required.");
                        result = await FunnelEmailSequenceV2.findByIdAndUpdate({ _id: id, }, { sequence_name, sequence_tags });
                    }
                }
            } else { // create document
                if (!sequence_name) throw new Error("Sequence Name is required.");
                else if (!sequence_tags) throw new Error("Sequence Tag is required.");
                const saveData = { creator, funnel_id, sequence_name, sequence_tags };
                if (content) saveData.content = JSON.parse(content);
                result = await new FunnelEmailSequenceV2(saveData).save();
                queryProcess = "create"; // for upload process
            }

            var queryPayload = null;
            if (queryProcess == "create") {
                // create data to stats.productlistgenie.io
                queryPayload = { "query": "mutation($creatorID: String, $funnelSource: String, $sequence_name: String, $sequence_tags: String, $sequence_body: String){ addSequence(creatorID: $creatorID, funnelSource: $funnelSource, sequence_name: $sequence_name, sequence_tags: $sequence_tags, sequence_body: $sequence_body){ id sequence_tags } }", "variables": { creatorID: result.creator, funnelSource: result.funnel_id, sequence_name: result.sequence_name, sequence_tags: result.sequence_tags + "-" + result.creator } }
            } else if (queryProcess == "update") {
                // update data to stats.productlistgenie.io
                const queryPayloadData = await FunnelEmailSequenceV2.findById({ _id: id }); // get updated data
                var sequence_body = [], dataDelay = "0 second";
                queryPayloadData.content.forEach(el => {
                    if (el.message_type == "delay") dataDelay = el.delay;
                    var pushItem = null;
                    if (el.message_type == "email") {
                        pushItem = { domain: "", time: dataDelay, type: el.message_type, subject: el.email_subject, content: el.editor_value, asid: "", atkn: "", phone: "" }
                    } else if (el.message_type == "sms") {
                        pushItem = { domain: "", time: dataDelay, type: el.message_type, subject: "", content: el.editor_value, asid: el.asid, atkn: el.atkn, phone: el.sender }
                    }
                    if (pushItem) sequence_body.push(pushItem);
                });
                queryPayload = { "query": "mutation($id: String, $funnelSource: String, $sequence_name: String, $sequence_tags: String, $sequence_body: String){ updateSequence(id: $id, funnelSource: $funnelSource, sequence_name: $sequence_name, sequence_tags: $sequence_tags, sequence_body: $sequence_body){ id sequence_tags } }", "variables": { id: queryPayloadData.return_sequence_id, funnelSource: queryPayloadData.funnel_id, sequence_name: queryPayloadData.sequence_name, sequence_tags: queryPayloadData.sequence_tags + "-" + queryPayloadData.creator, sequence_body: JSON.stringify(sequence_body) } }
            } else {
                // delete data to stats.productlistgenie.io
                queryPayload = { "query": "mutation($id: String){ deleteSequence(id: $id){ id sequence_tags } }", "variables": { id: return_sequence_id } }
            }

            // upload to stats.productlistgenie.io
            _points.customFetch('https://stats.productlistgenie.io/graphql', 'POST', queryPayload, uploadResult => {
                if (queryProcess == "create" && uploadResult && uploadResult.data.addSequence) {
                    FunnelEmailSequenceV2.findByIdAndUpdate({ _id: result.id, }, { $set: { return_sequence_id: uploadResult.data.addSequence.id } }).then(res => console.log("Update return_sequence_id success."));
                }
            });

            return result;
        },

        saveFunnelEmailSequenceV2Order: async (root, { content_orders }, { FunnelEmailSequenceV2 }) => {
            content_orders = JSON.parse(content_orders);
            let result = null;
            for (let i = 0; i < content_orders.length; i++) {
                let data = content_orders[i];
                result = await FunnelEmailSequenceV2.findOneAndUpdate({ "content._id": data.id }, { $set: { "content.$.order": data.order } });
            }
            return result;
        },

        saveFunnelDomain: async (root, { id, domain_or_subdomain, selected_funnel_id }, { User, FunnelList, FunnelPageList }) => {
            if (!domain_or_subdomain) throw new Error("Domain Name is required");
            let is_illegal = _points.checkIllegalWords(domain_or_subdomain);
            if (is_illegal) throw new Error("Please try again");
            let new_url = npm_url.parse("https://" + domain_or_subdomain);
            if (new_url.host.split('.').length === 3 && new_url.host.split('.')[0].length > 14) throw new Error("Must not exceed 14 characters");
            let result = null, user = await User.find({ funnel_genie_domains: domain_or_subdomain });
            if (user.length == 0) { // no existing same domain
                const userData = await User.findById({ _id: id }, { funnel_genie_domains: 1, access_tags: 1 });
                const check_domain = _points.checkFreeDomain(userData.funnel_genie_domains), isPLGio = domain_or_subdomain.includes(".productlistgenie.io"), isYalaGenie = domain_or_subdomain.includes(".yalagenie.com");
                if ((isPLGio || isYalaGenie) && (check_domain.plgio || check_domain.yg)) { // save free plg domain
                    result = await User.findByIdAndUpdate({ _id: id }, { $push: { funnel_genie_domains: domain_or_subdomain } });
                } else { // validate if domain is set up correctly
                    var isOk = false;
                    result = await new Promise((resolve, reject) => {
                        let freeDomain = userData.access_tags.includes("free_domain");
                        if (!freeDomain && (isPLGio || isYalaGenie)) reject("Only one subdomain is allowed under productlistgenie.io or yalagenie.com");
                        else {
                            var payload = { url: domain_or_subdomain };
                            _points.customFetch(_points.clientUrl + "/checkDomain", "POST", payload, res => {
                                if (res && res.status == "success") {
                                    User.findByIdAndUpdate({ _id: id }, { $push: { funnel_genie_domains: domain_or_subdomain } }).then(data => {
                                        isOk = true;
                                        resolve(data);
                                    })
                                } else {
                                    reject(res.message);
                                }
                            });
                        }
                    });

                    // start auto select the added domain if from funnel setting
                    if (selected_funnel_id && isOk) {
                        const page_list = await FunnelPageList.find({ funnel_id: selected_funnel_id });
                        for (var i = 0; i < page_list.length; i++) {
                            const pd = page_list[i];
                            if (pd.published_page_id) {
                                const payload = { "query": "mutation($id: String!, $domain: String!){\n  updatePage(id: $id, domain: $domain){\n    id\n   }\n}", "variables": { id: pd.published_page_id, domain: domain_or_subdomain } };
                                await new Promise(resolve => _points.customFetch(funnelserver, 'POST', payload, result => resolve(true)));
                            }
                        }
                        result = await FunnelList.findByIdAndUpdate({ _id: selected_funnel_id }, { $set: { domain_name: domain_or_subdomain } });
                    }
                    // end auto select the added domain if from funnel setting
                }
            } else {
                try {
                    throw new Error("<span>\"" + domain_or_subdomain.replace(".productlistgenie.io", "") + "\"</span> Already Exist.");
                } catch (err) {
                    console.error("Error in saveFunnelDomain else ==>", err);
                }
            }
            return result;
        },

        saveFunnelList: async (root, { creator, funnel_name, domain_name, funnel_type, customLegalPageId, customCss }, { User, FunnelList, FunnelPageList }) => {
            // start validation for creating funnel
            // * Reconstruct to html value cells [1],  column[0]
            const isExist = await FunnelList.findOne({ creator, domain_name, funnel_name }).lean().then(res => res ? true : false);
            const totalFunnel = await FunnelList.countDocuments({ creator });
            const currentUser = await User.findById({ _id: creator }, { privilege: 1, access_tags: 1 }).lean();
            let fr = _points.funnelRestriction(currentUser, totalFunnel);
            if (!funnel_name) throw new Error("Funnel Name is required.");
            if (isExist) throw new Error("<span>\"" + _points.presentableFunnelName(funnel_name) + "\"</span> Already Exist.");
            if (fr.error) throw new Error("You have reach the <span>maximum limit</span> for your account please upgrade to continue.");
            // end validation for creating funnel
            var result = await new FunnelList({ creator, funnel_name, domain_name, funnel_type, auto_generated_index: Date.now() }).save();

            let mergeLegalPage = null;
            if (customLegalPageId) {
                console.log(customLegalPageId, "saveFunnelListsaveFunnelList");
                // * get the selected to merge the legal page
                const query = { funnel_id: customLegalPageId };
                const funnel = await FunnelList.findById({ _id: customLegalPageId }, { funnel_name: 1, domain_name: 1, _id: 0 }).lean();
                const pageList = await FunnelPageList.find(query).then(res => {
                    res = res.map(el => {
                        el.funnel_name = funnel.funnel_name;
                        el.domain_name = funnel.domain_name;
                        el.funnel_email = funnel.funnel_email;
                        el.funnel_address = funnel.funnel_address;
                        el.funnel_phone = funnel.funnel_phone;

                        return el;
                    });
                    return res;
                })
                mergeLegalPage = pageList;
                // extract the generated_pages
                /**
                 * get path , page_type, design
                 */



                // console.log("mergeLegalPagemergeLegalPage ======> \n ",mergeLegalPage, "mergeLegalPagemergeLegalPage")
            }
            // create multiple default pages
            const pageList = [
                {
                    funnel_id: result.id,
                    path: "",
                    design: [{
                        date: Date.now(),
                        json: _pageTemplate.homepages[0].design
                    }]
                },
                // * custom page 
                ...(customLegalPageId ? mergeLegalPage.filter(item => item.page_type === "generated_page").map(res => {
                    let customDesign = res.design.sort(function (a, b) {
                        return parseInt(b.date) - parseInt(a.date);
                    }).map(item => {
                        let shop_name_regex = new RegExp(`${res.domain_name}`);
                        let shop_address_regex = new RegExp(`${res.funnel_address}`);
                        let shop_email_regex = new RegExp(`${res.funnel_email}`);
                        let shop_phone_regex = new RegExp(`${res.funnel_phone}`);

                        console.log(`${res.domain_name}`,
                            `${res.funnel_address}`,
                            `${res.funnel_email}`)

                        let jsonItem = item.json
                            .replace(shop_name_regex, "[shop_name]")
                            .replace(shop_address_regex, "[shop_address]")
                            .replace(shop_phone_regex, "[shop_phone]")
                            .replace(shop_email_regex, "[shop_email]").toString();


                        jsonItem = JSON.parse(item.json);
                        console.log(jsonItem.counters);
                        // if counters does not have u_content_html
                        let counters = jsonItem.counters;

                        if (!Object.keys(counters).includes("u_content_html") && customCss) {
                            jsonItem.counters["u_content_html"] = 1;
                            console.log(jsonItem, customCss);
                            jsonItem.body.rows[0].columns[0].contents.splice(0, 0, {
                                "type": "html",
                                "values": {
                                    "containerPadding": "10px",
                                    "_meta": {
                                        "htmlID": "u_content_html_1",
                                        "htmlClassNames": "u_content_html"
                                    },
                                    "selectable": true,
                                    "draggable": true,
                                    "deletable": true,
                                    "html": `<style> ${customCss} </style>`
                                }
                            });
                        } else {
                            jsonItem.counters["u_content_html"] = jsonItem.counters["u_content_html"] + 1;
                            console.log(jsonItem, customCss);
                            jsonItem.body.rows[0].columns[0].contents.splice(0, 0, {
                                "type": "html",
                                "values": {
                                    "containerPadding": "10px",
                                    "_meta": {
                                        "htmlID": `u_content_html_${jsonItem.counters["u_content_html"]}`,
                                        "htmlClassNames": "u_content_html"
                                    },
                                    "selectable": true,
                                    "draggable": true,
                                    "deletable": true,
                                    "html": `<style> ${customCss} </style>`
                                }
                            });
                        }

                        return {
                            date: Date.now(),
                            json: JSON.stringify(jsonItem)
                        }
                    });
                    return {
                        funnel_id: result.id,
                        path: res.path,
                        page_type: "generated_page",
                        design: [customDesign[0]]
                    }
                }) : [
                    {
                        funnel_id: result.id,
                        page_type: "generated_page",
                        path: "terms-of-service",
                        design: [{
                            date: Date.now(),
                            json: _pageTemplate.terms_of_service
                        }]
                    },
                    {
                        funnel_id: result.id,
                        page_type: "generated_page",
                        path: "privacy-policy",
                        design: [{
                            date: Date.now(),
                            json: _pageTemplate.privacy_policy
                        }]
                    },
                    {
                        funnel_id: result.id,
                        page_type: "generated_page",
                        path: "refund-policy",
                        design: [{
                            date: Date.now(),
                            json: _pageTemplate.refund_policy
                        }]
                    },
                    {
                        funnel_id: result.id,
                        page_type: "generated_page",
                        path: "faqs",
                        design: [{
                            date: Date.now(),
                            json: _pageTemplate.faqs
                        }]
                    },
                    {
                        funnel_id: result.id,
                        page_type: "generated_page",
                        path: "contact-us",
                        design: [{
                            date: Date.now(),
                            json: _pageTemplate.contact_us
                        }]
                    }
                ])

            ];
            await FunnelPageList.create(pageList); // if anything happens change .create to .insertMany
            return result;
        },

        pushToFunnelList: async (root, { creator, domain_name, funnel_name, funnel_templates, is_cod, is_not_shareable, is_fulfill_by_plg }, { User, FunnelList, FunnelPageList, FunnelProductDesign }) => {
            // start validation for creating funnel
            const isExist = await FunnelList.findOne({ creator, domain_name, funnel_name }).lean().then(res => res ? true : false);
            const totalFunnel = await FunnelList.countDocuments({ creator });
            const currentUser = await User.findById({ _id: creator }, { privilege: 1, access_tags: 1 }).lean();
            let fr = _points.funnelRestriction(currentUser, totalFunnel);
            if (!funnel_name) throw new Error("Funnel Name is required.");
            if (isExist) throw new Error("\"" + _points.presentableFunnelName(funnel_name) + "\" Already Exist.");
            if (fr.error) throw new Error("You have reach the maximum limit for your account please upgrade to continue.");
            if (!funnel_templates) throw new Error("Product design id is required");
            // end validation for creating funnel

            const result = new Promise(async (resolve, reject) => {
                // funnel_templates = "wbpp7uk5GtaG3UAn"; // uncomment this line for testing
                if (funnel_templates.includes("productlistgenie.com")) {
                    _points.customFetch(funnel_templates, "GET", null, data => {
                        if (data) {
                            is_fulfill_by_plg = false;
                            uploadDesign(data)
                        } else {
                            reject("Error fetching design please try again.");
                        }
                    })
                } else {
                    // parsing for saved json in cod product list
                    var decodeID = mongoDBId.decode(funnel_templates.trim());
                    FunnelProductDesign.findById({ _id: decodeID }).then(res => {
                        if (res) {
                            var design = [];
                            res.design_list.forEach(el => {
                                var xx = JSON.parse(el.design_string_object);
                                xx.design = [{ json: xx.design }];
                                design.push(xx);
                            });
                            uploadDesign(design);
                        } else {
                            // old push to funnel single cod funnel design (for handling the old sku)
                            FunnelProducts.findById({ _id: decodeID }).then(res => {
                                if (res) {
                                    var design = [];
                                    res.funnelDesign.forEach(el => {
                                        el = JSON.parse(el);
                                        el.design = [{ json: el.design }]
                                        design.push(el);
                                    })
                                    uploadDesign(design);
                                } else {
                                    reject("Invalid COD Product ID.");
                                }
                            });
                        }
                    });
                }
                async function uploadDesign(data) {
                    if (data) {
                        const createdFunnel = await new FunnelList({ creator, funnel_name, domain_name, funnel_type: 'ecom', auto_generated_index: Date.now(), is_cod_funnel: is_cod, is_not_shareable, is_fulfill_by_plg }).save();
                        var funnelTemplate = data.map(el => {
                            try {
                                el.design[0].json = JSON.stringify(el.design[0].json).replace(/\[funnel_name\]/g, funnel_name).replace(/\[date\]/g, Date.now());
                            } catch (err) {
                                console.error("Error in uploadDesign ==>", err);
                            }
                            el.design[0].date = Date.now();
                            el.funnel_id = createdFunnel.id;
                            delete el.creator; // hindi na ginagamit sa bagong funnel
                            delete el.domainIndex; // hindi na ginagamit sa bagong funnel
                            delete el.funnel_name; // hindi na ginagamit sa bagong funnel
                            delete el.funnel_type; // hindi na ginagamit sa bagong funnel
                            return el;
                        });
                        funnelTemplate.push(
                            { funnel_id: createdFunnel.id, page_type: "generated_page", path: "terms-of-service", design: [{ date: Date.now(), json: _pageTemplate.terms_of_service }] },
                            { funnel_id: createdFunnel.id, page_type: "generated_page", path: "privacy-policy", design: [{ date: Date.now(), json: _pageTemplate.privacy_policy }] },
                            { funnel_id: createdFunnel.id, page_type: "generated_page", path: "refund-policy", design: [{ date: Date.now(), json: _pageTemplate.refund_policy }] },
                            { funnel_id: createdFunnel.id, page_type: "generated_page", path: "faqs", design: [{ date: Date.now(), json: _pageTemplate.faqs }] },
                            { funnel_id: createdFunnel.id, page_type: "generated_page", path: "contact-us", design: [{ date: Date.now(), json: _pageTemplate.contact_us }] }
                        )
                        if (!is_fulfill_by_plg) {
                            // for removing the product id/sku in the funnel pages
                            funnelTemplate = funnelTemplate.map(el => {
                                // new removing sku manually by removing in inside json
                                let design = JSON.parse(el.design[0].json);
                                design = _points.removePLGSKUonDesign(design, el.page_type);
                                el.design[0].json = JSON.stringify(design);
                                return el;
                            })
                        }
                        FunnelPageList.create(funnelTemplate).then(res => resolve({ id: createdFunnel.id })); // if anything happens change .create to .insertMany
                    } else {
                        reject("Error fetching design please try again.");
                    }
                }
            });
            return result;
        },

        saveSharedFunnelList: async (root, { funnel_id, creator, domain_name, funnel_name, selected_page_ids }, { User, FunnelList, FunnelPageList }) => { // saved shared funnel genie
            // start validation for creating funnel
            const isExist = await FunnelList.findOne({ creator, domain_name, funnel_name }).lean().then(res => res ? true : false);
            const totalFunnel = await FunnelList.countDocuments({ creator });
            const currentUser = await User.findById({ _id: creator }, { privilege: 1, access_tags: 1 }).lean();
            let fr = _points.funnelRestriction(currentUser, totalFunnel);
            if (!funnel_name) throw new Error("Funnel Name is required.");
            if (fr.error) throw new Error("You have reach the maximum limit for your account please upgrade to continue.");
            if (isExist) throw new Error("\"" + _points.presentableFunnelName(funnel_name) + "\" Already Exist.");
            // end validation for creating funnel

            selected_page_ids = JSON.parse(selected_page_ids)
            const copyFromFunnel = await FunnelList.findById({ _id: funnel_id }, { funnel_type: 1, is_cod_funnel: 1, is_not_shareable: 1, is_fulfill_by_plg: 1, _id: 0 }).lean();
            const pageList = await FunnelPageList.find({ _id: { $in: selected_page_ids } }, { design: { $slice: -1 } }).lean();
            var result = await new FunnelList({ creator, domain_name, funnel_name, funnel_type: copyFromFunnel.funnel_type, auto_generated_index: Date.now(), is_cod_funnel: copyFromFunnel.is_cod_funnel, is_not_shareable: copyFromFunnel.is_not_shareable, is_fulfill_by_plg: copyFromFunnel.is_fulfill_by_plg }).save();
            const savePages = [];
            pageList.forEach(page => {
                savePages.push({
                    funnel_id: result.id,
                    page_type: page.page_type,
                    path: page.path,
                    design: [{
                        date: Date.now(),
                        json: page.design[0].json
                    }]
                });
            })
            return await FunnelPageList.create(savePages); // if anything happens change .create to .insertMany
        },

        setFunnelPageAsRoot: async (root, { funnel_id, page_id }, { FunnelList, FunnelPageList }) => { // set funnel genie page as aroot
            const funnel_data = await FunnelList.findById({ _id: funnel_id }, { funnel_name: 1, domain_name: 1, _id: 0 }).lean();
            const page_data = await FunnelPageList.findById({ _id: page_id }).lean();
            if (!page_data.published_page_id) throw new Error("Please publish this page first.");
            const result = new Promise((resolve, reject) => {
                const payload = { "query": "query{\n  everyPage(domain: \"" + funnel_data.domain_name + "\", path: null){\n    id\n    domain\n    path\n    param1\n   }\n}", "variables": null };
                _points.customFetch(funnelserver, 'POST', payload, gql_result => {

                    if (gql_result && gql_result.data.everyPage) {
                        if (gql_result.data.everyPage.length != 0) {
                            // update the result and the current page
                            gql_result.data.everyPage.forEach(data => {
                                const payload2 = { "query": "mutation{\n  updatePage(id: \"" + data.id + "\", param1: null, path: \"" + data.param1 + "\"){\n    id\n   }\n}", "variables": null }
                                _points.customFetch(funnelserver, 'POST', payload2, gql_result2 => {

                                    var gql_path = funnel_data.funnel_name + (page_data.path ? '/' + page_data.path : '');
                                    const payload3 = { "query": "mutation{\n  updatePage(id: \"" + page_data.published_page_id + "\", param1: \"" + gql_path + "\", path: null){\n    id\n   }\n}", "variables": null }
                                    _points.customFetch(funnelserver, 'POST', payload3, gql_result3 => {

                                        // update all pages in this funnel as root false
                                        FunnelPageList.updateMany({ funnel_id, page_is_root: true }, { page_is_root: false }).then(res2 => {
                                            // make this page as domain root
                                            FunnelPageList.findByIdAndUpdate({ _id: page_id }, { page_is_root: true }).then(res3 => {
                                                resolve(res3);
                                            })
                                        })
                                    });
                                });
                            })
                        } else {
                            // normal save as default
                            var gql_path = funnel_data.funnel_name + (page_data.path ? '/' + page_data.path : '');
                            const payload2 = { "query": "mutation{\n  updatePage(id: \"" + page_data.published_page_id + "\", param1: \"" + gql_path + "\", path: null){\n    id\n   }\n}", "variables": null }
                            _points.customFetch(funnelserver, 'POST', payload2, gql_result2 => {
                                // update all pages in this funnel as root false
                                FunnelPageList.updateMany({ funnel_id, page_is_root: true }, { page_is_root: false }).then(res2 => {
                                    // make this page as domain root
                                    FunnelPageList.findByIdAndUpdate({ _id: page_id }, { page_is_root: true }).then(res3 => {
                                        resolve(res3);
                                    })
                                })
                            });
                        }
                    } else {
                        reject("Please try again.")
                    }
                })
            });
            return result;
        },

        //May12
        removeFunnelPageAsRoot: async (root, { funnel_id, page_id }, { FunnelList, FunnelPageList }) => { // set funnel genie page as aroot
            const funnel_data = await FunnelList.findById({ _id: funnel_id }, { funnel_name: 1, domain_name: 1, _id: 0 }).lean();
            const page_data = await FunnelPageList.findById({ _id: page_id }).lean();
            if (!page_data.published_page_id) throw new Error("Please publish this page first.");
            const result = new Promise((resolve, reject) => {
                const payload = { "query": "query{\n  everyPage(domain: \"" + funnel_data.domain_name + "\", path: null){\n    id\n    domain\n    path\n    param1\n   }\n}", "variables": null };
                _points.customFetch(funnelserver, 'POST', payload, gql_result => {
                    if (gql_result && gql_result.data.everyPage) {
                        if (gql_result.data.everyPage.length != 0) {
                            // update the result and the current page
                            gql_result.data.everyPage.forEach(data => {
                                const payload2 = { "query": "mutation{\n  updatePage(id: \"" + data.id + "\", param1: null, path: \"" + data.param1 + "\"){\n    id\n   }\n}", "variables": null }
                                _points.customFetch(funnelserver, 'POST', payload2, gql_result2 => {

                                    var gql_path = funnel_data.funnel_name + (page_data.path ? '/' + page_data.path : '');
                                    const payload3 = { "query": "mutation{\n  updatePage(id: \"" + page_data.published_page_id + "\", param1: null, path: \"" + data.param1 + "\"){\n    id\n   }\n}", "variables": null }
                                    _points.customFetch(funnelserver, 'POST', payload3, gql_result3 => {
                                        // update all pages in this funnel as root false

                                        FunnelPageList.updateMany({ funnel_id, page_is_root: true }, { page_is_root: false }).then(res2 => {
                                            // make this page as domain root // REMOVE
                                            FunnelPageList.findByIdAndUpdate({ _id: page_id }, { page_is_root: false }).then(res3 => {
                                                resolve(res3);
                                            })
                                        })
                                    });
                                });
                            })
                        } else {
                            // normal save as default
                            var gql_path = funnel_data.funnel_name + (page_data.path ? '/' + page_data.path : '');
                            const payload2 = { "query": "mutation{\n  updatePage(id: \"" + page_data.published_page_id + "\", param1: \"" + gql_path + "\", path: null){\n    id\n   }\n}", "variables": null }
                            _points.customFetch(funnelserver, 'POST', payload2, gql_result2 => {
                                // update all pages in this funnel as root false
                                FunnelPageList.updateMany({ funnel_id, page_is_root: true }, { page_is_root: false }).then(res2 => {
                                    // make this page as domain root
                                    FunnelPageList.findByIdAndUpdate({ _id: page_id }, { page_is_root: false }).then(res3 => {
                                        resolve(res3);
                                    })
                                })
                            });
                        }
                    } else {
                        reject("Please try again.")
                    }
                })
            });
            return result;
        },

        saveFunnelPageList: async (root, { funnel_id, creator, page_type, path, design, design_page_id }, { User, FunnelPageList }) => { // create new funnel genie page
            if (design_page_id && design == "copy") { // for duplicate and copy page to other funnel
                const design_from_source = await FunnelPageList.findById({ _id: design_page_id }, { design: { $slice: -1 } }).lean();
                design = design_from_source.design[0].json;
            }
            // start validation for creating page
            const isExist = await FunnelPageList.findOne({ funnel_id, path }).lean().then(res => res ? true : false);
            const totalPage = await FunnelPageList.countDocuments({ funnel_id });
            const currentUser = await User.findById({ _id: creator }, { privilege: 1, access_tags: 1 }).lean();
            let fr = _points.funnelRestriction(currentUser, totalPage, true);
            if (fr.error) throw new Error("You have reach the maximum limit of pages for that funnel.");
            if (isExist) throw new Error("\"" + _points.presentableFunnelName(path ? path : "Homepage") + "\" Already Exist.");
            if (!design) throw new Error("Design is required.");
            // end validation for creating funnel

            const result = await new FunnelPageList({ funnel_id, page_type, path, design: [{ date: Date.now(), json: design }] }).save();
            return result;
        },

        removeFunnelGeniePage: async (root, { page_id }, { FunnelPageList }) => {
            const result = await FunnelPageList.findById({ _id: page_id });
            if (result.split_design) {
                await new Promise((resolve, reject) => {
                    var payload1 = { "query": "{ page(id:\"" + result.published_page_id + "\"){ html2 html } }", "variables": null, "operationName": null }
                    _points.customFetch(funnelserver, 'POST', payload1, res1 => {
                        if (res1) {
                            var payload2 = {
                                "query": "mutation($id: String, $html: String, $html2: String, $bias: Int){ updatePage(id: $id, html: $html, html2: $html2, bias: $bias){ id } }",
                                "variables": {
                                    id: result.published_page_id,
                                    html: res1.data.page.html2,
                                    html2: "",
                                    bias: null
                                }
                            }
                            _points.customFetch(funnelserver, 'POST', payload2, res2 => {
                                if (res2 && res2) {
                                    // trasnfer page B to page A
                                    FunnelPageList.findByIdAndUpdate({ _id: page_id }, {
                                        $set: {
                                            design: [{
                                                date: Date.now(),
                                                json: result.split_design,
                                                screenshot_url: result.split_screenshot
                                            }],
                                            split_design: ""
                                        }
                                    }).then(update_result => {
                                        resolve(update_result)
                                    });
                                } else {
                                    reject("Error updating the funnel genie server.");
                                }
                            })
                        } else {
                            reject("Error getting html2 for updating the funnel genie server.");
                        }
                    });
                });
            } else {
                if (result.published_page_id) {
                    result.remove();
                    // remove also the uploaded one
                    const payload = { "query": "mutation($id: String!){ deletePage(id: $id){ id } }", "variables": { id: result.published_page_id } }
                    _points.customFetch(funnelserver, 'POST', payload, () => { });
                } else {
                    result.remove();
                }
            }
            return result;
        },

        // update funnel genie page settings and update when save or save and publish
        updateFunnelPageList: async (root, { funnel_id, page_id, page_type, path, page_title, page_description, page_og_image_link, page_keyword, funnel_header_analytics, funnel_footer_analytics, published_page_id, is_publish, page_enable_loader, page_selected_modal_action, design_json, design_screenshot, is_split_edit, source }, { FunnelList, FunnelPageList }) => {
            var updateObject = {};
            if (source == "settings") {
                const page_data = await FunnelPageList.findById({ _id: page_id }, { path: 1, _id: 0 }).lean();
                if (page_data.path != path) {
                    const isExist = await FunnelPageList.findOne({ funnel_id, path: path }).lean().then(res => res ? true : false);
                    if (isExist) throw new Error("\"" + _points.presentableFunnelName(path ? path : "Homepage") + "\" Already Exist.");
                }
                updateObject.$set = { page_type, path, page_title, page_description, page_og_image_link, page_keyword, funnel_header_analytics, funnel_footer_analytics, date_modified: Date.now() }
            } else if (source == "editor") {
                if (is_split_edit) { // save the split design
                    updateObject.$set = { split_design: design_json, split_screenshot: design_screenshot }
                } else { // save the design normally
                    updateObject.$push = {
                        design: {
                            $each: [{
                                date: Date.now(),
                                publish: is_publish,
                                json: design_json,
                                screenshot_url: design_screenshot
                            }],
                            $slice: -5
                        }
                    }
                    updateObject.$set = { published_page_id, page_enable_loader, page_selected_modal_action, date_modified: Date.now() } //Dito Ilagay ang headerfooter
                }
            }
            const result = await FunnelPageList.findByIdAndUpdate({ _id: page_id }, updateObject);
            await FunnelList.findByIdAndUpdate({ _id: funnel_id }, { $set: { date_modified: Date.now() } });
            return result;
        },

        saveSplitFunnelPageData: async (root, { page_id, is_remove }, { FunnelPageList }) => { // create or remove split page in funnel genie page list
            var result = null, updateObject = {};
            if (is_remove) {
                updateObject = { split_design: "", split_screenshot: "" };
            } else {
                const page_data = await FunnelPageList.findById({ _id: page_id }, { design: { $slice: -1 }, _id: 0 }).lean();
                var design = page_data.design[0];
                updateObject = { split_design: design.json, split_screenshot: design.screenshot_url }
            }
            result = await FunnelPageList.findByIdAndUpdate({ _id: page_id }, { $set: updateObject });
            return result;
        },

        updateSplitFunnelPageData: async (root, { page_id, bias, split_notes }, { FunnelPageList }) => { // update split page date in funnel genie page list
            var save = {};
            if (bias) save.split_bias = bias;
            if (split_notes) save.split_notes = split_notes;
            return await FunnelPageList.findByIdAndUpdate({ _id: page_id }, { $set: save });
        },
        // end new mutation for optimize funnel

        addFundsToUser: async (root, { orderids }, { FunnelGenieOrder }) => { // for manual add to funds when login as anonymous (COD Partners)
            var result = await FunnelGenieOrder.find({ _id: { $in: JSON.parse(orderids) } }).lean();
            var serialNumbers = [];
            for (var i = 0; i < result.length; i++) {
                if (result[i] && result[i].line_items) {
                    serialNumbers.push(...result[i].line_items.plg_serialNumber);
                }
            }
            await addFunnelProductCostToUser(serialNumbers, "Manual adding funds to user via login as anonymous");
            return null;
        },
        // TODO :: ADDING TAGS
        addOrRemovePLGTag: async (root, { id, tag, action }, { User }) => {
            tag = tag.toLowerCase();
            var update_object = {};
            if (tag == "god") throw new Error(action == "add" ? "There is only one god." : "Did you know, only God can do everything?");
            if (action == "add") update_object.$push = { access_tags: tag };
            else update_object.$pull = { access_tags: tag };
            const result = await User.findByIdAndUpdate({ _id: id }, update_object);
            return result;
        },

        splitOrMergeCODOrders: async (root, { ids, action }, { FunnelGenieOrder }) => {
            ids = JSON.parse(ids);
            if (action == "split") {
                const first_id_data = await FunnelGenieOrder.findById({ _id: ids[0] }).lean();
                for (var i = 1; i < ids.length; i++) { // need 2 and above because no need to change first line item as is nalang.
                    const current_id_data = await FunnelGenieOrder.findById({ _id: ids[i] }).lean();
                    await FunnelGenieOrder.findByIdAndUpdate({ _id: ids[i] }, {
                        $set: {
                            orderCreator: current_id_data.orderCreator + "_split_" + i
                        }
                    })
                }
            } else { // action == "merge"
                // TODO soon
            }
            return null;
        },

        sendMessage: async (root, { id, sender_id, funnel_id, page_id, product_link, receiver_id, replier_id, message, from_mobile }, { Messages }) => {
            let result = null;
            if (funnel_id && page_id && product_link) { // create or push to previous cod approval
                let prev_message = await Messages.findOne({ sender_id, receiver_id: "" }, { _id: 1 }).lean();
                let additional_data = { funnel_id, page_id, product_link };
                if (prev_message) {
                    result = await Messages.findByIdAndUpdate({ _id: prev_message._id }, {
                        $push: { messages: { additional_data } },
                        $inc: { receiver_unread_count: 1 },
                        $set: { last_message: "Sent a COD Product Request", last_message_date: Date.now() }
                    });
                } else {
                    result = await new Messages({
                        sender_id,
                        receiver_unread_count: 1,
                        last_message: "Sent a COD Product Request",
                        messages: [{ additional_data }]
                    }).save();
                }
                sendNotification("", "Product Request", "Sent a COD Product Request", "/dashboard?notifid=" + result._id, sender_id);
            } else { // create or push to previous normal message
                if (id) {
                    let message_info = await Messages.findById({ _id: id }, { sender_id: 1, receiver_id: 1 }).lean();
                    let increment = message_info.sender_id === replier_id ? { receiver_unread_count: 1 } : { sender_unread_count: 1 };
                    result = await Messages.findByIdAndUpdate({ _id: id }, {
                        $push: { messages: { replier_id, message } },
                        $inc: increment,
                        $set: { last_message: message, last_message_date: Date.now() }
                    });
                    if (!from_mobile) sendMessageToMobile(message_info.sender_id, replier_id, message);
                    let nid = message_info.sender_id === replier_id ? message_info.receiver_id : message_info.sender_id;
                    sendNotification(nid, "New Message", message, "/dashboard?notifid=" + result._id, replier_id);
                } else {
                    let prev_message = await Messages.findOne({ $or: [{ sender_id, receiver_id }, { sender_id: receiver_id, receiver_id: sender_id }] }, { _id: 1, sender_id: 1, receiver_id: 1 }).lean();
                    if (prev_message) { // new message pero sa meron existing message ang sinendan
                        let increment = prev_message.sender_id === sender_id ? { receiver_unread_count: 1 } : { sender_unread_count: 1 };
                        result = await Messages.findByIdAndUpdate({ _id: prev_message._id }, {
                            $push: { messages: { replier_id: sender_id, message } },
                            $inc: increment,
                            $set: { last_message: message, last_message_date: Date.now() }
                        });
                    } else { // new message to new user
                        result = await new Messages({
                            sender_id,
                            receiver_id,
                            receiver_unread_count: 1,
                            last_message: message,
                            messages: [{ message }]
                        }).save();
                    }
                    if (!from_mobile) sendMessageToMobile(sender_id, receiver_id, message);
                    let nid = prev_message ? prev_message.sender_id === sender_id ? prev_message.receiver_id : sender_id : receiver_id;
                    sendNotification(nid, "New Message", message, "/dashboard?notifid=" + result._id, sender_id);
                }
            }

            async function sendNotification(toId, title, message, url, exceptThisId) {
                let ids = [toId];
                if (!toId) ids = await User.find({ _id: { $nin: [exceptThisId] }, privilege: 10, keys: { $exists: true } }, { _id: 1 }).lean().then(id => id.map(e => e._id.toString()));
                pushNotification(ids, title, message, url);
            }

            return result;
        },
        // TODO :: quick Message mutation
        messageQuickAction: async (root, { id, user_id, input_computation, action, funnel_id, page_id }, { Messages, currentUser, FunnelList }) => {
            let message_info = await Messages.findById({ _id: id }, { sender_id: 1, receiver_id: 1 }).lean();
            if (action === "read") {
                let reset_count = message_info.sender_id === user_id ? { sender_unread_count: 0 } : { receiver_unread_count: 0 };
                return await Messages.findByIdAndUpdate({ _id: id }, { $set: reset_count });
            } else if (action === "unread") {
                let add_count = message_info.sender_id === user_id ? { sender_unread_count: 1 } : { receiver_unread_count: 1 };
                return await Messages.findByIdAndUpdate({ _id: id }, { $set: add_count });
            } else if (action === "approved") {
                let result = await Messages.findByIdAndUpdate({ _id: id }, { $set: { "messages.$[i].additional_data.approved": true } }, { arrayFilters: [{ "i.additional_data.page_id": page_id }] });
                if (result.nModified !== 0) {
                    //  Computatiaon      
                    var sourcePrice = parseFloat(input_computation); // ====> input_computation
                    var shippingUAE = 6.5
                    var shippingKSA = 18
                    var shippingBH = 26.21
                    var shippingOM = 27.46
                    var shippingKW = 28.63
                    var investor = 3
                    var sharing = 5
                    var markup = 20
                    var plg = 2.73

                    var reduceTaxFromPrice = (taxval, totalPrice) => {
                        taxval = taxval * 0.0100 + 1
                        return parseFloat((totalPrice - totalPrice / taxval).toFixed(2));
                    }

                    var totalUAE = sourcePrice + shippingUAE + investor + sharing + plg
                    var totalKSA = sourcePrice + shippingKSA + investor + sharing + plg
                    var totalBH = sourcePrice + shippingBH + investor + sharing + plg
                    var totalOM = sourcePrice + shippingOM + investor + sharing + plg
                    var totalKW = sourcePrice + shippingKW + investor + sharing + plg

                    var sellingPriceUAE = totalUAE + markup + reduceTaxFromPrice(5, totalUAE + markup)
                    var sellingPriceKSA = totalKSA + markup + reduceTaxFromPrice(7.5, totalKSA + markup)
                    var sellingPriceBH = totalBH + markup + reduceTaxFromPrice(5, totalBH + markup)
                    var sellingPriceOM = totalOM + markup + reduceTaxFromPrice(5, totalOM + markup)
                    var sellingPriceKW = totalKW + markup + reduceTaxFromPrice(5, totalKW + markup)
                    var finalPriceUAE = sellingPriceUAE + (sellingPriceUAE / 100) // the
                    var finalPriceKSA = sellingPriceKSA + (sellingPriceKSA / 100)
                    var finalPriceBH = sellingPriceBH + (sellingPriceBH / 100)
                    var finalPriceOM = sellingPriceOM + (sellingPriceOM / 100)
                    var finalPriceKW = sellingPriceKW + (sellingPriceKW / 100)

                    console.log(finalPriceUAE.toFixed(2))
                    console.log(finalPriceKSA.toFixed(2))
                    console.log(finalPriceBH.toFixed(2))
                    console.log(finalPriceOM.toFixed(2))
                    console.log(finalPriceKW.toFixed(2))


                    let funnel = await FunnelList.findById({ _id: funnel_id }, { funnel_name: 1 });
                    // let message = "Your product from " + _points.presentableFunnelName(funnel.funnel_name) + " has been approved. The Input Computation " + input_computation;
                    let message = `Your product from ${_points.presentableFunnelName(funnel.funnel_name)} has been approved. 
                    \n Your base price is \$${(sellingPriceUAE - markup).toFixed(2)} so please click here to see the selling price with local prices on each country. 
                    
                    \n We try our best to bring all the products approved within 7-10 working days from China-UAE.  
                    \n Sometimes we get final confirmation from the shipping company if the product can be shipped by air as per airlines/freight regulations.
                    \n Products are also subject to customs clearance that will beyond our control.
                    \n Initially, we will order a limited quantity of 20-30 units to check the product quality physically that will help to avoid returns/refunds and scales the product.
                    \n For Cash on Delivery Once you find the product is a winner after getting at least six (6) sales in no more than three (3) days of testing, you can request on this same chat for the quantity to bring and pause the ads until the inventory arrives (please ask here for status.
                    \n Meanwhile, you can test a different product until your inventory arrives if you are doing cash on delivery.
                    \n For Credit Card we simply ship automatically no matter the number of sales. 
                    \n Please join the telegram group for any support questions and join our daily live calls at 8pm EST
                    https://t.me/+TxJbl8V72TyhnWym` ;
                    // send message kay gayus na na approved na product
                    sendMessageToMobile(message_info.sender_id, currentUser.id, message); // lodi live id 5bfeb21b49acda0fb7e400ed jerome live id 5c0a85f0773001327b03904c
                    // send message locally na na approved na product (code sa taas sendMessage ->  else -> if)
                    await Messages.findByIdAndUpdate({ _id: id }, {
                        $push: { messages: { replier_id: currentUser.id, message } },
                        $inc: { sender_unread_count: 1 },
                        $set: { last_message: message, last_message_date: Date.now() }
                    });
                }
                return result;
            } else if (action === "removed") {
                return await Messages.findById({ _id: id }).remove().exec();
            }
        },
        // jerome end here

        setProfileIMG: async (root, { id, profileImage }, { User, Points }) => {
            const user = await User.findByIdAndUpdate({ _id: id }, { $set: { profileImage } }, { new: true });

            if (!user) {
                throw new Error('User Not Found');
            }
            // start complete profile checker
            if (user.one_time_missions.length > 0) {
                if (!user.one_time_missions.includes("complete_profile")) {
                    if (user.bio && user.profileImage) {
                        await User.findByIdAndUpdate({ _id: user.id }, { $push: { one_time_missions: "complete_profile" } });
                        await new Points({ source: "Complete Profile", points: _points.points_complete_profile, date: Date.now(), creator: user.id }).save();
                        await User.findByIdAndUpdate({ _id: id }, { $inc: { total_points: _points.points_complete_profile } });
                    }
                }
            } else {
                if (user.bio && user.profileImage) {
                    await User.findByIdAndUpdate({ _id: user.id }, { $push: { one_time_missions: "complete_profile" } });
                    await new Points({ source: "Complete Profile", points: _points.points_complete_profile, date: Date.now(), creator: user.id }).save();
                    await User.findByIdAndUpdate({ _id: id }, { $inc: { total_points: _points.points_complete_profile } });
                }
            }
            // end complete profile checker
            return user;
        },

        changeEmail: async (root, { currentEmail, newEmail }, { User }) => {
            const user = await User.findOneAndUpdate({ email: currentEmail }, { $set: { email: newEmail } }, { new: true });

            if (!user) {
                throw new Error('User Not Found');
            }
            return user;
        },

        changePassword: (root, { id, password }, { User }) => {
            const saltRounds = 10;

            return bcrypt.hash(password, saltRounds).then(async function (hash) {
                const user = await User.findByIdAndUpdate({ _id: id }, { $set: { password: hash } }, { new: true });
                if (!user) {
                    throw new Error('User Not Found');
                }
                return user;
            });
        },

        passwordReset: async (root, { email }, { User }) => {
            const saltRounds = 10;
            const generatedPassword = generator.generate({ length: 10, numbers: true });

            return bcrypt.hash(generatedPassword, saltRounds).then(async function (hash) {
                const user = await User.findOneAndUpdate({ email }, { $set: { password: hash } }, { new: true });
                if (!user) {
                    throw new Error('User Not Found');
                } else {
                    const data = {
                        email,
                        generatedPassword
                    }
                    axios.post(`${webConfig.siteURL}/password-reset`, data)
                        .then(function (response) {
                            // console.log('Email sent!');
                        })
                        .catch(function (error) {
                            // console.log(error);
                        });
                }
                return user;
            });
        }
    }
};