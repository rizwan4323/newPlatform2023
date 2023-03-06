import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from '../assets/graphics/likeAnimation.json'

class LikeButton extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            defaultOptions: {
                loop: false,
                autoplay: true, 
                animationData: animationData,
                rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                }
            }
        }
    }
    
    render() {
        return (
            <div>
                <Lottie options={this.state.defaultOptions}
                    height={this.props.height}
                    width={this.props.width}
                    autoplay={true}
                    loop={false}
                />
            </div>
        );
    }
}

export default LikeButton;