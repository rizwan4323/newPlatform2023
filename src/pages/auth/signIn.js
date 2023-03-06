import React from 'react';
import { Mutation } from 'react-apollo';
import { SIGNIN_USER } from './../../queries';
import { withRouter } from 'react-router-dom';
import * as Cookies from 'es-cookie';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';
import Loading from '../../components/loading';
import LoadingPage from '../../components/loadingPage';
import queryString from 'query-string';
const points = require('../../../Global_Values');

const initialState = {
    email: '',
    password: '',
    error: ''
}

class Signin extends React.Component {

    constructor(props) {
        super();
        this.state = {
            page_is_loading: true,
            ...initialState,
            cookie: '',
            accept_link: "",
            showLoading: false
        }
    }

    toggleLoading() {
        this.setState({
            showLoading: !this.state.showLoading
        })
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

    decode(str) {
        return atob(str);
    }

    componentDidMount() {
        localStorage.removeItem(points.plg_domain_secret); // remove login as anonymous flag
        localStorage.removeItem("temp_token");
        localStorage.removeItem("temp_" + points.cookie_name);
        localStorage.removeItem("temp_redirect");
        const values = queryString.parse(this.props.location.search)

        if (values.invites) {
            // we can detect here if sid is already registered then redirect to signin
            this.setState({
                accept_link: values.accept_link,
                email: values.email
            })
        }
        if (this.props.match.params.email && this.props.match.params.password) {
            this.setState({
                email: this.props.match.params.email,
                password: this.decode(this.props.match.params.password)
            }, () => this.generateSessionID(true));
        } else {
            this.generateSessionID();
        }
    }

    handleSubmit(event, signinUser) {
        this.setState({ error: '' })
        event.preventDefault();
        this.toggleLoading();
        
        signinUser().then(async ({ data }) => {
            // criterio
            window.criteo_q.push(
                { event: "setAccount", account: 58274 },
                { event: "setEmail", email: this.state.email },
                { event: "setData", signin: "true" },
                { event: "viewHome" }
            );
            // end criterio

            // Start once login cookie
            Cookies.remove(points.cookie_name);
            Cookies.set(points.cookie_name, this.state.cookie);
            // End once login cookie
            Cookies.set('token', data.signinUser.token);
            await this.props.refetch();
            this.clearState();
            if (this.state.accept_link !== "") {
                window.open(decodeURIComponent(this.state.accept_link), "_self");
            } else {                
                if (this.props.match.params.email && this.props.match.params.password) {
                    // if reset password
                    this.props.history.push('/account');
                } else {
                    // if not reset password
                    this.props.history.push('/dashboard');
                }
            }
        }).catch(error => {
            this.setState({
                error: error.graphQLErrors.map(x => x.message)
            })
            this.toggleLoading();
            console.error("ERR =>", error.graphQLErrors.map(x => x.message));
        });
    }

    validateForm() {
        const { email, password } = this.state
        this.state;
        const isInvalid = !email || !password;
        return isInvalid;
    }

    generateSessionID(isResetPassword) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < possible.length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        this.setState({ cookie: text, page_is_loading: false }, () => {
            if (isResetPassword) document.getElementById("submit-login").click()
        });
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "logInPage" }}>
                <title>LogIn - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const { email, password, cookie, page_is_loading } = this.state;
        this.state;
        if (page_is_loading) return <LoadingPage />
        return (
            <div className="column column_12_12 funnel">
                {this.head()}
                <div className="column column_7_12 hide-in-mobile">
                    <div className="column column_7_12 login-first-column">
                        <div>
                            <h1 className="font-questrial-light color-white">LET THE GENIE GRANT YOUR WISHES.</h1>
                            <p className="font-roboto-light color-dark-white" style={{ fontSize: '1.2em' }}>Product List Genie is your best companion for researching the Hottest, Trending, and Winning Products Online.</p>
                            {/* <button className="btn-warning" style={{marginTop: 20, border: 'none', padding: '20px 30px'}}>WATCH OUR VIDEO</button> */}
                        </div>
                    </div>
                    <div className="column column_5_12" style={{ marginTop: '4em', padding: 0 }}>
                        <img src="/assets/graphics/genie-login.png" style={{ maxWidth: '100%' }} />
                    </div>
                </div>
                <div className="column column_5_12">
                    <div className="column column_12_12 signin-container">
                        <div style={{ marginTop: '7em' }}>
                            <img className="float-right" src="/assets/graphics/logo.png" style={{ padding: 20, maxWidth: '100%' }} />
                            <div className="clear" style={{ backgroundColor: '#212a31', padding: 35, marginTop: 10, borderRadius: 5 }}>
                                <label className="font-questrial-light color-green" style={{ fontSize: '3em' }}>Sign in</label>
                                <p className="font-roboto-light color-dark-white" style={{ fontSize: '1.2em', marginTop: 5 }}>Enter your valid Email and Password.</p>
                                <Mutation mutation={SIGNIN_USER} variables={{ email, password, cookie }}>
                                    {(signinUser, { data, loading, error }) => {
                                        return (
                                            <form className="form" onSubmit={event => this.handleSubmit(event, signinUser)} style={{ caretColor: 'green' }}>
                                                <input type="email" name="email" placeholder="Your Email Address" value={email} onChange={this.handleChange.bind(this)} style={{ marginTop: 10 }} />
                                                <input type="password" name="password" placeholder="Password" value={password} onChange={this.handleChange.bind(this)} style={{ marginTop: 10 }} />
                                                {/* <div style={{marginTop: 10}}>
                                                    <input id="remember_me" type="checkbox" style={{width: 'fit-content'}} />
                                                    <label className="cursor-pointer color-white" htmlFor="remember_me">Remember me</label>
                                                </div> */}
                                                {this.state.error &&
                                                    <div className="text-center" style={{ marginTop: 10, padding: '10px 15px', borderRadius: 3, color: '#d63031', width: '100%', backgroundColor: '#29343a' }}>
                                                        <label>{this.state.error}</label>
                                                    </div>
                                                }
                                                {(() => {
                                                    if (this.state.showLoading) {
                                                        return <Loading width={50} height={50} />
                                                    } else {
                                                        return <button id="submit-login" type="submit" className="stretch-width btn-success" style={{ marginTop: 10 }}>SIGN IN</button>
                                                    }
                                                })()}
                                            </form>
                                        );
                                    }}
                                </Mutation>
                                <div className="text-center font-questrial-bold" style={{ marginTop: 50 }}>
                                    <u>
                                        <NavLink to="/account-recovery" className="color-white">Account Recovery</NavLink>
                                    </u>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column column_12_12 signin-container font-small" style={{ marginTop: 20 }}>
                        <div className="text-center color-white">
                            <NavLink className="color-white" to="/cancellation-policy">Cancellation Policy</NavLink> &nbsp; | &nbsp;
                            <NavLink className="color-white" to="/privacy-policy">Privacy Policy</NavLink> &nbsp; | &nbsp;
                            <NavLink className="color-white" to="/terms">T&C's</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Signin);
