import type { Ingredient } from '../lib/types';

export const STAPLES: Ingredient[] = [
  { id: 'salt', name: 'Salt', cat: 'staple', zone: 'pantry', aliases: [], staple: true },
  { id: 'pepper', name: 'Pepper', cat: 'staple', zone: 'pantry', aliases: [], staple: true },
  { id: 'water', name: 'Water', cat: 'staple', zone: 'pantry', aliases: [], staple: true },
  { id: 'oil', name: 'Oil', cat: 'staple', zone: 'pantry', aliases: [], staple: true },
];

export const STAPLE_IDS: ReadonlySet<string> = new Set(STAPLES.map((s) => s.id));
