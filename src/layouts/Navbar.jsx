import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import logoSrc from '../assets/Logo.svg';
import './Navbar.css';

export const Navbar = ({
  variant = 'landing',
  savedCount = 0,
  userLevel = 'Intermediate',
  username = null,
  onSignIn,
  onOpenFeed,
  onSavedClick,
  onNavClick,
  onLogout,
  className = '',
  backendTechTags = [],
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dropdownRef = useRef(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      if (onLogout) {
        await onLogout();
      }
      setIsDropdownOpen(false);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className={`fimmit-navbar-container ${className}`}>
      <div className="fimmit-navbar">
        
        {/* Left Side: Logo */}
        <div className="fimmit-navbar__left">
          <a href="#home" className="fimmit-logo" aria-label="Fimmit Home">
            <img src={logoSrc} alt="Fimmit Logo" className="fimmit-logo__img" />
            <span className="fimmit-logo__text">Fimmit</span>
          </a>
        </div>

        {/* Center: Navigation or Technology Tags */}
        <nav className="fimmit-navbar__nav">
          {variant === 'landing' ? (
            <>
              <a href="#how-it-works" className="fimmit-nav-link" onClick={onNavClick}>How it works</a>
              <a href="#features" className="fimmit-nav-link" onClick={onNavClick}>Features</a>
              <a href="#about" className="fimmit-nav-link" onClick={onNavClick}>About</a>
            </>
          ) : (
            Array.isArray(backendTechTags) && backendTechTags.length > 0 ? (
              <div className="fimmit-navbar__lang-tags" aria-label="Technology tags">
                {backendTechTags.map((tag) => {
                  const cleanTag = String(tag).replace(/^#/, '').toLowerCase();
                  return (
                    <span key={cleanTag} className="fimmit-nav-display-tag">
                      #{cleanTag}
                    </span>
                  );
                })}
              </div>
            ) : null
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="fimmit-navbar__actions">
          {variant === 'landing' ? (
            <>
              <Button variant="outline" size="md" onClick={onOpenFeed}>Open my feed</Button>
              <Button variant="black" size="md" onClick={onSignIn}>Sign in</Button>
            </>
          ) : (
            <>
              {/* Saved Issues Button */}
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
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Saved ({savedCount})</span>
              </button>
              
              {/* Interactive Profile Button & Dropdown Container */}
              <div className="fimmit-navbar__profile-wrapper" ref={dropdownRef}>
                <button
                  type="button"
                  className={`fimmit-navbar__profile-btn ${isDropdownOpen ? 'is-active' : ''}`}
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  aria-label={`User menu for ${username || 'profile'}`}
                >
                  <div className="fimmit-profile-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div className="fimmit-profile-details">
                    <span className="fimmit-profile-name">
                      {username ? `@${username}` : 'Your Profile'}
                    </span>
                    <Badge variant="yellow" size="sm">{userLevel}</Badge>
                  </div>
                  <svg
                    className={`fimmit-profile-chevron ${isDropdownOpen ? 'is-open' : ''}`}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {/* Profile Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="fimmit-profile-dropdown" role="menu" aria-orientation="vertical">
                    <div className="fimmit-dropdown-header">
                      <span className="fimmit-dropdown-label">Signed in as</span>
                      <span className="fimmit-dropdown-username">
                        {username ? `@${username}` : 'Authenticated User'}
                      </span>
                    </div>
                    
                    <hr className="fimmit-dropdown-divider" />
                    
                    <button
                      type="button"
                      className="fimmit-dropdown-item fimmit-dropdown-item--logout"
                      onClick={handleLogoutClick}
                      disabled={isLoggingOut}
                      role="menuitem"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="fimmit-navbar__mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="fimmit-hamburger-line"></span>
          <span className="fimmit-hamburger-line"></span>
          <span className="fimmit-hamburger-line"></span>
        </button>
      </div>
      
      {/* Mobile Drawer */}
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
            <div className="fimmit-mobile-actions">
              <button
                type="button"
                className="fimmit-nav-saved-pill"
                onClick={() => { toggleMobileMenu(); onSavedClick?.(); }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Saved ({savedCount})</span>
              </button>
              
              <div className="fimmit-mobile-profile" style={{ marginTop: '1rem', flexDirection: 'column', alignItems: 'stretch', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="fimmit-profile-name">{username ? `@${username}` : 'Your Profile'}</span>
                  <Badge variant="yellow" size="sm">{userLevel}</Badge>
                </div>
                
                <Button variant="outline" size="md" onClick={handleLogoutClick} disabled={isLoggingOut}>
                  {isLoggingOut ? 'Logging out...' : 'Log out'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};