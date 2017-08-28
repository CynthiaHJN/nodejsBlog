var moongoose = require('mongoose');

module.exports = new moongoose.Schema({
    name: String,
    remark: String,
    article_num:{
    	type:Number,
    	default:0
    }
});