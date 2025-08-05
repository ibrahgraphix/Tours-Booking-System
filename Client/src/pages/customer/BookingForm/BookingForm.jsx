import React, { useState, useEffect } from "react";
import styles from "./BookingForm.module.css";
import axios from "axios";
import backgroundImage from "../../../assets/booking-bg.jpg";

const BookingForm = ({ selectedTour }) => {
  const [formData, setFormData] = useState({
    tour: selectedTour || "",
    name: "",
    email: "",
    people: 1,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loggedUser = {
      name: "Ibrahim Shelukindo",
      email: "ibrahim@example.com",
    };
    setFormData((prev) => ({
      ...prev,
      name: loggedUser.name,
      email: loggedUser.email,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/bookings", formData);
      setSuccessMessage("🎉 Booking confirmed! We'll contact you soon.");
      setErrorMessage("");
      setFormData({ tour: "", name: "", email: "", people: 1 });
    } catch (error) {
      setErrorMessage("❌ Failed to book. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div
      className={styles.background}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.overlay}>
        <div className={styles.container}>
          <h2>Book Your Tour</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label>
              Tour:
              <input
                type="text"
                name="tour"
                value={formData.tour}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Full Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Number of People:
              <input
                type="number"
                name="people"
                value={formData.people}
                onChange={handleChange}
                min="1"
                required
              />
            </label>

            <button type="submit" className={styles.submitBtn}>
              Confirm Booking
            </button>
          </form>

          {successMessage && <p className={styles.success}>{successMessage}</p>}
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
