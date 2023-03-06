import React from 'react';
import withAuth from '../hoc/withAuth';
import { Helmet } from 'react-helmet';
import toastr from 'toastr';
import Popup from 'reactjs-popup';
import Modal from '../components/ModalComponent/';
import CKEditor from 'react-ckeditor-wrapper';
const points = require('../../Global_Values');

var initialize = {
    thumbnails: [],
    campaignName: '',
    dailyBudget: 3,
    file: '',
    isCreating: false,

    // ids
    selectedAdAccountId: null,
    selectedAdAccountName: null,
    selectedPageId: null,
    selectedPageName: null,
    selectedpageData: [],
    selectedAdAccountPixelId: null,
    campaignId: null,
    adsetId: null,
    videoId: null,
    adCreativeId: null,
    adsId: null,
    isUploadingAds: false,
    searchedInterest: [],
    currentInterestIndex: 0,
    locales: null
}

class AdminCreateAds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            ...initialize,
            pixelCode: null,
            refreshPreview: null,
            adText: 'This is test ad text',
            adWebsiteURL: 'https://jeromenewstore.myshopify.com/products/tactical-xml-t6-led-headlamp-1',
            adDisplayLink: 'jeromenewstore.myshopify.com',
            adHeadline: 'This is headline',
            adLinkDescription: 'Gusto mo to',
            interest: [],
            demogAge: ["24", "60"],
            demogGender: [0],
            adVideoURL: "",
            useURL: false,
            useThumbnailLink: false,

            // to open modals
            createAds: false,
            getPixelCode: false
        }

        this.loginFB = this.loginFB.bind(this);
        this.toggleCreateAds = this.toggleCreateAds.bind(this)
        this.togglePixel = this.togglePixel.bind(this)
    }

    componentDidMount() {
        toastr.options = {
            "progressBar": true,
            "closeButton": false,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut": 3000,
            "extendedTimeOut": 2000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        var self = this;
        setTimeout(function () {
            self.loginFB();
        }, 1000);

        // initialize the data for creating ads
        var paramState = this.props.history.location.state;
        if(paramState){
            var adText = paramState.metafieldsData["7_Ad_Copy_Text"];
            var demogAge = paramState.metafieldsData["3_Demographics_Age"];
            var demogGender = paramState.metafieldsData["4_Demographics_Gender"];
            var interest = paramState.metafieldsData["5_Interests"];
            var headline = paramState.metafieldsData["7_Ad_Copy_Text"];
            var linkDescription = paramState.metafieldsData["7_Ad_Copy_Text"];
            var adVideoURL = paramState.metafieldsData["H_New_Video"];
            var removeAllHTMLTagRegexp = new RegExp(/<[^>]*>/g);
            var obj = {
                adText: 'This is test ad text',
                adWebsiteURL: 'https://jeromenewstore.myshopify.com/products/tactical-xml-t6-led-headlamp-1',
                adDisplayLink: 'jeromenewstore.myshopify.com',
                adHeadline: 'This is headline',
                adLinkDescription: 'Gusto mo to',

                // remove "DEV "+ in production
                campaignName: "DEV "+paramState.productName,
                adVideoURL: "",
                useURL: false,
                demogAge: ["24", "60"],
                demogGender: [0],
                interest: [],
                useThumbnailLink: true
            };

            obj.adWebsiteURL = paramState.productURL;
            obj.adDisplayLink = paramState.productURL.match(/\/\w.*com/).toString().replace("/","");
            obj.paramThumbnail = "https:"+paramState.thumbnail.replace("https:", "");

            if(adText){
                obj.adText = adText.substring(0, adText.indexOf("<br><br>\n---")).replace(/replace_url/g, obj.adWebsiteURL);
            }
            if(demogAge){
                obj.demogAge = demogAge.replace(/\s|\+/g, "").replace("-",",").split(",")
            }
            if(demogGender){
                demogGender = demogGender.toLowerCase();
                if(demogGender == "all"){
                    obj.demogGender = [0]
                } else if(demogGender == "male"){
                    obj.demogGender = [1]
                } else {
                    obj.demogGender = [2]
                }
            }
            if(interest){
                var boolArr = [];
                interest.replace(/<br>|\./g,"").split(",").map((dd,i) => {
                    if(i == 0){
                        boolArr.push({
                            isSelected: true,
                            name: dd
                        })
                    } else {
                        boolArr.push({
                            isSelected: false,
                            name: dd
                        })
                    }
                    return dd.trim();
                })
                obj.interest = boolArr;
            }
            if(headline){
                var tempHeadline = headline.substring(headline.toLowerCase().indexOf("headline:"))
                obj.adHeadline = tempHeadline.substring(0, tempHeadline.indexOf("<br>")).replace(/Headline:|headline:/,"").trim().replace(removeAllHTMLTagRegexp,"");
            }
            if(linkDescription){
                var tempDescription = linkDescription.substring(linkDescription.toLowerCase().indexOf("news feed link description:")+28)
                obj.adLinkDescription = tempDescription.replace(removeAllHTMLTagRegexp, "");
            }
            if(adVideoURL){
                obj.adVideoURL = adVideoURL.match(/\/d\/.*\//g).toString().replace(/\/d|\//g,"");
                obj.useURL = true;
            }

            this.setState({
                ...obj
            })
        }
    }

    head() {
        return (
            <Helmet>
                <title>Create Ads - Product List Genie</title>
            </Helmet>
        );
    }

    loginFB() {
        var self = this;
        FB.login(function (response) {
            if (response.authResponse) {
                FB.api('/me?fields=id,name,email,link,adaccounts{name,adspixels},accounts', function (user) {
                    toastr.clear();
                    toastr.success("Thank you for trusting Product List Genie <strong>" + user.name + ".</strong>", "Login Success!");
                    self.setState({
                        userData: user
                    });
                });
            } else {
                toastr.clear();
                toastr.error("You cannot use this function without loging in to facebook.", "Login Failed!");
            }
        }, {
            scope: "email,user_link,manage_pages,pages_show_list,ads_management,ads_read,business_management,user_videos"
        });
    }
    
    toggleCreateAds(id, name, pixelid){
        this.setState({
            selectedAdAccountId: id,
            selectedAdAccountName: name,
            selectedAdAccountPixelId: pixelid,
            createAds: !this.state.createAds,
        }, () => {
            this.refreshPreview();
        })
    }

    togglePixel(pixelId){
        var pixelCode = `
            <!-- Facebook Pixel Code -->
            <script>
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', '${pixelId}');
            fbq('track', "PageView");</script>
            <noscript><img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=248317536097607&ev=PageView&noscript=1"
            /></noscript>
            <!-- End Facebook Pixel Code -->
        `;
        this.setState({
            pixelCode: pixelCode,
            getPixelCode: !this.state.getPixelCode
        })
    }

    selectAdPage(element, adPageId, adPageName){
        document.querySelectorAll(".selected").forEach(el => {
            el.classList.remove("selected");
        });
        element.classList.add("selected")
        this.setState({
            selectedPageId: adPageId,
            selectedPageName: adPageName
        }, () => {
            this.getPageProfilePicture();
        })
    }

    handleAdTextChange(value){
        this.setState({
            adText: value
        })
    }

    handleChange(event){
        var name = event.target.name;
        var value = event.target.value;
        
        this.setState({
            [name]: value
        })
    }

    handleCheckboxChange(event, index){
        var boolArr = this.state.interest;
        boolArr[index].isSelected = event.target.checked
        this.setState({
            interest: boolArr
        });
    }

    createCampaign() {
        document.getElementById("submit").click();
        toastr.options.timeOut = 3000;
        toastr.options.extendedTimeOut = 2000;
        if(!this.state.selectedPageId){
            toastr.clear();
            toastr.warning("Please Select Ad Page.","Required!");
        } else if(!this.state.campaignName){
            toastr.clear();
            toastr.warning("Campaign Name Cannot be empty.","Required!");
        } else if(this.state.dailyBudget == 0){
            toastr.clear();
            toastr.warning("Daily Budget Cannot set as 0.","Required!");
        } else if((!this.state.useURL && !document.getElementById("file").value) || (this.state.useURL && !this.state.adVideoURL)){
            toastr.clear();
            toastr.warning("Ad Video or URL is missing.","Required!");
        } else if((!this.state.useThumbnailLink && !document.getElementById("imagefile").value) || !this.state.paramThumbnail){
            toastr.clear();
            toastr.warning("Image Thumbnail or Link Cannot be empty.","Required!");
        } else {
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.clear();
            toastr.info("Creating Campaign.","Please Wait!");

            var self = this;
            if(self.state.campaignId){
                console.log("campaign is already created continue...");
                self.createAdSet();
            } else {
                FB.api(`${self.state.selectedAdAccountId}/campaigns`, "POST", {
                    "name": self.state.campaignName,
                    "objective": "CONVERSIONS",
                    "status": "PAUSED"
                }, response => {
                    if (response && !response.error) {
                        console.log('campaign '+self.state.campaignName+' created successfuly');
                        self.setState({
                            campaignId: response.id
                        }, () => {
                            self.createAdSet();
                        });
                    }
                });
            }
        }
    }

    getCurrentIncludedInterest(){
        var interest = this.state.searchedInterest;
        var interestIndex = this.state.currentInterestIndex;
        var isSelected = false;
        var selected = [];
        
        for(var x = interestIndex; x < interest.length; x++){
            if(!isSelected){
                selected.push(interest[x]);
                isSelected = true;
                interestIndex = x;
            }
        }
        
        return {
            selected,
            nextIndex: interestIndex + 1
        };
    }

    searchInterest(interest){
        return new Promise(resolve => {
            FB.api("/search", {
                "type": "adinterest",
                "q": interest
            }, result => {
                var data = [];
                if(result.data){
                    data = result.data[0];
                }
                resolve(data);
            });
        })
    }

    async asyncArrayRequest(array, callback) {
        var res = [];
        for (let index = 0; index < array.length; index++) {
            if(array[index].isSelected){
                var result = await this.searchInterest(array[index].name);
                res.push({
                    "id": result.id,
                    "name": result.name
                })
            }
        }
        callback(await res)
    }

    async createAdSet(){
        var self = this;
        if(this.state.currentInterestIndex != 0){
            createAdsetNow();
        } else {
            this.asyncArrayRequest(this.state.interest, result => {
                this.setState({
                    searchedInterest: result
                }, () => {
                    FB.api("/search", {
                        "type": "adlocale",
                        "q": "English (All)"
                    }, result => {
                        var locales = [];
                        if(result.data){
                            locales.push(result.data[0].key)
                        }
                        this.setState({
                            locales: locales
                        }, () => {
                            createAdsetNow();
                        })
                    });
                })
            });
        }

        function createAdsetNow(){
            var selectedInterest = self.getCurrentIncludedInterest().selected;
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.clear();
            toastr.info("Creating Adset:"+self.state.campaignName+" WC - "+selectedInterest[0].name,"Please Wait!");
            FB.api(`${self.state.selectedAdAccountId}/adsets`, "POST", {
                "name": self.state.campaignName+" WC - "+selectedInterest[0].name,
                "optimization_goal": "OFFSITE_CONVERSIONS",
                "billing_event": "IMPRESSIONS",
                "bid_strategy": "LOWEST_COST_WITHOUT_CAP",
                "daily_budget": parseInt(self.state.dailyBudget + "00"),
                "campaign_id": self.state.campaignId,
                "targeting": {
                    "device_platforms": ["mobile"],
                    "geo_locations": { "countries": ["US"] },
                    "publisher_platforms": ["facebook"],
                    "facebook_positions": ["feed"],
                    "genders": self.state.demogGender ? self.state.demogGender : [0], // 0 all, 1 men, 2 female
                    "age_min": self.state.demogAge ? self.state.demogAge[0] : "25",
                    "age_max": self.state.demogAge ? self.state.demogAge[1] : "55",
                    "interests": selectedInterest,
                    "locales": self.state.locales
                },
                "promoted_object": {
                    "pixel_id": self.state.selectedAdAccountPixelId,
                    "custom_event_type": "PURCHASE"
                },
                "status": "PAUSED"
            }, response => {
                if (response && !response.error) {
                    console.log('adset '+self.state.campaignName+" WC - "+self.state.searchedInterest[self.state.currentInterestIndex].name+' created successfuly');
                    self.setState({
                        adsetId: response.id
                    }, () => {
                        self.adVideos();
                    });
                } else {
                    toastr.clear();
                    toastr.warning(response.error.error_user_msg ? response.error.error_user_msg : response.error.message,"An error has occurred");
                }
            });
        }
    }

    getDataUri(callback) {
        var image = new Image();
        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
    
            canvas.getContext('2d').drawImage(this, 0, 0);
            
            // ... or get as Data URI
            callback(canvas.toDataURL('image/png').replace(/data:.+;base64,/,""));
        };
        image.src = URL.createObjectURL(document.getElementById("imagefile").files[0]);
    }

    adVideos(){
        var self = this;
        if(!self.state.useThumbnailLink){
            self.getDataUri(base64 => {
                FB.api(self.state.selectedAdAccountId + "/adimages", "POST", {
                    "bytes": base64
                }, result => {
                    self.setState({
                        paramThumbnail: result.images.bytes.url
                    })
                });
            });
        }
        if(self.state.adsId){
            self.copyAds();
        } else {
            toastr.clear();
            toastr.info("Uploading Video.","Please Wait!");
    
            if(self.state.useURL){
                // use this if we have ad video url already from product page
                FB.api(self.state.selectedAdAccountId + "/advideos", "POST", {
                    "file_url": "https://drive.google.com/uc?export=download&id="+self.state.adVideoURL
                }, response => {
                    if (response && !response.error) {
                        console.log('video uploaded successfully (via google drive video url)');
                        self.setState({
                            videoId: response.id
                        }, () => {
                            self.checkIfVideoIsDone();
                        });
                    } else {
                        if(response.error.code == 613){
                            toastr.clear();
                            toastr.warning(response.error.error_user_msg ? response.error.error_user_msg : response.error.message,"An error has occurred")
                        } else {
                            toastr.clear();
                            toastr.warning("Retrying please wait...","Upload Failed!");
                            self.adVideos();
                        }
                    }
                });
            } else {
                // use this if user manually upload video via input file type
                FB.api(self.state.selectedAdAccountId + '/advideos', "POST", {
                    "upload_phase": "start",
                    "file_size": document.getElementById("file").files[0].size
                }, response => {
                    if (response && !response.error) {
                        console.log('video phase start');
                        self.setState({
                            videoId: response.video_id
                        }, () => {
                            self.transfer(response)
                        });
                    } else {
                        if(response.error.code == 613){
                            toastr.clear();
                            toastr.warning(response.error.error_user_msg ? response.error.error_user_msg : response.error.message,"An error has occurred")
                        } else {
                            toastr.clear();
                            toastr.warning("Retrying please wait...","An error has occurred");
                            self.adVideos();
                        }
                    }
                });
            }
        }
    }

    transfer(data, sessionid){
        var file = document.getElementById("file").files[0];
        var fr = new FileReader(), buf;
        var self = this;
        fr.onload = async function (e) {
            buf = new Uint8Array(e.target.result);

            const formData = new FormData();
            formData.append("upload_phase", "transfer");
            data.start_offset ? formData.append("start_offset", data.start_offset) : void 0;
            formData.append("upload_session_id", data.upload_session_id ? data.upload_session_id : sessionid);
            formData.append('video_file_chunk', new Blob([buf.subarray(data.start_offset, data.start_offset + file.size)]));

            let responses = await fetch(`https://graph-video.facebook.com/v3.2/${self.state.selectedAdAccountId}/advideos?access_token=` + FB.getAuthResponse().accessToken, {
                body: formData,
                method: 'post'
            });
            responses = await responses.json();
            if (responses && !responses.error) {
                if (responses.start_offset == responses.end_offset) {
                    console.log("phase finish")
                    FB.api(self.state.selectedAdAccountId + '/advideos', "POST", {
                        "upload_phase": "finish",
                        "upload_session_id": data.upload_session_id ? data.upload_session_id : sessionid
                    }, finish => {
                        console.log("finish upload")
                        toastr.clear();
                        toastr.info("Waiting for video operation to complete.","Please Wait!");
                        self.checkIfVideoIsDone();
                    });
                } else {
                    console.log("not done yet")
                    self.transfer(responses, data.upload_session_id)
                }
            } else {
                if(responses.error.code == 613){
                    toastr.clear();
                    toastr.warning(responses.error.error_user_msg ? responses.error.error_user_msg : responses.error.message,"An error has occurred")
                } else {
                    toastr.clear();
                    toastr.warning("Retrying please wait...","An error has occurred");
                    self.transfer(responses, data.upload_session_id)
                }
            }
        };
        fr.readAsArrayBuffer(file);
    }

    checkIfVideoIsDone(){
        var self = this;
        self.checkVideoThumbnail(res => {
            if (res && !res.error) {
                if(res.data.length != 0){
                    self.createAdCreative();
                } else {
                    toastr.clear();
                    toastr.info("Video is still in process.","Please wait");
                    setTimeout(function() {
                        self.checkIfVideoIsDone();
                    }.bind(self), 5000);
                }
            } else {
                toastr.clear();
                toastr.warning("Retrying please wait...","An error has occurred");
                self.checkIfVideoIsDone();
            }
        });
    }

    checkVideoThumbnail(cb){
        FB.api(`${this.state.videoId}/thumbnails`, response => {
            cb(response);
        });
    }

    copyAds(){
        var self = this;
        var selectedInterest = self.getCurrentIncludedInterest();

        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.clear();
        toastr.info("Copying ads to "+self.state.campaignName+" WC - "+selectedInterest.selected[0].name,"Please wait...");
        
        FB.api(`/${self.state.adsId}/copies`, "POST", {
            "adset_id": self.state.adsetId
        }, response => {
            self.setState({
                currentInterestIndex: selectedInterest.nextIndex
            }, () => {
                // duplicate ads from the current adset 2x
                self.duplicateAdsFromCurrentAdset(() => {
                    if (response && !response.error) {
                        // validate if need to create again
                        var nextInterest = self.getCurrentIncludedInterest();
                        if(nextInterest.selected.length != 0){
                            self.createAdSet();
                        } else {
                            toastr.options.timeOut = 3000;
                            toastr.options.extendedTimeOut = 2000;
                            toastr.clear();
                            toastr.success("Campaign, Adsets, Ads Successfully Created.","Success!")
                            self.resetModalData();
                        }
                    } else {
                        toastr.clear();
                        toastr.warning(response.error.error_user_msg ? response.error.error_user_msg : response.error.message,"An error has occurred")
                    }
                })
            })
        })
    }

    createAdCreative(){
        toastr.clear();
        toastr.info("Creating Ad Creative.","Please Wait")

        var self = this;
        if(!self.state.isUploadingAds){
            self.setState({
                isUploadingAds: true
            }, () => {
                FB.api(`${self.state.selectedAdAccountId}/adcreatives`, "POST", {
                    "name": self.state.campaignName+" WC -"+self.state.searchedInterest[self.state.currentInterestIndex].name,
                    "object_story_spec": {
                        "page_id": self.state.selectedPageId,
                        "video_data": {
                            "call_to_action": {
                                "type": "SHOP_NOW",
                                "value": {
                                    "link": self.state.adWebsiteURL,
                                    "link_caption": self.state.adDisplayLink
                                }
                            },
                            "image_url": self.state.paramThumbnail,
                            "video_id": self.state.videoId,
                            "title": self.state.adHeadline,
                            "message": self.state.adText.replace(/<[^>]*>|&nbsp;/g, ""),
                            "link_description": self.state.adLinkDescription
                        }
                    },
                }, response => {
                    if (response && !response.error) {
                        console.log('ad creative success');
                        self.setState({
                            adCreativeId: response.id
                        }, () => {
                            self.createAds();
                        })
                    } else {
                        console.log('ad creative failed');
                        toastr.clear();
                        toastr.warning(response.error.error_user_msg ? response.error.error_user_msg : response.error.message,"An error has occurred")
                    }
                });
            })
        }
    }

    createAds(){
        toastr.clear();
        toastr.info("Creating Ads.","Please Wait")

        var self = this;
        FB.api(`${self.state.selectedAdAccountId}/ads`, "POST", {
            "name": self.state.campaignName+" WC",
            "adset_id": self.state.adsetId,
            "creative": {
                "creative_id": self.state.adCreativeId
            },
            "tracking_specs": [
                {
                    "action.type": ["offsite_conversion"],
                    "fb_pixel": [self.state.selectedAdAccountPixelId]
                }
            ],
            "status": "PAUSED"
        }, response => {
            if (response && !response.error) {
                toastr.options.timeOut = 3000;
                toastr.options.extendedTimeOut = 2000;
                toastr.clear();
                toastr.success("Ads Successfulyl Created.","Success!")

                self.setState({
                    currentInterestIndex: self.getCurrentIncludedInterest().nextIndex,
                    adsId: response.id
                }, () => {
                    // duplicate ads from the current adset 2x
                    self.duplicateAdsFromCurrentAdset(() => {
                        // validate if need to create again
                        var nextInterest = self.getCurrentIncludedInterest();
                        if(nextInterest.selected.length != 0){
                            self.createAdSet();
                        } else {
                            toastr.clear();
                            toastr.options.timeOut = 3000;
                            toastr.options.extendedTimeOut = 2000;
                            toastr.success("Campaign, Adsets, Ads Successfully Created.","Success!")
                            self.resetModalData();
                        }
                    })
                })
            } else {
                toastr.clear();
                toastr.warning(response.error.error_user_msg ? response.error.error_user_msg : response.error.message,"An error has occurred")
                self.resetModalData();
            }
        });
    }

    async duplicateAdsFromCurrentAdset(callback){
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        var isDone = false;
        for (let i = 1; i <= 2; i++) {
            toastr.clear();
            toastr.info("Duplicating Ads "+i+"/"+2+".","Please wait!")
            await this.execDuplicate();
            isDone = true;
        }
        callback(await isDone)
    }

    execDuplicate(){
        var self = this;
        return new Promise(resolve => {
            self.getEffective_object_story_id(creative => {
                FB.api(`/${self.state.adsId}/copies`, "POST", {
                    "adset_id": self.state.adsetId,
                    "creative": {
                        "creative_id": self.state.adCreativeId,
                        "effective_object_story_id": creative.effective_object_story_id
                    },
                }, res => {
                    resolve(res);
                })
            })
        })
    }

    getEffective_object_story_id(callback){
        FB.api(this.state.adsId, {
            fields: "creative{effective_object_story_id}"
        }, res => {
            callback(res);
        })
    }

    resetModalData(){
        // reset modal
        document.querySelectorAll(".selected").forEach(el => {
            el.classList.remove("selected");
        });
        this.setState({
            ...initialize
        })
        this.toggleCreateAds();
    }

    toggleImageThumbnail(bool){
        this.setState({
            useThumbnailLink: bool
        }, () => {
            this.refreshPreview();
        })
    }
    
    toggleUseURL(useURL){
        this.setState({
            useURL: useURL
        }, () => {
            this.refreshPreview();
        })
    }

    refreshPreview(){
        if(document.getElementById("file")){
            var tempURL = document.getElementById("file").files[0];
            this.setState({
                refreshPreview: null
            }, () => {
                if(tempURL){
                    tempURL = URL.createObjectURL(tempURL)
                    this.setState({
                        refreshPreview: (
                            <video width="100%" height="auto" controls autoPlay="true">
                                <source src={tempURL} type="video/mp4" />
                                Your browser does not support HTML5 video.
                            </video>
                        )
                    })
                } else {
                    if(this.state.useURL){
                        this.setState({
                            refreshPreview: (
                                <video width="100%" height="auto" controls autoPlay="true">
                                    <source src={"https://drive.google.com/uc?export=download&id="+this.state.adVideoURL} type="video/mp4" />
                                    Your browser does not support HTML5 video.
                                </video>
                            )
                        })
                    } else {
                        if(!this.state.useThumbnailLink && document.getElementById("imagefile").value){
                            this.setState({
                                refreshPreview: <img src={URL.createObjectURL(document.getElementById("imagefile").files[0])} className="stretch-width" />
                            })
                        } else {
                            var style = {
                                height: 180,
                                fontSize: 25,
                                fontWeight: 900,
                                color: '#fff',
                                backgroundColor: '#000',
                                position: 'relative'
                            }
                            if(this.state.paramThumbnail){
                                this.setState({
                                    refreshPreview: <img src={this.state.paramThumbnail} className="stretch-width" />
                                })
                            } else {
                                this.setState({
                                    refreshPreview: (
                                        <div className="stretch-width ellipsis" style={style}>
                                            <span className="center-vertical" style={{whiteSpace: 'nowrap'}}>Select Video Ad</span>
                                        </div>
                                    )
                                })
                            }
                        }
                    }
                }
            })
        }
    }

    getPageProfilePicture(callback) {
        var self = this;
        FB.api(this.state.selectedPageId + "/picture", { "redirect": "0" }, response => {
            self.setState({
                selectedpageData: response
            })
        });
    }

    render() {
        return (
            <div className="admin page-container">
                {this.head()}
                <div className="text-center">
                    <h2>Create Ads</h2>
                </div>
                <h3>List of Ad Account</h3>
                {(() => {
                    if (this.state.userData) {
                        var adAccountList = this.state.userData.adaccounts.data;
                        if (adAccountList.length == 0) {
                            return (
                                <div className="text-center">
                                    <h3>No Ad Account Found.</h3>
                                </div>
                            )
                        }
                        if (adAccountList.length != 0) {
                            return (
                                <div className="table-container">
                                    <table className="table-list">
                                        <thead>
                                            <tr>
                                                <th className="text-center">#</th>
                                                <th>ID</th>
                                                <th>Ad Account Name</th>
                                                <th className="text-center">Facebook Pixel</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {adAccountList.map((adAccount, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td className="text-center">{i+1}</td>
                                                    <td>{adAccount.id.replace("act_", "")}</td>
                                                    <td>{adAccount.name}</td>
                                                    <td className="text-center">
                                                        {(() => {
                                                            if(adAccount.adspixels){
                                                                return (
                                                                    <button style={{cursor: 'pointer'}} onClick={() => this.togglePixel(adAccount.adspixels.data[0].id)}>
                                                                        <span className="fas fa-code"></span> Pixel Code
                                                                    </button>
                                                                );
                                                            } else {
                                                                return <a href={"https://www.facebook.com/ads/manager/pixel/facebook_pixel/?"+adAccount.id.replace("_","=")} target="_blank">Create FB Pixel</a>;
                                                            }
                                                        })()}
                                                    </td>
                                                    <td className="text-center">
                                                    {(() => {
                                                        if(adAccount.adspixels){
                                                            return (
                                                                <button style={{cursor: 'pointer'}} onClick={() => this.toggleCreateAds(adAccount.id, adAccount.name, adAccount.adspixels.data[0].id)}>
                                                                    <span className="fab fa-facebook" style={{color: '#4061a6'}}></span> Create Ads
                                                                </button>
                                                            );
                                                        } else {
                                                            return <span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>No Action.</span>
                                                        }
                                                    })()}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        }
                    }
                    return null;
                })()}

                {/* Modals */}
                {this.state.createAds &&
                    <Modal open={this.state.createAds} closeModal={this.toggleCreateAds}>
                        <div className="page-container">
                            <div className="text-center">
                                <h1>Create Ads for {this.state.selectedAdAccountName}</h1>
                            </div>
                            <div className="form_wrap">
                                <div className="form_row">
                                    <div className="grid">
                                        <div className="column column_12_12 margBottom">
                                            <div className="form_item">
                                                <div className="form_input">
                                                    <label>Select Ad Page</label> <br/>
                                                    {this.state.userData.accounts.data.map((account,i) => {
                                                        return (
                                                            <div className="column column_2_12" key={i} >
                                                                <div className="product-card">
                                                                    <div className="product-details ellipsis" style={{padding: 10, cursor: 'pointer'}} onClick={event => this.selectAdPage(event.target.parentNode, account.id, account.name)} >
                                                                        <span className="clickable" style={{whiteSpace: 'nowrap'}} title={account.name}>{account.name}</span><br/>
                                                                        <span style={{fontSize: 10, whiteSpace: 'nowrap'}}>Category: {account.category}</span><br/>
                                                                        <span style={{fontSize: 10, whiteSpace: 'nowrap'}}>ID: {account.id}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column column_12_12 margBottom clear">
                                            <div className="column column_3_12 margBottom">
                                                <div className="form_item">
                                                    <div className="form_input">
                                                        <label>Campaign Name</label>
                                                        <input type="text" name="campaignName" value={this.state.campaignName} onChange={this.handleChange.bind(this)}/>
                                                        <span className="bottom_border"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_2_12 margBottom">
                                                <div className="form_item">
                                                    <div className="form_input">
                                                        <label>Daily Budget ($)</label>
                                                        <input type="number" name="dailyBudget" value={this.state.dailyBudget} onChange={this.handleChange.bind(this)}/>
                                                        <span className="bottom_border"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_4_12 margBottom">
                                                <div className="form_item">
                                                    <div className="form_input">
                                                        <label>Ad Product URL</label>
                                                        <input type="text" name="adWebsiteURL" value={this.state.adWebsiteURL} onChange={this.handleChange.bind(this)} />
                                                        <span className="bottom_border"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_3_12 margBottom">
                                                <div className="form_item">
                                                    <div className="form_input">
                                                        <label>Ad Display Link</label>
                                                        <input type="text" name="adDisplayLink" value={this.state.adDisplayLink} onChange={this.handleChange.bind(this)} />
                                                        <span className="bottom_border"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column column_8_12 margBottom">
                                            <div className="column column_6_12 margBottom">
                                                <div className="form_item">
                                                    <div className="form_input">
                                                        <label>Ad Headline</label>
                                                        <input type="text" name="adHeadline" value={this.state.adHeadline} onChange={this.handleChange.bind(this)} />
                                                        <span className="bottom_border"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_6_12 margBottom">
                                                <div className="form_item">
                                                    <div className="form_input">
                                                        <label>Ad Link Description</label>
                                                        <input type="text" name="adLinkDescription" value={this.state.adLinkDescription} onChange={this.handleChange.bind(this)} />
                                                        <span className="bottom_border"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_6_12 margBottom">
                                                <div className="form_item">
                                                    <div className="form_input">
                                                        <button className={!this.state.useURL ? "dwobtn dwobtn-focus stretch-width" : "dwobtn stretch-width"} style={{margin: '0 0 10px 0'}} onClick={() => this.toggleUseURL(false)}>Upload Video</button>
                                                        <div style={this.state.useURL ? {filter: 'blur(2px)'} : void 0}>
                                                            <label>Select Ad Video</label>
                                                            <input type="file" id="file" accept="video/mp4,video/x-m4v,video/*" onChange={() => this.refreshPreview()} disabled={this.state.useURL} />
                                                            <span className="bottom_border"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_6_12 margBottom">
                                                <div className="form_item">
                                                    <div className="form_input">
                                                        <button className={this.state.useURL ? "dwobtn dwobtn-focus stretch-width" : "dwobtn stretch-width"} style={{margin: '0 0 10px 0'}} onClick={() => this.toggleUseURL(true)}>Video URL</button>
                                                        <div style={!this.state.useURL ? {filter: 'blur(2px)'} : void 0}>
                                                            <label>Google Drive URL</label>
                                                            <input type="text" name="adVideoURL" value={this.state.adVideoURL ? "https://drive.google.com/uc?export=download&id="+this.state.adVideoURL : ""}  onChange={() => this.refreshPreview()} disabled={!this.state.useURL} />
                                                            <span className="bottom_border"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_6_12 margBottom clear">
                                                <div className="form_item">
                                                    <div className="form_input">
                                                        <button className={!this.state.useThumbnailLink ? "dwobtn dwobtn-focus stretch-width" : "dwobtn stretch-width"} style={{margin: '0 0 10px 0'}} onClick={() => this.toggleImageThumbnail(false)}>Upload Image</button>
                                                        <div style={this.state.useThumbnailLink ? {filter: 'blur(2px)'} : void 0}>
                                                            <label>Upload Image thumbnail</label>
                                                            <input type="file" id="imagefile" accept="image/x-png,image/gif,image/jpeg" disabled={!this.state.useThumbnailLink} />
                                                            <span className="bottom_border"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_6_12 margBottom">
                                                <div className="form_item">
                                                    <div className="form_input">
                                                        <button className={this.state.useThumbnailLink ? "dwobtn dwobtn-focus stretch-width" : "dwobtn stretch-width"} style={{margin: '0 0 10px 0'}} onClick={() => this.toggleImageThumbnail(true)}>Image URL</button>
                                                        <div style={!this.state.useThumbnailLink ? {filter: 'blur(2px)'} : void 0}>
                                                            <label>Image Thumbnail Link</label>
                                                            <input type="text" name="paramThumbnail" value={this.state.paramThumbnail} onChange={this.handleChange.bind(this)} disabled={this.state.useThumbnailLink} />
                                                            <span className="bottom_border"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_5_12 margBottom clear">
                                                <div className="form_item">
                                                    <div className="form_input form_buttons">
                                                        <label>Interest </label><span style={{fontSize: 13}}>(click to include/exclude)</span><br/>
                                                        {(() => {
                                                            return this.state.interest.map((interest,i) => {
                                                                return (
                                                                    <div className="column column_6_12" key={i}>
                                                                        <div className="product-card">
                                                                            <div className="product-details ellipsis" style={{padding: 10}}>
                                                                                <label htmlFor={i} style={{whiteSpace: 'nowrap', fontSize: 13}} className="clickable" title={interest.name}>
                                                                                    {interest.isSelected ? <i className="fas fa-check"></i> : <i className="fas fa-times" style={{color: 'red'}}></i>} {interest.name}
                                                                                </label>
                                                                                <input type="checkbox" id={i} style={{display: 'none'}} onChange={event => this.handleCheckboxChange(event, i)} checked={interest.isSelected} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_7_12 margBottom">
                                                <div className="form_item">
                                                    <div className="form_input">
                                                        <label>Ad text</label>
                                                        <CKEditor
                                                            value={this.state.adText}
                                                            onChange={this.handleAdTextChange.bind(this)}
                                                            config={{ extraAllowedContent: 'div(*); p(*); strong(*);', toolbarGroups: [ { name: 'document',	groups: [ 'mode', 'document' ] }, { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] }] }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column column_12_12 margBottom">
                                                <div className="form_item">
                                                    <div className="form_input form_buttons">
                                                        <label>&nbsp;</label><br/>
                                                        <Popup
                                                            trigger={<button className="btn stretch-width" id="submit" disabled={this.state.isCreating}>Submit</button>}
                                                            position="top center"
                                                            on="click" className="points-tooltip">
                                                            <div style={{padding: '5px 20px', position: 'relative'}}>
                                                                <div className="text-center">
                                                                    {(() => {
                                                                        var totalAds = 0;
                                                                        this.state.interest.map(interest => {
                                                                            if(interest.isSelected){
                                                                                totalAds += 1;
                                                                            }
                                                                        });
                                                                        var totalSpent = totalAds * parseInt(this.state.dailyBudget);
                                                                        return <p> This will create {totalAds} ads for a total of ${points.commafy(totalSpent)}.00 daily spent </p>;
                                                                    })()}
                                                                    <h3>Continue?</h3>
                                                                    <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20}} onClick={() => this.createCampaign()}>
                                                                        <i className="fas fa-check"></i>
                                                                    </button>
                                                                    &nbsp; | &nbsp;
                                                                    <button className="pbbtn" style={{padding: '5px 0', margin: 0, background: 'transparent', fontSize: 20, color: 'red'}} onClick={event => document.getElementById("submit").click()}>
                                                                        <i className="fas fa-times"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </Popup>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column column_4_12 margBottom">
                                            <div className="text-center">
                                                <h3>Ad Preview</h3>
                                            </div>
                                            <div className="smartphone">
                                                <div className="content">
                                                    {(() => {
                                                        if(this.state.selectedpageData.length != 0){
                                                            var result = this.state.selectedpageData;
                                                            return (
                                                                <div className="ads-preview">
                                                                    <div className="column column_12_12" style={{marginTop: 10}}>
                                                                        <div className="float-left">
                                                                            <img className="" src={result.data.url} height="40px" width="40px" style={{borderRadius: '50%'}} />
                                                                        </div>
                                                                        <div className="float-left ellipsis" style={{marginTop: 1.5, marginLeft: 10, maxWidth: 220}}>
                                                                            <span style={{fontSize: 15, fontWeight: 900, whiteSpace: 'nowrap'}}>{this.state.selectedPageName}</span> <br/>
                                                                            <span style={{fontSize: 12, color: '#9da2a9'}}>Sponsored <i className="fas fa-globe-asia"></i></span>
                                                                        </div>
                                                                        <div className="float-right">
                                                                            <span className="fas fa-ellipsis-h"></span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="column column_12_12" style={{marginTop: 5}}>
                                                                        <span style={{fontSize: 12}} dangerouslySetInnerHTML={{__html: this.state.adText.replace(/&nbsp;/g,"").replace(/https:\/\/.*</g, "<a href="+this.state.adWebsiteURL+" target='_blank'>"+this.state.adWebsiteURL+"</a><")}}></span>
                                                                    </div>
                                                                    <div className="column column_12_12" style={{marginTop: 5, padding: 0}}>
                                                                        {this.state.refreshPreview}
                                                                    </div>
                                                                    <div className="column column_12_12" style={{padding: 5, paddingBottom: 10, backgroundColor: '#e8eaee', borderBottom: '1px solid #d6d8db'}}>
                                                                        <div className="float-left ellipsis" style={{width: '65%', padding: '0px 5px'}}>
                                                                            <span style={{fontSize: 11, whiteSpace: 'nowrap'}}>{this.state.adDisplayLink}</span> <br/>
                                                                            <span style={{fontSize: 13, whiteSpace: 'nowrap'}} dangerouslySetInnerHTML={{__html: this.state.adHeadline}}></span> <br/>
                                                                            <span style={{fontSize: 12, whiteSpace: 'nowrap'}} dangerouslySetInnerHTML={{__html: this.state.adLinkDescription}}></span>
                                                                        </div>
                                                                        <div className="float-left text-right" style={{width: '30%'}}>
                                                                            <br/>
                                                                            <button style={{border: '1px solid #000', backgroundColor: 'transparent', fontSize: 12, whiteSpace: 'nowrap', borderRadius: 5}}>SHOP NOW</button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="column column_12_12" style={{padding: 0}}>
                                                                        <hr/>
                                                                        <div className="column column_12_12" style={{padding: 0}}>
                                                                            <div className="float-left text-center" style={{fontSize: 13, padding: 0, width: '32%'}}>
                                                                                <i className="far fa-thumbs-up"></i> Like <br/>
                                                                            </div>
                                                                            <div className="float-left text-center ellipsis" style={{fontSize: 13, padding: 0, width: '36%', whiteSpace: 'nowrap'}}>
                                                                                <i className="far fa-comment-alt"></i> Comment <br/>
                                                                            </div>
                                                                            <div className="float-left text-center" style={{fontSize: 13, padding: 0, width: '32%'}}>
                                                                                <i className="fas fa-share"></i> Share <br/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        } else {
                                                            return (
                                                                <div className="center-vertical text-center" style={{whiteSpace: 'nowrap'}}>
                                                                    <label>Select Ad Page to<br/>generate ad preview</label>
                                                                </div>
                                                            );
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                }
                {this.state.getPixelCode &&
                    <Modal open={this.state.getPixelCode} closeModal={this.togglePixel}>
                        <div className="page-container">
                            <h3>Facebook Pixel</h3>
                            <textarea className="stretch-width" rows="20" defaultValue={this.state.pixelCode} readOnly>
                            </textarea>
                        </div>
                    </Modal>
                }
            </div>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AdminCreateAds);