import axios from 'axios';
import toast from 'react-hot-toast';
 
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
 
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An error occurred';
 
    if (error.response) {
      message = error.response.data?.message || error.response.statusText;
 
      if (error.response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    } else if (error.request) {
      message = 'No response from server. Please check your connection.';
    } else {
      message = error.message;
    }
 
    toast.error(message);
    return Promise.reject(error);
  }
);
 
export default api;