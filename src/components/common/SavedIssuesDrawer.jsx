import React, { useEffect } from 'react';
import './SavedIssuesDrawer.css';

// Keep these IDs and URLs consistent with the issue data in HomePage.jsx.
const ISSUE_DETAILS = {
  '101': {
    repo: 'reactjs/react.dev',
    issueNum: '#6120',
    title: 'Fix broken sandbox in useDeferredValue docs',
    url: 'https://github.com/reactjs/react.dev/issues/6120',
  },
  '102': {
    repo: 'vercel/next.js',
    issueNum: '#70210',
    title: 'Fix hydration mismatch warning on SSR text nodes',
    url: 'https://github.com/vercel/next.js/issues/70210',
  },
  '103': {
    repo: 'facebook/react',
    issueNum: '#28910',
    title: 'Improve error messages for invalid hook usage',
    url: 'https://github.com/facebook/react/issues/28910',
  },
  '104': {
    repo: 'expressjs/express',
    issueNum: '#5900',
    title: 'Add tests for middleware error handling',
    url: 'https://github.com/expressjs/express/issues/5900',
  },
  '105': {
    repo: 'nodejs/node',
    issueNum: '#55000',
    title: 'Improve documentation for asynchronous APIs',
    url: 'https://github.com/nodejs/node/issues/55000',
  },
  '106': {
    repo: 'jestjs/jest',
    issueNum: '#15000',
    title: 'Clarify test timeout configuration documentation',
    url: 'https://github.com/jestjs/jest/issues/15000',
  },
  '107': {
    repo: 'vitejs/vite',
    issueNum: '#19000',
    title: 'Improve error output for failed module resolution',
    url: 'https://github.com/vitejs/vite/issues/19000',
  },
  '108': {
    repo: 'sveltejs/svelte',
    issueNum: '#12000',
    title: 'Improve accessibility warnings in component diagnostics',
    url: 'https://github.com/sveltejs/svelte/issues/12000',
  },
  '109': {
    repo: 'prettier/prettier',
    issueNum: '#17000',
    title: 'Add regression tests for formatting edge cases',
    url: 'https://github.com/prettier/prettier/issues/17000',
  },
  '110': {
    repo: 'axios/axios',
    issueNum: '#6500',
    title: 'Clarify request cancellation examples',
    url: 'https://github.com/axios/axios/issues/6500',
  },
};

export const SavedIssuesDrawer = ({
  isOpen,
  onClose,
  savedIssueIds = [],
  onRemove = () => {},
}) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fimmit-drawer-overlay" onClick={onClose}>
      <div
        className="fimmit-drawer-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="fimmit-drawer-header">
          <h2>Saved</h2>

          <button
            type="button"
            className="fimmit-drawer-close-btn"
            onClick={onClose}
            aria-label="Close saved issues"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </button>
        </div>

        <div className="fimmit-drawer-content">
          {savedIssueIds.length === 0 ? (
            <p className="fimmit-drawer-empty-state">
              Nothing saved yet. Hit "Save issue" on any card to keep it here.
            </p>
          ) : (
            <div className="fimmit-drawer-list">
              {savedIssueIds.map((id) => {
                const issue = ISSUE_DETAILS[String(id)];

                return (
                  <div key={id} className="fimmit-drawer-card">
                    {issue ? (
                      <>
                        <div className="fimmit-drawer-card-repo">
                          {issue.repo} <span>{issue.issueNum}</span>
                        </div>

                        <h4 className="fimmit-drawer-card-title">
                          {issue.title}
                        </h4>

                        <div className="fimmit-drawer-card-actions">
                          <a
                            href={issue.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fimmit-drawer-btn-open"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            Open issue
                          </a>

                          <button
                            type="button"
                            className="fimmit-drawer-btn-remove"
                            onClick={() => onRemove(id)}
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>
                          Issue #{String(id)} — issue details are not available
                          in the current mock data.
                        </p>

                        <button
                          type="button"
                          className="fimmit-drawer-btn-remove"
                          onClick={() => onRemove(id)}
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedIssuesDrawer;