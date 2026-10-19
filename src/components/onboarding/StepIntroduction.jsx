import React from 'react';

export const StepIntroduction = ({
  introduction = '',
  onChangeIntroduction,
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
            alignItems: 'flex-end',
          }}
        >
          <span>Short bio <span style={{ color: 'var(--color-red, #E4452F)' }} title="Required field">*</span></span>
          <span style={{ 
            fontWeight: '600', 
            color: 'var(--text-muted, #888)', 
            fontSize: '0.8rem',
            fontFamily: 'var(--font-family-mono, monospace)' 
          }}>
            {introduction.length}/200
          </span>
        </label>
        <textarea
          id="onboarding-bio"
          rows={3}
          maxLength={200}
          value={introduction}
          onChange={(e) => onChangeIntroduction(e.target.value)}
          placeholder="e.g. I'm a CS student interested in backend systems and distributed algorithms..."
          className="fimmit-input"
          style={{
            width: '100%',
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)',
            border: 'var(--border-width-default, 2px) solid var(--color-black, #000)',
            backgroundColor: 'var(--color-cream, #F7F4EC)',
            fontFamily: 'inherit',
            fontSize: '1rem',
            boxSizing: 'border-box',
            resize: 'vertical',
          }}
        />
      </div>
    </div>
  );
};

export default StepIntroduction;