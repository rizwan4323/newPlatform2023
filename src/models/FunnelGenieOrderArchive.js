const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FunnelGenieOrderArchiveSchema = new Schema({
    creator: { type: Schema.Types.ObjectId },
    ref_id: { type: String },
    orderCreator: { type: String },
    safeArrivalID: { type: String },
    order_date: { type: Date, default: Date.now },
    merchant_type: { type: String },
    paid_cc: {type: Boolean, default: false},
    order_status: { type: String },
    cancel_note: { type: String, default: '' },
    currencyWord: {type: String, default: 'USD'},
    currencySymbol: {type: String, default: '$'},
    shipping_information: new Schema({
        email: {type: String},
        name: {type: String},
        phone: {type: String},
        street1: {type: String},
        street2: {type: String},
        city: {type: String},
        state: {type: String}, // region or state or province
        zip: {type: String},
        country: {type: String},
        address_type: {type: String, default: ""},
        aptOffice: {type: String, default: ""},
        bldgVilla: {type: String, default: ""},
        nearestLandmark: {type: String, default: ""}
    }),
    line_items: {
        shopify_order_id: {type: String},
        shopify_order_number: {type: String},
        shopify_variant_id: {type: String},
        title: {type: String},
        variant: {type: String},
        quantity: {type: Number},
        plg_sku: {type: String},
        plg_serialNumber: [{type: String}],
        description: {type: String},
        price: {type: Number},
        tracking_number: {type: String, default: ''},
        tracking_link: { type: String, default: '' },
        cost_of_goods: { type: Number, default: 0 },
        ref_track: { type: String, default: '' }
    },
    fulfillment_status: {type: String, default: 'unfulfilled'},
    order_status_update: {type: Date},
    risk_level: { type: String },
    test_data: { type: Boolean },
    funnel_source_id: { type: String },
    sync_from: { type: String, default: '' }, // safearrival
    sms_verified: { type: Boolean, default: false },
    raw_data: { type: String },
    // logs
    updateById: { type: String },
    updateByName: { type: String },
    fieldsModified: { type: String },
    dateStatusDelivered: { type: Date },
    dateCourierCollected: { type: Date },
    source_link: { type: String },
    isPaidCommision: { type: Boolean, default: false },
    isPaidProductCost: { type: Boolean, default: false },
    fulfill_with_plg: { type: Boolean, default: true }, // dahil ung mga old value dapat fulfillable parin at ksma sa statistic
    campaign_src: { type: String},
    received_payment_from_courier: { type: Boolean, default: false },
    isManualModified: { type: Boolean, default: false },
    restore_marker: { type: String, default: "" }
});

module.exports = mongoose.model('FunnelGenieOrderArchive', FunnelGenieOrderArchiveSchema);