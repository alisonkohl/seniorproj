var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var url = require('url');

router.get('/', function(req, res, next) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var mid = query['mid'];
 	res.render('rateonemovie', { title: 'Rate One Movie', 'mid': mid });
});

module.exports = router;