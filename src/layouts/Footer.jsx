import React from 'react';
import logoSrc from '../assets/Logo.svg';
import './Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fimmit-footer">
      <div className="fimmit-footer__container">
        
        {/* Top Section: Brand & Tagline */}
        <div className="fimmit-footer__brand-section">
          <a href="#top" className="fimmit-footer__logo" aria-label="Fimmit Home">
            <img src={logoSrc} alt="Fimmit Logo" className="fimmit-footer__logo-img" />
            <span className="fimmit-footer__logo-text">Fimmit</span>
          </a>
          <p className="fimmit-footer__tagline">
            Match with open-source issues tuned precisely to your tech stack, skill level, and developer journey.
          </p>
        </div>

        {/* Center Section: Navigation Links */}
        <div className="fimmit-footer__links-section">
          <div className="fimmit-footer__column">
            <h4 className="fimmit-footer__column-title">Explore</h4>
            <ul className="fimmit-footer__link-list">
              <li><a href="#feed" className="fimmit-footer__link">Recommendations</a></li>
              <li><a href="#how-it-works" className="fimmit-footer__link">How It Works</a></li>
              <li><a href="#features" className="fimmit-footer__link">Features</a></li>
            </ul>
          </div>

          <div className="fimmit-footer__column">
            <h4 className="fimmit-footer__column-title">Community</h4>
            <ul className="fimmit-footer__link-list">
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="fimmit-footer__link"
                >
                  GitHub Community
                </a>
              </li>
              <li><a href="#about" className="fimmit-footer__link">About Fimmit</a></li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Bar: Copyright Notice */}
      <div className="fimmit-footer__bottom">
        <div className="fimmit-footer__bottom-container">
          <p className="fimmit-footer__copyright">
            © {currentYear} Fimmit. Built for open-source contributors. All rights reserved.
          </p>
          <div className="fimmit-footer__badge">
            <span className="fimmit-footer__badge-dot"></span>
            <span>ML Engine Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;