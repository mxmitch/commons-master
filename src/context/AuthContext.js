import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔐 Restore session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/api/auth/check-auth");

        if (res.data.loggedIn) {
          setUser(res.data.user);
          setLoggedIn(true);
        } else {
          setUser(null);
          setLoggedIn(false);
        }
      } catch (err) {
        setUser(null);
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 🔑 Login (called from Login page)
  const login = (userData) => {
    setUser(userData.user);
    setLoggedIn(true);
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      await axiosInstance.delete("/api/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setLoggedIn(false);
    }
  };

  const value = {
    user,
    loggedIn,
    loading,
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};