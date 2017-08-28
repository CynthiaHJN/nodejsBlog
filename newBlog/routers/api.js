var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var User = require('../models/User');
var responseData = null;
router.use(function(req, res, next) {
    responseData = {
        code: 0,
        message: ''
    }
    next();
});
// 首页
router.get('/', function(req, res, next) {});
router.post('/', function(req, res, next) {});
// 用户登录
router.get('/login', function(req, res, next) {});
router.post('/login', function(req, res, next) {
    var telphone = req.body.telphone;
    var password = req.body.password;
    if (telphone == '' || password == '') {
        responseData.code = 1;
        responseData.message = '手机号或密码不能为空';
        res.json(responseData);
        return;
    }
    User.findOne({
        telphone: telphone,
        password: password
    }).then(function(userInfo) {
        console.log(userInfo);
        if (!userInfo) {
            responseData.code = 2;
            responseData.message = '手机号或密码错误！';
            res.json(responseData);
            return;
        } else {
            responseData.message = '登录成功！';
            responseData.userInfo = userInfo.username;
            req.session.userInfo = {
                _id: userInfo._id,
                username: userInfo.username,
                telphone: userInfo.telphone,
                headpic: userInfo.headpic
            };
            res.locals.userInfo = req.session.userInfo;
            res.json(responseData);
            return;
        }
    });
});
// 用户注册
router.get('/register', function(req, res, next) {});
router.post('/register', function(req, res, next) {
    var username = req.body.username;
    var telphone = req.body.telphone;
    var password = req.body.password;
    if (username == '') {
        responseData.code = 1;
        responseData.message = '昵称不能为空';
        res.json(responseData);
        return;
    }
    if (telphone == '') {
        responseData.code = 2;
        responseData.message = '手机号不能为空';
        res.json(responseData);
        return;
    }
    if (password == '') {
        responseData.code = 3;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    User.findOne({
        telphone: telphone
    }).then(function(userInfo) {
        console.log(userInfo);
        if (userInfo) {
            responseData.code = 4;
            responseData.message = '该用户已被注册';
            res.json(responseData);
            return;
        } else {
            var user = new User({
                username: username,
                telphone: telphone,
                password: password,
                headpic: 'image/piano-pic.jpg'
            });
            return user.save();
        }
    }).then(function(newUserInfo) {
        // console.log(newUserInfo);
        responseData.message = '注册成功';
        res.json(responseData);
    });
});

// 用户注销
router.post('/logout', function(req, res, next) {
    res.clearCookie('userInfo');
    req.session.destroy();
    responseData = '注销成功';
    res.json(responseData);
});

// 评论获取
router.get('/comment', function(req, res, next) {});
router.post('/comment', function(req, res, next) {});
// 评论提交
router.get('/comment/post', function(req, res, next) {});
router.post('/comment/post', function(req, res, next) {});
module.exports = router;