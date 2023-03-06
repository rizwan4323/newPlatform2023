
let CryptoJS = require('crypto-js');
let gval = require('../../../Global_Values');
let return_url = "https://app.productlistgenie.io";
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
	checkout: function(user_id, page_data, paypalClientIDv2) {
       console.log(paypalClientIDv2)
       const keys = encryptString(paypalClientIDv2);
       console.log(keys);
       const meta = encryptString(user_id)
       const pageid = page_data.funnel_id

        return `
        console.log("2. Initializing button...");
            unlayer.registerTool({
                type: 'buttons',
                category: 'contents',
                label: 'Button',
                icon: '<svg class="svg-inline--fa fa-w-14 fa-w-20 fa-3x" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 512 512" viewBox="0 0 512 512"> <g fill="#fff"> <path d="M22.496,15.496999999999957C22.496,15.496999999999957,118.577,15.496999999999957,118.577,15.496999999999957C122.676,15.496999999999957,126.075,12.097999999999956,126.075,7.998999999999967C126.075,7.998999999999967,126.075,7.998999999999967,126.075,7.998999999999967C126.075,3.899000000000001,122.676,0.5,118.577,0.5C118.577,0.5,7.499,0.5,7.499,0.5C3.399,0.5,0,3.899000000000001,0,7.998999999999967C0,7.998999999999967,0,119.077,0,119.077C0,123.17599999999999,3.399,126.57499999999999,7.499,126.57499999999999C7.499,126.57499999999999,7.499,126.57499999999999,7.499,126.57499999999999C11.598,126.57499999999999,14.997,123.17599999999999,14.997,119.077C14.997,119.077,14.997,22.99599999999998,14.997,22.99599999999998C14.997,18.895999999999958,18.396,15.496999999999957,22.496,15.496999999999957C22.496,15.496999999999957,22.496,15.496999999999957,22.496,15.496999999999957M7.499,386.325C7.499,386.325,7.499,386.325,7.499,386.325C3.399,386.325,0,389.724,0,393.823C0,393.823,0,504.90099999999995,0,504.90099999999995C0,509.001,3.399,512.4,7.499,512.4C7.499,512.4,118.577,512.4,118.577,512.4C122.676,512.4,126.075,509.001,126.075,504.90099999999995C126.075,504.90099999999995,126.075,504.90099999999995,126.075,504.90099999999995C126.075,500.80199999999996,122.676,497.40299999999996,118.577,497.40299999999996C118.577,497.40299999999996,22.496,497.40299999999996,22.496,497.40299999999996C18.396,497.40299999999996,14.997,494.00399999999996,14.997,489.904C14.997,489.904,14.997,393.823,14.997,393.823C14.997,389.724,11.598,386.325,7.499,386.325C7.499,386.325,7.499,386.325,7.499,386.325M489.404,497.40299999999996C489.404,497.40299999999996,393.323,497.40299999999996,393.323,497.40299999999996C389.224,497.40299999999996,385.825,500.80199999999996,385.825,504.90099999999995C385.825,504.90099999999995,385.825,504.90099999999995,385.825,504.90099999999995C385.825,509.001,389.224,512.4,393.323,512.4C393.323,512.4,504.401,512.4,504.401,512.4C508.501,512.4,511.9,509.001,511.9,504.90099999999995C511.9,504.90099999999995,511.9,393.823,511.9,393.823C511.9,389.724,508.501,386.325,504.401,386.325C504.401,386.325,504.401,386.325,504.401,386.325C500.302,386.325,496.903,389.724,496.903,393.823C496.903,393.823,496.903,489.904,496.903,489.904C496.903,494.00399999999996,493.504,497.40299999999996,489.404,497.40299999999996C489.404,497.40299999999996,489.404,497.40299999999996,489.404,497.40299999999996M385.825,7.998999999999967C385.825,7.998999999999967,385.825,7.998999999999967,385.825,7.998999999999967C385.825,12.097999999999956,389.224,15.496999999999957,393.323,15.496999999999957C393.323,15.496999999999957,489.404,15.496999999999957,489.404,15.496999999999957C493.504,15.496999999999957,496.903,18.895999999999958,496.903,22.99599999999998C496.903,22.99599999999998,496.903,119.077,496.903,119.077C496.903,123.17599999999999,500.302,126.57499999999999,504.401,126.57499999999999C504.401,126.57499999999999,504.401,126.57499999999999,504.401,126.57499999999999C508.501,126.57499999999999,511.9,123.17599999999999,511.9,119.077C511.9,119.077,511.9,7.998999999999967,511.9,7.998999999999967C511.9,3.899000000000001,508.501,0.5,504.401,0.5C504.401,0.5,393.323,0.5,393.323,0.5C389.224,0.5,385.825,3.899000000000001,385.825,7.998999999999967C385.825,7.998999999999967,385.825,7.998999999999967,385.825,7.998999999999967M482.806,169.56699999999995C482.806,169.56699999999995,29.094,169.56699999999995,29.094,169.56699999999995C13.097,169.56699999999995,0,182.56399999999996,0,198.661C0,198.661,0,314.43899999999996,0,314.43899999999996C0,330.436,12.997,343.533,29.094,343.533C29.094,343.533,482.906,343.533,482.906,343.533C498.903,343.533,512,330.53599999999994,512,314.43899999999996C512,314.43899999999996,512,198.56099999999998,512,198.56099999999998C511.9,182.56399999999996,498.903,169.56699999999995,482.806,169.56699999999995C482.806,169.56699999999995,482.806,169.56699999999995,482.806,169.56699999999995M496.903,314.43899999999996C496.903,322.13699999999994,490.604,328.53599999999994,482.806,328.53599999999994C482.806,328.53599999999994,29.094,328.53599999999994,29.094,328.53599999999994C21.396,328.53599999999994,14.997,322.23699999999997,14.997,314.43899999999996C14.997,314.43899999999996,14.997,198.56099999999998,14.997,198.56099999999998C14.997,190.863,21.296,184.464,29.094,184.464C29.094,184.464,482.906,184.464,482.906,184.464C490.604,184.464,497.003,190.76299999999998,497.003,198.56099999999998C497.003,198.56099999999998,497.003,314.43899999999996,497.003,314.43899999999996C497.003,314.43899999999996,496.903,314.43899999999996,496.903,314.43899999999996C496.903,314.43899999999996,496.903,314.43899999999996,496.903,314.43899999999996M255.95,223.55599999999998C251.851,223.55599999999998,248.451,226.95599999999996,248.451,231.05499999999995C248.451,231.05499999999995,248.451,282.04499999999996,248.451,282.04499999999996C248.451,286.144,251.851,289.544,255.95,289.544C260.049,289.544,263.449,286.144,263.449,282.04499999999996C263.449,282.04499999999996,263.449,231.05499999999995,263.449,231.05499999999995C263.449,226.95599999999996,260.049,223.55599999999998,255.95,223.55599999999998C255.95,223.55599999999998,255.95,223.55599999999998,255.95,223.55599999999998M220.957,223.55599999999998C216.858,223.55599999999998,213.458,226.95599999999996,213.458,231.05499999999995C213.458,231.05499999999995,213.458,282.04499999999996,213.458,282.04499999999996C213.458,286.144,216.858,289.544,220.957,289.544C225.056,289.544,228.455,286.144,228.455,282.04499999999996C228.455,282.04499999999996,228.455,231.05499999999995,228.455,231.05499999999995C228.455,226.95599999999996,225.056,223.55599999999998,220.957,223.55599999999998C220.957,223.55599999999998,220.957,223.55599999999998,220.957,223.55599999999998M290.943,223.55599999999998C286.844,223.55599999999998,283.445,226.95599999999996,283.445,231.05499999999995C283.445,231.05499999999995,283.445,282.04499999999996,283.445,282.04499999999996C283.445,286.144,286.844,289.544,290.943,289.544C295.042,289.544,298.442,286.144,298.442,282.04499999999996C298.442,282.04499999999996,298.442,231.05499999999995,298.442,231.05499999999995C298.442,226.95599999999996,295.042,223.55599999999998,290.943,223.55599999999998C290.943,223.55599999999998,290.943,223.55599999999998,290.943,223.55599999999998" /> </g> </svg>',
                values: {},
                options: {
                    button: {
                        title: "Button",
                        position: 1,
                        options: ${JSON.stringify(buttonJSON)},
                    }
                },
                renderer: {
                    Viewer: unlayer.createViewer({
                        render(values) {
                            var btnColor = values.buttonColors.color;
                            var btnBackgroundColor = values.buttonColors.backgroundColor;
                            var btnhoverColor = values.buttonColors.hoverColor;
                            if(values.buttonStyle){
                                var splittedValue = values.buttonStyle.split(",");
                                btnColor = splittedValue[0];
                                btnBackgroundColor = splittedValue[1];
                                btnhoverColor = splittedValue[2];
                            }
                            clearInterval(window["'"+values._meta.htmlID+"'"]);
                            return \`
                                <div style="text-align: \$\{values.alignment\}">
                                    <style onload="if(\$\{values.animation != ""\}){ window[\'\$\{values._meta.htmlID\}\'] = setInterval(() => { this.nextElementSibling.classList.remove('\$\{values.animation\}'); setTimeout(() => { this.nextElementSibling.classList.add('\$\{values.animation\}'); }, 500); }, \$\{values.animationInterval * 1000\}) }">
                                        .shake-horizontal { -webkit-animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both; animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both; } @-webkit-keyframes shake-horizontal { 0%, 100% { -webkit-transform: translateX(0); transform: translateX(0); } 10%, 30%, 50%, 70% { -webkit-transform: translateX(-10px); transform: translateX(-10px); } 20%, 40%, 60% { -webkit-transform: translateX(10px); transform: translateX(10px); } 80% { -webkit-transform: translateX(8px); transform: translateX(8px); } 90% { -webkit-transform: translateX(-8px); transform: translateX(-8px); } } @keyframes shake-horizontal { 0%, 100% { -webkit-transform: translateX(0); transform: translateX(0); } 10%, 30%, 50%, 70% { -webkit-transform: translateX(-10px); transform: translateX(-10px); } 20%, 40%, 60% { -webkit-transform: translateX(10px); transform: translateX(10px); } 80% { -webkit-transform: translateX(8px); transform: translateX(8px); } 90% { -webkit-transform: translateX(-8px); transform: translateX(-8px); } }
                                        .shake-vertical { -webkit-animation: shake-vertical 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both; animation: shake-vertical 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both; } @-webkit-keyframes shake-vertical { 0%, 100% { -webkit-transform: translateY(0); transform: translateY(0); } 10%, 30%, 50%, 70% { -webkit-transform: translateY(-8px); transform: translateY(-8px); } 20%, 40%, 60% { -webkit-transform: translateY(8px); transform: translateY(8px); } 80% { -webkit-transform: translateY(6.4px); transform: translateY(6.4px); } 90% { -webkit-transform: translateY(-6.4px); transform: translateY(-6.4px); } } @keyframes shake-vertical { 0%, 100% { -webkit-transform: translateY(0); transform: translateY(0); } 10%, 30%, 50%, 70% { -webkit-transform: translateY(-8px); transform: translateY(-8px); } 20%, 40%, 60% { -webkit-transform: translateY(8px); transform: translateY(8px); } 80% { -webkit-transform: translateY(6.4px); transform: translateY(6.4px); } 90% { -webkit-transform: translateY(-6.4px); transform: translateY(-6.4px); } }
                                        .bounce-top { -webkit-animation: bounce-top 0.9s both; animation: bounce-top 0.9s both; } @-webkit-keyframes bounce-top { 0% { -webkit-transform: translateY(-45px); transform: translateY(-45px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; opacity: 1; } 24% { opacity: 1; } 40% { -webkit-transform: translateY(-24px); transform: translateY(-24px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 65% { -webkit-transform: translateY(-12px); transform: translateY(-12px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 82% { -webkit-transform: translateY(-6px); transform: translateY(-6px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 93% { -webkit-transform: translateY(-4px); transform: translateY(-4px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 25%, 55%, 75%, 87% { -webkit-transform: translateY(0px); transform: translateY(0px); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; } 100% { -webkit-transform: translateY(0px); transform: translateY(0px); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; opacity: 1; } } @keyframes bounce-top { 0% { -webkit-transform: translateY(-45px); transform: translateY(-45px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; opacity: 1; } 24% { opacity: 1; } 40% { -webkit-transform: translateY(-24px); transform: translateY(-24px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 65% { -webkit-transform: translateY(-12px); transform: translateY(-12px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 82% { -webkit-transform: translateY(-6px); transform: translateY(-6px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 93% { -webkit-transform: translateY(-4px); transform: translateY(-4px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 25%, 55%, 75%, 87% { -webkit-transform: translateY(0px); transform: translateY(0px); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; } 100% { -webkit-transform: translateY(0px); transform: translateY(0px); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; opacity: 1; } }
                                        .pulsate { -webkit-animation: pulsate 0.8s ease-in-out infinite both; animation: pulsate 0.8s ease-in-out infinite both; } @-webkit-keyframes pulsate { 0% { -webkit-transform: scale(1); transform: scale(1); } 50% { -webkit-transform: scale(0.9); transform: scale(0.9); } 100% { -webkit-transform: scale(1); transform: scale(1); } } @keyframes pulsate { 0% { -webkit-transform: scale(1); transform: scale(1); } 50% { -webkit-transform: scale(0.9); transform: scale(0.9); } 100% { -webkit-transform: scale(1); transform: scale(1); } }
                                        @media only screen and (max-width: 768px) {
                                            button {
                                                width: 100% !important;
                                            }
                                        }
                                    </style>
                                    

                                    
                                    
                                      
                                    <button
                                        onclick="window.open('\$\{values.buttonLink.url\}','\$\{values.buttonLink.target\}')"
                                        onmouseover="this.style.backgroundColor='\$\{btnhoverColor\}'"
                                        onmouseleave="this.style.backgroundColor='\$\{btnBackgroundColor\}'"
                                        class="\$\{values.animation\}"
                                        style="border-radius: \$\{values.borderRadius\}; font-size: \$\{values.fontSize\}; padding: \$\{values.padding\}; color: \$\{btnColor\}; background-color: \$\{btnBackgroundColor\}; cursor: pointer; border: none; width: \$\{values.buttonWidth\}; font-weight: \$\{values.fontWeight\};">
                                        \$\{values.text\}
                                        <div class="subtext" style="font-weight: 400; font-size: calc(\$\{values.fontSize\} * .75);">
                                            \$\{values.subText\}
                                        </div>
                                    </button>
                                </div>
                            \`;
                        }
                    }),
                    exporters: {
                        web: function (values) {
                            var btnColor = values.buttonColors.color;
                            var btnBackgroundColor = values.buttonColors.backgroundColor;
                            var btnhoverColor = values.buttonColors.hoverColor;
                            var target = values.buttonLink.target != "_popup" ? values.buttonLink.target : "_self";
                            if(values.buttonStyle){
                                var splittedValue = values.buttonStyle.split(",");
                                btnColor = splittedValue[0];
                                btnBackgroundColor = splittedValue[1];
                                btnhoverColor = splittedValue[2];
                            }
                            clearInterval(window[values._meta.htmlID]);
                            var exportStyle = \`
                                <style onload="if(\$\{values.animation != ""\}){ window['\$\{values._meta.htmlID\}'] = setInterval(() => { this.nextElementSibling.classList.remove('\$\{values.animation\}'); setTimeout(() => { this.nextElementSibling.classList.add('\$\{values.animation\}'); }, 500); }, \$\{values.animationInterval * 1000\}) }">
                                    .shake-horizontal { -webkit-animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both; animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both; } @-webkit-keyframes shake-horizontal { 0%, 100% { -webkit-transform: translateX(0); transform: translateX(0); } 10%, 30%, 50%, 70% { -webkit-transform: translateX(-10px); transform: translateX(-10px); } 20%, 40%, 60% { -webkit-transform: translateX(10px); transform: translateX(10px); } 80% { -webkit-transform: translateX(8px); transform: translateX(8px); } 90% { -webkit-transform: translateX(-8px); transform: translateX(-8px); } } @keyframes shake-horizontal { 0%, 100% { -webkit-transform: translateX(0); transform: translateX(0); } 10%, 30%, 50%, 70% { -webkit-transform: translateX(-10px); transform: translateX(-10px); } 20%, 40%, 60% { -webkit-transform: translateX(10px); transform: translateX(10px); } 80% { -webkit-transform: translateX(8px); transform: translateX(8px); } 90% { -webkit-transform: translateX(-8px); transform: translateX(-8px); } }
                                    .shake-vertical { -webkit-animation: shake-vertical 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both; animation: shake-vertical 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both; } @-webkit-keyframes shake-vertical { 0%, 100% { -webkit-transform: translateY(0); transform: translateY(0); } 10%, 30%, 50%, 70% { -webkit-transform: translateY(-8px); transform: translateY(-8px); } 20%, 40%, 60% { -webkit-transform: translateY(8px); transform: translateY(8px); } 80% { -webkit-transform: translateY(6.4px); transform: translateY(6.4px); } 90% { -webkit-transform: translateY(-6.4px); transform: translateY(-6.4px); } } @keyframes shake-vertical { 0%, 100% { -webkit-transform: translateY(0); transform: translateY(0); } 10%, 30%, 50%, 70% { -webkit-transform: translateY(-8px); transform: translateY(-8px); } 20%, 40%, 60% { -webkit-transform: translateY(8px); transform: translateY(8px); } 80% { -webkit-transform: translateY(6.4px); transform: translateY(6.4px); } 90% { -webkit-transform: translateY(-6.4px); transform: translateY(-6.4px); } }
                                    .bounce-top { -webkit-animation: bounce-top 0.9s both; animation: bounce-top 0.9s both; } @-webkit-keyframes bounce-top { 0% { -webkit-transform: translateY(-45px); transform: translateY(-45px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; opacity: 1; } 24% { opacity: 1; } 40% { -webkit-transform: translateY(-24px); transform: translateY(-24px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 65% { -webkit-transform: translateY(-12px); transform: translateY(-12px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 82% { -webkit-transform: translateY(-6px); transform: translateY(-6px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 93% { -webkit-transform: translateY(-4px); transform: translateY(-4px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 25%, 55%, 75%, 87% { -webkit-transform: translateY(0px); transform: translateY(0px); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; } 100% { -webkit-transform: translateY(0px); transform: translateY(0px); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; opacity: 1; } } @keyframes bounce-top { 0% { -webkit-transform: translateY(-45px); transform: translateY(-45px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; opacity: 1; } 24% { opacity: 1; } 40% { -webkit-transform: translateY(-24px); transform: translateY(-24px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 65% { -webkit-transform: translateY(-12px); transform: translateY(-12px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 82% { -webkit-transform: translateY(-6px); transform: translateY(-6px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 93% { -webkit-transform: translateY(-4px); transform: translateY(-4px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; } 25%, 55%, 75%, 87% { -webkit-transform: translateY(0px); transform: translateY(0px); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; } 100% { -webkit-transform: translateY(0px); transform: translateY(0px); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; opacity: 1; } }
                                    .pulsate { -webkit-animation: pulsate 0.8s ease-in-out infinite both; animation: pulsate 0.8s ease-in-out infinite both; } @-webkit-keyframes pulsate { 0% { -webkit-transform: scale(1); transform: scale(1); } 50% { -webkit-transform: scale(0.9); transform: scale(0.9); } 100% { -webkit-transform: scale(1); transform: scale(1); } } @keyframes pulsate { 0% { -webkit-transform: scale(1); transform: scale(1); } 50% { -webkit-transform: scale(0.9); transform: scale(0.9); } 100% { -webkit-transform: scale(1); transform: scale(1); } }
                                    .mobile-sticky {
                                        position: fixed;
                                        left: 0;
                                        bottom: 0;
                                        width: 100%;
                                        z-index: 999;
                                        background-color: #fff;
                                        padding: 10px;
                                    }
                                    @media only screen and (max-width: 768px) {
                                        button {
                                            width: 100% !important;
                                        }
                                    }
                                </style>
                            \`
                            if(${isUpsellOrDownsell}){
                                // this is upsell or downsell
                                var merchant_type = "${selected_merchant}";
                                var isPaypalActive = "${paypalClientID}";
                                var upsellScript = \`
                                    <style>
                                        .paypal-buttons {
                                            margin-top: 10px;
                                        }
                                    </style>
                                    <script src="https://www.paypal.com/sdk/js?client-id=${this.decryptString(paypalClientID)}\$\{values.paypalSubscriptionID != "" ? "&vault=true&intent=subscription" : ""\}"></script>
                                    <script>
                                    //&vault=true&intent=capture
                                        var isFunctionCalled = false;
                                        function sendFBaddToCartAndInitiateCheckout(isAddEnable, isInitiateEnable, email){
                                            if(!isFunctionCalled){
                                                if(isAddEnable){
                                                    if(typeof fbq !== 'undefined'){
                                                        console.log("fire facebook add to cart")
                                                        fbq('track', 'AddToCart');
                                                    }
                                                    if(typeof snaptr !== 'undefined'){
                                                        console.log("fire snapchat add to cart")
                                                        snaptr('track','ADD_CART');
                                                    }
                                                }
                                                if(isInitiateEnable) {
                                                    if(typeof fbq !== 'undefined'){
                                                        console.log("fire facebook initiate checkout")
                                                        fbq('track', 'InitiateCheckout');
                                                    }
                                                    if(typeof snaptr !== 'undefined'){
                                                        console.log("fire snapchat initiate checkout")
                                                        snaptr('init', '${this.state.page_data.funnel_snapchat_id}', {'user_email':email});
                                                        snaptr('track','SIGN_UP');
                                                    }
                                                }
                                                isFunctionCalled = true;
                                            }
                                        }
                                        function sendFBPurchaseEvent(isEnable, price){
                                            if(isEnable) {
                                                if(typeof fbq !== 'undefined'){
                                                    console.log("fire facebook purchased event")
                                                    fbq('track', 'Purchase', {value: parseFloat(price), currency: localStorage.getItem("cod_data") ? JSON.parse(localStorage.getItem("cod_data")).currencyWord : "USD"})
                                                }
                                                if(typeof snaptr !== 'undefined'){
                                                    console.log("fire snapchat purchased event")
                                                    snaptr('track', 'PURCHASE', {'currency': localStorage.getItem("cod_data") ? JSON.parse(localStorage.getItem("cod_data")).currencyWord : "USD", 'price': parseFloat(price)});
                                                }
                                            }
                                        }
                                        // cod upsell function
                                        function upsell_cod_function(dataprouctPrice, dataproductName, datavariantname, datavariantid, datalink, datatarget, isAddToCart, isInitiateCheckout, isPurchased, dataprouctSku, dataprouctQty){
                                            dataprouctPrice = dataprouctPrice ? dataprouctPrice : 0;
                                            //RECENT: Add the replace function
                                            ${funnel_everflow && `
                                                try {
                                                    sourcePR = sourcePR.replace('PLGAMOUNT', parseFloat(dataprouctPrice))
                                                } catch (error) {
                                                    console.log(error)
                                                }`}
                                            var customerData = JSON.parse(localStorage.getItem("cod_data"));
                                            sendFBaddToCartAndInitiateCheckout(isAddToCart, isInitiateCheckout, customerData.email);
                                            customerData.productPrice = dataprouctPrice;
                                            customerData.productName = dataproductName;
                                            customerData.variantName = datavariantname;
                                            customerData.pageid = "${state.page_data.funnel_id}";
                                            customerData.fplg = "${state.page_data.is_fulfill_by_plg}";
                                            customerData.variant_id = datavariantid; // for shopify variant id
                                            customerData.variantQty = dataprouctQty ? dataprouctQty : "1"; // for variant quantity
                                            customerData.variantSku = dataprouctSku ? dataprouctSku : ""; // for variant sku
                                            // RECENT: 
                                            customerData.source_link = sourcePR; // for order link
                                            fetch("/create-customer-charge", {
                                                method: "POST",
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify(customerData)
                                            })
                                            .then(result => {
                                                sendFBPurchaseEvent(isPurchased, dataprouctPrice);
                                                var upsell_localStorage = JSON.parse(localStorage.getItem("plg_prod_list"));
                                                upsell_localStorage.push({
                                                    product_url: window.location.href,
                                                    product_name: dataproductName,
                                                    variant_name: datavariantname,
                                                    product_price: parseFloat(dataprouctPrice)
                                                })
                                                localStorage.setItem("plg_prod_list", JSON.stringify(upsell_localStorage));
                                                window.open(datalink, datatarget);
                                            })
                                            .catch(err => {
                                                // send error error email
                                                window.open(datalink, datatarget);
                                                const email_payload = { toEmail: "tech@themillionairemastermind.com", fromEmail: "fg_error@gmail.com", subjectEmail: "Funnel creating order failed.", textEmail: "COD Upsell Funnel Error: "+err+", Link: "+window.location.href, htmlEmail: "COD Upsell Funnel Error: "+err+", Link: "+window.location.href };
                                                fetch("https://stats.productlistgenie.io/console", { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(email_payload) });

                                                hide_show_loading();
                                                alert("Server Error occurred. Please try again.");
                                            })
                                        }
                                        // stripe upsell function
                                        function upsell_stripe_function(dataprouctPrice, dataproductName, datavariantname, datavariantid, datalink, datatarget, productQty){
                                            dataprouctPrice = dataprouctPrice ? dataprouctPrice : 0;
                                            function stripeDollar (val) {
                                                var str,pos,rnd=0;
                                                if (val < .995) rnd = 1;
                                                    str = escape (val*1.0 + 0.005001 + rnd);
                                                    pos = str.indexOf (".");
                                                if (pos > 0) str = str.substring (rnd, pos + 3);
                                                return str.replace(".","");
                                            }
                                            var redirectLink = datalink;
                                            var redirectTarget = datatarget;
                                            var productPrice = dataprouctPrice;
                                            var stripeToken = localStorage.getItem("stripe_user_id");
                                            fetch("/charge-customer", {
                                                method: 'post',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    amount: stripeDollar(productPrice),
                                                    userid: atob(stripeToken),
                                                    product_name: dataproductName,
                                                    metadata: {
                                                        email: localStorage.getItem("funnel_customer_email"),
                                                        meta: "${this.encryptString(user_id)}",
                                                        variant_name: datavariantname,
                                                        pageid: "${state.page_data.funnel_id}",
                                                        currency: localStorage.getItem("stripe_currency"),
                                                        variant_id: datavariantid // for shopify variant id
                                                    },
                                                    merchantType: "stripe",
                                                    secret: "${private_key}"
                                                })
                                            })
                                            .then(res => res.json())
                                            .then(result => {
                                                if(result.status == "success"){
                                                    var xx_checkout = JSON.parse(localStorage.getItem("plg_prod_list"));
                                                    xx_checkout.push({
                                                        product_url: window.location.href,
                                                        product_name: dataproductName,
                                                        variant_name: datavariantname,
                                                        product_price: dataprouctPrice
                                                    });
                                                    localStorage.setItem("plg_prod_list", JSON.stringify(xx_checkout));
                                                    try {
                                                        sendFBPurchaseEvent(true, dataprouctPrice);
                                                        console.log("Stripe send fb purchase event")
                                                      }
                                                      catch(err) {
                                                        
                                                        console.error("Stripe Error send fb purchase event")
                                                      }
                                                    // for sending email
                                                    const callback = () => setTimeout(() => window.open(redirectLink, redirectTarget), 1000);
                                                    var productName = dataproductName;
                                                    var plg_price = dataprouctPrice;
                                                    var plg_job_id = localStorage.getItem("plg_email_id");

                                                    // unset data for sending email
                                                    var plg_qty = productQty ? parseInt(productQty) : 1;
                                                    var currency_word = "USD";
                                                    var currency_symbol = "$";
                                                    ${this.getSendingEmailRequest()}
                                                } else {
                                                    alert("Payment failed. Please try again.");
                                                    hide_show_loading();
                                                }
                                            })
                                            .catch(err => {
                                                alert("Payment failed. Please try again.");
                                                hide_show_loading();
                                            })
                                        }
                                        // paypal upsell function
                                        function upsell_paypal_function(){
                                            document.querySelectorAll('[data-parent-id]').forEach(el => {
                                                paypal.Buttons({
                                                    style: {
                                                        layout: 'horizontal'
                                                    },
                                                    createOrder: function(data, actions) {
                                                        return actions.order.create({
                                                            purchase_units: [{
                                                                amount: { value: el.getAttribute("data-price") },
                                                                description: el.getAttribute("data-productname").substring(0, 126)
                                                            }]
                                                        });
                                                    },
                                                    onApprove: function(data, actions) {
                                                        return actions.order.capture().then(function(details) {
                                                            // Call your server to save the transaction
                                                            var x_checkout = JSON.parse(localStorage.getItem("plg_prod_list"));
                                                            x_checkout.push({
                                                                product_url: window.location.href,
                                                                product_name: el.getAttribute("data-productname"),
                                                                variant_name: el.getAttribute("data-variantname"),
                                                                product_price: parseFloat(el.getAttribute("data-price"))
                                                            })
                                                            localStorage.setItem("plg_prod_list", JSON.stringify(x_checkout));
                                                            var sendObjectToServer = {
                                                                ...details,
                                                                metadata: {
                                                                    meta: "${this.encryptString(user_id)}",
                                                                    pageid: "${state.page_data.funnel_id}"
                                                                },
                                                                product_name: el.getAttribute("data-productname"),
                                                                variant_name: el.getAttribute("data-variantname"),
                                                                variant_id: el.getAttribute("data-variantid") // for shopify variant id
                                                            }
                                                            hide_show_loading();
                                                            // send initial data to server and send to app.productlistgenie.io
                                                            return fetch('/paypal-orders-initial', {
                                                                method: "POST",
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify(sendObjectToServer)
                                                            })
                                                            .then(res => {
                                                                hide_show_loading();

                                                                // for sending email
                                                                const callback = () => setTimeout(() => window.open(el.getAttribute("data-link"), el.getAttribute("data-target")), 1000);
                                                                var productName = el.getAttribute("data-productname");
                                                                var plg_price = el.getAttribute("data-price");
                                                                var plg_job_id = localStorage.getItem("plg_email_id");

                                                                // unset data for sending email
                                                                var plg_qty = el.getAttribute("data-qty");
                                                                var currency_word = "USD";
                                                                var currency_symbol = "$";
                                                                ${this.getSendingEmailRequest(true)}
                                                            })
                                                            .catch(err => {
                                                                hide_show_loading();
                                                                return window.open(el.getAttribute("data-link"), el.getAttribute("data-target"))
                                                            })
                                                        });
                                                    }
                                                }).render('#'+el.getAttribute('data-parent-id'));
                                            })
                                        }


                                       

                                          // Paypal Subscription Upsell function
                                          function upsell_paypal_subscriptoin_function(){
                                            document.querySelectorAll('[data-parent-id]').forEach(el => {
                                                paypal.Buttons({
                                                    style: {
                                                        layout: 'horizontal'
                                                    },
                                                   
                                                    createSubscription: function(data, actions) {
                                                        return actions.subscription.create({
                                                          plan_id: "\$\{values.paypalSubscriptionID\}"
                                                        });
                                                      },
                                                    onApprove: function(data, actions) {
                                                      
                                                        return actions.subscription.get().then(function(details) {
                                                            
                                                            // Call your server to save the transaction
                                                            var x_checkout = JSON.parse(localStorage.getItem("plg_prod_list"));
                                                            x_checkout.push({
                                                                product_url: window.location.href,
                                                                product_name: el.getAttribute("data-productname"),
                                                                variant_name: el.getAttribute("data-variantname"),
                                                                product_price: parseFloat(el.getAttribute("data-price"))
                                                            })
                                                            localStorage.setItem("plg_prod_list", JSON.stringify(x_checkout));
                                                       

                                                            var sendObjectToServer = {
                                                                 ...details, 
                                                                 payer: {
                                                                     email_address: details.subscriber.email_address,
                                                                     name: {
                                                                        given_name: details.subscriber.name.given_name + " " + details.subscriber.name.surname
                                                                     }
                                                                 }, 
                                                                 purchase_units: [
                                                                    {
                                                                        amount: {
                                                                            value: details.billing_info.last_payment.amount.value
                                                                        },
                                                                        shipping: {
                                                                            name: {
                                                                                full_name: details.subscriber.name.given_name + details.subscriber.name.surname
                                                                            },
                                                                            address: details.subscriber.shipping_address.address

                                                                        }

                                                                    }, 
                                                                    details.subscriber],
                                                                metadata: {
                                                                    meta: "${this.encryptString(user_id)}",
                                                                    pageid: "${state.page_data.funnel_id}"
                                                                },
                                                                product_name: el.getAttribute("data-productname"),
                                                                variant_name: el.getAttribute("data-variantname"),
                                                                variant_id: el.getAttribute("data-variantid") // for shopify variant id
                                                            }
                                                            hide_show_loading();
                                                            // send initial data to server and send to app.productlistgenie.io
                                                            return fetch('/paypal-orders-initial', {
                                                                method: "POST",
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify(sendObjectToServer)
                                                            })
                                                            .then(res => {
                                                                hide_show_loading();

                                                                // for sending email
                                                                const callback = () => setTimeout(() => window.open(el.getAttribute("data-link"), el.getAttribute("data-target")), 1000);
                                                                var productName = el.getAttribute("data-productname");
                                                                var plg_price = el.getAttribute("data-price");
                                                                var plg_job_id = localStorage.getItem("plg_email_id");

                                                                // unset data for sending email
                                                                var plg_qty = el.getAttribute("data-qty");
                                                                var currency_word = "USD";
                                                                var currency_symbol = "$";
                                                                ${this.getSendingEmailRequest(true)}
                                                            })
                                                            .catch(err => {
                                                                hide_show_loading();
                                                                return window.open(el.getAttribute("data-link"), el.getAttribute("data-target"))
                                                            })
                                                        })
                                                    }
                                                }).render('#'+el.getAttribute('data-parent-id'));
                                            })
                                        }

                                        // authorize upsell function
                                        function upsell_authorize_function(dataprouctPrice, dataproductName, datavariantname, datavariantid, datalink, datatarget, productQty){
                                            dataprouctPrice = dataprouctPrice ? dataprouctPrice : 0;
                                            var redirectLink = datalink;
                                            var redirectTarget = datatarget;
                                            var object = JSON.parse(atob(localStorage.getItem("authorize_customer_ids")));
                                            var productPrice = dataprouctPrice;
                                            fetch("/charge-customer", {
                                                method: 'post',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    loginKey: object.loginKey,
                                                    tk: object.tk,
                                                    productPrice: parseFloat(productPrice),
                                                    productName: dataproductName,
                                                    variantName: datavariantname,
                                                    customerProfileId: object.customerProfileId,
                                                    paymentProfileId: object.customerPaymentProfileId,
                                                    merchantType: "authorize.net",
                                                    testMode: object.testMode
                                                })
                                            })
                                            .then(res => res.json())
                                            .then(result => {
                                                // RECENT:
                                                ${funnel_everflow && `
                                                try {
                                                    sourcePR = sourcePR.replace('PLGAMOUNT', parseFloat(dataprouctPrice))
                                                } catch (error) {
                                                    console.log(error)
                                                }`}
                                                object.productName = dataproductName;
                                                object.variantName = datavariantname;
                                                object.productPrice = dataprouctPrice;
                                                object.transID = result.result.transactionResponse.transId;
                                                object.variant_id = datavariantid; // for shopify variant id
                                                // RECENT:
                                                object.source_link = sourcePR;
                                                saveAuthorizeInitialData(object, success => {
                                                    var xx_checkout = JSON.parse(localStorage.getItem("plg_prod_list"));
                                                    xx_checkout.push({
                                                        product_url: window.location.href,
                                                        product_name: dataproductName,
                                                        variant_name: datavariantname,
                                                        product_price: parseFloat(dataprouctPrice)
                                                    });
                                                    localStorage.setItem("plg_prod_list", JSON.stringify(xx_checkout));
                                                    try {
                                                        console.log("Authorize send fb purchase event")
                                                        sendFBPurchaseEvent(true, dataprouctPrice);
                                                      }
                                                      catch(err) {
                                                        console.error("authorize Error send fb purchase event")
                                                      }
                                                    // for sending email 
                                                    const callback = () => setTimeout(() => window.open(redirectLink, redirectTarget), 3000);
                                                    var productName = dataproductName;
                                                    var plg_price = dataprouctPrice;
                                                    var plg_job_id = localStorage.getItem("plg_email_id");

                                                    // unset data for sending email
                                                    var plg_qty = productQty ? parseInt(productQty) : 1;
                                                    var currency_word = "USD";
                                                    var currency_symbol = "$";
                                                    ${this.getSendingEmailRequest()}
                                                })
                                            })
                                            .catch(err => {
                                                alert("Payment failed. Please try again.");
                                                hide_show_loading();
                                            })

                                            function saveAuthorizeInitialData(result, success, error){
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
                                        }
                                        // upsell function
                                        function upsell_downsell(element, isAddToCart, isInitiateCheckout, isPurchased, useConfirmation){
                                            var dataprouctPrice = element.getAttribute('data-price');
                                            var dataproductName = element.getAttribute('data-productname')
                                            var datavariantname = element.getAttribute('data-variantname');
                                            var datavariantid = element.getAttribute('data-variantid');
                                            var datalink = element.getAttribute('data-link');
                                            var datatarget = element.getAttribute('data-target');
                                            var productQty = element.getAttribute('data-qty');
                                            var productSku = element.getAttribute('data-sku');
                                            hide_show_confirmation(element, useConfirmation, () => {
                                                if(localStorage.getItem("cod_data") && localStorage.getItem("plg_prod_list")){
                                                    hide_show_loading();
                                                    upsell_cod_function(dataprouctPrice, dataproductName, datavariantname, datavariantid, datalink, datatarget, isAddToCart, isInitiateCheckout, isPurchased, productSku, productQty);
                                                } else if(localStorage.getItem("stripe_user_id")){
                                                    hide_show_loading();
                                                    upsell_stripe_function(dataprouctPrice, dataproductName, datavariantname, datavariantid, datalink, datatarget, productQty);
                                                } else if(localStorage.getItem("paypal_as_checkout")){
                                                    alert("Please click on the paypal button below");
                                                } else if(localStorage.getItem("authorize_customer_ids")){
                                                    hide_show_loading();
                                                    upsell_authorize_function(dataprouctPrice, dataproductName, datavariantname, datavariantid, datalink, datatarget, productQty);
                                                } else if(localStorage.getItem("refTransaction")){  // RECENT: PAYPAL v2
                                                    hide_show_loading();
                                                    doRefTransaction(element)
                                                } else {
                                                    alert("Did not go through checkout.");
                                                }
                                            })
                                        }
                                        // Aug17
                                        if(localStorage.getItem("paypal_as_checkout")){
                                            if("\$\{values.paypalSubscriptionID\}" != "") {
                                                upsell_paypal_subscriptoin_function()
                                                try {
                                                    document.querySelectorAll('.u_content_buttons').forEach(el => {
                                                        el.firstElementChild.style.display = "none";
                                                        el.style.textAlign = "center";
                                                    })
                                                } catch (error) {
                                                    console.log("non existing")
                                                }
                                            } else {
                                                 upsell_paypal_function()
                                            }
                                        }
                                        function hide_show_confirmation(element, useConfirmation, callback){
                                            const headerText = element.getAttribute('data-cHeader');
                                            const positiveText = element.getAttribute('data-cpButton');
                                            const negativeText = element.getAttribute('data-cnButton');
                                            window.callback = callback;
                                            if(useConfirmation){
                                                if(document.getElementById("upsell_confirmation")){
                                                    // if confirmation is showing (hide it)
                                                    closeConfirmationModal();
                                                } else {
                                                    var confirmation = \\\`
                                                        <style>
                                                            #upsell_confirmation button { border-radius: 5px; font-size: 20px; padding: 10px; cursor: pointer; border: none; } #upsell_confirmation button.positive-button { color: #ffffff; background-color: #26c686; } #upsell_confirmation button.negative-button { color: #ffffff; background-color: #f16f6f; }
                                                        </style>
                                                        <div style="position: fixed; width: 100%; height: 100vh; overflow: scroll; z-index: 9999; top: 0; left: 0;">
                                                            <div style="align-items: center; display: flex; flex-direction: column; margin: auto; min-height: 100%; justify-content: center; background-color: #00000078;">
                                                                <div style="padding: 20px; background-color: #ffffff; border-radius:\$\{values.borderRadius_popup\};">
                                                                    <h1 style="margin: 0 0 10px;">\\\$\\\{headerText\\\}</h1>
                                                                    <div style="display: flex; flex-flow: row wrap; -webkit-flex-flow: row wrap; justify-content: space-around;">
                                                                        <button class="positive-button" style="width: 48%; margin: 0 1%;" onclick="closeConfirmationModal(); window.callback();">\\\$\\\{positiveText\\\}</button>
                                                                        <button class="negative-button" style="width: 48%; margin: 0 1%;" onclick="closeConfirmationModal()">\\\$\\\{negativeText\\\}</button>
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
                                    </script>
                                \`
                                var selectedVariant = JSON.parse(values.variants).filter(el => el.isSuggest);
                                var variantid = "";
                                var variantName = values.text;
                                if(selectedVariant.length != 0 && selectedVariant[0].price){
                                    values.productName = selectedVariant[0].shopifyProduct.name;
                                    variantName = selectedVariant[0].variant_name;
                                    values.productPrice = selectedVariant[0] && selectedVariant[0].price ? selectedVariant[0].price : 0;
                                    variantid = selectedVariant[0].id;
                                    values.productTag = selectedVariant[0].tag;
                                    values.productQty = selectedVariant[0].variant_qty ? selectedVariant[0].variant_qty : "1";
                                    values.productSku = selectedVariant[0].variant_sku ? selectedVariant[0].variant_sku : "";
                                }
                                return \`<div style="text-align: \$\{values.alignment\}">
                                    \$\{exportStyle\}
                                    <div class="hide-in-mobile">
                                        <button
                                            data-parent-id="\$\{values._meta.htmlID\}"
                                            data-qty="\$\{values.productQty ? values.productQty : "1"\}"
                                            data-sku="\$\{values.productSku ? values.productSku : ""\}"
                                            data-tag="\$\{values.productTag\}"
                                            data-price="\$\{values.productPrice.replace(/,/g,".")\}"
                                            data-productname="\$\{values.productName\}"
                                            data-variantname="\$\{variantName\}"
                                            data-variantid="\$\{variantid\}" 
                                            data-link="\$\{values.buttonLink.url\}"
                                            data-target="\$\{values.buttonLink.target\}"
                                            data-cHeader="\$\{values.cHeader\}"
                                            data-cpButton="\$\{values.cPositiveButton\}"
                                            data-cnButton="\$\{values.cNegativeButton\}"
                                            onclick="upsell_downsell(this, \$\{values.fbTrack\}, \$\{values.fbInitiate\}, \$\{values.fbPurchase\}, \$\{values.useConfirmation\})" 
                                            onmouseover="this.style.backgroundColor='\$\{btnhoverColor\}'" onmouseleave="this.style.backgroundColor='\$\{btnBackgroundColor\}'"\ class="\$\{values.animation\}"
                                            style="border-radius: \$\{values.borderRadius\}; font-size: \$\{values.fontSize\}; padding: \$\{values.padding\}; color: \$\{btnColor\}; background-color: \$\{btnBackgroundColor\}; cursor: pointer; border: none; width: \$\{values.buttonWidth\};">
                                            \$\{values.text\}
                                            <div class="subtext" style="font-weight: 400; font-size: calc(\$\{values.fontSize\} * .75);">
                                                \$\{values.subText\}
                                            </div>
                                        </button>
                                    </div>
                                    <script>
                                        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                                        if(\$\{values.isSticky\} && isMobile){
                                            window.onscroll = function() {stickyFunction()};
                                            var header = document.querySelector(".hide-in-mobile");
                                            var sticky = header.offsetTop;
                                            function stickyFunction() {
                                                if(isMobile){
                                                    if (window.pageYOffset > sticky) {
                                                        header.classList.add("mobile-sticky");
                                                    } else {
                                                        header.classList.remove("mobile-sticky");
                                                    }
                                                }
                                            }
                                        }
                                        function hide_show_loading(){
                                            if(document.getElementById("upsell_loading")){
                                                document.getElementById("upsell_loading").remove();
                                            } else {
                                                var xx = '<style> #spinner { position: relative; width: 100%; height: 100%; } #spinner:after { content: ""; display: block; position: absolute; width: 80px; height: 80px; margin-left: -40px; margin-top: -40px; border: 5px solid #d1faeb; -moz-border-radius: 50%; -webkit-border-radius: 50%; border-radius: 50%; border-top-color: #26c686; border-right-color: #26c686; -moz-animation: rotate 0.5s linear infinite; -webkit-animation: rotate 0.5s linear infinite; animation: rotate 0.5s linear infinite; } @-moz-keyframes rotate { 0% { -moz-transform: rotateZ(-360deg); transform: rotateZ(-360deg); } 50% { -moz-transform: rotateZ(-180deg); transform: rotateZ(-180deg); } 100% { -moz-transform: rotateZ(0deg); transform: rotateZ(0deg); } } @-webkit-keyframes rotate { 0% { -webkit-transform: rotateZ(-360deg); transform: rotateZ(-360deg); } 50% { -webkit-transform: rotateZ(-180deg); transform: rotateZ(-180deg); } 100% { -webkit-transform: rotateZ(0deg); transform: rotateZ(0deg); } } @keyframes rotate { 0% { -moz-transform: rotateZ(-360deg); -ms-transform: rotateZ(-360deg); -webkit-transform: rotateZ(-360deg); transform: rotateZ(-360deg); } 50% { -moz-transform: rotateZ(-180deg); -ms-transform: rotateZ(-180deg); -webkit-transform: rotateZ(-180deg); transform: rotateZ(-180deg); } 100% { -moz-transform: rotateZ(0deg); -ms-transform: rotateZ(0deg); -webkit-transform: rotateZ(0deg); transform: rotateZ(0deg); } } </style> <div style="position: fixed; width: 100%; height: 100vh; overflow: scroll; z-index: 9999; top: 0; left: 0;"><div style="align-items: center; display: flex; flex-direction: column; margin: auto; min-height: 100%; justify-content: center; background-color: #00000078;"><div style="display: flex; align-items: center; padding: 100px;"><div id="spinner"></div></div></div></div>';
                                                var div = document.createElement("div");
                                                div.id="upsell_loading";
                                                div.innerHTML = xx;
                                                document.body.appendChild(div);
                                            }
                                        }
                                        // Paypalv2 upsell reference transaction
                                        function doRefTransaction(elementValues){
                                            var captured = localStorage.getItem('refTransaction')
                                            var refId = captured ? captured : '';
                                            var payload = {
                                                    method: 'DoReferenceTransaction',
                                                    keys: localStorage.getItem('plgppkeys'),
                                                    price: elementValues.dataset.price,
                                                    currencycode: 'USD',
                                                    paymentaction: 'SALE',
                                                    referenceId: refId,
                                                    desc: elementValues.dataset.productname
                                                }
                                                fetch('/paypalv2-capture-upsell', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify(payload)
                                                })
                                                .then(response => response.text() )
                                                .then(async result => {
                                                    let doAJsonResponse = {
                                                        success : false,
                                                        transactionId: null
                                                    };
                                                    console.log(result)
                                                    const resArray = result.split('&');
                                                    await resArray.forEach(function(v, i ,rr){
                                                        //make string response as json
                                                        vArray = v.split('=');
                                    
                                                        if(vArray[0] == 'ACK'){
                                                            doAJsonResponse.success = vArray[1] == 'Success'  ? 1 : 0;
                                                        }
                                    
                                                        if(vArray[0] == 'TOKEN'){
                                                            doAJsonResponse.token = vArray[1];
                                                        }
                                    
                                                        if(vArray[0] == 'TRANSACTIONID'){
                                                            doAJsonResponse.transactionId = vArray[1];
                                                        }
                                                    });
                                    
                                                    if(doAJsonResponse.success){
                                                        //Get Payment Transaction Details
                                                        const formattedData = await getTransactionDetails(doAJsonResponse.transactionId, elementValues);
                                                    }
                                                    return doAJsonResponse;
                                                })
                                                .catch(error => {
                                                    hide_show_loading()
                                                    console.log('error', error)
                                                });
                                        }   
                                    
                                            async function getTransactionDetails(transactionId, elementValues){
                                                let formattedData = null;
                                                var payload = {
                                                method: 'GetTransactionDetails',
                                                keys: localStorage.getItem('plgppkeys'),
                                                transactionId: transactionId,
                                                metadata: {
                                                    meta: document.querySelector("meta[plgdata][data-cid]").getAttribute("data-cid"),
                                                    pageid: document.querySelector("meta[plgdata][data-pageid]").getAttribute("data-pageid")
                                                },
                                                variant_id: elementValues.dataset.variantid,
                                                source_link: sourcePR ? sourcePR.replace('PLGAMOUNT', parseFloat(elementValues.dataset.price)) : '',
                                                }
                                    
                                                await fetch('/paypalv2-orders-initial', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify(payload)
                                                }).then(
                                                    response => response.text() 
                                                ).then(async result => {

                                                let upsell_localStorage = JSON.parse(localStorage.getItem("plg_prod_list"));
                                                upsell_localStorage.push({
                                                    product_url: window.location.href,
                                                    product_name: elementValues.dataset.productname,
                                                    variant_name: elementValues.dataset.variantname,
                                                    product_price: parseFloat(elementValues.dataset.price)
                                                })
                                                localStorage.setItem("plg_prod_list", JSON.stringify(upsell_localStorage));
                                                    //save transaction details to server here
                                                    window.location.href = elementValues.dataset.link
                                                }).catch(error => {
                                                    hide_show_loading()
                                                    console.log(error)
                                                });
                                               
                                                return
                                            }
                                    </script>
                                    \$\{upsellScript\}
                                </div>
                                \`;
                            } else {
                                return \`<div style="text-align: \$\{values.alignment\}">
                                    \$\{exportStyle\}
                                    <div class="hide-in-mobile">
                                        <button
                                            data-tag="\$\{values.productTag\}"
                                            onclick="\$\{values.fbTrack\} && typeof fbq !== 'undefined' ? fbq('track', 'AddToCart') : void 0; window.open('\$\{values.buttonLink.url\}','\$\{target\}')"
                                            onmouseover="this.style.backgroundColor='\$\{btnhoverColor\}'"
                                            onmouseleave="this.style.backgroundColor='\$\{btnBackgroundColor\}'"
                                            class="\$\{values.animation\}"
                                            style="border-radius: \$\{values.borderRadius\}; font-size: \$\{values.fontSize\}; padding: \$\{values.padding\}; color: \$\{btnColor\}; background-color: \$\{btnBackgroundColor\}; cursor: pointer; border: none; width: \$\{values.buttonWidth\}; font-weight: \$\{values.fontWeight\};">
                                            \$\{values.text\}
                                            <div class="subtext" style="font-weight: 400; font-size: calc(\$\{values.fontSize\} * .75);">
                                                \$\{values.subText\}
                                            </div>
                                        </button>
                                    </div>
                                    <script>
                                        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                                        if(\$\{values.isSticky\} && isMobile){
                                            window.onscroll = function() {stickyFunction()};
                                            var header = document.querySelector(".hide-in-mobile");
                                            var sticky = header.offsetTop;
                                            function stickyFunction() {
                                                if(isMobile){
                                                    if (window.pageYOffset > sticky) {
                                                        header.classList.add("mobile-sticky");
                                                    } else {
                                                        header.classList.remove("mobile-sticky");
                                                    }
                                                }
                                            }
                                        }
                                    </script>
                                </div>
                                \`;
                            }
                        }
                    }
                }
            });

            `;
        },
    };