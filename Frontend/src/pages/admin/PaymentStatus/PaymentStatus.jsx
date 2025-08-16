// PaymentStatus.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import styles from "./paymentstatus.module.css";

const PaymentStatus = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // helper to safely read possible booking id fields from a payment object
  const getBookingIdFrom = (p) => {
    return (
      p.booking_id ??
      p.bookingId ??
      p.BookingID ??
      p.BookingId ??
      p.bookingID ??
      p.booking ??
      p.Booking ??
      0
    );
  };

  // helper to normalize common fields we need for UI (keeps it minimal)
  const normalize = (p) => {
    const booking_id = getBookingIdFrom(p) || 0;
    const ID = p.id ?? p.ID ?? p.payment_id ?? 0;
    const customer_name =
      p.customer_name ?? p.customerName ?? p.CustomerName ?? "";
    const tour_name = p.tour_name ?? p.tourName ?? p.TourName ?? "";
    const amountVal = p.amount ?? p.Amount ?? 0;
    const amount = amountVal === 0 ? 0 : amountVal;
    const method = p.method ?? p.Method ?? "";
    const status = p.status ?? p.Status ?? (ID && ID > 0 ? "paid" : "unpaid");
    const verified = p.verified ?? p.Verified ?? false;
    const date =
      p.date ?? p.created_at ?? p.createdAt ?? new Date().toISOString();

    return {
      ID,
      booking_id,
      customer_name,
      tour_name,
      amount,
      method,
      status,
      verified,
      date,
    };
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/payments");
      const arr = Array.isArray(res.data) ? res.data : [];
      setPayments(arr.map((p) => normalize(p)));
      setError("");
    } catch (err) {
      console.error("fetchPayments error:", err);
      setError("Failed to load payments.");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // Save: create or update depending on whether ID exists
  const handleSave = async (row) => {
    try {
      // Compute booking_id defensively (row may contain different key shapes)
      const booking_id =
        row.booking_id ??
        row.bookingId ??
        row.BookingID ??
        row.BookingId ??
        row.booking ??
        0;

      if (!booking_id || booking_id <= 0) {
        alert("Invalid booking id. Can't save payment.");
        return;
      }

      // Clean amount & method
      const cleanedAmount =
        row.amount === "" || row.amount === null ? 0 : Number(row.amount) || 0;
      const cleanedMethod = (row.method || "").trim();

      if (row.ID && row.ID > 0) {
        // Update existing payment
        const payload = {
          amount: cleanedAmount,
          method: cleanedMethod,
        };

        await axios.put(`/api/payments/${row.ID}/update`, payload);
        await fetchPayments();
        alert("Payment updated successfully");
      } else {
        // Create new payment
        const payload = {
          booking_id: booking_id,
          amount: cleanedAmount,
          method: cleanedMethod,
        };

        await axios.post("/api/payments", payload);
        await fetchPayments();
        alert("Payment saved successfully");
      }
    } catch (err) {
      console.error("handleSave error:", err, err?.response?.data);
      const msg = err?.response?.data?.message ?? "Failed to save payment.";
      alert(msg);
    }
  };

  /**
   * DELETE handler
   * - If id > 0 -> call backend DELETE and re-sync
   * - If id <= 0 -> remove row locally (no DB call)
   *
   * Parameters:
   *   id: payment id (0 means no payment in DB)
   *   booking_id: booking identifier used to remove the correct row locally
   */
  const handleDelete = async (id, booking_id) => {
    if (!window.confirm("Delete this payment row?")) return;

    // If there's no payment id (not saved in DB) -> delete locally only
    if (!id || id <= 0) {
      setPayments((prev) => prev.filter((p) => p.booking_id !== booking_id));
      alert("Row removed (local only).");
      return;
    }

    // For DB-backed payments: optimistic UI + API call + re-sync
    const before = payments;
    try {
      // optimistic: mark the row as unpaid locally while API call proceeds
      setPayments((prev) =>
        prev.map((p) =>
          p.ID === id
            ? {
                ...p,
                ID: 0,
                amount: "",
                method: "",
                status: "unpaid",
                verified: false,
              }
            : p
        )
      );

      const res = await axios.delete(`/api/payments/${id}`);
      await fetchPayments();
      alert(res?.data?.message ?? "Payment deleted");
    } catch (err) {
      console.error("delete error:", err, err?.response?.data);
      // revert to authoritative state
      try {
        await fetchPayments();
      } catch (e) {
        setPayments(before);
      }

      const serverMsg = err?.response?.data?.message;
      if (err?.response?.status === 404) {
        alert(serverMsg ?? "Payment not found.");
      } else {
        alert(serverMsg ?? "Failed to delete payment.");
      }
    }
  };

  const handleVerify = async (id) => {
    if (!id || id <= 0) {
      alert("No payment to verify.");
      return;
    }
    if (!window.confirm("Mark this payment as verified?")) return;
    try {
      await axios.put(`/api/payments/${id}/verify`);
      await fetchPayments();
      alert("Payment verified");
    } catch (err) {
      console.error("verify error:", err);
      alert("Failed to verify payment.");
    }
  };

  const handleExport = () => {
    const exportData = payments.map((p) => ({
      "Booking ID": p.booking_id,
      "Customer Name": p.customer_name,
      "Tour Name": p.tour_name,
      Amount: p.amount,
      Method: p.method,
      Status: p.status,
      Verified: p.verified ? "Yes" : "No",
      Date: new Date(p.date).toLocaleDateString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "Payments.xlsx");
  };

  const filteredPayments = payments.filter((p) => {
    const statusCheck = statusFilter ? p.status === statusFilter : true;
    const fromCheck = fromDate ? new Date(p.date) >= new Date(fromDate) : true;
    const toCheck = toDate ? new Date(p.date) <= new Date(toDate) : true;
    return statusCheck && fromCheck && toCheck;
  });

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p className={styles.loading}>Loading payments...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Payment Status</h2>

      <div className={styles.filters}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button onClick={fetchPayments}>Refresh</button>
        <button onClick={handleExport}>Excel</button>
      </div>

      {filteredPayments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Tour</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={`${p.booking_id}-${p.ID}`}>
                  <td>{p.booking_id}</td>
                  <td>{p.customer_name}</td>
                  <td>{p.tour_name}</td>
                  <td>
                    <input
                      type="number"
                      value={p.amount === 0 ? "" : p.amount}
                      onChange={(e) =>
                        setPayments((prev) =>
                          prev.map((pay) =>
                            pay.booking_id === p.booking_id
                              ? {
                                  ...pay,
                                  amount:
                                    e.target.value.trim() === ""
                                      ? ""
                                      : parseFloat(e.target.value) || 0,
                                }
                              : pay
                          )
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={p.method ?? ""}
                      onChange={(e) =>
                        setPayments((prev) =>
                          prev.map((pay) =>
                            pay.booking_id === p.booking_id
                              ? { ...pay, method: e.target.value }
                              : pay
                          )
                        )
                      }
                    />
                  </td>
                  <td>{p.status}</td>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td className={styles.actions}>
                    <button
                      className={styles.saveBtn}
                      onClick={() => handleSave(p)}
                    >
                      Save
                    </button>

                    {/* Delete now always clickable: if no ID -> local deletion; if ID -> server deletion */}
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(p.ID, p.booking_id)}
                      title={p.ID && p.ID > 0 ? "" : "Remove row locally"}
                    >
                      Delete
                    </button>

                    <button
                      className={styles.verifyBtn}
                      onClick={() => handleVerify(p.ID)}
                      disabled={!p.ID || p.ID === 0 || p.verified}
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
