const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopupLogsSchema = new Schema({
    isVerified: { type: Boolean, default: false },
    date_paid: {type: Date},
    total_topup: {type: Number},
    payerID: {type: String},
    paymentID: {type: String},
    paymentToken: {type: String},
    creator: { type: Schema.Types.ObjectId }
});

module.exports = mongoose.model('TopupLog', TopupLogsSchema);