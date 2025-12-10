import express from 'express';
import Asset from '../models/Asset.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all assets
// @route   GET /api/assets
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const assets = await Asset.find({}).populate('assignedTo', 'name');
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add new asset
// @route   POST /api/assets
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { assetId, name, type, purchaseDate, value } = req.body;

  try {
    const asset = await Asset.create({
      assetId,
      name,
      type,
      purchaseDate,
      value,
    });

    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Assign asset
// @route   PUT /api/assets/:id/assign
// @access  Private/Admin
router.put('/:id/assign', protect, admin, async (req, res) => {
  const { employeeId, assignedDate } = req.body;

  try {
    const asset = await Asset.findById(req.params.id);

    if (asset) {
      asset.assignedTo = employeeId;
      asset.assignedDate = assignedDate || new Date();
      asset.status = 'In Use';

      const updatedAsset = await asset.save();
      res.json(updatedAsset);
    } else {
      res.status(404).json({ message: 'Asset not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
