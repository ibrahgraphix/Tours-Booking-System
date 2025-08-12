import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader/AdminHeader";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";

const AdminLayout = () => {
  return (
    <>
      <AdminHeader />

      {/* Sidebar is fixed under header, so main must account for header height and sidebar width */}
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <main
          style={{
            flex: 1,
            padding: "20px",
            paddingTop: "84px", // ensure content is below header (header 64px + some breathing room)
            marginLeft: "240px", // leaves space for expanded sidebar
            transition: "margin-left 0.28s ease",
            minHeight: "100vh",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
