import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaEye } from 'react-icons/fa';
import { travelLogs } from '../services/api';

const TravelLogCard = ({ log, onUpdate }) => {
  const [liked, setLiked] = useState(log.likes?.includes(localStorage.getItem('userId')));
  const [likesCount, setLikesCount] = useState(log.likes?.length || 0);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await travelLogs.like(log._id);
      setLiked(response.data.likes.includes(localStorage.getItem('userId')));
      setLikesCount(response.data.likes.length);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error liking travel log:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/logs/${log._id}`);
  };

  // Function to determine the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-image.jpg';
    
    // If it's an Unsplash URL, add size parameters
    if (imagePath.includes('unsplash.com')) {
      // Add size parameters to the URL
      const baseUrl = imagePath.split('?')[0];
      return `${baseUrl}?auto=format&fit=crop&w=800&q=80`;
    }
    
    // If it's already a full URL, return it as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // For local images, prepend the server URL
    return `http://localhost:5000${imagePath}`;
  };

  const handleImageError = (e) => {
    e.stopPropagation();
    console.error('Image failed to load:', e.target.src);
    setImageError(true);
    e.target.src = '/default-image.jpg';
  };
  
  return (
    <div className="travel-log-card">
      <div className="card-image">
        <img 
          src={getImageUrl(log.image)} 
          alt={log.title}
          onError={handleImageError}
          crossOrigin="anonymous"
          style={{ display: imageError ? 'none' : 'block' }}
        />
        {imageError && (
          <div className="image-error">
            <p>Image not available</p>
        </div>
        )}
      </div>
      <div className="card-content">
        <h3>{log.title}</h3>
        <p className="location">
          <i className="fas fa-map-marker-alt"></i> {log.location}
        </p>
        <p className="description">{log.description}</p>
        <div className="tags">
          {log.tags.map((tag, index) => (
            <span key={index} className="tag">
              #{tag}
            </span>
          ))}
        </div>
        <div className="card-footer">
          <div className="author">
            <img
              src={log.author?.profilePicture || '/default-avatar.png'}
              alt={log.author?.username || 'Anonymous'}
              className="author-avatar"
            />
            <span>{log.author?.username || 'Anonymous'}</span>
          </div>
          <div className="interactions">
            <button
              className={`like-btn ${liked ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={loading}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
              <span>{likesCount}</span>
          </button>
            <button 
              className="view-details-btn"
              onClick={handleViewDetails}
            >
              <FaEye />
              <span>View Details</span>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelLogCard;