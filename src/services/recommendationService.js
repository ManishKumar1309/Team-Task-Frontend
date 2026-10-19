/**
 * Recommendation Service
 * Handles fetching recommendations, saving issues, and contribution progress.
 * Endpoints:
 * GET    /api/recommendations
 * POST   /api/recommendations/refresh
 * GET    /api/issues/{id}
 * GET    /api/saved-issues
 * POST   /api/saved-issues
 * DELETE /api/saved-issues/{id}
 * PATCH  /api/contributions/{id}
 */

import { apiRequest } from './apiClient';
import { formatMatchScore, formatIssueNumber } from '../utils/formatters';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

// Default mock issues matching Enakshi's Homepage structure
const FALLBACK_ISSUES = [
  {
    id: "101",
    title: "Add unit tests for authentication middleware",
    repository: "fimmit/core-api",
    url: "https://github.com",
    issueType: "TESTS",
    difficulty: "EASY",
    matchScore: 0.94,
    reasons: ["Matches your JavaScript interests", "Good first issue for your level"],
    techStack: ["JavaScript", "Jest", "Express"]
  },
  {
    id: "102",
    title: "Migrate user dashboard to React Server Components",
    repository: "facebook/react",
    url: "https://github.com",
    issueType: "FEATURE",
    difficulty: "HARD",
    matchScore: 0.88,
    reasons: ["Strong alignment with React ecosystem", "Matches your UI/UX preference"],
    techStack: ["React", "TypeScript"]
  },
  {
    id: "103",
    title: "Fix hydration mismatch warning on SSR text nodes",
    repository: "vercel/next.js",
    url: "https://github.com",
    issueType: "BUG",
    difficulty: "MEDIUM",
    matchScore: 0.91,
    reasons: ["Matches your recent work in Next.js", "Requires SSR knowledge"],
    techStack: ["React", "SSR"]
  },
  {
    id: "104",
    title: "Implement OAuth2 login provider",
    repository: "auth0/nextjs-auth0",
    url: "https://github.com",
    issueType: "FEATURE",
    difficulty: "MEDIUM",
    matchScore: 0.75,
    reasons: ["Great way to expand your Node.js backend skills"],
    techStack: ["Node.js", "Security"]
  },
  {
    id: "105",
    title: "Fix broken markdown link in contributing guide",
    repository: "fimmit/docs",
    url: "https://github.com",
    issueType: "DOCS",
    difficulty: "EASY",
    matchScore: 0.60,
    reasons: ["Quick win to get started contributing"],
    techStack: ["Markdown"]
  },
  {
    id: "106",
    title: "Optimize tree-shaking for unused CSS variables",
    repository: "tailwindlabs/tailwindcss",
    url: "https://github.com",
    issueType: "PERFORMANCE",
    difficulty: "HARD",
    matchScore: 0.82,
    reasons: ["Matches your CSS architecture interests"],
    techStack: ["CSS", "PostCSS", "JavaScript"]
  },
  {
    id: "107",
    title: "Update devDependencies to resolve dependabot alerts",
    repository: "vuejs/core",
    url: "https://github.com",
    issueType: "CHORE",
    difficulty: "EASY",
    matchScore: 0.65,
    reasons: ["Accessible entry point into a major framework"],
    techStack: ["TypeScript", "Vue"]
  },
  {
    id: "108",
    title: "Refactor telemetry service to use batching",
    repository: "microsoft/vscode",
    url: "https://github.com",
    issueType: "REFACTOR",
    difficulty: "HARD",
    matchScore: 0.79,
    reasons: ["Deep dive into enterprise-level TypeScript"],
    techStack: ["TypeScript", "Electron"]
  },
  {
    id: "109",
    title: "Improve error boundary fallback UI rendering",
    repository: "remix-run/remix",
    url: "https://github.com",
    issueType: "ENHANCEMENT",
    difficulty: "MEDIUM",
    matchScore: 0.85,
    reasons: ["Aligned with your React error handling experience"],
    techStack: ["React", "TypeScript"]
  },
  {
    id: "110",
    title: "Add a11y attributes to the default slider component",
    repository: "sveltejs/svelte",
    url: "https://github.com",
    issueType: "A11Y",
    difficulty: "EASY",
    matchScore: 0.71,
    reasons: ["Good overlap with your accessibility interests"],
    techStack: ["JavaScript", "Svelte", "HTML"]
  }
];

let mockSavedSet = new Set(['101', '103']);

export function adaptBackendIssue(raw) {
  if (!raw) return null;
  const tags = Array.isArray(raw.techStack) ? raw.techStack : Array.isArray(raw.tags) ? raw.tags : [];
  return {
    id: String(raw.id),
    title: raw.title || 'Untitled Issue',
    repository: raw.repository || 'Unknown repository',
    url: raw.url || 'https://github.com',
    issueType: raw.issueType || null,
    difficulty: raw.difficulty || 'MEDIUM',
    matchScore: typeof raw.matchScore === 'number' ? raw.matchScore : 0.8,
    formattedMatchScore: formatMatchScore(raw.matchScore),
    reasons: Array.isArray(raw.reasons) ? raw.reasons : [],
    techStack: tags,
    tags,
    issueNumber: formatIssueNumber(raw.issueNumber, raw.url),
    stars: typeof raw.stars === 'number' ? raw.stars : null,
    isSaved: mockSavedSet.has(String(raw.id)),
  };
}

export const recommendationService = {
  async getRecommendations() {
    if (USE_MOCK) {
      return {
        issues: FALLBACK_ISSUES.map(adaptBackendIssue),
        isMock: true,
      };
    }

    try {
      const data = await apiRequest('/api/recommendations', { method: 'GET' });
      const rawIssues = Array.isArray(data?.issues) ? data.issues : [];
      return {
        issues: rawIssues.slice(0, 10).map(adaptBackendIssue),
        isMock: false,
      };
    } catch {
      return {
        issues: FALLBACK_ISSUES.map(adaptBackendIssue),
        isMock: true,
      };
    }
  },

  async refreshRecommendations() {
    if (USE_MOCK) {
      return this.getRecommendations();
    }
    const data = await apiRequest('/api/recommendations/refresh', { method: 'POST' });
    const rawIssues = Array.isArray(data?.issues) ? data.issues : [];
    return {
      issues: rawIssues.slice(0, 10).map(adaptBackendIssue),
      isMock: false,
    };
  },

  async getIssueDetails(id) {
    if (USE_MOCK) {
      const found = FALLBACK_ISSUES.find((i) => i.id === String(id));
      return adaptBackendIssue(found);
    }
    const data = await apiRequest(`/api/issues/${id}`, { method: 'GET' });
    return adaptBackendIssue(data);
  },

  async getSavedIssues() {
    if (USE_MOCK) {
      const savedList = FALLBACK_ISSUES.filter((i) => mockSavedSet.has(i.id)).map(adaptBackendIssue);
      return {
        savedIssues: savedList,
        count: mockSavedSet.size,
        isMock: true,
      };
    }

    try {
      const data = await apiRequest('/api/saved-issues', { method: 'GET' });
      const items = Array.isArray(data?.savedIssues) ? data.savedIssues : [];
      return {
        savedIssues: items.map(adaptBackendIssue),
        count: items.length,
        isMock: false,
      };
    } catch {
      return {
        savedIssues: [],
        count: mockSavedSet.size,
        isMock: true,
      };
    }
  },

  async saveIssue(id) {
    mockSavedSet.add(String(id));
    if (USE_MOCK) {
      return { success: true, count: mockSavedSet.size, isMock: true };
    }
    try {
      const data = await apiRequest('/api/saved-issues', {
        method: 'POST',
        body: { issueId: id },
      });
      return { success: true, data, count: mockSavedSet.size, isMock: false };
    } catch {
      return { success: true, count: mockSavedSet.size, isMock: true };
    }
  },

  async removeSavedIssue(id) {
    mockSavedSet.delete(String(id));
    if (USE_MOCK) {
      return { success: true, count: mockSavedSet.size, isMock: true };
    }
    try {
      const data = await apiRequest(`/api/saved-issues/${id}`, {
        method: 'DELETE',
      });
      return { success: true, data, count: mockSavedSet.size, isMock: false };
    } catch {
      return { success: true, count: mockSavedSet.size, isMock: true };
    }
  },

  async updateContributionProgress(id, progressPayload) {
    if (USE_MOCK) {
      return { success: true, id, progressPayload, isMock: true };
    }
    return apiRequest(`/api/contributions/${id}`, {
      method: 'PATCH',
      body: progressPayload,
    });
  },
};
