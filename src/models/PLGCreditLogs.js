const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CreditLogsSchema = new Schema({
    date_paid: {type: Date},
    total_cost: {type: Number},
    description: {type: String},
    increase: {type: Boolean, default: false},
    creator: {type: Schema.Types.ObjectId}
});

module.exports = mongoose.model('CreditLog', CreditLogsSchema);