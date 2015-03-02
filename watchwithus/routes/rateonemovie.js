var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var url = require('url');
var request = require('request');

router.get('/', function(req, res, next) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var mid = query['mid'];

	request({
		uri: "http://api.rottentomatoes.com/api/public/v1.0/movies/" + mid + ".json?apikey=v67jb7aug6qwa4hnerpfcykp",
		method: "GET",
	}, function(error, response, body) {
		var doc = JSON.parse(body);
		var title = doc.title;
		var synopsis = doc.synopsis;
		var thumbnail = doc.posters.thumbnail.substring(0, doc.posters.thumbnail.length-7) + "det.jpg";
		var audience_score = doc.ratings.audience_score;
							
		res.render('rateonemovie', {title: 'Find Movie', 'title': title, 'synopsis': synopsis, 'thumbnail': thumbnail, 'audience_score': audience_score, 'mid': mid});
						
	});
	
});

router.post('/', function(req, res, next) {

	var form_data = req.body;
	var mid = form_data.mid;

	res.render('rateonemovie', {title: 'Find Movie', 'title': form_data.title, 'movieRating': form_data.movieRating, 'thumbnail': form_data.thumbnail, 'genreString': form_data.genres, 'year': form_data.year});


	/*request({
		uri: "http://api.rottentomatoes.com/api/public/v1.0/movies/" + mid + ".json?apikey=v67jb7aug6qwa4hnerpfcykp",
		method: "GET",
	}, function(error, response, body) {
		var doc = JSON.parse(body);
		var genres = doc.genres;
		var genre_string = "";
		for (j = 0; j < genres.length - 1; j++) {
			genre_string += (genres[j] +",");
		}
		genre_string += genres[genres.length - 1];
							
		res.render('rateonemovie', {title: 'Find Movie', 'title': form_data.title, 'movieRating': form_data.movieRating, 'thumbnail': form_data.thumbnail, 'genreString': genre_string, 'year': form_data.year});
						
	});*/

	/*var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var mid = query['mid'];

	request({
		uri: "http://api.rottentomatoes.com/api/public/v1.0/movies/" + mid + ".json?apikey=v67jb7aug6qwa4hnerpfcykp",
		method: "GET",
	}, function(error, response, body) {
		var doc = JSON.parse(body);
		var title = doc.title;
		var synopsis = doc.synopsis;
		var thumbnail = doc.posters.thumbnail.substring(0, doc.posters.thumbnail.length-7) + "det.jpg";
		var audience_score = doc.ratings.audience_score;
							
		res.render('rateonemovie', {title: 'Find Movie', 'title': title, 'synopsis': synopsis, 'thumbnail': thumbnail, 'audience_score': audience_score, 'mid': mid});
						
	});*/
	
});

module.exports = router;