import { motion, useReducedMotion } from 'motion/react';
import type { Mood } from '../lib/types';
import { BodyParts, Shine } from './Body';
import { DISHES } from './dishes';
import { KawaiiFace } from './KawaiiFace';

interface Props {
  id: string;
  size?: number;
  mood?: Mood;
  className?: string;
}

const WISPS = [30, 48, 66];

export function KawaiiDish({ id, size = 96, mood = 'happy', className }: Props) {
  const reduce = useReducedMotion();
  const spec = DISHES[id];
  if (!spec) return null;
  return (
    <svg viewBox="0 0 96 96" width={size} height={size} className={className} aria-hidden overflow="visible">
      {spec.steam &&
        WISPS.map((x, i) => (
          <motion.path
            key={x}
            d={`M${x} 26 q-4 -6 0 -12 t0 -12`}
            stroke="#C9B6A4"
            strokeWidth={2.4}
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0.5, y: 0 }}
            animate={reduce ? { opacity: 0.45 } : { opacity: [0, 0.7, 0], y: [4, -4, -10] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
          />
        ))}
      <BodyParts parts={spec.paths} />
      <Shine at={spec.shine} />
      <KawaiiFace mood={mood} {...spec.face} tone={spec.tone} />
    </svg>
  );
}
