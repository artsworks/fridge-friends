import type { Mood } from '../lib/types';
import { BODIES } from './bodies';
import { BodyParts, Shine } from './Body';
import { KawaiiFace } from './KawaiiFace';

interface Props {
  id: string;
  mood?: Mood;
  size?: number;
  /** render the in-zone variant when one exists (egg carton, freezer bags) */
  shelf?: boolean;
  title?: string;
  className?: string;
}

export function KawaiiFood({ id, mood = 'idle', size = 64, shelf = false, title, className }: Props) {
  const base = BODIES[id];
  if (!base) return null;
  const spec = shelf && base.shelf ? base.shelf : base;
  return (
    <svg
      viewBox="0 0 96 96"
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      overflow="visible"
    >
      <BodyParts parts={spec.paths} />
      <Shine at={spec.shine} />
      <KawaiiFace mood={mood} {...spec.face} tone={spec.tone} />
    </svg>
  );
}
