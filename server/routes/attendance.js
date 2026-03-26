import express from 'express';
import Attendance from '../models/Attendance.js';
import OfficeLocation from '../models/OfficeLocation.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Haversine formula — calculate distance (in meters) between two lat/lng points.
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// @desc    Get attendance for all employees (or filtered by date)
// @route   GET /api/attendance
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const attendance = await Attendance.find({}).populate('employee', 'name role');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get today's attendance for the logged-in user
// @route   GET /api/attendance/today
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: req.user._id,
      date: { $gte: today },
    });

    res.json(attendance || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get today's attendance for a specific employee (backward compat)
// @route   GET /api/attendance/today/:employeeId
// @access  Private
router.get('/today/:employeeId', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: req.params.employeeId,
      date: { $gte: today },
    });

    res.json(attendance || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get attendance history for the logged-in user
// @route   GET /api/attendance/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const history = await Attendance.find({ employee: req.user._id })
      .sort({ date: -1 })
      .limit(30);

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get attendance history for a specific employee (backward compat)
// @route   GET /api/attendance/history/:employeeId
// @access  Private
router.get('/history/:employeeId', protect, async (req, res) => {
  try {
    const history = await Attendance.find({ employee: req.params.employeeId })
      .sort({ date: -1 })
      .limit(30);

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Check in/out with geolocation
// @route   POST /api/attendance/mark
// @access  Private
router.post('/mark', protect, async (req, res) => {
  const { type, time, latitude, longitude } = req.body;

  // Use the authenticated user's ID — not a client-sent employeeId
  const employeeId = req.user._id;

  if (latitude == null || longitude == null) {
    return res.status(400).json({ message: 'Location coordinates are required for attendance' });
  }

  try {
    // Compute geofence status
    let withinGeofence = false;
    let distanceMeters = null;

    const officeLocation = await OfficeLocation.findOne({ isActive: true });

    if (officeLocation) {
      distanceMeters = haversineDistance(
        latitude,
        longitude,
        officeLocation.latitude,
        officeLocation.longitude
      );
      withinGeofence = distanceMeters <= officeLocation.radiusMeters;
    }

    // Find today's record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      employee: employeeId,
      date: { $gte: today },
    });

    if (!attendance) {
      if (type === 'checkOut') {
        return res.status(400).json({ message: 'Cannot check out without checking in' });
      }
      attendance = new Attendance({
        employee: employeeId,
        date: new Date(),
        checkIn: time || new Date(),
        checkInLocation: { latitude, longitude },
        checkInWithinGeofence: withinGeofence,
        status: 'Present',
      });
    } else {
      if (type === 'checkIn') {
        return res.status(400).json({ message: 'Already checked in' });
      }
      attendance.checkOut = time || new Date();
      attendance.checkOutLocation = { latitude, longitude };
      attendance.checkOutWithinGeofence = withinGeofence;
    }

    await attendance.save();

    res.json({
      attendance,
      geofence: {
        withinGeofence,
        distanceMeters: distanceMeters != null ? Math.round(distanceMeters) : null,
        officeConfigured: !!officeLocation,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
