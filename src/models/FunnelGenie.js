const FunnelGenieID = require('./FunnelGenieID');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FunnelGenieSchema = new Schema({
    creator: { type: Schema.Types.ObjectId },
    date_created: { type: Date, default: Date.now },
    domainIndex: { type: Number, default: 0 },
    funnel_name: { type: String },
    page_type: { type: String, default: 'page' },
    path: { type: String },
    design: [{
        date: { type: String },
        publish: { type: Boolean, default: false },
        json: { type: String },
        screenshotURL: { type: String }
    }],

    split_design: { type: String },
    split_bias: { type: Number },
    split_screenshot: { type: String },
    split_notes: { type: String, default: ',' },
    
    pageID: { type: String },

    sendPLGEmailConfirmation: { type: Boolean, default: true },
    sendPLGEmailAbandonment: { type: Boolean, default: false },
    funnel_type: { type: String, default: 'blank' },
    funnel_phone: { type: String, default: '' },
    funnel_isWhatsApp: { type: Boolean, default: false },
    funnel_address: { type: String, default: '' },
    funnel_email: { type: String, default: '' },
    funnel_pixelID: { type: String, default: '' },
    funnel_ga: { type: String, default: '' }, // ga used as all analytics except footer
    funnel_fga: { type: String, default: '' }, // footer analytics
    favicon_link: { type: String, default: '' }, // favicon link
    facebook_id: { type: String, default: '' }, // facebook pixel id
    google_id: { type: String, default: '' }, // google analytics id
    tiktok_id: { type: String, default: '' }, // tiktok analytics id
    snapchat_id: { type: String, default: '' }, // snapchat analytics id
    funnel_selected_merchant: { type: String, default: '' },
    funnel_stripe_public: { type: String, default: '' },
    funnel_stripe_private: { type: String, default: '' },
    funnel_other: { type: String, default: '' },
    isRoot: { type: Boolean, default: false },
    enableLoader: { type: Boolean, default: false },
    selectedModalAction: { type: String },

    page_title: { type: String, default: '' },
    page_description: { type: String, default: '' },
    page_og_image_link: { type: String, default: '' },
    page_keyword: { type: String, default: '' },
    
    paypalClientID: { type: String, default: '' },
    
    confirmationEmail: { type: String, default: '' },
    abandonmentEmail: { type: String, default: '' },
    trackingEmail: { type: String, default: '' },
    isCOD: { type: Boolean }
});

FunnelGenieSchema.pre('save', async function(next) {
    // for creating a page
    await FunnelGenieID.findOneAndUpdate({creator: this.creator, funnel_name: this.funnel_name, domainIndex: this.domainIndex}, {$push: {page_ids: this._id.toString()}});
    next()
})

FunnelGenieSchema.pre('remove', async function(next) {
    // for removing a page or funnel
    FunnelGenieID.findOneAndUpdate({creator: this.creator, funnel_name: this.funnel_name, domainIndex: this.domainIndex}, {$pull: {page_ids: this._id.toString()}}).then(res => {
        if(res.page_ids.length <= 1) FunnelGenieID.findById(res._id).remove().exec();
        next()
    });
})

module.exports = mongoose.model('FunnelGenie', FunnelGenieSchema);