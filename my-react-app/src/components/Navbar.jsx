import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCompass, FaPlus, FaUser, FaSearch, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaCompass className="navbar-icon" />
          <span>TravelNetwork</span>
        </Link>
        
        <div className="navbar-links">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          
          <Link to="/logs" className="navbar-link">
            <FaSearch className="icon" />
            <span>Explore</span>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/logs/new" className="navbar-link">
                <FaPlus className="icon" />
                <span>Add Log</span>
              </Link>
              <Link to="/profile" className="navbar-link">
                <FaUser className="icon" />
                <span>{user?.username || 'Profile'}</span>
              </Link>
              <button onClick={handleLogout} className="navbar-link logout-btn">
                <FaSignOutAlt className="icon" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                <FaUser className="icon" />
                <span>Login</span>
              </Link>
              <Link to="/register" className="navbar-link">
                <FaPlus className="icon" />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;