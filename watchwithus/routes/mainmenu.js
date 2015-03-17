var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var request = require("request");
var g_sort = new Array();

router.get('/', function(req, res, next) {

			/*var authData = db.getAuth();
			console.log("userId: " + authData.uid);
			uid = authData.uid;

			var specificUserRef = new Firebase("https://watchwithus.firebaseio.com/users/" + uid);
*/
			/*Get the top genres*/
			/*var genresRef = specificUserRef.child("genres");
			var all_genres = ["16", "10751", "14", "878", "35", "9648", "53", "28", "12", "18", "99", "10769", "27", "10402", "10749", "10770", "37"];
			var g_arr = new Array();
			var g_lock = 0;
			for (g = 0; g < all_genres.length; g++) {
				genresRef.orderByKey().equalTo(all_genres[g]).once("child_added", function(snapshot) {
					average_rating = snapshot.val();
					var ratingArray = average_rating.split(' ');

					if (parseFloat(ratingArray[0]) >= 7) {
						g_arr.push(snapshot.key());
						console.log("g_arr after push is: " + g_arr.valueOf());
					}
					g_lock++;
				});
			}

			while (g_lock < all_genres.length) {
				//console.log("waiting at g.........");
			}
			console.log("done");

*/
			/*Get the top years*/
			/*var yearsRef = specificUserRef.child("years");
			var all_years = ["1900", "1910", "1920", "1930", "1940", "1950", "1960", "1970", "1980", "1990", "2000", "2010"];
			var y_arr = new Array();
			var y_lock = 0;

			for (y = 0; y < all_years.length; y++) {
				yearsRef.orderByKey().equalTo(all_years[y]).once("child_added", function(snapshot) {
					average_rating = snapshot.val();
					var ratingArray = average_rating.split(' ');

					if (parseFloat(ratingArray[0]) >= 7) {
						y_arr.push(snapshot.key());
						console.log("y_arr after push is: " + y_arr.valueOf());
					}
					y_lock++;
				});
			}

			while (y_lock < all_years.length) {
				console.log("waiting at y.........");
			}
			console.log("done");

*/
			/*Generate the array of movieDB queries*/
			/*String.prototype.replaceAt=function(index, character) {
				return this.substr(0, index) + character + this.substr(index+character.length);
			}

			var query_arr = new Array();
			for (g2 = 0; g2 < g_arr.length; g2++) {
				for (y2 = 0; y2 < y_arr.length; y2++) {
					var low_year = y_arr[y2];
					var high_year = 0;
					var decade_to_inc = parseInt(low_year[2]);

					if (decade_to_inc != 9) {
						var decade_incremented = parseInt(low_year[2]) + 1;
						high_year = low_year.replaceAt(2, decade_incremented.toString());
					} else {
						high_year = "2000";
					}
					query_to_push = "with_genres=" + g_arr[g2] + "&primary_release_date.gte=" + low_year + "-01-01&primary_release_date.lte=" + high_year + "-01-01";
					console.log("query_to_push is: " + query_to_push);
					query_arr.push(query_to_push);
				}
			}
*/

			/*Randomize the order of the array*/
			/*function shuffle(array) {
			  var currentIndex = array.length, temporaryValue, randomIndex ;

			  // While there remain elements to shuffle...
			  while (0 !== currentIndex) {

			    // Pick a remaining element...
			    randomIndex = Math.floor(Math.random() * currentIndex);
			    currentIndex -= 1;

			    // And swap it with the current element.
			    temporaryValue = array[currentIndex];
			    array[currentIndex] = array[randomIndex];
			    array[randomIndex] = temporaryValue;
			  }

			  return array;
			}
			shuffle(query_arr);
			console.log(query_arr);


			//I want to reccomend 50 movies
			// I have, say, 23 queries

			var num_per = Math.floor(50 / query_arr.length);
			num_per++;
			console.log("numper is: " + num_per);

			var movieString = "";
			var render_lock = 0;
			var triggered = false;

			for (q = 0; q < query_arr.length; q++) {
				to_query = query_arr[q];
				request({
			      		url: "http://api.themoviedb.org/3/discover/movie?" + to_query + "&sort_by=vote_average.desc&vote_count.gte=50&api_key=3db59b073812110b693901ba4501b0d2",
			      		method: "GET",
				}, function(error, response, body) {
					if (num_per_2 != 0 && render_lock < 50) {
						console.log("q is: " + q);
						console.log("url is: http://api.themoviedb.org/3/discover/movie?" + to_query + "&sort_by=vote_average.desc&vote_count.gte=50&api_key=3db59b073812110b693901ba4501b0d2");
						var doc = JSON.parse(body);
						var results = doc.results;
						var num_per_2 = num_per;
						//so what if num_per > number of results?
						if (num_per_2 > results.length) {
							num_per_2 = results.length;
						}
						console.log("numper2 is: " + num_per_2);
						for (r = 0; r < num_per_2 - 1; r++) {
							console.log("title is: " + results[r].title);
							movieString += (results[r].title + ";");
							render_lock++;
						}
						if (q == query_arr.length - 1) {
							movieString += (results[results.length - 1].title);
							render_lock++;
						} else {
							console.log("result here is: " + results[results.length - 1].title)
							movieString += (results[results.length - 1].title + ";");
							render_lock++;
						}
						console.log("movieString is now: " + movieString)
					}
					console.log("render lock is: " + render_lock);
					if (render_lock >= 50) {
						if (triggered == false) {
							triggered = true;
							console.log("movieString before render is: " + movieString)
							res.render('mainmenu', {title: 'Main Menu', 'movieString': movieString});
						}
					}
				});
			}*/
			res.render('mainmenu', {title: 'Main Menu'});
});

router.post('/', function(req, res, next) {
	var form_data = req.body;

	var email = form_data.email;
	var password = form_data.password;
	var fromViewRatings = form_data.fromViewRatings;
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
		if (email == undefined) {

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
				var rating = parseInt(form_data.rating);
				var movieDbRatingFromForm = parseFloat(form_data.movieRating);

				var newIndex = parseInt(index) + 1;

				var specificUserRef = new Firebase("https://watchwithus.firebaseio.com/users/" + uid);

				var newMoviesRated;
				var newMoviesToRate;
				
				var difference = rating - movieDbRatingFromForm;
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
		  		var genreArray = genreStringFromQuery.split(', ');
		  		var ids = [];
		  		for (i = 0; i < genreArray.length; i++) {
		  			var genreName = genreArray[i];
		  			console.log("genreName is: " + genreName);
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
				specificUserRef.update({index: newIndex, moviesRated: newMoviesRated, recentFriends: form_data.recentFriends});

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
	 				var uid = authData.uid;
	 				var specificUserRef = new Firebase("https://watchwithus.firebaseio.com/users/" + uid);
	 				var ratingsRef = specificUserRef.child("ratings");
	 				ratingsRef.orderByChild("child").on("child_added", function(snapshot) {
	 					specificMovieRef = ratingsRef.child(snapshot.key());
	 					specificMovieRef.orderByKey().on("child_added", function(snapshot2) {
	 						console.log(snapshot2.key() + ": " + snapshot2.val());
	 						if (snapshot2.val() == "The Blue Umbrell") {
	 							console.log("here");
	 							specificMovieRef.update({rating: 5});
	 						}
	 					});
	 				});
	 				res.render('mainmenu', {title: 'Main Menu'});
	 			}
			});
		}
	}	
});

module.exports = router;


