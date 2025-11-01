import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import api from "../../api";

function headers() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ make: '', model: '' });
  async function load(){ const r=await fetch('/api/client/vehicles',{ headers: headers()}); setVehicles(await r.json()); }
  useEffect(()=>{ load(); },[]);
  async function create(e){ e.preventDefault(); await fetch('${API_BASE_URL}/api/client/vehicles',{ method:'POST', headers: headers(), body: JSON.stringify(form)}); setForm({ make:'', model:''}); load(); }
  return (
    <div>
      <h3>My Vehicles</h3>
      <form className="row g-2" onSubmit={create}>
        <div className="col-md-4"><input className="form-control" placeholder="Make" value={form.make} onChange={e=>setForm({...form, make:e.target.value})}/></div>
        <div className="col-md-4"><input className="form-control" placeholder="Model" value={form.model} onChange={e=>setForm({...form, model:e.target.value})}/></div>
        <div className="col-md-4"><button className="btn btn-primary w-100">Add Vehicle</button></div>
      </form>
      <ul className="list-group mt-3">
        {vehicles.map(v => (
          <li key={v._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div><strong>{v.make} {v.model}</strong> — status {v.status}</div>
              <div className="muted">Vehicle ID: {v.autoId || v._id}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Appointments() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem('client_appointments_form');
      return saved ? JSON.parse(saved) : { vehicle: '', date: '' };
    } catch { return { vehicle: '', date: '' }; }
  });
  const [msg, setMsg] = useState('');
  async function load(){ const r=await fetch('/api/client/appointments', { headers: headers()}); setItems(await r.json()); }
  useEffect(()=>{ load(); },[]);
  useEffect(()=>{
    localStorage.setItem('client_appointments_form', JSON.stringify(form));
  }, [form]);
  async function create(e){
    e.preventDefault(); setMsg('');
    if (!form.vehicle || !form.date) { setMsg('Vehicle and Date are required'); return; }
    const isoDate = new Date(form.date).toISOString();
    const res = await fetch('${API_BASE_URL}/api/client/appointments',{
      method:'POST', headers: headers(), body: JSON.stringify({ vehicle: form.vehicle, date: isoDate })
    });
    const data = await res.json().catch(()=>({}));
    if (!res.ok) { setMsg(data.message || 'Failed to book'); return; }
    setForm({ vehicle:'', date:''});
    setMsg('Booked successfully');
    load();
  }
  return (
    <div>
      <h3>My Appointments</h3>
      <form className="row g-2" onSubmit={create}>
        <div className="col-md-5"><input className="form-control" placeholder="Vehicle Id" value={form.vehicle} onChange={e=>setForm({...form, vehicle:e.target.value})}/></div>
        <div className="col-md-5"><input type="datetime-local" className="form-control" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}/></div>
        <div className="col-md-2"><button className="btn btn-primary w-100">Book</button></div>
      </form>
      {msg && <div className="alert alert-info mt-2">{msg}</div>}
      <ul className="list-group mt-3">
        {items.map(a => <li key={a._id} className="list-group-item">{a.vehicle?.make} {a.vehicle?.model} — {new Date(a.date).toLocaleString()} ({a.status})</li>)}
      </ul>
    </div>
  );
}

function Feedback() {
  const [form, setForm] = useState({ vehicle: '', rating: 5, comment: '' });
  const [msg, setMsg] = useState('');
  async function submit(e){
    e.preventDefault(); setMsg('');
    try {
      const res = await fetch('${API_BASE_URL}/api/client/feedback', { method:'POST', headers: headers(), body: JSON.stringify(form)});
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data.message || 'Failed to submit');
      setMsg('Thanks for your feedback!');
      setForm({ vehicle:'', rating: 5, comment:''});
    } catch (err) {
      setMsg(err.message);
    }
  }
  return (
    <div>
      <h3>Feedback</h3>
      <form className="row g-2" onSubmit={submit}>
        <div className="col-md-6"><input className="form-control" placeholder="Vehicle Id (optional)" value={form.vehicle} onChange={e=>setForm({...form, vehicle:e.target.value})}/></div>
        <div className="col-md-4"><input className="form-control" placeholder="Comment" value={form.comment} onChange={e=>setForm({...form, comment:e.target.value})}/></div>
        <div className="col-md-2"><button className="btn btn-primary w-100">Submit</button></div>
      </form>
      {msg && <div className="alert alert-info mt-2">{msg}</div>}
    </div>
  );
}

export default function ClientDashboard() {
  return (
    <main className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="page-title m-0">Client Dashboard</h2>
        <div className="d-flex align-items-center gap-2">
          <span className="badge text-bg-success">Client</span>
          <button className="btn btn-outline-light btn-sm" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/'; }}>Logout</button>
        </div>
      </div>
      <ul className="nav nav-pills mb-3">
        <li className="nav-item"><Link className="nav-link" to="vehicles">My Vehicles</Link></li>
        <li className="nav-item"><Link className="nav-link" to="appointments">Appointments</Link></li>
        <li className="nav-item"><Link className="nav-link" to="feedback">Feedback</Link></li>
      </ul>
      <div className="card card-shadow">
        <div className="card-body">
          <Routes>
            <Route path="vehicles" element={<MyVehicles />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="*" element={<div className="muted">Select a tab to get started.</div>} />
          </Routes>
        </div>
      </div>
    </main>
  );
}


