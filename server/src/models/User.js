import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    autoId: { type: String, unique: true, index: true }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

function generateUserAutoId() {
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase().slice(-6);
  return `CU-${ts}-${rand}`;
}

userSchema.pre('save', function (next) {
  if (!this.autoId) {
    this.autoId = generateUserAutoId();
  }
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);


