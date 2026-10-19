import { useState, useCallback, useEffect } from 'react';
import { recommendationService } from '../services/recommendationService';

export function useSavedIssues() {
  const [savedCount, setSavedCount] = useState(2);
  const [savedIssueIds, setSavedIssueIds] = useState(new Set(['101', '103']));
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    let isMounted = true;
    recommendationService.getSavedIssues()
      .then((res) => {
        if (isMounted && res) {
          setSavedCount(res.count);
          if (Array.isArray(res.savedIssues)) {
            setSavedIssueIds(new Set(res.savedIssues.map((i) => String(i.id))));
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleSave = useCallback(async (issueId) => {
    if (isSaving) return;
    const strId = String(issueId);
    setIsSaving(true);
    setSaveError('');

    const currentlySaved = savedIssueIds.has(strId);

    try {
      if (currentlySaved) {
        await recommendationService.removeSavedIssue(strId);
        setSavedIssueIds((prev) => {
          const next = new Set(prev);
          next.delete(strId);
          setSavedCount(next.size);
          return next;
        });
      } else {
        await recommendationService.saveIssue(strId);
        setSavedIssueIds((prev) => {
          const next = new Set(prev);
          next.add(strId);
          setSavedCount(next.size);
          return next;
        });
      }
    } catch (err) {
      setSaveError(err.message || 'Failed to update saved status');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, savedIssueIds]);

  return {
    savedCount,
    savedIssueIds,
    isSaving,
    saveError,
    toggleSave,
  };
}
