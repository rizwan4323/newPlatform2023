const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FunnelEmailSequenceV2 = new Schema({
    creator: { type: String },
    funnel_id: { type: String },
    sequence_name: { type: String },
    sequence_tags: { type: String },
    content: [{
        order: { type: Number },
        delay: { type: String },
        message_type: { type: String },
        email_subject: { type: String },
        editor_value: { type: String },
        asid: { type: String },
        atkn: { type: String },
        sender: { type: String }
    }],
    return_sequence_id: { type: String } // from stats.productlistgenie.io
});

module.exports = mongoose.model('FunnelEmailSequenceV2', FunnelEmailSequenceV2);