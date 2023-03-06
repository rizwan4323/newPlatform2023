const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Messages = new Schema({
    sender_id: { type: String },
    sender_unread_count: { type: Number, default: 0 },
    receiver_id: { type: String, default: "" }, // empty receiver_id will sent to all admin
    receiver_unread_count: { type: Number, default: 0 },
    last_message: { type: String },
    last_message_date: { type: Date, default: Date.now },
    messages: [{
        date: { type: Date, default: Date.now },
        message: { type: String },
        replier_id: { type: String },
        additional_data: new Schema({
            funnel_id: { type: String },
            page_id: { type: String },
            product_link: { type: String },
            approved: { type: Boolean, default: false },
        }),
    }]
});

module.exports = mongoose.model('Messages', Messages);