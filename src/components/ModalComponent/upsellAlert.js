import React from 'react';
import Popup from 'reactjs-popup';
const points = require('../../../Global_Values');

class UpsellAlert extends React.Component {
    constructor(props) {
        super(props);
    }

    // start for date computation
    datediff(first, second) {
        return Math.round((second-first)/(1000*60*60*24));
    }

    parseDate(str) {
        var mdy = str.split('/');
        return new Date(mdy[2], mdy[0]-1, mdy[1]);
    }

    formatDate(date) {
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getUTCFullYear();
        return (monthIndex+1) + '/' + day + '/' + year;
    }

    daysLeftForTrialUser(){
        if (this.props.session.getCurrentUser && this.props.session.getCurrentUser.privilege == 1) { // User Privilege
            let joinDate = new Date(parseInt(this.props.session.getCurrentUser.joinDate));
            let dateNow = new Date();
            let result = new Date(joinDate.getTime() + (86400000 * 7))
            return result.toDateString();
        }
    }
    // end for date computation

    render(){
        return(
            <div>
                <Popup open={this.props.open} closeOnDocumentClick onClose={this.props.closeModal}>
                    <div className="modal">
                        <a className="close" onClick={this.props.closeModal}>
                            &times;
                        </a>
                        <div className="content">
                        {(() => {
                            if(this.props.upsellLink != null){
                                return (
                                    <div className="center-vertical text-center">
                                        <h2>To Unlock The Million Dollar Training.</h2>
                                        <p>Click <a href={this.props.upsellLink} target="_blank">here</a></p>
                                    </div>
                                );
                            } else if (this.props.session.getCurrentUser && this.props.session.getCurrentUser.privilege == 0) { // User Privilege
                                return (
                                    <div className="center-vertical">
                                        <p><strong>Oops,</strong> it seems that you do not have permissions to view this page.&nbsp;<br />
                                        If this is a mistake, please contact support via chat.&nbsp;</p>
                                        <p>if you want to become a full access member, Upgrade account <a href={points.upgradeAccountLink+"?email="+this.props.session.getCurrentUser.email} target="_blank"><strong>here</strong></a></p>
                                    </div>
                                );
                            } else if (this.props.session.getCurrentUser && this.props.session.getCurrentUser.privilege == 1) { // User Privilege
                                return (
                                    <div className="center-vertical text-center" style={{ lineHeight: 1.5}}>
                                        <h1 className="fas fa-lock"></h1> <br/>
                                        Did you love ❤️ the free content so far ? {/*this.daysLeftForTrialUser()*/}<br />
                                        Well imagine how good will this be when paid<br/><br/>
                                        <div className="form_buttons">
                                            <a className="btn" href={points.upgradeAccountLink + "?email=" + this.props.session.getCurrentUser.email} target="_blank">
                                                Upgrade today
                                            </a>
                                        </div>
                                    </div>
                                );
                            }
                        })()}
                        </div>
                    </div>
                </Popup>
            </div>
        );
    }
}

export default UpsellAlert;