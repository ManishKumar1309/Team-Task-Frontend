import React, { useEffect, useRef } from 'react';
import './SavedIssuesDrawer.css';

/**
 * Helper to safely extract or format the issue number without generating fake values.
 */
function getDisplayIssueNumber(issue) {
  if (!issue) return null;
  if (issue.issueNumber) {
    return issue.issueNumber.startsWith('#') ? issue.issueNumber : `#${issue.issueNumber}`;
  }
  if (issue.url) {
    const match = issue.url.match(/\/issues\/(\d+)/);
    if (match) return `#${match[1]}`;
  }
  if (issue.id && !isNaN(issue.id)) {
    return `#${issue.id}`;
  }
  return null;
}

/**
 * Reusable Right-Side Saved Issues Drawer conforming to Fimmit's bold editorial design.
 */
export const SavedIssuesDrawer = ({
  isOpen = false,
  onClose,
  savedIssues = [],
  onRemove,
}) => {
  const drawerRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  // Manage body scroll lock and keyboard events (Escape to close)
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement;

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose?.();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Focus close button inside drawer for accessibility
      const closeBtn = drawerRef.current?.querySelector('.fimmit-saved-drawer__close-btn');
      if (closeBtn) {
        closeBtn.focus();
      }

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        if (previouslyFocusedElementRef.current && typeof previouslyFocusedElementRef.current.focus === 'function') {
          previouslyFocusedElementRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  return (
    <>
      {/* Background Dimmed Overlay */}
      <div
        className={`fimmit-drawer-overlay ${isOpen ? 'fimmit-drawer-overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Right Side Drawer */}
      <aside
        ref={drawerRef}
        className={`fimmit-saved-drawer ${isOpen ? 'fimmit-saved-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fimmit-saved-drawer-heading"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="fimmit-saved-drawer__header">
          <h2 id="fimmit-saved-drawer-heading" className="fimmit-saved-drawer__title">
            Saved
          </h2>
          <button
            type="button"
            className="fimmit-saved-drawer__close-btn"
            onClick={onClose}
            aria-label="Close saved drawer"
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="fimmit-saved-drawer__body">
          {(!savedIssues || savedIssues.length === 0) ? (
            <div className="fimmit-saved-drawer__empty">
              <p className="fimmit-saved-drawer__empty-text">
                Nothing saved yet. Hit &quot;Save issue&quot; on any card to keep it here.
              </p>
            </div>
          ) : (
            <div className="fimmit-saved-cards-list">
              {savedIssues.map((issue, index) => {
                const stableKey = String(issue.id || issue.url || index);
                const issueNumber = getDisplayIssueNumber(issue);
                const hasValidUrl = Boolean(issue.url && issue.url !== '#');

                return (
                  <div key={stableKey} className="fimmit-saved-card">
                    <div className="fimmit-saved-card__header">
                      <span className="fimmit-saved-card__repo" title={issue.repository}>
                        {issue.repository || 'Unknown repository'}
                      </span>
                      {issueNumber && (
                        <span className="fimmit-saved-card__number" aria-label={`Issue ${issueNumber}`}>
                          {issueNumber}
                        </span>
                      )}
                    </div>

                    <h4 className="fimmit-saved-card__title" title={issue.title}>
                      {issue.title || 'Untitled Issue'}
                    </h4>

                    <div className="fimmit-saved-card__actions">
                      {hasValidUrl ? (
                        <a
                          href={issue.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="fimmit-saved-card__open-btn"
                          aria-label={`Open issue ${issue.title} in new tab`}
                        >
                          <span>Open issue</span>
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
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="fimmit-saved-card__open-btn is-disabled"
                          aria-label="Issue link unavailable"
                        >
                          <span>Open issue</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="fimmit-saved-card__remove-btn"
                        onClick={() => onRemove?.(issue)}
                        aria-label={`Remove issue ${issue.title} from saved list`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
