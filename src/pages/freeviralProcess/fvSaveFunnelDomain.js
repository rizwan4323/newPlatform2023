import React from 'react';
import Loading from '../../components/loading';
import FvSaveSharedFunnelList from './fvSaveSharedFunneList';

/**
 * * The Step One of Everything in Free Viral
 */
export default class FvSaveFunnelDomain extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading: false,
            data: null,
            selectedPages: [],
            shared_funnel_id: "",
        }
    }

    componentWillMount() {
        // TODO :: Mutate the SAVE_FUNNEL_DOMAIN state        
        this.props.saveFunnelDomain().then(({ data }) => {        
            this.props.refetch();
            this.setState({ loading: true, shared_funnel_id: data.saveFunnelDomain.id });
        }).catch((error) => {
            console.log('error in this ', error);
            this.setState({ loading: true });
        });
    }

    render() {
        const state = this.state;
        return (
            !this.state.loading ?
            <div className="funnel">
                <div className="column column_12_12">
                    <div className="center-vertical-parent" style={{ height: '80vh' }}>
                        {!state.loading && <Loading height={200} width={200} />}
                        <h1 className="center-vertical"> {state.loading ? "Done" : " "} Saving Funnel Domain...</h1>
                    </div>
                </div>
            </div>
            // handle the mutation here to load this one 
            :            
             <FvSaveSharedFunnelList {...this.props} selectedPages={this.props.selectedPages} funnelName={this.props.funnelName} shared_funnel_id={this.props.shared_funnel_id} />            
        );
    }
}