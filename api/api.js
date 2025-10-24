import axios from "axios";

const BASE_EVENT_URL = "http://localhost:5000/api/events";

export const getEvents = () => axios.get(BASE_EVENT_URL);

export const createEvent = (formData) =>
  axios.post(BASE_EVENT_URL, formData, { headers: { "Content-Type": "multipart/form-data" } });

export const updateEventStatus = (id, status) =>
  axios.patch(`${BASE_EVENT_URL}/${id}/status`, { status });

export const deleteEvent=(id)=>
  axios.delete(`${BASE_EVENT_URL}/${id}`);

export const updateEvent = async (id, data) => {
  return await axios.put(`${BASE_EVENT_URL}/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ===== Registration APIs =====
const BASE_REG_URL = "http://localhost:5000/api/registrations";

// Submit new registration (student)
export const createRegistration = (data) =>
  axios.post(BASE_REG_URL, { ...data, status: "pending" });

// Get all registrations (admin)
export const getRegistrations = () => axios.get(BASE_REG_URL);

//Approve or Reject
export const handleRegistration = (id, status) => {
  // Optional: Validate the status
  if (!["accepted", "rejected"].includes(status)) {
    throw new Error("Invalid status. Use 'accepted' or 'rejected'.");
  }

  return axios.put(`${BASE_REG_URL}/${id}`,{status});
};

//To get accepted registrations
export const getAcceptedParticipants = () => {
  return axios.get(`${BASE_REG_URL}/accepted-participants`);
};

//To get Registrations from a specified student
export const getStudentRegistrations = (studentId) => {
  return axios.get(`${BASE_REG_URL}/student/${studentId}`);
};

//To delete Registration
export const cancelRegistration = (id) =>
  axios.delete(`${BASE_REG_URL}/${id}`);


// ===== Feedback APIs =====
const BASE_FEEDBACK_URL = "http://localhost:5000/api/feedback";

// Submit feedback (student)
export const createFeedback = (data) =>
  axios.post(BASE_FEEDBACK_URL, data);

// Get all feedbacks (admin)
export const getAllFeedback = () => axios.get(BASE_FEEDBACK_URL);

// Get feedback stats (admin)
export const getFeedbackStats = () => axios.get(`${BASE_FEEDBACK_URL}/stats`);

// Delete feedback (admin)
export const deleteFeedback = (id) =>
  axios.delete(`${BASE_FEEDBACK_URL}/${id}`);
