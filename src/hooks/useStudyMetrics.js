import { useMemo } from 'react';
import { vocabList } from '../data';
import { useStudyStore } from './useStudyStore';

export function useStudyMetrics() {
  const studyStore = useStudyStore();

  const metrics = useMemo(() => {
    const totalWords = vocabList.length;
    const mastered = studyStore.stats.known;
    const mistakes = studyStore.stats.mistakes;
    const unknown = studyStore.stats.unknown;
    const reviewed = studyStore.stats.reviewed;
    const masteryRate = totalWords > 0 ? Math.round((mastered / totalWords) * 100) : 0;

    return {
      totalWords,
      mastered,
      mistakes,
      unknown,
      reviewed,
      masteryRate,
      remaining: Math.max(totalWords - mastered, 0),
    };
  }, [studyStore.stats]);

  return {
    ...studyStore,
    metrics,
  };
}
