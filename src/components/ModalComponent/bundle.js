import React from 'react';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';
import toastr from 'toastr';
const points = require('../../../Global_Values');

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bundleTitle: "Buy More, Save More",
            optionsCount: 0
        }
    }
    
    componentDidMount(){
        setTimeout(function() {
            this.addTab();
            setTimeout(function() {
                this.incrementCount();
                this.addTab();
                setTimeout(function() {
                    this.incrementCount();
                    this.addTab();
                    setTimeout(function() {
                        this.incrementCount();
                        this.addTab();
                    }.bind(this), 10);
                }.bind(this), 10);
            }.bind(this), 10);
        }.bind(this), 10);

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

    // Function of bundle
    bundleTitleChange(event){
        this.setState({bundleTitle: event.target.value});
    }

    removeTab(event){
        var firstBundleOption = 1;
        var app = document.getElementById('bundlecontainer');
        if (app.children.length != (firstBundleOption+1)) {
            var x = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            if(x.classList.contains("bundleslider")){
                x.remove();
            } else {
                x.parentNode.remove();
            }
        }
    }

    incrementCount(){
        this.setState((state) => {
            return {optionsCount: state.optionsCount + 1}
        });
    }

    addTab(){
        var firstBundleOption = 1;
        var self = this;
        var getSeq = ['50', '1', '2', '5'];
        var countSeq = ['1', '3', '5', '10'];
        var childElementCount = document.querySelector('#bundlecontainer').childElementCount;
        const chld = (
            <div className="grid bundleslider">
                <div className="grid__item one-whole">
                {(() => {
                    if(self.state.optionsCount === (firstBundleOption-1)){
                        return(
                            <select className="input-as-text bundle-option byinput" defaultValue="By_%" onChange={self.toggleBundle.bind(self)} title="Select Bundle Option">
                                <option value="By_%">By %</option>
                                <option value="By_Qty">By Qty</option>
                            </select>
                        );
                    } else {
                        return (
                            <select className="input-as-text bundle-option byinput" defaultValue="By_Qty" onChange={self.toggleBundle.bind(self)} title="Select Bundle Option">
                                <option value="By_%">By %</option>
                                <option value="By_Qty">By Qty</option>
                            </select>
                        );
                    }
                })()}
                </div>
                <div className="insertOptionHere">

                </div>
            </div>
        );
        var app = document.getElementById('bundlecontainer');
        function createElementFromHTML(htmlString, cb){
            var div = document.createElement('div');
            ReactDOM.render(htmlString, div, () => {
                // Refresh The Bundle Option IN Next Field
                self.toggleBundle(div.querySelector(".bundle-option"), countSeq[self.state.optionsCount], getSeq[self.state.optionsCount], () => {
                    // Change this to div.childNodes to support multiple top-level nodes
                    cb(div.firstChild);
                });
            });
        }
        createElementFromHTML(chld, data => {
            this.slideInit(app.appendChild(data));
            // Exec initializeSlider
            this.initializeSlider();
        });
    }
    setOffset(value, minValue, position){
        var offset = '';
        switch (true) {
            case (value == minValue):
                offset = '-3%';
                break;
            case (position >= .01 && position <= .24):
                offset = '-4%';
                break;
            case (position >= .25 && position <= .39):
                offset = '-5%';
                break;
            case (position >= .40 && position <= .52):
                offset = '-6%';
                break;
            case (position >= .40 && position <= .52):
                offset = '-7%';
                break;
            case (position >= .53 && position <= .67):
                offset = '-8%';
                break;
            case (position >= .68 && position <= .89):
                offset = '-9%';
                break;
            case (position >= .86):
                offset = '-10%';
                break;
        }
        return offset;
    }
    initializeSlider(){
        var self = this;
        document.querySelectorAll('.bundleslider').forEach(sl => {
          sl.querySelector('input[type="range"]').addEventListener('input' || 'change', (e) => {
              self.slideInit(sl)
          });
          sl.querySelector('.bundlevalue').addEventListener('keyup', (e) => {
              // slideInit(sl)
              sl.querySelector('input[type="range"]').value = sl.querySelector('.bundlevalue').value;
              self.slideInit(sl)
          });
          sl.querySelector('.bundlevalue').addEventListener('click', (e) => {
              sl.querySelector('.bundlevalue').setSelectionRange(0, sl.querySelector('.bundlevalue').value.length);
          });
        });
    }
    slideInit(element){
        var firstBundleOption = 1;
        var parentNode = element.parentNode;
        var indexOf = Array.prototype.indexOf.call(parentNode.children, element);
        // do something with index number
        
        var isPercentage = element.querySelector(".bundle-option").value;
        if(isPercentage == "By_%"){
          isPercentage = true;
        } else {
          isPercentage = false;
        }
        var el = element.querySelector('input[type="range"]');
        var sliderPos = el.value / el.max;
        var pixelPostion = el.clientWidth * sliderPos;
        el.style.backgroundImage = `linear-gradient(to right, #1abc9c 0% , #1abc9c ${el.value}%, #d7dcdf ${el.value}%)`;
        
        el.nextElementSibling.innerText = el.value + (isPercentage ? "%" : "PCS");
        el.nextElementSibling.style.left = (pixelPostion - 10) + "px";
        el.nextElementSibling.style.marginLeft = this.setOffset(el.value, el.min, sliderPos);
        element.querySelector('.bundlevalue').value = el.value;
        if(indexOf == firstBundleOption){
          var origPrice = document.getElementById("origPrice").value;
        } else {
          var origPrice = document.querySelector(".discountPrice").innerText;
        }
        var quantity = el.parentNode.parentNode.parentNode.querySelector(".quantity").value;
        var discountPrice = 0;
        if(isPercentage){
          discountPrice = (quantity * origPrice) - ((origPrice * quantity) * sliderPos);
        } else {
          discountPrice = (quantity * origPrice);
        }
        el.parentNode.parentNode.parentNode.querySelector(".discountPrice").innerText = Math.round(discountPrice * 100) / 100;
        this.updateBundle();
    }
    addQuantityOption(element, buyQty, rangeVal, cb){
        const generateHTML = (
            <div className="grid" style={{display:'flex', alignItems: 'baseline'}}>
                <div className="column column_3_12" style={{display:'flex', alignItems: 'baseline'}}>
                    <h4 className="bundle-title">Buy</h4>
                    <input type="text" id="buy" className="quantity form-control text-center input-as-text binput" defaultValue={buyQty ? buyQty : 1} onKeyUp={this.updateBundle.bind(this)} style={{width: '40px'}}/>
                    <h4 className="bundle-title">Get</h4>
                    <input type="text" id="get" className="form-control bundlevalue text-center input-as-text ginput" style={{width: '40px'}} />
                    <div className="input-group-append"></div>
                    <span className="bundle-title" id="toggle-bundle">Free</span>
                </div>

                <div className="column column_4_12">
                    <div style={{position: 'relative'}}>
                        <input type="range" name="sl-1" min="0" max="100" defaultValue={rangeVal ? rangeVal : 0} />
                        <span className="bundleslider__value">100</span>
                    </div>
                </div>

                <div className="column column_5_12">
                    <div className="column column_8_12">
                        <div style={{display: 'flex'}}>
                            <h4 className="bundle-title">BUNDLE PRICE: $</h4>
                            <h4 className="bundle-title discountPrice"></h4>
                        </div>
                    </div>

                    <div className="column column_4_12">
                        <div className="column column_6_12">
                            <button type="button" className="btn custom-btn" onClick={this.addTab.bind(this)}>
                                <span className="fas fa-plus"></span>
                            </button>
                        </div>
                        <div className="column column_6_12">
                            <button type="button" className="btn custom-btn" onClick={this.removeTab.bind(this)}>
                            <span className="fas fa-minus"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
        ReactDOM.render(generateHTML, element.querySelector(".insertOptionHere"), () => {
            cb();
        });
    };
    addPercentageOption(element, buyQty, rangeVal, cb){
        const generateHTML = (
            <div className="grid" style={{display:'flex', alignItems: 'baseline'}}>
                <div className="column column_3_12" style={{display:'flex', alignItems: 'baseline'}}>
                    <h4 className="bundle-title">Buy</h4>
                    <input type="text" id="buy" className="quantity form-control text-center input-as-text binput" defaultValue={buyQty ? buyQty : 1} onKeyUp={this.updateBundle.bind(this)} style={{width: '40px'}} />
                    <h4 className="bundle-title">Get</h4>
                    <input type="text" id="get" className="form-control bundlevalue text-center input-as-text ginput" style={{width: '40px'}} />
                    <div className="input-group-append"></div>
                    <span className="bundle-title" id="toggle-bundle">% Off</span>
                </div>

                <div className="column column_4_12">
                    <div style={{position: 'relative'}}>
                        <input type="range" name="sl-1" min="0" max="100" defaultValue={rangeVal ? rangeVal : 50} />
                        <span className="bundleslider__value">100</span>
                    </div>
                </div>

                <div className="column column_5_12">
                    <div className="column column_8_12">
                        <div style={{display: 'flex'}}>
                            <h4 className="bundle-title">BUNDLE PRICE: $</h4>
                            <h4 className="bundle-title discountPrice"></h4>
                        </div>
                    </div>

                    <div className="column column_4_12">
                        <div className="column column_6_12">
                            <button type="button" className="btn custom-btn" onClick={this.addTab.bind(this)}>
                                <span className="fas fa-plus"></span>
                            </button>
                        </div>
                        <div className="column column_6_12">
                            <button type="button" className="btn custom-btn" onClick={this.removeTab.bind(this)}>
                                <span className="fas fa-minus"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
        ReactDOM.render(generateHTML, element.querySelector(".insertOptionHere"), () => {
            cb();
        });
    };
    toggleBundle(element, buyQty, rangeVal, cb){
        if(!element.value){
            element = element.target;
        }

        var self = this;
        this.setState({options: element.value}, () => {
            var newElem = element.parentNode.parentNode;
            if(element.value == "By_%"){
                if(buyQty && rangeVal){
                    self.addPercentageOption(newElem, buyQty, rangeVal, () => {
                        self.refeshDOM(newElem, cb ? cb : null);
                    });
                } else {
                    self.addPercentageOption(newElem, "", "", () => {
                        self.refeshDOM(newElem, cb ? cb : null);
                    });
                }
                } else {
                if(buyQty && rangeVal){
                    self.addQuantityOption(newElem, buyQty, rangeVal, () => {
                        self.refeshDOM(newElem, cb ? cb : null);
                    });
                } else {
                    self.addQuantityOption(newElem, "", "", () => {
                        self.refeshDOM(newElem, cb ? cb : null);
                    });
                }
            }
        });
    }
    refeshDOM(newElem, cb){
        var firstBundleOption = 1;
        if(document.querySelector("#bundlecontainer").childElementCount > firstBundleOption){
          this.slideInit(newElem);
        }
        this.initializeSlider();
        this.updateBundle();
        cb ? cb() : void 0;
    }
    updateBundle(event){
        document.querySelectorAll(".bundleslider").forEach((el, i) => {
            if(i == 0){
                var updatedOrigPrice = document.getElementById("origPrice").value;
            } else {
                var updatedOrigPrice = document.querySelector(".discountPrice").innerText;
            }
            var quantity = el.querySelector(".quantity").value;
            var discountPrice = 0;
            if(el.querySelector(".bundle-option").value == "By_%"){
                discountPrice = (updatedOrigPrice * quantity) - ((updatedOrigPrice * quantity) * (el.querySelector("[type='range']").value / 100));
            } else {
                discountPrice = (updatedOrigPrice * quantity);
            }
            el.querySelector(".discountPrice").innerText = Math.round(discountPrice * 100) / 100;
        });
    }
    compileBundle(){
        this.props.closeModal();
        this.props.toggleDisabled();
        toastr.clear();
        toastr.info('Please wait...','Granting Your Wish');
        const regex = new RegExp(/\/\w+-.*/g);
        const url = window.location.href;
        var fproductUrl = "https://productlistgenie.io/products/"+this.props.productHandle;
        var orig_price = document.querySelector("#origPrice").value;

        var bundle_variants = [];
        document.querySelectorAll(".grid.bundleslider").forEach((el, i) => {
            var isNotPercentage = el.querySelector(".bundle-option").value;
            if(isNotPercentage == "By_%"){
                isNotPercentage = false;
            } else {
                isNotPercentage = true;
            }
            if(i == 0){
                orig_price = document.querySelector("#origPrice").value;
            } else {
                orig_price = document.querySelector(".discountPrice").innerText;
            }
            bundle_variants.push({
                title: "Buy "+el.querySelector("#buy").value+" GET "+el.querySelector("#get").value+(isNotPercentage ? " Free" : "% Off"),
                price: parseFloat(el.querySelector(".discountPrice").innerText),
                compare_price: isNotPercentage ? (parseInt(el.querySelector("#buy").value) + parseInt(el.querySelector("#get").value)) * orig_price : (el.querySelector('input.quantity').value * orig_price)
            });
        });

        var store_name = this.props.session.getCurrentUser.store_url;
        var store_token = this.props.session.getCurrentUser.store_token;
        
        var bundle = {
            url: fproductUrl,
            vendor: document.querySelector("#vendor_link") ? document.querySelector("#vendor_link").href.replace(/\?.*/g,"") : void 0,
            edit: false, //readyEdit,
            compare_at_price: orig_price,
            tags: "",
            bundle_name: document.getElementById("bundle-name").value,
            variants: bundle_variants,
            store_name: store_name,
            store_token: store_token,
            mapVariants: this.props.variant_map ? this.props.variant_map : []
        };
        
        fetch(points.apiServer+'/popbundle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bundle)
        })
        .then(response => response.json())
        .then(result => {
            if(result.data.productCreate.userErrors.length !== 0){
                toastr.clear();
                toastr.error(result.data.productCreate.userErrors[0].message,'Push Failed');
            } else {
                toastr.options.onclick = function (){
                    window.open(result.data.productCreate.product.onlineStorePreviewUrl,'_blank');
                    toastr.clear();
                }
                this.updatePoints();
            }
        })
        .catch(err => {
            toastr.clear();
            toastr.error('Please try again.','Failed to grant a wish');
        });
    }
    // end bundle function
    
    updatePoints(){
        var id = this.props.session.getCurrentUser.id;
        var value = points.points_pushWithBundle;
        var payload = {"query":`mutation{\n  mutate1: updateCount(id:\"${id}\", increaseWhat: "push_bundle"){\n    email },\n  \n  mutate2: updateRewardPoints(id:\"${id}\", source: "Push With Bundle", reward_points:${value}){\n    points\n    date\n  }\n}`,"variables":null}
        fetch(points.clientUrl+'/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            points.playSoundEffect();
            this.props.toggleDisabled(true);
            toastr.clear();
            toastr.success('Click here to view it on your store','Success');
            this.props.refetch();
        });
    }
    
    render(){
        return(
            <div>
                <Popup
                    open={this.props.open}
                    closeOnDocumentClick
                    onClose={this.props.closeModal} >
                <div className="modal" style={{padding: '20px', fontFamily: 'inherit'}}>
                    <a className="close" onClick={this.props.closeModal}>
                    &times;
                    </a>
                    <div className="header">
                        <h1>Bundle Genie</h1>
                    </div>
                    <div>
                        <div>
                            <fieldset className="section is-active">
                                <h3>Create a {this.state.bundleTitle} Bundle&nbsp;
                                    <Popup
                                        trigger={<span className="fas fa-info-circle"></span>}
                                        position="bottom center"
                                        on="click" className="points-tooltip">
                                        <div style={{padding: '5px 20px', overflow: 'hidden'}}>
                                            <div className="text-center">
                                                <h3>How to use Bundle Genie?</h3>
                                            </div>
                                            <div style={{textAlign: 'left'}}>
                                                ...
                                            </div>
                                        </div>
                                    </Popup>
                                </h3>
                                <div className="error"></div>
                                {/* <!-- -------------------------------------------------------- First Step -------------------------------------------------------- --> */}
                                <div id="bundlecontainer">
                                    <div className="grid" style={{display: 'flex', alignItems: 'baseline'}}>
                                        <div className="column column_3_12">
                                            <h4>Please Select Bundle Title</h4>
                                        </div>
                                        <div className="column column_3_12">
                                            <select className="input-as-text btinput" id="bundle-name" defaultValue={this.state.bundleTitle} onChange={this.bundleTitleChange.bind(this)}>
                                                <option value="Buy More, Save More">Buy More, Save More</option>
                                                <option value="Best Deals">Best Deals</option>
                                            </select>
                                        </div>
                                        <div className="column column_6_12">
                                            <div className="column column_7_12">
                                                <h4>Product Price <span>(Compare Price)</span></h4>
                                            </div>
                                            <div className="column column_5_12">
                                                <input type="number" className="bundle-title form-control" id="origPrice" defaultValue={this.props.price*2} onChange={this.updateBundle.bind(this)} style={{textAlign: 'center'}}/>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <!-- Continue Data Here --> */}
                                </div>
                                <br />
                                <div className="form_buttons">
                                    <div className="float-right">
                                        <button className="btn" onClick={this.compileBundle.bind(this)}>Add Bundle To Product</button>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
                </Popup>
            </div>
        );
    }
}

export default Index;