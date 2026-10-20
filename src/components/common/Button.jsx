import React from 'react';
import './Button.css';

/**
 * Reusable Button component conforming to the Fimmit design system.
 * Supports multiple variants (primary, outline, black, secondary), sizes,
 * loading states, and native button attributes with full accessibility support.
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      className={`fimmit-btn fimmit-btn--${variant} fimmit-btn--${size} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      aria-busy={isLoading ? 'true' : undefined}
      {...rest}
    >
      {isLoading && <span className="fimmit-btn__spinner" aria-hidden="true" />}
      <span className={isLoading ? 'fimmit-btn__text--loading' : ''}>
        {children}
      </span>
    </button>
  );
};