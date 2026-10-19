import React, { useState, useMemo } from 'react';
import { FilterControls } from '../components/recommendations/FilterControls';
import { IssueCard } from '../components/recommendations/IssueCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { useRecommendations } from '../hooks/useRecommendations';
import './HomePage.css';

// EXPANDED MOCK DATA (Top 10 Repositories as safe fallback)
const MOCK_ISSUES = [
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

export const HomePage = ({
  savedIssueIds: propSavedIssueIds,
  onToggleSave: propToggleSave,
  issues: propIssues,
  isLoading: propIsLoading,
  error: propError,
  onRetry: propOnRetry,
}) => {
  // Fetch real/mock recommendations from API service layer
  const recData = useRecommendations();

  const issues = propIssues !== undefined ? propIssues : recData.issues;
  const isLoading = propIsLoading !== undefined ? propIsLoading : recData.isLoading;
  const error = propError !== undefined ? propError : recData.error;
  const onRetry = propOnRetry || recData.reload;
  const { refreshFeed, isRefreshing, profile } = recData;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiff, setSelectedDiff] = useState('ALL');
  const [selectedTech, setSelectedTech] = useState([]);
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState('BEST_MATCH'); 
  
  // Local fallback if not supplied via props
  const [localSavedIds, setLocalSavedIds] = useState(new Set());
  const savedIssueIds = propSavedIssueIds || localSavedIds;

  // Use fetched issues from endpoint, fallback to MOCK_ISSUES if empty & not loading/error
  const baseIssues = useMemo(() => {
    if (issues && issues.length > 0) return issues;
    if (isLoading || error) return [];
    return MOCK_ISSUES;
  }, [issues, isLoading, error]);

  const availableTechs = useMemo(() => {
    const techs = new Set();
    baseIssues.forEach(issue => issue.techStack?.forEach(t => techs.add(t)));
    return Array.from(techs).sort();
  }, [baseIssues]);

  const processedIssues = useMemo(() => {
    const filtered = baseIssues.filter(issue => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = issue.title.toLowerCase().includes(searchLower) || 
                            issue.repository.toLowerCase().includes(searchLower);
      const matchesDiff = selectedDiff === 'ALL' || issue.difficulty === selectedDiff;
      const matchesTech = selectedTech.length === 0 || 
                          selectedTech.some(tech => issue.techStack?.includes(tech));
      const matchesScore = issue.matchScore >= minScore;

      return matchesSearch && matchesDiff && matchesTech && matchesScore;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'BEST_MATCH') {
        return b.matchScore - a.matchScore; 
      } else if (sortBy === 'EASIEST') {
        const diffMap = { 'EASY': 1, 'MEDIUM': 2, 'HARD': 3 };
        return (diffMap[a.difficulty] || 99) - (diffMap[b.difficulty] || 99);
      } else if (sortBy === 'MEDIUM_FIRST') {
        const diffMap = { 'MEDIUM': 1, 'EASY': 2, 'HARD': 3 };
        return (diffMap[a.difficulty] || 99) - (diffMap[b.difficulty] || 99);
      } else if (sortBy === 'HARD_FIRST') {
        const diffMap = { 'HARD': 1, 'MEDIUM': 2, 'EASY': 3 };
        return (diffMap[a.difficulty] || 99) - (diffMap[b.difficulty] || 99);
      } else if (sortBy === 'TITLE_AZ') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [baseIssues, searchQuery, selectedDiff, selectedTech, minScore, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDiff('ALL');
    setSelectedTech([]);
    setMinScore(0);
    setSortBy('BEST_MATCH');
  };

  const handleToggleSave = (issueId) => {
    if (propToggleSave) {
      propToggleSave(issueId);
      return;
    }
    setLocalSavedIds(prev => {
      const next = new Set(prev);
      const strId = String(issueId);
      if (next.has(strId)) {
        next.delete(strId);
      } else {
        next.add(strId);
      }
      return next;
    });
  };

  const hasActiveFilters = searchQuery !== '' || selectedDiff !== 'ALL' || selectedTech.length > 0 || minScore > 0 || sortBy !== 'BEST_MATCH';

  return (
    <div className="fimmit-home-page">
      <div className="fimmit-home-page__container">
        <header className="fimmit-home-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="fimmit-home-header__title">
              Welcome back{profile?.username ? `, ${profile.username}` : ', Developer'}.
            </h1>
            <p className="fimmit-home-header__subtitle">
              We found <strong>{processedIssues.length}</strong> open-source issues tuned to your exact tech stack and experience level today.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshFeed}
            disabled={isRefreshing || isLoading}
            aria-label="Refresh recommendation feed"
          >
            {isRefreshing ? 'Refreshing...' : '↻ Refresh feed'}
          </Button>
        </header>

        <FilterControls 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDiff={selectedDiff}
          setSelectedDiff={setSelectedDiff}
          selectedTech={selectedTech}
          setSelectedTech={setSelectedTech}
          availableTechs={availableTechs}
          minScore={minScore}
          setMinScore={setMinScore}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onClearAll={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {isLoading ? (
          <div style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
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
          <section className="fimmit-issues-grid" aria-live="polite">
            {processedIssues.length > 0 ? (
              processedIssues.map(issue => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue} 
                  isSaved={savedIssueIds?.has(String(issue.id)) || savedIssueIds?.has(issue.id)}
                  onToggleSave={() => handleToggleSave(issue.id)}
                />
              ))
            ) : (
              <div className="fimmit-issues-empty">
                <h3 className="fimmit-empty-title">No issues found</h3>
                <p>Try adjusting your search, difficulty, or technology filters to see more results.</p>
                <button type="button" className="fimmit-clear-link-btn" onClick={handleClearFilters}>
                  Clear all filters
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};