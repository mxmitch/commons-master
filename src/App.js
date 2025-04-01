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
  const { loading, updateLoadingState } = useLoading(bills.length === 0);

  // Loads initial page state and fetches bills/categories
  useEffect(() => {
    loginStatus();  // Check login status
    fetchBills();   // Fetch bills and categories
  }, []);

  // Fetches bills from the backend API
  const fetchBills = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_COMMONS_API}/api/bills`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add JWT token to Authorization header
        },
      });

      setBills(response.data.bills);
      setCategories(response.data.categories);
      updateLoadingState(false);  // Turn off loading after data is fetched
    } catch (error) {
      console.error("Error occurred on fetchBills:", error);
      updateLoadingState(false);  // Turn off loading if there's an error
    }
  };

  // Check login status and validate JWT
  const loginStatus = async () => {
    updateLoadingState(true);  // Start loading while checking login status
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoggedIn(false);
        setUser(null);
        updateLoadingState(false);  // End loading if no token
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_COMMONS_API}/api/auth/loginStatus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.loggedIn === "true") {
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
      updateLoadingState(false);  // End loading once login check is complete
    }
  };

  // Login/logout handlers
  const handleLogin = (data) => {
    localStorage.setItem("token", data.token);  // Save the token to localStorage
    setUser(data.user);
    setLoggedIn(true);
  };

  const handleLogout = async () => {
    updateLoadingState(true);
    try {
      await axios.delete(`${process.env.REACT_APP_COMMONS_API}/api/auth/logout`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Send the token for logout
        },
      });

      localStorage.removeItem("token");
      setUser(null);
      setLoggedIn(false);
      updateLoadingState(false);
    } catch (error) {
      console.error(`Error occurred during logout: ${error}`);
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
            <LoadingSpinner />  {/* Show the loading spinner until bills and login data is ready */}
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
              <Route
                path="/"
                element={
                  <Home
                    bills={bills}
                    categories={categories}
                    handleLogout={handleLogout}
                    loggedInStatus={loggedIn}
                    user={user}
                  />
                }
              />
              <Route
                path="/login-page"
                element={
                  <LoginPage
                    handleLogin={handleLogin}
                    loggedInStatus={loggedIn}
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
                  />
                }
              />
              <Route
                path="/user/:id"
                element={
                  <ProfilePage
                    user={user}
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
