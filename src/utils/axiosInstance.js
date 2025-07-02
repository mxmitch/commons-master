import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_COMMONS_API || 'https://localhost:5000',
  withCredentials: true, // ✅ needed to send cookies
});

export default axiosInstance;