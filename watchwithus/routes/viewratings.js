var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var url = require('url');
var request = require('request');

router.get('/', function(req, res, next) {
	//get movie ratings from db here
	res.render('viewratings');
});

module.exports = router;