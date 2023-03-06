import React from 'react';
import Loading from '../../components/loading';
import { Helmet } from 'react-helmet';
import { Query, Mutation } from 'react-apollo';
import toastr from 'toastr';
import { SAVE_SHARED_FUNNEL_LIST } from '../../queries';

import Modal from '../../components/ModalComponent';
import FinalFreeViralAutomation from './finaLocationFreeViral';
const points = require('./../../../Global_Values');


/**
 * The Step TWO of Everything in Free Viral
 * 
 * It will to the funnel-gene-main
 * 
*/
export default class FvSaveSharedFunnelList extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading: false,
            data: null
        }
    }

    componentWillMount() {
        // TODO :: Everyting also the window.history push         
    }

    render() {
        const state = this.state;
        return (
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
        );
    }
}