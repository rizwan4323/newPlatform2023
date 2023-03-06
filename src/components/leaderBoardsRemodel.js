import React from "react";
import Loading from '../components/loading';
const points = require('../../Global_Values');

class LeaderBoardsRemodel extends React.Component {
    constructor() {
        super();
        this.state = {
            activeDisplay: "weekly",
            LeaderBoardsContent: [],
            noResult: false,
            leaderBoardsTopReferrer: [],
            noResultReferrer: false,
            min: 1,
            max: 5
        }
    }

    componentDidMount(){
        if(this.state.activeDisplay != "overall"){
            this.changeDisplay();
        }
    }

    componentDidUpdate(props, state){
        if(this.state.activeDisplay == "overall"){
            if(JSON.stringify(props.data) != JSON.stringify(this.state.LeaderBoardsContent)){
                this.setState({
                    LeaderBoardsContent: props.data
                })
            }
        }
    }

    changeDisplay(displayBy){
        if(displayBy && this.state.activeDisplay != displayBy){
            this.setState({
                activeDisplay: displayBy
            }, () => {
                if(this.state.activeDisplay != "overall"){
                    this.setState({
                        LeaderBoardsContent: []
                    }, () => {
                        this.requestNewLeaderBoards();
                    })
                } else {
                    this.setState({
                        LeaderBoardsContent: this.props.data
                    })
                }
                // this.changeDisplayReferrer();
            })
        }
        if(!displayBy){
            this.requestNewLeaderBoards();
            // this.changeDisplayReferrer();
        }
    }

    requestNewLeaderBoards(){
        var leaderboardPayload = "";
        if(this.state.activeDisplay == "daily"){
            leaderboardPayload = {"query":"{\n  getLeaderBoardsDaily{\n    firstName\n    lastName\n    daily_points{\n      points\n      day\n    }\n  }\n}","variables":null,"operationName":null}
        } else if(this.state.activeDisplay == "weekly") {
            leaderboardPayload = {"query":"{\n  getLeaderBoardsWeekly{\n    firstName\n    lastName\n    weekly_points{\n      points\n      week\n    }\n  }\n}","variables":null,"operationName":null}
        }
        fetch(points.clientUrl+'/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leaderboardPayload)
        })
        .then(res => res.json())
        .then(response => {
            if(this.state.activeDisplay == "daily"){
                if(response.data.getLeaderBoardsDaily.length == 0){
                    this.setState({
                        LeaderBoardsContent: [],
                        noResult: true
                    })
                } else {
                    this.setState({
                        LeaderBoardsContent: response.data.getLeaderBoardsDaily
                    })
                }
            } else if(this.state.activeDisplay == "weekly") {
                if(response.data.getLeaderBoardsWeekly.length == 0){
                    this.setState({
                        LeaderBoardsContent: [],
                        noResult: true
                    })
                } else {
                    this.setState({
                        LeaderBoardsContent: response.data.getLeaderBoardsWeekly
                    })
                }
            }
        });
    }

    changeDisplayReferrer(){
        var topReferrerPayload = {"query":"{\n  getTopReferrer(displayBy: \""+this.state.activeDisplay+"\"){\n    firstName\n    lastName\n    count\n  }\n}","variables":null,"operationName":null};

        fetch(points.clientUrl+'/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(topReferrerPayload)
        })
        .then(res => res.json())
        .then(res => {
            if(res.data.getTopReferrer.length == 0){
                this.setState({
                    leaderBoardsTopReferrer: [],
                    noResultReferrer: true
                })
            } else {
                var temp = [];
                res.data.getTopReferrer.forEach(dd => {
                    if(dd.count != 0) temp.push(dd)
                })
                this.setState({
                    noResultReferrer: temp.length == 0 ? true : false,
                    leaderBoardsTopReferrer: temp
                })
            }
        });
    }

    render() {
        var i = this.state.min-2;
        return (
            <div className="product-card">
                <div className="product-details">
                    <div className="form_row">
                        <label className="font-roboto-bold" style={{fontSize: '0.875em'}}>HALL OF GENIES</label>
                    </div>
                    <div>
                        <button className={"one-line-ellipsis font-roboto-light " + (this.state.activeDisplay == "weekly" ? "dwobtn dwobtn-focus" : "dwobtn")} onClick={this.changeDisplay.bind(this, "weekly")} style={{fontSize: '0.875em', padding: '5px 15px', maxWidth: '33%'}}>Weekly</button>&nbsp;
                        <button className={"one-line-ellipsis font-roboto-light " + (this.state.activeDisplay == "daily" ? "dwobtn dwobtn-focus" : "dwobtn")} onClick={this.changeDisplay.bind(this, "daily")} style={{fontSize: '0.875em', padding: '5px 15px', maxWidth: '33%'}}>Daily</button>&nbsp;&nbsp;
                        <button className={"one-line-ellipsis font-roboto-light " + (this.state.activeDisplay == "overall" ? "dwobtn dwobtn-focus" : "dwobtn")} onClick={this.changeDisplay.bind(this, "overall")} style={{fontSize: '0.875em', padding: '5px 15px', maxWidth: '33%'}}>Overall</button>
                    </div>
                    <ul className="font-questrial-light" style={{minHeight: 189}}>
                        {this.state.LeaderBoardsContent.length == 0 &&
                            <li>
                                {this.state.noResult ? <div className="text-center">Empty... check back soon!</div> : <Loading height={100} width={100} />}
                            </li>
                        }
                        {this.state.LeaderBoardsContent.length != 0 &&
                            this.state.LeaderBoardsContent.filter((el,x) => x >= (this.state.min-1) && x < this.state.max).map(leaderboard => {
                                i++;
                                return (
                                    <li key={i}>
                                        {i == 0 &&
                                            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                                                <i className="fas fa-award" style={{fontSize: '1.7rem', color: '#d4af37'}} />
                                                <div className="column one-line-ellipsis" style={{marginLeft: 5, padding: 0}}>
                                                    {leaderboard.firstName+" "+leaderboard.lastName}
                                                </div>
                                                <div className="text-right" style={{margin: 0, padding: 0, whiteSpace: 'nowrap'}}>
                                                    {(() => {
                                                        var total_points = "";
                                                        if(leaderboard.total_points){
                                                            total_points = leaderboard.total_points;
                                                        } else if(leaderboard.daily_points){
                                                            total_points = leaderboard.daily_points.points;
                                                        } else if(leaderboard.weekly_points){
                                                            total_points = leaderboard.weekly_points.points;
                                                        }

                                                        return points.commafy(total_points) + " PTS";
                                                    })()}
                                                </div>
                                            </div>
                                        }
                                        {i == 1 &&
                                            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                                                <i className="fas fa-award" style={{fontSize: '1.7rem', color:'#cccccc'}}/>
                                                <div className="column one-line-ellipsis" style={{marginLeft: 5, padding: 0}}>
                                                    {leaderboard.firstName+" "+leaderboard.lastName}
                                                </div>
                                                <div className="text-right" style={{margin: 0, padding: 0, whiteSpace: 'nowrap'}}>
                                                    {(() => {
                                                        var total_points = "";
                                                        if(leaderboard.total_points){
                                                            total_points = leaderboard.total_points;
                                                        } else if(leaderboard.daily_points){
                                                            total_points = leaderboard.daily_points.points;
                                                        } else if(leaderboard.weekly_points){
                                                            total_points = leaderboard.weekly_points.points;
                                                        }
                                                        return points.commafy(total_points) + " PTS";
                                                    })()}
                                                </div>
                                            </div>
                                        }
                                        {i == 2 &&
                                            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                                                <i className="fas fa-award" style={{fontSize: '1.7rem', color:'#cd7f32'}} />
                                                <div className="column one-line-ellipsis" style={{marginLeft: 5, padding: 0}}>
                                                    {leaderboard.firstName+" "+leaderboard.lastName}
                                                </div>
                                                <div className="text-right" style={{margin: 0, padding: 0, whiteSpace: 'nowrap'}}>
                                                    {(() => {
                                                        var total_points = "";
                                                        if(leaderboard.total_points){
                                                            total_points = leaderboard.total_points;
                                                        } else if(leaderboard.daily_points){
                                                            total_points = leaderboard.daily_points.points;
                                                        } else if(leaderboard.weekly_points){
                                                            total_points = leaderboard.weekly_points.points;
                                                        }
                                                        return points.commafy(total_points) + " PTS";
                                                    })()}
                                                </div>
                                            </div>
                                        }
                                        {i > 2 &&
                                            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                                                <i className="fas fa-user" style={{fontSize: '1.7rem', color:'#cccccc'}}/>
                                                <div className="column one-line-ellipsis" style={{marginLeft: 5, padding: 0}}>
                                                    {leaderboard.firstName+" "+leaderboard.lastName}
                                                </div>
                                                <div className="text-right" style={{margin: 0, padding: 0, whiteSpace: 'nowrap'}}>
                                                    {(() => {
                                                        var total_points = "";
                                                        if(leaderboard.total_points){
                                                            total_points = leaderboard.total_points;
                                                        } else if(leaderboard.daily_points){
                                                            total_points = leaderboard.daily_points.points;
                                                        } else if(leaderboard.weekly_points){
                                                            total_points = leaderboard.weekly_points.points;
                                                        }
                                                        return points.commafy(total_points) + " PTS";
                                                    })()}
                                                </div>
                                            </div>
                                        }
                                    </li>
                                );
                            })
                        }
                    </ul>
                    <div className="text-center">
                        <button className="fas fa-angle-left clickable" style={{padding: '3px 8px'}} onClick={() => {
                            if(this.state.min != 1){
                                this.setState({
                                    min: this.state.min-5,
                                    max: this.state.max-5
                                })
                            }
                        }}></button>
                        <button className="fas fa-angle-right clickable" style={{padding: '3px 8px', marginLeft: 5}} onClick={() => {
                            if(this.state.max != 10){
                                this.setState({
                                    min: this.state.min+5,
                                    max: this.state.max+5
                                })
                            }
                        }}></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default LeaderBoardsRemodel;