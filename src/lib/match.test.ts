import { describe, expect, it } from 'vitest';
import { STOCKABLE, STOCKABLE_IDS } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import { STAPLE_IDS, STAPLES } from '../data/staples';
import { resolve } from './aliases';
import { DF, rank } from './match';

const ALL = new Set(STOCKABLE.map((i) => i.id));

describe('corpus', () => {
  it('has 51 stockable + 4 staples and 20 recipes (8 AU / 12 Asian, 3 per region)', () => {
    expect(STOCKABLE).toHaveLength(51);
    expect(STAPLES).toHaveLength(4);
    expect(RECIPES).toHaveLength(20);
    expect(RECIPES.filter((r) => r.cuisine === 'australian')).toHaveLength(8);
    for (const region of ['japanese', 'korean', 'chinese', 'southeast-asian'] as const) {
      expect(RECIPES.filter((r) => r.region === region)).toHaveLength(3);
    }
  });

  it('every recipe ingredient is a known id', () => {
    for (const r of RECIPES) for (const i of r.ingredients) expect(STOCKABLE_IDS.has(i.id) || STAPLE_IDS.has(i.id)).toBe(true);
  });

  it('every stockable id is used by at least one recipe', () => {
    const used = new Set(RECIPES.flatMap((r) => r.ingredients.map((i) => i.id)));
    for (const id of STOCKABLE_IDS) expect(used.has(id), id).toBe(true);
  });

  it('matches the §1.3 frequency table', () => {
    expect(DF.get('egg')).toBe(11);
    expect(DF.get('onion')).toBe(8);
    expect(DF.get('rice')).toBe(8);
    expect(DF.get('garlic')).toBe(7);
    expect(DF.get('soy_sauce')).toBe(7);
    expect([...DF.values()].filter((n) => n >= 2)).toHaveLength(24);
  });
});

describe('rank', () => {
  it('empty selection puts every recipe in later', () => {
    expect(rank(new Set()).every((x) => x.bucket === 'later')).toBe(true);
  });

  it('full pantry makes every recipe now with coverage 1', () => {
    for (const x of rank(ALL)) {
      expect(x.bucket).toBe('now');
      expect(x.coverage).toBe(1);
    }
  });

  it('never lists staples or optional ids as missing', () => {
    for (const x of rank(new Set())) {
      const opt = new Set(x.recipe.ingredients.filter((i) => i.optional).map((i) => i.id));
      for (const id of x.missing) {
        expect(STAPLE_IDS.has(id)).toBe(false);
        expect(opt.has(id)).toBe(false);
      }
    }
  });

  it('reproduces the §2.2 kimchi worked example top-3', () => {
    const out = rank(new Set(['rice', 'egg', 'spring_onion', 'kimchi', 'soy_sauce', 'sesame_oil']));
    expect(out.slice(0, 3).map((x) => x.recipe.id)).toEqual(['egg-fried-rice', 'kimchi-fried-rice', 'pan-fried-dumplings']);
    expect(out[0]?.bucket).toBe('now');
    expect(out[1]?.missing).toEqual(['gochujang']);
    expect(out[2]?.missing).toEqual(['gyoza']);
  });

  it('optional matches break ties', () => {
    const base = rank(new Set(['egg']));
    const withCorn = rank(new Set(['egg', 'corn']));
    const idx = (xs: typeof base, id: string) => xs.findIndex((x) => x.recipe.id === id);
    expect(idx(withCorn, 'frittata')).toBeLessThanOrEqual(idx(base, 'frittata'));
  });
});

describe('resolve', () => {
  it('maps aliases to canonical ids', () => {
    expect(resolve('chicken breast')[0]?.id).toBe('chicken');
    expect(resolve('  SCALLION ')[0]?.id).toBe('spring_onion');
    expect(resolve('wombok')[0]?.id).toBe('cabbage');
  });
  it('prefix matches names', () => {
    expect(resolve('gyo')[0]?.id).toBe('gyoza');
    expect(resolve('')).toEqual([]);
  });
});
