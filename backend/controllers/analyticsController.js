const Ticket = require('../models/Ticket');
const SLAContract = require('../models/SLAContract');
const BreachAlert = require('../models/BreachAlert');

// GET /api/analytics/summary
const getSummary = async (req, res) => {
  try {
    const [totalContracts, approved, rejected, pending, totalTickets, openTickets, totalBreaches] =
      await Promise.all([
        SLAContract.countDocuments(),
        SLAContract.countDocuments({ status: 'Approved' }),
        SLAContract.countDocuments({ status: 'Rejected' }),
        SLAContract.countDocuments({ status: 'Pending' }),
        Ticket.countDocuments(),
        Ticket.countDocuments({ status: { $in: ['Open', 'In Progress'] } }),
        BreachAlert.countDocuments(),
      ]);

    res.json({ totalContracts, approved, rejected, pending, totalTickets, openTickets, totalBreaches });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/analytics/tier-breakdown
const getTierBreakdown = async (req, res) => {
  try {
    const tiers = await SLAContract.aggregate([
      {
        $group: {
          _id: '$serviceTier',
          total: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] } },
          pending:  { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          totalPenalty: { $sum: '$totalPenalty' },
          avgResponseTime: { $avg: '$responseTimeMin' },
        },
      },
    ]);
    res.json(tiers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/analytics/breach-trend
const getBreachTrend = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trend = await BreachAlert.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
          penalty: { $sum: '$penaltyApplied' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    res.json(trend);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSummary, getTierBreakdown, getBreachTrend };
