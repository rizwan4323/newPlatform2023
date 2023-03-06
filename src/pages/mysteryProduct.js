import React from 'react';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
import { Mutation } from 'react-apollo';
import { UPDATE_MYSTERY_PRODUCT } from './../queries';
import toastr from 'toastr';
const points = require('../../Global_Values');

class MysteryProduct extends React.Component {
    constructor() {
        super();
        this.state = {
            mp_url: ''
        }
    }

    componentDidMount(){
        toastr.options = {
            "progressBar": true,
            "closeButton": false,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut":5000,
            "extendedTimeOut":2000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        points.getMysteryProduct(res => {
            this.setState({
                mp_url: res.data.getAdminSettings.mystery_product_url
            })
        })
    }

    handleMysteryURLchange(mp_url){
        mp_url = mp_url.target.value
        this.setState({
            mp_url: mp_url
        })
    }

    updateMysteryProduct(event, updateMysteryProduct){
        var mp_regexp = new RegExp(/\/products\/.*/)
        if(mp_regexp.test(this.state.mp_url)){
            updateMysteryProduct().then(async ({data}) => {
                toastr.clear()
                toastr.success("Mystery Product has been udpated successfully!","Mystery Product Updated!");
            }).catch(error => {
                console.error("ERR =>", error);
            });
        } else {
            toastr.clear()
            toastr.warning("Mystery Product URL is invalid!","Invalid URL!");
        }
    }

    head() {
        return (
            <Helmet>
                <title>Mystery Product - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        return (
            <div className="page-container">
                {this.head()}
                <div className="text-center">
                    <h2>Add/Change Mystery Product</h2>
                </div>

                <div className="form_wrap">
                    <div className="form_row">
                        <div className="column column_12_12">
                            <div className="product-card">
                                <div className="product-details">
                                    <div className="form_item">
                                        <div className="form_input">
                                            <label>Old Platform Product URL: </label>
                                            <input type="text" value={this.state.mp_url} onChange={this.handleMysteryURLchange.bind(this)} />
                                            <span className="bottom_border"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form_buttons clear text-right">
                            <br/>
                            <Mutation
                                mutation={UPDATE_MYSTERY_PRODUCT}
                                variables={{
                                    mp_url: this.state.mp_url
                                }}>

                                {(updateMysteryProduct, { data, loading, error }) => {
                                    return <button className="btn" onClick={event => this.updateMysteryProduct(event, updateMysteryProduct)}>Update Mystery Product</button>;
                                }}
                            </Mutation>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(MysteryProduct);