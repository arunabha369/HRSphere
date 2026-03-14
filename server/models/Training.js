import mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    enum: ['Technical', 'Leadership', 'Compliance', 'Communication', 'Design', 'Other'],
    default: 'Other',
  },
  instructor: { type: String },
  duration: { type: String }, // e.g. "4h 30m"
  thumbnail: { type: String }, // URL to image
  videoUrl: { type: String },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  enrolledUsers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  }],
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

const Training = mongoose.model('Training', trainingSchema);

export default Training;
