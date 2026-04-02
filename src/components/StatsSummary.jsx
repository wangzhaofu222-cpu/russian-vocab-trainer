const defaultItems = [];

export default function StatsSummary({ items = defaultItems, compact = false }) {
  return (
    <div className={compact ? 'stats-summary compact' : 'stats-summary'}>
      {items.map((item) => (
        <article key={item.label} className="stat-card">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          {item.hint ? <small>{item.hint}</small> : null}
        </article>
      ))}
    </div>
  );
}
