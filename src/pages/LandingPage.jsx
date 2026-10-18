import React from 'react';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { MatchingPreview } from '../components/landing/MatchingPreview';
import { WhyFimmit } from '../components/landing/WhyFimmit';
import { FinalCtaFooter } from '../components/landing/FinalCtaFooter';
import './LandingPage.css';

/**
 * Fimmit LandingPage Component
 * Assembles all landing page sections into a cohesive art-directed layout.
 */
export const LandingPage = ({ onContinueWithGithub, onHowItWorks }) => {
  return (
    <div className="fimmit-landing-page">
      <Hero
        onContinueWithGithub={onContinueWithGithub}
        onHowItWorks={onHowItWorks}
      />
      <HowItWorks />
      <MatchingPreview />
      <WhyFimmit />
      <FinalCtaFooter onContinueWithGithub={onContinueWithGithub} />
    </div>
  );
};