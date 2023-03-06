import React, { Fragment } from 'react';
import classNames from 'classnames';
import { Mutation } from 'react-apollo';
import { ADD_STORE_TOKEN, GET_ALL_USERS, GET_USER_PROFILE } from './../../queries';
import { withRouter } from 'react-router-dom';
import toastr from 'toastr';

const initialState = {
    store_token: '',
    store_url: '',
    error: ''
}

class AddStoreTokenMutation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        }
    }

    componentDidMount() {
        if (this.props.profile) {
            this.setState({
                store_token: this.props.profile.store_token,
                store_url: this.props.profile.store_url
            });
        }
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
    }

    handleEditorChange(store_token) {
        this.setState({
            store_token,
            store_url
        });
    }

    handleSaveToken(event, addStoreToken) {
        event.preventDefault();
        addStoreToken().then(async ({ data }) => {
            toastr.clear();
            toastr.success('We have updated your profile!', 'Saved!');
        }).catch(error => {
            this.setState({
                error: error.graphQLErrors.map(x => x.message)
            })
            console.error("ERR =>", error.graphQLErrors.map(x => x.message));
        });
    }



    render() {
        const { store_token, store_url } = this.state
        this.state;
        return (
            <Fragment>

                <Mutation
                    mutation={ADD_STORE_TOKEN}
                    variables={{ id: this.props.session.getCurrentUser.id, store_token: store_token, store_url: store_url }}
                    refetchQueries={() => [
                        { query: GET_USER_PROFILE }
                    ]}>

                    {(addStoreToken, { data, loading, error }) => {

                        return (

                            <form className="form" onSubmit={event => this.handleSaveToken(event, addStoreToken)}>

                                <div className="form_wrap editBioForm">

                                    <div className={classNames({ 'error-label': this.state.error != '' })}>
                                        {this.state.error}
                                    </div>

                                    <div className="form_row">
                                    {/* <input type="text" value={store_token}/> */}
                                    <input type="text" name="store_token" placeholder="Token" value={store_token} />
                                    <input type="text" name="store_url" placeholder="Token" value={store_url} />
                                    </div>

                                    <div className="form_buttons">
                                        <button type="submit" className="btn"
                                            disabled={loading}>
                                            Save changes</button>
                                    </div>

                                </div>

                            </form>

                        );
                    }}

                </Mutation>
            </Fragment>
        )
    }
}

export default withRouter(AddStoreTokenMutation);