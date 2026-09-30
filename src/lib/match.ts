import { RECIPES } from '../data/recipes';
import { STAPLE_IDS } from '../data/staples';
import type { Bucket, RankedRecipe, Recipe } from './types';

const BUCKET_ORDER: Record<Bucket, number> = { now: 0, almost: 1, later: 2 };

const N = RECIPES.length;

const requiredIds = (r: Recipe): string[] =>
  r.ingredients.filter((i) => !i.optional && !STAPLE_IDS.has(i.id)).map((i) => i.id);
const optionalIds = (r: Recipe): string[] =>
  r.ingredients.filter((i) => i.optional && !STAPLE_IDS.has(i.id)).map((i) => i.id);

export const DF: ReadonlyMap<string, number> = (() => {
  const df = new Map<string, number>();
  for (const r of RECIPES) for (const id of requiredIds(r)) df.set(id, (df.get(id) ?? 0) + 1);
  return df;
})();

export const idf = (id: string): number => Math.log(1 + N / (DF.get(id) ?? N));

export function rank(selected: ReadonlySet<string>): RankedRecipe[] {
  const haveOptional = (x: RankedRecipe) => optionalIds(x.recipe).filter((id) => selected.has(id)).length;
  return RECIPES.map((recipe): RankedRecipe => {
    const req = requiredIds(recipe);
    const have = req.filter((id) => selected.has(id));
    const missing = req.filter((id) => !selected.has(id)).sort((a, b) => idf(b) - idf(a));
    const w = req.reduce((s, id) => s + idf(id), 0);
    const wh = have.reduce((s, id) => s + idf(id), 0);
    return {
      recipe,
      have,
      missing,
      missingOptional: optionalIds(recipe).filter((id) => !selected.has(id)),
      coverage: w ? wh / w : 0,
      bucket: missing.length === 0 ? 'now' : missing.length <= 2 ? 'almost' : 'later',
    };
  }).sort(
    (a, b) =>
      BUCKET_ORDER[a.bucket] - BUCKET_ORDER[b.bucket] ||
      b.coverage - a.coverage ||
      a.missing.length - b.missing.length ||
      haveOptional(b) - haveOptional(a) ||
      a.recipe.name.localeCompare(b.recipe.name),
  );
}
