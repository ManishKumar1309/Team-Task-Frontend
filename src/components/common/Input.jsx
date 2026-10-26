import React, { useId } from 'react';
import './Input.css';

export const Input = ({
  label,
  error,
  id: externalId,
  className = '',
  disabled = false,
  ...rest
}) => {
  const generatedId = useId();
  const inputId = externalId || generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={`fimmit-input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="fimmit-input-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`fimmit-input ${error ? 'fimmit-input--error' : ''}`}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <span id={errorId} className="fimmit-input-error-text" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};