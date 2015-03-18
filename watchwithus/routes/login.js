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
	    res.render('login', { title: 'Login', 'passwordResetMessage': "Password reset email sent." });
	  } else {
	    console.log("Error sending password reset email:", error);
	    res.render('reset', { title: 'Reset',  'passwordResetMessage': "Password reset email not sent. Please try again."});
	  }
	});
});

module.exports = router;
