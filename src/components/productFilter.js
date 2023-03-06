import React from 'react';
import toastr from 'toastr';
import DoubleRangeSlider from '../components/doubleRangeSlider';
import ButtonWithPopup from '../components/buttonWithPopup';

class ProductFilter extends React.Component {
    constructor() {
        super();
        this.state = {
            
        }
    }

    componentDidMount() {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut":0,
            "extendedTimeOut":0,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    }

    render() {
        const { float, activeLanguage, showLanguageFilter } = this.props; // variables
        const { activeLanguageCallback, applyFilter } = this.props; // functions
        var style = {padding: 0};
        if(showLanguageFilter) style = { border: '1px solid #dfe5eb', padding: 5 };

        return (
            <ButtonWithPopup data={{
                triggerDOM: <div id="Product_Filter" className="display-inline cursor-pointer" style={{ padding: '5px 10px', width: 'fit-content', backgroundColor: '#fff', border: '1px solid #dfe5eb', borderRadius: 3, float: float }}>
                    <span className="fas fa-bars" style={{marginRight: 5}} /> <label>Filter</label>
                </div>,
                popupPosition: "bottom right",
                title: "",
                text: <div className="text-left">
                    {showLanguageFilter &&
                        <div className="row-separator">
                            <label>Language: </label>
                            <div className="flex-container lang-available" style={{justifyContent: 'flex-start'}}>
                                <span className={"lang-uk cursor-pointer" + (activeLanguage == "us" ? " lang-active" : "")} onClick={() => activeLanguageCallback("us", "brandable")} style={{ padding: '1px 2px' }} />
                                <span className={"lang-es cursor-pointer" + (activeLanguage == "es" ? " lang-active" : "")} onClick={() => activeLanguageCallback("es", "brandable-spanish")} style={{ padding: '1px 2px' }} />
                            </div>
                        </div>
                    }
                    <div style={style}>
                        <div className="row-separator">
                            <label>Rating <em id="rating-min">2</em> - <em id="rating-max">4</em></label>
                            <DoubleRangeSlider id="prod_rating" onUpdate={(min, max) => {
                                document.getElementById("rating-min").innerHTML = min;
                                document.getElementById("rating-max").innerHTML = max;
                            }} seMin={1} seStep={0.1} seMinVal={2} seMaxVal={4} seMax={5} />
                        </div>
                        <div className="row-separator">
                            <label>Ad Strength <em id="str-min">30%</em> - <em id="str-max">70%</em></label>
                            <DoubleRangeSlider id="prod_strength" onUpdate={(min, max) => {
                                document.getElementById("str-min").innerHTML = min+"%";
                                document.getElementById("str-max").innerHTML = max+"%";
                            }} seMin={1} seStep={1} seMinVal={30} seMaxVal={70} seMax={100} />
                        </div>
                        <button className="btn-success font-roboto-light stretch-width" onClick={() => applyFilter()}>Search</button>
                    </div>
                </div>,
                triggerID: "Product_Filter",
                loading: false,
                padding: "5px 10px 10px",
                checkORtimesButton: false,
                style: { maxWidth: 'fit-content', minWidth: 'fit-content', border: 'none' }
            }} />
        );
    }
}
export default ProductFilter;