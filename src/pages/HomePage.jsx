import { Link } from 'react-router-dom';
import { initials, vocabList } from '../data';
import { useStudyStore } from '../hooks/useStudyStore';

export default function HomePage() {
  const { stats } = useStudyStore();

  return (
    <section className="page-stack">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="section-tag">长期学习</p>
          <h2>按字母分类管理俄语词汇，随时开始复习</h2>
          <p>
            这个网站直接读取 `russian_vocab_final.json`，支持词表检索、卡片学习、错词本复习和学习进度保存。
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/study">
              开始背单词
            </Link>
            <Link className="button secondary" to="/words">
              浏览单词表
            </Link>
          </div>
        </div>

        <div className="stats-grid">
          <article className="stat-card">
            <span>总词数</span>
            <strong>{vocabList.length}</strong>
          </article>
          <article className="stat-card">
            <span>已复习</span>
            <strong>{stats.reviewed}</strong>
          </article>
          <article className="stat-card">
            <span>认识</span>
            <strong>{stats.known}</strong>
          </article>
          <article className="stat-card">
            <span>错词本</span>
            <strong>{stats.mistakes}</strong>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="section-tag">首页分类</p>
            <h2>俄语字母分类</h2>
          </div>
          <Link className="text-link" to="/words">
            查看全部词汇
          </Link>
        </div>

        <div className="alphabet-grid home-grid">
          {initials.map((initial) => (
            <Link key={initial} className="letter-tile" to={`/words?initial=${encodeURIComponent(initial)}`}>
              <span className="letter">{initial}</span>
              <span>查看该字母词汇</span>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
