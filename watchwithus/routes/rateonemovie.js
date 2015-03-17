var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var url = require('url');
var request = require('request');

router.get('/', function(req, res, next){
	res.render('index', {title: 'Watch With Us'});
});

/*
This post method is fairly straightforward. It just takes the data passed to it from the find movie form and renders the
Rate One Movie page using this data.
*/
router.post('/', function(req, res, next) {

	var form_data = req.body;
	var mid = form_data.mid;
	console.log("title: " + form_data.title);
	res.render('rateonemovie', {title: 'Rate One Movie', 'title': form_data.title, 'movieRating': form_data.movieRating, 'thumbnail': form_data.thumbnail, 'genreString': form_data.genres, 'year': form_data.year, 'recentFriends': form_data.recentFriends});
	
});

module.exports = router;