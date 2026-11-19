import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

// Automatically attach JWT token to every outgoing request if logged in
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;
