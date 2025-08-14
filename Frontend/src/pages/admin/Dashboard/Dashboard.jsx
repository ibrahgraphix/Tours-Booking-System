// src/pages/admin/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const navigate = useNavigate();

  const bookingsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Bookings",
        data: [12, 19, 10, 15, 22],
        backgroundColor: "#3498db",
      },
    ],
  };

  const paymentsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Payments ($)",
        data: [1200, 1500, 1100, 1800, 2100],
        borderColor: "#2ecc71",
        backgroundColor: "rgba(46, 204, 113, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className={styles.dashboard}>
      <h1>Admin Dashboard</h1>

      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <h3>Total Tours</h3>
          <p>42</p>
        </div>
        <div className={styles.card}>
          <h3>Total Bookings</h3>
          <p>182</p>
        </div>
        <div className={styles.card}>
          <h3>Payments Received</h3>
          <p>$12,450</p>
        </div>
        <div className={styles.card}>
          <h3>Upcoming Tours</h3>
          <p>8</p>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartBox}>
          <h2>Monthly Bookings</h2>
          <Bar data={bookingsData} options={options} />
        </div>

        <div className={styles.chartBox}>
          <h2>Payments Received</h2>
          <Line data={paymentsData} options={options} />
        </div>
      </div>

      <div className={styles.quickLinks}>
        <button onClick={() => navigate("/admin/add-tour")}>
          Add New Tour
        </button>
        <button onClick={() => navigate("/admin/booking-list")}>
          View Bookings
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
