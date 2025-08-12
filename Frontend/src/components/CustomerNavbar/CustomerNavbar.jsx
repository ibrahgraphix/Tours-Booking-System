import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./CustomerNavbar.module.css";

const CustomerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear the user data
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>TourConnect</div>
      <ul className={styles.navLinks}>
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/tours"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Tours
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/book"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Book Tour
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/my-bookings"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            My Bookings
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/payment"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Payment
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Contact
          </NavLink>
        </li>
        <li>
          {/* Logout is a button, not a link */}
          <button
            onClick={handleLogout}
            className={styles.logoutBtn}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "inherit",
              fontSize: "1rem",
              padding: "0",
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default CustomerNavbar;
