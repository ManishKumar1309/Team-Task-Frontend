import React from 'react';
import { Input } from '../common/Input';
import { Pill } from '../common/Pill';
import { Button } from '../common/Button';
import './FilterControls.css';

export const FilterControls = ({ 
  searchQuery, setSearchQuery, 
  selectedDiff, setSelectedDiff,
  selectedTech, setSelectedTech, availableTechs,
  minScore, setMinScore,
  sortBy, setSortBy,
  onClearAll, hasActiveFilters
}) => {
  const difficulties = ['ALL', 'EASY', 'MEDIUM', 'HARD'];

  const toggleTech = (tech) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter(t => t !== tech));
    } else {
      setSelectedTech([...selectedTech, tech]);
    }
  };

  return (
    <div className="fimmit-filters-panel" aria-label="Filter and Sort Controls">

      <div className="fimmit-filters-bottom">
        <div className="fimmit-filter-group">
          <span className="fimmit-control-label">Difficulty:</span>
          <div className="fimmit-pill-group">
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

        

        <div className="fimmit-filter-group">
          <span className="fimmit-control-label">Technology:</span>
          <div className="fimmit-pill-group">
            {availableTechs.map(tech => (
              <Pill 
                key={tech}
                interactive
                selected={selectedTech.includes(tech)}
                onClick={() => toggleTech(tech)}
              >
                {tech}
              </Pill>
            ))}
          </div>
        </div>


      </div>

      {hasActiveFilters && (
        <div className="fimmit-filters-actions">
          <Button variant="outline" size="sm" onClick={onClearAll}>
            Reset all filters
          </Button>
        </div>
      )}
    </div>
  );
};