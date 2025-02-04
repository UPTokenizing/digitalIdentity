var express = require('express');
var router = express.Router();
var consultCreatorIsGovernmentController = require('../controller/consultCreatorIsGovernmentController');

// Define the route for consulting tokens
router.get('/', consultCreatorIsGovernmentController.getCreatorIsGovern);

module.exports = router;