import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { authService } from './services/authService';
import { useSavedIssues } from './hooks/useSavedIssues';
import { SavedIssuesDrawer } from './components/recommendations/SavedIssuesDrawer';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#onboarding') return 'onboarding';
    if (hash === '#home' || hash === '#feed') return 'home';
    return 'landing';
  });

  const {
    savedIssues,
    savedIssueIds,
    savedCount,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleSave,
    removeSavedIssue,
  } = useSavedIssues();

  const [profileDifficulty, setProfileDifficulty] = useState(() => {
    return sessionStorage.getItem('fimmit_user_difficulty') || 'medium';
  });

  const [user, setUser] = useState(() => {
    if (typeof authService?.getCurrentUser === 'function') {
      return authService.getCurrentUser() || null;
    }
    const savedUser = sessionStorage.getItem('fimmit_user_data');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        // Fallback if parsing fails
      }
    }
    return null;
  });

const getDifficultyLabel = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return 'Easy';
      case 'medium':
        return 'Medium';
      case 'hard':
        return 'Hard';
      default:
        return 'Medium';
    }
  };

  // Backend-Provided Technology Tags
  const [backendTechTags, setBackendTechTags] = useState(() => {
    const saved = sessionStorage.getItem('fimmit_tech_tags');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return ['javascript', 'react', 'python'];
  });

  const navigateTo = useCallback((view) => {
    setCurrentView(view);
    const targetHash = view === 'landing' ? '' : `#${view}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash || '#top';
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
    try {
      const useMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
      if (!useMock) {
        if (typeof authService?.startGitHubLogin === 'function') {
          authService.startGitHubLogin();
          return;
        }
      }

      const mockUser = authService.getCurrentUser() || {
        username: 'developer',
        avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
      };
      setUser(mockUser);
      authService.setCurrentUser(mockUser);
    } catch (err) {
      console.warn('Sign in error, proceeding to onboarding:', err);
    } finally {
      navigateTo('onboarding');
    }
  };

  const handleHeroGetStarted = () => {
    handleSignIn();
  };

  const handleOnboardingComplete = (data) => {
    if (data?.preferredDifficulty) {
      const rawDiff = data.preferredDifficulty.toLowerCase();
      setProfileDifficulty(rawDiff);
      sessionStorage.setItem('fimmit_user_difficulty', rawDiff);
    }
    if (data?.preferredTechStack && Array.isArray(data.preferredTechStack)) {
      setBackendTechTags(data.preferredTechStack);
      sessionStorage.setItem('fimmit_tech_tags', JSON.stringify(data.preferredTechStack));
    }
    if (data?.preferredIssues && Array.isArray(data.preferredIssues)) {
      sessionStorage.setItem('fimmit_preferred_issues', JSON.stringify(data.preferredIssues));
    }
    const authedUser = authService.getCurrentUser() || {
      username: 'developer',
      avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
    };
    setUser(authedUser);
    authService.setCurrentUser(authedUser);
    navigateTo('home');
  };

  const handleLogout = async () => {
    try {
      if (typeof authService?.logout === 'function') {
        await authService.logout();
      }
    } catch (err) {
      console.error('Error during logout service call:', err);
    } finally {
      setUser(null);
      sessionStorage.removeItem('fimmit_user_data');
      sessionStorage.removeItem('fimmit_user_difficulty');
      sessionStorage.removeItem('fimmit_tech_tags');
      sessionStorage.removeItem('fimmit_preferred_issues');

      // Redirect to landing view
      navigateTo('landing');
    }
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
          userLevel={getDifficultyLabel(profileDifficulty)}
          backendTechTags={backendTechTags}
          username={user?.username || null}
          user={user}
          isAuthenticated={Boolean(user)}
          onSignIn={handleSignIn}
          onOpenFeed={() => navigateTo('home')}
          onSavedClick={openDrawer}
          onNavClick={handleNavClick}
          onLogout={handleLogout}
          onContinueWithGithub={handleSignIn}
        >
          {currentView === 'landing' ? (
            <LandingPage
              onContinueWithGithub={handleHeroGetStarted}
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

      {/* Persistent Saved Issues Side Drawer */}
      <SavedIssuesDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        savedIssues={savedIssues}
        onRemove={removeSavedIssue}
      />
    </>
  );
}