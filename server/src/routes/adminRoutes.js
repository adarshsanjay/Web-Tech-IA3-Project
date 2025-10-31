import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import ServiceRecord from '../models/ServiceRecord.js';
import Appointment from '../models/Appointment.js';
import { resolveVehicleId } from '../utils/resolveVehicle.js';
import { resolveUserId } from '../utils/resolveUser.js';

const router = express.Router();

router.use(requireAuth, requireRole('admin'));

// Users
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) { next(err); }
});
router.post('/users', async (req, res, next) => {
  try {
    const { name, email, password, role = 'customer', phone } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('name, email, password are required');
    }
    if (!['admin', 'customer'].includes(role)) {
      res.status(400);
      throw new Error('Invalid role');
    }
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400);
      throw new Error('Email already in use');
    }
    const user = await User.create({ name, email, password, role, phone });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) { next(err); }
});

// Vehicles basic CRUD
router.post('/vehicles', async (req, res, next) => {
  try {
    const { owner, make, model, year, vin, registrationNumber } = req.body;
    if (!owner || !make || !model) { res.status(400); throw new Error('owner, make, model are required'); }
    const ownerId = await (await import('../utils/resolveUser.js')).resolveUserId(owner);
    if (!ownerId) { res.status(404); throw new Error('Owner (customer) not found'); }
    const created = await Vehicle.create({ owner: ownerId, make, model, year, vin, registrationNumber });
    res.status(201).json(created);
  } catch (e) { next(e); }
});
router.get('/vehicles', async (req, res, next) => {
  try { res.json(await Vehicle.find().populate('owner', 'name email')); } catch (e) { next(e); }
});

// Update vehicle status
router.patch('/vehicles/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'in_service', 'completed'];
    if (!allowed.includes(status)) { res.status(400); throw new Error('Invalid status'); }
    const updated = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('owner', 'name email');
    if (!updated) { res.status(404); throw new Error('Vehicle not found'); }
    res.json(updated);
  } catch (e) { next(e); }
});

// Service Records
router.post('/services', async (req, res, next) => {
  try {
    const { vehicle, description, cost } = req.body;
    if (!vehicle || !description) { res.status(400); throw new Error('vehicle and description are required'); }
    const vehicleId = await resolveVehicleId(vehicle);
    if (!vehicleId) { res.status(404); throw new Error('Vehicle not found'); }
    const v = await Vehicle.findById(vehicleId);
    if (!v) { res.status(404); throw new Error('Vehicle not found'); }
    const record = await ServiceRecord.create({ vehicle: vehicleId, description, cost });
    // move vehicle to in_service when a service record is created
    if (v.status !== 'in_service') {
      v.status = 'in_service';
      await v.save();
    }
    res.status(201).json(record);
  } catch (e) { next(e); }
});
router.get('/services', async (req, res, next) => {
  try { res.json(await ServiceRecord.find().populate('vehicle')); } catch (e) { next(e); }
});

// Update service status and optionally complete vehicle
router.patch('/services/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body; // 'scheduled' | 'in_progress' | 'done'
    const allowed = ['scheduled', 'in_progress', 'done'];
    if (!allowed.includes(status)) { res.status(400); throw new Error('Invalid status'); }
    const record = await ServiceRecord.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('vehicle');
    if (!record) { res.status(404); throw new Error('Service not found'); }
    if (status === 'done' && record.vehicle) {
      await Vehicle.findByIdAndUpdate(record.vehicle._id, { status: 'completed' });
    }
    res.json(record);
  } catch (e) { next(e); }
});

// Appointments
router.post('/appointments', async (req, res, next) => {
  try {
    const { customer, vehicle, date, notes } = req.body;
    if (!customer || !vehicle || !date) { res.status(400); throw new Error('customer, vehicle, date required'); }
    const [customerId, vehicleId] = await Promise.all([
      resolveUserId(customer),
      resolveVehicleId(vehicle)
    ]);
    if (!customerId) { res.status(404); throw new Error('Customer not found'); }
    if (!vehicleId) { res.status(404); throw new Error('Vehicle not found'); }
    const v = await Vehicle.findById(vehicleId);
    if (!v) { res.status(404); throw new Error('Vehicle not found'); }
    const appt = await Appointment.create({ customer: customerId, vehicle: vehicleId, date, notes, status: 'confirmed' });
    res.status(201).json(appt);
  } catch (e) { next(e); }
});
router.get('/appointments', async (req, res, next) => {
  try { res.json(await Appointment.find().populate('customer', 'name email').populate('vehicle')); } catch (e) { next(e); }
});

// Update appointment status
router.patch('/appointments/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body; // 'pending' | 'confirmed' | 'completed' | 'cancelled'
    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) { res.status(400); throw new Error('Invalid status'); }
    const updated = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('vehicle customer', 'name email');
    if (!updated) { res.status(404); throw new Error('Appointment not found'); }
    res.json(updated);
  } catch (e) { next(e); }
});

export default router;


