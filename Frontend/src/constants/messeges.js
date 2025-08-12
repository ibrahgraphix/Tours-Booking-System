const LOGIN_ERROR_MESSAGES = {
  100: "Email not found. Please check and try again.",
  101: "Incorrect password. Please try again.",
  102: "Internal Server Failure",
  104: "Service Unavailable",

  DEFAULT: "Login failed. Please try again.",
};

const SIGNUP_ERROR_MESSAGES = {
  104: "Service Unavailable",
  EMAIL_EXISTS: "Email is already registered.",
  DEFAULT: "Signup failed. Please try again.",
};

export { LOGIN_ERROR_MESSAGES, SIGNUP_ERROR_MESSAGES };
