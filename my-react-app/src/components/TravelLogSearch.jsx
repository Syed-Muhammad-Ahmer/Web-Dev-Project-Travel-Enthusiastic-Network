// components/TravelLogSearch.jsx
import React, { useState } from 'react';
import TravelLogCard from './TravelLogCard';

const TravelLogSearch = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Extract unique tags and locations from logs
  const allTags = [...new Set(logs.flatMap(log => log.tags))];
  const allLocations = [...new Set(logs.map(log => log.location))];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         log.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? log.tags.includes(selectedTag) : true;
    const matchesLocation = selectedLocation ? log.location === selectedLocation : true;
    return matchesSearch && matchesTag && matchesLocation;
  });

  return (
    <div className="travel-log-search">
      <div className="search-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Filter by Tag:</label>
          <select 
            value={selectedTag} 
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Filter by Location:</label>
          <select 
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {allLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="logs-grid">
        {filteredLogs.length > 0 ? (
          filteredLogs.map(log => (
            <TravelLogCard key={log._id} log={log} />
          ))
        ) : (
          <p className="no-results">No travel logs found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default TravelLogSearch;