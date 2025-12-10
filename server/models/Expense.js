import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: { type: String, enum: ['Travel', 'Meals', 'Office', 'Software', 'Other'], required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Reimbursed'], default: 'Pending' },
  receiptUrl: { type: String },
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
