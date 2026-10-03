export type RenderMode = '3d' | 'svg';

export interface StageState {
  mode: RenderMode;
  reason: string | null;
}

export function initialMode(search: string, webgl2: boolean): StageState {
  const params = new URLSearchParams(search);
  if (params.has('svg')) return { mode: 'svg', reason: 'forced by ?svg' };
  if (!params.has('3d') && !params.has('plush') && !params.has('losecontext')) {
    return { mode: 'svg', reason: 'default' };
  }
  if (!webgl2) return { mode: 'svg', reason: 'no WebGL2' };
  return { mode: '3d', reason: null };
}
