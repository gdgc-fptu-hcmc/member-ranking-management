import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000", // use relative path
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
