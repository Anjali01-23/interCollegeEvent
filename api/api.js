import axios from "axios";

// ============================
// 🔧 Global Axios Setup
// ============================

// Base API URL
const BASE_API_URL = "http://localhost:5000/api";

// Global interceptor — adds token to every request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // token saved after login
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If using cookie-based auth, uncomment:
    // config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional axios instance (if you want to use this directly elsewhere)
export const api = axios.create({
  baseURL: BASE_API_URL,
});

// Also attach the interceptor to instance
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================
// 📅 EVENT APIs
// ============================

const BASE_EVENT_URL = `${BASE_API_URL}/events`;

export const getEvents = () => axios.get(BASE_EVENT_URL);

export const createEvent = (formData) =>
  axios.post(BASE_EVENT_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateEventStatus = (id, status) =>
  axios.patch(`${BASE_EVENT_URL}/${id}/status`, { status });

export const deleteEvent = (id) => axios.delete(`${BASE_EVENT_URL}/${id}`);

export const updateEvent = async (id, data) => {
  return await axios.put(`${BASE_EVENT_URL}/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ============================
// 🧾 REGISTRATION APIs
// ============================

const BASE_REG_URL = `${BASE_API_URL}/registrations`;

// Submit new registration (student)
export const createRegistration = (data) =>
  axios.post(BASE_REG_URL, { ...data, status: "pending" });

// Get all registrations (admin)
export const getRegistrations = () => axios.get(BASE_REG_URL);

// Approve or Reject registration
export const handleRegistration = (id, status) => {
  if (!["accepted", "rejected"].includes(status)) {
    throw new Error("Invalid status. Use 'accepted' or 'rejected'.");
  }
  return axios.put(`${BASE_REG_URL}/${id}`, { status });
};

// Get accepted participants
export const getAcceptedParticipants = () =>
  axios.get(`${BASE_REG_URL}/accepted-participants`);

// Get registrations from a specific student
export const getStudentRegistrations = (studentId) =>
  axios.get(`${BASE_REG_URL}/student/${studentId}`);

// Delete registration
export const cancelRegistration = (id) => {
  if (!id && id !== 0) {
    return Promise.reject(new Error("cancelRegistration: id is required"));
  }
  return axios.delete(`${BASE_REG_URL}/${id}`);
};

// ============================
// 💬 FEEDBACK APIs
// ============================

const BASE_FEEDBACK_URL = `${BASE_API_URL}/feedback`;

// Submit feedback (student)
export const createFeedback = (data) => axios.post(BASE_FEEDBACK_URL, data);

// Get all feedback (admin)
export const getAllFeedback = () => axios.get(BASE_FEEDBACK_URL);

// Get feedback stats (admin)
export const getFeedbackStats = () =>
  axios.get(`${BASE_FEEDBACK_URL}/stats`);

// Delete feedback (admin)
export const deleteFeedback = (id) =>
  axios.delete(`${BASE_FEEDBACK_URL}/${id}`);

// Get feedback per student
export const getStudentFeedbacks = (studentId) =>
  axios.get(`${BASE_FEEDBACK_URL}/student/${studentId}`);

// ============================
// 👨‍💼 ADMIN REQUEST APIs
// ============================

const BASE_ADMIN_URL = `${BASE_API_URL}/admin-requests`;

export const createAdminRequest = (data) => axios.post(BASE_ADMIN_URL, data);

export const getAdminRequests = () => axios.get(BASE_ADMIN_URL);

export const approveAdminRequest = (id) =>
  axios.put(`${BASE_ADMIN_URL}/${id}/approve`);

export const rejectAdminRequest = (id) =>
  axios.delete(`${BASE_ADMIN_URL}/${id}/reject`);

export const getAllAdminRequests =()=>axios.get(`${BASE_ADMIN_URL}/all`);
