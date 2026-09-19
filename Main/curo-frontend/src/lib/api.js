import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


// Request interceptor — automatically attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("curo_auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — convert backend errors to normal Error objects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error.response?.data;

    const message =
      errorData?.message ||
      error.message ||
      "An error occurred";

    return Promise.reject(new Error(message));
  }
);

// ==================== USER SERVICE ====================

export async function signup({ name, email, phone, password }) {
  const response = await api.post("/users/signup", {
    name,
    email,
    phone,
    password,
  });

  return response.data;
}

export async function login({ email, password }) {
  const response = await api.post("/users/login", {
    email,
    password,
  });

  return response.data;
}

export async function getUserProfile(userId) {
  const response = await api.get(`/users/${userId}`);

  return response.data;
}

// ==================== PROVIDER AUTH ====================

export async function providerSignup(data) {
  const response = await api.post("/providers/auth/signup", data);

  return response.data;
}

export async function providerLogin({ email, password }) {
  const response = await api.post("/providers/auth/login", {
    email,
    password,
  });

  return response.data;
}

// ==================== PROVIDER SELF SERVICE ====================

export async function getMyProviderProfile() {
  const response = await api.get("/providers/me/profile");

  return response.data;
}

export async function updateMyProviderProfile(data) {
  const response = await api.put("/providers/me/profile", data);

  return response.data;
}

export async function getMyProviderStats() {
  const response = await api.get("/providers/me/stats");

  return response.data;
}

export async function toggleMyProviderActive() {
  const response = await api.post("/providers/me/toggle-active");

  return response.data;
}

export async function addSlot(
  providerId,
  { startTime, endTime }
) {
  const response = await api.post(
    `/providers/${providerId}/slots`,
    {
      startTime,
      endTime,
    }
  );

  return response.data;
}

// ==================== PROVIDER SERVICE ====================

export async function getProviders({ speciality } = {}) {
  const params = {};

  if (speciality) {
    params.speciality = speciality;
  }

  const response = await api.get("/providers", {
    params,
  });

  return response.data;
}

export async function getProvider(providerId) {
  const response = await api.get(`/providers/${providerId}`);

  return response.data;
}

// ==================== AVAILABILITY / SLOTS ====================

export async function getSlots(
  providerId,
  { from, to } = {}
) {
  const params = {};

  if (from) params.from = from;
  if (to) params.to = to;

  const response = await api.get(
    `/providers/${providerId}/slots`,
    { params }
  );

  return response.data;
}

export async function getSlot(providerId, slotId) {
  const response = await api.get(
    `/providers/${providerId}/slots/${slotId}`
  );

  return response.data;
}

// ==================== BOOKING SERVICE ====================

export async function createBooking({
  slotId,
  idempotencyKey,
}) {
  const response = await api.post("/bookings", {
    slotId,
    idempotencyKey,
  });

  return response.data;
}

export async function getBooking(bookingId) {
  const response = await api.get(`/bookings/${bookingId}`);

  return response.data;
}

export async function listBookings(params = {}) {
  const response = await api.get("/bookings", {
    params,
  });

  return response.data;
}

export async function cancelBooking(bookingId) {
  const response = await api.put(
    `/bookings/${bookingId}/cancel`
  );

  return response.data;
}

// ==================== PAYMENT SERVICE ====================

export async function getPaymentStatus(bookingId) {
  const response = await api.get(
    `/payments/status/${bookingId}`
  );

  return response.data;
}

export async function mockPaymentSuccess(bookingId) {
  const response = await api.post(
    `/payments/mock-success/${bookingId}`
  );

  return response.data;
}

export async function mockPaymentFail(bookingId) {
  const response = await api.post(
    `/payments/mock-fail/${bookingId}`
  );

  return response.data;
}

export default api;