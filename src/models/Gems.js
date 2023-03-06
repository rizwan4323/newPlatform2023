const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GemsSchema = new Schema({
    source: {type: String},
    gems: {type: Number, default: 0},
    date: {type: Date, default: Date.now},
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Gems', GemsSchema);