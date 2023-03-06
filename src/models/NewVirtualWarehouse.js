const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewVirtualWarehouseSchema = new Schema({
    creator: { type: Schema.Types.ObjectId },
    chinese_description: { type: String },
    product_name: { type: String },
    variants: [{
        variant_id: {type: String},
        variant_name: {type: String},
        original_price: {type: String},
        approve_price: {type: Number},
        dg_code: {type: String},
        quantity: {type: Number},
        boxc_product_id: {type: String}
    }],
    boxc_inbound_id: {type: String},
    isFinish: { type: Boolean, default: false }
});

module.exports = mongoose.model('NewVirtualWarehouse', NewVirtualWarehouseSchema);