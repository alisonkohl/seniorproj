var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");

router.get('/', function(req, res, next) {
	db.unauth();
  res.render('login', { title: 'Login' });
});

router.post('/', function(req, res, next) {

});

module.exports = router;
