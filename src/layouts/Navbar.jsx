import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import logoSrc from '../assets/Logo.svg';
import './Navbar.css';

/**
 * Fimmit Navbar Component
 * Supports both Landing page actions ("Open my feed", "Sign in") and 
 * Home/Recommendations page actions (Profile summary, Estimated level, Saved count).
 * Uses the official brand Logo.svg asset.
 */
export const Navbar = ({
  variant = 'landing', // 'landing' | 'home'
  savedCount = 0,
  userLevel = 'Intermediate',
  onSignIn,
  onOpenFeed,
  onSavedClick,
  onNavClick,
  className = '',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`fimmit-navbar-container ${className}`}>
      <div className="fimmit-navbar">
        {/* Brand Logo with Logo.svg */}
        <a href="#home" className="fimmit-logo" aria-label="Fimmit Home">
          <img src={logoSrc} alt="Fimmit Logo" className="fimmit-logo__img" />
          <span className="fimmit-logo__text">Fimmit</span>
        </a>

        {/* Profile Summary (Home Variant Only) */}
        {variant === 'home' && (
          <div className="fimmit-navbar__profile-summary" role="region" aria-label="User profile summary">
            <span className="fimmit-navbar__profile-label">Your profile</span>
            <span className="fimmit-navbar__profile-divider" aria-hidden="true">•</span>
            <span className="fimmit-navbar__level-text">Estimated level:</span>
            <Badge variant="yellow" size="sm">
              {userLevel}
            </Badge>
          </div>
        )}

        {/* Desktop Navigation Links (Landing Variant Only) */}
        {variant === 'landing' && (
          <nav className="fimmit-navbar__nav" aria-label="Main navigation">
            <a href="#how-it-works" className="fimmit-nav-link" onClick={onNavClick}>
              How it works
            </a>
            <a href="#features" className="fimmit-nav-link" onClick={onNavClick}>
              Features
            </a>
            <a href="#about" className="fimmit-nav-link" onClick={onNavClick}>
              About
            </a>
          </nav>
        )}

        {/* Desktop Actions */}
        <div className="fimmit-navbar__actions">
          {variant === 'landing' ? (
            <>
              <Button variant="outline" size="md" onClick={onOpenFeed}>
                Open my feed
              </Button>
              <Button variant="black" size="md" onClick={onSignIn}>
                Sign in
              </Button>
            </>
          ) : (
            <Button
              variant="black"
              size="md"
              onClick={onSavedClick}
              aria-label={`Saved issues (${savedCount})`}
            >
              🔖 Saved ({savedCount})
            </Button>
          )}
        </div>

        {/* Mobile Menu Hamburger Toggle */}
        <button
          type="button"
          className="fimmit-navbar__mobile-toggle"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="fimmit-hamburger-line" aria-hidden="true"></span>
          <span className="fimmit-hamburger-line" aria-hidden="true"></span>
          <span className="fimmit-hamburger-line" aria-hidden="true"></span>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fimmit-mobile-menu" role="dialog" aria-label="Mobile navigation menu">
          {variant === 'landing' ? (
            <>
              <a href="#how-it-works" className="fimmit-mobile-link" onClick={toggleMobileMenu}>
                How it works
              </a>
              <a href="#features" className="fimmit-mobile-link" onClick={toggleMobileMenu}>
                Features
              </a>
              <a href="#about" className="fimmit-mobile-link" onClick={toggleMobileMenu}>
                About
              </a>
              <div className="fimmit-mobile-actions">
                <Button variant="outline" size="md" onClick={() => { toggleMobileMenu(); onOpenFeed?.(); }}>
                  Open my feed
                </Button>
                <Button variant="black" size="md" onClick={() => { toggleMobileMenu(); onSignIn?.(); }}>
                  Sign in
                </Button>
              </div>
            </>
          ) : (
            <div className="fimmit-mobile-actions">
              <div className="fimmit-mobile-profile">
                <span>Your profile</span>
                <Badge variant="yellow" size="sm">{userLevel}</Badge>
              </div>
              <Button variant="black" size="md" onClick={() => { toggleMobileMenu(); onSavedClick?.(); }}>
                🔖 Saved ({savedCount})
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};