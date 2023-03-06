import React from 'react';
import toastr from 'toastr';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Loading from '../components/loading';
import { GET_FULFILLMENT_CENTER_MESSAGE, SUBMIT_FULFILLMENT_CENTER_MESSAGE } from '../queries';
import { Query, Mutation } from 'react-apollo';
import moment from 'moment';
const points = require('../../Global_Values');

const initialState = {
    text: ''
}

class MessagingCenter extends React.Component {
    constructor(props) {
        super();
        this.state = {
            ...initialState
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
            "timeOut": 3000,
            "extendedTimeOut": 2000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        this.seenMessage();
        this.scrollToNewestMessage();
    }

    seenMessage(){
        var payload = {"query":"mutation{\n  seenMessage(id:\""+this.props.session.getCurrentUser.id+"\", from: \"User\"){\n    id\n  }\n}","variables":null};
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(response => {
            this.state.refetch();
        });
    }

    handleChange(event){
        var value = event.target.value;
        var name = event.target.name;
        this.setState({
            [name]: value
        })
    }

    submitMessage(submitMessage){
        submitMessage().then(async ({ data }) => {
            this.setState({
                ...initialState
            }, () => {
                this.state.refetch();
                this.scrollToNewestMessage();
            })
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }
    
    scrollToNewestMessage(){
        setTimeout(function() {
            var x = document.querySelectorAll(".message-container > div")
            points.smoothScrollInto(x[x.length-1]);
        }, 500);
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Messaging Center - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        var state = this.state;

        return (
            <div className="messaging-center page-container">
                {this.head()}
                <Link to="/fulfillment-center-genieV2" style={{float: 'left', fontSize: 15}} className="dwobtn"><span className="fas fa-arrow-left" title="Back to Audience Builder"></span></Link>
                <h1>&nbsp;Fulfillment Center</h1>
                <div className="clear" style={{height: '75vh', position: 'relative'}}>
                    <div className="message-container" style={{height: '55vh', padding: 20, overflow: 'scroll', position: 'relative'}}>
                        <Query query={GET_FULFILLMENT_CENTER_MESSAGE} variables={{id: this.props.session.getCurrentUser.id}} >
                            {({data, loading, refetch}) => {
                                if(loading) return <div className="text-center"><Loading height={150} width={150} /></div>;

                                state.refetch = refetch;
                                if(data.getFulfillmentCenterMessage){
                                    const messages = data.getFulfillmentCenterMessage.messages;
                                    return messages.map((message, i) => {
                                        return (
                                            <div className={message.from == "User" ? "user" : "admin"} key={i}>
                                                {message.isFromQuote || message.isFromBulkQuote ?
                                                    <div dangerouslySetInnerHTML={{__html: message.text}} id={"div_"+i} />
                                                :
                                                    <div>
                                                        {message.text} <br/> <br/>
                                                    </div>
                                                }
                                                <span className="clear">{moment(new Date(parseInt(message.date)).toISOString()).startOf('second').fromNow()}</span>
                                            </div>
                                        );
                                    })
                                }
                                
                                return (
                                    <div style={{position: 'absolute', bottom: 0}} className="text-center stretch-width">
                                        <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>No message yet start conversation by hitting submit button below.</span> 
                                    </div>
                                );
                            }}
                        </Query>
                    </div>
                    <div className="input-container stretch-width" style={{position: 'absolute', bottom: 0, minHeight: '19vh'}}>
                        <div className="column column_11_12" style={{height: '100%', padding: 10}}>
                            <textarea rows="6" className="message-area stretch-width" name="text" onChange={event => this.handleChange(event)} value={state.text}>
                            </textarea>
                        </div>
                        <div className="column column_1_12" style={{padding: '45px 0'}}>
                            <div className="form_buttons text-center">
                                <Mutation
                                    mutation={SUBMIT_FULFILLMENT_CENTER_MESSAGE}
                                    variables={{
                                        id: this.props.session.getCurrentUser.id,
                                        text: state.text,
                                        from: 'User',
                                        isFromQuote: false}}
                                    >
                                    {(submitMessage, { data, loading, error }) => {
                                        return <button className="btn" onClick={() => this.submitMessage(submitMessage)}>Submit</button>;
                                    }}
                                </Mutation>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(MessagingCenter);