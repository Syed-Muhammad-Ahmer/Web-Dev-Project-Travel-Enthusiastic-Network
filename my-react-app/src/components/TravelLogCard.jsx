import React from 'react';
import { FaHeart, FaComment, FaBookmark } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TravelLogCard = ({ log }) => {
  // Ensure log has an ID, fallback to 'demo' for mock data
  const logId = log._id || 'demo';
  
  return (
    <div className="travel-log-card">
      <div className="card-image">
        <img src={log.imageUrl} alt={log.title} />
        <div className="card-overlay">
          <span className="location-badge">{log.location}</span>
        </div>
      </div>
      
      <div className="card-content">
        <h3>{log.title}</h3>
        <p className="description">{log.description.substring(0, 100)}...</p>
        
        <div className="tags">
          {log.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        
        <div className="card-actions">
          <button className="action-btn">
            <FaHeart /> 24
          </button>
          <button className="action-btn">
            <FaComment /> 5
          </button>
          <button className="action-btn">
            <FaBookmark />
          </button>
          <Link to={`/logs/${logId}`} className="read-more">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TravelLogCard;