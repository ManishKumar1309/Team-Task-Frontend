import React, { useState } from 'react';
import './Homepage.css';

export const HomePage = ({
  savedIssueIds = new Set(),
  onToggleSave = () => {},
  username = 'demo-developer',
  isError = false,
}) => {
  const [activeLang, setActiveLang] = useState('');

  const [diffFilters, setDiffFilters] = useState({
    easy: false,
    medium: false,
    hard: false,
  });

  const toggleDiff = (level) => {
    setDiffFilters((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  const isSaved = (id) => {
    if (savedIssueIds instanceof Set) {
      return savedIssueIds.has(String(id)) || savedIssueIds.has(id);
    }

    if (Array.isArray(savedIssueIds)) {
      return savedIssueIds.some(
        (savedId) => String(savedId) === String(id)
      );
    }

    return false;
  };

  const issues = [
    {
      id: 101,
      repo: 'reactjs/react.dev',
      stars: '1k',
      title: 'Fix broken sandbox in useDeferredValue docs',
      issueNum: '#6120',
      tags: ['JS', 'react', 'docs'],
      matchDesc: 'Good first issue with a clear fix and active maintainers',
      difficulty: 'hard',
      url: 'https://github.com/reactjs/react.dev/issues/6120',
    },
    {
      id: 102,
      repo: 'vercel/next.js',
      stars: '130k',
      title: 'Fix hydration mismatch warning on SSR text nodes',
      issueNum: '#70210',
      tags: ['JS', 'React', 'SSR'],
      matchDesc: 'Relevant to React and server-side rendering',
      difficulty: 'medium',
      url: 'https://github.com/vercel/next.js/issues/70210',
    },
    {
      id: 103,
      repo: 'facebook/react',
      stars: '230k',
      title: 'Improve error messages for invalid hook usage',
      issueNum: '#28910',
      tags: ['JS', 'React', 'debugging'],
      matchDesc: 'A useful issue for learning React internals',
      difficulty: 'medium',
      url: 'https://github.com/facebook/react/issues/28910',
    },
    {
      id: 104,
      repo: 'expressjs/express',
      stars: '65k',
      title: 'Add tests for middleware error handling',
      issueNum: '#5900',
      tags: ['JS', 'Express', 'tests'],
      matchDesc: 'Test-focused task with a clear scope',
      difficulty: 'easy',
      url: 'https://github.com/expressjs/express/issues',
    },
    {
      id: 105,
      repo: 'nodejs/node',
      stars: '110k',
      title: 'Improve documentation for asynchronous APIs',
      issueNum: '#55000',
      tags: ['JS', 'Node.js', 'docs'],
      matchDesc: 'Good opportunity to contribute to Node.js',
      difficulty: 'easy',
      url: 'https://github.com/nodejs/node/issues',
    },
    {
      id: 106,
      repo: 'jestjs/jest',
      stars: '44k',
      title: 'Clarify test timeout configuration documentation',
      issueNum: '#15000',
      tags: ['JS', 'Jest', 'docs'],
      matchDesc: 'Documentation improvement with a focused scope',
      difficulty: 'easy',
      url: 'https://github.com/jestjs/jest/issues',
    },
    {
      id: 107,
      repo: 'vitejs/vite',
      stars: '70k',
      title: 'Improve error output for failed module resolution',
      issueNum: '#19000',
      tags: ['JS', 'Vite', 'debugging'],
      matchDesc: 'Explore module resolution and development tooling',
      difficulty: 'medium',
      url: 'https://github.com/vitejs/vite/issues',
    },
    {
      id: 108,
      repo: 'sveltejs/svelte',
      stars: '80k',
      title: 'Improve accessibility warnings in component diagnostics',
      issueNum: '#12000',
      tags: ['JS', 'Svelte', 'accessibility'],
      matchDesc: 'Contribute to clearer accessibility feedback',
      difficulty: 'medium',
      url: 'https://github.com/sveltejs/svelte/issues',
    },
    {
      id: 109,
      repo: 'prettier/prettier',
      stars: '50k',
      title: 'Add regression tests for formatting edge cases',
      issueNum: '#17000',
      tags: ['JS', 'tests', 'formatting'],
      matchDesc: 'A test-driven contribution to developer tooling',
      difficulty: 'hard',
      url: 'https://github.com/prettier/prettier/issues',
    },
    {
      id: 110,
      repo: 'axios/axios',
      stars: '105k',
      title: 'Clarify request cancellation examples',
      issueNum: '#6500',
      tags: ['JS', 'HTTP', 'docs'],
      matchDesc: 'Explore HTTP requests and cancellation behavior',
      difficulty: 'easy',
      url: 'https://github.com/axios/axios/issues',
    },
  ];

  const languages = [
    'C++',
    'Python',
    'JS',
    'Rust',
    'React',
    'TypeScript',
    'Java',
    'Go',
    'Node.js',
    'Ruby',
  ];

  const difficulties = ['easy', 'medium', 'hard'];

  const selectedDifficulties = difficulties.filter(
    (level) => diffFilters[level]
  );

  const visibleIssues = issues.filter((issue) => {
    const languageMatches =
      !activeLang ||
      issue.tags.some(
        (tag) => tag.toLowerCase() === activeLang.toLowerCase()
      );

    const difficultyMatches =
      selectedDifficulties.length === 0 ||
      selectedDifficulties.includes(issue.difficulty);

    return languageMatches && difficultyMatches;
  });

  return (
    <div className="fimmit-home-wrapper">
      <div className="fimmit-home-container">
        <aside className="fimmit-home-sidebar">
          <section className="fimmit-sidebar-box">
            <h3 className="fimmit-sidebar-title">Language priority</h3>

            <div className="fimmit-sidebar-pills">
              {languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`fimmit-sidebar-pill ${
                    activeLang === lang ? 'active' : ''
                  }`}
                  aria-pressed={activeLang === lang}
                  onClick={() =>
                    setActiveLang((current) =>
                      current === lang ? '' : lang
                    )
                  }
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="fimmit-clear-filter"
              onClick={() => setActiveLang('')}
              disabled={!activeLang}
            >
              Clear filter
            </button>
          </section>

          <section className="fimmit-sidebar-box">
            <h3 className="fimmit-sidebar-title">Difficulty</h3>

            <div className="fimmit-sidebar-checkboxes">
              {difficulties.map((level) => (
                <label key={level} className="fimmit-checkbox-row">
                  <input
                    type="checkbox"
                    checked={diffFilters[level]}
                    onChange={() => toggleDiff(level)}
                  />

                  <span
                    className={`fimmit-checkbox ${level}`}
                    aria-hidden="true"
                  />

                  <span className="fimmit-checkbox-label">
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </span>
                </label>
              ))}
            </div>

            <p className="fimmit-sidebar-note">
              None checked shows every issue in model rank order.
            </p>
          </section>
        </aside>

        <main className="fimmit-home-feed">
          {isError ? (
            <div className="fimmit-feed-error">
              <p className="fimmit-feed-error-text">
                There was an error while fetching the issues.
                <br />
                Please try again in a few seconds
                <span className="fimmit-error-icon">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="#E8614F"
                    stroke="#000000"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="8.5" cy="9.5" r="1.5" fill="#000000" stroke="none" />
                    <circle cx="15.5" cy="9.5" r="1.5" fill="#000000" stroke="none" />
                    <path
                      d="M8 15.5c1.5-2 4.5-2 6 0"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </p>
            </div>
          ) : (
            <>
              <h1 className="fimmit-home-headline">
                <span>Welcome</span>
                <span className="fimmit-home-banner-wrapper">
                  <span className="fimmit-home-orange-banner">
                    {username || 'Contributor'}
                  </span>
                </span>
              </h1>

              <div className="fimmit-feed-list">
                {visibleIssues.slice(0, 10).map((issue) => {
                  const saved = isSaved(issue.id);

                  return (
                    <article key={issue.id} className="fimmit-feed-card">
                      <div className="fimmit-card-header">
                        <div className="fimmit-card-repo">
                          <span>{issue.repo}</span>
                          <span className="fimmit-card-star">
                            ★ {issue.stars}
                          </span>
                        </div>

                        <span
                          className={`fimmit-card-difficulty fimmit-diff-${issue.difficulty}`}
                        >
                          {issue.difficulty}
                        </span>
                      </div>

                      <h2 className="fimmit-card-title">
                        {issue.title}{' '}
                        <span className="fimmit-card-issue-num">
                          {issue.issueNum}
                        </span>
                      </h2>

                      <div className="fimmit-card-tags">
                        {issue.tags.map((tag) => (
                          <span key={tag} className="fimmit-card-tag">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {issue.matchDesc && (
                        <p className="fimmit-match-desc">
                          {issue.matchDesc}
                        </p>
                      )}

                      <div className="fimmit-card-actions">
                        <a
                          href={issue.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="fimmit-card-btn-open"
                        >
                          ↗ Open issue
                        </a>

                        <button
                          type="button"
                          className="fimmit-card-btn-saved"
                          aria-pressed={saved}
                          onClick={() => onToggleSave(issue.id)}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={saved ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4V4.5Z" />
                          </svg>

                          {saved ? 'Saved' : 'Save issue'}
                        </button>
                      </div>
                    </article>
                  );
                })}

                {visibleIssues.length === 0 && (
                  <p className="fimmit-home-empty">
                    No issues match these filters.
                  </p>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;