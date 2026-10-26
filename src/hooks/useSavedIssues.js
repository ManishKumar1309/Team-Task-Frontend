import { useState, useCallback, useMemo, useEffect } from 'react';

const STORAGE_KEY_IDS = 'fimmit_saved_issue_ids';
const STORAGE_KEY_ITEMS = 'fimmit_saved_issues';

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

function loadInitialSavedIssueIds() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_IDS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.map((id) => String(id));
      }
    }
    const legacy = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => getIssueKey(item)).filter(Boolean);
      }
    }
    return [];
  } catch {
    return [];
  }
}

export function useSavedIssues() {
  const [savedIssueIds, setSavedIssueIds] = useState(loadInitialSavedIssueIds);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_IDS, JSON.stringify(savedIssueIds));
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(savedIssueIds));
    } catch (err) {
      console.error('Failed to persist saved issues:', err);
    }
  }, [savedIssueIds]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const toggleSave = useCallback((issueOrId) => {
    if (!issueOrId) return;
    const id = getIssueKey(issueOrId);
    if (!id) return;

    setSaveError('');
    setIsSaving(true);

    setSavedIssueIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter((item) => item !== id);
      }
      return [id, ...prev];
    });

    setIsSaving(false);
  }, []);

  const removeSavedIssue = useCallback((issueOrId) => {
    const id = getIssueKey(issueOrId);
    if (!id) return;
    setSavedIssueIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const savedIssueIdSet = useMemo(() => new Set(savedIssueIds), [savedIssueIds]);

  return {
    savedCount: savedIssueIds.length,
    savedIssueIds,
    savedIssueIdSet,
    isSaving,
    saveError,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    setIsDrawerOpen,
    toggleSave,
    removeSavedIssue,
  };
}
