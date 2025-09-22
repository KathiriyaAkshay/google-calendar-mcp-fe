import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or other storage
    const token = localStorage.getItem('auth_token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    const { response } = error;
    
    if (response) {
      // Server responded with a status code outside of 2xx
      switch (response.status) {
        case 401:
          // Unauthorized - token expired or invalid
          localStorage.removeItem('auth_token');
          // Redirect to login or refresh token
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Permission denied');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          // Other errors
          console.error('API Error:', response.data);
      }
      
      return Promise.reject(response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error: No response received from server');
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
      });
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
      return Promise.reject({
        message: error.message,
      });
    }
  }
);

export default apiClient;
