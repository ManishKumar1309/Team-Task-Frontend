/**
 * Authentication Service
 * Communicates with backend OAuth endpoints:
 * GET  /oauth2/authorization/github - Starts GitHub OAuth flow
 * POST /api/auth/exchange          - Exchanges temporary code for JWT tokens
 * GET  /api/auth/me                - Fetches current authenticated user profile
 * POST /api/auth/refresh           - Refreshes short-lived access token
 * POST /api/auth/logout            - Logs out and revokes refresh token
 */

import {
  API_BASE_URL,
  apiRequest,
  setAccessToken,
  clearAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearRefreshToken,
  refreshAccessToken,
} from './apiClient';

let currentUser = null;

export const authService = {
  /**
   * Retrieves the currently stored user object, only if the client holds valid tokens.
   */
  getCurrentUser() {
    if (!this.isAuthenticated()) {
      currentUser = null;
      try {
        sessionStorage.removeItem('fimmit_user_data');
      } catch {
        // ignore
      }
      return null;
    }
    if (!currentUser) {
      try {
        const saved = sessionStorage.getItem('fimmit_user_data');
        if (saved) {
          currentUser = JSON.parse(saved);
        }
      } catch {
        currentUser = null;
      }
    }
    return currentUser;
  },

  /**
   * Stores or clears the current user object in memory and sessionStorage.
   */
  setCurrentUser(user) {
    currentUser = user;
    try {
      if (user) {
        sessionStorage.setItem('fimmit_user_data', JSON.stringify(user));
      } else {
        sessionStorage.removeItem('fimmit_user_data');
      }
    } catch {
      // ignore storage failure
    }
  },

  /**
   * Starts GitHub OAuth flow by performing top-level browser navigation to the backend entry point.
   */
  startGitHubLogin() {
    clearAccessToken();
    clearRefreshToken();
    this.setCurrentUser(null);
    try {
      sessionStorage.removeItem('fimmit_user_difficulty');
      sessionStorage.removeItem('fimmit_tech_tags');
      sessionStorage.removeItem('fimmit_preferred_issues');
      sessionStorage.removeItem('fimmit_user_data');
    } catch {
      // Ignore
    }
    window.location.href = `${API_BASE_URL}/oauth2/authorization/github`;
  },

  /**
   * Exchanges authorization code from backend OAuth callback for JWT access/refresh tokens.
   * Calls POST /api/auth/exchange with { code }
   */
  async exchangeAuthCode(code) {
    if (!code) {
      throw new Error('No authorization code provided');
    }

    const data = await apiRequest('/api/auth/exchange', {
      method: 'POST',
      body: { code },
      requiresAuth: false,
    });

    const accessToken = data?.accessToken || data?.token || data?.jwt || data?.access_token || data?.data?.accessToken || data?.data?.token;
    const refreshToken = data?.refreshToken || data?.refresh_token || data?.data?.refreshToken;

    if (accessToken) {
      setAccessToken(accessToken);
    }
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }

    // Fetch user profile from /api/auth/me
    let meData = null;
    if (accessToken) {
      try {
        meData = await this.getCurrentUserFromBackend();
      } catch {
        // Fallback if me endpoint is unavailable or returns partial
      }
    }

    const userObj = {
      username: meData?.username || meData?.login || meData?.name || data?.username || data?.login || data?.user?.username || 'Contributor',
      avatarUrl: meData?.avatarUrl || meData?.avatar_url || data?.avatarUrl || data?.avatar_url || '',
      ...(meData || {}),
      ...(data?.user || {}),
    };
    this.setCurrentUser(userObj);

    // Determine whether user is new or returning based on backend response
    let isNewUser;
    if (typeof data?.isNewUser === 'boolean') {
      isNewUser = data.isNewUser;
    } else if (typeof data?.newUser === 'boolean') {
      isNewUser = data.newUser;
    } else if (typeof meData?.isNewUser === 'boolean') {
      isNewUser = meData.isNewUser;
    } else if (typeof meData?.newUser === 'boolean') {
      isNewUser = meData.newUser;
    } else if (data?.onboarded === false || meData?.onboarded === false) {
      isNewUser = true;
    } else if (data?.onboarded === true || meData?.onboarded === true) {
      isNewUser = false;
    } else if (data?.hasCompletedOnboarding === false || meData?.hasCompletedOnboarding === false) {
      isNewUser = true;
    } else if (data?.hasCompletedOnboarding === true || meData?.hasCompletedOnboarding === true) {
      isNewUser = false;
    } else {
      // If the backend response lacks a dedicated flag, inspect preference completeness
      const hasPreferences = (meData?.preferredTechStack && meData.preferredTechStack.length > 0) ||
                             Boolean(meData?.preferredDifficulty);
      isNewUser = !hasPreferences;
    }

    return {
      user: userObj,
      isNewUser,
      tokens: { accessToken, refreshToken },
    };
  },

  /**
   * Fetches the current authenticated user's profile from the backend.
   * Calls GET /api/auth/me
   */
  async getCurrentUserFromBackend() {
    return await apiRequest('/api/auth/me', {
      method: 'GET',
      requiresAuth: true,
    });
  },

  /**
   * Refreshes the access token using the stored refresh token.
   */
  async refreshSession() {
    const storedToken = getRefreshToken();
    if (!storedToken) {
      clearAccessToken();
      clearRefreshToken();
      this.setCurrentUser(null);
      return null;
    }

    try {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        clearAccessToken();
        clearRefreshToken();
        this.setCurrentUser(null);
        return null;
      }

      try {
        const meData = await this.getCurrentUserFromBackend();
        if (meData) {
          const userObj = {
            username: meData?.username || meData?.login || meData?.name || 'Contributor',
            avatarUrl: meData?.avatarUrl || meData?.avatar_url || '',
            ...meData,
          };
          this.setCurrentUser(userObj);
          return newToken;
        }
      } catch {
        clearAccessToken();
        clearRefreshToken();
        this.setCurrentUser(null);
        return null;
      }

      return newToken;
    } catch {
      clearAccessToken();
      clearRefreshToken();
      this.setCurrentUser(null);
      return null;
    }
  },

  /**
   * Logs out user and invalidates session on backend.
   */
  async logout() {
    const refreshToken = getRefreshToken();
    this.setCurrentUser(null);
    try {
      if (refreshToken) {
        await apiRequest('/api/auth/logout', {
          method: 'POST',
          body: { refreshToken },
          requiresAuth: false,
        });
      }
    } finally {
      clearAccessToken();
      clearRefreshToken();
    }
  },

  /**
   * Returns whether the client currently holds an in-memory access token or refresh token.
   */
  isAuthenticated() {
    return Boolean(getAccessToken() || getRefreshToken());
  },
};
