import React from 'react';
import toastr from 'toastr';
import withAuth from './../hoc/withAuth';
import { Link } from 'react-router-dom';
import { GET_ADMIN_CUSTOM_PAGES, GET_ADMIN_CUSTOM_PAGE_DATA } from './../queries';
import { Query, Mutation } from 'react-apollo';
import { Helmet } from 'react-helmet';
import Loading from '../components/loading';
import ButtonWithPopup from '../components/buttonWithPopup';
import moment from 'moment';
const points = require('../../Global_Values');

class TrainingPages extends React.Component {
    constructor() {
        super();
        this.state = {
            trackingnumber: ''
        }
    }

    componentDidMount() {
        
    }

    checkAvailability(data){
        var userPrivilege = this.props.session.getCurrentUser.privilege;
        var userTags = this.props.session.getCurrentUser.kartra_tags;
        if (userPrivilege == 0) { // User Privilege
            return false;
        }
        if(data.page_lock_by_tag && data.page_lock_by_privilege){
            // if bot present
            if (userPrivilege <= 5) { // User Privilege
                if(userTags.includes(data.page_tag) && (!data.page_privilege_from >= userPrivilege) || (!userPrivilege <= data.page_privilege_to)){
                    // console.log("has access");
                    return true;
                } else {
                    // console.log("no access");
                    return false;
                }
            } else {
                // console.log("admin to")
                return true;
            }
        } else if(data.page_lock_by_tag){
            if (userPrivilege <= 5) { // User Privilege
                if(userTags.includes(data.page_tag)){
                    // console.log("kartra tag found", data.page_tag, "user has",userTags.toString());
                    return true;
                } else {
                    // console.log("no required kartra tag", data.page_tag, "user has",userTags.toString());
                    return false;
                }
            } else {
                // console.log("admin to")
                return true;
            }
        } else if(data.page_lock_by_privilege){
            if (userPrivilege <= 5) { // User Privilege
                // console.log(data.page_privilege_from, userPrivilege, data.page_privilege_to)
                if(userPrivilege >= data.page_privilege_from && userPrivilege <= data.page_privilege_to){
                    // console.log("dont have access user privilege is: ", userPrivilege)
                    return false;
                } else {
                    // console.log("have access user privilege is: ", userPrivilege)
                    return true;
                }
            } else {
                // console.log("has access", userPrivilege)
                return true;
            }
        } else {
            return true;
        }
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Training Pages - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        var state = this.state;
        var currentUser = this.props.session.getCurrentUser;
        var panelid = this.props.match.params.trainingid;
        if (!panelid) return null;
        return (
            <div className="funnel">
                {this.head()}
                <style dangerouslySetInnerHTML={{ __html: `.footer { margin-top: 0; }` }} />
                <div className="flex-container center-vertical" style={{ height: '85vh', backgroundColor: '#232c33' }}>
                    <div style={{ backgroundColor: '#1f272d', borderRadius: 5, padding: "30px 20px", minWidth: 400 }}>
                        <Query query={GET_ADMIN_CUSTOM_PAGES(`{ custom_page { id navigation_name description createdAt } }`)} variables={{ content_id: panelid }}>
                            {({ data, loading, error, refetch }) => {
                                if(loading) return <Loading width={100} height={100} />;
                                if(error) return <div style={{borderRadius: 5, padding: 10, backgroundColor: '#2b363e', textAlign: 'center'}}><label className="color-green">An error has occurred please try again.</label></div>;
                                const navigation_name = data.getAdminSettings.custom_page.filter(el => el.id == panelid);
                                if(navigation_name.length == 0) return <h4 className="text-center header capitalize" style={{marginBottom: 10}}>Invalid URL</h4>;
                                return (
                                    <div className="text-center">
                                        <div className="row-separator">
                                            <img src="/assets/graphics/training-page-badge.png" style={{width: 70}} />
                                        </div>
                                        <div className="row-separator">
                                            <h4 className="header capitalize">{navigation_name[0].navigation_name}</h4>
                                        </div>
                                        <div className="row-separator">
                                            <label className="font-small header-small-light-normal">Date Added: {new Date(parseInt(navigation_name[0].createdAt)).toLocaleDateString()}</label>
                                        </div>
                                        <div className="row-separator">
                                            <label className="font-small header-small-light-normal">{navigation_name[0].description ? navigation_name[0].description : "Description Unavailable"}</label>
                                        </div>
                                    </div>
                                );
                            }}
                        </Query>
                        <div style={{ borderRadius: 5 }}>
                            <div style={{padding: '15px 15px 10px', backgroundColor: '#2b363e'}}>
                                <label className="font-roboto-bold color-white">Training Videos</label>
                            </div>
                            <div style={{ padding: 20, backgroundColor: '#252f36', maxHeight: 300, overflowY: 'auto' }}>
                                <Query query={GET_ADMIN_CUSTOM_PAGE_DATA} variables={{ panel_id: panelid }}>
                                    {({ data, loading, error, refetch }) => {
                                        if(loading) return <Loading width={100} height={100} />
                                        if(error) return <div style={{borderRadius: 5, padding: 10, backgroundColor: '#2b363e', textAlign: 'center'}}><label className="color-green">An error has occurred please try again.</label></div>;
                                        if(data.getCustomPageOfPanel.length == 0) return <div style={{borderRadius: 5, padding: 10, backgroundColor: '#2b363e', textAlign: 'center'}}><label className="color-green">No Page found.</label></div>;
                                        return data.getCustomPageOfPanel.map((pages, i) => {
                                            var isAvailable = this.checkAvailability(pages);
                                            return (
                                                <div style={{borderRadius: 5, padding: 10, backgroundColor: '#2b363e', display: 'flex', alignItems: 'center', marginTop: 5}} key={i}>
                                                    <div style={{width: '20%'}}>
                                                        <span className={(isAvailable ? pages.page_icon : "fas fa-lock")+" color-orange"} style={{border: '1px solid #ff7837', padding: '3px 4px', borderRadius: 5}} />
                                                    </div>
                                                    <div style={{width: '80%'}}>
                                                        {(() => {
                                                            if(isAvailable){
                                                                return (
                                                                    <Link to={isAvailable ? "/training-videos/"+pages.id : "#"}>
                                                                        <label className="color-green cursor-pointer capitalize">{pages.page_name.toLowerCase()}</label>
                                                                    </Link>
                                                                );
                                                            } else {
                                                                return <label className="color-green cursor-pointer capitalize">{pages.page_name.toLowerCase()}</label>
                                                            }
                                                        })()}
                                                    </div>
                                                </div>
                                            );
                                        });
                                    }}
                                </Query>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(TrainingPages);