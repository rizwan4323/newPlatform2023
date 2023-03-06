/*
    List of domain connected to .productlistgenie.io baka may mag error dahil SSL error
    https://api.productlistgenie.io // to retrive billing information from Kartra
    https://stats.productlistgenie.io // inhouse analytics
    https://admin.productlistgenie.io // SSL issuer portal
    https://plg.productlistgenie.io // funnel server (page server)
    https://tracking.productlistgenie.io // for COD products parcel tracking
*/

let condition = require('./Global_Conditions');
module.exports = {
    wimoAuthorization: () => {
        var newWimo = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA4MDEsImVtYWlsIjoiaW5mb0BrYW56YWxtYXNocmVxLmNvbSIsImlhdCI6MTYxOTA4MzY1OSwiZXhwIjoxNzA1NDgzNjU5fQ.pRWPMZtMK-CodZRX8RowTwkcoFAC2OkJDtYfs3IlRWc"
        var liveAPI = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwODQsImZpcnN0TmFtZSI6IkFiaWQiLCJsYXN0TmFtZSI6IlBMRyIsImVtYWlsIjoiaW5mby51YWUucGxnQGdtYWlsLmNvbSIsImNvdW50cnlDb2RlIjoiQUUiLCJwaG9uZSI6Iis5NzE1MDYwNzIyNTYiLCJzdGF0dXMiOiJ2ZXJpZmllZCIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJjb21wYW55SWQiOjEwMDg0LCJjb21wYW55Ijp7ImlkIjoxMDA4NCwibmFtZSI6IlBMRyBPbmxpbmUgU3RvcmUiLCJ3ZWJzaXRlIjpudWxsLCJsb2dvIjpudWxsLCJidXNpbmVzc1R5cGUiOiJyZXRhaWwiLCJkZWxpdmVyaWVzUGVyTW9udGgiOiIxMDAgLSAxLDAwMCIsImNyZWF0ZWRBdCI6IjIwMTktMTItMjQgMDk6MDU6NTIiLCJ1cGRhdGVkQXQiOiIyMDE5LTEyLTI0IDA5OjA1OjUyIn0sImlhdCI6MTU3Nzc0MTA3OCwiZXhwIjoxNjY0MTQxMDc4fQ.-dDFy0KxQb9NyWqqVJzrMDW6QL0gTyMIRWoiyvxTIJI";
        var testAPI = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwNDgsImZpcnN0TmFtZSI6IlBydWhkdmkiLCJsYXN0TmFtZSI6IldpbW8iLCJlbWFpbCI6InNhbGVzQHdpbW9hcHAuY29tIiwiY291bnRyeUNvZGUiOiJBRSIsInBob25lIjoiKzk3MTU2OTQ1NjM2NSIsInN0YXR1cyI6InZlcmlmaWVkIiwiZW1haWxWZXJpZmllZCI6ZmFsc2UsImNvbXBhbnlJZCI6MTAwNDgsImNvbXBhbnkiOnsiaWQiOjEwMDQ4LCJuYW1lIjoiV2ltbyBTYWxlcyIsIndlYnNpdGUiOm51bGwsImxvZ28iOm51bGwsImJ1c2luZXNzVHlwZSI6InJldGFpbCIsImRlbGl2ZXJpZXNQZXJNb250aCI6IjEwLDAwMCAtIDUwLDAwMCIsImNyZWF0ZWRBdCI6IjIwMTktMTAtMTggMTE6MTI6MzEiLCJ1cGRhdGVkQXQiOiIyMDE5LTEwLTE4IDExOjEyOjMxIn0sImlhdCI6MTU3Nzk3OTc5NiwiZXhwIjoxNjY0Mzc5Nzk2fQ.TpLQW59FD8CG1E2k1XsdBdwbbEddzBFHp-zOrUAu8aY";
        return newWimo; // use test if going to sync function
    },
    getFetchrData: () => {
        var liveAPI = "0dc39e30-a6e5-40ff-920f-bdf29adcecd8",
            liveLink = "https://api.order.fetchr.us";
        var testAPI = "eyJhbGciOiJIUzI1NiIsImV4cCI6MTY1ODIyMDI0OCwiaWF0IjoxNTAyNzAwMjQ4fQ.eyJYLUNsaWVudC1OYW1lIjoiZHVtbXkiLCJzYW5kYm94Ijp0cnVlLCJwcml2aWxlZ2VzIjp7ImNyZWRlbnRpYWxzIjoiY3J1ZCIsInRyYWNraW5nIjoiY3J1ZCIsIm9yZGVycyI6ImNydWQiLCJub3RpZmljYXRpb25zIjoiY3J1ZCJ9LCJYLUNsaWVudC1JRCI6MTIxODJ9.oOTC-XIHzp7wSqHYMjFFhwgkLIUp7NEFPdWBzDXibrU",
            testLink = "https://xapi.stag.fetchr.us";
        return { link: liveLink, authorization: liveAPI }; // use test if going to sync function
    },
    getTaxPercent: (percent, value) => {
        try {
            let newval = value - (value * percent);
            return newval;
        } catch (error) {
            return 0;
        }
    },
    getSafeArrivalCredentail: (location, isTaqadum) => {
        if (isTaqadum) {
            return {
                "username": "rafaibtradingllc@gmail.com",
                "password": "Yalla123",
                "remember_me": true,
                "isTaqadum": true
            }
        } else if (["AE", "ARE"].includes(location)) { // AE or ARE
            return {
                "username": "info.uae.plg@gmail.com",
                "password": "Safe12345",
                "remember_me": true
            }
        } else { // SA or SAU
            return {
                "username": "yalagenie@safe-arrival.com", // info.uae.plg1@gmail.com
                "password": "Abc123",
                "remember_me": true
            }
        }
    },
    getCountryTaxable: (iso3, priceval, val) => {
        if (!iso3 || !priceval) return 0;
        const reduceTaxFromPrice = taxval => {
            taxval = taxval * 0.0100 + 1
            return parseFloat((priceval - priceval / taxval).toFixed(2));
        }

        // console.log({iso3, priceval, val});

        // TODO :: getCountryTaxable
        /**
         * Flags List
        { iso2: "BH", iso3: "BHR", cw: "BHD", cs: "د.ب", name: "Bahrain", fill: "#ce1025", flag: "https://cdn.productlistgenie.com/images/NWMzNjEzYWQ3YzUxMTk1MGFjZjE0Yzk3/flag_bh.png" },
        { iso2: "KW", iso3: "KWT", cw: "KWD", cs: "د.ك", name: "Kuwait", fill: "#000", flag: "https://cdn.productlistgenie.com/images/NWMzNjEzYWQ3YzUxMTk1MGFjZjE0Yzk3/flag_kw.png" },
        { iso2: "QA", iso3: "QAT", cw: "QAR", cs: "ر.ق", name: "Qatar", fill: "#8d1a3d", flag: "https://cdn.productlistgenie.com/images/NWMzNjEzYWQ3YzUxMTk1MGFjZjE0Yzk3/flag_qa.png" },
        { iso2: "OM", iso3: "OMN", cw: "OMR", cs: "ر.ع", name: "Oman", fill: "#db161b", flag: "https://cdn.productlistgenie.com/images/NWMzNjEzYWQ3YzUxMTk1MGFjZjE0Yzk3/flag_om.png" },


        { iso2: "MX", iso3: "MEX", cw: "MXN", cs: "$", name: "Mexico", flag: "https://cdn.countryflags.com/thumbs/mexico/flag-round-250.png" },
        { iso2: "IL", iso3: "ISR", cw: "ILS", cs: "₪", name: "Israel", flag: "https://cdn.britannica.com/53/1753-004-03582EDA/Flag-Israel.jpg" },
        // { iso2: "PR", iso3: "PRI", cw: "USD", cs: " $", name: "Puerto Rico", flag: "https://cdn.countryflags.com/thumbs/israel/flag-round-250.png" },
        { iso2: "CA", iso3: "CAN", cw: "CAD", cs: "$", name: "Canada", flag: "https://cdn.countryflags.com/thumbs/canada/flag-round-250.png" },
        { iso2: "AU", iso3: "AUS", cw: "AUD", cs: " $", name: "Australia", flag: "https://cdn.countryflags.com/thumbs/australia/flag-round-250.png" },
        { iso2: "US", iso3: "USA", cw: "USD", cs: " $", name: "United States", flag: "https://cdn.countryflags.com/thumbs/united-states-of-america/flag-round-250.png" },

        // new flags oct 29 ,2020
        { iso2: "TW", iso3: "TWN", cw: "TWD", cs: " $", name: "Taiwan", flag: "https://cdn.countryflags.com/thumbs/taiwan/flag-round-250.png" },
        { iso2: "HK", iso3: "HKG", cw: "HKD", cs: " $", name: "Hongkong", flag: "https://cdn.countryflags.com/thumbs/hongkong/flag-round-250.png" },
        { iso2: "ZA", iso3: "ZAF", cw: "ZAR", cs: " R", name: "South Africa", flag: "https://cdn.countryflags.com/thumbs/south-africa/flag-round-250.png" },
        { iso2: "FR", iso3: "FRA", cw: "EUR", cs: "€", name: "France", flag: "https://cdn.countryflags.com/thumbs/france/flag-round-250.png" },
        { iso2: "IN", iso3: "IND", cw: "INR", cs: "₹", name: "India", flag: "https://cdn.countryflags.com/thumbs/india/flag-round-250.png" },
        { iso2: "DE", iso3: "DEU", cw: "EUR", cs: "€", name: "Germnay", flag: "https://cdn.countryflags.com/thumbs/germany/flag-round-250.png" }
        */
        var x = {
            // iso2 :::
            "AE": { "type": "percentage", "value": 5 },
            "SA": { "type": "percentage", "value": 5 },
            "BH": { "type": "percentage", "value": 5 },
            "KW": { "type": "percentage", "value": 5 },
            "QA": { "type": "percentage", "value": 5 },
            "OM": { "type": "percentage", "value": 5 },
            "EG": { "type": "percentage", "value": 5 },
            "PH": { "type": "integer", "value": 1 },
            "IN": { "type": "percentage", "value": 18 },

            "MX": { "type": "taxfree", "value": 0 },
            "IL": { "type": "taxfree", "value": 0 },
            "CA": { "type": "taxfree", "value": 0 },
            "AU": { "type": "taxfree", "value": 0 },
            "US": { "type": "taxfree", "value": 0 },

            "TW": { "type": "taxfree", "value": 0 },
            "HK": { "type": "taxfree", "value": 0 },
            "ZA": { "type": "taxfree", "value": 0 },
            "FR": { "type": "taxfree", "value": 0 },
            "IN": { "type": "taxfree", "value": 0 },
            "DE": { "type": "taxfree", "value": 0 },
            "ES": { "type": "taxfree", "value": 0 },
            "SG": { "type": "taxfree", "value": 0 },
            "MY": { "type": "taxfree", "value": 0 },

            // iso3 :::
            "ARE": { "type": "percentage", "value": 5 },
            "SAU": { "type": "percentage", "value": 5 },
            "BHR": { "type": "percentage", "value": 5 },
            "KWT": { "type": "percentage", "value": 5 },
            "QAT": { "type": "percentage", "value": 5 },
            "EGY": { "type": "percentage", "value": 5 },
            "OMN": { "type": "percentage", "value": 5 },
            "PHL": { "type": "integer", "value": 1 },
            "IND": { "type": "percentage", "value": 18 },

            "MEX": { "type": "taxfree", "value": 0 },
            "ISR": { "type": "taxfree", "value": 0 },
            "CAN": { "type": "taxfree", "value": 0 },
            "AUS": { "type": "taxfree", "value": 0 },
            "USA": { "type": "taxfree", "value": 0 },

            "TWN": { "type": "taxfree", "value": 0 },
            "HKG": { "type": "taxfree", "value": 0 },
            "ZAF": { "type": "taxfree", "value": 0 },
            "FRA": { "type": "taxfree", "value": 0 },
            "IND": { "type": "taxfree", "value": 0 },
            "DEU": { "type": "taxfree", "value": 0 },
            "ESP": { "type": "taxfree", "value": 0 },
            "SGP": { "type": "taxfree", "value": 0 },
            "MYS": { "type": "taxfree", "value": 0 },


        }
        var taxable = 0;
        var taxableValue = val ? val : x[iso3].value;
        if (x[iso3] && x[iso3].type == "percentage") {
            taxable = reduceTaxFromPrice(taxableValue);
        } else if (x[iso3] && x[iso3].type == "integer") {
            taxable = priceval - (priceval - taxableValue);
        } else if (x[iso3] && x[iso3].type == "taxfree") {
            taxable = priceval;
        }
        return taxable;
    },
    plg_domain_secret: "ZSlxiouhjfnwIOeughi",
    item_per_page: 50, // for fulfillment center request tab
    paypalClient: {
        sandbox: 'Ac6nut2l6FoPSpm28fgk2EHu9NQ00o4omTyNOiYmfhBbue_4M4w2fcbOpZIH4YpdvFei6CB9R-y6hFPJ',
        production: 'AUuEyao211t92YC5V_jBlcgitEENmhMzEBOlsKHKxWiDRoHvD6xWVowM7_OA8F8YPUAcEtBYuyF_nHMa'
    },
    stripe_apiKey: "pk_test_p305ztT2FwUOX2GW1vfuwnpx",
    sensitiveWords: [{ "country": "ALL", "sensitiveWord": "AEROSOL", "synonym": "" }, { "country": "ALL", "sensitiveWord": "AIR GUNS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "ALCOHOL", "synonym": "" }, { "country": "ALL", "sensitiveWord": "ALCOHOLIC BEVERAGES", "synonym": "" }, { "country": "ALL", "sensitiveWord": "AMMUNITION", "synonym": "" }, { "country": "AU", "sensitiveWord": "ANIMAL", "synonym": "" }, { "country": "ALL", "sensitiveWord": "ARM", "synonym": "" }, { "country": "AU", "sensitiveWord": "ARTIFICIAL", "synonym": "" }, { "country": "AU", "sensitiveWord": "BAMBOO STRIPS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "BANKNOTE", "synonym": "" }, { "country": "ALL", "sensitiveWord": "BAROMETER", "synonym": "" }, { "country": "ALL", "sensitiveWord": "BATTERIES", "synonym": "" }, { "country": "ALL", "sensitiveWord": "BATTERY", "synonym": "" }, { "country": "AU", "sensitiveWord": "BIRD", "synonym": "" }, { "country": "AU", "sensitiveWord": "BIRDS", "synonym": "" }, { "country": "AU", "sensitiveWord": "BOARD", "synonym": "" }, { "country": "AU", "sensitiveWord": "BODY", "synonym": "" }, { "country": "ALL", "sensitiveWord": "BODY LOTION", "synonym": "" }, { "country": "ALL", "sensitiveWord": "BOMB", "synonym": "" }, { "country": "AU", "sensitiveWord": "BOX", "synonym": "" }, { "country": "AU", "sensitiveWord": "BRANCH", "synonym": "" }, { "country": "AU", "sensitiveWord": "BROOM", "synonym": "" }, { "country": "AU", "sensitiveWord": "BRUSH", "synonym": "" }, { "country": "AU", "sensitiveWord": "BUCKET", "synonym": "" }, { "country": "AU", "sensitiveWord": "CAGES", "synonym": "" }, { "country": "ALL", "sensitiveWord": "CAMOUFLAGE COAT", "synonym": "" }, { "country": "ALL", "sensitiveWord": "CAMOUFLAGECOAT", "synonym": "" }, { "country": "AU", "sensitiveWord": "CAMPING", "synonym": "" }, { "country": "ALL", "sensitiveWord": "CAMPING GEAR", "synonym": "" }, { "country": "ALL", "sensitiveWord": "CAMPING TOOL", "synonym": "" }, { "country": "ALL", "sensitiveWord": "CAMPING TOOLS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "CARBON CARTRIDGES", "synonym": "" }, { "country": "AU", "sensitiveWord": "CHAIR", "synonym": "" }, { "country": "ALL", "sensitiveWord": "CHEMICAL", "synonym": "" }, { "country": "ALL", "sensitiveWord": "CHEMICALS", "synonym": "" }, { "country": "AU", "sensitiveWord": "CHRISTMAS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "CIGARETTES", "synonym": "" }, { "country": "ALL", "sensitiveWord": "CIGARETTES LIGHTERS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "CIGARS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "COIN", "synonym": "" }, { "country": "ALL", "sensitiveWord": "COLOGNES", "synonym": "" }, { "country": "ALL", "sensitiveWord": "COMPRESSED GAS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "COSMETIC", "synonym": "" }, { "country": "ALL", "sensitiveWord": "COSMETICS", "synonym": "" }, { "country": "AU", "sensitiveWord": "COTTON", "synonym": "" }, { "country": "AU", "sensitiveWord": "COTTON BASKET", "synonym": "" }, { "country": "ALL", "sensitiveWord": "COUNTERFEIT", "synonym": "" }, { "country": "ALL", "sensitiveWord": "CROSSBOWS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "CYLINDERS", "synonym": "" }, { "country": "AU", "sensitiveWord": "DECOR", "synonym": "" }, { "country": "AU", "sensitiveWord": "DECORATE", "synonym": "" }, { "country": "AU", "sensitiveWord": "DECORATIONS", "synonym": "" }, { "country": "AU", "sensitiveWord": "DECORATIVE", "synonym": "" }, { "country": "AU", "sensitiveWord": "DINOSAUR", "synonym": "" }, { "country": "AU", "sensitiveWord": "DOG", "synonym": "" }, { "country": "ALL", "sensitiveWord": "DOG REPELLENTS", "synonym": "" }, { "country": "AU", "sensitiveWord": "DREAM CATCHER", "synonym": "" }, { "country": "ALL", "sensitiveWord": "DRUG", "synonym": "" }, { "country": "ALL", "sensitiveWord": "DRY ICE", "synonym": "" }, { "country": "ALL", "sensitiveWord": "E-CIGARETTES", "synonym": "" }, { "country": "AU", "sensitiveWord": "EGG STORAGE", "synonym": "" }, { "country": "ALL", "sensitiveWord": "ELECTRIC STUN GUNS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "ELECTRIC WHEELCHAIR", "synonym": "" }, { "country": "ALL", "sensitiveWord": "ELECTRO SHOCK DEVICES", "synonym": "" }, { "country": "ALL", "sensitiveWord": "ELECTRONICS COMPONENTS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "EXPLOSIVE", "synonym": "" }, { "country": "ALL", "sensitiveWord": "EXTENDIBLE BATON", "synonym": "" }, { "country": "AU", "sensitiveWord": "FEATHER", "synonym": "" }, { "country": "AU", "sensitiveWord": "FEED", "synonym": "" }, { "country": "AU", "sensitiveWord": "FESTIVAL", "synonym": "" }, { "country": "AU", "sensitiveWord": "FISH", "synonym": "" }, { "country": "AU", "sensitiveWord": "FLAG", "synonym": "" }, { "country": "ALL", "sensitiveWord": "FLAMMABLE LIQUID", "synonym": "" }, { "country": "AU", "sensitiveWord": "FLO WER", "synonym": "" }, { "country": "AU", "sensitiveWord": "FLOWER", "synonym": "" }, { "country": "AU", "sensitiveWord": "FLOWERES", "synonym": "" }, { "country": "AU", "sensitiveWord": "FLOWERS", "synonym": "" }, { "country": "AU", "sensitiveWord": "FLY", "synonym": "" }, { "country": "AU", "sensitiveWord": "FOLLOWER", "synonym": "" }, { "country": "AU", "sensitiveWord": "FOOD", "synonym": "" }, { "country": "AU", "sensitiveWord": "FOOT", "synonym": "" }, { "country": "AU", "sensitiveWord": "FRAME", "synonym": "" }, { "country": "ALL", "sensitiveWord": "FUEL", "synonym": "" }, { "country": "ALL", "sensitiveWord": "FUEL CARTRIDGES", "synonym": "" }, { "country": "ALL", "sensitiveWord": "FUEL CELLS", "synonym": "" }, { "country": "AU", "sensitiveWord": "GARDEN", "synonym": "" }, { "country": "AU", "sensitiveWord": "GARLAND", "synonym": "" }, { "country": "ALL", "sensitiveWord": "GAS CARTRIDGES", "synonym": "" }, { "country": "ALL", "sensitiveWord": "GAS CYLINDERS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "GASEOUS CYLINDERS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "GIFT", "synonym": "" }, { "country": "AU", "sensitiveWord": "GRASS", "synonym": "" }, { "country": "AU", "sensitiveWord": "GUITAR", "synonym": "" }, { "country": "ALL", "sensitiveWord": "GUN", "synonym": "" }, { "country": "ALL", "sensitiveWord": "GUNS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "GUNS  ", "synonym": "" }, { "country": "ALL", "sensitiveWord": "HAIR CURLERS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "HAIR SPRAYS", "synonym": "" }, { "country": "AU", "sensitiveWord": "HAND", "synonym": "" }, { "country": "ALL", "sensitiveWord": "HARPOONS", "synonym": "" }, { "country": "AU", "sensitiveWord": "HEALTH AND BEAUTY", "synonym": "" }, { "country": "AU", "sensitiveWord": "HEALTH AND BEAUTY", "synonym": "" }, { "country": "AU", "sensitiveWord": "HERBICIDE", "synonym": "" }, { "country": "ALL", "sensitiveWord": "HEROIN", "synonym": "" }, { "country": "AU", "sensitiveWord": "HUNTING", "synonym": "" }, { "country": "AU", "sensitiveWord": "HYGIENE", "synonym": "" }, { "country": "ALL", "sensitiveWord": "INFECTIOUS SUBSTANCES", "synonym": "" }, { "country": "ALL", "sensitiveWord": "INSECTICIDE", "synonym": "" }, { "country": "AU", "sensitiveWord": "ISOLATE", "synonym": "" }, { "country": "AU", "sensitiveWord": "KITCHEN", "synonym": "" }, { "country": "AU", "sensitiveWord": "KNIFE", "synonym": "" }, { "country": "AU", "sensitiveWord": "LANDSCAPING", "synonym": "" }, { "country": "ALL", "sensitiveWord": "LIGHTER", "synonym": "" }, { "country": "ALL", "sensitiveWord": "LIGHTERS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "LIGHTERS WITHOUT GAS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "LIQUID", "synonym": "" }, { "country": "ALL", "sensitiveWord": "LITHIUM BATTERIES POWERED DEVICES", "synonym": "" }, { "country": "ALL", "sensitiveWord": "LITHIUM ION BATTERIES", "synonym": "" }, { "country": "ALL", "sensitiveWord": "LITHIUM METAL BATTERIES", "synonym": "" }, { "country": "ALL", "sensitiveWord": "LIVESTOCK", "synonym": "" }, { "country": "ALL", "sensitiveWord": "MACE", "synonym": "" }, { "country": "ALL", "sensitiveWord": "MAGNET", "synonym": "" }, { "country": "ALL", "sensitiveWord": "MAGNETIZE MATERIALS", "synonym": "" }, { "country": "AU", "sensitiveWord": "MANGO", "synonym": "" }, { "country": "ALL", "sensitiveWord": "MARIJUANA", "synonym": "" }, { "country": "AU", "sensitiveWord": "MAT", "synonym": "" }, { "country": "ALL", "sensitiveWord": "MATCHES, SAFETY", "synonym": "" }, { "country": "ALL", "sensitiveWord": "MEDICAL", "synonym": "" }, { "country": "ALL", "sensitiveWord": "MERCURY FILLED", "synonym": "" }, { "country": "ALL", "sensitiveWord": "MOBILE PHONE", "synonym": "" }, { "country": "ALL", "sensitiveWord": "MORPHINE", "synonym": "" }, { "country": "AU", "sensitiveWord": "MOSQUITO", "synonym": "" }, { "country": "AU", "sensitiveWord": "MOULD", "synonym": "" }, { "country": "AU", "sensitiveWord": "MOUSE", "synonym": "" }, { "country": "AU", "sensitiveWord": "MUSICAL", "synonym": "" }, { "country": "ALL", "sensitiveWord": "NAIL POLISH", "synonym": "" }, { "country": "ALL", "sensitiveWord": "NAILPOLISHES", "synonym": "" }, { "country": "AU", "sensitiveWord": "NEST", "synonym": "" }, { "country": "ALL", "sensitiveWord": "NON-INFECTIOUS SPECIMENS", "synonym": "" }, { "country": "AU", "sensitiveWord": "NUTS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "OLEORESIN CAPSICUM FOAM", "synonym": "" }, { "country": "ALL", "sensitiveWord": "OPIUM", "synonym": "" }, { "country": "ALL", "sensitiveWord": "ORGANISM", "synonym": "" }, { "country": "AU", "sensitiveWord": "ORNAMENT", "synonym": "" }, { "country": "AU", "sensitiveWord": "OSTRICH", "synonym": "" }, { "country": "AU", "sensitiveWord": "PENCIL", "synonym": "" }, { "country": "ALL", "sensitiveWord": "PEPPER SPRAY", "synonym": "" }, { "country": "ALL", "sensitiveWord": "PERFUME", "synonym": "" }, { "country": "ALL", "sensitiveWord": "PERFUMES", "synonym": "" }, { "country": "ALL", "sensitiveWord": "PERSONAL EFFECT", "synonym": "" }, { "country": "AU", "sensitiveWord": "PET", "synonym": "" }, { "country": "AU", "sensitiveWord": "PETS LAWN TOILET", "synonym": "" }, { "country": "ALL", "sensitiveWord": "PISTOL", "synonym": "" }, { "country": "AU", "sensitiveWord": "PLANT", "synonym": "" }, { "country": "AU", "sensitiveWord": "PLASTIC MODEL", "synonym": "" }, { "country": "ALL", "sensitiveWord": "POISON", "synonym": "" }, { "country": "ALL", "sensitiveWord": "POISONOUS SUBSTANCE", "synonym": "" }, { "country": "AU", "sensitiveWord": "POT", "synonym": "" }, { "country": "ALL", "sensitiveWord": "POWDER", "synonym": "" }, { "country": "ALL", "sensitiveWord": "POWER BANK", "synonym": "" }, { "country": "ALL", "sensitiveWord": "POWERBANK", "synonym": "" }, { "country": "AU", "sensitiveWord": "PROPS", "synonym": "" }, { "country": "AU", "sensitiveWord": "RACK", "synonym": "" }, { "country": "ALL", "sensitiveWord": "RADIOACTIVE SUBSTANCES", "synonym": "" }, { "country": "AU", "sensitiveWord": "RATTAN", "synonym": "" }, { "country": "ALL", "sensitiveWord": "RECHARGEABLE BATTERIES", "synonym": "" }, { "country": "ALL", "sensitiveWord": "REFRIGERATED LIQUID - NITROGEN", "synonym": "" }, { "country": "ALL", "sensitiveWord": "SAMPLE", "synonym": "" }, { "country": "ALL", "sensitiveWord": "SAMPLES", "synonym": "" }, { "country": "AU", "sensitiveWord": "SEED", "synonym": "" }, { "country": "ALL", "sensitiveWord": "SEED OIL", "synonym": "" }, { "country": "ALL", "sensitiveWord": "SEEDOIL", "synonym": "" }, { "country": "AU", "sensitiveWord": "SEEDS", "synonym": "" }, { "country": "AU", "sensitiveWord": "SHELL", "synonym": "" }, { "country": "ALL", "sensitiveWord": "SMOKE", "synonym": "" }, { "country": "AU", "sensitiveWord": "SOIL", "synonym": "" }, { "country": "ALL", "sensitiveWord": "SPARE PARTS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "SPECIMENS", "synonym": "" }, { "country": "AU", "sensitiveWord": "STICK", "synonym": "" }, { "country": "AU", "sensitiveWord": "STONE", "synonym": "" }, { "country": "AU", "sensitiveWord": "STOOL", "synonym": "" }, { "country": "AU", "sensitiveWord": "STRAW", "synonym": "" }, { "country": "ALL", "sensitiveWord": "SURGICAL", "synonym": "" }, { "country": "AU", "sensitiveWord": "TABLE", "synonym": "" }, { "country": "AU", "sensitiveWord": "TEAPOT", "synonym": "" }, { "country": "ALL", "sensitiveWord": "THERMOMETER", "synonym": "" }, { "country": "AU", "sensitiveWord": "TOBACCO", "synonym": "" }, { "country": "ALL", "sensitiveWord": "TOXIC", "synonym": "" }, { "country": "AU", "sensitiveWord": "TOY", "synonym": "" }, { "country": "AU", "sensitiveWord": "TRAP", "synonym": "" }, { "country": "AU", "sensitiveWord": "TRAPS", "synonym": "" }, { "country": "AU", "sensitiveWord": "VELVET BALL", "synonym": "" }, { "country": "AU", "sensitiveWord": "VETERINARY", "synonym": "" }, { "country": "AU", "sensitiveWord": "VINE", "synonym": "" }, { "country": "AU", "sensitiveWord": "WATER", "synonym": "" }, { "country": "AU", "sensitiveWord": "WEAPON", "synonym": "" }, { "country": "ALL", "sensitiveWord": "WEAPONS", "synonym": "" }, { "country": "ALL", "sensitiveWord": "WET BATTERIES", "synonym": "" }, { "country": "AU", "sensitiveWord": "WINE", "synonym": "" }, { "country": "AU", "sensitiveWord": "WOOD", "synonym": "" }, { "country": "AU", "sensitiveWord": "WOODEN", "synonym": "" }, { "country": "AU", "sensitiveWord": "WOODENES", "synonym": "" }, { "country": "AU", "sensitiveWord": "WOODENS", "synonym": "" }, { "country": "AU", "sensitiveWord": "WOOL", "synonym": "" }, { "country": "AU", "sensitiveWord": "WREATH", "synonym": "" }, { "country": "AU", "sensitiveWord": "XMAS", "synonym": "" }],
    getURLParameters: url => {
        return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce((a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a), {});
    },
    // kartra tags
    tag_video_dojo: "Video Dojo Buyer",
    tag_ad_targeting: "Ad Targeting Mastery Buyer",
    tag_product_research: "Product Research Mastery Buyer",
    tag_scaling_club: "Scaling Club Buyer",
    tag_advance_strategies: "PLG Advanced Strategies",
    tag_dfy_store: "PLG DFY Store",
    kartra_tag_pricing: {
        video_dojo: 594.00,
        ad_targeting: 594.00,
        product_research: 594.00,
        scaling_club: 2997.00,
        advance_strategies: 197.00,
        dfy_store: 97.00,
    },
    // upgrade account link
    upgradeAccountLink: "https://themm.kartra.com/page/qNk67",
    // plg theme lite point price
    plg_theme_lite_price: "2,000",
    // poionts list
    points_pushWithBundle: 10,
    points_pushToStore: 5,
    points_addReview: 5,
    points_copyPush: 10,

    // one time mission
    points_firstPushToStore: 100,
    points_connectToStore: 100,
    points_complete_profile: 100,
    points_join_fb_group: 500,
    points_spread_the_word: 100,
    points_schedule_demo_call: 200,
    points_link_fb: 500,

    limit_pushWithBundle: 9999999, // all limit default 10
    limit_pushToStore: 9999999,
    limit_addReview: 9999999,
    limit_copyPush: 9999999,
    limit_hotProducts: 9999999, // except here w/c is 5
    apiServer: 'https://api.productlistgenie.io',
    dateToBecomeVIP: 67,
    clientUrl: 'http://localhost:3000',
    clientNotification: function () {
        if (this.clientUrl === "http://localhost:3000") {
            return {
                url: this.clientUrl,
                publicKey: "BD-DzQE4r97JWLBiIieLgl3AobPNspjCExYcri-3vPAA5LDF-EUqaKdB5GQuaVCb38ySKf02iwWq3W6XP-jnKZA",
                privateKey: "6eTbGe9VfZHEOQYUtfvt5Djy0vEbVSYE8j3rB7JFqRw",
                picture: this.clientUrl + "/assets/graphics/abstract_patterns/texture.jpg"
            }
        } else {
            return {
                url: this.clientUrl,
                publicKey: "BJjOdBJoY106Bx6NESofKyJ-k-rxFHmGZfeh2Rwn1UezJbDARO47HnMKbDN34W7skQhHkPe2kA4B87fvBWNzjYk",
                privateKey: "GHLS3yBMH7cRqiw_v8C-jyErkxb7LRLEO0nIX6AWxxI",
                picture: this.clientUrl + "/user-uploads/pIjWQMrigtIQpxhrgdccn.png"
            }
        }
    },
    cookie_name: 'user_session_cookie',
    fb_regex: new RegExp(/^(https?:\/\/)?((www|[a-z]{2}-[a-z]{2})\.)?facebook\.com\/[A-Za-z0-9.]{5,}\/?(\?(\w+=\w+&?)*)?$/g),
    // for store ranking api for ranking-4
    serverServer: 'https://api.productlistgenie.io/getRanking',
    // for ranking-3 (PHP)
    // serverServer: 'https://themillionairemastermind.com/TheMM-Labs/records.php?url=',
    ePacket_List: [
        'Australia',
        'Canada',
        'Denmark',
        'Finland',
        'France',
        'Germany',
        'Ireland',
        'Israel',
        'Italy',
        'Netherlands',
        'New Zealand',
        'Portugal',
        'Spain',
        'Switzerland',
        'United Kingdom',
        'United States'
    ],
    ePacket_Link: 'https://docs.google.com/document/d/1JM4wtxkhMiDewHBCcrn6bYjGiLv-uBj-t9gBRkdVSQ0/edit?fbclid=IwAR3LicsK4erdqtcelGROfrLQC-muGwLTwHQPp6Wwd-IRf0eHvVndn5fHfIg%22',
    // video points
    day_challenge: [100, 200, 400, 600, 800, 1000, 1000, 1000, 1000],
    sevenDayChallenge: [
        {
            day: 1, title: "Day 1 Challenge", videoID: "308426081", description: `
            <div class="column column_12_12">
                <h3>The Internet Holy Grail</h3>
                <p>Step 1: Go to <a href='https://productlistgenie.com/shopify/' target='_blank'>Shopify</a> and set up a store trial and save the url of the store plus the username and password </p>
                <p> Step 2: <span onClick='window.toggleConnectModal()' style='cursor: pointer'>Click <i style='color: green'>Here</i> to connect your store</span></p>
            </div>
            <div class="column column_12_12">
                <br/>
                <h3>Your Implementation Homework</h3>
                <div class="text-center">
                    <iframe src="https://player.vimeo.com/video/313082459" width="700" height="450" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                </div>
            </div>
        `},
        {
            day: 2, title: "Day 2 Challenge", videoID: "308425402", description: `
            <div class="column column_12_12">
                <h3> Day 2- MY Million Dollar Daily Routine </h3>
                <p> For the next 30 days add 3 daily products from Hot Angles and push them to your store. Read each copy daily to develop a millionaire instinct We are looking for 15 dollars or more profit. </p>
            </div>
            <div class="column column_12_12">
                <br/>
                <h3>Your Implementation Homework</h3>
                <div class="text-center">
                    <iframe src="https://player.vimeo.com/video/313088542" width="700" height="450" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                </div>
            </div>
        `},
        {
            day: 3, title: "Day 3 Challenge", videoID: "308425882", description: `
            <div class="column column_12_12">
                <h3> Day 3 - Very IMPORTANT </h3>
                <p> Watch my daily shows <a href='https://www.facebook.com/groups/917176848452140/' target='_blank'>Join Group</a> to watch shows You must rent a millionaire to become one. </p>
            </div>
            <div class="column column_12_12">
                <br/>
                <h3>Your Implementation Homework</h3>
                <div class="text-center">
                    <iframe src="https://player.vimeo.com/video/313088557" width="700" height="450" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                </div>
            </div>
        `},
        {
            day: 4, title: "Day 4 Challenge", videoID: "308427088", description: `
            <div class="column column_12_12">
                <h3> Day 4 - THE MILLION DOLLAR PRODUCT PAGE </h3>
                <p> You need the million dollar product store. Get our million dollar theme </p>
            </div>
            <div class="column column_12_12">
                <br/>
                <h3>Your Implementation Homework</h3>
                <div class="text-center">
                    <iframe src="https://player.vimeo.com/video/313088579" width="700" height="450" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                </div>
            </div>
        `},
        {
            day: 5, title: "Day 5 Challenge", videoID: "308895024", description: `
            <div class="column column_12_12">
                <br/>
                <h3>Your Implementation Homework</h3>
                <div class="text-center">
                    <iframe src="https://player.vimeo.com/video/313088616" width="700" height="450" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                </div>
            </div>
        `},
        {
            day: 6, title: "Day 6 Challenge", videoID: "308894981", description: `
            <div class="column column_12_12">
                <br/>
                <h3>Your Implementation Homework</h3>
                <div class="text-center">
                    <iframe src="https://player.vimeo.com/video/313088623" width="700" height="450" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                </div>
            </div>
        `},
        {
            day: 7, title: "Day 7 Challenge", videoID: "308894930", description: `
            <div class="text-center">
                <div class="column column_12_12"> 
                    <div class="text-left">
                        <h3>Shipping</h3>
                    </div>
                    <iframe src="https://player.vimeo.com/video/309192415" width="700" height="450" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                </div>
            </div>
        `},
        {
            day: 8, title: "The Millionaire Blueprint", videoID: "309189371", description: `
            <div class="text-center">
                <div class="column column_6_12">
                    <div class="text-left">
                        <h3>Step 1: Create Campaigns</h3>
                    </div>
                    <iframe src="https://player.vimeo.com/video/309192909" width="560" height="250" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                </div>
                <div class="column column_6_12">
                    <div class="text-left">
                        <h3>Step 2: Create Ads</h3>
                    </div>
                    <iframe src="https://player.vimeo.com/video/309192961" width="560" height="250" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                </div>
                <div class="column column_6_12">
                    <br/>
                    <div class="text-left">
                        <h3>Step 3: Create Adsets</h3>
                    </div>
                    <iframe src="https://player.vimeo.com/video/309192919" width="560" height="250" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                </div>
                <div class="column column_6_12">
                    <br/>
                    <div class="text-left">
                        <h3>Step 4: Share Post ID</h3>
                    </div>
                    <iframe src="https://player.vimeo.com/video/309192987" width="560" height="250" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                </div>
                <div class="column column_12_12">
                    <br/>
                    <h3>2019 Golden Rules</h3>
                    <div class="column column_6_12">
                        <iframe src="https://player.vimeo.com/video/309189821" width="560" height="250" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                    </div>
                    <div class="column column_6_12">
                        <iframe src="https://player.vimeo.com/video/309193008" width="560" height="250" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                    </div>
                    <div class="column column_12_12 clear">
                        <br/><br/>
                        <a href="https://docs.google.com/document/d/1JM4wtxkhMiDewHBCcrn6bYjGiLv-uBj-t9gBRkdVSQ0/edit" target="_blank">Download List of ePacket Countries Here</a>
                    </div>
                </div>
            </div>
        `},
        { day: 9, title: "Millionaire Blueprint #2", videoID: "311583085", description: '' }
    ],
    // global functions
    playSoundEffect: () => {
        new Audio('https://cdn.shopify.com/s/files/1/2865/2146/files/points_receive.wav').play();
    },
    getTypeOfUser: (privilege) => {  // User Privilege
        if (privilege == 0)
            return "Free User (lvl:0)";
        else if (privilege == 1)
            return "Trial User (lvl:1)";
        else if (privilege == 2)
            return "Basic User (lvl:2)";
        else if (privilege == 3)
            return "Full User (lvl:3)";
        else if (privilege == 4)
            return "VIP User (lvl:4)";
        else if (privilege == 5)
            return "Sales Person (lvl:5)";
        else if (privilege == 6)
            return "Reserve (lvl:6)";
        else if (privilege == 7)
            return "Reserve (lvl:7)";
        else if (privilege == 8)
            return "Reserve (lvl:8)";
        else if (privilege == 9)
            return "Reserve (lvl:9)";
        else if (privilege == 10)
            return "Administrator (lvl:10)";
    },
    getCountOfDateDifference: (fromDate) => {
        var timeDiff = Math.abs(new Date().getTime() - fromDate.getTime());
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    },
    getNumberOfDateDifference: (fromDate, toDate) => { // use also in order metrics
        var timeDiff = Math.abs(new Date(fromDate).getTime() - new Date(toDate).getTime());
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    },
    getCompareDateRange: function (fromDate, toDate) { // for order metrics compare date
        var timeDiff = Math.abs(new Date(fromDate).getTime() - new Date(toDate).getTime());
        let diff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        let newFromDate = new Date(this.deducDateFrom(new Date(fromDate).getTime(), diff)).toDateString();
        let newToDate = new Date(this.deducDateFrom(new Date(toDate).getTime(), diff)).toDateString();
        return { start: newFromDate, end: newToDate };
    },
    getPercentageChange: (compare, orig) => {
        let percent = "", color = "", className = "";
        let increase = orig - compare;
        let result = (increase / compare) * 100;
        if (isNaN(result)) {
            result = 0;
        } else if (result < 0) {
            color = "#d63031"; // red
            className = "fas fa-arrow-down";
        } else if (result > 0 || (compare == 0 && orig != 0)) {
            if ((compare == 0 && orig != 0)) result = 100; // handle infinity
            color = "#1dd1a1"; // green
            className = "fas fa-arrow-up";
        }
        if (result == 0) percent = "--";
        else percent = parseFloat(result.toFixed(2)).toString().replace("-", "") + "%";
        return { percent, className, color };
    },
    webSpy: (spyURL, callback) => {
        fetch('https://api.productlistgenie.io/action/spy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ spyURL })
        })
            .then(res => res.json())
            .then(result => {
                callback(result)
            });
    },
    filterPointsByDateRange: (data, fromDate, toDate) => {
        toDate = toDate.getUTCFullYear() + "-" + (toDate.getMonth() + 1) + "-" + toDate.getDate();
        fromDate = fromDate.getUTCFullYear() + "-" + (fromDate.getMonth() + 1) + "-" + fromDate.getDate();
        var newData = [];
        data.map(pointsObj => {
            var date = new Date(parseInt(pointsObj.date));
            date = date.getUTCFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            if (date >= fromDate && date <= toDate) {
                newData.push(pointsObj);
            }
        })
        return newData;
    },
    getDateDifference: (productDate) => {
        let dateNow = new Date();
        let newProductDate = new Date(productDate);
        let timeDiff = Math.abs(dateNow.getTime() - newProductDate.getTime());
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    },
    getPastDate: (howManyDaysInThePast, isExactDay) => {
        if (howManyDaysInThePast && typeof howManyDaysInThePast === "string") howManyDaysInThePast = parseInt(howManyDaysInThePast);
        if (!isExactDay) {
            return new Date(new Date().getTime() - (86400000 * howManyDaysInThePast))
        } else {
            return new Date(new Date(new Date().getTime() - (86400000 * howManyDaysInThePast)).toDateString())
        }
    },
    getFutureDate: (howManyDaysInTheFuture) => {
        return new Date(new Date().getTime() + (86400000 * howManyDaysInTheFuture))
    },
    deducDateFrom: (from, howManyDaysInThePast) => {
        return new Date(from - (86400000 * howManyDaysInThePast)).getTime();
    },
    addDateFrom: (from, howManyDaysInTheFuture) => {
        return new Date(from + (86400000 * howManyDaysInTheFuture)).getTime();
    },
    adjustDateForFETimezone: (date, offset) => {
        let date_offset_to_minute = date.getTimezoneOffset() * 60000;
        let offset_to_minute = offset * 60000;
        let difference_in_offset = date_offset_to_minute - offset_to_minute;
        let new_date = new Date(date);
        // console.log("Before ==>", new_date);
        new_date.setTime(new_date.getTime() + difference_in_offset);
        // console.log("After ==>", new_date);
        return new_date;
    },
    getDatePastSinceJoin: (joinDate) => {
        if (typeof (joinDate) == "string") {
            joinDate = parseInt(joinDate)
        }
        let dateNow = new Date();
        joinDate = new Date(joinDate);
        let timeDiff = Math.abs(dateNow.getTime() - joinDate.getTime());
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    },
    getThisWeekDay: () => {
        return new Date().getDay() - 1; // start from monday
    },
    localToServerTime: (dt, is_string) => {
        var now = dt ? new Date(dt) : new Date();
        var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        return is_string ? utc : Date.parse(utc)
    },
    sendDateToServer: (date, isStart) => {
        let from = new Date(date);
        if (isStart) from.setHours(0, 0, 0, 0);
        else from.setHours(23, 59, 59, 999);
        var p = Date.parse(from);
        var pr = new Date(p);
        return pr.toISOString();
    },
    commafy: (num) => {
        if (typeof num === "undefined") num = 0;
        num = parseFloat(num);
        var str = num.toString().split('.');
        if (str[0].length >= 4) str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        if (str[1] && str[1].length >= 4) str[1] = str[1].replace(/(\d{3})/g, '$1 ');
        return str.join('.');
    },
    kFormatter: (num) => {
        return num > 999 && num < 999999 ? (num / 1000).toFixed(1) + 'K' : num > 999999 ? (num / 1000000).toFixed(1) + 'M' : num;
    },
    getWeekOfTheYear: () => {
        var onejan = new Date(new Date().getFullYear(), 0, 1);
        var millisecsInDay = 86400000;
        return Math.ceil((((new Date() - onejan) / millisecsInDay) + onejan.getDay() + 1) / 7);
    },
    getMondayDateOfTheWeek: (d) => {
        d = new Date(d.toDateString());
        var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    },
    getCurrentDateOfTheYear: () => {
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        return day;
    },
    getServerTime: (callback) => {
        fetch('/getServerTime')
            .then(res => res.json())
            .then(response => {
                callback(response.time)
            });
    },
    getMysteryProduct: (callback) => {
        var payload = { "query": "{\n  getAdminSettings {\n    mystery_product_url\n  }\n}\n", "variables": null, "operationName": null };
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(result => {
                callback(result);
            });
    },
    /* String Manipulation */
    formatMessage: msg => {
        if (!msg) return "";
        msg = " " + msg + " "; // add space start and end to fit the regex for new_link variable
        msg = msg.replace(/\n/g, " <br> "); // to present paragraph
        let regex = new RegExp("(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])", "igm");
        let links = msg.match(regex);
        if (links && links.length !== 0) {
            links.forEach(link => {
                let new_link = link.substring(0, 4).toLowerCase() === "www." ? link.replace("www.", "https://www.") : link;
                msg = msg.replace(" " + link + " ", ` <a href="${new_link}" target="_blank">${link}</a> `); // add space start and end to prevent changing the other link unless completely same
            });
        }
        return msg;
    },
    copyToClipBoard: (id, bool) => {
        var copyText = document.getElementById(id);
        copyText.select();
        document.execCommand("copy");
        if (!bool) {
            window.getSelection().removeAllRanges();
        }
    },
    copyStringToClipboard: str => {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        if (selected) {
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(selected);
        }
    },
    getStringFromClipboard: e => {
        var clipboardData, pastedData;
        // Stop data actually being pasted into input field
        e.stopPropagation();
        e.preventDefault();
        // Get pasted data via clipboard API
        clipboardData = e.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('Text');
        return pastedData;
    },
    isValidString: str => {
        return !/[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/g.test(str);
    },
    smoothScrollInto: el => {
        el.scrollIntoView({ behavior: 'smooth' });
    },
    groupBy: key => array =>
        array.reduce((objectsByKeyValue, obj) => {
            const value = obj[key];
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
            return objectsByKeyValue;
        }, {}),
    isObjectEmpty: obj => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },
    isArray: data => {
        let isArray = data instanceof Array;
        return isArray;
    },
    sortObjectByValue: (list, order) => { // order value "asc" or "desc"
        if (!order) order = "asc";
        var sortable = [];
        for (var key in list) {
            sortable.push([key, list[key]]);
        }
        // [["you",100],["me",75],["foo",116],["bar",15]]

        sortable.sort(function (a, b) {
            if (order === "asc") return (a[1] < b[1] ? -1 : (a[1] > b[1] ? 1 : 0));
            else if (order === "desc") return (a[1] < b[1] ? 1 : (a[1] > b[1] ? -1 : 0));
        });
        // [["bar",15],["me",75],["you",100],["foo",116]]

        var orderedList = {};
        for (var idx in sortable) {
            orderedList[sortable[idx][0]] = sortable[idx][1];
        }

        return orderedList;
    },
    sortArrayByValue: (arr, key, val) => {
        let sorted_array = arr.filter(e => {
            let isArray = e[key] instanceof Array;
            if (isArray) return e[key].includes(val);
            else return e[key] === val;
        });
        let not_equal_val = arr.filter(e => {
            let isArray = e[key] instanceof Array;
            if (isArray) return !e[key].includes(val);
            else return e[key] !== val;
        });
        sorted_array.push(...not_equal_val);
        return sorted_array;
    },
    distinctObject: (array, distinctBy) => {
        // single object only
        const result = [];
        const map = new Map();
        for (const item of array) {
            if (!map.has(item[distinctBy])) {
                map.set(item[distinctBy], true);
                result.push(item);
            }
        }
        return result;
    },
    getStoreNameID: (str) => {
        return str.substring(0, str.indexOf(".")).substring(0, 17)
    },
    fetchGET: (url, callback) => {
        fetch(url)
            .then(res => res.json())
            .then(result => callback(result))
            .catch(err => {
                console.log("Error ==>", err);
                throw new Error("An error has occurred while trying to get data from " + url);
            })
    },
    sendPOST: (url, payload) => {
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).then(res => console.log("Send POST Success."));
    },
    customFetch: (url, method, body, callback) => {
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 664b31fc11dbbbaad076958eb33adcba39ababbb453a2ec8a25eb142d26c6157'
            },
            body: body ? JSON.stringify(body) : null
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('\nURL => ' + url + ', ERROR => ' + res.statusText);
                }
            })
            .then(result => {
                callback(result);
            })
            .catch(err => {
                if (url !== "https://stats.productlistgenie.io/console" && url !== "http://localhost:3000/graphql" && err.message) console.log("CUSTOM FETCH failed message ==>", err.message);
                callback(null);
            })
    },
    customFetchWithHeaders: (url, method, headers, body, callback) => {
        fetch(url, {
            method: method,
            headers: headers ? headers : { 'Content-Type': 'application/json', },
            body: body ? JSON.stringify(body) : null
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('\nURL => ' + url + ', ERROR => ' + res.statusText);
                }
            })
            .then(result => {
                callback({ data: result, status: "success", message: "" });
            })
            .catch(err => {
                callback({ data: null, status: "error", message: err.message });
            })
    },
    getHomepageSliderImageContent: function (callback) {
        this.customFetch('/api/getHomepageSliderContent', 'GET', null, result => {
            callback(result);
        });
    },
    getPaginationOffset: (currentPage, pageLimit) => {
        return (currentPage - 1) * pageLimit;
    },
    encodeDomain: str => {
        return str ? str.trim().replace(/\s/g, "-").match(/[a-zA-Z0-9]*[-_]*[a-zA-Z0-9]*/g).join('').toLowerCase() : str;
    },
    capitalizeWord: str => {
        if (!str) str = "";
        if (str) str = str.toLowerCase();
        var splitted = str.split(" ");
        var capitalize = "";
        splitted.forEach(el => {
            capitalize += el.charAt(0).toUpperCase() + el.substring(1) + " ";
        })
        return capitalize.trim();
    },
    presentableFunnelName: function (funnel_name) {
        if (!funnel_name) funnel_name = "";
        return this.capitalizeWord(funnel_name.replace(/-|_/g, " "));
    },
    capitalizeAndSerializeWord: function (str) {
        str = str.replace(/[!@#$%^&*(),.?":{}|<>\s\\+_-]/g, " ").replace(/\s\s+/g, " ");
        return this.capitalizeWord(str);
    },
    getPageIcon: (path, type) => {
        if (path.includes("homepage")) {
            return "fas fa-home";
        } else if (type == "page") {
            return "fas fa-sticky-note";
        } else if (type == "product-page") {
            return "fas fa-box-open";
        } else if (type == "checkout") {
            return "fas fa-shopping-cart";
        } else if (type == "upsell") {
            return "fas fa-arrow-up";
        } else if (type == "downsell") {
            return "fas fa-arrow-down red";
        } else if (type == "thank-you-page") {
            return "far fa-star";
        }
    },
    addCounterToPath: str => {
        var duplicateCounterRegex = new RegExp(/\-\d+/, "g");
        if (str.match(duplicateCounterRegex)) {
            str = str.replace(duplicateCounterRegex, "") + "-" + (parseInt(str.match(duplicateCounterRegex).toString().replace("-", "")) + 1);
        } else {
            str = str + "-1";
        }
        return str;
    },
    getBGandFontColor: status => {
        var bg = "", color = "";
        // #ff6b6b = unfulfilled, #feca57 = preparing, #54a0ff = shipped, #f367e0 = in transit, #5f27cd = delivering, #1dd1a1 = fulfilled
        // for fulfillment status
        if (status == "unfulfilled") {
            bg = "#ff6b6b"; color = "#fff";
        } else if (status == "fulfilled") {
            bg = "#1dd1a1"; color = "#fff";
        }
        // for order status
        else if (status == "paid" || status == "delivered") {
            bg = "#1dd1a1"; color = "#fff";
        } else if (status == "cancelled") {
            bg = "#d63031"; color = "#fff";
        } else if (status == "pending" || status == "hold") {
            bg = "#feca57"; color = "#fff";
        } else if (status == "pickedup") {
            bg = "#ff7837"; color = "#fff";
        } else if (status == "declined") {
            bg = "#ff8000"; color = "#fff";
        } else if (status == "unpaid") {
            bg = "#ff6b6b"; color = "#fff";
        } else if (status == "confirmed") {
            bg = "#99e4bd"; color = "#484f57"
        }
        return { bg, color }
    },
    list_of_date_filter: function (add_custom, default_label) {
        const date_list = [
            { value: "", label: default_label ? default_label : "Select Date Filter" },
            { value: "0", label: "Today" },
            { value: "1", label: "Yesterday" },
            { value: this.getThisWeekDay(), label: "This Week" },
            { value: "6", label: "Last 7 days" },
            { value: "14", label: "Last 15 days" },
            { value: "29", label: "Last 30 days" }
        ];
        if (add_custom) date_list.push({ value: "custom", label: "Custom" })
        return date_list
    },
    list_of_order_status: [
        { value: "", label: "Select Order Status" },
        { value: "unfulfilled", label: "Unfulfilled" },
        { value: "confirmed", label: "Confirmed" },
        { value: "hold", label: "Hold" },
        { value: "pickedup", label: "Picked-up" },
        { value: "cancelled", label: "Cancelled" },
        { value: "delivered", label: "Delivered" },
        { value: "paid", label: "Paid" }
    ],
    list_of_merchant: [
        { value: "", label: "All Merchant" },
        { value: "authorize.net", label: "Authorize.Net" },
        { value: "stripe", label: "Stripe" },
        { value: "paypal", label: "Paypal" },
        { value: "conekta", label: "Conekta" },
        { value: "cod", label: "COD" },
        { value: "plg_merchant", label: "PLG Merchant" },
        { value: "plgbutton", label: "PLG Button" }
    ],
    cod_available_country: use_in => {
        /*
            this will control all available country in plg except the funnel genie editor
            correction meron pa sa "getCountryTaxable" function para sa computation tax at "funnelEditorData" para sa variant cod country selector
            soon llgyan ng
            -product handle (for niches also for the link)
            -is free (to identify kung kailangan ba i ignore sa condition o hindi)
        */
        const available_country = [
            { iso2: "PE", iso3: "PER", cw: "PEN", cs: "S\/.", name: "Peru", fill: "#fcd116", flag: "https://cdn.countryflags.com/thumbs/peru/flag-round-250.png" },
            { iso2: "PH", iso3: "PHL", cw: "PHP", cs: "₱", name: "Philippines", fill: "#fcd116", flag: "https://cdn.productlistgenie.com/images/NWMzNjEzYWQ3YzUxMTk1MGFjZjE0Yzk3/flag_ph.png" },
            { iso2: "AE", iso3: "ARE", cw: "AED", cs: "د", name: "United Arab Emirates", fill: "#00732F", flag: "https://cdn.productlistgenie.com/images/NWMzNjEzYWQ3YzUxMTk1MGFjZjE0Yzk3/flag_ae.png" },
            { iso2: "SA", iso3: "SAU", cw: "SAR", cs: "﷼", name: "Saudi Arabia", fill: "#006c35", flag: "https://cdn.productlistgenie.com/images/NWMzNjEzYWQ3YzUxMTk1MGFjZjE0Yzk3/flag_sa.png" },
            // { iso2: "IN", iso3: "IND", cw: "INR", cs: "₹", name: "India", fill: "#138808", flag: "https://cdn.productlistgenie.com/images/NWMzNjEzYWQ3YzUxMTk1MGFjZjE0Yzk3/flag_in.png" },
            { iso2: "EG", iso3: "EGY", cw: "EGP", cs: "ج.م", name: "Egypt", fill: "#bf9100", flag: "https://cdn.productlistgenie.com/images/NWMzNjEzYWQ3YzUxMTk1MGFjZjE0Yzk3/flag_eg.png" },
            { iso2: "BH", iso3: "BHR", cw: "BHD", cs: "د.ب", name: "Bahrain", fill: "#ce1025", flag: "https://cdn.productlistgenie.com/images/NWMzNjEzYWQ3YzUxMTk1MGFjZjE0Yzk3/flag_bh.png" },
            { iso2: "KW", iso3: "KWT", cw: "KWD", cs: "د.ك", name: "Kuwait", fill: "#000", flag: "https://cdn.productlistgenie.com/images/NWMzNjEzYWQ3YzUxMTk1MGFjZjE0Yzk3/flag_kw.png" },
            { iso2: "QA", iso3: "QAT", cw: "QAR", cs: "ر.ق", name: "Qatar", fill: "#8d1a3d", flag: "https://cdn.productlistgenie.com/images/NWMzNjEzYWQ3YzUxMTk1MGFjZjE0Yzk3/flag_qa.png" },
            { iso2: "OM", iso3: "OMN", cw: "OMR", cs: "ر.ع", name: "Oman", fill: "#db161b", flag: "https://cdn.productlistgenie.com/images/NWMzNjEzYWQ3YzUxMTk1MGFjZjE0Yzk3/flag_om.png" },

            { iso2: "MX", iso3: "MEX", cw: "MXN", cs: "$", name: "Mexico", flag: "https://cdn.countryflags.com/thumbs/mexico/flag-round-250.png" },
            { iso2: "IL", iso3: "ISR", cw: "ILS", cs: "₪", name: "Israel", flag: "https://cdn.countryflags.com/thumbs/israel/flag-round-250.png" },
            { iso2: "CA", iso3: "CAN", cw: "CAD", cs: "$", name: "Canada", flag: "https://cdn.countryflags.com/thumbs/canada/flag-round-250.png" },
            { iso2: "AU", iso3: "AUS", cw: "AUD", cs: "$", name: "Australia", flag: "https://cdn.countryflags.com/thumbs/australia/flag-round-250.png" },
            { iso2: "US", iso3: "USA", cw: "USD", cs: "$", name: "United States", flag: "https://cdn.countryflags.com/thumbs/united-states-of-america/flag-round-250.png" },

            { iso2: "TW", iso3: "TWN", cw: "TWD", cs: "$", name: "Taiwan", flag: "https://cdn.countryflags.com/thumbs/taiwan/flag-round-250.png" },
            { iso2: "HK", iso3: "HKG", cw: "HKD", cs: "$", name: "Hongkong", flag: "https://cdn.countryflags.com/thumbs/hongkong/flag-round-250.png" },
            { iso2: "ZA", iso3: "ZAF", cw: "ZAR", cs: "R", name: "South Africa", flag: "https://cdn.countryflags.com/thumbs/south-africa/flag-round-250.png" },
            { iso2: "FR", iso3: "FRA", cw: "EUR", cs: "€", name: "France", flag: "https://cdn.countryflags.com/thumbs/france/flag-round-250.png" },
            { iso2: "IN", iso3: "IND", cw: "INR", cs: "₹", name: "India", flag: "https://cdn.productlistgenie.com/images/NWMzNjEzYWQ3YzUxMTk1MGFjZjE0Yzk3/flag_ind.png" },
            { iso2: "DE", iso3: "DEU", cw: "EUR", cs: "€", name: "Germany", flag: "https://cdn.countryflags.com/thumbs/germany/flag-round-250.png" },
            { iso2: "ES", iso3: "ESP", cw: "EUR", cs: "€", name: "Spain", flag: "https://cdn.productlistgenie.com/images/NWMzNjEzYWQ3YzUxMTk1MGFjZjE0Yzk3/flag_esp.png" },
            { iso2: "SG", iso3: "SGP", cw: "SGD", cs: "$", name: "Singapore", flag: "http://cdn.countryflags.com/thumbs/singapore/flag-round-250.png" },
            { iso2: "MY", iso3: "MYS", cw: "MYR", cs: "RM", name: "Malaysia", flag: "http://cdn.countryflags.com/thumbs/malaysia/flag-round-250.png" },
            { iso2: "BD", iso3: "BGD", cw: "BDT", cs: "৳", name: "Bangladesh", flag: "http://cdn.countryflags.com/thumbs/bangladesh/flag-round-250.png" },
            { iso2: "MA", iso3: "MAR", cw: "MAD", cs: "DH", name: "Morocco", flag: "http://cdn.countryflags.com/thumbs/morocco/flag-round-250.png" },
            { iso2: "SN", iso3: "SEN", cw: "XOF", cs: "CFA", name: "Senegal", flag: "http://cdn.countryflags.com/thumbs/senegal/flag-round-250.png" }
        ];
        if (use_in == "order_filter") {
            return [...available_country.map(e => e.iso2), ...available_country.map(e => e.iso3)];
        } else if (use_in == "no_country") {
            return available_country;
        }
    },
    tag_suggestion: function () {
        return [
            ...this.cod_available_country("no_country").map(e => {
                return { tag: e.name.toLowerCase(), description: "Access to " + e.name + " cod product" }
            }),
            ...this.cod_available_country("no_country").map(e => {
                return { tag: e.iso2.toLowerCase(), description: "Fulfiller in " + e.name };
            }),
            { tag: "import_tracking", description: "Import tracking (CSV)" },
            { tag: "xvip", description: "Show VIP user in admin COD payout AND show product that has xvip or cod_arabicfunnel tag and Publish all feature" },
            { tag: "free_domain", description: "Unlimited Free Domain" },
            { tag: "fa_subscriber", description: "Access to Authorize subscriber" },
            { tag: "i_conekta", description: "To add Conekta Integration" },
            { tag: "fc_subscriber", description: "Access to Conekta subscriber" },
            { tag: "add_max_funnel_20", description: "Add 20 more funnel limit (replace 20 to any number)" },
            { tag: "dev", description: "Development Account" },
            { tag: "checkout_test", description: "Development account in Funnel Editor must have dev tag" },
            { tag: "god", description: "All Functionality" }
        ]
    },
    courier_available_location: (courier_name, country, city) => {
        if (courier_name) courier_name = courier_name.toLowerCase();
        if (country) country = country.toLowerCase();
        if (city) city = city.toLowerCase();
        let isARE = (country == "ae" || country == "are"), isSAU = (country == "sa" || country == "sau");
        const sau_cities = {
            "fetchr": ["abha", "abu ajram", "abu arish governorate", "ad darb", "afif", "ahad al masarihah", "ahad rafidah", "ain dar", "al aflaj", "al ahsa", "al aqiq", "al ardah", "al artawiyah", "al bada", "al badayea", "al bahah", "al bukayriyah", "al dulaymiyah", "al duwadimi", "al ghat", "alhada", "al henakiyah", "al hofuf", "al hudud al shamaliyah", "al jawf region", "al jubail", "al kharj", "al khobar", "al khurma", "al madinah province", "almajaridah", "al majmaah", "al makhwah", "al mithnab", "al muzahimiyah", "al qahma", "al qasab", "al qassim", "al qunfudhah", "al qurayyat", "al ula", "al wadeen", "al wajh", "amaq", "anak", "arar", "ar rass", "aseer province", "asfan", "as sahna", "assiyah", "as sulayyil", "at taniem", "at tarif al jadid", "ayn fuhayd", "az zulfi", "badr", "bahara", "baish", "balasmar", "baljurashi", "bareq", "batha", "birk", "bisha", "buqayq", "buraydah", "damad", "dammam", "dariyah", "dereiyeh", "dhahran", "dhahran al janoob", "dhurma", "dilam", "duba", "dumah al jandal", "eastern province", "farasan island", "gizan", "hafer al batin", "hail", "hail province", "halat ammar", "harad", "hareeq", "hautat sudair", "haweyah", "howtat bani tamim", "huraymila", "ja'araneh", "jalajil", "jeddah", "jizan", "jumum", "karboos", "khafji", "khaibar", "khamis mushait", "khulays", "laith", "mahad al dahab", "makkah province", "marat", "mastura", "mecca", "medina", "mubaraz", "muhayil", "mulaija", "nairyah", "najran", "najran region", "namas", "nwariah", "othmanyah", "oyaynah", "qarah", "qariya a; olaya", "qatif", "qaysoomah", "quwei'ieh", "rabigh", "rafha", "rania", "ras al kheir", "ras tanura", "raudat sudair", "rejal alma'a", "remah", "riyadh", "riyadh province", "sabt al alayah", "sabya", "safanyah", "safwa", "saihat", "sajir", "sakaka", "salbookh", "salwa", "samtah", "sarar", "sarat obeida", "shaqra", "sharurah", "shefa'a", "tabuk", "tabuk province", "taif", "tanomah", "tarut", "tatleeth", "tayma", "thadek", "thuwal", "tubarjal", "turaif", "turba", "udhaliyah", "uglat asugour", "umm al jamajm", "umm lajj", "unayzah", "uyun", "wadi ad dawasir", "yanbu al bahar"],
            "wimo": ["abha", "abqaiq", "abu arish", "abu hadriyah", "ad darb", "afif", "afifah", "ahad al masarihah", "ahad rafidah", "aindar", "al aqiq", "al aridhah", "al atawilah", "al badayea", "al bahah", "al birk", "al dhabyah", "al ghat", "al hadror", "al harajah", "al hassa", "al henakiyah", "al hofuf", "al huwaya", "al jaradiyah", "al jarn", "al ju'ranah", "al jubail", "al jumum", "al karbus", "al kharj", "al khobar", "al khurma", "al lith", "al madaya", "al majmaah", "al makhwah", "al mithnab", "al mubarakah", "al muzahimiyah", "al namas", "al nuzha", "al oyun hofuf", "al qasab", "al qatif", "al qunfudhah", "al qurayyat", "al salamah", "al shuqaiq", "al taraf", "al tuwal", "al ula", "al wadeen", "al-jsh", "al-matan", "al-umran", "al-wozeyh", "albada", "aldalemya", "algayed", "alhada", "alkhhafah", "almajaridah", "almandaq", "almuzaylif", "alqaisumah", "alrass", "alsilaa", "al_aflaj", "al_ahmar_aflaj", "al_badie_shamali_aflaj", "al_bijadyah", "al_duwadimi", "al_hadithah", "al_hariq", "al_khuraybah", "al_muwaylih", "al_uyaynah", "amaq", "an nawwariyyah", "anak", "arar", "artawiah", "ar_rayn", "asfan", "as shanan", "ash shuqaiq", "assadawi", "assaffaniyah", "assalmanyah", "assarrar", "ath thaybiyah", "awamiah", "ayn ibn fuhayd", "badr", "bahara", "bahrah", "baish", "baljurashi", "baqayq - hofuf", "bariq", "batha", "billasmar", "bishah", "bukeiriah", "buraydah", "daelim", "damad", "dammam", "dereiyah", "dhahban", "dhahran", "dhahran al janub", "dhurma", "domat al jandal", "duba", "dumah al jandal", "farasan island", "gayal", "ghtai", "hadeethah", "hafar al batin", "hail", "halatammar", "haqil", "harad", "hawiyah", "horaimal", "hotat sudair", "howtat_bani_tamim", "jalajel", "jazan", "jazan economic city", "jeddah", "jouf", "juatha", "judah", "julayjilah", "khafji", "khamis mushait", "khaybar", "khulais", "king khalid military city", "layla_aflaj", "mahalah", "mahd al thahab", "manifah", "marat", "mastorah", "mecca", "medina", "mubaraz", "muhayil", "mulayjah", "nabiya", "najran", "nayriyah", "nimran", "qarah", "qariya al olaya", "qassim", "qilwah", "qlayyb khedr", "quweiieh", "rabigh", "rafha", "rahima", "ranyah", "ras al kheir", "ras tanura", "raudatsudair", "rejal almaa", "rejalalmaa", "remah", "riyadh", "riyadh al khabra", "rowdat sodair", "sabt alalayah", "sabya", "safwa", "sajir", "sakaka", "salasil", "salbookh", "salwa", "samtah", "sarat abidah", "seihat", "shaqra", "sharmaa", "sharurah", "shefa", "shefa'a", "sulayyil", "tabuk", "taif", "tanomah", "tarut", "tathleeth", "tayma", "thadiq", "thumair", "tubarjal", "turaif", "turbah", "udhailiyah - hofuf", "um saad", "umaljamajim", "umluj", "unayzah", "uqlat al suqur", "urayrah", "uthmaniyah", "wadiaddawasir", "wajeh", "yanbu", "zulfi"]
        };
        const are_cities = {
            "fetchr": ["abha", "abu dhabi", "ajman", "al ain", "dubai", "fujairah", "rak", "sharjah", "umm al quwain", "western region"],
            "wimo": ["abu dhabi", "ajman", "al ain", "dubai", "fujairah", "rak", "sharjah", "umm al quwain", "western region"],
            "taqadum": ["abu dhabi", "ajman", "al ain", "dubai", "fujairah", "ras al-khaimah", "sharjah", "umm al quwain"]
        };
        if (!courier_name) { // walang courier name
            return false;
        } else if (!country) { // walang country
            return false;
        } else if (courier_name == "safearrival") { // kapag safearrival
            return true;
        } else if (courier_name == "wimo") { // kapag wimo
            if (!city) return false;
            const city_list = getCityList();
            return city_list.includes(city);
        } else if (courier_name == "fetchr") { // kapag fetchr
            if (!city) return false;
            const city_list = getCityList();
            return city_list.includes(city);
        } else if (courier_name == "taqadum") {
            if (!city) return false;
            else if (isSAU) return false;
            const city_list = getCityList();
            return city_list.includes(city);
        }

        function getCityList() {
            var list = [];
            if (isSAU) list = sau_cities[courier_name];
            else if (isARE) list = are_cities[courier_name];
            return list;
        }
    },
    cod_available_courier: [
        {
            value: "safearrival",
            label: "Safe Arrival"
        },
        {
            value: "taqadum",
            label: "Taqadum"
        },
        {
            value: "wimo",
            label: "Wimo"
        },
        {
            value: "fetchr",
            label: "Fetchr"
        },
        {
            value: "aramex",
            label: "Aramex"
        },
    ],
    emailConfiguration: {
        "type": "service_account",
        "project_id": "plg-mailer",
        "private_key_id": "e1d01ecdc59b52bea8445bbcd5f1447064b3ad2d",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDRrxH+w8VVc80z\n40Ljzlyve5jU3TKK13F8hh6ondFKiRUsuHU/D7v148iU357ePFGaFmLTNxFpFEZu\nbDDDybZ6EjN3p8vUE4JKMl0ua5sBXJ9x5DndFcD0OuGnSQuj1f/UcYWFxMroERdg\nL57ikP5Bu7RZ8EjyfE5a/Q1PALoZVbK/YI5FjJHrzr2YTDE89mFD49gCVsV6T+cn\nOVmcqmZqWioJAvchTHGlBvU0eFybSfjkalI6SLrgB5EMORWwhQ+RTJLYpUPbW5Gq\niPHSr8a+kZ/pCsCOVOXZK8iZVOdWecPJn7ts/pgUqrsm1c5Idx9I3/M31YV1UNW4\nSPkA84ntAgMBAAECggEABf5azAbDir3cvtMME+y2C7jdAjFw1htZBDKybwzUl5Lt\nVuubQ/PkSJ+75lZLOVYAprnLr5B/TM4gD0L3bkYQE1NjqW1tImdzJ3TJSUZ/iUPt\nzzizVx73XRcCLgc+YzuYOVw/V7bSB/a8TZ4+2YIRSnnqxB4qr6FSMHNtE6kh9XX6\nf1He7RJZpEu4u7NFPQiUVPG0srZyITQe6nhD3sGrZXuVex6KX6LFENAkwwNvDQiB\nQi/i36kVLL7kGLUlOxwVYvLR4GkNND3+DGOTKFN6XqFzAvtgl9ScvTEt7x9Q6qy7\nh6TWr2VqwuJj/3GdBWh9D9ZSrIYBl0paIaTqJPCBbwKBgQDod0M88B2xkJ4/wWh5\nq+2hz90x0bZhKcXJo8tLPftUN1okn9LJ8JxiWQ9ilcdxWf1lgvVX7L+OGPUwKJs4\nvzdcC19ICvZ5fPAllj3CuF+D2FeCXJYofC/dL0U6jECyzCR8yh2Fq03y7tHREwMm\n3v1IplhUO8rG5sY/WIBjLjJjZwKBgQDm6V/Zj799GIT0l3BmgDyPMkLoxE5WSW0r\nKq/yYSbmCcJ2RpHqLTzwgp1zYst58YLQ6yWLVLBghp2A4XqkJ2r1yKthBRDsDkHI\ntUXSF//I0n26Rs2BsvLRBCkB+iihUh6IJVN0oLpeBH7xEc/+cjF/BTnHkL3N6uNw\nXssWcApHiwKBgEau1LP3sp+mAGgUT8cHHtcfk/ss7851XB1mf07ehsfhmLggHICo\nd3Rz7fik4CK4IRM3kY/tfYUgU5UUE7ZadeO31X3bT3w7H+3d0+OcGfbF1j3eFw4y\nTH9texhFQvralZGYBwf4wVfHg+aVaFTuYocvhRX/pDV8P/VM3KTLjCirAoGAFh6p\nBehVSaB9rAiNxePm6TjBXBbiAjYKdSYjsK5J0aOBs17TP4GR4uBAQPtnzoiqJWVB\nNXWpZ7W9hMkUvIDiKCVO9X5MvrAm8RkcVSHjaNNxI9UAfrortIYXf479MWbyccxR\nkEyNTdBUcLdqG0/JGgfgHxPoer9ThkIuZjnZYj0CgYAHTYrDWs6zzsAFVBZfXcWj\nXW///g9k1UIbjkXp/7Lx8d8QTDu5uJLeOgnZ2GKHa0iz7ZeHxD6MxJ+kWMhitVNI\nL/urLIBxqtHZF8GRLi5sCw3htwdGaIqQKUB2mQSzAWILlsgHf8vR1K3odrfXDQH1\nZL07v2PVrV4yGp/TrzHrJA==\n-----END PRIVATE KEY-----\n",
        "client_email": "no-reply@plgenie.io",
        "client_id": "104609912315763900916",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/plg-mailer%40plg-mailer.iam.gserviceaccount.com"
    },
    generatedButtonCountryList: {
        "list": [
            { iso2: "PE", iso3: "PER", cw: "PEN", cs: "S\/.", name: "Peru" },
            { iso2: "PH", iso3: "PHL", cw: "PHP", cs: "₱", name: "Philippines", },
            { iso2: "AE", iso3: "ARE", cw: "AED", cs: "د", name: "United Arab Emirates", },
            { iso2: "SA", iso3: "SAU", cw: "SAR", cs: "﷼", name: "Saudi Arabia", },
            { iso2: "EG", iso3: "EGY", cw: "EGP", cs: "ج.م", name: "Egypt", },
            { iso2: "BH", iso3: "BHR", cw: "BHD", cs: "د.ب", name: "Bahrain", },
            { iso2: "KW", iso3: "KWT", cw: "KWD", cs: "د.ك", name: "Kuwait", },
            { iso2: "QA", iso3: "QAT", cw: "QAR", cs: "ر.ق", name: "Qatar", },
            { iso2: "OM", iso3: "OMN", cw: "OMR", cs: "ر.ع", name: "Oman", },
            { iso2: "MX", iso3: "MEX", cw: "MXN", cs: "$", name: "Mexico", },
            { iso2: "IL", iso3: "ISR", cw: "ILS", cs: "₪", name: "Israel", },
            { iso2: "CA", iso3: "CAN", cw: "CAD", cs: "$", name: "Canada", },
            { iso2: "AU", iso3: "AUS", cw: "AUD", cs: "$", name: "Australia", },
            { iso2: "US", iso3: "USA", cw: "USD", cs: "$", name: "United States", },
            { iso2: "TW", iso3: "TWN", cw: "TWD", cs: "$", name: "Taiwan", },
            { iso2: "HK", iso3: "HKG", cw: "HKD", cs: "$", name: "Hongkong", },
            { iso2: "ZA", iso3: "ZAF", cw: "ZAR", cs: "R", name: "South Africa", },
            { iso2: "FR", iso3: "FRA", cw: "EUR", cs: "€", name: "France", },
            { iso2: "IN", iso3: "IND", cw: "INR", cs: "₹", name: "India", },
            { iso2: "DE", iso3: "DEU", cw: "EUR", cs: "€", name: "Germany", },
            { iso2: "ES", iso3: "ESP", cw: "EUR", cs: "€", name: "Spain", },
            { iso2: "SG", iso3: "SGP", cw: "SGD", cs: "$", name: "Singapore", },
            { iso2: "MY", iso3: "MYS", cw: "MYR", cs: "RM", name: "Malaysia", },
            { iso2: "BD", iso3: "BGD", cw: "BDT", cs: "৳", name: "Bangladesh", },
            { iso2: "MA", iso3: "MAR", cw: "MAD", cs: "DH", name: "Morocco", },
            { iso2: "SN", iso3: "SEN", cw: "XOF", cs: "CFA", name: "Senegal", }
        ],
    },
    funnelEditorData: {
        paypalCurrencyList: {
            "label": "Paypal Currency",
            "list": [
                { "value": "USD,$", "label": "United States / USD" },
                // paypal supports
                { "value": "AUD,$", "label": "Australian / AUD" },
                { "value": "BRL,R$", "label": "Brazillian Real / BRL" },
                { "value": "MXN,Mex$", "label": "Mexican Peso / MXN" },
                { "value": "EUR,€", "label": "Euro / EUR" },
                // end
                // { "value": "EGP,ج.م", "label": "Egypt / EGP" },
                // { "value": "BHD,د.ب", "label": "Bahrain / BHD" },
                // { "value": "KWD,د.ك", "label": "Kuwait / KWD" },
                // { "value": "QAR,ر.ق", "label": "Qatar / QAR" },
                // { "value": "OMR,ر.ع", "label": "Oman / OMR" },
                // { "value": "MEX,$", "label": "Mexico / MEX" },
                // { "value": "CHL,$", "label": "Chile / CHL" }, 
                // { "value": "ISR,₪", "label": "Israel / ISR" },
                // { "value": "CAN,$", "label": "Canada / CAN" },
                // { "value": "AUS,$", "label": "Australia / AUS" },
                // { "value": "TWN,$", "label": "Taiwan / TWN" },
                // { "value": "HKG,$", "label": "Hongkong / HKG" },
                // { "value": "ZAF,R", "label": "South Africa / ZAF" },
                // { "value": "FRA,€", "label": "France / FRA" },
                // { "value": "IND,₹", "label": "India / IND" },
                // { "value": "DEU,€", "label": "Germany / DEU" },
                // { "value": "ESP,€", "label": "Spain / ESP" },
                // { "value": "SGP,$", "label": "Singapore / SGP" },
                // { "value": "MYS,RM", "label": "Malaysia / MYS" },
                // { "value": "PEN,S\/.", "label": "Peru / PER" },
                // { "value": "PHP,₱", "label": "Philippines / PHP" },
                // { "value": "AED,د", "label": "United Arab Emirates / AED" },
                // { "value": "SAR,﷼", "label": "Saudi Arabia / SAR" },
                // { "value": "BDT,৳", "label": "Bangladeshi taka / SAR" },
            ],
            // { "value": "PRI,$", "label": "Puerto Rico / PRI" },
            // { "value": "INR,₹", "label": "India / INR" },
            "selected": "USD,$"
        },
        codCurrencyList: {
            "label": "COD Currency",
            "list": [
                { "value": "USD,$", "label": "Disable COD currency" },
                { "value": "EGP,ج.م", "label": "Egypt / EGP" },
                { "value": "BHD,د.ب", "label": "Bahrain / BHD" },
                { "value": "KWD,د.ك", "label": "Kuwait / KWD" },
                { "value": "QAR,ر.ق", "label": "Qatar / QAR" },
                { "value": "OMR,ر.ع", "label": "Oman / OMR" },
                { "value": "MEX,$", "label": "Mexico / MEX" },
                { "value": "CHL,$", "label": "Chile / CHL" },
                { "value": "ISR,₪", "label": "Israel / ISR" },
                { "value": "CAN,$", "label": "Canada / CAN" },
                { "value": "AUS,$", "label": "Australia / AUS" },
                { "value": "TWN,$", "label": "Taiwan / TWN" },
                { "value": "HKG,$", "label": "Hongkong / HKG" },
                { "value": "ZAF,R", "label": "South Africa / ZAF" },
                { "value": "FRA,€", "label": "France / FRA" },
                { "value": "IND,₹", "label": "India / IND" },
                { "value": "DEU,€", "label": "Germany / DEU" },
                { "value": "ESP,€", "label": "Spain / ESP" },
                { "value": "SGP,$", "label": "Singapore / SGP" },
                { "value": "MYS,RM", "label": "Malaysia / MYS" },
                { "value": "PEN,S\/.", "label": "Peru / PER" },
                { "value": "PHP,₱", "label": "Philippines / PHP" },
                { "value": "AED,د", "label": "United Arab Emirates / AED" },
                { "value": "SAR,﷼", "label": "Saudi Arabia / SAR" },
                { "value": "BDT,৳", "label": "Bangladeshi taka / SAR" },
                { "value": "MAD,DH", "label": "Moroccan Dirham / MAD" },
                { "value": "XOF,CFA", "label": "Senegal Franc / CFA" },
            ],
            // { "value": "PRI,$", "label": "Puerto Rico / PRI" },
            // { "value": "INR,₹", "label": "India / INR" },
            "selected": "USD,$"
        },
        countryList: { "label": "Select Country", "list": [{ value: "", label: "Select Country" }, { value: "USA", label: "United States of America" }, { value: "AFG", label: "Afghanistan" }, { value: "ALA", label: "Åland Islands" }, { value: "ALB", label: "Albania" }, { value: "DZA", label: "Algeria" }, { value: "ASM", label: "American Samoa" }, { value: "AND", label: "Andorra" }, { value: "AGO", label: "Angola" }, { value: "AIA", label: "Anguilla" }, { value: "ATA", label: "Antarctica" }, { value: "ATG", label: "Antigua and Barbuda" }, { value: "ARG", label: "Argentina" }, { value: "ARM", label: "Armenia" }, { value: "ABW", label: "Aruba" }, { value: "AUS", label: "Australia" }, { value: "AUT", label: "Austria" }, { value: "AZE", label: "Azerbaijan" }, { value: "BHS", label: "Bahamas" }, { value: "BHR", label: "Bahrain" }, { value: "BGD", label: "Bangladesh" }, { value: "BRB", label: "Barbados" }, { value: "BLR", label: "Belarus" }, { value: "BEL", label: "Belgium" }, { value: "BLZ", label: "Belize" }, { value: "BEN", label: "Benin" }, { value: "BMU", label: "Bermuda" }, { value: "BTN", label: "Bhutan" }, { value: "BOL", label: "Bolivia (Plurinational State of)" }, { value: "BES", label: "Bonaire, Sint Eustatius and Saba" }, { value: "BIH", label: "Bosnia and Herzegovina" }, { value: "BWA", label: "Botswana" }, { value: "BVT", label: "Bouvet Island" }, { value: "BRA", label: "Brazil" }, { value: "IOT", label: "British Indian Ocean Territory" }, { value: "BRN", label: "Brunei Darussalam" }, { value: "BGR", label: "Bulgaria" }, { value: "BFA", label: "Burkina Faso" }, { value: "BDI", label: "Burundi" }, { value: "CPV", label: "Cabo Verde" }, { value: "KHM", label: "Cambodia" }, { value: "CMR", label: "Cameroon" }, { value: "CAN", label: "Canada" }, { value: "CYM", label: "Cayman Islands" }, { value: "CAF", label: "Central African Republic" }, { value: "TCD", label: "Chad" }, { value: "CHL", label: "Chile" }, { value: "CHN", label: "China" }, { value: "CXR", label: "Christmas Island" }, { value: "CCK", label: "Cocos (Keeling) Islands" }, { value: "COL", label: "Colombia" }, { value: "COM", label: "Comoros" }, { value: "COD", label: "Congo (the Democratic Republic of the)" }, { value: "COG", label: "Congo" }, { value: "COK", label: "Cook Islands" }, { value: "CRI", label: "Costa Rica" }, { value: "CIV", label: "Côte d'Ivoire" }, { value: "HRV", label: "Croatia" }, { value: "CUB", label: "Cuba" }, { value: "CUW", label: "Curaçao" }, { value: "CYP", label: "Cyprus" }, { value: "CZE", label: "Czechia" }, { value: "DNK", label: "Denmark" }, { value: "DJI", label: "Djibouti" }, { value: "DMA", label: "Dominica" }, { value: "DOM", label: "Dominican Republic" }, { value: "ECU", label: "Ecuador" }, { value: "EGY", label: "Egypt" }, { value: "SLV", label: "El Salvador" }, { value: "GNQ", label: "Equatorial Guinea" }, { value: "ERI", label: "Eritrea" }, { value: "EST", label: "Estonia" }, { value: "SWZ", label: "Eswatini" }, { value: "ETH", label: "Ethiopia" }, { value: "FLK", label: "Falkland Islands [Malvinas]" }, { value: "FRO", label: "Faroe Islands" }, { value: "FJI", label: "Fiji" }, { value: "FIN", label: "Finland" }, { value: "FRA", label: "France" }, { value: "GUF", label: "French Guiana" }, { value: "PYF", label: "French Polynesia" }, { value: "ATF", label: "French Southern Territories" }, { value: "GAB", label: "Gabon" }, { value: "GMB", label: "Gambia" }, { value: "GEO", label: "Georgia" }, { value: "DEU", label: "Germany" }, { value: "GHA", label: "Ghana" }, { value: "GIB", label: "Gibraltar" }, { value: "GRC", label: "Greece" }, { value: "GRL", label: "Greenland" }, { value: "GRD", label: "Grenada" }, { value: "GLP", label: "Guadeloupe" }, { value: "GUM", label: "Guam" }, { value: "GTM", label: "Guatemala" }, { value: "GGY", label: "Guernsey" }, { value: "GIN", label: "Guinea" }, { value: "GNB", label: "Guinea-Bissau" }, { value: "GUY", label: "Guyana" }, { value: "HTI", label: "Haiti" }, { value: "HMD", label: "Heard Island and McDonald Islands" }, { value: "VAT", label: "Holy See" }, { value: "HND", label: "Honduras" }, { value: "HKG", label: "Hong Kong" }, { value: "HUN", label: "Hungary" }, { value: "ISL", label: "Iceland" }, { value: "IND", label: "India" }, { value: "IDN", label: "Indonesia" }, { value: "IRN", label: "Iran (Islamic Republic of)" }, { value: "IRQ", label: "Iraq" }, { value: "IRL", label: "Ireland" }, { value: "IMN", label: "Isle of Man" }, { value: "ISR", label: "Israel" }, { value: "ITA", label: "Italy" }, { value: "JAM", label: "Jamaica" }, { value: "JPN", label: "Japan" }, { value: "JEY", label: "Jersey" }, { value: "JOR", label: "Jordan" }, { value: "KAZ", label: "Kazakhstan" }, { value: "KEN", label: "Kenya" }, { value: "KIR", label: "Kiribati" }, { value: "PRK", label: "Korea (the Democratic People's Republic of)" }, { value: "KOR", label: "Korea (the Republic of)" }, { value: "KWT", label: "Kuwait" }, { value: "KGZ", label: "Kyrgyzstan" }, { value: "LAO", label: "Lao People's Democratic Republic" }, { value: "LVA", label: "Latvia" }, { value: "LBN", label: "Lebanon" }, { value: "LSO", label: "Lesotho" }, { value: "LBR", label: "Liberia" }, { value: "LBY", label: "Libya" }, { value: "LIE", label: "Liechtenstein" }, { value: "LTU", label: "Lithuania" }, { value: "LUX", label: "Luxembourg" }, { value: "MAC", label: "Macao" }, { value: "MDG", label: "Madagascar" }, { value: "MWI", label: "Malawi" }, { value: "MYS", label: "Malaysia" }, { value: "MDV", label: "Maldives" }, { value: "MLI", label: "Mali" }, { value: "MLT", label: "Malta" }, { value: "MHL", label: "Marshall Islands" }, { value: "MTQ", label: "Martinique" }, { value: "MRT", label: "Mauritania" }, { value: "MUS", label: "Mauritius" }, { value: "MYT", label: "Mayotte" }, { value: "MEX", label: "Mexico" }, { value: "FSM", label: "Micronesia (Federated States of)" }, { value: "MDA", label: "Moldova (the Republic of)" }, { value: "MCO", label: "Monaco" }, { value: "MNG", label: "Mongolia" }, { value: "MNE", label: "Montenegro" }, { value: "MSR", label: "Montserrat" }, { value: "MAR", label: "Morocco" }, { value: "MOZ", label: "Mozambique" }, { value: "MMR", label: "Myanmar" }, { value: "NAM", label: "Namibia" }, { value: "NRU", label: "Nauru" }, { value: "NPL", label: "Nepal" }, { value: "NLD", label: "Netherlands" }, { value: "NCL", label: "New Caledonia" }, { value: "NZL", label: "New Zealand" }, { value: "NIC", label: "Nicaragua" }, { value: "NER", label: "Niger" }, { value: "NGA", label: "Nigeria" }, { value: "NIU", label: "Niue" }, { value: "NFK", label: "Norfolk Island" }, { value: "MKD", label: "North Macedonia" }, { value: "MNP", label: "Northern Mariana Islands" }, { value: "NOR", label: "Norway" }, { value: "OMN", label: "Oman" }, { value: "PAK", label: "Pakistan" }, { value: "PLW", label: "Palau" }, { value: "PSE", label: "Palestine, State of" }, { value: "PAN", label: "Panama" }, { value: "PNG", label: "Papua New Guinea" }, { value: "PRY", label: "Paraguay" }, { value: "PER", label: "Peru" }, { value: "PHL", label: "Philippines" }, { value: "PCN", label: "Pitcairn" }, { value: "POL", label: "Poland" }, { value: "PRT", label: "Portugal" }, { value: "PRI", label: "Puerto Rico" }, { value: "QAT", label: "Qatar" }, { value: "REU", label: "Réunion" }, { value: "ROU", label: "Romania" }, { value: "RUS", label: "Russian Federation" }, { value: "RWA", label: "Rwanda" }, { value: "BLM", label: "Saint Barthélemy" }, { value: "SHN", label: "Saint Helena, Ascension and Tristan da Cunha" }, { value: "KNA", label: "Saint Kitts and Nevis" }, { value: "LCA", label: "Saint Lucia" }, { value: "MAF", label: "Saint Martin (French part)" }, { value: "SPM", label: "Saint Pierre and Miquelon" }, { value: "VCT", label: "Saint Vincent and the Grenadines" }, { value: "WSM", label: "Samoa" }, { value: "SMR", label: "San Marino" }, { value: "STP", label: "Sao Tome and Principe" }, { value: "SAU", label: "Saudi Arabia" }, { value: "SEN", label: "Senegal" }, { value: "SRB", label: "Serbia" }, { value: "SYC", label: "Seychelles" }, { value: "SLE", label: "Sierra Leone" }, { value: "SGP", label: "Singapore" }, { value: "SXM", label: "Sint Maarten (Dutch part)" }, { value: "SVK", label: "Slovakia" }, { value: "SVN", label: "Slovenia" }, { value: "SLB", label: "Solomon Islands" }, { value: "SOM", label: "Somalia" }, { value: "ZAF", label: "South Africa" }, { value: "SGS", label: "South Georgia and the South Sandwich Islands" }, { value: "SSD", label: "South Sudan" }, { value: "ESP", label: "Spain" }, { value: "LKA", label: "Sri Lanka" }, { value: "SDN", label: "Sudan" }, { value: "SUR", label: "Suriname" }, { value: "SJM", label: "Svalbard and Jan Mayen" }, { value: "SWE", label: "Sweden" }, { value: "CHE", label: "Switzerland" }, { value: "SYR", label: "Syrian Arab Republic" }, { value: "TWN", label: "Taiwan (Province of China)" }, { value: "TJK", label: "Tajikistan" }, { value: "TZA", label: "Tanzania, the United Republic of" }, { value: "THA", label: "Thailand" }, { value: "TLS", label: "Timor-Leste" }, { value: "TGO", label: "Togo" }, { value: "TKL", label: "Tokelau" }, { value: "TON", label: "Tonga" }, { value: "TTO", label: "Trinidad and Tobago" }, { value: "TUN", label: "Tunisia" }, { value: "TUR", label: "Turkey" }, { value: "TKM", label: "Turkmenistan" }, { value: "TCA", label: "Turks and Caicos Islands" }, { value: "TUV", label: "Tuvalu" }, { value: "UGA", label: "Uganda" }, { value: "UKR", label: "Ukraine" }, { value: "ARE", label: "United Arab Emirates" }, { value: "GBR", label: "United Kingdom of Great Britain and Northern Ireland" }, { value: "UMI", label: "United States Minor Outlying Islands" }, { value: "URY", label: "Uruguay" }, { value: "UZB", label: "Uzbekistan" }, { value: "VUT", label: "Vanuatu" }, { value: "VEN", label: "Venezuela (Bolivarian Republic of)" }, { value: "VNM", label: "Viet Nam" }, { value: "VGB", label: "Virgin Islands (British)" }, { value: "VIR", label: "Virgin Islands (U.S.)" }, { value: "WLF", label: "Wallis and Futuna" }, { value: "ESH", label: "Western Sahara*" }, { value: "YEM", label: "Yemen" }, { value: "ZMB", label: "Zambia" }, { value: "ZWE", label: "Zimbabwe" }], "selected": "" },
        specificCountry: { "label": "Select Specific Country Only", "list": [{ "label": "Worldwide", "value": "ALL" }, { "label": "United States Only", "value": "USA" }, { "label": "Puerto Rico", "value": "PRI" }, { "label": "Canada", "value": "CAN" }, { "label": "Chile", "value": "CHL" }], "selected": "ALL" }
    },
    removePLGSKUonDesign: (json, type) => {
        if (type == "checkout" || type == "upsell" || type == "downsell") {
            json.rows = json.body.rows.map(a => {
                a.columns.map(b => {
                    b.contents.map(c => {
                        if (type == "checkout") { // sa checkout
                            if (c.type == "variant") {
                                let variant = [];
                                try {
                                    variant = JSON.parse(c.values.variants);
                                    variant = variant.map(e => {
                                        e.variant_sku = "";
                                        return e;
                                    });
                                } catch (err) {
                                    console.log("Checkout: Error on removing the sku so resetting the variant will do.");
                                }
                                c.values.variants = JSON.stringify(variant);
                            }
                        } else { // sa upsell at downsell
                            if (c.type == "buttons") {
                                c.values.productSku = "";
                                if (c.values.variants) {
                                    let variant = [];
                                    try {
                                        variant = JSON.parse(c.values.variants);
                                        variant = variant.map(e => {
                                            e.variant_sku = "";
                                            return e;
                                        });
                                    } catch (err) {
                                        console.log("Upsell: Error on removing the sku so resetting the variant will do.");
                                    }
                                    c.values.variants = JSON.stringify(variant);
                                }
                            }
                        }
                        return c;
                    });
                    return b;
                });
                return a;
            });
            return json;
        } else {
            return json;
        }
    },

    iso3toIso2: iso3 => {
        if(!iso3) return "US";
        iso3 = iso3.toUpperCase();
        var list = { "BGD": "BD", "BEL": "BE", "BFA": "BF", "BGR": "BG", "BIH": "BA", "BRB": "BB", "WLF": "WF", "BLM": "BL", "BMU": "BM", "BRN": "BN", "BOL": "BO", "BHR": "BH", "BDI": "BI", "BEN": "BJ", "BTN": "BT", "JAM": "JM", "BVT": "BV", "BWA": "BW", "WSM": "WS", "BES": "BQ", "BRA": "BR", "BHS": "BS", "JEY": "JE", "BLR": "BY", "BLZ": "BZ", "RUS": "RU", "RWA": "RW", "SRB": "RS", "TLS": "TL", "REU": "RE", "TKM": "TM", "TJK": "TJ", "ROU": "RO", "TKL": "TK", "GNB": "GW", "GUM": "GU", "GTM": "GT", "SGS": "GS", "GRC": "GR", "GNQ": "GQ", "GLP": "GP", "JPN": "JP", "GUY": "GY", "GGY": "GG", "GUF": "GF", "GEO": "GE", "GRD": "GD", "GBR": "GB", "GAB": "GA", "SLV": "SV", "GIN": "GN", "GMB": "GM", "GRL": "GL", "GIB": "GI", "GHA": "GH", "OMN": "OM", "TUN": "TN", "JOR": "JO", "HRV": "HR", "HTI": "HT", "HUN": "HU", "HKG": "HK", "HND": "HN", "HMD": "HM", "VEN": "VE", "PRI": "PR", "PSE": "PS", "PLW": "PW", "PRT": "PT", "SJM": "SJ", "PRY": "PY", "IRQ": "IQ", "PAN": "PA", "PYF": "PF", "PNG": "PG", "PER": "PE", "PAK": "PK", "PHL": "PH", "PCN": "PN", "POL": "PL", "SPM": "PM", "ZMB": "ZM", "ESH": "EH", "EST": "EE", "EGY": "EG", "ZAF": "ZA", "ECU": "EC", "ITA": "IT", "VNM": "VN", "SLB": "SB", "ETH": "ET", "SOM": "SO", "ZWE": "ZW", "SAU": "SA", "ESP": "ES", "ERI": "ER", "MNE": "ME", "MDA": "MD", "MDG": "MG", "MAF": "MF", "MAR": "MA", "MCO": "MC", "UZB": "UZ", "MMR": "MM", "MLI": "ML", "MAC": "MO", "MNG": "MN", "MHL": "MH", "MKD": "MK", "MUS": "MU", "MLT": "MT", "MWI": "MW", "MDV": "MV", "MTQ": "MQ", "MNP": "MP", "MSR": "MS", "MRT": "MR", "IMN": "IM", "UGA": "UG", "TZA": "TZ", "MYS": "MY", "MEX": "MX", "ISR": "IL", "FRA": "FR", "IOT": "IO", "SHN": "SH", "FIN": "FI", "FJI": "FJ", "FLK": "FK", "FSM": "FM", "FRO": "FO", "NIC": "NI", "NLD": "NL", "NOR": "NO", "NAM": "NA", "VUT": "VU", "NCL": "NC", "NER": "NE", "NFK": "NF", "NGA": "NG", "NZL": "NZ", "NPL": "NP", "NRU": "NR", "NIU": "NU", "COK": "CK", "XKX": "XK", "CIV": "CI", "CHE": "CH", "COL": "CO", "CHN": "CN", "CMR": "CM", "CHL": "CL", "CCK": "CC", "CAN": "CA", "COG": "CG", "CAF": "CF", "COD": "CD", "CZE": "CZ", "CYP": "CY", "CXR": "CX", "CRI": "CR", "CUW": "CW", "CPV": "CV", "CUB": "CU", "SWZ": "SZ", "SYR": "SY", "SXM": "SX", "KGZ": "KG", "KEN": "KE", "SSD": "SS", "SUR": "SR", "KIR": "KI", "KHM": "KH", "KNA": "KN", "COM": "KM", "STP": "ST", "SVK": "SK", "KOR": "KR", "SVN": "SI", "PRK": "KP", "KWT": "KW", "SEN": "SN", "SMR": "SM", "SLE": "SL", "SYC": "SC", "KAZ": "KZ", "CYM": "KY", "SGP": "SG", "SWE": "SE", "SDN": "SD", "DOM": "DO", "DMA": "DM", "DJI": "DJ", "DNK": "DK", "VGB": "VG", "DEU": "DE", "YEM": "YE", "DZA": "DZ", "USA": "US", "URY": "UY", "MYT": "YT", "UMI": "UM", "LBN": "LB", "LCA": "LC", "LAO": "LA", "TUV": "TV", "TWN": "TW", "TTO": "TT", "TUR": "TR", "LKA": "LK", "LIE": "LI", "LVA": "LV", "TON": "TO", "LTU": "LT", "LUX": "LU", "LBR": "LR", "LSO": "LS", "THA": "TH", "ATF": "TF", "TGO": "TG", "TCD": "TD", "TCA": "TC", "LBY": "LY", "VAT": "VA", "VCT": "VC", "ARE": "AE", "AND": "AD", "ATG": "AG", "AFG": "AF", "AIA": "AI", "VIR": "VI", "ISL": "IS", "IRN": "IR", "ARM": "AM", "ALB": "AL", "AGO": "AO", "ATA": "AQ", "ASM": "AS", "ARG": "AR", "AUS": "AU", "AUT": "AT", "ABW": "AW", "IND": "IN", "ALA": "AX", "AZE": "AZ", "IRL": "IE", "IDN": "ID", "UKR": "UA", "QAT": "QA", "MOZ": "MZ" };
        if (list[iso3]) iso3 = list[iso3];
        return iso3;
    },
    iso2toIso3: iso2 => {
        if(!iso2) return "USD";
        iso2 = iso2.toUpperCase();
        var list = { "BD": "BGD", "BE": "BEL", "BF": "BFA", "BG": "BGR", "BA": "BIH", "BB": "BRB", "WF": "WLF", "BL": "BLM", "BM": "BMU", "BN": "BRN", "BO": "BOL", "BH": "BHR", "BI": "BDI", "BJ": "BEN", "BT": "BTN", "JM": "JAM", "BV": "BVT", "BW": "BWA", "WS": "WSM", "BQ": "BES", "BR": "BRA", "BS": "BHS", "JE": "JEY", "BY": "BLR", "BZ": "BLZ", "RU": "RUS", "RW": "RWA", "RS": "SRB", "TL": "TLS", "RE": "REU", "TM": "TKM", "TJ": "TJK", "RO": "ROU", "TK": "TKL", "GW": "GNB", "GU": "GUM", "GT": "GTM", "GS": "SGS", "GR": "GRC", "GQ": "GNQ", "GP": "GLP", "JP": "JPN", "GY": "GUY", "GG": "GGY", "GF": "GUF", "GE": "GEO", "GD": "GRD", "GB": "GBR", "GA": "GAB", "SV": "SLV", "GN": "GIN", "GM": "GMB", "GL": "GRL", "GI": "GIB", "GH": "GHA", "OM": "OMN", "TN": "TUN", "JO": "JOR", "HR": "HRV", "HT": "HTI", "HU": "HUN", "HK": "HKG", "HN": "HND", "HM": "HMD", "VE": "VEN", "PR": "PRI", "PS": "PSE", "PW": "PLW", "PT": "PRT", "SJ": "SJM", "PY": "PRY", "IQ": "IRQ", "PA": "PAN", "PF": "PYF", "PG": "PNG", "PE": "PER", "PK": "PAK", "PH": "PHL", "PN": "PCN", "PL": "POL", "PM": "SPM", "ZM": "ZMB", "EH": "ESH", "EE": "EST", "EG": "EGY", "ZA": "ZAF", "EC": "ECU", "IT": "ITA", "VN": "VNM", "SB": "SLB", "ET": "ETH", "SO": "SOM", "ZW": "ZWE", "SA": "SAU", "ES": "ESP", "ER": "ERI", "ME": "MNE", "MD": "MDA", "MG": "MDG", "MF": "MAF", "MA": "MAR", "MC": "MCO", "UZ": "UZB", "MM": "MMR", "ML": "MLI", "MO": "MAC", "MN": "MNG", "MH": "MHL", "MK": "MKD", "MU": "MUS", "MT": "MLT", "MW": "MWI", "MV": "MDV", "MQ": "MTQ", "MP": "MNP", "MS": "MSR", "MR": "MRT", "IM": "IMN", "UG": "UGA", "TZ": "TZA", "MY": "MYS", "MX": "MEX", "IL": "ISR", "FR": "FRA", "IO": "IOT", "SH": "SHN", "FI": "FIN", "FJ": "FJI", "FK": "FLK", "FM": "FSM", "FO": "FRO", "NI": "NIC", "NL": "NLD", "NO": "NOR", "NA": "NAM", "VU": "VUT", "NC": "NCL", "NE": "NER", "NF": "NFK", "NG": "NGA", "NZ": "NZL", "NP": "NPL", "NR": "NRU", "NU": "NIU", "CK": "COK", "XK": "XKX", "CI": "CIV", "CH": "CHE", "CO": "COL", "CN": "CHN", "CM": "CMR", "CL": "CHL", "CC": "CCK", "CA": "CAN", "CG": "COG", "CF": "CAF", "CD": "COD", "CZ": "CZE", "CY": "CYP", "CX": "CXR", "CR": "CRI", "CW": "CUW", "CV": "CPV", "CU": "CUB", "SZ": "SWZ", "SY": "SYR", "SX": "SXM", "KG": "KGZ", "KE": "KEN", "SS": "SSD", "SR": "SUR", "KI": "KIR", "KH": "KHM", "KN": "KNA", "KM": "COM", "ST": "STP", "SK": "SVK", "KR": "KOR", "SI": "SVN", "KP": "PRK", "KW": "KWT", "SN": "SEN", "SM": "SMR", "SL": "SLE", "SC": "SYC", "KZ": "KAZ", "KY": "CYM", "SG": "SGP", "SE": "SWE", "SD": "SDN", "DO": "DOM", "DM": "DMA", "DJ": "DJI", "DK": "DNK", "VG": "VGB", "DE": "DEU", "YE": "YEM", "DZ": "DZA", "US": "USA", "UY": "URY", "YT": "MYT", "UM": "UMI", "LB": "LBN", "LC": "LCA", "LA": "LAO", "TV": "TUV", "TW": "TWN", "TT": "TTO", "TR": "TUR", "LK": "LKA", "LI": "LIE", "LV": "LVA", "TO": "TON", "LT": "LTU", "LU": "LUX", "LR": "LBR", "LS": "LSO", "TH": "THA", "TF": "ATF", "TG": "TGO", "TD": "TCD", "TC": "TCA", "LY": "LBY", "VA": "VAT", "VC": "VCT", "AE": "ARE", "AD": "AND", "AG": "ATG", "AF": "AFG", "AI": "AIA", "VI": "VIR", "IS": "ISL", "IR": "IRN", "AM": "ARM", "AL": "ALB", "AO": "AGO", "AQ": "ATA", "AS": "ASM", "AR": "ARG", "AU": "AUS", "AT": "AUT", "AW": "ABW", "IN": "IND", "AX": "ALA", "AZ": "AZE", "IE": "IRL", "ID": "IDN", "UA": "UKR", "QA": "QAT", "MZ": "MOZ" };
        if (list[iso2]) iso2 = list[iso2];
        return iso2;
    },
    iso2toCountryName: iso2 => {
        iso2 = iso2.toUpperCase();
        var cn = { "BD": "Bangladesh", "BE": "Belgium", "BF": "Burkina Faso", "BG": "Bulgaria", "BA": "Bosnia and Herzegovina", "BB": "Barbados", "WF": "Wallis and Futuna", "BL": "Saint Barthelemy", "BM": "Bermuda", "BN": "Brunei", "BO": "Bolivia", "BH": "Bahrain", "BI": "Burundi", "BJ": "Benin", "BT": "Bhutan", "JM": "Jamaica", "BV": "Bouvet Island", "BW": "Botswana", "WS": "Samoa", "BQ": "Bonaire, Saint Eustatius and Saba ", "BR": "Brazil", "BS": "Bahamas", "JE": "Jersey", "BY": "Belarus", "BZ": "Belize", "RU": "Russia", "RW": "Rwanda", "RS": "Serbia", "TL": "East Timor", "RE": "Reunion", "TM": "Turkmenistan", "TJ": "Tajikistan", "RO": "Romania", "TK": "Tokelau", "GW": "Guinea-Bissau", "GU": "Guam", "GT": "Guatemala", "GS": "South Georgia and the South Sandwich Islands", "GR": "Greece", "GQ": "Equatorial Guinea", "GP": "Guadeloupe", "JP": "Japan", "GY": "Guyana", "GG": "Guernsey", "GF": "French Guiana", "GE": "Georgia", "GD": "Grenada", "GB": "United Kingdom", "GA": "Gabon", "SV": "El Salvador", "GN": "Guinea", "GM": "Gambia", "GL": "Greenland", "GI": "Gibraltar", "GH": "Ghana", "OM": "Oman", "TN": "Tunisia", "JO": "Jordan", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary", "HK": "Hong Kong", "HN": "Honduras", "HM": "Heard Island and McDonald Islands", "VE": "Venezuela", "PR": "Puerto Rico", "PS": "Palestinian Territory", "PW": "Palau", "PT": "Portugal", "SJ": "Svalbard and Jan Mayen", "PY": "Paraguay", "IQ": "Iraq", "PA": "Panama", "PF": "French Polynesia", "PG": "Papua New Guinea", "PE": "Peru", "PK": "Pakistan", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PM": "Saint Pierre and Miquelon", "ZM": "Zambia", "EH": "Western Sahara", "EE": "Estonia", "EG": "Egypt", "ZA": "South Africa", "EC": "Ecuador", "IT": "Italy", "VN": "Vietnam", "SB": "Solomon Islands", "ET": "Ethiopia", "SO": "Somalia", "ZW": "Zimbabwe", "SA": "Saudi Arabia", "ES": "Spain", "ER": "Eritrea", "ME": "Montenegro", "MD": "Moldova", "MG": "Madagascar", "MF": "Saint Martin", "MA": "Morocco", "MC": "Monaco", "UZ": "Uzbekistan", "MM": "Myanmar", "ML": "Mali", "MO": "Macao", "MN": "Mongolia", "MH": "Marshall Islands", "MK": "Macedonia", "MU": "Mauritius", "MT": "Malta", "MW": "Malawi", "MV": "Maldives", "MQ": "Martinique", "MP": "Northern Mariana Islands", "MS": "Montserrat", "MR": "Mauritania", "IM": "Isle of Man", "UG": "Uganda", "TZ": "Tanzania", "MY": "Malaysia", "MX": "Mexico", "IL": "Israel", "FR": "France", "IO": "British Indian Ocean Territory", "SH": "Saint Helena", "FI": "Finland", "FJ": "Fiji", "FK": "Falkland Islands", "FM": "Micronesia", "FO": "Faroe Islands", "NI": "Nicaragua", "NL": "Netherlands", "NO": "Norway", "NA": "Namibia", "VU": "Vanuatu", "NC": "New Caledonia", "NE": "Niger", "NF": "Norfolk Island", "NG": "Nigeria", "NZ": "New Zealand", "NP": "Nepal", "NR": "Nauru", "NU": "Niue", "CK": "Cook Islands", "XK": "Kosovo", "CI": "Ivory Coast", "CH": "Switzerland", "CO": "Colombia", "CN": "China", "CM": "Cameroon", "CL": "Chile", "CC": "Cocos Islands", "CA": "Canada", "CG": "Republic of the Congo", "CF": "Central African Republic", "CD": "Democratic Republic of the Congo", "CZ": "Czech Republic", "CY": "Cyprus", "CX": "Christmas Island", "CR": "Costa Rica", "CW": "Curacao", "CV": "Cape Verde", "CU": "Cuba", "SZ": "Swaziland", "SY": "Syria", "SX": "Sint Maarten", "KG": "Kyrgyzstan", "KE": "Kenya", "SS": "South Sudan", "SR": "Suriname", "KI": "Kiribati", "KH": "Cambodia", "KN": "Saint Kitts and Nevis", "KM": "Comoros", "ST": "Sao Tome and Principe", "SK": "Slovakia", "KR": "South Korea", "SI": "Slovenia", "KP": "North Korea", "KW": "Kuwait", "SN": "Senegal", "SM": "San Marino", "SL": "Sierra Leone", "SC": "Seychelles", "KZ": "Kazakhstan", "KY": "Cayman Islands", "SG": "Singapore", "SE": "Sweden", "SD": "Sudan", "DO": "Dominican Republic", "DM": "Dominica", "DJ": "Djibouti", "DK": "Denmark", "VG": "British Virgin Islands", "DE": "Germany", "YE": "Yemen", "DZ": "Algeria", "US": "United States", "UY": "Uruguay", "YT": "Mayotte", "UM": "United States Minor Outlying Islands", "LB": "Lebanon", "LC": "Saint Lucia", "LA": "Laos", "TV": "Tuvalu", "TW": "Taiwan", "TT": "Trinidad and Tobago", "TR": "Turkey", "LK": "Sri Lanka", "LI": "Liechtenstein", "LV": "Latvia", "TO": "Tonga", "LT": "Lithuania", "LU": "Luxembourg", "LR": "Liberia", "LS": "Lesotho", "TH": "Thailand", "TF": "French Southern Territories", "TG": "Togo", "TD": "Chad", "TC": "Turks and Caicos Islands", "LY": "Libya", "VA": "Vatican", "VC": "Saint Vincent and the Grenadines", "AE": "United Arab Emirates", "AD": "Andorra", "AG": "Antigua and Barbuda", "AF": "Afghanistan", "AI": "Anguilla", "VI": "U.S. Virgin Islands", "IS": "Iceland", "IR": "Iran", "AM": "Armenia", "AL": "Albania", "AO": "Angola", "AQ": "Antarctica", "AS": "American Samoa", "AR": "Argentina", "AU": "Australia", "AT": "Austria", "AW": "Aruba", "IN": "India", "AX": "Aland Islands", "AZ": "Azerbaijan", "IE": "Ireland", "ID": "Indonesia", "UA": "Ukraine", "QA": "Qatar", "MZ": "Mozambique" }
        return cn[iso2]
    },
    translateSafeArrivalStatus: function (status, delivered_date) {
        status = !status ? "" : status.toLowerCase();
        var note = this.capitalizeWord(status.replace(/_/g, " "));
        var resObj = { order_status: "pickedup", fulfillment_status: "unfulfilled", cancel_note: "Unassigned", updateById: "", updateByName: "Safe Arrival Webhook", order_status_update: Date.now() };
        if (status == "unassigned") {
            resObj.order_status = "pickedup";
            resObj.cancel_note = "Processing...";
        } else if (status == "assigned_to_courier") {
            resObj.order_status = "pickedup";
            resObj.cancel_note = "Assigned To Courier";
        } else if (status.includes("pickup_attempt")) {
            resObj.order_status = "pickedup";
            resObj.cancel_note = note;
        } else if (status.includes("delivery_attempt")) {
            resObj.order_status = "pickedup";
            resObj.cancel_note = note;
        } else if (status == "completed") {
            resObj.order_status = "delivered";
            resObj.fulfillment_status = "fulfilled";
            resObj.cancel_note = "Parcel Successfully Delivered";
            resObj.dateStatusDelivered = delivered_date ? new Date(delivered_date).getTime() : Date.now();
        } else if (status == "dispatched") {
            resObj.order_status = "pickedup";
            resObj.cancel_note = "The order has been dispatched";
        } else if (
            status == "picked_up_auto" || status == "picked_up" || status == "pickup_confirmed" || status == "pickup_confirmed" || status == "in_sorting_facility" ||
            status == "in_sorting_facility" || status == "lost_or_damaged" || status == "in_transit" || status == "lost" || status == "damaged" || status == "out_for_delivery" ||
            status == "arrived_to_delivery_address" || status == "on_hold") {
            // matic picked up
            resObj.order_status = "pickedup";
            resObj.cancel_note = note;
        } else {
            if (status == "delivery_rejected" || status == "returned_to_origin" || status == "returned_to_wing" || status == "cancelled") {
                resObj.order_status = "cancelled";
                resObj.cancel_note = note;
            } else {
                // matic hold
                resObj.cancel_note = note;
            }
        }
        console.log("Status From Safe Arrival Webhook", status, resObj.order_status)
        return resObj;
    },
    translateWimoStatus: function (status, delivered_date, message) {
        if (!status) status = "";
        if (!message) message = "Processing...";
        var note = this.capitalizeWord(message.replace(/_/g, " "));
        var resObj = { order_status: "pickedup", fulfillment_status: "unfulfilled", cancel_note: "Unassigned", updateById: "", updateByName: "Wimo Webhook", order_status_update: Date.now() };
        if (status.includes("NewShipment")) {
            resObj.order_status = "pickedup";
            resObj.cancel_note = note;
        } else if (status.includes("InTransit") || status.includes("Cancelled") || status.includes("OutForDelivery") || status.includes("Exception") || status.includes("FailedAttempt")) {
            resObj.order_status = "pickedup";
            resObj.cancel_note = note;
        } else if (status.includes("ReturnToShipper")) { // status.includes("Cancelled") || status.includes("ReturnToShipper")
            resObj.order_status = "cancelled";
            resObj.cancel_note = note;
        } else if (status.includes("Delivered")) {
            resObj.order_status = "delivered";
            resObj.fulfillment_status = "fulfilled";
            resObj.cancel_note = "Parcel Successfully Delivered";
            resObj.dateStatusDelivered = delivered_date ? new Date(delivered_date).getTime() : Date.now();
        }
        console.log("Status From Wimo Webhook", status, resObj.order_status)
        return resObj;
    },
    translateFetchrStatus: function (status, delivered_date, message) {
        if (!message) message = "Processing...";
        const resObj = { order_status: "pickedup", fulfillment_status: "unfulfilled", cancel_note: "Unassigned", updateById: "", updateByName: "Fetchr Webhook", order_status_update: Date.now() };
        const note = this.capitalizeWord(message.replace(/_/g, " "));
        const pickedup_list = ["UPL", "PKD", "NPKD", "REC", "SLV", "DSP", "BAG", "SCH", "RSCH", "NSCH", "RTD", "HLD", "UHLD", "MSG", "SUS", "CXL", "RFD", "RETD", "NDLV"];
        const cancelled_list = ["RTW", "EXP"];
        const delivered_list = ["DLV"];
        if (pickedup_list.includes(status)) {
            resObj.order_status = "pickedup";
            resObj.cancel_note = note;
        } else if (cancelled_list.includes(status)) {
            resObj.order_status = "cancelled";
            resObj.cancel_note = note;
        } else if (delivered_list.includes(status)) {
            resObj.order_status = "delivered";
            resObj.fulfillment_status = "fulfilled";
            resObj.cancel_note = "Parcel Successfully Delivered";
            resObj.dateStatusDelivered = delivered_date ? new Date(delivered_date).getTime() : Date.now();
        }
        console.log("Status From Fetchr Webhook", status, resObj.order_status, resObj);
        return resObj;
    },
    translateSMSAStatus: function (status, delivered_date, message) {
        const resObj = { order_status: "pickedup", fulfillment_status: "unfulfilled", cancel_note: "Unassigned", updateById: "", updateByName: "Fetchr Webhook", order_status_update: Date.now() };
        if (!message) message = "Processing...";
        const note = this.capitalizeWord(message.replace(/_/g, " "));
        const pickedup_list = [];
        const cancelled_list = [];
        const delivered_list = [];
        return resObj;
    },
    getFiveDigitNumber: num => {
        if (typeof num == "undefined") console.log("Parameter is required");
        num = num.toString();
        if (num.length == 1) num = "0000" + num;
        else if (num.length == 2) num = "000" + num;
        else if (num.length == 3) num = "00" + num;
        else if (num.length == 4) num = "0" + num;
        return num;
    },
    showPresentableAddress: completeAddress => {
        return completeAddress.replace(/__/g, ", ").replace(/null, /g, "").replace(", null", "").trim(", ");
    },
    plgUpsellLink: privilege => { // User Privilege
        if (privilege == 1 || privilege == 2 || privilege == 0) {
            return "https://themm.kartra.com/page/w5Z135";
        } else if (privilege >= 3) {
            return "https://themm.kartra.com/page/w5Z135";
        }
        return null;
    },
    infiniteCalendarTheme: () => {
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
        return theme;
    },
    executeMutation: (mutationName, toastr, callback, loadingText, loadingHeader) => {
        if (typeof loadingText == "undefined") loadingText = "Loading, please wait...";
        if (typeof loadingHeader == "undefined") loadingHeader = "";
        toastr.clear();
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.info(loadingText, loadingHeader);
        mutationName().then(({ data }) => {
            toastr.clear();
            toastr.options.timeOut = 3000;
            toastr.options.extendedTimeOut = 2000;
            callback(data);
        }).catch(error => {
            console.log(error)
            toastr.clear();
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    },
    toastrInitialize: params => {
        return { "progressBar": true, "closeButton": true, "debug": false, "newestOnTop": true, "positionClass": "toast-bottom-right", "preventDuplicates": true, "timeOut": 0, "extendedTimeOut": 0, "showEasing": "swing", "hideEasing": "linear", "showMethod": "fadeIn", "hideMethod": "fadeOut", ...params }
    },
    toastrPrompt: (toastr, type, message, title) => {
        var timeOut = 0, extendedTimeOut = 0;
        try {
            if (type == "success") {
                timeOut = 3000;
                extendedTimeOut = 2000;
            }
            toastr.options.timeOut = timeOut;
            toastr.options.extendedTimeOut = extendedTimeOut;
            toastr.clear();
            toastr[type](message, title)
        } catch (err) {
            throw new Error(err);
        }
    },
    exportDataToUri: function (array) { // first to call (convert to string)
        let serialize = this.serializeExportData;
        let csvContent = "data:text/csv;charset=utf-8,";
        array.forEach(function (rowArray) {
            rowArray = rowArray.map(el => {
                return serialize(el);
            })
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });
        return encodeURI(csvContent);
    },
    serializeExportData: (str) => { // second to call (serialize)
        var regex = new RegExp("#|,|(\r\n|\r|\n)", "g"), replaceBy = " ";
        return str ? str.toString().replace(regex, replaceBy) : "";
    },
    exportDataToCSV: (uri, fileName) => { // third to call (exporting)
        var fileName = fileName ? fileName + " " + new Date().toLocaleDateString() + ".csv" : "COD Product Export (" + new Date().toLocaleDateString() + ").csv";
        var link = document.createElement("a");
        link.setAttribute("href", uri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    enterToProceed: (event, fn, value) => {
        if (event.keyCode === 13 && !event.shiftKey) {
            if (value) fn(value)
            else fn()
        }
    },
    groupByArrayOfObject: (array, keyName) => {
        /*
            Note can only group by if the array of object is like this
            [
                { name: "test name", group: "test1" },
                { name: "test name 2", group: "test2" },
                { name: "test name 3", group: "test1" }
            ]
        */
        function groupBy(list, property) {
            const result = [];
            list.forEach(el => {
                if (result.length == 0) result.push(el);
                else {
                    var isFound = false;
                    result.forEach(t => {
                        if (t[property] == el[property]) isFound = true;
                    })
                    if (!isFound) result.push(el);
                }
            })
            return result;
        }

        return groupBy(array, keyName);
    },
    displayPLGInventoryOnShopifyProduct: function (data, mongoDBId) {
        data = data.map(el => el.tags.filter(t => t.includes("plg_sku")).map(t => { return { id: el.id, variantID: t.toString().split("_")[2] } }));
        const variantIDlist = [].concat.apply([], data);
        if (variantIDlist.length != 0) {
            const payload = {
                query: `query($ids: String) {
                    getFunnelProducts(ids: $ids){
                        id
                        productName
                        quantity
                        totalQuantity
                    }
                }`,
                variables: { ids: variantIDlist.map(el => el.variantID).toString() }
            };
            var result = {};
            this.customFetch(this.clientUrl + '/graphql', 'POST', payload, res => {
                result = res || result;
                if (result && result.data && result.data.getFunnelProducts && result.data.getFunnelProducts.length != 0) {
                    result.data.getFunnelProducts.forEach(el => {
                        if (el.totalQuantity) {
                            const dbID = mongoDBId.encode(el.id);
                            const productData = variantIDlist.filter(el => el.variantID == dbID)[0];
                            const percentage = this.commafy(((el.quantity / el.totalQuantity) * 100).toFixed(2));
                            const dom = document.getElementById(productData.id);
                            var bgcolor = "#28c686";
                            if (parseInt(percentage) <= 35) {
                                bgcolor = "red";
                            } else if (parseInt(percentage) >= 36 && parseInt(percentage) <= 66) {
                                bgcolor = "#ffa500";
                            }
                            dom.innerHTML = `
                                <div class="column column_5_12 one-line-ellipsis" style="padding: 0">
                                    <label class="font-questrial-light" style="font-size: 0.875em;">Inventory</label>
                                </div>
                                <div class="column column_5_12 text-right" style="padding: 0">
                                    <div style="height: 10px; border-radius: 5px; background-color: rgb(239, 239, 239);">
                                        <div style="height: 10px; width: ${percentage}%; border-radius: 5px; background-color: ${bgcolor}"></div>
                                    </div>
                                </div>
                                <div class="column column_2_12 text-right" style="padding: 0">
                                    <label class="font-questrial-light" style="font-size: 0.7em;">${percentage}%</label>
                                </div>
                            `;
                        }
                    })
                }
            })
        }
    },
    getShopifyProduct: (collection, language) => {
        const tags = [];
        if (collection == "cod-available") {
            tags.push("all available product");
        } else if (collection == "cod-test") {
            tags.push("cod_test");
        } else if (collection == "cod-arabic") {
            tags.push("cod_arabicfunnel");
        } else if (collection == "xvip") {
            tags.push("xvip");
        }
        if (language) {
            tags.push(language);
        }
        return tags;
    },
    getShopifyPrivateTag: function (user_object) { // dito ung mga condition para sa shopify tags
        let excluded = [];
        let cod_available_country = this.cod_available_country("no_country");
        if (!condition.has_arabic_funnel(user_object)) excluded.push("cod_arabicfunnel");
        if (!condition.is_exclusive_vip_user(user_object)) excluded.push("xvip");
        cod_available_country.forEach(e => {
            if (!user_object.access_tags.includes(e.name.toLowerCase()) && e.iso2 != "AE" && e.iso2 != "SA") {
                excluded.push("lang_" + e.iso2.toLowerCase());
            }
        });
        cod_available_country.forEach(e => {
            if (!user_object.access_tags.includes(e.name.toLowerCase()) && e.iso3 != "ARE" && e.iso3 != "SAU") {
                excluded.push("lang_" + e.iso3.toLowerCase());
            }
        });
        return user_object.privilege == 10 ? [] : excluded; // User Privilege
    },
    getAPILinkForShipifyProduct: (tags, lastCursor, private_tags, limit) => { // dito para makuha api link sa shopify via graphql
        if (typeof limit == "undefined") limit = 24;
        var link = "/api/get-collection-products?limit=" + limit + "&after=" + lastCursor + "&tags=" + tags;
        if (private_tags.length != 0) {
            link += "&excludeTags=";
            private_tags.forEach(tag => {
                link += " AND -tag: -" + tag;
            });
            link += " ";
        }
        return link;
    },
    // TODO :: Funnel Restriction Set limit creating funnels
    funnelRestriction: (user_object, count, is_page) => { // is_page is optional only supply third parameter if condition is in funnel page
        let result = { error: false, limit: 0, upsell_link: "https://productlistgenie.com/programs/?fbclid=IwAR2EQAJTWqs_TozKkcJGqypYGjeQcNkyiMdNnCl1uE9ljAiPsrXmWDJi_Zw" };
        if (user_object.privilege <= 3) { // User Privilege
            result.limit = !is_page ? 3 : 10; // lvl 1 and 2, default value is for trial user 3 funnel, 10 pages
            if (user_object.privilege == 3) result.limit = !is_page ? 50 : 20; // value is for 50 funnel, 20 pages // User Privilege
            if (!is_page) { // add max count of funnel if has specific tag
                let add_max_count = user_object.access_tags.filter(tag => tag.includes("add_max_funnel_"));
                if (add_max_count.length !== 0) {
                    let counts = add_max_count.map(e => parseInt(e.replace("add_max_funnel_", "")));
                    result.limit += Math.max(...counts);
                }
            }
            if (count >= result.limit) result.error = true;
        }
        return result;
    },
    checkFreeDomain: domain_list => {
        function isDomainNotExist(str) {
            if (!domain_list) return true;
            return domain_list.filter(e => e.includes(str)).length == 0 ? true : false
        }
        let isNotExist = {
            plgio: isDomainNotExist("productlistgenie.io"),
            plgio_link: "productlistgenie.io",
            yg: isDomainNotExist("yalagenie.com"),
            yg_link: "yalagenie.com"
        };
        return isNotExist;
    },
    checkIllegalWords: word => {
        let illegal_words = ["covid19", "covid-19", "coronavirus", "corona-virus"], is_illegal = false;
        if (illegal_words.filter(e => word.includes(e)).length != 0) is_illegal = true;
        return is_illegal;
    },
    filterDomain: domain => { // unused
        let new_url = new URL("https://" + domain);
        if (new_url.host.split('.').length === 3 && new_url.host.split('.')[0].length > 14) {
            console.log("Invalid URL ==>", new_url);
            throw new Error("Invalid URL");
        }
        return domain;
    },
    getStatsDataFromArray: (str, array, ids) => { // str ay ung impression, addToCart etc.., array stats return data, ids ay ung filter by funnel id/old page ids
        let result = 0, str_params = str.split("_"), device = "";

        // start re-initialize str and device if posible
        if (str_params[0]) str = str_params[0]; // set str to first str param example str value with param checkout_mobile or no params checkout still do the same
        if (str_params[1]) device = str_params[1]; // set the device to mobile if checkout_mobile or desktop if test_desktop
        // end re-initialize str and device if posible

        // start filter by ids
        if (ids && ids.length != 0) {
            array = array.filter(el => {
                return ids.includes(el.pageID) || ids.includes(el.funnelID);
            });
        }
        // end filter by ids

        // conditions
        if (str === "impression") {
            if (device && device === "mobile") result = array.filter(el => el.device == "mobile").length;
            else if (device && device === "desktop") result = array.filter(el => el.device == "desktop").length;
            else result = array.length; // ignore device
        } else if (str === "addToCart") {
            if (device && device === "mobile") result = array.filter(el => (el.pageType == "checkout" || el.pageType == "upsell") && el.device == "mobile").length;
            else if (device && device === "desktop") result = array.filter(el => (el.pageType == "checkout" || el.pageType == "upsell") && el.device == "desktop").length;
            else result = array.filter(el => el.pageType == "checkout" || el.pageType == "upsell").length; // ignore device
        } else if (str === "initiateCheckout") {
            if (device && device === "mobile") result = array.filter(el => el.conversion && el.device == "mobile").length;
            else if (device && device === "desktop") result = array.filter(el => el.conversion && el.device == "desktop").length;
            else result = array.filter(el => el.conversion).length; // ignore device
        } else if (str === "purchased") {
            if (device && device === "mobile") result = array.filter(el => el.purchased && el.pageType == "checkout" && el.device == "mobile").length;
            else if (device && device === "desktop") result = array.filter(el => el.purchased && el.pageType == "checkout" && el.device == "desktop").length;
            else result = array.filter(el => el.purchased && el.pageType == "checkout").length; // ignore device
        }
        return result;
    },
    sourcingEmail: (data) => {
        return `
        <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                <!--[if gte mso 9]>
                <xml>
                <o:OfficeDocumentSettings>
                    <o:AllowPNG/>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="x-apple-disable-message-reformatting">
                <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
                <title></title>
                
                    <style type="text/css">
                @media only screen and (min-width: 620px) {
                .u-row {
                    width: 600px !important;
                }
                .u-row .u-col {
                    vertical-align: top;
                }

                .u-row .u-col-100 {
                    width: 600px !important;
                }

                }

                @media (max-width: 620px) {
                .u-row-container {
                    max-width: 100% !important;
                    padding-left: 0px !important;
                    padding-right: 0px !important;
                }
                .u-row .u-col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                }
                .u-row {
                    width: calc(100% - 40px) !important;
                }
                .u-col {
                    width: 100% !important;
                }
                .u-col > div {
                    margin: 0 auto;
                }
                }
                body {
                margin: 0;
                padding: 0;
                }

                table,
                tr,
                td {
                vertical-align: top;
                border-collapse: collapse;
                }

                p {
                margin: 0;
                }

                .ie-container table,
                .mso-container table {
                table-layout: fixed;
                }

                * {
                line-height: inherit;
                }

                a[x-apple-data-detectors='true'] {
                color: inherit !important;
                text-decoration: none !important;
                }

                </style>
                
                

                <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css"><!--<![endif]-->

                </head>

                <body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f0f0f0">
                <!--[if IE]><div class="ie-container"><![endif]-->
                <!--[if mso]><div class="mso-container"><![endif]-->
                <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f0f0f0;width:100%" cellpadding="0" cellspacing="0">
                <tbody>
                <tr style="vertical-align: top">
                    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f0f0f0;"><![endif]-->
                    

                <div class="u-row-container" style="padding: 50px 10px 0px;background-color: rgba(255,255,255,0)">
                <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #169179;">
                    <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 50px 10px 0px;background-color: rgba(255,255,255,0);" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #169179;"><![endif]-->
                    
                <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                <div style="width: 100% !important;">
                <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                
                <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                <tbody>
                    <tr>
                    <td style="overflow-wrap:break-word;word-break:break-word;padding:24px 10px 0px;font-family:'Montserrat',sans-serif;" align="left">
                        
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
                    
                    <img align="center" border="0" src="http://localhost:3000/assets/graphics/logo.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 199px;" width="199"/>
                    
                    </td>
                </tr>
                </table>

                    </td>
                    </tr>
                </tbody>
                </table>

                <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                </div>
                </div>



                <div class="u-row-container" style="padding: 0px 10px 1px;background-color: rgba(255,255,255,0)">
                <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #169179;">
                    <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px 10px 1px;background-color: rgba(255,255,255,0);" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #169179;"><![endif]-->
                    
                <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                <div style="width: 100% !important;">
                <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 20px 43px;font-family:'Montserrat',sans-serif;" align="left"> <div style="color: #000; line-height: 130%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 130%;"><strong><span style="font-size: 48px; line-height: 62.4px; font-family: helvetica, sans-serif; color: #ffffff;">SOURCING REQUEST<br /></span></strong><span style="font-size: 48px; line-height: 62.4px; font-family: helvetica, sans-serif; color: #ffffff;"><span style="font-size: 40px; line-height: 52px;">Sell Anything You Want</span></span><strong><span style="font-size: 48px; line-height: 62.4px; font-family: helvetica, sans-serif; color: #ffffff;"><br /></span></strong></p> </div> </td> </tr> </tbody> </table>

                <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div> </div> </div>



                <div class="u-row-container" style="padding: 0px;background-color: rgba(255,255,255,0)"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: rgba(255,255,255,0);" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
                    
                <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;">
                <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                
                <table style="font-family:'Montserrat',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 30px 15px;font-family:'Montserrat',sans-serif;" align="left"> <div style="color: #000; line-height: 150%; text-align: left; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 150%;">Full Name: <strong>${data.fullname_form}</strong></p> <p style="font-size: 14px; line-height: 150%;">&nbsp;</p> <p style="font-size: 14px; line-height: 150%;">Email: <strong>${data.email_form}</strong></p> <p style="font-size: 14px; line-height: 150%;">&nbsp;</p> <p style="font-size: 14px; line-height: 150%;">Phone Number: <strong>${data.phone_form}</strong></p> <p style="font-size: 14px; line-height: 150%;">&nbsp;</p> <p style="font-size: 14px; line-height: 150%;">Product URL: <strong>${data.prodURL_form}</strong></p> <p style="font-size: 14px; line-height: 150%;">&nbsp;</p> <p style="font-size: 14px; line-height: 150%;">Minimum Qty: <strong>${data.minimumQty_form}</strong></p> <p style="font-size: 14px; line-height: 150%;">&nbsp;</p> <p style="font-size: 14px; line-height: 150%;">Special Request: <strong>${data.sprequest_form}</strong></p> <p style="font-size: 14px; line-height: 150%;">&nbsp;</p> <p style="font-size: 14px; line-height: 150%;">Country: <strong>${data.select_country}</strong></p> <p style="font-size: 14px; line-height: 150%;">&nbsp;</p> <p style="font-size: 14px; line-height: 150%;">Would you like to check if this product is available for Saudi Arabia?<br />( Sourcing standard quotes are always for UAE and Oman )</p> <p style="font-size: 14px; line-height: 150%;"><strong>${data.sourcing_standard}</strong></p> <p style="font-size: 14px; line-height: 150%;">&nbsp;</p> <p style="font-size: 14px; line-height: 150%;">Did You have tested the product?</p> <p style="font-size: 14px; line-height: 150%;">&nbsp;</p> <p style="font-size: 14px; line-height: 150%;"><strong>${data.isProdTestedopt}</strong></p>
                </div> </td> </tr> </tbody> </table>
                <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                </div> </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div> </div> </div>


                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td> </tr> </tbody> </table>
                <!--[if mso]></div><![endif]-->
                <!--[if IE]></div><![endif]-->
                </body>

            </html>
        `;
    },
    payoutEmail: (firstName, total_payout, date_range, array, marker) => {
        return `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title></title>
                    <style type="text/css">
                        @media only screen and (max-width:480px) { body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: none !important } body { width: 100% !important; min-width: 100% !important } #bodyCell { padding: 10px !important } table.kmMobileHide { display: none !important } table.kmDesktopOnly, td.kmDesktopOnly, th.kmDesktopOnly, tr.kmDesktopOnly, td.kmDesktopWrapHeaderMobileNone { display: none !important } table.kmMobileOnly { display: table !important } tr.kmMobileOnly { display: table-row !important } td.kmMobileOnly, td.kmDesktopWrapHeader, th.kmMobileOnly { display: table-cell !important } tr.kmMobileNoAlign, table.kmMobileNoAlign { float: none !important; text-align: initial !important; vertical-align: middle !important; table-layout: fixed !important } tr.kmMobileCenterAlign { float: none !important; text-align: center !important; vertical-align: middle !important; table-layout: fixed !important } td.kmButtonCollection { padding-left: 9px !important; padding-right: 9px !important; padding-top: 9px !important; padding-bottom: 9px !important } td.kmMobileHeaderStackDesktopNone, img.kmMobileHeaderStackDesktopNone, td.kmMobileHeaderStack { display: block !important; margin-left: auto !important; margin-right: auto !important; padding-bottom: 9px !important; padding-right: 0 !important; padding-left: 0 !important } td.kmMobileWrapHeader, td.kmMobileWrapHeaderDesktopNone { display: inline-block !important } td.kmMobileHeaderSpacing { padding-right: 10px !important } td.kmMobileHeaderNoSpacing { padding-right: 0 !important } table.kmDesktopAutoWidth { width: inherit !important } table.kmMobileAutoWidth { width: 100% !important } table.kmTextContentContainer { width: 100% !important } table.kmBoxedTextContentContainer { width: 100% !important } td.kmImageContent { padding-left: 0 !important; padding-right: 0 !important } img.kmImage { width: 100% !important } td.kmMobileStretch { padding-left: 0 !important; padding-right: 0 !important } table.kmSplitContentLeftContentContainer, table.kmSplitContentRightContentContainer, table.kmColumnContainer, td.kmVerticalButtonBarContentOuter table.kmButtonBarContent, td.kmVerticalButtonCollectionContentOuter table.kmButtonCollectionContent, table.kmVerticalButton, table.kmVerticalButtonContent { width: 100% !important } td.kmButtonCollectionInner { padding-left: 9px !important; padding-right: 9px !important; padding-top: 9px !important; padding-bottom: 9px !important } td.kmVerticalButtonIconContent, td.kmVerticalButtonTextContent, td.kmVerticalButtonContentOuter { padding-left: 0 !important; padding-right: 0 !important; padding-bottom: 9px !important } table.kmSplitContentLeftContentContainer td.kmTextContent, table.kmSplitContentRightContentContainer td.kmTextContent, table.kmColumnContainer td.kmTextContent, table.kmSplitContentLeftContentContainer td.kmImageContent, table.kmSplitContentRightContentContainer td.kmImageContent { padding-top: 9px !important } td.rowContainer.kmFloatLeft, td.rowContainer.kmFloatLeft, td.rowContainer.kmFloatLeft.firstColumn, td.rowContainer.kmFloatLeft.firstColumn, td.rowContainer.kmFloatLeft.lastColumn, td.rowContainer.kmFloatLeft.lastColumn { float: left; clear: both; width: 100% !important } table.templateContainer, table.templateContainer.brandingContainer, div.templateContainer, div.templateContainer.brandingContainer, table.templateRow { max-width: 600px !important; width: 100% !important } h1 { font-size: 40px !important; line-height: 1.1 !important } h2 { font-size: 32px !important; line-height: 1.1 !important } h3 { font-size: 24px !important; line-height: 1.1 !important } h4 { font-size: 18px !important; line-height: 1.1 !important } td.kmTextContent { font-size: 14px !important; line-height: 1.3 !important } td.kmTextBlockInner td.kmTextContent { padding-right: 18px !important; padding-left: 18px !important } table.kmTableBlock.kmTableMobile td.kmTableBlockInner { padding-left: 9px !important; padding-right: 9px !important } table.kmTableBlock.kmTableMobile td.kmTableBlockInner .kmTextContent { font-size: 14px !important; line-height: 1.3 !important; padding-left: 4px !important; padding-right: 4px !important } }
                    </style>
                    <!--[if mso]> <style> .templateContainer { border: 0px none #aaaaaa; background-color: #ffffff; border-radius: 0px; } #brandingContainer { background-color: transparent !important; border: 0; } .templateContainerInner { padding: 0px; } </style> <![endif]-->
                </head>
                <body style="margin:0;padding:0;background-color:#F7F7F7">
                    <center>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" id="bodyTable" width="100%"
                            data-upload-file-url="/ajax/email-editor/file/upload"
                            data-upload-files-url="/ajax/email-editor/files/upload"
                            style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:auto;padding:0;background-color:#F7F7F7;height:100%;margin:0;width:100%">
                            <tbody>
                                <tr>
                                    <td align="center" id="bodyCell" valign="top"
                                        style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:auto;padding-top:50px;padding-left:20px;padding-bottom:20px;padding-right:20px;border-top:0;height:100%;margin:0;width:100%">
                                        <!--[if !mso]><!-->
                                        <div class="templateContainer"
                                            style="border:0 none #aaa;background-color:#fff;border-radius:0;display: table; width:600px">
                                            <div class="templateContainerInner" style="padding:0">
                                                <!--<![endif]-->
                                                <!--[if mso]> <table border="0" cellpadding="0" cellspacing="0" class="templateContainer" width="600" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;"> <tbody> <tr> <td class="templateContainerInner" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;"> <![endif]-->
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                                    style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:fixed">
                                                    <tr>
                                                        <td align="center" valign="top"
                                                            style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:fixed">
                                                            <table border="0" cellpadding="0" cellspacing="0" class="templateRow"
                                                                width="100%"
                                                                style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:fixed">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="rowContainer kmFloatLeft" valign="top"
                                                                            style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:fixed">
                                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                                class="kmImageBlock" width="100%"
                                                                                style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:fixed;min-width:100%">
                                                                                <tbody class="kmImageBlockOuter">
                                                                                    <tr>
                                                                                        <td class="kmImageBlockInner"
                                                                                            style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:fixed;padding:9px;padding-right:9;padding-left:9;"
                                                                                            valign="top">
                                                                                            <table align="left" border="0"
                                                                                                cellpadding="0" cellspacing="0"
                                                                                                class="kmImageContentContainer"
                                                                                                width="100%"
                                                                                                style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:fixed;min-width:100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td class="kmImageContent"
                                                                                                            valign="top"
                                                                                                            style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:fixed;padding:0;font-size:0;padding-top:0px;padding-bottom:0;padding-left:9px;padding-right:9px;text-align: center;">
                                                                                                            <img align="center" alt=""
                                                                                                                class="kmImage"
                                                                                                                src="https://d3k81ch9hvuctc.cloudfront.net/company/LKHFxR/images/cff7f928-7278-4875-9d6b-41bd2f3376c8.png"
                                                                                                                width="100"
                                                                                                                style="border:0;height:auto;line-height:100%;outline:none;text-decoration:none;max-width:100%;padding-bottom:0;display:inline;vertical-align:top;font-size:12px;width:100%;max-width:100px;padding:0;border-width:0;" />
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center" valign="top"
                                                            style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:fixed">
                                                            <table border="0" cellpadding="0" cellspacing="0" class="templateRow"
                                                                width="100%"
                                                                style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:fixed">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="rowContainer kmFloatLeft" valign="top"
                                                                            style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:fixed">
                                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                                class="kmTextBlock" width="100%"
                                                                                style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:fixed">
                                                                                <tbody class="kmTextBlockOuter">
                                                                                    <tr>
                                                                                        <td class="kmTextBlockInner" valign="top"
                                                                                            style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:fixed;">
                                                                                            <table align="left" border="0"
                                                                                                cellpadding="0" cellspacing="0"
                                                                                                class="kmTextContentContainer"
                                                                                                width="100%"
                                                                                                style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:fixed">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td class="kmTextContent" valign="top" style='border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;table-layout:fixed;color:#222;font-family:"Helvetica Neue", Arial;font-size:14px;line-height:1.3;letter-spacing:0;text-align:left;max-width:100%;word-wrap:break-word;padding-top:9px;padding-bottom:9px;padding-left:18px;padding-right:18px;'>
                                                                                                            <!-- jerome edit  Start-->
                                                                                                            ​<div style='color: rgb(34, 34, 34); font-family: "Helvetica Neue", Arial; letter-spacing: 0px; font-size: 24px; font-weight: bold; line-height: 1.1; margin: 0px 0px 12px;'>
                                                                                                                Dear ${firstName},
                                                                                                            </div>
                                                                                                            <div style='color: rgb(34, 34, 34); font-family: "Helvetica Neue", Arial; letter-spacing: 0px; font-size: 24px; font-weight: bold; line-height: 1.1; margin: 0px 0px 12px;'>
                                                                                                                <span style="font-size:14px;">
                                                                                                                    It's a good day today!
                                                                                                                </span>
                                                                                                            </div>
                                                                                                            <div style='color: rgb(34, 34, 34); font-family: "Helvetica Neue", Arial; letter-spacing: 0px; font-size: 24px; font-weight: bold; line-height: 1.1; margin: 0px 0px 12px;'>
                                                                                                                <span style="font-size:14px;">
                                                                                                                    We have already sent payout from ${date_range}.
                                                                                                                </span>
                                                                                                            </div>
                                                                                                            <div style='color: rgb(34, 34, 34); font-family: "Helvetica Neue", Arial; letter-spacing: 0px; font-size: 24px; font-weight: bold; line-height: 1.1; margin: 0px 0px 12px;'>
                                                                                                                <span style="font-size:14px;">
                                                                                                                    Finally!
                                                                                                                </span>
                                                                                                            </div>
                                                                                                            <div style='color: rgb(34, 34, 34); font-family: "Helvetica Neue", Arial; letter-spacing: 0px; font-size: 24px; font-weight: bold; line-height: 1.1; margin: 0px 0px 12px;'>
                                                                                                                <span style="font-size:14px;">
                                                                                                                    All the hard work already paid off.
                                                                                                                </span>
                                                                                                            </div>
                                                                                                            <div style='color: rgb(34, 34, 34); font-family: "Helvetica Neue", Arial; letter-spacing: 0px; font-size: 24px; font-weight: bold; line-height: 1.1; margin: 0px 0px 12px;'>
                                                                                                                <span style="font-size:14px;">
                                                                                                                    Your sales in the cut-off mentioned earlier has an accumulated sum of: ${total_payout}
                                                                                                                </span>
                                                                                                            </div>
                                                                                                            <div style='color: rgb(34, 34, 34); font-family: "Helvetica Neue", Arial; letter-spacing: 0px; font-size: 24px; font-weight: bold; line-height: 1.1; margin: 0px 0px 12px;'>
                                                                                                                <span style="font-size:14px;">
                                                                                                                    Enjoy your payout and continue to be an inspiration to others who are also venturing on this business!
                                                                                                                </span>
                                                                                                            </div>
                                                                                                            <div style='color: rgb(34, 34, 34); font-family: "Helvetica Neue", Arial; letter-spacing: 0px; font-size: 24px; font-weight: bold; line-height: 1.1; margin: 0px 0px 12px;'>
                                                                                                                <span style="font-size:14px;">
                                                                                                                    All the best,<br>
                                                                                                                    Funnel Genie by Product List Genie
                                                                                                                </span>
                                                                                                            </div>
                                                                                                            ${marker ? `
                                                                                                                <div style='color: rgb(34, 34, 34); font-family: "Helvetica Neue", Arial; letter-spacing: 0px; font-size: 24px; font-weight: bold; line-height: 1.1; margin: 0px 0px 12px;'>
                                                                                                                    <span style="font-size:14px;">
                                                                                                                        Reference ID: ${marker}
                                                                                                                    </span>
                                                                                                                </div>
                                                                                                            ` : ""}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td>
                                                                                                            <h3 style="text-align: center;">Payment Breakdown</h3>
                                                                                                            <table style="width: 100%;">
                                                                                                                <thead>
                                                                                                                    <tr>
                                                                                                                        <th>Date Delivered</th>
                                                                                                                        <th>Customer Email</th>
                                                                                                                        <th>Product Name</th>
                                                                                                                        <th>Qty</th>
                                                                                                                        <th>Payout</th>
                                                                                                                    </tr>
                                                                                                                </thead>
                                                                                                                <tbody>
                                                                                                                    ${array.map((el, index) => {
            index += 1;
            return `
                                                                                                                            <tr>
                                                                                                                                <td width="20%">${index}. ${new Date(new Date(parseInt(el.dateStatusDelivered)).setUTCHours(0)).toDateString()}</td>
                                                                                                                                <td width="30%" style="word-break: break-all;">${el.shipping_information.email}</td>
                                                                                                                                <td width="35%">
                                                                                                                                    <ul style="text-align: left; text-decoration: none; list-style: none; list-style-type: none; padding: 0;">
                                                                                                                                        ${el.line_items.map(li => {
                return `
                                                                                                                                                <li style="padding: 10px 5px; font-size: 0.875em; margin: 0; border-bottom: 1px solid #d8d8d8;">${li.title}</li>
                                                                                                                                            `;
            }).join('')}
                                                                                                                                    </ul>
                                                                                                                                </td>
                                                                                                                                <td width="5%">
                                                                                                                                    <ul style="text-align: left; text-decoration: none; list-style: none; list-style-type: none; padding: 0;">
                                                                                                                                        ${el.line_items.map(li => {
                return `
                                                                                                                                                <li style="padding: 10px 5px; font-size: 0.875em; margin: 0; border-bottom: 1px solid #d8d8d8; text-right: center;">${li.quantity}</li>
                                                                                                                                            `;
            }).join('')}
                                                                                                                                    </ul>
                                                                                                                                </td>
                                                                                                                                <td width="10%">
                                                                                                                                    <ul style="text-align: left; text-decoration: none; list-style: none; list-style-type: none; padding: 0;">
                                                                                                                                        ${el.line_items.map(li => {
                return `
                                                                                                                                                <li style="padding: 10px 5px; font-size: 0.875em; margin: 0; border-bottom: 1px solid #d8d8d8; text-right: right;">${"$" + li.payoutPrice}</li>
                                                                                                                                            `;
            }).join('')}
                                                                                                                                    </ul>
                                                                                                                                </td>
                                                                                                                            </tr>
                                                                                                                        `;
        }).join('')}
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if !mso]><!-->
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </center>
                </body>
            </html>
        `;
    },
    isImportBrowserAvailable: () => {
        if (window.File && window.FileReader && window.FileList && window.Blob) return true;
        else return false;
    },
    getExcelOrCSVasArray: (file, cb) => {
        let csv = ["text/csv"],
            excel = [
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
                "application/vnd.ms-excel" // xls
            ],
            { type } = file,
            reader = new FileReader();

        if (csv.includes(type)) {
            reader.readAsText(file);
            reader.onload = function (event) {
                let data = event.target.result;
                let rows = data.split(/\r?\n/);
                let keys = rows.shift().split(",");
                let result = rows.map(function (row) {
                    return row.split(",").reduce(function (map, val, i) {
                        let key = keys[i].toLowerCase().replace(/\s/g, "_");
                        map[key] = val;
                        return map;
                    }, {});
                });
                // filter the result to only get the data that has ref id, tracking and no sync_from pag may sync_from meaning cod un sa fulfiller
                result = result.filter(e => {
                    if (!e.sync_from && e.ref_id && e.tracking_number) return e;
                });
                cb(result);
            }
        } else if (excel.includes(type)) {

        } else { // invalid file type
            throw new Error("Invalid file type");
        }
    }
}