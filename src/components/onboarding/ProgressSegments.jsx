import React from 'react';
import './ProgressSegments.css';

export const ProgressSegments = ({ currentStep = 1, totalSteps = 4 }) => {
  const segments = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div
      className="fimmit-progress-segments"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-valuetext={`Question ${currentStep} of ${totalSteps}`}
    >
      <div className="fimmit-progress-segments__label-row">
        <span className="fimmit-progress-segments__step-label">
          Question {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="fimmit-progress-segments__bars" aria-hidden="true">
        {segments.map((step) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          const statusClass = isCompleted
            ? 'fimmit-progress-segments__bar--completed'
            : isActive
            ? 'fimmit-progress-segments__bar--active'
            : '';

          return (
            <div
              key={step}
              className={`fimmit-progress-segments__bar ${statusClass}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSegments;
