import React from 'react';
import Popup from 'reactjs-popup';

class Tooltip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { trigger, children, position, arrow, style, on } = this.props;
        if(!trigger) return null;
        return (
            <Popup trigger={trigger} position={position || "top center"} on={on || "hover"} arrow={arrow || false} contentStyle={{ borderRadius: 5, ...style }}>
                {children}
            </Popup>
        );
    }
}
export default Tooltip;