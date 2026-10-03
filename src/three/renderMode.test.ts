import { describe, expect, it } from 'vitest';
import { initialMode } from './renderMode';

describe('initialMode', () => {
  it('defaults to SVG even when WebGL2 is available', () => {
    expect(initialMode('', true)).toEqual({ mode: 'svg', reason: 'default' });
    expect(initialMode('?fps&stress', true).mode).toBe('svg');
  });

  it.each(['?3d', '?plush', '?losecontext'])('opts into 3D for %s', (search) => {
    expect(initialMode(search, true)).toEqual({ mode: '3d', reason: null });
  });

  it.each(['?svg&3d', '?svg&plush', '?svg&losecontext'])('gives SVG priority for %s', (search) => {
    expect(initialMode(search, true)).toEqual({ mode: 'svg', reason: 'forced by ?svg' });
  });

  it('falls back without WebGL2', () => {
    expect(initialMode('?3d', false)).toEqual({ mode: 'svg', reason: 'no WebGL2' });
  });
});
