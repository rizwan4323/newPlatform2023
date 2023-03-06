import React, {Fragment} from 'react';
import { withRouter } from 'react-router-dom';
import withAuth from './../../hoc/withAuth';
import { Helmet } from 'react-helmet';
const points = require('../../../Global_Values');

class AddStoreTokenURL extends React.Component {
    constructor(props){
        super();
        this.state = {
            store_name: "someonestore.myshopify.com"
        }
    }
    
    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    head() {
        return (
            <Helmet bodyAttributes={{class: "updateAccountPage"}}>
                <title>Connect to Shopify - Product List Genie</title>
            </Helmet>
        );
    }

    ConnectToStore(user_data, event){
        var x = {
            store_name: this.state.store_name.match(/[^\s.@/]([0-9a-zA-Z-.]*[0-9a-zA-Z-]+.)(com|store|org|net|edu|io)/g)[0],
            // user_email: user_data.email,
            user_id: 739656990766,
            rdr: window.location.href,
        };
        window.location.href= points.apiServer+`/auth?shop=${x.store_name}&id=${x.user_id}&rdir=${x.rdr}`;
    }
    
    render(){
        const { store_name } = this.state;
        return (
            <Fragment>
                {this.head()}
                <div className="column column_12_12">
                    <div className="signUp authForm">
                        <h1 className="dark_headline">
                            Connect to Shopify
                        </h1>
                        <div className="form_wrap updateAccountEmailForm">
                            <div className="form_row">
                                <div className="form_item">
                                    <div className="form_input">
                                        <input value={store_name} name="store_name" onChange={this.handleChange.bind(this)} type="text"/>
                                        <span className="bottom_border"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="text_center form_buttons">
                                <button className="btn" type="submit" onClick={this.ConnectToStore.bind(this, this.props.user_data)}>Connect Store</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default withAuth(session => session && session.getCurrentUser)(withRouter(AddStoreTokenURL));