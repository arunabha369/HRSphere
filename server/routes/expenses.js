import express from 'express';
import Expense from '../models/Expense.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({}).populate('employee', 'name department');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    File new expense claim
// @route   POST /api/expenses
// @access  Private
router.post('/', protect, async (req, res) => {
  const { employeeId, title, amount, date, category, receiptUrl } = req.body;

  try {
    const expense = await Expense.create({
      employee: employeeId,
      title,
      amount,
      date,
      category,
      receiptUrl,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update expense status
// @route   PUT /api/expenses/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { status } = req.body;

  try {
    const expense = await Expense.findById(req.params.id);

    if (expense) {
      expense.status = status;
      const updatedExpense = await expense.save();
      res.json(updatedExpense);
    } else {
      res.status(404).json({ message: 'Expense claim not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
