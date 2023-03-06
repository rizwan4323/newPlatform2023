import React from 'react';
import Loading from '../components/loading';
import { Link } from 'react-router-dom';

class VideoLink extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            vimeoVideoData: []
        }
    }

    componentDidMount(){
        this.getVimeoImageThumbnail();
    }

    getVimeoImageThumbnail(){
        fetch('https://vimeo.com/api/v2/video/' + this.props.video_id + '.json')
        .then(res => res.json())
        .then(result => {
            this.setState({vimeoVideoData: result[0]})
        });
    }

    render() {
        const encode = str => {
            return new Buffer(str).toString('base64');
        }
        const obj = {
            day: '',
            title: this.props.video_title,
            desc: this.props.video_description
        }
        if(!this.state.vimeoVideoData){
            return <Loading height={200} width={200} />;
        } else {
            return (
                <div className="column column_4_12">
                    <Link to={'/video/'+this.props.video_id+'/'+encode(JSON.stringify(obj))}>
                        <div className="product-card">
                            <div className="product-tumb" style={{backgroundImage: "url(" +  this.state.vimeoVideoData.thumbnail_large  + ")", borderRadius: '10px 10px 0 0' }}>
                            </div>
                            <div className="product-bottom-details" style={{paddingTop: 0, padding: '20px'}}>
                                <h4 style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{this.props.video_title}</h4>
                            </div>
                        </div>
                    </Link>
                </div>
            );
        }
    }
}

export default VideoLink;