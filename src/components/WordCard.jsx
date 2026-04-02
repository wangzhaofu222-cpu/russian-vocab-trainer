import PronounceButton from './PronounceButton';

export default function WordCard({ word, action }) {
  return (
    <article className="word-card">
      <div className="word-card-head">
        <div>
          <div className="word-badge-row">
            <span className="word-pill">{word.initial}</span>
            <span className="word-pill muted-pill">{word.pos}</span>
          </div>
          <h3>{word.word}</h3>
          <p className="word-meta">
            <span>第 {word.firstPage || '-'} 页</span>
          </p>
        </div>
        <div className="word-card-actions">
          <PronounceButton word={word.word} />
          {action}
        </div>
      </div>
      <p className="word-meaning">{word.meaning}</p>
    </article>
  );
}
