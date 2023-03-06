import React from 'react';
import withAuth from './../hoc/withAuth';
import { Helmet } from 'react-helmet';
import FetchProducts from '../components/fetchProducts';
import FetchProductsDEV from '../components/fetchProductsDEV';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>{this.props.match.params.niches.replace(/-/g, " ").toUpperCase()} - Product List Genie</title>
            </Helmet>
        );
    }
    
    render() {
        return (
            <section className="dashboard">
                {this.head()}
                <div className="grid">
                    {(() => {
                        if(this.props.session.getCurrentUser.access_tags.includes("dev")){
                            return <FetchProductsDEV userData={this.props} />;
                        } else {
                            return <FetchProducts userData={this.props} />
                        }
                    })()}
                </div>
            </section>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(Dashboard);