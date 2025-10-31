import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    comment: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', feedbackSchema);


