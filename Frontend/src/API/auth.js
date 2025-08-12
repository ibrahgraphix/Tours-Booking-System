import axios from "axios";

const API_BASE = "http://localhost:3000";

// Login authentication
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE}/login`, {
      email,
      password,
    });
    return response.data; // now contains user.role
  } catch (error) {
    if (error.response && error.response.data) {
      throw { response: error.response };
    }
    throw new Error("Login failed. Please try again.");
  }
};

// SignUp authentication
export const signupUser = async (
  firstName,
  lastName,
  email,
  password,
  mobileNumber,
  role // optional param if you want to add from frontend later
) => {
  try {
    const data = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      mobile_number: mobileNumber,
    };
    if (role) {
      data.role = role;
    }
    const response = await axios.post(`${API_BASE}/signup`, data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw {
        message: error.response.data?.error?.Message || "Signup failed.",
        code: error.response.data?.error?.errorCode || "DEFAULT",
      };
    }
    throw { message: "Signup failed. Please try again.", code: "DEFAULT" };
  }
};
