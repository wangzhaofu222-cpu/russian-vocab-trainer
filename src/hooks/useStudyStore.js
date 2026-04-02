import { useEffect, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useLocalStorage } from './useLocalStorage';
import { buildStudyStorageKey } from '../utils/storageKeys';

const defaultStudyState = {
  progress: {},
  mistakes: [],
};

const LEGACY_STORAGE_KEY = 'russian-vocab-study';

function readLegacyStudyState() {
  if (typeof window === 'undefined') {
    return defaultStudyState;
  }

  try {
    const storedValue = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    return storedValue ? JSON.parse(storedValue) : defaultStudyState;
  } catch (error) {
    console.warn('Failed to read legacy study state', error);
    return defaultStudyState;
  }
}

export function useStudyStore() {
  const { currentUser } = useAuth();
  const storageKey = currentUser ? buildStudyStorageKey(currentUser) : null;
  const [studyState, setStudyState] = useLocalStorage(storageKey, () =>
    currentUser ? readLegacyStudyState() : defaultStudyState,
  );

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') {
      return;
    }

    const hasLegacy = Boolean(window.localStorage.getItem(LEGACY_STORAGE_KEY));
    const hasScoped = Boolean(window.localStorage.getItem(storageKey));

    if (hasLegacy && hasScoped) {
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  }, [storageKey]);

  const progress = studyState.progress ?? {};
  const mistakes = studyState.mistakes ?? [];

  const stats = useMemo(() => {
    const known = Object.values(progress).filter((value) => value === 'known').length;
    const unknown = Object.values(progress).filter((value) => value === 'unknown').length;

    return {
      known,
      unknown,
      reviewed: known + unknown,
      mistakes: mistakes.length,
    };
  }, [mistakes.length, progress]);

  const markWord = (wordId, status) => {
    setStudyState((previous) => {
      const previousProgress = previous.progress ?? {};
      const previousMistakes = previous.mistakes ?? [];

      const nextMistakes =
        status === 'unknown'
          ? Array.from(new Set([...previousMistakes, wordId]))
          : previousMistakes.filter((item) => item !== wordId);

      return {
        progress: {
          ...previousProgress,
          [wordId]: status,
        },
        mistakes: nextMistakes,
      };
    });
  };

  const removeMistake = (wordId) => {
    setStudyState((previous) => ({
      progress: {
        ...(previous.progress ?? {}),
        [wordId]: 'known',
      },
      mistakes: (previous.mistakes ?? []).filter((item) => item !== wordId),
    }));
  };

  const clearMistakes = () => {
    setStudyState((previous) => ({
      progress: previous.progress ?? {},
      mistakes: [],
    }));
  };

  return {
    progress,
    mistakes,
    stats,
    markWord,
    removeMistake,
    clearMistakes,
  };
}
