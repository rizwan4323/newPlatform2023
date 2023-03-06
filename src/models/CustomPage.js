const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomPageSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    page_lock_by_tag: {type: Boolean},
    page_lock_by_privilege: {type: Boolean},
    page_tag: {type: String},
    page_icon: {type: String},
    page_name: {type: String},
    page_content: {type: String},
    page_privilege_from: {type: Number},
    page_privilege_to: {type: Number}
});

module.exports = mongoose.model('CustomPage', CustomPageSchema);