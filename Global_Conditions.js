module.exports = { // User Privilege
    // start related to access_tags or kartra_tags
    has_arabic_funnel: user_object => {
        if (!user_object) return false;
        let required_kartra_tag = ["Custom Arabic Funnel", "90 Day Bootcamp 2x1", "Publish_All"]; // maalin
        let has_access = user_object.access_tags.includes("xvip") || user_object.privilege === 10;
        if (!has_access) has_access = user_object.kartra_tags.filter(tag => required_kartra_tag.includes(tag)).length !== 0;
        return has_access;
    },
    has_funnel_subscriber: (user_object, tag_subscription) => {
        if (!user_object) return false;
        let required_access_tag = ["fa_subscriber", "fc_subscriber"]; // maalin
        let has_access = user_object.privilege === 10;
        if (!has_access) has_access = user_object.access_tags.filter(tag => required_access_tag.includes(tag)).length !== 0;
        if (tag_subscription) has_access = user_object.access_tags.filter(tag => tag === tag_subscription).length !== 0;
        return has_access;
    },
    has_local_tag: (user_object, tag_required) => {
        if (!user_object) return false;
        let has_access = user_object.privilege === 10;
        if (!has_access) has_access = user_object.access_tags.filter(tag => tag === tag_required).length !== 0;
        return has_access;
    },
    is_exclusive_vip_user: user_object => {
        if (!user_object) return false;
        let required_access_tag = ["xvip"]; // maalin
        let has_access = user_object.privilege === 10;
        if (!has_access) has_access = user_object.access_tags.filter(tag => required_access_tag.includes(tag)).length !== 0;
        return has_access;
    }
    // end related to access_tags or kartra_tags
}