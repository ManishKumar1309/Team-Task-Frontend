import { useState, useCallback, useMemo, useEffect } from 'react';
import { recommendationService } from '../services/recommendationService';

const STORAGE_KEY = 'fimmit_saved_issues';

/**
 * Helper to obtain a consistent, stable string identifier from an issue object or primitive id.
 */
export function getIssueKey(issue) {
  if (!issue) return '';
  if (typeof issue === 'string' || typeof issue === 'number') {
    return String(issue);
  }
  return String(issue.id || issue.url || '');
}

/**
 * Safely parse initial saved issues from localStorage.
 */
function loadInitialSavedIssues() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => item && (item.id || item.url));
    }
    return [];
  } catch (err) {
    console.warn('Failed to parse saved issues from localStorage:', err);
    return [];
  }
}

/**
 * Custom hook to manage saved issues state, drawer visibility, and localStorage persistence.
 */
export function useSavedIssues() {
  const [savedIssues, setSavedIssues] = useState(loadInitialSavedIssues);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Persist whenever savedIssues changes
  const persistSavedIssues = useCallback((issues) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
    } catch (err) {
      console.error('Failed to persist saved issues to localStorage:', err);
    }
  }, []);

  // Sync with backend on startup if available (non-destructive to local offline state)
  useEffect(() => {
    let isMounted = true;
    recommendationService.getSavedIssues()
      .then((res) => {
        if (!isMounted || !res) return;
        // If server returns real data (not mock) and local state was empty, populate from server
        if (!res.isMock && Array.isArray(res.savedIssues) && res.savedIssues.length > 0) {
          setSavedIssues((prev) => {
            if (prev.length === 0) {
              persistSavedIssues(res.savedIssues);
              return res.savedIssues;
            }
            return prev;
          });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [persistSavedIssues]);

  // Derived set of string IDs/URLs for O(1) membership checks in cards
  const savedIssueIds = useMemo(() => {
    const ids = new Set();
    savedIssues.forEach((issue) => {
      if (issue.id) ids.add(String(issue.id));
      if (issue.url) ids.add(String(issue.url));
    });
    return ids;
  }, [savedIssues]);

  const savedCount = savedIssues.length;

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  /**
   * Remove an issue from the saved list by its issue object or key.
   */
  const removeSavedIssue = useCallback((issueOrKey) => {
    const targetKey = getIssueKey(issueOrKey);
    if (!targetKey) return;

    setSavedIssues((prev) => {
      const next = prev.filter((i) => getIssueKey(i) !== targetKey);
      persistSavedIssues(next);
      return next;
    });

    // Fire and forget background sync
    recommendationService.removeSavedIssue(targetKey).catch(() => {});
  }, [persistSavedIssues]);

  /**
   * Toggles the saved status of an issue.
   * If not saved: saves issue, persists, and slides in the right-side drawer.
   * If saved: unsaves issue and updates list immediately.
   */
  const toggleSave = useCallback((issue) => {
    if (!issue) return;
    const targetKey = getIssueKey(issue);
    if (!targetKey) return;

    setSaveError('');
    setIsSaving(true);

    try {
      setSavedIssues((prev) => {
        const isAlreadySaved = prev.some((i) => getIssueKey(i) === targetKey);

        if (isAlreadySaved) {
          // Unsave
          const next = prev.filter((i) => getIssueKey(i) !== targetKey);
          persistSavedIssues(next);
          recommendationService.removeSavedIssue(targetKey).catch(() => {});
          return next;
        } else {
          // Save and open drawer immediately
          const next = [issue, ...prev];
          persistSavedIssues(next);
          recommendationService.saveIssue(targetKey).catch(() => {});
          setIsDrawerOpen(true);
          return next;
        }
      });
    } catch (err) {
      setSaveError(err.message || 'Failed to update saved status');
    } finally {
      setIsSaving(false);
    }
  }, [persistSavedIssues]);

  return {
    savedIssues,
    savedIssueIds,
    savedCount,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    setIsDrawerOpen,
    toggleSave,
    removeSavedIssue,
    isSaving,
    saveError,
  };
}
