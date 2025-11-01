import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api';

export default function UserLogin() {
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('Customer@123');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any stale session that could cause malformed token issues
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: (email || '').trim().toLowerCase(), password: (password || '').trim() })
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data.message || 'Login failed');
      if (data.user?.role !== 'customer') throw new Error('Not a customer account');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('User login successful');
      navigate('/client', { replace: true });
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <main className="container py-5" style={{ maxWidth: 520 }}>
      <div className="card card-shadow">
        <div className="card-body p-4">
          <h2 className="mb-3">User Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary" type="submit">Login as User</button>
          </form>
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      </div>
    </main>
  );
}


