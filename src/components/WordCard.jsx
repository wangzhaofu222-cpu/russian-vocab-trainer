export default function WordCard({ word, action }) {
  return (
    <article className="word-card">
      <div className="word-card-head">
        <div>
          <h3>{word.word}</h3>
          <p className="word-meta">
            <span>{word.pos}</span>
            <span>{word.initial}</span>
          </p>
        </div>
        {action}
      </div>
      <p className="word-meaning">{word.meaning}</p>
    </article>
  );
}
