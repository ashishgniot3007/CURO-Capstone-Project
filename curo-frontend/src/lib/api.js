/**
 * ASSUMPTIONS:
 * 1. Login identifier is treated as an email address (type="email").
 * 2. Backend endpoints are:
 *    - POST /loginUser (returns a boolean)
 *    - POST /addUser (returns user entity object)
 * 3. Both endpoints are configured on the base URL (VITE_API_BASE_URL).
 * 4. Since /loginUser returns a boolean, a client-side mock token is generated on success.
 */

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8082",
});

/**
 * Log in a user with email and password.
 * @param {Object} payload
 * @param {string} payload.email
 * @param {string} payload.password
 * @returns {Promise<Object>} Normalized response { success, token?, message? }
 */
export async function loginUser({ email, password, role }) {
  try {
    const response = await api.post("/loginUser", {
      userId: email,
      password: password,
    });

    // The backend /loginUser returns a Boolean (true/false)
    if (response.data === true) {
      const userRole = role || "Patient";
      return {
        success: true,
        // Since backend doesn't return a JWT/token, generate a mock token for frontend state
        token: `mock-session-token-${btoa(email + ":" + userRole)}`,
        user: { email, role: userRole },
        message: "Login successful",
      };
    } else {
      return {
        success: false,
        message: "Invalid User Id or Password",
      };
    }
  } catch (error) {
    console.error("Login API Error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Invalid User Id or Password",
    };
  }
}

/**
 * Register a new user.
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} payload.email
 * @param {string} payload.password
 * @param {string} payload.role
 * @param {string} [payload.medicalRegistrationNumber]
 * @returns {Promise<Object>} Normalized response { success, message? }
 */
export async function registerUser(payload) {
  try {
    // Backend expects { name, email, password } for the Users entity
    const response = await api.post("/addUser", {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });

    if (response.data && response.data.email) {
      return {
        success: true,
        user: response.data,
        message: "User registered successfully",
      };
    } else {
      return {
        success: false,
        message: "Registration failed, please try again",
      };
    }
  } catch (error) {
    console.error("Registration API Error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "User registration failed",
    };
  }
}

export default api;
