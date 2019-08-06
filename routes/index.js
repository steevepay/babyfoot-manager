var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST home page. */
router.post('/', function (req, res) {
  res.send('Got a POST request')
})

/* PUT home page. */
router.put('/', function (req, res) {
  res.send('Got a PUT request at /')
})

/* DELETE home page */
router.delete('/', function (req, res) {
  res.send('Got a DELETE request at /')
})

module.exports = router;
