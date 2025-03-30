import React, { useEffect, useState, Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";

import Home from "./views/HomePage/Home.js";
import ProfilePage from "./views/ProfilePage/ProfilePage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import SignupPage from "./views/SignupPage/SignupPage.js";
import WatchListPage from "./views/WatchListPage/WatchListPage.js";
import LoadingSpinner from "./views/LoadingSpinner/LoadingSpinner.js";
import Header from "./views/Header/Header";

import useLoading from "./hooks/useLoading";

const App = (props) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [bills, setBills] = useState([]);
  const [categories, setCategories] = useState([]);
  const { loading, updateLoadingState } = useLoading(
    bills.length === 0 ? true : false
  );

  // Loads initial page state and fetches bills/categories
  useEffect(() => {
    loginStatus();
    fetchBills();
  }, []);

  // Fetches bills from the backend API
  const fetchBills = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_COMMONS_API}/api/bills`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add JWT token to Authorization header
        },
      });

      const sortedBills = response.data.bills.sort(
        (a, b) => new Date(b.introduced_date) - new Date(a.introduced_date)
      );

      setBills(sortedBills);
      setCategories(response.data.categories);
      updateLoadingState(false);
    } catch (error) {
      console.error("Error occurred on fetchBills:", error);
    }
  };

  // Check login status and validate JWT
  const loginStatus = async () => {
    updateLoadingState(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoggedIn(false);
        setUser(null);
        updateLoadingState(false);
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_COMMONS_API}/api/auth/loginStatus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const handleProfileUpdate = async (user) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_COMMONS_API}/users/${user.id}`,
        {
          user,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Send JWT token for authentication
          },
        }
      );
      if (res.data.status === 200) {
        setUser((prev) => ({ ...res.data.user, user_bills: prev.user_bills }));
      } else {
        console.error(`Error occurred on handleProfileUpdate: ${res.data.errors}`);
      }
    } catch (error) {
      console.error(`Error occurred on handleProfileUpdate: ${error}`);
    }
  };

  const updateWatchList = (user_bills) => {
    setUser((prev) => ({
      ...prev,
      user_bills,
    }));
  };

  // Login/logout handlers
  const handleLogin = (data) => {
    localStorage.setItem("token", data.token); // Save the token to localStorage
    setUser(data.user);
    setLoggedIn(true);
  };

  const handleLogout = async () => {
    updateLoadingState(true);
    try {
      // Optionally, inform the backend that the user is logging out (e.g., invalidating the token)
      await axios.delete(`${process.env.REACT_APP_COMMONS_API}/api/auth/logout`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Send the token for logout
        },
      });

      // Remove the token from localStorage
      localStorage.removeItem("token");

      // Reset user state after successful logout
      setUser(null);
      setLoggedIn(false);

      // Redirect user to home page or login page
      props.history.push("/");

      // Stop loading state
      updateLoadingState(false);
    } catch (error) {
      updateLoadingState(false);
      console.error(`Error occurred during logout: ${error}`);
    }
  };

  return (
    <div>
      <Router>
        {loading && (
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
        )}
        {!loading && (
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
              <Route
                path="/"
                element={
                  <Home
                    bills={bills}
                    categories={categories}
                    handleLogout={handleLogout}
                    loggedInStatus={loggedIn}
                    user={user}
                    updateWatchList={updateWatchList}
                  />
                }
              />
              <Route
                path="/login-page"
                element={
                  <LoginPage
                    handleLogin={handleLogin}
                    loggedInStatus={loggedIn}
                    history={props.history}
                  />
                }
              />
              <Route
                path="/signup-page"
                element={
                  <SignupPage
                    categories={categories}
                    handleLogin={handleLogin}
                    loggedInStatus={loggedIn}
                  />
                }
              />
              <Route
                path="/watch-list"
                element={
                  <WatchListPage
                    bills={bills}
                    user={user}
                    categories={categories}
                    handleLogin={handleLogin}
                    loggedInStatus={loggedIn}
                    updateWatchList={updateWatchList}
                  />
                }
              />
              <Route
                path="/user/:id"
                element={
                  <ProfilePage
                    user={user}
                    handleProfileUpdate={handleProfileUpdate}
                    categories={categories}
                    loggedInStatus={loggedIn}
                  />
                }
              />
            </Routes>
          </Fragment>
        )}
      </Router>
    </div>
  );
};

export default App;
