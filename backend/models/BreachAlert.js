const mongoose = require('mongoose');

const breachAlertSchema = new mongoose.Schema({
  ticket:           { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  contract:         { type: mongoose.Schema.Types.ObjectId, ref: 'SLAContract', required: true },
  breachType:       { type: String, enum: ['Response', 'Resolution'], required: true },
  severity:         { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'High' },
  status:           { type: String, enum: ['Open', 'Acknowledged', 'Escalated', 'Resolved'], default: 'Open' },
  acknowledgedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  acknowledgedAt:   { type: Date },
  penaltyApplied:   { type: Number, default: 0 },
  elapsedTimeMin:   { type: Number },
  slaLimitMin:      { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('BreachAlert', breachAlertSchema);