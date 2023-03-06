import React from 'react';
import toastr from 'toastr';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
const points = require('../../Global_Values');

class AdminProductMetafields extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
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
    }

    getProductById(event){
        var productid = event.target.value;
        if(productid){
            var payload = { productID: productid };
            points.customFetch('/api/get-product-metafields', 'POST', payload, result => {
                result.data.product.metafields.edges.forEach(el => {
                    var name = el.node.key;
                    document.querySelector('[name="'+name+'"]').setAttribute("data-id", el.node.id);
                    document.querySelector('[name="'+name+'"]').value = el.node.value;
                });
            })
        }
    }

    saveMetafields(){
        toastr.clear();
        toastr.info("Loading Please wait...", "");
        var productid = document.querySelector('[name="productid"]').value;
        var payload = {
            "input": {
                "id": "gid://shopify/Product/"+productid,
                "metafields": []
            }
        }
        document.getElementById("metafields").querySelectorAll("input,textarea").forEach(el => {
            if(el.getAttribute("data-id")){
                payload.input.metafields.push({
                    "id": el.getAttribute("data-id"),
                    "namespace": "c_f",
                    "key": el.name,
                    "value": el.value,
                    "valueType": "STRING"
                });
            } else {
                if(el.value){
                    payload.input.metafields.push({
                        "namespace": "c_f",
                        "key": el.name,
                        "value": el.value,
                        "valueType": "STRING"
                    });
                }
            }
        });
        points.customFetch('/api/save-product-metafields', 'POST', payload, result => {
            toastr.clear();
            toastr.success("Metafield has been saved.", "Save Success");
            console.log(result)
        })
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Product Metafields - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const state = this.state;
        return (
            <div className="admin funnel">
                {this.head()}
                <div id="funnel_main_header" style={{ padding: 20, backgroundColor: '#f4f9fd', overflow: 'hidden', borderBottom: '1px solid #dfe5eb' }}>
                    <div className="column column_4_12">
                        <h4 className="font-roboto-bold" style={{ fontSize: '1.5em', color: '#273037' }}>Shopify Product Metafields</h4>
                    </div>
                </div>
                <div className="page-container">
                    <div className="column column_6_12">
                        <input type="text" name="productid" onBlur={event => this.getProductById(event)} placeholder="Paste Shopify Product ID Here." />
                    </div>
                    <span className="row-separator clear" />
                    {/* Metafields */}
                    <div id="metafields">
                        <div className="row-separator column column_3_12">
                            <label>Generic Title</label>
                            <input type="text" name="0_Generic_Title" placeholder="0_Generic_Title"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Campaign Objective</label>
                            <input type="text" name="1_Campaign_Objective" placeholder="1_Campaign_Objective"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Geography</label>
                            <input type="text" name="2_Geography" placeholder="2_Geography"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Demographics Age</label>
                            <input type="text" name="3_Demographics_Age" placeholder="3_Demographics_Age"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Demographics Gender</label>
                            <input type="text" name="4_Demographics_Gender" placeholder="4_Demographics_Gender"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Interests</label>
                            <textarea className="message-area stretch-width" name="5_Interests" placeholder="5_Interests"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Behavior</label>
                            <input type="text" name="6_Behavior" placeholder="6_Behavior"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Ad Copy Text</label>
                            <textarea className="message-area stretch-width" name="7_Ad_Copy_Text" placeholder="7_Ad_Copy_Text"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Vendor Link</label>
                            <input type="text" name="8_Vendor_Link" placeholder="8_Vendor_Link"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Video Link</label>
                            <input type="text" name="9_Video_Link" placeholder="9_Video_Link"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>New Video</label>
                            <input type="text" name="H_New_Video" placeholder="H_New_Video"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Google Headline</label>
                            <input type="text" name="A_Google_Headline" placeholder="A_Google_Headline"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Google Headline 2</label>
                            <input type="text" name="B_Google_Headline2" placeholder="B_Google_Headline2"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Google Description</label>
                            <input type="text" name="C_Google_Description" placeholder="C_Google_Description"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Google Keywords</label>
                            <input type="text" name="D_Google_Keywords" placeholder="D_Google_Keywords"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>JSON Info</label>
                            <input type="text" name="E_JSON_info" placeholder="E_JSON_info"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Product Reviews</label>
                            <input type="text" name="F_Product_Reviews" placeholder="F_Product_Reviews"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Product Mapping</label>
                            <input type="text" name="G_Product_Mapping" placeholder="G_Product_Mapping"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Template Funnel</label>
                            <input type="text" name="I_Template_Funnel" placeholder="I_Template_Funnel"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Instagram Video</label>
                            <input type="text" name="J_Instagram_Video" placeholder="J_Instagram_Video"  style={{ marginTop: 10 }} />
                        </div>
                        <div className="row-separator column column_3_12">
                            <label>Snapchat video</label>
                            <input type="text" name="K_Snapchat_Video" placeholder="K_Snapchat_Video"  style={{ marginTop: 10 }} />
                        </div>
                        {/* Button */}
                        <span className="clear" />
                        <div className="row-separator column column_4_12">&nbsp;</div>
                        <div className="row-separator column column_4_12">
                            <button className="btn-success stretch-width" onClick={() => this.saveMetafields()}>SAVE</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AdminProductMetafields);