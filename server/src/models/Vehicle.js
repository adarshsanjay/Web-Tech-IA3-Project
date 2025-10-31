import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    vin: { type: String, unique: true, sparse: true },
    registrationNumber: { type: String },
    status: { type: String, enum: ['pending', 'in_service', 'completed'], default: 'pending' },
    autoId: { type: String, unique: true, index: true }
  },
  { timestamps: true }
);

function generateAutoId() {
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase().slice(-6);
  return `VH-${ts}-${rand}`;
}

vehicleSchema.pre('save', function(next) {
  if (!this.autoId) {
    this.autoId = generateAutoId();
  }
  next();
});

export default mongoose.model('Vehicle', vehicleSchema);


