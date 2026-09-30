import confetti from 'canvas-confetti';
import { CONFETTI_COLORS } from '../theme/tokens';

export function burst(reduce: boolean): void {
  if (reduce) return;
  const base = { colors: CONFETTI_COLORS, disableForReducedMotion: true, scalar: 1.1, ticks: 160, zIndex: 60 };
  void confetti({ ...base, particleCount: 70, spread: 70, origin: { x: 0.35, y: 0.7 }, angle: 60 });
  void confetti({ ...base, particleCount: 70, spread: 70, origin: { x: 0.65, y: 0.7 }, angle: 120 });
}
