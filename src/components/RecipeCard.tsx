import { motion, useReducedMotion } from 'motion/react';
import { forwardRef } from 'react';
import { KawaiiDish } from '../assets/KawaiiDish';
import { KawaiiFood } from '../assets/KawaiiFood';
import { nameOf } from '../data/ingredients';
import { REGION_LABEL } from '../data/recipes';
import type { RankedRecipe } from '../lib/types';
import { SPRING } from '../theme/tokens';
import { Flag } from './Flag';
import { MatchRing } from './MatchRing';

interface Props {
  r: RankedRecipe;
  pick: boolean;
  fresh: boolean;
  onOpen: () => void;
}

export function RegionChip({ r }: { r: RankedRecipe['recipe'] }) {
  const label = r.region ? REGION_LABEL[r.region].label : 'Aussie';
  return (
    <span className="region-chip">
      <Flag id={r.region ?? 'australian'} size={15} /> {label}
    </span>
  );
}

export const RecipeCard = forwardRef<HTMLLIElement, Props>(function RecipeCard({ r, pick, fresh, onOpen }, ref) {
  const reduce = useReducedMotion();
  const { recipe, bucket, missing, missingOptional, have } = r;
  const status =
    bucket === 'now' ? 'You can cook this now' : `${missing.length} missing: ${missing.map(nameOf).join(', ')}`;
  return (
    <motion.li
      ref={ref}
      layout
      transition={SPRING}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={fresh && !reduce ? { opacity: 1, scale: [1, 1.06, 1] } : { opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`card card--${bucket}${pick ? ' card--pick' : ''}`}
    >
      <button type="button" className="card-btn" onClick={onOpen} aria-label={`${recipe.name}. ${status}. Open recipe`}>
        {pick && <span className="pick-badge">Chef's pick</span>}
        <span className="card-dish">
          {fresh && (
            <svg className="chef-hat" viewBox="0 0 32 28" width="30" height="26" aria-hidden>
              <path d="M8 18c-4 0-6-3-6-6s3-6 6-5c1-4 4-6 8-6s7 2 8 6c3-1 6 2 6 5s-2 6-6 6z" fill="#fff" stroke="#3A2E2A" strokeWidth="2.5" strokeLinejoin="round" />
              <rect x="8" y="18" width="16" height="7" rx="2" fill="#fff" stroke="#3A2E2A" strokeWidth="2.5" />
            </svg>
          )}
          <KawaiiDish id={recipe.dishAsset} size={64} mood={bucket === 'now' ? 'bliss' : bucket === 'almost' ? 'happy' : 'idle'} />
        </span>
        <span className="card-body">
          <span className="card-top">
            <span className="card-name">{recipe.name}</span>
            <RegionChip r={recipe} />
          </span>
          <span className="card-blurb">{recipe.blurb}</span>
          <span className="card-need">
            {bucket === 'now' ? (
              <span className="need-ok">Ready! {have.length} friends on the bench</span>
            ) : (
              missing.map((id) => (
                <span key={id} className="need-chip">
                  <KawaiiFood id={id} size={18} /> {nameOf(id)}
                </span>
              ))
            )}
            {missingOptional.slice(0, 2).map((id) => (
              <span key={id} className="need-chip need-chip--opt">
                + {nameOf(id)}
              </span>
            ))}
          </span>
        </span>
        <MatchRing value={r.coverage} />
      </button>
    </motion.li>
  );
});
