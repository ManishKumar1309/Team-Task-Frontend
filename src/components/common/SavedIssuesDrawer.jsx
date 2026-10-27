import React, { useEffect } from 'react';
import './SavedIssuesDrawer.css';

export const SavedIssuesDrawer = ({
  isOpen,
  onClose,
  savedRepositories = [],
  onRemove = () => { },
  saveError = '',
  onClearSaveError = null,
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

  // Build display items from savedRepositories
  const displayItems = [];
  const processedKeys = new Set();

  if (Array.isArray(savedRepositories) && savedRepositories.length > 0) {
    savedRepositories.forEach((repo) => {
      const owner = repo.owner || '';
      const name = repo.repositoryName || '';
      const key = owner && name ? `${owner}/${name}`.toLowerCase() : String(repo.id);

      if (!processedKeys.has(key)) {
        processedKeys.add(key);
        if (repo.id) processedKeys.add(String(repo.id));
        if (repo.githubRepositoryId) processedKeys.add(String(repo.githubRepositoryId));

        displayItems.push({
          id: repo.id || key,
          repo: owner && name ? `${owner}/${name}` : name || 'Repository',
          badge: 'Repository',
          title: repo.description || 'Saved repository',
          url: repo.repositoryUrl || (owner && name ? `https://github.com/${owner}/${name}` : 'https://github.com'),
          isRepo: true,
          // DB record ID for deletion
          databaseRecordId: repo.id || null,
        });
      }
    });
  }

  return (
    <div className="fimmit-drawer-overlay" onClick={onClose}>
      <div
        className="fimmit-drawer-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="fimmit-drawer-header">
          <h2>Saved Repositories</h2>

          <button
            type="button"
            className="fimmit-drawer-close-btn"
            onClick={onClose}
            aria-label="Close saved repositories"
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
          {/* Limitation notice explaining that backend API saves at repository level */}
          {/* <div className="fimmit-drawer-limitation-notice">
            <span className="fimmit-drawer-limitation-badge">Repository Level</span>
            <p>
              Bookmarks are saved via <code>/api/saved-repositories</code>. Individual issue bookmarking is not supported by the backend.
            </p>
          </div> */}

          {/* Error alert if a save or delete failed */}
          {saveError && (
            <div className="fimmit-drawer-error-alert" role="alert">
              <span>{saveError}</span>
              {onClearSaveError && (
                <button
                  type="button"
                  onClick={onClearSaveError}
                  className="fimmit-drawer-error-close"
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {displayItems.length === 0 ? (
            <p className="fimmit-drawer-empty-state">
              Nothing saved yet. Hit "Save issue" on any card to bookmark its repository here.
            </p>
          ) : (
            <div className="fimmit-drawer-list">
              {displayItems.map((item) => (
                <div key={item.id} className="fimmit-drawer-card">
                  <div className="fimmit-drawer-card-repo">
                    {item.repo} {item.badge && <span>({item.badge})</span>}
                  </div>

                  <h4 className="fimmit-drawer-card-title">
                    {item.title}
                  </h4>

                  <div className="fimmit-drawer-card-actions">
                    <a
                      href={item.url}
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
                      Open repository
                    </a>

                    <button
                      type="button"
                      className="fimmit-drawer-btn-remove"
                      onClick={() => onRemove(item.databaseRecordId || item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedIssuesDrawer;