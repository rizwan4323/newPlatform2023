let CryptoJS = require('crypto-js');
let gval = require('./Global_Values');
let return_url = "https://app.productlistgenie.io"; 
// let fs = require('fs');


// Todo:: change this to ngrok to forward order to local
// let return_url = "https://68f43ebf1392.ngrok.io";

function encryptString(str) {
    return CryptoJS.AES.encrypt(str, gval.plg_domain_secret).toString();
}
function decode(str) {
    let bytes = CryptoJS.AES.decrypt(str, gval.plg_domain_secret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
function exclude_in_object(excludes, object) { // typeof excludes is string e.g "link,style.etc..."
    let array = excludes.split(",");
    for (let i = 0; i < array.length; i++) {
        let object_name = array[i];
        delete object[object_name];
    }
    return object;
}
function createTokenFromKeys(public_key = "publickey", private_key = "U2FsdGVkX187eNjhnVShLhv6iXq1BI+X6dKeCus7V08=") {
    try {
        return Buffer.from(public_key +":"+ decode(private_key) ).toString('base64')
    } catch (error) {
        console.log("salt issue")
    }
}

module.exports = {
    /* ==================== START CONFIGURATION ==================== */
    config_button: excludes => {
        let options = {
            // "braintreeToken" : {
            //     "label": "Braintree",
            //     "defaultValue": "",
            //     "widget": "braintree_token"
            // },
            "fbTrack": {
                "label": "Track AddToCart",
                "defaultValue": false,
                "widget": "toggle"
            },
            "fbInitiate": {
                "label": "Track InitiateCheckout",
                "defaultValue": false,
                "widget": "toggle"
            },
            "fbPurchase": {
                "label": "Track Purchase",
                "defaultValue": false,
                "widget": "toggle"
            },
            "buttonLink": {
                "label": "Link",
                "defaultValue": {
                    "url": "/",
                    "target": "_self"
                },
                "widget": "link_list"
            },
            "text": {
                "label": "Text",
                "defaultValue": "Button",
                "widget": "text"
            },
            "subText": {
                "label": "Sub Text",
                "defaultValue": "",
                "widget": "text"
            },
            "animation": {
                "label": "Apply Animation",
                "defaultValue": "",
                "widget": "animation_list"
            },
            "animationInterval": {
                "label": "Animation Interval in second(s)",
                "defaultValue": "2",
                "widget": "counter"
            },
            "alignment": {
                "label": "Alignment",
                "defaultValue": 'center',
                "widget": "alignment"
            },
            "buttonStyle": {
                "label": "Design",
                "defaultValue": "",
                "widget": "color_design_list"
            },
            "fontWeight": {
                "label": "Font Weight",
                "defaultValue": "700",
                "widget": "counter"
            },
            "isSticky": {
                "label": "Use Sticky in Mobile",
                "defaultValue": false,
                "widget": "toggle"
            },
            "fontSize": {
                "label": "Font Size",
                "defaultValue": "20px",
                "widget": "px"
            },
            "buttonWidth": {
                "label": "Width",
                "defaultValue": "100%",
                "widget": "width"
            },
            "buttonColors": {
                "label": "Color",
                "defaultValue": {
                    "color": "#FFF",
                    "backgroundColor": "#26c686",
                    "hoverColor": "#2A92BF"
                },
                "widget": "button_color"
            },
            "borderRadius": {
                "label": "Border Radius",
                "defaultValue": "5px",
                "widget": "border_radius"
            },
            "padding": {
                "label": "Padding",
                "defaultValue": "15px 20px",
                "widget": "padding"
            }
        };
        if(excludes) options = exclude_in_object(excludes, options);
        return JSON.stringify(options);
    },

    config_upsell: excludes => {
        let options = {
            "productQty": {
                "label": "Quantity [qty]",
                "defaultValue": "1",
                "widget": "text"
            },
            "productName": {
                "label": "Name [name]",
                "defaultValue": "Product Name",
                "widget": "text"
            },
            "productPrice": {
                "label": "Price [price]",
                "defaultValue": "9.99",
                "widget": "text"
            },
            "productTags": {
                "label": "Tag",
                "defaultValue": "",
                "widget": "text"
            },
            "productSku": {
                "label": "PLG Variant ID",
                "defaultValue": "",
                "widget": "text"
            }
        }
        if(excludes) options = exclude_in_object(excludes, options);
        return JSON.stringify(options);
    },

    config_normal_upsell: excludes => {
        let options = {
            "productName": {
                "label": "Product Name",
                "defaultValue": "Your Product Name",
                "widget": "text"
            },
            "variant": {
                "label": "Variants",
                "defaultValue": "",
                "widget": "normal_variant"
            }
        }
        if(excludes) options = exclude_in_object(excludes, options);
        return JSON.stringify(options);
    },
    config_order_bump_subscription: excludes => {
        let options = {
            "addonPrice": {
                "label": "Product Addon Price (COD currency will use in variant selector)",
                "defaultValue": "20",
                "widget": "text"
            },
            "variants": {
                "label": "Variants",
                "defaultValue": JSON.stringify([]),
                "widget": "variants"
            },
            "alignment": {
                "label": "Allignment",
                "defaultValue": 'left',
                "widget": "alignment"
            },
            "addonText": {
                "label": "Product Addon Text",
                "defaultValue": "YES, I Want Lifetime Protection PLUS Expedited Shipping!",
                "widget": "text"
            },
            "undeline": {
                "label": "Use Underline",
                "defaultValue": false,
                "widget": "toggle"
            },
            "checked": {
                "label": "Selected",
                "defaultValue": false,
                "widget": "toggle"
            },
            "fontSize": {
                "label": "Font Size",
                "defaultValue": "15px",
                "widget": "px"
            },
            "fontColor": {
                "label": "Font Color",
                "defaultValue": "#fff",
                "widget": "color_picker"
            },
            "backgroundColor": {
                "label": "Background Color",
                "defaultValue": "#989797",
                "widget": "color_picker"
            }
        }
        if(excludes) options = exclude_in_object(excludes, options);
        return JSON.stringify(options);
    },

    config_subscription_product: excludes => {
        let options = {
            "subscription_header": {
                "label": "Subscription Header",
                "defaultValue": "Select Subscription",
                "widget": "text"
            },
            "subscription_list": { // for authorize
                "label": "Subscription List",
                "defaultValue": JSON.stringify([ { selected: true, rebill: 1, day_or_month: "months", name: "Your Subscription Name", desc: "lorem ipsum dolor", price: 9.99 } ]),
                "widget": "subscription_products"
            },
            "conekta_subscription_list": {
                "label": "Plan List",
                "defaultValue": "",
                "widget": "conekta_subscription_products"
            },
            "subscription_button_text": {
                "label": "Subscribe Button Text",
                "defaultValue": "Select",
                "widget": "text"
            },
            "subscription_button_size": {
                "label": "Subscribe Button Font Size",
                "defaultValue": "17px",
                "widget": "px"
            },
            "subscription_button_padding": {
                "label": "Subscribe Button Padding",
                "defaultValue": "5px",
                "widget": "padding"
            },
            "subscription_button_width": {
                "label": "Subscription Selection/Dropdown Width",
                "defaultValue": "100%",
                "widget": "width"
            },
            "subscription_style_options": {
                "label": "Subscription Style (radio or dropdown)",
                "defaultValue": false,
                "widget": "toggle"
            },
            "subscription_dropdown_color": {
                "label": "Subscription Dropdown Style",
                "defaultValue": {
                            "color": "#FFF",
                            "backgroundColor": "#26c686",
                            "hoverColor": "#2A92BF"
                        },
                "widget": "button_color"
            }
            
        }
        if(excludes) options = exclude_in_object(excludes, options);
        return JSON.stringify(options);
    },

    config_confirmation: excludes => {
        let options = {
            "use_confirmation": {
                "label": "Use Confirmation",
                "defaultValue": false,
                "widget": "toggle"
            },
            "borderRadius_popup": {
                "label": "Confirmation Body Radius",
                "defaultValue": "0px",
                "widget": "border_radius"
            },
            "header": {
                "label": "Confirmation Text",
                "defaultValue": "Are you sure you want to purchase ?",
                "widget": "text"
            },
            "positive_button": {
                "label": "Confirmation Positive Text",
                "defaultValue": "Yes",
                "widget": "text"
            },
            // "positive_button_colors": {
            //     "label": "Confirmation Positive Button Colors",
            //     "defaultValue": {
            //         "color": "#FFF",
            //         "backgroundColor": "#26c686",
            //         "hoverColor": "#2A92BF"
            //     },
            //     "widget": "button_color"
            // },
            "negative_button": {
                "label": "Confirmation Negative Text",
                "defaultValue": "No",
                "widget": "text"
            },
           
            // "negative_button_colors": {
            //     "label": "Confirmation Negative Button Colors",
            //     "defaultValue": {
            //         "color": "#FFF",
            //         "backgroundColor": "#d33b22",
            //         "hoverColor": "#c87668"
            //     },
            //     "widget": "button_color"
            // }
        }
        if(excludes) options = exclude_in_object(excludes, options);
        return JSON.stringify(options);
    },

    config_non_cod_form: excludes => {
        let options = {
            "showCard": {
                "label": "Show Card",
                "defaultValue": false,
                "widget": "toggle"
            },
            "testMode": {
                "label": "Test Mode",
                "defaultValue": false,
                "widget": "toggle"
            },
            "formHeader": {
                "label": "Contact Information Heading",
                "defaultValue": "Contact Information",
                "widget": "text"
            },
            "firstName": {
                "label": "First Name Placeholder",
                "defaultValue": "First Name",
                "widget": "text"
            },
            "lastName": {
                "label": "Last Name Placeholder",
                "defaultValue": "Last Name",
                "widget": "text"
            },
            "enablePhone": {
                "label": "Enable Phone Number ",
                "defaultValue": "true",
                "widget": "toggle"
            },
            "phone": {
                "label": "Phone Placeholder",
                "defaultValue": "Phone",
                "widget": "text"
            },
            "email": {
                "label": "Email Placeholder",
                "defaultValue": "Email",
                "widget": "text"
            },
            "address": {
                "label": "Address Placeholder",
                "defaultValue": "Street Address",
                "widget": "text"
            },
            "city": {
                "label": "City Placeholder",
                "defaultValue": "City",
                "widget": "text"
            },
            "zipcode": {
                "label": "Zip code Placeholder",
                "defaultValue": "Zip code",
                "widget": "text"
            },
            "state": {
                "label": "State / Province Placeholder",
                "defaultValue": "State / Province",
                "widget": "text"
            },
            "creditCard": {
                "label": "Credit Card Heading",
                "defaultValue": "Credit Card",
                "widget": "text"
            },
            "selected_country": {
                "label": "Selected Country",
                "defaultValue": JSON.stringify({
                    "label": "Selected Country",
                    "list": [{ "label": "Mexico", "value": "es,MX,$,MXN" }, { "label": "United States of America", "value": "en,US,$,USD" }],
                    "selected": "en,US,$,USD"
                }),
                "widget": "custom_dropdown"
            }
        }
        if(excludes) options = exclude_in_object(excludes, options);
        return JSON.stringify(options);
    },
    /* ==================== END CONFIGURATION ==================== */

    /* ==================== START STYLE GENERATION ==================== */
    generate_button_style: config => {
        return `<style>
            #${config._meta.htmlID} button {
                border: none;
                cursor: pointer;
                ${config.alignment ? "text-align:" + config.alignment + ";" : ""}
                ${config.borderRadius ? "border-radius:" + config.borderRadius + ";" : ""}
                ${config.buttonColors.backgroundColor ? "background-color:" + config.buttonColors.backgroundColor + ";" : ""}
                ${config.buttonColors.color ? "color:" + config.buttonColors.color + ";" : ""}
                ${config.buttonWidth ? "width:" + config.buttonWidth + ";" : ""}
                ${config.padding ? "padding:" + config.padding + ";" : ""}
                ${config.fontSize ? "font-size:" + config.fontSize + ";" : ""}
                ${config.fontWeight ? "font-weight:" + config.fontWeight + ";" : ""}
            }
            #${config._meta.htmlID} button .subtext {
                font-weight: 400;
                ${config.fontSize ? "font-size: calc(" + config.fontSize + " * .75);" : ""}
            }
            #${config._meta.htmlID} button:hover:enabled {
                ${config.buttonColors.hoverColor ? "background-color:" + config.buttonColors.hoverColor + ";" : ""}
            }
            #${config._meta.htmlID} button:disabled {
                opacity: 0.6;
                cursor: unset;
            }
            ${config.animation && config.animation === "pulsate" ? ".pulsate { -webkit-animation: pulsate " + config.animationInterval + "s ease-in-out infinite both; animation: pulsate " + config.animationInterval + "s ease-in-out infinite both; } @-webkit-keyframes pulsate { 0% { -webkit-transform: scale(1); transform: scale(1); } 50% { -webkit-transform: scale(0.9); transform: scale(0.9); } 100% { -webkit-transform: scale(1); transform: scale(1); } } @keyframes pulsate { 0% { -webkit-transform: scale(1); transform: scale(1); } 50% { -webkit-transform: scale(0.9); transform: scale(0.9); } 100% { -webkit-transform: scale(1); transform: scale(1); } }" : ""}
            ${config.animation && config.animation === "shake-horizontal" ? ".shake-horizontal { -webkit-animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both; animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both; } @-webkit-keyframes shake-horizontal { 0%, 100% { -webkit-transform: translateX(0); transform: translateX(0); } 10%, 30%, 50%, 70% { -webkit-transform: translateX(-10px); transform: translateX(-10px); } 20%, 40%, 60% { -webkit-transform: translateX(10px); transform: translateX(10px); } 80% { -webkit-transform: translateX(8px); transform: translateX(8px); } 90% { -webkit-transform: translateX(-8px); transform: translateX(-8px); } } @keyframes shake-horizontal { 0%, 100% { -webkit-transform: translateX(0); transform: translateX(0); } 10%, 30%, 50%, 70% { -webkit-transform: translateX(-10px); transform: translateX(-10px); } 20%, 40%, 60% { -webkit-transform: translateX(10px); transform: translateX(10px); } 80% { -webkit-transform: translateX(8px); transform: translateX(8px); } 90% { -webkit-transform: translateX(-8px); transform: translateX(-8px); } }" : ""}
            ${config.animation && config.animation === "shake-vertical" ? ".shake-vertical { -webkit-animation: shake-vertical 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both; animation: shake-vertical 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both; } @-webkit-keyframes shake-vertical { 0%, 100% { -webkit-transform: translateY(0); transform: translateY(0); } 10%, 30%, 50%, 70% { -webkit-transform: translateY(-8px); transform: translateY(-8px); } 20%, 40%, 60% { -webkit-transform: translateY(8px); transform: translateY(8px); } 80% { -webkit-transform: translateY(6.4px); transform: translateY(6.4px); } 90% { -webkit-transform: translateY(-6.4px); transform: translateY(-6.4px); } } @keyframes shake-vertical { 0%, 100% { -webkit-transform: translateY(0); transform: translateY(0); } 10%, 30%, 50%, 70% { -webkit-transform: translateY(-8px); transform: translateY(-8px); } 20%, 40%, 60% { -webkit-transform: translateY(8px); transform: translateY(8px); } 80% { -webkit-transform: translateY(6.4px); transform: translateY(6.4px); } 90% { -webkit-transform: translateY(-6.4px); transform: translateY(-6.4px); } }" : ""}
            ${config.animation && config.animation === "bounce-top" ? ".bounce-top { -webkit-animation: bounce-top 0.9s both; animation: bounce-top 0.9s both; } @-webkit-keyframes bounce-top { 0% { -webkit-transform: translateY(-45px); transform: translateY(-45px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; opacity: 1; } 24% { opacity: 1; } 40% { -webkit-transform: translateY(-24px); transform: translateY(-24px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 65% { -webkit-transform: translateY(-12px); transform: translateY(-12px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 82% { -webkit-transform: translateY(-6px); transform: translateY(-6px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 93% { -webkit-transform: translateY(-4px); transform: translateY(-4px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 25%, 55%, 75%, 87% { -webkit-transform: translateY(0px); transform: translateY(0px); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; } 100% { -webkit-transform: translateY(0px); transform: translateY(0px); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; opacity: 1; } } @keyframes bounce-top { 0% { -webkit-transform: translateY(-45px); transform: translateY(-45px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; opacity: 1; } 24% { opacity: 1; } 40% { -webkit-transform: translateY(-24px); transform: translateY(-24px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 65% { -webkit-transform: translateY(-12px); transform: translateY(-12px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 82% { -webkit-transform: translateY(-6px); transform: translateY(-6px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 93% { -webkit-transform: translateY(-4px); transform: translateY(-4px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 25%, 55%, 75%, 87% { -webkit-transform: translateY(0px); transform: translateY(0px); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; } 100% { -webkit-transform: translateY(0px); transform: translateY(0px); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; opacity: 1; } }" : ""}
            @media only screen and (max-width: 768px) {
                #${config._meta.htmlID} button {
                    width: 100% !important;
                }
            }
        </style>
        ${config.animation && config.animation !== "pulsate" ?
        `
        <script>
            setTimeout(() => {
                let btn_${config._meta.htmlID} = document.querySelector("#${config._meta.htmlID} .${config.animation}");
                setInterval(() => {
                    btn_${config._meta.htmlID}.classList.toggle("${config.animation}");
                }, ${config.animationInterval * 1000});
            }, ${config.animationInterval * 1000});
        </script>
        `
        : ""}`;
    },

    generate_form_style: config => `
        <style>
            #${config._meta.htmlID} .card-wrapper .jp-card-container {
                transform: scale(0.7) !important;
                display: ${config.showCard ? "block" : "none"};
            }
        </style>
    `,

    generate_input_style: config => {
        return `<style>
            #${config._meta.htmlID} input, #${config._meta.htmlID} select {
                
                margin-bottom: 10px;
                border-top-width: 1px;
                border-top-style: solid;
                border-top-color: #CCC;
                border-left-width: 1px;
                border-left-style: solid;
                border-left-color: #CCC;
                border-right-width: 1px;
                border-right-style: solid;
                border-right-color: #CCC;
                border-bottom-width: 1px;
                border-bottom-style: solid;
                border-bottom-color: #CCC;
                padding: 10px;
                color: #000;
                background-color: #FFF;
                font-size: 12px;
                width: 100%;
                border-radius: 0px;
            }
            #${config._meta.htmlID} select {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'><path fill='%23${config.buttonColors.color.replace(/#/g, '')}' d='M256 298.3l174.2-167.2c4.3-4.2 11.4-4.1 15.8.2l30.6 29.9c4.4 4.3 4.5 11.3.2 15.5L264.1 380.9c-2.2 2.2-5.2 3.2-8.1 3-3 .1-5.9-.9-8.1-3L35.2 176.7c-4.3-4.2-4.2-11.2.2-15.5L66 131.3c4.4-4.3 11.5-4.4 15.8-.2L256 298.3z'/></svg>") no-repeat;
                background-size: 12px;
                background-position: calc(100% - 20px) center;
                background-repeat: no-repeat;
            }


            #${config._meta.htmlID} .container {
                position: relative;
                padding-left: 35px;
                margin-bottom: 12px;
                margin-top: 12px;
                cursor: pointer;
                
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
             #${config._meta.htmlID} .container input {
                position: absolute;
                opacity: 0;
                cursor: pointer;
            }
             #${config._meta.htmlID} .checkmark {
                position: absolute;
                top: 0;
                left: 0;
                height: 20px;
                width: 20px;
                background-color: #eee;
                border-radius: 50%;
            }
             #${config._meta.htmlID} .container:hover input ~ .checkmark {
                background-color: #ccc;
            }
             #${config._meta.htmlID} .container input:checked ~ .checkmark {
                
                ${config.buttonColors.backgroundColor ? "background-color:" + config.buttonColors.backgroundColor + ";" : "#2196F3;"}
            }
             #${config._meta.htmlID} .checkmark:after {
                content: "";
                position: absolute;
                display: none;
            }
             #${config._meta.htmlID} .container input:checked ~ .checkmark:after {
                display: block;
            }
             #${config._meta.htmlID} .container .checkmark:after {
                top: 6px;
                left: 6px;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: white;
            }
        </style>`;
    },

    generate_variant_style: config => {
        return `<style>
            #${config._meta.htmlID} .pricing-table {
                background-color: #eee;            
                color: rgb(74, 74, 74);
            }
        
            #${config._meta.htmlID} .block-heading {
                padding-top: 50px;
                margin-bottom: 40px;
                text-align: center;
            }

            #${config._meta.htmlID} .pricer-table{
                align-items: center;
                grid-gap: 1rem;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
            }

            #${config._meta.htmlID} .pricer-childs{
                display: flex;
                height: 100%;
                flex-direction: column;
                justify-content: space-between;
            }
            
            #${config._meta.htmlID} .selectedPriceTable{
                border: 2px solid ${config.styleColors.backgroundColor} !important;
            }
        
            #${config._meta.htmlID} .block-heading h2 {
                color: #bd2525;
                /* Header TOP h2 Colors */
            }
        
            #${config._meta.htmlID} .block-heading p {
                text-align: center;
                max-width: 420px;
                margin: auto;
                opacity: 0.7;
            }
        
            #${config._meta.htmlID} .heading {
                text-align: center;
                padding: 17% 15%;
                padding-bottom: 19px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }
            


            #${config._meta.htmlID} .item {
                background-color: #fbfbfb;
                /* Main Card BG Colors */
                cursor: pointer;
                height: 100%;
                width: 100%;
                box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.075);
                border: 1px solid #4a484882;
                /* MAIN CARD Border Top Colors */                
                overflow: hidden;
                position: relative;
            }
        
            #${config._meta.htmlID} .col-md-5:not(:last-child) .item {
                margin-bottom: 30px;
            }
        
            #${config._meta.htmlID} .item button {
                font-weight: 600;
            }
        
            #${config._meta.htmlID} .ribbon {
                width: 176px;
                font-size: 12px;
                text-align: center;
                font-weight: bold;
                box-shadow: 0px 2px 3px rgb(136 136 136 / 25%);
                background: ${config.styleColors.backgroundColor};
                color: ${config.styleColors.color};
                transform: rotate(45deg);
                position: absolute;
                right: -67px;
                top: -27px;
                padding-top: 57px;
                padding-bottom: 14px;
            }
        
            #${config._meta.htmlID} .item p {
                text-align: center;
                margin-top: 5px;
                opacity: 0.7;
            }
        
            #${config._meta.htmlID} .features .feature {
                font-weight: 600;
            }
        
            #${config._meta.htmlID} .features h4 {
                text-align: center;
                font-size: 18px;
                padding: 5px;
            }
        
            #${config._meta.htmlID} .price h4 {
                margin: 6px 0;
                font-size: 1.4rem;
                text-align: center;
                color: #262626;
                /* Bottom Prices Colors */
            }
        
           
            #${config._meta.htmlID} .country-selector {
                display: flex;
                align-items: center;
                flex-flow: row wrap;
                margin-bottom: 10px;
                justify-content: center;
            }
            #${config._meta.htmlID} .country-selector label {
                display: flex;
                align-items: center;
                padding: 10px;
                cursor: pointer;
                margin: 2px;
                border: 1px solid transparent;
                -webkit-box-shadow: 1px 1px 1px 1px #abababbf;
                -moz-box-shadow: 1px 1px 1px 1px #abababbf;
                box-shadow: 1px 1px 1px 1px #abababbf;
            }
            #${config._meta.htmlID} .plg_variants, #${config._meta.htmlID} plg_variants_no_result {
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                cursor: pointer;
                padding: 10px 5px;
                border: 1px solid #ffffff00;
                font-size: ${config.fontSize};
                color: ${config.fontColor};
            }
            #${config._meta.htmlID} .plg_variants:hover {
                background-color: ${config.hoverColor} !important;
                border: 1px solid #00000033 !important;
                border-radius: 4px;
            }
            #${config._meta.htmlID} .plg_variants_active {
                background-color: ${config.hoverColor} !important;
                border: 1px solid #00000033 !important;
                border-radius: 4px;
            }
            #${config._meta.htmlID} .variant_compare {
                color: ${config.compareFontColor};
                display: block;
            }
            #${config._meta.htmlID} input[type="radio"] { margin: 10px 0 0 15px; }
            #${config._meta.htmlID} input[type="radio"]:checked:before {
                border: 10px solid #fcfcfc; box-shadow: 0px 0px 3px 0px #00000040; width: 25px; height: 25px; left: 10px;
            }
            #${config._meta.htmlID} input[type="radio"]:checked:after {
                margin: 5px; width: 15px; height: 15px; border: 1px solid #45484C;
            }
            #${config._meta.htmlID} input[type="radio"]:checked:after, input[type="radio"]:checked:before {
                content: ''; background: linear-gradient(to bottom, #0fe469 0%, #145b32 100%); border-radius: 50%; position: absolute; top: 0; left: 10px; cursor: pointer;
            }
            #${config._meta.htmlID} input[type="radio"]:before {
                border: 10px solid #fcfcfc; box-shadow: 0px 0px 3px 0px #00000040; width: 25px; height: 25px; left: 10px;
            }
            #${config._meta.htmlID} input[type="radio"]:after {
                margin: 5px; width: 15px; height: 15px; border: 1px solid #45484C;
            }
            #${config._meta.htmlID} input[type="radio"]:after, input[type="radio"]:before {
                content: ''; background-color: #b3abab; border-radius: 50%; position: absolute; top: 0; left: 10px; cursor: pointer;
            }
            #${config._meta.htmlID} .selected_style_content_1 {
                position: absolute;
                z-index: 1;
                left: -10px;
                top: 5px;
                transform: rotate(200deg) scaleX(-1);
                width: 30px;
                height: 30px;
            }
            #${config._meta.htmlID} .selected_style_content_2 {
                width: 100%;
                margin-left: -11px;
                margin-bottom: 5px;
            }
            #${config._meta.htmlID} .selected_style_content_2 div {
                text-align: center;
                max-width: 200px;
                background-color: ${config.styleColors.backgroundColor};
                color: ${config.styleColors.color};
                padding: 5px;
                position: relative;
                clip-path: polygon(0% 0%, 100% 0, 180px 50%, 100% 100%, 0% 100%);
            }
            #${config._meta.htmlID} .selected_style_content_2 label {
                font-weight: 700;
            }
        </style>`;
    },

    generate_braintree_style: config => `
    <style>
        .hosted-field {
            height: 36px;
            box-sizing: border-box;
            width: 100%;
            padding: 10px;
            display: inline-block;
            box-shadow: none;
            font-weight: 600;
            font-size: 12px;
            border-radius: 0px;
            border: 1px solid #ccc;
            line-height: 20px;
            background: #fff;
            margin-bottom: 10px;
            background: linear-gradient(to right, white 50%, #fcfcfc 50%);
            background-size: 200% 100%;
            background-position: right bottom;
            transition: all 300ms ease-in-out;
        }
        
        .hosted-fields--label {
            font-family: courier, monospace;
            text-transform: uppercase;
            font-size: 14px;
            display: block;
            margin-bottom: 6px;
        }
        
        .button-container {
            display: block;
            text-align: center;
        }
        
        .button {
            cursor: pointer;
            font-weight: 500;
            line-height: inherit;
            position: relative;
            text-decoration: none;
            text-align: center;
            border-style: solid;
            border-width: 1px;
            border-radius: 3px;
            -webkit-appearance: none;
            -moz-appearance: none;
            display: inline-block;
        }
        
        .button--small {
            padding: 10px 20px;
            font-size: 0.875rem;
        }
        
        .button--green {
            outline: none;
            background-color: #64d18a;
            border-color: #64d18a;
            color: white;
            transition: all 200ms ease;
        }
        
        .button--green:hover {
            background-color: #8bdda8;
            color: white;
        }
        
        .braintree-hosted-fields-focused {
            border: 1px solid #64d18a;
            border-radius: 1px;
            background-position: left bottom;
        }
        
        .braintree-hosted-fields-invalid {
            border: 1px solid #ed574a;
        }
        
        .braintree-hosted-fields-valid {
        }
        
        #cardForm {
            max-width: 50.75em;
            margin: 0 auto;
            padding: 1.875em;
        }
        </style>
    `,
    generate_subscription_style: config => `
        <style>
            #${config._meta.htmlID} .subscription-product {
                width: 100%;
                display: flex;
                flex-flow: row wrap;
                justify-content: space-around;
            }
            #${config._meta.htmlID} .subscription-container {
                text-align: center;
                padding: 10px 15px;
                min-width: 200px;
            }
            #${config._meta.htmlID} .subscription-product button {
                margin-top: 10px;
                padding: 5px;
            }
            #${config._meta.htmlID} .border-left {
                border-left: 1px solid #e7e7e7;
            }
            #${config._meta.htmlID} .frequent-mini {
                margin-left: 5px;
            }
            #${config._meta.htmlID} .frequent {
                font-size: 25px;
                font-weight: 700;
                text-transform: capitalize;
                text-align: center;
            }
            #${config._meta.htmlID} .frequent-desc .subscription-price sup {
                font-size: 15px;
            }
            #${config._meta.htmlID} .subscription-price {
                display: flex;
                align-items: baseline;
                justify-content: center;
            }
            #${config._meta.htmlID} .subscription-price p {
                font-size: 30px;
                font-weight: 700;
            }
            #${config._meta.htmlID} .half-left {
                width: 49.5%; float: left; padding: 0 0.5% 0 0;
            }
            #${config._meta.htmlID} .half-right {
                width: 49.5%; float: right; padding: 0 0 0 0.5%;
            }
        </style>
    `,

    generate_subscription_dropdown_style: config => `
    <style>
    .custom-select {
        position: relative;
      }
      .plg-custom-select {
          display: flex;
          justify-content: center;
      }
      .subscrption-dropdown {
          width:100%; 
          max-width: ${config.subscription_button_width};
      }
      
      .custom-select select {
        display: none;
      }
      
      .select-selected {
          color:${config.subscription_dropdown_color.color};
          background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'><path fill='%23fff' d='M256 298.3l174.2-167.2c4.3-4.2 11.4-4.1 15.8.2l30.6 29.9c4.4 4.3 4.5 11.3.2 15.5L264.1 380.9c-2.2 2.2-5.2 3.2-8.1 3-3 .1-5.9-.9-8.1-3L35.2 176.7c-4.3-4.2-4.2-11.2.2-15.5L66 131.3c4.4-4.3 11.5-4.4 15.8-.2L256 298.3z'/></svg>") no-repeat;
          background-size: 12px;
          background-position: calc(100% - 20px) center;
          background-color: ${config.subscription_dropdown_color.backgroundColor};
      }
      
      .select-selected:after {
        position: absolute;
        content: "";
        top: 14px;
        right: 10px;
        width: 0;
        height: 0;
        border-color: #fff transparent transparent transparent; 
      }
     
      .select-selected.select-arrow-active:after {
        border-color: transparent transparent #fff transparent;
        top: 7px;
      }
      
      .select-items div,.select-selected {
        color:${config.subscription_dropdown_color.color};
        padding: 8px 16px;
        border: 1px solid transparent;
        cursor: pointer;
        user-select: none;
      }

      .select-items div {
          color: #373a3c;
      }
      
      .select-items {
          color: #373a3c !important;
        position: absolute;
        background-color: #fff;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 99;
        filter: drop-shadow(0 0 0.75rem #373a3c);
      }
      
      .select-hide {
        display: none;
      }
      
      .select-items div:hover, .same-as-selected {
        background-color: ${config.subscription_dropdown_color.hoverColor};
      }
      @media only screen and (max-width: 600px) {
        .subscrption-dropdown {
            max-width: 100%;
        }
      }
    </style>
`,

    generate_stripe_style: config => `
        <style>
            /* start for multi step */
            .stripe-form #example-5{
                background-color: ${config.formColor} !important;
            }
            .stripe-form .example.example5 fieldset legend {
                color: ${config.textColor} !important;
                background-color: ${config.formColor} !important;
            }
            .first-step-stripe-form label, .stripe-form .example.example5 label {
                color: ${config.textColor} !important;
            }
            .first-step-stripe-form input, .stripe-form .example.example5 .input {
                color: ${config.textColor} !important;
            }
            .first-step-stripe-form input, .stripe-form .example.example5 .input::placeholder {
                color: #00000036;
            }
            .stripe-form button, #${config._meta.htmlID} .first-step-container button {
                color: ${config.buttonColors.color} !important;
                background-color: ${config.buttonColors.backgroundColor} !important;
            }
            .stripe-form button:hover {
                background-color: ${config.buttonColors.hoverColor} !important;
            }
            /* end for multi step */

            .stripe-form body {
                background: #fff;
                min-height: 100%;
                display: -ms-flexbox;
                display: flex;
                -ms-flex-direction: column;
                flex-direction: column;
                font-size: 62.5%;
                font-family: Roboto, Open Sans, Segoe UI, sans-serif;
                font-weight: 400;
                font-style: normal;
                -webkit-text-size-adjust: 100%;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-rendering: optimizeLegibility;
                font-feature-settings: "pnum";
                font-variant-numeric: proportional-nums;
            }
            .stripe-form .common-SuperTitle {
                font-weight: 300;
                font-size: 45px;
                line-height: 60px;
                color: #32325d;
                letter-spacing: -0.01em;
            }
            .stripe-form .common-IntroText {
                font-weight: 400;
                font-size: 21px;
                line-height: 31px;
                color: #525f7f;
            }
            .stripe-form .common-BodyText {
                font-weight: 400;
                font-size: 17px;
                line-height: 26px;
                color: #6b7c93;
            }
            .stripe-form .common-Link {
                color: #6772e5;
                font-weight: 500;
                transition: color 0.1s ease;
                cursor: pointer;
            }
            .stripe-form .common-Button {
                white-space: nowrap;
                display: inline-block;
                height: 40px;
                line-height: 40px;
                padding: 0 14px;
                box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
                background: #fff;
                border-radius: 4px;
                font-size: 15px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.025em;
                color: #6772e5;
                text-decoration: none;
                transition: all 0.15s ease;
            }
            .stripe-form .common-Button:hover {
                color: #7795f8;
                transform: translateY(-1px);
                box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
            }
            .stripe-form .common-Button:active {
                color: #555abf;
                background-color: #f6f9fc;
                transform: translateY(1px);
                box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
            }
            .stripe-form .common-ButtonGroup {
                display: -ms-flexbox;
                display: flex;
                -ms-flex-wrap: wrap;
                flex-wrap: wrap;
                margin: -10px;
            }
            .stripe-form .stripes {
                position: absolute;
                width: 100%;
                transform: skewY(-12deg);
                height: 950px;
                top: -350px;
                background: linear-gradient(180deg, #e6ebf1 350px, rgba(230, 235, 241, 0));
            }
            .stripe-form .stripes .s1 {
                height: 380px;
                top: 0;
                left: 0;
                width: 24%;
                background: linear-gradient(90deg, #e6ebf1, rgba(230, 235, 241, 0));
            }
            .stripe-form .stripes .s2 {
                top: 380px;
                left: 4%;
                width: 35%;
                background: linear-gradient(90deg, rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0));
            }
            .stripe-form .stripes .s3 {
                top: 380px;
                right: 0;
                width: 38%;
                background: linear-gradient(90deg, #e4e9f0, rgba(228, 233, 240, 0));
            }
            .stripe-form main>.container-lg {
                display: -ms-flexbox;
                display: flex;
                -ms-flex-wrap: wrap;
                flex-wrap: wrap;
                position: relative;
                max-width: 750px;
            }
            .stripe-form main>.container-lg .cell {
                display: -ms-flexbox;
                display: flex;
                -ms-flex-direction: column;
                flex-direction: column;
                -ms-flex-pack: center;
                justify-content: center;
                position: relative;
                -ms-flex: auto;
                flex: auto;
            }
            .stripe-form main>.container-lg .example .caption {
                display: flex;
                justify-content: space-between;
                position: absolute;
                width: 100%;
                top: 100%;
                left: 0;
                padding: 15px 10px 0;
                color: #aab7c4;
                font-family: Roboto, "Open Sans", "Segoe UI", sans-serif;
                font-size: 15px;
                font-weight: 500;
            }
            .stripe-form main>.container-lg .example form {
                margin-top: 10px;
                position: relative;
                width: 100%;
                transition-property: opacity, transform;
                transition-duration: 0.35s;
                transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
            }
            .stripe-form main>.container-lg .example .error {
                display: -ms-flexbox;
                display: flex;
                -ms-flex-pack: center;
                justify-content: center;
                margin-top: 20px;
                padding: 0 15px;
                font-size: 13px !important;
                opacity: 0;
                transform: translateY(10px);
                transition-property: opacity, transform;
                transition-duration: 0.35s;
                transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
                background-color: #f20100;
                padding: 5px;
            }
            .stripe-form main>.container-lg .example .success {
                display: -ms-flexbox;
                display: flex;
                -ms-flex-direction: column;
                flex-direction: column;
                -ms-flex-align: center;
                align-items: center;
                -ms-flex-pack: center;
                justify-content: center;
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                text-align: center;
                pointer-events: none;
                overflow: hidden;
            }
            .stripe-form main>.container-lg .example .success>* {
                transition-property: opacity, transform;
                transition-duration: 0.35s;
                transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
                opacity: 0;
                transform: translateY(50px);
            }
            .stripe-form .example.example5 fieldset legend {
                margin: 0 auto;
                padding: 0 10px;
                text-align: center;
                font-size: 14px;
                font-weight: 500;
                color: #cdd0f8;
                background-color: #9169d8;
            }
            .first-step-stripe-form input, .stripe-form .example.example5 label {
                width: 100%;
                color: #cdd0f8;
                font-size: 13px;
                font-weight: 500;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .first-step-stripe-form input, .stripe-form .example.example5 .input, .stripe-form .example.example5 .select-parent select {
                display: inline-block;
                border-top-width: 1px;
                border-top-style: solid;
                border-top-color: #CCC;
                border-left-width: 1px;
                border-left-style: solid;
                border-left-color: #CCC;
                border-right-width: 1px;
                border-right-style: solid;
                border-right-color: #CCC;
                border-bottom-width: 1px;
                border-bottom-style: solid;
                border-bottom-color: #CCC;
                padding: 10px;
                color: #000;
                background-color: #FFF;
                font-size: 12px;
                width: 100%;
                border-radius: 0px;
            }
            .example.example5 input, .stripe-form .example.example5 button, .stripe-form .example.example5 select {
                -webkit-animation: 1ms void-animation-out;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                outline: none;
                border-style: none;
                border-radius: 0;
            }
            .stripe-form .stripes .stripe { position: absolute; height: 190px; }
            .stripe-form .common-Button--default { color: #fff; background: #6772e5; }
            .stripe-form .common-Button--default:hover { color: #fff; background-color: #7795f8; }
            .stripe-form .common-Button--default:active { color: #e6ebf1; background-color: #555abf; }
            .stripe-form .common-Button--dark { color: #fff; background: #32325d; }
            .stripe-form .common-Button--dark:hover { color: #fff; background-color: #43458b; }
            .stripe-form .common-Button--dark:active { color: #e6ebf1; background-color: #32325d; }
            .stripe-form .common-Button--disabled { color: #fff; background: #aab7c4; pointer-events: none; }
            .stripe-form .common-ButtonIcon { display: inline; margin: 0 5px 0 0; position: relative; }
            .stripe-form .common-ButtonGroup .common-Button { -ms-flex-negative: 0; flex-shrink: 0; margin: 10px; }
            .stripe-form body { overflow-x: hidden; background-color: #f6f9fc; }
            .stripe-form main { position: relative; display: block; z-index: 1; }
            .stripe-form .common-Link:hover { color: #32325d; }
            .stripe-form .common-Link:active { color: #000; }
            .stripe-form .common-Link--arrow:after { font: normal 16px StripeIcons; content: "\\\\2192"; padding-left: 5px; }
            .stripe-form .container, .stripe-form .container-fluid, .stripe-form .container-lg, .stripe-form .container-wide, .stripe-form .container-xl { margin: 0 auto; width: 100%; }
            .stripe-form .container, .stripe-form .container-lg { max-width: 1040px; }
            .stripe-form .container-wide, .stripe-form .container-xl { max-width: 1160px; }
            .stripe-form main>.container-lg .cell+.cell { margin-top: 70px; }
            .stripe-form main>.container-lg .cell.intro { padding: 0; }
            .stripe-form main>.container-lg .cell.intro>* { width: 100%; max-width: 700px; }
            .stripe-form main>.container-lg .cell.intro .common-IntroText { margin-top: 10px; }
            .stripe-form main>.container-lg .cell.intro .common-BodyText { margin-top: 15px; }
            .stripe-form main>.container-lg .cell.intro .common-ButtonGroup { width: auto; margin-top: 20px; }
            .stripe-form main>.container-lg .example { -ms-flex-align: center; align-items: center; }
            .stripe-form main>.container-lg .example.submitted form, .stripe-form main>.container-lg .example.submitting form { opacity: 0; transform: scale(0.9); pointer-events: none; }
            .stripe-form main>.container-lg .example.submitted .success, .stripe-form main>.container-lg .example.submitting .success { pointer-events: all; }
            .stripe-form main>.container-lg .example.submitting .success .icon { opacity: 1; }
            .stripe-form main>.container-lg .example.submitted .success>* { opacity: 1; transform: none !important; }
            .stripe-form main>.container-lg .example.submitted .success> :nth-child(2) { transition-delay: 0.1s; }
            .stripe-form main>.container-lg .example.submitted .success> :nth-child(3) { transition-delay: 0.2s; }
            .stripe-form main>.container-lg .example.submitted .success> :nth-child(4) { transition-delay: 0.3s; }
            .stripe-form main>.container-lg .example.submitted .success .icon .border, .stripe-form main>.container-lg .example.submitted .success .icon .checkmark { opacity: 1; stroke-dashoffset: 0 !important; }
            .stripe-form main>.container-lg .example * { margin: 0; padding: 0; }
            .stripe-form main>.container-lg .example .caption * { font-family: inherit; font-size: inherit; font-weight: inherit; }
            .stripe-form main>.container-lg .example .caption .no-charge { color: #cfd7df; margin-right: 10px; }
            .stripe-form main>.container-lg .example .caption a.source { text-align: right; color: inherit; transition: color 0.1s ease-in-out; margin-left: 10px; }
            .stripe-form main>.container-lg .example .caption a.source:hover { color: #6772e5; }
            .stripe-form main>.container-lg .example .caption a.source:active { color: #43458b; }
            .stripe-form main>.container-lg .example .caption a.source svg { margin-right: 10px; }
            .stripe-form main>.container-lg .example .caption a.source svg path { fill: currentColor; }
            .stripe-form main>.container-lg .example form input::-webkit-input-placeholder { opacity: 1; }
            .stripe-form main>.container-lg .example form input::-moz-placeholder { opacity: 1; }
            .stripe-form main>.container-lg .example form input:-ms-input-placeholder { opacity: 1; }
            .stripe-form main>.container-lg .example .error.visible { opacity: 1; transform: none; }
            .stripe-form main>.container-lg .example .error .message { font-size: inherit; }
            .stripe-form main>.container-lg .example .error svg { -ms-flex-negative: 0; flex-shrink: 0; margin-top: -1px; margin-right: 10px; }
            .stripe-form main>.container-lg .example .success .icon { margin: 15px 0 30px; transform: translateY(70px) scale(0.75); }
            .stripe-form main>.container-lg .example .success .icon svg { will-change: transform; }
            .stripe-form main>.container-lg .example .success .icon .border { stroke-dasharray: 251; stroke-dashoffset: 62.75; transform-origin: 50% 50%; transition: stroke-dashoffset 0.35s cubic-bezier(0.165, 0.84, 0.44, 1); animation: spin 1s linear infinite; }
            .stripe-form main>.container-lg .example .success .icon .checkmark { stroke-dasharray: 60; stroke-dashoffset: 60; transition: stroke-dashoffset 0.35s cubic-bezier(0.165, 0.84, 0.44, 1) 0.35s; }
            .stripe-form main>.container-lg .example .success .title { font-size: 17px; font-weight: 500; margin-bottom: 8px; }
            .stripe-form main>.container-lg .example .success .message { font-size: 14px; font-weight: 400; margin-bottom: 25px; line-height: 1.6em; }
            .stripe-form main>.container-lg .example .success .message span { font-size: inherit; }
            .stripe-form main>.container-lg .example .success .reset:active { transition-duration: 0.15s; transition-delay: 0s; opacity: 0.65; }
            .stripe-form main>.container-lg .example .success .reset svg { will-change: transform; }
            .stripe-form footer { position: relative; max-width: 750px; padding: 50px 20px; margin: 0 auto; }
            .stripe-form .optionList { margin: 6px 0; }
            .stripe-form .optionList li { display: inline-block; margin-right: 13px; }
            .stripe-form .optionList a { color: #aab7c4; transition: color 0.1s ease-in-out; cursor: pointer; font-size: 15px; line-height: 26px; }
            .stripe-form .optionList a.selected { color: #6772e5; font-weight: 600; }
            .stripe-form .optionList a:hover { color: #32325d; }
            .stripe-form .optionList a.selected:hover { cursor: default; color: #6772e5; }
            .stripe-form .example.example5 * { font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; }
            .stripe-form #example5-paymentRequest { max-width: 500px; width: 100%; margin-bottom: 10px; }
            .stripe-form .example.example5 fieldset { border: none; }
            .stripe-form .example.example5 fieldset legend+* { clear: both; }
            .stripe-form .example.example5 .card-only { display: block; }
            .stripe-form .example.example5 .payment-request-available { display: none; }
            .stripe-form .example.example5 .row { display: -ms-flexbox; display: flex; margin: 0 0 10px; }
            .stripe-form .example.example5 .field { position: relative; width: 100%; }
            .stripe-form .example.example5 input:-webkit-autofill, .stripe-form .example.example5 select:-webkit-autofill { transition: background-color 100000000s; -webkit-animation: 1ms void-animation-out; }
            .stripe-form .example.example5 .StripeElement--webkit-autofill { background: transparent !important; }
            .stripe-form .example.example5 select.input, .stripe-form .example.example5 select:-webkit-autofill { background-image: url('data:image/svg+xml;utf8,<svg width="10px" height="5px" viewBox="0 0 10 5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path fill="#fff" d="M5.35355339,4.64644661 L9.14644661,0.853553391 L9.14644661,0.853553391 C9.34170876,0.658291245 9.34170876,0.341708755 9.14644661,0.146446609 C9.05267842,0.0526784202 8.92550146,-2.43597394e-17 8.79289322,0 L1.20710678,0 L1.20710678,0 C0.930964406,5.07265313e-17 0.707106781,0.223857625 0.707106781,0.5 C0.707106781,0.632608245 0.759785201,0.759785201 0.853553391,0.853553391 L4.64644661,4.64644661 L4.64644661,4.64644661 C4.84170876,4.84170876 5.15829124,4.84170876 5.35355339,4.64644661 Z" id="shape"></path></svg>'); background-position: 100%; background-size: 10px 5px; background-repeat: no-repeat; overflow: hidden; text-overflow: ellipsis; padding-right: 20px; }
            .stripe-form .example.example5 button { display: block; width: 100%; padding: 10px; margin: 20px 0 0; background-color: #fff; border-radius: 6px; color: #9169d8; font-weight: 500; cursor: pointer; }
            .stripe-form .example.example5 button:active { background-color: #cdd0f8; }
            .stripe-form .example.example5 .error svg .base { fill: #fff; }
            .stripe-form .example.example5 .error svg .glyph { fill: #9169d8; }
            .stripe-form .example.example5 .error .message { color: #fff; }
            .stripe-form .example.example5 .success .icon .border { stroke: #bfaef6; }
            .stripe-form .example.example5 .success .icon .checkmark { stroke: #fff; }
            .stripe-form .example.example5 .success .title { color: #fff; }
            .stripe-form .example.example5 .success .message { color: #cdd0f8; }
            .stripe-form .example.example5 .success .reset path { fill: #fff; }
            .stripe-form .globalContent { -ms-flex-positive: 1; flex-grow: 1; }
            .stripe-form a { text-decoration: none; }
            .stripe-form button, .stripe-form select { border: none; outline: none; background: none; font-family: inherit; }
            .first-step-stripe-form input, .stripe-form a, .stripe-form button, .stripe-form input, .stripe-form select, .stripe-form textarea { -webkit-tap-highlight-color: transparent; }
            .stripe-form :root { overflow-x: hidden; height: 100%; }
            @font-face {
                font-family: StripeIcons;
                src: url(data:application/octet-stream;base64,d09GRk9UVE8AAAZUAAoAAAAAB6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABDRkYgAAADKAAAAx8AAAOKkWuAp0dTVUIAAAZIAAAACgAAAAoAAQAAT1MvMgAAAXAAAABJAAAAYGcdjVZjbWFwAAACvAAAAFYAAACUKEhKfWhlYWQAAAD8AAAAMAAAADYJAklYaGhlYQAAAVAAAAAgAAAAJAYoAa5obXR4AAABLAAAACQAAAAoEOAAWW1heHAAAAD0AAAABgAAAAYAClAAbmFtZQAAAbwAAAD%2FAAABuXejDuxwb3N0AAADFAAAABMAAAAg%2F7gAMgAAUAAACgAAeNpjYGRgYABifeaSpHh%2Bm68MzMwHgCIMl08yqyDo%2F95Mkcy8QC4zAxNIFAD8tAiweNpjfMAQyfiAgYEpgoGBcQmQlmFgYPgAZOtAcQZEDgCHaQVGeNpjYGRgYD7z34eBgSmCgeH%2Ff6ZIBqAICuACAHpYBNp42mNgZtzAOIGBlYGDqYDJgYGBwQNCMwYwGDEcA%2FKBUthBqHe4H4MDg4L6Imae%2Fz4MB5jPMGwBCjOC5Bi9mKYAKQUGBgAFHgteAAAAeNplkMFqwkAURU9itBVKF6XLLrLsxiGKMYH0B4IgoqjdRokajAmNUfolhX5Df7IvZhBt5zHMeffduQwDPPCFQbWM81mzyZ3uocEz95qtK0%2BTN140t2jzLk7DaotiEmk2eWSlucErH5otnvjW3OSTH82tSg8n8eaYRkVXOY4TzIaLURB2tDaPi0OSZ3Y9G09tx6lxm5erPDtVA%2BX7wT7axXm5Vmmy7ClXDfqe515CCJkQs%2BFIKk8t6KJwzhUwY8iCkVBI54%2FvvzKXruBAQk6GfZM0ZipKxdfqVpylfErlP11uKHypgL2k7iSz8qxFTSV5SU%2FIlT2gjyfl%2FgKN9EDsAHjaY2BgYGaA4DAGRgYQkAHyGMF8NgYrIM3JIAHEEACj8QNOBhYGOyDNAYRMQFpBcZL6ov%2F%2Foaw5%2F%2F%2F%2Ff3kvH8iD2McCxExAO1kYWIE2cjCwAwAgUQwvAAB42mNgZgCD%2F1sZjBiwAAAswgHqAHjaNVFbbxNHGN2JMmtlNnIoZFFx1F2nDoTWgJLIhRQqWlRowyXiUkqE1IZLVW0dJzHYjpAhxnbYi8HXdWxsEKCIi0DdqjxVyhOKkBBS%2FdAX%2FkJfmiCe0Gz4orbjLNFo5uj79B19Z85BXGsLhxAiB7ef%2BFmZGj8XaVb9dgdn%2B5Dd02J%2F2JqFIXtpeQ5Lc6h1YzKbXcN2F%2F2qg373wZ3ly%2Bs5gpCwfpO3d8dnXwyfOheJhC9FgsovsanJ4MCuzw84sN%2BBb1Zh34ADfU7za6fq%2Fyl8Ib7K9E4Eo9HgpHLQu6aL45CB8ug6yqAbKIeyqMAhjjD1nM49596hbqQgHf2B%2Fm5xt3S8sqXlORFe%2FHuSvuD3vesUQ4eVxjgEfm08PWK5%2FoF14lBjDAJvXI0xMRS0%2BMVjbGLIbzV%2BP2y5aOC46IfAb7TzT5cFbSJwEKCc9eXifGgqtOBahN3vWy7aOS76f1zkrVNiaNw1NIpfhyBg8X%2FN428t3v2KJl6KtVqxWpXpCD2Bq5XZW3XPrWv1dMVHEmZy9pr8dhsGdQuhKt%2FTh9Mz6nTCE34Yeyy56byfUHMzqaWrEpRpHldmrpqJrosXPyV0N%2BzAsMJYKzwMwjacTmtXGe9%2B7InkrtPz3aRoaIWPSUEtGjL1wUcYFnoJXeChG7qwpmfUHkI30XsvRdMsmKZMs9TwEsjR67ik6%2Fk14hk4jVcGe4k9yMMojGDNyKiqRy1opi5phUrG7HLDnkfdxOHktZIu072wB9jFhpHReoj3UXNF3lmReb%2FC0eaMx%2BESO1NY1w2myfuMuXW7VKvJ9CQ9im9Wy3XmllpLVX0kWUzNpmW6E%2FrY8ePkjLaV%2FPCMWVTeTJidTYtyuJpuWhSOMYsuwBhMgNK0dCtxS3O7%2Fmtvy7YL9lKn7RfvbODaEerw%2BXfuPfT92WDkiopLpaJZ9pQNUy9JAlNdyjVVH6PDTDV7saB2TadSCVWQYIQeZ2F8QgTVM30zdZtFlcOVSmU1WYFXolFFeRB9Kgt8PJmMx2vJu7IwvZoOS9XRFwsLsXCylKjMyGxXrV5kXxb%2BBxsddR0AAAEAAAAAAAAAAAAA) format("woff");
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                to { transform: rotate(1turn); }
            }
            @keyframes void-animation-out {
                0%, to { opacity: 1; }
            }
            @media (min-width: 670px) {
                .stripe-form .common-SuperTitle { font-size: 50px; line-height: 70px; }
            }
            @media (min-width: 670px) {
                .stripe-form .common-IntroText { font-size: 24px; line-height: 36px; }
            }
            @media (min-width: 670px) {
                .stripe-form main>.container-lg .cell.intro { -ms-flex-align: center; align-items: center; text-align: center; }
                .stripe-form .optionList { margin-left: 13px; }
            }
        </style>
    `,
    /* ==================== END STYLE GENERATION ==================== */

    /* ==================== START FUNCTIONS ==================== */
    analytics_initiate_checkout: (snapchat_id, should_fire, container_id, domsToCheck) => {
        let container = document.getElementById(container_id);
        if (should_fire && container) {
            container.querySelectorAll(domsToCheck).forEach(el => {
                el.onchange = execute
            });
        }
        function execute() {
            let should_execute = true;
            container.querySelectorAll(domsToCheck).forEach(el => {
                if (!el.value) should_execute = false;
            });
            if (should_execute) {
                if (typeof fbq !== 'undefined') fbq('track', 'InitiateCheckout');
                if (typeof snaptr !== 'undefined') {
                    snaptr('init', snapchat_id, { 'user_email': email });
                    snaptr('track','SIGN_UP');
                }
            }
        }
    },
    analytics_add_to_cart: enable => {
        if (enable && typeof fbq !== "undefined") fbq("track", "AddToCart");
        if (enable && typeof snaptr !== "undefined") snaptr("track", "ADD_CART");
        if (enable && typeof ttq !== "undefined") ttq.track('AddToCart'); //Sept1
    },
    analytics_purchased: (enable, price, currency, callback) => {
        if (typeof setPurchased !== "undefined" && typeof plg_selectedVariant !== "undefined") setPurchased(); // plg analytics
        if (enable && typeof fbq !== "undefined") fbq("track", "Purchase", { value: parseFloat(price), currency: localStorage.getItem("cod_data") ? JSON.parse(localStorage.getItem("cod_data")).currencyWord : currency || "USD" })
        if (enable && typeof snaptr !== "undefined") snaptr("track", "PURCHASE", { "currency": localStorage.getItem("cod_data") ? JSON.parse(localStorage.getItem("cod_data")).currencyWord : currency || "USD", "price": parseFloat(price) });
        if (enable) setTimeout(() => callback(), 700);
        else callback();
    },
    function_get_cookie: name => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    },
    function_is_exist: (selector, variable, callback) => {
        let check = setInterval(() => {
            let condition = undefined;
            if (selector) condition = document.querySelector(selector);
            else if (variable) condition = eval(variable);
            if (typeof condition !== "undefined") {
                clearInterval(check);
                callback();
            }
        }, 1000);
    },
    send_post_request: (url, payload, callback) => {
        fetch(url, { method: "POST", headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(payload) })
        .then(res => res.json())
        .then(res => callback(res))
        .catch(err => callback(null, err));
    },
    toggle_loading: () => {
        if (document.getElementById("upsell_loading")) {
            document.getElementById("upsell_loading").remove();
        } else {
            var xx = '<style> #spinner { position: relative; width: 100%; height: 100%; } #spinner:after { content: ""; display: block; position: absolute; width: 80px; height: 80px; margin-left: -40px; margin-top: -40px; border: 5px solid #d1faeb; -moz-border-radius: 50%; -webkit-border-radius: 50%; border-radius: 50%; border-top-color: #26c686; border-right-color: #26c686; -moz-animation: rotate 0.5s linear infinite; -webkit-animation: rotate 0.5s linear infinite; animation: rotate 0.5s linear infinite; } @-moz-keyframes rotate { 0% { -moz-transform: rotateZ(-360deg); transform: rotateZ(-360deg); } 50% { -moz-transform: rotateZ(-180deg); transform: rotateZ(-180deg); } 100% { -moz-transform: rotateZ(0deg); transform: rotateZ(0deg); } } @-webkit-keyframes rotate { 0% { -webkit-transform: rotateZ(-360deg); transform: rotateZ(-360deg); } 50% { -webkit-transform: rotateZ(-180deg); transform: rotateZ(-180deg); } 100% { -webkit-transform: rotateZ(0deg); transform: rotateZ(0deg); } } @keyframes rotate { 0% { -moz-transform: rotateZ(-360deg); -ms-transform: rotateZ(-360deg); -webkit-transform: rotateZ(-360deg); transform: rotateZ(-360deg); } 50% { -moz-transform: rotateZ(-180deg); -ms-transform: rotateZ(-180deg); -webkit-transform: rotateZ(-180deg); transform: rotateZ(-180deg); } 100% { -moz-transform: rotateZ(0deg); -ms-transform: rotateZ(0deg); -webkit-transform: rotateZ(0deg); transform: rotateZ(0deg); } } </style> <div style="position: fixed; width: 100%; height: 100vh; overflow: scroll; z-index: 9999; top: 0; left: 0;"><div style="align-items: center; display: flex; flex-direction: column; margin: auto; min-height: 100%; justify-content: center; background-color: #00000078;"><div style="display: flex; align-items: center; padding: 100px;"><div id="spinner"></div></div></div></div>';
            var div = document.createElement("div");
            div.id = "upsell_loading";
            div.innerHTML = xx;
            document.body.appendChild(div);
        }
    },
    close_upsell_downsell_confirmation: () => {
        document.getElementById("upsell_confirmation").remove();
    },
    fe_user_id: text => {
        return text + Math.floor(Math.random() * 100) + new Date().getTime();
    },
    /* ==================== END FUNCTIONS ==================== */

    /* ==================== START WIDGETS ==================== */
    getSubscriptionProductWidget: isUpsellOrDownsell => `
        let is_subscription_upsell_downsell = ${isUpsellOrDownsell};
        unlayer.registerPropertyEditor({
            name: 'subscription_products',
            layout: 'bottom',
            Widget: unlayer.createWidget({
                render(value) {
                    return \`
                        <div class="blockbuilder-widget-label" style="text-transform: uppercase; margin-bottom: 5px;">
                            <label class="blockbuilder-label-primary">
                                <span>Subscription \$\{is_subscription_upsell_downsell ? "Information" : "List"\}</span>
                            </label>
                        </div>
                        <div class="subscription-data" style="max-height: 400px; overflow: auto;">
                            <!-- Dynamic Subscription Will Appear here -->
                        </div>
                    \`;
                },
                mount(node, value, updateValue) {
                    if(typeof value === "string") value = JSON.parse(value);
                    value = value.filter(e => e.rebill || e.name || e.desc || e.price); // remove empty data
                    let subs_data = node.querySelector(".subscription-data");
                    subs_data.innerHTML = ""; // clear container
                    let max_variant_display = is_subscription_upsell_downsell ? 1 : value.length + 1;
                    for(let i = 0; i < max_variant_display; i++) {
                        subs_data.innerHTML += \`
                            <div class="card-header" style="margin: 5px 0; cursor: unset;">
                                <div class="row eiCcjJ">
                                    <div class="blockbuilder-widget-label col-12">
                                        <label class="blockbuilder-label-primary">
                                            <span>Set as default selected</span>
                                        </label>
                                        <label class="blockbuilder-label-right">
                                            <div class="is-selected react-toggle">
                                                <div class="react-toggle-track">
                                                    <div class="react-toggle-track-check">
                                                        <svg width="14" height="11" viewBox="0 0 14 11">
                                                            <title>switch-check</title>
                                                            <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                    <div class="react-toggle-track-x">
                                                        <svg width="10" height="10" viewBox="0 0 10 10">
                                                            <title>switch-x</title>
                                                            <path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="react-toggle-thumb"></div>
                                                <input class="react-toggle-screenreader-only" type="checkbox">
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-3">
                                        <label class="blockbuilder-label-primary">
                                            <span>Rebill</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-4">
                                        <input type="number" class="form-control rebill-count">
                                    </div>
                                    <div class="blockbuilder-widget-label col-5" style="padding-left: 0;">
                                        <select class="form-control rebill-frequent">
                                            <option value="days">Day</option>
                                            <option value="months">Month</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-3">
                                        <label class="blockbuilder-label-primary">
                                            <span>Name</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-9">
                                        <label class="blockbuilder-label-primary">
                                            <input type="text" class="form-control subs-name">
                                        </label>
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-3">
                                        <label class="blockbuilder-label-primary">
                                            <span>Description</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-9">
                                        <label class="blockbuilder-label-primary">
                                            <input type="text" class="form-control subs-desc">
                                        </label>
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>Price</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7">
                                        <label class="blockbuilder-label-primary">
                                            <input type="number" class="form-control subs-price">
                                        </label>
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>Paypal Subscription ID</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7">
                                        <label class="blockbuilder-label-primary">
                                            <input type="text" class="form-control subs-paypalsub">
                                        </label>
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>Shopify Variant ID</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7">
                                        <label class="blockbuilder-label-primary">
                                            <input type="text" class="form-control subs-shopifySubID">
                                        </label>
                                    </div>
                                </div>
                            </div>
                        \`;
                    }

                    let selected = node.querySelectorAll(".is-selected");
                    let rebill_count = node.querySelectorAll(".rebill-count");
                    let rebill_frequent = node.querySelectorAll(".rebill-frequent");
                    let name = node.querySelectorAll(".subs-name");
                    let desc = node.querySelectorAll(".subs-desc");
                    let price = node.querySelectorAll(".subs-price");
                    let paypalSubID = node.querySelectorAll(".subs-paypalsub");
                    let shopifySubID = node.querySelectorAll(".subs-shopifySubID");
                    
                    selected.forEach((el, i) => {
                        if(value[i] && value[i].selected) el.classList.add("react-toggle--checked");
                        el.onchange = function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            let toggle = el.classList.value.includes("react-toggle--checked") ? false : true;
                            if(toggle) { // remove all checked before checking this selected
                                value = value.map(e => {
                                    e.selected = false;
                                    return e;
                                });
                            }
                            if(is_subscription_upsell_downsell) toggle = true; // to force selected the only 1 variant in upsell
                            save_data(i, "selected", toggle);
                        }
                    });
                    rebill_count.forEach((el, i) => {
                        let maxname = "Day", min = 7, max = 365;
                        if(value[i] && value[i].day_or_month && value[i].day_or_month === "months") {
                            maxname = "Month";
                            max = 12;
                            min = 1;
                        }
                        el.value = value[i] && value[i].rebill ? value[i].rebill : "";
                        el.onchange = function(){
                            if(el.value && el.value > max) {
                                el.value = max;
                                alert("Max limit of " + maxname + " is " + max);
                            } else if (el.value && el.value < min) {
                                el.value = min;
                                alert("Minimum limit of " + maxname + " is " + min);
                            }
                            save_data(i, "rebill", parseInt(el.value));
                        }
                    });
                    rebill_frequent.forEach((el, i) => {
                        el.value = value[i] && value[i].day_or_month ? value[i].day_or_month : "days";
                        el.onchange = function(){
                            let min = el.value === "months" ? 1 : 7;
                            save_data(i, "rebill", min);
                            save_data(i, "day_or_month", el.value);
                        }
                    });
                    name.forEach((el, i) => {
                        el.value = value[i] && value[i].name ? value[i].name : "";
                        el.onchange = function(){
                            save_data(i, "name", el.value);
                        }
                    });
                    desc.forEach((el, i) => {
                        el.value = value[i] && value[i].desc ? value[i].desc : "";
                        el.onchange = function(){
                            save_data(i, "desc", el.value);
                        }
                    });
                    price.forEach((el, i) => {
                        el.value = value[i] && value[i].price ? value[i].price : "";
                        el.onchange = function(){
                            save_data(i, "price", parseFloat(el.value));
                        }
                    });
                    paypalSubID.forEach((el, i) => {
                        el.value = value[i] && value[i].paypalSubID ? value[i].paypalSubID : "";
                        el.onchange = function(){
                            save_data(i, "paypalSubID", el.value);
                        }
                    });
                    shopifySubID.forEach((el, i) => {
                        el.value = value[i] && value[i].shopifySubID ? value[i].shopifySubID : "";
                        el.onchange = function(){
                            save_data(i, "shopifySubID", el.value);
                        }
                    });

                    function save_data(index, name, new_value){
                        if(!value[index]) value[index] = {};
                        value[index][name] = new_value;
                        updateValue(JSON.stringify(value));
                    }

                    updateValue(JSON.stringify(value));
                }
            })
        });
    `,

    getBraintreeToken: (pub, pri, other) => `
    unlayer.registerPropertyEditor({
        name: 'braintree_token',
        layout: 'bottom',
        Widget: unlayer.createWidget({
            render(value) {
                return \`
                    <div class="blockbuilder-widget blockbuilder-toggle-widget row">
                        <div class="col-12 subscription-data">
                            <div class="blockbuilder-widget-label">
                            <label class="blockbuilder-label-primary">
                                <span>Test Mode</span>
                            </label>
                            <label class="blockbuilder-label-right">
                                    <div class="react-toggle" id="refreshClick">
                                        <div class="react-toggle-track">
                                            <div class="react-toggle-track-check">
                                                <svg width="14" height="11" viewBox="0 0 14 11">
                                                    <title>switch-check</title>
                                                    <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fill-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                            <div class="react-toggle-track-x">
                                                <svg width="10" height="10" viewBox="0 0 10 10">
                                                    <title>switch-x</title>
                                                    <path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fill-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="react-toggle-thumb">
                                        </div>
                                        <input class="react-toggle-screenreader-only" type="checkbox">
                                    </div>
                            </label></div>
                        </div>
                    </div>
                \`;
            },
            async mount(node, value, updateValue) {
                value = value;
                let plan_container = node.querySelector(".subscription-data");
                let refresh = node.querySelector("#refreshClick");
                
                let loader = \`<div style="text-align: center; margin-top: 5px;"><div class="editor-loader"></div></div>\`;
                function getToken() {
                    getToken = function () {};
                    console.log("token fetched")
                   fetch("/get-braintreet-token", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify({ merchantAccountId: "${other}", authkey: "${createTokenFromKeys(pub, pri)}" }) })
                       .then(res => res.json())
                       .then(res => {
                           console.log(res)
                           updateValue(JSON.stringify(res.data.createClientToken.clientToken))
                       })
                       .catch(err => console.log(err));
                }
                refresh.addEventListener('click', (el) => {
                    getToken()
                })
                if(!value){
                    getToken()
                }
            }
        }),
    });

    `,

    getConektaSubscriptionProductWidget: (private_key, isUpsellOrDownsell) => `
        unlayer.registerPropertyEditor({
            name: 'conekta_subscription_products',
            layout: 'bottom',
            Widget: unlayer.createWidget({
                render(value) {
                    return \`
                        <div class="blockbuilder-widget-label">
                            <label class="blockbuilder-label-primary">
                                <span>Plan List ${isUpsellOrDownsell ? "(Make sure to set the plan based on checkout selected country currency)" : "(Plan will only appear based on selected country currency)"}</span>
                            </label>
                        </div>
                        <div class="subscription-data" style="max-height: 400px; overflow: auto; margin-top: 5px;">
                            <!-- Dynamic Plan Will Appear here -->
                        </div>
                    \`;
                },
                async mount(node, value, updateValue) {
                    value = value ? JSON.parse(value) : [];
                    let is_upsell_or_downsell = ${isUpsellOrDownsell};
                    let plan_container = node.querySelector(".subscription-data");
                    let loader = \`<div style="text-align: center; margin-top: 5px;"><div class="editor-loader"></div></div>\`;
                    plan_container.innerHTML = loader;
                    let plan_list = await new Promise(resolve => {
                        fetch("/get-conekta-plans", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify({ private_key: "${private_key}" }) })
                        .then(res => res.json())
                        .then(res => resolve(res))
                        .catch(err => resolve(null));
                    });
                    if (plan_list) {
                        if (plan_list.data.length !== 0) {
                            plan_container.innerHTML = "";
                            for (let i = 0; i < plan_list.data.length; i++) {
                                let data = plan_list.data[i];
                                plan_container.innerHTML += \`
                                    <div class="card-header" style="margin: 5px 0; cursor: unset;">
                                        <div class="row eiCcjJ">
                                            <div class="blockbuilder-widget-label col-2">
                                                <label class="blockbuilder-label-primary">
                                                    <span>\$\{data.currency\}</span>
                                                </label>
                                            </div>
                                            <div class="blockbuilder-widget-label col-7">
                                                <label class="blockbuilder-label-right">
                                                    <span>Set as default selected</span>
                                                    
                                                </label>
                                            </div>
                                            <div class="blockbuilder-widget-label col-2">
                                                <label class="blockbuilder-label-right">
                                                    <div class="set-as-default react-toggle" data-id = "\$\{data.id\}">
                                                        <div class="react-toggle-track">
                                                            <div class="react-toggle-track-check">
                                                                <svg width="14" height="11" viewBox="0 0 14 11">
                                                                    <title>switch-check</title>
                                                                    <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fill-rule="evenodd"></path>
                                                                </svg>
                                                            </div>
                                                            <div class="react-toggle-track-x">
                                                                <svg width="10" height="10" viewBox="0 0 10 10">
                                                                    <title>switch-x</title>
                                                                    <path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fill-rule="evenodd"></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div class="react-toggle-thumb"></div>
                                                        <input class="react-toggle-screenreader-only" type="checkbox">
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="row eiCcjJ" style="margin-top: 5px;">
                                            <div class="blockbuilder-widget-label col-2" style="padding-left: 0;">
                                                <label class="blockbuilder-label-primary">
                                                    <div class="add-plan-to-funnel react-toggle"
                                                        data-id = "\$\{data.id\}"
                                                        data-name = "\$\{data.name\}"
                                                        data-price = "\$\{data.amount / 100\}"
                                                        data-interval = "\$\{data.interval\}"
                                                        data-frequency = "\$\{data.frequency\}"
                                                        data-currency = "\$\{data.currency\}"
                                                    >
                                                        <div class="react-toggle-track">
                                                            <div class="react-toggle-track-check">
                                                                <svg width="14" height="11" viewBox="0 0 14 11">
                                                                    <title>switch-check</title>
                                                                    <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fill-rule="evenodd"></path>
                                                                </svg>
                                                            </div>
                                                            <div class="react-toggle-track-x">
                                                                <svg width="10" height="10" viewBox="0 0 10 10">
                                                                    <title>switch-x</title>
                                                                    <path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fill-rule="evenodd"></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div class="react-toggle-thumb"></div>
                                                        <input class="react-toggle-screenreader-only" type="checkbox">
                                                    </div>
                                                </label>
                                            </div>
                                            <div class="blockbuilder-widget-label col-6">
                                                <label class="blockbuilder-label-primary">
                                                    <span>\$\{data.name\}</span>
                                                </label>
                                            </div>
                                            <div class="blockbuilder-widget-label col-4">
                                                <label class="blockbuilder-label-primary">
                                                    <span>Ref: \$\{data.id\}</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="row eiCcjJ" style="margin-top: 5px;">
                                            <div class="blockbuilder-widget-label col-5">
                                                <label class="blockbuilder-label-primary">
                                                    <span>Shopify Variant ID</span>
                                                </label>
                                            </div>
                                            <div class="blockbuilder-widget-label col-7">
                                                <label class="blockbuilder-label-primary">
                                                    <input type="text" class="form-control subs-shopifySubID">
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                \`;
                            }
                        } else {
                            plan_container.innerHTML = \`<div style="text-align: center;"><label style="color: #848584; margin: 5px 0 0 0;">No plan detected.<br/>Please create your plan in conekta platform</label></div>\`;
                        }
                    } else {
                        plan_container.innerHTML = \`<div style="text-align: center;"><label style="color: #848584; margin: 5px 0 0 0;">An error has occured please try again later</label></div>\`;
                    }

                    let add_plan = node.querySelectorAll(".add-plan-to-funnel");
                    let set_as_default = node.querySelectorAll(".set-as-default");
                    let shopifySubID = node.querySelectorAll(".subs-shopifySubID");
                    add_plan.forEach(el => {
                        let current_id = el.getAttribute("data-id");
                        if (value.filter(e => e.id === current_id).length !== 0) el.classList.add("react-toggle--checked");
                        el.onchange = function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            let toggle = el.classList.value.includes("react-toggle--checked") ? false : true;
                            let id = el.getAttribute("data-id");
                            let name = el.getAttribute("data-name");
                            let price = parseFloat(el.getAttribute("data-price"));
                            let interval = el.getAttribute("data-interval");
                            let frequency = el.getAttribute("data-frequency");
                            let currency = el.getAttribute("data-currency");
                            if (toggle) {
                                if (is_upsell_or_downsell) value[0] = { selected: true, id, name, price, interval, frequency, currency };
                                else value.push({ id, name, price, interval, frequency, currency });
                            } else {
                                value.forEach((e, i) => e.id === id ? value.splice(i, 1) : void 0);
                            }
                            
                            updateValue(JSON.stringify(value));
                        }
                    });
                    
                    set_as_default.forEach(el => {
                        let current_id = el.getAttribute("data-id"), selected = value.filter(e => e.id === current_id);
                        if (selected.length !== 0 && selected[0].selected) el.classList.add("react-toggle--checked");
                        if (!is_upsell_or_downsell) {
                            el.onchange = function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                let toggle = el.classList.value.includes("react-toggle--checked") ? false : true;
                                let id = el.getAttribute("data-id");
                                value = value.map(val => {
                                    val.selected = val.id === id ? true : false;
                                    return val;
                                });

                                
                                updateValue(JSON.stringify(value));
                            }
                        }
                    });

                    shopifySubID.forEach((ek, i) => {
                        ek.value = value[i] && value[i].shopifySubID ? value[i].shopifySubID : "";
                        ek.onchange = function(){
                            save_data(i, "shopifySubID", ek.value);
                        }
                    });
                    function save_data(index, name, new_value){
                        if(!value[index]) value[index] = {};
                        value[index][name] = new_value;
                        console.log(JSON.stringify(value))
                        updateValue(JSON.stringify(value));
                    };
                }
            })
        });
    `,
    datePickerWidget: () => `
        unlayer.registerPropertyEditor({
            name: 'fomo_input',
            layout: 'bottom',
            Widget: unlayer.createWidget({
                render(value) {
                    console.log(value)
                    let values = value !== "" ? JSON.parse(value) : {key: "FOMO", days: "0"};
                    return \`
                    <div class="blockbuilder-widget blockbuilder-link-widget">
                        <div class="sc-chPdSV kwsgjF">
                            <div class="blockbuilder-widget blockbuilder-text-widget row sc-bZQynM eiCcjJ">
                                <div class="col-12">
                                    <div class="blockbuilder-widget-label pb-2"><label class="blockbuilder-label-primary">
                                        <span>KeyWord</span>
                                    </label>
                                </div>
                                <input type="text" id="fomo_key" class="tagged form-control" data-removeBtn="true" name="tag-2"
                                value="\$\{values ? values.key ? values.key.toString() : "FOMO" : "FOMO" \}" placeholder="Add Keyword">
                                </div>
                            </div>
                        </div>
                        <div class="sc-chPdSV kwsgjF">
                            <div class="blockbuilder-widget blockbuilder-text-widget row sc-bZQynM eiCcjJ">
                                <div class="col-12">
                                    <div class="blockbuilder-widget-label pb-2"><label class="blockbuilder-label-primary">
                                        <span>Number of Days</span>
                                    </label>
                                </div>
                                <input type="number" id="fomo_number" class="tagged form-control" data-removeBtn="true" name="tag-1"
                                    value="\$\{values ? values.days ? values.days : 0: 0 \}" placeholder="Add Days">
                                </div>
                            </div>
                        </div>
                    </div>
                    \`;
                },
                mount(node, value, updateValue) {
                    let values = value !== "" ? JSON.parse(value) : {key: "FOMO", days: "0"};
                    let inputDays = node.querySelector("#fomo_number");
                    let inputKey = node.querySelector("#fomo_key");
                    
                    inputDays.onkeyup = (e) => {
                        values.days = e.target.value;
                        if (e.key === 'Enter' || e.keyCode === 13) {
                            updateValue(JSON.stringify(values))                            
                        }
                    }

                    inputDays.onchange = (e) => {
                        values.days = e.target.value;                        
                    }

                    inputKey.onkeyup = (e) => {
                        values.key = e.target.value;
                        if (e.key === 'Enter' || e.keyCode === 13) {
                            updateValue(JSON.stringify(values))                            
                        }                        
                    }

                    console.log(value)
                    
                }
            })
        });
    `,
    // TODO :: New Widget MULTIPLE VARIANT
    getMultipleGenieVariantWidget:(currentUser, isUpsellMultipleVariant) => `
        unlayer.registerPropertyEditor({
            name: 'multiple_genie_variants',
            layout: 'bottom',
            Widget: unlayer.createWidget({
                render(value) {
                    let variant = value ? JSON.parse(value) : "";
                    return \`                    
                    <div class="blockbuilder-widget blockbuilder-link-widget">
                        <div class="kwsgjF" style="display:none;">
                            <div class="row eiCcjJ" >
                                <div class="blockbuilder-widget-label col-4">
                                    <label class="blockbuilder-label-primary">
                                        <span>\$\{value\}</span>
                                    </label>
                                </div>
                                <div class="blockbuilder-widget-label col-8">
                                    <select class="country_list form-control" style="margin-top: 0;">
                                        ${gval.cod_available_country("no_country").map((country, i) => {
                                            return `<option value="${country.iso2}">${country.name} / ${country.cw}</option>`;
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div class="row eiCcjJ view_country_list"></div>
                        </div>   
                        <div class="kwsgjF">
                                <div class="row eiCcjJ">
                                    <div class="blockbuilder-widget-label col-12">
                                        <label class="blockbuilder-label-primary">
                                            <span>Show Colors</span>
                                        </label>
                                        <label class="blockbuilder-label-right">
                                            <div class="use-colors react-toggle">
                                                <div class="react-toggle-track">
                                                    <div class="react-toggle-track-check">
                                                        <svg width="14" height="11" viewBox="0 0 14 11">
                                                            <title>switch-check</title>
                                                            <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                    <div class="react-toggle-track-x">
                                                        <svg width="10" height="10" viewBox="0 0 10 10">
                                                            <title>switch-x</title>
                                                            <path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="react-toggle-thumb"></div>
                                                <input class="react-toggle-screenreader-only" type="checkbox">
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="kwsgjF">
                            <div class="row eiCcjJ">
                                <div class="blockbuilder-widget-label col-12">
                                    <label class="blockbuilder-label-primary">
                                        <span>Show Sizes</span>
                                    </label>
                                    <label class="blockbuilder-label-right">
                                        <div class="use-sizes react-toggle">
                                            <div class="react-toggle-track">
                                                <div class="react-toggle-track-check">
                                                    <svg width="14" height="11" viewBox="0 0 14 11">
                                                        <title>switch-check</title>
                                                        <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fill-rule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <div class="react-toggle-track-x">
                                                    <svg width="10" height="10" viewBox="0 0 10 10">
                                                        <title>switch-x</title>
                                                        <path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fill-rule="evenodd"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div class="react-toggle-thumb"></div>
                                            <input class="react-toggle-screenreader-only" type="checkbox">
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="kwsgjF">
                            <form action="" class="test" method="post">
                                <label for="exist-values" class="blockbuilder-label-primary" style="color: #9a9a9a;">Colors
                                <input type="text" id="exist-values" class="tagged form-control" data-removeBtn="true" name="tag-2"
                                    value="\$\{variant ? variant.colors ? variant.colors.toString() : "Blue,Green,Yellow" : "Blue,Green,Yellow" \}" placeholder="Add Colors">
                                </label>
                                <label for="exist-valuesa" class="blockbuilder-label-primary" style="color: #9a9a9a;">Sizes
                                <input type="text" id="exist-valuesa" class="tagged form-control" data-removeBtn="true" name="tag-1"
                                    value="\$\{variant ? variant.sizes ? variant.sizes.toString() : "Small,Medium,Large": "Small,Medium,Large" \}" placeholder="Add Sizes">
                                </label>                                
                            </form>                                        
                        </div>
                        <div class="kwsgjF">
                            <div style="width: 100%; display: none; flex-flow: column;" id="container_variants_multi"></div>
                        </div>                     
                    </div>
                    \`;
                },
                mount(node, value, updateValue) {
                    value = value ? JSON.parse(value) : { selected_iso2: "US", useColors: true, useSizes: true };
                    let updatedVariants = [];
                    let available_country = ${JSON.stringify(gval.cod_available_country("no_country"))};
                    let country_list = node.querySelector('.country_list');
                    let useColors = node.querySelector('.use-colors');
                    let useSizes = node.querySelector('.use-sizes');

                    gener();  // after getter set the listener for all in the container
                    // console.log(value);
                    if(value.useColors) useColors.classList.add("react-toggle--checked");
                    else useColors.classList.remove("react-toggle--checked");
                    useColors.onchange = function(e){
                        // console.log('is called --');
                        e.preventDefault();
                        e.stopPropagation();
                        let toggle = useColors.classList.value.includes("react-toggle--checked") ? false : true;
                        value.useColors = toggle;
                        // console.log(useColors, value);
                        updateValue(JSON.stringify(value));
                    };


                    if(value.useSizes) useSizes.classList.add("react-toggle--checked");
                    else useSizes.classList.remove("react-toggle--checked");
                    useSizes.onchange = function(e){
                        // console.log('is called --');
                        e.preventDefault();
                        e.stopPropagation();
                        let toggle = useSizes.classList.value.includes("react-toggle--checked") ? false : true;
                        value.useSizes = toggle;
                        updateValue(JSON.stringify(value));
                    };

                    country_list.onchange = (e) => {
                        value.selected_iso2 = e.target.value;
                        //updateVariantPerCountry();
                        // console.log('awas collaed');
                    };

                    // update the variants if it already exist in the array json of variants
                    function updateVariantPerCountry() {
                        // cleaer all input before load
                        node.querySelectorAll('#container_variants_multi input').forEach(e => e.value = '');
                        try {
                            if (value[value.selected_iso2].variant) {
                            let variant_saved = value[value.selected_iso2].variant;
                            variant_saved.forEach((vars, index) => {
                                // console.log(vars.name);   
                                node.querySelectorAll(\`#container_variants_multi div[data-name="\$\{vars.name\}"]\`).forEach((ele, i) => {
                                ele.querySelector('input[name="price"]').value = vars.price == undefined ? '' : vars.price;
                                ele.querySelector('input[name="sku"]').value = vars.sku == undefined ? '' : vars.sku;
                                })
                            });
                            }
                        } catch (error) {
                            console.log('no variant was set ...',error);
                        }

                        // updateValue(JSON.stringify(value));    
                    }

                    function reloadEventsListener(){
                        updatedVariants.forEach((vars, index) => {                  
                          node.querySelectorAll(".inputs_variant" + index + " input[name='price']").forEach((element) => {
                            ['change'].forEach(evet => {
                              element.addEventListener(evet, (e) => {
                                try {
                                  console.log('inputt');
                                  value[value.selected_iso2].variant[index] = { ...value[value.selected_iso2].variant[index], price: e.target.value, name: updatedVariants[index] };
                                } catch (error) {                
                                  value[value.selected_iso2] = { variant: [{ price: e.target.value, name: updatedVariants[index] }] };
                                }
                                 
                              });
                            });
                          });
                  
                          node.querySelectorAll(".inputs_variant" + index + " input[name='sku']").forEach((element) => {
                            ['change'].forEach(evet => {
                              element.addEventListener(evet, (e) => {
                                console.log('inputt');
                                value[value.selected_iso2].variant[index] = { ...value[value.selected_iso2].variant[index], sku: e.target.value };
                                 
                              });
                            });
                          });
                        });


                    }

                    // Helpers
                    function selectr(selectors, context) {
                        return (typeof selectors === 'string') ? (context || document).querySelectorAll(selectors) : [selectors];
                    }
                    
                    function $(selector, context) {
                        return (typeof selector === 'string') ? (context || document).querySelector(selector) : selector;
                    }
                    
                    function create(tag, attr) {
                        var element = document.createElement(tag);
                        if (attr) {
                            for (var name in attr) {
                            if (element[name] !== undefined) {
                                element[name] = attr[name];
                            }
                            }
                        }
                        return element;
                    }

                    function whichTransitionEnd() {
                        var root = document.documentElement;
                        var transitions = {
                          'transition': 'transitionend',
                          'WebkitTransition': 'webkitTransitionEnd',
                          'MozTransition': 'mozTransitionEnd',
                          'OTransition': 'oTransitionEnd otransitionend'
                        };
                  
                        for (var t in transitions) {
                          if (root.style[t] !== undefined) {
                            return transitions[t];
                          }
                        }
                        return false;
                    }

                    function oneListener(el, type, fn, capture) {
                        capture = capture || false;
                        el.addEventListener(type, function handler(e) {
                          fn.call(this, e);
                          el.removeEventListener(e.type, handler, capture)
                        }, capture);
                    }
                    function hasClass(cls, el) {
                      return new RegExp('(^|\\s+)' + cls + '(\\s+|$)').test(el.className);
                    }
                    function addClass(cls, el) {
                      if (!hasClass(cls, el))
                        return el.className += (el.className === '') ? cls : ' ' + cls;
                    }
                    function removeClass(cls, el) {
                      el.className = el.className.replace(new RegExp('(^|\\s+)' + cls + '(\\s+|$)'), '');
                    }
                    function toggleClass(cls, el) {
                      (!hasClass(cls, el)) ? addClass(cls, el) : removeClass(cls, el);
                    }

                    function Tags(tag) {                        
                        var el = $(tag);
                  
                        if (el.instance) return;
                        el.instance = this;
                  
                        var type = el.type;
                        var transitionEnd = whichTransitionEnd();
                  
                        var tagsArray = [];
                        var KEYS = {
                          ENTER: 13,
                          COMMA: 188,
                          BACK: 8
                        };
                        var isPressed = false;
                  
                        var timer;
                        var wrap;
                        var field; 
                      
                  
                        function init() {
                  
                          // create and add wrapper
                          wrap = create('div', {
                            'className': 'tags-container',
                          });
                          field = create('input', {
                            'type': 'text',
                            'className': 'tag-input',
                            'placeholder': el.placeholder || ''
                          });
                  
                          wrap.appendChild(field);
                  
                          if (el.value.trim() !== '') {
                            hasTags();
                          }
                  
                          el.type = 'hidden';
                          el.parentNode.insertBefore(wrap, el.nextSibling);
                  
                          wrap.addEventListener('click', btnRemove, false);
                          wrap.addEventListener('keydown', keyHandler, false);
                          wrap.addEventListener('keyup', backHandler, false);
                        }
                  
                        function hasTags() {
                          var arr = el.value.trim().split(',');
                          arr.forEach(function (item) {
                            item = item.trim();
                            if (~tagsArray.indexOf(item)) {
                              return;
                            }
                            var tag = createTag(item);
                            tagsArray.push(item);
                            wrap.insertBefore(tag, field);
                          });
                        }
                  
                        function createTag(name) {
                          var tag = create('div', {
                            'className': 'tag',
                            'innerHTML': '<span class="tag__name">' + name + '</span>' +
                              '<button class="tag__remove">&times;</button>'
                          });
                          return tag;
                        }
                  
                        function btnRemove(e) {
                          e.preventDefault();
                          if (e.target.className === 'tag__remove') {
                            var tag = e.target.parentNode;
                            var name = $('.tag__name', tag);
                            wrap.removeChild(tag);
                            tagsArray.splice(tagsArray.indexOf(name.textContent), 1);
                            el.value = tagsArray.join(',')
                            gener()
                          }
                          field.focus();
                        }
                  
                        function keyHandler(e) {
                  
                          if (e.target.tagName === 'INPUT' && e.target.className === 'tag-input') {
                  
                            var target = e.target;
                            var code = e.which || e.keyCode;
                  
                            if (field.previousSibling && code !== KEYS.BACK) {
                              removeClass('tag--marked', field.previousSibling);
                            }
                  
                            var name = target.value.trim();
                  
                            // if(code === KEYS.ENTER || code === KEYS.COMMA) {
                            if (code === KEYS.ENTER || code === KEYS.COMMA) {
                  
                              target.blur();
                  
                              addTag(name);
                              gener()
                              if (timer) clearTimeout(timer);
                              timer = setTimeout(function () { target.focus(); }, 10);
                            }
                            else if (code === KEYS.BACK) {
                              if (e.target.value === '' && !isPressed) {
                                isPressed = true;
                                removeTag();
                  
                              }
                            }
                          }
                        }
                        function backHandler(e) {
                          isPressed = false;
                        }
                  
                        function addTag(name) {
                  
                          // delete comma if comma exists
                          name = name.toString().replace(/,/g, '').trim();
                  
                          if (name === '') return field.value = '';
                  
                          if (~tagsArray.indexOf(name)) {
                  
                            var exist = selectr('.tag', wrap);
                  
                            Array.prototype.forEach.call(exist, function (tag) {
                              if (tag.firstChild.textContent === name) {
                  
                                addClass('tag--exists', tag);
                  
                                if (transitionEnd) {
                                  oneListener(tag, transitionEnd, function () {
                                    removeClass('tag--exists', tag);
                                  });
                                } else {
                                  removeClass('tag--exists', tag);
                                }
                  
                  
                              }
                  
                            });
                  
                            return field.value = '';
                          }
                  
                          var tag = createTag(name);
                          wrap.insertBefore(tag, field);
                          tagsArray.push(name);
                          field.value = '';
                          el.value += (el.value === '') ? name : ',' + name;
                        }
                  
                        function removeTag() {
                          if (tagsArray.length === 0) return;
                  
                          var tags = selectr('.tag', wrap);
                          var tag = tags[tags.length - 1];
                  
                          if (!hasClass('tag--marked', tag)) {
                            addClass('tag--marked', tag);
                            return;
                          }
                          tagsArray.pop();
                  
                          wrap.removeChild(tag);
                  
                          el.value = tagsArray.join(',');
                          gener()
                  
                        }
                  
                        init();
                  
                        /* Public API */
                  
                        this.getTags = function () {
                          return tagsArray;
                        }
                  
                        this.clearTags = function () {
                          if (!el.instance) return;
                          tagsArray.length = 0;
                          el.value = '';
                          wrap.innerHTML = '';
                          wrap.appendChild(field);
                        }
                  
                        this.addTags = function (name) {
                          if (!el.instance) return;
                          if (Array.isArray(name)) {
                            for (var i = 0, len = name.length; i < len; i++) {
                              addTag(name[i])
                            }
                          } else {
                            addTag(name);
                          }
                          return tagsArray;
                        }
                  
                        this.destroy = function () {
                          if (!el.instance) return;
                  
                          wrap.removeEventListener('click', btnRemove, false);
                          wrap.removeEventListener('keydown', keyHandler, false);
                          wrap.removeEventListener('keyup', keyHandler, false);
                  
                          wrap.parentNode.removeChild(wrap);
                  
                          tagsArray = null;
                          timer = null;
                          wrap = null;
                          field = null;
                          transitionEnd = null;
                  
                          delete el.instance;
                          el.type = type;
                        }
                      }

                    //   window.Tags = Tags;
                      
                      node.querySelectorAll(".tagged").forEach(el => {
                        try{
                            // console.log(el);
                            new Tags(el);
                        }catch(error){
                            console.log('new multiple variant error',error);
                        }
                        
                      });

                      function gener() {
                        let col = []
                        node.querySelectorAll('.tagged').forEach((el, c) => {                  
                          col.push(el.value.split(','));                                    
                        })
                  
                        let arr1 = col[0]
                        let arr2 = col[1]
                  
                        let pairs = [];
                        for (var i = 0; i < arr1.length; i++) {
                          for (var j = 0; j < arr2.length; j++) {
                            pairs.push(arr1[i] + " - " + arr2[j]);
                          }
                        }                       
                        updatedVariants = pairs;
                  
                        var htmlcontent = '';
                        updatedVariants.forEach((e, index) => {
                          htmlcontent += \`
                          <div class="inputs_variant\$\{index\} blockbuilder-label-primary eiCcjJ" data-name='\$\{e\}'>
                            <h5 style="width: 100%; color: #9a9a9a;" >Variant : \$\{e\}</h5>
                            <div style="width: 100%; display: flex; flex-flow: row; color:white;">
                              <input type="text" name="price"  placeholder="price" class="form-control input-variant-multi"  style="width: 50%">
                              <input type="text" name="sku"  placeholder="sku" class="form-control input-variant-multi" style="width: 50%">
                            </div>
                            <br>
                          </div>    
                          \`;
                        });
                  
                        node.querySelector('#container_variants_multi').innerHTML = htmlcontent;
                        // create tables or variants
                        reloadEventsListener();
                        //updateVariantPerCountry();
                        console.log('updated');
                        try{    
                            value.colors = arr1;
                            value.sizes = arr2;
                            value.variants = pairs;

                            updateValue(JSON.stringify(value));
                        }catch(e) {
                            console.log('erro int gener');
                        }
                        // updateValue(JSON.stringify({
                        //     colors : arr1,
                        //     sizes: arr2,
                        //     variants: pairs,
                        // }));
                        
                      } 
                }
            })
        })
    `,

    getMultiCountryVariantCreditCardWidget: (currentUser, isUpsellOrDownsell_cc) => `
        let show_sku_cc = ${currentUser.privilege >= 5 ? true : false} || localStorage.getItem("${gval.plg_domain_secret}"); // User Privilege
        let isUpsellOrDownsell_cc = ${isUpsellOrDownsell_cc};   
        
        unlayer.registerPropertyEditor({
            name: 'multi_variants_cc',
            layout: 'bottom',
            Widget: unlayer.createWidget({
                render(value) {                    
                    return \`
                        <div class="blockbuilder-widget blockbuilder-link-widget">
                            <div class="kwsgjF">    
                                <div class="row eiCcjJ">
                                    <div class="col-12">
                                        <div class="blockbuilder-widget-label pb-2">
                                            <label class="blockbuilder-label-primary">
                                                <span>Product Price USD($) </span>
                                            </label>
                                        </div>
                                        <input name="usbaseprice" type="number" class="form-control base-price" value="20">
                                    </div>
                                </div>
                            </div>
                            <div class="kwsgjF">    
                                <div class="row eiCcjJ">
                                    <div class="col-12">
                                        <div class="blockbuilder-widget-label pb-2">
                                            <label class="blockbuilder-label-primary">
                                                <span>Product Profit Margin USD($) </span>
                                            </label>
                                        </div>
                                        <input name="usbasemargin" type="number" class="form-control base-margin" value="10">
                                    </div>
                                </div>
                            </div>
                            <div class="kwsgjF">
                                <div class="row eiCcjJ">
                                    <div class="blockbuilder-widget-label col-4">
                                        <label class="blockbuilder-label-primary">
                                            <span>Select Country</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-8">
                                        <select class="country_list form-control" style="margin-top: 0;">
                                            ${gval.cod_available_country("no_country").map((country, i) => {
                                                return `<option value="${country.iso2}">${country.name} / ${country.cw}</option>`;
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div class="row eiCcjJ view_country_list"></div>
                            </div>
                            <div class="kwsgjF">
                                <div class="row eiCcjJ">
                                    <div class="blockbuilder-widget-label col-12">
                                        <label class="blockbuilder-label-primary">
                                            <span>Search product in your shopify</span>
                                        </label>
                                        <label class="blockbuilder-label-right">
                                            <div class="use-shopify react-toggle">
                                                <div class="react-toggle-track">
                                                    <div class="react-toggle-track-check">
                                                        <svg width="14" height="11" viewBox="0 0 14 11">
                                                            <title>switch-check</title>
                                                            <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                    <div class="react-toggle-track-x">
                                                        <svg width="10" height="10" viewBox="0 0 10 10">
                                                            <title>switch-x</title>
                                                            <path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="react-toggle-thumb"></div>
                                                <input class="react-toggle-screenreader-only" type="checkbox">
                                            </div>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-12" style="margin-top: 5px; display: none;">
                                        <input type="text" class="form-control shopify-product-search">
                                        <ul class="shopify-show-result" style="width: 93%;"></ul>
                                    </div>
                                </div>
                            </div>                        
                            <div class="kwsgjF">
                                <div class="variant-list" style="max-height: 445px; overflow: auto;">
                                    <!-- Dynamic Variant Will Appear here -->
                                </div>
                            </div>
                            <div class="kwsgjF not-for-upsell is-arrow">
                                <div class="row eiCcjJ">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>Default Selected Style</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7">
                                        <select class="style-list form-control" style="margin-top: 0;">
                                            <option value="0" selected>None</option>
                                            <option value="1" selected>Arrow</option>
                                            <option value="2">Ribbon</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="kwsgjF not-for-upsell is-ribbon">
                                <div class="row eiCcjJ">
                                    <div class="blockbuilder-widget-label col-12">
                                        <label class="blockbuilder-label-primary">
                                            <span>Ribbon Text</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-12">
                                        <input type="text" class="form-control ribbon-text">
                                    </div>
                                </div>
                            </div>
                        </div>
                    \`
                },
                mount(node, value, updateValue) {                    
                    value = value ? JSON.parse(value) : { selected_iso2: "US" };
                    if (!value.selected_iso2) value.selected_iso2 = "PH"; // dko alam kung bakit minsan kc pag lumipat ng widget nag uundefined to so gawin ntin empty string
                    if (!value[value.selected_iso2]) value[value.selected_iso2] = { use_shopify: false, shopify_search: "", variants: [] , activateCOD : true , activateCreditCard : true } ;                
                    if (!value[value.selected_iso2].selected_style) {
                        value[value.selected_iso2].selected_style = "1";
                        value[value.selected_iso2].ribbon_text = "Most Popular!";
                    }
                    value[value.selected_iso2].variants = value[value.selected_iso2].variants.filter(e => e.quantity || e.name || e.price || e.compare || e.tags || e.sku); // remove empty data
                    let variant_list = node.querySelector(".variant-list"), variant_length = value[value.selected_iso2].variants.length + 1;
                    variant_list.innerHTML = ""; // clear container                    
                    if (isUpsellOrDownsell_cc) variant_length = 1;
                                                       
                    for(let i = 0; i < 2; i++) {
                        variant_list.innerHTML += \`
                            <div class="card-header" style="margin: 5px 0; cursor: unset;">
                            <div class="kwsgjF">
                                <div class="row eiCcjJ">
                                    <div class="blockbuilder-widget-label col-12">
                                        <label class="blockbuilder-label-primary">
                                            <span>Activate \$\{i == 0 ? 'COD' : 'Credit Card'\}</span>
                                        </label>
                                        <label class="blockbuilder-label-right">
                                            <div class="is-activate-\$\{i == 0 ? 'cod' : 'credit-card'\} react-toggle">
                                                <div class="react-toggle-track">
                                                    <div class="react-toggle-track-check">
                                                        <svg width="14" height="11" viewBox="0 0 14 11">
                                                            <title>switch-check</title>
                                                            <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                    <div class="react-toggle-track-x">
                                                        <svg width="10" height="10" viewBox="0 0 10 10">
                                                            <title>switch-x</title>
                                                            <path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="react-toggle-thumb"></div>
                                                <input class="react-toggle-screenreader-only" type="checkbox">
                                            </div>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-12" style="margin-top: 5px; display: none;">
                                        <input type="text" class="form-control shopify-product-search">
                                        <ul class="shopify-show-result" style="width: 93%;"></ul>
                                    </div>
                                </div>
                            </div>
                                <div class="row eiCcjJ">
                                    <div class="blockbuilder-widget-label col-12">
                                        <label class="blockbuilder-label-primary">
                                            <span>\$\{i == 0 ? 'Set COD default selected' : 'Set Credit Card default selected' \}</span>
                                        </label>
                                        <label class="blockbuilder-label-right">
                                            <div class="is-variant-selected react-toggle">
                                                <div class="react-toggle-track">
                                                    <div class="react-toggle-track-check">
                                                        <svg width="14" height="11" viewBox="0 0 14 11">
                                                            <title>switch-check</title>
                                                            <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                    <div class="react-toggle-track-x">
                                                        <svg width="10" height="10" viewBox="0 0 10 10">
                                                            <title>switch-x</title>
                                                            <path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="react-toggle-thumb"></div>
                                                <input class="react-toggle-screenreader-only" type="checkbox">
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div class="row eiCcjJ"style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-3" style="display:none;">
                                        <label class="blockbuilder-label-primary">
                                            <span>Quantity</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-4 text-center">
                                        <label class="blockbuilder-label-primary">
                                            <span style="font-size: 11px;">Local Price</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-4 text-center" style="padding-left: 0;">
                                        <label class="blockbuilder-label-primary">
                                            <span>Compare</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-4 text-center" style="padding-left: 0;">
                                        <label class="blockbuilder-label-primary">
                                            <span>Tag(s)</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="row eiCcjJ"style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-3" style="display:none;">
                                        <input data-index="\$\{i\}" name="quantity" type="number" class="form-control variant-qty" >                                        
                                    </div>
                                    <div class="blockbuilder-widget-label col-4">
                                        <input data-index="\$\{i\}" name="price" type="number" class="form-control variant-prices">
                                    </div>
                                    <div class="blockbuilder-widget-label col-4" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="compare" type="number" class="form-control variant-compares">
                                    </div>
                                    <div class="blockbuilder-widget-label col-4" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="tags" type="text" class="form-control variant-tags">
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>Ribbon Text</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="ribbon_text" type="text" class="form-control v-ribbon-text" value="\$\{i == 0 ? 'COD Ribbon' : 'Credit Card Ribbon' \}">
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>Variant Name</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="name" type="text" class="form-control variant-names" value="\$\{i == 0 ? 'Cash On Delivery / Pickup ' : 'Credit / Debit Card' \}">
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px; display: \$\{show_sku_cc ? "flex" : "none"\};">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>PLG Variant ID</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="sku" type="text" class="form-control variant-sku">
                                        <ul class="shopify-show-result" style="display: none;"></ul>
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px; display: \$\{isUpsellOrDownsell_cc ? "flex" : "none"\};">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>Button Text</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="variant_text" type="text" class="form-control variant-text">
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px; display: \$\{isUpsellOrDownsell_cc ? "flex" : "none"\};">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>Button Sub Text</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="variant_sub_text" type="text" class="form-control variant-sub-text">
                                    </div>
                                </div>
                            </div>
                        \`;
                    }

                    let view_country = node.querySelector(".view_country_list");
                    let available_country = ${JSON.stringify(gval.cod_available_country("no_country"))};
                    let iso2_list = Object.keys(value).filter(e => e.length == 2);

                    view_country.innerHTML = "";
                    iso2_list.forEach((country, i) => {
                        let country_info = available_country.filter(e => e.iso2 === country)[0];
                        view_country.innerHTML += \`
                            <div class="blockbuilder-widget-label col-4" style="margin-top: 5px; padding: 10px 5px; text-align: center;">
                                <label class="card-header blockbuilder-label-primary display-inline" style="cursor: pointer;">
                                    <span class="set-country" data-iso2="\$\{country\}">\$\{country_info.name\}</span>
                                    \$\{iso2_list.length > 1 ? \`<span class="close-button remove-country" data-iso2="\$\{country\}">&times;</span>\` : ""\}
                                </label>
                            </div>
                        \`;
                    });

                    let country = node.querySelector(".country_list");
                    let use_shopify = node.querySelector(".use-shopify");
                    let shopify_search = node.querySelector(".shopify-product-search");
                    let suggests = node.querySelectorAll(".is-variant-selected");
                    let isUsingCod = node.querySelectorAll(".is-activate-cod");     
                    let isUsingCredit = node.querySelectorAll(".is-activate-credit-card");              
                    let qtys = node.querySelectorAll(".variant-qty");
                    let names = node.querySelectorAll(".variant-names");
                    let prices = node.querySelectorAll(".variant-prices");
                    let compare = node.querySelectorAll(".variant-compares");
                    let tags = node.querySelectorAll(".variant-tags");
                    let skus = node.querySelectorAll(".variant-sku");
                    let btn_text = node.querySelectorAll(".variant-text");
                    let btn_sub_text = node.querySelectorAll(".variant-sub-text");
                    let set_country = node.querySelectorAll(".set-country");
                    let remove_country = node.querySelectorAll(".remove-country");
                    let v_ribbon_text = node.querySelectorAll(".v-ribbon-text");
                    // for selected variant styling
                    let selected_style = node.querySelector(".style-list");
                    let ribbon_text = node.querySelector(".ribbon-text");
                    let arrow = node.querySelector(".is-arrow");
                    let ribbon = node.querySelector(".is-ribbon");

                    // for the use base price and margins
                    let usbaseprice = node.querySelector(".base-price");
                    let usbasemargin = node.querySelector(".base-margin");
                    
                    if(isUpsellOrDownsell_cc) {
                        let has_selected = value[value.selected_iso2].variants.filter(e => e.selected).length !== 0 ? true : false;
                        // set index 0 as selected varaint unless has selected
                        if(!has_selected) value[value.selected_iso2].variants[0] = { ...value[value.selected_iso2].variants[0], selected: true };
                        
                        // hide arrow and ribbon
                        node.querySelectorAll(".not-for-upsell").forEach(el => {
                            el.style.display = "none";
                        });
                    }
                    // let prevcountry = value.selected_iso2;
                    country.value = value.selected_iso2; 
                    country.onchange = function(e){
                        country.value = country.value;
                        value.selected_iso2 = country.value;

                        updateValue(JSON.stringify(value));
                        // if the filter value already contains the iso2 selected dont compute
                        if(!Object.keys(value).includes(country.value)){
                           
                              
                               
                                let country_selected = country.options[country.selectedIndex].text.replace(/\s+/g, '').split('/').pop();
                                fetch(\`/api/editor_converter/\$\{parseFloat(usbaseprice.value)\}/\$\{parseFloat(usbasemargin.value)\}/\$\{country_selected.replaceAll(" ","")\}\`).then(res=>res.json()).then(res=> {                                    
                                    
                                    value[value.selected_iso2] = { use_shopify: false, shopify_search: "", variants: [] , activateCOD : true , activateCreditCard : true };
                                    save_variant_data(0, "price", res.localCodPrice.toFixed(2));                                    
                                    save_variant_data(0, "name", "Cash On Delivery");
                                    save_variant_data(1, "price", res.localCCtPrice.toFixed(2));                                    
                                    save_variant_data(1, "name", "Credit Card");
                                    
                                });                                
                             
                        }
                        // value[value.selected_iso2][variants][0] // for the cod selling price us to selected
                        // value[value.selected_iso2][variants][1] // for the credit card selling price us to selected

                        
                    }

                    if(value[value.selected_iso2].use_shopify) use_shopify.classList.add("react-toggle--checked");
                    else use_shopify.classList.remove("react-toggle--checked");
                    use_shopify.onchange = function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        let toggle = use_shopify.classList.value.includes("react-toggle--checked") ? false : true;
                        value[value.selected_iso2].use_shopify = toggle;
                        updateValue(JSON.stringify(value));
                    }
                    
                    shopify_search.parentNode.style.display = value[value.selected_iso2].use_shopify ? "block" : "none";
                    if(value[value.selected_iso2].use_shopify) {
                        shopify_search.value = value[value.selected_iso2].shopify_search;
                        shopify_search.onkeyup = function(e){
                            search_shopify_product(shopify_search);
                        }
                    }          
                    
                    isUsingCod.forEach((el, i) => {
                        if (value[value.selected_iso2].activateCOD) el.classList.add("react-toggle--checked");
                        el.addEventListener("change",function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            if(el.classList.value.includes("react-toggle--checked")){
                                el.classList.remove("react-toggle--checked");
                                value[value.selected_iso2].activateCOD = false;
                                updateValue(JSON.stringify(value));
                            }else{
                                el.classList.add("react-toggle--checked");
                                value[value.selected_iso2].activateCOD = true;
                                updateValue(JSON.stringify(value));
                            }
                        });
                    });

                    isUsingCredit.forEach((el, i) => {
                        if (value[value.selected_iso2].activateCreditCard) el.classList.add("react-toggle--checked");
                        el.addEventListener("change",function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            if(el.classList.value.includes("react-toggle--checked")){
                                el.classList.remove("react-toggle--checked");
                                value[value.selected_iso2].activateCreditCard = false;
                                updateValue(JSON.stringify(value));
                            }else{
                                el.classList.add("react-toggle--checked");
                                value[value.selected_iso2].activateCreditCard = true;
                                updateValue(JSON.stringify(value));
                            }
                        });
                    });
                    
                    suggests.forEach((el, i) => {
                        if(value[value.selected_iso2].variants[i] && value[value.selected_iso2].variants[i].selected) el.classList.add("react-toggle--checked");
                        el.onchange = function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            let toggle = el.classList.value.includes("react-toggle--checked") ? false : true;
                            if(toggle) { // remove all checked before checking this selected
                                value[value.selected_iso2].variants = value[value.selected_iso2].variants.map(e => {
                                    e.selected = false;
                                    return e;
                                });
                            }
                            save_variant_data(i, "selected", toggle);
                        }
                    });

                    [...qtys, ...names, ...prices, ...compare, ...tags, ...skus, ...btn_text, ...btn_sub_text, ...v_ribbon_text].forEach(el => {
                        let i = parseInt(el.getAttribute("data-index"));
                        el.value = value[value.selected_iso2].variants[i] && value[value.selected_iso2].variants[i][el.name] ? value[value.selected_iso2].variants[i][el.name] : "";
                        if(el.name === "sku") {
                            el.onkeyup = function(e){
                                if(el.value){
                                    search_plg_variant(i, el);
                                } else {
                                    el.parentNode.querySelector(".shopify-show-result").innerText = "";
                                    el.parentNode.querySelector(".shopify-show-result").style.cssText = "display: none;";
                                    save_variant_data(i, el.name, "");
                                }
                            }
                        } else {
                            el.onchange = function(e){
                                save_variant_data(i, el.name, el.value);
                            }
                        }
                    });

                    set_country.forEach(el => {
                        el.onclick = function(e){
                            let set_iso2 = el.getAttribute("data-iso2");
                            value.selected_iso2 = set_iso2;
                            updateValue(JSON.stringify(value));
                        }
                    });

                    remove_country.forEach(el => {
                        el.onclick = function(e){
                            let close_iso2 = el.getAttribute("data-iso2");
                            delete value[close_iso2];
                            if(close_iso2 === value.selected_iso2) {
                                let x = Object.keys(value).filter(e => e.length == 2);
                                value.selected_iso2 = x[0];
                            }
                            updateValue(JSON.stringify(value));
                        }
                    });

                    // start toggle Ribbon Text and Ribbon Colors
                    if(!isUpsellOrDownsell_cc) {
                        if(value[value.selected_iso2].selected_style && value[value.selected_iso2].selected_style === "2") {
                            ribbon.style.display = "block";
                            arrow.style.cssText = "";
                            node.parentNode.nextElementSibling.style.cssText = "";
                        } else {
                            ribbon.style.display = "none";
                            arrow.style.cssText = "border: none; padding-bottom: 0;";
                            node.parentNode.nextElementSibling.style.cssText = "display: none;";
                        }
                    }
                    // end toggle Ribbon Text and Ribbon Colors

                    selected_style.value = value[value.selected_iso2].selected_style;
                    selected_style.onchange = function(e){
                        value[value.selected_iso2].selected_style = selected_style.value;
                        updateValue(JSON.stringify(value));
                    }

                    ribbon_text.value = value[value.selected_iso2].ribbon_text;
                    ribbon_text.onkeyup = function(e){
                        value[value.selected_iso2].ribbon_text = ribbon_text.value;
                        updateValue(JSON.stringify(value));
                    }

                    function save_variant_data(index, name, new_value){                        
                        if(!value[value.selected_iso2].variants[index]) value[value.selected_iso2].variants[index] = {};
                        // if(name === "quantity") new_value = parseInt(new_value);
                        else if(name === "price") new_value = parseFloat(new_value);
                        else if(name === "compare") new_value = parseFloat(new_value);
                        else if(name === "name") {
                            value[value.selected_iso2].variants[index]['quantity'] = 1;    
                            value[value.selected_iso2].variants[index][name] = new_value;    
                        }
                        value[value.selected_iso2].variants[index][name] = new_value;
                        updateValue(JSON.stringify(value));
                    }

                    let sku_timeout = [];
                    function search_plg_variant(i, el){
                        clearTimeout(sku_timeout[i]);
                        let result_container = el.parentNode.querySelector(".shopify-show-result");
                        result_container.style.cssText = "display: block; z-index: 10; right: 15px; top: 34px; width: 158%;";
                        result_container.innerHTML = "<li>Loading...</li>";
                        sku_timeout[i] = setTimeout(() => {
                            const payload = { query: \`query($search: String) { getFunnelProducts(search: $search, limit: 5, page: 1){ id productName productSku productSrp } }\`, variables: { search: el.value } };
                            fetch('/graphql', { method: "POST", headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(payload) })
                            .then(res => res.json())
                            .then(res => {
                                let str = "", data = res.data.getFunnelProducts;
                                if(data.length != 0) {
                                    data.forEach(d => {
                                        str += \`<li id="\$\{d.id\}" data-price="\$\{d.productSrp\}" class="plg_cod_product">\$\{d.productName\} - \$\{d.productSku\}</li>\`;
                                    })
                                } else {
                                    str = "<li>No Result Found.</li>";
                                }
                                result_container.innerHTML = str;
                                result_container.querySelectorAll("li").forEach(li => {
                                    li.onclick = () => {
                                        if(li.id) el.value = window.parent.encodeID(li.id);
                                        save_variant_data(i, el.name, el.value);
                                        result_container.innerHTML = "";
                                    }
                                });
                            })
                            .catch(err => result_container.innerHTML = "<li>Please Try again.</li>");
                        }, 500);
                    }

                    let shopify_timeout = null;
                    function search_shopify_product(el){
                        clearTimeout(shopify_timeout)
                        let result_container = el.parentNode.querySelector(".shopify-show-result");
                        result_container.innerHTML = \`<li>Loading please wait...</li>\`;
                        if(el.value) {
                            shopify_timeout = setTimeout(() => {
                                fetch('/api/admin-search-products', {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        searchProduct: el.value,
                                        storeUrl: "${currentUser.store_url}",
                                        storeToken: "${currentUser.store_token}"
                                    })
                                })
                                .then(res => res.json())
                                .then(res => {
                                    let results = res.data.products.edges;
                                    if(results.length == 0){
                                        result_container.innerHTML = \`<li>No result for "\$\{el.value\}"</li>\`;
                                    } else {
                                        result_container.innerHTML = "";
                                        results.forEach(el => {
                                            result_container.innerHTML += \`<li class="shopify-products" data-prod-id="\$\{el.node.id\}" data-prod-name="\$\{el.node.title\}"><img src="\$\{el.node.images.edges.length == 0 ? "https://via.placeholder.com/40x40?text=N/A" : el.node.images.edges[0].node.originalSrc\}"> \$\{el.node.title\}</li>\`;
                                        })
                                        let list = result_container.querySelectorAll(".shopify-products");
                                        list.forEach(product => {
                                            product.onclick = function(e){
                                                result_container.innerHTML = \`<li>Getting Variant...</li>\`;
                                                fetch('/api/admin-get-product', {
                                                    method: "POST",
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({
                                                        productid: event.target.getAttribute("data-prod-id"),
                                                        storeUrl: "${currentUser.store_url}",
                                                        storeToken: "${currentUser.store_token}"
                                                    })
                                                })
                                                .then(vres => vres.json())
                                                .then(vres => {
                                                    let shopifyVariant = vres.data.product.variants.edges;
                                                    let newVariants = [];
                                                    shopifyVariant.forEach((svar, i) => {
                                                        newVariants.push({
                                                            id: svar.node.id.replace("gid://shopify/ProductVariant/",""),
                                                            selected: i === 0 ? true : false,
                                                            quantity: 1,
                                                            name: svar.node.title,
                                                            price: svar.node.price,
                                                            compare: svar.node.compareAtPrice
                                                        });
                                                    });
                                                    value[value.selected_iso2].shopify_search = e.target.getAttribute("data-prod-name");
                                                    value[value.selected_iso2].variants = newVariants;
                                                    updateValue(JSON.stringify(value));
                                                    result_container.innerHTML = "";
                                                });
                                            }
                                        });
                                    }
                                })
                                .catch(err => result_container.innerHTML = "<li>Please Try again.</li>");
                            }, 500);
                        } else {
                            result_container.innerHTML = "";
                        }
                    }
                }
            })
        });
    `,
    getMultiCountryVariantWidget: (currentUser, isUpsellOrDownsell) => `
        let show_sku = ${currentUser.privilege >= 5 ? true : false} || localStorage.getItem("${gval.plg_domain_secret}"); // User Privilege
        let isUpsellOrDownsell = ${isUpsellOrDownsell};
        unlayer.registerPropertyEditor({
            name: 'multi_variants',
            layout: 'bottom',
            Widget: unlayer.createWidget({
                render(value) {
                    return \`
                        <div class="blockbuilder-widget blockbuilder-link-widget">
                            <div class="kwsgjF">
                                <div class="row eiCcjJ">
                                    <div class="blockbuilder-widget-label col-4">
                                        <label class="blockbuilder-label-primary">
                                            <span>Select Country</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-8">
                                        <select class="country_list form-control" style="margin-top: 0;">
                                            ${gval.cod_available_country("no_country").map((country, i) => {
                                                return `<option value="${country.iso2}">${country.name} / ${country.cw}</option>`;
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div class="row eiCcjJ view_country_list"></div>
                            </div>
                            <div class="kwsgjF">
                                <div class="row eiCcjJ">
                                    <div class="blockbuilder-widget-label col-12">
                                        <label class="blockbuilder-label-primary">
                                            <span>Use Price Table Display</span>
                                        </label>
                                        <label class="blockbuilder-label-right">
                                            <div class="use-new-display react-toggle">
                                                <div class="react-toggle-track">
                                                    <div class="react-toggle-track-check">
                                                        <svg width="14" height="11" viewBox="0 0 14 11">
                                                            <title>switch-check</title>
                                                            <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                    <div class="react-toggle-track-x">
                                                        <svg width="10" height="10" viewBox="0 0 10 10">
                                                            <title>switch-x</title>
                                                            <path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="react-toggle-thumb"></div>
                                                <input class="react-toggle-screenreader-only" type="checkbox">
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="kwsgjF">
                                <div class="row eiCcjJ">
                                    <div class="blockbuilder-widget-label col-12">
                                        <label class="blockbuilder-label-primary">
                                            <span>Search product in your shopify</span>
                                        </label>
                                        <label class="blockbuilder-label-right">
                                            <div class="use-shopify react-toggle">
                                                <div class="react-toggle-track">
                                                    <div class="react-toggle-track-check">
                                                        <svg width="14" height="11" viewBox="0 0 14 11">
                                                            <title>switch-check</title>
                                                            <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                    <div class="react-toggle-track-x">
                                                        <svg width="10" height="10" viewBox="0 0 10 10">
                                                            <title>switch-x</title>
                                                            <path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="react-toggle-thumb"></div>
                                                <input class="react-toggle-screenreader-only" type="checkbox">
                                            </div>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-12" style="margin-top: 5px; display: none;">
                                        <input type="text" class="form-control shopify-product-search">
                                        <ul class="shopify-show-result" style="width: 93%;"></ul>
                                    </div>
                                </div>
                            </div>
                            <div class="kwsgjF">
                                <div class="variant-list" style="max-height: 445px; overflow: auto;">
                                    <!-- Dynamic Variant Will Appear here -->
                                </div>
                            </div>
                            <div class="kwsgjF not-for-upsell is-arrow">
                                <div class="row eiCcjJ">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>Default Selected Style</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7">
                                        <select class="style-list form-control" style="margin-top: 0;">
                                            <option value="0" selected>None</option>
                                            <option value="1" selected>Arrow</option>
                                            <option value="2">Ribbon</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="kwsgjF not-for-upsell is-ribbon">
                                <div class="row eiCcjJ">
                                    <div class="blockbuilder-widget-label col-12">
                                        <label class="blockbuilder-label-primary">
                                            <span>Ribbon Text</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-12">
                                        <input type="text" class="form-control ribbon-text">
                                    </div>
                                </div>
                            </div>
                        </div>
                    \`
                },
                mount(node, value, updateValue) {
                    value = value ? JSON.parse(value) : { selected_iso2: "PH", useNewDisplay: false};
                    if (!value.selected_iso2) value.selected_iso2 = "PH"; // dko alam kung bakit minsan kc pag lumipat ng widget nag uundefined to so gawin ntin empty string
                    if (!value[value.selected_iso2]) value[value.selected_iso2] = { use_shopify: false, shopify_search: "", variants: [] };
                    if (!value[value.selected_iso2].selected_style) {
                        value[value.selected_iso2].selected_style = "1";
                        value[value.selected_iso2].ribbon_text = "Most Popular!";
                    }
                    value[value.selected_iso2].variants = value[value.selected_iso2].variants.filter(e => e.quantity || e.name || e.price || e.compare || e.tags || e.sku); // remove empty data
                    let variant_list = node.querySelector(".variant-list"), variant_length = value[value.selected_iso2].variants.length + 1;
                    variant_list.innerHTML = ""; // clear container
                    if (isUpsellOrDownsell) variant_length = 1;                    
                    for(let i = 0; i < variant_length; i++) {
                        variant_list.innerHTML += \`
                            <div class="card-header" style="margin: 5px 0; cursor: unset;">
                                <div class="row eiCcjJ">
                                    <div class="blockbuilder-widget-label col-12">
                                        <label class="blockbuilder-label-primary">
                                            <span>Set as default selected</span>
                                        </label>
                                        <label class="blockbuilder-label-right">
                                            <div class="is-variant-selected react-toggle">
                                                <div class="react-toggle-track">
                                                    <div class="react-toggle-track-check">
                                                        <svg width="14" height="11" viewBox="0 0 14 11">
                                                            <title>switch-check</title>
                                                            <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                    <div class="react-toggle-track-x">
                                                        <svg width="10" height="10" viewBox="0 0 10 10">
                                                            <title>switch-x</title>
                                                            <path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="react-toggle-thumb"></div>
                                                <input class="react-toggle-screenreader-only" type="checkbox">
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div class="row eiCcjJ"style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-3">
                                        <label class="blockbuilder-label-primary">
                                            <span>Quantity</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-3 text-center" style="padding-left: 0;">
                                        <label class="blockbuilder-label-primary">
                                            <span style="font-size: 11px;">Local Price</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-3 text-center" style="padding-left: 0;">
                                        <label class="blockbuilder-label-primary">
                                            <span>Compare</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-3 text-center" style="padding-left: 0;">
                                        <label class="blockbuilder-label-primary">
                                            <span>Tag(s)</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="row eiCcjJ"style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-3">
                                        <input data-index="\$\{i\}" name="quantity" type="number" class="form-control variant-qty">
                                    </div>
                                    <div class="blockbuilder-widget-label col-3" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="price" type="number" class="form-control variant-prices">
                                    </div>
                                    <div class="blockbuilder-widget-label col-3" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="compare" type="number" class="form-control variant-compares">
                                    </div>
                                    <div class="blockbuilder-widget-label col-3" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="tags" type="text" class="form-control variant-tags">
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>Ribbon Text</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="ribbon_text" type="text" class="form-control v-ribbon-text">
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>Variant Name</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="name" type="text" class="form-control variant-names">
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px; display: \$\{show_sku ? "flex" : "none"\};">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>PLG Variant ID</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="sku" type="text" class="form-control variant-sku">
                                        <ul class="shopify-show-result" style="display: none;"></ul>
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px; display: \$\{value.useNewDisplay ? "flex" : "none"\};">
                                    <div class="blockbuilder-widget-label col-12">
                                        <label class="blockbuilder-label-primary">
                                            <span>Image Link</span>
                                        </label>
                                        <input data-index="\$\{i\}" name="imgLink" type="text" class="form-control variant-imgLink">
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px; display: \$\{value.useNewDisplay ? "flex" : "none"\};">
                                    <div class="blockbuilder-widget-label col-12">
                                        <label class="blockbuilder-label-primary">
                                            <span>Header Subtitle</span>
                                        </label>
                                        <textarea data-index="\$\{i\}" name="subtitleheader" rows="8" class="form-control variant-subtitleHeader"></textarea>
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px; display: \$\{isUpsellOrDownsell ? "flex" : "none"\};">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>Button Text</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="variant_text" type="text" class="form-control variant-text">
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px; display: \$\{isUpsellOrDownsell ? "flex" : "none"\};">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>Button Sub Text</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="variant_sub_text" type="text" class="form-control variant-sub-text">
                                    </div>
                                </div>
                            </div>
                        \`;
                    }

                    let view_country = node.querySelector(".view_country_list");
                    let available_country = ${JSON.stringify(gval.cod_available_country("no_country"))};
                    let iso2_list = Object.keys(value).filter(e => e.length == 2);

                    view_country.innerHTML = "";
                    iso2_list.forEach((country, i) => {
                        let country_info = available_country.filter(e => e.iso2 === country)[0];
                        view_country.innerHTML += \`
                            <div class="blockbuilder-widget-label col-4" style="margin-top: 5px; padding: 10px 5px; text-align: center;">
                                <label class="card-header blockbuilder-label-primary display-inline" style="cursor: pointer;">
                                    <span class="set-country" data-iso2="\$\{country\}">\$\{country_info.name\}</span>
                                    \$\{iso2_list.length > 1 ? \`<span class="close-button remove-country" data-iso2="\$\{country\}">&times;</span>\` : ""\}
                                </label>
                            </div>
                        \`;
                    });

                    let country = node.querySelector(".country_list");
                    let use_shopify = node.querySelector(".use-shopify");
                    let shopify_search = node.querySelector(".shopify-product-search");
                    let suggests = node.querySelectorAll(".is-variant-selected");
                    let qtys = node.querySelectorAll(".variant-qty");
                    let names = node.querySelectorAll(".variant-names");
                    let imgLinks = node.querySelectorAll(".variant-imgLink");
                    let subtitleHeader = node.querySelectorAll(".variant-subtitleHeader");
                    let prices = node.querySelectorAll(".variant-prices");
                    let compare = node.querySelectorAll(".variant-compares");
                    let tags = node.querySelectorAll(".variant-tags");
                    let skus = node.querySelectorAll(".variant-sku");
                    let btn_text = node.querySelectorAll(".variant-text");
                    let btn_sub_text = node.querySelectorAll(".variant-sub-text");
                    let set_country = node.querySelectorAll(".set-country");
                    let remove_country = node.querySelectorAll(".remove-country");
                    let v_ribbon_text = node.querySelectorAll(".v-ribbon-text");
                    // for selected variant styling
                    let selected_style = node.querySelector(".style-list");
                    let ribbon_text = node.querySelector(".ribbon-text");
                    let arrow = node.querySelector(".is-arrow");
                    let ribbon = node.querySelector(".is-ribbon");
                    let newDisplay = node.querySelector(".use-new-display");
                    
                    if(isUpsellOrDownsell) {
                        let has_selected = value[value.selected_iso2].variants.filter(e => e.selected).length !== 0 ? true : false;
                        // set index 0 as selected varaint unless has selected
                        if(!has_selected) value[value.selected_iso2].variants[0] = { ...value[value.selected_iso2].variants[0], selected: true };
                        
                        // hide arrow and ribbon
                        node.querySelectorAll(".not-for-upsell").forEach(el => {
                            el.style.display = "none";
                        });
                    }
                    
                    country.value = value.selected_iso2;
                    country.onchange = function(e){
                        country.value = country.value;
                        value.selected_iso2 = country.value;
                        updateValue(JSON.stringify(value));
                    }

                    if(value.useNewDisplay){
                        newDisplay.classList.add("react-toggle--checked");
                    }else{
                        newDisplay.classList.remove("react-toggle--checked");
                    }
                    
                    newDisplay.onchange = function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        let toggle = newDisplay.classList.value.includes("react-toggle--checked") ? false : true;
                        if(toggle){
                            newDisplay.classList.add("react-toggle--checked");
                        }else{
                            newDisplay.classList.remove("react-toggle--checked");
                        }
                        e.selected = toggle;
                        value.useNewDisplay = toggle;

                        updateValue(JSON.stringify(value));                        
                    }

                    if(value[value.selected_iso2].use_shopify) use_shopify.classList.add("react-toggle--checked");
                    else use_shopify.classList.remove("react-toggle--checked");
                    use_shopify.onchange = function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        let toggle = use_shopify.classList.value.includes("react-toggle--checked") ? false : true;
                        value[value.selected_iso2].use_shopify = toggle;
                        updateValue(JSON.stringify(value));
                    }
                    
                    shopify_search.parentNode.style.display = value[value.selected_iso2].use_shopify ? "block" : "none";
                    if(value[value.selected_iso2].use_shopify) {
                        shopify_search.value = value[value.selected_iso2].shopify_search;
                        shopify_search.onkeyup = function(e){
                            search_shopify_product(shopify_search);
                        }
                    }
                    
                    suggests.forEach((el, i) => {
                        if(value[value.selected_iso2].variants[i] && value[value.selected_iso2].variants[i].selected) el.classList.add("react-toggle--checked");
                        el.onchange = function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            let toggle = el.classList.value.includes("react-toggle--checked") ? false : true;
                            if(toggle) { // remove all checked before checking this selected
                                value[value.selected_iso2].variants = value[value.selected_iso2].variants.map(e => {
                                    e.selected = false;
                                    return e;
                                });
                            }
                            save_variant_data(i, "selected", toggle);
                        }
                    });

                    [...qtys, ...subtitleHeader ,...imgLinks,...names, ...prices, ...compare, ...tags, ...skus, ...btn_text, ...btn_sub_text, ...v_ribbon_text].forEach(el => {
                        let i = parseInt(el.getAttribute("data-index"));
                        el.value = value[value.selected_iso2].variants[i] && value[value.selected_iso2].variants[i][el.name] ? value[value.selected_iso2].variants[i][el.name] : "";
                        if(el.name === "sku") {
                            el.onkeyup = function(e){
                                if(el.value){
                                    search_plg_variant(i, el);
                                } else {
                                    el.parentNode.querySelector(".shopify-show-result").innerText = "";
                                    el.parentNode.querySelector(".shopify-show-result").style.cssText = "display: none;";
                                    save_variant_data(i, el.name, "");
                                }
                            }
                        } else {
                            el.onchange = function(e){
                                save_variant_data(i, el.name, el.value);
                            }
                        }
                    });

                    set_country.forEach(el => {
                        el.onclick = function(e){
                            let set_iso2 = el.getAttribute("data-iso2");
                            value.selected_iso2 = set_iso2;
                            updateValue(JSON.stringify(value));
                        }
                    });

                    remove_country.forEach(el => {
                        el.onclick = function(e){
                            let close_iso2 = el.getAttribute("data-iso2");
                            delete value[close_iso2];
                            if(close_iso2 === value.selected_iso2) {
                                let x = Object.keys(value).filter(e => e.length == 2);
                                value.selected_iso2 = x[0];
                            }
                            updateValue(JSON.stringify(value));
                        }
                    });

                    // start toggle Ribbon Text and Ribbon Colors
                    if(!isUpsellOrDownsell) {
                        if(value[value.selected_iso2].selected_style && value[value.selected_iso2].selected_style === "2") {
                            ribbon.style.display = "block";
                            arrow.style.cssText = "";
                            node.parentNode.nextElementSibling.style.cssText = "";
                        } else {
                            ribbon.style.display = "none";
                            arrow.style.cssText = "border: none; padding-bottom: 0;";
                            node.parentNode.nextElementSibling.style.cssText = "display: none;";
                        }
                    }
                    // end toggle Ribbon Text and Ribbon Colors

                    selected_style.value = value[value.selected_iso2].selected_style;
                    selected_style.onchange = function(e){
                        value[value.selected_iso2].selected_style = selected_style.value;
                        updateValue(JSON.stringify(value));
                    }

                    ribbon_text.value = value[value.selected_iso2].ribbon_text;
                    ribbon_text.onkeyup = function(e){
                        value[value.selected_iso2].ribbon_text = ribbon_text.value;                        
                        updateValue(JSON.stringify(value));
                    }

                    function save_variant_data(index, name, new_value){
                        if(!value[value.selected_iso2].variants[index]) value[value.selected_iso2].variants[index] = {};
                        if(name === "quantity") new_value = parseInt(new_value);
                        else if(name === "price") new_value = parseFloat(new_value);
                        else if(name === "compare") new_value = parseFloat(new_value);
                        value[value.selected_iso2].variants[index][name] = new_value;
                        updateValue(JSON.stringify(value));                        
                    }

                    let sku_timeout = [];
                    function search_plg_variant(i, el){
                        clearTimeout(sku_timeout[i]);
                        let result_container = el.parentNode.querySelector(".shopify-show-result");
                        result_container.style.cssText = "display: block; z-index: 10; right: 15px; top: 34px; width: 158%;";
                        result_container.innerHTML = "<li>Loading...</li>";
                        sku_timeout[i] = setTimeout(() => {
                            const payload = { query: \`query($search: String) { getFunnelProducts(search: $search, limit: 5, page: 1){ id productName productSku productSrp } }\`, variables: { search: el.value } };
                            fetch('/graphql', { method: "POST", headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(payload) })
                            .then(res => res.json())
                            .then(res => {
                                let str = "", data = res.data.getFunnelProducts;
                                if(data.length != 0) {
                                    data.forEach(d => {
                                        str += \`<li id="\$\{d.id\}" data-price="\$\{d.productSrp\}" class="plg_cod_product">\$\{d.productName\} - \$\{d.productSku\}</li>\`;
                                    })
                                } else {
                                    str = "<li>No Result Found.</li>";
                                }
                                result_container.innerHTML = str;
                                result_container.querySelectorAll("li").forEach(li => {
                                    li.onclick = () => {
                                        if(li.id) el.value = window.parent.encodeID(li.id);
                                        save_variant_data(i, el.name, el.value);
                                        result_container.innerHTML = "";
                                    }
                                });
                            })
                            .catch(err => result_container.innerHTML = "<li>Please Try again.</li>");
                        }, 500);
                    }

                    let shopify_timeout = null;
                    function search_shopify_product(el){
                        clearTimeout(shopify_timeout)
                        let result_container = el.parentNode.querySelector(".shopify-show-result");
                        result_container.innerHTML = \`<li>Loading please wait...</li>\`;
                        if(el.value) {
                            shopify_timeout = setTimeout(() => {
                                fetch('/api/admin-search-products', {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        searchProduct: el.value,
                                        storeUrl: "${currentUser.store_url}",
                                        storeToken: "${currentUser.store_token}"
                                    })
                                })
                                .then(res => res.json())
                                .then(res => {
                                    let results = res.data.products.edges;
                                    if(results.length == 0){
                                        result_container.innerHTML = \`<li>No result for "\$\{el.value\}"</li>\`;
                                    } else {
                                        result_container.innerHTML = "";
                                        results.forEach(el => {
                                            result_container.innerHTML += \`<li class="shopify-products" data-prod-id="\$\{el.node.id\}" data-prod-name="\$\{el.node.title\}"><img src="\$\{el.node.images.edges.length == 0 ? "https://via.placeholder.com/40x40?text=N/A" : el.node.images.edges[0].node.originalSrc\}"> \$\{el.node.title\}</li>\`;
                                        })
                                        let list = result_container.querySelectorAll(".shopify-products");
                                        list.forEach(product => {
                                            product.onclick = function(e){
                                                result_container.innerHTML = \`<li>Getting Variant...</li>\`;
                                                fetch('/api/admin-get-product', {
                                                    method: "POST",
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({
                                                        productid: event.target.getAttribute("data-prod-id"),
                                                        storeUrl: "${currentUser.store_url}",
                                                        storeToken: "${currentUser.store_token}"
                                                    })
                                                })
                                                .then(vres => vres.json())
                                                .then(vres => {
                                                    let shopifyVariant = vres.data.product.variants.edges;
                                                    let newVariants = [];
                                                    shopifyVariant.forEach((svar, i) => {
                                                        newVariants.push({
                                                            id: svar.node.id.replace("gid://shopify/ProductVariant/",""),
                                                            selected: i === 0 ? true : false,
                                                            quantity: 1,
                                                            name: svar.node.title,
                                                            price: svar.node.price,
                                                            compare: svar.node.compareAtPrice
                                                        });
                                                    });
                                                    value[value.selected_iso2].shopify_search = e.target.getAttribute("data-prod-name");
                                                    value[value.selected_iso2].variants = newVariants;
                                                    updateValue(JSON.stringify(value));
                                                    result_container.innerHTML = "";
                                                });
                                            }
                                        });
                                    }
                                })
                                .catch(err => result_container.innerHTML = "<li>Please Try again.</li>");
                            }, 500);
                        } else {
                            result_container.innerHTML = "";
                        }
                    }
                }
            })
        });
    `,
    getVariantWidget: (currentUser, isUpsellOrDownsell) => `
        unlayer.registerPropertyEditor({
            name: 'normal_variant',
            layout: 'bottom',
            Widget: unlayer.createWidget({
                render(value) {
                    return \`
                        <div class="blockbuilder-widget blockbuilder-link-widget">
                            <div class="kwsgjF">
                                <div class="row eiCcjJ">
                                    <div class="blockbuilder-widget-label col-12">
                                        <label class="blockbuilder-label-primary">
                                            <span>Search product in your shopify</span>
                                        </label>
                                        <label class="blockbuilder-label-right">
                                            <div class="use-shopify react-toggle">
                                                <div class="react-toggle-track">
                                                    <div class="react-toggle-track-check">
                                                        <svg width="14" height="11" viewBox="0 0 14 11">
                                                            <title>switch-check</title>
                                                            <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                    <div class="react-toggle-track-x">
                                                        <svg width="10" height="10" viewBox="0 0 10 10">
                                                            <title>switch-x</title>
                                                            <path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="react-toggle-thumb"></div>
                                                <input class="react-toggle-screenreader-only" type="checkbox">
                                            </div>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-12" style="margin-top: 5px; display: none;">
                                        <input type="text" class="form-control shopify-product-search">
                                        <ul class="shopify-show-result" style="width: 93%;"></ul>
                                    </div>
                                </div>
                            </div>
                            <div class="kwsgjF">
                                <div class="variant-list" style="max-height: 366px; overflow: auto;">
                                    <!-- Dynamic Variant Will Appear here -->
                                </div>
                            </div>
                        </div>
                    \`
                },
                mount(node, value, updateValue) {
                    let show_sku = ${currentUser.privilege >= 5 ? true : false} || localStorage.getItem("${gval.plg_domain_secret}"); // User Privilege
                    let isUpsellOrDownsell = ${isUpsellOrDownsell};
                    value = value ? JSON.parse(value) : { use_shopify: false, shopify_search: "", variants: [] };
                    let variant_list = node.querySelector(".variant-list"), variant_length = isUpsellOrDownsell ? 1 : value.variants.length + 1;
                    variant_list.innerHTML = ""; // clear container
                    for (let i = 0; i < variant_length; i++) {
                        variant_list.innerHTML += \`
                            <div class="card-header" style="margin: 5px 0; cursor: unset;">
                                <div class="row eiCcjJ">
                                    <div class="blockbuilder-widget-label col-12">
                                        <label class="blockbuilder-label-primary">
                                            <span>Set as default selected</span>
                                        </label>
                                        <label class="blockbuilder-label-right">
                                            <div class="is-variant-selected react-toggle">
                                                <div class="react-toggle-track">
                                                    <div class="react-toggle-track-check">
                                                        <svg width="14" height="11" viewBox="0 0 14 11">
                                                            <title>switch-check</title>
                                                            <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                    <div class="react-toggle-track-x">
                                                        <svg width="10" height="10" viewBox="0 0 10 10">
                                                            <title>switch-x</title>
                                                            <path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fill-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="react-toggle-thumb"></div>
                                                <input class="react-toggle-screenreader-only" type="checkbox">
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div class="row eiCcjJ"style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-3">
                                        <label class="blockbuilder-label-primary">
                                            <span>Quantity</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-3 text-center" style="padding-left: 0;">
                                        <label class="blockbuilder-label-primary">
                                            <span style="font-size: 11px;">Price</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-3 text-center" style="padding-left: 0;">
                                        <label class="blockbuilder-label-primary">
                                            <span>Compare</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-3 text-center" style="padding-left: 0;">
                                        <label class="blockbuilder-label-primary">
                                            <span>Tag(s)</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="row eiCcjJ"style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-3">
                                        <input data-index="\$\{i\}" name="quantity" type="number" class="form-control variant-qty">
                                    </div>
                                    <div class="blockbuilder-widget-label col-3" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="price" type="number" class="form-control variant-prices">
                                    </div>
                                    <div class="blockbuilder-widget-label col-3" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="compare" type="number" class="form-control variant-compares">
                                    </div>
                                    <div class="blockbuilder-widget-label col-3" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="tags" type="text" class="form-control variant-tags">
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px;">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>Variant Name</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="name" type="text" class="form-control variant-names">
                                    </div>
                                </div>
                                <div class="row eiCcjJ" style="margin-top: 5px; display: \$\{show_sku ? "flex" : "none"\};">
                                    <div class="blockbuilder-widget-label col-5">
                                        <label class="blockbuilder-label-primary">
                                            <span>PLG Variant ID</span>
                                        </label>
                                    </div>
                                    <div class="blockbuilder-widget-label col-7" style="padding-left: 0;">
                                        <input data-index="\$\{i\}" name="sku" type="text" class="form-control variant-sku">
                                        <ul class="shopify-show-result" style="display: none;"></ul>
                                    </div>
                                </div>
                            </div>
                        \`;
                    }

                    let use_shopify = node.querySelector(".use-shopify");
                    let shopify_search = node.querySelector(".shopify-product-search");
                    let suggests = node.querySelectorAll(".is-variant-selected");
                    let qtys = node.querySelectorAll(".variant-qty");
                    let names = node.querySelectorAll(".variant-names");
                    let prices = node.querySelectorAll(".variant-prices");
                    let compare = node.querySelectorAll(".variant-compares");
                    let tags = node.querySelectorAll(".variant-tags");
                    let skus = node.querySelectorAll(".variant-sku");
                    
                    if (isUpsellOrDownsell) value.variants[0] = { ...value.variants[0], selected: true };

                    if (value.use_shopify) {
                        use_shopify.classList.add("react-toggle--checked");
                        shopify_search.parentNode.style.display = "block";
                        shopify_search.value = value.shopify_search;
                    } else {
                        use_shopify.classList.remove("react-toggle--checked");
                        shopify_search.parentNode.style.display = "none";
                    }

                    use_shopify.onchange = function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        let toggle = use_shopify.classList.value.includes("react-toggle--checked") ? false : true;
                        value.use_shopify = toggle;
                        if (!toggle) { // remove shopify info from variant
                            value.shopify_search = "";
                            value.variants = value.variants.map(e => {
                                e.id = "";
                                return e;
                            });
                        }
                        updateValue(JSON.stringify(value));
                    }

                    shopify_search.onkeyup = function(e){
                        search_shopify_product(shopify_search);
                    }
                    
                    suggests.forEach((el, i) => {
                        if(value.variants[i] && value.variants[i].selected) el.classList.add("react-toggle--checked");
                        el.onchange = function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            let toggle = el.classList.value.includes("react-toggle--checked") ? false : true;
                            if(toggle) { // remove all checked before checking this selected
                                value.variants = value.variants.map(e => {
                                    e.selected = false;
                                    return e;
                                });
                            }
                            save_variant_data(i, "selected", toggle);
                        }
                    });

                    [...qtys, ...names, ...prices, ...compare, ...tags, ...skus].forEach(el => {
                        let i = parseInt(el.getAttribute("data-index"));
                        el.value = value.variants[i] && value.variants[i][el.name] ? value.variants[i][el.name] : "";
                        if(el.name === "sku") {
                            el.onkeyup = function(e){
                                if(el.value){
                                    search_plg_variant(i, el);
                                } else {
                                    el.parentNode.querySelector(".shopify-show-result").innerText = "";
                                    el.parentNode.querySelector(".shopify-show-result").style.cssText = "display: none;";
                                    save_variant_data(i, el.name, "");
                                }
                            }
                        } else {
                            el.onchange = function(e){
                                save_variant_data(i, el.name, el.value);
                            }
                        }
                    });

                    function save_variant_data(index, name, new_value){
                        if(!value.variants[index]) value.variants[index] = {};
                        if(name === "quantity") new_value = parseInt(new_value);
                        else if(name === "price") new_value = parseFloat(new_value);
                        else if(name === "compare") new_value = parseFloat(new_value);
                        value.variants[index][name] = new_value;
                        value.variants = value.variants.filter(e => e.quantity || e.name || e.price || e.compare || e.tags || e.sku); // remove empty data
                        updateValue(JSON.stringify(value));
                    }

                    let sku_timeout = [];
                    function search_plg_variant(i, el){
                        clearTimeout(sku_timeout[i]);
                        let result_container = el.parentNode.querySelector(".shopify-show-result");
                        result_container.style.cssText = "display: block; z-index: 10; right: 15px; top: 34px; width: 158%;";
                        result_container.innerHTML = "<li>Loading...</li>";
                        sku_timeout[i] = setTimeout(() => {
                            const payload = { query: \`query($search: String) { getFunnelProducts(search: $search, limit: 5, page: 1){ id productName productSku productSrp } }\`, variables: { search: el.value } };
                            fetch('/graphql', { method: "POST", headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(payload) })
                            .then(res => res.json())
                            .then(res => {
                                let str = "", data = res.data.getFunnelProducts;
                                if(data.length != 0) {
                                    data.forEach(d => {
                                        str += \`<li id="\$\{d.id\}" data-price="\$\{d.productSrp\}" class="plg_cod_product">\$\{d.productName\} - \$\{d.productSku\}</li>\`;
                                    })
                                } else {
                                    str = "<li>No Result Found.</li>";
                                }
                                result_container.innerHTML = str;
                                result_container.querySelectorAll("li").forEach(li => {
                                    li.onclick = () => {
                                        if(li.id) el.value = window.parent.encodeID(li.id);
                                        save_variant_data(i, el.name, el.value);
                                        result_container.innerHTML = "";
                                    }
                                });
                            })
                            .catch(err => result_container.innerHTML = "<li>Please Try again.</li>");
                        }, 500);
                    }

                    let shopify_timeout = null;
                    function search_shopify_product(el){
                        clearTimeout(shopify_timeout)
                        let result_container = el.parentNode.querySelector(".shopify-show-result");
                        result_container.innerHTML = \`<li>Loading please wait...</li>\`;
                        if(el.value) {
                            shopify_timeout = setTimeout(() => {
                                fetch('/api/admin-search-products', {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        searchProduct: el.value,
                                        storeUrl: "${currentUser.store_url}",
                                        storeToken: "${currentUser.store_token}"
                                    })
                                })
                                .then(res => res.json())
                                .then(res => {
                                    let results = res.data.products.edges;
                                    if(results.length == 0){
                                        result_container.innerHTML = \`<li>No result for "\$\{el.value\}"</li>\`;
                                    } else {
                                        result_container.innerHTML = "";
                                        results.forEach(el => {
                                            result_container.innerHTML += \`<li class="shopify-products" data-prod-id="\$\{el.node.id\}" data-prod-name="\$\{el.node.title\}"><img src="\$\{el.node.images.edges.length == 0 ? "https://via.placeholder.com/40x40?text=N/A" : el.node.images.edges[0].node.originalSrc\}"> \$\{el.node.title\}</li>\`;
                                        })
                                        let list = result_container.querySelectorAll(".shopify-products");
                                        list.forEach(product => {
                                            product.onclick = function(e){
                                                result_container.innerHTML = \`<li>Getting Variant...</li>\`;
                                                fetch('/api/admin-get-product', {
                                                    method: "POST",
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({
                                                        productid: event.target.getAttribute("data-prod-id"),
                                                        storeUrl: "${currentUser.store_url}",
                                                        storeToken: "${currentUser.store_token}"
                                                    })
                                                })
                                                .then(vres => vres.json())
                                                .then(vres => {
                                                    let shopifyVariant = vres.data.product.variants.edges;
                                                    let newVariants = [];
                                                    shopifyVariant.forEach((svar, i) => {
                                                        newVariants.push({
                                                            id: svar.node.id.replace("gid://shopify/ProductVariant/",""),
                                                            selected: i === 0 ? true : false,
                                                            quantity: 1,
                                                            name: svar.node.title,
                                                            price: parseFloat(svar.node.price),
                                                            compare: svar.node.compareAtPrice
                                                        });
                                                    });
                                                    value.shopify_search = e.target.getAttribute("data-prod-name");
                                                    value.variants = newVariants;
                                                    updateValue(JSON.stringify(value));
                                                    result_container.innerHTML = "";
                                                });
                                            }
                                        });
                                    }
                                })
                                .catch(err => result_container.innerHTML = "<li>Please Try again.</li>");
                            }, 500);
                        } else {
                            result_container.innerHTML = "";
                        }
                    }
                }
            })
        });
    `,

    getImageGalleryViewer: function(currenUser){
        return `
        unlayer.registerPropertyEditor({
            name: 'carousel_images',
            layout: 'bottom',
            Widget: unlayer.createWidget({
                render(value) {
                    return \`<div>
                        <style>
                        .item-image-carousel {
                            position:relative;
                            padding-top:20px;
                            display:inline-block;
                        }
                        .notify-badge-image-carousel{
                            position: absolute;
                            right: -0.7rem;
                            top: 0rem;
                            background: red;
                            text-align: center;
                            border-radius: 30px 30px 30px 30px;
                            color: white;
                            padding: 0rem 0.7rem;
                            font-size: 14px;
                        }
                        </style>
                        <div class="blockbuilder-widget blockbuilder-text-widget row sc-bZQynM eiCcjJ">
                            <div class="col-12">
                                <div class="blockbuilder-widget-label pb-2"><label class="blockbuilder-label-primary">
                                        <span>Insert Image Links Here</span>
                                    </label>
                                </div>
                                <input name="imagelink" type="text" class="form-control" id="image-carousel-widget" placeholder="https://your_image_link_here/image">
                            </div>
                        </div>
                        <br>
                        <div class="blockbuilder-widget blockbuilder-text-widget row sc-bZQynM eiCcjJ">
                            <div class="col-12">
                                <div class="blockbuilder-widget-label pb-2"><label class="blockbuilder-label-primary">
                                        <span>Image Gallery</span>
                                    </label>
                                </div>                                
                            </div>                            
                        </div>
                        <br>
                        <br>
                        <div class="blockbuilder-widget blockbuilder-text-widget row sc-bZQynM eiCcjJ" id="image-gallery-output">                                                     
                        </div>
                    </div>\`;
                },
                mount(node, value, updateValue) {
                    value = value ? JSON.parse(value) : { images: [] };
                    let toupdatevalue = { images: [] };
                    let imageLinkTextField = node.querySelector("#image-carousel-widget");
                    let imageGalleryOutput = node.querySelector("#image-gallery-output");
                    let imghtmls = "";
                    if(value && value.images.length !== 0){
                        //show the gallery 
                        value.images.map((img,index) => {
                            imghtmls += \`
                            <div class="col-6">                                
                                <span>
                                    <div class="item-image-carousel">
                                        <span data-image-index="\$\{index\}" style="cursor: pointer;"  class="notify-badge-image-carousel image-thumbnail-actiom">&times;</span>
                                        <img class="img img-thumbnail" src="\$\{img\}" /> 
                                    </div> 
                                </span>
                            </div>  
                            \`;
                        });
                        
                        imageGalleryOutput.innerHTML = imghtmls;
                    }
                    let imageremovebutton =  node.querySelectorAll('.image-thumbnail-actiom');

                    if(imageremovebutton !== ""){
                        imageremovebutton.forEach(element => {                            
                            element.onclick = function(e){
                                var index = parseInt(element.getAttribute("data-image-index"));                                
                                removeImage(index);
                            }
                        })
                    }

                    function removeImage(index){
                        value.images.splice(index,1);
                        updateValue(JSON.stringify(value))
                    }

                    imageLinkTextField.onkeydown = function(e){
                        if(e.key === "Enter" ){
                            console.log(e.target.value,'the value you inserted');
                            value.images.push(e.target.value);
                            updateValue(JSON.stringify(value))
                            e.target.value = "";
                        }
                    }                    
                }
            })
        });
        `;
    },
    /* ==================== END WIDGETS ==================== */

    /* ==================== START EDITOR CONTENT ==================== */
    getUpsellDownsellButton: function() {
        return `
            unlayer.registerTool({
                type: 'upsell-button',
                category: 'contents',
                label: 'Upsell Button',
                icon: '<svg class="svg-inline--fa fa-w-14 fa-w-20 fa-3x" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 512 512" viewBox="0 0 512 512"> <g fill="#fff"> <path d="M22.496,15.496999999999957C22.496,15.496999999999957,118.577,15.496999999999957,118.577,15.496999999999957C122.676,15.496999999999957,126.075,12.097999999999956,126.075,7.998999999999967C126.075,7.998999999999967,126.075,7.998999999999967,126.075,7.998999999999967C126.075,3.899000000000001,122.676,0.5,118.577,0.5C118.577,0.5,7.499,0.5,7.499,0.5C3.399,0.5,0,3.899000000000001,0,7.998999999999967C0,7.998999999999967,0,119.077,0,119.077C0,123.17599999999999,3.399,126.57499999999999,7.499,126.57499999999999C7.499,126.57499999999999,7.499,126.57499999999999,7.499,126.57499999999999C11.598,126.57499999999999,14.997,123.17599999999999,14.997,119.077C14.997,119.077,14.997,22.99599999999998,14.997,22.99599999999998C14.997,18.895999999999958,18.396,15.496999999999957,22.496,15.496999999999957C22.496,15.496999999999957,22.496,15.496999999999957,22.496,15.496999999999957M7.499,386.325C7.499,386.325,7.499,386.325,7.499,386.325C3.399,386.325,0,389.724,0,393.823C0,393.823,0,504.90099999999995,0,504.90099999999995C0,509.001,3.399,512.4,7.499,512.4C7.499,512.4,118.577,512.4,118.577,512.4C122.676,512.4,126.075,509.001,126.075,504.90099999999995C126.075,504.90099999999995,126.075,504.90099999999995,126.075,504.90099999999995C126.075,500.80199999999996,122.676,497.40299999999996,118.577,497.40299999999996C118.577,497.40299999999996,22.496,497.40299999999996,22.496,497.40299999999996C18.396,497.40299999999996,14.997,494.00399999999996,14.997,489.904C14.997,489.904,14.997,393.823,14.997,393.823C14.997,389.724,11.598,386.325,7.499,386.325C7.499,386.325,7.499,386.325,7.499,386.325M489.404,497.40299999999996C489.404,497.40299999999996,393.323,497.40299999999996,393.323,497.40299999999996C389.224,497.40299999999996,385.825,500.80199999999996,385.825,504.90099999999995C385.825,504.90099999999995,385.825,504.90099999999995,385.825,504.90099999999995C385.825,509.001,389.224,512.4,393.323,512.4C393.323,512.4,504.401,512.4,504.401,512.4C508.501,512.4,511.9,509.001,511.9,504.90099999999995C511.9,504.90099999999995,511.9,393.823,511.9,393.823C511.9,389.724,508.501,386.325,504.401,386.325C504.401,386.325,504.401,386.325,504.401,386.325C500.302,386.325,496.903,389.724,496.903,393.823C496.903,393.823,496.903,489.904,496.903,489.904C496.903,494.00399999999996,493.504,497.40299999999996,489.404,497.40299999999996C489.404,497.40299999999996,489.404,497.40299999999996,489.404,497.40299999999996M385.825,7.998999999999967C385.825,7.998999999999967,385.825,7.998999999999967,385.825,7.998999999999967C385.825,12.097999999999956,389.224,15.496999999999957,393.323,15.496999999999957C393.323,15.496999999999957,489.404,15.496999999999957,489.404,15.496999999999957C493.504,15.496999999999957,496.903,18.895999999999958,496.903,22.99599999999998C496.903,22.99599999999998,496.903,119.077,496.903,119.077C496.903,123.17599999999999,500.302,126.57499999999999,504.401,126.57499999999999C504.401,126.57499999999999,504.401,126.57499999999999,504.401,126.57499999999999C508.501,126.57499999999999,511.9,123.17599999999999,511.9,119.077C511.9,119.077,511.9,7.998999999999967,511.9,7.998999999999967C511.9,3.899000000000001,508.501,0.5,504.401,0.5C504.401,0.5,393.323,0.5,393.323,0.5C389.224,0.5,385.825,3.899000000000001,385.825,7.998999999999967C385.825,7.998999999999967,385.825,7.998999999999967,385.825,7.998999999999967M482.806,169.56699999999995C482.806,169.56699999999995,29.094,169.56699999999995,29.094,169.56699999999995C13.097,169.56699999999995,0,182.56399999999996,0,198.661C0,198.661,0,314.43899999999996,0,314.43899999999996C0,330.436,12.997,343.533,29.094,343.533C29.094,343.533,482.906,343.533,482.906,343.533C498.903,343.533,512,330.53599999999994,512,314.43899999999996C512,314.43899999999996,512,198.56099999999998,512,198.56099999999998C511.9,182.56399999999996,498.903,169.56699999999995,482.806,169.56699999999995C482.806,169.56699999999995,482.806,169.56699999999995,482.806,169.56699999999995M496.903,314.43899999999996C496.903,322.13699999999994,490.604,328.53599999999994,482.806,328.53599999999994C482.806,328.53599999999994,29.094,328.53599999999994,29.094,328.53599999999994C21.396,328.53599999999994,14.997,322.23699999999997,14.997,314.43899999999996C14.997,314.43899999999996,14.997,198.56099999999998,14.997,198.56099999999998C14.997,190.863,21.296,184.464,29.094,184.464C29.094,184.464,482.906,184.464,482.906,184.464C490.604,184.464,497.003,190.76299999999998,497.003,198.56099999999998C497.003,198.56099999999998,497.003,314.43899999999996,497.003,314.43899999999996C497.003,314.43899999999996,496.903,314.43899999999996,496.903,314.43899999999996C496.903,314.43899999999996,496.903,314.43899999999996,496.903,314.43899999999996M255.95,223.55599999999998C251.851,223.55599999999998,248.451,226.95599999999996,248.451,231.05499999999995C248.451,231.05499999999995,248.451,282.04499999999996,248.451,282.04499999999996C248.451,286.144,251.851,289.544,255.95,289.544C260.049,289.544,263.449,286.144,263.449,282.04499999999996C263.449,282.04499999999996,263.449,231.05499999999995,263.449,231.05499999999995C263.449,226.95599999999996,260.049,223.55599999999998,255.95,223.55599999999998C255.95,223.55599999999998,255.95,223.55599999999998,255.95,223.55599999999998M220.957,223.55599999999998C216.858,223.55599999999998,213.458,226.95599999999996,213.458,231.05499999999995C213.458,231.05499999999995,213.458,282.04499999999996,213.458,282.04499999999996C213.458,286.144,216.858,289.544,220.957,289.544C225.056,289.544,228.455,286.144,228.455,282.04499999999996C228.455,282.04499999999996,228.455,231.05499999999995,228.455,231.05499999999995C228.455,226.95599999999996,225.056,223.55599999999998,220.957,223.55599999999998C220.957,223.55599999999998,220.957,223.55599999999998,220.957,223.55599999999998M290.943,223.55599999999998C286.844,223.55599999999998,283.445,226.95599999999996,283.445,231.05499999999995C283.445,231.05499999999995,283.445,282.04499999999996,283.445,282.04499999999996C283.445,286.144,286.844,289.544,290.943,289.544C295.042,289.544,298.442,286.144,298.442,282.04499999999996C298.442,282.04499999999996,298.442,231.05499999999995,298.442,231.05499999999995C298.442,226.95599999999996,295.042,223.55599999999998,290.943,223.55599999999998C290.943,223.55599999999998,290.943,223.55599999999998,290.943,223.55599999999998" /> </g> </svg>',
                values: {},
                options: {
                    product: {
                        title: "Product",
                        position: 1,
                        options: ${this.config_normal_upsell()}
                    },
                    button: {
                        title: "Button",
                        position: 2,
                        options: ${this.config_button("fbInitiate,braintreeToken")}
                    },
                    confirmation: {
                        title: "Confirmation",
                        position: 3,
                        options: ${this.config_confirmation()}
                    }
                },
                renderer: {
                    Viewer: unlayer.createViewer({
                        render(values) {
                            let button_style = btnStyleFn(values);
                            let selected_variant = values.variant ? JSON.parse(values.variant).variants[0] : null;
                            if (!selected_variant) return \`<h3 style="text-align: center; margin: 0;">Please Setup Upsell Product</h3>\`;
                            return \`
                                \$\{button_style\}
                                <button class="\$\{values.animation\}">
                                    \$\{values.text\}
                                    <div class="subtext">\$\{values.subText\}</div>
                                </button>
                            \`;
                        }
                    }),
                    exporters: {
                        web: function(values) {
                            let button_style = btnStyleFn(values);
                            let selected_variant = values.variant ? JSON.parse(values.variant).variants[0] : null;
                            if (!selected_variant) return \`<h3 style="text-align: center; margin: 0;">Please Setup Upsell Product</h3>\`;
                            return \`
                                \$\{button_style\}
                                <button class="\$\{values.animation\}">
                                    \$\{values.text\}
                                    <div class="subtext">\$\{values.subText\}</div>
                                </button>
                            \`;
                        }
                    }
                }
            });
        `;
    },
    getCheckoutConekta: function(user_id, funnel_id, funnel_snapchat_id, public_key, private_key) {
        return `
            console.log("1. Initializing Editor Tools --> Conekta Checkout...");
            unlayer.registerTool({
                type: 'conekta-form',
                category: 'contents',
                label: 'Conekta Form',
                icon: '<svg class="svg-inline--fa fa-wpforms fa-w-14 fa-3x" viewBox="0 0 60 50"><g><path d=" M 48.049 35.661 C 48.049 35.661 48.194 32.873 46.164 32.873 C 44.14 32.873 42.536 36.736 36.728 41.188 C 31.612 45.109 29.242 46.278 25.072 47.959 C 25.072 47.959 26.52 48.919 37.236 48.919 C 44.341 48.919 48.049 48.786 48.049 35.661 Z  M 48.049 24.34 C 48.049 24.34 48.194 27.127 46.164 27.127 C 44.14 27.127 42.536 23.264 36.728 18.812 C 31.612 14.891 29.242 13.723 25.072 12.041 C 25.072 12.041 26.52 11.081 37.236 11.081 C 44.341 11.081 48.049 11.215 48.049 24.34 Z  M 30.744 20.392 C 26.957 18.01 24.575 16.815 21.628 15.785 C 20.145 15.418 18.577 15.812 17.444 16.837 C 13.949 20.328 11.973 25.059 11.949 30 C 11.974 34.94 13.949 39.671 17.444 43.163 C 18.577 44.186 20.145 44.582 21.628 44.216 C 24.575 43.186 26.957 41.99 30.744 39.609 C 29.839 36.184 29.526 32.888 29.511 30.001 C 29.526 27.112 29.839 23.817 30.744 20.392 Z " fill-rule="evenodd" fill="rgb(255,255,255)"/></g></svg>',
                values: {},
                options: {
                    conekta_button: {
                        title: "Button",
                        position: 1,
                        options: ${this.config_button("braintreeToken")}
                    },
                    conekta_form: {
                        title: "Form",
                        position: 2,
                        options: ${this.config_non_cod_form("testMode,showCard")}
                    }
                },
                renderer: {
                    Viewer: unlayer.createViewer({
                        render(values) {
                            let form_style = formStyleFn(values);
                            let input_style = inputStyleFn(values);
                            let button_style = btnStyleFn(values);
                            let content_style = subscriptionStyleFn(values);
                            return \`
                                \$\{form_style\}
                                \$\{input_style\}
                                \$\{button_style\}
                                \$\{content_style\}
                                <div class="conekta-form">
                                    <div class="form-container">
                                        <form id="paymentForm" class="payment-form" style="display: inline-block; width: 100%;">
                                            <h3 style="margin: 0 0 5px;">\$\{values.formHeader\}</h3>
                                            <div class="half-left">
                                                <input type="text" name="firstName" placeholder="\$\{values.firstName\}" required />
                                            </div>
                                            <div class="half-right">
                                                <input type="text" name="lastName" placeholder="\$\{values.lastName\}" required />
                                            </div>
                                            <input type="text" name="phone" placeholder="\$\{values.phone\}">
                                            <input type="email" name="email" autocomplete="on" maxlength="40" placeholder="\$\{values.email\}" required />
                                            <input type="text" name="address" autocomplete="on" maxlength="45" placeholder="\$\{values.address\}" required />
                                            <input type="text" name="city" autocomplete="on" maxlength="45" placeholder="\$\{values.city\}" required />
                                            <input type="text" name="zipcode" autocomplete="on" pattern="[0-9]*" maxlength="5" placeholder="\$\{values.zipcode\}" required />
                                            <input type="text" name="state" autocomplete="on" placeholder="\$\{values.state\}" required />
                                            <input type="hidden" name="country" required />
                                            <h3 style="margin: 0 0 5px;">\$\{values.creditCard\}</h3>
                                            <input type="text" name="cardNumber" placeholder="Card Number" required />
                                            <div class="half-left">
                                                <input type="text" name="expiry" placeholder="MM / YY" required />
                                            </div>
                                            <div class="half-right">
                                                <input type="text" name="cardCode" placeholder="CCV" required />
                                            </div>
                                            <button class="\$\{values.animation\}" type="submit">
                                                \$\{values.text\}
                                                <div class="subtext">\$\{values.subText\}</div>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            \`;
                        }
                    }),
                    exporters: {
                        web: function(values) {
                            let form_style = formStyleFn(values);
                            let input_style = inputStyleFn(values);
                            let button_style = btnStyleFn(values);
                            let content_style = subscriptionStyleFn(values);
                            let selected_country = JSON.parse(values.selected_country).selected.split(",");
                            return \`
                                \$\{form_style\}
                                \$\{input_style\}
                                \$\{button_style\}
                                \$\{content_style\}
                                <div class="conekta-form">
                                    <div class="form-container">
                                        <form id="paymentForm" class="payment-form" style="display: inline-block; width: 100%;">
                                            <div class="card-wrapper"></div>
                                            <h3 style="margin: 0 0 5px;">\$\{values.formHeader\}</h3>
                                            <div class="half-left">
                                                <input type="text" name="firstName" placeholder="\$\{values.firstName\}" required />
                                            </div>
                                            <div class="half-right">
                                                <input type="text" name="lastName" placeholder="\$\{values.lastName\}" required />
                                            </div>
                                            <input type="text" name="phone" placeholder="\$\{values.phone\}">
                                            <input type="email" name="email" autocomplete="on" maxlength="40" placeholder="\$\{values.email\}" required />
                                            <input type="text" name="address" autocomplete="on" maxlength="45" placeholder="\$\{values.address\}" required />
                                            <input type="text" name="city" autocomplete="on" maxlength="45" placeholder="\$\{values.city\}" required />
                                            <input type="text" name="zipcode" autocomplete="on" pattern="[0-9]*" maxlength="5" placeholder="\$\{values.zipcode\}" required />
                                            <input type="text" name="state" autocomplete="on" placeholder="\$\{values.state\}" required />
                                            <input type="hidden" name="country" value="\$\{selected_country[1]\}" required />
                                            <h3 style="margin: 0 0 5px;">\$\{values.creditCard\}</h3>
                                            <input type="text" name="cardNumber" placeholder="Card Number" required />
                                            <div class="half-left">
                                                <input type="text" name="expiry" placeholder="MM / YYYY" required />
                                            </div>
                                            <div class="half-right">
                                                <input type="text" name="cardCode" placeholder="CCV" required />
                                            </div>
                                            <button class="\$\{values.animation\}" type="submit">
                                                \$\{values.text\}
                                                <div class="subtext">\$\{values.subText\}</div>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <script src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/121761/card.js"></script>
                                <script type="text/javascript" src="https://cdn.conekta.io/js/latest/conekta.js"></script>
                                <script>
                                    let addInitiateCheckoutFn = \$\{addInitiateCheckoutFn\};
                                    addInitiateCheckoutFn("${funnel_snapchat_id}", \$\{values.fbInitiate\}, "\$\{values._meta.htmlID\}", "[name='firstName'],[name='lastName'],[name='email']");
                                    plg_price = typeof plg_price === "undefined" ? 0 : plg_price;
                                    plg_selectedVariant = typeof plg_selectedVariant === "undefined" ? {} : plg_selectedVariant;
                                    (() => {
                                        localStorage.removeItem("plg_conekta");
                                        localStorage.removeItem("plg_prod_list");
                                        localStorage.removeItem("plg_prod_thankyou_list");

                                        let container = document.getElementById("\$\{values._meta.htmlID\}");
                                        let form = container.querySelector("form");
                                        let form_to_object = form => Array.from(new FormData(form)).reduce((acc, [key, value]) => ({...acc,[key]: value}),{});

                                        let card = new Card({
                                            form: '#\$\{values._meta.htmlID\} #paymentForm',
                                            container: '.card-wrapper',
                                            formSelectors: { numberInput: 'input[name="cardNumber"]', expiryInput: 'input[name="expiry"]', cvcInput: 'input[name="cardCode"]', nameInput: 'input[name="firstName"], input[name="lastName"]' },
                                            width: 200,
                                            formatting: true,
                                            messages: { validDate: 'valid date', monthYear: 'mm/yyyy' },
                                            placeholders: { number: '•••• •••• •••• ••••', name: 'Full Name', expiry: '••/••', cvc: '•••' },
                                            masks: { cardNumber: '•' },
                                            debug: false
                                        });

                                        // Start Conekta FE Function
                                        Conekta.setPublicKey("${public_key}");
                                        Conekta.setLanguage("\$\{selected_country[0]\}");

                                        form.onsubmit = event => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            let formValue = form_to_object(form);
                                            if(!plg_price) {
                                                alert("Please select variant");
                                            } else {
                                                toggle_loading();
                                                analytics_add_to_cart(\$\{values.fbTrack\});
                                                let params = {
                                                    "card": {
                                                        "number": formValue.cardNumber,
                                                        "name": formValue.firstName + " " + formValue.lastName,
                                                        "exp_month": formValue.expiry.split("/")[0].trim(),
                                                        "exp_year": formValue.expiry.split("/")[1].trim(),
                                                        "cvc": formValue.cardCode
                                                    }
                                                };
                                                Conekta.Token.create(params, conektaSuccess, conektaError);
                                            }
                                        }

                                        function conektaSuccess(token) {
                                            clearCardInformation();
                                            let formValue = form_to_object(form);
                                            delete formValue.card_name; delete formValue.card_number; delete formValue.exp_month; delete formValue.exp_year; delete formValue.cvc;
                                            /* ===== START plg required information ===== */
                                            formValue.source_link = window.location.href;
                                            formValue.customerID = fe_user_id("conekta_");
                                            formValue.metadata = { meta: "${encryptString(user_id)}", pageid: "${funnel_id}" };
                                            /* ===== END plg required information & START product information ===== */
                                            formValue.conektaPK = "${private_key}";
                                            formValue.conektaTokenId = token.id;
                                            formValue.quantity = plg_selectedVariant.variant_qty;
                                            formValue.productName = plg_selectedVariant.product_name;
                                            formValue.variantId = plg_selectedVariant.variant_id;
                                            formValue.variantName = plg_selectedVariant.variant_name;
                                            formValue.variantSku = plg_selectedVariant.variant_sku;
                                            formValue.productPrice = plg_price;
                                            formValue.currencySymbol = "\$\{selected_country[2]\}";
                                            formValue.currencyWord = "\$\{selected_country[3]\}";
                                            /* ===== END product information ===== */
                                            send_post_request('/conekta-charge-customer', formValue, (result, error) => {
                                                if (result) {
                                                    if (result.status === 200) {
                                                        analytics_purchased(\$\{values.fbPurchase\}, formValue.productPrice, formValue.currencyWord, () => {
                                                            formValue.customer_id = result.data.customer_info.customer_id;
                                                            formValue.order_id = result.data.id;
                                                            formValue.forward_to_url = "${return_url}/conekta-orders-initial";
                                                            send_post_request('/funnel-forwarder', formValue, (res, err) => {
                                                                if (!err) {
                                                                    let product_list = [{
                                                                        product_url: window.location.href,
                                                                        product_name: plg_selectedVariant.product_name,
                                                                        variant_name: plg_selectedVariant.variant_name,
                                                                        product_price: parseFloat(plg_price)
                                                                    }];
                                                                    localStorage.setItem("plg_prod_list", JSON.stringify(product_list));
                                                                    localStorage.setItem("plg_conekta", JSON.stringify(formValue));
                                                                    if(document.getElementById('conekta_order_bump')){
                                                                        var sub_orderbump = document.getElementById('conekta_order_bump');
                                                                        console.log(sub_orderbump.checked)
                                                                        if(sub_orderbump){
                                                                            runConektaOrderBump("\$\{values.buttonLink.url\}", "\$\{values.buttonLink.target\}");
                                                                        } else {
                                                                            window.open("\$\{values.buttonLink.url\}","\$\{values.buttonLink.target\}")
                                                                        }
    
                                                                    } else {
                                                                        setTimeout(() => window.open("\$\{values.buttonLink.url\}","\$\{values.buttonLink.target\}"), 3000)
                                                                    }
                                                                    
                                                                } else {
                                                                    clearCardInformation();
                                                                    toggle_loading();
                                                                    alert("An error has occured.");
                                                                }
                                                            });
                                                        });
                                                    } else {
                                                        clearCardInformation();
                                                        toggle_loading();
                                                        alert("Error: " + result.message);
                                                    }
                                                } else {
                                                    clearCardInformation();
                                                    toggle_loading();
                                                    alert( "An error has occurred: " + error);
                                                }
                                            });
                                        }

                                        function conektaError(response) {
                                            clearCardInformation();
                                            toggle_loading();
                                            alert(response.message_to_purchaser);
                                        }

                                        function clearCardInformation(){
                                            form.querySelector("[name='cardNumber']").value = "";
                                            form.querySelector("[name='expiry']").value = "";
                                            form.querySelector("[name='cardCode']").value = "";
                                        }
                                        // End Conekta FE Function

                                        fe_user_id = ${this.fe_user_id}
                                        send_post_request = ${this.send_post_request}
                                        toggle_loading = ${this.toggle_loading}
                                        analytics_add_to_cart = ${this.analytics_add_to_cart}
                                        analytics_purchased = ${this.analytics_purchased}
                                    })();
                                </script>
                            \`;
                        }
                    }
                }
            });
        `;
    },
    getUpsellDownsellConekta: function () {
        return `
            console.log("2. Initializing Editor Tools --> Conekta Upsell...");
            unlayer.registerTool({
                type: 'conekta-form-upsell',
                category: 'contents',
                label: 'Conekta Upsell',
                icon: '<svg class="svg-inline--fa fa-wpforms fa-w-14 fa-3x" viewBox="0 0 60 50"><g><path d=" M 48.049 35.661 C 48.049 35.661 48.194 32.873 46.164 32.873 C 44.14 32.873 42.536 36.736 36.728 41.188 C 31.612 45.109 29.242 46.278 25.072 47.959 C 25.072 47.959 26.52 48.919 37.236 48.919 C 44.341 48.919 48.049 48.786 48.049 35.661 Z  M 48.049 24.34 C 48.049 24.34 48.194 27.127 46.164 27.127 C 44.14 27.127 42.536 23.264 36.728 18.812 C 31.612 14.891 29.242 13.723 25.072 12.041 C 25.072 12.041 26.52 11.081 37.236 11.081 C 44.341 11.081 48.049 11.215 48.049 24.34 Z  M 30.744 20.392 C 26.957 18.01 24.575 16.815 21.628 15.785 C 20.145 15.418 18.577 15.812 17.444 16.837 C 13.949 20.328 11.973 25.059 11.949 30 C 11.974 34.94 13.949 39.671 17.444 43.163 C 18.577 44.186 20.145 44.582 21.628 44.216 C 24.575 43.186 26.957 41.99 30.744 39.609 C 29.839 36.184 29.526 32.888 29.511 30.001 C 29.526 27.112 29.839 23.817 30.744 20.392 Z " fill-rule="evenodd" fill="rgb(255,255,255)"/></g></svg>',
                values: {},
                options: {
                    conekta_upsell_product: {
                        title: "Product",
                        position: 1,
                        options: ${this.config_normal_upsell()}
                    },
                    conekta_upsell_button: {
                        title: "Button",
                        position: 2,
                        options: ${this.config_button("fbInitiate,braintreeToken")}
                    },
                    conekta_upsell_confirmation: {
                        title: "Confirmation",
                        position: 3,
                        options: ${this.config_confirmation()}
                    }
                },
                renderer: {
                    Viewer: unlayer.createViewer({
                        render(values) {
                            let button_style = btnStyleFn(values);
                            let selected_variant = values.variant ? JSON.parse(values.variant).variants[0] : null;
                            if (!selected_variant) return \`<h3 style="text-align: center; margin: 0;">Please Setup Upsell Product</h3>\`;
                            return \`
                                \$\{button_style\}
                                <button class="\$\{values.animation\}">
                                    \$\{values.text\}
                                    <div class="subtext">\$\{values.subText\}</div>
                                </button>
                            \`;
                        }
                    }),
                    exporters: {
                        web: function(values) {
                            let button_style = btnStyleFn(values);
                            let selected_variant = values.variant ? JSON.parse(values.variant).variants[0] : null;
                            if (!selected_variant) return \`<h3 style="text-align: center; margin: 0;">Please Setup Upsell Product</h3>\`;
                            return \`
                                \$\{button_style\}
                                <button class = "\$\{values.animation\} upsell_button"
                                    data-parentid = "\$\{values._meta.htmlID\}"
                                    data-link = "\$\{values.buttonLink.url\}"
                                    data-target = "\$\{values.buttonLink.target\}"
                                    data-qty = "\$\{selected_variant.quantity\}";
                                    data-productname = "\$\{values.productName\}"
                                    data-shopifyid = "\$\{selected_variant.id\}";
                                    data-variantname = "\$\{selected_variant.name\}";
                                    data-price = "\$\{selected_variant.price\}";
                                    data-sku = "\$\{selected_variant.sku || ""\}";
                                    data-trackaddtocart = "\$\{values.fbTrack\}"
                                    data-trackpurchased = "\$\{values.fbPurchase\}"
                                    data-useconfirmation = "\$\{values.use_confirmation\}"
                                    data-header = "\$\{values.header\}"
                                    data-ptext = "\$\{values.positive_button\}"
                                    data-ntext = "\$\{values.negative_button\}"
                                    onclick = "normal_upsell_downsell(this)"
                                >
                                    \$\{values.text\}
                                    <div class="subtext">\$\{values.subText\}</div>
                                </button>
                                <script>
                                    function normal_upsell_downsell(element) {
                                        if (localStorage.getItem("plg_conekta")) {
                                            let shopify_id = element.getAttribute('data-shopifyid');
                                            let quantity = element.getAttribute('data-qty');
                                            let product_name = element.getAttribute('data-productname')
                                            let variant_name = element.getAttribute('data-variantname');
                                            let price = element.getAttribute('data-price');
                                            let sku = element.getAttribute('data-sku');
                                            let track_add_to_cart = element.getAttribute('data-trackaddtocart') === "true";
                                            let track_purchased = element.getAttribute('data-trackpurchased') === "true";
                                            let redirect_link = element.getAttribute('data-link');
                                            let redirect_target = element.getAttribute('data-target');
                                            analytics_add_to_cart(track_add_to_cart);
                                            normal_upsell_downsell_toggle_confirmation(element, () => {
                                                let checkout_info = JSON.parse(localStorage.getItem("plg_conekta"));
                                                // start product information
                                                checkout_info.source_link = window.location.href;
                                                checkout_info.quantity = quantity;
                                                checkout_info.productName = product_name;
                                                checkout_info.variantId = shopify_id;
                                                checkout_info.variantName = variant_name;
                                                checkout_info.variantSku = sku;
                                                checkout_info.productPrice = parseFloat(price);
                                                // end product information
                                                toggle_loading();
                                                send_post_request('/conekta-charge-customer', checkout_info, (result, error) => {
                                                    if (result) {
                                                        if (result.status === 200) {
                                                            analytics_purchased(track_purchased, checkout_info.productPrice, checkout_info.currencyWord, () => {
                                                                checkout_info.order_id = result.data.id;
                                                                checkout_info.forward_to_url = "${return_url}/conekta-orders-initial";
                                                                send_post_request('/funnel-forwarder', checkout_info, (res, err) => {
                                                                    if (!err) {
                                                                        let product_list = JSON.parse(localStorage.getItem("plg_prod_list"));
                                                                        product_list.push({
                                                                            product_url: window.location.href,
                                                                            product_name,
                                                                            variant_name,
                                                                            product_price: parseFloat(price)
                                                                        });
                                                                        localStorage.setItem("plg_prod_list", JSON.stringify(product_list));
                                                                        window.open("\$\{values.buttonLink.url\}", "\$\{values.buttonLink.target\}");
                                                                    } else {
                                                                        toggle_loading();
                                                                        alert("An error has occured.");
                                                                    }
                                                                });
                                                            });
                                                        } else {
                                                            toggle_loading();
                                                            alert("Error: " + result.message);
                                                        }
                                                    } else {
                                                        toggle_loading();
                                                        alert( "An error has occurred: " + error);
                                                    }
                                                });
                                            });
                                        } else {
                                            alert("Did not go through checkout.");
                                        }
                                    }
                                    function normal_upsell_downsell_toggle_confirmation(element, callback) {
                                        window.callback = callback;
                                        let use_confirmation = element.getAttribute('data-useconfirmation') === "true";
                                        let header = element.getAttribute('data-header');
                                        let positive_text = element.getAttribute('data-ptext');
                                        let negative_text = element.getAttribute('data-ntext');
                                        if(use_confirmation) {
                                            if(document.getElementById("upsell_confirmation")){
                                                close_upsell_downsell_confirmation();
                                            } else {
                                                let confirmation = \\\`
                                                    <style>
                                                        #upsell_confirmation button { border-radius: 5px; font-size: 20px; padding: 10px; cursor: pointer; border: none; }
                                                        #upsell_confirmation button.positive-button { color: #ffffff; background-color: #26c686; }
                                                        #upsell_confirmation button.positive-button:hover { background-color: #2a92bf; }
                                                        #upsell_confirmation button.negative-button { color: #ffffff; background-color: #d33b22; }
                                                        #upsell_confirmation button.negative-button:hover { background-color: #c87668; }
                                                    </style>
                                                    <div style="position: fixed; width: 100%; height: 100vh; overflow: scroll; z-index: 9999; top: 0; left: 0;">
                                                        <div style="align-items: center; display: flex; flex-direction: column; margin: auto; min-height: 100%; justify-content: center; background-color: #00000078;">
                                                            <div style="padding: 20px; background-color: #ffffff;">
                                                                <h1 style="margin: 0 0 10px;">\\\$\\\{header\\\}</h1>
                                                                <div style="display: flex; flex-flow: row wrap; -webkit-flex-flow: row wrap; justify-content: space-around;">
                                                                    <button class="positive-button" style="width: 48%; margin: 0 1%;" onclick="close_upsell_downsell_confirmation(); window.callback();">\\\$\\\{positive_text\\\}</button>
                                                                    <button class="negative-button" style="width: 48%; margin: 0 1%;" onclick="close_upsell_downsell_confirmation()">\\\$\\\{negative_text\\\}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                \\\`;
                                                var div = document.createElement("div");
                                                div.id = "upsell_confirmation";
                                                div.innerHTML = confirmation;
                                                document.body.appendChild(div);
                                            }
                                        } else {
                                            callback();
                                        }
                                    }
                                    send_post_request = ${this.send_post_request}
                                    analytics_add_to_cart = ${this.analytics_add_to_cart}
                                    analytics_purchased = ${this.analytics_purchased}
                                    toggle_loading = ${this.toggle_loading}
                                    close_upsell_downsell_confirmation = ${this.close_upsell_downsell_confirmation}
                                </script>
                            \`;
                        }
                    }
                }
            });
        `;
    },
    getCheckoutConektaSubscription: function(user_id, funnel_id, funnel_snapchat_id, public_key, private_key){
        return `
            function translateIntervalFn(interval) {
                if (interval === "minute"){
                    return "Minutes";
                } else if(interval === "week") {
                    return "Weekly";
                } else if(interval === "half_month") {
                    return "Biweekly";
                } else if(interval === "month") {
                    return "Monthly";
                } else if(interval === "year") {
                    return "Annual";
                }
            }
            console.log("3. Initializing Editor Tools --> Conekta Subscription Checkout...");
            unlayer.registerTool({
                type: 'conekta-form-subscription',
                category: 'contents',
                label: 'Subscription',
                icon: '<svg class="svg-inline--fa fa-3x" viewBox="0 0 60 11.8" width="60pt"><g><path d=" M 23.315 3.273 C 22.312 3.273 21.602 3.705 21.207 4.248 L 21.042 4.248 L 21.042 3.48 L 18.636 3.48 L 18.636 11.909 L 21.042 11.909 L 21.042 7.015 C 21.042 6.167 21.653 5.528 22.526 5.528 C 23.366 5.528 23.959 6.152 23.959 7 L 23.959 11.909 L 26.364 11.909 L 26.364 6.248 C 26.364 4.6 25.146 3.273 23.315 3.273 Z  M 13.872 9.74 C 12.67 9.74 11.823 8.819 11.823 7.599 C 11.823 6.365 12.67 5.444 13.872 5.444 C 15.071 5.444 15.903 6.365 15.903 7.599 C 15.903 8.819 15.071 9.74 13.872 9.74 Z  M 13.872 3.273 C 11.345 3.273 9.545 5.147 9.545 7.599 C 9.545 10.034 11.33 11.909 13.872 11.909 C 16.395 11.909 18.182 10.034 18.182 7.599 C 18.182 5.163 16.411 3.273 13.872 3.273 Z  M 4.456 5.444 C 5.448 5.444 6.217 5.99 6.473 6.927 L 8.636 6.396 C 8.092 4.334 6.442 3.273 4.391 3.273 C 1.732 3.273 0 5.194 0 7.599 C 0 9.972 1.732 11.909 4.391 11.909 C 6.442 11.909 8.108 10.862 8.636 8.818 L 6.458 8.301 C 6.201 9.209 5.448 9.739 4.456 9.739 C 3.189 9.739 2.371 8.802 2.371 7.599 C 2.371 6.38 3.173 5.444 4.456 5.444 Z  M 53.99 9.723 C 52.858 9.723 51.938 8.895 51.938 7.599 C 51.938 6.302 52.842 5.475 53.974 5.475 C 55.088 5.475 56.025 6.24 56.025 7.599 C 56.025 8.755 55.218 9.723 53.99 9.723 L 53.99 9.723 Z  M 58.739 9.801 C 58.514 9.801 58.353 9.676 58.353 9.458 L 58.353 3.475 L 55.992 3.475 L 55.992 4.24 L 55.814 4.24 C 55.315 3.679 54.539 3.273 53.456 3.273 C 51.274 3.273 49.545 5.099 49.545 7.583 C 49.545 10.05 51.291 11.909 53.472 11.909 C 54.701 11.909 55.379 11.455 55.831 10.832 L 56.01 10.832 C 56.01 11.301 56.397 11.707 56.945 11.707 L 60 11.707 L 60 9.801 L 58.739 9.801 Z  M 47.294 1.336 L 45.107 1.336 L 45.107 3.605 L 43.58 3.605 L 43.548 3.605 L 40.798 3.605 L 38.965 6.394 L 38.258 6.394 L 38.258 0.091 L 35.909 0.091 L 35.909 11.909 L 38.258 11.909 L 38.258 8.506 L 39.012 8.506 L 40.91 11.909 L 43.708 11.909 L 40.992 7.482 L 40.992 7.308 L 42.159 5.637 L 44.947 5.637 L 44.947 9.341 C 44.947 11.152 45.895 11.909 47.6 11.909 L 49.448 11.909 L 49.448 9.845 L 47.826 9.845 C 47.439 9.845 47.294 9.686 47.294 9.325 L 47.294 5.637 L 49.545 5.637 L 49.545 3.605 L 47.294 3.605 L 47.294 1.336 Z  M 29.27 6.646 C 29.384 5.913 30.082 5.163 31.185 5.163 C 32.191 5.163 32.955 5.818 33.069 6.646 L 29.27 6.646 Z  M 31.185 3.273 C 28.798 3.273 26.818 5.021 26.818 7.599 C 26.818 10.083 28.637 11.909 31.251 11.909 C 32.906 11.909 34.562 11.223 35.179 9.38 L 33.069 8.91 C 32.743 9.597 31.997 9.895 31.217 9.895 C 30.098 9.895 29.27 9.24 29.254 8.161 L 35.455 8.161 L 35.455 7.583 C 35.455 5.147 33.815 3.273 31.185 3.273 L 31.185 3.273 Z " fill-rule="evenodd" fill="rgb(255,255,255)"></path></g></svg>',
                values: {},
                options: {
                    conekta_s_products: {
                        title: "Products",
                        position: 1,
                        options: ${this.config_subscription_product("subscription_list")}
                    },
                    conekta_s_button: {
                        title: "Button",
                        position: 1,
                        options: ${this.config_button("braintreeToken")}
                    },
                    conekta_s_form: {
                        title: "Form",
                        position: 1,
                        options: ${this.config_non_cod_form("testMode")}
                    }
                },
                renderer: {
                    Viewer: unlayer.createViewer({
                        render(values) {
                            let form_style = formStyleFn(values);
                            let input_style = inputStyleFn(values);
                            let button_style = btnStyleFn(values);
                            let subscription_style = subscriptionStyleFn(values);
                            let selected_country = JSON.parse(values.selected_country).selected.split(",");
                            let plan_list = values.conekta_subscription_list ? JSON.parse(values.conekta_subscription_list).filter(e => e.currency === selected_country[3]) : "";
                            if (!plan_list || (plan_list && plan_list.length === 0)) return \`<h3 style="text-align: center; margin: 0;">Please select in your plan list</h3>\`;
                            return \`
                                \$\{form_style\}
                                \$\{input_style\}
                                \$\{button_style\}
                                \$\{subscription_style\}
                                <h3 style="margin: 0 0 5px;">\$\{values.subscription_header\}</h3>
                                <div class="subscription-product">
                                    \$\{plan_list.map((el, i) => {
                                        return \`
                                            \$\{i !== 0 ? "<div class='border-left'></div>" : ""\}
                                            <div class="subscription-container">
                                                <div class="subscription-price">
                                                    <p><sup>$</sup>\$\{el.price || 0\}</p>
                                                </div>
                                                <p class="frequent">\$\{translateIntervalFn(el.interval)\}</p>
                                                <p class="frequent-desc">\$\{el.name\}</p>
                                                <button class="subs-btn" style="font-size: \$\{values.subscription_button_size\}; padding: \$\{values.subscription_button_padding\}; width: \$\{values.subscription_button_width\};" \$\{el.selected ? "disabled" : ""\}>\$\{values.subscription_button_text\}</button>
                                            </div>
                                        \`;
                                    }).join("")\}
                                </div>
                                <div class="conekta-form-subscription">
                                    <div class="form-container">
                                        <form id="paymentForm" class="payment-form" style="display: inline-block; width: 100%;">
                                            <div class="card-wrapper"></div>
                                            <h3 style="margin: 0 0 5px;">\$\{values.formHeader\}</h3>
                                            <div class="half-left">
                                                <input type="text" name="firstName" placeholder="\$\{values.firstName\}" required />
                                            </div>
                                            <div class="half-right">
                                                <input type="text" name="lastName" placeholder="\$\{values.lastName\}" required />
                                            </div>
                                            <input type="text" name="phone" placeholder="\$\{values.phone\}">
                                            <input type="email" name="email" autocomplete="on" maxlength="40" placeholder="\$\{values.email\}" required />
                                            <input type="text" name="address" autocomplete="on" maxlength="45" placeholder="\$\{values.address\}" required />
                                            <input type="text" name="city" autocomplete="on" maxlength="45" placeholder="\$\{values.city\}" required />
                                            <input type="text" name="zipcode" autocomplete="on" pattern="[0-9]*" maxlength="5" placeholder="\$\{values.zipcode\}" required />
                                            <input type="text" name="state" autocomplete="on" placeholder="\$\{values.state\}" required />
                                            <input type="hidden" name="country" value="\$\{selected_country[1]\}" required />
                                            <h3 style="margin: 0 0 5px;">\$\{values.creditCard\}</h3>
                                            <input type="text" name="cardNumber" placeholder="Card Number" required />
                                            <div class="half-left">
                                                <input type="text" name="expiry" placeholder="MM / YYYY" required />
                                            </div>
                                            <div class="half-right">
                                                <input type="text" name="cardCode" placeholder="CCV" required />
                                            </div>
                                            <button class="\$\{values.animation\}" type="submit">
                                                \$\{values.text\}
                                                <div class="subtext">\$\{values.subText\}</div>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            \`;
                        }
                    }),
                    exporters: {
                        web: function(values) {
                            let form_style = formStyleFn(values);
                            let input_style = inputStyleFn(values);
                            let button_style = btnStyleFn(values);
                            let subscription_style = subscriptionStyleFn(values);
                            let selected_country = JSON.parse(values.selected_country).selected.split(",");
                            let plan_list = values.conekta_subscription_list ? JSON.parse(values.conekta_subscription_list).filter(e => e.currency === selected_country[3]) : "";
                            let plan_selected = plan_list ? plan_list.filter(e => e.selected)[0] : null;
                            if (!plan_list || (plan_list && plan_list.length === 0)) return \`<h3 style="text-align: center; margin: 0;">Please select in your plan list</h3>\`;
                            return \`
                                \$\{form_style\}
                                \$\{input_style\}
                                \$\{button_style\}
                                \$\{subscription_style\}
                                <h3 style="margin: 0 0 5px;">\$\{values.subscription_header\}</h3>
                                <div class="subscription-product">
                                    \$\{plan_list.map((el, i) => {
                                        return \`
                                            \$\{i !== 0 ? "<div class='border-left'></div>" : ""\}
                                            <div class="subscription-container">
                                                <div class="subscription-price">
                                                    <p><sup>$</sup>\$\{el.price || 0\}</p>
                                                </div>
                                                <p class="frequent">\$\{translateIntervalFn(el.interval)\}</p>
                                                <p class="frequent-desc">\$\{el.name\}</p>
                                                <button class="subs-btn" style="font-size: \$\{values.subscription_button_size\}; padding: \$\{values.subscription_button_padding\}; width: \$\{values.subscription_button_width\};" \$\{el.selected ? "disabled" : ""\}
                                                    data-conektaid = "\$\{el.id\}"
                                                    data-productname = "\$\{el.name\}"
                                                    data-variantname = "\$\{el.frequency + " - " + el.interval\}"
                                                    data-price = "\$\{el.price\}"
                                                    data-shopifySubID = "\$\{el.shopifySubID\}"
                                                >\$\{values.subscription_button_text\}</button>
                                            </div>
                                        \`;
                                    }).join("")\}
                                </div>
                                <div class="conekta-form-subscription">
                                    <div class="form-container">
                                        <form id="paymentForm" class="payment-form" style="display: inline-block; width: 100%;">
                                            <div class="card-wrapper"></div>
                                            <h3 style="margin: 0 0 5px;">\$\{values.formHeader\}</h3>
                                            <div class="half-left">
                                                <input type="text" name="firstName" placeholder="\$\{values.firstName\}" required />
                                            </div>
                                            <div class="half-right">
                                                <input type="text" name="lastName" placeholder="\$\{values.lastName\}" required />
                                            </div>
                                            <input type="text" name="phone" placeholder="\$\{values.phone\}">
                                            <input type="email" name="email" autocomplete="on" maxlength="40" placeholder="\$\{values.email\}" required />
                                            <input type="text" name="address" autocomplete="on" maxlength="45" placeholder="\$\{values.address\}" required />
                                            <input type="text" name="city" autocomplete="on" maxlength="45" placeholder="\$\{values.city\}" required />
                                            <input type="text" name="zipcode" autocomplete="on" pattern="[0-9]*" maxlength="5" placeholder="\$\{values.zipcode\}" required />
                                            <input type="text" name="state" autocomplete="on" placeholder="\$\{values.state\}" required />
                                            <input type="hidden" name="country" value="\$\{selected_country[1]\}" required />
                                            <h3 style="margin: 0 0 5px;">\$\{values.creditCard\}</h3>
                                            <input type="text" name="cardNumber" placeholder="Card Number" required />
                                            <div class="half-left">
                                                <input type="text" name="expiry" placeholder="MM / YYYY" required />
                                            </div>
                                            <div class="half-right">
                                                <input type="text" name="cardCode" placeholder="CCV" required />
                                            </div>
                                            <button class="\$\{values.animation\}" type="submit">
                                                \$\{values.text\}
                                                <div class="subtext">\$\{values.subText\}</div>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <script src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/121761/card.js"></script>
                                <script type="text/javascript" src="https://cdn.conekta.io/js/latest/conekta.js"></script>
                                <script>
                                    let plg_price = \$\{plan_selected ? plan_selected.price : 0\};
                                    let plg_selectedVariant = \$\{plan_selected ? JSON.stringify({ conekta_id: plan_selected.id, variant_name: plan_selected.frequency + " - " + plan_selected.interval, product_name: plan_selected.name, variant_qty: 1, price: plan_selected.price.toString(), tags: [], variant_id: "", variant_sku: "" }) : {}\};
                                    (() => {
                                        // analytics_initiate_checkout("${funnel_snapchat_id}", \$\{values.fbInitiate\}, "\$\{values._meta.htmlID\}", "[name='firstName'],[name='lastName'],[name='email']");
                                        
                                        localStorage.removeItem("plg_conekta");
                                        localStorage.removeItem("plg_prod_list");
                                        localStorage.removeItem("plg_prod_thankyou_list");

                                        let container = document.getElementById("\$\{values._meta.htmlID\}");
                                        let form = container.querySelector("form");
                                        let buttons = container.querySelectorAll(".subscription-product button");
                                        let form_to_object = form => Array.from(new FormData(form)).reduce((acc, [key, value]) => ({...acc,[key]: value}),{});
                                        
                                        let card = new Card({
                                            form: '#\$\{values._meta.htmlID\} #paymentForm',
                                            container: '.card-wrapper',
                                            formSelectors: { numberInput: 'input[name="cardNumber"]', expiryInput: 'input[name="expiry"]', cvcInput: 'input[name="cardCode"]', nameInput: 'input[name="firstName"], input[name="lastName"]' },
                                            width: 200,
                                            formatting: true,
                                            messages: { validDate: 'valid date', monthYear: 'mm/yyyy' },
                                            placeholders: { number: '•••• •••• •••• ••••', name: 'Full Name', expiry: '••/••', cvc: '•••' },
                                            masks: { cardNumber: '•' },
                                            debug: false
                                        });

                                        buttons.forEach(el => {
                                            el.onclick = () => {
                                                let disable_btn = container.querySelector("button:disabled");
                                                if (disable_btn) disable_btn.disabled = false;
                                                el.disabled = true;
                                                /* start for order data */
                                                plg_price = parseFloat(el.getAttribute("data-price"));
                                                plg_selectedVariant = {
                                                    tags: [], variant_id: "", variant_sku: "",
                                                    conekta_id: el.getAttribute("data-conektaid"),
                                                    variant_name: el.getAttribute("data-variantname"),
                                                    product_name: el.getAttribute("data-productname"),
                                                    variant_qty: 1,
                                                    price: plg_price.toString()
                                                }
                                                /* end for order data */
                                            };
                                        });

                                        // Start Conekta FE Function
                                        Conekta.setPublicKey("${public_key}");
                                        Conekta.setLanguage("\$\{selected_country[0]\}");

                                        form.onsubmit = event => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            let formValue = form_to_object(form);
                                            if(!plg_price) {
                                                alert("Please select subscription");
                                            } else {
                                                toggle_loading();
                                                analytics_add_to_cart(\$\{values.fbTrack\});
                                                let params = {
                                                    "card": {
                                                        "number": formValue.cardNumber,
                                                        "name": formValue.firstName + " " + formValue.lastName,
                                                        "exp_month": formValue.expiry.split("/")[0].trim(),
                                                        "exp_year": formValue.expiry.split("/")[1].trim(),
                                                        "cvc": formValue.cardCode
                                                    }
                                                };
                                                Conekta.Token.create(params, conektaSuccess, conektaError);
                                            }
                                        }

                                        function conektaSuccess(token) {
                                            clearCardInformation();
                                            let formValue = form_to_object(form);
                                            delete formValue.card_name; delete formValue.card_number; delete formValue.exp_month; delete formValue.exp_year; delete formValue.cvc;
                                            /* ===== START plg required information ===== */
                                            formValue.source_link = window.location.href;
                                            formValue.customerID = fe_user_id("conekta_");
                                            formValue.metadata = { meta: "${encryptString(user_id)}", pageid: "${funnel_id}" };
                                            // formValue.orderType = "subscription";
                                            /* ===== END plg required information & START product information ===== */
                                            formValue.conektaPK = "${private_key}";
                                            formValue.conektaPLanId = plg_selectedVariant.conekta_id;
                                            formValue.conektaTokenId = token.id;
                                            formValue.quantity = plg_selectedVariant.variant_qty;
                                            formValue.productName = plg_selectedVariant.product_name;
                                            formValue.variantId = plg_selectedVariant.variant_id;
                                            formValue.variantName = plg_selectedVariant.variant_name;
                                            formValue.variantSku = plg_selectedVariant.variant_sku;
                                            formValue.productPrice = plg_price;
                                            formValue.currencySymbol = "\$\{selected_country[2]\}";
                                            formValue.currencyWord = "\$\{selected_country[3]\}";
                                            /* ===== END product information ===== */
                                            // start process to send data to servers
                                            send_post_request('/conekta-customer-subscription', formValue, (result, error) => {
                                                if (result) {
                                                    if (result.status === 200) {
                                                        analytics_purchased(\$\{values.fbPurchase\}, formValue.productPrice, formValue.currencyWord, () => {
                                                            formValue.customer_id = result.data.customer_info.customer_id;
                                                            formValue.order_id = result.data.id;
                                                            formValue.forward_to_url = "${return_url}/conekta-orders-initial";
                                                            send_post_request('/funnel-forwarder', formValue, (res, err) => {
                                                                if (!err) {
                                                                    let product_list = [{
                                                                        product_url: window.location.href,
                                                                        product_name: plg_selectedVariant.product_name,
                                                                        variant_name: plg_selectedVariant.variant_name,
                                                                        product_price: parseFloat(plg_price)
                                                                    }];
                                                                    localStorage.setItem("plg_prod_list", JSON.stringify(product_list));
                                                                    localStorage.setItem("plg_conekta", JSON.stringify(formValue));
                                                                    
                                                                    if(document.getElementById('conekta_order_bump')){
                                                                        var sub_orderbump = document.getElementById('conekta_order_bump');
                                                                        console.log(sub_orderbump.checked)
                                                                        if(sub_orderbump){
                                                                            runConektaOrderBump("\$\{values.buttonLink.url\}", "\$\{values.buttonLink.target\}");
                                                                        } else {
                                                                            window.open("\$\{values.buttonLink.url\}","\$\{values.buttonLink.target\}")
                                                                        }
    
                                                                    } else {
                                                                        window.open("\$\{values.buttonLink.url\}","\$\{values.buttonLink.target\}")
                                                                    }
                                                                } else {
                                                                    clearCardInformation();
                                                                    toggle_loading();
                                                                    alert("An error has occured.");
                                                                }
                                                            });
                                                        });
                                                    } else {
                                                        clearCardInformation();
                                                        toggle_loading();
                                                        alert("Error: " + result.message);
                                                    }
                                                } else {
                                                    clearCardInformation();
                                                    toggle_loading();
                                                    alert( "An error has occurred: " + error);
                                                }
                                            });
                                            // end process to send data to servers
                                        }

                                        function conektaError(response) {
                                            clearCardInformation();
                                            toggle_loading();
                                            alert(response.message_to_purchaser);
                                        }

                                        function clearCardInformation(){
                                            form.querySelector("[name='cardNumber']").value = "";
                                            form.querySelector("[name='expiry']").value = "";
                                            form.querySelector("[name='cardCode']").value = "";
                                        }
                                        // End Conekta FE Function

                                        fe_user_id = ${this.fe_user_id}
                                        send_post_request = ${this.send_post_request}
                                        toggle_loading = ${this.toggle_loading}
                                        analytics_initiate_checkout = ${this.analytics_initiate_checkout}
                                        analytics_add_to_cart = ${this.analytics_add_to_cart}
                                        analytics_purchased = ${this.analytics_purchased}
                                    })()
                                </script>
                            \`;
                        }
                    }
                }
            });
        `;
    },
    getUpsellDownsellConektaSubscription: function(user_id, funnel_id, funnel_snapchat_id, public_key, private_key){
        return `
            console.log("4. Initializing Editor Tools --> Conekta Subscription Upsell...");
            unlayer.registerTool({
                type: 'conekta-form-subscription-upsell',
                category: 'contents',
                label: 'Upsell subscription',
                icon: '<svg class="svg-inline--fa fa-3x" viewBox="0 0 60 11.8" width="60pt"><g><path d=" M 23.315 3.273 C 22.312 3.273 21.602 3.705 21.207 4.248 L 21.042 4.248 L 21.042 3.48 L 18.636 3.48 L 18.636 11.909 L 21.042 11.909 L 21.042 7.015 C 21.042 6.167 21.653 5.528 22.526 5.528 C 23.366 5.528 23.959 6.152 23.959 7 L 23.959 11.909 L 26.364 11.909 L 26.364 6.248 C 26.364 4.6 25.146 3.273 23.315 3.273 Z  M 13.872 9.74 C 12.67 9.74 11.823 8.819 11.823 7.599 C 11.823 6.365 12.67 5.444 13.872 5.444 C 15.071 5.444 15.903 6.365 15.903 7.599 C 15.903 8.819 15.071 9.74 13.872 9.74 Z  M 13.872 3.273 C 11.345 3.273 9.545 5.147 9.545 7.599 C 9.545 10.034 11.33 11.909 13.872 11.909 C 16.395 11.909 18.182 10.034 18.182 7.599 C 18.182 5.163 16.411 3.273 13.872 3.273 Z  M 4.456 5.444 C 5.448 5.444 6.217 5.99 6.473 6.927 L 8.636 6.396 C 8.092 4.334 6.442 3.273 4.391 3.273 C 1.732 3.273 0 5.194 0 7.599 C 0 9.972 1.732 11.909 4.391 11.909 C 6.442 11.909 8.108 10.862 8.636 8.818 L 6.458 8.301 C 6.201 9.209 5.448 9.739 4.456 9.739 C 3.189 9.739 2.371 8.802 2.371 7.599 C 2.371 6.38 3.173 5.444 4.456 5.444 Z  M 53.99 9.723 C 52.858 9.723 51.938 8.895 51.938 7.599 C 51.938 6.302 52.842 5.475 53.974 5.475 C 55.088 5.475 56.025 6.24 56.025 7.599 C 56.025 8.755 55.218 9.723 53.99 9.723 L 53.99 9.723 Z  M 58.739 9.801 C 58.514 9.801 58.353 9.676 58.353 9.458 L 58.353 3.475 L 55.992 3.475 L 55.992 4.24 L 55.814 4.24 C 55.315 3.679 54.539 3.273 53.456 3.273 C 51.274 3.273 49.545 5.099 49.545 7.583 C 49.545 10.05 51.291 11.909 53.472 11.909 C 54.701 11.909 55.379 11.455 55.831 10.832 L 56.01 10.832 C 56.01 11.301 56.397 11.707 56.945 11.707 L 60 11.707 L 60 9.801 L 58.739 9.801 Z  M 47.294 1.336 L 45.107 1.336 L 45.107 3.605 L 43.58 3.605 L 43.548 3.605 L 40.798 3.605 L 38.965 6.394 L 38.258 6.394 L 38.258 0.091 L 35.909 0.091 L 35.909 11.909 L 38.258 11.909 L 38.258 8.506 L 39.012 8.506 L 40.91 11.909 L 43.708 11.909 L 40.992 7.482 L 40.992 7.308 L 42.159 5.637 L 44.947 5.637 L 44.947 9.341 C 44.947 11.152 45.895 11.909 47.6 11.909 L 49.448 11.909 L 49.448 9.845 L 47.826 9.845 C 47.439 9.845 47.294 9.686 47.294 9.325 L 47.294 5.637 L 49.545 5.637 L 49.545 3.605 L 47.294 3.605 L 47.294 1.336 Z  M 29.27 6.646 C 29.384 5.913 30.082 5.163 31.185 5.163 C 32.191 5.163 32.955 5.818 33.069 6.646 L 29.27 6.646 Z  M 31.185 3.273 C 28.798 3.273 26.818 5.021 26.818 7.599 C 26.818 10.083 28.637 11.909 31.251 11.909 C 32.906 11.909 34.562 11.223 35.179 9.38 L 33.069 8.91 C 32.743 9.597 31.997 9.895 31.217 9.895 C 30.098 9.895 29.27 9.24 29.254 8.161 L 35.455 8.161 L 35.455 7.583 C 35.455 5.147 33.815 3.273 31.185 3.273 L 31.185 3.273 Z " fill-rule="evenodd" fill="rgb(255,255,255)"></path></g></svg>',
                values: {},
                options: {
                    conekta_s_product: {
                        title: "Product",
                        position: 1,
                        options: ${this.config_subscription_product("subscription_header,subscription_list,subscription_button_text,subscription_button_size,subscription_button_padding,subscription_button_width")}
                    },
                    conekta_s_button: {
                        title: "Button",
                        position: 2,
                        options: ${this.config_button("fbInitiate,braintreeToken")}
                    },
                    conekta_s_confirmation: {
                        title: "Confirmation",
                        position: 3,
                        options: ${this.config_confirmation()}
                    }
                },
                renderer: {
                    Viewer: unlayer.createViewer({
                        render(values) {
                            let button_style = btnStyleFn(values);
                            let plan_list = values.conekta_subscription_list ? JSON.parse(values.conekta_subscription_list) : "";
                            if (!plan_list || (plan_list && plan_list.length === 0)) return \`<h3 style="text-align: center; margin: 0;">Please select in your plan list</h3>\`;
                            return \`
                                \$\{button_style\}
                                <button class="\$\{values.animation\}">
                                    \$\{values.text\}
                                    <div class="subtext">\$\{values.subText\}</div>
                                </button>
                            \`;
                        }
                    }),
                    exporters: {
                        web: function(values) {
                            let button_style = btnStyleFn(values);
                            let plan_list = values.conekta_subscription_list ? JSON.parse(values.conekta_subscription_list) : "";
                            if (!plan_list || (plan_list && plan_list.length === 0)) return \`<h3 style="text-align: center; margin: 0;">Please select in your plan list</h3>\`;
                            plan_list = plan_list[0]; // get only the first since isa lang nmn lagi laman nito
                            return \`
                                \$\{button_style\}
                                <button class="\$\{values.animation\} upsell_button"
                                    data-parentid = "\$\{values._meta.htmlID\}"
                                    data-link = "\$\{values.buttonLink.url\}"
                                    data-target = "\$\{values.buttonLink.target\}"
                                    data-shopifyid = "\$\{""\}";
                                    data-planid = "\$\{plan_list.id\}"
                                    data-qty = "\$\{1\}";
                                    data-productname = "\$\{plan_list.name\}";
                                    data-variantname = "\$\{plan_list.frequency + " - " + plan_list.interval\}";
                                    data-price = "\$\{plan_list.price\}";
                                    data-sku = "\$\{""\}";
                                    data-trackaddtocart = "\$\{values.fbTrack\}"
                                    data-trackpurchased = "\$\{values.fbPurchase\}"
                                    data-useconfirmation = "\$\{values.use_confirmation\}"
                                    data-header = "\$\{values.header\}"
                                    data-ptext = "\$\{values.positive_button\}"
                                    data-ntext = "\$\{values.negative_button\}"
                                    onclick = "subscription_upsell_downsell(this)"
                                >
                                    \$\{values.text\}
                                    <div class="subtext">\$\{values.subText\}</div>
                                </button>
                                <script>
                                    function subscription_upsell_downsell(element) {
                                        if (localStorage.getItem("plg_conekta")) {
                                            let shopify_id = element.getAttribute('data-shopifyid');
                                            let plan_id = element.getAttribute('data-planid');
                                            let quantity = element.getAttribute('data-qty');
                                            let product_name = element.getAttribute('data-productname')
                                            let variant_name = element.getAttribute('data-variantname');
                                            let price = element.getAttribute('data-price');
                                            let sku = element.getAttribute('data-sku');
                                            let track_add_to_cart = element.getAttribute('data-trackaddtocart') === "true";
                                            let track_purchased = element.getAttribute('data-trackpurchased') === "true";
                                            let redirect_link = element.getAttribute('data-link');
                                            let redirect_target = element.getAttribute('data-target');
                                            analytics_add_to_cart(track_add_to_cart);
                                            subscription_upsell_downsell_toggle_confirmation(element, () => {
                                                let checkout_info = JSON.parse(localStorage.getItem("plg_conekta"));
                                                /* ===== START plg required information ===== */
                                                checkout_info.source_link = window.location.href;
                                                // checkout_info.orderType = "subscription";
                                                /* ===== END plg required information & START product information ===== */
                                                checkout_info.conektaPLanId = plan_id;
                                                checkout_info.quantity = quantity;
                                                checkout_info.productName = product_name;
                                                checkout_info.variantId = shopify_id;
                                                checkout_info.variantName = variant_name;
                                                checkout_info.variantSku = sku;
                                                checkout_info.productPrice = parseFloat(price);
                                                /* ===== END product information ===== */
                                                toggle_loading();
                                                send_post_request('/conekta-customer-subscription', checkout_info, (result, error) => {
                                                    if (result) {
                                                        if (result.status === 200) {
                                                            analytics_purchased(track_purchased, checkout_info.productPrice, checkout_info.currencyWord, () => {
                                                                checkout_info.order_id = result.data.id;
                                                                checkout_info.forward_to_url = "${return_url}/conekta-orders-initial";
                                                                send_post_request('/funnel-forwarder', checkout_info, (res, err) => {
                                                                    if (!err) {
                                                                        let product_list = JSON.parse(localStorage.getItem("plg_prod_list"));
                                                                        product_list.push({
                                                                            product_url: window.location.href,
                                                                            product_name,
                                                                            variant_name,
                                                                            product_price: parseFloat(price)
                                                                        });
                                                                        localStorage.setItem("plg_prod_list", JSON.stringify(product_list));
                                                                        window.open("\$\{values.buttonLink.url\}", "\$\{values.buttonLink.target\}");
                                                                    } else {
                                                                        toggle_loading();
                                                                        alert("An error has occured.");
                                                                    }
                                                                });
                                                            });
                                                        } else {
                                                            toggle_loading();
                                                            alert("Error: " + result.message);
                                                        }
                                                    } else {
                                                        toggle_loading();
                                                        alert( "An error has occurred: " + error);
                                                    }
                                                });
                                            });
                                        } else {
                                            alert("Did not go through checkout.");
                                        }
                                    }
                                    function subscription_upsell_downsell_toggle_confirmation (element, callback) {
                                        window.callback = callback;
                                        let use_confirmation = element.getAttribute('data-useconfirmation') === "true";
                                        let header = element.getAttribute('data-header');
                                        let positive_text = element.getAttribute('data-ptext');
                                        let negative_text = element.getAttribute('data-ntext');
                                        if(use_confirmation) {
                                            if(document.getElementById("upsell_confirmation")){
                                                close_upsell_downsell_confirmation();
                                            } else {
                                                let confirmation = \\\`
                                                    <style>
                                                        #upsell_confirmation button { border-radius: 5px; font-size: 20px; padding: 10px; cursor: pointer; border: none; }
                                                        #upsell_confirmation button.positive-button { color: #ffffff; background-color: #26c686; }
                                                        #upsell_confirmation button.positive-button:hover { background-color: #2a92bf; }
                                                        #upsell_confirmation button.negative-button { color: #ffffff; background-color: #d33b22; }
                                                        #upsell_confirmation button.negative-button:hover { background-color: #c87668; }
                                                    </style>
                                                    <div style="position: fixed; width: 100%; height: 100vh; overflow: scroll; z-index: 9999; top: 0; left: 0;">
                                                        <div style="align-items: center; display: flex; flex-direction: column; margin: auto; min-height: 100%; justify-content: center; background-color: #00000078;">
                                                            <div style="padding: 20px; background-color: #ffffff;">
                                                                <h1 style="margin: 0 0 10px;">\\\$\\\{header\\\}</h1>
                                                                <div style="display: flex; flex-flow: row wrap; -webkit-flex-flow: row wrap; justify-content: space-around;">
                                                                    <button class="positive-button" style="width: 48%; margin: 0 1%;" onclick="close_upsell_downsell_confirmation(); window.callback();">\\\$\\\{positive_text\\\}</button>
                                                                    <button class="negative-button" style="width: 48%; margin: 0 1%;" onclick="close_upsell_downsell_confirmation()">\\\$\\\{negative_text\\\}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                \\\`;
                                                var div = document.createElement("div");
                                                div.id = "upsell_confirmation";
                                                div.innerHTML = confirmation;
                                                document.body.appendChild(div);
                                            }
                                        } else {
                                            callback();
                                        }
                                    }
                                    send_post_request = ${this.send_post_request}
                                    analytics_add_to_cart = ${this.analytics_add_to_cart}
                                    analytics_purchased = ${this.analytics_purchased}
                                    toggle_loading = ${this.toggle_loading}
                                    close_upsell_downsell_confirmation = ${this.close_upsell_downsell_confirmation}
                                </script>
                            \`;
                        }
                    }
                }
            });
        `;
    },   

    // Conekta Bumpsell function
    getBumpSellConektaSubscription: function(user_id, funnel_id, funnel_snapchat_id, public_key, private_key){
        return `
            function translateIntervalFn(interval) {
                if (interval === "minute"){
                    return "Minutes";
                } else if(interval === "week") {
                    return "Weekly";
                } else if(interval === "half_month") {
                    return "Biweekly";
                } else if(interval === "month") {
                    return "Monthly";
                } else if(interval === "year") {
                    return "Annual";
                }
            }
            console.log("3. Initializing Editor Tools --> Conekta Subscription Order Bump...");
            unlayer.registerTool({
                type: 'conekta-bump-subscription',
                category: 'contents',
                label: 'Bump Subscription',
                icon: '<svg class="svg-inline--fa fa-3x" viewBox="0 0 60 11.8" width="60pt"><g><path d=" M 23.315 3.273 C 22.312 3.273 21.602 3.705 21.207 4.248 L 21.042 4.248 L 21.042 3.48 L 18.636 3.48 L 18.636 11.909 L 21.042 11.909 L 21.042 7.015 C 21.042 6.167 21.653 5.528 22.526 5.528 C 23.366 5.528 23.959 6.152 23.959 7 L 23.959 11.909 L 26.364 11.909 L 26.364 6.248 C 26.364 4.6 25.146 3.273 23.315 3.273 Z  M 13.872 9.74 C 12.67 9.74 11.823 8.819 11.823 7.599 C 11.823 6.365 12.67 5.444 13.872 5.444 C 15.071 5.444 15.903 6.365 15.903 7.599 C 15.903 8.819 15.071 9.74 13.872 9.74 Z  M 13.872 3.273 C 11.345 3.273 9.545 5.147 9.545 7.599 C 9.545 10.034 11.33 11.909 13.872 11.909 C 16.395 11.909 18.182 10.034 18.182 7.599 C 18.182 5.163 16.411 3.273 13.872 3.273 Z  M 4.456 5.444 C 5.448 5.444 6.217 5.99 6.473 6.927 L 8.636 6.396 C 8.092 4.334 6.442 3.273 4.391 3.273 C 1.732 3.273 0 5.194 0 7.599 C 0 9.972 1.732 11.909 4.391 11.909 C 6.442 11.909 8.108 10.862 8.636 8.818 L 6.458 8.301 C 6.201 9.209 5.448 9.739 4.456 9.739 C 3.189 9.739 2.371 8.802 2.371 7.599 C 2.371 6.38 3.173 5.444 4.456 5.444 Z  M 53.99 9.723 C 52.858 9.723 51.938 8.895 51.938 7.599 C 51.938 6.302 52.842 5.475 53.974 5.475 C 55.088 5.475 56.025 6.24 56.025 7.599 C 56.025 8.755 55.218 9.723 53.99 9.723 L 53.99 9.723 Z  M 58.739 9.801 C 58.514 9.801 58.353 9.676 58.353 9.458 L 58.353 3.475 L 55.992 3.475 L 55.992 4.24 L 55.814 4.24 C 55.315 3.679 54.539 3.273 53.456 3.273 C 51.274 3.273 49.545 5.099 49.545 7.583 C 49.545 10.05 51.291 11.909 53.472 11.909 C 54.701 11.909 55.379 11.455 55.831 10.832 L 56.01 10.832 C 56.01 11.301 56.397 11.707 56.945 11.707 L 60 11.707 L 60 9.801 L 58.739 9.801 Z  M 47.294 1.336 L 45.107 1.336 L 45.107 3.605 L 43.58 3.605 L 43.548 3.605 L 40.798 3.605 L 38.965 6.394 L 38.258 6.394 L 38.258 0.091 L 35.909 0.091 L 35.909 11.909 L 38.258 11.909 L 38.258 8.506 L 39.012 8.506 L 40.91 11.909 L 43.708 11.909 L 40.992 7.482 L 40.992 7.308 L 42.159 5.637 L 44.947 5.637 L 44.947 9.341 C 44.947 11.152 45.895 11.909 47.6 11.909 L 49.448 11.909 L 49.448 9.845 L 47.826 9.845 C 47.439 9.845 47.294 9.686 47.294 9.325 L 47.294 5.637 L 49.545 5.637 L 49.545 3.605 L 47.294 3.605 L 47.294 1.336 Z  M 29.27 6.646 C 29.384 5.913 30.082 5.163 31.185 5.163 C 32.191 5.163 32.955 5.818 33.069 6.646 L 29.27 6.646 Z  M 31.185 3.273 C 28.798 3.273 26.818 5.021 26.818 7.599 C 26.818 10.083 28.637 11.909 31.251 11.909 C 32.906 11.909 34.562 11.223 35.179 9.38 L 33.069 8.91 C 32.743 9.597 31.997 9.895 31.217 9.895 C 30.098 9.895 29.27 9.24 29.254 8.161 L 35.455 8.161 L 35.455 7.583 C 35.455 5.147 33.815 3.273 31.185 3.273 L 31.185 3.273 Z " fill-rule="evenodd" fill="rgb(255,255,255)"></path></g></svg>',
                values: {},
                options: {
                    conekta_s_products: {
                        title: "Products",
                        position: 1,
                        options: ${this.config_subscription_product("subscription_list,subscription_button_text,subscription_header,subscription_button_size,subscription_button_padding,subscription_button_width,subscription_style_options,subscription_dropdown_color")}
                    },
                     confirmation: {
                        title: "Apperance",
                        position: 2,
                        options: ${this.config_order_bump_subscription('variants,addonPrice')}
                    },
                    button: {
                        title: "Button",
                        position: 3,
                        options: ${this.config_button('fbInitiate,braintreeToken')}
                    }
                   
                        
                },
                renderer: {
                    Viewer: unlayer.createViewer({
                        render(values) {
                            
                            
                            return \`
                                
                            <style>
                                .checkbox-arrow-slide-right{ left: 10px; width: 20px; z-index: 1; -webkit-animation: slide-right .5s cubic-bezier(.25,.46,.45,.94) infinite alternate both; animation: slide-right .5s cubic-bezier(.25,.46,.45,.94) infinite alternate both; } @-webkit-keyframes slide-right {0% {-webkit-transform: translateX(0);transform: translateX(0);}100% {-webkit-transform: translateX(10px);transform: translateX(10px);}}
                                .product-addons { text-align: \$\{values.alignment\}; background-color: \$\{values.backgroundColor\}; padding: 5px; border-radius: 5px; color: \$\{values.fontColor\}; }
                                .p_add_on:checked:after { content: '\\\\2714'; font-size: 15px; font-weight: 700; color: #fff; background: linear-gradient(to bottom, #0fe469 0%, #145b32 100%); display: flex; align-items: center; justify-content: center; }
                                .p_add_on:after { content: ''; border: 1px solid #505256; background-color: #b3abab; width: 20px; height: 20px; position: absolute; top: -30%; left: -30%; border-radius: 5px; }
                            </style>
                            <div class="product-addons">
                                <img class="checkbox-arrow-slide-right" src="https://cdn.productlistgenie.com/images/NWMwYTg1ZjA3NzMwMDEzMjdiMDM5MDRj/1560786344044256-256-7f4d535dc832b66d90d5c0cb72ec8690-arrow.png">
                                <input type="checkbox" class="p_add_on" style="margin-left: 15px; position: relative;" \$\{values.checked ? ' checked' : ''\}>
                                <label style="font-size: \$\{values.fontSize\}; margin-left: 5px; text-decoration: \$\{values.undeline ? 'underline' : 'unset'\};">\$\{values.addonText\}</label>
                            </div>

                      

                            \`;
                        }
                    }),
                    exporters: {
                        web: function(values) {
                            
                            return \`
                                
                            <style>
                                .checkbox-arrow-slide-right{ left: 10px; width: 20px; z-index: 1; -webkit-animation: slide-right .5s cubic-bezier(.25,.46,.45,.94) infinite alternate both; animation: slide-right .5s cubic-bezier(.25,.46,.45,.94) infinite alternate both; } @-webkit-keyframes slide-right {0% {-webkit-transform: translateX(0);transform: translateX(0);}100% {-webkit-transform: translateX(10px);transform: translateX(10px);}}
                                .product-addons { text-align: \$\{values.alignment\}; background-color: \$\{values.backgroundColor\}; padding: 5px; border-radius: 5px; color: \$\{values.fontColor\}; }
                                .p_add_on:checked:after { content: '\\\\2714'; font-size: 15px; font-weight: 700; color: #fff; background: linear-gradient(to bottom, #0fe469 0%, #145b32 100%); display: flex; align-items: center; justify-content: center; }
                                .p_add_on:after { content: ''; border: 1px solid #505256; background-color: #b3abab; width: 20px; height: 20px; position: absolute; top: -30%; left: -30%; border-radius: 5px; }
                            </style>
                            <div class="product-addons">
                                <img class="checkbox-arrow-slide-right" src="https://cdn.productlistgenie.com/images/NWMwYTg1ZjA3NzMwMDEzMjdiMDM5MDRj/1560786344044256-256-7f4d535dc832b66d90d5c0cb72ec8690-arrow.png">
                                <input type="checkbox" id="conekta_order_bump" class="p_add_on" style="margin-left: 15px; position: relative;" \$\{values.checked ? ' checked' : ''\}>
                                <label style="font-size: \$\{values.fontSize\}; margin-left: 5px; text-decoration: \$\{values.undeline ? 'underline' : 'unset'\};">\$\{values.addonText\}</label>
                            </div>
                       
                          

                            <script>
                            let editordata = \$\{JSON.stringify(values)\}
                            let subdata = JSON.parse(editordata.conekta_subscription_list).filter((e) => e.selected);

                           
                            /* ===== END product information ===== */
                            function runConektaOrderBump(dis, dat) {
                                console.log("running order bump")
                                localStorage.setItem('_conekta_session_id_timestamp', new Date().getTime().toString());
                                let checkout_info = JSON.parse(localStorage.getItem('plg_conekta'));
                                checkout_info.source_link = window.location.href;
                                checkout_info.conektaPLanId = subdata[0].id;
                                checkout_info.quantity = "1";
                                checkout_info.productName = subdata[0].name;
                                checkout_info.variantId = subdata[0].shopifySubID;
                                checkout_info.variantName =  subdata[0].name + " - Subscription"; // TODO:
                                checkout_info.variantSku = subdata[0].shopifySubID;
                                checkout_info.productPrice = parseFloat(subdata[0].price);
                                send_post_request('/conekta-customer-subscription', checkout_info, (result, error) => {
                                    if (result) {
                                        if (result.status === 200) {
                                            checkout_info.order_id = result.data.id;
                                                checkout_info.forward_to_url = '${return_url}/conekta-orders-initial';
                                                send_post_request('/funnel-forwarder', checkout_info, (res, err) => {
                                                    if (!err) {
                                                        let product_list = JSON.parse(localStorage.getItem('plg_prod_list'));
                                                        product_list.push({
                                                            product_url: window.location.href,
                                                            product_name: subdata[0].name,
                                                            variant_name: subdata[0].name + " - Subscription",
                                                            product_price: parseFloat(subdata[0].price),
                                                        });
                                                        localStorage.setItem('plg_prod_list', JSON.stringify(product_list));
                                                        setTimeout(() => window.open(dis, dat), 3000)
                                                    } else {
                                                        toggle_loading();
                                                        alert(err);
                                                    }
                                                });
                                            // analytics_purchased(track_purchased, checkout_info.productPrice, checkout_info.currencyWord, () => {
                                                
                                            // });
                                        } else {
                                            toggle_loading();
                                            alert('Error: ' + result.message);
                                        }
                                    } else {
                                        toggle_loading();
                                        alert('An error has occurred: ' + error);
                                    }
                                });
                            }
                            </script>
                            \`;
                        }
                    }
                }
            });
        `;
    },
    /* ==================== END EDITOR CONTENT ==================== */
}

/*
    ===== Template for creating new content =====
    unlayer.registerTool({
        type: 'authorize-form-subscription',
        category: 'contents',
        label: 'Authorize Subscription',
        icon: '<svg aria-hidden="true" data-prefix="fab" data-icon="wpforms" class="svg-inline--fa fa-wpforms fa-w-14 fa-3x" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M448 75.2v361.7c0 24.3-19 43.2-43.2 43.2H43.2C19.3 480 0 461.4 0 436.8V75.2C0 51.1 18.8 32 43.2 32h361.7c24 0 43.1 18.8 43.1 43.2zm-37.3 361.6V75.2c0-3-2.6-5.8-5.8-5.8h-9.3L285.3 144 224 94.1 162.8 144 52.5 69.3h-9.3c-3.2 0-5.8 2.8-5.8 5.8v361.7c0 3 2.6 5.8 5.8 5.8h361.7c3.2.1 5.8-2.7 5.8-5.8zM150.2 186v37H76.7v-37h73.5zm0 74.4v37.3H76.7v-37.3h73.5zm11.1-147.3l54-43.7H96.8l64.5 43.7zm210 72.9v37h-196v-37h196zm0 74.4v37.3h-196v-37.3h196zm-84.6-147.3l64.5-43.7H232.8l53.9 43.7zM371.3 335v37.3h-99.4V335h99.4z"></path></svg>',
        values: {},
        options: {
            products: {
                title: "Products",
                position: 1,
                options: {
                    "showCard": {
                        "label": "Product Name",
                        "defaultValue": "Test Product",
                        "widget": "text"
                    },
                }
            }
        },
        renderer: {
            Viewer: unlayer.createViewer({
                render(values) {
                    return \`Test\`;
                }
            }),
            exporters: {
                web: function(values) {
                    return \`Test\`;
                }
            }
        }
    });

    ===== Template for creating new widget =====
    unlayer.registerPropertyEditor({
        name: 'subscription_products',
        layout: 'bottom',
        Widget: unlayer.createWidget({
            render(value) {
                return \`Test\`;
            },
            mount(node, value, updateValue) {
                return \`Test\`;
            }
        })
    });
*/