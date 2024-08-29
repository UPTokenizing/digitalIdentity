var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send("Returning: route /proof");
});


router.get('/proof', function(req, res, next) {
  res.send("Returning: route /proof/proof");
});

module.exports = router;