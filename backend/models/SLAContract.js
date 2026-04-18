const mongoose = require('mongoose');

const slaContractSchema = new mongoose.Schema({
  clientName:       { type: String, required: true, trim: true },
  serviceTier:      { type: String, enum: ['Bronze', 'Silver', 'Gold'], required: true },
  responseTimeMin:  { type: Number, required: true },
  resolutionTimeHr: { type: Number, required: true },
  penaltyPerBreach: { type: Number, required: true },
  status:           { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  createdBy:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalBreaches:    { type: Number, default: 0 },
  totalPenalty:     { type: Number, default: 0 },
  complianceRate:   { type: Number, default: 100 },
}, { timestamps: true });

module.exports = mongoose.model('SLAContract', slaContractSchema);