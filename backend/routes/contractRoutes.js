const express = require('express');
const router = express.Router();
const { getContracts, createContract, updateContract, deleteContract } = require('../controllers/contractController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',    protect, getContracts);
router.post('/',   protect, adminOnly, createContract);
router.put('/:id', protect, adminOnly, updateContract);
router.delete('/:id', protect, adminOnly, deleteContract);

module.exports = router;
