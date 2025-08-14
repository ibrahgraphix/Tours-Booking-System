// src/pages/admin/MyTours.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./mytours.module.css";

const MyTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTours = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/my-tours");
      setTours(res.data);
    } catch (err) {
      setError("Failed to load tours.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;
    try {
      await axios.delete(`/api/admin/my-tours/${id}`);
      setTours(tours.filter((t) => t.id !== id));
    } catch (err) {
      alert("Error deleting tour.");
    }
  };

  const handleExport = async () => {
    try {
      const res = await axios.get("/api/admin/my-tours/export", {
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my_tours.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Error exporting tours.");
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  if (loading) return <p className={styles.loading}>Loading tours...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>My Tours</h2>
      <div className={styles.actions}>
        <button className={styles.exportBtn} onClick={handleExport}>
          Export to Excel
        </button>
      </div>
      {tours.length === 0 ? (
        <p>No tours found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Tour Date</th>
              <th>Price</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id}>
                <td>{tour.id}</td>
                <td>{tour.name}</td>
                <td>{tour.description}</td>
                <td>{new Date(tour.date).toLocaleString()}</td>
                <td>${tour.price.toFixed(2)}</td>
                <td>
                  {tour.image_url && (
                    <img
                      src={tour.image_url}
                      alt={tour.name}
                      className={styles.tourImage}
                    />
                  )}
                </td>
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(tour.id)}
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

export default MyTours;
