import React, { useEffect, useMemo, useState } from "react";
import styles from "./adminUsers.module.css";
import {
  getAllUsers,
  updateUserRole,
  deleteUserById,
  getCompanies,
} from "../../../API/adminUsers.api.js";

const AdminUsers = ({ currentUser: currentUserProp }) => {
  const stored = localStorage.getItem("user");
  const currentUser = currentUserProp || (stored ? JSON.parse(stored) : null);

  console.log("AdminUsers mounted — currentUser:", currentUser);

  const superAdminEmail = currentUser?.email;
  const isSuperAdmin = currentUser?.is_superadmin;

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const companiesById = useMemo(() => {
    const map = {};
    companies.forEach((c) => (map[c.id] = c.name));
    return map;
  }, [companies]);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log(
        "fetchData: calling APIs with header X-User-Email =",
        superAdminEmail
      );
      const [us, cs] = await Promise.all([
        getAllUsers(superAdminEmail),
        getCompanies(),
      ]);
      console.log("fetchData: users response:", us);
      console.log("fetchData: companies response:", cs);
      setUsers(Array.isArray(us) ? us : []);
      setCompanies(Array.isArray(cs) ? cs : []);
    } catch (err) {
      console.error("fetchData error:", err);
      // Show server-provided message if available
      const serverMessage =
        err?.response?.data?.error?.message ||
        err?.response?.data?.error?.Message;
      const status = err?.response?.status;
      if (status === 403) {
        alert("Forbidden: your account is not a super admin.");
      } else if (serverMessage) {
        alert("Server: " + serverMessage);
      } else {
        alert("Failed to load users/companies — check console/network tab");
      }
      setUsers([]);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isSuperAdmin) {
      console.log("current user is not superadmin — will not fetch data.");
      setLoading(false);
      return;
    }
    if (superAdminEmail) fetchData();
  }, [isSuperAdmin, superAdminEmail]);

  if (!isSuperAdmin) {
    return (
      <div className={styles.notice}>
        You do not have permission to view this page.
      </div>
    );
  }

  const onMakeAdmin = async (u) => {
    const companyId = Number(
      prompt("Enter company ID to assign:", u.company_id || "")
    );
    if (!companyId) return;
    try {
      await updateUserRole(superAdminEmail, u.id, "admin", companyId);
      await fetchData();
    } catch (e) {
      console.error("MakeAdmin error:", e);
      const msg =
        e?.response?.data?.error?.message ||
        e?.response?.data?.error?.Message ||
        "Failed to update role";
      alert(msg);
    }
  };

  const onMakeCustomer = async (u) => {
    const companyId = Number(
      prompt("Enter company ID to keep/assign:", u.company_id || "")
    );
    if (!companyId) return;
    try {
      await updateUserRole(superAdminEmail, u.id, "customer", companyId);
      await fetchData();
    } catch (e) {
      console.error("MakeCustomer error:", e);
      const msg =
        e?.response?.data?.error?.message ||
        e?.response?.data?.error?.Message ||
        "Failed to update role";
      alert(msg);
    }
  };

  const onDelete = async (u) => {
    if (!window.confirm(`Delete ${u.email}? This cannot be undone.`)) return;
    try {
      await deleteUserById(superAdminEmail, u.id);
      await fetchData();
    } catch (e) {
      console.error("Delete error:", e);
      const msg = e?.response?.data?.error?.message || "Failed to delete user";
      alert(msg);
    }
  };

  const filtered = users.filter(
    (u) =>
      !filter ||
      u.email.toLowerCase().includes(filter.toLowerCase()) ||
      u.first_name?.toLowerCase().includes(filter.toLowerCase()) ||
      u.last_name?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>Users</h2>
        <div className={styles.controls}>
          <input
            className={styles.search}
            placeholder="Search by name or email..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button className={styles.refresh} onClick={fetchData}>
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email / Mobile</th>
                <th>Company (ID & Name)</th>
                <th>Role</th>
                <th>Super</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>
                    {u.first_name} {u.last_name}
                  </td>
                  <td>
                    <div>{u.email}</div>
                    <div className={styles.muted}>{u.mobile_number}</div>
                  </td>
                  <td>
                    {u.company_id
                      ? `#${u.company_id} - ${
                          companiesById[u.company_id] || "Unknown"
                        }`
                      : "-"}
                  </td>
                  <td
                    className={
                      u.role === "admin"
                        ? styles.roleAdmin
                        : styles.roleCustomer
                    }
                  >
                    {u.role}
                  </td>
                  <td>{u.is_superadmin ? "✓" : "-"}</td>
                  <td className={styles.actions}>
                    <button
                      onClick={() => onMakeAdmin(u)}
                      className={styles.btnPrimary}
                    >
                      Make Admin
                    </button>
                    <button
                      onClick={() => onMakeCustomer(u)}
                      className={styles.btn}
                    >
                      Make Customer
                    </button>
                    <button
                      onClick={() => onDelete(u)}
                      className={styles.btnDanger}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan="7" className={styles.empty}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
