import express from 'express';
import Candidate from '../models/Candidate.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all candidates
// @route   GET /api/recruitment
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const candidates = await Candidate.find({});
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add new candidate
// @route   POST /api/recruitment
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, role, email, phone, resumeUrl } = req.body;

  try {
    const candidate = await Candidate.create({
      name,
      role,
      email,
      phone,
      resumeUrl,
    });

    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update candidate stage
// @route   PUT /api/recruitment/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { stage, notes } = req.body;

  try {
    const candidate = await Candidate.findById(req.params.id);

    if (candidate) {
      candidate.stage = stage || candidate.stage;
      candidate.notes = notes || candidate.notes;
      const updatedCandidate = await candidate.save();
      res.json(updatedCandidate);
    } else {
      res.status(404).json({ message: 'Candidate not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
