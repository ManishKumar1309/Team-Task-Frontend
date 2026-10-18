import React from 'react';
import { Button } from './Button';
import './EmptyState.css';

/**
 * Reusable EmptyState component conforming to the Fimmit design system.
 * Renders a friendly empty state message with an optional description and action.
 */
export const EmptyState = ({
  icon = '📭',
  title = 'No results found',
  description = 'Try adjusting your filters or search criteria to find what you are looking for.',
  actionText,
  onAction,
  className = '',
  ...rest
}) => {
  return (
    <div
      className={`fimmit-empty-state ${className}`}
      role="region"
      aria-label={title}
      {...rest}
    >
      {icon && <div className="fimmit-empty-icon" aria-hidden="true">{icon}</div>}
      <h3 className="fimmit-empty-title">{title}</h3>
      {description && <p className="fimmit-empty-description">{description}</p>}
      {actionText && onAction && (
        <div className="fimmit-empty-action">
          <Button variant="primary" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};