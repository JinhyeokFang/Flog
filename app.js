var express = require('express');
//var bodyParser = require('body-parser');
var routes = require('./routes/index');
var app = express();

//templete engine
app.set('views', './views');
app.set('view engine', 'jade');

//middle ware
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
app.use(express.static('./public'));

app.use('/blog', routes);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(8080, () => {
    console.log("server is running on port 8080");
});

module.exports = app;