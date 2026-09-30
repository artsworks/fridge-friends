import type { FillKey } from '../theme/tokens';

export type P = readonly [number, number];

const n = (v: number) => Math.round(v * 10) / 10;
const pt = (p: P) => `${n(p[0])} ${n(p[1])}`;

/** Closed Catmull-Rom spline through points: the organic "blob" primitive. */
export function smooth(pts: readonly P[], t = 1): string {
  const len = pts.length;
  let d = `M${pt(pts[0]!)}`;
  for (let i = 0; i < len; i++) {
    const p0 = pts[(i - 1 + len) % len]!;
    const p1 = pts[i]!;
    const p2 = pts[(i + 1) % len]!;
    const p3 = pts[(i + 2) % len]!;
    const c1: P = [p1[0] + ((p2[0] - p0[0]) * t) / 6, p1[1] + ((p2[1] - p0[1]) * t) / 6];
    const c2: P = [p2[0] - ((p3[0] - p1[0]) * t) / 6, p2[1] - ((p3[1] - p1[1]) * t) / 6];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return `${d}Z`;
}

/** Open Catmull-Rom spline (for detail strokes). */
export function curve(pts: readonly P[], t = 1): string {
  const len = pts.length;
  let d = `M${pt(pts[0]!)}`;
  for (let i = 0; i < len - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[Math.min(i + 2, len - 1)]!;
    const c1: P = [p1[0] + ((p2[0] - p0[0]) * t) / 6, p1[1] + ((p2[1] - p0[1]) * t) / 6];
    const c2: P = [p2[0] - ((p3[0] - p1[0]) * t) / 6, p2[1] - ((p3[1] - p1[1]) * t) / 6];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return d;
}

/** Polygon with every corner rounded by radius r (soft boxes, wedges, bottles). */
export function rpoly(pts: readonly P[], r = 6): string {
  const len = pts.length;
  let d = '';
  for (let i = 0; i < len; i++) {
    const prev = pts[(i - 1 + len) % len]!;
    const cur = pts[i]!;
    const next = pts[(i + 1) % len]!;
    const inLen = Math.hypot(cur[0] - prev[0], cur[1] - prev[1]);
    const outLen = Math.hypot(next[0] - cur[0], next[1] - cur[1]);
    const ri = Math.min(r, inLen / 2, outLen / 2);
    const a: P = [cur[0] + ((prev[0] - cur[0]) * ri) / inLen, cur[1] + ((prev[1] - cur[1]) * ri) / inLen];
    const b: P = [cur[0] + ((next[0] - cur[0]) * ri) / outLen, cur[1] + ((next[1] - cur[1]) * ri) / outLen];
    d += `${i === 0 ? 'M' : 'L'}${pt(a)}Q${pt(cur)} ${pt(b)}`;
  }
  return `${d}Z`;
}

export const rr = (x: number, y: number, w: number, h: number, r = 8): string =>
  rpoly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], r);

export const ell = (cx: number, cy: number, rx: number, ry: number): string =>
  `M${n(cx - rx)} ${n(cy)}a${n(rx)} ${n(ry)} 0 1 0 ${n(rx * 2)} 0a${n(rx)} ${n(ry)} 0 1 0 ${n(-rx * 2)} 0Z`;

export const circ = (cx: number, cy: number, r: number): string => ell(cx, cy, r, r);

export const line = (...pts: P[]): string => `M${pts.map(pt).join('L')}`;

export type Line = 'main' | 'detail' | 'none';

export interface Part {
  d: string;
  fill: FillKey | 'none';
  line?: Line;
  /** stroke colour override (defaults to the ink brown) */
  ink?: FillKey;
  opacity?: number;
}

export const F = (d: string, fill: FillKey): Part => ({ d, fill });
/** fill-only (no outline) — used for inner colour bands and to merge outlined unions */
export const S = (d: string, fill: FillKey, opacity?: number): Part =>
  opacity === undefined ? { d, fill, line: 'none' } : { d, fill, line: 'none', opacity };
/** thin detail stroke */
export const D = (d: string, ink?: FillKey): Part => (ink ? { d, fill: 'none', line: 'detail', ink } : { d, fill: 'none', line: 'detail' });

/** Outlined union: strokes every shape, then refills them so interior seams vanish. */
export const U = (fill: FillKey, ...ds: string[]): Part[] => [...ds.map((d) => F(d, fill)), ...ds.map((d) => S(d, fill))];
