import express from 'express';
import Training from '../models/Training.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all training courses
// @route   GET /api/training
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const courses = await Training.find({ isPublished: true })
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new course
// @route   POST /api/training
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { title, description, category, instructor, duration, thumbnail, videoUrl, level } = req.body;

  try {
    const course = await Training.create({
      title,
      description,
      category,
      instructor,
      duration,
      thumbnail,
      videoUrl,
      level,
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Enroll current user in a course
// @route   POST /api/training/:id/enroll
// @access  Private
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const course = await Training.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const alreadyEnrolled = course.enrolledUsers.find(
      (e) => e.user?.toString() === req.user._id.toString()
    );
    if (alreadyEnrolled) return res.status(400).json({ message: 'Already enrolled' });

    course.enrolledUsers.push({ user: req.user._id, progress: 0 });
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update progress for current user
// @route   PUT /api/training/:id/progress
// @access  Private
router.put('/:id/progress', protect, async (req, res) => {
  const { progress } = req.body;

  try {
    const course = await Training.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrollment = course.enrolledUsers.find(
      (e) => e.user?.toString() === req.user._id.toString()
    );
    if (!enrollment) return res.status(400).json({ message: 'Not enrolled in this course' });

    enrollment.progress = Math.min(100, Math.max(0, Number(progress)));
    if (enrollment.progress === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
    }
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a course
// @route   DELETE /api/training/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const course = await Training.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
