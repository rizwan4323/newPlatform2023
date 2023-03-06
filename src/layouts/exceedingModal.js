import React from 'react';
import Modal from "../components/ModalComponent";
export default class ExceededModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            selected_free: false,
            selected_basic: false,
            selected_pro: true,
            selected_full: false
        }

    }

    // handleClose(){
    //     this.props.ope
    // }

    setSelected(selected, portion) {
        var arr = Object.values(this.state);
        switch (portion) {
            case 'free':
                this.setState({
                    selected_free: selected,
                    selected_pro: false
                })
                break;
            case 'basic':
                this.setState({
                    selected_basic: selected,
                    selected_pro: false
                })
                break;
            case 'pro':
                this.setState({
                    selected_pro: true
                })
                break;
            case 'full':
                this.setState({
                    selected_full: selected,
                    selected_pro: false
                })
                break;
            default:
                break;
        }

    }
    render() {
        // on mouse hover enter and out declare it as active
        const styles = `
            .btn-outline-success{
                border: 1px solid white;
                border-radius: 23px;
                background-color: transparent;
            }

            .parentContainer{
                background-color: #F2F2F2;
            }

            .pricingModal{                
                height: 100%;                
            }

            .pricingModal:hover{
                background-color: white !important;
                z-index: 99;
                height: 103%; 
                box-shadow: 0 1px 8px rgb(0 0 0 / .7);
                border-radius: .9rem;
                padding-bottom: 10px;
                transition: all .3s; 
            }      
            


            
            .blue-child{
                height: 100%;
                background-image: linear-gradient(to right, #399e6c, #20b76c);
                padding: 1rem;
                border-top-left-radius: 1rem;
                border-bottom-left-radius: 1rem;
                transition: all 0.5s ease 0s;
            }

            .blue-side-child{
                height: 100%;
                background-image: linear-gradient(to right, rgb(44, 127, 255), rgb(36, 101, 253));
                padding: 1rem 0;  
                transition: all 0.5s ease 0s;
            }

            .blue-side-two-child{
                height: 100%;
                background-image: linear-gradient(to right,#20b76c ,#009a4e);
                padding: 1rem 0;                  
                transition: all .3s; 
            }

            .blue-last-child{
                height: 100%;
                background-image: linear-gradient(to right, #009a4e, #00964b);
                padding: 1rem 0;      
                padding-right: 1rem;
                border-top-right-radius: 1rem;
                border-bottom-right-radius: 1rem;            
                transition: all .3s; 
            }

            .pricingModal:hover .blue-child{
                background-image: linear-gradient(to right, rgb(255,255,255), rgb(255,255,255));
                padding: 1rem 0;                  
                transition: all .3s; 
            }

            .pricingModal:hover .blue-side-child{
                background-image: linear-gradient(to right, rgb(255,255,255), rgb(255,255,255));
                transition: all .3s; 
            }

            .pricingModal:hover .blue-side-two-child{
                background-image: linear-gradient(to right, rgb(255,255,255), rgb(255,255,255));
                transition: all .3s; 
            }

            .pricingModal:hover .blue-last-child{
                background-image: linear-gradient(to right, rgb(255,255,255), rgb(255,255,255));
                transition: all .3s; 
            }

            .blue-child-btn{
                color: white !important;
                border: 1px solid rgb(255, 255, 255) !important;
                border-radius: 7px !important;
                background-color: transparent !important;
            }

            .pricingModal:hover .blue-child-btn{
                background-image: linear-gradient(to right, #74d8a6, #23c072);
            }

            .blue-child-text{
                margin: 0;
                padding: 1rem;
                border-bottom: 1px solid rgb(218 218 218 / .5);
                color: rgb(255, 219, 103);
            }

            .pricingModal:hover .blue-child-text{
                color: rgb(0 0 0 / .7);
            }

            .blue-child-num{
                margin: 0;
                padding: 1rem;
                border-bottom: 1px solid rgb(218 218 218 / .5);
                color: white;
                
            }

            .pricingModal:hover .blue-child-header{
                color: #00bf60;
            }

            .pricingModal:hover .blue-child-num{
                color: #00bf60;
            }

            .pricingModal:active{
                background-color: green;
            }

            .text-color{
                text-align:center;
            }
            h3,h2{
                color: rgb(1 0 0 / .8);
            }
        `;


        return (<Modal open={this.props.open} style={{ width: '90%', borderTop: '5px solid #00bf60', backgroundColor: "#f2f2f2", borderRadius: 10, padding: 0, paddingLeft: "2em", paddingRight: "2em" }} closeModal={this.props.closeModal} >
            <div className="funnel" style={{
                height: "100%",
                padding: "0"
            }}>
                <style>{styles}</style>
                <div className="column_12_12" style={{
                    height: "100%",
                }}>
                    <div className="column_12_12" style={{
                        textAlign: "center"
                    }}>
                        <h3>You Have Reached the Maximum Amount of Impressions on Your Account</h3>
                    </div>
                    <br />
                    <div className="row clear display-inline parentContainer" style={{
                        height: "95%",
                        padding: "0"
                    }}>
                        <div style={{
                            height: "100%",
                        }} className="column_6_12">
                            <h3 className="text-align">Product List Genie Pricing</h3>
                            <h2 className="text-align" style={{
                                fontSize: "1.5rem"
                            }}>30-day Money back Guarantee</h2>
                            <h3 className="text-align">Features Offered</h3>

                            {/* Boxes Starts Here */}
                            <div style={{
                                height: "80%",
                                width: "100%",
                                backgroundColor: "#fff",
                                paddingTop: ".5em",
                                paddingBottom: ".5em",
                                borderTopLeftRadius: "1rem",
                                borderBottomLeftRadius: "1rem"
                            }}>
                                <div style={{
                                    height: "auto",
                                    borderTopLeftRadius: "1rem",
                                    padding: "1rem 4rem",
                                    borderBottomLeftRadius: "1rem"
                                }}>
                                    <p style={{
                                        margin: 0,
                                        padding: "1rem 1rem",
                                        borderBottom: "1px solid #dadada"
                                    }}>
                                        Funnel Builder
                                   </p>
                                    <p style={{
                                        margin: 0,
                                        padding: "1rem 1rem",
                                        borderBottom: "1px solid #dadada"
                                    }}>
                                        Import products from free viral products site to your shopify store
                                   </p>
                                    <p style={{
                                        margin: 0,
                                        padding: "1rem 1rem",
                                        borderBottom: "1px solid #dadada"
                                    }}>
                                        Accepting payment through Stripe/Authorize/Paypal.
                                   </p>
                                    <p style={{
                                        margin: 0,
                                        padding: "1rem 1rem",
                                        borderBottom: "1px solid #dadada"
                                    }}>
                                        Access to Done For You Funnels.
                                   </p>
                                    <p style={{
                                        margin: 0,
                                        padding: "1rem 1rem",
                                        borderBottom: "1px solid #dadada"
                                    }}>
                                        Unique Impressions
                                   </p>

                                    <p style={{
                                        margin: 0,
                                        padding: "1rem 1rem",
                                        borderBottom: "1px solid #dadada"
                                    }}>
                                        Access to cash on delivery products.
                                   </p>
                                    <p style={{
                                        margin: 0,
                                        padding: "1rem 1rem",
                                        borderBottom: "1px solid #dadada"
                                    }}>
                                        Access to copy push feature
                                   </p>
                                    <p style={{
                                        margin: 0,
                                        padding: "1rem 1rem",
                                        borderBottom: "1px solid #dadada"
                                    }}>
                                        Done For You Fulfillment In Middle East
                                   </p>
                                    <p style={{
                                        margin: 0,
                                        padding: "1rem 1rem",
                                        borderBottom: "1px solid #dadada"
                                    }}>
                                        Sourcing any Product you Need.
                                   </p>
                                    <p style={{
                                        margin: 0,
                                        padding: "1rem 1rem",
                                        borderBottom: "1px solid #dadada"
                                    }}>
                                        Faster Payout For COD Orders Only For Full Members
                                   </p>
                                    <p style={{
                                        margin: 0,
                                        padding: "1rem 1rem",
                                    }}>
                                        Free Storage/Customer Care
                                   </p>

                                </div>
                            </div>

                        </div>
                        <div className="column_2_12 pricingModal">
                            <div className="text-center">
                                <h3  >Free Version</h3>
                                <h2 className="blue-child-header" >$0.00</h2>
                                <h3 style={{
                                    fontSize: "1.5rem"
                                }}>(per month)</h3>
                            </div>
                            <div style={{
                                height: "80%",
                                width: "100%",
                                backgroundColor: "#fff",
                                paddingTop: ".5em",
                                paddingBottom: ".5em",
                                transition: "all .5s",
                            }}>
                                <div className="text-center blue-child">
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        100
                                    </p>
                                    <p className="blue-child-text">
                                        Not Included
                                    </p>
                                    <p className="blue-child-text">
                                        Not Included
                                    </p>
                                    <p className="blue-child-text">
                                        Not Included
                                    </p>
                                    <p className="blue-child-text">
                                        Not Included
                                    </p>
                                    <p className="blue-child-text">
                                        Not Included
                                    </p>


                                    <p className="blue-child-text" style={{
                                        border: "none"
                                    }}>
                                        Not Included
                                        {/* <br />
                                        <small className="blue-child-num" style={{
                                            fontSize: "11px",
                                            fontWeight: "bold",
                                            lineHeight: "20px",
                                            border: 'none'
                                        }}>FREE FOREVER</small> */}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* <div className="column_2_12 pricingModal">
                            <div className="text-center">
                                <h3  >Basic Version</h3>
                                <h2 className="blue-child-header" >$19.99</h2>
                                <h3 style={{
                                    fontSize: "1.5rem"
                                }}>(per month)</h3>
                            </div>
                            <div style={{
                                height: "80%",
                                width: "100%",
                                backgroundColor: "#fff",
                                paddingTop: ".5em",
                                paddingBottom: ".5em",
                                transition: "all .5s",
                            }}>
                                <div className="text-center blue-side-child">
                                    <p className="blue-child-text">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        10
                                    </p>
                                    <p className="blue-child-text">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        10
                                    </p>
                                    <p className="blue-child-num">
                                        2000
                                    </p>
                                    <p className="blue-child-text" style={{
                                        border: "none"
                                    }}>
                                        Included
                                        <br />
                                        <small className="blue-child-num" style={{
                                            fontSize: "11px",
                                            fontWeight: "bold",
                                            lineHeight: "20px",
                                            border: 'none'
                                        }}>No Contract, Cancel Anytime</small>
                                    </p>
                                    <p>
                                        <button className="blue-child-btn"
                                            onClick={() => window.open('https://themm.kartra.com/checkout/fb96795c7017e88c023bb34b8d2a4abc', '_blank')}
                                        >Choose Plan</button>
                                    </p>
                                </div>
                            </div>
                        </div> */}
                        <div className="column_2_12 pricingModal">
                            <div className="text-center">
                                <h3 >Pro Version</h3>
                                <h2 className="blue-child-header">$29.99</h2>
                                <h3 style={{
                                    fontSize: "1.5rem"
                                }}>(per month)</h3>
                            </div>
                            <div style={{
                                height: "80%",
                                width: "100%",
                                backgroundColor: "#fff",
                                paddingTop: ".5em",
                                paddingBottom: ".5em",
                                transition: "all .5s",
                            }}>
                                <div className="text-center blue-side-two-child">
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        10,000
                                    </p>
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-text">
                                        Not Included
                                    </p>
                                    <p className="blue-child-text">
                                        Not Included
                                    </p>
                                    <p className="blue-child-text">
                                        Not Included
                                    </p>


                                    <p className="blue-child-text" style={{
                                        border: "none"
                                    }}>
                                        Not Included
                                        {/* <br />
                                        <small className="blue-child-num" style={{
                                            fontSize: "11px",
                                            fontWeight: "bold",
                                            lineHeight: "20px",
                                            border: 'none'
                                        }}>FREE FOREVER</small> */}
                                    </p>
                                    <p>
                                        <button className="blue-child-btn"
                                            onClick={() => window.open('https://themm.kartra.com/checkout/a20234e78e7018b19677f85aa361e691', '_blank')}
                                        >Choose Plan</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="column_2_12 pricingModal">
                            <div className="text-center">
                                <h3  >Full Version</h3>
                                <h2 className="blue-child-header" >$97.97</h2>
                                <h3 style={{
                                    fontSize: "1.5rem"
                                }}>(per month)</h3>
                            </div>
                            <div style={{
                                height: "80%",
                                width: "100%",
                                backgroundColor: "#fff",
                                paddingTop: ".5em",
                                paddingBottom: ".5em",
                                paddingRight: ".5em",
                                transition: "all .5s",
                                borderTopRightRadius: "1rem",
                                borderBottomRightRadius: "1rem"
                            }}>
                                <div className="text-center blue-last-child">
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        Unlimited
                                    </p>
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        Included
                                    </p>
                                    <p className="blue-child-num">
                                        Included
                                    </p>


                                    <p className="blue-child-num" style={{
                                        border: "none"
                                    }}>
                                        Included
                                        {/* <br />
                                        <small className="blue-child-num" style={{
                                            fontSize: "11px",
                                            fontWeight: "bold",
                                            lineHeight: "20px",
                                            border: 'none'
                                        }}>FREE FOREVER</small> */}
                                    </p>
                                    <p>
                                        <button className="blue-child-btn"
                                            onClick={() => window.open('https://themm.kartra.com/checkout/29edf05a2e5540211750acfa3cd19b1f', '_blank')}
                                        >Choose Plan</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>)
    }
}
