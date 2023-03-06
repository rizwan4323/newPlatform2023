import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import toastr from 'toastr';
import withAuth from '../hoc/withAuth';
import Loading from '../components/loading';
const points = require('../../Global_Values');

class StoreRanking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            searchValue: '',
            isCanNext: true,
            NextOrPrev: 'default',
            error: ''
        }
    }

    // for post request
    fetchPOST(url, data, cb) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data
        })
        .then(response => response.json())
        .then(result => {
            cb(result, this)
        })
        .catch(err => {
            cb("error", this)
        });
    }
    // for get request
    fetchGET(url, cb) {
        fetch(url)
        .then(response => response.json())
        .then(result => {
            cb(result, this)
        });
    }

    componentDidMount() {
        this.requestStoreRanking();
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut": 0,
            "extendedTimeOut": 0,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    }

    spyAdLoading(str, event) {
        event.preventDefault();
        toastr.clear();
        toastr.info('Please wait...', 'Granting Your wish');
        points.webSpy(str, this.spyAdCallBack);
    }

    spyAdCallBack(data) {
        if (data.status === "success") {
            toastr.clear();
            toastr.options.onclick = function () {
                console.log(data.message)
                window.open(data.message, '_blank');
                toastr.clear();
            }
            toastr.success('Click Here to view ads', 'Wish Granted!');
        } else {
            toastr.clear();
            toastr.warning(data.message, 'Wish failed');
        }
    }

    requestStoreRanking() {
        toastr.clear();
        toastr.info('Please wait...', 'Granting Your wish');

        var self = this;
        ReactDOM.render(<div className="clear center-vertical"><Loading height={200} width={200} /></div>, document.getElementById("displayhere"), () => {
            console.log("Loading...");
            let url = "";
            if (self.state.searchValue === "") {
                url = "https://myip.ms/browse/sites/" + self.state.page + "/ipID/23.227.38.32/ipIDii/23.227.38.32";
            } else {
                url = "https://myip.ms/browse/sites/" + self.state.page + "/url/" + self.state.searchValue + "/ipID/23.227.38.32/ipIDii/23.227.38.32";
            }
            let data = JSON.stringify({ url });
            self.fetchPOST(points.serverServer, data, self.fetchResult);
            // self.fetchGET(points.serverServer+url, self.fetchResult)
        });
    }

    fetchResult(data, self) {
        toastr.clear();
        let popularWebsite = "";
        if (self.state.searchValue === "") {
            popularWebsite = "Website";
        } else {
            popularWebsite = self.state.searchValue + " Website";
        }
        
        let currentData = [];
        if(typeof data == "string"){
            self.setState({
                error: "WE ARE GATHERING DATA. PLEASE CHECK BACK LATER"
            })
        } else {
            let totalData = (<span id='all_records' dangerouslySetInnerHTML={{ __html: data.records }}></span>);
            if (window.screen.width >= 1100) {
                //Desktop
                currentData.push((
                    <div className="column column_12_12" key={0}>
                        <div className="float-right form_buttons" style={{ width: 'auto' }}>
                            {totalData} <br />
                            <button className="btn custom-btn-class test" onClick={() => self.searchData('prev')}>Prev</button> | &nbsp;
                            <button className="btn custom-btn-class test" onClick={() => self.searchData('next')}>Next</button>
                        </div>
                        <div className="text-center">
                            <h3>Popular {popularWebsite}</h3>
                        </div>
                        <div className="column column_12_12">
                            <div className="column column_4_12">
                                <h3>Website Name</h3>
                            </div>
                            <div className="column column_3_12">
                                <div className="column column_6_12">
                                    &nbsp;
                                </div>
                                <div className="column column_6_12">
                                    &nbsp;
                                </div>
                            </div>
                            <div className="column column_2_12">
                                <h3>Rank</h3>
                            </div>
                            <div className="column column_3_12">
                                <h3>Website Popularity</h3>
                            </div>
                        </div>
                    </div>
                ));

                data.info.map(data => {
                    currentData.push((
                        <div className="column column_12_12" key={data.number}>
                            <div className="column column_3_12">
                                <strong>{data.number})</strong> {data.name}
                            </div>
                            <div className="column column_4_12">
                                <div className="column column_6_12 text-center">
                                    <a className="btn custom-btn-class" href={"https://" + data.name + "/collections/all?sort_by=best-selling"} target="_blank">Best Products</a>
                                </div>
                                <div className="column column_6_12 text-center">
                                    <a className="btn custom-btn-class" href="#" onClick={event => self.spyAdLoading(data.name, event)}>Ad Spy</a>
                                </div>
                            </div>
                            <div className="column column_2_12">
                                {data.rating}
                            </div>
                            <div className="column column_3_12">
                                {data.popularity} visitors per day
                            </div>
                        </div>
                    ));
                });
            } else {
                //Mobile
                currentData.push((
                    <div className="column column_12_12" key={0}>
                        <div className="text-right">
                            {totalData}<br />
                            <button className="pbbtn custom-btn-class test" onClick={() => self.searchData('prev')}>Prev</button>
                            <button className="pbbtn custom-btn-class test" onClick={() => self.searchData('next')}>Next</button>
                        </div>
                        <div className="text-center">
                            <h1>Popular {popularWebsite}</h1>
                        </div>
                    </div>
                ));

                data.info.map(data => {
                    currentData.push((
                        <div className="column column_6_12" style={{ margin: '5px 0px' }}>
                            <div className="clearfix" style={{ backgroundColor: '#f6f6f6', borderRadius: '5px', padding: '10px' }}>
                                <div className="grid__item one-whole">
                                    <div style={{ position: 'relative' }}>
                                        <a href="#" onClick={event => self.spyAdLoading(data.name, event)} style={{ position: 'absolute', right: '2%' }}>Ad Spy</a>
                                        <a style={{ position: 'absolute', right: '2%', top: '20px' }} href={"https://" + data.name + "/collections/all?sort_by=best-selling"} target="_blank">Best Products</a>
                                    </div>
                                    <strong>{data.number}</strong>) {data.name}
                                </div>
                                <div className="grid__item one-whole">
                                    Rating: {data.rating}
                                </div>
                                <div className="grid__item one-whole">
                                    Popularity:<br />{data.popularity} visitors per day
                                </div>
                            </div>
                        </div>
                    ));
                });
            };
        }

        ReactDOM.render(currentData, document.getElementById("displayhere"), () => {
            console.log("Data Loaded");
            typeof data == "string" ? void 0 : self.checkPage();
        });
    }

    checkPage() {
        var records = document.getElementById("all_records").innerText.trim();
        if (records == "Total: 0 records") {
            document.getElementById("search_area").style.display = "block";
            document.getElementById("displayhere").innerHTML = `<br><div class='text-center'><h1>Sorry, we couldn't find any result matching "${searchValue}"</h1></div>`;
        } else {
            records = records.split(" ");
            var currentPage = records[2];
            var lastPage = records[4];
            if (currentPage === lastPage) {
                this.setState({ isCanNext: false });
                console.log("Next or Prev is not available");
            } else {
                this.setState({ isCanNext: true });
                console.log("Next or Prev is Available");
            }
        }
    }

    handleKeyUp(event) {
        if (event.keyCode === 13) {
            this.searchData('search');
        }
    }

    searchData(np, event) {
        let object = { error: '' };
        if (np == "search") {
            if (document.getElementById("query").value) {
                object.searchValue = document.getElementById("query").value;
            }
            // reset every variable
            object.page = 1;
            object.isCanNext = true;
            object.NextOrPrev = "default";
            this.setState({
                ...object
            }, () => {
                searchNow();
            });
        } else if (np == "next") {
            object.page = this.state.page + 1;
            object.NextOrPrev = "next";
            this.setState({
                ...object
            }, () => {
                searchNow();
            });
        } else {
            if (this.state.page > 1) {
                object.page = this.state.page - 1;
                object.NextOrPrev = "prev";
                this.setState({
                    ...object
                }, () => {
                    searchNow();
                });
            }
        }

        var self = this;
        function searchNow() {
            if (self.state.page >= 1 && self.state.isCanNext) {
                if (self.state.NextOrPrev == "search" || self.state.NextOrPrev == "default") {
                    if (document.getElementById("query").value) {
                        self.requestStoreRanking();
                    } else {
                        // error prompt
                        toastr.clear();
                        toastr.warning('Cannot search if the search field is empty', 'Search Field Empty');
                    }
                } else {
                    self.requestStoreRanking();
                }
            } else {
                console.log("Can't proceed");
            }
        }
    }

    render() {
        return (
            <Fragment>
                <div className="page-container">
                    <div className="text-center">
                        <h2>Store Ranking</h2>
                    </div>
                    <div>
                        <div className="grid" id="search_area">
                            <div className="column column_8_12">
                                <div className="form_wrap">
                                    <div className="form_row">
                                        <div className="form_item">
                                            <div className="form_input">
                                                <label style={{ fontSize: '1em' }}>Search Website Name</label> <br />
                                                <input type="text" name="query" id="query" onKeyUp={this.handleKeyUp.bind(this)} placeholder="e.g: productlistgenie.io, productlistgenie" style={{ width: '100%' }} />
                                                <span className="bottom_border"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="column column_4_12">
                                <div className="form_buttons">
                                    <input type="submit" name="submit" className="btn" onClick={this.searchData.bind(this, 'search')} style={{ width: '100%', padding: '15px 0' }} value="Search" />
                                </div>
                            </div>
                        </div> <br />
                        {this.state.error &&
                            <div className="text-center clear">
                                <h2>{this.state.error}</h2>
                            </div>
                        }
                        <div className="grid" id="displayhere">
                            <div className="clear center-vertical">
                                <Loading height={200} width={200} />
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(StoreRanking);