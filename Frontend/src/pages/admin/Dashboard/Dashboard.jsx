// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

  // Summary states
  const [totalTours, setTotalTours] = useState(0);
  const [upcomingTours, setUpcomingTours] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [paymentsReceived, setPaymentsReceived] = useState(0);

  // Chart states
  const [monthlyBookings, setMonthlyBookings] = useState(Array(12).fill(0));
  const [monthlyPayments, setMonthlyPayments] = useState(Array(12).fill(0));

  // Fetch Tours
  const fetchTours = async () => {
    try {
      const res = await axios.get("/api/admin/my-tours");
      const tours = Array.isArray(res.data) ? res.data : [];

      setTotalTours(tours.length);

      const now = new Date();
      const upcoming = tours.filter((t) => t.date && new Date(t.date) > now);
      setUpcomingTours(upcoming.length);
    } catch (err) {
      console.error("Error fetching tours:", err);
    }
  };

  // Fetch Bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/admin/bookings");
      const bookings = Array.isArray(res.data) ? res.data : [];

      setTotalBookings(bookings.length);

      // Aggregate monthly bookings
      const monthCounts = Array(12).fill(0);
      bookings.forEach((b) => {
        const date = new Date(b.created_at);
        if (!isNaN(date)) monthCounts[date.getMonth()] += 1;
      });
      setMonthlyBookings(monthCounts);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  // Fetch Payments
  const fetchPayments = async () => {
    try {
      const res = await axios.get("/api/payments");
      const payments = Array.isArray(res.data) ? res.data : [];

      // Total payments
      const total = payments.reduce((sum, p) => {
        const amount = p.amount ?? p.Amount ?? 0;
        return sum + Number(amount || 0);
      }, 0);
      setPaymentsReceived(total);

      // Aggregate monthly payments
      const monthTotals = Array(12).fill(0);
      payments.forEach((p) => {
        const date = new Date(p.date ?? p.created_at);
        const amount = Number(p.amount ?? p.Amount ?? 0);
        if (!isNaN(date)) monthTotals[date.getMonth()] += amount;
      });
      setMonthlyPayments(monthTotals);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  // Load all data on mount
  useEffect(() => {
    fetchTours();
    fetchBookings();
    fetchPayments();
  }, []);

  // Chart datasets
  const bookingsData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Bookings",
        data: monthlyBookings,
        backgroundColor: "#3498db",
      },
    ],
  };

  const paymentsData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Payments ($)",
        data: monthlyPayments,
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
      legend: { position: "top" },
    },
  };

  return (
    <div className={styles.dashboard}>
      <h1>Admin Dashboard</h1>

      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <h3>Total Tours</h3>
          <p>{totalTours}</p>
        </div>
        <div className={styles.card}>
          <h3>Total Bookings</h3>
          <p>{totalBookings}</p>
        </div>
        <div className={styles.card}>
          <h3>Payments Received</h3>
          <p>${paymentsReceived.toLocaleString()}</p>
        </div>
        <div className={styles.card}>
          <h3>Upcoming Tours</h3>
          <p>{upcomingTours}</p>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartBox}>
          <h2>Monthly Bookings</h2>
          <Bar data={bookingsData} options={options} />
        </div>

        <div className={styles.chartBox}>
          <h2>Monthly Payments</h2>
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
