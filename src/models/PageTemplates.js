const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * to make it blend with the custom import legal page it must be devided or group breakdown
 * design , page-type, page_type === "generated_page" also with the path inherit it path: "terms-of-service",
 * 
 * 
 * 
 */
const PageTemplatesSchema = new Schema({
    creator: {type: String},
    description: {type: String},
    design: {type: String},
    screenshot_link: {type: String},
    screenshot_link_preview: {type: String},
    type: {type: String},
    date: {type: Date, default: Date.now},
});

module.exports = mongoose.model('PageTemplates', PageTemplatesSchema);