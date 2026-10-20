import React from 'react';
import './LoadingState.css';

/**
 * Reusable LoadingState component conforming to the Fimmit design system.
 * Renders an accessible loading spinner and an optional message.
 */
export const LoadingState = ({
  message = 'Loading...',
  className = '',
  ...rest
}) => {
  return (
    <div
      className={`fimmit-loading-state ${className}`}
      role="status"
      aria-live="polite"
      {...rest}
    >
      <div className="fimmit-loading-spinner" aria-hidden="true" />
      {message && <p className="fimmit-loading-message">{message}</p>}
    </div>
  );
};