import React from "react";
import { Route, Switch } from "react-router";
import { Redirect } from "react-router-dom";
import withSession from "./hoc/withSession";

import MainLayout from "./layouts/mainLayout";

import Signup from "./pages/auth/signUp";
import SignupFreeViral from "./pages/auth/signupFreeViral";
import Signin from "./pages/auth/signIn";
import ForgotPassword from "./pages/auth/forgotPassword";
import Signout from "./pages/auth/signOut";
import Deshboard from "./pages/dashboard";
import EditProfile from "./pages/auth/editProfile";
import AddStoreTokenURL from "./pages/auth/addStoreTokenURL";
import AddStoreTokenRedirect from "./pages/auth/addStoreTokenRedirect";
import UpdateAccount from "./pages/auth/updateAccount";
import CookiePolicy from "./pages/policiesAndConditions/cookiePolicy";
import PrivacyPolicy from "./pages/policiesAndConditions/privacyPolicy";
import Terms from "./pages/policiesAndConditions/terms";
import FAQ from "./pages/policiesAndConditions/faq";
import User from "./pages/user";
import NotFound from "./pages/404";
import ProductDetails from "./pages/productDetails";
import MyFavorites from "./pages/myFavorites";
import MyCODAffiliate from "./pages/myCodAffiliate";
import AddReview from "./pages/addReview";
import FulfillmentGenie from "./pages/fulfillment";
import FunnelOrders from "./pages/funnelOrders";
import FunnelSubscribers from "./pages/funnelSubscribers";
import CODPayouts from "./pages/codPayouts";
import OrderStatistics from "./pages/orderStatistics";
import FunnelLeads from "./pages/funnelLeads";
import MyFunnelLeads from "./pages/myFunnelLeads";
import Trainings from "./pages/trainings";
import TrainingPages from "./pages/trainingPages";
import FulfillmentUS from "./pages/fulfillmentUS";
// import FulfillmentChina from './pages/fulfillmentChina';
import FulfillmentChinaCreditLogs from "./pages/fulfillmentChinaCreditLogs";
import FulfillmentChinaDev from "./pages/fulfillmentChinaDev";
import Homepage from "./pages/homepage";
import Bundle from "./pages/bundle";
import VideoPlayer from "./pages/videoPlayer";
import Admin from "./pages/admin";
import AdminSettings from "./pages/adminSettings";
import AdminAllReferrer from "./pages/adminAllReferrer";
import AdminCreateAds from "./pages/adminCreateAds";
// import AdminFulfillmentChina from './pages/adminFulfillmentChina';
import AdminFulfillmentChinaDev from "./pages/adminFulfillmentChinaDev";
import AdminFulfillmentRefund from "./pages/adminFulfillmentRefund";
import AdminProductMetafields from "./pages/adminProductMetafields";
import AdminCODStatistics from "./pages/adminCODStatistics";
import AdminCODExports from "./pages/adminCODExports";
import AdminRestorePaid from "./pages/adminRestorePaid";
import AdminManageCODorders from "./pages/adminManageCODorders";
import AdminManageCODProducts from "./pages/adminManageCODProducts";
import AdminManageCODPayouts from "./pages/AdminManageCODPayouts";
import AdminViewCODPayouts from "./pages/adminViewCODPayouts";
import AdminAllOrderWithTracking from "./pages/adminAllProductWithTracking";
import CreateNotififcation from "./pages/createNotification";
import MysteryProduct from "./pages/mysteryProduct";
import SearchProducts from "./components/searchProducts";
import StoreRanking from "./pages/storeRanking";
// import ListEcomStore from './pages/listEcomStore';
import AudienceBuilder from "./pages/audienceBuilder";
import AudienceBuilderPages from "./pages/audienceBuilderPages";
import Niches from "./pages/niches";
import ManageSubscription from "./pages/manageSubscription";
import Integration from "./pages/integration";
import LinkFB from "./pages/linkFB";
import WantHelp from "./pages/wantHelp";
import SalesRepresentative from "./pages/salesRepresentative";
import ShareInvitationLink from "./pages/shareInvitationLink";
import MillionDollarTraining from "./pages/millionDollarTraining";
import CustomPageLoader from "./pages/customPageLoader";
import FreeUserLandingPage from "./pages/freeuserLandingPage";
import MessagingCenter from "./pages/messagingCenter";
import AdminMessagingCenter from "./pages/adminMessagingCenter";
import FunnelGenieMain from "./pages/FunnelGenieMain";
import FunnelGenieMainDEV from "./pages/funnelGenieMainDEV";
import FunnelGeniePages from "./pages/funnelGeniePages";
import FunnelGeniePagesDEV from "./pages/funnelGeniePagesDEV";
import FunnelGenieDEV from "./pages/funnelGenieDEV";
import FunnelGenie from "./pages/funnelGenie";
import ShareFunnel from "./pages/shareFunnel";
import FreeViralProducts from "./pages/freeviralPages/freeViralProducts";
import DropshipCOD from "./pages/dropship_cod/dropshipCOD";
import CarLeads from "./pages/carLeads";
import CarLeadsByUser from "./pages/carLeadsUser";
import CarLeadsAgent from "./pages/carLeadsAgent";
import GenieLeads from "./pages/cargenieleads";
import CashForCar from "./pages/carleadcashforcar";
import GenieMerchantCars from "./pages/carleadsgeniemerchant";
import ButtonGenerator from "./pages/buttonGenerator";
import AcceptInvites from "./pages/acceptInvites";
import AdminPageRanking from "./pages/adminPageRanking";
import Plgproservices from "./pages/plgproservices";
const condition = require("../Global_Conditions");
const points = require("../Global_Values");

const encode = (str) => {
  return new Buffer(str).toString("base64");
};

const Root = ({ refetch, session }) => (
  <Switch>
    <Route
      path="/free-user-landing-page"
      render={(props) => (
        <MainLayout>
          <FreeUserLandingPage {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/signin/:email/:password"
      render={(props) => (
        <MainLayout>
          <Signin {...props} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/signin"
      render={(props) => (
        <MainLayout>
          <Signin {...props} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/account-recovery"
      render={(props) => (
        <MainLayout>
          <ForgotPassword {...props} refetch={refetch} />
        </MainLayout>
      )}
    />
    {/* to handle url param for kartra use */}
    <Route
      path="/signup/kartra/:kartra"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser != null ? (
            <Redirect to="/dashboard" />
          ) : (
            <Signup {...props} refetch={refetch} />
          )}
        </MainLayout>
      )}
    />
    {/* end to handle url param for kartra use */}
    <Route
      path="/signup"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser != null ? (
            <Redirect to="/dashboard" />
          ) : (
            <Signup {...props} refetch={refetch} />
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/accept-invite"
      render={(props) => (
        <MainLayout>
          <AcceptInvites {...props} session={session} />
        </MainLayout>
      )}
    />
    {/* TODO :: Route for the new Sign up Form */}
    <Route
      path="/createaccount"
      render={(props) => (
        <MainLayout>
          <SignupFreeViral {...props} refetch={refetch} session={session} />
        </MainLayout>
      )}
    />
    <Route
      path="/edit-profile"
      render={(props) => (
        <MainLayout>
          <EditProfile {...props} refetch={refetch} session={session} />
        </MainLayout>
      )}
    />
    <Route
      path="/add-token"
      render={(props) => (
        <MainLayout>
          <AddStoreTokenURL {...props} refetch={refetch} session={session} />
        </MainLayout>
      )}
    />
    <Route
      path="/connect-store-success"
      render={(props) => (
        <MainLayout>
          <AddStoreTokenRedirect
            {...props}
            refetch={refetch}
            session={session}
          />
        </MainLayout>
      )}
    />
    <Route
      path="/account"
      render={(props) => (
        <MainLayout>
          <UpdateAccount {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/signout"
      render={(props) => (
        <MainLayout>
          <Signout {...props} />
        </MainLayout>
      )}
    />
    <Route
      path="/profile/:URL_Param"
      render={(props) => (
        <MainLayout>
          <User {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/cancellation-policy"
      render={(props) => (
        <MainLayout>
          <CookiePolicy {...props} />
        </MainLayout>
      )}
    />
    <Route
      path="/privacy-policy"
      render={(props) => (
        <MainLayout>
          <PrivacyPolicy {...props} />
        </MainLayout>
      )}
    />
    <Route
      path="/terms"
      render={(props) => (
        <MainLayout>
          <Terms {...props} />
        </MainLayout>
      )}
    />
    <Route
      path="/faq"
      render={(props) => (
        <MainLayout>
          <FAQ {...props} />
        </MainLayout>
      )}
    />
    <Route
      path="/"
      exact
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser != null
            ? props.history.push("/dashboard")
            : props.history.push("/dashboard")}
        </MainLayout>
      )}
    />

    {/* Recent Added by Jerome */}
    <Route
      path="/product-details"
      render={(props) => (
        <MainLayout>
          <ProductDetails {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/myfavorites"
      render={(props) => (
        <MainLayout>
          <MyFavorites {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/:pass_key/cod-partners"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              props.match.params.pass_key == session.getCurrentUser.pass_key
            ) {
              return props.history.push("/dashboard"); // <MyCODAffiliate {...props} session={session} refetch={refetch} />;
            } else {
              return props.history.push("/dashboard");
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/add-review/:prodid"
      render={(props) => (
        <MainLayout>
          <AddReview {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/fulfillment"
      render={(props) => (
        <MainLayout>
          <FulfillmentGenie {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/us-fulfillment"
      render={(props) => (
        <MainLayout>
          <FulfillmentUS {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/fulfillment-center-genie"
      render={(props) => (
        <MainLayout>
          {/* {(() => {
                    if(session.getCurrentUser && session.getCurrentUser.privilege >= 2){
                        return <FulfillmentChina {...props} session={session} refetch={refetch} />
                    } else {
                        return <Redirect to="/dashboard" />;
                    }
                })()} */}
          <Redirect to="/fulfillment-center-genieV2" />
        </MainLayout>
      )}
    />
    <Route
      path="/fulfillment-center-genie-logs"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege >= 2
            ) {
              return (
                <FulfillmentChinaCreditLogs
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/fulfillment-center-genieV2"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege >= 2
            ) {
              return (
                <FulfillmentChinaDev
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/messaging-center"
      render={(props) => (
        <MainLayout>
          <MessagingCenter {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path={"/dashboard" || "/dashboard/es"}
      render={(props) => (
        <MainLayout>
          <Homepage {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/bundle"
      render={(props) => (
        <MainLayout>
          <Bundle {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/video/:ytid/:obj/"
      render={(props) => (
        <MainLayout>
          <VideoPlayer {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/ranking"
      render={(props) => (
        <MainLayout>
          <StoreRanking {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    {/* <Route path="/list-ecom-store" render={props => (
            <MainLayout>
                <ListEcomStore {...props} session={session} refetch={refetch} />
            </MainLayout>
        )} /> */}
    <Route
      path="/audience-builder/:handle/:title"
      render={(props) => (
        <MainLayout>
          <AudienceBuilderPages
            {...props}
            session={session}
            refetch={refetch}
          />
        </MainLayout>
      )}
    />
    <Route
      path="/audience-builder"
      render={(props) => (
        <MainLayout>
          <AudienceBuilder {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/search-products"
      render={(props) => (
        <MainLayout>
          <SearchProducts {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/collection/:niches"
      render={(props) => (
        <MainLayout>
          <Deshboard {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/collections"
      render={(props) => (
        <MainLayout>
          <Niches {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/manage-subscription"
      render={(props) => (
        <MainLayout>
          <ManageSubscription {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/integrations"
      render={(props) => (
        <MainLayout>
          <Integration {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/link-fb"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser &&
          !session.getCurrentUser.one_time_missions.includes("link_fb") ? (
            <LinkFB {...props} session={session} refetch={refetch} />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/want-help"
      render={(props) => (
        <MainLayout>
          <WantHelp {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/share-invitation-link"
      render={(props) => (
        <MainLayout>
          <ShareInvitationLink {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/million-dollar-training/:video_id"
      render={(props) => (
        <MainLayout>
          <MillionDollarTraining
            {...props}
            session={session}
            refetch={refetch}
          />
        </MainLayout>
      )}
    />
    <Route
      path="/create-ads"
      render={(props) => (
        <MainLayout>
          <AdminCreateAds {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    {/* <Route path="/the-checklist/:ytid/:title" render={props => (
            <MainLayout>
                {(() => {
                    let obj = {
                        title: props.match.params.title,
                        desc: `<div class="text-center"><a href="https://docs.google.com/document/d/1nnjnD8kaE_Tlh4hlmI2nyVhkAUpWop0kCnB2PQuuad0/edit?usp=sharing" target="_blank">Campaign Launch Checklist</a></div>`
                    }
                    let rdir = `/video/${props.match.params.ytid}/${encode(JSON.stringify(obj))}`;
                    return <Redirect to={rdir} />
                })()}
            </MainLayout>
        )} /> */}

    {/* TODO :: Car Leads Route */}
    <Route
      path="/car-leads"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser ? (
            <CarLeads {...props} session={session} refetch={refetch} />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/my-car-leads"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser ? (
            <CarLeadsByUser {...props} session={session} refetch={refetch} />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </MainLayout>
      )}
    />
    {/* TODO :: NEW LINKS */}
    <Route
      path="/agents-car-leads"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser &&
          (session.getCurrentUser.access_tags.includes("car_leads") ||
            session.getCurrentUser.access_tags.includes("agent")) ? (
            <CarLeadsAgent {...props} session={session} refetch={refetch} />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/genie-leads"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser ? (
            <GenieLeads {...props} session={session} refetch={refetch} />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/cash-for-car"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser ? (
            <CashForCar {...props} session={session} refetch={refetch} />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/genie-merchant"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser ? (
            <GenieMerchantCars {...props} session={session} refetch={refetch} />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/sales-representative"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser && session.getCurrentUser.privilege == 5 ? (
            <SalesRepresentative
              {...props}
              session={session}
              refetch={refetch}
            />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/funnel-genie-orders"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser ? (
            <FunnelOrders {...props} session={session} refetch={refetch} />
          ) : (
            props.history.push("/dashboard")
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/funnel-genie-subscribers"
      render={(props) => (
        <MainLayout>
          {condition.has_funnel_subscriber(session.getCurrentUser) ? (
            <FunnelSubscribers {...props} session={session} refetch={refetch} />
          ) : (
            props.history.push("/dashboard")
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/cod-payouts"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser ? (
            <CODPayouts {...props} session={session} refetch={refetch} />
          ) : (
            props.history.push("/dashboard")
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/order-metrics"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser ? (
            <OrderStatistics {...props} session={session} refetch={refetch} />
          ) : (
            props.history.push("/dashboard")
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/funnel-genie-leads"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser ? (
            <FunnelLeads {...props} session={session} refetch={refetch} />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/funnel-leads/:fid/:fName"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser ? (
            <MyFunnelLeads {...props} session={session} refetch={refetch} />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/my-funnel-leads/:fIndex/:fName"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser ? (
            <MyFunnelLeads {...props} session={session} refetch={refetch} />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/trainings"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser ? (
            <Trainings {...props} session={session} refetch={refetch} />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/training/:trainingid"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser ? (
            <TrainingPages {...props} session={session} refetch={refetch} />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/funnel-genie-main"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.access_tags.includes("dev")
            ) {
              return (
                <FunnelGenieMainDEV
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else if (session.getCurrentUser) {
              return (
                <FunnelGenieMain
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return props.history.push("/dashboard");
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/genie-button-generator"
      render={(props) => (
        <MainLayout>
          {session.getCurrentUser &&
          session.getCurrentUser.access_tags.includes("dev") ? (
            <ButtonGenerator {...props} session={session} refetch={refetch} />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </MainLayout>
      )}
    />
    <Route
      path="/funnel-genie-pages-list/:funnel_id"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.access_tags.includes("dev")
            ) {
              return (
                <FunnelGeniePagesDEV
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else if (session.getCurrentUser) {
              return (
                <FunnelGeniePages
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/funnel-genie-pages/:domainIndex/:funnel_name/:funnel_type"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.access_tags.includes("dev")
            ) {
              return (
                <FunnelGeniePagesDEV
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else if (session.getCurrentUser) {
              return (
                <FunnelGeniePages
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    {/* TODO :: Change tommorow */}
    <Route
      path="/funnel-genie"
      render={(props) =>
        session.getCurrentUser &&
        (session.getCurrentUser.access_tags.includes("dev") ||
          session.getCurrentUser.access_tags.includes("xvip")) ? (
          <FunnelGenieDEV {...props} session={session} refetch={refetch} />
        ) : session.getCurrentUser ? (
          <FunnelGenie {...props} session={session} refetch={refetch} />
        ) : (
          <Redirect to="/dashboard" />
        )
      }
    />
    {/* <Route path="/7DayChallenge/:day" render={props => (
            <MainLayout>
                {(() => {
                    let newProps = {
                        ...props,
                        ...session
                    }
                    let joinDate = new Date(parseInt(newProps.getCurrentUser.joinDate));
                    var daysAchieve = points.getCountOfDateDifference(joinDate);
                    if(newProps.getCurrentUser != null && newProps.getCurrentUser.privilege >= 2){
                        daysAchieve = 100;
                    }
                    // if(newProps.match.params.day <= daysAchieve){
                    if(true){
                        return points.sevenDayChallenge.map(day => {
                            if(day.day == newProps.match.params.day){
                                let obj = {
                                    day: newProps.match.params.day,
                                    title: day.title,
                                    desc: day.description
                                }
                                let rdir = `/video/${day.videoID}/${encode(JSON.stringify(obj))}`;
                                return <Redirect to={rdir} key={day.day} />
                            }
                        })
                    } else {
                        return <Redirect to="/dashboard" />;
                    }
                })()}
            </MainLayout>
        )} /> */}
    {/* TODO :: FreeViral Products Route */}
    <Route
      path="/viral-products"
      render={(props) =>
        session.getCurrentUser ? (
          <MainLayout>
            <DropshipCOD {...props} session={session} refetch={refetch} />
          </MainLayout>
        ) : (
          <Redirect to="/dashboard" />
        )
      }
    />
    {/* END OF FVP Routes */}

    {/* TODO :: PLG Pro Services Route */}
    <Route
      path="/plg-pro-services"
      render={(props) =>
        session.getCurrentUser ? (
          <MainLayout>
            <Plgproservices />
          </MainLayout>
        ) : (
          <Redirect to="/dashboard" />
        )
      }
    />
    {/* END OF FVP Routes */}

    {/* Start For Admin Routes */}
    <Route
      path="/training-videos/:content_id"
      render={(props) => (
        <MainLayout>
          <CustomPageLoader {...props} session={session} refetch={refetch} />
        </MainLayout>
      )}
    />
    <Route
      path="/admin"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege >= 6
            ) {
              return <Admin {...props} session={session} refetch={refetch} />;
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-all-paid-order"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege == 10
            ) {
              // User Privilege
              return (
                <AdminAllOrderWithTracking
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-settings"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege == 10
            ) {
              // User Privilege
              return (
                <AdminSettings {...props} session={session} refetch={refetch} />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-all-referrer"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege == 10
            ) {
              // User Privilege
              return (
                <AdminAllReferrer
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-create-notification"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege == 10
            ) {
              // User Privilege
              return (
                <CreateNotififcation
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-mystery-product"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege == 10
            ) {
              // User Privilege
              return (
                <MysteryProduct
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-fulfillment-center-genie"
      render={(props) => (
        <MainLayout>
          <Redirect to="/admin-fulfillment-center-genieV2" />
        </MainLayout>
      )}
    />
    <Route
      path="/admin-fulfillment-center-genieV2"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege == 10
            ) {
              // User Privilege
              return (
                <AdminFulfillmentChinaDev
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-fulfillment-refund"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege == 10
            ) {
              // User Privilege
              return (
                <AdminFulfillmentRefund
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-product-metafields"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege == 10
            ) {
              // User Privilege
              return (
                <AdminProductMetafields
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-cod-statistics"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege == 10
            ) {
              // User Privilege
              return (
                <AdminCODStatistics
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-exports-csv"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege == 10
            ) {
              // User Privilege
              return (
                <AdminCODExports
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-restore-paid"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.access_tags.includes("god")
            ) {
              return (
                <AdminRestorePaid
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-manage-fg-cod-orders"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege == 10
            ) {
              // User Privilege
              return (
                <AdminManageCODorders
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-manage-cod-products"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              (session.getCurrentUser.access_tags.includes("fulfiller") ||
                session.getCurrentUser.privilege == 10)
            ) {
              // User Privilege
              return (
                <AdminManageCODProducts
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-manage-cod-payouts"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege == 10
            ) {
              // User Privilege
              return (
                <AdminManageCODPayouts
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-page-ranking"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege == 10
            ) {
              // User Privilege
              return (
                <AdminPageRanking
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-all-cod-payouts"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege == 10
            ) {
              // User Privilege
              return (
                <AdminViewCODPayouts
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    <Route
      path="/admin-messaging-center"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (
              session.getCurrentUser &&
              session.getCurrentUser.privilege == 10
            ) {
              // User Privilege
              return (
                <AdminMessagingCenter
                  {...props}
                  session={session}
                  refetch={refetch}
                />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    {/* End For Admin Routes */}
    {/* start routes for sharing funnel */}
    <Route
      path="/share-funnel"
      render={(props) => (
        <MainLayout>
          {(() => {
            if (session.getCurrentUser) {
              return (
                <ShareFunnel {...props} session={session} refetch={refetch} />
              );
            } else {
              return <Redirect to="/dashboard" />;
            }
          })()}
        </MainLayout>
      )}
    />
    {/* end routes for sharing funnel */}
    {/* Jerome Ends Here */}

    {/* 404 not found */}
    <Route
      path="/"
      render={(props) => (
        <MainLayout>
          <NotFound {...props} />
        </MainLayout>
      )}
    />
  </Switch>
);
const AppComponent = withSession(Root);

export default AppComponent;
