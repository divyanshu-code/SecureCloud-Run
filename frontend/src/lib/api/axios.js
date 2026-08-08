import axios from 'axios';
import useAuthStore from '../../store/useAuthStore';

/**
 * Clean Architecture API Layer
 * 
 * Configures a centralized, production-ready Axios instance.
 * Automatically injects headers, intercepts errors, and provides a unified interface.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15-second timeout to prevent hung requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Request Interceptor
 * 
 * Currently acts as a placeholder for JWT Authentication.
 * Once Auth is implemented, it will automatically pull the token from storage
 * and inject it into the Authorization header of every outgoing request.
 */
api.interceptors.request.use(
  (config) => {
    // Dynamically pull the JWT token from the Zustand store
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * Automates error handling across the entire application.
 * Unifies API errors so components don't have to repeatedly check for status codes.
 */
api.interceptors.response.use(
  (response) => {
    // We only care about the data payload in our clean architecture
    return response.data;
  },
  (error) => {
    let errorMessage = 'An unexpected error occurred.';
    
    if (error.response) {
      // The backend returned an explicit error response
      const responseData = error.response.data;
      
      if (responseData?.message === 'Validation Error' && Array.isArray(responseData?.data)) {
        // Extract Zod validation messages nicely
        errorMessage = responseData.data.map(err => err.message).join(', ');
      } else if (typeof responseData?.message === 'string') {
        errorMessage = responseData.message;
      } else if (typeof responseData?.message === 'object') {
        // Fallback if backend accidentally sent an object as the message
        errorMessage = JSON.stringify(responseData.message);
      } else {
        errorMessage = `Server Error: ${error.response.status}`;
      }
      
      // Handle 401 Unauthorized here (e.g. token expired after 15 days)
      if (error.response.status === 401) {
        useAuthStore.getState().logout();
      }
    } else if (error.request) {
      // The request was made but no response was received (e.g. timeout or network down)
      errorMessage = 'Network Error: Unable to reach the server. Please check your connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }
    
    // Log for debugging (except 401s which are handled gracefully)
    if (error.response?.status !== 401) {
      console.error('[API Interceptor Error]:', errorMessage);
    }
    
    // Reject with a standardized error structure
    return Promise.reject(new Error(errorMessage));
  }
);
