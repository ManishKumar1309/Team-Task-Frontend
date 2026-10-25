import React, { useState, useEffect } from 'react';
import './LoadingPage.css';

export const LoadingPage = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);

  // Simulated loading steps. 
  // (I varied the text slightly to make it realistic for your app, 
  // but kept the exact visual structure from the design).
  const steps = [
    "Fetching Github profile and metadata",
    "Analyzing tech stack and history",
    "Matching issues with ML model",
    "Ranking best recommendations"
  ];

  useEffect(() => {
    // Simulate progression through the steps
    if (activeStep < steps.length) {
      const timer = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 1500); // 1.5 seconds per step
      return () => clearTimeout(timer);
    } else {
      // Once all steps complete, wait half a second then transition to home
      const finishTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
      return () => clearTimeout(finishTimer);
    }
  }, [activeStep, steps.length, onComplete]);

  return (
    <div className="fimmit-loading-wrapper">
      <div className="fimmit-loading-content">
        
        {/* Headline */}
        <h1 className="fimmit-loading-headline">
          Finding your<br />
          <span className="fimmit-loading-banner-wrapper">
            <span className="fimmit-loading-orange-banner">Issues</span>
          </span>
        </h1>

        {/* Loading Steps */}
        <div className="fimmit-loading-steps">
          {steps.map((text, index) => {
            const isCompleted = index < activeStep;
            const isActive = index === activeStep;
            const isPending = index > activeStep;

            return (
              <div 
                key={index} 
                className={`fimmit-loading-step-block ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${isPending ? 'pending' : ''}`}
              >
                <div className="fimmit-step-top-row">
                  {/* Status Icon */}
                  <div className="fimmit-step-icon">
                    {isCompleted ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#4BD08B" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="9 12 11 14 15 10"></polyline>
                      </svg>
                    ) : (
                      <div className="fimmit-empty-circle"></div>
                    )}
                  </div>
                  
                  {/* Step Text */}
                  <span className="fimmit-step-text">{text}</span>
                </div>

                {/* Progress Bar (Only visible when active) */}
                {isActive && (
                  <div className="fimmit-step-progress-track">
                    <div className="fimmit-step-progress-fill"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
};

export default LoadingPage;