const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const FunnelIntegration = new Schema({
    creator: { type: String },
    funnelSource: { type: String },
    delay: { type: String },
    messageType: { type: String },
    method: { type: String },
    emailSubject: { type: String },
    editorValue: { type: String },
    messageID: { type: String }
});

module.exports = mongoose.model('FunnelIntegration', FunnelIntegration);