import React from 'react';
import withAuth from '../hoc/withAuth';
import toastr from 'toastr';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import Modal from '../components/ModalComponent';
import Loading from '../components/loading';
import Popup from 'reactjs-popup';
import ReviewStar from '../components/reviewStar';
const points = require('../../Global_Values');

class AddReview extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedProductPreviewURL: '',
            numberOfReviews: 30,
            ObjReviews: [],
            all_user: ['Addison Smith','Adrien Johnson','Alexis Williams','Angel Brown','Arden Jones ','Armani Miller','Ashley Davis','Aubrey Garcia','Avery Rodriguez','Bailey Wilson','Beryl Martinez','Beverly Anderson','Billie Taylor','Blair Thomas','Blake Hernandez','Brett Moore','Brook Martin','Bryce Jackson','Bryn Thompson','Caden White','Cady Lopez','Cameron Lee','Cary Gonzalez','Carson Harris','Kasey Clark','Casper Lewis','Cecil Robinson','Charley Walker','Chase Perez','Claire Hall','Cody Young','Colby Allen','Collin Sanchez','Corin Wright','Cory King','Courtney Scott','Dakota Green','Dale Baker','Dallas Adams','Dayna Nelson','Daryll Hill','Darnelle Ramirez','Dell Campbell','Devon Mitchell','Dylan Roberts','Drew Carter','Elliot Phillips','Emerson Evans','Emery Turner','Erin Torres','Esme Parker','Evan Collins','Evelyn Edwards','Finley Stewart','Finn Flores','Fran Morris','Flynn Nguyen','Gayle Murphy','Gerrie Rivera','Glenn Cook','Grayson Rogers','Greer Morgan','Hadley Peterson','Harley Cooper','Harper Reed','Hayden Bailey','Hayley Bell','Hillary Gomez','Hudson Kelly','Hunter Howard','Ivy Ward','Jade Cox','James Diaz','Jayme Richardson','Jan Wood','Jayden Watson ','Jean Brooks','Jeryn Bennett','Jesse Gray','Jocelyn James','Jody Myers','Joey Cruz','Jonnie Hughes','Jordan Price','Jude Myers','Justice Long','Kye Foster','Kary Sanders','Kay Ross','Keegan Morales','Kelly Powell','Kelsie Sullivan ','Kenzie Russell','Kerry Ortiz','Kim Jenkins','Kirby Gutierrez','Kit Perry','Kristen Butler','Kyle Barnes','Kyrie Fisher','Lacey Henderson','Lane Coleman','Laurence Simmons','Lavern Patterson','Leigh Jordan','Leighto Reynolds','Lindsey Hamilton','Lindy Graham','London Kim','Loren Gonzales','Lucky Alexander','Madison Ramos','Madox Wallace','Marion Griffin','Marley West','Mason Cole','Meredith Hayes','Merle Chavez','Micah Gibson','Michael Bryant','Milo Ellis','Morgan Stevens','Murphy Murray','Nash Ford','Niko Marshall','Nicki Owens','Noah Mcdonald','Noel Harrison','Odell Ruiz','Orion Kennedy','Owen Wells','Paige Alvarez','Palmer Woods','Parker Mendoza','Paxton Castillo','Peyton Olson','Presley Webb','Quinn Washington','Andy Tucker','Raven Freeman','Regan Burns','Reed Henry','Reese Vasquez','Ricki Snyder','Riley Simpson','Ripley Crawford','Robyn Jimenez','Rory Porter','Rowan Mason','Royce Shaw','Rudy Gordon','Ryan Wagner','Rylan Hunter','Sandy Romero','Sasha Hicks','Sawyer Dixon','Skyler Hunt','Scout Palmer','Shawn Robertson','Selby Black','Shane Holmes','Shelby Stone','Shelley Meyer','Sheridan Boyd','Shiloh Mills','Shirley Warren','Sydney Fox','Skeeter Rose','Spencer Rice','Stormy Moreno','Tanner Schmidt','Taran Patel','Tatum Ferguson','Taylor Nichols','Tegan Herrera','Terry Medina','Toby Ryan','Toni Fernandez','Torrance Weaver','Torrey Daniels','Tristen Stephens','Tyler Gardner','Valentine Payne','Vivian Kelley','Wallis Dunn','Winnie Pierce','Wyatt Arnold','Zane Tran','Ainsley Spencer','Anniston Peters','Brooke Hawkins','Brooklyn Grant','Brynn Hansen','Caryl Castro','Cassidy Hoffman','Celestine Hart','Cheyenn Elliott','Fay Cunningham','Genesis Knight','Genesis Bradley','Imani Carroll','Joyce Hudson','Kymber Duncan','Lauri Armstrong','Lesley Berry','Lynn Andrews','Mallor Johnston','Marlee Ray','Paisley Lane','Patsy Riley','Ruby Carpenter','Sayge Perkins','Shannon Aguilar','Stacy Silva','Waverl Richards','Whitney Willis','Jamie Matthews','Morgan Chapman','Michael Lawrence','Taylor Garza','Tracy Vargas','Tracy Watkins','Tracy Wheeler','Tracy Larson','Robin Carlson','Robin Harper','Casper George','Genesis Greene','Drew Burke','Devon Guzman','Bryce Morrison','Leighton Munoz','Brooklyn Jacobs','Dylan Obrien','Sidney Lawson','Hudson Franklin','Evan Lynch','Kirby Bishop','Mischa Carr','Wyatt Salazar','Noah Austin','Remy Mendez','Damaris Gilbert','Yuliana Jensen','Milana Williamson','Galilea Montgomery','Ann Harvey','Anabel Oliver','Payten Howell','Hattie Dean'],
            all_reviews: [
                "Great! Shipping very fast the quality is good. Gave it as a gift for my prod_user, very happy",
                "Excellent  AND My prod_user just love it!",
                "super! prod_user is very satisfied! excellent prod_name. and wonderful prod_store. all quality and very fast. recommend!",
                "Uff super my prod_user was very happy",
                "fast delivery! overall prod_name was very good. thank you prod_store!",
                "impressive. prod_name came 4 days after. very happy. prod_store recomended!",
                "Satisfied customer. Thanks for the prod_store!",
                "Positive experience, fast delivery.",
                "I recommend prod_store. At first prod_name was faulty but prod_store replaced and. At the end it worked just great!",
                "Came faster then I expected. prod_user loves it!!!",
                "Packaging was very good. prod_name came intact. My prod_user was very happy. Thank you prod_store",
                "prod_name looks good. Superb quality and definitely came quickly. Will be using prod_store for my online shopping.",
                "prod_user loves it. prod_name was a good buy! Thanks",
                "EVERYTHING perfect. my prod_user is happy! A+++",
                "very good always buy from you!",
                "arrived fast. perfectly packaged and protected",
                "perfect for prod_demo good size and fair function",
                "very very very good prod_name and I'm very satisfied..... many thanks prod_store good parcel fast shiping.",
                "Fast shipping. prod_user loves it. Item as described and all the mentioned features included. Good packaging with original retail box.",
                "Fast shipping. perfect for prod_demo, convenient and very easy to use. thank you prod_store!",
                "very very very good product and I'm very satisfied..... Thank you prod_store good parcel fast shiping.",
                "very happy. parcel came quickly. recommending the prod_store",
                "Really fast delivery! prod_name works very well. I would highly recommend. Worth the money. As described.",
                "Love it, love it, love it. Thanks prod_store!",
                "Really fast delivery! prod_name works very well. I would highly recommend. Worth the money. As described.",
                "I got the prod_name quickly. will order again from prod_store",
                "Really fast delivery! prod_name works very well. I would highly recommend. Worth the money. As described.",
                "Great product.I ordered this on May 17 and received on May 18!!! Fastest shipping ever!  This product deserves the highest rating out there.",
                "delivery is very fast. package is well packed. instruction is in english and very comprehensive. thank you prod_store",
                "matches the description. fast shipping prod_store recommend",
                "Very satisfied. prod_store was great. recommended",
                "I was skeptical about this prod_name. I ordered it anyway. This prod_name changed my point of view. Very happy with this product. Thank you so much prod_store.",
                "Wow! prod_name was just amazing! Highly recommended!!!",
                "satisfied",
                "Same as in picture, works fine, fast shipping, safely packed.",
                "Very good product and very fast shipping",
                "Superb. got my prod_name and started using it immediately. A must buy",
                "delivery of the month, really good.",
                "all super, it is comparatively fast.",
                "Great product",
                "This thing really does work. I'm shocked. I didn't expect it to, but it did.",
                "This thing is awesome!. Overall is a a great buy coming with an affordable price",
                "Does exactly what it says it would. Would recommend this prod_name.",
                "received the parcel. all. satisfied purchase. thank you very much prod_store :))))",
                "Love it!! I use it almost everyday. Great price and fantastic too. Can't thank you enough prod_store!!!",
                "prod_store was very nice. prod_name was flawless. happy",
                "High quality. Very happy with the service",
                "package was very fast and prod_name works perfectly. it is also cheaper than other stores i checked",
                "got the parcel the delivery din't  that take long. excellent seller. thank you!",
                "prod_name loves this gift. Very useful.",
                "I love this so far. I am still getting the hang of it, but I think I will learn to better use it. I am falling in love with this prod_name. Worth it!",
                " Good product works well if you follow the instructions.",
                "This is my 2nd order. I like these prod_name, the first one had to give to a relative",
                "Awesome prod_name. Well made yet affordable A+A+A+A+",
                "Good product and shipping. Would buy again!",
                "I ordered two! Definitely worth it!",
                "I would purchase this product again.",
                "I bought these for my prod_user. prod_user just love em. Thank you prod_store",
                "Good quality! Great for the price",
                "Cool for prod_demo. Thanks prod_store, would be getting more of these",
                "I am so glad i purchase these. Delivery was 5 days but worth the wait",
                "This is great. A must have definitely. Very useful. Thank you so much seller",
                "Product as expected",
                "Works great!",
                "I was half expecting a cheap little prod_name, but this is good quality and makes me happy and satisfied!",
                "This is perfect. Came quickly and was well packaged. I love it.",
                "Works like it should.",
                "I think this product is very well made. Is does what it should. I feel like it is the perfect size. We just need one for our home. I love the colors the it comes with would recommend",
                "works fantastic thank you so much prod_store for this amazing prod_name",
                "The product is just as described and works great!",
                "Smaller than I thought, BUT, I LOVE this prod_name. Got one for my prod_user too and it’s perfect!",
                "Updating my review, I bought one few months ago and it stopped working, but I loved it. prod_store sent me out a replacement right away. I wasn't expecting that at all great customer service!!!! Really happy with the new one. Thanks!!!",
                "Awesome prod_name! I've been using it now for a few days  it has been performing as advertised. Great price! Thank you prod_store",
                "Wonderful buy. A must have!",
                "A+A+A+A+A+A+A+A+A+A+A+ prod_name works great",
                "Exactly as expected",
                "Excellent product. Will purchase again.",
                "I loved this so much.",
                "I ordered this for my prod_user. Very happy so far but will update my review when we’ve had a it little while.",
                "Simply amazing",
                "works as described has a great price. I would buy again",
                "Just SUPERB. Great BUY",
                "This product is great! Arrived early and in great shape. Very easy to use. Thank you so much prod_store, will order more from you",
                "Excellent product at a excellent price.",
                "It wasn what i was expecting for the price. exceeded my expectations",
                "GREAT PRODUCT WORKS WELL.",
                "Real nice for the price. Works well.",
                "It is wonderful.",
                "Great product. Great seller. Recommended",
                "Love, love, love it. Works great. Thank you prod_store!",
                "Very nice would give more stars if I can",
                "Good as described",
                "A must have in each house. Very recommended product and seller",
                "I was expecting that the delivery would be late, but NO, it came 3 days after I ordered. Packed well. Thank you prod_store",
                "This is exactly what we are looking for. Thank you so much prod_store",
                "Deliver? FAST. Qaulity? GOOD. What else can you ask for?",
                "I've checked several reviews for similar products so far, this prod_name has the best! Thank you prod_store!",
                "Awesome! Just loved it!",
                "Great Buy. Very satisfied with what came",
                "A must have item!"
            ],
            deleteBtn: true,
            generateBtn: true,
            pushBtn: true,

            // for image review
            openModal: false,
            selectedReview: null,
            timeOut: null,
            vendorLink: '',
            aliImage: [],
            reviewImageSelector: [],
            pageScannedStopped: 0
        }
        this.togglePointsAnimation = this.togglePointsAnimation.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    componentDidMount() {
        toastr.options = {
            "progressBar": true,
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "timeOut":5000,
            "extendedTimeOut":0,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        this.setState({ numberOfReviews: Math.round(Math.random() * (50-10) + 10) })

        console.error = (function() {
            var error = console.error
            return function(exception) {
                if ((exception + '').indexOf('Warning: A component is `contentEditable`') != 0) {
                    error.apply(console, arguments)
                }
            }
        })();
    }

    fetchPOST(url, data, cb){
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data
        })
        .then(response => response.json())
        .then(result => {
            cb(result,  this)
        });
    }

    changeNumberOfReview(event){
        if(this.state.all_reviews.length < event.target.value){
            toastr.clear();
            toastr.warning('Number of Reviews cannot exceed more than '+this.state.all_reviews.length,'Too Many Reviews');
        } else {
            this.setState({ numberOfReviews: event.target.value })
        }
    }

    showResults(data, self) {
        var s_result = data;
        ReactDOM.unmountComponentAtNode(document.getElementById('productResult'));
        //document.getElementById('productResult').innerHTML = "";
        var x = [];
        s_result.data.products.edges.forEach((pr,i) => {
            try{
                x.push((
                    <li className="list-group-item search-result" id={pr.node.id.replace("gid://shopify/Product/", "")} onClick={self.selectSearch.bind(self, pr.node.metafield ? pr.node.metafield.value : '', pr.node.onlineStorePreviewUrl)} key={'li'+i} >
                        <img src={pr.node.images.edges.length > 0 ? pr.node.images.edges[0].node.originalSrc : ''} width="40" key={'img'+i} />{pr.node.title}
                    </li>
                ));
            } catch (error) {console.log(error);}
        });
        ReactDOM.render(x, document.getElementById('productResult'));
    }

    selectSearch(vendorLink, productUrl, event) {
        document.getElementById('productSearch').value = document.getElementById(event.target.id).innerText;
        document.getElementById('productId').value = event.target.id;
        ReactDOM.unmountComponentAtNode(document.getElementById('productResult'));
        // document.getElementById('productResult').innerHTML = "";
        this.setState({
            deleteBtn: false,
            generateBtn: false,
            vendorLink: vendorLink,
            selectedProductPreviewURL: productUrl
        })
        // document.querySelector(".generate").disabled = false;
        // document.querySelector(".delete").disabled = false;
        document.querySelector(".delete").style.backgroundColor = "#ff0000";
    }

    handleVendorLinkChange(event){
        this.setState({
            vendorLink: event.target.value
        })
    }

    searchProduct(event) {
        clearTimeout(this.state.timeOut)

        var searchValue = event.target.value;
        var self = this;
        this.setState({
            timeOut: setTimeout(() => {
                if(self.props.session.getCurrentUser.store_url){
                    var data = {
                        queryKey: searchValue,
                        domainlink: self.props.session.getCurrentUser.store_url,
                        store_token:  self.props.session.getCurrentUser.store_token
                    }
                    self.fetchPOST(points.apiServer+'/search', JSON.stringify(data), self.showResults);
                } else {
                    toastr.clear();
                    toastr.warning('Seems like your not connected to your store yet','Connect Your Store');
                    window.toggleConnectModal()
                }
            }, 600)
        })
    }

    randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    createObject(name, reviews, cb){
        var d = new Date();
        var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
        
        var compileData = [];
        for(var i=0; i<name.length; i++){
            var date = this.randomDate((new Date(new Date() - 24000000000)), new Date()).toLocaleDateString('en-US', {month: 'short',day: 'numeric',year: 'numeric'});
            var rating = "";
            var ratingx = Math.floor((Math.random() * 2) + 1);
            if(ratingx == 1){
                rating = "80%";
            } else {
                rating = "100%";
            }
            
            var splitedName = name[i].split(" ")[0]+ " " +name[i].split(" ")[0][1].toUpperCase()+"."
            compileData.push({
                name: splitedName,
                comment: reviews[i],
                rating: rating,
                date: date
            });
        }
        this.setState({
            ObjReviews: compileData
        }, () => {
            cb();
        });
    }

    readAllCustomerReview(reviews) {
        var prod_name = document.getElementById("name").value;
        var prod_user = document.getElementById("user").value;
        var prod_store = document.getElementById("store").value;
        var prod_demo = document.getElementById("demo").value;
  
        var review = [];
        this.state.ObjReviews.forEach((objreview,i) => {
            objreview.comment = objreview.comment.replace(/prod_name/g, prod_name);
            objreview.comment = objreview.comment.replace(/prod_user/g, prod_user);
            objreview.comment = objreview.comment.replace(/prod_store/g, prod_store);
            objreview.comment = objreview.comment.replace(/prod_demo/g, prod_demo);
            review.push(<div className="item-masonry data form_buttons" key={"mansory"+i}>
                    {this.state.aliImage.length != 0 &&
                        this.state.aliImage[i] ?
                            <div className="img-container">
                                <div style={{position: 'relative'}}>
                                    <img className="review-image" src={this.state.aliImage[i]} width="100%" style={{marginBottom: 20}} />
                                    <button className="removeButton" onClick={this.removePictureFromReview.bind(this)}>&times;</button>
                                </div>
                            </div>
                        : <div><button className="btn" style={{float: 'right', padding: 3}} onClick={event => this.toggleSelectImage(event)}>Select Image</button></div>
                    }
                    <div className="grid" key={"grid"+i}>
                        <div className="grid__item one-half" key={"grid__item1"+i}>
                            <div className="name-container" key={"container"+i}>
                                <span className="review-name" key={"name"+i} contentEditable="true">{objreview.name}</span> &nbsp;<span className="fas fa-check-circle"></span> <br />
                                {/* <span className="star-view" key={"star"+i}>
                                    <span className="review-star" style={{width: `${objreview.rating}`}} key={"startwidth"+i}></span>
                                </span> */}
                                {(() => {
                                    if(objreview.rating == "80%"){
                                        return  <ReviewStar rating="4" />
                                    } else {
                                        return  <ReviewStar rating="5" />
                                    }
                                })()}
                                <span className="review-date" contentEditable="true" key={"date"+i}>{objreview.date}</span>
                            </div>
                        </div>
                        <div className="grid__item one-whole" key={"grid__item2"+i}>
                            <div className="customer-comment" key={"feedbackcontainer"+i}>
                                <span className="feedback_comment" contentEditable="true" key={"feedback"+i}>{objreview.comment}</span> 
                            </div>
                        </div>
                    </div>
                </div>)
        });
        ReactDOM.render(review, document.getElementById("review-list"));
        //document.getElementById("review-list")
    }

    getRandom(arr, n) {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
          n=len;
            //throw new RangeError("Kulang ang array");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }

    removePictureFromReview(event){
        ReactDOM.render(<button className="btn" style={{float: 'right', padding: 3}} onClick={event => this.toggleSelectImage(event)}>Select Image</button>, event.target.parentNode.parentNode)
        event.target.parentNode.remove();
    }

    toggleModal(){
        this.setState({
            openModal: !this.state.openModal
        })
    }

    toggleSelectImage(event){
        this.setState({
            selectedReview: event.target
        })
        this.toggleModal();
    }

    generate(event){
        var self = this;
        this.state.vendorLink = ""; // remove when vendor link feedback is available
        if(self.state.vendorLink){
            // var aliexpress_prod_id = this.state.vendorLink.match(/\/[0-9]*[.html]/);
            // if (aliexpress_prod_id != null) {
            //     aliexpress_prod_id = aliexpress_prod_id[0].substring(1, aliexpress_prod_id[0].length - 1);
            // } else {
            //     aliexpress_prod_id = this.state.vendorLink.match(/_[0-9]*[.html]/);
            //     aliexpress_prod_id = aliexpress_prod_id[0].substring(1, aliexpress_prod_id[0].length - 1);
            // }
            var aliexpress_prod_id = this.state.vendorLink.match(/[0-9]*.htm/)
            if(aliexpress_prod_id != null){
                aliexpress_prod_id = aliexpress_prod_id.toString().replace(".htm","");
            }
            var pageIndex = typeof(event) == "number" ? event+1 : 1;
            // var aliApiLink = `https://m.aliexpress.com/ajaxapi/EvaluationSearchAjax.do?type=all&index=${pageIndex}&pageSize=20&productId=${aliexpress_prod_id}`;
            var aliApiLink = `https://m.aliexpress.com/api/products/32862507871/feedbacks?page=1&filter=image&country=US&__amp_source_origin=https://m.aliexpress.com `;
            var postAliApiLink = {
                url: aliApiLink
            }
            self.fetchPOST(points.apiServer+'/alireview', JSON.stringify(postAliApiLink), fetchAliReviewData)
        } else {
            generateObj();
        }

        function fetchAliReviewData(data, self){
            console.log(data, data.evaViewList);
            if(data.evaViewList.length != 0){
                var aliImage = [];
                data.evaViewList.forEach(aliData => {
                    if(aliData.images){
                        aliData.images.forEach(src => {
                            aliImage.push(src)
                        })
                    }
                })
                if(self.state.numberOfReviews > self.state.aliImage.length){
                    self.generate(data.currentPage);
                } else {
                    console.log("done searching image")
                    self.setState({
                        pageScannedStopped: data.currentPage
                    })
                }
                self.setState({
                    aliImage: self.state.aliImage.concat(aliImage),
                    reviewImageSelector: self.state.aliImage.concat(aliImage)
                }, () => {
                    generateObj();
                })
            } else {
                generateObj();
            }
        }

        function generateObj(){
            document.getElementById("cr_title").style.display="block";
            document.querySelectorAll(".removeButton").forEach(el => {
                el.click()
            });
            self.state.ObjReviews = [];
            self.createObject(self.getRandom(self.getRandom(self.state.all_user, self.state.all_user.length), self.state.numberOfReviews), self.getRandom(self.getRandom(self.state.all_reviews, self.state.all_reviews.length), self.state.numberOfReviews), () => {
                self.readAllCustomerReview(self.getRandom(self.state.ObjReviews, self.state.numberOfReviews));
                self.setState({
                    pushBtn: false
                })
            });
        }
    }

    finish(param, event){
        if(this.props.session.getCurrentUser.store_url){
            this.setState({ pushBtn: true, generateBtn: true }, () => {
                if(this.state.pushBtn){
                    if(this.props.session.getCurrentUser.count_addReview < points.limit_addReview){
                        addReview(this);
                    } else if (this.props.session.getCurrentUser.privilege > 1) { // User Privilege
                        addReview(this);
                    } else {
                        toastr.clear();
                        toastr.warning('Seems like you exceed your daily limit to add more review.','Add Review Limit');
                    }
                }
            })
        } else {
            toastr.clear();
            toastr.warning('Seems like your not connected to your store yet','Connect Your Store');
            window.toggleConnectModal()
        }
        function addReview(self){
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.clear();
            toastr.info('Adding Review to product please wait...','Granting Your wish');
            var postReviews = {
                check: true,
                domainlink: self.props.session.getCurrentUser.store_url,
                store_token:  self.props.session.getCurrentUser.store_token
            }
            if(!event){
                self.fetchPOST(points.apiServer+'/update', JSON.stringify(postReviews), self.saveToJSON)
            } else {
                self.fetchPOST(points.apiServer+'/update', JSON.stringify(postReviews), self.deleteReview)
            }
        }
    }
    saveToJSON(msg, self){
        var pushThisReviews = true;
        if(msg.message != undefined){
            if(msg.message != "notheme"){
                pushThisReviews = true;
            } else {
                pushThisReviews = false;
            }
        }
        if(pushThisReviews){
            var totalReview = document.querySelectorAll(".data");
            var review_json = [];
            totalReview.forEach((review, i) => {
                var name = review.querySelector(".review-name").innerText;
                var comment = review.querySelector(".feedback_comment").innerText;
                var date = review.querySelector(".review-date").innerText;
                var src = review.querySelector(".review-image") ? review.querySelector(".review-image").src : '';
                // get all star per review
                var rating = review.querySelectorAll(".star-rating__star.is-selected");
                // get the last active or selected star
                rating = rating[rating.length-1];
                // get the title and get only the count of star and multiply it by 20 (3 * 20 = 60) require result is 20%, 40%, 60%, 80%, 100%
                rating = rating.title.replace(" Star", "") * 20 + "%";
                // old rating selector
                // var rating = review.querySelector(".review-star").style.width;

                review_json.push({
                    "name": name,
                    "comment": comment,
                    "rating": rating,
                    "date": date,
                    "image": src
                });
            });

            var postReview = {
                data: review_json,
                productId: document.getElementById('productId').value,
                domainlink: self.props.session.getCurrentUser.store_url,
                store_token:  self.props.session.getCurrentUser.store_token
            }
            
            self.fetchPOST(points.apiServer+'/review', JSON.stringify(postReview), self.updatePoints)
        } else {
            toastr.clear();
            toastr.options.onclick = () => {
                toastr.clear();
                window.open("https://themm.kartra.com/page/SLo22/?utm_terms=Tony","_blank");
            }
            toastr.warning("We don't see the PLG Theme installed on your store <br> Click here to get your PLG Theme.", "PLG Theme Not Installed!");
            console.log(`<h3>We don\'t see the PLG theme installed on your store</h3><br><a href="https://themm.kartra.com/page/SLo22/?utm_terms=Tony" style="text-align:center;" target="_blank"><h3 style="color:#37bd46">Get your PLG Theme here</h3></a>`);
        }
    }

    updatePoints(data, self){
        var id = self.props.session.getCurrentUser.id;
        var value = points.points_addReview;
        var payload = {"query":`mutation{\n  mutate1: updateCount(id:\"${id}\", increaseWhat: "add_review"){\n    email },\n  \n  mutate2: updateRewardPoints(id:\"${id}\", source: "Add Review", reward_points:${value}){\n    points\n    date\n  }\n}`,"variables":null}
        fetch(points.clientUrl+'/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            self.togglePointsAnimation(value);
            points.playSoundEffect();
            toastr.options.onclick = () => {
                toastr.clear();
                window.open(self.state.selectedProductPreviewURL, '_blank')
            }
            toastr.options.timeOut = 3000;
            toastr.options.extendedTimeOut = 2000;
            toastr.clear();
            toastr.success('Generated Reviews Successfully Uploaded','Add Review Success');
            self.props.refetch();
            self.setState({
                pushBtn: true,
                generateBtn: false
            })
        });
    }

    togglePointsAnimation(pts){
        var rewardPoints = document.getElementById('rewardPoints');
        rewardPoints.innerHTML = `+${pts} points`;
        rewardPoints.classList.add("points-anim")
        setTimeout(function() {
            rewardPoints.classList.toggle("points-anim")
        }.bind(), 4000);
    }

    deleteReview(msg, self){
        var pushThisReviews = true;
        if(msg.message != undefined){
            if(msg.message != "notheme"){
                pushThisReviews = true;
            } else {
                pushThisReviews = false;
            }
        }
        
        if(pushThisReviews){
            var postReview = {
                productId: document.getElementById('productId').value,
                domainlink: self.props.session.getCurrentUser.store_url,
                store_token:  self.props.session.getCurrentUser.store_token
            }
            self.fetchPOST(points.apiServer+'/review-remove', JSON.stringify(postReview), self.deleteSuccess)
        } else {
            toastr.clear();
            toastr.options.onclick = () => {
                toastr.clear();
                window.open("https://themm.kartra.com/page/SLo22/?utm_terms=Tony","_blank");
            }
            toastr.warning("We don't see the PLG Theme installed on your store <br> Click here to get your PLG Theme.", "PLG Theme Not Installed!");
            console.log(`<h3>We don\'t see the PLG theme installed on your store</h3><br><a href="https://themm.kartra.com/page/SLo22/?utm_terms=Tony" style="text-align:center;" target="_blank"><h3 style="color:#37bd46">Get your PLG Theme here</h3></a>`);
        }
    }

    deleteSuccess() {
        toastr.options.timeOut = 3000;
        toastr.options.extendedTimeOut = 2000;
        toastr.clear();
        toastr.success('Generated Reviews Successfully Deleted','Delete Review Success');
    }

    head() {
        return (
            <Helmet bodyAttributes={{ class: "dashboardPage" }}>
                <title>Review Genie - Product List Genie</title>
            </Helmet>
        );
    }

    getBase64(file, type, callback) {
        var canvas=document.getElementById("canvas");
        var ctx=canvas.getContext("2d");
        var maxW = 500;
        var maxH = 500;
        
        var img = new Image;
        img.onload = function() {
            var iw=img.width;
            var ih=img.height;
            var scale=Math.min((maxW/iw),(maxH/ih));
            var iwScaled=iw*scale;
            var ihScaled=ih*scale;
            canvas.width=iwScaled;
            canvas.height=ihScaled;
            ctx.drawImage(img,0,0,iwScaled,ihScaled);
            callback(canvas.toDataURL("image/"+type.replace(".",""),0.5));
        }
        img.src = URL.createObjectURL(file);
    }

    uploadPhoto(event){
        if(event.target.files.length != 0){
            var file = event.target.files[0];
            var fileName = file.name;
            var fileType = fileName.split(".");
            fileType = "."+fileType[fileType.length-1]
            fileName = fileName.replace(fileType, "");
            
            // generate random string from filename
            var text = "";
            for (var i = 0; i < fileName.length; i++){
                text += fileName.charAt(Math.floor(Math.random() * fileName.length));
            }
            text = text.replace(/[^a-zA-Z0-9 ]|\s/g, "");
            fileName = "review_"+text;
            // end random string
    
            var generatedRandomName = fileName+fileType;

            this.getBase64(file, fileType, imgBody => {
                imgBody = imgBody.replace(/data:.+;base64,/,"");
                fetch(points.apiServer+'/upload-review-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        store_name: this.props.session.getCurrentUser.store_url,
                        store_token: this.props.session.getCurrentUser.store_token,
                        imgBody,
                        fileName : generatedRandomName
                    })
                })
                .then((Response) => Response.json())
                .then((res) => {
                    var x = this.state.reviewImageSelector;
                    x.push(res.url);
                    this.setState({
                        reviewImageSelector: x
                    })
                })
                .catch(err => {
                    toastr.clear();
                    toastr.warning("Image can't use as review picture.","Image too large")
                })
            });
        }
    }

    selectImage(event){
        var selectorWhoOpenTheModal = this.state.selectedReview;
        var backgroundImage = event.target.style.backgroundImage.match(/https:\/\/.+"/).toString().replace('\"',"");

        ReactDOM.render(
            <div className="img-container">
                <div style={{position: 'relative'}}>
                    <img className="review-image" src={backgroundImage} width="100%" style={{marginBottom: 20}} />
                    <button className="removeButton" onClick={this.removePictureFromReview.bind(this)}>&times;</button>
                </div>
            </div>
        , selectorWhoOpenTheModal.parentNode)
        this.toggleModal();
    }

    loadMoreImage(event){
        var container = event.target.parentNode;
        var tthis = this;
        ReactDOM.render(<Loading height={100} width={100} />, container, () => {
            request();
        })

        function request(){
            var aliexpress_prod_id = tthis.state.vendorLink.match(/\/[0-9]*[.html]/);
            if (aliexpress_prod_id != null) {
                aliexpress_prod_id = aliexpress_prod_id[0].substring(1, aliexpress_prod_id[0].length - 1);
            } else {
                aliexpress_prod_id = tthis.state.vendorLink.match(/_[0-9]*[.html]/);
                aliexpress_prod_id = aliexpress_prod_id[0].substring(1, aliexpress_prod_id[0].length - 1);
            }
            var pageIndex = tthis.state.pageScannedStopped + 1;
            var aliApiLink = `https://m.aliexpress.com/ajaxapi/EvaluationSearchAjax.do?type=all&index=${pageIndex}&pageSize=20&productId=${aliexpress_prod_id}`;
            var postAliApiLink = {
                url: aliApiLink
            }
    
            tthis.fetchPOST(points.apiServer+'/alireview', JSON.stringify(postAliApiLink), fetchAliReviewData)
        }

        function fetchAliReviewData(data, self){
            if(data.evaViewList.length != 0){
                var aliImage = [];
                data.evaViewList.forEach(aliData => {
                    if(aliData.images){
                        aliData.images.forEach(src => {
                            aliImage.push(src)
                        })
                    }
                })
                self.setState({
                    pageScannedStopped: data.currentPage
                }, () => {
                    if(aliImage.length != 0){
                        self.setState({
                            reviewImageSelector: self.state.reviewImageSelector.concat(aliImage)
                        }, () => {
                            // change the loading to normal button
                            ReactDOM.render(<button className="btn" onClick={newEvent => self.loadMoreImage(newEvent)}>Load More Image</button>, container)
                        })
                    } else {
                        // continue to request until it find some image or no more result
                        console.log("Page: ", data.currentPage, "Still Finding image")
                        request();
                    }
                })
            } else {
                ReactDOM.render(<span style={{fontStyle: 'italic', fontSize: '1.5rem'}}>No More Result</span>, container)
            }
        }
    }

    render() {
        return (
            <div className="grid page-container">
                {this.head()}
                <div className="review-field">
                    <div className="text-center" style={{margin: '30px 30px'}}>
                        <h2>Add Review &nbsp;
                            <Popup
                                trigger={<span className="fas fa-info-circle"></span>}
                                position="bottom center"
                                on="click" className="points-tooltip">
                                <div style={{padding: '5px 20px', overflow: 'hidden' }}>
                                    <div className="text-center">
                                        <h3>How to use Review Genie?</h3>
                                    </div>
                                    <div style={{textAlign: 'left'}}>
                                        <iframe id="how-to-review" src={"https://player.vimeo.com/video/310447245"} width="800" autoPlay="true" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
                                    </div>
                                </div>
                            </Popup>
                        </h2>
                        <div className="form_wrap">
                            <div className="form_row" style={{ margin: 0 }}>
                                <div className="form_item">
                                    <span className="helperText">Please do not change the theme name.</span><br/>
                                    <span className="helperText">This feature is exclusive for PLG theme users.</span>
                                </div>
                            </div>
                        </div>
                        <hr color= '#00e4a5' width='100%'/>
                    </div>
                    <div className="form_wrap updateAccountEmailForm">
                        <div className="form_row">
                            <div className="grid">
                                <div className="column column_8_12 parent-result margBottom">
                                    <div className="form_item">
                                        <div className="form_input">
                                            <input type="text" className="form-control" id="productSearch" style={{width:'100%'}} onKeyUp={this.searchProduct.bind(this)} placeholder="Search product from your store to push reviews" />
                                            <input type="hidden" className="form-control" id="productId" />
                                            <div className="error" id="error-product-id"></div>
                                            <ul className="list-group" id="productResult">
                                            </ul>
                                            <span className="bottom_border"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="column column_4_12 margBottom" >
                                    <div className="form_item">
                                        <div className="form_buttons spacing">
                                            <button className="btn delete" onClick={this.finish.bind(this, 'delete')} disabled={this.state.deleteBtn} style={{width:'100%', padding: '8px 0',backgroundColor: 'red',borderColor: 'red'}}>
                                            Remove Reviews</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="column column_3_12 clear" style={{padding: 12}}>
                                    <label>Number of Reviews: </label>
                                </div>
                                <div className="column column_2_12">
                                    <div className="form_item">
                                        <div className="form_input">
                                            <input type="number" value={this.state.numberOfReviews} onChange={this.changeNumberOfReview.bind(this)} />
                                            <span className="bottom_border"></span>
                                            {/* <select className="display-review-count dropbtn column column_4_12" value={this.state.numberOfReviews} onChange={this.changeNumberOfReview.bind(this)} >
                                                <option value="10">Number of Reviews: 10</option>
                                                <option value="20">Number of Reviews: 20</option>
                                                <option value="30">Number of Reviews: 30</option>
                                                <option value="40">Number of Reviews: 40</option>
                                                <option value="50">Number of Reviews: 50</option>
                                            </select> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="column column_7_12 margBottom">
                                <div className="form_item">
                                    <div className="form_input">
                                        {/* remove comment when vendor link feedback is available */}
                                        {/* <input type="text" className="form-control" id="vendor_link" value={this.state.vendorLink} onChange={this.handleVendorLinkChange.bind(this)} placeholder="Optional for aliexpress link (source for review image)" />
                                        <span className="bottom_border"></span> */}
                                    </div>
                                </div>
                            </div>
                            <div className="column column_6_12 clear">
                                <div className="form_item">
                                    <label>Product Name</label><br />
                                    <div className="form_input">
                                        <input type="text" className="form-control" id="name" style={{width:'100%'}} placeholder="e.g. watch, bag etc." />
                                        <div className="error" id="error1"></div>
                                        <span className="bottom_border"></span>
                                    </div>
                                </div> <br /><br />
                            </div>
                            <div className="column column_6_12">
                                <div className="form_item">
                                    <label>Product Intended for</label><br />
                                    <div className="form_input">
                                        <input type="text" className="form-control" id="user" style={{width:'100%'}} placeholder="e.g. kid, wife, husband etc." />
                                        <div className="error" id="error2"></div>
                                        <span className="bottom_border"></span>
                                    </div>
                                </div> <br /><br />
                            </div>
                            <div className="column column_6_12">
                                <div className="form_item">
                                    <label>Store Name</label><br />
                                    <div className="form_input">
                                        <input type="text" className="form-control" id="store" defaultValue={points.getStoreNameID(this.props.session.getCurrentUser.store_url)} style={{width:'100%'}} placeholder="e.g. yourstore.com, yourstore" />
                                        <div className="error" id="error3"></div>
                                        <span className="bottom_border"></span>
                                    </div>
                                </div> <br /><br />
                            </div>
                            <div className="column column_6_12">
                                <div className="form_item">
                                    <label>Product Demography</label><br />
                                    <div className="form_input">
                                        <input type="text" className="form-control" id="demo" style={{width:'100%'}} placeholder="e.g. mommies, children etc." />
                                        <div className="error" id="error4"></div>
                                        <span className="bottom_border"></span>
                                    </div>
                                </div> <br /><br />
                            </div>
                            <div className="grid" >
                                <div className="column column_6_12 margBottom" >
                                    <div className="form_buttons">
                                        <button className="btn generate" onClick={this.generate.bind(this)} style={{width:'100%'}} disabled={this.state.generateBtn}>Generate Reviews</button>
                                    </div>
                                </div>
                                <div className="column column_6_12 margBottom" >
                                    <div className="form_buttons">
                                        <button className="btn finish" onClick={this.finish.bind(this)} style={{width:'100%'}} disabled={this.state.pushBtn}>Push Reviews To Store</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div id="cr_title" style={{display: 'none', clear: 'both'}}>
                    <h2 className="h1">Reviews</h2>
                    <h4>You can always edit the generated reviews by clicking the review, date, name and rating</h4>
                </div>
                <div className="grid">
                    <div id="review-list" className="masonry">
                    </div>
                </div>
                {(() => {
                    if(this.state.openModal){
                        return (
                            <Modal open={this.state.openModal} closeModal={this.toggleModal}>
                                <div className="text-center center-vertical-parent">
                                    <div style={{display: 'none'}}>
                                        <canvas id="canvas" width="64" height="64"></canvas>
                                    </div>
                                    <div>
                                        <div className="form_buttons float-right" style={{width: 'auto'}}>
                                            <input type="file" name="selectOwnImage" id="selectOwnImage" style={{display: 'none'}} accept="image/x-png,image/gif,image/jpeg" onChange={this.uploadPhoto.bind(this)} />
                                            <label className="btn" htmlFor="selectOwnImage" style={{padding: 5, fontSize: 12}}>Upload Photo</label>
                                        </div>
                                        <h3>Click Image to Select</h3>
                                    </div>
                                    {this.state.reviewImageSelector.length == 0 &&
                                        <div className="center-vertical">
                                            No Image Found.
                                        </div>
                                    }
                                    {this.state.reviewImageSelector.length != 0 &&
                                        <div className="grid" style={{overflow: 'scroll', height: '75vh'}}>
                                            {this.state.reviewImageSelector.map((data,i) => {
                                                return(
                                                    <div className="column column_3_12" key={i}>
                                                        <div className="product-card">
                                                            <div className="product-detial" onClick={event => this.selectImage(event)}>
                                                                <div className="product-tumb" style={{backgroundImage: "url("+data+")", height: 300, cursor: 'pointer', borderRadius: '10px 10px 0 0'}}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div className="form_buttons clear">
                                                <button className="btn" onClick={event => this.loadMoreImage(event)}>Load More Image</button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </Modal>
                        );
                    } else {
                        return null
                    }
                })()}
            </div>
        );
    }
}
export default withAuth(session => session && session.getCurrentUser)(AddReview);