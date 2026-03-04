import express from 'express';
import OfficeLocation from '../models/OfficeLocation.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get active office location
// @route   GET /api/office-location
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const location = await OfficeLocation.findOne({ isActive: true });
    if (!location) {
      return res.status(404).json({ message: 'No office location configured' });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create or update office location
// @route   PUT /api/office-location
// @access  Private/Admin
router.put('/', protect, async (req, res) => {
  const { name, latitude, longitude, radiusMeters } = req.body;

  try {
    // Deactivate all others, upsert active one
    let location = await OfficeLocation.findOne({ isActive: true });

    if (location) {
      location.name = name || location.name;
      location.latitude = latitude;
      location.longitude = longitude;
      location.radiusMeters = radiusMeters || location.radiusMeters;
    } else {
      location = new OfficeLocation({
        name: name || 'Headquarters',
        latitude,
        longitude,
        radiusMeters: radiusMeters || 100,
      });
    }

    await location.save();
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
