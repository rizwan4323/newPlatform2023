const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FunnelGenieIDSchema = new Schema({
    creator: { type: String },
    page_ids: [{ type: String }],
    funnel_name: { type: String },
    domainIndex: { type: Number, default: 0 }
});

module.exports = mongoose.model('FunnelGenieID', FunnelGenieIDSchema);