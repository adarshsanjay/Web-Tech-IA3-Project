import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import api from "../../api";

function useAuthHeaders() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', phone: '' });
  const [msg, setMsg] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/users', { headers: useAuthHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed');
        setUsers(data);
      } catch (e) { setError(e.message); }
    })();
  }, []);
  async function create(e) {
    e.preventDefault(); setMsg('');
    try {
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/admin/users', {
        method: 'POST',
        headers: useAuthHeaders(),
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setMsg('User created');
      setForm({ name: '', email: '', password: '', role: 'customer', phone: '' });
      // reload list
      const r2 = await fetch('/api/admin/users', { headers: useAuthHeaders() });
      setUsers(await r2.json());
    } catch (e) { setMsg(e.message); }
  }
  return (
    <div>
      <h3>Users</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="row g-2 mb-3" onSubmit={create}>
        <div className="col-md-3"><input className="form-control" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></div>
        <div className="col-md-3"><input className="form-control" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/></div>
        <div className="col-md-2">
          <input type="password" className="form-control" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="col-md-2"><button className="btn btn-primary w-100">Create</button></div>
      </form>
      {msg && <div className="alert alert-info mb-2">{msg}</div>}
      <ul className="list-group">
        {users.map(u => (
          <li key={u._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div><strong>{u.name}</strong> — {u.email} ({u.role})</div>
              <div className="muted">Customer ID: {u.autoId || '—'}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Vehicles() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ owner: '', make: '', model: '' });
  const [msg, setMsg] = useState('');
  const headers = useAuthHeaders();
  async function load() {
    const res = await fetch('/api/admin/vehicles', { headers });
    let temp = await res.json()
    console.log(temp)
    setItems(temp);
  }
  useEffect(() => { load(); }, []);
  async function updateStatus(id, status) {
    await fetch(`/api/admin/vehicles/${id}/status`, { method: 'PATCH', headers, body: JSON.stringify({ status }) });
    load();
  }
  async function create(e) {
    e.preventDefault();
    setMsg('');
    const res = await fetch('${API_BASE_URL}/api/admin/vehicles', { method: 'POST', headers, body: JSON.stringify(form) });
    if (res.ok) { setForm({ owner: '', make: '', model: '' }); setMsg('Created'); load(); }
    else setMsg('Error creating');
  }
  return (
    <div>
      <h3>Vehicles</h3>
      <form className="row g-2" onSubmit={create}>
        <div className="col-md-3"><input className="form-control" placeholder="Owner (id / CU-... / email)" value={form.owner} onChange={e=>setForm({...form, owner:e.target.value})}/></div>
        <div className="col-md-3"><input className="form-control" placeholder="Make" value={form.make} onChange={e=>setForm({...form, make:e.target.value})}/></div>
        <div className="col-md-3"><input className="form-control" placeholder="Model" value={form.model} onChange={e=>setForm({...form, model:e.target.value})}/></div>
        <div className="col-md-3"><button className="btn btn-primary w-100">Add</button></div>
      </form>
      {msg && <div className="alert alert-info mt-2">{msg}</div>}
      <ul className="list-group mt-3">
        {items?.map(v => (
          <li key={v._id} className="list-group-item d-flex align-items-center justify-content-between">
            <div>
              <div><strong>{v.make} {v.model}</strong> — owner {v.owner?.email}</div>
              <div className="muted">ID: {v.autoId} • Status: {v.status}</div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <select className="form-select form-select-sm" defaultValue={v.status} onChange={e=>updateStatus(v._id, e.target.value)}>
                <option value="pending">Pending</option>
                <option value="in_service">In Service</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Services() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ vehicle: '', description: '', cost: 0 });
  const [msg, setMsg] = useState('');
  const headers = useAuthHeaders();
  async function load(){ const r=await fetch('/api/admin/services', { headers }); setItems(await r.json()); }
  useEffect(()=>{ load(); },[]);
  async function create(e){
    e.preventDefault(); setMsg('');
    const res = await fetch('${API_BASE_URL}/api/admin/services',{ method:'POST', headers, body: JSON.stringify(form)});
    const data = await res.json().catch(()=>({}));
    if (!res.ok) { setMsg(data.message || 'Failed to add service'); return; }
    setForm({ vehicle:'', description:'', cost:0}); setMsg('Service recorded'); load();
  }
  async function setStatus(id, status){
    const r = await fetch(`/api/admin/services/${id}/status`, { method: 'PATCH', headers, body: JSON.stringify({ status })});
    if (r.ok) load();
  }
  return (
    <div>
      <h3>Services</h3>
      <form className="row g-2" onSubmit={create}>
        <div className="col-md-3"><input className="form-control" placeholder="Vehicle Id" value={form.vehicle} onChange={e=>setForm({...form, vehicle:e.target.value})}/></div>
        <div className="col-md-5"><input className="form-control" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/></div>
        <div className="col-md-2"><input type="number" className="form-control" placeholder="Cost" value={form.cost} onChange={e=>setForm({...form, cost:Number(e.target.value)})}/></div>
        <div className="col-md-2"><button className="btn btn-primary w-100">Add</button></div>
      </form>
      {msg && <div className="alert alert-info mt-2">{msg}</div>}
      <ul className="list-group mt-3">
        {items.map(s => (
          <li key={s._id} className="list-group-item d-flex align-items-center justify-content-between">
            <div>
              <div><strong>{s.vehicle?.make || s.vehicle}</strong> — {s.description} (${s.cost})</div>
              <div className="muted">Status: {s.status}</div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <select className="form-select form-select-sm" defaultValue={s.status} onChange={e=>setStatus(s._id, e.target.value)}>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
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
      const saved = localStorage.getItem('admin_appointments_form');
      return saved ? JSON.parse(saved) : { customer: '', vehicle: '', date: '' };
    } catch { return { customer: '', vehicle: '', date: '' }; }
  });
  const [msg, setMsg] = useState('');
  const headers = useAuthHeaders();
  async function load(){ const r=await fetch('/api/admin/appointments', { headers }); setItems(await r.json()); }
  useEffect(()=>{ load(); },[]);
  useEffect(()=>{
    localStorage.setItem('admin_appointments_form', JSON.stringify(form));
  }, [form]);
  async function create(e){
    e.preventDefault(); setMsg('');
    if (!form.customer || !form.vehicle || !form.date) { setMsg('All fields are required'); return; }
    const isoDate = new Date(form.date).toISOString();
    const res = await fetch('${API_BASE_URL}/api/admin/appointments', { method:'POST', headers, body: JSON.stringify({ ...form, date: isoDate })});
    const data = await res.json().catch(()=>({}));
    if (!res.ok) { setMsg(data.message || 'Failed to create'); return; }
    setForm({ customer:'', vehicle:'', date:''});
    setMsg('Appointment created');
    load();
  }
  return (
    <div>
      <h3>Appointments</h3>
      <form className="row g-2" onSubmit={create}>
        <div className="col-md-3"><input className="form-control" placeholder="Customer Id" value={form.customer} onChange={e=>setForm({...form, customer:e.target.value})}/></div>
        <div className="col-md-3"><input className="form-control" placeholder="Vehicle Id" value={form.vehicle} onChange={e=>setForm({...form, vehicle:e.target.value})}/></div>
        <div className="col-md-3"><input type="datetime-local" className="form-control" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}/></div>
        <div className="col-md-3"><button className="btn btn-primary w-100">Add</button></div>
      </form>
      {msg && <div className="alert alert-info mt-2">{msg}</div>}
      <ul className="list-group mt-3">
        {items.map(a => <li key={a._id} className="list-group-item">{a.customer?.email} — {a.vehicle?._id} — {new Date(a.date).toLocaleString()}</li>)}
      </ul>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <main className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="page-title m-0">Admin Dashboard</h2>
        <div className="d-flex align-items-center gap-2">
          <span className="badge text-bg-primary">Admin</span>
          <button className="btn btn-outline-light btn-sm" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/'; }}>Logout</button>
        </div>
      </div>
      <ul className="nav nav-pills mb-3">
        <li className="nav-item"><Link className="nav-link" to="users">Users</Link></li>
        <li className="nav-item"><Link className="nav-link" to="vehicles">Vehicles</Link></li>
        <li className="nav-item"><Link className="nav-link" to="services">Services</Link></li>
        <li className="nav-item"><Link className="nav-link" to="appointments">Appointments</Link></li>
      </ul>
      <div className="card card-shadow">
        <div className="card-body">
          <Routes>
            <Route path="users" element={<Users />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="services" element={<Services />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="*" element={<div className="muted">Select a tab to manage resources.</div>} />
          </Routes>
        </div>
      </div>
    </main>
  );
}


