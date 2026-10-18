import React, { useState } from 'react';
import { FilterControls } from '../components/recommendations/FilterControls';
import { IssueCard } from '../components/recommendations/IssueCard';
import './HomePage.css';

// MOCK DATA for local UI development
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
    techStack: ["React", "TypeScript", "Next.js"]
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
  }
];

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiff, setSelectedDiff] = useState('ALL');

  // Basic mock filtering
  const filteredIssues = MOCK_ISSUES.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          issue.repository.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = selectedDiff === 'ALL' || issue.difficulty === selectedDiff;
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="fimmit-home-page">
      <div className="fimmit-home-page__container">
        
        <header className="fimmit-home-header">
          <h1 className="fimmit-home-header__title">Welcome back, Developer.</h1>
          <p className="fimmit-home-header__subtitle">
            We found <strong>{MOCK_ISSUES.length}</strong> new open-source issues tuned to your exact tech stack and experience level today.
          </p>
        </header>

        <FilterControls 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDiff={selectedDiff}
          setSelectedDiff={setSelectedDiff}
        />

        <section className="fimmit-issues-grid">
          {filteredIssues.length > 0 ? (
            filteredIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))
          ) : (
            <div className="fimmit-issues-empty">
              <p>No issues match your current filters. Try clearing them.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};