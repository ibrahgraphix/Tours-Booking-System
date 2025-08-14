import React, { useState, useEffect } from "react";
import styles from "./BookingForm.module.css";
import axios from "axios";
import backgroundImage from "../../../assets/booking-bg.jpg";

const BookingForm = ({ onBookingSuccess }) => {
  // Get selected tour from localStorage
  const selectedTour = JSON.parse(localStorage.getItem("selectedTour") || "{}");

  const [formData, setFormData] = useState({
    tour_id: selectedTour.id || 0,
    full_name: "",
    email: "",
    number_of_people: 1,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loggedUser = {
      full_name: "",
      email: "",
    };
    setFormData((prev) => ({
      ...prev,
      full_name: loggedUser.full_name,
      email: loggedUser.email,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "number_of_people" || name === "tour_id"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/bookings", formData);
      setSuccessMessage("🎉 Booking confirmed! We'll contact you soon.");
      setErrorMessage("");

      // Reset form
      setFormData({
        tour_id: selectedTour.id || 0,
        full_name: "",
        email: "",
        number_of_people: 1,
      });

      // Notify parent to refresh bookings
      if (onBookingSuccess) onBookingSuccess();
    } catch (error) {
      setErrorMessage("Failed to book. Please try again.");
      setSuccessMessage("");
      console.error(error);
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
              <input type="text" value={selectedTour.name || ""} readOnly />
            </label>

            <input type="hidden" name="tour_id" value={formData.tour_id} />

            <label>
              Full Name:
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
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
                name="number_of_people"
                value={formData.number_of_people}
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
