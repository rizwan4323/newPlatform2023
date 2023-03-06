import React from 'react';
import withAuth from '../hoc/withAuth';
import { Link } from 'react-router-dom';
import Modal from '../components/ModalComponent/';
import Loading from '../components/loading';
import Popup from 'reactjs-popup';
import { Helmet } from 'react-helmet';
import { Mutation, Query } from 'react-apollo';
import { ADD_MY_STAFF, EXTEND_MORE_DAYS, GET_MY_STAFFS, REMOVE_STAFF } from './../queries';
import toastr from 'toastr';
import ButtonWithPopup from '../components/buttonWithPopup';
const points = require('../../Global_Values');


var refetchStaffs = null;

class ManageSubscription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unsubscribe: false,
            openInvites: false,
            countStaffs: 0,
            staffEmail: "",
            questions: [
                'How long have you been using the Product List Genie platform & community? (Mandatory)',
                'Overall, how satisfied were you with our platform & community? (Mandatory)',
                'What was the primary reason for canceling your account? (Mandatory)',
                'Please tell us why you were not satisfied with the subscription/service (Mandatory)',
                'How can we improve our service? (Mandatory)',
                'Are you part of our Facebook community group? (Mandatory)',
                'Select Country? (Mandatory)'
            ],
            kartraTransactionHistory: [],
            shouldExtend: false,
            hasEventListener: false
        }
        this.toggleUnsubscribeModal = this.toggleUnsubscribeModal.bind(this)
    }

    componentDidMount() {
        toastr.options = {
            "progressBar": true,
            "closeButton": false,
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

        console.log("🚩🏁🌈🖍✅🚗");


        function selectElement(id, valueToSelect) {    
            let element = document.getElementById(id);
            element.value = valueToSelect;
        }
        function setSelectedLocalBrowserDate() {
            console.log("setSelectedLocalBrowserDate");
            var localt = window.localStorage.getItem("localBrowserDate") ? window.localStorage.getItem("localBrowserDate") : new Date().getTimezoneOffset();
            selectElement('timezone-offset', localt)
        }

        fetch(points.apiServer + '/kartrasubscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: this.props.session.getCurrentUser.kartra ? this.props.session.getCurrentUser.kartra : this.props.session.getCurrentUser.email })
        })
            .then(res => res.json())
            .then(result => {
                this.setState({ kartraTransactionHistory: result });
            });
            setSelectedLocalBrowserDate()
    }

    toggleUnsubscribeModal() {
        this.setState({
            unsubscribe: !this.state.unsubscribe
        }, () => {
            if (this.state.unsubscribe) {
                let self = this;
                setTimeout(function () {
                    self.addEventListener();
                }.bind(), 1000);
            }
        })
    }

    getAllCountry() {
        var country = `<select class="input-as-text btinput" id="country">
            <option value="" selected>Select Country</option>
            <option value="Afghanistan">Afghanistan</option>
            <option value="Albania">Albania</option>
            <option value="Algeria">Algeria</option>
            <option value="American Samoa">American Samoa</option>
            <option value="Andorra">Andorra</option>
            <option value="Angola">Angola</option>
            <option value="Anguilla">Anguilla</option>
            <option value="Antartica">Antarctica</option>
            <option value="Antigua and Barbuda">Antigua and Barbuda</option>
            <option value="Argentina">Argentina</option>
            <option value="Armenia">Armenia</option>
            <option value="Aruba">Aruba</option>
            <option value="Australia">Australia</option>
            <option value="Austria">Austria</option>
            <option value="Azerbaijan">Azerbaijan</option>
            <option value="Bahamas">Bahamas</option>
            <option value="Bahrain">Bahrain</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="Barbados">Barbados</option>
            <option value="Belarus">Belarus</option>
            <option value="Belgium">Belgium</option>
            <option value="Belize">Belize</option>
            <option value="Benin">Benin</option>
            <option value="Bermuda">Bermuda</option>
            <option value="Bhutan">Bhutan</option>
            <option value="Bolivia">Bolivia</option>
            <option value="Bosnia and Herzegowina">Bosnia and Herzegowina</option>
            <option value="Botswana">Botswana</option>
            <option value="Bouvet Island">Bouvet Island</option>
            <option value="Brazil">Brazil</option>
            <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
            <option value="Brunei Darussalam">Brunei Darussalam</option>
            <option value="Bulgaria">Bulgaria</option>
            <option value="Burkina Faso">Burkina Faso</option>
            <option value="Burundi">Burundi</option>
            <option value="Cambodia">Cambodia</option>
            <option value="Cameroon">Cameroon</option>
            <option value="Canada">Canada</option>
            <option value="Cape Verde">Cape Verde</option>
            <option value="Cayman Islands">Cayman Islands</option>
            <option value="Central African Republic">Central African Republic</option>
            <option value="Chad">Chad</option>
            <option value="Chile">Chile</option>
            <option value="China">China</option>
            <option value="Christmas Island">Christmas Island</option>
            <option value="Cocos Islands">Cocos (Keeling) Islands</option>
            <option value="Colombia">Colombia</option>
            <option value="Comoros">Comoros</option>
            <option value="Congo">Congo</option>
            <option value="Congo">Congo, the Democratic Republic of the</option>
            <option value="Cook Islands">Cook Islands</option>
            <option value="Costa Rica">Costa Rica</option>
            <option value="Cota D'Ivoire">Cote d'Ivoire</option>
            <option value="Croatia">Croatia (Hrvatska)</option>
            <option value="Cuba">Cuba</option>
            <option value="Cyprus">Cyprus</option>
            <option value="Czech Republic">Czech Republic</option>
            <option value="Denmark">Denmark</option>
            <option value="Djibouti">Djibouti</option>
            <option value="Dominica">Dominica</option>
            <option value="Dominican Republic">Dominican Republic</option>
            <option value="East Timor">East Timor</option>
            <option value="Ecuador">Ecuador</option>
            <option value="Egypt">Egypt</option>
            <option value="El Salvador">El Salvador</option>
            <option value="Equatorial Guinea">Equatorial Guinea</option>
            <option value="Eritrea">Eritrea</option>
            <option value="Estonia">Estonia</option>
            <option value="Ethiopia">Ethiopia</option>
            <option value="Falkland Islands">Falkland Islands (Malvinas)</option>
            <option value="Faroe Islands">Faroe Islands</option>
            <option value="Fiji">Fiji</option>
            <option value="Finland">Finland</option>
            <option value="France">France</option>
            <option value="France Metropolitan">France, Metropolitan</option>
            <option value="French Guiana">French Guiana</option>
            <option value="French Polynesia">French Polynesia</option>
            <option value="French Southern Territories">French Southern Territories</option>
            <option value="Gabon">Gabon</option>
            <option value="Gambia">Gambia</option>
            <option value="Georgia">Georgia</option>
            <option value="Germany">Germany</option>
            <option value="Ghana">Ghana</option>
            <option value="Gibraltar">Gibraltar</option>
            <option value="Greece">Greece</option>
            <option value="Greenland">Greenland</option>
            <option value="Grenada">Grenada</option>
            <option value="Guadeloupe">Guadeloupe</option>
            <option value="Guam">Guam</option>
            <option value="Guatemala">Guatemala</option>
            <option value="Guinea">Guinea</option>
            <option value="Guinea-Bissau">Guinea-Bissau</option>
            <option value="Guyana">Guyana</option>
            <option value="Haiti">Haiti</option>
            <option value="Heard and McDonald Islands">Heard and Mc Donald Islands</option>
            <option value="Holy See">Holy See (Vatican City State)</option>
            <option value="Honduras">Honduras</option>
            <option value="Hong Kong">Hong Kong</option>
            <option value="Hungary">Hungary</option>
            <option value="Iceland">Iceland</option>
            <option value="India">India</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Iran">Iran (Islamic Republic of)</option>
            <option value="Iraq">Iraq</option>
            <option value="Ireland">Ireland</option>
            <option value="Israel">Israel</option>
            <option value="Italy">Italy</option>
            <option value="Jamaica">Jamaica</option>
            <option value="Japan">Japan</option>
            <option value="Jordan">Jordan</option>
            <option value="Kazakhstan">Kazakhstan</option>
            <option value="Kenya">Kenya</option>
            <option value="Kiribati">Kiribati</option>
            <option value="Democratic People's Republic of Korea">Korea, Democratic People's Republic of</option>
            <option value="Korea">Korea, Republic of</option>
            <option value="Kuwait">Kuwait</option>
            <option value="Kyrgyzstan">Kyrgyzstan</option>
            <option value="Lao">Lao People's Democratic Republic</option>
            <option value="Latvia">Latvia</option>
            <option value="Lebanon">Lebanon</option>
            <option value="Lesotho">Lesotho</option>
            <option value="Liberia">Liberia</option>
            <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
            <option value="Liechtenstein">Liechtenstein</option>
            <option value="Lithuania">Lithuania</option>
            <option value="Luxembourg">Luxembourg</option>
            <option value="Macau">Macau</option>
            <option value="Macedonia">Macedonia, The Former Yugoslav Republic of</option>
            <option value="Madagascar">Madagascar</option>
            <option value="Malawi">Malawi</option>
            <option value="Malaysia">Malaysia</option>
            <option value="Maldives">Maldives</option>
            <option value="Mali">Mali</option>
            <option value="Malta">Malta</option>
            <option value="Marshall Islands">Marshall Islands</option>
            <option value="Martinique">Martinique</option>
            <option value="Mauritania">Mauritania</option>
            <option value="Mauritius">Mauritius</option>
            <option value="Mayotte">Mayotte</option>
            <option value="Mexico">Mexico</option>
            <option value="Micronesia">Micronesia, Federated States of</option>
            <option value="Moldova">Moldova, Republic of</option>
            <option value="Monaco">Monaco</option>
            <option value="Mongolia">Mongolia</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Morocco">Morocco</option>
            <option value="Mozambique">Mozambique</option>
            <option value="Myanmar">Myanmar</option>
            <option value="Namibia">Namibia</option>
            <option value="Nauru">Nauru</option>
            <option value="Nepal">Nepal</option>
            <option value="Netherlands">Netherlands</option>
            <option value="Netherlands Antilles">Netherlands Antilles</option>
            <option value="New Caledonia">New Caledonia</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Nicaragua">Nicaragua</option>
            <option value="Niger">Niger</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Niue">Niue</option>
            <option value="Norfolk Island">Norfolk Island</option>
            <option value="Northern Mariana Islands">Northern Mariana Islands</option>
            <option value="Norway">Norway</option>
            <option value="Oman">Oman</option>
            <option value="Pakistan">Pakistan</option>
            <option value="Palau">Palau</option>
            <option value="Panama">Panama</option>
            <option value="Papua New Guinea">Papua New Guinea</option>
            <option value="Paraguay">Paraguay</option>
            <option value="Peru">Peru</option>
            <option value="Philippines">Philippines</option>
            <option value="Pitcairn">Pitcairn</option>
            <option value="Poland">Poland</option>
            <option value="Portugal">Portugal</option>
            <option value="Puerto Rico">Puerto Rico</option>
            <option value="Qatar">Qatar</option>
            <option value="Reunion">Reunion</option>
            <option value="Romania">Romania</option>
            <option value="Russia">Russian Federation</option>
            <option value="Rwanda">Rwanda</option>
            <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option> 
            <option value="Saint LUCIA">Saint LUCIA</option>
            <option value="Saint Vincent">Saint Vincent and the Grenadines</option>
            <option value="Samoa">Samoa</option>
            <option value="San Marino">San Marino</option>
            <option value="Sao Tome and Principe">Sao Tome and Principe</option> 
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="Senegal">Senegal</option>
            <option value="Seychelles">Seychelles</option>
            <option value="Sierra">Sierra Leone</option>
            <option value="Singapore">Singapore</option>
            <option value="Slovakia">Slovakia (Slovak Republic)</option>
            <option value="Slovenia">Slovenia</option>
            <option value="Solomon Islands">Solomon Islands</option>
            <option value="Somalia">Somalia</option>
            <option value="South Africa">South Africa</option>
            <option value="South Georgia">South Georgia and the South Sandwich Islands</option>
            <option value="Span">Spain</option>
            <option value="SriLanka">Sri Lanka</option>
            <option value="St. Helena">St. Helena</option>
            <option value="St. Pierre and Miguelon">St. Pierre and Miquelon</option>
            <option value="Sudan">Sudan</option>
            <option value="Suriname">Suriname</option>
            <option value="Svalbard">Svalbard and Jan Mayen Islands</option>
            <option value="Swaziland">Swaziland</option>
            <option value="Sweden">Sweden</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Syria">Syrian Arab Republic</option>
            <option value="Taiwan">Taiwan, Province of China</option>
            <option value="Tajikistan">Tajikistan</option>
            <option value="Tanzania">Tanzania, United Republic of</option>
            <option value="Thailand">Thailand</option>
            <option value="Togo">Togo</option>
            <option value="Tokelau">Tokelau</option>
            <option value="Tonga">Tonga</option>
            <option value="Trinidad and Tobago">Trinidad and Tobago</option>
            <option value="Tunisia">Tunisia</option>
            <option value="Turkey">Turkey</option>
            <option value="Turkmenistan">Turkmenistan</option>
            <option value="Turks and Caicos">Turks and Caicos Islands</option>
            <option value="Tuvalu">Tuvalu</option>
            <option value="Uganda">Uganda</option>
            <option value="Ukraine">Ukraine</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
            <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
            <option value="Uruguay">Uruguay</option>
            <option value="Uzbekistan">Uzbekistan</option>
            <option value="Vanuatu">Vanuatu</option>
            <option value="Venezuela">Venezuela</option>
            <option value="Vietnam">Viet Nam</option>
            <option value="Virgin Islands (British)">Virgin Islands (British)</option>
            <option value="Virgin Islands (U.S)">Virgin Islands (U.S.)</option>
            <option value="Wallis and Futana Islands">Wallis and Futuna Islands</option>
            <option value="Western Sahara">Western Sahara</option>
            <option value="Yemen">Yemen</option>
            <option value="Yugoslavia">Yugoslavia</option>
            <option value="Zambia">Zambia</option>
            <option value="Zimbabwe">Zimbabwe</option>
        </select>`;
        return country;
    }

    httpPost(url, data, callback, err = console.error) {
        const request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.onload = () => callback(request.responseText);
        request.onerror = () => err(request);
        request.send(data);
    };

    shouldExtendTrial(value) {
        if (value == "7 Day Trial is not enough") {
            this.setState({
                shouldExtend: true
            })
        } else {
            this.setState({
                shouldExtend: false
            })
        }
    }

    collectAnswer() {
        let answers = {
            user_id: this.props.session.getCurrentUser.id,
            user_email: this.props.session.getCurrentUser.kartra ? this.props.session.getCurrentUser.kartra : this.props.session.getCurrentUser.email,
            store_name: this.props.session.getCurrentUser != null ? this.props.session.getCurrentUser.store_url : '',
            Answer1: this.getSurveyAnswer(true, "[name='plg1']"),
            Answer2: this.getSurveyAnswer(true, "[name='plg2']"),
            Answer3: this.getSurveyAnswer(true, "[name='plg3']"),
            alternativeans3: this.getSurveyAnswer(false, "#text_alternative input"),
            Answer4: this.getSurveyAnswer(false, "[name='plg4']"),
            Answer5: this.getSurveyAnswer(false, "[name='plg5']"),
            Answer6: this.getSurveyAnswer(true, "[name='plg6']"),
            country: this.getSurveyAnswer(false, "#country")
        }

        fetch(points.apiServer + '/subscription/cancel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answers })
        })
            .then(result => {
                // done
            });
    };

    addEventListener() {
        let self = this;
        document.querySelectorAll(".form-wrapper .button").forEach(el => {
            el.addEventListener("click", () => {
                var button = el;
                var currentSection = button.parentNode.parentNode;
                var currentSectionIndex = Array.prototype.indexOf.call(currentSection.parentNode.children, currentSection);
                var headerSection = document.querySelectorAll('.steps li')[currentSectionIndex];

                // Validation Start
                var isDone = false;
                if (self.getSurveyAnswer(true, "[name='plg1']") && self.getSurveyAnswer(true, "[name='plg2']") && self.getSurveyAnswer(true, "[name='plg3']")) {
                    isDone = true;
                    // If has done class
                    if (button.classList.contains("done")) {
                        // Start Validate all Textarea
                        self.validateTextArea(document.querySelector("[name='plg4']"));
                        self.validateTextArea(document.querySelector("[name='plg5']"));
                        self.validateTextArea(document.querySelector("#country"));
                        // If all fields is not empty
                        if (self.getSurveyAnswer(false, "[name='plg4']") && self.getSurveyAnswer(false, "[name='plg5']") && self.getSurveyAnswer(true, "[name='plg6']") && self.getSurveyAnswer(false, "#country")) {
                            self.collectAnswer();
                            isDone = true;
                        } else {
                            // if fields are empty at last survey
                            isDone = false;
                        }
                    } else {
                        // Validate Alternative
                        if (document.querySelectorAll('[name="plg3"]')[2].checked) {
                            self.validateTextArea(document.querySelector("#text_alternative input"));
                            if (self.getSurveyAnswer(false, "#text_alternative input")) {
                                isDone = true;
                            } else {
                                isDone = false;
                            }
                        }
                    }
                }
                // Validation End
                // If has next class and still have next sibling and also the isDone variable is true
                if (button.classList.contains("next") && headerSection.nextElementSibling && isDone) {
                    currentSection.classList.remove("is-active");
                    currentSection.nextElementSibling.classList.add("is-active");
                    headerSection.classList.remove("is-active");
                    headerSection.nextElementSibling.classList.add("is-active");
                } else if (button.classList.contains("prev") && headerSection.previousElementSibling) {
                    currentSection.classList.remove("is-active");
                    currentSection.previousElementSibling.classList.add("is-active");
                    headerSection.classList.remove("is-active");
                    headerSection.previousElementSibling.classList.add("is-active");
                }
            });
        });

        document.querySelectorAll('[name="plg3"]').forEach(el => {
            el.addEventListener("click", function (e) {
                self.checkAlternative();
            });
        });
    }

    getSurveyAnswer(isOption, selector) {
        var result = "";
        document.querySelectorAll(selector).forEach(el => {
            if (isOption) {
                if (el.checked) {
                    result = el.value;
                }
            } else {
                result = el.value;
            }
        });
        if (isOption && (!result)) {
            document.querySelectorAll(selector).forEach(el => {
                el.parentNode.parentNode.style.border = "1px solid red";
                el.parentNode.parentNode.style.padding = "10px";
            })
        } else if (isOption && result) {
            document.querySelectorAll(selector).forEach(el => {
                el.parentNode.parentNode.style = "";
            })
        }
        return result;
    }

    validateTextArea(element) {
        if (element.value == undefined) {
            element = element.target;
        }
        var color = "";
        if (element.value) {
            color = "black";
        } else {
            color = "red";
        }
        element.style.border = "1px solid " + color;
    }

    checkAlternative() {
        if (document.querySelectorAll('[name="plg3"]')[2].checked) {
            document.getElementById("text_alternative").style.cssText = "margin-left: 5%; display:block";
        } else {
            document.getElementById("text_alternative").style.cssText = "margin-left: 5%; display:none";
        }
    }

    getActiveSubscriptionName() {
        var newTransact = [];
        var refundTransact = [];
        var allowanceDate = 30;
        if (this.state.kartraTransactionHistory.length != 0) {
            if (this.state.kartraTransactionHistory.status && this.state.kartraTransactionHistory.status == "Success") {
                this.state.kartraTransactionHistory.actions[0].get_transactions_from_lead.transaction_list.map((data, i) => {
                    if (data.transaction_type == "sale" || data.transaction_type == "rebill") {
                        if (data.product_name == "Product List Genie Full" || data.product_name == "PLG Full Settlement" || data.product_name == "Product List Genie Basic") {
                            var transactionDate = new Date(data.transaction_date).getTime();
                            var daysScope = points.addDateFrom(transactionDate, allowanceDate)
                            if (transactionDate <= daysScope) {
                                newTransact.push(data);
                            }
                        }
                    }
                    if (data.transaction_type == "refund" || data.transaction_type == "cancellation") {
                        if (data.product_name == "Product List Genie Full" || data.product_name == "PLG Full Settlement" || data.product_name == "Product List Genie Basic") {
                            var transactionDate = new Date(data.transaction_date).getTime();
                            var daysScope = points.addDateFrom(transactionDate, allowanceDate)
                            if (transactionDate <= daysScope) {
                                refundTransact.push(data);
                            }
                        }
                    }
                });

                if (newTransact.length > 0) {
                    var latestProductBought = newTransact[newTransact.length - 1];
                    if (refundTransact.length > 0) {
                        var latestProductRefund = refundTransact[refundTransact.length - 1];
                        if (latestProductBought.transaction_full_amount == "0.00") {
                            allowanceDate = 8;
                        }
                        if (latestProductRefund.product_id === latestProductBought.product_id && new Date(latestProductBought.transaction_date).getTime() < new Date(latestProductRefund.transaction_date)) {
                            // refunded or cancell and latest product bought date is less than refund date
                            return returnFree(this);
                        } else {
                            // not refunded or not cancell and much latest than latest refund date
                            return returnSpecificSubscription(latestProductBought.product_name, latestProductBought.transaction_date);
                        }
                    } else {
                        // valid purchase
                        return returnSpecificSubscription(latestProductBought.product_name, latestProductBought.transaction_date);
                    }
                } else {
                    return returnFree(this);
                }
            } else {
                return returnFree(this);
            }

            function returnFree(self) {
                return {
                    name: "Free Account",
                    date: `Upgrade Your Account <a href="${points.upgradeAccountLink + "?email=" + self.props.session.getCurrentUser.email}" target="_blank"> here</a>`
                };
            }

            function returnSpecificSubscription(product_name, dateExpire) {
                return {
                    name: product_name,
                    date: new Date(new Date(dateExpire).getTime() + (86400000 * allowanceDate)).toDateString()
                };
            }
        }
    }

    deleteStaff(deleteStaffMutation) {
        deleteStaffMutation().then(({ data }) => {
            console.log(data.removeStaff);
            if (data.removeStaff === null) {
                toastr.clear();
                toastr.error('Please try again.', 'Error occured please try again!');
            } else {
                this.setState({ openInvites: false });
                toastr.options.timeOut = 2000;
                toastr.options.extendedTimeOut = 2500;
                toastr.clear();
                toastr.success("Please wait loading...", "Success!");
                toastr.options.timeOut = 0;
                toastr.options.extendedTimeOut = 0;
                refetchStaffs();
            }
        })
    }

    addStaffMutationFunction(addStaffMutation) {
        if (this.props.session.getCurrentUser.staffIds.length > 2) {
            toastr.clear();
            toastr.error('Oops...', 'Too many invites!');
        } else {
            addStaffMutation().then(({ data }) => {
                console.log(data.addStaff);
                if (data.addStaff === null) {
                    toastr.clear();
                    toastr.error('Please try again.', 'Error occured please try again!');
                } else {
                    this.setState({ openInvites: false });
                    toastr.options.timeOut = 2000;
                    toastr.options.extendedTimeOut = 2500;
                    toastr.clear();
                    toastr.success("Please wait loading...", "Success!");
                    toastr.options.timeOut = 0;
                    toastr.options.extendedTimeOut = 0;
                    refetchStaffs();
                }
            });
        }
    }

    extendMoreDays(extendMoreDays) {
        // alert("Coming Soon Stay Tuned!");
        document.getElementById("close-continue").click();
        toastr.options.timeOut = 0;
        toastr.options.extendedTimeOut = 0;
        toastr.clear();
        toastr.info("Loading Please wait...", "");
        extendMoreDays().then(({ data }) => {
            this.toggleUnsubscribeModal();
            toastr.clear();
            toastr.success("Trial Extended!", "Success");
            toastr.options.timeOut = 3000;
            toastr.options.extendedTimeOut = 2000;
        }).catch(error => {
            console.error("ERR =>", error);
        });
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Manage Subscription - Product List Genie</title>
            </Helmet>
        );
    }

    render() {
        const currentUser = this.props.session.getCurrentUser;
        
        function setLocalBrowserDate(value) {
            console.log(value)
            window.localStorage.setItem("localBrowserDate", value)
        }
        
        return (
					<div className="page-container">
						{this.head()}
						<h1>Membership Information</h1>
						<div className="product-card">
							<div className="product-details">
								<div style={{ overflow: 'hidden' }}>
									<div className="column column_6_12">
										<h3>Email</h3>
										<p>{this.props.session.getCurrentUser.email}</p>
                                        <label style={{marginBottom: "10px"}}>Set Timezone</label><br />
										<select className="dropbtn" name="timezone_offset" id="timezone-offset" style={{backgroundColor:"#d8d8d8"}} onChange={(e) => {setLocalBrowserDate(e.target.value)}}
                                        
                                        >
                                            <option value="720">(GMT -12:00) Eniwetok, Kwajalein</option>
                                            <option value="660">(GMT -11:00) Midway Island, Samoa</option>
                                            <option value="600">(GMT -10:00) Hawaii</option>
                                            <option value="540">(GMT -9:30) Taiohae</option>
                                            <option value="540">(GMT -9:00) Alaska</option>
                                            <option value="480">(GMT -8:00) Pacific Time (US &amp; Canada)</option>
                                            <option value="420">(GMT -7:00) Mountain Time (US &amp; Canada)</option>
                                            <option value="360">(GMT -6:00) Central Time (US &amp; Canada), Mexico City</option>
                                            <option value="300">(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima</option>
                                            <option value="240">(GMT -4:30) Caracas</option>
                                            <option value="240">(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz</option>
                                            <option value="180">(GMT -3:30) Newfoundland</option>
                                            <option value="180">(GMT -3:00) Brazil, Buenos Aires, Georgetown</option>
                                            <option value="120">(GMT -2:00) Mid-Atlantic</option>
                                            <option value="60">(GMT -1:00) Azores, Cape Verde Islands</option>
                                            <option value="0" defaultValue>(GMT) Western Europe Time, London, Lisbon, Casablanca</option>
                                            <option value="-60">(GMT +1:00) Brussels, Copenhagen, Madrid, Paris</option>
                                            <option value="-120">(GMT +2:00) Kaliningrad, South Africa</option>
                                            <option value="-180">(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg</option>
                                            <option value="-180">(GMT +3:30) Tehran</option>
                                            <option value="-240">(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi</option>
                                            <option value="-240">(GMT +4:30) Kabul</option>
                                            <option value="-300">(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent</option>
                                            <option value="-300">(GMT +5:30) Bombay, Calcutta, Madras, New Delhi</option>
                                            <option value="-300">(GMT +5:45) Kathmandu, Pokhara</option>
                                            <option value="-360">(GMT +6:00) Almaty, Dhaka, Colombo</option>
                                            <option value="-360">(GMT +6:30) Yangon, Mandalay</option>
                                            <option value="-420">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>
                                            <option value="-480">(GMT +8:00) Beijing, Perth, Singapore, Hong Kong</option>
                                            <option value="-480">(GMT +8:45) Eucla</option>
                                            <option value="-540">(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk</option>
                                            <option value="-540">(GMT +9:30) Adelaide, Darwin</option>
                                            <option value="-600">(GMT +10:00) Eastern Australia, Guam, Vladivostok</option>
                                            <option value="-600">(GMT +10:30) Lord Howe Island</option>
                                            <option value="-660">(GMT +11:00) Magadan, Solomon Islands, New Caledonia</option>
                                            <option value="-660">(GMT +11:30) Norfolk Island</option>
                                            <option value="-720">(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>
                                            <option value="-720">(GMT +12:45) Chatham Islands</option>
                                            <option value="-780">(GMT +13:00) Apia, Nukualofa</option>
                                            <option value="-840">(GMT +14:00) Line Islands, Tokelau</option>
										</select>

										{/* <h3>Active Subscription</h3>
                                {this.state.kartraTransactionHistory.length == 0 &&
                                    <div className="float-left">
                                        <Loading height={50} width={50} />
                                    </div>
                                }
                                {(() => {
                                    if(this.state.kartraTransactionHistory.length != 0){
                                        var activeSubscription = this.getActiveSubscriptionName();
                                        return (
                                            <p>
                                                {activeSubscription.name}<br/>
                                                Next rebill - <span dangerouslySetInnerHTML={{__html:activeSubscription.date}}></span>
                                            </p>
                                        );
                                    }
                                })()} */}
									</div>
									<div className="column column_6_12">
										
										<h3>Useful Links</h3>
										<Link to="/signout">Logout</Link> <br />
										<Link to="/account">Update Password</Link> <br />
										<Link to="#" onClick={() => this.toggleUnsubscribeModal()}>
											Cancel Subscription
										</Link>
									</div>
								</div>
							</div>
						</div>
						{/* TODO :: Adding Invites 
                    if staff.masterIds.includes(masterIds) accepted invite else provoke invite sent
                    invite resend can be sent once 

                    accepting invites means adding the masterIds to staffIds list => masterIds

                */}

						{currentUser && (
							<div className="product-card">
								<div className="product-details">
									<Query
										query={GET_MY_STAFFS}
										variables={{
											staffEmail: currentUser.id,
										}}
									>
										{({ data, loading, refetch, error }) => {
											refetchStaffs = refetch;

											if (loading)
												return (
													<div style={{ overflow: 'hidden' }}>
														<div className="row text-center">
															<div className="column column_6_12">
																<h2 style={{ float: 'left' }}>Staff Accounts</h2>
															</div>
															{currentUser.staffIds.length < 2 && (
																<div className="column column_6_12">
																	<h5
																		onClick={() => {
																			this.setState({ openInvites: !this.state.openInvites });
																		}}
																		style={{ cursor: 'pointer', color: '#008000' }}
																	>
																		Invite Staff
																	</h5>
																</div>
															)}
														</div>
														<div className="column column_12_12">
															<div className="table-container">
																<table className="table-list">
																	<thead>
																		<tr>
																			<th>Email</th>
																			<th>Status</th>
																			<th>( 0 / 2)</th>
																		</tr>
																	</thead>
																	<tbody>
																		<tr>
																			<td colSpan="5" className="text-center">
																				<div className="text-center">
																					<Loading height={150} width={150} />
																				</div>
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>
														</div>
													</div>
												);
											if (error) {
												return (
													<div style={{ overflow: 'hidden' }}>
														<div className="row text-center">
															<div className="column column_6_12">
																<h2 style={{ float: 'left' }}>Staff Accounts</h2>
															</div>
															{currentUser.staffIds.length < 2 && (
																<div className="column column_6_12">
																	<h5
																		onClick={() => {
																			this.setState({ openInvites: !this.state.openInvites });
																		}}
																		style={{ cursor: 'pointer', color: '#008000' }}
																	>
																		Invite Staff
																	</h5>
																</div>
															)}
														</div>
														<div className="column column_12_12">
															<div className="table-container">
																<table className="table-list">
																	<thead>
																		<tr>
																			<th>Email</th>
																			<th>Status</th>
																			<th>( 0 / 2)</th>
																		</tr>
																	</thead>
																	<tbody>
																		<tr>
																			<td colSpan="5" className="text-center">
																				Something has occured please contact administrator.
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>
														</div>
													</div>
												);
											}
											if (data.getMyStaffs.length === 0) {
												return (
													<div style={{ overflow: 'hidden' }}>
														<div className="row text-center">
															<div className="column column_6_12">
																<h2 style={{ float: 'left' }}>Staff Accounts</h2>
															</div>
															{currentUser.staffIds.length < 2 && (
																<div className="column column_6_12">
																	<h5
																		onClick={() => {
																			this.setState({ openInvites: !this.state.openInvites });
																		}}
																		style={{ cursor: 'pointer', color: '#008000' }}
																	>
																		Invite Staff
																	</h5>
																</div>
															)}
														</div>
														<div className="column column_12_12">
															<div className="table-container">
																<table className="table-list">
																	<thead>
																		<tr>
																			<th>Email</th>
																			<th>Status</th>
																			<th>( 0 / 2)</th>
																		</tr>
																	</thead>
																	<tbody>
																		<tr>
																			<td colSpan="5" className="text-center">
																				No Active Staff Invites
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>
														</div>
													</div>
												);
											} else {
												const user = data.getMyStaffs;
												return (
													<div style={{ overflow: 'hidden' }}>
														<div className="row text-center">
															<div className="column column_6_12">
																<h2 style={{ float: 'left' }}>Staff Accounts</h2>
															</div>
															{user.length < 2 && (
																<div className="column column_6_12">
																	<h5
																		onClick={() => {
																			this.setState({ openInvites: !this.state.openInvites });
																		}}
																		style={{ cursor: 'pointer', color: '#008000' }}
																	>
																		Invite Staff
																	</h5>
																</div>
															)}
														</div>
														<div className="column column_12_12">
															<div className="table-container">
																<table className="table-list">
																	<thead>
																		<tr>
																			<th>Email</th>
																			<th>Status</th>
																			<th>( {user.length} / 2)</th>
																		</tr>
																	</thead>
																	<tbody>
																		{user.map((us, index) => {
																			return (
																				<tr key={index}>
																					<td>{us.email}</td>
																					<td>{us.masterIds !== null && us.masterIds.includes(currentUser.id) ? 'Accepted Staff' : 'Pending Invite'}</td>
																					<td className="funnel text-center">
																						<Mutation
																							mutation={REMOVE_STAFF}
																							variables={{
																								staffEmail: us.email,
																								masterId: currentUser.id,
																							}}
																						>
																							{(deleteStaffMutation, { data, loading, error, refetch }) => {
																								return (
																									<ButtonWithPopup
																										data={{
																											triggerDOM: (
																												<span
																													id={'remove_' + index}
																													className="fas fa-trash dark-container"
																													style={{
																														cursor: 'pointer',
																														fontSize: '1.2em',
																														padding: 10,
																														marginLeft: '2rem',
																														borderRadius: 3,
																														float: 'right',
																													}}
																												/>
																											),
																											popupPosition: 'left center',
																											text: (
																												<label className="font-roboto-light" style={{ fontSize: '1.2em' }}>
																													Are you sure you want <br />
																													to delete <u style={{ color: '#2ac689' }}>{us.email}</u>?
																												</label>
																											),
																											action: () => {
																												console.log('DELETION EVENT COMES');
																												this.deleteStaff(deleteStaffMutation);
																												// this.deleteButton(btn.id, btn.buttonID);
																											},
																											triggerID: 'remove_' + index,
																											loading,
																											padding: 10,
																											style: { minWidth: 250, width: 250 },
																										}}
																									/>
																								);
																							}}
																						</Mutation>
																					</td>
																				</tr>
																			);
																		})}
																	</tbody>
																</table>
															</div>
														</div>
													</div>
												);
											}
										}}
									</Query>
								</div>
							</div>
						)}
						{/* {currentUser.access_tags.includes('staff_account') && <div className="product-card">
                    <div className="product-details">
                        <div style={{ overflow: 'hidden' }}>
                            <div className="text-center">
                                <h2>Master Accounts</h2>
                            </div>
                            {this.state.kartraTransactionHistory.length == 0 &&
                                <div className="text-center">
                                    <Loading height={150} width={150} />
                                </div>
                            }
                            {this.state.kartraTransactionHistory.length != 0 &&
                                <div className="table-container">
                                    <table className="table-list">
                                        <thead>
                                            <tr>
                                                <th>Email</th>
                                                <th>Full Name</th>
                                                <th>Date Subscribed</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>sampleemail@email.com</td>
                                                <td>Sample Name</td>
                                                <td>{new Date(Date.now()).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                <td className="funnel text-center">                                                   
                                                    <span className="fas fa-trash dark-container" onClick={() => {
                                                        
                                                    }} style={{ cursor: "pointer", fontSize: '1.2em', padding: 10, marginLeft: "2rem", borderRadius: 3}} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                    </div>
                </div>} */}
						<div className="product-card">
							<div className="product-details">
								<div style={{ overflow: 'hidden' }}>
									<div className="text-center">
										<h2>Transaction History</h2>
									</div>
									{this.state.kartraTransactionHistory.length == 0 && (
										<div className="text-center">
											<Loading height={150} width={150} />
										</div>
									)}
									{this.state.kartraTransactionHistory.length != 0 && (
										<div className="table-container">
											<table className="table-list">
												<thead>
													<tr>
														<th>Product</th>
														<th>Price</th>
														<th>Date</th>
														<th>Status</th>
													</tr>
												</thead>
												<tbody>
													{(() => {
														if (this.state.kartraTransactionHistory.status && this.state.kartraTransactionHistory.status == 'Success') {
															if (this.state.kartraTransactionHistory.actions[0].get_transactions_from_lead.transaction_list.length != 0) {
																return this.state.kartraTransactionHistory.actions[0].get_transactions_from_lead.transaction_list.map((data, i) => {
																	return (
																		<tr key={i}>
																			<td>{data.product_name}</td>
																			<td>{data.transaction_full_amount}</td>
																			<td>{data.transaction_date}</td>
																			{/* <td>{data.transaction_type == "sale" || data.transaction_type == "rebill" ? 'Paid' : 'Failed'}</td> */}
																			<td>{data.transaction_type}</td>
																		</tr>
																	);
																});
															} else {
																return (
																	<tr>
																		<td colSpan="4" className="text-center">
																			Empty... check back soon!
																		</td>
																	</tr>
																);
															}
														} else {
															return (
																<tr>
																	<td colSpan="4" className="text-center">
																		Empty... check back soon!
																	</td>
																</tr>
															);
														}
													})()}
												</tbody>
											</table>
										</div>
									)}
								</div>
							</div>
						</div>
						{this.state.openInvites && (
							<Modal
								open={this.state.openInvites}
								closeModal={() => this.setState({ openInvites: !this.state.openInvites })}
								style={{ width: '40%', height: '300px', borderTop: '5px solid #23c78a', borderRadius: 10, padding: 0 }}
							>
								<div className="funnel">
									<div className="column_12_12">
										<style dangerouslySetInnerHTML={{ __html: `.popup-content .content { height: auto; padding: 0px; }` }} />
										<div className="clear" style={{ padding: 20, backgroundColor: '#f2f9f6', overflow: 'hidden' }}>
											<h4 className="header">
												Invite Staff{' '}
												<small
													style={{
														color: '#4a4a4a',
														fontSize: '0.6em',
													}}
												>
													{' '}
												</small>
											</h4>
										</div>
										<br />
									</div>
									<div
										className="column column_12_12"
										style={{
											marginRight: 'auto',
											marginLeft: 'auto',
										}}
									>
										<div className="form_input">
											<label>Email to Invite</label>
											<input
												type="email"
												value={this.state.staffEmail}
												onChange={event => this.setState({ staffEmail: event.target.value })}
												name="emailStaff"
											/>
											<span className="bottom_border"></span>
										</div>
									</div>
									<div
										className="column column_12_12"
										style={{
											marginRight: 'auto',
											marginTop: '1rem',
											marginLeft: 'auto',
										}}
									>
										<div className="display-inline row-separator text-center">
											<Mutation
												mutation={ADD_MY_STAFF}
												variables={{
													staffEmail: this.state.staffEmail,
													masterId: currentUser.id,
													masterEmail: currentUser.email,
												}}
											>
												{(addStaffMutation, { data, loading, error, refetch }) => {
													return (
														<button
															className="btn-success font-roboto-light"
															style={{ margin: '0 5px' }}
															onClick={() => {
																console.log('Add HERE', this.state.staffEmail);
																this.addStaffMutationFunction(addStaffMutation);
															}}
														>
															<span className="hide-in-mobile">Send Invite</span>
														</button>
													);
												}}
											</Mutation>
										</div>
									</div>
								</div>
							</Modal>
						)}
						{this.state.unsubscribe && (
							<Modal open={this.state.unsubscribe} closeModal={this.toggleUnsubscribeModal}>
								<div style={{ position: 'relative' }}>
									<div className="survey">
										<ul className="steps">
											<li className="is-active">Step 1</li>
											<li>Step 2</li>
											<li>Thank You</li>
										</ul>
										<form className="form-wrapper">
											{/* <!-- Start of First Step --> */}
											<fieldset className="section is-active">
												<div className="plg_step">
													<div className="text-center">
														<h3>
															Please Complete the survey to <strong>CANCEL YOUR SUBSCRIPTION</strong>
														</h3>
													</div>
													<p>
														<strong>We are sorry to see you go, are you sure you want to cancel your Product List Genie account?</strong>
													</p>{' '}
													<br />
													<p>
														<span style={{ fontWeight: 400 }}>
															You understand that your Product List Genie account will be closed and that you will lose access to everything, lose any progress,
															and be revoked from our Facebook group where you get FREE trainings daily, you will lose access to a community of like minded
															entrepreneurs like you and lose the chance to make new connections and partnerships.
														</span>
													</p>{' '}
													<br />
													<p>
														<span style={{ fontWeight: 400 }}>
															We would highly appreciate if you would take the time to fill out our cancellation survey. This will help us improve our service.
														</span>
													</p>{' '}
													<br />
													<p>
														<strong>{this.state.questions[0]}</strong>
													</p>
													<div style={{ lineHeight: '2.5rem' }}>
														<label style={{ fontWeight: 400 }} htmlFor="week">
															<input type="radio" name="plg1" id="week" value="Less than a week" /> Less than a week
														</label>
														<br />
														<label style={{ fontWeight: 400 }} htmlFor="month">
															<input type="radio" name="plg1" id="month" value="1-3 months" /> 1-3 months
														</label>
														<br />
														<label style={{ fontWeight: 400 }} htmlFor="months">
															<input type="radio" name="plg1" id="months" value="Over 3 Months" /> Over 3 Months
														</label>
														<br />
													</div>{' '}
													<br />
													<p>
														<strong>{this.state.questions[1]}</strong>
													</p>
													<div style={{ lineHeight: '2.5rem' }}>
														<label style={{ fontWeight: 400 }} htmlFor="satisfied">
															<input type="radio" name="plg2" id="satisfied" value="Satisfied" />
															Satisfied
														</label>
														<br />
														<label style={{ fontWeight: 400 }} htmlFor="Neutral">
															<input type="radio" name="plg2" id="Neutral" value="Neutral" />
															Neutral
														</label>
														<br />
														<label style={{ fontWeight: 400 }} htmlFor="Unsatisfied">
															<input type="radio" name="plg2" id="Unsatisfied" value="Unsatisfied" />
															Unsatisfied
														</label>
													</div>{' '}
													<br />
													<p>
														<strong>{this.state.questions[2]}</strong>
													</p>
													<div style={{ lineHeight: '2.5rem' }}>
														<label style={{ fontWeight: 400 }} htmlFor="trial">
															<input
																type="radio"
																name="plg3"
																id="trial"
																value="7 Day Trial is not enough"
																onChange={event => this.shouldExtendTrial(event.target.value)}
															/>{' '}
															7 Day Trial is not enough
														</label>
														<br />
														<label style={{ fontWeight: 400 }} htmlFor="low">
															<input
																type="radio"
																name="plg3"
																id="low"
																value="Quality was less than expected"
																onChange={event => this.shouldExtendTrial(event.target.value)}
															/>{' '}
															Quality was less than expected
														</label>
														<br />
														<label style={{ fontWeight: 400 }} htmlFor="alt">
															<input
																type="radio"
																name="plg3"
																id="alt"
																value="I found an alternative"
																onChange={event => this.shouldExtendTrial(event.target.value)}
															/>{' '}
															I found an alternative
														</label>
														<br />
														<div id="text_alternative" style={{ marginLeft: '5%', display: 'none' }} className="text-left">
															Please Specify <br />
															<input
																type="text"
																style={{ border: '1px solid black', margin: 0, width: '95%' }}
																onChange={event => this.shouldExtendTrial(event.target.value)}
															/>
														</div>
														<label style={{ fontWeight: 400 }} htmlFor="dificult">
															<input
																type="radio"
																name="plg3"
																id="dificult"
																value="It is difficult to use or understand how to use it"
																onChange={event => this.shouldExtendTrial(event.target.value)}
															/>{' '}
															It is difficult to use or understand how to use it
														</label>
														<br />
														<label style={{ fontWeight: 400 }} htmlFor="service">
															<input
																type="radio"
																name="plg3"
																id="service"
																value="Customer service was not good"
																onChange={event => this.shouldExtendTrial(event.target.value)}
															/>{' '}
															Customer service was not good
														</label>
														<br />
														<label style={{ fontWeight: 400 }} htmlFor="fb">
															<input
																type="radio"
																name="plg3"
																id="fb"
																value="Facebook Group Community was not helpful"
																onChange={event => this.shouldExtendTrial(event.target.value)}
															/>{' '}
															Facebook Group Community was not helpful
														</label>
														<br />
													</div>
												</div>{' '}
												<br />
												<div className="form_buttons">
													{!this.props.session.getCurrentUser.isExtended && this.state.shouldExtend ? (
														<Popup
															trigger={
																<span className="btn" id="close-continue">
																	Continue
																</span>
															}
															position="top center"
															on="click"
															className="points-tooltip"
														>
															<div className="text-center" style={{ lineHeight: 1.5 }}>
																<h3 style={{ margin: 0 }}>Are you sure?</h3>
																<h4 style={{ color: '#000', marginBottom: 11 }}>
																	Hold on! We get it, 7 days may not be enough for you.
																	<br />
																	No problem. Would you like to extend your trial for free?
																</h4>

																<Mutation mutation={EXTEND_MORE_DAYS} variables={{ id: this.props.session.getCurrentUser.id }}>
																	{(extendMoreDays, { data, loading, error }) => {
																		return (
																			<span className="btn" onClick={() => this.extendMoreDays(extendMoreDays)}>
																				Yes, Extend 7 more days
																			</span>
																		);
																	}}
																</Mutation>
																<br />
																<span
																	className="dwobtn"
																	style={{ padding: '5px 0' }}
																	onClick={() => {
																		document.getElementById('continue-survey').click();
																		document.getElementById('close-continue').click();
																	}}
																>
																	Continue & Cancel
																</span>
															</div>
														</Popup>
													) : (
														void 0
													)}
													<div
														className="btn button next"
														id="continue-survey"
														style={{ display: !this.props.session.getCurrentUser.isExtended && this.state.shouldExtend ? 'none' : '-webkit-inline-box' }}
													>
														Continue
													</div>
												</div>
											</fieldset>
											{/* <!-- End of First Step --> */}

											{/* <!-- Start of Second Step --> */}
											<fieldset className="section">
												<div className="plg_step">
													<p>
														<strong>{this.state.questions[3]}</strong>
													</p>
													<p>
														<textarea onChange={this.validateTextArea.bind(this)} name="plg4"></textarea>
													</p>
													<p>
														<strong>{this.state.questions[4]}</strong>
													</p>
													<p>
														<textarea onChange={this.validateTextArea.bind(this)} name="plg5"></textarea>
													</p>{' '}
													<br />
													<p>
														<strong>{this.state.questions[5]}</strong>
													</p>
													<div>
														<label style={{ fontWeight: 400 }} htmlFor="yes">
															<input type="radio" name="plg6" id="yes" value="Yes" /> Yes
														</label>
														<br />
														<label style={{ fontWeight: 400 }} htmlFor="no">
															<input type="radio" name="plg6" id="no" value="No" /> No
														</label>
													</div>{' '}
													<br />
													<div>
														<p>
															<strong>{this.state.questions[6]}</strong>
														</p>
														<div dangerouslySetInnerHTML={{ __html: this.getAllCountry() }}></div>
													</div>{' '}
													<br />
												</div>{' '}
												<br />
												<div className="form_buttons">
													<div className="btn button prev">Back</div> | &nbsp;
													<Popup
														trigger={
															<span className="btn" id="close-unsubscribe">
																Unsubscribe
															</span>
														}
														position="top center"
														on="click"
														className="points-tooltip"
													>
														<div className="text-center" style={{ lineHeight: 2, padding: 30 }}>
															<h3 style={{ margin: 0 }}>Are you sure?</h3>
															<h4 style={{ color: '#000', marginBottom: 11 }}>
																Do you want to lose all the benefits <br />
																you will get from ProductListGenie?
															</h4>
															<span className="btn" onClick={() => this.toggleUnsubscribeModal()}>
																No, I'd Rather Stay.
															</span>{' '}
															<br />
															<span
																className="dwobtn"
																style={{ padding: '5px 0' }}
																onClick={() => {
																	this.validateTextArea(document.querySelector("[name='plg4']"));
																	this.validateTextArea(document.querySelector("[name='plg5']"));
																	this.validateTextArea(document.querySelector('#country'));
																	if (
																		this.getSurveyAnswer(false, "[name='plg4']") &&
																		this.getSurveyAnswer(false, "[name='plg5']") &&
																		this.getSurveyAnswer(true, "[name='plg6']") &&
																		this.getSurveyAnswer(false, '#country')
																	) {
																		document.getElementById('unsubscribe').click();
																		document.getElementById('close-unsubscribe').click();
																	} else {
																		document.getElementById('close-unsubscribe').click();
																	}
																}}
															>
																Yes, I'd Rather lose all the benefits & cancel!
															</span>
														</div>
													</Popup>
													<div className="btn button next done" id="unsubscribe" style={{ display: 'none' }}>
														Unsubscribe
													</div>
												</div>
											</fieldset>
											{/* <!-- End of Second Step --> */}

											{/* <!-- Start of Third Step --> */}
											<fieldset className="section">
												<div className="finish">
													<h1>THANKS FOR YOUR TRUST AND CONSIDERATION!</h1>
													<br />
													<h2>WE ARE SORRY TO SEE YOU GO, YOUR ACCOUNT HAS BEEN CANCELLED</h2>
												</div>
											</fieldset>
											{/* <!-- End of Third Step --> */}
										</form>
									</div>
								</div>
							</Modal>
						)}
					</div>
				);
    }
}

export default withAuth(session => session && session.getCurrentUser)(ManageSubscription);