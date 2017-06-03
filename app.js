var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var multipart = require('connect-multiparty');
var routes = require('./routes/index');
var app = express();

//use session
app.use(session({
 secret: '@#@$SECRET#@$#$',
 resave: false,
 saveUninitialized: true
}));

//templete engine
app.set('views', './views');
app.set('view engine', 'jade');

//middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(multipart({ uploadDir: __dirname + '/files'}));
app.use(express.static('./files'));
app.use('/', routes);

/// catch 404 and forwarding to error handler
app.use((req, res, next) => {
    res.status(404);
    res.render('error', { message: "존재하지 않는 페이지이거나 들어갈 수 없습니다." } );
});

app.listen(8080, () => {
    console.log("server is running on port 8080");
});

module.exports = app;