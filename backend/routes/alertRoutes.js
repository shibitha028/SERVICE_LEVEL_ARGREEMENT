const express = require('express');
const router = express.Router();
const { getAlerts, acknowledgeAlert, escalateAlert } = require('../controllers/alertController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',                  protect, getAlerts);
router.put('/:id/acknowledge',   protect, adminOnly, acknowledgeAlert);
router.put('/:id/escalate',      protect, adminOnly, escalateAlert);

module.exports = router;
