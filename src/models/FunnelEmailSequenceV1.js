const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FunnelEmailSequenceV1 = new Schema({
    creator: { type: String },
    funnel_id: { type: String },
    delay: { type: String },
    message_type: { type: String },
    method: { type: String },
    email_subject: { type: String },
    editor_value: { type: String },
    message_id: { type: String }
});

module.exports = mongoose.model('FunnelEmailSequenceV1', FunnelEmailSequenceV1);