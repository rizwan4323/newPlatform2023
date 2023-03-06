const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewFulfillmentChinaSchema = new Schema({
    date_requested: {type: Date, default: Date.now},
    date_approved: {type: Date},
    date_denied: {type: Date},
    date_paid: {type: Date},
    denied_note: {type: String},
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    isRequest: {type: Boolean, default: true},
    isApproved: {type: Boolean, default: false},
    isDenied: {type: Boolean, default: false},
    isPaid: {type: Boolean, default: false},
    isFinish: {type: Boolean, default: false},
    orders: {type: String},
    shipment_id: {type: String},
    tracking_number: {type: String},

    order_id: {type: String},
    isRefactored: {type: Boolean, default: false},
    isRejected: {type: Boolean, default: false},
    isEdited: {type: Boolean, default: false},
    order_note: {type: String},
    shipping_information: new Schema({
        order_number: {type: String},
        company: {type: String},
        address1: {type: String},
        address2: {type: String},
        city: {type: String},
        country: {type: String},
        country_code: {type: String},
        province: {type: String},
        province_code: {type: String},
        zip: {type: String},
        email: {type: String},
        name: {type: String},
        phone: {type: String},
    }),
    line_items: [{
        stockid_used: { type: String },
        line_item_id: {type: String},
        product_id: {type: String},
        variant_id: {type: String},
        product_name: {type: String},
        variant_name: {type: String},
        quantity: {type: Number},
        weight: {type: Number},
        chinese_description: {type: String},
        dg_code: {type: String},
        height: {type: String},
        width: {type: String},
        length: {type: String},
        approve_price: {type: String},
        original_price: {type: String},
        vendor_link: {type: String},
        boxC_product_id: {type: String}
    }],
    shipping_cost: {type: String},
    shipping_method: {type: String},
    shipping_days_min: {type: Number},
    shipping_days_max: {type: Number},
    shipping_service: {type: String},
    exported: {type: Boolean, default: false}
});

module.exports = mongoose.model('NewFChina', NewFulfillmentChinaSchema);