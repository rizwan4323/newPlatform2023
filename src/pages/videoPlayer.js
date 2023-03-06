import React from 'react';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
const points = require('../../Global_Values');

var initialize = {
    urlParams: {
        day: '',
        title: '',
        description: ''
    }
}

class VideoPlayer extends React.Component {
    constructor() {
        super();
        this.state = {
            urlParams: {
                day: '',
                title: '',
                description: ''
            }
        }
        this.updatePoints = this.updatePoints.bind(this)
    }
    
    componentDidMount(){
        window.updatePoints = this.updatePoints;

        let params = JSON.parse(atob(this.props.match.params.obj));
        this.setState({
            urlParams: {
                day: params.day,
                title: params.title,
                description: params.desc
            }
        })

        // create script tag
        const scriptTag = document.createElement("script");
        scriptTag.src = "https://player.vimeo.com/api/player.js";
        scriptTag.async = true;
        document.querySelector(".page-container").appendChild(scriptTag);

        // create vimeo player callback
        const vimeoPlayerCallback = document.createElement("script");
        vimeoPlayerCallback.innerHTML = `
            setTimeout(function(){
                var vid = document.querySelector('#vmplayer');
                var player = new Vimeo.Player(vid);
                player.on('ended', window.updatePoints);
            }, 1000);
        `;
        document.querySelector(".page-container").appendChild(vimeoPlayerCallback);
    }

    componentWillUnmount(){
        window.updatePoints = undefined;
    }

    updatePoints() {
        let self = this;
        if(this.state.urlParams.day){
            if(this.props.session.getCurrentUser.one_time_missions.length > 0){
                var days = "day"+this.state.urlParams.day;
                if(!this.props.session.getCurrentUser.one_time_missions.includes(days)){
                    proceedToUpdatePoints();
                }
            } else {
                proceedToUpdatePoints();
            }
        }

        function proceedToUpdatePoints(){
            var dayWatched = self.state.urlParams.day-1;
            var id = self.props.session.getCurrentUser.id;
            var value = points.day_challenge[dayWatched];
            var payload = { "query": `mutation{\n  updateRewardPoints(id:\"${id}\", source: "7-Day Challenge (Day ${self.state.urlParams.day})", reward_points:${value}){\n    points\n    date\n  }\n}`, "variables": null }
            fetch(points.clientUrl + '/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                self.togglePointsAnimation(value);
                points.playSoundEffect();
                self.props.refetch();
            });
        }
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
                <title>{this.state.urlParams.title ? this.state.urlParams.title : 'Loading...'} - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        return (
            <div className="page-container">
                <div className="text-center">
                    {this.head()}
                    <h1></h1>
                    <h1>{this.state.urlParams.title}</h1>
                    <iframe id="vmplayer" src={"https://player.vimeo.com/video/"+this.props.match.params.ytid} width="1000" height="500" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                    {/* <iframe width="1000" height="500" src={"https://www.youtube.com/embed/"+this.props.match.params.ytid} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> */}
                    <h1></h1>
                </div>
                <div className="review-field">
                    <div dangerouslySetInnerHTML={{ __html: this.state.urlParams.description }} />
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(VideoPlayer);