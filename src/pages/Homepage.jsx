import React, { useState, useMemo } from 'react';
import { FilterControls } from '../components/recommendations/FilterControls';
import { IssueCard } from '../components/recommendations/IssueCard';
import './HomePage.css';

// EXPANDED MOCK DATA (Top 10 Repositories)
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

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiff, setSelectedDiff] = useState('ALL');
  const [selectedTech, setSelectedTech] = useState([]);
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState('BEST_MATCH'); 
  
  // NEW: Lifted state to keep track of which issue IDs are saved
  const [savedIssueIds, setSavedIssueIds] = useState(new Set());

  const availableTechs = useMemo(() => {
    const techs = new Set();
    MOCK_ISSUES.forEach(issue => issue.techStack?.forEach(t => techs.add(t)));
    return Array.from(techs).sort();
  }, []);

  const processedIssues = useMemo(() => {
    const filtered = MOCK_ISSUES.filter(issue => {
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
  }, [searchQuery, selectedDiff, selectedTech, minScore, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDiff('ALL');
    setSelectedTech([]);
    setMinScore(0);
    setSortBy('BEST_MATCH');
  };

  const handleToggleSave = (issueId) => {
    setSavedIssueIds(prev => {
      const next = new Set(prev);
      if (next.has(issueId)) {
        next.delete(issueId);
      } else {
        next.add(issueId);
      }
      return next;
    });
  };

  const hasActiveFilters = searchQuery !== '' || selectedDiff !== 'ALL' || selectedTech.length > 0 || minScore > 0 || sortBy !== 'BEST_MATCH';

  return (
    <div className="fimmit-home-page">
      <div className="fimmit-home-page__container">
        <header className="fimmit-home-header">
          <h1 className="fimmit-home-header__title">Welcome back, Developer.</h1>
          <p className="fimmit-home-header__subtitle">
            We found <strong>{processedIssues.length}</strong> open-source issues tuned to your exact tech stack and experience level today.
          </p>
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

        <section className="fimmit-issues-grid" aria-live="polite">
          {processedIssues.length > 0 ? (
            processedIssues.map(issue => (
              <IssueCard 
                key={issue.id} 
                issue={issue} 
                isSaved={savedIssueIds.has(issue.id)}
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
      </div>
    </div>
  );
};