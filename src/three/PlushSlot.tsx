import { View } from '@react-three/drei';
import { useReducedMotion } from 'motion/react';
import { KawaiiFood } from '../assets/KawaiiFood';
import type { Mood } from '../lib/types';
import { PlushScene } from './PlushFriend';
import { PLUSH } from './plushSpecs';
import { useStage } from './Stage';

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
  if (svg || mode !== '3d' || !PLUSH[id]) return <KawaiiFood id={id} mood={mood} size={size} />;
  return (
    <span className="plush-slot" style={{ width: size, height: size }} aria-hidden>
      <View className="plush-view" style={{ width: size * 1.2, height: size * 1.2 }}>
        <PlushScene id={id} mood={mood} landed={landed} reduce={reduce} />
      </View>
    </span>
  );
}
