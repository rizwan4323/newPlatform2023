import React from 'react';
import toastr from 'toastr';
import withAuth from '../hoc/withAuth';
import Loading from '../components/loading';
import moment from 'moment';
import Pagination from '../components/pagination';
import SelectTag from '../components/selectTag';
import ShowFilter from '../components/showFilter';
import LoadingPage from '../components/loadingPage';
import { Query, Mutation } from 'react-apollo';
import { GET_FUNNEL_ORDERS, UPDATE_FUNNEL_ORDERS } from '../queries';
import { Helmet } from 'react-helmet';
const points = require('../../Global_Values');

class AdminManageCODorders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalNonCountryCOD: 0,
            currentPage: 1,
            country: "",
            viewCodOrders: "",
            is_page_loading: true
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
            "timeOut": 0,
            "extendedTimeOut": 0,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        this.setState({ is_page_loading: false });
    }

    setLoadingTime(tiemout, etimeout){
        toastr.options.timeOut = tiemout;
        toastr.options.extendedTimeOut = etimeout;
    }

    updateMyFunnelOrders(updateMyFunnelOrders, refetch){
        this.setLoadingTime(0, 0)
        toastr.clear();
        toastr.info("Loading please wait...","");
        updateMyFunnelOrders().then(({ data }) => {
            this.setLoadingTime(3000, 2000);
            toastr.clear();
            toastr.success("Success","");
            refetch();
        }).catch(error => {
            this.setLoadingTime(0, 0);
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Manage COD Orders - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const state = this.state;
        if(state.is_page_loading) return <LoadingPage />;
        const available_country = points.cod_available_country("no_country");
        return (
            <div className="admin funnel">
                {this.head()}
                <div className="newPageHeader">
                    <div className="column column_4_12">
                        <span className="hide-in-desktop float-left" style={{padding: 15}} />
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>Manage COD Orders (No Country)</h4>
                        <label>Total no country COD: <span className="font-bold" style={{color: '#23c78a'}}>{state.totalNonCountryCOD}</span></label>
                    </div>
                    <div className="column column_8_12">
                        {(() => {
                            var viewCODorders = [<option value={"/dashboard?key="+this.props.session.getCurrentUser.pass_key+"&loc=ALL"} key={0}>View All COD Orders</option>];
                            available_country.forEach((country, key) => {
                                viewCODorders.push(<option value={"/dashboard?key="+this.props.session.getCurrentUser.pass_key+"&loc="+country.iso2} key={key+1}>{country.name}</option>)
                            })
                            return <SelectTag name="viewCodOrders" value={state.viewCodOrders} options={viewCODorders} onChange={event => {
                                this.setState({viewCodOrders: event.target.value}, () => event.target.value ? window.open(event.target.value,"_blank") : void 0);
                            }} style={{width: 200, float: 'right'}} />;
                        })()}
                    </div>
                    <span className="clear" />
                </div>
                <div className="page-container">
                    {state.totalNonCountryCOD != 0 &&
                        <div className="product-card flex-container display-inline" style={{padding: 10, justifyContent: 'flex-end'}}>
                            <Pagination className="stretch-to-mobile" totalPage={state.totalNonCountryCOD} currentPage={state.currentPage} action={result => this.setState({currentPage: result})} style={{marginLeft: 10}} />
                        </div>
                    }
                    {state.currentPage > 1 &&
                        <div className="flex-container" style={{justifyContent: 'flex-start'}}>
                            <ShowFilter label={"Page: "+state.currentPage} onClick={() => this.setState({ currentPage: 1 })} />
                        </div>
                    }
                    <Query query={
                        GET_FUNNEL_ORDERS(`{ plgbuttonID creator count userData order_date orderCreator shipping_information { name email phone street1 street2 city state country zip address_type aptOffice bldgVilla nearestLandmark } line_items { title } }`)
                    } variables={{
                        id: state.selectedUserID,
                        fulfillerLocation: "-",
                        plgbuttonID: "",
                        merchant_type: "cod",
                        skip: state.currentPage - 1,
                        cod_analytics: true
                    }} notifyOnNetworkStatusChange={true} onCompleted={data => this.setState({ totalNonCountryCOD: data.getMyFunnelOrders.length != 0 ? data.getMyFunnelOrders[0].count : 0 })} >
                        {({ data, loading, refetch, error }) => {
                            if(loading) return <div className="text-center"><Loading width={200} height={200} /></div>;
                            if(error) return <div className="text-center" style={{padding: 20}}>An error has occurred.</div>;
                            if(data.getMyFunnelOrders.length == 0) return <div className="text-center" style={{padding: 20}}>It's a good thing we don't have cod order that has no country.</div>;
                            return data.getMyFunnelOrders.map((el,i) => {
                                var creator_data = JSON.parse(el.userData);
                                return (
                                    <div className="product-card" style={{padding: 20}} key={i}>
                                        <div className="column column_12_12 row-separator text-right">
                                            <label className="header-medium-bold">{creator_data.name + " - " + creator_data.email}</label>
                                        </div>
                                        <div className="column column_3_12">
                                            <div className="row-separator">
                                                <label className="header-small-light-bold">Shipping Information</label>
                                            </div>
                                            <div className="row-separator">
                                                <label>Buyer ID: {el.orderCreator}</label> <br/>
                                                <label className="header-medium-bold">{el.shipping_information.name}</label>
                                                <label style={{color: '#ef8805', fontFamily: "'Roboto', sans-serif"}}>{el.shipping_information.email}</label> <br/>
                                                <label>Phone: {el.shipping_information.phone ? el.shipping_information.phone : "N/A"}</label> <br/>
                                                <label>Address: {el.shipping_information.street1 ? el.shipping_information.street1 : "N/A"}</label> <br/>
                                                <label>Address 2: {el.shipping_information.street2 ? el.shipping_information.street2 : "N/A"}</label>
                                            </div>
                                        </div>
                                        <div className="column column_4_12">
                                            <div className="row-separator">
                                                <label>City: {el.shipping_information.city ? el.shipping_information.city : "N/A"}</label> <br/>
                                                <label>State: {el.shipping_information.state ? el.shipping_information.state : "N/A"}</label> <br/>
                                                <label>Country: {el.shipping_information.country ? el.shipping_information.country : "N/A"}</label> <br/>
                                                <label>Zip: {el.shipping_information.zip ? el.shipping_information.zip : "N/A"}</label> <br/>
                                                <label>Address Type: {el.shipping_information.address_type ? el.shipping_information.address_type : "N/A"}</label>
                                                <label>Apartment / Office: {el.shipping_information.aptOffice ? el.shipping_information.aptOffice : "N/A"}</label> <br/>
                                                <label>Building / Villa: {el.shipping_information.bldgVilla ? el.shipping_information.bldgVilla : "N/A"}</label> <br/>
                                                <label>Nearest Landmark: {el.shipping_information.nearestLandmark ? el.shipping_information.nearestLandmark : "N/A"}</label>
                                            </div>
                                        </div>
                                        <div className="column column_2_12">
                                            <label>Line Item Count: {el.line_items.length}</label>
                                        </div>
                                        <div className="column column_3_12" style={{marginTop: 10}}>
                                            <div className="row-separator display-inline">
                                                <div className="float-left" style={{ width: '30%' }}>
                                                    <label className="header-small-light-bold one-line-ellipsis">Country</label>
                                                </div>
                                                <Mutation
                                                    mutation={UPDATE_FUNNEL_ORDERS}
                                                    variables={{
                                                        id: el.creator,
                                                        orderCreator: el.orderCreator,
                                                        orderEmail: el.shipping_information.email,
                                                        country: state.country,
                                                        sendPLGTrackingEmail: false
                                                    }} >
                                                    {(updateMyFunnelOrders, { data, loading, error }) => {
                                                        var options = [<option value="" key={0}>Set COD Country</option>];
                                                        available_country.forEach((country, key) => {
                                                            options.push(<option value={country.iso3} key={key+1}>{country.name}</option>)
                                                        });
                                                        return <SelectTag name={"country_"+i} value={el.shipping_information.country} options={options} onChange={event => this.setState({ country: event.target.value }, () => this.updateMyFunnelOrders(updateMyFunnelOrders, refetch))} style={{width: '70%'}} />;
                                                    }}
                                                </Mutation>
                                                <span className="clear" />
                                            </div>
                                        </div>
                                        <div className="column column_12_12" style={{padding: '5px 5px 15px', backgroundColor: '#2d3740', borderRadius: 3}}>
                                            <div className="column column_5_12" style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
                                                <div style={{backgroundColor: '#21272d', borderRadius: '50%', width: 35, padding: '6px 9px', marginRight: 15}}>
                                                    <img src="assets/graphics/purchase-shopping-bag.png" width="100%" />
                                                </div>
                                                <div>
                                                    <label className="header-small-light-bold">Purchased Date</label>
                                                    <label className="color-white">{moment(new Date(parseInt(el.order_date))).format("MMMM DD, YYYY. ddd, h:mm:ss A")}</label>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="clear" />
                                    </div>
                                );
                            });
                        }}
                    </Query>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AdminManageCODorders);