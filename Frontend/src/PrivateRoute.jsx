import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
