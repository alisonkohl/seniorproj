var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var request = require("request");
var url = require('url');

var movieIds = ["10288", "10597"]

router.post('/', function(req, res, next) {

	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var moviesToRate = query['moviesToRate'];
	console.log("moviesToRate: " + moviesToRate);

	var form_data = req.body;

	var name = form_data.name;
	var email = form_data.email;
	var password = form_data.password;

	console.log("email:" + email);

	if (email == undefined) {

		var index = form_data.index;
		var properIndex = parseInt(index) + 1;
		var rating = parseInt(form_data.rating);

		var movieId = "";

		var authData = db.getAuth();
		console.log("userId: " + authData.uid);
		uid = authData.uid;

		var usersRef = new Firebase("https://watchwithus.firebaseio.com/users");

		usersRef.orderByKey().equalTo(uid).on("child_added", function(snapshot) {
			var index = snapshot.val().index;
			var moviesRated = snapshot.val().moviesRated;
			console.log("index: " + index);
			console.log("moviesRated: " + moviesRated);

			var newIndex = parseInt(index) + 1;

			var specificUserRef = new Firebase("https://watchwithus.firebaseio.com/users/" + uid);

			var newMoviesRated;
			var newMoviesToRate;
			if (rating > 0) {
				newMoviesToRate = parseInt(moviesToRate) - 1;
				newMoviesRated = parseInt(moviesRated) + 1;
				var ratingsRef = specificUserRef.child("ratings");
		  		ratingsRef.push({
		  			mid: parseInt(form_data.mid),
		  			rating: rating
		  		});
			} else {
				newMoviesToRate = parseInt(moviesToRate);
				newMoviesRated = parseInt(moviesRated);
			}

			specificUserRef.update({index: newIndex, moviesRated: newMoviesRated});

			var moviesToRateRef = new Firebase("https://watchwithus.firebaseio.com/moviesToRate");

			moviesToRateRef.orderByKey().equalTo(newIndex.toString()).on("child_added", function(snapshot) {
		  		movieId = snapshot.val();
		  		console.log("movieId: " + movieId);

				request({
					uri: "http://api.rottentomatoes.com/api/public/v1.0/movies/" + movieId + ".json?apikey=v67jb7aug6qwa4hnerpfcykp",
					method: "GET",
				}, function(error, response, body) {
					var doc = JSON.parse(body);
					var title = doc.title;
					var synopsis = doc.synopsis;
					var thumbnail = doc.posters.thumbnail.substring(0, doc.posters.thumbnail.length-7) + "det.jpg";
					var audience_score = doc.ratings.audience_score;

					moviesArray.push({'title': title, 'synopsis': synopsis, 'thumbnail': thumbnail, 'audience_score': audience_score});
					
					var showButton;
					if (newMoviesToRate <= 0) {
						showButton = true;
					} else {
						showButton = false;
					}
					res.render('onboarding', {title: 'Onboarding', 'title': title, 'synopsis': synopsis, 'thumbnail': thumbnail, 'audience_score': audience_score, 'index': properIndex, 'moviesToRate': newMoviesToRate, 'showButton': showButton, 'mid': movieId});

				});
			});

		});

	} else {

		db.createUser({
			name: form_data.name,
			email: form_data.email,
			password: form_data.password
		}, function(error) {
			if (error == null) {
				console.log("User created successfully");

				var index = form_data.index;
		  		var properIndex = parseInt(index) + 1;

		  		var id = "";

		  		db.authWithPassword({
		  			email    : email,
					password : password
				}, function(error, authData) {
					if (error) {
						console.log("Login Failed!", error);
					} else {
					    console.log("Authenticated successfully with payload:", authData);
					    remember: "sessionOnly"
					    id = authData.uid;

					    console.log("id: " + id);
		  				/*db.set({
		  					id: id
		  				});	*/

		  				var db2 = db.child("users/" + id);
		  				db2.set({
		  					name: form_data.name,
		  					ratings: {},
		  					index: 0,
		  					moviesRated: 0
		  				});

		  				/*var db2 = db.child("users/user2");
		  				db2.set({
		  					name: form_data.name,
		  					ratings: {},
		  					index: -1
		  				});

		  				var db3 = db2.child("ratings");
		  				db3.push({
		  					mid: 1234,
		  					rating: 4
		  				});

		  				var db4 = db2.child("ratings");
		  				db4.push({
		  					mid: 8654,
		  					rating: 4
		  				});*/
					}
		  		});

		  		moviesArray = [];

		  		var moviesToRateRef = new Firebase("https://watchwithus.firebaseio.com/moviesToRate");

		  		var movieId = "";

		  		moviesToRateRef.orderByKey().equalTo("0").on("child_added", function(snapshot) {
		  			movieId = snapshot.val();
		  			console.log("movieId: " + movieId);

				  		request({
				      		uri: "http://api.rottentomatoes.com/api/public/v1.0/movies/" + movieId + ".json?apikey=v67jb7aug6qwa4hnerpfcykp",
				      		method: "GET",
						}, function(error, response, body) {
							var doc = JSON.parse(body);
							var title = doc.title;
							var synopsis = doc.synopsis;
							var thumbnail = doc.posters.thumbnail.substring(0, doc.posters.thumbnail.length-7) + "det.jpg";
							var audience_score = doc.ratings.audience_score;

							moviesArray.push({'title': title, 'synopsis': synopsis, 'thumbnail': thumbnail, 'audience_score': audience_score});
							

							res.render('onboarding', {title: 'Onboarding', 'title': title, 'synopsis': synopsis, 'thumbnail': thumbnail, 'audience_score': audience_score, 'index': properIndex, 'moviesToRate': moviesToRate, 'mid': movieId});
						

						});
		  		});



		  		
			} else {
				console.log("Error creating user: ", error);
			}
		});

	}


});

module.exports = router;