const SLAContract = require('../models/SLAContract');

// GET /api/contracts
const getContracts = async (req, res) => {
  try {
    const contracts = await SLAContract.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/contracts
const createContract = async (req, res) => {
  try {
    const { clientName, serviceTier, responseTimeMin, resolutionTimeHr, penaltyPerBreach } = req.body;
    const contract = await SLAContract.create({
      clientName, serviceTier, responseTimeMin,
      resolutionTimeHr, penaltyPerBreach,
      createdBy: req.user._id,
    });
    res.status(201).json(contract);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/contracts/:id
const updateContract = async (req, res) => {
  try {
    const contract = await SLAContract.findByIdAndUpdate(
      req.params.id,
      { ...req.body, approvedBy: req.body.status === 'Approved' ? req.user._id : undefined },
      { new: true, runValidators: true }
    );
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    res.json(contract);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/contracts/:id
const deleteContract = async (req, res) => {
  try {
    await SLAContract.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contract deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getContracts, createContract, updateContract, deleteContract };
