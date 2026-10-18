import React from 'react';
import { Button } from '../common/Button';
import logoSrc from '../../assets/Logo.svg';
import './FinalCtaFooter.css';

/**
 * Fimmit FinalCtaFooter Component (Section E & F)
 * Closing CTA section and clean footer with brand links.
 */
export const FinalCtaFooter = ({ onContinueWithGithub }) => {
  return (
    <>
      {/* Section E - Final CTA */}
      <section className="fimmit-final-cta" aria-label="Final call to action">
        <div className="fimmit-cta__container">
          <h2 className="fimmit-cta__title">Ready to find your next open-source contribution?</h2>
          <p className="fimmit-cta__subtitle">
            Connect your GitHub account and discover personalized issues in seconds.
          </p>
          <Button variant="primary" size="lg" onClick={onContinueWithGithub}>
            Continue with Github
          </Button>
        </div>
      </section>

      {/* Section F - Footer */}
      <footer className="fimmit-footer" aria-label="Site footer">
        <div className="fimmit-footer__container">
          <div className="fimmit-footer__brand">
            <img src={logoSrc} alt="Fimmit Logo" className="fimmit-footer__logo-img" />
            <span className="fimmit-footer__brand-text">Fimmit</span>
          </div>
          <p className="fimmit-footer__copy">
            © {new Date().getFullYear()} Fimmit. Built for open-source developers.
          </p>
          <div className="fimmit-footer__links">
            <a href="#how-it-works" className="fimmit-footer__link">How it works</a>
            <a href="#features" className="fimmit-footer__link">Features</a>
            <a href="#about" className="fimmit-footer__link">About</a>
          </div>
        </div>
      </footer>
    </>
  );
};