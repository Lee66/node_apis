var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
//
router.get('/user', function(req, res) {
  res.render('user', { title: 'Epress' });
   res.send('The time is ' + new Date().toString());
});

module.exports = router;
