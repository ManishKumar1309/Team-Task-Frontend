/**
 * Centralized API Client for Fimmit
 * Handles base URL, auth headers, error normalization, and token refresh.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// In-memory token storage (Do NOT persist to localStorage per security policy)
let inMemoryAccessToken = null;
let isRefreshing = false;
let refreshPromise = null;

export const setAccessToken = (token) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => inMemoryAccessToken;

export const clearAccessToken = () => {
  inMemoryAccessToken = null;
};

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function refreshAccessToken() {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Needed for HttpOnly refresh cookie
      });

      if (!response.ok) {
        throw new Error('Session refresh failed');
      }

      const data = await response.json();
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        return data.accessToken;
      }
      throw new Error('No access token returned on refresh');
    } catch (err) {
      clearAccessToken();
      throw err;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body = null,
    requiresAuth = true,
    retryOnUnauthorized = true,
    credentials = 'include',
    ...customConfig
  } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const currentToken = getAccessToken();
  if (requiresAuth && currentToken) {
    requestHeaders['Authorization'] = `Bearer ${currentToken}`;
  }

  const fetchConfig = {
    method,
    headers: requestHeaders,
    credentials,
    ...customConfig,
  };

  if (body) {
    fetchConfig.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchConfig);

    // Handle 401 Unauthorized token expiry
    if (response.status === 401 && requiresAuth && retryOnUnauthorized && method === 'GET') {
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          fetchConfig.headers['Authorization'] = `Bearer ${newAccessToken}`;
          const retryResponse = await fetch(url, fetchConfig);
          if (!retryResponse.ok) {
            const errorData = await retryResponse.json().catch(() => null);
            throw new ApiError(
              errorData?.message || `Request failed with status ${retryResponse.status}`,
              retryResponse.status,
              errorData
            );
          }
          return await retryResponse.json();
        }
      } catch {
        throw new ApiError('Authentication expired. Please sign in again.', 401);
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new ApiError(
        errorData?.message || `Request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || 'Network request failed. Backend may be offline.',
      0,
      null
    );
  }
}
