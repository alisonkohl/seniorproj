var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var request = require("request");
var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
	db.authWithOAuthPopup("facebook", function(error, authData) {
  		if (error) {
 	   		console.log("Login Failed!", error);
  		} else {
    		console.log("Authenticated successfully with payload:", authData);
  		}
	});
	res.render('index', { title: 'Express' });
});

module.exports = router;