var express = require('express');
var fs = require('fs');
var router = express.Router();

//mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log("mongo db connection OK.");
});

var UserSchema = mongoose.Schema({
  id: String,
  password: String
});

var UserModel = mongoose.model("UserModel", UserSchema);
var ContentsSchema = mongoose.Schema({
  title: String,
  description: String,
  id: String,
  fileId: String
});

var ContentsModel = mongoose.model("ContentsModel", ContentsSchema);
var sess = {username:0};

/* GET my blog page. */
router.get('/blog/', (req,res) => {
  if (sess.username != 0)
    res.render('blog', { name: sess.username });
});

/* GET the other user's blog page. */
router.get('/blog/:name', (req,res) => {
    res.render('blog', { name: req.params.name });
});

/* GET index page. */
router.get('/', function(req, res) {
  if (sess.username == 0)
    res.render('index');
  else
    res.render('index', { name: sess.username });
});

/* GET signin page. */
router.get('/signin', function(req, res) {
  res.render('signin');
});

/* GET signup page. */
router.get('/signup', function(req, res) {
  res.render('signup');
});

/* GET write page. */
router.get('/write', function(req, res) {
  if (sess.username != 0)
    res.render('write');
});

/* POST addUser page. */
router.post('/addUser', function(req, res) {
  var UserIns = new UserModel({ id:req.body.id, password:req.body.pass });

  UserIns.save(function(err, UserIns){
    if(err) return console.error(err);
    res.send({
      id: UserIns.id,
      password: UserIns.password
    })
  });

});

/* POST User page. */
router.post('/User', function(req, res) {
  UserModel.findOne({
    id: req.body.id,
    password: req.body.pass
  }, (err,user) => {
    if(err) return console.error(err);
    if(!user) {
      res.render('signFail');
      return;
    } 
    res.render('signSuccess');
    sess = req.session;
    sess.username = req.body.id;
  });
});

/* POST addContents page. */
router.post('/addContents', function(req, res) {
    var ContentsTitle = req.body.title;
    var ContentsDescription = req.body.description;
    var ContentsId = req.files.file.name;
    var ContentsIns = new ContentsModel({ title: ContentsTitle, description: ContentsDescription, id: sess.username, fileId: ContentsId});

    ContentsIns.save(function(err, UserIns){
      if(err) return console.error(err);
      if(req.files.file) {
        res.redirect('/blog');
      }
    });
});

/* DELETE addContents page. */
router.delete('/deleteContents', function(req, res) {

});

module.exports = router;
