import React, { Fragment } from 'react';
import withAuth from '../hoc/withAuth';
import { Link, Redirect } from 'react-router-dom';

class AudienceBuilderPages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        if(this.props.history.location.state != null){
            return (
                <Fragment>
                    <div className="grid page-container">
                        <Link to="/audience-builder" style={{float: 'left',margin: '15px 15px 0 0'}}><span className="fas fa-arrow-left" title="Back to Audience Builder"></span></Link>
                        <h1>{this.props.match.params.title.replace(/-/g, "/")}</h1>
                        <div dangerouslySetInnerHTML={{__html:this.props.history.location.state.pageContent}}></div>
                    </div>
                </Fragment>
            );
        } else {
            return <Redirect to='/audience-builder' />
        }
    }
}

export default withAuth(session => session && session.getCurrentUser)(AudienceBuilderPages);