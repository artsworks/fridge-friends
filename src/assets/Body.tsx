import type { Part } from './shapes';
import { FILL, STROKE } from '../theme/tokens';

export function BodyParts({ parts }: { parts: Part[] }) {
  return (
    <>
      {parts.map((p, i) => {
        const line = p.line ?? 'main';
        return (
          <path
            key={i}
            d={p.d}
            fill={p.fill === 'none' ? 'none' : FILL[p.fill]}
            opacity={p.opacity}
            stroke={line === 'none' ? 'none' : p.ink ? FILL[p.ink] : STROKE.color}
            strokeWidth={line === 'detail' ? 2.4 : STROKE.w}
            strokeLinecap={STROKE.linecap}
            strokeLinejoin={STROKE.linejoin}
          />
        );
      })}
    </>
  );
}

export function Shine({ at }: { at?: readonly [number, number, number] }) {
  if (!at) return null;
  const [x, y, len] = at;
  return (
    <path
      d={`M${x} ${y + len}Q${x} ${y} ${x + len * 0.8} ${y - len * 0.2}`}
      stroke="#fff"
      strokeOpacity={0.85}
      strokeWidth={3.2}
      strokeLinecap="round"
      fill="none"
    />
  );
}
