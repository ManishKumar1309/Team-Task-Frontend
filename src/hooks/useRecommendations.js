
import { useState, useEffect, useCallback, useRef } from 'react';
import { recommendationService } from '../services/recommendationService';
import { onboardingService } from '../services/onboardingService';

const COOLDOWN_SECONDS = 120;
const STORAGE_KEY = 'fimmit_refresh_available_at';

function getRemainingSeconds() {
  const availableAt = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
  return Math.max(0, Math.ceil((availableAt - Date.now()) / 1000));
}

export function useRecommendations() {
  const [issues, setIssues] = useState([]);
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [blockedByAuth, setBlockedByAuth] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(getRemainingSeconds);

  const refreshLock = useRef(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setBlockedByAuth(false);

    try {
      const [profileRes, recRes] = await Promise.all([
        onboardingService.getProfile(),
        recommendationService.getRecommendations(),
      ]);

      setProfile(profileRes || {});

      if (recRes?.blockedByAuth) {
        setBlockedByAuth(true);
        setError(recRes.error || 'Authentication required: Live recommendations require a valid login session.');
        setIssues([]);
        setIsMock(false);
      } else if (recRes?.error) {
        setError(recRes.error);
        setIssues([]);
        setIsMock(false);
      } else {
        setIssues(Array.isArray(recRes?.issues) ? recRes.issues : []);
        setIsMock(Boolean(recRes?.isMock));
        setBlockedByAuth(false);
      }
    } catch (err) {
      const isAuth = err.status === 401 || err.message?.includes('401') || err.message?.includes('Authentication');
      setBlockedByAuth(isAuth);
      setError(
        isAuth
          ? 'Authentication required: POST /api/recommendations requires a valid login session.'
          : (err.message || 'Failed to load recommendations from backend.')
      );
      setIssues([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = getRemainingSeconds();
      setCooldownSeconds(remaining);

      if (remaining === 0) {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    };

    updateTimer();
    const intervalId = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const reload = useCallback(() => {
    loadData();
  }, [loadData]);

  const refreshFeed = useCallback(async () => {
    if (refreshLock.current || getRemainingSeconds() > 0) return;

    refreshLock.current = true;

    // Start the timer immediately, before waiting for the API.
    sessionStorage.setItem(
      STORAGE_KEY,
      String(Date.now() + COOLDOWN_SECONDS * 1000)
    );
    setCooldownSeconds(COOLDOWN_SECONDS);
    setIsRefreshing(true);
    setError('');

    try {
      const result = await recommendationService.refreshRecommendations();

      if (Array.isArray(result?.issues)) {
        setIssues(result.issues);
        setIsMock(Boolean(result.isMock));
      } else {
        await loadData();
      }
    } catch (err) {
      setError(err.message || 'Could not refresh your feed.');
    } finally {
      refreshLock.current = false;
      setIsRefreshing(false);
    }
  }, [loadData]);

  return {
    issues,
    profile,
    isLoading,
    isRefreshing,
    error,
    blockedByAuth,
    isMock,
    reload,
    refreshFeed,
    cooldownSeconds,
    canRefresh: cooldownSeconds === 0 && !isRefreshing,
  };
}
