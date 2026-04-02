import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AlphabetFilter from '../components/AlphabetFilter';
import PronounceButton from '../components/PronounceButton';
import { filterWords, vocabList } from '../data';
import { useStudyMetrics } from '../hooks/useStudyMetrics';

export default function StudyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get('initial') ?? 'ALL';
  const mode = searchParams.get('mode') ?? 'all';

  const { markWord, mistakes, progress, stats, metrics } = useStudyMetrics();
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
  const progressPercent = deck.length > 0 ? ((currentIndex + 1) / deck.length) * 100 : 0;

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
            <p className="panel-description">先看俄语单词，再点开释义，用轻量节奏持续复习。</p>
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
          <div className="study-progress-panel">
            <div className="study-progress-head">
              <div>
                <p className="section-tag">学习进度</p>
                <h3>
                  第 {currentIndex + 1} / {deck.length} 个
                </h3>
              </div>
              <span className="muted">{mode === 'mistakes' ? '错词专项复习' : '词汇卡片练习'}</span>
            </div>
            <div className="study-mini-stats">
              <span className="mini-stat">
                <strong>{metrics.mastered}</strong>
                <em>已认识</em>
              </span>
              <span className="mini-stat">
                <strong>{metrics.unknown}</strong>
                <em>不认识</em>
              </span>
              <span className="mini-stat">
                <strong>{metrics.masteryRate}%</strong>
                <em>掌握率</em>
              </span>
            </div>
            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div
            className="study-card"
            role="button"
            tabIndex={0}
            onClick={() => setRevealed((value) => !value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setRevealed((value) => !value);
              }
            }}
          >
            <div className="study-card-top">
              <span className="study-step">{revealed ? '已显示中文释义' : '点击卡片显示中文释义'}</span>
              <PronounceButton word={currentWord.word} size="large" className="study-pronounce" />
            </div>
            <div className="study-word">{currentWord.word}</div>
            <div className="study-pos">{currentWord.pos}</div>
            <div className="study-divider" />
            <div className={revealed ? 'study-meaning visible' : 'study-meaning'}>
              {revealed ? currentWord.meaning : '先回想词义，再点击卡片查看答案'}
            </div>
            {currentStatus && (
              <span className={`status-badge ${currentStatus}`}>
                {currentStatus === 'known' ? '已标记为认识' : '已标记为不认识'}
              </span>
            )}
          </div>

          <div className="study-actions">
            <button type="button" className="button ghost" onClick={moveToPrev}>
              上一张
            </button>
            <button type="button" className="button ghost" onClick={() => setRevealed(false)}>
              再看一次
            </button>
            <button type="button" className="button secondary" onClick={() => setRevealed((value) => !value)}>
              {revealed ? '隐藏释义' : '显示释义'}
            </button>
            <button type="button" className="button ghost" onClick={moveToNext}>
              下一个
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
            <div className="panel-links">
              <Link className="text-link" to="/mistakes">
                前往错词本
              </Link>
              <Link className="text-link" to="/stats">
                查看学习统计
              </Link>
            </div>
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
          <div className="hero-actions centered-actions">
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
