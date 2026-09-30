import { STOCKABLE_IDS } from '../data/ingredients';
import { RECIPE_BY_ID } from '../data/recipes';
import type { Zone } from './types';

export const STORAGE_KEY = 'fridge-friends:v1';

export interface Persisted {
  bench: string[];
  openZone: Zone | null;
  celebrated: string[];
}

const ZONES: readonly (Zone | null)[] = ['fridge', 'pantry', 'freezer', null];

export function load(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    const d = data as Partial<Record<keyof Persisted, unknown>>;
    const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
    return {
      bench: [...new Set(strings(d.bench).filter((id) => STOCKABLE_IDS.has(id)))],
      openZone: ZONES.includes(d.openZone as Zone | null) ? (d.openZone as Zone | null) : 'fridge',
      celebrated: strings(d.celebrated).filter((id) => RECIPE_BY_ID.has(id)),
    };
  } catch {
    return null;
  }
}

export function save(state: Persisted): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked: the kitchen still works, it just forgets */
  }
}
