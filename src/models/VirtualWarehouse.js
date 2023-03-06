const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VirtualWarehouseSchema = new Schema({
    creator: { type: Schema.Types.ObjectId },
    stockid: { type: String },
    chinese_description: { type: String },
    name: { type: String },
    qty: { type: Number},
    dimension_height: { type: String },
    dimension_width: { type: String },
    dimension_length: { type: String },
    dg_code: { type: String },
    weight: { type: String },
    price: { type: String },
    vendor_link: { type: String },
    isPaid: {type: Boolean}
});

module.exports = mongoose.model('VirtualWarehouse', VirtualWarehouseSchema);