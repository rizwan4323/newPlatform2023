const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewOrdersIDSchema = new Schema({
    orders_id: [{ type: String }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('newordersid', NewOrdersIDSchema);