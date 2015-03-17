var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var request = require("request");
var url = require('url');

router.get('/', function(req, res, next){
	res.render('index', {title: 'Watch With Us'});
});

router.post('/', function(req, res, next) {

	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var moviesToRate = query['moviesToRate'];

	var form_data = req.body;

	var username = form_data.username;
	var email = form_data.email;
	var password = form_data.password;

	/*
	This if statement checks if email is undefined, which indicates we have already created the user and are now going
	to the next movie in the onboarding process. If the user just rated a movie we store the rating information, along with
	genre preferences and year preferences.
	*/
	if (email == undefined) {

		var index = form_data.index;
		var properIndex = parseInt(index) + 1;
		var rating = parseInt(form_data.rating);

		var movieId = "";

		var authData = db.getAuth();
		uid = authData.uid;

		var usersRef = new Firebase("https://watchwithus.firebaseio.com/users");

		usersRef.orderByKey().equalTo(uid).on("child_added", function(snapshot) {
			var index = snapshot.val().index;
			var moviesRated = snapshot.val().moviesRated;
			var movieTitle = form_data.title;
			var movieDbRatingFromForm = parseFloat(form_data.movieDbRating);

			var newIndex = parseInt(index) + 1;

			var specificUserRef = new Firebase("https://watchwithus.firebaseio.com/users/" + uid);

			var newMoviesRated;
			var newMoviesToRate;

			/*
			This if statement checks if the user just rated a movie. If so, we push a new movie rating object to the database,
			update the user's year preferences and the user's rating preferences.
			*/
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

		  		var yearsRef = specificUserRef.child("years");

		  		//Updating year preferences
	  			yearsRef.orderByKey().equalTo(rounded_year).on("child_added", function(snapshot) {
	  				var currValue = snapshot.val();
	  				var ratingAndCount = currValue.split(' ');
	  				var currRating = parseFloat(ratingAndCount[0]);
	  				var currDiff = parseFloat(ratingAndCount[1]);
	  				var currCount = parseFloat(ratingAndCount[2]);

	  				var newRating = ((currRating * currCount) + rating)/(currCount + 1);
	  				var newDiff = ((currDiff * currCount) + difference)/(currCount + 1);
	  				var newRatingString = newRating.toString() + " " + newDiff.toString() + " " + (currCount + 1).toString();
	  				foo = {};
	  				foo[rounded_year] = newRatingString;
	  				yearsRef.update(foo);

	  			});

	  			//Updating genre preferences. The switch statement is used to map genre names from the OMDB API
	  			//to the genre ids in the Movie DB API, which we query by genre in our findMovie algorithm.
		  		var genresRef = specificUserRef.child("genres");
		  		var genreStringFromQuery = form_data.genreString;
		  		var genreArray = genreStringFromQuery.split(', ');
		  		var ids = [];
		  		for (i = 0; i < genreArray.length; i++) {
		  			var genreName = genreArray[i];
		  			switch(genreName) {
		  				case "Animation":
		  					ids.push("16");
		  					break;
		  				case "Sci-Fi":
		  					ids.push("878");
		  					break;
		  				case "Fantasy":
		  					ids.push("14");
		  					break;
		  				case "Comedy": 
		  					ids.push("35");
		  					break;
		  				case "Mystery":
		  					ids.push("9648");
		  					break;
		  				case "Action":
		  					ids.push("28");
		  					break;
		  				case "Adventure":
		  					ids.push("12");
		  					break;
		  				case "Drama":
		  					ids.push("18");
		  					break;
		  				case "Documentary":
		  					ids.push("99");
		  					break;
		  				case "Horror":
		  					ids.push("27");
		  					break;
		  				case "Musical":
		  					ids.push("10402");
		  					break;
		  				case "Romance":
		  					ids.push("10749");
		  					break;
		  				case "Western":
		  					ids.push("37");
		  					break;
		  				case "Thriller":
		  					ids.push("53");
		  					break;
		  				case "Crime":
		  					ids.push("80");
		  					break;
		  				case "War":
		  					ids.push("10752");
		  					break;
		  				case "Family":
		  					ids.push("10751");
		  					break;
		  			}
		  		}
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

			/*
			Query firebase for the next movie in the onboarding process. Once we get this id, we query
			the OMDB API for all relevant information and load the onboarding page with this info.
			*/
			moviesToRateRef.orderByKey().equalTo(newIndex.toString()).on("child_added", function(snapshot) {
		  		movieId = snapshot.val();
		  		var movieIdValues = movieId.split(' ');
		  		movieId = movieIdValues[0];
		  		var movieDbRating = movieIdValues[1];

				request({
					uri: "http://www.omdbapi.com/?i=" + movieId + "&plot=short&r=json",
					method: "GET",
				}, function(error, response, body) {

					var showButton;
					if (newMoviesToRate <= 0) {
						showButton = true;
					} else {
						showButton = false;
					}

					var doc3 = JSON.parse(body);
					var newTitle = doc3.Title;
					var newYear = doc3.Year;
					var synopsis = doc3.Plot;
					var thumbnail = doc3.Poster;
					var genres = doc3.Genre;
					res.render('onboarding', {title: 'Onboarding', 'title': newTitle, 'synopsis': synopsis, 'thumbnail': thumbnail, 'year': newYear, 'index': properIndex, 'moviesToRate': newMoviesToRate, 'mid': movieId, 'genreString': genres, 'movieDbRating': movieDbRating, 'showButton': showButton});
				});	
			});

		});

	} else {
		/*
		This else statement creates a user, initializes their genre and year preferences to 0, and then loads the first
		movie in the onboarding process.
		*/

		db.orderByChild("users").on("child_added", function(snapshot) {
			if (snapshot.key() == "users") {
				var userIds = Object.keys(snapshot.val());
				var arr = Object.keys(snapshot.val()).map(function(k) { return snapshot.val()[k] });
				var userData = new Array();

				//This for loop and if statement checks if a username already exists. If so, we go back to Create Account.
				for (i = 0; i < arr.length; i++) {
					userData.push(arr[i].username);
				}
				if (userData.indexOf(form_data.username) > -1) {
					res.render('createAccount', {title: 'Create Account', 'errorMessage': "That username already exists. Please try another."});
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

					  		//Firebase requires that we manually log a user in after we already create the user.
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

					  				var db2 = db.child("users/" + id);

					  				//Creates the user and sets up the arrays and other attributes.
					  				db2.set({
					  					username: form_data.username,
					  					ratings: {},
					  					genres: {},
					  					years: {},
					  					index: 0,
					  					moviesRated: 0,
					  					recentFriends: ""
					  				});

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
								}
					  		});

					  		var moviesToRateRef = new Firebase("https://watchwithus.firebaseio.com/moviesToRate");

					  		var movieId = "";

					  		//Loads the first movie id of the onboarding process and queries OMDB using this id.
					  		moviesToRateRef.orderByKey().equalTo("0").on("child_added", function(snapshot) {
					  			movieId = snapshot.val();
					  			var movieIdValues = movieId.split(' ');
					  			movieId = movieIdValues[0];
					  			var movieDbRating = movieIdValues[1];

								request({
									uri: "http://www.omdbapi.com/?i=" + movieId + "&plot=short&r=json",
									method: "GET",
								}, function(error, response, body) {
									var doc3 = JSON.parse(body);
									var newTitle = doc3.Title;
									var newYear = doc3.Year;
									var synopsis = doc3.Plot;
									var thumbnail = doc3.Poster;
									var genres = doc3.Genre;
									res.render('onboarding', {title: 'Onboarding', 'title': newTitle, 'synopsis': synopsis, 'thumbnail': thumbnail, 'year': newYear, 'index': properIndex, 'moviesToRate': moviesToRate, 'mid': movieId, 'genreString': genres, 'movieDbRating': movieDbRating});
								});	
					  		});



					  		
						} else {
							console.log("Error creating user: ", error);
							res.render('createAccount', {title: 'Create Account', 'errorMessage': "That email address already exists. Please try again."});
						}
					});
				}
				
			}
		});
	}

});

module.exports = router;