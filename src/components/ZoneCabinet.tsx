import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { KawaiiFood } from '../assets/KawaiiFood';
import { byZone } from '../data/ingredients';
import type { Zone } from '../lib/types';
import { useKitchen } from '../state/KitchenContext';
import { anchors } from '../state/dom';
import { SPRING } from '../theme/tokens';
import { IngredientChip } from './IngredientChip';

interface Props {
  zone: Zone;
  label: string;
  blurb: string;
}

const PEEK: Record<Zone, string[]> = {
  fridge: ['egg', 'cheese', 'carrot'],
  pantry: ['rice', 'soy_sauce', 'onion'],
  freezer: ['gyoza', 'peas', 'chips'],
};

function Frost() {
  const flakes = Array.from({ length: 10 }, (_, i) => i);
  return (
    <div className="frost" aria-hidden>
      {flakes.map((i) => (
        <motion.span
          key={i}
          className="flake"
          style={{ left: `${(i * 37) % 100}%` }}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: [-10, 220], opacity: [0, 0.9, 0] }}
          transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.5, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

export function ZoneCabinet({ zone, label, blurb }: Props) {
  const { state, dispatch } = useKitchen();
  const reduce = useReducedMotion();
  const open = state.openZone === zone;
  const head = useRef<HTMLButtonElement>(null);
  const [frosty, setFrosty] = useState(false);
  const items = byZone(zone);
  const count = items.filter((i) => state.bench.includes(i.id)).length;
  const panelId = `zone-${zone}`;

  useEffect(() => {
    const el = head.current;
    if (el) anchors.zoneHeads.set(zone, el);
  }, [zone]);

  useEffect(() => {
    if (zone !== 'freezer' || !open) {
      setFrosty(false);
      return;
    }
    const t = setTimeout(() => setFrosty(true), 1500);
    return () => clearTimeout(t);
  }, [zone, open]);

  return (
    <motion.section
      layout
      transition={SPRING}
      className={`cabinet cabinet--${zone}${open ? ' is-open' : ''}`}
      aria-label={label}
    >
      <motion.button
        layout="position"
        ref={head}
        type="button"
        className="cabinet-head"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => dispatch({ type: 'openZone', zone: open ? null : zone })}
      >
        <span className="cabinet-title">
          {label}
          {count > 0 && <span className="cabinet-count">{count}</span>}
        </span>
        <span className="cabinet-blurb">{blurb}</span>
        <span className="cabinet-caret" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </motion.button>

      {!open && (
        <motion.div layout="position" className="cabinet-peek" aria-hidden>
          {PEEK[zone].map((id, i) => (
            <motion.span
              key={id}
              animate={reduce ? undefined : { y: [0, -3, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.4 }}
            >
              <KawaiiFood id={id} size={34} mood={zone === 'freezer' ? 'frost' : 'sleepy'} shelf />
            </motion.span>
          ))}
        </motion.div>
      )}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            className="cabinet-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
          >
            {zone === 'fridge' && <div className="fridge-light" aria-hidden />}
            {zone === 'freezer' && !reduce && <Frost />}
            <ul className="chip-grid">
              {items.map((ing, i) => (
                <li key={ing.id}>
                  <IngredientChip ing={ing} index={i} frosty={frosty} />
                </li>
              ))}
            </ul>
            {zone === 'fridge' && !reduce && (
              <motion.div
                className="fridge-door"
                aria-hidden
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -105, opacity: 0 }}
                transition={{ rotateY: { type: 'spring', stiffness: 120, damping: 16 }, opacity: { delay: 0.35, duration: 0.2 } }}
              />
            )}
            {zone === 'freezer' && !reduce && (
              <motion.div
                className="freezer-glass"
                aria-hidden
                initial={{ y: '0%' }}
                animate={{ y: '-105%' }}
                transition={{ type: 'spring', stiffness: 140, damping: 20 }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
