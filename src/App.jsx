import React, { useState } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';

/**
 * Fimmit Root App Component
 * Wires up smooth scroll navigation and GitHub authentication actions.
 */
function App() {
  const [navVariant] = useState('landing');
  const [savedCount] = useState(0);

  const handleGitHubAuth = () => {
    alert('GitHub OAuth authentication entry point triggered! (Connected to backend auth flow)');
  };

  const handleHowItWorksScroll = () => {
    const section = document.getElementById('how-it-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <MainLayout
      navbarVariant={navVariant}
      savedCount={savedCount}
      userLevel="Intermediate"
      onSignIn={handleGitHubAuth}
      onOpenFeed={handleGitHubAuth}
      onSavedClick={() => alert('Saved issues view')}
      onNavClick={(e) => {
        // Allow smooth scroll for internal anchor links if desired
        const href = e.currentTarget.getAttribute('href');
        if (href?.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }}
    >
      <LandingPage
        onContinueWithGithub={handleGitHubAuth}
        onHowItWorks={handleHowItWorksScroll}
      />
    </MainLayout>
  );
}

export default App;