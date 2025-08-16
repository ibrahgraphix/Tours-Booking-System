import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./bookinglist.module.css";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/bookings");
      setBookings(res.data);
    } catch (err) {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;
    try {
      await axios.delete(`/api/admin/bookings/${id}`);
      setBookings(bookings.filter((b) => b.id !== id));
    } catch (err) {
      alert("Error deleting booking.");
    }
  };

  // Update booking status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/api/admin/bookings/${id}/status`, {
        status: newStatus,
      });
      setBookings(
        bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert("Error updating status.");
    }
  };

  // Export bookings as Excel
  const handleExport = async () => {
    try {
      const res = await axios.get("/api/admin/bookings/export", {
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bookings.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Error exporting bookings.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p className={styles.loading}>Loading bookings...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>All Bookings</h2>
      <div className={styles.actions}>
        <button className={styles.exportBtn} onClick={handleExport}>
          Export to Excel
        </button>
      </div>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tour</th>
              <th>Customer</th>
              <th>Email</th>
              <th>People Accompanied</th>
              <th>Status</th>
              <th>Booked On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className={
                  booking.status === "cancelled" ? styles.cancelled : ""
                }
              >
                <td>{booking.id}</td>
                <td>{booking.tour_name}</td>
                <td>{booking.full_name}</td>
                <td>{booking.email}</td>
                <td>{booking.number_of_people}</td>
                <td>
                  <select
                    value={booking.status}
                    disabled={booking.status === "cancelled"}
                    onChange={(e) =>
                      handleStatusChange(booking.id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="paid">Paid</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(booking.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingList;
