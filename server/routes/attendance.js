import express from 'express';
import Attendance from '../models/Attendance.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get attendance for all employees (or filtered by date)
// @route   GET /api/attendance
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const attendance = await Attendance.find({}).populate('employee', 'name department');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Check in/out
// @route   POST /api/attendance/mark
// @access  Private
router.post('/mark', protect, async (req, res) => {
  const { employeeId, type, time } = req.body; // type: 'checkIn' or 'checkOut'

  try {
    // Logic to find today's attendance record for this employee
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({ 
      employee: employeeId, 
      date: { $gte: today } 
    });

    if (!attendance) {
      if (type === 'checkOut') {
        return res.status(400).json({ message: 'Cannot check out without checking in' });
      }
      attendance = new Attendance({
        employee: employeeId,
        date: new Date(),
        checkIn: time || new Date(),
        status: 'Present'
      });
    } else {
      if (type === 'checkIn') {
        return res.status(400).json({ message: 'Already checked in' });
      }
      attendance.checkOut = time || new Date();
    }

    await attendance.save();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
