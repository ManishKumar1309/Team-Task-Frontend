import React, { useState } from 'react';
import logoSrc from '../assets/Logo.svg';
import { onboardingService } from '../services/onboardingService';
import './OnboardingPage.css';

export const OnboardingPage = ({ onComplete, onExit }) => {
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [interests, setInterests] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [authBlocked, setAuthBlocked] = useState(false);

  // Tech Stack options
  const techOptions = ['C++', 'Python', 'JS', 'Rust', 'React', 'TypeScript', 'Java', 'Go', 'Node.js', 'Ruby'];

  // Interest options
  const interestOptions = ['Backend', 'AI/ML', 'DevOps', 'App Dev', 'Frontend', 'Web3'];

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

  // Validation to make sure each step is compulsory
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
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 4 && isStepValid()) {
      setSubmitError('');
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setSubmitError('');
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!isStepValid() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');
    setAuthBlocked(false);

    const payload = {
      bio: bio.trim(),
      introduction: bio.trim().slice(0, 300),
      preferredTechStack: techStack,
      interests,
      preferredDifficulty: (difficulty || 'medium').toLowerCase(),
      preferredIssueTypes: ['BUG', 'DOCUMENTATION', 'FEATURE'],
    };

    try {
      const result = await onboardingService.savePreferences(payload);
      if (result?.blockedByAuth) {
        setAuthBlocked(true);
        setSubmitError(result.error || 'Authentication required: POST /api/recommendations requires a valid login session.');
        return;
      }
      if (result?.error && !result?.success) {
        setSubmitError(result.error);
        return;
      }

      onComplete({
        ...payload,
        recommendations: result?.data || null,
      });
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit onboarding preferences.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedLocally = () => {
    onComplete({
      bio: bio.trim(),
      introduction: bio.trim().slice(0, 300),
      preferredTechStack: techStack,
      interests,
      preferredDifficulty: (difficulty || 'medium').toLowerCase(),
      preferredIssueTypes: ['BUG', 'DOCUMENTATION', 'FEATURE'],
    });
  };

  return (
    <div className="fimmit-onboarding-wrapper">

      {/* Top Bar with Logo and Exit */}
      <div className="fimmit-onboarding-topbar">
        <div className="fimmit-onboarding-brand">
          <img src={logoSrc} alt="Fimmit Logo" className="fimmit-onboarding-logo-icon" />
          <span className="fimmit-onboarding-logo-text">Fimmit</span>
        </div>
        <button className="fimmit-onboarding-exit-btn" onClick={onExit}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Exit
        </button>
      </div>

      {/* Main Survey Card */}
      <div className="fimmit-onboarding-card">

        {/* Segmented Progress Bar */}
        <div className="fimmit-onboarding-progress">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`fimmit-progress-segment ${step >= i ? 'active' : ''}`}></div>
          ))}
        </div>

        <div className="fimmit-onboarding-content">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="fimmit-step-pane">
              <p className="fimmit-step-eyebrow">Question 1 of 4</p>
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
              <p className="fimmit-step-eyebrow">Question 2 of 4</p>
              <h2 className="fimmit-step-title">Your tech stack</h2>

              <p className="fimmit-step-subtitle">Select your technologies (multi-select) *</p>

              <div className="fimmit-pills-container">
                {techOptions.map((tech) => (
                  <button
                    key={tech}
                    className={`fimmit-pill ${techStack.includes(tech) ? 'active' : ''}`}
                    onClick={() => toggleTech(tech)}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="fimmit-step-pane">
              <p className="fimmit-step-eyebrow">Question 3 of 4</p>
              <h2 className="fimmit-step-title">What you're into</h2>

              <p className="fimmit-step-subtitle">What domains are you into? (multi-select) *</p>

              <div className="fimmit-pills-container">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    className={`fimmit-pill ${interests.includes(interest) ? 'active' : ''}`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="fimmit-step-pane">
              <p className="fimmit-step-eyebrow">Question 4 of 4</p>
              <h2 className="fimmit-step-title">How hard?</h2>

              <p className="fimmit-step-subtitle">Preferred issue difficulty *</p>

              <div className="fimmit-difficulty-blocks">
                <div
                  className={`fimmit-diff-block ${difficulty === 'easy' ? 'active-easy' : ''}`}
                  onClick={() => setDifficulty('easy')}
                >
                  <div className="fimmit-diff-header">
                    <h4 className="fimmit-diff-title">Beginner</h4>
                    <span className="fimmit-diff-badge easy">EASY</span>
                  </div>
                  <p className="fimmit-diff-sub">Good first issue</p>
                </div>

                <div
                  className={`fimmit-diff-block ${difficulty === 'medium' ? 'active-medium' : ''}`}
                  onClick={() => setDifficulty('medium')}
                >
                  <div className="fimmit-diff-header">
                    <h4 className="fimmit-diff-title">Intermediate</h4>
                    <span className="fimmit-diff-badge medium">MEDIUM</span>
                  </div>
                  <p className="fimmit-diff-sub">Some project context needed</p>
                </div>

                <div
                  className={`fimmit-diff-block ${difficulty === 'hard' ? 'active-hard' : ''}`}
                  onClick={() => setDifficulty('hard')}
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

          {submitError && (
            <div className="fimmit-onboarding-error-banner" role="alert">
              <span className="fimmit-onboarding-error-text">{submitError}</span>
              {authBlocked && (
                <button
                  type="button"
                  className="fimmit-onboarding-proceed-btn"
                  onClick={handleProceedLocally}
                >
                  Proceed with local preferences &rarr;
                </button>
              )}
            </div>
          )}
        </div>

        {/* Card Footer Controls */}
        <div className="fimmit-onboarding-footer">
          <button
            className="fimmit-btn-back"
            onClick={handleBack}
            style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
            disabled={isSubmitting}
          >
            &larr; Back
          </button>

          {step < 4 ? (
            <button
              className="fimmit-btn-next"
              onClick={handleNext}
              disabled={!isStepValid() || isSubmitting}
            >
              Continue &rarr;
            </button>
          ) : (
            <button
              className="fimmit-btn-next"
              onClick={handleComplete}
              disabled={!isStepValid() || isSubmitting}
            >
              {isSubmitting ? 'Submitting to backend...' : 'Generate feed →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;