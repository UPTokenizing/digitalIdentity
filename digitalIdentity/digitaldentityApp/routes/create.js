var express = require('express');
var router = express.Router();
var createController = require('../controller/createController');

router.post('/', createController.createDIdentity);

module.exports = router;

