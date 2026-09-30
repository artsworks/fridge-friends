import { motion } from 'motion/react';

const R = 17;
const C = 2 * Math.PI * R;

export function MatchRing({ value, size = 44 }: { value: number; size?: number }) {
  const pct = Math.round(value * 100);
  const color = value >= 1 ? '#6FBF78' : value >= 0.6 ? '#FFC93C' : '#FF8A5C';
  return (
    <svg viewBox="0 0 44 44" width={size} height={size} className="ring" role="img" aria-label={`${pct}% match`}>
      <circle cx={22} cy={22} r={R} fill="#FFF6E9" stroke="#F0E2CF" strokeWidth={5} />
      <motion.circle
        cx={22}
        cy={22}
        r={R}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={C}
        initial={false}
        animate={{ strokeDashoffset: C * (1 - value), stroke: color }}
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
        transform="rotate(-90 22 22)"
      />
      <text x={22} y={26} textAnchor="middle" fontSize={11} fontWeight={800} fill="#3A2E2A">
        {pct}
      </text>
    </svg>
  );
}
