import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Laptop', 'Monitor', 'Mobile', 'Peripheral', 'Furniture'], required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  assignedDate: { type: Date },
  status: { type: String, enum: ['Available', 'In Use', 'Maintenance', 'Retired'], default: 'Available' },
  purchaseDate: { type: Date },
  value: { type: Number },
}, { timestamps: true });

const Asset = mongoose.model('Asset', assetSchema);

export default Asset;
