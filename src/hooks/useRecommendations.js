import { useState, useEffect, useCallback } from 'react';
import { recommendationService } from '../services/recommendationService';
import { onboardingService } from '../services/onboardingService';

export function useRecommendations() {
  const [issues, setIssues] = useState([]);
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [isMock, setIsMock] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      onboardingService.getProfile(),
      recommendationService.getRecommendations(),
    ])
      .then(([profileRes, recRes]) => {
        if (isMounted) {
          setProfile(profileRes || {});
          const rawIssues = recRes?.issues || [];
          setIssues(rawIssues);
          setIsMock(Boolean(recRes?.isMock || profileRes?.isMock));
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load recommendations.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fetchTrigger]);

  const reload = useCallback(() => {
    setIsLoading(true);
    setError('');
    setFetchTrigger((prev) => prev + 1);
  }, []);

  const refreshFeed = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await recommendationService.refreshRecommendations();
      if (res?.issues && res.issues.length > 0) {
        setIssues(res.issues);
      } else {
        reload();
      }
    } catch {
      reload();
    } finally {
      setIsRefreshing(false);
    }
  }, [reload]);

  return {
    issues,
    profile,
    isLoading,
    isRefreshing,
    error,
    isMock,
    reload,
    refreshFeed,
  };
}
