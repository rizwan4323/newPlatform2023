const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    senderID: { type: Schema.Types.ObjectId },
    seen: {type: Boolean},
    newChatCount: {type: Number, default: 0},
    messages: [
        {
            date: {type: Date},
            text: {type: String},
            from: {type: String},
            isFromQuote: {type: Boolean, default: false},
            isFromBulkQuote: {type: Boolean, default: false},
            // for default popup value
            default_chinese_description: {type: String},
            default_weight: {type: String},
            default_dg_code: {type: String},
            default_dimension_height: {type: String},
            default_dimension_width: {type: String},
            default_dimension_length: {type: String},
            default_price: {type: String}
        }
    ]
});

module.exports = mongoose.model('Conversation', ConversationSchema);