/**
 * Authentication Service
 * Communicates with backend OAuth endpoints:
 * GET  /api/auth/github  - Redirects to GitHub OAuth
 * POST /api/auth/refresh - Refreshes short-lived access token
 * POST /api/auth/logout  - Logs out and revokes refresh cookie
 */

import { apiRequest, setAccessToken, clearAccessToken, getAccessToken } from './apiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const authService = {
  /**
   * Starts GitHub OAuth flow by navigating the browser to the backend entry point.
   */
  startGitHubLogin() {
    window.location.href = `${API_BASE_URL}/api/auth/github`;
  },

  /**
   * Refreshes the short-lived access token using the backend's HttpOnly cookie.
   */
  async refreshSession() {
    try {
      const data = await apiRequest('/api/auth/refresh', {
        method: 'POST',
        requiresAuth: false,
      });
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        return data.accessToken;
      }
      return null;
    } catch {
      clearAccessToken();
      return null;
    }
  },

  /**
   * Logs out user and invalidates session on backend.
   */
  async logout() {
    try {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
        requiresAuth: true,
      });
    } finally {
      clearAccessToken();
    }
  },

  /**
   * Returns whether the client currently holds an in-memory access token.
   */
  isAuthenticated() {
    return Boolean(getAccessToken());
  },
};
