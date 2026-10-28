import React, { useState, useEffect, useRef } from 'react';
import logoSrc from '../assets/Logo.svg';
import './Navbar.css';

export const Navbar = ({
  variant = 'landing',
  savedCount = 0,
  userLevel = 'Intermediate',
  backendTechTags = [],
  username = null,
  onSignIn,
  onOpenFeed,
  onSavedClick,
  onNavClick,
  onLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Display only the tags selected by the user (tech stack & domain)
  const finalTags = Array.isArray(backendTechTags) ? backendTechTags : [];

  return (
    <nav className={`fimmit-navbar ${variant}`}>
      <div className="fimmit-nav-container">

        {variant === 'home' ? (
          /* --- AUTHENTICATED VIEW (HOME) --- */
          <>
            <div className="fimmit-nav-left-stacked">
              {/* Top Row: Logo */}
              <div
                className="fimmit-nav-brand"
                onClick={onOpenFeed}
                style={{ cursor: 'pointer' }}
                title="Go to Feed"
              >
                <img src={logoSrc} alt="Fimmit Logo" className="fimmit-nav-logo-icon" />
                <span className="fimmit-nav-logo-text">Fimmit<sup className="fimmit-nav-reg">®</sup></span>
              </div>

              {/* Bottom Row: Search Tags */}
              {finalTags.length > 0 && (
                <div className="fimmit-nav-tags-row">
                  <span className="fimmit-nav-tags-label">Search tags:</span>
                  {finalTags.map((tag, index) => (
                    <span key={index} className="fimmit-nav-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="fimmit-nav-right">
              <div className="fimmit-nav-auth-controls">
                {/* Solid Black Saved Button */}
                <button type="button" className="fimmit-nav-saved-btn solid-black" onClick={onSavedClick}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Saved ({savedCount})
                </button>

                {/* Vertical Divider */}
                <div className="fimmit-nav-divider"></div>

                {/* Profile Area with Dropdown */}
                <div className="fimmit-nav-profile-wrapper" ref={dropdownRef}>
                  <div
                    className="fimmit-nav-profile"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    title="Account options"
                  >
                    <div className="fimmit-nav-avatar">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div className="fimmit-nav-profile-details">
                      <span className="fimmit-nav-profile-name">
                        Your Github @{username ? username : ''}
                        <svg className={`fimmit-nav-chevron ${isDropdownOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </span>
                      <span className="fimmit-nav-profile-badge">
                        {userLevel}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="fimmit-nav-dropdown">
                      <div className="fimmit-nav-dropdown-content">
                        <span className="fimmit-nav-dropdown-title">Signed in as</span>

                        <div className="fimmit-nav-dropdown-user">
                          <div className="fimmit-nav-dropdown-mini-avatar"></div>
                          <span className="fimmit-nav-dropdown-username">
                            Your Github @{username ? username : ''}
                          </span>
                        </div>

                        <div className="fimmit-nav-dropdown-divider"></div>

                        <button
                          className="fimmit-nav-dropdown-logout-btn"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            if (onLogout) onLogout();
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </svg>
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </>
        ) : (
          /* --- UNAUTHENTICATED VIEW (LANDING) --- */
          <>
            <div className="fimmit-nav-brand">
              <img src={logoSrc} alt="Fimmit Logo" className="fimmit-nav-logo-icon" />
              <span className="fimmit-nav-logo-text">Fimmit<sup className="fimmit-nav-reg">®</sup></span>
            </div>

            <div className="fimmit-nav-right">
              <div className="fimmit-nav-center-links">
                <a href="#how-it-works" onClick={onNavClick}>How it works</a>
                <a href="#faqs" onClick={onNavClick}>FAQS</a>
                <a href="#about" onClick={onNavClick}>About</a>
              </div>

              <button type="button" className="fimmit-nav-btn primary" onClick={onOpenFeed}>
                Open my feed
              </button>
              <button type="button" className="fimmit-nav-btn secondary" onClick={onSignIn}>
                Sign in
              </button>
            </div>
          </>
        )}

      </div>
    </nav>
  );
};

export default Navbar;