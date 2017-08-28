var mongoose = require("mongoose");

module.exports = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    telphone: String,
    headpic: String,
    intro: String,
    // 是否管理员
    isAdmin: {
        type: Boolean,
        default: false
    },
    concerns: {
        type: Array,
        default: []
    },
    fans: {
        type: Array,
        default: []
    }
});