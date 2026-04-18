const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  subject:     { type: String, required: true, trim: true },
  description: { type: String, required: true },
  priority:    { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  category:    { type: String, enum: ['Infrastructure', 'Performance', 'Security', 'Bug', 'Alerts', 'Other'], default: 'Other' },
  status:      { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contract:    { type: mongoose.Schema.Types.ObjectId, ref: 'SLAContract' },
  resolvedAt:  { type: Date },
  slaBreached: { type: Boolean, default: false },
  responseAcknowledgedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);