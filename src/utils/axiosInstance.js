import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_COMMONS_API,
  withCredentials: true, // not required unless using cookies
});

// ✅ Add the Authorization header automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;