import React from "react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard/Dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
};

export default App;
