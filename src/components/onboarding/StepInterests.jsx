import React, { useState } from 'react';
import { Pill } from '../common/Pill';
import { Input } from '../common/Input';
import { INTEREST_OPTIONS } from '../../utils/constants';

export const StepInterests = ({
  selectedInterests = [],
  otherInterests = '',
  onToggleInterest,
  onChangeOtherInterests,
}) => {
  const [showOtherInput, setShowOtherInput] = useState(
    selectedInterests.includes('Other') || Boolean(otherInterests)
  );

  const handleInterestClick = (interest) => {
    if (interest === 'Other') {
      setShowOtherInput(!showOtherInput);
    }
    onToggleInterest(interest);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        <label
          style={{
            fontWeight: 'var(--font-weight-bold)',
            fontSize: '0.9rem',
          }}
        >
          What domains are you into? (multi-select) *
        </label>
        <div
          role="group"
          aria-label="Domain interests"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}
        >
          {INTEREST_OPTIONS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <Pill
                key={interest}
                interactive
                selected={isSelected}
                onClick={() => handleInterestClick(interest)}
                aria-label={`Toggle interest domain: ${interest}`}
              >
                {interest}
              </Pill>
            );
          })}
        </div>
      </div>

      {(showOtherInput || selectedInterests.includes('Other')) && (
        <Input
          label="Other interests (comma separated)"
          placeholder="e.g. Security, Compilers, Game Development"
          value={otherInterests}
          onChange={(e) => onChangeOtherInterests(e.target.value)}
        />
      )}
    </div>
  );
};

export default StepInterests;
