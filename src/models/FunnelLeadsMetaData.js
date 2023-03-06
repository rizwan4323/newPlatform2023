const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FunnelLeadsMetaDataSchema = new Schema({
    creator: { type: String },
    leads_id: { type: String },
    meta_tag: { type: String },
    meta_note: { type: String }
});

module.exports = mongoose.model('FunnelLeadsMetaData', FunnelLeadsMetaDataSchema);