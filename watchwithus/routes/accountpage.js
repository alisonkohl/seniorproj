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


module.exports = router;