var express = require('express');
var fs = require('fs');
var router = express.Router();

//mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/flog');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
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
  fileId: String,
  time: String,
  path: String
});

var ContentsModel = mongoose.model("ContentsModel", ContentsSchema);
var sess = {username:0};

/* GET my blog page. */
router.get('/blog/', (req,res) => {
  ContentsModel.find({id :  sess.username },(err,data) => {
    if (sess.username != 0 && !err)
      res.render('blog', { name: sess.username , data: data, length: data.length});   
  }).sort({ "_id" : -1 });
});

/* GET the other user's blog page. */
router.get('/blog/:name', (req,res) => {
  ContentsModel.find({id : req.params.name },(err,data) => {
    if (!err)
      res.render('blog', { name: req.params.name , data: data, length: data.length});   
  }).sort({ "_id" : -1 });
});

/* GET index page. */
router.get('/', (req, res) => {
  if (sess.username == 0)
    res.render('indexBeforeSignin');
  else
    res.render('index', { name: sess.username });
});

/* GET signin page. */
router.get('/signin', (req, res) => {
  if (sess.username == 0)
  res.render('signin');
});

/* GET signup page. */
router.get('/signup', (req, res) => {
  if (sess.username == 0)
    res.render('signup');
});

/* GET signout page. */
router.get('/signout', (req, res) => {
  if (sess.username != 0) {
    sess.username = 0;
    res.redirect('/');
  }
});

/* GET write page. */
router.get('/write', (req, res) => {
  if (sess.username != 0)
    res.render('write');
});

/* POST addUser page. */
router.post('/addUser', (req, res) => {
  var UserIns = new UserModel({ id:req.body.id, password:req.body.pass });

  UserIns.save((err, UserIns) => {
    if(err) return console.error(err);
    res.redirect('/signin');
  });

});

/* POST User page. */
router.post('/User', (req, res) => {
  UserModel.findOne({
    id: req.body.id,
    password: req.body.pass
  }, (err,user) => {
    if(err) return console.error(err);
    if(!user) {
      res.render('signFail');
      return;
    } 
    res.redirect("/");
    sess = req.session;
    sess.username = req.body.id;
  });
});

/* POST addContents page. */
router.post('/addContents', (req, res) => {
    var ContentsTitle = req.body.title;
    var ContentsDescription = req.body.description;
    var ContentsId = req.files.file.name;
    var date = new Date();
    var timeNow = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    var ContentsIns = new ContentsModel({ title: ContentsTitle, description: ContentsDescription, id: sess.username, fileId: ContentsId, time: timeNow, path: "../"+req.files.file.path.substring(20,req.files.file.path.length) });

    ContentsIns.save((err, UserIns) => {
      if(err) return console.error(err);
      if(req.files.file) {
        res.redirect('/blog');
        console.log(req.files.file);
      }
    });
});

/* POST addContents page. */
router.post('/deleteContents', (req, res) => {
  var id = req.body.contentsId;
  ContentsModel.remove({
    _id : id
  }, (err,output) => {
    res.redirect('/blog');
  });
});

module.exports = router;
