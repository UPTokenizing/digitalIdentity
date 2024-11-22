var express = require('express');
var router = express.Router();
var consultController = require('../controller/consultController');

router.get('/', consultController.consultMethodNotParams);
router.get('/parameters', consultController.consultMethodWithParams);
module.exports = router;