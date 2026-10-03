import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { KawaiiDish } from '../assets/KawaiiDish';
import { KawaiiFood } from '../assets/KawaiiFood';
import { STAPLE_IDS } from '../data/staples';
import { nameOf } from '../data/ingredients';
import type { RankedRecipe } from '../lib/types';
import { useKitchen } from '../state/KitchenContext';
import { CookScene } from './CookScene';
import { MatchRing } from './MatchRing';
import { RegionChip } from './RecipeCard';

export function RecipeModal({ r, onClose }: { r: RankedRecipe; onClose: () => void }) {
  const reduce = useReducedMotion();
  const { add } = useKitchen();
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [cooks, setCooks] = useState(0);
  const { recipe } = r;
  const staples = recipe.ingredients.filter((i) => STAPLE_IDS.has(i.id)).map((i) => i.id);
  const optional = recipe.ingredients.filter((i) => i.optional).map((i) => i.id);

  useEffect(() => {
    const back = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialog.current) {
        const f = dialog.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
        const first = f[0];
        const last = f[f.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      back?.focus();
    };
  }, [onClose]);

  return (
    <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal"
        initial={reduce ? { opacity: 0 } : { y: 40, scale: 0.92, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={reduce ? { opacity: 0 } : { y: 30, scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeBtn} type="button" className="modal-close" onClick={onClose} aria-label="Close recipe">
          ×
        </button>
        <div className="modal-hero">
          <KawaiiDish id={recipe.dishAsset} size={132} mood={r.bucket === 'now' ? 'excited' : 'happy'} />
          <div>
            <RegionChip r={recipe} />
            <h2 id="modal-title">{recipe.name}</h2>
            <p className="muted">{recipe.blurb}</p>
          </div>
          <MatchRing value={r.coverage} size={64} />
        </div>
        {r.bucket === 'now' && (
          <div className="cook-row">
            <button type="button" className="cta cook-btn" onClick={() => setCooks((n) => n + 1)}>
              Let's cook!
            </button>
            {cooks > 0 && <CookScene key={cooks} tool={recipe.tool} ids={r.have} />}
          </div>
        )}
        <div className="modal-cols">
          <section>
            <h3>You have</h3>
            <ul className="pill-list">
              {r.have.length === 0 && <li className="muted">Nothing yet</li>}
              {r.have.map((id) => (
                <li key={id} className="pill">
                  <KawaiiFood id={id} size={22} mood="bliss" /> {nameOf(id)}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Still need</h3>
            <ul className="pill-list">
              {r.missing.length === 0 && <li className="muted">Nothing! Go cook.</li>}
              {r.missing.map((id) => (
                <li key={id}>
                  <button type="button" className="pill pill--missing" onClick={() => add(id)} aria-label={`Add ${nameOf(id)} to bench`}>
                    <KawaiiFood id={id} size={22} /> {nameOf(id)} <span aria-hidden>+</span>
                  </button>
                </li>
              ))}
            </ul>
            {optional.length > 0 && (
              <p className="muted small">Nice to have: {optional.map(nameOf).join(', ')}</p>
            )}
            {staples.length > 0 && <p className="muted small">Assumed staples: {staples.map(nameOf).join(', ')}</p>}
          </section>
        </div>
        <h3>Steps</h3>
        <ol className="steps">
          {recipe.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </motion.div>
    </motion.div>
  );
}
