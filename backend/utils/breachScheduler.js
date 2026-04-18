const cron = require('node-cron');
const Ticket = require('../models/Ticket');
const SLAContract = require('../models/SLAContract');
const BreachAlert = require('../models/BreachAlert');

const startBreachScheduler = (io) => {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const openTickets = await Ticket.find({
        status: { $in: ['Open', 'In Progress'] },
        slaBreached: false,
        contract: { $exists: true, $ne: null },
      }).populate('contract');

      for (const ticket of openTickets) {
        const contract = ticket.contract;
        if (!contract || contract.status !== 'Approved') continue;

        const ageMin = (Date.now() - ticket.createdAt.getTime()) / 60000;

        // Check response SLA
        if (!ticket.responseAcknowledgedAt && ageMin > contract.responseTimeMin) {
          await createBreachAlert(ticket, contract, 'Response', ageMin, contract.responseTimeMin, io);
        }

        // Check resolution SLA
        const resLimitMin = contract.resolutionTimeHr * 60;
        if (ageMin > resLimitMin) {
          await createBreachAlert(ticket, contract, 'Resolution', ageMin, resLimitMin, io);
          ticket.slaBreached = true;
          await ticket.save();
        }
      }
    } catch (err) {
      console.error('Breach scheduler error:', err.message);
    }
  });

  console.log('SLA breach scheduler started (runs every 5 minutes)');
};

const createBreachAlert = async (ticket, contract, breachType, elapsedMin, limitMin, io) => {
  // Avoid duplicate alerts for same ticket + type
  const existing = await BreachAlert.findOne({ ticket: ticket._id, breachType, status: { $ne: 'Resolved' } });
  if (existing) return;

  const severity = elapsedMin > limitMin * 2 ? 'Critical' : elapsedMin > limitMin * 1.5 ? 'High' : 'Medium';

  const alert = await BreachAlert.create({
    ticket: ticket._id,
    contract: contract._id,
    breachType,
    severity,
    penaltyApplied: contract.penaltyPerBreach,
    elapsedTimeMin: Math.round(elapsedMin),
    slaLimitMin: limitMin,
  });

  // Update contract totals
  await SLAContract.findByIdAndUpdate(contract._id, {
    $inc: { totalBreaches: 1, totalPenalty: contract.penaltyPerBreach },
  });

  // Emit real-time alert to all connected clients
  io.emit('alert:new', {
    ...alert.toObject(),
    ticketSubject: ticket.subject,
    clientName: contract.clientName,
  });

  console.log(`Breach alert created: ${contract.clientName} - ${breachType} - ${ticket.subject}`);
};

module.exports = { startBreachScheduler };
