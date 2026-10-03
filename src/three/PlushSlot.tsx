import { useReducedMotion } from 'motion/react';
import { lazy, Suspense } from 'react';
import { KawaiiFood } from '../assets/KawaiiFood';
import type { Mood } from '../lib/types';
import { useStage } from './Stage';

const PlushView = lazy(() => import('./PlushView'));

interface Props {
  id: string;
  mood: Mood;
  size: number;
  landed?: number;
  /** render SVG regardless of stage mode (A/B comparisons) */
  svg?: boolean;
}

/** A 3D PlushFriend when the shared canvas is live, otherwise the SVG twin. */
export function PlushSlot({ id, mood, size, landed = 0, svg = false }: Props) {
  const { mode } = useStage();
  const reduce = useReducedMotion() ?? false;
  const fallback = <KawaiiFood id={id} mood={mood} size={size} />;
  if (svg || mode !== '3d') return fallback;
  return (
    <Suspense fallback={fallback}>
      <PlushView id={id} mood={mood} size={size} landed={landed} reduce={reduce} />
    </Suspense>
  );
}
