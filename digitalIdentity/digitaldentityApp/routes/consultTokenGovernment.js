var express = require('express');
var router = express.Router();
var consultTokenGovernmentController = require('../controller/consultTokenGovernmentController');

// Define the route for consulting tokens
router.get('/', consultTokenGovernmentController.getGovernmentOfToken);

module.exports = router;