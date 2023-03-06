let CryptoJS = require('crypto-js');
let axios = require('axios');
let gval = require('../../../Global_Values');
let return_url = 'https://app.productlistgenie.io';
const editorTools = require('../../../Editor_Tools');
function encryptString(str) {
	return CryptoJS.AES.encrypt(str, gval.plg_domain_secret).toString();
}
function decrypting(str) {
	return CryptoJS.AES.decrypt(str, gval.plg_domain_secret).toString(CryptoJS.enc.Utf8);
}

module.exports = {
	checkout: function (user_id, page_data, faddons) {
		return `
        console.log("19.5. Initializing authorize subscription upsell...");
        unlayer.registerTool({
            type: 'braintree-subscription-upsell',
            category: 'contents',
            label: 'subscription',
            icon: '<svg class="svg-inline--fa fa-w-14 fa-w-20 fa-3x" fill="#fff" version="1.1" viewBox="312.558 169 81.773 90" width="81.773pt" height="90pt"><path d=" M 330.494 253.29 L 329.084 253.693 C 328.916 253.122 328.496 252.786 327.942 252.786 C 326.648 252.786 325.423 253.743 325.423 255.49 L 325.423 257.337 L 327.908 257.337 L 327.908 258.765 L 322.366 258.765 L 322.366 257.337 L 323.945 257.337 L 323.945 253.038 L 322.702 253.038 L 322.702 251.61 L 325.406 251.61 L 325.406 252.819 C 325.859 251.98 326.783 251.375 328.009 251.375 C 329.386 251.376 330.242 252.165 330.494 253.29 Z  M 320.921 255.994 C 320.921 257.774 319.544 258.765 317.294 258.765 L 312.558 258.765 L 312.558 257.337 L 313.683 257.337 L 313.683 250.452 L 312.558 250.452 L 312.558 249.024 L 317.059 249.024 C 319.124 249.024 320.384 249.982 320.384 251.644 C 320.384 252.736 319.746 253.408 318.94 253.727 C 320.098 254.046 320.921 254.869 320.921 255.994 Z  M 315.228 253.105 L 316.907 253.105 C 318.167 253.105 318.822 252.635 318.822 251.779 C 318.822 250.905 318.15 250.452 316.891 250.452 L 315.228 250.452 C 315.228 250.452 315.228 253.105 315.228 253.105 Z  M 319.36 255.91 C 319.36 254.986 318.57 254.482 317.025 254.482 L 315.228 254.482 L 315.228 257.337 L 317.143 257.337 C 318.621 257.337 319.36 256.85 319.36 255.91 Z  M 345.408 248 L 343.745 248 L 343.745 250.183 L 345.408 250.183 L 345.408 248 Z  M 338.153 257.337 L 339.194 257.337 L 339.194 258.765 L 336.641 258.765 L 336.641 258.009 C 336.255 258.631 335.214 259 334.189 259 C 332.711 259 331.435 258.244 331.435 256.75 C 331.435 254.986 333.165 254.315 334.743 254.315 C 335.516 254.315 336.154 254.466 336.641 254.6 L 336.641 254.197 C 336.641 253.189 335.835 252.769 334.962 252.769 C 334.139 252.769 333.434 253.105 332.862 253.626 L 331.888 252.568 C 332.56 251.947 333.517 251.376 334.962 251.376 C 336.759 251.376 338.153 252.333 338.153 254.146 L 338.153 257.337 L 338.153 257.337 L 338.153 257.337 Z  M 336.641 255.876 C 336.171 255.708 335.466 255.574 334.811 255.574 C 333.87 255.574 332.963 255.876 332.963 256.733 C 332.963 257.371 333.534 257.673 334.324 257.673 C 335.415 257.673 336.641 257.085 336.641 256.078 L 336.641 255.876 L 336.641 255.876 Z  M 385.144 255.456 L 385.144 255.708 L 378.981 255.708 C 379.232 256.901 380.223 257.623 381.516 257.623 C 382.591 257.623 383.515 257.186 384.019 256.632 L 385.009 257.673 C 384.27 258.446 382.961 259 381.499 259 C 379.098 259 377.419 257.388 377.419 255.188 C 377.419 252.988 379.048 251.376 381.315 251.376 C 383.565 251.376 385.144 253.105 385.144 255.456 Z  M 383.448 254.449 C 383.229 253.424 382.323 252.736 381.315 252.736 C 380.173 252.736 379.3 253.441 379.048 254.449 L 383.448 254.449 L 383.448 254.449 Z  M 373.993 251.376 C 372.767 251.376 371.843 251.98 371.389 252.82 L 371.389 251.61 L 368.686 251.61 L 368.686 253.038 L 369.928 253.038 L 369.928 257.337 L 368.35 257.337 L 368.35 258.765 L 373.892 258.765 L 373.892 257.337 L 371.406 257.337 L 371.406 255.49 C 371.406 253.743 372.633 252.786 373.926 252.786 C 374.48 252.786 374.9 253.122 375.068 253.693 L 376.479 253.29 C 376.226 252.165 375.37 251.376 373.993 251.376 Z  M 394.331 255.708 L 388.167 255.708 C 388.419 256.901 389.41 257.623 390.703 257.623 C 391.778 257.623 392.702 257.186 393.206 256.632 L 394.196 257.673 L 394.196 257.673 C 393.457 258.446 392.148 259 390.686 259 C 388.285 259 386.605 257.388 386.605 255.188 C 386.605 252.988 388.234 251.376 390.502 251.376 C 392.752 251.376 394.331 253.105 394.331 255.456 L 394.331 255.708 L 394.331 255.708 Z  M 392.635 254.449 C 392.416 253.424 391.509 252.736 390.502 252.736 C 389.36 252.736 388.487 253.441 388.234 254.449 L 392.635 254.449 L 392.635 254.449 Z  M 363.949 257.606 C 363.059 257.606 362.287 257.153 362.287 256.044 L 362.287 253.038 L 365.763 253.038 L 365.763 251.611 L 362.287 251.611 L 362.287 249.024 L 360.809 249.024 L 360.809 251.611 L 358.945 251.611 L 358.945 253.038 L 360.809 253.038 L 360.809 256.095 C 360.809 258.009 362.152 259 363.949 259 C 365.343 259 366.351 258.345 367.006 257.64 L 366.015 256.615 C 365.494 257.136 364.789 257.606 363.949 257.606 Z  M 345.408 251.61 L 341.646 251.61 L 341.646 253.038 L 343.93 253.038 L 343.93 257.337 L 340.941 257.337 L 340.941 258.765 L 348.162 258.765 L 348.162 257.337 L 345.408 257.337 L 345.408 251.61 L 345.408 251.61 Z  M 357.685 254.012 C 357.685 252.383 356.543 251.376 354.947 251.376 C 353.839 251.376 352.932 251.829 352.496 252.534 L 352.496 251.61 L 350.01 251.61 L 350.01 253.038 L 351.035 253.038 L 351.035 257.337 L 349.943 257.337 L 349.943 258.765 L 353.654 258.765 L 353.654 257.337 L 352.513 257.337 L 352.513 254.953 C 352.513 253.659 353.637 252.82 354.763 252.82 C 355.452 252.82 356.207 253.173 356.207 254.415 L 356.207 257.338 L 355.065 257.338 L 355.065 258.765 L 358.777 258.765 L 358.777 257.338 L 357.685 257.338 L 357.685 254.012 L 357.685 254.012 Z  M 386.343 218.957 C 386.343 231.717 376.472 238.82 360.34 238.82 L 326.395 238.82 L 326.395 228.587 L 334.459 228.587 L 334.459 179.233 L 326.395 179.233 L 326.395 169 L 358.655 169 C 373.461 169 382.49 175.862 382.49 187.78 C 382.49 195.605 377.915 200.419 372.137 202.707 C 380.443 204.994 386.343 210.892 386.343 218.957 Z  M 345.533 198.253 L 357.571 198.253 C 366.6 198.253 371.294 194.881 371.294 188.743 C 371.294 182.482 366.48 179.233 357.451 179.233 L 345.533 179.233 C 345.533 179.233 345.533 198.253 345.533 198.253 Z  M 375.148 218.354 C 375.148 211.735 369.489 208.123 358.415 208.123 L 345.535 208.123 L 345.535 228.587 L 359.258 228.587 C 369.851 228.587 375.148 225.095 375.148 218.354 Z " fill-rule="evenodd" fill="rgb(255,255,255)"/></svg>',
            values: {},
            options: {
                editor_title: {
                    title: "Braintree",
                    position: 1,
                    options: {
                      Braintree: {
                        "label": "Tittle",
                        "defaultValue": {
                            "title": "Braintree Subscription Upsell",
                            "description": "Braintree Subscription Upsell",
                        },
                        "widget": "editor_title"
                      }
                    }
                  },
                  tools: { //if error change tools to button
                    title: "Subscription Details", //Nov12
                    position: 1,
                    options: {
                        "braintree_subscription_name": {
                            label: "Braintree Subscription Name",
                            defaultValue: '',
                            widget: "text"
                        },
                        "braintree_subscription_price": {
                            label: "Braintree Subscription Price",
                            defaultValue: '',
                            widget: "text"
                        },
                        "braintree_subscriptionId": {
                            label: "Braintree Subscription ID",
                            defaultValue: '',
                            widget: "text"
                        },
                        "shopify_varian_Id": {
                            label: "Shopify Variant ID",
                            defaultValue: '',
                            widget: "text"
                        },
                        "paypal_subscription_Id": {
                            label: "Paypal Subscription ID",
                            defaultValue: '',
                            widget: "text"
                        },
                        
                    }
                },
                button: {
                    title: "Button",
                    position: 2,
                    options: ${editorTools.config_button()}
                },
                confirmation: {
                    title: "Confirmation",
                    position: 3,
                    options: ${editorTools.config_confirmation()}
                }
            },
            renderer: {
                Viewer: unlayer.createViewer({
                    render(values) {
                        let button_style = btnStyleFn(values);
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
                        return \`
                            \$\{button_style\}
                            <button class="\$\{values.animation\}"
                                onclick = "subscription_upsell(this)"
                                data-productname="\$\{values.braintree_subscription_name\}"
                                data-variantname="\$\{values.braintree_subscription_name\} - Add-on Subscription"
                                data-price="\$\{values.braintree_subscription_price\}"
                                data-shopify_product_id="\$\{values.shopify_product_Id\}"
                                data-braintree_subscription_id="\$\{values.braintree_subscriptionId\}"
                                data-cog="\$\{values.cog ? values.cog : 0\}"

                                data-trackaddtocart = "\$\{values.fbTrack\}"
                                data-trackpurchased = "\$\{values.fbPurchase\}"
                                
                                data-useconfirmation="\$\{values.use_confirmation\}"
                                data-header="\$\{values.header\}"
                                data-ptext="\$\{values.positive_button\}"
                                data-ntext="\$\{values.negative_button\}"
                            >
                                \$\{values.text\}
                                <div class="subtext">\$\{values.subText\}</div>
                            </button>
                            <script>
                                function subscription_upsell(element) {
                                    let quantity = 1;
                                    let product_name = element.dataset.productname;
                                    let variant_name = element.dataset.variantname;
                                    let price = element.dataset.price;
                                    let shopify_product_id = element.dataset.shopify_product_id;
                                    let braintree_subscription_id = element.dataset.braintree_subscription_id;
                                    let cog = element.dataset.cog;

                                    let track_add_to_cart = element.getAttribute('data-trackaddtocart');
                                    let track_purchased = element.getAttribute('data-trackpurchased');
                                    
                                    if (track_add_to_cart && typeof fbq !== 'undefined') fbq('track', 'AddToCart');
                                    if (localStorage.getItem("braintree_user_ids")) {
                                        subscription_hide_show_confirmation(element, () => {
                                            hide_show_loading();
                                            let payload = JSON.parse(atob(localStorage.getItem("braintree_user_ids")));
                                            payload.productPrice = price;
                                            payload.productName = product_name;
                                            payload.variantName = variant_name;
                                            payload.variant_id = shopify_product_id;
                                            payload.cog = cog;
                                            fetch("/authorize-subscription-create", {
                                                method: "POST",
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify(payload)
                                            })
                                            .then(res => res.json())
                                            .then(res => {
                                                if(res.status === 200){
                                                    payload.customerProfileId = res.data.profile.customerProfileId;
                                                    payload.customerPaymentProfileId = res.data.profile.customerPaymentProfileId;
                                                    payload.result = { transactionResponse: { transId: res.data.subscriptionId } };

                                                    if (track_purchased) {
                                                        typeof setPurchased !== "undefined" ? setPurchased() : void 0; // for analytics
                                                        typeof fbq !== 'undefined' ? fbq('track', 'Purchase', {value: parseFloat(plg_price), currency: "USD"}) : void 0;
                                                    }

                                                    save_authorize_initial_data(payload, result => {
                                                        let x_checkout = JSON.parse(localStorage.getItem("plg_prod_list"));
                                                        x_checkout.push({
                                                            product_url: window.location.href,
                                                            product_name: product_name,
                                                            variant_name: variant_name,
                                                            product_price: parseFloat(price),
                                                            variant_id: "\$\{values.paypal_subscription_Id\}"
                                                        });
                                                        localStorage.setItem("plg_prod_list", JSON.stringify(x_checkout));
                                                        window.open("\$\{values.buttonLink.url\}", "\$\{values.buttonLink.target\}");
                                                    }, error => {
                                                        hide_show_loading();
                                                        alert("An error has occured");
                                                    });
                                                } else {
                                                    hide_show_loading();
                                                    let message = res.data && res.data.messages.message ? res.data.messages.message[0].text : res.message;
                                                    alert(message);
                                                }
                                            })
                                            .catch(err => {
                                                console.log("Error ==>", err);
                                                // send error error email
                                                
                                                const email_payload = { toEmail: "tech@themillionairemastermind.com", fromEmail: "fg_error@gmail.com", subjectEmail: "Funnel creating subscription order failed.", textEmail: "Authorize Subscription Checkout Funnel Error: " + err + ", Link: " + window.location.href, htmlEmail: "Authorize Subscription Checkout Funnel Error: " + err + ", Link: " + window.location.href };
                                                fetch("https://stats.productlistgenie.io/console", { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(email_payload) });
                                                
                                                // New FIX stroked
                                                hide_show_loading();
                                                let x_checkout = JSON.parse(localStorage.getItem("plg_prod_list"));
                                                        x_checkout.push({
                                                            product_url: window.location.href,
                                                            product_name: product_name,
                                                            variant_name: variant_name,
                                                            product_price: parseFloat(price)
                                                        });
                                                        localStorage.setItem("plg_prod_list", JSON.stringify(x_checkout));
                                                        window.open("\$\{values.buttonLink.url\}", "\$\{values.buttonLink.target\}");
                                                // alert("Server Error occurred. Please try again.");
                                            });
                                        });
                                    } else {
                                        alert("Did not go through checkout.");
                                    }
                                }

                                function save_authorize_initial_data(result, success, error) {
                                    fetch('/authorize-orders-initial', {
                                        method: "POST",
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(result)
                                    })
                                    .then(res => {
                                        success(res)
                                    })
                                    .catch(err => {
                                        error(err)
                                    })
                                }

                                function subscription_hide_show_confirmation(element, callback) {
                                    window.callback = callback;
                                    let use_confirmation = element.dataset.useconfirmation;
                                    let header = element.dataset.header;
                                    let positive_text = element.dataset.positivetext;
                                    let negative_text = element.dataset.negativetext;
                                    if(use_confirmation === "true") {
                                        if(document.getElementById("upsell_confirmation")){
                                            closeConfirmationModal();
                                        } else {
                                            var confirmation = \\\`
                                                <style>
                                                    #upsell_confirmation button { border-radius: 5px; font-size: 20px; padding: 10px; cursor: pointer; border: none; }
                                                    #upsell_confirmation button.positive-button { color: #ffffff; background-color: #26c686; }
                                                    #upsell_confirmation button.positive-button:hover { background-color: #2a92bf; }
                                                    #upsell_confirmation button.negative-button { color: #ffffff; background-color: #d33b22; }
                                                    #upsell_confirmation button.negative-button:hover { background-color: #c87668; }
                                                </style>
                                                <div style="position: fixed; width: 100%; height: 100vh; overflow: scroll; z-index: 9999; top: 0; left: 0;">
                                                    <div style="align-items: center; display: flex; flex-direction: column; margin: auto; min-height: 100%; justify-content: center; background-color: #00000078;">
                                                        <div style="padding: 20px; background-color: #ffffff; border-radius:\$\{values.borderRadius_popup\};">
                                                            <h1 style="margin: 0 0 10px;">\\\$\\\{header\\\}</h1>
                                                            <div style="display: flex; flex-flow: row wrap; -webkit-flex-flow: row wrap; justify-content: space-around;">
                                                                <button class="positive-button" style="width: 48%; margin: 0 1%;" onclick="closeConfirmationModal(); window.callback();">\\\$\\\{positive_text\\\}</button>
                                                                <button class="negative-button" style="width: 48%; margin: 0 1%;" onclick="closeConfirmationModal()">\\\$\\\{negative_text\\\}</button>
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

                                function closeConfirmationModal(){
                                    document.getElementById("upsell_confirmation").remove();
                                }

                                function hide_show_loading(){
                                    if(document.getElementById("submit_loading")) {
                                        document.getElementById("submit_loading").remove();
                                    } else {
                                        var xx = '<style> #spinner { position: relative; width: 100%; height: 100%; } #spinner:after { content: ""; display: block; position: absolute; width: 80px; height: 80px; margin-left: -40px; margin-top: -40px; border: 5px solid #d1faeb; -moz-border-radius: 50%; -webkit-border-radius: 50%; border-radius: 50%; border-top-color: #26c686; border-right-color: #26c686; -moz-animation: rotate 0.5s linear infinite; -webkit-animation: rotate 0.5s linear infinite; animation: rotate 0.5s linear infinite; } @-moz-keyframes rotate { 0% { -moz-transform: rotateZ(-360deg); transform: rotateZ(-360deg); } 50% { -moz-transform: rotateZ(-180deg); transform: rotateZ(-180deg); } 100% { -moz-transform: rotateZ(0deg); transform: rotateZ(0deg); } } @-webkit-keyframes rotate { 0% { -webkit-transform: rotateZ(-360deg); transform: rotateZ(-360deg); } 50% { -webkit-transform: rotateZ(-180deg); transform: rotateZ(-180deg); } 100% { -webkit-transform: rotateZ(0deg); transform: rotateZ(0deg); } } @keyframes rotate { 0% { -moz-transform: rotateZ(-360deg); -ms-transform: rotateZ(-360deg); -webkit-transform: rotateZ(-360deg); transform: rotateZ(-360deg); } 50% { -moz-transform: rotateZ(-180deg); -ms-transform: rotateZ(-180deg); -webkit-transform: rotateZ(-180deg); transform: rotateZ(-180deg); } 100% { -moz-transform: rotateZ(0deg); -ms-transform: rotateZ(0deg); -webkit-transform: rotateZ(0deg); transform: rotateZ(0deg); } } </style> <div style="position: fixed; width: 100%; height: 100vh; overflow: scroll; z-index: 9999; top: 0; left: 0;"><div style="align-items: center; display: flex; flex-direction: column; margin: auto; min-height: 100%; justify-content: center; background-color: #00000078;"><div style="display: flex; align-items: center; padding: 100px;"><div id="spinner"></div></div></div></div>';
                                        var div = document.createElement("div");
                                        div.id = "submit_loading";
                                        div.innerHTML = xx;
                                        document.body.appendChild(div);
                                    }
                                }
                            </script>
                        \`;
                    }
                }
            }
        });
    `;
	},
};
