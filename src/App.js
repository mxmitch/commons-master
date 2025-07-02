import React, { useEffect, useState, Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axiosInstance from './utils/axiosInstance';

import Home from "./views/HomePage/Home.js";
import ProfilePage from "./views/ProfilePage/ProfilePage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import SignupPage from "./views/SignupPage/SignupPage.js";
import WatchListPage from "./views/WatchListPage/WatchListPage.js";
import LoadingSpinner from "./views/LoadingSpinner/LoadingSpinner.js";
import Header from "./views/Header/Header";
import BillsPage from "./views/BillsPage/BillsPage.js";

import useLoading from "./hooks/useLoading";

const App = (props) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [bills, setBills] = useState([]);
  const [categories, setCategories] = useState([]);
  const { loading, updateLoadingState } = useLoading(bills.length === 0);

  useEffect(() => {
    loginStatus();
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axiosInstance.get('/api/bills');
      setBills(response.data.bills);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error occurred on fetchBills:", error);
    } finally {
      updateLoadingState(false);
    }
  };

  const loginStatus = async () => {
    updateLoadingState(true);
    try {
      const response = await axiosInstance.get('/api/auth/check-auth');

      if (response.data.loggedIn) {
        setLoggedIn(true);
        setUser(response.data.user);
      } else {
        setLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error occurred on loginStatus:", error);
      setLoggedIn(false);
      setUser(null);
    } finally {
      updateLoadingState(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData.user);
    setLoggedIn(true);
  };

  const handleLogout = async () => {
    updateLoadingState(true);
    try {
      await axiosInstance.delete('/api/auth/logout');
      setUser(null);
      setLoggedIn(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      updateLoadingState(false);
    }
  };

  return (
    <div>
      <Router>
        {loading ? (
          <div
            style={{
              minHeight: "100vh",
              minWidth: "100vw",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <LoadingSpinner />
          </div>
        ) : (
          <Fragment>
            <Header
              color="transparent"
              brand="Commons"
              fixed
              changeColorOnScroll={{
                height: 200,
                color: "white",
              }}
              user={user}
              loggedIn={loggedIn}
              handleLogout={handleLogout}
              {...props}
            />
            <Routes>
              <Route path="/" element={
                <Home bills={bills} categories={categories} handleLogout={handleLogout} loggedInStatus={loggedIn} user={user} />
              } />
              <Route path="/bills" element={
                <BillsPage categories={categories} user={user} setUser={setUser} updateWatchList={() => { }} />
              } />
              <Route path="/login-page" element={
                <LoginPage handleLogin={handleLogin} loggedInStatus={loggedIn} />
              } />
              <Route path="/signup-page" element={
                <SignupPage categories={categories} handleLogin={handleLogin} loggedInStatus={loggedIn} />
              } />
              <Route path="/watch-list" element={
                <WatchListPage bills={bills} user={user} categories={categories} handleLogin={handleLogin} loggedInStatus={loggedIn} />
              } />
              <Route path="/user/:id" element={
                <ProfilePage user={user} loggedInStatus={loggedIn} />
              } />
            </Routes>
          </Fragment>
        )}
      </Router>
    </div>
  );
};

export default App;
