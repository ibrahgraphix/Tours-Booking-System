import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router";

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useNavigate,
// } from "react-router-dom";
// import LoginPage from "./views/LoginPage";
// import HomePage from "./views/HomePage";
// import SignUpPage from "./views/SignupPage";
// import PrivateRoute from "./PrivateRoute";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route
//           path="/home"
//           element={
//             <PrivateRoute>
//               <HomePage />
//             </PrivateRoute>
//           }
//         />
//         <Route path="/signup" element={<SignUpPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
