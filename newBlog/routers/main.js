var express = require("express");
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Categories');
var Content = require('../models/Content');

// 首页
router.get('/', function(req, res, next) {
    if (req.session.userInfo) {
        // console.log('session:' + req.session.userInfo._id);
        res.locals.userInfo = req.session.userInfo;
    }
    res.render("main/index", {
        userInfo: req.session.userInfo
    });
});
router.post('/', function(req, res, next) {
    if (req.session.userInfo) {
        // console.log('session:' + req.session.userInfo._id);
        res.locals.userInfo = req.session.userInfo;
    }
    res.render("main/index", {
        userInfo: req.session.userInfo
    });
});

// 内容页
router.get('/view', function(req, res, next) {});
router.post('/view', function(req, res, next) {});

//文章列表
router.get('/view/article', function(req, res, next) {
    var newObject = "category" ? Content.find().sort({ _id: -1 }).populate("category") : Content.find().sort({ _id: -1 });
    var newObj = "user" ? newObject.populate("user") : newObject;
    newObj.then(function(contents) {
    	Category.find().limit(5).then(function(category){
	    	res.render('main/article', {
	        	userInfo: req.session.userInfo,
	        	contents: contents,
	        	categories:category
	        });
    	});
    });
});
router.post('/view/article', function(req, res, next) {});

// 添加文章
router.get('/view/article_add', function(req, res, next) {
    var userInfo = req.session.userInfo;
    // console.log(userInfo);
    if (userInfo == null) {
        res.render('main/index');
    } else {
        var newObject = "category" ? Content.find({ user: userInfo._id }).sort({ _id: -1 }).populate("category") : Content.find({ user: userInfo._id }).sort({ _id: -1 });
        newObject.then(function(contents) {
            res.render('main/article_add', {
                userInfo: req.session.userInfo,
                contents: contents
            });
        });
    }
    // var userInfo = req.session.userInfo;
    // if (id === '') {
    //     var newObject = "category" ? Content.find({ user: userInfo._id }).sort({ _id: -1 }).populate("category") : Content.find({ user: userInfo._id }).sort({ _id: -1 });
    //     newObject.then(function(contents) {
    //         res.render('main/article_add', {
    //             userInfo: req.session.userInfo,
    //             contents: contents
    //         });
    //     });
    // } else {
    //     var newObject = "category" ? Content.find({ user: userInfo._id }).sort({ _id: -1 }).populate("category") : Content.find({ user: userInfo._id }).sort({ _id: -1 });
    //     newObject.then(function(contents) {
    //         return Content.findOne({ _id: id });
    //     }).then(function(article) {
    //         res.render('main/article_add', {
    //             userInfo: req.session.userInfo,
    //             contents: contents,
    //             article: article
    //         });
    //     });
    // }
});
router.post('/view/article_add', function(req, res, next) {
    var title = req.body.title || '';
    var content = req.body.content || '';
    var category = req.body.category || '';
    var description = req.body.description || '';
    var user = req.session.userInfo._id;
    console.log(user);
    if (title === '' || content === '') {
        res.json({
            message: '标题或内容不能为空！'
        });
    } else {
        Category.findOne({
            name: category
        }).then(function(rs) {
            console.log("rs:" + rs);
            if (rs) {
                return rs;
            } else {
                var newCategory = new Category({
                    name: category
                });
                return newCategory.save();
            }
        }).then(function(newRs) {
            console.log("newRs" + newRs);
            var categoryId = newRs._id;
            var article = new Content({
                category: categoryId,
                title: title,
                description: description,
                content: content,
                user: user,
                date: new Date().toDateString()
            });
            return article.save();
        }).then(function() {
            res.json({
                message: "文章保存成功！"
            })
        });
    }
});

//查看某一篇文章
router.get('/view/article_detail', function(req, res, next) {
    var id = req.query.id || '';
    if (id === '') {
        res.render('main/article_detail', {
            userInfo: req.session.userInfo,
            content: ''
        });
    }
    Content.findOne({ _id: id }).then(function() {

    });

    var newObj = "user" ? Content.findOne({ _id: id }).populate("user") : Content.findOne({ _id: id });
    newObj.then(function(content) {
        res.render('main/article_detail', {
            userInfo: req.session.userInfo,
            content: content
        });
    })
});

router.post('/view/article_detail', function(req, res, next) {
    var id = req.query.id || '';
    var comment = req.body.commentP || '';
    if (req.session.userInfo == null) {
        res.render('main/index');
        return Promise.reject();
    }
    if (id === '') {
        res.render('main/article_detail', {
            userInfo: req.session.userInfo,
            content: ''
        });
        return Promise.reject();
    } else {
        Content.findOne({
            _id: id
        }).then(function(result) {
            var postData = {
                username: req.session.userInfo.username,
                postTime: new Date().toDateString(),
                content: comment
            };
            result.comments.push(postData);
            return result.save();
        }).then(function(newContent) {
            var newObj = "user" ? Content.findOne({ _id: id }).populate("user") : Content.findOne({ _id: id });
            newObj.then(function(newCnt) {
                res.render('main/article_detail', {
                    userInfo: req.session.userInfo,
                    content: newCnt
                });
            });
        });
    }
});

// 关注他人
router.post('/view/article_detail/concern', function(req, res, next) {
    var authorId = req.body.authorId || '';
    User.findOne({ _id: authorId }).then(function(UserInfo) {
        if (!UserInfo) {
            res.json({
                message: '你需要关注的用户不存在'
            });
            return Promise.reject();
        } else {
            var postData = {
                userInfo: req.session.userInfo
            };
            UserInfo.fans.push(postData);
            return UserInfo.save();
        }
    }).then(function(newUserInfo) {
        console.log(newUserInfo);
        User.findOne({ _id: req.session.userInfo._id }).then(function(result) {
            var postData = {
                userInfo: {
                    _id: newUserInfo._id,
                    username: newUserInfo.username,
                    telphone: newUserInfo.telphone,
                    headpic: newUserInfo.headpic
                }
            };
            result.concerns.push(postData);
            return result.save();
        }).then(function() {
            res.json({
                message: '关注成功'
            })
        });
    });
});

// 取消关注
router.post('/view/article_detail/cancleConcern', function(req, res, next) {
    var authorId = req.body.authorId || '';
    // console.log("authorId:" + authorId);
    User.findOne({ _id: authorId }).then(function(ConcernInfo) {
        User.findOne({ _id: req.session.userInfo._id }).then(function(UserInfo) {
            console.log("UserInfo:" + UserInfo.concerns);
            var postData = {
                userInfo: {
                    _id: ConcernInfo._id,
                    username: ConcernInfo.username,
                    telphone: ConcernInfo.telphone,
                    headpic: ConcernInfo.headpic
                }
            };
            console.log("postData:" + postData);
            UserInfo.concerns.remove(postData);
            console.log("UserInfo concerns:" + UserInfo.concerns);
            return UserInfo.save();
        }).then(function() {
            var postData = {
                userInfo: req.session.userInfo
            }
            ConcernInfo.fans.remove(postData);
            console.log("ConcernInfo fans:" + ConcernInfo.fans);
            return ConcernInfo.save();
        }).then(function() {
            res.json({
                message: '成功取关'
            })
        });
    });
});


// 发表评论
// router.post('/view/article_detail/comment', function(req, res, next) {
//     var id = req.query.id || '';
//     var comment = req.body.comment || '';
//     if (req.session.userInfo == null) {
//         res.render('main/index');
//         return Promise.reject();
//     }
//     if (id === '') {
//         res.json({
//             userInfo: req.session.userInfo,
//             content: ''
//         });
//         return Promise.reject();
//     } else {
//         Content.findOne({
//             _id: id
//         }).then(function(result) {
//             var postData = {
//                 username: req.session.userInfo.username,
//                 postTime: new Date().toDateString(),
//                 content: comment
//             };
//             result.comments.push(postData);
//             return result.save();
//         }).then(function(newContent) {
//             var newObj = "user" ? Content.findOne({ _id: id }).populate("user") : Content.findOne({ _id: id });
//             newObj.then(function(newCnt) {
//                 res.json({
//                     userInfo: req.session.userInfo,
//                     content: newCnt
//                 });
//             });
//         });
//     }
// });

Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
module.exports = router;