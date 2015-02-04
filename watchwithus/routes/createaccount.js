var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('createaccount', { title: 'Create Account' });
// });

router.get('/', function(req, res, next) {
  res.render('createaccount', { title: 'Create Account' });
});

router.post('/', function(req, res, next) {
	var form_data = req.body;
	db.createUser({
		name: form_data.name,
		email: form_data.email,
		password: form_data.password
	}, function(error) {
		if (error == null) {
			console.log("User created successfully");
			res.render('login', { title: 'Login' });
		} else {
			console.log("Error creating user: ", error);
		}
	});
});

module.exports = router;
