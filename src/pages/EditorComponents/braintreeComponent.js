
let CryptoJS = require('crypto-js');
let axios = require('axios');
let gval = require('../../../Global_Values');
let return_url = "https://app.productlistgenie.io";
const editorTools = require('../../../Editor_Tools');
function encryptString(str) {
    return CryptoJS.AES.encrypt(str, gval.plg_domain_secret).toString();
}
function decrypting(str) {
    return CryptoJS.AES.decrypt(str, gval.plg_domain_secret).toString(CryptoJS.enc.Utf8);
}



module.exports = {
    checkout: function (user_id, page_data, faddons) {
        // console.log(page_data, "page_datapage_datapage_data")
        // let private_key = decrypting(page_data.gateway_stripe_private);

        // var toEncrypt = {
        //     merchantId: page_data.gateway_other,
        //     publicKey: page_data.gateway_stripe_public,
        //     privateKey: private_key
        // }

        console.table(page_data.gateway_stripe_private)
        // console.log("==========================");

        // const encryptedKeys = encryptString(JSON.stringify(toEncrypt));

        const [privateKey, merchantId, publicKey, token, sandboxLive] = [...decrypting(page_data.gateway_stripe_private).split(':')];
        console.log(merchantId, publicKey, privateKey, token, sandboxLive)
        console.table({
            sandboxLive,
            merchantId,
            publicKey,
            privateKey,
            token
        })
        var toEncrypt = {
            merchantId: page_data.gateway_other,
            publicKey: page_data.gateway_stripe_public,
            privateKey
        }

        console.table(toEncrypt);

        const encryptedKeys = encryptString(JSON.stringify(toEncrypt))

        return `
            unlayer.registerPropertyEditor({
                name: 'googlepay_design_dropdown',
                layout: 'bottom',
                Widget: unlayer.createWidget({
                    render(value) {
                        return \`<div class="blockbuilder-widget blockbuilder-link-widget">
                            <div class="row eiCcjJ">
                                <div class="blockbuilder-widget-label col-6">
                                    <label class="blockbuilder-label-primary">
                                        <span>Google Pay Button Design</span>
                                    </label>
                                </div>
                                <div class="col-6 text-right">
                                    <select class="form-control button_design">
                                        <option value="black">White</option>
                                        <option value="white">Black</option>
                                    </select>
                                </div>
                            </div>
                        </div>\`
                    },
                    mount(node, value, updateValue) {
                        var btnDesign = node.getElementsByClassName('button_design')[0];
                        btnDesign.value = value;
                        btnDesign.onchange = (e) => {
                            updateValue(e.target.value)
                        }
                    }
                })
            });
            unlayer.registerPropertyEditor({
                name: 'googlepay_text_dropdown',
                layout: 'bottom',
                Widget: unlayer.createWidget({
                    render(value) {
                        return \`<div class="blockbuilder-widget blockbuilder-link-widget">
                            <div class="row eiCcjJ">
                                <div class="blockbuilder-widget-label col-6">
                                    <label class="blockbuilder-label-primary">
                                        <span>Google Pay Text Design</span>
                                    </label>
                                </div>
                                <div class="col-6 text-right">
                                    <select class="form-control button_design">
                                        <option value="Book">Book</option>
                                        <option value="Buy">Buy</option>
                                        <option value="Checkout">Checkout</option>
                                        <option value="Donate">Donate</option>
                                        <option value="Order">Order</option>
                                        <option value="Pay">Pay</option>
                                        <option value="plain">Plain</option>
                                        <option value="Subscribe">Subscribe</option>
                                    </select>
                                </div>
                            </div>
                        </div>\`
                    },
                    mount(node, value, updateValue) {
                        var btnDesign = node.getElementsByClassName('button_design')[0];
                        btnDesign.value = value;
                        btnDesign.onchange = (e) => {
                            updateValue(e.target.value)
                        }
                    }
                })
            });
            console.log("1. Initializing Editor Tools --> Braintree Checkout...");
            unlayer.registerTool({
                type: 'braintree-form',
                category: 'contents',
                label: 'Braintree Form',
                icon: '<svg class="svg-inline--fa fa-w-14 fa-w-20 fa-3x" fill="#fff" version="1.1" viewBox="312.558 169 81.773 90" width="81.773pt" height="90pt"><path d=" M 330.494 253.29 L 329.084 253.693 C 328.916 253.122 328.496 252.786 327.942 252.786 C 326.648 252.786 325.423 253.743 325.423 255.49 L 325.423 257.337 L 327.908 257.337 L 327.908 258.765 L 322.366 258.765 L 322.366 257.337 L 323.945 257.337 L 323.945 253.038 L 322.702 253.038 L 322.702 251.61 L 325.406 251.61 L 325.406 252.819 C 325.859 251.98 326.783 251.375 328.009 251.375 C 329.386 251.376 330.242 252.165 330.494 253.29 Z  M 320.921 255.994 C 320.921 257.774 319.544 258.765 317.294 258.765 L 312.558 258.765 L 312.558 257.337 L 313.683 257.337 L 313.683 250.452 L 312.558 250.452 L 312.558 249.024 L 317.059 249.024 C 319.124 249.024 320.384 249.982 320.384 251.644 C 320.384 252.736 319.746 253.408 318.94 253.727 C 320.098 254.046 320.921 254.869 320.921 255.994 Z  M 315.228 253.105 L 316.907 253.105 C 318.167 253.105 318.822 252.635 318.822 251.779 C 318.822 250.905 318.15 250.452 316.891 250.452 L 315.228 250.452 C 315.228 250.452 315.228 253.105 315.228 253.105 Z  M 319.36 255.91 C 319.36 254.986 318.57 254.482 317.025 254.482 L 315.228 254.482 L 315.228 257.337 L 317.143 257.337 C 318.621 257.337 319.36 256.85 319.36 255.91 Z  M 345.408 248 L 343.745 248 L 343.745 250.183 L 345.408 250.183 L 345.408 248 Z  M 338.153 257.337 L 339.194 257.337 L 339.194 258.765 L 336.641 258.765 L 336.641 258.009 C 336.255 258.631 335.214 259 334.189 259 C 332.711 259 331.435 258.244 331.435 256.75 C 331.435 254.986 333.165 254.315 334.743 254.315 C 335.516 254.315 336.154 254.466 336.641 254.6 L 336.641 254.197 C 336.641 253.189 335.835 252.769 334.962 252.769 C 334.139 252.769 333.434 253.105 332.862 253.626 L 331.888 252.568 C 332.56 251.947 333.517 251.376 334.962 251.376 C 336.759 251.376 338.153 252.333 338.153 254.146 L 338.153 257.337 L 338.153 257.337 L 338.153 257.337 Z  M 336.641 255.876 C 336.171 255.708 335.466 255.574 334.811 255.574 C 333.87 255.574 332.963 255.876 332.963 256.733 C 332.963 257.371 333.534 257.673 334.324 257.673 C 335.415 257.673 336.641 257.085 336.641 256.078 L 336.641 255.876 L 336.641 255.876 Z  M 385.144 255.456 L 385.144 255.708 L 378.981 255.708 C 379.232 256.901 380.223 257.623 381.516 257.623 C 382.591 257.623 383.515 257.186 384.019 256.632 L 385.009 257.673 C 384.27 258.446 382.961 259 381.499 259 C 379.098 259 377.419 257.388 377.419 255.188 C 377.419 252.988 379.048 251.376 381.315 251.376 C 383.565 251.376 385.144 253.105 385.144 255.456 Z  M 383.448 254.449 C 383.229 253.424 382.323 252.736 381.315 252.736 C 380.173 252.736 379.3 253.441 379.048 254.449 L 383.448 254.449 L 383.448 254.449 Z  M 373.993 251.376 C 372.767 251.376 371.843 251.98 371.389 252.82 L 371.389 251.61 L 368.686 251.61 L 368.686 253.038 L 369.928 253.038 L 369.928 257.337 L 368.35 257.337 L 368.35 258.765 L 373.892 258.765 L 373.892 257.337 L 371.406 257.337 L 371.406 255.49 C 371.406 253.743 372.633 252.786 373.926 252.786 C 374.48 252.786 374.9 253.122 375.068 253.693 L 376.479 253.29 C 376.226 252.165 375.37 251.376 373.993 251.376 Z  M 394.331 255.708 L 388.167 255.708 C 388.419 256.901 389.41 257.623 390.703 257.623 C 391.778 257.623 392.702 257.186 393.206 256.632 L 394.196 257.673 L 394.196 257.673 C 393.457 258.446 392.148 259 390.686 259 C 388.285 259 386.605 257.388 386.605 255.188 C 386.605 252.988 388.234 251.376 390.502 251.376 C 392.752 251.376 394.331 253.105 394.331 255.456 L 394.331 255.708 L 394.331 255.708 Z  M 392.635 254.449 C 392.416 253.424 391.509 252.736 390.502 252.736 C 389.36 252.736 388.487 253.441 388.234 254.449 L 392.635 254.449 L 392.635 254.449 Z  M 363.949 257.606 C 363.059 257.606 362.287 257.153 362.287 256.044 L 362.287 253.038 L 365.763 253.038 L 365.763 251.611 L 362.287 251.611 L 362.287 249.024 L 360.809 249.024 L 360.809 251.611 L 358.945 251.611 L 358.945 253.038 L 360.809 253.038 L 360.809 256.095 C 360.809 258.009 362.152 259 363.949 259 C 365.343 259 366.351 258.345 367.006 257.64 L 366.015 256.615 C 365.494 257.136 364.789 257.606 363.949 257.606 Z  M 345.408 251.61 L 341.646 251.61 L 341.646 253.038 L 343.93 253.038 L 343.93 257.337 L 340.941 257.337 L 340.941 258.765 L 348.162 258.765 L 348.162 257.337 L 345.408 257.337 L 345.408 251.61 L 345.408 251.61 Z  M 357.685 254.012 C 357.685 252.383 356.543 251.376 354.947 251.376 C 353.839 251.376 352.932 251.829 352.496 252.534 L 352.496 251.61 L 350.01 251.61 L 350.01 253.038 L 351.035 253.038 L 351.035 257.337 L 349.943 257.337 L 349.943 258.765 L 353.654 258.765 L 353.654 257.337 L 352.513 257.337 L 352.513 254.953 C 352.513 253.659 353.637 252.82 354.763 252.82 C 355.452 252.82 356.207 253.173 356.207 254.415 L 356.207 257.338 L 355.065 257.338 L 355.065 258.765 L 358.777 258.765 L 358.777 257.338 L 357.685 257.338 L 357.685 254.012 L 357.685 254.012 Z  M 386.343 218.957 C 386.343 231.717 376.472 238.82 360.34 238.82 L 326.395 238.82 L 326.395 228.587 L 334.459 228.587 L 334.459 179.233 L 326.395 179.233 L 326.395 169 L 358.655 169 C 373.461 169 382.49 175.862 382.49 187.78 C 382.49 195.605 377.915 200.419 372.137 202.707 C 380.443 204.994 386.343 210.892 386.343 218.957 Z  M 345.533 198.253 L 357.571 198.253 C 366.6 198.253 371.294 194.881 371.294 188.743 C 371.294 182.482 366.48 179.233 357.451 179.233 L 345.533 179.233 C 345.533 179.233 345.533 198.253 345.533 198.253 Z  M 375.148 218.354 C 375.148 211.735 369.489 208.123 358.415 208.123 L 345.535 208.123 L 345.535 228.587 L 359.258 228.587 C 369.851 228.587 375.148 225.095 375.148 218.354 Z " fill-rule="evenodd" fill="rgb(255,255,255)"/></svg>',
                values: {},
                options: {
                    editor_title: {
                      title: "Integration",
                      position: 1,
                      options: {
                        Braintree: {
                          "label": "Tittle",
                          "defaultValue": {
                              "title": "Braintree checkout integration",
                              "description": "Braintree checkout integration",
                          },
                          "widget": "editor_title"
                        },
                        "testMode": {
                            "label": "Production (Live)",
                            "defaultValue": false,
                            "widget": "toggle"
                        },
                      }
                    },
                    braintree_button: {
                        title: "Button",
                        position: 2,
                        options: ${JSON.stringify({
                            "activateGpay": {
                                "label": "Add Google Pay",
                                "defaultValue": false,
                                "widget": "toggle"
                            },
                            "gpay_text": {
                                "label": "Google Pay Text",
                                "defaultValue": "Buy",
                                "widget": "googlepay_text_dropdown"
                            },
                            "gpay_button_design": {
                                "label": "Google Button Design",
                                "defaultValue": "white",
                                "widget": "googlepay_design_dropdown"
                            },
                            "gpay_merchantId": {
                                "label": "Google Pay Merchant ID",
                                "defaultValue": "",
                                "widget": "text"
                            },
                            "activatePaypal": {
                                "label": "Add Paypal",
                                "defaultValue": false,
                                "widget": "toggle"
                            },
                            ...JSON.parse(editorTools.config_button("animationInterval,animation"))
                        })}
                    },
                    braintree_form: {
                        title: "Form",
                        position: 4,
                        options: ${editorTools.config_non_cod_form("testMode,showCard")}
                    }
                },
                renderer: {
                    Viewer: unlayer.createViewer({
                        render(values) {
                            let form_style = formStyleFn(values);
                            let input_style = inputStyleFn(values);
                            let button_style = btnStyleFn(values);
                            let content_style = subscriptionStyleFn(values);

                            function gPayLogo(textPrefix, buttonColor) {
                                return \`<div id="googlepay_btn" class="row" style="margin-top: 10px; border-radius: 6px; box-shadow: 2px 2px 4px \$\{buttonColor === "black" ? "#3c4043" : "#ffffff"\}; background-color: \$\{buttonColor !== "black" ? "#3c4043" : "#ffffff"\};">
                                    \$\{textPrefix === "plain" ? \'\' : \`                                    
                                        <span class="col-6 mx-auto d-flex" style="font-size: 19px; justify-content: end; align-items: center; color: \$\{buttonColor === "black" ? "#3c4043" : "#ffffff"\};"> \$\{textPrefix === "plain" ? \'\' : textPrefix + \' with\'\}  </span>
                                    \`\}
                                    <div class="\$\{textPrefix === "plain" ? \'col-12\' : \'col-6\'\} mx-auto d-flex" style="justify-content: \$\{textPrefix === "plain" ? \'center\' : \'flex-start\'\}; align-items: center;">
                                        <?xml version="1.0" encoding="UTF-8" standalone="no"?>
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation: isolate; width: 9rem; padding: 11px 12px;" x="0px" y="0px" viewBox="882.5 409.4 523 205.2">
                                            <g>
                                                <path d=" M 1126.6 438.7 L 1126.6 490.8 L 1158.7 490.8 C 1166.3 490.8 1172.7 488.2 1177.7 483.1 C 1182.8 478 1185.4 471.8 1185.4 464.8 C 1185.4 457.9 1182.8 451.8 1177.7 446.7 C 1172.7 441.4 1166.4 438.8 1158.7 438.8 L 1126.6 438.8 L 1126.6 438.7 L 1126.6 438.7 L 1126.6 438.7 Z  M 1230.4 538.3 C 1230.4 543.3 1232.5 547.5 1236.8 550.8 C 1241 554.1 1246 555.8 1251.7 555.8 C 1259.8 555.8 1267 552.8 1273.3 546.8 C 1279.6 540.8 1282.8 533.8 1282.8 525.7 C 1276.8 521 1268.5 518.6 1257.8 518.6 C 1250 518.6 1243.5 520.5 1238.3 524.2 C 1233 528.1 1230.4 532.8 1230.4 538.3 L 1230.4 538.3 L 1230.4 538.3 Z  M 1126.6 509.2 L 1126.6 569.7 L 1107.4 569.7 L 1107.4 420.3 L 1158.3 420.3 C 1171.2 420.3 1182.2 424.6 1191.2 433.2 C 1200.4 441.8 1205 452.3 1205 464.7 C 1205 477.4 1200.4 487.9 1191.2 496.4 C 1182.3 504.9 1171.3 509.1 1158.3 509.1 L 1126.6 509.1 L 1126.6 509.2 L 1126.6 509.2 L 1126.6 509.2 Z  M 1255.2 464.1 C 1269.4 464.1 1280.6 467.9 1288.8 475.5 C 1297 483.1 1301.1 493.5 1301.1 506.7 L 1301.1 569.7 L 1282.8 569.7 L 1282.8 555.5 L 1282 555.5 C 1274.1 567.2 1263.5 573 1250.3 573 C 1239 573 1229.6 569.7 1222 563 C 1214.4 556.3 1210.6 548 1210.6 538 C 1210.6 527.4 1214.6 519 1222.6 512.8 C 1230.6 506.5 1241.3 503.4 1254.6 503.4 C 1266 503.4 1275.4 505.5 1282.7 509.7 L 1282.7 505.3 C 1282.7 498.6 1280.1 493 1274.8 488.3 C 1269.5 483.6 1263.3 481.3 1256.2 481.3 C 1245.5 481.3 1237 485.8 1230.8 494.9 L 1213.9 484.3 C 1223.2 470.8 1237 464.1 1255.2 464.1 L 1255.2 464.1 L 1255.2 464.1 Z  M 1405.5 467.4 L 1341.5 614.6 L 1321.7 614.6 L 1345.5 563.1 L 1303.3 467.4 L 1324.2 467.4 L 1354.6 540.8 L 1355 540.8 L 1384.6 467.4 L 1405.5 467.4 Z " fill-rule="evenodd" fill="\$\{buttonColor === "black" ? "#3c4043" : "#ffffff"\}"/>
                                                <path d=" M 1050.23 497 C 1050.23 490.74 1049.67 484.75 1048.63 478.99 L 968.15 478.99 L 968.15 511.99 L 1014.5 512 C 1012.62 522.98 1006.57 532.34 997.3 538.58 L 997.3 559.99 L 1024.89 559.99 C 1041 545.08 1050.23 523.04 1050.23 497 Z " fill="rgb(66,133,244)"/>
                                                <path d=" M 997.31 538.58 C 989.63 543.76 979.74 546.79 968.17 546.79 C 945.82 546.79 926.86 531.73 920.07 511.43 L 891.61 511.43 L 891.61 533.51 C 905.71 561.49 934.69 580.69 968.17 580.69 C 991.31 580.69 1010.75 573.08 1024.9 559.98 L 997.31 538.58 Z " fill="rgb(52,168,83)"/>
                                                <path d=" M 917.39 495.05 C 917.39 489.35 918.34 483.84 920.07 478.66 L 920.07 456.58 L 891.61 456.58 C 885.78 468.15 882.5 481.21 882.5 495.05 C 882.5 508.89 885.79 521.95 891.61 533.52 L 920.07 511.44 C 918.34 506.26 917.39 500.75 917.39 495.05 Z " fill="rgb(250,187,5)"/>
                                                <path d=" M 968.17 443.3 C 980.8 443.3 992.11 447.65 1001.04 456.15 L 1025.49 431.72 C 1010.64 417.89 991.28 409.4 968.17 409.4 C 934.7 409.4 905.71 428.6 891.61 456.58 L 920.07 478.66 C 926.86 458.36 945.82 443.3 968.17 443.3 Z " fill="rgb(233,66,53)"/>
                                            </g>
                                        </svg>
                                    </div>
                                </div>\`
                            }

                            return \`
                                \$\{form_style\}
                                \$\{input_style\}
                                \$\{button_style\}
                                \$\{content_style\}
                                

                                <div class="braintree-form">
                                
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
                                            ${faddons.phoneElement}
                                            <input type="email" name="email" autocomplete="on" maxlength="40" placeholder="\$\{values.email\}" required />
                                            <input type="text" name="address" autocomplete="on" maxlength="45" placeholder="\$\{values.address\}" required />
                                            <input type="text" name="city" autocomplete="on" maxlength="45" placeholder="\$\{values.city\}" required />
                                            <input type="text" name="zipcode" autocomplete="on" pattern="[0-9]*" maxlength="5" placeholder="\$\{values.zipcode\}" required />
                                            ${faddons.statelist}
                                            ${faddons.countrylist}
                                            <h3 style="margin: 0 0 5px;">\$\{values.creditCard\}</h3>
                                            <input type="text" name="cardNumber" id="cardNumber" placeholder="Card Number" required />
                                            <div class="half-left">
                                                <input type="text" name="expiry" id="expiry" placeholder="MM / YY" required />
                                            </div>
                                            <div class="half-right">
                                                <input type="text" name="cardCode" id="cardCode" placeholder="CCV" required />
                                            </div>
                                            <div class="full" style="text-align:\$\{values.alignment\}">
                                            <button class="\$\{values.animation\}" type="submit">
                                                        \$\{values.text\}
                                                <div class="subtext">\$\{values.subText\}</div>
                                            </button>
                                            \$\{values.activateGpay ? gPayLogo(values.gpay_text, values.gpay_button_design) : \`\` \}
                                            \$\{values.activatePaypal ? \`
                                            <div class="full" style="text-align:center;margin-top: 10px;">
                                                <button style="width: 100%;background-color: #efe764;border-radius: 5px;border: none;padding: 10px;"><img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAzMiIgeG1sbnM9Imh0dHA6JiN4MkY7JiN4MkY7d3d3LnczLm9yZyYjeDJGOzIwMDAmI3gyRjtzdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiPjxwYXRoIGZpbGw9IiMwMDljZGUiIGQ9Ik0gMjAuOTA1IDkuNSBDIDIxLjE4NSA3LjQgMjAuOTA1IDYgMTkuNzgyIDQuNyBDIDE4LjU2NCAzLjMgMTYuNDExIDIuNiAxMy42OTcgMi42IEwgNS43MzkgMi42IEMgNS4yNzEgMi42IDQuNzEgMy4xIDQuNjE1IDMuNiBMIDEuMzM5IDI1LjggQyAxLjMzOSAyNi4yIDEuNjIgMjYuNyAyLjA4OCAyNi43IEwgNi45NTYgMjYuNyBMIDYuNjc1IDI4LjkgQyA2LjU4MSAyOS4zIDYuODYyIDI5LjYgNy4yMzYgMjkuNiBMIDExLjM1NiAyOS42IEMgMTEuODI1IDI5LjYgMTIuMjkyIDI5LjMgMTIuMzg2IDI4LjggTCAxMi4zODYgMjguNSBMIDEzLjIyOCAyMy4zIEwgMTMuMjI4IDIzLjEgQyAxMy4zMjIgMjIuNiAxMy43OSAyMi4yIDE0LjI1OCAyMi4yIEwgMTQuODIxIDIyLjIgQyAxOC44NDUgMjIuMiAyMS45MzUgMjAuNSAyMi44NzEgMTUuNSBDIDIzLjMzOSAxMy40IDIzLjE1MyAxMS43IDIyLjAyOSAxMC41IEMgMjEuNzQ4IDEwLjEgMjEuMjc5IDkuOCAyMC45MDUgOS41IEwgMjAuOTA1IDkuNSI+PC9wYXRoPjxwYXRoIGZpbGw9IiMwMTIxNjkiIGQ9Ik0gMjAuOTA1IDkuNSBDIDIxLjE4NSA3LjQgMjAuOTA1IDYgMTkuNzgyIDQuNyBDIDE4LjU2NCAzLjMgMTYuNDExIDIuNiAxMy42OTcgMi42IEwgNS43MzkgMi42IEMgNS4yNzEgMi42IDQuNzEgMy4xIDQuNjE1IDMuNiBMIDEuMzM5IDI1LjggQyAxLjMzOSAyNi4yIDEuNjIgMjYuNyAyLjA4OCAyNi43IEwgNi45NTYgMjYuNyBMIDguMjY3IDE4LjQgTCA4LjE3MyAxOC43IEMgOC4yNjcgMTguMSA4LjczNSAxNy43IDkuMjk2IDE3LjcgTCAxMS42MzYgMTcuNyBDIDE2LjIyNCAxNy43IDE5Ljc4MiAxNS43IDIwLjkwNSAxMC4xIEMgMjAuODEyIDkuOCAyMC45MDUgOS43IDIwLjkwNSA5LjUiPjwvcGF0aD48cGF0aCBmaWxsPSIjMDAzMDg3IiBkPSJNIDkuNDg1IDkuNSBDIDkuNTc3IDkuMiA5Ljc2NSA4LjkgMTAuMDQ2IDguNyBDIDEwLjIzMiA4LjcgMTAuMzI2IDguNiAxMC41MTMgOC42IEwgMTYuNjkyIDguNiBDIDE3LjQ0MiA4LjYgMTguMTg5IDguNyAxOC43NTMgOC44IEMgMTguOTM5IDguOCAxOS4xMjcgOC44IDE5LjMxNCA4LjkgQyAxOS41MDEgOSAxOS42ODggOSAxOS43ODIgOS4xIEMgMTkuODc1IDkuMSAxOS45NjggOS4xIDIwLjA2MyA5LjEgQyAyMC4zNDMgOS4yIDIwLjYyNCA5LjQgMjAuOTA1IDkuNSBDIDIxLjE4NSA3LjQgMjAuOTA1IDYgMTkuNzgyIDQuNiBDIDE4LjY1OCAzLjIgMTYuNTA2IDIuNiAxMy43OSAyLjYgTCA1LjczOSAyLjYgQyA1LjI3MSAyLjYgNC43MSAzIDQuNjE1IDMuNiBMIDEuMzM5IDI1LjggQyAxLjMzOSAyNi4yIDEuNjIgMjYuNyAyLjA4OCAyNi43IEwgNi45NTYgMjYuNyBMIDguMjY3IDE4LjQgTCA5LjQ4NSA5LjUgWiI+PC9wYXRoPjwvc3ZnPg==" width="20em"><img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMTAwIDMyIiB4bWxucz0iaHR0cDomI3gyRjsmI3gyRjt3d3cudzMub3JnJiN4MkY7MjAwMCYjeDJGO3N2ZyIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pbllNaW4gbWVldCI+PHBhdGggZmlsbD0iIzAwMzA4NyIgZD0iTSAxMiA0LjkxNyBMIDQuMiA0LjkxNyBDIDMuNyA0LjkxNyAzLjIgNS4zMTcgMy4xIDUuODE3IEwgMCAyNS44MTcgQyAtMC4xIDI2LjIxNyAwLjIgMjYuNTE3IDAuNiAyNi41MTcgTCA0LjMgMjYuNTE3IEMgNC44IDI2LjUxNyA1LjMgMjYuMTE3IDUuNCAyNS42MTcgTCA2LjIgMjAuMjE3IEMgNi4zIDE5LjcxNyA2LjcgMTkuMzE3IDcuMyAxOS4zMTcgTCA5LjggMTkuMzE3IEMgMTQuOSAxOS4zMTcgMTcuOSAxNi44MTcgMTguNyAxMS45MTcgQyAxOSA5LjgxNyAxOC43IDguMTE3IDE3LjcgNi45MTcgQyAxNi42IDUuNjE3IDE0LjYgNC45MTcgMTIgNC45MTcgWiBNIDEyLjkgMTIuMjE3IEMgMTIuNSAxNS4wMTcgMTAuMyAxNS4wMTcgOC4zIDE1LjAxNyBMIDcuMSAxNS4wMTcgTCA3LjkgOS44MTcgQyA3LjkgOS41MTcgOC4yIDkuMzE3IDguNSA5LjMxNyBMIDkgOS4zMTcgQyAxMC40IDkuMzE3IDExLjcgOS4zMTcgMTIuNCAxMC4xMTcgQyAxMi45IDEwLjUxNyAxMy4xIDExLjIxNyAxMi45IDEyLjIxNyBaIj48L3BhdGg+PHBhdGggZmlsbD0iIzAwMzA4NyIgZD0iTSAzNS4yIDEyLjExNyBMIDMxLjUgMTIuMTE3IEMgMzEuMiAxMi4xMTcgMzAuOSAxMi4zMTcgMzAuOSAxMi42MTcgTCAzMC43IDEzLjYxNyBMIDMwLjQgMTMuMjE3IEMgMjkuNiAxMi4wMTcgMjcuOCAxMS42MTcgMjYgMTEuNjE3IEMgMjEuOSAxMS42MTcgMTguNCAxNC43MTcgMTcuNyAxOS4xMTcgQyAxNy4zIDIxLjMxNyAxNy44IDIzLjQxNyAxOS4xIDI0LjgxNyBDIDIwLjIgMjYuMTE3IDIxLjkgMjYuNzE3IDIzLjggMjYuNzE3IEMgMjcuMSAyNi43MTcgMjkgMjQuNjE3IDI5IDI0LjYxNyBMIDI4LjggMjUuNjE3IEMgMjguNyAyNi4wMTcgMjkgMjYuNDE3IDI5LjQgMjYuNDE3IEwgMzIuOCAyNi40MTcgQyAzMy4zIDI2LjQxNyAzMy44IDI2LjAxNyAzMy45IDI1LjUxNyBMIDM1LjkgMTIuNzE3IEMgMzYgMTIuNTE3IDM1LjYgMTIuMTE3IDM1LjIgMTIuMTE3IFogTSAzMC4xIDE5LjMxNyBDIDI5LjcgMjEuNDE3IDI4LjEgMjIuOTE3IDI1LjkgMjIuOTE3IEMgMjQuOCAyMi45MTcgMjQgMjIuNjE3IDIzLjQgMjEuOTE3IEMgMjIuOCAyMS4yMTcgMjIuNiAyMC4zMTcgMjIuOCAxOS4zMTcgQyAyMy4xIDE3LjIxNyAyNC45IDE1LjcxNyAyNyAxNS43MTcgQyAyOC4xIDE1LjcxNyAyOC45IDE2LjExNyAyOS41IDE2LjcxNyBDIDMwIDE3LjQxNyAzMC4yIDE4LjMxNyAzMC4xIDE5LjMxNyBaIj48L3BhdGg+PHBhdGggZmlsbD0iIzAwMzA4NyIgZD0iTSA1NS4xIDEyLjExNyBMIDUxLjQgMTIuMTE3IEMgNTEgMTIuMTE3IDUwLjcgMTIuMzE3IDUwLjUgMTIuNjE3IEwgNDUuMyAyMC4yMTcgTCA0My4xIDEyLjkxNyBDIDQzIDEyLjQxNyA0Mi41IDEyLjExNyA0Mi4xIDEyLjExNyBMIDM4LjQgMTIuMTE3IEMgMzggMTIuMTE3IDM3LjYgMTIuNTE3IDM3LjggMTMuMDE3IEwgNDEuOSAyNS4xMTcgTCAzOCAzMC41MTcgQyAzNy43IDMwLjkxNyAzOCAzMS41MTcgMzguNSAzMS41MTcgTCA0Mi4yIDMxLjUxNyBDIDQyLjYgMzEuNTE3IDQyLjkgMzEuMzE3IDQzLjEgMzEuMDE3IEwgNTUuNiAxMy4wMTcgQyA1NS45IDEyLjcxNyA1NS42IDEyLjExNyA1NS4xIDEyLjExNyBaIj48L3BhdGg+PHBhdGggZmlsbD0iIzAwOWNkZSIgZD0iTSA2Ny41IDQuOTE3IEwgNTkuNyA0LjkxNyBDIDU5LjIgNC45MTcgNTguNyA1LjMxNyA1OC42IDUuODE3IEwgNTUuNSAyNS43MTcgQyA1NS40IDI2LjExNyA1NS43IDI2LjQxNyA1Ni4xIDI2LjQxNyBMIDYwLjEgMjYuNDE3IEMgNjAuNSAyNi40MTcgNjAuOCAyNi4xMTcgNjAuOCAyNS44MTcgTCA2MS43IDIwLjExNyBDIDYxLjggMTkuNjE3IDYyLjIgMTkuMjE3IDYyLjggMTkuMjE3IEwgNjUuMyAxOS4yMTcgQyA3MC40IDE5LjIxNyA3My40IDE2LjcxNyA3NC4yIDExLjgxNyBDIDc0LjUgOS43MTcgNzQuMiA4LjAxNyA3My4yIDYuODE3IEMgNzIgNS42MTcgNzAuMSA0LjkxNyA2Ny41IDQuOTE3IFogTSA2OC40IDEyLjIxNyBDIDY4IDE1LjAxNyA2NS44IDE1LjAxNyA2My44IDE1LjAxNyBMIDYyLjYgMTUuMDE3IEwgNjMuNCA5LjgxNyBDIDYzLjQgOS41MTcgNjMuNyA5LjMxNyA2NCA5LjMxNyBMIDY0LjUgOS4zMTcgQyA2NS45IDkuMzE3IDY3LjIgOS4zMTcgNjcuOSAxMC4xMTcgQyA2OC40IDEwLjUxNyA2OC41IDExLjIxNyA2OC40IDEyLjIxNyBaIj48L3BhdGg+PHBhdGggZmlsbD0iIzAwOWNkZSIgZD0iTSA5MC43IDEyLjExNyBMIDg3IDEyLjExNyBDIDg2LjcgMTIuMTE3IDg2LjQgMTIuMzE3IDg2LjQgMTIuNjE3IEwgODYuMiAxMy42MTcgTCA4NS45IDEzLjIxNyBDIDg1LjEgMTIuMDE3IDgzLjMgMTEuNjE3IDgxLjUgMTEuNjE3IEMgNzcuNCAxMS42MTcgNzMuOSAxNC43MTcgNzMuMiAxOS4xMTcgQyA3Mi44IDIxLjMxNyA3My4zIDIzLjQxNyA3NC42IDI0LjgxNyBDIDc1LjcgMjYuMTE3IDc3LjQgMjYuNzE3IDc5LjMgMjYuNzE3IEMgODIuNiAyNi43MTcgODQuNSAyNC42MTcgODQuNSAyNC42MTcgTCA4NC4zIDI1LjYxNyBDIDg0LjIgMjYuMDE3IDg0LjUgMjYuNDE3IDg0LjkgMjYuNDE3IEwgODguMyAyNi40MTcgQyA4OC44IDI2LjQxNyA4OS4zIDI2LjAxNyA4OS40IDI1LjUxNyBMIDkxLjQgMTIuNzE3IEMgOTEuNCAxMi41MTcgOTEuMSAxMi4xMTcgOTAuNyAxMi4xMTcgWiBNIDg1LjUgMTkuMzE3IEMgODUuMSAyMS40MTcgODMuNSAyMi45MTcgODEuMyAyMi45MTcgQyA4MC4yIDIyLjkxNyA3OS40IDIyLjYxNyA3OC44IDIxLjkxNyBDIDc4LjIgMjEuMjE3IDc4IDIwLjMxNyA3OC4yIDE5LjMxNyBDIDc4LjUgMTcuMjE3IDgwLjMgMTUuNzE3IDgyLjQgMTUuNzE3IEMgODMuNSAxNS43MTcgODQuMyAxNi4xMTcgODQuOSAxNi43MTcgQyA4NS41IDE3LjQxNyA4NS43IDE4LjMxNyA4NS41IDE5LjMxNyBaIj48L3BhdGg+PHBhdGggZmlsbD0iIzAwOWNkZSIgZD0iTSA5NS4xIDUuNDE3IEwgOTEuOSAyNS43MTcgQyA5MS44IDI2LjExNyA5Mi4xIDI2LjQxNyA5Mi41IDI2LjQxNyBMIDk1LjcgMjYuNDE3IEMgOTYuMiAyNi40MTcgOTYuNyAyNi4wMTcgOTYuOCAyNS41MTcgTCAxMDAgNS42MTcgQyAxMDAuMSA1LjIxNyA5OS44IDQuOTE3IDk5LjQgNC45MTcgTCA5NS44IDQuOTE3IEMgOTUuNCA0LjkxNyA5NS4yIDUuMTE3IDk1LjEgNS40MTcgWiI+PC9wYXRoPjwvc3ZnPg==" width="80em"></button>
                                            </div>
                                            \` : \`\` \}
                                            </div>                                            
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
                            let braintree_style = braitreeStyleFn(values);
                            let selected_country = JSON.parse(values.selected_country).selected.split(",");

                            function gPayLogo(textPrefix, buttonColor) {
                                return \`<div id="googlepay_btn" class="row" style="cursor: pointer; margin-top: 10px; border-radius: 6px; box-shadow: 2px 2px 4px \$\{buttonColor === "black" ? "#3c4043" : "#ffffff"\}; background-color: \$\{buttonColor !== "black" ? "#3c4043" : "#ffffff"\};">
                                    \$\{textPrefix === "plain" ? \'\' : \`                                    
                                        <span class="col-6 mx-auto d-flex" style="font-size: 19px; justify-content: end; align-items: center; color: \$\{buttonColor === "black" ? "#3c4043" : "#ffffff"\};"> \$\{textPrefix === "plain" ? \'\' : textPrefix + \' with\'\}  </span>
                                    \`\}
                                    <div class="\$\{textPrefix === "plain" ? \'col-12\' : \'col-6\'\} mx-auto d-flex" style="justify-content: \$\{textPrefix === "plain" ? \'center\' : \'flex-start\'\}; align-items: center;">
                                        <?xml version="1.0" encoding="UTF-8" standalone="no"?>
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation: isolate; width: 9rem; padding: 11px 12px;" x="0px" y="0px" viewBox="882.5 409.4 523 205.2">
                                            <g>
                                                <path d=" M 1126.6 438.7 L 1126.6 490.8 L 1158.7 490.8 C 1166.3 490.8 1172.7 488.2 1177.7 483.1 C 1182.8 478 1185.4 471.8 1185.4 464.8 C 1185.4 457.9 1182.8 451.8 1177.7 446.7 C 1172.7 441.4 1166.4 438.8 1158.7 438.8 L 1126.6 438.8 L 1126.6 438.7 L 1126.6 438.7 L 1126.6 438.7 Z  M 1230.4 538.3 C 1230.4 543.3 1232.5 547.5 1236.8 550.8 C 1241 554.1 1246 555.8 1251.7 555.8 C 1259.8 555.8 1267 552.8 1273.3 546.8 C 1279.6 540.8 1282.8 533.8 1282.8 525.7 C 1276.8 521 1268.5 518.6 1257.8 518.6 C 1250 518.6 1243.5 520.5 1238.3 524.2 C 1233 528.1 1230.4 532.8 1230.4 538.3 L 1230.4 538.3 L 1230.4 538.3 Z  M 1126.6 509.2 L 1126.6 569.7 L 1107.4 569.7 L 1107.4 420.3 L 1158.3 420.3 C 1171.2 420.3 1182.2 424.6 1191.2 433.2 C 1200.4 441.8 1205 452.3 1205 464.7 C 1205 477.4 1200.4 487.9 1191.2 496.4 C 1182.3 504.9 1171.3 509.1 1158.3 509.1 L 1126.6 509.1 L 1126.6 509.2 L 1126.6 509.2 L 1126.6 509.2 Z  M 1255.2 464.1 C 1269.4 464.1 1280.6 467.9 1288.8 475.5 C 1297 483.1 1301.1 493.5 1301.1 506.7 L 1301.1 569.7 L 1282.8 569.7 L 1282.8 555.5 L 1282 555.5 C 1274.1 567.2 1263.5 573 1250.3 573 C 1239 573 1229.6 569.7 1222 563 C 1214.4 556.3 1210.6 548 1210.6 538 C 1210.6 527.4 1214.6 519 1222.6 512.8 C 1230.6 506.5 1241.3 503.4 1254.6 503.4 C 1266 503.4 1275.4 505.5 1282.7 509.7 L 1282.7 505.3 C 1282.7 498.6 1280.1 493 1274.8 488.3 C 1269.5 483.6 1263.3 481.3 1256.2 481.3 C 1245.5 481.3 1237 485.8 1230.8 494.9 L 1213.9 484.3 C 1223.2 470.8 1237 464.1 1255.2 464.1 L 1255.2 464.1 L 1255.2 464.1 Z  M 1405.5 467.4 L 1341.5 614.6 L 1321.7 614.6 L 1345.5 563.1 L 1303.3 467.4 L 1324.2 467.4 L 1354.6 540.8 L 1355 540.8 L 1384.6 467.4 L 1405.5 467.4 Z " fill-rule="evenodd" fill="\$\{buttonColor === "black" ? "#3c4043" : "#ffffff"\}"/>
                                                <path d=" M 1050.23 497 C 1050.23 490.74 1049.67 484.75 1048.63 478.99 L 968.15 478.99 L 968.15 511.99 L 1014.5 512 C 1012.62 522.98 1006.57 532.34 997.3 538.58 L 997.3 559.99 L 1024.89 559.99 C 1041 545.08 1050.23 523.04 1050.23 497 Z " fill="rgb(66,133,244)"/>
                                                <path d=" M 997.31 538.58 C 989.63 543.76 979.74 546.79 968.17 546.79 C 945.82 546.79 926.86 531.73 920.07 511.43 L 891.61 511.43 L 891.61 533.51 C 905.71 561.49 934.69 580.69 968.17 580.69 C 991.31 580.69 1010.75 573.08 1024.9 559.98 L 997.31 538.58 Z " fill="rgb(52,168,83)"/>
                                                <path d=" M 917.39 495.05 C 917.39 489.35 918.34 483.84 920.07 478.66 L 920.07 456.58 L 891.61 456.58 C 885.78 468.15 882.5 481.21 882.5 495.05 C 882.5 508.89 885.79 521.95 891.61 533.52 L 920.07 511.44 C 918.34 506.26 917.39 500.75 917.39 495.05 Z " fill="rgb(250,187,5)"/>
                                                <path d=" M 968.17 443.3 C 980.8 443.3 992.11 447.65 1001.04 456.15 L 1025.49 431.72 C 1010.64 417.89 991.28 409.4 968.17 409.4 C 934.7 409.4 905.71 428.6 891.61 456.58 L 920.07 478.66 C 926.86 458.36 945.82 443.3 968.17 443.3 Z " fill="rgb(233,66,53)"/>
                                            </g>
                                        </svg>
                                    </div>
                                </div>\`
                            }

                            return \`
                                \$\{form_style\}
                                \$\{input_style\}
                                \$\{button_style\}
                                \$\{content_style\}
                                \$\{braintree_style\}
                                
                                <div id="braintree-form">
                                    <div class="form-container">                                                                                
                                        <form id="paymentForm" class="payment-form" style="display: inline-block; max-width: 100%; width: 100%;">
                                            <div class="card-wrapper"></div>
                                            <h4 style="margin: 0 0 5px;">\$\{values.formHeader\}</h4>
                                            <div class="half-left">
                                                <input type="text" name="firstName" placeholder="\$\{values.firstName\}" required />
                                            </div>
                                            <div class="half-right">
                                                <input type="text" name="lastName" placeholder="\$\{values.lastName\}" required />
                                            </div>
                                            <input type="email" name="email" autocomplete="on" maxlength="40" placeholder="\$\{values.email\}" required />
                                            <div style=\$\{!values.enablePhone ? "display:none" : ""\}>

                                            ${faddons.phoneElement}
                                            </div>
                                            <input type="text" name="address" autocomplete="on" maxlength="45" placeholder="\$\{values.address\}" required />
                                            <input type="text" name="city" autocomplete="on" maxlength="45" placeholder="\$\{values.city\}" required />
                                            <input type="text" name="zipcode" autocomplete="on" pattern="[0-9]*" maxlength="5" placeholder="\$\{values.zipcode\}" required />
                                            ${faddons.statelist}
                                            ${faddons.countrylist}
                        
                                            <h4 style="margin: 0 0 5px;">\$\{values.creditCard\}</h4>
                                            
                                            <input type="hidden" name="dataValue" id="dataValue" />
                                            <input type="hidden" name="dataDescriptor" id="dataDescriptor" />
                                            <input type="hidden" name="productName" id="productName" />
                                            <input type="hidden" name="productPrice" id="productPrice" />
                                            <input type="hidden" name="variantName" id="variantName" />
                                            <input type="hidden" name="tokens" value="${encryptedKeys}" />
                                            <input type="hidden" name="testMode" value="\$\{!values.testMode\}" />
                                            <input type="hidden" name="merchantType" value="braintree" />

                                            
                                            <div id="billing_\$\{values._meta.htmlID\}" style="display: none;">
                                                <div class="half-left">
                                                    <input type="text" name="billing_firstName" placeholder="First Name" required />
                                                </div>
                                                <div class="half-right">
                                                    <input type="text" name="billing_lastName" placeholder="Last Name" required />
                                                </div>
                                                <input type="text" name="billing_address" autocomplete="on" maxlength="45" placeholder="Street Address" required />
                                                <input type="text" name="billing_city" autocomplete="on" maxlength="45" placeholder="City" required />
                                                <input type="text" name="billing_zipcode" autocomplete="on" pattern="[0-9]*" maxlength="5" placeholder="ZIP code" required />
                                                
                                                ${faddons.statelist}
                                                ${faddons.countrylist}
                                            </div>

                                            <div id="cardNumber" class="hosted-field"></div>

                                            <div class="half-left">
                                                <div id="expiry" class="hosted-field"></div>
                                            </div>
                                        
                                            <div class="half-right">
                                                <div id="cvv" class="hosted-field"></div>
                                            </div>
                                        
                                            <div class="full" style="text-align:\$\{values.alignment\}">
                                            <button type="submit" id="submitbutton" class="\$\{values.animation\}" type="submit">
                                                \$\{values.text\}
                                                <div class="subtext">\$\{values.subText\}</div>
                                            </button>
                                            \$\{values.activateGpay ? gPayLogo(values.gpay_text, values.gpay_button_design) : \`\` \}
                                            \$\{values.activatePaypal ? \`
                                            <div class="full" style="text-align:center;margin-top: 10px;">
                                                <div id="paypal_btn"></div>
                                            </div>
                                            \` : \`\` \}
                                            </div>
                                            <button style="display:none" id="create-button" disabled type="button">Create</button>
                                            <button style="display:none" id="teardown-button" type="button">Teardown</button>
                                            <button style="display:none" id="clear-button" type="button">Clear Payment Method</button>
                                        </form>
                                    </div>
                                </div>

                                <script src="https://js.braintreegateway.com/web/3.82.0/js/hosted-fields.js"></script>
                                <script src="https://js.braintreegateway.com/web/3.82.0/js/client.js"></script>

                                \$\{values.activateGpay ? \`
                                <!-- google pay script -->
                                <script src="https://pay.google.com/gp/p/js/pay.js"></script>
                                <script src="https://js.braintreegateway.com/web/3.82.0/js/google-payment.min.js"></script>
                                \` : \`\` \}

                                \$\{values.activatePaypal ? \`
                                <!-- Load the PayPal Checkout component. -->
                                <script src="https://js.braintreegateway.com/web/3.82.0/js/paypal-checkout.min.js"></script>
                                \` : \`\` \}

                               
                                <script>
                                var sourcePR
                                // TODO: to be removed        
                                try {
                                    ${page_data.funnel_everflow ? ` EF.customParamProvider.then(el => {
                                        sourcePR = window.location.origin + window.location.pathname + "?effp=" + el.effp + "&transaction_id=" + JSON.parse(localStorage.getItem("ef_tid_c_o_" + localStorage.getItem("plgoid"))).value + "&event_id=0&oid=" + localStorage.getItem("plgoid") + "&amount=" + "PLGAMOUNT" + "&event_source_url="+ window.location.host + "&shopifyOrderId="
                                        })` : `sourcePR = window.location.href `
            }
                                } catch (error) {
                                    console.log(error)
                                }
                                localStorage.removeItem("plg_email_id");
                                localStorage.removeItem("plg_prod_list");
                                localStorage.removeItem("authorize_customer_ids");
                                localStorage.removeItem("cod_data");
                                localStorage.removeItem("cod_currency");
                                var trackPurchased;
                                var isSameAsShippingAddress = true;
                                function toggleBillingAddress(event){
                                    isSameAsShippingAddress = !isSameAsShippingAddress;
                                    var billingDOM = document.getElementById("billing_\$\{values._meta.htmlID\}");
                                    if(billingDOM.style.display == "none"){
                                        billingDOM.style.display = "block";
                                        event.innerText = "\$\{values.billingAddress2\}";
                                    } else {
                                        billingDOM.style.display = "none";
                                        event.innerText = "\$\{values.billingAddress1\}";
                                    }
                                }
                                var form = document.querySelector('#paymentForm');
                                var submit = form.querySelector('#submitbutton');

                                \$\{values.activateGpay ? \`
                                var google_pay_submit = document.querySelector("#googlepay_btn");
                                \` : \`\` \}                                


                                var authorizationInit = "${encryptedKeys}";

                                // will come from the generate token client
                                function generateToken(callback) {
                                    fetch('/braintree-generate-token', {
                                        method: "POST",
                                        headers: {
                                            'Content-type': "application/json"
                                        },
                                        body: JSON.stringify({
                                            authToken: authorizationInit,
                                            live: \$\{!values.testMode\}
                                        })
                                    }).then(res => res.json()).then(res => {
                                        callback(res);
                                    }).catch(err => {
                                        callback({ error: err?.message })
                                    })
                                }

                                generateToken(response => {
                                    if (response?.error) {
                                        alert("Invalid Authentication");
                                    }
                                    authorization = response?.token;

                                    \$\{values.activatePaypal ? \`
                                    //start code for paypal pay       
                                    braintree.client.create({
                                        authorization: authorization
                                    }, function (clientErr, clientInstance) {

                                        // Stop if there was a problem creating the client.
                                        // This could happen if there is a network error or if the authorization
                                        // is invalid.
                                        if (clientErr) {
                                            console.error('Error creating client:', clientErr);
                                            return;
                                        }

                                        // Create a PayPal Checkout component.
                                        braintree.paypalCheckout.create({
                                            client: clientInstance
                                        }, function (paypalCheckoutErr, paypalCheckoutInstance) {
                                            paypalCheckoutInstance.loadPayPalSDK({
                                                currency: plg_selectedVariant?.currency?.word ?? 'USD',
                                                intent: 'capture'
                                            }, function () {
                                                paypal.Buttons({
                                                    fundingSource: paypal.FUNDING.PAYPAL,

                                                    createOrder: function () {
                                                        const formToObject = form => Array.from(new FormData(form)).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
                                                        var formValue = formToObject(document.getElementById("paymentForm"));

                                                        return paypalCheckoutInstance.createPayment({
                                                            flow: 'checkout', // Required
                                                            amount: Number(plg_price), // Required
                                                            currency: plg_selectedVariant?.currency?.word ?? 'USD', // Required, must match the currency passed in with loadPayPalSDK

                                                            intent: 'capture', // Must match the intent passed in with loadPayPalSDK

                                                            enableShippingAddress: true,
                                                            shippingAddressEditable: false,
                                                            requestBillingAgreement: true,
                                                        });
                                                    },

                                                    onApprove: function (data, actions) {
                                                        return paypalCheckoutInstance.tokenizePayment(data, function (err, payload) {
                                                            // Submit payload.nonce to your server
                                                            if (err) {
                                                                console.log(err);

                                                            }
                                                            console.log(payload);
                                                            let payPalDetails = payload.details;
                                                            let payPalUserInfo = {
                                                                firstName: payPalDetails.firstName,
                                                                lastName: payPalDetails.lastName,
                                                                email: payPalDetails.email,
                                                                phone: payPalDetails.phone,
                                                                billingAddress: payPalDetails.shippingAddress.line1 + payPalDetails.shippingAddress.line2, zipcode: payPalDetails.shippingAddress.postalCode,
                                                                country: payPalDetails.shippingAddress.countryCode,
                                                            }
                                                            console.log(payPalUserInfo);

                                                            fetch('/create-customer-charge-braintree', {
                                                                method: 'post',
                                                                headers: {
                                                                    Accept: 'application/json, text/plain, */*',
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify({ plgCustomer: payPalUserInfo, paymentMethodNonce: payload.nonce, amount: plg_price, tokens: authorizationInit, env: "\$\{!values.testMode\}" }),
                                                            })
                                                                .then((result) => result.json())
                                                                .then((result) => {
                                                                    console.log(result, 'result');
                                                                    if (result.success) {
                                                                        const formToObject = form => Array.from(new FormData(form)).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
                                                                        var formValue = formToObject(document.getElementById("paymentForm"));
                
                                                                        var productName = plg_selectedVariant.product_name;
                                                                        var plg_qty = plg_selectedVariant.variant_qty ? parseInt(plg_selectedVariant.variant_qty) : 1;
                                                                        var currency_word = plg_selectedVariant.currency ? plg_selectedVariant.currency.word : "USD";
                                                                        var currency_symbol = plg_selectedVariant.currency ? plg_selectedVariant.currency.code : "$";
                                                                        console.log("success ==>  saving the product  ==> ", result)
                                                                        document.getElementById("productName").value = plg_selectedVariant.product_name;
                                                                        document.getElementById("productPrice").value = plg_price;
                                                                        document.getElementById("variantName").value = plg_selectedVariant.variant_name;

                                                                        formValue.productPrice = parseFloat(plg_price).toFixed(2);
                                                                        formValue.tags = plg_selectedVariant.tags;
                                                                        formValue.productName = plg_selectedVariant.product_name;
                                                                        formValue.variantName = plg_selectedVariant.variant_name;
                                                                        formValue.cog = plg_selectedVariant.cog ? plg_selectedVariant.cog : 0;
                                                                        plgQS() !== "" ? formValue.campaign_src = plgQS() : void 0;

                                                                        if (isSameAsShippingAddress) {
                                                                            formValue.billing_address = formValue.address
                                                                            formValue.billing_city = formValue.city
                                                                            formValue.billing_country = formValue.country
                                                                            formValue.billing_firstName = formValue.firstName
                                                                            formValue.billing_lastName = formValue.lastName
                                                                            formValue.billing_state = formValue.state
                                                                            formValue.billing_zipcode = formValue.zipcode
                                                                        }

                                                                        formValue.variant_id = plg_selectedVariant.variant_id; // for shopify variant id
                                                                        if (!trackPurchased) {
                                                                            trackPurchased = true;
                                                                            if (false) {
                                                                                if (typeof fbq !== "undefined") fbq("track", "Purchase", { value: parseFloat(plg_price), currency: plg_selectedVariant.currency ? plg_selectedVariant.currency.word : "USD" });
                                                                            }
                                                                        }
                                                                        false

                                                                        console.log(result?.transaction?.creditCard)

                                                                        // typeof setPurchased !== "undefined" ? setPurchased() : void 0; // for analytics
                                                                        var combine = {
                                                                            ...formValue,
                                                                            tk: result.transaction.paypalAccount.implicitlyVaultedPaymentMethodToken,
                                                                            source_link: sourcePR,
                                                                            customerID: getRandomString("bt_"),
                                                                            metadata: {
                                                                                meta: "${encryptString(user_id)}",
                                                                                pageid: "${page_data.funnel_id}"
                                                                            }
                                                                        }

                                                                        saveBraintreeInitialData(combine, res => {
                                                                            var x_checkout = [{
                                                                                product_url: window.location.href,
                                                                                product_name: plg_selectedVariant.product_name,
                                                                                variant_name: plg_selectedVariant.variant_name,
                                                                                product_price: parseFloat(plg_price),
                                                                                upsellToken: result.transaction.paypalAccount.implicitlyVaultedPaymentMethodToken
                                                                            }]
                                                                            localStorage.setItem("plg_prod_list", JSON.stringify(x_checkout));

                                                                            // encodes the id
                                                                            localStorage.setItem("braintree_user_ids", btoa(JSON.stringify(combine)))
                                                                            localStorage.setItem("live", "\$\{!values.testMode\}")


                                                                            localStorage.setItem("funnel_customer_name", formValue.firstName + " " + formValue.lastName)
                                                                            localStorage.setItem("funnel_customer_email", formValue.email)

                                                                            // Harshit ---
                                                                            // if success then checks if the order bump (subscription) is checked
                                                                            // if yes then it will create the subscription

                                                                            if (document.getElementById('braintree_order_bump')) {
                                                                                var sub_orderbump = document.getElementById('braintree_order_bump_id');
                                                                                // console.log(sub_orderbump.checked)
                                                                                if (sub_orderbump.checked) {                                                                                    
                                                                                    subscription_orderBump(document.getElementById('braintree_order_bump')).then(res => {
                                                                                        console.log(res)
                                                                                        setTimeout(() => window.open("\$\{values.buttonLink.url\}","\$\{values.buttonLink.target\}"), 3000)
                                                                                    })
                                                                                } else {
                                                                                    setTimeout(() => window.open("\$\{values.buttonLink.url\}","\$\{values.buttonLink.target\}"), 3000)
                                                                                }
                                                                            } else {
                                                                                setTimeout(() => window.open("\$\{values.buttonLink.url\}","\$\{values.buttonLink.target\}"), 3000)
                                                                            }

                                                                        }, error => {
                                                                            hide_show_loading();
                                                                            alert("An error has occured");
                                                                        })

                                                                    } else {
                                                                        console.log('failed')
                                                                    }

                                                                });

                                                        });
                                                    },

                                                    onCancel: function (data) {
                                                        console.log('PayPal payment cancelled', JSON.stringify(data, 0, 2));
                                                    },

                                                    onError: function (err) {
                                                        console.error('PayPal error', err);
                                                    }
                                                }).render('#paypal_btn').then(function () {
                                                    // The PayPal button will be rendered in an html element with the ID
                                                    // paypal-button. This function will be called when the PayPal button
                                                    // is set up and ready to be used
                                                });

                                            });

                                        });

                                    });
                                    //end code for paypal
                                    \` : \`\` \}

                                    \$\{values.activateGpay ? \`

                                    //=============================================google pay start code========================
                                    google_pay_submit.disabled = false;
                                    var paymentsClient = new google.payments.api.PaymentsClient({
                                        environment: '\$\{!values.testMode ? "TEST" : "PRODUCTION" \}',
                                    });

                                    // console.log(authorization)
                                    braintree.client.create({
                                        authorization: authorization
                                    }, function (clientErr, clientInstance) {
                                        console.log(clientErr)
                                        console.log(clientInstance)
                                        braintree.googlePayment.create({
                                            client: clientInstance,
                                            googlePayVersion: 2,
                                            googleMerchantId: '\$\{values.testMode ? values.gpay_merchantId : "merchant-id-from-google" \}' // Optional in sandbox; if set in sandbox, this value must be a valid production Google Merchant ID
                                        }, function (googlePaymentErr, googlePaymentInstance) {
                                            if (googlePaymentErr) {
                                                console.log(googlePaymentErr);
                                                return;
                                            }
                                            paymentsClient.isReadyToPay({
                                                apiVersion: 2,
                                                apiVersionMinor: 0,
                                                allowedPaymentMethods: [
                                                    {
                                                        type: "CARD",
                                                        parameters: {
                                                            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                                                            allowedCardNetworks: ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERgooglePaymentInstanceCARD", "VISA"]
                                                        }
                                                    }
                                                ],
                                                existingPaymentMethodRequired: true
                                                //   existingPaymentMethodRequired: true 
                                            }).then(function (response) {
                                                console.log(response);
                                                if (response.result) {
                                                    console.log(document.getElementById("productPrice").value = plg_price);
                                                    google_pay_submit.addEventListener('click', function (event) {
                                                        event.preventDefault();
                                                        const formToObject = form => Array.from(new FormData(form)).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
                                                        var formValue = formToObject(document.getElementById("paymentForm"));

                                                        var paymentDataRequest = googlePaymentInstance.createPaymentDataRequest({
                                                            transactionInfo: {
                                                                currencyCode: plg_selectedVariant.currency ? plg_selectedVariant.currency.word : 'USD',
                                                                totalPriceStatus: 'FINAL',
                                                                totalPrice: plg_price // Your amount
                                                            }
                                                        });

                                                        console.log(paymentDataRequest, "Google Pay paymentDataRequestpaymentDataRequest")

                                                        // We recommend collecting billing address information, at minimum
                                                        // billing postal code, and passing that billing postal code with all
                                                        // Google Pay card transactions as a best practice.
                                                        // See all available options at https://developers.google.com/pay/api/web/                                   reference/object
                                                        var cardPaymentMethod = paymentDataRequest.allowedPaymentMethods[0];
                                                        cardPaymentMethod.parameters.billingAddressRequired = true;
                                                        cardPaymentMethod.parameters.billingAddressParameters = {
                                                            format: 'FULL',
                                                        };

                                                        paymentsClient.loadPaymentData(paymentDataRequest).then(function (paymentData) {

                                                            console.log(paymentData)
                                                            let googleCardInfo = paymentData.paymentMethodData.info.billingAddress;
                                                            let googleToken = paymentData.paymentMethodData.tokenizationData;
                                                            let googleFormvalue = {
                                                                firstName: googleCardInfo.name,
                                                                billingAddress: googleCardInfo.address1 + googleCardInfo.address2,
                                                                tokens: googleToken.token,
                                                                zipcode: googleCardInfo.postalCode,
                                                                country: googleCardInfo.countryCode,

                                                            }
                                                            googlePaymentInstance.parseResponse(paymentData, function (err, result) {
                                                                if (err) {
                                                                    // Handle parsing error
                                                                    console.log(err)
                                                                }
                                                                console.log(result, "the googlePaymentInstance result");
                                                                fetch('/create-customer-charge-braintree', {
                                                                    method: 'post',
                                                                    headers: {
                                                                        Accept: 'application/json, text/plain, */*',
                                                                        'Content-Type': 'application/json',
                                                                    },
                                                                    body: JSON.stringify({ plgCustomer: googleFormvalue, paymentMethodNonce: result.nonce, amount: plg_price, tokens: authorizationInit, env: "\$\{!values.testMode\}" }),
                                                                })
                                                                    .then((result) => result.json())
                                                                    .then((result) => {
                                                                        console.log(result, "the fetch result");


                                                                        if (result.success) {
                                                                            var productName = plg_selectedVariant.product_name;
                                                                            var plg_qty = plg_selectedVariant.variant_qty ? parseInt(plg_selectedVariant.variant_qty) : 1;
                                                                            var currency_word = plg_selectedVariant.currency ? plg_selectedVariant.currency.word : "USD";
                                                                            var currency_symbol = plg_selectedVariant.currency ? plg_selectedVariant.currency.code : "$";
                                                                            console.log("success ==>  saving the product  ==> ", result)
                                                                            document.getElementById("productName").value = plg_selectedVariant.product_name;
                                                                            document.getElementById("productPrice").value = plg_price;
                                                                            document.getElementById("variantName").value = plg_selectedVariant.variant_name;


                                                                            formValue.productPrice = parseFloat(plg_price).toFixed(2);
                                                                            formValue.tags = plg_selectedVariant.tags;
                                                                            formValue.productName = plg_selectedVariant.product_name;
                                                                            formValue.variantName = plg_selectedVariant.variant_name;
                                                                            formValue.cog = plg_selectedVariant.cog ? plg_selectedVariant.cog : 0;
                                                                            // formValue.source_link = window.location.href;
                                                                            plgQS() !== "" ? formValue.campaign_src = plgQS() : void 0;

                                                                            if (isSameAsShippingAddress) {
                                                                                formValue.billing_address = formValue.address
                                                                                formValue.billing_city = formValue.city
                                                                                formValue.billing_country = formValue.country
                                                                                formValue.billing_firstName = formValue.firstName
                                                                                formValue.billing_lastName = formValue.lastName
                                                                                formValue.billing_state = formValue.state
                                                                                formValue.billing_zipcode = formValue.zipcode
                                                                            }

                                                                            formValue.variant_id = plg_selectedVariant.variant_id; // for shopify variant id
                                                                            if (!trackPurchased) {
                                                                                trackPurchased = true;
                                                                                if (false) {
                                                                                    if (typeof fbq !== "undefined") fbq("track", "Purchase", { value: parseFloat(plg_price), currency: plg_selectedVariant.currency ? plg_selectedVariant.currency.word : "USD" });
                                                                                }
                                                                            }
                                                                            false

                                                                            console.log(result?.transaction?.creditCard)

                                                                            // typeof setPurchased !== "undefined" ? setPurchased() : void 0; // for analytics
                                                                            var combine = {
                                                                                ...formValue,
                                                                                tk: result.transaction.creditCard.token,
                                                                                source_link: sourcePR,
                                                                                customerID: getRandomString("bt_"),
                                                                                metadata: {
                                                                                    meta: "${encryptString(user_id)}",
                                                                                    pageid: "${page_data.funnel_id}"
                                                                                }
                                                                            }

                                                                            saveBraintreeInitialData(combine, res => {
                                                                                var x_checkout = [{
                                                                                    product_url: window.location.href,
                                                                                    product_name: plg_selectedVariant.product_name,
                                                                                    variant_name: plg_selectedVariant.variant_name,
                                                                                    product_price: parseFloat(plg_price),
                                                                                    upsellToken: result.transaction.creditCard.token
                                                                                }]
                                                                                localStorage.setItem("plg_prod_list", JSON.stringify(x_checkout));

                                                                                // encodes the id
                                                                                localStorage.setItem("braintree_user_ids", btoa(JSON.stringify(combine)))
                                                                                localStorage.setItem("live", "\$\{!values.testMode\}")


                                                                                localStorage.setItem("funnel_customer_name", formValue.firstName + " " + formValue.lastName)
                                                                                localStorage.setItem("funnel_customer_email", formValue.email)

                                                                                // Harshit ---
                                                                                // if success then checks if the order bump (subscription) is checked
                                                                                // if yes then it will create the subscription

                                                                                if (document.getElementById('braintree_order_bump')) {
                                                                                    var sub_orderbump = document.getElementById('braintree_order_bump_id');
                                                                                    console.log(sub_orderbump.checked)
                                                                                    if (sub_orderbump.checked) {
                                                                                        console.log("order bump here");
                                                                                        subscription_orderBump(document.getElementById('braintree_order_bump')).then(res => {
                                                                                            console.log(res)
                                                                                            setTimeout(() => window.open("\$\{values.buttonLink.url\}","\$\{values.buttonLink.target\}"), 3000)
                                                                                        })
                                                                                    } else {
                                                                                        setTimeout(() => window.open("\$\{values.buttonLink.url\}","\$\{values.buttonLink.target\}"), 3000)
                                                                                    }
                                                                                } else {
                                                                                    setTimeout(() => window.open("\$\{values.buttonLink.url\}","\$\{values.buttonLink.target\}"), 3000)
                                                                                }

                                                                            }, error => {
                                                                                hide_show_loading();
                                                                                alert("An error has occured");
                                                                            })

                                                                        } else {
                                                                            console.log('failed')
                                                                        }

                                                                    });
                                                            });
                                                        }).catch(function (err) {
                                                            console.log(err)
                                                            alert("An error has occured on your payment credentials");
                                                            // Handle errors
                                                        });
                                                    });
                                                }
                                            }).catch(function (err) {
                                                // Handle errors
                                            });
                                        })
                                        // Set up other Braintree components
                                    });
                                    // end of for google pay =======================================

                                    \`: \`\` \}

                                    braintree.client.create({
                                        authorization: authorization
                                      }, function (clientErr, clientInstance) {
                                        if (clientErr) {
                                            console.error(clientErr);
                                            return;
                                        }
        
                                        braintree.hostedFields.create({
                                            client: clientInstance,
                                            styles: {
                                                'input': {
                                                    'font-size': '12px'
                                                },
                                                'input.invalid': {
                                                    'color': 'red'
                                                },
                                                'input.valid': {
                                                    'color': 'green'
                                                }
                                            },
                                            fields: {
                                                number: {
                                                    container: '#cardNumber',
                                                    placeholder: 'Card number e.g. 4111 1111 1111 1111'
                                                },
                                                cvv: {
                                                    container: '#cvv',
                                                    placeholder: 'CVV'
                                                },
                                                expirationDate: {
                                                    container: '#expiry',
                                                    placeholder: 'Expiration date e.g. 10/2022'
                                                }
                                            }
                                        }, function (hostedFieldsErr, instance) {
                                            if (hostedFieldsErr) {
                                                console.error(hostedFieldsErr);
                                                return;
                                            }
                                      
                                            // Once the fields are initialized enable the submit button
                                            submit.disabled = false;
        
                                            // Initialize the form submit event
                                            submit.addEventListener('click', function (event) {
                                                event.preventDefault();
                                                const formToObject = form => Array.from(new FormData(form)).reduce((acc, [key, value]) => ({...acc,[key]: value}),{});
                                                var formValue = formToObject(document.getElementById("paymentForm"));
                                                instance.tokenize(function (tokenizeErr, payload) {
                                                    if (tokenizeErr) {
                                                        console.error(tokenizeErr);
                                                        return;
                                                    }
                                                    fetch('/create-customer-charge-braintree', {
                                                        method: 'post',
                                                        headers: {
                                                            Accept: 'application/json, text/plain, */*',
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify({plgCustomer: formValue, paymentMethodNonce: payload.nonce, amount: plg_price, tokens: "${encryptedKeys}", env: '\$\{!values.testMode\}'  }),
                                                    })
                                                        .then((result) => result.json())
                                                        .then((result) => {
                                                            instance.teardown(function (teardownErr) {
                                                                if (teardownErr) {
                                                                    console.error('Could not tear down the Hosted Fields form!');
                                                                } else {
                                                                    console.info('Hosted Fields form has been torn down!');
                                                                    // Remove the 'Submit payment' button
                                                                }
                                                            });
                                                            if(result.success){
                                                                  var productName = plg_selectedVariant.product_name;
                                                                  var plg_qty = plg_selectedVariant.variant_qty ? parseInt(plg_selectedVariant.variant_qty) : 1;
                                                                  var currency_word = plg_selectedVariant.currency ? plg_selectedVariant.currency.word : "USD";
                                                                  var currency_symbol = plg_selectedVariant.currency ? plg_selectedVariant.currency.code : "$";
                                                                  console.log("success ==>  saving the product  ==> ", result) 
                                                                  document.getElementById("productName").value = plg_selectedVariant.product_name;
                                                                  document.getElementById("productPrice").value = plg_price;
                                                                  document.getElementById("variantName").value = plg_selectedVariant.variant_name;
                                                                  
                                                                  formValue.productPrice = parseFloat(plg_price).toFixed(2);
                                                                  formValue.tags = plg_selectedVariant.tags;
                                                                  formValue.productName = plg_selectedVariant.product_name;
                                                                  formValue.variantName = plg_selectedVariant.variant_name;
                                                                  formValue.cog = plg_selectedVariant.cog ? plg_selectedVariant.cog : 0;
                                                                  // formValue.source_link = window.location.href;
                                                                  plgQS() !== "" ? formValue.campaign_src = plgQS() : void 0;
                                                                  
                                                                  if(isSameAsShippingAddress){
                                                                    formValue.billing_address = formValue.address
                                                                    formValue.billing_city = formValue.city
                                                                    formValue.billing_country = formValue.country
                                                                    formValue.billing_firstName = formValue.firstName
                                                                    formValue.billing_lastName = formValue.lastName
                                                                    formValue.billing_state = formValue.state
                                                                    formValue.billing_zipcode = formValue.zipcode
                                                                  }
      
                                                              formValue.variant_id = plg_selectedVariant.variant_id; // for shopify variant id
                                                                if (!trackPurchased) {
                                                                  trackPurchased = true;
                                                                      if (\$\{values.fbPurchase\}) {
                                                                          if (typeof fbq !== "undefined") fbq("track", "Purchase", { value: parseFloat(plg_price), currency: plg_selectedVariant.currency ? plg_selectedVariant.currency.word : "USD" });
                                                                      }
                                                                }
                                                              ${page_data.funnel_everflow && `sourcePR = sourcePR.replace('PLGAMOUNT', parseFloat(plg_price))`}
                                                             
                                                                console.log(result?.transaction?.creditCard)
                                                                
                                                                  typeof setPurchased !== "undefined" ? setPurchased() : void 0; // for analytics
                                                                  var combine = {
                                                                      ...formValue,
                                                                      tk: result.transaction.creditCard.token, 
                                                                      source_link: sourcePR,
                                                                      customerID: getRandomString("bt_"),
                                                                      metadata: {
                                                                          meta: "${encryptString(user_id)}",
                                                                          pageid: "${page_data.funnel_id}"
                                                                      }
                                                                  }
      
                                                                  saveBraintreeInitialData(combine, res => {
                                                                    var x_checkout = [{
                                                                        product_url: window.location.href,
                                                                        product_name: plg_selectedVariant.product_name,
                                                                        variant_name: plg_selectedVariant.variant_name,
                                                                        product_price: parseFloat(plg_price),
                                                                        upsellToken: result.transaction.creditCard.token
                                                                    }]
                                                                    localStorage.setItem("plg_prod_list", JSON.stringify(x_checkout));
                                                                    localStorage.setItem("braintree_user_ids", btoa(JSON.stringify(combine)))
                                                                    localStorage.setItem("live", "\$\{!values.testMode\}")
                                                                    // for sending order confirmation
                                                                    localStorage.setItem("funnel_customer_name", formValue.firstName+" "+formValue.lastName)
                                                                    localStorage.setItem("funnel_customer_email", formValue.email)
                                                                    // for sending email
                                                                   
      
                                                                    if(document.getElementById('braintree_order_bump')){
                                                                        var sub_orderbump = document.getElementById('braintree_order_bump_id');
                                                                        console.log(sub_orderbump.checked)
                                                                        if(sub_orderbump.checked){
                                                                          subscription_orderBump(document.getElementById('braintree_order_bump')).then(res => {
                                                                              console.log(res)
                                                                              setTimeout(() => window.open("\$\{values.buttonLink.url\}","\$\{values.buttonLink.target\}"), 3000)
                                                                          })
                                                                        } else {
                                                                            setTimeout(() => window.open("\$\{values.buttonLink.url\}","\$\{values.buttonLink.target\}"), 3000)
                                                                        }
                                                                      } else {
                                                                        setTimeout(() => window.open("\$\{values.buttonLink.url\}","\$\{values.buttonLink.target\}"), 3000)
                                                                      }
                                                                    
                                                                }, error => {
                                                                    hide_show_loading();
                                                                    alert("An error has occured");
                                                                })
                                                                
                                                            } else {
                                                                  console.log('failed')
                                                            }                                                             
                                                        });
                                                });
                                            }, false);
                                        });
                                    });
                                });

                                
                              function getDomBySelector(selector){
                                return document.querySelector("#braintree-form "+selector).value;
                            }
                              function verifyBillingAddress(){
                                    if(isSameAsShippingAddress){
                                        return true;
                                    } else {
                                        if(getDomBySelector('input[name="billing_firstName"]') && getDomBySelector('input[name="billing_lastName"]') && getDomBySelector('input[name="billing_address"]') && getDomBySelector('input[name="billing_city"]') && getDomBySelector('input[name="billing_zipcode"]')){
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    }
                                }
                              function getRandomString(text){
                                return text + Math.floor((Math.random() * 1000000000000) + 1);
                              }
                                function hide_show_loading(){
                                    if(document.getElementById("submit_loading")) {
                                        document.getElementById("submit_loading").remove();
                                    } else {
                                        var xx = '<style> #spinner { position: relative; width: 100%; height: 100%; } #spinner:after { content: ""; display: block; position: absolute; width: 80px; height: 80px; margin-left: -40px; margin-top: -40px; border: 5px solid #d1faeb; -moz-border-radius: 50%; -webkit-border-radius: 50%; border-radius: 50%; border-top-color: #3cd2d8; border-right-color: #3cd2d8; -moz-animation: rotate 0.5s linear infinite; -webkit-animation: rotate 0.5s linear infinite; animation: rotate 0.5s linear infinite; } @-moz-keyframes rotate { 0% { -moz-transform: rotateZ(-360deg); transform: rotateZ(-360deg); } 50% { -moz-transform: rotateZ(-180deg); transform: rotateZ(-180deg); } 100% { -moz-transform: rotateZ(0deg); transform: rotateZ(0deg); } } @-webkit-keyframes rotate { 0% { -webkit-transform: rotateZ(-360deg); transform: rotateZ(-360deg); } 50% { -webkit-transform: rotateZ(-180deg); transform: rotateZ(-180deg); } 100% { -webkit-transform: rotateZ(0deg); transform: rotateZ(0deg); } } @keyframes rotate { 0% { -moz-transform: rotateZ(-360deg); -ms-transform: rotateZ(-360deg); -webkit-transform: rotateZ(-360deg); transform: rotateZ(-360deg); } 50% { -moz-transform: rotateZ(-180deg); -ms-transform: rotateZ(-180deg); -webkit-transform: rotateZ(-180deg); transform: rotateZ(-180deg); } 100% { -moz-transform: rotateZ(0deg); -ms-transform: rotateZ(0deg); -webkit-transform: rotateZ(0deg); transform: rotateZ(0deg); } } </style> <div style="position: fixed; width: 100%; height: 100vh; overflow: scroll; z-index: 9999; top: 0; left: 0;"><div style="align-items: center; display: flex; flex-direction: column; margin: auto; min-height: 100%; justify-content: center; background-color: #00000078;"><div style="display: flex; align-items: center; padding: 100px;"><div id="spinner"></div></div></div></div>';
                                        var div = document.createElement("div");
                                        div.id = "submit_loading";
                                        div.innerHTML = xx;
                                        document.body.appendChild(div);
                                        }
                                  }
                                  submit.addEventListener("click", event => {
                                    event.preventDefault()     
                                    if(getDomBySelector('input[name="firstName"]') && getDomBySelector('input[name="lastName"]') && getDomBySelector('input[name="address"]') && getDomBySelector('input[name="city"]') && getDomBySelector('input[name="zipcode"]') && \/^[\\\\\w-\\\\\.]+@([\\\\\w-]+\\\\\.)+[\\\\\w-]{2,4}$\/.test(getDomBySelector('input[name="email"]')) && plg_price && verifyBillingAddress()){                                                                                                                                                                                                                                                                                                                                               
                                    // Sept7 email validation
                                        hide_show_loading();
                                        
                                    } else {
                                        alert("Check your entries (email, phone etc...). All Fields Required.");
                                    }
                                });
                                function checkSelectedCountry(element){
                                  if(element.value == "USA"){
                                      document.getElementById('state-dropdown').style.display = "block";
                                      document.querySelector('#state-dropdown select').value = "AL";
                                  } else {
                                      document.getElementById('state-dropdown').style.display = "none";
                                      document.querySelector('#state-dropdown select').value = "";
                                  }
                              }
                              let form_container = document.querySelector("#braintree-form");
                              let country_dropdown = form_container.querySelector("[name='country']");
                              let state_autofill_script = document.createElement("script");
                              state_autofill_script.src = "https://productlistgenie.com/funnel-genie/js/us.plg.js";
                              form_container.appendChild(state_autofill_script);
                              
                              function saveBraintreeInitialData(result, success, error){
                                  fetch('/braintree-orders-initial', {
                                      method: "POST",
                                      headers: {
                                          'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify(result)
                                  }).then(res => {
                                    success(res)
                                  })
                                  .catch(err => {
                                      console.log(err)
                                  })
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
