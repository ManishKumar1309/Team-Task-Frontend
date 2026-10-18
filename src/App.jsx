import React, { useState } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';

export default function App() {
  // We use this state to fake our routing/authentication for now
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'home'
  const [savedCount, setSavedCount] = useState(0);

  // When the user clicks "Sign In" or "Continue with Github", swap the view to the dashboard!
  const handleLogin = () => {
    setCurrentView('home');
  };

  return (
    <MainLayout
      navbarVariant={currentView} // Automatically switches the Navbar style based on the view!
      savedCount={savedCount}
      userLevel="Intermediate"
      onSignIn={handleLogin}
      onOpenFeed={handleLogin}
      onSavedClick={() => alert('Saved issues view placeholder')}
      onNavClick={(e) => {
        // Smooth scroll for anchor links
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
      {/* Conditional Rendering: If 'landing', show LandingPage. If 'home', show HomePage. */}
      {currentView === 'landing' ? (
        <LandingPage 
          onContinueWithGithub={handleLogin} 
          onHowItWorks={() => {
            const section = document.getElementById('how-it-works');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      ) : (
        <HomePage />
      )}
    </MainLayout>
  );
}