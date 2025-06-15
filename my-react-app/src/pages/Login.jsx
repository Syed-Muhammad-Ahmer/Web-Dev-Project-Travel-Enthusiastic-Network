import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaUser, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa';
import { auth } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/main.css';

const Login = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();

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

    try {
      const response = await auth.login(formData);
      if (response?.token) {
        await login(response.token, response.user, rememberMe);
        navigate('/', { replace: true });
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        error.request ? 'No response from server' : 
        'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-page ${isDarkMode ? 'dark' : ''}`}>
      <style jsx>{`
        .login-page {
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

        .login-page::before {
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

        .login-container {
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

        .login-hero {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 2rem;
        }

        .login-hero h1 {
          font-size: 3rem;
          font-weight: 700;
          color: ${isDarkMode ? '#f8fafc' : '#1e293b'};
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .login-hero p {
          font-size: 1.25rem;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
          margin-bottom: 2rem;
          max-width: 80%;
        }

        .login-hero-image {
          width: 100%;
          max-width: 500px;
          height: auto;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,${isDarkMode ? 0.3 : 0.1});
          transition: all 0.5s ease;
        }

        .login-hero-image:hover {
          transform: translateY(-5px);
        }

        .login-card {
          background: ${isDarkMode ? '#1e293b' : '#ffffff'};
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,${isDarkMode ? 0.3 : 0.1});
          padding: 3rem;
          width: 100%;
          max-width: 500px;
          transition: all 0.3s ease;
          border: ${isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'};
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: ${isDarkMode ? '#f8fafc' : '#1e293b'};
          margin-bottom: 0.5rem;
        }

        .login-header p {
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
          font-size: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
          position: relative;
        }

        label {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          color: ${isDarkMode ? '#e2e8f0' : '#475569'};
          font-weight: 500;
          font-size: 0.95rem;
        }

        .input-icon {
          margin-right: 10px;
          color: ${isDarkMode ? '#6b8cae' : '#4a6fa5'};
        }

        input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 10px;
          border: 1px solid ${isDarkMode ? '#334155' : '#e2e8f0'};
          background: ${isDarkMode ? '#1e293b' : '#ffffff'};
          color: ${isDarkMode ? '#f8fafc' : '#1e293b'};
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        input:focus {
          outline: none;
          border-color: ${isDarkMode ? '#6b8cae' : '#4a6fa5'};
          box-shadow: 0 0 0 3px ${isDarkMode ? 'rgba(107, 140, 174, 0.2)' : 'rgba(74, 111, 165, 0.2)'};
        }

        .password-toggle {
          position: absolute;
          right: 15px;
          top: 42px;
          cursor: pointer;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
          transition: all 0.2s ease;
        }

        .password-toggle:hover {
          color: ${isDarkMode ? '#6b8cae' : '#4a6fa5'};
        }

        .remember-forgot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .remember-me {
          display: flex;
          align-items: center;
        }

        .remember-me input {
          width: auto;
          margin-right: 8px;
          accent-color: ${isDarkMode ? '#6b8cae' : '#4a6fa5'};
        }

        .forgot-password {
          color: ${isDarkMode ? '#6b8cae' : '#4a6fa5'};
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .forgot-password:hover {
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          padding: 14px;
          background: ${isDarkMode ? '#6b8cae' : '#4a6fa5'};
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          margin-bottom: 1.5rem;
        }

        .login-button:hover {
          background: ${isDarkMode ? '#5a7c9e' : '#3a5f85'};
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,${isDarkMode ? 0.2 : 0.1});
        }

        .login-button:disabled {
          background: ${isDarkMode ? '#4a5568' : '#cbd5e1'};
          transform: none;
          box-shadow: none;
          cursor: not-allowed;
        }

        .button-icon {
          margin-right: 10px;
        }

        .loading-spinner {
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top: 2px solid white;
          width: 18px;
          height: 18px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .divider {
          display: flex;
          align-items: center;
          color: ${isDarkMode ? '#94a3b8' : '#cbd5e1'};
          margin: 1.5rem 0;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid ${isDarkMode ? '#334155' : '#e2e8f0'};
        }

        .divider::before {
          margin-right: 15px;
        }

        .divider::after {
          margin-left: 15px;
        }

        .social-login {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .social-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${isDarkMode ? '#334155' : '#f1f5f9'};
          color: ${isDarkMode ? '#f8fafc' : '#1e293b'};
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid ${isDarkMode ? '#334155' : '#e2e8f0'};
        }

        .social-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,${isDarkMode ? 0.2 : 0.1});
        }

        .google-button:hover {
          background: #4285F4;
          color: white;
        }

        .facebook-button:hover {
          background: #4267B2;
          color: white;
        }

        .twitter-button:hover {
          background: #1DA1F2;
          color: white;
        }

        .register-link {
          text-align: center;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
          margin-top: 1.5rem;
        }

        .register-link a {
          color: ${isDarkMode ? '#6b8cae' : '#4a6fa5'};
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .register-link a:hover {
          text-decoration: underline;
        }

        .error-message {
          color: ${isDarkMode ? '#fca5a5' : '#ef4444'};
          background: ${isDarkMode ? 'rgba(252,165,165,0.1)' : 'rgba(239,68,68,0.1)'};
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          text-align: center;
          border: 1px solid ${isDarkMode ? '#fca5a5' : '#ef4444'};
          font-size: 0.95rem;
        }

        @media (max-width: 1024px) {
          .login-container {
            grid-template-columns: 1fr;
            padding: 1rem;
          }

          .login-hero {
            display: none;
          }

          .login-card {
            max-width: 100%;
            padding: 2rem;
          }
        }

        @media (max-width: 768px) {
          .login-card {
            padding: 1.5rem;
          }

          .login-header h2 {
            font-size: 1.75rem;
          }

          input {
            padding: 12px 14px;
          }
        }
      `}</style>

      <div className="login-container">
        <div className="login-hero">
          <h1>Discover Amazing Travel Experiences</h1>
          <p>Join our community of travelers and share your adventures with the world.</p>
          <img 
            src={isDarkMode ? 
              "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" : 
              "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"}
            alt="Travel Adventure"
            className="login-hero-image"
          />
        </div>

        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Login to continue your travel journey</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="usernameOrEmail">
                <FaUser className="input-icon" />
                Username or Email
              </label>
              <input
                type="text"
                id="usernameOrEmail"
                name="usernameOrEmail"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                required
                placeholder="Enter your username or email"
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
                placeholder="Enter your password"
              />
              <span 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="remember-forgot">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <FaSignInAlt className="button-icon" />
                  Login
                </>
              )}
            </button>
          </form>

          <div className="divider">or</div>

          <div className="social-login">
            <button type="button" className="social-button google-button">
              <FaGoogle />
            </button>
            <button type="button" className="social-button facebook-button">
              <FaFacebook />
            </button>
            <button type="button" className="social-button twitter-button">
              <FaTwitter />
            </button>
          </div>

          <div className="register-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;