import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Alerts.css';

// PUBLIC_INTERFACE
const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [formData, setFormData] = useState({
    eventName: '',
    artist: '',
    venue: '',
    date: '',
    targetPrice: '',
    maxPrice: '',
    notificationMethod: 'email'
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  // PUBLIC_INTERFACE
  const fetchAlerts = async () => {
    try {
      const response = await axios.get('/api/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleCreateAlert = () => {
    setFormData({
      eventName: '',
      artist: '',
      venue: '',
      date: '',
      targetPrice: '',
      maxPrice: '',
      notificationMethod: 'email'
    });
    setEditingAlert(null);
    setShowCreateModal(true);
  };

  // PUBLIC_INTERFACE
  const handleEditAlert = (alert) => {
    setFormData({
      eventName: alert.eventName || '',
      artist: alert.artist || '',
      venue: alert.venue || '',
      date: alert.date || '',
      targetPrice: alert.targetPrice || '',
      maxPrice: alert.maxPrice || '',
      notificationMethod: alert.notificationMethod || 'email'
    });
    setEditingAlert(alert);
    setShowCreateModal(true);
  };

  // PUBLIC_INTERFACE
  const handleDeleteAlert = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await axios.delete(`/api/alerts/${alertId}`);
        setAlerts(alerts.filter(alert => alert.id !== alertId));
      } catch (error) {
        console.error('Failed to delete alert:', error);
      }
    }
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAlert) {
        const response = await axios.put(`/api/alerts/${editingAlert.id}`, formData);
        setAlerts(alerts.map(alert => 
          alert.id === editingAlert.id ? response.data : alert
        ));
      } else {
        const response = await axios.post('/api/alerts', formData);
        setAlerts([response.data, ...alerts]);
      }
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to save alert:', error);
    }
  };

  // PUBLIC_INTERFACE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="loading-spinner">Loading alerts...</div>;
  }

  return (
    <div className="alerts-page">
      <div className="page-header">
        <div>
          <h1>Price Alerts</h1>
          <p className="page-subtitle">
            Set up alerts to get notified when ticket prices drop
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleCreateAlert}
        >
          + Create Alert
        </button>
      </div>

      {alerts.length > 0 ? (
        <div className="alerts-grid">
          {alerts.map((alert) => (
            <div key={alert.id} className="alert-card">
              <div className="alert-header">
                <h3 className="alert-title">{alert.eventName}</h3>
                <div className="alert-status">
                  <span className={`status-badge ${alert.status?.toLowerCase()}`}>
                    {alert.status || 'Active'}
                  </span>
                </div>
              </div>
              
              <div className="alert-details">
                <div className="detail-item">
                  <span className="detail-label">Artist/Team:</span>
                  <span className="detail-value">{alert.artist}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Venue:</span>
                  <span className="detail-value">{alert.venue}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {alert.date ? new Date(alert.date).toLocaleDateString() : 'TBD'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Target Price:</span>
                  <span className="detail-value price">${alert.targetPrice}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Current Price:</span>
                  <span className="detail-value price">
                    ${alert.currentPrice || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="alert-actions">
                <button 
                  className="btn btn-small btn-outline"
                  onClick={() => handleEditAlert(alert)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-small btn-accent"
                  onClick={() => handleDeleteAlert(alert.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <h2>No alerts yet</h2>
          <p>Create your first price alert to start tracking ticket prices</p>
          <button 
            className="btn btn-primary"
            onClick={handleCreateAlert}
          >
            Create Your First Alert
          </button>
        </div>
      )}

      {/* Create/Edit Alert Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingAlert ? 'Edit Alert' : 'Create New Alert'}
              </h2>
              <button 
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            
            <form className="modal-body" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="eventName" className="form-label">
                  Event Name *
                </label>
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Taylor Swift - Eras Tour"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="artist" className="form-label">
                  Artist/Team *
                </label>
                <input
                  type="text"
                  id="artist"
                  name="artist"
                  value={formData.artist}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Taylor Swift"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="venue" className="form-label">
                  Venue
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Madison Square Garden"
                />
              </div>

              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  Event Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="targetPrice" className="form-label">
                    Target Price * ($)
                  </label>
                  <input
                    type="number"
                    id="targetPrice"
                    name="targetPrice"
                    value={formData.targetPrice}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="150"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="maxPrice" className="form-label">
                    Max Price ($)
                  </label>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    value={formData.maxPrice}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="300"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notificationMethod" className="form-label">
                  Notification Method
                </label>
                <select
                  id="notificationMethod"
                  name="notificationMethod"
                  value={formData.notificationMethod}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push Notification</option>
                  <option value="all">All Methods</option>
                </select>
              </div>
            </form>

            <div className="modal-footer">
              <button 
                type="button"
                className="btn btn-outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                {editingAlert ? 'Update Alert' : 'Create Alert'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
