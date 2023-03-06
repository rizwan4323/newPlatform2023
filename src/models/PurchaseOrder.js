const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseOrderSchema = new Schema({
    po_date: { type: Date, default: Date.now },
    payment_terms: { type: String },
    affiliate_name: { type: String },
    affiliate_email: { type: String },
    affiliate_budget: { type: String },
    affiliate_commision: { type: Number },
    product_price: { type: Number },
    product_quantity: { type: Number },
    product_quantity_list: [{
        _id: { type: String },
        status: { type: String }
    }],
    product_variant_id: { type: String },
    // extras
    product_srp: { type: Number },
    fulfillment_cost: { type: Number },
    delivery_cost: { type: Number },
    vat: { type: Number },
    yabazoo: { type: Number },
    additional_cost: { type: Number },
    // for receiver (updating)
    received_quantity: { type: Number },
    receiver_email: { type: String },
    received_date: { type: Date },
    vendor_info: { type: String },
    ship_to_info: { type: String },
    note: { type: String },
    isApproved: { type: Boolean, default: false },

    // warn when low
    warnWhenLow: { type: Boolean },
    warnEmail: { type: String },
    warnQty: { type: Number },
    confirmationEmail: { type: String },

    // for transfering etc..
    fromTransferPOID: { type: String },
    returned_from_orderids: [{ type: String }]
});

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);