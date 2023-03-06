import React from 'react';
import classNames from 'classnames';
import { Mutation } from 'react-apollo';
import { SIGNUP_USER } from './../../queries';
import { withRouter } from 'react-router-dom';
import * as Cookies from 'es-cookie';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import queryString from 'query-string';
import ContentSlider from '../../components/contentSlider';
const points = require('../../../Global_Values');


const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    kartra: '',
    password: '',
    passwordConfirm: '',
    error: '',
    passwordMatch: null
}

class Signup extends React.Component {

    constructor(props) {
        super();
        this.state = {
            ...initialState,
            masterId: "",
            arr1: true
        }
    }

    componentDidMount() {
        const values = queryString.parse(this.props.location.search)

        if (values.invites) {
            // we can detect here if sid is already registered then redirect to signin
            if (this.props.session === undefined) {
                // no user at all 
                this.setState({
                    email: values.sid
                })
            } else {
                console.log('has a user', this.props.session)
            }
        }
        if (values.invites !== null && values.email) {
            this.setState({
                email: values.email,
                kartra: values.email,
                firstName: values.firstname,
                lastName: values.lastname
            })
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

    confirmPW() {
        const { password, passwordConfirm } = this.state
        const isMatch = password !== passwordConfirm && password.length <= 7;
        this.setState({ passwordMatch: isMatch });
    }

    handleSubmit(event, signupUser) {
        event.preventDefault();
        signupUser().then(async ({ data }) => {
            Cookies.set('token', data.signupUser.token);
            await this.props.refetch();
            this.clearState();
            const values = queryString.parse(this.props.location.search)
            if (values.invites) {
                console.log('has incites go to this',decodeURIComponent(values.accept_link));
                window.open(`${decodeURIComponent(values.accept_link)}`, "_self");
            }else{
            }
            this.props.history.push('/dashboard');
        }).catch(error => {
            this.setState({
                error: 'Your email is already taken. Please adjust and try again.'
            })
        });

    }

    validateForm() {
        const { firstName, lastName, email, password, passwordConfirm } = this.state
        this.state;
        const isInvalid = !firstName || !lastName || !email || !password || password !== passwordConfirm || password.length <= 7;
        return isInvalid;
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "signUpPage" }}>
                <title>Join now! - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        this.state;
        const { firstName, lastName, kartra, email, password, passwordConfirm } = this.state
        const SlideSettings = {
            count: 1,
            autoPlay: false,
            timeToSlide: 500,
            showDots: false,
            pauseOnMouseOver: true,
            dotsLocation: 'left'
        }

        return (
            <div className="center-vertical-parent funnel" style={{ height: '100vh' }}>
                {this.head()}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .sideBar, header, Footer {
                        display: none;
                    }
                    .container {
                        padding: 0;
                    }
                    body {
                        background-color: #262f36;
                        background-image: none;
                    }
                `}} />
                {/* start new code */}
                <div className="center-vertical" style={{ height: '100%' }}>
                    <div className="column column_10_12">
                        <div className="column column_8_12" style={{ backgroundColor: '#161f26', padding: 50 }} id="content-slider">
                            <div className="custom-content-slider">
                                <ContentSlider {...SlideSettings}>
                                    <section className="container">
                                        <img src="/assets/graphics/signup-first.png" width="100%" style={{ maxWidth: 500, display: 'block' }} />
                                        <label className="color-white clear" style={{ fontSize: '1.5em', margin: '20px 0' }}>Start your Ecommerce business and increase your sales.</label>
                                    </section>
                                    <section className="container" />
                                </ContentSlider>
                            </div>
                        </div>
                        <div className="column column_4_12" style={{ backgroundColor: '#212a31', padding: 40, height: '100%' }} id="signup-form">
                            <div className="row-separator">
                                <label className="font-questrial-light color-green" style={{ fontSize: '3em' }}>Join Now</label>
                            </div>
                            <Mutation mutation={SIGNUP_USER} variables={{ firstName, lastName, email, password, kartra }}>
                                {(signupUser, { data, loading, error }) => {
                                    return (
                                        <form className="signup-container" onSubmit={event => this.handleSubmit(event, signupUser)} style={{ caretColor: 'green' }}>
                                            <div className="row-separator">
                                                <div className={classNames({ 'error-label': this.state.error != '' })}>
                                                    {this.state.error}
                                                </div>
                                            </div>
                                            <div className="row-separator">
                                                <input type="text" name="firstName" placeholder="First Name" value={firstName} onChange={this.handleChange.bind(this)} />
                                            </div>
                                            <div className="row-separator">
                                                <input type="text" name="lastName" placeholder="Last Name" value={lastName} onChange={this.handleChange.bind(this)} />
                                            </div>
                                            <div className="row-separator">
                                                <input type="email" name="email" placeholder="Email" value={email} onChange={this.handleChange.bind(this)} />
                                            </div>
                                            <div className="row-separator">
                                                <label className="font-roboto-light color-dark-white" style={{ fontSize: '0.875em' }}>Please note that you will not be able to change this after your registration.</label>
                                            </div>
                                            <div className="row-separator">
                                                <input type="password" name="password" placeholder="Password" value={password} onChange={this.handleChange.bind(this)} />
                                            </div>
                                            <div className="row-separator">
                                                <label className="font-roboto-light color-dark-white" style={{ fontSize: '0.875em' }}>Password must be a minimum of 8 characters in length.</label>
                                            </div>
                                            <div className="row-separator">
                                                <input type="password" name="passwordConfirm" placeholder="Password confirm" value={passwordConfirm} onChange={this.handleChange.bind(this)} onBlur={this.confirmPW.bind(this)} />
                                            </div>
                                            <button className="btn-success stretch-width" type="submit" disabled={loading || this.validateForm()}>Register</button>
                                        </form>
                                    );
                                }}
                            </Mutation>
                            <div className="text-center font-questrial-bold" style={{ marginTop: 30 }}>
                                <label className="color-white">Already have an account?</label> <u><NavLink to="/signin" style={{ color: '#ef8805' }}>Sign-in</NavLink></u>
                            </div>
                        </div>
                    </div>
                </div>
                {/* end new code */}
                {/* old code */}
                {/* <div className="signUp authForm">
                    <h1 className="dark_headline">
                        Join now
                    </h1>
                    <Mutation mutation={SIGNUP_USER} variables={{ firstName, lastName, email, password, kartra }}>
                        {(signupUser, { data, loading, error }) => {
                            return (
                                <form onSubmit={event => this.handleSubmit(event, signupUser)}>
                                    <div className="form_wrap">
                                        <div className="form_row">
                                            <div className="form_item">
                                                <div className="form_input">
                                                    <input type="text" name="firstName" placeholder="First Name" value={firstName} onChange={this.handleChange.bind(this)} />
                                                    <span className="bottom_border"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form_row">
                                            <div className="form_item">
                                                <div className="form_input">
                                                    <input type="text" name="lastName" placeholder="Last Name" value={lastName} onChange={this.handleChange.bind(this)} />
                                                    <span className="bottom_border"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form_row">
                                            <div className="form_item">
                                                <div className="form_input">
                                                    <input type="email" name="email" placeholder="Email" value={email} onChange={this.handleChange.bind(this)} />
                                                    <span className="bottom_border"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form_row">
                                            <div className="form_item">
                                                <div className="helperText">
                                                    Please note that you will not be able to change this after your registration.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form_row">
                                            <div className={classNames({ 'error-label': true, 'passwordMatch': !this.state.passwordMatch })}>
                                                Please check that your passwords match and are at least 8 characters.
                                            </div>
                                            <div className="form_item">
                                                <div className="form_input">
                                                    <input type="password" name="password" placeholder="Password" value={password} onChange={this.handleChange.bind(this)} />
                                                    <span className="bottom_border"></span>
                                                </div>
                                                <div className="helperText">
                                                    Password must be a minium of 8 characters in length.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form_row">
                                            <div className="form_item">
                                                <div className="form_input">
                                                    <input type="password" name="passwordConfirm" placeholder="Password confirm" value={passwordConfirm} onChange={this.handleChange.bind(this)} onBlur={this.confirmPW.bind(this)} />
                                                    <span className="bottom_border"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="formBottomLinks">
                                            <p>
                                                Already have an account? <NavLink to="/signin">Sign-in</NavLink>
                                            </p>
                                        </div>
                                        <div className="form_buttons">
                                            <button className="btn" type="submit"
                                                disabled={loading || this.validateForm()}>
                                                Register</button>
                                        </div>
                                    </div>
                                </form>
                            );
                        }}
                    </Mutation>
                </div> */}
            </div>
        )
    }
}

export default withRouter(Signup);