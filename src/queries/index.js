import { gql } from 'apollo-boost';
/*
    kapag gagamitin ang createGqlResponse ganto dapat payload sa qgl query
    kapag ganto structure
    {
        id
        name
    }
    ay equal to ["id", "name"]
    kapag ganto structure naman
    {
        id
        name {
            firstname
            lastname
        }
    }
    ay equal to ["id", "name", ["firstname", "lastname"]]
    every curly must be inside array
*/
const createGqlResponse = (array, loop) => {
    if (typeof loop == "undefined") loop = 0;
    var spaces = "";
    for (var i = 0; i < loop; i++) spaces += "\t";
    return spaces + "{\n" + array.map(el => {
        if (typeof el == "string") return spaces + "\t" + el;
        else return createGqlResponse(el, loop + 1)
    }).toString().replace(/,/g, "\n") + "\n" + spaces + "}"
}

// TODO :: SIgn up USER Mutation gql-boost

export const SIGNUP_USER = gql`
    mutation($firstName: String!, $lastName: String!, $email: String!, $password: String!, $kartra: String!){
        signupUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password, kartra: $kartra){ token }
    }
`;


export const GET_BUTTON_COUNT = gql`
  query($creator: String!, $search: String){
    getTotalButton(creator: $creator, search: $search){
      count
    }
  }
`;

export const GET_MY_STAFFS = gql`
  query($staffEmail: String!){
    getMyStaffs(staffEmail: $staffEmail){
       id
       firstName
       lastName
       profileImage
       email
       masterIds
       staffIds
    }
  }
`;

export const REMOVE_STAFF = gql`
  mutation($masterId: String!, $staffEmail: String!){
      removeStaff(masterId: $masterId, staffEmail: $staffEmail){
        staffIds
      }
  }
`;

export const ADD_MY_STAFF = gql`
  mutation($masterId: String!, $staffEmail: String! ,$masterEmail: String!){
    addStaff(masterId: $masterId, staffEmail: $staffEmail, masterEmail: $masterEmail){
       id
       firstName
       lastName
       profileImage
       email
       masterIds
       staffIds
    }
  }
`;

export const GET_BUTTONS_USER = gql`
    query($creator: String!, $search: String, $limit: Int, $page: Int){
        getGeneratedButton(creator: $creator, search: $search, limit: $limit, page: $page){
            id
            creator
            amount
            buttonID
            productName
            orderItems
            productDescription
            buttonLabelText
            redirectURI
            buttonTitle
            injectedStyle
            date
            rawButton
        }
    }
`;


export const ADD_GENERATED_BUTTON = gql`
  mutation($productName: String, $productDescription: String, $buttonLabelText: String, $redirectURI: String,$amount: Float,$creator: String!, $buttonTitle: String, $rawButton: String, $injectedStyle: String){
    addGeneratedButton(productName: $productName, productDescription: $productDescription, buttonLabelText: $buttonLabelText,redirectURI: $redirectURI, amount: $amount, creator: $creator, buttonTitle: $buttonTitle, rawButton: $rawButton, injectedStyle: $injectedStyle){
        id
        creator
        amount
        productName
        productDescription
        buttonTitle
        injectedStyle
        date
        rawButton
    }
  }
`;




//July1

// export const GET_FUNNEL_PRODUCTS = params => {
//     return gql`
//         query($id: String, $search: String, $page: Int, $limit: Int, $affiliateEmail: String, $all_inventory: Boolean, $is_active: Boolean, $sortDate: String) {
//             getFunnelProducts(id: $id, search: $search, page: $page, limit: $limit, affiliateEmail: $affiliateEmail, all_inventory: $all_inventory, is_active: $is_active, sortDate: $sortDate)
//             ${params}
//         }
//     `;
// }

export const GET_PAGE_TEMPLATES = params => {
    return gql`
    query($creator: String!){
        getPageTemplates(creator: $creator)
        ${params}
    }
`;
}

// export const ADD_PAGE_TEMPLATES = params => { gql`
// mutation($description: String, $design: String, $screenshot_link: String, $screenshot_link_preview: String, $creator: String!, $type: String){
//     addPageTemplates(description: $description, design: $design, screenshot_link: $screenshot_link, screenshot_link_preview: $screenshot_link_preview, creator: $creator, type: $type)
//     ${params}
// }
// `;
// }
export const ADD_PAGE_TEMPLATES = gql`
mutation($description: String, $design: String, $screenshot_link: String, $screenshot_link_preview: String, $creator: String!, $type: String){
    addPageTemplates( creator: $creator, description: $description, design: $design, screenshot_link: $screenshot_link, screenshot_link_preview: $screenshot_link_preview, type: $type,){
        id
        creator
        description
        design
        screenshot_link
        screenshot_link_preview
        type
        date
    }
}
`;

export const DELETE_PAGE_TEMPLATE = gql`
mutation($id: String){
    deletePageTemplate(id: $id){
        id
        description
        design
        screenshot_link
        screenshot_link_preview
        type
        date
        creator
    }
}
`;



export const UPDATE_PAGE_TEMPLATES = gql`
mutation($id: String, $description: String, $design: String, $screenshot_link: String, $screenshot_link_preview: String, $type: String){
    updatePageTemplate(id: $id, description: $description, design: $design, screenshot_link: $screenshot_link, screenshot_link_preview: $screenshot_link_preview, type: $type,){
        id
        description
        design
        screenshot_link
        screenshot_link_preview
        type
        date
        creator
    }
}
`;

//July1




export const GET_CURRENT_USER = gql`
    query {
        getCurrentUser {
            id
            referralId
            gaId
            fbId
            firstName
            masterIds
            staffIds
            lastName
            joinDate
            lastLoginDate
            email
            fb_link
            kartra
            profileImage
            store_url
            store_token
            password
            store_phone
            store_location_id
            privilege
            user_session_cookie
            count_pushToStore
            count_pushWithBundle
            count_addReview
            count_copyPush
            count_hotProducts
            total_points
            favorites {
                prodid
                handle
                title
                src
                price
            }
            one_time_missions
            kartra_tags
            notification {
                id
                type
                message
                date
                isRead
            }
            date_spin
            sales_rep_id
            invitedBy
            pass_key
            isFulfillmentCenterUnlock
            tos
            isExtended
            allowMultiConnectStore
            recentPaid
            success_rebill
            listOfStore {
                store_token
                store_url
                store_phone
                store_location_id
                active
            }
            plg_balance
            plg_topup_history {
                id
                date_paid
                total_topup
                payerID
                paymentID
                paymentToken
            }
            plg_balance_log {
                date_paid
                total_cost
                description
            }
            fbb_store_id
            pending_stock_id
            funnel_genie_domains
            access_tags
            business_name
            business_email
            account_number
            wire_transfer_number
            bank_code
            routing_number
            account_type
            address
            investment_total
            investment_list {
                amount
                date
            }
            payoneer_details {
                name
                address
                routing_number
                account_number
                account_type
                beneficiary_name
            }
            commerceHQ {
                id
                storeName
                apiKey
                apiPassword
            }
        }
    }
`;

export const EDIT_PROFILE = gql`
    mutation($id: String!, $bio: String!){
        editProfile(id: $id, bio: $bio){
            bio
        }
    }
`;

export const ADD_STORE_TOKEN = gql`
    mutation($id: String!, $store_token: String!, $store_url: String!, $store_phone: String!, $store_location_id: String!){
        addStoreToken(id: $id, store_token: $store_token, store_url: $store_url, store_phone: $store_phone, store_location_id: $store_location_id){
            bio
        }
    }
`;

export const SET_PROFILE_IMAGE = gql`
    mutation($id: String!, $profileImage: String!){
        setProfileIMG(id: $id, profileImage: $profileImage){
            profileImage
        }
    }
`;

export const SIGNIN_USER = gql`
    mutation($email: String!, $password: String!, $cookie: String!){
        signinUser(email: $email, password: $password, user_session_cookie: $cookie){ token }
    }
`;

export const CHANGE_EMAIL = gql`
    mutation($currentid: String!, $newid: String!){
        changeEmail(currentid: $currentEmail, newid: $newEmail){
            email
        }
    }
`;

export const CHANGE_PASSWORD = gql`
    mutation($id: String!, $password: String!){
        changePassword(id: $id, password: $password){
            email
        }
    }
`;

export const RESET_PASSWORD = gql`
    mutation($email: String!){
        passwordReset(email: $email){
            email
        }
    }
`;

export const GET_USER_PROFILE = gql`
    query {
        getUserProfile {
            bio
            profileImage
            total_points
        }
    }
`;

export const GET_ALL_USERS = gql`
    query($sortMessage: String, $fromDate: String, $toDate: String, $search: String, $isEmail: Boolean, $privilege: String, $limit: Int, $offset: Int, $sort: String) {
        getAllUsers: getAllUsers(sortMessage: $sortMessage, fromDate: $fromDate, toDate: $toDate, search: $search, isEmail: $isEmail, privilege: $privilege, limit:$limit, offset:$offset, sort: $sort) {
            id
            privilege
            firstName
            lastName
            email
            dealerId
            user_session_cookie
            kartra
            total_points
            store_url
            store_phone
            total_exprenses
            fb_link
            count
            queryCount
            purchase_dfy
            success_rebill
            joinDate
            lastLoginDate
            help_request_message {
                message
                date_request
                read
                date_read
            }
            sales_rep_id
            sales_rep_date
            sales_rep_notes {
                id
                note
                date_time
            }
            kartra_tags
            isFulfillmentCenterUnlock
            access_tags
            funnel_genie_domains
        },
        getAllSalesPerson: getAllSalesPerson(privilege: 5){
            id
            firstName
            lastName
        }
    }
`;

export const GET_ALL_AFFILIATE = gql`
    query($page: Int, $limit: Int, $email: String) {
        getAllAffiliate(page: $page, limit: $limit, email: $email) {
            id
            count
            firstName
            lastName
            email
            investment_total
            investment_list {
                amount
                date
            }
        }
    }
`;

export const PROFILE_PAGE = gql`
    query($id: String!) {
        profilePage(id: $id) {
            privilege
            firstName
            lastName
            reward_points {
                source
                points
                date
            }
            one_time_missions
            store_token
            bio
            profileImage
            email
            kartra
        }
    }
`;

// Added by Jerome
// Query
export const GET_ADMIN_SETTINGS = gql`
    query{
        getAdminSettings{
            isLive
            liveLink
            million_dollar_training {
                id
                tag
                upsell_link
                vimeo_id
                introduction_title
                introduction_description
            }
            custom_page {
                id
                active
                navigation_name
                description
                img_url
                createdAt
            }
            mystery_product_url
        }
    }
`;
export const GET_COACH_DETAILS = gql`
    query($id: String!) {
        profilePage(id: $id) {
            id
            firstName
            lastName
            bio
            profileImage
            fb_link
        }
    }
`;
export const GET_ALL_REFERRAL = gql`
    query($referralId: String!) {
        getAllReferrals(referralId: $referralId) {
            id
            firstName
            lastName
            joinDate
            privilege
            kartra_tags
            success_rebill
        }
    }
`;
export const GET_ALL_LEADS = gql`
    query($referralId: String!) {
        getAllLeads(referralId: $referralId) {
            name
            date
        }
    }
`;
export const GET_ADMIN_CUSTOM_PAGES = params => {
    return gql`
        query($content_id: String) {
            getAdminSettings(content_id: $content_id)
            ${params}
        }
    `;
}
export const GET_ADMIN_CUSTOM_PAGE_DATA = gql`
    query($panel_id: String) {
        getCustomPageOfPanel(panel_id: $panel_id){
            id
            page_lock_by_tag
            page_lock_by_privilege
            page_tag
            page_icon
            page_name
            page_content
            page_privilege_from
            page_privilege_to
        }
    }
`;
export const ADMIN_GET_DUPLICATE_STORE = gql`
    query {
        getDuplicateConnectedStore{
            store_url
            count
        }
    }
`;
export const GET_ADMIN_PAGE_CONTENT = gql`
    query($content_id: String) {
        getCustomPageData(content_id: $content_id){
            id
            page_lock_by_tag
            page_lock_by_privilege
            page_tag
            page_icon
            page_name
            page_content
            page_privilege_from
            page_privilege_to
        }
    }
`;
export const ADMIN_GET_ALL_REFERRER = gql`
    query {
        getAllReferrer{
            firstName
            lastName
            email
            referralId
            success_rebill
        }
    }
`;
export const GET_ORDERS_CHINA = gql`
    query($id: String, $filter: String!, $offset: Int!, $limit: Int) {
        getChinaOrders(id: $id, filter: $filter, offset: $offset, limit: $limit){
            id
            date_requested
            date_approved
            date_denied
            date_paid
            denied_note
            isRequest
            isApproved
            isDenied
            isPaid
            isFinish
            orders
            shipment_id
            tracking_number

            isRefactored
            isRejected
            isEdited
            order_note
            shipping_information {
                order_number
                company
                address1
                address2
                city
                country
                country_code
                province
                province_code
                zip
                email
                name
                phone
            }
            line_items {
                product_id
                variant_id
                product_name
                variant_name
                quantity
                weight
                chinese_description
                dg_code
                height
                width
                length
                approve_price
                original_price
                vendor_link
                stockid_used
            }
            shipping_cost
            shipping_method
            shipping_days_min
            shipping_days_max
            order_id
        }
    }
`;
export const NEW_GET_ORDERS_CHINA = gql`
    query($id: String, $filter: String!, $offset: Int!, $limit: Int) {
        getNewChinaOrders(id: $id, filter: $filter, offset: $offset, limit: $limit){
            id
            date_requested
            date_approved
            date_denied
            date_paid
            denied_note
            isRequest
            isApproved
            isDenied
            isPaid
            isFinish
            shipment_id
            tracking_number

            isRejected
            isEdited
            order_note
            shipping_information {
                order_number
                company
                address1
                address2
                city
                country
                country_code
                province
                province_code
                zip
                email
                name
                phone
            }
            line_items {
                product_id
                variant_id
                product_name
                variant_name
                quantity
                weight
                chinese_description
                dg_code
                height
                width
                length
                approve_price
                original_price
                vendor_link
                stockid_used
                boxC_product_id
            }
            shipping_cost
            shipping_method
            shipping_days_min
            shipping_days_max
            order_id
            exported
        }
    }
`;
export const GET_ADMIN_ORDERS_CHINA_USERS = gql`
    query($filter: String){
        getAdminChinaOrdersUSERS(filter: $filter){
            id
            email
            firstName
            lastName
            store_url
            store_token
            store_phone
            store_location_id
            profileImage
            hasFulfillmentMessage
            totalRequest
            recentPaid
        }
    }
`;
export const NEW_GET_ADMIN_ORDERS_CHINA_USERS = gql`
    query($filter: String){
        getAdminNewChinaOrdersUSERS(filter: $filter){
            id
            email
            firstName
            lastName
            store_url
            store_token
            store_phone
            store_location_id
            profileImage
            hasFulfillmentMessage
            totalRequest
            recentPaid
            plg_balance
            fbb_store_id
            pending_stock_id
        }
    }
`;
export const GET_PAID_ORDER = gql`
    query($id: String!){
        getPaidOrders(id: $id){
            id
            isVerified
            trackingNumberAvailable
            date_paid
            total_payment
            store_url
            store_token
            store_location_id
            orders
            trackingNumbers
            is_packed

            isRefactored
            order_ids
        }
    }
`;
export const GET_INDIVIDUAL_PAID_ORDER = gql`
    query($id: String!, $orderid: String){
        getPaidOrder(id: $id, orderid: $orderid){
            id
            date_requested
            date_approved
            date_denied
            date_paid
            denied_note
            isRequest
            isApproved
            isDenied
            isPaid
            isFinish
            orders
            shipment_id
            tracking_number

            isRefactored
            isRejected
            isEdited
            order_note
            shipping_information {
                order_number
                company
                address1
                address2
                city
                country
                country_code
                province
                province_code
                zip
                email
                name
                phone
            }
            line_items {
                line_item_id
                product_id
                variant_id
                product_name
                variant_name
                quantity
                weight
                chinese_description
                dg_code
                height
                width
                length
                approve_price
                original_price
                vendor_link
            }
            shipping_cost
            shipping_method
            shipping_days_min
            shipping_days_max
            shipping_service
            order_id
        }
    }
`;
export const GET_FULFILLMENT_CENTER_MESSAGE = gql`
    query($id: String){
        getFulfillmentCenterMessage(id: $id){
            id
            seen
            newChatCount
            messages {
                date
                text
                from
                isFromQuote
                isFromBulkQuote

                default_chinese_description
                default_weight
                default_dg_code
                default_dimension_height
                default_dimension_width
                default_dimension_length
                default_price
            }
        }
    }
`;
export const GET_FULFILLMENT_CENTER_MESSAGE_COUNT = gql`
    query($id: String){
        getCountOfAllMessage(id: $id){
            count
        }
    }
`;
export const GET_PAYPAL_PAYMENT_LOGS = gql`
    query($id: String){
        getpaypalPaymentLogs(id: $id){
            id
            summary
            parent_payment
            update_time
            total_amount
            amount_currency
            create_time
            clearing_time
            state
        }
    }
`;
export const GET_APPROVED_FOR_FULFILLMENT_USER = gql`
    query($search: String){
        getApprovedUser(search: $search){
            id
            firstName
            lastName
            store_url
            store_token
            store_phone
            profileImage
            hasFulfillmentMessage
        }
    }
`;
export const GET_ALL_PAID_ORDER = gql`
    query {
        getAllPaidOrder {
            id
            date_requested
            date_approved
            date_denied
            date_paid
            denied_note
            isRequest
            isApproved
            isDenied
            isPaid
            isFinish
            orders
            shipment_id
            tracking_number

            isRefactored
            isRejected
            isEdited
            order_note
            shipping_information {
                order_number
                company
                address1
                address2
                city
                country
                country_code
                province
                province_code
                zip
                email
                name
                phone
            }
            line_items {
                product_id
                variant_id
                product_name
                variant_name
                quantity
                weight
                chinese_description
                dg_code
                height
                width
                length
                approve_price
                original_price
                vendor_link
            }
            shipping_cost
            shipping_method
            shipping_days_min
            shipping_days_max
            order_id
        }
    }
`;
export const GET_BULK_QUOTE = gql`
    query($id: String!, $isPaid: Boolean!){
        getVirtualInventory(id: $id, isPaid: $isPaid){
            id
            stockid
            chinese_description
            name
            qty
            dimension_height
            dimension_width
            dimension_length
            dg_code
            weight
            price
            vendor_link
            isPaid
        }
    }
`;
export const GET_TOPUP_LOGS = gql`
    query($id: String!, $limit: Int!, $offset: Int){
        getTopupLogs(id: $id, limit: $limit, offset: $offset){
            id
            date_paid
            total_topup
            payerID
            paymentID
            paymentToken
        }
    }
`;
export const GET_TOPUP_LOGS_COUNT = gql`
    query($id: String!){
        getTopupLogsCount(id: $id){
            count
        }
    }
`;
export const GET_CREDIT_LOGS = gql`
    query($id: String!, $limit: Int!, $offset: Int){
        getCreditLogs(id: $id, limit: $limit, offset: $offset){
            id
            date_paid
            total_cost
            description
            increase
        }
    }
`;
export const GET_CREDIT_LOGS_COUNT = gql`
    query($id: String!){
        getCreditLogsCount(id: $id){
            count
        }
    }
`;
export const NEW_GET_BULK_REQUEST = gql`
    query($id: String){
        getBulkRequest(id: $id){
            id
            chinese_description
            product_name
            variants {
                variant_id
                variant_name
                original_price
                approve_price
                dg_code
                quantity
                boxc_product_id
            }
            boxc_inbound_id
            isFinish
        }
    }
`;
export const GET_ORDER_COUNT = gql`
    query($id: String!, $filter: String!){
        getOrderCount(id: $id, filter: $filter){
            count
        }
    }
`;

export const GET_USER_FUNNEL_GENIE_LIST = gql`
    query($id: String!, $domainIndex: Int, $funnel_name: String){
        getUserFunnelGenie(id: $id, domainIndex: $domainIndex, funnel_name: $funnel_name){
            id
            domainIndex
            funnel_name
            page_type
            path
            design {
                date
                publish
                json
                screenshotURL
            }
            split_design
            split_bias
            split_screenshot
            split_notes
            pageID
            funnel_type
            funnel_phone
            funnel_email
            funnel_address
            facebook_id
            funnel_ga
            funnel_fga
            funnel_stripe_public
            funnel_stripe_private
            page_title
            page_description
            page_og_image_link
            page_keyword
            isRoot
        }
    }
`;

export const GET_USER_FUNNEL_NAME_LIST = gql`
    query($id: String!, $funnel_name: String, $searchFunnel: String){
        getUserFunnelGenie(id: $id, funnel_name: $funnel_name, searchFunnel: $searchFunnel){
            ids
            design {
                date
            }
            funnel_object {
                funnel_name
                domainIndex
            }
            sendPLGEmailConfirmation
            sendPLGEmailAbandonment
            funnel_type
            funnel_phone
            funnel_isWhatsApp
            funnel_email
            funnel_address
            funnel_selected_merchant
            funnel_stripe_public
            funnel_stripe_private
            funnel_other
            favicon_link
            facebook_id
            google_id
            tiktok_id
            snapchat_id
            paypalClientID
            count
            confirmationEmail
            abandonmentEmail
            trackingEmail
        }
    }
`;

export const GET_ALL_FUNNEL = params => {
    return gql`
        query($id: String!, $funnel_name: String, $searchFunnel: String, $limit: Int, $page: Int){
            getUserFunnelGenie(id: $id, funnel_name: $funnel_name, searchFunnel: $searchFunnel, limit: $limit, page: $page)
            ${params}
        }
    `;
}

export const GET_ALL_FUNNEL_PAGES = params => {
    return gql`
        query($id: String!, $domainIndex: Int, $funnel_name: String, $limit: Int, $page: Int){
            getUserFunnelGenie(id: $id, domainIndex: $domainIndex, funnel_name: $funnel_name, limit: $limit, page: $page)
            ${params}
        }
    `;
}

export const GET_FUNNEL_PAGES = params => {
    return gql`
        query($id: String!, $domainIndex: Int, $funnel_name: String, $limit: Int){
            getFunnelPages(id: $id, domainIndex: $domainIndex, funnel_name: $funnel_name, limit: $limit)
            ${params}
        }
    `;
}

export const GET_FUNNEL_PAGE = params => {
    return gql`
        query($id: String!){
            getPageOfFunnelGenie(id: $id)
            ${params}
        }
    `;
}

export const SEARCH_USERS = gql`
    query($search: String!, $filter: String){
        getSearchedUsers(search: $search, filter: $filter){
            id
            firstName
            lastName
            email
            kartra
            plg_balance
            store_url
            funnel_genie_domains
        }
    }
`;
export const GET_TOTAL_TOPUP = gql`
    query {
        getTotalTopup {
            count
        }
    }
`;
export const GET_MY_INTEGRATIONS = gql`
    query($id: String!, $merchant_type: String) {
        getMyIntegrations(id: $id, merchant_type: $merchant_type) {
            id
            merchant_type
            merchant_name
            public_key
            private_key
            other
        }
    }
`;
export const GET_FUNNEL_ORDERS = params => {
    return gql`
        query($plgbuttonID: String, $id: String, $orderid: String, $merchant_type: String, $paid_cc: Boolean,$has_pod: Boolean, $order_status: String, $funnel_id: String, $funnel_name: String, $domainIndex: Int, $filterByStartDate: String, $filterByEndDate: String, $skip: Int, $limit: Int, $fulfillerLocation: String, $sortBy: String, $variantIDS: String, $serial_numbers: String, $isPaidCommision: Boolean, $cod_analytics: Boolean, $returning_items: Boolean, $tracking_courier: String, $show_courier_collected: String, $campaign_src: String) {
            getMyFunnelOrders(plgbuttonID: $plgbuttonID, id: $id, orderid: $orderid, merchant_type: $merchant_type, paid_cc: $paid_cc, has_pod: $has_pod, order_status: $order_status, funnel_id: $funnel_id, funnel_name: $funnel_name, domainIndex: $domainIndex, filterByStartDate: $filterByStartDate, filterByEndDate: $filterByEndDate, skip: $skip, limit: $limit, fulfillerLocation: $fulfillerLocation, sortBy: $sortBy, variantIDS: $variantIDS, serial_numbers: $serial_numbers, isPaidCommision: $isPaidCommision, cod_analytics: $cod_analytics, returning_items: $returning_items, tracking_courier: $tracking_courier, show_courier_collected: $show_courier_collected, campaign_src: $campaign_src)
            ${params}
        }
    `;
}
export const GET_FUNNEL_SUBSCRIBERS = params => {
    return gql`
        query($id: String, $page: Int, $limit: Int) {
            getMyFunnelSubscribers(id: $id, page: $page, limit: $limit)
            ${params}
        }
    `;
}
export const GET_FUNNEL_ORDER_CREATOR_LIST = gql`
    query($userEmail: String, $order_status: String, $fulfillerLocation: String, $dateStart: String, $dateEnd: String, $page: Int, $show_vip: Boolean) {
        getMyFunnelOrderCreatorList(userEmail: $userEmail, order_status: $order_status, fulfillerLocation: $fulfillerLocation, dateStart: $dateStart, dateEnd: $dateEnd, page: $page, show_vip: $show_vip) {
            count
            creator
            ids
            order_date
            order_status_update
            on_hold
            order_status
            userData
        }
    }
`;
export const GET_COMMISSION_CREATOR_LIST = gql`
    query($userEmail: String, $fulfillerLocation: String, $dateStart: String, $dateEnd: String, $page: Int) {
        getMyCommissionCreatorList(userEmail: $userEmail, fulfillerLocation: $fulfillerLocation, dateStart: $dateStart, dateEnd: $dateEnd, page: $page) {
            count
            totalPayout
            creator
            userData
        }
    }
`;
export const GET_FUNNEL_ORDER_COST = gql`
    query($variantID: String, $filterByStartDate: String, $filterByEndDate: String) {
        getFunnelOrderCost(variantID: $variantID, filterByStartDate: $filterByStartDate, filterByEndDate: $filterByEndDate) {
            jsonStr
        }
    }
`;

export const GET_SHARED_FUNNEL = gql`
    query($id: String!, $funnel_name: String!, $funnel_id: String, $loadLastDesign: Boolean){
        getSharedFunnel(id: $id, funnel_name: $funnel_name, funnel_id: $funnel_id, loadLastDesign: $loadLastDesign){
            id
            funnel_name
            page_type
            funnel_type
            path
            design {
                date
                publish
                json
                screenshotURL
                screenshot_url
            }
        }
    }
`;
export const GET_ONLY_FUNNEL_FROM_ORDERS = gql`
    query($creator: String!){
        getOnlyFunnelFromOrders(creator: $creator){
            funnel_object {
                funnel_id
                funnel_name
                domainIndex
            }
        }
    }
`;
export const GET_EMAIL_SMS_INTEGRATION = gql`
    query($funnelSource: String!, $messageType: String!){
        getFunnelEmailAndSMSIntegration(funnelSource: $funnelSource, messageType: $messageType){
            id
            funnelSource
            delay
            messageType
            method
            emailSubject
            editorValue
            messageID
        }
    }
`;
export const GET_FUNNEL_LEADS_META_DATA = gql`
    query($creator: String!, $leads_id: String!){
        getLeadsMetaData(creator: $creator, leads_id: $leads_id){
            id
            leads_id
            meta_tag
            meta_note
        }
    }
`;
export const GET_EMAIL_SEQUENCE = gql`
    query($creator: String!, $funnelSource: String!){
        getEmailSequence(creator: $creator, funnelSource: $funnelSource){
            id
            creator
            funnelSource
            sequence_name
            sequence_tags
            content {
                id
                delay
                messageType
                emailSubject
                editorValue
            }
            return_sequence_id
        }
    }
`;
export const GET_MY_FUNNEL_ORDER_TOTAL_SALES = gql`
    query($creator: String!, $page_ids: String, $dateFrom: String, $dateTo: String, $timezoneOffset: Int, $merchant_type: String,  $showShopifyOnly: Boolean){
        getMyFunnelOrderTotalSales(creator: $creator, page_ids: $page_ids, dateFrom: $dateFrom, dateTo: $dateTo, timezoneOffset: $timezoneOffset, merchant_type: $merchant_type, showShopifyOnly: $showShopifyOnly){
            count
            count_order
            total_cod
            dates {
                count
                date
                count_order
                total_cod
                total_delivered
                total_not_delivered
            }
        }
    }
`;
export const GET_MY_TOP_PRODUCT_SALES = gql`
    query($creator: String!, $page_ids: String, $dateFrom: String, $dateTo: String, $merchant_type: String, $showShopifyOnly: Boolean){
        getTopProducts(creator: $creator, page_ids: $page_ids, dateFrom: $dateFrom, dateTo: $dateTo, merchant_type: $merchant_type, showShopifyOnly: $showShopifyOnly){
            jsonStr
        }
    }
`;
export const GET_USERS_OF_FUNNEL_ORDERS = gql`
    query($search_user: String) {
        getUsersOfFunnelOrders(search_user: $search_user) {
            id
            firstName
            lastName
            email
            store_url
            access_tags
            funnel_genie_domains
        }
    }
`;
export const GET_TOTAL_FUNNEL_PRODUCTS = gql`
    query {
        getTotalFunnelProducts {
            count
        }
    }
`;
export const GET_FUNNEL_PRODUCTS = params => {
    return gql`
        query($id: String, $search: String, $page: Int, $limit: Int, $affiliateEmail: String, $all_inventory: Boolean, $is_active: Boolean, $sortDate: String) {
            getFunnelProducts(id: $id, search: $search, page: $page, limit: $limit, affiliateEmail: $affiliateEmail, all_inventory: $all_inventory, is_active: $is_active, sortDate: $sortDate)
            ${params}
        }
    `;
}
export const GET_FUNNEL_PRODUCT_DESIGN = params => {
    return gql`
        query($id: String, $product_id: String) {
            getFunnelProductDesign(id: $id, product_id: $product_id)
            ${params}
        }
    `;
}
export const GET_PURCHASE_ORDER = params => {
    return gql`
        query($affiliate_email: String, $product_variant_id: String, $isApproved: Boolean, $status: String, $low_inventory: Boolean, $page: Int, $limit: Int){
            getPurchaseOrders(affiliate_email: $affiliate_email, product_variant_id: $product_variant_id, isApproved: $isApproved, status: $status, low_inventory: $low_inventory, page: $page, limit: $limit)
            ${params}
        }
    `;
}
export const GET_MY_PAY_CHECK = gql`
    query($creator: String, $userPrivilege: Int, $fulfillerLocation: String, $order_status: String, $dateStart: String, $dateEnd: String, $isAdminPayout: Boolean, $isAdminPayoutCollectedRange: Boolean, $on_hold: Boolean,  $showShopifyOnly: Boolean){
        getMyPayCheck(creator: $creator, userPrivilege: $userPrivilege, fulfillerLocation: $fulfillerLocation, order_status: $order_status, dateStart: $dateStart, dateEnd: $dateEnd, isAdminPayout: $isAdminPayout, isAdminPayoutCollectedRange: $isAdminPayoutCollectedRange, on_hold: $on_hold, showShopifyOnly: $showShopifyOnly){
            count
            dates {
              count
              date
            }
        }
    }
`;
export const GET_MY_COMMISION_PAY_CHECK = gql`
    query($serial_numbers: String, $order_status: String, $dateStart: String, $dateEnd: String, $isPaidCommision: Boolean){
        getMyCommissionPayCheck(serial_numbers: $serial_numbers, order_status: $order_status, dateStart: $dateStart, dateEnd: $dateEnd, isPaidCommision: $isPaidCommision){
            count
            dates {
              count
              date
            }
        }
    }
`;
export const GET_ORDER_LINK = gql`
    query($id: String!){
        getOrderLink(id: $id){
            link
        }
    }
`;
// start new funnel query
export const GET_FUNNEL_COUNT = gql`
    query($creator: String!, $search: String){
        getTotalFunnel(creator: $creator, search: $search) {
            count
        }
    }
`;
export const GET_FUNNEL_LIST = params => {
    return gql`
        query($creator: String!, $search: String, $limit: Int, $page: Int, $show_page_count: Boolean){
            getFunnelList(creator: $creator, search: $search, limit: $limit, page: $page, show_page_count: $show_page_count)
            ${params}
        }
    `;
}
export const GET_FUNNEL_BY_ID = params => {
    return gql`
        query($funnel_id: String!){
            getFunnelById(funnel_id: $funnel_id)
            ${params}
        }
    `;
}
export const GET_FUNNEL_PAGE_LIST = params => {
    return gql`
        query($funnel_id: String!, $page_id: String, $page: Int, $loadLastDesign: Boolean, $page_type: String, $not_in_page_type: String){
            getFunnelPageList(funnel_id: $funnel_id, page_id: $page_id, page: $page, loadLastDesign: $loadLastDesign, page_type: $page_type, not_in_page_type: $not_in_page_type)
            ${params}
        }
    `;
}
export const GET_FUNNEL_PAGE_BY_ID = params => {
    return gql`
        query($page_id: String!, $loadLastDesign: Boolean, $include_funnel_setting: Boolean){
            getFunnelPageById(page_id: $page_id, loadLastDesign: $loadLastDesign, include_funnel_setting: $include_funnel_setting)
            ${params}
        }
    `;
}
export const GET_FUNNEL_EMAIL_SEQUENCEV1 = params => {
    return gql`
        query($funnel_id: String!, $message_type: String){
            getFunnelEmailSequenceV1(funnel_id: $funnel_id, message_type: $message_type)
            ${params}
        }
    `;
}
export const GET_FUNNEL_EMAIL_SEQUENCEV2 = params => {
    return gql`
        query($funnel_id: String!){
            getFunnelEmailSequenceV2(funnel_id: $funnel_id)
            ${params}
        }
    `;
}
// end new funnel query

// start cod statistics
export const GET_SERIAL_NUMBER_STATUS_COUNT = gql`
    query($serial_numbers: String!, $order_status: String!) {
        getSerialNumberStatusCount(serial_numbers: $serial_numbers, order_status: $order_status) {
            count
        }
    }
`;
export const GET_COD_TOTAL_ORDER_PER_COUNTRY = gql`
    query($dateStart: String, $dateEnd: String, $location: String, $creator: String) {
        getCODtotalOrderPerCountry(dateStart: $dateStart, dateEnd: $dateEnd, location: $location, creator: $creator) {
            jsonStr
        }
    }
`;
export const GET_COD_ORDER_STATUS_RATES_PER_COUNTRY = gql`
    query($dateStart: String, $dateEnd: String, $location: String, $creator: String) {
        getCODOrderStatusRatesPerCountry(dateStart: $dateStart, dateEnd: $dateEnd, location: $location, creator: $creator) {
            jsonStr
        }
    }
`;
export const GET_ORDER_METRICS = gql`
    query($creator: String, $funnel_id: String, $merchant_type: String, $dateStart: String, $dateEnd: String, $location: String, $showShopifyOnly: Boolean) {
        getOrderMetrics(creator: $creator, funnel_id: $funnel_id, merchant_type: $merchant_type, dateStart: $dateStart, dateEnd: $dateEnd, location: $location, showShopifyOnly: $showShopifyOnly) {
            jsonStr
        }
    }
`;
export const GET_ORDER_STATUS_RATES_PER_COUNTRY = gql`
    query($creator: String!, $dateStart: String, $dateEnd: String, $location: String, $summary: Boolean) {
        getOrderStatusRatesPerCountry(creator: $creator, dateStart: $dateStart, dateEnd: $dateEnd, location: $location, summary: $summary) {
            jsonStr
        }
    }
`;
export const GET_COD_ORDER_PRODUCT_COST = gql`
    query($costBy: String, $location: String, $dateStart: String, $dateEnd: String, $creator: String) {
        getCODOrderProductCost(costBy: $costBy, location: $location, dateStart: $dateStart, dateEnd: $dateEnd, creator: $creator) {
            jsonStr
        }
    }
`;
export const GET_ALL_TIME_BUYERS_COUNT = gql`
    query($location: String!) {
        getAllTimeBuyersCount(location: $location) {
            count
        }
    }
`;
export const GET_PLG_PAYCHECK = gql`
    query($location: String, $dateStart: String, $dateEnd: String) {
        getPLGPaycheck(location: $location, dateStart: $dateStart, dateEnd: $dateEnd) {
            jsonStr
        }
    }
`;
// end cod statistics
export const GET_MESSAGES_COUNT = gql`
    query($user_id: String!, $is_admin: Boolean){
        getMessageCount(user_id: $user_id, is_admin: $is_admin) {
            unread_count
        }
    }
`;
export const GET_MESSAGES = params => {
    return gql`
        query($id: String, $user_id: String, $search_user: String, $unread: Boolean, $view_list: Boolean, $is_admin: Boolean, $limit: Int){
            getMessages(id: $id, user_id: $user_id, search_user: $search_user, unread: $unread, view_list: $view_list, is_admin: $is_admin, limit: $limit)
            ${params}
        }
    `;
}
export const GET_USER_BY_ID = params => {
    return gql`
        query($id: String!){
            getUserById(id: $id)
            ${params}
        }
    `;
}
export const GET_SEARCHED_USERS = params => {
    return gql`
        query($sortMessage: String, $fromDate: String, $toDate: String, $search: String, $isEmail: Boolean, $privilege: String, $limit: Int, $offset: Int, $sort: String) {
            getAllUsers(sortMessage: $sortMessage, fromDate: $fromDate, toDate: $toDate, search: $search, isEmail: $isEmail, privilege: $privilege, limit:$limit, offset:$offset, sort: $sort)
            ${params}
        }
    `;
}
// Mutation
export const ADD_FAVORITE = gql`
    mutation($id: String!, $prodid: String!, $favorites: String!, $title: String!, $src: String!, $price: String!){
        addFavorite(id: $id, prodid: $prodid, favorites: $favorites, title: $title, src: $src, price: $price){
            email
            favorites{
                title
            }
        }
    }
`;
export const REMOVE_FAVORITE = gql`
    mutation($id: String!, $prodid: String!){
        removeFavorite(id: $id, prodid: $prodid){
            email
        }
    }
`;
export const REQUEST_HELP = gql`
    mutation($id: String!, $message: String!, $read: Boolean!){
        requestHelp(id: $id, message: $message, read: $read){
            message
        }
    }
`;
// TODO :: Add DealerID
export const ADD_DEALER_ID = gql`
    mutation($id: String!, $dealerId: String!){
        addDealerId(id: $id, dealerId: $dealerId){        
            dealerId
        }
    }
`;


export const SET_SALES_REP = gql`
    mutation($id: String!, $sales_rep_id: String!){
        setSalesRep(id: $id, sales_rep_id: $sales_rep_id){
            id
        }
    }
`;
export const UPDATE_MD_TRAINING = gql`
    mutation($id: String!, $tag: String, $upsell_link: String!, $title: String!, $description: String!, $vimeo_id: Int!){
        updateTraining(id: $id, tag: $tag, upsell_link: $upsell_link, title: $title, description: $description, vimeo_id: $vimeo_id){
            id
        }
    }
`;
export const DELETE_MD_TRAINING = gql`
    mutation($id: String!){
        deleteTraining(id: $id){
            id
        }
    }
`;
export const PUSH_NOTIFICATION = gql`
    mutation($id: String, $email: String, $sendTo: String, $type: String!, $message: String){
        pushNotification(id: $id, email: $email, sendTo: $sendTo, type: $type, message: $message){
            notification {
                type
                message
                date
            }
        }
    }
`;
export const READ_ALL_NOTIFICATION = gql`
    mutation($id: String!){
        readAllNotification(id: $id){
            id
        }
    }
`;
export const REMOVE_NOTIFICATION = gql`
    mutation($id: String!, $notifId: String!){
        removeNotification(id: $id, notifId: $notifId){
            id
        }
    }
`;
export const UPDATE_MYSTERY_PRODUCT = gql`
    mutation($mp_url: String!){
        updateMysteryProduct(mp_url: $mp_url){
            mystery_product_url
        }
    }
`;
export const SAVE_GA_OR_FB_ID = gql`
    mutation($id: String!, $gaId: String, $fbId: String){
        updateGAandFBid(id: $id, gaId: $gaId, fbId: $fbId){
            id
        }
    }
`;
export const ADMIN_ADD_PANEL = gql`
    mutation($panel_name: String!, $panel_type: String!, $panel_description: String!, $panel_img_url: String!){
        addPanel(panel_name: $panel_name, panel_type: $panel_type, panel_description: $panel_description, panel_img_url: $panel_img_url){
            navigation_name
            description
        }
    }
`;
export const ADMIN_DELETE_PANEL = gql`
    mutation($id: String!){
        deletePanel(id: $id){
            id
        }
    }
`;
export const ADMIN_EDIT_PANEL = gql`
    mutation($id: String!, $panel_name: String!, $panel_type: String!, $panel_description: String!, $panel_img_url: String!){
        editPanel(id: $id, panel_name: $panel_name, panel_type: $panel_type, panel_description: $panel_description, panel_img_url: $panel_img_url){
            id
            navigation_name
            description
        }
    }
`;
export const ADMIN_ENABLE_PANEL = gql`
    mutation($id: String!, $active: Boolean!){
        enablePanel(id: $id, active: $active){
            active
        }
    }
`;
export const ADMIN_SAVE_SECTION = gql`
    mutation($id: String!, $page_lock_by_tag: Boolean!, $page_lock_by_privilege: Boolean!, $page_icon: String!, $page_name: String!, $page_content: String!, $page_tag: String, $page_privilege_from: Int, $page_privilege_to: Int){
        saveSection(id: $id, page_lock_by_tag: $page_lock_by_tag, page_lock_by_privilege: $page_lock_by_privilege, page_icon: $page_icon, page_name: $page_name, page_content: $page_content, page_tag: $page_tag, page_privilege_from: $page_privilege_from, page_privilege_to: $page_privilege_to){
            page_name
            page_content
        }
    }
`;
export const ADMIN_EDIT_SECTION = gql`
    mutation($id: String!, $page_lock_by_tag: Boolean!, $page_lock_by_privilege: Boolean!, $page_icon: String!, $page_name: String!, $page_content: String!, $page_tag: String, $page_privilege_from: Int, $page_privilege_to: Int){
        editSection(id: $id, page_lock_by_tag: $page_lock_by_tag, page_lock_by_privilege: $page_lock_by_privilege, page_icon: $page_icon, page_name: $page_name, page_content: $page_content, page_tag: $page_tag, page_privilege_from: $page_privilege_from, page_privilege_to: $page_privilege_to){
            page_name
            page_content
        }
    }
`;
export const ADMIN_DELETE_SECTION = gql`
    mutation($id: String!){
        deleteSection(id: $id){
            page_name
            page_content
        }
    }
`;
export const UPDATE_KARTRA_EMAIL = gql`
    mutation($id: String!, $kartra: String!){
        updateKartraEmail(id: $id, kartra: $kartra){
            id
            kartra
        }
    }
`;
export const MANUAL_RESET_PASSWORD = gql`
mutation($id: String!){
    manualResetPassword(id: $id){
        id
        email
    }
}
`;
export const UPDATE_PRIVILEGE = gql`
    mutation($id: String!, $privilege: Int!){
        updatePrivilege(id: $id, privilege: $privilege){
            id
            privilege
        }
    }
`;
export const UPDATE_EMAIL = gql`
    mutation($id: String!, $new_email: String!){
        updateEmail(id: $id, new_email: $new_email){
            id
            email
        }
    }
`;
export const REQUEST_ORDERS = gql`
    mutation($id: String!, $orders: String!){
        requestOrders(id: $id, orders: $orders){
            id
        }
    }
`;
export const NEW_REQUEST_ORDERS = gql`
    mutation($id: String!, $orders: String!){
        requestNewOrders(id: $id, orders: $orders){
            id
        }
    }
`;
export const DECIDE_ORDER = gql`
    mutation($id: String!, $decision: String!, $denied_note: String){
        decideOrder(id: $id, decision: $decision, denied_note: $denied_note){
            id
        }
    }
`;
export const NEW_DECIDE_ORDER = gql`
    mutation($userid: String, $id: String!, $decision: String!, $denied_note: String, $ids: String){
        decideNewOrder(userid: $userid, id: $id, decision: $decision, denied_note: $denied_note, ids: $ids){
            id
        }
    }
`;
export const UPDATE_ORDERS = gql`
    mutation($orders: String!, $isWeight: Boolean!, $service: String){
        updateRequestedOrder(orders: $orders, isWeight: $isWeight, service: $service){
            id
        }
    }
`;
export const SEND_PAYMENT = gql`
    mutation($id: String!, $store_url: String!, $store_token: String!, $total_payment: String!){
        sendPayment(id: $id, store_url: $store_url, store_token: $store_token, total_payment: $total_payment){
            id
        }
    }
`;
export const UPDATE_FULFILLMENT_CENTER_ACCESS = gql`
    mutation($id: String!, $access: Boolean!){
        fulfillmentCenterAccess(id: $id, access: $access){
            id
        }
    }
`;
export const CANCEL_REQUEST = gql`
    mutation($id: String!, $orderid: String!, $isRefactored: Boolean){
        cancelRequest(id: $id, orderid: $orderid, isRefactored: $isRefactored){
            id
        }
    }
`;
export const NEW_CANCEL_REQUEST = gql`
    mutation($id: String!, $orderid: String!){
        cancelNewRequest(id: $id, orderid: $orderid){
            id
        }
    }
`;
export const SUBMIT_FULFILLMENT_CENTER_MESSAGE = gql`
    mutation($id: String!, $text: String!, $from: String!, $isFromQuote: Boolean, $isFromBulkQuote: Boolean, $defaults: String){
        submitFulfillmentCenterMessage(id: $id, text: $text, from: $from, isFromQuote: $isFromQuote, isFromBulkQuote: $isFromBulkQuote, defaults: $defaults){
            id
        }
    }
`;
export const MARK_ORDER_AS_PAID = gql`
    mutation($id: String!, $store_url: String!, $store_token: String!, $store_location_id: String!){
        markAsPaid(id: $id, store_url: $store_url, store_token: $store_token, store_location_id: $store_location_id){
            id
        }
    }
`;
export const MARK_ORDER_AS_PACKED = gql`
    mutation($paidID: String!, $orderID: String!, $shouldSave: Boolean!){
        markAsPacked(paidID: $paidID, orderID: $orderID, shouldSave: $shouldSave){
            id
        }
    }
`;
export const ACCEPT_TOS = gql`
    mutation($id: String!){
        acceptTOS(id: $id){
            id
        }
    }
`;
export const EXTEND_MORE_DAYS = gql`
    mutation($id: String!){
        extendMoreDays(id: $id){
            id
        }
    }
`;
export const REFACTOR_UPDATE_ORDERS = gql`
    mutation($id: String!, $approve_price: String, $variant_id: String!, $isWeight: Boolean!, $dimension: String, $service: String, $quantity: Int, $stockid: String){
        refactorUpdateRequestedOrder(id: $id, approve_price: $approve_price, variant_id: $variant_id, isWeight: $isWeight, dimension: $dimension, service: $service, quantity: $quantity, stockid: $stockid){
            id
        }
    }
`;
export const NEW_UPDATE_ORDERS = gql`
    mutation($id: String!, $approve_price: String!, $quantity: Int!, $variant_id: String!, $dg_code: String!, $chinese_description: String!){
        updateNewRequestedOrder(id: $id, approve_price: $approve_price, quantity: $quantity, variant_id: $variant_id, dg_code: $dg_code, chinese_description: $chinese_description){
            id
        }
    }
`;
export const ADMIN_CHANGE_HOMEPAGE_VIDEO = gql`
    mutation($id: String!, $url: String, $message: String, $from: String!){
        changeHomepageVideo(id: $id, url: $url, message: $message, from: $from){
            id
        }
    }
`;
export const PLG_TOPUP = gql`
    mutation($id: String!, $total_topup: Float!, $payerID: String!, $paymentID: String!, $paymentToken: String!, $pass_key: String!){
        onTopupSuccess(id: $id, total_topup: $total_topup, payerID: $payerID, paymentID: $paymentID, paymentToken: $paymentToken, pass_key: $pass_key){
            plg_balance
        }
    }
`;
export const REDUCE_FULFILLMENT_CREDIT = gql`
    mutation($id: String!, $cost: Float!, $description: String){
        reduceCredits(id: $id, cost: $cost, description: $description){
            plg_balance
        }
    }
`;
export const ADD_TRACKING_NUMBER = gql`
    mutation($id: String!, $tracking_number: String!){
        addTrackingNumber(id: $id, tracking_number: $tracking_number){
            id
            order_id
            line_items {
                line_item_id
                product_id
                variant_id
                product_name
                variant_name
                quantity
                weight
                chinese_description
                dg_code
                height
                width
                length
                approve_price
                original_price
                vendor_link
                stockid_used
            }
        }
    }
`;
export const REQUEST_BULK_INVENTORY = gql`
    mutation($id: String!, $requestedProduct: String!){
        requestBulkInventory(id: $id, requestedProduct: $requestedProduct){
            id
        }
    }
`;
export const UPDATE_VIRTUAL_WAREHOUSE = gql`
    mutation($id: String!, $approve_price: String, $variant_id: String, $dg_code: String, $chinese_description: String, $boxc_product_id: String, $isFinish: Boolean, $object_id: String){
        updateVirtualWarehouse(id: $id, approve_price: $approve_price, variant_id: $variant_id, dg_code: $dg_code, chinese_description: $chinese_description, boxc_product_id: $boxc_product_id, isFinish: $isFinish, object_id: $object_id){
            id
        }
    }
`;
export const SAVE_FUNNEL_GENIE_CREDENTIAL = gql`
    mutation($id: String, $design_id: String, $domain_or_subdomain: String, $funnel_name: String, $funnel_type: String, $page_type: String, $path: String, $design: String, $pageID: String, $isPath: Boolean, $domainIndex: Int, $screenshotURL: String, $templateUse: String, $funnelType: String, $enableLoader: Boolean, $isPublish: Boolean, $isSplitEdit: Boolean, $selectedModalAction: String){
        saveFunnelGenieCredential(id: $id, design_id: $design_id, domain_or_subdomain: $domain_or_subdomain, funnel_name: $funnel_name, funnel_type: $funnel_type, page_type: $page_type, path: $path, design: $design, pageID: $pageID, isPath: $isPath, domainIndex: $domainIndex, screenshotURL: $screenshotURL, templateUse: $templateUse, funnelType: $funnelType, enableLoader: $enableLoader, isPublish: $isPublish, isSplitEdit: $isSplitEdit, selectedModalAction: $selectedModalAction){
            id
        }
    }
`;
export const PUSH_TO_FUNNEL = gql`
    mutation($id: String!, $domainIndex: Int!, $funnel_name: String!, $funnel_templates: String!, $offer_link: String, $isCOD: Boolean){
        pushToFunnel(id: $id, domainIndex: $domainIndex, funnel_name: $funnel_name, funnel_templates: $funnel_templates, offer_link: $offer_link, isCOD: $isCOD){
            id
        }
    }
`;
export const DUPLICATE_FUNNEL = gql`
    mutation($id: String, $funnel_name: String, $domainIndex: Int){
        duplicateFunnel(id: $id, funnel_name: $funnel_name, domainIndex: $domainIndex){
            id
        }
    }
`;
export const DELETE_FUNNEL_PAGE = gql`
    mutation($id: String!){
        deleteFunnelPage(id: $id){
            id
        }
    }
`;
export const UPDATE_FUNNEL_SETTING = gql`
    mutation($id: String, $creator: String!, $funnel_name: String!, $domainIndex: Int!, $changeDomainIndexTo: Int, $changeDomainNameTo: String, $changeFunnelNameTo: String, $changePageNameTo: String, $funnel_phone: String, $funnel_isWhatsApp: Boolean, $funnel_email: String, $funnel_address: String, $funnel_pixelID: String, $funnel_ga: String, $funnel_fga: String, $funnel_selected_merchant: String, $funnel_stripe_public: String, $funnel_stripe_private: String, $funnel_other: String, $paypalClientID: String, $page_title: String, $page_description: String, $page_og_image_link: String, $page_keyword: String, $confirmationEmail: String, $abandonmentEmail: String, $trackingEmail: String, $favicon_link: String, $facebook_id: String, $google_id: String, $tiktok_id: String, $snapchat_id: String, $sendPLGEmailConfirmation: Boolean, $sendPLGEmailAbandonment: Boolean){
        updateFunnelSetting(id: $id, creator: $creator, funnel_name: $funnel_name, domainIndex: $domainIndex, changeDomainIndexTo: $changeDomainIndexTo, changeDomainNameTo: $changeDomainNameTo, changeFunnelNameTo: $changeFunnelNameTo, changePageNameTo: $changePageNameTo, funnel_phone: $funnel_phone, funnel_isWhatsApp: $funnel_isWhatsApp, funnel_email: $funnel_email, funnel_address: $funnel_address, funnel_pixelID: $funnel_pixelID, funnel_ga: $funnel_ga, funnel_fga: $funnel_fga, funnel_selected_merchant: $funnel_selected_merchant, funnel_stripe_public: $funnel_stripe_public, funnel_stripe_private: $funnel_stripe_private, funnel_other: $funnel_other, paypalClientID: $paypalClientID, page_title: $page_title, page_description: $page_description, page_og_image_link: $page_og_image_link, page_keyword: $page_keyword, confirmationEmail: $confirmationEmail, abandonmentEmail: $abandonmentEmail, trackingEmail: $trackingEmail, favicon_link: $favicon_link, facebook_id: $facebook_id, google_id: $google_id, tiktok_id: $tiktok_id, snapchat_id: $snapchat_id, sendPLGEmailConfirmation: $sendPLGEmailConfirmation, sendPLGEmailAbandonment: $sendPLGEmailAbandonment){
            id
        }
    }
`;
export const DELETE_FUNNEL = gql`
    mutation($creator: String!, $funnel_name: String!, $domainIndex: Int!){
        deleteFunnel(creator: $creator, funnel_name: $funnel_name, domainIndex: $domainIndex){
            id
        }
    }
`;
export const MARK_AS_EXPORTED = gql`
    mutation($ids: String!){
        markAsExported(ids: $ids){
            id
        }
    }
`;
export const UPDATE_FUNNEL_GENIE_ACCESS = gql`
    mutation($id: String!, $access: Boolean!){
        funnelGenieAccess(id: $id, access: $access){
            id
        }
    }
`;
export const SET_AS_DEFAULT_DOMAIN = gql`
    mutation($id: String!, $domain: String!, $domainIndex: Int!, $funnel_name: String!, $path: String!){
        setAsDefaultDomain(id: $id, domain: $domain, domainIndex: $domainIndex, funnel_name: $funnel_name, path: $path){
            id
        }
    }
`;
export const SAVE_OR_UPDATE_INTEGRATION = gql`
    mutation($id: String!, $integrationID: String, $merchant_type: String!, $merchant_name: String!, $public_key: String, $private_key: String!, $other: String){
        saveORupdateIntegration(id: $id, integrationID: $integrationID, merchant_type: $merchant_type, merchant_name: $merchant_name, public_key: $public_key, private_key: $private_key, other: $other){
            id
        }
    }
`;
export const DELETE_INTEGRATION = gql`
    mutation($id: String!){
        deleteIntegration(id: $id){
            id
        }
    }
`;
export const UPDATE_FUNNEL_ORDER_SHIPPING_INFORMATION = gql`
    mutation($orderIds: String!, $phone: String, $street1: String, $street2: String, $city: String, $state: String, $zip: String, $country: String, $address_type: String, $aptOffice: String, $bldgVilla: String, $nearestLandmark: String, $received_payment_from_courier: Boolean, $updaterID: String!, $updaterName: String!){
        updateMyFunnelOrderShippingInformation(orderIds: $orderIds, phone: $phone, street1: $street1, street2: $street2, city: $city, state: $state, zip: $zip, country: $country, address_type: $address_type, aptOffice: $aptOffice, bldgVilla: $bldgVilla, nearestLandmark: $nearestLandmark, received_payment_from_courier: $received_payment_from_courier, updaterID: $updaterID, updaterName: $updaterName){
            id
        }
    }
`;
export const UPDATE_FUNNEL_ORDERS = gql`
    mutation($id: String!, $merchant_type: String, $orderCreator: String!, $orderEmail: String!, $sync_from: String, $safeArrivalID: String, $tracking_number: String, $domains: String, $client_tracking: Boolean, $sendPLGTrackingEmail: Boolean!, $cancel_note: String, $order_status: String, $country: String, $updaterID: String, $updaterName: String, $dateStatusDelivered: String, $productID: String, $variantSku: String, $variantQty: Int, $variantPrice: Float, $variantTitle: String, $variantName: String, $fulfillerLocation: String, $onlyUpdateThisLineItem: Boolean, $newVariantName: String, $shopify_order_number: String){
        updateMyFunnelOrders(id: $id, merchant_type: $merchant_type, orderCreator: $orderCreator, orderEmail: $orderEmail, sync_from: $sync_from, safeArrivalID: $safeArrivalID, tracking_number: $tracking_number, domains: $domains, client_tracking: $client_tracking, sendPLGTrackingEmail: $sendPLGTrackingEmail, cancel_note: $cancel_note, order_status: $order_status, country: $country, updaterID: $updaterID, updaterName: $updaterName, dateStatusDelivered: $dateStatusDelivered, productID: $productID, variantSku: $variantSku, variantQty: $variantQty, variantPrice: $variantPrice, variantTitle: $variantTitle, variantName: $variantName, fulfillerLocation: $fulfillerLocation, onlyUpdateThisLineItem: $onlyUpdateThisLineItem, newVariantName: $newVariantName, shopify_order_number: $shopify_order_number){
            id
        }
    }
`;
export const BULK_UPDATE_FUNNEL_ORDERS = gql`
    mutation($array: String!){
        bulkUpdateMyFunnelOrders(array: $array){
            id
        }
    }
`;
export const CANCEL_FUNNEL_ORDERS = gql`
    mutation($id: String!, $orderCreator: String!){
        cancelMyFunnelOrders(id: $id, orderCreator: $orderCreator){
            id
        }
    }
`;
export const ARCHIVE_FUNNEL_ORDERS = gql`
    mutation($id: String!, $orderCreator: String!){
        archiveMyFunnelOrders(id: $id, orderCreator: $orderCreator){
            id
        }
    }
`;
export const SAVE_SHARED_FUNNEL = gql`
    mutation($creator: String!, $domainIndex: Int!, $funnel_name: String!, $selectedPages: String!){
        saveSharedFunnel(creator: $creator, domainIndex: $domainIndex, funnel_name: $funnel_name, selectedPages: $selectedPages){
            id
        }
    }
`;
export const SAVE_EMAIL_SMS_INTEGRATION = gql`
    mutation($id: String, $creator: String, $messageID: String, $funnelSource: String, $messageType: String, $method: String, $delay: String, $emailSubject: String, $editorValue: String){
        saveFunnelEmailAndSMSintegration(id: $id, creator: $creator, messageID: $messageID, funnelSource: $funnelSource, messageType: $messageType, method: $method, delay: $delay, emailSubject: $emailSubject, editorValue: $editorValue){
            id
        }
    }
`;
export const SAVE_FUNNEL_LEADS_META_DATA = gql`
    mutation($id: String, $creator: String, $leads_id: String, $meta_tag: String, $meta_note: String){
        saveLeadsMetaData(id: $id, creator: $creator, leads_id: $leads_id, meta_tag: $meta_tag, meta_note: $meta_note){
            id
        }
    }
`;
export const SAVE_EMAIL_SEQUENCE = gql`
    mutation($id: String, $creator: String, $funnelSource: String, $sequence_name: String, $sequence_tags: String, $content_id: String, $delay: String, $messageType: String, $emailSubject: String, $asid: String, $atkn: String, $sender: String, $editorValue: String, $addContent: Boolean, $remove_content: Boolean, $removeData: Boolean, $return_sequence_id: String){
        saveEmailSequence(id: $id, creator: $creator, funnelSource: $funnelSource, sequence_name: $sequence_name, sequence_tags: $sequence_tags, content_id: $content_id, delay: $delay, messageType: $messageType, emailSubject: $emailSubject, asid: $asid, atkn: $atkn, sender: $sender, editorValue: $editorValue, addContent: $addContent, remove_content: $remove_content, removeData: $removeData, return_sequence_id: $return_sequence_id){
            id
        }
    }
`;
export const SAVE_EMAIL_SEQUENCE_TEMPLATE = gql`
    mutation($creator: String, $funnelSource: String, $sequence_name: String, $sequence_tags: String, $content: String){
        saveEmailSequenceTemplate(creator: $creator, funnelSource: $funnelSource, sequence_name: $sequence_name, sequence_tags: $sequence_tags, content: $content){
            id
        }
    }
`;
export const SAVE_FUNNEL_SPLIT_PAGE = gql`
    mutation($id: String, $json: String, $screenshotURL: String, $action: String){
        saveSplitPageData(id: $id, json: $json, screenshotURL: $screenshotURL, action: $action){
            id
        }
    }
`;
export const UPDATE_FUNNEL_SPLIT_PAGE = gql`
    mutation($id: String, $bias: Int, $split_notes: String){
        updateSplitPage(id: $id, bias: $bias, split_notes: $split_notes){
            id
        }
    }
`;
// TODO :: Payoneer Query 
export const SAVE_PAYONEER_SETTINGS = gql`
    mutation($id: String!,$beneficiary_name: String!, $address: String!,$routing_number: String!, $account_type: String!, $account_number: String!, $name: String!) {
        addPayoneerDetails(id: $id,beneficiary_name: $beneficiary_name,routing_number: $routing_number, address: $address, account_type: $account_type, account_number: $account_number, name: $name) {
            id
        }
    }
`;

export const SAVE_PAYMENT_SETTINGS = gql`
    mutation($id: String!, $business_email: String, $business_name: String, $account_number: String, $wire_transfer_number: String, $bank_code: String, $routing_number: String, $account_type: String, $address: String) {
        savePaymentSettings(id: $id, business_email: $business_email, business_name: $business_name, account_number: $account_number, wire_transfer_number: $wire_transfer_number, bank_code: $bank_code, routing_number: $routing_number, account_type: $account_type, address: $address) {
            id
        }
    }
`;
export const DISCONNECT_FUNNEL_DOMAIN = gql`
    mutation($id: String!, $domain: String) {
        disconnectFunnelDomain(id: $id, domain: $domain) {
            id
        }
    }
`;
export const SAVE_FUNNEL_PRODUCTS = gql`
    mutation($id: String, $lastEditedByID: String, $lastEditedByName: String, $productName: String, $productCost: Float, $productSku: String, $productSrp: Float, $productDeliveryCost: Float, $productFivePercentDuty: Float, $fulfillmentCost: Float, $affiliateEmail: String, $affiliateCost: Float, $yabazoo: Float, $prevFunnelDesign: String, $funnelDesign: String, $is_active: Boolean) {
        saveFunnelProduct(id: $id, lastEditedByID: $lastEditedByID, lastEditedByName: $lastEditedByName, productName: $productName, productCost: $productCost, productSku: $productSku, productSrp: $productSrp, productDeliveryCost: $productDeliveryCost, productFivePercentDuty: $productFivePercentDuty, fulfillmentCost: $fulfillmentCost, affiliateEmail: $affiliateEmail, affiliateCost: $affiliateCost, yabazoo: $yabazoo, prevFunnelDesign: $prevFunnelDesign, funnelDesign: $funnelDesign, is_active: $is_active) {
            id
        }
    }
`;
export const DELETE_FUNNEL_PRODUCTS = gql`
    mutation($id: String, $funnelDesign: String) {
        deleteFunnelProduct(id: $id, funnelDesign: $funnelDesign) {
            id
        }
    }
`;
export const SAVE_DESIGN_OR_GROUP_NAME = gql`
    mutation($id: String, $product_id: String, $group_name: String, $design: String) {
        saveDesignOrGroupName(id: $id, product_id: $product_id, group_name: $group_name, design: $design) {
            id
        }
    }
`;
export const DELELETE_DESIGN_OR_GROUP = gql`
    mutation($id: String!, $design_id: String) {
        deleteDesignOrGroup(id: $id, design_id: $design_id) {
            id
        }
    }
`;
export const SAVE_PURCHASE_ORDER = gql`
    mutation($id: String, $action: String, $receiver_email: String, $product_name: String, $product_variant_id: String, $payment_terms: String, $affiliate_email: String, $affiliate_budget: Float, $affiliate_commision: Float, $product_price: Float, $product_quantity: Int, $po_vendor: String, $po_ship_to: String, $po_note: String, $product_srp: Float, $fulfillment_cost: Float, $delivery_cost: Float, $vat: Float, $yabazoo: Float, $additional_cost: Float, $warnWhenLow: Boolean, $warnEmail: String, $confirmationEmail: String, $warnQty: Int, $fromTransferPOID: String) {
        savePurchaseOrder(id: $id, action: $action, receiver_email: $receiver_email, product_name: $product_name, product_variant_id: $product_variant_id, payment_terms: $payment_terms, affiliate_email: $affiliate_email, affiliate_budget: $affiliate_budget, affiliate_commision: $affiliate_commision, product_price: $product_price, product_quantity: $product_quantity, po_vendor: $po_vendor, po_ship_to: $po_ship_to, po_note: $po_note, product_srp: $product_srp, fulfillment_cost: $fulfillment_cost, delivery_cost: $delivery_cost, vat: $vat, yabazoo: $yabazoo, additional_cost: $additional_cost, warnWhenLow: $warnWhenLow, warnEmail: $warnEmail, confirmationEmail: $confirmationEmail, warnQty: $warnQty, fromTransferPOID: $fromTransferPOID) {
            id
            affiliate_name
        }
    }
`;
export const DELETE_FUNNEL_ORDER = gql`
    mutation($id: String) {
        deleteFunnelOrder(id: $id) {
            id
        }
    }
`;
export const CHANGE_ITEM_STATUS = gql`
    mutation($id: String, $status: String) {
        changeItemStatus(id: $id, status: $status) {
            id
        }
    }
`;
export const SAVE_INVESTMENT = gql`
    mutation($id: String!, $amount: Float!) {
        saveInvestment(id: $id, amount: $amount) {
            id
        }
    }
`;
export const ASSIGN_SERIAL_NUMBER_TO_ORDER = gql`
    mutation($id: String!, $qty: Int!, $plg_sku: String!) {
        assignSerialNumberToOrder(id: $id, qty: $qty, plg_sku: $plg_sku) {
            id
        }
    }
`;
export const MARK_ALL_AS_PAID = gql`
    mutation($creator: String!, $updaterID: String!, $updaterName: String!, $fulfillerLocation: String, $totalPayment: String!, $dateStart: String, $dateEnd: String, $isCommission: Boolean) {
        markAllAsPaid(creator: $creator, updaterID: $updaterID, updaterName: $updaterName, fulfillerLocation: $fulfillerLocation, totalPayment: $totalPayment, dateStart: $dateStart, dateEnd: $dateEnd, isCommission: $isCommission) {
            id
        }
    }
`;
export const MARK_ALL_COMMISSION_AS_PAID = gql`
    mutation($serialNumbers: String!, $total_commission: String, $start_date: String, $end_date: String, $commissioner_name: String) {
        markAllCommissionAsPaid(serialNumbers: $serialNumbers, total_commission: $total_commission, start_date: $start_date, end_date: $end_date, commissioner_name: $commissioner_name) {
            id
        }
    }
`;

// start new funnel mutation
export const DUPLICATE_FUNNELGENIE = gql`
    mutation($creator: String!, $funnel_id: String!){
        duplicateFunnelGenie(creator: $creator, funnel_id: $funnel_id){
            id
        }
    }
`;
export const REMOVE_FUNNELGENIE = gql`
    mutation($funnel_id: String!){
        removeFunnelGenie(funnel_id: $funnel_id){
            id
        }
    }
`;
export const UPDATE_FUNNELGENIE_SETTING = gql`
    mutation($funnel_id: String!, $funnel_name: String, $funnel_currency: String, $domain_name: String, $funnel_use_email_confirmation: Boolean, $funnel_use_email_tracking: Boolean, $funnel_use_email_abandonment: Boolean, $funnel_is_phone_whatsapp: Boolean, $funnel_phone: String, $funnel_enable_floating_bar: Boolean, $funnel_enable_floating_bar_link: String, $funnel_address: String, $funnel_email: String, $funnel_favicon_link: String, $funnel_facebook_id: String, $funnel_facebook_access_token: String, $funnel_google_id: String, $funnel_tiktok_id: String, $funnel_everflow: Boolean, $funnel_snapchat_id: String, $gateway_selected_merchant: String, $gateway_stripe_public: String, $gateway_stripe_private: String, $gateway_other: String, $gateway_paypal_client_id: String, $integration_confirmation_email: String, $integration_abandonment_email: String, $integration_tracking_email: String, $integration_onhold_email: String, $is_fulfill_by_plg: Boolean){
        updateFunnelGenieSetting(funnel_id: $funnel_id, funnel_name: $funnel_name, funnel_currency: $funnel_currency, domain_name: $domain_name, funnel_use_email_confirmation: $funnel_use_email_confirmation,, funnel_use_email_tracking: $funnel_use_email_tracking funnel_use_email_abandonment: $funnel_use_email_abandonment, funnel_is_phone_whatsapp: $funnel_is_phone_whatsapp, funnel_phone: $funnel_phone, funnel_enable_floating_bar: $funnel_enable_floating_bar, funnel_enable_floating_bar_link: $funnel_enable_floating_bar_link, funnel_address: $funnel_address, funnel_email: $funnel_email, funnel_favicon_link: $funnel_favicon_link, funnel_facebook_id: $funnel_facebook_id, funnel_facebook_access_token: $funnel_facebook_access_token, funnel_google_id: $funnel_google_id, funnel_tiktok_id: $funnel_tiktok_id, funnel_everflow: $funnel_everflow, funnel_snapchat_id: $funnel_snapchat_id, gateway_selected_merchant: $gateway_selected_merchant, gateway_stripe_public: $gateway_stripe_public, gateway_stripe_private: $gateway_stripe_private, gateway_other: $gateway_other, gateway_paypal_client_id: $gateway_paypal_client_id, integration_confirmation_email: $integration_confirmation_email, integration_abandonment_email: $integration_abandonment_email, integration_tracking_email: $integration_tracking_email, integration_onhold_email: $integration_onhold_email, is_fulfill_by_plg: $is_fulfill_by_plg){
            id
        }
    }
`;
export const SAVE_FUNNEL_EMAIL_SEQUENCEV1 = gql`
    mutation($id: String, $funnel_id: String, $creator: String, $message_id: String, $message_type: String, $method: String, $delay: String, $email_subject: String, $editor_value: String){
        saveFunnelEmailSequenceV1(id: $id, funnel_id: $funnel_id, creator: $creator, message_id: $message_id, message_type: $message_type, method: $method, delay: $delay, email_subject: $email_subject, editor_value: $editor_value){
            id
        }
    }
`;
export const SAVE_FUNNEL_EMAIL_SEQUENCEV2 = gql`
    mutation($id: String, $creator: String, $funnel_id: String, $sequence_name: String, $sequence_tags: String, $content: String, $content_id: String, $delay: String, $message_type: String, $email_subject: String, $asid: String, $atkn: String, $sender: String, $editor_value: String, $add_content: Boolean, $remove_content: Boolean, $remove_data: Boolean, $return_sequence_id: String){
        saveFunnelEmailSequenceV2(id: $id, creator: $creator, funnel_id: $funnel_id, sequence_name: $sequence_name, sequence_tags: $sequence_tags, content: $content, content_id: $content_id, delay: $delay, message_type: $message_type, email_subject: $email_subject, asid: $asid, atkn: $atkn, sender: $sender, editor_value: $editor_value, add_content: $add_content, remove_content: $remove_content, remove_data: $remove_data, return_sequence_id: $return_sequence_id){
            id
        }
    }
`;
export const SAVE_FUNNEL_EMAIL_SEQUENCEV2_ORDER = gql`
    mutation($content_orders: String){
        saveFunnelEmailSequenceV2Order(content_orders: $content_orders){
            id
        }
    }
`;
export const SAVE_FUNNEL_DOMAIN = gql`
    mutation($id: String!, $domain_or_subdomain: String!, $selected_funnel_id: String){
        saveFunnelDomain(id: $id, domain_or_subdomain: $domain_or_subdomain, selected_funnel_id: $selected_funnel_id){
            id
        }
    }
`;
export const SAVE_FUNNEL_LIST = gql`
    mutation($creator: String, $funnel_name: String, $domain_name: String, $funnel_type: String, $customLegalPageId: String, $customCss: String){
        saveFunnelList(creator: $creator, funnel_name: $funnel_name, domain_name: $domain_name, funnel_type: $funnel_type, customLegalPageId: $customLegalPageId, customCss: $customCss){
            id
        }
    }
`;
export const SAVE_PUSH_TO_FUNNEL_LIST = gql`
    mutation($creator: String, $domain_name: String, $funnel_name: String, $funnel_templates: String, $is_cod: Boolean, $is_not_shareable: Boolean, $is_fulfill_by_plg: Boolean){
        pushToFunnelList(creator: $creator, domain_name: $domain_name, funnel_name: $funnel_name, funnel_templates: $funnel_templates, is_cod: $is_cod, is_not_shareable: $is_not_shareable, is_fulfill_by_plg: $is_fulfill_by_plg){
            id
        }
    }
`;
export const SAVE_SHARED_FUNNEL_LIST = gql`
    mutation($funnel_id: String!, $creator: String!, $funnel_name: String!, $domain_name: String!, $selected_page_ids: String!){
        saveSharedFunnelList(funnel_id: $funnel_id, creator: $creator, funnel_name: $funnel_name, domain_name: $domain_name, selected_page_ids: $selected_page_ids){
            id
        }
    }
`;
export const SAVE_FUNNEL_PAGE_LIST = gql`
    mutation($funnel_id: String!, $creator: String!, $page_type: String, $path: String, $design: String!, $design_page_id: String){
        saveFunnelPageList(funnel_id: $funnel_id, creator: $creator, page_type: $page_type, path: $path, design: $design, design_page_id: $design_page_id){
            id
        }
    }
`;
export const SET_FUNNEL_PAGE_AS_ROOT = gql`
    mutation($funnel_id: String!, $page_id: String!){
        setFunnelPageAsRoot(funnel_id: $funnel_id, page_id: $page_id){
            id
        }
    }
`;
export const REMOVE_FUNNEL_PAGE_AS_ROOT = gql`
    mutation($funnel_id: String!, $page_id: String!){
        removeFunnelPageAsRoot(funnel_id: $funnel_id, page_id: $page_id){
            id
        }
    }
`;
export const REMOVE_FUNNELGENIE_PAGE = gql`
    mutation($page_id: String!){
        removeFunnelGeniePage(page_id: $page_id){
            id
        }
    }
`;
export const UPDATE_FUNNELGENIE_PAGE_SETTING = gql`
    mutation($funnel_id: String!, $page_id: String!, $page_type: String, $path: String, $page_title: String, $page_description: String, $page_og_image_link: String, $page_keyword: String, $funnel_header_analytics: String, $funnel_footer_analytics: String, $published_page_id: String, $is_publish: Boolean $page_enable_loader: Boolean, $page_selected_modal_action: String, $design_json: String, $design_screenshot: String, $is_split_edit: Boolean, $source: String!){
        updateFunnelPageList(funnel_id: $funnel_id, page_id: $page_id, page_type: $page_type, path: $path, page_title: $page_title, page_description: $page_description, page_og_image_link: $page_og_image_link, page_keyword: $page_keyword, funnel_header_analytics: $funnel_header_analytics, funnel_footer_analytics: $funnel_footer_analytics, published_page_id: $published_page_id, is_publish: $is_publish, page_enable_loader: $page_enable_loader, page_selected_modal_action: $page_selected_modal_action, design_json: $design_json, design_screenshot: $design_screenshot, is_split_edit: $is_split_edit, source: $source){
            id
        }
    }
`;
export const SAVE_FUNNEL_LIST_SPLIT_PAGE = gql`
    mutation($page_id: String!, $is_remove: Boolean){
        saveSplitFunnelPageData(page_id: $page_id, is_remove: $is_remove){
            id
        }
    }
`;
export const UPDATE_FUNNEL_LIST_SPLIT_PAGE = gql`
    mutation($page_id: String!, $bias: Int, $split_notes: String){
        updateSplitFunnelPageData(page_id: $page_id, bias: $bias, split_notes: $split_notes){
            id
        }
    }
`;
// end new funnel mutation
export const ADD_FUNDS_TO_USER = gql`
    mutation($orderids: String!){
        addFundsToUser(orderids: $orderids){
            id
        }
    }
`;
export const ADD_OR_REMOVE_PLG_TAG = gql`
    mutation($id: String!, $tag: String!, $action: String!){
        addOrRemovePLGTag(id: $id, tag: $tag, action: $action){
            id
        }
    }
`;
export const SPLIT_OR_MERGE_COD_ORDERS = gql`
    mutation($ids: String!, $action: String!){
        splitOrMergeCODOrders(ids: $ids, action: $action){
            id
        }
    }
`;
export const SEND_MESSAGE = gql`
    mutation($id: String, $sender_id: String, $funnel_id: String, $page_id: String, $product_link: String, $receiver_id: String, $replier_id: String, $message: String, $from_mobile: Boolean){
        sendMessage(id: $id, sender_id: $sender_id, funnel_id: $funnel_id, page_id: $page_id, product_link: $product_link, receiver_id: $receiver_id, replier_id: $replier_id, message: $message, from_mobile: $from_mobile){
            id
        }
    }
`;
// TODO :: QUICK MESSAGE
export const MESSAGE_QUICK_ACTION = gql`
    mutation($id: String!, $user_id: String, $input_computation: String,$action: String, $funnel_id: String, $page_id: String){
        messageQuickAction(id: $id, user_id: $user_id, action: $action,input_computation: $input_computation, funnel_id: $funnel_id, page_id: $page_id){
            id
        }
    }
`;

// unused
export const ADD_OR_UPDATE_FB_LINK = gql`
    mutation($id: String!, $fbLink: String!){
        linkFB(id: $id, fbLink: $fbLink){
            fb_link
        }
    }
`;
// End jerome here