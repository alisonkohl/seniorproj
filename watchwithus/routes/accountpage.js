var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var request = require('request');

router.get('/', function(req, res, next){

	var authData = db.getAuth();

	if (authData == null) {
		res.render('index', {title: 'Watch With Us'});
	} else {
	
		uid = authData.uid;

		var usersRef = new Firebase("https://watchwithus.firebaseio.com/users/" + uid);


		db.orderByChild("users").on("child_added", function(snapshot) {
			if (snapshot.key() == "users") {
				var userIds = Object.keys(snapshot.val());
				var arr = Object.keys(snapshot.val()).map(function(k) { return snapshot.val()[k] });
				for (i = 0; i < arr.length; i++) {
					if (userIds[i] == uid) {
						var username = arr[i].username;
						res.render('account', {title: 'Account Page', 'username': username, 'email': authData.password.email });
					}
				}
			}
		});
	}

});

router.post('/', function(req, res, next) {

	var form_data = req.body;
	var email_changed = form_data.emailChanged;
	var password_changed = form_data.passwordChanged;
	var username = form_data.username;
	if (email_changed == "true") {
		db.changeEmail({
		  oldEmail : form_data.oldEmail,
		  newEmail : form_data.emailEdit,
		  password : form_data.password
		}, function(error) {
		  if (error === null) {
		    console.log("Email changed successfully");
		    res.render('account', {title: 'Account Page', 'username': username, 'email': form_data.emailEdit, 'message': "Successfully changed email address!" });
		  } else {
		    console.log("Error changing email:", error);
		   	res.render('account', {title: 'Account Page', 'username': username, 'email': form_data.oldEmail, 'message': "Error changing email. Please try again." });
		  }
		});
	}
	if (password_changed == "true") {
		db.changePassword({
		  email       : form_data.email,
		  oldPassword : form_data.oldPassword,
		  newPassword : form_data.newPassword
		}, function(error) {
		  if (error === null) {
		    console.log("Password changed successfully");
		    res.render('account', {title: 'Account Page', 'username': username, 'email': form_data.email, 'message': "Successfully changed password!" });

		  } else {
		    console.log("Error changing password:", error);
		    res.render('account', {title: 'Account Page', 'username': username, 'email': form_data.email, 'message': "Error changing password. Please try again." });
		  }
		});
	}
});


module.exports = router;