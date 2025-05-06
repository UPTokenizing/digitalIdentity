var express = require('express');
var router = express.Router();
var consultCertificateController = require('../controller/consultCertificateController');

router.get('/', consultCertificateController.getAchievement);
router.get('/parameters', consultCertificateController.getAchievement);
module.exports = router;