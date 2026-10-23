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