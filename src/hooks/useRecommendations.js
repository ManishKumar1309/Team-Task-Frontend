
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
  const [isMock, setIsMock] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(getRemainingSeconds);

  const refreshLock = useRef(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const [profileRes, recRes] = await Promise.all([
        onboardingService.getProfile(),
        recommendationService.getRecommendations(),
      ]);

      setProfile(profileRes || {});
      setIssues(recRes?.issues || []);
      setIsMock(Boolean(recRes?.isMock || profileRes?.isMock));
    } catch (err) {
      setError(err.message || 'Failed to load recommendations.');
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
    isMock,
    reload,
    refreshFeed,
    cooldownSeconds,
    canRefresh: cooldownSeconds === 0 && !isRefreshing,
  };
}
