/**
 * API Configuration
 * 
 * Centralized API configuration. Never hardcodes URLs.
 * Uses environment variables to seamlessly switch between Development and Production environments.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiConfig = {
  baseUrl: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Example generic fetch wrapper
 * @param {string} endpoint - The endpoint (e.g., '/api/jobs')
 * @param {Object} options - Fetch options
 */
export const fetchApi = async (endpoint, options = {}) => {
  const url = `${apiConfig.baseUrl}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }
  
  return response.json();
};
