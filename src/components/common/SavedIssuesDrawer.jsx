import React, { useEffect } from 'react';
import './SavedIssuesDrawer.css';

export const SavedIssuesDrawer = ({ isOpen, onClose, savedIssueIds = [], onRemove }) => {
  
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent scrolling on the body when the drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Mock mapping to get issue details based on the saved ID.
  // In production, you would fetch these from your backend or a global store.
  const getIssueDetails = (id) => ({
    id,
    repo: 'reactjs/react.dev',
    issueNum: '#6120',
    title: 'Fix broken sandbox in useDeferredValue docs'
  });

  return (
    <div className="fimmit-drawer-overlay" onClick={onClose}>
      <div 
        className="fimmit-drawer-panel" 
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside drawer from closing it
      >
        
        {/* Drawer Header */}
        <div className="fimmit-drawer-header">
          <h2>Saved</h2>
          <button className="fimmit-drawer-close-btn" onClick={onClose} aria-label="Close drawer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="fimmit-drawer-content">
          {savedIssueIds.length === 0 ? (
            <p className="fimmit-drawer-empty-state">
              Nothing saved yet. Hit "Save issue" on any card to keep it here.
            </p>
          ) : (
            <div className="fimmit-drawer-list">
              {savedIssueIds.map((id) => {
                const issue = getIssueDetails(id);
                return (
                  <div key={id} className="fimmit-drawer-card">
                    <div className="fimmit-drawer-card-repo">
                      {issue.repo} <span>{issue.issueNum}</span>
                    </div>
                    <h4 className="fimmit-drawer-card-title">{issue.title}</h4>
                    
                    <div className="fimmit-drawer-card-actions">
                      <button className="fimmit-drawer-btn-open">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        Open issue
                      </button>
                      <button 
                        className="fimmit-drawer-btn-remove" 
                        onClick={() => onRemove(id)}
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
        
      </div>
    </div>
  );
};

export default SavedIssuesDrawer;