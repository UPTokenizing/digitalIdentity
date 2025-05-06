var express = require('express');
var router = express.Router();
var consultNumberTokenController = require('../controller/consultNumberTokenController');

// Define the route for consulting tokens
router.get('/', consultNumberTokenController.numberOfLinkedTokens);

module.exports = router;