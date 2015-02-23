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

	var username = form_data.username;
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
			var movieTitle = form_data.title;
			var movieDbRatingFromForm = parseFloat(form_data.movieDbRating);

			var newIndex = parseInt(index) + 1;

			var specificUserRef = new Firebase("https://watchwithus.firebaseio.com/users/" + uid);

			var newMoviesRated;
			var newMoviesToRate;
			if (rating > 0) {
				var difference = rating - movieDbRatingFromForm;
				newMoviesToRate = parseInt(moviesToRate) - 1;
				newMoviesRated = parseInt(moviesRated) + 1;
				var ratingsRef = specificUserRef.child("ratings");
		  		ratingsRef.push({
		  			title: movieTitle,
		  			rating: rating,
		  			average_rating_from_movie_db: movieDbRatingFromForm,
		  			rating_difference: difference
		  		});

		  		var year = form_data.year;

		  		String.prototype.replaceAt=function(index, character) {
				    return this.substr(0, index) + character + this.substr(index+character.length);
				}

		  		var rounded_year = year.replaceAt(3, "0");
		  		console.log("rounded year is: " + rounded_year);


		  		//switch statement on the years to group into categories, then:


		  		var yearsRef = specificUserRef.child("years");

	  			yearsRef.orderByKey().equalTo(rounded_year).on("child_added", function(snapshot) {
	  				var currValue = snapshot.val();
	  				var ratingAndCount = currValue.split(' ');
	  				var currRating = parseFloat(ratingAndCount[0]);
	  				var currDiff = parseFloat(ratingAndCount[1]);
	  				var currCount = parseFloat(ratingAndCount[2]);

	  				var newRating = ((currRating * currCount) + rating)/(currCount + 1);
	  				var newDiff = ((currDiff * currCount) + difference)/(currCount + 1);
	  				var newRatingString = newRating.toString() + " " + newDiff.toString() + " " + (currCount + 1).toString();
	  				console.log("newRatingString is: " + newRatingString);
	  				foo = {};
	  				foo[rounded_year] = newRatingString;
	  				yearsRef.update(foo);

	  			});


		  		var genresRef = specificUserRef.child("genres");
		  		//var genreStringFromQuery = query['genreString'];
		  		var genreStringFromQuery = form_data.genreString;
		  		//console.log("genreStringFromQuery is: " + genreStringFromQuery);
		  		var genreArray = genreStringFromQuery.split(',');
		  		var ids = [];
		  		for (i = 0; i < genreArray.length; i++) {
		  			var genreName = genreArray[i];
		  			console.log("genreName is: " + genreName);
		  			switch(genreName) {
		  				case "Animation":
		  					ids.push("16");
		  					break;
		  				case "Kids & Family":
		  					console.log("got in Kids");
		  					ids.push("10751");
		  					console.log("ids is now: " + ids);
		  					break;
		  				case "Science Fiction & Fantasy":
		  					ids.push("14");
		  					ids.push("878");
		  					break;
		  				case "Comedy": 
		  					ids.push("35");
		  					break;
		  				case "Mystery & Suspense":
		  					ids.push("9648");
		  					break;
		  				case "Action & Adventure":
		  					ids.push("28");
		  					ids.push("12");
		  					break;
		  				case "Drama":
		  					ids.push("18");
		  					break;
		  				case "Documentary":
		  					ids.push("99");
		  					break;
		  				case "Art House & International":
		  					ids.push("10769");
		  					break;
		  				case "Horror":
		  					ids.push("27");
		  					break;
		  				case "Musical & Peforming Arts":
		  					ids.push("10402");
		  					break;
		  				case "Romance":
		  					ids.push("10749");
		  					break;
		  				case "Television":
		  					ids.push("10770");
		  					break;
		  				case "Western":
		  					ids.push("37");
		  					break;
		  			}
		  		}
		  		console.log("ids are " + ids);
		  		for (n = 0; n < ids.length; n++){
		  			genresRef.orderByKey().equalTo(ids[n]).on("child_added", function(snapshot) {
		  				var currValue = snapshot.val();
		  				var ratingAndCount = currValue.split(' ');
		  				var currRating = parseFloat(ratingAndCount[0]);
		  				var currDiff = parseFloat(ratingAndCount[1]);
		  				var currCount = parseFloat(ratingAndCount[2]);

		  				var newRating = ((currRating * currCount) + rating)/(currCount + 1);
		  				var newDiff = ((currDiff * currCount) + difference)/(currCount + 1);
		  				var newRatingString = newRating.toString() + " " + newDiff.toString() + " " + (currCount + 1).toString();
		  				console.log("newRatingString is: " + newRatingString);
		  				foo = {};
		  				foo[ids[n]] = newRatingString;
		  				genresRef.update(foo);

		  			});
		  		}

			} else {
				newMoviesToRate = parseInt(moviesToRate);
				newMoviesRated = parseInt(moviesRated);
			}

			specificUserRef.update({index: newIndex, moviesRated: newMoviesRated});

			var moviesToRateRef = new Firebase("https://watchwithus.firebaseio.com/moviesToRate");

			moviesToRateRef.orderByKey().equalTo(newIndex.toString()).on("child_added", function(snapshot) {
		  		movieId = snapshot.val();
		  		var movieIdValues = movieId.split(' ');
		  		movieId = movieIdValues[0];
		  		var movieDbRating = movieIdValues[1];
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
					var genres = doc.genres;
					var year = doc.year;
					console.log("year at bottom is: " + year.toString());
					var year_str = year.toString();

					var genre_string = "";
					for (j = 0; j < genres.length - 1; j++) {
						genre_string += (genres[j] +",");
					}
					genre_string += genres[genres.length - 1];

					moviesArray.push({'title': title, 'synopsis': synopsis, 'thumbnail': thumbnail, 'audience_score': audience_score});
					
					var showButton;
					if (newMoviesToRate <= 0) {
						showButton = true;
					} else {
						showButton = false;
					}
					res.render('onboarding', {title: 'Onboarding', 'title': title, 'synopsis': synopsis, 'thumbnail': thumbnail, 'audience_score': audience_score, 'index': properIndex, 'moviesToRate': newMoviesToRate, 'year': year_str, 'showButton': showButton, 'mid': movieId, 'genreString': genre_string, 'movieDbRating': movieDbRating});

				});
			});

		});

	} else {

		db.createUser({
			username: form_data.username,
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
		  					username: form_data.username,
		  					ratings: {},
		  					genres: {},
		  					years: {},
		  					index: 0,
		  					moviesRated: 0
		  				});

		  				/*var db2 = db.child("users/user2");
		  				db2.set({
		  					name: form_data.name,
		  					ratings: {},
		  					index: -1
		  				});*/

		  				var db3 = db2.child("genres");
		  				db3.set({
		  					16: "0 0 0",
		  					10751: "0 0 0",
		  					14: "0 0 0",
		  					878: "0 0 0",
		  					35: "0 0 0",
		  					9648: "0 0 0",
		  					53: "0 0 0",
		  					28: "0 0 0",
		  					12: "0 0 0",
		  					18: "0 0 0",
		  					99: "0 0 0",
		  					10769: "0 0 0",
		  					27: "0 0 0",
		  					10402: "0 0 0",
		  					10749: "0 0 0",
		  					10770: "0 0 0",
		  					37: "0 0 0"
		  				});

		  				var db3 = db2.child("years");
		  				db3.set({
		  					1900: "0 0 0",
		  					1910: "0 0 0",
		  					1920: "0 0 0",
		  					1930: "0 0 0",
		  					1940: "0 0 0",
		  					1950: "0 0 0",
		  					1960: "0 0 0",
		  					1970: "0 0 0",
		  					1980: "0 0 0",
		  					1990: "0 0 0",
		  					2000: "0 0 0",
		  					2010: "0 0 0"
		  				});

		  				/*var db4 = db2.child("ratings");
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
		  			var movieIdValues = movieId.split(' ');
		  			movieId = movieIdValues[0];
		  			var movieDbRating = movieIdValues[1];

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
							var genres = doc.genres;
							var year_str = (doc.year).toString();
							console.log("year in weird place is: " + year_str);
							var genre_string = "";
							for (j = 0; j < genres.length - 1; j++) {
								genre_string += (genres[j] +",");
							}
							genre_string += genres[genres.length - 1];

							moviesArray.push({'title': title, 'synopsis': synopsis, 'thumbnail': thumbnail, 'audience_score': audience_score});
							

							res.render('onboarding', {title: 'Onboarding', 'title': title, 'synopsis': synopsis, 'thumbnail': thumbnail, 'year': year_str, 'audience_score': audience_score, 'index': properIndex, 'moviesToRate': moviesToRate, 'mid': movieId, 'genreString': genre_string, 'year': year_str, 'movieDbRating': movieDbRating});
						

						});
		  		});



		  		
			} else {
				console.log("Error creating user: ", error);
			}
		});

	}


});

module.exports = router;
