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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          <span>{issue.repository}</span>
        </div>
        <div className="fimmit-issue-card__badges">
          <Badge variant={getDifficultyColor(issue.difficulty)}>{issue.difficulty}</Badge>
          <Badge variant="orange">{Math.round(issue.matchScore * 100)}% match</Badge>
        </div>
      </div>

      <h3 className="fimmit-issue-card__title">{issue.title}</h3>
      
      <div className="fimmit-issue-card__reasons">
        <span className="fimmit-issue-card__reasons-label">Why this matches you:</span>
        <ul className="fimmit-issue-card__reasons-list">
          {issue.reasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      </div>

      <div className="fimmit-issue-card__footer">
        <div className="fimmit-issue-card__tags">
          {issue.techStack?.map((tech) => (
            <Pill key={tech}>{tech}</Pill>
          ))}
          <Pill>{issue.issueType}</Pill>
        </div>
        
        <div className="fimmit-issue-card__actions">
          <Button 
            variant={isSaved ? "black" : "outline"} 
            size="md"
            onClick={onToggleSave}
            aria-label={isSaved ? "Unsave issue" : "Save issue"}
          >
            {isSaved ? '🔖 Saved' : '🔖 Save'}
          </Button>
          <a href={issue.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md">View Issue →</Button>
          </a>
        </div>
      </div>
    </div>
  );
};