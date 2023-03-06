import React from 'react';
import toastr from 'toastr';
import moment from 'moment';
import withAuth from './../hoc/withAuth';
import { Helmet } from 'react-helmet';
import { Query } from 'react-apollo';
import { GET_FUNNEL_LIST } from '../queries';
import Loading from '../components/loading';
import Pagination from '../components/pagination';
import SelectTag from '../components/selectTag';
import SearchField from '../components/searchField';
import DateRange from '../components/dateRange';
import ShowFilter from '../components/showFilter';
const points = require('../../Global_Values');

let filter = {
    currentPage: 1,
    resultPerPage: 30,
    name_or_email: "",
    funnel_object: "",
    date_range_start: "",
    date_range_end: ""
}

class FunnelLeads extends React.Component {
    constructor() {
        super();
        this.state = {
            leads_loading: true,
            myLeads: [],
            export_loading: false,
            totalLeads: 0,
            ...filter
        }
    }

    componentDidMount() {
        toastr.options = points.toastrInitialize();
        // let userid = "5c34100f12101523a70989cb";
        let userid = this.props.session.getCurrentUser.id;
        var payload = { "query": "{ everyLeadsbyCreator(creatorID: \"" + userid + "\"){ firstName lastName email phone tags purchased abandonProduct date funnelID } }", "variables": null, "operationName": null };
        points.customFetch('https://stats.productlistgenie.io/graphql', 'POST', payload, result => {
            let lead_length = result.data && result.data.everyLeadsbyCreator ? result.data.everyLeadsbyCreator.length : 0;
            this.setState({ leads_loading: false, myLeads: lead_length ? result.data.everyLeadsbyCreator : [], totalLeads: lead_length })
        })
    }

    exportToCSV() {
        let data = this.filterResult(true), rows = [["Date", "Name", "Email", "Phone", "Tags", "Abandoned Product"]];
        points.toastrPrompt(toastr, "info", "Exporting please wait...");
        this.setState({ export_loading: true }, () => {
            data.forEach(el => {
                rows.push([
                    new Date(parseInt(el.date)).toDateString() + " " + new Date(parseInt(el.date)).toLocaleTimeString(),
                    el.firstName + (el.lastName ? " " + el.lastName : ""),
                    el.email,
                    el.phone,
                    el.tags,
                    el.abandonProduct
                ]);
            });
            let uri = points.exportDataToUri(rows);
            points.exportDataToCSV(uri, "My Leads (" + new Date().toDateString().substring(4) + ")");
            this.setState({ export_loading: false });
            points.toastrPrompt(toastr, "success", "Export Success!");
        });
    }

    saveState(event) {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({ [name]: value, currentPage: 1 });
    }

    filterResult(ignore_pagination) {
        let state = this.state, data = state.myLeads;
        if (state.name_or_email) {
            let search = state.name_or_email;
            data = data.filter(e => {
                let fName = e.firstName || "", lName = e.lastName || "", email = e.email || "";
                if (fName.toLowerCase().includes(search.toLowerCase()) || lName.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase())) {
                    return e;
                }
            });
        }
        if (state.funnel_object) {
            let { ids } = JSON.parse(state.funnel_object);
            data = data.filter(e => ids.includes(e.funnelID));
        }
        if (state.date_range_start && state.date_range_end) {
            let date_start = new Date(points.sendDateToServer(state.date_range_start, true)).getTime(),
                date_end = new Date(points.sendDateToServer(state.date_range_end)).getTime();
            data = data.filter(e => {
                let date = parseInt(e.date);
                if (date >= date_start && date <= date_end) {
                    return e;
                }
            });
        }
        let start = (state.currentPage - 1) * state.resultPerPage, end = state.currentPage * state.resultPerPage;
        return ignore_pagination ? data : data.slice(start, end);
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Funnel Leads - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        let state = this.state, currentUser = this.props.session.getCurrentUser, per_page = this.state.resultPerPage, totalPage = this.filterResult(true).length, result = this.filterResult();
        return (
            <div className="funnel">
                {this.head()}
                <div className="newPageHeader" style={{ paddingBottom: 10 }}>
                    <div className="column column_3_12 row-separator">
                        <span className="hide-in-desktop float-left" style={{ padding: 15 }} />
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>Funnel Leads List</h4>
                        <label style={{ color: '#878787' }}>You have <span id="funnel_count" className="font-bold" style={{ color: '#23c78a' }}>{state.totalLeads}</span> Leads</label>
                    </div>
                    <div className="column column_2_12 row-separator">
                        <DateRange start={state.date_range_start || new Date()} end={state.date_range_end || new Date()} onRangeChange={date => this.setState({ date_range_start: date.start, date_range_end: date.end, currentPage: 1 })}>
                            <div className="stretch-width custom-select">
                                <div className="select-selected text-left">Date</div>
                            </div>
                        </DateRange>
                    </div>
                    <div className="column column_3_12 row-separator">
                        <div style={{ position: 'relative', padding: 0 }}>
                            <SearchField
                                name="name_or_email"
                                value={state.name_or_email}
                                placeHolder="Search Lead Name or Email"
                                tooltip="Search by Name or Email"
                                containerClassName="stretch-to-mobile"
                                onSubmit={value => this.setState({ name_or_email: value, currentPage: 1 })}
                            />
                        </div>
                    </div>
                    <div className="column column_2_12 row-separator">
                        <Query query={
                            GET_FUNNEL_LIST(`{ id date_modified domain_name funnel_name page_count old_page_ids }`)
                        } variables={{ creator: currentUser.id, limit: 0 }}>
                            {({ data, loading, refetch, error }) => {
                                if(loading || error) return null;
                                var options = [<option key={0} value="">All Funnels</option>];
                                if(data.getFunnelList.length !== 0) {
                                    data.getFunnelList.forEach((funnel, i) => {
                                        let option_value = { funnel_name: points.presentableFunnelName(funnel.funnel_name), ids: funnel.old_page_ids.concat(funnel.id) };
                                        options.push(<option key={i + 1} value={JSON.stringify(option_value)}>{option_value.funnel_name}</option>);
                                    })
                                }
                                return <SelectTag name="funnel_object" value={state.funnel_object} options={options} onChange={event => this.saveState(event)} />
                            }}
                        </Query>
                    </div>
                    <div className="column column_2_12 text-right row-separator">
                        <button className="btn-success stretch-width" onClick={() => this.exportToCSV()} disabled={state.export_loading || (state.totalLeads === 0 ? true : false)}>Export to CSV</button>
                    </div>
                    <span className="clear" />
                </div>
                <div className="column column_8_12">
                    <div className="display-inline" style={{ margin: '10px 0 0' }}>
                        {state.date_range_start && state.date_range_end ?
                            <ShowFilter label={state.date_range_start + " - " + state.date_range_end} onClick={() => this.setState({ date_range_start: "", date_range_end: "" })} />
                        : void 0}
                        {state.name_or_email &&
                            <ShowFilter label={"Search: " + state.name_or_email} onClick={() => this.setState({ name_or_email: "" })} />
                        }
                        {state.funnel_object &&
                            <ShowFilter label={"Funnel: " + JSON.parse(state.funnel_object).funnel_name} onClick={() => this.setState({ funnel_object: "" })} />
                        }
                        &nbsp;
                    </div>
                </div>
                <div className="column column_4_12">
                    <Pagination displayPageCount={per_page} totalPage={totalPage} currentPage={state.currentPage} action={result => this.setState({ currentPage: result })} style={{ margin: '10px 10px 0' }} />
                </div>
                <div className="clear" />
                {(() => {
                    if(state.leads_loading) {
                        return (
                            <div className="center-vertical text-center" style={{ height: '65vh' }}>
                                <Loading width={300} height={300} />
                            </div>
                        );
                    } else {
                        if(result.length === 0) {
                            return (
                                <div className="center-vertical-parent" style={{ height: '65vh', width: '100%' }}>
                                    <div className="center-vertical">
                                        <img src="/assets/graphics/no-result.svg" style={{ height: '40vh' }} />
                                        <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! NO RESULT FOUND!</h4> <br />
                                        <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>Try different filter</label>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div>
                                    <div className="flex-container clear" style={{ justifyContent: 'start' }}>
                                        {result.map((el, eli) => {
                                            return (
                                                <div className="product-card" style={{ border: '1px solid #dfe5eb', width: 285, margin: 10 }} key={eli}>
                                                    <div className="product-details display-inline" style={{ margin: '5px 0', width: '100%' }}>
                                                        <span className="fas fa-user-circle color-green" style={{ fontSize: 40, marginRight: 15 }} />
                                                        <div className="one-line-ellipsis" style={{ width: '-webkit-fill-available' }}>
                                                            <label className="header-medium-bold">{points.capitalizeWord(el.firstName + (el.lastName ? " " + el.lastName : ""))}</label>
                                                            <label className="color-green">{el.email}</label><br />
                                                            <label>{el.phone}</label><br />
                                                            <label>{moment(parseInt(el.date)).local().format("MMMM DD, YYYY")}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        }
                    }
                })()}
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(FunnelLeads);