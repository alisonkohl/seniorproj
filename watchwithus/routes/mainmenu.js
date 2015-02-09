var express = require('express');
var router = express.Router();
var Firebase = require("firebase");
var db = new Firebase("https://watchwithus.firebaseio.com/");

router.get('/', function(req, res, next) {
  res.render('mainmenu', { title: 'Main Menu' });
});

router.post('/', function(req, res, next) {
	var form_data = req.body;

	var email = form_data.email;
	var password = form_data.password;

	if (email == undefined) {

		var authData = db.getAuth();
		uid = authData.uid;

		var specificUserRef = new Firebase("https://watchwithus.firebaseio.com/users/" + uid);

		var newMoviesRated;
		var newMoviesToRate;
		
		// newMoviesRated = parseInt(moviesRated) + 1;
		var ratingsRef = specificUserRef.child("ratings");
		ratingsRef.push({
		  	mid: parseInt(form_data.mid),
		  	rating: form_data.rating
		});

		// specificUserRef.update({moviesRated: newMoviesRated});
		res.render('mainmenu', {title: 'Main Menu'});

	} else  {

		db.authWithPassword({
			email    : email,
			password : password
		}, function(error, authData) {
		  	if (error) {
		    	res.render('login', {title: 'Login', 'errorMessage': true});
			} else {
		    	res.render('mainmenu', { title: 'Main Menu'});
		  	}
		});

	}

});

module.exports = router;