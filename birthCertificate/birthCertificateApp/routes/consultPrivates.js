var express = require('express');
var router = express.Router();
var consultPrivatesController = require('../controller/consultPrivatesController');

// Define the route for consulting tokens
router.get('/', consultPrivatesController.PrivateInfo);

module.exports = router;