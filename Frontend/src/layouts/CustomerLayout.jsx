import React from "react";
import CustomerNavbar from "../components/CustomerNavbar/CustomerNavbar";
import CustomerFooter from "../components/CustomerFooter/CustomerFooter";
import { Outlet } from "react-router-dom";

const CustomerLayout = () => {
  return (
    <>
      <CustomerNavbar />
      <main>
        <Outlet />
      </main>
      <CustomerFooter />
    </>
  );
};

export default CustomerLayout;
