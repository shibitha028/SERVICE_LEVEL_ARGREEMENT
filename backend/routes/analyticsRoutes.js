const express = require('express');
const router = express.Router();
const { getSummary, getTierBreakdown, getBreachTrend } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/summary',       protect, getSummary);
router.get('/tier-breakdown',protect, getTierBreakdown);
router.get('/breach-trend',  protect, getBreachTrend);

module.exports = router;
