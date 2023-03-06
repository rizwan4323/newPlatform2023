import React from 'react';
import toastr from 'toastr';
import Loading from '../components/loading';
import { NEW_GET_ORDERS_CHINA } from '../queries';
import { Query } from 'react-apollo';
import RefactorData from './fulfillmentData';

class FulfillmentProcessing extends React.Component {
    constructor() {
        super();
        this.state = {
            dropDownState: 'all'
        }
    }

    componentDidMount() {
        toastr.options = {
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
    }

    toggleDropDown(value){
        this.setState({
            dropDownState: value
        })
    }

    render() {
        var state = this.state;
        
        return (
            <div>
                <div className="text-center">
                    <h2>Processing Order</h2>
                </div>
                <div className="column column_12_12">
                    <div className="clear float-right" style={{display: 'flex', alignItems: 'center'}}>
                        <label style={{width: 100}}>Filter By: </label>
                        <select className="dropbtn drp stretch-width" value={state.dropDownState} onChange={event => this.toggleDropDown(event.target.value)} style={{backgroundColor: 'inherit'}}>
                            <option value="all">All</option>
                            <option value="request">Unpaid</option>
                            <option value="denied">Denied</option>
                            <option value="approved">Outsourcing</option>
                            <option value="toship">Pending Tracking Number</option>
                            <option value="order_status">Fulfilled</option>
                        </select>
                    </div>
                </div>
                <div className="column column_12_12">
                    <div className="text-center" style={{border: '1px solid #ff8000', padding: '10px 5px'}}>
                        Please make sure to have enough <strong>Fulfillment Credits</strong> to process your order.
                    </div>
                </div>
                <div className="table-container clear" style={{overflow: 'visible'}}>
                    <br />
                    <table className="table-list">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th className="text-center">Date</th>
                                <th className="text-center">Order ID</th>
                                <th>Shiping Information</th>
                                <th>Products</th>
                                <th className="text-center">Variant</th>
                                <th className="text-center">Quantity</th>
                                <th className="text-center">Price</th>
                                {state.dropDownState == "denied" &&
                                    <th className="text-center">Denied Note</th>
                                }
                                <th className="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <Query query={NEW_GET_ORDERS_CHINA} variables={{
                                id: this.props.session.getCurrentUser.id,
                                filter: state.dropDownState,
                                offset: 0,
                            }}>
                                {({ data, loading, refetch, error }) => {
                                    if(loading){
                                        return (
                                            <tr>
                                                <td colSpan={state.dropDownState == "denied" ? "10" : "9"} className="text-center">
                                                    <Loading height={200} width={200} />
                                                </td>
                                            </tr>
                                        );
                                    }

                                    if(data.getNewChinaOrders.length == 0){
                                        return (
                                            <tr>
                                                <td colSpan={state.dropDownState == "denied" ? "10" : "9"} className="text-center">
                                                    <span className="no-result">Empty... check back soon!</span>
                                                </td>
                                            </tr>
                                        );
                                    }
                                    
                                    return data.getNewChinaOrders.map((odata, index) => {
                                        return <RefactorData currentUserID={this.props.session.getCurrentUser.id} activeDropDown={state.dropDownState} data={odata} index={index+1} key={index} refetch={refetch} />
                                    });
                                }}
                            </Query>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
export default FulfillmentProcessing;