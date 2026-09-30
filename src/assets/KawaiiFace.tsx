import { motion, useReducedMotion } from 'motion/react';
import { useMemo } from 'react';
import type { Mood } from '../lib/types';
import { FACE, FILL } from '../theme/tokens';

interface Props {
  mood?: Mood;
  x?: number;
  y?: number;
  s?: number;
  /** light eyes for dark bodies (soy sauce, nori…) */
  tone?: 'dark';
  blink?: boolean;
}

const EX = 10;

function Star({ cx }: { cx: number }) {
  const r1 = 5.2;
  const r2 = 2.2;
  const pts = Array.from({ length: 8 }, (_, i) => {
    const r = i % 2 ? r2 : r1;
    const a = (Math.PI / 4) * i - Math.PI / 2;
    return `${(cx + Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`;
  }).join(' ');
  return <polygon points={pts} fill={FACE.sparkle} stroke={FACE.eye} strokeWidth={1.4} strokeLinejoin="round" />;
}

export function KawaiiFace({ mood = 'idle', x = 48, y = 56, s = 1, tone, blink = true }: Props) {
  const reduce = useReducedMotion();
  const ink = tone === 'dark' ? FILL.cream : FACE.eye;
  const blushColor = mood === 'frost' ? '#A9D4F0' : FACE.blush;
  const blushOpacity = mood === 'shock' ? 0 : mood === 'excited' ? 1 : 0.85;
  const canBlink = blink && !reduce && (mood === 'idle' || mood === 'happy');
  const delay = useMemo(() => 4 + Math.random() * 3, []);
  const stroke = { stroke: ink, strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const;

  const dotEyes = (big = false) => (
    <>
      {[-EX, EX].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={0} rx={big ? 4 : 3.3} ry={big ? 4.6 : 4} fill={ink} />
          {tone !== 'dark' && <circle cx={cx + 1.2} cy={-1.5} r={big ? 1.5 : 1.2} fill="#fff" />}
        </g>
      ))}
    </>
  );

  let eyes: JSX.Element;
  switch (mood) {
    case 'excited':
      eyes = (
        <>
          <Star cx={-EX} />
          <Star cx={EX} />
        </>
      );
      break;
    case 'bliss':
      eyes = <path d={`M${-EX - 4} 1 Q${-EX} -4 ${-EX + 4} 1 M${EX - 4} 1 Q${EX} -4 ${EX + 4} 1`} {...stroke} />;
      break;
    case 'sleepy':
      eyes = <path d={`M${-EX - 4} 0.5 H${-EX + 4} M${EX - 4} 0.5 H${EX + 4}`} {...stroke} />;
      break;
    case 'frost':
      eyes = (
        <path
          d={`M${-EX - 3.5} -3 L${-EX + 2.5} 0 L${-EX - 3.5} 3 M${EX + 3.5} -3 L${EX - 2.5} 0 L${EX + 3.5} 3`}
          {...stroke}
        />
      );
      break;
    case 'shock':
      eyes = dotEyes(true);
      break;
    default:
      eyes = dotEyes();
  }

  let mouth: JSX.Element;
  switch (mood) {
    case 'happy':
    case 'excited':
      mouth = (
        <g>
          <path d="M-4.5 4 Q0 4.6 4.5 4 Q4 10 0 10 Q-4 10 -4.5 4Z" fill={ink} stroke={ink} strokeWidth={1.2} strokeLinejoin="round" />
          <path d="M-2.2 8.4 Q0 6.6 2.2 8.4 Q0 9.8 -2.2 8.4Z" fill="#F58B9C" />
        </g>
      );
      break;
    case 'bliss':
      mouth = <path d="M-5 4 Q-2.5 7.5 0 4.5 Q2.5 7.5 5 4" {...stroke} />;
      break;
    case 'sleepy':
      mouth = <ellipse cx={0} cy={6} rx={1.8} ry={2} fill={ink} />;
      break;
    case 'frost':
      mouth = <path d="M-5 6 q1.25 -2 2.5 0 t2.5 0 t2.5 0 t2.5 0" {...stroke} />;
      break;
    case 'shock':
      mouth = <ellipse cx={0} cy={7} rx={2.8} ry={3.4} fill={ink} />;
      break;
    default:
      mouth = <path d="M-3.6 4.2 Q0 7.8 3.6 4.2" {...stroke} />;
  }

  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={-17} cy={6} rx={5} ry={3} fill={blushColor} opacity={blushOpacity} />
      <ellipse cx={17} cy={6} rx={5} ry={3} fill={blushColor} opacity={blushOpacity} />
      {canBlink ? (
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 0.18, repeat: Infinity, repeatDelay: delay, delay }}
        >
          {eyes}
        </motion.g>
      ) : (
        eyes
      )}
      {mouth}
    </g>
  );
}
