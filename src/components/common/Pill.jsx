import React from 'react';
import './Pill.css';

export const Pill = ({
  children,
  selected = false,
  interactive = false,
  onClick,
  className = '',
  ...rest
}) => {
  const Component = interactive ? 'button' : 'span';

  return (
    <Component
      type={interactive ? 'button' : undefined}
      className={`fimmit-pill ${selected ? 'fimmit-pill--selected' : ''} ${interactive ? 'fimmit-pill--interactive' : ''
        } ${className}`}
      onClick={interactive ? onClick : undefined}
      aria-pressed={interactive ? selected : undefined}
      {...rest}
    >
      {children}
    </Component>
  );
};