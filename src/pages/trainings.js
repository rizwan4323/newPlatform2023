import React from 'react';
import withAuth from './../hoc/withAuth';
import { Link } from 'react-router-dom';
import { GET_ADMIN_CUSTOM_PAGES } from './../queries';
import { Query } from 'react-apollo';
import { Helmet } from 'react-helmet';
import Loading from '../components/loading';
const points = require('../../Global_Values');

class Trainings extends React.Component {
    constructor() {
        super();
        this.state = { navigations: [] }
    }

    componentDidMount() { }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Trainings - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        return (
            <div className="funnel">
                {this.head()}
                <style dangerouslySetInnerHTML={{__html: ` .grid { margin: 0 !important; } `}} />
                <div className="flex-container" style={{ backgroundImage: 'linear-gradient(to top, #667a80, #596a71, #4c5b62, #3f4c53, #333e45, #2e383f, #283239, #232c33, #232c33, #232c33, #232c33, #232c33)', padding: '40px 40px 0 40px' }}>
                    <img src="/assets/graphics/iloveplg.png" style={{ width: '100%', maxWidth: 330 }} />
                    <div style={{backgroundColor: '#2b363e', padding: 'calc(10px + 1vw) calc(10px + 3vw)', marginBottom: 30, display: 'flex', alignItems: 'center', maxWidth: '100%'}}> {/* padding: '30px 100px 30px 50px' */}
                        <label className="color-white training-banner-text" style={{ fontSize: "calc(12px + 2.3vw)" }}> {/* fontSize: 50 */}
                            Learn To Become an <br />
                            <span className="color-orange"> eCommerce Pro</span> Using <br />
                            <span className="color-green"> Product List Genie</span>
                        </label>
                        {/* <br/> <br/> <br/> <br/> <br/> <br/> <br/> */}
                        {/* <a href="#" className="color-green" style={{textDecoration: 'underline'}}>
                            <label className="cursor-pointer">Why Should I Do Training?</label>
                        </a> */}
                    </div>
                </div>
                <div style={{ backgroundColor: '#1f272d', padding: 30 }}>
                    {this.state.navigations.length != 0 &&
                        this.state.navigations.map((navigation, i) => {
                            return (
                                <div className={"row-separator "+navigation.order} key={i}>
                                    <div className="column column_12_12 row-separator" style={{ borderBottom: '1px solid #ffffff' }}>
                                        <h3 className="color-white">{points.capitalizeWord(navigation.type)}</h3>
                                    </div>
                                    <div className="column column_12_12 flex-container row-separator" style={{ justifyContent: 'unset' }}>{navigation.doms}</div>
                                    <span className="clear" />
                                </div>
                            );
                        })
                    }
                    <Query query={GET_ADMIN_CUSTOM_PAGES(` { custom_page { id active navigation_name navigation_type description img_url createdAt } } `)} variables={{ active: true }} notifyOnNetworkStatusChange={true} onCompleted={data => {
                        if(!data.getAdminSettings || data.getAdminSettings.custom_page || data.getAdminSettings.custom_page.filter(el => el.active).length != 0){
                            const navigations = [];
                            function getDom(type){
                                return data.getAdminSettings.custom_page.filter(el => el.navigation_type == type && el.active).map((training, pi) => {
                                    var img_url = "/assets/graphics/panel_image.png";
                                    if(training.img_url && training.img_url.includes("https://")) img_url = training.img_url;
                                    return (
                                        <div className="display-inline" style={{ maxWidth: 600, margin: '10px 1% 0', position: 'relative' }} key={pi}>
                                            <div style={{position: 'absolute', top: 0, left: 0, height: '100%', width: '30%', backgroundColor: '#2b363e', opacity: 0.4}} />
                                            <img src={img_url} width="30%" />
                                            <div style={{backgroundColor: '#2b363e', width: '70%', padding: 20, height: '100%'}}>
                                                <div className="float-right">
                                                    <Link to={{ pathname: "/training/"+training.id }} className="color-green" style={{ textDecoration: 'underline', lineHeight: 0 }}>
                                                        <label className="cursor-pointer">Start Training</label>
                                                    </Link>
                                                </div>
                                                <h4 className="header capitalize">{training.navigation_name}</h4>
                                                {/* <label className="font-small header-small-light-normal">Date Added: {new Date(parseInt(training.createdAt)).toLocaleDateString()}</label> */}
                                                <label className="font-small header-small-light-normal" style={{marginTop: 10}}>{training.description ? training.description : "Description Unavailable"}</label>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            data.getAdminSettings.custom_page.forEach(training => {
                                if(training.active) {
                                    if(navigations.length == 0) {
                                        navigations.push({ order: 1, type: training.navigation_type, doms: getDom(training.navigation_type) });
                                    } else if(navigations.filter(el => el.type == training.navigation_type).length == 0) {
                                        navigations.push({ order: (navigations.length+1), type: training.navigation_type, doms: getDom(training.navigation_type) });
                                    }
                                }
                            })
                            this.setState({ navigations: navigations.sort((a,b) => a.order < b.order ? -1 : 1) });
                        }
                    }}>
                        {({ data, loading, error, refetch }) => {
                            if(loading) return <Loading width={200} height={200} />
                            if(error) return <h4 className="header">Failed to load training pages.</h4>
                            if(!data.getAdminSettings || data.getAdminSettings.custom_page.length == 0 || data.getAdminSettings.custom_page.filter(el => el.active).length == 0) return <h4 className="header">No Training pages found please comeback again.</h4>
                            return null;
                        }}
                    </Query>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(Trainings);