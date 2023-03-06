const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FunnelProductSchema = new Schema({
    lastEditedByID: { type: String },
    lastEditedByName: { type: String },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date },
    quantity: { type: Number, default: 0 },
    productName: { type: String, unique: true },
    productCost: { type: Number },
    productSku: { type: String, unique: true }, // become description
    productSrp: { type: Number },
    productDeliveryCost: { type: Number },
    productFivePercentDuty: { type: Number }, // tax percentage
    fulfillmentCost: { type: Number },
    affiliateEmail: { type: String, default: '' },
    affiliateCost: { type: Number },
    funnelDesign: { type : Array , "default" : [] },
    yabazoo: { type: Number, default: 0 },
    po_ids: [{ type: String }],
    po_data: {
        type: Schema.Types.ObjectId,
        ref: 'PurchaseOrder'
    },
    is_active: { type: Boolean, default: true }
});

module.exports = mongoose.model('FunnelProduct', FunnelProductSchema);