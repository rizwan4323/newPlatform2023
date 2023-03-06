const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailSequence = new Schema({
    creator: { type: String },
    funnelSource: { type: String },
    sequence_name: { type: String },
    sequence_tags: { type: String },
    content: [{
        delay: { type: String },
        messageType: { type: String },
        emailSubject: { type: String },
        editorValue: { type: String },
        asid: { type: String },
        atkn: { type: String },
        sender: { type: String }
    }],
    return_sequence_id: { type: String } // from stats.productlistgenie.io
});

module.exports = mongoose.model('EmailSequence', EmailSequence);