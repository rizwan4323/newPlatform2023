import Loading from '../components/loading';
import React from 'react';
const points = require('../../Global_Values');

class KartraTransaction extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            kartraTransactionHistory: []
        }
    }

    componentDidMount(){
        fetch(points.apiServer+'/kartrasubscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: this.props.email })
        })
        .then(res => res.json())
        .then(result => {
            this.setState({
                kartraTransactionHistory: result
            })
        })
    }

    render (){
        return(
            <div className="product-card">
                <div className="product-details">
                    <div style={{overflow:'hidden'}}>
                        <div className="text-center">
                            <h2>Transaction History</h2>
                        </div>
                        {this.state.kartraTransactionHistory.length == 0 &&
                            <div className="text-center">
                                <Loading height={150} width={150} />
                            </div>
                        }
                        {this.state.kartraTransactionHistory.length != 0 &&
                            <div className="table-container">
                                <table className="table-list">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            if(this.state.kartraTransactionHistory.status && this.state.kartraTransactionHistory.status == "Success"){
                                                if(this.state.kartraTransactionHistory.actions[0].get_transactions_from_lead.transaction_list.length != 0){
                                                    return this.state.kartraTransactionHistory.actions[0].get_transactions_from_lead.transaction_list.map((data,i) => {
                                                        return(
                                                            <tr key={i}>
                                                                <td>{data.product_name}</td>
                                                                <td>{data.transaction_full_amount}</td>
                                                                <td>{data.transaction_date}</td>
                                                                <td>{data.transaction_type}</td>
                                                            </tr>
                                                        )
                                                    })
                                                } else {
                                                    return(
                                                        <tr>
                                                            <td colSpan='4' className="text-center">Empty... check back soon!</td>
                                                        </tr>
                                                    );
                                                }
                                            } else {
                                                return(
                                                    <tr>
                                                        <td colSpan='4' className="text-center">Empty... check back soon!</td>
                                                    </tr>
                                                );
                                            }
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default KartraTransaction;