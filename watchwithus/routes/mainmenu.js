var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var request = require("request");
var g_sort = new Array();

router.get('/', function(req, res, next) {
	/*var authData = db.getAuth();
	uid = authData.uid;

	var specificUserRef = new Firebase("https://watchwithus.firebaseio.com/users/" + uid);

	var newMoviesRated;
	var newMoviesToRate;
	
	var ratingsRef = specificUserRef.child("ratings");

	var genresRef = specificUserRef.child("genres");
	var all_genres = ["16", "10751", "14", "878", "35", "9648", "53", "28", "12", "18", "99", "10769", "27", "10402", "10749", "10770", "37"];

	for (g = 0; g < all_genres; g++) {
		genresRef.orderByKey().equalTo(all_genres[g]).on("child_added", function(snapshot) {
			average_rating = snapshot.val();
			g_sort.push({genre: all_genres[g], val: average_rating});
			console.log("g_sort is now: " + g_sort);
		});
	}


	setTimeout(function() {
		console.log("gsort before sort: " + g_sort);
		g_sort.sort(function(a,b) {
			return a.val - b.val;
		});
		console.log("gsort after sort:" + g_sort);
	}, 2000);


	var movieString = "";

	for (k = 0; k < 3; k++) {

		request({
	      		uri: "http://api.themoviedb.org/3/discover/movie?with_genres=" + g_sort[k] + "&sort_by=vote_average.desc&vote_count.gte=50&api_key=3db59b073812110b693901ba4501b0d2",
	      		method: "GET",
		}, function(error, response, body) {
			var doc = JSON.parse(body);
			var results = doc.results;
			for (res = 0; res < results.length - 1; res++) {
				movieString += (results[res].title + "," + g_sort[k] + ";");
			}
			movieString += (results[results.length - 1] + "," + g_sort[k]);
		});
	}
	

	setTimeout(function() {
		console.log("movieString: " + movieString);
		res.render('mainmenu', {title: 'Main Menu', 'movieString': movieString});
	}, 4000);*/
  res.render('mainmenu', { title: 'Main Menu' });
});

router.post('/', function(req, res, next) {
	var form_data = req.body;

	var email = form_data.email;
	var password = form_data.password;

	db.authWithPassword({
		email    : email,
		password : password
	}, function(error, authData) {
	  	if (error) {
	    	res.render('login', {title: 'Login', 'errorMessage': true});
		} else {
			/*uid = authData.uid;

			var specificUserRef = new Firebase("https://watchwithus.firebaseio.com/users/" + uid);

			var newMoviesRated;
			var newMoviesToRate;
			
			var ratingsRef = specificUserRef.child("ratings");

			var movieString = "";
			var genresRef = specificUserRef.child("genres");
			var all_genres = ["16", "10751", "14", "878", "35", "9648", "53", "28", "12", "18", "99", "10769", "27", "10402", "10749", "10770", "37"];
			var g_sort = new Array();

			for (g = 0; g < all_genres.length; g++) {
				genresRef.orderByKey().equalTo(all_genres[g]).on("child_added", function(snapshot) {
					average_rating = snapshot.val();
					var ratingArray = average_rating.split(' ');

					if (parseFloat(ratingArray[0]) >= 7) {
						g_sort.push(snapshot.key());
						console.log("gsort after push is: " + g_sort.valueOf());
					}
				});

				console.log("g: " + g + " and all genres length is: " + all_genres.length);
				if (g == (all_genres.length - 1)) {
					console.log("gsort length: " + gsort.length);
					for (k = 0; k < g_sort.length; k++) {
						console.log("g_sort[k]: " + g_sort[k]);
						request({
					      		url: "http://api.themoviedb.org/3/discover/movie?with_genres=" + g_sort[k] + "&sort_by=vote_average.desc&vote_count.gte=50&api_key=3db59b073812110b693901ba4501b0d2",
					      		method: "GET",
						}, function(error, response, body) {
							var doc = JSON.parse(body);
							var results = doc.results;
							for (res = 0; res < results.length - 1; res++) {
								console.log("title is: " + results[res].title);
								movieString += (results[res].title + ";");
							}
							movieString += (results[results.length - 1]);
							console.log("movieString is now: " + movieString)
						});

						console.log("k is: " + k + ", and g_sort.length is: " + g_sort.length);
						if (k == (g_sort.length - 1)) {
							res.render('mainmenu', {title: 'Main Menu', 'movieString': movieString});
						}
					}
				}
			}*/
			res.render('mainmenu', {title: 'Main Menu'});
		}
	});
});

module.exports = router;