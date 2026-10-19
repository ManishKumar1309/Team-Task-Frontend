import { useState } from 'react';
import { onboardingService } from '../services/onboardingService';

export function useOnboarding(onSuccess) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    introduction: '',
    mainGoal: '',
    preferredTechStack: [],
    preferredLanguage: '',
    otherTech: '',
    interests: [],
    otherInterests: '',
    preferredDifficulty: 'EASY',
  });

  const [stepError, setStepError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const updateIntroduction = (introduction) => {
    setFormData((prev) => ({ ...prev, introduction }));
    setStepError('');
  };

  const updateMainGoal = (mainGoal) => {
    setFormData((prev) => ({ ...prev, mainGoal }));
    setStepError('');
  };

  const toggleTech = (tech) => {
    setFormData((prev) => {
      const exists = prev.preferredTechStack.includes(tech);
      const updated = exists
        ? prev.preferredTechStack.filter((t) => t !== tech)
        : [...prev.preferredTechStack, tech];

      let preferredLanguage = prev.preferredLanguage;
      if (exists && preferredLanguage === tech) {
        preferredLanguage = updated.length > 0 ? updated[0] : '';
      } else if (!preferredLanguage && updated.length > 0) {
        preferredLanguage = updated[0];
      }

      return {
        ...prev,
        preferredTechStack: updated,
        preferredLanguage,
      };
    });
    setStepError('');
  };

  const updatePreferredLanguage = (preferredLanguage) => {
    setFormData((prev) => ({ ...prev, preferredLanguage }));
    setStepError('');
  };

  const updateOtherTech = (otherTech) => {
    setFormData((prev) => ({ ...prev, otherTech }));
    setStepError('');
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      const updated = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: updated };
    });
    setStepError('');
  };

  const updateOtherInterests = (otherInterests) => {
    setFormData((prev) => ({ ...prev, otherInterests }));
    setStepError('');
  };

  const updateDifficulty = (preferredDifficulty) => {
    setFormData((prev) => ({ ...prev, preferredDifficulty }));
    setStepError('');
  };

  const validateStep = (step) => {
    if (step === 2) {
      const hasTech = formData.preferredTechStack.length > 0 || formData.otherTech.trim();
      if (!hasTech) {
        setStepError('Please select at least one technology or specify an other.');
        return false;
      }
    }

    if (step === 3) {
      const hasInterest = formData.interests.length > 0 || formData.otherInterests.trim();
      if (!hasInterest) {
        setStepError('Please select at least one interest or specify an other.');
        return false;
      }
    }

    setStepError('');
    return true;
  };

  const goNext = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await handleSubmit();
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setStepError('');
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStepError('');

    try {
      const fullTechStack = [...formData.preferredTechStack];
      if (formData.otherTech.trim()) {
        const others = formData.otherTech
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        fullTechStack.push(...others);
      }

      const fullInterests = [...formData.interests];
      if (formData.otherInterests.trim()) {
        const others = formData.otherInterests
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        fullInterests.push(...others);
      }

      const payload = {
        introduction: formData.introduction,
        preferredTechStack: fullTechStack.filter((t) => t !== 'Other'),
        interests: fullInterests.filter((i) => i !== 'Other'),
        preferredDifficulty: formData.preferredDifficulty,
        mainGoal: formData.mainGoal,
        preferredLanguage: formData.preferredLanguage,
      };

      const result = await onboardingService.savePreferences(payload);
      setSubmissionSuccess(true);
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      setStepError(err.message || 'Failed to save preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    totalSteps: 4,
    formData,
    stepError,
    isSubmitting,
    submissionSuccess,
    canGoBack: currentStep > 1,
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
  };
}
