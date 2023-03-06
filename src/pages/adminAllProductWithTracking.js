import React from 'react';
import withAuth from '../hoc/withAuth';
import toastr from 'toastr';
import Loading from '../components/loading';
import Popup from 'reactjs-popup';
import { Helmet } from 'react-helmet';
import { Query } from 'react-apollo';
import { GET_ALL_PAID_ORDER } from './../queries';

class AdminAllOrderWithTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount(){
        toastr.options = {
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

    exportAllToCSV(allOrderObject, min, max){
        toastr.clear();
        toastr.info("Loading please wait...","")
        const rows = [
            ["Variant", "Product Name", "Dimension", "Quantity", "Tracking Number", "Vendor Link"]
        ];

        // get all line items
        allOrderObject.forEach(data => {
            if(data.isRefactored){
                data.line_items.forEach(el => {
                    rows.push([
                        el.variant_name ? el.variant_name : 'N\/A',
                        el.product_name,
                        `${(el.weight/1000)+" kg"}\u2028${el.width && el.height && el.length ? el.width+"cm x "+el.height+"cm x "+el.length+"cm" : "N\/A"}\u2028DG code: ${el.dg_code ? el.dg_code : "none"}`,
                        el.quantity,
                        data.tracking_number ? "* "+data.tracking_number+" *" : "N\/A",
                        el.vendor_link
                    ])
                })
            } else {
                var order = JSON.parse(data.orders);
                order.line_items.forEach(el => {
                    rows.push([
                        el.variant_title ? el.variant_title : 'N\/A',
                        el.title,
                        `${(el.grams/1000)+" kg"}\u2028${el.dimension ? el.dimension.width+"cm x "+el.dimension.height+"cm x "+el.dimension.length+"cm" : "N\/A"}\u2028DG code: ${el.dimension && el.dimension.dg_code ? el.dimension.dg_code : "none"}`,
                        el.quantity,
                        data.tracking_number ? "* "+data.tracking_number+" *" : "N\/A",
                        el.vendorLink
                    ])
                })
            }
        })

        // export to csv
        let csvContent = "data:text/csv;charset=utf-8,";
        rows.forEach(function(rowArray){
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });
        
        var encodedUri = encodeURI(csvContent);
        var fileName = "All Paid Order.csv";
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);

        toastr.clear();
    }

    head() {
        return (
            <Helmet>
                <title>All Paid Orders - Product List Genie</title>
            </Helmet>
        );
    }
    
    render() {
        return (
            <div className="admin page-container">
                {this.head()}
                <div className="text-center">
                    <h2>All Paid Orders</h2>
                </div>
                <Query query={GET_ALL_PAID_ORDER} >
                    {({data, loading, refetch}) => {
                        if(loading){
                            return (
                                <div className="text-center">
                                    <Loading height={200} width={200} />
                                </div>
                            );
                        }

                        if(data.getAllPaidOrder.length == 0){
                            return (
                                <div className="text-center">
                                    <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>Empty... check back soon!</span>
                                </div>
                            );
                        }

                        return (
                            <div className="table-container">
                                <div className="float-right">
                                    <button className="dwobtn" onClick={() => this.exportAllToCSV(data.getAllPaidOrder)}>Export to CSV</button>
                                </div>
                                <br/><br/><br/>
                                <table className="table-list" style={{fontSize: 12}}>
                                    <thead>
                                        <tr>
                                            <th className="text-center">#</th>
                                            <th className="text-center">Shipping Information</th>
                                            <th className="text-center">OR #</th>
                                            <th className="text-center">Name</th>
                                            <th className="text-center">Variant</th>
                                            <th className="text-center">QTY</th>
                                            <th className="text-center">Weight</th>
                                            <th className="text-center">Dimension</th>
                                            <th className="text-center">Price</th>
                                            <th className="text-center">Shipping Fee</th>
                                            <th className="text-center">Total Price</th>
                                            <th className="text-center">Tracking Number</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            return data.getAllPaidOrder.map((order, o_index) => {
                                                if(order.isRefactored){
                                                    return (
                                                        <tr key={o_index}>
                                                            <td className="text-center">{o_index+1}</td>
                                                            <td>
                                                                {/* Shipping Information */}
                                                                <Popup
                                                                    trigger={<div className="text-center"><span className="clickable">View</span></div>}
                                                                    position="top center"
                                                                    on="click" className="points-tooltip">
                                                                    <div className="ellipsis" style={{width: 200}}>
                                                                        {order.shipping_information.email ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Email">{order.shipping_information.email}<br/></span> : void 0}
                                                                        {order.shipping_information.name ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Name">{order.shipping_information.name}<br/></span> : void 0}
                                                                        {order.shipping_information.address1 ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Address1">{order.shipping_information.address1}<br/></span> : void 0}
                                                                        {order.shipping_information.address2 ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Address2">{order.shipping_information.address2} <br/></span>: void 0}
                                                                        {order.shipping_information.city ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="City">{order.shipping_information.city}<br/></span> : void 0}
                                                                        {order.shipping_information.province ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Province">{order.shipping_information.province ? order.shipping_information.province +" ("+order.shipping_information.province_code+")" : ''}<br/></span> : void 0}
                                                                        {order.shipping_information.zip ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Zip">{order.shipping_information.zip}<br/></span> : void 0}
                                                                        {order.shipping_information.country ? <span className="ellipsis" style={{whiteSpace: 'nowrap'}} title="Country">{order.shipping_information.country+" ("+order.shipping_information.country_code+")"}</span> : void 0}
                                                                    </div>
                                                                </Popup>
                                                            </td>
                                                            <td className="text-center">
                                                                {/* Order Number */}
                                                                {order.shipping_information.order_number}
                                                            </td>
                                                            <td>
                                                                {/* Product Name */}
                                                                {(() => {
                                                                    return order.line_items.map((li, li_index) => {
                                                                        if (li.vendor_link) {
                                                                            return <span key={li_index}><a href={li.vendor_link} target="_blank" title="Vendor link availalble click here.">{li.product_name}</a> {(li_index + 1) != order.line_items.length ? <hr /> : void 0}</span>
                                                                        } else {
                                                                            return <span key={li_index}>{li.product_name} {(li_index + 1) != order.line_items.length ? <hr /> : void 0}</span>
                                                                        }
                                                                    })
                                                                })()}
                                                            </td>
                                                            <td>
                                                                {/* Variant */}
                                                                {(() => {
                                                                    return order.line_items.map((li, li_index) => {
                                                                        return <span key={li_index}>{li.variant_name ? li.variant_name : 'N/A'} {(li_index + 1) != order.line_items.length ? <hr /> : void 0}</span>
                                                                    })
                                                                })()}
                                                            </td>
                                                            <td className="text-center">
                                                                {/* Quantity */}
                                                                {(() => {
                                                                    return order.line_items.map((li, li_index) => {
                                                                        return <span key={li_index}>{li.quantity+"x"} {(li_index + 1) != order.line_items.length ? <hr/> : void 0}</span>
                                                                    })
                                                                })()}
                                                            </td>
                                                            <td className="text-center">
                                                                {/* Weight */}
                                                                {(() => {
                                                                    return order.line_items.map((li, li_index) => {
                                                                        return <span key={li_index}>{(li.weight / 1000)+"kg"}{(li_index + 1) != order.line_items.length ? <hr/> : void 0}</span>;
                                                                    })
                                                                })()}
                                                            </td>
                                                            <td className="text-center">
                                                                {/* Dimension */}
                                                                {(() => {
                                                                    return order.line_items.map((li, li_index) => {
                                                                        return <span key={li_index}>{li.width && li.height && li.length ? li.width+"cm x "+li.height+"cm x "+li.length+"cm" : void 0} {(li_index + 1) != order.line_items.length ? <hr/> : void 0}</span>;
                                                                    })
                                                                })()}
                                                            </td>
                                                            <td className="text-center">
                                                                {/* Price */}
                                                                {(() => {
                                                                    return order.line_items.map((li, li_index) => {
                                                                        return <span key={li_index}>{"$"+li.approve_price} {(li_index + 1) != order.line_items.length ? <hr/> : void 0}</span>;
                                                                    })
                                                                })()}
                                                            </td>
                                                            <td>
                                                                {/* Shipping Fee */}
                                                                {order.shipping_cost && order.shipping_days_min && order.shipping_days_max && order.shipping_method ?
                                                                    <span className="capitalize">
                                                                        {order.shipping_method}<br />
                                                                        {order.shipping_days_min + "-" + order.shipping_days_max + " Days"} <br />
                                                                        {"$" + order.shipping_cost}
                                                                    </span>
                                                                    : void 0}
                                                            </td>
                                                            <td className="text-center">
                                                                {/* Total Price */}
                                                                {(() => {
                                                                    var totalPrice = 0;
                                                                    order.line_items.map((li, li_index) => {
                                                                        totalPrice += li.quantity * li.approve_price;
                                                                    })
                                                                    if(order.shipping_cost && order.shipping_days_min && order.shipping_days_max && order.shipping_method){
                                                                        totalPrice += parseFloat(order.shipping_cost);
                                                                    }
    
                                                                    return (
                                                                        <span className="totalPrice">{"$"+parseFloat(totalPrice).toFixed(2)}</span>
                                                                    );
                                                                })()}
                                                            </td>
                                                            <td className="text-center">
                                                                {/* Tracking Number */}
                                                                {order.tracking_number ? order.tracking_number : "N\/A"}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                                var orderObj = JSON.parse(order.orders);
                                                return (
                                                    <tr key={o_index}>
                                                        <td className="text-center">{o_index+1}</td>
                                                        <td>
                                                            {/* Shipping Information */}
                                                            <Popup
                                                                trigger={<div className="text-center"><span className="clickable">View</span></div>}
                                                                position="top center"
                                                                on="click" className="points-tooltip">
                                                                <div className="helperText" style={{padding: 10, lineHeight: 1.5}}>
                                                                    <span className="ellipsis" style={{whiteSpace: 'nowrap'}}><strong>Email:</strong> {orderObj.email}</span><br/>
                                                                    <span className="ellipsis" style={{whiteSpace: 'nowrap'}}><strong>Name:</strong> {orderObj.shipping_address.name}</span><br/>
                                                                    <span className="ellipsis" style={{whiteSpace: 'nowrap'}}><strong>Address1:</strong> {orderObj.shipping_address.address1}</span><br/>
                                                                    <span className="ellipsis" style={{whiteSpace: 'nowrap'}}><strong>Address2:</strong> {orderObj.shipping_address.address2}</span><br/>
                                                                    <span className="ellipsis" style={{whiteSpace: 'nowrap'}}><strong>City:</strong> {orderObj.shipping_address.city}</span><br/>
                                                                    <span className="ellipsis" style={{whiteSpace: 'nowrap'}}><strong>Province:</strong> {orderObj.shipping_address.province}</span><br/>
                                                                    <span className="ellipsis" style={{whiteSpace: 'nowrap'}}><strong>Zip:</strong> {orderObj.shipping_address.zip}</span><br/>
                                                                    <span className="ellipsis" style={{whiteSpace: 'nowrap'}}><strong>Country:</strong> {orderObj.shipping_address.country}</span><br/>
                                                                    <span className="ellipsis" style={{whiteSpace: 'nowrap'}}><strong>Phone:</strong> {orderObj.shipping_address.phone}</span>
                                                                </div>
                                                            </Popup>
                                                        </td>
                                                        <td className="text-center">
                                                            {/* Order Number */}
                                                            {orderObj.name}
                                                        </td>
                                                        <td>
                                                            {/* Product Name */}
                                                            {(() => {
                                                                return orderObj.line_items.map((li, li_index) => {
                                                                    if(li.vendorLink){
                                                                        return <span key={li_index}><a href={li.vendorLink} target="_blank" title="Vendor link availalble click here.">{li.title}</a> {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                    } else {
                                                                        return <span key={li_index}>{li.title} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                    }
                                                                })
                                                            })()}
                                                        </td>
                                                        <td>
                                                            {/* Variant */}
                                                            {(() => {
                                                                return orderObj.line_items.map((li, li_index) => {
                                                                    return <span key={li_index}>{li.variant_title ? li.variant_title : "N/A"} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                })
                                                            })()}
                                                        </td>
                                                        <td className="text-center">
                                                            {/* Quantity */}
                                                            {(() => {
                                                                return orderObj.line_items.map((li, li_index) => {
                                                                    return <span key={li_index}>{li.quantity+"x"} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>
                                                                })
                                                            })()}
                                                        </td>
                                                        <td className="text-center">
                                                            {/* Weight */}
                                                            {(() => {
                                                                return orderObj.line_items.map((li, li_index) => {
                                                                    return <span key={li_index}>{(li.grams / 1000)+"kg"}{(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>;
                                                                })
                                                            })()}
                                                        </td>
                                                        <td className="text-center">
                                                            {/* Dimension */}
                                                            {(() => {
                                                                return orderObj.line_items.map((li, li_index) => {
                                                                    return <span key={li_index}>{li.dimension ? li.dimension.width+"cm x "+li.dimension.height+"cm x "+li.dimension.length+"cm" : void 0} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>;
                                                                })
                                                            })()}
                                                        </td>
                                                        <td className="text-center">
                                                            {/* Price */}
                                                            {(() => {
                                                                return orderObj.line_items.map((li, li_index) => {
                                                                    return <span key={li_index}>{"$"+li.price} {(li_index + 1) != orderObj.line_items.length ? <hr/> : void 0}</span>;
                                                                })
                                                            })()}
                                                        </td>
                                                        <td>
                                                            {/* Shipping Fee */}
                                                            {orderObj.shipping_fee && orderObj.shipping_fee.shipping_methods[0].total_cost &&
                                                                <span className="capitalize">
                                                                    {orderObj.shipping_fee.shipping_methods[0].method}<br/>
                                                                    {orderObj.shipping_fee.transit_min +"-"+ orderObj.shipping_fee.transit_max + " Days"} <br/>
                                                                    {"$"+orderObj.shipping_fee.shipping_methods[0].total_cost}
                                                                </span>
                                                            }
                                                        </td>
                                                        <td className="text-center">
                                                            {/* Total Price */}
                                                            {(() => {
                                                                var totalPrice = 0;
                                                                orderObj.line_items.map((li, li_index) => {
                                                                    totalPrice += li.quantity * li.price;
                                                                })
                                                                orderObj.shipping_fee ? totalPrice += parseFloat(orderObj.shipping_fee.shipping_methods[0].total_cost) : void 0;

                                                                return (
                                                                    <span className="totalPrice">{"$"+parseFloat(totalPrice).toFixed(2)}</span>
                                                                );
                                                            })()}
                                                        </td>
                                                        <td className="text-center">
                                                            {/* Tracking Number */}
                                                            {order.tracking_number ? order.tracking_number : "N\/A"}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        );
                    }}
                </Query>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AdminAllOrderWithTracking);