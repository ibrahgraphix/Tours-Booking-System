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
import TourList from "./pages/customer/TourList/TourList";
import MyBookings from "./pages/customer/MyBookings/MyBookings";

import Dashboard from "./pages/admin/Dashboard/Dashboard";
import AddTour from "./pages/admin/AddTour/AddTour";
import CalendarView from "./pages/admin/CalendarView/CalendarView";
import PaymentStatus from "./pages/admin/PaymentStatus/PaymentStatus";
import BookingList from "./pages/admin/BookingList/BookingList";
import MyTours from "./pages/admin/MyTours/MyTours";

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
      <Route path="/tours" element={<TourList />} />
      <Route path="/book" element={<BookingForm />} />
      <Route path="/bookings" element={<MyBookings />} />
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
      <Route path="/admin/my-tours" element={<MyTours />} />
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
