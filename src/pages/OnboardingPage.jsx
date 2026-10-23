import React, { useState } from 'react';
import logoSrc from '../assets/Logo.svg';
import { onboardingService } from '../services/onboardingService';
import { ISSUE_TYPE_OPTIONS } from '../utils/constants';
import './OnboardingPage.css';

export const OnboardingPage = ({ onComplete, onExit }) => {
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [interests, setInterests] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [preferredIssues, setPreferredIssues] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Tech Stack options (Question 2)
  const techOptions = ['C++', 'Python', 'JS', 'Rust', 'React', 'TypeScript', 'Java', 'Go', 'Node.js', 'Ruby'];

  // Interest options (Question 3)
  const interestOptions = ['Backend', 'AI/ML', 'DevOps', 'App Dev', 'Frontend', 'Web3'];

  // Preferred Issue options (Question 5)
  const issueOptions = ISSUE_TYPE_OPTIONS || [
    'Bug Fixes',
    'Documentation',
    'New Features',
    'Refactoring',
    'Performance',
    'Any type',
    'Good first issue',
    'Tests',
  ];

  const toggleTech = (tech) => {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter((t) => t !== tech));
    } else {
      setTechStack([...techStack, tech]);
    }
  };

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const toggleIssueType = (issueType) => {
    if (preferredIssues.includes(issueType)) {
      setPreferredIssues(preferredIssues.filter((i) => i !== issueType));
    } else {
      setPreferredIssues([...preferredIssues, issueType]);
    }
  };

  // Validation to make sure each step has selection before continuing
  const isStepValid = () => {
    switch (step) {
      case 1:
        return bio.trim().length > 0;
      case 2:
        return techStack.length > 0;
      case 3:
        return interests.length > 0;
      case 4:
        return difficulty !== '';
      case 5:
        return preferredIssues.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 5 && isStepValid()) {
      setErrorMessage('');
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setErrorMessage('');
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!isStepValid() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const payload = {
      bio,
      preferredTechStack: techStack,
      interests,
      preferredDifficulty: difficulty || 'medium',
      preferredIssues,
    };

    try {
      // Submit preferences through existing onboarding service
      await onboardingService.savePreferences(payload);

      // Persist locally for immediate state synchronization
      sessionStorage.setItem('fimmit_preferred_issues', JSON.stringify(preferredIssues));

      if (onComplete) {
        await onComplete(payload);
      }
    } catch (err) {
      console.error('Failed to submit onboarding preferences:', err);
      setErrorMessage(err?.message || 'Failed to generate feed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fimmit-onboarding-wrapper">
      {/* Top Bar with Logo and Exit */}
      <div className="fimmit-onboarding-topbar">
        <div className="fimmit-onboarding-brand">
          <img src={logoSrc} alt="Fimmit Logo" className="fimmit-onboarding-logo-icon" />
          <span className="fimmit-onboarding-logo-text">Fimmit</span>
        </div>
        <button type="button" className="fimmit-onboarding-exit-btn" onClick={onExit} aria-label="Exit onboarding">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Exit
        </button>
      </div>

      {/* Main Survey Card */}
      <div className="fimmit-onboarding-card">
        {/* Segmented Progress Bar (5 Steps) */}
        <div className="fimmit-onboarding-progress" role="progressbar" aria-valuenow={step} aria-valuemin="1" aria-valuemax="5" aria-label={`Question ${step} of 5`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`fimmit-progress-segment ${step >= i ? 'active' : ''}`}></div>
          ))}
        </div>

        {/* Error banner if submission fails */}
        {errorMessage && (
          <div className="fimmit-onboarding-error" role="alert">
            <span>{errorMessage}</span>
            <button
              type="button"
              className="fimmit-onboarding-error-dismiss"
              onClick={() => setErrorMessage('')}
              aria-label="Dismiss error"
            >
              &times;
            </button>
          </div>
        )}

        <div className="fimmit-onboarding-content">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="fimmit-step-pane">
              <p className="fimmit-step-eyebrow">Question 1 of 5</p>
              <h2 className="fimmit-step-title">Tell us about you</h2>

              <div className="fimmit-input-group">
                <label className="fimmit-input-label">Short bio *</label>
                <textarea
                  className="fimmit-textarea"
                  placeholder="I'm a CS student interested in Java backend development and contributing to real-world open-source projects."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={300}
                />
                <div className="fimmit-word-count">{bio.length}/300 words</div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="fimmit-step-pane">
              <p className="fimmit-step-eyebrow">Question 2 of 5</p>
              <h2 className="fimmit-step-title">Your tech stack</h2>

              <p className="fimmit-step-subtitle">Select your technologies (multi-select) *</p>

              <div className="fimmit-pills-container" role="group" aria-label="Tech stack options">
                {techOptions.map((tech) => {
                  const isSelected = techStack.includes(tech);
                  return (
                    <button
                      type="button"
                      key={tech}
                      className={`fimmit-pill ${isSelected ? 'active' : ''}`}
                      onClick={() => toggleTech(tech)}
                      aria-pressed={isSelected}
                    >
                      {tech}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="fimmit-step-pane">
              <p className="fimmit-step-eyebrow">Question 3 of 5</p>
              <h2 className="fimmit-step-title">What you're into</h2>

              <p className="fimmit-step-subtitle">What domains are you into? (multi-select) *</p>

              <div className="fimmit-pills-container" role="group" aria-label="Interest domain options">
                {interestOptions.map((interest) => {
                  const isSelected = interests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      className={`fimmit-pill ${isSelected ? 'active' : ''}`}
                      onClick={() => toggleInterest(interest)}
                      aria-pressed={isSelected}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="fimmit-step-pane">
              <p className="fimmit-step-eyebrow">Question 4 of 5</p>
              <h2 className="fimmit-step-title">How hard?</h2>

              <p className="fimmit-step-subtitle">Preferred issue difficulty *</p>

              <div className="fimmit-difficulty-blocks" role="radiogroup" aria-label="Difficulty selection">
                <div
                  role="radio"
                  aria-checked={difficulty === 'easy'}
                  tabIndex={0}
                  className={`fimmit-diff-block ${difficulty === 'easy' ? 'active-easy' : ''}`}
                  onClick={() => setDifficulty('easy')}
                  onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setDifficulty('easy'); }}
                >
                  <div className="fimmit-diff-header">
                    <h4 className="fimmit-diff-title">Beginner</h4>
                    <span className="fimmit-diff-badge easy">EASY</span>
                  </div>
                  <p className="fimmit-diff-sub">Good first issue</p>
                </div>

                <div
                  role="radio"
                  aria-checked={difficulty === 'medium'}
                  tabIndex={0}
                  className={`fimmit-diff-block ${difficulty === 'medium' ? 'active-medium' : ''}`}
                  onClick={() => setDifficulty('medium')}
                  onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setDifficulty('medium'); }}
                >
                  <div className="fimmit-diff-header">
                    <h4 className="fimmit-diff-title">Intermediate</h4>
                    <span className="fimmit-diff-badge medium">MEDIUM</span>
                  </div>
                  <p className="fimmit-diff-sub">Some project context needed</p>
                </div>

                <div
                  role="radio"
                  aria-checked={difficulty === 'hard'}
                  tabIndex={0}
                  className={`fimmit-diff-block ${difficulty === 'hard' ? 'active-hard' : ''}`}
                  onClick={() => setDifficulty('hard')}
                  onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setDifficulty('hard'); }}
                >
                  <div className="fimmit-diff-header">
                    <h4 className="fimmit-diff-title">Expert</h4>
                    <span className="fimmit-diff-badge hard">HARD</span>
                  </div>
                  <p className="fimmit-diff-sub">Advanced, deep changes</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="fimmit-step-pane">
              <p className="fimmit-step-eyebrow">Question 5 of 5</p>
              <h2 className="fimmit-step-title">Preferred issue</h2>

              <p className="fimmit-step-subtitle">Select your preferred issue types (multi-select) *</p>

              <div className="fimmit-pills-container" role="group" aria-label="Preferred issue types">
                {issueOptions.map((issueType) => {
                  const isSelected = preferredIssues.includes(issueType);
                  return (
                    <button
                      type="button"
                      key={issueType}
                      className={`fimmit-pill ${isSelected ? 'active' : ''}`}
                      onClick={() => toggleIssueType(issueType)}
                      aria-pressed={isSelected}
                    >
                      {issueType}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer Controls */}
        <div className="fimmit-onboarding-footer">
          <button
            type="button"
            className="fimmit-btn-back"
            onClick={handleBack}
            disabled={isSubmitting}
            style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
            aria-label="Go to previous question"
          >
            &larr; Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              className="fimmit-btn-next"
              onClick={handleNext}
              disabled={!isStepValid()}
              aria-label="Continue to next question"
            >
              Continue &rarr;
            </button>
          ) : (
            <button
              type="button"
              className="fimmit-btn-next"
              onClick={handleComplete}
              disabled={!isStepValid() || isSubmitting}
              aria-label="Generate personalized recommendations feed"
            >
              {isSubmitting ? 'Generating feed...' : 'Generate feed \u2192'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;