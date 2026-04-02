import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

const defaultStudyState = {
  progress: {},
  mistakes: [],
};

export function useStudyStore() {
  const [studyState, setStudyState] = useLocalStorage('russian-vocab-study', defaultStudyState);

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
