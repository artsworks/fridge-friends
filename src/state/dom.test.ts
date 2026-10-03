import { afterEach, describe, expect, it } from 'vitest';
import { anchors, insideBench } from './dom';

afterEach(() => { anchors.bench = null; });

describe('insideBench', () => {
  it('rejects drops when the bench is not mounted', () => {
    expect(insideBench(100, 200)).toBe(false);
  });

  it('compares client coordinates with the current viewport rectangle', () => {
    let top = 200;
    anchors.bench = {
      getBoundingClientRect: () => ({ left: 100, right: 400, top, bottom: top + 100 }),
    } as HTMLElement;
    expect(insideBench(150, 250)).toBe(true);
    expect(insideBench(99, 250)).toBe(false);
    expect(insideBench(150, 301)).toBe(false);
    top = 50;
    expect(insideBench(150, 75)).toBe(true);
    expect(insideBench(150, 250)).toBe(false);
  });

  it('includes the edges of the drop target', () => {
    anchors.bench = {
      getBoundingClientRect: () => ({ left: 100, right: 400, top: 200, bottom: 300 }),
    } as HTMLElement;
    expect(insideBench(100, 200)).toBe(true);
    expect(insideBench(400, 300)).toBe(true);
  });
});
