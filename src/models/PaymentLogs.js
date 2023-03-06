const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentLogsSchema = new Schema({
    id: {type: String},
    summary: {type: String},
    parent_payment: {type: String},
    update_time: {type: Date},
    total_amount: {type: String},
    amount_currency: {type: String},
    create_time: {type: Date},
    clearing_time: {type: Date},
    state: {type: String},
    creator: { type: Schema.Types.ObjectId }
});

module.exports = mongoose.model('PaymentLog', PaymentLogsSchema);