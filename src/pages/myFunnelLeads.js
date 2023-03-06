import React from 'react';
import toastr from 'toastr';
import withAuth from './../hoc/withAuth';
import { GET_FUNNEL_ORDERS, GET_FUNNEL_LEADS_META_DATA, SAVE_FUNNEL_LEADS_META_DATA } from './../queries';
import { Query, Mutation } from 'react-apollo';
import { Helmet } from 'react-helmet';
import Loading from '../components/loading';
import ButtonWithPopup from '../components/buttonWithPopup';
import moment from 'moment';
const points = require('../../Global_Values');

const initializeMetaData = {
    openMetaTag: false,
    meta_tag: "",
    openMetaNote: false,
    meta_note: ""
}

class FunnelOrders extends React.Component {
    constructor() {
        super();
        this.state = {
            totalOrders: 0,
            activeAccordionID: "",
            ...initializeMetaData
        }
    }

    componentDidMount() {
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

    setLoadingTime(timeOut, extendedTimeOut){
        toastr.options.timeOut = timeOut;
        toastr.options.extendedTimeOut = extendedTimeOut;
    }

    toggleAccordion(orderCreator){
        this.setState({ activeAccordionID: !orderCreator || this.state.activeAccordionID == orderCreator ? "" : orderCreator, ...initializeMetaData });
    }

    addLeadsMetaData(meta){
        var resetText = meta == "openMetaTag" ? "meta_tag" : "meta_note";
        this.setState({
            [meta]: !this.state[meta],
            [resetText]: ""
        })
    }

    detectPressEnter(event, saveLeadsMetaData, refetch){
        if(event.keyCode === 27) this.setState({...initializeMetaData});
        else if(event.keyCode === 13){
            if(event.target.name == "meta_tag" && !this.state.meta_tag){
                this.setState({...initializeMetaData});
            } else if(event.target.name == "meta_note" && !this.state.meta_note){
                this.setState({...initializeMetaData});
            } else {
                var inputMetaName = points.capitalizeWord(event.target.name.replace("_"," "));
                this.saveLeadsMetaData(saveLeadsMetaData, "Saving "+inputMetaName, refetch);
            }
        }
    }

    saveLeadsMetaData(saveLeadsMetaData, title, refetch){
        this.setLoadingTime(0, 0);
        toastr.clear();
        toastr.info("Please wait...",title);
        saveLeadsMetaData().then(({ data }) => {
            this.setState({ ...initializeMetaData })
            this.setLoadingTime(3000, 2000);
            toastr.clear();
            refetch();
        }).catch(error => {
            this.setLoadingTime(0, 0);
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "");
        });
    }

    handleOnChange(event){
        var name = event.target.name;
        var value = event.target.value;
        this.setState({ [name]: value })
    }

    head(funnel_name) {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>{funnel_name} Leads - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        var state = this.state;
        var currentUser = this.props.session.getCurrentUser;
        var funnelPageID = this.props.match.params;
        if(!funnelPageID.fid && !funnelPageID.fIndex && !funnelPageID.fName) return this.props.history.push('/404');
        return (
            <div className="funnel">
                {this.head(funnelPageID.fName)}
                <div className="newPageHeader">
                    <div className="column column_4_12" style={{marginTop: 5}}>
                        <h4 className="font-roboto-bold" style={{fontSize: '1.5em', color: '#273037'}}>Funnel Leads of {points.capitalizeWord(funnelPageID.fName.replace(/-|_/g," "))}</h4>
                        <label style={{color: '#878787'}}>You have <span id="funnel_count" className="font-bold" style={{color: '#23c78a'}}>{state.totalOrders}</span> Leads</label>
                    </div>
                    <span className="clear" />
                </div>
                <div className="page-container">
                    <div className="product-card">
                        <Query query={
                            GET_FUNNEL_ORDERS(`{ count orderCreator order_date shipping_information { name email phone street1 street2 city zip state country } line_items { title variant price quantity } }`)
                        } variables={{
                            id: currentUser.id,
                            funnel_id: funnelPageID.fid,
                            funnel_name: funnelPageID.fName,
                            domainIndex: funnelPageID.fIndex ? parseInt(funnelPageID.fIndex) : 0,
                            skip: 0
                        }} notifyOnNetworkStatusChange={true} onCompleted={data => {
                            if(data.getMyFunnelOrders.length != 0){
                                this.setState({ totalOrders: data.getMyFunnelOrders[0].count })
                            } else {
                                this.setState({ totalOrders: 0 })
                            }
                        }}>
                            {({ data, loading, error }) => {
                                if(loading) return <div className="center-vertical-parent" style={{height: '70vh'}}> <div className="center-vertical"> <Loading width={200} height={200} /> </div> </div>
                                if(error) return (
                                    <div className="center-vertical-parent" style={{height: '70vh'}}>
                                        <div className="center-vertical">
                                            <img src="/assets/graphics/no-result.svg" style={{height: '50vh'}} />
                                            <h4 className="title" style={{fontSize: '2.5em'}}>OOPS! THAT'S AN ERROR!</h4> <br/>
                                            <label className="font-roboto-bold" style={{fontSize: '0.875em'}}>An error has occurred. Please try again.</label>
                                        </div>
                                    </div>
                                );
                                if(data.getMyFunnelOrders.length == 0) return (
                                    <div className="center-vertical-parent" style={{height: '70vh'}}>
                                        <div className="center-vertical">
                                            <img src="/assets/graphics/no-result.svg" style={{height: '50vh'}} />
                                            <h4 className="title" style={{fontSize: '2.5em'}}>OOPS! NO LEADS FOUND!</h4> <br/>
                                            <label className="font-roboto-bold" style={{fontSize: '0.875em'}}>Empty... check back soon!</label>
                                        </div>
                                    </div>
                                );
                                return data.getMyFunnelOrders.map((el,i) => {
                                    return (
                                        <div className="display-inline flex-container" style={{borderBottom: '1px solid #dfe5eb', padding: 20}} key={i}>
                                            <div className="column column_4_12 display-inline" style={{margin: '5px 0'}}>
                                                <span className="fas fa-user-circle color-green" style={{fontSize: 40, marginRight: 15}} />
                                                <div className="one-line-ellipsis" style={{ width: '-webkit-fill-available' }}>
                                                    <label className="header-medium-bold">{points.capitalizeWord(el.shipping_information.name)}</label>
                                                    <label className="color-green">{points.capitalizeWord(el.shipping_information.email)}</label>
                                                </div>
                                                <div className="hide-in-desktop">
                                                    <span className={"fas "+(state.activeAccordionID == el.orderCreator ? "fa-angle-up" : "fa-angle-down")+" color-orange cursor-pointer stretch-width"} onClick={() => this.toggleAccordion(el.orderCreator)} />
                                                </div>
                                            </div>
                                            <div className="column column_8_12" style={{margin: '5px 0'}}>
                                                <div className="column" style={{width: '80%', padding: 0}}>
                                                    {el.shipping_information.phone ? <label className="stretch-width">{el.shipping_information.phone}</label> : void 0}
                                                    <label>Address: {el.shipping_information.street1} {el.shipping_information.street2}, {el.shipping_information.city}, {el.shipping_information.zip}, {el.shipping_information.state} {el.shipping_information.country}</label>
                                                </div>
                                                <div className="column hide-in-mobile text-right" style={{width: '20%'}}>
                                                    <span className={"fas "+(state.activeAccordionID == el.orderCreator ? "fa-angle-up" : "fa-angle-down")+" color-orange cursor-pointer stretch-width"} onClick={() => this.toggleAccordion(el.orderCreator)} />
                                                </div>
                                                <span className="clear" />
                                            </div>
                                            {state.activeAccordionID == el.orderCreator &&
                                                <Query query={GET_FUNNEL_LEADS_META_DATA} variables={{ creator: currentUser.id, leads_id: el.orderCreator }}>
                                                    {({ data, loading, refetch, error }) => {
                                                        if(loading) return <div className="text-center stretch-width"><Loading width={100} height={100} /></div>;
                                                        if(error) return <div className="text-center stretch-width"><label>An error has occurred. please try again.</label></div>;
                                                        var tags = data.getLeadsMetaData.filter(el => el.meta_tag);
                                                        var notes = data.getLeadsMetaData.filter(el => el.meta_note);
                                                        return (
                                                            <div className="column column_12_12" style={{margin: '5px 0'}}>
                                                                <div className="column column_12_12" style={{margin: '5px 0', padding: 0}}>
                                                                    <label>Date: {moment(new Date(parseInt(el.order_date))).format("MMMM DD, YYYY. ddd, h:mm:ss A")}</label>
                                                                </div>
                                                                <div className="column column_12_12" style={{margin: '5px 0', padding: 0}}>
                                                                    <label className="display-inline flex-container" style={{justifyContent: 'start'}}>
                                                                        Tags:
                                                                        {tags.map((el, eli) => {
                                                                            return (
                                                                                <span key={eli} style={{marginLeft: 3, padding: '3px 5px', border: '2px dashed #dfe5eb'}}>
                                                                                    {el.meta_tag}
                                                                                    <Mutation
                                                                                        mutation={SAVE_FUNNEL_LEADS_META_DATA}
                                                                                        variables={{ id: el.id }} >
                                                                                        {(saveLeadsMetaData, { data, loading, error }) => {
                                                                                            return <span className="fas fa-times color-dark-red cursor-pointer" style={{marginLeft: 5}} onClick={() => this.saveLeadsMetaData(saveLeadsMetaData, "Removing Tag", refetch)} />
                                                                                        }}
                                                                                    </Mutation>
                                                                                </span>
                                                                            )
                                                                        })}
                                                                        {state.openMetaTag &&
                                                                            <Mutation
                                                                                mutation={SAVE_FUNNEL_LEADS_META_DATA}
                                                                                variables={{ creator: currentUser.id, leads_id: el.orderCreator, meta_tag: state.meta_tag, meta_note: state.meta_note }} >
                                                                                {(saveLeadsMetaData, { data, loading, error }) => {
                                                                                    return (
                                                                                        <ButtonWithPopup data={{
                                                                                            triggerDOM: <input name="meta_tag" type="text" value={state.meta_tag} style={{width: 100, padding: 5, marginLeft: 5}} onChange={event => this.handleOnChange(event)} onKeyUp={event => this.detectPressEnter(event, saveLeadsMetaData, refetch)} disabled={loading} />,
                                                                                            popupPosition: "bottom center",
                                                                                            text: <label>Press enter/return to save</label>,
                                                                                            triggerID: "whats_this",
                                                                                            loading: false,
                                                                                            padding: 5,
                                                                                            checkORtimesButton: false,
                                                                                            onAction: 'hover',
                                                                                            style: {
                                                                                                borderRadius: 5,
                                                                                                padding: 5
                                                                                            }
                                                                                        }} />
                                                                                    );
                                                                                }}
                                                                            </Mutation>
                                                                        }
                                                                        <span className={state.openMetaTag ? "fas fa-times color-dark-red cursor-pointer" : "fas fa-plus color-green cursor-pointer"} style={{marginLeft: 5, padding: 2, border: '2px dashed #dfe5eb'}} onClick={() => this.addLeadsMetaData("openMetaTag")} />
                                                                    </label>
                                                                </div>
                                                                <div className="column column_12_12" style={{margin: '5px 0', padding: 0}}>
                                                                    <label className="display-inline flex-container" style={{justifyContent: 'start'}}>
                                                                        Note:
                                                                        {notes.map((el, eli) => {
                                                                            return (
                                                                                <span key={eli} style={{marginLeft: 3, padding: '3px 5px', border: '2px dashed #dfe5eb'}}>
                                                                                    {el.meta_note}
                                                                                    <Mutation
                                                                                        mutation={SAVE_FUNNEL_LEADS_META_DATA}
                                                                                        variables={{ id: el.id }} >
                                                                                        {(saveLeadsMetaData, { data, loading, error }) => {
                                                                                            return <span className="fas fa-times color-dark-red cursor-pointer" style={{marginLeft: 5}} onClick={() => this.saveLeadsMetaData(saveLeadsMetaData, "Removing Note", refetch)} />
                                                                                        }}
                                                                                    </Mutation>
                                                                                </span>
                                                                            )
                                                                        })}
                                                                        {state.openMetaNote &&
                                                                            <Mutation
                                                                                mutation={SAVE_FUNNEL_LEADS_META_DATA}
                                                                                variables={{ creator: currentUser.id, leads_id: el.orderCreator, meta_tag: state.meta_tag, meta_note: state.meta_note }} >
                                                                                {(saveLeadsMetaData, { data, loading, error }) => {
                                                                                    return (
                                                                                        <ButtonWithPopup data={{
                                                                                            triggerDOM: <input name="meta_note" type="text" value={state.meta_note} style={{width: 100, padding: 5, marginLeft: 5}} onChange={event => this.handleOnChange(event)} onKeyUp={event => this.detectPressEnter(event, saveLeadsMetaData, refetch)} disabled={loading} />,
                                                                                            popupPosition: "bottom center",
                                                                                            text: <label>Press enter/return to save</label>,
                                                                                            triggerID: "whats_this",
                                                                                            loading: false,
                                                                                            padding: 5,
                                                                                            checkORtimesButton: false,
                                                                                            onAction: 'hover',
                                                                                            style: {
                                                                                                borderRadius: 5,
                                                                                                padding: 5
                                                                                            }
                                                                                        }} />
                                                                                    );
                                                                                }}
                                                                            </Mutation>
                                                                        }
                                                                        <span className={state.openMetaNote ? "fas fa-times color-dark-red cursor-pointer" : "fas fa-plus color-green cursor-pointer"} style={{marginLeft: 5, padding: 2, border: '2px dashed #dfe5eb'}} onClick={() => this.addLeadsMetaData("openMetaNote")} />
                                                                    </label>
                                                                </div>
                                                                <div className="column column_12_12" style={{margin: '5px 0', padding: 0}}>
                                                                    <label className="header-medium-bold">Product Purchase</label>
                                                                </div>
                                                                <div className="column column_12_12 flex-container" style={{margin: '5px 0', padding: 0, justifyContent: 'start'}}>
                                                                    {el.line_items.map((el, eli) => {
                                                                        return (
                                                                            <div className="column column_12_12 row-separator" style={{padding: 0}} key={eli}>
                                                                                <div className="column column_12_12 one-line-ellipsis" style={{padding: 0}}>
                                                                                    <label>{el.title}</label>
                                                                                    <div className="hide-in-mobile float-right">
                                                                                        <label style={{color: '#ef8805', fontFamily: "'Roboto', sans-serif"}}>${el.price.toFixed(2)}</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="column column_12_12 one-line-ellipsis" style={{padding: 0}}>
                                                                                    <label>{el.variant}</label>
                                                                                </div>
                                                                                <div className="column column_12_12" style={{padding: 0}}>
                                                                                    <label>Quantity: {el.quantity}</label>
                                                                                </div>
                                                                                <div className="hide-in-desktop column column_12_12" style={{padding: 0}}>
                                                                                    <label>Price: </label><label style={{color: '#ef8805', fontFamily: "'Roboto', sans-serif"}}>${el.price.toFixed(2)}</label>
                                                                                </div>
                                                                                <span className="clear" />
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                                <span className="clear" />
                                                            </div>
                                                        );
                                                    }}
                                                </Query>
                                            }
                                            <span className="clear" />
                                        </div>
                                    );
                                });
                            }}
                        </Query>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(FunnelOrders);