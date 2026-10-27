/**
 * Centralized API Client for Fimmit
 * Handles base URL, auth headers, error normalization, and token refresh.
 */

const envUrl = import.meta.env.VITE_API_BASE_URL;
const isDevLocalhost = typeof envUrl === 'string' && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'));
const RAW_API_BASE_URL = (envUrl && typeof envUrl === 'string' && !isDevLocalhost)
  ? envUrl
  : 'https://fimmit-backend.onrender.com';
export const API_BASE_URL = RAW_API_BASE_URL.trim().replace(/\/+$/, '');

const REFRESH_TOKEN_KEY = 'fimmit_refresh_token';

// In-memory token storage (Do NOT persist access tokens to localStorage per security policy)
let inMemoryAccessToken = null;
let inMemoryRefreshToken = null;
let isRefreshing = false;
let refreshPromise = null;

export const setAccessToken = (token) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => inMemoryAccessToken;

export const clearAccessToken = () => {
  inMemoryAccessToken = null;
};

export const setRefreshToken = (token) => {
  inMemoryRefreshToken = token;
  try {
    if (token) {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
};

export const getRefreshToken = () => {
  if (!inMemoryRefreshToken) {
    try {
      inMemoryRefreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      inMemoryRefreshToken = null;
    }
  }
  return inMemoryRefreshToken;
};

export const clearRefreshToken = () => {
  inMemoryRefreshToken = null;
  try {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // Ignore storage errors
  }
};

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function refreshAccessToken() {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const storedRefreshToken = getRefreshToken();
  if (!storedRefreshToken) {
    clearAccessToken();
    return null;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!response.ok) {
        clearRefreshToken();
        clearAccessToken();
        try {
          sessionStorage.removeItem('fimmit_user_data');
        } catch {
          // Ignore
        }
        return null;
      }

      const data = await response.json();
      const newAccessToken = data?.accessToken || data?.token || data?.jwt || data?.access_token || data?.data?.accessToken || data?.data?.token;
      if (newAccessToken) {
        setAccessToken(newAccessToken);
      }
      const newRefreshToken = data?.refreshToken || data?.refresh_token || data?.data?.refreshToken;
      if (newRefreshToken) {
        setRefreshToken(newRefreshToken);
      }
      if (!newAccessToken) {
        clearAccessToken();
        clearRefreshToken();
        try {
          sessionStorage.removeItem('fimmit_user_data');
        } catch {
          // Ignore
        }
        return null;
      }
      return newAccessToken;
    } catch {
      clearAccessToken();
      clearRefreshToken();
      try {
        sessionStorage.removeItem('fimmit_user_data');
      } catch {
        // Ignore
      }
      return null;
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

  let currentToken = getAccessToken();
  if (requiresAuth && !currentToken && getRefreshToken()) {
    try {
      currentToken = await refreshAccessToken();
    } catch {
      // Proceed; the request will be handled or caught below
    }
  }
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

    const contentType = response.headers.get('content-type') || '';
    const isHtml = contentType.includes('text/html');

    // Detect if redirected to backend OAuth entry point, /login, or returned HTML instead of JSON
    const isRedirectedToAuth = (
      response.redirected && (
        response.url.includes('oauth2/authorization') ||
        response.url.includes('github.com') ||
        response.url.includes('/login')
      )
    ) || (
      isHtml && !url.includes('.html')
    );

    // Handle 401 Unauthorized or OAuth redirection token expiry
    if ((response.status === 401 || isRedirectedToAuth) && requiresAuth && retryOnUnauthorized) {
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          fetchConfig.headers['Authorization'] = `Bearer ${newAccessToken}`;
          const retryResponse = await fetch(url, fetchConfig);
          const retryContentType = retryResponse.headers.get('content-type') || '';
          const retryIsHtml = retryContentType.includes('text/html');

          if (!retryResponse.ok || retryIsHtml) {
            const errorData = retryIsHtml ? null : await retryResponse.json().catch(() => null);
            throw new ApiError(
              errorData?.error || errorData?.message || `Request failed with status ${retryResponse.status}`,
              retryResponse.status,
              errorData
            );
          }
          if (retryResponse.status === 204) {
            return null;
          }
          return await retryResponse.json();
        }
      } catch (err) {
        if (err instanceof ApiError) throw err;
        throw new ApiError('Authentication expired. Please sign in again.', 401);
      }
    }

    if (isRedirectedToAuth) {
      throw new ApiError('Authentication required. Please sign in.', 401);
    }

    if (!response.ok) {
      const errorData = isHtml ? null : await response.json().catch(() => null);
      throw new ApiError(
        errorData?.error || errorData?.message || `Request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    if (response.status === 204) {
      return null;
    }

    if (isHtml) {
      throw new ApiError('Unexpected HTML response from API endpoint', 500);
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
