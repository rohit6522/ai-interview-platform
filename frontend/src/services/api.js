import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Attach JWT token automatically to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- AUTH ----------
export const signupUser = (data) => api.post("/auth/signup", data);
export const loginUser = (data) => api.post("/auth/login", data);

// ---------- INTERVIEW ----------
export const generateQuestions = (data) => api.post("/interview/generate-questions", data);
export const evaluateAnswer = (data) => api.post("/interview/evaluate-answer", data);

// ---------- SESSIONS ----------
export const saveSession = (data) => api.post("/sessions", data);
export const getUserSessions = () => api.get("/sessions");
export const getSessionDetail = (sessionId) => api.get(`/sessions/${sessionId}`);

export default api;