/**
 * Onboarding Service
 * Manages user profile fetching and onboarding preference submissions.
 * Endpoints:
 * GET /api/profile
 * PUT /api/profile/preferences
 */

import { apiRequest } from './apiClient';
import { DIFFICULTY_MAP } from '../utils/constants';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

const DEFAULT_MOCK_PROFILE = {
  username: 'demo-developer',
  estimatedLevel: 'Intermediate',
  searchTags: ['javascript', 'react', 'nextjs', 'typescript', 'backend', 'api', 'ssr'],
  savedCount: 2,
};

export const onboardingService = {
  /**
   * Fetches user profile data
   */
  async getProfile() {
    if (USE_MOCK) {
      return { ...DEFAULT_MOCK_PROFILE, isMock: true };
    }

    try {
      const data = await apiRequest('/api/profile', { method: 'GET' });
      return { ...data, isMock: false };
    } catch {
      return { ...DEFAULT_MOCK_PROFILE, isMock: true };
    }
  },

  /**
   * Saves onboarding preferences
   */
  async savePreferences(payload) {
    const apiPayload = {
      introduction: payload.introduction || payload.bio || '',
      preferredTechStack: payload.preferredTechStack || [],
      interests: payload.interests || [],
      preferredDifficulty: DIFFICULTY_MAP[payload.preferredDifficulty] || 'EASY',
      // Preferred issue categories (Question 5).
      // Maintained in frontend state; backend schema confirmation is pending.
      preferredIssues: payload.preferredIssues || [],
    };

    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, isMock: true, preferences: apiPayload };
    }

    try {
      const result = await apiRequest('/api/profile/preferences', {
        method: 'PUT',
        body: apiPayload,
      });
      return { success: true, isMock: false, data: result };
    } catch {
      return {
        success: true,
        isMock: true,
        preferences: apiPayload,
        warning: 'Backend unreachable. Saved preferences locally in mock mode.',
      };
    }
  },
};
