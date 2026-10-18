import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import logoSrc from '../assets/Logo.svg';
import './Navbar.css';

export const Navbar = ({
  variant = 'landing',
  savedCount = 0,
  userLevel = 'Intermediate',
  onSignIn,
  onOpenFeed,
  onSavedClick,
  onNavClick,
  className = '',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className={`fimmit-navbar-container ${className}`}>
      <div className="fimmit-navbar">
        
        {/* Left Side: Logo ONLY */}
        <div className="fimmit-navbar__left">
          <a href="#home" className="fimmit-logo" aria-label="Fimmit Home">
            <img src={logoSrc} alt="Fimmit Logo" className="fimmit-logo__img" />
            <span className="fimmit-logo__text">Fimmit</span>
          </a>
        </div>

        {/* Center: Language Tags */}
        <nav className="fimmit-navbar__nav">
          {variant === 'landing' ? (
            <>
              <a href="#how-it-works" className="fimmit-nav-link" onClick={onNavClick}>How it works</a>
              <a href="#features" className="fimmit-nav-link" onClick={onNavClick}>Features</a>
              <a href="#about" className="fimmit-nav-link" onClick={onNavClick}>About</a>
            </>
          ) : (
            <div className="fimmit-navbar__lang-tags">
              <span className="fimmit-lang-tag">#JavaScript</span>
              <span className="fimmit-lang-tag">#React</span>
              <span className="fimmit-lang-tag">#TypeScript</span>
            </div>
          )}
        </nav>

        {/* Right Side Actions: Saved Button + Profile (Rightmost) */}
        <div className="fimmit-navbar__actions">
          {variant === 'landing' ? (
            <>
              <Button variant="outline" size="md" onClick={onOpenFeed}>Open my feed</Button>
              <Button variant="black" size="md" onClick={onSignIn}>Sign in</Button>
            </>
          ) : (
            <>
              <Button variant="black" size="md" onClick={onSavedClick}>
                🔖 Saved ({savedCount})
              </Button>
              
              {/* Profile now lives on the rightmost side */}
              <div className="fimmit-navbar__profile-summary" role="region">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="fimmit-navbar__profile-label">Profile</span>
                <Badge variant="yellow" size="sm">{userLevel}</Badge>
              </div>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button type="button" className="fimmit-navbar__mobile-toggle" onClick={toggleMobileMenu}>
          <span className="fimmit-hamburger-line"></span>
          <span className="fimmit-hamburger-line"></span>
          <span className="fimmit-hamburger-line"></span>
        </button>
      </div>
      
      {/* Mobile Drawer Menu (Kept unchanged) */}
      {isMobileMenuOpen && (
        <div className="fimmit-mobile-menu" role="dialog" aria-label="Mobile navigation menu">
          {variant === 'landing' ? (
            <>
              <a href="#how-it-works" className="fimmit-mobile-link" onClick={toggleMobileMenu}>How it works</a>
              <a href="#features" className="fimmit-mobile-link" onClick={toggleMobileMenu}>Features</a>
              <a href="#about" className="fimmit-mobile-link" onClick={toggleMobileMenu}>About</a>
              <div className="fimmit-mobile-actions">
                <Button variant="outline" size="md" onClick={() => { toggleMobileMenu(); onOpenFeed?.(); }}>Open my feed</Button>
                <Button variant="black" size="md" onClick={() => { toggleMobileMenu(); onSignIn?.(); }}>Sign in</Button>
              </div>
            </>
          ) : (
            <>
              <div className="fimmit-mobile-actions">
                <Button variant="black" size="md" onClick={() => { toggleMobileMenu(); onSavedClick?.(); }}>
                  🔖 Saved ({savedCount})
                </Button>
                <div className="fimmit-mobile-profile" style={{ marginTop: '1rem' }}>
                  <span>Your profile</span>
                  <Badge variant="yellow" size="sm">{userLevel}</Badge>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};