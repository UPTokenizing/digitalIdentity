var express = require('express');
var router = express.Router();
var consultTokenCreatorController = require('../controller/consultTokenCreatorController');

// Define the route for consulting tokens
router.get('/', consultTokenCreatorController.getCreatorOfToken);

module.exports = router;