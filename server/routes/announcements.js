import express from 'express';
import Announcement from '../models/Announcement.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const announcements = await Announcement.find({})
      .populate('author', 'name role')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { title, content, tag } = req.body;

  try {
    const announcement = await Announcement.create({
      title,
      content,
      tag,
      author: req.user._id,
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
