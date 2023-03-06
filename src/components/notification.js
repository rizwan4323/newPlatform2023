import React from 'react';
import { Mutation } from 'react-apollo';
import { REMOVE_NOTIFICATION } from './../queries';
import Loading from './loading';

class Notification extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    removeNotification(removeNotification){
        removeNotification().then(async ({data}) => {
            if(this.props.refetch){
                this.props.refetch();
            }
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    render() {
        var className = this.props.className ? this.props.className : "";
        className += this.props.isRead ? " notify-label-read" : " notify-label";
        if (this.props.loading) return <Loading width={this.props.loading.width} height={this.props.loading.height} />;
        return (
            <div className={"display-inline "+className} style={{ margin: '2px 0' }}>
                {this.props.type == "info" &&
                    <div className="column column_1_12 text-left" style={{padding: 0}}>
                        <span className="fas fa-info-circle color-green" />
                    </div>
                }
                {this.props.type == "warning" &&
                    <div className="column column_1_12 text-left" style={{padding: 0}}>
                        <span className="fas fa-exclamation-triangle color-orange" />
                    </div>
                }
                <div className={"text-left column " + (this.props.type ? "column_10_12" : "column_11_12")} style={{ padding: 0, wordBreak: 'break-word' }} dangerouslySetInnerHTML={{ __html: this.props.message }} />
                <div className="column column_1_12" style={{padding: 0}}>
                    {!this.props.noResult &&
                        <Mutation
                            mutation={REMOVE_NOTIFICATION}
                            variables={{ id: this.props.userId, notifId: this.props.notifId }}>
                            {(removeNotification, { data, loading, error }) => {
                                return <span className="fas fa-times cursor-pointer" style={{color: '#ccc'}} onClick={() => this.removeNotification(removeNotification)} />
                            }}
                        </Mutation>
                    }
                </div>
            </div>
        );
    }
}
export default Notification;