import mongoose from 'mongoose';
import Vehicle from '../models/Vehicle.js';

export async function resolveVehicleId(vehicleInput) {
  if (!vehicleInput) return null;
  // If it's a valid ObjectId, use as-is
  if (mongoose.Types.ObjectId.isValid(vehicleInput)) return vehicleInput;
  // Otherwise, try to find by autoId
  const v = await Vehicle.findOne({ autoId: vehicleInput }).select('_id');
  return v ? v._id : null;
}


