/**
 * Recommendation Service
 * Handles fetching recommendations via POST /api/recommendations and repository saving.
 * Verified Endpoints:
 * POST   /api/recommendations
 * GET    /api/saved-repositories
 * POST   /api/saved-repositories
 * DELETE /api/saved-repositories/{savedRepositoryId}
 */

import { apiRequest } from './apiClient';
import { formatMatchScore, formatIssueNumber } from '../utils/formatters';
import { savedRepositoryService } from './savedRepositoryService';
import { authService } from './authService';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Fallback issues adhering to Fimmit editorial design
export const FALLBACK_ISSUES = [
  {
    id: "101",
    title: "Fix broken sandbox in useDeferredValue docs",
    repository: "reactjs/react.dev",
    repo: "reactjs/react.dev",
    repositoryName: "react.dev",
    owner: "reactjs",
    repositoryUrl: "https://github.com/reactjs/react.dev",
    url: "https://github.com/reactjs/react.dev/issues/6120",
    issueType: "DOCS",
    difficulty: "hard",
    matchScore: 0.94,
    matchDesc: "Good first issue with a clear fix and active maintainers",
    reasons: ["Matches your JavaScript interests", "Good first issue for your level"],
    techStack: ["JS", "react", "docs"],
    tags: ["JS", "react", "docs"],
    stars: "1k",
    issueNumber: "#6120",
    issueNum: "#6120",
  },
  {
    id: "102",
    title: "Fix hydration mismatch warning on SSR text nodes",
    repository: "vercel/next.js",
    repo: "vercel/next.js",
    repositoryName: "next.js",
    owner: "vercel",
    repositoryUrl: "https://github.com/vercel/next.js",
    url: "https://github.com/vercel/next.js/issues/70210",
    issueType: "BUG",
    difficulty: "medium",
    matchScore: 0.91,
    matchDesc: "Relevant to React and server-side rendering",
    reasons: ["Matches your recent work in Next.js", "Requires SSR knowledge"],
    techStack: ["JS", "React", "SSR"],
    tags: ["JS", "React", "SSR"],
    stars: "130k",
    issueNumber: "#70210",
    issueNum: "#70210",
  },
  {
    id: "103",
    title: "Improve error messages for invalid hook usage",
    repository: "facebook/react",
    repo: "facebook/react",
    repositoryName: "react",
    owner: "facebook",
    repositoryUrl: "https://github.com/facebook/react",
    url: "https://github.com/facebook/react/issues/28910",
    issueType: "FEATURE",
    difficulty: "medium",
    matchScore: 0.88,
    matchDesc: "A useful issue for learning React internals",
    reasons: ["Strong alignment with React ecosystem", "Matches your UI/UX preference"],
    techStack: ["JS", "React", "debugging"],
    tags: ["JS", "React", "debugging"],
    stars: "230k",
    issueNumber: "#28910",
    issueNum: "#28910",
  },
  {
    id: "104",
    title: "Add tests for middleware error handling",
    repository: "expressjs/express",
    repo: "expressjs/express",
    repositoryName: "express",
    owner: "expressjs",
    repositoryUrl: "https://github.com/expressjs/express",
    url: "https://github.com/expressjs/express/issues",
    issueType: "TESTS",
    difficulty: "easy",
    matchScore: 0.85,
    matchDesc: "Test-focused task with a clear scope",
    reasons: ["Test-focused task with a clear scope"],
    techStack: ["JS", "Express", "tests"],
    tags: ["JS", "Express", "tests"],
    stars: "65k",
    issueNumber: "#5900",
    issueNum: "#5900",
  },
  {
    id: "105",
    title: "Improve documentation for asynchronous APIs",
    repository: "nodejs/node",
    repo: "nodejs/node",
    repositoryName: "node",
    owner: "nodejs",
    repositoryUrl: "https://github.com/nodejs/node",
    url: "https://github.com/nodejs/node/issues",
    issueType: "DOCS",
    difficulty: "easy",
    matchScore: 0.80,
    matchDesc: "Good opportunity to contribute to Node.js",
    reasons: ["Good opportunity to contribute to Node.js"],
    techStack: ["JS", "Node.js", "docs"],
    tags: ["JS", "Node.js", "docs"],
    stars: "110k",
    issueNumber: "#55000",
    issueNum: "#55000",
  },
  {
    id: "106",
    title: "Clarify test timeout configuration documentation",
    repository: "jestjs/jest",
    repo: "jestjs/jest",
    repositoryName: "jest",
    owner: "jestjs",
    repositoryUrl: "https://github.com/jestjs/jest",
    url: "https://github.com/jestjs/jest/issues",
    issueType: "DOCS",
    difficulty: "easy",
    matchScore: 0.78,
    matchDesc: "Documentation improvement with a focused scope",
    reasons: ["Documentation improvement with a focused scope"],
    techStack: ["JS", "Jest", "docs"],
    tags: ["JS", "Jest", "docs"],
    stars: "44k",
    issueNumber: "#15000",
    issueNum: "#15000",
  },
  {
    id: "107",
    title: "Improve error output for failed module resolution",
    repository: "vitejs/vite",
    repo: "vitejs/vite",
    repositoryName: "vite",
    owner: "vitejs",
    repositoryUrl: "https://github.com/vitejs/vite",
    url: "https://github.com/vitejs/vite/issues",
    issueType: "BUG",
    difficulty: "medium",
    matchScore: 0.82,
    matchDesc: "Explore module resolution and development tooling",
    reasons: ["Explore module resolution and development tooling"],
    techStack: ["JS", "Vite", "debugging"],
    tags: ["JS", "Vite", "debugging"],
    stars: "70k",
    issueNumber: "#19000",
    issueNum: "#19000",
  },
  {
    id: "108",
    title: "Improve accessibility warnings in component diagnostics",
    repository: "sveltejs/svelte",
    repo: "sveltejs/svelte",
    repositoryName: "svelte",
    owner: "sveltejs",
    repositoryUrl: "https://github.com/sveltejs/svelte",
    url: "https://github.com/sveltejs/svelte/issues",
    issueType: "A11Y",
    difficulty: "medium",
    matchScore: 0.76,
    matchDesc: "Contribute to clearer accessibility feedback",
    reasons: ["Contribute to clearer accessibility feedback"],
    techStack: ["JS", "Svelte", "accessibility"],
    tags: ["JS", "Svelte", "accessibility"],
    stars: "80k",
    issueNumber: "#12000",
    issueNum: "#12000",
  },
  {
    id: "109",
    title: "Add regression tests for formatting edge cases",
    repository: "prettier/prettier",
    repo: "prettier/prettier",
    repositoryName: "prettier",
    owner: "prettier",
    repositoryUrl: "https://github.com/prettier/prettier",
    url: "https://github.com/prettier/prettier/issues",
    issueType: "TESTS",
    difficulty: "hard",
    matchScore: 0.89,
    matchDesc: "A test-driven contribution to developer tooling",
    reasons: ["A test-driven contribution to developer tooling"],
    techStack: ["JS", "tests", "formatting"],
    tags: ["JS", "tests", "formatting"],
    stars: "50k",
    issueNumber: "#17000",
    issueNum: "#17000",
  },
  {
    id: "110",
    title: "Clarify request cancellation examples",
    repository: "axios/axios",
    repo: "axios/axios",
    repositoryName: "axios",
    owner: "axios",
    repositoryUrl: "https://github.com/axios/axios",
    url: "https://github.com/axios/axios/issues",
    issueType: "DOCS",
    difficulty: "easy",
    matchScore: 0.72,
    matchDesc: "Explore HTTP requests and cancellation behavior",
    reasons: ["Explore HTTP requests and cancellation behavior"],
    techStack: ["JS", "HTTP", "docs"],
    tags: ["JS", "HTTP", "docs"],
    stars: "105k",
    issueNumber: "#6500",
    issueNum: "#6500",
  },
];

/**
 * Builds the POST /api/recommendations request body from stored user preferences
 */
export function buildRecommendationPayload(overrides = {}) {
  let techStack = ['JavaScript', 'React'];
  try {
    const saved = sessionStorage.getItem('fimmit_tech_tags');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) techStack = parsed;
    }
  } catch {
    // Ignore
  }

  let preferredIssues = ['BUG', 'DOCUMENTATION', 'TESTS'];
  try {
    const saved = sessionStorage.getItem('fimmit_preferred_issues');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) preferredIssues = parsed;
    }
  } catch {
    // Ignore
  }

  let interests = ['backend development', 'open source'];
  try {
    const saved = sessionStorage.getItem('fimmit_user_interests');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) interests = parsed;
    }
  } catch {
    // Ignore
  }

  const rawDiff = sessionStorage.getItem('fimmit_user_difficulty') || 'EASY';
  const diff = String(rawDiff).toUpperCase();
  const intro = sessionStorage.getItem('fimmit_user_intro') || '';

  return {
    introduction: overrides.introduction ?? intro,
    preferredTechStack: overrides.preferredTechStack ?? techStack,
    interests: overrides.interests ?? interests,
    preferredIssueTypes: overrides.preferredIssueTypes ?? preferredIssues,
    preferredDifficulty: overrides.preferredDifficulty ?? diff,
  };
}

/**
 * Normalizes backend recommendation objects to match frontend requirements
 */
export function adaptBackendIssue(raw) {
  if (!raw) return null;

  const id = String(raw.id ?? raw.issueId ?? raw.githubIssueId ?? raw.number ?? Math.random());
  
  const rawRepo = raw.repository;
  let repoName = raw.repositoryName || raw.repoName || '';
  let owner = raw.owner || '';

  if (typeof rawRepo === 'object' && rawRepo !== null) {
    repoName = repoName || rawRepo.name || rawRepo.repositoryName || '';
    owner = owner || (typeof rawRepo.owner === 'object' ? rawRepo.owner?.login : rawRepo.owner) || '';
  } else if (typeof rawRepo === 'string' && rawRepo.includes('/')) {
    const parts = rawRepo.split('/');
    owner = owner || parts[0];
    repoName = repoName || parts[1];
  }
  const repo = (owner && repoName)
    ? `${owner}/${repoName}`
    : (typeof rawRepo === 'string' ? rawRepo : (repoName || 'Open Source Project'));

  const url = raw.url || raw.issueUrl || raw.htmlUrl || raw.html_url || 'https://github.com';
  const issueNumber = formatIssueNumber(raw.issueNumber || raw.number || raw.issueNum, url);
  const difficulty = (raw.difficulty || 'medium').toLowerCase();

  const rawTech = Array.isArray(raw.techStack)
    ? raw.techStack
    : Array.isArray(raw.tags)
    ? raw.tags
    : (raw.language ? [raw.language] : ['General']);

  const techStack = rawTech
    .map((t) => (typeof t === 'object' && t !== null ? (t.name || t.label || String(t)) : String(t)))
    .filter(Boolean);

  const stars = typeof raw.stars === 'number'
    ? (raw.stars > 1000 ? `${Math.round(raw.stars / 1000)}k` : String(raw.stars))
    : typeof raw.stars === 'string'
    ? raw.stars
    : typeof raw.starCount === 'number'
    ? (raw.starCount > 1000 ? `${Math.round(raw.starCount / 1000)}k` : String(raw.starCount))
    : '1k';

  const matchDesc = raw.matchDesc || (Array.isArray(raw.reasons) ? raw.reasons.join('. ') : (raw.description || ''));

  return {
    id,
    title: raw.title || 'Untitled Issue',
    repo,
    repository: repo,
    repositoryName: repoName || (repo.includes('/') ? repo.split('/')[1] : repo),
    owner: owner || (repo.includes('/') ? repo.split('/')[0] : ''),
    repositoryUrl: raw.repositoryUrl || (owner && repoName ? `https://github.com/${owner}/${repoName}` : (url.includes('/issues') ? url.split('/issues')[0] : 'https://github.com')),
    githubRepositoryId: raw.githubRepositoryId || null,
    repoDescription: raw.repoDescription || raw.repositoryDescription || raw.description || '',
    stars,
    url,
    issueNum: issueNumber,
    issueNumber,
    issueType: raw.issueType ? String(raw.issueType) : null,
    difficulty,
    matchScore: typeof raw.matchScore === 'number' ? raw.matchScore : 0.85,
    formattedMatchScore: formatMatchScore(raw.matchScore),
    matchDesc,
    reasons: Array.isArray(raw.reasons) ? raw.reasons : (matchDesc ? [matchDesc] : []),
    techStack,
    tags: techStack,
    isSaved: false,
  };
}

export const recommendationService = {
  /**
   * Fetches issue recommendations using verified POST /api/recommendations endpoint
   */
  async getRecommendations(customPayload = null) {
    if (USE_MOCK) {
      return {
        issues: FALLBACK_ISSUES.map(adaptBackendIssue),
        isMock: true,
      };
    }

    if (!authService.isAuthenticated()) {
      return {
        issues: [],
        isMock: false,
        blockedByAuth: true,
        error: 'Authentication is currently unavailable. POST /api/recommendations requires a valid login session.',
      };
    }

    try {
      const payload = buildRecommendationPayload(customPayload || {});
      const data = await apiRequest('/api/recommendations', {
        method: 'POST',
        body: payload,
        requiresAuth: true,
      });

      const rawIssues = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.issues)
        ? data.issues
        : Array.isArray(data?.recommendations)
        ? data.recommendations
        : Array.isArray(data?.content)
        ? data.content
        : Array.isArray(data?.data?.content)
        ? data.data.content
        : Array.isArray(data?.data?.recommendations)
        ? data.data.recommendations
        : Array.isArray(data?.data?.issues)
        ? data.data.issues
        : [];

      const adapted = rawIssues.map(adaptBackendIssue).filter(Boolean);
      if (adapted.length > 0) {
        try {
          sessionStorage.setItem('fimmit_cached_recommendations', JSON.stringify(adapted));
        } catch {
          // Ignore
        }
      }

      return {
        issues: adapted,
        isMock: false,
      };
    } catch (err) {
      const isAuth = err.status === 401 || err.message?.includes('401') || err.message?.includes('Authentication');
      return {
        issues: [],
        isMock: false,
        blockedByAuth: isAuth,
        error: isAuth
          ? 'Authentication required: POST /api/recommendations requires a valid login session.'
          : (err.message || 'Failed to fetch recommendations from backend.'),
      };
    }
  },

  /**
   * Refreshes recommendations with the latest preferences
   */
  async refreshRecommendations(customPayload = null) {
    return this.getRecommendations(customPayload);
  },

  /**
   * Finds issue details from fallback or cache
   */
  async getIssueDetails(id) {
    const found = FALLBACK_ISSUES.find((i) => String(i.id) === String(id));
    return adaptBackendIssue(found);
  },

  // Saved Repository endpoints integration (Phase 5)
  getSavedRepositories: savedRepositoryService.getSavedRepositories,
  saveRepository: savedRepositoryService.saveRepository,
  deleteSavedRepository: savedRepositoryService.deleteSavedRepository,

  // Backwards-compatible issue helpers delegating to repository persistence
  async getSavedIssues() {
    return savedRepositoryService.getSavedRepositories();
  },

  async saveIssue(repoOrIssue) {
    return savedRepositoryService.saveRepository(repoOrIssue);
  },

  async removeSavedIssue(id) {
    return savedRepositoryService.deleteSavedRepository(id);
  },
};
