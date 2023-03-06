import React from 'react';
import classNames from 'classnames';
import { Mutation } from 'react-apollo';
import { RESET_PASSWORD } from './../../queries';
import { withRouter } from 'react-router-dom';
import * as Cookies from 'es-cookie';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';

const initialState = {
    email: '',
    error: '',
    content: false
}

class ForgotPassword extends React.Component {

    constructor(props) {
        super();
        this.state = {
            ...initialState
        }
    }

    clearState() {
        this.setState({ ...initialState })
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event, passwordReset) {
        event.preventDefault();
        passwordReset().then(async ({ data }) => {
            this.setState({content: true})
            // this.clearState();
        }).catch(error => {
            this.setState({
                error: error.graphQLErrors.map(x => x.message)
            })
            console.error("ERR =>", error.graphQLErrors.map(x => x.message));
        });
    }

    validateForm() {
        const { email } = this.state
        this.state;
        const isInvalid = !email;
        return isInvalid;
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "accountRecoveryPage" }}>
                <title>Account recovery - Product List Genie</title>
            </Helmet>
        );
    }

    render() {

        const { email } = this.state
        this.state;

        return (
            <div className="column column_12_12">
                {this.head()}
                <div className="signUp authForm">

                    <h1 className="dark_headline">
                        Account recovery
                    </h1>

                    {!this.state.content ?

                        <Mutation mutation={RESET_PASSWORD} variables={{ email }}>

                            {(passwordReset, { data, loading, error }) => {

                                return (

                                    <form className="form" onSubmit={event => this.handleSubmit(event, passwordReset)}>

                                        <div className="form_wrap">

                                            <p>Please enter the email address associated with your account and we will email you a temporary password.</p>

                                            <div className={classNames({ 'error-label': this.state.error != '' })}>
                                                {this.state.error}
                                            </div>

                                            <div className="form_row">

                                                <div className="form_item">
                                                    <div className="form_input">
                                                        <input type="email" name="email" placeholder="Email" value={email} onChange={this.handleChange.bind(this)} />
                                                        <span className="bottom_border"></span>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="formBottomLinks">
                                                <p>
                                                    Remembered your password? <NavLink to="/signin">Sign-in</NavLink>
                                                </p>
                                            </div>

                                            <div className="form_buttons">
                                                <button type="submit" className="btn"
                                                    disabled={loading || this.validateForm()}>
                                                    Reset</button>
                                            </div>

                                        </div>

                                    </form>

                                );
                            }}

                        </Mutation>
                        :
                        <div>
                            <p>Please Check Your Email (spam folder) for the Temporary Password</p>

                            <p>
                                <NavLink to="/signin">Sign-in</NavLink>
                            </p>
                        </div>

                    }

                </div>
            </div>
        )
    }
}

export default withRouter(ForgotPassword);