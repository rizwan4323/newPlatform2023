import React from 'react';
import ReactDOM from 'react-dom';
import withAuth from '../hoc/withAuth';
import Popup from 'reactjs-popup';
import toastr from 'toastr';
import { GET_ADMIN_SETTINGS, GET_ALL_USERS, SET_SALES_REP, ADMIN_GET_DUPLICATE_STORE, UPDATE_KARTRA_EMAIL, MANUAL_RESET_PASSWORD, UPDATE_PRIVILEGE, UPDATE_EMAIL, PUSH_NOTIFICATION, ADD_STORE_TOKEN, UPDATE_FUNNEL_GENIE_ACCESS, DISCONNECT_FUNNEL_DOMAIN, ADD_OR_REMOVE_PLG_TAG, ADD_DEALER_ID } from './../queries';
import { Query, Mutation } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loading from '../components/loading';
import Form from '../components/form';
import Input from '../components/input';
import moment from 'moment';
import Tooltip from '../components/tooltip';
import ShowFilter from '../components/showFilter';
import * as Cookies from 'es-cookie';
const jwt = require('jsonwebtoken');
const points = require('../../Global_Values');

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            pageSize: 20,
            searchValue: "",
            sortPrivilege: "",
            selectedPrivilege: "",
            fromDate: this.generateDateNow(0),
            toDate: this.generateDateNow(0),
            sortMessage: 'Desc',
            salesRepId: "",
            note: '',
            displayDate: "today",
            search_text: '',
            kartraEmail: '',
            updatedPrivilegeValue: null,
            privateMessage: '',
            add_new_tag: false,
            add_new_tag_name: "",
            new_email: "",
            dealer_list: [],
            updatedDealerId: null
        }
    }

    // return date yyyy-MM-dd
    generateDateNow(days) {
        var pastDate = points.getPastDate(days);
        return pastDate.getUTCFullYear() + "-" + ((pastDate.getUTCMonth() + 1).toString().length == 1 ? '0' : '') + (pastDate.getUTCMonth() + 1) + "-" + (pastDate.getUTCDate().toString().length == 1 ? '0' : '') + pastDate.getUTCDate()
    }

    componentDidMount() {
        toastr.options = points.toastrInitialize();

        // get list of dealers
        points.customFetch("https://freeviralproducts.com/graphql", "POST", {
            query: `
              {
                everyDealer {
                  name
                  phone
                  email                  
                  id
                }
              }
              
            `
        }, result => {
            console.log(result);
            if (result.data) {

                const data = result.data.everyDealer;

                if (data.length != 0) {
                    this.setState({
                        dealer_list: data
                    })
                }

            }
        });

    }

    liveLinkChange(event) {
        this.setState({ liveLink: event.target.value });
    }

    toggleLiveMode(live, refetch, event) {
        var link = document.getElementById("liveLink").value;
        if (link || !live) {
            var payload = { "query": `mutation{\n  updateLiveMode(isLive:${live}, liveLink: "${link}"){\n    isLive\nliveLink  }\n}`, "variables": null }
            fetch(points.clientUrl + '/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
                .then(response => response.json())
                .then(res => {
                    refetch();
                });
        } else {
            toastr.clear();
            toastr.warning('Facebook live link cannot be empty', 'Facebook Link Missing');
        }
    }

    handleKeyUp(event) {
        if (event.keyCode === 13) {
            this.handleSearch();
        }
    }

    handleKartraEmaiLChange(event) {
        this.setState({
            kartraEmail: event.target.value
        })
    }

    handleChange(event) {
        this.setState({ search_text: event.target.value })
    }

    handleSearch(event) {
        this.setState({
            pageNumber: 1,
            disablePrev: true,
            displayDate: 'other',
            fromDate: '',
            toDate: '',
            sortPrivilege: '',
            selectedPrivilege: '',
            searchValue: this.state.search_text
        })
    }

    handleSortPrivilege(event) {
        this.setState({
            sortPrivilege: event.target.value
        })
    }

    handleSelectedPrivilege(event) {
        this.setState({
            selectedPrivilege: event.target.value
        })
    }

    handleFromDate(event) {
        this.setState({
            fromDate: event.target.value
        })
    }

    handleToDate(event) {
        this.setState({
            toDate: event.target.value
        })
    }

    changePageNumber(isNext) {
        var currentPage = this.state.pageNumber;
        this.setState({
            pageNumber: isNext ? currentPage + 1 : currentPage - 1
        })
    }

    checkNext(total) {
        var pageSize = this.state.pageNumber * this.state.pageSize;
        return total <= pageSize;
    }

    sortMessage() {
        if (this.state.sortMessage == "Asc")
            this.setState({ sortMessage: "Desc" })
        else
            this.setState({ sortMessage: "Asc" })
    }

    isFilterEnable() {
        if (this.state.searchValue || this.state.selectedPrivilege || (this.state.fromDate && this.state.toDate))
            return true;
        else
            return false;
    }

    saveSalesRep(setSalesRep, refetch, event) {
        this.setState({ salesRepId: event.target.value }, () => {
            setSalesRep().then(async ({ data }) => {
                toastr.clear();
                toastr.success("Successfully saved sales rep", "Saved!");
                refetch();
            }).catch(error => {
                this.setState({
                    error: error.graphQLErrors.map(x => x.message)
                })
                console.error("ERR =>", error.graphQLErrors.map(x => x.message));
            });
        })
    }

    addNotes(id, refetch, index, event) {
        var note = document.getElementById("note").value;
        var payload = { "query": `mutation{\n  addNotes(id:\"${id}\", note:\"${note}\"){\n    id\n  }\n}`, "variables": null }
        fetch(points.clientUrl + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                toastr.clear();
                toastr.success("Note has been saved", "Note Saved!");
                refetch();
                document.querySelectorAll(".fa-sticky-note")[index].click()
            });
    }

    addNewNotes(id, index, refetch, event) {
        ReactDOM.render(<div className="form_buttons">
            <textarea id="note" rows="7" className="stretch-width" style={{ fontSize: 15, padding: 20 }}></textarea>
            <div className="text-right">
                <button className="btn" style={{ padding: 5 }} onClick={this.addNotes.bind(this, id, index, refetch)}>Save</button>
            </div>
        </div>, event.target.parentNode.parentNode);
    }

    removeNotes(id, note_id, refetch, event) {
        var payload = { "query": `mutation{\n  removeNotes(id:\"${id}\", note_id:\"${note_id}\"){\n    id\n  }\n}`, "variables": null }
        fetch(points.clientUrl + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                toastr.clear();
                toastr.success("Note has been removed", "Note Removed!");
                refetch();
            });
    }

    copyLink() {
        points.copyToClipBoard("login-link", true);
    }

    encode(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    getLoginBackToken() {
        const { id, privilege, firstName, email, user_session_cookie } = this.props.session.getCurrentUser;
        var token = jwt.sign({ id, privilege, firstName, email }, "23842340239480238420348394", { expiresIn: "24hr" });
        localStorage.setItem("temp_token", token);
        localStorage.setItem("temp_" + points.cookie_name, user_session_cookie);
        localStorage.setItem("temp_redirect", window.location.href);
    }

    // ? DONE :: Admin Creating TOken SignIn Anonimouse
    createToken(user) {
        this.getLoginBackToken();
        const { id, privilege, firstName, email, user_session_cookie } = user;
        var token = jwt.sign({ id, privilege, firstName, email }, "23842340239480238420348394", { expiresIn: "24hr" });
        // Start once login cookie
        Cookies.remove(points.cookie_name);
        Cookies.set(points.cookie_name, user_session_cookie);
        // End once login cookie
        Cookies.set('token', token);
        localStorage.setItem(points.plg_domain_secret, true); // the login as anonymous flag
        window.location.href = window.location.origin; // ? Resulting to server serving 504 was window.location.reload() // * FIX !! 
    }

    manualResetPassword(manualResetPassword, email, index, event) {
        var resetLinkDom = document.getElementById("login-link");
        resetLinkDom.value = points.clientUrl + "/signin/" + email + "/" + this.encode("temporarypassword");
        manualResetPassword().then(({ data }) => {
            toastr.clear();
            toastr.success("Please Copy the link under reset password", "Password Reset Successfuly!");
            document.getElementById("reset" + index).click();
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    updateKartraEmail(updateKartraEmail, event) {
        updateKartraEmail().then(({ data }) => {
            toastr.clear();
            toastr.success("Kartra email has been updated!", "Success!");
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    updatePrivilege(updatePrivilege, refetch, event) {
        this.setState({
            updatedPrivilegeValue: parseInt(event.target.value)
        }, () => {
            updatePrivilege().then(({ data }) => {
                toastr.options.timeOut = 3000;
                toastr.options.extendedTimeOut = 2000;
                toastr.clear();
                toastr.success("Privilege has been changed!", "Success!");
                toastr.options.timeOut = 0;
                toastr.options.extendedTimeOut = 0;
                refetch();
            }).catch(error => {
                console.error("ERR =>", error);
            });
        })
    }

    updateAddDealerId(updateAddDealerId, refetch, event) {
        this.setState({
            updatedDealerId: event.target.value
        }, () => {
            updateAddDealerId().then(({ data }) => {
                toastr.options.timeOut = 3000;
                toastr.options.extendedTimeOut = 2000;
                toastr.clear();
                toastr.success("Dealer has been set to this account.", "Success!");
                toastr.options.timeOut = 0;
                toastr.options.extendedTimeOut = 0;
                refetch();
            }).catch(error => {
                console.error("ERR Add Dealer =>", error);
            });
        })
    }

    fulfillmentCenterAccess(fulfillmentCenterAccess, access, refetch) {
        fulfillmentCenterAccess().then(({ data }) => {
            toastr.options.timeOut = 3000;
            toastr.options.extendedTimeOut = 2000;
            toastr.clear();
            toastr.success(access ? "Grant access sucess!" : "Access has been revoked", "Success!");
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            refetch();
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    funnelGenieAccess(funnelGenieAccess, access, refetch) {
        funnelGenieAccess().then(({ data }) => {
            toastr.options.timeOut = 3000;
            toastr.options.extendedTimeOut = 2000;
            toastr.clear();
            toastr.success(access ? "Grant access sucess!" : "Access has been revoked", "Success!");
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            refetch();
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    handleAddTokenUrl(addTokenUrl, refetch) {
        addTokenUrl().then(async ({ data }) => {
            toastr.clear();
            toastr.success('User connected store has been removed!', 'Success!');
            refetch();
        }).catch(error => {
            console.log("An error has occured", error)
        });
    }

    disconnectFunnelDomain(disconnectFunnelDomain, selectedDomain, refetch) {
        this.setState({ selectedDomain }, () => {
            disconnectFunnelDomain().then(async ({ data }) => {
                toastr.clear();
                toastr.success('User funnel domain has been disconnect!', 'Success!');
                refetch();
            }).catch(error => {
                console.log("An error has occured", error)
            });
        })
    }

    handlePageCount(event) {
        this.setState({
            pageSize: parseInt(event.target.value)
        })
    }

    handleFilterDateChange(event) {
        var obj = null;
        if (event.target.value != "other") {
            obj = {
                displayDate: event.target.value,
                fromDate: this.generateDateNow(event.target.value),
                toDate: this.generateDateNow(0)
            }
        } else {
            obj = {
                displayDate: event.target.value,
                fromDate: '',
                toDate: ''
            }
        }
        this.setState({
            ...obj
        })
    }

    searchStoreURL(event) {
        if (!parseInt(event.target.innerText)) {
            this.setState({
                searchValue: event.target.innerText,
                displayDate: "other",
                fromDate: '',
                toDate: ''
            })
        }
    }

    handleSendMessageChange(event) {
        this.setState({
            privateMessage: event.target.value
        })
    }

    pushNotification(pushNotification, selectorId) {
        pushNotification().then(async ({ data }) => {
            toastr.clear()
            toastr.success("Message successfully sent!", "Success!");
            document.getElementById(selectorId).click();
            this.setState({
                privateMessage: ''
            })
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    head() {
        return (
            <Helmet>
                <title>Admin - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        return (
            <div className="admin page-container">
                {this.head()}
                <Query query={GET_ADMIN_SETTINGS} onCompleted={data => this.setState({ liveLink: (data.getAdminSettings.isLive || "") })}>
                    {({ data, loading, refetch }) => {
                        if (loading) return null;
                        return (
                            <div>
                                <div className="form_wrap">
                                    <div className="text-center">
                                        <h2>Admin Panel</h2>
                                    </div>
                                    <div className="form_row">
                                        <div className="column column_9_12">
                                            <div className="form_item">
                                                <div className="form_input">
                                                    <span>Facebook Live Link</span> <br />
                                                    <input type="text" placeholder="Enter Facebook live video link here" id="liveLink" value={this.state.liveLink} onChange={this.liveLinkChange.bind(this)} />
                                                    <span className="bottom_border"></span>
                                                </div> <br />
                                            </div>
                                        </div>
                                        <div className="column column_3_12" style={{ padding: '15px 0 0' }}>
                                            <div className="form_buttons">
                                                <button className="btn" onClick={this.toggleLiveMode.bind(this, data.getAdminSettings ? !data.getAdminSettings.isLive : true, refetch)} style={{ width: '100%', backgroundColor: data.getAdminSettings && data.getAdminSettings.isLive ? 'green' : 'red' }}>{data.getAdminSettings && data.getAdminSettings.isLive ? 'Live Mode ON' : 'Live Mode OFF'}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                </Query>

                {/* <div className="grid users_wrap clear_fix">
                    <div className="text-center">
                        <h3>Users List</h3>
                    </div>
                    <div className="column column_3_12">
                        <div className="product-card">
                            <div className="product-details" style={{lineHeight: 1.3}}>
                                <div style={{display: 'flex'}}>
                                    <div style={{width: 40, height: 40, borderRadius: '50%', marginRight: 20, backgroundImage: "url(http://localhost:3000/assets/graphics/abstract_patterns/texture.jpg)", backgroundPosition: 'center', backgroundSize: 'cover'}} />
                                    <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                        <span>Jerome Dela Cruz <br/>
                                        Points: 900pts</span>
                                    </div>
                                </div> <br/>
                                <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                    <span>jerome@themillionairemastermind1.com</span><br/>
                                    <span>jeromenewstore.myshopify.com</span><br/>
                                    <span>(407) 443 - 1788</span>
                                </div><br/>
                                <div className="float-right">
                                    Details
                                </div>
                                <div>
                                    Full User (lvl:3)
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="users_wrap clear_fix">
                    <div className="float-left form_buttons" style={{ width: 'auto !important' }}>
                        <Popup
                            trigger={<button className="btn" style={{ cursor: 'pointer' }} title="View Duplicate Connected Store"><span className="fas fa-clone"></span> Duplicate Store</button>}
                            position="right top"
                            on="click" className="points-tooltip" contentStyle={{ width: 400 }}>
                            <div style={{ padding: '5px 10px', position: 'relative' }}>
                                <div>
                                    <h3>Duplicate Connected Store</h3>
                                </div>
                                <div className="message-popup">
                                    <Query query={ADMIN_GET_DUPLICATE_STORE} >
                                        {({ data, loading, refetch, error }) => {
                                            if (loading) return <div className="text-center"><Loading height={200} width={200} /></div>;
                                            if (data.getDuplicateConnectedStore.length == 0) {
                                                return (
                                                    <div className="text-center">
                                                        <span style={{ fontStyle: 'italic', fontSize: '1.5rem' }}>No Duplicate Connected Store Found.</span>
                                                    </div>
                                                );
                                            }
                                            if (data.getDuplicateConnectedStore.length != 0) {
                                                return (
                                                    <div className="table-container">
                                                        <table className="table-list">
                                                            <thead>
                                                                <tr>
                                                                    <th>Store URL</th>
                                                                    <th>Count</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {data.getDuplicateConnectedStore.map((store, st) => {
                                                                    return (
                                                                        <tr key={st} onClick={event => this.searchStoreURL(event)} style={{ cursor: "pointer" }} title="Click to search">
                                                                            <td>{store.store_url}</td>
                                                                            <td>{store.count}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    </Query>
                                </div>
                            </div>
                        </Popup>
                    </div>
                    <div className="text-center clear_fix">
                        <h3>Users List</h3>
                    </div>
                    <div className="table-container">
                        <Query query={GET_ALL_USERS}
                            variables={{
                                sortMessage: this.state.sortMessage,
                                fromDate: this.state.fromDate,
                                toDate: this.state.toDate,
                                search: this.state.searchValue,
                                privilege: this.state.selectedPrivilege,
                                limit: this.state.pageSize,
                                offset: (this.state.pageNumber - 1) * this.state.pageSize,
                                sort: this.state.sortPrivilege
                            }}>
                            {({ data, loading, refetch, error }) => {
                                if (loading) return <div className="text-center"><Loading height={200} width={200} /></div>;
                                if (error) return <tbody><tr><td colSpan='10' className="text-center">Error</td></tr></tbody>
                                return (
                                    <div>
                                        <div className="form_wrap text-right">
                                            <div className="form_row">
                                                <div className="form_item">
                                                    <div className="form_buttons form_input">
                                                        <div className="column column_4_12 text-right">
                                                            <label style={{ width: '20%' }}>Join Date: </label>
                                                            <select className="dropbtn" value={this.state.displayDate} onChange={this.handleFilterDateChange.bind(this)} style={{ borderBottom: '1px solid #00bf60', margin: '0 5px' }}>
                                                                <option value="0">Today</option>
                                                                <option value="1">Yesterday</option>
                                                                <option value="7">Last 7 Days</option>
                                                                <option value="other">other</option>
                                                            </select>
                                                            {this.state.displayDate == "other" &&
                                                                <div>
                                                                    <input type="date" value={this.state.fromDate} onChange={this.handleFromDate.bind(this)} name="from" style={{ width: '38%', margin: '0 5px', padding: '10px 0', borderBottom: '1px solid #00bf60' }} />
                                                                    <input type="date" value={this.state.toDate} onChange={this.handleToDate.bind(this)} name="to" style={{ width: '38%', margin: '0 5px', padding: '10px 0', borderBottom: '1px solid #00bf60' }} /> <br /> <br />
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="column column_4_12">
                                                            <label>Sort Privilege: </label>
                                                            <select className="dropbtn" value={this.state.sortPrivilege} onChange={this.handleSortPrivilege.bind(this)} style={{ borderBottom: '1px solid #00bf60', margin: '0 5px' }}>
                                                                <option value="">Default</option>
                                                                <option value="Asc">Ascending</option>
                                                                <option value="Desc">Descending</option>
                                                            </select>
                                                            <select className="dropbtn" value={this.state.selectedPrivilege} onChange={this.handleSelectedPrivilege.bind(this)} style={{ borderBottom: '1px solid #00bf60', margin: '0 5px' }}>
                                                                <option value="">All</option>
                                                                <option value="0">Free User (LVL: 0)</option>
                                                                <option value="1">Trial User (LVL: 1)</option>
                                                                <option value="2">Basic User (LVL: 2)</option>
                                                                <option value="3">Full User (LVL: 3)</option>
                                                                <option value="4">VIP User (LVL: 4)</option>
                                                                <option value="5">Sales Person (LVL: 5)</option>
                                                            </select>
                                                        </div>
                                                        <div className="column column_4_12">
                                                            <input type="text" value={this.state.search_text} onKeyUp={this.handleKeyUp.bind(this)} onChange={this.handleChange.bind(this)} placeholder="Search user by first name, last name or email" id="search-area" style={{ width: '70%', borderBottom: '1px solid #ccc' }} /> &nbsp;&nbsp;
                                                            <button className="btn" style={{ width: '27%', padding: '7px 9px' }} onClick={this.handleSearch.bind(this)}>Search</button>
                                                            <br /><br />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <table className="table-list">
                                            <thead>
                                                <tr>
                                                    <th>Assign</th>
                                                    <th onClick={() => this.sortMessage()} style={{ cursor: 'pointer' }}>
                                                        <span className="fas fa-envelope"></span>
                                                        <div className="float-right">
                                                            <span className={this.state.sortMessage == "Asc" ? "fas fa-caret-down" : "fas fa-caret-up"}></span>
                                                        </div>
                                                    </th>
                                                    <th className="text-center">FB</th>
                                                    <th className="text-center">View</th>
                                                    <th>Join Date</th>
                                                    <th style={{ minWidth: '102px' }}>Last Login</th>
                                                    <th className="text-center">
                                                        Privilege
                                                        {/* <div className="float-right">
                                                            <span className={this.state.sortPrivilege == "Asc" ? "fas fa-caret-down" : "" || this.state.sortPrivilege == "Desc" ? "fas fa-caret-up" : ""}></span>
                                                        </div> */}
                                                    </th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th className="text-center">Spent</th>
                                                    <th className="text-center">Points</th>
                                                    <th className="text-center">Store</th>
                                                    <th className="text-center">Store Phone</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.getAllUsers.length == 0 &&
                                                    <tr>
                                                        <td colSpan='13' className="text-center">{this.isFilterEnable() ? 'No Result Found.' : 'Empty... check back soon!'}</td>
                                                    </tr>
                                                }
                                                {data.getAllUsers.map((user, index) => (
                                                    <tr key={index} style={{ backgroundColor: user.kartra_tags ? user.kartra_tags.includes("PLG_Failed") ? '#ff000066' : 'transparent' : 'transparent' }}>
                                                        <td>
                                                            <Mutation
                                                                mutation={SET_SALES_REP}
                                                                variables={{
                                                                    id: user.id,
                                                                    sales_rep_id: this.state.salesRepId
                                                                }}
                                                            >
                                                                {(setSalesRep, { setSaleData, loading, error }) => {
                                                                    return (
                                                                        <select className="dropbtn" value={user.sales_rep_id ? user.sales_rep_id : ""} onChange={this.saveSalesRep.bind(this, setSalesRep, refetch)} style={{ borderBottom: '1px solid #00bf60', margin: '0 5px' }}>
                                                                            <option value=""></option>
                                                                            {data.getAllSalesPerson.map(person => {
                                                                                var unformedName = person.firstName + " " + person.lastName;
                                                                                var capitalizeName = "";
                                                                                unformedName.split(" ").forEach(n => {
                                                                                    capitalizeName += n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase() + " "
                                                                                })
                                                                                return <option key={person.id} value={person.id}>{capitalizeName.trim()}</option>
                                                                            })}
                                                                        </select>
                                                                    );
                                                                }}
                                                            </Mutation>
                                                        </td>
                                                        <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                            <Popup
                                                                trigger={<i className="far fa-sticky-note" style={{ color: '#f07a06', cursor: 'pointer' }} title="Send a Note"></i>}
                                                                position="right center"
                                                                on="click" className="points-tooltip">
                                                                <div style={{ padding: '5px 20px', position: 'relative' }}>
                                                                    <h3>Notes</h3>
                                                                    <div className="message-popup text-left word-wrap">
                                                                        {(() => {
                                                                            var newNotes = [].concat(user.sales_rep_notes)
                                                                            if (newNotes.length == 0) {
                                                                                return (
                                                                                    <div className="product-card">
                                                                                        <div className="product-details text-center">
                                                                                            <span style={{ fontStyle: 'italic', color: '#7e7e7e' }}>No notes found to this user</span>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                            return newNotes.sort(function (a, b) { return b.date_request - a.date_request }).map((note, n) => {
                                                                                return (
                                                                                    <div className="product-card" id={note.id} key={n}>
                                                                                        <div className="product-details">
                                                                                            <div className="float-right">
                                                                                                <span className="fas fa-times" style={{ color: 'red', cursor: 'pointer' }} title="Remove This Note" onClick={this.removeNotes.bind(this, user.id, note.id, refetch)}></span>
                                                                                            </div>
                                                                                            <span className="help-message">{note.note}</span>
                                                                                            <div className="request-date">{new Date(parseInt(note.date_time)).toDateString()}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })
                                                                        })()}
                                                                        <div className="floating-btn-bottom-right">
                                                                            <button className="add-button-circle" onClick={this.addNewNotes.bind(this, user.id, refetch, index)}>+</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Popup>
                                                            {user.help_request_message.length != 0 ?
                                                                <Popup
                                                                    trigger={<i className="fas fa-envelope" style={{ color: 'green', cursor: 'pointer' }} title="Click to open message"></i>}
                                                                    position="top center"
                                                                    on="click" className="points-tooltip">
                                                                    <div style={{ padding: '5px 20px' }}>
                                                                        <h3>User Requested Help</h3>
                                                                        <div className="message-popup text-left word-wrap">
                                                                            {(() => {
                                                                                var newHelp = [].concat(user.help_request_message)
                                                                                return newHelp.sort(function (a, b) { return b.date_request - a.date_request }).map((help, h) => {
                                                                                    return (
                                                                                        <div className="product-card" key={h}>
                                                                                            <div className="product-details">
                                                                                                <span className="help-message">{help.message}</span>
                                                                                                <div className="request-date">{new Date(parseInt(help.date_request)).toDateString()}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                            })()}
                                                                        </div>
                                                                    </div>
                                                                </Popup>
                                                                : <i className="fas fa-envelope" style={{ opacity: 0 }}></i>}
                                                            {user.privilege == 3 ? // User Privilege
                                                                <i className="fas fa-circle" style={{ color: 'red' }} title="Full User"></i> : <i className="fas fa-circle" style={{ opacity: 0 }}></i>}
                                                            {user.purchase_dfy ? <i className="fas fa-circle" style={{ color: 'yellow' }} title="Bought PLG Theme"></i>
                                                                : <i className="fas fa-circle" style={{ opacity: 0 }}></i>}
                                                            {user.privilege == 4 ? <i className="fas fa-circle" style={{ color: 'blue' }} title="VIP User"></i>
                                                                : <i className="fas fa-circle" style={{ opacity: 0 }}></i>}
                                                            {parseFloat(user.total_exprenses ? user.total_exprenses : 0).toFixed(2) >= 300 ? <i className="fab fa-hotjar" style={{ color: 'red' }} title="Above $300 Total Spent"></i>
                                                                : <i className="fab fa-hotjar" style={{ opacity: 0 }}></i>}
                                                        </td>
                                                        <td className="text-center">{user.fb_link ? <a href={user.fb_link} target="_blank" title={user.fb_link}>View</a> : ''}</td>
                                                        <td className="text-center">
                                                            <NavLink to={`profile/${user.id}`}>
                                                                <span className="fas fa-eye"></span>
                                                            </NavLink>
                                                        </td>
                                                        <td>{new Date(parseInt(user.joinDate)).toLocaleDateString()}</td>
                                                        <td>{moment(new Date(parseInt(user.lastLoginDate ? user.lastLoginDate : user.joinDate)).toISOString()).startOf('second').fromNow()}</td>
                                                        <td className="text-center">{"(LVL: " + user.privilege + ")"}</td>
                                                        <td>
                                                            <Popup
                                                                trigger={<span className="capitalize clickable">{user.firstName.toLowerCase() + " " + user.lastName.toLowerCase()}</span>}
                                                                position="top center"
                                                                onClose={() => this.setState({ new_email: "" })}
                                                                className="points-tooltip" contentStyle={{ width: 400, height: 400, overflow: 'auto' }} on="click">
                                                                <div style={{ position: 'relative', marginTop: 5 }}>
                                                                    <div className="form_wrap">
                                                                        <div className="form_row">
                                                                            <div className="form_item">
                                                                                <Popup
                                                                                    trigger={<span className="clickable float-right" id={"pm" + user.id}>Message user</span>}
                                                                                    position="bottom right"
                                                                                    on="click" className="points-tooltip" contentStyle={{ width: 320 }}>
                                                                                    <div className="text-center form_buttons">
                                                                                        <h3>Compose message to user</h3>
                                                                                        <div className="form_input">
                                                                                            <input type="text" name="privateMessage" value={this.state.privateMessage} onChange={this.handleSendMessageChange.bind(this)} />
                                                                                            <span className="bottom_border"></span>
                                                                                        </div> <br />
                                                                                        <Mutation
                                                                                            mutation={PUSH_NOTIFICATION}
                                                                                            variables={{
                                                                                                id: user.id,
                                                                                                sendTo: null,
                                                                                                type: "info",
                                                                                                message: this.state.privateMessage
                                                                                            }}>
                                                                                            {(pushNotification, { data, loading, error }) => {
                                                                                                return <button className="btn stretch-button" onClick={() => this.pushNotification(pushNotification, "pm" + user.id)}>Send</button>;
                                                                                            }}
                                                                                        </Mutation>
                                                                                    </div>
                                                                                </Popup>
                                                                                <div className="funnel">
                                                                                    <h3>
                                                                                        User Tag(s)
                                                                                        <Tooltip
                                                                                            trigger={
                                                                                                <span
                                                                                                    className={"fas fa-" + (this.state.add_new_tag ? "times color-dark-red" : "plus color-green") + " fa-1x cursor-pointer"}
                                                                                                    onClick={() => this.setState({ add_new_tag: !this.state.add_new_tag, add_new_tag_name: "" })}
                                                                                                    style={{ marginLeft: 10 }}
                                                                                                />
                                                                                            }
                                                                                            children={
                                                                                                <label
                                                                                                    style={{ display: 'block', textAlign: 'center', fontSize: '0.7em' }}
                                                                                                >
                                                                                                    {this.state.add_new_tag ? "Close" : "Add New Tag"}
                                                                                                </label>
                                                                                            }
                                                                                            position="right center"
                                                                                            arrow={true}
                                                                                        />
                                                                                    </h3>
                                                                                    <div className="flex-container display-inline row-separator" style={{ justifyContent: 'flex-start', maxWidth: 'fit-content' }}>
                                                                                        {(() => {
                                                                                            if (user.access_tags.length != 0) {
                                                                                                return user.access_tags.map((tag, i) => {
                                                                                                    return (
                                                                                                        <Mutation mutation={ADD_OR_REMOVE_PLG_TAG} variables={{ id: user.id, tag, action: "remove" }} key={i}>
                                                                                                            {(addOrRemovePLGTag, { data, loading, error }) => {
                                                                                                                return (
                                                                                                                    <ShowFilter
                                                                                                                        label={tag}
                                                                                                                        onClick={() => points.executeMutation(addOrRemovePLGTag, toastr, () => {
                                                                                                                            refetch();
                                                                                                                            points.toastrPrompt(toastr, "success", "Tag has been removed.");
                                                                                                                        })}
                                                                                                                        key={i}
                                                                                                                    />
                                                                                                                )
                                                                                                            }}
                                                                                                        </Mutation>
                                                                                                    );
                                                                                                });
                                                                                            } else {
                                                                                                return <i className="row-separator">No tag to display</i>
                                                                                            }
                                                                                        })()}
                                                                                    </div>
                                                                                    {this.state.add_new_tag &&
                                                                                        <div className="display-inline">
                                                                                            <Tooltip trigger={
                                                                                                <input type="text" name="add_new_tag_name" value={this.state.add_new_tag_name} onChange={event => this.setState({ add_new_tag_name: event.target.value })} style={{ padding: 5, maxWidth: 200 }} />
                                                                                            } position="bottom center" on="click" arrow={false} style={{ minWidth: 200 }}>
                                                                                                {(() => {
                                                                                                    if (this.state.add_new_tag_name) {
                                                                                                        const suggestion_list = points.tag_suggestion().filter(e => e.tag.toLowerCase().includes(this.state.add_new_tag_name)).slice(0, 5);
                                                                                                        if (suggestion_list.length != 0) {
                                                                                                            return (
                                                                                                                <ul className="item-list-normal">
                                                                                                                    {suggestion_list.map((suggestion, i) => {
                                                                                                                        return (
                                                                                                                            <li key={i}
                                                                                                                                onClick={() => this.setState({ add_new_tag_name: suggestion.tag }, () => {
                                                                                                                                    // document.getElementById("save_tag").click(); // click save
                                                                                                                                })}
                                                                                                                            >{suggestion.tag + " - " + suggestion.description}</li>
                                                                                                                        );
                                                                                                                    })}
                                                                                                                </ul>
                                                                                                            );
                                                                                                        } else {
                                                                                                            return (
                                                                                                                <ul className="item-list-normal">
                                                                                                                    <li>Click the disk icon to save.</li>
                                                                                                                </ul>
                                                                                                            );
                                                                                                        }
                                                                                                    } else {
                                                                                                        return (
                                                                                                            <ul className="item-list-normal">
                                                                                                                <li>Type text to appear possible suggestion.</li>
                                                                                                            </ul>
                                                                                                        );
                                                                                                    }
                                                                                                })()}
                                                                                            </Tooltip>
                                                                                            <Mutation mutation={ADD_OR_REMOVE_PLG_TAG} variables={{ id: user.id, tag: this.state.add_new_tag_name, action: "add" }} >
                                                                                                {(addOrRemovePLGTag, { data, loading, error }) => {
                                                                                                    return (
                                                                                                        <button
                                                                                                            id="save_tag"
                                                                                                            className="fas fa-save color-green cursor-pointer"
                                                                                                            style={{ fontSize: '2em', padding: 1 }}
                                                                                                            onClick={() => points.executeMutation(addOrRemovePLGTag, toastr, () => {
                                                                                                                this.setState({ add_new_tag: false, add_new_tag_name: "" });
                                                                                                                refetch();
                                                                                                                points.toastrPrompt(toastr, "success", "Tag has been saved.");
                                                                                                            })}
                                                                                                            disabled={loading}
                                                                                                        />
                                                                                                    )
                                                                                                }}
                                                                                            </Mutation>
                                                                                        </div>
                                                                                    }
                                                                                </div>
                                                                                {(user.access_tags.includes('car_lead') || user.access_tags.includes('agent')) &&
                                                                                    <div>
                                                                                        <div className="text-center clear">
                                                                                            <h3>Assign Dealer</h3>
                                                                                        </div>
                                                                                        <div className="column column_12_12">
                                                                                            <div className="form_input">
                                                                                                {/* UPDATE ADD DEALER UPDATE OR ADD */}
                                                                                                <Mutation mutation={ADD_DEALER_ID} variables={{ id: user.id, dealerId: this.state.updatedDealerId }}>
                                                                                                    {(updateAddDealerId, { data, loading, error }) => {
                                                                                                        return (
                                                                                                            <select className="dropbtn drp stretch-width" onChange={this.updateAddDealerId.bind(this, updateAddDealerId, refetch)} value={user.dealerId ? user.dealerId : ""} style={{ backgroundColor: 'transparent' }}>
                                                                                                                <option value="">No Dealer / Not an Agent</option>
                                                                                                                {this.state.dealer_list.map((dealer, index) => {
                                                                                                                    return <option key={index} value={dealer.id}>{dealer.name} - {dealer.email} - {dealer.phone}</option>
                                                                                                                })}
                                                                                                            </select>);
                                                                                                    }}
                                                                                                </Mutation>
                                                                                            </div> <br />
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                <div className="text-center clear">
                                                                                    <h3>Change Kartra Email</h3>
                                                                                </div>
                                                                                <div className="column column_6_12">
                                                                                    <div className="form_input">
                                                                                        <label>Kartra Email</label> <br />
                                                                                        <input type="text" name="kartraEmail" defaultValue={user.kartra} onChange={this.handleKartraEmaiLChange.bind(this)} placeholder="e.g. someoneemail@email.com" title="Use this when user use different kartra email" />
                                                                                        <span className="bottom_border"></span>
                                                                                    </div> <br />
                                                                                </div>

                                                                                <div className="column column_6_12">
                                                                                    <div className="form_buttons text-right" style={{ padding: "15px 0 0" }}>
                                                                                        <Mutation
                                                                                            mutation={UPDATE_KARTRA_EMAIL}
                                                                                            variables={{
                                                                                                id: user.id,
                                                                                                kartra: this.state.kartraEmail
                                                                                            }}
                                                                                        >
                                                                                            {(updateKartraEmail, { data, loading, error }) => {
                                                                                                return <button className="btn stretch-width" style={{ padding: 10, fontSize: 12, whiteSpace: 'nowrap' }} onClick={this.updateKartraEmail.bind(this, updateKartraEmail)}>Link Kartra</button>;
                                                                                            }}
                                                                                        </Mutation>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="text-center clear">
                                                                                    <h3>Change Email</h3>
                                                                                </div>
                                                                                <Mutation mutation={UPDATE_EMAIL} variables={{ id: user.id, new_email: this.state.new_email }} onCompleted={() => refetch()}>
                                                                                    {(updateEmail, { data, loading, error }) => {
                                                                                        let disableForm = !this.state.new_email || loading || this.state.new_email == user.email;
                                                                                        return (
                                                                                            <Form submitClassName="column column_6_12" submitText="Update" onSubmit={() => {
                                                                                                points.toastrPrompt(toastr, "info", "Saving new email...");
                                                                                                points.executeMutation(updateEmail, toastr, () => {
                                                                                                    points.toastrPrompt(toastr, "success", "Saving new email success!");
                                                                                                    this.setState({ new_email: "" });
                                                                                                })
                                                                                            }} disabled={disableForm}>
                                                                                                <Input className="column column_6_12" name="new_email" value={this.state.new_email || user.email} placeholder="Enter new email" onChange={input => this.setState({ [input.name]: input.value })} />
                                                                                            </Form>
                                                                                        );
                                                                                    }}
                                                                                </Mutation>

                                                                                {user.privilege <= 5 &&
                                                                                    <div>
                                                                                        <div className="text-center clear">
                                                                                            <h3>Change Privilege</h3> {/* search sa global // User Privilege */}
                                                                                        </div>
                                                                                        <div className="column column_12_12">
                                                                                            <div className="form_input">
                                                                                                <Mutation
                                                                                                    mutation={UPDATE_PRIVILEGE}
                                                                                                    variables={{
                                                                                                        id: user.id,
                                                                                                        privilege: this.state.updatedPrivilegeValue
                                                                                                    }}
                                                                                                >
                                                                                                    {(updatePrivilege, { data, loading, error }) => {
                                                                                                        return (
                                                                                                            <select className="dropbtn drp stretch-width" onChange={this.updatePrivilege.bind(this, updatePrivilege, refetch)} value={user.privilege} style={{ backgroundColor: 'transparent' }}>
                                                                                                                <option value="0">Free Account (LVL: 0)</option>
                                                                                                                <option value="1">Trial Account (LVL: 1)</option>
                                                                                                                <option value="2">Basic User (LVL: 2)</option>
                                                                                                                <option value="3">Full User (LVL: 3)</option>
                                                                                                                <option value="4">VIP User (LVL: 4)</option>
                                                                                                                <option value="5">Sales Person (LVL: 5)</option>
                                                                                                            </select>
                                                                                                        );
                                                                                                    }}
                                                                                                </Mutation>
                                                                                            </div> <br />
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                <div className="text-center clear">
                                                                                    <h3>Reset Password</h3>
                                                                                </div>
                                                                                <div className="column column_6_12">
                                                                                    <div className="form_input">
                                                                                        <input type="text" id="login-link" placeholder="Link Will Appear Here" onClick={event => this.copyLink()} />
                                                                                        <span className="bottom_border"></span>
                                                                                    </div> <br />
                                                                                </div>
                                                                                <div className="column column_6_12">
                                                                                    <div className="form_buttons text-right" style={{ padding: "10px 0 0" }}>
                                                                                        <Popup
                                                                                            trigger={<button className="btn stretch-width" style={{ padding: 10, fontSize: 12 }} id={"reset" + index}>Get Login</button>}
                                                                                            position="top right"
                                                                                            on="click" className="points-tooltip">
                                                                                            <div className="text-center">
                                                                                                <h4 style={{ lineHeight: 1.2, color: "#000", fontSize: '2rem' }}>This will reset user password,<br />are you sure?</h4>
                                                                                                <Mutation
                                                                                                    mutation={MANUAL_RESET_PASSWORD}
                                                                                                    variables={{
                                                                                                        id: user.id
                                                                                                    }}
                                                                                                >
                                                                                                    {(manualResetPassword, { data, loading, error }) => {
                                                                                                        return (
                                                                                                            <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20 }} onClick={this.manualResetPassword.bind(this, manualResetPassword, user.email, index)}>
                                                                                                                <i className="fas fa-check"></i>
                                                                                                            </button>
                                                                                                        );
                                                                                                    }}
                                                                                                </Mutation>
                                                                                                &nbsp; | &nbsp;
                                                                                                <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20 }} onClick={() => document.getElementById("reset" + index).click()}>
                                                                                                    <i className="fas fa-times"></i>
                                                                                                </button>
                                                                                            </div>
                                                                                        </Popup>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="text-center clear">
                                                                                    <h3>{user.access_tags.includes('FG') ? "Revoke Access" : "Grant Access"} to Funnel Genie</h3>
                                                                                </div>
                                                                                <div className="column column_12_12">
                                                                                    <div className="form_buttons">
                                                                                        <Mutation
                                                                                            mutation={UPDATE_FUNNEL_GENIE_ACCESS}
                                                                                            variables={{
                                                                                                id: user.id,
                                                                                                access: !user.access_tags.includes('FG')
                                                                                            }}
                                                                                        >
                                                                                            {(funnelGenieAccess, { data, loading, error }) => {
                                                                                                return <button className="btn stretch-width" onClick={() => this.funnelGenieAccess(funnelGenieAccess, !user.access_tags.includes('FG'), refetch)} disabled={loading}>{user.access_tags.includes('FG') ? "Revoke Access" : "Grant Access"}</button>
                                                                                            }}
                                                                                        </Mutation>
                                                                                    </div> <br />
                                                                                </div>

                                                                                <div className="text-center clear">
                                                                                    <h3>Reset Connected Store</h3>
                                                                                </div>
                                                                                <div className="column column_12_12">
                                                                                    <div className="form_buttons">
                                                                                        <Popup
                                                                                            trigger={<button className="btn stretch-width" id={"store" + index}>Reset Store</button>}
                                                                                            position="top center"
                                                                                            on="click" className="points-tooltip">
                                                                                            <div className="text-center">
                                                                                                <h4 style={{ lineHeight: 1.2, color: "#000", fontSize: '2rem' }}>This will reset user connected store,<br />are you sure?</h4>
                                                                                                <Mutation
                                                                                                    mutation={ADD_STORE_TOKEN}
                                                                                                    variables={{
                                                                                                        id: user.id,
                                                                                                        store_token: "",
                                                                                                        store_url: "",
                                                                                                        store_phone: "",
                                                                                                        store_location_id: ""
                                                                                                    }} >
                                                                                                    {(addTokenUrl, { data, loading, error }) => {
                                                                                                        return (
                                                                                                            <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20 }} onClick={() => { document.getElementById("store" + index).click(); this.handleAddTokenUrl(addTokenUrl, refetch) }}>
                                                                                                                <i className="fas fa-check"></i>
                                                                                                            </button>
                                                                                                        );
                                                                                                    }}
                                                                                                </Mutation>
                                                                                                &nbsp; | &nbsp;
                                                                                                <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20 }} onClick={() => document.getElementById("store" + index).click()}>
                                                                                                    <i className="fas fa-times"></i>
                                                                                                </button>
                                                                                            </div>
                                                                                        </Popup>
                                                                                    </div> <br />
                                                                                </div>

                                                                                {user.privilege != 10 || this.props.session.getCurrentUser.access_tags.includes("god") ? // show to god mode even lvl 10
                                                                                    <div className="text-center clear">
                                                                                        <h3>Login as anonymous</h3>
                                                                                    </div>
                                                                                    : void 0}
                                                                                {user.privilege != 10 || this.props.session.getCurrentUser.access_tags.includes("god") ? // show to god mode even lvl 10
                                                                                    <div className="column column_12_12 funnel">
                                                                                        <Popup
                                                                                            trigger={<button id="loginasadmin" className="btn-success stretch-width" style={{ padding: '10px 20px' }}>Login</button>}
                                                                                            position="top center"
                                                                                            on="click" className="points-tooltip">
                                                                                            <div className="text-center">
                                                                                                <h4 style={{ lineHeight: 1.2, color: "#000", fontSize: '2rem' }}>You will be login to user account anonymously. Proceed?</h4>
                                                                                                <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20 }} onClick={() => this.createToken(user)}>
                                                                                                    <i className="fas fa-check"></i>
                                                                                                </button>
                                                                                                &nbsp; | &nbsp;
                                                                                                <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20 }} onClick={() => document.getElementById("loginasadmin").click()}>
                                                                                                    <i className="fas fa-times"></i>
                                                                                                </button>
                                                                                            </div>
                                                                                        </Popup>
                                                                                    </div>
                                                                                    : void 0}

                                                                                <div className="text-center clear">
                                                                                    <h3>Disconnect Funnel Domain</h3>
                                                                                </div>
                                                                                <div className="column column_12_12 funnel">
                                                                                    {user.funnel_genie_domains.length != 0 ?
                                                                                        <ul className="item-list" style={{ border: '1px solid #dddddd', fontSize: '1.8em', maxHeight: 160, overflow: 'auto' }}>
                                                                                            {user.funnel_genie_domains.map((el, e_index) => {
                                                                                                return (
                                                                                                    <li style={{ wordBreak: 'break-all' }} key={e_index}>
                                                                                                        {el}
                                                                                                        <Mutation mutation={DISCONNECT_FUNNEL_DOMAIN} variables={{ id: user.id, domain: this.state.selectedDomain }} >
                                                                                                            {(disconnectFunnelDomain, { setSaleData, loading, error }) => {
                                                                                                                return (
                                                                                                                    <Popup
                                                                                                                        trigger={<span id={"remove_funnel_" + e_index} className="fas fa-times color-dark-red float-right" style={{ marginLeft: 10 }} />}
                                                                                                                        position="top right"
                                                                                                                        on="click" className="points-tooltip" contentStyle={{ width: 300 }} arrow={false}>
                                                                                                                        <div className="text-center">
                                                                                                                            <h4 style={{ lineHeight: 1.2, color: "#000", fontSize: '2rem' }}>
                                                                                                                                Are you really sure to disconnect this funnel domain? Make sure you already disconnected the funnel connected to this domain. <br />
                                                                                                                                Proceed?
                                                                                                                            </h4>
                                                                                                                            <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20 }} onClick={() => {
                                                                                                                                document.getElementById("remove_funnel_" + e_index).click();
                                                                                                                                this.disconnectFunnelDomain(disconnectFunnelDomain, el, refetch);
                                                                                                                            }}>
                                                                                                                                <i className="fas fa-check"></i>
                                                                                                                            </button>
                                                                                                                            &nbsp; | &nbsp;
                                                                                                                            <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20 }} onClick={() => document.getElementById("remove_funnel_" + e_index).click()}>
                                                                                                                                <i className="fas fa-times"></i>
                                                                                                                            </button>
                                                                                                                        </div>
                                                                                                                    </Popup>
                                                                                                                );
                                                                                                            }}
                                                                                                        </Mutation>
                                                                                                    </li>
                                                                                                );
                                                                                            })}
                                                                                        </ul>
                                                                                        : <label>No Funnel Domains Found.</label>}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Popup>
                                                        </td>
                                                        <td>
                                                            <div className="table-email">
                                                                <a href={"mailto:" + user.email}>{user.email}</a>
                                                            </div>
                                                        </td>
                                                        <td className="text-center">{"$" + parseFloat(user.total_exprenses ? user.total_exprenses : 0).toFixed(2)}</td>
                                                        <td className="text-center">{points.kFormatter(user.total_points)}</td>
                                                        <td className="text-center"><a href={user.store_url ? "https://" + user.store_url.replace("https://", "") : ''} target="_blank">{user.store_url ? 'Visit' : ''}</a></td>
                                                        <td className="text-center">{user.store_phone}</td>
                                                    </tr>
                                                ))}
                                            </tbody>

                                            {data.getAllUsers.length != 0 &&
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan='9' style={{ lineHeight: 1.5 }}>
                                                            {"Page: " + this.state.pageNumber} <span style={{ margin: '0 50px' }}>{"Total Users: " + data.getAllUsers[0].count}</span> {this.isFilterEnable() ? "Search Found: " + data.getAllUsers[0].queryCount : ''}
                                                        </td>
                                                        <td colSpan='3' className="text-center"> See users by:
                                                            <select className="dropbtn" value={this.state.pageSize} onChange={this.handlePageCount.bind(this)} style={{ borderBottom: '1px solid #00bf60', margin: '0 5px', padding: '4px 10px' }}>
                                                                <option value="20">20</option>
                                                                <option value="30">30</option>
                                                                <option value="50">50</option>
                                                            </select>
                                                        </td>
                                                        <td width="20%" className="form_buttons" style={{ whiteSpace: 'nowrap' }}>
                                                            <button className="btn" style={{ padding: '5px' }} onClick={() => this.changePageNumber(false)} disabled={this.state.pageNumber == 1 ? true : false}>Prev</button> | &nbsp;
                                                            <button className="btn" style={{ padding: '5px' }} onClick={() => this.changePageNumber(true)} disabled={this.checkNext(this.isFilterEnable() ? data.getAllUsers[0].queryCount : data.getAllUsers[0].count)}>Next</button>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            }
                                        </table>
                                    </div>
                                )
                            }}
                        </Query>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(Admin);