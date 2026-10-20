import React from 'react';
import { Button } from './Button';
import './ErrorState.css';

/**
 * Reusable ErrorState component conforming to the Fimmit design system.
 * Renders an accessible error message with an optional retry action.
 */
export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We encountered an error while loading the data. Please try again.',
  onRetry,
  retryText = 'Try again',
  className = '',
  ...rest
}) => {
  return (
    <div
      className={`fimmit-error-state ${className}`}
      role="alert"
      aria-live="assertive"
      {...rest}
    >
      <div className="fimmit-error-icon" aria-hidden="true">⚠️</div>
      <h3 className="fimmit-error-title">{title}</h3>
      {message && <p className="fimmit-error-message">{message}</p>}
      {onRetry && (
        <div className="fimmit-error-action">
          <Button variant="primary" onClick={onRetry}>
            {retryText}
          </Button>
        </div>
      )}
    </div>
  );
};