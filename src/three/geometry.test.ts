import { describe, expect, it } from 'vitest';
import { CapsuleGeometry, CylinderGeometry, LatheGeometry, SphereGeometry } from 'three';
import { geometryFor, hullFor } from './geometry';
import { PLUSH } from './plushSpecs';

describe('plush geometry', () => {
  it('uses the lower segment counts for small chips', () => {
    const sphere = geometryFor({ k: 'ball', s: [1, 1, 1] }) as SphereGeometry;
    expect(sphere.parameters.widthSegments).toBe(24);
    expect(sphere.parameters.heightSegments).toBe(16);
    const lathe = geometryFor({ k: 'lathe', pts: [[0, -1], [1, 0], [0, 1]] }) as LatheGeometry;
    expect(lathe.parameters.segments).toBe(24);
    const cylinder = geometryFor({ k: 'cyl', rt: 1, rb: 1, h: 1 }) as CylinderGeometry;
    expect(cylinder.parameters.radialSegments).toBe(24);
    const capsule = geometryFor({ k: 'capsule', r: 0.5, len: 1 }) as CapsuleGeometry;
    expect(capsule.parameters.capSegments).toBe(6);
    expect(capsule.parameters.radialSegments).toBe(16);
  });

  it('reuses geometry and ink hulls for identical shapes', () => {
    const first = geometryFor({ k: 'ball', s: [1, 1, 1] });
    const second = geometryFor({ k: 'ball', s: [1, 1, 1] });
    expect(first).toBe(second);
    expect(hullFor(first)).toBe(hullFor(second));
  });

  it('keeps every model finite with lower segment counts', () => {
    for (const spec of Object.values(PLUSH)) {
      for (const part of [spec.body, ...spec.parts ?? []]) {
        const positions = geometryFor(part.geo).getAttribute('position').array;
        expect(positions.length).toBeGreaterThan(0);
        expect(Array.from(positions).every(Number.isFinite)).toBe(true);
      }
    }
  });

  it('does not outline the bottle label, cheese holes, or steak stripe', () => {
    expect(PLUSH.soy_sauce?.parts?.[1]?.bare).toBe(true);
    expect(PLUSH.cheese?.parts?.every((part) => part.bare)).toBe(true);
    expect(PLUSH.steak?.parts?.[0]?.bare).toBe(true);
  });
});
