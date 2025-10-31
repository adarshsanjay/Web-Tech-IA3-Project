import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app.js';
import { connectToDatabase } from './utils/db.js';

const PORT = process.env.PORT || 4000;

async function start() {
  await connectToDatabase();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});


