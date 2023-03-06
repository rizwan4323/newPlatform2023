const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    referralId: { type: String, unique: true },
    gaId: { type: String },
    fbId: { type: String },
    dealerId: { type: String },
    invitedBy: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    store_token: { type: String },
    store_url: { type: String },
    store_phone: { type: String },
    store_location_id: { type: String },
    favorites: [{
        prodid: { type: String },
        handle: { type: String },
        title: { type: String },
        src: { type: String },
        price: { type: String }
    }],
    help_request_message: [{
        message: { type: String },
        date_request: { type: Date },
        read: { type: Boolean },
        date_read: { type: Date }
    }],
    notification: [{
        type: { type: String },
        message: { type: String },
        date: { type: Date },
        isRead: { type: Boolean, default: false }
    }],
    one_time_missions: [{ type: String }],
    address_fv: [{ type: String }],
    dealerName: { type: String },
    phone: { type: String },
    city: { type: String },
    zip: { type: String },
    state: { type: String },
    kartra_tags: [{ type: String }],
    privilege: { type: Number, default: 0 },
    user_session_cookie: { type: String, default: '' },
    total_points: { type: Number, default: 0 },
    daily_points: new Schema({
        points: { type: Number },
        day: { type: Number }
    }),
    weekly_points: new Schema({
        points: { type: Number },
        week: { type: Number }
    }),
    reward_points: [{
        type: Schema.Types.ObjectId,
        ref: 'Points'
    }],
    total_gems: { type: Number, default: 0 },
    gems_list: [{
        type: Schema.Types.ObjectId,
        ref: 'Gems'
    }],
    count_pushToStore: { type: Number, default: 0 },
    count_pushWithBundle: { type: Number, default: 0 },
    count_addReview: { type: Number, default: 0 },
    count_copyPush: { type: Number, default: 0 },
    count_hotProducts: { type: Number },
    sales_rep_id: { type: String },
    sales_rep_date: { type: Date },
    sales_rep_notes: [{
        note: { type: String },
        date_time: { type: Date }
    }],
    total_exprenses: { type: String, default: '' },
    success_rebill: { type: Boolean, default: false },
    fb_link: { type: String, default: '' },
    bio: { type: String },
    profileImage: { type: String },
    kartra: { type: String },
    joinDate: { type: Date, default: Date.now },
    lastLoginDate: { type: Date },
    date_spin: { type: Date },
    pass_key: { type: String },
    isFulfillmentCenterUnlock: { type: Boolean, default: false },
    hasFulfillmentMessage: { type: Boolean, default: false },
    tos: { type: Boolean, default: false },
    isExtended: { type: Boolean, default: false },
    purchase_dfy: { type: Boolean, default: false },
    allowMultiConnectStore: { type: Boolean, default: false },
    recentPaid: { type: Boolean, default: false },
    listOfStore: [{
        store_token: { type: String },
        store_url: { type: String },
        store_phone: { type: String },
        store_location_id: { type: String },
        active: { type: Boolean, default: false }
    }],

    plg_balance: { type: Number, default: 0.0 },
    plg_topup_history: [{
        type: Schema.Types.ObjectId,
        ref: 'TopupLog'
    }],
    fbb_store_id: { type: String },
    pending_stock_id: [{ type: String }],
    funnel_genie_domains: [{ type: String }],
    access_tags: [{ type: String }],
    paypal_email: { type: String },
    // for fulfiller
    business_name: { type: String, default: '' },
    business_email: { type: String, default: '' },
    account_number: { type: String, default: '' },
    wire_transfer_number: { type: String, default: '' },
    bank_code: { type: String, default: '' },
    routing_number: { type: String, default: '' },
    account_type: { type: String, default: '' },
    address: { type: String, default: '' },
    investment_list: [{
        amount: { type: Number },
        date: { type: Date }
    }],
    investment_total: { type: Number },
    updater_id: { type: String },
    updater_name: { type: String },
    endpoint: { type: String },
    keys: Schema.Types.Mixed,
    // TODO :: FOR THE MASTERS AND STAFFS 
    masterIds: [{
        type: String,
        default: ""
    }],
    staffIds: [{
        type: String,
        default: ""
    }],
    // Payoneer Schema
    payoneer_details: new Schema({
        name: { type: String, default: "", required: true },
        address: { type: String, default: "", required: true },
        routing_number: { type: String, default: "", required: true },
        account_number: { type: String, default: "", required: true },
        account_type: { type: String, default: "", required: true },
        beneficiary_name: { type: String, default: "", required: true },
    }),
    // Commerce HQ
    commerceHQ: new Schema({
        storeName: { type: String, default: "", required: true },
        apiKey: { type: String, default: "", required: true },
        apiPassword: { type: String, default: "", required: true },
    })
});

UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);
            this.password = hash;

            next()
        })
    })
})


module.exports = mongoose.model('User', UserSchema);