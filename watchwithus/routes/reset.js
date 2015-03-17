var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('reset', {title: 'Watch With Us'});
});

module.exports = router;