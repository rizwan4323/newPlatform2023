import React from 'react';
import { Helmet } from 'react-helmet';
import toastr from 'toastr';
import Container from '../components/table';
const { Table, Tbody } = Container
const points = require('../../Global_Values');


export default class CarLeadsByUser extends React.Component {
    constructor(props) {
        super();
        this.state = {
            data: [],
            loading: true,
            hasError: false,
            active_sort: "fullname"
        }
    }

    componentDidMount() {
        console.log('compnent did mounted.');
        const currentUser = this.props.session.getCurrentUser;

        var payload = {
            'query': `
            { everyLeadsbyAffiliate(affiliateID: "${currentUser.id}"){
                    firstName
                    lastName
                    dateUpdated
                    email
                    data
                    date
                    status
                    comment
                    phone
                    affiliateTitle
              }
            } `
        }
        points.customFetch('https://stats.productlistgenie.io/graphql', "POST", payload, result => {
            try {
                let data = result.data.everyLeadsbyAffiliate;
                console.log(data);

                this.setState({ data: data, loading: false, hasError: false });
            } catch (error) {
                this.setState({ loading: false, hasError: true });
            }
        });
    }

    sortToWhat(type){
        console.log('sort to type ', type);
        switch (type) {
            case 'fullname':
                this.setState({
                    data: this.state.data.sort((a,b) => a.firstName.localeCompare(b.firstName))
                });
                break;
        
            default:
                break;
        }
    }


    head() {
        return (
            <Helmet>
                <title>My Car Leads - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const state = this.state;
        const currentUser = this.props.session.getCurrentUser;
        return (
            <div className="funnel">
                {this.head()}
                <div className="newPageHeader display-inline row-separator">
                    <div className="column column_12_12">
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>
                            My Car Leads
                        </h4>
                    </div>
                    {/* <div className="column column_5_12">
                        <div className="display-inline row-separator">
                            <div className="column column_12_12">
                                
                            </div>                           
                        </div>
                    </div> */}
                </div>
                <span className="clear" />
                <div className="flex-container clear" style={{
                    justifyContent: "center"
                }}>
                    <div className="column column_12_12" style={{ minWidth: 230, margin: 0, filter: 'blur(0px)' }}>
                        <div className="product-card">
                            <div className="product-details">
                                <div className="row-separator">
                                    {/* <h5 className="font-roboto-bold" style={{ margin: 0 }}>Car </h5>  
                                         style : {cursor : "pointer"}, onClick: () => this.sortToWhat('fullname')
                                    */}
                                </div>
                                <Table headers={[{ text: "Full Name" }, { text: "Email" }, { text: "Phone" }, { text: "Car Model" }, {text: "Status"}, {text: "Date"}, { text: "Comments" }]}>
                                    {/* if(loading) return <Tbody loading={true} />;
                                            if(error) return <Tbody singleRowText={"An error has occurred please try again."} />;
                                            if(data.getMyFunnelOrders.length == 0) return <Tbody singleRowText={"No order has beed delivered yet. check back soon!"} />; */}
                                    {state.loading && <Tbody loading={true} />}
                                    {state.hasError && !state.loading && <Tbody singleRowText={"An error has occurred please try again."} />}
                                    {state.data.length == 0 && !state.loading && <Tbody singleRowText={"No leads has been added yet. check back soon!"} />}
                                    {state.data.sort((a,b) => a.date - b.date).map((lead, index) => {
                                        return (
                                            <Tbody index={index} key={index}>
                                                <div>{lead.firstName}{" "}{lead.lastName}</div>
                                                <div onClick={() => { window.location = `mailto:${lead.email}` }} style={{
                                                    cursor: "pointer"
                                                }}>{lead.email}</div>
                                                <div>{lead.phone}</div>
                                                <div>{lead.affiliateTitle}</div>
                                                <div>{lead.status === "" ? "No Status" : lead.status}</div>
                                                <div>{new Date(parseInt(lead.date ? lead.date != null && lead.dateUpdated != null ? lead.date >= lead.dateUpdated ? lead.date : lead.dateUpdated : lead.date : lead.dateUpdated)).toLocaleDateString()}</div>
                                                <div>{lead.comment}</div>
                                            </Tbody>
                                        );
                                    })}
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}