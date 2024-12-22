var express = require('express');
var router = express.Router();
var consultController = require('../controller/consultController');

router.get('/', consultController.consultMethodNotParamsUsers);
module.exports = router;