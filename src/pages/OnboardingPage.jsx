import React from 'react';
import { OnboardingLayout } from '../layouts/OnboardingLayout';
import { OnboardingCard } from '../components/onboarding/OnboardingCard';
import { StepIntroduction } from '../components/onboarding/StepIntroduction';
import { StepTechStack } from '../components/onboarding/StepTechStack';
import { StepInterests } from '../components/onboarding/StepInterests';
import { StepDifficulty } from '../components/onboarding/StepDifficulty';
import { useOnboarding } from '../hooks/useOnboarding';
import './OnboardingPage.css';

const STEP_TITLES = {
  1: {
    title: 'Tell us about you',
    subtitle: 'Share your background and what you want to achieve with Fimmit.',
  },
  2: {
    title: 'Your tech stack',
    subtitle: 'Select the languages and frameworks you want to write code in.',
  },
  3: {
    title: "What you're into",
    subtitle: 'Pick the domains and technical areas that interest you most.',
  },
  4: {
    title: 'How hard?',
    subtitle: 'Select your preferred issue difficulty to calibrate your recommendations.',
  },
};

export const OnboardingPage = ({ onComplete, onExit }) => {
  const {
    currentStep,
    totalSteps,
    formData,
    stepError,
    isSubmitting,
    canGoBack,
    goNext,
    goBack,
    updateIntroduction,
    updateMainGoal,
    toggleTech,
    updatePreferredLanguage,
    updateOtherTech,
    toggleInterest,
    updateOtherInterests,
    updateDifficulty,
  } = useOnboarding(onComplete);

  const { title, subtitle } = STEP_TITLES[currentStep];

  return (
    <OnboardingLayout onExit={onExit}>
      <OnboardingCard
        currentStep={currentStep}
        totalSteps={totalSteps}
        title={title}
        subtitle={subtitle}
        canGoBack={canGoBack}
        onBack={goBack}
        onNext={goNext}
        isSubmitting={isSubmitting}
        error={stepError}
      >
        {currentStep === 1 && (
          <StepIntroduction
            introduction={formData.introduction}
            mainGoal={formData.mainGoal}
            onChangeIntroduction={updateIntroduction}
            onSelectGoal={updateMainGoal}
          />
        )}

        {currentStep === 2 && (
          <StepTechStack
            selectedTech={formData.preferredTechStack}
            preferredLanguage={formData.preferredLanguage}
            otherTech={formData.otherTech}
            onToggleTech={toggleTech}
            onSelectPreferredLanguage={updatePreferredLanguage}
            onChangeOtherTech={updateOtherTech}
          />
        )}

        {currentStep === 3 && (
          <StepInterests
            selectedInterests={formData.interests}
            otherInterests={formData.otherInterests}
            onToggleInterest={toggleInterest}
            onChangeOtherInterests={updateOtherInterests}
          />
        )}

        {currentStep === 4 && (
          <StepDifficulty
            selectedDifficulty={formData.preferredDifficulty}
            onSelectDifficulty={updateDifficulty}
          />
        )}
      </OnboardingCard>
    </OnboardingLayout>
  );
};

export default OnboardingPage;
