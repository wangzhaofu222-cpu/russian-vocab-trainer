import { initials } from '../data';

export default function AlphabetFilter({ value, onChange }) {
  return (
    <div className="alphabet-grid">
      <button
        type="button"
        className={value === 'ALL' ? 'chip active' : 'chip'}
        onClick={() => onChange('ALL')}
      >
        全部
      </button>
      {initials.map((initial) => (
        <button
          key={initial}
          type="button"
          className={value === initial ? 'chip active' : 'chip'}
          onClick={() => onChange(initial)}
        >
          {initial}
        </button>
      ))}
    </div>
  );
}
