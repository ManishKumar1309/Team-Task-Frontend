import React from 'react';
import './Button.css';


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