import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";

import Home from "./views/HomePage/Home.js";
import ProfilePage from "./views/ProfilePage/ProfilePage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import SignupPage from "./views/SignupPage/SignupPage.js";
import WatchListPage from "./views/WatchListPage/WatchListPage.js";
import LoadingSpinner from "./views/LoadingSpinner/LoadingSpinner.js";
import Header from "./views/Header/Header";
import BillsPage from "./views/BillsPage/BillsPage.js";
import Success from "./views/SignupPage/Success";

import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user, loggedIn, loading, logout } = useAuth();

  const [bills, setBills] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await axiosInstance.get("/api/bills");
        setBills(res.data.bills);
        setCategories(res.data.categories);
      } catch (err) {
        console.error("Bills error:", err);
      }
    };

    fetchBills();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Router>
      <Header
        user={user}
        loggedIn={loggedIn}
        handleLogout={logout}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              bills={bills}
              categories={categories}
              user={user}
              loggedInStatus={loggedIn}
            />
          }
        />

        <Route
          path="/bills"
          element={<BillsPage categories={categories} user={user} />}
        />

        <Route
          path="/login-page"
          element={<LoginPage />}
        />

        <Route
          path="/signup-page"
          element={<SignupPage />}
        />

        <Route path="/signup-success" element={<Success />} />

        <Route
          path="/watch-list"
          element={
            <WatchListPage
              bills={bills}
              user={user}
              categories={categories}
            />
          }
        />

        <Route
          path="/user/:id"
          element={<ProfilePage user={user} />}
        />
      </Routes>
    </Router>
  );
};

export default App;