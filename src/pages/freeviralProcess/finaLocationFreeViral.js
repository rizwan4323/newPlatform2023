import React from 'react';
import Loading from '../../components/loading';
import Modal from './../../components/ModalComponent';
import { Query, Mutation } from 'react-apollo';
import { SAVE_SHARED_FUNNEL_LIST } from '../../queries';
const points = require('./../../../Global_Values');


import toastr from 'toastr';

export default class FinalFreeViralAutomation extends React.Component {
    constructor(props) {
        super();
        this.state = {
            data: null,
            loading: true,
            hasError: false,
            funnelExists: false,
            newUserCreateModal: false,
            domain_subdomain: ""

        }
    }

    handleOnChange(e) {
        e.preventDefault();        

        this.setState({domain_subdomain : e.currentTarget.value});
    }



    componentWillMount() {        
        this.props.saveSharedFunnelList().then(({ data }) => {
            this.props.refetch();
            this.setState({ loading: false, })
            this.props.history.push("/funnel-genie-main");
        }).catch((errors) => {
            console.log('error in this final lovation', errors);
            this.setState({ loading: false, hasError: true, newUserCreateModal: true });
        });
    }
    /*
     <Mutation
                mutation={SAVE_SHARED_FUNNEL_LIST}
                variables={{
                    funnel_id: this.props.shared_funnel_id,
                    creator: this.props.currentID,
                    domain_name: this.props.domain,
                    funnel_name: points.encodeDomain(this.props.funnelName),
                    selected_page_ids: this.props.selectedPages.length != 0 ? JSON.stringify(this.props.selectedPages) : ""
                }} >
                {(saveSharedFunnelList, { data, loading, error }) => {
                    return <FinalFreeViralAutomation saveSharedFunnelList={saveSharedFunnelList} {...this.props} />
                }}
            </Mutation>
     */
    render() {
        const state = this.state;
        const props = this.props;
        if (state.loading && !state.hasError) {
            return (<div className="funnel">
                <Loading height={350} width={350} />
                <br></br>
                <h1 className="center-vertical">Saving Funnel Domain...</h1>
            </div>);
        } else if (!state.loading && !state.hasError) {
            return (<div className="funnel center-vertical">
                <br></br>
                <h1 className="center-vertical">Done Saving Funnel Domain...</h1>
            </div>);
        } else {
            return (
                <React.Fragment>

                    <div className="text-center" style={{ padding: '10% 0' }}>
                        <img src="/assets/graphics/no-result.svg" width="200px" /> <br />
                        <h4 className="title" style={{ fontSize: '2.5em' }}>OOPS! THAT'S AN ERROR!</h4> <br />
                        <label className="font-roboto-bold" style={{ fontSize: '0.875em' }}>
                            You have reach the maximum limit for your account please upgrade to continue.
                        </label>
                    </div>
                    {state.newUserCreateModal &&
                        <Modal open={state.newUserCreateModal} session={props.session} style={{ borderTop: '5px solid #23c78a', borderRadius: 10, padding: 10, width: '30%' }} >
                            <div className="center-vertical-parent">
                                <div className="form_wrap center-vertical">
                                    <div className="text-center">
                                        {/* <img src="/assets/graphics/funnel-icon.png" style={{ maxWidth: '100px' }} /> */}
                                        <h5 className="header" style={{ marginTop: 10 }}>Funnel Name <span style={{
                                            fontWeight: "bold"
                                        }}>{props.funnelName}</span> already exist.</h5>
                                    </div>
                                    <div className="column column_12_12" style={{ marginTop: 10 }}>
                                        <div className="form_row text-center" style={{ position: 'relative' }}>
                                            <input type="text" className="font-roboto-light" name="domain_subdomain" value={state.domain_subdomain} onChange={event => this.handleOnChange(event)} placeholder="Ex. Your Funnel" style={{ textAlign: 'center', marginTop: 10, fontSize: '0.875em' }} />
                                            {state.loadingNewUser &&
                                                <div style={{ position: 'absolute', right: 0, top: 30, right: 10 }}>
                                                    <Loading width={40} height={40} />
                                                </div>
                                            }
                                        </div>

                                    </div>
                                    <Mutation
                                        mutation={SAVE_SHARED_FUNNEL_LIST}
                                        variables={{
                                            funnel_id: this.props.shared_funnel_id,
                                            creator: this.props.currentID,
                                            domain_name: this.props.domain,
                                            funnel_name: points.encodeDomain(state.domain_subdomain),
                                            selected_page_ids: this.props.selectedPages.length != 0 ? JSON.stringify(this.props.selectedPages) : ""
                                        }} >
                                        {(saveSharedFunnelList, { data, loading, error }) => {
                                            // return <FinalFreeViralAutomation saveSharedFunnelList={saveSharedFunnelList} {...this.props} />
                                            return <button className="font-roboto-light btn-success" onClick={() => {
                                                this.props.refetch();
                                                //Submit the new funnel name propose here !
                                                points.executeMutation(saveSharedFunnelList,toastr,(res) => {
                                                    // toastr.success('')
                                                    this.props.history.push("/funnel-genie-main");
                                                });

                                            }}>Submit new Funnel Name</button>
                                        }}
                                    </Mutation>
                                </div>
                            </div>
                        </Modal>}

                </React.Fragment>
            );
        }

    }
}
