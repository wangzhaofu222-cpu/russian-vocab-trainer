import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import AlphabetFilter from '../components/AlphabetFilter';
import WordCard from '../components/WordCard';
import { filterWords, vocabList } from '../data';

export default function WordListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const initial = searchParams.get('initial') ?? 'ALL';

  const words = useMemo(() => filterWords(vocabList, search, initial), [initial, search]);

  const updateParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'ALL') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    setSearchParams(nextParams);
  };

  return (
    <section className="page-stack">
      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="section-tag">词表浏览</p>
            <h2>单词列表</h2>
            <p className="panel-description">搜索俄语单词或中文释义，并按字母快速缩小范围。</p>
          </div>
          <p className="muted">共找到 {words.length} 个结果</p>
        </div>

        <div className="control-stack">
          <label className="search-box elevated-field">
            <span>搜索单词或释义</span>
            <input
              type="search"
              placeholder="例如：абзац / 段落"
              value={search}
              onChange={(event) => updateParams({ search: event.target.value })}
            />
          </label>

          <div>
            <p className="control-label">按 initial 筛选</p>
            <AlphabetFilter value={initial} onChange={(value) => updateParams({ initial: value })} />
          </div>
        </div>
      </section>

      <section className="word-list">
        {words.length > 0 ? (
          words.map((word) => <WordCard key={word.id} word={word} />)
        ) : (
          <div className="empty-state">
            <h3>没有找到匹配的单词</h3>
            <p>可以尝试更换搜索词，或者切换其他俄语字母分类继续查找。</p>
          </div>
        )}
      </section>
    </section>
  );
}
