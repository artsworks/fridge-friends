import type { Region } from '../lib/types';

export type FlagId = 'australian' | Region;

/** Tiny hand-drawn flags: emoji flags render as boxes on many desktops. */
export function Flag({ id, size = 16 }: { id: FlagId; size?: number }) {
  const h = (size * 2) / 3;
  const frame = { x: 0.75, y: 0.75, width: 22.5, height: 14.5, rx: 3.5, fill: 'none', stroke: '#3A2E2A', strokeWidth: 1.5 };
  let body: JSX.Element;
  switch (id) {
    case 'australian':
      body = (
        <>
          <rect width={24} height={16} fill="#3B5BA9" />
          <path d="M1 1 L10 7 M10 1 L1 7" stroke="#fff" strokeWidth={1.6} />
          <path d="M5.5 0 V8 M0 4 H11" stroke="#F97B7B" strokeWidth={1.6} />
          <circle cx={18} cy={5} r={1.3} fill="#fff" />
          <circle cx={16} cy={11} r={1.3} fill="#fff" />
          <circle cx={20} cy={10} r={1} fill="#fff" />
          <circle cx={6} cy={12} r={1.6} fill="#fff" />
        </>
      );
      break;
    case 'japanese':
      body = (
        <>
          <rect width={24} height={16} fill="#fff" />
          <circle cx={12} cy={8} r={4.2} fill="#F25C66" />
        </>
      );
      break;
    case 'korean':
      body = (
        <>
          <rect width={24} height={16} fill="#fff" />
          <path d="M8 8 a4 4 0 0 1 8 0 Z" fill="#F25C66" />
          <path d="M8 8 a4 4 0 0 0 8 0 Z" fill="#3B5BA9" />
          <path d="M3 3 l3 2 M18 3 l3 -1.5 M3 13 l3 -2 M18 13 l3 1.5" stroke="#3A2E2A" strokeWidth={1.4} strokeLinecap="round" />
        </>
      );
      break;
    case 'chinese':
      body = (
        <>
          <rect width={24} height={16} fill="#EF5350" />
          <circle cx={5.5} cy={5} r={2.3} fill="#FFD97D" />
          <circle cx={10} cy={2.6} r={0.9} fill="#FFD97D" />
          <circle cx={11.5} cy={5} r={0.9} fill="#FFD97D" />
          <circle cx={10} cy={7.6} r={0.9} fill="#FFD97D" />
        </>
      );
      break;
    case 'southeast-asian':
      body = (
        <>
          <rect width={24} height={16} fill="#BFE0F0" />
          <path d="M5 11 q3 -6 7 -4 q3 1 5 -2 q2 3 -1 6 q-4 2 -11 0Z" fill="#9BD3A0" stroke="#3A2E2A" strokeWidth={1} />
          <circle cx={19} cy={4} r={2} fill="#FFD97D" />
        </>
      );
      break;
  }
  return (
    <svg viewBox="0 0 24 16" width={size} height={h} aria-hidden className="flag">
      <clipPath id={`flag-${id}`}>
        <rect x={0.75} y={0.75} width={22.5} height={14.5} rx={3.5} />
      </clipPath>
      <g clipPath={`url(#flag-${id})`}>{body}</g>
      <rect {...frame} />
    </svg>
  );
}
