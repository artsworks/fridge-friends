import { STOCKABLE } from '../data/ingredients';
import type { Ingredient } from './types';

const norm = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const INDEX: { ing: Ingredient; terms: string[] }[] = STOCKABLE.map((ing) => ({
  ing,
  terms: [ing.name, ing.id.replace(/_/g, ' '), ...ing.aliases].map(norm),
}));

/** Case/space-insensitive prefix search over names and aliases. Exact hits first, then name hits, then alias hits. */
export function resolve(query: string): Ingredient[] {
  const q = norm(query);
  if (!q) return [];
  const scored: { ing: Ingredient; score: number }[] = [];
  for (const { ing, terms } of INDEX) {
    let best = Infinity;
    terms.forEach((t, idx) => {
      const words = t.split(' ');
      let s = Infinity;
      if (t === q) s = 0;
      else if (t.startsWith(q)) s = 1;
      else if (words.some((_, w) => words.slice(w).join(' ').startsWith(q))) s = 2;
      if (s < Infinity) best = Math.min(best, s * 10 + (idx === 0 ? 0 : 1));
    });
    if (best < Infinity) scored.push({ ing, score: best });
  }
  return scored.sort((a, b) => a.score - b.score || a.ing.name.localeCompare(b.ing.name)).map((x) => x.ing);
}
