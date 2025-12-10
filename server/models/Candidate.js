import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  stage: { type: String, enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'], default: 'Applied' },
  email: { type: String, required: true },
  phone: { type: String },
  resumeUrl: { type: String },
  notes: { type: String },
  appliedDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
