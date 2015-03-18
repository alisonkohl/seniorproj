var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var request = require('request');

function post(path, parameters) {
    var form = $('<form></form>');

    form.attr("method", "post");
    form.attr("action", path);

    $.each(parameters, function(key, value) {
        var field = $('<input></input>');

        field.attr("type", "hidden");
        field.attr("name", key);
        field.attr("value", value);

        form.append(field);
    });

    // The form needs to be a part of the document in
    // order for us to be able to submit it.
    $(document.body).append(form);
    form.submit();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/*Randomize the order of the array*/
function shuffle(array) {
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

String.prototype.replaceAt=function(index, character) {
	return this.substr(0, index) + character + this.substr(index+character.length);
}

/*Use the genre and year preferences to generate the array of movieDB queries*/
function getQueryArr(g_arr, y_arr) {
	var query_arr = new Array();
	for (var g2 in g_arr) {
		for (var y2 in y_arr) {
			//so here i want to generate combo queries based on the rating
			if (g_arr.hasOwnProperty(g2) && y_arr.hasOwnProperty(y2)) {
				var g_rating_split = g_arr[g2].split(' ');
				var g_rating = parseFloat(g_rating_split[0]);
				var y_rating_split = y_arr[y2].split(' ');
				var y_rating = parseFloat(y_rating_split[0]);
				if (g_rating == 0 || y_rating == 0) {
					continue;
				}
				var g_y_avg = (g_rating + y_rating) / 2;
				if (g_y_avg < 0) {
					continue;
				}
				var rating_min = 8.0 - g_y_avg;

				var low_year = y2;
				var high_year = 0;
				var decade_to_inc = parseInt(low_year[2]);

				if (decade_to_inc != 9) {
					var decade_incremented = parseInt(low_year[2]) + 1;
					high_year = low_year.replaceAt(2, decade_incremented.toString());
				} else {
					high_year = "2000";
				}
				var query_to_push = "with_genres=" + g2 + "&primary_release_date.gte=" + low_year + "-01-01&primary_release_date.lte=" + high_year + "-01-01&vote_average.gte=" + rating_min;
				query_arr.push(query_to_push);
			}
		}
	}

	/*Push on an additional "catch-all" query*/
	var query_to_push = "vote_average.gte=7.5";
	query_arr.push(query_to_push);


	/*Randomize the order of the query array*/
	shuffle(query_arr);
	return query_arr;
}

router.get('/', function(req, res, next) {
	res.render('index', {title: 'Watch With Us'});
});

router.post('/', function(req, res, next) {
	uid = req.session.uid;
	var postbody = req.body;
	var form_data = req.body;

	/*Get the group of friends the user is watching with*/
	var group = postbody.group;
	console.log("group is: " + group);
	//watching alone, create new array
	if (group == undefined) {
		group = new Array();
	}
	//watching with 1 other, comes in as string
	if (typeof group == 'string' || group instanceof String) {
		var temp_group = group;
		group = new Array();
		group.push(temp_group);
	}
	group.push(uid);

	var friendsString = "";
	for (var z = 0; z < group.length; z++) {
		friendsString += group[z] + ";";
	}
	friendsString = friendsString.substring(0, friendsString.length - 1);

	/*If rateMovie is true, user is attempting to rate one of the movies they have been recommended*/
	var rateMovie = postbody.rateMovie;
	/*This means we reach this page for the first time and need to generate the list of recommendations.

	First, we calculate average ratings between all users for each genre and time period*/
	if (rateMovie != "true") {
		var g_arr = {"16": "0 0", "10751": "0 0", "14": "0 0", "878": "0 0", "35": "0 0", "9648": "0 0", "53": "0 0", "28": "0 0", "12": "0 0", "18": "0 0", "99": "0 0", "10769": "0 0", "27": "0 0", "10402": "0 0", "10749": "0 0", "10770": "0 0", "37": "0 0"};
		var y_arr =  {"1900": "0 0", "1910": "0 0", "1920": "0 0", "1930": "0 0", "1940": "0 0", "1950": "0 0", "1960": "0 0", "1970": "0 0", "1980": "0 0", "1990": "0 0", "2000": "0 0", "2010": "0 0"};

		var usersRef = new Firebase("https://watchwithus.firebaseio.com/users");
		usersRef.orderByKey().equalTo(uid).on("child_added", function(snapshot) {
			for (f_id = 0; f_id < group.length; f_id++) {
				var specificUserRef = new Firebase("https://watchwithus.firebaseio.com/users/" + group[f_id]);

				/*Average in genre-rating values for this user*/
				var genresRef = specificUserRef.child("genres");
				var all_genres = ["16", "10751", "14", "878", "35", "9648", "53", "28", "12", "18", "99", "10769", "27", "10402", "10749", "10770", "37"];
				var g_lock = 0;
				for (g = 0; g < all_genres.length; g++) {
					genresRef.orderByKey().equalTo(all_genres[g]).once("child_added", function(snapshot) {
						average_rating = snapshot.val();
						var ratingArray = average_rating.split(' ');

						/*If one of the users consistently hates a genre, remove it*/
						if (parseFloat(ratingArray[1]) <= (-1.5)) {
							delete g_arr[snapshot.key()];
						/*Else average in this user's value for that genre*/
						} else {
							var temp_val = g_arr[snapshot.key()];
							if (temp_val != undefined) {
								temp_val = temp_val.split(' ');
								var currRating = parseFloat(temp_val[0]);
		  						var currCount = parseFloat(temp_val[1]);
		  						var newRating = ((currRating * currCount) + parseFloat(ratingArray[1]))/(currCount + 1);
				  				var newRatingString = newRating.toString() + " " + (currCount + 1).toString();
				  				g_arr[snapshot.key()] = newRatingString;
				  			}
						}
						g_lock++;
					});
				}

				/*Wait in here until we have looked through all genres.*/
				while (g_lock < all_genres.length) {
				}
				console.log("done");


				/*Average in year-rating values for this user*/
				var yearsRef = specificUserRef.child("years");
				var all_years = ["1900", "1910", "1920", "1930", "1940", "1950", "1960", "1970", "1980", "1990", "2000", "2010"];
				var y_lock = 0;

				for (y = 0; y < all_years.length; y++) {
					yearsRef.orderByKey().equalTo(all_years[y]).once("child_added", function(snapshot) {
						average_rating = snapshot.val();
						var ratingArray = average_rating.split(' ');

						/*If one of the users consistently hates a year, remove it*/
						if (parseFloat(ratingArray[1]) <= -1.5) {
							delete y_arr[snapshot.key()];
						/*Else average in this user's value for that year*/
						} else {
							var temp_val = y_arr[snapshot.key()];
							if (temp_val != undefined) {
								temp_val = temp_val.split(' ');
								var currRating = parseFloat(temp_val[0]);
		  						var currCount = parseFloat(temp_val[1]);

		  						var newRating = ((currRating * currCount) + parseFloat(ratingArray[1]))/(currCount + 1);
				  				var newRatingString = newRating.toString() + " " + (currCount + 1).toString();
				  				y_arr[snapshot.key()] = newRatingString;
				  			}
						}
						y_lock++;
					});
				}

				/*Wait in here until we have looked through all years.*/
				while (y_lock < all_years.length) {
				}
				console.log("done");

			}
		});

		/*Use the genre and year preferences to generate the array of movieDB queries*/
		var query_arr = getQueryArr(g_arr, y_arr);

		/*Calculate number of movies to recommend for each genre-year combination*/
		var num_per = Math.floor(100 / query_arr.length);
		num_per++;

		var movieString = "";
		//These are locking variables for asynchronous purposes
		var render_lock = 0;
		var triggered = false;
		var render_threshhold = 50;

		/*Push the additional catch-all query if the list is too short*/
		if (query_arr.length <= 5) {
			var query_to_push = "vote_average.gte=7.5";
			query_arr.push(query_to_push);
		}

		for (q = 0; q < query_arr.length; q++) {
			to_query = query_arr[q];
			if (to_query == "vote_average.gte=7.5") {

				/*Pull a random numbered page from the API of movies from this specific genre-year combination*/
				var random_page_num = getRandomInt(1,13);
				var random_page = random_page_num.toString();
				to_query = "vote_average.gte=7.5&page=" + random_page;
			}
			request({
		      		url: "http://api.themoviedb.org/3/discover/movie?" + to_query + "&vote_count.gte=50&api_key=3db59b073812110b693901ba4501b0d2",
		      		method: "GET",
			}, function(error, response, body) {
				/*Increment render_lock each time you add a movie. Keep going until render_lock reaches 50.*/
				if (render_lock < 50) {
					var doc = JSON.parse(body);
					var results = doc.results;

					/*Make sure we are not trying to pull more than number of results*/
					var num_per_2 = num_per;
					if (num_per_2 > results.length) {
						render_threshhold = render_threshhold - (num_per_2 - results.length);
						num_per_2 = results.length;
					}

					if (num_per_2 != 0) {
						/*Add in vote average from movieDB (fencepost not included)*/
						for (r = 0; r < num_per_2 - 1; r++) {
							movieString += (results[r].title + "*" + results[r].vote_average + "*" + results[r].poster_path + "*" + ";;");
							render_lock++;
						}
						/*Fencepost for last result of the last query (don't add a semicolon at end)*/
						if (q == query_arr.length - 1) {
							movieString += (results[results.length - 1].title + "*" + results[r].poster_path + "*" + results[r].vote_average);
							render_lock++;
						/*If not last result of last query, then treat normally*/
						} else {
							movieString += (results[results.length - 1].title + "*" + results[r].vote_average + "*" + results[r].poster_path + ";;");
							render_lock++;
						}
					}
				}

				/*Continue once render_lock has reached render_threshold (set at 50) */
				if (render_lock >= render_threshhold) {
					if (triggered == false) {
						triggered = true;

						/*Additional set of locking parameters*/
						var render_lock_2 = 0;
						var triggered_2 = false;

						var movieStringNew = "";

						/*Split up movieString and save each movie into m_arr[title] -> vote_average*/
						movieStringArr = movieString.split(';;');
						shuffle(movieStringArr);
						var m_arr = {};
						var num_movies_without_repeats = movieStringArr.length;
						for (m = 0; m < movieStringArr.length - 1; m++) {
							var currMovie = movieStringArr[m];
							var movieData = currMovie.split('*');
							var movieName = movieData[0];
							/*Remove repeat movie titles in movieString*/
							if (m_arr[movieName] != undefined) {
								num_movies_without_repeats = num_movies_without_repeats - 1;
								render_lock_2++;
								continue;
							}
							m_arr[movieName] = movieData[1] + "*" + movieData[2];

							request({
					      		uri: "http://www.omdbapi.com/?t=" + encodeURI(movieName) + "&y=&plot=short&r=json",
					      		method: "GET",
							}, function(error, response, body) {
								/*Increment render_lock_2 each time you add the additional information to a movie.
								Keep going until all movies have had additional information added.*/
								if (render_lock_2 < num_movies_without_repeats) {
									if (body != undefined) {
										/*Fix the body for special issues*/
										var newBody = "{";
										for (var a = 1; a < body.length - 1; a++) {
											var currChar = body.charAt(a);
											var nextChar = body.charAt(a + 1);
											var prevChar = body.charAt(a - 1);
											if (currChar == '"' && (prevChar != '{' && nextChar != ':' && prevChar != ':' && nextChar != ',' && prevChar != ',' && nextChar != '}')) {
												newBody += '\"';
											} else {
												newBody += currChar;
											}
										}
										newBody += "}";

										/*Check to make sure call was not "unauthorized"*/
										if (newBody[1] != "!") {

											var doc3 = JSON.parse(newBody);
											var newTitle = doc3.Title;
											var newYear = doc3.Year;
											var runtime = doc3.Runtime;
											var genres = doc3.Genre;
											var synopsis = doc3.Plot;
											var director = doc3.Director;
											var writer = doc3.Writer;
											var actors = doc3.Actors;
											//var thumbnail = doc3.Poster;

											/*Add all data on this movie to movieStringNew if the title on omdb matched with tmdb movie title
											(meaning m_arr_data != undefined)*/
											if (m_arr[newTitle] != undefined) {
												var title_and_thumbnail = m_arr[newTitle].split('*');
												var avg_rating = title_and_thumbnail[0];
												var thumbnail = "http://image.tmdb.org/t/p/w150" + title_and_thumbnail[1];
												movieStringNew += (newTitle + "*" + avg_rating + "*" + newYear + "*" + runtime + "*" + genres + "*" + synopsis + "*" + director + "*" + writer + "*" + actors + "*" + thumbnail + ";;");
											}
										}
									}
									render_lock_2++;
								}
								if (render_lock_2 == num_movies_without_repeats - 1) {
									if (triggered_2 == false) {
										triggered_2 = true;
										res.render('findmovie', {'index': 0, 'movieString': movieStringNew, 'justrated': false, 'recentFriends': friendsString});
									}
								}
							});
						}//ends for loop
					}//ends if statement
				}//renderlock = threshold
			});//end func
		}//end for (q = 0; q < query_arr.length; q++) {		
	} else {
		/*Get their rating and movieDB average rating for this movie from form*/
		var movieTitle = form_data.title;
		var rating = parseInt(form_data.rating);
		var movieDbRatingFromForm = parseFloat(form_data.movieDbRating);
		var recentFriendsString = form_data.recentFriends;

		/*Upload to Firebase their rating (in difference) for that movie, and average rating for year and genre ranges*/
		uid = req.session.uid;
		var usersRef = new Firebase("https://watchwithus.firebaseio.com/users");
		usersRef.orderByKey().equalTo(uid).on("child_added", function(snapshot) {

			var specificUserRef = new Firebase("https://watchwithus.firebaseio.com/users/" + uid);
			
			/*Push their rating for this movie*/
			var difference = rating - movieDbRatingFromForm;
			var ratingsRef = specificUserRef.child("ratings");
	  		ratingsRef.push({
	  			title: movieTitle,
	  			rating: rating,
	  			average_rating_from_movie_db: movieDbRatingFromForm,
	  			rating_difference: difference
	  		});


	  		/*Update the user's average rating for this year range*/
	  		var year = form_data.year.substring(0, form_data.year.length - 1);
	  		var rounded_year = year.replaceAt(3, "0");
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
  				foo = {};
  				foo[rounded_year] = newRatingString;
  				yearsRef.update(foo);

  			});

	  		/*Update the user's average rating for these genres*/
	  		var genresRef = specificUserRef.child("genres");
	  		var genreStringFromQuery = form_data.genreString;
	  		var genreArray = genreStringFromQuery.split(', ');
	  		var ids = [];
	  		/*Convert OMDB genre names to movieDB genre numbers (as stored in Firebase)*/
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

			/*Strip the movie that they just rated out of movieString*/
			var movieString = postbody.movieString;
			movieIndexInString = movieString.indexOf(movieTitle);
			if (movieIndexInString > -1) {
				var end_index = movieString.indexOf(";;", movieIndexInString);
				movieString = movieString.substring(0, movieIndexInString) + movieString.substring(end_index + 2);
			}
			res.render('findmovie', {'index': form_data.index - 1, 'movieString': movieString, 'justrated': true, 'recentFriends': recentFriendsString});
		});

	}
});//end post

module.exports = router;