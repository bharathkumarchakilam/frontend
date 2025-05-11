// HomePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div >
      <header className="home-header">
        <h1 className="hero-title">EduSync</h1>
        <p className="hero-subtitle">Education is the most powerful weapon which you can use to change the world</p>
        <nav className="navbar">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </nav>
      </header>

      <section className="home-features">
        <div className="feature-card">
          <h2>For Students</h2>
          <p>Explore interactive content and personalized assessments.</p>
        </div>
        <div className="feature-card">
          <h2>For Instructors</h2>
          <p>Build and manage engaging courses with ease.</p>
        </div>
      </section>

      <footer className="home-footer">
        <p>&copy; 2025 EduSync. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
