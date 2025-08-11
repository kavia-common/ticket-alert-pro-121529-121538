import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// PUBLIC_INTERFACE
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock authentication for demo purposes (no backend connection)
const DEMO_MODE = true;

// PUBLIC_INTERFACE
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing user session on mount
  useEffect(() => {
    const userData = localStorage.getItem('tickethawk_user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('tickethawk_user');
      }
    }
    setLoading(false);
  }, []);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      // Simulate API delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (DEMO_MODE) {
        // In demo mode, accept any email/password combination
        if (email && password) {
          const mockUser = {
            id: Date.now().toString(),
            email: email,
            firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            lastName: 'User',
            preferences: {
              notifications: true,
              emailAlerts: true,
              priceThreshold: 50
            },
            subscription: {
              type: 'free',
              alerts: 5,
              alertsUsed: 2
            },
            loginTime: new Date().toISOString()
          };
          
          // Store user data in localStorage for persistence
          localStorage.setItem('tickethawk_user', JSON.stringify(mockUser));
          setUser(mockUser);
          return { success: true };
        } else {
          setError('Please enter both email and password');
          return { success: false, error: 'Please enter both email and password' };
        }
      }
      
      // This would be the real API call if backend was connected
      // const response = await axios.post('/api/auth/login', { email, password });
      // const { token, user: userData } = response.data;
      // localStorage.setItem('tickethawk_token', token);
      // setUser(userData);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      // Simulate API delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (DEMO_MODE) {
        // In demo mode, accept any registration data
        if (userData.email && userData.password && userData.firstName && userData.lastName) {
          const mockUser = {
            id: Date.now().toString(),
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            preferences: {
              notifications: true,
              emailAlerts: true,
              priceThreshold: 50
            },
            subscription: {
              type: 'free',
              alerts: 5,
              alertsUsed: 0
            },
            registrationTime: new Date().toISOString()
          };
          
          // Store user data in localStorage for persistence
          localStorage.setItem('tickethawk_user', JSON.stringify(mockUser));
          setUser(mockUser);
          return { success: true };
        } else {
          setError('Please fill in all required fields');
          return { success: false, error: 'Please fill in all required fields' };
        }
      }
      
      // This would be the real API call if backend was connected
      // const response = await axios.post('/api/auth/register', userData);
      // const { token, user: newUser } = response.data;
      // localStorage.setItem('tickethawk_token', token);
      // setUser(newUser);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    localStorage.removeItem('tickethawk_user');
    setUser(null);
    setError(null);
  };

  // PUBLIC_INTERFACE
  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('tickethawk_user', JSON.stringify(updatedUser));
  };

  // PUBLIC_INTERFACE
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
