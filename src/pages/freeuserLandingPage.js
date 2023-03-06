import React from 'react';
import { Helmet } from 'react-helmet';
import withAuth from './../hoc/withAuth';
const points = require('../../Global_Values');

class FreeUserLandingPage extends React.Component {
    constructor(props) {
        super(props);
    }
    
    head() {
        return (
            <Helmet>
                <title>All Pages Locked - Product List Genie</title>
            </Helmet>
        );
    }
    
    render() {
        return (
            <div className="text-center">
                {this.head()}
                <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <h3>There might be an issue with your account privileges,</h3>
                <h3>please contact support via Chat right away to fix this issue.</h3>
                {/* <h3>If this is a mistake, please contact support via chat. </h3>
                <h3>if you want to become a full access member, Upgrade account <a href={points.upgradeAccountLink+"?email="+this.props.session.getCurrentUser.email} target="_blank">here</a></h3> */}
            </div>
        )
    }
}

export default withAuth(session => session && session.getCurrentUser)(FreeUserLandingPage);