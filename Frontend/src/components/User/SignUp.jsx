import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { signupUser } from "../../API/auth";
import { SIGNUP_ERROR_MESSAGES } from "../../constants/messeges";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await signupUser(
        firstName,
        lastName,
        email,
        password,
        mobileNumber,
        companyName
      );

      console.log("Signup successful:", userData);
      alert("You are successfully registered. You can login.");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg =
        SIGNUP_ERROR_MESSAGES[error.code] ||
        error.message ||
        SIGNUP_ERROR_MESSAGES.DEFAULT;
      alert(errorMsg);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Sign Up</h1>
      </header>
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
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
              placeholder="Create a password"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Mobile Number</label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter your mobile number"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.loginBtn}>
            Sign Up
          </button>
          <button
            type="button"
            className={styles.googleBtn}
            onClick={() => navigate("/login")}
          >
            <span>Go to Login</span>
          </button>
        </form>
      </div>
      <footer className={styles.footer}>
        <p>© Numerology. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SignUp;
