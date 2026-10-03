import type { CSSProperties, ReactNode } from 'react';
import { KawaiiFood } from '../assets/KawaiiFood';
import type { CookTool } from '../lib/types';

const INK = '#3A2E2A';

const TOOLS: Record<CookTool, { label: string; art: ReactNode }> = {
  wok: {
    label: 'Tossing it in the wok!',
    art: (
      <>
        <path d="M14 38h132c-6 30-34 44-66 44S20 68 14 38z" fill="#6B6B78" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M146 44h12" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        <path d="M58 86q8-10 4-20M80 88q8-12 4-24M102 86q8-10 4-20" className="cook-flame" stroke="#FF8A5C" strokeWidth="5" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  pan: {
    label: 'Sizzling in the pan!',
    art: (
      <>
        <path d="M18 52h104v8c0 12-10 20-22 20H40c-12 0-22-8-22-20z" fill="#6B6B78" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M122 58h34" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      </>
    ),
  },
  pot: {
    label: 'Simmering in the pot!',
    art: (
      <>
        <rect x="34" y="40" width="92" height="44" rx="10" fill="#E86A4A" stroke={INK} strokeWidth="4" />
        <path d="M24 46h112" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <path d="M60 30q-6-8 0-16M80 30q-6-8 0-16M100 30q-6-8 0-16" className="cook-steam" stroke="#BFE0F0" strokeWidth="5" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  oven: {
    label: 'Baking in the oven!',
    art: (
      <>
        <rect x="26" y="8" width="108" height="78" rx="10" fill="#FFF9EE" stroke={INK} strokeWidth="4" />
        <rect x="40" y="28" width="80" height="46" rx="6" className="cook-glow" fill="#FFD97D" stroke={INK} strokeWidth="4" />
        <circle cx="50" cy="18" r="3.5" fill={INK} />
        <circle cx="64" cy="18" r="3.5" fill={INK} />
      </>
    ),
  },
  bowl: {
    label: 'Arranging it in the bowl!',
    art: (
      <>
        <path d="M20 44h120c0 24-26 40-60 40S20 68 20 44z" fill="#BFE0F0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M60 84h40" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      </>
    ),
  },
};

export function CookScene({ tool, ids }: { tool: CookTool; ids: string[] }) {
  const { label, art } = TOOLS[tool];
  return (
    <div className={`cook cook--${tool}`}>
      <div className="cook-food" aria-hidden>
        {ids.slice(0, 8).map((id, i) => (
          <span key={id} style={{ '--i': i } as CSSProperties}>
            <KawaiiFood id={id} size={34} mood="excited" />
          </span>
        ))}
      </div>
      <svg className="cook-tool" viewBox="0 0 160 90" width="200" height="112" aria-hidden>
        {art}
      </svg>
      <p className="cook-caption" role="status">
        {label}
      </p>
    </div>
  );
}
