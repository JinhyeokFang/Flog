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
      res.render('anotherBlog', { name: req.params.name , data: data, length: data.length});   
  }).sort({ "_id" : -1 });
});

/* GET index page. */
router.get('/', (req, res) => {
  if (sess.username == 0)
    res.render('indexBeforeSignin');
  else
    res.render('index', { name: sess.username });
});

/* GET sign page. */
router.get('/sign', (req, res) => {
  if (sess.username == 0)
    res.render('sign');
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
  UserModel.findOne({
    id: req.body.id
  }, (err,user) => {
    if(!user) {
        var UserIns = new UserModel({ id:req.body.id, password:req.body.pass });

        UserIns.save((err, UserIns) => {
          if(err) return console.error(err);
          res.redirect('/sign');
        });
    } else {
      res.render('error' , { message: "이미 존제하는 아이디입니다." } );
    }
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
      res.render('error', { message: "아이디나 비밀번호가 틀렸습니다." } );
      return;
    } 
    res.redirect("/");
    sess = req.session;
    sess.username = req.body.id;
  });
});


function easter () {
    setTimeout(() => {
        console.log("사용해 주셔서 정말 감사합니다 :)");
        easter();
    }, 30000);
}

easter();

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

/* POST deleteContents page. */
router.post('/deleteContents', (req, res) => {
  var id = req.body.contentsId;
  ContentsModel.remove({
    _id : id
  }, (err,output) => {
    res.redirect('/blog');
  });
});

module.exports = router;
