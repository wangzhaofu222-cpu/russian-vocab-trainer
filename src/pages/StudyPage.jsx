import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AlphabetFilter from '../components/AlphabetFilter';
import { filterWords, vocabList } from '../data';
import { useStudyStore } from '../hooks/useStudyStore';

export default function StudyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get('initial') ?? 'ALL';
  const mode = searchParams.get('mode') ?? 'all';

  const { markWord, mistakes, progress, stats } = useStudyStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const sourceWords = useMemo(() => {
    if (mode === 'mistakes') {
      return vocabList.filter((word) => mistakes.includes(word.id));
    }

    return vocabList;
  }, [mistakes, mode]);

  const deck = useMemo(() => filterWords(sourceWords, '', initial), [initial, sourceWords]);
  const currentWord = deck[currentIndex];
  const currentStatus = currentWord ? progress[currentWord.id] : null;

  useEffect(() => {
    setCurrentIndex(0);
    setRevealed(false);
  }, [initial, mode]);

  useEffect(() => {
    if (currentIndex > Math.max(deck.length - 1, 0)) {
      setCurrentIndex(0);
    }
  }, [currentIndex, deck.length]);

  const updateParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'ALL' || value === 'all') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    setSearchParams(nextParams);
  };

  const moveToNext = () => {
    setCurrentIndex((previous) => (deck.length > 0 ? (previous + 1) % deck.length : 0));
    setRevealed(false);
  };

  const moveToPrev = () => {
    setCurrentIndex((previous) => (deck.length > 0 ? (previous - 1 + deck.length) % deck.length : 0));
    setRevealed(false);
  };

  const handleMark = (status) => {
    if (!currentWord) {
      return;
    }

    markWord(currentWord.id, status);
    moveToNext();
  };

  return (
    <section className="page-stack">
      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="section-tag">卡片模式</p>
            <h2>背单词</h2>
          </div>
          <p className="muted">
            {mode === 'mistakes' ? '正在复习错词本' : '正在学习全部词汇'} · 共 {deck.length} 张卡片
          </p>
        </div>

        <div className="study-toolbar">
          <div className="segmented">
            <button
              type="button"
              className={mode === 'all' ? 'chip active' : 'chip'}
              onClick={() => updateParams({ mode: 'all' })}
            >
              全部词汇
            </button>
            <button
              type="button"
              className={mode === 'mistakes' ? 'chip active' : 'chip'}
              onClick={() => updateParams({ mode: 'mistakes' })}
            >
              仅错词本
            </button>
          </div>

          <div>
            <p className="control-label">按 initial 筛选</p>
            <AlphabetFilter value={initial} onChange={(value) => updateParams({ initial: value })} />
          </div>
        </div>
      </section>

      {currentWord ? (
        <section className="study-card-wrap">
          <button type="button" className="study-card" onClick={() => setRevealed((value) => !value)}>
            <span className="study-step">
              第 {currentIndex + 1} / {deck.length} 张
            </span>
            <div className="study-word">{currentWord.word}</div>
            <div className="study-pos">{currentWord.pos}</div>
            <div className="study-divider" />
            <div className={revealed ? 'study-meaning visible' : 'study-meaning'}>
              {revealed ? currentWord.meaning : '点击卡片显示中文释义'}
            </div>
            {currentStatus && (
              <span className={`status-badge ${currentStatus}`}>
                {currentStatus === 'known' ? '已标记为认识' : '已标记为不认识'}
              </span>
            )}
          </button>

          <div className="study-actions">
            <button type="button" className="button ghost" onClick={moveToPrev}>
              上一张
            </button>
            <button type="button" className="button secondary" onClick={() => setRevealed((value) => !value)}>
              {revealed ? '隐藏释义' : '显示释义'}
            </button>
            <button type="button" className="button success" onClick={() => handleMark('known')}>
              认识
            </button>
            <button type="button" className="button danger" onClick={() => handleMark('unknown')}>
              不认识
            </button>
          </div>

          <div className="study-footer">
            <p>已复习 {stats.reviewed} 个词，错词本累计 {stats.mistakes} 个词。</p>
            <Link className="text-link" to="/mistakes">
              前往错词本
            </Link>
          </div>
        </section>
      ) : (
        <section className="empty-state">
          <h3>{mode === 'mistakes' ? '错词本里还没有单词' : '当前筛选下没有卡片'}</h3>
          <p>
            {mode === 'mistakes'
              ? '先在卡片学习里把不认识的单词加入错词本，再回来单独复习。'
              : '可以切换字母分类，或者前往单词列表查看完整内容。'}
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/words">
              去看单词列表
            </Link>
            <Link className="button secondary" to="/mistakes">
              打开错词本
            </Link>
          </div>
        </section>
      )}
    </section>
  );
}
