import axios from "axios";

const BASE_URL = "http://localhost:5000/api/events";

export const getEvents = () => axios.get(BASE_URL);

export const createEvent = (formData) =>
  axios.post(BASE_URL, formData, { headers: { "Content-Type": "multipart/form-data" } });

export const updateEventStatus = (id, status) =>
  axios.patch(`${BASE_URL}/${id}/status`, { status });
