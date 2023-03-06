const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FunnelListSchema = new Schema({
    // basic funnel need
    creator: { type: String },
    domain_name: { type: String },
    funnel_name: { type: String },
    funnel_type: { type: String, default: "ecom" },
    date_modified: { type: Date, default: Date.now },
    page_count: { type: Number, default: 0 },
    // funnel basic settings
    funnel_use_email_confirmation: { type: Boolean, default: true },
    funnel_use_email_tracking: { type: Boolean, default: false },
    funnel_use_email_abandonment: { type: Boolean, default: false },
    funnel_is_phone_whatsapp: { type: Boolean, default: false },
    funnel_enable_floating_bar: { type: Boolean, default: false },
    funnel_enable_floating_bar_link: { type: String, default: '' },
    funnel_phone: { type: String },
    funnel_address: { type: String },
    funnel_email: { type: String },
    funnel_currency: { type: String },
    funnel_pixel_id: { type: String },
    funnel_favicon_link: { type: String },
    funnel_facebook_id: { type: String },
    funnel_facebook_access_token: { type: String },
    funnel_google_id: { type: String },
    funnel_tiktok_id: { type: String },
    funnel_everflow: { type: Boolean, default: false},
    funnel_snapchat_id: { type: String },
    // payment gateway
    gateway_selected_merchant: { type: String },
    gateway_stripe_public: { type: String },
    gateway_stripe_private: { type: String },
    gateway_other: { type: String },
    gateway_paypal_client_id: { type: String },
    // email integration
    integration_confirmation_email: { type: String },
    integration_abandonment_email: { type: String },
    integration_tracking_email: { type: String },
    integration_onhold_email: { type: String },
    // pushed product to funnel
    is_cod_funnel: { type: Boolean },
    is_not_shareable: { type: Boolean },
    is_fulfill_by_plg: { type: Boolean, default: true },
    old_page_ids: [{ type: String }],
    auto_generated_index: { type: String, unique: true }
});

module.exports = mongoose.model('FunnelList', FunnelListSchema);