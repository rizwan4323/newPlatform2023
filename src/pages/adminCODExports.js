import React from 'react';
import toastr from 'toastr';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
import { GET_ALL_TIME_BUYERS_COUNT } from '../queries';
import { Query } from 'react-apollo';
import Pagination from '../components/pagination';
const points = require('../../Global_Values');

class AdminCODExports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            export_mode: "csv",
            sau_loading: true,
            sau_page: 1,
            uae_loading: true,
            uae_page: 1
        }
    }

    componentDidMount() {
        toastr.options = points.toastrInitialize();
    }

    exportData(param){
        let payload = {}, export_name = "", export_mode = this.state.export_mode;
        points.toastrPrompt(toastr, "info", "Exporting please wait...");

        if (param == "all_buyers_list_sau") {
            payload = { country: ["SA", "SAU"], page: this.state.sau_page };
            export_name = "All Buyer List SAU";
        } else if (param == "all_buyers_list_uae") {
            payload = { country: ["AE", "ARE"], page: this.state.uae_page };
            export_name = "All Buyer List UAE";
        } else if (param == "90_days_buyers_list_sau") {
            payload = { date: points.sendDateToServer(points.getPastDate(89), true), country: ["SA", "SAU"] };
            export_name = "Buyer List SAU in the past 90 days";
        } else if (param == "90_days_buyers_list_uae") {
            payload = { date: points.sendDateToServer(points.getPastDate(89), true), country: ["AE", "ARE"] };
            export_name = "Buyer List UAE in the past 90 days";
        } else if (param == "top_10_products") {
            payload = { display: "top_10_products" };
            export_name = "Top 10 Products of All time";
        } else if(param.includes("top_clients_")) {
            let top_count = param.split("_");
            top_count = top_count[top_count.length-1];
            payload = { display: param };
            export_name = "Top " + top_count + " Product that clients are selling";
        } else if (param.includes("all_buyers_product_top_")) {
            let top_count = param.split("_");
            top_count = top_count[top_count.length-1];
            
            payload = { display: "buyers_product_top_" + top_count };
            export_name = "Top " + top_count + " Product Buyers of All time";
        } else if (param.includes("90_buyers_product_top_")) {
            let top_count = param.split("_");
            top_count = top_count[top_count.length-1];
            
            payload = { date: points.sendDateToServer(points.getPastDate(89), true), display: "buyers_product_top_" + top_count };
            export_name = "Top " + top_count + " Product Buyers in the past 90 days";
        } else {
            points.toastrPrompt(toastr, "warning", "Invalid Params");
        }

        payload.export = "funnel_orders"; // reference lang sa server.js
        points.customFetch("/api/exportDataToCSV", "POST", payload, data => {
            if(data && data.status == "success"){
                points.exportDataToCSV(data.uri, export_name);
                points.toastrPrompt(toastr, "success", "Export Success.");
            } else {
                let error_message = data && data.message ? data.message : "Export Error";
                points.toastrPrompt(toastr, "warning", error_message);
            }
        })
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>COD Export CSV - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const state = this.state;
        return (
            <div className="admin funnel">
                {this.head()}
                <div className="newPageHeader">
                    <div className="column column_4_12">
                        <span className="hide-in-desktop float-left" style={{padding: 15}} />
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>COD Export CSV</h4>
                    </div>
                    <span className="clear" />
                </div>
                <div className="page-container">
                    <div className="column column_12_12 row-separator">
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em' }}>LIST OF BUYERS</h4>
                    </div>
                    <div className="column column_12_12 row-separator" style={{ padding: 0 }}>
                        <div className="column column_6_12 row-separator">
                            <Query query={GET_ALL_TIME_BUYERS_COUNT} variables={{ location: "sau" }} onCompleted={data => {
                                if(data.getAllTimeBuyersCount.count != 0) this.setState({ sau_loading: false });
                            }}>
                                {({ data, loading, refetch, error }) => {
                                    if(loading || error) return null;
                                    return <Pagination className="row-separator" currentPage={state.sau_page} totalPage={data.getAllTimeBuyersCount.count || 1} displayPageCount={1000} action={result => this.setState({ sau_page: result })} />;
                                }}
                            </Query>
                            <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("all_buyers_list_sau")} disabled={state.sau_loading}>List of ALL buyer All Time from Saudi Arabia</button>
                        </div>
                        <div className="column column_6_12 row-separator">
                            <Query query={GET_ALL_TIME_BUYERS_COUNT} variables={{ location: "are" }} onCompleted={data => {
                                if(data.getAllTimeBuyersCount.count != 0) this.setState({ uae_loading: false });
                            }}>
                                {({ data, loading, refetch, error }) => {
                                    if(loading || error) return null;
                                    return <Pagination className="row-separator" currentPage={state.uae_page} totalPage={data.getAllTimeBuyersCount.count || 1} displayPageCount={1000} action={result => this.setState({ uae_page: result })} />;
                                }}
                            </Query>
                            <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("all_buyers_list_uae")} disabled={state.uae_loading}>List of ALL buyers All Time from United Arab Emirates</button>
                        </div>
                        <div className="column column_6_12 row-separator">
                            <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("90_days_buyers_list_sau")}>List of ALL buyers the Past 90 Days from Saudi Arabia</button>
                        </div>
                        <div className="column column_6_12 row-separator">
                            <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("90_days_buyers_list_uae")}>List of ALL buyers the Past 90 Days from United Arab Emirates</button>
                        </div>
                    </div>
                    <div className="column column_6_12 row-separator" style={{ padding: 0 }}>
                        <div className="column column_12_12 row-separator">
                            <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("all_buyers_product_top_1")}>List of ALL Buyers All Time Top Product 1</button>
                        </div>
                        <div className="column column_12_12 row-separator">
                            <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("all_buyers_product_top_2")}>List of ALL Buyers All Time Top Product 2</button>
                        </div>
                        <div className="column column_12_12 row-separator">
                            <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("all_buyers_product_top_3")}>List of ALL Buyers All Time Top Product 3</button>
                        </div>
                        <div className="column column_12_12 row-separator">
                            <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("all_buyers_product_top_4")}>List of ALL Buyers All Time Top Product 4</button>
                        </div>
                        <div className="column column_12_12 row-separator">
                            <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("all_buyers_product_top_5")}>List of ALL Buyers All Time Top Product 5</button>
                        </div>
                    </div>
                    <div className="column column_6_12 row-separator" style={{ padding: 0 }}>
                        <div className="column column_12_12 row-separator">
                            <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("90_buyers_product_top_1")}>List of ALL buyers the Past 90 Days Top Product 1</button>
                        </div>
                        <div className="column column_12_12 row-separator">
                            <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("90_buyers_product_top_2")}>List of ALL buyers the Past 90 Days Top Product 2</button>
                        </div>
                        <div className="column column_12_12 row-separator">
                            <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("90_buyers_product_top_3")}>List of ALL buyers the Past 90 Days Top Product 3</button>
                        </div>
                        <div className="column column_12_12 row-separator">
                            <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("90_buyers_product_top_4")}>List of ALL buyers the Past 90 Days Top Product 4</button>
                        </div>
                        <div className="column column_12_12 row-separator">
                            <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("90_buyers_product_top_5")}>List of ALL buyers the Past 90 Days Top Product 5</button>
                        </div>
                    </div>
                    <div className="column column_12_12 row-separator">
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em' }}>LIST OF TOP PRODUCTS</h4>
                    </div>
                    <div className="column column_12_12 row-separator">
                        <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("top_10_products")}>List of Top 10 products</button>
                    </div>
                    <div className="column column_12_12 row-separator">
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em' }}>LIST OF MEMBERS</h4>
                    </div>
                    <div className="column column_4_12 row-separator">
                        <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("top_clients_1")}>Top 1 Product that clients are selling</button>
                    </div>
                    <div className="column column_4_12 row-separator">
                        <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("top_clients_2")}>Top 2 Product that clients are selling</button>
                    </div>
                    <div className="column column_4_12 row-separator">
                        <button className="btn-success stretch-width" style={{ fontSize: '1.2em' }} onClick={() => this.exportData("top_clients_3")}>Top 3 Product that clients are selling</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AdminCODExports);