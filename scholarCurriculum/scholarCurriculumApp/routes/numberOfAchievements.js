var express = require('express');
var router = express.Router();
var numberOfAchievements = require('../controller/numberOfAchievementsController');

router.get('/', numberOfAchievements.getNumberOfAchievements);
module.exports = router;