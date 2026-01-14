import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000", // backend merged của bạn
  withCredentials: true,
});
