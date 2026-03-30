import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['goal', 'review'], required: true },

  // Goal fields
  title: { type: String, required: true },
  description: { type: String },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: { type: String, enum: ['On Track', 'At Risk', 'Completed', 'Not Started'], default: 'Not Started' },
  quarter: { type: String }, // e.g. "Q1 2025"
  dueDate: { type: Date },

  // Review fields
  rating: { type: Number, min: 0, max: 5 },
  reviewer: { type: String },
  reviewDate: { type: Date },
  feedback: { type: String },
}, { timestamps: true });

const Performance = mongoose.model('Performance', performanceSchema);

export default Performance;
