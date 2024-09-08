// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Add your styling here

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="path/to/your/logo.png" alt="Logo" /> {/* Add your logo image */}
        <h2>Smarter Tasks</h2>
      </div>
      <div className="links">
        <Link to="/projects" className="nav-link">Projects</Link>
        <Link to="/members" className="nav-link">Members</Link>
      </div>
      <div className="toggle-and-profile">
        <div className="toggle-switch">
          Add your toggle switch code here
        </div>
        <div className="profile-icon">
          <i className="fas fa-user"></i> {/* Add your profile icon */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
