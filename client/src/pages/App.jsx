import React from 'react';

export default function App() {
  return (
    <main className="container py-5">
      <div className="row align-items-center g-4">
        <div className="col-lg-7">
          <h1 className="page-title display-5 mb-3">AutoCare+ — Premium Vehicle Service</h1>
          <p className="lead muted">Book appointments, track service status, and manage your garage with a clean, fast interface.</p>
          <div className="d-flex gap-2 mt-3">
            <a href="/login/user" className="btn btn-primary btn-lg">Get Started</a>
            <a href="/register" className="btn btn-outline-light btn-lg">Create Account</a>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card card-shadow overflow-hidden mb-3">
            <img
              alt="yellow Lamborghini"
              src="https://images.unsplash.com/photo-1551522435-a13afa10f103?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyJTIwZ2FyYWdlfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000"
              referrerPolicy="no-referrer"
              loading="lazy"
              style={{ maxHeight: 240, objectFit: 'cover', width: '100%' }}
            />
          </div>
          <div className="card card-shadow overflow-hidden">
            <img
              alt="sports car night"
              src="https://img.freepik.com/free-photo/car-being-taking-care-workshop_23-2149580532.jpg?semt=ais_hybrid&w=740&q=80"
              referrerPolicy="no-referrer"
              loading="lazy"
              style={{ maxHeight: 240, objectFit: 'cover', width: '100%' }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}


