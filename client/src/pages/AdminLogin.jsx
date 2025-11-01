import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin@123');
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
      if (data.user?.role !== 'admin') throw new Error('Not an admin account');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('Admin login successful');
      navigate('/admin', { replace: true });
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <main className="container py-5" style={{ maxWidth: 520 }}>
      <div className="card card-shadow">
        <div className="card-body p-4">
          <h2 className="mb-3">Admin Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary" type="submit">Login as Admin</button>
          </form>
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      </div>
    </main>
  );
}


