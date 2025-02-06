import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthenticatedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("id") !== null ? true : false;
  let location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default AuthenticatedRoute;
