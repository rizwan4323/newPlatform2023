const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FunnelProductDesignSchema = new Schema({
    product_id: { type: String },
    design_name: { type: String },
    design_list: [{
        path: { type: String },
        page_type: { type: String },
        design_string_object: { type: String },
        upload_by: { type: String }
    }],
    created_by: { type: String }
});

module.exports = mongoose.model('FunnelProductDesign', FunnelProductDesignSchema);