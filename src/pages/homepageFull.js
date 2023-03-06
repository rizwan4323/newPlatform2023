import React from 'react';
import { NavLink } from 'react-router-dom';
import withAuth from '../hoc/withAuth';
import { Link } from 'react-router-dom';
import ProductCard from '../components/productCard';
import VideoLink from '../components/videoLink';
import { Helmet } from 'react-helmet';
import Loading from '../components/loading';
import {BarChart, Bar, Cell, Tooltip, ResponsiveContainer} from 'recharts';
import UpsellAlert from '../components/ModalComponent/upsellAlert';
import LeaderBoards from '../components/leaderBoards';
import Notif from '../components/notification';
import SpinTheWheel from '../components/spinTheWheel';
import webConfig from './../../webConfig';
import { GET_COACH_DETAILS, GET_ADMIN_SETTINGS } from './../queries';
import { Query } from 'react-apollo';
import toastr from 'toastr';
import moment from 'moment';
const points = require('../../Global_Values');

class HomepageFull extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            unfulfilledOrders: null,
            openUpsell: false,
            chart: [],
            activeIndex: 7,
            leaderboardData: [],
            oneTimeChallenge: [],
            // spin the wheel
            openSpinTheWheel: false,
            remainingTime: null,
            serverTime: null,
            interval: null,
            isCooldown: false,

            // timer
            trialTimer: false,
            rebillTimer: false,

            // video
            h_full_video: 'https://player.vimeo.com/video/308208468',
        }
        this.toggleModalUpsell = this.toggleModalUpsell.bind(this)
        this.updatePoints = this.updatePoints.bind(this)
        this.updateOneTimeChallenge = this.updateOneTimeChallenge.bind(this)
        this.toggleModaSpinTheWheel = this.toggleModaSpinTheWheel.bind(this)
        this.updateCooldown = this.updateCooldown.bind(this)
    }

    getHomepageVideo(){
        var payload = {"query":"{\n  getAdminHomepageVideo {\n    id\n    homepage_video_full\n    homepage_video_trial\n  }\n}\n","variables":null,"operationName":null};
        fetch(points.clientUrl+'/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(result => {
            if(result.data.getAdminHomepageVideo.homepage_video_full){
                this.setState({
                    h_full_video: result.data.getAdminHomepageVideo.homepage_video_full
                })
            }
        });
    }
    
    // handleClick(data, index, event) {
    //     this.setState({
    //       activeIndex: index,
    //     });
    //     this.toggleClass(".earn-points", "earn-points-description", event.target.getAttribute("x"), event.target.getAttribute("width"), index)
    // }

    // handleHoverLeave(event){
    //     this.toggleClass(".earn-points", "earn-points-description")
    // }

    toggleClass(defaultClass, toggle, x, width, index){
        var element = document.querySelector(defaultClass);
        if(x && width){
            if(index >= 4){
                var posRight = parseInt(width) * 2;
                element.style.left = "auto";
                element.style.right = posRight+"px";
            } else {
                var posLeft = parseFloat(x) + (parseInt(width) * 2);
                element.style.left = posLeft+"px";
                element.style.right = "auto";
            }
        }
        element.classList.toggle(toggle)
    }

    componentDidMount(){
        this.getHomepageVideo();
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

        // last added products request
        fetch('https://productlistgenie.io/collections/winners/products.json?limit=6')
        .then((Response) => Response.json())
        .then((findresponse) => {
            this.setState({
                data: findresponse.products,
            })
        })
    
        // unfulfilled orders request
        if(this.props.session.getCurrentUser.store_url){
            fetch(points.apiServer+'/unfulfilledorderscount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    store_name: this.props.session.getCurrentUser.store_url,
                    store_token: this.props.session.getCurrentUser.store_token
                })
            })
            .then((Response) => Response.json())
            .then((res) => {
                this.setState({ unfulfilledOrders: res.count })
            })
            .catch(err => {
                this.setState({ unfulfilledOrders: "failed" })
            })
        } else {
            this.setState({ unfulfilledOrders: "failed" })
        }

        // get profile data for the reward points
        var id = this.props.session.getCurrentUser.id;
        var payload = {"query":`{\n  profilePage(id:\"${id}\"){\n    reward_points {\n      points\n      date\n    }\n  }\n}`,"variables":null,"operationName":null}
        fetch(points.clientUrl+'/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(response => {
            // populate chart data
            const data = response.data.profilePage.reward_points;
            this.setState({
                chart: [
                    {name: '7 days ago', points: this.parseFilterPointsData(data, 7)},
                    {name: '6 days ago', points: this.parseFilterPointsData(data, 6)},
                    {name: '5 days ago', points: this.parseFilterPointsData(data, 5)},
                    {name: '4 days ago', points: this.parseFilterPointsData(data, 4)},
                    {name: '3 days ago', points: this.parseFilterPointsData(data, 3)},
                    {name: '2 days ago', points: this.parseFilterPointsData(data, 2)},
                    {name: 'Yesterday', points: this.parseFilterPointsData(data, 1)},
                    {name: 'Today', points: this.parseFilterPointsData(data, 0)}
                ]
            })
        });

        // get leader boards data
        var  leaderboardPayload = {"query":"{\n  getLeaderBoards{\n    firstName\n    lastName\n    total_points\n  }\n}","variables":null,"operationName":null};
        fetch(points.clientUrl+'/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leaderboardPayload)
        })
        .then(res => res.json())
        .then(response => {
            this.setState({
                leaderboardData: response.data.getLeaderBoards
            })
        });

        this.updateOneTimeChallenge();
        // pansamantagal remove comment to enable timer for next spin
        // points.getServerTime(res => {
        //     this.setState({
        //         serverTime: res
        //     }, () => {
        //         var lastSpinDate = parseInt(this.props.session.getCurrentUser.date_spin);
        //         var lastSpinDatePlusOne = points.addDateFrom(lastSpinDate, 1)
        //         if(lastSpinDatePlusOne > this.state.serverTime){
        //             this.setTimer(lastSpinDatePlusOne);
        //             this.setState({
        //                 isCooldown: true
        //             })
        //         }
        //     })
        // })

        // experimental fetch request for gems
        // var gemPayload = {"query":`mutation {\n  updateGem(id: \"${id}\", pass_key: \"${this.props.session.getCurrentUser.pass_key}\", source: \"homepage\") {\n    id\n    source\n    gems\n    date\n  }\n}\n`,"variables":null};
        // fetch(points.clientUrl+'/graphql', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(gemPayload)
        // })
        // .then(res => res.json())
        // .then(response => {
        //     console.log(response);
        // });

        this.addNewTimer();
    }

    changeFontSizeOfTimer(){
        if (window.outerWidth >= 620 && window.outerWidth <= 960) {
            if (document.getElementById("timer1")) {
                document.getElementById("timer1").style.fontSize = "25px";
            }
            if (document.getElementById("timer2")) {
                document.getElementById("timer2").style.fontSize = "25px";
            }
        } else if (window.outerWidth >= 480 && window.outerWidth <= 619) {
            if (document.getElementById("timer1")) {
                document.getElementById("timer1").style.fontSize = "20px";
            }
            if (document.getElementById("timer2")) {
                document.getElementById("timer2").style.fontSize = "20px";
            }
        } else if (window.outerWidth >= 395 && window.outerWidth <= 479) {
            if (document.getElementById("timer1")) {
                document.getElementById("timer1").style.fontSize = "15px";
            }
            if (document.getElementById("timer2")) {
                document.getElementById("timer2").style.fontSize = "15px";
            }
        } else if (window.outerWidth <= 394) {
            if (document.getElementById("timer1")) {
                document.getElementById("timer1").style.fontSize = "10px";
            }
            if (document.getElementById("timer2")) {
                document.getElementById("timer2").style.fontSize = "10px";
            }
        }
    }

    addNewTimer(){
        if (this.props.session.getCurrentUser) {
            var interval = 1000;
            var timeNow = new Date().getTime();
            var joinDate = parseInt(this.props.session.getCurrentUser.joinDate);

            // timer 1 for level 1
            if (this.props.session.getCurrentUser.privilege == 1 || !this.props.session.getCurrentUser.kartra_tags.includes('14 Day Challenge')) { // User Privilege
                var eventTime = points.addDateFrom(joinDate, 8);
                var diffTime = eventTime - timeNow;
                var duration = moment.duration(diffTime, 'milliseconds');
                if (duration.days() >= 0 && duration.hours() >= 0 && duration.minutes() >= 0 && duration.seconds() >= 0) {
                    this.setState({
                        trialTimer: true
                    }, () => {
                        this.timer1 = setInterval(function () {
                            duration = moment.duration(duration - interval, 'milliseconds');
                            document.getElementById("timer1").innerText = duration.days() + "d " + duration.hours() + "h " + duration.minutes() + "m " + duration.seconds() + "s";
                        }, interval);
                        this.changeFontSizeOfTimer();
                    });
                } else {
                    this.setState({
                        trialTimer: false
                    }, () => {
                        this.changeFontSizeOfTimer();
                    });
                }
            }
            
            // timer 2 for level 2 and above but not admin
            if (this.props.session.getCurrentUser.privilege <= 5 || !this.props.session.getCurrentUser.success_rebill || !this.props.session.getCurrentUser.kartra_tags.includes('PLG Loyalty Program')) { // User Privilege
                var eventTimeV2 = points.addDateFrom(joinDate, 38);
                var self = this;
                var diffTimeV2 = eventTimeV2 - new Date().getTime();
                var durationV2 = self.getDuration(diffTimeV2);
                if (durationV2.days >= 0 && durationV2.hours >= 0 && durationV2.minutes >= 0 && durationV2.seconds >= 0) {
                    this.setState({
                        rebillTimer: true
                    }, () => {
                        this.timer2 = setInterval(function () {
                            diffTimeV2 = eventTimeV2 - new Date().getTime();
                            durationV2 = self.getDuration(diffTimeV2);
                            var duration = moment.duration(diffTimeV2, 'milliseconds');
                            document.getElementById("timer2").innerText = durationV2.days + "d " + durationV2.hours + "h " + durationV2.minutes + "m " + duration.seconds() + "s";
                        }, interval);
                        this.changeFontSizeOfTimer();
                    });
                } else {
                    this.setState({
                        rebillTimer: false
                    }, () => {
                        this.changeFontSizeOfTimer();
                    });
                }
            }
        }
    }

    getDuration(milliSeconds) {
        let days = Math.floor(milliSeconds / (86400 * 1000));
        milliSeconds -= days * (86400 * 1000);
        let hours = Math.floor(milliSeconds / (60 * 60 * 1000));
        milliSeconds -= hours * (60 * 60 * 1000);
        let minutes = Math.floor(milliSeconds / (60 * 1000));
        return {
            days, hours, minutes
        }
    }

    sorter(a, b) {
        if (a < b) return -1;  // any negative number works
        if (a > b) return 1;   // any positive number works
        return 0; // equal values MUST yield zero
    }

    getNotWatchedVideo(){
        var ot_mission = this.props.session.getCurrentUser.one_time_missions;
        if(ot_mission.length != 0){
            var daysWatched = [];
            var lastDay = points.sevenDayChallenge[points.sevenDayChallenge.length - 1].day;
            ot_mission.forEach(el => el.includes("day") ? daysWatched.push(parseInt(el.replace("day",""))) : void 0);
            daysWatched.sort(this.sorter)
            if(daysWatched.length == 0){
                return 1;
            }
            for(var i=0; i<daysWatched.length; i++){
                var nextDay = daysWatched[i] + 1;
                var watchedVideo = daysWatched[i+1];
                if(nextDay <= lastDay){
                    if(nextDay != watchedVideo){
                        return nextDay;
                    }
                }
            }
        }
    }

    updateOneTimeChallenge(){
        this.setState({
            oneTimeChallenge: [
                // {
                //     isDone: this.props.session.getCurrentUser.one_time_missions.includes("complete_profile"),
                //     actionName: "Complete Profile",
                //     points: points.points_complete_profile,
                //     link: '/edit-profile',
                //     onClick: null
                // },
                // {
                //     isDone: this.props.session.getCurrentUser.store_token ? true : false,
                //     actionName: "Connect Store",
                //     points: points.points_connectToStore,
                //     link: '#',
                //     onClick: () => {
                //         window.toggleConnectModal();
                //     }
                // },
                // {
                //     isDone: this.props.session.getCurrentUser.one_time_missions.includes("first_push_to_store"),
                //     actionName: "Push Product",
                //     points: points.points_firstPushToStore,
                //     link: '/niche/winners',
                //     onClick: null
                // },
                // {
                //     isDone: this.getNotWatchedVideo() ? false : true,
                //     actionName: "Start Challenge",
                //     points: points.day_challenge[this.getNotWatchedVideo()-1],
                //     link: '/7DayChallenge/'+this.getNotWatchedVideo(),
                //     onClick: null
                // },
                // {
                //     isDone: this.props.session.getCurrentUser.one_time_missions.includes("join_fb_group"),
                //     actionName: "Join FB Group",
                //     points: points.points_join_fb_group,
                //     link: '#',
                //     onClick: () => {
                //         window.open('https://www.facebook.com/groups/917176848452140/','_blank');
                //         this.updatePoints(points.points_join_fb_group, "join_fb_group");
                //     }
                // },
                // {
                //     isDone: this.props.session.getCurrentUser.one_time_missions.includes("link_fb"),
                //     actionName: "Meet Your Coach",
                //     points: points.points_link_fb,
                //     link: '/link-fb',
                //     onClick: null
                // }
                {
                    isDone: false,
                    actionName: "<span class='color-green'>Day 1:</span> (BUILDING THE MILLION DOLLAR BRAND)",
                    link: '#',
                    onClick: () => {
                        window.open("https://www.facebook.com/GiancarloBarraza/videos/10156179249156786/");
                    }
                },
                {
                    isDone: false,
                    actionName: "<span class='color-green'>Day 2:</span> (BUILDING THE MILLION DOLLAR BRAND)",
                    link: '#',
                    onClick: () => {
                        window.open("https://www.facebook.com/GiancarloBarraza/videos/10156181279041786/");
                    }
                },
                {
                    isDone: false,
                    actionName: "<span class='color-green'>Day 3:</span> (BUILDING THE MILLION DOLLAR BRAND)",
                    link: '#',
                    onClick: () => {
                        window.open("https://www.facebook.com/GiancarloBarraza/videos/10156183351596786/");
                    }
                },
                {
                    isDone: false,
                    actionName: "<span class='color-green'>Day 4:</span> How To Crush Funnels with Google",
                    link: '#',
                    onClick: () => {
                        window.open("https://www.facebook.com/GiancarloBarraza/videos/10156185452421786/");
                    }
                },
                {
                    isDone: false,
                    actionName: "<span class='color-green'>Day 5:</span> Winning Funnels",
                    link: '#',
                    onClick: () => {
                        window.open("https://www.facebook.com/GiancarloBarraza/videos/10156187527101786/");
                    }
                }
            ]
        })
    }
    
    updatePoints(value, source) {
        var id = this.props.session.getCurrentUser.id;
        var payload = { "query": `mutation{\n  updateRewardPoints(id:\"${id}\", source: \"${source}\", reward_points:${value}){\n    points\n    date\n  }\n}`, "variables": null }
        fetch(points.clientUrl + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            this.togglePointsAnimation(value);
            points.playSoundEffect();
            this.props.refetch();
        });
    }

    togglePointsAnimation(pts){
        var rewardPoints = document.getElementById('rewardPoints');
        rewardPoints.innerHTML = `+${pts} points`;
        rewardPoints.classList.add("points-anim")
        setTimeout(function() {
            rewardPoints.classList.toggle("points-anim")
        }.bind(), 4000);

        var self = this;
        setTimeout(function() {
            self.updateOneTimeChallenge();
        }.bind(), 100);
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
    // end for date computation

    // start get days ago function
    getDateDifferent(productDate){
        let dateNow = new Date();
        productDate = new Date(productDate);
        let timeDiff = Math.abs(dateNow.getTime() - productDate.getTime());
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    // end get days ago function

    parseFilterPointsData(data, pastDay){
        let result = points.filterPointsByDateRange(data, points.getPastDate(pastDay), points.getPastDate(pastDay));
        if(result == 0){
            return 0;
        }
        return result.reduce((acc, next) => {
            return acc + next.points;
        }, 0);
    }
    
    // toggle modal upsell
    toggleModalUpsell(){
        this.setState({openUpsell: !this.state.openUpsell})
    }

    toggleModaSpinTheWheel(){
        this.setState({
            openSpinTheWheel: !this.state.openSpinTheWheel
        })
    }

    // remove timer
    componentWillUnmount(){
        clearInterval(this.x)
        clearInterval(this.timer1)
        clearInterval(this.timer2)
    }

    updateCooldown() {
        this.setState({
            isCooldown: true
        })
    }

    // time remaining
    setTimer(endDate){
        var self = this;
        // Update the count down every 1 second
        this.x = setInterval(function() {
            // Get todays date and time
            var now = new Date().getTime();
            // Find the distance between now and the count down date
            var distance = endDate - now;
            // Time calculations for days, hours, minutes and seconds
            // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            // Display the result in the element with id="demo"
            // self.setState({
            //     remainingTime: hours + "h "+ minutes + "m " + seconds + "s "
            // }, () => {
            //     // If the count down is finished, write some text 
            //     if (distance < 0) {
            //         clearInterval(this.x);
            //     }
            // })
            document.getElementById("timer").innerText = hours + "h "+ minutes + "m " + seconds + "s";
            if (distance < 0) {
                clearInterval(this.x);
            }
        }, 1000);
    }
    // timer until here

    head() {
        return (
            <Helmet>
                <title>Dashboard - Product List Genie</title>
            </Helmet>
        );
    }

    customTooltip({ active, payload, label }) {
        if (active) {
            return (
                <div style={{backgroundColor: '#e06d0087', fontSize: 12 , padding: 10, color: '#000000', border: '1px solid #ffffff00', textAlign: 'left', borderRadius: 5, lineHeight: 1.5, boxShadow: '1px 2px 4px 0px #b3adad'}}>
                    <span>{payload[0].payload.name}</span><br/>
                    <span>Points: {payload[0].payload.points}</span>
                </div>
            );
        }

        return null;
    };

    render() {
        var reversed_notification = [];
        reversed_notification = reversed_notification.concat(this.props.session.getCurrentUser.notification).sort((a,b) => b.date-a.date);
        return (
            <div className="grid page-container homepage">
                {this.head()}
                {reversed_notification.length != 0 &&
                    reversed_notification.map((notif,index) => {
                        return <Notif
                                    userId={this.props.session.getCurrentUser.id}
                                    notifId={notif.id}
                                    type={notif.type}
                                    message={notif.message.replace('[FirstName]',this.props.session.getCurrentUser.firstName).replace('[LastName]',this.props.session.getCurrentUser.lastName)}
                                    refetch={this.props.refetch}
                                    key={index} />
                    })
                }
                {this.state.openUpsell &&
                    <UpsellAlert open={this.state.openUpsell} closeModal={this.toggleModalUpsell} session={this.props.session} />
                }
                <div className="float-right">
                    {(() => {
                        if (this.props.session.getCurrentUser.privilege == 0) { // User Privilege
                            let joinDate = parseInt(this.props.session.getCurrentUser.joinDate);
                            let vipDate = new Date(joinDate + (86400000*points.dateToBecomeVIP));
                            let dateNow = new Date();
                            let result = this.datediff(this.parseDate(this.formatDate(dateNow)), this.parseDate(this.formatDate(vipDate)))
                            if(result > 0){
                                return null;
                                // remove return
                                return(
                                    <label>{result} Day{result > 1 ? 's' : ''} Remaining To Become <strong>VIP</strong> or <strong><a href={points.upgradeAccountLink+"?email="+this.props.session.getCurrentUser.email} target="_blank">UPGRADE NOW</a></strong></label>
                                );
                            }
                        }
                    })()}
                </div>
                <div className="grid clear">
                    <div className="column column_6_12 text-center">
                        <div className="column column_12_12">
                            <iframe src={this.state.h_full_video} width="600" height="360" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                        </div>
                        <div className="column column_12_12">
                            <div className="column column_6_12">
                                <Link to='/fulfillment-center-genieV2'>
                                    <div className="product-card">
                                        <div className="product-details">
                                            <h6 style={{color: '#000'}}>Unfulfilled Orders</h6>
                                            {this.state.unfulfilledOrders != null ?
                                                this.state.unfulfilledOrders == "failed" ?
                                                    <div>
                                                        <div className="text-center statistic-number" style={{color: '#000', margin: '26px 0'}}>
                                                            ---
                                                        </div>
                                                        <div className="text-center">
                                                            <h4 style={{margin:0}}>Connect your store</h4>
                                                        </div>
                                                    </div>
                                                :  <div>
                                                    <div className="text-center statistic-number" style={{color: '#000', margin: '26px 0'}}>
                                                        {this.state.unfulfilledOrders}
                                                    </div>
                                                    <div className="text-center">
                                                        <h3 style={{margin:0}}>ORDERS</h3>
                                                    </div>
                                                </div>
                                            :   <div className="text-center">
                                                    <Loading height={100} width={100} />
                                                </div>}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="column column_6_12">
                                <div className="product-card">
                                    <div className="product-details">
                                        <h6 style={{color: '#000'}}>Earned Points</h6>
                                        <span style={{color: '#f07a06'}}>on Last 7 days</span>
                                        {this.state.chart.length == 0 &&
                                            <Loading height={100} width={100} />
                                        }
                                        {this.state.chart.length != 0 &&
                                            <div style={{marginTop: 5, border: '1px solid #ecd1b7'}}>
                                                <ResponsiveContainer width="100%" height={100}>
                                                    <BarChart data={this.state.chart}>
                                                        <Tooltip content={this.customTooltip.bind(this)} />
                                                        {/* <Bar dataKey='points' onMouseOver={this.handleClick.bind(this)} onMouseLeave={this.handleHoverLeave.bind(this)}> */}
                                                        <Bar dataKey='points'>
                                                            {
                                                                this.state.chart.map((entry, index) => (
                                                                    entry.points == 0 ?
                                                                        <Cell cursor="pointer" fill={'#82ca9d'} height={5} y={91} key={`cell-${index}`} />
                                                                    :
                                                                        <Cell cursor="pointer" fill={'#82ca9d'} key={`cell-${index}`} />
                                                                ))
                                                            }
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                                {/* <div className="text-center">
                                                    <span className="earn-points">{`${this.state.chart[this.state.activeIndex].name != "Today" ? moment(points.getPastDate(this.state.chart[this.state.activeIndex].name)).startOf('second').fromNow() : "Today"}: ${points.commafy(this.state.chart[this.state.activeIndex].points)}pts`}</span> &nbsp;
                                                </div> */}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column column_6_12">
                        <div className="column column_7_12">
                            <LeaderBoards data={this.state.leaderboardData} />
                        </div>
                        <div className="column column_5_12">
                            <div className="product-card">
                                <div className="product-details em" style={{overflow: 'hidden'}}>
                                    <div className="text-center">
                                        <h3 style={{margin: 0}}>Challenges</h3>
                                    </div>
                                    <ul className="item-list">
                                        {this.state.oneTimeChallenge.length == 0 &&
                                            <li><Loading height={100} width={100} /></li>
                                        }
                                        {this.state.oneTimeChallenge.length != 0 &&
                                            this.state.oneTimeChallenge.filter(a => a.isDone == false).length == 0 ?
                                                <li>
                                                    <div className="product-card" style={{overflow: 'hidden'}}>
                                                        <div style={{overflow: 'hidden', padding: '.5rem 0'}}>
                                                            <div className="column column_12_12 text-center">
                                                                <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>No challenges yet</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            : this.state.oneTimeChallenge.map((challenge, i) => {
                                                if(challenge.isDone) return null;
                                                return <li key={i} onClick={() => challenge.onClick()} style={{border: 'none'}} className="one-line-ellipsis" dangerouslySetInnerHTML={{__html: challenge.actionName}} />;
                                                return (
                                                    <li key={i}>
                                                        <div className="product-card" style={{overflow: 'hidden'}}>
                                                            <div style={{overflow: 'hidden', padding: '.5rem 0'}}>
                                                                <NavLink className="earn" activeClassName="nav-active" to={challenge.link} style={{margin: 0}} onClick={challenge.onClick}>
                                                                    <div className="column column_9_12">
                                                                        <strong>{challenge.actionName}</strong>
                                                                    </div>
                                                                    <div className="column column_3_12 text-right">
                                                                        <strong style={{fontSize: 10}}>{challenge.points+"pts"}</strong>
                                                                    </div>
                                                                </NavLink>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                            {/* <div className="text-center">
                                {(() => {
                                    if(this.state.serverTime == null){
                                        return null;
                                    }
                                    
                                    if(this.props.session.getCurrentUser.date_spin){
                                        if(this.state.isCooldown){
                                            return (
                                                <div className="product-card">
                                                    <div className="product-details" style={{lineHeight: 1.5}}>
                                                        <span style={{color: '#00bf60', fontWeight: 700}} id="timer">{this.state.remainingTime}</span><br/>Remaining for the next spin
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div className="form_buttons">
                                                    <button className="btn stretch-width" style={{fontSize: '1.3rem'}} onClick={() => this.toggleModaSpinTheWheel()}>Spin The Genie Wheel</button>
                                                </div>
                                            );
                                        }
                                    } else {
                                        return (
                                            <div className="form_buttons">
                                                <button className="btn stretch-width" style={{fontSize: '1.3rem'}} onClick={() => this.toggleModaSpinTheWheel()}>Spin The Genie Wheel</button>
                                            </div>
                                        );
                                    }
                                })()}
                            </div> */}
                            <div className="text-center funnel">
                                <div className="product-card">
                                    <div className="product-details" style={{lineHeight: 1.5, overFlow: 'hidden'}}>
                                        <img src="/assets/graphics/become-affiliate.png" className="stretch-width" />
                                        <label className="stretch-width" style={{fontSize: '1.3em'}}>Become an Affiliate</label>
                                        <button className="btn-warning stretch-width" onClick={() => window.open('https://productlistgenie.com/jv/', '_blank')}>
                                            <label className="cursor-pointer">SIGN UP AS AN AFFILIATE</label>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* {this.props.session.getCurrentUser.privilege >= 3 && this.props.session.getCurrentUser.sales_rep_id ?
                            <Query query={GET_COACH_DETAILS} variables={{ id: this.props.session.getCurrentUser.sales_rep_id }}>
                                {({data, loading, refetch}) => {
                                    if(loading) return null;
                                    return (
                                        <div className="product-card">
                                            <div className="product-details">
                                                <div className="profile_wrap">
                                                    <div className="column column_2_12" style={{padding: 0, height: '40px'}} title="View Profile">
                                                        <a href={"/profile/"+data.profilePage.id}>
                                                            {data.profilePage.profileImage ?
                                                                <div className="profile_img" style={{backgroundImage: "url(" + webConfig.siteURL+'/user-uploads/'+data.profilePage.profileImage + ")" }}>
                                                                </div>
                                                            :
                                                                <div className="profile_img" style={{backgroundImage: "url(" + webConfig.siteURL+'/assets/graphics/abstract_patterns/texture.jpg' + ")" }}>
                                                                </div>
                                                            }
                                                        </a>
                                                    </div>
                                                    <div className="column column_10_12">
                                                        <div className="column column_12_12">
                                                            <div className="coach-name one-line-ellipsis" title={data.profilePage.firstName+" "+data.profilePage.lastName}>
                                                                {data.profilePage.firstName+" "+data.profilePage.lastName}
                                                            </div>
                                                        </div>
                                                        <div className="column column_12_12">
                                                            <div className="one-line-ellipsis" style={{marginTop: 3}}>
                                                                {data.profilePage.fb_link ?
                                                                    <a className="contact_coach_btn" href={data.profilePage.fb_link} target="_blank">
                                                                        <i className="fas fa-comment-alt" style={{marginRight: '0.5rem'}}></i>
                                                                        Contact your coach
                                                                    </a>
                                                                : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }}
                            </Query>
                            : void 0} */}
                            {/* <div className="product-card">
                                <div className="product-details">
                                    <div className="profile_wrap">
                                        <div className="column column_12_12">
                                            <div className="column column_12_12">
                                                <div className="coach-name one-line-ellipsis">
                                                    Contact your coach
                                                </div>
                                            </div>
                                            <div className="column column_12_12">
                                                <div className="one-line-ellipsis" style={{ marginTop: 3 }}>
                                                    <a className="contact_coach_btn" href="/Start_Here/5c88464f5375046e20a982eb" target="_blank">
                                                        <i className="fas fa-comment-alt" style={{ marginRight: '0.5rem' }}></i>
                                                        Click Here
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <div className="column column_12_12">
                                {/* Timers */}
                                {this.state.trialTimer &&
                                    <div style={{position: 'relative', display: 'none'}}>
                                        <span style={{ fontWeight: 900, color: '#fff', fontSize: '0.7vw', position: 'absolute', right: '13%', bottom: '25%', width: '50%', textAlign: 'center' }} id="timer1">
                                        </span>
                                        <a href="https://themm.kartra.com/page/a8H108" target="_blank">
                                            <img src="../../../assets/graphics/14-Day-UnlockTimer.png" width="100%" />
                                        </a>
                                    </div>
                                }
                                {this.state.trialTimer == false &&
                                    <div style={{display: 'none'}}>
                                        <a href="https://www.facebook.com/groups/295491624456081/" target="_blank">
                                            <img src="../../../assets/graphics/14-DayChallenge-Unlocked.png" width="100%" />
                                        </a>
                                    </div>
                                }
                                {this.state.trialTimer && this.state.rebillTimer ? <br /> : void 0}
                                {this.state.rebillTimer &&
                                    <div style={{position: 'relative'}}>
                                        <span style={{ fontWeight: 900, color: '#fff', fontSize: '0.7vw', position: 'absolute', right: '13%', bottom: '25%', width: '50%', textAlign: 'center' }} id="timer2">
                                        </span>
                                        <a href="https://themm.kartra.com/page/Sug115" target="_blank">
                                            <img src="../../../assets/graphics/Loyalty Program-Unlock Timer.png" width="100%" />
                                        </a>
                                    </div>
                                }
                                {this.state.rebillTimer == false &&
                                    <div>
                                        <span style={{fontSize: 13}}>
                                            <a href="https://www.facebook.com/groups/591939057942504/" target="_blank">
                                                <img src="../../../assets/graphics/Loyalty-Program-unlocked.png" width="100%" />
                                            </a>
                                        </span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid clear">
                    <h3 style={{paddingTop: '20px'}}>Last Added Products</h3>
                    <div className="flex-container">
                        {(()=>{
                            if(this.state.data.length != 0){
                                return this.state.data.map((latest, i) => (
                                    <ProductCard tags={latest.tags} toggleModalUpsell={this.toggleModalUpsell} refetch={this.props.refetch} session={this.props.session} product_data={{prodid: latest.id,handle:latest.handle,title:latest.title,src:latest.images[0].src,price:latest.variants[0].price,days_ago:latest.published_at}} key={latest.id} />
                                ));
                            } else {
                                {/* for loading purpose */}
                                var x = ['1','2','3','4','5','6']
                                return x.map(i => {
                                    return <ProductCard loading={true} refetch={this.props.refetch} session={this.props.session} product_data={{prodid: '00',handle:'loading',title:'Loading...',src:'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',price:'0.00',days_ago:new Date()}} key={i} />
                                })
                            }
                        })()}
                    </div>
                </div>
                {/* <div className="grid clear" style={{overflow: 'hidden'}}>
                    <h3 style={{marginTop: 20}}>PLG Pro Services</h3>
                    // 1st Image * //
                    <div className="column column_4_12">
                        <div className="product-card">
                            <div className="product-details">
                                <a href="https://themm.kartra.com/page/u7A113" target="_blank">
                                    <img src="../../../assets/graphics/mdtraining10.jpg" width="100%"/>
                                </a>
                            </div>
                        </div>
                    </div>
                    // 2nd Image * //
                    <div className="column column_4_12">
                        <div className="product-card">
                            <div className="product-details">
                                <a href="https://themm.kartra.com/page/M5o58" target="_blank">
                                    <img src="../../../assets/graphics/mdtraining8.jpg" width="100%"/>
                                </a>
                            </div>
                        </div>
                    </div>
                    // 3rd Image * //
                    <div className="column column_4_12">
                        <div className="product-card">
                            <div className="product-details">
                                <a href="https://themm.kartra.com/page/Iwj114" target="_blank">
                                    <img src="../../../assets/graphics/mdtraining9.jpg" width="100%"/>
                                </a>
                            </div>
                        </div>
                    </div>
                    // 4th Image * //
                    <div className="column column_4_12">
                        <div className="product-card">
                            <div className="product-details">
                                <a href="https://themm.kartra.com/page/Ft6106" target="_blank">
                                    <img src="../../../assets/graphics/mdtraining7.jpg" width="100%"/>
                                </a>
                            </div>
                        </div>
                    </div>
                    //  5th Image  //
                    <div className="column column_4_12">
                        <div className="product-card">
                            <div className="product-details">
                                <a href="https://themm.kartra.com/page/tvP98" target="_blank">
                                    <img src="../../../assets/graphics/mdtraining12.jpg" width="100%"/>
                                </a>
                            </div>
                        </div>
                    </div>
                    //  6th Image  //
                    <div className="column column_4_12">
                        <div className="product-card">
                            <div className="product-details">
                                <a href="https://themm.kartra.com/page/4DN97" target="_blank">
                                    <img src="../../../assets/graphics/mdtraining11.jpg" width="100%"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="grid clear" style={{overflow: 'hidden'}}>
                    <h3 style={{marginTop: 20}}>Millionaire Talk</h3>
                    <div className="admin-choice">
                        <VideoLink video_title={"The Million Dollar Products"} video_id={"308208403"} video_description={""} />
                        <VideoLink video_title={"$52K per Month Product Test"} video_id={"308610429"} video_description={""} />
                        <VideoLink video_title={"Everyone wants to be a Millionaire"} video_id={"308208338"} video_description={""} />
                    </div>
                </div>
                {/* Modals */}
                {/* {this.state.openSpinTheWheel &&
                    <SpinTheWheel open={this.state.openSpinTheWheel} closeModal={this.toggleModaSpinTheWheel} session={this.props.session} refetch={this.props.refetch} refreshCoolDown={this.updateCooldown} />
                } */}
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(HomepageFull);