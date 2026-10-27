/**
 * Saved Repository Service
 * Communicates with backend saved-repository endpoints:
 * GET    /api/saved-repositories
 * POST   /api/saved-repositories
 * DELETE /api/saved-repositories/{savedRepositoryId}
 */

import { apiRequest, ApiError } from './apiClient';
import { authService } from './authService';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const STORAGE_KEY = 'fimmit_saved_repositories';

function loadLocalSavedRepositories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Ignore parse errors
  }
  return [];
}

function persistLocalSavedRepositories(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Normalizes a repository object from backend or local representation
 */
export function adaptSavedRepository(raw) {
  if (!raw) return null;
  const owner = raw.owner || (raw.repositoryUrl?.includes('github.com/') ? raw.repositoryUrl.split('github.com/')[1]?.split('/')[0] : '') || '';
  const repositoryName = raw.repositoryName || raw.repoName || raw.name || (raw.repositoryUrl?.includes('github.com/') ? raw.repositoryUrl.split('github.com/')[1]?.split('/')[1] : '') || '';
  return {
    id: raw.id ?? raw.savedRepositoryId ?? null,
    githubRepositoryId: Number(raw.githubRepositoryId) || 0,
    repositoryName,
    owner,
    repositoryUrl: raw.repositoryUrl || raw.url || (owner && repositoryName ? `https://github.com/${owner}/${repositoryName}` : 'https://github.com'),
    description: raw.description || '',
    savedAt: raw.savedAt || raw.createdAt || null,
  };
}

export const savedRepositoryService = {
  /**
   * Fetches all saved repositories for the authenticated user.
   * Calls GET /api/saved-repositories
   */
  async getSavedRepositories() {
    if (USE_MOCK) {
      const local = loadLocalSavedRepositories();
      return {
        repositories: local.map(adaptSavedRepository),
        isMock: true,
      };
    }

    if (!authService.isAuthenticated()) {
      return {
        repositories: [],
        isMock: false,
        blockedByAuth: true,
        error: 'Authentication is currently unavailable. GET /api/saved-repositories requires a valid login session.',
      };
    }

    try {
      const data = await apiRequest('/api/saved-repositories', {
        method: 'GET',
        requiresAuth: true,
      });

      const rawList = Array.isArray(data)
        ? data
        : Array.isArray(data?.savedRepositories)
        ? data.savedRepositories
        : Array.isArray(data?.repositories)
        ? data.repositories
        : Array.isArray(data?.content)
        ? data.content
        : [];

      const adapted = rawList.map(adaptSavedRepository).filter(Boolean);
      // Sync local storage cache for fast access
      persistLocalSavedRepositories(adapted);

      return {
        repositories: adapted,
        isMock: false,
      };
    } catch (err) {
      const isAuthError = err.status === 401 || err.message?.toLowerCase().includes('auth') || err.message?.toLowerCase().includes('unauthorized');
      return {
        repositories: [],
        isMock: false,
        blockedByAuth: isAuthError,
        error: err.message || 'Failed to fetch saved repositories from backend.',
      };
    }
  },

  /**
   * Saves a repository for the authenticated user.
   * Calls POST /api/saved-repositories with:
   * { githubRepositoryId, repositoryName, owner, repositoryUrl, description }
   */
  async saveRepository({ githubRepositoryId, repositoryName, owner, repositoryUrl, description }) {
    if (!authService.isAuthenticated()) {
      const authErr = new ApiError('Authentication required: please sign in with GitHub to save repositories.', 401);
      authErr.blockedByAuth = true;
      throw authErr;
    }

    const cleanOwner = String(owner || '').trim();
    const cleanRepoName = String(repositoryName || '').trim();
    const cleanUrl = String(repositoryUrl || (cleanOwner && cleanRepoName ? `https://github.com/${cleanOwner}/${cleanRepoName}` : '')).trim();
    const cleanDesc = description ? String(description).trim().slice(0, 500) : '';
    const numRepoId = Number(githubRepositoryId) || Math.abs(hashString(`${cleanOwner}/${cleanRepoName}`));

    const payload = {
      githubRepositoryId: numRepoId,
      repositoryName: cleanRepoName,
      owner: cleanOwner,
      repositoryUrl: cleanUrl,
      ...(cleanDesc ? { description: cleanDesc } : {}),
    };

    if (USE_MOCK) {
      const local = loadLocalSavedRepositories();
      const existing = local.find(
        (r) =>
          r.githubRepositoryId === payload.githubRepositoryId ||
          (r.owner.toLowerCase() === payload.owner.toLowerCase() &&
            r.repositoryName.toLowerCase() === payload.repositoryName.toLowerCase())
      );
      if (existing) {
        return { repository: existing, alreadySaved: true, isMock: true };
      }
      const newMockRecord = {
        id: Date.now(),
        ...payload,
        savedAt: new Date().toISOString(),
      };
      local.push(newMockRecord);
      persistLocalSavedRepositories(local);
      return { repository: adaptSavedRepository(newMockRecord), isMock: true };
    }

    try {
      const result = await apiRequest('/api/saved-repositories', {
        method: 'POST',
        body: payload,
        requiresAuth: true,
      });

      const adapted = adaptSavedRepository(result || { ...payload, id: null });

      // Update local cache
      const local = loadLocalSavedRepositories();
      const filtered = local.filter((r) => r.id !== adapted.id && r.githubRepositoryId !== adapted.githubRepositoryId);
      filtered.push(adapted);
      persistLocalSavedRepositories(filtered);

      return {
        repository: adapted,
        isMock: false,
      };
    } catch (err) {
      if (err.status === 409 || err.message?.toLowerCase().includes('already') || err.message?.toLowerCase().includes('conflict')) {
        return {
          repository: adaptSavedRepository({ ...payload, id: null }),
          alreadySaved: true,
          isMock: false,
        };
      }
      // Re-throw so caller knows the request failed and does not pretend it was saved
      throw err;
    }
  },

  /**
   * Removes a saved repository by its backend record ID (savedRepositoryId).
   * Calls DELETE /api/saved-repositories/{savedRepositoryId}
   */
  async deleteSavedRepository(savedRepositoryId) {
    if (!savedRepositoryId) {
      throw new Error('savedRepositoryId is required to delete a saved repository');
    }

    if (!authService.isAuthenticated()) {
      const authErr = new ApiError('Authentication required: please sign in with GitHub to delete saved repositories.', 401);
      authErr.blockedByAuth = true;
      throw authErr;
    }

    // Update local cache
    const local = loadLocalSavedRepositories();
    const updated = local.filter((r) => String(r.id) !== String(savedRepositoryId));
    persistLocalSavedRepositories(updated);

    if (USE_MOCK) {
      return { success: true, isMock: true };
    }

    await apiRequest(`/api/saved-repositories/${savedRepositoryId}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
    return { success: true, isMock: false };
  },
};

/**
 * Deterministic numeric hash generator for fallback repository IDs
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 123456789;
}
