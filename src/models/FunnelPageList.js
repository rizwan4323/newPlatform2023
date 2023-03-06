const mongoose = require('mongoose');
const FunnelList = require('./FunnelList');
const Schema = mongoose.Schema;

const FunnelPageListSchema = new Schema({
    // basic funnel page need
    funnel_id: { type: String },
    published_page_id: { type: String },
    page_type: { type: String, default: 'page' },
    path: { type: String },
    design: [{
        date: { type: String },
        publish: { type: Boolean, default: false },
        json: { type: String },
        screenshot_url: { type: String }
    }],
    date_modified: { type: Date, default: Date.now },
    // split page
    split_design: { type: String },
    split_bias: { type: Number },
    split_screenshot: { type: String },
    split_notes: { type: String, default: ',' },
    // page settings
    page_is_root: { type: Boolean, default: false },
    page_enable_loader: { type: Boolean, default: false },
    page_selected_modal_action: { type: String },
    page_title: { type: String },
    page_description: { type: String },
    page_og_image_link: { type: String },
    page_keyword: { type: String },
    funnel_header_analytics: { type: String },
    funnel_footer_analytics: { type: String }
});

// to increment page_count of funnel
FunnelPageListSchema.pre('save', async function(next) {
    await FunnelList.findByIdAndUpdate({ _id: this.funnel_id }, { $inc: { page_count: 1 } });
    next()
})

// to decrement page_count of funnel
FunnelPageListSchema.pre('remove', async function(next) {
    await FunnelList.findByIdAndUpdate({ _id: this.funnel_id }, { $inc: { page_count: -1 } });
    next()
})

module.exports = mongoose.model('FunnelPageList', FunnelPageListSchema);