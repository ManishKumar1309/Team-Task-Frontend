import React, { useState } from 'react';
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

const validateCustomInput = (input) => {
  const val = (input || '').trim();
  if (!val) return 'Cannot be empty or just whitespace.';
  if (val.length < 2) return 'Must be at least 2 characters long.';
  if (val.length > 40) return 'Must be under 40 characters.';
  if (/^(.)\1{4,}$/.test(val)) return 'Please enter a meaningful technical answer.';
  if (!/[a-zA-Z]/.test(val)) return 'Must contain valid alphabetical characters.';
  if (!/^[a-zA-Z0-9\s\.\-\+\#]+$/.test(val)) return 'Contains invalid symbols.';
  return '';
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
    toggleTech,
    updatePreferredLanguage,
    updateOtherTech,
    toggleInterest,
    updateOtherInterests,
    updateDifficulty,
  } = useOnboarding(onComplete);

  const [localError, setLocalError] = useState('');

  const handleNext = () => {
    setLocalError('');

    if (currentStep === 1) {
      const intro = (formData.introduction || '').trim();
      if (!intro) {
        setLocalError('Please provide a brief introduction.');
        return;
      }
      if (intro.length > 200) {
        setLocalError('Introduction must be 200 characters or fewer.');
        return;
      }
    }

    if (currentStep === 2) {
      const techs = formData.preferredTechStack || [];
      const hasOther = Array.isArray(techs) ? techs.includes('Other') : techs === 'Other';
      if (hasOther) {
        const err = validateCustomInput(formData.otherTech);
        if (err) {
          setLocalError(`Tech Stack: ${err}`);
          return;
        }
      }
    }

    if (currentStep === 3) {
      const interests = formData.interests || [];
      const hasOther = Array.isArray(interests) ? interests.includes('Other') : interests === 'Other';
      if (hasOther) {
        const err = validateCustomInput(formData.otherInterests);
        if (err) {
          setLocalError(`Domain: ${err}`);
          return;
        }
      }
    }

    goNext();
  };

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
        onNext={handleNext}
        isSubmitting={isSubmitting}
        error={localError || stepError}
      >
        {currentStep === 1 && (
          <StepIntroduction
            introduction={formData.introduction}
            onChangeIntroduction={updateIntroduction}
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