const express = require('express');
const router = express.Router();
const { getTickets, createTicket, updateTicket, deleteTicket } = require('../controllers/ticketController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',    protect, getTickets);
router.post('/',   protect, createTicket);
router.put('/:id', protect, updateTicket);
router.delete('/:id', protect, adminOnly, deleteTicket);

module.exports = router;
