import React, { useState } from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import { FALLBACK_ISSUES } from '../services/recommendationService';
import './Homepage.css';

function matchLanguageTag(tag, lang) {
  const t = String(tag || '').trim().toLowerCase();
  const l = String(lang || '').trim().toLowerCase();
  if (t === l) return true;
  if ((l === 'js' || l === 'javascript') && (t === 'js' || t === 'javascript')) return true;
  if ((l === 'ts' || l === 'typescript') && (t === 'ts' || t === 'typescript')) return true;
  if ((l === 'node' || l === 'node.js') && (t === 'node' || t === 'node.js')) return true;
  if ((l === 'c++' || l === 'cpp') && (t === 'c++' || t === 'cpp')) return true;
  return false;
}

export const HomePage = ({
  savedIssueIds = new Set(),
  onToggleSave = () => {},
  username = 'demo-developer',
  saveError = '',
  onClearSaveError = null,
  isError: propIsError = false,
  issues: propIssues = null,
  isLoading: propIsLoading = null,
  error: propError = null,
  onRetry = null,
}) => {
  const [activeLang, setActiveLang] = useState('');

  const [diffFilters, setDiffFilters] = useState({
    easy: false,
    medium: false,
    hard: false,
  });

  const {
    issues: fetchedIssues,
    isLoading: recLoading,
    error: recError,
    blockedByAuth,
    reload,
  } = useRecommendations();

  const [showSamplePreview, setShowSamplePreview] = useState(false);

  const issuesList = propIssues !== null
    ? propIssues
    : showSamplePreview
    ? FALLBACK_ISSUES
    : (Array.isArray(fetchedIssues) ? fetchedIssues : []);

  const isLoading = propIsLoading !== null ? propIsLoading : recLoading;
  const isErrorState = propIsError || Boolean(propError || recError);
  const errorMessage = propError || recError;

  const toggleDiff = (level) => {
    setDiffFilters((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  const isSaved = (issue) => {
    if (!issue) return false;
    const id = typeof issue === 'object' ? String(issue.id) : String(issue);
    const repo = typeof issue === 'object' ? (issue.repo || issue.repository || (issue.owner && (issue.repositoryName || issue.repoName) ? `${issue.owner}/${issue.repositoryName || issue.repoName}` : '')) : '';
    const repoLower = repo.toLowerCase();
    const issueNum = typeof issue === 'object' ? String(issue.issueNum || issue.issueNumber || '').toLowerCase().replace(/^#/, '') : '';
    const issueUrl = typeof issue === 'object' ? String(issue.url || '').toLowerCase() : '';

    const checkMatch = (s) => {
      if (!s) return false;
      const str = String(s).toLowerCase();
      if (str === id.toLowerCase()) return true;
      if (repoLower && str === repoLower) return true;
      if (issueNum && (str === issueNum || str === `#${issueNum}`)) return true;
      if (issueUrl && str === issueUrl) return true;
      return false;
    };

    if (savedIssueIds instanceof Set) {
      if (savedIssueIds.has(id) || savedIssueIds.has(id.toLowerCase())) return true;
      if (repo && (savedIssueIds.has(repo) || savedIssueIds.has(repoLower))) return true;
      for (const item of savedIssueIds) {
        if (checkMatch(item)) return true;
      }
      return false;
    }

    if (Array.isArray(savedIssueIds)) {
      return savedIssueIds.some(checkMatch);
    }

    return false;
  };

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

  const visibleIssues = issuesList.filter((issue) => {
    const issueTags = Array.isArray(issue.tags)
      ? issue.tags
      : Array.isArray(issue.techStack)
      ? issue.techStack
      : [];

    const issueLang = String(issue.language || issue.repoLanguage || '').toLowerCase();

    const languageMatches =
      !activeLang ||
      issueTags.some((tag) => matchLanguageTag(tag, activeLang)) ||
      (issueLang && matchLanguageTag(issueLang, activeLang));

    const issueDiff = String(issue.difficulty || 'medium').toLowerCase();
    const difficultyMatches =
      selectedDifficulties.length === 0 ||
      selectedDifficulties.includes(issueDiff);

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
          {isLoading && issuesList.length === 0 ? (
            <div className="fimmit-feed-loading" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
              <p style={{ fontWeight: '800', fontSize: '1.125rem', color: '#000', margin: '0 0 0.5rem' }}>
                Curating your recommendations...
              </p>
              <p style={{ color: '#444', fontSize: '0.875rem', margin: 0 }}>
                Matching top open-source issues to your tech stack and experience level.
              </p>
            </div>
          ) : isErrorState && issuesList.length === 0 ? (
            <div className="fimmit-feed-error">
              <p className="fimmit-feed-error-text">
                {blockedByAuth
                  ? 'Authentication required: Backend recommendations (POST /api/recommendations) require a valid login session.'
                  : (errorMessage || 'There was an error while fetching recommendations from the backend.')}
                <br />
                {blockedByAuth
                  ? 'Since GitHub login is currently unavailable, live recommendations cannot be retrieved.'
                  : 'Please check your connection and try again.'}
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
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="fimmit-card-btn-open"
                  style={{ cursor: 'pointer' }}
                  onClick={() => (onRetry ? onRetry() : reload())}
                >
                  ↻ Retry backend request
                </button>
                {blockedByAuth && (
                  <button
                    type="button"
                    className="fimmit-card-btn-open"
                    style={{ cursor: 'pointer', backgroundColor: '#f0f0f0', borderColor: '#333' }}
                    onClick={() => setShowSamplePreview(true)}
                  >
                    Preview with sample issues
                  </button>
                )}
              </div>
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

              {saveError && (
                <div
                  className="fimmit-save-error-toast"
                  role="alert"
                  style={{
                    backgroundColor: '#FEE2E2',
                    border: '1.5px solid #EF4444',
                    color: '#991B1B',
                    padding: '0.65rem 1rem',
                    borderRadius: '8px',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  }}
                >
                  <span>{saveError}</span>
                  {onClearSaveError && (
                    <button
                      type="button"
                      onClick={onClearSaveError}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#991B1B',
                        cursor: 'pointer',
                        fontWeight: 800,
                        padding: '0 0.25rem',
                        fontSize: '1rem',
                      }}
                      aria-label="Dismiss error"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}

              <div className="fimmit-feed-list">
                {visibleIssues.slice(0, 10).map((issue) => {
                  const saved = isSaved(issue);
                  const issueDifficulty = String(issue.difficulty || 'medium').toLowerCase();
                  const issueTags = Array.isArray(issue.tags)
                    ? issue.tags
                    : Array.isArray(issue.techStack)
                    ? issue.techStack
                    : [];

                  return (
                    <article key={issue.id} className="fimmit-feed-card">
                      <div className="fimmit-card-header">
                        <div className="fimmit-card-repo">
                          <span>{issue.repo || issue.repository}</span>
                          {issue.stars && (
                            <span className="fimmit-card-star">
                              ★ {issue.stars}
                            </span>
                          )}
                        </div>

                        <span
                          className={`fimmit-card-difficulty fimmit-diff-${issueDifficulty}`}
                        >
                          {issueDifficulty}
                        </span>
                      </div>

                      <h2 className="fimmit-card-title">
                        {issue.title || (issue.issueNum || issue.issueNumber ? `Issue ${issue.issueNum || issue.issueNumber}` : '')}{' '}
                        {issue.title && (issue.issueNum || issue.issueNumber) && (
                          <span className="fimmit-card-issue-num">
                            {issue.issueNum || issue.issueNumber}
                          </span>
                        )}
                      </h2>

                      {issueTags.length > 0 && (
                        <div className="fimmit-card-tags">
                          {issueTags.map((tag) => (
                            <span key={tag} className="fimmit-card-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

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
                          onClick={() => onToggleSave(issue)}
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

                          {saved ? 'Saved' : 'Save Issue'}
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