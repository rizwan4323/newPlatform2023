import React from 'react';
import Popup from 'reactjs-popup';
import Loading from './loading';
import toastr from 'toastr';
import { GET_FUNNEL_PRODUCTS, SAVE_FUNNEL_PRODUCTS, GET_FUNNEL_PRODUCT_DESIGN, SAVE_DESIGN_OR_GROUP_NAME, GET_PAGE_TEMPLATES, ADD_PAGE_TEMPLATES, UPDATE_PAGE_TEMPLATES } from '../queries';
// import { GET_PAGE_TEMPLATES, ADD_PAGE_TEMPLATES, DELETE_PAGE_TEMPLATE, UPDATE_PAGE_TEMPLATES } from '../queries';
import { Query, Mutation } from 'react-apollo';
const points = require('../../Global_Values');
const initializeSaveDesign = {
    searchField: "",
    searchButton: "",
    group_design_name: "",
    design: ""
}
let allProductRefetch = null;

class SavePageTemplate extends React.Component {
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
            this.setState({ design: JSON.stringify(jsonObject.design) }, () => cb()); // modify only to save the json design
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
            document.getElementById("savePageTemplate").click();
        }).catch(error => {
            toastr.clear();
            toastr.warning(error.graphQLErrors[0].message, "Please Try again!");
        });
    }

    render() {
        const currentUser = this.props.user
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
                    <div id="savePageTemplate" className={className} style={containerStyle}>
                        <span className="fas fa-save" style={iconStyle} />
                        <label style={labelStyle}>Template</label>
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
                        <h4 className="font-questrial-bold">Templates</h4>
                    </div>
                    <ul className="item-list">
                    {/* {console.log(currentUser)} */}
                    <Query query={GET_PAGE_TEMPLATES('{ id design description screenshot_link screenshot_link_preview }')} variables={{ creator: currentUser.id }}>
                            {({ data, loading, refetch, error }) => {
                                // this.refetch_group_name = refetch;
                                if (loading) return <li><Loading width={50} height={50} /></li>;
                                else if (error) return <li>An error has occurred please try again.</li>;
                                else if (data.getPageTemplates.length == 0) return <li>No Design Group Found!</li>;
                                return data.getPageTemplates.map((design, x) =>  {
                                    return (
                                        <Popup
                                            key={x}
                                            trigger={<li id={"save_to_confirm" + x} className="one-line-ellipsis">{design.description}</li>}
                                            position="right center"
                                            on="click"
                                            contentStyle={contentStyle}>
                                            <div>
                                                <div className="text-center" style={{ padding: '10px 5px' }}>
                                                    <h4 className="font-questrial-bold">Overwrite?</h4>
                                                </div>
                                                <Mutation
                                                    mutation={UPDATE_PAGE_TEMPLATES}
                                                    variables={{ id: design.id, design: state.design, description: design.description, type: this.props.funnelPageData.page_type }} key={x}>
                                                    {(updatePageTemplate, { data, loading, error }) => {
                                                        return (
                                                            <button style={{ width: '50%', padding: 6 }} onClick={() => {
                                                                this.unlayerExportHtml(() => {
                                                                    points.executeMutation(updatePageTemplate, toastr, () => {
                                                                        this.setState({ ...initializeSaveDesign }, () => {
                                                                            this.setLoadingTime(3000, 2000);
                                                                            toastr.clear();
                                                                            toastr.success("Design Save Success!");
                                                                            document.getElementById("savePageTemplate").click();
                                                                        });
                                                                    });
                                                                });
                                                            }}>Save</button>
                                                        );
                                                    }}
                                                </Mutation>
                                                <button style={{ width: '50%', padding: 6 }} onClick={() => document.getElementById("save_to_confirm" + x).click()}>Cancel</button>
                                            </div>
                                        </Popup>
                                        
                                    )
                                }
                                );
                            }}
                        </Query>
                        {/* <li id="add_new_group_design"><span className="fas fa-plus color-green" /> Add New Template</li> */}

                        {/* <Popup
                            trigger={<li id="add_new_group_design"><span className="fas fa-plus color-green" /> Add New Template</li>}
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
                                    variables={{ product_id: 'el.id', group_name: points.capitalizeAndSerializeWord(state.group_design_name), design: state.design }}>
                                    {(saveDesignOrGroupName, { data, loading, error }) => {
                                        return (
                                            <button style={{ width: '50%', padding: 6 }} onClick={() => {
                                                this.unlayerExportHtml(() => {
                                                    points.executeMutation(saveDesignOrGroupName, toastr, () => {
                                                        this.setState({ ...initializeSaveDesign }, () => {
                                                            this.setLoadingTime(3000, 2000);
                                                            toastr.clear();
                                                            toastr.success("Group Name and Design Save Success!");
                                                            document.getElementById("savePageTemplate").click();
                                                        });
                                                    });
                                                });
                                            }}>Yes</button>
                                        );
                                    }}
                                </Mutation>
                                <button style={{ width: '50%', padding: 6 }} onClick={() => document.getElementById("add_new_group_design").click()}>No</button>
                            </div>
                        </Popup> */}
                       
                       
                       {/* Part2 */}
                        <Popup
                            trigger={<li id="add_new_group_design"><span className="fas fa-plus color-green" /> Add New Template</li>}
                            position="bottom center"
                            on="click"
                            contentStyle={contentStyle}>
                            <div style={{ margin: 5 }}>
                                <div className="text-center" style={{ padding: '10px 5px' }}>
                                    <h4 className="font-questrial-bold">Template Name</h4>
                                </div>
                                <input type="text" name="group_design_name" value={state.group_design_name} onChange={event => this.handleOnChange(event)} className="row-separator" />
                                {/* <Mutation
                                    mutation={ADD_PAGE_TEMPLATES}
                                    variables={{ creator: "5c3613ad7c511950acf14c97", design: state.design.design, description: state.design.group_design_name  }} >
                                    {(saveFunnelProduct, { data, loading, error }) => {
                                        return (
                                            <button style={{ width: '50%', padding: 6 }} onClick={() => {
                                                unlayer.exportHtml(data => {
                                                    var jsonObject = {
                                                        "creator": "5c3613ad7c511950acf14c97",
                                                        "description": "[domainIndex]",
                                                        "design": data.design
                                                    }
                                                    this.setState({ design: JSON.stringify(jsonObject) }, () => {
                                                        this.saveFunnelProduct(saveFunnelProduct);
                                                    })
                                                })
                                            }}>Yes</button>
                                        );
                                    }}
                                </Mutation> */}
                                <Mutation
                                    mutation={ADD_PAGE_TEMPLATES}
                                    variables={{creator: currentUser.id, design: this.state.design, description: state.group_design_name, type: this.props.funnelPageData.page_type }}>
                                    {(addPageTemplate, { data, loading, error }) => {
                                        return (
                                            <button style={{ width: '50%', padding: 6 }} onClick={() => {
                                                this.unlayerExportHtml(() => {
                                                    points.executeMutation(addPageTemplate, toastr, () => {
                                                        this.setState({ ...initializeSaveDesign }, () => {
                                                            this.setLoadingTime(3000, 2000);
                                                            toastr.clear();
                                                            toastr.success("Group Name and Design Save Success!");
                                                            document.getElementById("savePageTemplate").click();
                                                        });
                                                    });
                                                    console.log("✅", this.state.design);
                                                });
                                            }}>Save</button>
                                        );
                                    }}
                                </Mutation>
                                <button style={{ width: '50%', padding: 6 }} onClick={() => document.getElementById("add_new_group_design").click()}>Cancel</button>
                            </div>
                        </Popup>
                        





                    </ul>
                </div>
            </Popup>
        );
    }
}

export default SavePageTemplate;