import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api';

export default function Login() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin@123');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('Logged in');
      if (data.user?.role === 'admin') navigate('/admin', { replace: true });
      else navigate('/client', { replace: true });
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <main className="container py-5" style={{ maxWidth: 520 }}>
      <div className="card card-shadow">
        <div className="card-body p-4">
          <h2 className="mb-3">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary" type="submit">Login</button>
          </form>
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      </div>
    </main>
  );
}


