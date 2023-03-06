exports.typeDefs = `
    type CommerceHQ {
        id: ID
        storeName: String
        apiKey: String
        apiPassword: String
    }

    type User {
        id: ID
        referralId: String
        gaId: String
        fbId: String
        dealerId: String
        firstName: String! 
        lastName: String!
        password: String!
        bio: String
        profileImage: String
        email: String!
        kartra: String
        store_token: String
        store_url: String
        store_phone: String
        store_location_id: String
        privilege: Int
        user_session_cookie: String
        count_pushToStore: Int
        count_pushWithBundle: Int
        count_addReview: Int
        count_copyPush: Int
        count_hotProducts: Int
        total_points: Int
        reward_points: [Points]
        favorites: [Favorites]
        one_time_missions: [String]
        kartra_tags: [String]
        joinDate: String
        lastLoginDate: String
        total_exprenses: String
        fb_link: String
        help_request_message: [Help]
        count: Int
        queryCount: Int
        purchase_dfy: Boolean
        success_rebill: Boolean
        sales_rep_id: String
        sales_rep_date: String
        sales_rep_notes: [SalesRep]
        notification: [Notification]
        date_spin: String
        invitedBy: String
        pass_key: String
        isFulfillmentCenterUnlock: Boolean
        hasFulfillmentMessage: Boolean
        totalRequest: Int
        tos: Boolean
        isExtended: Boolean
        allowMultiConnectStore: Boolean
        recentPaid: Boolean
        listOfStore: [StoreList]
        plg_balance: Float
        plg_topup_history: [TopupLogs]
        plg_balance_log: [CreditLogs]
        fbb_store_id: String
        pending_stock_id: [String]
        funnel_genie_domains: [String]
        access_tags: [String]
        business_name: String
        business_email: String
        account_number: String
        wire_transfer_number: String
        bank_code: String
        routing_number: String
        account_type: String
        address: String
        investment_list: [InvestmentList]
        investment_total: Float
        address_fv: [String]
        dealerName: String
        phone: String
        city: String
        zip: String
        state: String
        masterIds: [String]
        staffIds: [String]
        payoneer_details: PayoneerDetails
        commerceHQ: CommerceHQ
    }

    type InvestmentList {
        amount: Float
        date: String
    }

    type FunnelBlocks {
        id: ID
        creator: String
        category: String
        data: String
        display_mode: String
        tags: [String]
    }


    type FunnelList {
        id: ID
        ids: [String]
        domainIndex: Int
        funnel_name: String
        page_type: String
        path: String
        design: [Design]
        split_design: String
        split_bias: Int
        split_screenshot: String
        split_notes: String
        sendPLGEmailConfirmation: Boolean
        sendPLGEmailAbandonment: Boolean
        pageID: String
        funnel_type: String
        funnel_phone: String
        funnel_isWhatsApp: Boolean
        funnel_email: String
        funnel_address: String
        funnel_pixelID: String
        funnel_ga: String
        funnel_fga: String
        favicon_link: String
        facebook_id: String
        google_id: String
        tiktok_id: String
        snapchat_id: String
        funnel_selected_merchant: String
        funnel_stripe_public: String
        funnel_stripe_private: String
        funnel_other: String
        page_title: String
        page_description: String
        page_og_image_link: String
        page_keyword: String
        isRoot: Boolean
        isCOD: Boolean
        enableLoader: Boolean
        selectedModalAction: String
        paypalClientID: String
        confirmationEmail: String
        abandonmentEmail: String
        trackingEmail: String
        funnel_object: FunnelObject
        count: Int
        funnelIntegration: String
    }

    type FunnelObject {
        funnel_id: String
        funnel_name: String
        domainIndex: Int
    }

    type FunnelGenie {
        id: ID
        creator: String
        domain_name: String
        funnel_name: String
        funnel_type: String
        date_modified: String
        funnel_use_email_confirmation: Boolean
        funnel_use_email_tracking: Boolean
        funnel_use_email_abandonment: Boolean
        funnel_is_phone_whatsapp: Boolean
        funnel_enable_floating_bar: Boolean
        funnel_enable_floating_bar_link: String
        funnel_phone: String
        funnel_address: String
        funnel_email: String
        funnel_currency: String
        funnel_pixel_id: String
        funnel_favicon_link: String
        funnel_facebook_id: String
        funnel_facebook_access_token: String
        funnel_google_id: String
        funnel_tiktok_id: String
        funnel_everflow: Boolean
        funnel_snapchat_id: String
        gateway_selected_merchant: String
        gateway_stripe_public: String
        gateway_stripe_private: String
        gateway_other: String
        gateway_paypal_client_id: String
        integration_confirmation_email: String
        integration_abandonment_email: String
        integration_tracking_email: String
        integration_onhold_email: String
        is_cod_funnel: Boolean
        is_not_shareable: Boolean
        is_fulfill_by_plg: Boolean
        old_page_ids: [String]
        page_count: Int
    }

    type FunnelGeniePages {
        id: ID
        funnel_id: String
        published_page_id: String
        page_type: String
        path: String
        design: [Design]
        date_modified: String
        split_design: String
        split_bias: Int
        split_screenshot: String
        split_notes: String
        page_is_root: Boolean
        page_enable_loader: Boolean
        page_selected_modal_action: String
        page_title: String
        page_description: String
        page_og_image_link: String
        page_keyword: String
        funnel_header_analytics: String
        funnel_footer_analytics: String

        funnel_name: String
        domain_name: String
        is_cod_funnel: Boolean
        funnel_use_email_confirmation: Boolean
        funnel_use_email_abandonment: Boolean
        is_fulfill_by_plg: Boolean
        funnel_is_phone_whatsapp: Boolean
        funnel_enable_floating_bar: Boolean
        funnel_enable_floating_bar_link: String
        funnel_type: String
        funnel_phone: String
        funnel_email: String
        funnel_currency: String
        funnel_address: String
        funnel_favicon_link: String
        funnel_facebook_id: String
        funnel_facebook_access_token: String
        funnel_google_id: String
        funnel_tiktok_id: String
        funnel_everflow: Boolean
        funnel_snapchat_id: String
        funnel_pixel_id: String
        gateway_selected_merchant: String
        gateway_stripe_public: String
        gateway_stripe_private: String
        gateway_other: String
        gateway_paypal_client_id: String
        integration_confirmation_email: String
        integration_abandonment_email: String
        integration_tracking_email: String
        funnel_integration: String
    }

    type Design {
        date: String
        publish: Boolean
        json: String
        screenshotURL: String
        screenshot_url: String
    }

    type FunnelEmailSequenceV1 {
        id: ID
        creator: String
        funnel_id: String
        delay: String
        message_type: String
        method: String
        email_subject: String
        editor_value: String
        message_id: String
    }

    type FunnelEmailSequenceV2 {
        id: ID
        creator: String
        funnel_id: String
        sequence_name: String
        sequence_tags: String
        content: [FunnelEmailSequenceV2Content]
        return_sequence_id: String
    }

    type FunnelEmailSequenceV2Content {
        id: ID
        order: Int
        delay: String
        message_type: String
        email_subject: String
        editor_value: String
        asid: String
        atkn: String
        sender: String
    }

    type TopupLogs {
        id: ID
        date_paid: String
        total_topup: Float
        payerID: String
        paymentID: String
        paymentToken: String
    }

    type CreditLogs {
        id: ID
        date_paid: String
        total_cost: Float
        description: String
        increase: Boolean
    }

    type StoreList {
        store_token: String
        store_url: String
        store_phone: String
        store_location_id: String
        active: Boolean
    }
    
    type OrdersID{
        orders_id: [String]
        creator: User
    }

    type NewOrdersID{
        orders_id: [String]
        creator: User
    }

    type Leads {
        name: String
        email: String
        invitedBy: String
        date: String
    }

    type Notification {
        id: ID
        type: String
        message: String
        date: String
        isRead: Boolean
    }

    type SalesRep {
        id: ID
        note: String
        date_time: String
    }

    type Help {
        message: String
        date_request: String
        read: Boolean
        date_read: String
    }

    type Favorites {
        prodid: String
        handle: String
        title: String
        src: String
        price: String
    }

    type Token {
        token: String!
    }

    type Admin {
        id: ID
        isLive: Boolean
        liveLink: String
        million_dollar_training(id: String): [TrainingVideo]
        mystery_product_url: String
        custom_page: [CustomPage]

        homepage_video_full: String
        homepage_message_full: String
        homepage_video_trial: String
        homepage_message_trial: String
    }

    type CustomPage {
        id: ID
        active: Boolean
        description: String
        navigation_name: String
        navigation_type: String
        img_url: String
        content: [CustomPageContent]
        createdAt: String
    }

    type CustomPageContent {
        id: ID
        page_lock_by_tag: Boolean
        page_lock_by_privilege: Boolean
        page_tag: String
        page_icon: String
        page_name: String
        page_content: String
        page_privilege_from: Int,
        page_privilege_to: Int
    }

    type TrainingVideo {
        id: ID
        tag: String
        upsell_link: String
        vimeo_id: Int
        introduction_title: String
        introduction_description: String
    }

    type Points {
        id: ID
        source: String
        points: Int
        date: String
        creator: User
    }

    type Gems {
        id: ID
        source: String
        gems: Int
        date: String
        creator: User
    }    
    type PageTemplates {
        id: ID
        description: String
        design: String
        screenshot_link: String
        screenshot_link_preview: String
        type: String
        date: String
        creator: String
    }    

    type Generatedbutton {
        id: ID
        creator: String
        buttonID: String
        amount: Float         
        orderItems: Float
        buttonTitle: String
        productName: String
        productDescription: String
        injectedStyle: String
        date: String
        buttonLabelText: String
        redirectURI: String
        rawButton: String
    }

    type LeaderBoard {
        firstName: String! 
        lastName: String!
        total_points: Int
    }

    type FilterLeaderBoards{
        firstName: String! 
        lastName: String!
        daily_points: PointsDaily
        weekly_points: PointsWeekly
    }

    type PointsDaily {
        points: Int
        day: Int
    }

    type PointsWeekly {
        points: Int
        week: Int
    }

    type DuplicateStore {
        store_url: String
        count: Int
    }

    type FulfillmentChina {
        id: ID
        creator: User
        date_requested: String
        date_approved: String
        date_denied: String
        date_paid: String
        denied_note: String
        isRequest: Boolean
        isApproved: Boolean
        isDenied: Boolean
        isPaid: Boolean
        isFinish: Boolean
        orders: String
        shipment_id: String
        tracking_number: String

        isRefactored: Boolean
        isRejected: Boolean
        isEdited: Boolean
        order_note: String
        shipping_information: ShippingInformation
        line_items: [LineItems]
        shipping_cost: String
        shipping_method: String
        shipping_days_min: Int
        shipping_days_max: Int
        shipping_service: String
        order_id: String
    }

    type NewFulfillmentChina {
        id: ID
        creator: User
        date_requested: String
        date_approved: String
        date_denied: String
        date_paid: String
        denied_note: String
        isRequest: Boolean
        isApproved: Boolean
        isDenied: Boolean
        isPaid: Boolean
        isFinish: Boolean
        shipment_id: String
        tracking_number: String

        isRejected: Boolean
        isEdited: Boolean
        order_note: String
        shipping_information: ShippingInformation
        line_items: [LineItems]
        shipping_cost: String
        shipping_method: String
        shipping_days_min: Int
        shipping_days_max: Int
        shipping_service: String
        order_id: String
        exported: Boolean
    }
    
    type LineItems {
        line_item_id: String
        product_id: String
        variant_id: String
        product_name: String
        variant_name: String
        quantity: Int
        chinese_description: String
        dg_code: String
        weight: String
        height: String
        width: String
        length: String
        approve_price: String
        original_price: String
        vendor_link: String
        stockid_used: String
        boxC_product_id: String
    }

    type PayoneerDetails {
        name: String!
        address: String!
        routing_number: String!
        account_number: String!
        account_type: String!
        beneficiary_name: String!
    }

    type ShippingInformation {
        order_number: String
        company: String
        address1: String
        address2: String
        city: String
        country: String
        country_code: String
        province: String
        province_code: String
        zip: String
        email: String
        name: String
        phone: String
    }

    type PaidOrders {
        id: ID
        creator: User
        isVerified: Boolean
        trackingNumberAvailable: Boolean
        date_paid: String
        total_payment: String
        store_url: String
        store_token: String
        store_location_id: String
        orders: String
        trackingNumbers: [String]
        is_packed: [String]

        isRefactored: Boolean
        order_ids: [String]
    }

    type VendorLinks {
        id: ID
        product_id: String
        link: String
    }

    type Count {
        count: Int
    }

    type Integration {
        id: ID
        creator: ID
        merchant_type: String
        merchant_name: String
        public_key: String
        private_key: String
        other: String
    }

    type FunnelOrders {
        id: ID
        ids: [String]
        safeArrivalID: String
        creator: ID
        ref_id: String
        orderCreator: String
        order_date: String
        design_url: String
        order_status_update: String
        on_hold: Boolean
        callId: String
        merchant_type: String 
        paid_cc: Boolean
        plgbuttonID: String
        has_pod: Boolean
        order_status: String
        cancel_note: String
        currencyWord: String
        currencySymbol: String
        shipping_information: FunnelShippingInfo
        line_items: [FunnelLineItems]
        fulfillment_status: String
        risk_level: String
        test_data: Boolean
        raw_data: [String]
        updateById: String
        updateByName: String
        dateStatusChanged: String
        dateStatusDelivered: String
        funnel_source_id: String
        sync_from: String
        sms_verified: Boolean
        isPaidProductCost: Boolean
        isPaidCommision: Boolean
        isManualModified: Boolean
        fulfill_with_plg: Boolean
        campaign_src: String 
        received_payment_from_courier: Boolean
        source_link: String
        count: String
        totalPayout: Float
        userData: String
        affiliateEmail: String
    }

    type FunnelShippingInfo {
        email: String
        name: String
        phone: String
        street1: String
        street2: String
        city: String
        state: String
        zip: String
        country: String
        address_type: String
        aptOffice: String
        bldgVilla: String
        nearestLandmark: String
    }

    type FunnelLineItems {
        shopify_order_number: String
        shopify_variant_id: String
        title: String
        variant: String
        quantity: Int
        description: String
        price: Float
        convertedPrice: Float
        payoutPrice: Float
        pcost: Float
        affiliateCost: Float
        productCost: Float
        inventoryName: String
        inventoryDescription: String
        active: Boolean
        tracking_number: String
        tracking_link: String
        cost_of_goods: Float
        ref_track: String
        receipt_cc: String
        plg_sku: String
        plg_serialNumber: [String]
        payment_status: String

        plg_itemCost: Float
        plg_fulfillmentCost: Float
        plg_yabazoo: Float
        plg_deliveryCost: Float
        plg_tax: Float
        plg_affiliateCost: Float
    }
    
    type FulfillmentCenterMessages {
        id: ID
        senderID: ID
        seen: Boolean
        newChatCount: Int
        messages: [Messages]
    }

    type Messages {
        date: String
        text: String
        from: String
        isFromQuote: Boolean
        isFromBulkQuote: Boolean

        default_chinese_description: String
        default_weight: String
        default_dg_code: String
        default_dimension_height: String
        default_dimension_width: String
        default_dimension_length: String
        default_price: String
    }

    type PaymentLogs {
        id: String
        summary: String
        parent_payment: String
        update_time: String
        total_amount: String
        amount_currency: String
        create_time: String
        clearing_time: String
        state: String
        creator: ID
    }

    type VirtualWarehouse {
        id: ID
        stockid: String
        chinese_description: String
        creator: ID
        name: String
        qty: Int
        dimension_height: String
        dimension_width: String
        dimension_length: String
        dg_code: String
        weight: String
        price: String
        vendor_link: String
        isPaid: Boolean
    }

    type NewVirtualWarehouse {
        id: ID
        chinese_description: String
        product_name: String
        variants: [Variants]
        boxc_inbound_id: String
        isFinish: Boolean
    }

    type Variants {
        variant_id: String
        variant_name: String
        original_price: String
        approve_price: String
        dg_code: String
        quantity: Int
        boxc_product_id: String
    }

    type EmailAndSMSintegration {
        id: ID
        funnelSource: String
        delay: String
        messageType: String
        method: String
        emailSubject: String
        editorValue: String
        messageID: String
    }

    type FunnelLeadsMetaData {
        id: ID
        leads_id: String
        meta_tag: String
        meta_note: String
    }

    type EmailSequence {
        id: ID
        creator: String
        funnelSource: String
        sequence_name: String
        sequence_tags: String
        content: [EmailSequenceContent]
        return_sequence_id: String
    }

    type EmailSequenceContent {
        id: ID
        delay: String
        messageType: String
        emailSubject: String
        editorValue: String
    }

    type FunnelTotalSales {
        count: Float
        count_order: Float
        total_cod: Float
        dates: [TotalSales]
    }

    type TotalSales {
        count: Float
        date: String
        count_order: Float
        total_cod: Float
        total_delivered: Float
        total_not_delivered: Float
    }

    type FunnelProducts {
        id: ID
        lastEditedByID: String
        lastEditedByName: String
        dateCreated: String
        dateUpdated: String
        productName: String
        productSku: String
        productCost: Float
        productSrp: Float
        productDeliveryCost: Float
        productFivePercentDuty: Float
        fulfillmentCost: Float
        affiliateEmail: String
        affiliateCost: Float
        funnelDesign: [String]
        yabazoo: Float
        quantity: Int
        totalQuantity: Int
        po_ids: [String]
        po_data: PurchaseOrder
        is_active: Boolean
    }

    type FunnelProductDesign {
        id: ID
        product_id: String
        design_name: String
        design_list: [FunnelProductDesignList]
        created_by: String
    }

    type FunnelProductDesignList {
        id: ID
        path: String
        page_type: String
        design_string_object: String
        upload_by: String
    }

    type PurchaseOrder {
        id: ID
        po_no: String
        po_date: String
        product_variant_id: String
        payment_terms: String
        affiliate_name: String
        affiliate_email: String
        affiliate_budget: Float
        affiliate_commision: Float
        product_price: Float
        product_quantity: Int
        product_quantity_list: [PurchaseOrderQuantityList]
        product_srp: Float
        fulfillment_cost: Float
        delivery_cost: Float
        vat: Float
        yabazoo: Float
        additional_cost: Float
        received_quantity: Int
        receiver_email: String
        received_date: String
        vendor_info: String
        ship_to_info: String
        note: String
        isApproved: Boolean
        sold_item_serial_numbers: [String]
        returning_item_serial_numbers: [String]
        remainingQty: Int
        totalQty: Int
        warnWhenLow: Boolean
        warnEmail: String
        warnQty: Int
        count: Int
    }

    type PurchaseOrderQuantityList {
        id: String,
        status: String
    }

    type JSONstringify {
        jsonStr: String
    }

    type MessageRoot {
        id: ID
        sender_id: String
        receiver_id: String
        user_id: String
        name: String
        picture: String
        unread_count: Int
        privilege: Int
        last_message: String
        last_message_date: String
        messages: [MessageList]
    }

    type MessageList {
        id: ID
        position: String
        date: String
        message: String
        replier_id: String
        replier_name: String
        additional_data: MessageAdditional
    }

    type MessageAdditional {
        funnel_id: String
        funnel_name: String
        page_id: String
        page_name: String
        product_link: String
        approved: Boolean
    }

    type Query {

        buttons: [Generatedbutton]

        getUserByReferral(referralId: String!): User

        getTotalButton(creator: String!, search: String): Count

        getGeneratedButton(creator: String!, search: String, limit: Int, page: Int): [Generatedbutton]

        getButtonById(id: String!): Generatedbutton
        
        
        
        getAllPageTemplates(id: String!): PageTemplates

        getPageTemplates(creator: String!): [PageTemplates]


        
        checkInvites(email :String!): User

        getMyStaffs(staffEmail: String!): [User]

        getMyMasters(staffId: String!): [User]

        getCurrentUser: User

        getUserProfile: User

        getAllUsers(sortMessage: String, fromDate: String, toDate: String, search: String, isEmail: Boolean, privilege: String, limit: Int, offset: Int, sort: String): [User]

        profilePage(id: String!): User

        getFunnelBlocks(creator: String): [FunnelBlocks]

        getAdminSettings(content_id: String): Admin
        getCustomPageOfPanel(panel_id: String): [CustomPageContent]
        getCustomPageData(content_id: String): CustomPageContent
        getLeaderBoards: [LeaderBoard]
        getLeaderBoardsDaily: [FilterLeaderBoards]
        getLeaderBoardsWeekly: [FilterLeaderBoards]
        getAllSalesPerson(privilege: Int): [User]
        getAllReferrals(referralId: String): [User]
        getAllLeads(referralId: String): [Leads]
        getDuplicateConnectedStore: [DuplicateStore]
        searchStoreURL(store_url: String!): [User]
        getAllReferrer: [User]
        getTopReferrer(displayBy: String): [User]
        getChinaOrders(id: String, filter: String, offset: Int!, limit: Int): [FulfillmentChina]
        getChinaOrdersCount(id: String, filter: String): Count
        getNewChinaOrders(id: String, filter: String, offset: Int!, limit: Int): [NewFulfillmentChina]
        getNewChinaOrdersCount(id: String, filter: String): Count
        getAdminChinaOrdersUSERS(filter: String): [User]
        getAdminNewChinaOrdersUSERS(filter: String): [User]
        getPaidOrders(id: String!): [PaidOrders]
        getPaidOrder(id: String!, orderid: String): FulfillmentChina
        getOrderObject(id: String!): FulfillmentChina
        getAllOrdersID(id: String!): OrdersID
        getAllNewOrdersID(id: String!): NewOrdersID
        getFulfillmentCenterMessage(id: String): FulfillmentCenterMessages
        getCountOfAllMessage(id: String): Count
        getpaypalPaymentLogs(id: String): [PaymentLogs]
        getApprovedUser(search: String): [User]
        getAllPaidOrder: [FulfillmentChina]
        getAdminHomepageVideo: Admin
        getVirtualInventory(id: String!, isPaid: Boolean!): [VirtualWarehouse]
        getTopupLogs(id: String!, limit: Int!, offset: Int): [TopupLogs]
        getTopupLogsCount(id: String!): Count
        getCreditLogs(id: String!, limit: Int!, offset: Int): [CreditLogs]
        getCreditLogsCount(id: String!): Count
        getBulkRequest(id: String): [NewVirtualWarehouse]
        getOrderCount(id: String!, filter: String!): Count
        getUserFunnelGenie(id: String!, domainIndex: Int, funnel_name: String, searchFunnel: String, limit: Int, page: Int): [FunnelList]
        getFunnelPages(id: String!, domainIndex: Int, funnel_name: String, searchFunnel: String, limit: Int): [FunnelList]
        getPageOfFunnelGenie(id: String!): FunnelList
        getSearchedUsers(search: String!, filter: String): [User]
        getTotalTopup: Count
        getMyIntegrations(id: String!, merchant_type: String): [Integration]
        getMyFunnelOrders(callId: String, campaign_src: String, ids: String, plgbuttonID: String, id: String, orderid: String, merchant_type: String, design_url: String, paid_cc: Boolean, has_pod: Boolean, order_status: String, funnel_id: String, funnel_name: String, domainIndex: Int, filterByStartDate: String, filterByEndDate: String, skip: Int, limit: Int, fulfillerLocation: String, sortBy: String, variantIDS: String, serial_numbers: String, isPaidCommision: Boolean, cod_analytics: Boolean, returning_items: Boolean, tracking_courier: String, show_courier_collected: String, ref_track: String): [FunnelOrders]
        getMyFunnelSubscribers(id: String, page: Int, limit: Int): [FunnelOrders]
        getMyFunnelOrderCreatorList(userEmail: String, order_status: String, fulfillerLocation: String, dateStart: String, dateEnd: String, page: Int, limit: Int, show_vip: Boolean): [FunnelOrders]
        getMyCommissionCreatorList(userEmail: String, fulfillerLocation: String, dateStart: String, dateEnd: String, page: Int): [FunnelOrders]
        getFunnelOrderCost(variantID: String, filterByStartDate: String, filterByEndDate: String): JSONstringify
        getSharedFunnel(id: String!, funnel_name: String!, funnel_id: String, loadLastDesign: Boolean): [FunnelList]
        getOnlyFunnelFromOrders(creator: String!): [FunnelList]
        getFunnelEmailAndSMSIntegration(funnelSource: String!, messageType: String!): [EmailAndSMSintegration]
        getLeadsMetaData(creator: String!, leads_id: String!): [FunnelLeadsMetaData]
        getEmailSequence(creator: String!, funnelSource: String!): [EmailSequence]
        getMyFunnelOrderTotalSales(creator: String!, page_ids: String, dateFrom: String, dateTo: String, timezoneOffset: Int, merchant_type: String, showShopifyOnly: Boolean): FunnelTotalSales
        getTopProducts(creator: String!, page_ids: String, dateFrom: String, dateTo: String, merchant_type: String, showShopifyOnly: Boolean): JSONstringify
        getUsersOfFunnelOrders(search_user: String): [User]
        getTotalFunnelProducts: Count
        getFunnelProducts(id: String, ids: String, search: String, page: Int, limit: Int, affiliateEmail: String, all_inventory: Boolean, is_active: Boolean, sortDate: String): [FunnelProducts]
        getFunnelProductDesign(id: String, product_id: String): [FunnelProductDesign]
        getPurchaseOrders(affiliate_email: String, product_variant_id: String, isApproved: Boolean, status: String, low_inventory: Boolean, page: Int, limit: Int): [PurchaseOrder]
        getMyPayCheck(creator: String, funnel_id: String, userPrivilege: Int, fulfillerLocation: String, order_status: String, dateStart: String, dateEnd: String, isAdminPayout: Boolean, isAdminPayoutCollectedRange: Boolean, useOrderDateAsDateFilter: Boolean, on_hold: Boolean, showShopifyOnly: Boolean): FunnelTotalSales
        getMyCommissionPayCheck(serial_numbers: String, order_status: String, dateStart: String, dateEnd: String, isPaidCommision: Boolean): FunnelTotalSales
        getOrderLink(id: String!): VendorLinks
        getAllAffiliate(page: Int, limit: Int, email: String): [User]

        getTotalFunnel(creator: String!, search: String): Count
        getFunnelList(creator: String!, search: String, limit: Int, page: Int, show_page_count: Boolean): [FunnelGenie]
        getFunnelById(funnel_id: String!): FunnelGenie
        getFunnelPageList(funnel_id: String!, page_id: String, page: Int, loadLastDesign: Boolean, page_type: String, not_in_page_type: String): [FunnelGeniePages]
        getFunnelPageById(page_id: String!, loadLastDesign: Boolean, include_funnel_setting: Boolean): FunnelGeniePages
        getFunnelEmailSequenceV1(funnel_id: String!, message_type: String): [FunnelEmailSequenceV1]
        getFunnelEmailSequenceV2(funnel_id: String!): [FunnelEmailSequenceV2]

        getSerialNumberStatusCount(serial_numbers: String!, order_status: String!): Count
        getCODtotalOrderPerCountry(dateStart: String, dateEnd: String, location: String, creator: String): JSONstringify
        getCODOrderStatusRatesPerCountry(dateStart: String, dateEnd: String, location: String, creator: String): JSONstringify
        getOrderMetrics(creator: String, funnel_id: String, merchant_type: String, dateStart: String, dateEnd: String, location: String, showShopifyOnly: Boolean): JSONstringify
        getOrderStatusRatesPerCountry(creator: String!, dateStart: String, dateEnd: String, location: String, summary: Boolean): JSONstringify
        getCODOrderProductCost(creator: String, costBy: String, location: String, dateStart: String, dateEnd: String): JSONstringify
        getPLGPaycheck(location: String, dateStart: String, dateEnd: String): JSONstringify
        getAllTimeBuyersCount(location: String!): Count
        getMessageCount(user_id: String!, is_admin: Boolean): MessageRoot
        getMessages(id: String, user_id: String, search_user: String, unread: Boolean, view_list: Boolean, is_admin: Boolean, limit: Int): [MessageRoot]
        getUserById(id: String, search: String): User
    }

    type Mutation {
        updateGeneratedButton(productName: String, productDescription: String, buttonLabelText: String, redirectURI :String, amount: Float, buttonTitle: String, injectedStyle: String, rawButton: String, id: String!) : Generatedbutton
        
        updateFunnelOrdersCallID(ids: [String], callId: String): FunnelOrders

        deleteGeneratedButton(id: String): Generatedbutton

        acceptInvitation(staffId: String, masterId: String): User

        removeStaff(masterId: String!, staffEmail: String!): User

        addStaff(masterEmail: String! ,masterId: String!, staffEmail: String!) : User

        addGeneratedButton(productName: String, productDescription: String, buttonLabelText: String,redirectURI: String,amount: Float, creator: String!, buttonTitle: String, injectedStyle: String, rawButton: String): Generatedbutton


        
        addPageTemplates(creator: String!, description: String, design: String, screenshot_link: String, screenshot_link_preview: String, type: String, date: String ): PageTemplates
        
        deletePageTemplate(id: String): PageTemplates
        
        
        updatePageTemplate(id: String, description: String, design: String, screenshot_link: String, screenshot_link_preview: String, type: String, date: String): PageTemplates

        
        updateGeneratedButtonID(id: String!, buttonID: String): Generatedbutton

        addFunnelBlocks(category: String!, data: String, display_mode: String, tags: [String], creator: String): FunnelBlocks

        signupUser(firstName: String!, lastName: String!, email: String!, password: String!, kartra: String): Token

        signupFreeViral(address_fv: [String], dealerName: String, phone: String, city: String, zip: String, state: String , firstName: String!, lastName: String!,access_tags: [String], email: String!, password: String!, kartra: String): User

        signinUser(email: String!, password: String!, user_session_cookie: String!): Token

        editProfile(id: String!, bio: String!): User        

        addStoreToken(id: String!, store_token: String!, store_url: String!, store_phone: String!, store_location_id: String!): User
        addNewShopifyDetails(id: String!, store_token: String!, store_url: String!): User

        addFavorite(id: String!, prodid: String!, favorites: String!, title: String!, src: String!, price: String!): User
        removeFavorite(id: String!, prodid: String!): User
        addOReditPrivilege(id: String!, privilege: Int!): User
        updateCount(id: String!, increaseWhat: String!): User
        updateRewardPoints(id: String!, source: String!, reward_points: Int!): Points
        updateLiveMode(isLive: Boolean!, liveLink: String!): Admin
        linkFB(id: String!, fblink: String!): User
        requestHelp(id: String!, message: String!, read: Boolean!): Help
        setSalesRep(id: String!, sales_rep_id: String!): User
        addDealerId(id: String!, dealerId: String!): User
        addNotes(id: String!, note: String!): User
        removeNotes(id: String, note_id: String!): User
        updateTraining(id: String!, tag: String, upsell_link: String!, title: String!, description: String!, vimeo_id: Int!): TrainingVideo
        deleteTraining(id: String!): TrainingVideo
        pushNotification(id: String, email: String, sendTo: String, type: String!, message: String): User
        readAllNotification(id: String!): User
        removeNotification(id: String!, notifId: String!): User
        updateMysteryProduct(mp_url: String!): Admin
        updateGem(id: String!, pass_key: String!, source: String!): Gems


        

        addLeads(name: String!, email: String!, invitedBy: String!): Leads
        updateGAandFBid(id: String!, gaId: String, fbId: String): User
        addPanel(panel_name: String!, panel_type: String!, panel_description: String!, panel_img_url: String!): CustomPage
        deletePanel(id: String): CustomPage
        editPanel(id: String, panel_name: String!, panel_type: String!, panel_description: String!, panel_img_url: String!): CustomPage
        enablePanel(id: String, active: Boolean): CustomPage
        saveSection(id: String!, page_lock_by_tag: Boolean, page_lock_by_privilege: Boolean, page_icon: String!, page_name: String!, page_content: String!, page_tag: String, page_privilege_from: Int, page_privilege_to: Int): CustomPageContent
        editSection(id: String!, page_lock_by_tag: Boolean, page_lock_by_privilege: Boolean, page_icon: String!, page_name: String!, page_content: String!, page_tag: String, page_privilege_from: Int, page_privilege_to: Int): CustomPageContent
        deleteSection(id: String): CustomPageContent
        updateKartraEmail(id: String!, kartra: String!): User
        manualResetPassword(id: String!): User
        updatePrivilege(id: String!, privilege: Int!): User
        updateEmail(id: String!, new_email: String!): User
        requestOrders(id: String!, orders: String!): FulfillmentChina
        requestNewOrders(id: String!, orders: String!): NewFulfillmentChina
        decideOrder(id: String!, decision: String!, denied_note: String): FulfillmentChina
        decideNewOrder(userid: String, id: String!, decision: String!, denied_note: String, ids: String): NewFulfillmentChina
        updateRequestedOrder(orders: String!, isWeight: Boolean, service: String): FulfillmentChina
        sendPayment(id: String!, store_url: String!, store_token: String!, store_location_id: String!, total_payment: String!, payerID: String!, paymentID: String!, paymentToken: String!): FulfillmentChina
        printLabelSuccess(id: String!, shipment_id: Int!, tracking_number: String!, paid_id: String!): FulfillmentChina
        fulfillmentCenterAccess(id: String!, access: Boolean!): User
        cancelRequest(id: String!, orderid: String!, isRefactored: Boolean): FulfillmentChina
        cancelNewRequest(id: String!, orderid: String!): NewFulfillmentChina
        submitFulfillmentCenterMessage(id: String!, text: String!, from: String!, isFromQuote: Boolean, isFromBulkQuote: Boolean, defaults: String): FulfillmentChina
        seenMessage(id: String!, from: String!): FulfillmentChina
        verifyPaymentFromWebhook(paymentid: String!): User
        savePaypalPaymentLogs(creator: String!, paymentObject: String!): PaymentLogs
        markAsPaid(id: String!, store_url: String!, store_token: String!, store_location_id: String!): FulfillmentChina
        markAsPacked(paidID: String!, orderID: String!, shouldSave: Boolean!): PaidOrders
        acceptTOS(id: String!): User
        extendMoreDays(id: String!): User
        refactorUpdateRequestedOrder(id: String!, approve_price: String, variant_id: String!, isWeight: Boolean!, dimension: String, service: String, quantity: Int, stockid: String): FulfillmentChina
        updateNewRequestedOrder(id: String!, approve_price: String!, quantity: Int!, variant_id: String!, dg_code: String!, chinese_description: String!): NewFulfillmentChina
        changeHomepageVideo(id: String!, url: String, message: String, from: String!): Admin
        saveInventory(id: String!, stockid: String, orderid: String, chinese_description: String, name: String, qty: Int, dimension_height: String, dimension_width: String, dimension_length: String, dg_code: String, weight: String, price: String, vendor_link: String, isPaid: Boolean): VirtualWarehouse
        verifyTopupFromWebhook(paymentid: String!): User
        onTopupSuccess(id: String!, total_topup: Float!, payerID: String!, paymentID: String!, paymentToken: String!, pass_key: String!): User
        reduceCredits(id: String!, cost: Float!, description: String): User
        addTrackingNumber(id: String!, tracking_number: String!): NewFulfillmentChina
        saveFBBstoreID(id: String!, fbbid: String!): User
        saveStockID(id: String!, stockid: String!): User
        requestBulkInventory(id: String!, requestedProduct: String!): NewVirtualWarehouse
        updateVirtualWarehouse(id: String!, approve_price: String, variant_id: String, dg_code: String, chinese_description: String, boxc_product_id: String, isFinish: Boolean, object_id: String): NewVirtualWarehouse
        saveFunnelGenieCredential(id: String, design_id: String, domain_or_subdomain: String, funnel_name: String, funnel_type: String, page_type: String, path: String, design: String, pageID: String, isPath: Boolean, domainIndex: Int, screenshotURL: String, templateUse: String, funnelType: String, enableLoader: Boolean, isPublish: Boolean, isSplitEdit: Boolean, selectedModalAction: String): FunnelList
        pushToFunnel(id: String!, domainIndex: Int!, funnel_name: String!, funnel_templates: String!, offer_link: String, isCOD: Boolean): FunnelList
        duplicateFunnel(id: String, funnel_name: String, domainIndex: Int): FunnelList
        deleteFunnelPage(id: String!): FunnelList
        updateFunnelSetting(id: String, creator: String!, funnel_name: String!, domainIndex: Int!, changeDomainIndexTo: Int, changeDomainNameTo: String, changeFunnelNameTo: String, changePageNameTo: String, funnel_phone: String, funnel_isWhatsApp: Boolean, funnel_email: String, funnel_address: String, funnel_pixelID: String, funnel_ga: String, funnel_fga: String, funnel_selected_merchant: String, funnel_stripe_public: String, funnel_stripe_private: String, funnel_other: String, paypalClientID: String, page_title: String, page_description: String, page_og_image_link: String, page_keyword: String, confirmationEmail: String, abandonmentEmail: String, trackingEmail: String, favicon_link: String, facebook_id: String, google_id: String, tiktok_id: String, snapchat_id: String, sendPLGEmailConfirmation: Boolean, sendPLGEmailAbandonment: Boolean): FunnelList
        deleteFunnel(creator: String!, funnel_name: String!, domainIndex: Int!): [FunnelList]
        markAsExported(ids: String!): FunnelList
        funnelGenieAccess(id: String!, access: Boolean!): User
        setAsDefaultDomain(id: String!, domain: String!, domainIndex: Int!, funnel_name: String!, path: String!): FunnelList
        saveORupdateIntegration(id: String!, integrationID: String, merchant_type: String!, merchant_name: String!, public_key: String, private_key: String!, other: String): Integration
        deleteIntegration(id: String!): Integration
        saveFunnelOrder(object: String!): FunnelOrders
        updatePaypalOrderStatus(ref_id: String!, is_failed: Boolean): FunnelOrders
        updateMyFunnelOrderShippingInformation(orderIds: String!, phone: String, street1: String, street2: String, city: String, state: String, zip: String, country: String, address_type: String, aptOffice: String, bldgVilla: String, nearestLandmark: String, received_payment_from_courier: Boolean, updaterID: String!, updaterName: String!): FunnelOrders
        updateMyFunnelOrders(id: String!,callId: String, merchant_type: String, orderCreator: String!, orderEmail: String!, sync_from: String, safeArrivalID: String, tracking_number: String, domains: String, client_tracking: Boolean, sendPLGTrackingEmail: Boolean!, cancel_note: String, order_status: String, country: String, updaterID: String, updaterName: String, dateStatusDelivered: String, productID: String, variantSku: String, variantQty: Int, variantPrice: Float, variantTitle: String, variantName: String, fulfillerLocation: String, onlyUpdateThisLineItem: Boolean, newVariantName: String, shopify_order_number: String): FunnelOrders
        updateOrderStatusByCallId(ids: [String], cancel_note: String!, order_status: String!): FunnelOrders
        updateOrderHold(ids: [String], on_hold: Boolean): FunnelOrders
        bulkUpdateMyFunnelOrders(array: String!): FunnelOrders
        cancelMyFunnelOrders(id: String!, orderCreator: String!): FunnelOrders
        archiveMyFunnelOrders(id: String!, orderCreator: String!): FunnelOrders
        saveSharedFunnel(creator: String!, domainIndex: Int!, funnel_name: String!, selectedPages: String!): FunnelList
        saveFunnelEmailAndSMSintegration(id: String, creator: String, messageID: String, funnelSource: String, messageType: String, method: String, delay: String, emailSubject: String, editorValue: String): EmailAndSMSintegration
        saveLeadsMetaData(id: String, creator: String, leads_id: String, meta_tag: String, meta_note: String): FunnelLeadsMetaData
        saveEmailSequence(id: String, creator: String, funnelSource: String, sequence_name: String, sequence_tags: String, content_id: String, delay: String, messageType: String, emailSubject: String, asid: String, atkn: String, sender: String, editorValue: String, addContent: Boolean, remove_content: Boolean, removeData: Boolean, return_sequence_id: String): EmailSequence
        saveEmailSequenceTemplate(creator: String, funnelSource: String, sequence_name: String, sequence_tags: String, content: String): EmailSequence
        saveSplitPageData(id: String, json: String, screenshotURL: String, action: String): FunnelList
        updateSplitPage(id: String, bias: Int, split_notes: String): FunnelList
        addCommerceHQ(id: String!, storeName: String, apiKey: String, apiPassword: String): User
        addPayoneerDetails(id: String!, beneficiary_name: String!, routing_number: String!, address: String!, account_type: String!, account_number: String!, name: String!): User
        savePaymentSettings(id: String!, business_email: String, business_name: String, account_number: String, wire_transfer_number: String, bank_code: String, routing_number: String, account_type: String, address: String): User
        disconnectFunnelDomain(id: String!, domain: String): User
        saveFunnelProduct(id: String, lastEditedByID: String, lastEditedByName: String, productName: String, productCost: Float, productSku: String, productSrp: Float, productDeliveryCost: Float, productFivePercentDuty: Float, fulfillmentCost: Float, affiliateEmail: String, affiliateCost: Float, yabazoo: Float, prevFunnelDesign: String, funnelDesign: String, is_active: Boolean): FunnelProducts
        deleteFunnelProduct(id: String, funnelDesign: String): FunnelProducts
        saveDesignOrGroupName(id: String, product_id: String, group_name: String, design: String): FunnelProductDesign
        deleteDesignOrGroup(id: String!, design_id: String): FunnelProductDesign
        savePurchaseOrder(id: String, action: String, receiver_email: String, product_name: String, product_variant_id: String, payment_terms: String, affiliate_email: String, affiliate_budget: Float, affiliate_commision: Float, product_price: Float, product_quantity: Int, po_vendor: String, po_ship_to: String, po_note: String, product_srp: Float, fulfillment_cost: Float, delivery_cost: Float, vat: Float, yabazoo: Float, additional_cost: Float, warnWhenLow: Boolean, warnEmail: String, confirmationEmail: String, warnQty: Int, fromTransferPOID: String): PurchaseOrder
        deleteFunnelOrder(id: String): FunnelOrders
        changeItemStatus(id: String, status: String): PurchaseOrder
        saveInvestment(id: String!, amount: Float!): User
        assignSerialNumberToOrder(id: String!, qty: Int!, plg_sku: String!): FunnelOrders
        markAllAsPaid(creator: String!, updaterID: String!, updaterName: String!, fulfillerLocation: String, totalPayment: String!, dateStart: String, dateEnd: String, isCommission: Boolean): FunnelOrders
        markAllCommissionAsPaid(serialNumbers: String!, total_commission: String, start_date: String, end_date: String, commissioner_name: String): FunnelOrders

        duplicateFunnelGenie(creator: String!, funnel_id: String!): FunnelGenie
        removeFunnelGenie(funnel_id: String!): FunnelGenie
        updateFunnelGenieSetting(funnel_id: String!, funnel_name: String, funnel_currency: String,  domain_name: String, funnel_use_email_confirmation: Boolean, funnel_use_email_tracking: Boolean, funnel_use_email_abandonment: Boolean, funnel_is_phone_whatsapp: Boolean, funnel_phone: String, funnel_enable_floating_bar: Boolean, funnel_enable_floating_bar_link: String, funnel_address: String, funnel_email: String, funnel_favicon_link: String, funnel_facebook_id: String, funnel_facebook_access_token: String, funnel_tiktok_id: String, funnel_everflow: Boolean, funnel_google_id: String, funnel_snapchat_id: String, gateway_selected_merchant: String, gateway_stripe_public: String, gateway_stripe_private: String, gateway_other: String, gateway_paypal_client_id: String, integration_confirmation_email: String, integration_abandonment_email: String, integration_tracking_email: String, integration_onhold_email: String, is_fulfill_by_plg: Boolean): FunnelGenie
        saveFunnelEmailSequenceV1(id: String, funnel_id: String, creator: String, message_id: String, message_type: String, method: String, delay: String, email_subject: String, editor_value: String): FunnelEmailSequenceV1
        saveFunnelEmailSequenceV2(id: String, creator: String, funnel_id: String, sequence_name: String, sequence_tags: String, content: String, content_id: String, delay: String, message_type: String, email_subject: String, asid: String, atkn: String, sender: String, editor_value: String, add_content: Boolean, remove_content: Boolean, remove_data: Boolean, return_sequence_id: String): FunnelEmailSequenceV2
        saveFunnelEmailSequenceV2Order(content_orders: String): FunnelEmailSequenceV2
        saveFunnelDomain(id: String!, domain_or_subdomain: String!, selected_funnel_id: String): User
        saveFunnelList(creator: String, funnel_name: String, domain_name: String, funnel_type: String, customLegalPageId: String, customCss: String): FunnelGenie
        pushToFunnelList(creator: String, domain_name: String, funnel_name: String, funnel_templates: String, is_cod: Boolean, is_not_shareable: Boolean, is_fulfill_by_plg: Boolean): FunnelGenie
        saveSharedFunnelList(funnel_id: String!, creator: String!, funnel_name: String!, domain_name: String!, selected_page_ids: String!): FunnelGenie
        saveFunnelPageList(funnel_id: String!, creator: String!, page_type: String, path: String, design: String!, design_page_id: String): FunnelGeniePages
        setFunnelPageAsRoot(funnel_id: String!, page_id: String!): FunnelGeniePages
        removeFunnelPageAsRoot(funnel_id: String!, page_id: String!): FunnelGeniePages
        removeFunnelGeniePage(page_id: String!): FunnelGeniePages
        updateFunnelPageList(funnel_id: String!, page_id: String!, page_type: String, path: String, page_title: String, page_description: String, page_og_image_link: String, page_keyword: String, funnel_header_analytics: String, funnel_footer_analytics: String, published_page_id: String, is_publish: Boolean page_enable_loader: Boolean, page_selected_modal_action: String, design_json: String, design_screenshot: String, is_split_edit: Boolean, source: String!): FunnelGeniePages
        saveSplitFunnelPageData(page_id: String!, is_remove: Boolean): FunnelGeniePages
        updateSplitFunnelPageData(page_id: String!, bias: Int, split_notes: String): FunnelGeniePages
        addFundsToUser(orderids: String!): FunnelOrders
        addOrRemovePLGTag(id: String!, tag: String!, action: String!): User
        splitOrMergeCODOrders(ids: String!, action: String!): FunnelOrders
        sendMessage(id: String, sender_id: String, funnel_id: String, page_id: String, product_link: String, receiver_id: String, replier_id: String, message: String, from_mobile: Boolean): MessageRoot
        messageQuickAction(id: String!, user_id: String, action: String, input_computation: String, funnel_id: String, page_id: String): MessageRoot
        
        setProfileIMG(id: String!, profileImage: String!): User
        
        changeEmail(currentEmail: String!, newEmail: String!): User

        changePassword(id: String!, password: String!): User

        passwordReset(email: String!): User
    }
`;