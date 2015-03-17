var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var request = require("request");
var g_sort = new Array();

router.get('/', function(req, res, next) {
	var authData = db.getAuth();

	if (authData == null) {
		res.render('index', {title: 'Watch With Us'});
	} else {
		res.render('mainmenu', {title: 'Main Menu'});
	}
});

router.post('/', function(req, res, next) {
	var form_data = req.body;

	var email = form_data.email;
	var password = form_data.password;
	var fromViewRatings = form_data.fromViewRatings;
	var fromRateOneMovie = form_data.fromRateOneMovie;

	/*The following if statement checks if this page is being reach from the View Ratings page.
	If it is being reached from that page we need to check if any of the ratings for the movies
	have been changed, and if so update the database accordingly.
	*/
	if (fromViewRatings == "true") {

		var authData = db.getAuth();
		var uid = authData.uid;
		var specificUserRef = new Firebase("https://watchwithus.firebaseio.com/users/" + uid);
		var ratingsRef = specificUserRef.child("ratings");

		var numMovies = form_data.numMovies;
		for (var i = 0; i < numMovies; i++) {
			var titleString = "title" + i;
			var currTitle = form_data["title" + i];
			var currRating = form_data["rating" + i];
			if (currRating > 0) {
 				ratingsRef.orderByChild("child").on("child_added", function(snapshot) {
 					specificMovieRef = ratingsRef.child(snapshot.key());
 					specificMovieRef.orderByKey().on("child_added", function(snapshot2) {
 						console.log(snapshot2.key() + ": " + snapshot2.val());
 						if (snapshot2.val() == currTitle) {
 							console.log("here");
 							specificMovieRef.update({rating: currRating});
 						}
 					});
 				});
			}
		}
		res.render('mainmenu', {title: 'Main Menu'});

	} else {
		/*
		The following if statement checks if this page is being reached from the Rate On Movie page.
		If so, we need to then add that rating, genre and year preferences to our database.
		If not, we know that we are coming from another page and should not be touching the database.
		*/
		if (fromRateOneMovie == "true") {

			var authData = db.getAuth();
			console.log("userId: " + authData.uid);
			uid = authData.uid;

			var usersRef = new Firebase("https://watchwithus.firebaseio.com/users");

			usersRef.orderByKey().equalTo(uid).on("child_added", function(snapshot) {
				var movieTitle = form_data.title;
				var rating = parseInt(form_data.rating);
				var movieDbRatingFromForm = parseFloat(form_data.movieRating);

				var specificUserRef = new Firebase("https://watchwithus.firebaseio.com/users/" + uid);
				var difference = rating - movieDbRatingFromForm;
				var ratingsRef = specificUserRef.child("ratings");

				/*Adding the new rating info for the new movie*/
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

		  		/*Updating the year preferences for a specific user*/

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

		  		/*Updating the genres preferences for a specific user*/
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
				specificUserRef.update({recentFriends: form_data.recentFriends});

				res.render('mainmenu', {title: 'Main Menu'});
			});
		}
		else {
			db.authWithPassword({
				email    : email,
				password : password
			}, function(error, authData) {
			  	if (error) {
			    	res.render('login', {title: 'Login', 'errorMessage': true});
	 			} else {
	 				res.render('mainmenu', {title: 'Main Menu'});
	 			}
			});
		}
	}	
});

module.exports = router;


