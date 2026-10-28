import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/Homepage';
import { OnboardingPage } from './pages/OnboardingPage';
import { LoadingPage } from './pages/LoadingPage';
import { authService } from './services/authService';
import { useSavedIssues } from './hooks/useSavedIssues';
import { SavedIssuesDrawer } from './components/common/SavedIssuesDrawer';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const rawHash = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1).replace(/^\/?/, '')
      : '';
    const hashQuery = rawHash.includes('?') ? rawHash.split('?')[1] : rawHash;
    const hashParams = new URLSearchParams(hashQuery);
    const hasOAuthParams = searchParams.has('code') || searchParams.has('error') ||
                           hashParams.has('code') || hashParams.has('error');

    if (hasOAuthParams) {
      return 'landing';
    }

    const isAuthed = authService.isAuthenticated();
    const hash = window.location.hash.toLowerCase();

    // Do NOT automatically route to onboarding, home, or loading without validated auth
    if (hash === '#onboarding') {
      if (isAuthed) return 'onboarding';
      if (typeof window !== 'undefined' && window.history?.replaceState) {
        window.history.replaceState(null, document.title, window.location.pathname);
      }
      return 'landing';
    }

    if (hash === '#home' || hash === '#feed') {
      if (isAuthed) return 'home';
      if (typeof window !== 'undefined' && window.history?.replaceState) {
        window.history.replaceState(null, document.title, window.location.pathname);
      }
      return 'landing';
    }

    if (hash === '#loading') {
      if (isAuthed) return 'loading';
      return 'landing';
    }

    return 'landing';
  });

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);

  const authExchangeInFlightRef = useRef(false);
  const exchangedCodeRef = useRef(null);

  const {
    savedCount,
    savedIssueIds,
    savedRepositories,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleSave,
    removeSavedIssue,
    saveError,
    clearSaveError,
  } = useSavedIssues();

  const [profileDifficulty, setProfileDifficulty] = useState(() => {
    return sessionStorage.getItem('fimmit_user_difficulty') || 'medium';
  });

  const [user, setUser] = useState(() => {
    if (typeof authService?.getCurrentUser === 'function') {
      return authService.getCurrentUser() || null;
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

  // Backend-Provided Technology & Domain Tags for Search
  const [backendTechTags, setBackendTechTags] = useState(() => {
    try {
      const savedTech = sessionStorage.getItem('fimmit_tech_tags');
      const savedInterests = sessionStorage.getItem('fimmit_user_interests');
      const techList = savedTech ? JSON.parse(savedTech) : [];
      const interestList = savedInterests ? JSON.parse(savedInterests) : [];
      const combined = [
        ...(Array.isArray(techList) ? techList : []),
        ...(Array.isArray(interestList) ? interestList : [])
      ];
      if (combined.length > 0) {
        return Array.from(new Set(combined));
      }
    } catch {
      // Fallback
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
      const isAuthed = authService.isAuthenticated() || Boolean(authService.getCurrentUser());

      if (hash === '#onboarding') {
        if (isAuthed) {
          setCurrentView('onboarding');
        } else {
          navigateTo('landing');
        }
      } else if (hash === '#home' || hash === '#feed') {
        if (isAuthed) {
          setCurrentView('home');
        } else {
          navigateTo('landing');
        }
      } else if (hash === '#loading') {
        if (isAuthed) {
          setCurrentView('loading');
        } else {
          navigateTo('landing');
        }
      } else if (!hash || hash === '#top') {
        setCurrentView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [navigateTo]);

  // Handle GitHub OAuth redirect parameters (code, error, access_denied) and silent session restoration
  useEffect(() => {
    const processAuth = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      let rawHash = window.location.hash;
      if (rawHash.startsWith('#')) rawHash = rawHash.slice(1);
      const hashQuery = rawHash.includes('?') ? rawHash.split('?')[1] : (rawHash.includes('=') ? rawHash : '');
      const hashParams = new URLSearchParams(hashQuery);

      const code = searchParams.get('code') || hashParams.get('code');
      const error = searchParams.get('error') || hashParams.get('error');
      const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

      // Check if user cancelled GitHub authorization or an OAuth error occurred
      if (error) {
        const cleanPath = window.location.pathname.replace(/\/callback|\/oauth2\/.*/, '') || '/';
        window.history.replaceState({}, document.title, cleanPath);

        const errorMsg = errorDescription
          ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
          : error === 'access_denied'
          ? 'GitHub authorization was cancelled.'
          : `Authentication error: ${error}`;
        setAuthError(errorMsg);
        navigateTo('landing');
        return;
      }

      // Check if authorization code was returned from GitHub / backend
      if (code) {
        // Prevent duplicate execution on StrictMode remounts
        if (authExchangeInFlightRef.current || exchangedCodeRef.current === code) {
          return;
        }

        authExchangeInFlightRef.current = true;
        setIsAuthenticating(true);
        setAuthError(null);

        try {
          const result = await authService.exchangeAuthCode(code);
          exchangedCodeRef.current = code;

          const cleanPath = window.location.pathname.replace(/\/callback|\/oauth2\/.*/, '') || '/';
          window.history.replaceState({}, document.title, cleanPath);

          const authedUser = result.user || authService.getCurrentUser() || { username: 'Contributor' };
          setUser(authedUser);

          if (authedUser?.preferredDifficulty) {
            const rawDiff = authedUser.preferredDifficulty.toLowerCase();
            setProfileDifficulty(rawDiff);
            sessionStorage.setItem('fimmit_user_difficulty', rawDiff);
          }
          if (authedUser?.preferredTechStack && Array.isArray(authedUser.preferredTechStack)) {
            sessionStorage.setItem('fimmit_tech_tags', JSON.stringify(authedUser.preferredTechStack));
          }
          if (authedUser?.interests && Array.isArray(authedUser.interests)) {
            sessionStorage.setItem('fimmit_user_interests', JSON.stringify(authedUser.interests));
          }
          const authedTags = Array.from(new Set([
            ...(Array.isArray(authedUser?.preferredTechStack) ? authedUser.preferredTechStack : []),
            ...(Array.isArray(authedUser?.interests) ? authedUser.interests : []),
          ]));
          if (authedTags.length > 0) {
            setBackendTechTags(authedTags);
          }

          if (result.isNewUser) {
            navigateTo('onboarding');
          } else {
            navigateTo('home');
          }
        } catch (err) {
          authExchangeInFlightRef.current = false;
          const cleanPath = window.location.pathname.replace(/\/callback|\/oauth2\/.*/, '') || '/';
          window.history.replaceState({}, document.title, cleanPath);

          const errorMsg = err.message || 'Authentication failed. Please try signing in again.';
          setAuthError(errorMsg);
          setUser(null);
          navigateTo('landing');
        } finally {
          setIsAuthenticating(false);
          authExchangeInFlightRef.current = false;
        }
        return;
      }

      // If no callback parameters and client has a stored refresh token, attempt silent session restoration once
      if (authService.isAuthenticated()) {
        try {
          const refreshed = await authService.refreshSession();
          if (refreshed) {
            const restoredUser = authService.getCurrentUser();
            if (restoredUser) {
              setUser(restoredUser);
            }
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      }
    };

    processAuth();
  }, [navigateTo]);

  const handleSignIn = () => {
    setAuthError(null);
    try {
      authService.startGitHubLogin();
    } catch {
      setAuthError('Unable to start GitHub sign-in. Please try again.');
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
    const tech = Array.isArray(data?.preferredTechStack) ? data.preferredTechStack : [];
    const interests = Array.isArray(data?.interests) ? data.interests : [];

    if (tech.length > 0) {
      sessionStorage.setItem('fimmit_tech_tags', JSON.stringify(tech));
    }
    if (interests.length > 0) {
      sessionStorage.setItem('fimmit_user_interests', JSON.stringify(interests));
    }
    if (data?.preferredIssues && Array.isArray(data.preferredIssues)) {
      sessionStorage.setItem('fimmit_preferred_issues', JSON.stringify(data.preferredIssues));
    }

    const combined = Array.from(new Set([...tech, ...interests]));
    if (combined.length > 0) {
      setBackendTechTags(combined);
    }
    const authedUser = authService.getCurrentUser() || user || {
      username: 'Contributor',
    };
    setUser(authedUser);
    authService.setCurrentUser(authedUser);

    // Route to loading sequence before showing home feed
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
      sessionStorage.removeItem('fimmit_user_interests');
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

  if (isAuthenticating) {
    return (
      <div className="fimmit-loading-wrapper" role="status" aria-live="polite">
        <div className="fimmit-loading-content">
          <h1 className="fimmit-loading-headline">
            Signing you in with<br />
            <span className="fimmit-loading-banner-wrapper">
              <span className="fimmit-loading-orange-banner">GitHub</span>
            </span>
          </h1>
          <p style={{ marginTop: '1.5rem', fontSize: '1.125rem', color: '#000000' }}>
            Completing authentication and loading your profile...
          </p>
        </div>
      </div>
    );
  }

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
          user={user}
          isAuthenticated={Boolean(user)}
          onSignIn={handleSignIn}
          onOpenFeed={() => (user ? navigateTo('home') : handleSignIn())}
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
              authError={authError}
              onDismissError={() => setAuthError(null)}
            />
          ) : (
            <HomePage
              savedIssueIds={savedIssueIds}
              onToggleSave={toggleSave}
              username={user?.username || 'Contributor'}
              saveError={saveError}
              onClearSaveError={clearSaveError}
            />
          )}
        </MainLayout>
      )}

      {/* Persistent Saved Issues Side Drawer */}
      <SavedIssuesDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        savedRepositories={savedRepositories}
        onRemove={(id) => removeSavedIssue(id)}
        saveError={saveError}
        onClearSaveError={clearSaveError}
      />
    </>
  );
}