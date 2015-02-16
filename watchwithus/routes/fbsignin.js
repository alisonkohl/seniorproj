var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var request = require("request");
var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
	db.authWithOAuthRedirect("facebook", function(error) {
	  	if (error) {
	    	console.log("Login Failed!", error);
	  	} else {
	    	// We'll never get here, as the page will redirect on success.
	  	}
	});
	res.render('index', { title: 'Express' });
});

module.exports = router;