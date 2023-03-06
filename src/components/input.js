import React from 'react';

class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.timeout = null;
        this.state = { input_value: "" };
    }

    componentDidMount() { // for default value of component input
        let { value } = this.props;
        if (value) this.setState({ input_value: value });
    }

    componentWillReceiveProps(nextProps) { // pag ni clear ung props value ng input update component input value too
        if (!nextProps.value) this.setState({ input_value: nextProps.value });
        if (!nextProps.hasPoll && nextProps.value !== this.state.input_value) this.setState({ input_value: nextProps.value });
    }

    inputOnKeyPress(event) {
        let keyCode = (typeof event.which === "number") ? event.which : event.keyCode;
        if (keyCode === 13) event.target.dispatchEvent(new Event("blur"));
    }

    inputOnChange(event) { // on change of input
        let name = event.target.name, value = event.target.value, { onChange } = this.props;
        this.setState({ input_value: value }, () => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                clearTimeout(this.timeout); // remove timeout for onblur
                onChange({ name, value });
            }, 500); // after 1 second update the parent state by calling the onchange function
        });
    }

    inputOnBlur(event) {
        let name = event.target.name, value = event.target.value, { onChange } = this.props;
        clearTimeout(this.timeout); // remove timeout for onblur
        onChange({ name, value });
    }

    render() {
        let { style, type, name, placeholder, className, readOnly, required } = this.props;
        return (
            <div className={"row-separator " + (className || "")} style={style}>
                <div className="form_input" style={{ paddingBottom: 1 }}>
                    <input name={name || ""} type={type || "text"} value={this.state.input_value} placeholder={placeholder || ""} onChange={event => this.inputOnChange(event)} onKeyPress={event => this.inputOnKeyPress(event)} onBlur={event => this.inputOnBlur(event)} readOnly={readOnly} required={required} />
                    <span className="bottom_border"></span>
                </div>
            </div>
        );
    }
}

export default Checkbox;