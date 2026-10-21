import React from 'react';
import githubIcon from '../assets/github.png';
import logoSrc from '../assets/Logo.svg';
import './Footer.css';

export const Footer = ({ onContinueWithGithub }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="fimmit-footer-section">
      <div className="fimmit-cta-banner">
        <h2 className="fimmit-cta-title">
          Your next PR is<br />already open<br />somewhere.
        </h2>
        <button type="button" className="fimmit-footer-github-btn" onClick={onContinueWithGithub}>
          <img src={githubIcon} alt="Github" className="fimmit-footer-github-icon" aria-hidden="true" />
          Continue with Github
        </button>
      </div>

      <div className="fimmit-sub-footer">
        <div className="fimmit-sub-footer-logo">
          <img src={logoSrc} alt="Fimmit Logo" />
          <span>Fimmit</span>
          <span style={{fontSize: '0.75rem', verticalAlign: 'super'}}>®</span>
        </div>
        <span className="fimmit-sub-footer-copy">
          © 2026 Fimmit. A prototype, built for contributors.
        </span>
        <button type="button" className="fimmit-back-to-top" onClick={scrollToTop}>
          Back to top ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;