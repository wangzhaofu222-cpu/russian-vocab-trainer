import StatsSummary from '../components/StatsSummary';
import { useStudyMetrics } from '../hooks/useStudyMetrics';

export default function StatsPage() {
  const { metrics } = useStudyMetrics();

  const overviewItems = [
    { label: '总单词数', value: metrics.totalWords, hint: '词库总量' },
    { label: '已掌握', value: metrics.mastered, hint: '标记为认识' },
    { label: '错词数量', value: metrics.mistakes, hint: '错词本当前数量' },
    { label: '掌握率', value: `${metrics.masteryRate}%`, hint: '已掌握 / 总单词数' },
  ];

  const detailItems = [
    { label: '已复习', value: metrics.reviewed, hint: '所有已做过判断的单词' },
    { label: '未掌握', value: metrics.unknown, hint: '标记为不认识' },
    { label: '待掌握', value: metrics.remaining, hint: '距离全掌握还剩余' },
  ];

  return (
    <section className="page-stack">
      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="section-tag">学习统计</p>
            <h2>掌握情况一览</h2>
            <p className="panel-description">这里会根据你当前浏览器里的学习记录，实时展示掌握进度和错词情况。</p>
          </div>
        </div>

        <StatsSummary items={overviewItems} />
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="section-tag">进度拆解</p>
            <h2>复习状态</h2>
          </div>
        </div>

        <StatsSummary items={detailItems} compact />
      </section>
    </section>
  );
}
