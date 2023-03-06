const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaidOrderSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date_paid: {type: Date},
    total_payment: {type: String},
    store_url: {type: String},
    store_token: {type: String},
    store_location_id: {type: String},
    payerID: {type: String},
    paymentID: {type: String},
    paymentToken: {type: String},
    isVerified: {type: Boolean, default: false},
    trackingNumberAvailable: {type: Boolean, default: false},
    orders: {type: String},
    trackingNumbers: [{ type: String, default: [] }],
    is_packed: [{ type: String, default: [] }],

    isRefactored: {type: Boolean, default: false},
    order_ids: [{ type: String, default: [] }]
});

module.exports = mongoose.model('PaidOrder', PaidOrderSchema);