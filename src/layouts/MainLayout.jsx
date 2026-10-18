import React from 'react';
import { Navbar } from './Navbar';

/**
 * Fimmit MainLayout Component
 * Wraps page content with the standardized Navbar and consistent background layout.
 */
export const MainLayout = ({
  children,
  navbarVariant = 'landing',
  savedCount = 0,
  userLevel = 'Intermediate',
  onSignIn,
  onOpenFeed,
  onSavedClick,
  className = '',
}) => {
  return (
    <div className={`fimmit-main-layout ${className}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-cream)' }}>
      <Navbar
        variant={navbarVariant}
        savedCount={savedCount}
        userLevel={userLevel}
        onSignIn={onSignIn}
        onOpenFeed={onOpenFeed}
        onSavedClick={onSavedClick}
      />
      <main style={{ flex: 1, width: '100%' }}>
        {children}
      </main>
    </div>
  );
};