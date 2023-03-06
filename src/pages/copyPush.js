import React from 'react';
import Modal from '../components/ModalComponent/';
import toastr from 'toastr';
import Popup from 'reactjs-popup';
const points = require('../../Global_Values');

class CopyPush extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disableBtn: false,
            errorPrompt: ""
        }
        this.togglePointsAnimation = this.togglePointsAnimation.bind(this);
    }

    checkPrivilege() {
        if (this.props.session.getCurrentUser.privilege == 0) { // User Privilege
            this.setState({
                errorPrompt: "Free User (lvl0). Can't use copy push."
            })
        }
    }

    componentDidMount() {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut": 0,
            "extendedTimeOut": 0,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        this.checkPrivilege();
    }

    copyPush(event) {
        var pushclean = document.getElementById("scrape_url").value.replace(/\?.*/g, '');
        this.pushpr(pushclean);
    }

    handleKeyUp(event) {
        if (event.keyCode === 13) {
            this.copyPush();
        }
    }

    updatePoints() {
        var id = this.props.session.getCurrentUser.id;
        var value = points.points_copyPush;
        var payload = { "query": `mutation{\n  mutate1: updateCount(id:\"${id}\", increaseWhat: "copy_push"){\n    email },\n  \n  mutate2: updateRewardPoints(id:\"${id}\", source: "Copy Push", reward_points:${value}){\n    points\n    date\n  }\n}`, "variables": null }
        fetch(points.clientUrl + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                toastr.clear();
                toastr.success('Click here to view it on your store', 'Success');
                this.togglePointsAnimation(value);
                points.playSoundEffect();
                this.props.refetch();
                this.setState({
                    disableBtn: false
                })
            })
            .catch(err => {
                toastr.clear();
                toastr.success('Please Try Again', 'Copy Push Failed');
                this.setState({
                    disableBtn: false
                })
            });
    }

    pushpr(product_link, wh) {
        if (this.props.session.getCurrentUser.store_url) {
            this.setState({ disableBtn: true }, () => {
                if (this.state.disableBtn) {
                    if (!product_link) {
                        toastr.clear();
                        toastr.warning('Product Page URL cannot be empty.', 'No URL');
                    } else if (this.props.session.getCurrentUser.count_copyPush < points.limit_copyPush) {
                        push(this);
                    } else if (this.props.session.getCurrentUser.privilege > 1) { // User Privilege
                        push(this);
                    } else {
                        toastr.clear();
                        toastr.warning('Seems like you exceed your daily limit to copy push more product.', 'Copy Push Limit');
                    }
                }
            });
        } else {
            toastr.clear();
            toastr.warning('Seems like your not connected to your store yet', 'Connect Your Store');
            window.toggleConnectModal()
        }

        function push(self) {
            toastr.clear();
            toastr.info('please wait...', 'Granting Your wish');
            var data = {
                shop: self.props.session.getCurrentUser.store_url,
                token: self.props.session.getCurrentUser.store_token,
                src: product_link,
                domain: self.props.session.getCurrentUser.store_url,
                vendor_link: '',
                wh: wh
            };
            fetch(points.apiServer + '/endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(resultData => {
                    if (resultData.status === "success") {
                        toastr.options.onclick = function () {
                            window.open('https://' + resultData.message, '_blank');
                            toastr.clear();
                        }
                        self.updatePoints();
                    }
                });
        }
    }



    togglePointsAnimation(pts) {
        var rewardPoints = document.getElementById('rewardPoints');
        rewardPoints.innerHTML = `+${pts} points`;
        rewardPoints.classList.add("points-anim")
        setTimeout(function () {
            rewardPoints.classList.toggle("points-anim")
        }.bind(), 4000);
    }

    render() {
        return (
            <div>
                <Modal open={this.props.open} closeModal={!this.state.disableBtn ? this.props.closeModal : null}>
                    <div className="text-center">
                        <h2>Copy product from other shopify store</h2>
                        {this.state.errorPrompt != "" &&
                            <div className="product-card infoheader" style={{ marginTop: 0, width: '100%' }}>
                                <span className="infoheadercircle infocircle custom-style-warning"><i className="fas fa-exclamation-triangle"></i></span>
                                <div className="notification-message" dangerouslySetInnerHTML={{ __html: this.state.errorPrompt }} />
                            </div>
                        }
                    </div>
                    <div className="form_wrap center-vertical">
                        <div className="form_row">
                            <div className="center-vertical form_item" style={{ width: '70%', margin: '0 auto' }}>
                                <label>Product page URL&nbsp;
                                    <Popup
                                        trigger={<span className="infocircle">i</span>}
                                        position="right center"
                                        on="click" className="points-tooltip">
                                        <div style={{ padding: '5px 20px', overflow: 'hidden' }}>
                                            <h3>How to copy products?</h3>
                                            <div style={{ textAlign: 'left' }}>
                                                <iframe id="how-to-review" src={"https://player.vimeo.com/video/310447300"} width="800" height="500" autoPlay="true" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                                            </div>
                                        </div>
                                    </Popup>
                                </label>
                                <div className="form_input">
                                    <br />
                                    <input id="scrape_url" type="text" onKeyUp={this.handleKeyUp.bind(this)} placeholder="https://someone-elsestore.com/product/cool-product" />
                                    <span className="bottom_border"></span>
                                </div> <br />
                                <div className="text-center form_buttons">
                                    <button className="btn" onClick={this.copyPush.bind(this)} disabled={this.state.errorPrompt ? true : this.state.disableBtn}>Copy Push</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default CopyPush;