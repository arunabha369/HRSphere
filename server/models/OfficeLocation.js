import mongoose from 'mongoose';

const officeLocationSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Headquarters' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radiusMeters: { type: Number, required: true, default: 100 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const OfficeLocation = mongoose.model('OfficeLocation', officeLocationSchema);

export default OfficeLocation;
