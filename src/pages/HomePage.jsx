import { Link } from 'react-router-dom';
import { initials, vocabList } from '../data';
import StatsSummary from '../components/StatsSummary';
import { useAuth } from '../hooks/useAuth';
import { useStudyMetrics } from '../hooks/useStudyMetrics';

export default function HomePage() {
  const { currentUser } = useAuth();
  const { metrics } = useStudyMetrics();

  const summaryItems = [
    { label: '总单词数', value: metrics.totalWords, hint: '词库总量' },
    { label: '已掌握', value: metrics.mastered, hint: '已标记认识' },
    { label: '错词数量', value: metrics.mistakes, hint: '错词本累计' },
    { label: '掌握率', value: `${metrics.masteryRate}%`, hint: '按总词数计算' },
  ];

  return (
    <section className="page-stack">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="section-tag">长期学习</p>
          <p className="welcome-copy">欢迎回来，{currentUser}</p>
          <h2>用卡片和错词本，高效建立稳定的俄语词汇记忆</h2>
          <p>
            这个网站直接读取 `russian_vocab_final.json`，你可以按字母浏览词汇、搜索释义、进行卡片学习，并把不熟悉的单词沉淀到错词本里持续复习。
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/study">
              继续学习
            </Link>
            <Link className="button secondary" to="/words">
              浏览单词表
            </Link>
            <Link className="button ghost" to="/mistakes">
              打开错词本
            </Link>
            <Link className="button ghost" to="/stats">
              查看统计
            </Link>
          </div>
        </div>

        <aside className="hero-aside">
          <div className="highlight-card">
            <p className="section-tag">今日学习概览</p>
            <StatsSummary items={summaryItems} compact />
            <p className="highlight-note">
              已复习 {metrics.reviewed} 个词，当前还有 {Math.max(vocabList.length - metrics.mastered, 0)} 个词等待掌握。
            </p>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="section-tag">首页分类</p>
            <h2>俄语字母分类</h2>
            <p className="panel-description">选择一个字母，快速进入对应词汇列表。</p>
          </div>
          <div className="panel-links">
            <Link className="text-link" to="/words">
              查看全部词汇
            </Link>
            <Link className="text-link" to="/stats">
              查看学习统计
            </Link>
          </div>
        </div>

        <div className="alphabet-grid home-grid">
          {initials.map((initial) => (
            <Link key={initial} className="letter-tile" to={`/words?initial=${encodeURIComponent(initial)}`}>
              <span className="letter">{initial}</span>
              <span>进入该字母词汇</span>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
