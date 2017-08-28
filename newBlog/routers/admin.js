var express = require("express");
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Categories');
var Content = require('../models/Content');
// 首页
router.get('/', function(req, res, next) {
    res.render("admin/index");
});
router.post('/', function(req, res, next) {});

// 用户管理
// 用户列表
router.get('/user/', function(req, res, next) {
    var page = req.query.page || 1;
    var limit = 5;
    var count = 0;
    User.count().then(function(_count) {
        count = _count;
        var pages = Math.ceil(count / limit);

        page = Math.min(page, pages);
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function(user) {
            res.render('admin/user_index', {
                users: user,
                page: page,
                pages: pages,
                limit: limit,
                count: count,
                type: "user"
            });
        });
    });
});
router.post('/user/', function(req, res, next) {});

// 分类管理
// 分类目录
router.get('/category/', function(req, res, next) {
    var page = req.query.page || 1;
    var limit = 5;
    var count = 0;
    Category.count().then(function(_count) {
        count = _count;
        var pages = Math.ceil(count / limit);

        page = Math.min(page, pages);
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;

        Category.find().limit(limit).skip(skip).then(function(categories) {
            res.render('admin/category_index', {
                categories: categories,
                page: page,
                pages: pages,
                limit: limit,
                count: count,
                type: "category"
            });
        });
    });
});
router.post('/category/', function(req, res, next) {});
// 分类添加
router.get('/category/add', function(req, res, next) {
    res.render('admin/category_add');
});
router.post('/category/add', function(req, res, next) {
    var name = req.body.name || '';
    var remark = req.body.remark || '';
    if (name === '') {
        res.render('admin/error', {
            message: '提交的内容不能为空!',
            operation: {
                url: 'javascript:window.history.back();',
                operation: '返回上一步'
            }
        });
    } else {
        Category.findOne({
            name: name
        }).then(function(rs) {
            if (rs) {
                res.render('admin/error', {
                    message: '数据库已经有该分类了哦。',
                    operation: {
                        url: 'javascript:window.history.back();',
                        operation: '返回上一步'
                    }
                });
                return Promise.reject();
            } else {
                return new Category({
                    name: name,
                    remark: remark,
                }).save();
            }
        }).then(function(newCategory) {
            res.render('admin/success', {
                message: '分类保存成功！',
                operation: {
                    url: 'javascript:window.history.back()',
                    operation: '返回上一步'
                }
            });
        });
    }
});
// 分类编辑
router.get('/category/edit', function(req, res, next) {
    var id = req.query.id || '';
    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                message: '分类信息不存在!'
            });
            return Promise.reject();
        } else {
            res.render('admin/edit', {
                category: category
            });
        }
    })
});
router.post('/category/edit/', function(req, res, next) {
    var id = req.query.id || '';
    var name = req.body.name || name;
    var remark = req.body.remark || remark;
    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                message: '分类信息不存在！'
            });
            return Promise.reject();
        } else {
            Category.findOne({
                _id: { $ne: id },
                name: name
            }).then(function(same) {
                if (same) {
                    res.render('admin/error', {
                        message: '已存在同名的分类信息！'
                    });
                    return Promise.reject();
                } else {
                    Category.update({
                        _id: id
                    }, { name: name, remark: remark }).then(function() {
                        res.render('admin/success', {
                            message: '修改成功',
                            operation: {
                                url: '/admin/category',
                                operation: '返回分类管理'
                            }
                        })
                    });
                }
            })
        }
    })
});
// 分类删除
router.get('/category/delete', function(req, res, next) {
    var id = req.query.id;

    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                message: '数据库中不存在该分类',
                operation: {
                    url: '/admin/category',
                    operation: '返回分类管理'
                }
            });
            return Promise.reject();
        } else {
            return Category.remove({
                _id: id
            });
        }
    }).then(function() {
        res.render('admin/success', {
            message: '数删除分类成功',
            operation: {
                url: '/admin/category',
                operation: '返回分类管理'
            }
        });
    });
});
router.post('/category/delete', function(req, res, next) {});

// 文章管理
// 内容列表
router.get('/content/', function(req, res, next) {
    var page = req.query.page || 1;
    var limit = 5;
    var count = 0;
    Content.count().then(function(_count) {
        count = _count;
        var pages = Math.ceil(count / limit);

        page = Math.min(page, pages);
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;

        var newObject = "category" ? Content.find().sort({ _id: -1 }).limit(limit).skip(skip).populate("category") : Content.find().sort({ _id: -1 }).limit(limit).skip(skip);

        newObject.then(function(contents) {
            res.render('admin/content_index', {
                contents: contents,
                page: page,
                pages: pages,
                limit: limit,
                count: count,
                type: "content"
            });
        });
    });
});
router.post('/content/', function(req, res, next) {});
// 添加文章
router.get('/content/add', function(req, res, next) {
    Category.find().then(function(categories) {
        res.render('admin/content_add', {
            categories: categories
        });
    })
});
router.post('/content/add', function(req, res, next) {
    if (req.body.categories.trim() == '') {
        res.render('admin/error', {
            message: '分类信息不存在'
        });
        return Promise.reject();
    }

    if (req.body.name.trim() == '') {
        res.render('admin/error', {
            message: '标题不能为空'
        });
        return Promise.reject();
    }

    if (req.body.description.trim() == '') {
        res.render('admin/error', {
            message: '简介不能为空'
        });
        return Promise.reject();
    }

    if (req.body.content.trim() == '') {
        res.render('admin/error', {
            message: '内容不能为空'
        });
        return Promise.reject();
    }

    new Content({
        category: req.body.categories,
        title: req.body.name,
        description: req.body.description,
        content: req.body.content,
        date: new Date().toDateString()
    }).save().then(function() {
        res.render('admin/success', {
            message: '文章发布成功',
            operation: {
                url: '/admin/content',
                operation: '返回分类管理'
            }
        });
    });
});
// 文章修改
router.get('/content/edit', function(req, res, next) {
    var id = req.query.id;
    Content.findOne({ _id: id }).then(function(content) {
        if (!content) {
            res.render('admin/error', {
                message: '该文章已被删除'
            });
            return Promise.reject();
        } else {
            Category.find().then(function(categories) {
                res.render('admin/content_edit', {
                    categories: categories,
                    content: content
                });
            });
        }
    });
});
router.post('/content/edit/', function(req, res, next) {
    var id = req.query.id || '';
    Content.findOne({
        _id: id
    }).then(function(content) {
        if (!content) {
            res.render('admin/error', {
                message: "该文章已被删除"
            });
            return Promise.reject();
        } else {
            return Content.update({
                _id: id
            }, {
                category: req.body.categories,
                title: req.body.name,
                description: req.body.description,
                content: req.body.content,
            });
        }
    }).then(function() {
        res.render('admin/success', {
            message: '修改成功！',
            operation: {
                url: '/admin/content',
                operation: '返回分类管理'
            }
        });
    });
});
// 文章删除
router.get('/content/delete', function(req, res, next) {
    var id = req.query.id || '';
    Content.remove({ _id: id }).then(function() {
        res.render('admin/success', {
            message: '删除成功',
            operation: {
                url: '/admin/content',
                operation: '返回分类管理'
            }
        });
    })
});
router.post('/content/delete', function(req, res, next) {});

// 评论管理
// 评论列表
router.get('/comment', function(req, res, next) {});
router.post('/comment', function(req, res, next) {});
// 评论删除
router.get('/comment/delete', function(req, res, next) {});
router.post('/comment/delete', function(req, res, next) {});

module.exports = router;