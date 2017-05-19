var express = require('express');
var router = express.Router();

/* GET blog page. */
router.get('/blog/:name', function(req, res) {
  res.render('blog', { name: req.params.name });
});

/* GET index page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* GET signin page. */
router.get('/signin', function(req, res) {

});

/* GET signup page. */
router.get('/signup', function(req, res) {

});

/* POST addUser page. */
router.post('/addUser', function(req, res) {

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
