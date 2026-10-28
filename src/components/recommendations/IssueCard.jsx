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
        </div>
      </div>

      <h3 className="fimmit-issue-card__title">{issue.title}</h3>

      <div className="fimmit-issue-card__reasons">
        <span className="fimmit-issue-card__reasons-label" style={{ fontWeight: '700', color: 'var(--text-primary, #000)', display: 'block', marginBottom: '0.25rem' }}>
          Repository description:
        </span>
        <p className="fimmit-issue-card__repo-desc" style={{ margin: 0, color: 'var(--text-secondary, #444)', lineHeight: '1.4' }}>
          {issue.repoDescription || 'No description provided for this repository.'}
        </p>
      </div>

      <div className="fimmit-issue-card__footer">
        <div className="fimmit-issue-card__tags">
          {issue.techStack?.map((tech) => (
            <Pill key={tech}>{tech}</Pill>
          ))}
          {issue.issueType && <Pill>{issue.issueType}</Pill>}
        </div>

        <div className="fimmit-issue-card__actions">
          <button
            type="button"
            className={`fimmit-card-save-btn ${isSaved ? 'is-saved' : ''}`}
            onClick={() => onToggleSave?.(issue)}
            aria-label={isSaved ? "Unsave issue" : "Save Issue"}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isSaved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>{isSaved ? 'Saved' : 'Save Issue'}</span>
          </button>

          <a href={issue.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md">View Issue →</Button>
          </a>
        </div>
      </div>
    </div>
  );
};