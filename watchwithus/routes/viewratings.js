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
			ratingsArr.sort(compareByRating);

			var outByRating = [];
			var len = ratingsArr.length - 1;
			if (len >= 0) {
			    for (var i = 0;i < len; i++) {
			        if (ratingsArr[i].title != ratingsArr[i+1].title) {
			            outByRating.push (ratingsArr[i]);
			        }
			    }
			    outByRating.push (ratingsArr[len]);
			}

			ratingsArr.sort(alphabetize);

			var outAlphabetized = [];
			var len = ratingsArr.length - 1;
			if (len >= 0) {
			    for (var i = 0;i < len; i++) {
			        if (ratingsArr[i].title != ratingsArr[i+1].title) {
			            outAlphabetized.push (ratingsArr[i]);
			        }
			    }
			    outAlphabetized.push (ratingsArr[len]);
			}

			res.render('viewratings', {title: 'View Ratings', 'ratings': outAlphabetized});
		}
	});

});

function compareByRating(a,b) {
  if (a.rating < b.rating)
     return 1;
  if (a.rating > b.rating)
    return -1;
  return 0;
}

function alphabetize(a,b) {
	if (a.title < b.title) return -1;
	if (a.title > b.title) return 1;
	return 0;
}

module.exports = router;