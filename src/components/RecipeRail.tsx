import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import type { Bucket, RankedRecipe, Region } from '../lib/types';
import { REGION_LABEL } from '../data/recipes';
import { Flag } from './Flag';
import { RecipeCard } from './RecipeCard';

type Filter = 'all' | 'australian' | Region;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'australian', label: 'Aussie' },
  ...(Object.keys(REGION_LABEL) as Region[]).map((id) => ({ id, label: REGION_LABEL[id].label })),
];

const HEAD: Record<Bucket, string> = { now: 'Cook now', almost: 'Almost there', later: 'More ideas' };

interface Props {
  ranked: RankedRecipe[];
  benchSize: number;
  fresh: ReadonlySet<string>;
  onOpen: (r: RankedRecipe) => void;
  onDemo: () => void;
}

export function RecipeRail({ ranked, benchSize, fresh, onOpen, onDemo }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [showLater, setShowLater] = useState(false);
  const list = ranked.filter((r) =>
    filter === 'all' ? true : filter === 'australian' ? r.recipe.cuisine === 'australian' : r.recipe.region === filter,
  );
  const count = (b: Bucket) => list.filter((r) => r.bucket === b).length;
  const later = count('later');
  const visible = list.filter((r) => r.bucket !== 'later' || showLater || benchSize === 0);
  const pickId = benchSize > 0 && list[0] && list[0].bucket !== 'later' ? list[0].recipe.id : null;

  const rows: ({ kind: 'head'; b: Bucket } | { kind: 'card'; r: RankedRecipe })[] = [];
  let prev: Bucket | null = null;
  for (const r of visible) {
    if (benchSize > 0 && r.bucket !== prev) rows.push({ kind: 'head', b: r.bucket });
    prev = r.bucket;
    rows.push({ kind: 'card', r });
  }

  return (
    <aside className="rail" aria-labelledby="rail-title">
      <div className="rail-head">
        <h2 id="rail-title">What can I make?</h2>
        <p className="muted rail-sub" aria-live="polite">
          {benchSize === 0
            ? 'Add friends to the bench and recipes will line up.'
            : `${count('now')} ready, ${count('almost')} almost there`}
        </p>
        <div className="filters" role="group" aria-label="Filter by cuisine">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" className="filter" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.id !== 'all' && <Flag id={f.id} size={14} />} {f.label}
            </button>
          ))}
        </div>
      </div>
      {benchSize === 0 && (
        <div className="rail-empty">
          <p>Not sure where to start?</p>
          <button type="button" className="cta" onClick={onDemo}>
            Try a demo bench
          </button>
        </div>
      )}
      <motion.ul layout className="rail-list">
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map((row) =>
            row.kind === 'head' ? (
              <motion.li layout key={`h-${row.b}`} className={`bucket-head bucket-head--${row.b}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {HEAD[row.b]} <span className="muted">({count(row.b)})</span>
              </motion.li>
            ) : (
              <RecipeCard
                key={row.r.recipe.id}
                r={row.r}
                pick={row.r.recipe.id === pickId}
                fresh={fresh.has(row.r.recipe.id)}
                onOpen={() => onOpen(row.r)}
              />
            ),
          )}
          {benchSize > 0 && later > 0 && (
            <motion.li layout key="more" className="more-row">
              <button type="button" className="ghost-btn" aria-expanded={showLater} onClick={() => setShowLater((v) => !v)}>
                {showLater ? 'Hide extra ideas' : `${later} more ideas`}
              </button>
            </motion.li>
          )}
          {list.length === 0 && (
            <li key="none" className="muted">
              No recipes in this cuisine.
            </li>
          )}
        </AnimatePresence>
      </motion.ul>
    </aside>
  );
}
