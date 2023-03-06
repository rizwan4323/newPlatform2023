import React from 'react';
import Modal from '../components/ModalComponent/';
import toastr from 'toastr';
import Popup from 'reactjs-popup';
const points = require('../../Global_Values');

class AdsSpy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            AdsSpyURL: '',
            errorPrompt: ''
        }
    }

    checkPrivilege(){
        if (this.props.session.getCurrentUser && this.props.session.getCurrentUser.privilege == 0) { // User Privilege
            this.setState({
                errorPrompt: "Free User (lvl0). Can't use ads spy."
            })
        }
    }

    componentDidMount(){
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut":0,
            "extendedTimeOut":0,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        this.checkPrivilege();
    }

    handleChange(event){
        this.setState({AdsSpyURL: event.target.value});
    }

    handleKeyUp(event){
        if(event.keyCode === 13){
            this.showAds();
        }
    }

    showAds(event){
        if(this.state.AdsSpyURL){
            toastr.clear();
            toastr.info('Please wait...', 'Granting Your Wish');
            points.webSpy(this.state.AdsSpyURL, res => {
                if(res.status != "error"){
                    toastr.clear();
                    toastr.options.onclick = function (){
                        window.open(res.message,'_blank');
                    }
                    toastr.clear();
                    toastr.success('Click here to see their ads', 'Wish Granted!');
                } else {
                    toastr.clear();
                    toastr.warning(res.message, 'Wish Failed to grant');
                }
            });
        } else {
            toastr.clear();
            toastr.warning('Please enter url to continue.', 'URL Cannot be empty');
        }
    }

    render() {
        return (
            <div>
                <Modal open={this.props.open} closeModal={this.props.closeModal} session={this.props.session}>
                    <div className="text-center">
                        <h2>Spy on other store see their ads running on facebook</h2>
                        {this.state.errorPrompt != "" &&
                            <div className="product-card infoheader" style={{marginTop: 0, width: '100%'}}>
                                <span className="infoheadercircle infocircle custom-style-warning"><i className="fas fa-exclamation-triangle"></i></span>
                                <div className="notification-message" dangerouslySetInnerHTML={{__html: this.state.errorPrompt}} />
                            </div>
                        }
                    </div>
                    <div className="form_wrap center-vertical">
                        <div className="form_row">
                            <div className="center-vertical form_item" style={{width: '70%', margin: '0 auto'}}>
                                <label>URL&nbsp;
                                    <Popup
                                        trigger={<span className="infocircle">i</span>}
                                        position="bottom center"
                                        on="click" className="points-tooltip">
                                        <div style={{padding: '5px 20px', overflow: 'hidden'}}>
                                            <h3>How to use ads spy?</h3>
                                            <div style={{textAlign: 'left'}}>
                                                ...
                                            </div>
                                        </div>
                                    </Popup>
                                </label>
                                <div className="form_input">
                                    <br />
                                    <input type="text" value={this.state.AdsSpyURL} onKeyUp={this.handleKeyUp.bind(this)} onChange={this.handleChange.bind(this)} placeholder="someone-elsestore.com or facebook.com/someone-elsestore" />
                                    <span className="bottom_border"></span>
                                </div> <br />
                                <div className="text-center form_buttons">
                                    <button className="btn" onClick={this.showAds.bind(this)} disabled={this.state.errorPrompt ? true : false}>SHOW ME THEIR ADS</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default AdsSpy;