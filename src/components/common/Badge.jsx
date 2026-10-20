import React from 'react';
import './Badge.css';

/**
 * Reusable Badge component conforming to the Fimmit design system.
 * Used for compact labels such as issue difficulty, status, or match percentages.
 */
export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...rest
}) => {
  return (
    <span
      className={`fimmit-badge fimmit-badge--${variant} fimmit-badge--${size} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
};