import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { savedRepositoryService } from '../services/savedRepositoryService';
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
  if (!authService.isAuthenticated()) {
    return [];
  }
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
        setSavedRepositories([]);
        return;
      }
      try {
        const result = await savedRepositoryService.getSavedRepositories();
        if (isCancelled || !Array.isArray(result?.repositories)) return;

        const repos = result.repositories;
        setSavedRepositories(repos);

        // Update ID lookup map with backend database record IDs
        repos.forEach((repo) => {
          const key = getRepoKey(repo);
          if (key && repo.id) {
            repoToSavedIdMapRef.current.set(key, repo.id);
          }
          if (repo.githubRepositoryId && repo.id) {
            repoToSavedIdMapRef.current.set(String(repo.githubRepositoryId), repo.id);
          }
        });
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
      if (key) ids.add(key);
      if (repo.id) ids.add(String(repo.id));
      if (repo.githubRepositoryId) ids.add(String(repo.githubRepositoryId));
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

    // Check if this repository is already saved
    const existingRepo = savedRepositories.find((r) => {
      const k = getRepoKey(r);
      return (k && k === repoKey) || (r.id && repoToSavedIdMapRef.current.get(repoKey) === r.id);
    });

    if (existingRepo) {
      // --- UN-SAVE (DELETE) FLOW ---
      // Use the database record ID (id), NOT the GitHub repository ID
      const recordId = existingRepo.id || repoToSavedIdMapRef.current.get(repoKey) || repoToSavedIdMapRef.current.get(issueKey);

      if (!recordId) {
        // If no backend record ID exists, remove locally
        setSavedRepositories((prev) => prev.filter((r) => getRepoKey(r) !== repoKey));
        return;
      }

      setIsSaving(true);
      try {
        await savedRepositoryService.deleteSavedRepository(recordId);
        setSavedRepositories((prev) => prev.filter((r) => r.id !== recordId && getRepoKey(r) !== repoKey));
        repoToSavedIdMapRef.current.delete(repoKey);
        repoToSavedIdMapRef.current.delete(issueKey);
      } catch (err) {
        setSaveError(err.message || 'Failed to remove saved repository from backend.');
      } finally {
        setIsSaving(false);
      }
      return;
    }

    // --- SAVE FLOW (POST /api/saved-repositories) ---
    if (!authService.isAuthenticated()) {
      setSaveError('Authentication required: please sign in with GitHub to save repositories.');
      return;
    }

    // Extract exact backend contract fields
    let owner;
    let repositoryName;
    let repositoryUrl;
    let description;
    let githubRepositoryId;

    if (typeof issueOrId === 'object') {
      owner = issueOrId.owner || (issueOrId.repo && issueOrId.repo.includes('/') ? issueOrId.repo.split('/')[0] : '') || '';
      repositoryName = issueOrId.repositoryName || (issueOrId.repo && issueOrId.repo.includes('/') ? issueOrId.repo.split('/')[1] : (issueOrId.repo || ''));
      repositoryUrl = issueOrId.repositoryUrl || (owner && repositoryName ? `https://github.com/${owner}/${repositoryName}` : (issueOrId.url?.includes('/issues') ? issueOrId.url.split('/issues')[0] : issueOrId.url || ''));
      description = issueOrId.repoDescription || issueOrId.description || issueOrId.title || '';
      githubRepositoryId = Number(issueOrId.githubRepositoryId) || Math.abs(hashString(`${owner}/${repositoryName}`));
    } else {
      owner = '';
      repositoryName = String(issueOrId);
      repositoryUrl = '';
      description = '';
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
    };

    setIsSaving(true);
    try {
      const result = await savedRepositoryService.saveRepository(payload);
      const savedRecord = result?.repository;

      if (savedRecord) {
        if (savedRecord.id) {
          // Map backend savedRepositoryId (record ID in DB) to repository key
          repoToSavedIdMapRef.current.set(repoKey, savedRecord.id);
          repoToSavedIdMapRef.current.set(issueKey, savedRecord.id);
          if (savedRecord.githubRepositoryId) {
            repoToSavedIdMapRef.current.set(String(savedRecord.githubRepositoryId), savedRecord.id);
          }
        }

        setSavedRepositories((prev) => {
          // Prevent duplicate saves
          const alreadyExists = prev.some((r) => getRepoKey(r) === repoKey || (savedRecord.id && r.id === savedRecord.id));
          if (alreadyExists) return prev;
          return [savedRecord, ...prev];
        });
      }
    } catch (err) {
      // Set error message and DO NOT falsely add to saved list
      setSaveError(err.message || 'Failed to save repository to backend.');
    } finally {
      setIsSaving(false);
    }
  }, [savedRepositories]);

  const removeSavedIssue = useCallback(async (issueOrId) => {
    if (!issueOrId) return;

    setSaveError('');

    const issueKey = getIssueKey(issueOrId);
    const repoKey = getRepoKey(issueOrId);

    // Determine backend database record ID
    let backendSavedId =
      (typeof issueOrId === 'object' && (issueOrId.savedRepositoryId || issueOrId.id) && !isNaN(issueOrId.savedRepositoryId || issueOrId.id) ? Number(issueOrId.savedRepositoryId || issueOrId.id) : null) ||
      repoToSavedIdMapRef.current.get(repoKey) ||
      repoToSavedIdMapRef.current.get(issueKey);

    if (!backendSavedId && (typeof issueOrId === 'number' || (!isNaN(issueOrId) && !String(issueOrId).includes('/')))) {
      backendSavedId = Number(issueOrId);
    }

    const targetRepo = savedRepositories.find((r) => (backendSavedId && r.id === backendSavedId) || (repoKey && getRepoKey(r) === repoKey));
    const finalRecordId = backendSavedId || targetRepo?.id;

    if (!finalRecordId) {
      // Local removal
      setSavedRepositories((prev) => prev.filter((r) => (repoKey ? getRepoKey(r) !== repoKey : true)));
      return;
    }

    try {
      await savedRepositoryService.deleteSavedRepository(finalRecordId);
      setSavedRepositories((prev) => prev.filter((r) => r.id !== finalRecordId));
      if (repoKey) repoToSavedIdMapRef.current.delete(repoKey);
      if (issueKey) repoToSavedIdMapRef.current.delete(issueKey);
    } catch (err) {
      setSaveError(err.message || 'Failed to remove saved repository from backend.');
    }
  }, [savedRepositories]);

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
