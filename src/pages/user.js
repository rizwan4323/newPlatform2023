import React, { Fragment } from 'react';
import { PROFILE_PAGE } from './../queries';
import { Query } from 'react-apollo';
import webConfig from './../../webConfig';
import { Helmet } from 'react-helmet';
import withAuth from './../hoc/withAuth';
import KartraTransaction from '../components/kartraTransaction';
const points = require('../../Global_Values');

class User extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        this.props.refetch();
        const id = this.props.match.params.URL_Param ? this.props.match.params.URL_Param : staticContext.URL_Param;
        return (
            <Fragment>
                <Query query={PROFILE_PAGE} variables={{ id }}>
                    {({ data, loading, error }) => {
                        if (loading) return <div></div>
                        if (error) return <div>Error</div>
                        const complete_profile = data.profilePage.one_time_missions.includes("complete_profile");
                        const connect_store = data.profilePage.store_token ? true : false;
                        const push_store = data.profilePage.one_time_missions.includes("first_push_to_store");
                        return (
                            <div className="grid userProfilePage page-container">
                                <Helmet>
                                    <title>{`${data.profilePage.firstName} ${data.profilePage.lastName}\`s Profile - Product List Genie`}</title>
                                </Helmet>
                                <div className="column column_3_12">
                                    <div className="profileImage">
                                        {!data.profilePage.profileImage &&
                                            <img src={`${webConfig.siteURL}/assets/graphics/abstract_patterns/texture.jpg`} />
                                        }
                                        {data.profilePage.profileImage &&
                                            <img src={`${webConfig.siteURL}/user-uploads/${data.profilePage.profileImage}`} />
                                        }
                                    </div>
                                    <div className="user">
                                        {data.profilePage.firstName} {data.profilePage.lastName}
                                    </div>
                                </div>
                                <div className="column column_9_12">
                                    <h2>About me:</h2>
                                    <h4><strong>{points.getTypeOfUser(data.profilePage.privilege)}</strong></h4>
                                    <div dangerouslySetInnerHTML={{__html: data.profilePage.bio}} className="word-wrap"></div>
                                </div>
                                {/* <div className="column column_3_12">
                                    <div className="product-card">
                                        <div className="product-details text-center">
                                            <div style={{padding: '5px 15px'}}>
                                                <h3>How to earn points?</h3>
                                                <div style={{textAlign: 'left'}}>    
                                                    <p>Connect to Shopify: <span className="float-right">{points.points_connectToStore}pts</span></p>
                                                    <p>Push Product to store: <span className="float-right">{points.points_pushToStore}pts</span></p>
                                                    <p>Push Bundle to store: <span className="float-right">{points.points_pushWithBundle}pts</span></p>
                                                    <p>Add Review: <span className="float-right">{points.points_addReview}pts</span></p>
                                                    <p>Copy Push: <span className="float-right">{points.points_copyPush}pts</span></p>
                                                    <p>Complete your profile: <span className="float-right">{points.points_complete_profile}pts</span></p>
                                                    <p>Join FB Group: <span className="float-right">{points.points_join_fb_group}pts</span></p>
                                                    <p>Spread The word: <span className="float-right">{points.points_spread_the_word}pts</span></p>
                                                    <p>Schedule Demo Call: <span className="float-right">{points.points_schedule_demo_call}pts</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}

                                {/* points etc.. */}
                                {/* <div className="column column_12_12 clearfix">
                                    <div className="column column_3_12">
                                        <div className="product-card">
                                            <div className="product-details text-center">
                                                <h1 style={{margin: '0 0 20px'}}>{points.commafy(data.profilePage.reward_points.reduce((prevVal, nextVal) => {return prevVal + nextVal.points}, 0))}</h1>
                                                <h4 style={{margin: 0}}>Total Earn<br/>Points</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column column_3_12">
                                        <div className="product-card">
                                            <div className="product-details text-center">
                                                <h1 style={{margin: '0 0 20px'}}>{points.commafy(data.profilePage.reward_points.reduce((prevVal, nextVal) => {return nextVal.source == "Push To Store" ? prevVal + nextVal.points : prevVal + 0}, 0))}</h1>
                                                <h4 style={{margin: 0}}>Push to Store<br/>Points</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column column_3_12">
                                        <div className="product-card">
                                            <div className="product-details text-center">
                                                <h1 style={{margin: '0 0 20px'}}>{points.commafy(data.profilePage.reward_points.reduce((prevVal, nextVal) => {return nextVal.source == "Push With Bundle" ? prevVal + nextVal.points : prevVal + 0}, 0))}</h1>
                                                <h4 style={{margin: 0}}>Push With Bundle<br/>Points</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column column_3_12">
                                        <div className="product-card">
                                            <div className="product-details text-center">
                                                <h1 style={{margin: '0 0 20px'}}>{points.commafy(data.profilePage.reward_points.reduce((prevVal, nextVal) => {return nextVal.source == "Copy Push" ? prevVal + nextVal.points : prevVal + 0}, 0))}</h1>
                                                <h4 style={{margin: 0}}>Copy Push<br/>Points</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column column_3_12">
                                        <div className="product-card">
                                            <div className="product-details text-center">
                                                <h1 style={{margin: '0 0 20px'}}>{points.commafy(data.profilePage.reward_points.reduce((prevVal, nextVal) => {return nextVal.source == "Add Review" ? prevVal + nextVal.points : prevVal + 0}, 0))}</h1>
                                                <h4 style={{margin: 0}}>Add Reviews<br/>Points</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column column_3_12">
                                        <div className="product-card">
                                            <div className="product-details text-center">
                                                <h1 style={{margin: '0 0 20px', color: complete_profile ? '#27c686' : 'red'}} className={complete_profile ? "fas fa-check" : "fas fa-times"}></h1>
                                                <h4 style={{margin: 0}}><br/>Complete Profile</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column column_3_12">
                                        <div className="product-card">
                                            <div className="product-details text-center">
                                                <h1 style={{margin: '0 0 20px', color: connect_store ? '#27c686' : 'red'}} className={connect_store ? "fas fa-check" : "fas fa-times"}></h1>
                                                <h4 style={{margin: 0}}><br/>Connect to Shopify</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column column_3_12">
                                        <div className="product-card">
                                            <div className="product-details text-center">
                                                <h1 style={{margin: '0 0 20px', color: push_store ? '#27c686' : 'red'}} className={push_store ? "fas fa-check" : "fas fa-times"}></h1>
                                                <h4 style={{margin: 0}}><br/>Push to Store</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                {/* Kartra Transaction */}
                                <div className="column column_12_12 clearfix">
                                    <KartraTransaction email={data.profilePage.kartra ? data.profilePage.kartra : data.profilePage.email }/>
                                </div>
                            </div>
                        )
                    }}
                </Query>
            </Fragment>
        )
    }
}

export default withAuth(session => session && session.getCurrentUser)(User);