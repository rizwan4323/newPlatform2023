import React from 'react';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
import toastr from 'toastr';
import Loading from '../components/loading';
import { Query, Mutation } from 'react-apollo';
import { GET_ALL_REFERRAL, GET_ALL_LEADS, SAVE_GA_OR_FB_ID} from './../queries';
import moment from 'moment';
import classNames from 'classnames';
const points = require('../../Global_Values');

class ShareInvitationLink extends React.Component {
    constructor() {
        super();
        this.state = {
            openSettings: false,
            gaId: '',
            fbId: ''
        }
    }

    componentDidMount(){
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

        this.setState({
            gaId: this.props.session.getCurrentUser.gaId,
            fbId: this.props.session.getCurrentUser.fbId
        })
    }

    updateGAandFBid(updateGAandFBid, event){
        updateGAandFBid().then(async ({ data }) => {
            toastr.clear();
            toastr.success("Google Analytics ID and FB Pixel has been updated","Saved!");
            this.props.refetch();
            this.toggleReferralSettings();
        }).catch(error => {
            this.setState({
                error: error.graphQLErrors.map(x => x.message)
            })
            console.error("ERR =>", error.graphQLErrors.map(x => x.message));
        });
    }

    handleChange(event){
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [name]: value
        })
    }

    toggleReferralSettings(event){
        this.setState({
            openSettings: !this.state.openSettings
        })
    }

    copyToClipBoard(id){
        points.copyToClipBoard(id);
        toastr.clear();
        toastr.success("Invitation Link Copied","Copy to Clipboard");
    }

    head() {
        return (
            <Helmet>
                <title>Share Referral Link - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const { getCurrentUser } = this.props.session;
        return (
            <div className="page-container">
                {this.head()}
                <div className="text-center">
                    <div className="column column_12_12">
                        <iframe src="https://player.vimeo.com/video/312187216" width="600" height="360" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                    </div>
                </div>

                <div className="text-center">
                    <h3>Share Referral Link</h3>
                </div>

                {/* Shareable Link */}
                <div className="column column_12_12">
                    <div className="form_wrap">
                        <div className="form_row">
                            <div className="form_item">
                                <div className="form_buttons form_input">
                                    <div className="product-card">
                                        <div className="product-details">
                                            <div className="grid" style={{overflow: 'hidden'}}>
                                                <div className="column column_10_12" style={{lineHeight: 1.5}}>
                                                    <label>Share your referral link</label>
                                                    <input type="text" id="invitation-link" defaultValue={"https://plgenie.io/"+getCurrentUser.referralId+(getCurrentUser.gaId ? '/GA-'+getCurrentUser.gaId.replace(/UA-|-1/g,"") : '')+(getCurrentUser.fbId ? '/FB-'+getCurrentUser.fbId : '')} style={{fontSize: 20}} readOnly/>
                                                </div>
                                                <div className="column column_2_12">
                                                    <br/><br/>
                                                    <button className="btn stretch-width" onClick={() => this.copyToClipBoard("invitation-link")}>Copy</button>
                                                </div>
                                                <div className="column column_12_12">
                                                    <div className={classNames({ 'headline': true, 'desktop_nav_button': true, 'active': this.state.openSettings })} onClick={event => this.toggleReferralSettings(event)} style={{backgroundColor: 'transparent !important', color: '#4a4a4a', display: 'flex', alignItems: 'center'}}>
                                                        <span className="fas fa-cog" style={{cursor: 'pointer', fontSize: 20, marginRight: '5px'}} onClick={this.toggleReferralSettings.bind(this)}></span> Advance Settings
                                                    </div>
                                                    <div className={classNames({ 'desktop_nav_toggle': true, 'active': this.state.openSettings })}>
                                                        <div className="form_wrap">
                                                            <div className="form_row">
                                                                <div className="column column_6_12">
                                                                    <div className="form_item">
                                                                        <div className="form_input">
                                                                            <label>Google Analytics ID:</label>
                                                                            <input type="text" name="gaId" placeholder="eg. UA-XXXXXXXXX-1" value={this.state.gaId} onChange={this.handleChange.bind(this)} />
                                                                            <span className="bottom_border"></span>
                                                                        </div> <br/>
                                                                    </div>
                                                                </div>
                                                                <div className="column column_6_12">
                                                                    <div className="form_item">
                                                                        <div className="form_input">
                                                                            <label>Facebook Pixel ID:</label>
                                                                            <input type="text" name="fbId" placeholder="eg. XXXXXXXXX" value={this.state.fbId} onChange={this.handleChange.bind(this)} />
                                                                            <span className="bottom_border"></span>
                                                                        </div> <br/>
                                                                    </div>
                                                                </div>
                                                                <div className="column column_12_12 text-right form_buttons">
                                                                    <Mutation
                                                                        mutation={SAVE_GA_OR_FB_ID}
                                                                        variables={{
                                                                            id: getCurrentUser.id,
                                                                            gaId: this.state.gaId,
                                                                            fbId: this.state.fbId
                                                                        }}> 
                                                                        {(updateGAandFBid, { data, loading, error }) => {
                                                                            return <button className="btn" onClick={event => this.updateGAandFBid(updateGAandFBid, event)}>Save</button>;
                                                                        }}
                                                                    </Mutation>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* list of referrals */}
                <div className="column column_12_12 clear">
                    <div className="product-card">
                        <div className="product-details">
                            <div className="text-center">
                                <h3>Conversions</h3>
                            </div>

                            <div className="table-container">
                                <table className="table-list">
                                    <thead>
                                        <tr>
                                            <th className="text-center">#</th>
                                            <th>Name</th>
                                            <th>Date</th>
                                            <th>Spent in PLG</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    <Query query={GET_ALL_REFERRAL} variables={{ referralId: getCurrentUser.referralId ? getCurrentUser.referralId : '' }} >
                                        {({data, loading, refetch}) => {
                                            if(loading) return (<tr> <td colSpan="4" className="text-center"><Loading height={200} width={200} /></td> </tr>);
                                            return (
                                                data.getAllReferrals.length == 0 ?
                                                    <tr>
                                                        <td colSpan="4" className="text-center">No Referrals yet</td>
                                                    </tr>
                                                :
                                                data.getAllReferrals.map((referrals,i) => {
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
                                                        <tr key={i}>
                                                            <td className="text-center">{i+1}</td>
                                                            <td style={{textTransform: 'capitalize'}}>{referrals.firstName + " " + referrals.lastName}</td>
                                                            <td>{moment(joinDate).startOf('second').fromNow()}</td>
                                                            <td>{"$"+spentInPLG.toFixed(2)}</td>
                                                        </tr>
                                                    )
                                                })
                                            );
                                        }}
                                    </Query>
                                    </tbody>
                                </table>
                            </div>

                            <div className="text-center">
                                <h3>Leads</h3>
                            </div>
                            <div className="table-container">
                                <table className="table-list">
                                    <thead>
                                        <tr>
                                            <th className="text-center">#</th>
                                            <th>Name</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    <Query query={GET_ALL_LEADS} variables={{ referralId: getCurrentUser.referralId ? getCurrentUser.referralId : '' }} >
                                        {({data, loading, refetch}) => {
                                            if(loading) return (<tr><td colSpan="3"><Loading height={200} width={200} /></td></tr>);
                                            return (
                                                data.getAllLeads.length == 0 ?
                                                    <tr>
                                                        <td colSpan="3" className="text-center">No Leads yet</td>
                                                    </tr>
                                                :
                                                data.getAllLeads.map((referrals,i) => {
                                                    var clickDate = new Date(parseInt(referrals.date)).toISOString();
                                                    return(
                                                        <tr key={i}>
                                                            <td className="text-center">{i+1}</td>
                                                            <td style={{textTransform: 'capitalize'}}>{referrals.name}</td>
                                                            <td>{moment(clickDate).startOf('second').fromNow()}</td>
                                                        </tr>
                                                    )
                                                })
                                            );
                                        }}
                                    </Query>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(ShareInvitationLink);