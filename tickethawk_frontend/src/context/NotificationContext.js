import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

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
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);

  // Initialize WebSocket connection when user is authenticated
  useEffect(() => {
    if (user && !socket) {
      const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'ws://localhost:8000';
      
      const newSocket = io(SOCKET_URL, {
        auth: {
          token: localStorage.getItem('tickethawk_token')
        },
        transports: ['websocket']
      });

      newSocket.on('connect', () => {
        console.log('Connected to notification server');
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from notification server');
        setConnected(false);
      });

      newSocket.on('notification', (notification) => {
        addNotification(notification);
      });

      newSocket.on('price_alert', (alert) => {
        addNotification({
          id: Date.now(),
          type: 'price_alert',
          title: 'Price Drop Alert!',
          message: `${alert.event_name} tickets dropped to $${alert.new_price}`,
          data: alert,
          timestamp: new Date().toISOString(),
          read: false
        });
      });

      newSocket.on('event_available', (event) => {
        addNotification({
          id: Date.now(),
          type: 'event_available',
          title: 'New Event Available!',
          message: `${event.name} tickets are now available`,
          data: event,
          timestamp: new Date().toISOString(),
          read: false
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user, socket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

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
