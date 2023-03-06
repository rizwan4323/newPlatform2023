let CryptoJS = require('crypto-js');
let gval = require('../../../Global_Values');
let return_url = 'https://app.productlistgenie.io';
const editorTools = require('../../../Editor_Tools');
function encryptString(str) {
	try {
		return CryptoJS.AES.encrypt(str, gval.plg_domain_secret).toString();
	} catch (error) {
		console.log(error);
	}
}
function decode(str) {
	let bytes = CryptoJS.AES.decrypt(str, gval.plg_domain_secret);
	return bytes.toString(CryptoJS.enc.Utf8);
}
module.exports = {
	checkout: function (user_id, page_data, paypalClientIDv2) {
		console.log(paypalClientIDv2);
		const keys = encryptString(paypalClientIDv2);
		console.log(keys);
		const meta = encryptString(user_id);
		const pageid = page_data.funnel_id;

		return `
                                    
console.log("19.7. Initializing authorize subscription upsell...");
unlayer.registerTool({
    type: 'authorize-subscriptionbump', // Todo: Change the name Aug5
    category: 'contents',
    label: 'Bump Subscription',
    icon: '<svg class="svg-inline--fa" viewBox="0.937 12.585 60 7.83" width="60pt" height="7.83pt" class="svg-inline--fa"><path d=" M 4.092 15.153 L 4.12 15.153 L 4.901 17.386 L 3.324 17.386 L 4.092 15.153 Z  M 5.041 20.275 L 8 20.275 L 8 19.94 C 7.427 19.871 7.246 19.829 6.883 18.796 C 6.478 17.707 5.99 16.409 5.543 15.125 L 4.831 13.115 L 4.301 13.255 L 2.11 18.824 C 1.733 19.801 1.593 19.857 0.937 19.926 L 0.937 20.261 L 3.38 20.261 L 3.38 19.926 L 3.115 19.898 C 2.612 19.843 2.598 19.731 2.752 19.187 C 2.891 18.712 3.031 18.238 3.171 17.931 L 5.083 17.931 C 5.25 18.321 5.459 18.894 5.599 19.256 C 5.78 19.717 5.725 19.843 5.334 19.898 L 5.055 19.94 L 5.055 20.275 L 5.041 20.275 Z  M 11.112 16.507 C 11.112 16.116 11.056 16.046 10.777 15.991 L 10.442 15.935 L 10.442 15.628 C 10.986 15.6 11.921 15.502 12.438 15.432 L 12.438 19.103 C 12.438 19.55 12.48 19.675 12.829 19.675 L 13.164 19.675 L 13.164 20.01 C 12.508 20.108 11.824 20.261 11.196 20.415 L 11.112 20.345 L 11.112 19.647 C 10.903 19.801 10.721 19.94 10.484 20.08 C 10.149 20.289 9.884 20.401 9.535 20.401 C 8.628 20.401 8.139 19.801 8.139 18.963 L 8.139 16.507 C 8.139 16.116 8.083 16.046 7.804 15.991 L 7.511 15.935 L 7.511 15.628 C 8.014 15.6 8.893 15.502 9.465 15.432 L 9.465 18.698 C 9.465 19.34 9.786 19.577 10.191 19.577 C 10.498 19.577 10.791 19.438 11.112 19.159 L 11.112 16.507 M 15.104 18.67 C 15.104 19.508 15.508 19.661 15.704 19.661 C 15.871 19.661 16.067 19.605 16.262 19.494 L 16.416 19.815 L 15.48 20.289 C 15.313 20.373 15.145 20.401 15.076 20.401 C 14.238 20.401 13.778 20.038 13.778 19.075 L 13.778 16.074 L 13.08 16.074 L 13.01 15.935 L 13.359 15.516 L 13.778 15.516 L 13.778 14.846 L 14.908 13.995 L 15.09 14.092 L 15.09 15.516 L 16.164 15.516 C 16.304 15.628 16.29 15.977 16.095 16.074 L 15.104 16.074 L 15.104 18.67 Z  M 18.607 16.074 C 18.97 15.711 19.514 15.376 20.086 15.376 C 21.077 15.376 21.607 15.991 21.607 17.009 L 21.607 19.201 C 21.607 19.801 21.663 19.843 22.263 19.926 L 22.263 20.261 L 19.723 20.261 L 19.723 19.926 C 20.254 19.857 20.295 19.815 20.295 19.201 L 20.295 17.121 C 20.295 16.451 19.919 16.172 19.472 16.172 C 19.179 16.172 18.858 16.284 18.621 16.521 L 18.621 19.201 C 18.621 19.801 18.677 19.843 19.123 19.926 L 19.123 20.261 L 16.499 20.261 L 16.499 19.926 C 17.225 19.857 17.281 19.815 17.281 19.201 L 17.281 13.967 C 17.281 13.325 17.253 13.311 16.569 13.269 L 16.569 12.962 C 17.044 12.892 17.881 12.739 18.607 12.585 L 18.607 16.074 Z  M 23.938 17.568 C 23.938 16.395 24.399 15.823 24.831 15.823 C 25.529 15.823 25.934 16.661 25.934 18.098 C 25.934 19.661 25.446 19.926 25.055 19.926 C 24.371 19.94 23.938 18.935 23.938 17.568 M 24.999 15.376 C 23.785 15.376 22.445 16.284 22.445 18 C 22.445 19.159 23.282 20.387 24.943 20.387 C 26.185 20.387 27.441 19.536 27.441 17.777 C 27.441 16.521 26.506 15.376 24.999 15.376 L 24.999 15.376 Z  M 29.758 19.215 C 29.758 19.815 29.814 19.857 30.637 19.94 L 30.637 20.275 L 27.693 20.275 L 27.693 19.94 C 28.376 19.871 28.432 19.829 28.432 19.215 L 28.432 16.814 C 28.432 16.158 28.418 16.144 27.72 16.06 L 27.72 15.767 C 28.349 15.684 29.046 15.53 29.758 15.376 L 29.758 16.451 L 29.786 16.451 C 29.926 16.228 30.093 15.977 30.289 15.753 C 30.498 15.53 30.735 15.376 31 15.376 C 31.405 15.376 31.726 15.684 31.726 16.032 C 31.726 16.381 31.489 16.702 31.21 16.8 C 31.07 16.856 30.958 16.814 30.875 16.758 C 30.693 16.619 30.512 16.535 30.33 16.535 C 30.149 16.535 29.926 16.619 29.744 17.065 L 29.744 19.215 M 32.577 16.814 C 32.577 16.158 32.563 16.144 31.866 16.06 L 31.866 15.767 C 32.508 15.684 33.219 15.53 33.903 15.376 L 33.903 19.201 C 33.903 19.815 33.959 19.857 34.643 19.94 L 34.643 20.275 L 31.824 20.275 L 31.824 19.94 C 32.522 19.871 32.563 19.829 32.563 19.201 L 32.563 16.814 M 33.931 13.674 C 33.931 14.106 33.582 14.455 33.15 14.455 C 32.731 14.455 32.368 14.106 32.368 13.674 C 32.368 13.227 32.731 12.892 33.15 12.892 C 33.582 12.892 33.931 13.227 33.931 13.674 Z  M 38.956 15.502 L 39.053 15.656 L 36.569 19.801 L 37.42 19.801 C 38.16 19.801 38.453 19.661 38.816 19.047 L 38.97 18.782 L 39.36 18.921 C 39.165 19.466 39.025 19.857 38.858 20.261 L 34.95 20.261 L 34.838 20.108 L 37.406 15.963 L 36.653 15.963 C 35.941 15.963 35.746 16.13 35.494 16.661 L 35.341 16.995 L 34.95 16.856 C 35.076 16.451 35.243 15.767 35.355 15.293 L 35.592 15.293 C 35.648 15.446 35.76 15.516 36.178 15.516 L 38.956 15.516 M 40.616 17.177 C 40.686 16.437 41.077 15.879 41.482 15.879 C 41.901 15.879 42.235 16.451 42.235 16.884 C 42.235 17.093 42.194 17.135 42.04 17.135 L 40.616 17.177 Z  M 43.296 19.019 C 42.864 19.312 42.529 19.438 42.124 19.438 C 41.3 19.438 40.561 18.88 40.561 17.665 C 41.635 17.624 43.073 17.526 43.226 17.498 C 43.436 17.456 43.478 17.428 43.478 17.023 C 43.478 16.186 42.724 15.39 41.789 15.39 C 40.463 15.39 39.305 16.549 39.305 18.112 C 39.305 19.326 40.142 20.401 41.607 20.401 C 41.984 20.401 42.836 20.178 43.45 19.242 L 43.296 19.019 L 43.296 19.019 Z  M 43.827 19.55 C 43.827 19.061 44.175 18.698 44.65 18.698 C 45.125 18.698 45.487 19.061 45.487 19.55 C 45.487 20.052 45.125 20.401 44.65 20.401 C 44.189 20.387 43.827 20.052 43.827 19.55 Z  M 52.466 20.345 L 51.81 20.345 L 47.511 15.069 L 47.483 15.069 L 47.483 17.316 C 47.483 18.461 47.553 19.061 47.595 19.396 C 47.651 19.773 47.93 19.912 48.642 19.94 L 48.642 20.275 L 45.948 20.275 L 45.948 19.94 C 46.492 19.926 46.744 19.773 46.799 19.396 C 46.855 19.061 46.911 18.461 46.911 17.316 L 46.911 15.167 C 46.911 14.483 46.911 14.204 46.716 13.953 C 46.506 13.688 46.241 13.618 45.794 13.59 L 45.794 13.255 L 47.679 13.255 L 51.866 18.126 L 51.894 18.126 L 51.894 16.214 C 51.894 15.083 51.838 14.483 51.782 14.148 C 51.726 13.771 51.461 13.632 50.735 13.604 L 50.735 13.269 L 53.429 13.269 L 53.429 13.604 C 52.884 13.632 52.633 13.771 52.577 14.148 C 52.536 14.483 52.466 15.083 52.466 16.214 L 52.466 20.345 Z  M 54.141 17.177 C 54.196 16.437 54.601 15.879 55.006 15.879 C 55.411 15.879 55.76 16.451 55.76 16.884 C 55.76 17.093 55.718 17.135 55.55 17.135 L 54.141 17.177 M 56.82 19.019 C 56.388 19.312 56.053 19.438 55.648 19.438 C 54.824 19.438 54.099 18.88 54.099 17.665 C 55.173 17.624 56.611 17.526 56.764 17.498 C 56.974 17.456 57.016 17.428 57.016 17.023 C 57.016 16.186 56.276 15.39 55.327 15.39 C 54.001 15.39 52.843 16.549 52.843 18.112 C 52.843 19.326 53.694 20.401 55.145 20.401 C 55.522 20.401 56.374 20.178 56.988 19.242 L 56.82 19.019 L 56.82 19.019 Z  M 59.109 18.67 C 59.109 19.508 59.514 19.661 59.723 19.661 C 59.891 19.661 60.072 19.605 60.282 19.494 L 60.435 19.815 L 59.5 20.289 C 59.332 20.373 59.165 20.401 59.095 20.401 C 58.258 20.401 57.797 20.038 57.797 19.075 L 57.797 16.074 L 57.113 16.074 L 57.044 15.935 L 57.392 15.516 L 57.811 15.516 L 57.811 14.846 L 58.956 13.995 L 59.137 14.092 L 59.137 15.516 L 60.212 15.516 C 60.351 15.628 60.323 15.977 60.142 16.074 L 59.151 16.074 L 59.151 18.67 M 60.407 15.111 C 60.309 15.111 60.226 15.083 60.142 15.042 C 60.058 15 59.988 14.93 59.947 14.846 C 59.891 14.762 59.877 14.665 59.877 14.567 C 59.877 14.469 59.905 14.386 59.947 14.288 C 59.988 14.204 60.058 14.134 60.142 14.092 C 60.226 14.051 60.323 14.023 60.407 14.023 C 60.505 14.023 60.589 14.051 60.672 14.092 C 60.756 14.134 60.826 14.204 60.868 14.288 C 60.924 14.372 60.937 14.469 60.937 14.567 C 60.937 14.665 60.91 14.762 60.868 14.846 C 60.812 14.93 60.756 15 60.672 15.042 C 60.589 15.097 60.505 15.111 60.407 15.111 Z  M 60.407 15.028 C 60.491 15.028 60.561 15.014 60.63 14.972 C 60.7 14.93 60.756 14.874 60.798 14.804 C 60.84 14.734 60.868 14.651 60.868 14.567 C 60.868 14.483 60.84 14.413 60.812 14.33 C 60.77 14.26 60.714 14.204 60.644 14.162 C 60.575 14.12 60.491 14.106 60.407 14.106 C 60.323 14.106 60.254 14.12 60.184 14.162 C 60.114 14.204 60.058 14.26 60.016 14.33 C 59.974 14.4 59.961 14.483 59.961 14.567 C 59.961 14.651 59.988 14.734 60.016 14.804 C 60.058 14.874 60.114 14.93 60.184 14.972 C 60.24 15.014 60.323 15.028 60.407 15.028 L 60.407 15.028 Z  M 60.295 14.888 L 60.184 14.888 L 60.184 14.232 L 60.393 14.232 C 60.449 14.232 60.477 14.246 60.505 14.26 C 60.533 14.274 60.547 14.302 60.561 14.33 C 60.575 14.358 60.589 14.386 60.589 14.427 C 60.589 14.469 60.575 14.497 60.561 14.539 C 60.533 14.581 60.505 14.595 60.463 14.623 C 60.491 14.637 60.505 14.665 60.533 14.721 L 60.63 14.916 L 60.505 14.916 L 60.421 14.748 L 60.407 14.707 C 60.379 14.665 60.365 14.637 60.351 14.637 L 60.268 14.637 L 60.268 14.888 L 60.295 14.888 Z  M 60.295 14.539 L 60.365 14.539 C 60.407 14.539 60.449 14.525 60.463 14.497 C 60.477 14.469 60.491 14.441 60.491 14.413 C 60.491 14.4 60.491 14.372 60.477 14.358 C 60.463 14.344 60.463 14.33 60.449 14.316 C 60.435 14.302 60.407 14.302 60.365 14.302 L 60.282 14.302 L 60.282 14.539 L 60.295 14.539 Z " fill-rule="evenodd" fill="rgb(255,255,255)"></path></svg>',
    values: {},
    options: {
        
        product: {
            title: "Authorize.net Subscription Order Bump | Product", //Aug8 Update
            position: 2,
            options: ${editorTools.config_subscription_product(
							'subscription_header,conekta_subscription_list,subscription_button_text,subscription_button_size,subscription_button_padding,subscription_button_width',
						)}, 
        },
        button: {
            title: "Button",
            position: 3,
            options: ${editorTools.config_button('fbInitiate')}
        },
        confirmation: {
            title: "Apperance",
            position: 1,
            options: ${editorTools.config_order_bump_subscription()}
        }
    },
    renderer: {
        Viewer: unlayer.createViewer({
            render(values) {
                let button_style = btnStyleFn(values);
                return \`
                    \$\{button_style\}
                    <style>
                    .checkbox-arrow-slide-right{ left: 10px; width: 20px; z-index: 1; -webkit-animation: slide-right .5s cubic-bezier(.25,.46,.45,.94) infinite alternate both; animation: slide-right .5s cubic-bezier(.25,.46,.45,.94) infinite alternate both; } @-webkit-keyframes slide-right {0% {-webkit-transform: translateX(0);transform: translateX(0);}100% {-webkit-transform: translateX(10px);transform: translateX(10px);}}
                    .product-addons { display: flex; align-items: center; position: relative; background-color: \$\{values.backgroundColor\}; padding: 5px; border-radius: 5px; color: \$\{values.fontColor\}; }
                    .p_add_on:checked:after { content: '\\\\2714'; font-size: 15px; font-weight: 700; color: #fff; background: linear-gradient(to bottom, #0fe469 0%, #145b32 100%); display: flex; align-items: center; justify-content: center; }
                    .p_add_on:after { content: ''; border: 1px solid #505256; background-color: #b3abab; width: 20px; height: 20px; position: absolute; top: -30%; left: -30%; border-radius: 5px; }
                </style>
                <div class="product-addons">
                    <img class="checkbox-arrow-slide-right" src="https://cdn.productlistgenie.com/images/NWMwYTg1ZjA3NzMwMDEzMjdiMDM5MDRj/1560786344044256-256-7f4d535dc832b66d90d5c0cb72ec8690-arrow.png">
                    <input type="checkbox" class="p_add_on" style="margin-left: 15px; position: relative;" \$\{values.checked ? ' checked' : ''\}>
                    <label style="margin-left: 5px; text-decoration: \$\{values.undeline ? 'underline' : 'unset'\};">\$\{values.addonText\}</label>
                </div>
                \`;
            }
        }),
        exporters: {
            web: function(values) {
                let button_style = btnStyleFn(values);
                let info = JSON.parse(values.subscription_list)[0];
                return \`
                    \$\{button_style\}
                    <style>
                    .checkbox-arrow-slide-right{ left: 10px; width: 20px; z-index: 1; -webkit-animation: slide-right .5s cubic-bezier(.25,.46,.45,.94) infinite alternate both; animation: slide-right .5s cubic-bezier(.25,.46,.45,.94) infinite alternate both; } @-webkit-keyframes slide-right {0% {-webkit-transform: translateX(0);transform: translateX(0);}100% {-webkit-transform: translateX(10px);transform: translateX(10px);}}
                    .product-addons { display: flex; align-items: center; position: relative; background-color: \$\{values.backgroundColor\}; padding: 5px; border-radius: 5px; color: \$\{values.fontColor\}; }
                    .p_add_on:checked:after { content: '\\\\2714'; font-size: 15px; font-weight: 700; color: #fff; background: linear-gradient(to bottom, #0fe469 0%, #145b32 100%); display: flex; align-items: center; justify-content: center; }
                    .p_add_on:after { content: ''; border: 1px solid #505256; background-color: #b3abab; width: 20px; height: 20px; position: absolute; top: -30%; left: -30%; border-radius: 5px; }
                </style>
                <div class="product-addons">
                    <img class="checkbox-arrow-slide-right" src="https://cdn.productlistgenie.com/images/NWMwYTg1ZjA3NzMwMDEzMjdiMDM5MDRj/1560786344044256-256-7f4d535dc832b66d90d5c0cb72ec8690-arrow.png">
                    \$\{values.checked ? ' <input type="checkbox" class="p_add_on" style="margin-left: 15px; position: relative;" onload="setTimeout(() => typeof addProductAddonPrice != \\'undefined\\' ? addProductAddonPrice(event) : void 0, 1000)" onclick="typeof addProductAddonPrice != \\'undefined\\' ? addProductAddonPrice(event) : void 0" checked />' : '<input type="checkbox" class="p_add_on" style="margin-left: 15px; position: relative;" onclick="typeof addProductAddonPrice != \\'undefined\\' ? addProductAddonPrice(event) : void 0" />'\} 
                    <label style="margin-left: 5px; text-decoration: \$\{values.undeline ? 'underline' : 'unset'\};">\$\{values.addonText\}</label>
                </div>

                    <div style="display:none"  id="authorize_order_bump"
                    data-checked =  \$\{values.checked\}
                    data-productname = "\$\{info.name\}"
                    data-variantname = "\$\{info.rebill + " - " + info.day_or_month\}"
                    data-price = "\$\{info.price\}"
                    
                    data-trackaddtocart = "\$\{values.fbTrack\}"
                    data-trackpurchased = "\$\{values.fbPurchase\}"
                    
                    data-useconfirmation="\$\{values.use_confirmation\}"
                    data-header="\$\{values.header\}"
                    data-ptext="\$\{values.positive_button\}"
                    data-ntext="\$\{values.negative_button\}"
                    >
                    \$\{values.text\}
                    <div class="subtext">\$\{values.subText\}</div>
                    </div>
                    <script>
                    //July11
                    var variantavailable = \$\{values.variants\};
                    var variantname = "Add-ons Subscription";
                    var subs_ob_data = {

                        dataproductname :  "\$\{info.name\}",
                        datavariantname :  "\$\{info.rebill + " - " + info.day_or_month\}",
                        dataprice :  "\$\{info.price\}",
                        datatrackaddtocart :  "\$\{values.fbTrack\}",
                        datatrackpurchased :  "\$\{values.fbPurchase\}",
                        datauseconfirmation: "\$\{values.use_confirmation\}",
                        dataheader: "\$\{values.header\}",
                        dataptext: "\$\{values.positive_button\}",
                        datantext: "\$\{values.negative_button\}",
                    }
                        function addProductAddonPrice(event){
                            // also converting those local price to multiple country add on price...
                            var addonPrice = \$\{info.price\};
                            console.log(event)
                            document.getElementById("authorize_order_bump").dataset.checked = event.target.checked;
                            if(event.target.checked){
                                warrantyPrice = {
                                    price: addonPrice,
                                    variantname: "\$\{info.name\}",
                                    variantid:  "\$\{info.shopifySubID\}", //typeof variantid !== "undefined" ? variantid : plg_selectedVariant.variant_id, // FIXME:
                                    tag: ""
                                };
                            
                            } else {
                                warrantyPrice = {
                                    price: 0,
                                    variantname: "",
                                    variantid: "",
                                    tag: ""
                                };
                            }
                            try {
                                getTheSelectedVariant();
                            } catch (error) {
                                console.log(error)
                            }
                            // for the new variants with multiple and multi country.. 
                            // getSelectedVariant();
                        }
                        function subscription_orderBump(element, dataFromForm) {
                            console.log("Check or Uncheck ", element.getAttribute('data-checked'))
                        
                            console.log("function subscription_orderBump was called", element);
                            
                            let quantity = 1;
                            let product_name = element.getAttribute('data-productname')
                            let variant_name = element.getAttribute('data-variantname');
                            let price = element.getAttribute('data-price');
                            
                            
                            if (localStorage.getItem("authorize_customer_ids")) {
                                subscription_hide_show_confirmation(element, () => {
                                    
                                    let payload = JSON.parse(atob(localStorage.getItem("authorize_customer_ids")));
                                    payload.productPrice = parseFloat(price)
                                    payload.productName = product_name;
                                    payload.variantName = variant_name;
                                    plgQS() !== "" ? payload.campaign_src = plgQS() : void 0;
                                    // payload.variant_id = variantavailable.filter(e => e.isSuggest == true)[0] && variantavailable.filter(e => e.isSuggest == true)[0].id;
                                    payload.variant_id = "\$\{info.shopifySubID\}";
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

                                            save_authorize_initial_data(payload, result => {
                                                let x_checkout = JSON.parse(localStorage.getItem("plg_prod_list"));
                                                x_checkout.push({
                                                    product_url: window.location.href,
                                                    product_name: product_name,
                                                    variant_name: variant_name,
                                                    product_price: parseFloat(price)
                                                });
                                                localStorage.setItem("plg_prod_list", JSON.stringify(x_checkout));
                                                window.open("\$\{values.buttonLink.url\}", "\$\{values.buttonLink.target\}");
                                            }, error => {
                                                
                                                alert("An error has occured");
                                            });
                                        } else {
                                            
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
                                        
                                        let x_checkout = JSON.parse(localStorage.getItem("plg_prod_list"));
                                                x_checkout.push({
                                                    product_url: window.location.href,
                                                    product_name: product_name,
                                                    variant_name: variant_name,
                                                    product_price: parseFloat(price)
                                                });
                                                localStorage.setItem("plg_prod_list", JSON.stringify(x_checkout));
                                                window.open(urls.url, urls.target);
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
                            let use_confirmation = element.getAttribute('data-useconfirmation');
                            let header = element.getAttribute('data-header');
                            let positive_text = element.getAttribute('data-ptext');
                            let negative_text = element.getAttribute('data-ntext');
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
                                // document.getElementById("submit_loading").remove();
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
