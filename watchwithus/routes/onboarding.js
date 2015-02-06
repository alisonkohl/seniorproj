var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var request = require("request");

var movieIds = ["10288", "10597"]

router.post('/', function(req, res, next) {

	var form_data = req.body;

	var name = form_data.name;
	var email = form_data.email;
	var password = form_data.password;

	console.log("email:" + email);

	if (email == undefined) {

		var index = form_data.index;
		var properIndex = parseInt(index) + 1;

		moviesArray = [];

		request({
			uri: "http://api.rottentomatoes.com/api/public/v1.0/movies/" + movieIds[properIndex] + ".json?apikey=v67jb7aug6qwa4hnerpfcykp",
			method: "GET",
	}, function(error, response, body) {

			var doc = JSON.parse(body);
			var title = doc.title;
			var synopsis = doc.synopsis;
			var thumbnail = doc.posters.thumbnail;
			var audience_score = doc.ratings.audience_score;

			moviesArray.push({'title': title, 'synopsis': synopsis, 'thumbnail': thumbnail, 'audience_score': audience_score});			
			
			res.render('onboarding', {title: 'Onboarding', 'movies': moviesArray, 'index': properIndex});
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
		  					index: -1
		  				});

		  				var db2 = db.child("users/user2");
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
		  				});
					}
		  		});

		  		moviesArray = [];

		  		request({
		      		uri: "http://api.rottentomatoes.com/api/public/v1.0/movies/" + movieIds[properIndex] + ".json?apikey=v67jb7aug6qwa4hnerpfcykp",
		      		method: "GET",
				}, function(error, response, body) {
					var doc = JSON.parse(body);
					var title = doc.title;
					var synopsis = doc.synopsis;
					var thumbnail = doc.posters.thumbnail;
					var audience_score = doc.ratings.audience_score;

					moviesArray.push({'title': title, 'synopsis': synopsis, 'thumbnail': thumbnail, 'audience_score': audience_score});
					

					res.render('onboarding', {title: 'Onboarding', 'movies': moviesArray, 'index': properIndex});
				

			});
			} else {
				console.log("Error creating user: ", error);
			}
		});

	}


});

module.exports = router;