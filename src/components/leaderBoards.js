import React from "react";
import Loading from '../components/loading';
import Trophy from '../components/trophy';
const points = require('../../Global_Values');

class LeaderBoards extends React.Component {
    constructor() {
        super();
        this.state = {
            activeDisplay: "weekly",
            LeaderBoardsContent: [],
            noResult: false,
            leaderBoardsTopReferrer: [],
            noResultReferrer: false
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
        return (
            <div>
                <br/><br/>
                <div className="profile-card js-profile-card">
                    <div className="profile-card__img">
                        <div className="trophy">
                            <Trophy height={40} width={40} />
                        </div>
                    </div>
                    
                    <div className="profile-card__cnt js-profile-cnt">
                        <h3 style={{fontSize: '2rem'}}>Hall of Genies</h3>
                        <button className={this.state.activeDisplay == "weekly" ? "dwobtn dwobtn-focus" : "dwobtn"} onClick={this.changeDisplay.bind(this, "weekly")}>Weekly</button>&nbsp;
                        <button className={this.state.activeDisplay == "daily" ? "dwobtn dwobtn-focus" : "dwobtn"} onClick={this.changeDisplay.bind(this, "daily")}>Daily</button>&nbsp;&nbsp;
                        <button className={this.state.activeDisplay == "overall" ? "dwobtn dwobtn-focus" : "dwobtn"} onClick={this.changeDisplay.bind(this, "overall")}>Overall</button>
                    </div>

                    <div>
                        <ul>
                            {this.state.LeaderBoardsContent.length == 0 &&
                                <li>
                                    {this.state.noResult ? <div className="text-center">Empty... check back soon!</div> : <Loading height={100} width={100} />}
                                </li>
                            }
                            {this.state.LeaderBoardsContent.length != 0 &&
                                this.state.LeaderBoardsContent.map((leaderboard,i) => {
                                    return (
                                        <li key={i}>
                                            {i == 0 &&
                                                <div style={{overflow: 'hidden'}}>
                                                    <div className="column column_8_12" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: 0, textTransform: 'capitalize'}}>
                                                        <span>
                                                            <i className="fas fa-award" style={{fontSize: '1.7rem', color: '#d4af37'}} />
                                                        </span>
                                                        &nbsp; {leaderboard.firstName+" "+leaderboard.lastName}
                                                    </div>
                                                    <div className="column column_4_12 text-right" style={{padding: 0, margin: '5px 0 0 0'}}>
                                                        {(() => {
                                                            var total_points = "";
                                                            if(leaderboard.total_points){
                                                                total_points = leaderboard.total_points;
                                                            } else if(leaderboard.daily_points){
                                                                total_points = leaderboard.daily_points.points;
                                                            } else if(leaderboard.weekly_points){
                                                                total_points = leaderboard.weekly_points.points;
                                                            }

                                                            return points.commafy(total_points) + " pts";
                                                        })()}
                                                    </div>
                                                </div>
                                            }
                                            {i == 1 &&
                                                <div style={{overflow: 'hidden'}}>
                                                    <div className="column column_8_12" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: 0, textTransform: 'capitalize'}}>
                                                        <span>
                                                            <i className="fas fa-award" style={{fontSize: '1.7rem', color:'#cccccc'}}/>
                                                        </span>
                                                        &nbsp; {leaderboard.firstName+" "+leaderboard.lastName}
                                                    </div>
                                                    <div className="column column_4_12 text-right" style={{padding: 0, margin: '5px 0 0 0'}}>
                                                        {(() => {
                                                            var total_points = "";
                                                            if(leaderboard.total_points){
                                                                total_points = leaderboard.total_points;
                                                            } else if(leaderboard.daily_points){
                                                                total_points = leaderboard.daily_points.points;
                                                            } else if(leaderboard.weekly_points){
                                                                total_points = leaderboard.weekly_points.points;
                                                            }
                                                            return points.commafy(total_points) + " pts";
                                                        })()}
                                                    </div>
                                                </div>
                                            }
                                            {i == 2 &&
                                                <div style={{overflow: 'hidden'}}>
                                                    <div className="column column_8_12" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: 0, textTransform: 'capitalize'}}>
                                                        <span>
                                                            <i className="fas fa-award" style={{fontSize: '1.7rem', color:'#cd7f32'}} />
                                                        </span>
                                                        &nbsp; {leaderboard.firstName+" "+leaderboard.lastName}
                                                    </div>
                                                    <div className="column column_4_12 text-right" style={{padding: 0, margin: '5px 0 0 0'}}>
                                                        {(() => {
                                                            var total_points = "";
                                                            if(leaderboard.total_points){
                                                                total_points = leaderboard.total_points;
                                                            } else if(leaderboard.daily_points){
                                                                total_points = leaderboard.daily_points.points;
                                                            } else if(leaderboard.weekly_points){
                                                                total_points = leaderboard.weekly_points.points;
                                                            }
                                                            return points.commafy(total_points) + " pts";
                                                        })()}
                                                    </div>
                                                </div>
                                            }
                                            {i > 2 &&
                                                <div style={{overflow: 'hidden'}}>
                                                    <div className="column column_8_12" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: 0, textTransform: 'capitalize'}}>
                                                        <strong style={{fontSize: '1.7rem'}}>{i+1}</strong>
                                                        &nbsp; {leaderboard.firstName+" "+leaderboard.lastName}
                                                    </div>
                                                    <div className="column column_4_12 text-right" style={{padding: 0, margin: '5px 0 0 0'}}>
                                                        {(() => {
                                                            var total_points = "";
                                                            if(leaderboard.total_points){
                                                                total_points = leaderboard.total_points;
                                                            } else if(leaderboard.daily_points){
                                                                total_points = leaderboard.daily_points.points;
                                                            } else if(leaderboard.weekly_points){
                                                                total_points = leaderboard.weekly_points.points;
                                                            }
                                                            return points.commafy(total_points) + " pts";
                                                        })()}
                                                    </div>
                                                </div>
                                            }
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>

                    {/* Top Referrer */}
                    {/* <div className="text-center">
                        <h3 style={{margin: '1rem 0', fontSize: '2rem'}}>Top Affiliate Genies</h3>
                    </div>
                    <div>
                        <ul>
                            {this.state.leaderBoardsTopReferrer.length == 0 &&
                                <li>
                                    {this.state.noResultReferrer ? <div className="text-center">Empty... check back soon!</div> : <Loading height={100} width={100} />}
                                </li>
                            }
                            {this.state.leaderBoardsTopReferrer.length != 0 &&
                                this.state.leaderBoardsTopReferrer.map((leaderboard,i) => {
                                    return (
                                        <li key={i}>
                                            {i == 0 &&
                                                <div style={{overflow: 'hidden'}}>
                                                    <div className="column column_8_12" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: 0, textTransform: 'capitalize'}}>
                                                        <span>
                                                            <i className="fas fa-award" style={{fontSize: '1.7rem', color: '#d4af37'}} />
                                                        </span>
                                                        &nbsp; {leaderboard.firstName+" "+leaderboard.lastName}
                                                    </div>
                                                    <div className="column column_4_12 text-right" style={{padding: 0, margin: '5px 0 0 0'}}>
                                                        {leaderboard.count}
                                                    </div>
                                                </div>
                                            }
                                            {i == 1 &&
                                                <div style={{overflow: 'hidden'}}>
                                                    <div className="column column_8_12" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: 0, textTransform: 'capitalize'}}>
                                                        <span>
                                                            <i className="fas fa-award" style={{fontSize: '1.7rem', color:'#cccccc'}}/>
                                                        </span>
                                                        &nbsp; {leaderboard.firstName+" "+leaderboard.lastName}
                                                    </div>
                                                    <div className="column column_4_12 text-right" style={{padding: 0, margin: '5px 0 0 0'}}>
                                                        {leaderboard.count}
                                                    </div>
                                                </div>
                                            }
                                            {i == 2 &&
                                                <div style={{overflow: 'hidden'}}>
                                                    <div className="column column_8_12" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: 0, textTransform: 'capitalize'}}>
                                                        <span>
                                                            <i className="fas fa-award" style={{fontSize: '1.7rem', color:'#cd7f32'}} />
                                                        </span>
                                                        &nbsp; {leaderboard.firstName+" "+leaderboard.lastName}
                                                    </div>
                                                    <div className="column column_4_12 text-right" style={{padding: 0, margin: '5px 0 0 0'}}>
                                                        {leaderboard.count}
                                                    </div>
                                                </div>
                                            }
                                            {i > 2 &&
                                                <div style={{overflow: 'hidden'}}>
                                                    <div className="column column_8_12" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: 0, textTransform: 'capitalize'}}>
                                                        <strong style={{fontSize: '1.7rem'}}>{i+1}</strong>
                                                        &nbsp; {leaderboard.firstName+" "+leaderboard.lastName}
                                                    </div>
                                                    <div className="column column_4_12 text-right" style={{padding: 0, margin: '5px 0 0 0'}}>
                                                        {leaderboard.count}
                                                    </div>
                                                </div>
                                            }
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div> */}
                </div>
            </div>
        );
    }
}

export default LeaderBoards;
