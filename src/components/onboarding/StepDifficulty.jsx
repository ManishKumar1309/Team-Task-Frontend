import React from 'react';
import { DifficultyOptionCard } from './DifficultyOptionCard';
import { DIFFICULTY_OPTIONS } from '../../utils/constants';

export const StepDifficulty = ({
  selectedDifficulty = 'EASY',
  onSelectDifficulty,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <label
        style={{
          fontWeight: 'var(--font-weight-bold)',
          fontSize: '0.9rem',
        }}
      >
        Preferred issue difficulty *
      </label>
      <div
        role="radiogroup"
        aria-label="Difficulty levels"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}
      >
        {DIFFICULTY_OPTIONS.map((opt) => (
          <DifficultyOptionCard
            key={opt.apiValue}
            label={opt.uiLabel}
            description={opt.description}
            apiValue={opt.apiValue}
            selected={selectedDifficulty === opt.apiValue}
            onSelect={() => onSelectDifficulty(opt.apiValue)}
          />
        ))}
      </div>
    </div>
  );
};

export default StepDifficulty;
