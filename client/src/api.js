import axios from "axios";

console.log("baseurl", process.env.REACT_APP_API_BASE_URL);

var api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

api.interceptors.request.use(
  config => {
    if (!config.headers.Authorization) {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  error => Promise.reject(error)
);

export default api;
