const express = require('express');
const router = express.Router();
const lapController = require('../controllers/lapController');

router.post('/laps', lapController.recordLapTime);
router.get('/leaderboard/:sessionId', lapController.getLeaderboard);

module.exports = router;