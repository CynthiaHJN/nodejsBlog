var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
// var Cookies = require("cookies");
var cookie = require("cookie-parser");
var session = require("express-session");
var app = express();
//设置静态文件托管
app.use('/public', express.static(__dirname + '/public'));

var swig = require("swig");
app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine', 'html');

swig.setDefaults({ cache: false });
app.use(cookie('Cynthia'));
app.use(session({ secret: 'Cynthia' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', require("./routers/main"));
app.use('/api', require("./routers/api"));
app.use("/admin", require("./routers/admin"));

mongoose.connect("mongodb://localhost:27017/newBolg", function(err) {
    if (err) {
        console.log("数据库连接错误");
    } else {
        console.log("数据库连接成功");
        app.listen(3001);
    }
});