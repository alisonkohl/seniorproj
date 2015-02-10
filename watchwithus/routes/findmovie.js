var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var request = require('request');

router.get('/', function(req, res, next) {

	var authData = db.getAuth();
	
	uid = authData.uid;

	var movieId = "9559";

	request({
		uri: "http://api.rottentomatoes.com/api/public/v1.0/movies/" + movieId + ".json?apikey=v67jb7aug6qwa4hnerpfcykp",
		method: "GET",
	}, function(error, response, body) {
		var doc = JSON.parse(body);
		var title = doc.title;
		var synopsis = doc.synopsis;
		var thumbnail = doc.posters.thumbnail.substring(0, doc.posters.thumbnail.length-7) + "det.jpg";
		var audience_score = doc.ratings.audience_score;
							
		res.render('findmovie', {title: 'Find Movie', 'title': title, 'synopsis': synopsis, 'thumbnail': thumbnail, 'audience_score': audience_score, 'mid': movieId});
						
	});
});

router.post('/', function(req, res, next) {

	var authData = db.getAuth();
	
	uid = authData.uid;

	var index = req.body.index;
	index++;
	console.log("index: " + index);
	var movieId = "";

	var moviesToAddRef = new Firebase("https://watchwithus.firebaseio.com/moviesToAdd");

  	var movieId = "";

	moviesToAddRef.orderByKey().equalTo(index.toString()).on("child_added", function(snapshot) {
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
			var genres = doc.genres;
			var genre_string = "";
			for (j = 0; j < genres.length - 1; j++) {
				genre_string += (genres[j] +",");
			}
			genre_string += genres[genres.length - 1];				

			res.render('findmovie', {title: 'Find Movie', 'title': title, 'synopsis': synopsis, 'thumbnail': thumbnail, 'audience_score': audience_score, 'mid': movieId, 'index': index});
		});
	});
});

module.exports = router;