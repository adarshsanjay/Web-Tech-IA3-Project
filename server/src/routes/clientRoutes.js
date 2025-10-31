import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Vehicle from '../models/Vehicle.js';
import Appointment from '../models/Appointment.js';
import Feedback from '../models/Feedback.js';
import { resolveVehicleId } from '../utils/resolveVehicle.js';

const router = express.Router();

router.use(requireAuth);

// Vehicles owned by the user
router.post('/vehicles', async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create({ ...req.body, owner: req.user._id });
    res.status(201).json(vehicle);
  } catch (err) { next(err); }
});
router.get('/vehicles', async (req, res, next) => {
  try { res.json(await Vehicle.find({ owner: req.user._id })); } catch (e) { next(e); }
});

// Book appointment
router.post('/appointments', async (req, res, next) => {
  try {
    const vehicleId = await resolveVehicleId(req.body.vehicle);
    if (!vehicleId) { res.status(404); throw new Error('Vehicle not found'); }
    const appointment = await Appointment.create({ ...req.body, vehicle: vehicleId, customer: req.user._id });
    res.status(201).json(appointment);
  } catch (e) { next(e); }
});
router.get('/appointments', async (req, res, next) => {
  try {
    const items = await Appointment.find({ customer: req.user._id }).populate('vehicle');
    res.json(items);
  } catch (e) { next(e); }
});

// Vehicle status
router.get('/vehicle-status/:vehicleId', async (req, res, next) => {
  try {
    const vehicleId = await resolveVehicleId(req.params.vehicleId);
    const vehicle = await Vehicle.findOne({ _id: vehicleId, owner: req.user._id });
    if (!vehicle) { res.status(404); throw new Error('Vehicle not found'); }
    res.json({ status: vehicle.status });
  } catch (e) { next(e); }
});

// Feedback
router.post('/feedback', async (req, res, next) => {
  try {
    const { vehicle, rating, comment } = req.body;
    let vehicleId = undefined;
    if (vehicle) {
      vehicleId = await resolveVehicleId(vehicle);
      if (!vehicleId) { vehicleId = undefined; }
    }
    const numRating = Number(rating);
    const finalRating = Number.isFinite(numRating) && numRating >= 1 && numRating <= 5 ? numRating : 5;
    const payload = { customer: req.user._id, rating: finalRating, comment };
    if (vehicleId) payload.vehicle = vehicleId;
    const feedback = await Feedback.create(payload);
    res.status(201).json(feedback);
  } catch (e) { next(e); }
});

export default router;


