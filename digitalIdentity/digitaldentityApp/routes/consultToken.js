var express = require('express');
var router = express.Router();
var consultTokenController = require('../controller/consultTokenController');

// Define the route for consulting tokens
router.get('/', consultTokenController.getNameToken);

module.exports = router;