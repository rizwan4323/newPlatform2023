const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    isLive: { type: Boolean, default: false },
    liveLink: { type: String },
    custom_page: [{
        order: { type: Number },
        active: { type: Boolean },
        navigation_name: { type: String },
        navigation_type: { type: String, default: 'trainings' },
        description: { type: String },
        img_url: { type: String },
        content: [{
            type: Schema.Types.ObjectId,
            ref: 'CustomPage'
        }],
        createdAt: { type: Date, default: Date.now }
    }],
    million_dollar_training: [{
        tag: { type: String },
        vimeo_id: { type: Number },
        introduction_title: { type: String },
        introduction_description: { type: String },
        upsell_link: { type: String }
    }],
    mystery_product_url: { type: String },
    homepage_video_full: { type: String, default: '' },
    homepage_message_full: { type: String, default: '' },
    homepage_video_trial: { type: String, default: '' },
    homepage_message_trial: { type: String, default: '' }
});

module.exports = mongoose.model('Admin', AdminSchema);