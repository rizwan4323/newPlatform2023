import React from 'react';
import Popup from 'reactjs-popup';
const points = require('../../Global_Values');

class SearchField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSearchBox: false,
            isSearchLoading: false,
            searchField: "",
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) this.setState({ searchField: nextProps.value || "" });
    }

    shouldComponentUpdate(nextProps, nextState) {
        var shouldUpdate = false;
        if (JSON.stringify(this.props) != JSON.stringify(nextProps) || JSON.stringify(this.state) != JSON.stringify(nextState)) shouldUpdate = true;
        return shouldUpdate;
    }

    componentDidMount() {
        if (this.props.value) this.searchFieldOnChange(this.props.value);
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (!this.props.value && prevProps.value) this.searchFieldOnChange("");
    }

    toggleSearchField() {
        const showHideSearchBox = !this.state.showSearchBox;
        this.setState({ showSearchBox: showHideSearchBox, searchField: showHideSearchBox ? "" : this.state.searchField }, () => {
            const name = this.props.name ? this.props.name : "search-field";
            const width = this.props.width ? this.props.width : 210;
            if (this.state.showSearchBox) { // animation sa pagbukas
                document.querySelector("[name='" + name + "']").style.cssText = "width: " + width + "px; padding: 9px 15px;";
            } else if(this.state.searchField) { // animation sa pag sara
                this.setState({ searchField: "" }, () => {
                    this.props.onSubmit(""); // pag sinara meaning burahin ang laman at tawagin ang onsubmit function
                    document.querySelector("[name='" + name + "']").value = "";
                    document.querySelector("[name='" + name + "']").style.cssText = "width: 0; padding: 0;";
                })
            }
        })
    }

    searchFieldOnChange(value) {
        this.setState({ searchField: value })
    }

    getTooltip(trigger){
        const { tooltip, tooltipLocation, width } = this.props;
        if (tooltip) {
            const tooltipStyle = { borderRadius: 5, width: '100%' };
            if (width) tooltipStyle.width = width;
            return (
                <Popup trigger={trigger} position={tooltipLocation ? tooltipLocation : "bottom center"} on="hover" arrow={false} contentStyle={tooltipStyle}>
                    <label>{tooltip}</label>
                </Popup>
            );
        } else return trigger;
    }

    render() {
        const extraClassName = this.props.containerClassName ? " " + this.props.containerClassName : "";
        const extraStyle = this.props.containerStyle ? this.props.containerStyle : {};
        const extraInputStyle = this.props.inputStyle ? this.props.inputStyle : {};
        const placeHolder = this.props.placeHolder ? this.props.placeHolder : "";
        const name = this.props.name ? this.props.name : "search-field";
        const onSubmit = this.props.onSubmit ? this.props.onSubmit : () => { };
        const expandable = this.props.expandable ? true : false;
        const width = this.props.width ? this.props.width : "100%";
        const state = this.state;
        if (expandable) {
            return this.getTooltip(
                <div className={"btn-search-container display-inline" + extraClassName} style={{ position: 'relative', ...extraStyle }}>
                    <input
                        type="text"
                        className="font-roboto-light search-field"
                        name={name}
                        value={state.searchField}
                        placeholder={placeHolder}
                        onChange={event => this.searchFieldOnChange(event.target.value)}
                        onKeyUp={event => points.enterToProceed(event, onSubmit, state.searchField)}
                        onClick={event => event.target.select()}
                        style={{ width: state.showSearchBox ? width : 0, padding: state.showSearchBox ? '10px 15px' : 0, ...extraInputStyle }}
                    />
                    <button
                        className={"fas fa-"+(state.showSearchBox ? "times" : "search")}
                        onClick={() => this.toggleSearchField()}
                        style={extraInputStyle}
                    />
                </div>
            );
        } else {
            return this.getTooltip(
                <div className={"btn-search-container display-inline" + extraClassName} style={{ position: 'relative', ...extraStyle, width }}>
                    <input
                        type="text"
                        name={name}
                        value={points.isArray(state.searchField) ? "" : state.searchField}
                        placeholder={placeHolder}
                        onChange={event => this.searchFieldOnChange(event.target.value)}
                        onKeyUp={event => points.enterToProceed(event, onSubmit, state.searchField)}
                        onClick={event => event.target.select()}
                        onPaste={event => {
                            let str = points.getStringFromClipboard(event), value = str.split(/\n/g).filter(e => e);
                            if (value.length === 1) value = value.toString();
                            onSubmit(value, true);
                        }}
                        style={extraInputStyle}
                    />
                    <button
                        className="fas fa-search"
                        onClick={() => onSubmit(state.searchField)}
                        style={extraInputStyle}
                    />
                </div>
            );
        }
    }
}
export default SearchField;