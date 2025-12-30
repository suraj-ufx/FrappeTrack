import axios from "axios";

const API_BASE = "http://192.168.0.138";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// axiosInstance.interceptors.request.use((config) => {
//   const sid = window.auth.getSid();
//   if (sid) {
//     config.headers.Cookie = `sid=${sid}`;
//   }
//   return config;
// });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response || error);
    return Promise.reject(error);
  }
);

export default axiosInstance;