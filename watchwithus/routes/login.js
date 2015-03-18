var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");

router.get('/', function(req, res, next) {
	db.unauth();
  res.render('login', { title: 'Login' });
});

router.post('/', function(req, res, next) {
	var form_data = req.body;
	db.resetPassword({
	    email : form_data.email
	  }, function(error) {
	  if (error === null) {
	  	
	    console.log("Password reset email sent successfully");
	    res.render('login', { title: 'Login', 'message': "Please check your email for instructions on how to reset your password." });
	  } else {
	    console.log("Error sending password reset email:", error);
	    res.render('reset', { title: 'Reset',  'message': "Email address not found. Please try again"});
	  }
	});
});

module.exports = router;
