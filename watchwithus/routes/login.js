var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/', function(req, res, next) {
	/*var form_data = req.body;
	db.authWithPassword({
		email    : form_data.email,
		password : form_data.password
	}, function(error) {
		if (error == null) {
			console.log("User created successfully");
			res.render('login', { title: 'Login' });
		} else {
			console.log("Error creating user: ", error);
		}
	});*/
});

/*router.post('/', function(req, res, next) {

	var form_data = req.body;
	db.authWithPassword({
		email    : form_data.email,
		password : form_data.password
	}, function(error, authData) {
		if (error) {
	    	console.log("Login Failed!", error);
	    	res.render('login', {title: 'Login Error', 'errorMessage': true});
	  	} else {
	    	res.render('onboarding', {title: 'Onboarding'});
	  	}
	});


});*/

module.exports = router;
