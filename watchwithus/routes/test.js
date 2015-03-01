var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");
var url = require('url');
var request = require('request');

router.get('/', function(req, res, next) {
	
	var array = ['one', 'two', 'three'];
	res.render('test', {title: 'Test', 'array': array, 'index': 0});
						

	
});

module.exports = router;