import { api } from '../lib/api/axios';

/**
 * Authentication Service
 * 
 * Provides clean asynchronous methods to interact with the backend auth endpoints.
 */
export const authService = {
  /**
   * Register a new user
   * @param {string} username 
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} Contains message and token
   */
  async register(username, email, password) {
    return await api.post('/api/v1/auth/register', { name: username, email, password });
  },

  /**
   * Login an existing user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} Contains message and token
   */
  async login(email, password) {
    return await api.post('/api/v1/auth/login', { email, password });
  },

  /**
   * Fetch the current authenticated user's profile
   * @returns {Promise<Object>} Contains user data (e.g. email, username, stats)
   */
  async getProfile() {
    return await api.get('/api/v1/auth/profile');
  }
};
