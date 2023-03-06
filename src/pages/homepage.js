import React from 'react';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
// import HomepageTrial from './homepageTrial';
// import HomepageFull from './homepageFull';
import Fulfiller from './fulfiller';
import HomepageREMODEL from './homepageFullRemodel';
import HomepageREMODELES from './homepageFullRemodelES';
const points = require('../../Global_Values');

class Homepage extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    head() {
        return (
            <Helmet>
                <title>Dashboard - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        var urlParams = points.getURLParameters(this.props.location.search);
        if(this.props.session.getCurrentUser){
            if((urlParams.key && urlParams.loc && urlParams.key == this.props.session.getCurrentUser.pass_key) || this.props.session.getCurrentUser.access_tags.includes("fulfiller")){
                return <Fulfiller refetch={this.props.refetch} session={this.props.session} {...this.props} />;
            } else {
                if(this.props.location.pathname != "/dashboard/es"){
                    return <HomepageREMODEL refetch={this.props.refetch} session={this.props.session} />;
                } else {
                    return <HomepageREMODELES refetch={this.props.refetch} session={this.props.session} />;
                }
            }
        }
    }
}

export default withAuth(session => session && session.getCurrentUser)(Homepage);