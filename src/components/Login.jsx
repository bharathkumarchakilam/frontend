import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const API = axios.create({
  baseURL: 'https://localhost:7116/api',
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await API.post('/auth/login', {
          email: form.email,
          password: form.password,
        });

        const token = res.data.jwt;
        localStorage.setItem('jwt', token);

        const payload = JSON.parse(atob(token.split('.')[1]));
        const role =
          payload[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ];

        window.location.href =
          role === 'Instructor' ? '/instructor-dashboard' : '/student-dashboard';
      } else {
        const user = {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        };

        const res = await API.post('/auth/register', user);

        if (res.status === 200) {
          alert('Registered successfully. You can now log in.');
          setIsLogin(true);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      alert(
        err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          'Authentication failed'
      );
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card shadow-lg p-4 border-0"
        style={{ maxWidth: '420px', width: '100%', borderRadius: '20px' }}
      >
        <div className="card-body">
          <h2 className="text-center text-primary fw-bold mb-4">
            {isLogin ? 'Welcome Back 👋' : 'Join Us 🚀'}
          </h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    name="name"
                    className="form-control rounded-pill shadow-sm"
                    placeholder="Your name"
                    onChange={handleChange}
                    value={form.name}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    name="role"
                    className="form-select rounded-pill shadow-sm"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="Student">Student</option>
                    <option value="Instructor">Instructor</option>
                  </select>
                </div>
              </>
            )}
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                name="email"
                className="form-control rounded-pill shadow-sm"
                placeholder="you@example.com"
                onChange={handleChange}
                value={form.email}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control rounded-pill shadow-sm"
                placeholder="••••••••"
                onChange={handleChange}
                value={form.password}
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary rounded-pill">
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <p>
              {isLogin ? "Don't have an account?" : 'Already a member?'}{' '}
              <button
                type="button"
                className="btn btn-link"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
