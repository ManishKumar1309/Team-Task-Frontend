import React from 'react';
import { Input } from '../common/Input';
import { Pill } from '../common/Pill';
import './FilterControls.css';

export const FilterControls = ({ searchQuery, setSearchQuery, selectedDiff, setSelectedDiff }) => {
  const difficulties = ['ALL', 'EASY', 'MEDIUM', 'HARD'];

  return (
    <div className="fimmit-filters">
      <div className="fimmit-filters__search">
        <Input 
          placeholder="Search repositories, tags, or titles..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="fimmit-filters__pills">
        <span className="fimmit-filters__label">Difficulty:</span>
        {difficulties.map(diff => (
          <Pill 
            key={diff}
            interactive
            selected={selectedDiff === diff}
            onClick={() => setSelectedDiff(diff)}
          >
            {diff}
          </Pill>
        ))}
      </div>
    </div>
  );
};