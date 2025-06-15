import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import { auth } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/main.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await auth.register(formData);
      if (response.data.token) {
        await login(response.data.token);
        navigate('/', { replace: true });
      } else {
        setError('Registration failed - no token received');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`register-page ${isDarkMode ? 'dark' : ''}`}>
      <style jsx>{`
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${isDarkMode ? '#0f172a' : '#f8f9fa'};
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          padding-top: 70px;
        }

        .register-page::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: ${isDarkMode ? 
            'radial-gradient(circle, rgba(107,140,174,0.1) 0%, rgba(26,26,46,0) 70%)' : 
            'radial-gradient(circle, rgba(74,111,165,0.1) 0%, rgba(248,249,250,0) 70%)'};
          animation: rotate 20s linear infinite;
          z-index: 0;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .register-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .register-hero {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 2rem;
          gap: 2rem;
        }

        .register-hero h1 {
          font-size: 3.5rem;
          font-weight: 700;
          color: ${isDarkMode ? '#f8fafc' : '#1e293b'};
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .register-hero p {
          font-size: 1.25rem;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
          margin-bottom: 0;
          max-width: 90%;
        }

        .register-hero-image {
          width: 450px;
          max-width: 600px;
          height: 500px;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,${isDarkMode ? 0.3 : 0.1});
          transition: all 0.5s ease;
        }

        .register-hero-image:hover {
          transform: translateY(-5px);
        }

        .register-card {
          background: ${isDarkMode ? '#1e293b' : '#ffffff'};
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,${isDarkMode ? 0.3 : 0.1});
          padding: 3rem;
          width: 100%;
          max-width: 500px;
          transition: all 0.3s ease;
          border: ${isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'};
        }

        .register-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .register-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: ${isDarkMode ? '#f8fafc' : '#1e293b'};
          margin-bottom: 0.5rem;
        }

        .register-header p {
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
          font-size: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
          position: relative;
        }

        .form-group label {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: ${isDarkMode ? '#e2e8f0' : '#475569'};
        }

        .input-icon {
          margin-right: 10px;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
        }

        input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid ${isDarkMode ? '#334155' : '#e2e8f0'};
          border-radius: 8px;
          font-size: 1rem;
          background-color: ${isDarkMode ? '#1e293b' : '#ffffff'};
          color: ${isDarkMode ? '#f8fafc' : '#1e293b'};
          transition: all 0.3s ease;
        }

        input:focus {
          outline: none;
          border-color: ${isDarkMode ? '#3b82f6' : '#2563eb'};
          box-shadow: 0 0 0 3px ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)'};
        }

        .password-toggle {
          position: absolute;
          right: 15px;
          top: 40px;
          cursor: pointer;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
        }

        .error-message {
          color: #ef4444;
          background-color: ${isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 500;
        }

        .auth-button {
          width: 100%;
          padding: 14px 20px;
          background: ${isDarkMode ? '#3b82f6' : '#2563eb'};
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 1rem;
        }

        .auth-button:hover {
          background: ${isDarkMode ? '#2563eb' : '#1d4ed8'};
          transform: translateY(-2px);
        }

        .auth-button:disabled {
          background: ${isDarkMode ? '#64748b' : '#94a3b8'};
          cursor: not-allowed;
          transform: none;
        }

        .button-icon {
          font-size: 1rem;
        }

        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
        }

        .auth-link {
          color: ${isDarkMode ? '#3b82f6' : '#2563eb'};
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .auth-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 1024px) {
          .register-container {
            grid-template-columns: 1fr;
            padding: 1rem;
          }

          .register-hero {
            display: none;
          }

          .register-card {
            max-width: 100%;
            padding: 2rem;
          }
        }

        @media (max-width: 768px) {
          .register-card {
            padding: 1.5rem;
          }

          .register-header h2 {
            font-size: 1.75rem;
          }

          input {
            padding: 12px 14px;
          }
        }
      `}</style>

      <div className="register-container">
        <div className="register-hero">
          <h1>Begin Your Travel Journey</h1>
          <p>Join our community of explorers and share your adventures with the world.</p>
          <img 
            src={isDarkMode ? 
              "https://images.unsplash.com/photo-1505832018823-50331d70d237?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" : 
              "https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"}
            alt="Travel Adventure"
            className="register-hero-image"
          />
        </div>

        <div className="register-card">
          <div className="register-header">
            <h2>Create Account</h2>
            <p>Join our travel community</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">
                <FaUser className="input-icon" />
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                placeholder="Choose a username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope className="input-icon" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FaLock className="input-icon" />
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Create a password"
              />
              <span 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <FaLock className="input-icon" />
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Confirm your password"
              />
              <span 
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <FaUserPlus className="button-icon" />
                  Register
                </>
              )}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;