# Vehicle Service App

Node.js + MongoDB backend with React + Bootstrap frontend.

## Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas connection string

## Backend Setup
```bash
cd "./server"
npm install
```
Create `.env` in `server/`:
```bash
MONGODB_URI=mongodb://127.0.0.1:27017/vehicle_service_app
JWT_SECRET=change_this_to_a_long_random_secret
PORT=4000

# Optional seed users
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=Admin@123
SEED_CUSTOMER_EMAIL=customer@example.com
SEED_CUSTOMER_PASSWORD=Customer@123
```
Seed (creates admin and customer):
```bash
npm run seed
```
Run backend:
```bash
npm run dev
# Health: http://localhost:4000/api/health
# Client HTML placeholder: http://localhost:4000/
# Admin HTML placeholder: http://localhost:4000/admin.html
```

## Frontend Setup (React)
```bash
cd "../client"
npm install
npm run dev
# Open the URL Vite prints, e.g., http://localhost:5173/
```
The dev server proxies API calls to `http://localhost:4000`.

### Frontend Pages
- Login: stores JWT token in localStorage
- Client Dashboard: manage vehicles, book appointments, submit feedback
- Admin Dashboard: view users, manage vehicles, services, appointments

## API Summary
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Admin: `GET /api/admin/users`, `POST/GET /api/admin/vehicles`, `POST/GET /api/admin/services`, `POST/GET /api/admin/appointments`
- Client: `POST/GET /api/client/vehicles`, `POST/GET /api/client/appointments`, `GET /api/client/vehicle-status/:vehicleId`, `POST /api/client/feedback`

## Notes
- Update `MONGODB_URI` if using Atlas.
- Ensure MongoDB is running before starting the backend.


