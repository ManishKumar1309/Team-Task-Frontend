import React, { useState, useMemo } from 'react';

import { FilterControls } from '../components/recommendations/FilterControls';
import { IssueCard } from '../components/recommendations/IssueCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useRecommendations } from '../hooks/useRecommendations';

import './HomePage.css';

const MOCK_ISSUES = [
  {
    id: '101',
    title: 'Add unit tests for authentication middleware',
    repository: 'fimmit/core-api',
    url: 'https://github.com',
    issueType: 'TESTS',
    difficulty: 'EASY',
    matchScore: 0.94,
    repoDescription:
      'The core backend API for Fimmit, built with Node.js and Express to handle user routing, authentication, and integration services.',
    techStack: ['JavaScript', 'Jest', 'Express'],
  },
  {
    id: '102',
    title: 'Migrate user dashboard to React Server Components',
    repository: 'facebook/react',
    url: 'https://github.com',
    issueType: 'FEATURE',
    difficulty: 'HARD',
    matchScore: 0.88,
    repoDescription:
      'The library for web and native user interfaces. React lets you build user interfaces out of individual pieces called components.',
    techStack: ['React', 'TypeScript'],
  },
  {
    id: '103',
    title: 'Fix hydration mismatch warning on SSR text nodes',
    repository: 'vercel/next.js',
    url: 'https://github.com',
    issueType: 'BUG',
    difficulty: 'MEDIUM',
    matchScore: 0.91,
    repoDescription:
      'The React Framework for the Web. Next.js gives you the best developer experience with all the features you need for production.',
    techStack: ['React', 'SSR'],
  },
  {
    id: '104',
    title: 'Implement OAuth2 login provider',
    repository: 'auth0/nextjs-auth0',
    url: 'https://github.com',
    issueType: 'FEATURE',
    difficulty: 'MEDIUM',
    matchScore: 0.75,
    repoDescription: 'Auth0 SDK for Next.js applications.',
    techStack: ['Node.js', 'Security'],
  },
  {
    id: '105',
    title: 'Fix broken markdown link in contributing guide',
    repository: 'fimmit/docs',
    url: 'https://github.com',
    issueType: 'DOCS',
    difficulty: 'EASY',
    matchScore: 0.60,
    repoDescription:
      'Official documentation and open-source contribution guidelines for the Fimmit ecosystem.',
    techStack: ['Markdown'],
  },
  {
    id: '106',
    title: 'Optimize tree-shaking for unused CSS variables',
    repository: 'tailwindlabs/tailwindcss',
    url: 'https://github.com',
    issueType: 'PERFORMANCE',
    difficulty: 'HARD',
    matchScore: 0.82,
    repoDescription:
      'A utility-first CSS framework for rapid UI development.',
    techStack: ['CSS', 'PostCSS', 'JavaScript'],
  },
  {
    id: '107',
    title: 'Update devDependencies to resolve dependabot alerts',
    repository: 'vuejs/core',
    url: 'https://github.com',
    issueType: 'CHORE',
    difficulty: 'EASY',
    matchScore: 0.65,
    repoDescription:
      'Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.',
    techStack: ['TypeScript', 'Vue'],
  },
  {
    id: '108',
    title: 'Refactor telemetry service to use batching',
    repository: 'microsoft/vscode',
    url: 'https://github.com',
    issueType: 'REFACTOR',
    difficulty: 'HARD',
    matchScore: 0.79,
    repoDescription:
      'Visual Studio Code is an open-source, cross-platform code editor.',
    techStack: ['TypeScript', 'Electron'],
  },
  {
    id: '109',
    title: 'Improve error boundary fallback UI rendering',
    repository: 'remix-run/remix',
    url: 'https://github.com',
    issueType: 'ENHANCEMENT',
    difficulty: 'MEDIUM',
    matchScore: 0.85,
    repoDescription:
      'Build Better Websites. Create modern, resilient user experiences with web fundamentals.',
    techStack: ['React', 'TypeScript'],
  },
  {
    id: '110',
    title: 'Add a11y attributes to the default slider component',
    repository: 'sveltejs/svelte',
    url: 'https://github.com',
    issueType: 'A11Y',
    difficulty: 'EASY',
    matchScore: 0.71,
    repoDescription:
      'Cybernetically enhanced web apps. A compiler that takes declarative components and converts them to efficient JavaScript.',
    techStack: ['JavaScript', 'Svelte', 'HTML'],
  },
];

export const HomePage = ({
  savedIssueIds: propSavedIssueIds,
  onToggleSave: propToggleSave,
  issues: propIssues,
  isLoading: propIsLoading,
  error: propError,
  onRetry: propOnRetry,
}) => {
  const recData = useRecommendations();

  const issues =
    propIssues !== undefined ? propIssues : recData.issues;

  const isLoading =
    propIsLoading !== undefined ? propIsLoading : recData.isLoading;

  const error =
    propError !== undefined ? propError : recData.error;

  const onRetry = propOnRetry || recData.reload;

  const {
    refreshFeed,
    isRefreshing,
    profile,
    cooldownSeconds,
    canRefresh,
  } = recData;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiff, setSelectedDiff] = useState('ALL');
  const [selectedTech, setSelectedTech] = useState([]);
  const [sortBy, setSortBy] = useState('BEST_MATCH');

  // Refresh only when the cooldown has ended.
const handleRefreshClick = () => {
  console.log("REFRESH BUTTON CLICKED");
  console.log({ canRefresh, isLoading, isRefreshing, cooldownSeconds });

  if (!canRefresh || isLoading || isRefreshing) return;

  refreshFeed();
};
  const [localSavedIds, setLocalSavedIds] = useState(new Set());

  const savedIssueIds = propSavedIssueIds || localSavedIds;

  const baseIssues = useMemo(() => {
    if (issues && issues.length > 0) return issues;

    if (isLoading || error) return [];

    return MOCK_ISSUES;
  }, [issues, isLoading, error]);

  const availableTechs = useMemo(() => {
    const techs = new Set();

    baseIssues.forEach((issue) =>
      issue.techStack?.forEach((tech) => techs.add(tech))
    );

    return Array.from(techs).sort();
  }, [baseIssues]);

  // Search, difficulty and technology filters.
  const processedIssues = useMemo(() => {
    const filtered = baseIssues.filter((issue) => {
      const searchLower = searchQuery.toLowerCase();

      const matchesSearch =
        issue.title.toLowerCase().includes(searchLower) ||
        issue.repository.toLowerCase().includes(searchLower);

      const matchesDiff =
        selectedDiff === 'ALL' ||
        issue.difficulty === selectedDiff;

      const matchesTech =
        selectedTech.length === 0 ||
        selectedTech.some((tech) => issue.techStack?.includes(tech));

      return matchesSearch && matchesDiff && matchesTech;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'BEST_MATCH') {
        return b.matchScore - a.matchScore;
      }

      if (sortBy === 'EASIEST') {
        const diffMap = { EASY: 1, MEDIUM: 2, HARD: 3 };
        return (diffMap[a.difficulty] || 99) -
          (diffMap[b.difficulty] || 99);
      }

      if (sortBy === 'MEDIUM_FIRST') {
        const diffMap = { MEDIUM: 1, EASY: 2, HARD: 3 };
        return (diffMap[a.difficulty] || 99) -
          (diffMap[b.difficulty] || 99);
      }

      if (sortBy === 'HARD_FIRST') {
        const diffMap = { HARD: 1, MEDIUM: 2, EASY: 3 };
        return (diffMap[a.difficulty] || 99) -
          (diffMap[b.difficulty] || 99);
      }

      if (sortBy === 'TITLE_AZ') {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });
  }, [baseIssues, searchQuery, selectedDiff, selectedTech, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDiff('ALL');
    setSelectedTech([]);
    setSortBy('BEST_MATCH');
  };

  const handleToggleSave = (issueId) => {
    if (propToggleSave) {
      propToggleSave(issueId);
      return;
    }

    setLocalSavedIds((previous) => {
      const next = new Set(previous);
      const strId = String(issueId);

      if (next.has(strId)) {
        next.delete(strId);
      } else {
        next.add(strId);
      }

      return next;
    });
  };

  const hasActiveFilters =
    selectedDiff !== 'ALL' || selectedTech.length > 0;

  // Display the remaining time as MM:SS.
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
  };

  return (
    <div className="fimmit-home-page">
      <div className="fimmit-home-page__container">
        <header className="fimmit-home-header">
          <h1 className="fimmit-home-header__title">
            Welcome,{' '}
            <span className="fimmit-title-sticker">
              {profile?.username || 'Developer'}
            </span>
          </h1>
        </header>

        <div className="fimmit-home-layout">
          <aside className="fimmit-home-sidebar">
            <FilterControls
              selectedDiff={selectedDiff}
              setSelectedDiff={setSelectedDiff}
              selectedTech={selectedTech}
              setSelectedTech={setSelectedTech}
              availableTechs={availableTechs}
              onClearAll={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>

          <main className="fimmit-home-main">
            <div className="fimmit-main-controls">
              <div className="fimmit-search-wrapper">
                <Input
                  placeholder="Search repositories, tags, or titles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {searchQuery && (
                  <button
                    className="fimmit-search-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="fimmit-sort-refresh-group">
                <select
                  className="fimmit-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort recommendations"
                >
                  <option value="BEST_MATCH">Best match</option>
                  <option value="EASIEST">Easiest first</option>
                  <option value="MEDIUM_FIRST">Medium first</option>
                  <option value="HARD_FIRST">Hard first</option>
                  <option value="TITLE_AZ">Title (A-Z)</option>
                </select>


                <Button
  variant="black"
  onClick={handleRefreshClick}
  disabled={!canRefresh || isLoading}
  aria-live="polite"
>
  {isRefreshing
    ? 'Refreshing...'
    : cooldownSeconds > 0
      ? `↻ Refresh Feed (${String(Math.floor(cooldownSeconds / 60)).padStart(2, '0')}:${String(cooldownSeconds % 60).padStart(2, '0')})`
      : '↻ Refresh Feed'}
</Button>
              </div>
            </div>

            {isLoading ? (
              <div
                style={{
                  padding: '4rem 1rem',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <LoadingState message="Fetching personalized recommendations matching your profile..." />
              </div>
            ) : error ? (
              <div style={{ padding: '2rem 1rem' }}>
                <ErrorState
                  title="Failed to load recommendations"
                  message={error}
                  onRetry={onRetry}
                />
              </div>
            ) : (
              <section
                className="fimmit-issues-grid"
                aria-live="polite"
              >
                {processedIssues.length > 0 ? (
                  processedIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      isSaved={
                        savedIssueIds?.has(String(issue.id)) ||
                        savedIssueIds?.has(issue.id)
                      }
                      onToggleSave={() => handleToggleSave(issue.id)}
                    />
                  ))
                ) : (
                  <div className="fimmit-issues-empty">
                    <h3 className="fimmit-empty-title">
                      No issues found
                    </h3>

                    <p>
                      Try adjusting your search, difficulty, or
                      technology filters to see more results.
                    </p>

                    <button
                      type="button"
                      className="fimmit-clear-link-btn"
                      onClick={handleClearFilters}
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};