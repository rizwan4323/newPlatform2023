import React from 'react';

class GenieStrength extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    render() {
        var width = this.props.strength;
        var bgcolor = "#28c686";
        if(parseInt(width) <= 35){
            bgcolor = "red";
        } else if(parseInt(width) >= 36 && parseInt(width) <= 66){
            bgcolor = "#ffa500";
        }
        return (
            <div style={{height: 10, borderRadius: 5, backgroundColor: '#efefef'}}>
                <div style={{height: 10, width: width+'%', borderRadius: 5, backgroundColor: bgcolor}}>
                </div>
            </div>
        );
    }
}

export default GenieStrength;