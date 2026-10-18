import React from 'react';
import { Badge } from '../common/Badge';
import { Pill } from '../common/Pill';
import './MatchingPreview.css';

/**
 * Fimmit MatchingPreview Component (Section C)
 * Honest sample recommendation preview card with mock issue data.
 */
export const MatchingPreview = () => {
  return (
    <section id="features" className="fimmit-preview-section" aria-label="Matching preview">
      <div className="fimmit-preview__container">
        <div className="fimmit-preview__header">
          <span className="fimmit-preview__eyebrow">PREVIEW</span>
          <h2 className="fimmit-preview__title">Precision matching in action</h2>
          <p className="fimmit-preview__subtitle">
            Here is a sample of how recommendations look when aligned with your stack.
          </p>
        </div>

        {/* Sample Card Container */}
        <div className="fimmit-sample-card">
          <div className="fimmit-sample-card__top">
            <div className="fimmit-sample-card__repo">
              <span className="fimmit-sample-card__org">facebook</span>
              <span className="fimmit-sample-card__slash">/</span>
              <span className="fimmit-sample-card__name">react</span>
            </div>
            <div className="fimmit-sample-card__badges">
              <Badge variant="orange">94% match</Badge>
              <Badge variant="yellow">Good First Issue</Badge>
            </div>
          </div>

          <h3 className="fimmit-sample-card__issue-title">
            [19.0] Fix hydration mismatch warning on SSR text nodes inside nested flex containers
          </h3>

          <p className="fimmit-sample-card__issue-desc">
            We are looking for contributors to help address edge-case SSR text node mismatches when rendering components inside responsive layouts.
          </p>

          <div className="fimmit-sample-card__footer">
            <div className="fimmit-sample-card__pills">
              <Pill>React</Pill>
              <Pill>JavaScript</Pill>
              <Pill>SSR</Pill>
            </div>
            <span className="fimmit-sample-card__notice">* Sample preview item using static mock data</span>
          </div>
        </div>
      </div>
    </section>
  );
};