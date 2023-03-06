const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PointsSchema = new Schema({
    source: {type: String, default: 'N/A'},
    points: {type: Number, default: 0},
    date: {type: Date, default: Date.now},
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Points', PointsSchema);