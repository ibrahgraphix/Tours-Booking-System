import React from "react";
import { Routes, Route } from "react-router-dom";

// Customer pages
import HomePage from "./pages/customer/HomePage";
import TourList from "./pages/customer/TourList";
import BookingForm from "./pages/customer/BookingForm";
import MyBookings from "./pages/customer/MyBookings";
import PaymentPage from "./pages/customer/PaymentPage";
import ContactPage from "./pages/customer/ContactPage";
import Login from "./pages/customer/Login";
import SignUp from "./pages/customer/SignUp";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import BookingList from "./pages/admin/BookingList";
import AddTour from "./pages/admin/AddTour";
import PaymentStatus from "./pages/admin/PaymentStatus";
import CalendarView from "./pages/admin/CalendarView";

const AppRoutes = () => (
  <Routes>
    {/* Customer Routes */}
    <Route path="/" element={<HomePage />} />
    <Route path="/tours" element={<TourList />} />
    <Route path="/book" element={<BookingForm />} />
    <Route path="/my-bookings" element={<MyBookings />} />
    <Route path="/payment" element={<PaymentPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />

    {/* Admin Routes */}
    <Route path="/admin/dashboard" element={<Dashboard />} />
    <Route path="/admin/bookings" element={<BookingList />} />
    <Route path="/admin/add-tour" element={<AddTour />} />
    <Route path="/admin/payments" element={<PaymentStatus />} />
    <Route path="/admin/calendar" element={<CalendarView />} />
  </Routes>
);

export default AppRoutes;
