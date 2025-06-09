// pages/Profile.jsx
import React from 'react';
import UserProfile from '../components/UserProfile';
import TravelLogCard from '../components/TravelLogCard';
const Profile = () => {
  const user = {
    name: 'Alex Johnson',
    bio: 'Digital nomad exploring the world one country at a time. Passionate about photography and local cuisine.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  };

  const userLogs = [
    {
      _id: '1',
      title: 'Sunset at Santorini',
      description: 'The most beautiful sunset I\'ve ever seen in Santorini, Greece.',
      location: 'Santorini, Greece',
      tags: ['sunset', 'greece', 'island'],
      imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
      createdAt: new Date()
    },
    {
      _id: '2',
      title: 'Hiking in the Swiss Alps',
      description: 'An unforgettable hiking experience in the Swiss Alps.',
      location: 'Swiss Alps',
      tags: ['hiking', 'mountains', 'adventure'],
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
      createdAt: new Date()
    }
  ];

  const savedLogs = [
    {
      _id: '3',
      title: 'Tokyo Street Food Tour',
      description: 'Exploring the vibrant street food scene in Tokyo.',
      location: 'Tokyo, Japan',
      tags: ['food', 'japan', 'city'],
      imageUrl: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3',
      createdAt: new Date()
    }
  ];

  return (
    <div className="profile-page">
      <UserProfile user={user} userLogs={userLogs} savedLogs={savedLogs} />
    </div>
  );
};

export default Profile;