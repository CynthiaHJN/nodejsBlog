var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    // 关联字段
    category: {
        // Object类型
        type: mongoose.Schema.Types.ObjectId,
        // 引用，实际上是说，存储时根据关联进行索引出分类目录下的值。而不是存进去的值。
        ref: 'Category'
    },
    title: String,
    description: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    views: {
        type: Number,
        default: 0
    },
    date: String,
    comments: {
        type: Array,
        default: []
    }
});