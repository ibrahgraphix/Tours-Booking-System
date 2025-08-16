import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaListUl,
  FaBars,
  FaSignOutAlt,
  FaThList, // icon for My Tours
} from "react-icons/fa";
import styles from "./adminsidebar.module.css";

const stored = localStorage.getItem("user");
const currentUser = stored ? JSON.parse(stored) : null;
const isSuperAdmin = currentUser?.is_superadmin;

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // clear user data
    navigate("/login"); // redirect to login page
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        <FaBars />
      </button>

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
      >
        <nav className={styles.nav}>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => (isActive ? styles.activeLink : "")}
          >
            <FaTachometerAlt className={styles.icon} /> {isOpen && "Dashboard"}
          </NavLink>
          <NavLink
            to="/admin/add-tour"
            className={({ isActive }) => (isActive ? styles.activeLink : "")}
          >
            <FaPlusCircle className={styles.icon} /> {isOpen && "Add Tour"}
          </NavLink>
          <NavLink
            to="/admin/my-tours"
            className={({ isActive }) => (isActive ? styles.activeLink : "")}
          >
            <FaThList className={styles.icon} /> {isOpen && "My Tours"}
          </NavLink>
          <NavLink
            to="/admin/calendar"
            className={({ isActive }) => (isActive ? styles.activeLink : "")}
          >
            <FaCalendarAlt className={styles.icon} /> {isOpen && "Calendar"}
          </NavLink>
          <NavLink
            to="/admin/payments"
            className={({ isActive }) => (isActive ? styles.activeLink : "")}
          >
            <FaMoneyBillWave className={styles.icon} />{" "}
            {isOpen && "Payment Status"}
          </NavLink>
          <NavLink
            to="/admin/booking-list"
            className={({ isActive }) => (isActive ? styles.activeLink : "")}
          >
            <FaListUl className={styles.icon} /> {isOpen && "Booking List"}
          </NavLink>
          {isSuperAdmin && (
            <NavLink
              to="/admin/admin-users"
              className={({ isActive }) => (isActive ? styles.activeLink : "")}
            >
              <FaListUl className={styles.icon} /> {isOpen && "Admin Users"}
            </NavLink>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "inherit",
              fontSize: "1rem",
              padding: "0.5rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "auto",
              width: "100%",
            }}
          >
            <FaSignOutAlt className={styles.icon} /> {isOpen && "Logout"}
          </button>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
