import React from 'react';

class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    submitForm(event) {
        let { onSubmit } = this.props;
        event.preventDefault();
        onSubmit(event);
    }

    render() {
        let { children, submitClassName, submitText, disabled } = this.props;
        return (
            <form className="form funnel stretch-width" onSubmit={event => this.submitForm(event)}>
                {children}
                <div className={"row-separator " + (submitClassName || "")}>
                    <div className="form_buttons" style={{ paddingBottom: 1 }}>
                        <button type="submit" className="btn stretch-width" disabled={disabled}>{submitText}</button>
                    </div>
                </div>
                <div className="clear" />
            </form>
        );
    }
}

export default Checkbox;