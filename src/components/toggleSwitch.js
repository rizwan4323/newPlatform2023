import React from 'react';

class ToggleSwitch extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    render() {
        const { onChange, value, width, height } = this.props;

        return (
            <label className="toggle-switch" style={{width, height}}>
                <input type="checkbox" checked={value} onChange={event => onChange(event.target.checked)} />
                <span className="slider round" />
            </label>
        );
    }
}
export default ToggleSwitch;