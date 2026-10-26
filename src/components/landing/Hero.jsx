import React from 'react';
import { Button } from '../common/Button';
import './Hero.css';


export const Hero = ({ onContinueWithGithub, onHowItWorks }) => {
  return (
    <section className="fimmit-hero" aria-label="Hero section">
      {/* Eyebrow Line */}
      <div className="fimmit-hero__eyebrow">
        <span>PROJECT</span>
        <span className="fimmit-hero__dot">•</span>
        <span>OPEN-SOURCE MATCHMAKER</span>
        <span className="fimmit-hero__dot">•</span>
        <span>BUILT FOR YOUR STACK</span>
      </div>

      {/* Main Headline Layout with Badge */}
      <div className="fimmit-hero__header-grid">
        <h1 className="fimmit-hero__title">
          Find issues tuned to your <span className="fimmit-hero__highlight">exact stack.</span>
        </h1>

        {/* Circular Badge */}
        <div className="fimmit-hero__circular-badge-wrapper" aria-hidden="true">
          <div className="fimmit-circular-badge">
            <svg viewBox="0 0 120 120" className="fimmit-circular-badge__svg">
              <path
                id="textPath"
                d="M 20, 60 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                fill="none"
              />
              <text className="fimmit-circular-badge__text">
                <textPath href="#textPath" startOffset="0%">
                  NO GUESSWORK • ONE ISSUE AT A TIME •
                </textPath>
              </text>
            </svg>
            <div className="fimmit-circular-badge__center">
              <span>Ship your</span>
              <strong>first PR</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Secondary Link */}
      <div className="fimmit-hero__content-row">
        <p className="fimmit-hero__description">
          Open-source issues tuned to your exact stack and experience. Four questions in, ten issues out.
        </p>
        <button
          type="button"
          className="fimmit-hero__how-link"
          onClick={onHowItWorks}
        >
          How the matching works →
        </button>
      </div>

      {/* Primary GitHub CTA */}
      <div className="fimmit-hero__cta-wrapper">
        <Button
          variant="primary"
          size="lg"
          className="fimmit-hero__github-btn"
          onClick={onContinueWithGithub}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            style={{ marginRight: '8px' }}
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Continue with Github
        </Button>
      </div>
    </section>
  );
};