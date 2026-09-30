import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { BY_ID } from '../data/ingredients';
import { useKitchen } from '../state/KitchenContext';
import { anchors } from '../state/dom';
import { BenchChip } from './BenchChip';

const SLOTS = 10;

export function Bench({ celebrating }: { celebrating: boolean }) {
  const { state, dispatch } = useKitchen();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    anchors.bench = ref.current;
    return () => {
      anchors.bench = null;
    };
  }, []);

  const empties = Math.max(0, SLOTS - state.bench.length);

  return (
    <section className="bench" aria-labelledby="bench-title">
      <div className="bench-head">
        <h2 id="bench-title">
          Kitchen bench <span className="muted">({state.bench.length})</span>
        </h2>
        <p className="muted bench-hint">Drag friends here, or tap them.</p>
        {state.bench.length > 0 && (
          <button type="button" className="ghost-btn" onClick={() => dispatch({ type: 'clear' })}>
            Clear bench
          </button>
        )}
      </div>
      <div ref={ref} className={`bench-top${state.bench.length ? '' : ' is-empty'}`}>
        <motion.ul layout className="bench-list" aria-live="polite">
          <AnimatePresence mode="popLayout">
            {state.bench.map((id) => {
              const ing = BY_ID.get(id);
              return ing ? <BenchChip key={id} ing={ing} celebrating={celebrating} /> : null;
            })}
            {Array.from({ length: empties }, (_, i) => (
              <motion.li layout key={`slot-${i}`} className="bench-slot" aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            ))}
          </AnimatePresence>
        </motion.ul>
        {state.bench.length === 0 && <p className="bench-empty">Your bench is empty. Open the fridge and grab a friend!</p>}
      </div>
    </section>
  );
}
