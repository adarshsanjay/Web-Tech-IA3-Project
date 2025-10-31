import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectToDatabase } from '../src/utils/db.js';
import User from '../src/models/User.js';

async function run() {
  await connectToDatabase();
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const customerEmail = process.env.SEED_CUSTOMER_EMAIL || 'customer@example.com';

  const admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    await User.create({ name: 'Admin', email: adminEmail, password: process.env.SEED_ADMIN_PASSWORD || 'Admin@123', role: 'admin' });
    console.log('Created admin:', adminEmail);
  } else {
    console.log('Admin already exists:', adminEmail);
  }

  const customer = await User.findOne({ email: customerEmail });
  if (!customer) {
    await User.create({ name: 'Customer', email: customerEmail, password: process.env.SEED_CUSTOMER_PASSWORD || 'Customer@123', role: 'customer' });
    console.log('Created customer:', customerEmail);
  } else {
    console.log('Customer already exists:', customerEmail);
  }

  await mongoose.disconnect();
  console.log('Seed complete');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});


