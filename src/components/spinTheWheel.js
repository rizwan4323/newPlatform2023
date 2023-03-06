import React from 'react';
import Modal from '../components/ModalComponent/';
import Winwheel from '../components/scripts/winWheel'
import toastr from 'toastr';
const points = require('../../Global_Values');

var audio = null;
var initialTheWheel = null;
var wheelSpinning = false;

const encode = str => {
    return new Buffer(str).toString('base64');
}

class SpinTheWheel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            theWheel: null,
            mystery_product: '',
            preventModalFromClosing: false
        }
        this.updatePoints = this.updatePoints.bind(this)
    }

    componentDidMount(){
        toastr.options = {
            "progressBar": true,
            "closeButton": false,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut":5000,
            "extendedTimeOut":2000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        audio = new Audio('https://cdn.shopify.com/s/files/1/2865/2146/files/cl3.mp3');
        
        var randomDegree = Math.random() * (360-0) + 0 ;

        initialTheWheel = new Winwheel({
            'rotationAngle': randomDegree,
            'canvasId': 'myCanvas',
            'outerRadius': 212,
            'innerRadius': 35,
            'textFontSize': 24,
            'textFontTransform': 'uppercase',
            'textAlignment': 'outer',
            'strokeStyle': '#13bec7',
            'textAlignment': 'center',
            'lineWidth': 2,
            'textFontWeight': 300,
            'responsive': true,
            'textOrientation': 'horizontal',
            'numSegments': 8,
            'segments': [
                { 'fillStyle': '#0e3967e6', 'text': '200 PTS', 'textFillStyle': '#fff', 'textFontSize': 17 },
                { 'fillStyle': '#19c6d0', 'text': 'MYSTERY PRODUCT', 'textFontSize': 12, },
                { 'fillStyle': '#bfd1daed', 'text': '500 PTS', 'textFillStyle': '#4c6377', 'textFontSize': 17 },
                { 'fillStyle': '#de281ee8', 'text': 'MYSTERY PRODUCT', 'textFillStyle': '#ffff', 'textFontSize': 12 },
                { 'fillStyle': '#0e3967e6', 'text': '300 PTS', 'textFillStyle': '#fff', 'textFontSize': 17 },
                { 'fillStyle': '#19c6d0', 'text': 'MYSTERY PRODUCT', 'textFillStyle': '#122446', 'textFontSize': 12 },
                { 'fillStyle': '#bfd1daed', 'text': '200 PTS', 'textFillStyle': '#4c6377', 'textFontSize': 17 },
                { 'fillStyle': '#de281ee8', 'text': 'MYSTERY PRODUCT', 'textFillStyle': '#fff', 'textFontSize': 12 }
            ],
            'animation': {
                'type': 'spinToStop',
                'duration': 15,
                'spins': 8,
                'callbackFinished': this.updatePoints,
                'callbackSound': this.playSound,
                'soundTrigger': 'pin'
            },
            'pins': {
                'number': 8,
                'responsive': true,
                'outerRadius': 0,
            }
        });
        
        this.setState({
            theWheel: initialTheWheel
        })

        points.getMysteryProduct(res => {
            var mp_regexp = new RegExp(/\/products\/.*/)
            var handleOfMP = res.data.getAdminSettings.mystery_product_url.match(mp_regexp).toString().replace("/products/", "")
            var mp_obj = {
                mp_handle: handleOfMP
            }
            mp_obj = this.encode(JSON.stringify(mp_obj))
            this.setState({
                mystery_product: mp_obj
            })
        })
    }

    encode(str){
        return btoa(unescape(encodeURIComponent(str)));
    }

    playSound() {
        audio.volume = 0.05
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }


    updatePoints(indicatedSegment) {
        var self = this;
        if(indicatedSegment.text.toLowerCase() == "mystery product"){
            toastr.clear();
            toastr.options.timeOut = 0;
            toastr.options.onclick = () => {
                window.open(points.clientUrl+"/product-details/"+this.state.mystery_product,'_blank');
            }
            toastr.success("Click <strong>HERE</strong> to get your mystery product", "Congratulations!")
            this.togglePointsAnimation("CONGRATULATIONS!!!")
            continueToPoints(0);
        } else {
            var value = parseInt(indicatedSegment.text.replace(" pts",""));
            continueToPoints(value);
        }

        function continueToPoints(value){
            var id = self.props.session.getCurrentUser.id;
            var payload = { "query": `mutation{\n  mutate1: updateCount(id:\"${id}\", increaseWhat: "spin_the_wheel"){\n    email },\n  \n  mutate2: updateRewardPoints(id:\"${id}\", source: "Spin The Wheel", reward_points:${value}){\n    points\n    date\n  }\n}`, "variables": null }
            fetch(points.clientUrl + '/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if(value != 0){
                    toastr.clear();
                    toastr.success('you got '+value+'Pts','Congratulations!');
                    self.togglePointsAnimation(value+" Points");
                }
                self.props.refetch();
                self.props.refreshCoolDown();
                self.props.closeModal();
            });
        }
    }

    togglePointsAnimation(pts){
        points.playSoundEffect();
        var rewardPoints = document.getElementById('rewardPoints');
        rewardPoints.innerHTML = pts;
        rewardPoints.classList.add("points-anim")
        setTimeout(function() {
            rewardPoints.classList.toggle("points-anim")
        }.bind(), 4000);
    }
        
    startSpin() {
        if (wheelSpinning == false) {
            this.setState({
                theWheel: initialTheWheel
            }, () => {
                this.state.theWheel.startAnimation();
                wheelSpinning = true;
                this.setState({
                    preventModalFromClosing: true
                })
            })
        }
    }

    render() {
        return (
            <div>
                <style dangerouslySetInnerHTML={{__html: `
                    .popup-content {
                        width: 500px !important;
                    }
                `}} />
                <Modal open={this.props.open} closeModal={this.state.preventModalFromClosing ? null : this.props.closeModal}>
                    <div className="text-center">
                        <h2 style={{fontWeight: 900}}>Spin the wheel</h2>
                        <h4>To get a chance to win any of these prices</h4>
                        <div className="win-wheel-parent">
                            <div className="the-wheel"></div>
                            <canvas id='myCanvas' width='450' height='450' data-responsiveminwidth="180" data-responsivescaleheight="true">
                                Canvas not supported, use another browser.
                            </canvas>
                        </div>
                        <div className="form_buttons">
                            <button className="btn" onClick={() => this.startSpin() }>Spin</button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
export default SpinTheWheel;