/**
 * Onboarding Service
 * Manages user profile fetching and onboarding preference submissions.
 * Endpoint verified in backend contract:
 * POST /api/recommendations
 * Profile data fetched from GET /api/auth/me via authService
 */

import { apiRequest } from './apiClient';
import { authService } from './authService';
import { DIFFICULTY_MAP } from '../utils/constants';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const DEFAULT_MOCK_PROFILE = {
  username: 'demo-developer',
  estimatedLevel: 'Intermediate',
  searchTags: ['javascript', 'react', 'nextjs', 'typescript', 'backend', 'api', 'ssr'],
  savedCount: 0,
};

/**
 * Maps frontend issue type labels to backend enum values
 */
export function mapIssueTypeToBackend(type) {
  if (!type) return 'BUG';
  const clean = String(type).trim().toUpperCase();
  if (clean.includes('BUG')) return 'BUG';
  if (clean.includes('DOC')) return 'DOCUMENTATION';
  if (clean.includes('TEST')) return 'TESTS';
  if (clean.includes('FEAT')) return 'FEATURE';
  if (clean.includes('PERF')) return 'PERFORMANCE';
  if (clean.includes('REFACTOR')) return 'REFACTOR';
  if (clean.includes('FIRST')) return 'GOOD_FIRST_ISSUE';
  if (clean.includes('CHORE')) return 'CHORE';
  return clean.replace(/\s+/g, '_');
}

export const onboardingService = {
  /**
   * Fetches user profile data using the verified GET /api/auth/me endpoint
   */
  async getProfile() {
    if (USE_MOCK) {
      return { ...DEFAULT_MOCK_PROFILE, isMock: true };
    }

    try {
      let user = null;
      if (authService.isAuthenticated()) {
        try {
          user = await authService.getCurrentUserFromBackend();
        } catch {
          user = authService.getCurrentUser();
        }
      } else {
        user = authService.getCurrentUser();
      }

      if (user) {
        return {
          username: user.username || user.login || 'Contributor',
          estimatedLevel: user.preferredDifficulty || user.estimatedLevel || 'Intermediate',
          searchTags: Array.isArray(user.preferredTechStack) && user.preferredTechStack.length > 0
            ? user.preferredTechStack
            : DEFAULT_MOCK_PROFILE.searchTags,
          savedCount: 0,
          isMock: false,
        };
      }
      return { ...DEFAULT_MOCK_PROFILE, isMock: true };
    } catch {
      return { ...DEFAULT_MOCK_PROFILE, isMock: true };
    }
  },

  /**
   * Saves onboarding preferences and pre-generates recommendations via POST /api/recommendations
   */
  async savePreferences(payload) {
    const rawDiff = payload.preferredDifficulty || 'EASY';
    const mappedDiff = DIFFICULTY_MAP[rawDiff] || String(rawDiff).toUpperCase();

    const rawIssues = Array.isArray(payload.preferredIssues)
      ? payload.preferredIssues
      : Array.isArray(payload.preferredIssueTypes)
      ? payload.preferredIssueTypes
      : ['BUG', 'DOCUMENTATION'];

    const apiPayload = {
      introduction: payload.introduction || payload.bio || '',
      preferredTechStack: Array.isArray(payload.preferredTechStack) ? payload.preferredTechStack : [],
      interests: Array.isArray(payload.interests) ? payload.interests : [],
      preferredIssueTypes: rawIssues.map(mapIssueTypeToBackend),
      preferredDifficulty: mappedDiff,
    };

    // Persist preferences in sessionStorage for immediate local state synchronization
    try {
      sessionStorage.setItem('fimmit_user_intro', apiPayload.introduction);
      sessionStorage.setItem('fimmit_tech_tags', JSON.stringify(apiPayload.preferredTechStack));
      sessionStorage.setItem('fimmit_user_interests', JSON.stringify(apiPayload.interests));
      sessionStorage.setItem('fimmit_preferred_issues', JSON.stringify(apiPayload.preferredIssueTypes));
      sessionStorage.setItem('fimmit_user_difficulty', mappedDiff.toLowerCase());
      sessionStorage.setItem('fimmit_user_preferences', JSON.stringify(apiPayload));
    } catch {
      // Ignore storage errors in restricted contexts
    }

    if (!authService.isAuthenticated()) {
      return {
        success: false,
        blockedByAuth: true,
        error: 'Authentication is currently unavailable. Submitting preferences to POST /api/recommendations requires a valid login session.',
        preferences: apiPayload,
      };
    }

    try {
      const recommendations = await apiRequest('/api/recommendations', {
        method: 'POST',
        body: apiPayload,
        requiresAuth: true,
      });

      // Cache returned recommendations for the Home view
      if (recommendations) {
        try {
          sessionStorage.setItem('fimmit_cached_recommendations', JSON.stringify(recommendations));
        } catch {
          // Ignore
        }
      }

      return { success: true, isMock: false, data: recommendations, preferences: apiPayload };
    } catch (err) {
      const isAuthError = err.status === 401 || err.message?.includes('401') || err.message?.includes('Authentication');
      return {
        success: false,
        blockedByAuth: isAuthError,
        error: isAuthError
          ? 'Authentication required: POST /api/recommendations requires a valid login session.'
          : (err.message || 'Failed to submit onboarding preferences to backend.'),
        preferences: apiPayload,
      };
    }
  },
};
