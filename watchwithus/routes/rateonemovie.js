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

module.exports = router;