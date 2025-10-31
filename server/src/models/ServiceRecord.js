import mongoose from 'mongoose';

const serviceRecordSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    description: { type: String, required: true },
    cost: { type: Number, default: 0 },
    servicedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['scheduled', 'in_progress', 'done'], default: 'scheduled' }
  },
  { timestamps: true }
);

export default mongoose.model('ServiceRecord', serviceRecordSchema);


