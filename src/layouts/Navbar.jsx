
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
  backendTechTags = [],
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Show actual saved technologies, with defaults if none are available.
  const technologyTags =
    Array.isArray(backendTechTags) && backendTechTags.length > 0
      ? backendTechTags
      : ['JavaScript', 'React', 'Python'];

  const renderTechnologyTags = () => (
    <div
      className="fimmit-navbar__lang-tags"
      aria-label="Technology tags"
    >
      {technologyTags.map((tag) => {
        const cleanTag = String(tag).replace(/^#/, '').trim();

        if (!cleanTag) return null;

        return (
          <span
            key={cleanTag.toLowerCase()}
            className="fimmit-nav-display-tag"
          >
            #{cleanTag.toLowerCase()}
          </span>
        );
      })}
    </div>
  );

  return (
    <header className={`fimmit-navbar-container ${className}`}>
      <div className="fimmit-navbar">
        {/* Left Side: Logo */}
        <div className="fimmit-navbar__left">
          <a href="#home" className="fimmit-logo" aria-label="Fimmit Home">
            <img
              src={logoSrc}
              alt="Fimmit Logo"
              className="fimmit-logo__img"
            />
            <span className="fimmit-logo__text">Fimmit</span>
          </a>
        </div>

        {/* Center: Navigation or Technology Tags */}
        <nav className="fimmit-navbar__nav">
          {variant === 'landing' ? (
            <>
              <a
                href="#how-it-works"
                className="fimmit-nav-link"
                onClick={onNavClick}
              >
                How it works
              </a>
              <a
                href="#features"
                className="fimmit-nav-link"
                onClick={onNavClick}
              >
                Features
              </a>
              <a
                href="#about"
                className="fimmit-nav-link"
                onClick={onNavClick}
              >
                About
              </a>
            </>
          ) : (
            renderTechnologyTags()
          )}
        </nav>

        {/* Right Side Actions */}
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
            <>
              <button
                type="button"
                className="fimmit-nav-saved-pill"
                onClick={onSavedClick}
                aria-label={`Saved issues (${savedCount})`}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span>Saved ({savedCount})</span>
              </button>

              <button
                type="button"
                className="fimmit-navbar__profile-btn"
                onClick={() => alert('Profile clicked!')}
                aria-label={`Profile level: ${userLevel}`}
              >
                <div className="fimmit-profile-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>

                <div className="fimmit-profile-details">
                  <span className="fimmit-profile-name">Your Profile</span>
                  <Badge variant="yellow" size="sm">
                    {userLevel}
                  </Badge>
                </div>
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="fimmit-navbar__mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="fimmit-hamburger-line" />
          <span className="fimmit-hamburger-line" />
          <span className="fimmit-hamburger-line" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fimmit-mobile-menu"
          role="dialog"
          aria-label="Mobile navigation menu"
        >
          {variant === 'landing' ? (
            <>
              <a
                href="#how-it-works"
                className="fimmit-mobile-link"
                onClick={toggleMobileMenu}
              >
                How it works
              </a>
              <a
                href="#features"
                className="fimmit-mobile-link"
                onClick={toggleMobileMenu}
              >
                Features
              </a>
              <a
                href="#about"
                className="fimmit-mobile-link"
                onClick={toggleMobileMenu}
              >
                About
              </a>

              <div className="fimmit-mobile-actions">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    toggleMobileMenu();
                    onOpenFeed?.();
                  }}
                >
                  Open my feed
                </Button>
                <Button
                  variant="black"
                  size="md"
                  onClick={() => {
                    toggleMobileMenu();
                    onSignIn?.();
                  }}
                >
                  Sign in
                </Button>
              </div>
            </>
          ) : (
            <div className="fimmit-mobile-actions">
              {renderTechnologyTags()}

              <button
                type="button"
                className="fimmit-nav-saved-pill"
                onClick={() => {
                  toggleMobileMenu();
                  onSavedClick?.();
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span>Saved ({savedCount})</span>
              </button>

              <div
                className="fimmit-mobile-profile"
                style={{ marginTop: '1rem' }}
              >
                <span>Your Profile</span>
                <Badge variant="yellow" size="sm">
                  {userLevel}
                </Badge>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
