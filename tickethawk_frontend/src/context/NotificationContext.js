import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

// Mock notifications for demo purposes (no backend connection)
const DEMO_MODE = true;

// PUBLIC_INTERFACE
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// PUBLIC_INTERFACE
export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);

  // Initialize mock notifications or WebSocket connection when user is authenticated
  useEffect(() => {
    if (user) {
      if (DEMO_MODE) {
        // Load mock notifications for demo
        const mockNotifications = [
          {
            id: 1,
            type: 'price_alert',
            title: 'Price Drop Alert!',
            message: 'Taylor Swift - Eras Tour tickets dropped to $125 (was $150)',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            read: false
          },
          {
            id: 2,
            type: 'event_available',
            title: 'New Event Available!',
            message: 'Coldplay World Tour tickets are now available at Hollywood Bowl',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            read: false
          },
          {
            id: 3,
            type: 'price_alert',
            title: 'Price Drop Alert!',
            message: 'NBA Finals Game 4 tickets dropped to $180 (was $200)',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            read: true
          }
        ];
        
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
        setConnected(true); // Simulate connection for demo
        
        // Simulate receiving a new notification after login
        setTimeout(() => {
          addNotification({
            id: Date.now(),
            type: 'price_alert',
            title: 'Welcome to TicketHawk!',
            message: 'Your demo account is ready. Try creating some alerts!',
            timestamp: new Date().toISOString(),
            read: false
          });
        }, 3000);
        
      } else {
        // Real WebSocket connection would go here
        // const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'ws://localhost:8000';
        
        // This would be the real WebSocket implementation
        // const newSocket = io(SOCKET_URL, {
        //   auth: { token: localStorage.getItem('tickethawk_user') },
        //   transports: ['websocket']
        // });
        // ... WebSocket event handlers ...
      }
    }
  }, [user]);

  // PUBLIC_INTERFACE
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    }
  };

  // PUBLIC_INTERFACE
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // PUBLIC_INTERFACE
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // PUBLIC_INTERFACE
  const deleteNotification = (notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });
  };

  // PUBLIC_INTERFACE
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // PUBLIC_INTERFACE
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  const value = {
    socket,
    notifications,
    unreadCount,
    connected,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    requestNotificationPermission
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
