import React from 'react';
import { ProgressSegments } from './ProgressSegments';
import { Button } from '../common/Button';
import './OnboardingCard.css';

export const OnboardingCard = ({
  currentStep = 1,
  totalSteps = 4,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  canGoBack = true,
  isSubmitting = false,
  error = '',
}) => {
  const isFinalStep = currentStep === totalSteps;

  return (
    <div className="fimmit-onboarding-card">
      <ProgressSegments currentStep={currentStep} totalSteps={totalSteps} />

      <div className="fimmit-onboarding-card__header">
        <h2 className="fimmit-onboarding-card__title">{title}</h2>
        {subtitle && <p className="fimmit-onboarding-card__subtitle">{subtitle}</p>}
      </div>

      {error && (
        <div className="fimmit-onboarding-card__error-banner" role="alert">
          {error}
        </div>
      )}

      <div className="fimmit-onboarding-card__body">
        {children}
      </div>

      <div className="fimmit-onboarding-card__footer">
        <Button
          variant="outline"
          size="md"
          onClick={onBack}
          disabled={!canGoBack || isSubmitting}
          aria-label="Go back to previous question"
        >
          ← Back
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          disabled={isSubmitting}
          isLoading={isSubmitting}
          aria-label={isFinalStep ? 'Generate personalized feed' : 'Continue to next question'}
        >
          {isFinalStep ? 'Generate feed' : 'Continue →'}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingCard;
