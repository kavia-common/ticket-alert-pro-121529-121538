import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import axios from 'axios';
import './Settings.css';

// PUBLIC_INTERFACE
const Settings = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { requestNotificationPermission } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true,
    priceAlerts: true,
    eventUpdates: true,
    marketingEmails: false
  });

  const [alertSettings, setAlertSettings] = useState({
    defaultPriceThreshold: 50,
    maxAlerts: 10,
    autoSnooze: 30,
    preferredCurrency: 'USD'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PUBLIC_INTERFACE
  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/user/settings');
      setNotificationSettings(response.data.notifications || notificationSettings);
      setAlertSettings(response.data.alerts || alertSettings);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  // PUBLIC_INTERFACE
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put('/api/user/profile', profileData);
      updateUser(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      await axios.put('/api/user/notifications', notificationSettings);
      setMessage({ type: 'success', text: 'Notification settings updated!' });
      
      if (notificationSettings.push) {
        await requestNotificationPermission();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update notification settings' });
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleAlertUpdate = async () => {
    setLoading(true);
    try {
      await axios.put('/api/user/alert-settings', alertSettings);
      setMessage({ type: 'success', text: 'Alert settings updated!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update alert settings' });
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    setLoading(true);
    try {
      await axios.put('/api/user/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'alerts', label: 'Alert Preferences', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' }
  ];

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p className="page-subtitle">
          Manage your account settings and preferences
        </p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="settings-container">
        {/* Tabs Navigation */}
        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="settings-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profile Information</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        firstName: e.target.value
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        lastName: e.target.value
                      })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={profileData.email}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      email: e.target.value
                    })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      phone: e.target.value
                    })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              
              <div className="setting-group">
                <h3>Notification Methods</h3>
                <div className="toggle-group">
                  <div className="toggle-item">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={notificationSettings.email}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          email: e.target.checked
                        })}
                      />
                      <span className="toggle-text">Email Notifications</span>
                    </label>
                  </div>
                  
                  <div className="toggle-item">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={notificationSettings.sms}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          sms: e.target.checked
                        })}
                      />
                      <span className="toggle-text">SMS Notifications</span>
                    </label>
                  </div>
                  
                  <div className="toggle-item">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={notificationSettings.push}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          push: e.target.checked
                        })}
                      />
                      <span className="toggle-text">Push Notifications</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="setting-group">
                <h3>Notification Types</h3>
                <div className="toggle-group">
                  <div className="toggle-item">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={notificationSettings.priceAlerts}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          priceAlerts: e.target.checked
                        })}
                      />
                      <span className="toggle-text">Price Drop Alerts</span>
                    </label>
                  </div>
                  
                  <div className="toggle-item">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={notificationSettings.eventUpdates}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          eventUpdates: e.target.checked
                        })}
                      />
                      <span className="toggle-text">Event Updates</span>
                    </label>
                  </div>
                  
                  <div className="toggle-item">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={notificationSettings.marketingEmails}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          marketingEmails: e.target.checked
                        })}
                      />
                      <span className="toggle-text">Marketing Emails</span>
                    </label>
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-primary"
                onClick={handleNotificationUpdate}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Save Notification Settings'}
              </button>
            </div>
          )}

          {/* Alert Preferences Tab */}
          {activeTab === 'alerts' && (
            <div className="settings-section">
              <h2>Alert Preferences</h2>
              
              <div className="form-group">
                <label className="form-label">
                  Default Price Threshold (%)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={alertSettings.defaultPriceThreshold}
                  onChange={(e) => setAlertSettings({
                    ...alertSettings,
                    defaultPriceThreshold: parseInt(e.target.value)
                  })}
                  min="1"
                  max="100"
                />
                <small>Percentage drop required to trigger an alert</small>
              </div>

              <div className="form-group">
                <label className="form-label">Maximum Active Alerts</label>
                <select
                  className="form-select"
                  value={alertSettings.maxAlerts}
                  onChange={(e) => setAlertSettings({
                    ...alertSettings,
                    maxAlerts: parseInt(e.target.value)
                  })}
                >
                  <option value={5}>5 alerts</option>
                  <option value={10}>10 alerts</option>
                  <option value={25}>25 alerts</option>
                  <option value={50}>50 alerts</option>
                  <option value={100}>100 alerts</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Auto-snooze Duration (minutes)</label>
                <select
                  className="form-select"
                  value={alertSettings.autoSnooze}
                  onChange={(e) => setAlertSettings({
                    ...alertSettings,
                    autoSnooze: parseInt(e.target.value)
                  })}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={0}>Never</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Currency</label>
                <select
                  className="form-select"
                  value={alertSettings.preferredCurrency}
                  onChange={(e) => setAlertSettings({
                    ...alertSettings,
                    preferredCurrency: e.target.value
                  })}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>

              <button 
                className="btn btn-primary"
                onClick={handleAlertUpdate}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Save Alert Settings'}
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security Settings</h2>
              
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value
                    })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value
                    })}
                    minLength="8"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value
                    })}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance Settings</h2>
              
              <div className="setting-group">
                <h3>Theme</h3>
                <div className="theme-options">
                  <button
                    className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => theme !== 'light' && toggleTheme()}
                  >
                    <span className="theme-icon">☀️</span>
                    <span>Light Theme</span>
                  </button>
                  
                  <button
                    className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => theme !== 'dark' && toggleTheme()}
                  >
                    <span className="theme-icon">🌙</span>
                    <span>Dark Theme</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
