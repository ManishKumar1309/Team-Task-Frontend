import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { authService } from './services/authService';
import { useSavedIssues } from './hooks/useSavedIssues';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#onboarding') return 'onboarding';
    if (hash === '#home' || hash === '#feed') return 'home';
    return 'landing';
  });

  const { savedCount, savedIssueIds, toggleSave } = useSavedIssues();

  const navigateTo = useCallback((view) => {
    setCurrentView(view);
    const targetHash = view === 'landing' ? '' : `#${view}`;
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash || window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#onboarding') {
        setCurrentView('onboarding');
      } else if (hash === '#home' || hash === '#feed') {
        setCurrentView('home');
      } else if (!hash || hash === '#top') {
        setCurrentView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSignIn = () => {
    const useMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
    if (!useMock) {
      authService.startGitHubLogin();
    } else {
      navigateTo('onboarding');
    }
  };

  const handleOnboardingComplete = () => {
    navigateTo('home');
  };

  const handleNavClick = (e) => {
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {currentView === 'onboarding' ? (
        <OnboardingPage
          onComplete={handleOnboardingComplete}
          onExit={() => navigateTo('landing')}
        />
      ) : (
        <MainLayout
          navbarVariant={currentView}
          savedCount={savedCount}
          userLevel="Intermediate"
          onSignIn={handleSignIn}
          onOpenFeed={() => navigateTo('home')}
          onSavedClick={() => {
            if (currentView !== 'home') {
              navigateTo('home');
            }
            const listEl = document.querySelector('.fimmit-home-page') || document.querySelector('.fimmit-issues-grid');
            if (listEl) {
              listEl.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onNavClick={handleNavClick}
        >
          {currentView === 'landing' ? (
            <LandingPage
              onContinueWithGithub={handleSignIn}
              onHowItWorks={() => {
                const section = document.getElementById('how-it-works');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ) : (
            <HomePage
              savedIssueIds={savedIssueIds}
              onToggleSave={toggleSave}
            />
          )}
        </MainLayout>
      )}
    </>
  );
}