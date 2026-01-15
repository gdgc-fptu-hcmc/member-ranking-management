import axios from "axios";

export const api = axios.create({
  baseURL: "/", // use relative path
  withCredentials: true,
});
