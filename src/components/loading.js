import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from '../assets/graphics/loading_animation.json'

class Loading extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            defaultOptions: {
                loop: true,
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
            <div style={this.props.style}>
                <Lottie options={this.state.defaultOptions}
                    height={this.props.height}
                    width={this.props.width}
                    autoplay={true}
                    loop={true}
                />
            </div>
        );
    }
}

export default Loading;