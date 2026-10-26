import React from 'react';
import './Badge.css';

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