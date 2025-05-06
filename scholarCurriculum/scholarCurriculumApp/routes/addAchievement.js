var express = require('express');
var router = express.Router();
var addAchievementController = require('../controller/addAchievementController');

router.post('/', addAchievementController.addAchievement);
module.exports = router;