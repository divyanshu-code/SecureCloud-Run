import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/auth.service';

/**
 * Global Authentication Store
 * 
 * Manages the user's authentication state globally.
 * Uses the `persist` middleware to automatically and securely synchronize 
 * the JWT token with `localStorage` without any direct DOM manipulation.
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Authenticate a user and store their JWT token.
       * @param {string} email 
       * @param {string} password 
       */
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(email, password);
          const payload = response.data || response;
          set({
            token: payload.token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Immediately fetch the profile to populate user details
          await get().fetchProfile();
          
          return { success: true };
        } catch (error) {
          set({ 
            error: error.message || 'Login failed',
            isLoading: false,
            isAuthenticated: false
          });
          return { success: false, error: error.message };
        }
      },

      /**
       * Register a new user and log them in.
       * @param {string} username 
       * @param {string} email 
       * @param {string} password 
       */
      register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(username, email, password);
          const payload = response.data || response;
          set({
            token: payload.token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          await get().fetchProfile();
          
          return { success: true };
        } catch (error) {
          set({ 
            error: error.message || 'Registration failed',
            isLoading: false,
            isAuthenticated: false
          });
          return { success: false, error: error.message };
        }
      },

      /**
       * Fetch the authenticated user's profile data.
       */
      fetchProfile: async () => {
        if (!get().token) return;
        
        try {
          const response = await authService.getProfile();
          const profileData = response.data || response;
          // Assuming the backend returns the user object inside the payload
          set({ user: profileData.user || profileData });
        } catch (error) {
          console.error("Failed to fetch profile:", error.message);
          // If profile fetch fails (e.g. token expired), force a logout
          if (error.message.includes('Unauthorized') || error.message.includes('401')) {
             get().logout();
          }
        }
      },

      /**
       * Log the user out and purge all authentication state.
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
        
        // Disconnect sockets or clean up other services if needed
        // import { disconnectSocket } from '../config/socket';
        // disconnectSocket();
      },
      
      /**
       * Clear any active authentication errors from the UI
       */
      clearError: () => set({ error: null }),
      
      /**
       * Manually inject a token (used for OAuth callbacks)
       */
      setToken: async (token) => {
        set({ token, isAuthenticated: true });
        await get().fetchProfile();
      }
    }),
    {
      name: 'securecloud-auth', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated }), // Only persist token & auth state
    }
  )
);

export default useAuthStore;
