import rawVocab from '../russian_vocab_final.json';

const RUSSIAN_INITIAL_ORDER = [
  'А',
  'Б',
  'В',
  'Г',
  'Д',
  'Е',
  'Ё',
  'Ж',
  'З',
  'И',
  'Й',
  'К',
  'Л',
  'М',
  'Н',
  'О',
  'П',
  'Р',
  'С',
  'Т',
  'У',
  'Ф',
  'Х',
  'Ц',
  'Ч',
  'Ш',
  'Щ',
  'Ъ',
  'Ы',
  'Ь',
  'Э',
  'Ю',
  'Я',
];

const fallbackCollator = new Intl.Collator('ru');

function sortInitials(a, b) {
  const aIndex = RUSSIAN_INITIAL_ORDER.indexOf(a);
  const bIndex = RUSSIAN_INITIAL_ORDER.indexOf(b);

  if (aIndex !== -1 && bIndex !== -1) {
    return aIndex - bIndex;
  }

  if (aIndex !== -1) {
    return -1;
  }

  if (bIndex !== -1) {
    return 1;
  }

  return fallbackCollator.compare(a, b);
}

export const vocabList = rawVocab.map((item, index) => ({
  id: `${String(item.word ?? '')}-${String(item.initial ?? '')}-${String(item.first_page ?? '')}-${index}`,
  word: String(item.word ?? ''),
  pos: String(item.pos ?? '未标注'),
  meaning: String(item.meaning ?? ''),
  initial: String(item.initial ?? '').trim() || '#',
  firstPage: Number(item.first_page ?? 0),
}));

export const initials = Array.from(new Set(vocabList.map((item) => item.initial))).sort(sortInitials);

export function filterWords(words, search, initial) {
  const normalizedSearch = search.trim().toLowerCase();

  return words.filter((item) => {
    const matchesInitial = !initial || initial === 'ALL' || item.initial === initial;
    const matchesSearch =
      !normalizedSearch ||
      item.word.toLowerCase().includes(normalizedSearch) ||
      item.meaning.toLowerCase().includes(normalizedSearch);

    return matchesInitial && matchesSearch;
  });
}
