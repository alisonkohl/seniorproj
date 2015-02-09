var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");

router.get('/', function(req, res, next) {
  res.render('mainmenu', { title: 'Main Menu' });
});

router.post('/', function(req, res, next) {
	var form_data = req.body;

	var email = form_data.email;
	var password = form_data.password;

	db.authWithPassword({
		email    : email,
		password : password
	}, function(error, authData) {
	  	if (error) {
	    	res.render('login', {title: 'Login', 'errorMessage': true});
		} else {
	    	res.render('mainmenu', { title: 'Main Menu'});
	  	}
	});

});

module.exports = router;