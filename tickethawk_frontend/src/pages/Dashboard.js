import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import './Dashboard.css';

// PUBLIC_INTERFACE
const Dashboard = () => {
  const { user } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [stats, setStats] = useState({
    activeAlerts: 0,
    eventsTracked: 0,
    priceDropsToday: 0,
    savings: 0
  });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // PUBLIC_INTERFACE
  const fetchDashboardData = async () => {
    try {
      // Simulate API delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data for demo purposes (no backend connection)
      const mockStats = {
        activeAlerts: 3,
        eventsTracked: 12,
        priceDropsToday: 2,
        savings: 245
      };
      
      const mockRecentAlerts = [
        {
          id: 1,
          eventName: 'Taylor Swift - Eras Tour',
          targetPrice: 150,
          status: 'active',
          venue: 'Madison Square Garden',
          date: '2024-03-15'
        },
        {
          id: 2,
          eventName: 'NBA Finals Game 4',
          targetPrice: 200,
          status: 'triggered',
          venue: 'Chase Center',
          date: '2024-06-14'
        },
        {
          id: 3,
          eventName: 'Coldplay World Tour',
          targetPrice: 120,
          status: 'active',
          venue: 'Hollywood Bowl',
          date: '2024-05-22'
        }
      ];
      
      setStats(mockStats);
      setRecentAlerts(mockRecentAlerts);
      
      // This would be the real API call if backend was connected
      // const [statsResponse, alertsResponse] = await Promise.all([
      //   axios.get('/api/dashboard/stats'),
      //   axios.get('/api/alerts/recent?limit=5')
      // ]);
      // setStats(statsResponse.data);
      // setRecentAlerts(alertsResponse.data);
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.firstName || 'User'}! 👋</h1>
        <p className="dashboard-subtitle">
          Here's what's happening with your ticket alerts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <div className="stat-number">{stats.activeAlerts}</div>
            <div className="stat-label">Active Alerts</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎵</div>
          <div className="stat-content">
            <div className="stat-number">{stats.eventsTracked}</div>
            <div className="stat-label">Events Tracked</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📉</div>
          <div className="stat-content">
            <div className="stat-number">{stats.priceDropsToday}</div>
            <div className="stat-label">Price Drops Today</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-number">${stats.savings}</div>
            <div className="stat-label">Total Savings</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Quick Actions */}
        <div className="quick-actions card">
          <div className="card-header">
            <h2 className="card-title">Quick Actions</h2>
          </div>
          <div className="actions-grid">
            <Link to="/alerts" className="action-item">
              <div className="action-icon">➕</div>
              <div className="action-text">
                <div className="action-title">Create Alert</div>
                <div className="action-desc">Set up price tracking</div>
              </div>
            </Link>
            
            <Link to="/events" className="action-item">
              <div className="action-icon">🔍</div>
              <div className="action-text">
                <div className="action-title">Browse Events</div>
                <div className="action-desc">Find tickets to track</div>
              </div>
            </Link>
            
            <Link to="/subscriptions" className="action-item">
              <div className="action-icon">⭐</div>
              <div className="action-text">
                <div className="action-title">Upgrade Plan</div>
                <div className="action-desc">Get premium features</div>
              </div>
            </Link>
            
            <Link to="/referrals" className="action-item">
              <div className="action-icon">👥</div>
              <div className="action-text">
                <div className="action-title">Refer Friends</div>
                <div className="action-desc">Earn rewards</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="recent-notifications card">
          <div className="card-header">
            <h2 className="card-title">Recent Notifications</h2>
            <Link to="/notifications" className="view-all-link">
              View All {unreadCount > 0 && `(${unreadCount})`}
            </Link>
          </div>
          
          {notifications.length > 0 ? (
            <div className="notifications-list">
              {notifications.slice(0, 5).map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                >
                  <div className="notification-icon">
                    {notification.type === 'price_alert' ? '📉' : 
                     notification.type === 'event_available' ? '🎫' : '📬'}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  {!notification.read && <div className="unread-dot" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📬</div>
              <div className="empty-text">No notifications yet</div>
              <div className="empty-desc">
                Set up alerts to get notified about price drops
              </div>
            </div>
          )}
        </div>

        {/* Recent Alerts */}
        <div className="recent-alerts card">
          <div className="card-header">
            <h2 className="card-title">Recent Alerts</h2>
            <Link to="/alerts" className="view-all-link">View All</Link>
          </div>
          
          {recentAlerts.length > 0 ? (
            <div className="alerts-list">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="alert-item">
                  <div className="alert-info">
                    <div className="alert-name">{alert.eventName}</div>
                    <div className="alert-details">
                      <span className="alert-price">Target: ${alert.targetPrice}</span>
                      <span className="alert-status badge badge-primary">
                        {alert.status}
                      </span>
                    </div>
                  </div>
                  <div className="alert-actions">
                    <button className="btn btn-small btn-outline">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <div className="empty-text">No alerts yet</div>
              <div className="empty-desc">
                Create your first alert to start tracking prices
              </div>
              <Link to="/alerts" className="btn btn-primary">
                Create Alert
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
