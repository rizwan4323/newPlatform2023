const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PendingJob = new Schema({
    order_creator: { type: String },
    data: { type: Object }
});

module.exports = mongoose.model('PendingJob', PendingJob);