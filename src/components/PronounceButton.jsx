import { useEffect, useState } from 'react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export default function PronounceButton({ word, size = 'default', className = '' }) {
  const { speakWord } = useSpeechSynthesis();
  const [message, setMessage] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!message && !isActive) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setMessage('');
      setIsActive(false);
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [isActive, message]);

  const handleClick = (event) => {
    event.stopPropagation();

    const result = speakWord(word);

    if (!result.ok) {
      setMessage(result.reason);
      setIsActive(false);
      return;
    }

    setMessage('');
    setIsActive(true);
  };

  const classes = [
    'pronounce-button-wrap',
    size === 'large' ? 'large' : '',
    className,
    isActive ? 'playing' : '',
    message ? 'show-message' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      <button
        type="button"
        className="pronounce-button"
        onClick={handleClick}
        onKeyDown={(event) => event.stopPropagation()}
        aria-label={`朗读单词 ${word}`}
        title="播放俄语发音"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 14h3l4 4V6L8 10H5zM16 8a6 6 0 0 1 0 8M18.5 5.5a9.5 9.5 0 0 1 0 13"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </button>
      {message ? (
        <span className="pronounce-message" role="status" aria-live="polite">
          {message}
        </span>
      ) : null}
    </span>
  );
}
