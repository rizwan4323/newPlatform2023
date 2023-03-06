import React, {Fragment} from 'react';
import {Mutation} from 'react-apollo';
import { ADD_STORE_TOKEN, GET_CURRENT_USER } from './../../queries';
import { withRouter } from 'react-router-dom';
import withAuth from './../../hoc/withAuth';
import toastr from 'toastr';
import { Helmet } from 'react-helmet';
import queryString from 'query-string';
const points = require('../../../Global_Values');

const initialState = {
    newEmail: '',
    token: '',
    shop_name: '',
    error: '',
    isDone: false
}

class AddStoreTokenRedirect extends React.Component {
    constructor(props){
        super();
        this.state = {
            ...initialState
        }
        this.togglePointsAnimation = this.togglePointsAnimation.bind(this);
    }
    componentDidMount(){
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut":0,
            "extendedTimeOut":0,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        this.updatePoints();
    }
    clearState() {
        // this.setState({...initialState})
        const values = queryString.parse(this.props.location.search)
        this.setState.shop_name =  values.shop_name
        this.setState.token =  values.token
    }
    handleAddTokenUrl(addStoreToken) {
        this.setState({ isDone: true }, () => {
            addStoreToken().then(async ({data}) => {
                toastr.clear();
                toastr.success('Store Connected!', 'Saved!');
                this.clearState();
                window.location.href = queryString.parse(this.props.location.search).rdir;
            }).catch(error => {
                this.setState({
                    error: 'An error has occured.'
                })
            });
        });
    }

    getURLParams() {
        const values = queryString.parse(this.props.location.search)
        return values.search
    }

    head() {
        return (
            <Helmet bodyAttributes={{class: "updateAccountPage"}}>
                <title>Connect to Shopify - Product List Genie</title>
            </Helmet>
        );
    }

    updatePoints(){
        if(!this.props.session.getCurrentUser.store_token){
            var id = this.props.session.getCurrentUser.id;
            var value = points.points_connectToStore;
            var payload = {"query":`mutation{\n  updateRewardPoints(id:\"${id}\", source: "Connect To Shopify", reward_points:${value}){\n    points\n    date\n  }\n}`,"variables":null}
            fetch(points.clientUrl+'/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                this.togglePointsAnimation(value);
                points.playSoundEffect();
            });
        }
    }

    togglePointsAnimation(pts){
        var rewardPoints = document.getElementById('rewardPoints');
        rewardPoints.innerHTML = `+${pts} points`;
        rewardPoints.classList.add("points-anim")
        setTimeout(function() {
            rewardPoints.classList.toggle("points-anim")
        }.bind(), 4000);
    }

    encode(str){
        return new Buffer(str).toString('base64');
    }
  
    render(){
        const { token, shop_name, isDone } = this.state;
        return (
            <Fragment>
                {this.head()}
                <div className="column column_12_12">
                    <div className="signUp authForm">
                        <h1 className="dark_headline">
                            Granting your wish
                        </h1>
                        <Mutation 
                            mutation={ADD_STORE_TOKEN}
                            variables={{
                                id: this.props.session.getCurrentUser.id,
                                store_token: this.encode(queryString.parse(this.props.location.search).store_token),
                                store_url: queryString.parse(this.props.location.search).store_url,
                                store_phone: queryString.parse(this.props.location.search).store_phone,
                                store_location_id: queryString.parse(this.props.location.search).store_locationid
                            }}
                            refetchQueries={() => [
                                { query: GET_CURRENT_USER }
                            ]}>
                            {(addStoreToken, { data, loading, error }) => {
                                if(!isDone) this.handleAddTokenUrl(addStoreToken);
                                return(
                                    <div>
                                        Connecting...
                                    </div>
                                )
                            }}
                        </Mutation>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default withAuth(session => session && session.getCurrentUser)(withRouter(AddStoreTokenRedirect));