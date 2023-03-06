import React from 'react';

import Header from './../components/header';
import Footer from './../components/footer';
import SideBar from './../components/sidebar';
import Modal from '../components/ModalComponent';
import ExceededModal from './exceedingModal';
const points = require('../../Global_Values')

class MainLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
        }
    }

    async componentDidMount() {
        this.identify();        
    }

    closeModal() {
        this.setState({ openModal: false });
    }

    async componentDidUpdate(prevProps) {
        if (this.props.children && prevProps.children && this.props.children.props.location && prevProps.children.props.location && this.props.children.props.location.pathname !== prevProps.children.props.location.pathname) {
            this.identify();
            window.Appcues.page();            
        }
    }

    identify() {
        if (this.props.children && this.props.children.props.session) {
            const currentUser = this.props.children.props.session.getCurrentUser;
            // console.log('access_tags ni user : : ' + currentUser.id, currentUser.access_tags);
            // TODO :: this was removed && currentUser.privilege !== 0
            if (currentUser && currentUser.privilege === 0 && currentUser.access_tags.includes("EXCEEDED_IMPRESSIONS")) {
                console.log('Exceeded_Impressions');
                this.setState({ openModal: true });
            }
            if (currentUser && currentUser.tos && window.Appcues) {
                window.Appcues.identify(currentUser.id, { // Unique identifier for current user
                    name: currentUser.firstName + " " + currentUser.lastName, // current user's name
                    email: currentUser.email, // Current user's email
                    createdAt: currentUser.joinDate, // Unix timestamp of user signup date
                    planType: currentUser.privilege.toString(), // Current user’s plan type
                });

                /**
                 * Create Tag if exceeded for level 0 only if it doesn't exceed 
                 * ask only once then add '
                 * access_tag name for exceeded " exceeded_impressions "
                 * * YOU CAN PUT IT TO SIGN IN DETECTING IMPRESSION THEN ADDING TAG IF EXCEEDED OR NOT
                 * * IF NO TAG && LEVEL 0 = TRUE
                 * * 
                 */

            }
        }
    }



    // TODO ::Level 0 exceeds 100 impressions create modal passing through props scanning total impressions as props here
    // * get the impression in the app api.
    render() {

        var name = this.props.children ? this.props.children.props.session && this.props.children.props.session.getCurrentUser ? this.props.children.props.session.getCurrentUser.firstName + " " + this.props.children.props.session.getCurrentUser.lastName : "" : "";
        var email = this.props.children ? this.props.children.props.session && this.props.children.props.session.getCurrentUser ? this.props.children.props.session.getCurrentUser.email : "" : "";
        var privilege = this.props.children ? this.props.children.props.session && this.props.children.props.session.getCurrentUser ? this.props.children.props.session.getCurrentUser.privilege : "" : "";
        var pathname = this.props.children ? this.props.children.props.location && this.props.children.props.location.pathname ? this.props.children.props.location.pathname : "" : "";
        return (
            <div className="container">
                <div id="rewardPoints" className="flex-item"></div>
                {pathname === "/createaccount" ? <div></div> : <Header />}
                <aside className="sideBar">
                    <SideBar />
                </aside>
                <section className="main">
                    <div className="grid">
                        {this.props.children}
                        <ExceededModal {...this.props} closeModal={() => this.closeModal()} open={this.state.openModal} />
                    </div>
                    <Footer name={name} email={email} privilege={privilege} />
                </section>
            </div>
        )
    }
}

export default MainLayout;