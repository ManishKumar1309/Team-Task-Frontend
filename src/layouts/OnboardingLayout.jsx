import React from 'react';
import logoSrc from '../assets/Logo.svg';
import { Button } from '../components/common/Button';
import './OnboardingLayout.css';

export const OnboardingLayout = ({ children, onExit }) => {
  return (
    <div className="fimmit-onboarding-layout">
      <header className="fimmit-onboarding-layout__header">
        <a
          href="#home"
          className="fimmit-onboarding-layout__brand"
          onClick={(e) => {
            e.preventDefault();
            if (onExit) onExit();
          }}
          aria-label="Fimmit home"
        >
          <img src={logoSrc} alt="" className="fimmit-onboarding-layout__logo" />
          <span className="fimmit-onboarding-layout__title">Fimmit</span>
        </a>
        <Button
          variant="outline"
          size="sm"
          onClick={onExit}
          aria-label="Exit onboarding"
        >
          ✕ Exit
        </Button>
      </header>
      <main className="fimmit-onboarding-layout__card-container">
        {children}
      </main>
    </div>
  );
};

export default OnboardingLayout;
