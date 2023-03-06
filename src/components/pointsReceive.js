import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from '../assets/graphics/points_receive.json'

class PointsReceive extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            
        }
    }
    
    render() {
        const stopped = !this.props.play;
        const defaultOptions = {
            loop: false,
            autoplay: false,
            animationData: animationData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        }
        return (
            <div>
                <Lottie options={defaultOptions}
                    height={200}
                    width={200}
                    isStopped={stopped}
                    isClickToPauseDisabled={true}
                    eventListeners={[
                        {
                            eventName: 'complete',
                            callback: () => {
                                this.props.turnOff();
                            }
                        }
                    ]}
                />
            </div>
        );
    }
}

export default PointsReceive;