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
  const [user, setUser] = useState();
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

  // Fetches bills from the Rails back end
  const fetchBills = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_COMMONS_API}/api/bills`,
        {
          withCredentials: true, // Ensure cookies and credentials are included in the request
        }
      );

      const sortedBills = response.data.bills.sort(
        (a, b) => new Date(b.introduced_date) - new Date(a.introduced_date)
      );
      console.log(sortedBills);

      setBills(sortedBills);
      setCategories(response.data.categories);
      updateLoadingState(false);
    } catch (error) {
      console.error("Error occurred on fetchBills:", error);
    }
  };

  const loginStatus = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_COMMONS_API}/api/auth/logged_in`
      );
      if (response.data.logged_in) {
        handleLogin(response.data);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Error occurred on loginStatus:", error);
    }
  };

  const handleProfileUpdate = async (user) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_COMMONS_API}/users/${user.id}`,
        {
          user
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
      user_bills
    }));
  };

  // Login/logout handlers
  const handleLogin = (data) => {
    setUser(data.user);
    setLoggedIn(true);
  };

  const handleLogout = async () => {
    updateLoadingState(true);
    try {
      await axios.delete(`${process.env.REACT_APP_COMMONS_API}/logout`);
      setUser(null);
      setLoggedIn(false);
      props.history.push("/");
      updateLoadingState(false);
    } catch (error) {
      updateLoadingState(false);
      console.error(`Error occurred on handleProfileUpdate: ${error}`);
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
              justifyContent: "center"
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
                color: "white"
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
