var express = require('express');
var router = express.Router();
var setAddressController = require('../controller/setAddress');
router.post('/', setAddressController.setAddress);
module.exports = router;