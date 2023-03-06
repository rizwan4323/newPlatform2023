import React from 'react';
import toastr from 'toastr';
import Loading from '../components/loading';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';
import { REQUEST_BULK_INVENTORY } from '../queries';
import { Mutation } from 'react-apollo';

const points = require('../../Global_Values');

class FulfillmentVirtualWarehouse extends React.Component {
    constructor() {
        super();
        this.state = {
            inventoryLoading: true,
            inventoryList: [],

            // quote
            productName: '',
            productVariants: [],
            productQty: 10,
            timeOut: null,
            minimumBulkOrder: 10,

            // pending stock
            stockLoading: true,
            stockData: []
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

        points.customFetch('/getMyProducts/' + this.props.session.getCurrentUser.fbb_store_id, 'GET', null, result => {
            if (result) {
                this.setState({
                    inventoryLoading: false,
                    inventoryList: result.data
                }, () => {
                    this.getPendingStock()
                })
            } else {
                this.setState({
                    inventoryLoading: false
                }, () => {
                    this.getPendingStock()
                })
            }
        })
    }

    getPendingStock(){
        var arr = [];
        var data = 0;
        var processedData = 0;
        if(!this.props.session.getCurrentUser.pending_stock_id || this.props.session.getCurrentUser.pending_stock_id.length == 0){
            this.setState({
                stockLoading: false
            })
        } else {
            this.props.session.getCurrentUser.pending_stock_id.forEach(id => {
                data += 1;
                points.customFetch('/getInbound/'+id, 'GET', null, result => {
                    processedData += 1;
                    arr.push(result.data.inbound)
                    if(processedData == data){
                        this.saveTolocalState(arr)
                    }
                })
            })
        }
    }

    saveTolocalState(data){
        this.setState({
            stockLoading: false,
            stockData: data
        })
    }

    handleOnChange(event, isSearchProduct){
        var name = event.target.name;
        var value = event.target.value;
        if(!isSearchProduct){
            this.setState({
                [name]: value
            });
        } else {
            this.setState({
                [name]: value
            }, () => {
                clearTimeout(this.state.timeOut)
                this.setState({
                    timeOut: setTimeout(() => {
                        this.searchProduct();
                    }, 500)
                })
            })
        }
    }

    searchProduct(){
        var data = {
            queryKey: this.state.productName,
            domainlink: this.props.session.getCurrentUser.store_url,
            store_token:  this.props.session.getCurrentUser.store_token
        }
        fetch(points.apiServer+'/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            this.showResults(result);
        });
    }

    showResults(data){
        var s_result = data;
        ReactDOM.unmountComponentAtNode(document.getElementById('productResult'));
        //document.getElementById('productResult').innerHTML = "";
        var x = [];
        s_result.data.products.edges.forEach((pr,i) => {
            try{
                x.push((
                    <li className="list-group-item search-result" id={pr.node.id.replace("gid://shopify/Product/", "")} onClick={event => this.selectSearch(pr.node.title, pr.node.variants, event)} key={'li'+i} >
                        <img src={pr.node.images.edges.length > 0 ? pr.node.images.edges[0].node.originalSrc : ''} width="40" key={'img'+i} />{pr.node.title}
                    </li>
                ));
            } catch (error) {console.log(error);}
        });
        ReactDOM.render(x, document.getElementById('productResult'));
    }

    selectSearch(productName, variants, event) {
        this.setState({
            productName: productName,
            productVariants: variants
        }, () => {
            document.querySelectorAll(".one-line-ellipsis").forEach((el, index) => {
                if(index >= 1){
                    if(this.isEllipsisActive(el)){
                        el.firstElementChild.style.display = "block";
                    }
                }
            })
        })
        ReactDOM.unmountComponentAtNode(document.getElementById('productResult'));
    }

    isEllipsisActive(e) {
        return (e.offsetWidth < e.scrollWidth);
    }

    createFBBProduct(){
        var payload = {
            product_name: li.product_name,
            variant_name: li.variant_name.length <= 3 ? "("+li.variant_name+")" : li.variant_name,
            chinese_description: li.chinese_description,
            approve_price: parseFloat(li.approve_price),
            original_price: parseFloat(li.original_price),
            dg_code: li.dg_code ? li.dg_code : null,
            sku: this.state.storeID + "-" + li.variant_id,
            storeID: this.state.storeID
        }
        console.log(payload);
    }
    
    bulkRequest(requestBulkInventory){
        var state = this.state;
        var requestedProduct = {
            productName: state.productName,
            variants: []
        };
        state.productVariants.edges.forEach(variant => {
            var variantID = variant.node.id.replace("gid://shopify/ProductVariant/","");
            var variantQty = document.getElementById(variantID).value;
            if(parseInt(variantQty) >= 10){
                requestedProduct.variants.push({
                    variant_id: variantID,
                    variant_name: variant.node.title,
                    original_price: variant.node.price,
                    quantity: parseInt(variantQty),
                })
            }
        });

        if (requestedProduct.variants.length != 0) {
            this.setState({
                bulkRequestData: requestedProduct
            }, () => {
                requestBulkInventory().then(async ({ data }) => {
                    this.setState({
                        productName: '',
                        productVariants: []
                    }, () => {
                        toastr.clear();
                        toastr.success("Bulk request has sent to admin..", "Success");
                    })
                }).catch(error => {
                    toastr.options.timeOut = 0;
                    toastr.options.extendedTimeOut = 0;
                    toastr.clear();
                    toastr.warning(error.graphQLErrors[0].message, "An Error has occurred!");
                });
            })
        } else {
            toastr.clear();
            toastr.warning("You must put atleast 10 quantity on atleast 1 variant to continue.","Variant Quantity Required");
        }
    }

    bulkRequestInventory(data, requestBulkInventory){
        var requestedProduct = {
            productName: data.name,
            variants: [{
                variant_id: data.sku.replace(this.props.session.getCurrentUser.fbb_store_id+"-",""),
                variant_name: data.description,
                original_price: data.value,
                approve_price: data.cost,
                dg_code: data.dg_code,
                quantity: this.state.productQty,
                boxc_product_id: data.id
            }]
        };
        this.setState({
            bulkRequestData: requestedProduct
        }, () => {
            requestBulkInventory().then(async ({ data }) => {
                this.setState({
                    productName: '',
                    productVariants: [],
                    productQty: 10
                }, () => {
                    toastr.clear();
                    toastr.success("Bulk request has sent to admin..","Success");
                })
            }).catch(error => {
                toastr.options.timeOut = 0;
                toastr.options.extendedTimeOut = 0;
                toastr.clear();
                toastr.warning(error.graphQLErrors[0].message, "An Error has occurred!");
            });
        });
    }

    render() {
        var state = this.state;
        
        return (
            <div>
                <h3 className="text-center">Virtual Warehouse</h3>
                <div className="column column_12_12">
                    <div className="column column_12_12">
                        {/* Virtual Inventory */}
                        <div className="product-card">
                            <div className="product-details">
                                {(() => {
                                    if (state.inventoryLoading && state.inventoryList.length == 0) {
                                        return (
                                            <div className="text-center">
                                                <Loading width={200} height={200} />
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="table-container clear">
                                            <h3>Virtual Inventory List</h3>
                                            <table className="table-list">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center">#</th>
                                                        <th className="text-center">Product ID</th>
                                                        <th>Product Name</th>
                                                        <th className="text-center">Variant Name</th>
                                                        <th className="text-center">Quantity</th>
                                                        {/* <th className="text-center">Action</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(() => {
                                                        var colsPan = 6;
                                                        if (state.inventoryList.products.length == 0) {
                                                            return (
                                                                <tr>
                                                                    <td className="text-center" colSpan={colsPan}>
                                                                        <span className="no-result">No Inventory Found. Please request order first to pre order your item.</span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }

                                                        return state.inventoryList.products.map((prod, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="text-center">{index + 1}</td>
                                                                    <td className="text-center">{prod.id}</td>
                                                                    <td>{prod.name}</td>
                                                                    <td className="text-center">{prod.description}</td>
                                                                    <td className="text-center">{prod.quantity}</td>
                                                                    {/* <td className="text-center">
                                                                        <Mutation
                                                                            mutation={REQUEST_BULK_INVENTORY}
                                                                            variables={{
                                                                                id: this.props.session.getCurrentUser.id,
                                                                                requestedProduct: JSON.stringify(state.bulkRequestData)
                                                                            }} >
                                                                            {(requestBulkInventory, { data, loading, error }) => {
                                                                                return (
                                                                                    <Popup
                                                                                        trigger={<button className="dwobtn" id={"restock" + index} style={{ margin: 0 }}>Restock</button>}
                                                                                        position="top center"
                                                                                        on="click" className="points-tooltip">
                                                                                        <div className="helperText" style={{ lineHeight: 1.5 }}>
                                                                                            <div className="form_wrap">
                                                                                                <div className="form_row">
                                                                                                    <div className="form_item">
                                                                                                        <div className="form_input">
                                                                                                            <label>Enter Quantity</label>
                                                                                                            <input type="text" name="productQty" value={state.productQty} onChange={event => this.handleOnChange(event)} />
                                                                                                            <span className="bottom_border"></span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20 }} onClick={() => {
                                                                                                this.bulkRequestInventory(prod, requestBulkInventory)
                                                                                                document.getElementById("restock" + index).click();
                                                                                            }}>
                                                                                                <i className="fas fa-check"></i>
                                                                                            </button>
                                                                                            &nbsp; | &nbsp;
                                                                                            <button className="pbbtn" style={{ padding: '5px 0', margin: 0, background: 'transparent', color: 'red', fontSize: 20 }} onClick={() => document.getElementById("restock" + index).click()}>
                                                                                                <i className="fas fa-times"></i>
                                                                                            </button>
                                                                                        </div>
                                                                                    </Popup>
                                                                                );
                                                                            }}
                                                                        </Mutation>
                                                                    </td> */}
                                                                </tr>
                                                            )
                                                        })
                                                    })()}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                    {/* <div className="column column_4_12">
                        <div className="column column_12_12">
                            <div className="product-card">
                                <div className="product-details" style={{ display: 'flow-root' }}>
                                    <h3>Bulk Request</h3>
                                    <div className="form_wrap">
                                        <div className="column column_12_12">
                                            <div className="form_row">
                                                <div className="form_item">
                                                    <div className="form_input">
                                                        <label>Search Product Name</label>
                                                        <input type="text" name="productName" id="productSearch" value={state.productName} onChange={event => this.handleOnChange(event, true)} />
                                                        <div className="error" id="error-product-id"></div>
                                                        <ul className="list-group" id="productResult">
                                                        </ul>
                                                        <span className="bottom_border"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column column_12_12">
                                            <div className="form_row">
                                                <div className="form_item">
                                                    <div className="form_input">
                                                        <div className="form_input">
                                                            <label>
                                                                Add Variant Quantity &nbsp;
                                                                <Popup
                                                                    trigger={<span className="clickable fas fa-question-circle" />}
                                                                    position="bottom center"
                                                                    on="click" className="points-tooltip">
                                                                    <div className="text-center helperText" style={{ lineHeight: 1.5, padding: 0 }}>
                                                                        If you have <strong>Bundle</strong> please select the <strong>Buy 1 get someting</strong> instead of putting quantity on all <strong>Bundle</strong>
                                                                    </div>
                                                                </Popup>
                                                            </label>
                                                            <div style={{marginTop: 10, lineHeight: '1.5'}}>
                                                                {(() => {
                                                                    if(state.productVariants.length == 0){
                                                                        return (
                                                                            <div className="text-center">
                                                                                <span className="no-result">Search Product First.</span>
                                                                            </div>
                                                                        );
                                                                    }
                                                                    
                                                                    return state.productVariants.edges.map((variant, i) => {
                                                                        return (
                                                                            <div style={{display: 'flex'}} key={i}>
                                                                                <div className="one-line-ellipsis" style={{ width: '85%' }}>
                                                                                    <Popup
                                                                                        trigger={<span className="clickable fas fa-question-circle" style={{ position: 'absolute', fontSize: 12, left: '-20px', marginTop: '5px', display: 'none' }} />}
                                                                                        position="top center"
                                                                                        on="click" className="points-tooltip">
                                                                                        <div className="text-center helperText" style={{ lineHeight: 1.5, padding: 0 }}>
                                                                                            {variant.node.title}
                                                                                        </div>
                                                                                    </Popup>
                                                                                    {variant.node.title}
                                                                                </div>
                                                                                <div style={{ width: '15%', position: 'relative'}}>
                                                                                    <input type="number" id={variant.node.id.replace("gid://shopify/ProductVariant/","")} defaultValue="0" style={{padding: 0, textAlign: 'right'}} />
                                                                                    <span className="bottom_border"></span>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column column_12_12 form_buttons text-center">
                                            <Mutation
                                                mutation={REQUEST_BULK_INVENTORY}
                                                variables={{
                                                    id: this.props.session.getCurrentUser.id,
                                                    requestedProduct: JSON.stringify(state.bulkRequestData)
                                                }} >
                                                {(requestBulkInventory, { data, loading, error }) => {
                                                    return <button className="btn" onClick={() => this.bulkRequest(requestBulkInventory)} style={{padding: '5px 10px'}}>Bulk Request</button>
                                                }}
                                            </Mutation>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column column_12_12">
                            <div className="product-card">
                                <div className="product-details" style={{ display: 'flow-root' }}>
                                    <div className="table-container clear">
                                        <h3>Pending Stock</h3>
                                        <table className="table-list">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Product ID</th>
                                                    <th>Name</th>
                                                    <th>Quantity</th>
                                                    <th>Processed</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(() => {
                                                    var colsPan = 5;
                                                    if (state.stockLoading) {
                                                        return (
                                                            <tr>
                                                                <td colSpan={colsPan} className="text-center">
                                                                    <Loading height={100} width={100} />
                                                                </td>
                                                            </tr>
                                                        )
                                                    }

                                                    if (state.stockData.length == 0) {
                                                        return (
                                                            <tr>
                                                                <td colSpan={colsPan} className="text-center">
                                                                    <span className="no-result">No Pending Stock!</span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }

                                                    var count = 0;
                                                    return state.stockData.map(inbound => {
                                                        return inbound.products.map(prod => {
                                                            count += 1;
                                                            return (
                                                                <tr key={count}>
                                                                    <td className="text-center">{count}</td>
                                                                    <td>{prod.id}</td>
                                                                    <td>{prod.name}</td>
                                                                    <td className="text-center">{prod.quantity}</td>
                                                                    <td className="text-center">{prod.processed}</td>
                                                                </tr>
                                                            );
                                                        })
                                                    })
                                                })()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        );
    }
}
export default FulfillmentVirtualWarehouse;