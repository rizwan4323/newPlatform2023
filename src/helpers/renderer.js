import React from 'react';
import webConfig from './../../webConfig';

const HTML = ({ content, state, helmet }) => {

    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();
    var style = {};
    if(!state.ROOT_QUERY.getCurrentUser && bodyAttrs.className != "logInPage" && bodyAttrs.className != "signUpPage") {
        style = { opacity: 0, backgroundColor: '#262f36' };
    }
   

    return (
        <html lang="en" {...htmlAttrs}>
            <head dangerouslySetInnerHTML={{
            __html: `${helmet.title.toString()}
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            ${helmet.meta.toString()}
            <link rel="shortcut icon" href="${webConfig.siteURL}/assets/graphics/favicon.ico">
            <link href="${webConfig.siteURL}/assets/css/styles.min.css" rel="stylesheet" type="text/css" />
            <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet" />
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossOrigin="anonymous" />
            <script src="//fast.appcues.com/49226.js"></script>
            <!-- <link rel="manifest" href="/manifest.json" /> -->
            <link href="https://fonts.googleapis.com/css?family=Questrial|Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&display=swap" rel="stylesheet" />
            <!-- <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>
            <script>
                var OneSignal = window.OneSignal || [];
                OneSignal.push(function() {
                    OneSignal.init({
                        appId: "23fcd08d-2d5f-414b-962f-57cd842557d0",
                    });
                });
            </script> -->
            `}}>
            </head>
            <body {...bodyAttrs} style={style}>
                <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
                {/* <script dangerouslySetInnerHTML={{
                    __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
                }} /> */}
                <script src="https://cdn.ckeditor.com/4.11.2/full/ckeditor.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
                <script src={`${webConfig.siteURL}/client_bundle.js`}></script>
                <script type="text/javascript" src="//static.criteo.net/js/ld/ld.js" async="true" />

                <script dangerouslySetInnerHTML={{ __html: `
                    window.fbAsyncInit = function () {
                        FB.init({
                            appId: "724118794655060",
                            autoLogAppEvents: true,
                            xfbml: true,
                            version: "v3.2"
                        });
                    };

                    (function (d, s, id) {
                        var js, fjs = d.getElementsByTagName(s)[0];
                        if (d.getElementById(id)) { return; }
                        js = d.createElement(s); js.id = id;
                        js.src = "https://connect.facebook.net/en_US/sdk.js";
                        fjs.parentNode.insertBefore(js, fjs);
                    }(document, "script", "facebook-jssdk"));
                ` }} />
                <script dangerouslySetInnerHTML={{ __html: `
                 if(!window.localStorage.getItem("localBrowserDate")){
                    window.localStorage.setItem("localBrowserDate", new Date().getTimezoneOffset())
                }
                    window.onload = () => {
                        if (document.body.style.removeProperty) {
                            document.body.style.removeProperty('opacity');
                            document.body.style.removeProperty('background-color');
                        } else {
                            document.body.style.removeAttribute('opacity');
                            document.body.style.removeAttribute('background-color');
                        }
                    }
                ` }} />

<div rel="PJT2u75YbWZa" article="" product="" embedded = "1" id="kartra_live_chat" className="kartra_helpdesk_sidebar" >
                <script type="text/javascript" src="https://app.kartra.com/resources/js/helpdesk_frame"></script>
                <link rel="stylesheet" type="text/css" href="https://app.kartra.com/css/new/css/kartra_helpdesk_sidebar_out.css" />
	<div rel="PJT2u75YbWZa" id="display_kartra_helpdesk" className="kartra_helpdesk_sidebar_button open">
	</div>

                {/* <script dangerouslySetInnerHTML={{__html: ` ` }} 
                /> */}

                </div>
            </body>
        </html>
    )
}


export default HTML;