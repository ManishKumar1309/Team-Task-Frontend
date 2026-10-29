import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { savedRepositoryService, adaptSavedRepository } from '../services/savedRepositoryService';
import { authService } from '../services/authService';

const STORAGE_KEY_REPOS = 'fimmit_saved_repositories';

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 123456789;
}

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
  if (issue.repo && issue.title) {
    return `${issue.repo}#${issue.title}`.trim();
  }
  return String(issue.title || '').trim();
}

export function getRepoKey(item) {
  if (!item) return '';
  if (typeof item === 'string' || typeof item === 'number') {
    return String(item).trim().toLowerCase();
  }
  const owner = item.owner || (item.repo && item.repo.includes('/') ? item.repo.split('/')[0] : '') || '';
  const name = item.repositoryName || item.repoName || (item.repo && item.repo.includes('/') ? item.repo.split('/')[1] : (item.repo || '')) || '';
  if (owner && name) {
    return `${owner}/${name}`.toLowerCase();
  }
  if (item.repository) {
    return String(item.repository).toLowerCase();
  }
  if (item.repo) {
    return String(item.repo).toLowerCase();
  }
  if (item.githubRepositoryId) {
    return String(item.githubRepositoryId);
  }
  return getIssueKey(item).toLowerCase();
}


function loadInitialSavedRepositories() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_REPOS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Ignore
  }
  return [];
}

export function useSavedIssues() {
  const [savedRepositories, setSavedRepositories] = useState(loadInitialSavedRepositories);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Keep a ref to savedRepositories to avoid stale closures in asynchronous callbacks
  const savedRepositoriesRef = useRef(savedRepositories);
  useEffect(() => {
    savedRepositoriesRef.current = savedRepositories;
  }, [savedRepositories]);

  // In-flight locking ref to prevent duplicate or overlapping save/unsave requests for the same issue
  const inFlightKeysRef = useRef(new Set());

  // Map repoKey/issueKey -> backend savedRepositoryId (distinguishing backend record ID from githubRepositoryId)
  const repoToSavedIdMapRef = useRef(new Map());

  // Populate map from initial local repositories
  useEffect(() => {
    savedRepositories.forEach((repo) => {
      const key = getRepoKey(repo);
      if (key && repo.id) {
        repoToSavedIdMapRef.current.set(key, repo.id);
      }
      if (repo.githubRepositoryId && repo.id) {
        repoToSavedIdMapRef.current.set(String(repo.githubRepositoryId), repo.id);
      }
    });
  }, [savedRepositories]);

  // Sync with backend GET /api/saved-repositories on load if authenticated
  useEffect(() => {
    let isCancelled = false;

    const fetchBackendSaved = async () => {
      if (!authService.isAuthenticated()) {
        return;
      }
      try {
        const result = await savedRepositoryService.getSavedRepositories();
        if (isCancelled) return;

        // If there was an error (e.g. auth failed, backend offline), DO NOT wipe out local state!
        if (result?.error || result?.blockedByAuth) {
          return;
        }

        if (Array.isArray(result?.repositories)) {
          const backendRepos = result.repositories;

          setSavedRepositories((prev) => {
            // Merge backend repos with any optimistic/local items added since mount
            const merged = [...backendRepos];
            const backendKeys = new Set(backendRepos.map((r) => getRepoKey(r)).filter(Boolean));
            const backendIds = new Set(backendRepos.map((r) => String(r.id)).filter(Boolean));

            prev.forEach((item) => {
              const itemKey = getRepoKey(item);
              const itemId = item.id ? String(item.id) : '';
              const isTemp = typeof item.id === 'string' && (item.id.startsWith('temp-') || isNaN(Number(item.id)));

              // Keep optimistic items that haven't been synchronized yet
              if (isTemp && itemKey && !backendKeys.has(itemKey)) {
                merged.unshift(item);
              } else if (!backendKeys.has(itemKey) && (!itemId || !backendIds.has(itemId))) {
                merged.push(item);
              }
            });

            return merged;
          });

          // Update ID lookup map with backend database record IDs
          backendRepos.forEach((repo) => {
            const key = getRepoKey(repo);
            if (key && repo.id) {
              repoToSavedIdMapRef.current.set(key, repo.id);
            }
            if (repo.githubRepositoryId && repo.id) {
              repoToSavedIdMapRef.current.set(String(repo.githubRepositoryId), repo.id);
            }
          });
        }
      } catch {
        // Silently preserve current state on network/auth error
      }
    };

    fetchBackendSaved();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Persist saved repositories to localStorage cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REPOS, JSON.stringify(savedRepositories));
    } catch {
      // Ignore
    }
  }, [savedRepositories]);

  // Derive savedIssueIds strictly from savedRepositories to guarantee 100% synchronization
  const savedIssueIds = useMemo(() => {
    const ids = new Set();
    savedRepositories.forEach((repo) => {
      const key = getRepoKey(repo);
      if (key) ids.add(key.toLowerCase());
      if (repo.owner && repo.repositoryName) {
        ids.add(`${repo.owner}/${repo.repositoryName}`.toLowerCase());
      }
      if (repo.repository) {
        ids.add(String(repo.repository).toLowerCase());
      }
      if (repo.repo) {
        ids.add(String(repo.repo).toLowerCase());
      }
      if (repo.id) ids.add(String(repo.id).toLowerCase());
      if (repo.backendRecordId) ids.add(String(repo.backendRecordId).toLowerCase());
      if (repo.githubRepositoryId) ids.add(String(repo.githubRepositoryId));
      if (repo.issueId) ids.add(String(repo.issueId).toLowerCase());
      if (repo.issueKey) ids.add(String(repo.issueKey).toLowerCase());
      if (repo.url) ids.add(String(repo.url).toLowerCase());
    });
    return Array.from(ids);
  }, [savedRepositories]);

  const savedIssueIdSet = useMemo(() => new Set(savedIssueIds), [savedIssueIds]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const clearSaveError = useCallback(() => setSaveError(''), []);

  const toggleSave = useCallback(async (issueOrId) => {
    if (!issueOrId) return;

    setSaveError('');

    const issueKey = getIssueKey(issueOrId);
    const repoKey = getRepoKey(issueOrId);
    const lockKey = repoKey || issueKey;
    if (!lockKey) return;

    // Requirement 6: Prevent duplicate or overlapping save/unsave requests for the same issue
    if (inFlightKeysRef.current.has(lockKey)) {
      return;
    }
    inFlightKeysRef.current.add(lockKey);

    try {
      // Check against current state using ref to avoid stale closures
      const existingRepo = savedRepositoriesRef.current.find((r) => {
        const k = getRepoKey(r);
        return (
          (k && repoKey && k === repoKey) ||
          (r.issueKey && issueKey && r.issueKey === issueKey) ||
          (r.issueId && issueKey && String(r.issueId) === String(issueKey)) ||
          (r.id && issueKey && String(r.id) === String(issueKey)) ||
          (repoKey && repoToSavedIdMapRef.current.get(repoKey) === r.id) ||
          (issueKey && repoToSavedIdMapRef.current.get(issueKey) === r.id)
        );
      });

      if (existingRepo) {
        // --- UN-SAVE (DELETE) FLOW ---
        const backendRecordId =
          existingRepo.backendRecordId ||
          (existingRepo.id && typeof existingRepo.id === 'number' ? existingRepo.id : null) ||
          repoToSavedIdMapRef.current.get(repoKey) ||
          repoToSavedIdMapRef.current.get(issueKey);

        const removedItem = existingRepo;

        // Optimistic update: UI updates immediately on click to "Save Issue"
        setSavedRepositories((prev) =>
          prev.filter((r) => {
            const k = getRepoKey(r);
            if (k && repoKey && k === repoKey) return false;
            if (r.issueKey && issueKey && r.issueKey === issueKey) return false;
            if (r.issueId && issueKey && String(r.issueId) === String(issueKey)) return false;
            if (backendRecordId && r.id && r.id === backendRecordId) return false;
            return true;
          })
        );

        if (repoKey) repoToSavedIdMapRef.current.delete(repoKey);
        if (issueKey) repoToSavedIdMapRef.current.delete(issueKey);

        if (!backendRecordId || !authService.isAuthenticated()) {
          return;
        }

        setIsSaving(true);
        try {
          await savedRepositoryService.deleteSavedRepository(backendRecordId);
        } catch (err) {
          // Rollback optimistic removal if backend delete fails (Requirement 5)
          if (removedItem) {
            setSavedRepositories((prev) => [removedItem, ...prev]);
          }
          setSaveError(err.message || 'Failed to remove saved repository from backend.');
        } finally {
          setIsSaving(false);
        }
        return;
      }

      // --- SAVE FLOW ---
      let owner = '';
      let repositoryName = '';
      let repositoryUrl = '';
      let description = '';
      let githubRepositoryId = 0;
      let issueId = '';
      let issueTitle = '';
      let issueUrl = '';

      if (typeof issueOrId === 'object' && issueOrId !== null) {
        owner = issueOrId.owner || (issueOrId.repo && issueOrId.repo.includes('/') ? issueOrId.repo.split('/')[0] : '') || '';
        repositoryName = issueOrId.repositoryName || (issueOrId.repo && issueOrId.repo.includes('/') ? issueOrId.repo.split('/')[1] : (issueOrId.repo || ''));
        repositoryUrl = issueOrId.repositoryUrl || (owner && repositoryName ? `https://github.com/${owner}/${repositoryName}` : (issueOrId.url?.includes('/issues') ? issueOrId.url.split('/issues')[0] : issueOrId.url || ''));
        description = issueOrId.repoDescription || issueOrId.description || issueOrId.title || '';
        githubRepositoryId = Number(issueOrId.githubRepositoryId) || Math.abs(hashString(`${owner}/${repositoryName}`));
        issueId = issueOrId.id != null ? String(issueOrId.id) : '';
        issueTitle = issueOrId.title || '';
        issueUrl = issueOrId.url || '';
      } else {
        repositoryName = String(issueOrId);
        githubRepositoryId = Math.abs(hashString(String(issueOrId)));
      }

      if (!repositoryName) {
        setSaveError('Cannot save repository: repository name is missing.');
        return;
      }

      const payload = {
        githubRepositoryId,
        repositoryName,
        owner: owner || 'unknown',
        repositoryUrl: repositoryUrl || `https://github.com/${owner || 'unknown'}/${repositoryName}`,
        description,
        issueId,
        issueKey,
      };

      const tempId = issueId || `temp-${Date.now()}`;
      const optimisticRecord = adaptSavedRepository({
        ...payload,
        id: tempId,
        issueId: issueId || tempId,
        issueKey: issueKey || tempId,
        title: issueTitle,
        url: issueUrl,
        savedAt: new Date().toISOString(),
      });

      // Optimistic update: UI updates immediately to "Saved"
      setSavedRepositories((prev) => {
        const alreadyExists = prev.some((r) => {
          const k = getRepoKey(r);
          return (k && repoKey && k === repoKey) || (r.issueId && issueId && String(r.issueId) === String(issueId));
        });
        if (alreadyExists) return prev;
        return [optimisticRecord, ...prev];
      });

      if (!authService.isAuthenticated()) {
        return;
      }

      setIsSaving(true);
      try {
        const result = await savedRepositoryService.saveRepository(payload);
        const savedRecord = result?.repository;

        if (savedRecord) {
          const backendRecordId = savedRecord.id;
          if (backendRecordId) {
            if (repoKey) repoToSavedIdMapRef.current.set(repoKey, backendRecordId);
            if (issueKey) repoToSavedIdMapRef.current.set(issueKey, backendRecordId);
            if (savedRecord.githubRepositoryId) {
              repoToSavedIdMapRef.current.set(String(savedRecord.githubRepositoryId), backendRecordId);
            }
          }

          // Replace optimistic record with confirmed backend record WHILE PRESERVING issueId, issueKey, etc.
          setSavedRepositories((prev) =>
            prev.map((r) => {
              const k = getRepoKey(r);
              const matches =
                (k && repoKey && k === repoKey) ||
                (r.id && String(r.id) === String(tempId)) ||
                (r.issueId && issueId && String(r.issueId) === String(issueId));

              if (matches) {
                return {
                  ...r,
                  ...savedRecord,
                  id: backendRecordId || r.id,
                  backendRecordId: backendRecordId || r.backendRecordId || null,
                  issueId: issueId || r.issueId || tempId,
                  issueKey: issueKey || r.issueKey || tempId,
                  owner: savedRecord.owner || payload.owner,
                  repositoryName: savedRecord.repositoryName || payload.repositoryName,
                  repositoryUrl: savedRecord.repositoryUrl || payload.repositoryUrl,
                };
              }
              return r;
            })
          );
        }
      } catch (err) {
        // Requirement 5: If saving fails, show an appropriate error and restore the actual saved state
        setSavedRepositories((prev) =>
          prev.filter((r) => {
            const k = getRepoKey(r);
            if (k && repoKey && k === repoKey) return false;
            if (r.id && String(r.id) === String(tempId)) return false;
            if (r.issueId && issueId && String(r.issueId) === String(issueId)) return false;
            return true;
          })
        );
        if (repoKey) repoToSavedIdMapRef.current.delete(repoKey);
        if (issueKey) repoToSavedIdMapRef.current.delete(issueKey);

        const errorMsg = err.message?.includes('Authentication')
          ? 'Please sign in to save issues.'
          : err.message || 'Failed to save repository to backend.';
        setSaveError(errorMsg);
      } finally {
        setIsSaving(false);
      }
    } finally {
      inFlightKeysRef.current.delete(lockKey);
    }
  }, []);

  const removeSavedIssue = useCallback(async (issueOrId) => {
    if (!issueOrId) return;

    setSaveError('');

    const issueKey = getIssueKey(issueOrId);
    const repoKey = getRepoKey(issueOrId);
    const lockKey = repoKey || issueKey;
    if (lockKey && inFlightKeysRef.current.has(lockKey)) {
      return;
    }
    if (lockKey) inFlightKeysRef.current.add(lockKey);

    const targetRepo = savedRepositoriesRef.current.find((r) => {
      const k = getRepoKey(r);
      return (
        (k && repoKey && k === repoKey) ||
        (r.issueKey && issueKey && r.issueKey === issueKey) ||
        (r.issueId && issueKey && String(r.issueId) === String(issueKey)) ||
        (r.id && issueKey && String(r.id) === String(issueKey)) ||
        (repoKey && repoToSavedIdMapRef.current.get(repoKey) === r.id) ||
        (issueKey && repoToSavedIdMapRef.current.get(issueKey) === r.id)
      );
    });

    const backendSavedId =
      targetRepo?.backendRecordId ||
      (targetRepo?.id && typeof targetRepo.id === 'number' ? targetRepo.id : null) ||
      (typeof issueOrId === 'number' ? issueOrId : null) ||
      repoToSavedIdMapRef.current.get(repoKey) ||
      repoToSavedIdMapRef.current.get(issueKey);

    const removedItem = targetRepo;

    // Optimistic removal: UI updates immediately
    setSavedRepositories((prev) =>
      prev.filter((r) => {
        const k = getRepoKey(r);
        if (k && repoKey && k === repoKey) return false;
        if (r.issueKey && issueKey && r.issueKey === issueKey) return false;
        if (r.issueId && issueKey && String(r.issueId) === String(issueKey)) return false;
        if (backendSavedId && r.id && r.id === backendSavedId) return false;
        return true;
      })
    );

    if (repoKey) repoToSavedIdMapRef.current.delete(repoKey);
    if (issueKey) repoToSavedIdMapRef.current.delete(issueKey);

    if (!backendSavedId || !authService.isAuthenticated()) {
      if (lockKey) inFlightKeysRef.current.delete(lockKey);
      return;
    }

    try {
      await savedRepositoryService.deleteSavedRepository(backendSavedId);
    } catch (err) {
      if (removedItem) {
        setSavedRepositories((prev) => [removedItem, ...prev]);
      }
      setSaveError(err.message || 'Failed to remove saved repository from backend.');
    } finally {
      if (lockKey) inFlightKeysRef.current.delete(lockKey);
    }
  }, []);

  return {
    savedCount: savedRepositories.length,
    savedIssueIds,
    savedIssueIdSet,
    savedRepositories,
    isSaving,
    saveError,
    clearSaveError,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    setIsDrawerOpen,
    toggleSave,
    removeSavedIssue,
  };
}
