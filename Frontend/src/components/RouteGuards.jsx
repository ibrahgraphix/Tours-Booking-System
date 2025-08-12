import React from "react";
import { Navigate } from "react-router-dom";

// Admin Route Guard
export function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Customer Route Guard
export function CustomerRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "customer") {
    return <Navigate to="/login" replace />;
  }
  return children;
}
