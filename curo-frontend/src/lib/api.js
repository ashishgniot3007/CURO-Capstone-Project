import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
});

// Request interceptor to inject JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("curo_auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to transform error response structure
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error.response?.data;
    // Map backend {status, message, timestamp} error details to local Error
    const message = errorData?.message || error.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

// USER SERVICE
export async function signup({ name, email, phone, password }) {
  const response = await api.post("/users/signup", { name, email, phone, password });
  return response.data;
}

export async function login({ email, password }) {
  const response = await api.post("/users/login", { email, password });
  return response.data;
}

export async function getUserProfile(userId) {
  const response = await api.get(`/users/${userId}`);
  return response.data;
}

// PROVIDER SERVICE
export async function getProviders({ speciality, lat, lng } = {}) {
  const response = await api.get("/providers", {
    params: { speciality, lat, lng },
  });
  return response.data;
}

export async function getProvider(providerId) {
  const response = await api.get(`/providers/${providerId}`);
  return response.data;
}

// AVAILABILITY SERVICE (Slots)
export async function getSlots(providerId, { from, to } = {}) {
  const response = await api.get(`/providers/${providerId}/slots`, {
    params: { from, to },
  });
  return response.data;
}

export async function getSlot(providerId, slotId) {
  const response = await api.get(`/providers/${providerId}/slots/${slotId}`);
  return response.data;
}

// BOOKING SERVICE
export async function createBooking({ slotId, idempotencyKey }) {
  const response = await api.post("/bookings", { slotId, idempotencyKey });
  return response.data;
}

export async function getBooking(bookingId) {
  const response = await api.get(`/bookings/${bookingId}`);
  return response.data;
}

export async function listBookings() {
  const response = await api.get("/bookings");
  return response.data;
}

export async function cancelBooking(bookingId) {
  const response = await api.put(`/bookings/${bookingId}/cancel`);
  return response.data;
}

// PAYMENT SERVICE
export async function getPaymentStatus(bookingId) {
  const response = await api.get(`/payments/status/${bookingId}`);
  return response.data;
}

export async function mockPaymentSuccess(bookingId) {
  const response = await api.post(`/payments/mock-success/${bookingId}`);
  return response.data;
}

export async function mockPaymentFail(bookingId) {
  const response = await api.post(`/payments/mock-fail/${bookingId}`);
  return response.data;
}

export default api;
