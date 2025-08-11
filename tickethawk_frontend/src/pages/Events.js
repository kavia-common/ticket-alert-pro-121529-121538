import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Events.css';

// PUBLIC_INTERFACE
const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    dateRange: '',
    priceRange: ''
  });
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy]);

  // PUBLIC_INTERFACE
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
        sort: sortBy,
        ...filters
      });
      
      const response = await axios.get(`/api/events?${params}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // Mock data for demo
      setEvents([
        {
          id: 1,
          name: 'Taylor Swift - Eras Tour',
          artist: 'Taylor Swift',
          venue: 'Madison Square Garden',
          location: 'New York, NY',
          date: '2024-03-15',
          category: 'concert',
          minPrice: 89,
          maxPrice: 450,
          image: 'https://via.placeholder.com/300x200?text=Taylor+Swift'
        },
        {
          id: 2,
          name: 'Lakers vs Warriors',
          artist: 'Los Angeles Lakers',
          venue: 'Crypto.com Arena',
          location: 'Los Angeles, CA',
          date: '2024-03-20',
          category: 'sports',
          minPrice: 125,
          maxPrice: 800,
          image: 'https://via.placeholder.com/300x200?text=Lakers+Game'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  // PUBLIC_INTERFACE
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // PUBLIC_INTERFACE
  const handleCreateAlert = (event) => {
    // This would typically open a modal or navigate to alert creation
    console.log('Creating alert for event:', event);
  };

  if (loading) {
    return <div className="loading-spinner">Loading events...</div>;
  }

  return (
    <div className="events-page">
      <div className="page-header">
        <div>
          <h1>Browse Events</h1>
          <p className="page-subtitle">
            Find events and create price alerts for your favorites
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-section">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search events, artists, teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍
            </button>
          </div>
        </form>

        <div className="filters-section">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="concert">Concerts</option>
            <option value="sports">Sports</option>
            <option value="theater">Theater</option>
            <option value="comedy">Comedy</option>
          </select>

          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="filter-select"
          >
            <option value="">All Locations</option>
            <option value="new-york">New York</option>
            <option value="los-angeles">Los Angeles</option>
            <option value="chicago">Chicago</option>
            <option value="miami">Miami</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="filter-select"
          >
            <option value="">Any Date</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="next-month">Next Month</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date">Sort by Date</option>
            <option value="price">Sort by Price</option>
            <option value="popularity">Sort by Popularity</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img src={event.image} alt={event.name} />
                <div className="event-category">
                  {event.category}
                </div>
              </div>
              
              <div className="event-content">
                <h3 className="event-name">{event.name}</h3>
                <div className="event-artist">{event.artist}</div>
                
                <div className="event-details">
                  <div className="event-venue">
                    📍 {event.venue}
                  </div>
                  <div className="event-location">
                    {event.location}
                  </div>
                  <div className="event-date">
                    📅 {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="event-pricing">
                  <div className="price-range">
                    ${event.minPrice} - ${event.maxPrice}
                  </div>
                  <div className="price-label">Price Range</div>
                </div>

                <div className="event-actions">
                  <button 
                    className="btn btn-outline btn-small"
                    onClick={() => window.open(`/events/${event.id}`, '_blank')}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn btn-primary btn-small"
                    onClick={() => handleCreateAlert(event)}
                  >
                    Create Alert
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🎵</div>
          <h2>No events found</h2>
          <p>Try adjusting your search criteria or filters</p>
          <button 
            className="btn btn-outline"
            onClick={() => {
              setSearchTerm('');
              setFilters({
                category: '',
                location: '',
                dateRange: '',
                priceRange: ''
              });
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Events;
