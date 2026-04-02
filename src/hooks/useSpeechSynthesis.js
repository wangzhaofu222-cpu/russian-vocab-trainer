import { useCallback, useEffect, useState } from 'react';

function findRussianVoice(voices) {
  return (
    voices.find((voice) => voice.lang === 'ru-RU') ||
    voices.find((voice) => voice.lang?.toLowerCase().startsWith('ru')) ||
    null
  );
}

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return undefined;
    }

    const updateVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
    };
  }, []);

  const supported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance !== 'undefined';

  const speakWord = useCallback(
    (word) => {
      const text = String(word ?? '').trim();

      if (!supported) {
        return {
          ok: false,
          reason: '当前浏览器不支持语音朗读，可以换到新版 Chrome、Edge 或 Safari 试试。',
        };
      }

      if (!text) {
        return {
          ok: false,
          reason: '当前没有可朗读的单词。',
        };
      }

      const utterance = new window.SpeechSynthesisUtterance(text);
      const russianVoice = findRussianVoice(voices);

      utterance.lang = russianVoice?.lang || 'ru-RU';
      if (russianVoice) {
        utterance.voice = russianVoice;
      }
      utterance.rate = 0.92;
      utterance.pitch = 1;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);

      return { ok: true };
    },
    [supported, voices],
  );

  return {
    supported,
    speakWord,
  };
}
