var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('show', { title: 'show' });
   res.send('The time is ' + new Date().toString());
});
module.exports.hello = function(req, res) {
res.send('The time is ' + new Date().toString());
};
module.exports = router;
