
import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'fimmit_saved_issue_ids';

function readSavedIssues() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return new Set();

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) return new Set();

    return new Set(parsed.map((id) => String(id)));
  } catch (error) {
    console.error('Failed to load saved issues:', error);
    return new Set();
  }
}

export function useSavedIssues() {
  const [savedIssueIds, setSavedIssueIds] = useState(readSavedIssues);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Persist saved issue IDs whenever the collection changes.
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...savedIssueIds])
      );
    } catch (error) {
      console.error('Failed to persist saved issues:', error);
      setSaveError('Could not save changes in this browser.');
    }
  }, [savedIssueIds]);

  const toggleSave = useCallback((issueId) => {
    const id = String(issueId);

    setSaveError('');
    setIsSaving(true);

    setSavedIssueIds((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });

    setIsSaving(false);
  }, []);

  return {
    savedCount: savedIssueIds.size,
    savedIssueIds: Array.from(savedIssueIds),
    isSaving,
    saveError,
    toggleSave,
  };
}
