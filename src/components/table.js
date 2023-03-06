import React from 'react';
import Loading from '../components/loading';
let prev = [];

class Table extends React.Component {
    constructor(props){
        super(props);
        if (this.props.headers) prev = this.props.headers;
        this.headers = prev;
    }

    render() {
        let { containerStyle } = this.props;
        return (
            <div className="responsive-table">
                <table className="table-list">
                    <thead>
                        <tr>
                            {this.props.headers.map((header, index) => {
                                let style = { ...header.style, ...containerStyle };
                                return <th className={header.className + (header.onClick ? " cursor-pointer opacity-hover" : "")} onClick={() => header.onClick ? header.onClick() : {}} style={style} key={index}>{header.text}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.children}
                    </tbody>
                </table>
            </div>
        );
    }
}

class Tbody extends Table {
    constructor(props){
        super(props);
        this.state = {};
    }

    render() {
        const state = this.state;
        const stateName = "block_"+index;
        var { className, style, index, loading, singleRowText, id } = this.props;
        if(!className) className = "";
        if(!style) style = {};
        if(!index) index = 0;
        if(loading || singleRowText) {
            return (
                <tr className={className+(state[stateName] ? " td-show-stock" : "")} style={style}>
                    <td className="text-center" colSpan={this.headers.length}>
                        {singleRowText ? <label>{singleRowText}</label> : <Loading width={150} height={150} /> }
                    </td>
                </tr>
            );
        }
        return (
            <tr className={className+(state[stateName] ? " td-show-stock" : "")} style={style} id={id}>
                {this.props.children.map((child, index) => {
                    const cc = child && child.props && child.props.className ? child.props.className : "";
                    if(index == 0) {
                        return (
                            <td className={index == 0 ? "td-stock-clickable-parent" : 0} key={index}>
                                <div className={cc + " display-inline"}>
                                    <label className="hide-in-desktop"><span className={(state[stateName] ? "fas fa-angle-down" : "fas fa-angle-right") + " color-green"} style={{ fontSize: '1.3em', marginRight: 5 }} /></label>
                                    <div className="hide-in-desktop td-stock-clickable" onClick={() => this.setState({ [stateName]: state[stateName] ? false : true })} />
                                    {child}
                                </div>
                            </td>
                        );
                    } else {
                        return (
                            <td key={index}>
                                <div className={cc}>
                                    <label className="hide-in-desktop font-roboto-bold td-mobile-header">{this.headers[index] ? this.headers[index].text : ""}</label>
                                    {child}
                                </div>
                            </td>
                        );
                    }
                })}
            </tr>
        );
    }
}

exports.Table = Table;
exports.Tbody = Tbody;