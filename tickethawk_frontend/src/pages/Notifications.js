import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import './Notifications.css';

// PUBLIC_INTERFACE
const Notifications = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    clearAllNotifications 
  } = useNotifications();
  
  const [filter, setFilter] = useState('all'); // all, unread, alerts, events
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // PUBLIC_INTERFACE
  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'alerts':
        return notification.type === 'price_alert';
      case 'events':
        return notification.type === 'event_available';
      default:
        return true;
    }
  }).sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // PUBLIC_INTERFACE
  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  // PUBLIC_INTERFACE
  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  // PUBLIC_INTERFACE
  const handleBulkAction = (action) => {
    switch (action) {
      case 'markRead':
        selectedNotifications.forEach(id => markAsRead(id));
        break;
      case 'delete':
        selectedNotifications.forEach(id => deleteNotification(id));
        break;
      default:
        break;
    }
    setSelectedNotifications([]);
  };

  // PUBLIC_INTERFACE
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    if (notification.data?.eventUrl) {
      window.open(notification.data.eventUrl, '_blank');
    }
  };

  // PUBLIC_INTERFACE
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'price_alert':
        return '📉';
      case 'event_available':
        return '🎫';
      case 'system':
        return '⚙️';
      default:
        return '📬';
    }
  };

  // PUBLIC_INTERFACE
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return time.toLocaleDateString();
  };

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="page-subtitle">
            Stay updated with your price alerts and event notifications
          </p>
        </div>
        
        <div className="header-actions">
          {unreadCount > 0 && (
            <button 
              className="btn btn-outline btn-small"
              onClick={markAllAsRead}
            >
              Mark All Read ({unreadCount})
            </button>
          )}
          
          {notifications.length > 0 && (
            <button 
              className="btn btn-accent btn-small"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all notifications?')) {
                  clearAllNotifications();
                }
              }}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="notifications-controls">
        <div className="filter-section">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </button>
            <button
              className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button
              className={`filter-btn ${filter === 'alerts' ? 'active' : ''}`}
              onClick={() => setFilter('alerts')}
            >
              Price Alerts
            </button>
            <button
              className={`filter-btn ${filter === 'events' ? 'active' : ''}`}
              onClick={() => setFilter('events')}
            >
              Events
            </button>
          </div>

          <div className="sort-section">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="bulk-actions">
            <div className="bulk-info">
              {selectedNotifications.length} selected
            </div>
            <div className="bulk-buttons">
              <button
                className="btn btn-small btn-outline"
                onClick={() => handleBulkAction('markRead')}
              >
                Mark Read
              </button>
              <button
                className="btn btn-small btn-accent"
                onClick={() => handleBulkAction('delete')}
              >
                Delete
              </button>
              <button
                className="btn btn-small btn-outline"
                onClick={() => setSelectedNotifications([])}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Select All */}
        {filteredNotifications.length > 0 && (
          <div className="select-controls">
            <label className="select-all-label">
              <input
                type="checkbox"
                checked={selectedNotifications.length === filteredNotifications.length}
                onChange={handleSelectAll}
              />
              <span>Select All</span>
            </label>
          </div>
        )}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="notifications-list">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? 'unread' : ''} ${
                selectedNotifications.includes(notification.id) ? 'selected' : ''
              }`}
            >
              <div className="notification-selector">
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={() => handleSelectNotification(notification.id)}
                />
              </div>

              <div 
                className="notification-content"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="notification-body">
                  <div className="notification-header">
                    <h3 className="notification-title">{notification.title}</h3>
                    <div className="notification-time">
                      {formatRelativeTime(notification.timestamp)}
                    </div>
                  </div>
                  
                  <p className="notification-message">{notification.message}</p>
                  
                  {notification.data && (
                    <div className="notification-data">
                      {notification.data.eventName && (
                        <span className="data-tag">Event: {notification.data.eventName}</span>
                      )}
                      {notification.data.newPrice && (
                        <span className="data-tag price">Price: ${notification.data.newPrice}</span>
                      )}
                      {notification.data.oldPrice && (
                        <span className="data-tag old-price">Was: ${notification.data.oldPrice}</span>
                      )}
                    </div>
                  )}
                </div>

                {!notification.read && <div className="unread-indicator" />}
              </div>

              <div className="notification-actions">
                <button
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!notification.read) markAsRead(notification.id);
                  }}
                  title={notification.read ? 'Mark as unread' : 'Mark as read'}
                >
                  {notification.read ? '📪' : '📬'}
                </button>
                
                <button
                  className="action-btn delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  title="Delete notification"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            {filter === 'unread' ? '📭' : '📬'}
          </div>
          <h2>
            {filter === 'unread' 
              ? 'No unread notifications' 
              : filter === 'all' 
                ? 'No notifications yet'
                : `No ${filter} notifications`
            }
          </h2>
          <p>
            {filter === 'all' 
              ? 'Create some price alerts to start receiving notifications'
              : 'Check back later for new notifications'
            }
          </p>
          {filter !== 'all' && (
            <button 
              className="btn btn-outline"
              onClick={() => setFilter('all')}
            >
              View All Notifications
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
