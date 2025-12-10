import express from 'express';
import Leave from '../models/Leave.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all leave requests
// @route   GET /api/leave
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const leaves = await Leave.find({}).populate('employee', 'name department');
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Apply for leave
// @route   POST /api/leave
// @access  Private
router.post('/', protect, async (req, res) => {
  const { employeeId, type, startDate, endDate, reason } = req.body;

  try {
    const leave = await Leave.create({
      employee: employeeId,
      type,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update leave status
// @route   PUT /api/leave/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { status } = req.body;

  try {
    const leave = await Leave.findById(req.params.id);

    if (leave) {
      leave.status = status;
      const updatedLeave = await leave.save();
      res.json(updatedLeave);
    } else {
      res.status(404).json({ message: 'Leave request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
