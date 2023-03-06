import React from 'react';
import ReactDOM from 'react-dom';
import withAuth from '../hoc/withAuth';
import Popup from 'reactjs-popup';
import toastr from 'toastr';
import { GET_ALL_USERS, PUSH_NOTIFICATION } from './../queries';
import { Query, Mutation } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loading from '../components/loading';
const points = require('../../Global_Values');

class SalesRepresentative extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            pageSize: 20,
            searchValue: "",
            sortPrivilege: "",
            selectedPrivilege: "",
            fromDate: '', //this.generateDateNow(),
            toDate: '', //this.generateDateNow(),
            sortMessage: 'Desc',
            salesRepId: "",
            note: '',
            displayDate: "other",
            privateMessage: ""
        }
    }

    // return date yyyy-MM-dd
    generateDateNow(days){
        var pastDate = points.getPastDate(days);
        return pastDate.getUTCFullYear() +"-"+ ((pastDate.getUTCMonth()+1).toString().length == 1 ? '0' : '')  + (pastDate.getUTCMonth()+1) + "-" + (pastDate.getUTCDate().toString().length == 1 ? '0' : '') + pastDate.getUTCDate()
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
    }

    handleSearch(event){
        this.setState({
            pageNumber: 1,
            disablePrev: true,
            searchValue: event.target.parentNode.querySelector("input").value
        })
    }

    handleSortPrivilege(event){
        this.setState({
            sortPrivilege: event.target.value
        })
    }

    handleSelectedPrivilege(event){
        this.setState({
            selectedPrivilege: event.target.value
        })
    }

    handleFromDate(event){
        this.setState({
            fromDate: event.target.value
        })
    }

    handleToDate(event){
        this.setState({
            toDate: event.target.value
        })
    }
    
    changePageNumber(isNext){
        var currentPage = this.state.pageNumber;
        this.setState({
            pageNumber: isNext ? currentPage + 1 : currentPage - 1
        })
    }

    checkNext(total){
        var pageSize = this.state.pageNumber * this.state.pageSize;
        return total <= pageSize;
    }

    sortMessage(){
        if(this.state.sortMessage == "Asc")
            this.setState({sortMessage: "Desc"})
        else
            this.setState({sortMessage: "Asc"})
    }

    isFilterEnable(){
        if(this.state.searchValue || this.state.selectedPrivilege || (this.state.fromDate && this.state.toDate))
            return true;
        else
            return false;
    }

    saveSalesRep(setSalesRep, refetch, event){
        this.setState({salesRepId: event.target.value}, () => {
            setSalesRep().then(async ({ data }) => {
                toastr.clear();
                toastr.success("Successfully saved sales rep","Saved!");
                refetch();
            }).catch(error => {
                this.setState({
                    error: error.graphQLErrors.map(x => x.message)
                })
                console.error("ERR =>", error.graphQLErrors.map(x => x.message));
            });
        })
    }

    addNotes(id, refetch, index, event){
        var note = document.getElementById("note").value;
        var payload = {"query":`mutation{\n  addNotes(id:\"${id}\", note:\"${note}\"){\n    id\n  }\n}`,"variables":null}
        fetch(points.clientUrl+'/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            toastr.clear();
            toastr.success("Note has been saved","Note Saved!");
            refetch();
            document.querySelectorAll(".fa-sticky-note")[index].click()
        });
    }

    addNewNotes(id, index, refetch, event){
        ReactDOM.render(<div className="form_buttons">
            <textarea id="note" rows="7" className="stretch-width" style={{fontSize: 15, padding:20}}></textarea>
            <div className="text-right">
                <button className="btn" style={{padding:5}} onClick={this.addNotes.bind(this, id, index, refetch)}>Save</button>
            </div>
        </div>, event.target.parentNode.parentNode);
    }

    removeNotes(id, note_id, refetch, event){
        var payload = {"query":`mutation{\n  removeNotes(id:\"${id}\", note_id:\"${note_id}\"){\n    id\n  }\n}`,"variables":null}
        fetch(points.clientUrl+'/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            toastr.clear();
            toastr.success("Note has been removed","Note Removed!");
            refetch();
        });
    }

    handlePageCount(event){
        this.setState({
            pageSize: parseInt(event.target.value)
        })
    }

    handleFilterDateChange(event){
        var obj = null;
        if(event.target.value != "other"){
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

    setNow(sales_rep_date){
        if(sales_rep_date){
            var sdate = new Date(parseInt(sales_rep_date));
            var assign_date = sdate.getFullYear() + "-" + (sdate.getMonth()+1) + "-" + sdate.getDate();
            var dateNow = new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate();
            if(assign_date == dateNow)
                return true;
            else 
                return false;
        } else {
            return false;
        }
    }

    pushNotification(pushNotification, selectorId){
        pushNotification().then(async ({data}) => {
            toastr.clear()
            toastr.success("Message successfully sent!","Success!");
            document.getElementById(selectorId).click();
            this.setState({ privateMessage: '' })
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    head() {
        return (
            <Helmet>
                <title>Sales Representative - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        return (
            <div className="admin page-container">
                {this.head()}
                <div className="users_wrap clear_fix">
                    <div className="text-center">
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
                                offset: (this.state.pageNumber-1) * this.state.pageSize,
                                sort: this.state.sortPrivilege
                            }}>
                            {({ data, loading, refetch, error }) => {
                                if (loading) return <div className="text-center"><Loading height={200} width={200} /></div>;
                                if (error) return <tbody><tr><td colSpan='11' className="text-center">Error</td></tr></tbody>
                                return (
                                    <div>
                                        <div className="form_wrap text-right">
                                            <div className="form_row">
                                                <div className="form_item">
                                                    <div className="form_buttons form_input">
                                                        <div className="column column_4_12 text-right">
                                                            <label style={{width: '20%'}}>Join Date: </label>
                                                            <select className="dropbtn" value={this.state.displayDate} onChange={this.handleFilterDateChange.bind(this)} style={{borderBottom: '1px solid #00bf60', margin: '0 5px'}}>
                                                                <option value="0">Today</option>
                                                                <option value="1">Yesterday</option>
                                                                <option value="7">Last 7 Days</option>
                                                                <option value="other">other</option>
                                                            </select>
                                                            {this.state.displayDate == "other" &&
                                                                <div>
                                                                    <input type="date" value={this.state.fromDate} onChange={this.handleFromDate.bind(this)} name="from" style={{width: '38%', margin: '0 5px', padding: '10px 0', borderBottom: '1px solid #00bf60'}}/>
                                                                    <input type="date" value={this.state.toDate} onChange={this.handleToDate.bind(this)} name="to" style={{width: '38%', margin: '0 5px', padding: '10px 0', borderBottom: '1px solid #00bf60'}}/> <br/> <br/>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="column column_4_12">
                                                            <label>Sort Privilege: </label>
                                                            <select className="dropbtn" value={this.state.sortPrivilege} onChange={this.handleSortPrivilege.bind(this)} style={{borderBottom: '1px solid #00bf60', margin: '0 5px'}}>
                                                                <option value="">Default</option>
                                                                <option value="Asc">Ascending</option>
                                                                <option value="Desc">Descending</option>
                                                            </select>
                                                            <select className="dropbtn" value={this.state.selectedPrivilege} onChange={this.handleSelectedPrivilege.bind(this)} style={{borderBottom: '1px solid #00bf60', margin: '0 5px'}}>
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
                                                            <input type="text" placeholder="Search user by first name, last name or email" id="search-area" style={{width: '70%', borderBottom: '1px solid #ccc'}} /> &nbsp;&nbsp;
                                                            <button className="btn" style={{width: '27%', padding: '7px 9px'}} onClick={this.handleSearch.bind(this)}>Search</button>
                                                            <br/><br/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <table className="table-list">
                                            <thead>
                                                <tr>
                                                    <th onClick={() => this.sortMessage()} style={{cursor: 'pointer'}}>
                                                        <span className="fas fa-envelope"></span>
                                                        <div className="float-right">
                                                            <span className={this.state.sortMessage == "Asc" ? "fas fa-caret-down" : "fas fa-caret-up"}></span>
                                                        </div>
                                                    </th>
                                                    <th className="text-center">FB</th>
                                                    <th className="text-center">View</th>
                                                    <th>Join Date</th>
                                                    <th className="text-center" style={{minWidth: 100}}>
                                                        Privilege
                                                        <div className="float-right">
                                                            <span className={this.state.sortPrivilege == "Asc" ? "fas fa-caret-down" : "" || this.state.sortPrivilege == "Desc" ? "fas fa-caret-up" : ""}></span>
                                                        </div>
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
                                                        <td colSpan='12' className="text-center">{this.isFilterEnable() ? 'No Result Found.' : 'Empty... check back soon!'}</td>
                                                    </tr>
                                                }
                                                {data.getAllUsers.map((user, index) => (
                                                    <tr key={index} style={{backgroundColor: this.setNow(user.sales_rep_date) ? 'yellow' : user.kartra_tags.includes("PLG_Failed") ? '#ff000066' : '#fff'}}>
                                                        <td className="text-center" style={{whiteSpace: 'nowrap'}}>
                                                            <Popup
                                                                trigger={<i className="far fa-sticky-note" style={{color: '#f07a06', cursor:'pointer'}} title="Send a Note"></i>}
                                                                position="right center"
                                                                on="click" className="points-tooltip">
                                                                <div style={{padding: '5px 20px', position: 'relative'}}>
                                                                    <h3>Notes</h3>
                                                                    <div className="message-popup text-left word-wrap">
                                                                        {(() => {
                                                                            var newNotes = [].concat(user.sales_rep_notes)
                                                                            if(newNotes.length == 0){
                                                                                return (
                                                                                    <div className="product-card">
                                                                                        <div className="product-details text-center">
                                                                                            <span style={{fontStyle: 'italic', color: '#7e7e7e'}}>No notes found to this user</span>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                            return newNotes.sort(function(a,b){return b.date_request - a.date_request}).map((note, n) => {
                                                                                return(
                                                                                    <div className="product-card" id={note.id} key={n}>
                                                                                        <div className="product-details">
                                                                                            <div className="float-right">
                                                                                                <span className="fas fa-times" style={{color: 'red', cursor:'pointer'}} title="Remove This Note" onClick={this.removeNotes.bind(this, user.id, note.id, refetch)}></span>
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
                                                                trigger={<i className="fas fa-envelope" style={{color: 'green', cursor:'pointer'}} title="Click to open message"></i>}
                                                                position="right center"
                                                                on="click" className="points-tooltip">
                                                                <div style={{padding: '5px 20px'}}>
                                                                    <h3>User Requested Help</h3>
                                                                    <div className="message-popup text-left word-wrap">
                                                                        {(() => {
                                                                            var newHelp = [].concat(user.help_request_message)
                                                                            return newHelp.sort(function(a,b){return b.date_request - a.date_request}).map((help, h) => {
                                                                                return(
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
                                                            : <i className="fas fa-envelope" style={{opacity: 0}}></i>}
                                                            {user.privilege == 3 ? // User Privilege
                                                                <i className="fas fa-circle" style={{ color: 'red' }} title="Full User"></i> : <i className="fas fa-circle" style={{ opacity: 0 }}></i>}
                                                            {user.purchase_dfy ? <i className="fas fa-circle" style={{color: 'yellow'}} title="Bought PLG Theme"></i>
                                                            : <i className="fas fa-circle" style={{opacity: 0}}></i>}
                                                            {user.privilege == 4 ? <i className="fas fa-circle" style={{color: 'blue'}} title="VIP User"></i>
                                                            : <i className="fas fa-circle" style={{opacity: 0}}></i>}
                                                            {parseFloat(user.total_exprenses ? user.total_exprenses : 0).toFixed(2) >= 300 ? <i className="fab fa-hotjar" style={{color: 'red'}} title="Above $300 Total Spent"></i>
                                                            : <i className="fab fa-hotjar" style={{opacity: 0}}></i>}
                                                        </td>
                                                        <td className="text-center">{user.fb_link ? <a href={user.fb_link} target="_blank" title={user.fb_link}>View</a> : ''}</td>
                                                        <td className="text-center">
                                                            <NavLink to={`profile/${user.id}`}>
                                                                <span className="fas fa-eye"></span>
                                                            </NavLink>
                                                        </td>
                                                        <td>{new Date(parseInt(user.joinDate)).toLocaleDateString()}</td>
                                                        <td className="text-center">{"(LVL: "+user.privilege+")"}</td>
                                                        <td>
                                                            <Popup
                                                                trigger={<span className="clickable" id={"pm" + user.id}>{user.firstName+" "+user.lastName}</span>}
                                                                position="top center"
                                                                on="click" className="points-tooltip">
                                                                <div className="text-center funnel" style={{ padding: 10 }}>
                                                                    <h3>Compose message to user</h3>
                                                                    <textarea rows="6" className="message-area font-roboto-light stretch-width row-separator" name="privateMessage" value={this.state.privateMessage} onChange={event => this.setState({ [event.target.name]:  event.target.value })} style={{ fontSize: '0.875em' }} />
                                                                    <Mutation
                                                                        mutation={PUSH_NOTIFICATION}
                                                                        variables={{ id: user.id, sendTo: null, type: "info", message: this.state.privateMessage }}>
                                                                        {(pushNotification, { data, loading, error }) => {
                                                                            return <button className="btn-success stretch-width" onClick={() => this.pushNotification(pushNotification, "pm" + user.id)} disabled={loading}>Send</button>;
                                                                        }}
                                                                    </Mutation>
                                                                </div>
                                                            </Popup>
                                                        </td>
                                                        <td>
                                                            <div className="table-email">
                                                                <a href={"mailto:"+user.email}>{user.email}</a>
                                                            </div>
                                                        </td>
                                                        <td className="text-center">{"$"+parseFloat(user.total_exprenses ? user.total_exprenses : 0).toFixed(2)}</td>
                                                        <td className="text-center">{points.commafy(user.total_points)}</td>
                                                        <td className="text-center"><a href={user.store_url ? "https://"+user.store_url.replace("https://","") : ''} target="_blank">Visit</a></td>
                                                        <td className="text-center">{user.store_phone}</td>
                                                    </tr>
                                                ))}
                                            </tbody>

                                            {data.getAllUsers.length != 0 &&
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan='8' style={{lineHeight: 1.5}}>
                                                            {"Page: "+this.state.pageNumber} <span style={{margin: '0 50px'}}>{"Total Users: "+data.getAllUsers[0].count}</span> {this.isFilterEnable() ? "Search Found: "+data.getAllUsers[0].queryCount : ''}
                                                        </td>
                                                        <td colSpan='3' className="text-center"> See users by: 
                                                            <select className="dropbtn" value={this.state.pageSize} onChange={this.handlePageCount.bind(this)} style={{borderBottom: '1px solid #00bf60', margin: '0 5px', padding: '4px 10px'}}>
                                                                <option value="20">20</option>
                                                                <option value="30">30</option>
                                                                <option value="50">50</option>
                                                            </select>
                                                        </td>
                                                        <td width="20%" className="form_buttons" style={{whiteSpace: 'nowrap'}}>
                                                            <button className="btn" style={{padding: '5px'}} onClick={() => this.changePageNumber(false)} disabled={this.state.pageNumber == 1 ? true : false}>Prev</button> | &nbsp;
                                                            <button className="btn" style={{padding: '5px'}} onClick={() => this.changePageNumber(true)} disabled={this.checkNext(this.isFilterEnable() ? data.getAllUsers.length : data.getAllUsers[0].count)}>Next</button>
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


export default withAuth(session => session && session.getCurrentUser)(SalesRepresentative);