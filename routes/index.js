var express = require('express');
var router = express.Router();

//mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test'); // 기본 설정에 따라 포트가 상이 할 수 있습니다.
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
var sess = {username:'hello'};

/* GET blog page. */
router.get('/blog/:name', function(req, res) {
  res.render('blog', { name: req.params.name });
});

/* GET index page. */
router.get('/', function(req, res) {
  res.render('index', {username: sess.username});
});

/* GET signin page. */
router.get('/signin', function(req, res) {
  res.render('signin');
});

/* GET signup page. */
router.get('/signup', function(req, res) {
  res.render('signup');
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

});

/* POST addContents page. */
router.post('/addContents', function(req, res) {

});

/* DELETE addContents page. */
router.delete('/deleteContents', function(req, res) {

});

module.exports = router;
