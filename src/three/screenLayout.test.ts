import { describe, expect, it } from 'vitest';
import { isOnscreen, plushPixelScale, screenPosition } from './screenLayout';

describe('shared plush scene layout', () => {
  const canvas = { width: 1600, height: 1000 };

  it('maps DOM centers into an orthographic scene centered on the viewport', () => {
    expect(screenPosition({ left: 0, top: 0, width: 60, height: 60 }, canvas)).toEqual([-770, 470, 0]);
    expect(screenPosition({ left: 770, top: 470, width: 60, height: 60 }, canvas)).toEqual([0, 0, 0]);
    expect(screenPosition({ left: 1540, top: 940, width: 60, height: 60 }, canvas)).toEqual([770, -470, 0]);
  });

  it('preserves the previous perspective-view model scale', () => {
    expect(plushPixelScale(60)).toBeCloseTo(27.85, 1);
    expect(plushPixelScale(120)).toBeCloseTo(plushPixelScale(60) * 2, 8);
  });

  it('culls only slots outside the viewport', () => {
    expect(isOnscreen({ left: 10, right: 70, top: 10, bottom: 70 }, canvas)).toBe(true);
    expect(isOnscreen({ left: -60, right: 0, top: 10, bottom: 70 }, canvas)).toBe(true);
    expect(isOnscreen({ left: -61, right: -1, top: 10, bottom: 70 }, canvas)).toBe(false);
    expect(isOnscreen({ left: 10, right: 70, top: 1001, bottom: 1061 }, canvas)).toBe(false);
  });
});
