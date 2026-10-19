
import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { authService } from './services/authService';
import { useSavedIssues } from './hooks/useSavedIssues';

const normalizeDifficulty = (value) => {
  const difficulty = String(value || '').toLowerCase().trim();

  return {
    beginner: 'easy',
    intermediate: 'medium',
    expert: 'hard',
    easy: 'easy',
    medium: 'medium',
    hard: 'hard',
  }[difficulty] || 'medium';
};

const getDifficultyLabel = (difficulty) => {
  return {
    easy: 'Beginner',
    medium: 'Intermediate',
    hard: 'Expert',
  }[normalizeDifficulty(difficulty)];
};

const readStoredTags = () => {
  try {
    const saved = sessionStorage.getItem('fimmit_tech_tags');
    const tags = saved ? JSON.parse(saved) : [];
    return Array.isArray(tags) ? tags : [];
  } catch {
    return [];
  }
};

const readStoredDifficulty = () => {
  return normalizeDifficulty(
    sessionStorage.getItem('fimmit_user_difficulty') || 'medium'
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.toLowerCase();

    if (hash === '#onboarding') return 'onboarding';
    if (hash === '#home' || hash === '#feed') return 'home';
    return 'landing';
  });

  const { savedCount, savedIssueIds, toggleSave } = useSavedIssues();

  const [profileDifficulty, setProfileDifficulty] =
    useState(readStoredDifficulty);

  const [backendTechTags, setBackendTechTags] =
    useState(readStoredTags);

  const navigateTo = useCallback((view) => {
    setCurrentView(view);

    const targetHash = view === 'landing' ? '' : `#${view}`;

    if (window.location.hash !== targetHash) {
      window.history.pushState(
        null,
        '',
        targetHash || window.location.pathname
      );
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

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSignIn = () => {
    const useMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

    if (!useMock) {
      authService.startGitHubLogin();
    } else {
      navigateTo('onboarding');
    }
  };

  const handleOnboardingComplete = (data) => {
    // Prefer the newly submitted survey value.
    // Fall back to session storage if the callback has no difficulty.
    const submittedDifficulty =
      data?.preferredDifficulty ??
      sessionStorage.getItem('fimmit_user_difficulty') ??
      'medium';

    const difficulty = normalizeDifficulty(submittedDifficulty);

    // Update React state so the Navbar badge rerenders immediately.
    setProfileDifficulty(difficulty);

    // Persist the normalized value for the current session.
    sessionStorage.setItem('fimmit_user_difficulty', difficulty);

    if (Array.isArray(data?.preferredTechStack)) {
      const tags = data.preferredTechStack
        .filter(
          (tag) => typeof tag === 'string' && tag.trim().length > 0
        )
        .map((tag) => tag.trim());

      setBackendTechTags(tags);
      sessionStorage.setItem('fimmit_tech_tags', JSON.stringify(tags));
    }

    navigateTo('home');
  };

  const handleNavClick = (event) => {
    const href = event.currentTarget.getAttribute('href');

    if (href?.startsWith('#')) {
      event.preventDefault();

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
          onSignIn={handleSignIn}
          onOpenFeed={() => navigateTo('home')}
          onSavedClick={() => {
            if (currentView !== 'home') {
              navigateTo('home');
            }

            const listElement =
              document.querySelector('.fimmit-home-page') ||
              document.querySelector('.fimmit-issues-grid');

            if (listElement) {
              listElement.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onNavClick={handleNavClick}
        >
          {currentView === 'landing' ? (
            <LandingPage
              onContinueWithGithub={handleSignIn}
              onHowItWorks={() => {
                const section = document.getElementById('how-it-works');

                if (section) {
                  section.scrollIntoView({ behavior: 'smooth' });
                }
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
