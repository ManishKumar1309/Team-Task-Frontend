import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import './MainLayout.css';

export const MainLayout = ({
  children,
  navbarVariant = 'landing',
  savedCount = 0,
  userLevel = 'Intermediate',
  backendTechTags = [],
  username = null,
  onSignIn,
  onOpenFeed,
  onSavedClick,
  onNavClick,
  onLogout,
  onContinueWithGithub = () => {},
  className = '',
}) => {
  return (
    <div className={`fimmit-main-layout ${className}`}>
      <Navbar
        variant={navbarVariant}
        savedCount={savedCount}
        userLevel={userLevel}
        backendTechTags={backendTechTags}
        username={username}
        onSignIn={onSignIn}
        onOpenFeed={onOpenFeed}
        onSavedClick={onSavedClick}
        onNavClick={onNavClick}
        onLogout={onLogout}
      />
      <main className="fimmit-main-content">{children}</main>
      <Footer onContinueWithGithub={onContinueWithGithub} />
    </div>
  );
};

export default MainLayout;