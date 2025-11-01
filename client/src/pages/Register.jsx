import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  async function submit(e){
    e.preventDefault(); setMessage('');
    try{
      const res = await fetch('${API_BASE_URL}/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)});
      const data = await res.json();
      if(!res.ok) throw new Error(data.message || 'Failed to register');
      // Save token and user, go to client dashboard
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/client', { replace: true });
        return;
      }
      setMessage('Registered successfully.');
      setForm({ name:'', email:'', password:'', phone:''});
    }catch(err){ setMessage(err.message); }
  }
  return (
    <main className="container py-5" style={{ maxWidth: 560 }}>
      <div className="card card-shadow">
        <div className="card-body p-4">
          <h2 className="mb-3">Create your account</h2>
          <form onSubmit={submit}>
            <div className="mb-3"><label className="form-label">Name</label><input className="form-control" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></div>
            <div className="mb-3"><label className="form-label">Email</label><input className="form-control" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/></div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
              <div className="form-text">Minimum 6 characters. Use letters and numbers for better security.</div>
            </div>
            <div className="mb-3"><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/></div>
            <button className="btn btn-success" type="submit">Register</button>
          </form>
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      </div>
    </main>
  );
}


