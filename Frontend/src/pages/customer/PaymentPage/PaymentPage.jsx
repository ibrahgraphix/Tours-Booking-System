import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./paymentpage.module.css";

const PaymentPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [reference, setReference] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("/api/bookings/unpaid");

        // Ensure bookings is always an array
        const data = Array.isArray(response.data) ? response.data : [];
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch unpaid bookings", err);
        setBookings([]); // Fallback to empty array
      }
    };

    fetchBookings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking || !paymentMethod || !reference) return;

    try {
      const res = await axios.post("/api/payments", {
        bookingId: selectedBooking,
        method: paymentMethod,
        reference,
      });

      if (res.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Payment failed", err);
    }
  };

  return (
    <div className={styles.paymentPage}>
      <div className={styles.overlay}>
        <h1>Complete Your Payment</h1>
        {success ? (
          <div className={styles.successMsg}>
            ✅ Payment successful! Thank you.
          </div>
        ) : (
          <form className={styles.paymentForm} onSubmit={handleSubmit}>
            <label>Choose a Booking:</label>
            <select
              value={selectedBooking}
              onChange={(e) => setSelectedBooking(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              {Array.isArray(bookings) && bookings.length > 0 ? (
                bookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.tour} - {b.name}
                  </option>
                ))
              ) : (
                <option disabled>No unpaid bookings</option>
              )}
            </select>

            <label>Payment Method:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              <option value="card">Card</option>
              <option value="mpesa">M-Pesa</option>
              <option value="bank">Bank Transfer</option>
            </select>

            <label>Transaction Reference / Note:</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. MPESA123XYZ"
              required
            />

            <button type="submit">Submit Payment</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
