var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var url = require('url');
var request = require('request');

router.get('/', function(req, res, next) {
	var authData = db.getAuth();

	if (req.session.uid == undefined || req.session.uid == null) {
		res.render('index', {title: 'Watch With Us'});
	} else {

		uid = req.session.uid;

		var specificUserRatingsRef = new Firebase("https://watchwithus.firebaseio.com/users/" + uid);

		/*
		Looks for all ratings for a particular user and creates four different arrays that are sorted in different ways.
		One array sorts by rating low to high, one sorts rating high to low, one sorts by title a to z, and the last sorts
		title z to a.
		*/
		specificUserRatingsRef.orderByChild("ratings").on("child_added", function(snapshot) {
			if (snapshot.key() == "ratings") {
				var userRatings = Object.keys(snapshot.val()).map(function(k) { return snapshot.val()[k] });
				var ratingsArr = new Array();
				for (var i = 0; i < userRatings.length; i++) {
					ratingsArr.push({'title': userRatings[i].title, 'rating': userRatings[i].rating});
				}
				ratingsArr.sort(compareByRating);

				var outHL = [];
				var outLH = [];
				var len = ratingsArr.length - 1;
				if (len >= 0) {
				    for (var i = 0;i < len; i++) {
				        if (ratingsArr[i].title != ratingsArr[i+1].title) {
				            outHL.push(ratingsArr[i]);
				            outLH.push(ratingsArr[i]);
				        }
				    }
				    outHL.push(ratingsArr[len]);
				    outLH.push(ratingsArr[len]);
				}
				outLH.reverse();
				ratingsArr.sort(alphabetize);
				var outAZ = [];
				var outZA = [];
				var len = ratingsArr.length - 1;
				if (len >= 0) {
				    for (var i = 0;i < len; i++) {
				        if (ratingsArr[i].title != ratingsArr[i+1].title) {
				            outAZ.push(ratingsArr[i]);
				            outZA.push(ratingsArr[i]);
				        }
				    }
				    outAZ.push(ratingsArr[len]);
				    outZA.push(ratingsArr[len]);
				}
				outZA.reverse();
				res.render('viewratings', {title: 'View Ratings', 'ratingsHL': outHL, 'ratingsLH': outLH, 'ratingsAZ': outAZ, 'ratingsZA': outZA });
			}
		});

	}

});

function compareByRating(a,b) {
  if (a.rating < b.rating) return 1;
  if (a.rating > b.rating) return -1;
  return 0;
}

function alphabetize(a,b) {
	if (a.title < b.title) return -1;
	if (a.title > b.title) return 1;
	return 0;
}

module.exports = router;