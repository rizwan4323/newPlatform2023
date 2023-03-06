const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeadsSchema = new Schema({
    name: {type: String},
    email: {type: String},
    invitedBy: {type: String},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Leads', LeadsSchema);