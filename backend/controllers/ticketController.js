const Ticket = require('../models/Ticket');

// GET /api/tickets
const getTickets = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('contract', 'clientName serviceTier')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tickets
const createTicket = async (req, res) => {
  try {
    const { subject, description, priority, category, contract } = req.body;
    const ticket = await Ticket.create({
      subject, description, priority, category,
      contract: contract || undefined,
      createdBy: req.user._id,
    });
    // Emit real-time event
    req.app.get('io').emit('ticket:created', ticket);
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/tickets/:id
const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const { status, assignedTo, priority } = req.body;
    if (status) {
      ticket.status = status;
      if (status === 'Resolved') ticket.resolvedAt = new Date();
    }
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (priority) ticket.priority = priority;

    await ticket.save();
    req.app.get('io').emit('ticket:updated', ticket);
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/tickets/:id  (admin only)
const deleteTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTickets, createTicket, updateTicket, deleteTicket };
