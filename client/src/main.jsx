import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles.css';
import App from './pages/App.jsx';
// Removed generic Login in favor of dedicated Admin/User login pages
import AdminLogin from './pages/AdminLogin.jsx';
import UserLogin from './pages/UserLogin.jsx';
import Register from './pages/Register.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ClientDashboard from './pages/client/ClientDashboard.jsx';

function getCurrentUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function RequireAuth({ children }) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireRole({ role, children }) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/client'} replace />;
  return children;
}

function Root() {
  const user = getCurrentUser();
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">AutoCare+</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#topNav" aria-controls="topNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="topNav">
            <ul className="navbar-nav ms-auto">
              {!user && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/login/admin">Admin Login</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/login/user">User Login</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                </>
              )}
              {user && user.role === 'customer' && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/client">My Dashboard</Link></li>
                  <li className="nav-item"><button className="btn btn-link nav-link" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/'; }}>Logout</button></li>
                </>
              )}
              {user && user.role === 'admin' && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/admin">Admin Dashboard</Link></li>
                  <li className="nav-item"><button className="btn btn-link nav-link" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/'; }}>Logout</button></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/client/*" element={<RequireRole role="customer"><ClientDashboard /></RequireRole>} />
        <Route path="/admin/*" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<Root />);


