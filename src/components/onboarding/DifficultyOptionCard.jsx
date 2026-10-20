import React from 'react';
import { Badge } from '../common/Badge';
import './DifficultyOptionCard.css';

export const DifficultyOptionCard = ({
  label,
  description,
  apiValue,
  selected = false,
  onSelect,
}) => {
  const badgeVariant =
    apiValue === 'EASY' ? 'green' : apiValue === 'MEDIUM' ? 'yellow' : 'orange';

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={`fimmit-difficulty-card ${selected ? 'fimmit-difficulty-card--selected' : ''}`}
      onClick={onSelect}
    >
      <div className="fimmit-difficulty-card__left">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <span className="fimmit-difficulty-card__label">{label}</span>
          <Badge variant={badgeVariant} size="sm">
            {apiValue}
          </Badge>
        </div>
        <span className="fimmit-difficulty-card__desc">{description}</span>
      </div>
      <div className="fimmit-difficulty-card__radio-indicator" aria-hidden="true" />
    </button>
  );
};

export default DifficultyOptionCard;
