// pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCompass, FaPlus } from 'react-icons/fa';
import TravelLogCard from '../components/TravelLogCard';
const Home = () => {
  const featuredLogs = [
    {
      _id: '1',
      title: 'Sunset at Santorini',
      description: 'The most beautiful sunset I\'ve ever seen in Santorini, Greece. The colors were absolutely breathtaking!',
      location: 'Santorini, Greece',
      tags: ['sunset', 'greece', 'island'],
      imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
      createdAt: new Date()
    },
    {
      _id: '2',
      title: 'Hiking in the Swiss Alps',
      description: 'An unforgettable hiking experience in the Swiss Alps with stunning mountain views.',
      location: 'Swiss Alps',
      tags: ['hiking', 'mountains', 'adventure'],
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
      createdAt: new Date()
    }
  ];

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Share Your Travel Adventures</h1>
          <p>Connect with fellow travelers and discover amazing destinations around the world.</p>
          <div className="hero-buttons">
            <Link to="/logs" className="btn primary">
              <FaCompass /> Explore Logs
            </Link>
            <Link to="/logs/new" className="btn secondary">
              <FaPlus /> Share Your Story
            </Link>
          </div>
        </div>
      </div>
      
      <div className="featured-logs">
        <h2>Featured Travel Logs</h2>
        <div className="logs-grid">
          {featuredLogs.map(log => (
            <TravelLogCard key={log._id} log={log} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;