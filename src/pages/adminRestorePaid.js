import React from 'react';
import toastr from 'toastr';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
import { GET_USERS_OF_FUNNEL_ORDERS } from '../queries';
import { Query } from 'react-apollo';
import Loading from '../components/loading';
import SearchField from '../components/searchField';
const points = require('../../Global_Values');

const page_initial_state = {
    reference_id_input: "",
    reference_id: ""
}

class AdminRestorePaid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...page_initial_state
        }
    }

    componentDidMount() {
        toastr.options = points.toastrInitialize();
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Restore Paid - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const state = this.state;
        return (
            <div className="admin funnel">
                {this.head()}
                <div className="newPageHeader">
                    <div className="column column_4_12">
                        <span className="hide-in-desktop float-left" style={{padding: 15}} />
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>Restore Unnecessary Mark All as Paid</h4>
                    </div>
                    <span className="clear" />
                </div>
                <div className="page-container">
                    <div className="column column_4_12">
                        &nbsp;
                    </div>
                    <div className="column column_4_12">
                        &nbsp;
                    </div>
                    <div className="column column_4_12" style={{ position: "relative", padding: 1 }}>
                        <SearchField
                            name="reference_id_input"
                            value={state.reference_id_input}
                            placeHolder="Enter Mark as Paid Reference ID"
                            tooltip="You can find reference id in payout email"
                            containerClassName="stretch-to-mobile"
                            onSubmit={value => this.setState({ reference_id: value, reference_id_input: value })}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AdminRestorePaid);