import mongoose from 'mongoose';

const locationSubSchema = {
  latitude: { type: Number },
  longitude: { type: Number },
};

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  checkInLocation: { type: locationSubSchema },
  checkOutLocation: { type: locationSubSchema },
  checkInWithinGeofence: { type: Boolean },
  checkOutWithinGeofence: { type: Boolean },
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half Day'], default: 'Present' },
  notes: { type: String },
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
