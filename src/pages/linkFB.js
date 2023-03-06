import React from 'react';
import withAuth from './../hoc/withAuth';
import { Helmet } from 'react-helmet';
import toastr from 'toastr';
const points = require('../../Global_Values');

class LinkFB extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fbLink: ''
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
    }
    
    handleChange(event){
        this.setState({
            fbLink: event.target.value
        })
    }
    
    saveUrl(){
        if(this.state.fbLink){
            toastr.clear();
            toastr.info("Please wait...","Granting Your wish");
            this.updatePoints();
        } else {
            toastr.clear();
            toastr.warning("FB Link Cannot be empty","FB Link Required");
        }
    }

    updatePoints(){
        var id = this.props.session.getCurrentUser.id;
        var value = points.points_link_fb;
        var payload = {"query":`mutation{\n mutate1: linkFB(id:\"${id}\" fblink: \"${this.state.fbLink}\"){\n    id\n  }\n mutate2: updateRewardPoints(id:\"${id}\", source: "link_fb", reward_points:${value}){\n    points\n    date\n  }\n}`,"variables":null}
        fetch(points.clientUrl+'/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            toastr.clear();
            toastr.success("Successfully linked facebook account","Wish Granted");
            this.togglePointsAnimation(value);
            points.playSoundEffect();
            this.props.refetch();
            this.props.history.push('/dashboard');
        });
    }

    togglePointsAnimation(pts){
        var rewardPoints = document.getElementById('rewardPoints');
        rewardPoints.innerHTML = `+${pts} points`;
        rewardPoints.classList.add("points-anim")
        setTimeout(function() {
            rewardPoints.classList.toggle("points-anim")
        }.bind(), 4000);
    }
    
    head() {
        return (
            <Helmet>
                <title>Link Facebook - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        return (
            <div className="page-container">
                {this.head()}
                <div className="text-center">
                    <div className="column column_6_12" style={{width: '100%'}}>
                        <iframe src="https://player.vimeo.com/video/309024281" width="650" height="315" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                    </div>
                </div>
                <div className="text-center clear" style={{paddingTop: 20}}>
                    <h1>Link Facebook Account</h1>
                </div>
                <div className="form_wrap">
                    <div className="form_row">
                        <div className="form_item" style={{width: '70%', margin: '0 auto'}}>
                            <label>Facebook Profile URL</label>
                            <div className="form_input">
                                <br />
                                <input type="text" value={this.state.fbLink} onChange={this.handleChange.bind(this)} placeholder="https://www.facebook.com/someone.username" />
                                <span className="bottom_border"></span>
                            </div> <br />
                            <div className="text-center form_buttons">
                                <button className="btn" onClick={this.saveUrl.bind(this)}>Link Account</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default withAuth(session => session && session.getCurrentUser)(LinkFB);