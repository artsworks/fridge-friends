import { describe, expect, it } from 'vitest';
import { modelFor } from './plushModel';
import { PLUSH } from './plushSpecs';

describe('merged plush models', () => {
  it('caches each model and merges surfaces that use the same color', () => {
    const spec = PLUSH.gyoza;
    if (!spec) throw new Error('Missing gyoza model');
    const gyoza = modelFor(spec);
    expect(modelFor(spec)).toBe(gyoza);
    expect(gyoza.surfaces).toHaveLength(1);
    expect(gyoza.ink.getAttribute('position').count).toBeGreaterThan(0);
    expect(gyoza.face.getAttribute('position').count).toBeGreaterThan(0);
  });

  it('creates finite merged geometry for every model', () => {
    for (const spec of Object.values(PLUSH)) {
      const model = modelFor(spec);
      for (const geometry of [model.ink, model.face, ...model.surfaces.map((surface) => surface.geometry)]) {
        expect(Array.from(geometry.getAttribute('position').array).every(Number.isFinite)).toBe(true);
      }
    }
  });

  it('reduces draw calls across the roster and keeps warmed geometry stable', () => {
    let previousDraws = 0;
    let mergedDraws = 0;
    for (const spec of Object.values(PLUSH)) {
      const parts = [spec.body, ...(spec.parts ?? [])];
      const model = modelFor(spec);
      previousDraws += parts.length + parts.filter((part) => !part.bare).length + 1;
      mergedDraws += model.surfaces.length + 2;
      for (let mount = 0; mount < 20; mount++) expect(modelFor(spec)).toBe(model);
    }
    expect(mergedDraws).toBeLessThan(previousDraws * 0.7);
  });
});
