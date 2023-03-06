const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FunnelBlocksSchema = new Schema({
    creator: { type: String },
    data: { type: String },
    display_mode: { type: String },
    category: { type: String },
    tags: [{ type: String }]

});

module.exports = mongoose.model('FunnelBlocks', FunnelBlocksSchema);