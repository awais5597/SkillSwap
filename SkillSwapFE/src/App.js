import { CssBaseline, ThemeProvider } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import AddSkill from "./dashboardAndAddSKill/AddSkill";
import Dashboard from "./dashboardAndAddSKill/Dashboard";
import Header from "./Header";
import Login from "./userSessions/Login";
import Register from "./userSessions/Register";
import Theme from "./Theme";
import ToastMessage from "./ToastMessage";
import MySentRequests from "./requestSection/MySentRequests";
import MyReceivedRequests from "./requestSection/MyReceivedRequests";
import InProgress from "./inProgress/InProgress";
import { useLocation } from "react-router-dom";

function App() {
  const [isAuthenticated, setisAuthenticated] = useState(
    localStorage.getItem("UserID") !== null ? true : false
  );
  const setLogin = (loggedInStatus) => {
    setisAuthenticated(loggedInStatus);
  };

  const [toastDetails, setToastDetails] = useState({
    message: "",
    severity: "",
  });

  const handleSetToastDetails = (receivedToastDetails) => {
    setToastDetails({
      ...toastDetails,
      ...receivedToastDetails,
    });
    handleShowSnackbar();
  };

  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleShowSnackbar = () => {
    setOpen(true);
  };

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <div className="App">
        <BrowserRouter>
          <Header
            isAuthenticated={isAuthenticated}
            setLogin={setLogin}
            handleSetToastDetails={handleSetToastDetails}
          />
          <div>
            <Routes>
              {isAuthenticated ? (
                <>
                  <Route
                    path="dashboard"
                    element={
                      <Dashboard
                        handleSetToastDetails={handleSetToastDetails}
                        isAuthenticated={isAuthenticated}
                        setLogin={setLogin}
                      />
                    }
                  />
                  <Route
                    path="/addSkill"
                    element={
                      <AddSkill
                        handleSetToastDetails={handleSetToastDetails}
                        isAuthenticated={isAuthenticated}
                        setLogin={setLogin}
                      />
                    }
                  />
                  <Route
                    path="mySentRequests"
                    element={
                      <MySentRequests isAuthenticated={isAuthenticated} />
                    }
                  />
                  <Route
                    path="myReceivedRequests"
                    element={
                      <MyReceivedRequests
                        handleSetToastDetails={handleSetToastDetails}
                        isAuthenticated={isAuthenticated}
                      />
                    }
                  />
                  <Route path="swaps" element={<InProgress />} />
                  <Route
                    path="*"
                    element={
                      <Navigate
                        to="/dashboard"
                        handleSetToastDetails={handleSetToastDetails}
                        isAuthenticated={isAuthenticated}
                        setLogin={setLogin}
                      />
                    }
                  />
                </>
              ) : (
                <>
                  <Route
                    path="/login"
                    element={
                      <Login
                        handleSetToastDetails={handleSetToastDetails}
                        setLogin={setLogin}
                        setisAuthenticated={setisAuthenticated}
                      />
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <Register
                        handleSetToastDetails={handleSetToastDetails}
                        isAuthenticated={isAuthenticated}
                        setLogin={setLogin}
                      />
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <Navigate
                        to="/login"
                        isAuthenticated={isAuthenticated}
                        setLogin={setLogin}
                      />
                    }
                  />
                </>
              )}
            </Routes>
            <ToastMessage
              open={open}
              message={toastDetails.message}
              severity={toastDetails.severity}
              handleClose={handleClose}
            />
          </div>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
