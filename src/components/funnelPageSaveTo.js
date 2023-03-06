import React from 'react';
import Popup from 'reactjs-popup';
import Loading from '../components/loading';
import toastr from 'toastr';
import { GET_FUNNEL_PRODUCTS, SAVE_FUNNEL_PRODUCTS, GET_FUNNEL_PRODUCT_DESIGN, SAVE_DESIGN_OR_GROUP_NAME } from '../queries';
import { Query, Mutation } from 'react-apollo';
const points = require('../../Global_Values');
const initializeSaveDesign = {
    searchField: "",
    searchButton: "",
    group_design_name: "",
    design: ""
}
let allProductRefetch = null;

class FunnelPageSaveTo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ...initializeSaveDesign
        }
    }

    componentDidMount(){
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
    }

    unlayerExportHtml(cb) {
        unlayer.exportHtml(data => {
            var jsonObject = {
                "creator": "[creator]",
                "domainIndex": "[domainIndex]",
                "funnel_name": "[funnel_name]",
                "path": this.props.funnelPageData.path,
                "funnel_type": this.props.funnelPageData.funnel_type,
                "page_type": this.props.funnelPageData.page_type,
                "design": data.design
            }
            this.setState({ design: JSON.stringify(jsonObject) }, () => cb());
        })
    }

    setLoadingTime(tiemout, etimeout){
        toastr.options.timeOut = tiemout;
        toastr.options.extendedTimeOut = etimeout;
    }

    handleOnChange(event){
        var name = event.target.name;
        var value = event.target.value;
        this.setState({[name]: value})
    }

    saveFunnelProduct(saveFunnelProduct){
        this.setLoadingTime(0, 0);
        toastr.info("Loading please wait...", "");
        saveFunnelProduct().then(({ data }) => {
            this.setState({ ...initializeSaveDesign });
            this.setLoadingTime(3000, 2000);
            toastr.clear();
            toastr.success("Design Save Success!");
            allProductRefetch();
            document.getElementById("funnelPageSaveTo").click();
        }).catch(error => {
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "Please Try again!");
        });
    }

    render() {
        const state = this.state;
        const className = this.props.className ?  this.props.className+" funnel" : "funnel";
        const containerStyle = this.props.containerStyle ? this.props.containerStyle : {};
        const iconStyle = this.props.iconStyle ? this.props.iconStyle : {};
        const labelStyle = this.props.labelStyle ? this.props.labelStyle : {marginLeft: 5};
        const popupPosition = this.props.labelStyle ? this.props.labelStyle : "bottom center";
        const onAction = this.props.onAction ? this.props.onAction : "click";
        const popupStyle = this.props.popupStyle ? this.props.popupStyle : { background: '#f4f9fd', border: 'none', maxWidth: 300, borderRadius: 3 };
        const funnelPageData = this.props.funnelPageData;
        const contentStyle = { background: '#f4f9fd', border: 'none', maxWidth: 200, borderRadius: 3 };
        return (
            <Popup
                trigger={
                    <div id="funnelPageSaveTo" className={className} style={containerStyle}>
                        <span className="fas fa-save" style={iconStyle} />
                        <label style={labelStyle}>Save To</label>
                    </div>
                }
                position={popupPosition}
                on={onAction}
                contentStyle={popupStyle}>
                <div>
                    <div className="group-input-button">
                        <input type="text" name="searchField" placeholder="Search Product Name" value={state.searchField} onChange={event => this.handleOnChange(event)} onKeyUp={event => points.enterToProceed(event, () => this.setState({ searchButton: state.searchField }))} />
                        <button className="fas fa-search" style={{padding: '8px 15px'}} onClick={() => this.setState({ searchButton: state.searchField })} />
                    </div>
                    <div style={{padding: '10px 5px'}}>
                        <h4 className="font-questrial-bold">Select Product</h4>
                    </div>
                    <ul className="item-list">
                        <Query query={
                                GET_FUNNEL_PRODUCTS(`{ id productName }`)
                            } variables={{search: state.searchButton, limit: 10, page: 1}}>
                            {({ data, loading, refetch, error }) => {
                                allProductRefetch = refetch;
                                if(loading) return <li><Loading width={50} height={50} /></li>;
                                else if(error) return <li>An error has occurred please try again.</li>;
                                else if(data.getFunnelProducts.length == 0) {
                                    return (
                                        <li onClick={() => window.open('/admin-manage-cod-products', '_self')}>
                                            No Product Found. Click here to create
                                        </li>
                                    );
                                }
                                return data.getFunnelProducts.map((el, index) => {
                                    return (
                                        <Popup
                                            key={index}
                                            trigger={<li id={"save_to_confirm"+index} className="one-line-ellipsis">{points.capitalizeWord(el.productName)}</li>}
                                            position="right center"
                                            on="click"
                                            arrow={false}
                                            contentStyle={contentStyle} onOpen={() => this.refetch_group_name ? this.refetch_group_name() : void 0}>
                                            <div style={{ margin: 5 }}>
                                                <div className="text-center" style={{ padding: '10px 5px' }}>
                                                    <h4 className="font-questrial-bold">Select Group Design</h4>
                                                </div>
                                                <ul className="item-list">
                                                    <Query query={GET_FUNNEL_PRODUCT_DESIGN(` { id product_id design_name } `)} variables={{ product_id: el.id }}>
                                                        {({ data, loading, refetch, error }) => {
                                                            this.refetch_group_name = refetch;
                                                            if(loading) return <li><Loading width={50} height={50} /></li>;
                                                            else if(error) return <li>An error has occurred please try again.</li>;
                                                            else if(data.getFunnelProductDesign.length == 0) return <li>No Design Group Found!</li>;
                                                            return data.getFunnelProductDesign.map((design, x) => {
                                                                return (
                                                                    <Popup
                                                                        key={x}
                                                                        trigger={<li id={"save_to_confirm"+x} className="one-line-ellipsis">{design.design_name}</li>}
                                                                        position="right center"
                                                                        on="click"
                                                                        contentStyle={contentStyle}>
                                                                        <div>
                                                                            <div className="text-center" style={{ padding: '10px 5px' }}>
                                                                                <h4 className="font-questrial-bold">Are you sure?</h4>
                                                                            </div>
                                                                            <Mutation
                                                                                mutation={SAVE_DESIGN_OR_GROUP_NAME}
                                                                                variables={{ id: design.id, design: state.design }} key={x}>
                                                                                {(saveDesignOrGroupName, { data, loading, error }) => {
                                                                                    return (
                                                                                        <button style={{ width: '50%', padding: 6 }} onClick={() => {
                                                                                            this.unlayerExportHtml(() => {
                                                                                                points.executeMutation(saveDesignOrGroupName, toastr, () => {
                                                                                                    this.setState({ ...initializeSaveDesign }, () => {
                                                                                                        this.setLoadingTime(3000, 2000);
                                                                                                        toastr.clear();
                                                                                                        toastr.success("Design Save Success!");
                                                                                                        document.getElementById("funnelPageSaveTo").click();
                                                                                                    });
                                                                                                });
                                                                                            });
                                                                                        }}>Yes</button>
                                                                                    );
                                                                                }}
                                                                            </Mutation>
                                                                            <button style={{width: '50%', padding: 6}} onClick={() => document.getElementById("save_to_confirm"+x).click()}>No</button>
                                                                        </div>
                                                                    </Popup>
                                                                );
                                                            });
                                                        }}
                                                    </Query>
                                                    <Popup
                                                        trigger={<li id="add_new_group_design"><span className="fas fa-plus color-green" /> Add New Group Design</li>}
                                                        position="bottom center"
                                                        on="click"
                                                        contentStyle={contentStyle}>
                                                        <div style={{ margin: 5 }}>
                                                            <div className="text-center" style={{ padding: '10px 5px' }}>
                                                                <h4 className="font-questrial-bold">Group Design Name</h4>
                                                            </div>
                                                            <input type="text" name="group_design_name" value={state.group_design_name} onChange={event => this.handleOnChange(event)} className="row-separator" />
                                                            <Mutation
                                                                mutation={SAVE_DESIGN_OR_GROUP_NAME}
                                                                variables={{ product_id: el.id, group_name: points.capitalizeAndSerializeWord(state.group_design_name), design: state.design }}>
                                                                {(saveDesignOrGroupName, { data, loading, error }) => {
                                                                    return (
                                                                        <button style={{ width: '50%', padding: 6 }} onClick={() => {
                                                                            this.unlayerExportHtml(() => {
                                                                                points.executeMutation(saveDesignOrGroupName, toastr, () => {
                                                                                    this.setState({ ...initializeSaveDesign }, () => {
                                                                                        this.setLoadingTime(3000, 2000);
                                                                                        toastr.clear();
                                                                                        toastr.success("Group Name and Design Save Success!");
                                                                                        document.getElementById("funnelPageSaveTo").click();
                                                                                    });
                                                                                });
                                                                            });
                                                                        }}>Yes</button>
                                                                    );
                                                                }}
                                                            </Mutation>
                                                            <button style={{width: '50%', padding: 6}} onClick={() => document.getElementById("add_new_group_design").click()}>No</button>
                                                        </div>
                                                    </Popup>
                                                </ul>
                                            </div>
                                            {/* <div>
                                                <div className="text-center" style={{padding: '10px 5px'}}>
                                                    <h4 className="font-questrial-bold">Are you sure?</h4>
                                                </div>
                                                <div className="text-center">
                                                    <Mutation
                                                        mutation={SAVE_FUNNEL_PRODUCTS}
                                                        variables={{ id: el.id, funnelDesign: state.design }} >
                                                        {(saveFunnelProduct, { data, loading, error }) => {
                                                            return (
                                                                <button style={{ width: '50%', padding: 6 }} onClick={() => {
                                                                    unlayer.exportHtml(data => {
                                                                        var jsonObject = {
                                                                            "creator": "[creator]",
                                                                            "domainIndex": "[domainIndex]",
                                                                            "funnel_name": "[funnel_name]",
                                                                            "path": funnelPageData.path,
                                                                            "funnel_type": funnelPageData.funnel_type,
                                                                            "page_type": funnelPageData.page_type,
                                                                            "design": data.design
                                                                        }
                                                                        this.setState({ design: JSON.stringify(jsonObject) }, () => {
                                                                            this.saveFunnelProduct(saveFunnelProduct);
                                                                        })
                                                                    })
                                                                }}>Yes</button>
                                                            );
                                                        }}
                                                    </Mutation>
                                                    <button style={{width: '50%', padding: 6}} onClick={() => document.getElementById("save_to_confirm"+index).click()}>No</button>
                                                </div>
                                            </div> */}
                                        </Popup>
                                    );
                                });
                            }}
                        </Query>
                    </ul>
                </div>
            </Popup>
        );
    }
}

export default FunnelPageSaveTo;