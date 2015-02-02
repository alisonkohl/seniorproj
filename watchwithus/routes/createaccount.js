var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('createaccount', { title: 'Create Account' });
// });

router.get('/', function(req, res, next) {
  res.render('createaccount', { title: 'Create Account' });
});

module.exports = router;
