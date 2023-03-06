import React from 'react';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import Loading from '../components/loading';
const points = require('../../Global_Values');

class MillionDollarTraining extends React.Component {
    constructor() {
        super();
        this.state = {
            videoData: []
        }
    }

    componentDidMount(){
        this.getDataOfVideo();
    }

    componentDidUpdate(prevProps){
        if(prevProps.match.params.video_id != this.props.match.params.video_id){
            this.getDataOfVideo();
        }
    }

    getDataOfVideo(){
        this.setState({
            videoData: []
        }, () => {
            var payload = {"query":"{\n  getAdminSettings{\n    million_dollar_training {\n      id\n      tag\n      vimeo_id\n      introduction_title\n      introduction_description\n    }\n  }\n}","variables":null,"operationName":null}
            fetch(points.clientUrl+'/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(response => {
                response.data.getAdminSettings.million_dollar_training.forEach(vd => {
                    if(vd.id == this.props.match.params.video_id){
                        this.setState({
                            videoData: this.state.videoData.concat(vd)
                        })
                    }
                })
            });
        })
    }

    head() {
        return (
            <Helmet>
                <title>Million Dollar Training - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        var { videoData } = this.state;
        const { getCurrentUser } = this.props.session
        if(videoData.length == 0){
            return (
                <div className="text-center" style={{marginTop: '20rem'}}>
                    <Loading height={200} width={200} />
                </div>
            );
        }
        videoData = videoData[0];
        if(videoData.tag && !getCurrentUser.kartra_tags.includes(videoData.tag)){
            return <Redirect to="/dashboard" />;
        }
        return (
            <div className="page-container">
                <div className="text-center">
                    {this.head()}
                    <h1></h1>
                    <h1>{videoData.introduction_title}</h1>
                    <iframe id="vmplayer" src={"https://player.vimeo.com/video/"+videoData.vimeo_id} width="1000" height="500" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                    <h1></h1>
                </div>
                <div className="review-field">
                    <div dangerouslySetInnerHTML={{ __html: videoData.introduction_description }} />
                </div>
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(MillionDollarTraining);