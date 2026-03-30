import express from 'express';
import Performance from '../models/Performance.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get performance records (goals + reviews)
// @route   GET /api/performance
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { type, employee } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (employee) filter.employee = employee;

    const records = await Performance.find(filter)
      .populate('employee', 'name email role')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get my goals & reviews
// @route   GET /api/performance/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const records = await Performance.find({ employee: req.user._id })
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a goal or review
// @route   POST /api/performance
// @access  Private (goals by anyone for themselves, reviews by Admin/HR)
router.post('/', protect, async (req, res) => {
  const { type, title, description, quarter, dueDate, rating, reviewer, reviewDate, feedback, employeeId } = req.body;

  try {
    // For reviews, only Admin/HR can create
    if (type === 'review' && req.user.role === 'Employee') {
      return res.status(403).json({ message: 'Only Admin or HR can create reviews' });
    }

    const record = await Performance.create({
      employee: type === 'review' && employeeId ? employeeId : req.user._id,
      type,
      title,
      description,
      quarter,
      dueDate,
      status: 'Not Started',
      progress: 0,
      rating,
      reviewer,
      reviewDate,
      feedback,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a goal/review (progress, status, etc.)
// @route   PUT /api/performance/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const record = await Performance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });

    // Employees can only update their own goals
    if (req.user.role === 'Employee' && record.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this record' });
    }

    const { title, description, progress, status, quarter, dueDate, rating, reviewer, reviewDate, feedback } = req.body;

    if (title !== undefined) record.title = title;
    if (description !== undefined) record.description = description;
    if (progress !== undefined) {
      record.progress = Math.min(100, Math.max(0, Number(progress)));
      if (record.progress === 100) record.status = 'Completed';
    }
    if (status !== undefined) record.status = status;
    if (quarter !== undefined) record.quarter = quarter;
    if (dueDate !== undefined) record.dueDate = dueDate;
    if (rating !== undefined) record.rating = rating;
    if (reviewer !== undefined) record.reviewer = reviewer;
    if (reviewDate !== undefined) record.reviewDate = reviewDate;
    if (feedback !== undefined) record.feedback = feedback;

    const updated = await record.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a performance record
// @route   DELETE /api/performance/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const record = await Performance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    await record.deleteOne();
    res.json({ message: 'Record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
