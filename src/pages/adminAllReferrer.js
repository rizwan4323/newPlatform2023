import React from 'react';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
import { ADMIN_GET_ALL_REFERRER, GET_ALL_REFERRAL } from './../queries';
import { Query } from 'react-apollo';
import Popup from 'reactjs-popup';
import Loading from '../components/loading';
import moment from 'moment';
const points = require('../../Global_Values');

class AdminAllReferrer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    head() {
        return (
            <Helmet>
                <title>All Referrer - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        return (
            <div className="page-container">
                <div className="text-center">
                    <h2>All Referrer</h2>
                </div>
                {this.head()}
                <div className="table-container">
                    <table className="table-list">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th className="text-center">Referrals</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <Query query={ADMIN_GET_ALL_REFERRER} >
                                {({data, loading, refetch}) => {
                                    if(loading){
                                        return (
                                            <tr>
                                                <td colSpan="5" className="text-center"><Loading height={200} width={200} /></td>
                                            </tr>
                                        )
                                    }
                                    if(data.getAllReferrer.length == 0){
                                        return (
                                            <tr>
                                                <td colSpan="5" className="text-center"><span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>Empty... check back soon!</span></td>
                                            </tr>
                                        );
                                    }
                                    return data.getAllReferrer.map((referrer,i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{i+1}</td>
                                                <td>
                                                    <Popup className="points-tooltip" trigger={<span className="text-center clickable stretch-width">View Referrals</span>} position="right center" on="click" contentStyle={{ width: "fit-content", maxHeight: 300, overflowY: "auto" }}>
                                                        <div className="table-container">
                                                            <table className="table-list">
                                                                <thead>
                                                                    <tr>
                                                                        <th>#</th>
                                                                        <th>View</th>
                                                                        <th>Name</th> 
                                                                        <th>Invited On</th>
                                                                        <th>Total Spent</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <Query query={GET_ALL_REFERRAL} variables={{ referralId: referrer.referralId }} >
                                                                        {({data, loading, refetch}) => {
                                                                            if(loading) return (<tr><td colSpan="4" className="text-center"><Loading height={100} width={100} /></td></tr>);
                                                                            return data.getAllReferrals.map((referrals, x) => {
                                                                                var joinDate = new Date(parseInt(referrals.joinDate)).toISOString();
                                                                                var spentInPLG = 0;
                                                                                referrals.kartra_tags.forEach(tag => {
                                                                                    if(tag == points.tag_advance_strategies){
                                                                                        spentInPLG += points.kartra_tag_pricing.advance_strategies;
                                                                                    }
                                                                                    if(tag == points.tag_dfy_store){
                                                                                        spentInPLG += points.kartra_tag_pricing.dfy_store;
                                                                                    }
                                                                                })
                                                                                if(referrals.success_rebill){
                                                                                    spentInPLG += 97.00;
                                                                                }
                                                                                return(
                                                                                    <tr key={x}>
                                                                                        <td className="text-center">{x+1}</td>
                                                                                        <td className="text-center">
                                                                                            <a target="_blank" href={`profile/${referrals.id}`}>
                                                                                                <span className="fas fa-eye"></span>
                                                                                            </a>
                                                                                        </td>
                                                                                        <td style={{textTransform: 'capitalize'}} className="capitalize">{referrals.firstName + " " + referrals.lastName}</td>
                                                                                        <td>{moment(joinDate).startOf('second').fromNow()}</td>
                                                                                        <td className="text-center">{"$"+spentInPLG.toFixed(2)}</td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }}
                                                                    </Query>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </Popup>
                                                </td>
                                                <td className="capitalize">{referrer.firstName} {referrer.lastName}</td>
                                                <td>{referrer.email}</td>
                                            </tr>
                                        );
                                    })
                                }}
                            </Query>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AdminAllReferrer);