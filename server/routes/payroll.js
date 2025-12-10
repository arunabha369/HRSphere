import express from 'express';
import Payroll from '../models/Payroll.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all payroll records
// @route   GET /api/payroll
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const payrolls = await Payroll.find({}).populate('employee', 'name department salary');
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Generate payroll for an employee
// @route   POST /api/payroll
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { employeeId, month, year, basicSalary, allowances, deductions, status } = req.body;

  try {
    const netSalary = Number(basicSalary) + Number(allowances) - Number(deductions);

    const payroll = await Payroll.create({
      employee: employeeId,
      month,
      year,
      basicSalary,
      allowances,
      deductions,
      netSalary,
      status,
      paymentDate: status === 'Paid' ? new Date() : null,
    });

    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
