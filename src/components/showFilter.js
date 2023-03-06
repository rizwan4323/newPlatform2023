import React from 'react';
const points = require('../../Global_Values');

class SelectTag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const style = this.props.style ? this.props.style : { padding: '5px 10px', width: 'fit-content', border: '1px dashed #28c686', margin: '5px 5px 0 0' };
        const onClick = this.props.onClick;
        const closeBtn = typeof this.props.close == "undefined" ? true : this.props.close;
        const isArray = points.isArray(this.props.label);
        if (isArray) {
            const label = this.props.label;
            return label.map((e, i) => {
                return (
                    <div className="product-card display-inline" style={style} key={i}>
                        <label>{e}</label>
                        {closeBtn &&
                            <label className="cursor-pointer color-dark-red" style={{ marginLeft: 5, fontSize: '1em', fontWeight: 800, }} onClick={() => {
                                label.splice(i, 1);
                                onClick(label);
                            }}>
                                <span className="fas fa-times" />
                            </label>
                        }
                    </div>
                );
            });
        } else {
            const label = points.capitalizeWord(this.props.label);
            return (
                <div className="product-card display-inline" style={style}>
                    <label>{label}</label>
                    {closeBtn &&
                        <label className="cursor-pointer color-dark-red" style={{ marginLeft: 5, fontSize: '1em', fontWeight: 800, }} onClick={() => {
                            onClick();
                        }}>
                            <span className="fas fa-times" />
                        </label>
                    }
                </div>
            );
        }
    }
}
export default SelectTag;