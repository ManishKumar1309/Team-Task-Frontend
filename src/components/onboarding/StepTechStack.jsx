import React, { useState } from 'react';
import { Pill } from '../common/Pill';
import { Input } from '../common/Input';
import { TECH_OPTIONS } from '../../utils/constants';

export const StepTechStack = ({
  selectedTech = [],
  preferredLanguage = '',
  otherTech = '',
  onToggleTech,
  onSelectPreferredLanguage,
  onChangeOtherTech,
}) => {
  const [showOtherInput, setShowOtherInput] = useState(
    selectedTech.includes('Other') || Boolean(otherTech)
  );

  const handleTechClick = (tech) => {
    if (tech === 'Other') {
      setShowOtherInput(!showOtherInput);
    }
    onToggleTech(tech);
  };

  const selectableLanguages = selectedTech.filter((t) => t !== 'Other');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Primary Tech Stack Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        <label
          style={{
            fontWeight: 'var(--font-weight-bold)',
            fontSize: '0.9rem',
          }}
        >
          Select your technologies (multi-select) *
        </label>
        <div
          role="group"
          aria-label="Technologies"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}
        >
          {TECH_OPTIONS.map((tech) => {
            const isSelected = selectedTech.includes(tech);
            return (
              <Pill
                key={tech}
                interactive
                selected={isSelected}
                onClick={() => handleTechClick(tech)}
                aria-label={`Toggle technology: ${tech}`}
              >
                {tech}
              </Pill>
            );
          })}
        </div>
      </div>

      {/* Other input field */}
      {(showOtherInput || selectedTech.includes('Other')) && (
        <Input
          label="Other technologies (comma separated)"
          placeholder="e.g. Go, Docker, Kubernetes"
          value={otherTech}
          onChange={(e) => onChangeOtherTech(e.target.value)}
        />
      )}

      {/* Preferred Programming Language Selection */}
      {selectableLanguages.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <label
            style={{
              fontWeight: 'var(--font-weight-bold)',
              fontSize: '0.9rem',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>Primary / Preferred language</span>
            <span style={{ fontWeight: 'normal', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              (Pending backend schema)
            </span>
          </label>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Used to give the highest priority in recommendation ranking.
          </p>
          <div
            role="radiogroup"
            aria-label="Preferred language"
            style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}
          >
            {selectableLanguages.map((lang) => {
              const isPreferred = preferredLanguage === lang;
              return (
                <Pill
                  key={lang}
                  interactive
                  selected={isPreferred}
                  onClick={() => onSelectPreferredLanguage(lang)}
                  aria-label={`Set preferred language: ${lang}`}
                >
                  {lang} {isPreferred ? '★ Primary' : ''}
                </Pill>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepTechStack;
