import React from 'react';
import { Pill } from '../common/Pill';
import { GOAL_OPTIONS } from '../../utils/constants';

export const StepIntroduction = ({
  introduction = '',
  mainGoal = '',
  onChangeIntroduction,
  onSelectGoal,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        <label
          htmlFor="onboarding-bio"
          style={{
            fontWeight: 'var(--font-weight-bold)',
            fontSize: '0.9rem',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Short bio</span>
          <span style={{ fontWeight: 'normal', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            (optional)
          </span>
        </label>
        <textarea
          id="onboarding-bio"
          rows={3}
          value={introduction}
          onChange={(e) => onChangeIntroduction(e.target.value)}
          placeholder="e.g. I'm a CS student interested in backend systems and distributed algorithms..."
          className="fimmit-input"
          style={{
            width: '100%',
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)',
            border: 'var(--border-width-default) solid var(--color-black)',
            backgroundColor: 'var(--color-cream)',
            fontFamily: 'inherit',
            fontSize: '1rem',
            boxSizing: 'border-box',
            resize: 'vertical',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        <label
          style={{
            fontWeight: 'var(--font-weight-bold)',
            fontSize: '0.9rem',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>What is your main goal?</span>
          <span style={{ fontWeight: 'normal', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            (optional)
          </span>
        </label>
        <div
          role="radiogroup"
          aria-label="Main goal options"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}
        >
          {GOAL_OPTIONS.map((goal) => {
            const isSelected = mainGoal === goal;
            return (
              <Pill
                key={goal}
                interactive
                selected={isSelected}
                onClick={() => onSelectGoal(goal)}
                aria-label={`Select goal: ${goal}`}
              >
                {goal}
              </Pill>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIntroduction;
