// pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSignOutAlt, FaUser } from 'react-icons/fa';
import TravelLogCard from '../components/TravelLogCard';
import { auth, travelLogs } from '../services/api';

// Default avatar SVG as a data URL
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCCCCC'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userLogs, setUserLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditingPicture, setIsEditingPicture] = useState(false);
  const [newPictureUrl, setNewPictureUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch user profile
        const userResponse = await auth.getProfile();
        if (!userResponse.data) {
          throw new Error('No user data received');
        }
        setUser(userResponse.data);

        // Fetch user's logs
        const logsResponse = await travelLogs.getUserLogs();
        setUserLogs(Array.isArray(logsResponse.data) ? logsResponse.data : []);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/login');
          return;
        }
        setError(err.response?.data?.message || err.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleUpdatePicture = async (e) => {
    e.preventDefault();
    if (!newPictureUrl.trim()) return;

    try {
      setIsUpdating(true);
      setError('');
      
      // Validate URL
      try {
        new URL(newPictureUrl);
      } catch (err) {
        setError('Please enter a valid image URL');
        return;
      }

      console.log('Sending profile picture update:', newPictureUrl);
      const response = await auth.updateProfile({ profilePicture: newPictureUrl });
      console.log('Update response:', response);
      
      if (!response.data) {
        throw new Error('No response data received');
      }
      
      // Update the user state with the new profile picture
      setUser(response.data);
      
      // Close the form and clear the input
      setIsEditingPicture(false);
      setNewPictureUrl('');
    } catch (err) {
      console.error('Error updating profile picture:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile picture');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error Loading Profile</h3>
          <p>{error}</p>
          <button className="btn primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Profile Not Found</h3>
          <p>Unable to load your profile. Please try logging in again.</p>
          <button className="btn primary" onClick={handleLogout}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar-container">
            {user?.profilePicture ? (
              <>
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="profile-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    setUser(prevUser => ({
                      ...prevUser,
                      profilePicture: null
                    }));
                  }}
                />
                <button 
                  className="change-picture-btn"
                  onClick={() => setIsEditingPicture(true)}
                  title="Update profile picture"
                >
                  <FaEdit />
                </button>
              </>
            ) : (
              <button 
                className="add-picture-btn"
                onClick={() => setIsEditingPicture(true)}
              >
                <FaUser className="icon" /> Add Profile Picture
              </button>
            )}
          </div>
          {isEditingPicture && (
            <form onSubmit={handleUpdatePicture} className="picture-form">
              <input
                type="url"
                value={newPictureUrl}
                onChange={(e) => setNewPictureUrl(e.target.value)}
                placeholder="Enter image URL"
                required
              />
              <div className="picture-form-actions">
                <button 
                  type="submit" 
                  className="btn primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : user?.profilePicture ? 'Update Picture' : 'Add Picture'}
                </button>
                <button 
                  type="button" 
                  className="btn secondary"
                  onClick={() => {
                    setIsEditingPicture(false);
                    setNewPictureUrl('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          <div className="profile-details">
            <h2>{user?.username}</h2>
            <p className="email">{user?.email}</p>
            {user?.bio && <p className="bio">{user.bio}</p>}
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{userLogs.length}</span>
                <span className="stat-label">Travel Logs</span>
              </div>
              <div className="stat">
                <span className="stat-value">{user?.likes?.length || 0}</span>
                <span className="stat-label">Likes Received</span>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn secondary" onClick={() => navigate('/profile/edit')}>
            <FaEdit /> Edit Profile
          </button>
          <button className="btn danger" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="profile-content">
        <h3>My Travel Logs</h3>
        <div className="logs-grid">
          {userLogs.length > 0 ? (
            userLogs.map(log => (
              <TravelLogCard 
                key={log._id} 
                log={log}
                onUpdate={() => window.location.reload()}
              />
            ))
          ) : (
            <div className="no-logs-message">
              <p>You haven't posted any travel logs yet.</p>
              <button 
                className="btn primary"
                onClick={() => navigate('/logs/new')}
              >
                Create Your First Log
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .profile-header {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .profile-info {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .profile-avatar-container {
          position: relative;
          display: inline-block;
          margin-bottom: 20px;
        }

        .profile-avatar {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .no-picture-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .default-avatar {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background-color: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
          border: 3px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .add-picture-btn {
          padding: 8px 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .add-picture-btn:hover {
          background-color: #0056b3;
        }

        .change-picture-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .change-picture-btn:hover {
          background: #0056b3;
        }

        .picture-form {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 300px;
        }

        .picture-form input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 100%;
        }

        .picture-form-actions {
          display: flex;
          gap: 10px;
        }

        .profile-details {
          flex: 1;
        }

        .profile-details h2 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .email {
          color: #666;
          margin-bottom: 10px;
        }

        .bio {
          color: #444;
          margin-bottom: 15px;
          line-height: 1.5;
        }

        .profile-stats {
          display: flex;
          gap: 20px;
          margin-top: 15px;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.5em;
          font-weight: bold;
          color: #007bff;
        }

        .stat-label {
          color: #666;
          font-size: 0.9em;
        }

        .profile-actions {
          margin-top: 20px;
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn.primary {
          background-color: #007bff;
          color: white;
        }

        .btn.primary:hover {
          background-color: #0056b3;
        }

        .btn.secondary {
          background-color: #6c757d;
          color: white;
        }

        .btn.secondary:hover {
          background-color: #545b62;
        }

        .btn.danger {
          background-color: #dc3545;
          color: white;
        }

        .btn.danger:hover {
          background-color: #c82333;
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .profile-content {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .profile-content h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .logs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .no-logs-message {
          text-align: center;
          padding: 20px;
          color: #666;
        }

        .loading {
          text-align: center;
          padding: 20px;
          color: #666;
        }

        .error-message {
          text-align: center;
          padding: 20px;
          color: #dc3545;
          background: #f8d7da;
          border-radius: 4px;
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
};

export default Profile;