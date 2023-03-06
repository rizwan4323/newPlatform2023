import React from 'react';

class GenieRating extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            
        }
    }

    render() {
        var width = (this.props.rating * 2) * 10;
        return (
            <div className="genie-rating">
                <span className="star-view">
                    <span style={{width: width+'%'}} />
                </span>
            </div>
        );
    }
}

export default GenieRating;