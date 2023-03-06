import React from 'react';
import { NavLink } from 'react-router-dom';

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    getAnotherTag() { // User Privilege
        const level = this.props.privilege;
        if(!level) return "";
        else if(level == 1){
            return "Trial";
        } else if(level == 2) {
            return "Basic Subscriber";
        } else if(level == 3) {
            return "Subscriber";
        } else if(level == 4) {
            return "Special Case";
        } else if(level == 5) {
            return "Sales Agent";
        } else if(level == 10) {
            return "Admin User";
        } else {
            return "Reserve Level";
        }
    }

    render() {
        const another_tag = this.getAnotherTag();
        return (
            <footer className="footer">
                <ul>
                    <li>
                        <NavLink activeClassName="nav-active" to="/cancellation-policy">
                            Cancellation Policy</NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName="nav-active" to="/privacy-policy">
                            Privacy Policy</NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName="nav-active" to="/terms">
                            T&amp;C's</NavLink>
                    </li>
                </ul>

                {/* <script dangerouslySetInnerHTML={{__html: `
                    window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
                    d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
                    _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute("charset","utf-8");
                    $.src="https://v2.zopim.com/?5g4eM7JRiKwyYZcf3pox8UZ0AmR8z5EZ";z.t=+new Date;$.
                    type="text/javascript";e.parentNode.insertBefore($,e)})(document,"script");
                    $zopim(function() {
                        $zopim.livechat.removeTags("Level: ");
                        ${this.props.name ? `$zopim.livechat.setName('${this.props.name}');` : void 0}
                        ${this.props.email ? `$zopim.livechat.setEmail('${this.props.email}');` : void 0}
                        ${another_tag ? `$zopim.livechat.addTags('Level: ${this.props.privilege}');` : void 0}
                        ${another_tag ? `$zopim.livechat.addTags('${another_tag}');` : void 0}
                    });
                `}} 
                /> */}
               

                
                <script dangerouslySetInnerHTML={{__html: `
                    (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:1141407,hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                `}} />
                {/* <div className="funnel plg-zopim" onClick={() => window.open('/plg_zopim?name='+this.props.name+'&email='+this.props.email+'&lvl='+this.props.privilege, '_blank')}>
                    <div className="display-inline cursor-pointer zopim-container">
                        <div className="display-inline zopim-icon">
                            <span className="fas fa-comment-alt color-white" />
                        </div>
                        <label className="font-roboto-bold">Chat With Us</label>
                    </div>
                    <script dangerouslySetInnerHTML={{__html: `
                        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                        if(isMobile) {
                            document.querySelector(".plg-zopim").style.cssText = "width: 92px; right: 15px; bottom: 15px;";
                            document.querySelector(".zopim-icon").style.cssText = "width: 40%;";
                            document.querySelector(".zopim-container label").innerText = "Chat";
                        }
                    `}} />
                </div> */}
            </footer>
        );
    }
}

export default Footer;