import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: String, required: true }, // e.g., "March 2024"
  year: { type: Number, required: true },
  basicSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  status: { type: String, enum: ['Draft', 'Processed', 'Paid'], default: 'Draft' },
  paymentDate: { type: Date },
}, { timestamps: true });

const Payroll = mongoose.model('Payroll', payrollSchema);

export default Payroll;
