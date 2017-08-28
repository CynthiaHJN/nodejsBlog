var moongoose = require('mongoose');

module.exports = new moongoose.Schema({
    name: String,
    remark: String
});