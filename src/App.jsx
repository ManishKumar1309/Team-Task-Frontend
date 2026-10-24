import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { authService } from './services/authService';
import { useSavedIssues } from './hooks/useSavedIssues';
import { LoadingPage } from './pages/LoadingPage';
import { SavedIssuesDrawer } from './components/common/SavedIssuesDrawer';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#onboarding') return 'onboarding';
    if (hash === '#home' || hash === '#feed') return 'home';
    if (hash === '#loading') return 'loading';
    return 'landing';
  });

const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
const { savedCount, savedIssueIds, toggleSave } = useSavedIssues();

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
      } catch (e) {
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
      } catch (e) {
      }
    }
    return ['javascript', 'react', 'python'];
  });

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
      } else if (hash === '#loading') {
        setCurrentView('loading');
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
      if (typeof authService?.startGitHubLogin === 'function') {
        authService.startGitHubLogin();
      }
    } else {
      navigateTo('onboarding');
    }
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
    // Route to the loading sequence instead of immediately to home
    navigateTo('loading');
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
      ) : currentView === 'loading' ? (
        <LoadingPage 
          onComplete={() => navigateTo('home')} 
        />
      ) : (
        <MainLayout
          navbarVariant={currentView}
          savedCount={savedCount}
          userLevel={getDifficultyLabel(profileDifficulty)}
          backendTechTags={backendTechTags}
          username={user?.username || null}
          onSignIn={handleSignIn}
          onOpenFeed={() => navigateTo('home')}
          onSavedClick={() => setIsSavedDrawerOpen(true)}
          onNavClick={handleNavClick}
          onLogout={handleLogout}
          onContinueWithGithub={handleSignIn}
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
              username={user?.username || 'Contributor'}
            />
          )}
        </MainLayout>
      )}
      <SavedIssuesDrawer 
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedIssueIds={Array.isArray(savedIssueIds) ? savedIssueIds : []}
        onRemove={(id) => toggleSave(id)}
      />
    </>
  );
}