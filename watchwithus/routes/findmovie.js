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

module.exports = router;