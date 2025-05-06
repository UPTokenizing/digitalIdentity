var express = require('express');
var router = express.Router();
var registerUserController = require('../controller/registerUserController');
router.post('/', registerUserController.registerUser);
module.exports = router;