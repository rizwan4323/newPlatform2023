import React from 'react';
import toastr from 'toastr';
import withAuth from '../hoc/withAuth';
import Loading from '../components/loading';
import Popup from 'reactjs-popup';
import { Query, Mutation } from 'react-apollo';
import { SEARCH_USERS, REDUCE_FULFILLMENT_CREDIT } from '../queries';
const points = require('../../Global_Values');

const initialize = {
    search: '', // handle onchange of textbox
    searchVal: '', // once button is click transfer search value here
    userID: '',
    userName: '',
    description: 'Refunded',
    refundPrice: ''
}

class AdminFulfillmentRefund extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialize
        }
    }

    componentDidMount() {
        toastr.options = {
            "preventDuplicates": true,
            "progressBar": true,
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut": 3000,
            "extendedTimeOut": 2000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    }

    handleOnChange(event){
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [name]: value
        })
    }

    handleKeyUp(event){
        if(event.keyCode === 13){
            var that = this;
            setTimeout(function() {
                that.searchUser();
            }, 100);
        }
    }

    searchUser(){
        this.setState({
            searchVal: this.state.search
        })
    }

    selectUser(id, name){
        this.setState({
            userID: id,
            userName: name
        })
    }

    reduceCredits(reduceCredits){
        reduceCredits().then(({ data }) => {
            toastr.clear();
            toastr.success(this.state.userName+" Refunded Successfully.","Success");
            this.setState({
                ...initialize
            })
        }).catch(error => {
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    render() {
        const state = this.state;

        return (
            <div className="admin page-container">
                <h1 className="one-line-ellipsis"> Fulfillment Refund </h1>
                <div className="column column_12_12">
                    <div className="column column_4_12">
                        <div className="product-card">
                            <div className="product-details">
                                <h3>Search</h3>
                                <div className="form_wrap">
                                    <div className="form_row">
                                        <div className="form_item">
                                            <div className="form_input">
                                                <input type="text" placeholder="search by email, kartra, first name, last name" name="search" value={state.search} onChange={event => this.handleOnChange(event)} onKeyUp={this.handleKeyUp.bind(this)} />
                                                <span className="bottom_border"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form_row">
                                        <div className="form_item">
                                            <div className="form_input form_buttons">
                                                <button className="btn stretch-width" onClick={() => this.searchUser()}>Search</button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* User Result */}
                                    <div className="form_row">
                                        <div className="form_item">
                                            <div className="form_input form_buttons">
                                                <Query query={SEARCH_USERS} variables={{
                                                    search: state.searchVal
                                                }}>
                                                    {({ data, loading, refetch, error }) => {
                                                        if (loading) {
                                                            return (
                                                                <div className="text-center">
                                                                    <Loading height={150} width={150} />
                                                                </div>
                                                            );
                                                        }
                                                        
                                                        if (data.getSearchedUsers.length == 0) {
                                                            return (
                                                                <div className="text-center">
                                                                    <span className="no-result">{state.searchVal ? "No Result Found." : void 0}</span>
                                                                </div>
                                                            );
                                                        }

                                                        this.refetch = refetch;

                                                        return data.getSearchedUsers.map((user, user_index) => {
                                                            var cn = "product-card";

                                                            if (state.selectedStoreID == user.id) {
                                                                cn += " card-active"
                                                            }
                                                            
                                                            return (
                                                                <div className={cn} key={user_index}>
                                                                    <div className="product-details one-line-ellipsis">
                                                                        <div style={{fontSize: 12}}>
                                                                            <strong>ID: </strong>{user.id}
                                                                        </div>
                                                                        <strong>{user.store_url}</strong> <br />
                                                                        {user.firstName} {user.lastName} <br />
                                                                        <span style={{fontSize: 12}}><strong>Credits: </strong>{"$"+points.commafy(user.plg_balance.toFixed(2))}</span>
                                                                        <div className="float-right" style={{ marginTop: 5 }}>
                                                                            <span className="clickable" onClick={() => this.selectUser(user.id, user.firstName + " " + user.lastName, refetch)}>
                                                                                Select &nbsp;<span className="fas fa-arrow-right"></span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        });
                                                    }}
                                                </Query>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column column_8_12">
                        <div className="product-card">
                            <div className="product-details" style={{overflow: 'hidden'}}>
                                {state.searchVal && state.userName ?
                                    <div>
                                        <h3>Refund for {state.userName}</h3>
                                        <div className="form_wrap">
                                            <div className="column column_6_12">
                                                <div className="form_row">
                                                    <div className="form_item">
                                                        <div className="form_input">
                                                            <label>Description:</label>
                                                            <input type="text" name="description" value={state.description} onChange={event => this.handleOnChange(event)} />
                                                            <span className="bottom_border"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_6_12">
                                                <div className="form_row">
                                                    <div className="form_item">
                                                        <div className="form_input">
                                                            <label>Refund Price:</label>
                                                            <input type="text" name="refundPrice" value={state.refundPrice} onChange={event => this.handleOnChange(event)} />
                                                            <span className="bottom_border"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_12_12 text-center">
                                                <div className="form_row">
                                                    <div className="form_buttons">
                                                        <Mutation
                                                            mutation={REDUCE_FULFILLMENT_CREDIT}
                                                            variables={{
                                                                id: state.userID,
                                                                cost: parseFloat(state.refundPrice),
                                                                description: state.description
                                                            }}>
                                                            {(reduceCredits, { data, loading, error }) => {
                                                                return <button className="btn" onClick={() => this.reduceCredits(reduceCredits)} disabled={loading}>Submit</button>
                                                            }}
                                                        </Mutation>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                :
                                    <h3 className="text-center">Search and select user to display the form</h3>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AdminFulfillmentRefund);