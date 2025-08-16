import axios from "axios";

const API_BASE = "http://localhost:3000";

export const getCompanies = async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/companies`);
    return res.data?.companies || [];
  } catch (error) {
    console.error("getCompanies error:", error.response ?? error.message);
    throw error;
  }
};

export const getAllUsers = async (superAdminEmail) => {
  try {
    const headers = { "X-User-Email": superAdminEmail };
    const res = await axios.get(`${API_BASE}/api/superadmin/users`, {
      headers,
    });
    return res.data?.users || [];
  } catch (error) {
    console.error("getAllUsers error:", error.response ?? error.message);
    throw error;
  }
};

export const updateUserRole = async (
  superAdminEmail,
  userId,
  role,
  companyId
) => {
  try {
    const headers = { "X-User-Email": superAdminEmail };
    const res = await axios.put(
      `${API_BASE}/api/superadmin/users/${userId}/role`,
      { role, company_id: companyId },
      { headers }
    );
    return res.data;
  } catch (error) {
    console.error("updateUserRole error:", error.response ?? error.message);
    throw error;
  }
};

export const deleteUserById = async (superAdminEmail, userId) => {
  try {
    const headers = { "X-User-Email": superAdminEmail };
    const res = await axios.delete(
      `${API_BASE}/api/superadmin/users/${userId}`,
      {
        headers,
      }
    );
    return res.data;
  } catch (error) {
    console.error("deleteUserById error:", error.response ?? error.message);
    throw error;
  }
};
