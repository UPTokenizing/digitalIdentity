var express = require('express');
var router = express.Router();
var getInfoController = require('../controller/getInfoController');
router.get('/', getInfoController.getInfo);
module.exports = router;