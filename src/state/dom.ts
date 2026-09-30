import type { Zone } from '../lib/types';

/** Live DOM anchors shared by the drag hit-test and chip flights. */
export const anchors: {
  bench: HTMLElement | null;
  zoneHeads: Map<Zone, HTMLElement>;
  chips: Map<string, HTMLElement>;
} = { bench: null, zoneHeads: new Map(), chips: new Map() };

export function insideBench(x: number, y: number): boolean {
  const r = anchors.bench?.getBoundingClientRect();
  return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

/** Where a bench item should fly back to: its shelf chip if visible, else its zone header. */
export function homeRect(id: string, zone: Zone): DOMRect | null {
  const chip = anchors.chips.get(id);
  if (chip && chip.offsetParent) return chip.getBoundingClientRect();
  return anchors.zoneHeads.get(zone)?.getBoundingClientRect() ?? null;
}
