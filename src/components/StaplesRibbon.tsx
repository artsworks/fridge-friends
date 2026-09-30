import { KawaiiFood } from '../assets/KawaiiFood';
import { STAPLES } from '../data/staples';

export function StaplesRibbon() {
  return (
    <div className="staples" role="note" aria-label="Staples assumed: salt, pepper, water and oil">
      <span className="staples-label">Always in the kitchen</span>
      {STAPLES.map((s) => (
        <span key={s.id} className="staple" title={`${s.name} is assumed`}>
          <KawaiiFood id={s.id} size={26} mood="happy" /> {s.name}
        </span>
      ))}
    </div>
  );
}
