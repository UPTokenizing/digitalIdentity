var express = require('express');
var router = express.Router();
var linkTokenController = require('../controller/linkTokenController');

router.post('/', linkTokenController.linkToken);

module.exports = router;