import React, { useEffect, useState } from "react";
import styles from "./MyBookings.module.css";
import axios from "axios";
import backgroundImage from "../../../assets/booking-bg.jpg";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const email = user?.email || "";

  const fetchBookings = async () => {
    if (!email) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/bookings/${email}`
      );

      let dataArray = [];
      if (Array.isArray(res.data)) {
        dataArray = res.data;
      } else if (res.data.booking) {
        dataArray = [res.data.booking];
      }

      const bookingsWithTourInfo = dataArray.map((bk) => ({
        ...bk,
        tour_name: bk.tour?.name || bk.tour_name || "Unknown Tour",
        tour_date: bk.tour?.date || bk.date || bk.created_at,
      }));

      setBookings(bookingsWithTourInfo);
      setErrorMessage("");
      localStorage.removeItem("refreshBookings");
    } catch (err) {
      console.error(err);
      setErrorMessage("");
      setBookings([]);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    try {
      await axios.patch(`http://localhost:3000/api/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking.");
    }
  };

  useEffect(() => {
    fetchBookings();

    const handleStorageChange = () => {
      if (localStorage.getItem("refreshBookings") === "true") {
        fetchBookings();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [email]);

  return (
    <div
      className={styles.background}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.overlay}>
        <div className={styles.container}>
          <h2>My Bookings</h2>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          {bookings.length === 0 ? (
            <p className={styles.empty}>You have no bookings yet.</p>
          ) : (
            <table className={styles.bookingTable}>
              <thead>
                <tr>
                  <th>Tour Name</th>
                  <th>Tour Date</th>
                  <th>Number of People</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((bk) => (
                  <tr key={bk.id}>
                    <td>{bk.tour_name}</td>
                    <td>
                      {bk.tour_date
                        ? new Date(bk.tour_date).toLocaleDateString() +
                          " " +
                          new Date(bk.tour_date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </td>
                    <td>{bk.number_of_people}</td>
                    <td
                      className={
                        bk.status === "paid"
                          ? styles.paid
                          : bk.status === "cancelled"
                          ? styles.cancelled
                          : styles.unpaid
                      }
                    >
                      {bk.status}
                    </td>
                    <td>
                      {bk.status !== "cancelled" && (
                        <button
                          className={styles.cancelButton}
                          onClick={() => cancelBooking(bk.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
