import axios from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7058";

// Set up axios interceptors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || "An error occurred";
    return Promise.reject(new Error(errorMessage));
  },
);

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Export the configured axios instance
export default axios;
