// pages/Logs.jsx
import React, { useState } from 'react';
import TravelLogForm from '../components/TravelLogForm';
import TravelLogSearch from '../components/TravelLogSearch';
import TravelLogCard from '../components/TravelLogCard';
const Logs = () => {
  const [showForm, setShowForm] = useState(false);
  const [logs, setLogs] = useState([
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
    },
    {
      _id: '3',
      title: 'Tokyo Street Food Tour',
      description: 'Exploring the vibrant street food scene in Tokyo\'s Shibuya district.',
      location: 'Tokyo, Japan',
      tags: ['food', 'japan', 'city'],
      imageUrl: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3',
      createdAt: new Date()
    },
    {
      _id: '4',
      title: 'Safari in Serengeti',
      description: 'Witnessing the great migration in Tanzania\'s Serengeti National Park.',
      location: 'Serengeti, Tanzania',
      tags: ['safari', 'wildlife', 'nature'],
      imageUrl: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53',
      createdAt: new Date()
    }
  ]);

  const handleAddLog = (newLog) => {
    setLogs([...logs, { ...newLog, _id: Date.now().toString() }]);
    setShowForm(false);
  };

  return (
    <div className="logs-page">
      {showForm ? (
        <TravelLogForm onSubmit={handleAddLog} />
      ) : (
        <>
          <div className="page-header">
            <h1>Explore Travel Logs</h1>
            <button 
              className="btn primary"
              onClick={() => setShowForm(true)}
            >
              Add New Log
            </button>
          </div>
          <TravelLogSearch logs={logs} />
        </>
      )}
    </div>
  );
};

export default Logs;