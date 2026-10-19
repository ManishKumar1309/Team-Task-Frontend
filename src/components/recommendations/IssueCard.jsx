import React from 'react';
import { Button } from '../common/Button'; 
import { Badge } from '../common/Badge';
import { Pill } from '../common/Pill';
import './IssueCard.css';

export const IssueCard = ({ issue, isSaved, onToggleSave }) => {
  const getDifficultyColor = (diff) => {
    switch (diff?.toUpperCase()) {
      case 'EASY': return 'success';
      case 'MEDIUM': return 'yellow';
      case 'HARD': return 'error';
      default: return 'yellow';
    }
  };

  return (
    <div className="fimmit-issue-card">
      <div className="fimmit-issue-card__header">
        <div className="fimmit-issue-card__repo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          <span>{issue.repository}</span>
        </div>
        <div className="fimmit-issue-card__badges">
          <Badge variant={getDifficultyColor(issue.difficulty)}>{issue.difficulty}</Badge>
          {/* Match Score Badge has been completely removed per Requirement 5 */}
        </div>
      </div>

      <h3 className="fimmit-issue-card__title">{issue.title}</h3>
      
      <div className="fimmit-issue-card__reasons">
        <span className="fimmit-issue-card__reasons-label" style={{ fontWeight: '700', color: 'var(--text-primary, #000)', display: 'block', marginBottom: '0.25rem' }}>
          Repository description:
        </span>
        <p className="fimmit-issue-card__repo-desc" style={{ margin: 0, color: 'var(--text-secondary, #444)', lineHeight: '1.4' }}>
          {/* Fallback implemented gracefully if the backend doesn't provide a description */}
          {issue.repoDescription || 'No description provided for this repository.'}
        </p>
      </div>

      <div className="fimmit-issue-card__footer">
        <div className="fimmit-issue-card__tags">
          {issue.techStack?.map((tech) => (
            <Pill key={tech}>{tech}</Pill>
          ))}
          <Pill>{issue.issueType}</Pill>
        </div>
        
        <div className="fimmit-issue-card__actions">
          <button 
            className={`fimmit-card-save-pill ${isSaved ? 'is-saved' : ''}`}
            onClick={onToggleSave}
            aria-label={isSaved ? "Unsave issue" : "Save issue"}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-family-body, sans-serif)',
              fontSize: '0.9rem',
              fontWeight: '700',
              color: 'var(--color-black, #000)',
              backgroundColor: isSaved ? 'var(--color-cream, #F7F4EC)' : 'var(--bg-surface, #ffffff)',
              border: '2px solid var(--color-black, #000)',
              borderRadius: '9999px',
              padding: '0.35rem 1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
          
          <a href={issue.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md">View Issue →</Button>
          </a>
        </div>
      </div>
    </div>
  );
};