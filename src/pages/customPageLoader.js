import React from 'react';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
// import Loading from '../components/loading';
import { Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import { GET_ADMIN_PAGE_CONTENT } from './../queries';
// const points = require('../../Global_Values');

class CustomPageLoader extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    head(title) {
        return (
            <Helmet>
                <title>Product List Genie</title>
            </Helmet>
        );
    }
    
    render() {
        return (
            <div className="page-container">
                {this.head()}
                <Query query={GET_ADMIN_PAGE_CONTENT} variables={{content_id: this.props.match.params.content_id}} >
                    {({data, loading, refetch, err}) => {
                        if(loading) return null;

                        if(!data.getCustomPageData){
                            return <Redirect to="/404" />
                        }
                        
                        if(data.getCustomPageData.length == 0){
                            return (
                                <div className="text-center">
                                    <h1>An error has occurred.<br/>Please reload the page.</h1>
                                </div>
                            );
                        }

                        if(data.getCustomPageData.length != 0){
                            return <div dangerouslySetInnerHTML={{__html: data.getCustomPageData.page_content}} />
                        }

                        return null;
                    }}
                </Query>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(CustomPageLoader);