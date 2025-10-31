import mongoose from 'mongoose';
import User from '../models/User.js';

export async function resolveUserId(input) {
  if (!input) return null;
  if (mongoose.Types.ObjectId.isValid(input)) return input;
  // Try by autoId
  let u = await User.findOne({ autoId: input }).select('_id');
  if (u) return u._id;
  // Try by email
  u = await User.findOne({ email: input.toLowerCase() }).select('_id');
  return u ? u._id : null;
}


