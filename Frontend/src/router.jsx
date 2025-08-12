import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/UserEntry/LoginPage";
import SignUpPage from "./pages/UserEntry/SignupPage";

import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/customer/HomePage/HomePage";
import BookingForm from "./pages/customer/BookingForm/BookingForm";
import PaymentPage from "./pages/customer/PaymentPage/PaymentPage";
import ContactPage from "./pages/customer/ContactPage/ContactPage";

import Dashboard from "./pages/admin/Dashboard/Dashboard";
import AddTour from "./pages/admin/AddTour/AddTour";
import CalendarView from "./pages/admin/CalendarView/CalendarView";
import PaymentStatus from "./pages/admin/PaymentStatus/PaymentStatus";
import BookingList from "./pages/admin/BookingList/BookingList";

import { AdminRoute, CustomerRoute } from "./components/RouteGuards";

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignUpPage />} />

    {/* Protected Customer routes */}
    <Route
      element={
        <CustomerRoute>
          <CustomerLayout />
        </CustomerRoute>
      }
    >
      <Route path="/home" element={<HomePage />} />
      <Route path="/book" element={<BookingForm />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Route>

    {/* Protected Admin routes */}
    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="add-tour" element={<AddTour />} />
      <Route path="calendar" element={<CalendarView />} />
      <Route path="payment-status" element={<PaymentStatus />} />
      <Route path="booking-list" element={<BookingList />} />
    </Route>

    {/* Redirect root '/' to login */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* Catch-all: redirect unmatched routes to login */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;
