const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeneratedbuttonSchema = new Schema({
    creator: {
        type: String
    },
    buttonTitle: { type: String, default: "Button" },
    injectedStyle: {
        type: String,
        required: true,
    },
    productName : {
        type: String,
        default: ""
    },
    productDescription: {
        type: String,
        default: ""
    },
    buttonLabelText: {
        type: String,
        default: ""
    },
    redirectURI: {
        type: String,
        default: ""
    },
    buttonID: {
        type: String,
    },
    amount: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    rawButton: { type: String }
});



module.exports = mongoose.model('Generatedbuttons', GeneratedbuttonSchema);