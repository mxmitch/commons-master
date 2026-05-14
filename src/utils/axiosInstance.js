import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_COMMONS_API,
  withCredentials: true
});

export default axiosInstance;