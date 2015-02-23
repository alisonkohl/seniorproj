var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var request = require('request');

router.post('/', function(req, res, next) {

	res.render('addfriends', {title: 'Add Friends'});

	/*var authData = db.getAuth();
	
	uid = authData.uid;

	var usersRef = new Firebase("https://watchwithus.firebaseio.com/users");
	var allUsers = "";
	counter = 0;

	var form_data = req.body;
	var query = form_data.query;
	var friendsAdded = form_data.friendsAdded;

	if (query == "") {
		//usersRef.orderByChild
		db.orderByChild("users").on("child_added", function(snapshot) {
			console.log(snapshot.key());
			if (snapshot.key() == "users") {
				var userIds = Object.keys(snapshot.val());
				console.log(snapshot.val());
				console.log(Object.keys(snapshot.val()));
				var arr = Object.keys(snapshot.val()).map(function(k) { return snapshot.val()[k] });
				var userData = new Array();
				for (i = 0; i < arr.length; i++) {
					userData.push({'id': userIds[i], 'username': arr[i].username})
				}
				res.render('addfriends', {title: 'Add Friends', 'users': userData});
			}
		});
	}*/


	/*usersRef.orderByChild("name").startAt("Ja").endAt("Ja~").on("child_added", function(snapshot) {

		counter++;
		allUsers += (snapshot.val().name + ",");
		console.log(snapshot.val().name);
		console.log(snapshot.val());

		if (counter == 5) {
			res.render('addfriends', {title: 'Add Friends', 'allUsers': allUsers});
		}



	});*/

	//var movieId = "9559";

	/*request({
		uri: "http://api.rottentomatoes.com/api/public/v1.0/movies/" + movieId + ".json?apikey=v67jb7aug6qwa4hnerpfcykp",
		method: "GET",
	}, function(error, response, body) {
		var doc = JSON.parse(body);
		var title = doc.title;
		var synopsis = doc.synopsis;
		var thumbnail = doc.posters.thumbnail.substring(0, doc.posters.thumbnail.length-7) + "det.jpg";
		var audience_score = doc.ratings.audience_score;
							
		res.render('findmovie', {title: 'Find Movie', 'title': title, 'synopsis': synopsis, 'thumbnail': thumbnail, 'audience_score': audience_score, 'mid': movieId});
						
	});*/
});

module.exports = router;