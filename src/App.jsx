import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './components/Login';
import InstructorDashboard from './components/InstructorPage';
import StudentDashboard from './components/StudentPage';
import HomePage from './components/HomePage';
import Register from './components/Register';



function App() {
  const token = localStorage.getItem('jwt');

  // Dummy function to decode JWT and get the role
  const getRoleFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    } catch {
      return null;
    }
  };

  const role = getRoleFromToken();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage  />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/instructor-dashboard" element={<InstructorDashboard />} /> */}

        {/* Redirect based on role */}
        { console.log("User role:", role) }
{        console.log("Navigating to:", role === 'Instructor' ? '/instructor-dashboard' : '/student-dashboard')
      }

        <Route path="/instructor-dashboard" element={
          role === 'Instructor' ? <InstructorDashboard /> : <Navigate to="/" />
        } />
        <Route path="/student-dashboard" element={
          role === 'Student' ? <StudentDashboard /> : <Navigate to="/" />
        } />
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;