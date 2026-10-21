import React from 'react';
import logoSrc from '../assets/Logo.svg';
import './Navbar.css';

export const Navbar = ({
  variant = 'landing',
  onSignIn,
  onOpenFeed,
  onNavClick,
  className = '',
}) => {
  return (
    <header className={`fimmit-navbar-container ${className}`}>
      <div className="fimmit-navbar">
        
        <div className="fimmit-navbar__left">
          <a href="#top" className="fimmit-logo" aria-label="Fimmit Home">
            <img src={logoSrc} alt="Fimmit Logo" className="fimmit-logo__img" />
            <span className="fimmit-logo__text">Fimmit</span>
            <span className="fimmit-logo__registered">®</span>
          </a>
        </div>

        <div className="fimmit-navbar__right">
          <nav className="fimmit-navbar__links">
            <a href="#how-it-works" className="fimmit-nav-link" onClick={onNavClick}>How it works</a>
            <a href="#faqs" className="fimmit-nav-link" onClick={onNavClick}>FAQS</a>
            <a href="#about" className="fimmit-nav-link" onClick={onNavClick}>About</a>
          </nav>

          <div className="fimmit-navbar__actions">
            <button 
              type="button" 
              className="fimmit-btn-orange-pill" 
              onClick={onOpenFeed}
            >
              Open my feed
            </button>
            <button 
              type="button" 
              className="fimmit-btn-black-pill" 
              onClick={onSignIn}
            >
              Sign in
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;