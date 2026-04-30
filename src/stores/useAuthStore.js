import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import env from '../config/env.js';

/**
 * Auth Store - Manages user authentication state
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setCredentials: (userData, token) => {
        set({
          user: userData,
          token,
          isAuthenticated: true,
          error: null,
        });
        // Store token in localStorage for API interceptors
        localStorage.setItem(env.authTokenKey, token);
      },

      clearCredentials: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem(env.authTokenKey);
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      // Check if user has admin role
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin' || user?.isAdmin === true;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
