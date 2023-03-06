const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IntegrationSchema = new Schema({
    creator: { type: Schema.Types.ObjectId },
    merchant_type: {type: String, default: '', required: true},
    merchant_name: {type: String, default: '', required: true},
    public_key: {type: String, default: ''},
    private_key: {type: String, default: '', required: true},
    other: {type: String, default: ''}
});

module.exports = mongoose.model('Integration', IntegrationSchema);