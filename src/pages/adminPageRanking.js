import React from 'react';
import toastr from 'toastr';
import moment from 'moment';
import { Link } from 'react-router-dom';
import withAuth from '../hoc/withAuth';
import ShowFilter from '../components/showFilter';
import Pagination from '../components/pagination';
import Loading from '../components/loading';
import ButtonWithPopup from '../components/buttonWithPopup';
import SelectTag from '../components/selectTag';
import Checkbox from '../components/checkbox';
import LoadingPage from '../components/loadingPage';
import Modal from '../components/ModalComponent';
import { GET_FUNNEL_ORDER_CREATOR_LIST, GET_MY_PAY_CHECK, GET_COMMISSION_CREATOR_LIST, GET_PURCHASE_ORDER, GET_FUNNEL_ORDERS, MARK_ALL_COMMISSION_AS_PAID, GET_PLG_PAYCHECK, GET_USER_BY_ID } from '../queries';
import { Query, Mutation } from 'react-apollo';
import { Table, Tbody } from '../components/table';
import InfiniteCalendar, { Calendar, withRange, } from 'react-infinite-calendar';
import { Helmet } from 'react-helmet';
const CalendarWithRange = withRange(Calendar);
const points = require('../../Global_Values');

class AdminPageRanking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterByStartDate: "",
            filterByEndDate: "",
            is_page_loading: true,
            resuldata: null,
        }
    }


    componentDidMount() {
        // points.customFetch(`https://stats.productlistgenie.io/graphql`, "POST",)
        let past7days = points.getPastDate(6, true);
        this.setState({
            filterByStartDate: past7days.toDateString(),
            filterByEndDate: new Date().toDateString(),
        }, () => this.fetchRanking());

    }

    filterDate(data) {
        if (data.eventType == 3) {
            this.setState({
                currentPage: 1,
                filterByStartDate: data.start.toDateString(),
                filterByEndDate: data.end.toDateString()
            }, () => this.fetchRanking());
        }
    }

    fetchRanking() {
        const dateFrom = points.sendDateToServer(this.state.filterByStartDate);
        const dateTo = points.sendDateToServer(this.state.filterByEndDate);
        this.setState({
            is_page_loading: true
        })

        points.customFetch('https://stats.productlistgenie.io/graphql', 'POST', {
            query: `
            {
                everyPageByDate(purchased: true, from: "${dateFrom}", to: "${dateTo}") {
                    date
                    id
                    funnelName
                    purchased
                    pageURL
                    creatorID
                    conversion
                    pageType
                    pageID
                }
            }
            `
        }, result => {
            try {
                console.log(result.data);
                const newdata = this.convert(result.data.everyPageByDate);
                newdata.sort((a, b) => b.count - a.count).length = 10;

                this.setState({
                    is_page_loading: false,
                    resuldata: newdata
                });

            } catch (error) {
                console.log(error, "this was it");
                this.setState({
                    is_page_loading: false,
                    resuldata: null
                });
            }
        });

        // points.presentableFunnelName()

    }


    cleanURL(url) {
        return url.toLocaleLowerCase().trim(" ").replace(/\s/g, '').match(/(?!http(s?):\/)([\w]+\.){1}([\w]+\.?)+/g, "")[0];
    }


    convert(arr) {
        const res = {};
        arr.forEach((obj) => {
            const key = `${this.cleanURL(obj.pageURL)}`;
            if (!res[key]) {
                res[key] = { ...obj, count: 0 };
            };
            res[key].count += 1;
        });
        return Object.values(res);
    };

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Admin Ranking Page - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const state = this.state;
        const tableDataFontSize = '1.2em';

        // const currentUser
        return (
            <div className="admin funnel">
                {this.head()}
                <div className="newPageHeader">
                    <div className="column column_4_12">
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>Admin Page Ranking</h4>
                    </div>
                    <span className="clear" />
                </div>
                <span className="clear" />
                <div className="filter-container" style={{ margin: 10, backgroundColor: '#f3f8fe' }}>
                    <ButtonWithPopup data={{
                        triggerDOM: <div className="custom-select" style={{ margin: '0 5px', width: 150 }}>
                            <div className="select-selected stretch-width text-left">Date</div>
                        </div>,
                        popupPosition: "bottom right",
                        text: <div className="infinite-calendar">
                            <InfiniteCalendar
                                Component={CalendarWithRange}
                                width={"100%"}
                                height={400}
                                selected={{
                                    start: state.filterByStartDate ? state.filterByStartDate : new Date(),
                                    end: state.filterByEndDate ? state.filterByEndDate : new Date(),
                                }}
                                locale={{
                                    headerFormat: 'MMM Do',
                                }}
                                onSelect={data => this.filterDate(data)}
                                theme={points.infiniteCalendarTheme()}
                            />
                        </div>,
                        loading: false,
                        padding: 0,
                        style: { width: 320 },
                        checkORtimesButton: false
                    }} />
                </div>
                <div className="page-container" style={{ justifyContent: 'flex-start' }}>
                    {/* {state.currentPage > 1 &&
                        <ShowFilter label={"Page: " + state.currentPage} onClick={() => this.setState({ currentPage: 1 })} />
                    }
                    {state.search_user &&
                        <ShowFilter label={"User Email: " + state.search_user} onClick={() => this.setState({ search_user: "", search_user_input: "" })} />
                    }
                     */}
                    {state.filterByStartDate && state.filterByEndDate ?
                        <ShowFilter label={"Date Range: " + state.filterByStartDate + " - " + state.filterByEndDate} close={false} />
                        : void 0}
                </div>
                <div className="page-container">
                    <Table headers={[{ text: "Rank" }, { text: "Owner Email" }, { text: "Funnel Name" }, { text: "Count" }, { text: "Page URL" }]} containerStyle={{ fontSize: '0.9em', padding: 10 }} >
                        {state.is_page_loading && <Tbody loading={true} />}
                        {(state.resuldata === null && !state.is_page_loading) && <Tbody singleRowText={"An error has occurred please try again."} style={{ fontSize: tableDataFontSize }} />}
                        {(state.resuldata && state.resuldata.length === 0 && !state.is_page_loading) && <Tbody singleRowText={"No payouts found. check back soon!"} style={{ fontSize: tableDataFontSize }} />}
                        {(state.resuldata && state.resuldata.length !== 0 && !state.is_page_loading) && state.resuldata.map((rank, index) => {
                            return (
                                <Tbody id={"row_" + index} index={index} key={index} style={{ fontSize: tableDataFontSize }}>
                                    <div>
                                        <label style={{ color: '#27c586', fontWeight: "bold", fontSize: "2rem" }}># {index + 1}</label>
                                    </div>
                                    <div>
                                        <Query query={GET_USER_BY_ID(`{ email }`)} variables={{ id: rank.creatorID }} notifyOnNetworkStatusChange>
                                            {({ data, loading, refetch, error }) => {
                                                if (loading) return <label><Loading height={30} width={30} /></label>;
                                                else if (error) return <label>Error Occured Please try again.</label>;
                                                else if (data.getUserById === null) {
                                                    return <label>User Not Found!</label>;
                                                }
                                                return <label> {data.getUserById.email} </label>;
                                            }}
                                        </Query>
                                    </div>
                                    <div>
                                        <label>{points.presentableFunnelName(rank.funnelName)}</label>
                                    </div>
                                    <div>
                                        <label>{rank.count}</label>
                                    </div>
                                    <div>
                                        <label style={{ color: '#27c586', fontWeight: "bold", fontSize: "1.5rem", cursor: "pointer" }} onClick={() => {
                                            window.open(`https://${this.cleanURL(rank.pageURL)}`, "_blank");
                                        }}>{`https://${this.cleanURL(rank.pageURL)}`}</label>
                                    </div>
                                </Tbody>
                            );
                            // return <div>{JSON.stringify(rank)}</div>
                        })}
                        {/* 
                        
            
            
                        <Query query={GET_FUNNEL_ORDER_CREATOR_LIST}
                            variables={{
                                userEmail: state.search_user,
                                fulfillerLocation: state.floc,
                                dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                page: state.currentPage,
                                show_vip: state.show_vip
                            }}
                            onCompleted={data => this.setState({ totalPayoutCount: data.getMyFunnelOrderCreatorList && data.getMyFunnelOrderCreatorList.length != 0 ? data.getMyFunnelOrderCreatorList[0].count : 0, totalPayouts: data.getMyFunnelOrderCreatorList && data.getMyFunnelOrderCreatorList.length != 0 ? data.getMyFunnelOrderCreatorList[0].totalPayout : 0 })} notifyOnNetworkStatusChange>
                            {({ data, loading, refetch, error }) => {
                                if (loading) return <Tbody loading={true} />;
                                else if (error) return <Tbody singleRowText={"An error has occurred please try again."} style={{ fontSize: tableDataFontSize }} />;
                                else if (data.getMyFunnelOrderCreatorList.length == 0) return <Tbody singleRowText={"No payouts found. check back soon!"} style={{ fontSize: tableDataFontSize }} />;
                                return data.getMyFunnelOrderCreatorList.map((user, index) => {
                                    const userData = JSON.parse(user.userData);
                                    var openNewUrl = '/dashboard?key=' + currentUser.pass_key + '&loc=' + state.floc + '&userID=' + user.creator + '&userEmail=' + userData.email;
                                    if (state.filterByStartDate && state.filterByEndDate) {
                                        openNewUrl += '&dateStart=' + new Date(state.filterByStartDate).getTime() + '&dateEnd=' + new Date(state.filterByEndDate).getTime();
                                    }
                                    return (
                                        <Tbody id={"row_" + index} index={index} key={index} style={{ fontSize: tableDataFontSize }}>
                                            <div className="clickable display-inline" onClick={() => {
                                                if (!user.on_hold) {
                                                    window.open(openNewUrl, '_blank');
                                                } else {
                                                    toastr.clear();
                                                    toastr.options.timeOut = 2000;
                                                    toastr['warning']("User order was on hold.", "Order was Hold")
                                                }
                                            }}>
                                                <span className="color-white display-inline flex-container" style={{ width: 25, height: 25, backgroundColor: userData.privilege != 0 ? '#27c586' : '#d63031', borderRadius: '50%', marginRight: 10 }}>{userData.privilege ? userData.privilege : "X"}</span>
                                                <label>{userData.email}</label>
                                            </div>
                                            <div>
                                                <label>{userData.name}</label>
                                            </div>
                                            <div>
                                                {user.on_hold ? <button onClick={() => {
                                                    points.customFetch(points.clientUrl + '/graphql', "POST", {
                                                        query: `mutation ($ids: [String], $on_hold: Boolean){
                                                                                    updateOrderHold(ids: $ids, on_hold: $on_hold){
                                                                                        id
                                                                                    }
                                                                                }`,
                                                        variables: {
                                                            ids: user.ids,
                                                            on_hold: !user.on_hold
                                                        }
                                                    }, updateResult => {
                                                        refetch();
                                                        if (this.refetchMoneyOnHold) this.refetchMoneyOnHold();
                                                        toastr.clear();
                                                        toastr.options.timeOut = 2000;
                                                        toastr['success'](`Payout was Hold.`, "Update Payout")
                                                    });
                                                }} className="btn-danger font-small">Unhold</button> : <button className="btn-success font-small" onClick={() => {
                                                    points.customFetch(points.clientUrl + '/graphql', "POST", {
                                                        query: `mutation ($ids: [String], $on_hold: Boolean){
                                                                                    updateOrderHold(ids: $ids, on_hold: $on_hold){
                                                                                        id
                                                                                    }
                                                                                }`,
                                                        variables: {
                                                            ids: user.ids,
                                                            on_hold: !user.on_hold
                                                        }
                                                    }, updateResult => {
                                                        refetch();
                                                        if (this.refetchMoneyOnHold) this.refetchMoneyOnHold();
                                                        toastr.clear();
                                                        toastr.options.timeOut = 2000;
                                                        toastr['success'](`Payout was Unhold.`, "Update Payout")
                                                    });
                                                }}>Hold</button>}
                                            </div>
                                            <div>
                                                <Query query={GET_MY_PAY_CHECK}
                                                    variables={{
                                                        creator: user.creator,
                                                        fulfillerLocation: state.floc,
                                                        dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                                        dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                                    }} onCompleted={data => {
                                                        if (data.getMyPayCheck.count < 0) {
                                                            document.getElementById("row_" + index).style.backgroundColor = "#d63031";
                                                            document.getElementById("row_" + index).classList.add("color-white");
                                                        }
                                                    }} notifyOnNetworkStatusChange>
                                                    {({ data, loading, refetch, error }) => {
                                                        if (loading) return <Loading width={30} height={30} style={{ width: 'fit-content' }} />;
                                                        else if (error) return <label>An error has occurred.</label>;
                                                        return <label><strong>${points.commafy(points.getTaxPercent(0.05, parseFloat(data.getMyPayCheck.count)).toFixed(2))}</strong>({points.commafy(data.getMyPayCheck.count.toFixed(2))})</label>;
                                                    }}
                                                </Query>
                                            </div>
                                            <div>
                                                <Query query={GET_MY_PAY_CHECK}
                                                    variables={{
                                                        creator: user.creator,
                                                        fulfillerLocation: state.floc,
                                                        dateStart: state.filterByStartDate ? points.sendDateToServer(state.filterByStartDate, true) : "",
                                                        dateEnd: state.filterByEndDate ? points.sendDateToServer(state.filterByEndDate) : "",
                                                        isAdminPayout: true
                                                    }} onCompleted={data => {
                                                        if (data.getMyPayCheck.count < 0) {
                                                            document.getElementById("row_" + index).style.backgroundColor = "#d63031";
                                                            document.getElementById("row_" + index).classList.add("color-white");
                                                        }
                                                    }} notifyOnNetworkStatusChange>
                                                    {({ data, loading, refetch, error }) => {
                                                        if (loading) return <Loading width={30} height={30} style={{ width: 'fit-content' }} />;
                                                        else if (error) return <label>An error has occurred.</label>;
                                                        return <label className="color-green"><strong>${points.commafy(points.getTaxPercent(0.05, parseFloat(data.getMyPayCheck.count)).toFixed(2))}</strong>({points.commafy(data.getMyPayCheck.count.toFixed(2))})</label>;
                                                    }}
                                                </Query>
                                            </div>
                                        </Tbody>
                                    );
                                });
                            }}
                        </Query> */}
                    </Table>
                </div>

            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AdminPageRanking);
