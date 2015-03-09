var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var url = require('url');
var request = require('request');

router.get('/', function(req, res, next) {
	var authData = db.getAuth();
	uid = authData.uid;

	var specificUserRatingsRef = new Firebase("https://watchwithus.firebaseio.com/users/" + uid);

	specificUserRatingsRef.orderByChild("ratings").on("child_added", function(snapshot) {
		if (snapshot.key() == "ratings") {
			var userRatings = Object.keys(snapshot.val()).map(function(k) { return snapshot.val()[k] });
			var ratingsArr = new Array();
			for (var i = 0; i < userRatings.length; i++) {
				ratingsArr.push({'title': userRatings[i].title, 'rating': userRatings[i].rating});
			}
			res.render('viewratings', {title: 'View Ratings', 'ratings': ratingsArr});
		}
	});

});

module.exports = router;