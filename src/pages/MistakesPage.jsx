import { Link } from 'react-router-dom';
import WordCard from '../components/WordCard';
import { vocabList } from '../data';
import { useStudyStore } from '../hooks/useStudyStore';

export default function MistakesPage() {
  const { mistakes, removeMistake, clearMistakes } = useStudyStore();
  const mistakeWords = vocabList.filter((word) => mistakes.includes(word.id));

  return (
    <section className="page-stack">
      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="section-tag">重点复习</p>
            <h2>错词本</h2>
            <p className="panel-description">把不熟悉的词集中起来，单独反复强化。</p>
          </div>
          <p className="muted">当前共有 {mistakeWords.length} 个待复习单词</p>
        </div>

        <div className="mistake-actions">
          <Link className="button primary" to="/study?mode=mistakes">
            单独复习错词本
          </Link>
          <button
            type="button"
            className="button ghost"
            onClick={clearMistakes}
            disabled={mistakeWords.length === 0}
          >
            清空错词本
          </button>
        </div>
      </section>

      {mistakeWords.length > 0 ? (
        <section className="word-list">
          {mistakeWords.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              action={
                <button type="button" className="mini-button" onClick={() => removeMistake(word.id)}>
                  标记已掌握
                </button>
              }
            />
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <h3>错词本还是空的</h3>
          <p>在背单词页面点击“不认识”后，单词会自动加入错词本并保存在本地浏览器里。</p>
          <div className="hero-actions centered-actions">
            <Link className="button primary" to="/study">
              去开始学习
            </Link>
            <Link className="button secondary" to="/words">
              查看词表
            </Link>
          </div>
        </section>
      )}
    </section>
  );
}
