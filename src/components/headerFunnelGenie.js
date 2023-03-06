import React from 'react';
import { NavLink } from 'react-router-dom';
import withSession from './../hoc/withSession';
import moment from 'moment';
import Popup from 'reactjs-popup';
import SelectTag from '../components/selectTag';
import SaveTo from '../components/funnelPageSaveTo';
import SavePageTemplate from '../components/savePageTemplate';
import toastr from 'toastr';
const designTemplate = require('../../FunnelGenieTemplate');
const condition = require('../../Global_Conditions');
const points = require('../../Global_Values');

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            no_zopim: true
        }
    }

    componentDidMount(){
        if(!document.querySelector(".zopim")) {
            this.setState({ no_zopim: true })
        }
    }

    componentDidUpdate(){
        // start fix height of editor iframe
        var headerDOM = document.querySelector(".new-header");
        var editorDOM = document.getElementById("editor");
        editorDOM.style.cssText = "padding-top: "+headerDOM.offsetHeight+"px; height: 100vh;";
        // end fix height of editor iframe
    }

    resizeEditor (mode) {
        let size = "unset", modalMinWidth = "60%";
        let ifr = document.querySelector('#editor iframe');
        let ubodyParent = ifr.contentDocument.getElementById("u_body").parentNode;
        ubodyParent.classList.remove("edit-mobile"); // reset class
        ubodyParent.classList.remove("edit-tablet"); // reset class
        if(mode === "mobile") {
            size = "371px";
            modalMinWidth = "90%";
            ubodyParent.classList.add("edit-mobile");
        } else if(mode === "tablet") {
            size = "659px";
            modalMinWidth = "80%";
            ubodyParent.classList.add("edit-tablet");
        }
        // for floating rows
        ifr.contentDocument.getElementById("u_body").querySelectorAll(".resize-element").forEach(el => {
            el.style.maxWidth = size
        });
        // for modal contents min width
        ifr.contentDocument.getElementById("u_body").querySelectorAll(".plg_modal").forEach(el => {
            el.querySelector(".container").style.height = modalMinWidth.replace("%", "vh");
            el.querySelector(".row").style.minWidth = modalMinWidth;
        });
    }
    
    closeProfile(){
        document.querySelector(".wrap").click()
    }

    render() {
        console.log("Is Page Ready ? ", this.props.headerActions.isPageFullyLoaded);
        let currentUser = this.props.session.getCurrentUser;
        if (currentUser) {
            return (
                <div className="funnel new-header text-left" style={{height: 'unset', border: 'none'}}>
                    <ul className="funnel-editor">
                        <li>
                            <NavLink className="header-navigation-links display-inline cursor-pointer" to="/funnel-genie-main" style={{ width: 'inherit', padding: 10 }}>
                                <span className="fas fa-home" style={{fontSize: 14}} />
                                <label className="cursor-pointer" style={{marginLeft: 5}}>Home</label>
                            </NavLink>
                        </li>
                        <li>
                            {this.state.no_zopim ?
                                <div className="header-navigation-links display-inline cursor-pointer" onClick={() => window.location.href=this.props.headerActions.goBackLink} style={{ width: 'inherit', padding: 10 }}>
                                    <span className="fas fa-arrow-left" style={{fontSize: 14}} />
                                    <label className="cursor-pointer" style={{marginLeft: 5}}>Back</label>
                                </div>
                            :
                                <NavLink className="header-navigation-links display-inline cursor-pointer" to={this.props.headerActions.goBackLink} style={{ width: 'inherit', padding: 10 }}>
                                    <span className="fas fa-arrow-left" style={{fontSize: 14}} />
                                    <label className="cursor-pointer" style={{marginLeft: 5}}>Back</label>
                                </NavLink>
                            }
                        </li>
                        <li>
                            <div className="header-navigation-links display-inline cursor-pointer" style={{ width: 'inherit', backgroundColor: 'inherit', border: 'inherit', padding: 10 }} onClick={() => {
                                var x = confirm("Are you sure you want to clear this page?")
                                if(x){
                                    console.log("Loading design...");
                                    unlayer.loadDesign(JSON.parse(designTemplate.homepages[0].design))
                                }
                            }}>
                                <span className="fas fa-times" style={{fontSize: 14, marginBottom: 2}} />
                                <label className="cursor-pointer" style={{marginLeft: 5}}>Clear</label>
                            </div>
                        </li>
                        {/* 
                        TODO:
                        will be use to save the template 
                        recreate the funnelPageSaveTo.js
                        */}
                        {this.props.headerActions.isPageFullyLoaded && (currentUser.privilege == 10 || localStorage.getItem(points.plg_domain_secret)) ? // User Privilege
                            <li>
                                
                                {/* <SavePageTemplate className="header-navigation-links display-inline cursor-pointer" funnelPageData={this.props.headerActions.page_data} user={currentUser}/> */}
                            </li>
                        : void 0}
                        {/* 
                        TODO:
                        will be use to save the template 
                        recreate the funnelPageSaveTo.js
                        */}
                         <li>
                                <SavePageTemplate className="header-navigation-links display-inline cursor-pointer" funnelPageData={this.props.headerActions.page_data} user={currentUser}/>
                            </li>



                        {this.props.headerActions.isPageFullyLoaded && (currentUser.privilege == 10 || localStorage.getItem(points.plg_domain_secret)) ? // User Privilege
                            <li>
                                <SaveTo className="header-navigation-links display-inline cursor-pointer" funnelPageData={this.props.headerActions.page_data} />
                            </li>
                        : void 0}
                        {this.props.headerActions.isPageFullyLoaded &&
                            <li>
                                <div className="header-navigation-links display-inline cursor-pointer" style={{ width: 'inherit', backgroundColor: 'inherit', border: 'inherit', padding: 10 }} onClick={() => this.props.headerActions.save()}>
                                    <span className="fas fa-save" style={{fontSize: 14, marginBottom: 2}} />
                                    <label className="cursor-pointer" style={{marginLeft: 5}}>Save</label>
                                </div>
                            </li>
                        }
                        {this.props.headerActions.isPageFullyLoaded &&
                            <li>
                                <div className="header-navigation-links display-inline cursor-pointer" style={{ width: 'inherit', backgroundColor: 'inherit', border: 'inherit', padding: 10 }} onClick={() => this.props.headerActions.saveAndPublish()}>
                                    <span className="fas fa-cloud-upload-alt" style={{fontSize: 14, marginBottom: 2}} />
                                    <label className="cursor-pointer" style={{marginLeft: 5}}>Save & Publish</label>
                                </div>
                            </li>
                        }
                        {(() => {
                            if(this.props.headerActions.isPageFullyLoaded){
                                if (this.props.headerActions.splitEdit) return null;
                                else if (currentUser.kartra_tags.includes("Publish_All") || condition.is_exclusive_vip_user(currentUser)) {
                                    return (
                                        <li>
                                            <Popup
                                                trigger={
                                                    <div id="publish_all" className="header-navigation-links display-inline cursor-pointer" style={{ width: 'inherit', backgroundColor: 'inherit', border: 'inherit', padding: 10 }}>
                                                        <span className="fas fa-cloud-upload-alt" style={{fontSize: 14, marginBottom: 2}} />
                                                        <label className="cursor-pointer" style={{marginLeft: 5}}>Publish All</label>
                                                    </div>
                                                }
                                                position="bottom center"
                                                on="click"
                                                contentStyle={{background: '#f4f9fd', border: 'none', maxWidth: 300}} >
                                                    <div>
                                                        <div className="text-center" style={{padding: 5}}>
                                                            <label className="font-questrial-bold">Are you sure?</label>
                                                        </div>
                                                        <ul className="display-inline item-list">
                                                            <li className="text-center cursor-pointer" style={{width: '50%', padding: 7, border: 'none'}} onClick={() => {
                                                                document.getElementById("publish_all").click();
                                                                this.props.headerActions.publishAllPages();
                                                            }}>
                                                                <label style={{fontSize: '1.1em'}}>Yes</label>
                                                            </li>
                                                            <li className="text-center cursor-pointer" style={{width: '50%', padding: 7, border: 'none'}} onClick={() => document.getElementById("publish_all").click()}>
                                                                <label style={{fontSize: '1.1em'}}>No</label>
                                                            </li>
                                                        </ul>
                                                    </div>
                                            </Popup>
                                        </li>
                                    );
                                } else {
                                    return (
                                        <li>
                                            <div id="publish_all" className="header-navigation-links display-inline cursor-pointer" style={{ width: 'inherit', backgroundColor: 'inherit', border: 'inherit', padding: 10 }} onClick={() => {
                                                toastr.options = {
                                                    timeOut: 0,
                                                    extendedTimeOut: 0,
                                                    onclick: () => {
                                                        window.open(points.plgUpsellLink(currentUser.privilege),'_blank');
                                                    }
                                                }
                                                toastr.clear();
                                                toastr.warning("Upgrade to Unlock.","");
                                            }}>
                                                <span className="fas fa-cloud-upload-alt" style={{fontSize: 14, marginBottom: 2}} />
                                                <label className="cursor-pointer" style={{marginLeft: 5}}>Publish All</label>
                                            </div>
                                        </li>
                                    );
                                }
                            } else {
                                return null;
                            }
                        })()}
                        <li>
                            <div className="header-navigation-links display-inline cursor-pointer" style={{ width: 'inherit', backgroundColor: 'inherit', border: 'inherit', padding: 10 }} onClick={() => {
                                var ifr = document.querySelector('#editor iframe');
                                ifr.contentDocument.querySelectorAll('.sc-brqgnP div a')[0].click();
                            }}>
                                <span className="fas fa-undo" style={{fontSize: 14, marginBottom: 2}} />
                                <label className="cursor-pointer" style={{marginLeft: 5}}>Undo</label>
                            </div>
                        </li>
                        <li>
                            <div className="header-navigation-links display-inline cursor-pointer" style={{ width: 'inherit', backgroundColor: 'inherit', border: 'inherit', padding: 10 }} onClick={() => {
                                var ifr = document.querySelector('#editor iframe');
                                ifr.contentDocument.querySelectorAll('.sc-brqgnP div a')[1].click();
                            }}>
                                <span className="fas fa-redo" style={{fontSize: 14, marginBottom: 2}} />
                                <label className="cursor-pointer" style={{marginLeft: 5}}>Redo</label>
                            </div>
                        </li>
                        <li>
                            <div className="header-navigation-links display-inline cursor-pointer" style={{ width: 'inherit', backgroundColor: 'inherit', border: 'inherit', padding: 10 }} onClick={() => this.resizeEditor("desktop")}>
                                <span className="fas fa-desktop" style={{fontSize: 14, marginBottom: 2}} />
                                <label className="cursor-pointer" style={{marginLeft: 5}}>Desktop</label>
                            </div>
                        </li>
                        <li>
                            <div className="header-navigation-links display-inline cursor-pointer" style={{ width: 'inherit', backgroundColor: 'inherit', border: 'inherit', padding: 10 }} onClick={() => this.resizeEditor("tablet")}>
                                <span className="fas fa-tablet-alt" style={{fontSize: 14, marginBottom: 2}} />
                                <label className="cursor-pointer" style={{marginLeft: 5}}>Tablet</label>
                            </div>
                        </li>
                        <li>
                            <div className="header-navigation-links display-inline cursor-pointer" style={{ width: 'inherit', backgroundColor: 'inherit', border: 'inherit', padding: 10 }} onClick={() => this.resizeEditor("mobile")}>
                                <span className="fas fa-mobile-alt" style={{fontSize: 14, marginBottom: 2}} />
                                <label className="cursor-pointer" style={{marginLeft: 5}}>Mobile</label>
                            </div>
                        </li>
                        {this.props.headerActions.pageType == "checkout" &&
                            <li>
                                <div className="header-navigation-links display-inline cursor-pointer" style={{ width: 'inherit', backgroundColor: 'inherit', border: 'inherit', padding: 10 }} onClick={() => this.props.headerActions.enableCheckoutLoaderAction(!this.props.headerActions.enableLoader)}>
                                    {this.props.headerActions.enableLoader &&
                                        <span className="fas fa-times" style={{fontSize: 14, marginBottom: 2}} />
                                    }
                                    {!this.props.headerActions.enableLoader &&
                                        <span className="fas fa-check" style={{fontSize: 14, marginBottom: 2}} />
                                    }
                                    <label className="cursor-pointer" style={{marginLeft: 5}}>Enable Loader</label>
                                </div>
                            </li>
                        }
                        {this.props.headerActions.changeLogData.length != 0 && !this.props.headerActions.splitEdit ?
                            <li className="display-inline" style={{padding: '0 10px'}}>
                                {this.props.headerActions.changeLogData.length != 0 &&
                                    <label style={{marginRight: 5}}>Change Log: </label>
                                }
                                {(() => {
                                    if(this.props.headerActions.changeLogData.length != 0 && this.props.headerActions.changeLogIndex != -1){
                                        var changeLogOptions = [];
                                        this.props.headerActions.changeLogData.map((design, index) => {
                                            changeLogOptions.push(<option value={index} key={index}>{moment(parseInt(design.date)).startOf('second').fromNow()}</option>);
                                        })
                                        return (
                                            <div className="text-left" style={{minWidth: 130}}>
                                                <SelectTag name="changelog" value={this.props.headerActions.changeLogIndex} options={changeLogOptions} onChange={event => this.props.headerActions.changeLogAction(event.target.value)} />
                                            </div>
                                        );
                                    } else {
                                        return null;
                                    }
                                })()}
                            </li>
                        : void 0}
                        <li className="display-inline" style={{padding: '0 10px'}}>
                            <label style={{margin: '0 5px'}}>Funnel Pages: </label>
                            {(() => {
                                if(this.props.headerActions.pageList.length == 0) return null;
                                var pageList = [];
                                this.props.headerActions.pageList.map((page, index) => {
                                    pageList.push(<option value={page.id} key={index}>{points.capitalizeWord(page.path ? page.path.replace(/-|_/g," ") : "Homepage")}</option>);
                                })
                                return (
                                    <div className="text-left" style={{ minWidth: 150 }}>
                                        <SelectTag name="pageList" value={this.props.headerActions.pageSelected} options={pageList} onChange={event => this.props.headerActions.changeSelectedPage(event.target.value)} />
                                    </div>
                                );
                            })()}
                        </li>
                        <li className="display-inline" style={{padding: '0 10px'}}>
                            {(() => {
                                var actionList = [
                                    <option value="" key={0}>Modal Action</option>,
                                    <option value="onload" key={1}>Load Intent</option>,
                                    <option value="onexit" key={2}>Exit Intent</option>
                                ];
                                return <SelectTag name="modalAction" value={this.props.headerActions.actionSelected} options={actionList} onChange={event => {
                                    var ifr = document.querySelector('#editor iframe');
                                    var plg_modal = ifr.contentDocument.querySelector(".plg_modal");
                                    if(plg_modal){
                                        this.props.headerActions.changeSelectedAction(event.target.value);
                                    } else {
                                        alert("Popup modal unavailable")
                                    }
                                }} style={{ minWidth: 150 }} />
                            })()}
                        </li>
                    </ul>
                </div>
            );
        } else {
            return null;
        }
    }
}


export default withSession(Header);