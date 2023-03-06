import React from 'react';
import Tooltip from '../components/tooltip';

class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { id, checked, onChange, containerStyle, label, labelStyle, tooltip, disabled } = this.props;
        const containerClassName = this.props.containerClassName ? this.props.containerClassName : "";
        const labelClassName = this.props.labelClassName ? this.props.labelClassName : "";
        return (
            <div className={"custom-checkbox-container " + containerClassName} style={containerStyle} htmlFor={id}>
                {tooltip &&
                    <Tooltip trigger={<label htmlFor={id} className="cursor-pointer stretch-width-and-height" />}>
                        <label style={{ display: 'block', fontSize: '0.7em' }}>{tooltip}</label>
                    </Tooltip>
                }
                <label htmlFor={id} className={labelClassName + " cursor-pointer"} style={{ display: 'unset', lineHeight: 1.3, ...labelStyle }} dangerouslySetInnerHTML={{ __html: label ? label : "&nbsp;" }} />
                <input id={id} type="checkbox" checked={checked} onChange={() => onChange(!checked)} disabled={disabled} style={{ position: "absolute", left: 0 }} />
                <label className="custom-checkbox-checkmark cursor-pointer" htmlFor={id} />
            </div>
        );
    }
}

export default Checkbox;