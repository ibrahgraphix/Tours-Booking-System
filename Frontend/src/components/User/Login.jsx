import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { FaUniversity } from "react-icons/fa";
import { loginUser } from "../../API/auth";
import { LOGIN_ERROR_MESSAGES } from "../../constants/messeges";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login submitted:", { email, password });

    try {
      const userData = await loginUser(email, password);
      console.log("Login successful:", userData);

      // Store entire user object including role
      localStorage.setItem("user", JSON.stringify(userData.user));

      // ✅ Redirect based on role
      if (userData.user.role === "super_admin") {
        navigate("/admin/users"); // only you
      } else if (userData.user.role === "admin") {
        navigate("/admin"); // normal admin dashboard
      } else {
        navigate("/home"); // customer dashboard
      }
    } catch (error) {
      console.error("Login failed:", error);

      const errorData = error?.response?.data;
      const code = errorData?.error?.errorCode;
      const fallbackMessage = errorData?.error?.Message;

      const message =
        LOGIN_ERROR_MESSAGES[code] ||
        fallbackMessage ||
        LOGIN_ERROR_MESSAGES.DEFAULT;

      alert(message);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Login</h1>
      </header>
      <div className={styles.container}>
        <div className={styles.logo}>
          <FaUniversity className={styles.icon} />
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@gmail.com"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.loginBtn}>
            Login
          </button>
          <button
            type="button"
            className={styles.googleBtn}
            onClick={() => navigate("/signup")}
          >
            <span>Sign Up</span>
          </button>
        </form>
      </div>
      <footer className={styles.footer}>
        <p>© Tours Connect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
