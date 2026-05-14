import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/check-auth');

      if (response.data.loggedIn) {
        setUser(response.data.user);
        setLoggedIn(true);
      } else {
        setUser(null);
        setLoggedIn(false);
      }

    } catch (error) {

      // ✅ THIS IS NORMAL
      if (error.response?.status === 401) {
        setUser(null);
        setLoggedIn(false);
      } else {
        console.error('Auth check failed:', error);
      }

    } finally {
      setLoading(false);
    }
  };

  const login = (data) => {
    setUser(data.user);
    setLoggedIn(true);
  };

  const logout = async () => {
    try {
      await axiosInstance.delete('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loggedIn,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);