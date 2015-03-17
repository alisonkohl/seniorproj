var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var request = require('request');

router.get('/', function(req, res, next){
	res.render('index', {title: 'Watch With Us'});
});

router.post('/', function(req, res, next) {

	var authData = db.getAuth();
	
	uid = authData.uid;

	var usersRef = new Firebase("https://watchwithus.firebaseio.com/users/" + uid);

	//This first gets the users recent friends and then gets a list of all users
	//The function then renders the Add Friends page and sends two arrays: one of recent friends and one of all other users
	usersRef.orderByKey().on("child_added", function(snapshot) {
		var recentFriendIds = "";
		if (snapshot.key() == "recentFriends") {
			recentFriendIds = snapshot.val();
		
			recentFriendIdsArr = recentFriendIds.split(";");

			db.orderByChild("users").on("child_added", function(snapshot) {
				if (snapshot.key() == "users") {
					var userIds = Object.keys(snapshot.val());
					var arr = Object.keys(snapshot.val()).map(function(k) { return snapshot.val()[k] });
					var userData = new Array();
					var recentFriends = new Array();
					for (i = 0; i < arr.length; i++) {
						if (userIds[i] != uid) {
							if (recentFriendIdsArr.indexOf(userIds[i]) > -1) {
								recentFriends.push({'id': userIds[i], 'username': arr[i].username});
							} else {
								userData.push({'id': userIds[i], 'username': arr[i].username});
							}
						}
					}
					res.render('addfriends', {title: 'Add Friends', 'users': userData, 'recentFriends': recentFriends});
				}
			});
		}
	});

});

module.exports = router;