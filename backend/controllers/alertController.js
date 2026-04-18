const BreachAlert = require('../models/BreachAlert');
const SLAContract = require('../models/SLAContract');

// GET /api/alerts
const getAlerts = async (req, res) => {
  try {
    const alerts = await BreachAlert.find()
      .populate('ticket', 'subject priority status')
      .populate('contract', 'clientName serviceTier penaltyPerBreach')
      .populate('acknowledgedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/alerts/:id/acknowledge
const acknowledgeAlert = async (req, res) => {
  try {
    const alert = await BreachAlert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });

    alert.status = 'Acknowledged';
    alert.acknowledgedBy = req.user._id;
    alert.acknowledgedAt = new Date();
    await alert.save();

    // Update contract penalty & breach count
    await SLAContract.findByIdAndUpdate(alert.contract, {
      $inc: { totalBreaches: 0, totalPenalty: 0 }, // already counted at creation
    });

    req.app.get('io').emit('alert:acknowledged', alert);
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/alerts/:id/escalate
const escalateAlert = async (req, res) => {
  try {
    const alert = await BreachAlert.findByIdAndUpdate(
      req.params.id,
      { status: 'Escalated' },
      { new: true }
    );
    req.app.get('io').emit('alert:escalated', alert);
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAlerts, acknowledgeAlert, escalateAlert };
