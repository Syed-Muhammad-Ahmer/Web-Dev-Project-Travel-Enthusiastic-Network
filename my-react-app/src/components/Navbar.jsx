// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCompass, FaPlus, FaUser, FaSearch } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaCompass className="navbar-icon" />
          <span>TravelNetwork</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/logs" className="navbar-link">
            <FaSearch className="icon" />
            <span>Explore</span>
          </Link>
          <Link to="/logs/new" className="navbar-link">
            <FaPlus className="icon" />
            <span>Add Log</span>
          </Link>
          <Link to="/profile" className="navbar-link">
            <FaUser className="icon" />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;