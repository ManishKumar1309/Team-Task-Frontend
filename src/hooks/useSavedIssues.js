import { useState, useCallback, useMemo, useEffect } from 'react';
import { recommendationService } from '../services/recommendationService';

const STORAGE_KEY = 'fimmit_saved_issues';

/**
 * Helper to obtain a consistent, stable string identifier from an issue object or primitive id.
 * Never uses generic placeholder URLs (like https://github.com) as keys.
 */
export function getIssueKey(issue) {
  if (!issue) return '';
  if (typeof issue === 'string' || typeof issue === 'number') {
    return String(issue).trim();
  }
  if (issue.id !== undefined && issue.id !== null && String(issue.id).trim() !== '') {
    return String(issue.id).trim();
  }
  if (
    issue.url &&
    typeof issue.url === 'string' &&
    issue.url !== 'https://github.com' &&
    issue.url !== 'https://github.com/' &&
    issue.url !== '#' &&
    issue.url.trim() !== ''
  ) {
    return issue.url.trim();
  }
  if (issue.repository && issue.title) {
    return `${issue.repository}#${issue.title}`.trim();
  }
  return String(issue.title || '').trim();
}

/**
 * Safely parse initial saved issues from localStorage, deduplicating by issue key.
 */
function loadInitialSavedIssues() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const seen = new Set();
      const deduped = [];
      for (const item of parsed) {
        if (!item || typeof item !== 'object') continue;
        const key = getIssueKey(item);
        if (key && !seen.has(key)) {
          seen.add(key);
          deduped.push(item);
        }
      }
      return deduped;
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

  // Derived set of string IDs for O(1) membership checks in cards
  const savedIssueIds = useMemo(() => {
    const ids = new Set();
    savedIssues.forEach((issue) => {
      const key = getIssueKey(issue);
      if (key) ids.add(key);
      if (issue.id !== undefined && issue.id !== null && String(issue.id).trim() !== '') {
        ids.add(String(issue.id).trim());
      }
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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.error('Failed to persist saved issues to localStorage:', err);
      }
      return next;
    });

    // Fire and forget background sync
    recommendationService.removeSavedIssue(targetKey).catch(() => {});
  }, []);

  /**
   * Toggles the saved status of an issue.
   * If not saved: saves issue, persists, and prevents duplicate saves.
   * If saved: unsaves issue and updates list immediately.
   */
  const toggleSave = useCallback((issue) => {
    if (!issue) return;
    const targetKey = getIssueKey(issue);
    if (!targetKey) return;

    setSaveError('');

    setSavedIssues((prev) => {
      const isAlreadySaved = prev.some((i) => getIssueKey(i) === targetKey);
      let next;

      if (isAlreadySaved) {
        // Unsave
        next = prev.filter((i) => getIssueKey(i) !== targetKey);
      } else {
        // Save and ensure no duplicates
        next = [issue, ...prev.filter((i) => getIssueKey(i) !== targetKey)];
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.error('Failed to persist saved issues to localStorage:', err);
      }

      if (isAlreadySaved) {
        recommendationService.removeSavedIssue(targetKey).catch(() => {});
      } else {
        recommendationService.saveIssue(targetKey).catch(() => {});
      }

      return next;
    });
  }, []);

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
    saveError,
  };
}
