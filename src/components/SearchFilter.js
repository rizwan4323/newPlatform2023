import React from 'react';

class SearchFilter extends React.Component {
    constructor(props){
        super(props);
    }

    changeDateRange(event){
        this.props.dateOnChange(event.target.value)
    }

    changeTags(event){
        this.props.tagsOnChange(event.target.value)
    }

    render() {
        return (
            <div>
                <div className="column column_6_12">
                    <div className="product-details drpcon text-left" style={{background: 'inherit', color: '#010000'}}>
                        Date added to store <br/>
                        <div className="float-right" style={{position: 'absolute', right: '5%'}}>
                            <br/>
                            <span className="fas fa-caret-up"></span>
                        </div>
                        <select className="dropbtn drp stretch-width" defaultValue="" onChange={this.changeDateRange.bind(this)} style={{backgroundColor: 'inherit'}}>
                            <option value="">All</option>
                            <option value="1">1 Day Ago</option>
                            <option value="2">2 Days Ago</option>
                            <option value="3">3 Days Ago</option>
                            <option value="4">4 Days Ago</option>
                            <option value="5">5 Days Ago</option>
                            <option value="6">6 Days Ago</option>
                            <option value="7">7 Days Ago</option>
                            <option value="8">8 Days Ago</option>
                            <option value="9">9 Days Ago</option>
                        </select>
                    </div>
                </div>
                <div className="column column_6_12">
                    <div className="product-details drpcon text-left" style={{background: 'inherit', color: '#010000'}}>
                        Product Categories <br/>
                        <div className="float-right" style={{position: 'absolute', right: '5%'}}>
                            <br/>
                            <span className="fas fa-caret-up"></span>
                        </div>
                        <select className="dropbtn drp stretch-width" defaultValue="" onChange={this.changeTags.bind(this)} style={{backgroundColor: 'inherit'}}>
                            <option value="">All</option>
                            <option value="beauty-cosmetics">Beauty & Cosmetics</option>
                            <option value="christmas">Christmas</option>
                            <option value="gadgets">Gadgets</option>
                            <option value="google_ready">Google Ready</option>
                            <option value="Home Accessories">Home Accessories</option>
                            <option value="kitchen-products">Kitchen Products</option>
                            <option value="Pet Essentials">Pet Essentials</option>
                            <option value="starter">Starter Picks</option>
                            <option value="Tools">Tools</option>
                            <option value="toys">Toys</option>
                            <option value="wearables">Wearables & Jewelries</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchFilter;